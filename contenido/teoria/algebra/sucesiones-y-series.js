/*
 * Teoría de «Sucesiones y series» (algebra.sucesiones-y-series). Molde: docs/teoria.md; forma de Álgebra:
 * logica-y-conjuntos.js. Fuente: docs/teoria/matriz/algebra.json (unidad 18), expediente teoria-152-unidades
 * (Álgebra: «una lista finita admite muchas reglas; se declara o justifica el modelo») y historia-ecuaciones
 * (pp. 57–68). Errores: TAL-* nuevos (hipótesis, rutinas/teoria-algebra.md); el de la ficha es TAL-TERMINO-CERO.
 * Colores (regla 4): término aₙ naranja (c-o); índice n turquesa (c-i); suma Sₙ verde (c-d); límite L o el valor
 * al que se acerca rojo (c-h).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · leer una sucesión como regla declarada y una serie como sucesión de sumas parciales.
 * Persona y condiciones · 5.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · halla términos y sumas de progresiones y recurrencias, límites simples y la suma de una geométrica.
 * Orden de atención · 1.º los puntos o la tabla · 2.º el punto o la casilla que aparece · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué una serie con términos que tienden a cero puede no tener suma.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const an = k => ({ sub: [{ v: 'c-o', t: 'a' }, k] }), Sn = k => ({ sub: [{ v: 'c-d', t: 'S' }, k] });
  const n = { v: 'c-i', t: 'n' }, L = { v: 'c-h', t: 'L' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r();
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r.noCero = (lo, hi) => { let v = 0; while (v === 0) v = lo + Math.floor(r() * (hi - lo + 1)); return v; };
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  const mcd = (m, k) => (k ? mcd(k, m % k) : Math.abs(m));
  // Fracción exacta como texto: fr(9, 10) → «9/10»; fr(4, 2) → «2».
  const fr = (num, den = 1) => { if (den < 0) { num = -num; den = -den; } const g = mcd(num, den) || 1; num /= g; den /= g; return den === 1 ? f(num) : `${num < 0 ? '−' : ''}${Math.abs(num)}/${den}`; };
  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const sub = k => String(k).split('').map(c => SUB[c]).join('');
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = k => String(k).split('').map(c => SUP[c]).join('');
  const ejes = (xmax, ymin, ymax, extra) => {
    const sp = ymax - ymin, paso = sp > 60 ? 20 : sp > 25 ? 10 : sp > 10 ? 5 : sp > 4 ? 1 : 0.5;
    return Object.assign({
      x: { min: 0, max: xmax, paso: xmax > 30 ? 10 : xmax > 12 ? 2 : 1, nombre: 'n', decimales: 0, color: 'i' },
      y: { min: Math.floor(ymin / paso) * paso, max: Math.ceil(ymax / paso) * paso, paso, nombre: 'aₙ', decimales: paso < 1 ? 1 : 0, color: 'o' },
    }, extra);
  };

  // ---------- Idea 1: suma lo mismo o multiplica lo mismo, y la regla se declara ----------
  // Cambia: el tipo, a₁ y d o r · Permanece: los ejes n y aₙ · Progresa: los puntos, término a término · Se reserva:
  // el cuarto término de 2, 4, 8, que depende del modelo · Debe verse: pocos términos no fijan la regla.
  const termino = (tipo, a1, k, m) => (tipo === 'suma' ? a1 + (m - 1) * k : a1 * k ** (m - 1));
  const progresiones = {
    id: 'progresiones',
    titulo: 'Sumar lo mismo o multiplicar',
    temas: ['Progresiones aritméticas y geométricas'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige si cada término suma lo mismo o multiplica por lo mismo, el primer término y el paso. Mira cómo se separan los puntos.',
      voz: 'Compara los saltos entre puntos vecinos.',
      controles: [
        { id: 'tipo', etiqueta: 'Regla', opciones: [{ valor: 'suma', texto: 'suma k' }, { valor: 'multiplica', texto: 'multiplica por k' }] },
        { id: 'a1', etiqueta: 'a₁', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
        { id: 'k', etiqueta: 'k', min: 2, max: 3, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => {
        const ps = [1, 2, 3, 4, 5].map(m => ({ x: m, y: termino(val.tipo, val.a1, val.k, m), color: 'o' }));
        ps[4].rotulo = f(ps[4].y);
        return { datos: ejes(6, 0, Math.max(...ps.map(p => p.y)), { puntos: ps, alt: `Cinco términos: ${ps.map(p => f(p.y)).join(', ')}` }), estado: {} };
      },
      lectura: val => [an('5'), ` = ${f(termino(val.tipo, val.a1, val.k, 5))} · ${val.tipo === 'suma' ? 'diferencia' : 'razón'} ${f(val.k)}`],
      minimo: 3,
    },
    predice: (() => {
      const base = [[1, 2], [2, 4], [3, 8]];
      const datos = con => ejes(5, 0, 32, {
        puntos: [...base.map(([x, y]) => ({ x, y, color: 'o', rotulo: f(y) })), ...(con ? [{ x: 4, y: 16, color: 'd', rotulo: '16 o 14' }, { x: 4, y: 14, color: 'h', abierto: true }] : [])],
        curvas: con ? [{ puntos: [[3, 8], [4, 16]], color: 'd', discontinua: true }, { puntos: [[3, 8], [4, 14]], color: 'h', discontinua: true }] : [],
        alt: con ? 'Después de 2, 4, 8 pueden venir 16 (multiplica por 2) o 14 (las diferencias crecen de 2 en 2)' : 'Puntos 2, 4 y 8',
      });
      return {
        pregunta: 'Una sucesión empieza 2, 4, 8 y no se dice su regla. ¿Qué número sigue?',
        opciones: [
          { id: 'c', texto: 'Depende de la regla: 16 o 14 son posibles', correcta: true },
          { id: 'g', texto: '16, sin duda', error: 'TAL-PATRON', siFuera: '16 sigue si se multiplica por 2. Si las diferencias crecen de 2 en 2, sigue 14.' },
          { id: 'd', texto: '14, sin duda', error: 'TAL-PATRON', siFuera: '14 sigue si las diferencias 2, 4 crecen de 2 en 2. Multiplicando por 2, sigue 16.' },
          { id: 'pa', texto: '10', error: 'TAL-PA', siFuera: '10 sumaría 2, pero de 4 a 8 se sumó 4: no es aritmética.' },
        ],
        dibujo: { datos: datos(false), estado: {} },
        revelar: { datos: datos(true), estado: {} },
        coincide: 'Coincide: tres términos admiten varias reglas. Hay que declarar cuál.',
      };
    })(),
    mira: {
      datos: ejes(6, 0, 32, {
        puntos: [
          ...[[1, 2], [2, 4], [3, 8]].map(([x, y]) => ({ x, y, color: 'o', rotulo: f(y), desde: 1 })),
          { x: 4, y: 16, color: 'd', desde: 2 }, { x: 5, y: 32, color: 'd', rotulo: '32', desde: 2 },
          { x: 4, y: 14, color: 'h', abierto: true, desde: 3 }, { x: 5, y: 22, color: 'h', abierto: true, rotulo: '22', desde: 3 },
        ],
        curvas: [{ puntos: [[1, 2], [2, 4], [3, 8], [4, 16], [5, 32]], color: 'd', discontinua: true, desde: 2 }, { puntos: [[3, 8], [4, 14], [5, 22]], color: 'h', discontinua: true, desde: 3 }],
        alt: 'Dos continuaciones de 2, 4, 8: geométrica hasta 32 y de diferencias crecientes hasta 22',
      }),
      voz: 'Creo que hay un patrón. Antes, declaremos cuál.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Tres datos: 2, 4 y 8.', ecuacion: [an('1'), ' = 2, ', an('2'), ' = 4, ', an('3'), ' = 8'] },
        { estado: { corte: 2 }, texto: 'Modelo geométrico: cada término es el anterior por 2.', ecuacion: [an('n'), ' = 2 · ', { sup: ['2', 'n − 1'] }, ' → 16, 32'] },
        { estado: { corte: 3 }, texto: 'Otro modelo: las diferencias 2, 4, 6, 8 crecen de 2 en 2.', ecuacion: ['8 + 6 = 14, 14 + 8 = 22'] },
        { estado: { corte: 3 }, texto: 'Las dos explican los datos. Solo la regla declarada decide.', ecuacion: ['regla declarada → un solo siguiente'] },
      ],
    },
    regla: {
      texto: 'Una progresión aritmética suma siempre la misma diferencia d; una geométrica multiplica siempre por la misma razón r. Unos pocos términos no fijan la regla.',
      ecuacion: [an('n'), ' = ', an('1'), ' + (', n, ' − 1)d   ·   ', an('n'), ' = ', an('1'), { sup: ['r', [n, ' − 1']] }],
      condicion: 'n es entero positivo, y el modelo, aritmético o geométrico, se declara o se justifica: no se adivina.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const a1 = r.ent(-5, 9), d = r.noCero(-4, 6), m = r.ent(8, 25), bien = a1 + (m - 1) * d;
          return {
            pregunta: ['En una progresión aritmética, ', an('1'), ` = ${f(a1)} y d = ${f(d)}. ¿Cuánto vale `, an(String(m)), '?'],
            opciones: distintas([
              { id: 'c', texto: f(bien), correcta: true },
              { id: 'n', texto: f(a1 + m * d), error: 'TAL-N', siFuera: `Eso suma d ${m} veces; desde a₁ hasta a${sub(m)} hay ${m - 1} saltos.` },
              { id: 'sin-a1', texto: f(m * d), error: 'TAL-SIN-A1', siFuera: 'Eso olvida el primer término.' },
              { id: 'geo', texto: f(a1 * d ** 2 === bien ? NaN : a1 + d * (m - 2)), error: 'TAL-N', siFuera: `Eso cuenta ${m - 2} saltos; son ${m - 1}.` },
            ]),
            solucion: { texto: `Hay ${m - 1} saltos de ${f(d)} desde el primer término.`, ecuacion: [an(String(m)), ` = ${f(a1)} + ${m - 1} · ${d < 0 ? `(${f(d)})` : f(d)} = ${f(bien)}`] },
          };
        }
        const a1 = r.ent(1, 5), q = r.uno([2, 3, -2]), m = r.ent(4, 7), bien = a1 * q ** (m - 1);
        return {
          pregunta: ['En una progresión geométrica, ', an('1'), ` = ${f(a1)} y r = ${f(q)}. ¿Cuánto vale `, an(String(m)), '?'],
          opciones: distintas([
            { id: 'c', texto: f(bien), correcta: true },
            { id: 'n', texto: f(a1 * q ** m), error: 'TAL-N', siFuera: `Eso multiplica ${m} veces; desde a₁ hasta a${sub(m)} hay ${m - 1}.` },
            { id: 'pa', texto: f(a1 + (m - 1) * q), error: 'TAL-PA', siFuera: 'Eso suma r en cada paso; en una geométrica se multiplica.' },
            { id: 'base', texto: f((a1 * q) ** (m - 1)), error: 'TAL-POT-PRODUCTO', siFuera: `Solo r se eleva: ${f(a1)} · r${sup(m - 1)}, no (${f(a1)}r)${sup(m - 1)}.` },
          ]),
          solucion: { texto: `Hay ${m - 1} multiplicaciones por ${f(q)} desde el primer término.`, ecuacion: [an(String(m)), ` = ${f(a1)} · ${q < 0 ? `(${f(q)})` : f(q)}${sup(m - 1)} = ${f(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: acercarse sin llegar ----------
  // Cambia: la sucesión · Permanece: los ejes y n de 1 a 12 · Progresa: la banda alrededor de L, cada vez más
  // angosta · Se reserva: el n desde el que todos entran · Debe verse: L no se alcanza; se entra en cualquier banda.
  const SUCES = {
    '3 − 2/n': { a: m => 3 - 2 / m, cota: true, lim: 3 },
    '1/n': { a: m => 1 / m, cota: true, lim: 0 },
    '(−1)ⁿ': { a: m => (m % 2 ? -1 : 1), cota: true, lim: null },
    'n/2': { a: m => m / 2, cota: false, lim: null },
    '2 + (−1)ⁿ/n': { a: m => 2 + (m % 2 ? -1 : 1) / m, cota: true, lim: 2 },
  };
  const monotonia = fn => { const v = Array.from({ length: 30 }, (_, k) => fn(k + 1)); return v.every((x, i) => !i || x > v[i - 1]) ? 'crece' : v.every((x, i) => !i || x < v[i - 1]) ? 'decrece' : 'sube y baja'; };
  const puntosDe = (fn, N, color = 'o') => Array.from({ length: N }, (_, k) => ({ x: k + 1, y: fn(k + 1), color }));
  const banda = (Lv, e, x0, x1, rot, desde) => ({ puntos: [[x0, Lv - e], [x1, Lv - e], [x1, Lv + e], [x0, Lv + e]], color: 'h', cerrada: true, rotulo: rot, desde });
  const A2 = m => 2 - 1 / m;
  const limite = {
    id: 'limite',
    titulo: 'Acercarse sin llegar',
    temas: ['Sucesiones monótonas y acotadas', 'Límite de sucesiones'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige una sucesión y mira sus doce primeros términos. ¿Crece, decrece o sube y baja? ¿Tiene techo? ¿Se acerca a algún número?',
      voz: 'Mira la forma de los puntos, no un punto solo.',
      controles: [{ id: 's', etiqueta: 'aₙ', opciones: Object.keys(SUCES).map(t => ({ valor: t, texto: t })) }],
      dibujo: val => {
        const S = SUCES[val.s], ps = puntosDe(S.a, 12);
        return { datos: ejes(13, Math.min(0, ...ps.map(p => p.y)), Math.max(3, ...ps.map(p => p.y)), { puntos: ps, curvas: S.lim === null ? [] : [{ puntos: [[0, S.lim], [13, S.lim]], color: 'h', discontinua: true, rotulo: `L = ${f(S.lim)}` }], alt: `Doce términos de aₙ = ${val.s}` }), estado: {} };
      },
      lectura: val => { const S = SUCES[val.s]; return [`${monotonia(S.a)} · ${S.cota ? 'acotada' : 'sin techo'} · ${S.lim === null ? 'sin límite' : `límite ${f(S.lim)}`}`]; },
      minimo: 3,
    },
    predice: (() => {
      const ps = puntosDe(A2, 12);
      const datos = con => ejes(13, 0, 3, { puntos: ps, curvas: [{ puntos: [[0, 2], [13, 2]], color: 'h', discontinua: true, rotulo: '2' }], areas: con ? [banda(2, 0.1, 0, 13, '2 ± 0,1')] : [], alt: 'aₙ = 2 − 1/n se acerca a 2 desde abajo' });
      return {
        pregunta: ['', an('n'), ' = 2 − 1/', n, ' crece y se acerca a 2. ¿Algún término vale exactamente 2?'],
        opciones: [
          { id: 'c', texto: 'No: se acerca tanto como se quiera, sin llegar', correcta: true },
          { id: 'llega', texto: 'Sí, cuando n es muy grande', error: 'TAL-ALCANZA', siFuera: 'Para cualquier n, 1/n es positivo: 2 − 1/n queda siempre bajo 2.' },
          { id: 'lejos', texto: 'No, y se queda lejos de 2', error: 'TAL-LEJOS', siFuera: `No llega, pero a${sub(100)} = ${f(A2(100))} ya está a 0,01 de 2.` },
        ],
        dibujo: { datos: datos(false), estado: {} },
        revelar: { datos: datos(true), estado: {} },
        coincide: 'Coincide: 1/n nunca es 0, pero se hace tan pequeño como se quiera.',
      };
    })(),
    mira: (() => {
      const n1 = Math.floor(1 / 0.1) + 1, n2 = Math.floor(1 / 0.01) + 1;
      return {
        datos: ejes(21, 0, 3, {
          puntos: puntosDe(A2, 20).map(p => Object.assign(p, { desde: 1 })),
          curvas: [{ puntos: [[0, 2], [21, 2]], color: 'h', discontinua: true, rotulo: 'techo 2', desde: 2 }],
          areas: [banda(2, 0.1, n1, 21, 'banda 0,1', 3)],
          alt: 'aₙ = 2 − 1/n: crece, no pasa de 2, y desde n = 11 entra en la banda de 0,1',
        }),
        pasos: [
          { estado: { corte: 1 }, texto: 'Cada término es mayor que el anterior: crece.', ecuacion: [an('1'), ` = ${f(A2(1))},  `, an('2'), ` = ${f(A2(2))},  `, an('3'), ` = ${f(A2(3), 2)}`] },
          { estado: { corte: 2 }, texto: 'Ninguno pasa de 2: está acotada por arriba.', ecuacion: [an('n'), ' = 2 − 1/', n, ' < 2'] },
          { estado: { corte: 3 }, texto: `Desde n = ${n1}, todos quedan a menos de 0,1 de 2.`, ecuacion: ['1/', n, ` < 0,1  ⇔  `, n, ` > 10`] },
          { estado: { corte: 3 }, texto: `Para 0,01 basta n ≥ ${n2}. Siempre hay un n desde el que entran.`, ecuacion: ['lím ', an('n'), ' = 2'] },
        ],
      };
    })(),
    regla: {
      texto: 'Una sucesión creciente y acotada por arriba converge. Su límite L cumple: desde algún n, todos los términos quedan tan cerca de L como se pida.',
      ecuacion: ['lím ', an('n'), ' = ', L, '   (', n, ' → ∞)'],
      condicion: 'acercarse no exige llegar a L. Monótona sola no basta: n/2 crece y no tiene límite.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let p, q, u, w;
        do { p = r.noCero(-4, 6); q = r.ent(-6, 8); u = r.ent(1, 4); w = r.ent(1, 6); } while (p * w === q * u || mcd(p, u) !== 1 && u !== 1 && p % u !== 0);
        const num = `${p === 1 ? '' : p === -1 ? '−' : f(p)}n ${q < 0 ? '−' : '+'} ${Math.abs(q)}`.replace(' + 0', ''), den = `${u === 1 ? '' : f(u)}n + ${w}`;
        return {
          pregunta: ['¿A qué número se acerca ', an('n'), ` = (${num})/(${den}) cuando n crece sin parar?`],
          opciones: distintas([
            { id: 'c', texto: fr(p, u), correcta: true },
            { id: 'ctes', texto: fr(q, w), error: 'TAL-LIM-CTES', siFuera: 'Eso divide los términos sin n; para n grande mandan los que llevan n.' },
            { id: 'a1', texto: fr(p + q, u + w), error: 'TAL-LIM-A1', siFuera: 'Ese es el primer término, a₁; el límite mira n muy grande.' },
            { id: 'cero', texto: '0', error: 'TAL-LIM-CERO', siFuera: 'Sería 0 si el numerador no tuviera n.' },
          ]),
          solucion: { texto: `Para n grande, (${num})/(${den}) se parece a ${p === 1 ? '' : p === -1 ? '−' : f(p)}n/${u === 1 ? '' : f(u)}n.`, ecuacion: ['lím ', an('n'), ` = ${fr(p, u)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: la regla y sus condiciones iniciales ----------
  // Cambia: a₁ y a₂ · Permanece: la regla aₙ = aₙ₋₁ + aₙ₋₂ · Progresa: las casillas, una por paso · Se reserva: a₆
  // · Debe verse: cada casilla sale de las dos anteriores; con otros comienzos, otra sucesión.
  const recurrencia = (a1, a2, N) => { const v = [a1, a2]; while (v.length < N) v.push(v[v.length - 1] + v[v.length - 2]); return v; };
  const tablaRec = (v, { pasos = false, oculta = null, ver = Infinity, resaltar = null } = {}) => ({
    columnas: v.map((_, k) => `a${sub(k + 1)}`), colorCol: v.map((_, k) => (k < 2 ? 'o' : null)),
    filas: [v.map((x, k) => (k === oculta ? { t: '?', hueco: true } : k >= ver ? '' : { t: f(x), color: k < 2 ? 'o' : 'd', fuerte: true, desde: pasos && k >= 2 ? k - 1 : 0 }))],
    resaltes: resaltar === null ? [] : [{ f: 0, c: resaltar, color: 'd' }],
    alt: `Sucesión recurrente: ${v.map(x => f(x)).join(', ')}`,
  });
  const recurrentes = {
    id: 'recurrencia',
    titulo: 'Cada término sale de anteriores',
    temas: ['Sucesiones recurrentes y Fibonacci'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'La regla es: cada término es la suma de los dos anteriores. Elige los dos primeros y mira cómo cambia toda la fila.',
      voz: 'Misma regla, otros comienzos. Compara.',
      controles: [
        { id: 'a1', etiqueta: 'a₁', min: 0, max: 5, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
        { id: 'a2', etiqueta: 'a₂', min: 0, max: 5, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
      ],
      dibujo: val => ({ datos: tablaRec(recurrencia(val.a1, val.a2, 7)), estado: {} }),
      lectura: val => [an('7'), ` = ${f(recurrencia(val.a1, val.a2, 7)[6])}`],
      minimo: 3,
    },
    predice: (() => {
      const v = recurrencia(2, 5, 7), fib = recurrencia(1, 1, 6);
      return {
        pregunta: ['Con ', an('n'), ' = ', an('n−1'), ' + ', an('n−2'), ', ', an('1'), ' = 2 y ', an('2'), ' = 5, ¿cuánto vale ', an('6'), '?'],
        opciones: [
          { id: 'c', texto: f(v[5]), correcta: true },
          { id: 'fibo', texto: f(fib[5]), error: 'TAL-FIBO-CLASICA', siFuera: `${fib[5]} es a₆ si se empieza con 1 y 1. Aquí empieza con 2 y 5.` },
          { id: 'a5', texto: f(v[4]), error: 'TAL-CONTEO', siFuera: `${v[4]} es a₅; falta un paso más.` },
          { id: 'a7', texto: f(v[6]), error: 'TAL-CONTEO', siFuera: `${v[6]} es a₇; contaste un paso de más.` },
        ],
        dibujo: { datos: tablaRec(v.slice(0, 6), { ver: 2, oculta: 5 }), estado: {} },
        revelar: { datos: tablaRec(v.slice(0, 6), { resaltar: 5 }), estado: {} },
        coincide: `Coincide: 2, 5, 7, 12, 19 y ${f(v[5])}.`,
      };
    })(),
    mira: (() => {
      const v = recurrencia(2, 5, 6);
      return {
        datos: tablaRec(v, { pasos: true }),
        voz: 'Vuelvo a un valor concreto para probar el patrón.',
        pasos: [
          { estado: { corte: 1 }, texto: 'a₃ sale de los dos primeros.', ecuacion: [an('3'), ` = ${v[1]} + ${v[0]} = ${v[2]}`] },
          { estado: { corte: 2 }, texto: 'a₄ usa a₃ y a₂.', ecuacion: [an('4'), ` = ${v[2]} + ${v[1]} = ${v[3]}`] },
          { estado: { corte: 3 }, texto: 'a₅ usa a₄ y a₃.', ecuacion: [an('5'), ` = ${v[3]} + ${v[2]} = ${v[4]}`] },
          { estado: { corte: 4 }, texto: 'a₆ usa a₅ y a₄.', ecuacion: [an('6'), ` = ${v[4]} + ${v[3]} = ${v[5]}`] },
          { estado: { corte: 4 }, texto: 'Con 1 y 1 la misma regla da Fibonacci: otra sucesión.', ecuacion: ['1, 1, 2, 3, 5, 8, …'] },
        ],
      };
    })(),
    regla: {
      texto: 'Una sucesión recurrente da cada término a partir de los anteriores. Necesita sus condiciones iniciales: Fibonacci usa dos, a₁ y a₂.',
      ecuacion: [an('n'), ' = ', an('n−1'), ' + ', an('n−2')],
      condicion: 'la regla vale desde n = 3; sin a₁ y a₂ declarados, la sucesión no queda determinada.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const a1 = r.ent(1, 6), a2 = r.ent(1, 7), m = r.ent(5, 8), v = recurrencia(a1, a2, m + 1), fib = recurrencia(1, 1, m);
          return {
            pregunta: ['Con ', an('n'), ' = ', an('n−1'), ' + ', an('n−2'), ', ', an('1'), ` = ${a1} y `, an('2'), ` = ${a2}, ¿cuánto vale `, an(String(m)), '?'],
            opciones: distintas([
              { id: 'c', texto: f(v[m - 1]), correcta: true },
              { id: 'antes', texto: f(v[m - 2]), error: 'TAL-CONTEO', siFuera: `Ese es a${sub(m - 1)}; falta un paso.` },
              { id: 'despues', texto: f(v[m]), error: 'TAL-CONTEO', siFuera: `Ese es a${sub(m + 1)}; hay un paso de más.` },
              { id: 'fibo', texto: f(fib[m - 1]), error: 'TAL-FIBO-CLASICA', siFuera: `Ese sale de empezar con 1 y 1; aquí empieza con ${a1} y ${a2}.` },
            ]),
            solucion: { texto: 'Se suman los dos anteriores, paso a paso.', ecuacion: [v.slice(0, m).map(x => f(x)).join(', ')] },
          };
        }
        const a1 = r.ent(1, 4), c = r.noCero(-3, 3), m = r.ent(4, 6);
        const v = [a1]; while (v.length < m + 1) v.push(2 * v[v.length - 1] + c);
        return {
          pregunta: ['Con ', an('n'), ' = 2', an('n−1'), ` ${c < 0 ? '−' : '+'} ${Math.abs(c)} y `, an('1'), ` = ${a1}, ¿cuánto vale `, an(String(m)), '?'],
          opciones: distintas([
            { id: 'c', texto: f(v[m - 1]), correcta: true },
            { id: 'antes', texto: f(v[m - 2]), error: 'TAL-CONTEO', siFuera: `Ese es a${sub(m - 1)}; falta un paso.` },
            { id: 'despues', texto: f(v[m]), error: 'TAL-CONTEO', siFuera: `Ese es a${sub(m + 1)}; hay un paso de más.` },
            { id: 'sin-c', texto: f(a1 * 2 ** (m - 1)), error: 'TAL-REC-SIN-C', siFuera: `Eso solo duplica; cada paso también suma ${f(c)}.` },
          ]),
          solucion: { texto: `Cada término es el doble del anterior ${c < 0 ? 'menos' : 'más'} ${Math.abs(c)}.`, ecuacion: [v.slice(0, m).map(x => f(x)).join(', ')] },
        };
      },
    },
  };

  // ---------- Idea 4: al derecho y al revés (sumas notables) ----------
  // Cambia: n · Permanece: las dos filas, 1 … n y n … 1 · Progresa: las columnas que suman n + 1 · Se reserva: la
  // mitad final · Debe verse: dos copias de la suma forman n columnas iguales.
  const tablaGauss = (m, pasos = false) => ({
    columnas: Array.from({ length: m }, () => ''),
    rotulosFila: ['S', 'S', '2S'], colorFila: ['d', 'd', 'd'],
    filas: [
      Array.from({ length: m }, (_, k) => ({ t: f(k + 1), color: 'o' })),
      Array.from({ length: m }, (_, k) => ({ t: f(m - k), color: 'o', desde: pasos ? 1 : 0 })),
      Array.from({ length: m }, () => ({ t: f(m + 1), color: 'd', fuerte: true, desde: pasos ? 2 : 0 })),
    ],
    separador: { fila: 2 },
    alt: `La suma 1 + … + ${m} escrita al derecho y al revés: cada columna da ${m + 1}`,
  });
  const gauss = {
    id: 'gauss',
    titulo: 'Al derecho y al revés',
    temas: ['Sumas notables y series telescópicas', 'Progresiones aritméticas y geométricas'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Arriba va 1 + 2 + … + n; debajo, la misma suma al revés. Cambia n y suma cada columna.',
      voz: 'Fíjate en qué da cada columna.',
      controles: [{ id: 'n', etiqueta: 'n', min: 3, max: 8, paso: 1, inicio: 4, decimales: 0, color: 'c-i' }],
      dibujo: val => ({ datos: tablaGauss(val.n), estado: {} }),
      lectura: val => ['2', Sn(''), ` = ${val.n} · ${val.n + 1} → `, Sn(''), ` = ${f(val.n * (val.n + 1) / 2)}`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuánto vale 1 + 2 + 3 + … + 40?',
      opciones: [
        { id: 'c', texto: f(40 * 41 / 2), correcta: true },
        { id: 'doble', texto: f(40 * 41), error: 'TAL-GAUSS-MITAD', siFuera: `${40 * 41} es 2S: las dos filas juntas. La suma es la mitad.` },
        { id: 'cuadrado', texto: f(40 * 40 / 2), error: 'TAL-GAUSS-N', siFuera: 'Eso usa 40 · 40; cada columna da 40 + 1 = 41.' },
        { id: 'mas', texto: f(41 * 42 / 2), error: 'TAL-CONTEO', siFuera: 'Eso suma hasta 41.' },
      ],
      dibujo: { datos: { columnas: ['1', '2', '3', '…', '40'], colorCol: ['o', 'o', 'o', null, 'o'], filas: [['', '', '', '', '']], rotulosFila: ['S'], colorFila: ['d'], alt: 'La suma 1 + 2 + … + 40' }, estado: {} },
      revelar: { datos: { columnas: ['1', '2', '3', '…', '40'], colorCol: ['o', 'o', 'o', null, 'o'], rotulosFila: ['al revés', '2S'], colorFila: ['d', 'd'], filas: [['40', '39', '38', '…', '1'], ['41', '41', '41', '…', '41'].map(t => ({ t, color: 'd', fuerte: true }))], pie: `40 columnas de 41: S = ${f(40 * 41 / 2)}`, alt: 'Cuarenta columnas que suman 41 cada una' }, estado: {} },
      coincide: `Coincide: 40 columnas de 41 son ${40 * 41}, y S es la mitad: ${f(820)}.`,
    },
    mira: {
      datos: tablaGauss(6, true),
      pasos: [
        { estado: { corte: 0 }, texto: 'S = 1 + 2 + 3 + 4 + 5 + 6.', ecuacion: [Sn(''), ' = 1 + 2 + … + 6'] },
        { estado: { corte: 1 }, texto: 'Debajo, la misma suma al revés: vale lo mismo.', ecuacion: [Sn(''), ' = 6 + 5 + … + 1'] },
        { estado: { corte: 2 }, texto: 'Cada columna da 7, y hay 6 columnas.', ecuacion: ['2', Sn(''), ' = 6 · 7 = 42'] },
        { estado: { corte: 2 }, texto: 'La suma pedida es la mitad.', ecuacion: [Sn(''), ' = 42 ÷ 2 = 21'] },
      ],
    },
    regla: {
      texto: 'Al sumar al derecho y al revés, cada columna da lo mismo: primer término más último. Así, 1 + 2 + … + n = n(n + 1)/2.',
      ecuacion: [Sn('n'), ' = ', { frac: [[n, '(', an('1'), ' + ', an('n'), ')'], '2'] }],
      condicion: 'vale para progresiones aritméticas: términos que suben siempre lo mismo, como 1, 2, 3, … o 3, 7, 11, …',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const tipo = s % 3;
        let a1, d, m;
        if (tipo === 0) { a1 = 1; d = 1; m = r.ent(20, 60); }
        else if (tipo === 1) { a1 = 1; d = 2; m = r.ent(10, 30); }
        else { a1 = r.ent(2, 9); d = r.ent(3, 6); m = r.ent(8, 20); }
        const am = a1 + (m - 1) * d, bien = m * (a1 + am) / 2;
        const lista = `${a1} + ${a1 + d} + ${a1 + 2 * d} + … + ${am}`;
        return {
          pregunta: `¿Cuánto vale ${lista}?`,
          opciones: distintas([
            { id: 'c', texto: f(bien), correcta: true },
            { id: 'doble', texto: f(m * (a1 + am)), error: 'TAL-GAUSS-MITAD', siFuera: 'Eso es 2S, las dos filas juntas.' },
            { id: 'cols', texto: f(Number.isInteger(am * (a1 + am) / 2) ? am * (a1 + am) / 2 : NaN), error: 'TAL-GAUSS-N', siFuera: `El número de columnas es la cantidad de términos, ${m}, no el último.` },
            { id: 'max', texto: f(m * am), error: 'TAL-GAUSS-MAX', siFuera: `Eso cuenta ${m} veces el último término; los demás son menores.` },
            { id: 'uno', texto: f((m - 1) * (2 * a1 + (m - 2) * d) / 2), error: 'TAL-CONTEO', siFuera: `Eso suma solo ${m - 1} términos; hay ${m}.` },
          ]),
          solucion: { texto: `Hay ${m} términos; cada columna da ${a1} + ${am} = ${a1 + am}.`, ecuacion: [Sn(String(m)), ` = ${m} · ${a1 + am} ÷ 2 = ${f(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: lo de en medio se cancela (telescópica) ----------
  // Cambia: n · Permanece: cada término escrito como 1/k − 1/(k + 1) · Progresa: las casillas que se cancelan
  // · Se reserva: los dos extremos · Debe verse: la suma es el primero menos el último.
  const tablaTel = (m, { cancelar = true, pasos = false } = {}) => ({
    columnas: ['k', '1/k', '− 1/(k + 1)'], colorCol: ['i', 'o', 'o'],
    filas: Array.from({ length: m }, (_, i) => {
      const k = i + 1;
      const primero = k === 1, ultimo = k === m;
      return [f(k),
        { t: k === 1 ? '1' : `1/${k}`, color: primero ? 'd' : undefined, fuerte: primero, hueco: cancelar && !primero, desde: pasos && !primero ? 2 : 0 },
        { t: `−1/${k + 1}`, color: ultimo ? 'd' : undefined, fuerte: ultimo, hueco: cancelar && !ultimo, desde: 0 }];
    }),
    pie: cancelar ? `Quedan 1 y −1/${m + 1}: S = ${fr(m, m + 1)}` : '',
    alt: `Suma de 1/(k(k + 1)) de k = 1 a ${m}: se cancelan los de en medio y queda 1 − 1/${m + 1}`,
  });
  const telescopica = {
    id: 'telescopica',
    titulo: 'Lo de en medio se cancela',
    temas: ['Sumas notables y series telescópicas'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Cada término 1/(k(k + 1)) se escribe como 1/k − 1/(k + 1). Cambia n: las casillas punteadas se cancelan con la fila vecina.',
      voz: 'Busca qué casillas sobreviven.',
      controles: [{ id: 'n', etiqueta: 'n', min: 2, max: 7, paso: 1, inicio: 3, decimales: 0, color: 'c-i' }],
      dibujo: val => ({ datos: tablaTel(val.n), estado: {} }),
      lectura: val => [Sn(String(val.n)), ` = 1 − 1/${val.n + 1} = ${fr(val.n, val.n + 1)}`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuánto vale 1/(1·2) + 1/(2·3) + 1/(3·4) + … + 1/(9·10)?',
      opciones: [
        { id: 'c', texto: fr(9, 10), correcta: true },
        { id: 'uno', texto: '1', error: 'TAL-INF', siFuera: '1 es la suma de infinitos términos. Con nueve queda 1 − 1/10.' },
        { id: 'ultimo', texto: '1/10', error: 'TAL-EXTREMO', siFuera: '1/10 es lo que se resta al final; falta el 1 del comienzo.' },
        { id: 'diez', texto: fr(10, 11), error: 'TAL-CONTEO', siFuera: '10/11 sumaría diez términos: el último sería 1/(10·11).' },
      ],
      dibujo: { datos: tablaTel(9, { cancelar: false }), estado: {} },
      revelar: { datos: tablaTel(9), estado: {} },
      coincide: 'Coincide: de nueve filas solo sobreviven 1 y −1/10.',
    },
    mira: {
      datos: Object.assign(tablaTel(4, { pasos: true }), { pie: '' }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada término es una diferencia.', ecuacion: [{ frac: ['1', 'k(k + 1)'] }, ' = ', { frac: ['1', 'k'] }, ' − ', { frac: ['1', 'k + 1'] }] },
        { estado: { corte: 2 }, texto: 'El −1/2 de una fila anula el 1/2 de la siguiente.', ecuacion: ['−1/2 + 1/2 = 0,  −1/3 + 1/3 = 0, …'] },
        { estado: { corte: 2 }, texto: 'Quedan el primero y el último.', ecuacion: [Sn('4'), ` = 1 − 1/5 = ${fr(4, 5)}`] },
        { estado: { corte: 2 }, texto: 'Para cualquier n pasa lo mismo; si n crece, se acerca a 1.', ecuacion: [Sn('n'), ' = 1 − ', { frac: ['1', [n, ' + 1']] }, ' → 1'] },
      ],
    },
    regla: {
      texto: 'Si cada término es una diferencia de la forma bₖ − bₖ₊₁, al sumar se cancelan los de en medio y quedan los extremos.',
      ecuacion: [Sn('n'), ' = ', { sub: ['b', '1'] }, ' − ', { sub: ['b', 'n+1'] }],
      condicion: 'todos los términos siguen el mismo patrón bₖ − bₖ₊₁, sin saltarse ninguno.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const m = r.ent(4, 30);
          return {
            pregunta: `¿Cuánto vale 1/(1·2) + 1/(2·3) + … + 1/(${m}·${m + 1})?`,
            opciones: distintas([
              { id: 'c', texto: fr(m, m + 1), correcta: true },
              { id: 'uno', texto: '1', error: 'TAL-INF', siFuera: `1 es la suma infinita; con ${m} términos queda 1 − 1/${m + 1}.` },
              { id: 'ultimo', texto: fr(1, m + 1), error: 'TAL-EXTREMO', siFuera: 'Eso es solo lo que se resta al final.' },
              { id: 'cuenta', texto: fr(m - 1, m), error: 'TAL-CONTEO', siFuera: `Eso suma ${m - 1} términos.` },
            ]),
            solucion: { texto: 'Se cancelan los de en medio; quedan el primero y el último.', ecuacion: [`1 − 1/${m + 1} = ${fr(m, m + 1)}`] },
          };
        }
        // 1/(k(k + 2)) = ½(1/k − 1/(k + 2)): sobreviven dos al inicio y dos al final.
        const m = r.ent(4, 12);
        const num = 3 * (m + 1) * (m + 2) - 2 * (m + 2) - 2 * (m + 1), den = 4 * (m + 1) * (m + 2);   // ½(1 + 1/2 − 1/(m+1) − 1/(m+2))
        return {
          pregunta: `¿Cuánto vale 1/(1·3) + 1/(2·4) + … + 1/(${m}·${m + 2})? Usa 1/(k(k + 2)) = ½(1/k − 1/(k + 2)).`,
          opciones: distintas([
            { id: 'c', texto: fr(num, den), correcta: true },
            { id: 'sin-medio', texto: fr(2 * num, den), error: 'TAL-TEL-FACTOR', siFuera: 'Falta multiplicar por ½.' },
            { id: 'uno-solo', texto: fr((m + 2) - 1, 2 * (m + 2)), error: 'TAL-TEL-DOS', siFuera: 'Aquí se cancelan de dos en dos: sobreviven 1 y 1/2 al inicio.' },
            { id: 'inf', texto: fr(3, 4), error: 'TAL-INF', siFuera: '3/4 es la suma infinita; aquí hay una cantidad finita de términos.' },
          ]),
          solucion: { texto: `Sobreviven 1 y 1/2 al inicio; −1/${m + 1} y −1/${m + 2} al final.`, ecuacion: [`½(1 + 1/2 − 1/${m + 1} − 1/${m + 2}) = ${fr(num, den)}`] },
        };
      },
    },
  };

  // ---------- Idea 6: la suma infinita es un límite ----------
  // Cambia: la razón r · Permanece: a₁ = 1 y los ejes n, Sₙ · Progresa: las sumas parciales · Se reserva: la
  // armónica, cuyos términos tienden a 0 y la suma no se detiene · Debe verse: converger es que Sₙ se acerque.
  const RAZONES = { '1/2': [1, 2], '1/3': [1, 3], '2/3': [2, 3], '−1/2': [-1, 2], '1': [1, 1] };
  const parciales = (rr, N) => { let sAcc = 0; return Array.from({ length: N }, (_, k) => { sAcc += rr ** k; return { x: k + 1, y: sAcc }; }); };
  const armonica = N => { let sAcc = 0; return Array.from({ length: N }, (_, k) => (sAcc += 1 / (k + 1))); };
  const ejesS = (xmax, ymax, extra) => Object.assign(ejes(xmax, 0, ymax), extra, { y: Object.assign(ejes(xmax, 0, ymax).y, { nombre: 'Sₙ', color: 'd' }) });
  const geometrica = {
    id: 'serie-geometrica',
    titulo: 'La suma infinita es un límite',
    temas: ['Serie geométrica y convergencia'],
    pieza: 'ejes',
    juega: {
      consigna: 'Se suma 1 + r + r² + r³ + … Elige la razón r: cada punto es la suma de los primeros n términos.',
      voz: 'Mira si los puntos se detienen en una altura.',
      controles: [{ id: 'r', etiqueta: 'r', opciones: ['1/2', '1/3', '2/3', '−1/2', '1'].map(t => ({ valor: t, texto: t })) }],
      dibujo: val => {
        const [p, q] = RAZONES[val.r], rr = p / q, ps = parciales(rr, 10).map(o => Object.assign(o, { color: 'd' }));
        const lim = Math.abs(rr) < 1 ? q / (q - p) : null;
        return { datos: ejesS(11, Math.max(3, ...ps.map(o => o.y)), { puntos: ps, curvas: lim === null ? [] : [{ puntos: [[0, lim], [11, lim]], color: 'h', discontinua: true, rotulo: fr(q, q - p) }], alt: `Sumas parciales con r = ${val.r}` }), estado: {} };
      },
      lectura: val => {
        const [p, q] = RAZONES[val.r];
        return [Sn('10'), ` = ${f(parciales(p / q, 10)[9].y)} · ${Math.abs(p / q) < 1 ? `se acerca a ${fr(q, q - p)}` : 'crece sin tope'}`];
      },
      minimo: 3,
    },
    predice: (() => {
      const H = armonica(64), marcas = [1, 2, 4, 8, 16, 32, 64];
      const datos = con => ejesS(64, 5, {
        puntos: (con ? marcas : [1, 2, 4, 8]).map(m => ({ x: m, y: H[m - 1], color: 'd', rotulo: con && m >= 16 ? f(H[m - 1], 1) : undefined })),
        curvas: con ? [{ puntos: [[0, 2], [64, 2]], color: 'h', discontinua: true, rotulo: 'geométrica: 2' }] : [],
        alt: con ? 'Sumas de la armónica en n = 1, 2, 4, …, 64: siguen subiendo y pasan de 4' : 'Sumas de la armónica hasta n = 8',
      });
      return {
        pregunta: 'Los términos de 1 + 1/2 + 1/3 + 1/4 + … se acercan a 0. ¿Sus sumas parciales se acercan a un número fijo?',
        opciones: [
          { id: 'c', texto: 'No: crecen sin tope, aunque despacio', correcta: true },
          { id: 'cero', texto: 'Sí, porque los términos tienden a 0', error: 'TAL-TERMINO-CERO', siFuera: 'Que los términos tiendan a 0 hace falta, pero no basta: aquí la suma no se detiene.' },
          { id: 'dos', texto: 'Sí, a 2, como 1 + 1/2 + 1/4 + …', error: 'TAL-GEOM-ARMONICA', siFuera: `Esa es la geométrica. La armónica ya pasa de 2 en n = 4: S₄ = ${f(H[3])}.` },
        ],
        dibujo: { datos: datos(false), estado: {} },
        revelar: { datos: datos(true), estado: {} },
        coincide: `Coincide: cada vez que n se duplica, la suma crece más de 1/2. En n = 64 ya va en ${f(H[63], 1)}.`,
      };
    })(),
    mira: (() => {
      const G = parciales(0.5, 8), H = armonica(16);
      return {
        datos: ejesS(16, 4, {
          puntos: [...G.map(o => Object.assign(o, { color: 'd', desde: 1 })), ...[1, 2, 4, 8, 16].map(m => ({ x: m, y: H[m - 1], color: 'o', abierto: true, desde: 3, rotulo: m === 16 ? f(H[15], 1) : undefined }))],
          curvas: [{ puntos: [[0, 2], [16, 2]], color: 'h', discontinua: true, rotulo: '2', desde: 2 }],
          alt: 'Las sumas de 1 + 1/2 + 1/4 + … se acercan a 2; las de la armónica pasan de 2 y siguen subiendo',
        }),
        pasos: [
          { estado: { corte: 1 }, texto: 'Con r = 1/2: 1, 1,5, 1,75, 1,875… cada salto es la mitad.', ecuacion: [Sn('n'), ' = 1 + 1/2 + … + 1/2ⁿ⁻¹'] },
          { estado: { corte: 2 }, texto: 'Las sumas se acercan a 2: ese límite es la suma de la serie.', ecuacion: [{ frac: ['1', '1 − 1/2'] }, ' = 2'] },
          { estado: { corte: 3 }, texto: 'La armónica: sus términos también tienden a 0, pero sus sumas pasan de 2.', ecuacion: [Sn('16'), ` = ${f(H[15], 2)}`] },
          { estado: { corte: 3 }, texto: 'Cada bloque, como 1/3 + 1/4, pasa de 1/2.', ecuacion: ['cada bloque > 1/2'] },
        ],
      };
    })(),
    regla: {
      texto: 'Una serie converge si sus sumas parciales se acercan a un número. La geométrica con |r| < 1 suma a₁/(1 − r). Que los términos tiendan a 0 no basta.',
      ecuacion: [{ sub: ['S', '∞'] }, ' = ', { frac: [an('1'), '1 − r'] }],
      condicion: '|r| < 1. Con |r| ≥ 1 la geométrica no converge; la armónica tiene términos que tienden a 0 y no converge.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const [p, q] = r.uno([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [-1, 2], [-1, 3], [3, 2], [2, 1], [-2, 1]]);
        const a1 = r.uno([1, 2, 3, 4, 6, 8, 9, 12]);
        const conv = Math.abs(p) < q;
        const rt = fr(p, q), formula = fr(a1 * q, q - p);
        const NO = 'No converge';
        return {
          pregunta: ['Serie geométrica con ', an('1'), ` = ${a1} y r = ${rt}. ¿Cuánto vale la suma infinita?`],
          opciones: distintas([
            { id: 'c', texto: conv ? formula : NO, correcta: true },
            conv ? { id: 'no', texto: NO, error: 'TAL-GEOM-NO', siFuera: `Con |r| < 1 los términos se achican lo bastante: la suma se acerca a ${formula}.` }
              : { id: 'formula', texto: formula, error: 'TAL-FORMULA-SIN-CONDICION', siFuera: `La fórmula pide |r| < 1. Con r = ${rt} las sumas no se detienen.` },
            { id: 'signo', texto: fr(a1 * q, q + p), error: 'TAL-SIGNO-R', siFuera: 'Eso divide entre 1 + r; la fórmula usa 1 − r.' },
            { id: 'segundo', texto: fr(a1 * p, q - p), error: 'TAL-SIN-A1', siFuera: 'Eso empieza a sumar desde el segundo término.' },
          ]),
          solucion: conv
            ? { texto: `|r| < 1: la suma es a₁ entre 1 − r.`, ecuacion: [{ frac: [String(a1), `1 − (${rt})`] }, ` = ${formula}`] }
            : { texto: `|r| ≥ 1: los términos no se achican y las sumas no se detienen.`, ecuacion: [`|r| = ${fr(Math.abs(p), q)} ≥ 1`] },
        };
      },
    },
  };

  return {
    unidad: 'algebra.sucesiones-y-series',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/alg-tabla.js'],
    historia: {
      texto: 'Las series infinitas resultaron muy útiles para calcular, pero sumar infinitos términos con las reglas de las sumas finitas podía llevar a errores. En su Curso de análisis de 1821, Cauchy impulsó estudiar la convergencia de forma explícita. La pregunta que queda es qué significa sumar infinitos términos: se mira la sucesión de sumas parciales y su límite.',
      pregunta: '¿Se puede sumar algo que nunca termina?',
      fuente: { titulo: 'O’Connor y Robertson, Augustin-Louis Cauchy — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Cauchy/' },
    },
    ideas: [progresiones, limite, recurrentes, gauss, telescopica, geometrica],
  };
});
