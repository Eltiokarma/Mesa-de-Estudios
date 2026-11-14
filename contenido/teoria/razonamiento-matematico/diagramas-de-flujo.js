/*
 * Teoría de «Diagramas de flujo y operadores» (razonamiento-matematico.diagramas-de-flujo).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 19); historia: Goldstine y von Neumann (IAS, 1947).
 * Precisión: el orden de las instrucciones decide el resultado; un operador definido conserva su definición aunque su
 * símbolo se parezca a una operación conocida.
 * Colores (regla 4): el contador i turquesa (c-i), el acumulador S naranja (c-o), la condición verde (c-d), lo que se
 * descarta rojo (c-h).
 * Compañero: Faro (zorro). Códigos: RMT-FLU-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ejecutar un diagrama paso a paso con una tabla de estados y aplicar un operador tal como está definido.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: halla la salida de un bucle, cuenta y acumula con una condición y evalúa operadores anidados.
 *   Orden de atención: 1.º la tabla de estados · 2.º la lectura · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿sumo antes o después de aumentar i?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const i = { v: 'c-i', t: 'i' }, S = { v: 'c-o', t: 'S' }, C = { v: 'c-i', t: 'C' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    r.barajar = xs => { const y = xs.slice(); for (let k = y.length - 1; k > 0; k--) { const j = Math.floor(r() * (k + 1)); [y[k], y[j]] = [y[j], y[k]]; } return y; };
    return r;
  }
  function opcionesNum(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: f(correcta), correcta: true }];
    for (const x of distractores) { if (vistos.has(x.valor) || !Number.isFinite(x.valor) || ops.length >= 4) continue; vistos.add(x.valor); ops.push({ id: x.id, texto: f(x.valor), error: x.error, siFuera: x.siFuera }); }
    return ops;
  }

  const plural = (n, uno, varios) => `${f(n, 0)} ${n === 1 ? uno : varios}`;
  // Gesto directo (docs/teoria.md §4b): las manijas viven en la geometría que exportan las piezas.
  const TAB = () => Kit.piezas['rm-tablero'], RECTA = () => Kit.piezas.recta;
  // La manija va junto a la última fila de la tabla de estados: bajarla agrega una vuelta, subirla la quita. vueltasAN(v) da el n que
  // deja v vueltas; si el dedo no cambia de fila, no cambia nada.
  const manijaVueltas = (datosDe, filasDe, vueltasAN) => ({ id: 'vueltas', etiqueta: 'última vuelta del bucle', color: 'c-d',
    donde: val => { const g = TAB().geometria(datosDe(val)); return { x: g.x0 - 20, y: g.y0 + (0.5 + filasDe(val)) * g.altoFila }; },
    mover: (pt, val) => { const g = TAB().geometria(datosDe(val)), v = Math.round((pt.y - g.y0) / g.altoFila - 0.5); return v === filasDe(val) ? {} : { n: vueltasAN(Math.max(1, v), val) }; } });

  // ---------- Idea 1: seguir un bucle ----------
  // Cambia: hasta qué valor corre el bucle · Permanece: «S ← S + i; i ← i + 1, mientras i ≤ n» · Progresa: las filas de
  // la tabla · Se reserva: invertir el orden de las dos instrucciones · Debe verse: cada fila usa el valor de i de esa vuelta.
  // paso(i0, S0, n, primeroSuma, inc, op) → filas [i, S] tras cada vuelta.
  function correr(n, primeroSuma = true, i0 = 1, inc = 1) {
    let ii = i0, SS = 0;
    const filas = [];
    while (ii <= n) {
      if (primeroSuma) { SS += ii; ii += inc; } else { ii += inc; SS += ii; }
      filas.push([ii, SS]);
      if (filas.length > 20) break;
    }
    return filas;
  }
  function traza(filas, extra = {}) {
    const vis = filas.slice(-6), desde = filas.length - vis.length;
    return {
      columnas: ['Vuelta', 'i', 'S'], filas: null, ancho: 70,
      celdas: [[{ t: 'inicio' }, { t: String(extra.i0 || 1), color: 'i' }, { t: '0', color: 'o' }]].concat(vis.map(([a, b], k) => [{ t: String(desde + k + 1) }, { t: String(a), color: 'i' }, { t: String(b), color: 'o', resalto: k === vis.length - 1 ? 'o' : undefined, desde: extra.paso ? k + 1 : 0 }])),
      notas: [{ t: extra.nota || `Sale S = ${filas.length ? filas[filas.length - 1][1] : 0}` }],
    };
  }
  const bucle = {
    id: 'seguir-un-bucle',
    titulo: 'La tabla de estados',
    temas: ['Seguir un diagrama con bucles y condiciones'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Empieza con i = 1 y S = 0. Mientras i ≤ n: primero S ← S + i, luego i ← i + 1. Cambia n y mira la tabla.',
      voz: 'Cada fila es una vuelta del bucle.',
      controles: [{ id: 'n', etiqueta: 'n', min: 1, max: 5, paso: 1, inicio: 3, decimales: 0, color: 'c-d' }],
      dibujo: val => ({ datos: traza(correr(val.n)), estado: {} }),
      lectura: val => [`Sale `, S, ` = ${correr(val.n).slice(-1)[0][1]} con `, i, ` = ${val.n + 1}`],
      minimo: 3,
      // Se arrastra la última fila de la tabla hacia abajo o arriba: cada fila más es una vuelta más (n sube en 1).
      arrastres: [manijaVueltas(val => traza(correr(val.n)), val => correr(val.n).length, v => v)],
    },
    predice: {
      pregunta: 'Mismo inicio y n = 3, pero ahora el orden se invierte: primero i ← i + 1 y luego S ← S + i. ¿Qué valor de S sale?',
      opciones: [
        { id: 'igual', texto: '6', error: 'RMT-FLU-1', siFuera: '6 sale con el orden de antes. Ahora se suma el i ya aumentado: 2, 3 y 4.' },
        { id: 'c', texto: String(correr(3, false).slice(-1)[0][1]), correcta: true },
        { id: 'cuatro', texto: '5', error: 'RMT-FLU-2', siFuera: 'El bucle no para al llegar i a 3: vuelve a preguntar con i = 3 y da otra vuelta.' },
      ],
      dibujo: { datos: traza([], { nota: 'Primero i ← i + 1, luego S ← S + i' }), estado: {} },
      revelar: { datos: traza(correr(3, false), { nota: 'Se sumaron 2, 3 y 4' }), estado: {} },
      coincide: 'Coincide: al aumentar i antes de sumar, se suman 2, 3 y 4.',
    },
    mira: {
      datos: traza(correr(3, false), { paso: true, nota: 'S = 2 + 3 + 4 = 9' }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Vuelta 1: 1 ≤ 3; i pasa a 2 y S suma 2.' },
        { estado: { corte: 2 }, texto: 'Vuelta 2: i pasa a 3; S suma 3.' },
        { estado: { corte: 3 }, texto: 'Vuelta 3: i pasa a 4; S suma 4. Como 4 > 3, sale.', ecuacion: [S, ' = 9'] },
      ],
    },
    regla: {
      texto: 'Un diagrama se sigue con una tabla: una fila por vuelta y una columna por variable. Cada instrucción usa el valor que la variable tiene en ese momento.',
      ecuacion: ['estado siguiente = regla(estado actual)'],
      condicion: 'se respeta el orden de las instrucciones y se revisa la condición del bucle en el lugar donde está.',
    },
    ahoraTu: {
      pieza: 'rm-tablero',
      voz: 'Arma la tabla de estados, vuelta por vuelta.',
      generar(s) {
        const r = azar(s), n = r.ent(3, 7), i0 = r.ent(1, 2), inc = r.ent(1, 2), primero = s % 2 === 0;
        const filas = correr(n, primero, i0, inc), bien = filas.slice(-1)[0][1];
        const otro = correr(n, !primero, i0, inc).slice(-1)[0][1];
        return {
          pregunta: `Inicio: i = ${i0}, S = 0. Mientras i ≤ ${n}: ${primero ? `S ← S + i; luego i ← i + ${inc}` : `i ← i + ${inc}; luego S ← S + i`}. ¿Qué valor de S sale?`,
          dibujo: { datos: traza([], { i0, nota: 'Completa la tabla' }), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'orden', valor: otro, error: 'RMT-FLU-1', siFuera: 'Ese resultado sale con el orden invertido.' },
            { id: 'una-menos', valor: correr(n - 1, primero, i0, inc).slice(-1)[0][1], error: 'RMT-FLU-2', siFuera: 'Falta la última vuelta: la condición se revisa otra vez.' },
            { id: 'una-mas', valor: correr(n + inc, primero, i0, inc).slice(-1)[0][1], error: 'RMT-FLU-3', siFuera: 'Se dio una vuelta de más.' },
          ]),
          solucion: { texto: `Se suman ${filas.length} valores de i.`, dibujo: { datos: traza(filas, { i0 }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: contadores y acumuladores ----------
  // Cambia: la condición · Permanece: la lista de números · Progresa: las filas que cumplen · Se reserva: contar y sumar
  // a la vez · Debe verse: el contador suma 1; el acumulador suma el número.
  const LISTA = [4, 7, 10, 3, 8, 15];
  const CONDS = { par: { t: 'es par', ok: x => x % 2 === 0 }, may5: { t: 'es mayor que 5', ok: x => x > 5 }, mul3: { t: 'es múltiplo de 3', ok: x => x % 3 === 0 }, may7: { t: 'es mayor que 7', ok: x => x > 7 } };
  const JUEGO = ['par', 'may5', 'mul3'];
  function cuenta(lista, cond, extra = {}) {
    let c = 0, ss = 0;
    const celdas = lista.map(x => {
      const ok = CONDS[cond].ok(x);
      if (ok) { c++; ss += x; }
      return [{ t: String(x) }, { marca: ok ? 'si' : 'no', color: ok ? 'd' : 'h' }, { t: String(c), color: 'i' }, { t: String(ss), color: 'o' }];
    });
    return { columnas: ['x', 'Cumple', 'C', 'S'], filas: null, ancho: 70, celdas, notas: [{ t: extra.nota || `Condición: ${CONDS[cond].t} · C = ${c}, S = ${ss}` }] };
  }
  const resumen = (lista, cond) => { const xs = lista.filter(CONDS[cond].ok); return { c: xs.length, s: xs.reduce((m, x) => m + x, 0) }; };
  // Sin arrastre: la condición es una regla escrita (par, mayor que 5…), no una cantidad que se desliza. En el
  // laboratorio, la condición «mayor que k» sí se arrastra sobre una recta.
  const contadores = {
    id: 'contador-y-acumulador',
    titulo: 'Contar no es sumar',
    temas: ['Contadores y acumuladores'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Se recorre la lista. Si el número cumple la condición: C ← C + 1 y S ← S + número. Cambia la condición.',
      voz: 'C sube de uno en uno; S sube lo que vale el número.',
      controles: [{ id: 'c', etiqueta: 'Condición', opciones: JUEGO.map(k => ({ valor: k, texto: CONDS[k].t })) }],
      dibujo: val => ({ datos: cuenta(LISTA, val.c), estado: {} }),
      lectura: val => { const z = resumen(LISTA, val.c); return [C, ` = ${z.c} · `, S, ` = ${z.s}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Con la lista 5, 12, 9, 6, 11 y la condición «es mayor que 7», ¿qué valores salen?',
      opciones: [
        { id: 'c', texto: 'C = 3 y S = 32', correcta: true },
        { id: 'cambio', texto: 'C = 32 y S = 3', error: 'RMT-FLU-4', siFuera: 'El contador suma 1 por número; el acumulador suma el número.' },
        { id: 'todos', texto: 'C = 5 y S = 43', error: 'RMT-FLU-5', siFuera: 'Esos son todos los números; solo cuentan los que cumplen.' },
        { id: 'igual', texto: 'C = 3 y S = 26', error: 'RMT-FLU-6', siFuera: '26 deja fuera el 9, que también es mayor que 7.' },
      ],
      dibujo: { datos: { columnas: ['x', 'Cumple', 'C', 'S'], filas: null, ancho: 70, celdas: [5, 12, 9, 6, 11].map(x => [{ t: String(x) }, '', '', '']), notas: [{ t: 'Condición: es mayor que 7' }] }, estado: {} },
      revelar: { datos: cuenta([5, 12, 9, 6, 11], 'may7'), estado: {} },
      coincide: 'Coincide: cumplen 12, 9 y 11: tres números que suman 32.',
    },
    mira: {
      datos: cuenta(LISTA, 'par'),
      pasos: [
        { estado: { corte: 0 }, texto: '4 es par: C pasa a 1 y S a 4.' },
        { estado: { corte: 0 }, texto: '7 no cumple: C y S se quedan igual.' },
        { estado: { corte: 0 }, texto: 'Al final, C cuenta los pares y S los suma.', ecuacion: [C, ' = 3', '   ·   ', S, ' = 4 + 10 + 8 = 22'] },
      ],
    },
    regla: {
      texto: 'Un contador empieza en 0 y suma 1 cada vez que pasa algo. Un acumulador empieza en 0 y suma el valor de lo que pasa.',
      ecuacion: [C, ' ← ', C, ' + ', { llave: ['1'], nota: 'uno por vez', color: 'c-i' }, '   ·   ', S, ' ← ', S, ' + ', { llave: ['x'], nota: 'el número', color: 'c-o' }],
      condicion: 'los dos se ponen en 0 antes del bucle y solo cambian cuando se cumple la condición.',
    },
    ahoraTu: {
      pieza: 'rm-tablero',
      voz: 'Marca primero qué números cumplen.',
      generar(s) {
        const r = azar(s), lista = Array.from({ length: 6 }, () => r.ent(1, 20)), cond = JUEGO[s % 3];
        const z = resumen(lista, cond), pide = s % 2 ? 'S' : 'C';
        const bien = pide === 'C' ? z.c : z.s;
        return {
          pregunta: `Con la lista ${lista.join(', ')}, si el número ${CONDS[cond].t}: C ← C + 1 y S ← S + número. ¿Qué valor tiene ${pide} al final?`,
          dibujo: { datos: { columnas: ['x', 'Cumple', 'C', 'S'], filas: null, ancho: 70, celdas: lista.map(x => [{ t: String(x) }, '', '', '']), notas: [{ t: `Condición: ${CONDS[cond].t}` }] }, estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'otro', valor: pide === 'C' ? z.s : z.c, error: 'RMT-FLU-4', siFuera: pide === 'C' ? 'Ese es S: el contador suma 1 por número.' : 'Ese es C: el acumulador suma el número.' },
            { id: 'todos', valor: pide === 'C' ? 6 : lista.reduce((m, x) => m + x, 0), error: 'RMT-FLU-5', siFuera: 'Solo cuentan los que cumplen.' },
            { id: 'no', valor: pide === 'C' ? 6 - z.c : lista.reduce((m, x) => m + x, 0) - z.s, error: 'RMT-FLU-7', siFuera: 'Esos son los que no cumplen.' },
          ]),
          solucion: { texto: `Cumplen ${z.c} números, que suman ${z.s}.`, dibujo: { datos: cuenta(lista, cond), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: operadores definidos ----------
  // Cambia: a y b · Permanece: la definición a ∗ b = 2a + b · Progresa: a ∗ b contra b ∗ a · Se reserva: el operador
  // anidado · Debe verse: el símbolo no es una multiplicación; se aplica la definición, de adentro hacia afuera.
  const op = (a, b) => 2 * a + b;
  function tablaOp(a, b, extra = {}) {
    return {
      columnas: ['', 'Cuenta', 'Valor'], filas: null, ancho: 96,
      celdas: [[{ t: `${a} ∗ ${b}` }, { t: `2·${a} + ${b}` }, { t: String(op(a, b)), color: 'o' }], [{ t: `${b} ∗ ${a}` }, { t: `2·${b} + ${a}` }, { t: String(op(b, a)), color: 'i' }]],
      notas: [{ t: extra.nota || 'Definición: a ∗ b = 2a + b' }],
    };
  }
  // Sin arrastre: a y b son datos sueltos de la definición; la tabla no tiene un objeto que los represente.
  const operadores = {
    id: 'operadores',
    titulo: 'El operador manda su regla',
    temas: ['Operadores definidos por una regla'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Se define a ∗ b = 2a + b. Cambia a y b y compara a ∗ b con b ∗ a.',
      voz: 'El orden importa en este operador.',
      controles: [
        { id: 'a', etiqueta: 'a', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: 1, max: 6, paso: 1, inicio: 5, decimales: 0, color: 'c-i' },
      ],
      dibujo: val => ({ datos: tablaOp(val.a, val.b), estado: {} }),
      lectura: val => [`${val.a} ∗ ${val.b} = ${op(val.a, val.b)}`, '   ·   ', `${val.b} ∗ ${val.a} = ${op(val.b, val.a)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Con la misma definición, a ∗ b = 2a + b, ¿cuánto vale (2 ∗ 1) ∗ 3?',
      opciones: [
        { id: 'mult', texto: '6', error: 'RMT-FLU-8', siFuera: '6 sería si ∗ fuera la multiplicación; aquí ∗ tiene su propia regla.' },
        { id: 'c', texto: String(op(op(2, 1), 3)), correcta: true },
        { id: 'orden', texto: String(op(2, op(1, 3))), error: 'RMT-FLU-9', siFuera: 'Eso calcula primero 1 ∗ 3; el paréntesis pide 2 ∗ 1 primero.' },
        { id: 'swap', texto: String(op(3, op(2, 1))), error: 'RMT-FLU-10', siFuera: 'Eso pone el 3 primero; en este operador el orden importa.' },
      ],
      dibujo: { datos: tablaOp(2, 1), estado: {} },
      revelar: { datos: Object.assign(tablaOp(2, 1), { celdas: tablaOp(2, 1).celdas.slice(0, 1).concat([[{ t: '5 ∗ 3' }, { t: '2·5 + 3' }, { t: '13', color: 'o', resalto: 'o' }]]), notas: [{ t: 'Primero el paréntesis, después el resto' }] }), estado: {} },
      coincide: 'Coincide: 2 ∗ 1 = 5 y luego 5 ∗ 3 = 13.',
    },
    mira: {
      datos: Object.assign(tablaOp(2, 1), { celdas: tablaOp(2, 1).celdas.slice(0, 1).concat([[{ t: '5 ∗ 3' }, { t: '2·5 + 3' }, { t: '13', color: 'o' }]]) }),
      pasos: [
        { estado: { corte: 0 }, texto: 'El paréntesis primero: 2 ∗ 1 = 2 · 2 + 1.', ecuacion: ['2 ∗ 1 = 5'] },
        { estado: { corte: 0 }, texto: 'Ese resultado es la nueva a.', ecuacion: ['5 ∗ 3 = 2 · 5 + 3 = 13'] },
        { estado: { corte: 0 }, texto: 'Como a ∗ b ≠ b ∗ a, no se cambia el orden.' },
      ],
    },
    regla: {
      texto: 'Un operador definido se calcula reemplazando cada letra de la definición por su valor. Primero lo de adentro de los paréntesis; el orden de los datos importa.',
      ecuacion: ['a ∗ b = 2a + b', '   ·   ', '(x∗y)∗z = 2', { llave: ['(2x + y)'], nota: 'la nueva a', color: 'c-o' }, ' + z'],
      condicion: 'el símbolo no significa lo de siempre: vale solo la definición dada, sin suponer que se puede cambiar el orden.',
    },
    ahoraTu: {
      voz: 'Reemplaza en la definición, de adentro hacia afuera.',
      generar(s) {
        const r = azar(s);
        const DEF = [
          { t: 'a ∗ b = 2a + b', g: (a, b) => 2 * a + b },
          { t: 'a ∗ b = a² − b', g: (a, b) => a * a - b },
          { t: 'a ∗ b = ab + a', g: (a, b) => a * b + a },
          { t: 'a ∗ b = 3a − 2b', g: (a, b) => 3 * a - 2 * b },
          { t: 'a ∗ b = a + b + ab', g: (a, b) => a + b + a * b },
        ][s % 5];
        const x0 = r.ent(1, 4), y0 = r.ent(1, 4), z0 = r.ent(1, 5);
        const bien = DEF.g(DEF.g(x0, y0), z0);
        return {
          pregunta: `Se define ${DEF.t}. ¿Cuánto vale (${x0} ∗ ${y0}) ∗ ${z0}?`,
          opciones: opcionesNum(bien, [
            { id: 'orden', valor: DEF.g(x0, DEF.g(y0, z0)), error: 'RMT-FLU-9', siFuera: 'Eso resuelve primero lo de la derecha.' },
            { id: 'swap', valor: DEF.g(z0, DEF.g(x0, y0)), error: 'RMT-FLU-10', siFuera: 'Cambiaste el orden de los datos; en este operador importa.' },
            { id: 'mult', valor: x0 * y0 * z0, error: 'RMT-FLU-8', siFuera: 'Eso multiplica; el operador tiene su propia regla.' },
          ]),
          solucion: { texto: `Primero ${x0} ∗ ${y0} = ${DEF.g(x0, y0)}; luego ${DEF.g(x0, y0)} ∗ ${z0}.`, ecuacion: [`${DEF.g(x0, y0)} ∗ ${z0} = ${bien}`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: el bucle con inicio, salto y orden elegibles; el borde de la tabla se arrastra.
  const corrida = val => correr(val.n, val.orden === 'suma', val.i0, val.inc);
  const datosBucle = val => traza(corrida(val), { i0: val.i0 });
  const mesaBucle = {
    id: 'bucle-libre', titulo: 'Bucle a tu medida', pieza: 'rm-tablero',
    consigna: 'Elige el inicio de i, cuánto sube y el orden. Arrastra la última fila de la tabla para dar más vueltas.',
    controles: [
      { id: 'i0', etiqueta: 'i empieza en', min: 0, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      { id: 'inc', etiqueta: 'i sube', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      { id: 'n', etiqueta: 'Mientras i ≤', min: 1, max: 12, paso: 1, inicio: 3, decimales: 0, color: 'c-d' },
      { id: 'orden', etiqueta: 'Orden', opciones: [{ valor: 'suma', texto: 'Suma, luego sube' }, { valor: 'sube', texto: 'Sube, luego suma' }] },
    ],
    dibujo: val => ({ datos: datosBucle(val), estado: {} }),
    lectura: val => { const c = corrida(val); return [plural(c.length, 'vuelta', 'vueltas'), ': sale ', S, ` = ${c.length ? c[c.length - 1][1] : 0}`]; },
    // Las vueltas se cuentan con la tabla visible (hasta 6 filas); n queda en el último i que entra.
    arrastres: [manijaVueltas(datosBucle, val => Math.min(6, corrida(val).length), (v, val) => val.i0 + (v - 1) * val.inc)],
  };
  // Mesa 2: contar y sumar los que pasan un umbral, sobre una recta: el umbral k se arrastra.
  const LISTA_L = [2, 4, 7, 10, 13, 15, 18];
  const datosUmbral = val => ({
    min: 0, max: 20, paso: 1, cada: 5, decimales: 0, variable: 'x', color: 'h', filas: 1,
    elementos: [{ tipo: 'intervalo', a: val.k, b: null, ca: false, color: 'd', rotulo: `x > ${val.k}`, fila: 1 }]
      .concat(LISTA_L.map(x => ({ tipo: 'punto', x, color: x > val.k ? 'd' : 'h' }))),
  });
  const mesaUmbral = {
    id: 'umbral', titulo: 'Contar y sumar con un umbral', pieza: 'recta',
    consigna: 'Lista: 2, 4, 7, 10, 13, 15, 18. Cuentan los mayores que k. Arrastra k y mira cómo cambian C y S.',
    controles: [{ id: 'k', etiqueta: 'k', min: 0, max: 19, paso: 1, inicio: 8, decimales: 0, color: 'c-d' }],
    dibujo: val => ({ datos: datosUmbral(val), estado: {} }),
    lectura: val => { const xs = LISTA_L.filter(x => x > val.k); return [`x > ${val.k}: `, C, ` = ${xs.length}`, '   ·   ', S, ` = ${xs.reduce((m, x) => m + x, 0)}`]; },
    arrastres: [{ id: 'k', etiqueta: 'umbral k', color: 'c-d',
      donde: val => { const g = RECTA().geometria(datosUmbral(val)); return { x: g.x(val.k), y: g.filaY(1) }; },
      mover: (pt, val) => { const g = RECTA().geometria(datosUmbral(val)); return { k: 20 * (pt.x - g.x(0)) / (g.x(20) - g.x(0)) }; } }],
  };
  // Mesa 3: cinco operadores definidos; se comparan a ∗ b, b ∗ a y (a ∗ b) ∗ b. Sin arrastre: los datos son números sueltos.
  const DEFS = [
    { t: 'a ∗ b = 2a + b', c: (a, b) => `2·${a} + ${b}`, g: (a, b) => 2 * a + b },
    { t: 'a ∗ b = a² − b', c: (a, b) => `${a}² − ${b}`, g: (a, b) => a * a - b },
    { t: 'a ∗ b = ab + a', c: (a, b) => `${a}·${b} + ${a}`, g: (a, b) => a * b + a },
    { t: 'a ∗ b = a + b + ab', c: (a, b) => `${a} + ${b} + ${a}·${b}`, g: (a, b) => a + b + a * b },
  ];
  const datosOp = val => {
    const D = DEFS[val.d], ab = D.g(val.a, val.b), ba = D.g(val.b, val.a);
    return {
      columnas: ['', 'Cuenta', 'Valor'], filas: null, ancho: 104,
      celdas: [[{ t: `${val.a} ∗ ${val.b}` }, { t: D.c(val.a, val.b) }, { t: String(ab), color: 'o' }], [{ t: `${val.b} ∗ ${val.a}` }, { t: D.c(val.b, val.a) }, { t: String(ba), color: 'i' }]],
      notas: [{ t: `${D.t}: ${ab === ba ? 'aquí da lo mismo' : 'el orden importa'}` }],
    };
  };
  const mesaOp = {
    id: 'operadores-libres', titulo: 'Operadores a elegir', pieza: 'rm-tablero',
    consigna: 'Elige una definición y prueba varios a y b. Busca un operador donde el orden no importe nunca.',
    controles: [
      { id: 'd', etiqueta: 'Definición', opciones: DEFS.map((D, k) => ({ valor: k, texto: D.t })) },
      { id: 'a', etiqueta: 'a', min: 0, max: 6, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      { id: 'b', etiqueta: 'b', min: 0, max: 6, paso: 1, inicio: 5, decimales: 0, color: 'c-i' },
    ],
    dibujo: val => ({ datos: datosOp(val), estado: {} }),
    lectura: val => { const D = DEFS[val.d]; return [`${val.a} ∗ ${val.b} = ${D.g(val.a, val.b)}`, '   ·   ', `${val.b} ∗ ${val.a} = ${D.g(val.b, val.a)}`]; },
  };

  return {
    unidad: 'razonamiento-matematico.diagramas-de-flujo',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-tablero.js', '/nucleo/kit/piezas/recta.js'],
    // Laboratorio: el bucle con inicio, salto y orden a elegir; el umbral que se arrastra sobre la recta; y cuatro
    // operadores para comparar a ∗ b con b ∗ a.
    laboratorio: [mesaBucle, mesaUmbral, mesaOp],
    historia: {
      texto: 'En 1947, Herman Goldstine y John von Neumann describieron con diagramas los procedimientos para las primeras computadoras electrónicas. Los algoritmos son mucho más antiguos, pero esos informes hicieron visibles las decisiones, las repeticiones y los cambios de estado. Un diagrama se entiende ejecutándolo con un dato concreto.',
      pregunta: '¿Qué cambia si dos instrucciones se cambian de lugar?',
      fuente: { titulo: 'The Electronic Computer Project · archivo del Institute for Advanced Study', url: 'https://www.ias.edu/ideas/electronic-computer-project' },
    },
    ideas: [bucle, contadores, operadores],
  };
});
