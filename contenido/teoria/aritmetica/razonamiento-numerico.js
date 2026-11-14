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
    juega: {
      consigna: 'Se compraron 12 entradas de S/ 5 o S/ 8 y se pagó S/ 81. Cambia cuántas son de S/ 8 hasta la meta.',
      voz: 'Mira cuánto crece la tira con cada entrada que cambias.',
      controles: [{ id: 'k', etiqueta: 'Entradas de S/ 8', color: 'c-i', min: 0, max: 12, paso: 1, inicio: 0, unidad: '', decimales: 0 }],
      dibujo: v => ({ datos: tirasCanje(12, 5, 8, v.k, 81), estado: {} }),
      lectura: v => [T, ` = 60 + 3 · ${v.k} = ${60 + 3 * v.k} soles`],
      minimo: 3,
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
      texto: 'Se supone que todos son del tipo más barato. Lo que falta para el total, dividido entre lo que agrega cada canje, da cuántos son del otro tipo.',
      ecuacion: [{ sub: ['n', 'b'] }, ' = ', { frac: [[T, ' − n · a'], 'b − a'] }],
      condicion: 'cada canje cambia el total en la misma cantidad b − a; es una ecuación lineal escrita de otra forma.',
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
      texto: 'Para hallar el inicio se parte del final y se aplica la operación inversa de cada paso, en orden contrario. Siempre se comprueba de ida.',
      ecuacion: ['× ↔ ÷;   + ↔ −;   último paso → primero que se deshace'],
      condicion: 'cada operación es invertible en el dominio: no se multiplica por 0 y las divisiones quedan dentro de los números permitidos.',
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
  const edades = {
    id: 'edades',
    titulo: 'La diferencia de edades no cambia',
    temas: ['Edades'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Un padre tiene 40 años y su hijo 10. Mueve el tiempo hacia adelante o hacia atrás y compara las dos tiras.',
      voz: 'Mira el pedazo turquesa mientras cambias los años.',
      controles: [{ id: 'a', etiqueta: 'Años que pasan', color: 'c-h', min: -8, max: 30, paso: 2, inicio: 0, unidad: 'años', decimales: 0 }],
      dibujo: v => ({ datos: tirasEdad(40, 10, v.a), estado: {} }),
      lectura: v => [`Diferencia 30; el padre tiene ${f((40 + v.a) / (10 + v.a))} veces la edad`],
      minimo: 3,
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
      ecuacion: ['(P + ', t, ') − (H + ', t, ') = P − H'],
      condicion: 'los años que pasan son los mismos para todos; hacia el pasado t es negativo y ninguna edad baja de cero.',
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
          solucion: { texto: `La diferencia ${dif} queda fija: Luis debe tener ${objetivo}.`, ecuacion: [`hijo + ${dif} = ${k} · hijo   ⇒   hijo = ${objetivo};   ${objetivo} − ${h} = ${a}`] },
        };
      },
    },
  };

  // ---------- Idea 4: móviles, la distancia cambia a la rapidez relativa ----------
  // Cambia: las rapideces y si van al encuentro o uno persigue al otro. Permanece: la distancia inicial y el instante 0.
  // Progresa: cada hora la separación cambia en vA + vB (encuentro) o vA − vB (alcance). Debe verse: dónde se juntan.
  const rectaMov = (dd, vA, vB, modo, conFin = true) => {
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
    const max = xA !== null ? Math.max(dd, xA) * 1.05 : dd * 1.05;
    return { min: 0, max: Math.ceil(max / 50) * 50, paso: 50, cada: 2, decimales: 0, variable: 'km', filas: 3, elementos: els };
  };
  const moviles = {
    id: 'moviles',
    titulo: 'Encuentro y alcance',
    temas: ['Móviles'],
    pieza: 'recta',
    juega: {
      consigna: 'A y B salen a la vez, separados 300 km. Elige si van al encuentro o si A persigue a B, y sus rapideces.',
      voz: 'Compara cuánto se acercan por hora en cada caso.',
      controles: [
        { id: 'modo', etiqueta: 'Van', opciones: [{ valor: 'encuentro', texto: 'al encuentro' }, { valor: 'alcance', texto: 'A persigue a B' }] },
        { id: 'vA', etiqueta: 'A', color: 'c-o', min: 40, max: 100, paso: 10, inicio: 60, unidad: 'km/h', decimales: 0 },
        { id: 'vB', etiqueta: 'B', color: 'c-i', min: 10, max: 50, paso: 10, inicio: 40, unidad: 'km/h', decimales: 0 },
      ],
      dibujo: v => ({ datos: v.modo === 'encuentro' ? rectaMov(300, v.vA, v.vB, 'encuentro') : rectaMov(300, v.vA, v.vB, 'alcance'), estado: {} }),
      lectura: v => { const rel = v.modo === 'encuentro' ? v.vA + v.vB : v.vA - v.vB; return [`Se acercan ${rel} km cada hora → `, t, ` = ${f(300 / rel)} h`]; },
      minimo: 4,
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
      ecuacion: [{ sub: [t, 'e'] }, ' = ', { frac: [D, [{ sub: ['v', 'A'] }, ' + ', { sub: ['v', 'B'] }]] }, ';   ', { sub: [t, 'a'] }, ' = ', { frac: [D, [{ sub: ['v', 'A'] }, ' − ', { sub: ['v', 'B'] }]] }],
      condicion: 'rapideces constantes, mismo instante de salida y, en el alcance, el que persigue va más rápido.',
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
      ecuacion: ['AB = 10A + B;   ABC = 100A + 10B + C'],
      condicion: 'la asignación es la misma en toda la operación y se respetan las llevadas.',
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
    juega: {
      consigna: 'Los números del 1 al 6 van en un triángulo, 3 por lado, y los tres lados suman S. Elige los vértices.',
      voz: 'Cada distribución cumple la regla. ¿Dan la misma S?',
      controles: [{ id: 'k', etiqueta: 'Vértices', opciones: Object.keys(DIST).map(k => ({ valor: k, texto: k.replace(/-/g, ', ') })) }],
      dibujo: v => ({ datos: tablaDist([v.k]), estado: {} }),
      lectura: v => [`3S = 21 + ${v.k.split('-').reduce((u, z) => u + +z, 0)} → S = ${sumaLado(v.k)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Se sabe solo que los números del 1 al 6 están en el triángulo con los tres lados de igual suma S. ¿Ese dato basta para saber S?',
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
        { estado: { fila: [0, 1] }, texto: 'Vértices 1, 2, 3 dan S = 9; vértices 4, 5, 6 dan S = 12.', ecuacion: ['3S = 27 → 9;   3S = 36 → 12'] },
        { estado: { fila: 0 }, texto: 'Dos casos válidos con S distintas prueban que el dato no basta.', ecuacion: ['dato extra «vértices 1, 2, 3»   ⇒   S = 9'] },
      ],
    },
    regla: {
      texto: 'Un dato es suficiente si deja una sola respuesta para lo que se pide. Para mostrar que no basta, sirven dos casos que lo cumplen con respuestas distintas.',
      ecuacion: ['3S = 21 + (suma de vértices)'],
      condicion: 'se pregunta por lo que se pide, no por todas las incógnitas. Un patrón observado no prueba que la respuesta sea única.',
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

  return {
    unidad: 'aritmetica.razonamiento-numerico',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tiras.js', '/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/recta.js'],
    historia: {
      texto: 'En el papiro Rhind, de Egipto, algunos problemas se resuelven partiendo de un valor cómodo y corrigiéndolo según el resultado. Esa estrategia se llamó después falsa posición. No es adivinar: funciona porque la relación es proporcional, y eso permite escalar el ensayo. Esta unidad recupera esa lógica: modelar, probar y comprobar.',
      pregunta: '¿Cuándo un buen intento se puede corregir con una regla?',
      fuente: { titulo: 'Egyptian mathematics, 1.1.2 Egyptian calculation — The Open University', url: 'https://www.open.edu/openlearn/science-maths-technology/mathematics-statistics/egyptian-mathematics/content-section-1.1.2' },
    },
    ideas: [falsa, regresivo, edades, moviles, cripto, unicidad],
  };
});
