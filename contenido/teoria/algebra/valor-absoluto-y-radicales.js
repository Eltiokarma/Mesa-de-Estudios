/*
 * Teoría de «Valor absoluto y ecuaciones con radicales» (algebra.valor-absoluto-y-radicales). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 6), expediente teoria-152-unidades (Álgebra) y
 * historia-ecuaciones (pp. 57–68). Errores: AL22 y AL23 de docs/investigacion/algebra-funciones-ideas-erroneas.md,
 * NR4 y NR6 de plantillas/numeros-reales y TAL-* nuevos (hipótesis, rutinas/teoria-algebra.md).
 * Colores (regla 4): x y el centro a naranja (c-o), lo que vale el lado izquierdo (|A|, √u) turquesa (c-i),
 * candidato que no cumple o rama fantasma rojo (c-h), solución verde (c-d).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · |x − a| es una distancia, y elevar al cuadrado puede traer candidatos que la ecuación original no acepta.
 * Persona y condiciones · 4.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · resuelve con dominio, separa casos y descarta candidatos extraños sustituyendo en la original.
 * Orden de atención · 1.º la recta o las dos gráficas · 2.º los puntos de corte y los candidatos · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué √(x + 6) = x da solo x = 3 aunque al cuadrar aparezca también −2.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-o', t: 'x' }, a = { v: 'c-o', t: 'a' }, r = { v: 'c-i', t: 'r' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = l => l[Math.floor(rr() * l.length)];
    return rr;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  // Fracciones exactas: { p, q } con q > 0, para candidatos como 5/3.
  const mcd = (u, v) => (v ? mcd(v, u % v) : Math.abs(u));
  const Q = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = mcd(p, q) || 1; return { p: p / g, q: q / g }; };
  const val = z => z.p / z.q;
  const fr = z => (z.q === 1 ? f(z.p) : `${z.p < 0 ? '−' : ''}${Math.abs(z.p)}/${z.q}`);
  const llaves = l => (l.length ? `{${l.slice().sort((u, v) => val(u) - val(v)).map(fr).join('; ')}}` : '∅');
  const iv = (lo, clo, hi, chi) => `${lo === null ? '(−∞' : (clo ? '[' : '(') + f(lo)}, ${hi === null ? '+∞)' : f(hi) + (chi ? ']' : ')')}`;
  const rectaBase = (min, max, filas, elementos, alt) => ({ min, max, paso: 1, decimales: 0, variable: 'x', color: 'o', filas, elementos, alt });

  // ---------- Idea 1: valor absoluto es distancia ----------
  // Cambia: el centro a y el radio r · Permanece: la recta · Progresa: los dos puntos a distancia r
  // · Se reserva: el «≤», que llena el tramo entre ellos · Debe verse: ≤ es el tramo central y ≥, lo de afuera.
  const conjuntoAbs = (c, rad, rel) => {
    if (rad < 0) return rel === '=' || rel === '≤' || rel === '<' ? '∅' : 'ℝ';
    if (rad === 0) return rel === '=' || rel === '≤' ? `{${f(c)}}` : rel === '<' ? '∅' : rel === '≥' ? 'ℝ' : `(−∞, ${f(c)}) ∪ (${f(c)}, +∞)`;
    const lo = c - rad, hi = c + rad;
    if (rel === '=') return `{${f(lo)}; ${f(hi)}}`;
    if (rel === '≤' || rel === '<') return iv(lo, rel === '≤', hi, rel === '≤');
    return `${iv(null, false, lo, rel === '≥')} ∪ ${iv(hi, rel === '≥', null, false)}`;
  };
  const absX = c => [{ abs: [x, c === 0 ? '' : ` ${c > 0 ? '−' : '+'} ${f(Math.abs(c))}`] }];
  const distancia = {
    id: 'distancia',
    titulo: 'Valor absoluto es distancia',
    temas: ['Valor absoluto y distancia', 'Ecuaciones e inecuaciones con valor absoluto'],
    pieza: 'recta',
    juega: {
      consigna: '|x − a| = r pide los x que están a distancia r del centro a. Mueve el centro y la distancia.',
      voz: 'Prueba también r = 0.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 0, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => ({ datos: rectaBase(-8, 8, 2, [
        { tipo: 'punto', x: val.a, color: 'o', rotulo: 'a', fila: 0 },
        ...(val.r ? [{ tipo: 'distancia', a: val.a - val.r, b: val.a, color: 'i', rotulo: 'r', fila: 1 }, { tipo: 'distancia', a: val.a, b: val.a + val.r, color: 'i', rotulo: 'r', fila: 1 }] : []),
        { tipo: 'punto', x: val.a - val.r, color: 'd', fila: 2 }, { tipo: 'punto', x: val.a + val.r, color: 'd', fila: 2 },
      ], `Centro ${val.a}; a distancia ${val.r} están ${conjuntoAbs(val.a, val.r, '=')}`), estado: {} }),
      lectura: val => [...absX(val.a), ` = ${f(val.r)} → `, x, ` ∈ ${conjuntoAbs(val.a, val.r, '=')}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Qué valores de ', x, ' cumplen ', ...absX(1), ' ≤ 3?'],
      opciones: [
        { id: 'c', texto: '[−2, 4]', correcta: true },
        { id: 'fuera', texto: '(−∞, −2] ∪ [4, +∞)', error: 'TAL-EXTERIOR', siFuera: 'Ahí la distancia al 1 es 3 o más. «≤ 3» pide estar cerca: entre −2 y 4.' },
        { id: 'barras', texto: '(−∞, 4]', error: 'AL22', siFuera: 'Quitar las barras deja x − 1 ≤ 3. Con x = −5 la distancia es 6.' },
        { id: 'centro', texto: '[−3, 3]', error: 'NR6', siFuera: 'Ese tramo está centrado en 0. |x − 1| mide la distancia al 1.' },
      ],
      dibujo: { datos: rectaBase(-6, 7, 2, [{ tipo: 'punto', x: 1, color: 'o', rotulo: 'centro 1', fila: 0 }], 'Recta con el centro 1 marcado'), estado: {} },
      revelar: { datos: rectaBase(-6, 7, 2, [
        { tipo: 'punto', x: 1, color: 'o', fila: 0 },
        { tipo: 'distancia', a: -2, b: 1, color: 'i', rotulo: '3', fila: 1 }, { tipo: 'distancia', a: 1, b: 4, color: 'i', rotulo: '3', fila: 1 },
        { tipo: 'intervalo', a: -2, b: 4, ca: true, cb: true, color: 'd', rotulo: '|x − 1| ≤ 3', fila: 2 },
      ], 'Los x a distancia 3 o menos del 1: de −2 a 4'), estado: {} },
      coincide: 'Coincide: los puntos a distancia 3 o menos del 1 van de −2 a 4.',
    },
    mira: {
      datos: rectaBase(-6, 7, 3, [
        { tipo: 'punto', x: 1, color: 'o', rotulo: '1', fila: 0 },
        { tipo: 'distancia', a: -2, b: 1, color: 'i', rotulo: '3', fila: 1, desde: 2 }, { tipo: 'distancia', a: 1, b: 4, color: 'i', rotulo: '3', fila: 1, desde: 2 },
        { tipo: 'intervalo', a: -2, b: 4, ca: true, cb: true, color: 'd', rotulo: '≤ 3', fila: 2, desde: 3 },
        { tipo: 'intervalo', a: null, b: -2, cb: true, color: 'h', rotulo: '≥ 3', fila: 3, desde: 4 }, { tipo: 'intervalo', a: 4, b: null, ca: true, color: 'h', fila: 3, desde: 4 },
      ], '|x − 1| ≤ 3 es el tramo [−2, 4]; |x − 1| ≥ 3 es lo de afuera'),
      voz: 'Creo que conviene leer la barra como distancia. Comprobemos.',
      pasos: [
        { estado: { corte: 1 }, texto: '|x − 1| es la distancia de x al 1: el centro es 1.', ecuacion: [...absX(1), ' = distancia de ', x, ' a 1'] },
        { estado: { corte: 2 }, texto: 'A distancia 3 del centro hay dos puntos.', ecuacion: ['1 − 3 = −2   ·   1 + 3 = 4'] },
        { estado: { corte: 3 }, texto: 'A distancia 3 o menos: todo el tramo entre ellos.', ecuacion: [...absX(1), ' ≤ 3  ⇔  −2 ≤ ', x, ' ≤ 4'] },
        { estado: { corte: 4 }, texto: 'A distancia 3 o más: lo de afuera, en dos tramos.', ecuacion: [...absX(1), ' ≥ 3  ⇔  ', x, ' ≤ −2 o ', x, ' ≥ 4'] },
      ],
    },
    regla: {
      texto: '|x − a| es la distancia de x a a. «= r» da a − r y a + r; «≤ r», el tramo entre ellos; «≥ r», lo de afuera.',
      ecuacion: [{ abs: [x, ' − ', a] }, ' ≤ ', r, '  ⇔  ', a, ' − ', r, ' ≤ ', x, ' ≤ ', a, ' + ', r],
      condicion: 'r ≥ 0. Si r < 0, «= r» y «≤ r» no tienen solución, y «≥ r» vale para todo x.',
    },
    ahoraTu: {
      pieza: 'recta',
      generar(s) {
        const rr = azar(s);
        const c = rr.ent(-4, 4), rad = s % 7 === 6 ? -rr.ent(1, 3) : rr.ent(1, 5), rel = ['≤', '≥', '=', '<', '>'][s % 5];
        const bien = conjuntoAbs(c, rad, rel);
        const cambia = { '≤': '≥', '≥': '≤', '<': '>', '>': '<', '=': '≤' };
        return {
          pregunta: ['¿Qué valores de ', x, ' cumplen ', ...absX(c), ` ${rel} ${f(rad)}?`],
          opciones: distintas([
            { id: 'c', texto: bien, correcta: true },
            { id: 'cambia', texto: conjuntoAbs(c, Math.abs(rad), cambia[rel]), error: rad < 0 ? 'TAL-NEGATIVO' : 'TAL-EXTERIOR', siFuera: rad < 0 ? `Una distancia nunca es negativa: compárala con ${f(rad)}.` : rel === '=' ? 'Ese tramo es «≤». El igual pide exactamente esa distancia: dos puntos.' : `Ese conjunto es el de «${cambia[rel]}». ${rel === '≤' || rel === '<' ? 'Cerca' : 'Lejos'} del centro es ${rel === '≤' || rel === '<' ? 'el tramo central' : 'lo de afuera'}.` },
            { id: 'barras', texto: rel === '=' ? `{${f(c + rad)}}` : iv(rel === '≤' || rel === '<' ? null : c + rad, rel === '≥', rel === '≤' || rel === '<' ? c + rad : null, rel === '≤'), error: 'AL22', siFuera: 'Eso quita las barras y mira un solo lado del centro. La distancia cuenta hacia los dos lados.' },
            { id: 'centro', texto: conjuntoAbs(-c, Math.abs(rad), rel), error: 'NR6', siFuera: `|x ${c >= 0 ? '−' : '+'} ${f(Math.abs(c))}| mide la distancia a ${f(c)}, no a ${f(-c)}.` },
          ]).slice(0, 4),
          solucion: {
            texto: rad < 0 ? 'Una distancia es 0 o más: nunca menor que un negativo.' : `Centro ${f(c)}, distancia ${f(rad)}: se mira a los dos lados.`,
            ecuacion: [...absX(c), ` ${rel} ${f(rad)}  ⇔  `, x, ` ∈ ${bien}`],
          },
        };
      },
    },
  };

  // ---------- Idea 2: cada candidato se comprueba (|A| = B) ----------
  // Cambia: la recta y = x + c · Permanece: la V de y = |2x − 1| · Progresa: los candidatos de cada caso
  // · Se reserva: el caso en que los dos candidatos caen bajo el eje · Debe verse: B negativo descarta al candidato.
  const V = v => Math.abs(2 * v - 1);
  const cortes = c => {
    const c1 = Q(c + 1, 1), c2 = Q(1 - c, 3);                  // 2x − 1 = x + c  ·  −(2x − 1) = x + c
    return [c1, c2].map(z => ({ z, ok: val(z) + c >= 0 }));
  };
  const ejesV = (c, o = {}) => {
    const vpts = [], lpts = [];
    for (let k = 0; k <= 40; k++) { const v = -4 + k * 8 / 40; vpts.push(V(v) <= 9 ? [v, V(v)] : null); }
    for (const v of [-4, 4]) lpts.push([v, v + c]);
    const cand = cortes(c);
    return {
      x: { min: -4, max: 4, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: -8, max: 9, paso: 2, cada: 2, nombre: 'y', decimales: 0 },
      curvas: [{ puntos: vpts, color: 'i', rotulo: 'y = |2x − 1|', en: [-3.3, 7.6] }, { puntos: lpts, color: 'o', rotulo: o.rotuloRecta || `y = x ${c >= 0 ? '+' : '−'} ${f(Math.abs(c))}`, en: [3.4, 3.4 + c] }],
      puntos: o.candidatos ? cand.map((k, i) => ({ x: val(k.z), y: val(k.z) + c, color: k.ok ? 'd' : 'h', abierto: !k.ok, rotulo: `${fr(k.z)}${k.ok ? ' ✓' : ' ✗'}`, desde: o.desde ? o.desde[i] : 0 }))
        : cand.filter(k => k.ok).map(k => ({ x: val(k.z), y: val(k.z) + c, color: 'd' })),
      alt: o.alt || `La V y = |2x − 1| y la recta y = x + ${c}: se cortan en ${cand.filter(k => k.ok).length} puntos`,
    };
  };
  const casos = {
    id: 'casos-absoluto',
    titulo: 'Cada candidato se comprueba',
    temas: ['Ecuaciones e inecuaciones con valor absoluto'],
    pieza: 'ejes',
    juega: {
      consigna: 'La V es y = |2x − 1|; la recta, y = x + c. Cada corte es una solución de |2x − 1| = x + c. Mueve c.',
      voz: 'Busca un c con dos cortes y otro sin ninguno.',
      controles: [{ id: 'c', etiqueta: 'c', color: 'c-o', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: ejesV(val.c), estado: {} }),
      lectura: val => [`La recta corta a la V en ${cortes(val.c).filter(k => k.ok).length} puntos`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Al resolver ', { abs: ['2', x, ' − 1'] }, ' = ', x, ' − 4 por casos salen ', x, ' = −3 y ', x, ' = 5/3. ¿Cuál es el conjunto solución?'],
      opciones: [
        { id: 'c', texto: '∅', correcta: true },
        { id: 'ambos', texto: '{−3; 5/3}', error: 'AL23', siFuera: 'Los dos salen de los casos, pero con ellos x − 4 es negativo, y un valor absoluto no lo es.' },
        { id: 'menos3', texto: '{−3}', error: 'AL23', siFuera: 'Con x = −3: |−7| = 7 y x − 4 = −7. No son iguales.' },
        { id: 'cinco', texto: '{5/3}', error: 'AL23', siFuera: 'Con x = 5/3: |7/3| = 7/3 y x − 4 = −7/3. No son iguales.' },
      ],
      dibujo: { datos: ejesV(-4, { alt: 'La V y = |2x − 1| y la recta y = x − 4' }), estado: {} },
      revelar: { datos: ejesV(-4, { candidatos: true, alt: 'Los candidatos −3 y 5/3 quedan en la recta bajo el eje, fuera de la V' }), estado: {} },
      coincide: 'Coincide: la recta pasa por debajo de la V; los dos candidatos caen bajo el eje.',
    },
    mira: {
      datos: ejesV(-4, { candidatos: true, desde: [1, 2], alt: 'Candidatos −3 y 5/3 de |2x − 1| = x − 4: ninguno cumple' }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Caso 1: lo de adentro es igual a x − 4.', ecuacion: ['2', x, ' − 1 = ', x, ' − 4  ⇒  ', x, ' = −3'] },
        { estado: { corte: 1 }, texto: 'Comprobamos: el lado derecho da −7, negativo. No sirve.', ecuacion: ['|−7| = 7 ≠ −7'] },
        { estado: { corte: 2 }, texto: 'Caso 2: lo de adentro es igual a −(x − 4).', ecuacion: ['2', x, ' − 1 = −', x, ' + 4  ⇒  ', x, ' = 5/3'] },
        { estado: { corte: 2 }, texto: 'Comprobamos: el lado derecho da −7/3. Tampoco sirve.', ecuacion: ['|7/3| ≠ −7/3'] },
        { estado: { corte: 2 }, texto: 'Ningún candidato cumple: el conjunto solución es vacío.', ecuacion: ['S = ∅'] },
      ],
    },
    regla: {
      texto: 'Para |A| = B, se resuelven A = B y A = −B. Cada candidato se comprueba en la original: el lado B tiene que ser mayor o igual que 0.',
      ecuacion: [{ abs: ['A'] }, ' = B  ⇔  B ≥ 0 y (A = B o A = −B)'],
      condicion: 'si B depende de x, los casos dan candidatos, no soluciones: solo quedan los que hacen B ≥ 0.',
      voz: 'Yo había comprimido ese paso. Abrámoslo: B no puede ser negativo.',
    },
    ahoraTu: {
      pieza: 'ejes',
      generar(s) {
        const rr = azar(s);
        for (let k = 0; k < 100; k++) {
          // |p x + q| = m x + c: caso 1 da (c − q)/(p − m); caso 2, (−c − q)/(p + m).
          // Con m = 2 > p = 1 siempre queda uno solo; con m = 1 < p quedan dos o ninguno.
          const quiere = s % 3; // 0: uno es extraño · 1: los dos sirven · 2: ninguno sirve
          const p = quiere === 0 ? 1 : rr.uno([2, 3]), m = quiere === 0 ? 2 : 1, q = rr.ent(-5, 5), c = rr.ent(-6, 4);
          const z1 = Q(c - q, p - m), z2 = Q(-c - q, p + m);
          const ok = z => m * val(z) + c >= -1e-12 && Math.abs(Math.abs(p * val(z) + q) - (m * val(z) + c)) < 1e-9;
          const cand = [z1, z2], sol = cand.filter(ok);
          if ((quiere === 0 && sol.length !== 1) || (quiere === 1 && sol.length !== 2) || (quiere === 2 && sol.length !== 0)) continue;
          if (fr(z1) === fr(z2)) continue;
          const A = [p === 1 ? '' : f(p), x, q ? ` ${q > 0 ? '+' : '−'} ${f(Math.abs(q))}` : ''];
          const B = [m === 1 ? '' : f(m), x, c ? ` ${c > 0 ? '+' : '−'} ${f(Math.abs(c))}` : ''];
          const lado = z => fr(Q(m * z.p + c * z.q, z.q));
          const malo = cand.find(z => !ok(z));
          return {
            pregunta: ['Resuelve ', { abs: A }, ' = ', ...B, '.'],
            opciones: distintas([
              { id: 'c', texto: llaves(sol), correcta: true },
              { id: 'ambos', texto: llaves(cand), error: 'AL23', siFuera: malo ? `Con x = ${fr(malo)}, el lado derecho vale ${lado(malo)}: es negativo.` : 'Ese conjunto sí cumple; revisa si los dos candidatos sirven.' },
              { id: 'uno', texto: llaves([z1]), error: 'TAL-UN-CASO', siFuera: 'Eso usa solo el caso A = B. Falta el caso A = −B.' },
              { id: 'vacio', texto: sol.length ? '∅' : llaves([z2]), error: sol.length ? 'TAL-DESCARTA' : 'AL23', siFuera: sol.length ? `x = ${fr(sol[0])} cumple: los dos lados dan ${lado(sol[0])}.` : `Con x = ${fr(z2)}, el lado derecho es negativo.` },
            ]),
            solucion: {
              texto: `Casos: x = ${fr(z1)} y x = ${fr(z2)}. ${sol.length ? `Queda${sol.length === 1 ? '' : 'n'} ${llaves(sol)}` : 'No queda ninguno'}: el lado derecho debe ser ≥ 0.`,
              ecuacion: ['S = ', llaves(sol)],
            },
          };
        }
        throw new Error('sin caso');
      },
    },
  };

  // ---------- Idea 3: cuadrar trae candidatos de más ----------
  // Cambia: el valor de prueba x · Permanece: las curvas y = √(x + 2) e y = x · Progresa: la comparación de los dos
  // lados, antes y después de cuadrar · Se reserva: la rama fantasma y = −√(x + 6) · Debe verse: el extraño vive en la rama negativa.
  const raizCurvas = (k, o = {}) => {
    const pos = [], neg = [];
    for (let i = 0; i <= 40; i++) { const v = -k + i * (4 + k) / 40, w = Math.sqrt(v + k); pos.push([v, w]); neg.push([v, -w]); }
    return {
      x: { min: -k, max: 4, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: -4, max: 4, paso: 1, cada: 2, nombre: 'y', decimales: 0 },
      curvas: [{ puntos: pos, color: 'i', rotulo: `y = √(x + ${k})`, en: [-k + 0.2, 2.8] }, { puntos: [[-k, -k], [4, 4]].map(([u, w]) => [Math.max(u, -4), Math.max(w, -4)]), color: 'o', rotulo: 'y = x', en: [3.9, 3.9] },
        ...(o.fantasma ? [{ puntos: neg, color: 'h', discontinua: true, rotulo: o.rotuloFantasma, en: [-k + 0.3, -2.9], desde: o.fantasmaDesde }] : [])],
      puntos: o.puntos || [],
      alt: o.alt || `Las curvas y = √(x + ${k}) e y = x`,
    };
  };
  const rext = {
    id: 'radical-ecuacion',
    titulo: 'Cuadrar trae candidatos de más',
    temas: ['Ecuaciones con radicales'],
    pieza: 'ejes',
    juega: {
      consigna: 'Para √(x + 2) = x, prueba valores de x. Compara los dos lados y luego sus cuadrados.',
      voz: 'Busca un x con cuadrados iguales y lados distintos.',
      controles: [{ id: 'x', etiqueta: 'x', color: 'c-o', min: -2, max: 3, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: val => ({ datos: raizCurvas(2, { puntos: [{ x: val.x, y: Math.sqrt(val.x + 2), color: 'i', guias: true }, { x: val.x, y: val.x, color: 'o' }], alt: `En x = ${val.x}: √(x + 2) = ${f(Math.sqrt(val.x + 2))} e x = ${val.x}` }), estado: {} }),
      lectura: val => { const L = Math.sqrt(val.x + 2); return [{ raiz: [x, ' + 2'] }, ` = ${f(L)} · `, x, ` = ${f(val.x)} · al cuadrado: ${f(L * L)} y ${f(val.x * val.x)}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: ['Al elevar al cuadrado ', { raiz: [x, ' + 6'] }, ' = ', x, ' salen ', x, ' = 3 y ', x, ' = −2. ¿Cuál es el conjunto solución?'],
      opciones: [
        { id: 'c', texto: '{3}', correcta: true },
        { id: 'ambos', texto: '{−2; 3}', error: 'TAL-EXTRANA', siFuera: `Los dos cumplen x + 6 = x². Pero √4 = ${f(Math.sqrt(4))}, no −2.` },
        { id: 'menos2', texto: '{−2}', error: 'TAL-EXTRANA', siFuera: 'Con x = −2: √4 = 2 y el lado derecho es −2.' },
        { id: 'vacio', texto: '∅', error: 'TAL-DESCARTA', siFuera: `Con x = 3: √9 = ${f(Math.sqrt(9))} = 3. Ese sí cumple.` },
      ],
      dibujo: { datos: raizCurvas(6, { alt: 'Las curvas y = √(x + 6) e y = x' }), estado: {} },
      revelar: { datos: raizCurvas(6, { fantasma: true, rotuloFantasma: 'y = −√(x + 6)', puntos: [{ x: 3, y: 3, color: 'd', rotulo: '3 ✓' }, { x: -2, y: -2, color: 'h', abierto: true, rotulo: '−2 ✗' }], alt: 'Se cortan en x = 3; x = −2 está en la rama y = −√(x + 6)' }), estado: {} },
      coincide: 'Coincide: −2 solo cumple la ecuación cuadrada; es de la rama −√(x + 6).',
    },
    mira: {
      datos: raizCurvas(6, { fantasma: true, fantasmaDesde: 3, rotuloFantasma: '−√(x + 6)', puntos: [{ x: 3, y: 3, color: 'd', rotulo: '3 ✓', desde: 4 }, { x: -2, y: -2, color: 'h', abierto: true, rotulo: '−2 ✗', desde: 3 }], alt: '√(x + 6) = x: al cuadrar se suma la rama −√(x + 6); solo x = 3 cumple la original' }),
      voz: 'Las formas cambiaron; la igualdad debe conservarse en cada paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Dominio: x + 6 ≥ 0. Y como √ no es negativa, x ≥ 0.', ecuacion: [x, ' ≥ −6   ·   ', x, ' ≥ 0'] },
        { estado: { corte: 2 }, texto: 'Elevamos al cuadrado y ordenamos.', ecuacion: [x, ' + 6 = ', { sup: [x, '2'] }, '  ⇒  (', x, ' − 3)(', x, ' + 2) = 0'] },
        { estado: { corte: 3 }, texto: 'El cuadrado no ve el signo: también resuelve −√(x + 6) = x.', ecuacion: ['−', { raiz: ['−2 + 6'] }, ' = −2'] },
        { estado: { corte: 4 }, texto: 'Se comprueba en la original: solo x = 3.', ecuacion: [{ raiz: ['3 + 6'] }, ' = 3   ·   S = {3}'] },
      ],
    },
    regla: {
      texto: 'Elevar al cuadrado no es reversible: junta √u = v con −√u = v. Cada candidato se comprueba en la ecuación original.',
      ecuacion: [{ raiz: ['u'] }, ' = v  ⇔  u = ', { sup: ['v', '2'] }, ' y v ≥ 0'],
      condicion: 'u ≥ 0 y v ≥ 0 en la original. Además √(x²) = |x|, no x.',
    },
    ahoraTu: {
      generar(s) {
        const rr = azar(s);
        for (let k = 0; k < 200; k++) {
          // √(x + K) = x + m: al cuadrar, x² + (2m − 1)x + m² − K = 0, con raíces enteras r1 y r2 (r1 + r2 = 1 − 2m).
          const m = rr.ent(-3, 3), r1 = rr.ent(-5, 6), r2 = 1 - 2 * m - r1, K = m * m - r1 * r2;
          if (r1 === r2 || K < -6 || K > 12) continue;
          const ok = z => z + K >= 0 && z + m >= 0 && Math.abs(Math.sqrt(z + K) - (z + m)) < 1e-9;
          const cand = [r1, r2].sort((u, v) => u - v), sol = cand.filter(ok);
          const quiere = s % 3; // 0 y 2: uno es extraño · 1: los dos sirven o ninguno
          if ((quiere !== 1 && sol.length !== 1) || (quiere === 1 && sol.length === 1)) continue;
          const L = l => (l.length ? `{${l.map(z => f(z)).join('; ')}}` : '∅');
          const malo = cand.find(z => !ok(z));
          return {
            pregunta: ['Resuelve ', { raiz: [x, K ? ` ${K > 0 ? '+' : '−'} ${f(Math.abs(K))}` : ''] }, ' = ', x, m ? ` ${m > 0 ? '+' : '−'} ${f(Math.abs(m))}` : '', '.'],
            opciones: distintas([
              { id: 'c', texto: L(sol), correcta: true },
              { id: 'ambos', texto: L(cand), error: 'TAL-EXTRANA', siFuera: malo !== undefined ? `Con x = ${f(malo)}, el lado derecho vale ${f(malo + m)}, y una raíz no es negativa.` : 'Comprueba cada candidato en la original.' },
              sol.length === 2 ? { id: 'otro', texto: L([cand[0]]), error: 'TAL-DESCARTA', siFuera: `x = ${f(cand[1])} también cumple: los dos lados dan ${f(cand[1] + m)}.` }
                : { id: 'otro', texto: L(cand.filter(z => !sol.includes(z))), error: 'TAL-EXTRANA', siFuera: 'Ese candidato cumple el cuadrado, pero no la original.' },
              { id: 'vacio', texto: sol.length ? '∅' : L([cand[1]]), error: 'TAL-DESCARTA', siFuera: sol.length ? `x = ${f(sol[0])} cumple: los dos lados dan ${f(sol[0] + m)}.` : 'Ese candidato hace negativo el lado derecho.' },
            ]),
            solucion: { texto: `Al cuadrar salen ${f(cand[0])} y ${f(cand[1])}; se comprueba cada uno en la original.`, ecuacion: ['S = ', L(sol)] },
          };
        }
        throw new Error('sin caso');
      },
    },
  };

  // ---------- Idea 4: primero el dominio, después cuadrar ----------
  // Cambia: el número k del lado derecho · Permanece: la curva y = √(x − 1) · Progresa: el tramo del eje x que cumple
  // · Se reserva: k negativo, donde no se cuadra · Debe verse: la solución empieza donde empieza el dominio.
  const ejesRaiz1 = (k, rel, o = {}) => {
    const pts = []; for (let i = 0; i <= 44; i++) { const v = 1 + i * 11 / 44; pts.push([v, Math.sqrt(v - 1)]); }
    let seg = [];
    if (rel === '<') seg = k > 0 ? [[1, 0], [1 + k * k, 0]] : [];
    if (rel === '≥') seg = k <= 0 ? [[1, 0], [12, 0]] : [[1 + k * k, 0], [12, 0]];
    return {
      x: { min: 0, max: 12, paso: 1, cada: 2, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: -3, max: 4, paso: 1, nombre: 'y', decimales: 0 },
      curvas: [{ puntos: pts, color: 'i', rotulo: 'y = √(x − 1)', en: [11.8, 1.6] }, { puntos: [[0, k], [12, k]], color: 'h', discontinua: true, rotulo: `y = ${f(k)}`, en: [0.2, k] },
        ...(seg.length ? [{ puntos: seg, color: 'd', desde: o.solDesde }] : [])],
      puntos: [{ x: 1, y: 0, color: 'd', rotulo: 'empieza el dominio', desde: o.domDesde }, ...(o.puntos || [])],
      alt: o.alt || `y = √(x − 1) frente a y = ${k}`,
    };
  };
  const rinec = {
    id: 'radical-inecuacion',
    titulo: 'Primero el dominio, después cuadrar',
    temas: ['Inecuaciones con radicales'],
    pieza: 'ejes',
    juega: {
      consigna: 'Resuelve √(x − 1) < k mirando dónde la curva queda bajo la recta y = k. En verde, los x que cumplen.',
      voz: 'Prueba un k negativo también.',
      controles: [{ id: 'k', etiqueta: 'k', color: 'c-h', min: -1, max: 3, paso: 1, inicio: 2, decimales: 0 }],
      dibujo: val => ({ datos: ejesRaiz1(val.k, '<'), estado: {} }),
      lectura: val => [{ raiz: [x, ' − 1'] }, ` < ${f(val.k)} → ${val.k > 0 ? iv(1, true, 1 + val.k * val.k, false) : '∅'}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Qué valores de ', x, ' cumplen ', { raiz: [x, ' − 1'] }, ' ≥ −2?'],
      opciones: [
        { id: 'c', texto: '[1, +∞)', correcta: true },
        { id: 'todo', texto: 'ℝ', error: 'TAL-DOMINIO', siFuera: 'Con x = 0, √(−1) no es real. La raíz existe desde x = 1.' },
        { id: 'cuadra', texto: '[5, +∞)', error: 'TAL-CUADRAR', siFuera: 'Cuadrar −2 da 4, pero −2 es negativo: la desigualdad no se conserva. Con x = 2: √1 ≥ −2.' },
        { id: 'vacio', texto: '∅', error: 'TAL-NEGATIVO', siFuera: 'Una raíz nunca es negativa: siempre es mayor que −2 donde existe.' },
      ],
      dibujo: { datos: ejesRaiz1(-2, null, { alt: 'y = √(x − 1) y la recta y = −2' }), estado: {} },
      revelar: { datos: ejesRaiz1(-2, '≥', { alt: 'La curva está siempre sobre y = −2: cumple todo el dominio, desde x = 1' }), estado: {} },
      coincide: 'Coincide: donde la raíz existe, vale 0 o más, y eso ya es mayor que −2.',
    },
    mira: {
      datos: ejesRaiz1(3, '<', { domDesde: 1, solDesde: 3, puntos: [{ x: 10, y: 3, color: 'h', abierto: true, rotulo: 'x = 10', desde: 2 }], alt: '√(x − 1) < 3: desde x = 1 hasta x = 10, sin incluir 10' }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Dominio: lo de adentro no puede ser negativo.', ecuacion: [x, ' − 1 ≥ 0  ⇒  ', x, ' ≥ 1'] },
        { estado: { corte: 2 }, texto: 'Los dos lados son 0 o más: cuadrar conserva el sentido.', ecuacion: [x, ' − 1 < 9  ⇒  ', x, ' < 10'] },
        { estado: { corte: 3 }, texto: 'Se juntan las dos condiciones.', ecuacion: ['1 ≤ ', x, ' < 10   ·   [1, 10)'] },
      ],
    },
    regla: {
      texto: 'Primero el dominio: lo de adentro de la raíz es 0 o más. Si los dos lados son no negativos, cuadrar conserva la desigualdad.',
      ecuacion: [{ raiz: ['u'] }, ' < k  ⇔  0 ≤ u < ', { sup: ['k', '2'] }],
      condicion: 'k ≥ 0. Con lado derecho negativo no se cuadra: √u < negativo no tiene solución; √u ≥ negativo vale en todo el dominio.',
    },
    ahoraTu: {
      generar(s) {
        const rr = azar(s);
        const p = rr.ent(-3, 3), k = s % 4 === 3 ? -rr.ent(1, 2) : rr.ent(1, 4), rel = ['<', '≥', '≤', '>'][s % 4];
        const ini = -p, fin = k * k - p;   // dominio x ≥ −p; cuadrando, x + p (rel) k²
        let bien;
        if (k < 0) bien = rel === '<' || rel === '≤' ? '∅' : iv(ini, true, null, false);
        else if (rel === '<') bien = iv(ini, true, fin, false);
        else if (rel === '≤') bien = iv(ini, true, fin, true);
        else bien = iv(fin, rel === '≥', null, false);
        const ra = { raiz: [x, p ? ` ${p > 0 ? '+' : '−'} ${f(Math.abs(p))}` : ''] };
        const menor = rel === '<' || rel === '≤', lin = k - p;
        const ops = k < 0 ? [
          { id: 'dominio', texto: menor ? '[' + f(ini) + ', +∞)' : 'ℝ', error: menor ? 'TAL-NEGATIVO' : 'TAL-DOMINIO', siFuera: menor ? 'Una raíz nunca es negativa: no puede ser menor que un negativo.' : `Con x menor que ${f(ini)}, la raíz no existe.` },
          { id: 'ciego', texto: menor ? iv(ini, true, fin, rel === '≤') : iv(fin, rel === '≥', null, false), error: 'TAL-CUADRAR', siFuera: `Cuadrar ${f(k)} solo vale si es 0 o más; aquí es negativo.` },
          { id: 'vacio', texto: menor ? 'ℝ' : '∅', error: 'TAL-NEGATIVO', siFuera: 'Una raíz nunca es negativa: compárala con el signo del lado derecho.' },
        ] : [
          { id: 'dominio', texto: menor ? iv(null, false, fin, rel === '≤') : iv(ini, true, null, false), error: menor ? 'TAL-DOMINIO' : 'TAL-SOLO-DOMINIO', siFuera: menor ? `Ese conjunto incluye valores menores que ${f(ini)}, donde la raíz no existe.` : `Con x = ${f(ini)} la raíz vale 0, que no es ${rel} ${f(k)}.` },
          { id: 'lineal', texto: menor ? iv(ini, true, lin, rel === '≤') : iv(lin, rel === '≥', null, false), error: 'TAL-SIN-CUADRAR', siFuera: `Eso compara x${p ? ` ${p > 0 ? '+' : '−'} ${f(Math.abs(p))}` : ''} con ${f(k)} sin elevar al cuadrado.` },
          { id: 'borde', texto: menor ? iv(ini, true, fin, rel !== '≤') : iv(fin, rel !== '≥', null, false), error: 'NR4', siFuera: `Revisa si x = ${f(fin)} entra: ahí la raíz vale ${f(k)}.` },
        ];
        return {
          pregunta: ['¿Qué valores de ', x, ' cumplen ', ra, ` ${rel} ${f(k)}?`],
          opciones: distintas([{ id: 'c', texto: bien, correcta: true }, ...ops]),
          solucion: {
            texto: k < 0 ? `Dominio x ≥ ${f(ini)}; la raíz nunca es negativa, así que no se cuadra.` : `Dominio x ≥ ${f(ini)}; cuadrando, x ${rel} ${f(fin)}.`,
            ecuacion: ['S = ', bien],
          },
        };
      },
    },
  };

  return {
    unidad: 'algebra.valor-absoluto-y-radicales',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Rafael Bombelli publicó en 1572 su Álgebra, pensada como una exposición más clara y cuidadosa de las reglas de su tiempo. Trabajar con radicales y con cantidades entonces dudosas lo obligaba a revisar cada operación. El valor absoluto moderno no es suyo, pero la necesidad sigue: elevar al cuadrado puede dejar candidatos que la ecuación original no acepta.',
      pregunta: '¿Toda operación se puede deshacer sin perder nada?',
      fuente: { titulo: 'O’Connor y Robertson, Rafael Bombelli — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Bombelli/' },
    },
    ideas: [distancia, casos, rext, rinec],
  };
});
