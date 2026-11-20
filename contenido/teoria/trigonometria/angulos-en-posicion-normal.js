/*
 * Teoría de «Ángulos en posición normal» (trigonometria.angulos-en-posicion-normal), para 5.º de secundaria y
 * preuniversitario. Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 6) y la propuesta
 * docs/etapa8/propuesta-trigonometria.md (Etapa 8, 19 nov; Gerson delegó el criterio: sus decisiones están en la
 * sección 9). Compañera: Mara (coneja), cercana y rigurosa: los signos salen de las coordenadas, no de una tabla.
 *
 * Cinco ideas: `razones-coordenadas` (las razones salen de P), `signos-cuadrante`, `cuadrantales`, `giro-horario` (los
 * ángulos negativos, nueva) y `coterminales-negativos` (los coterminales). Objeto de cada primera pantalla (pieza
 * trig-pos, dibujos de prueba, sobre el plano de trig-plano): el plano de un pueblo con su plaza, la rueda de la fortuna,
 * la veleta de la plaza, el reloj de pared y la rueda de bicicleta.
 *
 * REGLA DE COLORES DE LA UNIDAD (la de la rama; propuesta §6; molde §5b, «un color fijo por magnitud»):
 *   - carmín (h): los ángulos θ, α y β, con su arco junto al origen;
 *   - naranja (o): la ordenada y, el tramo vertical del eje x a P (el cateto opuesto a θ);
 *   - turquesa (i): la abscisa x, el tramo horizontal del origen al pie de P (el cateto adyacente);
 *   - tinta: el radio vector r (el lado final de O a P, la hipotenusa), los objetos, los ejes y lo que se pide («?»);
 *   - violeta (f): el valor de la razón que se pide, en los textos (en las figuras, solo después de resolver).
 *   Verde: no se usa. La respuesta lleva el color de su magnitud: una razón en violeta, un ángulo en carmín; un cuadrante o
 *   un signo, en tinta y negrita. Lo comprueba angulos-en-posicion-normal.test.js en las figuras y los textos.
 * Letras (propuesta §5, campo `letras`): θ el ángulo en posición normal; α y β dos ángulos de un mismo problema; P un
 * punto del lado final; x e y su abscisa y su ordenada; r el radio vector; n un número entero de vueltas; a y m una
 * coordenada desconocida. r nunca vale 1 por definición (la circunferencia de radio 1 es de la unidad siguiente).
 * Lo que no entra: el ángulo de referencia, la paridad sen(−θ) = −sen θ y la cofunción (Reducción al primer cuadrante);
 * las líneas trigonométricas (Circunferencia trigonométrica). Por eso ningún valor sale de un ángulo de los cuadrantes II a
 * IV sin su punto: sale de un P con coordenadas, de un cuadrantal o de un coterminal del primer cuadrante.
 * Errores: TR7, TR8, TR10, TR11, TR12 y TR15 son de docs/investigacion/trigonometria-ideas-erroneas.md (parciales); los
 * TRPN-* de la versión 0.1.0 se conservan (otras unidades los citan); los demás son hipótesis de aula, en cada idea.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: las seis razones de cualquier ángulo salen de un punto P(x, y) de su lado final y de r.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, con o sin conexión.
 *   Resultado observable: da el signo y el valor de una razón con coordenadas, distingue «vale 0» de «no está definida»,
 *     ubica un ángulo negativo y halla un coterminal.
 *   Orden de atención: 1.º el punto P · 2.º sus proyecciones x e y con signo · acción: mover P o el giro · fondo: el objeto.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿de dónde sale el signo de cada razón, por qué tan 90° no es 0 y dónde termina un giro negativo?
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/kit/piezas/trig-pos.js')) : fabrica(root.Kit, root.Kit.piezas['trig-pos']);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, TPOS) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const SEP = '   ·   ';
  const PZ = 'trig-pos';
  const TP = () => Kit.piezas[PZ] || TPOS;
  // Una relación que no se parte en dos líneas: sus espacios pasan a espacios duros (como en «Razones»).
  const junto = x => (typeof x === 'string' ? x.replace(/ /g, ' ') : Array.isArray(x) ? x.map(junto)
    : x && typeof x === 'object' && 'v' in x ? Object.assign({}, x, { t: junto(x.t) })
      : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, k === 'indice' ? v : junto(v)])) : x);
  // Colores de la unidad (cabecera): ángulos carmín, y naranja, x turquesa, r en tinta, la razón pedida en violeta.
  const dH = t => ({ v: 'c-h', t }), dO = t => ({ v: 'c-o', t }), dI = t => ({ v: 'c-i', t }), dF = t => ({ v: 'c-f', t });
  const neg = t => ({ negrita: [t] });
  const th = dH('θ'), al = dH('α'), be = dH('β');
  const X = dI('x'), Y = dO('y'), R = 'r';
  const frac = (a, b) => ({ frac: [a, b] });
  const rad = g => g * Math.PI / 180;
  const mod360 = g => ((g % 360) + 360) % 360;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  const letra = (alts, alt) => { const k = alts.indexOf(alt); if (k < 0) throw new Error(`«${alt}» no es alternativa`); return neg('ABCDE'[k]); };

  // ---------- Números de la forma c·√t (c racional, t sin cuadrados): las razones con un r que no es entero ----------
  // sinCuad(N) → [s, t] con N = s²·t. raiz(p, u, q, w) → (p√u)/(q√w) simplificado. txt → «−3√13/13», «4/5», «2».
  function sinCuad(N) { let s = 1, t = N; for (let k = 2; k * k <= t; k++) while (t % (k * k) === 0) { t /= k * k; s *= k; } return [s, t]; }
  function cociente(p, u, q, w) {
    if (q === 0) return null;
    const [s, t] = sinCuad(u * w);
    let num = p * s, den = q * w;
    if (den < 0) { num = -num; den = -den; }
    const m = gcd(num, den) || 1;
    return { n: num / m, d: den / m, t };
  }
  const valorDe = c => (c === null ? null : c.n / c.d * Math.sqrt(c.t));
  function txt(c) {
    if (c === null) return 'no está definida';
    if (c.n === 0) return '0';
    const sg = c.n < 0 ? '−' : '', a = Math.abs(c.n);
    const cuerpo = c.t === 1 ? `${a}` : `${a === 1 ? '' : a}√${c.t}`;
    return `${sg}${cuerpo}${c.d === 1 ? '' : '/' + c.d}`;
  }
  // r de un punto: [entero, 1] si es exacto o [s, t] con r = s√t.
  const radio = (x, y) => sinCuad(x * x + y * y);
  const rTxt = (x, y) => { const [s, t] = radio(x, y); return t === 1 ? `${s}` : `${s === 1 ? '' : s}√${t}`; };
  // Las seis razones de P(x, y), exactas: { num, den } como (p√u)/(q√w).
  function razonDe(fn, x, y) {
    const [s, t] = radio(x, y);
    switch (fn) {
      case 'sen': return cociente(y, 1, s, t);
      case 'cos': return cociente(x, 1, s, t);
      case 'tan': return cociente(y, 1, x, 1);
      case 'cot': return cociente(x, 1, y, 1);
      case 'sec': return cociente(s, t, x, 1);
      case 'csc': return cociente(s, t, y, 1);
      default: throw new Error(`razón desconocida: ${fn}`);
    }
  }
  const NOMBRE = { sen: 'seno', cos: 'coseno', tan: 'tangente', cot: 'cotangente', sec: 'secante', csc: 'cosecante' };
  const RECIPROCA = { sen: 'csc', cos: 'sec', tan: 'cot', cot: 'tan', sec: 'cos', csc: 'sen' };
  const CRUZA = { sen: 'cos', cos: 'sen', tan: 'cot', cot: 'tan', sec: 'csc', csc: 'sec' };
  // Qué va arriba y abajo en cada razón, como nodos de color (x turquesa, y naranja, r en tinta).
  const PARTES = { sen: [Y, R], cos: [X, R], tan: [Y, X], cot: [X, Y], sec: [R, X], csc: [R, Y] };
  const defDe = fn => junto([`${fn} `, th, ' = ', PARTES[fn][0], '/', PARTES[fn][1]]);

  // ---------- Datos (una línea cada uno; herramientas, no el paso hecho) ----------
  const D = {
    def: [junto(['sen θ = ', Y, '/r']), ', ', junto(['cos θ = ', X, '/r']), ' y ', junto(['tan θ = ', Y, '/', X]), ', con P(', X, ', ', Y, ') en el lado final.'],
    rec: [junto(['cot θ = ', X, '/', Y]), ', ', junto(['sec θ = r/', X]), ' y ', junto(['csc θ = r/', Y]), '.'],
    r: ['r = √(', X, '² + ', Y, '²): la distancia de P al origen, siempre positiva.'],
    racio: 'Racionalizar: a/√b = a√b/b.',
    medio: 'Punto medio de AB: el promedio de las coordenadas de A y de B.',
  };

  // ---------- Figuras (pieza trig-pos) ----------
  // Rótulo de r junto al radio vector, del lado contrario al pie de la ordenada (no choca con x ni con y).
  function rotR(x, y, L, texto) {
    const r = Math.hypot(x, y), s = x * y > 0 ? 1 : -1, d = 0.1 * L;
    return { x: x / 2 - s * y / r * d, y: y / 2 + s * x / r * d, texto };
  }
  // El punto P con sus proyecciones x (turquesa) e y (naranja), el radio vector (tinta) y el giro θ (carmín).
  //   o.ventana, o.objeto, o.rot { x, y, r, p }: textos de los rótulos (undefined: sin rótulo), o.giro (grados del arco),
  //   o.sinTramos: sin x ni y (solo el lado final), o.pide: el tramo que se pide va en tinta con «?».
  function figP(x, y, o = {}) {
    const r = Math.hypot(x, y), L = o.L || Math.max(Math.abs(x), Math.abs(y)) * 1.35 + 1;
    const v = o.ventana || { x: [-L, L], y: [-L, L] };
    const ang = o.giro === undefined ? mod360(Math.atan2(y, x) * 180 / Math.PI) : o.giro;
    const rot = o.rot || {}, ancho = Math.min(v.x[1] - v.x[0], v.y[1] - v.y[0]);
    // El rótulo de x va del lado del eje contrario a P (fuera del triángulo); el arco de θ es chico para no pisarlo.
    const flip = x * y < 0 ? 'adentro' : undefined;
    const seg = [], enEje = Math.abs(x) < 1e-9 || Math.abs(y) < 1e-9;
    if (!o.sinTramos) {
      seg.push({ de: [0, 0], a: [x, 0], color: 'i', rotulo: enEje ? undefined : rot.x, lado: flip });
      seg.push({ de: [x, 0], a: [x, y], color: 'o', rotulo: enEje ? undefined : rot.y });
    }
    seg.push({ de: [0, 0], a: [x, y], grosor: 'variable' });
    return {
      ventana: v, numeros: o.numeros === undefined ? 0 : o.numeros, objeto: o.objeto,
      segmentos: seg,
      arcos: ang ? [{ de: 0, a: ang, r: o.rArco || ancho * 0.06, color: 'h', rotulo: o.rotTheta === undefined ? 'θ' : o.rotTheta }] : [],
      puntos: [{ x, y, rotulo: rot.p === undefined ? 'P' : rot.p, lado: o.ladoP || (y >= 0 ? (x >= 0 ? 'ne' : 'no') : (x >= 0 ? 'se' : 'so')) }],
      rotulos: (rot.r && !enEje ? [rotR(x, y, ancho / 2, rot.r)] : []).concat(o.rotulos || []),
      alt: o.alt || `Ángulo θ en posición normal; su lado final pasa por P, con abscisa ${f(x)} y ordenada ${f(y)}, a ${f(r)} del origen`,
    };
  }
  const fig = d => ({ pieza: PZ, datos: d, estado: {} });
  // Ventana justa para P: el origen, P y un margen (enteros, para que las manzanas del pueblo calcen).
  const ventanaDe = (x, y, m = 2) => ({ x: [Math.min(0, x) - m, Math.max(0, x) + m], y: [Math.min(0, y) - m, Math.max(0, y) + m] });

  // ====================================================================================================================
  // Idea 1: las razones salen de P
  // ====================================================================================================================
  // Objeto de la primera pantalla: el plano de un pueblo; la plaza es el origen, cada cuadra una unidad, la casa es P.
  // Cambia: la casa P(x, y). · Permanece: la plaza, las calles (ejes) y la escala. · Progresa: r y el seno y/r.
  // · Se reserva: el coseno (la predicción: P(−8, 6), fuera de la grilla del juego). · Debe verse: la razón es un cociente
  // con signo, no una longitud.
  // Errores: TR12 (el cociente sin el signo), TR11 (cruza x e y), TR7 (la coordenada como razón), TRPN-INVERSA (la
  // recíproca); en los de examen, RN-SIGNO-DATO (toma la coordenada que falta con el signo contrario al dato) y RN-SUMA
  // (suma o resta las razones en otro orden), hipótesis.
  const VJ1 = { x: [-6.6, 7.2], y: [-6, 6.6] };
  const casa = (x, y, o = {}) => figP(x, y, Object.assign({ ventana: VJ1, objeto: { tipo: 'plano', casa: [x, y] } }, o));
  const VP1 = { x: [-15, 3], y: [-3, 8] };
  const casaJ = val => (val.x || val.y
    ? casa(val.x, val.y, { rotTheta: Math.abs(val.x) <= 1 ? '' : 'θ', rot: { x: `x = ${f(val.x)}`, y: `y = ${f(val.y)}`, r: 'r' }, alt: `Plano del pueblo: la casa P está ${Math.abs(val.x)} cuadras al ${val.x < 0 ? 'oeste' : 'este'} y ${Math.abs(val.y)} al ${val.y < 0 ? 'sur' : 'norte'} de la plaza` })
    : { ventana: VJ1, objeto: { tipo: 'plano', casa: [0, 0] }, puntos: [{ x: 0, y: 0, rotulo: 'P' }], alt: 'Plano del pueblo: la casa está en la plaza' });

  // Ejemplos resueltos de la idea 1 (molde §3). Cuentas rehechas con un script aparte que no usa este archivo
  // (scratchpad e8-trigonometria/cuentas.js): cada r con Pitágoras, cada razón como cociente y su racionalización, y el
  // valor de cada alternativa equivocada.
  const ALT1 = {
    falta: ['4/3', '−3/4', '−4/3', '4/5', '−5/3'],
    m: ['−3/5', '4/5', '−4/5', '3/4', '3/5'],
    medio: ['−3/4', '3/5', '4/5', '−4/5', '−5/4'],
    expr: ['5', '−5', '−1/5', '2/3', '7/13'],
    dos: ['−8', '2', '−1', '16', '9'],
  };
  // El plano del pueblo solo donde el enunciado habla de la plaza (pueblo: true); si no, el plano solo.
  const E1 = (x, y, o = {}) => fig(figP(x, y, Object.assign({ objeto: o.pueblo ? { tipo: 'plano', casa: [x, y] } : undefined, ventana: ventanaDe(x, y, Math.max(2, Math.round(Math.max(Math.abs(x), Math.abs(y)) / 4))) }, o, { rot: Object.assign({}, o.rot, { p: 'P' }) })));
  const EJEMPLOS_1 = [
    { nivel: 1, titulo: 'La casa de Ana', figura: E1(3, 4, { pueblo: true }),
      enunciado: 'La casa de Ana está 3 cuadras al este y 4 al norte de la plaza: P(3, 4). θ va de la calle hacia el este a la línea de la plaza a la casa. ¿Cuánto vale sen θ?',
      datos: [D.def, D.r],
      solucion: [{ texto: ['Primero r; después, la ordenada entre r.'], ecuacion: junto(['r = √(3² + 4²) = 5', SEP, 'sen ', th, ' = ', frac(dO('4'), '5'), ' = ', dF('4/5')]) }],
      respuesta: ['sen θ = ', dF('4/5')] },
    { nivel: 1, titulo: 'Un punto a la izquierda', figura: E1(-9, 40, { rot: { p: 'P(−9, 40)' } }),
      enunciado: 'El lado final de θ pasa por P(−9, 40). ¿Cuánto vale cos θ?',
      datos: [D.def, D.r],
      solucion: [{ texto: ['r = √(81 + 1600) = √1681 = 41. El coseno es la abscisa, con su signo, entre r.'], ecuacion: junto(['cos ', th, ' = ', frac(dI('−9'), '41'), ' = ', dF('−9/41')]) }],
      respuesta: ['cos θ = ', dF('−9/41')] },
    { nivel: 1, titulo: 'La tangente, sin r', figura: E1(8, -15, { rot: { p: 'P(8, −15)' } }),
      enunciado: 'El lado final de θ pasa por P(8, −15). ¿Cuánto vale tan θ?',
      datos: [D.def],
      solucion: [{ texto: ['La tangente no usa r: la ordenada entre la abscisa.'], ecuacion: junto(['tan ', th, ' = ', frac(dO('−15'), dI('8')), ' = ', dF('−15/8')]) }],
      respuesta: ['tan θ = ', dF('−15/8')] },
    { nivel: 1, titulo: 'El radio vector', figura: E1(-6, -8, { rot: { p: 'P(−6, −8)', r: 'r = ?' } }),
      enunciado: 'El lado final de θ pasa por P(−6, −8). ¿Cuánto mide su radio vector r?',
      datos: [D.r],
      solucion: [{ texto: ['Los signos se van al elevar al cuadrado: (−6)² = 36 y (−8)² = 64. r es una distancia.'], ecuacion: junto(['r = √(36 + 64) = √100 = 10']) }],
      respuesta: [neg('r = 10')] },
    { nivel: 1, titulo: 'La cotangente', figura: E1(35, -12, { rot: { p: 'P(35, −12)' } }),
      enunciado: 'El lado final de θ pasa por P(35, −12). ¿Cuánto vale cot θ?',
      datos: [D.def, D.rec],
      solucion: [{ texto: ['La cotangente es la recíproca de la tangente: la abscisa entre la ordenada.'], ecuacion: junto(['cot ', th, ' = ', frac(dI('35'), dO('−12')), ' = ', dF('−35/12')]) }],
      respuesta: ['cot θ = ', dF('−35/12')] },
    { nivel: 2, titulo: 'La secante', figura: E1(-20, 21, { rot: { p: 'P(−20, 21)' } }),
      enunciado: 'El lado final de θ pasa por P(−20, 21). ¿Cuánto vale sec θ?',
      datos: [D.def, D.rec, D.r],
      solucion: [
        { texto: ['r con Pitágoras:'], ecuacion: junto(['r = √(400 + 441) = √841 = 29']) },
        { texto: ['La secante es r entre la abscisa; el signo lo pone x.'], ecuacion: junto(['sec ', th, ' = ', frac('29', dI('−20')), ' = ', dF('−29/20')]) },
      ],
      respuesta: ['sec θ = ', dF('−29/20')] },
    { nivel: 2, titulo: 'Un r con raíz', figura: E1(2, -1, { rot: { p: 'P(2, −1)' } }),
      enunciado: 'El lado final de θ pasa por P(2, −1). ¿Cuánto vale sen θ?',
      datos: [D.def, D.r, D.racio],
      solucion: [
        { texto: ['r no es entero:'], ecuacion: junto(['r = √(4 + 1) = √5']) },
        { texto: ['El seno, y después se racionaliza:'], ecuacion: junto(['sen ', th, ' = ', frac(dO('−1'), '√5'), ' = ', frac('−√5', '5'), ' = ', dF('−√5/5')]) },
      ],
      respuesta: ['sen θ = ', dF('−√5/5')] },
    { nivel: 2, titulo: 'Seno más coseno', figura: E1(-24, -7, { rot: { p: 'P(−24, −7)' } }),
      enunciado: 'El lado final de θ pasa por P(−24, −7). ¿Cuánto vale sen θ + cos θ?',
      datos: [D.def, D.r],
      solucion: [
        { texto: ['r = √(576 + 49) = √625 = 25. Las dos razones:'], ecuacion: junto(['sen ', th, ' = ', frac(dO('−7'), '25'), SEP, 'cos ', th, ' = ', frac(dI('−24'), '25')]) },
        { texto: ['Se suman (mismo denominador):'], ecuacion: junto([frac('−7 − 24', '25'), ' = ', dF('−31/25')]) },
      ],
      respuesta: ['sen θ + cos θ = ', dF('−31/25')] },
    { nivel: 2, titulo: 'Dos puntos del mismo lado', figura: fig(Object.assign(figP(-6, 3, { ventana: { x: [-8, 2], y: [-2, 5] }, rot: { p: 'Q(−6, 3)' } }), { puntos: [{ x: -2, y: 1, rotulo: 'P(−2, 1)', lado: 'n' }, { x: -6, y: 3, rotulo: 'Q(−6, 3)', lado: 'no' }] })),
      enunciado: 'El lado final de θ pasa por P(−2, 1) y por Q(−6, 3). ¿Cuánto vale cos θ? Hazlo con Q y compara con P.',
      datos: [D.def, D.r, D.racio],
      solucion: [
        { texto: ['Con Q: r = √(36 + 9) = √45 = 3√5.'], ecuacion: junto(['cos ', th, ' = ', frac(dI('−6'), '3√5'), ' = ', frac('−2', '√5'), ' = ', dF('−2√5/5')]) },
        { texto: ['Con P: r = √5 y el mismo cociente. Q está 3 veces más lejos: x y r crecen juntos.'], ecuacion: junto(['cos ', th, ' = ', frac(dI('−2'), '√5'), ' = ', dF('−2√5/5')]) },
      ],
      respuesta: ['cos θ = ', dF('−2√5/5')] },
    { nivel: 2, titulo: 'La posta del pueblo', figura: E1(-12, -16, { pueblo: true }),
      enunciado: 'La posta está 12 cuadras al oeste y 16 al sur de la plaza. θ va de la calle hacia el este a la línea de la plaza a la posta. ¿Cuánto vale csc θ?',
      datos: [D.def, D.rec, D.r],
      solucion: [
        { texto: ['Al oeste y al sur, las dos coordenadas son negativas: P(−12, −16).'], ecuacion: junto(['r = √(144 + 256) = √400 = 20']) },
        { texto: ['La cosecante es r entre la ordenada:'], ecuacion: junto(['csc ', th, ' = ', frac('20', dO('−16')), ' = ', dF('−5/4')]) },
      ],
      respuesta: ['csc θ = ', dF('−5/4')] },
    // Nivel 3, tipo examen, con cinco alternativas. Letras de las correctas: C, A, D, B, E. Donde la figura tiene puntos con
    // letras (A, B y M), las alternativas se nombran por su valor (decisión de la Etapa 3).
    { nivel: 3, titulo: 'La abscisa que falta', figura: E1(-3, 4, { rot: { p: 'P(a, 4)' } }),
      enunciado: 'El lado final de θ pasa por P(a, 4), con a negativo, y su radio vector mide 5. ¿Cuánto vale tan θ?',
      alternativas: ALT1.falta,
      datos: [D.def, D.r],
      solucion: [
        { texto: ['De r = 5: a² + 16 = 25, a² = 9. Como a es negativo, a = −3.'] },
        { texto: ['La tangente:'], ecuacion: junto(['tan ', th, ' = ', frac(dO('4'), dI('−3')), ' = ', dF('−4/3')]) },
        { texto: ['4/3 toma a = 3; −3/4 es x/y, la cotangente; 4/5 es el seno; −5/3 es r/x, la secante.'] },
      ],
      respuesta: [letra(ALT1.falta, '−4/3'), ', ', dF('−4/3')] },
    { nivel: 3, titulo: 'Las dos coordenadas con m', figura: E1(-4, -3, { rot: { p: 'P(m, m + 1)' } }),
      enunciado: 'El lado final de θ pasa por P(m, m + 1), con m negativo, y su radio vector mide 5. ¿Cuánto vale sen θ?',
      alternativas: ALT1.m,
      datos: [D.def, D.r],
      solucion: [
        { texto: ['r = 5: m² + (m + 1)² = 25, es decir, 2m² + 2m − 24 = 0, o m² + m − 12 = 0. Sus raíces: m = 3 y m = −4.'] },
        { texto: ['Con m negativo, m = −4: P(−4, −3).'], ecuacion: junto(['sen ', th, ' = ', frac(dO('−3'), '5'), ' = ', dF('−3/5')]) },
        { texto: ['4/5 usa m = 3, P(3, 4); −4/5 es el coseno; 3/4 es la tangente; 3/5 olvida el signo de y.'] },
      ],
      respuesta: [letra(ALT1.m, '−3/5'), ', ', dF('−3/5')] },
    { nivel: 3, titulo: 'El punto medio',
      figura: fig(Object.assign(figP(-4, 3, { ventana: { x: [-10, 4], y: [-2, 8] }, rot: { p: 'M' } }), {
        segmentos: [{ de: [-8, 0], a: [0, 6] }, { de: [0, 0], a: [-4, 3], grosor: 'variable' }],
        puntos: [{ x: -8, y: 0, rotulo: 'A(−8, 0)', lado: 's' }, { x: 0, y: 6, rotulo: 'B(0, 6)', lado: 'e' }, { x: -4, y: 3, rotulo: 'M', lado: 'no' }] })),
      enunciado: 'A(−8, 0) y B(0, 6) son los extremos de un segmento y M es su punto medio. El lado final de θ pasa por M. ¿Cuánto vale cos θ?',
      alternativas: ALT1.medio,
      datos: [D.def, D.r, D.medio],
      solucion: [
        { texto: ['M es el promedio:'], ecuacion: junto(['M = (', frac('−8 + 0', '2'), ', ', frac('0 + 6', '2'), ') = (−4, 3)']) },
        { texto: ['r = √(16 + 9) = 5:'], ecuacion: junto(['cos ', th, ' = ', frac(dI('−4'), '5'), ' = ', dF('−4/5')]) },
        { texto: ['−3/4 es la tangente; 3/5 es el seno; 4/5 olvida el signo de x; −5/4 es la secante.'] },
      ],
      respuesta: [dF('−4/5')] },
    { nivel: 3, titulo: 'Secante más tangente', figura: E1(-5, 12, { rot: { p: 'P(−5, 12)' } }),
      enunciado: 'El lado final de θ pasa por P(−5, 12). Calcula E = sec θ + tan θ.',
      alternativas: ALT1.expr,
      datos: [D.def, D.rec, D.r],
      solucion: [
        { texto: ['r = √(25 + 144) = 13. Las dos razones tienen el mismo denominador, la abscisa:'], ecuacion: junto(['sec ', th, ' = ', frac('13', dI('−5')), SEP, 'tan ', th, ' = ', frac(dO('12'), dI('−5'))]) },
        { texto: ['Se suman:'], ecuacion: junto(['E = ', frac('13 + 12', '−5'), ' = ', frac('25', '−5'), ' = ', dF('−5')]) },
        { texto: ['5 olvida el signo de x; −1/5 resta, sec θ − tan θ; 2/3 es csc θ + cot θ; 7/13 suma cos θ y sen θ.'] },
      ],
      respuesta: [letra(ALT1.expr, '−5'), ', ', dF('−5')] },
    { nivel: 3, titulo: 'Dos ángulos, dos puntos', figura: fig(Object.assign(figP(-3, 4, { ventana: { x: [-6, 8], y: [-14, 6] }, sinTramos: true, rot: { p: 'P(−3, 4)' } }), {
        segmentos: [{ de: [0, 0], a: [-3, 4], grosor: 'variable' }, { de: [0, 0], a: [5, -12], grosor: 'variable' }],
        arcos: [{ de: 0, a: 126.87, r: 1.4, color: 'h', rotulo: 'θ' }, { de: 0, a: 292.62, r: 2.6, color: 'h', rotulo: 'α' }],
        puntos: [{ x: -3, y: 4, rotulo: 'P(−3, 4)', lado: 'no' }, { x: 5, y: -12, rotulo: 'Q(5, −12)', lado: 'e' }],
        alt: 'Dos ángulos en posición normal: el lado final de θ pasa por P(−3, 4) y el de α por Q(5, −12)' })),
      enunciado: 'El lado final de θ pasa por P(−3, 4) y el de α, por Q(5, −12). Calcula E = 5 sen θ + 13 cos α.',
      alternativas: ALT1.dos,
      datos: [D.def, D.r],
      solucion: [
        { texto: ['Para θ, r = 5; para α, r = 13.'], ecuacion: junto(['sen ', th, ' = ', frac(dO('4'), '5'), SEP, 'cos ', al, ' = ', frac(dI('5'), '13')]) },
        { texto: ['Se reemplaza:'], ecuacion: junto(['E = 5 · ', frac('4', '5'), ' + 13 · ', frac('5', '13'), ' = 4 + 5 = ', dF('9')]) },
        { texto: ['−8 usa sen α; 2 usa cos θ = −3/5; −1 le pone un menos a cos α; 16 suma 4 y 12, sen α sin signo.'] },
      ],
      respuesta: [letra(ALT1.dos, '9'), ', ', dF('9')] },
  ];

  // «Ahora tú» de la idea 1: tres tipos (una razón de P, una expresión con recíprocas y la coordenada que falta).
  const TERNAS = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [6, 8, 10], [9, 12, 15], [12, 16, 20]];
  // Opciones distintas: la correcta primero; los distractores que repiten un texto se descartan.
  function opciones(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) {
      if (!d || !d.texto || vistos.has(d.texto)) continue;
      vistos.add(d.texto);
      ops.push({ id: d.id, texto: d.texto, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Un punto de una terna pitagórica con signos y orden al azar (fuera de los ejes).
  function puntoTerna(rr) {
    const [a, b] = rr.uno(TERNAS), swap = rr.ent(0, 1);
    return [(rr.ent(0, 1) ? 1 : -1) * (swap ? b : a), (rr.ent(0, 1) ? 1 : -1) * (swap ? a : b)];
  }
  // El rótulo del punto es solo «P» (sus coordenadas ya están en el enunciado): uno largo no cabe junto al borde.
  const casoFig = (x, y, rotP, extra = {}) => fig(figP(x, y, Object.assign({ ventana: ventanaDe(x, y, Math.max(2, Math.round(Math.max(Math.abs(x), Math.abs(y)) / 4))), rot: { p: 'P' } }, extra)));
  function casoRazon(rr) {
    const [x, y] = puntoTerna(rr), fn = rr.uno(['sen', 'cos', 'tan', 'cot', 'sec', 'csc']);
    const ok = txt(razonDe(fn, x, y)), ab = txt(razonDe(fn, Math.abs(x), Math.abs(y)));
    const usaR = !['tan', 'cot'].includes(fn);
    const coord = { sen: y, csc: y, cos: x, sec: x }[fn];
    return {
      pregunta: `El lado final de θ pasa por P(${f(x)}, ${f(y)}). ¿Cuánto vale ${fn} θ?`,
      datos: [D.def].concat(['cot', 'sec', 'csc'].includes(fn) ? [D.rec] : [], usaR ? [D.r] : []),
      dibujo: casoFig(x, y, `P(${f(x)}, ${f(y)})`),
      opciones: opciones(ok, [
        { id: 'sin-signo', texto: ab, error: 'TR12', siFuera: `El tamaño del cociente está bien; falta el signo de P: sin él sale ${ab}.` },
        { id: 'inversa', texto: txt(razonDe(RECIPROCA[fn], x, y)), error: 'TRPN-INVERSA', siFuera: `Los números están bien, pero ${txt(razonDe(RECIPROCA[fn], x, y))} va al revés: es la ${NOMBRE[RECIPROCA[fn]]}.` },
        { id: 'cruza', texto: txt(razonDe(CRUZA[fn], x, y)), error: 'TR11', siFuera: `Usar un cociente está bien, pero ${txt(razonDe(CRUZA[fn], x, y))} cambia x por y: es la ${NOMBRE[CRUZA[fn]]}.` },
        usaR && coord !== undefined && ['sen', 'cos'].includes(fn) ? { id: 'longitud', texto: f(coord), error: 'TR7', siFuera: `${f(coord)} es la coordenada de P, bien leída; el ${NOMBRE[fn]} la divide entre r = ${rTxt(x, y)}.` } : null,
      ]),
      solucion: { texto: `r = ${rTxt(x, y)}; ${fn} θ = ${PARTES[fn][0].t || PARTES[fn][0]}/${PARTES[fn][1].t || PARTES[fn][1]}, con los signos de P.`, ecuacion: [defDe(fn), ' = ', dF(ok)] },
    };
  }
  // E = sec θ ± tan θ o csc θ ± cot θ: los dos cocientes comparten el denominador.
  const EXPR = {
    'sec θ + tan θ': (x, y, r) => cociente(r + y, 1, x, 1), 'sec θ − tan θ': (x, y, r) => cociente(r - y, 1, x, 1),
    'csc θ + cot θ': (x, y, r) => cociente(r + x, 1, y, 1), 'csc θ − cot θ': (x, y, r) => cociente(r - x, 1, y, 1),
  };
  const OTRA = { 'sec θ + tan θ': 'sec θ − tan θ', 'sec θ − tan θ': 'sec θ + tan θ', 'csc θ + cot θ': 'csc θ − cot θ', 'csc θ − cot θ': 'csc θ + cot θ' };
  function casoExpresion(rr) {
    for (let i = 0; i < 40; i++) {
      const [x, y] = puntoTerna(rr), r = Math.hypot(x, y), e = rr.uno(Object.keys(EXPR));
      const ok = EXPR[e](x, y, r);
      if (!ok || ok.n === 0) continue;
      const ab = EXPR[e](Math.abs(x), Math.abs(y), r), otra = EXPR[OTRA[e]](x, y, r), inv = cociente(ok.d, 1, ok.n, 1);
      const conSen = e.startsWith('sec') ? cociente(x + y, 1, r, 1) : cociente(y + x, 1, r, 1);
      return {
        pregunta: `El lado final de θ pasa por P(${f(x)}, ${f(y)}). Calcula E = ${e}.`,
        datos: [D.def, D.rec, D.r],
        dibujo: casoFig(x, y, `P(${f(x)}, ${f(y)})`),
        opciones: opciones(txt(ok), [
          { id: 'sin-signo', texto: txt(ab), error: 'TR12', siFuera: `Las razones están bien elegidas; faltan los signos de P: sin ellos sale ${txt(ab)}.` },
          { id: 'otra', texto: txt(otra), error: 'RN-SUMA', siFuera: `Los cocientes están bien; pero ${txt(otra)} es ${OTRA[e]}: aquí E = ${e}.` },
          { id: 'inversa', texto: txt(inv), error: 'TRPN-INVERSA', siFuera: `La suma de los cocientes está bien; ${txt(inv)} la da vuelta: el denominador común es el de abajo.` },
          { id: 'cos-sen', texto: txt(conSen), error: 'TR11', siFuera: `Sumar dos razones está bien; ${txt(conSen)} suma sen θ y cos θ, no las de E.` },
        ]),
        solucion: { texto: `r = ${f(r)}. Las dos razones de E comparten el denominador ${e.startsWith('sec') ? 'x' : 'y'}: se suman los numeradores.`, ecuacion: junto(['E = ', dF(txt(ok))]) },
      };
    }
    throw new Error('casoExpresion: sin caso');
  }
  function casoFalta(rr) {
    const [x, y] = puntoTerna(rr), r = Math.hypot(x, y), falta = rr.ent(0, 1) ? 'x' : 'y';
    const fn = falta === 'x' ? rr.uno(['cos', 'tan']) : rr.uno(['sen', 'cot']);
    const signo = (falta === 'x' ? x : y) < 0 ? 'negativa' : 'positiva';
    const P = falta === 'x' ? `P(a, ${f(y)})` : `P(${f(x)}, a)`;
    const [x2, y2] = falta === 'x' ? [-x, y] : [x, -y];
    const ok = txt(razonDe(fn, x, y));
    return {
      pregunta: `El lado final de θ pasa por ${P}, con a ${signo === 'negativa' ? 'negativo' : 'positivo'}, y su radio vector mide ${f(r)}. ¿Cuánto vale ${fn} θ?`,
      datos: [D.def].concat(fn === 'cot' ? [D.rec] : [], [D.r]),
      dibujo: casoFig(x, y, P),
      opciones: opciones(ok, [
        { id: 'signo-dato', texto: txt(razonDe(fn, x2, y2)), error: 'RN-SIGNO-DATO', siFuera: `a² = ${f(r * r - (falta === 'x' ? y * y : x * x))} está bien; pero a es ${signo === 'negativa' ? 'negativo' : 'positivo'}: con el otro signo sale ${txt(razonDe(fn, x2, y2))}.` },
        { id: 'inversa', texto: txt(razonDe(RECIPROCA[fn], x, y)), error: 'TRPN-INVERSA', siFuera: `a está bien; ${txt(razonDe(RECIPROCA[fn], x, y))} es el cociente al revés, ${NOMBRE[RECIPROCA[fn]]}.` },
        { id: 'cruza', texto: txt(razonDe(CRUZA[fn], x, y)), error: 'TR11', siFuera: `a está bien; ${txt(razonDe(CRUZA[fn], x, y))} cambia x por y: es ${NOMBRE[CRUZA[fn]]}.` },
        { id: 'sin-signo', texto: txt(razonDe(fn, Math.abs(x), Math.abs(y))), error: 'TR12', siFuera: `El tamaño está bien; faltan los signos de P: sin ellos sale ${txt(razonDe(fn, Math.abs(x), Math.abs(y)))}.` },
      ]),
      solucion: { texto: `De r = ${f(r)}: a² = ${f(r * r)} − ${f(falta === 'x' ? y * y : x * x)} = ${f(r * r - (falta === 'x' ? y * y : x * x))}; con su signo, a = ${f(falta === 'x' ? x : y)}.`, ecuacion: [defDe(fn), ' = ', dF(ok)] },
    };
  }
  // «Ahora tú» no repite un ejemplo ni la predicción de su idea: si un caso sale con los mismos números, se arma otro.
  // Dos casos son el mismo si tienen los mismos números (sin contar los 0 de «> 0»); sin números, si dicen lo mismo.
  const firma = t => { const p = Kit.plano(t).replace(/\u00a0/g, ' '), ns = (p.match(/\d+(?:,\d+)?/g) || []).filter(x => x !== '0'); return ns.length ? ns.sort().join('|') : p.replace(/\s+/g, ' ').trim(); };
  function sinRepetir(caso, sem, idea) {
    const previos = new Set((idea.ejemplos || []).map(e => firma(e.enunciado)).concat([firma(idea.predice.pregunta)]));
    for (let i = 0; i < 80; i++) { const c = conCuatro(caso, azar(sem * 7 + 17 + i * 7919)); const k = firma(c.pregunta); if (k === '' || !previos.has(k)) return c; }
    throw new Error(`${caso.name}: no salió un caso distinto de los ejemplos`);
  }
  function conCuatro(caso, rr) {
    for (let i = 0; i < 80; i++) { const c = caso(rr); if (c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  // «Así se resuelve»: un r que no es entero (se racionaliza). «Ahora tú» usa ternas pitagóricas: no se repiten.
  const RES1 = [[2, -3], [-1, 2], [-3, -1], [1, 3], [-2, 3], [3, -2], [-1, -3], [4, 1], [-4, 1], [1, -4]];

  const razones = {
    id: 'razones-coordenadas',
    titulo: 'Las razones salen de P',
    pregunta: '¿Cómo se calculan las razones de un ángulo que no está dentro de un triángulo?',
    temas: ['Razones de un ángulo en posición normal'],
    pieza: PZ,
    aprendizaje: 'Las razones salen de P(x, y) y de r: sen θ = y/r, cos θ = x/r, tan θ = y/x.',
    actividad: 'Mover una casa por el plano del pueblo y ver cuánto se aleja de la plaza.',
    // Lee: el objeto, la posición normal y los tres números de P. No dice cómo se arma el coseno (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El plano del pueblo', texto: 'En el plano de un pueblo, la plaza está en el centro y las dos calles principales se cruzan en ella. Cada cuadra mide lo mismo: es la unidad. La casa de la figura está 2 cuadras al este y 3 al norte.',
          pieza: PZ, dibujo: { datos: { ventana: { x: [-5, 5], y: [-5, 5] }, objeto: { tipo: 'plano', casa: [2, 3] }, puntos: [{ x: 2, y: 3, rotulo: 'casa', lado: 'ne' }], rotulos: [{ x: -1.6, y: -1.1, texto: 'plaza' }], alt: 'Plano de un pueblo con la plaza en el centro y una casa 2 cuadras al este y 3 al norte' }, estado: {} } },
        { titulo: 'Un ángulo en posición normal', texto: 'Un ángulo está en posición normal si su vértice está en el origen (la plaza) y su lado inicial va por el eje x positivo (la calle hacia el este). Gira hasta su lado final: aquí, la línea recta de la plaza a la casa.' },
        { titulo: 'Tres números de P', texto: ['La casa es un punto P del lado final. Su abscisa ', X, ' dice cuántas cuadras está al este (+) o al oeste (−); su ordenada ', Y, ', al norte (+) o al sur (−). Su radio vector r es la distancia en línea recta a la plaza, por Pitágoras.'],
          ecuacion: junto(['r = ', { raiz: [{ sup: [X, '2'] }, ' + ', { sup: [Y, '2'] }] }]) },
        { titulo: 'Qué mirar al jugar', texto: ['Lleva la casa a distintos lugares. Mira el signo de ', X, ' y de ', Y, ', cuánto mide r y qué cociente da la lectura para el seno.'] },
      ],
    },
    ejemplos: EJEMPLOS_1,
    juega: {
      consigna: ['La plaza es el origen. ', th, ' empieza en la calle al este (eje x positivo) y gira antihorario hasta la casa P.'],
      mision: {
        texto: 'Pon la casa al oeste, con r = 5 cuadras y sen θ = 4/5.',
        logrado: val => val.x === -3 && val.y === 4,
        bien: 'Listo: r = √(9 + 16) = 5 y sen θ = y/r = 4/5.',
      },
      voz: '¿Qué coordenada de la casa usa el seno?',
      leyenda: [
        { s: th, t: 'giro antihorario desde la calle al este' },
        { s: X, t: 'cuadras al este (+) o al oeste (−)' },
        { s: Y, t: 'cuadras al norte (+) o al sur (−)' },
        { s: 'r', t: 'distancia en línea recta a la plaza' },
        { s: 'P', t: 'la casa' },
      ],
      controles: [
        { id: 'x', etiqueta: 'x, al este', color: 'c-i', min: -4, max: 4, paso: 1, inicio: 4, decimales: 0 },
        { id: 'y', etiqueta: 'y, al norte', color: 'c-o', min: -4, max: 4, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: val => ({ datos: casaJ(val), estado: {} }),
      lectura: val => {
        if (!val.x && !val.y) return ['La casa está en la plaza: no hay lado final.'];
        const r2 = val.x * val.x + val.y * val.y, rt = rTxt(val.x, val.y), exacto = Number.isInteger(Math.sqrt(r2));
        const sen = txt(razonDe('sen', val.x, val.y));
        return junto(exacto ? ['r = √(', String(val.x * val.x), ' + ', String(val.y * val.y), ') = ', rt, '; sen ', th, ' = ', Y, '/r = ', sen]
          : ['r = ', rt, '; sen ', th, ' = ', Y, '/r = ', `${f(val.y)}/${rt}`, ` ≈ ${f(val.y / Math.sqrt(r2))}`]);
      },
      minimo: 3,
      // Se arrastra la casa por la cuadrícula: x, y, r y el giro θ la siguen.
      arrastres: [{ id: 'punto-p', etiqueta: 'la casa P',
        donde: val => TP().enPx(casaJ(val), val.x, val.y),
        mover: (pt, val) => { const q = TP().delPx(casaJ(val), pt); return { x: Math.max(-4, Math.min(4, Math.round(q.x))), y: Math.max(-4, Math.min(4, Math.round(q.y))) }; } }],
    },
    predice: {
      pregunta: 'La casa de Luis está en P(−12, 5): 12 cuadras al oeste y 5 al norte de la plaza. ¿Cuánto vale cos θ?',
      datos: ['P(−12, 5): x = −12, y = 5.', 'r = 13 cuadras.'],
      voz: 'El juego te dio el seno; ahora se pide el coseno.',
      opciones: [
        { id: 'c', texto: '−12/13', correcta: true },
        { id: 'sin-signo', texto: '12/13', error: 'TR12', siFuera: 'Dividir 12 entre 13 está bien; pero la casa está al oeste: x es negativa, y el coseno también.' },
        { id: 'cruza', texto: '5/13', error: 'TR11', siFuera: '5/13 es un cociente bien hecho, pero con la ordenada: ese es el seno.' },
        { id: 'longitud', texto: '−12', error: 'TR7', siFuera: '−12 es la abscisa, bien leída; el coseno la divide entre r = 13.' },
      ],
      dibujo: { datos: casa(-12, 5, { ventana: VP1, ladoP: 'n', rot: { p: 'P(−12, 5)', r: 'r = 13' } }), estado: {} },
      revelar: { datos: casa(-12, 5, { ventana: VP1, ladoP: 'n', rot: { p: 'P(−12, 5)', r: 'r = 13', x: 'x = −12', y: 'y = 5' } }), estado: {} },
      coincide: 'Coincide: cos θ = x/r = −12/13.',
      noCoincide: 'Revisemos: desde θ, la abscisa es el cateto adyacente, con su signo.',
    },
    // «Mira» arma la figura del juego con el P(−12, 5) de la predicción.
    mira: {
      datos: Object.assign(casa(-12, 5, { ventana: VP1, ladoP: 'n', rot: { p: 'P(−12, 5)' } }), {
        segmentos: [
          { de: [0, 0], a: [-12, 0], color: 'i', rotulo: 'x = −12', lado: 'adentro', desde: 1 },
          { de: [-12, 0], a: [-12, 5], color: 'o', rotulo: 'y = 5', desde: 1 },
          { de: [0, 0], a: [-12, 5], grosor: 'variable', desde: 0 },
        ],
        rotulos: [Object.assign(rotR(-12, 5, 8, 'r = 13'), { desde: 2 })],
        alt: 'Plano del pueblo con la casa en P(−12, 5): x = −12, y = 5 y r = 13',
      }),
      voz: 'Primero las coordenadas, con su signo; después, los cocientes.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El lado final va de la plaza a la casa, en P(−12, 5).', ecuacion: ['P(−12, 5)'] },
        { estado: { corte: 1 }, texto: 'Llevan signo: al oeste, x < 0; al norte, y > 0.', ecuacion: junto([X, ' = −12', SEP, Y, ' = 5']) },
        { estado: { corte: 2 }, texto: 'El radio vector es una distancia: siempre positivo.', ecuacion: junto(['r = √((−12)² + 5²) = √169 = 13']) },
        { estado: { corte: 2 }, texto: 'El coseno divide la abscisa entre r, como el adyacente entre la hipotenusa.', ecuacion: junto(['cos ', th, ' = ', frac(X, 'r'), ' = ', frac('−12', '13'), ' = ', dF('−12/13')]) },
        { estado: { corte: 2 }, texto: 'El seno, la ordenada; la tangente, y entre x.', ecuacion: junto(['sen ', th, ' = ', frac('5', '13'), SEP, 'tan ', th, ' = ', frac('5', '−12'), ' = −', frac('5', '12')]) },
      ],
    },
    regla: {
      texto: 'Con P(x, y) en el lado final y su radio vector r = √(x² + y²), siempre positivo, cada razón es un cociente: el signo lo ponen x e y.',
      ecuacion: [junto(['r = ', { raiz: [{ sup: [X, '2'] }, ' + ', { sup: [Y, '2'] }] }, ' > 0']), SEP, junto(['sen ', th, ' = ', frac(Y, 'r')]), SEP, junto(['cos ', th, ' = ', frac(X, 'r')]), SEP, junto(['tan ', th, ' = ', frac(Y, X)]),
        SEP, junto(['cot ', th, ' = ', frac(X, Y)]), SEP, junto(['sec ', th, ' = ', frac('r', X)]), SEP, junto(['csc ', th, ' = ', frac('r', Y)])],
      condicion: 'P fuera del origen. Con x = 0, tan y sec no están definidas; con y = 0, cot y csc.',
      voz: 'Es el triángulo de siempre, con signo: x, el adyacente, e y, el opuesto, pueden ser negativos; r, nunca.',
      dibujo: { pieza: PZ, datos: figP(-3, 2, { ventana: { x: [-4.5, 1.5], y: [-1, 3] }, rot: { x: 'x', y: 'y', r: 'r', p: 'P(x, y)' }, rArco: 0.45 }), estado: {} },
    },
    resuelve: {
      generar(sem) {
        const [x, y] = RES1[((sem % RES1.length) + RES1.length) % RES1.length], fn = sem % 2 ? 'sen' : 'cos';
        const [s, t] = radio(x, y), ok = txt(razonDe(fn, x, y)), c = fn === 'sen' ? y : x;
        return {
          enunciado: `El lado final de θ pasa por P(${f(x)}, ${f(y)}). ¿Cuánto vale ${fn} θ?`,
          datos: [D.def, D.r, D.racio],
          dibujo: casoFig(x, y, `P(${f(x)}, ${f(y)})`),
          pasos: [
            { tipo: 'pide', texto: [`Piden ${fn} θ, una razón del ángulo cuyo lado final pasa por P.`] },
            { tipo: 'datos', texto: ['Las coordenadas de P, con su signo:'], ecuacion: junto([X, ` = ${f(x)}`, SEP, Y, ` = ${f(y)}`]) },
            { tipo: 'regla', texto: [`El ${NOMBRE[fn]} es ${fn === 'sen' ? 'la ordenada' : 'la abscisa'} entre r; r siempre es positivo.`], ecuacion: [defDe(fn)] },
            { tipo: 'cuentas', texto: ['r no sale entero; el cociente se racionaliza.'],
              ecuacion: junto(['r = √(', String(x * x), ' + ', String(y * y), ') = ', `${s === 1 ? '' : s}√${t}`, SEP, `${fn} `, th, ' = ', frac(fn === 'sen' ? dO(f(c)) : dI(f(c)), `√${x * x + y * y}`), ' = ', dF(ok)]),
              dibujo: casoFig(x, y, `P(${f(x)}, ${f(y)})`, { rot: { p: `P(${f(x)}, ${f(y)})`, r: `r = √${x * x + y * y}` } }) },
            { tipo: 'sentido', texto: [`El signo es el de ${fn === 'sen' ? 'y' : 'x'}, que es ${c < 0 ? 'negativa' : 'positiva'}; y el tamaño es menor que 1, porque un cateto no pasa de la hipotenusa.`] },
          ],
          respuesta: [`${fn} θ = `, dF(ok)],
        };
      },
    },
    ahoraTu: {
      voz: 'Calcula r y elige qué coordenada va arriba.',
      generar(sem) { return sinRepetir([casoRazon, casoExpresion, casoFalta][((sem % 3) + 3) % 3], sem, razones); },
    },
  };

  // ---------- Ayudas de las ideas 2 a 5 ----------
  const ROM = ['sobre un eje', 'I', 'II', 'III', 'IV'];
  const cuadDe = g => { const m = mod360(g); return m % 90 === 0 ? 0 : Math.ceil(m / 90); };
  const SIG = { 1: [1, 1], 2: [-1, 1], 3: [-1, -1], 4: [1, -1] };   // [signo de x, signo de y]
  const signoDe = (fn, q) => { const [sx, sy] = SIG[q]; return { sen: sy, csc: sy, cos: sx, sec: sx, tan: sx * sy, cot: sx * sy }[fn]; };
  const sgTxt = s => (s > 0 ? '+' : '−');
  const sgPal = s => (s > 0 ? 'positivo' : 'negativo');
  const gTxt = g => `${f(g)}°`;
  // Los grados van sin espacio de miles («1230°», como en el examen; decisión 17 de la Etapa 5).
  const fa = g => (Number.isInteger(g) ? String(g).replace('-', '−') : f(g));
  // El punto de un ángulo cuadrantal con r = a: sus coordenadas, en enteros −1, 0 o 1.
  const ejeDe = g => { const m = mod360(g); return { 0: [1, 0], 90: [0, 1], 180: [-1, 0], 270: [0, -1] }[m]; };
  // Una razón de un cuadrantal: '0', '1', '−1' o null (no está definida).
  function valorEje(fn, g) {
    const [x, y] = ejeDe(g), [p, q] = { sen: [y, 1], cos: [x, 1], tan: [y, x], cot: [x, y], sec: [1, x], csc: [1, y] }[fn];
    return q === 0 ? null : p / q;
  }
  const ejeTxt = v => (v === null ? 'no está definida' : v === 0 ? '0' : v > 0 ? '1' : '−1');
  // Fracción de enteros como texto: «−7/5», «2», «0».
  const fr = (p, q) => txt(cociente(p, 1, q, 1));
  const DC = {
    cuad: 'Cuadrantes: I (x > 0, y > 0), II (x < 0, y > 0), III (x < 0, y < 0) y IV (x > 0, y < 0).',
    eje: 'Sobre los ejes, con r = a: 0° da (a, 0); 90°, (0, a); 180°, (−a, 0); 270°, (0, −a).',
    cero: 'Entre 0 no se divide: a/0 no da ningún número.',
    neg: 'Un ángulo negativo gira en sentido horario desde el eje x positivo.',
    vuelta: 'Una vuelta mide 360°; un cuarto de vuelta, 90°.',
    reloj: 'Entre dos números seguidos del reloj hay 30°.',
    cot: 'Coterminales: α − β = 360° · n, con n entero.',
    not: 'sen 30° = 1/2, cos 60° = 1/2 y tan 45° = 1.',
  };
  // Plano con los cuatro cuadrantes rotulados, sin ángulo (para los ejercicios de signos sin figura propia).
  const planoCuad = (extra = {}) => Object.assign({ ventana: { x: [-5, 5], y: [-5, 5] },
    rotulos: [{ x: 3, y: 3, texto: 'I' }, { x: -3, y: 3, texto: 'II' }, { x: -3, y: -3, texto: 'III' }, { x: 3, y: -3, texto: 'IV' }],
    alt: 'Plano con los cuatro cuadrantes: I arriba a la derecha, II arriba a la izquierda, III abajo a la izquierda y IV abajo a la derecha' }, extra);
  // El plano con los cuadrantes y el ángulo escrito, sin dibujar su lado final (cuando lo que se pide es dónde termina).
  const planoPide = texto => planoCuad({ rotulos: planoCuad().rotulos.concat([{ x: 2.6, y: -4.6, texto }]), alt: `Plano con los cuatro cuadrantes; ${texto}, sin su lado final dibujado` });
  // Los ángulos de un ejercicio que caen sobre los ejes, marcados en su eje (cierre, lector B: el plano vacío no ayudaba).
  // No dice ningún valor: solo dónde cae cada ángulo, que es el paso que el alumno ya hace con los Datos.
  function planoEjes(angs) {
    const por = new Map();
    for (const g of angs) { const m = mod360(g); por.set(m, (por.get(m) || []).concat(por.get(m) && por.get(m).includes(g) ? [] : [g])); }
    const pos = { 0: [3, 0, 'n'], 90: [0, 3, 'e'], 180: [-3, 0, 'n'], 270: [0, -3, 'e'] };
    const puntos = [...por].map(([m, gs]) => ({ x: pos[m][0], y: pos[m][1], rotulo: gs.map(fa).join('° y ') + '°', lado: pos[m][2] }));
    return { ventana: { x: [-5, 5], y: [-5, 5] }, puntos,
      alt: `Plano con los ángulos del ejercicio sobre los ejes: ${puntos.map(q => `${q.rotulo} en (${f(q.x)}, ${f(q.y)})`).join('; ')}` };
  }
  // El plano con los cuartos de vuelta del giro horario marcados en los ejes (sin el ángulo del ejercicio).
  const planoNeg = () => planoCuad({ puntos: [{ x: 0, y: -4, rotulo: '−90°', lado: 'e' }, { x: -4, y: 0, rotulo: '−180°', lado: 'n' }, { x: 0, y: 4, rotulo: '−270°', lado: 'e' }, { x: 4, y: 0, rotulo: '−360°', lado: 'n' }],
    alt: 'Plano con los cuatro cuadrantes y los cuartos de vuelta horarios: −90° abajo, −180° a la izquierda, −270° arriba y −360° a la derecha' });
  // Un giro θ (con vueltas o negativo) con su lado final de largo L; sin tramos x e y.
  function figGiro(g, o = {}) {
    const L = o.L || 4, x = L * Math.cos(rad(g)), y = L * Math.sin(rad(g)), V = o.V || L * 1.35;
    return {
      ventana: { x: [-V, V], y: [-V, V] }, objeto: o.objeto,
      rayos: [{ ang: 0, largo: L, grosor: 'contorno', discontinua: true, punta: false }],
      segmentos: (o.tramos ? [{ de: [0, 0], a: [x, 0], color: 'i', rotulo: o.rotX, lado: x * y < 0 ? 'adentro' : undefined }, { de: [x, 0], a: [x, y], color: 'o', rotulo: o.rotY }] : [])
        .concat(o.sinLado ? [] : [{ de: [0, 0], a: [x, y], grosor: 'variable' }]),
      arcos: o.sinArco || !g ? [] : [{ de: 0, a: g, r: o.rArco || L * 0.22, espiral: o.espiral === undefined ? 7 : o.espiral, color: 'h', rotulo: o.rotTheta === undefined ? 'θ' : o.rotTheta }],
      puntos: o.sinLado ? [] : [{ x, y, rotulo: o.rotP === undefined ? 'P' : o.rotP, lado: o.ladoP || (y >= -1e-9 ? (x >= -1e-9 ? 'ne' : 'no') : (x >= 0 ? 'se' : 'so')) }],
      rotulos: o.rotulos || [],
      alt: o.alt || `Giro θ de ${f(g)} grados en posición normal`,
    };
  }

  // ====================================================================================================================
  // Idea 2: el signo sale de x e y
  // ====================================================================================================================
  // Objeto de la primera pantalla: una rueda de la fortuna; el centro es el origen y la cabina, P.
  // Cambia: el giro θ de 0° a 360°, de 45° en 45°. · Permanece: la rueda (r fijo) y los cuatro cuadrantes. · Progresa: a
  // qué lado del centro queda la cabina. · Se reserva: el signo de la tangente en el III (la predicción; la lectura solo da
  // el seno y el coseno). · Debe verse: cada signo sale de una coordenada.
  // Errores: TRPN-TODO-NEG (en el III todo es negativo), TRPN-COPIA-SEN (la tangente copia el signo del seno), TR12 (los
  // signos se anulan), TR11 (cruza x e y); RN-UNA-CONDICION (mira una sola de dos condiciones) y RN-RAIZ (la coordenada
  // que falta con el signo de otro cuadrante, la trampa de San Marcos 2026-II), hipótesis.
  const RR = 10;
  function rueda(g, o = {}) {
    const x = RR * Math.cos(rad(g)), y = RR * Math.sin(rad(g)), q = cuadDe(g), ve = Math.abs(x) > 1e-6 && Math.abs(y) > 1e-6;
    // El rótulo de x va lejos del centro y del lado contrario a P (cierre): en la mitad del tramo lo cruzaban el arco de θ
    // o el lado final.
    const rotX = ve && !o.sinTramos && o.signos !== false ? [{ x: 0.72 * x, y: y < 0 ? 1.1 : -2.1, texto: x > 0 ? 'x > 0' : 'x < 0', color: 'i' }] : [];
    const extra = Object.assign({}, o.extra || {});
    const rotulos = (extra.rotulos || (o.romanos === false ? [] : [{ x: 12, y: 12.3, texto: 'I' }, { x: -12, y: 12.3, texto: 'II' }, { x: -12, y: -12.8, texto: 'III' }, { x: 12, y: -12.8, texto: 'IV' }])).concat(rotX);
    delete extra.rotulos;
    return Object.assign({
      ventana: { x: [-14, 14], y: [-14, 14] }, objeto: { tipo: 'rueda', r: RR, cabina: g },
      segmentos: (ve && !o.sinTramos ? [{ de: [0, 0], a: [x, 0], color: 'i' },
        { de: [x, 0], a: [x, y], color: 'o', rotulo: o.signos === false ? undefined : (y > 0 ? 'y > 0' : 'y < 0') }] : []).concat([{ de: [0, 0], a: [x, y], grosor: 'variable' }]),
      arcos: g ? [{ de: 0, a: g, r: 1.3, color: 'h', rotulo: 'θ' }] : [],
      puntos: [{ x, y, rotulo: 'P', lado: y >= -1e-9 ? (x >= -1e-9 ? 'ne' : 'no') : (x >= 0 ? 'se' : 'so') }],
      rotulos,
      alt: `Rueda de la fortuna: la cabina P a ${f(g)} grados, ${q ? 'en el cuadrante ' + ROM[q] : 'sobre un eje'}`,
    }, extra);
  }
  // Ejemplos resueltos de la idea 2. Cuentas rehechas en el scratchpad (e8-trigonometria/cuentas.js): el cuadrante de
  // cada ángulo, el signo de cada razón como signo de x, de y o de y/x, y cada razón con el P armado.
  const ALT2 = {
    tan3: ['7/5', '−7/5', '−1/5', '1/5', '12/25'],
    raiz: ['1', '−3', '3', '−1', '−√5/5'],
    signo: ['Negativo', 'Positivo', 'Cero', 'No se sabe sin calcular', 'Depende de r'],
    tan2: ['2√5/5', '−√5/2', '−2/3', '−3√5/5', '−2√5/5'],
    dos: ['1/3', '7/6', '−7/6', '−1/3', '−63/20'],
  };
  const E2 = g => fig(rueda(g, { signos: false }));
  const EJEMPLOS_2 = [
    { nivel: 1, titulo: 'La cabina en 200°', figura: fig(planoPide('θ = 200°')),
      enunciado: 'La cabina de una rueda de la fortuna está en θ = 200°. ¿En qué cuadrante está?',
      datos: [DC.cuad, DC.vuelta],
      solucion: [{ texto: ['200° pasa de 180° y no llega a 270°: la cabina queda abajo a la izquierda.'], ecuacion: junto(['180° < 200° < 270°']) }],
      respuesta: [neg('Cuadrante III')] },
    { nivel: 1, titulo: 'El signo del coseno', figura: fig(figGiro(130)),
      enunciado: 'θ = 130° está en posición normal. ¿Qué signo tiene cos θ?',
      datos: [D.def, DC.cuad],
      solucion: [{ texto: ['130° está en el II: x < 0. Como r es positivo, x/r es negativo.'], ecuacion: junto(['cos ', th, ' = ', frac(dI('x < 0'), 'r > 0'), ' < 0']) }],
      respuesta: [neg('Negativo')] },
    { nivel: 1, titulo: 'El signo de la tangente', figura: fig(figGiro(300)),
      enunciado: 'θ = 300° está en posición normal. ¿Qué signo tiene tan θ?',
      datos: [D.def, DC.cuad],
      solucion: [{ texto: ['300° está en el IV: x > 0 e y < 0. Un negativo entre un positivo da negativo.'], ecuacion: junto(['tan ', th, ' = ', frac(dO('y < 0'), dI('x > 0')), ' < 0']) }],
      respuesta: [neg('Negativo')] },
    { nivel: 1, titulo: 'A qué lado del centro', figura: fig(planoPide('θ = 100°')),
      enunciado: 'La cabina está en θ = 100°. ¿Está a la derecha o a la izquierda del centro? ¿Arriba o abajo?',
      datos: [DC.cuad],
      solucion: [{ texto: ['100° pasa de 90°: cuadrante II. Ahí x < 0 (izquierda) e y > 0 (arriba).'] }],
      respuesta: [neg('A la izquierda y arriba')] },
    { nivel: 1, titulo: 'La cosecante', figura: fig(figGiro(250)),
      enunciado: 'θ = 250° está en posición normal. ¿Qué signo tiene csc θ?',
      datos: [D.rec, DC.cuad],
      solucion: [{ texto: ['csc θ = r/y. 250° está en el III: y < 0, así que r/y es negativo.'], ecuacion: junto(['csc ', th, ' = ', frac('r > 0', dO('y < 0')), ' < 0']) }],
      respuesta: [neg('Negativo')] },
    { nivel: 2, titulo: 'Dos signos, un cuadrante', figura: fig(planoCuad()),
      enunciado: 'θ cumple sen θ > 0 y cos θ < 0. ¿En qué cuadrante está?',
      datos: [D.def, DC.cuad],
      solucion: [
        { texto: ['sen θ > 0 pide y > 0: cuadrantes I o II.'] },
        { texto: ['cos θ < 0 pide x < 0: cuadrantes II o III. Los dos a la vez: el II.'] },
      ],
      respuesta: [neg('Cuadrante II')] },
    { nivel: 2, titulo: 'El signo de un producto', figura: fig(planoCuad()),
      enunciado: '¿Qué signo tiene E = sen 140° · cos 220°?',
      datos: [D.def, DC.cuad],
      solucion: [
        { texto: ['140° está en el II (y > 0): sen 140° > 0. 220° está en el III (x < 0): cos 220° < 0.'] },
        { texto: ['Un positivo por un negativo:'], ecuacion: junto(['(+) · (−) = (−)']) },
      ],
      respuesta: [neg('Negativo')] },
    { nivel: 2, titulo: 'Tangente y cosecante', figura: fig(planoCuad()),
      enunciado: 'θ cumple tan θ < 0 y csc θ < 0. ¿En qué cuadrante está?',
      datos: [D.def, D.rec, DC.cuad],
      solucion: [
        { texto: ['csc θ = r/y < 0 pide y < 0: III o IV.'] },
        { texto: ['tan θ = y/x < 0 pide x e y de signos distintos: II o IV. Los dos a la vez: el IV.'] },
      ],
      respuesta: [neg('Cuadrante IV')] },
    { nivel: 2, titulo: 'Con el coseno y el cuadrante', figura: fig(planoCuad()),
      enunciado: 'θ está en el cuadrante IV y cos θ = 5/13. ¿Cuánto vale sen θ?',
      datos: [D.def, D.r, DC.cuad],
      solucion: [
        { texto: ['cos θ = x/r = 5/13: se toma x = 5 y r = 13. Entonces y² = 169 − 25 = 144: y = 12 o y = −12.'] },
        { texto: ['En el IV, y < 0: y = −12.'], ecuacion: junto(['sen ', th, ' = ', frac(dO('−12'), '13'), ' = ', dF('−12/13')]) },
      ],
      respuesta: ['sen θ = ', dF('−12/13')] },
    { nivel: 2, titulo: 'Las positivas de 160°', figura: fig(figGiro(160)),
      enunciado: '¿Cuáles de las seis razones de 160° son positivas?',
      datos: [D.def, D.rec, DC.cuad],
      solucion: [
        { texto: ['160° está en el II: x < 0 e y > 0.'] },
        { texto: ['Son positivas las que solo usan y y r: sen θ = y/r y csc θ = r/y. Las otras cuatro llevan x, que es negativa.'] },
      ],
      respuesta: [neg('El seno y la cosecante')] },
    // Nivel 3, tipo examen. Letras de las correctas: B, D, A, E, C.
    { nivel: 3, titulo: 'Con la tangente en el III', figura: fig(planoCuad()),
      enunciado: 'θ está en el cuadrante III y tan θ = 3/4. Calcula E = sen θ + cos θ.',
      alternativas: ALT2.tan3,
      datos: [D.def, D.r, DC.cuad],
      solucion: [
        { texto: ['En el III, x e y son negativas: de y/x = 3/4, y = −3 y x = −4. Entonces r = 5.'] },
        { texto: ['Las dos razones:'], ecuacion: junto(['E = ', frac(dO('−3'), '5'), ' + ', frac(dI('−4'), '5'), ' = ', dF('−7/5')]) },
        { texto: ['7/5 olvida los signos; −1/5 y 1/5 dejan negativa solo una de las coordenadas; 12/25 multiplica en vez de sumar.'] },
      ],
      respuesta: [letra(ALT2.tan3, '−7/5'), ', ', dF('−7/5')] },
    { nivel: 3, titulo: 'Una ecuación en el III', figura: fig(planoCuad()),
      enunciado: 'θ está en el cuadrante III y cumple 2 tan² θ − 3 tan θ − 2 = 0. Calcula E = √5 (sen θ − cos θ).',
      alternativas: ALT2.raiz,
      datos: [D.def, D.r, DC.cuad, 'Las raíces de 2t² − 3t − 2 = 0 son t = 2 y t = −1/2.'],
      solucion: [
        { texto: ['En el III, tan θ = y/x es positiva: tan θ = 2. Con x e y negativas, y = −2 y x = −1, así que r = √5.'] },
        { texto: ['Se reemplaza:'], ecuacion: junto(['E = √5 · (', frac('−2', '√5'), ' − ', frac('−1', '√5'), ') = −2 + 1 = ', dF('−1')]) },
        { texto: ['1 cambia x por y; −3 suma en vez de restar; 3 usa la raíz −1/2, que es de otro cuadrante; −√5/5 no multiplica por √5.'] },
      ],
      respuesta: [letra(ALT2.raiz, '−1'), ', ', dF('−1')] },
    { nivel: 3, titulo: 'El signo de una fracción', figura: fig(planoCuad()),
      enunciado: '¿Qué signo tiene E = (sen 200° · tan 300°)/cos 100°?',
      alternativas: ALT2.signo,
      datos: [D.def, DC.cuad],
      solucion: [
        { texto: ['sen 200°: III, y < 0, negativo. tan 300°: IV, y/x con signos distintos, negativo. cos 100°: II, x < 0, negativo.'] },
        { texto: ['Con los signos:'], ecuacion: junto([frac('(−) · (−)', '(−)'), ' = ', frac('(+)', '(−)'), ' = (−)']) },
        { texto: ['Positivo pierde un signo; Cero y Depende de r no van: ninguna razón vale 0 y r es positivo; No se sabe sin calcular olvida que basta el cuadrante.'] },
      ],
      respuesta: [letra(ALT2.signo, 'Negativo'), ', negativo'] },
    { nivel: 3, titulo: 'Con el seno en el II', figura: fig(figP(-Math.sqrt(5), 2, { ventana: { x: [-3.6, 1.2], y: [-0.8, 3] }, rot: { x: 'x = ?', y: 'y = 2', r: 'r = 3', p: 'P' }, alt: 'Ángulo θ del cuadrante II; su punto P tiene ordenada 2 y radio vector 3; la abscisa x se pide' })),
      enunciado: 'θ está en el cuadrante II y sen θ = 2/3. ¿Cuánto vale tan θ?',
      alternativas: ALT2.tan2,
      datos: [D.def, D.r, DC.cuad, D.racio],
      solucion: [
        { texto: ['y/r = 2/3: se toma y = 2 y r = 3. Con Pitágoras:'], ecuacion: junto(['x² = 9 − 4 = 5']) },
        { texto: ['En el II, x es negativa: x = −√5.'] },
        { texto: ['La tangente, racionalizada:'], ecuacion: junto(['tan ', th, ' = ', frac(dO('2'), dI('−√5')), ' = ', dF('−2√5/5')]) },
        { texto: ['2√5/5 toma x positiva; −√5/2 es x/y, la cotangente; −2/3 le pone signo al seno; −3√5/5 es r/x, la secante.'] },
      ],
      respuesta: [letra(ALT2.tan2, '−2√5/5'), ', ', dF('−2√5/5')] },
    { nivel: 3, titulo: 'Dos ángulos, dos cuadrantes', figura: fig(planoCuad()),
      enunciado: 'α está en el II con sen α = 3/5, y β está en el IV con cos β = 12/13. Calcula E = tan α + tan β.',
      alternativas: ALT2.dos,
      datos: [D.def, D.r, DC.cuad],
      solucion: [
        { texto: ['α: y = 3, r = 5 y, en el II, x = −4: tan α = −3/4. β: x = 12, r = 13 y, en el IV, y = −5: tan β = −5/12.'] },
        { texto: ['Se suman:'], ecuacion: junto(['E = −', frac('3', '4'), ' − ', frac('5', '12'), ' = −', frac('9 + 5', '12'), ' = ', dF('−7/6')]) },
        { texto: ['1/3 deja tan α positiva; 7/6 olvida los dos signos; −1/3 deja tan β positiva; −63/20 usa cot β = −12/5 en vez de tan β.'] },
      ],
      respuesta: [letra(ALT2.dos, '−7/6'), ', ', dF('−7/6')] },
  ];
  const PARES = [['sen', 'cos'], ['tan', 'cos'], ['sen', 'tan'], ['csc', 'sec'], ['cot', 'sen'], ['sec', 'tan']];
  function casoSignos(rr) {
    let g = 10 * rr.ent(1, 35); while (g % 90 === 0) g += 10;
    const q = cuadDe(g), [a, b] = rr.uno(PARES), [sx, sy] = SIG[q];
    const combo = qq => `${a} ${sgTxt(signoDe(a, qq))}, ${b} ${sgTxt(signoDe(b, qq))}`;
    const otros = [1, 2, 3, 4].filter(qq => qq !== q);
    return {
      pregunta: `θ = ${g}° está en posición normal. ¿Qué signos tienen ${a} θ y ${b} θ?`,
      datos: [D.def, D.rec, DC.cuad],
      dibujo: fig(figGiro(g)),
      opciones: opciones(combo(q), otros.map(qq => ({
        id: `q${qq}`, texto: combo(qq), error: SIG[qq][0] === sy && SIG[qq][1] === sx ? 'TR11' : qq === 1 ? 'TR12' : 'TRPN-TODO-NEG',
        siFuera: `Esos signos son los del cuadrante ${ROM[qq]}. ${g}° está en el ${ROM[q]}: x ${sgTxt(sx)}, y ${sgTxt(sy)}.`,
      }))),
      solucion: { texto: `${g}° está en el cuadrante ${ROM[q]}: x ${sgTxt(sx)} e y ${sgTxt(sy)}; cada razón toma el signo de su cociente.`, ecuacion: junto([X, ` ${sx > 0 ? '> 0' : '< 0'}`, SEP, Y, ` ${sy > 0 ? '> 0' : '< 0'}`]) },
    };
  }
  const CONDS = [['sen', 1], ['sen', -1], ['cos', 1], ['cos', -1], ['tan', 1], ['tan', -1], ['csc', -1], ['sec', 1], ['cot', -1]];
  function casoCuadrante(rr) {
    for (let i = 0; i < 80; i++) {
      const c1 = rr.uno(CONDS), c2 = rr.uno(CONDS);
      if (c1[0] === c2[0]) continue;
      const cumple = c => [1, 2, 3, 4].filter(q => signoDe(c[0], q) === c[1]);
      const ambos = cumple(c1).filter(q => cumple(c2).includes(q));
      if (ambos.length !== 1) continue;
      const q = ambos[0], solo1 = cumple(c1).filter(x => x !== q), solo2 = cumple(c2).filter(x => x !== q);
      const ninguna = [1, 2, 3, 4].filter(x => x !== q && !solo1.includes(x) && !solo2.includes(x));
      const s = ([fn, sg]) => `${fn} θ ${sg > 0 ? '> 0' : '< 0'}`;
      return {
        pregunta: `θ cumple ${s(c1)} y ${s(c2)}. ¿En qué cuadrante está?`,
        datos: [D.def].concat(['csc', 'sec', 'cot'].includes(c1[0]) || ['csc', 'sec', 'cot'].includes(c2[0]) ? [D.rec] : [], [DC.cuad]),
        dibujo: fig(planoCuad()),
        opciones: opciones(`En el ${ROM[q]}`, [
          ...solo1.map(x => ({ id: `solo1-${x}`, texto: `En el ${ROM[x]}`, error: 'RN-UNA-CONDICION', siFuera: `En el ${ROM[x]} se cumple ${s(c1)}, bien; pero no ${s(c2)}.` })),
          ...solo2.map(x => ({ id: `solo2-${x}`, texto: `En el ${ROM[x]}`, error: 'RN-UNA-CONDICION', siFuera: `En el ${ROM[x]} se cumple ${s(c2)}, bien; pero no ${s(c1)}.` })),
          ...ninguna.map(x => ({ id: `nada-${x}`, texto: `En el ${ROM[x]}`, error: 'TRPN-TODO-NEG', siFuera: `Mirar los signos de x e y está bien; en el ${ROM[x]} no se cumple ninguna de las dos.` })),
        ]),
        solucion: { texto: `${s(c1)}: ${cumple(c1).map(x => ROM[x]).join(' y ')}; ${s(c2)}: ${cumple(c2).map(x => ROM[x]).join(' y ')}. Los dos: el ${ROM[q]}.`, ecuacion: [neg(`Cuadrante ${ROM[q]}`)] },
      };
    }
    throw new Error('casoCuadrante: sin caso');
  }
  // Una razón y el cuadrante: se arma P con la razón y el signo del cuadrante (la trampa: la raíz del otro signo).
  function casoRazonCuad(rr) {
    for (let i = 0; i < 80; i++) {
      const [a, b] = rr.uno(TERNAS), swap = rr.ent(0, 1), q = rr.ent(1, 4), [sx, sy] = SIG[q];
      const x = sx * (swap ? b : a), y = sy * (swap ? a : b), r = Math.hypot(x, y);
      const dado = rr.uno(['sen', 'cos', 'tan']), pide = rr.uno(['sen', 'cos', 'tan', 'sec', 'csc', 'cot'].filter(z => z !== dado && z !== RECIPROCA[dado]));
      const dTxt = txt(razonDe(dado, x, y)), ok = txt(razonDe(pide, x, y));
      // El otro punto que da la misma razón dada (el de la raíz equivocada).
      const [x2, y2] = dado === 'sen' ? [-x, y] : dado === 'cos' ? [x, -y] : [-x, -y];
      const otraQ = cuadDe(Math.atan2(y2, x2) * 180 / Math.PI);
      return {
        pregunta: `θ está en el cuadrante ${ROM[q]} y ${dado} θ = ${dTxt}. ¿Cuánto vale ${pide} θ?`,
        datos: [D.def].concat(['sec', 'csc', 'cot'].includes(pide) ? [D.rec] : [], [D.r, DC.cuad]),
        dibujo: fig(planoCuad()),
        opciones: opciones(ok, [
          { id: 'raiz', texto: txt(razonDe(pide, x2, y2)), error: 'RN-RAIZ', siFuera: `Armar P con ${dado} θ está bien; pero ese signo es del cuadrante ${ROM[otraQ]}: da ${txt(razonDe(pide, x2, y2))}.` },
          { id: 'sin-signo', texto: txt(razonDe(pide, Math.abs(x), Math.abs(y))), error: 'TR12', siFuera: `El tamaño está bien; en el ${ROM[q]}, x ${sgTxt(sx)} e y ${sgTxt(sy)} ponen el signo.` },
          { id: 'inversa', texto: txt(razonDe(RECIPROCA[pide], x, y)), error: 'TRPN-INVERSA', siFuera: `P está bien armado; ${txt(razonDe(RECIPROCA[pide], x, y))} es la ${NOMBRE[RECIPROCA[pide]]}, el cociente al revés.` },
          { id: 'cruza', texto: txt(razonDe(CRUZA[pide], x, y)), error: 'TR11', siFuera: `P está bien armado; ${txt(razonDe(CRUZA[pide], x, y))} cambia x por y: es la ${NOMBRE[CRUZA[pide]]}.` },
        ]),
        solucion: { texto: `Con ${dado} θ = ${dTxt} y los signos del ${ROM[q]}: P(${f(x)}, ${f(y)}) y r = ${f(r)}.`, ecuacion: [defDe(pide), ' = ', dF(ok)] },
      };
    }
    throw new Error('casoRazonCuad: sin caso');
  }
  // «Así se resuelve» de la idea 2: el signo de una expresión con tres razones.
  const RES2 = [[140, 'sen', 220, 'cos', 310, 'tan'], [100, 'cos', 200, 'sen', 290, 'cot'], [250, 'tan', 160, 'csc', 70, 'cos'], [320, 'sen', 130, 'tan', 230, 'sec'],
    [190, 'cos', 280, 'csc', 110, 'tan'], [350, 'cot', 170, 'sen', 260, 'cos']];
  const signos = {
    id: 'signos-cuadrante',
    titulo: 'El signo sale de x, y',
    pregunta: '¿Cómo sabes el signo de una razón sin calcularla?',
    temas: ['Signos por cuadrante'],
    pieza: PZ,
    aprendizaje: 'El seno lleva el signo de y; el coseno, el de x; la tangente es positiva si x e y tienen el mismo signo.',
    actividad: 'Girar una rueda de la fortuna y ver a qué lado del centro queda la cabina.',
    // Lee: el objeto, los cuadrantes y los signos de x e y. No dice qué signo tiene ninguna razón (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'La rueda de la fortuna', texto: 'En la feria, la rueda gira en un plano vertical. Pon el origen en su centro y el eje x horizontal: la cabina es un punto P y θ se mide desde el rayo de la derecha, en sentido antihorario.',
          pieza: PZ, dibujo: { datos: Object.assign(rueda(60, { sinTramos: true, romanos: false }), { alt: 'Rueda de la fortuna con su centro en el origen y una cabina a 60 grados' }), estado: {} } },
        { titulo: 'Cuatro cuadrantes', texto: 'Los ejes parten el plano en cuatro cuadrantes. Se numeran I, II, III y IV en sentido antihorario, desde arriba a la derecha. Los ejes no son de ningún cuadrante.' },
        { titulo: 'El signo de cada coordenada', texto: ['A la derecha del centro, ', X, ' es positiva; a la izquierda, negativa. Arriba, ', Y, ' es positiva; abajo, negativa. El radio vector r siempre es positivo.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Gira la rueda y mira a qué lado del centro queda la cabina. La lectura te dice el signo del seno y del coseno; piensa de dónde sale cada uno.' },
      ],
    },
    ejemplos: EJEMPLOS_2,
    juega: {
      consigna: ['El centro de la rueda es el origen y la cabina, P. ', th, ' se mide desde el rayo de la derecha.'],
      mision: {
        texto: 'Deja la cabina donde el seno es negativo y el coseno, positivo.',
        logrado: val => val.g === 315,
        bien: 'Listo: abajo y a la derecha, cuadrante IV. Ahí y < 0 y x > 0.',
      },
      voz: '¿Qué coordenada cambia de signo al cruzar cada eje?',
      leyenda: [
        { s: th, t: 'giro desde el rayo de la derecha' },
        { s: X, t: 'derecha (+) o izquierda (−) del centro' },
        { s: Y, t: 'arriba (+) o abajo (−) del centro' },
        { s: 'P', t: 'la cabina' },
        { s: 'I a IV', t: 'los cuadrantes' },
      ],
      controles: [{ id: 'g', etiqueta: 'θ, giro de la rueda', color: 'c-h', min: 0, max: 360, paso: 45, inicio: 45, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: rueda(val.g), estado: {} }),
      lectura: val => {
        const q = cuadDe(val.g);
        if (!q) return ['La cabina está sobre un eje: fuera de los cuadrantes.'];
        return junto([`Cuadrante ${ROM[q]}: sen `, th, ` ${signoDe('sen', q) > 0 ? '> 0' : '< 0'}; cos `, th, ` ${signoDe('cos', q) > 0 ? '> 0' : '< 0'}`]);
      },
      minimo: 4,
      arrastres: [{ id: 'cabina', etiqueta: 'la cabina P', color: 'c-h',
        donde: val => TP().enPx(rueda(val.g), RR * Math.cos(rad(val.g)), RR * Math.sin(rad(val.g))),
        mover: (pt, val) => { const a = TP().anguloDe(rueda(val.g), pt, { cerca: val.g }); return { g: Math.max(0, Math.min(360, 45 * Math.round(a / 45))) }; } }],
    },
    // Conserva la pregunta de la versión 0.1.0 y los id de sus opciones (decisión 8): nadie pierde su respuesta.
    predice: {
      pregunta: 'Para θ = 225°, en el tercer cuadrante, seno y coseno son negativos. ¿Qué signo tiene tan θ = y/x?',
      datos: ['En el cuadrante III: x < 0 e y < 0.'],
      voz: 'Escribe primero el signo de y y el de x.',
      opciones: [
        { id: 'c', texto: 'Positivo', correcta: true },
        { id: 'todo-neg', texto: 'Negativo, como todo en el III', error: 'TRPN-TODO-NEG', siFuera: 'x e y sí son negativas. Pero un negativo entre un negativo da positivo.' },
        { id: 'copia', texto: 'Negativo, como el seno', error: 'TRPN-COPIA-SEN', siFuera: 'El seno sí copia el signo de y. La tangente divide y entre x: −/− es +.' },
        { id: 'cero', texto: 'Cero', error: 'TR12', siFuera: 'Los signos se combinan, pero no dan cero: y/x es un cociente de dos números distintos de 0.' },
      ],
      dibujo: { datos: rueda(225), estado: {} },
      revelar: { datos: rueda(225, { extra: { rotulos: [{ x: 12, y: 12.3, texto: 'I' }, { x: -12, y: 12.3, texto: 'II' }, { x: -12, y: -12.8, texto: 'III' }, { x: 12, y: -12.8, texto: 'IV' }, { x: 6.5, y: 4.5, texto: 'tan θ = (−)/(−) > 0', color: 'f' }] } }), estado: {} },
      coincide: 'Coincide: dos signos negativos en un cociente dan positivo.',
      noCoincide: 'Revisemos los dos signos: los dos tramos apuntan al lado negativo.',
    },
    // «Mira» deja la cabina en un cuadrante a la vez, en la misma rueda, para leer la tabla de signos completa.
    mira: {
      datos: (() => {
        const d = { ventana: { x: [-14, 14], y: [-14, 14] }, objeto: { tipo: 'rueda', r: RR }, segmentos: [], puntos: [], rotulos: [],
          alt: 'Rueda de la fortuna con la cabina en los cuatro cuadrantes y las razones positivas de cada uno: I todas, II seno, III tangente, IV coseno' };
        [[45, 'I: las seis > 0', 12, 12.3], [135, 'II: sen, csc > 0', -12, 12.3], [225, 'III: tan, cot > 0', -12, -12.8], [315, 'IV: cos, sec > 0', 12, -12.8]].forEach(([g, t, rx, ry], k) => {
          const x = RR * Math.cos(rad(g)), y = RR * Math.sin(rad(g));
          d.segmentos.push({ de: [0, 0], a: [x, 0], color: 'i', desde: k + 1, hasta: k + 1 }, { de: [x, 0], a: [x, y], color: 'o', desde: k + 1, hasta: k + 1 }, { de: [0, 0], a: [x, y], grosor: 'variable', desde: k + 1, hasta: k + 1 });
          d.puntos.push({ x, y, desde: k + 1 });
          d.rotulos.push({ x: rx * 0.62, y: ry, texto: t, desde: k + 1 });
        });
        return d;
      })(),
      voz: 'Un cuadrante a la vez: los signos de x e y deciden.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En el I, x e y son positivas: las seis razones son positivas.', ecuacion: junto([X, ' > 0', SEP, Y, ' > 0']) },
        { estado: { corte: 2 }, texto: 'En el II, x es negativa: solo el seno y la cosecante quedan positivas.', ecuacion: junto([X, ' < 0', SEP, Y, ' > 0']) },
        { estado: { corte: 3 }, texto: 'En el III, las dos son negativas: y/x y x/y son positivas.', ecuacion: junto([frac(Y, X), ' = ', frac('−', '−'), ' > 0']) },
        { estado: { corte: 4 }, texto: 'En el IV, y es negativa: solo el coseno y la secante quedan positivas.', ecuacion: junto([X, ' > 0', SEP, Y, ' < 0']) },
      ],
    },
    regla: {
      texto: 'r es positivo: el seno lleva el signo de y; el coseno, el de x; la tangente es positiva si x e y tienen el mismo signo.',
      ecuacion: [junto(['sen ', th, ': signo de ', Y]), SEP, junto(['cos ', th, ': signo de ', X]), SEP, junto(['tan ', th, ': signo de ', Y, '/', X])],
      condicion: 'Fuera de los ejes. csc, sec y cot llevan el signo de sen, cos y tan.',
      voz: 'La tabla de signos se rearma con x e y; no hace falta memorizarla.',
      dibujo: { pieza: PZ, datos: planoCuad({ rotulos: [{ x: 2.6, y: 3, texto: 'I: todas > 0' }, { x: -2.6, y: 3, texto: 'II: sen, csc > 0' }, { x: -2.6, y: -3, texto: 'III: tan, cot > 0' }, { x: 2.6, y: -3, texto: 'IV: cos, sec > 0' }],
        alt: 'Los cuatro cuadrantes con sus razones positivas: I todas, II seno y cosecante, III tangente y cotangente, IV coseno y secante' }), estado: {} },
    },
    resuelve: {
      generar(sem) {
        const [g1, f1, g2, f2, g3, f3] = RES2[((sem % RES2.length) + RES2.length) % RES2.length];
        const s1 = signoDe(f1, cuadDe(g1)), s2 = signoDe(f2, cuadDe(g2)), s3 = signoDe(f3, cuadDe(g3)), s = s1 * s2 * s3;
        const linea = (fn, g, sg) => `${fn} ${g}°: cuadrante ${ROM[cuadDe(g)]}, ${sgPal(sg)}`;
        return {
          enunciado: `¿Qué signo tiene E = (${f1} ${g1}° · ${f2} ${g2}°)/${f3} ${g3}°?`,
          datos: [D.def, D.rec, DC.cuad],
          // Los tres lados finales (cierre, lector A: los ejes vacíos no mostraban los ángulos).
          dibujo: fig(planoCuad({ rotulos: [], rayos: [g1, g2, g3].map(g => ({ ang: g, largo: 3.3, rotulo: `${g}°` })),
            alt: `Plano con los cuatro cuadrantes y los lados finales de ${g1}, ${g2} y ${g3} grados` })),
          pasos: [
            { tipo: 'pide', texto: ['Piden el signo de E, no su valor.'] },
            { tipo: 'datos', texto: [`Tres razones de tres ángulos: ${g1}°, ${g2}° y ${g3}°.`] },
            { tipo: 'regla', texto: ['Cada razón toma el signo de su cociente con x, y, r; r es positivo.'] },
            { tipo: 'cuentas', texto: [`${linea(f1, g1, s1)}. ${linea(f2, g2, s2)}. ${linea(f3, g3, s3)}.`],
              ecuacion: junto([frac(`(${sgTxt(s1)}) · (${sgTxt(s2)})`, `(${sgTxt(s3)})`), ` = (${sgTxt(s)})`]) },
            { tipo: 'sentido', texto: ['Para el signo no hace falta ningún valor: basta el cuadrante de cada ángulo.'] },
          ],
          respuesta: [neg(s > 0 ? 'E es positiva' : 'E es negativa')],
        };
      },
    },
    ahoraTu: {
      voz: 'Ubica el cuadrante; después, el signo de x y el de y.',
      generar(sem) { return sinRepetir([casoSignos, casoCuadrante, casoRazonCuad][((sem % 3) + 3) % 3], sem, signos); },
    },
  };

  // ====================================================================================================================
  // Idea 3: cero no es «no definida»
  // ====================================================================================================================
  // Objeto de la primera pantalla: la veleta de la plaza vista desde arriba; la punta de su flecha (40 cm) es P.
  // Cambia: el giro θ, de 90° en 90° (este, norte, oeste, sur). · Permanece: el largo de la flecha. · Progresa: cuál
  // coordenada vale 0. · Se reserva: tan 90° (la predicción; la lectura solo da el seno y el coseno). · Debe verse: dividir
  // entre 0 no da un número y 0 arriba sí da 0.
  // Errores: TRPN-TAN-CERO (el error objetivo de la matriz), TR11, TRPN-INFINITO, TRPN-CERO-INDEF (0 arriba como «no
  // definida»); RN-SIN-MULTIPLO (usa θ donde va 2θ o θ/2), hipótesis.
  const RV = 40;
  function veleta(g, o = {}) {
    const x = Math.round(RV * Math.cos(rad(g))), y = Math.round(RV * Math.sin(rad(g)));
    return Object.assign({
      ventana: { x: [-64, 64], y: [-64, 64] }, objeto: { tipo: 'veleta', r: RV, flecha: g },
      segmentos: [{ de: [0, 0], a: [x, y], grosor: 'variable', punta: true }],
      arcos: g ? [{ de: 0, a: g, r: 9, color: 'h', rotulo: 'θ' }] : [],
      puntos: [{ x, y, rotulo: o.rotP === undefined ? `P(${f(x)}, ${f(y)})` : o.rotP, lado: o.ladoP || (x !== 0 ? 's' : 'e') }],
      alt: `Veleta vista desde arriba: la flecha apunta a ${f(mod360(g))} grados y su punta P está en (${f(x)}, ${f(y)})`,
    }, o.extra || {});
  }
  const ALT3 = {
    mult: ['1/2', '3/2', 'No está definida', '−1/2'],
    frac: ['1/3', '5/3', '1', '5/4', '3/5'],
    mitad: ['−1', '2', 'No está definida', '0'],
    cual: ['sen 270° + cot 90°', 'cos 180° · tan 0°', 'csc 270° + tan 180°', 'cot 270° · sec 0°', 'sec 90° − 1'],
    cambio: ['Sube 2', 'No cambia', 'Baja 2', 'Baja 1', 'Baja 80'],
  };
  const E3 = (g, rotP) => fig(veleta(g, { rotP }));
  const EJEMPLOS_3 = [
    { nivel: 1, titulo: 'La flecha al sur', figura: E3(270, 'P(0, −40)'),
      enunciado: 'La flecha de la veleta apunta al sur: θ = 270° y su punta está en P(0, −40). ¿Cuánto vale sen θ?',
      datos: [D.def],
      solucion: [{ texto: ['r = 40. El seno es la ordenada entre r:'], ecuacion: junto(['sen 270° = ', frac(dO('−40'), '40'), ' = ', dF('−1')]) }],
      respuesta: ['sen 270° = ', dF('−1')] },
    { nivel: 1, titulo: 'El coseno de 90°', figura: E3(90, 'P(0, 40)'),
      enunciado: 'La flecha apunta al norte: θ = 90° y P(0, 40). ¿Cuánto vale cos θ?',
      datos: [D.def],
      solucion: [{ texto: ['La abscisa es 0: el 0 queda arriba del cociente.'], ecuacion: junto(['cos 90° = ', frac(dI('0'), '40'), ' = ', dF('0')]) }],
      respuesta: ['cos 90° = ', dF('0')] },
    { nivel: 1, titulo: 'La tangente de 180°', figura: E3(180, 'P(−40, 0)'),
      enunciado: 'La flecha apunta al oeste: θ = 180° y P(−40, 0). ¿Cuánto vale tan θ?',
      datos: [D.def],
      solucion: [{ texto: ['La ordenada y = 0 queda arriba del cociente: 0 entre −40 es 0.'], ecuacion: junto(['tan 180° = ', frac(dO('0'), dI('−40')), ' = ', dF('0')]) }],
      respuesta: ['tan 180° = ', dF('0')] },
    { nivel: 1, titulo: 'La cotangente de 180°', figura: E3(180, 'P(−40, 0)'),
      enunciado: 'Con la flecha al oeste, θ = 180° y P(−40, 0). ¿Cuánto vale cot θ?',
      datos: [D.def, D.rec, DC.cero],
      solucion: [{ texto: ['Ahora el 0 queda abajo: no hay número que lo cumpla.'], ecuacion: junto(['cot 180° = ', frac(dI('−40'), dO('0')), ': no está definida']) }],
      respuesta: [neg('cot 180° no está definida')] },
    { nivel: 1, titulo: 'Una vuelta entera', figura: E3(360, 'P(40, 0)'),
      enunciado: 'La flecha da una vuelta entera y vuelve al este: θ = 360° y P(40, 0). ¿Cuánto vale sec θ?',
      datos: [D.def, D.rec],
      solucion: [{ texto: ['La secante es r entre la abscisa:'], ecuacion: junto(['sec 360° = ', frac('40', dI('40')), ' = ', dF('1')]) }],
      respuesta: ['sec 360° = ', dF('1')] },
    { nivel: 2, titulo: 'Suma de dos ejes', figura: fig(planoEjes([90, 180])),
      enunciado: 'Calcula E = sen 90° + cos 180°.',
      datos: [D.def, DC.eje],
      solucion: [
        { texto: ['90° da (0, a): sen 90° = a/a = 1. 180° da (−a, 0): cos 180° = −a/a = −1.'] },
        { texto: ['Se suman:'], ecuacion: junto(['E = 1 + (−1) = ', dF('0')]) },
      ],
      respuesta: ['E = ', dF('0')] },
    { nivel: 2, titulo: 'Con coeficientes', figura: fig(planoEjes([0, 270])),
      enunciado: 'Calcula E = 3 cos 0° − 2 sen 270°.',
      datos: [D.def, DC.eje],
      solucion: [
        { texto: ['0° da (a, 0): cos 0° = 1. 270° da (0, −a): sen 270° = −1.'] },
        { texto: ['Se reemplaza, con el signo:'], ecuacion: junto(['E = 3 · 1 − 2 · (−1) = 3 + 2 = ', dF('5')]) },
      ],
      respuesta: ['E = ', dF('5')] },
    { nivel: 2, titulo: 'Un cociente con ejes', figura: fig(planoEjes([360, 180, 90])),
      enunciado: 'Calcula E = (tan 360° + sec 180°)/csc 90°.',
      datos: [D.def, D.rec, DC.eje],
      solucion: [
        { texto: ['360° da (a, 0): tan 360° = 0/a = 0. 180° da (−a, 0): sec 180° = a/(−a) = −1. 90° da (0, a): csc 90° = a/a = 1.'] },
        { texto: ['Se reemplaza:'], ecuacion: junto(['E = ', frac('0 + (−1)', '1'), ' = ', dF('−1')]) },
      ],
      respuesta: ['E = ', dF('−1')] },
    { nivel: 2, titulo: 'La secante al sur', figura: E3(270, 'P(0, −40)'),
      enunciado: 'Con la flecha al sur, θ = 270° y P(0, −40). ¿Cuánto vale sec θ?',
      datos: [D.def, D.rec, DC.cero],
      solucion: [
        { texto: ['sec θ = r/x, y x = 0.'], ecuacion: junto(['sec 270° = ', frac('40', dI('0'))]) },
        { texto: ['El 0 queda abajo: no da ningún número.'] },
      ],
      respuesta: [neg('sec 270° no está definida')] },
    { nivel: 2, titulo: 'Las que existen en 90°', figura: E3(90, 'P(0, 40)'),
      enunciado: 'Con θ = 90° y P(0, 40), ¿cuáles de las seis razones no están definidas?',
      datos: [D.def, D.rec, DC.cero],
      solucion: [
        { texto: ['x = 0: no existen las que llevan x abajo, tan θ = y/x y sec θ = r/x.'] },
        { texto: ['Las demás sí: sen 90° = 1, cos 90° = 0, cot 90° = 0/40 = 0 y csc 90° = 1.'] },
      ],
      respuesta: [neg('La tangente y la secante')] },
    // Nivel 3, tipo examen. Letras de las correctas: A, B, D, E, C.
    { nivel: 3, titulo: 'Con múltiplos de θ', figura: fig(planoCuad()),
      enunciado: 'Si θ = 90°, calcula E = (2 sen θ + cos 2θ)/(sec 4θ − csc 3θ).',
      alternativas: ALT3.mult,
      datos: [D.def, D.rec, DC.eje],
      solucion: [
        { texto: ['2θ = 180°, 3θ = 270° y 4θ = 360°: sen 90° = 1, cos 180° = −1, sec 360° = 1 y csc 270° = −1.'] },
        { texto: ['Se reemplaza:'], ecuacion: junto(['E = ', frac('2 · 1 + (−1)', '1 − (−1)'), ' = ', frac('1', '2'), ' = ', dF('1/2')]) },
        { texto: ['3/2 toma cos 180° = 1; No está definida toma csc 270° = 1, y abajo queda 1 − 1 = 0; −1/2 usa cos θ en vez de sen θ.'] },
      ],
      respuesta: [letra(ALT3.mult, '1/2'), ', ', dF('1/2')] },
    { nivel: 3, titulo: 'Cinco razones en ejes', figura: fig(planoEjes([90, 180, 0])),
      enunciado: 'Calcula E = (3 sen 90° − 2 cos 180° + tan 0°)/(sec 180° + 4 csc 90°).',
      alternativas: ALT3.frac,
      datos: [D.def, D.rec, DC.eje],
      solucion: [
        { texto: ['sen 90° = 1, cos 180° = −1, tan 0° = 0, sec 180° = −1 y csc 90° = 1.'] },
        { texto: ['Se reemplaza:'], ecuacion: junto(['E = ', frac('3 + 2 + 0', '−1 + 4'), ' = ', dF('5/3')]) },
        { texto: ['1/3 toma cos 180° = 1; 1 toma sec 180° = 1; 5/4 olvida sec 180°; 3/5 da vuelta al cociente.'] },
      ],
      respuesta: [letra(ALT3.frac, '5/3'), ', ', dF('5/3')] },
    { nivel: 3, titulo: 'Con la mitad de θ', figura: fig(planoCuad()),
      enunciado: 'Si θ = 180°, calcula E = (sen(θ/2) + cos θ − tan 2θ)/(1 + cos(θ/2)).',
      alternativas: ALT3.mitad,
      datos: [D.def, DC.eje],
      solucion: [
        { texto: ['θ/2 = 90° y 2θ = 360°: sen 90° = 1, cos 180° = −1, tan 360° = 0 y cos 90° = 0.'] },
        { texto: ['Se reemplaza:'], ecuacion: junto(['E = ', frac('1 − 1 − 0', '1 + 0'), ' = ', dF('0')]) },
        { texto: ['2 toma cos 180° = 1; −1 toma tan 360° = 1; No está definida usa θ en vez de θ/2, y abajo queda 1 + cos 180° = 0.'] },
      ],
      respuesta: [letra(ALT3.mitad, '0'), ', ', dF('0')] },
    { nivel: 3, titulo: '¿Cuál no está definida?', figura: fig(planoEjes([90, 270, 0, 180])),
      enunciado: '¿Cuál de estas expresiones no está definida?',
      alternativas: ALT3.cual,
      datos: [D.def, D.rec, DC.eje, DC.cero],
      solucion: [
        { texto: ['En 90°, x = 0: sec 90° = r/0 no da ningún número, y sec 90° − 1 tampoco.'] },
        { texto: ['Las otras existen: cot 90° = 0, tan 0° = 0, csc 270° = −1, tan 180° = 0, cot 270° = 0 y sec 0° = 1.'] },
      ],
      respuesta: [letra(ALT3.cual, 'sec 90° − 1'), ', sec 90° − 1'] },
    { nivel: 3, titulo: 'Del este al oeste', figura: fig(veleta(180, { rotP: 'P(−40, 0)' })),
      enunciado: 'La flecha de la veleta pasa de apuntar al este a apuntar al oeste: θ va de 0° a 180°. ¿Cómo cambia cos θ?',
      alternativas: ALT3.cambio,
      datos: [D.def, DC.eje],
      solucion: [
        { texto: ['Al este, P(40, 0): cos 0° = 1. Al oeste, P(−40, 0): cos 180° = −1.'] },
        { texto: ['El cambio:'], ecuacion: junto(['−1 − 1 = −2: ', dF('baja 2')]) },
        { texto: ['Sube 2 resta al revés; No cambia mira solo el tamaño, 1; Baja 1 toma cos 180° = 0; Baja 80 resta las abscisas, no los cosenos.'] },
      ],
      respuesta: [letra(ALT3.cambio, 'Baja 2'), ', baja 2'] },
  ];
  const FNS = ['sen', 'cos', 'tan', 'cot', 'sec', 'csc'];
  const ptA = (x, y) => `(${x ? (x > 0 ? 'a' : '−a') : '0'}, ${y ? (y > 0 ? 'a' : '−a') : '0'})`;
  const OPS_EJE = ['0', '1', '−1', 'No está definida'];
  const opEje = v => (v === null ? 'No está definida' : ejeTxt(v));
  function casoEje(rr) {
    const g = rr.uno([0, 90, 180, 270, 360]), fn = rr.uno(FNS), v = valorEje(fn, g), [x, y] = ejeDe(g);
    const ok = opEje(v), [num, den] = PARTES[fn];
    const sf = t => {
      if (t === 'No está definida') return { e: 'TRPN-CERO-INDEF', s: `Sería así con el 0 abajo; aquí ${fn} ${g}° no tiene 0 abajo.` };
      if (v === null) return t === '0' ? { e: 'TRPN-TAN-CERO', s: 'El 0 está, pero abajo: entre 0 no se divide.' } : { e: 'TRPN-INFINITO', s: 'Ubicar el eje está bien; pero el cociente pide dividir entre 0.' };
      if (t === '0') return { e: 'TR11', s: `Sería 0 con el 0 arriba; aquí ${fn} ${g}° no lo tiene arriba.` };
      if (v === 0) return { e: 'TR11', s: `${t} usa la coordenada que no es 0; en ${ptA(x, y)}, ${fn} ${g}° tiene el 0 arriba: vale 0.` };
      return { e: 'TR12', s: `El tamaño 1 está bien; el signo sale del punto ${ptA(x, y)}.` };
    };
    return {
      pregunta: `θ = ${g}° está en posición normal. ¿Cuánto vale ${fn} θ?`,
      datos: [D.def].concat(['cot', 'sec', 'csc'].includes(fn) ? [D.rec] : [], [DC.eje, DC.cero]),
      dibujo: fig(veleta(g, { rotP: 'P' })),
      opciones: opciones(ok, OPS_EJE.filter(t => t !== ok).map((t, i) => ({ id: `d${i}`, texto: t, error: sf(t).e, siFuera: sf(t).s }))),
      solucion: { texto: `${g}° cae sobre un eje: P${ptA(x, y)}. ${fn} θ = ${num.t || num}/${den.t || den}.`, ecuacion: [junto(`${fn} ${g}° `), v === null ? 'no está definida' : junto(['= ', dF(ok)])] },
    };
  }
  // E = p·sen A − q·cos B + t·tan C, con A, B y C sobre los ejes y tan C definida.
  function casoExprEje(rr) {
    for (let i = 0; i < 60; i++) {
      const p = rr.ent(1, 5), q = rr.ent(1, 5), t = rr.ent(1, 4), A = rr.uno([90, 270]), B = rr.uno([0, 180, 360]), C = rr.uno([0, 180, 360]);
      const sA = valorEje('sen', A), cB = valorEje('cos', B), tC = valorEje('tan', C);
      const ok = p * sA - q * cB + t * tC;
      const signo = p * sA + q * cB + t * tC, cruza = p * valorEje('cos', A) - q * valorEje('sen', B) + t * tC, conT = p * sA - q * cB + t;
      const e = `E = ${p === 1 ? '' : p + ' '}sen ${A}° − ${q === 1 ? '' : q + ' '}cos ${B}° + ${t === 1 ? '' : t + ' '}tan ${C}°`;
      const ops = opciones(f(ok), [
        { id: 'signo', texto: f(signo), error: 'TR12', siFuera: `Los tres valores están bien; falta el menos de E: así sale ${f(signo)}.` },
        { id: 'cruza', texto: f(cruza), error: 'TR11', siFuera: `Reemplazar está bien, pero ${f(cruza)} cambia x por y en los dos primeros.` },
        { id: 'tan-uno', texto: f(conT), error: 'TRPN-TAN-UNO', siFuera: `Lo demás está bien; tan ${C}° = 0/a = 0, no 1: con 1 sale ${f(conT)}.` },
        { id: 'indef', texto: 'No está definida', error: 'TRPN-CERO-INDEF', siFuera: `tan ${C}° tiene el 0 arriba: vale 0, y E sí tiene valor.` },
      ]);
      if (ops.length < 4) continue;
      return {
        pregunta: `Calcula ${e}.`,
        datos: [D.def, DC.eje],
        dibujo: fig(planoEjes([A, B, C])),
        opciones: ops,
        solucion: { texto: `sen ${A}° = ${ejeTxt(sA)}, cos ${B}° = ${ejeTxt(cB)} y tan ${C}° = 0.`, ecuacion: junto(['E = ', `${p} · (${ejeTxt(sA)}) − ${q} · (${ejeTxt(cB)}) + ${t} · 0 = `, dF(f(ok))]) },
      };
    }
    throw new Error('casoExprEje: sin caso');
  }
  // Con múltiplos de θ: θ = 90° o 180°, E = (a·F(kθ) + b·G(mθ))/(c·H(jθ) + d), todo sobre los ejes.
  function casoMultiplos(rr) {
    for (let i = 0; i < 200; i++) {
      const T = rr.uno([90, 180]), ks = T === 90 ? [1, 2, 3, 4] : [0.5, 1, 1.5, 2];
      const t1 = [rr.ent(1, 3), rr.uno(['sen', 'cos']), rr.uno(ks)], t2 = [rr.uno([1, -1]) * rr.ent(1, 3), rr.uno(['sen', 'cos', 'tan']), rr.uno(ks)];
      const t3 = [rr.ent(1, 2), rr.uno(['sec', 'csc', 'cos', 'sen']), rr.uno(ks)], d = rr.ent(0, 3);
      if (t1[2] === t2[2] && t1[1] === t2[1]) continue;
      const val = ([c, fn, k], mult = true) => { const v = valorEje(fn, mult ? T * k : T); return v === null ? null : c * v; };
      const vals = [val(t1), val(t2), val(t3)];
      if (vals.some(v => v === null)) continue;
      const den = vals[2] + d;
      if (den === 0) continue;
      const okC = cociente(vals[0] + vals[1], 1, den, 1);
      // Errores: el múltiplo olvidado (usa θ en todos), el signo de los −1 olvidado y el cociente al revés.
      const sinM = [val(t1, false), val(t2, false), val(t3, false)], dSinM = sinM[2] === null ? null : sinM[2] + d;
      const abs = [t1, t2, t3].map(([c, fn, k]) => c * Math.abs(valorEje(fn, T * k)));
      const errs = [
        sinM.every(v => v !== null) && dSinM ? { id: 'mult', texto: txt(cociente(sinM[0] + sinM[1], 1, dSinM, 1)), error: 'RN-SIN-MULTIPLO', siFuera: `Los ejes están bien; pero cada razón lleva su múltiplo de θ: sin él sale ${txt(cociente(sinM[0] + sinM[1], 1, dSinM, 1))}.` } : null,
        abs[2] + d ? { id: 'signo', texto: txt(cociente(abs[0] + abs[1], 1, abs[2] + d, 1)), error: 'TR12', siFuera: `Los ángulos están bien; sin los signos de los puntos sale ${txt(cociente(abs[0] + abs[1], 1, abs[2] + d, 1))}.` } : null,
        vals[0] + vals[1] ? { id: 'reves', texto: txt(cociente(den, 1, vals[0] + vals[1], 1)), error: 'RN-REVES', siFuera: `Arriba y abajo están bien calculados; ${txt(cociente(den, 1, vals[0] + vals[1], 1))} los da vuelta.` } : null,
        { id: 'indef', texto: 'No está definida', error: 'TRPN-CERO-INDEF', siFuera: 'Cada razón existe en su ángulo y el denominador no es 0: E sí tiene valor.' },
      ];
      const ops = opciones(txt(okC), errs);
      if (ops.length < 4) continue;
      const tt = ([c, fn, k], conSigno) => `${conSigno ? (c < 0 ? '− ' : '+ ') : ''}${Math.abs(c) === 1 ? '' : Math.abs(c) + ' '}${fn} ${k === 1 ? 'θ' : k === 0.5 ? '(θ/2)' : k === 1.5 ? '(3θ/2)' : k + 'θ'}`;
      const e = `E = (${tt(t1)} ${tt(t2, true)})/(${tt(t3)}${d ? ' + ' + d : ''})`;
      return {
        pregunta: `Si θ = ${T}°, calcula ${e}.`,
        datos: [D.def, D.rec, DC.eje],
        dibujo: fig(planoEjes([t1, t2, t3].map(([, , k]) => T * k))),
        opciones: ops,
        solucion: { texto: `Cada ángulo cae sobre un eje: ${[t1, t2, t3].map(([c, fn, k]) => `${fn} ${f(T * k)}° = ${ejeTxt(valorEje(fn, T * k))}`).join('; ')}.`, ecuacion: junto(['E = ', frac(f(vals[0] + vals[1]), f(den)), ' = ', dF(txt(okC))]) },
      };
    }
    throw new Error('casoMultiplos: sin caso');
  }
  const RES3 = [[2, 'sen', 90, 3, 'cos', 180, 'sec', 0], [4, 'cos', 0, 1, 'sen', 270, 'csc', 90], [1, 'sen', 270, 2, 'cos', 360, 'sec', 180], [3, 'cos', 180, 2, 'sen', 90, 'csc', 270]];
  const cuadrantales = {
    id: 'cuadrantales',
    titulo: 'Cero no es «no definida»',
    pregunta: '¿Qué pasa con una razón cuando el lado final cae sobre un eje?',
    temas: ['Ángulos cuadrantales'],
    pieza: PZ,
    aprendizaje: 'Sobre un eje, una coordenada vale 0: con el 0 arriba la razón vale 0; con el 0 abajo, no está definida.',
    actividad: 'Girar la flecha de una veleta hacia el este, el norte, el oeste y el sur.',
    lee: {
      tarjetas: [
        { titulo: 'La veleta de la plaza', texto: 'Vista desde arriba, la veleta es una cruz con los cuatro puntos cardinales y una flecha que gira. El origen va en el poste, y el eje x apunta al este. La punta de la flecha es P, a 40 cm del poste.',
          pieza: PZ, dibujo: { datos: Object.assign(veleta(0, { rotP: 'P' }), { alt: 'Veleta vista desde arriba con la flecha hacia el este' }), estado: {} } },
        { titulo: 'En la frontera', texto: 'Cuando el lado final cae justo sobre un eje, como en 0°, 90°, 180° o 270°, el ángulo se llama cuadrantal. No está dentro de ningún cuadrante: queda en la frontera entre dos.' },
        { titulo: 'Un punto con un 0', texto: ['Sobre un eje, una coordenada de P vale 0. Al norte, P(0, 40): ', X, ' = 0. Al oeste, P(−40, 0): ', Y, ' = 0. r sigue siendo 40.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Gira la flecha de 90° en 90°. Anota qué coordenada vale 0 y cuánto dan el seno y el coseno.' },
      ],
    },
    ejemplos: EJEMPLOS_3,
    juega: {
      consigna: ['La flecha mide 40 cm y su punta es P. ', th, ' se mide desde el este, en sentido antihorario.'],
      mision: {
        texto: 'Haz que el coseno valga −1.',
        logrado: val => val.g === 180,
        bien: 'Listo: al oeste, P(−40, 0) y cos θ = −40/40 = −1.',
      },
      voz: '¿Qué coordenada se vuelve 0 en cada eje?',
      leyenda: [
        { s: th, t: 'giro de la flecha desde el este' },
        { s: 'P', t: 'la punta de la flecha' },
        { s: X, t: 'hacia el este (+) o el oeste (−), en cm' },
        { s: Y, t: 'hacia el norte (+) o el sur (−), en cm' },
        { s: 'N, E, S, O', t: 'norte, este, sur y oeste' },
      ],
      controles: [{ id: 'g', etiqueta: 'θ, giro de la flecha', color: 'c-h', min: 0, max: 360, paso: 90, inicio: 0, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: veleta(val.g), estado: {} }),
      lectura: val => {
        const [x, y] = ejeDe(val.g).map(c => c * RV);
        return junto(['sen ', th, ` = ${f(y)}/40 = ${f(y / RV)}; cos `, th, ` = ${f(x)}/40 = ${f(x / RV)}`]);
      },
      minimo: 3,
      arrastres: [{ id: 'flecha', etiqueta: 'la punta de la flecha', color: 'c-h',
        donde: val => { const [x, y] = ejeDe(val.g); return TP().enPx(veleta(val.g), x * RV, y * RV); },
        mover: (pt, val) => { const a = TP().anguloDe(veleta(val.g), pt, { cerca: val.g }); return { g: Math.max(0, Math.min(360, 90 * Math.round(a / 90))) }; } }],
    },
    predice: {
      pregunta: 'La flecha apunta al norte: θ = 90° y su punta está en P(0, 40). ¿Cuánto vale tan θ?',
      datos: ['P(0, 40): x = 0, y = 40, r = 40 cm.'],
      voz: 'Escribe el cociente antes de decidir.',
      opciones: [
        { id: 'c', texto: 'No está definida', correcta: true },
        { id: 'cero', texto: '0', error: 'TRPN-TAN-CERO', siFuera: 'El 0 sí aparece, pero abajo: 40/0 no es 0. Sería 0 con el 0 arriba.' },
        { id: 'uno', texto: '1', error: 'TR11', siFuera: '40/40 = 1 es y/r, el seno. La tangente divide y entre x = 0.' },
        { id: 'infinito', texto: 'Un número infinitamente grande', error: 'TRPN-INFINITO', siFuera: 'Cerca de 90° la tangente crece sin tope. Pero en 90° no hay número: es 40/0.' },
      ],
      dibujo: { datos: veleta(90), estado: {} },
      revelar: { datos: veleta(90, { extra: { rotulos: [{ x: -34, y: 22, texto: 'tan 90° = 40/0', color: 'f' }, { x: -34, y: 12, texto: 'no está definida', color: 'f' }] } }), estado: {} },
      coincide: 'Coincide: entre 0 no se puede dividir.',
      noCoincide: 'Revisemos dónde está el 0 en el cociente y/x.',
    },
    mira: {
      datos: veleta(90, { extra: { rotulos: [{ x: 14, y: 22, texto: 'x = 0', color: 'i', desde: 1 }, { x: -34, y: 30, texto: 'tan: 40/0', desde: 2 }, { x: -34, y: 20, texto: 'cot: 0/40 = 0', desde: 3 }, { x: -34, y: -22, texto: 'sec: 40/0', desde: 4 }, { x: -34, y: -32, texto: 'csc: 40/40 = 1', desde: 4 }] } }),
      voz: 'Mira dónde queda el 0 en cada cociente.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Al norte, la punta está sobre el eje y: x vale 0.', ecuacion: junto(['P(', X, ', ', Y, ') = (0, 40)']) },
        { estado: { corte: 2 }, texto: 'La tangente pide dividir entre x = 0: no está definida.', ecuacion: junto(['tan 90° = ', frac('40', '0'), ': no está definida']) },
        { estado: { corte: 3 }, texto: 'La cotangente tiene el 0 arriba: vale 0.', ecuacion: junto(['cot 90° = ', frac('0', '40'), ' = 0']) },
        { estado: { corte: 4 }, texto: 'La secante tampoco está definida; la cosecante vale 1.', ecuacion: [junto(['sec 90° = ', frac('40', '0')]), SEP, junto(['csc 90° = ', frac('40', '40'), ' = 1'])] },
      ],
    },
    regla: {
      texto: 'Sobre un eje, una coordenada de P vale 0. Si ese 0 queda arriba del cociente, la razón vale 0; si queda abajo, no está definida.',
      ecuacion: [junto([{ llave: [frac('0', 'a')], nota: 'cero arriba' }, ' = 0']), SEP, junto([{ llave: [frac('a', '0')], nota: 'cero abajo' }, ': no está definida'])],
      condicion: 'a = r, la distancia al origen. Con x = 0, tan y sec no están definidas; con y = 0, cot y csc.',
      voz: 'Cero es un valor; «no está definida» es que no hay valor.',
      dibujo: { pieza: PZ, datos: { ventana: { x: [-64, 64], y: [-64, 64] }, objeto: { tipo: 'veleta', r: RV },
        puntos: [{ x: 40, y: 0, rotulo: '0°: (a, 0)', lado: 's' }, { x: 0, y: 40, rotulo: '90°: (0, a)', lado: 'e' }, { x: -40, y: 0, rotulo: '180°: (−a, 0)', lado: 's' }, { x: 0, y: -40, rotulo: '270°: (0, −a)', lado: 'e' }],
        alt: 'Los cuatro ángulos cuadrantales con sus puntos: 0 grados (a, 0), 90 (0, a), 180 (menos a, 0) y 270 (0, menos a)' }, estado: {} },
    },
    resuelve: {
      generar(sem) {
        const [p, f1, A, q, f2, B, f3, C] = RES3[((sem % RES3.length) + RES3.length) % RES3.length];
        const v1 = valorEje(f1, A), v2 = valorEje(f2, B), v3 = valorEje(f3, C), num = p * v1 + q * v2;
        const ok = txt(cociente(num, 1, v3, 1));
        return {
          enunciado: `Calcula E = (${p === 1 ? '' : p + ' '}${f1} ${A}° + ${q === 1 ? '' : q + ' '}${f2} ${B}°)/${f3} ${C}°.`,
          datos: [D.def, D.rec, DC.eje],
          dibujo: fig(planoEjes([A, B, C])),
          pasos: [
            { tipo: 'pide', texto: ['Piden el valor de E, que solo tiene razones de ángulos sobre los ejes.'] },
            { tipo: 'datos', texto: [`Los puntos: ${A}° da ${({ 0: '(a, 0)', 90: '(0, a)', 180: '(−a, 0)', 270: '(0, −a)', 360: '(a, 0)' })[A]}; ${B}°, ${({ 0: '(a, 0)', 90: '(0, a)', 180: '(−a, 0)', 270: '(0, −a)', 360: '(a, 0)' })[B]}; ${C}°, ${({ 0: '(a, 0)', 90: '(0, a)', 180: '(−a, 0)', 270: '(0, −a)', 360: '(a, 0)' })[C]}.`] },
            { tipo: 'regla', texto: ['Cada razón es un cociente con x, y, r = a: la a se simplifica y queda 0, 1 o −1.'] },
            { tipo: 'cuentas', texto: [`${f1} ${A}° = ${ejeTxt(v1)}, ${f2} ${B}° = ${ejeTxt(v2)} y ${f3} ${C}° = ${ejeTxt(v3)}.`],
              ecuacion: junto(['E = ', frac(`${p} · (${ejeTxt(v1)}) + ${q} · (${ejeTxt(v2)})`, `${ejeTxt(v3)}`), ' = ', dF(ok)]) },
            { tipo: 'sentido', texto: ['El denominador no es 0: E sí tiene valor.'] },
          ],
          respuesta: ['E = ', dF(ok)],
        };
      },
    },
    ahoraTu: {
      voz: 'Escribe el punto del eje; después, el cociente.',
      generar(sem) { return sinRepetir([casoEje, casoExprEje, casoMultiplos][((sem % 3) + 3) % 3], sem, cuadrantales); },
    },
  };

  // ====================================================================================================================
  // Idea 4: el giro horario va con menos
  // ====================================================================================================================
  // Objeto de la primera pantalla: el reloj de pared; el centro es el origen, el lado inicial apunta al 3 y el minutero
  // gira en sentido horario. Cambia: el giro θ, de 0° a −180°, de 30° en 30° (un número por paso). · Permanece: el reloj.
  // · Progresa: en qué cuadrante queda el minutero. · Se reserva: −300° (la predicción, fuera de la grilla). · Debe verse:
  // el giro horario pasa primero por el IV.
  // Errores: TR15 (mide el negativo en sentido antihorario: olvida el signo), TRIG-NEGATIVO (un negativo no se ubica),
  // TRNEG-180 (suma media vuelta en vez de una), TRNEG-TODO-NEG (un ángulo negativo tiene razones negativas), hipótesis.
  const RL = 5, LM = 4.2;
  const numReloj = g => { const k = Math.round(mod360(90 - g) / 30) % 12; return k === 0 ? 12 : k; };   // número al que apunta
  function reloj(g, o = {}) {
    const x = LM * Math.cos(rad(g)), y = LM * Math.sin(rad(g)), d = figGiro(g, Object.assign({ L: LM, V: 6.4, espiral: 6, rArco: 1.1, objeto: { tipo: 'reloj', r: RL } }, o));
    if (o.sinLado) d.puntos = [];
    d.alt = o.alt || `Reloj de pared: el minutero giró ${f(g)} grados desde el 3 y apunta al ${numReloj(g)}`;
    if (!o.sinLado) d.puntos = [{ x, y, rotulo: o.rotP === undefined ? 'P' : o.rotP, lado: y >= -1e-9 ? (x >= -1e-9 ? 'ne' : 'no') : (x >= 0 ? 'se' : 'so') }];
    return d;
  }
  const ALT4 = {
    cuenta: ['0', '1', '2', '3', '4'],
    expr: ['0', '2', '−2', '−1', '−3'],
    min40: ['240°, III', '−240°, III', '−120°, III', '−240°, IV', '−240°, II'],
    rango: ['−90° < θ < 0°', '−180° < θ < −90°', '90° < θ < 180°', '−270° < θ < −180°', '−360° < θ < −270°'],
    punto: ['entre −180° y −90°; −8/17', 'entre −90° y 0°; 8/17', 'entre −270° y −180°; −8/17', 'entre −180° y −90°; 8/17', 'entre −180° y −90°; −15/17'],
  };
  const EJEMPLOS_4 = [
    { nivel: 1, titulo: 'Un giro de −40°', figura: fig(planoPide('θ = −40°')),
      enunciado: '¿En qué cuadrante termina el lado final de θ = −40°?',
      datos: [DC.neg, DC.cuad],
      solucion: [{ texto: ['Desde el eje x positivo, en sentido horario: entre 0° y −90° se recorre el cuadrante de abajo a la derecha.'], ecuacion: junto(['−90° < −40° < 0°']) }],
      respuesta: [neg('Cuadrante IV')] },
    { nivel: 1, titulo: 'Un giro de −130°', figura: fig(planoPide('θ = −130°')),
      enunciado: '¿En qué cuadrante termina el lado final de θ = −130°?',
      datos: [DC.neg, DC.cuad],
      solucion: [{ texto: ['Pasa −90° (el eje y negativo) y no llega a −180°: abajo a la izquierda.'], ecuacion: junto(['−180° < −130° < −90°']) }],
      respuesta: [neg('Cuadrante III')] },
    { nivel: 1, titulo: 'Del 3 al 5', figura: fig(reloj(-60, { rotTheta: '?' })),
      enunciado: 'El minutero de un reloj de pared pasa del 3 al 5. Con el lado inicial en el 3, ¿qué ángulo θ gira?',
      datos: [DC.reloj, DC.neg],
      solucion: [{ texto: ['Del 3 al 5 hay dos espacios entre números: 2 · 30° = 60°. El minutero gira en sentido horario: el ángulo es negativo.'], ecuacion: junto([th, ' = ', dH('−60°')]) }],
      respuesta: [th, ' = ', dH('−60°')] },
    { nivel: 1, titulo: 'El seno de −90°', figura: fig(figGiro(-90, { rotP: 'P', ladoP: 'e' })),
      enunciado: 'El lado final de θ = −90° cae sobre el eje y negativo. ¿Cuánto vale sen θ?',
      datos: [D.def, DC.neg],
      solucion: [{ texto: ['Un cuarto de vuelta horario: P(0, −a), con r = a.'], ecuacion: junto(['sen(−90°) = ', frac(dO('−a'), 'a'), ' = ', dF('−1')]) }],
      respuesta: ['sen(−90°) = ', dF('−1')] },
    { nivel: 1, titulo: 'Un giro de −250°', figura: fig(planoPide('θ = −250°')),
      enunciado: '¿En qué cuadrante termina el lado final de θ = −250°?',
      datos: [DC.neg, DC.cuad],
      solucion: [{ texto: ['Pasa −180° (el eje x negativo) y no llega a −270°: arriba a la izquierda.'], ecuacion: junto(['−270° < −250° < −180°']) }],
      respuesta: [neg('Cuadrante II')] },
    { nivel: 2, titulo: 'Con un punto', figura: fig(figP(4, -4, { giro: -45, rot: { p: 'P' } })),
      enunciado: 'El lado final de θ = −45° pasa por P(4, −4). ¿Cuánto vale tan θ?',
      datos: [D.def, DC.neg],
      solucion: [{ texto: ['Las razones de un negativo salen de su P, como siempre:'], ecuacion: junto(['tan(−45°) = ', frac(dO('−4'), dI('4')), ' = ', dF('−1')]) }],
      respuesta: ['tan(−45°) = ', dF('−1')] },
    { nivel: 2, titulo: 'Veinte minutos', figura: fig(reloj(0, { sinLado: true, sinArco: true })),
      enunciado: 'A las 4:15, el minutero apunta al 3. ¿Qué ángulo θ gira hasta las 4:35 y en qué cuadrante queda?',
      datos: [DC.reloj, DC.neg, DC.cuad],
      solucion: [
        { texto: ['En 20 minutos avanza 4 espacios, del 3 al 7: 4 · 30° = 120°, en sentido horario.'], ecuacion: junto([th, ' = −120°']) },
        { texto: ['Entre −90° y −180°: abajo a la izquierda.'] },
      ],
      respuesta: [th, ' = ', dH('−120°'), ', ', neg('cuadrante III')] },
    { nivel: 2, titulo: 'El coseno de −180°', figura: fig(figGiro(-180, { rotP: 'P', ladoP: 's' })),
      enunciado: '¿Cuánto vale cos(−180°)?',
      datos: [D.def, DC.neg, DC.vuelta],
      solucion: [{ texto: ['Media vuelta horaria: el lado final va por el eje x negativo, P(−a, 0).'], ecuacion: junto(['cos(−180°) = ', frac(dI('−a'), 'a'), ' = ', dF('−1')]) }],
      respuesta: ['cos(−180°) = ', dF('−1')] },
    { nivel: 2, titulo: 'Los signos de −200°', figura: fig(figGiro(-200)),
      enunciado: '¿Qué signos tienen sen θ y cos θ para θ = −200°?',
      datos: [D.def, DC.neg, DC.cuad],
      solucion: [
        { texto: ['−200° pasa −180° y no llega a −270°: cuadrante II, x < 0 e y > 0.'] },
        { texto: ['El seno lleva el signo de y; el coseno, el de x.'] },
      ],
      respuesta: [neg('sen θ positivo, cos θ negativo')] },
    { nivel: 2, titulo: 'Con P(1, √3)', figura: fig(figP(1, Math.sqrt(3), { giro: -300, ventana: { x: [-2.4, 2.4], y: [-2.4, 2.4] }, rot: { p: 'P(1, √3)' } })),
      enunciado: 'El lado final de θ = −300° pasa por P(1, √3). ¿Cuánto vale sen θ?',
      datos: [D.def, D.r],
      solucion: [
        { texto: ['r = √(1 + 3) = 2.'] },
        { texto: ['El seno, la ordenada entre r:'], ecuacion: junto(['sen(−300°) = ', frac(dO('√3'), '2'), ' = ', dF('√3/2')]) },
      ],
      respuesta: ['sen(−300°) = ', dF('√3/2')] },
    // Nivel 3, tipo examen. Letras de las correctas: B, C, E, D, A.
    { nivel: 3, titulo: '¿Cuántas positivas?', figura: fig(planoNeg()),
      enunciado: '¿Cuántas de estas razones son positivas: sen(−100°), cos(−200°), tan(−300°) y csc(−40°)?',
      alternativas: ALT4.cuenta,
      datos: [D.def, D.rec, DC.neg, DC.cuad],
      solucion: [
        { texto: ['−100°: III, y < 0, sen negativo. −200°: II, x < 0, cos negativo.'] },
        { texto: ['−300°: I, tan positiva. −40°: IV, y < 0, csc negativa. Solo una.'] },
        { texto: ['0 cree que un negativo da razones negativas; 2 gira en sentido antihorario; 3 cuenta las negativas; 4 da todas por positivas.'] },
      ],
      respuesta: [letra(ALT4.cuenta, '1'), ', 1'] },
    { nivel: 3, titulo: 'Tres razones negativas', figura: fig(planoEjes([-90, -180, -360])),
      enunciado: 'Calcula E = sen(−90°) + cos(−180°) − tan(−360°).',
      alternativas: ALT4.expr,
      datos: [D.def, DC.eje, DC.neg],
      solucion: [
        { texto: ['−90° da (0, −a): sen = −1. −180° da (−a, 0): cos = −1. −360° es una vuelta entera: (a, 0), tan = 0.'] },
        { texto: ['Se reemplaza:'], ecuacion: junto(['E = −1 + (−1) − 0 = ', dF('−2')]) },
        { texto: ['0 mide −90° como 90°; 2 olvida los signos de las coordenadas; −1 toma cos(−180°) = 0; −3 pone tan(−360°) = 1.'] },
      ],
      respuesta: [letra(ALT4.expr, '−2'), ', ', dF('−2')] },
    { nivel: 3, titulo: 'Cuarenta minutos', figura: fig(reloj(0, { sinLado: true, sinArco: true })),
      enunciado: 'El minutero sale del 3 y avanza 40 minutos. ¿Qué ángulo θ gira y en qué cuadrante termina?',
      alternativas: ALT4.min40,
      datos: [DC.reloj, DC.neg, DC.cuad],
      solucion: [
        { texto: ['En 40 minutos avanza 8 espacios: 8 · 30° = 240°, en sentido horario: θ = −240°. Termina en el 11.'] },
        { texto: ['Entre −180° y −270°: arriba a la izquierda, cuadrante II.'] },
        { texto: ['240°, III olvida el signo; −120° cuenta solo 4 números; −240°, III y −240°, IV cuentan mal los cuartos.'] },
      ],
      respuesta: [letra(ALT4.min40, '−240°, II'), ', ', dH('−240°'), ', II'] },
    { nivel: 3, titulo: 'Dos signos y un negativo', figura: fig(planoNeg()),
      enunciado: 'θ es negativo y mayor que −360°, con sen θ > 0 y cos θ < 0. ¿Entre qué valores está θ?',
      alternativas: ALT4.rango,
      datos: [D.def, DC.neg, DC.cuad],
      solucion: [
        { texto: ['sen θ > 0 y cos θ < 0: y > 0 y x < 0, cuadrante II.'] },
        { texto: ['En sentido horario, el II se recorre después del IV y del III: de −180° a −270°.'] },
        { texto: ['−90° a 0° es el IV; −180° a −90°, el III; 90° a 180° es el II con giro positivo; −360° a −270°, el I.'] },
      ],
      respuesta: [letra(ALT4.rango, '−270° < θ < −180°'), ', −270° < θ < −180°'] },
    { nivel: 3, titulo: 'Un negativo por su punto', figura: fig(figP(-8, -15, { giro: -118.07, rot: { p: 'P(−8, −15)' } })),
      enunciado: 'θ es negativo y mayor que −360°; su lado final pasa por P(−8, −15). ¿Entre qué valores está θ y cuánto vale cos θ?',
      alternativas: ALT4.punto,
      datos: [D.def, D.r, DC.neg, DC.cuad],
      solucion: [
        { texto: ['P está abajo a la izquierda: cuadrante III. En sentido horario, de −90° a −180°.'] },
        { texto: ['r = √(64 + 225) = 17:'], ecuacion: junto(['cos ', th, ' = ', frac(dI('−8'), '17'), ' = ', dF('−8/17')]) },
        { texto: ['−90° a 0° es el IV; −270° a −180°, el II; 8/17 olvida el signo de x; −15/17 es el seno.'] },
      ],
      respuesta: [letra(ALT4.punto, 'entre −180° y −90°; −8/17'), ', ', dF('−8/17')] },
  ];
  const ROM_NEG = g => cuadDe(g);
  function casoCuadNeg(rr) {
    let g = -10 * rr.ent(1, 35); while (g % 90 === 0) g -= 10;
    const q = cuadDe(g), qa = cuadDe(-g), q180 = cuadDe(g + 180);
    const errs = [
      { id: 'sin-signo', texto: `En el ${ROM[qa]}`, error: 'TR15', siFuera: `Medir ${-g}° está bien; pero el signo menos pide girar en sentido horario: termina en el ${ROM[q]}.` },
      { id: 'media', texto: `En el ${ROM[q180]}`, error: 'TRNEG-180', siFuera: `Buscar un ángulo positivo con el mismo lado está bien; pero se suma una vuelta, 360°, no 180°.` },
    ].concat([1, 2, 3, 4].filter(x => ![q, qa, q180].includes(x)).map(x => ({ id: `otro${x}`, texto: `En el ${ROM[x]}`, error: 'TRNEG-CUENTA', siFuera: `Girar en sentido horario está bien; cuenta los cuartos: −90°, −180°, −270°. ${g}° queda en el ${ROM[q]}.` })));
    return {
      pregunta: `¿En qué cuadrante termina el lado final de θ = ${f(g)}°?`,
      datos: [DC.neg, DC.cuad, DC.vuelta],
      dibujo: fig(planoNeg()),
      opciones: opciones(`En el ${ROM[q]}`, errs),
      solucion: { texto: `Horario: IV, III, II y I, un cuarto de vuelta cada uno. ${f(g)}° queda en el ${ROM[q]}.`, ecuacion: [neg(`Cuadrante ${ROM[q]}`)] },
    };
  }
  function casoRazonNeg(rr) {
    const g = rr.uno([-90, -180, -270, -360]), fn = rr.uno(FNS), v = valorEje(fn, g), ok = opEje(v), va = valorEje(fn, -g);
    const [x, y] = ejeDe(g);
    const errs = OPS_EJE.filter(t => t !== ok).map((t, i) => {
      if (t === opEje(va)) return { id: `d${i}`, texto: t, error: 'TR15', siFuera: `Ese es ${fn} ${-g}°, con el giro antihorario; ${g}° gira al revés y su punto es otro.` };
      if (t === 'No está definida') return { id: `d${i}`, texto: t, error: 'TRPN-CERO-INDEF', siFuera: `Sería así con el 0 abajo; en ${g}°, ${fn} no tiene 0 abajo.` };
      if (v === null) return { id: `d${i}`, texto: t, error: t === '0' ? 'TRPN-TAN-CERO' : 'TRPN-INFINITO', siFuera: `Ubicar ${g}° sobre el eje está bien; pero el 0 queda abajo del cociente: no hay número.` };
      return { id: `d${i}`, texto: t, error: 'TRNEG-TODO-NEG', siFuera: `Ubicar el eje está bien; el valor sale del punto (${x ? (x > 0 ? 'a' : '−a') : '0'}, ${y ? (y > 0 ? 'a' : '−a') : '0'}), no del signo de θ.` };
    });
    return {
      pregunta: `¿Cuánto vale ${fn}(${f(g)}°)?`,
      datos: [D.def].concat(['cot', 'sec', 'csc'].includes(fn) ? [D.rec] : [], [DC.neg, DC.eje]),
      dibujo: fig(figGiro(g, { rotP: 'P' })),
      opciones: opciones(ok, errs),
      solucion: { texto: `${f(g)}° gira en sentido horario y termina sobre un eje: P(${x ? (x > 0 ? 'a' : '−a') : '0'}, ${y ? (y > 0 ? 'a' : '−a') : '0'}).`, ecuacion: [junto(`${fn}(${f(g)}°) `), v === null ? 'no está definida' : junto(['= ', dF(ok)])] },
    };
  }
  function casoCuentaNeg(rr) {
    for (let i = 0; i < 80; i++) {
      const items = [0, 1, 2, 3].map(() => { let g = -10 * rr.ent(1, 35); while (g % 90 === 0) g -= 10; return [rr.uno(FNS), g]; });
      if (new Set(items.map(([, g]) => g)).size < 4) continue;
      const pos = gs => gs.filter(([fn, g]) => signoDe(fn, cuadDe(g)) > 0).length;
      const ok = pos(items), abs = pos(items.map(([fn, g]) => [fn, -g])), med = pos(items.map(([fn, g]) => [fn, g + 180]));
      const ops = opciones(String(ok), [
        { id: 'todo-neg', texto: '0', error: 'TRNEG-TODO-NEG', siFuera: 'Contar las positivas está bien; pero un ángulo negativo no hace negativas sus razones: deciden x e y.' },
        { id: 'sin-signo', texto: String(abs), error: 'TR15', siFuera: `Mirar cada cuadrante está bien; ${abs} sale de girar los ángulos en sentido antihorario.` },
        { id: 'media', texto: String(med), error: 'TRNEG-180', siFuera: `Buscar el cuadrante está bien; ${med} sale de sumar 180° en vez de 360°.` },
        { id: 'reves', texto: String(4 - ok), error: 'RN-REVES', siFuera: `Los cuadrantes están bien; ${4 - ok} cuenta las negativas, no las positivas.` },
      ]);
      if (ops.length < 4) continue;
      return {
        pregunta: `¿Cuántas de estas razones son positivas: ${items.map(([fn, g]) => `${fn}(${f(g)}°)`).join(', ')}?`,
        datos: [D.def, D.rec, DC.neg, DC.cuad],
        dibujo: fig(planoNeg()),
        opciones: ops,
        solucion: { texto: items.map(([fn, g]) => `${fn}(${f(g)}°): ${ROM[cuadDe(g)]}, ${sgTxt(signoDe(fn, cuadDe(g)))}`).join('; ') + '.', ecuacion: [neg(`${ok} positiva${ok === 1 ? '' : 's'}`)] },
      };
    }
    throw new Error('casoCuentaNeg: sin caso');
  }
  // «Así se resuelve» de la idea 4: un negativo con su punto. Las coordenadas van como c·√u: [cx, ux, cy, uy].
  const RES4 = [[-45, 3, 1, -3, 1], [-135, -2, 1, -2, 1], [-225, -4, 1, 4, 1], [-315, 5, 1, 5, 1], [-120, -1, 1, -1, 3], [-330, 1, 3, 1, 1]];
  const raizTxt = (c, u) => (u === 1 ? f(c) : `${c < 0 ? '−' : ''}${Math.abs(c) === 1 ? '' : Math.abs(c)}√${u}`);
  const giroHorario = {
    id: 'giro-horario',
    titulo: 'El giro horario va con menos',
    pregunta: '¿Dónde termina un ángulo negativo y de dónde salen sus razones?',
    temas: ['Ángulos negativos'],
    pieza: PZ,
    aprendizaje: 'Un ángulo negativo gira en sentido horario desde el eje x positivo: pasa primero por el IV; sus razones salen de su P.',
    actividad: 'Dejar avanzar el minutero de un reloj y medir su giro con signo menos.',
    lee: {
      tarjetas: [
        { titulo: 'El reloj del aula', texto: 'Pon el origen en el centro del reloj y el eje x hacia el 3. El minutero, cuando apunta al 3, está sobre el lado inicial. Al avanzar, gira en sentido horario.',
          pieza: PZ, dibujo: { datos: reloj(0, { sinArco: true, alt: 'Reloj de pared con el minutero en el 3, sobre el eje x positivo' }), estado: {} } },
        { titulo: 'Un giro con signo menos', texto: 'Como en «Ángulo trigonométrico», el giro antihorario es positivo y el horario, negativo. El minutero solo da giros negativos. Entre dos números del reloj hay 30°.' },
        { titulo: 'El mismo P de siempre', texto: ['Un ángulo negativo también tiene su lado final y su punto P(', X, ', ', Y, '). Sus razones salen de ahí, como en cualquier ángulo.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Deja avanzar el minutero y mira en qué cuadrante queda su punta, número por número.' },
      ],
    },
    ejemplos: EJEMPLOS_4,
    juega: {
      consigna: ['El minutero empieza en el 3, sobre el eje x positivo. ', th, ' es su giro, en sentido horario.'],
      mision: {
        texto: 'Haz que el minutero apunte al 8.',
        logrado: val => val.g === -150,
        bien: 'Listo: del 3 al 8 hay 5 espacios, 5 · 30° = 150°, en sentido horario: θ = −150°.',
      },
      voz: '¿Qué cuadrante recorre primero el giro horario?',
      leyenda: [
        { s: th, t: 'giro del minutero, horario y negativo' },
        { s: 'P', t: 'la punta del minutero' },
        { s: '3', t: 'el lado inicial: eje x positivo' },
      ],
      controles: [{ id: 'g', etiqueta: 'θ, giro del minutero', color: 'c-h', min: -180, max: 0, paso: 30, inicio: -30, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: reloj(val.g), estado: {} }),
      lectura: val => {
        const q = cuadDe(val.g);
        return junto([th, ` = ${f(val.g)}°: apunta al ${numReloj(val.g)}; ${q ? 'cuadrante ' + ROM[q] : 'sobre un eje'}`]);
      },
      minimo: 3,
      arrastres: [{ id: 'minutero', etiqueta: 'la punta del minutero', color: 'c-h',
        donde: val => TP().enPx(reloj(val.g), LM * Math.cos(rad(val.g)), LM * Math.sin(rad(val.g))),
        mover: (pt, val) => { const a = TP().anguloDe(reloj(val.g), pt, { cerca: val.g }); return { g: Math.max(-180, Math.min(0, 30 * Math.round(a / 30))) }; } }],
    },
    predice: {
      pregunta: 'El minutero del juego no pasa de −180°. ¿En qué cuadrante termina el lado final de θ = −300°?',
      datos: ['Entre dos números seguidos del reloj hay 30°.', 'Una vuelta mide 360°.'],
      voz: 'Sigue girando en sentido horario, cuarto por cuarto.',
      opciones: [
        { id: 'c', texto: 'En el I', correcta: true },
        { id: 'antihorario', texto: 'En el IV', error: 'TR15', siFuera: '300° termina en el IV si gira en sentido antihorario; con el signo menos gira al revés.' },
        { id: 'media', texto: 'En el III', error: 'TRNEG-180', siFuera: 'Buscar un ángulo positivo está bien; pero −300° + 180° no tiene el mismo lado final: es media vuelta.' },
        { id: 'no-existe', texto: 'En ninguno: un negativo no se ubica', error: 'TRIG-NEGATIVO', siFuera: 'Un ángulo negativo sí tiene lado final: es un giro horario, con su punto P.' },
      ],
      dibujo: { datos: reloj(0, { sinLado: true, sinArco: true, alt: 'Reloj con el lado inicial en el 3; el giro de menos 300 grados no está dibujado', rotulos: [{ x: 3.4, y: -5.9, texto: 'θ = −300°' }] }), estado: {} },
      revelar: { datos: reloj(-300, { rotulos: [{ x: 3.6, y: 5.4, texto: 'I' }] }), estado: {} },
      coincide: 'Coincide: pasa el IV, el III y el II, y termina en el I, en el 1 del reloj.',
      noCoincide: 'Revisemos: el giro horario recorre el IV, el III, el II y, al final, el I.',
    },
    mira: {
      datos: (() => {
        const d = reloj(-300, { sinArco: true });
        d.arcos = [{ de: 0, a: -90, r: 0.45, color: 'h', rotulo: '−90°', desde: 1, hasta: 1 }, { de: 0, a: -180, r: 0.45, color: 'h', rotulo: '−180°', desde: 2, hasta: 2 },
          { de: 0, a: -270, r: 0.45, color: 'h', rotulo: '−270°', desde: 3, hasta: 3 }, { de: 0, a: -300, r: 0.45, espiral: 6, color: 'h', rotulo: '−300°', desde: 4 }];
        d.rotulos = [];
        d.segmentos = d.segmentos.map(s => Object.assign({}, s, { desde: 4 }))
          .concat([-90, -180, -270].map((g, k) => ({ de: [0, 0], a: [LM * Math.cos(rad(g)), LM * Math.sin(rad(g))], grosor: 'variable', desde: k + 1, hasta: k + 1 })));
        // Sobre un eje, el minutero se confunde con él: su punta lleva un punto en el 6, el 9 y el 12.
        d.puntos = d.puntos.map(p => Object.assign({}, p, { desde: 4 }))
          .concat([-90, -180, -270].map((g, k) => ({ x: LM * Math.cos(rad(g)), y: LM * Math.sin(rad(g)), desde: k + 1, hasta: k + 1 })));
        d.alt = 'Reloj: el giro horario de menos 300 grados pasa los cuartos de menos 90, menos 180 y menos 270 y termina en el 1';
        return d;
      })(),
      voz: 'Cuarto por cuarto, en sentido horario.',
      pasos: [
        { estado: { corte: 1 }, texto: 'De 0° a −90°, el minutero recorre el IV: del 3 al 6.', ecuacion: junto(['−90° < ', th, ' < 0°: IV']) },
        { estado: { corte: 2 }, texto: 'De −90° a −180°, el III: del 6 al 9.', ecuacion: junto(['−180° < ', th, ' < −90°: III']) },
        { estado: { corte: 3 }, texto: 'De −180° a −270°, el II: del 9 al 12.', ecuacion: junto(['−270° < ', th, ' < −180°: II']) },
        { estado: { corte: 4 }, texto: '−300° pasa −270° sin llegar a −360°: queda en el I.', ecuacion: junto(['−360° < −300° < −270°']) },
        { estado: { corte: 4 }, texto: 'Una vuelta más lleva −300° a un giro positivo con el mismo lado final.', ecuacion: junto(['−300° + 360° = 60°']) },
      ],
    },
    regla: {
      texto: 'Un ángulo negativo gira en sentido horario desde el eje x positivo: recorre primero el IV, después el III, el II y el I.',
      ecuacion: [junto(['−90° < ', th, ' < 0°: IV']), SEP, junto(['−180° < ', th, ' < −90°: III']), SEP, junto(['−270° < ', th, ' < −180°: II']), SEP, junto(['−360° < ', th, ' < −270°: I'])],
      condicion: 'θ entre 0° y −360°; con más de una vuelta hacia atrás, el orden se repite.',
      voz: 'El signo dice el sentido. El valor de una razón sale, como siempre, de un punto P del lado final.',
      dibujo: { pieza: PZ, datos: { ventana: { x: [-6.4, 6.4], y: [-6.4, 6.4] }, objeto: { tipo: 'reloj', r: RL, numeros: false },
        rotulos: [{ x: 1.6, y: -1.5, texto: '1.º IV' }, { x: -1.6, y: -1.5, texto: '2.º III' }, { x: -1.6, y: 1.9, texto: '3.º II' }, { x: 1.6, y: 1.9, texto: '4.º I' }],
        alt: 'Reloj con los cuatro cuadrantes numerados en el orden del giro horario: primero el IV, después el III, el II y el I' }, estado: {} },
    },
    resuelve: {
      generar(sem) {
        const [g, cx, ux, cy, uy] = RES4[((sem % RES4.length) + RES4.length) % RES4.length], fn = ['sen', 'cos', 'tan'][((sem % 3) + 3) % 3];
        const x = cx * Math.sqrt(ux), y = cy * Math.sqrt(uy), tx = [raizTxt(cx, ux), raizTxt(cy, uy)], q = cuadDe(g);
        const [s0, t0] = sinCuad(cx * cx * ux + cy * cy * uy);
        const ok = txt({ sen: cociente(cy, uy, s0, t0), cos: cociente(cx, ux, s0, t0), tan: cociente(cy, uy, cx, ux) }[fn]);
        const rt = t0 === 1 ? f(s0) : `${s0 === 1 ? '' : s0}√${t0}`;
        return {
          enunciado: `El lado final de θ = ${f(g)}° pasa por P(${tx[0]}, ${tx[1]}). ¿Cuánto vale ${fn} θ?`,
          datos: [D.def, D.r, DC.neg],
          dibujo: fig(figP(x, y, { giro: g, rot: { p: 'P' } })),
          pasos: [
            { tipo: 'pide', texto: [`Piden ${fn} θ de un ángulo negativo.`] },
            { tipo: 'datos', texto: [`${f(g)}° gira en sentido horario y termina en el cuadrante ${ROM[q]}; P(${tx[0]}, ${tx[1]}) está ahí.`] },
            { tipo: 'regla', texto: ['Las razones de un ángulo negativo salen de su P, como las de cualquier ángulo.'], ecuacion: [defDe(fn)] },
            { tipo: 'cuentas', texto: [`r = ${rt}. Se reemplaza:`], ecuacion: junto([`${fn}(${f(g)}°) = `, dF(ok)]) },
            { tipo: 'sentido', texto: [`El signo cuadra con el cuadrante ${ROM[q]}: no depende del signo de θ, sino de x e y.`] },
          ],
          respuesta: [`${fn}(${f(g)}°) = `, dF(ok)],
        };
      },
    },
    ahoraTu: {
      voz: 'Gira en sentido horario, cuarto por cuarto.',
      generar(sem) { return sinRepetir([casoCuadNeg, casoRazonNeg, casoCuentaNeg][((sem % 3) + 3) % 3], sem, giroHorario); },
    },
  };

  // ====================================================================================================================
  // Idea 5: más vueltas, mismo lado final
  // ====================================================================================================================
  // Objeto de la primera pantalla: una rueda de bicicleta con su válvula (P).
  // Cambia: el giro base θ (de 45° en 45°) y las vueltas n (de −2 a 2). · Permanece: dónde queda la válvula si solo cambia
  // n. · Progresa: el giro total θ + 360° · n. · Se reserva: las razones de un giro de más de una vuelta (la predicción). ·
  // Debe verse: las vueltas enteras no mueven el lado final.
  // Errores: TR10 (la razón crece con el ángulo), TRCOT-SIGNO (cada vuelta cambia el signo), TRIG-MAYOR (pasar de 360° no
  // tiene razones), TR15 (el signo de un negativo), RN-UNA-VUELTA (quita una vuelta de más o de menos), RN-K (divide entre k
  // en vez de k − 1), hipótesis salvo TR10 y TR15.
  const RB = 4;
  function bici(T, o = {}) {
    const g = mod360(T), d = figGiro(T, Object.assign({ L: RB * 0.9, V: 5.4, espiral: 6, rArco: 0.9, objeto: { tipo: 'bici', r: RB, valvula: g } }, o));
    d.alt = o.alt || `Rueda de bicicleta: giró ${fa(T)} grados y la válvula quedó en el mismo lugar que con ${fa(g)} grados`;
    return d;
  }
  // La rueda antes de girar, con el giro escrito: dibujado, su lado final mostraría el coterminal que se pide.
  // P dice que la rueda todavía no giró (lector B: «dice θ = −60° y P está en 0°»).
  const antesDe = t => bici(0, { sinArco: true, rotP: 'P al empezar', ladoP: 's', rotulos: [{ x: 2.6, y: -4.95, texto: `θ = ${t}` }], alt: `Rueda de bicicleta antes de girar ${t}, con la válvula a la derecha del eje` });
  const ALT5 = {
    beta: ['90°', '180°', '450°', '72°', '900°'],
    expr: ['1/2', '5/2', '3/2', '−1/2', '−3/2'],
    atras: ['−990°; abajo', '−990°; a la derecha', '990°; arriba', '−990°; arriba', '−270°; arriba'],
    suma: ['680°', '140°', '500°', '860°', '320°'],
    area: ['150 m²', '−300 m²', '300 m²', '600 m²', '−150 m²'],
  };
  const EJEMPLOS_5 = [
    { nivel: 1, titulo: '50° y 410°', figura: fig(bici(410)),
      enunciado: '¿Son coterminales 50° y 410°?',
      datos: [DC.cot],
      solucion: [{ texto: ['Su diferencia es una vuelta entera:'], ecuacion: junto(['410° − 50° = 360° = 360° · 1']) }],
      respuesta: [neg('Sí: n = 1')] },
    { nivel: 1, titulo: 'Coterminal de 400°', figura: fig(antesDe('400°')),
      enunciado: '¿Qué ángulo entre 0° y 360° es coterminal con 400°?',
      datos: [DC.cot],
      solucion: [{ texto: ['Se quita una vuelta:'], ecuacion: junto(['400° − 360° = ', dH('40°')]) }],
      respuesta: [dH('40°')] },
    { nivel: 1, titulo: 'Coterminal de −60°', figura: fig(antesDe('−60°')),
      enunciado: '¿Qué ángulo entre 0° y 360° es coterminal con −60°?',
      datos: [DC.cot, DC.neg],
      solucion: [{ texto: ['Se suma una vuelta:'], ecuacion: junto(['−60° + 360° = ', dH('300°')]) }],
      respuesta: [dH('300°')] },
    { nivel: 1, titulo: 'El seno de 390°', figura: fig(bici(390)),
      enunciado: '¿Cuánto vale sen 390°?',
      datos: [DC.cot, DC.not],
      solucion: [{ texto: ['390° = 30° + 360°: el mismo lado final que 30°, las mismas razones.'], ecuacion: junto(['sen 390° = sen 30° = ', dF('1/2')]) }],
      respuesta: ['sen 390° = ', dF('1/2')] },
    { nivel: 1, titulo: 'El coseno de 720°', figura: fig(bici(720)),
      enunciado: '¿Cuánto vale cos 720°?',
      datos: [DC.cot, DC.eje],
      solucion: [{ texto: ['720° = 0° + 2 · 360°: dos vueltas enteras, el lado final del eje x positivo, (a, 0).'], ecuacion: junto(['cos 720° = cos 0° = ', dF('1')]) }],
      respuesta: ['cos 720° = ', dF('1')] },
    { nivel: 2, titulo: 'Coterminal de 1000°', figura: fig(antesDe('1000°')),
      enunciado: '¿Qué ángulo entre 0° y 360° es coterminal con 1000°?',
      datos: [DC.cot],
      solucion: [
        { texto: ['¿Cuántas vueltas enteras caben? 1000 ÷ 360 da 2 y sobra.'] },
        { texto: ['Se quitan dos vueltas:'], ecuacion: junto(['1000° − 720° = ', dH('280°')]) },
      ],
      respuesta: [dH('280°')] },
    { nivel: 2, titulo: 'Coterminal de −750°', figura: fig(antesDe('−750°')),
      enunciado: '¿Qué ángulo entre 0° y 360° es coterminal con −750°?',
      datos: [DC.cot, DC.neg],
      solucion: [
        { texto: ['Con dos vueltas no alcanza: −750° + 720° = −30°, todavía negativo.'] },
        { texto: ['Se suman tres vueltas:'], ecuacion: junto(['−750° + 1080° = ', dH('330°')]) },
      ],
      respuesta: [dH('330°')] },
    { nivel: 2, titulo: '1110° y −330°', figura: fig(planoCuad()),
      enunciado: '¿Son coterminales 1110° y −330°?',
      datos: [DC.cot],
      solucion: [
        { texto: ['Se restan:'], ecuacion: junto(['1110° − (−330°) = 1440°']) },
        { texto: ['1440 ÷ 360 = 4, entero: son coterminales, con n = 4.'] },
      ],
      respuesta: [neg('Sí: n = 4')] },
    { nivel: 2, titulo: 'La tangente de 405°', figura: fig(bici(405)),
      enunciado: '¿Cuánto vale tan 405°?',
      datos: [DC.cot, DC.not],
      solucion: [
        { texto: ['405° − 360° = 45°: el mismo lado final.'] },
        { texto: ['Las razones son las de 45°:'], ecuacion: junto(['tan 405° = tan 45° = ', dF('1')]) },
      ],
      respuesta: ['tan 405° = ', dF('1')] },
    { nivel: 2, titulo: 'Dos ángulos de los ejes', figura: fig(planoCuad()),
      enunciado: 'Calcula E = sen 450° + cos 540°.',
      datos: [DC.cot, DC.eje, D.def],
      solucion: [
        { texto: ['450° = 90° + 360° y 540° = 180° + 360°.'] },
        { texto: ['sen 90° = 1 y cos 180° = −1:'], ecuacion: junto(['E = 1 + (−1) = ', dF('0')]) },
      ],
      respuesta: ['E = ', dF('0')] },
    // Nivel 3, tipo examen. Letras de las correctas: B, A, D, E, C.
    { nivel: 3, titulo: 'Uno es el quíntuple del otro', figura: fig(planoCuad()),
      enunciado: 'α y β son coterminales, α = 5β y β está entre 100° y 200°. ¿Cuánto mide β?',
      alternativas: ALT5.beta,
      datos: [DC.cot],
      solucion: [
        { texto: ['α − β = 360° · n: 5β − β = 4β = 360° · n, así que β = 90° · n.'] },
        { texto: ['Entre 100° y 200°, solo n = 2:'], ecuacion: junto([be, ' = 90° · 2 = ', dH('180°')]) },
        { texto: ['90° sale de n = 1 (no llega a 100°); 450° y 900° son α con n = 1 y n = 2; 72° divide 360° entre 5 en vez de 4.'] },
      ],
      respuesta: [letra(ALT5.beta, '180°'), ', ', dH('180°')] },
    { nivel: 3, titulo: 'Tres vueltas en una suma', figura: fig(planoCuad()),
      enunciado: 'Calcula E = sen 750° + cos 1080° − tan 405°.',
      alternativas: ALT5.expr,
      datos: [DC.cot, DC.not, DC.eje],
      solucion: [
        { texto: ['750° = 30° + 720°; 1080° = 0° + 1080°; 405° = 45° + 360°.'] },
        { texto: ['Se reemplaza:'], ecuacion: junto(['E = ', frac('1', '2'), ' + 1 − 1 = ', dF('1/2')]) },
        { texto: ['5/2 suma la tangente; 3/2 toma tan 45° = 0; −1/2 cambia el signo del seno por las vueltas; −3/2 toma cos 1080° = −1.'] },
      ],
      respuesta: [letra(ALT5.expr, '1/2'), ', ', dF('1/2')] },
    { nivel: 3, titulo: 'La rueda que va hacia atrás', figura: fig(bici(0, { sinArco: true, alt: 'Rueda de bicicleta con la válvula a la derecha del eje, al empezar' })),
      enunciado: 'Una rueda de bicicleta gira hacia atrás (sentido horario) 2 vueltas y 3/4 de vuelta. La válvula empezó a la derecha del eje. ¿Qué ángulo θ giró y dónde quedó la válvula?',
      alternativas: ALT5.atras,
      datos: [DC.cot, DC.neg, DC.vuelta],
      solucion: [
        { texto: ['2 vueltas y 3/4: 720° + 270° = 990°, en sentido horario: θ = −990°.'] },
        { texto: ['Coterminal: −990° + 1080° = 90°: la válvula queda arriba.'], ecuacion: junto(['−990° + 360° · 3 = ', dH('90°')]) },
        { texto: ['Abajo mide 990° como antihorario; a la derecha cuenta solo las vueltas; 990° olvida el signo; −270° olvida las dos vueltas.'] },
      ],
      respuesta: [letra(ALT5.atras, '−990°; arriba'), ', ', dH('−990°'), '; arriba'] },
    { nivel: 3, titulo: 'Suman 1000°', figura: fig(planoCuad()),
      enunciado: 'Dos ángulos coterminales suman 1000° y el mayor está entre 600° y 800°. ¿Cuánto mide el menor?',
      alternativas: ALT5.suma,
      datos: [DC.cot],
      solucion: [
        { texto: ['α + β = 1000° y α − β = 360° · n. Sumando: 2α = 1000° + 360° · n, α = 500° + 180° · n.'] },
        { texto: ['Entre 600° y 800°, solo n = 1: α = 680°. El menor:'], ecuacion: junto([be, ' = 1000° − 680° = ', dH('320°')]) },
        { texto: ['680° es el mayor; 140° usa n = 2, con α = 860° fuera del rango; 500° toma n = 0; 860° es ese α de n = 2.'] },
      ],
      respuesta: [letra(ALT5.suma, '320°'), ', ', dH('320°')] },
    { nivel: 3, titulo: 'El terreno', figura: fig(planoCuad()),
      enunciado: 'Un terreno rectangular mide 40 · sen 390° metros de ancho y 30 · cos(−300°) metros de largo. ¿Cuál es su área?',
      alternativas: ALT5.area,
      datos: [DC.cot, DC.not, 'Área de un rectángulo: ancho · largo.'],
      solucion: [
        { texto: ['390° = 30° + 360°: sen 390° = 1/2, el ancho mide 20 m. −300° + 360° = 60°: cos(−300°) = 1/2, el largo mide 15 m.'] },
        { texto: ['El área:'], ecuacion: junto(['20 · 15 = ', dF('300 m²')]) },
        { texto: ['150 m² divide entre 2 de más; −300 m² y −150 m² cambian el signo del coseno por el ángulo negativo; 600 m² toma sen 390° = 1.'] },
      ],
      respuesta: [letra(ALT5.area, '300 m²'), ', ', dF('300 m²')] },
  ];
  function casoCotEntre(rr) {
    for (let i = 0; i < 60; i++) {
      const g = (rr.ent(0, 1) ? 1 : -1) * 10 * rr.ent(40, 200);
      const m = mod360(g);
      if (m === 0 || Math.abs(g) < 400) continue;
      const nAbs = mod360(-g);
      const ops = opciones(`${fa(m)}°`, [
        { id: 'sin-signo', texto: `${fa(mod360(Math.abs(g)))}°`, error: 'TR15', siFuera: `Contar vueltas está bien; pero con el signo: ${fa(mod360(Math.abs(g)))}° es de ${fa(Math.abs(g))}°.` },
        { id: 'reves', texto: `${fa(nAbs)}°`, error: 'RN-REVES', siFuera: `Hallar lo que sobra está bien; ${fa(nAbs)}° = 360° − ${fa(m)}° completa la vuelta al revés.` },
        { id: 'media', texto: `${fa(mod360(g + 180))}°`, error: 'TRNEG-180', siFuera: `Quitar giros enteros está bien; ${fa(mod360(g + 180))}° quita media vuelta de más.` },
        { id: 'vuelta', texto: `${fa(m + 360)}°`, error: 'RN-UNA-VUELTA', siFuera: `${fa(m + 360)}° también es coterminal, pero pasa de 360°: falta quitar una vuelta.` },
      ]);
      if (ops.length < 4) continue;
      const n = (g - m) / 360;
      return {
        pregunta: `¿Qué ángulo entre 0° y 360° es coterminal con ${fa(g)}°?`,
        datos: [DC.cot, DC.vuelta],
        // La rueda antes de girar: con el giro dibujado, el lado final mostraría la respuesta.
        dibujo: fig(antesDe(`${fa(g)}°`)),
        opciones: ops,
        solucion: { texto: `${fa(g)}° = ${fa(m)}° + 360° · (${fa(n)}).`, ecuacion: junto([`${fa(g)}° − 360° · (${fa(n)}) = `, dH(`${fa(m)}°`)]) },
      };
    }
    throw new Error('casoCotEntre: sin caso');
  }
  function casoCual(rr) {
    for (let i = 0; i < 60; i++) {
      const g = 10 * rr.ent(2, 34) * (rr.ent(0, 1) ? 1 : -1), k = rr.uno([-3, -2, -1, 1, 2, 3]);
      if (g % 90 === 0) continue;
      const ok = g + 360 * k, k2 = rr.uno([-2, -1, 1, 2]);
      const ops = opciones(`${fa(ok)}°`, [
        { id: 'opuesto', texto: `${fa(-g + 360 * k2)}°`, error: 'TR15', siFuera: `Sumar vueltas está bien; pero se partió de ${fa(-g)}°, con el signo cambiado.` },
        { id: 'media', texto: `${fa(g + 180 + 360 * k2)}°`, error: 'TRNEG-180', siFuera: `La diferencia con ${fa(g)}° es ${fa(180 + 360 * k2)}°: no es un múltiplo de 360°.` },
        { id: 'casi', texto: `${fa(g + 300 * k)}°`, error: 'RN-UNA-VUELTA', siFuera: `Sumar giros está bien; pero ${fa(300 * k)}° no son vueltas enteras.` },
        { id: 'noventa', texto: `${fa(g + 90 * (2 * k2 + 1))}°`, error: 'RN-CUARTO', siFuera: `La diferencia con ${fa(g)}° es ${fa(90 * (2 * k2 + 1))}°: termina en otro cuadrante.` },
      ].filter(x => (Number(x.texto.replace('°', '').replace('−', '-')) - g) % 360 !== 0));
      if (ops.length < 4) continue;
      return {
        pregunta: `¿Cuál de estos ángulos es coterminal con ${fa(g)}°?`,
        datos: [DC.cot],
        dibujo: fig(bici(g, { rotTheta: `${fa(g)}°` })),
        opciones: ops,
        solucion: { texto: `Su diferencia con ${fa(g)}° es un múltiplo de 360°:`, ecuacion: junto([`${fa(ok)}° − (${fa(g)}°) = 360° · (${fa(k)})`]) },
      };
    }
    throw new Error('casoCual: sin caso');
  }
  // α = k·β coterminales, con β en un intervalo que deja un solo n.
  function casoK(rr) {
    for (let i = 0; i < 200; i++) {
      const k = rr.uno([3, 4, 5, 7, 9, 10]), paso = 360 / (k - 1);
      const n = rr.ent(1, 6), b = paso * n;
      if (!Number.isInteger(b) || b >= 1000) continue;
      const lo = Math.floor((b - paso / 2) / 10) * 10, hi = Math.ceil((b + paso / 2) / 10) * 10;
      const enRango = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(m => paso * m).filter(x => x > lo && x < hi);
      if (enRango.length !== 1 || lo <= 0) continue;
      const malK = 360 / k;
      const errs = [
        { id: 'k', texto: `${fa(Math.round(malK * n * 100) / 100)}°`, error: 'RN-K', siFuera: `Plantear con 360° · n está bien; pero kβ − β = ${k - 1}β, no ${k}β.` },
        { id: 'alfa', texto: `${fa(k * b)}°`, error: 'RN-ALFA', siFuera: `${fa(k * b)}° es α = ${k}β; piden β.` },
        { id: 'n-menos', texto: `${fa(paso * (n - 1))}°`, error: 'RN-UNA-VUELTA', siFuera: `β = ${fa(paso)}° · n está bien; con n = ${n - 1} queda fuera del intervalo.` },
        { id: 'n-mas', texto: `${fa(paso * (n + 1))}°`, error: 'RN-UNA-VUELTA', siFuera: `β = ${fa(paso)}° · n está bien; con n = ${n + 1} queda fuera del intervalo.` },
      ].filter(x => x.texto !== `${fa(b)}°` && !x.texto.startsWith('0°') && Number.isInteger(Number(x.texto.replace('°', '').replace(',', '.')) * 100));
      const ops = opciones(`${fa(b)}°`, errs);
      if (ops.length < 4) continue;
      return {
        pregunta: `α y β son coterminales, α = ${k}β y β está entre ${lo}° y ${hi}°. ¿Cuánto mide β?`,
        datos: [DC.cot],
        dibujo: fig(planoCuad()),
        opciones: ops,
        solucion: { texto: `${k}β − β = ${k - 1}β = 360° · n, así que β = ${fa(paso)}° · n; en el intervalo, n = ${n}.`, ecuacion: junto([be, ` = ${fa(paso)}° · ${n} = `, dH(`${fa(b)}°`)]) },
      };
    }
    throw new Error('casoK: sin caso');
  }
  const RES5 = [-500, 1230, -1020, 845, -265, 1500, -890, 2000];
  const coterminales = {
    id: 'coterminales-negativos',
    titulo: 'Más vueltas, mismo lado final',
    pregunta: '¿Qué tienen en común dos giros que terminan en el mismo lugar?',
    temas: ['Ángulos coterminales'],
    pieza: PZ,
    aprendizaje: 'Dos ángulos son coterminales si se diferencian en vueltas enteras, 360° · n: comparten el lado final y sus razones.',
    actividad: 'Hacer girar una rueda de bicicleta más de una vuelta y ver dónde queda la válvula.',
    lee: {
      tarjetas: [
        { titulo: 'La rueda de la bicicleta', texto: 'Pon el origen en el eje de la rueda. La válvula es un punto P de la llanta: empieza a la derecha del eje, sobre el eje x positivo.',
          pieza: PZ, dibujo: { datos: bici(0, { sinArco: true, rotP: 'P', alt: 'Rueda de bicicleta con la válvula a la derecha del eje' }), estado: {} } },
        { titulo: 'Más de una vuelta', texto: 'La rueda puede dar varias vueltas, hacia adelante (antihorario, +) o hacia atrás (horario, −). Un giro total se escribe θ + 360° · n, con n vueltas enteras.',
          ecuacion: junto([th, ' + 360° · n']) },
        { titulo: 'Un múltiplo de 360°', texto: 'Un múltiplo de 360° es 360° por un número entero: 0°, 360°, 720°, −360°, −720°… Son las vueltas enteras.' },
        { titulo: 'Qué mirar al jugar', texto: 'Deja un θ y cambia solo las vueltas n. Mira si la válvula se mueve.' },
      ],
    },
    ejemplos: EJEMPLOS_5,
    juega: {
      consigna: ['La válvula empieza a la derecha del eje. ', th, ' es el giro total: un giro base más n vueltas.'],
      mision: {
        texto: 'Haz que la rueda gire −315° en total.',
        logrado: val => val.g === 45 && val.n === -1,
        bien: 'Listo: −315° = 45° − 360°. La válvula queda en el mismo lugar que con 45°.',
      },
      voz: '¿Se mueve la válvula si solo cambias las vueltas?',
      leyenda: [
        { s: th, t: 'el giro total de la rueda' },
        { s: 'n', t: 'vueltas enteras; negativas hacia atrás' },
        { s: 'P', t: 'la válvula' },
      ],
      controles: [
        { id: 'g', etiqueta: 'giro base', color: 'c-h', min: 0, max: 315, paso: 45, inicio: 90, unidad: '°', decimales: 0 },
        { id: 'n', etiqueta: 'n, vueltas', min: -2, max: 2, paso: 1, inicio: -1, decimales: 0 },
      ],
      dibujo: val => ({ datos: bici(val.g + 360 * val.n), estado: {} }),
      lectura: val => junto([th, ` = ${fa(val.g)}° + 360° · (${fa(val.n)}) = ${fa(val.g + 360 * val.n)}°: la válvula queda igual que con ${fa(val.g)}°`]),
      minimo: 3,
      arrastres: [{ id: 'valvula', etiqueta: 'la válvula P: cambia el giro y las vueltas', color: 'c-h',
        donde: val => TP().enPx(bici(val.g + 360 * val.n), RB * 0.9 * Math.cos(rad(val.g)), RB * 0.9 * Math.sin(rad(val.g))),
        mover: (pt, val) => {
          const T = 45 * Math.round(TP().anguloDe(bici(val.g + 360 * val.n), pt, { cerca: val.g + 360 * val.n }) / 45);
          const n = Math.max(-2, Math.min(2, Math.floor(T / 360)));
          return { g: Math.max(0, Math.min(315, T - 360 * n)), n };
        } }],
    },
    // Cierre (20 nov, lector B): la idea casi no tenía ángulos negativos fuera de la misión. La predicción pasa a un giro
    // hacia atrás de casi dos vueltas (conserva los ids de sus opciones; la unidad ya está en REHECHAS_E6 de avance.js).
    predice: {
      pregunta: 'Sabemos que cos 60° = 1/2. ¿Cuánto vale cos(−660°)?',
      datos: ['cos 60° = 1/2.', 'Una vuelta mide 360°.'],
      voz: 'Piensa dónde queda la válvula después de girar 660° hacia atrás.',
      opciones: [
        { id: 'c', texto: '1/2', correcta: true },
        { id: 'crece', texto: '−11/2', error: 'TR10', siFuera: '−660° es −11 veces 60°, y −11 · 1/2 = −11/2. Pero el coseno no crece con el ángulo.' },
        { id: 'signo', texto: '−1/2', error: 'TRCOT-SIGNO', siFuera: 'El tamaño 1/2 es correcto, pero las vueltas hacia atrás no cambian el signo: P vuelve al mismo lugar.' },
        { id: 'no-existe', texto: 'No existe: pasa de una vuelta', error: 'TRIG-MAYOR', siFuera: 'Un giro de más de una vuelta, también hacia atrás, sí tiene lado final: el de 60°.' },
      ],
      dibujo: { datos: bici(0, { sinArco: true, rotP: 'P al empezar', ladoP: 's', rotulos: [{ x: 2.6, y: -4.95, texto: 'θ = −660°' }], alt: 'Rueda de bicicleta antes de girar menos 660 grados' }), estado: {} },
      revelar: { datos: bici(-660, { rotTheta: '−660°' }), estado: {} },
      coincide: 'Coincide: −660° = 60° − 2 · 360°, el mismo lado final que 60°.',
      noCoincide: 'Revisemos: las dos vueltas hacia atrás dejan la válvula en el mismo lugar que con 60°.',
    },
    mira: {
      datos: (() => {
        const d = bici(-660, { sinArco: true });
        d.arcos = [{ de: 0, a: 60, r: 0.9, color: 'h', rotulo: '60°', desde: 1 }, { de: 0, a: -660, r: 1.4, espiral: 6, color: 'h', desde: 2 }];
        d.rotulos = [{ x: 2.6, y: -4.95, texto: 'θ = −660°', color: 'h', desde: 2 }];
        d.segmentos = d.segmentos.map(s => Object.assign({}, s, { desde: 1 }));
        d.puntos = d.puntos.map(p => Object.assign({}, p, { desde: 1 }));
        d.alt = 'Rueda de bicicleta: el giro de 60 grados y el de menos 660 grados terminan en la misma válvula';
        return d;
      })(),
      voz: 'Cuenta las vueltas enteras hacia atrás y mira lo que sobra.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Con 60°, la válvula queda en P.', ecuacion: junto(['cos 60° = ', frac('1', '2')]) },
        { estado: { corte: 2 }, texto: '−660° son dos vueltas hacia atrás y 60° hacia adelante.', ecuacion: junto(['−660° = 60° + 360° · (−2)']) },
        { estado: { corte: 2 }, texto: 'Las dos vueltas devuelven la válvula a P: el mismo lado final.', ecuacion: junto(['60° − (−660°) = 720°, múltiplo de 360°']) },
        { estado: { corte: 2 }, texto: 'El mismo P da las mismas razones.', ecuacion: junto(['cos(−660°) = cos 60° = ', dF('1/2')]) },
      ],
    },
    regla: {
      texto: 'Dos ángulos son coterminales si su diferencia es un múltiplo de 360°. Tienen el mismo lado final y, por eso, las mismas seis razones.',
      ecuacion: [junto([al, ' − ', be, ' = 360° · n']), SEP, junto(['sen(', th, ' + 360° · n) = sen ', th])],
      condicion: 'n entero: positivo, negativo o 0. Lo mismo vale para cos, tan, cot, sec y csc.',
      voz: 'Las vueltas enteras no mueven el lado final.',
      dibujo: { pieza: PZ, datos: (() => { const d = bici(60, { sinArco: true, alt: 'Rueda de bicicleta: 60, 420 y menos 300 grados terminan en la misma válvula' }); d.arcos = [{ de: 0, a: 60, r: 0.9, color: 'h', rotulo: '60°' }, { de: 0, a: 420, r: 1.5, espiral: 6, color: 'h', rotulo: '420°' }, { de: 0, a: -300, r: 2.2, color: 'h', rotulo: '−300°' }]; return d; })(), estado: {} },
    },
    resuelve: {
      generar(sem) {
        const g = RES5[((sem % RES5.length) + RES5.length) % RES5.length], m = mod360(g), n = (g - m) / 360;
        return {
          enunciado: `¿Qué ángulo entre 0° y 360° es coterminal con ${fa(g)}°?`,
          datos: [DC.cot, DC.vuelta],
          dibujo: fig(antesDe(`${fa(g)}°`)),
          pasos: [
            { tipo: 'pide', texto: ['Piden el ángulo de menos de una vuelta con el mismo lado final.'] },
            { tipo: 'datos', texto: [`${fa(g)}° ${g > 0 ? 'pasa de una vuelta' : 'es negativo'}: hay que ${g > 0 ? 'quitarle' : 'sumarle'} vueltas enteras.`] },
            { tipo: 'regla', texto: ['Quitar o sumar 360° · n no cambia el lado final.'], ecuacion: junto([al, ' − ', be, ' = 360° · n']) },
            { tipo: 'cuentas', texto: [`${g > 0 ? 'Caben' : 'Hacen falta'} ${fa(Math.abs(n))} vuelta${Math.abs(n) === 1 ? '' : 's'}:`], ecuacion: junto([`${fa(g)}° ${n > 0 ? '−' : '+'} 360° · ${fa(Math.abs(n))} = `, dH(`${fa(m)}°`)]),
              dibujo: fig(bici(g, { rotTheta: `${fa(g)}°` })) },
            { tipo: 'sentido', texto: [`${fa(m)}° está entre 0° y 360°, y ${fa(g)}° − ${fa(m)}° = ${fa(g - m)}°, que es ${fa(n)} vueltas.`] },
          ],
          respuesta: [dH(`${fa(m)}°`)],
        };
      },
    },
    ahoraTu: {
      voz: 'Resta los dos ángulos y mira si sale un múltiplo de 360°.',
      generar(sem) { return sinRepetir([casoCotEntre, casoCual, casoK][((sem % 3) + 3) % 3], sem, coterminales); },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: P libre en una cuadrícula y las seis razones a elegir, con sus ceros y sus «no está definida».
  const FN = ['sen', 'cos', 'tan', 'cot', 'sec', 'csc'];
  const seis = val => (val.x || val.y ? figP(val.x, val.y, { ventana: { x: [-8, 8], y: [-8, 8] }, rotTheta: Math.abs(val.x) <= 1 ? '' : 'θ', rot: { p: 'P', r: 'r' } })
    : { ventana: { x: [-8, 8], y: [-8, 8] }, puntos: [{ x: 0, y: 0, rotulo: 'P' }], alt: 'P en el origen' });
  // Mesa 2: P y un segundo punto Q = k·P sobre la misma recta: k > 0 deja las razones; k < 0 voltea seno y coseno.
  function dosPuntos(val) {
    const qx = val.k * val.x, qy = val.k * val.y, L = 7.5;
    const d = val.x || val.y ? figP(val.x, val.y, { ventana: { x: [-L, L], y: [-L, L] }, rotTheta: '' }) : { ventana: { x: [-L, L], y: [-L, L] }, segmentos: [], puntos: [{ x: 0, y: 0, rotulo: 'P' }] };
    const lejos = Math.hypot(val.x, val.y) > 0 ? L * 1.45 / Math.hypot(val.x, val.y) : 0;
    d.segmentos = d.segmentos.concat(lejos ? [{ de: [-val.x * lejos, -val.y * lejos], a: [val.x * lejos, val.y * lejos], grosor: 'contorno', discontinua: true }] : [],
      Math.hypot(qx, qy) > 0 ? [{ de: [0, 0], a: [qx, 0], color: 'f', discontinua: true }, { de: [qx, 0], a: [qx, qy], color: 'f', discontinua: true }] : []);
    // Q lleva su rótulo abajo (P lo lleva arriba): así no se pisan cuando Q está cerca de P; con k = 1 son el mismo punto.
    // El más lejano del origen lleva el rótulo hacia afuera y el más cercano, hacia adentro.
    const afuera = (x, y) => (y >= 0 ? 'n' : 's') + (x >= 0 ? 'e' : 'o'), adentro = (x, y) => (y >= 0 ? 's' : 'n') + (x >= 0 ? 'e' : 'o');
    const qMasLejos = Math.abs(val.k) > 1, mismoLado = val.k > 0;
    if (val.k === 1 || (!val.x && !val.y)) { d.puntos[0].rotulo = 'P = Q'; d.puntos = d.puntos.concat([{ x: qx, y: qy, color: 'f' }]); }
    else d.puntos = d.puntos.concat([{ x: qx, y: qy, color: 'f', rotulo: 'Q', lado: !mismoLado || qMasLejos ? afuera(qx, qy) : adentro(qx, qy) }]);
    d.puntos[0].lado = !mismoLado || !qMasLejos ? afuera(val.x, val.y) : adentro(val.x, val.y);
    d.alt = `P(${f(val.x)}, ${f(val.y)}) y Q = ${f(val.k)} veces P, en (${f(qx)}, ${f(qy)})`;
    return d;
  }
  // Mesa 3: un giro cualquiera y su opuesto −θ, de 15° en 15° y hasta dos vueltas (va a «Más mesas del tema»).
  function opuestos(g) {
    const x = 4 * Math.cos(rad(g)), y = 4 * Math.sin(rad(g));
    return {
      ventana: { x: [-5.2, 5.2], y: [-5.2, 5.2] },
      rayos: [{ ang: 0, largo: 4, grosor: 'contorno' }, { ang: g, largo: 4 }, { ang: -g, largo: 4, discontinua: true }],
      segmentos: [{ de: [0, 0], a: [x, 0], color: 'i' }, { de: [x, 0], a: [x, y], color: 'o' }, { de: [x, 0], a: [x, -y], color: 'o', discontinua: true }],
      // Sin rótulos en los arcos: con vueltas enteras caerían uno sobre otro; el control dice θ.
      arcos: g ? [{ de: 0, a: g, r: 0.9, espiral: 8, color: 'h' }, { de: 0, a: -g, r: 1.7, espiral: 8, color: 'h' }] : [],
      puntos: [{ x, y, rotulo: 'P', lado: y >= 0 ? 'ne' : 'se' }, { x, y: -y, rotulo: 'P′', lado: y >= 0 ? 'se' : 'ne' }],
      alt: `Giros de ${f(g)} y ${f(-g)} grados: sus puntos son reflejos en el eje x`,
    };
  }
  const cuadrante = g => { const m = mod360(g); return m === 0 || m === 90 || m === 180 || m === 270 ? 0 : m < 90 ? 1 : m < 180 ? 2 : m < 270 ? 3 : 4; };
  const cuadP = (x, y) => cuadrante(Math.atan2(y, x) * 180 / Math.PI);
  const coordCtrl = (id, etiqueta, color, inicio, tope = 6) => ({ id, etiqueta, color, min: -tope, max: tope, paso: 1, inicio, decimales: 0 });
  const manijaP = dib => ({ id: 'punto-p', etiqueta: 'punto P',
    donde: val => TP().enPx(dib(val), val.x, val.y),
    mover: (pt, val) => { const q = TP().delPx(dib(val), pt); return { x: q.x, y: q.y }; } });
  const parDe = (x, y, fn) => { const r = Math.hypot(x, y), vale = { x, y, r }, [a, b] = { sen: ['y', 'r'], cos: ['x', 'r'], tan: ['y', 'x'], cot: ['x', 'y'], sec: ['r', 'x'], csc: ['r', 'y'] }[fn]; return [vale[a], vale[b]]; };
  const razonNum = (x, y, fn) => { const [p, q] = parDe(x, y, fn); return q === 0 ? null : p / q; };
  const CTR_SEIS = [coordCtrl('x', 'x', 'c-i', -3), coordCtrl('y', 'y', 'c-o', 4)];
  const valoresDe = c => Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => c.min + k * c.paso);
  const TAN_II_MIN = Math.min(...valoresDe(CTR_SEIS[0]).flatMap(x => valoresDe(CTR_SEIS[1]).filter(y => x < 0 && y > 0).map(y => razonNum(x, y, 'tan'))));
  const CTR_LADO = [coordCtrl('x', 'x de P', 'c-i', 3, 3), coordCtrl('y', 'y de P', 'c-o', 2, 3),
    { id: 'k', etiqueta: 'k', color: 'c-f', min: -2, max: 2, paso: 0.5, inicio: -1, decimales: 1 }];
  const Q_MAX = CTR_LADO[2].max * Math.hypot(CTR_LADO[0].max, CTR_LADO[1].max);
  const CTR_GIRO = [{ id: 'g', etiqueta: 'θ', color: 'c-h', min: -720, max: 720, paso: 15, inicio: 135, unidad: '°', decimales: 0 }];
  const iguales = (a, b) => (a === null ? b === null : b !== null && Math.abs(a - b) < 1e-9);
  const laboratorio = [
    {
      id: 'seis-razones', titulo: 'Las seis razones de P', pieza: PZ,
      consigna: 'Arrastra P a cualquier punto, también sobre un eje, y elige la razón. Busca cuándo vale 0 y cuándo no está definida.',
      controles: [CTR_SEIS[0], CTR_SEIS[1], { id: 'fn', etiqueta: 'razón', opciones: FN.map(v => ({ valor: v, texto: v })) }],
      dibujo: val => ({ datos: seis(val), estado: {} }),
      lectura: val => {
        if (!val.x && !val.y) return ['P en el origen: no hay lado final.'];
        const c = razonDe(val.fn, val.x, val.y), [a, b] = { sen: ['y', 'r'], cos: ['x', 'r'], tan: ['y', 'x'], cot: ['x', 'y'], sec: ['r', 'x'], csc: ['r', 'y'] }[val.fn];
        return [`r = ${rTxt(val.x, val.y)}; ${val.fn} `, th, ` = ${a}/${b}${c === null ? ': no está definida' : ` = ${txt(c)}`}`];
      },
      arrastres: [manijaP(seis)],
      invitaciones: [
        { texto: 'Pon P sobre un eje y elige una razón que no esté definida.',
          logrado: val => (val.x !== 0 || val.y !== 0) && parDe(val.x, val.y, val.fn)[1] === 0,
          bien: 'El cero quedó abajo del cociente. ¿Qué pasa si eliges su recíproca?' },
        { texto: 'Consigue que la razón elegida valga 0, con P fuera del origen.',
          logrado: val => (val.x !== 0 || val.y !== 0) && razonNum(val.x, val.y, val.fn) === 0,
          bien: 'Aquí el cero está arriba: vale 0, que sí es un valor.' },
        { texto: 'Pon P en el cuadrante IV y elige una razón positiva.',
          logrado: val => cuadP(val.x, val.y) === 4 && razonNum(val.x, val.y, val.fn) > 0,
          bien: 'En el IV solo x es positiva: por eso ganan coseno y secante.' },
        { texto: 'Con la tangente, busca el P del cuadrante II con la tangente más negativa.',
          logrado: val => val.fn === 'tan' && cuadP(val.x, val.y) === 2 && Math.abs(razonNum(val.x, val.y, 'tan') - TAN_II_MIN) < 1e-9,
          bien: 'Lado final casi vertical: x pequeña abajo del cociente, tangente enorme.' },
        { texto: 'Guarda dos puntos distintos con las seis razones iguales.',
          logrado: (val, guardados) => (val.x !== 0 || val.y !== 0) && guardados.some(g => (g.x !== val.x || g.y !== val.y) && (g.x !== 0 || g.y !== 0)
            && FN.every(fn => iguales(razonNum(g.x, g.y, fn), razonNum(val.x, val.y, fn)))),
          bien: 'Mismo lado final, distinto r: las razones no dependen de lo lejos.' },
      ],
    },
    {
      id: 'mismo-lado', titulo: 'Más lejos o al revés', pieza: PZ,
      consigna: 'Q está en la recta de P, a k veces su distancia. Con k positivo comparten lado final; con k negativo, mira qué razón cambia.',
      controles: CTR_LADO,
      dibujo: val => ({ datos: dosPuntos(val), estado: {} }),
      lectura: val => {
        const r = Math.hypot(val.x, val.y);
        if (!r) return ['P en el origen: no hay lado final.'];
        if (!val.k) return [{ v: 'c-f', t: 'k' }, ' = 0: Q cae en el origen.'];
        const s1 = val.y / r, s2 = Math.sign(val.k) * val.y / r;
        return [{ v: 'c-f', t: 'k' }, ` = ${f(val.k)}: seno de P ≈ ${f(s1)}; de Q ≈ ${f(s2)}; tangente ${val.x ? 'igual' : 'no definida'}.`];
      },
      arrastres: [
        manijaP(dosPuntos),
        { id: 'punto-q', etiqueta: 'punto Q: cambia k', color: 'c-f',
          donde: val => TP().enPx(dosPuntos(val), val.k * val.x, val.k * val.y),
          mover: (pt, val) => { const q = TP().delPx(dosPuntos(val), pt), n2 = val.x * val.x + val.y * val.y; return n2 ? { k: (q.x * val.x + q.y * val.y) / n2 } : {}; } },
      ],
      invitaciones: [
        { texto: 'Pon Q en el lado final de P, pero más cerca del origen.',
          logrado: val => (val.x !== 0 || val.y !== 0) && val.k > 0 && val.k < 1,
          bien: 'Más cerca, mismo lado final: las razones de Q son las de P.' },
        { texto: 'Con k negativo, logra que Q tenga el mismo seno que P.',
          logrado: val => { const r = Math.hypot(val.x, val.y); return r > 0 && val.k < 0 && Math.abs(val.k * val.y / (Math.abs(val.k) * r) - val.y / r) < 1e-9; },
          bien: 'Con P sobre el eje x, el seno vale 0 en los dos.' },
        { texto: 'Haz que P quede en el cuadrante II y Q en el IV.',
          logrado: val => val.k !== 0 && cuadP(val.x, val.y) === 2 && cuadP(val.k * val.x, val.k * val.y) === 4,
          bien: 'k negativo voltea x e y a la vez: salta al cuadrante opuesto.' },
        { texto: 'Busca la Q más lejana del origen que comparta lado final con P.',
          logrado: val => val.k > 0 && Math.abs(Math.hypot(val.k * val.x, val.k * val.y) - Q_MAX) < 1e-9,
          bien: 'r creció al tope y el seno no se movió. ¿Qué pasa con k = −2?' },
      ],
    },
    {
      id: 'giro-y-opuesto', titulo: 'Un giro y su opuesto', pieza: PZ,
      consigna: 'Gira P hasta dos vueltas en cualquier sentido. P′ es el punto de −θ: compara sus senos y sus cosenos.',
      controles: CTR_GIRO,
      dibujo: val => ({ datos: opuestos(val.g), estado: {} }),
      lectura: val => ['sen ', th, ` ≈ ${f(Math.sin(rad(val.g)))}; sen(−`, th, `) ≈ ${f(-Math.sin(rad(val.g)))}; el coseno de los dos ≈ ${f(Math.cos(rad(val.g)))}`],
      arrastres: [{ id: 'punta', etiqueta: 'punto P del giro θ', color: 'c-h',
        donde: val => TP().enPx(opuestos(val.g), 4 * Math.cos(rad(val.g)), 4 * Math.sin(rad(val.g))),
        mover: (pt, val) => ({ g: TP().anguloDe(opuestos(val.g), pt, { cerca: val.g }) }) }],
      invitaciones: [
        { texto: 'Haz que P y P′ coincidan sin dejar θ en 0°.',
          logrado: val => val.g !== 0 && Math.abs(Math.sin(rad(val.g))) < 1e-9,
          bien: 'Sobre el eje x, el reflejo cae en el mismo sitio: seno 0.' },
        { texto: 'Busca un θ de más de una vuelta con el mismo lado final que 135°.',
          logrado: val => val.g > 360 && mod360(val.g) === mod360(CTR_GIRO[0].inicio),
          bien: 'Son coterminales: una vuelta más no cambia ni P ni sus razones.' },
        { texto: 'Haz que P′, el punto de −θ, quede en el cuadrante II.',
          logrado: val => cuadrante(-val.g) === 2,
          bien: 'P quedó en el III: el reflejo en el eje x cambia el cuadrante.' },
        { texto: 'Busca el giro más negativo de la mesa con sen θ = 1.',
          logrado: val => val.g < 0 && Math.abs(Math.sin(rad(val.g)) - 1) < 1e-9 && val.g - 360 < CTR_GIRO[0].min,
          bien: 'Casi dos vueltas horarias y termina arriba, como 90°.' },
        { texto: 'Guarda dos giros de signo contrario con el mismo coseno y distinto seno.',
          logrado: (val, guardados) => guardados.some(g => g.g * val.g < 0 && Math.abs(Math.cos(rad(g.g)) - Math.cos(rad(val.g))) < 1e-9
            && Math.abs(Math.sin(rad(g.g)) - Math.sin(rad(val.g))) > 1e-9),
          bien: 'x se conserva y y cambia de signo: el seno cambia, el coseno no.' },
      ],
    },
  ];

  const ideas = [razones, signos, cuadrantales, giroHorario, coterminales];
  return {
    unidad: 'trigonometria.angulos-en-posicion-normal',
    version: '0.2.1',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js', '/nucleo/kit/piezas/trig-pos.js'],
    letras: { 'θ': 'el ángulo en posición normal', 'α': 'otro ángulo del mismo problema', 'β': 'otro ángulo del mismo problema',
      P: 'un punto del lado final', Q: 'otro punto del lado final', x: 'la abscisa de P', y: 'la ordenada de P', r: 'el radio vector de P',
      n: 'un número entero de vueltas', a: 'una coordenada desconocida', m: 'una coordenada desconocida', O: 'el origen' },
    glosario: [
      { termino: 'posición normal', simple: 'Ángulo que empieza en el origen y en el eje x positivo.',
        def: 'Manera de ubicar un ángulo: vértice en el origen y lado inicial sobre el eje x positivo.',
        ejemplos: ['En el plano del pueblo, el vértice es la plaza y el lado inicial, la calle hacia el este.', '120° así ubicado gira desde el eje x positivo, en sentido antihorario.', 'Un ángulo de un triángulo no está en posición normal hasta que se lo pone así.'],
        ver: ['lado final', 'radio vector'] },
      { termino: 'lado final', formas: ['lado final', 'lados finales'], simple: 'La línea donde termina el giro.',
        def: 'Semirrecta donde termina el giro de un ángulo. Cualquier punto suyo, salvo el origen, sirve para sus razones.',
        ejemplos: ['El lado final de 0° va por el eje x positivo.', 'La línea de la plaza a una casa es un lado final.', 'P(2, 1) y Q(4, 2) están en el mismo lado final.'],
        ver: ['posición normal', 'radio vector'] },
      { termino: 'radio vector', simbolo: 'r', simple: 'Lo lejos que está P del origen, en línea recta.',
        def: 'Distancia del origen al punto P del lado final: r = √(x² + y²). Siempre es positiva.',
        ejemplos: ['P(3, 4): r = √(9 + 16) = 5.', 'P(−6, −8): r = √(36 + 64) = 10.', 'P(1, 2): r = √5, que no es entero.'],
        ver: ['abscisa', 'ordenada'] },
      { termino: 'abscisa', simbolo: 'x',
        def: 'Primera coordenada de un punto: cuánto se aleja del eje y, a la derecha (+) o a la izquierda (−).',
        ejemplos: ['P(−3, 4): x = −3, tres unidades a la izquierda del eje y.', 'Una casa 5 cuadras al este de la plaza tiene x = 5.', 'Todo punto del eje y tiene abscisa 0.'],
        ver: ['ordenada'] },
      { termino: 'ordenada', simbolo: 'y',
        def: 'Segunda coordenada de un punto: cuánto sube (+) o baja (−) respecto del eje x.',
        ejemplos: ['P(−3, 4): y = 4, cuatro unidades arriba del eje x.', 'Una casa 2 cuadras al sur de la plaza tiene y = −2.', 'Todo punto del eje x tiene ordenada 0.'],
        ver: ['abscisa'] },
      { termino: 'cuadrante', formas: ['cuadrante', 'cuadrantes'], simple: 'Cada uno de los cuatro pedazos en que los ejes parten el plano.',
        def: 'Cada una de las cuatro regiones en que los ejes dividen el plano: I, II, III y IV.',
        ejemplos: ['El I queda arriba a la derecha: x > 0 e y > 0.', 'Una cabina abajo a la izquierda del centro está en el III.', '100° termina en el II.'],
        ver: ['abscisa', 'ordenada'] },
      { termino: 'rueda de la fortuna', simple: 'Juego de feria: una rueda grande con cabinas que gira en vertical.',
        def: 'Rueda vertical de feria con cabinas colgadas del aro, que giran alrededor de su centro.',
        ejemplos: ['Su centro es el origen y cada cabina, un punto P.', 'Una cabina arriba a la derecha del centro tiene x > 0 e y > 0.', 'La cabina más alta está sobre el eje y.'],
        ver: ['cuadrante'] },
      { termino: 'ángulo cuadrantal', formas: ['ángulos cuadrantales', 'ángulo cuadrantal', 'cuadrantales', 'cuadrantal'], simple: 'Ángulo cuyo lado final cae justo sobre un eje.',
        def: 'Ángulo en posición normal cuyo lado final cae sobre un eje, como 0°, 90°, 180° o 270°.',
        ejemplos: ['180° es cuadrantal: su lado final va por el eje x negativo.', '360° también: da una vuelta y queda en el eje x positivo.', '45° no lo es: cae entre dos ejes.'],
        ver: ['no definida', 'cuadrante'] },
      { termino: 'no definida', formas: ['no está definida', 'no está definido', 'no están definidas', 'no definidas', 'no definida', 'no definido'], simple: 'Que no tiene ningún valor, porque pide dividir entre cero.',
        def: 'Se dice de una razón que no tiene valor, porque su cociente pide dividir entre cero.',
        ejemplos: ['sec 270° = r/0 no da ningún número.', 'En cambio, cot 270° = 0/r = 0: el 0 arriba sí da un valor.', 'cot 180° pide dividir entre y = 0.'],
        ver: ['ángulo cuadrantal'] },
      { termino: 'veleta', simple: 'Flecha en lo alto de un poste que gira con el viento.',
        def: 'Flecha que gira sobre un eje vertical y marca de dónde sopla el viento, con los puntos cardinales debajo.',
        ejemplos: ['La veleta de la iglesia apunta al norte.', 'Vista desde arriba, la flecha gira sobre la cruz de los puntos cardinales.', 'Si la flecha apunta al oeste, su punta queda sobre el eje x negativo.'],
        ver: ['ángulo cuadrantal'] },
      { termino: 'minutero', simple: 'La aguja larga del reloj, la que marca los minutos.',
        def: 'Aguja larga de un reloj: da una vuelta en una hora, en sentido horario.',
        ejemplos: ['En 15 minutos, el minutero avanza un cuarto de vuelta.', 'De un número al siguiente, el minutero gira 30°.', 'A las 4:15, el minutero apunta al 3.'],
        ver: ['ángulo negativo'] },
      { termino: 'ángulo negativo', formas: ['ángulo negativo', 'ángulos negativos'], simple: 'Un giro hecho en el sentido de las agujas del reloj.',
        def: 'Ángulo trigonométrico que gira en sentido horario; su medida lleva signo menos.',
        ejemplos: ['El minutero, del 3 al 4, gira −30°.', '−90° termina sobre el eje y negativo.', '−40° termina en el cuadrante IV.'],
        ver: ['minutero'] },
      { termino: 'válvula', simple: 'La pieza de la llanta por donde entra el aire.',
        def: 'Pieza pequeña de la rueda por donde entra el aire; gira con la rueda.',
        ejemplos: ['Tras una vuelta entera, la válvula vuelve a su lugar.', 'Media vuelta lleva la válvula al otro lado del eje.', 'La válvula sirve para seguir cuánto giró la rueda.'],
        ver: ['múltiplo de 360°'] },
      { termino: 'múltiplo de 360°', formas: ['múltiplo de 360°', 'múltiplos de 360°'], simple: 'Un número entero de vueltas: 0°, 360°, 720°, −360°…',
        def: 'Lo que da 360° por un número entero: 0°, ±360°, ±720°, ±1080°…',
        ejemplos: ['720° es múltiplo de 360°: dos vueltas.', '−1080° también: tres vueltas hacia atrás.', '540° no lo es: es vuelta y media.'],
        ver: ['válvula'] },
      // cot, sec y csc: la definición del curso es la de P(x, y) (en «Razones» van como locales, con los catetos). Sin
      // `simple`: no son palabras nuevas para quien viene de «Razones».
      { termino: 'cotangente', simbolo: 'cot', def: 'Razón que divide la abscisa entre la ordenada, x/y. Es la recíproca de la tangente.',
        ejemplos: ['P(−3, 4): cot θ = −3/4.', 'Si tan θ = 2/5, cot θ = 5/2.', 'P(6, −2): cot θ = 6/(−2) = −3.'], ver: ['secante', 'cosecante'] },
      { termino: 'secante', simbolo: 'sec', def: 'Razón que divide el radio vector entre la abscisa, r/x. Es la recíproca del coseno.',
        ejemplos: ['P(−3, 4): sec θ = 5/(−3) = −5/3.', 'Si cos θ = 2/7, sec θ = 7/2.', 'P(8, 6): sec θ = 10/8 = 5/4.'], ver: ['cotangente', 'cosecante'] },
      { termino: 'cosecante', simbolo: 'csc', def: 'Razón que divide el radio vector entre la ordenada, r/y. Es la recíproca del seno.',
        ejemplos: ['P(−3, 4): csc θ = 5/4.', 'Si sen θ = −1/3, csc θ = −3.', 'P(5, −12): csc θ = 13/(−12) = −13/12.'], ver: ['cotangente', 'secante'] },
    ],
    laboratorio,
    historia: {
      texto: 'Las primeras tablas de cuerdas y senos servían a la astronomía y miraban ángulos de triángulos. Tradiciones griegas, indias y de lengua árabe las fueron transformando hasta hablar de funciones. Al salir del triángulo, el ángulo puede girar más de una vuelta o hacia atrás, y entonces importan los signos. La posición normal es una organización moderna: pone el giro sobre coordenadas.',
      pregunta: '¿Qué gana un ángulo cuando deja de vivir dentro de un triángulo?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Trigonometric functions», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Trigonometric_functions/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov). giro-y-opuesto compara sen θ con sen(−θ), la
    // paridad que enseña «Reducción»: va a «Más mesas del tema» (lista vacía).
    laboratorioIdeas: {
      'seis-razones': ['razones-coordenadas'],
      'mismo-lado': ['razones-coordenadas'],
      'giro-y-opuesto': [],
    },
    ideas,
  };
});
