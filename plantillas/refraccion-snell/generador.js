/*
 * Generador «El rayo que cambia de medio»: refracción, ley de Snell y ángulo límite.
 * Formato "predicciones" con alternativas de texto (armarTexto de nucleo/predicciones.js): las
 * respuestas son ángulos notables («37°»), arcos con seno exacto («arcsen(9/20)»), índices exactos
 * («4/3», «√2»), longitudes o frases cortas («No sale: reflexión total»). Funciona en el navegador
 * (window.Generadores['refraccion-snell']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   angulo    n₁·sen i = n₂·sen r con ángulos notables. Sub: entra (al medio de mayor índice),
 *             sale (al de menor índice, sin pasar el límite) y superficie (el dato es el ángulo
 *             que el rayo forma con la superficie, no con la normal).
 *   indice    el índice de un vidrio leído en un transportador: sub normal (ángulos medidos desde
 *             la normal) o superficie (medidos desde la superficie del vidrio).
 *   ensayos   primer ensayo del aire a un sólido para hallar su índice; segundo ensayo del sólido a
 *             otro medio (o al revés): el ángulo de refracción.
 *   rapidez   sub angulo: el ángulo de refracción con las rapideces de la luz en los dos medios;
 *             sub lambda: qué pasa con f y con λ al entrar a un medio (la frecuencia no cambia).
 *   limite    sub angulo: el ángulo límite, sen L = n₂/n₁; sub sale: ¿sale o no sale el rayo?
 *   fondo     sub circulo: una linterna en el fondo de un estanque, la luz sale solo por un círculo
 *             de radio h·tan L; sub aparente: la profundidad aparente vista casi en vertical, h·n₂/n₁.
 *
 * Convenciones: ángulos en grados, medidos desde la normal salvo que se diga otra cosa;
 * sen 37° = 3/5 y sen 53° = 4/5; c = 3 × 10⁸ m/s.
 * Errores: R1 a R5 (parcial: un solo estudio, Fyttas y otros 2013, en
 * docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md); ON2 (parcial,
 * docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md); OE12 (hipótesis,
 * docs/investigacion/ondas-electromagneticas-ideas-erroneas.md); ángulo desde la superficie, índices
 * al revés y n tomado como v/c, de la trampa 17 de docs/clasificacion/trampas-admision-unmsm/fisica.md
 * (hipótesis); profundidad real o aparente como respuesta, del CSV de admisión (hipótesis).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const EM = 'docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md';
  const OEM = 'docs/investigacion/ondas-electromagneticas-ideas-erroneas.md';
  const ONDAS = 'docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md';
  const TRAMPAS = 'docs/clasificacion/trampas-admision-unmsm/fisica.md';
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const err = (id, respaldo, fuente, clave, texto, explicacion) => ({ id, respaldo, fuente, clave, texto, explicacion });
  const pa = (id, clave, texto, explicacion, fuente = EM) => err(id, 'parcial', fuente, clave, texto, explicacion);
  const h = (id, clave, texto, explicacion, fuente = TRAMPAS) => err(id, 'hipotesis', fuente, clave, texto, explicacion);

  // ---------- ángulos notables, índices y textos exactos ----------
  const SEN = { 30: 1 / 2, 37: 3 / 5, 45: Math.SQRT2 / 2, 53: 4 / 5, 60: Math.sqrt(3) / 2, 90: 1 };
  const NOTABLES = [30, 37, 45, 53, 60];
  const SEN_TXT = { 30: '1/2', 37: '3/5', 45: '√2/2', 53: '4/5', 60: '√3/2' };
  const COS = a => SEN[90 - a];
  const TAN = { 30: Math.sqrt(3) / 3, 37: 3 / 4, 45: 1, 53: 4 / 3, 60: Math.sqrt(3) };
  const cerca = (a, b) => Math.abs(a - b) < 1e-9;
  const notable = s => { for (const a of [...NOTABLES, 90]) if (cerca(SEN[a], s)) return a; return null; };
  const mcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
  // Número exacto: fracción p/q (q ≤ qmax) o radical a√b/q. Si no sale limpio, null.
  function exacto(x, qmax = 12) {
    if (!(x > 0)) return null;
    for (let q = 1; q <= qmax; q++) { const p = x * q, r = Math.round(p); if (r > 0 && Math.abs(p - r) < 1e-9) return q === 1 ? String(r) : `${r}/${q}`; }
    for (let q = 1; q <= qmax; q++) {
      const M = Math.round((x * q) ** 2);
      if (M > 0 && Math.abs((x * q) ** 2 - M) < 1e-7) {
        let a = 1, b = M;
        for (let k = 2; k * k <= b; k++) while (b % (k * k) === 0) { b /= k * k; a *= k; }
        if (b === 1) continue;
        const g = mcd(a, q), A = a / g, Q = q / g;
        return (A === 1 ? '' : A) + '√' + b + (Q === 1 ? '' : '/' + Q);
      }
    }
    return null;
  }
  // Un ángulo dado por su seno: «37°» si es notable, «arcsen(9/20)» si el seno es exacto; si no, null.
  function angTxt(s) {
    if (!(s > 0) || s > 1 + 1e-9) return null;
    const a = notable(s);
    if (a) return `${a}°`;
    const e = exacto(s, 30);
    return e ? `arcsen(${e})` : null;
  }
  const kS = s => 'sen:' + s.toFixed(8);
  const kN = x => 'n:' + x.toFixed(8);
  const kX = x => 'x:' + x.toFixed(8);
  const nTxt = n => exacto(n, 12) || f(n);
  // Índices con que se arman los problemas (1 es el aire, 4/3 el agua).
  const INDICES = [1, 4 / 3, 3 / 2, 5 / 3, 5 / 4, 6 / 5, 8 / 5, Math.SQRT2, Math.sqrt(3), 2];
  const OTROS = ['un vidrio', 'un cristal', 'un plástico transparente', 'un acrílico'];
  function nombres(rng, ns) {
    const pool = rng.barajar(OTROS);
    let k = 0;
    return ns.map(n => (cerca(n, 1) ? 'el aire' : cerca(n, 4 / 3) ? 'el agua' : pool[k++]));
  }
  const conIndice = (nombre, n) => (nombre === 'el aire' ? 'el aire' : `${nombre} (n = ${nTxt(n)})`);
  const de = o => o.replace(/^el /, 'del ').replace(/^un /, 'de un ');
  const def = o => o.replace(/^un /, 'el '); // segunda mención: «el vidrio»
  const pn = n => (nTxt(n).includes('/') ? `(${nTxt(n)})` : nTxt(n)); // índice entre paréntesis si es fracción
  const a_ = o => o.replace(/^el /, 'al ').replace(/^un /, 'a un ');
  // «al aire (n = 1)», «a un vidrio (n = 3/2)».
  const hacia = (nombre, n) => `${a_(nombre)} (n = ${nTxt(n)})`;
  const dela = (nombre, n) => `${de(nombre)} (n = ${nTxt(n)})`;

  // Todas las combinaciones (n₁, n₂, i) con un ángulo de refracción notable.
  const SNELL = [];
  for (const n1 of INDICES) for (const n2 of INDICES) {
    if (n1 === n2) continue;
    for (const i of NOTABLES) { const r = notable(n1 * SEN[i] / n2); if (r && r !== 90 && r !== i) SNELL.push({ n1, n2, i, r }); }
  }

  function cerrar(rng, semilla, o) {
    // Se descartan los errores sin texto y los que se escribirían igual que otra opción con otra clave.
    const textos = new Map([[o.correcta.texto, o.correcta.clave]]);
    const errores = [];
    for (const e of o.errores) {
      if (!e || !e.clave || !e.texto) continue;
      if (textos.has(e.texto) && textos.get(e.texto) !== e.clave) continue;
      textos.set(e.texto, e.clave);
      errores.push(e);
    }
    const alternativas = P.armarTexto({ correcta: o.correcta, errores, rng });
    if (alternativas.length < 4) return null;
    return {
      id: `refraccion-snell#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta.clave, texto: o.correcta.texto, unidad: o.unidad || '' }, _datos: o.datos,
    };
  }

  function generar(semilla) {
    const rng = Azar.crear('refraccion-snell|' + semilla);
    const [tipo, sub] = rng.elegir([['angulo', 'entra'], ['angulo', 'sale'], ['angulo', 'superficie'], ['indice', 'normal'], ['indice', 'superficie'],
      ['ensayos'], ['ensayos'], ['rapidez', 'angulo'], ['rapidez', 'angulo'], ['rapidez', 'lambda'], ['limite', 'angulo'], ['limite', 'sale'], ['limite', 'sale'],
      ['fondo', 'circulo'], ['fondo', 'circulo'], ['fondo', 'aparente']]);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'angulo') return angulo(rng, semilla, sub);
    if (tipo === 'indice') return indice(rng, semilla, sub);
    if (tipo === 'ensayos') return ensayos(rng, semilla);
    if (tipo === 'rapidez') return sub === 'angulo' ? rapidezAngulo(rng, semilla) : lambda(rng, semilla);
    if (tipo === 'limite') return sub === 'angulo' ? limiteAngulo(rng, semilla) : limiteSale(rng, semilla);
    return fondo(rng, semilla, sub);
  }

  const VAR = {
    n1: { nombre: 'índice del medio de donde viene el rayo', color: 'o' },
    n2: { nombre: 'índice del medio al que pasa', color: 'h' },
    i: { nombre: 'ángulo de incidencia', color: 'i' },
    x: { nombre: 'lo que se pide', color: 'd' },
  };
  const TOTAL = { clave: 'total', texto: 'No pasa al otro medio: se refleja todo (reflexión total)' };
  const REFLEJA = { clave: 'refleja', texto: 'No entra: rebota en la superficie' };
  const snellSeg = (n1, i, n2, r) => [v('n1', n1), ' · sen ', v('i', i), ' = ', v('n2', n2), ' · sen ', v('x', r)];

  // Errores comunes cuando se pide el ángulo de refracción (n₁ sen i = n₂ sen r).
  function erroresAngulo(n1, n2, i, sr, prefijo = '') {
    const entra = n1 < n2;
    const r = notable(sr);
    const inv = n2 * SEN[i] / n1;
    const t = s => { const a = angTxt(s); return a ? prefijo + a : null; };
    const lista = [
      entra
        ? pa('R1-no-se-desvia', kS(SEN[i]), t(SEN[i]), `Supusiste que el rayo sigue recto. Al pasar oblicuo a un medio de mayor índice, el rayo se acerca a la normal: el ángulo de refracción es menor que ${i}°.`)
        : pa('R5-no-se-desvia', kS(SEN[i]), t(SEN[i]), `Supusiste que el rayo sale sin desviarse. Al pasar a un medio de menor índice, el rayo se aleja de la normal: el ángulo de refracción es mayor que ${i}°.`),
      cerca(inv, 1) ? null : inv > 1
        ? pa('R3-indices-invertidos', TOTAL.clave, TOTAL.texto, `Pusiste los índices al revés: n₂·sen i = n₁·sen r. Con eso el seno sale mayor que 1 y parece que no hay rayo refractado. En la ley de Snell, cada índice va con el ángulo de su propio medio: n₁·sen i = n₂·sen r.`)
        : pa('R3-indices-invertidos', kS(inv), t(inv), `Pusiste los índices al revés, cada uno con el ángulo del otro medio. Así el rayo ${entra ? 'se aleja' : 'se acerca'} de la normal, justo lo contrario de lo que pasa ${entra ? 'al entrar a un medio de mayor índice' : 'al salir a uno de menor índice'}.`),
    ];
    if (r && r !== 45) lista.push(h('R-desde-superficie', kS(COS(r)), t(COS(r)), `Diste el ángulo entre el rayo refractado y la superficie (${90 - r}°). En la ley de Snell los ángulos se miden desde la normal: el rayo forma ${r}° con la normal.`));
    lista.push(entra
      ? pa('R2-no-entra', REFLEJA.clave, REFLEJA.texto, 'Pensaste que la luz no entra a un medio más denso y rebota. Una parte se refleja, pero la mayor parte entra y se refracta.')
      : pa('R4-no-sale', TOTAL.clave, TOTAL.texto, `Pensaste que el rayo no sale porque el medio de donde viene es más denso. Solo hay reflexión total si el ángulo de incidencia supera el ángulo límite; con ${i}° el rayo sale.`));
    return lista;
  }

  // ---- angulo: n₁ sen i = n₂ sen r ----
  function angulo(rng, semilla, sub) {
    const pool = SNELL.filter(c => (sub === 'entra' ? c.n1 < c.n2 : sub === 'sale' ? c.n1 > c.n2 : c.i !== 45));
    const { n1, n2, i, r } = rng.elegir(pool);
    const [m1, m2] = nombres(rng, [n1, n2]);
    const sr = SEN[r];
    const datoAng = sub === 'superficie'
      ? ['El rayo incidente forma ', v('i', `${90 - i}°`), ' con la superficie de separación']
      : ['El rayo incide con ', v('i', `${i}°`), ' respecto a la normal a la superficie'];
    const enunciado = ['Un rayo de luz viaja por ', v('n1', conIndice(m1, n1)), ' y pasa ', v('n2', hacia(m2, n2)), '. ', ...datoAng, '.'];
    const pregunta = ['¿Qué ', v('x', 'ángulo forma el rayo refractado con la normal'), '?'];
    const errores = erroresAngulo(n1, n2, i, sr);
    if (sub === 'superficie') {
      const s2 = n1 * SEN[90 - i] / n2;
      errores.unshift(s2 > 1 + 1e-9
        ? h('R-desde-superficie', TOTAL.clave, TOTAL.texto, `Usaste ${90 - i}° como ángulo de incidencia, pero ese ángulo se mide desde la superficie. Desde la normal, la incidencia es 90° − ${90 - i}° = ${i}°.`)
        : h('R-desde-superficie', kS(s2), angTxt(s2), `Usaste ${90 - i}° como ángulo de incidencia, pero ese ángulo se mide desde la superficie. Desde la normal, la incidencia es 90° − ${90 - i}° = ${i}°.`));
    }
    const solucion = [];
    if (sub === 'superficie') solucion.push(['Los ángulos se miden desde la normal: ', v('i', `i = 90° − ${90 - i}° = ${i}°`), '.']);
    solucion.push(['Ley de Snell: ', ...snellSeg('n₁', 'i', 'n₂', 'r'), '.']);
    solucion.push(['sen ', v('x', 'r'), ' = ', v('n1', nTxt(n1)), ` · sen ${i}° / `, v('n2', pn(n2)), ` = ${nTxt(n1)} · ${SEN_TXT[i]} / ${pn(n2)} = ${SEN_TXT[r]}, así que `, v('x', `r = ${r}°`),
      n1 < n2 ? ': el rayo se acerca a la normal.' : ': el rayo se aleja de la normal.']);
    return cerrar(rng, semilla, { correcta: { clave: kS(sr), texto: `${r}°` }, errores, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'angulo', sub, n1, n2, i } });
  }

  // ---- indice: el transportador ----
  function indice(rng, semilla, sub) {
    const pool = SNELL.filter(c => c.n1 === 1);
    const { n2, i, r } = rng.elegir(pool);
    const [, m2] = nombres(rng, [1, n2]);
    const vidrio = m2.replace(/^el /, '').replace(/^un /, '');
    const sup = sub === 'superficie';
    const a1 = sup ? 90 - i : i, a2 = sup ? 90 - r : r;
    const enunciado = [`En el laboratorio, un rayo de luz pasa del aire a un bloque de ${vidrio}. Con un transportador se mide que el rayo incidente forma `, v('i', `${a1}°`),
      ` y el rayo refractado forma `, v('x', `${a2}°`), sup ? ` con la superficie del bloque.` : ' con la normal a la superficie.'];
    const pregunta = ['¿Cuál es el ', v('n2', `índice de refracción del ${vidrio}`), '?'];
    const correcta = SEN[i] / SEN[r];
    const T = x => nTxt(x);
    const errores = [
      h('R-razon-invertida', kN(1 / correcta), T(1 / correcta), `Dividiste al revés. Del aire (n = 1) al ${vidrio}: 1 · sen i = n · sen r, así que n = sen i / sen r. Un índice menor que 1 no puede ser: la luz no va más rápido que en el vacío.`),
      h('R-angulos-proporcionales', kN(a1 / a2), T(a1 / a2), `Dividiste los ángulos. La ley de Snell relaciona los senos de los ángulos, no los ángulos: n = sen i / sen r.`),
    ];
    if (sup) {
      errores.unshift(h('R-desde-superficie', kN(SEN[a1] / SEN[a2]), T(SEN[a1] / SEN[a2]), `Usaste los ángulos medidos desde la superficie. En la ley de Snell se miden desde la normal: i = 90° − ${a1}° = ${i}° y r = 90° − ${a2}° = ${r}°.`));
      errores.push(h('R-desde-superficie', kN(SEN[a2] / SEN[a1]), T(SEN[a2] / SEN[a1]), `Usaste los ángulos medidos desde la superficie, que es como invertir el cociente. Hay que pasarlos a la normal: i = ${i}° y r = ${r}°.`));
    } else {
      errores.push(h('R-desde-superficie', kN(COS(i) / COS(r)), T(COS(i) / COS(r)), `Usaste los complementos de los ángulos (${90 - i}° y ${90 - r}°), los que se miden desde la superficie. Los datos ya están medidos desde la normal.`));
    }
    errores.push(h('R-indice-un-angulo', kN(1 / SEN[r]), T(1 / SEN[r]), `Usaste solo el ángulo de refracción, n = 1/sen r, como si el rayo llegara rozando. El rayo llega con ${i}° desde la normal: n = sen i / sen r.`));
    const solucion = [];
    if (sup) solucion.push(['Se pasa a la normal: ', v('i', `i = 90° − ${a1}° = ${i}°`), ' y ', v('x', `r = 90° − ${a2}° = ${r}°`), '.']);
    solucion.push(['Ley de Snell desde el aire: 1 · sen ', v('i', 'i'), ' = ', v('n2', 'n'), ' · sen ', v('x', 'r'), '.']);
    solucion.push([v('n2', 'n'), ` = sen ${i}° / sen ${r}° = (${SEN_TXT[i]}) / (${SEN_TXT[r]}) = `, v('n2', T(correcta)), '.']);
    return cerrar(rng, semilla, { correcta: { clave: kN(correcta), texto: T(correcta) }, errores, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'indice', sub, i, r, a1, a2 } });
  }

  // ---- ensayos: hallar el índice del sólido y usarlo en un segundo medio ----
  function ensayos(rng, semilla) {
    const primero = rng.elegir(SNELL.filter(c => c.n1 === 1));
    const ns = primero.n2;
    const desde = rng.moneda(); // true: del sólido al segundo medio; false: del segundo medio al sólido
    const pool = SNELL.filter(c => (desde ? cerca(c.n1, ns) && !cerca(c.n2, 1) : cerca(c.n2, ns) && !cerca(c.n1, 1)));
    if (!pool.length) return null;
    const seg = rng.elegir(pool);
    const nm = desde ? seg.n2 : seg.n1;
    const [, solido, medio] = nombres(rng, [1, ns, nm]);
    const S = solido.replace(/^el /, '').replace(/^un /, '');
    const enunciado = [`Primer ensayo: un rayo pasa del aire a un bloque de ${S}; incide con `, v('i', `${primero.i}°`), ' y se refracta con ', `${primero.r}°`, ', ambos medidos desde la normal. ',
      `Segundo ensayo: un rayo viaja por `, desde ? v('n1', `el ${S}`) : v('n1', conIndice(medio, nm)), ' y pasa ', desde ? v('n2', hacia(medio, nm)) : v('n2', `al ${S}`),
      ' con un ángulo de incidencia de ', v('i', `${seg.i}°`), '.'];
    const pregunta = ['En el segundo ensayo, ¿qué ', v('x', 'ángulo forma el rayo refractado con la normal'), '?'];
    const n1 = seg.n1, n2 = seg.n2, sr = SEN[seg.r];
    const nsMal = SEN[primero.r] / SEN[primero.i];
    const sMal = desde ? nsMal * SEN[seg.i] / n2 : n1 * SEN[seg.i] / nsMal;
    const errores = [
      sMal > 1 + 1e-9
        ? h('R-indices-invertidos-ensayo', TOTAL.clave, TOTAL.texto, `En el primer ensayo dividiste al revés y el ${S} quedó con n = ${nTxt(nsMal)}, menor que 1. Con eso parece que hay reflexión total. Del aire al ${S}: n = sen ${primero.i}° / sen ${primero.r}° = ${nTxt(ns)}.`)
        : h('R-indices-invertidos-ensayo', kS(sMal), angTxt(sMal), `En el primer ensayo dividiste al revés: el ${S} quedó con n = ${nTxt(nsMal)}, menor que 1. Del aire al ${S}: n = sen ${primero.i}° / sen ${primero.r}° = ${nTxt(ns)}.`),
      ...erroresAngulo(n1, n2, seg.i, sr),
    ];
    if (seg.i !== primero.r && seg.r !== primero.r) errores.push(h('R-copia-primer-ensayo', kS(SEN[primero.r]), `${primero.r}°`, `Copiaste el ángulo de refracción del primer ensayo. El segundo ensayo es otro par de medios: hay que usar el índice del ${S} con la ley de Snell.`));
    const solucion = [
      [`Primer ensayo, del aire al ${S}: 1 · sen ${primero.i}° = n · sen ${primero.r}°, así que `, v(desde ? 'n1' : 'n2', `n = (${SEN_TXT[primero.i]}) / (${SEN_TXT[primero.r]}) = ${nTxt(ns)}`), '.'],
      ['Segundo ensayo: ', ...snellSeg(nTxt(n1), `${seg.i}°`, nTxt(n2), 'r'), '.'],
      ['sen ', v('x', 'r'), ` = ${nTxt(n1)} · ${SEN_TXT[seg.i]} / ${pn(n2)} = ${SEN_TXT[seg.r]}, así que `, v('x', `r = ${seg.r}°`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: { clave: kS(sr), texto: `${seg.r}°` }, errores, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'ensayos', i1: primero.i, r1: primero.r, n1, n2, i: seg.i, desde } });
  }

  // ---- rapidez/angulo: con las rapideces de la luz en los dos medios ----
  const VEL = INDICES.filter(n => Math.abs(3 / n * 100 - Math.round(3 / n * 100)) < 1e-6); // rapideces con dos decimales a lo más
  function rapidezAngulo(rng, semilla) {
    const pool = SNELL.filter(c => VEL.includes(c.n1) && VEL.includes(c.n2));
    const { n1, n2, i, r } = rng.elegir(pool);
    const v1 = 3 / n1, v2 = 3 / n2;
    const [m1, m2] = nombres(rng, [n1, n2]);
    const enunciado = ['La luz viaja a ', v('n1', `${f(v1)} × 10⁸ m/s`), ` en ${m1} y a `, v('n2', `${f(v2)} × 10⁸ m/s`), ` en ${m2}. Un rayo pasa ${de(def(m1))} ${a_(def(m2))} con un ángulo de incidencia de `, v('i', `${i}°`), '.'];
    const pregunta = ['¿Qué ', v('x', 'ángulo forma el rayo refractado con la normal'), '?'];
    const sr = SEN[r], mal = SEN[i] * v1 / v2;
    const errores = [
      mal > 1 + 1e-9
        ? h('R-n-como-v-sobre-c', TOTAL.clave, TOTAL.texto, `Tomaste el índice como si creciera con la rapidez (n = v/c). Es al revés: n = c/v, el medio donde la luz va más lento tiene el índice mayor. Así, sen i / sen r = v₁/v₂.`)
        : h('R-n-como-v-sobre-c', kS(mal), angTxt(mal), `Tomaste el índice como si creciera con la rapidez (n = v/c). Es al revés: n = c/v, el medio donde la luz va más lento tiene el índice mayor. Así, sen i / sen r = v₁/v₂.`),
      ...erroresAngulo(n1, n2, i, sr).filter(e => e.id !== 'R3-indices-invertidos'),
    ];
    const solucion = [
      ['Con n = c/v: ', v('n1', `n₁ = 3/${f(v1)} = ${nTxt(n1)}`), ' y ', v('n2', `n₂ = 3/${f(v2)} = ${nTxt(n2)}`), '. Equivale a sen i / sen r = v₁/v₂.'],
      ['sen ', v('x', 'r'), ' = sen ', v('i', `${i}°`), ' · ', v('n2', f(v2)), ' / ', v('n1', f(v1)), ` = ${SEN_TXT[i]} · ${f(v2)} / ${f(v1)} = ${SEN_TXT[r]}, así que `, v('x', `r = ${r}°`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: { clave: kS(sr), texto: `${r}°` }, errores, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'rapidez', sub: 'angulo', v1, v2, i } });
  }

  // ---- rapidez/lambda: la frecuencia no cambia al cambiar de medio ----
  function lambda(rng, semilla) {
    const n = rng.elegir([4 / 3, 3 / 2, 5 / 4, 6 / 5, 8 / 5]);
    const fr = rng.elegir([4, 4.8, 5, 6, 6.25, 7.5]); // en 10¹⁴ Hz
    const l0 = Math.round(3e17 / (fr * 1e14)); // en nm: c = λ·f
    const lm = l0 / n;
    if (!Number.isInteger(lm) || Math.abs(fr / n * 100 - Math.round(fr / n * 100)) > 1e-6) return null;
    const [, m] = nombres(rng, [1, n]);
    const enunciado = ['Una luz de ', v('i', `${l0} nm`), ' de longitud de onda en el aire y ', v('n1', `${f(fr)} × 10¹⁴ Hz`), ` de frecuencia entra ${a_(m)} `, v('n2', `(n = ${nTxt(n)})`), '.'];
    const pregunta = ['Dentro ', de(def(m)), ', ¿cuál es su ', v('n1', 'frecuencia'), ' y su ', v('x', 'longitud de onda'), '?'];
    const txt = (fq, l) => `f = ${fq} y λ = ${f(l)} nm`;
    const igual = `${f(fr)} × 10¹⁴ Hz`;
    const menor = `${f(fr / n)} × 10¹⁴ Hz`;
    const correcta = { clave: `f=1;l=${f(lm)}`, texto: txt(igual, lm) };
    const errores = [
      h('OE12-cambia-f', `f=${f(1 / n)};l=${f(l0)}`, txt(menor, l0), `Supusiste que al cambiar de medio cambia la frecuencia y la longitud de onda se queda. Es al revés: la frecuencia la pone la fuente y no cambia; lo que cambia es la rapidez (v = c/n), y con ella λ = v/f.`, OEM),
      h('PR4-lambda-por-n', `f=1;l=${f(l0 * n)}`, txt(igual, l0 * n), `Multiplicaste por el índice. En un medio de mayor índice la luz va más lento: v = c/n y λ = λ₀/n, más corta.`, 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md'),
      pa('ON2-cambian-las-dos', `f=${f(1 / n)};l=${f(lm)}`, txt(menor, lm), `Bajaste la frecuencia y también la longitud de onda. Con v = λ·f, si las dos bajaran entre n, la rapidez bajaría entre n². La frecuencia no cambia: solo λ y v bajan entre n.`, ONDAS),
      h('OE12-nada-cambia', `f=1;l=${f(l0)}`, txt(igual, l0), `Dejaste λ igual. La frecuencia no cambia, pero la rapidez sí (v = c/n): como λ = v/f, la longitud de onda baja en la misma proporción.`, OEM),
    ];
    const solucion = [
      ['La frecuencia la pone la fuente: no cambia al pasar de un medio a otro. ', v('n1', `f = ${igual}`), '.'],
      ['La rapidez baja: v = c/n. Como λ = v/f, ', v('x', 'λ'), ' = ', v('i', `${l0} nm`), ' / ', v('n2', pn(n)), ' = ', v('x', `${f(lm)} nm`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables: VAR, enunciado, pregunta, solucion, unidad: 'nm',
      datos: { tipo: 'rapidez', sub: 'lambda', n, l0 } });
  }

  // ---- limite/angulo: sen L = n₂/n₁ ----
  const LIMITES = [];
  for (const n1 of INDICES) for (const n2 of INDICES) if (n2 < n1) { const L = notable(n2 / n1); if (L && L !== 90) LIMITES.push({ n1, n2, L }); }
  const NOEXISTE = { clave: 'noexiste', texto: 'No tiene ángulo límite' };
  function limiteAngulo(rng, semilla) {
    const { n1, n2, L } = rng.elegir(LIMITES);
    const [m1, m2] = nombres(rng, [n1, n2]);
    const enunciado = ['La luz viaja por ', v('n1', conIndice(m1, n1)), ' hacia la superficie que lo separa ', v('n2', dela(m2, n2)), '.'];
    const pregunta = ['¿Cuál es el ', v('x', 'ángulo límite'), ' para esa superficie?'];
    const errores = [
      h('R-limite-invertido', NOEXISTE.clave, NOEXISTE.texto, `Pusiste sen L = n₁/n₂ = ${pn(n1)}/${pn(n2)}, que sale mayor que 1. El ángulo límite existe al pasar a un medio de menor índice, y se halla con el rayo refractado rozando la superficie: n₁·sen L = n₂·sen 90°.`, EM),
      pa('R4-no-sale', 'nunca', 'Ningún rayo pasa: todos se reflejan', `Pensaste que la luz no sale porque el medio de donde viene es más denso. Con ángulos pequeños el rayo sí sale; la reflexión total empieza recién en el ángulo límite.`),
    ];
    if (L !== 45) errores.push(h('R-desde-superficie', kS(COS(L)), `${90 - L}°`, `Diste el ángulo con la superficie. El ángulo límite se mide desde la normal: sen L = n₂/n₁ da L = ${L}°.`));
    if (!cerca(n2, 1)) { const s = 1 / n1; errores.push(h('R-limite-sin-n2', kS(s), angTxt(s), `Usaste sen L = 1/n₁, como si el otro medio fuera aire. Aquí el otro medio tiene n = ${nTxt(n2)}: sen L = n₂/n₁.`)); }
    errores.push(h('R-limite-rozando', kS(1), '90°', 'Diste el ángulo del rayo refractado que sale rozando la superficie. El ángulo límite es el ángulo de incidencia que produce ese rayo rasante.'));
    const solucion = [
      ['En el ángulo límite el rayo refractado sale rozando la superficie (90° con la normal): ', v('n1', 'n₁'), ' · sen ', v('x', 'L'), ' = ', v('n2', 'n₂'), ' · sen 90°.'],
      ['sen ', v('x', 'L'), ' = ', v('n2', pn(n2)), ' / ', v('n1', pn(n1)), ` = ${SEN_TXT[L]}, así que `, v('x', `L = ${L}°`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: { clave: kS(SEN[L]), texto: `${L}°` }, errores, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'limite', sub: 'angulo', n1, n2 } });
  }

  // ---- limite/sale: ¿sale o no sale? ----
  function limiteSale(rng, semilla) {
    const total = rng.moneda();
    let n1, n2, i, sr;
    if (total) {
      ({ n1, n2 } = rng.elegir(LIMITES.concat([{ n1: 4 / 3, n2: 1 }, { n1: 3 / 2, n2: 1 }, { n1: 8 / 5, n2: 1 }])));
      const opciones = NOTABLES.filter(a => SEN[a] > n2 / n1 + 1e-9); // se compara con senos: sen 37° = 3/5 es la convención
      if (!opciones.length) return null;
      i = rng.elegir(opciones); sr = n1 * SEN[i] / n2;
    } else {
      ({ n1, n2, i } = rng.elegir(SNELL.filter(c => c.n1 > c.n2)));
      sr = n1 * SEN[i] / n2;
    }
    const [m1, m2] = nombres(rng, [n1, n2]);
    const enunciado = ['Un rayo de luz viaja por ', v('n1', conIndice(m1, n1)), ' y llega a la superficie que lo separa ', v('n2', dela(m2, n2)), ' con un ángulo de incidencia de ', v('i', `${i}°`), '.'];
    const pregunta = ['¿Qué ', v('x', 'pasa con el rayo'), ' en esa superficie?'];
    const pre = 'Sale a ', post = ' de la normal';
    const sale = s => { const a = angTxt(s); return a ? pre + a + post : null; };
    const Ltxt = angTxt(n2 / n1);
    let correcta, errores;
    if (sr > 1 + 1e-9) {
      correcta = TOTAL;
      const inv = n2 * SEN[i] / n1, s90 = n1 * SEN[90 - i] / n2;
      errores = [
        pa('R5-no-se-desvia', kS(SEN[i]), sale(SEN[i]), `Supusiste que el rayo sale sin desviarse. Además, ${i}° supera el ángulo límite (sen L = ${pn(n2)}/${pn(n1)}, L = ${Ltxt}): no hay rayo refractado, todo se refleja.`),
        pa('R3-indices-invertidos', kS(inv), sale(inv), `Pusiste los índices al revés: con n₂·sen i = n₁·sen r el rayo parece acercarse a la normal. Con los índices en su sitio, sen r saldría ${nTxt(sr) || f(sr)}, mayor que 1: no hay rayo refractado.`),
        s90 <= 1 + 1e-9
          ? h('R-desde-superficie', kS(s90), sale(s90), `Usaste ${90 - i}°, el ángulo con la superficie, como si fuera la incidencia. La incidencia, desde la normal, es ${i}°, mayor que el ángulo límite: hay reflexión total.`)
          : null,
        h('R-limite-rozando', kS(1), 'Sale rozando la superficie, a 90° de la normal', `El rayo sale rozando solo justo en el ángulo límite (${Ltxt}). Con ${i}°, más que el límite, ya no sale: se refleja todo.`),
      ];
    } else {
      correcta = { clave: kS(sr), texto: sale(sr) };
      errores = erroresAngulo(n1, n2, i, sr, pre).map(e => (e.texto && e.texto.startsWith(pre) ? { ...e, texto: e.texto + post } : e));
      errores.push(h('R-limite-rozando', kS(1), 'Sale rozando la superficie, a 90° de la normal', `El rayo sale rozando solo en el ángulo límite (${Ltxt}). Con ${i}°, menos que el límite, sale y se aleja de la normal sin llegar a rozar.`));
    }
    const solucion = [
      ['Ángulo límite: sen ', v('x', 'L'), ' = ', v('n2', pn(n2)), ' / ', v('n1', pn(n1)), ` = ${exacto(n2 / n1, 30)}`, Ltxt && !Ltxt.startsWith('arcsen') ? ` (L = ${Ltxt})` : '',
        `. Se comparan los senos: sen ${i}° = ${SEN_TXT[i]} es ${SEN[i] > n2 / n1 ? 'mayor' : 'menor'} que sen L.`],
      sr > 1 + 1e-9
        ? ['La incidencia, ', v('i', `${i}°`), ', supera el límite: con Snell, sen r = ', `${nTxt(n1)} · ${SEN_TXT[i]} / ${pn(n2)} = ${exacto(sr, 30) || f(sr)}`, ', mayor que 1. ', v('x', 'No pasa al otro medio: se refleja todo (reflexión total).')]
        : ['La incidencia, ', v('i', `${i}°`), ', no llega al límite: el rayo sale. ', ...snellSeg(nTxt(n1), `${i}°`, nTxt(n2), 'r'), `, sen r = ${exacto(sr, 30)}: `, v('x', correcta.texto.replace(/^S/, 's')), ' (se aleja de ella).'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'limite', sub: 'sale', n1, n2, i } });
  }

  // ---- fondo: la linterna en el estanque y la profundidad aparente ----
  function fondo(rng, semilla, sub) {
    const unidad = 'm';
    if (sub === 'circulo') {
      const [n, L] = rng.elegir([[5 / 3, 37], [5 / 4, 53], [Math.SQRT2, 45]]);
      const hh = rng.elegir([0.6, 0.8, 1.2, 1.5, 1.6, 2, 2.4, 3, 3.6, 4]);
      const R = hh * TAN[L];
      if (Math.abs(R * 100 - Math.round(R * 100)) > 1e-6) return null;
      const enunciado = ['En el fondo de un estanque de ', v('i', `${f(hh)} m`), ' de profundidad, lleno de un líquido de índice ', v('n1', nTxt(n)),
        ', hay una linterna pequeña que alumbra en todas las direcciones. Fuera del líquido hay aire.'];
      const pregunta = ['Medida desde el punto de la superficie que está justo encima de la linterna, ¿hasta qué ', v('x', 'distancia horizontal'), ' sale luz al aire?'];
      const t = x => `${f(x)} m`;
      const errores = [
        h('R-fondo-profundidad-real', kX(hh), t(hh), 'Diste la profundidad. La luz sale mientras el ángulo con la normal no pase el límite L; en el borde, el radio es h·tan L.', 'docs/clasificacion/trampas-admision-unmsm/fisica.md'),
        h('R-fondo-profundidad-aparente', kX(hh / n), t(hh / n), 'Esa es la profundidad aparente (h/n), lo profundo que parece el estanque visto desde arriba. Lo que se pide es el radio del círculo por donde sale la luz: h·tan L.'),
        h('R-fondo-seno', kX(hh * SEN[L]), t(hh * SEN[L]), 'Multiplicaste la profundidad por sen L. En el triángulo del borde, la profundidad es el cateto junto al ángulo L y el radio es el cateto opuesto: R = h·tan L.'),
        h('R-fondo-cotangente', kX(hh / TAN[L]), t(hh / TAN[L]), 'Dividiste la profundidad entre tan L, como si el ángulo L estuviera en la superficie. L se mide desde la normal, que es vertical: R = h·tan L.'),
        h('PR6-diametro', kX(2 * R), t(2 * R), 'Ese es el diámetro del círculo de luz. La distancia desde el punto que está encima de la linterna hasta el borde es el radio.', 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md'),
      ];
      const solucion = [
        ['La luz sale solo si llega a la superficie con un ángulo menor que el límite: sen ', v('x', 'L'), ' = 1 / ', v('n1', pn(n)), ` = ${SEN_TXT[L]}, L = ${L}°.`],
        ['En el borde, el rayo forma L con la vertical: ', v('x', 'R'), ' = ', v('i', 'h'), ` · tan ${L}° = ${f(hh)} · ${exacto(TAN[L])} = `, v('x', t(R)), '.'],
      ];
      return cerrar(rng, semilla, { correcta: { clave: kX(R), texto: t(R) }, errores, variables: VAR, enunciado, pregunta, solucion, unidad,
        datos: { tipo: 'fondo', sub, n, h: hh } });
    }
    const n = rng.elegir([4 / 3, 3 / 2, 5 / 4, 8 / 5]);
    const hh = rng.elegir([0.6, 0.8, 1.2, 1.6, 2, 2.4, 3, 3.2, 4, 4.8]);
    const ap = hh / n;
    if (Math.abs(ap * 100 - Math.round(ap * 100)) > 1e-6) return null;
    const [, m] = nombres(rng, [1, n]);
    const liquido = m === 'el agua' ? 'agua' : 'un líquido';
    const enunciado = ['Una moneda está en el fondo de un pozo con ', liquido, ' de índice ', v('n1', nTxt(n)), ', a ', v('i', `${f(hh)} m`), ' de profundidad. Una niña la mira desde el aire, casi en vertical.'];
    const pregunta = ['¿A qué ', v('x', 'profundidad parece estar'), ' la moneda?'];
    const t = x => `${f(x)} m`;
    const errores = [
      h('R-aparente-multiplica', kX(hh * n), t(hh * n), 'Multiplicaste por el índice. Al salir al aire el rayo se aleja de la normal, y la moneda parece más cerca de la superficie: h aparente = h·n₂/n₁ = h/n.'),
      h('R-fondo-profundidad-real', kX(hh), t(hh), 'Diste la profundidad real. Los rayos se desvían al salir del líquido, y la moneda parece más arriba de lo que está.'),
      h('R-aparente-resta', kX(hh - hh / n), t(hh - hh / n), 'Eso es cuánto sube la imagen, la diferencia entre la profundidad real y la aparente. La profundidad aparente es h/n.'),
      h('R-aparente-n-menos-1', kX(hh * (n - 1)), t(hh * (n - 1)), 'Multiplicaste por (n − 1). Mirando casi en vertical, los ángulos son pequeños y la profundidad aparente es h·n₂/n₁ = h/n.'),
    ];
    const solucion = [
      ['Mirando casi en vertical (ángulos pequeños), la profundidad aparente es h·n₂/n₁, con n₂ = 1 del aire.'],
      [v('x', 'h aparente'), ' = ', v('i', f(hh)), ' / ', v('n1', pn(n)), ' = ', v('x', t(ap)), ': parece más cerca de la superficie.'],
    ];
    return cerrar(rng, semilla, { correcta: { clave: kX(ap), texto: t(ap) }, errores, variables: VAR, enunciado, pregunta, solucion, unidad,
      datos: { tipo: 'fondo', sub, n, h: hh } });
  }

  return { id: 'refraccion-snell', titulo: 'El rayo que cambia de medio', generar, _exacto: exacto };
});
