/*
 * Teoría de «Probabilidades» (aritmetica.probabilidades). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 10) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR20 (equiprobabilidad), AR22 (recencia negativa) de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md;
 * los AT-* son hipótesis nuevas (denominador sin restringir, P(A|B) por P(B|A), esperanza que «debe» salir).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: contar casos en un espacio muestral visible y cambiar el denominador solo cuando cambia el universo.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px, sin audio.
 *   Resultado observable: calcula probabilidades clásicas, de la unión, condicionales, totales, de Bayes y esperanzas.
 *   Orden de atención: 1.º las casillas que cumplen · 2.º las que quedan fuera (tenues) · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · casillas que se marcan · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué al saber algo cambia el denominador?».
 * Colores (regla 4): A naranja (c-o), B turquesa (c-i), lo que cumple (A ∩ B o el evento pedido) verde (c-d), lo que
 * queda fuera o el error, rojo (c-h). Piezas: arit-tabla (los dados) y arit-tiras (árbol en barras y esperanza).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const A = { v: 'c-o', t: 'A' }, B = { v: 'c-i', t: 'B' };
  const P = x => ['P(', x, ')'];
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  // Fracción reducida como texto: dos escrituras del mismo número no pueden ser dos opciones distintas.
  const fr = (a, b) => { if (a === 0) return '0'; const g = mcd(a, b); return b / g === 1 ? String(a / g) : `${a / g}/${b / g}`; };
  function opciones(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) {
      if (!d.texto || vistos.has(d.texto) || /NaN|Infinity/.test(d.texto)) continue;
      vistos.add(d.texto);
      ops.push({ id: d.id, texto: d.texto, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const PARES = []; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) PARES.push([i, j]);
  const cuenta = fn => PARES.filter(([i, j]) => fn(i, j)).length;
  // Cuadrícula de dos dados: fila = primer dado, columna = segundo; en cada casilla, la suma.
  // color(i, j) → 'o' | 'i' | 'd' | 'h' para resaltar, null para dejarla normal; tenue(i, j) → fuera del universo.
  function dados(color = () => null, tenue = () => false) {
    return {
      columnas: ['',  ...[1, 2, 3, 4, 5, 6].map(String)], cabeza: true, filasMax: 6,
      filas: [1, 2, 3, 4, 5, 6].map(i => [String(i), ...[1, 2, 3, 4, 5, 6].map(j => {
        const c = color(i, j);
        return { t: String(i + j), color: c || undefined, resalta: !!c, tenue: tenue(i, j) };
      })]),
    };
  }

  // ---------- Idea 1: espacio muestral y casos igualmente probables ----------
  // Cambia: la suma pedida. Permanece: las 36 casillas, cada una un resultado igual de probable.
  // Progresa: las casillas que cumplen. Se reserva: (5, 6) y (6, 5) como dos resultados distintos.
  // Debe verse: el denominador es 36, no 11 sumas posibles.
  const espacio = {
    id: 'espacio',
    titulo: 'Contar en el espacio muestral',
    temas: ['Experimento aleatorio y espacio muestral', 'Probabilidad clásica y frecuencial'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Se lanzan dos dados. Cada casilla es un resultado (primer dado, segundo dado) con su suma. Elige una suma.',
      voz: 'Busca la suma que tiene más casillas.',
      controles: [{ id: 's', etiqueta: 'Suma', min: 2, max: 12, paso: 1, inicio: 4, decimales: 0 }],
      dibujo: v => ({ datos: dados((i, j) => (i + j === v.s ? 'd' : null)), estado: {} }),
      lectura: v => [`suma ${v.s}: ${cuenta((i, j) => i + j === v.s)} de 36 casillas`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Qué es más probable al lanzar dos dados: sacar un 5 y un 6, o sacar dos 6?',
      opciones: [
        { id: 'c', texto: 'Un 5 y un 6', correcta: true },
        { id: 'igual', texto: 'Las dos son igual de probables', error: 'AR20', siFuera: 'Sería cierto si el orden no contara. Un 5 y un 6 sale como (5, 6) o como (6, 5).' },
        { id: 'seis', texto: 'Dos 6', error: 'AR20', siFuera: 'Dos 6 ocupa una sola casilla: (6, 6).' },
      ],
      dibujo: { datos: dados(), estado: {} },
      revelar: { datos: dados((i, j) => ((i === 5 && j === 6) || (i === 6 && j === 5) ? 'd' : i === 6 && j === 6 ? 'h' : null)), estado: {} },
      coincide: 'Coincide: 2 casillas contra 1.',
    },
    mira: {
      datos: dados((i, j) => ((i === 5 && j === 6) || (i === 6 && j === 5) ? 'd' : i === 6 && j === 6 ? 'h' : null)),
      pasos: [
        { estado: {}, texto: 'El espacio muestral tiene 6 · 6 = 36 resultados igual de probables.', ecuacion: ['n(Ω) = 36'] },
        { estado: { fila: [4, 5] }, texto: '«Un 5 y un 6» son dos casillas: (5, 6) y (6, 5).', ecuacion: [P('5 y 6'), ' = ', { frac: ['2', '36'] }] },
        { estado: { fila: 5 }, texto: '«Dos 6» es una sola casilla.', ecuacion: [P('6 y 6'), ' = ', { frac: ['1', '36'] }] },
      ],
    },
    regla: {
      texto: 'Si todos los resultados son igual de probables, la probabilidad es casos favorables entre casos posibles.',
      ecuacion: [P(A), ' = ', { frac: [['n(', A, ')'], 'n(Ω)'] }],
      condicion: 'los resultados del espacio son equiprobables. La frecuencia relativa de muchos ensayos se acerca a P, pero no la demuestra.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 2) {
          const n = r.de([50, 60, 80, 100, 120]), k = r.ent(5, Math.floor(n / 3));
          return {
            pregunta: `Se lanzó un dado ${n} veces y salió 3 en ${k} de ellas. ¿Cuál es la frecuencia relativa del 3?`,
            opciones: opciones(fr(k, n), [
              { id: 'clasica', texto: '1/6', error: 'AT-FRECUENCIA', siFuera: '1/6 es la probabilidad clásica. La frecuencia sale de lo que pasó.' },
              { id: 'inv', texto: fr(n, k), error: 'AT-FRECUENCIA', siFuera: 'Se divide lo que salió entre los lanzamientos, no al revés.' },
              { id: 'resto', texto: fr(n - k, n), error: 'AT-FRECUENCIA', siFuera: 'Esa es la frecuencia de «no salió 3».' },
            ]),
            solucion: { texto: 'Veces que salió entre veces que se lanzó.', ecuacion: [{ frac: [String(k), String(n)] }, ` = ${fr(k, n)}`] },
          };
        }
        const ev = r.de([
          ['la suma sea ' + (s % 11 + 2), (i, j) => i + j === s % 11 + 2],
          ['salgan dos números iguales', (i, j) => i === j],
          ['la suma sea mayor que 9', (i, j) => i + j > 9],
          ['el primero sea mayor que el segundo', (i, j) => i > j],
          ['la suma sea par', (i, j) => (i + j) % 2 === 0],
        ]);
        const k = cuenta(ev[1]);
        return {
          pregunta: `Se lanzan dos dados. ¿Cuál es la probabilidad de que ${ev[0]}?`,
          dibujo: { datos: dados(), estado: {} },
          opciones: opciones(fr(k, 36), [
            { id: 'once', texto: fr(1, 11), error: 'AR20', siFuera: 'Las 11 sumas no son igual de probables; se cuentan las 36 casillas.' },
            { id: 'mitad', texto: fr(k, 18), error: 'AT-ORDEN', siFuera: 'Eso cuenta (a, b) y (b, a) como uno solo.' },
            { id: 'seis', texto: fr(Math.min(k, 6), 6), error: 'AT-UNIVERSO', siFuera: 'Con dos dados hay 36 resultados, no 6.' },
            { id: 'comp', texto: fr(36 - k, 36), error: 'AT-COMPLEMENTO', siFuera: 'Esa es la probabilidad de que no ocurra.' },
          ]),
          solucion: { texto: `${k} casillas de 36 cumplen.`, ecuacion: [{ frac: [String(k), '36'] }, ` = ${fr(k, 36)}`], dibujo: { datos: dados((i, j) => (ev[1](i, j) ? 'd' : null)), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: unión, complemento y excluyentes ----------
  // Cambia: el evento B. Permanece: A = «el primer dado es par». Progresa: casillas de A, de B y de los dos.
  // Se reserva: «al menos un 6» por complemento. Debe verse: las casillas verdes (de los dos) se cuentan una vez.
  const EVB = {
    'la suma es 7': (i, j) => i + j === 7,
    'el 2.º es 6': (i, j) => j === 6,
    'la suma es 3': (i, j) => i + j === 3,
  };
  const evA = i => i % 2 === 0;
  const colorAB = fnB => (i, j) => (evA(i) && fnB(i, j) ? 'd' : evA(i) ? 'o' : fnB(i, j) ? 'i' : null);
  const union = {
    id: 'union',
    titulo: 'Lo común se cuenta una vez',
    temas: ['Eventos y álgebra de eventos', 'Eventos excluyentes e independientes'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'A: el primer dado es par (naranja). Elige B (turquesa). Las casillas verdes están en los dos.',
      voz: 'Busca un B que no tenga casillas verdes.',
      controles: [{ id: 'b', etiqueta: 'B', opciones: Object.keys(EVB).map(t => ({ valor: t, texto: t })), inicio: 'la suma es 7' }],
      dibujo: v => ({ datos: dados(colorAB(EVB[v.b])), estado: {} }),
      lectura: v => { const fb = EVB[v.b]; return [P([A, ' ∪ ', B]), ` = ${fr(cuenta((i, j) => evA(i) || fb(i, j)), 36)} · `, P([A, ' ∩ ', B]), ` = ${fr(cuenta((i, j) => evA(i) && fb(i, j)), 36)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Se lanzan dos dados. ¿Cuál es la probabilidad de que salga al menos un 6?',
      opciones: [
        { id: 'c', texto: '11/36', correcta: true },
        { id: 'doble', texto: '1/3', error: 'AT-DOBLE', siFuera: '1/6 + 1/6 cuenta dos veces la casilla (6, 6).' },
        { id: 'uno', texto: '1/6', error: 'AT-UNIVERSO', siFuera: 'Eso es un solo dado. Aquí basta que cualquiera de los dos sea 6.' },
        { id: 'comp', texto: '25/36', error: 'AT-COMPLEMENTO', siFuera: '25/36 es la probabilidad de que no salga ningún 6.' },
      ],
      dibujo: { datos: dados(), estado: {} },
      revelar: { datos: dados((i, j) => (i === 6 && j === 6 ? 'd' : i === 6 || j === 6 ? 'o' : null), (i, j) => i !== 6 && j !== 6), estado: {} },
      coincide: 'Coincide: 6 + 6 − 1 = 11 casillas.',
    },
    mira: {
      datos: dados((i, j) => (i === 6 && j === 6 ? 'd' : i === 6 || j === 6 ? 'o' : null), (i, j) => i !== 6 && j !== 6),
      pasos: [
        { estado: { fila: 5 }, texto: 'Primer dado 6: una fila de 6 casillas.', ecuacion: [P('1.º = 6'), ' = ', { frac: ['6', '36'] }] },
        { estado: { columna: 6 }, texto: 'Segundo dado 6: otra columna de 6. (6, 6) está en las dos.', ecuacion: ['6 + 6 − 1 = 11'] },
        { estado: {}, texto: 'O por complemento: las tenues no tienen ningún 6.', ecuacion: ['1 − ', { frac: ['25', '36'] }, ' = ', { frac: ['11', '36'] }] },
      ],
    },
    regla: {
      texto: 'La probabilidad de la unión suma las dos y resta lo común, que se contó dos veces. El complemento es lo que falta para 1.',
      ecuacion: [P([A, ' ∪ ', B]), ' = ', P(A), ' + ', P(B), ' − ', P([A, ' ∩ ', B]), '   ·   ', P([A, '′']), ' = 1 − ', P(A)],
      condicion: 'si A y B son excluyentes (A ∩ B = ∅), no hay nada que restar y P(A ∪ B) = P(A) + P(B).',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), a = r.ent(5, 30), b = r.ent(5, 30), x = r.ent(0, Math.min(a, b, 10)), den = 50;
        const exc = x === 0;
        return {
          pregunta: ['En un sorteo, ', P(A), ` = ${fr(a, den)}, `, P(B), ` = ${fr(b, den)} y `, P([A, ' ∩ ', B]), ` = ${fr(x, den)}. ¿Cuánto vale `, P([A, ' ∪ ', B]), '?'],
          opciones: opciones(fr(a + b - x, den), [
            { id: 'suma', texto: exc ? fr(a + b + 1, den) : fr(a + b, den), error: 'AT-DOBLE', siFuera: exc ? 'Revisa la suma: con A ∩ B = ∅ no se resta nada.' : 'Eso cuenta dos veces lo que está en A y en B.' },
            { id: 'doble', texto: fr(Math.max(0, a + b - 2 * x), den), error: 'AT-DOBLE', siFuera: 'Lo común se resta una sola vez.' },
            { id: 'prod', texto: fr(a * b, den * den), error: 'AT-INDEP', siFuera: 'Multiplicar da P(A ∩ B) si son independientes, no la unión.' },
          ]),
          solucion: { texto: exc ? 'Son excluyentes: se suman.' : 'Se suman y se resta lo común.', ecuacion: [`${fr(a, den)} + ${fr(b, den)} − ${fr(x, den)} = ${fr(a + b - x, den)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: condicional: saber algo achica el universo ----------
  // Cambia: lo que se sabe (B). Permanece: A = «sale más de 3» en un dado. Progresa: las casillas fuera de B se apagan.
  // Se reserva: B = «salió par». Debe verse: el nuevo denominador es lo que queda encendido.
  const DADO = [1, 2, 3, 4, 5, 6];
  const EVC = { 'salió primo': x => [2, 3, 5].includes(x), 'salió impar': x => x % 2 === 1, 'salió 2 o más': x => x >= 2, 'salió par': x => x % 2 === 0 };
  const masDe3 = x => x > 3;
  const uno = (fnB, extra = {}) => Object.assign({
    columnas: DADO.map(x => ({ t: String(x), color: fnB && !fnB(x) ? undefined : 'i' })), filasMax: 1,
    filas: [DADO.map(x => ({ t: masDe3(x) ? 'A' : '·', color: masDe3(x) ? (fnB && !fnB(x) ? 'h' : 'd') : undefined, resalta: masDe3(x) && (!fnB || fnB(x)), tenue: fnB ? !fnB(x) : false }))],
  }, extra);
  const condicional = {
    id: 'condicional',
    titulo: 'Saber algo cambia el denominador',
    temas: ['Probabilidad condicional', 'Eventos excluyentes e independientes'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'A: el dado sale más de 3. Alguien mira el dado y te dice algo (B). Lo que ya no puede ser se apaga.',
      voz: 'Cuenta solo las casillas que siguen encendidas.',
      controles: [{ id: 'b', etiqueta: 'Te dicen', opciones: ['salió primo', 'salió impar', 'salió 2 o más'].map(t => ({ valor: t, texto: t })), inicio: 'salió primo' }],
      dibujo: v => ({ datos: uno(EVC[v.b]), estado: {} }),
      lectura: v => { const fb = EVC[v.b], nb = DADO.filter(fb).length, nab = DADO.filter(x => fb(x) && masDe3(x)).length; return [P([A, ' | ', B]), ` = ${nab}/${nb}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Se lanza un dado y te dicen que salió par. ¿Cuál es la probabilidad de que haya salido más de 3?'],
      opciones: [
        { id: 'c', texto: '2/3', correcta: true },
        { id: 'seis', texto: '1/3', error: 'AT-UNIVERSO', siFuera: 'Eso es 2/6: sigue dividiendo entre 6, pero ya sabes que salió par.' },
        { id: 'sin', texto: '1/2', error: 'AT-UNIVERSO', siFuera: '1/2 sería cierto sin saber nada: 3 de 6.' },
        { id: 'inv', texto: '1', error: 'AT-INVERSO', siFuera: 'Eso sería si todo par fuera mayor que 3; el 2 no lo es.' },
      ],
      dibujo: { datos: uno(null), estado: {} },
      revelar: { datos: uno(EVC['salió par']), estado: {} },
      coincide: 'Coincide: quedan 2, 4 y 6, y dos de ellos son más de 3.',
    },
    mira: {
      datos: uno(EVC['salió par']),
      pasos: [
        { estado: {}, texto: 'Saber que salió par deja solo 2, 4 y 6: el nuevo universo.', ecuacion: ['n(', B, ') = 3'] },
        { estado: { columna: 3 }, texto: 'De esos, más de 3 son 4 y 6.', ecuacion: ['n(', A, ' ∩ ', B, ') = 2'] },
        { estado: {}, texto: 'Se divide entre lo que quedó, no entre 6.', ecuacion: [P([A, ' | ', B]), ' = ', { frac: ['2', '3'] }] },
      ],
    },
    regla: {
      texto: 'Saber que pasó B achica el universo a B. Se cuenta lo de A que está dentro de B y se divide entre B.',
      ecuacion: [P([A, ' | ', B]), ' = ', { frac: [P([A, ' ∩ ', B]), P(B)] }],
      condicion: 'P(B) > 0. Si saber B no cambia nada, A y B son independientes: P(A ∩ B) = P(A)·P(B).',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const ev = r.de([
            ['el primer dado sea par', 'el segundo sea 6', (i) => i % 2 === 0, (i, j) => j === 6],
            ['la suma sea 7', 'el primero sea 1', (i, j) => i + j === 7, (i) => i === 1],
            ['la suma sea 8', 'el primero sea 2', (i, j) => i + j === 8, (i) => i === 2],
            ['salgan iguales', 'la suma sea par', (i, j) => i === j, (i, j) => (i + j) % 2 === 0],
          ]);
          const pa = cuenta(ev[2]), pb = cuenta(ev[3]), pab = cuenta((i, j) => ev[2](i, j) && ev[3](i, j));
          const indep = pab * 36 === pa * pb;
          return {
            pregunta: `Dos dados. A: ${ev[0]}. B: ${ev[1]}. ¿Son A y B independientes?`,
            dibujo: { datos: dados(), estado: {} },
            opciones: [
              { id: 'c', texto: indep ? 'Sí: P(A ∩ B) = P(A) · P(B)' : 'No: P(A ∩ B) ≠ P(A) · P(B)', correcta: true },
              { id: 'otro', texto: indep ? 'No: P(A ∩ B) ≠ P(A) · P(B)' : 'Sí: P(A ∩ B) = P(A) · P(B)', error: 'AT-INDEP', siFuera: 'Cuenta casillas: compara P(A ∩ B) con el producto.' },
              { id: 'exc', texto: 'Son excluyentes, entonces son independientes', error: 'AT-INDEP', siFuera: 'Excluyentes significa que no pasan juntos; eso es otra cosa.' },
            ],
            solucion: { texto: `P(A) = ${fr(pa, 36)}, P(B) = ${fr(pb, 36)}, P(A ∩ B) = ${fr(pab, 36)}.`, ecuacion: [`${fr(pa, 36)} · ${fr(pb, 36)} = ${fr(pa * pb, 1296)}`], dibujo: { datos: dados((i, j) => (ev[2](i, j) && ev[3](i, j) ? 'd' : ev[2](i, j) ? 'o' : ev[3](i, j) ? 'i' : null)), estado: {} } },
          };
        }
        const k = r.ent(4, 10), m = r.ent(Math.max(1, k - 6), Math.min(6, k - 1));
        const fnB = (i, j) => i + j === k, fnA = (i, j) => i === m || j === m;
        const nb = cuenta(fnB), nab = cuenta((i, j) => fnB(i, j) && fnA(i, j));
        return {
          pregunta: `Se lanzan dos dados y la suma es ${k}. ¿Cuál es la probabilidad de que alguno sea ${m}?`,
          dibujo: { datos: dados(), estado: {} },
          opciones: opciones(fr(nab, nb), [
            { id: 'seis', texto: fr(nab, 36), error: 'AT-UNIVERSO', siFuera: `Ya sabes que la suma es ${k}: el universo son esas casillas, no las 36.` },
            { id: 'inv', texto: fr(nab, cuenta(fnA)), error: 'AT-INVERSO', siFuera: 'Eso es al revés: la probabilidad de la suma sabiendo que hay un ' + m + '.' },
            { id: 'sin', texto: fr(cuenta(fnA), 36), error: 'AT-UNIVERSO', siFuera: 'Eso no usa lo que te dijeron.' },
          ]),
          solucion: { texto: `${nb} casillas suman ${k}; en ${nab} aparece un ${m}.`, ecuacion: [{ frac: [String(nab), String(nb)] }, ` = ${fr(nab, nb)}`], dibujo: { datos: dados((i, j) => (fnB(i, j) && fnA(i, j) ? 'd' : fnB(i, j) ? 'i' : null), (i, j) => !fnB(i, j)), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: probabilidad total y Bayes con 100 artículos ----------
  // Cambia: cuánto produce A y qué porcentaje sale fallado en cada máquina. Permanece: 100 artículos a la misma escala.
  // Progresa: fallados de A, fallados de B, la tira de todos los fallados. Se reserva: la pregunta al revés (Bayes).
  // Debe verse: entre los fallados, la parte de B puede ser mayor aunque B produzca menos.
  const fabrica = (pa, da, db, conJuntos = true) => {
    const fa = pa * da / 100, fb = (100 - pa) * db / 100;
    return {
      max: Math.max(pa, 100 - pa), filas: 3,   // la misma escala para las tres tiras; la máquina mayor llena el ancho
      tiras: [
        { rotulo: `Máquina A: ${f(pa)}`, color: 'o', tramos: [{ valor: fa, color: 'h', texto: f(fa), relleno: 0.45 }, { valor: pa - fa, color: 'o' }] },
        { rotulo: `Máquina B: ${f(100 - pa)}`, color: 'i', tramos: [{ valor: fb, color: 'h', texto: f(fb), relleno: 0.45 }, { valor: 100 - pa - fb, color: 'i' }] },
        { rotulo: `Fallados: ${f(fa + fb)}`, color: 'h', paso: conJuntos ? 0 : 9, tramos: [{ valor: fa, color: 'o', texto: f(fa), relleno: 0.45, paso: 2 }, { valor: fb, color: 'i', texto: f(fb), relleno: 0.45, paso: 3 }] },
      ],
    };
  };
  const bayes = {
    id: 'bayes',
    titulo: 'De dónde viene un fallado',
    temas: ['Probabilidad total y Bayes'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Dos máquinas hacen 100 artículos en total. Elige cuántos hace A y qué porcentaje falla en cada una. Los rojos son fallados.',
      voz: 'Mira la última tira: ¿de qué máquina vienen más fallados?',
      controles: [
        { id: 'pa', etiqueta: 'Hace A', color: 'c-o', min: 20, max: 80, paso: 10, inicio: 60, unidad: '', decimales: 0 },
        { id: 'da', etiqueta: 'Falla A', color: 'c-o', min: 10, max: 30, paso: 10, inicio: 10, unidad: '%', decimales: 0 },
        { id: 'db', etiqueta: 'Falla B', color: 'c-i', min: 10, max: 30, paso: 10, inicio: 20, unidad: '%', decimales: 0 },
      ],
      dibujo: v => ({ datos: fabrica(v.pa, v.da, v.db), estado: { paso: 3 } }),
      lectura: v => [`fallados: ${f(v.pa * v.da / 100 + (100 - v.pa) * v.db / 100)} de 100`],
      minimo: 3,
    },
    predice: {
      pregunta: 'A hace 60 % de los artículos y falla 10 %; B hace 40 % y falla 25 %. Un artículo salió fallado. ¿Qué probabilidad hay de que venga de B?',
      opciones: [
        { id: 'c', texto: '62,5 %', correcta: true },
        { id: 'prior', texto: '40 %', error: 'AT-BASE', siFuera: '40 % es lo que hace B de todo. Saber que salió fallado cambia el universo.' },
        { id: 'inv', texto: '25 %', error: 'AT-INVERSO', siFuera: '25 % es P(fallado | B). Se pidió al revés: P(B | fallado).' },
        { id: 'mitad', texto: '50 %', error: 'AR20', siFuera: 'Dos orígenes no son igual de probables por ser dos.' },
      ],
      dibujo: { datos: fabrica(60, 10, 25, false), estado: { paso: 0 } },
      revelar: { datos: fabrica(60, 10, 25), estado: { paso: 3 } },
      coincide: 'Coincide: de 16 fallados, 10 vienen de B.',
    },
    mira: {
      datos: fabrica(60, 10, 25),
      pasos: [
        { estado: { paso: 1 }, texto: 'De 100: A hace 60 y falla 6; B hace 40 y falla 10.', ecuacion: ['60 · 0,10 = 6   ·   40 · 0,25 = 10'] },
        { estado: { paso: 3 }, texto: 'Fallados en total: se suman los de cada máquina.', ecuacion: [P('F'), ' = 0,6 · 0,1 + 0,4 · 0,25 = 0,16'] },
        { estado: { paso: 3 }, texto: 'De esos 16, los de B son 10.', ecuacion: [P([B, ' | F']), ' = ', { frac: ['10', '16'] }, ' = 62,5 %'] },
      ],
    },
    regla: {
      texto: 'La probabilidad total suma lo que aporta cada caso. Bayes mira al revés: de lo que salió, qué parte vino de cada caso.',
      ecuacion: [P('F'), ' = Σ ', P({ sub: ['A', 'i'] }), ' P(F | ', { sub: ['A', 'i'] }, ')   ·   ', P([{ sub: ['A', 'i'] }, ' | F']), ' = ', { frac: [[P({ sub: ['A', 'i'] }), ' P(F | ', { sub: ['A', 'i'] }, ')'], P('F')] }],
      condicion: 'los casos Aᵢ no se solapan y juntos cubren todo. P(F | B) y P(B | F) son preguntas distintas.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), pa = r.de([30, 40, 50, 60, 70]), da = r.de([5, 10, 20]), db = r.de([10, 15, 20, 30]);
        const fa = pa * da / 100, fb = (100 - pa) * db / 100, tot = fa + fb;
        const pct = x => `${f(x, 2)} %`;
        if (s % 2 === 0) return {
          pregunta: `A hace ${pa} % y falla ${da} %; B hace ${100 - pa} % y falla ${db} %. ¿Qué porcentaje del total sale fallado?`,
          dibujo: { datos: fabrica(pa, da, db, false), estado: { paso: 0 } },
          opciones: opciones(pct(tot), [
            { id: 'prom', texto: pct((da + db) / 2), error: 'AR15', siFuera: 'Eso promedia sin pesar: A y B no hacen lo mismo.' },
            { id: 'suma', texto: pct(da + db), error: 'AT-DOBLE', siFuera: 'Cada porcentaje es de su máquina; se pesan por lo que hace cada una.' },
            { id: 'uno', texto: pct(fa), error: 'AT-BASE', siFuera: 'Faltan los fallados de B.' },
          ]),
          solucion: { texto: 'Se suma lo que aporta cada máquina.', ecuacion: [`${f(pa / 100)} · ${f(da / 100)} + ${f(1 - pa / 100)} · ${f(db / 100)} = ${f(tot / 100, 4)}`], dibujo: { datos: fabrica(pa, da, db), estado: { paso: 3 } } },
        };
        return {
          pregunta: `A hace ${pa} % y falla ${da} %; B hace ${100 - pa} % y falla ${db} %. Salió un fallado: ¿qué probabilidad hay de que sea de A?`,
          dibujo: { datos: fabrica(pa, da, db, false), estado: { paso: 0 } },
          opciones: opciones(pct(100 * fa / tot), [
            { id: 'prior', texto: pct(pa), error: 'AT-BASE', siFuera: `${pa} % es lo que hace A de todo, sin saber que falló.` },
            { id: 'inv', texto: pct(da), error: 'AT-INVERSO', siFuera: `${da} % es P(fallado | A); se pidió P(A | fallado).` },
            { id: 'otro', texto: pct(100 * fb / tot), error: 'AT-INVERSO', siFuera: 'Esa es la parte de los fallados que viene de B.' },
          ]),
          solucion: { texto: `De ${f(tot)} fallados por cada 100, ${f(fa)} son de A.`, ecuacion: [{ frac: [f(fa), f(tot)] }, ` = ${pct(100 * fa / tot)}`], dibujo: { datos: fabrica(pa, da, db), estado: { paso: 3 } } },
        };
      },
    },
  };

  // ---------- Idea 5: la esperanza es el promedio a la larga ----------
  // Cambia: el premio mayor. Permanece: las probabilidades de cada valor (largo de cada tira, sobre 1).
  // Progresa: cada tira aporta valor · probabilidad. Se reserva: el dado común (E = 3,5, que nunca sale).
  // Debe verse: la esperanza pesa cada valor por su probabilidad; no tiene que ser un resultado posible.
  const reparto = (vals, extra = {}) => Object.assign({
    max: 1, filas: vals.length, regla: { paso: 0.25, cada: 2 },
    tiras: vals.map(([x, p, q]) => ({ rotulo: `X = ${f(x)}`, color: 'o', fin: `${f(x)} · ${q} = ${f(x * p, 2)}`, tramos: [{ valor: p, color: 'i', texto: q }] })),
  }, extra);
  // El dado en una sola tira: seis caras de 1/6 cada una (compacto: la figura no tapa las opciones).
  const dado = conE => ({ max: 1, filas: 1, tiras: [{ rotulo: 'cada cara: 1/6', color: 'o', fin: conE ? 'E = 3,5' : '', tramos: [1, 2, 3, 4, 5, 6].map(x => ({ valor: 1 / 6, color: 'i', texto: String(x) })) }] });
  const esperanza = {
    id: 'esperanza',
    titulo: 'El promedio a la larga',
    temas: ['Variable aleatoria discreta y esperanza'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Una ruleta paga 0 soles la mitad de las veces, 2 soles un tercio y un premio un sexto. Cada tira mide su probabilidad.',
      voz: 'Sube el premio y mira cuánto aporta su tira.',
      controles: [{ id: 'g', etiqueta: 'Premio', color: 'c-o', min: 6, max: 30, paso: 6, inicio: 12, unidad: 'soles', decimales: 0 }],
      dibujo: v => ({ datos: reparto([[0, 1 / 2, '1/2'], [2, 1 / 3, '1/3'], [v.g, 1 / 6, '1/6']]), estado: {} }),
      lectura: v => [`E[X] = 0 + ${f(2 / 3)} + ${f(v.g / 6)} = ${f(2 / 3 + v.g / 6)} soles`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Se lanza un dado común y X es el número que sale. ¿Cuál es el valor esperado de X?',
      opciones: [
        { id: 'c', texto: '3,5', correcta: true },
        { id: 'posible', texto: '3, porque tiene que ser una cara', error: 'AT-ESPERANZA', siFuera: 'La esperanza es un promedio a la larga; no tiene que ser una cara.' },
        { id: 'max', texto: '6', error: 'AT-ESPERANZA', siFuera: 'Ese es el mayor valor, no el promedio.' },
        { id: 'suma', texto: '21', error: 'AT-ESPERANZA', siFuera: 'Eso suma las caras sin pesar cada una por 1/6.' },
      ],
      dibujo: { datos: dado(false), estado: {} },
      revelar: { datos: dado(true), estado: {} },
      coincide: 'Coincide: 21 · 1/6 = 3,5, que nunca sale en un tiro.',
    },
    mira: {
      datos: reparto([[0, 1 / 2, '1/2'], [2, 1 / 3, '1/3'], [12, 1 / 6, '1/6']]),
      pasos: [
        { estado: {}, texto: 'Cada valor pesa lo que mide su tira: su probabilidad.', ecuacion: ['1/2 + 1/3 + 1/6 = 1'] },
        { estado: {}, texto: 'Cada valor por su probabilidad: 0, 2/3 y 2.', ecuacion: ['0 · ½ + 2 · ⅓ + 12 · ⅙'] },
        { estado: {}, texto: 'Sumados: lo que se gana en promedio por tiro.', ecuacion: ['E[X] = 0 + 0,67 + 2 = 2,67 soles'] },
      ],
    },
    regla: {
      texto: 'Una variable aleatoria da un número a cada resultado. Su esperanza suma cada valor por su probabilidad: es el promedio a la larga.',
      ecuacion: ['E[X] = Σ x · P(X = x)'],
      condicion: 'las probabilidades suman 1. E[X] puede no ser un valor posible, y no obliga a que salga lo que «falta».',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const c = r.de([2, 3, 4, 5]), g = r.de([10, 12, 15, 18, 24, 30]);
          const e = g / 6 - c;
          return {
            pregunta: `Pagas S/ ${c} por lanzar un dado y ganas S/ ${g} si sale 6. ¿Cuánto ganas en promedio por juego?`,
            opciones: opciones(`${e < 0 ? 'pierdes' : 'ganas'} S/ ${f(Math.abs(e))}`, [
              { id: 'sin', texto: `ganas S/ ${f(g / 6)}`, error: 'AT-ESPERANZA', siFuera: 'Falta descontar lo que pagas en cada juego.' },
              { id: 'premio', texto: `ganas S/ ${f(g - c)}`, error: 'AT-ESPERANZA', siFuera: 'Eso pasa solo cuando sale 6; pesa 1/6.' },
              { id: 'signo', texto: `${e < 0 ? 'ganas' : 'pierdes'} S/ ${f(Math.abs(e))}`, error: 'AT-SIGNO', siFuera: 'Revisa el signo: compara lo que pagas con g/6.' },
            ]),
            solucion: { texto: 'Lo que ganas en promedio menos lo que pagas.', ecuacion: [`${g} · ${'1/6'} − ${c} = ${f(e)}`] },
          };
        }
        const xs = [r.ent(0, 3), r.ent(4, 7), r.ent(8, 12)];
        const pb = r.de([[1, 2, 1, 4], [1, 1, 2, 4], [2, 1, 1, 4], [1, 3, 1, 5], [3, 1, 1, 5]]);
        const ps = pb.slice(0, 3).map(k => k / pb[3]), qs = pb.slice(0, 3).map(k => fr(k, pb[3]));
        const e = xs.reduce((u, x, k) => u + x * ps[k], 0);
        return {
          pregunta: `X vale ${xs[0]}, ${xs[1]} o ${xs[2]} con probabilidades ${qs.join(', ')}. ¿Cuánto vale E[X]?`,
          dibujo: { datos: reparto(xs.map((x, k) => [x, ps[k], qs[k]]), { regla: null }), estado: {} },
          opciones: opciones(f(e), [
            { id: 'prom', texto: f((xs[0] + xs[1] + xs[2]) / 3), error: 'AR15', siFuera: 'Eso promedia sin pesar: cada valor pesa su probabilidad.' },
            { id: 'suma', texto: f(xs[0] + xs[1] + xs[2]), error: 'AT-ESPERANZA', siFuera: 'Falta multiplicar cada valor por su probabilidad.' },
            { id: 'moda', texto: f(xs[ps.indexOf(Math.max(...ps))]), error: 'AT-ESPERANZA', siFuera: 'Ese es el valor más probable, no el promedio.' },
          ]),
          solucion: { texto: 'Cada valor por su probabilidad, y se suma.', ecuacion: [xs.map((x, k) => `${x} · ${qs[k]}`).join(' + '), ` = ${f(e)}`] },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.probabilidades',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-tiras.js'],
    historia: {
      texto: 'En 1654, Pascal y Fermat se escribieron cartas sobre cómo repartir lo apostado en una partida interrumpida. El reparto no podía depender solo del marcador: había que pensar en todo lo que aún podía pasar. Hubo autores antes que ellos, pero la idea quedó: armar el espacio de resultados y justificar cada probabilidad. La notación de eventos vino después.',
      pregunta: '¿Cómo repartirías un premio si el juego se corta a la mitad?',
      fuente: { titulo: 'O’Connor y Robertson, Blaise Pascal — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Pascal/' },
    },
    ideas: [espacio, union, condicional, bayes, esperanza],
  };
});
