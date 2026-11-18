/*
 * Teoría de «Razonamiento numérico» (aritmetica.razonamiento-numerico). Molde: docs/teoria.md; forma de porcentajes.js.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 19) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: RM3 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: que cada «método» de razonamiento numérico se vea como una relación que se puede comprobar, no como un truco.
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: resuelve con falsa suposición, método regresivo, edades, móviles y criptoaritmética, y decide
 *     si unos datos bastan mostrando dos casos compatibles con respuestas distintas.
 *   Orden de atención: 1.º la figura (tiras, tabla o recta) · 2.º lo que se mantiene fijo (cambio por canje, diferencia,
 *     rapidez relativa) · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué funciona la falsa suposición?» y «¿cuándo un dato alcanza?».
 * Colores (regla 4): la incógnita naranja (c-o), lo que cambia por paso turquesa (c-i), el tiempo rojo (c-h),
 * el total o el resultado verde (c-d).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const X = { v: 'c-o', t: 'x' }, T = { v: 'c-d', t: 'T' }, t = { v: 'c-h', t: 't' }, D = { v: 'c-i', t: 'd' };
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
      if (vistos.has(txt) || (typeof x.valor === 'number' && (!Number.isFinite(x.valor) || x.valor < 0))) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }

  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría de la pieza (arit-tiras: x y deX; recta: x y
  // filaY con la inversa lineal); el lector ajusta cada valor al paso y al rango de su control.
  const TIRAS = () => Kit.piezas['arit-tiras'], RECTA = () => Kit.piezas.recta;
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));
  const NB = '\u00a0';   // espacio duro: «S/ 8» no se parte

  // ---------- Idea 1: falsa suposición = cambio constante por canje ----------
  // Cambia: cuántas entradas son caras. Permanece: 12 entradas y la meta de S/ 81. Progresa: todas baratas → cada canje suma 3.
  // Se reserva: dividir lo que falta entre la diferencia de precios. Debe verse: cada canje agrega el mismo pedazo.
  const tirasCanje = (n, a, b, k, meta, conMeta = true) => ({
    max: Math.max(meta, n * b) * 1.05, filas: 2,
    tiras: [
      { rotulo: `${n - k} de ${a} y ${k} de ${b}`, color: 'd', fin: `${(n - k) * a + k * b}`, tramos: [{ valor: (n - k) * a, partes: n - k, color: 'o' }, ...(k ? [{ valor: k * b, partes: k, color: 'i' }] : [])] },
      ...(conMeta ? [{ rotulo: 'meta', color: 'd', fin: `${meta}`, tramos: [{ valor: meta, color: 'd', relleno: 0.08 }] }] : []),
    ],
  });
  const falsa = {
    id: 'falsa-suposicion',
    titulo: 'Suponer todo igual y corregir',
    temas: ['Falsa suposición'],
    pieza: 'arit-tiras',
    // Lee (fase 2): contexto y vocabulario, sin decir cuánto suma cada canje ni cómo se divide (eso es Predice y Mira).
    lee: {
      tarjetas: [
        { titulo: 'Dos precios', texto: 'En la feria de Juliaca, las entradas al concierto cuestan S/ 5 en general y S/ 8 junto al escenario. Si sabes cuántas se vendieron y cuánto se juntó, ¿puedes saber cuántas eran de cada precio? Así son estos problemas.' },
        { titulo: 'Qué es un canje', texto: 'Un canje es cambiar una cosa de un tipo por una del otro, sin cambiar cuántas hay. Las 12 entradas siguen siendo 12: solo una de ellas pasa a tener el otro precio.' },
        { titulo: 'Qué mirar al jugar', texto: 'La primera tira es lo que se paga y la segunda, la meta de S/ 81. Haz un canje a la vez y fíjate cuánto se alarga la primera tira cada vez.' },
      ],
    },
    juega: {
      consigna: 'Se compraron 12 entradas de S/ 5 o S/ 8 y se pagó S/ 81. Cambia cuántas son de S/ 8 hasta la meta.',
      voz: 'Mira cuánto crece la tira con cada entrada que cambias.',
      controles: [{ id: 'k', etiqueta: 'Entradas de S/ 8', color: 'c-i', min: 0, max: 12, paso: 1, inicio: 0, unidad: '', decimales: 0 }],
      dibujo: v => ({ datos: tirasCanje(12, 5, 8, v.k, 81), estado: {} }),
      lectura: v => [T, ` = 60 + 3 · ${v.k} = ${60 + 3 * v.k}${NB}soles`],
      minimo: 3,
      // Se estira la tira del pago hasta la meta: cada entrada que se cambia la alarga 3.
      arrastres: [{ id: 'pago', etiqueta: 'fin de la tira del pago', color: 'c-i',
        donde: v => { const g = TIRAS().geometria(tirasCanje(12, 5, 8, v.k, 81)); return { x: g.x(60 + 3 * v.k), y: g.centroY(0) }; },
        mover: pt => ({ k: (TIRAS().geometria(tirasCanje(12, 5, 8, 0, 81)).deX(pt.x) - 60) / 3 }) }],
    },
    predice: {
      pregunta: '20 animales, entre gallinas (2 patas) y conejos (4 patas), suman 56 patas. ¿Cuántos conejos hay?',
      opciones: [
        { id: 'c', texto: '8 conejos', correcta: true },
        { id: 'gallinas', texto: '12 conejos', error: 'AT-PREGUNTA', siFuera: '12 son las gallinas; se preguntó por los conejos.' },
        { id: 'divide4', texto: '4 conejos', error: 'AT-FALSA', siFuera: 'Eso divide 16 entre 4 patas; cada canje agrega solo 2 patas.' },
        { id: 'mitad', texto: '10 conejos', error: 'AT-FALSA', siFuera: 'Mitad y mitad darían 60 patas, no 56.' },
      ],
      dibujo: { datos: tirasCanje(20, 2, 4, 0, 56), estado: {} },
      revelar: { datos: tirasCanje(20, 2, 4, 8, 56), estado: {} },
      coincide: 'Coincide: todas gallinas dan 40 patas; faltan 16, y cada conejo agrega 2.',
    },
    mira: {
      datos: { max: 84, filas: 3, tiras: [
        { rotulo: 'todas de S/ 5', color: 'd', fin: '60', tramos: [{ valor: 60, partes: 12, color: 'o' }] },
        { rotulo: 'meta', color: 'd', fin: '81', paso: 1, tramos: [{ valor: 60, color: 'd', relleno: 0.08 }, { valor: 21, color: 'h', texto: 'faltan 21' }] },
        { rotulo: '5 de S/ 5 y 7 de S/ 8', color: 'd', fin: '81', paso: 2, tramos: [{ valor: 25, partes: 5, color: 'o' }, { valor: 56, partes: 7, color: 'i' }] },
      ] },
      pasos: [
        { estado: { paso: 0 }, texto: 'Se supone que las 12 son de S/ 5: se pagarían S/ 60.', ecuacion: ['12 · 5 = 60'] },
        { estado: { paso: 1 }, texto: 'Faltan 21 soles para la meta.', ecuacion: ['81 − 60 = 21'] },
        { estado: { paso: 2 }, texto: 'Cambiar una de 5 por una de 8 suma 3: hacen falta 7 cambios.', ecuacion: [{ frac: ['21', '8 − 5'] }, ' = 7 entradas de S/ 8'] },
      ],
    },
    regla: {
      texto: 'Falsa suposición: se supone que todos son del tipo más barato. Lo que falta para el total, dividido entre lo que agrega cada canje, da cuántos son del otro tipo.',
      ecuacion: [{ sub: ['n', 'b'] }, ' = ', { frac: [[{ llave: [T, ' − n · a'], nota: 'lo que falta', color: 'c-d' }], [{ llave: ['b − a'], nota: 'cada canje', color: 'c-i' }]] }],
      condicion: 'cada canje cambia el total en la misma cantidad b − a; es una ecuación lineal escrita de otra forma.',
    },
    // Así se resuelve (fase 2): el mismo problema de «Ahora tú», con otras semillas, resuelto paso a paso.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), n = r.ent(10, 30), [a, b] = r.de([[2, 4], [5, 8], [10, 20], [3, 7], [20, 50], [1, 5]]);
        const k = r.ent(2, n - 2), Tot = (n - k) * a + k * b;
        const ctx = r.de([['monedas de', 'y de', 'soles', 'monedas'], ['entradas de', 'y de', 'soles', 'entradas'], ['cajas de', 'y de', 'kilos', 'cajas']]);
        const base = n * a, falta = Tot - base, cambio = b - a;
        return {
          enunciado: [`${n} ${ctx[3]}, unas de ${a} y otras de ${b} ${ctx[2]}, suman `, { v: 'c-d', t: String(Tot) }, ` ${ctx[2]}. ¿Cuántas son de ${b}?`],
          dibujo: { datos: tirasCanje(n, a, b, 0, Tot), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden cuántas de las ${n} ${ctx[3]} son de ${b} ${ctx[2]}.` },
            { tipo: 'datos', texto: [`Hay ${n} ${ctx[3]}, cada una de ${a} o de ${b} ${ctx[2]}, y entre todas suman `, { v: 'c-d', t: String(Tot) }, '.'] },
            { tipo: 'regla', texto: `Supongo que todas son de ${a}. Cada vez que cambio una de ${a} por una de ${b}, el total sube siempre lo mismo: ${cambio}.` },
            { tipo: 'cuentas', texto: `Todas de ${a} darían ${base}; faltan ${falta}. Divido lo que falta entre lo que sube cada cambio.`,
              ecuacion: [`${n} · ${a} = ${base}`, '   ·   ', `(${Tot} − ${base}) ÷ ${cambio} = ${k}`], dibujo: { datos: tirasCanje(n, a, b, k, Tot), estado: {} } },
            { tipo: 'sentido', texto: `Comprueba: ${n - k} de ${a} y ${k} de ${b} son ${n} ${ctx[3]}, y suman ${(n - k) * a} + ${k * b} = ${(n - k) * a + k * b}. Cuadra.` },
          ],
          respuesta: `${k} ${ctx[3]} de ${b} ${ctx[2]}`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.ent(10, 30), [a, b] = r.de([[2, 4], [5, 8], [10, 20], [3, 7], [20, 50], [1, 5]]);
        const k = r.ent(2, n - 2), Tot = (n - k) * a + k * b;
        const ctx = r.de([['monedas de', 'y de', 'soles', 'monedas'], ['entradas de', 'y de', 'soles', 'entradas'], ['cajas de', 'y de', 'kilos', 'cajas']]);
        return {
          pregunta: [`${n} ${ctx[3]}, unas de ${a} y otras de ${b} ${ctx[2]}, suman `, { v: 'c-d', t: String(Tot) }, ` ${ctx[2]}. ¿Cuántas son de ${b}?`],
          opciones: opciones(k, [
            { id: 'otras', valor: n - k, error: 'AT-PREGUNTA', siFuera: `Esas son las de ${a}.` },
            { id: 'divide-b', valor: Math.round((Tot - n * a) / b), error: 'AT-FALSA', siFuera: `Cada canje agrega ${b - a}, no ${b}.` },
            { id: 'total-b', valor: Math.floor(Tot / b), error: 'AT-FALSA', siFuera: `Eso supone que todas son de ${b}.` },
          ], z => String(z)),
          solucion: { texto: `Todas de ${a} darían ${n * a}; cada canje suma ${b - a}.`, ecuacion: [`(${Tot} − ${n * a}) ÷ ${b - a} = ${k}`], dibujo: { datos: tirasCanje(n, a, b, k, Tot), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: método regresivo ----------
  // Cambia: el número pensado. Permanece: la cadena de operaciones. Progresa: ida por la tabla → vuelta de abajo hacia arriba.
  // Se reserva: cada operación se deshace con su inversa y en orden contrario. Debe verse: la última operación es la primera que se deshace.
  const INV = { '×': '÷', '÷': '×', '+': '−', '−': '+' };
  const aplicar = (x, [op, k]) => (op === '×' ? x * k : op === '÷' ? x / k : op === '+' ? x + k : x - k);
  const tablaCadena = (x0, ops, vuelta = false) => {
    const vals = [x0];
    for (const o of ops) vals.push(aplicar(vals[vals.length - 1], o));
    const filas = ops.map((o, i) => [{ t: f(vals[i]), color: i === 0 ? 'o' : undefined }, { t: `${o[0]} ${o[1]}`, color: 'i' }, { t: f(vals[i + 1]), color: i === ops.length - 1 ? 'd' : undefined }, { t: `${INV[o[0]]} ${o[1]}`, color: 'h', paso: vuelta ? ops.length - i : 0 }]);
    return { columnas: [{ t: 'antes' }, { t: 'operación', color: 'i' }, { t: 'después' }, { t: 'se deshace', color: 'h' }], filas, filasMax: 4 };
  };
  const OPS = [['×', 3], ['−', 5], ['÷', 2]];
  const regresivo = {
    id: 'regresivo',
    titulo: 'Deshacer de atrás hacia adelante',
    temas: ['Método regresivo'],
    pieza: 'arit-tabla',
    // Lee (fase 2): qué es una operación inversa, sin decir en qué orden se deshacen (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'Un número escondido', texto: 'Un amigo piensa un número, le hace varias cuentas y solo te dice el resultado. Parece magia adivinar su número, pero no lo es: las cuentas dejan huella y se pueden desandar.' },
        { titulo: 'La operación inversa', texto: 'Cada operación tiene otra que la deshace. Si a un número le sumas 10, restarle 10 te devuelve al de antes. Si lo multiplicas por 3, dividirlo entre 3 también. Esa pareja es una operación inversa.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cada fila de la tabla es una operación: lo que había antes, la operación y lo que quedó después. La columna roja dice qué la deshace. Cambia el número y sigue cada fila.' },
      ],
    },
    juega: {
      consigna: 'Elige un número. La tabla lo multiplica por 3, le resta 5 y lo divide entre 2. Mira la columna que deshace.',
      voz: 'Lee la última fila primero: es lo primero que se deshace.',
      controles: [{ id: 'x', etiqueta: 'x', color: 'c-o', min: 3, max: 21, paso: 2, inicio: 7, unidad: '', decimales: 0 }],
      dibujo: v => ({ datos: tablaCadena(v.x, OPS), estado: { paso: 9 } }),
      lectura: v => [X, ` = ${v.x} → resultado ${f((v.x * 3 - 5) / 2)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Pensé un número, lo multipliqué por 4, le sumé 6 y obtuve 50. ¿Qué número pensé?',
      opciones: [
        { id: 'c', texto: '11', correcta: true },
        { id: 'orden', texto: '18,5', error: 'AT-DESHACER-ORDEN', siFuera: 'Eso deshace primero el × 4. Se deshace al revés: primero el + 6.' },
        { id: 'noinv', texto: '206', error: 'AT-INVERSA', siFuera: 'Eso repite las operaciones; hay que usar las inversas.' },
        { id: 'solo', texto: '12,5', error: 'AT-INVERSA', siFuera: '50 ÷ 4 olvida deshacer el + 6.' },
      ],
      dibujo: { datos: { columnas: [{ t: 'antes' }, { t: 'operación', color: 'i' }, { t: 'después' }], filas: [[{ t: '?', color: 'o' }, { t: '× 4', color: 'i' }, '?'], ['?', { t: '+ 6', color: 'i' }, { t: '50', color: 'd' }]], filasMax: 2 }, estado: {} },
      revelar: { datos: tablaCadena(11, [['×', 4], ['+', 6]], true), estado: { paso: 9 } },
      coincide: 'Coincide: 50 − 6 = 44 y 44 ÷ 4 = 11.',
    },
    mira: {
      datos: tablaCadena(11, [['×', 4], ['+', 6]], true),
      pasos: [
        { estado: { paso: 0 }, texto: 'Ida: el número pasa por × 4 y después por + 6.', ecuacion: [X, ' → × 4 → + 6 → 50'] },
        { estado: { paso: 1, fila: 1 }, texto: 'Lo último que se hizo fue + 6: se deshace primero.', ecuacion: ['50 − 6 = 44'] },
        { estado: { paso: 2, fila: 0 }, texto: 'Luego se deshace el × 4.', ecuacion: ['44 ÷ 4 = 11'] },
        { estado: { paso: 2 }, texto: 'Se comprueba yendo de ida.', ecuacion: ['11 · 4 + 6 = 50'] },
      ],
    },
    regla: {
      texto: 'Método regresivo: para hallar el inicio se parte del final y se aplica la operación inversa de cada paso, en orden contrario. Siempre se comprueba de ida.',
      ecuacion: ['× ↔ ÷', '   ·   ', '+ ↔ −', '   ·   ', 'último → primero'],
      condicion: 'cada operación es invertible en el dominio: no se multiplica por 0 y las divisiones quedan dentro de los números permitidos.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), x0 = r.ent(2, 20);
        const ops = [['×', r.ent(2, 5)], r.de([['+', r.ent(3, 15)], ['−', r.ent(1, 2 * x0 - 1)]]), ['×', r.ent(2, 3)]];
        if (s % 2) ops[2] = ops[1][0] === '+' ? ['−', r.ent(1, 9)] : ['+', r.ent(4, 12)];
        const vals = [x0]; for (const o of ops) vals.push(aplicar(vals[vals.length - 1], o));
        const v = vals[ops.length];
        const verbo = o => (o[0] === '×' ? 'lo multipliqué por' : o[0] === '+' ? 'le sumé' : o[0] === '−' ? 'le resté' : 'lo dividí entre');
        const vuelta = []; let u = v;
        for (const o of ops.slice().reverse()) { const w = aplicar(u, [INV[o[0]], o[1]]); vuelta.push(`${f(u)} ${INV[o[0]]} ${o[1]} = ${f(w)}`); u = w; }
        const incognita = { columnas: [{ t: 'antes' }, { t: 'operación', color: 'i' }, { t: 'después' }],
          filas: ops.map((o, i) => [i === 0 ? { t: '?', color: 'o' } : '?', { t: `${o[0]} ${o[1]}`, color: 'i' }, i === ops.length - 1 ? { t: f(v), color: 'd' } : '?']), filasMax: 4 };
        return {
          enunciado: [`Pensé un número, ${ops.map(o => `${verbo(o)} ${o[1]}`).join(', ')} y obtuve `, { v: 'c-d', t: f(v) }, '. ¿Qué número pensé?'],
          dibujo: { datos: incognita, estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden el número del inicio, ', X, ', el que se pensó antes de hacer las cuentas.'] },
            { tipo: 'datos', texto: ['Conozco el resultado final, ', { v: 'c-d', t: f(v) }, ', y las tres operaciones en el orden en que se hicieron.'],
              ecuacion: [X, ` → ${ops.map(o => `${o[0]} ${o[1]}`).join(' → ')} → ${f(v)}`] },
            { tipo: 'regla', texto: 'Parto del resultado y deshago cada operación con su inversa. Empiezo por la última que se hizo y termino con la primera.' },
            { tipo: 'cuentas', texto: 'Voy de abajo hacia arriba en la tabla, usando la columna que deshace.',
              ecuacion: [vuelta.join('   ·   ')], dibujo: { datos: tablaCadena(x0, ops, true), estado: { paso: 9 } } },
            { tipo: 'sentido', texto: `Comprueba de ida: con ${x0} se hacen las tres operaciones y se llega a ${f(v)}. Cuadra.`,
              ecuacion: [ops.map((o, i) => `${f(vals[i])} ${o[0]} ${o[1]} = ${f(vals[i + 1])}`).join('   ·   ')] },
          ],
          respuesta: [X, ` = ${x0}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), x0 = r.ent(2, 20);
        const ops = [['×', r.ent(2, 5)], r.de([['+', r.ent(3, 15)], ['−', r.ent(1, 2 * x0 - 1)]]), ['×', r.ent(2, 3)]];
        if (s % 2) ops[2] = ops[1][0] === '+' ? ['−', r.ent(1, 9)] : ['+', r.ent(4, 12)];
        let v = x0; for (const o of ops) v = aplicar(v, o);
        const mal = ops.reduce((u, o) => aplicar(u, [INV[o[0]], o[1]]), v);   // deshace en el mismo orden
        const txt = ops.map(o => `${o[0] === '×' ? 'lo multipliqué por' : o[0] === '+' ? 'le sumé' : o[0] === '−' ? 'le resté' : 'lo dividí entre'} ${o[1]}`).join(', ');
        return {
          pregunta: [`Pensé un número, ${txt} y obtuve `, { v: 'c-d', t: f(v) }, '. ¿Qué número pensé?'],
          opciones: opciones(x0, [
            { id: 'orden', valor: mal, error: 'AT-DESHACER-ORDEN', siFuera: 'Eso deshace en el mismo orden; se empieza por la última operación.' },
            { id: 'noinv', valor: ops.slice().reverse().reduce((u, o) => aplicar(u, o), v), error: 'AT-INVERSA', siFuera: 'Eso repite las operaciones; van las inversas.' },
            { id: 'falta', valor: aplicar(aplicar(v, [INV[ops[2][0]], ops[2][1]]), [INV[ops[1][0]], ops[1][1]]), error: 'AT-INVERSA', siFuera: 'Falta deshacer la primera operación.' },
          ], z => f(z)),
          solucion: { texto: 'Inversas, de la última a la primera.', ecuacion: [`${f(v)} → ${ops.slice().reverse().map(o => `${INV[o[0]]} ${o[1]}`).join(' → ')} → ${x0}`], dibujo: { datos: tablaCadena(x0, ops, true), estado: { paso: 9 } } },
        };
      },
    },
  };

  // ---------- Idea 3: edades, la diferencia no cambia ----------
  // Cambia: los años que pasan. Permanece: la diferencia entre las dos edades. Progresa: la razón baja aunque la diferencia quede.
  // Se reserva: «el doble» llega cuando el menor tiene tanto como la diferencia. Debe verse: el tramo de la diferencia mide siempre lo mismo.
  const tirasEdad = (p, h, a) => ({
    max: Math.max(80, p + a + 4), filas: 2,
    tiras: [
      { rotulo: 'hijo', color: 'o', fin: `${h + a}`, tramos: [{ valor: h + a, color: 'o' }] },
      { rotulo: 'padre', color: 'o', fin: `${p + a}`, tramos: [{ valor: h + a, color: 'o', relleno: 0.12 }, { valor: p - h, color: 'i', texto: `diferencia ${p - h}` }] },
    ],
  });
  // Cuántas veces la edad del hijo tiene el padre (40 y 10 hoy) cuando pasan a años: lo escribe la lectura y lo miran los retos.
  const vecesEdad = a => (40 + a) / (10 + a);
  const edades = {
    id: 'edades',
    titulo: 'La diferencia de edades no cambia',
    temas: ['Edades'],
    pieza: 'arit-tiras',
    // Lee (fase 2): vocabulario de edades (doble, hace, dentro de), sin decir qué se conserva con el tiempo.
    lee: {
      tarjetas: [
        { titulo: 'Edades en la familia', texto: 'En cada cumpleaños de la familia sale la misma pregunta: «¿Y cuántos años tienes ya?». Los problemas de edades comparan a dos o más personas hoy, hace unos años o dentro de unos años.' },
        { titulo: 'Cómo se dice', texto: '«El doble» es dos veces la edad del otro y «el triple», tres veces. «Hace 5 años» mira hacia atrás; «dentro de 5 años», hacia adelante. Ordenar los datos en antes, hoy y después ayuda mucho.' },
        { titulo: 'Qué mirar al jugar', texto: 'Hay dos tiras: la del hijo y la del padre. La del padre termina en un pedazo turquesa. Mueve los años hacia adelante y hacia atrás, y fíjate en ese pedazo y en las veces de la lectura.' },
      ],
    },
    juega: {
      consigna: 'Un padre tiene 40 años y su hijo 10. Mueve el tiempo hacia adelante o hacia atrás y compara las dos tiras.',
      voz: 'Mira el pedazo turquesa mientras cambias los años.',
      controles: [{ id: 'a', etiqueta: 'Años que pasan', color: 'c-h', min: -8, max: 30, paso: 2, inicio: 0, unidad: 'años', decimales: 0 }],
      dibujo: v => ({ datos: tirasEdad(40, 10, v.a), estado: {} }),
      lectura: v => [`Diferencia 30 · el padre tiene ${f(vecesEdad(v.a))} veces la edad`],
      minimo: 3,
      // Se agarra el fin de la tira del hijo: moverlo es hacer pasar los años (las dos tiras crecen lo mismo).
      arrastres: [{ id: 'hijo', etiqueta: 'edad del hijo', color: 'c-h',
        donde: v => { const g = TIRAS().geometria(tirasEdad(40, 10, v.a)); return { x: g.x(10 + v.a), y: g.centroY(0) }; },
        mover: (pt, v) => ({ a: TIRAS().geometria(tirasEdad(40, 10, v.a)).deX(pt.x) - 10 }) }],
    },
    predice: {
      pregunta: 'Hoy el padre tiene 40 años y su hijo 10: cuatro veces su edad. ¿Dentro de cuántos años tendrá el doble?',
      opciones: [
        { id: 'c', texto: 'Dentro de 20 años', correcta: true },
        { id: 'nunca', texto: 'Nunca: siempre tendrá el cuádruple', error: 'RM3', siFuera: 'Sería cierto si las edades se multiplicaran. Se suman los mismos años a los dos.' },
        { id: 'diez', texto: 'Dentro de 10 años', error: 'RM3', siFuera: 'En 10 años: 50 y 20. Es dos veces y media, todavía no el doble.' },
        { id: 'treinta', texto: 'Dentro de 30 años', error: 'AT-DIFERENCIA', siFuera: '30 es la diferencia; el doble llega cuando el hijo tiene 30, en 20 años.' },
      ],
      dibujo: { datos: tirasEdad(40, 10, 0), estado: {} },
      revelar: { datos: tirasEdad(40, 10, 20), estado: {} },
      coincide: 'Coincide: en 20 años, 60 y 30.',
    },
    mira: {
      datos: tirasEdad(40, 10, 20),
      pasos: [
        { estado: {}, texto: 'La diferencia es 30 años y no cambia nunca.', ecuacion: ['40 − 10 = 30'] },
        { estado: {}, texto: 'El doble significa: el padre tiene el hijo dos veces.', ecuacion: ['padre = 2 · hijo'] },
        { estado: {}, texto: 'Como padre = hijo + 30, el hijo debe tener 30.', ecuacion: ['hijo + 30 = 2 · hijo   ⇒   hijo = 30'] },
        { estado: {}, texto: 'De 10 a 30 pasan 20 años.', ecuacion: ['30 − 10 = 20'] },
      ],
    },
    regla: {
      texto: 'Con el tiempo, todas las edades aumentan lo mismo: la diferencia queda fija y la razón entre las edades cambia.',
      ecuacion: ['(P + ', t, ') − (H + ', t, ') = ', { llave: ['P − H'], nota: 'diferencia fija', color: 'c-i' }],
      condicion: 'los años que pasan son los mismos para todos; hacia el pasado t es negativo y ninguna edad baja de cero.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), h = r.ent(3, 15), dif = r.ent(18, 35), k = r.de([2, 3]);
        const objetivo = dif / (k - 1), anios = z => ({ v: 'c-h', t: String(z) });
        if (!Number.isInteger(objetivo) || objetivo <= h) {
          const P = h + dif, a = r.ent(5, 20);
          return {
            enunciado: `Hoy Ana tiene ${h} años y su madre ${P}. ¿Cuántos años tendrá la madre cuando Ana tenga ${h + a}?`,
            pasos: [
              { tipo: 'pide', texto: `Piden la edad de la madre en el momento en que Ana cumpla ${h + a}.` },
              { tipo: 'datos', texto: ['Hoy Ana tiene ', String(h), ' y su madre ', String(P), '. Para que Ana llegue a ', String(h + a), ' pasan ', anios(a), ' años.'], ecuacion: [`${h + a} − ${h} = ${a}`] },
              { tipo: 'regla', texto: 'El tiempo pasa igual para las dos: los años que se le suman a Ana se le suman también a su madre.' },
              { tipo: 'cuentas', texto: ['A la edad de hoy de la madre le sumo los mismos ', anios(a), ' años.'], ecuacion: [`${P} + ${a} = ${P + a}`] },
              { tipo: 'sentido', texto: `Hoy la madre le lleva ${dif} años a Ana, y entonces también: ${P + a} − ${h + a} = ${(P + a) - (h + a)}. Cuadra.` },
            ],
            respuesta: `La madre tendrá ${P + a} años.`,
          };
        }
        const a = objetivo - h, veces = k === 2 ? 'doble' : 'triple';
        return {
          enunciado: `Hoy Luis tiene ${h} años y su padre ${h + dif}. ¿Dentro de cuántos años el padre tendrá el ${veces} de la edad de Luis?`,
          dibujo: { datos: tirasEdad(h + dif, h, 0), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden cuántos años deben pasar para que la edad del padre sea el ${veces} de la de Luis.` },
            { tipo: 'datos', texto: `Hoy Luis tiene ${h} y su padre ${h + dif}: el padre le lleva ${dif} años.`, ecuacion: [`${h + dif} − ${h} = ${dif}`] },
            { tipo: 'regla', texto: `Los años pasan igual para los dos, así que el padre le seguirá llevando ${dif} años a Luis toda la vida.` },
            { tipo: 'cuentas', texto: `Entonces el padre tendrá la edad de Luis más ${dif}, y también ${k} veces la de Luis. Igualo y después resto ${h}.`,
              ecuacion: [`Luis + ${dif} = ${k} · Luis   ⇒   Luis = ${objetivo}`, '   ·   ', `${objetivo} − ${h} = ${a}`], dibujo: { datos: tirasEdad(h + dif, h, a), estado: {} } },
            { tipo: 'sentido', texto: `Dentro de ${a} años, Luis tendrá ${objetivo} y su padre ${objetivo + dif}, que es ${k} · ${objetivo} = ${k * objetivo}. Cuadra.` },
          ],
          respuesta: ['Dentro de ', anios(a), ' años.'],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), h = r.ent(3, 15), dif = r.ent(18, 35), k = r.de([2, 3]);
        const objetivo = dif / (k - 1);
        if (!Number.isInteger(objetivo) || objetivo <= h) {
          const P = h + dif, a = r.ent(5, 20);
          return {
            pregunta: [`Hoy Ana tiene ${h} años y su madre ${P}. ¿Cuántos años tendrá la madre cuando Ana tenga ${h + a}?`],
            opciones: opciones(P + a, [
              { id: 'rm3', valor: Math.round(P * (h + a) / h), error: 'RM3', siFuera: 'Eso mantiene la razón; lo que se mantiene es la diferencia.' },
              { id: 'dif', valor: dif, error: 'AT-DIFERENCIA', siFuera: 'Esa es la diferencia, no la edad.' },
              { id: 'suma', valor: P + h + a, error: 'AT-DIFERENCIA', siFuera: `Pasan ${a} años, no ${h + a}.` },
            ], z => `${z} años`),
            solucion: { texto: `Pasan ${a} años para las dos.`, ecuacion: [`${P} + ${a} = ${P + a}`] },
          };
        }
        const a = objetivo - h;
        return {
          pregunta: [`Hoy Luis tiene ${h} años y su padre ${h + dif}. ¿Dentro de cuántos años el padre tendrá el ${k === 2 ? 'doble' : 'triple'} de la edad de Luis?`],
          opciones: opciones(a, [
            { id: 'dif', valor: dif, error: 'AT-DIFERENCIA', siFuera: 'Esa es la diferencia de edades, no los años que pasan.' },
            { id: 'edad', valor: objetivo, error: 'AT-PREGUNTA', siFuera: 'Esa es la edad que tendrá Luis, no los años que pasan.' },
            { id: 'rm3', valor: Math.round((h + dif) / k - h), error: 'RM3', siFuera: 'Eso divide la edad de hoy del padre; él también envejece.' },
          ], z => `${z} años`),
          solucion: { texto: `La diferencia ${dif} queda fija: Luis debe tener ${objetivo}.`, ecuacion: [`hijo + ${dif} = ${k} · hijo   ⇒   hijo = ${objetivo}`, '   ·   ', `${objetivo} − ${h} = ${a}`] },
        };
      },
    },
  };

  // ---------- Idea 4: móviles, la distancia cambia a la rapidez relativa ----------
  // Cambia: las rapideces y si van al encuentro o uno persigue al otro. Permanece: la distancia inicial y el instante 0.
  // Progresa: cada hora la separación cambia en vA + vB (encuentro) o vA − vB (alcance). Debe verse: dónde se juntan.
  const rectaMov = (dd, vA, vB, modo, conFin = true, fijo = 0) => {
    const enc = modo === 'encuentro', rel = enc ? vA + vB : vA - vB, tt = rel > 0 ? dd / rel : NaN;
    const xA = conFin && Number.isFinite(tt) ? vA * tt : null;
    const els = [
      { tipo: 'punto', x: 0, color: 'o', fila: 1, rotulo: `A, ${vA} km/h` },
      { tipo: 'punto', x: dd, color: 'i', fila: 1, rotulo: `B, ${vB} km/h` },
    ];
    if (xA !== null && xA <= Math.max(dd, xA)) {
      els.push({ tipo: 'salto', a: 0, b: xA, color: 'o', fila: 2 });
      els.push({ tipo: 'salto', a: dd, b: xA, color: 'i', fila: 3 });
      els.push({ tipo: 'punto', x: xA, color: 'h', fila: 0, rotulo: `t = ${f(tt)} h` });
    }
    const max = fijo || (xA !== null ? Math.max(dd, xA) * 1.05 : dd * 1.05);
    return { min: 0, max: Math.ceil(max / 50) * 50, paso: 50, cada: 2, decimales: 0, variable: 'km', filas: 3, elementos: els };
  };
  // En el juego la escala es fija en cada modo (B va a 30 km/h o menos, así A siempre alcanza): al arrastrar el punto
  // de encuentro, la recta no cambia de tamaño bajo el dedo.
  const cruce = v => 300 * v.vA / (v.modo === 'encuentro' ? v.vA + v.vB : v.vA - v.vB);
  const rectaJuego = v => rectaMov(300, v.vA, v.vB, v.modo, true, v.modo === 'encuentro' ? 330 : 1250);
  const moviles = {
    id: 'moviles',
    titulo: 'Encuentro y alcance',
    temas: ['Móviles'],
    pieza: 'recta',
    // Lee (fase 2): contexto y los dos modos (encuentro y alcance), sin decir si las rapideces se suman o se restan.
    lee: {
      tarjetas: [
        { titulo: 'En la carretera', texto: 'Entre Juliaca y Puno hay unos 45 km de pista. Si sale un vehículo de cada ciudad a la misma hora, en algún punto se cruzan. Los problemas de móviles preguntan cuándo y dónde pasa eso.' },
        { titulo: 'Dos maneras de moverse', texto: 'Dos móviles pueden ir al encuentro, uno hacia el otro, o en el mismo sentido, cuando uno persigue al otro. Ese segundo caso se llama alcance. En los dos importa cómo cambia la distancia entre ellos.' },
        { titulo: 'Qué mirar al jugar', texto: 'En la recta, A es el punto naranja y B, el turquesa. Elige el modo y las rapideces, y lee en la lectura cuántos kilómetros se acercan cada hora.' },
      ],
    },
    juega: {
      consigna: 'A y B salen a la vez, separados 300 km. Elige si van al encuentro o si A persigue a B, y sus rapideces.',
      voz: 'Compara cuánto se acercan por hora en cada caso.',
      controles: [
        { id: 'modo', etiqueta: 'Van', opciones: [{ valor: 'encuentro', texto: 'al encuentro' }, { valor: 'alcance', texto: 'A persigue a B' }] },
        { id: 'vA', etiqueta: 'A', color: 'c-o', min: 40, max: 100, paso: 10, inicio: 60, unidad: 'km/h', decimales: 0 },
        { id: 'vB', etiqueta: 'B', color: 'c-i', min: 10, max: 30, paso: 10, inicio: 30, unidad: 'km/h', decimales: 0 },
      ],
      dibujo: v => ({ datos: rectaJuego(v), estado: {} }),
      lectura: v => { const rel = v.modo === 'encuentro' ? v.vA + v.vB : v.vA - v.vB; return [`Se acercan ${rel}${NB}km cada hora → `, t, `${NB}=${NB}${f(300 / rel)}${NB}h`]; },
      minimo: 4,
      // Se arrastra el punto donde se juntan: para llevarlo ahí, A tiene que ir a cierta rapidez (con B fija).
      // Al encuentro, x = 300·vA/(vA + vB); en el alcance, x = 300·vA/(vA − vB).
      arrastres: [{ id: 'cruce', etiqueta: 'punto donde se juntan', color: 'c-o',
        donde: v => { const g = RECTA().geometria(rectaJuego(v)); return { x: g.x(cruce(v)), y: g.filaY(0) }; },
        mover: (pt, v) => {
          const datos = rectaJuego(v), g = RECTA().geometria(datos), xv = inversa(g.x, datos.min, datos.max)(pt.x);
          if (v.modo === 'encuentro') return { vA: xv >= 300 ? 1000 : v.vB * xv / (300 - xv) };
          return { vA: xv <= 300 ? 1000 : v.vB * xv / (xv - 300) };
        } }],
    },
    predice: {
      pregunta: 'Dos autos separados 300 km avanzan uno hacia el otro, a 60 y 40 km/h. ¿En cuántas horas se encuentran?',
      opciones: [
        { id: 'c', texto: '3 horas', correcta: true },
        { id: 'resta', texto: '15 horas', error: 'AT-RELATIVA', siFuera: '15 h sería si uno persiguiera al otro. Van al encuentro: las rapideces se suman.' },
        { id: 'uno', texto: '5 horas', error: 'AT-RELATIVA', siFuera: '5 h tardaría el de 60 si el otro estuviera quieto.' },
        { id: 'promedio', texto: '6 horas', error: 'AT-RELATIVA', siFuera: '300 ÷ 50 usa el promedio; se acercan 100 km por hora.' },
      ],
      dibujo: { datos: rectaMov(300, 60, 40, 'encuentro', false), estado: {} },
      revelar: { datos: rectaMov(300, 60, 40, 'encuentro'), estado: {} },
      coincide: 'Coincide: se acercan 100 km por hora; en 3 h recorren 180 y 120.',
    },
    mira: {
      datos: rectaMov(300, 60, 40, 'encuentro'),
      pasos: [
        { estado: {}, texto: 'Cada hora, A avanza 60 km y B 40 km, uno hacia el otro.', ecuacion: ['60 + 40 = 100 km por hora'] },
        { estado: {}, texto: 'La distancia entre ellos baja 100 km por hora.', ecuacion: [t, ' = ', { frac: ['300', '60 + 40'] }, ' = 3 h'] },
        { estado: {}, texto: 'Comprobación: A recorre 180 km y B 120 km.', ecuacion: ['180 + 120 = 300'] },
      ],
    },
    regla: {
      texto: 'Si salen a la vez, al encuentro la distancia baja a la suma de rapideces; en un alcance, a la diferencia.',
      ecuacion: [{ sub: [t, 'e'] }, ' = ', { frac: [D, [{ llave: [{ sub: ['v', 'A'] }, ' + ', { sub: ['v', 'B'] }], nota: 'al encuentro' }]] }, '   ·   ', { sub: [t, 'a'] }, ' = ', { frac: [D, [{ llave: [{ sub: ['v', 'A'] }, ' − ', { sub: ['v', 'B'] }], nota: 'en el alcance' }]] }],
      condicion: 'rapideces constantes, mismo instante de salida y, en el alcance, el que persigue va más rápido.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), enc = s % 2 === 0;
        const vB = r.de([20, 30, 40, 50]), vA = vB + r.de([10, 20, 30, 40]), tt = r.ent(2, 6);
        const rel = enc ? vA + vB : vA - vB, dd = rel * tt;
        const VA = { v: 'c-o', t: `${vA} km/h` }, VB = { v: 'c-i', t: `${vB} km/h` }, modo = enc ? 'encuentro' : 'alcance';
        return {
          enunciado: enc
            ? [`En la recta, A y B están separados ${dd} km y van uno hacia el otro, A a `, VA, ' y B a ', VB, '. ¿En cuántas horas se encuentran?']
            : ['En la recta, B va a ', VB, ` y A lo persigue desde ${dd} km atrás, a `, VA, '. ¿En cuántas horas lo alcanza?'],
          dibujo: { datos: rectaMov(dd, vA, vB, modo, false), estado: {} },
          pasos: [
            { tipo: 'pide', texto: enc ? 'Piden cuántas horas pasan hasta que A y B se encuentran.' : 'Piden cuántas horas pasan hasta que A alcanza a B.' },
            { tipo: 'datos', texto: enc ? ['Los separan ', D, ` = ${dd} km; A va a `, VA, ' y B a ', VB, ', uno hacia el otro.'] : ['A está ', D, ` = ${dd} km detrás de B; A va a `, VA, ' y B a ', VB, ', en el mismo sentido.'] },
            { tipo: 'regla', texto: enc ? 'Como van uno hacia el otro, cada hora la distancia entre ellos baja lo que avanzan los dos juntos.' : 'Como van en el mismo sentido, cada hora A recorta solo lo que avanza de más que B.' },
            { tipo: 'cuentas', texto: `Se acercan ${vA} ${enc ? '+' : '−'} ${vB} = ${rel} km cada hora. Divido la distancia entre eso.`,
              ecuacion: [t, ` = ${dd} ÷ ${rel} = ${tt} h`], dibujo: { datos: rectaMov(dd, vA, vB, modo), estado: {} } },
            { tipo: 'sentido', texto: enc ? `En ${tt} h, A recorre ${vA * tt} km y B ${vB * tt} km: juntos suman ${vA * tt + vB * tt} km. Cuadra.` : `En ${tt} h, A recorre ${vA * tt} km y B ${vB * tt} km: A hizo ${vA * tt - vB * tt} km más. Cuadra.` },
          ],
          respuesta: [t, ` = ${tt} horas`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), enc = s % 2 === 0;
        const vB = r.de([20, 30, 40, 50]), vA = vB + r.de([10, 20, 30, 40]), tt = r.ent(2, 6);
        const dd = (enc ? vA + vB : vA - vB) * tt;
        return {
          pregunta: enc
            ? [`Dos ciclistas separados ${dd} km van uno hacia el otro a ${vA} y ${vB} km/h. ¿En cuántas horas se encuentran?`]
            : [`Un bus va a ${vB} km/h y, ${dd} km detrás, un auto a ${vA} km/h en el mismo sentido. ¿En cuántas horas lo alcanza?`],
          opciones: opciones(tt, [
            { id: 'cambia', valor: enc ? dd / (vA - vB) : dd / (vA + vB), error: 'AT-RELATIVA', siFuera: enc ? 'Eso resta rapideces; al encuentro se suman.' : 'Eso suma rapideces; en el alcance se restan.' },
            { id: 'uno', valor: dd / vA, error: 'AT-RELATIVA', siFuera: 'Eso supone que el otro está quieto.' },
            { id: 'prom', valor: dd / ((vA + vB) / 2), error: 'AT-RELATIVA', siFuera: 'El promedio de rapideces no es lo que se acercan.' },
          ], z => `${f(z)} horas`),
          solucion: { texto: enc ? 'Se acercan a la suma de rapideces.' : 'Se acercan a la diferencia de rapideces.', ecuacion: [t, ` = ${dd} ÷ ${enc ? vA + vB : vA - vB} = ${tt} h`], dibujo: { datos: rectaMov(dd, vA, vB, enc ? 'encuentro' : 'alcance'), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 5: criptoaritmética, cada letra una cifra ----------
  // Cambia: las cifras A y B. Permanece: la estructura AB + BA. Progresa: la suma siempre sale múltiplo de 11.
  // Se reserva: la descomposición 10A + B. Debe verse: la suma depende solo de A + B.
  const tablaCripto = (A, B) => ({
    columnas: [{ t: 'A', color: 'o' }, { t: 'B', color: 'i' }, { t: 'AB' }, { t: 'BA' }, { t: 'AB + BA', color: 'd' }, { t: '11(A+B)', color: 'd' }],
    filas: [[{ t: String(A), color: 'o' }, { t: String(B), color: 'i' }, `${A}${B}`, `${B}${A}`, { t: String(11 * (A + B)), color: 'd', resalta: true }, { t: `11 · ${A + B}`, color: 'd' }]],
    filasMax: 1,
  });
  const cripto = {
    id: 'criptoaritmetica',
    titulo: 'Cada letra es una cifra',
    temas: ['Criptoaritmética'],
    pieza: 'arit-tabla',
    // Lee (fase 2): las reglas del juego de letras y qué es un reverso, sin decir en qué se convierte AB + BA.
    lee: {
      tarjetas: [
        { titulo: 'Letras en vez de cifras', texto: 'En criptoaritmética, una cuenta llega escrita con letras y hay que descubrir qué cifra esconde cada una. Es como un candado de números: cada pista descarta muchas combinaciones.' },
        { titulo: 'Las reglas', texto: 'Cada letra guarda una cifra, de 0 a 9, y la misma letra vale lo mismo en toda la cuenta. Un número no empieza con 0. Si AB es 47, su reverso BA es 74.' },
        { titulo: 'Qué mirar al jugar', texto: 'AB no es A por B: es un número de dos cifras. En la tabla, elige A y B, mira la suma AB + BA y compárala con la última columna.' },
      ],
    },
    juega: {
      consigna: 'Elige las cifras A y B (distintas de 0). La tabla suma el número AB con su reverso BA.',
      voz: 'Compara la suma con 11 veces A + B.',
      controles: [
        { id: 'A', etiqueta: 'A', color: 'c-o', min: 1, max: 9, paso: 1, inicio: 4, unidad: '', decimales: 0 },
        { id: 'B', etiqueta: 'B', color: 'c-i', min: 1, max: 9, paso: 1, inicio: 7, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaCripto(v.A, v.B), estado: {} }),
      lectura: v => [`${v.A}${v.B} + ${v.B}${v.A} = ${11 * (v.A + v.B)} = 11 · ${v.A + v.B}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En la suma AB + BA = 154, cada letra es una cifra. ¿Cuánto vale A + B?',
      opciones: [
        { id: 'c', texto: '14', correcta: true },
        { id: 'cifras', texto: '10', error: 'AT-CIFRAS', siFuera: '1 + 5 + 4 suma las cifras del resultado; AB + BA vale 11 · (A + B).' },
        { id: 'mitad', texto: '77', error: 'AT-CIFRAS', siFuera: '77 es la mitad de la suma, no A + B.' },
        { id: 'nose', texto: 'No se puede saber', error: 'AT-SUFICIENCIA', siFuera: 'A y B no se saben solos, pero su suma sí: 154 ÷ 11.' },
      ],
      dibujo: { datos: { columnas: [{ t: 'A', color: 'o' }, { t: 'B', color: 'i' }, { t: 'AB' }, { t: 'BA' }, { t: 'AB + BA', color: 'd' }], filas: [['?', '?', 'AB', 'BA', { t: '154', color: 'd' }]], filasMax: 1 }, estado: {} },
      revelar: { datos: tablaCripto(6, 8), estado: {} },
      coincide: 'Coincide: 154 = 11 · 14, sea 68 + 86 o 59 + 95.',
    },
    mira: {
      datos: tablaCripto(6, 8),
      pasos: [
        { estado: { columna: 2 }, texto: 'AB no es A por B: vale 10A + B.', ecuacion: ['AB = 10A + B'] },
        { estado: { columna: 3 }, texto: 'El reverso BA vale 10B + A.', ecuacion: ['BA = 10B + A'] },
        { estado: { columna: 4 }, texto: 'Sumados: 11A + 11B. Solo importa A + B.', ecuacion: ['AB + BA = 11(A + B) = 154   ⇒   A + B = 14'] },
      ],
    },
    regla: {
      texto: 'En criptoaritmética cada letra es una cifra, letras distintas son cifras distintas y la primera cifra no es 0. Cada número se escribe por su valor posicional.',
      ecuacion: ['AB = ', { llave: ['10A'], nota: 'decenas', color: 'c-o' }, ' + ', { llave: ['B'], nota: 'unidades', color: 'c-i' }, '   ·   ', 'ABC = 100A + 10B + C'],
      condicion: 'la asignación es la misma en toda la operación y se respetan las llevadas.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const A = r.ent(1, 9), B = r.ent(1, 9), S = 11 * (A + B), prueba = (10 * A + B) + (10 * B + A);
          return {
            enunciado: `En la suma AB + BA = ${S}, cada letra es una cifra. ¿Cuánto vale A + B?`,
            pasos: [
              { tipo: 'pide', texto: 'Piden la suma A + B, no cada cifra por separado.' },
              { tipo: 'datos', texto: `AB y BA tienen las mismas dos cifras en orden contrario, y juntos suman ${S}.` },
              { tipo: 'regla', texto: 'Escribo cada número por el valor de sus cifras: la de la izquierda está en las decenas y vale diez veces más.', ecuacion: ['AB = 10A + B   ·   BA = 10B + A'] },
              { tipo: 'cuentas', texto: 'Al sumar quedan 11 veces A y 11 veces B. Divido el resultado entre 11.', ecuacion: [`AB + BA = 11(A + B) = ${S}   ⇒   A + B = ${S} ÷ 11 = ${A + B}`] },
              { tipo: 'sentido', texto: `Pruebo con un caso posible: ${A}${B} + ${B}${A} = ${prueba}, igual que en el enunciado. Cuadra.` },
            ],
            respuesta: `A + B = ${A + B}`,
          };
        }
        let A, C; do { A = r.ent(2, 9); C = r.ent(1, 8); } while (A <= C);
        const B = r.ent(0, 9), Dd = 99 * (A - C), prueba = (100 * A + 10 * B + C) - (100 * C + 10 * B + A);
        return {
          enunciado: `En la resta ABC − CBA = ${Dd}, cada letra es una cifra y A es mayor que C. ¿Cuánto vale A − C?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden A − C, la diferencia entre la primera y la última cifra.' },
            { tipo: 'datos', texto: `ABC y CBA tienen las mismas cifras en orden contrario, y la resta da ${Dd}.` },
            { tipo: 'regla', texto: 'Escribo cada número por el valor de sus cifras: centenas, decenas y unidades. La B está en las decenas en los dos.', ecuacion: ['ABC = 100A + 10B + C'] },
            { tipo: 'cuentas', texto: 'Al restar, las B se cancelan y quedan 99 veces A menos 99 veces C. Divido entre 99.', ecuacion: [`ABC − CBA = 99(A − C) = ${Dd}   ⇒   A − C = ${Dd} ÷ 99 = ${A - C}`] },
            { tipo: 'sentido', texto: `Pruebo con un caso posible: ${A}${B}${C} − ${C}${B}${A} = ${prueba}, igual que en el enunciado. Cuadra.` },
          ],
          respuesta: `A − C = ${A - C}`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const A = r.ent(1, 9), B = r.ent(1, 9), S = 11 * (A + B);
          return {
            pregunta: `Si AB + BA = ${S}, ¿cuánto vale A + B?`,
            opciones: opciones(A + B, [
              { id: 'cifras', valor: String(S).split('').reduce((u, c) => u + +c, 0), error: 'AT-CIFRAS', siFuera: 'Esa es la suma de las cifras del resultado.' },
              { id: 'mitad', valor: S / 2, error: 'AT-CIFRAS', siFuera: 'Esa es la mitad del resultado.' },
              { id: 'diez', valor: S / 10, error: 'AT-POSICION', siFuera: 'AB + BA es 11 veces A + B, no 10.' },
            ], z => f(z)),
            solucion: { texto: 'AB + BA = 11(A + B).', ecuacion: [`A + B = ${S} ÷ 11 = ${A + B}`] },
          };
        }
        let A, C; do { A = r.ent(2, 9); C = r.ent(1, 8); } while (A <= C);
        const B = r.ent(0, 9), Dd = 99 * (A - C);
        return {
          pregunta: `Si ABC − CBA = ${Dd}, con A mayor que C, ¿cuánto vale A − C?`,
          opciones: opciones(A - C, [
            { id: 'cifras', valor: String(Dd).split('').reduce((u, c) => u + +c, 0), error: 'AT-CIFRAS', siFuera: 'Esa es la suma de las cifras del resultado.' },
            { id: 'cien', valor: Math.round(Dd / 100), error: 'AT-POSICION', siFuera: 'ABC − CBA = 99(A − C), no 100(A − C).' },
            { id: 'nueve', valor: Dd / 9, error: 'AT-POSICION', siFuera: 'Se divide entre 99, no entre 9.' },
          ], z => f(z)),
          solucion: { texto: 'Las B se cancelan: queda 99(A − C).', ecuacion: [`(100A + 10B + C) − (100C + 10B + A) = 99(A − C) = ${Dd}`] },
        };
      },
    },
  };

  // ---------- Idea 6: ¿alcanza el dato para una sola respuesta? ----------
  // Cambia: qué números van en los vértices de un triángulo de 1 a 6. Permanece: la regla «los tres lados suman igual».
  // Progresa: varias distribuciones válidas → sumas distintas. Se reserva: el dato extra que deja una sola. Debe verse:
  // dos casos compatibles con respuestas distintas prueban que el dato no basta.
  const DIST = {
    '1-2-3': [[1, 5, 3], [3, 4, 2], [2, 6, 1]],
    '4-5-6': [[4, 2, 6], [6, 1, 5], [5, 3, 4]],
    '1-3-5': [[1, 6, 3], [3, 2, 5], [5, 4, 1]],
    '2-4-6': [[2, 5, 4], [4, 1, 6], [6, 3, 2]],
  };
  const sumaLado = k => DIST[k][0].reduce((u, z) => u + z, 0);
  const tablaDist = (claves, marca) => ({
    columnas: [{ t: 'vértices', color: 'o' }, { t: 'lado 1' }, { t: 'lado 2' }, { t: 'lado 3' }, { t: 'S', color: 'd' }],
    filas: claves.map(k => [{ t: k.replace(/-/g, ', '), color: 'o' }, ...DIST[k].map(l => l.join('+')), { t: String(sumaLado(k)), color: 'd', resalta: marca === k }]),
    filasMax: 4,
  });
  const unicidad = {
    id: 'suficiencia',
    titulo: '¿Alcanza para una sola respuesta?',
    temas: ['Suficiencia de datos', 'Distribuciones numéricas'],
    pieza: 'arit-tabla',
    // Lee (fase 2): qué es una pregunta de suficiencia y cómo se lee la tabla, sin decir si el dato basta.
    lee: {
      tarjetas: [
        { titulo: '¿Alcanza el dato?', texto: 'En el examen, a veces no te piden un número: te preguntan si los datos alcanzan para hallarlo. Son preguntas de suficiencia de datos, y se responden con «sí, basta» o «no basta».' },
        { titulo: 'El triángulo de números', texto: 'En este juego, los números del 1 al 6 se reparten en los tres lados de un triángulo, tres por lado. Las esquinas se llaman vértices, y cada lado debe sumar lo mismo: S.' },
        { titulo: 'Qué mirar al jugar', texto: 'La tabla tiene una fila por reparto: los vértices, los tres lados y su suma S. Elige otros vértices y revisa que los tres lados de la fila sumen lo mismo.' },
      ],
    },
    juega: {
      consigna: 'Los números del 1 al 6 van en los lados de un triángulo, 3 por lado, y cada lado suma S. Elige los vértices.',
      voz: 'Cada distribución cumple la regla. ¿Dan la misma S?',
      controles: [{ id: 'k', etiqueta: 'Vértices', opciones: Object.keys(DIST).map(k => ({ valor: k, texto: k.replace(/-/g, ', ') })) }],
      dibujo: v => ({ datos: tablaDist([v.k]), estado: {} }),
      lectura: v => [`3S = 21 + ${v.k.split('-').reduce((u, z) => u + +z, 0)} → S = ${sumaLado(v.k)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Se sabe solo que los números del 1 al 6 están en un triángulo con los tres lados de igual suma S. ¿Ese dato basta para saber S?',
      opciones: [
        { id: 'c', texto: 'No: S puede ser 9, 10, 11 o 12', correcta: true },
        { id: 'siete', texto: 'Sí: S = 7', error: 'AT-VERTICES', siFuera: '21 ÷ 3 = 7 sería cierto si cada número estuviera en un solo lado; los vértices están en dos.' },
        { id: 'patron', texto: 'Sí: con un ejemplo que funcione basta', error: 'AT-SUFICIENCIA', siFuera: 'Un ejemplo muestra que es posible, no que sea la única.' },
      ],
      dibujo: { datos: tablaDist(['1-2-3']), estado: {} },
      revelar: { datos: tablaDist(Object.keys(DIST)), estado: {} },
      coincide: 'Coincide: hay distribuciones válidas con S distintas; el dato no basta.',
    },
    mira: {
      datos: tablaDist(Object.keys(DIST), '1-2-3'),
      pasos: [
        { estado: {}, texto: 'Al sumar los tres lados, los vértices se cuentan dos veces.', ecuacion: ['3S = (1 + 2 + … + 6) + vértices = 21 + vértices'] },
        { estado: { fila: [0, 1] }, texto: 'Vértices 1, 2, 3 dan S = 9; vértices 4, 5, 6 dan S = 12.', ecuacion: ['3S = 27 → 9', '   ·   ', '3S = 36 → 12'] },
        { estado: { fila: 0 }, texto: 'Dos casos válidos con S distintas prueban que el dato no basta.', ecuacion: ['dato extra «vértices 1, 2, 3»   ⇒   S = 9'] },
      ],
    },
    regla: {
      texto: 'Un dato es suficiente si deja una sola respuesta para lo que se pide. Para mostrar que no basta, sirven dos casos que lo cumplen con respuestas distintas.',
      ecuacion: ['3S = 21 + ', { llave: ['V'], nota: 'suma de vértices', color: 'c-o' }],
      condicion: 'se pregunta por lo que se pide, no por todas las incógnitas. Un patrón observado no prueba que la respuesta sea única.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = s % 3;
        if (tipo === 0) {
          const k = r.de(Object.keys(DIST)), v = k.split('-').map(Number), S = sumaLado(k), sv = v.reduce((u, z) => u + z, 0);
          return {
            enunciado: `Los números del 1 al 6 están en los lados de un triángulo, 3 por lado, y cada lado suma S. Si los vértices son ${v.join(', ')}, ¿cuánto vale S?`,
            pasos: [
              { tipo: 'pide', texto: 'Piden S, lo que suma cada lado del triángulo.' },
              { tipo: 'datos', texto: `Van los números del 1 al 6, tres por lado, y en los vértices están ${v.join(', ')}.` },
              { tipo: 'regla', texto: 'Si sumo los tres lados, cada vértice entra dos veces, porque está en dos lados; los otros números entran una sola vez.' },
              { tipo: 'cuentas', texto: `Del 1 al 6 suman 21 y los vértices, ${sv}. Esa suma total es tres veces S.`,
                ecuacion: [`3S = 21 + ${sv} = ${21 + sv}   ⇒   S = ${(21 + sv) / 3}`], dibujo: { datos: tablaDist([k], k), estado: {} } },
              { tipo: 'sentido', texto: `En la tabla, los lados ${DIST[k].map(l => l.join(' + ')).join(', ')} suman ${DIST[k].map(l => l.reduce((u, z) => u + z, 0)).join(', ')}. Cuadra.` },
            ],
            respuesta: `S = ${S}`,
          };
        }
        const a = r.ent(3, 9), b = r.ent(2, 8), suma = a + b, dif = Math.abs(a - b), mayor = Math.max(a, b), menor = Math.min(a, b);
        const caso = r.de([
          { dato: `x + y = ${suma} y x − y = ${dif}`, pide: 'el valor de x', basta: true, resp: `x = (${suma} + ${dif}) ÷ 2 = ${(suma + dif) / 2}`, vale: `x = ${(suma + dif) / 2}`,
            ver: `con x = ${mayor} e y = ${menor}: ${mayor} + ${menor} = ${mayor + menor} y ${mayor} − ${menor} = ${mayor - menor}; es el único par posible` },
          { dato: `x + y = ${suma}`, pide: 'el valor de x', basta: false, pares: [[a, b], [a - 1, b + 1]] },
          { dato: `2x + 2y = ${2 * suma}`, pide: 'el valor de x + y', basta: true, resp: `x + y = ${2 * suma} ÷ 2 = ${(2 * suma) / 2}`, vale: `x + y = ${(2 * suma) / 2}`,
            ver: `con x = ${a} e y = ${b}: 2 · ${a} + 2 · ${b} = ${2 * a + 2 * b}, y con x = ${a - 1} e y = ${b + 1} también; en los dos, x + y = ${suma}` },
          { dato: `x · y = ${a * b}`, pide: 'el valor de x', basta: false, pares: a === b ? [[a, b], [a * b, 1]] : [[a, b], [b, a]] },
        ]);
        const pares = caso.pares && caso.pares.map(([x, y]) => `x = ${x}, y = ${y}`).join(' o ');
        const cumple = caso.pares && caso.pares.map(([x, y]) => (caso.dato.includes('·') ? `${x} · ${y} = ${x * y}` : `${x} + ${y} = ${x + y}`)).join(' y ');
        return {
          enunciado: `Se sabe solo que ${caso.dato}, con x e y enteros positivos. ¿Eso basta para hallar ${caso.pide}?`,
          pasos: [
            { tipo: 'pide', texto: `Piden decidir si el dato alcanza para hallar ${caso.pide} con un solo valor posible.` },
            { tipo: 'datos', texto: `Solo se sabe que ${caso.dato}, y que x e y son enteros positivos.` },
            { tipo: 'regla', texto: 'Si encuentro dos casos que cumplen el dato y dan respuestas distintas, no basta. Si lo pedido sale con un solo valor, sí basta.' },
            caso.basta
              ? { tipo: 'cuentas', texto: 'Despejo lo pedido usando solo el dato.', ecuacion: [caso.resp] }
              : { tipo: 'cuentas', texto: 'Busco dos casos que cumplan el dato.', ecuacion: [pares] },
            caso.basta
              ? { tipo: 'sentido', texto: `Comprueba ${caso.ver}. Cuadra.` }
              : { tipo: 'sentido', texto: `Los dos cumplen: ${cumple}. Pero dan x distinto, así que el dato no alcanza.` },
          ],
          respuesta: caso.basta ? `Sí basta: ${caso.vale}.` : 'No basta: x puede tomar dos valores.',
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const k = r.de(Object.keys(DIST)), v = k.split('-').map(Number), S = sumaLado(k);
          return {
            pregunta: `Los números del 1 al 6 están en un triángulo, 3 por lado, con los lados de igual suma. Si los vértices son ${v.join(', ')}, ¿cuánto vale S?`,
            opciones: opciones(S, [
              { id: 'siete', valor: 7, error: 'AT-VERTICES', siFuera: 'Eso no cuenta dos veces los vértices.' },
              { id: 'sin3', valor: 21 + v.reduce((u, z) => u + z, 0), error: 'AT-VERTICES', siFuera: 'Eso es 3S; falta dividir entre 3.' },
              { id: 'vert', valor: v.reduce((u, z) => u + z, 0), error: 'AT-VERTICES', siFuera: 'Esa es la suma de los vértices, no de un lado.' },
            ], z => String(z)),
            solucion: { texto: 'Los vértices se cuentan dos veces.', ecuacion: [`3S = 21 + ${v.reduce((u, z) => u + z, 0)}   ⇒   S = ${S}`], dibujo: { datos: tablaDist([k], k), estado: {} } },
          };
        }
        const a = r.ent(3, 9), b = r.ent(2, 8), suma = a + b;
        const caso = r.de([
          { dato: `x + y = ${suma} y x − y = ${Math.abs(a - b)}`, pide: 'el valor de x', basta: true, resp: `x = (${suma} + ${Math.abs(a - b)}) ÷ 2 = ${Math.max(a, b)}` },
          { dato: `x + y = ${suma}`, pide: 'el valor de x', basta: false, otro: `x = ${a}, y = ${b} o x = ${a - 1}, y = ${b + 1}` },
          { dato: `2x + 2y = ${2 * suma}`, pide: 'el valor de x + y', basta: true, resp: `x + y = ${2 * suma} ÷ 2 = ${suma}` },
          { dato: `x · y = ${a * b}`, pide: 'el valor de x', basta: false, otro: `x = ${a}, y = ${b} o x = ${b}, y = ${a}` },
        ]);
        if (caso.otro && a === b) caso.otro = `x = ${a}, y = ${b} o x = ${a * b}, y = 1`;
        return {
          pregunta: `Se sabe solo que ${caso.dato}, con x e y enteros positivos. ¿Eso basta para hallar ${caso.pide}?`,
          opciones: opciones(caso.basta ? 'Sí, basta' : 'No basta', [
            { id: 'contrario', valor: caso.basta ? 'No basta' : 'Sí, basta', error: 'AT-SUFICIENCIA', siFuera: caso.basta ? 'No hace falta saber x e y por separado; se pide solo la suma.' : `Un caso no prueba nada: ${caso.otro}.` },
            { id: 'ambas', valor: 'Solo si se conocen x e y', error: 'AT-SUFICIENCIA', siFuera: 'Se pregunta por lo que se pide, no por todas las incógnitas.' },
          ], String),
          solucion: { texto: caso.basta ? 'Lo pedido queda con un solo valor.' : 'Hay dos casos válidos con respuestas distintas.', ecuacion: [caso.basta ? caso.resp : caso.otro] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Canje libre: los dos precios se eligen, también iguales o al revés (b ≤ a), donde la falsa suposición ya no sirve.
  const totalCanje = v => (12 - v.k) * v.a + v.k * v.b;
  const tiraCanjeLab = v => {
    const total = totalCanje(v);
    return { max: 12 * Math.max(v.a, v.b) * 1.05, filas: 1, tiras: [{ rotulo: `${12 - v.k} de S/${NB}${v.a} y ${v.k} de S/${NB}${v.b}`, color: 'd', fin: `S/${NB}${total}`,
      tramos: [{ valor: (12 - v.k) * v.a, partes: 12 - v.k, color: 'o' }, ...(v.k ? [{ valor: v.k * v.b, partes: v.k, color: 'i' }] : [])] }] };
  };
  // Persecución en el tiempo: una sola escala (0 a 650 km) para los dos modos; se arrastra a A y el reloj avanza.
  const posiciones = v => ({ A: v.vA * v.t, B: v.modo === 'encuentro' ? 300 - v.vB * v.t : 300 + v.vB * v.t });
  const rectaReloj = v => {
    const p = posiciones(v);
    return { min: 0, max: 650, paso: 50, cada: 2, decimales: 0, variable: 'km', filas: 3, elementos: [
      { tipo: 'salto', a: 0, b: p.A, color: 'o', fila: 2 },
      { tipo: 'salto', a: 300, b: p.B, color: 'i', fila: 3 },
      { tipo: 'punto', x: p.A, color: 'o', fila: 1, rotulo: 'A' },
      { tipo: 'punto', x: p.B, color: 'i', fila: 1, rotulo: 'B' },
    ] };
  };

  // Para los retos: distancia entre A y B en la persecución, el encuentro más temprano que la mesa permite y el
  // momento de la mesa de edades en que el padre tiene más veces la edad del hijo. Los calcula el motor.
  const separacion = v => Math.abs(posiciones(v).B - posiciones(v).A);
  const juntos = v => v.t > 0 && separacion(v) < 1e-9;
  let MINT = Infinity;
  for (let vA = 20; vA <= 100; vA += 10) for (let vB = 10; vB <= 100; vB += 10) for (let k = 1; k <= 12; k++)
    if (juntos({ modo: 'encuentro', vA, vB, t: k / 2 })) MINT = Math.min(MINT, k / 2);
  const cEdad = edades.juega.controles[0];
  let MAXVECES = cEdad.min;
  for (let a = cEdad.min; a <= cEdad.max; a += cEdad.paso) if (vecesEdad(a) > vecesEdad(MAXVECES)) MAXVECES = a;
  const mismo = (g, v, ks) => g.some(x => ks.every(k => x[k] === v[k]));

  return {
    unidad: 'aritmetica.razonamiento-numerico',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tiras.js', '/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/recta.js'],
    // «llevada» y «reverso» se estrenan en Las cuatro operaciones (docs/etapa4/decisiones.md): aquí no se definen y el
    // lector los marca como «Se explica en Las cuatro operaciones».
    glosario: [
      { termino: 'falsa suposición', formas: ['falsa suposición'],
        def: 'Suponer que todos los objetos son del mismo tipo y corregir con lo que cambia cada canje.',
        ejemplo: '12 entradas de S/ 5 darían 60; faltan 21 y cada canje suma 3: 7 de S/ 8.', ver: ['incógnita'] },
      { termino: 'falsa posición', formas: ['falsa posición'],
        def: 'Probar con un valor cómodo y escalarlo según el error, cuando la relación es proporcional.',
        ejemplo: 'Si x + x/4 = 15, prueba 4: da 5. Hay que triplicar, así que x = 12.', ver: ['falsa suposición'] },
      { termino: 'método regresivo', formas: ['método regresivo'],
        def: 'Hallar el inicio partiendo del final y deshaciendo cada paso, del último al primero.',
        ejemplo: 'x · 4 + 6 = 50: 50 − 6 = 44 y 44 ÷ 4 = 11.', ver: ['operación inversa'] },
      { termino: 'incógnita', formas: ['incógnita', 'incógnitas'],
        def: 'Número desconocido que se busca; se nombra con una letra para poder escribir la relación.',
        ejemplo: 'En x + 5 = 12, la x vale 7.', ver: ['ecuación lineal'] },
      { termino: 'ecuación lineal', formas: ['ecuación lineal', 'ecuaciones lineales'],
        def: 'Igualdad en la que las letras solo se suman o se multiplican por números fijos, sin potencias.',
        ejemplo: '5x + 8(12 − x) = 81 da x = 5.', ver: ['incógnita'] },
      { termino: 'diferencia de edades', formas: ['diferencia de edades'],
        def: 'Cuántos años le lleva una persona a otra. No cambia con el tiempo.',
        ejemplo: 'Padre 40 e hijo 10: le lleva 30, hoy y en 20 años (60 y 30).' },
      { termino: 'móviles al encuentro', formas: ['móviles al encuentro', 'al encuentro'],
        def: 'Dos móviles que van uno hacia el otro: cada hora la distancia baja la suma de sus rapideces.',
        ejemplo: '300 km a 60 y 40 km/h: se cruzan en 300 ÷ 100 = 3 h.', ver: ['alcance'] },
      { termino: 'alcance', formas: ['alcance', 'alcances'],
        def: 'Un móvil persigue a otro más lento: cada hora la distancia baja la diferencia de sus rapideces.',
        ejemplo: '300 km a 100 y 40 km/h: lo alcanza en 300 ÷ 60 = 5 h.', ver: ['móviles al encuentro'] },
      { termino: 'criptoaritmética', def: 'Operación escrita con letras en lugar de cifras; se averigua qué cifra es cada letra.',
        ejemplo: 'AB + BA = 154 pide A + B = 14, porque AB + BA = 11(A + B).', ver: ['valor posicional'] },
      { termino: 'valor posicional', formas: ['valor posicional'],
        def: 'Lo que vale una cifra según el lugar que ocupa en el número.',
        ejemplo: 'En 47, el 4 vale 40 y el 7 vale 7: 47 = 10 · 4 + 7.', ver: ['cifra', 'reverso'] },
      { termino: 'canje', formas: ['canjes', 'canje'],
        def: 'Cambiar un objeto de un tipo por uno del otro tipo sin cambiar cuántos objetos hay.',
        ejemplo: 'Cambiar una entrada de S/ 5 por una de S/ 8: siguen siendo 12 entradas, pero el total sube 3.', ver: ['falsa suposición'] },
      { termino: 'vértice', formas: ['vértices', 'vértice'],
        def: 'Esquina de una figura, donde se juntan dos de sus lados.',
        ejemplo: 'Un triángulo tiene 3 vértices; cada uno pertenece a dos lados.' },
      { termino: 'suficiencia de datos', formas: ['suficiencia de datos'],
        def: 'Tipo de pregunta que no pide el valor, sino si los datos alcanzan para hallar una sola respuesta.',
        ejemplo: 'Solo x + y = 10 no basta para x; con x − y = 2, sí: x = 6.' },
    ],
    // Laboratorio: juego libre, sin preguntas. El canje libre deja probar precios iguales o al revés; la persecución pone
    // el tiempo en la mano (también B más rápido que A, que la idea no deja); la tercera es el juego de las edades.
    laboratorio: [
      {
        id: 'canje-libre', titulo: 'Canje con otros precios', pieza: 'arit-tiras',
        consigna: 'Doce entradas de dos precios. Elige los precios, también iguales, y cuántas son del segundo. ¿Cuánto suma cada canje?',
        controles: [
          { id: 'a', etiqueta: 'Precio 1', color: 'c-o', min: 1, max: 10, paso: 1, inicio: 5, unidad: 'soles', decimales: 0 },
          { id: 'b', etiqueta: 'Precio 2', color: 'c-i', min: 1, max: 10, paso: 1, inicio: 8, unidad: 'soles', decimales: 0 },
          { id: 'k', etiqueta: 'Del precio 2', color: 'c-i', min: 0, max: 12, paso: 1, inicio: 4, unidad: '', decimales: 0 },
        ],
        dibujo: v => ({ datos: tiraCanjeLab(v), estado: {} }),
        lectura: v => [`${12 - v.k} × ${v.a} + ${v.k} × ${v.b} = S/${NB}${totalCanje(v)} · canje: ${v.b - v.a >= 0 ? '+' : '−'}${Math.abs(v.b - v.a)}`],
        // El borde entre los dos colores, como pestaña bajo la tira (no tapa el total): a su derecha, las del precio 2.
        arrastres: [{ id: 'borde', etiqueta: 'borde entre los dos precios', color: 'c-i',
          donde: v => { const g = TIRAS().geometria(tiraCanjeLab(v)); return { x: g.x((12 - v.k) * v.a), y: g.tiraY(0) + g.altoTira + 10 }; },
          mover: (pt, v) => ({ k: 12 - TIRAS().geometria(tiraCanjeLab(v)).deX(pt.x) / v.a }) }],
        invitaciones: [
          { texto: 'Consigue que las doce entradas cuesten justo S/ 100.',
            logrado: v => totalCanje(v) === 100,
            bien: 'Total = 12 · precio 1 + canjes · diferencia. Compruébalo en la lectura.' },
          { texto: 'Haz que mover el borde ya no cambie el total.',
            logrado: v => v.a === v.b,
            bien: 'Precios iguales: cada canje suma 0 y la falsa suposición no sirve.' },
          { texto: 'Haz que cada canje baje el total en vez de subirlo.',
            logrado: v => v.b < v.a,
            bien: 'Si el segundo es más barato, conviene suponer que todos son del caro.' },
          { texto: 'Guarda dos casos con el mismo total y distintos precios.',
            logrado: (v, g) => mismo(g, v, ['a', 'b', 'k']) && g.some(x => (x.a !== v.a || x.b !== v.b) && totalCanje(x) === totalCanje(v)),
            bien: 'El total solo no dice los precios: hace falta otro dato.' },
        ],
      },
      {
        id: 'persecucion', titulo: 'Persecución con reloj', pieza: 'recta',
        consigna: 'Arrastra a A por la recta: el reloj avanza y B se mueve a su rapidez. Prueba también B más rápido que A.',
        controles: [
          { id: 'modo', etiqueta: 'Van', opciones: [{ valor: 'encuentro', texto: 'al encuentro' }, { valor: 'alcance', texto: 'A persigue a B' }] },
          { id: 'vA', etiqueta: 'A', color: 'c-o', min: 20, max: 100, paso: 10, inicio: 60, unidad: 'km/h', decimales: 0 },
          { id: 'vB', etiqueta: 'B', color: 'c-i', min: 10, max: 100, paso: 10, inicio: 40, unidad: 'km/h', decimales: 0 },
          { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 6, paso: 0.5, inicio: 1, unidad: 'h', decimales: 1 },
        ],
        dibujo: v => ({ datos: rectaReloj(v), estado: {} }),
        lectura: v => { const p = posiciones(v); return [v.modo === 'encuentro' ? 'al encuentro' : 'A persigue', `, ${v.vA} y ${v.vB}${NB}km/h, `, t, `${NB}=${NB}${f(v.t, 1)}${NB}h: ${f(Math.abs(p.B - p.A), 0)}${NB}km`]; },
        arrastres: [{ id: 'auto-a', etiqueta: 'posición de A', color: 'c-h',
          donde: v => { const g = RECTA().geometria(rectaReloj(v)); return { x: g.x(v.vA * v.t), y: g.filaY(1) }; },
          mover: (pt, v) => ({ t: inversa(RECTA().geometria(rectaReloj(v)).x, 0, 650)(pt.x) / v.vA }) }],
        invitaciones: [
          { texto: 'Al encuentro, haz que A y B se junten justo a las 2 h.',
            logrado: v => v.modo === 'encuentro' && v.t === 2 && juntos(v),
            bien: '300 ÷ 2 = 150: la suma de rapideces es la que cierra la distancia.' },
          { texto: 'En la persecución, consigue que A alcance a B.',
            logrado: v => v.modo === 'alcance' && juntos(v),
            bien: 'En el alcance cierra la diferencia de rapideces: t = 300 ÷ (vA − vB).' },
          { texto: 'Busca el encuentro más temprano que permite la mesa.',
            logrado: v => v.modo === 'encuentro' && juntos(v) && v.t === MINT,
            bien: 'Con 100 y 100 km/h cierran 200 km cada hora: 1,5 h.' },
          { texto: 'Haz que A persiga a B y la distancia entre ellos crezca.',
            logrado: v => v.modo === 'alcance' && v.vB > v.vA && v.t > 0,
            bien: 'Si B va más rápido, la diferencia de rapideces lo aleja: nunca lo alcanza.' },
        ],
      },
      Object.assign({ id: 'edades-libre', titulo: 'Las dos tiras de edad', pieza: 'arit-tiras',
        invitaciones: [
          { texto: 'Haz que el padre tenga el doble de la edad del hijo.',
            logrado: v => vecesEdad(v.a) === 2,
            bien: 'El doble llega cuando el hijo tiene 30, lo mismo que la diferencia.' },
          { texto: 'Haz que el padre tenga dos veces y media la edad del hijo.',
            logrado: v => vecesEdad(v.a) === 2.5,
            bien: 'En 10 años: 50 y 20. La razón cambió; la diferencia, no.' },
          { texto: 'Busca el momento en que el padre tiene más veces la edad del hijo.',
            logrado: v => v.a === MAXVECES,
            bien: 'Hacia el pasado las veces crecen rápido; la diferencia sigue en 30.' },
          { texto: 'Guarda dos momentos distintos y compara la diferencia y las veces.',
            logrado: (v, g) => mismo(g, v, ['a']) && g.some(x => x.a !== v.a),
            bien: 'Siempre 30 años de diferencia: lo que cambia es cuántas veces.' },
        ] }, edades.juega),
    ],
    historia: {
      texto: 'En el papiro Rhind, de Egipto, algunos problemas se resuelven partiendo de un valor cómodo y corrigiéndolo según el resultado. Esa estrategia se llamó después falsa posición. No es adivinar: funciona porque la relación es proporcional, y eso permite escalar el ensayo. Esta unidad recupera esa lógica: modelar, probar y comprobar.',
      pregunta: '¿Cuándo un buen intento se puede corregir con una regla?',
      fuente: { titulo: 'Egyptian mathematics, 1.1.2 Egyptian calculation — The Open University', url: 'https://www.open.edu/openlearn/science-maths-technology/mathematics-statistics/egyptian-mathematics/content-section-1.1.2' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'canje-libre': ['falsa-suposicion'],
      'persecucion': ['moviles'],
      'edades-libre': ['edades'],
    },
    ideas: [falsa, regresivo, edades, moviles, cripto, unicidad],
  };
});
