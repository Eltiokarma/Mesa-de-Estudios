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
 * Estados · juego sin tocar · arrastrando una manija · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué √(x + 6) = x da solo x = 3 aunque al cuadrar aparezca también −2.
 *
 * Ronda 2 (14 nov 2026): gesto directo en las cuatro ideas (el centro a y el punto a + r, la recta y = x + c por su
 * corte con el eje y, el valor de prueba sobre y = x y el nivel y = k), llaves en las reglas y laboratorio con tres
 * mesas: centro, distancia y las cinco relaciones; la V contra una recta con pendiente e intercepto; y la raíz bajo
 * un nivel. Hallazgo 9: el juego y «Mira» usan la misma pieza en las cuatro ideas.
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
  // Gesto directo (docs/teoria.md §4b): la manija vive en coordenadas de la figura; la pieza da la escala y su inversa.
  const RECTA = () => Kit.piezas.recta, EJES = () => Kit.piezas.ejes;
  const enRecta = (datos, valor, fila) => { const g = RECTA().geometria(datos); return { x: g.x(valor), y: g.filaY(fila) }; };
  const deRecta = (datos, px) => RECTA().geometria(datos).v(px);
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));
  const enPlano = (datos, u, w) => { const g = EJES().geometria(datos); return { x: g.X(u), y: g.Y(w) }; };
  const deX = (datos, px) => inversa(EJES().geometria(datos).X, datos.x.min, datos.x.max)(px);
  const deY = (datos, py) => inversa(EJES().geometria(datos).Y, datos.y.min, datos.y.max)(py);
  const rectaBase = (min, max, filas, elementos, alt) => ({ min, max, paso: 1, decimales: 0, variable: 'x', color: 'o', filas, elementos, alt });
  // Para «Así se resuelve»: « + 3», « − 2» o nada; una curva muestreada que se corta (null) fuera del plano; y un plano
  // que se ajusta al caso, con un paso de rejilla que deja leer los números en 360 px.
  const mas = n => (n ? ` ${n > 0 ? '+' : '−'} ${f(Math.abs(n))}` : '');
  const muestra = (fn, x0, x1, y0, y1, n = 60) => Array.from({ length: n + 1 }, (_, i) => { const u = x0 + (x1 - x0) * i / n, w = fn(u); return Number.isFinite(w) && w >= y0 - 1e-9 && w <= y1 + 1e-9 ? [u, w] : null; });
  const pasoDe = largo => (largo <= 10 ? 1 : largo <= 20 ? 2 : 5);
  const plano = (x0, x1, y0, y1) => ({ x: { min: x0, max: x1, paso: pasoDe(x1 - x0), cada: 2, nombre: 'x', decimales: 0, color: 'o' },
    y: { min: y0, max: y1, paso: pasoDe(y1 - y0), cada: 2, nombre: 'y', decimales: 0 } });
  const CUMPLE = { '<': (u, v) => u < v, '≤': (u, v) => u <= v, '>': (u, v) => u > v, '≥': (u, v) => u >= v, '=': (u, v) => u === v };

  // ---------- Idea 1: valor absoluto es distancia ----------
  // Cambia: el centro a y el radio r (se arrastran el centro y el punto a + r) · Permanece: la recta · Progresa: los dos puntos a distancia r
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
  const rectaDist = val => rectaBase(-8, 8, 3, [
    { tipo: 'punto', x: val.a, color: 'o', rotulo: 'a', fila: 0 },
    ...(val.r ? [{ tipo: 'distancia', a: val.a - val.r, b: val.a, color: 'i', rotulo: 'r', fila: 1 }, { tipo: 'distancia', a: val.a, b: val.a + val.r, color: 'i', rotulo: 'r', fila: 1 }] : []),
    { tipo: 'punto', x: val.a - val.r, color: 'd', fila: 2 }, { tipo: 'punto', x: val.a + val.r, color: 'd', fila: 2 },
  ], `Centro ${val.a}; a distancia ${val.r} están ${conjuntoAbs(val.a, val.r, '=')}`);
  const distancia = {
    id: 'distancia',
    titulo: 'Valor absoluto es distancia',
    temas: ['Valor absoluto y distancia', 'Ecuaciones e inecuaciones con valor absoluto'],
    pieza: 'recta',
    // Lee (fase 2): la distancia no tiene signo y |x − a| se lee como distancia al centro; no dice qué tramo da «≤».
    lee: {
      tarjetas: [
        { titulo: 'Distancia sin signo', texto: 'De Juliaca a Puno hay unos 45 km por carretera, y de Puno a Juliaca, los mismos 45 km. Una distancia no tiene signo: nunca es negativa, vayas hacia donde vayas.' },
        { titulo: 'Las barras', texto: ['|−5| = 5 y |5| = 5: las barras dan la distancia de un número al cero. Del mismo modo, ', { abs: [x, ' − ', a] }, ' es la distancia entre ', x, ' y el número ', a, ', al que llamamos centro.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Mueve el centro ', a, ' y la distancia ', r, '. Cuenta cuántos puntos verdes aparecen y dónde quedan respecto al centro. Prueba también ', r, ' = 0.'] },
      ],
    },
    juega: {
      consigna: '|x − a| = r pide los x que están a distancia r del centro a. Mueve el centro y la distancia.',
      voz: 'Prueba también r = 0.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 0, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => ({ datos: rectaDist(val), estado: {} }),
      lectura: val => [...absX(val.a), ` = ${f(val.r)} → `, x, ` ∈ ${conjuntoAbs(val.a, val.r, '=')}`],
      minimo: 3,
      // Arrastra el centro (a) o el punto de la derecha (a + r): la distancia r es lo que lo separa del centro.
      arrastres: [
        { id: 'centro', etiqueta: 'centro a', color: 'c-o', donde: val => enRecta(rectaDist(val), val.a, 0), mover: (pt, val) => ({ a: deRecta(rectaDist(val), pt.x) }) },
        { id: 'radio', etiqueta: 'punto a + r: cambia la distancia r', color: 'c-i', donde: val => enRecta(rectaDist(val), val.a + val.r, 2), mover: (pt, val) => ({ r: deRecta(rectaDist(val), pt.x) - val.a }) },
      ],
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
        { estado: { corte: 2 }, texto: 'A distancia 3 del centro hay dos puntos.', ecuacion: ['1 − 3 = −2', '   ·   ', '1 + 3 = 4'] },
        { estado: { corte: 3 }, texto: 'A distancia 3 o menos: todo el tramo entre ellos.', ecuacion: [...absX(1), ' ≤ 3  ⇔  −2 ≤ ', x, ' ≤ 4'] },
        { estado: { corte: 4 }, texto: 'A distancia 3 o más: lo de afuera, en dos tramos.', ecuacion: [...absX(1), ' ≥ 3  ⇔  ', x, ' ≤ −2 o ', x, ' ≥ 4'] },
      ],
    },
    regla: {
      texto: '|x − a| es la distancia de x a a. «= r» da a − r y a + r; «≤ r», el tramo entre ellos; «≥ r», lo de afuera.',
      ecuacion: [{ llave: [{ abs: [x, ' − ', a] }], nota: 'distancia al centro', color: 'c-i' }, ' ≤ ', r, '   ·   ', '⇔  ', a, ' − ', r, ' ≤ ', x, ' ≤ ', a, ' + ', r],
      condicion: 'r ≥ 0. Si r < 0, «= r» y «≤ r» no tienen solución, y «≥ r» vale para todo x.',
    },
    // Así se resuelve (fase 2): |x − c| rel r, como «Ahora tú», con otras semillas; el conjunto lo da conjuntoAbs().
    resuelve: {
      pieza: 'recta',
      generar(s) {
        const rr = azar(s + 900);
        const c = rr.ent(-4, 4), rad = s % 7 === 6 ? -rr.ent(1, 3) : rr.ent(1, 5), rel = ['≤', '≥', '=', '<', '>'][s % 5];
        const bien = conjuntoAbs(c, rad, rel), lo = c - rad, hi = c + rad, menor = rel === '≤' || rel === '<', bordes = rel === '≤' || rel === '≥';
        const ancho = Math.max(rad, 1) + 3, R0 = c - ancho, R1 = c + ancho;
        // Valor de prueba: un borde con «=», el centro con «<» o «≤», uno de afuera con «>» o «≥»; con r < 0, el centro.
        const t = rad < 0 ? c : rel === '=' ? hi : menor ? c : hi + 1, d = Math.abs(t - c), ok = CUMPLE[rel](d, rad);
        const solEls = rad < 0 ? (ok ? [{ tipo: 'intervalo', a: null, b: null, color: 'd', fila: 2, rotulo: 'todos cumplen' }] : [])
          : rel === '=' ? [{ tipo: 'punto', x: lo, color: 'd', fila: 2 }, { tipo: 'punto', x: hi, color: 'd', fila: 2 }]
            : menor ? [{ tipo: 'intervalo', a: lo, b: hi, ca: bordes, cb: bordes, color: 'd', fila: 2, rotulo: 'cumplen' }]
              : [{ tipo: 'intervalo', a: null, b: lo, cb: bordes, color: 'd', fila: 2, rotulo: 'cumplen' }, { tipo: 'intervalo', a: hi, b: null, ca: bordes, color: 'd', fila: 2 }];
        const centro = { tipo: 'punto', x: c, color: 'o', rotulo: 'centro', fila: 0 };
        const tramos = rad > 0 ? [{ tipo: 'distancia', a: lo, b: c, color: 'i', rotulo: f(rad), fila: 1 }, { tipo: 'distancia', a: c, b: hi, color: 'i', rotulo: f(rad), fila: 1 }] : [];
        const recta = (els, alt) => ({ datos: rectaBase(R0, R1, 3, els, alt), estado: {} });
        const absT = { abs: [c === 0 ? f(t) : `${f(t)} ${c > 0 ? '−' : '+'} ${f(Math.abs(c))}`] };
        const pide = rel === '=' ? 'exactamente a' : rel === '<' ? 'a menos de' : rel === '≤' ? 'a lo más a' : rel === '>' ? 'a más de' : 'por lo menos a';
        return {
          enunciado: ['Resuelve ', ...absX(c), ` ${rel} ${f(rad)}.`],
          dibujo: recta([centro], `Recta con el centro ${f(c)} marcado`),
          pasos: [
            { tipo: 'pide', texto: rad < 0 ? ['Piden todos los ', x, ' que cumplen la desigualdad, escritos como conjunto.'] : ['Piden todos los ', x, ` que están ${pide} ${f(rad)} del centro, escritos como conjunto.`] },
            { tipo: 'datos', texto: rad < 0 ? `El centro es ${f(c)}, y el lado derecho es ${f(rad)}: un número negativo.`
              : `El centro es ${f(c)} y la distancia es ${f(rad)}.${c < 0 ? ` Ojo: «+ ${f(-c)}» quiere decir «− (${f(c)})».` : ''}`,
              ecuacion: [...absX(c), ' = distancia de ', x, ` a ${f(c)}`] },
            { tipo: 'regla', texto: 'Las barras miden cuánto se aleja x del centro, sin importar el lado. «=» da dos puntos; «menor», el tramo entre ellos; «mayor», lo de afuera.' },
            rad < 0
              ? { tipo: 'cuentas', texto: `Una distancia vale 0 o más. Así que nunca es ${menor || rel === '=' ? `${rel === '=' ? 'igual a' : 'menor que'} ${f(rad)}: no hay solución` : `menor que ${f(rad)}: todos los x cumplen`}.`,
                ecuacion: [...absX(c), ` ≥ 0 > ${f(rad)}`], dibujo: recta([centro, ...solEls], `Centro ${f(c)}; con r negativo, ${bien}`) }
              : { tipo: 'cuentas', texto: `A distancia ${f(rad)} del centro hay dos puntos. ${rel === '=' ? 'Son la respuesta.' : `Pide ${menor ? 'el tramo entre ellos' : 'lo de afuera'}, ${bordes ? 'con' : 'sin'} los bordes.`}`,
                ecuacion: [`${f(c)} − ${f(rad)} = ${f(lo)}   y   ${f(c)} + ${f(rad)} = ${f(hi)}`], dibujo: recta([centro, ...tramos, ...solEls], `Centro ${f(c)} y distancia ${f(rad)}: ${bien}`) },
            { tipo: 'sentido', texto: ['Compruebo con ', x, ` = ${f(t)}: está a ${f(d)} del centro, y «${f(d)} ${rel} ${f(rad)}» es ${ok ? 'cierto' : 'falso'}. ${ok ? `${rad < 0 ? 'Cualquier x cumple' : 'Está en la respuesta'}, como debe.` : 'Ni el centro cumple: no hay solución.'}`],
              ecuacion: [absT, ` = ${f(d)}`] },
          ],
          respuesta: ['S = ', bien],
        };
      },
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
  // Cambia: la recta y = x + c (se arrastra por su corte con el eje y) · Permanece: la V de y = |2x − 1| · Progresa: los candidatos de cada caso
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
    // Lee (fase 2): por qué hay dos casos y cómo se lee la V; no dice qué hacer con un candidato (eso es «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Dos posibilidades', texto: '|A| = 5 dice que A está a distancia 5 del cero. Eso pasa con A = 5 y con A = −5. Por eso una ecuación con valor absoluto se parte en dos casos.' },
        { titulo: 'La V', texto: 'La gráfica de y = |2x − 1| tiene forma de V: sus dos brazos rectos se juntan en el punto (1/2; 0), sobre el eje x.' },
        { titulo: 'Qué mirar al jugar', texto: 'La recta y = x + c sube y baja cuando cambias c. Cada corte con la V resuelve |2x − 1| = x + c. Cuenta los cortes para distintos valores de c.' },
      ],
    },
    juega: {
      consigna: 'La V es y = |2x − 1|; la recta, y = x + c. Cada corte es una solución de |2x − 1| = x + c. Mueve c.',
      voz: 'Busca un c con dos cortes y otro sin ninguno.',
      controles: [{ id: 'c', etiqueta: 'c', color: 'c-o', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: ejesV(val.c), estado: {} }),
      lectura: val => [`${lineaTxt(1, val.c)}: corta a la V en ${cortes(val.c).filter(k => k.ok).length} puntos`],
      minimo: 3,
      // Arrastra la recta hacia arriba o abajo por su punto en x = 0 (allí y = c).
      arrastres: [{ id: 'recta-c', etiqueta: 'corte de la recta con el eje y', color: 'c-o',
        donde: val => enPlano(ejesV(val.c), 0, val.c), mover: (pt, val) => ({ c: deY(ejesV(val.c), pt.y) }) }],
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
      ecuacion: [{ abs: ['A'] }, ' = B  ⇔  ', { llave: ['B ≥ 0'], nota: 'se comprueba', color: 'c-d' }, '   ·   ', 'A = B  o  A = −B'],
      condicion: 'si B depende de x, los casos dan candidatos, no soluciones: solo quedan los que hacen B ≥ 0.',
      voz: 'Yo había comprimido ese paso. Abrámoslo: B no puede ser negativo.',
    },
    // Así se resuelve: |p x + q| = m x + c, el mismo tipo y las mismas cuentas de «Ahora tú», con otras semillas; la
    // figura muestra la V y la recta, con cada candidato sobre la recta.
    resuelve: {
      pieza: 'ejes',
      generar(s) {
        const rr = azar(s + 900);
        for (let k = 0; k < 100; k++) {
          const quiere = s % 3; // 0: uno es extraño · 1: los dos sirven · 2: ninguno sirve
          const p = quiere === 0 ? 1 : rr.uno([2, 3]), m = quiere === 0 ? 2 : 1, q = rr.ent(-5, 5), c = rr.ent(-6, 4);
          const z1 = Q(c - q, p - m), z2 = Q(-c - q, p + m);
          const ok = z => m * val(z) + c >= -1e-12 && Math.abs(Math.abs(p * val(z) + q) - (m * val(z) + c)) < 1e-9;
          const cand = [z1, z2], sol = cand.filter(ok);
          if ((quiere === 0 && sol.length !== 1) || (quiere === 1 && sol.length !== 2) || (quiere === 2 && sol.length !== 0)) continue;
          if (fr(z1) === fr(z2)) continue;
          const A = [p === 1 ? '' : f(p), x, mas(q)], B = [m === 1 ? '' : f(m), x, mas(c)];
          const At = `${p === 1 ? '' : f(p)}x${mas(q)}`, Bt = `${m === 1 ? '' : f(m)}x${mas(c)}`;
          const lado = z => fr(Q(m * z.p + c * z.q, z.q));
          // Plano que encierra los dos candidatos y el vértice de la V.
          const xs = [val(z1), val(z2), -q / p], ys = cand.map(z => m * val(z) + c);
          let x0 = Math.floor(Math.min(...xs)) - 2, x1 = Math.ceil(Math.max(...xs)) + 2;
          if (x1 - x0 < 8) { const e = Math.ceil((8 - (x1 - x0)) / 2); x0 -= e; x1 += e; }
          const y0 = Math.min(-2, Math.floor(Math.min(...ys)) - 2), y1 = Math.max(4, Math.ceil(Math.max(...ys.map(Math.abs))) + 2);
          const vpts = muestra(u => Math.abs(p * u + q), x0, x1, y0, y1), lpts = muestra(u => m * u + c, x0, x1, y0, y1);
          const pv = vpts.find(Boolean), pl = lpts.slice().reverse().find(Boolean);
          const figura = marcas => ({ datos: Object.assign(plano(x0, x1, y0, y1), {
            curvas: [{ puntos: vpts, color: 'i', rotulo: `y = |${At}|`, en: [pv[0] + 0.2, pv[1]] }, { puntos: lpts, color: 'o', rotulo: `y = ${Bt}`, en: [pl[0] - 0.2, pl[1]] }],
            puntos: marcas === 'candidatos' ? cand.map(z => ({ x: val(z), y: m * val(z) + c, color: 'o', rotulo: fr(z) }))
              : marcas === 'prueba' ? cand.map(z => ({ x: val(z), y: m * val(z) + c, color: ok(z) ? 'd' : 'h', abierto: !ok(z), rotulo: `${fr(z)} ${ok(z) ? '✓' : '✗'}` })) : [],
            alt: `La V y = |${At}| y la recta y = ${Bt}${marcas ? `; candidatos ${fr(z1)} y ${fr(z2)}, ${sol.length === 2 ? 'los dos sirven' : sol.length ? `solo sirve ${fr(sol[0])}` : 'ninguno sirve'}` : ''}`,
          }), estado: {} });
          const cierre = sol.length === 2 ? 'Los dos sirven.' : sol.length ? `Solo sirve ${fr(sol[0])}: el otro da negativo.` : 'Ninguno sirve: los dos dan negativo.';
          return {
            enunciado: ['Resuelve ', { abs: A }, ' = ', ...B, '.'],
            dibujo: figura(null),
            pasos: [
              { tipo: 'pide', texto: ['Piden los ', x, ' que cumplen la igualdad. Cada caso dará un candidato, y cada candidato se prueba.'] },
              { tipo: 'datos', texto: ['Dentro de las barras está ', ...A, '. El lado derecho, ', ...B, ', depende de ', x, ': puede salir negativo.'] },
              { tipo: 'regla', texto: 'Lo de adentro es igual al lado derecho o a su opuesto. Resuelvo los dos casos y me quedo con los candidatos que hacen el lado derecho 0 o más.' },
              { tipo: 'cuentas', texto: 'Resuelvo cada caso como una ecuación lineal.',
                ecuacion: [...A, ' = ', ...B, '  ⇒  ', x, ` = ${fr(z1)}`, '   y   ', ...A, ' = −(', ...B, ')  ⇒  ', x, ` = ${fr(z2)}`], dibujo: figura('candidatos') },
              { tipo: 'sentido', texto: ['Pruebo el lado derecho: con ', x, ` = ${fr(z1)} vale ${lado(z1)}, y con `, x, ` = ${fr(z2)}, ${lado(z2)}. ${cierre}`], dibujo: figura('prueba') },
            ],
            respuesta: ['S = ', llaves(sol)],
          };
        }
        throw new Error('sin caso');
      },
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
  // Cambia: el valor de prueba x (se arrastra sobre y = x) · Permanece: las curvas y = √(x + 2) e y = x · Progresa: la comparación de los dos
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
  const curvasPrueba = val => raizCurvas(2, { puntos: [{ x: val.x, y: Math.sqrt(val.x + 2), color: 'i', guias: true }, { x: val.x, y: val.x, color: 'o' }], alt: `En x = ${val.x}: √(x + 2) = ${f(Math.sqrt(val.x + 2))} e x = ${val.x}` });
  const rext = {
    id: 'radical-ecuacion',
    titulo: 'Cuadrar trae candidatos de más',
    temas: ['Ecuaciones con radicales'],
    pieza: 'ejes',
    // Lee (fase 2): qué es una ecuación irracional y qué es una solución; no dice qué pasa al elevar al cuadrado.
    lee: {
      tarjetas: [
        { titulo: 'Una raíz en la ecuación', texto: 'En √(x + 2) = x la letra está dentro de una raíz cuadrada: es una ecuación irracional. Para quitar la raíz, lo usual es elevar al cuadrado los dos lados.' },
        { titulo: 'Qué es una solución', texto: 'Un número es solución si, al reemplazarlo, el lado izquierdo y el derecho dan lo mismo. Al elevar al cuadrado, los dos lados cambian a la vez.' },
        { titulo: 'Qué mirar al jugar', texto: 'El punto turquesa marca cuánto vale √(x + 2), y el naranja, cuánto vale x. Para cada x, compara los dos lados y después sus cuadrados.' },
      ],
    },
    juega: {
      consigna: 'Para √(x + 2) = x, prueba valores de x. Compara los dos lados y luego sus cuadrados.',
      voz: 'Busca un x con cuadrados iguales y lados distintos.',
      controles: [{ id: 'x', etiqueta: 'x', color: 'c-o', min: -2, max: 3, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: val => ({ datos: curvasPrueba(val), estado: {} }),
      lectura: val => { const L = Math.sqrt(val.x + 2); return [{ raiz: [x, ' + 2'] }, ` = ${f(L)} · `, x, ` = ${f(val.x)} · al cuadrado: ${f(L * L)} y ${f(val.x * val.x)}`]; },
      minimo: 4,
      // Arrastra el punto de la recta y = x: el de la curva lo sigue en la misma vertical.
      arrastres: [{ id: 'prueba-x', etiqueta: 'valor de prueba x', color: 'c-o',
        donde: val => enPlano(curvasPrueba(val), val.x, val.x), mover: (pt, val) => ({ x: deX(curvasPrueba(val), pt.x) }) }],
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
        { estado: { corte: 1 }, texto: 'Dominio: x + 6 ≥ 0. Y como √ no es negativa, x ≥ 0.', ecuacion: [x, ' ≥ −6', '   ·   ', x, ' ≥ 0'] },
        { estado: { corte: 2 }, texto: 'Elevamos al cuadrado y ordenamos.', ecuacion: [x, ' + 6 = ', { sup: [x, '2'] }, '  ⇒  (', x, ' − 3)(', x, ' + 2) = 0'] },
        { estado: { corte: 3 }, texto: 'El cuadrado no ve el signo: también resuelve −√(x + 6) = x.', ecuacion: ['−', { raiz: ['−2 + 6'] }, ' = −2'] },
        { estado: { corte: 4 }, texto: 'Se comprueba en la original: solo x = 3.', ecuacion: [{ raiz: ['3 + 6'] }, ' = 3', '   ·   ', 'S = {3}'] },
      ],
    },
    regla: {
      texto: 'En una ecuación irracional, elevar al cuadrado no es reversible: junta √u = v con −√u = v. Cada candidato se comprueba en la ecuación original.',
      ecuacion: [{ raiz: ['u'] }, ' = v  ⇔  u = ', { sup: ['v', '2'] }, '   ·   ', 'y  ', { llave: ['v ≥ 0'], nota: 'descarta extraños', color: 'c-h' }],
      condicion: 'u ≥ 0 y v ≥ 0 en la original. Además √(x²) = |x|, no x.',
    },
    // Así se resuelve: √(x + K) = x + m, el mismo tipo y las mismas cuentas de «Ahora tú», con otras semillas. La figura
    // muestra la curva, la recta y, al comprobar, la rama −√(x + K) donde cae el candidato extraño.
    resuelve: {
      pieza: 'ejes',
      generar(s) {
        const rr = azar(s + 900);
        for (let k = 0; k < 200; k++) {
          const m = rr.ent(-3, 3), r1 = rr.ent(-5, 6), r2 = 1 - 2 * m - r1, K = m * m - r1 * r2;
          if (r1 === r2 || K < -6 || K > 12) continue;
          const ok = z => z + K >= 0 && z + m >= 0 && Math.abs(Math.sqrt(z + K) - (z + m)) < 1e-9;
          const cand = [r1, r2].sort((u, v) => u - v), sol = cand.filter(ok);
          const quiere = s % 3; // 0 y 2: uno es extraño · 1: los dos sirven o ninguno
          if ((quiere !== 1 && sol.length !== 1) || (quiere === 1 && sol.length === 1)) continue;
          const L = l => (l.length ? `{${l.map(z => f(z)).join('; ')}}` : '∅');
          const b2 = 2 * m - 1, c2 = m * m - K;   // x + K = (x + m)²  ⇒  x² + b2 x + c2 = 0
          const cuad = [{ sup: [x, '2'] }, b2 ? ` ${b2 > 0 ? '+' : '−'} ${Math.abs(b2) === 1 ? '' : f(Math.abs(b2))}` : '', b2 ? x : '', mas(c2), ' = 0'];
          const der = m ? ['(', x, mas(m), { sup: [')', '2'] }] : [{ sup: [x, '2'] }];
          // Plano que encierra el inicio de la raíz y los dos candidatos (sobre la recta y = x + m).
          let x0 = Math.min(-K, ...cand) - 1, x1 = Math.max(...cand, -K + 4) + 2;
          if (x1 - x0 < 8) x1 = x0 + 8;
          const ys = cand.map(z => z + m);
          const y0 = Math.min(-2, Math.min(...ys) - 1), y1 = Math.max(3, Math.max(...ys.map(Math.abs)) + 1, Math.ceil(Math.sqrt(x1 + K)));
          const pos = muestra(u => Math.sqrt(u + K), x0, x1, y0, y1), neg = muestra(u => -Math.sqrt(u + K), x0, x1, y0, y1), lin = muestra(u => u + m, x0, x1, y0, y1);
          const uR = Math.max(-K, x0) + 0.12 * (x1 - Math.max(-K, x0)), yL = y0 + 0.65 * (y1 - y0);   // rótulos lejos de los candidatos
          const raizTxt = `√(x${mas(K)})`, rectaTxt = `y = x${mas(m)}`;
          const figura = marcas => ({ datos: Object.assign(plano(x0, x1, y0, y1), {
            curvas: [{ puntos: pos, color: 'i', rotulo: `y = ${raizTxt}`, en: [uR, Math.sqrt(uR + K) + 0.1 * (y1 - y0)] }, { puntos: lin, color: 'o', rotulo: rectaTxt, en: [yL - m + 0.06 * (x1 - x0), yL] },
              ...(marcas === 'prueba' ? [{ puntos: neg, color: 'h', discontinua: true, rotulo: `y = −${raizTxt}`, en: [x0 + 0.3, y0 + 0.6] }] : [])],
            puntos: marcas === 'candidatos' ? cand.map(z => ({ x: z, y: z + m, color: 'o', rotulo: f(z) }))
              : marcas === 'prueba' ? cand.map(z => ({ x: z, y: z + m, color: ok(z) ? 'd' : 'h', abierto: !ok(z), rotulo: `${f(z)} ${ok(z) ? '✓' : '✗'}` })) : [],
            alt: `La curva y = ${raizTxt} y la recta ${rectaTxt}${marcas ? `; candidatos ${f(cand[0])} y ${f(cand[1])}, ${sol.length === 2 ? 'los dos cumplen' : sol.length ? `solo cumple ${f(sol[0])}` : 'ninguno cumple'}` : ''}`,
          }), estado: {} });
          const prueba = z => [{ raiz: [`${f(z)}${mas(K)}`] }, ok(z) ? ` = ${f(Math.sqrt(z + K))}, igual al lado derecho ✓` : ` = ${f(Math.sqrt(z + K))}, pero el lado derecho es ${f(z + m)} ✗`];
          const cierre = sol.length === 2 ? 'Los dos cumplen.' : sol.length ? `Solo cumple ${f(sol[0])}; el otro da un lado derecho negativo.` : 'Ninguno cumple: los dos dan un lado derecho negativo.';
          return {
            enunciado: ['Resuelve ', { raiz: [x, mas(K)] }, ' = ', x, mas(m), '.'],
            dibujo: figura(null),
            pasos: [
              { tipo: 'pide', texto: ['Piden los ', x, ' que cumplen la ecuación. Lo que salga al elevar al cuadrado serán solo candidatos.'] },
              { tipo: 'datos', texto: ['La raíz pide ', x, `${mas(K)} ≥ 0. Y como una raíz no es negativa, el lado derecho también: `, x, `${mas(m)} ≥ 0.`],
                ecuacion: [x, ` ≥ ${f(-K)}`, '   y   ', x, ` ≥ ${f(-m)}`] },
              { tipo: 'regla', texto: 'Elevo al cuadrado para quitar la raíz. Ese paso no se deshace: también resuelve la ecuación con −√. Por eso pruebo cada candidato en la original.' },
              { tipo: 'cuentas', texto: 'Elevo los dos lados al cuadrado, paso todo a un lado y factorizo.',
                ecuacion: [x, mas(K), ' = ', ...der, '  ⇒  ', ...cuad, '  ⇒  ', x, ` = ${f(cand[0])} o `, x, ` = ${f(cand[1])}`], dibujo: figura('candidatos') },
              { tipo: 'sentido', texto: `Pruebo cada candidato en la original: la raíz y el lado derecho tienen que dar lo mismo. ${cierre}`,
                ecuacion: [...prueba(cand[0]), '   ·   ', ...prueba(cand[1])], dibujo: figura('prueba') },
            ],
            respuesta: ['S = ', L(sol)],
          };
        }
        throw new Error('sin caso');
      },
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
  // Cambia: el número k del lado derecho (se arrastra la recta y = k) · Permanece: la curva y = √(x − 1) · Progresa: el tramo del eje x que cumple
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
    // Lee (fase 2): el radicando no puede ser negativo y la desigualdad se lee como «curva bajo la recta»; no dice
    // qué pasa con un lado derecho negativo (eso es «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Raíces que no existen', texto: 'Ningún número real multiplicado por sí mismo da un negativo. Por eso √(−4) no es un número real: lo que va dentro de la raíz, el radicando, no puede ser negativo.' },
        { titulo: 'Comparar con un nivel', texto: 'Resolver √(x − 1) < 2 es buscar los x donde la curva y = √(x − 1) queda por debajo de la recta horizontal y = 2.' },
        { titulo: 'Qué mirar al jugar', texto: 'Sube y baja la recta roja punteada y = k, también por debajo del eje x. Mira dónde empieza y dónde termina el tramo verde.' },
      ],
    },
    juega: {
      consigna: 'Resuelve √(x − 1) < k mirando dónde la curva queda bajo la recta y = k. En verde, los x que cumplen.',
      voz: 'Prueba un k negativo también.',
      controles: [{ id: 'k', etiqueta: 'k', color: 'c-h', min: -1, max: 3, paso: 1, inicio: 2, decimales: 0 }],
      dibujo: val => ({ datos: ejesRaiz1(val.k, '<'), estado: {} }),
      lectura: val => [{ raiz: [x, ' − 1'] }, ` < ${f(val.k)} → ${val.k > 0 ? iv(1, true, 1 + val.k * val.k, false) : '∅'}`],
      minimo: 3,
      // Arrastra la recta horizontal y = k hacia arriba o abajo.
      arrastres: [{ id: 'nivel-k', etiqueta: 'nivel k de la recta', color: 'c-h',
        donde: val => enPlano(ejesRaiz1(val.k, '<'), 7, val.k), mover: (pt, val) => ({ k: deY(ejesRaiz1(val.k, '<'), pt.y) }) }],
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
        { estado: { corte: 3 }, texto: 'Se juntan las dos condiciones.', ecuacion: ['1 ≤ ', x, ' < 10', '   ·   ', '[1, 10)'] },
      ],
    },
    regla: {
      texto: 'Primero el dominio: lo de adentro de la raíz es 0 o más. Si los dos lados son no negativos, cuadrar conserva la desigualdad.',
      ecuacion: [{ raiz: ['u'] }, ' < k  ⇔  ', { llave: ['0 ≤ u'], nota: 'dominio', color: 'c-o' }, ' < ', { sup: ['k', '2'] }],
      condicion: 'k ≥ 0. Con lado derecho negativo no se cuadra: √u < negativo no tiene solución; √u ≥ negativo vale en todo el dominio.',
    },
    // Así se resuelve: √(x + p) rel k, como «Ahora tú» (k negativo en una de cada cuatro semillas), con otras semillas.
    resuelve: {
      pieza: 'ejes',
      generar(s) {
        const rr = azar(s + 900);
        const p = rr.ent(-3, 3), k = s % 4 === 3 ? -rr.ent(1, 2) : rr.ent(1, 4), rel = ['<', '≥', '≤', '>'][s % 4];
        const ini = -p, fin = k * k - p, menor = rel === '<' || rel === '≤';
        let bien, tramo;   // tramo: [desde, hasta] del conjunto solución sobre el eje x (null = sin solución; Infinity = sin fin)
        if (k < 0) { bien = menor ? '∅' : iv(ini, true, null, false); tramo = menor ? null : [ini, Infinity]; }
        else if (menor) { bien = iv(ini, true, fin, rel === '≤'); tramo = [ini, fin]; }
        else { bien = iv(fin, rel === '≥', null, false); tramo = [fin, Infinity]; }
        const ra = { raiz: [x, mas(p)] };
        // Valor de prueba: el inicio del dominio con «<» o «≤» (y con k < 0), y un x con raíz k + 1 con «>» o «≥».
        const t = k < 0 || menor ? ini : (k + 1) * (k + 1) - p, raizT = Math.sqrt(t + p), okT = CUMPLE[rel](raizT, k);
        const x0 = ini - 1, x1 = Math.max(fin, ini) + 3, y0 = Math.min(-1, k) - 1, y1 = Math.ceil(Math.max(k, Math.sqrt(x1 + p))) + 1;
        const curva = muestra(u => Math.sqrt(u + p), x0, x1, y0, y1);
        const figura = conSol => ({ datos: Object.assign(plano(x0, x1, y0, y1), {
          curvas: [{ puntos: curva, color: 'i', rotulo: `y = √(x${mas(p)})`, en: [x1 - 0.2, Math.sqrt(x1 + p) + 0.5] }, { puntos: [[x0, k], [x1, k]], color: 'h', discontinua: true, rotulo: `y = ${f(k)}`, en: [x0 + 0.2, k + 0.4] },
            ...(conSol && tramo ? [{ puntos: [[tramo[0], 0], [Math.min(tramo[1], x1), 0]], color: 'd' }] : [])],
          puntos: [{ x: ini, y: 0, color: 'd', rotulo: 'empieza el dominio' }],
          alt: `y = √(x${mas(p)}) frente a y = ${f(k)}${conSol ? `: solución ${bien}` : ''}`,
        }), estado: {} });
        return {
          enunciado: ['¿Qué valores de ', x, ' cumplen ', ra, ` ${rel} ${f(k)}?`],
          dibujo: figura(false),
          pasos: [
            { tipo: 'pide', texto: ['Piden todos los ', x, ` que hacen la raíz ${rel} ${f(k)}, escritos como intervalo${menor && k < 0 ? ' o conjunto vacío' : ''}.`] },
            { tipo: 'datos', texto: ['La raíz existe si lo de adentro es 0 o más: ', x, `${mas(p)} ≥ 0. El lado derecho, ${f(k)}, es ${k < 0 ? 'negativo' : 'positivo'}.`],
              ecuacion: ['dominio: ', x, ` ≥ ${f(ini)}`] },
            { tipo: 'regla', texto: k < 0 ? 'Primero el dominio. Una raíz vale 0 o más: con un negativo a la derecha no se eleva al cuadrado, se compara directo.'
              : 'Primero el dominio. Si los dos lados son 0 o más, elevar al cuadrado no cambia el sentido de la desigualdad.' },
            k < 0
              ? { tipo: 'cuentas', texto: menor ? `La raíz nunca baja de 0, así que nunca es ${rel} ${f(k)}: no hay solución.` : `La raíz vale 0 o más, y eso ya es mayor que ${f(k)}: sirve todo el dominio.`,
                ecuacion: [ra, ` ≥ 0 > ${f(k)}`], dibujo: figura(true) }
              : { tipo: 'cuentas', texto: 'Elevo los dos lados al cuadrado y despejo. Después junto lo que sale con el dominio.',
                ecuacion: [x, `${mas(p)} ${rel} ${f(k * k)}  ⇒  `, x, ` ${rel} ${f(fin)}`, '   y   ', x, ` ≥ ${f(ini)}`], dibujo: figura(true) },
            { tipo: 'sentido', texto: ['Compruebo con ', x, ` = ${f(t)}: la raíz vale ${f(raizT)}, y «${f(raizT)} ${rel} ${f(k)}» es ${okT ? 'cierto' : 'falso'}. ${okT ? 'Ese valor está en la respuesta, como debe.' : 'Ni el inicio del dominio cumple.'}`],
              ecuacion: [{ raiz: [`${f(t)}${mas(p)}`] }, ` = ${f(raizT)}`] },
          ],
          respuesta: ['S = ', bien],
        };
      },
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

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 1: centro, distancia y las cinco relaciones (=, <, ≤, >, ≥), con r = 0 incluido.
  const conjDist = val => {
    const c = val.a, rad = val.r, lo = c - rad, hi = c + rad, rel = val.rel;
    if (rel === '=') return rad ? [{ tipo: 'punto', x: lo }, { tipo: 'punto', x: hi }] : [{ tipo: 'punto', x: c }];
    if (rel === '<' || rel === '≤') return rad ? [{ tipo: 'intervalo', a: lo, b: hi, ca: rel === '≤', cb: rel === '≤' }] : rel === '≤' ? [{ tipo: 'punto', x: c }] : [];
    return [{ tipo: 'intervalo', a: null, b: lo, cb: rel === '≥' }, { tipo: 'intervalo', a: hi, b: null, ca: rel === '≥' }];
  };
  const rectaRel = val => rectaBase(-10, 10, 3, [
    { tipo: 'punto', x: val.a, color: 'o', rotulo: 'a', fila: 0 },
    ...(val.r ? [{ tipo: 'distancia', a: val.a - val.r, b: val.a, color: 'i', rotulo: 'r', fila: 1 }, { tipo: 'distancia', a: val.a, b: val.a + val.r, color: 'i', rotulo: 'r', fila: 1 }] : []),
    ...conjDist(val).map((e, k) => Object.assign(e, { color: 'd', fila: 2, rotulo: k ? '' : 'cumplen' })),
  ], `Centro ${val.a}, distancia ${val.r}: |x − a| ${val.rel} r da ${conjuntoAbs(val.a, val.r, val.rel)}`);
  // Mesa 2: la V y = |2x − 1| contra una recta y = m x + c con pendiente e intercepto. Con m = ±2 la recta es
  // paralela a un brazo: puede quedar un corte, ninguno o infinitos (el caso que la idea 2 no deja probar).
  const cortesMC = (m, c) => {
    if ((m === 2 && c === -1) || (m === -2 && c === 1)) return null;     // la recta coincide con un brazo
    const cand = [];
    if (m !== 2) cand.push(Q(c + 1, 2 - m));
    if (m !== -2) cand.push(Q(1 - c, 2 + m));
    const ok = cand.filter(z => m * val(z) + c >= -1e-12);
    return ok.filter((z, i) => ok.findIndex(w => fr(w) === fr(z)) === i);
  };
  const recortar = (m, c, lo, hi) => {      // tramo de y = m x + c dentro de y ∈ [lo, hi] y x ∈ [−4, 4]
    let a = -4, b = 4;
    if (m) { const u = (lo - c) / m, w = (hi - c) / m; a = Math.max(a, Math.min(u, w)); b = Math.min(b, Math.max(u, w)); }
    return [[a, m * a + c], [b, m * b + c]];
  };
  const lineaTxt = (m, c) => `y = ${m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '−x' : `${f(m)}x`}${c ? `${m ? (c > 0 ? ' + ' : ' − ') : c < 0 ? '−' : ''}${f(Math.abs(c))}` : m ? '' : '0'}`;
  const ejesVM = vs => {
    const vpts = [];
    for (let k = 0; k <= 40; k++) { const v = -4 + k * 8 / 40; vpts.push(V(v) <= 9 ? [v, V(v)] : null); }
    const sol = cortesMC(vs.m, vs.c), seg = recortar(vs.m, vs.c, -8, 9);
    const fin = seg[1][0] > 2.5 ? seg[1] : seg[0];
    return {
      x: { min: -4, max: 4, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: -8, max: 9, paso: 2, cada: 2, nombre: 'y', decimales: 0 },
      curvas: [{ puntos: vpts, color: 'i', rotulo: 'y = |2x − 1|', en: [-3.3, 7.6] }, { puntos: seg, color: 'o', rotulo: lineaTxt(vs.m, vs.c), en: [fin[0], Math.max(-7, Math.min(7.5, fin[1]))] }],
      puntos: (sol || []).map(z => ({ x: val(z), y: vs.m * val(z) + vs.c, color: 'd', rotulo: fr(z) })),
      alt: `La V y = |2x − 1| y la recta ${lineaTxt(vs.m, vs.c)}: ${sol ? `${sol.length} cortes` : 'coinciden en un brazo'}`,
    };
  };
  const valQ = z => z.p / z.q;
  // Largo de la solución de √(x − 1) < k: de 1 a 1 + k² si k > 0 (como la lectura de la idea); null si no hay x.
  const largoRaiz = k => (k > 0 ? (1 + k * k) - 1 : null);
  // El mayor r (de 0 a 5) que deja fuera al 0 con |x − a| ≤ r, para algún centro a de −5 a 5.
  const MAX_R_SIN_CERO = Math.max(...[0, 1, 2, 3, 4, 5].filter(r => [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].some(a => Math.abs(a) > r)));
  const LABORATORIO = [
    {
      id: 'distancia-libre', titulo: 'Centro, distancia y relación', pieza: 'recta',
      consigna: 'Arrastra el centro a y el punto a + r, y elige la relación. En verde, los x que cumplen |x − a| con r.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: -5, max: 5, paso: 1, inicio: 1, decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 0, max: 5, paso: 1, inicio: 3, decimales: 0 },
        { id: 'rel', etiqueta: 'Relación', opciones: ['≤', '<', '=', '≥', '>'].map(t => ({ valor: t, texto: `${t} r` })) },
      ],
      dibujo: val => ({ datos: rectaRel(val), estado: {} }),
      lectura: val => [...absX(val.a), ` ${val.rel} ${f(val.r)} → ${conjuntoAbs(val.a, val.r, val.rel)}`],
      arrastres: [
        { id: 'centro', etiqueta: 'centro a', color: 'c-o', donde: val => enRecta(rectaRel(val), val.a, 0), mover: (pt, val) => ({ a: deRecta(rectaRel(val), pt.x) }) },
        { id: 'radio', etiqueta: 'punto a + r: cambia la distancia r', color: 'c-i', donde: val => enRecta(rectaRel(val), val.a + val.r, 1), mover: (pt, val) => ({ r: deRecta(rectaRel(val), pt.x) - val.a }) },
      ],
      // Retos comprobados (docs/teoria.md §4d): comparan con conjuntoAbs(), el mismo conjunto que da la lectura.
      invitaciones: [
        { texto: 'Haz que la solución sea un solo número.',
          logrado: val => /^\{[^;]*\}$/.test(conjuntoAbs(val.a, val.r, val.rel)),
          bien: 'Distancia cero: solo el centro está a 0 de sí mismo.' },
        { texto: 'Consigue que la solución sea [−4, 2].',
          logrado: val => conjuntoAbs(val.a, val.r, val.rel) === conjuntoAbs(-1, 3, '≤'),
          bien: 'Centro −1 y distancia 3: |x + 1| ≤ 3.' },
        { texto: 'Haz que todos los reales cumplan.',
          logrado: val => conjuntoAbs(val.a, val.r, val.rel) === 'ℝ',
          bien: 'Toda distancia es mayor o igual que 0: nadie queda fuera.' },
        { texto: 'Con ≤ r, busca el mayor r que todavía deje fuera al 0.',
          logrado: val => val.rel === '≤' && Math.abs(0 - val.a) > val.r && val.r === MAX_R_SIN_CERO,
          bien: 'El 0 está a |a| del centro: r tiene que quedar por debajo.' },
      ],
    },
    {
      id: 'v-y-recta', titulo: 'La V contra cualquier recta', pieza: 'ejes',
      consigna: 'Sube la recta por su corte con el eje y o inclínala por su punto en x = 2. Cada corte resuelve |2x − 1| = mx + c.',
      controles: [
        { id: 'm', etiqueta: 'm', color: 'c-o', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0 },
        { id: 'c', etiqueta: 'c', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: val => ({ datos: ejesVM(val), estado: {} }),
      lectura: val => { const s = cortesMC(val.m, val.c); return [`${lineaTxt(val.m, val.c)}: ${s ? `S = ${llaves(s)}` : 'infinitas soluciones'}`]; },
      arrastres: [
        { id: 'intercepto', etiqueta: 'corte con el eje y: cambia c', color: 'c-o', donde: val => enPlano(ejesVM(val), 0, val.c), mover: (pt, val) => ({ c: deY(ejesVM(val), pt.y) }) },
        { id: 'pendiente', etiqueta: 'punto en x = 2: cambia la pendiente m', color: 'c-o', donde: val => enPlano(ejesVM(val), 2, 2 * val.m + val.c), mover: (pt, val) => ({ m: (deY(ejesVM(val), pt.y) - val.c) / 2 }) },
      ],
      invitaciones: [
        { texto: 'Haz que la recta no corte la V: ninguna solución.',
          logrado: val => { const s = cortesMC(val.m, val.c); return !!s && s.length === 0; },
          bien: 'Los candidatos salen, pero ninguno cumple en la original.' },
        { texto: 'Consigue exactamente una solución.',
          logrado: val => { const s = cortesMC(val.m, val.c); return !!s && s.length === 1; },
          bien: 'Un candidato pasó la prueba; el otro tenía el lado derecho negativo.' },
        { texto: 'Haz que la recta se monte sobre un brazo de la V.',
          logrado: val => cortesMC(val.m, val.c) === null,
          bien: 'Infinitas soluciones: cada punto del brazo es un corte.' },
        { texto: 'Busca una recta que corte la V en x = −1.',
          logrado: val => { const s = cortesMC(val.m, val.c); return !!s && s.some(z => valQ(z) === -1); },
          bien: '|2 · (−1) − 1| = 3: la recta pasa por (−1; 3).' },
        { texto: 'Guarda dos rectas con la misma m: una con dos cortes y otra sin ninguno.',
          logrado: (val, guardados) => {
            const n = v => { const s = cortesMC(v.m, v.c); return s ? s.length : -1; };
            return guardados.some(g => g.m === val.m && n(g) + n(val) === 2 && n(g) * n(val) === 0) && guardados.some(g => g.m === val.m && g.c === val.c);
          },
          bien: 'Subir o bajar la recta decide cuántos cortes hay.' },
      ],
    },
    Object.assign({ id: 'raiz-nivel', titulo: 'La raíz bajo un nivel', pieza: 'ejes', invitaciones: [
      { texto: 'Haz que ningún x cumpla √(x − 1) < k.',
        logrado: val => largoRaiz(val.k) === null,
        bien: 'Una raíz nunca baja de 0: con k ≤ 0 no hay x.' },
      { texto: 'Haz que la solución sea [1, 2).',
        logrado: val => largoRaiz(val.k) === 1,
        bien: 'Con k = 1, cuadrar da x − 1 < 1: de 1 hasta 2.' },
      { texto: 'Busca el k con la solución más larga.',
        logrado: val => largoRaiz(val.k) === Math.max(...[-1, 0, 1, 2, 3].map(largoRaiz)),
        bien: 'La solución crece con k²: de 1 hasta 10.' },
    ] }, rinec.juega),
  ];

  return {
    unidad: 'algebra.valor-absoluto-y-radicales',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/ejes.js'],
    laboratorio: LABORATORIO,
    // Glosario por tema (docs/teoria.md §4d): las palabras que esta unidad estrena en álgebra.
    glosario: [
      { termino: 'valor absoluto', simbolo: '|x|', def: 'La distancia de un número al cero, sin signo: nunca es negativa.',
        ejemplo: '|−4| = 4 y |4| = 4.', ver: ['distancia'] },
      { termino: 'distancia', formas: ['distancia', 'distancias'], def: 'Cuánto separa a dos puntos de la recta: el mayor menos el menor.',
        ejemplo: 'De 1 a −2 hay |1 − (−2)| = 3.', ver: ['valor absoluto', 'centro'] },
      { termino: 'centro', def: 'El punto o el término del medio. En |x − a| ≤ r, es a: desde ahí se mide.', ejemplo: 'En |x + 1| ≤ 3 es −1.' },
      { termino: 'no negativo', formas: ['no negativo', 'no negativos', 'no negativa', 'no negativas'], def: 'Mayor o igual que cero.',
        ejemplo: 'El 0 y el 5 lo son; el −1, no.' },
      { termino: 'ecuación irracional', formas: ['ecuación irracional', 'ecuaciones irracionales'],
        def: 'Ecuación con la letra dentro de una raíz.', ejemplo: '√(x + 3) = x − 3.', ver: ['elevar al cuadrado'] },
      { termino: 'elevar al cuadrado', formas: ['elevar al cuadrado', 'cuadrar'],
        def: 'Multiplicar cada lado por sí mismo. Sirve para quitar una raíz, pero puede traer soluciones falsas.',
        ejemplo: 'x = 2 pasa a x² = 4, que también acepta −2.', ver: ['candidato'] },
      { termino: 'candidato', formas: ['candidato', 'candidatos', 'candidata', 'candidatas'],
        def: 'Valor que sale de los pasos y todavía no se comprobó en la ecuación original.', ver: ['solución'] },
    ],
    historia: {
      texto: 'Rafael Bombelli publicó en 1572 su Álgebra, pensada como una exposición más clara y cuidadosa de las reglas de su tiempo. Trabajar con radicales y con cantidades entonces dudosas lo obligaba a revisar cada operación. El valor absoluto moderno no es suyo, pero la necesidad sigue: elevar al cuadrado puede dejar candidatos que la ecuación original no acepta.',
      pregunta: '¿Toda operación se puede deshacer sin perder nada?',
      fuente: { titulo: 'O’Connor y Robertson, Rafael Bombelli — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Bombelli/' },
    },
    ideas: [distancia, casos, rext, rinec],
  };
});
