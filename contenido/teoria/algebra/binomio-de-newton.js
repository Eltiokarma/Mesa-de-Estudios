/*
 * Teoría de «Binomio de Newton» (algebra.binomio-de-newton), séptima y última unidad de la rama «Expresiones
 * algebraicas», después de «Ecuaciones polinomiales».
 *
 * Etapa 9 del método (26 nov 2026; docs/etapa9/propuesta-algebra.md, con sus «Decisiones tomadas»): seis ideas. Las
 * cuatro de antes conservan su id con otra Predice y entran termino-buscado y suma-coeficientes (el avance se ajusta en
 * nucleo/avance.js, REHECHAS_E6, marcas prediccionBN y estudiadaBN). El hilo, como en la rama: el maestro Rubén, en
 * Juliaca, ahora arma cenefas (franjas de losetas de dos o tres colores); cada loseta es un paréntesis de (a + b)ⁿ: la
 * naranja es elegir a y la turquesa, b. Pieza nueva alg-cenefa (dibujo de prueba).
 *   1 «Elegir en cada paréntesis» (`pascal-elecciones`: el coeficiente cuenta cenefas; C(n, k); Pascal y simetría)
 *   2 «El término general» (`termino-general`: tₖ₊₁ = C(n, k)aⁿ⁻ᵏbᵏ con a y b enteros, con número y signo)
 *   3 «Un término por su exponente» (`termino-buscado`: el exponente de x del término general se iguala)
 *   4 «Cuántos términos y cuánto suman» (`suma-coeficientes`: n + 1 términos, centrales y suma con letras = 1)
 *   5 «Exponente que no es natural» (`exponente-no-natural`: (1 + x)^α no termina; coeficientes y −1 < x < 1)
 *   6 «La potencia de un trinomio» (`potencia-trinomio`: n!/(p! q! r!))
 *
 * Lo que se da por sabido de «Análisis combinatorio» (Aritmética, en requiere, todavía sin rehacer; propuesta, decisión
 * 1): el factorial y el número combinatorio como herramienta. Van SIEMPRE en los datos de cada ejercicio que los usa.
 * C(n, k) se escribe con paréntesis (decisión 2).
 *
 * Letras (la tabla entera va en `letras`): a y b el primer y el segundo término del binomio; c el tercero del trinomio;
 * n el exponente (cuántos paréntesis); k cuántas veces se elige b (de 0 a n); tₖ₊₁ el término de lugar k + 1; α el
 * exponente que no es natural; p, q, r cuántas veces se eligen a, b y c; S la suma de coeficientes; x, y variables.
 * REGLA DE COLORES DE LA UNIDAD (docs/molde-unidad.md §5b; propuesta §6), en la tabla COLORES (def.colores):
 *   - naranja (c-o): el primer término a y lo que se elige de él (las losetas naranjas, n − k, p);
 *   - turquesa (c-i): el segundo término b y lo que se elige de él (las losetas turquesas, k, q);
 *   - violeta (c-f): lo que se busca (el coeficiente, el término pedido, la suma, cuántas cenefas);
 *   - verde (c-d): el tercer término c del trinomio y sus losetas (solo la idea 6, siempre con su letra);
 *   - tinta: n, el lugar, α, la expresión entera y lo que se pide con «?»; nunca carmín.
 * Nada antes de Predice de cada idea (título, Resumen, Lee, glosario, juego) dice su respuesta (prueba propia).
 *
 * Errores: los de docs/investigacion/etapa9/algebra.binomio-de-newton.md §3 (DIS, ORD, IDX, SIG, BLO, EXP, FAC, GEN,
 * OBJ, con su estado: documentados o de segunda mano en poblaciones de otros países) y TAL-BN-* (hipótesis de diseño;
 * los de cada idea en su comentario). Práctica: plantillas/binomio-practica/ (formato «predicciones», tipos por idea). La
 * escena «El tablero de los caminos» (binomio-newton) va a «Más mesas del tema».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
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
    for (const o of ops) { if (!o || o.texto === null || o.texto === undefined || o.texto === '') continue; const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  // Las alternativas van en tinta, sin fichas de color (como en Factorización y Ecuaciones polinomiales). El color queda
  // en la solución.
  const ops = lista => distintas(lista).slice(0, 4).map(o => Object.assign({}, o, { texto: Kit.plano(o.texto) }));
  function conCuatro(caso, r) {
    for (let i = 0; i < 200; i++) { const c = caso(r); if (c && c.opciones.length >= 4) return c; }   // null: el caso no sirve, otro
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }

  // ---------- Números: factorial, combinatorio, fracciones exactas ----------
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
  const C = (n, k) => (k < 0 || k > n ? 0 : Math.round(fact(n) / (fact(k) * fact(n - k))));
  const fila = n => Array.from({ length: n + 1 }, (_, j) => C(n, j));
  const V = (n, k) => { let p = 1; for (let i = 0; i < k; i++) p *= n - i; return p; };   // en orden: n(n − 1)…
  const mcd = (x, y) => { x = Math.abs(x); y = Math.abs(y); while (y) [x, y] = [y, x % y]; return x || 1; };
  const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = mcd(n, d); return [n / g, d / g]; };
  const frTxt = ([n, d]) => (d === 1 ? f(n, 0) : `${n < 0 ? '−' : ''}${Math.abs(n)}/${d}`);
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻', '−': '⁻' };
  const sup = e => String(e).split('').map(c => SUP[c] || c).join('');
  const pot = (v, e) => (e === 0 ? '' : e === 1 ? v : `${v}${sup(e)}`);
  const lugar = j => `${j}.º`;
  const par = v => (v < 0 ? `(${f(v, 0)})` : f(v, 0));
  // Un coeficiente delante de letras: «» si es 1, «−» si es −1.
  const coefTxt = (c, hayLetras = true) => (hayLetras && c === 1 ? '' : hayLetras && c === -1 ? '−' : f(c, 0));

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba la prueba propia) ----------
  const COLORES = { 'primer término': 'o', 'segundo término': 'i', 'lo que se busca': 'f', 'tercer término': 'd' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: String(t), m: mg });
  const PA = ficha('primer término'), SB = ficha('segundo término'), BU = ficha('lo que se busca'), TC = ficha('tercer término');
  // La letra de una alternativa, en negrita y en tinta (Gerson, mesa del 17 nov). El U+2060 (invisible) queda para que la
  // letra no se lea como variable.
  const letra = L => ({ negrita: `${L}⁠` });
  const SEP = ';   ';   // separa dos igualdades (un «·» se leería como producto: molde §2)
  // aⁿ⁻ᵏbᵏ en una ecuación, con a naranja y b turquesa (sin escribir exponente 0 ni 1).
  const ab = (n, k, la = 'a', lb = 'b') => [...(n - k ? [PA(pot(la, n - k))] : []), ...(k ? [SB(pot(lb, k))] : [])];
  const abTxt = (n, k, la = 'a', lb = 'b') => `${pot(la, n - k)}${pot(lb, k)}`;
  const CN = (n, k) => `C(${n}, ${k})`;
  const CE = datos => ({ pieza: 'alg-cenefa', datos, estado: {} });
  const TB = datos => ({ pieza: 'alg-tabla', datos, estado: {} });
  // Todas las cenefas de n losetas con k de b (y r de c), en orden de lectura: la primera tiene las b al final. La pieza
  // trae la misma función (alg-cenefa.patrones); aquí va aparte porque la unidad se arma antes de cargar la pieza.
  function patrones(n, k, r = 0) {
    const out = [];
    const rec = (pre, qb, qc) => {
      const falta = n - pre.length;
      if (!falta) { if (!qb && !qc) out.push(pre); return; }
      if (falta > qb + qc) rec(pre.concat(0), qb, qc);
      if (qb) rec(pre.concat(1), qb - 1, qc);
      if (qc) rec(pre.concat(2), qb, qc - 1);
    };
    if (k >= 0 && r >= 0 && k + r <= n) rec([], k, r);
    return out;
  }
  const cenefas = (n, k, extra = {}) => Object.assign({ objeto: 'cenefas', patrones: patrones(n, k) }, extra);
  const lasN = k => `${k} ${k === 1 ? 'turquesa' : 'turquesas'}`;
  const cenefasTxt = c => `${f(c, 0)} ${c === 1 ? 'cenefa' : 'cenefas'}`;

  // Una fórmula que no se parte en el celular: sus espacios pasan a espacios duros (ecuaciones-ancho.js).
  const nb = t => t.replace(/ /g, '\u00a0');
  // Exponentes e índices compuestos o con letra («aⁿ⁻ᵏ», «tₖ₊₁», «xᵐ⁺ⁿ») como nodos de la ecuación, con letra de tamaño
  // legible: los caracteres Unicode ᵏ, ᵐ, ₖ… salen diminutos y de otra fuente en el celular (lector en frío, 26 nov).
  // Las cifras sueltas (x², (a + b)ⁿ) siguen en Unicode: nucleo/ecuacion.js ya las pinta como <sup>.
  const SUPL = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', 'ⁿ': 'n', 'ᵏ': 'k', 'ᵐ': 'm', 'ᵖ': 'p', 'ʳ': 'r', '⁻': '\u00a0−\u00a0', '⁺': '\u00a0+\u00a0' };
  const SUBL = { 'ₖ': 'k', '₊': '\u00a0+\u00a0', '₁': '1', '₂': '2', '₀': '0' };
  const ex = t => t.split(/([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿᵏᵐᵖʳ]+|[ₖ₊₀₁₂]+)/).filter(Boolean).map(p => (
    /[ᵏᵐᵖʳ]|ⁿ[⁺⁻]|[⁰¹²³⁴⁵⁶⁷⁸⁹][⁺⁻]/.test(p) ? { sup: ['', [...p].map(c => SUPL[c]).join('')] }
      : /ₖ/.test(p) ? { sub: ['', [...p].map(c => SUBL[c]).join('')] } : p));
  // Datos que se repiten (herramientas, no el paso hecho). Lo de «Análisis combinatorio» va siempre aquí.
  const DD = {
    combQue: 'Número combinatorio: C(n, k) cuenta las maneras de elegir k cosas entre n, sin importar el orden',
    comb: [nb('C(n, k) = '), { frac: ['n!', 'k!(n − k)!'] }],
    fact: 'n! = 1 · 2 · 3 · … · n, y 0! = 1',
    eleccion: 'Cada término de (a + b)ⁿ sale de elegir a o b en cada uno de los n paréntesis',
    pascal: 'Triángulo de Pascal: cada número es la suma de los dos que tiene encima',
    simetria: 'C(n, k) = C(n, n − k)',
    potencia: '(a + b)ⁿ es el producto de n paréntesis (a + b)',
    semejantes: 'Los términos semejantes se juntan sumando sus coeficientes',
  };

  // ---------- Idea 1: elegir en cada paréntesis ----------
  // Propuesta: docs/etapa9/propuesta-algebra.md (§1 a §6, idea 1). Objeto: las cenefas de Rubén (Lee y juego, pieza
  // alg-cenefa): cada loseta es un paréntesis; naranja es elegir a, turquesa es elegir b.
  // Cambia: n (losetas) y k (turquesas). · Permanece: la regla «una cenefa, un producto». · Progresa: cuántas cenefas hay.
  // · Se reserva: n = 5 (la predicción: el coeficiente de a³b² en (a + b)⁵). · Debe verse: las cenefas con k turquesas son
  // las maneras de elegir k paréntesis, y su número es el coeficiente.
  // Errores: DIS cree que (a + b)ⁿ es aⁿ + bⁿ (documentado, Graciano-Barragan y Aké 2021, como tarea didáctica) · ORD
  // cuenta en orden, n(n − 1)… (documentado, Manitoba 2017, causa inferida) · TAL-BN-EXPONENTES multiplica los
  // exponentes · TAL-BN-LUGAR usa k − 1 o k + 1 · TAL-BN-TODAS cuenta todas las cenefas, 2ⁿ · TAL-BN-UNA cree que cada
  // término sale una sola vez · TAL-BN-PAR suma el par de arriba que no es · TAL-BN-DOBLE duplica el de arriba ·
  // TAL-BN-RESTA resta los dos k · TAL-BN-MEDIA promedia los dos k · TAL-BN-COPIA copia el número de la fila de arriba.
  const lecturaCenefas = (n, k) => {
    if (k > n) return [`Con ${n} ${n === 1 ? 'loseta' : 'losetas'} no caben ${lasN(k)}: hay `, BU('0 cenefas')];
    const c = C(n, k);
    return [`${n} ${n === 1 ? 'loseta' : 'losetas'} con ${lasN(k)} ${n === 1 ? 'da' : 'dan'} `, BU(cenefasTxt(c)), `: el término ${coefTxt(c)}`, ...ab(n, k)];
  };
  const figuraJuego1 = (n, k) => (k > n
    ? CE({ objeto: 'cenefas', patrones: [Array(n).fill(0)], abajo: [[`Con ${n} no caben ${lasN(k)}`, null, 700]] })
    : CE(cenefas(n, k, { lado: 30, abajo: [[cenefasTxt(C(n, k)), 'f', 700], [`: ${coefTxt(C(n, k))}`, null, 700], ...(n - k ? [[pot('a', n - k), 'o', 700]] : []), ...(k ? [[pot('b', k), 'i', 700]] : [])] })));

  // Ahora tú 1 (tipo 0): el coeficiente de aⁿ⁻ᵏbᵏ en (a + b)ⁿ.
  function casoCoef(r) {
    const n = r.ent(6, 9), k = r.ent(2, n - 2);
    const c = C(n, k);
    return {
      pregunta: [`Al desarrollar (a + b)${sup(n)} y juntar términos semejantes, ¿cuál es el coeficiente de ${abTxt(n, k)}?`],
      datos: [DD.eleccion, DD.combQue, DD.comb, DD.fact],
      opciones: ops([
        { id: 'c', texto: f(c, 0), correcta: true },
        { id: 'orden', texto: f(V(n, k), 0), error: 'ORD', siFuera: `Elegir ${k} paréntesis de ${n} es la idea, pero contadas en orden, cada elección se repite ${f(fact(k), 0)} veces; por eso se divide entre ${k}!.` },
        { id: 'exp', texto: f((n - k) * k, 0), error: 'TAL-BN-EXPONENTES', siFuera: `Los exponentes ${n - k} y ${k} están bien leídos, pero el coeficiente no los multiplica: cuenta de cuántas maneras se eligen los ${k} paréntesis de b.` },
        { id: 'menos', texto: f(C(n, k - 1), 0), error: 'TAL-BN-LUGAR', siFuera: `Usar C(${n}, k) es lo que toca, pero b sale ${k} veces, así que se eligen ${k} paréntesis: C(${n}, ${k}), no C(${n}, ${k - 1}).` },
        { id: 'dis', texto: '0', error: 'DIS', siFuera: `Es cierto que a${sup(n)} y b${sup(n)} salen, pero no son los únicos: al elegir a en unos paréntesis y b en otros salen productos mezclados, como ${abTxt(n, k)}.` },
      ]),
      solucion: { texto: `El coeficiente cuenta de cuántas maneras se eligen, entre los ${n} paréntesis, los ${k} que dan b.`, ecuacion: [`${CN(n, k)} = `, { frac: [`${n}!`, `${k}! · ${n - k}!`] }, ' = ', BU(f(c, 0))] },
    };
  }
  // Ahora tú 2 (tipo 1): la fila siguiente de Pascal.
  function casoPascal(r) {
    const n = r.ent(5, 8), k = r.ent(2, n - 1);
    const fl = fila(n), bien = fl[k - 1] + fl[k];
    return {
      pregunta: [`La fila ${n} del triángulo de Pascal es ${fl.join(', ')}. ¿Cuál es el coeficiente de ${abTxt(n + 1, k)} en (a + b)${sup(n + 1)}?`],
      datos: [DD.pascal, `La fila ${n + 1} da los coeficientes de (a + b)${sup(n + 1)}, en orden desde a${sup(n + 1)} hasta b${sup(n + 1)}`],
      opciones: ops([
        { id: 'c', texto: f(bien, 0), correcta: true },
        { id: 'par', texto: f(fl[k] + (fl[k + 1] || 0), 0), error: 'TAL-BN-PAR', siFuera: `Sumar dos números de arriba es la regla, pero ${abTxt(n + 1, k)} queda debajo del ${fl[k - 1]} y del ${fl[k]}, los de lugar ${k} y ${k + 1} en la fila ${n}.` },
        { id: 'doble', texto: f(2 * fl[k], 0), error: 'TAL-BN-DOBLE', siFuera: `Partir del ${fl[k]} está bien, pero se suma con su vecino de la izquierda, el ${fl[k - 1]}, y no consigo mismo.` },
        { id: 'copia', texto: f(fl[k], 0), error: 'TAL-BN-COPIA', siFuera: `El ${fl[k]} está bien ubicado, pero es de la fila ${n}; en la fila ${n + 1}, cada número suma los dos que tiene encima.` },
      ]),
      solucion: { texto: `En la fila ${n + 1}, el coeficiente de ${abTxt(n + 1, k)} es la suma de los dos números que tiene encima en la fila ${n}.`, ecuacion: [`${fl[k - 1]} + ${fl[k]} = `, BU(f(bien, 0))] },
    };
  }
  // Ahora tú 3 (tipo 2): cuántas cenefas de n losetas con k turquesas.
  function casoCenefas(r) {
    const n = r.ent(6, 9), k = r.ent(2, Math.min(4, n - 2));
    const c = C(n, k);
    return {
      pregunta: [`Rubén arma cenefas de ${n} losetas: ${lasN(k)} y las demás naranjas. ¿Cuántas cenefas distintas puede armar?`],
      datos: [DD.combQue, DD.comb, DD.fact, 'Dos cenefas son distintas si alguna posición cambia de color'],
      opciones: ops([
        { id: 'c', texto: f(c, 0), correcta: true },
        { id: 'orden', texto: f(V(n, k), 0), error: 'ORD', siFuera: `Elegir posiciones para las turquesas es la idea, pero las turquesas son iguales entre sí y su orden no cuenta; por eso se divide entre ${k}!.` },
        { id: 'todas', texto: f(2 ** n, 0), error: 'TAL-BN-TODAS', siFuera: `Es cierto que cada loseta puede ser de 2 colores, pero así se cuentan también las cenefas que no tienen exactamente ${lasN(k)}.` },
        { id: 'pos', texto: f(n * k, 0), error: 'TAL-BN-EXPONENTES', siFuera: `Hay ${n} posiciones y ${k} turquesas, es cierto, pero no se multiplican: se cuenta de cuántas maneras se eligen las ${k} posiciones turquesas.` },
      ]),
      solucion: { texto: `Una cenefa queda dicha al elegir en qué ${k} de las ${n} posiciones van las turquesas.`, ecuacion: [`${CN(n, k)} = `, BU(f(c, 0))] },
    };
  }
  // Ahora tú 4 (tipo 3, examen): dos coeficientes iguales de (x + y)ⁿ dan n.
  const xn = k => `xⁿ⁻${sup(k)}${pot('y', k)}`;
  function casoIguales(r) {
    const k1 = r.ent(2, 5), k2 = r.ent(k1 + 2, 8), n = k1 + k2;
    return {
      pregunta: [`En el desarrollo de (x + y)ⁿ, los coeficientes de ${xn(k1)} y de ${xn(k2)} son iguales. ¿Cuánto vale n?`],
      datos: [ex('En (x + y)ⁿ, el coeficiente de xⁿ⁻ᵏyᵏ es C(n, k)'), DD.simetria],
      opciones: ops([
        { id: 'c', texto: f(n, 0), correcta: true },
        { id: 'resta', texto: f(k2 - k1, 0), error: 'TAL-BN-RESTA', siFuera: `Igualar C(n, ${k1}) con C(n, ${k2}) es correcto, pero la simetría junta k con n − k: ${k2} es n − ${k1}, y n es la suma ${k1} + ${k2}.` },
        { id: 'lugar', texto: f(n + 2, 0), error: 'IDX', siFuera: `Sumar es el camino, pero se suman ${k1} y ${k2}, las veces que sale y, y no los lugares ${k1 + 1} y ${k2 + 1} de esos términos.` },
        { id: 'media', texto: f((k1 + k2) / 2, 1), error: 'TAL-BN-MEDIA', siFuera: `La simetría es la idea, pero ese número es el centro, n/2; n es el doble: ${k1} + ${k2}.` },
        { id: 'prod', texto: f(k1 * k2, 0), error: 'TAL-BN-EXPONENTES', siFuera: `Los números ${k1} y ${k2} son los que importan, pero no se multiplican: C(n, ${k1}) = C(n, n − ${k1}) pide que n − ${k1} sea ${k2}.` },
      ]),
      solucion: { texto: `Como ${k1} ≠ ${k2}, los dos coeficientes solo son iguales por la simetría: ${k2} tiene que ser n − ${k1}.`, ecuacion: [`n = ${k1} + ${k2} = `, BU(f(n, 0))] },
    };
  }

  // Ejemplos resueltos de la idea 1 (pestaña «Ejemplos», docs/teoria.md 4h). Cuentas rehechas aparte con Python
  // (scratchpad de la sesión, e9-algebra/cuentas-ejemplos.py), sin el código de la unidad. Cada distractor de nivel 3 rehace
  // su error. Las letras de las respuestas de nivel 3 van B, D, A, E, C (una vez cada una). Ninguna figura muestra lo
  // que se pide.
  const EJEMPLOS_ELECCION = [
    { nivel: 1, titulo: 'Una elección, un producto',
      enunciado: ['En (a + b)³ se elige b en el primer paréntesis y a en los otros dos. ¿Qué producto sale?'],
      datos: [DD.potencia, 'Al multiplicar letras iguales, sus exponentes se suman'],
      figura: CE({ objeto: 'parentesis', eleccion: [1, 0, 0], terminos: ['a', 'b'], abajo: [['producto: ?', null, 700]] }),
      solucion: [{ texto: 'Se multiplica lo que se eligió en cada paréntesis, y las dos a se juntan en a².', ecuacion: [SB('b'), ' · ', PA('a'), ' · ', PA('a'), ' = ', PA('a²'), SB('b')] }],
      respuesta: [BU('a²b')] },
    { nivel: 1, titulo: 'Contar cenefas',
      enunciado: ['¿Cuántas cenefas de 3 losetas tienen exactamente 1 loseta turquesa?'],
      datos: ['Dos cenefas son distintas si alguna posición cambia de color'],
      figura: CE({ objeto: 'cenefas', patrones: [[0, 0, 1]], lado: 26, abajo: [['¿cuántas como esta?', null, 700]] }),
      solucion: [
        { texto: 'La turquesa puede ir en la posición 1, en la 2 o en la 3; las otras dos son naranjas.' },
        { texto: 'Cada lugar de la turquesa da una cenefa distinta, así que se suma una por cada posición.', ecuacion: ['1 + 1 + 1 = ', BU('3')] },
      ],
      respuesta: [BU('3 cenefas')] },
    { nivel: 1, titulo: 'Un coeficiente con C',
      enunciado: ['¿Cuál es el coeficiente de a⁴b² en (a + b)⁶?'],
      datos: [DD.eleccion, DD.combQue, DD.comb, DD.fact],
      solucion: [
        { texto: 'En a⁴b², b sale 2 veces: hay que elegir, entre los 6 paréntesis, los 2 que dan b.' },
        { texto: 'Esas maneras las cuenta el número combinatorio C(6, 2).', ecuacion: [`${CN(6, 2)} = `, { frac: ['6!', '2! · 4!'] }, ' = ', { frac: ['720', '2 · 24'] }, ' = ', BU('15')] },
      ],
      respuesta: [BU('15')] },
    { nivel: 1, titulo: 'Todo de a',
      enunciado: ['¿Cuál es el coeficiente de a⁷ en (a + b)⁷?'],
      datos: [DD.eleccion],
      solucion: [{ texto: 'Para que salga a⁷ hay que elegir a en los 7 paréntesis. Esa elección es una sola.' }],
      respuesta: [BU('1')] },
    { nivel: 1, titulo: 'La fila que sigue',
      enunciado: ['La fila 4 del triángulo de Pascal es 1, 4, 6, 4, 1. ¿Cuál es la fila 5?'],
      datos: [DD.pascal, 'Cada fila empieza y termina en 1'],
      figura: TB({ triangular: true, filas: [['1'], ['1', '1'], ['1', '2', '1'], ['1', '3', '3', '1'], ['1', '4', '6', '4', '1'], ['1', '?', '?', '?', '?', '1']], alt: 'Triángulo de Pascal hasta la fila 4 y la fila 5 con sus números del medio por hallar' }),
      solucion: [
        { texto: 'Cada número del medio suma los dos que tiene encima.', ecuacion: ['1 + 4 = 5;   4 + 6 = 10'] },
        { texto: 'Los otros dos se calculan igual, y la fila queda simétrica: se lee igual al derecho y al revés.', ecuacion: ['6 + 4 = 10;   4 + 1 = 5'] },
      ],
      respuesta: [BU('1, 5, 10, 10, 5, 1')] },
    { nivel: 2, titulo: 'Desarrollar (a + b)⁴',
      enunciado: ['Desarrolla (a + b)⁴.'],
      datos: [DD.eleccion, DD.combQue, DD.comb, 'Fila 4 del triángulo de Pascal: 1, 4, 6, 4, 1'],
      solucion: [
        { texto: 'El término en que b sale k veces lleva a elevado a 4 − k, y su coeficiente C(4, k) se lee en la fila 4.' },
        { texto: 'Se escriben los cinco términos, de k = 0 a k = 4.', ecuacion: [PA('a⁴'), ' + 4', PA('a³'), SB('b'), ' + 6', PA('a²'), SB('b²'), ' + 4', PA('a'), SB('b³'), ' + ', SB('b⁴')] },
      ],
      respuesta: [BU('a⁴ + 4a³b + 6a²b² + 4ab³ + b⁴')] },
    { nivel: 2, titulo: 'Con x e y',
      enunciado: ['¿Cuál es el coeficiente de x²y⁵ en (x + y)⁷?'],
      datos: ['Cada término de (x + y)ⁿ sale de elegir x o y en cada uno de los n paréntesis', DD.combQue, DD.comb, DD.fact],
      solucion: [
        { texto: 'En x²y⁵, y sale 5 veces: se eligen los 5 paréntesis de la y entre los 7.', ecuacion: [`${CN(7, 5)} = `, { frac: ['7!', '5! · 2!'] }, ' = ', { frac: ['5040', '120 · 2'] }, ' = ', BU('21')] },
        { texto: 'Es lo mismo que elegir los 2 paréntesis de la x: C(7, 2) también da 21.' },
      ],
      respuesta: [BU('21')] },
    { nivel: 2, titulo: 'El mismo coeficiente',
      enunciado: ['En (a + b)⁹, ¿qué otro término tiene el mismo coeficiente que a⁷b²?'],
      datos: [DD.simetria, ex('En (a + b)ⁿ, el coeficiente de aⁿ⁻ᵏbᵏ es C(n, k)')],
      solucion: [
        { texto: 'El coeficiente de a⁷b² es C(9, 2), y por la simetría C(9, 2) = C(9, 7).' },
        { texto: 'C(9, 7) es el coeficiente del término en que b sale siete veces y a, dos.', ecuacion: [PA('a²'), SB('b⁷')] },
      ],
      respuesta: [BU('a²b⁷'), ' (los dos llevan 36)'] },
    { nivel: 2, titulo: 'Seis losetas, tres turquesas',
      enunciado: ['Rubén arma cenefas de 6 losetas: 3 turquesas y 3 naranjas. ¿Cuántas cenefas distintas puede armar?'],
      datos: [DD.combQue, DD.comb, DD.fact],
      figura: CE({ objeto: 'cenefas', patrones: [[0, 0, 0, 1, 1, 1], [1, 0, 1, 0, 1, 0]], lado: 24, abajo: [['dos de ellas; ¿cuántas hay?', null, 700]] }),
      solucion: [
        { texto: 'Una cenefa queda dicha al elegir las 3 posiciones turquesas entre las 6.' },
        { texto: 'Esas maneras las cuenta el número combinatorio C(6, 3).', ecuacion: [`${CN(6, 3)} = `, { frac: ['6!', '3! · 3!'] }, ' = ', { frac: ['720', '6 · 6'] }, ' = ', BU('20')] },
      ],
      respuesta: [BU('20 cenefas')] },
    { nivel: 2, titulo: 'Desde la fila de arriba',
      enunciado: ['La fila 7 de Pascal es 1, 7, 21, 35, 35, 21, 7, 1. ¿Cuál es el coeficiente de a⁵b³ en (a + b)⁸?'],
      datos: [DD.pascal, 'La fila 8 da los coeficientes de (a + b)⁸, de a⁸ a b⁸'],
      solucion: [
        { texto: 'En a⁵b³, b sale 3 veces (k = 3), así que su coeficiente es el cuarto número de la fila 8.' },
        { texto: 'Ese número suma los dos que tiene encima: el tercero y el cuarto de la fila 7.', ecuacion: ['21 + 35 = ', BU('56')] },
      ],
      respuesta: [BU('56')] },
    { nivel: 3, titulo: 'Un coeficiente grande',
      enunciado: ['¿Cuál es el coeficiente de a³b⁵ en el desarrollo de (a + b)⁸?'],
      alternativas: ['336', '56', '15', '28', '0'],
      datos: [DD.eleccion, DD.combQue, DD.comb, DD.fact],
      solucion: [
        { texto: 'b sale 5 veces: se eligen 5 paréntesis de 8. Por la simetría, C(8, 5) = C(8, 3), que da la cuenta corta.', ecuacion: [`${CN(8, 5)} = `, { frac: ['8 · 7 · 6', '3 · 2 · 1'] }, ' = ', BU('56')] },
        { texto: ['La ', letra('A'), ' cuenta en orden: 8 · 7 · 6 = 336. La ', letra('C'), ' multiplica los exponentes: 3 · 5 = 15.'] },
        { texto: ['La ', letra('D'), ' usa C(8, 6) = 28, con una b de más. La ', letra('E'), ' cree que solo quedan a⁸ y b⁸.'] },
      ],
      respuesta: [letra('B'), ', ', BU('56')] },
    { nivel: 3, titulo: 'Dos coeficientes iguales',
      enunciado: ['En (x + y)ⁿ, los coeficientes de xⁿ⁻⁴y⁴ y de xⁿ⁻⁶y⁶ son iguales. ¿Cuánto vale n?'],
      alternativas: ['2', '24', '12', '10', '5'],
      datos: [ex('En (x + y)ⁿ, el coeficiente de xⁿ⁻ᵏyᵏ es C(n, k)'), DD.simetria],
      solucion: [
        { texto: 'Como 4 ≠ 6, los coeficientes C(n, 4) y C(n, 6) solo son iguales por la simetría: 6 = n − 4.', ecuacion: ['n = 4 + 6 = ', BU('10')] },
        { texto: ['La ', letra('A'), ' resta: 6 − 4 = 2. La ', letra('B'), ' multiplica: 4 · 6 = 24.'] },
        { texto: ['La ', letra('C'), ' suma los lugares de los términos, 5 y 7, y da 12. La ', letra('E'), ' toma el centro, 5, como si fuera n.'] },
      ],
      respuesta: [letra('D'), ', ', BU('n = 10')] },
    { nivel: 3, titulo: 'Con la primera turquesa',
      enunciado: ['Rubén arma cenefas de 7 losetas con 3 turquesas, y la primera loseta debe ser turquesa. ¿Cuántas cenefas puede armar?'],
      alternativas: ['15', '35', '20', '6', '21'],
      datos: [DD.combQue, DD.comb, DD.fact],
      figura: CE({ objeto: 'cenefas', patrones: [[1, 0, 0, 1, 0, 1, 0]], lado: 24, abajo: [['una de ellas; ¿cuántas hay?', null, 700]] }),
      solucion: [
        { texto: 'La primera loseta ya es turquesa, así que faltan 2 turquesas para las otras 6 posiciones.', ecuacion: [`${CN(6, 2)} = `, { frac: ['6 · 5', '2 · 1'] }, ' = ', BU('15')] },
        { texto: ['La ', letra('B'), ' olvida la condición: C(7, 3) = 35. La ', letra('C'), ' pone 3 turquesas en las 6 que quedan: C(6, 3) = 20.'] },
        { texto: ['La ', letra('D'), ' cuenta solo las 6 posiciones libres. La ', letra('E'), ' reparte las 2 turquesas que faltan entre las 7 posiciones, sin sacar la primera: C(7, 2) = 21.'] },
      ],
      respuesta: [letra('A'), ', ', BU('15 cenefas')] },
    { nivel: 3, titulo: 'Una suma de Pascal',
      enunciado: ['C(9, 4) + C(9, 5) = C(10, m). ¿Cuánto vale m?'],
      alternativas: ['m = 9', 'm = 4', 'm = 6', 'm = 10', 'm = 5'],
      datos: [DD.pascal, 'En la fila n de Pascal, el número de lugar k + 1 es C(n, k)', DD.simetria],
      solucion: [
        { texto: 'C(9, 4) y C(9, 5) son vecinos en la fila 9: lugares 5 y 6. Su suma es el número que tienen debajo.' },
        { texto: 'Debajo del par de lugares 5 y 6 está el lugar 6 de la fila 10, que es C(10, 5).', ecuacion: ['m = ', BU('5')] },
        { texto: ['La ', letra('A'), ' y la ', letra('D'), ' copian el número de la fila, 9 o 10. La ', letra('B'), ' toma el 4 del vecino de la izquierda. La ', letra('C'), ' corre un lugar de más.'] },
      ],
      respuesta: [letra('E'), ', ', BU('m = 5')] },
    { nivel: 3, titulo: 'El término con b³',
      enunciado: ['En el desarrollo de (a + b)⁶, ¿cuál es el término que lleva b³?'],
      alternativas: ['a³b³', '6a³b³', '20a³b³', '120a³b³', '9a³b³'],
      datos: [DD.eleccion, DD.combQue, DD.comb, DD.fact],
      solucion: [
        { texto: 'b³ pide b en 3 de los 6 paréntesis; los otros 3 dan a³.', ecuacion: [`${CN(6, 3)} = `, { frac: ['6 · 5 · 4', '3 · 2 · 1'] }, ' = 20'] },
        { texto: 'El término completo es el coeficiente multiplicado por las letras.', ecuacion: [BU('20'), PA('a³'), SB('b³')] },
        { texto: ['La ', letra('A'), ' olvida el coeficiente. La ', letra('B'), ' usa el exponente 6 como coeficiente. La ', letra('D'), ' cuenta en orden: 6 · 5 · 4 = 120. La ', letra('E'), ' multiplica 3 · 3.'] },
      ],
      respuesta: [letra('C'), ', ', BU('20a³b³')] },
  ];

  const pascal = {
    id: 'pascal-elecciones',
    titulo: 'Elegir en cada paréntesis',
    pregunta: '¿De dónde salen los coeficientes de (a + b)ⁿ?',
    temas: ['Desarrollo del binomio'],
    pieza: 'alg-cenefa',
    aprendizaje: 'Cada término de (a + b)ⁿ sale de elegir a o b en cada paréntesis; el coeficiente cuenta las maneras de elegir k veces b.',
    actividad: 'Armar las cenefas de Rubén y contar cuántas hay con cada número de losetas turquesas.',
    // Lee: las cenefas, multiplicar paréntesis es elegir, los semejantes se juntan y qué mirar. No dice el coeficiente de
    // a³b² en (a + b)⁵ (la predicción) ni con qué n y k salen 6 cenefas (la misión).
    lee: {
      tarjetas: [
        { titulo: 'Las cenefas de Rubén', texto: 'Rubén adorna las paredes con cenefas, que son filas de losetas en las que cada loseta es naranja o turquesa. Con 3 losetas, «naranja, turquesa, turquesa» es una cenefa, y «turquesa, naranja, turquesa» es otra distinta.',
          pieza: 'alg-cenefa', dibujo: CE({ objeto: 'cenefas', patrones: [[0, 1, 1], [1, 0, 1]], lado: 30, letras: ['a', 'b'] }) },
        { titulo: 'Multiplicar es elegir', texto: '(a + b)³ es el producto (a + b)(a + b)(a + b). Para multiplicarlo, se elige a o b en cada paréntesis y se multiplica lo elegido: si se elige a, b y b, sale ab².',
          pieza: 'alg-cenefa', dibujo: CE({ objeto: 'parentesis', eleccion: [0, 1, 1], terminos: ['a', 'b'], abajo: [['a · b · b = ', null, 400], ['a', 'o', 700], ['b²', 'i', 700]] }) },
        { titulo: 'Juntar los iguales', texto: 'Elegir b, a y b, en ese orden, también da ab². Los productos con las mismas letras y los mismos exponentes son términos semejantes y se juntan en uno solo, cuyo coeficiente dice cuántas elecciones dieron ese producto.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cada loseta hace de un paréntesis: la naranja dice que ahí se eligió a, y la turquesa, que se eligió b. Cambia cuántas losetas hay y cuántas son turquesas, y cuenta las cenefas que salen.' },
      ],
    },
    ejemplos: EJEMPLOS_ELECCION,
    juega: {
      pieza: 'alg-cenefa',
      consigna: 'Cada cenefa es una manera de elegir a o b en los paréntesis; las que tienen igual número de turquesas dan el mismo término.',
      mision: {
        texto: 'Haz que salgan exactamente 6 cenefas distintas.',
        logrado: v => v.n === 4 && v.k === 2,
        bien: 'Listo: 4 losetas con 2 turquesas dan 6 cenefas; en (a + b)⁴, a²b² lleva 6.',
      },
      voz: 'Cada cenefa es un producto, y las que dan el mismo término se juntan.',
      leyenda: [
        { s: PA('a'), t: 'loseta naranja: se eligió a' },
        { s: SB('b'), t: 'loseta turquesa: se eligió b' },
        { s: 'n', t: 'cuántas losetas, o sea, cuántos paréntesis' },
        { s: SB('k'), t: 'cuántas losetas turquesas' },
      ],
      controles: [
        { id: 'n', etiqueta: 'n (losetas)', min: 1, max: 4, paso: 1, inicio: 3, decimales: 0 },
        { id: 'k', etiqueta: 'k (turquesas)', color: 'c-i', min: 0, max: 4, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => figuraJuego1(v.n, v.k),
      lectura: v => lecturaCenefas(v.n, v.k),
      minimo: 3,
    },
    predice: {
      pregunta: 'Al desarrollar (a + b)⁵ y juntar los términos semejantes, ¿cuál es el coeficiente de a³b²?',
      datos: ['(a + b)⁵ = (a + b)(a + b)(a + b)(a + b)(a + b)', 'En a³b², a sale 3 veces y b sale 2 veces'],
      voz: 'Piensa en las cenefas: ¿cuántas hay con 2 turquesas entre 5?',
      opciones: [
        { id: 'c', texto: '10', correcta: true },
        { id: 'cero', texto: '0', error: 'DIS', siFuera: 'Es cierto que a⁵ y b⁵ salen, pero no son los únicos: al elegir a en tres paréntesis y b en dos sale a · a · a · b · b = a³b².' },
        { id: 'orden', texto: '20', error: 'ORD', siFuera: 'Contar 5 · 4 serviría si las dos turquesas fueran distintas, pero son iguales: cambiarlas de lugar da la misma cenefa, así que cada una se contó dos veces.' },
        { id: 'exp', texto: '6', error: 'TAL-BN-EXPONENTES', siFuera: 'Los exponentes 3 y 2 están bien leídos, pero el coeficiente no sale de multiplicarlos: cuenta cuántas cenefas tienen 2 turquesas entre 5 losetas.' },
      ],
      dibujo: CE({ objeto: 'cenefas', patrones: [[0, 0, 0, 1, 1]], lado: 30, abajo: [['¿cuántas cenefas así?', null, 700]] }),
      revelar: CE(cenefas(5, 2, { lado: 20, abajo: [['10 cenefas', 'f', 700], [': 10a³b²', null, 700]] })),
      coincide: 'Coincide: hay 10 cenefas con 2 turquesas entre 5 losetas, y el término es 10a³b².',
      noCoincide: 'Revisemos: el coeficiente cuenta de cuántas maneras se eligen, sin importar el orden, los 2 paréntesis que dan b.',
    },
    mira: {
      pieza: 'alg-cenefa',
      datos: { pasos: [
        { objeto: 'parentesis', eleccion: [0, 0, 0, 1, 1], terminos: ['a', 'b'], abajo: [['a · a · a · b · b = ', null, 400], ['a³', 'o', 700], ['b²', 'i', 700]] },
        cenefas(5, 2, { lado: 20, abajo: [['10 cenefas', 'f', 700]] }),
        { objeto: 'grupos', filas: [0, 1, 2, 3, 4, 5].map(k => ({ patron: patrones(5, k)[0], rotulo: lasN(k), cuenta: `× ${C(5, k)}` })) },
      ] },
      voz: 'Cada cenefa con 2 turquesas es una manera de elegir dónde va b.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Esta es una elección: a en los tres primeros paréntesis y b en los dos últimos.', ecuacion: [PA('a³'), SB('b²')] },
        { estado: { paso: 1 }, texto: 'Si la b va en otro par de paréntesis, sale otra cenefa, pero el producto sigue siendo a³b².', ecuacion: [PA('a³'), SB('b²'), ' sale 10 veces'] },
        { estado: { paso: 1 }, texto: 'De cuántas maneras se eligen 2 paréntesis entre 5, sin importar el orden, lo dice el número combinatorio C(5, 2).', ecuacion: [`${CN(5, 2)} = `, { frac: ['5!', '2! · 3!'] }, ' = ', { frac: ['120', '2 · 6'] }, ' = ', BU('10')] },
        { estado: { paso: 2 }, texto: 'Con k turquesas pasa lo mismo: hay C(5, k) cenefas, y k va de 0 a 5.', ecuacion: ['1, 5, 10, 10, 5, 1'] },
        { estado: { paso: 2 }, texto: 'Esos seis números son los coeficientes del desarrollo, en orden desde a⁵ hasta b⁵.', ecuacion: [PA('a⁵'), ' + 5', PA('a⁴'), SB('b'), ' + 10', PA('a³'), SB('b²'), ' + …'] },
      ],
    },
    regla: {
      texto: 'Cada término de (a + b)ⁿ sale de elegir a o b en cada paréntesis. Si b sale k veces, el coeficiente C(n, k) cuenta cómo elegir esos k paréntesis. Elegir las b deja dichas las a: C(n, k) = C(n, n − k).',
      ecuacion: [{ llave: [BU('C(n, k)')], nota: 'coeficiente' }, { sup: [PA('a'), 'n − k'] }, { sup: [SB('b'), 'k'] }],
      condicion: 'k es un número natural de 0 a n, porque cuenta cuántos de los n paréntesis dan b.',
      // El dibujo de la regla: el triángulo de Pascal hasta la fila 5, con la fila de la predicción (n = 5) marcada y la
      // suma 4 + 6 = 10 con sus flechas.
      dibujo: TB({ triangular: true,
        filas: [0, 1, 2, 3, 4, 5].map(i => fila(i).map(c => ({ t: f(c, 0), color: i === 5 ? 'f' : null, fuerte: i === 5 }))),
        flechas: [{ de: [4, 1], a: [5, 2], color: 'f' }, { de: [4, 2], a: [5, 2], color: 'f' }],
        alt: 'Triángulo de Pascal hasta la fila 5: 1, 5, 10, 10, 5, 1; el 10 suma el 4 y el 6 de arriba' }),
      voz: 'En el triángulo de Pascal, cada número suma los dos de encima.',
    },
    // Así se resuelve: el coeficiente de un término de (x + y)ⁿ, con la simetría para la cuenta corta. «Ahora tú» pide el
    // coeficiente en (a + b)ⁿ, la fila siguiente de Pascal, las cenefas y n desde dos coeficientes iguales.
    resuelve: {
      pieza: 'alg-cenefa',
      generar(s) {
        const r = azar(s + 900);
        const n = r.ent(7, 10), k = r.ent(n - 3, n - 2), c = C(n, k), m = n - k;
        return {
          enunciado: [`¿Cuál es el coeficiente de ${pot('x', m)}${pot('y', k)} en el desarrollo de (x + y)${sup(n)}?`],
          datos: ['Cada término de (x + y)ⁿ sale de elegir x o y en cada uno de los n paréntesis', DD.combQue, DD.comb, DD.fact, DD.simetria],
          pasos: [
            { tipo: 'pide', texto: `Piden el número que acompaña a ${pot('x', m)}${pot('y', k)} cuando se multiplican los ${n} paréntesis y se juntan los términos semejantes.` },
            { tipo: 'datos', texto: `En ${pot('x', m)}${pot('y', k)}, y sale ${k} veces y x sale ${m}: de los ${n} paréntesis, ${k} aportan la y, y los otros ${m}, la x.` },
            { tipo: 'regla', texto: `El coeficiente cuenta de cuántas maneras se eligen los ${k} paréntesis de la y: es C(${n}, ${k}). Por la simetría, ese número es igual a C(${n}, ${m}).` },
            { tipo: 'cuentas', texto: `Conviene calcular C(${n}, ${m}), porque tiene menos factores arriba y abajo.`, ecuacion: [`${CN(n, m)} = `, { frac: [Array.from({ length: m }, (_, i) => n - i).join(' · '), Array.from({ length: m }, (_, i) => m - i).join(' · ')] }, ' = ', BU(f(c, 0))] },
            { tipo: 'sentido', texto: `Elegir los ${k} paréntesis de la y deja dichos los ${m} de la x; por eso las dos cuentas dan ${f(c, 0)}.` },
          ],
          respuesta: [BU(f(c, 0))],
        };
      },
    },
    ahoraTu: {
      voz: 'El coeficiente cuenta elecciones, sin orden.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoCoef, r);
        if (tipo === 1) return conCuatro(casoPascal, r);
        if (tipo === 2) return conCuatro(casoCenefas, r);
        return conCuatro(casoIguales, r);
      },
    },
  };

  // ---------- Monomios y binomios con número, signo y exponentes (ideas 2 a 4) ----------
  // Un monomio es { c, e } (coeficiente y exponente de x) o { c, e, y } (con exponente de y). mono() lo escribe:
  // «−160x³», «x²y³», «15x⁻²», «−1».
  function mono(c, e = 0, ey = 0, lx = 'x', ly = 'y') {
    const letras = `${e ? (e === 1 ? lx : lx + sup(e)) : ''}${ey ? (ey === 1 ? ly : ly + sup(ey)) : ''}`;
    if (!letras) return f(c, 0);
    return `${c === 1 ? '' : c === -1 ? '−' : f(c, 0)}${letras}`;
  }
  const monoM = (m, lx, ly) => mono(m.c, m.e || 0, m.y || 0, lx, ly);
  // El binomio (A + B): «(2x − 1)», «(x² + 3/x)» no: los de 1/x se escriben aparte (idea 3).
  const binTxt = (A, B) => { const tb = monoM(B); return `(${monoM(A)} ${/^−/.test(tb) ? '− ' + tb.slice(1) : '+ ' + tb})`; };
  // El monomio entero, entre paréntesis si lleva número o signo: «x», «(2x)», «(−3)». Si se eleva (p > 1), una letra
  // con su propio exponente también va entre paréntesis: (x³)³ y no «x³³», que se lee x elevado a 33 (auditoría, 26 nov).
  const bloque = (m, p = 1) => (m.c === 1 && (m.e || m.y) && (p === 1 || (!m.y && m.e === 1) || (!m.e && m.y === 1)) ? monoM(m) : `(${monoM(m)})`);
  // El término de lugar k + 1 de (A + B)ⁿ como monomio.
  const termino = (A, B, n, k) => ({ c: C(n, k) * A.c ** (n - k) * B.c ** k, e: (A.e || 0) * (n - k) + (B.e || 0) * k, y: (A.y || 0) * (n - k) + (B.y || 0) * k });
  // La cuenta del término: «C(5, 2) · (2x)³ · (−1)²», sin los factores con exponente 0.
  const cuentaTer = (A, B, n, k) => [CN(n, k), ...(n - k ? [`${bloque(A, n - k)}${n - k === 1 ? '' : sup(n - k)}`] : []), ...(k ? [`${bloque(B, k)}${k === 1 ? '' : sup(k)}`] : [])].join(' · ');
  // La misma cuenta en una ecuación, con a naranja y b turquesa.
  const cuentaEc = (A, B, n, k) => [CN(n, k), ...(n - k ? [' · ', PA(`${bloque(A, n - k)}${n - k === 1 ? '' : sup(n - k)}`)] : []), ...(k ? [' · ', SB(`${bloque(B, k)}${k === 1 ? '' : sup(k)}`)] : [])];
  const DT = {
    general: ['Término de lugar k + 1 de (a + b)ⁿ: ', ...ex(nb('tₖ₊₁ = C(n, k)aⁿ⁻ᵏbᵏ'))],
    orden: 'El desarrollo va de aⁿ (lugar 1) a bⁿ (lugar n + 1)',
    potProd: `Potencia de un producto: ${nb('(2x)³ = 2³x³ = 8x³')}`,
    signo: 'Un negativo con exponente par da positivo; con exponente impar, negativo',
  };

  // ---------- Idea 2: el término de lugar k + 1 ----------
  // Objeto: una cenefa de Rubén con los paréntesis de (2x − 1)⁵ (Lee y juego, pieza alg-cenefa, objeto 'parentesis'):
  // el lugar marcado elige cuántas veces se toma b = −1, y abajo se arma el término.
  // Cambia: el lugar, de 1 a 6. · Permanece: (2x − 1)⁵. · Progresa: el término de ese lugar, con su número y su signo.
  // · Se reserva: el signo en otro lugar par y otro binomio (la predicción: lugar 4 de (x − 2)⁶). · Debe verse: en el
  // lugar k + 1, b sale k veces, y a y b se elevan enteros.
  // Errores: IDX usa el lugar como k (hipótesis específica de SEL, Manitoba 2017) · SIG pierde el signo de (−b)ᵏ
  // (documentado como ejemplo didáctico, Burroughs) · BLO eleva la letra y no el número (ídem) · OBJ calcula otra cosa
  // cuando lo pedido es n (Manitoba 2014) · TAL-BN-LUGAR-INV cuenta los lugares desde el final · TAL-BN-EXPONENTE-N toma
  // el exponente de x como n · TAL-BN-LUGAR-N toma el lugar como n.
  const A2 = { c: 2, e: 1 }, B2 = { c: -1, e: 0 }, N2 = 5;
  const figuraJuego2 = l => {
    const k = l - 1, t = termino(A2, B2, N2, k);
    return CE({ objeto: 'parentesis', terminos: ['2x', '−1'], eleccion: Array.from({ length: N2 }, (_, i) => (i >= N2 - k ? 1 : 0)),
      arriba: [[`lugar ${l}: b sale ${k} ${k === 1 ? 'vez' : 'veces'}`, null, 700]],
      abajo: [[`${cuentaTer(A2, B2, N2, k)} = `, null, 400], [monoM(t), 'f', 700]] });
  };
  const lectura2 = l => { const k = l - 1, t = termino(A2, B2, N2, k); return [`Lugar ${l}, con k = ${k}: el término es `, BU(monoM(t))]; };

  // Ahora tú 1 (tipo 0): el término de un lugar dado de (x ± q)ⁿ o (px ± q)ⁿ.
  function casoTermino(r) {
    const n = r.ent(5, 7), A = { c: r.uno([1, 1, 2, 3]), e: 1 }, B = { c: r.uno([-3, -2, -1, 2, 3]), e: 0 }, k = r.ent(2, n - 2), L = k + 1;
    if (Math.abs(termino(A, B, n, k).c) > 5000) return null;
    const t = termino(A, B, n, k), tIdx = termino(A, B, n, k + 1);
    const sinNum = { c: C(n, k) * A.c ** (n - k) * B.c, e: t.e };   // BLO: eleva la letra de b y no su número
    const sinA = { c: C(n, k) * B.c ** k, e: t.e };                    // BLO: no eleva el número de a
    return {
      pregunta: [`En el desarrollo de ${binTxt(A, B)}${sup(n)}, ordenado de x${sup(n)} hacia abajo, ¿cuál es el término de lugar ${L}?`],
      datos: [DT.general, DD.combQue, DD.comb, DT.potProd],
      opciones: ops([
        { id: 'c', texto: monoM(t), correcta: true },
        { id: 'idx', texto: monoM(tIdx), error: 'IDX', siFuera: `La fórmula es la correcta, pero el lugar ${L} lleva k = ${k}: b sale ${k} veces y no ${L}, porque el lugar 1 es el de k = 0.` },
        { id: 'sig', texto: monoM({ c: -t.c, e: t.e }), error: 'SIG', siFuera: B.c < 0 ? `El valor del número está bien, pero (${f(B.c, 0)})${sup(k)} es ${k % 2 ? 'negativo' : 'positivo'}, porque k = ${k} es ${k % 2 ? 'impar' : 'par'}.` : `El valor del número está bien, pero aquí b es positivo, así que el término no lleva ningún signo menos.` },
        { id: 'blo', texto: monoM(A.c === 1 ? sinNum : sinA), error: 'BLO', siFuera: A.c === 1 ? `C(${n}, ${k}) está bien, pero b se elige ${k} veces: su número entra elevado, ${bloque(B, k)}${sup(k)}, y no una sola vez.` : `Elevar b está bien, pero (${monoM(A)})${sup(n - k)} eleva también el ${A.c}, que da ${A.c}${sup(n - k)}.` },
      ]),
      solucion: { texto: `El lugar ${L} tiene k = ${k}, y a y b se elevan enteros, con su número y su signo.`, ecuacion: [...cuentaEc(A, B, n, k), ' = ', BU(monoM(t))] },
    };
  }
  // Ahora tú 2 (tipo 1): el coeficiente de xᵐ en (px − q)ⁿ.
  function casoCoefSigno(r) {
    const n = r.ent(5, 7), A = { c: r.uno([1, 2, 3]), e: 1 }, B = { c: -r.uno([1, 2, 3]), e: 0 }, k = r.ent(1, n - 1), m = n - k;
    if (A.c === 1 && B.c === -1) return null;
    const t = termino(A, B, n, k);
    if (Math.abs(t.c) > 5000) return null;
    return {
      pregunta: [`¿Cuál es el coeficiente de ${pot('x', m)} en el desarrollo de ${binTxt(A, B)}${sup(n)}?`],
      datos: [DT.general, DD.combQue, DD.comb, DT.signo],
      opciones: ops([
        { id: 'c', texto: f(t.c, 0), correcta: true },
        { id: 'sig', texto: f(-t.c, 0), error: 'SIG', siFuera: `El valor está bien, pero (${f(B.c, 0)})${sup(k)} tiene exponente ${k % 2 ? 'impar: es negativo' : 'par: es positivo'}, y eso decide el signo.` },
        { id: 'solo', texto: f(C(n, k), 0), error: 'BLO', siFuera: `C(${n}, ${k}) está bien, pero el coeficiente también lleva los números de a y de b, elevados y multiplicados.` },
        { id: 'inv', texto: f(C(n, m) * A.c ** k * B.c ** m, 0), error: 'TAL-BN-LUGAR-INV', siFuera: `La fórmula está bien, pero x${sup(m)} pide a elevado a ${m}, así que b sale ${k} ${k === 1 ? 'vez' : 'veces'} y no ${m}.` },
      ]),
      solucion: { texto: `Para que salga x${sup(m)}, a se elige ${m} veces y b, k = ${k} ${k === 1 ? 'vez' : 'veces'}.`, ecuacion: [...cuentaEc(A, B, n, k), ' = ', BU(monoM(t))] },
    };
  }
  // Ahora tú 3 (tipo 2): en qué lugar está el término con xᵐ.
  function casoLugar(r) {
    const n = r.ent(6, 10), m = r.ent(2, n - 2), q = r.uno([2, 3, 5, -2, -3]), k = n - m;
    const B = { c: q, e: 0 };
    return {
      pregunta: [`En el desarrollo de ${binTxt({ c: 1, e: 1 }, B)}${sup(n)}, ordenado de x${sup(n)} hacia abajo, ¿en qué lugar está el término con ${pot('x', m)}?`],
      datos: [DT.general, DT.orden],
      opciones: ops([
        { id: 'c', texto: lugar(k + 1), correcta: true },
        { id: 'idx', texto: lugar(k), error: 'IDX', siFuera: `Es cierto que b sale ${k} veces, pero el lugar es k + 1, porque el primer término es el de k = 0.` },
        { id: 'inv', texto: lugar(m + 1), error: 'TAL-BN-LUGAR-INV', siFuera: `Contar desde un extremo es la idea, pero el lugar 1 es el de x${sup(n)}, así que se cuenta desde ese lado.` },
        { id: 'exp', texto: lugar(m), error: 'TAL-BN-EXPONENTE-N', siFuera: `Mirar el exponente ${m} sirve, pero el lugar lo da cuántas veces sale b: ${k} veces, y se le suma 1.` },
      ]),
      solucion: { texto: `x${sup(m)} pide a elevado a ${m}, así que b sale ${n} − ${m} = ${k} veces.`, ecuacion: ['lugar = k + 1 = ', BU(f(k + 1, 0))] },
    };
  }
  // Ahora tú 4 (tipo 3, examen, como San Marcos 2026-I con otros números): el término de lugar 3 de (x + q)ⁿ da n.
  function casoN(r) {
    const n = r.ent(5, 8), q = r.uno([2, 3, -2]), L = r.uno([2, 3, 4]), k = L - 1, t = termino({ c: 1, e: 1 }, { c: q, e: 0 }, n, k);
    if (Math.abs(t.c) > 5000) return null;
    return {
      pregunta: [`En el desarrollo de ${binTxt({ c: 1, e: 1 }, { c: q, e: 0 })}ⁿ, el término de lugar ${L} es ${monoM(t)}. ¿Cuánto vale n?`],
      datos: [DT.general, DD.combQue, DD.comb],
      opciones: ops([
        { id: 'c', texto: f(n, 0), correcta: true },
        { id: 'exp', texto: f(t.e, 0), error: 'TAL-BN-EXPONENTE-N', siFuera: `Mirar x${sup(t.e)} es el camino, pero ${t.e} es n − ${k}, las veces que sale a, y no n.` },
        { id: 'idx', texto: f(t.e + L, 0), error: 'IDX', siFuera: `Igualar el exponente de x está bien, pero en el lugar ${L} es k = ${k}, no ${L}: la ecuación es n − ${k} = ${t.e}.` },
        { id: 'lug', texto: f(t.e + k - 1, 0), error: 'TAL-BN-LUGAR', siFuera: `Plantear n − k = ${t.e} está bien, pero en el lugar ${L} es k = ${k}, porque b sale ${k} ${k === 1 ? 'vez' : 'veces'}.` },
      ]),
      solucion: { texto: `El lugar ${L} tiene k = ${k}, así que x sale n − ${k} veces, y eso tiene que dar ${t.e}.`, ecuacion: [`n − ${k} = ${t.e}  ⇒  n = `, BU(f(n, 0))] },
    };
  }

  // Ejemplos de la idea 2. Cuentas rehechas aparte (cuentas-ejemplos.py). Letras de nivel 3: C, A, E, B, D.
  const EJEMPLOS_GENERAL = [
    { nivel: 1, titulo: 'El lugar y k',
      enunciado: ['En el desarrollo de (a + b)⁷, ¿cuántas veces sale b en el término de lugar 5?'],
      datos: [DT.orden, 'El lugar 1 es a⁷: ahí b sale 0 veces'],
      solucion: [{ texto: 'Cada lugar agrega una b: el lugar 1 tiene 0, el lugar 2 tiene 1, y así; el lugar 5 tiene una b menos que su número.', ecuacion: ['k = 5 − 1 = ', BU('4')] }],
      respuesta: [BU('4 veces')] },
    { nivel: 1, titulo: 'Un término de (x + 1)⁶',
      enunciado: ['¿Cuál es el término de lugar 3 de (x + 1)⁶?'],
      datos: [DT.general, DD.combQue, DD.comb],
      solucion: [
        { texto: 'El lugar 3 tiene k = 2, y como b = 1, todas sus potencias valen 1.', ecuacion: [`${CN(6, 2)} · `, PA('x⁴'), ' · ', SB('1²'), ' = 15 · ', PA('x⁴')] },
      ],
      respuesta: [BU('15x⁴')] },
    { nivel: 1, titulo: 'Con signo menos',
      enunciado: ['¿Cuál es el término de lugar 2 de (x − 3)⁴?'],
      datos: [DT.general, DD.combQue, DD.comb],
      solucion: [{ texto: 'El lugar 2 tiene k = 1, y b = −3 entra con su signo.', ecuacion: [`${CN(4, 1)} · `, PA('x³'), ' · ', SB('(−3)'), ' = ', BU('−12x³')] }],
      respuesta: [BU('−12x³')] },
    { nivel: 1, titulo: 'El último término',
      enunciado: ['¿Cuál es el último término de (2x − 5)³?'],
      datos: [DT.orden, 'C(n, n) = 1'],
      solucion: [{ texto: 'El último término es bⁿ: sale de elegir b = −5 en los 3 paréntesis.', ecuacion: [SB('(−5)³'), ' = (−5)(−5)(−5) = ', BU('−125')] }],
      respuesta: [BU('−125')] },
    { nivel: 1, titulo: 'El primer término',
      enunciado: ['¿Cuál es el primer término de (3x + 1)⁴?'],
      datos: [DT.orden, DT.potProd],
      solucion: [{ texto: 'El primer término es aⁿ: sale de elegir a = 3x en los 4 paréntesis, y se elevan el 3 y la x.', ecuacion: [PA('(3x)⁴'), ' = 3⁴x⁴ = ', BU('81x⁴')] }],
      respuesta: [BU('81x⁴')] },
    { nivel: 2, titulo: 'Lugar 3 de (2x + 1)⁵',
      enunciado: ['¿Cuál es el término de lugar 3 de (2x + 1)⁵?'],
      datos: [DT.general, DD.combQue, DD.comb, DT.potProd],
      solucion: [
        { texto: 'El lugar 3 tiene k = 2: a = 2x sale 3 veces y b = 1 sale 2 veces.', ecuacion: [`${CN(5, 2)} · `, PA('(2x)³'), ' · ', SB('1²')] },
        { texto: 'Se eleva el 2 junto con la x.', ecuacion: ['10 · 8x³ · 1 = ', BU('80x³')] },
      ],
      respuesta: [BU('80x³')] },
    { nivel: 2, titulo: 'Un coeficiente con signo',
      enunciado: ['¿Cuál es el coeficiente de x² en el desarrollo de (x − 2)⁵?'],
      datos: [DT.general, DD.combQue, DD.comb, DT.signo],
      solucion: [
        { texto: 'x² pide a = x dos veces, así que b = −2 sale 5 − 2 = 3 veces.', ecuacion: [`${CN(5, 3)} · `, PA('x²'), ' · ', SB('(−2)³')] },
        { texto: '(−2)³ = −8: con exponente impar, el resultado es negativo.', ecuacion: ['10 · (−8) = ', BU('−80')] },
      ],
      respuesta: [BU('−80')] },
    { nivel: 2, titulo: 'Con dos letras',
      enunciado: ['¿Cuál es el término de lugar 4 de (x + 2y)⁵?'],
      datos: [DT.general, DD.combQue, DD.comb, DT.potProd],
      solucion: [
        { texto: 'El lugar 4 tiene k = 3: b = 2y sale 3 veces y a = x, 2 veces.', ecuacion: [`${CN(5, 3)} · `, PA('x²'), ' · ', SB('(2y)³')] },
        { texto: 'Al elevar b entero, (2y)³ = 8y³.', ecuacion: ['10 · x² · 8y³ = ', BU('80x²y³')] },
      ],
      respuesta: [BU('80x²y³')] },
    { nivel: 2, titulo: '¿En qué lugar?',
      enunciado: ['En el desarrollo de (x + 3)⁸, ordenado de x⁸ hacia abajo, ¿en qué lugar está el término con x⁵?'],
      datos: [DT.general, DT.orden],
      solucion: [
        { texto: 'x⁵ pide a = x cinco veces, así que b sale 8 − 5 = 3 veces: k = 3.' },
        { texto: 'El lugar va uno adelante de k: es k + 1.', ecuacion: ['3 + 1 = ', BU('4')] },
      ],
      respuesta: [BU('lugar 4')] },
    { nivel: 2, titulo: 'El primero negativo',
      enunciado: ['¿Cuál es el término de lugar 2 de (−x + 2)⁴?'],
      datos: [DT.general, DD.combQue, DD.comb, DT.signo],
      solucion: [
        { texto: 'El lugar 2 tiene k = 1: a = −x sale 3 veces y b = 2, una vez.', ecuacion: [`${CN(4, 1)} · `, PA('(−x)³'), ' · ', SB('2')] },
        { texto: '(−x)³ = −x³, porque el exponente es impar.', ecuacion: ['4 · (−x³) · 2 = ', BU('−8x³')] },
      ],
      respuesta: [BU('−8x³')] },
    { nivel: 3, titulo: 'El exponente n',
      enunciado: ['En el desarrollo de (x + 2)ⁿ, el término de lugar 3 es 60x⁴. ¿Cuánto vale n?'],
      alternativas: ['4', '7', '6', '3', '5'],
      datos: [DT.general, DD.combQue, DD.comb],
      solucion: [
        { texto: 'Lugar 3: k = 2, así que x sale n − 2 veces. Como el término lleva x⁴:', ecuacion: ['n − 2 = 4  ⇒  n = ', BU('6')] },
        { texto: 'Con n = 6 se comprueba el número del término.', ecuacion: [`${CN(6, 2)} · 2² = 15 · 4 = 60`] },
        { texto: ['La ', letra('A'), ' toma el exponente 4 como n. La ', letra('B'), ' usa k = 3, el lugar: n − 3 = 4 da 7.'] },
        { texto: ['La ', letra('D'), ' toma el lugar 3 como n. La ', letra('E'), ' usa n − 1 = 4.'] },
      ],
      respuesta: [letra('C'), ', ', BU('n = 6')] },
    { nivel: 3, titulo: 'Lugar 5 de (2x − 1)⁶',
      enunciado: ['¿Cuál es el término de lugar 5 de (2x − 1)⁶?'],
      alternativas: ['60x²', '−60x²', '15x²', '−12x', '240x²'],
      datos: [DT.general, DD.combQue, DD.comb, DT.potProd, DT.signo],
      solucion: [
        { texto: 'El lugar 5 tiene k = 4: a = 2x sale 2 veces y b = −1 sale 4 veces.', ecuacion: [`${CN(6, 4)} · `, PA('(2x)²'), ' · ', SB('(−1)⁴')] },
        { texto: '(2x)² = 4x² y (−1)⁴ = 1.', ecuacion: ['15 · 4x² · 1 = ', BU('60x²')] },
        { texto: ['La ', letra('B'), ' deja el signo menos, pero (−1)⁴ es positivo. La ', letra('C'), ' no eleva el 2: 15x².'] },
        { texto: ['La ', letra('D'), ' usa k = 5: 6 · 2x · (−1) = −12x. La ', letra('E'), ' eleva el 2 a la cuarta: 15 · 16 = 240.'] },
      ],
      respuesta: [letra('A'), ', ', BU('60x²')] },
    { nivel: 3, titulo: 'El coeficiente de x³',
      enunciado: ['¿Cuál es el coeficiente de x³ en el desarrollo de (3 − x)⁵?'],
      alternativas: ['90', '−270', '−10', '−30', '−90'],
      datos: [DT.general, DD.combQue, DD.comb, DT.signo],
      solucion: [
        { texto: 'Aquí a = 3 y b = −x. x³ pide b tres veces: k = 3, y a sale 2 veces.', ecuacion: [`${CN(5, 3)} · `, PA('3²'), ' · ', SB('(−x)³')] },
        { texto: 'Como el exponente es impar, (−x)³ = −x³.', ecuacion: ['10 · 9 · (−1) = ', BU('−90')] },
        { texto: ['La ', letra('A'), ' pierde el signo: 90. La ', letra('B'), ' eleva el 3 al cubo: 10 · 27 · (−1) = −270.'] },
        { texto: ['La ', letra('C'), ' olvida el 3²: −10. La ', letra('D'), ' no eleva el 3: 10 · 3 · (−1) = −30.'] },
      ],
      respuesta: [letra('E'), ', ', BU('−90')] },
    { nivel: 3, titulo: 'Dos coeficientes seguidos',
      enunciado: ['En (x + 1)ⁿ, los términos de lugar 3 y de lugar 4 tienen el mismo coeficiente. ¿Cuánto vale n?'],
      alternativas: ['7', '5', '3', '4', '6'],
      datos: [DT.general, DD.simetria],
      solucion: [
        { texto: 'El lugar 3 lleva C(n, 2) y el lugar 4, C(n, 3). Como 2 ≠ 3, son iguales solo por la simetría: 3 = n − 2.', ecuacion: ['n = 2 + 3 = ', BU('5')] },
        { texto: 'Se comprueba: C(5, 2) = C(5, 3) = 10.' },
        { texto: ['La ', letra('A'), ' usa los lugares como k: 3 + 4 = 7. La ', letra('C'), ' y la ', letra('D'), ' copian un lugar. La ', letra('E'), ' multiplica: 2 · 3 = 6.'] },
      ],
      respuesta: [letra('B'), ', ', BU('n = 5')] },
    { nivel: 3, titulo: 'El término con y⁴',
      enunciado: ['En el desarrollo de (x − 3y)⁶, ¿cuál es el término que lleva y⁴?'],
      alternativas: ['−1215x²y⁴', '15x²y⁴', '135x²y⁴', '1215x²y⁴', '−540x³y³'],
      datos: [DT.general, DD.combQue, DD.comb, DT.potProd, DT.signo],
      solucion: [
        { texto: 'y⁴ pide b = −3y cuatro veces: k = 4, y x sale 2 veces.', ecuacion: [`${CN(6, 4)} · `, PA('x²'), ' · ', SB('(−3y)⁴')] },
        { texto: '(−3y)⁴ = 81y⁴, positivo porque el exponente es par.', ecuacion: ['15 · 81 = ', BU('1215')] },
        { texto: ['La ', letra('A'), ' deja el signo menos. La ', letra('B'), ' no eleva el 3. La ', letra('C'), ' lo eleva al cuadrado: 15 · 9 = 135. La ', letra('E'), ' usa k = 3.'] },
      ],
      respuesta: [letra('D'), ', ', BU('1215x²y⁴')] },
  ];

  const general = {
    id: 'termino-general',
    titulo: 'El término general',
    pregunta: '¿Cómo se halla un término sin desarrollar todo?',
    temas: ['Término general'],
    pieza: 'alg-cenefa',
    aprendizaje: 'El término de lugar k + 1 lleva b k veces: C(n, k)aⁿ⁻ᵏbᵏ, con a y b enteros, su número y su signo.',
    actividad: 'Recorrer los lugares de (2x − 1)⁵ y armar el término de cada uno.',
    // Lee: el orden de los términos, a y b con número y signo, la potencia de un producto y qué mirar. No dice el
    // término de lugar 4 de (x − 2)⁶ (la predicción) ni en qué lugar está −40x² (la misión).
    lee: {
      tarjetas: [
        { titulo: 'Términos en orden', texto: 'Rubén escribe el desarrollo en orden: primero el término sin b, después el que tiene una b, luego el de dos, y así hasta bⁿ. A cada término le da un lugar, contando desde 1.',
          pieza: 'alg-cenefa', dibujo: CE({ objeto: 'grupos', filas: [0, 1, 2, 3].map(k => ({ patron: patrones(3, k)[0], rotulo: `lugar ${k + 1}`, cuenta: null })) }) },
        { titulo: 'a y b enteros', texto: 'En (2x − 1)⁵, a es 2x y b es −1, con su signo. Cada vez que se elige a, entra un 2x completo, con su número, y cada vez que se elige b, entra un −1.' },
        { titulo: 'Elevar un producto', texto: 'Al elevar un producto se eleva cada factor: (2x)³ = 2x · 2x · 2x = 8x³. Un número negativo cambia el signo con cada factor que se agrega: (−1)² = 1 y (−1)³ = −1.' },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve el lugar marcado y mira cuántas veces se eligió b en ese lugar y cómo se arma el término, con su número y su signo.' },
      ],
    },
    ejemplos: EJEMPLOS_GENERAL,
    juega: {
      pieza: 'alg-cenefa',
      consigna: 'Rubén escribe en orden los términos de (2x − 1)⁵. En cada lugar, b se eligió una vez más que en el anterior.',
      mision: {
        texto: 'Marca el término cuyo número es −40.',
        logrado: v => v.l === 4,
        bien: 'Listo: en el lugar 4, b sale tres veces: 10 · (2x)² · (−1)³ = −40x².',
      },
      voz: 'El signo de cada término lo decide cuántas veces sale −1.',
      leyenda: [
        { s: PA('2x'), t: 'a: el primer término' },
        { s: SB('−1'), t: 'b: el segundo, con su signo' },
        { s: 'lugar', t: 'el puesto del término, desde 1' },
        { s: 'k', t: 'cuántas veces se eligió b' },
      ],
      controles: [{ id: 'l', etiqueta: 'lugar', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: v => figuraJuego2(v.l),
      lectura: v => lectura2(v.l),
      minimo: 3,
    },
    predice: {
      pregunta: 'En el desarrollo de (x − 2)⁶, ordenado de x⁶ hacia abajo, ¿cuál es el término de lugar 4?',
      datos: ['El término de lugar 1 es x⁶', 'C(6, 3) = 20 y C(6, 4) = 15'],
      voz: 'Piensa en el juego: ¿cuántas veces sale b en el lugar 4?',
      opciones: [
        { id: 'c', texto: '−160x³', correcta: true },
        { id: 'sig', texto: '160x³', error: 'SIG', siFuera: 'El 20, la x³ y el 8 están bien, pero (−2)³ es −8, porque el exponente es impar, y el término queda negativo.' },
        { id: 'idx', texto: '240x²', error: 'IDX', siFuera: 'La cuenta con k = 4 está bien hecha, pero el lugar 4 tiene k = 3, porque el lugar 1 es el de k = 0.' },
        { id: 'blo', texto: '−40x³', error: 'BLO', siFuera: 'El 20 y la x³ están bien, pero b = −2 se elige tres veces: entra al cubo, (−2)³, y no una sola vez.' },
      ],
      dibujo: TB({ columnas: ['lugar', 'término'], filas: [['1', 'x⁶'], ['2', '…'], ['3', '…'], [{ t: '4', fuerte: true }, { t: '?', fuerte: true }], ['5', '…'], ['6', '…'], ['7', '…']],
        alt: 'Los siete lugares del desarrollo de (x − 2)⁶: el primero es x⁶; el de lugar 4 se pide' }),
      revelar: CE({ objeto: 'parentesis', terminos: ['x', '−2'], eleccion: [0, 0, 0, 1, 1, 1], arriba: [['lugar 4: b sale 3 veces', null, 700]],
        abajo: [['20 · x³ · (−2)³ = ', null, 400], ['−160x³', 'f', 700]] }),
      coincide: 'Coincide: el lugar 4 lleva b tres veces, y (−2)³ = −8 deja el término negativo.',
      noCoincide: 'Revisemos: el lugar 1 tiene b cero veces, así que el lugar 4 la tiene tres veces.',
    },
    mira: {
      pieza: 'alg-cenefa',
      datos: { objeto: 'parentesis', terminos: ['x', '−2'], eleccion: [0, 0, 0, 1, 1, 1] },
      voz: 'En el lugar 4, b sale tres veces: el lugar va uno adelante de k.',
      pasos: [
        { estado: {}, texto: 'El lugar 1 tiene b cero veces, así que el lugar 4 la tiene tres veces.', ecuacion: ['lugar 4: k = 3'] },
        { estado: {}, texto: 'De los 6 paréntesis, 3 dan a = x y los otros 3 dan b = −2.', ecuacion: [PA('x³'), ' · ', SB('(−2)³')] },
        { estado: {}, texto: 'Los 3 paréntesis de la b se pueden elegir de C(6, 3) maneras.', ecuacion: ['C(6, 3) = 20'] },
        { estado: {}, texto: 'Se multiplica todo, y como el exponente 3 es impar, (−2)³ es negativo.', ecuacion: ['20 · ', PA('x³'), ' · ', SB('(−8)'), ' = ', BU('−160x³')] },
      ],
    },
    regla: {
      texto: 'El término general es la fórmula del término de lugar k + 1: lleva b k veces y a, n − k veces. Cada uno se eleva entero, con su número y su signo.',
      ecuacion: [{ sub: [{ v: 'c-f', t: 't', m: 'lo que se busca' }, 'k + 1'] }, ' = ', { llave: [CN('n', 'k')], nota: 'k: veces de b' }, { sup: [PA('a'), 'n − k'] }, { sup: [SB('b'), 'k'] }],
      condicion: 'los términos se ordenan desde aⁿ, en el lugar 1, hasta bⁿ, en el último. Con b negativo, el término es negativo cuando k es impar.',
      dibujo: TB({ columnas: ['lugar', 'k', 'término de (x − 2)⁶'], colorCol: [null, 'i', 'f'],
        filas: [0, 1, 2, 3, 4, 5, 6].map(k => [String(k + 1), String(k), { t: monoM(termino({ c: 1, e: 1 }, { c: -2, e: 0 }, 6, k)), color: 'f', fuerte: k === 3 }]),
        alt: 'Los siete términos de (x − 2)⁶ con su lugar y su k: x⁶, −12x⁵, 60x⁴, −160x³, 240x², −192x y 64' }),
      voz: 'Es el binomio de Newton: el lugar va uno adelante de las veces de b.',
    },
    // Así se resuelve: el término de un lugar de (2x + q)ⁿ. «Ahora tú» pide el término de (x ± q)ⁿ o (px ± q)ⁿ, un
    // coeficiente con signo, el lugar de un término y n desde un término.
    resuelve: {
      pieza: 'alg-cenefa',
      generar(s) {
        const r = azar(s + 900);
        const n = r.ent(5, 6), A = { c: 2, e: 1 }, B = { c: r.uno([-3, 3, 5]), e: 0 }, k = r.ent(2, 3), L = k + 1, t = termino(A, B, n, k);
        return {
          enunciado: [`Halla el término de lugar ${L} del desarrollo de ${binTxt(A, B)}${sup(n)}.`],
          datos: [DT.general, DD.combQue, DD.comb, DT.potProd, DT.signo],
          pasos: [
            { tipo: 'pide', texto: `Piden el término completo del lugar ${L}: su número, su signo y su potencia de x.` },
            { tipo: 'datos', texto: `El exponente es n = ${n}; a = 2x y b = ${f(B.c, 0)}, con su signo. El lugar ${L} tiene k = ${k}.` },
            { tipo: 'regla', texto: `Por el término general, a sale ${n - k} veces y b sale ${k} veces, y cada uno se eleva entero.` },
            { tipo: 'cuentas', texto: `Se eleva el 2 junto con la x${B.c < 0 ? `, y (${f(B.c, 0)})${sup(k)} con su signo` : ''}.`, ecuacion: [...cuentaEc(A, B, n, k), ' = ', BU(monoM(t))] },
            { tipo: 'sentido', texto: `Como el lugar ${L} tiene k = ${k}, la x queda con exponente ${n} − ${k} = ${t.e}, que es justo el del término.` },
          ],
          respuesta: [BU(monoM(t))],
        };
      },
    },
    ahoraTu: {
      voz: 'Primero el k del lugar; después, a y b enteros.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoTermino, r);
        if (tipo === 1) return conCuatro(casoCoefSigno, r);
        if (tipo === 2) return conCuatro(casoLugar, r);
        return conCuatro(casoN, r);
      },
    },
  };

  // ---------- Idea 3: un término por su exponente ----------
  // Objeto: la cenefa de Rubén con rótulos: cada naranja aporta x² y cada turquesa 1/x (Lee y juego, alg-cenefa). El
  // juego es (x² + 1/x)⁶ y la cenefa con k turquesas suma el exponente 2(6 − k) − k.
  // Cambia: k, de 0 a 6. · Permanece: (x² + 1/x)⁶. · Progresa: el exponente de x del término. · Se reserva: un binomio
  // sin término independiente (la predicción: (x² + 1/x)⁵, donde k saldría 10/3). · Debe verse: el exponente baja 3
  // por cada turquesa y llega a 0 en una sola cenefa.
  // Errores (hipótesis de diseño salvo EXP, documentado en Manitoba 2014 sin desagregar): EXP suma o multiplica mal los
  // exponentes · IDX da el lugar k en vez de k + 1 · TAL-BN-REDONDEA redondea un k que no es natural · TAL-BN-MITAD
  // reparte mitad y mitad · TAL-BN-SIEMPRE cree que siempre hay término independiente · TAL-BN-NUNCA cree que no lo hay ·
  // TAL-BN-SINC olvida el número de b · TAL-BN-RAIZ no saca la raíz del parámetro · TAL-BN-INVIERTE cruza los exponentes
  // de a y b · BLO no eleva el número de b.
  // Un binomio (c₁xᵖ + c₂/x^q): A = { c: c₁, e: p }, B = { c: c₂, e: −q }.
  const bin3Txt = (A, B) => `(${monoM(A)} ${B.c < 0 ? '−' : '+'} ${Math.abs(B.c)}/${pot('x', -B.e)})`;
  const bloque3 = B => `(${B.c < 0 ? '−' : ''}${Math.abs(B.c)}/${pot('x', -B.e)})`;
  const cuentaEc3 = (A, B, n, k) => [CN(n, k), ...(n - k ? [' · ', PA(`${bloque(A, n - k)}${n - k === 1 ? '' : sup(n - k)}`)] : []), ...(k ? [' · ', SB(`${bloque3(B)}${k === 1 ? '' : sup(k)}`)] : [])];
  const uno = p => (p === 1 ? '' : p);   // «2(6 − k)», pero «(6 − k)» y no «1(6 − k)»
  const expDe = (A, B, n, k) => A.e * (n - k) + B.e * k;
  const kCero = (A, B, n) => { for (let k = 0; k <= n; k++) if (expDe(A, B, n, k) === 0) return k; return -1; };
  const DX = {
    negativo: '1/x = x⁻¹, y 1/x² = x⁻²',
    producto: ex('xᵐ · xⁿ = xᵐ⁺ⁿ'),
    potPot: ex('(xᵐ)ⁿ = xᵐⁿ'),
    cero: 'Término independiente: el que no tiene x (exponente 0)',
  };
  const A3 = { c: 1, e: 2 }, B3 = { c: 1, e: -1 }, N3 = 6;
  const figuraJuego3 = k => {
    const e = expDe(A3, B3, N3, k);
    return CE({ objeto: 'cenefas', patrones: [patrones(N3, k)[0]], letras: ['x²', '1/x'], lado: 40,
      arriba: [[`${N3 - k} de x²`, 'o', 700], [' y ', null, 400], [`${k} de 1/x`, 'i', 700]],
      abajo: [['exponente de x: ', null, 400], [`2 · ${N3 - k} − ${k} = ${f(e, 0)}`, 'f', 700]] });
  };
  const lectura3 = k => { const e = expDe(A3, B3, N3, k); return [`${N3 - k} ${N3 - k === 1 ? 'naranja' : 'naranjas'} y ${lasN(k)}: queda `, BU(e === 0 ? 'un número solo, sin ninguna x' : `x${sup(e)}`)]; };

  // Ahora tú 1 (tipo 0): el término independiente de (xᵖ + c/x^q)ⁿ.
  function casoIndep(r) {
    const p = r.uno([1, 2, 3]), q = r.uno([1, 2]), c = r.uno([1, 2, 3, -1, -2]), m = r.ent(1, 3);
    const k = p * m, n = (p + q) * m;   // p(n − k) = qk
    if (n > 9 || k < 1 || k >= n) return null;
    const A = { c: 1, e: p }, B = { c, e: -q }, v = C(n, k) * c ** k;
    if (Math.abs(v) > 20000) return null;
    return {
      pregunta: [`¿Cuál es el término independiente del desarrollo de ${bin3Txt(A, B)}${sup(n)}?`],
      datos: [DT.general, DD.combQue, DD.comb, DX.negativo, DX.potPot, DX.cero],
      opciones: ops([
        { id: 'c', texto: f(v, 0), correcta: true },
        { id: 'sinc', texto: f(C(n, k), 0), error: 'TAL-BN-SINC', siFuera: `k = ${k} y C(${n}, ${k}) están bien, pero b trae el número ${f(c, 0)}, que entra elevado a ${k}.` },
        { id: 'idx', texto: f(C(n, k - 1) * c ** (k - 1), 0), error: 'IDX', siFuera: `La cuenta del exponente está bien y da k = ${k}, pero entonces b sale ${k} veces; aquí se usó ${k - 1}.` },
        { id: 'blo', texto: f(C(n, k) * c, 0), error: 'BLO', siFuera: `C(${n}, ${k}) está bien, pero el ${f(c, 0)} de b se elige ${k} veces: entra elevado a ${k}, no una sola vez.` },
        { id: 'sig', texto: f(-v, 0), error: 'SIG', siFuera: c < 0 ? `El valor está bien, pero (${f(c, 0)})${sup(k)} tiene exponente ${k % 2 ? 'impar' : 'par'}, y eso decide el signo.` : 'El valor está bien, pero aquí b es positivo, así que el término no lleva signo menos.' },
      ]),
      solucion: { texto: `El exponente de x es ${uno(p)}(${n} − k) − ${uno(q)}k, y al igualarlo a 0 sale k = ${k}.`, ecuacion: [...cuentaEc3(A, B, n, k), ' = ', BU(f(v, 0))] },
    };
  }
  // Ahora tú 2 (tipo 1): el coeficiente de xᵐ en (xᵖ ± c/x)ⁿ.
  function casoCoefX(r) {
    const p = r.uno([2, 3]), c = r.uno([1, 2, -1, -2]), n = r.ent(5, 8), k = r.ent(1, n - 2);
    const A = { c: 1, e: p }, B = { c, e: -1 }, m = expDe(A, B, n, k);
    if (m <= 0 || m === p * n) return null;
    const v = C(n, k) * c ** k;
    const k2 = k + 1, v2 = C(n, k2) * c ** k2;
    return {
      pregunta: [`¿Cuál es el coeficiente de ${pot('x', m)} en el desarrollo de ${bin3Txt(A, B)}${sup(n)}?`],
      datos: [DT.general, DD.combQue, DD.comb, DX.negativo, DX.potPot, DX.producto],
      opciones: ops([
        { id: 'c', texto: f(v, 0), correcta: true },
        { id: 'sinc', texto: f(C(n, k), 0), error: 'TAL-BN-SINC', siFuera: `k = ${k} está bien, pero el ${f(c, 0)} de b también entra en el coeficiente, elevado a ${k}.` },
        { id: 'idx', texto: f(v2, 0), error: 'IDX', siFuera: `Igualar el exponente está bien, pero ${uno(p)}(${n} − k) − k = ${m} da k = ${k}, no ${k2}.` },
        { id: 'sig', texto: f(-v, 0), error: 'SIG', siFuera: c < 0 ? `El valor está bien, pero (${f(c, 0)})${sup(k)} tiene exponente ${k % 2 ? 'impar' : 'par'}, y eso decide el signo.` : 'El valor está bien, pero aquí b es positivo, así que el coeficiente no lleva signo menos.' },
        { id: 'blo', texto: f(C(n, k) * c, 0), error: 'BLO', siFuera: `C(${n}, ${k}) está bien, pero el ${f(c, 0)} de b se elige ${k} veces: entra elevado a ${k}.` },
      ]),
      solucion: { texto: `El exponente de x es ${uno(p)}(${n} − k) − k; al igualarlo a ${m} sale k = ${k}.`, ecuacion: [...cuentaEc3(A, B, n, k), ' = ', BU(mono(v, m))] },
    };
  }
  // Ahora tú 3 (tipo 2): ¿tiene término independiente? y en qué lugar.
  function casoExiste(r) {
    const p = r.uno([1, 2, 3]), q = r.uno([1, 2, 3]), n = r.ent(4, 9);
    if (p === q && n % 2 === 0 && r() < 0.5) return null;
    const A = { c: 1, e: p }, B = { c: 1, e: -q }, k = kCero(A, B, n), kr = p * n / (p + q);
    const si = k >= 0, kk = si ? k : Math.round(kr);
    if (!si && (kk < 1 || kk >= n)) return null;
    const dice = L => `Sí, el de lugar ${L}`;
    return {
      pregunta: [`¿Tiene término independiente el desarrollo de ${bin3Txt(A, B)}${sup(n)}? Si lo tiene, ¿en qué lugar está?`],
      datos: [DT.general, DX.negativo, DX.potPot, DX.cero],
      opciones: ops(si ? [
        { id: 'c', texto: dice(k + 1), correcta: true },
        { id: 'idx', texto: dice(k), error: 'IDX', siFuera: `k = ${k} está bien, pero el lugar es k + 1, porque el lugar 1 es el de k = 0.` },
        { id: 'no', texto: 'No tiene', error: 'TAL-BN-NUNCA', siFuera: `Plantear el exponente está bien, pero da k = ${k}, que es natural y está entre 0 y ${n}: el término sí existe.` },
        { id: 'inv', texto: dice(n - k + 1), error: 'TAL-BN-LUGAR-INV', siFuera: `k = ${k} está bien, pero los lugares se cuentan desde el término de x${sup(p * n)}, que es el lugar 1.` },
        { id: 'mitad', texto: dice(Math.floor(n / 2) + 1), error: 'TAL-BN-MITAD', siFuera: 'Buscar el medio serviría si a y b tuvieran el mismo exponente, pero aquí son distintos, y hay que despejar k.' },
      ] : [
        { id: 'c', texto: 'No tiene', correcta: true },
        { id: 'red', texto: dice(kk + 1), error: 'TAL-BN-REDONDEA', siFuera: `Plantear el exponente está bien, pero da k = ${frTxt(fr(p * n, p + q))}, que no es natural, y k no se redondea: cuenta veces.` },
        { id: 'red2', texto: dice(kk + (kk < kr ? 2 : 0)), error: 'TAL-BN-REDONDEA', siFuera: `Plantear el exponente está bien, pero k = ${frTxt(fr(p * n, p + q))} no puede contar veces, así que ningún lugar da exponente 0.` },
        { id: 'siempre', texto: dice(Math.floor(n / 2) + 1), error: 'TAL-BN-SIEMPRE', siFuera: 'Buscar el del medio es una idea, pero el término independiente no siempre existe: hay que despejar k y ver si es natural.' },
      ]),
      solucion: si
        ? { texto: `Al igualar a 0 el exponente ${uno(p)}(${n} − k) − ${uno(q)}k sale k = ${k}, que es el lugar ${k + 1}.`, ecuacion: [`k = ${k}  ⇒  lugar `, BU(f(k + 1, 0))] }
        : { texto: `Al igualar a 0 el exponente ${uno(p)}(${n} − k) − ${uno(q)}k sale k = ${frTxt(fr(p * n, p + q))}, que no es natural: ese término no existe.`, ecuacion: [BU('No tiene')] },
    };
  }
  // Ahora tú 4 (tipo 3, examen): el lugar del término independiente da n.
  function casoNLugar(r) {
    const p = r.uno([1, 2, 3]), q = r.uno([1, 2, 3]), k = r.ent(2, 5);
    if (p === q || (q * k) % p) return null;
    const n = k + q * k / p, L = k + 1;
    if (n > 12) return null;
    const A = { c: 1, e: p }, B = { c: 1, e: -q };
    const nIdx = (q * L) % p === 0 ? L + q * L / p : null, nInv = (p * k) % q === 0 ? k + p * k / q : null;
    return {
      pregunta: [`En el desarrollo de ${bin3Txt(A, B)}ⁿ, el término independiente está en el lugar ${L}. ¿Cuánto vale n?`],
      datos: [DT.general, DX.negativo, DX.potPot, DX.cero],
      opciones: ops([
        { id: 'c', texto: f(n, 0), correcta: true },
        { id: 'lug', texto: f(L, 0), error: 'TAL-BN-LUGAR-N', siFuera: `El lugar ${L} está bien ubicado, pero n es el exponente del binomio, y falta despejarlo de la ecuación del exponente de x.` },
        { id: 'k', texto: f(k, 0), error: 'OBJ', siFuera: `k = ${k} está bien, pero piden n, el exponente del binomio, que sale de ${uno(p)}(n − ${k}) = ${q === 1 ? k : `${q} · ${k}`}.` },
        { id: 'idx', texto: nIdx === null ? null : f(nIdx, 0), error: 'IDX', siFuera: `Igualar a 0 está bien, pero en el lugar ${L} es k = ${k}, no ${L}.` },
        { id: 'inv', texto: nInv === null ? null : f(nInv, 0), error: 'TAL-BN-INVIERTE', siFuera: `Plantear la ecuación está bien, pero cada a aporta ${p} al exponente y cada b, −${q}; esos números no se cruzan.` },
        { id: 'doble', texto: f(2 * k, 0), error: 'TAL-BN-MITAD', siFuera: `k = ${k} está bien, pero el término independiente no está al medio, porque los exponentes ${p} y ${q} son distintos.` },
      ]),
      solucion: { texto: `El lugar ${L} tiene k = ${k}, y el exponente de x, ${uno(p)}(n − ${k}) − ${q === 1 ? k : `${q} · ${k}`}, tiene que ser 0.`, ecuacion: [`n − ${k} = ${f(q * k / p, 0)}  ⇒  n = `, BU(f(n, 0))] },
    };
  }

  // Ejemplos de la idea 3. Cuentas rehechas aparte (cuentas-ejemplos.py). Letras de nivel 3: D, B, A, E, C.
  const EJEMPLOS_BUSCADO = [
    { nivel: 1, titulo: 'El exponente de un término',
      enunciado: ['En (x² + 1/x)⁷, ¿qué potencia de x lleva el término en que 1/x sale 2 veces?'],
      datos: [DX.negativo, DX.potPot, DX.producto],
      solucion: [{ texto: 'x² sale 7 − 2 = 5 veces y 1/x sale 2 veces; después, los exponentes se suman.', ecuacion: [PA('(x²)⁵'), ' · ', SB('(x⁻¹)²'), ' = x¹⁰ · x⁻² = ', BU('x⁸')] }],
      respuesta: [BU('x⁸')] },
    { nivel: 1, titulo: 'Juntar exponentes',
      enunciado: ['¿Qué potencia de x da (x³)² · (1/x)⁴?'],
      datos: [DX.negativo, DX.potPot, DX.producto],
      solucion: [{ texto: 'Se eleva cada parte por separado y después se suman los exponentes.', ecuacion: ['x⁶ · x⁻⁴ = ', BU('x²')] }],
      respuesta: [BU('x²')] },
    { nivel: 1, titulo: '¿Qué k anula?',
      enunciado: ['En (x + 1/x)⁸, un término lleva x en 8 − k paréntesis y 1/x en los otros k. ¿Para qué k no tiene x?'],
      datos: [DX.negativo, DX.producto, DX.cero],
      solucion: [{ texto: 'Con 1/x = x⁻¹, el exponente de x es (8 − k) − k = 8 − 2k, y que el término no tenga x quiere decir que ese exponente es 0.', ecuacion: ['8 − 2k = 0  ⇒  k = ', BU('4')] }],
      respuesta: [BU('k = 4')] },
    { nivel: 1, titulo: 'Independiente de (x + 1/x)⁴',
      enunciado: ['¿Cuál es el término independiente de (x + 1/x)⁴?'],
      datos: [DT.general, DD.combQue, DD.comb, DX.negativo, DX.cero],
      solucion: [
        { texto: 'x sale 4 − k veces y 1/x, k veces: el exponente es 4 − 2k = 0, así que k = 2.' },
        { texto: 'Como a y b no traen números, el término es solo el combinatorio.', ecuacion: [`${CN(4, 2)} = `, BU('6')] },
      ],
      respuesta: [BU('6')] },
    { nivel: 1, titulo: '¿Existe?',
      enunciado: ['¿Tiene término independiente el desarrollo de (x + 1/x)⁵?'],
      datos: [DT.general, DX.negativo, DX.cero],
      solucion: [
        { texto: 'El exponente de x es 5 − 2k, y se iguala a 0.', ecuacion: ['5 − 2k = 0  ⇒  k = 5/2'] },
        { texto: 'Pero k cuenta cuántas veces sale 1/x, así que tiene que ser natural, y 5/2 no lo es.' },
      ],
      respuesta: [BU('No tiene')] },
    { nivel: 2, titulo: 'Independiente de (x² + 1/x)⁹',
      enunciado: ['¿Cuál es el término independiente de (x² + 1/x)⁹?'],
      datos: [DT.general, DD.combQue, DD.comb, DX.negativo, DX.potPot, DX.cero],
      solucion: [
        { texto: 'El exponente de x es 2(9 − k) − k = 18 − 3k.', ecuacion: ['18 − 3k = 0  ⇒  k = 6'] },
        { texto: 'Como a y b no traen números, el término es solo el combinatorio.', ecuacion: [`${CN(9, 6)} = `, { frac: ['9 · 8 · 7', '3 · 2 · 1'] }, ' = ', BU('84')] },
      ],
      respuesta: [BU('84')] },
    { nivel: 2, titulo: 'Con un número en b',
      enunciado: ['¿Cuál es el término independiente de (x + 2/x)⁶?'],
      datos: [DT.general, DD.combQue, DD.comb, DX.negativo, DX.cero],
      solucion: [
        { texto: 'El exponente de x es 6 − 2k, que vale 0 con k = 3.' },
        { texto: 'Al elevar, (2/x)³ trae el número 2³ = 8.', ecuacion: [`${CN(6, 3)} · `, SB('2³'), ' = 20 · 8 = ', BU('160')] },
      ],
      respuesta: [BU('160')] },
    { nivel: 2, titulo: 'El coeficiente de x³',
      enunciado: ['¿Cuál es el coeficiente de x³ en el desarrollo de (x² − 1/x)⁶?'],
      datos: [DT.general, DD.combQue, DD.comb, DX.negativo, DX.potPot, DT.signo],
      solucion: [
        { texto: 'El exponente de x es 2(6 − k) − k = 12 − 3k.', ecuacion: ['12 − 3k = 3  ⇒  k = 3'] },
        { texto: 'b = −1/x sale 3 veces, y (−1)³ = −1 deja el signo menos.', ecuacion: [`${CN(6, 3)} · (−1)³ = `, BU('−20')] },
      ],
      respuesta: [BU('−20')] },
    { nivel: 2, titulo: 'Cubos y cuadrados',
      enunciado: ['¿Cuál es el término independiente de (x³ + 1/x²)⁵?'],
      datos: [DT.general, DD.combQue, DD.comb, DX.negativo, DX.potPot, DX.cero],
      solucion: [
        { texto: 'El exponente de x es 3(5 − k) − 2k = 15 − 5k.', ecuacion: ['15 − 5k = 0  ⇒  k = 3'] },
        { texto: 'Como a y b no traen números, el término es solo el combinatorio.', ecuacion: [`${CN(5, 3)} = `, BU('10')] },
      ],
      respuesta: [BU('10')] },
    { nivel: 2, titulo: 'El lugar del independiente',
      enunciado: ['En el desarrollo de (2x − 1/x)⁸, ¿en qué lugar está el término independiente?'],
      datos: [DT.general, DX.negativo, DX.cero],
      solucion: [
        { texto: 'El exponente de x es (8 − k) − k = 8 − 2k, que vale 0 con k = 4.' },
        { texto: 'El lugar va uno adelante de k: es k + 1.', ecuacion: ['4 + 1 = ', BU('5')] },
      ],
      respuesta: [BU('lugar 5')] },
    { nivel: 3, titulo: 'Independiente con números',
      enunciado: ['¿Cuál es el término independiente de (2x² − 1/x)⁶?'],
      alternativas: ['15', '−60', '240', '60', '20'],
      datos: [DT.general, DD.comb, DX.negativo, DX.potPot, DT.signo, DX.cero],
      solucion: [
        { texto: 'El exponente de x es 2(6 − k) − k = 12 − 3k, que vale 0 con k = 4.' },
        { texto: '(2x²)² trae 2² = 4 y (−1/x)⁴ trae (−1)⁴ = 1.', ecuacion: [`${CN(6, 4)} · `, PA('2²'), ' · ', SB('(−1)⁴'), ' = 15 · 4 = ', BU('60')] },
        { texto: ['La ', letra('A'), ' olvida el 2². La ', letra('B'), ' deja el signo menos. La ', letra('C'), ' eleva el 2 a la cuarta: 15 · 16. La ', letra('E'), ' usa k = 3: C(6, 3) = 20.'] },
      ],
      respuesta: [letra('D'), ', ', BU('60')] },
    { nivel: 3, titulo: 'El coeficiente de x⁶',
      enunciado: ['¿Cuál es el coeficiente de x⁶ en el desarrollo de (x³ + 2/x)⁶?'],
      alternativas: ['20', '160', '240', '60', '6'],
      datos: [DT.general, DD.combQue, DD.comb, DX.negativo, DX.potPot, DX.producto],
      solucion: [
        { texto: 'El exponente de x es 3(6 − k) − k = 18 − 4k.', ecuacion: ['18 − 4k = 6  ⇒  k = 3'] },
        { texto: 'Al elevar, (2/x)³ trae el número 2³ = 8.', ecuacion: [`${CN(6, 3)} · `, SB('2³'), ' = 20 · 8 = ', BU('160')] },
        { texto: ['La ', letra('A'), ' olvida el 2³. La ', letra('C'), ' usa k = 4: 15 · 16 = 240. La ', letra('D'), ' multiplica 20 · 3. La ', letra('E'), ' copia el exponente 6.'] },
      ],
      respuesta: [letra('B'), ', ', BU('160')] },
    { nivel: 3, titulo: 'Sin término independiente',
      enunciado: ['¿Cuál de estos desarrollos no tiene término independiente?'],
      alternativas: ['(x² + 1/x)⁴', '(x² + 1/x)⁶', '(x³ + 1/x)⁸', '(x + 1/x²)⁶', '(x² + 1/x³)⁵'],
      datos: [DT.general, DX.negativo, DX.potPot, DX.cero],
      solucion: [
        { texto: 'En (x² + 1/x)⁴ el exponente es 2(4 − k) − k = 8 − 3k: 8 − 3k = 0 da k = 8/3, que no es natural.' },
        { texto: ['Las demás sí: la ', letra('B'), ' con k = 4, la ', letra('C'), ' con k = 6, la ', letra('D'), ' con k = 2 y la ', letra('E'), ' con k = 2.'] },
      ],
      respuesta: [letra('A'), ', ', BU('(x² + 1/x)⁴')] },
    { nivel: 3, titulo: 'El número que falta',
      enunciado: ['El término independiente de (x² + m/x)⁶, con m positivo, es 240. ¿Cuánto vale m?'],
      alternativas: ['16', '4', '240', '15', '2'],
      datos: [DT.general, DD.combQue, DD.comb, DX.negativo, DX.potPot, DX.cero],
      solucion: [
        { texto: 'El exponente de x es 2(6 − k) − k = 12 − 3k, que vale 0 con k = 4, y el término es C(6, 4)m⁴ = 15m⁴.', ecuacion: ['15m⁴ = 240  ⇒  m⁴ = 16  ⇒  m = ', BU('2')] },
        { texto: ['La ', letra('A'), ' se queda en m⁴ = 16. La ', letra('B'), ' saca raíz cuadrada en vez de cuarta. La ', letra('C'), ' copia el 240, y la ', letra('D'), ', el 15.'] },
      ],
      respuesta: [letra('E'), ', ', BU('m = 2')] },
    { nivel: 3, titulo: 'n desde el lugar',
      enunciado: ['En el desarrollo de (x² + 1/x)ⁿ, el término independiente está en el lugar 5. ¿Cuánto vale n?'],
      alternativas: ['5', '4', '6', '12', '15/2'],
      datos: [DT.general, DX.negativo, DX.potPot, DX.cero],
      solucion: [
        { texto: 'El lugar 5 tiene k = 4, y el exponente de x, 2(n − 4) − 4, tiene que ser 0.', ecuacion: ['2(n − 4) = 4  ⇒  n = ', BU('6')] },
        { texto: ['La ', letra('A'), ' toma el lugar como n y la ', letra('B'), ' toma k. La ', letra('D'), ' cruza los exponentes: n − 4 = 2 · 4. La ', letra('E'), ' usa k = 5: 2(n − 5) = 5.'] },
      ],
      respuesta: [letra('C'), ', ', BU('n = 6')] },
  ];

  const buscado = {
    id: 'termino-buscado',
    titulo: 'Un término por su exponente',
    pregunta: '¿Cómo se encuentra el término que no tiene x?',
    temas: ['Término general'],
    pieza: 'alg-cenefa',
    aprendizaje: 'El exponente de x del término general depende de k; igualarlo al pedido da k, y si k no es natural, ese término no existe.',
    actividad: 'Cambiar las losetas de 1/x de una cenefa y mirar el exponente de x.',
    // Lee: cada loseta aporta una potencia, el exponente negativo, el exponente cero y qué mirar. No dice si (x² + 1/x)⁵
    // tiene término sin x (la predicción) ni cuántas turquesas lo dan en el juego (la misión).
    lee: {
      tarjetas: [
        { titulo: 'Losetas con potencias', texto: 'Ahora cada loseta naranja vale x² y cada turquesa vale 1/x. Una cenefa es el producto de sus losetas, así que sus potencias de x se juntan en una sola.',
          pieza: 'alg-cenefa', dibujo: CE({ objeto: 'cenefas', patrones: [[0, 1, 0]], letras: ['x²', '1/x'], lado: 40, abajo: [['x² · 1/x · x² = x³', null, 700]] }) },
        { titulo: 'Exponente negativo', texto: '1/x se escribe x⁻¹, porque dividir entre x resta 1 al exponente. Al multiplicar, los exponentes se suman con su signo: x² · x⁻¹ = x¹.' },
        { titulo: 'Sin x', texto: 'Un término sin x es uno en que x tiene exponente cero, porque x⁰ = 1. Se llama término independiente, ya que su valor no depende de x.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia cuántas losetas valen 1/x y mira cómo cambia el exponente de x de la cenefa.' },
      ],
    },
    ejemplos: EJEMPLOS_BUSCADO,
    juega: {
      pieza: 'alg-cenefa',
      consigna: 'En (x² + 1/x)⁶, cada cenefa de Rubén tiene 6 losetas: las naranjas valen x² y las turquesas, 1/x.',
      mision: {
        texto: 'Encuentra la cenefa cuyo término no tiene x.',
        logrado: v => v.k === 4,
        bien: 'Listo: con 2 naranjas y 4 turquesas queda x⁴ · x⁻⁴ = x⁰, el término independiente.',
      },
      voz: 'Cada turquesa que entra quita una naranja: el exponente baja 3.',
      leyenda: [
        { s: PA('x²'), t: 'loseta naranja: el primer término' },
        { s: SB('1/x'), t: 'loseta turquesa: el segundo' },
        { s: SB('k'), t: 'cuántas losetas turquesas' },
      ],
      controles: [{ id: 'k', etiqueta: 'k (turquesas)', color: 'c-i', min: 0, max: 6, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: v => figuraJuego3(v.k),
      lectura: v => lectura3(v.k),
      minimo: 3,
    },
    predice: {
      pregunta: '¿Tiene el desarrollo de (x² + 1/x)⁵ algún término sin x?',
      datos: ['1/x = x⁻¹', ex('xᵐ · xⁿ = xᵐ⁺ⁿ')],
      voz: 'Piensa cuánto baja el exponente con cada turquesa.',
      opciones: [
        { id: 'c', texto: 'No, ninguno', correcta: true },
        { id: 'red', texto: 'Sí, el de lugar 4', error: 'TAL-BN-REDONDEA', siFuera: 'Buscar el exponente más cercano a 0 es razonable, pero el lugar 4 da x¹, y un término sin x necesita exponente 0 justo.' },
        { id: 'mitad', texto: 'Sí, el de lugar 3', error: 'TAL-BN-MITAD', siFuera: 'Buscar al medio funciona si a y b tienen el mismo exponente, pero aquí no: en el lugar 3 queda x⁶ · x⁻² = x⁴.' },
        { id: 'siempre', texto: 'Sí: todo desarrollo tiene uno', error: 'TAL-BN-SIEMPRE', siFuera: 'En el juego, con 6 losetas, sí lo había, pero con 5 el exponente salta de x¹ a x⁻² sin pasar por 0.' },
      ],
      dibujo: CE({ objeto: 'cenefas', patrones: [[0, 0, 0, 0, 0]], letras: ['x²', '1/x'], lado: 40, abajo: [['5 losetas: ¿alguna cenefa sin x?', null, 700]] }),
      revelar: CE({ objeto: 'grupos', letras: ['x²', '1/x'], filas: [0, 1, 2, 3, 4, 5].map(k => ({ patron: patrones(5, k)[0], rotulo: lasN(k), cuenta: `x${sup(10 - 3 * k)}` })) }),
      coincide: 'Coincide: el exponente es 10, 7, 4, 1, −2 y −5. Salta el 0: no hay término sin x.',
      noCoincide: 'Revisemos: cada turquesa baja el exponente en 3, y de 10 no se llega justo a 0.',
    },
    mira: {
      pieza: 'alg-cenefa',
      datos: { objeto: 'grupos', letras: ['x²', '1/x'], filas: [0, 1, 2, 3, 4, 5].map(k => ({ patron: patrones(5, k)[0], rotulo: lasN(k), cuenta: `x${sup(10 - 3 * k)}` })) },
      voz: 'El exponente depende de k: se iguala al que se busca.',
      pasos: [
        { estado: {}, texto: 'Con k turquesas, x² sale 5 − k veces y 1/x sale k veces.', ecuacion: [{ sup: [PA('(x²)'), '5 − k'] }, ' · ', { sup: [SB('(x⁻¹)'), 'k'] }, ' = ', { sup: ['x', '10 − 3k'] }] },
        { estado: {}, texto: 'Para que el término no tenga x, su exponente tiene que ser 0.', ecuacion: ['10 − 3k = 0  ⇒  k = 10/3'] },
        { estado: {}, texto: 'Pero k cuenta losetas, así que tiene que ser un número natural de 0 a 5.', ecuacion: ['k = 3: x¹;   k = 4: x⁻²'] },
        { estado: {}, texto: 'Ningún k da 0: el desarrollo no tiene término sin x.', ecuacion: [BU('No hay término independiente')] },
      ],
    },
    regla: {
      texto: 'Para hallar un término por su exponente, se escribe el exponente de x del término de lugar k + 1 y se iguala al pedido. Si k no sale natural, ese término no existe.',
      ecuacion: [{ llave: [PA('e₁'), ' · (n − k) + ', SB('e₂'), ' · k'], nota: 'exponente de x en el lugar k + 1' }, ' = pedido'],
      condicion: 'e₁ y e₂ son los exponentes de x en a y en b, con 1/x escrito como x⁻¹. El término sin x es el de exponente 0.',
      dibujo: CE({ objeto: 'grupos', letras: ['x²', '1/x'], filas: [0, 1, 2, 3, 4, 5, 6].map(k => ({ patron: patrones(6, k)[0], rotulo: lasN(k), cuenta: 12 - 3 * k === 0 ? 'exponente 0' : `x${sup(12 - 3 * k)}` })) }),
      voz: 'Primero el exponente en función de k; después, igualar.',
    },
    // Así se resuelve: el término independiente de (c·xᵖ + 1/x^q)ⁿ, con número en a. «Ahora tú» pide el independiente de
    // (xᵖ + c/x^q)ⁿ, un coeficiente de xᵐ, si existe y dónde, y n desde el lugar.
    resuelve: {
      pieza: 'alg-cenefa',
      generar(s) {
        const r = azar(s + 900);
        const [p, q, m] = r.uno([[1, 1, 3], [2, 1, 2], [1, 2, 2], [2, 1, 3], [1, 1, 4]]), ca = r.uno([2, 3]);
        const k = p * m, n = (p + q) * m, A = { c: ca, e: p }, B = { c: 1, e: -q }, v = C(n, k) * ca ** (n - k);
        return {
          enunciado: [`¿Cuál es el término independiente del desarrollo de ${bin3Txt(A, B)}${sup(n)}?`],
          datos: [DT.general, DD.combQue, DD.comb, DX.negativo, DX.potPot, DX.cero],
          pasos: [
            { tipo: 'pide', texto: 'Piden el término sin x: el que tiene exponente de x igual a 0.' },
            { tipo: 'datos', texto: `El exponente es ${nb(`n = ${n}`)}; ${nb(`a = ${monoM(A)}`)} y ${nb(`b = 1/${pot('x', q)}`)}, que se escribe x⁻${sup(q)}.` },
            { tipo: 'regla', texto: `En el lugar k + 1, a sale ${n} − k veces y b, k veces: el exponente de x es ${uno(p)}(${n} − k) − ${uno(q)}k.` },
            { tipo: 'cuentas', texto: `Al igualar ${uno(p)}(${n} − k) − ${uno(q)}k a 0 sale k = ${k}. El ${ca} de a entra elevado a ${n - k}, porque a sale ${n - k} veces.`, ecuacion: [...cuentaEc3(A, B, n, k), ' = ', BU(f(v, 0))] },
            { tipo: 'sentido', texto: `Con k = ${k} queda x${sup(p * (n - k))} · x${sup(-q * k)} = x⁰, así que el término no tiene x.` },
          ],
          respuesta: [BU(f(v, 0))],
        };
      },
    },
    ahoraTu: {
      voz: 'Exponente de x en función de k, igualado al pedido.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoIndep, r);
        if (tipo === 1) return conCuatro(casoCoefX, r);
        if (tipo === 2) return conCuatro(casoExiste, r);
        return conCuatro(casoNLugar, r);
      },
    },
  };

  // ---------- Idea 4: cuántos términos y cuánto suman ----------
  // Objeto: todas las cenefas de n losetas, juntas por cuántas turquesas tienen (Lee y juego, alg-cenefa, objeto
  // 'grupos'): cada grupo es un término y el total de cenefas es la suma de los coeficientes de (a + b)ⁿ.
  // Cambia: n, de 1 a 6. · Permanece: una fila por grupo. · Progresa: cuántos grupos (n + 1) y cuántas cenefas (2ⁿ).
  // · Se reserva: un binomio con números (la predicción: la suma de coeficientes de (2x − 1)⁵). · Debe verse: con a y b
  // iguales a 1, cada término vale su coeficiente.
  // Errores (hipótesis de diseño): TAL-BN-DOS usa 2ⁿ con cualquier binomio · TAL-BN-ABS suma sin signos · TAL-BN-CERO
  // pone x = 0 · TAL-BN-PRIMERO toma el primer coeficiente, pⁿ, por la suma · TAL-BN-SIN-DESPEJAR se queda en la base de
  // bⁿ = S sin despejar n · TAL-BN-N cuenta n términos · TAL-BN-N2 cuenta n + 2 · TAL-BN-CENTRO-UNO cree que siempre hay un solo
  // central · IDX y SIG, BLO y OBJ como en las ideas 2 y 3 · EXP suma los exponentes en una potencia de potencia
  // (documentado en Manitoba 2014).
  const DS = {
    suma: 'Suma de coeficientes de P: el valor de P con cada letra igual a 1',
    terminos: '(a + b)ⁿ tiene n + 1 términos, de k = 0 a k = n',
    central: 'Con n par, el término central está en el lugar n/2 + 1',
    centrales: 'Con n impar, los centrales están en los lugares (n + 1)/2 y (n + 3)/2',
  };
  const gruposN = (n, extra = {}) => Object.assign({ objeto: 'grupos', filas: Array.from({ length: n + 1 }, (_, k) => ({ patron: patrones(n, k)[0], rotulo: lasN(k), cuenta: `× ${C(n, k)}` })) }, extra);
  const figuraJuego4 = n => CE(gruposN(n, { abajo: [[`${n + 1} grupos y `, null, 700], [`${2 ** n} cenefas`, 'f', 700]] }));
  const lectura4 = n => [`${n + 1} grupos, k de 0 a ${n}; en total `, BU(`2${sup(n)} = ${2 ** n} cenefas`)];

  // Ahora tú 1 (tipo 0): cuántos términos tiene un desarrollo.
  function casoCuantos(r) {
    const n = r.ent(5, 15), A = r.uno(['x²', 'x³', '2x', 'x']), B = r.uno(['3y', 'y²', '5', '1/x']);
    return {
      pregunta: [`¿Cuántos términos tiene el desarrollo de (${A} + ${B})${sup(n)}?`],
      datos: [DS.terminos],
      opciones: ops([
        { id: 'c', texto: f(n + 1, 0), correcta: true },
        { id: 'n', texto: f(n, 0), error: 'TAL-BN-N', siFuera: `Mirar el exponente ${n} es el camino, pero k va de 0 a ${n}, y eso da ${n} + 1 valores, uno por término.` },
        { id: 'n2', texto: f(n + 2, 0), error: 'TAL-BN-N2', siFuera: `Sumarle algo al exponente está bien, pero de 0 a ${n} hay ${n} + 1 números, no ${n} + 2.` },
        { id: 'dos', texto: f(2 * n, 0), error: 'TAL-BN-EXPONENTES', siFuera: `Es cierto que el binomio tiene dos términos, pero el desarrollo no tiene 2 · ${n}: tiene uno por cada valor de k, ${n} + 1.` },
      ]),
      solucion: { texto: `k va de 0 a ${n}, y hay un término por cada valor de k.`, ecuacion: [`${n} + 1 = `, BU(f(n + 1, 0))] },
    };
  }
  // Ahora tú 2 (tipo 1): el término central con n par.
  function casoCentral(r) {
    const n = r.uno([4, 6, 8]), p = r.uno([1, 2]), c = r.uno([1, 2, 3, -1, -2]), h = n / 2;
    const A = { c: 1, e: p }, B = { c, e: 0 }, t = termino(A, B, n, h), ti = termino(A, B, n, h - 1);
    if (Math.abs(t.c) > 20000) return null;
    return {
      pregunta: [`¿Cuál es el término central del desarrollo de ${binTxt(A, B)}${sup(n)}?`],
      datos: [DS.terminos, DS.central, DT.general, DD.combQue, DD.comb],
      opciones: ops([
        { id: 'c', texto: monoM(t), correcta: true },
        { id: 'idx', texto: monoM(ti), error: 'IDX', siFuera: `El lugar ${h + 1} está bien, pero ahí k = ${h}, no ${h - 1}, porque el lugar va uno adelante de k.` },
        { id: 'blo', texto: monoM({ c: C(n, h) * c, e: t.e }), error: 'BLO', siFuera: `C(${n}, ${h}) está bien, pero el ${f(c, 0)} de b se elige ${h} veces: entra elevado a ${h}.` },
        { id: 'sig', texto: monoM({ c: -t.c, e: t.e }), error: 'SIG', siFuera: c < 0 ? `El valor está bien, pero (${f(c, 0)})${sup(h)} tiene exponente ${h % 2 ? 'impar' : 'par'}, y eso decide el signo.` : 'El valor está bien, pero aquí b es positivo, así que el término no lleva signo menos.' },
        { id: 'exp', texto: monoM({ c: t.c, e: p + h }), error: 'EXP', siFuera: `El número está bien, pero (x${sup(p)})${sup(h)} = x${sup(p * h)}: en una potencia de potencia, los exponentes se multiplican.` },
      ]),
      solucion: { texto: `El desarrollo tiene ${n + 1} términos, así que el central está en el lugar ${h + 1}, con k = ${h}.`, ecuacion: [...cuentaEc(A, B, n, h), ' = ', BU(monoM(t))] },
    };
  }
  // Ahora tú 3 (tipo 2): la suma de coeficientes de (px + q)ⁿ.
  function casoSuma(r) {
    const n = r.ent(3, 7), p = r.uno([2, 3, 4]), q = r.uno([-1, -2, -3, 1, 2]);
    const s = (p + q) ** n;
    if (Math.abs(s) > 20000 || p + q === 2 || Math.abs(p + q) === 1 && r() < 0.3) return null;
    return {
      pregunta: [`¿Cuánto suman los coeficientes del desarrollo de ${binTxt({ c: p, e: 1 }, { c: q, e: 0 })}${sup(n)}?`],
      datos: [DS.suma, DS.terminos],
      opciones: ops([
        { id: 'c', texto: f(s, 0), correcta: true },
        { id: 'dos', texto: f(2 ** n, 0), error: 'TAL-BN-DOS', siFuera: `Es cierto que 2${sup(n)} es la suma para (a + b)${sup(n)}, pero aquí a y b traen números: hay que poner x = 1 en este binomio.` },
        { id: 'abs', texto: f((p + Math.abs(q)) ** n, 0), error: 'TAL-BN-ABS', siFuera: `Poner x = 1 es el camino, pero el ${f(q, 0)} va con su signo: queda ${p} ${q < 0 ? '−' : '+'} ${Math.abs(q)}.` },
        { id: 'cero', texto: f(q ** n, 0), error: 'TAL-BN-CERO', siFuera: `Reemplazar x por un número es la idea, pero con x = 0 queda solo el último término; la suma pide x = 1.` },
        { id: 'pn', texto: f(p ** n, 0), error: 'TAL-BN-PRIMERO', siFuera: `Elevar a ${n} está bien, pero ${p}${sup(n)} es solo el primer coeficiente, no la suma de todos.` },
      ]),
      solucion: { texto: 'Con x = 1, cada término vale su coeficiente, y el binomio da la suma de una vez.', ecuacion: [`(${p} · 1 ${q < 0 ? '−' : '+'} ${Math.abs(q)})${sup(n)} = ${par(p + q)}${sup(n)} = `, BU(f(s, 0))] },
    };
  }
  // Ahora tú 4 (tipo 3, examen): cuántos términos, sabiendo la suma de coeficientes.
  function casoTerminosSuma(r) {
    const [p, q] = r.uno([[3, -1], [1, 1], [2, 1], [1, 2], [5, -2]]), b = p + q, n = r.ent(4, 8), s = b ** n;
    if (s > 30000) return null;
    return {
      pregunta: [`Los coeficientes del desarrollo de (${p === 1 ? '' : p}x ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}y)ⁿ suman ${f(s, 0)}. ¿Cuántos términos tiene?`],
      datos: [DS.suma, DS.terminos],
      opciones: ops([
        { id: 'c', texto: f(n + 1, 0), correcta: true },
        { id: 'n', texto: f(n, 0), error: 'OBJ', siFuera: `n = ${n} está bien hallado, pero piden cuántos términos tiene el desarrollo, y son n + 1.` },
        { id: 'n2', texto: f(n + 2, 0), error: 'TAL-BN-N2', siFuera: `n = ${n} está bien, pero de k = 0 a k = ${n} hay ${n} + 1 valores, no ${n} + 2.` },
        { id: 'base', texto: f(b, 0), error: 'TAL-BN-SIN-DESPEJAR', siFuera: `Poner las letras en 1 está bien y deja ${b}ⁿ, pero falta despejar n de ${b}ⁿ = ${f(s, 0)}.` },
        { id: 'mitad', texto: f(s / b, 0), error: 'TAL-BN-EXPONENTES', siFuera: `Plantear ${b}ⁿ = ${f(s, 0)} está bien, pero n es el exponente al que se eleva ${b}, no ${f(s, 0)} ÷ ${b}.` },
      ]),
      solucion: { texto: `Con x = y = 1 queda ${b}ⁿ = ${f(s, 0)}, así que n = ${n}, y los términos son n + 1.`, ecuacion: [`${n} + 1 = `, BU(f(n + 1, 0))] },
    };
  }

  // Ejemplos de la idea 4. Cuentas rehechas aparte (cuentas-ejemplos.py). Letras de nivel 3: E, C, A, D, B.
  const EJEMPLOS_SUMA = [
    { nivel: 1, titulo: 'Cuántos términos',
      enunciado: ['¿Cuántos términos tiene el desarrollo de (a + b)⁹?'],
      datos: [DS.terminos],
      solucion: [{ texto: 'k va de 0 a 9, que son diez valores, y cada uno da un término.', ecuacion: ['9 + 1 = ', BU('10')] }],
      respuesta: [BU('10 términos')] },
    { nivel: 1, titulo: 'El del medio',
      enunciado: ['¿En qué lugar está el término central de (a + b)⁸?'],
      datos: [DS.terminos, DS.central],
      solucion: [{ texto: 'Hay 9 términos, y el del medio deja 4 a cada lado.', ecuacion: ['8/2 + 1 = ', BU('5')] }],
      respuesta: [BU('lugar 5')] },
    { nivel: 1, titulo: 'Dos centrales',
      enunciado: ['¿En qué lugares están los términos centrales de (a + b)⁷?'],
      datos: [DS.terminos, 'Los términos centrales dejan la misma cantidad de términos a cada lado'],
      solucion: [{ texto: 'Hay 8 términos, un número par: si se dejan 3 a cada lado, quedan 2 al medio, los lugares 4 y 5.', ecuacion: ['3 + 2 + 3 = 8'] }],
      respuesta: [BU('lugares 4 y 5')] },
    { nivel: 1, titulo: 'Sumar con 1',
      enunciado: ['¿Cuánto suman los coeficientes del desarrollo de (x + 1)⁶?'],
      datos: [DS.suma],
      solucion: [{ texto: 'Con x = 1, cada término vale su coeficiente, y el binomio vale 1 + 1.', ecuacion: ['(1 + 1)⁶ = 2⁶ = ', BU('64')] }],
      respuesta: [BU('64')] },
    { nivel: 1, titulo: 'Todas las cenefas',
      enunciado: ['¿Cuánto suman los coeficientes de (a + b)⁵?'],
      datos: [DS.suma, 'Fila 5 de Pascal: 1, 5, 10, 10, 5, 1'],
      figura: CE(gruposN(5, { filas: gruposN(5).filas.map(x => Object.assign({}, x, { cuenta: null })), abajo: [['¿cuántas cenefas en total?', null, 700]] })),
      solucion: [
        { texto: 'Con a = b = 1, la suma es (1 + 1)⁵.', ecuacion: ['2⁵ = ', BU('32')] },
        { texto: 'Da lo mismo que sumar la fila 5: 1 + 5 + 10 + 10 + 5 + 1 = 32, que son todas las cenefas.' },
      ],
      respuesta: [BU('32')] },
    { nivel: 2, titulo: 'Término central',
      enunciado: ['¿Cuál es el término central del desarrollo de (x + 2)⁶?'],
      datos: [DS.central, DT.general, DD.combQue, DD.comb],
      solucion: [
        { texto: 'Con n = 6 hay 7 términos, y el central es el lugar 4, con k = 3.' },
        { texto: 'b = 2 sale 3 veces, y 2³ = 8.', ecuacion: [`${CN(6, 3)} · `, PA('x³'), ' · ', SB('2³'), ' = 20 · 8x³ = ', BU('160x³')] },
      ],
      respuesta: [BU('160x³')] },
    { nivel: 2, titulo: 'Suma con signo',
      enunciado: ['¿Cuánto suman los coeficientes del desarrollo de (x − 3)⁴?'],
      datos: [DS.suma, DT.signo],
      solucion: [{ texto: 'Con x = 1, el binomio vale 1 − 3 = −2, y se eleva a 4.', ecuacion: ['(1 − 3)⁴ = (−2)⁴ = ', BU('16')] }],
      respuesta: [BU('16')] },
    { nivel: 2, titulo: 'Con dos letras',
      enunciado: ['¿Cuánto suman los coeficientes del desarrollo de (2x + y)⁵?'],
      datos: [DS.suma],
      solucion: [{ texto: 'Con x = 1 e y = 1, el binomio vale 2 · 1 + 1 = 3.', ecuacion: ['3⁵ = ', BU('243')] }],
      respuesta: [BU('243')] },
    { nivel: 2, titulo: 'Los dos centrales',
      enunciado: ['¿Cuáles son los coeficientes de los dos términos centrales de (x + 1)⁷?'],
      datos: [DS.centrales, DT.general, DD.combQue, DD.comb],
      solucion: [
        { texto: 'Los centrales están en los lugares 4 y 5, que tienen k = 3 y k = 4.', ecuacion: ['C(7, 3) = 35;   C(7, 4) = 35'] },
        { texto: 'Son iguales por la simetría: C(7, 3) = C(7, 4).' },
      ],
      respuesta: [BU('35 y 35')] },
    { nivel: 2, titulo: 'Potencias en los términos',
      enunciado: ['¿Cuántos términos tiene el desarrollo de (x³ + y²)¹²?'],
      datos: [DS.terminos],
      solucion: [
        { texto: 'Los exponentes de x³ y de y² no cambian cuántos valores toma k: de 0 a 12.', ecuacion: ['12 + 1 = ', BU('13')] },
      ],
      respuesta: [BU('13 términos')] },
    { nivel: 3, titulo: 'n desde la suma',
      enunciado: ['Los coeficientes del desarrollo de (x + 1)ⁿ suman 128. ¿Cuánto vale n?'],
      alternativas: ['64', '2', '8', '14', '7'],
      datos: [DS.suma, '2⁷ = 128'],
      solucion: [
        { texto: 'Con x = 1, el binomio vale 2, y la suma es 2ⁿ.', ecuacion: ['2ⁿ = 128  ⇒  n = ', BU('7')] },
        { texto: ['La ', letra('A'), ' divide 128 entre 2. La ', letra('B'), ' da la base. La ', letra('C'), ' da el número de términos, n + 1. La ', letra('D'), ' multiplica 2 · 7.'] },
      ],
      respuesta: [letra('E'), ', ', BU('n = 7')] },
    { nivel: 3, titulo: 'Suma con signo y números',
      enunciado: ['¿Cuánto suman los coeficientes del desarrollo de (2x − 3)⁴?'],
      alternativas: ['625', '16', '1', '−1', '81'],
      datos: [DS.suma, DT.signo],
      solucion: [
        { texto: 'Con x = 1, el binomio vale 2 − 3 = −1.', ecuacion: ['(−1)⁴ = ', BU('1')] },
        { texto: ['La ', letra('A'), ' suma sin signos: 5⁴ = 625. La ', letra('B'), ' usa 2⁴ como en (a + b)⁴. La ', letra('D'), ' olvida que el exponente par deja positivo el −1. La ', letra('E'), ' pone x = 0: (−3)⁴ = 81.'] },
      ],
      respuesta: [letra('C'), ', ', BU('1')] },
    { nivel: 3, titulo: 'Un central con signo',
      enunciado: ['¿Cuál es el término central del desarrollo de (x² − 2)⁶?'],
      alternativas: ['−160x⁶', '160x⁶', '60x⁸', '−20x⁶', '−160x⁵'],
      datos: [DS.central, DT.general, DD.combQue, DD.comb, DX.potPot, DT.signo],
      solucion: [
        { texto: 'Con n = 6, el central es el lugar 4, con k = 3; además, (x²)³ = x⁶ y (−2)³ = −8.', ecuacion: [`${CN(6, 3)} · `, PA('x⁶'), ' · ', SB('(−8)'), ' = ', BU('−160x⁶')] },
        { texto: ['La ', letra('B'), ' pierde el signo. La ', letra('C'), ' usa k = 2: 15 · x⁸ · 4. La ', letra('D'), ' no eleva el 2. La ', letra('E'), ' suma los exponentes, 2 + 3, en vez de multiplicarlos.'] },
      ],
      respuesta: [letra('A'), ', ', BU('−160x⁶')] },
    { nivel: 3, titulo: 'Los centrales de un impar',
      enunciado: ['¿Cuánto suman los coeficientes de los dos términos centrales de (x + 2)⁵?'],
      alternativas: ['80', '20', '40', '120', '160'],
      datos: [DS.centrales, DT.general, DD.combQue, DD.comb],
      solucion: [
        { texto: 'Los centrales están en los lugares 3 y 4. El lugar k + 1 lleva k veces b, así que k es el lugar menos 1: k = 2 y k = 3.', ecuacion: ['C(5, 2) · 2² = 40;   C(5, 3) · 2³ = 80'] },
        { texto: 'Se suman los dos coeficientes.', ecuacion: ['40 + 80 = ', BU('120')] },
        { texto: ['La ', letra('A'), ' y la ', letra('C'), ' toman uno solo. La ', letra('B'), ' olvida las potencias de 2: 10 + 10. La ', letra('E'), ' duplica el 80.'] },
      ],
      respuesta: [letra('D'), ', ', BU('120')] },
    { nivel: 3, titulo: 'Términos desde la suma',
      enunciado: ['Los coeficientes del desarrollo de (x + 2y)ⁿ suman 729. ¿Cuántos términos tiene?'],
      alternativas: ['6', '7', '8', '243', '3'],
      datos: [DS.suma, DS.terminos, '3⁶ = 729'],
      solucion: [
        { texto: 'Con x = y = 1: (1 + 2)ⁿ = 3ⁿ = 729, así que n = 6.' },
        { texto: 'El desarrollo tiene n + 1 términos.', ecuacion: ['6 + 1 = ', BU('7')] },
        { texto: ['La ', letra('A'), ' da n. La ', letra('C'), ' suma 2 a n. La ', letra('D'), ' divide 729 entre 3. La ', letra('E'), ' da la base.'] },
      ],
      respuesta: [letra('B'), ', ', BU('7 términos')] },
  ];

  const suma = {
    id: 'suma-coeficientes',
    titulo: 'Cuántos términos y cuánto suman',
    pregunta: '¿Cuántos términos tiene (a + b)ⁿ y cuánto suman sus coeficientes?',
    temas: ['Desarrollo del binomio'],
    pieza: 'alg-cenefa',
    aprendizaje: '(a + b)ⁿ tiene n + 1 términos, con uno o dos centrales; sus coeficientes suman lo que vale con cada letra igual a 1.',
    actividad: 'Juntar todas las cenefas de n losetas por grupos y contarlas.',
    // Lee: los grupos, contar todas, el coeficiente y el valor con letras en 1, y qué mirar. No dice cuánto suman los
    // coeficientes de (2x − 1)⁵ (la predicción) ni con qué n hay 16 cenefas (la misión).
    lee: {
      tarjetas: [
        { titulo: 'Todas las cenefas', texto: 'Rubén guarda todas las cenefas de 3 losetas, juntas en grupos según cuántas turquesas tienen. Cada grupo es un término de (a + b)³, y el número de cenefas del grupo es su coeficiente.',
          pieza: 'alg-cenefa', dibujo: CE(gruposN(3)) },
        { titulo: 'Coeficiente y valor', texto: 'Si a y b valen 1, cada término vale lo mismo que su coeficiente: 3a²b vale 3 · 1² · 1 = 3. Por eso, al sumar los términos con las letras en 1, se suman sus coeficientes.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia cuántas losetas tiene la cenefa, y cuenta cuántos grupos hay y cuántas cenefas hay en total.' },
      ],
    },
    ejemplos: EJEMPLOS_SUMA,
    juega: {
      pieza: 'alg-cenefa',
      consigna: 'Rubén junta todas sus cenefas de n losetas en grupos, y cada grupo reúne las que tienen igual número de turquesas: es un término.',
      mision: {
        texto: 'Haz que haya 16 cenefas en total.',
        logrado: v => v.n === 4,
        bien: 'Listo: con 4 losetas hay 5 grupos y 1 + 4 + 6 + 4 + 1 = 16 cenefas.',
      },
      voz: 'Cada loseta más duplica las cenefas.',
      leyenda: [
        { s: 'n', t: 'cuántas losetas: el exponente' },
        { s: '× 3', t: 'cuántas cenefas tiene el grupo' },
        { s: PA('a'), t: 'loseta naranja' },
        { s: SB('b'), t: 'loseta turquesa' },
      ],
      controles: [{ id: 'n', etiqueta: 'n (losetas)', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 }],
      dibujo: v => figuraJuego4(v.n),
      lectura: v => lectura4(v.n),
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuánto suman los coeficientes del desarrollo de (2x − 1)⁵?',
      datos: ['El desarrollo de (2x − 1)⁵ tiene 6 términos'],
      voz: 'Piensa qué valor de x deja a cada término igual a su coeficiente.',
      opciones: [
        { id: 'c', texto: '1', correcta: true },
        { id: 'dos', texto: '32', error: 'TAL-BN-DOS', siFuera: 'Es cierto que los coeficientes de (a + b)⁵ suman 2⁵, pero aquí a y b traen números, 2x y −1, que cambian la suma.' },
        { id: 'abs', texto: '243', error: 'TAL-BN-ABS', siFuera: 'Poner x = 1 es el camino, pero el −1 va con su signo: queda 2 − 1, no 2 + 1.' },
        { id: 'cero', texto: '−1', error: 'TAL-BN-CERO', siFuera: 'Reemplazar x por un número es la idea, pero con x = 0 solo queda el último término, −1; la suma pide x = 1.' },
      ],
      dibujo: TB({ columnas: ['término', 'coeficiente'], filas: ['x⁵', 'x⁴', 'x³', 'x²', 'x', 'número solo'].map(t => [t, '?']).concat([[{ t: 'suma', fuerte: true }, { t: '?', fuerte: true }]]),
        alt: 'Los seis términos de (2x − 1)⁵ con sus coeficientes por hallar y su suma' }),
      revelar: TB({ columnas: ['término', 'coeficiente'], colorCol: [null, 'f'], filas: [[5, 32], [4, -80], [3, 80], [2, -40], [1, 10], [0, -1]].map(([e, c]) => [e ? pot('x', e) : 'número solo', f(c, 0)]).concat([[{ t: 'suma', fuerte: true }, { t: '1', fuerte: true, color: 'f' }]]),
        alt: '(2x − 1)⁵ = 32x⁵ − 80x⁴ + 80x³ − 40x² + 10x − 1; sus coeficientes suman 1' }),
      coincide: 'Coincide: con x = 1 queda (2 − 1)⁵ = 1. Los seis coeficientes suman 1.',
      noCoincide: 'Revisemos: con x = 1 cada término vale su coeficiente, y (2 · 1 − 1)⁵ = 1.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: { columnas: ['término', 'con x = 1'], colorCol: [null, 'f'],
        filas: [[5, 32], [4, -80], [3, 80], [2, -40], [1, 10], [0, -1]].map(([e, c]) => [`${f(c, 0)}${e ? pot('x', e) : ''}`, { t: f(c, 0), desde: 1 }]).concat([[{ t: 'suma', fuerte: true }, { t: '1', fuerte: true, color: 'f', desde: 2 }]]),
        alt: 'Los seis términos de (2x − 1)⁵; con x = 1 cada uno vale su coeficiente y la suma es 1' },
      voz: 'Con x = 1 se ve la suma sin desarrollar.',
      pasos: [
        { estado: { corte: 0 }, texto: '(2x − 1)⁵ tiene 6 términos: k va de 0 a 5.', ecuacion: ['5 + 1 = 6'] },
        { estado: { corte: 1 }, texto: 'Con x = 1, cada potencia de x vale 1, así que cada término vale su coeficiente.', ecuacion: ['32 · 1⁵ = 32;   −80 · 1⁴ = −80'] },
        { estado: { corte: 2 }, texto: 'Sumar los términos con x = 1 es sumar los coeficientes.', ecuacion: ['32 − 80 + 80 − 40 + 10 − 1 = ', BU('1')] },
        { estado: { corte: 2 }, texto: 'Sin desarrollar se llega a lo mismo: con x = 1, el binomio vale 2 − 1 = 1.', ecuacion: ['(2 · 1 − 1)⁵ = 1⁵ = 1'] },
        { estado: { corte: 2 }, texto: 'Con 6 términos, que son un número par, hay dos al medio: los lugares 3 y 4.', ecuacion: [{ frac: ['5 + 1', '2'] }, ' = 3;   ', { frac: ['5 + 3', '2'] }, ' = 4'] },
      ],
    },
    regla: {
      texto: 'La suma S de los coeficientes del desarrollo P es P(1): P con cada letra igual a 1. (a + b)ⁿ tiene n + 1 términos; si n es par, el central está en el lugar n/2 + 1, y si es impar hay dos.',
      ecuacion: [BU('S'), ' = P(1)'],
      condicion: 'P es un polinomio, como el desarrollo de (a + b)ⁿ con n natural.',
      dibujo: CE(gruposN(4, { abajo: [['S = 1 + 4 + 6 + 4 + 1 = 16 = 2⁴', 'f', 700]] })),
      voz: 'Todas las cenefas de n losetas son 2ⁿ.',
    },
    // Así se resuelve: la suma de coeficientes de un binomio con dos letras. «Ahora tú» pide cuántos términos, el central,
    // la suma de (px + q)ⁿ y cuántos términos desde la suma.
    resuelve: {
      pieza: 'alg-cenefa',
      generar(s) {
        const r = azar(s + 900);
        const n = r.ent(3, 6), [p, q] = r.uno([[1, -3], [2, -5], [3, -1], [1, 2], [2, 3]]), b = p + q, v = b ** n;
        const A = { c: 1, e: 2 }, B = { c: q, e: 0, y: 1 }, pa = p === 1 ? 'x²' : `${p}x²`;
        return {
          enunciado: [`¿Cuánto suman los coeficientes del desarrollo de (${pa} ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}y)${sup(n)}?`],
          datos: [DS.suma, DT.signo],
          pasos: [
            { tipo: 'pide', texto: `Piden la suma de los ${n + 1} coeficientes del desarrollo, sin escribirlo entero.` },
            { tipo: 'datos', texto: `El binomio tiene dos letras, x e y, y b = ${monoM(B)} va con su signo.` },
            { tipo: 'regla', texto: 'La suma de coeficientes es lo que vale la expresión cuando cada letra es igual a 1.' },
            { tipo: 'cuentas', texto: `Con x = 1 e y = 1, el binomio vale ${p} ${q < 0 ? '−' : '+'} ${Math.abs(q)} = ${f(b, 0)}.`, ecuacion: [`${par(b)}${sup(n)} = `, BU(f(v, 0))] },
            { tipo: 'sentido', texto: `Con x = 1, x² también vale 1, así que los exponentes no cambian la suma.${v < 0 ? ' Como la base es negativa y n es impar, la suma sale negativa.' : ''}` },
          ],
          respuesta: [BU(f(v, 0))],
        };
      },
    },
    ahoraTu: {
      voz: 'Términos: n + 1. Suma: cada letra en 1.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoCuantos, r);
        if (tipo === 1) return conCuatro(casoCentral, r);
        if (tipo === 2) return conCuatro(casoSuma, r);
        return conCuatro(casoTerminosSuma, r);
      },
    },
  };

  // ---------- Idea 5: exponente que no es natural ----------
  // Objeto: la calculadora (Lee, arit-calculadora, compartida: solo se usa) con √1,02 y su aproximación, y el cuaderno con
  // los coeficientes de (1 + x) elevado a α uno tras otro (juego, alg-tabla). Cada coeficiente es el anterior por (α − k + 1)/k.
  // Cambia: α (2, 3, −1, −2). · Permanece: la cuenta de los coeficientes. · Progresa: si algún factor llega a 0. · Se
  // reserva: α fraccionario (la predicción: (1 + x) elevado a 1/2). · Debe verse: con α natural, el factor α − α = 0
  // corta el desarrollo; con α negativo, ningún factor llega a 0.
  // Errores: GEN extiende el desarrollo finito a un α que no es natural (documentado en universitarios, Tatira 2021) ·
  // FAC olvida el k! o lo cambia por k (documentado en Manitoba 2017) · SIG pierde un signo · TAL-BN-FINITO cree que
  // siempre termina · TAL-BN-ALFA2 eleva α en vez de bajar de 1 en 1 · TAL-BN-DOS-TERM se queda con dos términos ·
  // TAL-BN-SIN-RAIZ no saca la raíz.
  // Fracciones exactas: [num, den].
  const frMul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
  const frSum = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const frDe = t => { const m = String(t).replace('−', '-').split('/'); return fr(+m[0], +(m[1] || 1)); };
  // Coeficiente de xᵏ en (1 + x) elevado a α: α(α − 1)…(α − k + 1)/k!, con α = [p, q].
  const coefA = (al, k) => { let c = [1, 1]; for (let i = 0; i < k; i++) c = frMul(c, fr(al[0] - i * al[1], al[1] * (i + 1))); return c; };
  const alTxt = al => frTxt(al);
  // «(1 + x)⁻²», «(1 + x) elevado a 1/2»: los exponentes enteros con superíndice; las fracciones, en palabras.
  const potA = (al, base = '(1 + x)') => (al[1] === 1 ? `${base}${sup(al[0])}` : `${base} elevado a ${alTxt(al)}`);
  // Un decimal exacto de una fracción con denominador 2ᵃ5ᵇ: «1,0198».
  const decimal = q => { let [n, d] = q, s = n < 0 ? '−' : ''; n = Math.abs(n); let ent = Math.floor(n / d), r = n % d, dec = ''; for (let i = 0; i < 12 && r; i++) { r *= 10; dec += Math.floor(r / d); r %= d; } return `${s}${ent}${dec ? ',' + dec : ''}`; };
  const DA = {
    coef: ex('Coeficiente de xᵏ en (1 + x) elevado a α: α(α − 1)…(α − k + 1)/k!'),
    natural: 'Si α es natural, el desarrollo termina: tiene α + 1 términos',
    vale: 'Con α no natural, la suma sirve si x está entre −1 y 1',
    raiz: '√(1 + x) = (1 + x) elevado a 1/2',
  };
  const ALFAS5 = { 2: [2, 1], 3: [3, 1], '-1': [-1, 1], '-2': [-2, 1] };
  const tabla5 = (al, corte = 9, conFactor = true) => ({
    columnas: conFactor ? ['k', 'nuevo factor', 'coeficiente de xᵏ'] : ['k', 'coeficiente de xᵏ'], colorCol: conFactor ? [null, null, 'f'] : [null, 'f'],
    filas: Array.from({ length: 6 }, (_, k) => {
      const c = coefA(al, k), fac = k ? fr(al[0] - (k - 1) * al[1], al[1] * k) : null;
      const celdaC = { t: frTxt(c), color: c[0] === 0 ? null : 'f', fuerte: c[0] === 0, desde: k };
      return conFactor ? [String(k), k ? { t: frTxt(fac), desde: k, fuerte: fac[0] === 0 } : '—', celdaC] : [String(k), celdaC];
    }),
    pie: al[1] === 1 && al[0] >= 0 ? 'desde aquí, todos valen 0' : 'y sigue sin parar…',
    alt: `Coeficientes de ${potA(al)} para k de 0 a 5: ${Array.from({ length: 6 }, (_, k) => frTxt(coefA(al, k))).join(', ')}`,
  });
  const lectura5 = v => {
    const al = ALFAS5[v.al];
    if (al[0] >= 0) return [`α = ${al[0]}, k = ${al[0] + 1}: (${al[0]} − ${al[0] + 1} + 1)/${al[0] + 1} = 0 → `, BU(`${al[0] + 1} términos`)];
    return [`α = ${alTxt(al)}: ningún factor llega a 0, y `, BU('no termina')];
  };

  // Ahora tú 1 (tipo 0): el coeficiente de x² en (1 + x) elevado a α.
  const ALFAS = [[1, 2], [-1, 2], [1, 3], [-2, 1], [-3, 1], [3, 2], [-1, 3], [2, 3]];
  function casoX2(r) {
    const al = r.uno(ALFAS), c = coefA(al, 2), sinF = frMul(al, fr(al[0] - al[1], al[1])), cuad = frMul(fr(al[0] * al[0], al[1] * al[1]), [1, 2]);
    return {
      pregunta: [`¿Cuál es el coeficiente de x² en el desarrollo de ${potA(al)}?`],
      datos: [DA.coef, DD.fact],
      opciones: ops([
        { id: 'c', texto: frTxt(c), correcta: true },
        { id: 'fac', texto: frTxt(sinF), error: 'FAC', siFuera: `α(α − 1) = ${frTxt(sinF)} está bien calculado, pero falta dividir entre 2! = 2.` },
        { id: 'gen', texto: '0', error: 'GEN', siFuera: `Con α natural el desarrollo se cortaría, pero ${alTxt(al)} no es natural, así que ningún factor da 0.` },
        { id: 'sig', texto: frTxt(fr(-c[0], c[1])), error: 'SIG', siFuera: `El valor está bien, pero α − 1 = ${frTxt(fr(al[0] - al[1], al[1]))} trae su signo, y eso cambia el del resultado.` },
        { id: 'al2', texto: frTxt(cuad), error: 'TAL-BN-ALFA2', siFuera: `Dividir entre 2 está bien, pero el segundo factor es α − 1, no α otra vez.` },
      ]),
      solucion: { texto: `Con k = 2, el coeficiente es α(α − 1)/2!, y aquí α = ${alTxt(al)}.`, ecuacion: [{ frac: [`(${alTxt(al)})(${frTxt(fr(al[0] - al[1], al[1]))})`, '2'] }, ' = ', BU(frTxt(c))] },
    };
  }
  // Ahora tú 2 (tipo 1): el coeficiente de x³.
  function casoX3(r) {
    const al = r.uno(ALFAS), c = coefA(al, 3), prod = frMul(c, [6, 1]), tres = frMul(prod, [1, 3]);
    return {
      pregunta: [`¿Cuál es el coeficiente de x³ en el desarrollo de ${potA(al)}?`],
      datos: [DA.coef, DD.fact],
      opciones: ops([
        { id: 'c', texto: frTxt(c), correcta: true },
        { id: 'fac', texto: frTxt(prod), error: 'FAC', siFuera: `El producto de los tres factores está bien, pero falta dividir entre 3! = 6.` },
        { id: 'tres', texto: frTxt(tres), error: 'FAC', siFuera: `Dividir es el paso que toca, pero entre 3! = 3 · 2 · 1 = 6, no entre 3.` },
        { id: 'sig', texto: frTxt(fr(-c[0], c[1])), error: 'SIG', siFuera: 'El valor está bien, pero hay que contar los factores negativos, porque ellos deciden el signo.' },
        { id: 'gen', texto: '0', error: 'GEN', siFuera: `Con α natural el desarrollo se cortaría, pero ${alTxt(al)} no es natural, y ningún factor da 0.` },
      ]),
      solucion: { texto: 'El coeficiente de x³ es α(α − 1)(α − 2)/3!: tres factores que bajan de 1 en 1, entre 3!.', ecuacion: [{ frac: [[0, 1, 2].map(i => `(${frTxt(fr(al[0] - i * al[1], al[1]))})`).join(''), '6'] }, ' = ', BU(frTxt(c))] },
    };
  }
  // Ahora tú 3 (tipo 2): ¿cuántos términos? (termina o no).
  function casoTermina(r) {
    const nat = r() < 0.5, al = nat ? [r.ent(3, 7), 1] : r.uno(ALFAS);
    if (!nat && al[1] === 1 && al[0] < 0 && r() < 0.5) return null;
    const NT = 'No termina';
    const base = al[1] === 1 ? Math.abs(al[0]) : Math.floor(Math.abs(al[0] / al[1]));
    return {
      pregunta: [`¿Cuántos términos tiene el desarrollo de ${potA(al)}?`],
      datos: [DA.natural, DA.coef],
      opciones: ops(nat ? [
        { id: 'c', texto: f(al[0] + 1, 0), correcta: true },
        { id: 'n', texto: f(al[0], 0), error: 'TAL-BN-N', siFuera: `Es cierto que termina, pero k va de 0 a ${al[0]}, y eso da ${al[0]} + 1 términos.` },
        { id: 'no', texto: NT, error: 'TAL-BN-FINITO', siFuera: `Mirar los factores es el camino, pero ${al[0]} es natural, y el factor ${al[0]} − ${al[0]} = 0 corta el desarrollo.` },
        { id: 'n2', texto: f(al[0] + 2, 0), error: 'TAL-BN-N2', siFuera: `Es cierto que termina, pero de k = 0 a k = ${al[0]} hay ${al[0]} + 1 valores, no ${al[0]} + 2.` },
      ] : [
        { id: 'c', texto: NT, correcta: true },
        { id: 'gen', texto: f(base + 1, 0), error: 'GEN', siFuera: `Contar α + 1 términos sirve cuando α es natural, pero ${alTxt(al)} no lo es, y el desarrollo no se corta.` },
        { id: 'gen2', texto: f(base + 2, 0), error: 'GEN', siFuera: `Buscar dónde se corta es la idea, pero si α no es natural, ningún factor llega a 0.` },
        { id: 'uno', texto: '2', error: 'TAL-BN-DOS-TERM', siFuera: 'Es cierto que empieza con 1 + αx, pero después siguen x², x³ y más términos, sin parar.' },
        { id: 'fin', texto: '3', error: 'TAL-BN-FINITO', siFuera: 'Los primeros términos están bien, pero el coeficiente de x³ tampoco es 0, así que el desarrollo no se corta ahí.' },
      ]),
      solucion: nat
        ? { texto: `α = ${al[0]} es natural, y el factor ${al[0]} − ${al[0]} = 0 anula todos los términos desde x${sup(al[0] + 1)}.`, ecuacion: [`${al[0]} + 1 = `, BU(f(al[0] + 1, 0))] }
        : { texto: `α = ${alTxt(al)} no es natural, así que los factores nunca llegan a 0 y el desarrollo no termina.`, ecuacion: [BU(NT)] },
    };
  }
  // Ahora tú 4 (tipo 3, examen): aproximar con los tres primeros términos.
  function casoAprox(r) {
    const al = r.uno([[1, 2], [-1, 2], [-1, 1]]), m = r.uno([2, 4, 6, 10]), x = fr(m, 100);
    const t1 = frMul(al, x), t2 = frMul(coefA(al, 2), frMul(x, x));
    const bien = frSum(frSum([1, 1], t1), t2), dos = frSum([1, 1], t1), sig = frSum(dos, fr(-t2[0], t2[1])), fac = frSum(dos, frMul(t2, [2, 1]));
    const base = al[1] === 2 ? (al[0] > 0 ? `√${decimal(frSum([1, 1], x))}` : `1/√${decimal(frSum([1, 1], x))}`) : `1/${decimal(frSum([1, 1], x))}`;
    return {
      pregunta: [`Con los tres primeros términos de ${potA(al)}, ¿cuánto da ${base}, aproximado?`],
      datos: [DA.coef, `${base} = ${potA(al, `(1 + ${decimal(x)})`)}`, DA.vale],
      opciones: ops([
        { id: 'c', texto: decimal(bien), correcta: true },
        { id: 'dos', texto: decimal(dos), error: 'TAL-BN-DOS-TERM', siFuera: '1 + αx está bien, pero piden tres términos, y falta el de x².' },
        { id: 'sig', texto: decimal(sig), error: 'SIG', siFuera: `Los dos primeros términos están bien, pero el de x² lleva el coeficiente ${frTxt(coefA(al, 2))}, con su signo.` },
        { id: 'fac', texto: decimal(fac), error: 'FAC', siFuera: 'α(α − 1) está bien, pero el coeficiente de x² todavía se divide entre 2!.' },
      ]),
      solucion: { texto: `Aquí x = ${decimal(x)}, y los tres primeros términos son 1 + αx + α(α − 1)x²/2.`, ecuacion: [`1 ${t1[0] < 0 ? '−' : '+'} ${decimal(fr(Math.abs(t1[0]), t1[1]))} ${t2[0] < 0 ? '−' : '+'} ${decimal(fr(Math.abs(t2[0]), t2[1]))} = `, BU(decimal(bien))] },
    };
  }

  // Ejemplos de la idea 5. Cuentas rehechas aparte con fracciones (cuentas-ejemplos.py). Letras de nivel 3: B, E, D, A, C.
  const EJEMPLOS_ALFA = [
    { nivel: 1, titulo: 'La fórmula con α natural',
      enunciado: ['Con la fórmula α(α − 1)/2!, ¿cuál es el coeficiente de x² en (1 + x)⁴?'],
      datos: [DA.coef, DD.fact],
      solucion: [{ texto: 'Aquí α = 4, y la fórmula da 4 · 3 entre 2.', ecuacion: [{ frac: ['4 · 3', '2'] }, ' = ', BU('6')] }, { texto: 'El resultado es C(4, 2) = 6: con α natural, la fórmula es la del combinatorio de siempre.' }],
      respuesta: [BU('6')] },
    { nivel: 1, titulo: 'El segundo término',
      enunciado: ['¿Cuál es el segundo término del desarrollo de (1 + x) elevado a 1/3?'],
      datos: [DA.coef],
      solucion: [{ texto: 'El segundo término es el de k = 1, y su coeficiente es α = 1/3.', ecuacion: [{ frac: ['1', '3'] }, 'x'] }],
      respuesta: [BU('x/3')] },
    { nivel: 1, titulo: 'Con α = −1',
      enunciado: ['¿Cuál es el coeficiente de x² en el desarrollo de (1 + x)⁻¹?'],
      datos: [DA.coef, DD.fact],
      solucion: [{ texto: 'Aquí α = −1, así que α − 1 = −2.', ecuacion: [{ frac: ['(−1)(−2)', '2'] }, ' = ', BU('1')] }],
      respuesta: [BU('1')] },
    { nivel: 1, titulo: '¿Cuál termina?',
      enunciado: ['¿Cuál de estos desarrollos termina: (1 + x)⁻², (1 + x) elevado a 1/2 o (1 + x)⁵?'],
      datos: [DA.natural, '1/2 y −2 no son números naturales'],
      solucion: [{ texto: 'Solo α = 5 es natural: el factor 5 − 5 = 0 corta el desarrollo después de x⁵.' }],
      respuesta: [BU('(1 + x)⁵')] },
    { nivel: 1, titulo: 'Los primeros de 1/(1 + x)',
      enunciado: ['1/(1 + x) es (1 + x)⁻¹. ¿Cuáles son sus cuatro primeros términos?'],
      datos: [DA.coef, DD.fact],
      solucion: [
        { texto: 'Cada coeficiente es el anterior por (α − k + 1)/k, y con α = −1 ese factor vale −1/1, −2/2, −3/3: siempre −1.' },
        { texto: 'Empezando en 1 y multiplicando por −1 cada vez, los coeficientes son 1, −1, 1, −1.', ecuacion: [BU('1 − x + x² − x³')] },
      ],
      respuesta: [BU('1 − x + x² − x³')] },
    { nivel: 2, titulo: 'Coeficiente con α = −1/2',
      enunciado: ['¿Cuál es el coeficiente de x² en el desarrollo de (1 + x) elevado a −1/2?'],
      datos: [DA.coef, DD.fact],
      solucion: [
        { texto: 'Aquí α = −1/2, así que α − 1 = −3/2.', ecuacion: [{ frac: ['(−1/2)(−3/2)', '2'] }, ' = ', { frac: ['3/4', '2'] }, ' = ', BU('3/8')] },
      ],
      respuesta: [BU('3/8')] },
    { nivel: 2, titulo: 'x³ con α = −2',
      enunciado: ['¿Cuál es el coeficiente de x³ en el desarrollo de (1 + x)⁻²?'],
      datos: [DA.coef, DD.fact],
      solucion: [
        { texto: 'Para x³ van tres factores que bajan de 1 en 1 desde α: −2, −3 y −4.', ecuacion: [{ frac: ['(−2)(−3)(−4)', '3!'] }, ' = ', { frac: ['−24', '6'] }, ' = ', BU('−4')] },
      ],
      respuesta: [BU('−4')] },
    { nivel: 2, titulo: 'Con 2x adentro',
      enunciado: ['¿Cuál es el coeficiente de x² en el desarrollo de (1 + 2x) elevado a 1/2?'],
      datos: [DA.coef, DD.fact, DT.potProd],
      solucion: [
        { texto: 'Con α = 1/2, el término de k = 2 es α(α − 1)/2 multiplicado por (2x)².', ecuacion: [{ frac: ['(1/2)(−1/2)', '2'] }, ' = −1/8'] },
        { texto: 'Como (2x)² = 4x², el coeficiente de x² se multiplica por 4.', ecuacion: ['−1/8 · 4 = ', BU('−1/2')] },
      ],
      respuesta: [BU('−1/2')] },
    { nivel: 2, titulo: 'Aproximar √1,1',
      enunciado: ['Con los tres primeros términos de (1 + x) elevado a 1/2, aproxima √1,1.'],
      datos: [DA.coef, DA.raiz, DA.vale],
      solucion: [
        { texto: 'Aquí x = 0,1, y los tres primeros coeficientes son 1, 1/2 y −1/8.' },
        { texto: 'El segundo término es 0,1/2 = 0,05, y el tercero, 0,01/8 = 0,00125, se resta.', ecuacion: ['1 + 0,05 − 0,00125 = ', BU('1,04875')] },
      ],
      respuesta: [BU('√1,1 ≈ 1,04875')] },
    { nivel: 2, titulo: '¿Sirve con x = 3?',
      enunciado: ['¿Sirve la suma de (1 + x) elevado a 1/2 para calcular √4, con x = 3?'],
      datos: [DA.vale],
      solucion: [{ texto: 'La suma sirve solo si x está entre −1 y 1, y x = 3 está afuera: los términos crecen en vez de achicarse.' }],
      respuesta: [BU('No sirve')] },
    { nivel: 3, titulo: 'Coeficiente con α = 1/3',
      enunciado: ['¿Cuál es el coeficiente de x² en el desarrollo de (1 + x) elevado a 1/3?'],
      alternativas: ['−2/9', '−1/9', '1/9', '0', '1/18'],
      datos: [DA.coef, DD.fact],
      solucion: [
        { texto: 'Aquí α = 1/3, así que α − 1 = −2/3.', ecuacion: [{ frac: ['(1/3)(−2/3)', '2'] }, ' = ', { frac: ['−2/9', '2'] }, ' = ', BU('−1/9')] },
        { texto: ['La ', letra('A'), ' no divide entre 2!. La ', letra('C'), ' pierde el signo. La ', letra('D'), ' corta como si α fuera natural. La ', letra('E'), ' usa α · α en vez de α(α − 1).'] },
      ],
      respuesta: [letra('B'), ', ', BU('−1/9')] },
    { nivel: 3, titulo: 'Coeficiente de x³',
      enunciado: ['¿Cuál es el coeficiente de x³ en el desarrollo de (1 + x) elevado a 1/2?'],
      alternativas: ['3/8', '1/48', '−1/16', '0', '1/16'],
      datos: [DA.coef, DD.fact],
      solucion: [
        { texto: 'Los tres factores que bajan desde α son 1/2, −1/2 y −3/2.', ecuacion: [{ frac: ['(1/2)(−1/2)(−3/2)', '6'] }, ' = ', { frac: ['3/8', '6'] }, ' = ', BU('1/16')] },
        { texto: ['La ', letra('A'), ' no divide entre 3!. La ', letra('B'), ' repite −1/2 en vez de bajar a −3/2.'] },
        { texto: ['La ', letra('C'), ' pierde el signo. La ', letra('D'), ' corta como si α fuera natural.'] },
      ],
      respuesta: [letra('E'), ', ', BU('1/16')] },
    { nivel: 3, titulo: 'Una raíz aproximada',
      enunciado: ['Con los tres primeros términos de (1 + x) elevado a 1/2, ¿cuánto da √1,04, aproximado?'],
      alternativas: ['1,02', '1,0202', '1,0196', '1,0198', '1,04'],
      datos: [DA.coef, DA.raiz, DA.vale],
      solucion: [
        { texto: 'Con x = 0,04, los tres términos son 1 + x/2 − x²/8.', ecuacion: ['1 + 0,02 − 0,0002 = ', BU('1,0198')] },
        { texto: ['La ', letra('A'), ' usa dos términos. La ', letra('B'), ' suma el tercer término en vez de restarlo. La ', letra('C'), ' no divide entre 2!: resta 0,0004. La ', letra('E'), ' no saca la raíz.'] },
      ],
      respuesta: [letra('D'), ', ', BU('1,0198')] },
    { nivel: 3, titulo: 'Una fracción que es natural',
      enunciado: ['¿Cuántos términos tiene el desarrollo de (1 + x) elevado a 6/2?'],
      alternativas: ['4', 'No termina', '3', '7', '6'],
      datos: [DA.natural, DA.coef],
      solucion: [
        { texto: '6/2 = 3, que es natural: el desarrollo es (1 + x)³.', ecuacion: ['3 + 1 = ', BU('4')] },
        { texto: ['La ', letra('B'), ' ve una fracción y no la simplifica. La ', letra('C'), ' da α y no α + 1. La ', letra('D'), ' usa 6 + 1. La ', letra('E'), ' toma el numerador.'] },
      ],
      respuesta: [letra('A'), ', ', BU('4 términos')] },
    { nivel: 3, titulo: 'Con −x adentro',
      enunciado: ['¿Cuál es el coeficiente de x² en el desarrollo de (1 − x)⁻¹?'],
      alternativas: ['−1', '−2', '1', '2', '0'],
      datos: [DA.coef, DD.fact, DT.signo],
      solucion: [
        { texto: 'Con α = −1, el término de x² es α(α − 1)/2 multiplicado por (−x)².', ecuacion: [{ frac: ['(−1)(−2)', '2'] }, ' · (−x)² = 1 · x²'] },
        { texto: 'Como (−x)² = x², el coeficiente de x² es', ecuacion: [BU('1')] },
        { texto: ['La ', letra('A'), ' cree que (−x)² es negativo. La ', letra('B'), ' multiplica (−1) · 2. La ', letra('D'), ' no divide entre 2!. La ', letra('E'), ' corta como si α fuera natural.'] },
      ],
      respuesta: [letra('C'), ', ', BU('1')] },
  ];

  const serie = {
    id: 'exponente-no-natural',
    titulo: 'Exponente que no es natural',
    pregunta: '¿Qué pasa con el desarrollo si el exponente no es natural?',
    temas: ['Binomio con exponente no natural'],
    pieza: 'alg-tabla',
    aprendizaje: 'Con α no natural, (1 + x) elevado a α no termina; el coeficiente de xᵏ es α(α − 1)…(α − k + 1)/k!.',
    actividad: 'Elegir el exponente y mirar si algún coeficiente se vuelve 0.',
    // Lee: la calculadora, la cuenta del combinatorio con α, el nuevo factor y qué mirar. No dice cuántos términos tiene
    // (1 + x) elevado a 1/2 (la predicción) ni qué α da 4 términos (la misión).
    lee: {
      tarjetas: [
        { titulo: 'La calculadora', texto: 'La calculadora da √1,02 ≈ 1,0099505. La cuenta 1 + 0,02/2 = 1,01, que no usa ninguna raíz, ya se acerca mucho, y sale del binomio con otro exponente.',
          pieza: 'arit-calculadora', dibujo: { pieza: 'arit-calculadora', datos: { casillas: 8, calcs: [{ cuenta: '√1,02', pantalla: '1,0099505', color: false, rotulo: 'la raíz' }, { cuenta: '1 + 0,02 ÷ 2', pantalla: '1,01', color: false, rotulo: 'sin raíz' }] }, estado: {} } },
        { titulo: 'La cuenta del combinatorio', texto: 'C(4, 2) = (4 · 3)/(2 · 1): arriba van factores que bajan de 1 en 1 desde el 4, y abajo, 2!. La misma cuenta sirve con cualquier número en lugar del 4, y a ese número se le llama α (alfa).' },
        { titulo: 'Factor por factor', texto: 'Cada coeficiente de (1 + x) elevado a α sale del anterior, multiplicado por un factor nuevo: (α − k + 1)/k. Si ese factor vale 0, todos los coeficientes que siguen también valen 0.' },
        { titulo: 'Qué mirar al jugar', texto: 'Elige el exponente α y mira la columna del factor nuevo: ¿llega a 0 o no?' },
      ],
    },
    ejemplos: EJEMPLOS_ALFA,
    juega: {
      pieza: 'alg-tabla',
      consigna: 'En el cuaderno de Rubén están los coeficientes de (1 + x) elevado a α. Cada uno es el anterior multiplicado por un factor nuevo.',
      mision: {
        texto: 'Elige el α con el que el desarrollo tiene justo 4 términos.',
        logrado: v => v.al === '3',
        bien: 'Listo: con α = 3, en k = 4 el factor (3 − 4 + 1)/4 vale 0.',
      },
      voz: 'Mira si el factor nuevo llega a 0.',
      leyenda: [
        { s: 'α', t: 'el exponente (alfa)' },
        { s: 'k', t: 'la potencia de x: xᵏ' },
        { s: 'nuevo factor', t: '(α − k + 1)/k' },
      ],
      controles: [{ id: 'al', etiqueta: 'α', opciones: [{ valor: '2', texto: '2' }, { valor: '3', texto: '3' }, { valor: '-1', texto: '−1' }, { valor: '-2', texto: '−2' }] }],
      dibujo: v => ({ datos: tabla5(ALFAS5[v.al]), estado: { corte: 9 } }),
      lectura: v => lectura5(v),
      minimo: 3,
    },
    predice: {
      pregunta: '(1 + x)³ tiene 4 términos. ¿Cuántos términos tiene el desarrollo de (1 + x) elevado a 1/2?',
      datos: ['1/2 no es un número natural', DA.raiz],
      voz: 'Piensa en el factor nuevo con α = 1/2: ¿llega a 0?',
      opciones: [
        { id: 'c', texto: 'No termina', correcta: true },
        { id: 'gen', texto: '1,5', error: 'GEN', siFuera: 'Contar α + 1 términos sirve cuando α es natural, pero 1/2 no lo es, y entonces el desarrollo no se corta.' },
        { id: 'dos', texto: '2', error: 'GEN', siFuera: 'Es cierto que empieza con 1 + x/2, pero el factor nuevo nunca vale 0, así que después siguen más términos.' },
        { id: 'tres', texto: '3', error: 'TAL-BN-FINITO', siFuera: 'Pensar en menos términos que (1 + x)³ tiene sentido, pero el coeficiente de x³ no es 0, ni tampoco los que siguen.' },
      ],
      dibujo: TB({ columnas: ['k', 'coeficiente de xᵏ'], filas: [0, 1, 2, 3, 4].map(k => [String(k), '?']), pie: '¿se corta en algún momento?', alt: 'Los coeficientes de (1 + x) elevado a 1/2, por hallar' }),
      revelar: { pieza: 'alg-tabla', datos: tabla5([1, 2]), estado: { corte: 9 } },
      coincide: 'Coincide: los factores 1/2, −1/4, −1/2, −5/8… nunca valen 0, así que el desarrollo no termina.',
      noCoincide: 'Revisemos: con α = 1/2, α − k + 1 baja de 1 en 1 desde 1/2 y salta el 0.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: tabla5([1, 2]),
      voz: 'Con α no natural ningún factor da 0.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Con k = 1, el coeficiente es el mismo α.', ecuacion: ['1 · ', { frac: ['1', '2'] }, ' = ', BU('1/2')] },
        { estado: { corte: 2 }, texto: 'Con k = 2, el coeficiente anterior se multiplica por el factor (α − 1)/2.', ecuacion: [{ frac: ['1', '2'] }, ' · ', { frac: ['−1/2', '2'] }, ' = ', BU('−1/8')] },
        { estado: { corte: 3 }, texto: 'Con k = 3, se multiplica por el factor (α − 2)/3.', ecuacion: [{ frac: ['−1', '8'] }, ' · ', { frac: ['−3/2', '3'] }, ' = ', BU('1/16')] },
        { estado: { corte: 5 }, texto: 'α − k + 1 vale 1/2, −1/2, −3/2, y así: salta el 0, y ningún factor se anula.' },
        { estado: { corte: 5 }, texto: 'El desarrollo no termina, pero sirve para aproximar cuando x está entre −1 y 1.', ecuacion: ['√1,02 ≈ 1 + 0,01 − 0,00005 = 1,00995'] },
      ],
    },
    regla: {
      texto: 'Con α no natural, (1 + x) elevado a α es un desarrollo infinito, porque ningún factor se anula. El coeficiente de xᵏ se arma como un combinatorio: k factores que bajan desde α, entre k!.',
      ecuacion: [{ llave: [{ frac: ['α(α − 1)…(α − k + 1)', 'k!'] }], nota: 'coeficiente de xᵏ' }],
      condicion: 'x está entre −1 y 1, para que la suma se acerque al valor exacto. Con α natural, en k = α + 1 el factor (α − k + 1)/k vale 0 y corta el desarrollo.',
      voz: 'La misma cuenta del combinatorio, con α arriba.',
    },
    // Así se resuelve: el coeficiente de x² en (1 + cx)^α. «Ahora tú» pide el de x² y el de x³ en (1 + x) elevado a α, cuántos
    // términos tiene y una aproximación con tres términos.
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        const al = r.uno([[1, 2], [-1, 2], [-1, 1], [1, 3]]), c = r.uno([2, 3, -2]), c2 = coefA(al, 2), v = frMul(c2, [c * c, 1]);
        return {
          enunciado: [`¿Cuál es el coeficiente de x² en el desarrollo de ${potA(al, `(1 ${c < 0 ? '−' : '+'} ${Math.abs(c)}x)`)}?`],
          datos: [DA.coef, DD.fact, DT.potProd],
          pasos: [
            { tipo: 'pide', texto: `Piden el número que acompaña a x², con α = ${alTxt(al)}.` },
            { tipo: 'datos', texto: `Aquí el segundo término es ${f(c, 0)}x y no x, así que en cada término entra entero, elevado a k.` },
            { tipo: 'regla', texto: 'El término de k = 2 es α(α − 1)/2! multiplicado por el segundo término al cuadrado.' },
            { tipo: 'cuentas', texto: `α(α − 1)/2 = ${frTxt(c2)}, y (${f(c, 0)}x)² = ${c * c}x².`, ecuacion: [`${frTxt(c2)} · ${c * c} = `, BU(frTxt(v))] },
            { tipo: 'sentido', texto: `Como (${f(c, 0)}x)² es positivo, el signo del resultado lo pone solo α(α − 1).` },
          ],
          respuesta: [BU(frTxt(v))],
        };
      },
    },
    ahoraTu: {
      voz: 'Factores que bajan de 1 en 1, entre k!.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoX2, r);
        if (tipo === 1) return conCuatro(casoX3, r);
        if (tipo === 2) return conCuatro(casoTermina, r);
        return conCuatro(casoAprox, r);
      },
    },
  };

  // ---------- Idea 6: la potencia de un trinomio ----------
  // Objeto: las cenefas de tres colores (Lee y juego, alg-cenefa): naranja a, turquesa b y verde c, cada loseta con su
  // letra (el verde va junto al naranja: la letra y el relleno más lleno los separan; propuesta §6).
  // Cambia: cuántas turquesas (q) y cuántas verdes (r), con 4 losetas. · Permanece: n = 4. · Progresa: cuántas cenefas
  // hay con p, q y r de cada color. · Se reserva: n = 6 (la predicción: a²b²c² en (a + b + c)⁶). · Debe verse: repartir
  // n paréntesis en tres grupos se cuenta con n!/(p! q! r!).
  // Errores: ORD no divide (documentado, Manitoba 2017, en otra forma) · FAC olvida un factorial (ídem) · TAL-BN-DOS-LETRAS
  // cuenta como en un binomio · TAL-BN-MITAD usa C(n, n/2) · TAL-BN-TERM-BIN cuenta n + 1 términos · TAL-BN-TERM-3N
  // cuenta 3n · TAL-BN-TRES pone 3ⁿ en cualquier trinomio · BLO, SIG, TAL-BN-ABS y TAL-BN-CERO como en las ideas 2 y 4.
  const multi = (n, p, q, r) => (p < 0 || q < 0 || r < 0 || p + q + r !== n ? 0 : Math.round(fact(n) / (fact(p) * fact(q) * fact(r))));
  const abc = (p, q, r, la = 'a', lb = 'b', lc = 'c') => [...(p ? [PA(pot(la, p))] : []), ...(q ? [SB(pot(lb, q))] : []), ...(r ? [TC(pot(lc, r))] : [])];
  const abcTxt = (p, q, r, la = 'a', lb = 'b', lc = 'c') => `${pot(la, p)}${pot(lb, q)}${pot(lc, r)}`;
  const DM = {
    multi: `En (a + b + c)ⁿ, p veces a, q veces b y r veces c llevan ${nb('n!/(p! q! r!)')}`,
    terminos: '(a + b + c)ⁿ tiene C(n + 2, 2) términos',
    eleccion: 'Cada término de (a + b + c)ⁿ sale de elegir a, b o c en cada paréntesis',
  };
  const N6 = 4;
  const figuraJuego6 = (q, r) => {
    const p = N6 - q - r;
    if (p < 0) return CE({ objeto: 'cenefas', patrones: [Array(N6).fill(0)], abajo: [[`Con ${N6} losetas no caben ${q + r}`, null, 700]] });
    const c = multi(N6, p, q, r);
    return CE({ objeto: 'cenefas', patrones: patrones(N6, q, r), lado: 26,
      abajo: [[cenefasTxt(c), 'f', 700], [`: ${coefTxt(c)}`, null, 700], ...(p ? [[pot('a', p), 'o', 700]] : []), ...(q ? [[pot('b', q), 'i', 700]] : []), ...(r ? [[pot('c', r), 'd', 700]] : [])] });
  };
  const lectura6 = (q, r) => {
    const p = N6 - q - r;
    if (p < 0) return [`${q} + ${r} es más que ${N6} losetas: `, BU('0 cenefas')];
    const c = multi(N6, p, q, r), nom = (x, s1, s2) => `${x} ${x === 1 ? s1 : s2}`;
    return [`${nom(p, 'naranja', 'naranjas')}, ${nom(q, 'turquesa', 'turquesas')}, ${nom(r, 'verde', 'verdes')}: `, BU(cenefasTxt(c)), `, ${coefTxt(c)}`, ...abc(p, q, r)];
  };

  // Ahora tú 1 (tipo 0): el coeficiente de aᵖbᵠcʳ en (a + b + c)ⁿ.
  function casoMulti(r) {
    const n = r.ent(5, 7), p = r.ent(1, n - 2), q = r.ent(1, n - p - 1), s = n - p - q;
    if (s < 1 || (n === 6 && p === 2 && q === 2)) return null;
    const c = multi(n, p, q, s);
    return {
      pregunta: [`¿Cuál es el coeficiente de ${abcTxt(p, q, s)} en el desarrollo de (a + b + c)${sup(n)}?`],
      datos: [DM.eleccion, DM.multi, DD.fact],
      opciones: ops([
        { id: 'c', texto: f(c, 0), correcta: true },
        { id: 'ord', texto: f(fact(n), 0), error: 'ORD', siFuera: `${n}! cuenta los órdenes de ${n} cosas distintas, pero las a son iguales entre sí, y también las b y las c: hay que dividir.` },
        { id: 'fac', texto: f(fact(n) / (fact(p) * fact(q)), 0), error: 'FAC', siFuera: `Dividir entre ${p}! y ${q}! está bien, pero falta dividir también entre ${s}!, el de las c.` },
        { id: 'bin', texto: f(C(n, p), 0), error: 'TAL-BN-DOS-LETRAS', siFuera: `Elegir los ${p} paréntesis de a es el primer paso, pero después falta repartir los otros ${n - p} entre b y c.` },
      ]),
      solucion: { texto: `Se reparten los ${n} paréntesis: ${p} para a, ${q} para b y ${s} para c.`, ecuacion: [{ frac: [`${n}!`, `${p}! · ${q}! · ${s}!`] }, ' = ', BU(f(c, 0))] },
    };
  }
  // Ahora tú 2 (tipo 1): cuántos términos tiene (a + b + c)ⁿ.
  function casoTermTri(r) {
    const n = r.uno([3, 5, 6, 7, 9, 10]), t = C(n + 2, 2);   // sin 2, 4 ni 8: son de los ejemplos
    return {
      pregunta: [`¿Cuántos términos tiene el desarrollo de (x + y + z)${sup(n)}?`],
      datos: [DM.terminos, DD.combQue, DD.comb],
      opciones: ops([
        { id: 'c', texto: f(t, 0), correcta: true },
        { id: 'bin', texto: f(n + 1, 0), error: 'TAL-BN-TERM-BIN', siFuera: `n + 1 términos tiene un binomio, pero con tres letras hay más maneras de repartir el exponente ${n}.` },
        { id: 'tres', texto: f(3 * n, 0), error: 'TAL-BN-TERM-3N', siFuera: `Es cierto que hay tres letras, pero los términos son C(${n + 2}, 2), no 3 · ${n}.` },
        { id: 'pot', texto: f(3 ** n, 0), error: 'ORD', siFuera: `Hay 3 opciones en cada paréntesis, es cierto, pero los productos iguales se juntan en un solo término.` },
        { id: 'n2', texto: f(C(n + 1, 2), 0), error: 'TAL-BN-LUGAR', siFuera: `Usar un combinatorio está bien, pero el que cuenta los términos es C(n + 2, 2) = C(${n + 2}, 2).` },
      ]),
      solucion: { texto: `El número de términos es C(n + 2, 2), y aquí n = ${n}.`, ecuacion: [`C(${n + 2}, 2) = `, { frac: [`${n + 2} · ${n + 1}`, '2'] }, ' = ', BU(f(t, 0))] },
    };
  }
  // Ahora tú 3 (tipo 2): un coeficiente con un número en el trinomio: (x + m·y + z)ⁿ.
  function casoTriNum(r) {
    const n = r.ent(4, 6), m = r.uno([2, 3, -2]), p = r.ent(1, n - 2), q = r.ent(1, n - p - 1), s = n - p - q;
    if (s < 1) return null;
    const c = multi(n, p, q, s) * m ** q;
    return {
      pregunta: [`¿Cuál es el coeficiente de ${abcTxt(p, q, s, 'x', 'y', 'z')} en el desarrollo de (x ${m < 0 ? '−' : '+'} ${Math.abs(m)}y + z)${sup(n)}?`],
      datos: [DM.multi, DD.fact, DT.potProd],
      opciones: ops([
        { id: 'c', texto: f(c, 0), correcta: true },
        { id: 'blo', texto: f(multi(n, p, q, s), 0), error: 'BLO', siFuera: `n!/(p! q! r!) está bien, pero el ${f(m, 0)} de ${f(m, 0)}y también entra, elevado a ${q}.` },
        { id: 'una', texto: f(multi(n, p, q, s) * m, 0), error: 'BLO', siFuera: `Es cierto que el ${f(m, 0)} entra, pero y se elige ${q} veces, así que va elevado a ${q} y no una sola vez.` },
        { id: 'sig', texto: m < 0 ? f(-c, 0) : null, error: 'SIG', siFuera: `El valor está bien, pero (${f(m, 0)})${sup(q)} tiene exponente ${q % 2 ? 'impar' : 'par'}, y eso decide el signo.` },
        { id: 'ord', texto: f(fact(n) * m ** q, 0), error: 'ORD', siFuera: `${f(m, 0)}${sup(q)} está bien, pero ${n}! cuenta en orden, y hay que dividir entre ${p}! ${q}! ${s}!.` },
      ]),
      solucion: { texto: `Hay ${f(multi(n, p, q, s), 0)} maneras de repartir los paréntesis, y cada una trae (${f(m, 0)}y)${sup(q)}.`, ecuacion: [`${f(multi(n, p, q, s), 0)} · ${par(m)}${sup(q)} = `, BU(f(c, 0))] },
    };
  }
  // Ahora tú 4 (tipo 3, examen): la suma de coeficientes de un trinomio con números y signos.
  function casoSumaTri(r) {
    const n = r.ent(3, 6), [u, w, z] = r.uno([[2, -1, 1], [3, -1, -1], [1, 2, -2], [2, 2, -1], [1, -3, 1]]), b = u + w + z, s = b ** n;
    if (b === 3) return null;
    const tri = `(${u === 1 ? '' : u}x ${w < 0 ? '−' : '+'} ${Math.abs(w) === 1 ? '' : Math.abs(w)}y ${z < 0 ? '−' : '+'} ${Math.abs(z)})`;
    return {
      pregunta: [`¿Cuánto suman los coeficientes del desarrollo de ${tri}${sup(n)}?`],
      datos: [DS.suma],
      opciones: ops([
        { id: 'c', texto: f(s, 0), correcta: true },
        { id: 'tres', texto: f(3 ** n, 0), error: 'TAL-BN-TRES', siFuera: `Es cierto que los coeficientes de (a + b + c)${sup(n)} suman 3${sup(n)}, pero aquí cada término trae su número.` },
        { id: 'abs', texto: f((Math.abs(u) + Math.abs(w) + Math.abs(z)) ** n, 0), error: 'TAL-BN-ABS', siFuera: 'Poner las letras en 1 es el camino, pero los números van con su signo.' },
        { id: 'cero', texto: f(z ** n, 0), error: 'TAL-BN-CERO', siFuera: `Reemplazar las letras por un número es la idea, pero con x = y = 0 queda solo el término sin letras; la suma pide 1.` },
      ]),
      solucion: { texto: `Con x = 1 e y = 1, el trinomio vale ${u} ${w < 0 ? '−' : '+'} ${Math.abs(w)} ${z < 0 ? '−' : '+'} ${Math.abs(z)} = ${f(b, 0)}.`, ecuacion: [`${par(b)}${sup(n)} = `, BU(f(s, 0))] },
    };
  }

  // Ejemplos de la idea 6. Cuentas rehechas aparte (cuentas-ejemplos.py). Letras de nivel 3: C, A, E, B, D.
  const EJEMPLOS_TRI = [
    { nivel: 1, titulo: 'Una de cada color',
      enunciado: ['¿Cuántas cenefas de 3 losetas tienen una naranja, una turquesa y una verde?'],
      datos: ['Dos cenefas son distintas si alguna posición cambia de color', DD.fact],
      figura: CE({ objeto: 'cenefas', patrones: [[0, 1, 2]], lado: 30, abajo: [['una de ellas; ¿cuántas hay?', null, 700]] }),
      solucion: [{ texto: 'La primera loseta puede ser de 3 colores; la segunda, de los 2 que quedan, y la tercera, del último.', ecuacion: ['3 · 2 · 1 = 3! = ', BU('6')] }],
      respuesta: [BU('6 cenefas')] },
    { nivel: 1, titulo: 'El coeficiente de abc',
      enunciado: ['¿Cuál es el coeficiente de abc en el desarrollo de (a + b + c)³?'],
      datos: [DM.multi, DD.fact],
      solucion: [{ texto: 'En abc cada letra sale una vez: p = q = r = 1.', ecuacion: [{ frac: ['3!', '1! · 1! · 1!'] }, ' = ', BU('6')] }],
      respuesta: [BU('6')] },
    { nivel: 1, titulo: 'El coeficiente de a²b',
      enunciado: ['¿Cuál es el coeficiente de a²b en el desarrollo de (a + b + c)³?'],
      datos: [DM.multi, DD.fact],
      solucion: [{ texto: 'En a²b, p = 2, q = 1 y r = 0, porque c no se elige.', ecuacion: [{ frac: ['3!', '2! · 1! · 0!'] }, ' = ', { frac: ['6', '2'] }, ' = ', BU('3')] }],
      respuesta: [BU('3')] },
    { nivel: 1, titulo: 'Términos de (a + b + c)²',
      enunciado: ['¿Cuántos términos tiene el desarrollo de (a + b + c)²?'],
      datos: [DM.terminos, DD.combQue, DD.comb],
      solucion: [{ texto: 'Con n = 2, la fórmula da C(4, 2).', ecuacion: ['C(4, 2) = 6'] }, { texto: 'Son estos seis: a², b², c², ab, ac y bc.' }],
      respuesta: [BU('6 términos')] },
    { nivel: 1, titulo: 'Sin la c',
      enunciado: ['¿Cuál es el coeficiente de a³b² en el desarrollo de (a + b + c)⁵?'],
      datos: [DM.multi, DD.fact],
      solucion: [{ texto: 'Aquí r = 0: c no se elige nunca, y la cuenta queda como la de un binomio.', ecuacion: [{ frac: ['5!', '3! · 2! · 0!'] }, ' = ', { frac: ['120', '12'] }, ' = ', BU('10')] }],
      respuesta: [BU('10')] },
    { nivel: 2, titulo: 'a²b²c en (a + b + c)⁵',
      enunciado: ['¿Cuál es el coeficiente de a²b²c en el desarrollo de (a + b + c)⁵?'],
      datos: [DM.multi, DD.fact],
      solucion: [{ texto: 'En a²b²c, p = 2, q = 2 y r = 1.', ecuacion: [{ frac: ['5!', '2! · 2! · 1!'] }, ' = ', { frac: ['120', '4'] }, ' = ', BU('30')] }],
      respuesta: [BU('30')] },
    { nivel: 2, titulo: 'Términos de (a + b + c)⁴',
      enunciado: ['¿Cuántos términos tiene el desarrollo de (a + b + c)⁴?'],
      datos: [DM.terminos, DD.combQue, DD.comb],
      solucion: [{ texto: 'Con n = 4, la fórmula da C(6, 2).', ecuacion: ['C(6, 2) = ', { frac: ['6 · 5', '2'] }, ' = ', BU('15')] }],
      respuesta: [BU('15 términos')] },
    { nivel: 2, titulo: 'Con un número',
      enunciado: ['¿Cuál es el coeficiente de x²y en el desarrollo de (x + y + 2)⁴?'],
      datos: [DM.multi, DD.fact],
      solucion: [
        { texto: 'x²y pide dos veces la letra x, una vez la letra y, y una vez el 2: p = 2, q = 1 y r = 1.', ecuacion: [{ frac: ['4!', '2! · 1! · 1!'] }, ' = 12'] },
        { texto: 'El 2, elegido una vez, multiplica ese número.', ecuacion: ['12 · 2 = ', BU('24')] },
      ],
      respuesta: [BU('24')] },
    { nivel: 2, titulo: 'Suma de coeficientes',
      enunciado: ['¿Cuánto suman los coeficientes del desarrollo de (x + y + z)⁴?'],
      datos: [DS.suma],
      solucion: [{ texto: 'Con las tres letras iguales a 1, el trinomio vale 3.', ecuacion: ['(1 + 1 + 1)⁴ = 3⁴ = ', BU('81')] }],
      respuesta: [BU('81')] },
    { nivel: 2, titulo: 'Repartir en dos pasos',
      enunciado: ['¿Cuál es el coeficiente de a³bc en el desarrollo de (a + b + c)⁵?'],
      datos: [DD.combQue, DD.comb, DM.eleccion],
      solucion: [
        { texto: 'Primero se eligen los 3 paréntesis de a: C(5, 3) = 10. De los 2 que quedan, se elige el de b: C(2, 1) = 2.' },
        { texto: 'El paréntesis de c queda dicho, y se multiplican las dos elecciones.', ecuacion: ['10 · 2 = ', BU('20')] },
      ],
      respuesta: [BU('20')] },
    { nivel: 3, titulo: 'Un coeficiente grande',
      enunciado: ['¿Cuál es el coeficiente de a³b²c en el desarrollo de (a + b + c)⁶?'],
      alternativas: ['720', '12', '60', '20', '15'],
      datos: [DM.multi, DD.fact],
      solucion: [
        { texto: 'En a³b²c, p = 3, q = 2 y r = 1, y 6! = 720.', ecuacion: [{ frac: ['720', '6 · 2 · 1'] }, ' = ', BU('60')] },
        { texto: ['La ', letra('A'), ' no divide. La ', letra('B'), ' da solo el denominador, 3! · 2! · 1! = 12. La ', letra('D'), ' solo elige las a: C(6, 3). La ', letra('E'), ' solo las b: C(6, 2).'] },
      ],
      respuesta: [letra('C'), ', ', BU('60')] },
    { nivel: 3, titulo: 'Términos del trinomio',
      enunciado: ['¿Cuántos términos tiene el desarrollo de (a + b + c)⁸?'],
      alternativas: ['45', '9', '24', '10', '6561'],
      datos: [DM.terminos, DD.combQue, DD.comb],
      solucion: [
        { texto: 'Con n = 8, la fórmula da C(10, 2).', ecuacion: ['C(10, 2) = ', { frac: ['10 · 9', '2'] }, ' = ', BU('45')] },
        { texto: ['La ', letra('B'), ' usa n + 1, como en un binomio. La ', letra('C'), ' multiplica 3 · 8. La ', letra('D'), ' usa n + 2. La ', letra('E'), ' cuenta 3⁸ productos sin juntar los iguales.'] },
      ],
      respuesta: [letra('A'), ', ', BU('45')] },
    { nivel: 3, titulo: 'Con un número negativo',
      enunciado: ['¿Cuál es el coeficiente de x²y² en el desarrollo de (x + y − 2)⁶?'],
      alternativas: ['90', '−360', '720', '180', '360'],
      datos: [DM.multi, DD.fact, DT.signo],
      solucion: [
        { texto: 'x²y² pide dos veces la letra x, dos veces la letra y, y dos veces el −2: p = q = r = 2.', ecuacion: [{ frac: ['720', '2 · 2 · 2'] }, ' = 90'] },
        { texto: 'El −2 entra elevado al cuadrado: (−2)² = 4.', ecuacion: ['90 · 4 = ', BU('360')] },
        { texto: ['La ', letra('A'), ' olvida el (−2)². La ', letra('B'), ' deja el signo. La ', letra('C'), ' eleva el 2 al cubo. La ', letra('D'), ' no lo eleva: 90 · 2.'] },
      ],
      respuesta: [letra('E'), ', ', BU('360')] },
    { nivel: 3, titulo: 'Suma con signos',
      enunciado: ['¿Cuánto suman los coeficientes del desarrollo de (2x − y + z)⁵?'],
      alternativas: ['−32', '32', '243', '1024', '0'],
      datos: [DS.suma],
      solucion: [
        { texto: 'Con las tres letras iguales a 1, el trinomio vale 2 − 1 + 1 = 2.', ecuacion: ['2⁵ = ', BU('32')] },
        { texto: ['La ', letra('A'), ' pone las letras en −1: (−2 + 1 − 1)⁵ = −32. La ', letra('C'), ' usa 3⁵, como en (a + b + c)⁵. La ', letra('D'), ' suma sin signos: 4⁵. La ', letra('E'), ' pone las letras en 0.'] },
      ],
      respuesta: [letra('B'), ', ', BU('32')] },
    { nivel: 3, titulo: 'Sin x en un trinomio',
      enunciado: ['¿Cuál es el término independiente del desarrollo de (x + 1/x + 1)⁴?'],
      alternativas: ['6', '12', '1', '19', '13'],
      datos: [DM.multi, DD.fact, DX.negativo, DX.cero],
      solucion: [
        { texto: 'Para que no quede x, x y 1/x salen las mismas veces, p cada una, y el 1 va en los demás paréntesis: p = 0, 1 o 2.' },
        { texto: 'Con p = 0 hay 1 manera; con p = 1, 4!/(1! 1! 2!) = 12, y con p = 2, 4!/(2! 2! 0!) = 6.', ecuacion: ['1 + 12 + 6 = ', BU('19')] },
        { texto: ['La ', letra('A'), ', la ', letra('B'), ' y la ', letra('C'), ' toman un solo caso. La ', letra('E'), ' olvida el de p = 2.'] },
      ],
      respuesta: [letra('D'), ', ', BU('19')] },
  ];

  const multinomio = {
    id: 'potencia-trinomio',
    titulo: 'La potencia de un trinomio',
    pregunta: '¿Cómo se desarrolla un trinomio elevado a n?',
    temas: ['Potencia de un polinomio'],
    pieza: 'alg-cenefa',
    aprendizaje: 'En (a + b + c)ⁿ, el término con p veces a, q veces b y r veces c lleva n!/(p! q! r!).',
    actividad: 'Armar cenefas de tres colores y contar las que tienen la misma cantidad de cada uno.',
    // Lee: tres colores, elegir entre tres en cada paréntesis, ordenar y repetir, qué mirar. No dice el coeficiente de
    // a²b²c² en (a + b + c)⁶ (la predicción) ni qué grupo tiene 12 cenefas (la misión).
    lee: {
      tarjetas: [
        { titulo: 'Tres colores', texto: 'Rubén agrega losetas verdes a sus cenefas. En (a + b + c)ⁿ, cada paréntesis tiene tres términos: la loseta naranja es elegir a, la turquesa es elegir b y la verde es elegir c.',
          pieza: 'alg-cenefa', dibujo: CE({ objeto: 'cenefas', patrones: [[0, 2, 1, 0], [2, 0, 0, 1]], lado: 32 }) },
        { titulo: 'El mismo término', texto: 'Las dos cenefas de arriba tienen 2 naranjas, 1 turquesa y 1 verde, así que las dos dan a²bc. El coeficiente de a²bc cuenta cuántas cenefas tienen esos colores.' },
        { titulo: 'Ordenar con repetidos', texto: 'n!, el factorial de n, cuenta las maneras de ordenar n losetas distintas. Pero si varias son del mismo color, cambiarlas de lugar entre sí no hace otra cenefa.' },
        { titulo: 'Qué mirar al jugar', texto: 'Elige cuántas turquesas y cuántas verdes van en 4 losetas; las demás son naranjas. Cuenta las cenefas que salen.' },
      ],
    },
    ejemplos: EJEMPLOS_TRI,
    juega: {
      pieza: 'alg-cenefa',
      consigna: 'Rubén arma cenefas de 4 losetas con tres colores. Las naranjas son las que quedan después de poner turquesas y verdes.',
      mision: {
        texto: 'Arma un grupo de exactamente 12 cenefas.',
        logrado: v => [v.q, v.r, N6 - v.q - v.r].sort().join() === '1,1,2',
        bien: 'Listo: con dos de un color y una de cada otro salen 12 cenefas.',
      },
      voz: 'Cambia los colores y cuenta las cenefas del grupo.',
      leyenda: [
        { s: PA('a'), t: 'loseta naranja: se eligió a' },
        { s: SB('b'), t: 'loseta turquesa: se eligió b' },
        { s: TC('c'), t: 'loseta verde: se eligió c' },
        { s: 'q, r', t: 'cuántas turquesas y cuántas verdes' },
      ],
      controles: [
        { id: 'q', etiqueta: 'q (turquesas)', color: 'c-i', min: 0, max: 4, paso: 1, inicio: 1, decimales: 0 },
        { id: 'r', etiqueta: 'r (verdes)', color: 'c-d', min: 0, max: 4, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => figuraJuego6(v.q, v.r),
      lectura: v => lectura6(v.q, v.r),
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuál es el coeficiente de a²b²c² en el desarrollo de (a + b + c)⁶?',
      datos: ['6! = 720', '2! = 2'],
      voz: 'Piensa en cenefas de 6 losetas: dos de cada color.',
      opciones: [
        { id: 'c', texto: '90', correcta: true },
        { id: 'ord', texto: '720', error: 'ORD', siFuera: '6! cuenta bien los órdenes de 6 losetas distintas, pero cambiar entre sí dos losetas del mismo color no hace otra cenefa.' },
        { id: 'bin', texto: '15', error: 'TAL-BN-DOS-LETRAS', siFuera: 'Elegir los 2 paréntesis de a es el primer paso, pero falta repartir los otros 4 entre b y c.' },
        { id: 'mitad', texto: '20', error: 'TAL-BN-MITAD', siFuera: 'Un combinatorio como C(6, 3) sirve para partir en dos grupos, pero aquí los paréntesis se reparten en tres.' },
      ],
      dibujo: CE({ objeto: 'cenefas', patrones: [[0, 0, 1, 1, 2, 2]], lado: 34, abajo: [['¿cuántas cenefas así?', null, 700]] }),
      revelar: CE({ objeto: 'grupos', filas: [
        { patron: [0, 0, 1, 1, 2, 2], rotulo: 'a en 2 de 6', cuenta: 'C(6, 2) = 15' },
        { patron: [0, 0, 1, 1, 2, 2], rotulo: 'b en 2 de 4', cuenta: 'C(4, 2) = 6' },
        { patron: [0, 0, 1, 1, 2, 2], rotulo: 'c, lo que queda', cuenta: '1' },
      ], abajo: [['15 · 6 · 1 = ', null, 700], ['90', 'f', 700]] }),
      coincide: 'Coincide: hay 15 maneras para las a y 6 para las b, y las c quedan dichas: 15 · 6 = 90 cenefas.',
      noCoincide: 'Revisemos: primero se eligen los paréntesis de a, después los de b entre los que quedan, y las c ocupan el resto.',
    },
    mira: {
      pieza: 'alg-cenefa',
      datos: { objeto: 'cenefas', patrones: [[0, 0, 1, 1, 2, 2]], lado: 34 },
      voz: 'Repartir en tres grupos: primero uno, después otro.',
      pasos: [
        { estado: {}, texto: 'Esta es una elección: a en dos paréntesis, b en otros dos y c en los dos últimos.', ecuacion: abc(2, 2, 2) },
        { estado: {}, texto: 'Primero se eligen los 2 paréntesis de a entre los 6.', ecuacion: ['C(6, 2) = 15'] },
        { estado: {}, texto: 'De los 4 que quedan se eligen los 2 de b, y los de c quedan dichos.', ecuacion: ['C(4, 2) = 6'] },
        { estado: {}, texto: 'Cada elección de a se combina con cada elección de b, así que se multiplican.', ecuacion: ['15 · 6 = ', BU('90')] },
        { estado: {}, texto: 'Da lo mismo que dividir 6! entre los órdenes de cada color, que son 2! por color.', ecuacion: [{ frac: ['6!', '2! · 2! · 2!'] }, ' = ', { frac: ['720', '8'] }, ' = 90'] },
      ],
    },
    regla: {
      texto: 'En (a + b + c)ⁿ, si un término lleva p veces a, q veces b y r veces c, su coeficiente multinomial es n! dividido entre el factorial de cada exponente.',
      ecuacion: [{ llave: [{ frac: ['n!', 'p! · q! · r!'] }], nota: 'coeficiente' }, { sup: [PA('a'), 'p'] }, { sup: [SB('b'), 'q'] }, { sup: [TC('c'), 'r'] }],
      condicion: 'p + q + r = n, porque cada paréntesis da una sola letra. El desarrollo tiene C(n + 2, 2) términos: las maneras de elegir 2 cosas entre n + 2.',
      dibujo: CE({ objeto: 'grupos', filas: [[2, 1, 1], [1, 2, 1], [1, 1, 2], [4, 0, 0]].map(([p, q, r]) => ({ patron: patrones(N6, q, r)[0], rotulo: abcTxt(p, q, r), cuenta: `× ${multi(N6, p, q, r)}` })),
        abajo: [['4!/(2! 1! 1!) = 12;  4!/4! = 1', 'f', 700]] }),
      voz: 'n! ordena todo; cada color repetido se divide.',
    },
    // Así se resuelve: un coeficiente de (x + y + m)ⁿ, con el número elevado. «Ahora tú» pide el de (a + b + c)ⁿ, cuántos
    // términos, el de (x + my + z)ⁿ y la suma de coeficientes con signos.
    resuelve: {
      pieza: 'alg-cenefa',
      generar(s) {
        const r = azar(s + 900);
        const n = r.ent(4, 5), m = r.uno([2, 3]), p = r.ent(1, n - 2), q = r.ent(1, n - p - 1), s2 = n - p - q, base = multi(n, p, q, s2), c = base * m ** s2;
        return {
          enunciado: [`¿Cuál es el coeficiente de ${abcTxt(p, q, 0, 'x', 'y')} en el desarrollo de (x + y + ${m})${sup(n)}?`],
          datos: [DM.multi, DD.fact],
          pasos: [
            { tipo: 'pide', texto: `Piden el número que acompaña a ${abcTxt(p, q, 0, 'x', 'y')} en el desarrollo.` },
            { tipo: 'datos', texto: `Los paréntesis que no dan x ni y dan el ${m}, y son ${n} − ${p} − ${q} = ${s2}.` },
            { tipo: 'regla', texto: `Se reparten los ${n} paréntesis en grupos de ${p}, ${q} y ${s2}, que se cuentan con n!/(p! q! r!). ${s2 === 1 ? `Además, el paréntesis del número trae un ${m}.` : `Además, cada uno de los ${s2} paréntesis del número trae un ${m}.`}` },
            { tipo: 'cuentas', texto: `${n}!/(${p}! ${q}! ${s2}!) = ${f(base, 0)}, y ${m}${sup(s2)} = ${m ** s2}.`, ecuacion: [`${f(base, 0)} · ${m ** s2} = `, BU(f(c, 0))] },
            { tipo: 'sentido', texto: `Los tres grupos, ${p} + ${q} + ${s2}, suman ${n}, que es el número de paréntesis.` },
          ],
          respuesta: [BU(f(c, 0))],
        };
      },
    },
    ahoraTu: {
      voz: 'Reparte los paréntesis en tres grupos.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoMulti, r);
        if (tipo === 1) return conCuatro(casoTermTri, r);
        if (tipo === 2) return conCuatro(casoTriNum, r);
        return conCuatro(casoSumaTri, r);
      },
    },
  };

  // ---------- Laboratorio (mesas sin misión) ----------
  // Mesa 1 (idea 1): el triángulo hasta la fila 8, con los pares o los múltiplos de 3 marcados (violeta: lo que se busca).
  // El caso que la idea 1 no muestra: el dibujo que forman (triángulos vacíos dentro del triángulo).
  const TABLA = () => Kit.piezas['alg-tabla'];
  const filaDe = (datos, y) => { const g = TABLA().geometria(datos); return (y - g.cy(0)) / (g.cy(1) - g.cy(0)); };
  const trianguloMarcado = (n, m) => ({
    triangular: true,
    filas: Array.from({ length: n + 1 }, (_, i) => fila(i).map(c => ({ t: f(c, 0), color: m > 1 && c % m === 0 ? 'f' : null, fuerte: i === n || (m > 1 && c % m === 0) }))),
    alt: `Triángulo de Pascal hasta la fila ${n}${m > 1 ? `, con los múltiplos de ${m} en violeta` : ''}`,
  });
  const mesaPascal = {
    id: 'pascal-colores', titulo: 'El triángulo hasta la fila 8', pieza: 'alg-tabla',
    consigna: 'Arrastra la última fila hacia abajo y marca los pares o los múltiplos de 3. Mira el dibujo que forman los marcados.',
    controles: [
      { id: 'n', etiqueta: 'n', min: 0, max: 8, paso: 1, inicio: 6, decimales: 0 },
      { id: 'm', etiqueta: 'Marcar', opciones: [{ valor: 1, texto: 'nada' }, { valor: 2, texto: 'pares' }, { valor: 3, texto: 'múltiplos de 3' }] },
    ],
    dibujo: v => ({ datos: trianguloMarcado(v.n, v.m), estado: {} }),
    lectura: v => { const fl = fila(v.n), r = v.m > 1 ? fl.filter(c => c % v.m === 0).length : 0; return [`Fila ${v.n}: suma ${2 ** v.n}`, v.m > 1 ? `; ${r} de ${fl.length} son múltiplos de ${v.m}` : '']; },
    arrastres: [{
      id: 'fila-n', etiqueta: 'última fila: bájala para agregar filas',
      donde: v => { const d = trianguloMarcado(v.n, v.m), g = TABLA().geometria(d); return { x: Math.min(306, g.cx(v.n, v.n) + g.paso * 0.75), y: g.cy(v.n) }; },
      mover: (pt, v) => ({ n: filaDe(trianguloMarcado(v.n, v.m), pt.y) }),
    }],
    invitaciones: [
      { texto: 'Con los pares marcados, busca una fila de más de dos números sin ningún par.',
        logrado: v => v.m === 2 && v.n > 1 && fila(v.n).every(c => c % 2 !== 0),
        bien: 'Las filas 3 y 7 solo tienen impares; vienen justo antes de 4 y 8.' },
      { texto: 'Busca la fila cuya suma es 128.',
        logrado: v => fila(v.n).reduce((x, y) => x + y, 0) === 128,
        bien: 'Cada fila suma el doble que la anterior: 2⁷ = 128.' },
      { texto: 'Con múltiplos de 3, haz que todos menos los extremos lo sean.',
        logrado: v => v.m === 3 && v.n > 1 && fila(v.n).slice(1, -1).every(c => c % 3 === 0),
        bien: 'En toda fila de número primo, como la 3, los del medio son sus múltiplos.' },
      { texto: 'Guarda dos filas seguidas.',
        logrado: (v, guardados) => guardados.some(g => Math.abs(g.n - v.n) === 1) && guardados.some(g => g.n === v.n && g.m === v.m),
        bien: 'Cada número de arriba entra en dos sumas de abajo: por eso la suma se duplica.' },
    ],
  };
  // Mesa 2 (idea 1, laboratorio 3D, 15 nov: exploración libre): el cubo de (a + b)³ abierto en ocho piezas, de la pieza
  // alg-cubo-3d (piezasCubo de plantillas/cuadrado-crece/motor.js, regla 1). Cada pieza eligió a o b en el ancho, el fondo
  // y el alto: las de k letras b son C(3, k).
  const CUBO3 = () => Kit.piezas['alg-cubo-3d'];
  const TIPOS3 = ['a3', 'a2b', 'ab2', 'b3'];
  const tiposCubo = v => CUBO3().cuenta(v).tipos;
  const nPiezas = (v, t) => tiposCubo(v)[t].n;
  const mesaCubo = {
    id: 'piezas-elegidas', titulo: 'Las piezas que se eligen', pieza: 'alg-cubo-3d',
    consigna: 'Abre el cubo de (a + b)³ y gíralo. Deja a la vista un solo tipo de pieza y cuéntalas.',
    controles: [
      { id: 'a', etiqueta: 'a', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      { id: 'b', etiqueta: 'b', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      { id: 'abrir', etiqueta: 'Abrir', min: 0, max: 1, paso: 0.25, inicio: 0.5, decimales: 2 },
      { id: 'solo', etiqueta: 'A la vista', opciones: [{ valor: 'todas', texto: 'Todas' }, { valor: 'a3', texto: 'a³' }, { valor: 'a2b', texto: 'a²b' },
        { valor: 'ab2', texto: 'ab²' }, { valor: 'b3', texto: 'b³' }] },
    ],
    dibujo: v => ({ datos: { a: v.a, b: v.b, abrir: v.abrir, solo: v.solo === 'todas' ? null : v.solo }, estado: {} }),
    lectura: v => {
      if (v.solo === 'todas') return ['Piezas: 1 + 3 + 3 + 1 = 8'];
      const t = tiposCubo(v)[v.solo], k = TIPOS3.indexOf(v.solo);
      return [{ v: CUBO3().COLOR[v.solo], t: `${t.n} ${t.n === 1 ? 'pieza' : 'piezas'} ${CUBO3().NOMBRE[v.solo]}` }, ` de volumen ${f(t.volumen)}; C(3, ${k}) = ${C(3, k)}`];
    },
    invitaciones: [
      { texto: 'Deja a la vista solo las piezas con dos letras b, con el cubo abierto.',
        logrado: v => v.solo === 'ab2' && v.abrir >= 0.5,
        bien: 'Son tres ab², una por cada par de lados con b: C(3, 2) = 3.',
        pista: 'Elige ab² en «A la vista» y gira para contar.' },
      { texto: 'Muestra el tipo de pieza que aparece una sola vez y es la más grande.',
        logrado: v => (v.solo === 'a3' && v.a > v.b) || (v.solo === 'b3' && v.b > v.a),
        bien: 'Solo hay una manera de elegir la misma letra en los tres lados.',
        pista: 'a³ y b³ son únicas. ¿Cuál es más grande ahora?' },
      { texto: 'Haz que las piezas a²b juntas sumen 36 y déjalas a la vista.',
        logrado: v => v.solo === 'a2b' && nPiezas(v, 'a2b') * tiposCubo(v).a2b.volumen === 36,
        bien: '3 · a²b = 36: con a = 2 y b = 3, cada una mide 12.',
        pista: 'Creo que cada pieza debe medir 12. Prueba con a = 2.' },
      { texto: 'Guarda dos tipos distintos que tengan el mismo número de piezas.',
        logrado: (v, guardados) => guardados.some(x => guardados.some(y => x.solo !== 'todas' && y.solo !== 'todas' && x.solo !== y.solo
          && nPiezas(x, x.solo) === nPiezas(y, y.solo))),
        bien: '1, 3, 3, 1: la fila 3 de Pascal se lee igual en los dos sentidos.' },
    ],
  };

  // Mesa 3 (idea 3): el término general de (xᵖ + c/x^q)⁶ con p, q y c libres: el exponente de x es p(6 − k) − qk. Colores
  // de la unidad: k turquesa (lo que se elige de b), el exponente de x en tinta y el término sin x en violeta.
  const NL = 6;
  const expTotal = v => v.p * (NL - v.k) - v.q * v.k;
  const tablaGeneral = v => ({
    columnas: ['lugar', 'k', 'exp. de x', 'coef.'], colorCol: [null, 'i', null, 'f'],
    filas: Array.from({ length: NL + 1 }, (_, j) => {
      const e = v.p * (NL - j) - v.q * j;
      return [lugar(j + 1), String(j), { t: f(e, 0), color: e === 0 ? 'f' : null, fuerte: e === 0 }, { t: f(C(NL, j) * v.c ** j, 0), color: 'f', fuerte: j === v.k }];
    }),
    resaltes: [{ f: v.k, c: 0, ancho: 4, color: 'i' }],
    alt: `Los siete términos de (x elevado a ${v.p} + ${v.c}/x elevado a ${v.q}) a la 6`,
  });
  const titulo2 = v => `(${pot('x', v.p)} ${v.c < 0 ? '−' : '+'} ${Math.abs(v.c)}/${pot('x', v.q)})⁶`;
  const mesaTermino = {
    id: 'termino-libre', titulo: 'Término general a medida', pieza: 'alg-tabla',
    consigna: 'Elige el exponente de x del primer término, el de 1/x del segundo y su número. Busca la fila con exponente 0.',
    controles: [
      { id: 'p', etiqueta: 'exponente de x', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      { id: 'q', etiqueta: 'exponente de 1/x', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      { id: 'c', etiqueta: 'número del segundo', opciones: [{ valor: 1, texto: '1' }, { valor: 2, texto: '2' }, { valor: -1, texto: '−1' }] },
      { id: 'k', etiqueta: 'k', min: 0, max: NL, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
    ],
    dibujo: v => ({ datos: tablaGeneral(v), estado: {} }),
    lectura: v => { const e = expTotal(v); return [`${titulo2(v)}, k = ${v.k}: ${f(C(NL, v.k) * v.c ** v.k, 0)}`, e === 0 ? ', sin ninguna x' : pot('x', e)]; },
    arrastres: [{
      id: 'fila-k', etiqueta: 'fila marcada: súbela o bájala', color: 'c-i',
      donde: v => { const g = TABLA().geometria(tablaGeneral(v)); return { x: g.xs[g.nc] - 4, y: g.cy(v.k) }; },
      mover: (pt, v) => ({ k: filaDe(tablaGeneral(v), pt.y) }),
    }],
    invitaciones: [
      { texto: 'Busca el término sin x.',
        logrado: v => expTotal(v) === 0,
        bien: 'Con exponente total 0, ese es el término independiente.' },
      { texto: 'Con el número −1, haz que el coeficiente marcado sea negativo.',
        logrado: v => v.c === -1 && C(NL, v.k) * v.c ** v.k < 0,
        bien: 'Con el número −1, la potencia (−1)ᵏ es negativa cuando k es impar.' },
      { texto: 'Busca el coeficiente más grande de la mesa.',
        logrado: v => C(NL, v.k) * v.c ** v.k === Math.max(...[1, 2, -1].flatMap(c => [0, 1, 2, 3, 4, 5, 6].map(k => C(NL, k) * c ** k))),
        bien: '15 · 2⁴ = 240: el combinatorio y la potencia de 2 se equilibran en k = 4.' },
      { texto: 'Guarda dos binomios distintos con el término sin x en la misma fila.',
        logrado: (v, guardados) => expTotal(v) === 0 && guardados.some(g => (g.p !== v.p || g.q !== v.q) && g.k === v.k && expTotal(g) === 0)
          && guardados.some(g => ['p', 'q', 'c', 'k'].every(z => g[z] === v[z])),
        bien: 'La fila sin x la decide la razón entre los exponentes, no sus valores.' },
    ],
  };
  // Mesa 4 (idea 5): la suma de los primeros términos de (1 + x) elevado a α, contra el valor exacto. Con α = 2 la suma
  // termina: desde 3 términos es exacta en todo x; con α = −1 es 1 − x + x² − … La curva exacta en tinta y la suma en
  // violeta (lo que se busca), discontinua.
  const EJES = () => Kit.piezas.ejes;
  const inversa = (escala, a0, b0) => px => a0 + (px - escala(a0)) * (b0 - a0) / (escala(b0) - escala(a0));
  const ALFAS_L = { '1/2': [1, 2], '-1/2': [-1, 2], '-1': [-1, 1], '2': [2, 1] };
  const EJ3 = { x: { min: -0.8, max: 1.4, paso: 0.2, cada: 2, nombre: 'x', decimales: 1 }, y: { min: -1, max: 4, paso: 1, nombre: 'y', decimales: 0 } };
  const exacta = (al, xx) => (1 + xx) ** (ALFAS_L[al][0] / ALFAS_L[al][1]);
  const parcialA = (al, xx, m) => { let s2 = 0; for (let j = 0; j < m; j++) { const [n2, d] = coefA(ALFAS_L[al], j); s2 += n2 / d * xx ** j; } return s2; };
  const tramo = fn => { const out = []; for (let i = 0; i <= 88; i++) { const xx = -0.8 + 2.2 * i / 88, yy = fn(xx); out.push(yy >= -1 && yy <= 4 ? [xx, yy] : null); } return out; };
  const serieLibre = v => {
    const ye = exacta(v.al, v.x), ys = parcialA(v.al, v.x, v.m), dentro = yy => Math.max(-1, Math.min(4, yy));
    return Object.assign({}, EJ3, {
      curvas: [{ puntos: tramo(xx => exacta(v.al, xx)), color: null }, { puntos: tramo(xx => parcialA(v.al, xx, v.m)), color: 'f', discontinua: true }],
      puntos: [{ x: v.x, y: dentro(ye), color: null }, { x: v.x, y: dentro(ys), color: 'f', abierto: true }],
      alt: `Curva exacta de (1 + x) elevado a ${v.al} y la suma de sus ${v.m} primeros términos`,
    });
  };
  const errorSerie = v => Math.abs(parcialA(v.al, v.x, v.m) - exacta(v.al, v.x));
  const mesaSerie = {
    id: 'serie-alfa', titulo: 'La suma con otro exponente', pieza: 'ejes',
    consigna: 'Elige α, cuántos términos sumas y arrastra el punto en x. Con α natural, la suma termina; con los demás, no.',
    controles: [
      { id: 'al', etiqueta: 'α', opciones: [{ valor: '1/2', texto: '1/2' }, { valor: '-1/2', texto: '−1/2' }, { valor: '-1', texto: '−1' }, { valor: '2', texto: '2' }] },
      { id: 'x', etiqueta: 'x', min: -0.8, max: 1.4, paso: 0.2, inicio: 0.4, decimales: 1 },
      { id: 'm', etiqueta: 'Términos', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 },
    ],
    dibujo: v => ({ datos: serieLibre(v), estado: {} }),
    lectura: v => [`α = ${v.al.replace('-', '−')}, ${v.m} términos: suma ${f(parcialA(v.al, v.x, v.m), 4)}; exacto ${f(exacta(v.al, v.x), 4)}`],
    arrastres: [{
      id: 'punto-x', etiqueta: 'punto de la curva exacta: córrelo en x',
      donde: v => { const g = EJES().geometria(EJ3); return { x: g.X(v.x), y: g.Y(Math.max(-1, Math.min(4, exacta(v.al, v.x)))) }; },
      mover: pt => ({ x: inversa(EJES().geometria(EJ3).X, -0.8, 1.4)(pt.x) }),
    }],
    invitaciones: [
      { texto: 'Con α = 2, haz que la suma sea exacta.',
        logrado: v => v.al === '2' && errorSerie(v) < 1e-9,
        bien: 'Con α natural, desde el cuarto término todos los coeficientes valen 0.' },
      { texto: 'Con α = −1, pon x donde la suma ya no se acerca.',
        logrado: v => v.al === '-1' && Math.abs(v.x) >= 1 - 1e-9,
        bien: 'Con x fuera de −1 y 1, sumar más términos no acerca la suma.' },
      { texto: 'Con α = 1/2 y x = 0,2, logra un error menor que 0,001.',
        logrado: v => v.al === '1/2' && Math.abs(v.x - 0.2) < 1e-9 && errorSerie(v) < 0.001,
        bien: 'Cerca de 0, pocos términos ya dan una buena aproximación.' },
      { texto: 'Guarda el mismo α y el mismo x con más términos y menos error.',
        logrado: (v, guardados) => guardados.some(g => g.al === v.al && Math.abs(g.x - v.x) < 1e-9 && g.m < v.m && errorSerie(g) > errorSerie(v) + 1e-12)
          && guardados.some(g => g.al === v.al && Math.abs(g.x - v.x) < 1e-9 && g.m === v.m),
        bien: 'Con x entre −1 y 1, cada término más acerca la suma al valor exacto.' },
    ],
  };

  // ---------- Unidad ----------
  const LETRAS = {
    a: 'el primer término del binomio (a + b)ⁿ; en un ejercicio, un monomio como 2x',
    b: 'el segundo término del binomio (a + b)ⁿ, con su signo; en un ejercicio, un monomio como −3',
    c: 'el tercer término del trinomio (a + b + c)ⁿ',
    n: 'el exponente: cuántos paréntesis iguales se multiplican',
    k: 'cuántas veces se elige b, de 0 a n',
    e: 'el exponente de x en un término del binomio: e₁ en a, e₂ en b (idea 3)',
    x: 'una variable de los monomios', y: 'otra variable de los monomios',
    m: 'un número por hallar en un enunciado (un lugar, un exponente o un parámetro)',
    C: 'el número combinatorio C(n, k)',
    t: 'el término de lugar k + 1, tₖ₊₁',
    'α': 'el exponente que no es natural (idea 5)',
    p: 'cuántas veces se elige a en el trinomio', q: 'cuántas veces se elige b en el trinomio', r: 'cuántas veces se elige c en el trinomio',
    S: 'la suma de los coeficientes', P: 'el nombre de un polinomio en un enunciado',
  };
  // Historia: la de la versión anterior (fuente comprobada, The Newton Project).
  const HISTORIA = {
    texto: 'Los coeficientes del binomio son anteriores a Newton: los textos de Yang Hui ya muestran el triángulo aritmético en la tradición china. Newton extendió la idea a exponentes no naturales y a sumas que no terminan, trabajo que él mismo situó en 1665. Por eso el desarrollo del colegio, con n natural, y la extensión de Newton valen en condiciones distintas.',
    pregunta: '¿Qué pasa con el desarrollo si el exponente no es natural?',
    fuente: { titulo: 'Isaac Newton, History of the Method of Fluxions, transcripción diplomática — The Newton Project, Universidad de Oxford', url: 'https://newtonproject.ox.ac.uk/view/texts/diplomatic/NATP00356' },
  };
  const GLOSARIO = [
    // Idea 1: binomio, número combinatorio y triángulo de Pascal. Ninguno dice el coeficiente de a³b² en (a + b)⁵ (la
    // predicción: 10) ni con cuántas losetas salen 6 cenefas (la misión).
    { termino: 'binomio', formas: ['binomio', 'binomios'], def: 'Polinomio de dos términos.',
      simple: 'Una suma o resta de dos términos.', ver: ['binomio de Newton'],
      ejemplos: ['a + b es un binomio.', '2x − 3 también es un binomio.', 'x² + x + 1 no lo es: tiene tres términos.'] },
    { termino: 'número combinatorio', formas: ['número combinatorio', 'números combinatorios'], simbolo: 'C(n, k)',
      def: 'Cuántas maneras hay de elegir k cosas entre n, sin importar el orden: n!/(k!(n − k)!).',
      simple: 'Cuántos grupos distintos se pueden elegir.', ver: ['triángulo de Pascal'],
      ejemplos: ['C(4, 2) = 6: de 4 losetas, 2 turquesas se ubican de 6 maneras.', 'C(n, 0) = 1: no elegir nada se hace de una manera.', 'En la academia también se escribe Cⁿₖ.'] },
    { termino: 'triángulo de Pascal', def: 'Números en filas: cada uno suma los dos de arriba; la fila n da los coeficientes de (a + b)ⁿ.',
      simple: 'Un triángulo de números que se arma sumando.', ver: ['número combinatorio'],
      ejemplos: ['Fila 3: 1, 3, 3, 1.', 'Fila 4: 1, 4, 6, 4, 1.', 'Cada fila se lee igual al derecho y al revés.'] },
    // Idea 2: binomio de Newton, término general y término de lugar k (local: en División es el del cociente). Ninguno
    // dice el término de lugar 4 de (x − 2)⁶ (la predicción: −160x³) ni el lugar de −40x² (la misión).
    { termino: 'binomio de Newton', def: 'La fórmula que da cualquier término de (a + b)ⁿ sin multiplicar los paréntesis uno por uno.',
      simple: 'La fórmula para elevar una suma de dos términos.', ver: ['término general'],
      ejemplos: ['(a + b)³ = a³ + 3a²b + 3ab² + b³.', 'Sirve con n natural: 2, 3, 10…', 'Lleva el nombre de Isaac Newton.'] },
    { termino: 'término general', formas: ['término general', 'términos generales'], def: 'Fórmula que da el término de un lugar cualquiera del desarrollo, sin escribir los demás.',
      simple: 'Una fórmula que sirve para cualquier término.', ver: ['término de lugar k'],
      ejemplos: ['En (a + b)ⁿ: tₖ₊₁ = C(n, k)aⁿ⁻ᵏbᵏ.', 'Con n = 4 y k = 1 da 4a³b.', 'Con k = 0 da el primero: aⁿ.'] },
    { termino: 'término de lugar k', local: true, formas: ['término de lugar', 'términos de lugar'], simbolo: 'tₖ',
      def: 'El término que ocupa el puesto k del desarrollo, contando desde el primero.',
      simple: 'El término que está en cierto puesto de la fila.', ver: ['término general'],
      ejemplos: ['En (a + b)³, el de lugar 2 es 3a²b.', 'El de lugar 1 es aⁿ.', 'En el lugar k + 1, b sale k veces.'] },
    // Idea 3: exponente negativo, exponente cero y natural. Ninguno dice si (x² + 1/x)⁵ tiene término sin x (la
    // predicción) ni qué k lo da en (x² + 1/x)⁶ (la misión).
    { termino: 'exponente negativo', formas: ['exponente negativo', 'exponentes negativos'], def: 'Exponente menor que 0: x⁻ⁿ es 1/xⁿ.',
      simple: 'Un exponente con signo menos: la potencia pasa abajo, a dividir.', ver: ['exponente cero'],
      ejemplos: ['x⁻¹ = 1/x.', 'x⁻³ = 1/x³.', 'x⁵ · x⁻² = x³: se suman con su signo.'] },
    { termino: 'exponente cero', def: 'Todo número distinto de 0 elevado a 0 vale 1: x⁰ = 1.',
      simple: 'Elevar a la 0 da 1.', ver: ['exponente negativo'],
      ejemplos: ['5⁰ = 1.', 'x³ · x⁻³ = x⁰ = 1.', 'Un término con x⁰ ya no tiene x.'] },
    { termino: 'natural', formas: ['natural', 'naturales'], def: 'Número que sirve para contar: 0, 1, 2, 3 y así.',
      simple: 'Un número para contar cosas.',
      ejemplos: ['4 es natural.', '5/2 no lo es.', '−1 tampoco.'] },
    // Idea 4: término central (local: en Factorización es el del medio de un trinomio) y suma de coeficientes. Ninguno
    // dice cuánto suman los coeficientes de (2x − 1)⁵ (la predicción) ni con qué n hay 16 cenefas (la misión).
    { termino: 'término central', local: true, formas: ['término central', 'términos centrales', 'central', 'centrales'],
      def: 'En un desarrollo, el término que tiene tantos términos a su izquierda como a su derecha.',
      simple: 'El término que queda justo al medio.',
      ejemplos: ['En (a + b)², es 2ab.', 'En (a + b)⁴ está en el lugar 3.', 'Con un número par de términos hay dos al medio.'] },
    { termino: 'suma de coeficientes', formas: ['suma de coeficientes', 'suma de los coeficientes'], simbolo: 'S',
      def: 'Lo que dan los coeficientes de un polinomio sumados; es su valor con cada letra igual a 1.',
      simple: 'Los números de todos los términos, sumados.', ver: ['término central'],
      ejemplos: ['En 3x² − x + 4, es 3 − 1 + 4 = 6.', 'En (x + 1)², es 1 + 2 + 1 = 4.', 'Con x = 1 se lee de una vez.'] },
    // Idea 5: desarrollo infinito y aproximación. Ninguno dice cuántos términos tiene (1 + x) elevado a 1/2 (la
    // predicción) ni qué α da 4 términos (la misión).
    { termino: 'desarrollo infinito', formas: ['desarrollo infinito', 'desarrollos infinitos'], def: 'Un desarrollo cuyos términos siguen sin parar, porque ningún coeficiente se vuelve 0.',
      simple: 'Una suma que nunca se acaba.', ver: ['aproximación'],
      ejemplos: ['(1 + x)⁻¹ = 1 − x + x² − x³ + …', 'Con α negativo siempre pasa.', '(1 + x)⁴ no lo es: tiene 5 términos.'] },
    { termino: 'aproximación', formas: ['aproximación', 'aproximaciones', 'aproximado', 'aproximada'], def: 'Un valor cercano al exacto, que se usa cuando el exacto es difícil de calcular.',
      simple: 'Un número muy cercano al verdadero.', ver: ['desarrollo infinito'],
      ejemplos: ['1,41 es una aproximación de √2.', '√1,02 ≈ 1,01 con dos términos.', 'Con más términos, más cerca.'] },
    // Idea 6: factorial y coeficiente multinomial. Ninguno dice el coeficiente de a²b²c² en (a + b + c)⁶ (la
    // predicción: 90) ni qué grupo tiene 12 cenefas (la misión).
    { termino: 'factorial', formas: ['factorial', 'factoriales'], simbolo: 'n!', def: 'El producto de todos los enteros de 1 hasta n; 0! vale 1.',
      simple: 'Multiplicar un número por todos los menores, hasta 1.',
      ejemplos: ['4! = 4 · 3 · 2 · 1 = 24.', '1! = 1 y 0! = 1.', 'n! cuenta cómo ordenar n cosas distintas.'] },
    { termino: 'coeficiente multinomial', formas: ['coeficiente multinomial', 'coeficientes multinomiales'], def: 'El coeficiente de un término de (a + b + c)ⁿ: n! entre el factorial de cada exponente.',
      simple: 'El número de un término al elevar un trinomio.', ver: ['factorial'],
      ejemplos: ['En (a + b + c)³, el de abc es 6.', 'En (a + b + c)², el de ab es 2.', 'Con una letra ausente, es un número combinatorio.'] },
  ];
  const IDEAS = [pascal, general, buscado, suma, serie, multinomio];
  // «Ahora tú» y «Así se resuelve» no repiten el enunciado de un ejemplo de su idea ni el binomio de la predicción o del
  // juego (etapa-delegada, reglas 8 y 15): si sale uno, se prueba con otra semilla del mismo tipo (+ 4 · 1999 · k, para
  // que sem % 4 no cambie). La prueba propia lo comprueba en 400 semillas.
  const VETO = {
    'pascal-elecciones': ['(a + b)⁵'], 'termino-general': ['(x − 2)⁶', '(2x − 1)⁵'], 'termino-buscado': ['(x² + 1/x)⁵', '(x² + 1/x)⁶'],
    'suma-coeficientes': ['(2x − 1)⁵'], 'exponente-no-natural': ['términos tiene el desarrollo de (1 + x) elevado a 1/2?'], 'potencia-trinomio': ['a²b²c²'],
  };
  // La firma de un ejercicio: sus trozos de matemática (binomios con su exponente, monomios, números) y qué pide, sin
  // orden ni redacción. Con el enunciado exacto se colaban ejemplos dichos de otra manera («del desarrollo de», «¿cuánto
  // da …, aproximado?»): uno de cada cuatro «Ahora tú» de la idea 1 era el ejemplo 12 (auditoría, 26 nov).
  const firma = t => {
    t = String(t).replace(/[\u00a0\u2060]/g, ' ').replace(/(\d) (\d{3})\b/g, '$1$2');
    const pide = ['independiente', 'central', 'lugar', 'suman', 'aproxim', 'coeficiente', 'cenefas', 'vale n', 'vale m', 'términos'].filter(p => t.includes(p)).slice(0, 1);
    const trozos = (t.match(/\([^()]*\)(?:[⁰¹²³⁴⁵⁶⁷⁸⁹⁻ⁿ]+| elevado a −?\d+\/\d+)?|[^\s;:¿?()]+/g) || [])
      .map(w => w.replace(/[,.]+$/, '')).filter(w => /[\d⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ(√]/.test(w));
    return [...pide, ...trozos.sort()].join(' | ');
  };
  for (const idea of IDEAS) {
    const enun = new Set(idea.ejemplos.map(e => firma(Kit.plano(e.enunciado))));
    const repite = c => { const t = Kit.plano(c.pregunta || c.enunciado); return enun.has(firma(t)) || VETO[idea.id].some(v => t.includes(v)); };
    for (const m of [idea.ahoraTu, idea.resuelve]) {
      const base = m.generar.bind(m);
      m.generar = s => { for (let k = 0; k < 60; k++) { const c = base(s + 7996 * k); if (!repite(c)) return c; } throw new Error(`${idea.id}: sin caso nuevo`); };
    }
  }
  const LAB = [mesaCubo, mesaPascal, mesaTermino, mesaSerie];
  // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
  const LAB_IDEAS = { 'piezas-elegidas': ['pascal-elecciones'], 'pascal-colores': ['pascal-elecciones'], 'termino-libre': ['termino-buscado'], 'serie-alfa': ['exponente-no-natural'] };

  return {
    unidad: 'algebra.binomio-de-newton',
    version: '0.3.0',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-cenefa.js', '/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/arit-calculadora.js', '/nucleo/kit/piezas/ejes.js', '/plantillas/cuadrado-crece/motor.js', '/nucleo/kit/piezas/alg-cubo-3d.js'],
    colores: COLORES,
    letras: LETRAS,
    laboratorio: LAB,
    glosario: GLOSARIO,
    historia: HISTORIA,
    laboratorioIdeas: LAB_IDEAS,
    ideas: IDEAS,
  };
});
