/*
 * Teoría de «Números reales e intervalos» (algebra.numeros-reales). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 2), expediente teoria-152-unidades (Álgebra) y
 * historia-ecuaciones (pp. 57–68). Errores: NR* de plantillas/numeros-reales (hipótesis), AL20 de
 * docs/investigacion/algebra-funciones-ideas-erroneas.md y TAL-* nuevos (hipótesis, rutinas/teoria-algebra.md).
 * Colores (regla 4): a y el intervalo A naranja (c-o), b y el intervalo B turquesa (c-i), resultado verde (c-d),
 * el factor c y lo que se descarta rojo (c-h).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · decidir con la recta qué conserva el orden, qué entra en un intervalo y qué propiedad tiene una operación.
 * Persona y condiciones · 3.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · opera intervalos cuidando cada extremo, sabe cuándo se invierte una desigualdad y comprueba propiedades de una tabla.
 * Orden de atención · 1.º la recta o la tabla · 2.º el extremo o la casilla que cambia · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué (0, 1) no tiene máximo y por qué (−1, 3] ∩ (3, 5) es vacío.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const a = { v: 'c-o', t: 'a' }, b = { v: 'c-i', t: 'b' }, c = { v: 'c-h', t: 'c' }, x = { v: 'c-o', t: 'x' }, y = { v: 'c-i', t: 'y' };
  const A = { v: 'c-o', t: 'A' }, B = { v: 'c-i', t: 'B' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r.mezclar = l => { const z = l.slice(); for (let i = z.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [z[i], z[j]] = [z[j], z[i]]; } return z; };
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }

  // ---------- Intervalos: { a, b, ca, cb } con a o b null para el infinito; operaciones exactas ----------
  const vacio = I => !I || (I.a !== null && I.b !== null && (I.a > I.b || (I.a === I.b && !(I.ca && I.cb))));
  function inter(I, J) {
    let lo, clo, hi, chi;
    if (I.a === null) { lo = J.a; clo = J.ca; } else if (J.a === null || I.a > J.a) { lo = I.a; clo = I.ca; } else if (J.a > I.a) { lo = J.a; clo = J.ca; } else { lo = I.a; clo = I.ca && J.ca; }
    if (I.b === null) { hi = J.b; chi = J.cb; } else if (J.b === null || I.b < J.b) { hi = I.b; chi = I.cb; } else if (J.b < I.b) { hi = J.b; chi = J.cb; } else { hi = I.b; chi = I.cb && J.cb; }
    const R = { a: lo, b: hi, ca: lo === null ? false : clo, cb: hi === null ? false : chi };
    return vacio(R) ? null : R;
  }
  // Unión de dos intervalos: uno o dos trozos (se juntan si se cortan o se tocan con el punto incluido).
  function union(I, J) {
    const [P, Q] = (I.a === null || (J.a !== null && I.a <= J.a)) ? [I, J] : [J, I];
    const separados = P.b !== null && Q.a !== null && (P.b < Q.a || (P.b === Q.a && !P.cb && !Q.ca));
    if (separados) return [P, Q];
    const fin = P.b === null || Q.b === null ? { b: null, cb: false } : P.b > Q.b ? { b: P.b, cb: P.cb } : Q.b > P.b ? { b: Q.b, cb: Q.cb } : { b: P.b, cb: P.cb || Q.cb };
    const ini = P.a === Q.a && P.a !== null ? { a: P.a, ca: P.ca || Q.ca } : { a: P.a, ca: P.ca };
    return [{ a: ini.a, ca: ini.ca, b: fin.b, cb: fin.cb }];
  }
  const num = v => f(v);
  const texto = I => {
    if (!I) return '∅';
    if (I.a !== null && I.a === I.b) return `{${num(I.a)}}`;
    return `${I.a === null ? '(−∞' : (I.ca ? '[' : '(') + num(I.a)}, ${I.b === null ? '+∞)' : num(I.b) + (I.cb ? ']' : ')')}`;
  };
  const textoU = l => (l && l.length ? l.map(texto).join(' ∪ ') : '∅');
  const elem = (I, color, fila, rotulo, desde) => (I && I.a !== null && I.a === I.b
    ? { tipo: 'punto', x: I.a, color, fila, rotulo, desde }
    : { tipo: 'intervalo', a: I.a, b: I.b, ca: I.ca, cb: I.cb, color, fila, rotulo, desde });

  // ---------- Idea 1: un negativo voltea el orden ----------
  // Cambia: a, b y el factor c · Permanece: la recta y el orden a < b · Progresa: los puntos ca y cb
  // · Se reserva: el factor negativo, que cruza las flechas · Debe verse: sumar corre; multiplicar por negativo refleja.
  const rectaOrden = (av, bv, cv) => {
    const ca = cv * av, cb = cv * bv;
    return {
      datos: {
        min: -10, max: 10, paso: 1, cada: 2, decimales: 0, variable: 'x', color: 'o', filas: 2,
        elementos: [
          { tipo: 'punto', x: av, color: 'o', rotulo: 'a', fila: 1 }, { tipo: 'punto', x: bv, color: 'i', rotulo: 'b', fila: 1 },
          { tipo: 'punto', x: ca, color: 'o', rotulo: 'ca', fila: 2 }, { tipo: 'punto', x: cb, color: 'i', rotulo: 'cb', fila: 2 },
        ],
        alt: `a = ${f(av)} y b = ${f(bv)}; multiplicados por ${f(cv)} quedan en ${f(ca)} y ${f(cb)}`,
      }, estado: {},
    };
  };
  const rel = (u, v) => (u < v ? '<' : u > v ? '>' : '=');
  const orden = {
    id: 'orden',
    titulo: 'Un negativo voltea el orden',
    temas: ['Axiomas de cuerpo y de orden', 'Desigualdades'],
    pieza: 'recta',
    juega: {
      consigna: 'Elige a < b y un factor c. Arriba quedan c·a y c·b. Mira si siguen en el mismo orden.',
      voz: 'Prueba un c positivo, uno negativo y el cero.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: -3, max: 1, paso: 1, inicio: -1, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 3, paso: 1, inicio: 2, decimales: 0 },
        { id: 'c', etiqueta: 'c', color: 'c-h', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => rectaOrden(val.a, val.b, val.c),
      lectura: val => [a, ' < ', b, ' → ', c, a, ` = ${f(val.c * val.a)} ${rel(val.c * val.a, val.c * val.b)} ${f(val.c * val.b)} = `, c, b],
      minimo: 3,
    },
    predice: {
      pregunta: ['Si ', a, ' < ', b, ', ¿qué relación hay entre ', a, ' − 5 y ', b, ' − 5?'],
      opciones: [
        { id: 'c', texto: [a, ' − 5 < ', b, ' − 5'], correcta: true },
        { id: 'voltea', texto: [a, ' − 5 > ', b, ' − 5'], error: 'TAL-RESTA-VOLTEA', siFuera: 'El orden se invierte al multiplicar por un negativo. Restar 5 corre los dos puntos lo mismo.' },
        { id: 'depende', texto: 'Depende de los signos de a y b', error: 'TAL-DEPENDE', siFuera: 'Los signos importan al multiplicar. Al restar, los dos se corren 5 a la izquierda.' },
      ],
      dibujo: { datos: { min: -8, max: 4, paso: 1, cada: 2, decimales: 0, variable: 'x', color: 'o', filas: 2, elementos: [{ tipo: 'punto', x: -1, color: 'o', rotulo: 'a', fila: 1 }, { tipo: 'punto', x: 2, color: 'i', rotulo: 'b', fila: 1 }], alt: 'a = −1 y b = 2 en la recta' }, estado: {} },
      revelar: { datos: { min: -8, max: 4, paso: 1, cada: 2, decimales: 0, variable: 'x', color: 'o', filas: 2, elementos: [
        { tipo: 'punto', x: -1, color: 'o', rotulo: 'a', fila: 1 }, { tipo: 'punto', x: 2, color: 'i', rotulo: 'b', fila: 1 },
        { tipo: 'punto', x: -6, color: 'o', rotulo: 'a − 5', fila: 2 }, { tipo: 'punto', x: -3, color: 'i', rotulo: 'b − 5', fila: 2 },
      ], alt: 'a − 5 = −6 queda a la izquierda de b − 5 = −3, como antes' }, estado: {} },
      coincide: 'Coincide: restar 5 corre a y b igual; el de la izquierda sigue a la izquierda.',
    },
    mira: {
      datos: {
        min: -6, max: 6, paso: 1, cada: 2, decimales: 0, variable: 'x', color: 'o', filas: 3,
        elementos: [
          { tipo: 'punto', x: -1, color: 'o', rotulo: 'a', fila: 0 }, { tipo: 'punto', x: 2, color: 'i', rotulo: 'b', fila: 0 },
          { tipo: 'punto', x: 2, color: 'o', rotulo: 'a + 3', fila: 1, desde: 2 }, { tipo: 'punto', x: 5, color: 'i', rotulo: 'b + 3', fila: 1, desde: 2 },
          { tipo: 'punto', x: -2, color: 'o', rotulo: '2a', fila: 2, desde: 3 }, { tipo: 'punto', x: 4, color: 'i', rotulo: '2b', fila: 2, desde: 3 },
          { tipo: 'punto', x: 2, color: 'o', rotulo: '−2a', fila: 3, desde: 4 }, { tipo: 'punto', x: -4, color: 'i', rotulo: '−2b', fila: 3, desde: 4 },
        ],
        alt: 'a = −1 < b = 2; sumando 3 y multiplicando por 2 el orden se conserva; por −2 se invierte',
      },
      voz: 'Creo que el signo del factor decide. Comprobemos tres casos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Partimos de a = −1 y b = 2: a está a la izquierda.', ecuacion: ['−1 < 2'] },
        { estado: { corte: 2 }, texto: 'Sumar 3 corre los dos puntos lo mismo: el orden queda.', ecuacion: ['2 < 5'] },
        { estado: { corte: 3 }, texto: 'Multiplicar por 2 estira desde el 0: el orden queda.', ecuacion: ['−2 < 4'] },
        { estado: { corte: 4 }, texto: 'Multiplicar por −2 refleja en el 0: el orden se invierte.', ecuacion: ['2 > −4'] },
      ],
    },
    regla: {
      texto: 'Sumar o restar el mismo número conserva una desigualdad; multiplicar o dividir por un positivo también. Multiplicar o dividir por un negativo la invierte.',
      ecuacion: [c, ' < 0:  ', a, ' < ', b, ' ⇒ ', c, a, ' > ', c, b],
      condicion: 'c distinto de 0: con c = 0 los dos lados quedan iguales. El 0 tampoco tiene inverso: no se divide entre 0.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const ks = r.mezclar([-4, -3, -2, 2, 3, 5]).slice(0, 4), ms = [r.ent(-5, 5), r.ent(-5, 5), r.ent(-5, 5), r.ent(-5, 5)];
        const exp = (k, m, v) => [k === 1 ? '' : k === -1 ? '−' : f(k), v, m ? ` ${m > 0 ? '+' : '−'} ${f(Math.abs(m))}` : ''];
        const cuerpo = (k, m, ok) => { const sig = (k > 0) === ok ? '<' : '>'; return [...exp(k, m, x), ` ${sig} `, ...exp(k, m, y)]; };
        const ops = ks.map((k, i) => (i === 0
          ? { id: 'c', texto: cuerpo(k, ms[i], true), correcta: true }
          : { id: `m${i}`, texto: cuerpo(k, ms[i], false), error: k < 0 ? 'AL20' : 'TAL-VOLTEA-POSITIVO', siFuera: k < 0 ? `Sería cierto con un factor positivo; ${f(k)} es negativo e invierte el orden.` : `Se invertiría con un factor negativo; ${f(k)} es positivo y conserva el orden.` }));
        const k0 = ks[0];
        return {
          pregunta: ['Si ', x, ' < ', y, ', ¿cuál de estas desigualdades es verdadera?'],
          opciones: ops,
          solucion: { texto: k0 > 0 ? `Por ${f(k0)}, positivo, el orden se conserva; sumar no lo cambia.` : `Por ${f(k0)}, negativo, el orden se invierte; sumar no lo cambia.`, ecuacion: ops[0].texto },
        };
      },
    },
  };

  // ---------- Idea 2: cada extremo se decide aparte ----------
  // Cambia: dónde empieza B y la operación · Permanece: A = (−1, 3] · Progresa: el intervalo resultado
  // · Se reserva: el punto 3 que A incluye y B no · Debe verse: un extremo entra solo si entra donde se pide.
  const IA = { a: -1, b: 3, ca: false, cb: true };
  const rectaOp = (I, J, op, extra = []) => {
    const R = op === '∩' ? (inter(I, J) ? [inter(I, J)] : []) : union(I, J);
    return {
      min: -4, max: 7, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 3,
      elementos: [elem(I, 'o', 3, `A = ${texto(I)}`), elem(J, 'i', 2, `B = ${texto(J)}`), ...R.map((K, k) => elem(K, 'd', 1, k === 0 ? `A ${op} B` : '')), ...extra],
      alt: `A = ${texto(I)}, B = ${texto(J)}; A ${op} B = ${textoU(R)}`,
    };
  };
  const intervalos = {
    id: 'intervalos',
    titulo: 'Cada extremo se decide aparte',
    temas: ['Intervalos y sus operaciones'],
    pieza: 'recta',
    juega: {
      consigna: 'A = (−1, 3] queda fijo. Mueve el inicio de B = [m, 5) y elige la operación. Abajo, en verde, el resultado.',
      voz: 'Mira qué pasa con cada extremo, lleno o hueco.',
      controles: [
        { id: 'm', etiqueta: 'm', color: 'c-i', min: -3, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'op', etiqueta: 'Operación', opciones: [{ valor: '∩', texto: 'A ∩ B' }, { valor: '∪', texto: 'A ∪ B' }] },
      ],
      dibujo: val => ({ datos: rectaOp(IA, { a: val.m, b: 5, ca: true, cb: false }, val.op), estado: {} }),
      lectura: val => { const J = { a: val.m, b: 5, ca: true, cb: false }; return [A, ` ${val.op} `, B, ` = ${val.op === '∩' ? texto(inter(IA, J)) : textoU(union(IA, J))}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: [A, ' = (−1, 3] y ', B, ' = (3, 5). ¿Cuál es ', A, ' ∩ ', B, '?'],
      opciones: [
        { id: 'c', texto: '∅', correcta: true },
        { id: 'punto', texto: '{3}', error: 'NR4', siFuera: '{3} sería cierto si B incluyera al 3; su paréntesis lo deja fuera.' },
        { id: 'union', texto: '(−1, 5)', error: 'NR3', siFuera: '(−1, 5) es A ∪ B: lo que está en alguno. La intersección pide estar en los dos.' },
        { id: 'a', texto: '(−1, 3]', error: 'TAL-INTER-A', siFuera: 'Ese es A completo. Un número de A está en A ∩ B solo si también está en B.' },
      ],
      dibujo: { datos: rectaOp(IA, { a: 3, b: 5, ca: false, cb: false }, '∩'), estado: {} },
      revelar: { datos: rectaOp(IA, { a: 3, b: 5, ca: false, cb: false }, '∩', [{ tipo: 'punto', x: 3, color: 'h', abierto: true, rotulo: '3 ∉ B', fila: 0 }]), estado: {} },
      coincide: 'Coincide: el 3 está en A pero no en B, y no hay otro número en los dos.',
    },
    mira: {
      datos: (() => {
        const J = { a: 2, b: 5, ca: true, cb: false }, R = inter(IA, J), U = union(IA, J)[0];
        return {
          min: -4, max: 7, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 4,
          elementos: [elem(IA, 'o', 4, 'A = (−1, 3]'), elem(J, 'i', 3, 'B = [2, 5)', 1),
            { tipo: 'punto', x: 2, color: 'd', fila: 2, desde: 2 }, elem(R, 'd', 2, `A ∩ B = ${texto(R)}`, 3), elem(U, 'd', 1, `A ∪ B = ${texto(U)}`, 4)],
          alt: 'A = (−1, 3], B = [2, 5): la intersección es [2, 3] y la unión (−1, 5)',
        };
      })(),
      pasos: [
        { estado: { corte: 1 }, texto: 'A va de −1 (sin incluir) a 3 (incluido); B, de 2 a 5.', ecuacion: [A, ' = (−1, 3]   ·   ', B, ' = [2, 5)'] },
        { estado: { corte: 2 }, texto: 'La intersección empieza en el mayor inicio: 2, que está en los dos.', ecuacion: ['máx(−1, 2) = 2'] },
        { estado: { corte: 3 }, texto: 'Termina en el menor final: 3, que A incluye y B también.', ecuacion: [A, ' ∩ ', B, ` = ${texto(inter(IA, { a: 2, b: 5, ca: true, cb: false }))}`] },
        { estado: { corte: 4 }, texto: 'La unión va del menor inicio al mayor final, sin huecos.', ecuacion: [A, ' ∪ ', B, ` = ${textoU(union(IA, { a: 2, b: 5, ca: true, cb: false }))}`] },
      ],
    },
    regla: {
      texto: 'La intersección va del mayor inicio al menor final, y un extremo entra solo si entra en los dos. En la unión, un extremo entra si entra en alguno.',
      ecuacion: ['[', a, ', ', b, ') = {', x, ' : ', a, ' ≤ ', x, ' < ', b, '}'],
      condicion: 'si el inicio queda después del final, o coinciden con un extremo abierto, la intersección es vacía.',
    },
    ahoraTu: {
      pieza: 'recta',
      generar(s) {
        const r = azar(s);
        const intervalo = () => { const p = r.ent(-4, 3), q = p + r.ent(1, 4); return { a: p, b: q, ca: r() < 0.5, cb: r() < 0.5 }; };
        let I, J;
        do { I = intervalo(); J = intervalo(); } while (texto(I) === texto(J) || (s % 4 !== 0 && !inter(I, J)));
        const op = s % 3 === 2 ? '∪' : '∩';
        const bien = op === '∩' ? textoU(inter(I, J) ? [inter(I, J)] : []) : textoU(union(I, J));
        const otra = op === '∩' ? textoU(union(I, J)) : textoU(inter(I, J) ? [inter(I, J)] : []);
        const flip = l => l.map(K => ({ ...K, ca: K.a !== null && !K.ca, cb: K.b !== null && !K.cb }));
        const lista = op === '∩' ? (inter(I, J) ? [inter(I, J)] : []) : union(I, J);
        const R = { a: Math.min(I.a, J.a), b: Math.max(I.b, J.b), ca: true, cb: true };
        return {
          pregunta: [A, ` = ${texto(I)} y `, B, ` = ${texto(J)}. ¿Cuál es `, A, ` ${op} `, B, '?'],
          dibujo: { datos: { min: -5, max: 8, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 3, elementos: [elem(I, 'o', 3, 'A'), elem(J, 'i', 2, 'B')], alt: `A = ${texto(I)} y B = ${texto(J)}` }, estado: {} },
          opciones: distintas([
            { id: 'c', texto: bien, correcta: true },
            { id: 'otra', texto: otra, error: 'NR3', siFuera: op === '∩' ? 'Eso sería A ∪ B: lo que está en alguno.' : 'Eso sería A ∩ B: lo que está en los dos.' },
            lista.length ? { id: 'extremos', texto: textoU(flip(lista)), error: 'NR4', siFuera: 'Esos extremos cambian de abierto a cerrado. Cada extremo entra según los intervalos dados.' }
              : { id: 'puente', texto: `[${f(Math.min(I.b, J.b))}, ${f(Math.max(I.a, J.a))}]`, error: 'TAL-HUECO', siFuera: 'Ese es el hueco entre los dos intervalos: no está en ninguno.' },
            { id: 'todo', texto: texto(R), error: 'TAL-EXTREMOS', siFuera: 'Ese tramo va del menor inicio al mayor final, con todo incluido. Revisa extremos y huecos.' },
          ]),
          solucion: {
            texto: op === '∩' ? 'Del mayor inicio al menor final; cada extremo, si está en los dos.' : 'Se junta todo; un extremo entra si está en alguno.',
            ecuacion: [A, ` ${op} `, B, ` = ${bien}`],
            dibujo: { datos: rectaOp(I, J, op), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 3: acotado no es tener máximo ----------
  // Cambia: el extremo b y si entra · Permanece: el conjunto empieza en 0 · Progresa: los números cada vez más
  // cerca de 1 · Se reserva: el 1, que acota pero no pertenece · Debe verse: siempre hay otro entre x y 1.
  const acotados = {
    id: 'acotados',
    titulo: 'Acotado no es tener máximo',
    temas: ['Conjuntos acotados y densidad'],
    pieza: 'recta',
    juega: {
      consigna: 'S va de 0 a b. Elige b y si b entra. En turquesa, las cotas superiores: números que ningún elemento de S supera.',
      voz: 'Fíjate dónde empiezan las cotas superiores.',
      controles: [
        { id: 'b', etiqueta: 'b', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'cb', etiqueta: 'b en S', opciones: [{ valor: 'no', texto: 'no entra' }, { valor: 'si', texto: 'entra' }] },
      ],
      dibujo: val => ({ datos: { min: -1, max: 7, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 2, elementos: [
        { tipo: 'intervalo', a: 0, b: val.b, ca: true, cb: val.cb === 'si', color: 'o', rotulo: 'S', fila: 1 },
        { tipo: 'intervalo', a: val.b, b: null, ca: true, cb: false, color: 'i', rotulo: 'cotas superiores', fila: 2 },
      ], alt: `S = [0, ${val.b}${val.cb === 'si' ? ']' : ')'}; sus cotas superiores son [${val.b}, +∞)` }, estado: {} }),
      lectura: val => [`S = [0, ${val.b}${val.cb === 'si' ? ']' : ')'} · cotas superiores: [${val.b}, +∞)`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuál es el mayor elemento del intervalo (0, 1)?',
      opciones: [
        { id: 'c', texto: 'No tiene mayor elemento', correcta: true },
        { id: 'uno', texto: '1', error: 'NR11', siFuera: '1 sería el mayor si el intervalo fuera (0, 1]; aquí el 1 no está.' },
        { id: 'nueves', texto: '0,999…', error: 'NR10', siFuera: '0,999… es otra forma de escribir 1, que no está en el intervalo.' },
        { id: 'casi', texto: '0,99', error: 'NR9', siFuera: `Entre 0,99 y 1 está ${f((0.99 + 1) / 2, 3)}, que también está en el intervalo.` },
      ],
      dibujo: { datos: { min: 0.8, max: 1.05, paso: 0.05, decimales: 2, variable: 'x', color: 'o', filas: 2, elementos: [{ tipo: 'intervalo', a: null, b: 1, cb: false, color: 'o', rotulo: '(0, 1) visto de cerca', fila: 1 }], alt: 'El final del intervalo (0, 1), visto de cerca' }, estado: {} },
      revelar: { datos: { min: 0.8, max: 1.05, paso: 0.05, decimales: 2, variable: 'x', color: 'o', filas: 2, elementos: [
        { tipo: 'intervalo', a: null, b: 1, cb: false, color: 'o', rotulo: '(0, 1)', fila: 2 },
        { tipo: 'punto', x: 0.99, color: 'h', rotulo: '0,99', fila: 1 }, { tipo: 'punto', x: 0.995, color: 'd', fila: 0 },
      ], alt: 'Entre 0,99 y 1 hay otro número del intervalo: 0,995' }, estado: {} },
      coincide: 'Coincide: para cualquier x menor que 1, hay otro número del intervalo más grande.',
    },
    mira: (() => {
      const xs = [0.8]; for (let k = 0; k < 3; k++) xs.push((xs[xs.length - 1] + 1) / 2);
      return {
        datos: { min: 0.7, max: 1.05, paso: 0.05, decimales: 2, variable: 'x', color: 'o', filas: 3, elementos: [
          { tipo: 'intervalo', a: null, b: 1, cb: false, color: 'o', rotulo: 'S = (0, 1)', fila: 3 },
          ...xs.map((v, k) => ({ tipo: 'punto', x: v, color: 'd', fila: 2 - (k % 2), rotulo: f(v, 4), desde: k + 1 })),
          { tipo: 'intervalo', a: 1, b: null, ca: true, cb: false, color: 'i', rotulo: 'cotas', fila: 0, desde: 4 },
        ], alt: 'Los puntos 0,8; 0,9; 0,95 y 0,975 se acercan a 1 sin llegar; las cotas superiores empiezan en 1' },
        pasos: [
          { estado: { corte: 1 }, texto: `Tomamos x = ${f(xs[0])}, que está en S.`, ecuacion: [x, ` = ${f(xs[0])}`] },
          { estado: { corte: 2 }, texto: 'El punto medio entre x y 1 también está en S, y es mayor.', ecuacion: [{ frac: [[x, ' + 1'], '2'] }, ` = ${f(xs[1])}`] },
          { estado: { corte: 3 }, texto: 'Se repite sin fin: siempre aparece otro más cerca de 1.', ecuacion: [`${f(xs[2])}   ·   ${f(xs[3], 4)}`] },
          { estado: { corte: 4 }, texto: 'El 1 acota a S sin estar en S: supremo, no máximo.', ecuacion: ['sup S = 1   ·   máx S no existe'] },
        ],
      };
    })(),
    regla: {
      texto: 'Un conjunto acotado puede no tener máximo. En (0, 1), para cada x hay otro mayor, (x + 1)/2. La menor cota superior, el supremo, es 1.',
      ecuacion: [x, ' < ', { frac: [[x, ' + 1'], '2'] }, ' < 1'],
      condicion: 'el máximo tiene que pertenecer al conjunto; el supremo no. Entre dos reales distintos siempre hay otro.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        const p = r.ent(-3, 2), q = p + r.ent(2, 5), ca = r() < 0.5, cb = s % 2 === 0;
        const S = `${ca ? '[' : '('}${f(p)}, ${f(q)}${cb ? ']' : ')'}`;
        if (tipo === 0) {
          return {
            pregunta: `¿Cuál es el mayor elemento de S = ${S}?`,
            opciones: distintas([
              { id: 'c', texto: cb ? f(q) : 'No tiene mayor elemento', correcta: true },
              cb ? { id: 'no', texto: 'No tiene mayor elemento', error: 'TAL-CERRADO', siFuera: `El corchete incluye a ${f(q)}: está en S y nada de S lo supera.` }
                : { id: 'q', texto: f(q), error: 'NR11', siFuera: `${f(q)} sería el mayor si el corchete fuera cerrado; aquí ${f(q)} no está en S.` },
              { id: 'casi', texto: f(q - 0.01), error: 'NR9', siFuera: `Entre ${f(q - 0.01)} y ${f(q)} hay otros números de S.` },
              { id: 'p', texto: f(p), error: 'TAL-EXTREMO-IZQ', siFuera: `${f(p)} es el extremo izquierdo, el menor; se pide el mayor.` },
            ]),
            solucion: { texto: cb ? `${f(q)} está en S y ningún elemento lo supera.` : `Para cada x de S, (x + ${f(q)})/2 está en S y es mayor.`, ecuacion: [cb ? `máx S = ${f(q)}` : `sup S = ${f(q)}, sin máximo`] },
          };
        }
        if (tipo === 1) {
          return {
            pregunta: `¿Cuál es el supremo de S = ${S}, es decir, la menor de sus cotas superiores?`,
            opciones: distintas([
              { id: 'c', texto: f(q), correcta: true },
              { id: 'no', texto: 'No tiene supremo', error: 'NR12', siFuera: `Aunque ${cb ? 'tenga' : 'no tenga'} máximo, las cotas superiores empiezan en ${f(q)}: ese es el supremo.` },
              { id: 'mas', texto: f(q + 1), error: 'TAL-COTA', siFuera: `${f(q + 1)} es una cota superior, pero ${f(q)} también lo es y es menor.` },
              { id: 'p', texto: f(p), error: 'TAL-EXTREMO-IZQ', siFuera: `${f(p)} es la mayor cota inferior, el ínfimo.` },
            ]),
            solucion: { texto: `Las cotas superiores son los números desde ${f(q)}: la menor es ${f(q)}.`, ecuacion: [`sup S = ${f(q)}`] },
          };
        }
        const u = r.ent(10, 98) / 100, v = Math.round((u + 0.01) * 100) / 100, m = Math.round((u + v) / 2 * 1000) / 1000;
        return {
          pregunta: `¿Cuál de estos números está estrictamente entre ${f(u)} y ${f(v)}?`,
          opciones: distintas([
            { id: 'c', texto: f(m, 3), correcta: true },
            { id: 'nada', texto: 'Ninguno: son seguidos', error: 'NR9', siFuera: `Dos reales distintos no son seguidos: su punto medio, ${f(m, 3)}, está entre ellos.` },
            { id: 'v', texto: f(v), error: 'TAL-ESTRICTO', siFuera: `${f(v)} es uno de los extremos; «estrictamente entre» lo deja fuera.` },
            { id: 'mas', texto: f(u + 0.1), error: 'TAL-DECIMAL', siFuera: `${f(u + 0.1)} es mayor que ${f(v)}: queda fuera.` },
          ]),
          solucion: { texto: 'El punto medio de dos reales distintos queda entre ellos.', ecuacion: [{ frac: [`${f(u)} + ${f(v)}`, '2'] }, ` = ${f(m, 3)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: una tabla no se supone, se comprueba ----------
  // Cambia: la regla y la casilla elegida · Permanece: el conjunto {0, 1, 2, 3} · Progresa: las propiedades que
  // se comprueban · Se reserva: el 3, que no tiene inverso dentro del conjunto · Debe verse: la fila del neutro repite el encabezado.
  const C4 = [0, 1, 2, 3];
  const REGLAS = { 'a − 2b': (p, q) => p - 2 * q, 'a + b − 1': (p, q) => p + q - 1, 'el mayor': (p, q) => Math.max(p, q) };
  const tablaOp = (regla, extra = {}) => Object.assign({
    columnas: ['', ...C4.map(String)], colorCol: [null, 'i', 'i', 'i', 'i'],
    filas: C4.map(p => [{ t: String(p), color: 'o', fuerte: true }, ...C4.map(q => String(f(REGLAS[regla](p, q))))]),
    alt: `Tabla de a ★ b = ${regla} para a y b en {0, 1, 2, 3}: filas a, columnas b`,
  }, extra);
  const operaciones = {
    id: 'tabla-operacion',
    titulo: 'Una tabla se comprueba',
    temas: ['Operaciones binarias y tablas', 'Axiomas de cuerpo y de orden'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Elige una regla para a ★ b y una casilla: fila a, columna b. Compara a ★ b con b ★ a.',
      voz: 'Busca una regla en la que el orden importe.',
      controles: [
        { id: 'regla', etiqueta: 'a ★ b =', opciones: Object.keys(REGLAS).map(t => ({ valor: t, texto: t === 'el mayor' ? 'el mayor de a y b' : t })) },
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 0, max: 3, paso: 1, inicio: 3, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 0, max: 3, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: val => ({ datos: tablaOp(val.regla, { resaltes: [{ f: val.a, c: val.b + 1, color: 'd' }, { f: val.b, c: val.a + 1, color: 'h' }] }), estado: {} }),
      lectura: val => [a, ' ★ ', b, ` = ${f(REGLAS[val.regla](val.a, val.b))} · `, b, ' ★ ', a, ` = ${f(REGLAS[val.regla](val.b, val.a))}`],
      minimo: 4,
    },
    predice: {
      pregunta: ['Con ', a, ' ★ ', b, ' = ', a, ' + ', b, ' − 1, ¿qué número e cumple ', a, ' ★ e = ', a, ' para todo ', a, '?'],
      opciones: [
        { id: 'c', texto: '1', correcta: true },
        { id: 'cero', texto: '0', error: 'NR14', siFuera: `0 es el neutro de la suma; aquí 2 ★ 0 = ${f(REGLAS['a + b − 1'](2, 0))}, no 2.` },
        { id: 'menos', texto: '−1', error: 'TAL-NEUTRO', siFuera: `Con −1: 2 ★ (−1) = ${f(REGLAS['a + b − 1'](2, -1))}, no 2.` },
        { id: 'no', texto: 'No hay ninguno', error: 'NR23', siFuera: 'Sí hay: con e = 1 queda a + 1 − 1 = a.' },
      ],
      dibujo: { datos: tablaOp('a + b − 1'), estado: {} },
      revelar: { datos: tablaOp('a + b − 1', { resaltes: [{ f: 0, c: 2, alto: 4, color: 'd' }] }), estado: {} },
      coincide: 'Coincide: la columna del 1 repite los valores de a.',
    },
    mira: {
      datos: tablaOp('a + b − 1', { resaltes: [{ f: 1, c: 1, ancho: 4, color: 'd', desde: 1 }, { f: 0, c: 2, color: 'i', desde: 2 }, { f: 1, c: 1, color: 'i', desde: 2 }, { f: 2, c: 1, color: 'd', desde: 3 }, { f: 3, c: 1, color: 'h', desde: 4 }] }),
      voz: 'Creo que hay neutro. Comprobemos fila por fila.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La fila del 1 repite los encabezados: 1 es el neutro.', ecuacion: ['1 ★ ', b, ' = 1 + ', b, ' − 1 = ', b] },
        { estado: { corte: 2 }, texto: '0 ★ 1 y 1 ★ 0 dan lo mismo: la tabla es simétrica.', ecuacion: [a, ' ★ ', b, ' = ', b, ' ★ ', a] },
        { estado: { corte: 3 }, texto: 'El inverso de 2 es 0: 2 ★ 0 da el neutro.', ecuacion: [`2 ★ 0 = ${f(REGLAS['a + b − 1'](2, 0))}`] },
        { estado: { corte: 4 }, texto: 'Para 3 haría falta −1, que no está en el conjunto: sin inverso.', ecuacion: [`3 ★ (−1) = ${f(REGLAS['a + b − 1'](3, -1))}`] },
      ],
    },
    regla: {
      texto: 'Las propiedades de una operación se comprueban. Es conmutativa si la tabla es simétrica respecto de la diagonal; e es neutro si deja igual a cada elemento.',
      ecuacion: [a, ' ★ e = e ★ ', a, ' = ', a],
      condicion: 'no se supone nada porque la regla se parezca a la suma. En los reales, el 0 no tiene inverso multiplicativo.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        const p = r.uno([1, 2, 3]), q = r.uno([-1, 1, 2, 3].filter(v => v !== p)), k = r.ent(-3, 3);
        const op = (u, v) => p * u + q * v + k;
        const fp = v => (v < 0 ? `(${f(v)})` : f(v));
        const regla = [p === 1 ? '' : f(p), a, q < 0 ? ' − ' : ' + ', Math.abs(q) === 1 ? '' : f(Math.abs(q)), b, k ? ` ${k > 0 ? '+' : '−'} ${f(Math.abs(k))}` : ''];
        if (tipo === 0) {
          const u = r.ent(1, 5), v = r.ent(-2, 4);
          return {
            pregunta: ['Si ', a, ' ★ ', b, ' = ', ...regla, `, ¿cuánto vale ${fp(v)} ★ ${fp(u)}?`],
            opciones: distintas([
              { id: 'c', texto: f(op(v, u)), correcta: true },
              { id: 'orden', texto: f(op(u, v)), error: 'NR19', siFuera: `Eso es ${fp(u)} ★ ${fp(v)}. Aquí a = ${f(v)} y b = ${f(u)}: el orden importa.` },
              { id: 'sin-k', texto: f(op(v, u) - k), error: 'TAL-REGLA', siFuera: 'Falta el término independiente de la regla.' },
              { id: 'suma', texto: f(v + u), error: 'TAL-SUMA', siFuera: '★ no es la suma: se sigue su regla.' },
            ]),
            solucion: { texto: `Se reemplaza a = ${f(v)} y b = ${f(u)} en la regla.`, ecuacion: [`${fp(v)} ★ ${fp(u)} = ${f(op(v, u))}`] },
          };
        }
        if (tipo === 1) {
          const u = r.ent(0, 3), v = r.ent(0, 3), w = r.ent(0, 2);
          const izq = op(op(u, v), w), der = op(u, op(v, w));
          return {
            pregunta: ['Si ', a, ' ★ ', b, ' = ', ...regla, `, ¿cuánto vale (${f(u)} ★ ${f(v)}) ★ ${f(w)}?`],
            opciones: distintas([
              { id: 'c', texto: f(izq), correcta: true },
              { id: 'asoc', texto: f(der), error: 'TAL-ASOCIATIVA', siFuera: `Eso es ${f(u)} ★ (${f(v)} ★ ${f(w)}). Primero va el paréntesis dado.` },
              { id: 'uno', texto: f(op(u, v)), error: 'TAL-INCOMPLETO', siFuera: `Ese es solo ${f(u)} ★ ${f(v)}; falta operar con ${f(w)}.` },
              { id: 'suma', texto: f(u + v + w), error: 'TAL-SUMA', siFuera: '★ no es la suma: se sigue su regla.' },
            ]),
            solucion: { texto: `Primero ${f(u)} ★ ${f(v)} = ${f(op(u, v))}; luego, con ${f(w)}.`, ecuacion: [`${f(op(u, v))} ★ ${f(w)} = ${f(izq)}`] },
          };
        }
        // Neutro: con a ★ b = a + b + k, el neutro es −k.
        const reg2 = [a, ' + ', b, k ? ` ${k > 0 ? '+' : '−'} ${f(Math.abs(k))}` : ''];
        return {
          pregunta: ['Si ', a, ' ★ ', b, ' = ', ...reg2, ', ¿qué número e cumple ', a, ' ★ e = ', a, ' para todo ', a, '?'],
          opciones: distintas([
            { id: 'c', texto: f(-k), correcta: true },
            { id: 'cero', texto: f(k === 0 ? 1 : 0), error: 'NR14', siFuera: k === 0 ? 'Con 1, a ★ 1 = a + 1, no a.' : `0 es el neutro de la suma; aquí a ★ 0 = a ${k > 0 ? '+' : '−'} ${f(Math.abs(k))}.` },
            { id: 'k', texto: f(k === 0 ? -1 : k), error: 'TAL-NEUTRO', siFuera: `Con ese valor, a ★ e = a ${k === 0 ? '− 1' : `${k > 0 ? '+' : '−'} ${f(Math.abs(2 * k))}`}, no a.` },
            { id: 'no', texto: 'No tiene neutro', error: 'NR23', siFuera: `Sí tiene: con e = ${f(-k)}, a + e ${k ? `${k > 0 ? '+' : '−'} ${f(Math.abs(k))}` : ''} = a.` },
          ]),
          solucion: { texto: `Se pide a + e ${k >= 0 ? '+' : '−'} ${f(Math.abs(k))} = a, es decir, e = ${f(-k)}.`, ecuacion: [a, ' ★ ', `${fp(-k)} = `, a] },
        };
      },
    },
  };

  return {
    unidad: 'algebra.numeros-reales',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/alg-tabla.js'],
    historia: {
      texto: 'Los irracionales se usaron mucho antes de saber construirlos con rigor. En el siglo XIX, varios matemáticos los fundaron con cortes de racionales o con sucesiones; Dedekind publicó su propuesta en 1872. No se trataba de añadir cifras misteriosas, sino de que el orden y los límites funcionaran sin huecos. Los intervalos de esta unidad usan ese lenguaje moderno.',
      pregunta: '¿Hay un número justo antes del 1?',
      fuente: { titulo: 'O’Connor y Robertson, The real numbers: Stevin to Hilbert — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Real_numbers_2/' },
    },
    ideas: [orden, intervalos, acotados, operaciones],
  };
});
