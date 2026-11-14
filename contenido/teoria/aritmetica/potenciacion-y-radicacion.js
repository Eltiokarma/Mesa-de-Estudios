/*
 * Teoría de «Potenciación y radicación» (aritmetica.potenciacion-y-radicacion). Molde: docs/teoria.md; forma de porcentajes.js.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 17) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Los AT-* son hipótesis nuevas (no hay códigos de esta unidad en docs/investigacion/).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver un cuadrado perfecto como fichas que forman un cuadrado, y la raíz entera como el cuadrado más grande que cabe.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: decide si un número es cuadrado o cubo perfecto por sus exponentes, descarta con la última cifra
 *     sin confundir descartar con confirmar, halla raíz entera y residuo, y acota una raíz por décimas y centésimas.
 *   Orden de atención: 1.º el cuadrado de fichas o la tabla de exponentes · 2.º lo que sobra y lo que falta · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «si 2 021 termina en 1, ¿por qué no es un cuadrado?».
 * Colores (regla 4): N naranja (c-o), la raíz q turquesa (c-i), el residuo rojo (c-h), el cuadrado siguiente verde (c-d).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const N = { v: 'c-o', t: 'N' }, q = { v: 'c-i', t: 'q' }, r = { v: 'c-h', t: 'r' };
  const q1 = { par: [q, ' + 1'] };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const rr = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.de = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || (typeof d.valor === 'number' && !Number.isFinite(d.valor))) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const pot = (p, e) => (e === 1 ? String(p) : `${p}${String(e).split('').map(c => SUP[c]).join('')}`);
  const escribir = fs => fs.filter(([, e]) => e > 0).map(([p, e]) => pot(p, e)).join(' · ') || '1';
  const isqrt = n => { let x = Math.floor(Math.sqrt(n)); while (x * x > n) x--; while ((x + 1) * (x + 1) <= n) x++; return x; };
  const icbrt = n => { let x = Math.floor(Math.cbrt(n)); while (x * x * x > n) x--; while ((x + 1) ** 3 <= n) x++; return x; };

  // ---------- Idea 1: cuadrado o cubo perfecto según los exponentes ----------
  // Cambia: los exponentes de 2, 3 y 5. Permanece: la tabla primo → exponente → ¿par? → ¿múltiplo de 3?
  // Progresa: un exponente impar → todos pares. Se reserva: el factor mínimo que completa. Debe verse: basta un exponente impar.
  const PR = [2, 3, 5];
  const tablaExp = (es, marca = {}) => ({
    columnas: [{ t: 'primo' }, { t: 'exponente', color: 'o' }, { t: '¿par?' }, { t: '¿de a 3?' }],
    filas: PR.map((p, i) => [String(p), { t: String(es[i]), color: 'o' },
      { t: es[i] % 2 === 0 ? 'sí' : 'no', color: es[i] % 2 ? 'h' : undefined, resalta: marca.par && es[i] % 2 === 1 },
      { t: es[i] % 3 === 0 ? 'sí' : 'no', color: es[i] % 3 ? 'h' : undefined, resalta: marca.cubo && es[i] % 3 !== 0 }]),
    filasMax: 3, cabeza: true,
  });
  const valor = es => PR.reduce((acc, p, i) => acc * p ** es[i], 1);
  const clasif = es => { const c = es.every(e => e % 2 === 0), u = es.every(e => e % 3 === 0); return c && u ? 'cuadrado y cubo' : c ? 'cuadrado perfecto' : u ? 'cubo perfecto' : 'ni cuadrado ni cubo'; };
  const perfectos = {
    id: 'perfectos',
    titulo: 'Los exponentes deciden',
    temas: ['Cuadrados y cubos perfectos'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Arma un número con sus exponentes de 2, 3 y 5. La tabla dice si cada exponente es par o múltiplo de 3.',
      voz: 'Busca un número que sea cuadrado y cubo a la vez.',
      controles: [
        { id: 'a', etiqueta: 'exponente de 2', color: 'c-o', min: 0, max: 6, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'exponente de 3', color: 'c-o', min: 0, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'c', etiqueta: 'exponente de 5', color: 'c-o', min: 0, max: 3, paso: 1, inicio: 0, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaExp([v.a, v.b, v.c]), estado: {} }),
      lectura: v => { const es = [v.a, v.b, v.c]; return [N, ` = ${escribir(PR.map((p, i) => [p, es[i]]))} = ${f(valor(es), 0)}: ${clasif(es)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Por qué número mínimo hay que multiplicar ', { v: 'c-o', t: '72' }, ' para obtener un cuadrado perfecto?'],
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'tres', texto: '3', error: 'AT-EXPONENTE', siFuera: '3 sería cierto si el exponente de 3 fuera impar. En 72 = 2³ · 3² el impar es el del 2.' },
        { id: 'cuatro', texto: '4', error: 'AT-EXPONENTE', siFuera: '4 = 2² deja el exponente de 2 en 5, todavía impar.' },
        { id: 'raiz', texto: '72', error: 'AT-EXPONENTE', siFuera: '72 · 72 sí es cuadrado, pero no es el mínimo.' },
      ],
      dibujo: { datos: { columnas: [{ t: 'primo' }, { t: 'exponente', color: 'o' }], filas: [['2', '?'], ['3', '?'], ['5', '?']], filasMax: 3, cabeza: true }, estado: {} },
      revelar: { datos: tablaExp([3, 2, 0], { par: true }), estado: {} },
      coincide: 'Coincide: 72 · 2 = 144 = 2⁴ · 3² = 12².',
    },
    mira: {
      datos: tablaExp([3, 2, 0], { par: true }),
      pasos: [
        { estado: { fila: 0 }, texto: '72 = 2³ · 3²: el exponente de 2 es impar.', ecuacion: ['72 = ', { sup: ['2', '3'] }, ' · ', { sup: ['3', '2'] }] },
        { estado: { fila: 1 }, texto: 'El de 3 ya es par: no hace falta tocarlo.', ecuacion: [{ sup: ['3', '2'] }, ' = ', { sup: ['3', '2'] }] },
        { estado: { fila: 0 }, texto: 'Un 2 más deja todos pares: 144 es 12 al cuadrado.', ecuacion: ['72 · 2 = ', { sup: ['2', '4'] }, ' · ', { sup: ['3', '2'] }, ' = ', { sup: ['12', '2'] }] },
      ],
    },
    regla: {
      texto: 'Un entero positivo es cuadrado perfecto si todos los exponentes de sus primos son pares, y cubo perfecto si todos son múltiplos de 3.',
      ecuacion: [N, ' = ', { sup: ['p', '2a'] }, ' · ', { sup: ['s', '2b'] }, ' = ', { sup: [{ par: [{ sup: ['p', 'a'] }, ' · ', { sup: ['s', 'b'] }] }, '2'] }],
      condicion: 'se mira la factorización en primos completa; un solo exponente impar basta para que no sea cuadrado.',
    },
    ahoraTu: {
      generar(s) {
        const rr = azar(s), cubo = s % 3 === 2;
        let es;
        do { es = [rr.ent(0, 5), rr.ent(0, 4), rr.ent(0, 2)]; } while (valor(es) < 6 || (cubo ? es.every(e => e % 3 === 0) : es.every(e => e % 2 === 0)));
        const k = cubo ? 3 : 2;
        const falta = PR.reduce((acc, p, i) => acc * p ** ((k - es[i] % k) % k), 1);
        const Nv = valor(es);
        return {
          pregunta: ['¿Por qué número mínimo hay que multiplicar ', { v: 'c-o', t: f(Nv, 0) }, ` para obtener un ${cubo ? 'cubo' : 'cuadrado'} perfecto?`],
          opciones: opciones(falta, [
            { id: 'primos', valor: PR.filter((p, i) => es[i] % k).reduce((a2, p) => a2 * p, 1), error: 'AT-EXPONENTE', siFuera: 'Eso agrega un factor por primo; a veces falta más de uno para llegar al múltiplo.' },
            { id: 'todo', valor: PR.filter((p, i) => es[i] > 0).reduce((a2, p) => a2 * p, 1), error: 'AT-EXPONENTE', siFuera: 'No hay que tocar los primos que ya tienen el exponente justo.' },
            { id: 'mismo', valor: Nv, error: 'AT-EXPONENTE', siFuera: `Multiplicar por ${f(Nv, 0)} funciona a veces, pero no es lo mínimo.` },
            { id: 'doble', valor: falta * 2, error: 'AT-EXPONENTE', siFuera: 'Ese factor de más vuelve a dejar un exponente que no sirve.' },
            { id: 'cuad', valor: falta * falta, error: 'AT-EXPONENTE', siFuera: 'Eso eleva lo que falta; sobran factores.' },
          ], n => f(n, 0)),
          solucion: { texto: `Factorizado: ${escribir(PR.map((p, i) => [p, es[i]]))}. Se completa cada exponente.`, ecuacion: [`${f(Nv, 0)} · ${falta} = ${f(Nv * falta, 0)} = ${escribir(PR.map((p, i) => [p, es[i] + (k - es[i] % k) % k]))}`], dibujo: { datos: tablaExp(es, cubo ? { cubo: true } : { par: true }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: un criterio de exclusión descarta, no confirma ----------
  // Cambia: n, y con él la última cifra de n². Permanece: la tabla de las diez últimas cifras.
  // Progresa: las cifras que aparecen → las que nunca aparecen (2, 3, 7, 8). Se reserva: 2 021, que pasa el filtro y no es cuadrado.
  // Debe verse: la columna de n² nunca tiene 2, 3, 7 ni 8.
  const tablaCifras = n => ({
    columnas: [{ t: 'n termina en', color: 'i' }, { t: 'n² termina en', color: 'o' }],
    filas: Array.from({ length: 10 }, (_, k) => [{ t: String(k), color: 'i' }, { t: String((k * k) % 10), color: 'o', resalta: n !== null && k === n % 10 }]),
    filasMax: 10,
  });
  const exclusion = {
    id: 'exclusion',
    titulo: 'Descartar no es confirmar',
    temas: ['Criterios de inclusión y exclusión'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige n. Mira en qué cifra termina n². Busca las cifras en que nunca termina un cuadrado.',
      voz: 'Revisa la columna de la derecha completa antes de concluir.',
      controles: [{ id: 'n', etiqueta: 'n', color: 'c-i', min: 1, max: 30, paso: 1, inicio: 13, unidad: '', decimales: 0 }],
      dibujo: v => ({ datos: tablaCifras(v.n), estado: { fila: v.n % 10 } }),
      lectura: v => [`${v.n}² = ${v.n * v.n}: termina en ${(v.n * v.n) % 10}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'El número 2 021 termina en 1, como 1, 81 o 121. ¿Es un cuadrado perfecto?',
      opciones: [
        { id: 'c', texto: 'No: queda entre 44² y 45²', correcta: true },
        { id: 'si', texto: 'Sí, porque termina en 1', error: 'AT-INCLUSION', siFuera: 'Terminar en 1 solo dice que no se descarta. Hay que comprobar con la raíz.' },
        { id: 'impar', texto: 'No, porque es impar', error: 'AT-IMPAR', siFuera: 'Hay cuadrados impares, como 81 o 121: ser impar no descarta.' },
      ],
      dibujo: { datos: tablaCifras(null), estado: { fila: 1 } },
      revelar: { datos: { columnas: [{ t: 'n' }, { t: 'n²', color: 'o' }], filas: [['44', '1 936'], [{ t: '?' }, { t: '2 021', color: 'h', resalta: true }], ['45', '2 025']], filasMax: 3 }, estado: {} },
      coincide: 'Coincide: 44² = 1 936 y 45² = 2 025; no hay entero entre 44 y 45.',
    },
    mira: {
      datos: tablaCifras(null),
      pasos: [
        { estado: {}, texto: 'La última cifra de n² solo depende de la última de n.', ecuacion: ['13² = 169;   23² = 529'] },
        { estado: { fila: [2, 3, 7, 8] }, texto: 'Ningún cuadrado termina en 2, 3, 7 u 8: esos se descartan.', ecuacion: ['termina en 2, 3, 7 u 8   ⇒   no es cuadrado'] },
        { estado: { fila: [1, 9] }, texto: 'Terminar en 1 no asegura nada: también 2 021 termina en 1.', ecuacion: [{ sup: ['44', '2'] }, ' = 1 936 < 2 021 < 2 025 = ', { sup: ['45', '2'] }] },
      ],
    },
    regla: {
      texto: 'Un criterio de exclusión solo descarta: si falla, no es cuadrado. Si se cumple, todavía hay que comprobar con la raíz o la factorización.',
      ecuacion: ['termina en 2, 3, 7 u 8   ⇒   ', N, ' no es cuadrado'],
      condicion: 'la condición es necesaria, no suficiente. Los cubos pueden terminar en cualquier cifra.',
    },
    ahoraTu: {
      generar(s) {
        const rr = azar(s), k = rr.ent(12, 60), tipo = s % 3;
        if (tipo === 0) {
          const Nv = k * k + rr.de([2, 6, 4 * k - 1]) ;
          const c = isqrt(Nv);
          const es = c * c === Nv, cifra = Nv % 10, descarta = [2, 3, 7, 8].includes(cifra);
          return {
            pregunta: ['¿Es ', { v: 'c-o', t: f(Nv, 0) }, ' un cuadrado perfecto?'],
            opciones: opciones(es ? 'Sí' : descarta ? `No: ningún cuadrado termina en ${cifra}` : `No: está entre ${c}² y ${c + 1}²`, [
              { id: 'si', valor: es ? 'No' : `Sí, porque termina en ${cifra}`, error: 'AT-INCLUSION', siFuera: 'Que la última cifra no descarte no confirma nada.' },
              { id: 'otro', valor: descarta ? `No: está entre ${c}² y ${c + 1}²` : `No: ningún cuadrado termina en ${cifra}`, error: 'AT-INCLUSION', siFuera: descarta ? 'Es cierto, pero la última cifra ya bastaba.' : `Hay cuadrados que terminan en ${cifra}.` },
            ], String),
            solucion: { texto: descarta ? `Termina en ${cifra}: se descarta.` : `Se comprueba con los cuadrados vecinos.`, ecuacion: [`${c}² = ${f(c * c, 0)};   ${c + 1}² = ${f((c + 1) ** 2, 0)}`] },
          };
        }
        const cifras = [2, 3, 7, 8, 0, 1, 4, 5, 6, 9], cf = rr.de(cifras);
        const nunca = [2, 3, 7, 8].includes(cf);
        return {
          pregunta: `Un número termina en ${cf}. ¿Qué se puede concluir sobre si es cuadrado perfecto?`,
          opciones: opciones(nunca ? 'Que no lo es' : 'Nada todavía: hay que comprobar', [
            { id: 'si', valor: 'Que sí lo es', error: 'AT-INCLUSION', siFuera: 'Ninguna última cifra asegura que sea cuadrado.' },
            { id: 'contrario', valor: nunca ? 'Nada todavía: hay que comprobar' : 'Que no lo es', error: 'AT-INCLUSION', siFuera: nunca ? `Ningún cuadrado termina en ${cf}: ya se descarta.` : `Hay cuadrados que terminan en ${cf}, como ${[...Array(10).keys()].map(x => x * x).find(x => x % 10 === cf) + (cf === 0 ? 100 : 0)}.` },
          ], String),
          solucion: { texto: 'Los cuadrados solo terminan en 0, 1, 4, 5, 6 o 9.', ecuacion: ['termina en 2, 3, 7 u 8   ⇒   no es cuadrado'], dibujo: { datos: tablaCifras(null), estado: { fila: [2, 3, 7, 8] } } },
        };
      },
    },
  };

  // ---------- Idea 3: la raíz entera es el cuadrado más grande que cabe ----------
  // Cambia: N fichas. Permanece: el tamaño de la ficha. Progresa: el cuadrado q × q, lo que sobra y lo que falta para (q + 1)².
  // Se reserva: el residuo nunca pasa de 2q. Debe verse: q² ≤ N < (q + 1)².
  const fichasRaiz = (Nv, mostrarFaltan = true) => {
    const qq = isqrt(Nv), rv = Nv - qq * qq, faltan = (qq + 1) ** 2 - Nv;
    return {
      altoMax: 150,
      bloques: [
        { n: qq * qq, columnas: qq, color: 'i', rotulo: `${qq}² = ${qq * qq}` },
        { n: rv, columnas: qq + 1, color: 'h', rotulo: `sobran ${rv}`, huecos: mostrarFaltan ? faltan : 0, huecosPaso: 1 },
      ],
    };
  };
  const raiz = {
    id: 'raiz-entera',
    titulo: 'El cuadrado más grande que cabe',
    temas: ['Raíz cuadrada y cúbica entera'],
    pieza: 'arit-fichas',
    juega: {
      consigna: 'Elige cuántas fichas hay. Se arma el cuadrado más grande posible; mira las que sobran y las que faltan para el siguiente.',
      voz: 'Fíjate cuántas faltan cuando el cuadrado está recién completo.',
      controles: [{ id: 'N', etiqueta: 'N', color: 'c-o', min: 2, max: 60, paso: 1, inicio: 30, unidad: 'fichas', decimales: 0 }],
      dibujo: v => ({ datos: fichasRaiz(v.N), estado: { paso: 1 } }),
      lectura: v => { const qq = isqrt(v.N); return [q, ` = ${qq}, `, r, ` = ${v.N - qq * qq}, faltan ${(qq + 1) ** 2 - v.N}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuál es la raíz cuadrada entera de ', { v: 'c-o', t: '80' }, ' y su residuo?'],
      opciones: [
        { id: 'c', texto: 'Raíz 8, residuo 16', correcta: true },
        { id: 'exceso', texto: 'Raíz 9, residuo 1', error: 'AT-RAIZ-EXCESO', siFuera: '9 es la raíz por exceso: 9² = 81 se pasa de 80 por 1.' },
        { id: 'decimal', texto: 'Raíz 8,94, residuo 0', error: 'AT-RAIZ-DECIMAL', siFuera: '8,94 es una aproximación; la raíz entera es un entero.' },
        { id: 'mitad', texto: 'Raíz 40, residuo 0', error: 'AT-RAIZ-MITAD', siFuera: '40 es la mitad de 80; la raíz es el número que multiplicado por sí mismo cabe.' },
      ],
      dibujo: { datos: { altoMax: 150, bloques: [{ n: 80, columnas: 10, color: 'o', rotulo: '80 fichas' }] }, estado: {} },
      revelar: { datos: fichasRaiz(80), estado: { paso: 1 } },
      coincide: 'Coincide: 8² = 64 cabe; 9² = 81 ya no.',
    },
    mira: {
      datos: fichasRaiz(80),
      pasos: [
        { estado: { paso: 0 }, texto: 'Con 80 fichas, el cuadrado más grande es de 8 por 8.', ecuacion: [{ sup: ['8', '2'] }, ' = 64 ≤ 80'] },
        { estado: { paso: 0 }, texto: 'Sobran 80 − 64 = 16 fichas: es el residuo.', ecuacion: [r, ' = 80 − 64 = 16'] },
        { estado: { paso: 1 }, texto: 'Para un cuadrado de 9 faltaría 1 ficha: 81 se pasa.', ecuacion: ['80 < 81 = ', { sup: ['9', '2'] }] },
      ],
    },
    regla: {
      texto: 'La raíz cuadrada entera de N es el mayor q con q² ≤ N; el residuo es N − q². La cúbica entera usa q³ ≤ N < (q + 1)³.',
      ecuacion: [{ sup: [q, '2'] }, ' ≤ ', N, ' < ', { sup: [q1, '2'] }, ';   ', r, ' = ', N, ' − ', { sup: [q, '2'] }, ' ≤ 2', q],
      condicion: 'N es entero no negativo. Si el residuo pasara de 2q, cabría un cuadrado más grande.',
    },
    ahoraTu: {
      generar(s) {
        const rr = azar(s), cub = s % 3 === 2;
        if (cub) {
          const k = rr.ent(3, 12), Nv = k ** 3 + rr.ent(1, 3 * k * k + 3 * k);
          const c = icbrt(Nv), rv = Nv - c ** 3;
          return {
            pregunta: ['¿Cuál es la raíz cúbica entera de ', { v: 'c-o', t: f(Nv, 0) }, ' y su residuo?'],
            opciones: opciones(`Raíz ${c}, residuo ${rv}`, [
              { id: 'exceso', valor: `Raíz ${c + 1}, residuo ${(c + 1) ** 3 - Nv}`, error: 'AT-RAIZ-EXCESO', siFuera: `${c + 1}³ = ${(c + 1) ** 3} se pasa de ${Nv}: esa es por exceso.` },
              { id: 'cuadrada', valor: `Raíz ${isqrt(Nv)}, residuo ${Nv - isqrt(Nv) ** 2}`, error: 'AT-INDICE', siFuera: 'Esa es la raíz cuadrada; se pide la cúbica.' },
              { id: 'falta', valor: `Raíz ${c}, residuo ${(c + 1) ** 3 - Nv}`, error: 'AT-FALTA', siFuera: `Eso es lo que falta para ${(c + 1) ** 3}; el residuo es lo que sobra sobre ${c ** 3}.` },
            ], String),
            solucion: { texto: `${c}³ cabe y ${c + 1}³ ya no.`, ecuacion: [`${c}³ = ${f(c ** 3, 0)} ≤ ${f(Nv, 0)} < ${f((c + 1) ** 3, 0)} = ${c + 1}³;   r = ${rv}`] },
          };
        }
        const k = rr.ent(6, 40), Nv = k * k + rr.ent(1, 2 * k);
        const c = isqrt(Nv), rv = Nv - c * c;
        return {
          pregunta: ['¿Cuál es la raíz cuadrada entera de ', { v: 'c-o', t: f(Nv, 0) }, ' y su residuo?'],
          dibujo: Nv <= 120 ? { datos: { altoMax: 150, bloques: [{ n: Nv, columnas: c + 1, color: 'o', rotulo: `${Nv} fichas` }] }, estado: {} } : undefined,
          opciones: opciones(`Raíz ${c}, residuo ${rv}`, [
            { id: 'exceso', valor: `Raíz ${c + 1}, residuo ${(c + 1) ** 2 - Nv}`, error: 'AT-RAIZ-EXCESO', siFuera: `${c + 1}² = ${(c + 1) ** 2} se pasa: esa es la raíz por exceso.` },
            { id: 'menos', valor: `Raíz ${c - 1}, residuo ${Nv - (c - 1) ** 2}`, error: 'AT-RESIDUO', siFuera: `Con ese residuo cabe un cuadrado más grande: el residuo pasa de ${2 * (c - 1)}.` },
            { id: 'falta', valor: `Raíz ${c}, residuo ${(c + 1) ** 2 - Nv}`, error: 'AT-FALTA', siFuera: `Eso es lo que falta para ${(c + 1) ** 2}; el residuo es lo que sobra sobre ${c * c}.` },
          ], String),
          solucion: { texto: `${c}² cabe y ${c + 1}² ya no.`, ecuacion: [`${c}² = ${c * c} ≤ ${Nv} < ${(c + 1) ** 2} = ${c + 1}²;   r = ${rv}`], dibujo: Nv <= 120 ? { datos: fichasRaiz(Nv), estado: { paso: 1 } } : undefined },
        };
      },
    },
  };

  // ---------- Idea 4: aproximar es encerrar entre dos valores ----------
  // Cambia: el candidato x. Permanece: el 2 en la recta de los cuadrados. Progresa: décimas → centésimas, el intervalo se achica.
  // Se reserva: la comprobación elevando al cuadrado. Debe verse: x² a un lado del 2 y (x + paso)² al otro.
  const rectaAprox = (x, h, Nv, desde = 0) => ({
    min: Math.floor(x * x * 10) / 10 - 0.2, max: Math.ceil((x + h) * (x + h) * 10) / 10 + 0.2, paso: 0.1, cada: 2, decimales: 2, variable: 'cuadrados', filas: 2,
    elementos: [
      { tipo: 'punto', x: Nv, color: 'o', fila: 1, rotulo: `N = ${f(Nv)}` },
      { tipo: 'intervalo', a: x * x, b: (x + h) * (x + h), ca: true, cb: false, color: 'i', fila: 2, rotulo: `${f(x)}² a ${f(x + h)}²`, desde },
    ],
  });
  const aprox = {
    id: 'aproximadas',
    titulo: 'Encerrar la raíz por pasos',
    temas: ['Raíces aproximadas'],
    pieza: 'recta',
    juega: {
      consigna: 'Busca √2 probando décimas: se dibuja el tramo entre x² y el cuadrado de la décima siguiente. Encierra el 2.',
      voz: 'Comprueba elevando al cuadrado, no a ojo.',
      controles: [{ id: 'x', etiqueta: 'x', color: 'c-i', min: 1, max: 1.9, paso: 0.1, inicio: 1.2, unidad: '', decimales: 1 }],
      dibujo: v => ({ datos: Object.assign(rectaAprox(v.x, 0.1, 2), { min: 0.8, max: 4.2, paso: 0.2, cada: 5 }), estado: {} }),
      lectura: v => [`${f(v.x)}² = ${f(v.x * v.x)};  ${f(v.x + 0.1)}² = ${f((v.x + 0.1) ** 2)}`],
      minimo: 3,
    },
    predice: {
      pregunta: '√2 está entre 1,4 y 1,5, porque 1,96 < 2 < 2,25. ¿Entre qué centésimas está?',
      opciones: [
        { id: 'c', texto: 'Entre 1,41 y 1,42', correcta: true },
        { id: 'medio', texto: 'Entre 1,45 y 1,46', error: 'AT-MEDIO', siFuera: 'Sería cierto si 2 quedara en el medio de 1,96 y 2,25. Está muy cerca de 1,96.' },
        { id: 'abajo', texto: 'Entre 1,40 y 1,41', error: 'AT-COMPROBAR', siFuera: '1,41² = 1,9881 todavía es menor que 2: la raíz está después de 1,41.' },
        { id: 'arriba', texto: 'Entre 1,42 y 1,43', error: 'AT-COMPROBAR', siFuera: '1,42² = 2,0164 ya se pasa de 2.' },
      ],
      dibujo: { datos: rectaAprox(1.4, 0.1, 2, 9), estado: {} },
      revelar: { datos: rectaAprox(1.41, 0.01, 2), estado: {} },
      coincide: 'Coincide: 1,41² = 1,9881 < 2 < 2,0164 = 1,42².',
    },
    mira: {
      datos: {
        min: 1.9, max: 2.3, paso: 0.05, cada: 2, decimales: 2, variable: 'cuadrados', filas: 3,
        elementos: [
          { tipo: 'punto', x: 2, color: 'o', fila: 3, rotulo: 'N = 2' },
          { tipo: 'intervalo', a: 1.4 ** 2, b: 1.5 ** 2, ca: true, cb: false, color: 'i', fila: 1, rotulo: '1,4² a 1,5²', desde: 1 },
          { tipo: 'intervalo', a: 1.41 ** 2, b: 1.42 ** 2, ca: true, cb: false, color: 'd', fila: 2, rotulo: '1,41² a 1,42²', desde: 2 },
        ],
      },
      pasos: [
        { estado: { corte: 0 }, texto: 'Se busca √2: un número que al cuadrado dé 2.', ecuacion: [{ raiz: '2' }, ' = ?'] },
        { estado: { corte: 1 }, texto: 'Por décimas: 1,4² = 1,96 y 1,5² = 2,25 lo encierran.', ecuacion: ['1,96 < 2 < 2,25'] },
        { estado: { corte: 2 }, texto: 'Por centésimas: 1,41² = 1,9881 y 1,42² = 2,0164.', ecuacion: ['1,41 < ', { raiz: '2' }, ' < 1,42'] },
      ],
    },
    regla: {
      texto: 'Aproximar √N es encerrarla: se busca a con a² ≤ N < (a + h)², con h = 0,1, 0,01… Cada paso se comprueba elevando al cuadrado.',
      ecuacion: [{ sup: ['a', '2'] }, ' ≤ ', N, ' < ', { sup: [{ par: ['a + h'] }, '2'] }, '   ⇒   a ≤ ', { raiz: N }, ' < a + h'],
      condicion: '√N es la raíz no negativa. La raíz no se reparte en una suma: √(9 + 16) = 5, no 7.',
    },
    ahoraTu: {
      generar(s) {
        const rr = azar(s);
        if (s % 3 === 2) {
          const [a2, b2] = rr.de([[9, 16], [36, 64], [25, 144], [64, 225], [81, 144]]);
          const c = Math.sqrt(a2 + b2);
          return {
            pregunta: `¿Cuánto vale √(${a2} + ${b2})?`,
            opciones: opciones(c, [
              { id: 'reparte', valor: Math.sqrt(a2) + Math.sqrt(b2), error: 'AT-REPARTIR', siFuera: 'La raíz no se reparte en una suma: primero se suma.' },
              { id: 'mitad', valor: (a2 + b2) / 2, error: 'AT-RAIZ-MITAD', siFuera: 'La mitad no es la raíz.' },
              { id: 'suma', valor: a2 + b2, error: 'AT-REPARTIR', siFuera: 'Falta sacar la raíz de la suma.' },
            ], n => f(n)),
            solucion: { texto: 'Primero se suma, después la raíz.', ecuacion: [`√(${a2} + ${b2}) = √${a2 + b2} = ${f(c)}`] },
          };
        }
        let Nv;
        do { Nv = rr.ent(2, 99); } while (isqrt(Nv) ** 2 === Nv);
        const a = isqrt(Nv), x = Math.sqrt(Nv);
        const d = Math.floor(x * 10 + 1e-9) / 10;
        const porDecima = s % 3 === 1;
        const lo = porDecima ? d : a, h = porDecima ? 0.1 : 1;
        const t = n => `Entre ${f(n)} y ${f(n + h)}`;
        return {
          pregunta: ['¿Entre qué ', porDecima ? 'décimas' : 'enteros consecutivos', ' está ', { raiz: { v: 'c-o', t: String(Nv) } }, '?'],
          opciones: opciones(lo, [
            { id: 'mitad', valor: porDecima ? Math.floor(Nv / 2 * 10) / 10 : Math.floor(Nv / 2), error: 'AT-RAIZ-MITAD', siFuera: 'La mitad no es la raíz: compruébalo elevando al cuadrado.' },
            { id: 'arriba', valor: lo + h, error: 'AT-COMPROBAR', siFuera: `${f(lo + h)}² = ${f((lo + h) ** 2)} ya pasa de ${Nv}.` },
            { id: 'abajo', valor: lo - h, error: 'AT-COMPROBAR', siFuera: `${f(lo)}² = ${f(lo * lo)} todavía es menor que ${Nv}: la raíz está más allá.` },
          ].map(o => Object.assign(o, { valor: o.valor > 0 ? o.valor : NaN })), n => t(n)),
          solucion: { texto: 'Se eleva al cuadrado cada extremo.', ecuacion: [`${f(lo)}² = ${f(lo * lo)} ≤ ${Nv} < ${f((lo + h) ** 2)} = ${f(lo + h)}²`] },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.potenciacion-y-radicacion',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/recta.js'],
    historia: {
      texto: 'La tablilla babilónica YBC 7289 muestra un cuadrado con su diagonal y una aproximación de la raíz de dos en base 60, muy precisa. Sabemos qué valor se escribió, pero no cómo se obtuvo: un número no revela el método. Esta unidad une potencias y raíces como operaciones inversas, y separa los valores exactos de las aproximaciones.',
      pregunta: '¿Cómo comprobarías una raíz sin calculadora?',
      fuente: { titulo: 'MCT 042 YBC 07289, P255048 — Cuneiform Digital Library Initiative', url: 'https://cdli.earth/artifacts/255048' },
    },
    ideas: [perfectos, exclusion, raiz, aprox],
  };
});
