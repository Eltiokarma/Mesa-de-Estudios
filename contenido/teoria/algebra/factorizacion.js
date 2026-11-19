/*
 * Teoría de «Factorización» (algebra.factorizacion), quinta unidad de la rama «Expresiones algebraicas», después de
 * «División de polinomios y cocientes notables».
 *
 * Etapa 7 del método (19 nov 2026; docs/etapa7/propuesta-algebra.md, con sus «Decisiones tomadas»): seis ideas, con los
 * pisos del maestro Rubén (piezas alg-reparto y alg-losetas, dibujos de prueba) como hilo: factorizar es armar con un
 * pedido de piezas un rectángulo sin que sobre ni falte nada; sus lados son los factores. 1 «Factor común y agrupación»
 * (`factor-comun`: el ancho más grande que deja usar todo el pedido), 2 «Productos notables al revés» (`identidades`,
 * nueva: el piso cuadrado y la factorización completa), 3 «Aspa simple» (`aspa-simple`: las tiras repartidas entre los
 * dos lados), 4 «Aspa doble y doble especial» (`aspa-doble`: las tres aspas en el cuaderno), 5 «Divisores binómicos y
 * teorema del factor» (`teorema-factor`: la tabla de Ruffini que deja resto 0) y 6 «MCD y MCM de polinomios»
 * (`mcd-mcm`: la tabla de exponentes). Los cinco ids de la ronda 2 se conservan con otra Predice; el avance se ajusta en
 * nucleo/avance.js (REHECHAS_E6, marca prediccionFZ).
 *
 * Letras (la tabla entera va en `letras`): x e y las variables (x, el lado de la loseta en dm); a y b, los dos términos
 * de una identidad; en la idea 5, a es el número que anula a P (como en División), y cada dato que la usa lo dice;
 * q, el cociente de Ruffini; m y n, los números de los dos factores del aspa simple; P y Q, nombres de polinomios.
 * REGLA DE COLORES DE LA UNIDAD (docs/molde-unidad.md §5b; propuesta §6), en la tabla COLORES (def.colores):
 *   - tinta: el polinomio que se factoriza (el pedido entero, el total), las letras x e y y lo que se pide con «?»;
 *   - turquesa (c-i): el factor que se saca o se prueba (el ancho del pasadizo, el factor común, la primera fila del
 *     aspa, x − a) y el número a que anula a P;
 *   - violeta (c-f): el otro factor (el largo, lo que queda dentro del paréntesis, la segunda fila del aspa, el cociente
 *     de Ruffini); en la idea 6, el MCD y el MCM (lo que se pide);
 *   - naranja (c-o): lo que sobra o falta del pedido (como el resto de División); en la idea 6, los exponentes de P;
 *   - turquesa en la idea 6: los exponentes de Q (P y Q como en Polinomios: primer y segundo polinomio);
 *   - ni carmín ni verde (factorizacion.test.js lo comprueba en todas las fichas y figuras).
 * Nada antes de Predice de cada idea (título, Resumen, Lee, glosario, juego) dice su respuesta (prueba propia).
 * No se adelanta Ecuaciones polinomiales: no se dice «raíz» ni se resuelven ecuaciones; P(a) = 0 es «a anula a P».
 * La factorización es con coeficientes enteros: un factor primo ya no se escribe como producto con enteros (propuesta,
 * decisión 2); los factores primos se cuentan distintos y sin la constante (decisión 3), y lo dice el dato.
 *
 * Errores: AL8 y AL11 de docs/investigacion/algebra-funciones-ideas-erroneas.md (parcial) y TAL-* (hipótesis de diseño;
 * los de cada idea en su comentario). Práctica: plantillas/factorizacion-practica/ (formato «predicciones», tipos por
 * idea). La escena «El cuadrado que crece» y el generador viejo division-polinomios van a «Más mesas del tema».
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
    r.mezclar = l => { const x = l.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { if (!o || o.texto === null || o.texto === undefined || o.texto === '') continue; const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  // Las alternativas van en tinta, sin fichas de magnitud: con su color y su punteado se leían como términos del glosario
  // (lector B, 19 nov). El color queda en la solución.
  const ops = lista => distintas(lista).slice(0, 4).map(o => Object.assign({}, o, { texto: Kit.plano(o.texto) }));
  function conCuatro(caso, r) {
    for (let i = 0; i < 120; i++) { const c = caso(r); if (c && c.opciones.length >= 4) return c; }   // null: el caso no sirve, otro
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  // ---------- Escritura de polinomios ----------
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = n => String(n).split('').map(c => SUP[c]).join('');
  const pot = (v, e) => (e === 0 ? '' : e === 1 ? v : v + sup(e));
  // Polinomio en x con coeficientes de mayor a menor grado: [2, 0, −5, 1] → «2x³ − 5x + 1».
  function poli(cs, v = 'x') {
    const n = cs.length - 1, out = [];
    cs.forEach((c, k) => { if (c !== 0) out.push([c, n - k]); });
    if (!out.length) return '0';
    return out.map(([c, e], i) => {
      const abs = Math.abs(c), lit = pot(v, e), num = abs === 1 && lit ? '' : f(abs);
      return (c < 0 ? (i ? ' − ' : '−') : (i ? ' + ' : '')) + num + lit;
    }).join('');
  }
  // Monomio c·xᵖyᵍ: (6, 2, 1) → «6x²y»; con signo al frente si es negativo.
  const mono = (c, p, q = 0) => `${c < 0 ? '−' : ''}${Math.abs(c) === 1 && (p || q) ? '' : f(Math.abs(c))}${pot('x', p)}${pot('y', q)}`;
  // Una suma de monomios [[c, p, q], …] con sus signos: «6x²y − 9xy³ + 3xy».
  const suma = ts => ts.filter(t => t[0] !== 0).map((t, i) => (i === 0 ? mono(...t) : `${t[0] < 0 ? ' − ' : ' + '}${mono(Math.abs(t[0]), t[1], t[2])}`)).join('') || '0';
  const par = v => (v < 0 ? `(${f(v)})` : f(v));
  const conPar = t => (/[+−]/.test(t.slice(1)) ? `(${t})` : t);   // un polinomio de varios términos va entre paréntesis
  const evaluar = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
  const mult = (A, B) => { const out = Array(A.length + B.length - 1).fill(0); A.forEach((u, i) => B.forEach((w, j) => { out[i + j] += u * w; })); return out; };
  const sumar = (A, B) => { const n = Math.max(A.length, B.length), a = Array(n - A.length).fill(0).concat(A), b = Array(n - B.length).fill(0).concat(B); return a.map((v, i) => v + b[i]); };
  const mcdN = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const ruffini = (cs, x) => cs.reduce((b, c, i) => [...b, i ? c + x * b[i - 1] : c], []);
  const binx = a => (a === 0 ? 'x' : a > 0 ? `x − ${f(a)}` : `x + ${f(-a)}`);          // el factor x − a
  const lin = (m, p) => poli([m, p]);                                                   // mx + p
  const conSigno = v => (v < 0 ? `− ${f(-v)}` : `+ ${f(v)}`);

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba la prueba propia) ----------
  const COLORES = { 'factor que se saca': 'i', 'número que anula': 'i', 'otro factor': 'f', 'lo que sobra': 'o',
    'exponente en P': 'o', 'exponente en Q': 'i', 'MCD y MCM': 'f' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: String(t), m: mg });
  const FS = ficha('factor que se saca'), NA = ficha('número que anula'), FO = ficha('otro factor'), SO = ficha('lo que sobra');
  const EP = ficha('exponente en P'), EQ = ficha('exponente en Q'), MM = ficha('MCD y MCM');
  // La letra de una alternativa, en negrita y en tinta (Gerson, mesa del 17 nov). El U+2060 (invisible) queda para que la
  // letra no se lea como variable.
  const letra = L => ({ negrita: `${L}⁠` });
  const SEP = ';   ';   // separa dos igualdades (un «·» se leería como producto: molde §2)
  const RP = datos => ({ pieza: 'alg-reparto', datos, estado: {} });
  const LO = datos => ({ pieza: 'alg-losetas', datos, estado: {} });
  const TB = datos => ({ pieza: 'alg-tabla', datos, estado: {} });
  // Un producto de dos factores con colores: (FS)(FO).
  const prod2 = (a, b) => [FS(conPar(a)), FO(conPar(b))];

  // Datos que se repiten (herramientas, no el paso hecho).
  const DD = {
    comun: 'Factor común: el mayor número que divide a todos los coeficientes, y cada letra con su menor exponente',
    dentro: 'Dentro del paréntesis va cada término dividido entre el factor común',
    divPot: 'xᵐ ÷ xⁿ = xᵐ⁻ⁿ, y x⁰ = 1',
    mult: 'Para multiplicar polinomios, cada término de uno multiplica a cada término del otro',
    distrib: 'ab + ac = a(b + c)',
    agrupa: 'Agrupar: se juntan los términos de a dos y se saca el factor común de cada par',
    signo: 'b − a = −(a − b)',
    piezas: 'Una loseta (x por x dm) cubre x² dm²; una tira (x por 1 dm), x dm²; un cuadradito, 1 dm²',
    area: 'Área de un rectángulo: ancho · largo',
    gradoA: 'Grado absoluto de un polinomio: el mayor de los grados de sus términos (exponentes sumados)',
    valor: 'Valor numérico: se cambia cada letra por su número y se opera',
  };

  // ---------- Idea 1: factor común y agrupación ----------
  // Propuesta: docs/etapa7/propuesta-algebra.md (§1 a §6, idea 1). Objeto: el pedido de 2 losetas y 4 tiras que Rubén
  // quiere poner en un solo pasadizo (alg-reparto, 'pasadizo'): el ancho más grande que deja usar todo el pedido es el
  // factor común (turquesa), y el largo, lo que queda dentro del paréntesis (violeta).
  // Cambia: el ancho, cx (c de 1 a 3). · Permanece: el pedido 2x² + 4x. · Progresa: el largo, que es el pedido entre el
  // ancho. · Se reserva: un término que sale entero (la predicción: 6x³ + 3x² deja un 1). · Debe verse: con 1x y 2x entra
  // todo; con 3x faltan piezas; el más ancho que entra es el factor común.
  // Errores (hipótesis de diseño): TAL-UNO-CERO no deja el 1 del término que sale entero · TAL-COMUN-MENOR no saca la
  // menor potencia · TAL-COMUN-COEF no saca el número común · TAL-COMUN-MAYOR toma la mayor potencia · TAL-COMUN-UNA
  // saca una sola de las letras · TAL-SIGNO-BIN no cambia el signo del binomio volteado · TAL-SIGNO-DENTRO cambia el
  // signo dentro del binomio · TAL-AGRUPA-SIGNO saca el factor del segundo par sin su signo · TAL-AGRUPA-CRUZ cambia el
  // signo del binomio común.
  const PED1 = [2, 4, 0];   // 2 losetas, 4 tiras
  // El largo de cada ancho: con 1x y 2x entra todo; con 3x, un largo de x + 1 pide una loseta más (faltan piezas).
  const ancho1 = c => [Math.ceil(2 / c), Math.floor(4 / c)];
  const pasadizo1 = (c, juego = true) => RP(Object.assign({ objeto: 'pasadizo', ancho: [c, 0], largo: ancho1(c), pedido: PED1 }, juego ? { tope: [2, 4], topeAncho: [3, 0] } : {}));
  const cx = c => (c === 1 ? 'x' : `${c}x`);
  const piezasTxt = (n, k) => `${n} ${['loseta', 'tira'][k]}${n > 1 ? 's' : ''}`;
  function lectura1(c) {
    const [p, s] = ancho1(c), usa = [c * p, c * s], dif = [PED1[0] - usa[0], PED1[1] - usa[1]];
    const ec = [FS(cx(c)), ' · ', FO(conPar(lin(p, s))), ` = ${poli([usa[0], usa[1], 0])}`];
    if (dif.some(v => v < 0)) return [...ec, ': ', SO(`falta${dif.filter(v => v < 0).reduce((a, v) => a - v, 0) > 1 ? 'n' : ''} ${dif.map((v, k) => (v < 0 ? piezasTxt(-v, k) : '')).filter(Boolean).join(' y ')}`)];
    if (dif.some(v => v > 0)) return [...ec, ': ', SO(`sobra${dif.reduce((a, v) => a + v, 0) > 1 ? 'n' : ''} ${dif.map((v, k) => (v > 0 ? piezasTxt(v, k) : '')).filter(Boolean).join(' y ')}`)];
    return c === 1 ? [...ec, ': entra todo; ¿entra con uno más ancho?'] : [...ec, ': entra todo'];
  }

  // Ahora tú 1: el término que sale entero deja un 1 (no la predicción: 6x³ + 3x²).
  function casoUno(r) {
    const g = r.uno([2, 3, 4, 5, 7]), n = r.ent(1, 3), d = r.ent(1, 3), k = r.ent(2, 4), sg = r.uno([1, -1]);
    if (g === 3 && n === 2 && d === 1 && k === 2 && sg === 1) return null;
    const A = g * k, comun = mono(g, n), dentro = `${mono(k, d)} ${sg > 0 ? '+' : '−'} 1`;
    const P = `${mono(A, n + d)} ${sg > 0 ? '+' : '−'} ${mono(g, n)}`;
    return {
      pregunta: [`¿Cuál es la factorización de ${P} con todo su factor común afuera?`],
      datos: [DD.comun, DD.dentro, DD.divPot],
      opciones: ops([
        { id: 'c', texto: [FS(comun), '(', FO(dentro), ')'], correcta: true },
        { id: 'cero', texto: [FS(comun), '(', FO(mono(k, d)), ')'], error: 'TAL-UNO-CERO', siFuera: `Bien el ${comun} afuera. Pero al multiplicar solo vuelve ${mono(A, n + d)}: falta el 1 de ${mono(g, n)}.` },
        n > 1 || g > 1 ? { id: 'menor', texto: [FS(mono(g, n - 1)), '(', FO(`${mono(k, d + 1)} ${sg > 0 ? '+' : '−'} x`), ')'], error: 'TAL-COMUN-MENOR', siFuera: `Bien el número ${g}. Pero dentro queda una x común: la menor potencia es ${pot('x', n)}.` } : null,
        { id: 'coef', texto: [FS(pot('x', n)), '(', FO(`${mono(A, d)} ${sg > 0 ? '+' : '−'} ${g}`), ')'], error: 'TAL-COMUN-COEF', siFuera: `Bien la potencia ${pot('x', n)}. Pero ${A} y ${g} tienen al ${g} común: también sale.` },
      ]),
      solucion: { texto: `${mono(g, n)} es un término entero: dividido entre sí mismo deja 1.`, ecuacion: [`${P} = `, FS(comun), '(', FO(dentro), ')'] },
    };
  }
  // Ahora tú 2: el factor común de un binomio con dos letras.
  function casoDosLetras(r) {
    const g = r.uno([2, 3, 4, 5, 6]), k1 = r.ent(1, 5), k2 = r.ent(1, 5);
    if (mcdN(k1, k2) !== 1 || k1 === k2) return null;
    const p1 = r.ent(1, 4), p2 = r.ent(1, 4), q1 = r.ent(1, 4), q2 = r.ent(1, 4);
    if (p1 === p2 || q1 === q2) return null;
    const sg = r.uno([1, -1]), P = suma([[g * k1, p1, q1], [sg * g * k2, p2, q2]]);
    const bien = mono(g, Math.min(p1, p2), Math.min(q1, q2));
    return {
      pregunta: [`¿Cuál es el factor común de ${P}?`],
      datos: [DD.comun],
      opciones: ops([
        { id: 'c', texto: FS(bien), correcta: true },
        { id: 'mayor', texto: FS(mono(g, Math.max(p1, p2), Math.max(q1, q2))), error: 'TAL-COMUN-MAYOR', siFuera: 'Bien el número común. Pero de cada letra va la menor potencia: la mayor no está en los dos.' },
        { id: 'coef', texto: FS(mono(1, Math.min(p1, p2), Math.min(q1, q2))), error: 'TAL-COMUN-COEF', siFuera: `Bien las letras. Pero ${g * k1} y ${g * k2} tienen al ${g} común: también sale.` },
        { id: 'una', texto: FS(mono(g, Math.min(p1, p2))), error: 'TAL-COMUN-UNA', siFuera: `Bien el ${g} y la x. Pero y también está en los dos términos.` },
      ]),
      solucion: { texto: `El mayor número que divide a ${g * k1} y ${g * k2} es ${g}; de x y de y va la menor potencia.`, ecuacion: [`${P} = `, FS(bien), '(', FO(suma([[k1, p1 - Math.min(p1, p2), q1 - Math.min(q1, q2)], [sg * k2, p2 - Math.min(p1, p2), q2 - Math.min(q1, q2)]])), ')'] },
    };
  }
  // Ahora tú 3: un binomio común con el signo volteado, m·x(x − a) + n(a − x).
  function casoVolteado(r) {
    const a = r.ent(2, 9), m = r.ent(2, 6), n = r.ent(2, 9);
    if (m === n || mcdN(m, n) !== 1) return null;
    const P = `${m}x(x − ${a}) + ${n}(${a} − x)`;
    return {
      pregunta: [`¿Cuál es la factorización de ${P}?`],
      datos: [DD.signo, DD.distrib],
      opciones: ops([
        { id: 'c', texto: [FS(`(x − ${a})`), FO(`(${m}x − ${n})`)], correcta: true },
        { id: 'nosigno', texto: [FS(`(x − ${a})`), FO(`(${m}x + ${n})`)], error: 'TAL-SIGNO-BIN', siFuera: `Bien x − ${a} como binomio común. Pero ${a} − x = −(x − ${a}): el ${n} sale con su menos.` },
        { id: 'dentro', texto: [FS(`(x + ${a})`), FO(`(${m}x − ${n})`)], error: 'TAL-SIGNO-DENTRO', siFuera: `Bien el ${m}x − ${n}. Pero el signo cambia en el ${n} que multiplica, no dentro del binomio x − ${a}.` },
        { id: 'ambos', texto: [FS(`(${a} − x)`), FO(`(${m}x + ${n})`)], error: 'TAL-AGRUPA-CRUZ', siFuera: `Bien que un binomio se voltea. Pero así da −(x − ${a})(${m}x + ${n}), otro polinomio.` },
      ]),
      solucion: { texto: `${a} − x = −(x − ${a}): el segundo término es −${n}(x − ${a}), y x − ${a} queda común.`, ecuacion: [`${P} = `, FS(`(x − ${a})`), FO(`(${m}x − ${n})`)] },
    };
  }
  // Ahora tú 4 (nivel examen): agrupar de a dos y sumar los dos factores. P = (x + a)(c·x² + b).
  function casoAgrupar(r) {
    const a = r.noCero(-6, 6), b = r.noCero(-7, 7), c = r.uno([1, 1, 2, 3]);
    if (Math.abs(a) === Math.abs(b) || mcdN(c, b) !== 1 || (b < 0 && Number.isInteger(Math.sqrt(-b * c)))) return null;   // cx² + b primo
    const P = poli(mult([1, a], [c, 0, b]));
    const sumaF = ([u, v], [w, y, z]) => poli(sumar([w, y, z], [u, v]));
    const bien = sumaF([1, a], [c, 0, b]);
    return {
      pregunta: [`Al factorizar ${P} agrupando de a dos, salen dos factores. ¿Cuánto suman?`],
      datos: [DD.agrupa, DD.distrib],
      opciones: ops([
        { id: 'c', texto: FO(bien), correcta: true },
        { id: 'signo', texto: FO(sumaF([1, a], [c, 0, -b])), error: 'TAL-AGRUPA-SIGNO', siFuera: `Bien ${lin(1, a)} común al primer par. Pero del segundo sale ${f(b)} con su signo.` },
        { id: 'cruz', texto: FO(sumaF([1, -a], [c, 0, b])), error: 'TAL-AGRUPA-CRUZ', siFuera: `Bien ${poli([c, 0, b])}. Pero el binomio común es ${lin(1, a)}, con el signo de su número.` },
        { id: 'olvida', texto: FO(poli([c, 0, b + a])), error: 'TAL-PIDE', siFuera: `Bien los números ${f(a)} y ${f(b)}. Pero el factor ${lin(1, a)} también trae su x.` },
      ]),
      solucion: { texto: `Cada par deja el mismo binomio, ${lin(1, a)}: el polinomio es (${lin(1, a)})(${poli([c, 0, b])}).`, ecuacion: [`(${lin(1, a)}) + (${poli([c, 0, b])}) = `, FO(bien)] },
    };
  }

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h). Cuentas rehechas aparte con sympy (scratchpad de la
  // sesión, e7-algebra/scripts/cuentas-ejemplos.py), sin el código de la unidad. Cada distractor de nivel 3 rehace su
  // error. Las letras de las respuestas de nivel 3 van C, A, B, D, E (una vez cada una en la idea). Ninguna figura muestra
  // lo que se pide.
  const EJEMPLOS_COMUN = [
    { nivel: 1, titulo: 'El ancho más grande',
      enunciado: ['Rubén tiene (6x² + 9x) dm² de piezas: 6 losetas y 9 tiras. ¿Cuál es el ancho más grande de un pasadizo que use todo el pedido sin que sobre nada?'],
      datos: [DD.piezas, DD.area, DD.comun],
      figura: LO({ objeto: 'pedido', filas: [{ nombre: 'Pedido', cuenta: [6, 9, 0] }] }),
      solucion: [
        { texto: 'El ancho tiene que caber en los dos términos. El mayor número que divide a 6 y a 9 es 3, y la x está en los dos.' },
        { texto: 'Con ancho 3x, el largo es cada término entre 3x.', ecuacion: ['6x² + 9x = ', FS('3x'), '(', FO('2x + 3'), ')'] },
      ],
      respuesta: [FS('3x dm'), ' (el largo, ', FO('(2x + 3) dm'), ')'] },
    { nivel: 1, titulo: 'Solo un número común',
      enunciado: ['Factoriza 12x + 18.'],
      datos: [DD.comun, DD.dentro],
      solucion: [{ texto: 'El mayor número que divide a 12 y a 18 es 6. La x no está en el 18, así que no sale.', ecuacion: ['12x + 18 = ', FS('6'), '(', FO('2x + 3'), ')'] }],
      respuesta: [FS('6'), '(', FO('2x + 3'), ')'] },
    { nivel: 1, titulo: 'Con dos letras',
      enunciado: ['Factoriza 10x²y − 15xy².'],
      datos: [DD.comun, DD.dentro],
      solucion: [
        { texto: 'Número: 5 divide a 10 y a 15. Letras: x con la menor potencia, x¹; y también, y¹.', ecuacion: ['factor común: ', FS('5xy')] },
        { texto: 'Cada término entre 5xy: 10x²y deja 2x y 15xy² deja 3y.', ecuacion: ['10x²y − 15xy² = ', FS('5xy'), '(', FO('2x − 3y'), ')'] },
      ],
      respuesta: [FS('5xy'), '(', FO('2x − 3y'), ')'] },
    { nivel: 1, titulo: 'Un término sale entero',
      enunciado: ['Factoriza 7x³ + 7x.'],
      datos: [DD.comun, DD.dentro, DD.divPot],
      solucion: [
        { texto: 'El factor común es 7x, que es justo el segundo término.' },
        { texto: '7x³ entre 7x deja x²; 7x entre 7x deja 1. El 1 no se borra: sin él, al multiplicar se pierde un término.', ecuacion: ['7x³ + 7x = ', FS('7x'), '(', FO('x² + 1'), ')'] },
      ],
      respuesta: [FS('7x'), '(', FO('x² + 1'), ')'] },
    { nivel: 1, titulo: 'Comprobar multiplicando',
      enunciado: ['Ana dice que 4x² − 12x = 4x(x − 3). ¿Tiene razón?'],
      datos: [DD.mult],
      solucion: [{ texto: 'Se multiplica el factor por cada término de adentro y se compara con el original.', ecuacion: [FS('4x'), ' · x − ', FS('4x'), ' · 3 = 4x² − 12x'] }],
      respuesta: ['Sí: 4x(x − 3) vuelve a dar 4x² − 12x'] },
    { nivel: 2, titulo: 'Tres términos',
      enunciado: ['Factoriza 8x³ − 12x² + 8x.'],
      datos: [DD.comun, DD.dentro, DD.divPot],
      solucion: [
        { texto: 'El mayor número que divide a 8, 12 y 8 es 4. La menor potencia de x es x¹.', ecuacion: ['factor común: ', FS('4x')] },
        { texto: 'Cada término entre 4x: queda 2x², −3x y 2.', ecuacion: ['8x³ − 12x² + 8x = ', FS('4x'), '(', FO('2x² − 3x + 2'), ')'] },
      ],
      respuesta: [FS('4x'), '(', FO('2x² − 3x + 2'), ')'] },
    { nivel: 2, titulo: 'Dos letras y tres términos',
      enunciado: ['Factoriza 6x³y² + 9x²y³ − 3x²y².'],
      datos: [DD.comun, DD.dentro, DD.divPot],
      solucion: [
        { texto: 'Número: 3. Letras: la menor potencia de x es x² y la de y es y².', ecuacion: ['factor común: ', FS('3x²y²')] },
        { texto: 'Cada término entre 3x²y²: 6x³y² deja 2x, 9x²y³ deja 3y y el último deja 1.', ecuacion: [FS('3x²y²'), '(', FO('2x + 3y − 1'), ')'] },
      ],
      respuesta: [FS('3x²y²'), '(', FO('2x + 3y − 1'), ')'] },
    { nivel: 2, titulo: 'Un binomio común',
      enunciado: ['Factoriza 5x(x + 4) + 3(x + 4).'],
      datos: [DD.distrib],
      solucion: [{ texto: 'Los dos términos tienen el mismo binomio, x + 4. Se saca como cualquier factor común: queda lo que lo multiplicaba.', ecuacion: ['5x(x + 4) + 3(x + 4) = ', FS('(x + 4)'), FO('(5x + 3)')] }],
      respuesta: [FS('(x + 4)'), FO('(5x + 3)')] },
    { nivel: 2, titulo: 'Agrupar de a dos',
      enunciado: ['Factoriza x³ + 5x² + 2x + 10.'],
      datos: [DD.agrupa, DD.distrib],
      solucion: [
        { texto: 'Los cuatro términos no tienen un factor común. Se agrupan de a dos: del primer par sale x², del segundo sale 2.', ecuacion: ['x²(x + 5) + 2(x + 5)'] },
        { texto: 'Los dos pares dejan el mismo binomio, x + 5: ese es el factor común.', ecuacion: ['x²(x + 5) + 2(x + 5) = ', FS('(x + 5)'), FO('(x² + 2)')] },
      ],
      respuesta: [FS('(x + 5)'), FO('(x² + 2)')] },
    { nivel: 2, titulo: 'Sacar también el signo',
      enunciado: ['Factoriza −6x² − 15x sacando el signo menos junto con el factor común.'],
      datos: [DD.comun, DD.dentro],
      solucion: [
        { texto: 'Sin el signo, el factor común es 3x. Con el signo afuera, se saca −3x.' },
        { texto: 'Cada término entre −3x: −6x² deja 2x y −15x deja 5, los dos con +.', ecuacion: ['−6x² − 15x = ', FS('−3x'), '(', FO('2x + 5'), ')'] },
      ],
      respuesta: [FS('−3x'), '(', FO('2x + 5'), ')'] },
    { nivel: 3, titulo: 'Un binomio volteado',
      enunciado: ['¿Cuál es la factorización de 2x(x − 3) + 5(3 − x)?'],
      alternativas: ['(x − 3)(2x + 5)', '(x + 3)(2x − 5)', '(x − 3)(2x − 5)', '(3 − x)(2x + 5)', '(x − 3)(5 − 2x)'],
      datos: [DD.signo, DD.distrib, DD.mult],
      solucion: [
        { texto: '3 − x = −(x − 3), así que el segundo término es −5(x − 3). Ahora los dos tienen x − 3.', ecuacion: ['2x(x − 3) − 5(x − 3) = ', FS('(x − 3)'), FO('(2x − 5)')] },
        { texto: 'Se comprueba: el original es 2x² − 6x + 15 − 5x = 2x² − 11x + 15, y (x − 3)(2x − 5) da lo mismo.' },
        { texto: ['La ', letra('A'), ' deja el 5 con +: da 2x² − x − 15. La ', letra('B'), ' cambia el signo de adentro: da 2x² + x − 15.'] },
        { texto: ['La ', letra('D'), ' da −2x² + x + 15. La ', letra('E'), ' da −2x² + 11x − 15: el original con todos los signos cambiados.'] },
      ],
      respuesta: [letra('C'), ', ', FS('(x − 3)'), FO('(2x − 5)')] },
    { nivel: 3, titulo: 'La suma de los factores',
      enunciado: ['Al factorizar x³ − 4x² + 3x − 12 agrupando de a dos, salen dos factores. ¿Cuánto suman?'],
      alternativas: ['x² + x − 1', 'x² + x + 7', 'x² + x − 7', 'x³ − 4x² + 3x − 12', 'x² − 1'],
      datos: [DD.agrupa, DD.distrib],
      solucion: [
        { texto: 'Del primer par sale x²; del segundo, 3. Los dos dejan x − 4.', ecuacion: ['x²(x − 4) + 3(x − 4) = ', FS('(x − 4)'), FO('(x² + 3)')] },
        { texto: 'Se suman los dos factores.', ecuacion: ['(x − 4) + (x² + 3) = ', FO('x² + x − 1')] },
        { texto: ['La ', letra('B'), ' cambia el −4 por +4: (x + 4) + (x² + 3). La ', letra('C'), ' saca −3 en vez de 3: (x − 4) + (x² − 3).'] },
        { texto: ['La ', letra('D'), ' es el producto, no la suma. La ', letra('E'), ' olvida la x de x − 4: −4 + x² + 3.'] },
      ],
      respuesta: [letra('A'), ', ', FO('x² + x − 1')] },
    { nivel: 3, titulo: 'El largo de un pasadizo',
      enunciado: ['Un pasadizo cubre (6x² + 15x) dm², y su ancho es el factor común, 3x dm. Si la loseta mide x = 4 dm, ¿cuántos dm mide el largo?'],
      alternativas: ['8', '13', '23', '52', '156'],
      datos: [DD.area, DD.comun, DD.dentro],
      figura: RP({ objeto: 'pasadizo', ancho: [3, 0], largo: [2, 5], piezas: false, rotuloLargo: '?', sobran: false }),
      solucion: [
        { texto: 'El largo es lo que queda dentro del paréntesis.', ecuacion: ['6x² + 15x = ', FS('3x'), '(', FO('2x + 5'), ')'] },
        { texto: 'Con x = 4, el largo vale 2 · 4 + 5.', ecuacion: ['2 · 4 + 5 = ', FO('13')] },
        { texto: ['La ', letra('A'), ' olvida el 5: 2 · 4 = 8. La ', letra('C'), ' no divide el 15 entre 3: 2 · 4 + 15 = 23.'] },
        { texto: ['La ', letra('D'), ' divide el área, 156, entre 3 y no entre 3x = 12: 156 ÷ 3 = 52. La ', letra('E'), ' da el área.'] },
      ],
      respuesta: [letra('B'), ', ', FO('13 dm')] },
    { nivel: 3, titulo: 'El otro factor, con números',
      enunciado: ['x²y + xy² + 3x + 3y se factoriza agrupando de a dos, y uno de sus factores es x + y. Si x = 2 e y = 3, ¿cuánto vale el otro factor?'],
      alternativas: ['5', '6', '15', '9', '45'],
      datos: [DD.agrupa, DD.valor],
      solucion: [
        { texto: 'Del primer par sale xy; del segundo, 3. Los dos dejan x + y.', ecuacion: ['xy(x + y) + 3(x + y) = ', FS('(x + y)'), FO('(xy + 3)')] },
        { texto: 'El otro factor es xy + 3. Con x = 2 e y = 3.', ecuacion: ['2 · 3 + 3 = ', FO('9')] },
        { texto: ['La ', letra('A'), ' da x + y = 5, el factor que ya se conocía. La ', letra('B'), ' olvida el 3: xy = 6.'] },
        { texto: ['La ', letra('C'), ' toma 3(x + y) = 15, un par sin factorizar. La ', letra('E'), ' evalúa todo el polinomio: 5 · 9 = 45.'] },
      ],
      respuesta: [letra('D'), ', ', FO('9')] },
    { nivel: 3, titulo: 'El grado de lo que queda',
      enunciado: ['Al sacar el factor común de 4x⁵y³ − 8x³y⁴ + 12x⁴y⁶, ¿qué grado absoluto tiene el factor que queda dentro del paréntesis?'],
      alternativas: ['6', '10', '2', '3', '4'],
      datos: [DD.comun, DD.dentro, DD.gradoA],
      solucion: [
        { texto: 'El factor común es 4x³y³: número 4 y la menor potencia de cada letra.', ecuacion: [FS('4x³y³'), '(', FO('x² − 2y + 3xy³'), ')'] },
        { texto: 'Dentro, los grados son 2, 1 y 1 + 3 = 4. El grado absoluto es el mayor: 4.' },
        { texto: ['La ', letra('A'), ' da el grado del factor común, 3 + 3 = 6. La ', letra('B'), ' da el grado de 12x⁴y⁶ antes de sacar nada: 10.'] },
        { texto: ['La ', letra('C'), ' mira solo el primer término, x². La ', letra('D'), ' cuenta los términos de adentro: 3.'] },
      ],
      respuesta: [letra('E'), ', ', FO('4')] },
  ];

  const comun = {
    id: 'factor-comun',
    titulo: 'Factor común y agrupación',
    pregunta: '¿Qué se saca cuando todos los términos comparten algo?',
    temas: ['Factor común e identidades'],
    pieza: 'alg-reparto',
    aprendizaje: 'Factorizar es escribir como producto: se saca lo que se repite en todos los términos; agrupando, aparece un binomio común.',
    actividad: 'Cambiar el ancho de un pasadizo hasta que el pedido entero entre sin que sobre nada.',
    // Lee: el pedido, qué es factorizar, ancho por largo y qué mirar. No dice qué pasa con un término que sale entero
    // (la predicción) ni cuál es el ancho más grande (la misión).
    lee: {
      tarjetas: [
        { titulo: 'El pedido de Rubén', texto: 'El maestro Rubén tiene 2 losetas y 4 tiras: cubren (2x² + 4x) dm². Quiere ponerlas todas en un solo pasadizo rectangular, sin que sobre ninguna pieza.',
          pieza: 'alg-losetas', dibujo: LO({ objeto: 'pedido', filas: [{ nombre: 'Pedido', cuenta: PED1 }] }) },
        { titulo: 'Factorizar', texto: 'En la feria, 12 polos se arman en 3 paquetes de 4: 12 = 3 · 4. Factorizar un polinomio es lo mismo: escribirlo como una multiplicación. Cada parte que se multiplica es un factor.',
          ecuacion: ['3x² + 12x = ', FS('3x'), '(', FO('x + 4'), ')'] },
        { titulo: 'Ancho por largo', texto: 'Un pasadizo cubre su ancho por su largo. Con x dm de ancho, el pedido arma un largo de (2x + 4) dm. Ancho y largo son los dos factores.',
          pieza: 'alg-reparto', dibujo: pasadizo1(1, false) },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar el ancho del pasadizo. Mira con qué anchos entra el pedido entero y con cuáles sobran piezas.' },
      ],
    },
    ejemplos: EJEMPLOS_COMUN,
    juega: {
      pieza: 'alg-reparto',
      consigna: 'Rubén tiene (2x² + 4x) dm² de piezas: 2 losetas y 4 tiras. Quiere ponerlas todas en un solo pasadizo.',
      mision: {
        texto: 'Elige el ancho más grande que usa todo el pedido sin que sobre nada.',
        logrado: v => v.c === 2,
        bien: 'Listo: con 2x dm de ancho entra todo. Con 3x ya no cuadra.',
      },
      voz: 'Ensancha el pasadizo y mira si sobra algo.',
      leyenda: [
        { s: 'x', t: 'lado de la loseta, en dm' },
        { s: FS('ancho'), t: 'el factor que se saca' },
        { s: FO('largo'), t: 'lo que queda dentro del paréntesis' },
        { s: SO('Sobran'), t: 'piezas que no entran' },
        { s: 'Faltan', t: 'huecos: piezas que no hay' },
      ],
      controles: [{ id: 'c', etiqueta: 'Ancho: cuántas x', color: 'c-i', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: v => pasadizo1(v.c),
      lectura: v => lectura1(v.c),
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuál es la factorización de 6x³ + 3x² con todo su factor común afuera?',
      datos: ['6 = 3 · 2', 'x³ es x² por x'],
      voz: 'Piensa qué queda de cada término.',
      opciones: [
        { id: 'c', texto: '3x²(2x + 1)', correcta: true },
        { id: 'cero', texto: '3x²(2x)', error: 'TAL-UNO-CERO', siFuera: 'Bien el 3x² afuera. Pero al multiplicar solo vuelve 6x³: falta lo que deja 3x².' },
        { id: 'menor', texto: '3x(2x² + x)', error: 'TAL-COMUN-MENOR', siFuera: 'Bien el 3 y una x. Pero dentro todavía queda una x común.' },
        { id: 'coef', texto: 'x²(6x + 3)', error: 'TAL-COMUN-COEF', siFuera: 'Bien la potencia x². Pero 6 y 3 tienen al 3 común: también sale.' },
      ],
      dibujo: TB({ columnas: ['número', 'exponente de x'], rotulosFila: ['primero', 'segundo', 'común'], filas: [['6', '3'], ['3', '2'], [{ t: '?', hueco: true }, { t: '?', hueco: true }]], alt: 'El primer término tiene el número 6 y x con exponente 3; el segundo, 3 y exponente 2; lo común, por hallar' }),
      revelar: TB({ columnas: ['número', 'exponente de x'], rotulosFila: ['primero', 'segundo', 'común'], filas: [['6', '3'], ['3', '2'], [{ t: '3', color: 'i', fuerte: true }, { t: '2', color: 'i', fuerte: true }]], alt: 'Lo común es el 3 y x con exponente 2: el factor común es 3x al cuadrado' }),
      coincide: 'Coincide: sale 3x², y dentro quedan 2x y un 1, porque 3x² entre 3x² es 1.',
      noCoincide: 'Revisemos: 3x² es un término entero; entre sí mismo deja 1, y ese 1 no se borra.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: { columnas: ['paso', 'cómo'], filas: [
        [{ t: 'número', desde: 1 }, { t: '3 divide a 6 y a 3', desde: 1 }],
        [{ t: 'letra', desde: 2 }, { t: 'la menor: x²', desde: 2 }],
        [{ t: 'entre 3x²', desde: 3 }, { t: '2x y 1', desde: 3, color: 'f' }],
        [{ t: 'agrupar', desde: 5 }, { t: 'x²(x + 2) + 3(x + 2)', desde: 5 }],
        [{ t: 'común', desde: 6 }, { t: '(x + 2)(x² + 3)', desde: 6, fuerte: true }],
      ], alt: 'Pasos del factor común de 6x³ + 3x² y de la agrupación de x³ + 2x² + 3x + 6' },
      voz: 'Primero el número, después cada letra.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El mayor número que divide a 6 y a 3 es 3.', ecuacion: ['6 = 3 · 2;   3 = 3 · 1'] },
        { estado: { corte: 2 }, texto: 'De x³ y x², la menor potencia es x²: está en los dos.', ecuacion: ['x³ = x² · x'] },
        { estado: { corte: 3 }, texto: 'Cada término entre 3x²: el segundo deja 1.', ecuacion: ['6x³ ÷ 3x² = 2x;   3x² ÷ 3x² = 1'] },
        { estado: { corte: 4 }, texto: 'El 1 se queda: al multiplicar, vuelve el 3x².', ecuacion: [FS('3x²'), '(', FO('2x + 1'), ') = 6x³ + 3x²'] },
        { estado: { corte: 5 }, texto: 'Con cuatro términos sin nada común, se agrupa de a dos.', ecuacion: ['x²(x + 2) + 3(x + 2)'] },
        { estado: { corte: 6 }, texto: 'Los dos pares dejan x + 2: se saca como factor común.', ecuacion: ['x²(x + 2) + 3(x + 2) = ', FS('(x + 2)'), FO('(x² + 3)')] },
      ],
    },
    regla: {
      texto: 'El factor común lleva el mayor número que divide a los coeficientes y cada letra con su menor exponente. Si nada es común a todos, se agrupa de a dos.',
      ecuacion: ['ab + ac = ', FS('a'), '(', FO('b + c'), ')'],
      condicion: 'cada término se divide entre el factor común: uno que sale entero deja un 1; se comprueba multiplicando.',
      voz: 'Si no hay nada común a todos, prueba agrupar de a dos.',
      dibujo: RP({ objeto: 'pasadizo', ancho: [2, 0], largo: [1, 2], pedido: PED1, sobran: false }),
    },
    // Así se resuelve: el factor común de un trinomio con dos letras. «Ahora tú» pide otra cosa: el término que sale
    // entero, el factor común de un binomio, el binomio volteado y la suma de los factores al agrupar.
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        let g, ks, ps, qs;
        do {
          g = r.uno([2, 3, 4, 5, 6]); ks = [r.ent(1, 4), r.noCero(-5, 5), r.noCero(-3, 3)];
          ps = [r.ent(2, 5), r.ent(1, 4), r.ent(1, 4)]; qs = [r.ent(1, 3), r.ent(1, 4), r.ent(1, 3)];
        } while (mcdN(mcdN(ks[0], ks[1]), ks[2]) !== 1 || new Set(ps.map((p, i) => `${p},${qs[i]}`)).size < 3);
        const pm = Math.min(...ps), qm = Math.min(...qs), comunT = mono(g, pm, qm);
        const P = suma(ks.map((k, i) => [g * k, ps[i], qs[i]])), dentro = suma(ks.map((k, i) => [k, ps[i] - pm, qs[i] - qm]));
        const tabla = corte => ({ datos: { columnas: ['', 'número', 'x', 'y'], filas: [
          ['términos', ks.map(k => f(Math.abs(g * k))).join(', '), ps.map(p => pot('x', p)).join(', '), qs.map(q => pot('y', q)).join(', ')],
          ['común', { t: f(g), desde: 1, color: 'i' }, { t: pot('x', pm), desde: 1, color: 'i' }, { t: pot('y', qm), desde: 1, color: 'i' }]], alt: `Números y potencias de los tres términos de ${P}` }, estado: { corte } });
        return {
          enunciado: [`Factoriza ${P} sacando todo su factor común.`],
          datos: [DD.comun, DD.dentro, DD.divPot],
          dibujo: tabla(0),
          pasos: [
            { tipo: 'pide', texto: 'Piden escribirlo como un factor común por lo que queda dentro del paréntesis.' },
            { tipo: 'datos', texto: `Tiene tres términos, con los números ${ks.map(k => f(Math.abs(g * k))).join(', ')} y las letras x e y en todos.` },
            { tipo: 'regla', texto: 'El factor común lleva el mayor número que divide a los coeficientes y cada letra con su menor exponente.' },
            { tipo: 'cuentas', texto: `El mayor número común es ${g}; la menor potencia de x es ${pot('x', pm)} y la de y, ${pot('y', qm)}.`, ecuacion: ['factor común: ', FS(comunT)], dibujo: tabla(1) },
            { tipo: 'cuentas', texto: `Cada término entre ${comunT}: se dividen los números y se restan los exponentes.`, ecuacion: [FS(comunT), '(', FO(dentro), ')'] },
            { tipo: 'sentido', texto: `Al multiplicar ${comunT} por cada término de adentro vuelve el polinomio, y dentro ya no queda nada común.` },
          ],
          respuesta: [FS(comunT), '(', FO(dentro), ')'],
        };
      },
    },
    ahoraTu: {
      voz: 'Primero el número común, después cada letra.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoUno, r);
        if (tipo === 1) return conCuatro(casoDosLetras, r);
        if (tipo === 2) return conCuatro(casoVolteado, r);
        return conCuatro(casoAgrupar, r);
      },
    },
  };

  // ---------- Idea 2 (nueva, 19 nov): productos notables al revés ----------
  // Objeto: el piso cuadrado de Rubén: 1 loseta y 9 cuadraditos, y él decide cuántas tiras comprar (alg-reparto,
  // 'pasadizo' con ancho y largo iguales). Cambia: el lado x + s (s de 1 a 4) y las tiras t (0 a 8). · Permanece: la
  // loseta y los 9 cuadraditos. · Progresa: lo que sobra o falta. · Se reserva: una diferencia de cuadrados y la
  // factorización completa (la predicción: x⁴ − 16). · Debe verse: el piso cuadrado (x + 3)² pide justo 6 tiras, el doble
  // producto.
  // Errores: TAL-INCOMPLETA se para antes de que cada factor sea primo · AL8 toma una diferencia como un cuadrado ·
  // AL11 reparte la potencia en una resta · TAL-SIN-RAIZ no saca la raíz de los cuadrados · TAL-RAIZ-UNA saca la raíz de uno
  // solo · TAL-IDENTIDAD cambia una identidad por otra · TAL-SIGNO cambia el signo del binomio · TAL-2AB no divide entre 2
  // el término del medio · TAL-CUBO-SIGNO deja el signo del medio igual al del binomio · TAL-CUBO-DOBLE pone el doble
  // producto en el trinomio · TAL-CUBO-MEDIO olvida el término del medio · TAL-PRIMO-CONST cuenta la constante · TAL-PRIMO-X
  // olvida el factor x · TAL-PRIMO-REPITE cuenta un factor repetido varias veces.
  const piso2 = (s, t, juego = true) => RP(Object.assign({ objeto: 'pasadizo', ancho: [1, s], largo: [1, s], pedido: [1, t, 9] }, juego ? { tope: [1, 4], topeAncho: [1, 4] } : {}));
  function lectura2(s, t) {
    const ec = [FS(`(x + ${s})`), '² = ', poli([1, 2 * s, s * s])];
    if (t === 2 * s && s * s === 9) return [...ec, ': el pedido entero'];
    return [...ec, `;   tienes ${poli([1, t, 9])}`];   // lo que hay con las tiras compradas (el pedido era x² + 9: lector A)
  }
  const DI = {
    dif: 'a² − b² = (a + b)(a − b), con a y b lo que va al cuadrado (no los términos)',
    tcp: 'a² ± 2ab + b² = (a ± b)²: el del medio es el doble producto',
    cubos: 'a³ + b³ = (a + b)(a² − ab + b²) y a³ − b³ = (a − b)(a² + ab + b²)',
    primo: 'Factor primo: de grado 1 o más, ya no se escribe como producto con coeficientes enteros',
    cuenta: 'Factores primos, con coeficientes enteros: se cuentan los distintos; un número solo, como el 2 de 2x, no cuenta',
    sumaCuad: 'Con coeficientes enteros, a² + b² no se escribe como producto',
  };
  // Ahora tú 1: una diferencia de cuadrados con coeficientes (y a veces con dos letras).
  function casoDifCuad(r) {
    const p = r.ent(2, 7), q = r.ent(1, 9), dos = r.uno([false, true]);
    if (p === q || mcdN(p, q) !== 1 || (dos && q === 1)) return null;   // «1y²» no se escribe (auditoría)   // con un número común, la factorización no sería completa (auditoría A1)
    const L = dos ? 'y' : '', A = `${p}x`, B = `${q}${L}`, P = `${p * p}x² − ${q * q}${pot(L || '', dos ? 2 : 0)}`;
    return {
      pregunta: [`¿Cuál es la factorización de ${P}?`],
      datos: [DI.dif],
      opciones: ops([
        { id: 'c', texto: [FS(`(${A} + ${B})`), FO(`(${A} − ${B})`)], correcta: true },
        { id: 'cuad', texto: [FS(`(${A} − ${B})`), '²'], error: 'AL8', siFuera: `Bien ${A} y ${B}: sus cuadrados son los términos. Pero (${A} − ${B})² tiene doble producto en el medio.` },
        { id: 'sinraiz', texto: [FS(`(${p * p}x + ${q * q}${L})`), FO(`(${p * p}x − ${q * q}${L})`)], error: 'TAL-SIN-RAIZ', siFuera: `Bien la suma por la diferencia. Pero va lo que se eleva al cuadrado: ${p * p}x² es (${A})².` },
        { id: 'una', texto: [FS(`(${A} + ${q * q}${L})`), FO(`(${A} − ${q * q}${L})`)], error: 'TAL-RAIZ-UNA', siFuera: `Bien ${A}. Pero ${q * q}${dos ? 'y²' : ''} también es un cuadrado: el de ${B}.` },
      ]),
      solucion: { texto: `Es un cuadrado menos otro: (${A})² − (${B})².`, ecuacion: [`${P} = `, FS(`(${A} + ${B})`), FO(`(${A} − ${B})`)] },
    };
  }
  // Ahora tú 2: un trinomio cuadrado perfecto (ax ± b)².
  function casoTCP(r) {
    const a = 1, b = r.ent(2, 9), sg = r.uno([1, -1]);
    if (b === 3 && sg === 1) return null;   // el piso del juego (y «Así se resuelve» usa coeficientes de 2 a 5)
    const A = a === 1 ? 'x' : `${a}x`, s = sg > 0 ? '+' : '−', o = sg > 0 ? '−' : '+';
    const P = poli([a * a, sg * 2 * a * b, b * b]);
    return {
      pregunta: [`¿Cuál es la factorización de ${P}?`],
      datos: [DI.tcp, DI.dif],
      opciones: ops([
        { id: 'c', texto: [FS(`(${A} ${s} ${b})`), '²'], correcta: true },
        { id: 'dif', texto: [FS(`(${A} + ${b})`), FO(`(${A} − ${b})`)], error: 'TAL-IDENTIDAD', siFuera: `Bien ${A} y ${b}. Pero la suma por la diferencia da ${poli([a * a, 0, -b * b])}, sin el del medio.` },
        { id: 'signo', texto: [FS(`(${A} ${o} ${b})`), '²'], error: 'TAL-SIGNO', siFuera: `Bien el binomio al cuadrado. Pero el del medio, ${poli([sg * 2 * a * b, 0]).replace(/^−/, '−')}, lleva el signo ${s}.` },
        { id: 'doble', texto: [FS(`(${A} ${s} ${2 * b})`), '²'], error: 'TAL-2AB', siFuera: `Bien el binomio al cuadrado. Pero el segundo término es el número que al cuadrado da ${b * b}: ${b}.` },
      ]),
      solucion: { texto: `${P.split(' ')[0]} y ${b * b} son cuadrados, y el del medio es 2 · ${A} · ${b}: el doble producto.`, ecuacion: [`${P} = `, FS(`(${A} ${s} ${b})`), '²'] },
    };
  }
  // Ahora tú 3: el otro factor de una suma o diferencia de cubos.
  function casoCubos(r) {
    const a = r.uno([1, 1, 2, 3]), b = r.ent(1, 5), sg = r.uno([1, -1]);
    if (a === b || mcdN(a, b) !== 1) return null;
    const A = a === 1 ? 'x' : `${a}x`, s = sg > 0 ? '+' : '−', o = sg > 0 ? '−' : '+';
    const P = `${a ** 3 === 1 ? '' : a ** 3}x³ ${s} ${b ** 3}`;
    const tri = (m, c) => `${a * a === 1 ? '' : a * a}x² ${m} ${c}x + ${b * b}`;
    return {
      pregunta: [`Uno de los factores de ${P} es ${A} ${s} ${b}. ¿Cuál es el otro?`],
      datos: [DI.cubos],
      opciones: ops([
        { id: 'c', texto: FO(tri(o, a * b === 1 ? '' : a * b)), correcta: true },
        { id: 'igual', texto: FO(tri(s, a * b === 1 ? '' : a * b)), error: 'TAL-CUBO-SIGNO', siFuera: `Bien los cuadrados ${a === 1 ? 'x²' : `(${A})² = ${a * a}x²`} y ${b * b}. Pero el del medio va con el signo contrario al del binomio.` },
        { id: 'doble', texto: FO(tri(o, 2 * a * b)), error: 'TAL-CUBO-DOBLE', siFuera: `Bien los cuadrados. Pero el del medio es ${A} · ${b}, sin el 2 del cuadrado de un binomio.` },
        { id: 'medio', texto: FO(`${a * a === 1 ? '' : a * a}x² + ${b * b}`), error: 'TAL-CUBO-MEDIO', siFuera: `Bien los cuadrados. Pero falta el del medio, ${A} · ${b}.` },
      ]),
      solucion: { texto: `Es ${A} al cubo ${sg > 0 ? 'más' : 'menos'} ${b} al cubo. El trinomio: los cuadrados y el producto, con signo contrario.`, ecuacion: [`${P} = `, FS(`(${A} ${s} ${b})`), FO(`(${tri(o, a * b === 1 ? '' : a * b)})`)] },
    };
  }
  // Ahora tú 4 (nivel examen): cuántos factores primos tiene g·xᵉ·Q, con Q una o dos identidades. Cuatro formas, cada una
  // con sus errores: se cuenta la constante, se para antes, se olvida x o se cuenta un factor repetido.
  function casoPrimos(r) {
    const g = r.ent(2, 5), e = r.ent(3, 4), k = r.ent(1, 4), forma = r.ent(0, 3);
    let Q, bien, inc, rep, nom;
    if (forma === 0) { Q = [1, 0, -k * k]; bien = 3; inc = 2; rep = e + 2; nom = `x, x + ${k} y x − ${k}`; }
    else if (forma === 1) { Q = [1, 0, 0, 0, -(k ** 4)]; bien = 4; inc = 3; rep = e + 3; nom = `x, x² + ${k * k}, x + ${k} y x − ${k}`; }
    else if (forma === 2) { Q = [1, 2 * k, k * k]; bien = 2; inc = 1; rep = e + 2; nom = `x y x + ${k}`; }
    else { Q = [1, 0, 0, -(k ** 3)]; bien = 3; inc = 2; rep = e + 2; nom = `x, x − ${k} y x² + ${k === 1 ? '' : k}x + ${k * k}`; }
    const P = poli(mult([g, ...Array(e).fill(0)], Q));
    return {
      pregunta: [`¿Cuántos factores primos tiene ${P}?`],
      datos: [DI.cuenta, forma === 2 ? DI.tcp : forma === 3 ? DI.cubos : DI.dif, DI.sumaCuad],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'const', texto: f(bien + 1), error: 'TAL-PRIMO-CONST', siFuera: `Bien los factores con x. Pero el ${g} es un número solo: no cuenta.` },
        { id: 'inc', texto: f(inc), error: forma === 2 ? 'TAL-PRIMO-X' : 'TAL-INCOMPLETA', siFuera: forma === 2 ? `Bien el binomio al cuadrado. Pero x también es un factor primo.` : 'Bien el factor común. Pero lo de adentro todavía se abre.' },
        { id: 'rep', texto: f(rep), error: 'TAL-PRIMO-REPITE', siFuera: `Bien los factores. Pero ${pot('x', e)} es un solo factor primo, x, aunque se repita.` },
      ]),
      solucion: { texto: `Sale ${g}${pot('x', e)} y se abre lo de adentro. Factores primos: ${nom}.`, ecuacion: [`factores primos: ${bien}`] },
    };
  }

  // Ejemplos de la idea 2. Cuentas rehechas aparte con sympy (cuentas-ejemplos.py). Letras de nivel 3: D, B, E, C, A.
  const EJEMPLOS_IDENT = [
    { nivel: 1, titulo: 'Un cuadrado menos otro',
      enunciado: ['Factoriza x² − 49.'],
      datos: [DI.dif],
      solucion: [{ texto: 'x² es el cuadrado de x y 49 es el cuadrado de 7: es una diferencia de cuadrados.', ecuacion: ['x² − 49 = ', FS('(x + 7)'), FO('(x − 7)')] }],
      respuesta: [FS('(x + 7)'), FO('(x − 7)')] },
    { nivel: 1, titulo: 'Con coeficiente',
      enunciado: ['Factoriza 4x² − 9.'],
      datos: [DI.dif],
      solucion: [{ texto: '4x² es (2x)² y 9 es 3². Lo que va al cuadrado es 2x, no 4x.', ecuacion: ['4x² − 9 = ', FS('(2x + 3)'), FO('(2x − 3)')] }],
      respuesta: [FS('(2x + 3)'), FO('(2x − 3)')] },
    { nivel: 1, titulo: 'El lado del piso',
      enunciado: ['Rubén tiene (x² + 8x + 16) dm² de piezas: 1 loseta, 8 tiras y 16 cuadraditos. Con todas arma un piso cuadrado. ¿Cuánto mide su lado?'],
      datos: [DD.piezas, DI.tcp],
      figura: LO({ objeto: 'pedido', filas: [{ nombre: 'Pedido', cuenta: [1, 8, 16] }] }),
      solucion: [
        { texto: 'x² es el cuadrado de x y 16 el de 4. El doble producto, 2 · x · 4 = 8x, son las 8 tiras.' },
        { texto: 'Es un binomio al cuadrado: el piso tiene lado x + 4.', ecuacion: ['x² + 8x + 16 = ', FS('(x + 4)'), '²'] },
      ],
      respuesta: [FS('(x + 4) dm')] },
    { nivel: 1, titulo: 'Dos cubos sumados',
      enunciado: ['Factoriza x³ + 27.'],
      datos: [DI.cubos],
      solucion: [
        { texto: 'x³ es el cubo de x y 27 es el cubo de 3. Es una suma de cubos.' },
        { texto: 'El trinomio lleva los cuadrados x² y 9 y el producto 3x con el signo contrario al del binomio.', ecuacion: ['x³ + 27 = ', FS('(x + 3)'), FO('(x² − 3x + 9)')] },
      ],
      respuesta: [FS('(x + 3)'), FO('(x² − 3x + 9)')] },
    { nivel: 1, titulo: '¿Es un cuadrado perfecto?',
      enunciado: ['¿x² + 6x + 4 es un trinomio cuadrado perfecto?'],
      datos: [DI.tcp],
      solucion: [{ texto: 'Los extremos son x² y 4 = 2². El doble producto sería 2 · x · 2 = 4x, y el del medio es 6x: no coincide.' }],
      respuesta: ['No: el doble producto tendría que ser 4x'] },
    { nivel: 2, titulo: 'Primero el factor común',
      enunciado: ['Factoriza por completo 3x² − 75.'],
      datos: [DD.comun, DI.dif],
      solucion: [
        { texto: 'Primero sale el 3, que divide a los dos términos.', ecuacion: ['3x² − 75 = 3(x² − 25)'] },
        { texto: 'Dentro queda una diferencia de cuadrados: 25 = 5².', ecuacion: ['3(x² − 25) = 3', FS('(x + 5)'), FO('(x − 5)')] },
      ],
      respuesta: ['3', FS('(x + 5)'), FO('(x − 5)')] },
    { nivel: 2, titulo: 'Con dos letras',
      enunciado: ['Factoriza 25x² − 30xy + 9y².'],
      datos: [DI.tcp],
      solucion: [
        { texto: '25x² es (5x)² y 9y² es (3y)². El doble producto es 2 · 5x · 3y = 30xy, con signo −.' },
        { texto: 'Es el cuadrado de una resta.', ecuacion: ['25x² − 30xy + 9y² = ', FS('(5x − 3y)'), '²'] },
      ],
      respuesta: [FS('(5x − 3y)'), '²'] },
    { nivel: 2, titulo: 'Diferencia de cubos',
      enunciado: ['Factoriza 8x³ − 1.'],
      datos: [DI.cubos],
      solucion: [
        { texto: '8x³ es (2x)³ y 1 es 1³: es una diferencia de cubos.' },
        { texto: 'El trinomio: (2x)² = 4x², el producto 2x · 1 = 2x con signo +, y 1² = 1.', ecuacion: ['8x³ − 1 = ', FS('(2x − 1)'), FO('(4x² + 2x + 1)')] },
      ],
      respuesta: [FS('(2x − 1)'), FO('(4x² + 2x + 1)')] },
    { nivel: 2, titulo: 'Dos veces la misma identidad',
      enunciado: ['Factoriza por completo 16x⁴ − 1.'],
      datos: [DI.dif, DI.sumaCuad],
      solucion: [
        { texto: '16x⁴ es (4x²)² y 1 es 1²: primero sale una diferencia de cuadrados.', ecuacion: ['16x⁴ − 1 = (4x² + 1)(4x² − 1)'] },
        { texto: '4x² − 1 todavía es (2x)² − 1²; 4x² + 1 ya no se abre.', ecuacion: ['16x⁴ − 1 = (4x² + 1)', FS('(2x + 1)'), FO('(2x − 1)')] },
      ],
      respuesta: ['(4x² + 1)', FS('(2x + 1)'), FO('(2x − 1)')] },
    { nivel: 2, titulo: 'Un binomio como término',
      enunciado: ['Factoriza (x + 1)² − 9.'],
      datos: [DI.dif],
      solucion: [
        { texto: 'Es un cuadrado menos otro, con a = x + 1 y b = 3.', ecuacion: ['(x + 1)² − 9 = (x + 1 + 3)(x + 1 − 3)'] },
        { texto: 'Se juntan los números de cada factor.', ecuacion: ['(x + 1 + 3)(x + 1 − 3) = ', FS('(x + 4)'), FO('(x − 2)')] },
      ],
      respuesta: [FS('(x + 4)'), FO('(x − 2)')] },
    { nivel: 3, titulo: 'La suma de los factores primos',
      enunciado: ['¿Cuánto suman los factores primos de 3x⁵ − 3x?'],
      alternativas: ['x² + 2x + 1', 'x² + 3x + 4', 'x⁴ + x − 1', 'x² + 3x + 1', '2x² + x'],
      datos: [DI.cuenta, DI.dif, DI.sumaCuad],
      solucion: [
        { texto: 'Sale 3x, y lo de adentro se abre dos veces.', ecuacion: ['3x⁵ − 3x = 3x(x⁴ − 1) = 3x(x² + 1)(x + 1)(x − 1)'] },
        { texto: 'Los factores primos son x, x² + 1, x + 1 y x − 1; el 3 no cuenta. Se suman:', ecuacion: [FO('x² + 3x + 1')] },
        { texto: ['La ', letra('A'), ' olvida el factor x. La ', letra('B'), ' suma también el 3. La ', letra('C'), ' no abre nada: x + (x⁴ − 1).'] },
        { texto: ['La ', letra('E'), ' se para antes: x + (x² + 1) + (x² − 1) = 2x² + x.'] },
      ],
      respuesta: [letra('D'), ', ', FO('x² + 3x + 1')] },
    { nivel: 3, titulo: 'Dos cubos con números',
      enunciado: ['Si a³ − b³ = 56 y a − b = 2, ¿cuánto vale a² + ab + b²?'],
      alternativas: ['112', '28', '54', '4', '58'],
      datos: [DI.cubos],
      solucion: [
        { texto: 'La diferencia de cubos es el producto de a − b por a² + ab + b².', ecuacion: ['56 = 2 · (a² + ab + b²)'] },
        { texto: 'Se divide 56 entre 2.', ecuacion: ['56 ÷ 2 = ', FO('28')] },
        { texto: ['La ', letra('A'), ' multiplica: 56 · 2 = 112. La ', letra('C'), ' resta: 56 − 2 = 54. La ', letra('E'), ' suma: 56 + 2 = 58.'] },
        { texto: ['La ', letra('D'), ' eleva al cuadrado la resta: 2² = 4.'] },
      ],
      respuesta: [letra('B'), ', ', FO('28')] },
    { nivel: 3, titulo: 'Lo que falta para un cuadrado',
      enunciado: ['¿Qué término con x hay que sumarle a 9x² + 16 para que sea un trinomio cuadrado perfecto con todos sus signos +?'],
      alternativas: ['144x', '12x', '25x', '288x', '24x'],
      datos: [DI.tcp],
      solucion: [
        { texto: '9x² es (3x)² y 16 es 4². Falta el doble producto.', ecuacion: ['2 · 3x · 4 = ', FO('24x')] },
        { texto: 'Así queda un binomio al cuadrado.', ecuacion: ['9x² + 24x + 16 = (3x + 4)²'] },
        { texto: ['La ', letra('A'), ' multiplica 9 · 16 = 144: usa 9 y 16 en vez de 3 y 4. La ', letra('B'), ' olvida el 2: 3 · 4 = 12. La ', letra('C'), ' suma 9 + 16.'] },
        { texto: ['La ', letra('D'), ' duplica con 9 y 16 en vez de 3 y 4: 2 · 9 · 16 = 288.'] },
      ],
      respuesta: [letra('E'), ', ', FO('24x')] },
    { nivel: 3, titulo: 'El lado de un piso cuadrado',
      enunciado: ['Un piso cuadrado cubre (4x² + 20x + 25) dm². Si la loseta mide x = 3 dm, ¿cuántos dm mide el lado del piso?'],
      alternativas: ['121', '17', '11', '8', '31'],
      datos: [DI.tcp, DD.valor],
      figura: RP({ objeto: 'pasadizo', ancho: [2, 5], largo: [2, 5], piezas: false, rotuloLargo: 'lado: ?', rotuloAncho: false, sobran: false }),
      solucion: [
        { texto: '4x² es (2x)² y 25 es 5²; el doble producto, 2 · 2x · 5 = 20x, coincide.', ecuacion: ['4x² + 20x + 25 = ', FS('(2x + 5)'), '²'] },
        { texto: 'El lado es 2x + 5. Con x = 3.', ecuacion: ['2 · 3 + 5 = ', FS('11')] },
        { texto: ['La ', letra('A'), ' da el área: 36 + 60 + 25 = 121. La ', letra('B'), ' toma 4x en vez de 2x: 12 + 5 = 17.'] },
        { texto: ['La ', letra('D'), ' toma x en vez de 2x: 3 + 5 = 8. La ', letra('E'), ' deja el 25 en vez de 5: 6 + 25 = 31.'] },
      ],
      respuesta: [letra('C'), ', ', FS('11 dm')] },
    { nivel: 3, titulo: 'Sin elevar al cuadrado',
      enunciado: ['¿Cuánto vale 101² − 99²?'],
      alternativas: ['400', '4', '40 000', '2', '200'],
      datos: [DI.dif],
      solucion: [
        { texto: 'Es una diferencia de cuadrados: suma por diferencia.', ecuacion: ['101² − 99² = (101 + 99)(101 − 99)'] },
        { texto: 'Se hacen las dos cuentas.', ecuacion: ['200 · 2 = ', FO('400')] },
        { texto: ['La ', letra('B'), ' eleva la resta: 2² = 4. La ', letra('C'), ' eleva la suma: 200² = 40 000. La ', letra('D'), ' se queda con la resta, 2, y la ', letra('E'), ' con la suma, 200.'] },
      ],
      respuesta: [letra('A'), ', ', FO('400')] },
  ];

  const identidades = {
    id: 'identidades',
    titulo: 'Productos notables al revés',
    pregunta: '¿Cómo reconoces un producto notable para factorizarlo?',
    temas: ['Factor común e identidades'],
    pieza: 'alg-reparto',
    aprendizaje: 'Una diferencia de cuadrados, un cuadrado perfecto o dos cubos se factorizan leyendo al revés su producto, hasta que cada factor sea primo.',
    actividad: 'Elegir el lado de un piso cuadrado y cuántas tiras comprar para armarlo.',
    // Lee: el piso cuadrado, el cuadrado de un binomio (de Productos notables) y qué mirar. No dice nada de una diferencia
    // de cuadrados ni de cuándo se termina de factorizar (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Un piso cuadrado', texto: 'Rubén tiene 1 loseta y 9 cuadraditos. Quiere un piso cuadrado, con el ancho igual al largo, y puede comprar las tiras que le falten.',
          pieza: 'alg-losetas', dibujo: LO({ objeto: 'pedido', filas: [{ nombre: 'Pedido', cuenta: [1, 0, 9] }] }) },
        { titulo: 'Lo viste en Productos notables', texto: 'El cuadrado de un binomio son cuatro piezas: dos cuadrados y dos rectángulos iguales. Al revés, si reconoces esas piezas, escribes el producto sin buscarlo. Lo mismo con la suma por la diferencia: (a + b)(a − b) = a² − b².',
          ecuacion: ['(a + b)² = a² + 2ab + b²'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir el lado y las tiras. Mira qué lado arman los 9 cuadraditos y cuántas tiras pide ese piso.' },
      ],
    },
    ejemplos: EJEMPLOS_IDENT,
    juega: {
      pieza: 'alg-reparto',
      consigna: 'Rubén tiene 1 loseta y 9 cuadraditos, y quiere un piso cuadrado. Puede comprar tiras.',
      mision: {
        texto: 'Elige el lado y las tiras para usar todo el pedido, sin sobras ni huecos.',
        logrado: v => v.s === 3 && v.t === 6,
        bien: 'Listo: un piso de x + 3 por lado; las 6 tiras son las franjas del medio.',
      },
      voz: 'Primero busca qué lado arman los cuadraditos.',
      leyenda: [
        { s: 'x', t: 'lado de la loseta, en dm' },
        { s: FS('lado'), t: 'el binomio que va al cuadrado' },
        { s: SO('Sobran'), t: 'piezas que no entran' },
        { s: 'Faltan', t: 'huecos: piezas que no hay' },
      ],
      controles: [
        { id: 's', etiqueta: 'Lado: x más', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 't', etiqueta: 'Tiras que compra', min: 0, max: 8, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: v => piso2(v.s, v.t),
      lectura: v => lectura2(v.s, v.t),
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuál es la factorización completa de x⁴ − 16?',
      datos: ['x⁴ es (x²)²', '16 = 4² = 2⁴'],
      voz: 'Piensa qué es x⁴ − 16 y si lo que sale se sigue abriendo.',
      opciones: [
        { id: 'c', texto: '(x² + 4)(x + 2)(x − 2)', correcta: true },
        { id: 'inc', texto: '(x² + 4)(x² − 4)', error: 'TAL-INCOMPLETA', siFuera: 'Bien el primer paso. Pero x² − 4 todavía es un cuadrado menos otro.' },
        { id: 'cuad', texto: '(x² − 4)²', error: 'AL8', siFuera: 'Bien que x⁴ y 16 son cuadrados. Pero (x² − 4)² tiene un −8x² en el medio.' },
        { id: 'pot', texto: '(x − 2)⁴', error: 'AL11', siFuera: 'Bien que x⁴ y 16 son cuartas potencias. Pero (x − 2)⁴ tiene cinco términos.' },
      ],
      dibujo: TB({ columnas: ['', 'es el cuadrado de'], filas: [['x⁴', 'x²'], ['16', '4']], pie: 'factorización completa: ?', alt: 'x a la cuarta es el cuadrado de x al cuadrado y 16 el de 4; la factorización completa, por hallar' }),
      revelar: TB({ columnas: ['paso', 'queda'], filas: [['1', '(x² + 4)(x² − 4)'], ['2', { t: '(x² + 4)(x + 2)(x − 2)', color: 'f', fuerte: true }]], alt: 'Primero (x² + 4)(x² − 4); después x² − 4 se abre en (x + 2)(x − 2)' }),
      coincide: 'Coincide: x⁴ − 16 = (x² + 4)(x² − 4), y x² − 4 se abre otra vez. x² + 4 ya no.',
      noCoincide: 'Revisemos: x⁴ − 16 es un cuadrado menos otro, y lo que sale se sigue abriendo.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: { columnas: ['polinomio', 'factorizado'], filas: [
        [{ t: 'x² + 6x + 9', desde: 1 }, { t: '(x + 3)²', desde: 1, color: 'i' }],
        [{ t: 'x² − 9', desde: 2 }, { t: '(x + 3)(x − 3)', desde: 2 }],
        [{ t: 'x⁴ − 16', desde: 3 }, { t: '(x² + 4)(x² − 4)', desde: 3 }],
        [{ t: '', desde: 4 }, { t: '(x² + 4)(x + 2)(x − 2)', desde: 4, fuerte: true }],
        [{ t: 'x³ + 8', desde: 5 }, { t: '(x + 2)(x² − 2x + 4)', desde: 5 }],
        [{ t: '2x² − 18', desde: 6 }, { t: '2(x + 3)(x − 3)', desde: 6 }],
      ], alt: 'Seis polinomios y su factorización: cuadrado perfecto, diferencia de cuadrados, x⁴ − 16, suma de cubos y factor común' },
      voz: 'Mira qué forma tiene antes de buscar factores.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Dos cuadrados y su doble producto: un binomio al cuadrado.', ecuacion: ['x² + 6x + 9 = ', FS('(x + 3)'), '²'] },
        { estado: { corte: 2 }, texto: 'Un cuadrado menos otro: suma por diferencia.', ecuacion: ['x² − 9 = ', FS('(x + 3)'), FO('(x − 3)')] },
        { estado: { corte: 3 }, texto: 'x⁴ es (x²)² y 16 es 4²: sale una diferencia de cuadrados.', ecuacion: ['x⁴ − 16 = ', FS('(x² + 4)'), FO('(x² − 4)')] },
        { estado: { corte: 4 }, texto: 'x² − 4 todavía se abre; x² + 4 no: es un factor primo.', ecuacion: ['x⁴ − 16 = (x² + 4)(x + 2)(x − 2)'] },
        { estado: { corte: 5 }, texto: 'Dos cubos sumados: su suma por un trinomio.', ecuacion: ['x³ + 8 = ', FS('(x + 2)'), FO('(x² − 2x + 4)')] },
        { estado: { corte: 6 }, texto: 'Con un factor común, sale primero; después se mira lo de adentro.', ecuacion: ['2x² − 18 = 2(x² − 9) = 2(x + 3)(x − 3)'] },
      ],
    },
    regla: {
      texto: 'Se lee al revés el producto notable: un cuadrado menos otro, dos cuadrados con su doble producto, o dos cubos. Se sigue hasta que cada factor sea primo.',
      ecuacion: ['a² − b² = (a + b)(a − b)'],
      condicion: 'ya se sacó el factor común; con coeficientes enteros, a² + b² no se abre.',
      voz: 'Cuando termines, revisa cada factor: ¿se abre otra vez?',
      dibujo: TB({ columnas: ['forma', 'se escribe'], filas: [['a² − b²', { t: '(a + b)(a − b)', fuerte: true }], ['a² ± 2ab + b²', { t: '(a ± b)²', fuerte: true }], ['a³ + b³', { t: '(a + b)(a² − ab + b²)', fuerte: true }], ['a³ − b³', { t: '(a − b)(a² + ab + b²)', fuerte: true }]], alt: 'Cuatro formas y su factorización: diferencia de cuadrados, cuadrado perfecto, suma de cubos y diferencia de cubos' }),
    },
    // Así se resuelve: un trinomio cuadrado perfecto con coeficiente. «Ahora tú» pide una diferencia de cuadrados, un
    // cuadrado perfecto con distractores, cubos y el número de factores primos; sus casos salen de otras semillas.
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        let a, b;   // a y b sin número común: (2x − 4)² no es la factorización completa de 4x² − 16x + 16 (auditoría A1)
        do { a = r.ent(2, 5); b = r.ent(1, 9); } while (mcdN(a, b) !== 1);
        const sg = r.uno([1, -1]), A = `${a}x`, sgn = sg > 0 ? '+' : '−';
        const P = poli([a * a, sg * 2 * a * b, b * b]);
        const tabla = corte => ({ datos: { columnas: ['término', 'es'], filas: [[`${a * a}x²`, { t: `(${A})²`, desde: 1 }], [`${b * b}`, { t: `${b}²`, desde: 1 }], [`${sgn} ${2 * a * b}x`, { t: `${sgn} 2 · ${A} · ${b}`, desde: 2 }]], alt: `Los tres términos de ${P}` }, estado: { corte } });
        return {
          enunciado: [`Factoriza ${P}.`],
          datos: [DI.tcp, DI.dif],
          dibujo: tabla(0),
          pasos: [
            { tipo: 'pide', texto: 'Piden escribirlo como producto.' },
            { tipo: 'datos', texto: `Tiene tres términos, y los extremos, ${a * a}x² y ${b * b}, son cuadrados de algo.` },
            { tipo: 'regla', texto: 'Si los extremos son cuadrados y el del medio es su doble producto, es un binomio al cuadrado.', ecuacion: ['a² ± 2ab + b² = (a ± b)²'] },
            { tipo: 'cuentas', texto: `${a * a}x² es (${A})² y ${b * b} es ${b}². El doble producto es 2 · ${A} · ${b} = ${2 * a * b}x, con signo ${sgn}.`, dibujo: tabla(2) },
            { tipo: 'cuentas', texto: 'Coincide con el del medio: se escribe el binomio al cuadrado.', ecuacion: [`${P} = `, FS(`(${A} ${sgn} ${b})`), '²'] },
            { tipo: 'sentido', texto: `Al multiplicar (${A} ${sgn} ${b})(${A} ${sgn} ${b}) vuelve ${P}.` },
          ],
          respuesta: [FS(`(${A} ${sgn} ${b})`), '²'],
        };
      },
    },
    ahoraTu: {
      voz: 'Mira primero qué forma tiene: ¿cuadrados, cubos, tres términos?',
      generar(sem) {
        const r = azar(sem + 41), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoDifCuad, r);
        if (tipo === 1) return conCuatro(casoTCP, r);
        if (tipo === 2) return conCuatro(casoCubos, r);
        return conCuatro(casoPrimos, r);
      },
    },
  };

  // ---------- El aspa en el cuaderno (pieza alg-tabla): dos filas, una por factor, y las flechas en cruz ----------
  // filas: [[términos con x de cada fila], [números]] ya escritos; vacíos con hueco si se piden. La primera fila es el
  // factor que se saca (turquesa) y la segunda, el otro (violeta); los productos en cruz van en tinta, en la columna
  // «en cruz» (desde: cuándo aparece en «Mira»).
  function aspaT({ a, b, cruz = [null, null], pie, desde = 0, alt }) {
    const cel = (t, c) => (t === '?' ? { t: '?', hueco: true, desde } : { t, color: c, fuerte: true, desde });
    return {
      columnas: ['', '', '', cruz[0] !== null ? 'en cruz' : ''],
      filas: [[cel(a[0], 'i'), '', cel(a[1], 'i'), cruz[1] ? { t: cruz[1], desde } : ''], [cel(b[0], 'f'), '', cel(b[1], 'f'), cruz[0] ? { t: cruz[0], desde } : '']],   // cada producto, en la fila del número por el que se multiplica
      flechas: [{ de: [0, 0], a: [1, 2], desde }, { de: [1, 0], a: [0, 2], desde }],
      ...(pie ? { pie } : {}),
      alt: alt || `Aspa: ${a.join(' y ')} arriba, ${b.join(' y ')} abajo, con los productos en cruz`,
    };
  }

  // ---------- Idea 3: aspa simple ----------
  // Objeto: el pedido de 1 loseta, 7 tiras y 12 cuadraditos para un pasadizo de (x + m) por (x + n) dm (alg-reparto).
  // Cambia: m (de 2 a 4) y n (de 3 a 6). · Permanece: el pedido x² + 7x + 12. · Progresa: lo que sobra o falta. · Se
  // reserva: un primer término con coeficiente (la predicción: 2x² + 7x + 3). · Debe verse: las tiras se reparten entre los
  // dos lados (m + n) y los cuadraditos son m · n; solo (x + 3)(x + 4) usa todo.
  // Errores: TAL-ASPA-CRUCE pone los números en la fila equivocada · TAL-ASPA-PRINC olvida el coeficiente de x² ·
  // TAL-ASPA-EXTREMO parte mal el primer término · TAL-ASPA-SIGNO cambia los signos de los números · TAL-ASPA-MEDIO
  // toma una partición cuyo cruce no da el del medio · TAL-INCOMPLETA se para antes · TAL-PIDE responde otra cosa.
  const PED3 = [1, 7, 12];
  const pasadizo3 = (m, n, juego = true) => RP(Object.assign({ objeto: 'pasadizo', ancho: [1, m], largo: [1, n], pedido: PED3 }, juego ? { tope: [1, 6], topeAncho: [1, 4] } : {}));
  function lectura3(m, n) {
    const ec = [FS(`(x + ${m})`), FO(`(x + ${n})`), ` = ${poli([1, m + n, m * n])}`];
    return m + n === 7 && m * n === 12 ? [...ec, ': el pedido entero'] : [...ec, `; pedido: ${poli(PED3)}`];
  }
  const DA = {
    aspa: 'Aspa: el primer término se parte en dos con x y el último en dos números; cada fila es un factor',
    cruz: 'Los productos en cruz tienen que sumar el término del medio',
    mult: DD.mult,
    signo: 'Dos números de igual signo dan un producto positivo; de distinto signo, negativo',
    aspaY: 'Aspa con dos letras: el primer término se parte en dos términos con x; el último, en dos con y',
  };
  const fac = (p, q) => `(${lin(p, q)})`;
  const fac2 = (p, q, L = 'y') => `(${p === 1 ? '' : p}x ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}${L})`;
  // Ahora tú 1: un factor de un trinomio mónico con los dos números negativos (x − m)(x − n).
  function casoMonico(r) {
    const m = r.ent(2, 7), n = r.ent(m + 1, 9);
    const P = poli([1, -(m + n), m * n]);
    const otro = [...Array(m * n).keys()].map(k => k + 1).find(d => (m * n) % d === 0 && d !== m && d !== n && d + (m * n) / d !== m + n && d < (m * n) / d);
    if (!otro) return null;
    return {
      pregunta: [`¿Cuál de estos binomios es un factor de ${P}?`],
      datos: [DA.aspa, DA.cruz, DA.signo],
      opciones: ops([
        { id: 'c', texto: FS(binx(m)), correcta: true },
        { id: 'signo', texto: FS(binx(-m)), error: 'TAL-ASPA-SIGNO', siFuera: `Bien ${m} · ${n} = ${m * n}. Pero el del medio es negativo: los dos números van con −.` },
        { id: 'medio', texto: FS(binx(-otro)), error: 'TAL-ASPA-MEDIO', siFuera: `Bien que ${otro} divide a ${m * n}. Pero con su pareja, el cruce no da −${f(m + n)}x.` },
        { id: 'signo2', texto: FS(binx(-n)), error: 'TAL-ASPA-SIGNO', siFuera: `Bien ${n}. Pero va con −: con + el del medio saldría positivo.` },
      ]),
      solucion: { texto: `${m * n} = (−${m})(−${n}) y en cruz −${m}x − ${n}x = −${m + n}x: cuadra.`, ecuacion: [`${P} = `, FS(`(${binx(m)})`), FO(`(${binx(n)})`)] },
    };
  }
  // Ahora tú 2: un trinomio con coeficiente principal 2, 3, 5 o 6: (px + q)(rx + s).
  function casoCoef(r) {
    const p = r.uno([2, 3, 5]), rr = 1, q = r.noCero(-5, 5), s = r.noCero(-5, 5);
    if (Math.abs(q) === Math.abs(s) || mcdN(p, q) !== 1) return null;
    const T = mult([p, q], [rr, s]);
    if (T[1] === 0 || (p === 2 && q === 1 && s === 3)) return null;   // la predicción
    const P = poli(T), ok = [FS(fac(p, q)), FO(fac(rr, s))];
    const cruce = poli(mult([p, s], [rr, q]));
    return {
      pregunta: [`¿Cuál es la factorización de ${P}?`],
      datos: [DA.aspa, DA.cruz],
      opciones: ops([
        { id: 'c', texto: ok, correcta: true },
        cruce !== P ? { id: 'cruce', texto: [FS(fac(p, s)), FO(fac(rr, q))], error: 'TAL-ASPA-CRUCE', siFuera: `Bien los números ${f(q)} y ${f(s)}. Pero en esas filas el cruce da ${cruce}.` } : null,
        { id: 'princ', texto: [FS(fac(1, q)), FO(fac(1, s))], error: 'TAL-ASPA-PRINC', siFuera: `Bien los números. Pero así el primer término sería x², no ${pot(`${p}x`, 2).replace(/^(\d+)x²$/, '$1x²')}.` },
        { id: 'signo', texto: [FS(fac(p, -q)), FO(fac(rr, -s))], error: 'TAL-ASPA-SIGNO', siFuera: `Bien los extremos. Pero con esos signos el del medio sale ${poli([-T[1], 0])}.` },
      ]),
      solucion: { texto: `${pot('x', 2).replace('x²', `${p}x²`)} = ${p}x · x y ${f(q * s)} = ${par(q)} · ${par(s)}; en cruz: ${p}x · ${par(s)} + x · ${par(q)} = ${poli([T[1], 0])}.`, ecuacion: [`${P} = `, ...ok] },
    };
  }
  // Ahora tú 3: un trinomio con dos letras, (x + qy)(px + sy): la suma de los dos factores.
  function casoDosY(r) {
    const p = r.uno([1, 2, 3]), q = r.noCero(-4, 4), s = r.noCero(-5, 5);
    if (Math.abs(q) === Math.abs(s) || (p === 1 && q === s) || mcdN(p, s) !== 1) return null;   // px + sy sin número común
    const A = p, B = p * q + s, C = q * s;   // (x + qy)(px + sy) = px² + (pq + s)xy + qsy²
    if (B === 0) return null;
    const P = suma([[A, 2, 0], [B, 1, 1], [C, 0, 2]]);
    const sumaF = (u, v) => suma([[1 + p, 1, 0], [u + v, 0, 1]]);
    const bien = sumaF(q, s);
    return {
      pregunta: [`${P} se factoriza con aspa en dos binomios. ¿Cuánto suman esos dos factores?`],
      datos: [DA.aspaY, DA.cruz],
      opciones: ops([
        { id: 'c', texto: FO(bien), correcta: true },
        { id: 'signo', texto: FO(sumaF(-q, -s)), error: 'TAL-ASPA-SIGNO', siFuera: 'Bien los extremos. Pero con esos signos el del medio cambia de signo.' },
        p !== 1 ? { id: 'cruce', texto: FO(sumaF(s, q)), error: 'TAL-ASPA-CRUCE', siFuera: 'Bien los números. Pero en otras filas el cruce no da el del medio.' } : null,
        { id: 'sinx', texto: FO(suma([[q + s, 0, 1]])), error: 'TAL-PIDE', siFuera: `Bien los términos con y. Pero cada factor también trae su término con x.` },
        { id: 'prod', texto: FO(suma([[p, 1, 0], [q * s, 0, 1]])), error: 'TAL-PIDE', siFuera: `Bien el ${p}x. Pero se suman los dos factores enteros, no se multiplican sus números.` },
      ]),
      solucion: { texto: `${P} = ${fac2(1, q)}${fac2(p, s)}: en cruz, ${p === 1 ? '' : p}x · ${q < 0 ? `(${yT(q)})` : yT(q)} + x · ${s < 0 ? `(${yT(s)})` : yT(s)} = ${suma([[B, 1, 1]])}, el del medio.`, ecuacion: [`${fac2(1, q)} + ${fac2(p, s)} = `, FO(bien)] },
    };
  }
  // Ahora tú 4 (nivel examen): un trinomio en x², x⁴ − (k² − l²)x² − k²l² = (x² − k²)(x² + l²): suma de factores primos.
  function casoBicuad(r) {
    const k = r.ent(1, 5), l = r.ent(1, 4);
    if (k === l) return null;
    const P = poli([1, 0, l * l - k * k, 0, -k * k * l * l]);
    const bien = poli([1, 2, l * l]);                     // (x + k) + (x − k) + (x² + l²)
    return {
      pregunta: [`¿Cuánto suman los factores primos de ${P}?`],
      datos: [DA.aspa, DI.dif, DI.sumaCuad, DI.cuenta],
      opciones: ops([
        { id: 'c', texto: FO(bien), correcta: true },
        { id: 'inc', texto: FO(poli([2, 0, l * l - k * k])), error: 'TAL-INCOMPLETA', siFuera: `Bien (x² − ${k * k})(x² + ${l * l}). Pero x² − ${k * k} todavía se abre.` },
        { id: 'signo', texto: FO(poli([1, 2, -l * l])), error: 'TAL-ASPA-SIGNO', siFuera: `Bien la suma. Pero el ${l * l} va con +: el factor es x² + ${l * l}.` },
        { id: 'abre', texto: FO(poli([4, 0])), error: 'TAL-PRIMO-SUMA', siFuera: `Bien x + ${k} y x − ${k}. Pero x² + ${l * l} no se abre con enteros.` },
      ]),
      solucion: { texto: `En x²: (x² − ${k * k})(x² + ${l * l}); el primero es una diferencia de cuadrados y el segundo ya no se abre.`, ecuacion: [`(x + ${k}) + (x − ${k}) + (x² + ${l * l}) = `, FO(bien)] },
    };
  }

  // Ejemplos de la idea 3. Cuentas rehechas aparte con sympy (cuentas-ejemplos.py). Letras de nivel 3: B, E, A, C, D.
  const EJEMPLOS_ASPA = [
    { nivel: 1, titulo: 'Dos números positivos',
      enunciado: ['Factoriza x² + 5x + 6.'],
      datos: [DA.aspa, DA.cruz],
      figura: TB(aspaT({ a: ['x', '?'], b: ['x', '?'], alt: 'Aspa de x² + 5x + 6 con los dos números por hallar' })),
      solucion: [{ texto: '6 se parte en 2 · 3, y en cruz x · 3 + x · 2 = 5x: cuadra con el del medio.', ecuacion: ['x² + 5x + 6 = ', FS('(x + 2)'), FO('(x + 3)')] }],
      respuesta: [FS('(x + 2)'), FO('(x + 3)')] },
    { nivel: 1, titulo: 'Dos números negativos',
      enunciado: ['Factoriza x² − 8x + 15.'],
      datos: [DA.aspa, DA.cruz, DA.signo],
      solucion: [{ texto: '15 es positivo y −8x negativo: los dos números son negativos. 15 = (−3)(−5) y −3x − 5x = −8x.', ecuacion: ['x² − 8x + 15 = ', FS('(x − 3)'), FO('(x − 5)')] }],
      respuesta: [FS('(x − 3)'), FO('(x − 5)')] },
    { nivel: 1, titulo: 'Un número de cada signo',
      enunciado: ['Factoriza x² + 2x − 15.'],
      datos: [DA.aspa, DA.cruz, DA.signo],
      solucion: [{ texto: '−15 es negativo: un número de cada signo. 5 · (−3) = −15 y 5x − 3x = 2x.', ecuacion: ['x² + 2x − 15 = ', FS('(x + 5)'), FO('(x − 3)')] }],
      respuesta: [FS('(x + 5)'), FO('(x − 3)')] },
    { nivel: 1, titulo: 'El largo del pasadizo',
      enunciado: ['Rubén arma un pasadizo con (x² + 9x + 20) dm² de piezas y un ancho de (x + 4) dm. ¿Cuánto mide el largo?'],
      datos: [DD.piezas, DA.aspa, DA.cruz],
      figura: RP({ objeto: 'pasadizo', ancho: [1, 4], largo: [1, 5], piezas: false, rotuloLargo: '?', sobran: false }),
      solucion: [{ texto: 'El largo es x + n con 4 · n = 20: n = 5. Comprueba el cruce: 4x + 5x = 9x.', ecuacion: ['x² + 9x + 20 = ', FS('(x + 4)'), FO('(x + 5)')] }],
      respuesta: [FO('(x + 5) dm')] },
    { nivel: 1, titulo: '¿Qué partición cuadra?',
      enunciado: ['Para factorizar x² + 7x + 10 se puede partir 10 en 1 · 10 o en 2 · 5. ¿Cuál cuadra?'],
      datos: [DA.aspa, DA.cruz],
      solucion: [
        { texto: 'Con 1 y 10, el cruce da x + 10x = 11x: no es 7x.' },
        { texto: 'Con 2 y 5, da 2x + 5x = 7x: cuadra.', ecuacion: ['x² + 7x + 10 = ', FS('(x + 2)'), FO('(x + 5)')] },
      ],
      respuesta: ['2 · 5: ', FS('(x + 2)'), FO('(x + 5)')] },
    { nivel: 2, titulo: 'Con un 2 adelante',
      enunciado: ['Factoriza 2x² + 5x + 3.'],
      datos: [DA.aspa, DA.cruz],
      figura: TB(aspaT({ a: ['2x', '?'], b: ['x', '?'], alt: 'Aspa de 2x² + 5x + 3: 2x y x a la izquierda, los números por hallar' })),
      solucion: [
        { texto: '2x² = 2x · x y 3 = 3 · 1. Se prueba dónde va cada número.' },
        { texto: '2x · 1 + x · 3 = 5x: cuadra, con el 3 en la fila de 2x.', ecuacion: ['2x² + 5x + 3 = ', FS('(2x + 3)'), FO('(x + 1)')] },
      ],
      respuesta: [FS('(2x + 3)'), FO('(x + 1)')] },
    { nivel: 2, titulo: 'Con un 3 y signos',
      enunciado: ['Factoriza 3x² − 10x − 8.'],
      datos: [DA.aspa, DA.cruz, DA.signo],
      solucion: [
        { texto: '3x² = 3x · x y −8 se parte en dos números de distinto signo.' },
        { texto: 'Con 2 y −4: 3x · (−4) + x · 2 = −12x + 2x = −10x. Cuadra.', ecuacion: ['3x² − 10x − 8 = ', FS('(3x + 2)'), FO('(x − 4)')] },
      ],
      respuesta: [FS('(3x + 2)'), FO('(x − 4)')] },
    { nivel: 2, titulo: 'Los dos con coeficiente',
      enunciado: ['Factoriza 6x² + 7x + 2.'],
      datos: [DA.aspa, DA.cruz],
      solucion: [
        { texto: '6x² puede ser 6x · x o 3x · 2x. Con 6x · x no sale 7x: el cruce da 6x · 2 + x · 1 = 13x o 6x · 1 + x · 2 = 8x.' },
        { texto: 'Con 3x · 2x y 2 · 1: 3x · 1 + 2x · 2 = 7x. Cuadra.', ecuacion: ['6x² + 7x + 2 = ', FS('(3x + 2)'), FO('(2x + 1)')] },
      ],
      respuesta: [FS('(3x + 2)'), FO('(2x + 1)')] },
    { nivel: 2, titulo: 'Con dos letras',
      enunciado: ['Factoriza x² + 5xy + 6y².'],
      datos: [DA.aspa, DA.cruz],
      solucion: [{ texto: 'El último término es 6y² = 2y · 3y, y en cruz x · 3y + x · 2y = 5xy.', ecuacion: ['x² + 5xy + 6y² = ', FS('(x + 2y)'), FO('(x + 3y)')] }],
      respuesta: [FS('(x + 2y)'), FO('(x + 3y)')] },
    { nivel: 2, titulo: 'Los dos con 2x',
      enunciado: ['Factoriza 4x² − 4x − 3.'],
      datos: [DA.aspa, DA.cruz, DA.signo],
      solucion: [
        { texto: '4x² = 2x · 2x y −3 = (−3) · 1.' },
        { texto: 'En cruz: 2x · 1 + 2x · (−3) = 2x − 6x = −4x. Cuadra.', ecuacion: ['4x² − 4x − 3 = ', FS('(2x − 3)'), FO('(2x + 1)')] },
      ],
      respuesta: [FS('(2x − 3)'), FO('(2x + 1)')] },
    { nivel: 3, titulo: 'La suma de los factores',
      enunciado: ['6x² − x − 2 se factoriza con aspa en dos binomios. ¿Cuánto suman esos dos factores?'],
      alternativas: ['5x + 1', '5x − 1', '3', '5x', '−1'],
      datos: [DA.aspa, DA.cruz, DA.signo],
      solucion: [
        { texto: '6x² = 2x · 3x y −2 = 1 · (−2). En cruz: 2x · (−2) + 3x · 1 = −4x + 3x = −x.', ecuacion: ['6x² − x − 2 = ', FS('(2x + 1)'), FO('(3x − 2)')] },
        { texto: 'Se suman los dos factores.', ecuacion: ['(2x + 1) + (3x − 2) = ', FO('5x − 1')] },
        { texto: ['La ', letra('A'), ' cambia los signos de los números: (2x − 1) + (3x + 2). La ', letra('C'), ' suma los coeficientes del trinomio: 6 − 1 − 2.'] },
        { texto: ['La ', letra('D'), ' suma solo los términos con x, y la ', letra('E'), ' solo los números: 1 − 2.'] },
      ],
      respuesta: [letra('B'), ', ', FO('5x − 1')] },
    { nivel: 3, titulo: 'Un trinomio en x²',
      enunciado: ['¿Cuántos factores primos tiene x⁴ − 5x² + 4?'],
      alternativas: ['2', '3', '1', '6', '4'],
      datos: [DA.aspa, DI.dif, DI.cuenta],
      solucion: [
        { texto: 'Se toma x² como un solo término: x⁴ se parte en x² · x² y 4 en (−1)(−4); el cruce da −5x².', ecuacion: ['x⁴ − 5x² + 4 = (x² − 1)(x² − 4)'] },
        { texto: 'Los dos son diferencias de cuadrados.', ecuacion: ['(x² − 1)(x² − 4) = (x + 1)(x − 1)(x + 2)(x − 2)'] },
        { texto: ['La ', letra('A'), ' se para en (x² − 1)(x² − 4). La ', letra('B'), ' abre solo x² − 4. La ', letra('C'), ' cree que no se factoriza.'] },
        { texto: ['La ', letra('D'), ' cuenta x² − 1 y x² − 4 además de los cuatro binomios: 6.'] },
      ],
      respuesta: [letra('E'), ', ', FO('4')] },
    { nivel: 3, titulo: 'El largo con números',
      enunciado: ['Un pasadizo cubre (2x² + 11x + 12) dm² y su ancho es (x + 4) dm. Si la loseta mide x = 5 dm, ¿cuántos dm mide el largo?'],
      alternativas: ['13', '9', '117', '17', '8'],
      datos: [DA.aspa, DA.cruz, DD.valor],
      figura: RP({ objeto: 'pasadizo', ancho: [1, 4], largo: [2, 3], piezas: false, rotuloLargo: '?', sobran: false }),
      solucion: [
        { texto: 'Con ancho x + 4, el largo es 2x + n con 4 · n = 12: n = 3. Cruce: 2x · 4 + x · 3 = 11x.', ecuacion: ['2x² + 11x + 12 = ', FS('(x + 4)'), FO('(2x + 3)')] },
        { texto: 'Con x = 5, el largo vale 2 · 5 + 3.', ecuacion: ['2 · 5 + 3 = ', FO('13')] },
        { texto: ['La ', letra('B'), ' da el ancho: 5 + 4 = 9. La ', letra('C'), ' da el área: 50 + 55 + 12 = 117. La ', letra('E'), ' olvida el 2: 5 + 3 = 8.'] },
        { texto: ['La ', letra('D'), ' toma 11 − 4 = 7 como número del largo: 2 · 5 + 7 = 17.'] },
      ],
      respuesta: [letra('A'), ', ', FO('13 dm')] },
    { nivel: 3, titulo: 'Un factor con dos letras',
      enunciado: ['¿Cuál de estos binomios es un factor de 3x² + 7xy + 2y²?'],
      alternativas: ['3x + 2y', 'x + y', 'x + 2y', '3x − y', 'x − 2y'],
      datos: [DA.aspaY, DA.cruz],
      solucion: [
        { texto: '3x² = 3x · x y 2y² = y · 2y. En cruz: 3x · 2y + x · y = 7xy.', ecuacion: ['3x² + 7xy + 2y² = ', FS('(3x + y)'), FO('(x + 2y)')] },
        { texto: ['La ', letra('A'), ' y la ', letra('B'), ' salen de (3x + 2y)(x + y), que da 3x² + 5xy + 2y².'] },
        { texto: ['La ', letra('D'), ' y la ', letra('E'), ' salen de (3x − y)(x − 2y), que da 3x² − 7xy + 2y².'] },
      ],
      respuesta: [letra('C'), ', ', FO('x + 2y')] },
    { nivel: 3, titulo: 'El número que falta',
      enunciado: ['En x² + ☐x + 24, ¿qué número entero va en el recuadro para que x + 3 sea uno de sus factores?'],
      alternativas: ['8', '27', '72', '11', '5'],
      datos: [DA.aspa, DA.cruz],
      solucion: [
        { texto: 'Si un factor es x + 3, el otro es x + n con 3 · n = 24: n = 8.' },
        { texto: 'El del medio es el cruce.', ecuacion: ['3x + 8x = ', FO('11x')] },
        { texto: ['La ', letra('A'), ' da el otro número, 8. La ', letra('B'), ' suma 3 + 24. La ', letra('C'), ' multiplica 3 · 24. La ', letra('E'), ' resta 8 − 3.'] },
      ],
      respuesta: [letra('D'), ', ', FO('11')] },
  ];

  const aspaSimple = {
    id: 'aspa-simple',
    titulo: 'Aspa simple',
    pregunta: '¿Cómo se factoriza un trinomio que no es cuadrado perfecto?',
    temas: ['Aspa simple, doble y doble especial'],
    pieza: 'alg-reparto',
    aprendizaje: 'Se parten los extremos del trinomio; si los productos en cruz suman el del medio, cada fila del aspa es un factor.',
    actividad: 'Elegir el ancho y el largo de un pasadizo hasta usar todo el pedido.',
    // Lee: el pedido, lo que pide (x + m)(x + n) (de Productos notables) y qué mirar. No dice nada de un primer término con
    // coeficiente (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Otro pedido', texto: 'Rubén tiene 1 loseta, 7 tiras y 12 cuadraditos: (x² + 7x + 12) dm². Quiere un pasadizo de (x + m) dm de ancho y (x + n) dm de largo, sin que sobre ni falte nada.',
          pieza: 'alg-losetas', dibujo: LO({ objeto: 'pedido', filas: [{ nombre: 'Pedido', cuenta: PED3 }] }) },
        { titulo: 'Lo que pide un pasadizo', texto: 'Un pasadizo de (x + m) por (x + n) pide la loseta, m tiras de un lado, n tiras del otro y m · n cuadraditos.',
          ecuacion: ['(x + m)(x + n) = x² + mx + nx + mn'] },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia m y n. Compara las tiras y los cuadraditos que pide cada pasadizo con los del pedido.' },
      ],
    },
    ejemplos: EJEMPLOS_ASPA,
    juega: {
      pieza: 'alg-reparto',
      consigna: 'Rubén tiene (x² + 7x + 12) dm² de piezas para un pasadizo de (x + m) dm por (x + n) dm.',
      mision: {
        texto: 'Usa todo el pedido, sin sobras ni huecos, con el ancho menor que el largo.',
        logrado: v => v.m === 3 && v.n === 4,
        bien: 'Listo: 3 + 4 = 7 tiras y 3 · 4 = 12 cuadraditos.',
      },
      voz: 'Mira cuántas tiras y cuántos cuadraditos pide cada pasadizo.',
      leyenda: [
        { s: 'x', t: 'lado de la loseta, en dm' },
        { s: FS('x + m'), t: 'el ancho: un factor' },
        { s: FO('x + n'), t: 'el largo: el otro factor' },
        { s: SO('Sobran'), t: 'piezas que no entran' },
        { s: 'Faltan', t: 'huecos: piezas que no hay' },
      ],
      controles: [
        { id: 'm', etiqueta: 'm: el ancho es x + m', color: 'c-i', min: 2, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'n', etiqueta: 'n: el largo es x + n', color: 'c-f', min: 3, max: 6, paso: 1, inicio: 5, decimales: 0 },
      ],
      dibujo: v => pasadizo3(v.m, v.n),
      lectura: v => lectura3(v.m, v.n),
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuál es la factorización de 2x² + 7x + 3?',
      datos: ['2x² = 2x · x', '3 = 1 · 3'],
      voz: 'Piensa en qué fila va cada número.',
      opciones: [
        { id: 'c', texto: '(2x + 1)(x + 3)', correcta: true },
        { id: 'cruce', texto: '(2x + 3)(x + 1)', error: 'TAL-ASPA-CRUCE', siFuera: 'Bien 2x · x y 1 · 3. Pero en esas filas el cruce da 2x + 3x = 5x.' },
        { id: 'princ', texto: '(x + 1)(x + 3)', error: 'TAL-ASPA-PRINC', siFuera: 'Bien los números 1 y 3. Pero así el primer término sería x², no 2x².' },
        { id: 'extremo', texto: '(2x + 1)(2x + 3)', error: 'TAL-ASPA-EXTREMO', siFuera: 'Bien los números. Pero 2x · 2x da 4x², no 2x².' },
      ],
      dibujo: TB(aspaT({ a: ['2x', '?'], b: ['x', '?'], alt: 'Aspa de 2x² + 7x + 3: 2x y x a la izquierda; los números por hallar' })),
      revelar: TB(aspaT({ a: ['2x', '1'], b: ['x', '3'], cruz: ['6x', 'x'], pie: '6x + x = 7x', alt: 'Aspa: 2x y 1 arriba, x y 3 abajo; en cruz 6x y x, que suman 7x' })),
      coincide: 'Coincide: con 1 en la fila de 2x, el cruce da 2x · 3 + x · 1 = 7x.',
      noCoincide: 'Revisemos: cada número multiplica en cruz al término con x de la otra fila.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: { columnas: ['', '', '', 'en cruz'], filas: [
        [{ t: 'x', color: 'i', fuerte: true, desde: 1 }, '', { t: '3', color: 'i', fuerte: true, desde: 1 }, { t: '3x', desde: 2 }],
        [{ t: 'x', color: 'f', fuerte: true, desde: 1 }, '', { t: '4', color: 'f', fuerte: true, desde: 1 }, { t: '4x', desde: 2 }],
        [{ t: '2x', color: 'i', fuerte: true, desde: 3 }, '', { t: '1', color: 'i', fuerte: true, desde: 3 }, { t: 'x', desde: 4 }],
        [{ t: 'x', color: 'f', fuerte: true, desde: 3 }, '', { t: '3', color: 'f', fuerte: true, desde: 3 }, { t: '6x', desde: 4 }],
        [{ t: 'x', color: 'i', fuerte: true, desde: 5 }, '', { t: '−4', color: 'i', fuerte: true, desde: 5 }, { t: '−4x', desde: 5 }],
        [{ t: 'x', color: 'f', fuerte: true, desde: 5 }, '', { t: '3', color: 'f', fuerte: true, desde: 5 }, { t: '3x', desde: 5 }],
      ], flechas: [
        { de: [0, 0], a: [1, 2], desde: 2 }, { de: [1, 0], a: [0, 2], desde: 2 },
        { de: [2, 0], a: [3, 2], desde: 4 }, { de: [3, 0], a: [2, 2], desde: 4 },
        { de: [4, 0], a: [5, 2], desde: 5 }, { de: [5, 0], a: [4, 2], desde: 5 },
      ], separador: { fila: 2 }, alt: 'Tres aspas: x² + 7x + 12, 2x² + 7x + 3 y x² − x − 12, con sus productos en cruz' },
      voz: 'Cada fila es un factor; el cruce comprueba.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El pasadizo del juego: cada lado es una fila del aspa.', ecuacion: ['x² + 7x + 12 = ', FS('(x + 3)'), FO('(x + 4)')] },
        { estado: { corte: 2 }, texto: 'En cruz: x · 4 + x · 3 da el del medio.', ecuacion: ['4x + 3x = 7x'] },
        { estado: { corte: 3 }, texto: 'Con 2x² se parte en 2x · x, y el 3 en 1 · 3.', ecuacion: ['2x · x = 2x²;   1 · 3 = 3'] },
        { estado: { corte: 4 }, texto: 'En cruz: 2x · 3 + x · 1 = 7x. Cuadra.', ecuacion: ['2x² + 7x + 3 = ', FS('(2x + 1)'), FO('(x + 3)')] },
        { estado: { corte: 5 }, texto: 'Con signos: −12 = (−4) · 3, y en cruz 3x − 4x = −x.', ecuacion: ['x² − x − 12 = ', FS('(x − 4)'), FO('(x + 3)')] },
        { estado: { corte: 5 }, texto: 'Si una partición no cuadra, se prueba otra.', ecuacion: ['2x · 1 + x · 3 = 5x'] },
      ],
    },
    regla: {
      texto: 'Se parte el primer término en dos con x y el último en dos números. Si los productos en cruz suman el del medio, cada fila es un factor.',
      ecuacion: ['2x² + 7x + 3:   2x · 3 + x · 1 = 7x   →   ', FS('(2x + 1)'), FO('(x + 3)')],
      condicion: 'alguna partición da el término del medio; si ninguna lo da, el trinomio no se factoriza con enteros.',
      voz: 'El signo del último término dice si los números tienen igual signo; el del medio, cuál manda.',
      dibujo: TB(aspaT({ a: ['2x', '1'], b: ['x', '3'], cruz: ['6x', 'x'], pie: '6x + x = 7x', alt: 'Aspa de 2x² + 7x + 3: en cruz 6x y x suman 7x' })),
    },
    // Así se resuelve: un trinomio mónico con un número de cada signo. «Ahora tú» pide un factor con los dos negativos, un
    // primer término con coeficiente, dos letras y un trinomio en x².
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        let m, n;
        do { m = r.ent(2, 9); n = -r.ent(1, 9); } while (m + n === 0 || m === -n);
        const P = poli([1, m + n, m * n]);
        const tabla = conCruz => TB(aspaT({ a: ['x', conCruz ? f(m) : '?'], b: ['x', conCruz ? f(n) : '?'], cruz: conCruz ? [poli([n, 0]), poli([m, 0])] : [null, null], alt: `Aspa de ${P}` }));
        return {
          enunciado: [`Factoriza ${P}.`],
          datos: [DA.aspa, DA.cruz, DA.signo],
          dibujo: tabla(false),
          pasos: [
            { tipo: 'pide', texto: 'Piden escribir el trinomio como producto de dos binomios.' },
            { tipo: 'datos', texto: `El primer término es x² = x · x. El último, ${f(m * n)}, es negativo: los números son de distinto signo.` },
            { tipo: 'regla', texto: 'Aspa: el último se parte en dos números; los productos en cruz tienen que sumar el del medio.' },
            { tipo: 'cuentas', texto: `${f(m * n)} = ${f(m)} · ${par(n)}, y en cruz ${poli([n, 0])} + ${poli([m, 0])} = ${poli([m + n, 0])}: cuadra.`, dibujo: tabla(true) },
            { tipo: 'cuentas', texto: 'Cada fila es un factor.', ecuacion: [`${P} = `, FS(`(${binx(-m)})`), FO(`(${binx(-n)})`)] },
            { tipo: 'sentido', texto: `Al multiplicar vuelve ${P}: ${f(m)} · ${par(n)} = ${f(m * n)} y el cruce da ${poli([m + n, 0])}.` },
          ],
          respuesta: [FS(`(${binx(-m)})`), FO(`(${binx(-n)})`)],
        };
      },
    },
    ahoraTu: {
      voz: 'Parte el último término y prueba el cruce.',
      generar(sem) {
        const r = azar(sem + 51), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoMonico, r);
        if (tipo === 1) return conCuatro(casoCoef, r);
        if (tipo === 2) return conCuatro(casoDosY, r);
        return conCuatro(casoBicuad, r);
      },
    },
  };

  // ---------- Idea 4: aspa doble y doble especial ----------
  // Objeto: el terreno partido en nueve parcelas (Lee, alg-baldosas) y la hoja del cuaderno de Rubén con las tres columnas
  // del aspa doble (juego, alg-tabla). Cambia: cómo se parten 3y² y 6 entre las dos filas. · Permanece: 2x² = 2x · x y el
  // polinomio 2x² + 7xy + 3y² + 7x + 11y + 6. · Progresa: lo que dan las tres aspas. · Se reserva: la doble especial (la
  // predicción: lo que falta en x² de x⁴ + 5x³ + 9x² + 7x + 2). · Debe verse: cada aspa comprueba un término; solo una
  // partición cuadra con las tres.
  // Errores: TAL-DE-TODO pone el término entero en la columna del medio · TAL-DE-SUMA suma el cruce de los extremos ·
  // TAL-DE-CRUCE pone lo que ya dieron los extremos · TAL-DOBLE-NUM cambia los números de fila · TAL-DOBLE-SIGNO cambia
  // el signo de los términos en y · TAL-DOBLE-PRINC parte mal el primer término · TAL-INCOMPLETA se para antes ·
  // TAL-PRIMO-SUMA abre un factor que no se abre · TAL-PRIMO-REPITE cuenta un factor repetido.
  const PJ4 = '2x² + 7xy + 3y² + 7x + 11y + 6';
  const YS = { '1-3': [1, 3], '3-1': [3, 1] }, NS = { '1-6': [1, 6], '6-1': [6, 1], '2-3': [2, 3], '3-2': [3, 2] };
  // Las tres aspas de (2x + p·y + m)(x + q·y + n): x–y da (2q + p)xy, y–número da (pn + qm)y y x–número da (2n + m)x.
  const aspas4 = v => { const [p, q] = YS[v.ys], [m, n] = NS[v.ns]; return { p, q, m, n, xy: 2 * q + p, y: p * n + q * m, x: 2 * n + m }; };
  const yT = c => (c === 1 ? 'y' : c === -1 ? '−y' : `${f(c)}y`);
  function cuaderno4(v, cruzOk = true) {
    const a = aspas4(v), ok = (t, bien) => ({ t, fuerte: true, marca: cruzOk ? (bien ? 'ok' : 'no') : undefined });
    return TB({ columnas: ['x', '', 'y', '', 'número'], rotulosFila: ['', '', 'cruce'], filas: [
      [{ t: '2x', color: 'i', fuerte: true }, '', { t: yT(a.p), color: 'i', fuerte: true }, '', { t: f(a.m), color: 'i', fuerte: true }],
      [{ t: 'x', color: 'f', fuerte: true }, '', { t: yT(a.q), color: 'f', fuerte: true }, '', { t: f(a.n), color: 'f', fuerte: true }],
      ['', ok(`${a.xy}xy`, a.xy === 7), '', ok(`${a.y}y`, a.y === 11), ''],
    ], flechas: [{ de: [0, 0], a: [1, 2] }, { de: [1, 0], a: [0, 2] }, { de: [0, 2], a: [1, 4] }, { de: [1, 2], a: [0, 4] }],
    pie: `x con número: 2x · ${a.n} + x · ${a.m} = ${a.x}x ${a.x === 7 ? '✓' : '✗'}`,
    alt: `Aspa doble de ${PJ4}: filas 2x, ${yT(a.p)}, ${a.m} y x, ${yT(a.q)}, ${a.n}; las aspas dan ${a.xy}xy, ${a.y}y y ${a.x}x` });
  }
  // La tabla de la doble especial: columnas x², x y número; la del medio, con «?» si se pide.
  function especialT({ fil, falta, desde = 0, pie, alt }) {
    const c = (t, col) => (t === '?' ? { t: '?', hueco: true, desde } : { t, color: col, fuerte: true, desde });
    return { columnas: ['x²', '', 'x', '', 'número'], filas: [[c('x²', 'i'), '', c(fil[0][0], 'i'), '', c(fil[0][1], 'i')], [c('x²', 'f'), '', c(fil[1][0], 'f'), '', c(fil[1][1], 'f')]],
      flechas: [{ de: [0, 0], a: [1, 4], desde }, { de: [1, 0], a: [0, 4], desde }], ...(pie ? { pie } : {}), alt: alt || `Aspa doble especial; falta ${falta || '?'} en x²` };
  }
  const DB = {
    doble: 'Aspa doble: columnas x, y y número; las aspas x–y, y–número y x–número dan los tres términos del medio',
    especial: 'Doble especial: lo que falta en x² es el término en x² menos el cruce de los extremos',
    orden: 'El polinomio va ordenado: x⁴, x³, x², x y número; un término que falta va con 0',
    aspa: DA.aspa,
  };
  // Un trinomio en x y y con su número: [a, b, c] → «ax + by + c».
  const tri3 = ([a, b, c]) => suma([[a, 1, 0], [b, 0, 1], [c, 0, 0]]);
  const prod3 = (F, G) => {   // (a x + b y + c)(d x + e y + g) → [x², xy, y², x, y, número]
    const [a, b, c] = F, [d, e, g] = G;
    return [a * d, a * e + b * d, b * e, a * g + c * d, b * g + c * e, c * g];
  };
  const seis = T => suma([[T[0], 2, 0], [T[1], 1, 1], [T[2], 0, 2], [T[3], 1, 0], [T[4], 0, 1], [T[5], 0, 0]]);
  function dosFactores(r) {
    let F, G;
    do { F = [r.uno([1, 2, 3]), r.noCero(-3, 3), r.noCero(-4, 4)]; G = [1, r.noCero(-3, 3), r.noCero(-4, 4)]; }
    while (prod3(F, G).some(v => v === 0) || mcdN(mcdN(F[0], F[1]), F[2]) !== 1 || (F[1] === G[1] && F[2] === G[2] && F[0] === 1) || Math.abs(F[2]) === Math.abs(G[2]));
    return [F, G];
  }
  // Ahora tú 1: un factor del aspa doble (una sola de las opciones lo es).
  function casoDobleFactor(r) {
    const [F, G] = dosFactores(r), T = prod3(F, G), P = seis(T);
    const cambiaNum = [F[0], F[1], G[2]], cambiaY = [F[0], -F[1], F[2]], otraFila = [G[0], G[1], F[2]];
    const esFactor = H => { const ks = [[H, G], [H, F]]; return [F, G].some(K => tri3(K) === tri3(H)); };
    if ([cambiaNum, cambiaY, otraFila].some(esFactor)) return null;
    return {
      pregunta: [`¿Cuál de estos trinomios es un factor de ${P}?`],
      datos: [DB.doble],
      opciones: ops([
        { id: 'c', texto: FS(tri3(F)), correcta: true },
        { id: 'num', texto: FS(tri3(cambiaNum)), error: 'TAL-DOBLE-NUM', siFuera: `Bien ${tri3(F).split(' ').slice(0, 3).join(' ')}. Pero con ese número el aspa x–número no da ${poli([T[3], 0])}.` },
        { id: 'y', texto: FS(tri3(cambiaY)), error: 'TAL-DOBLE-SIGNO', siFuera: `Bien los términos en x y el número. Pero con ese signo el aspa x–y no da ${suma([[T[1], 1, 1]])}.` },
        { id: 'fila', texto: FS(tri3(otraFila)), error: 'TAL-DOBLE-PRINC', siFuera: `Bien el número ${f(F[2])}. Pero va en la fila de ${pot(F[0] === 1 ? 'x' : `${F[0]}x`, 1)}, con sus términos.` },
      ]),
      solucion: { texto: 'Las tres aspas cuadran con estas dos filas.', ecuacion: [`${P} = `, FS(`(${tri3(F)})`), FO(`(${tri3(G)})`)] },
    };
  }
  // Ahora tú 2: la suma de los dos factores del aspa doble.
  function casoDobleSuma(r) {
    const [F, G] = dosFactores(r), T = prod3(F, G), P = seis(T);
    const S = (A, B) => tri3([A[0] + B[0], A[1] + B[1], A[2] + B[2]]);
    const bien = S(F, G);
    return {
      pregunta: [`${P} se factoriza con aspa doble en dos trinomios. ¿Cuánto suman esos dos factores?`],
      datos: [DB.doble],
      opciones: ops([
        { id: 'c', texto: FO(bien), correcta: true },
        { id: 'num', texto: FO(S([F[0], F[1], -F[2]], [G[0], G[1], -G[2]])), error: 'TAL-DOBLE-SIGNO', siFuera: 'Bien los términos con letras. Pero los números van con el signo que pide el último término.' },
        { id: 'y', texto: FO(S([F[0], -F[1], F[2]], [G[0], -G[1], G[2]])), error: 'TAL-DOBLE-SIGNO', siFuera: 'Bien los términos con x. Pero los de y llevan el signo que pide el aspa x–y.' },
        { id: 'prod', texto: FO(tri3([F[0] * G[0], F[1] * G[1], F[2] * G[2]])), error: 'TAL-PIDE', siFuera: 'Bien las dos filas. Pero se suman los factores, no se multiplican columna por columna.' },
      ]),
      solucion: { texto: `Las filas son ${tri3(F)} y ${tri3(G)}: las tres aspas cuadran.`, ecuacion: [`(${tri3(F)}) + (${tri3(G)}) = `, FO(bien)] },
    };
  }
  // Ahora tú 3: lo que falta en x² en la doble especial de (x² + a x + b)(x² + c x + d).
  function casoFalta(r) {
    const a = r.noCero(-4, 4), b = r.noCero(-4, 4), c = r.noCero(-4, 4), d = r.noCero(-5, 5);
    const T = mult([1, a, b], [1, c, d]), cruce = b + d, falta = a * c;
    if (Math.abs(falta) < 2 || falta === T[2] || cruce === 0 || falta === cruce || T.some(v => v === 0) || (a === 2 && b === 1 && c === 3 && d === 2)) return null;
    const P = poli(T), xx = k => poli([k, 0, 0]);
    return {
      pregunta: [`En el aspa doble especial de ${P}, los extremos se parten en x² · x² y ${f(b)} · ${par(d)}. ¿Qué término en x² tiene que poner la columna del medio?`],
      datos: [DB.especial, DB.orden],
      opciones: ops([
        { id: 'c', texto: FO(xx(falta)), correcta: true },
        { id: 'todo', texto: FO(xx(T[2])), error: 'TAL-DE-TODO', siFuera: `Bien el término en x² de P. Pero los extremos ya dan ${xx(cruce)}: va solo lo que falta.` },
        { id: 'suma', texto: FO(xx(T[2] + cruce)), error: 'TAL-DE-SUMA', siFuera: `Bien el cruce de los extremos, ${xx(cruce)}. Pero se resta, no se suma.` },
        { id: 'cruce', texto: FO(xx(cruce)), error: 'TAL-DE-CRUCE', siFuera: `Bien x² · ${par(d)} + ${par(b)} · x². Pero eso es lo que ya está; falta el resto.` },
      ]),
      solucion: { texto: `Los extremos dan x² · ${par(d)} + ${par(b)} · x² = ${xx(cruce)}. Lo que falta es la resta.`, ecuacion: [`${xx(T[2])} − ${cruce < 0 ? `(${xx(cruce)})` : xx(cruce)} = `, FO(xx(falta))] },
    };
  }
  // Ahora tú 4 (nivel examen): la suma de los factores primos de (x + p)(x + q)(x² + c x + d), con x² + c x + d primo.
  function casoEspecialPrimos(r) {
    const p = r.noCero(-4, 4), q = r.noCero(-4, 4), c = r.ent(-3, 3), d = r.ent(2, 6);
    if (p === q || c * c - 4 * d >= 0) return null;   // x² + cx + d no se abre (sin números que lo anulen)
    const A = mult([1, p], [1, q]), T = mult(A, [1, c, d]);
    if (T.some(v => v === 0)) return null;
    const P = poli(T), bien = poli([1, c + 2, p + q + d]);
    return {
      pregunta: [`¿Cuánto suman los factores primos de ${P}?`],
      datos: [DB.especial, DA.aspa, DI.cuenta],
      opciones: ops([
        { id: 'c', texto: FO(bien), correcta: true },
        { id: 'inc', texto: FO(poli([2, A[1] + c, A[2] + d])), error: 'TAL-INCOMPLETA', siFuera: `Bien (${poli(A)})(${poli([1, c, d])}). Pero ${poli(A)} todavía se abre con aspa simple.` },
        { id: 'binos', texto: FO(poli([2, p + q])), error: 'TAL-PIDE', siFuera: `Bien x ${conSigno(p)} y x ${conSigno(q)}. Pero ${poli([1, c, d])} también es un factor primo.` },
        { id: 'signo', texto: FO(poli([1, c + 2, -(p + q) + d])), error: 'TAL-ASPA-SIGNO', siFuera: `Bien ${poli([1, c, d])}. Pero los binomios son ${binx(-p)} y ${binx(-q)}.` },
      ]),
      solucion: { texto: `Sale (${poli(A)})(${poli([1, c, d])}); el primero se abre con aspa simple y el segundo no.`, ecuacion: [`(${binx(-p)}) + (${binx(-q)}) + (${poli([1, c, d])}) = `, FO(bien)] },
    };
  }

  // Ejemplos de la idea 4. Cuentas rehechas aparte con sympy (cuentas-ejemplos.py). Letras de nivel 3: C, A, E, B, D.
  const EJEMPLOS_DOBLE = [
    { nivel: 1, titulo: 'Tres columnas',
      enunciado: ['Factoriza x² + 3xy + 2y² + 4x + 5y + 3.'],
      datos: [DB.doble],
      solucion: [
        { texto: 'x² = x · x, 2y² = y · 2y y 3 = 1 · 3. Aspa x–y: 2xy + xy = 3xy. Aspa y–número: 3y + 2y = 5y.' },
        { texto: 'Aspa x–número: 3x + x = 4x. Cuadran las tres.', ecuacion: [FS('(x + y + 1)'), FO('(x + 2y + 3)')] },
      ],
      respuesta: [FS('(x + y + 1)'), FO('(x + 2y + 3)')] },
    { nivel: 1, titulo: 'Comprobar un aspa',
      enunciado: ['En el aspa doble de x² + 5xy + 6y² + 3x + 7y + 2 se usan las filas x + 2y + 1 y x + 3y + 2. ¿Qué da el aspa y–número?'],
      datos: [DB.doble],
      solucion: [{ texto: 'Se cruzan los términos en y con los números de la otra fila.', ecuacion: ['2y · 2 + 3y · 1 = 4y + 3y = 7y'] }],
      respuesta: ['7y, el término en y del polinomio'] },
    { nivel: 1, titulo: 'Lo que falta en x²',
      enunciado: ['En la doble especial de x⁴ + 4x³ + 6x² + 5x + 2, los extremos se parten en x² · x² y 1 · 2. ¿Qué término en x² pone la columna del medio?'],
      datos: [DB.especial],
      figura: TB(especialT({ fil: [['?', '1'], ['?', '2']], alt: 'Doble especial con 1 y 2 de números y la columna del medio por hallar' })),
      solucion: [
        { texto: 'Los extremos dan x² · 2 + 1 · x² = 3x².' },
        { texto: 'El polinomio tiene 6x²: falta la resta.', ecuacion: ['6x² − 3x² = ', FO('3x²')] },
      ],
      respuesta: [FO('3x²')] },
    { nivel: 1, titulo: 'Dos filas iguales',
      enunciado: ['Factoriza x² + 2xy + y² + 3x + 3y + 2.'],
      datos: [DB.doble],
      solucion: [
        { texto: 'x² = x · x, y² = y · y y 2 = 1 · 2. Aspa x–y: xy + xy = 2xy. Aspa y–número: 2y + y = 3y; aspa x–número: 2x + x = 3x.' },
        { texto: 'Las tres cuadran.', ecuacion: [FS('(x + y + 1)'), FO('(x + y + 2)')] },
      ],
      respuesta: [FS('(x + y + 1)'), FO('(x + y + 2)')] },
    { nivel: 1, titulo: 'Un 0 en su columna',
      enunciado: ['Antes de la doble especial, ¿cómo se ordena x⁴ + 2x² + 9 en sus cinco columnas?'],
      datos: [DB.orden],
      solucion: [{ texto: 'Faltan x³ y x: van con 0, para que cada término quede en su columna.', ecuacion: ['x⁴ + 0x³ + 2x² + 0x + 9'] }],
      respuesta: ['x⁴ + 0x³ + 2x² + 0x + 9'] },
    { nivel: 2, titulo: 'Con signos',
      enunciado: ['Factoriza 2x² − xy − y² + 5x + y + 2.'],
      datos: [DB.doble, DA.signo],
      solucion: [
        { texto: '2x² = 2x · x, −y² = y · (−y), 2 = 1 · 2. Aspa x–y: −2xy + xy = −xy. Aspa y–número: 2y − y = y.' },
        { texto: 'Aspa x–número: 4x + x = 5x. Cuadran.', ecuacion: [FS('(2x + y + 1)'), FO('(x − y + 2)')] },
      ],
      respuesta: [FS('(2x + y + 1)'), FO('(x − y + 2)')] },
    { nivel: 2, titulo: 'Un cuadrado de cuarto grado',
      enunciado: ['Factoriza x⁴ + 2x³ + 3x² + 2x + 1.'],
      datos: [DB.especial, DB.orden],
      solucion: [
        { texto: 'Extremos: x² · x² y 1 · 1; su cruce da 2x². Falta 3x² − 2x² = x², que se parte en x · x.' },
        { texto: 'Con x en las dos filas, el x³ da 2x³ y el x da 2x: cuadra. Las dos filas son iguales.', ecuacion: [FS('(x² + x + 1)'), '²'] },
      ],
      respuesta: [FS('(x² + x + 1)'), '²'] },
    { nivel: 2, titulo: 'Sin término en x²',
      enunciado: ['Factoriza x⁴ − x³ + 5x − 3.'],
      datos: [DB.especial, DB.orden],
      figura: TB(especialT({ fil: [['?', '−1'], ['?', '3']], falta: '?', alt: 'Doble especial de x⁴ − x³ + 5x − 3: x² y −1 en la primera fila, x² y 3 en la segunda; la columna del medio, por hallar' })),
      solucion: [
        { texto: 'Se escribe 0x². Los extremos: x⁴ = x² · x² y −3 = (−1) · 3; la primera fila lleva −1 y la segunda, 3. Su cruce da x² · 3 + (−1) · x² = 2x².' },
        { texto: 'Falta 0 − 2x² = −2x², partido en x · (−2x): x en la primera fila y −2x en la segunda.' },
        { texto: 'Con x y −2x: el x³ da −2x³ + x³ = −x³ y el x da 3x + 2x = 5x. Cuadra.', ecuacion: ['x⁴ − x³ + 5x − 3 = ', FS('(x² + x − 1)'), FO('(x² − 2x + 3)')] },
      ],
      respuesta: [FS('(x² + x − 1)'), FO('(x² − 2x + 3)')] },
    { nivel: 2, titulo: 'La suma de los dos factores',
      enunciado: ['3x² + 7xy + 2y² + 5x + 5y + 2 se factoriza con aspa doble. ¿Cuánto suman sus dos factores?'],
      datos: [DB.doble],
      solucion: [
        { texto: 'Filas 3x + y + 2 y x + 2y + 1: aspa x–y 6xy + xy = 7xy; y–número y + 4y = 5y; x–número 3x + 2x = 5x.', ecuacion: [FS('(3x + y + 2)'), FO('(x + 2y + 1)')] },
        { texto: 'Se suman los dos factores: 3x + y + 2 más x + 2y + 1.', ecuacion: [FO('4x + 3y + 3')] },
      ],
      respuesta: [FO('4x + 3y + 3')] },
    { nivel: 2, titulo: 'Después, el aspa simple',
      enunciado: ['Factoriza por completo x⁴ + 6x³ + 14x² + 15x + 6.'],
      datos: [DB.especial, DA.aspa],
      solucion: [
        { texto: 'Extremos: x² · 3 + 2 · x² = 5x². Falta 14x² − 5x² = 9x² = 3x · 3x.', ecuacion: ['(x² + 3x + 2)(x² + 3x + 3)'] },
        { texto: 'x² + 3x + 2 todavía se abre con aspa simple; x² + 3x + 3 no.', ecuacion: ['x² + 3x + 2 = ', FS('(x + 1)'), FO('(x + 2)')] },
      ],
      respuesta: [FS('(x + 1)'), FO('(x + 2)'), '(x² + 3x + 3)'] },
    { nivel: 3, titulo: 'Lo que falta, con signos',
      enunciado: ['En la doble especial de x⁴ + 3x³ − 3x + 1, los extremos se parten en x² · x² y (−1) · (−1). ¿Qué término en x² pone la columna del medio?'],
      alternativas: ['−2x²', '0', '2x²', '−x²', '3x²'],
      datos: [DB.especial, DB.orden],
      solucion: [
        { texto: 'No hay término en x²: es 0x². Los extremos dan su cruce:', ecuacion: ['x² · (−1) + (−1) · x² = −2x²'] },
        { texto: 'Falta la resta.', ecuacion: ['0 − (−2x²) = ', FO('2x²')] },
        { texto: ['La ', letra('A'), ' pone el cruce, −2x², lo que ya dieron los extremos. La ', letra('B'), ' cree que no falta nada porque no hay x².'] },
        { texto: ['La ', letra('D'), ' toma un solo producto en cruz, −x². La ', letra('E'), ' copia el 3 del término en x³.'] },
      ],
      respuesta: [letra('C'), ', ', FO('2x²')] },
    { nivel: 3, titulo: 'Suma de los factores primos',
      enunciado: ['¿Cuánto suman los factores primos de x⁴ + 5x³ + 8x² + 7x + 3?'],
      alternativas: ['x² + 3x + 5', '2x² + 5x + 4', '2x + 4', 'x² + x + 1', 'x⁴ + 5x³ + 8x² + 7x + 3'],
      datos: [DB.especial, DA.aspa, DI.cuenta],
      solucion: [
        { texto: 'Extremos: x² · 1 + 3 · x² = 4x²; falta 8x² − 4x² = 4x² = 4x · x.', ecuacion: ['(x² + 4x + 3)(x² + x + 1)'] },
        { texto: 'x² + 4x + 3 = (x + 1)(x + 3); x² + x + 1 no se abre. Se suman x + 1, x + 3 y x² + x + 1.', ecuacion: [FO('x² + 3x + 5')] },
        { texto: ['La ', letra('B'), ' se para en los dos trinomios. La ', letra('C'), ' suma solo los binomios. La ', letra('D'), ' da solo el trinomio primo.'] },
        { texto: ['La ', letra('E'), ' es el polinomio sin factorizar.'] },
      ],
      respuesta: [letra('A'), ', ', FO('x² + 3x + 5')] },
    { nivel: 3, titulo: 'Un factor del aspa doble',
      enunciado: ['¿Cuál de estos trinomios es un factor de 6x² + 5xy + y² + 7x + 3y + 2?'],
      alternativas: ['2x + y + 2', '3x + y + 1', '2x − y + 1', '6x + y + 2', '3x + y + 2'],
      datos: [DB.doble],
      solucion: [
        { texto: 'Filas 2x + y + 1 y 3x + y + 2: aspa x–y 2xy + 3xy = 5xy; y–número 2y + y = 3y; x–número 4x + 3x = 7x.', ecuacion: [FS('(2x + y + 1)'), FO('(3x + y + 2)')] },
        { texto: ['La ', letra('A'), ' y la ', letra('B'), ' cambian los números de fila: el aspa x–número daría 2x + 6x = 8x.'] },
        { texto: ['La ', letra('C'), ' cambia el signo de y: el aspa x–y daría −5xy. La ', letra('D'), ' parte 6x² en 6x · x: el aspa x–y daría 7xy.'] },
      ],
      respuesta: [letra('E'), ', ', FO('3x + y + 2')] },
    { nivel: 3, titulo: 'El valor de un factor',
      enunciado: ['x² + 4xy + 3y² + 2x + 4y + 1 se factoriza con aspa doble. Si x = 2 e y = 1, ¿cuánto vale el factor que lleva 3y?'],
      alternativas: ['4', '6', '24', '8', '5'],
      datos: [DB.doble, DD.valor],
      solucion: [
        { texto: 'Filas x + y + 1 y x + 3y + 1: aspa x–y 3xy + xy = 4xy; y–número y + 3y = 4y; x–número x + x = 2x.', ecuacion: [FS('(x + y + 1)'), FO('(x + 3y + 1)')] },
        { texto: 'Con x = 2 e y = 1:', ecuacion: ['2 + 3 · 1 + 1 = ', FO('6')] },
        { texto: ['La ', letra('A'), ' da el otro factor: 2 + 1 + 1 = 4. La ', letra('C'), ' da el polinomio: 4 · 6 = 24.'] },
        { texto: ['La ', letra('D'), ' cambia x por y: 1 + 3 · 2 + 1 = 8. La ', letra('E'), ' olvida el número 1: 2 + 3 = 5.'] },
      ],
      respuesta: [letra('B'), ', ', FO('6')] },
    { nivel: 3, titulo: 'Factores primos de cuarto grado',
      enunciado: ['¿Cuántos factores primos tiene x⁴ + 4x³ + 8x² + 8x + 3?'],
      alternativas: ['3', '4', '1', '2', '5'],
      datos: [DB.especial, DA.aspa, DI.cuenta],
      solucion: [
        { texto: 'Extremos: x² · 3 + 1 · x² = 4x²; falta 4x² = 2x · 2x.', ecuacion: ['(x² + 2x + 1)(x² + 2x + 3)'] },
        { texto: 'x² + 2x + 1 = (x + 1)²; x² + 2x + 3 no se abre (con 1 · 3 el cruce da 4x). Son dos factores primos distintos.' },
        { texto: ['La ', letra('A'), ' cuenta x + 1 dos veces. La ', letra('B'), ' abre también x² + 2x + 3. La ', letra('C'), ' cree que no se factoriza.'] },
        { texto: ['La ', letra('E'), ' cuenta los términos del polinomio.'] },
      ],
      respuesta: [letra('D'), ', ', FO('2')] },
  ];

  const aspaDoble = {
    id: 'aspa-doble',
    titulo: 'Aspa doble y doble especial',
    pregunta: '¿Qué se hace con seis términos, o con cuarto grado?',
    temas: ['Aspa simple, doble y doble especial'],
    pieza: 'alg-tabla',
    aprendizaje: 'Con seis términos en x e y, tres aspas comprueban los del medio; en cuarto grado, la columna del medio completa el x².',
    actividad: 'Elegir los términos de dos filas hasta que las tres aspas cuadren.',
    // Lee: el terreno en nueve parcelas (de dónde salen seis términos), las tres columnas y qué mirar. No habla de la doble
    // especial ni de lo que falta en x² (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Un terreno en nueve parcelas', texto: 'Un terreno de (x + 2y + 1) m por (x + y + 2) m se parte en nueve parcelas. Al juntar sus áreas salen seis términos, con x, con y y un número.',
          pieza: 'alg-baldosas', dibujo: { pieza: 'alg-baldosas', datos: {
            anchos: [{ t: 'x', v: 5, color: 'i' }, { t: '2y', v: 4, color: 'i' }, { t: '1', v: 1, color: 'i' }],
            altos: [{ t: 'x', v: 5, color: 'f' }, { t: 'y', v: 2, color: 'f' }, { t: '2', v: 2, color: 'f' }],
            celdas: [[{ t: 'x²' }, { t: '2xy' }, { t: 'x' }], [{ t: 'xy' }, { t: '2y²' }, { t: 'y' }], [{ t: '2x' }, { t: '4y' }, { t: '2' }]],
            total: { t: 'x² + 3xy + 2y² + 3x + 5y + 2' }, alt: 'Terreno de x + 2y + 1 por x + y + 2 partido en nueve parcelas' }, estado: {} } },
        { titulo: 'Tres columnas', texto: 'Para volver de los seis términos a los dos lados, cada lado se escribe en una fila con tres columnas: la de x, la de y y la del número.',
          ecuacion: ['x² + 3xy + 2y² + 3x + 5y + 2 = ', FS('(x + 2y + 1)'), FO('(x + y + 2)')] },
        { titulo: 'Qué mirar al jugar', texto: 'Cada par de columnas vecinas hace un aspa, y los extremos hacen otra. Mira qué término del polinomio comprueba cada una.' },
      ],
    },
    ejemplos: EJEMPLOS_DOBLE,
    juega: {
      pieza: 'alg-tabla',
      consigna: `En el cuaderno, Rubén factoriza ${PJ4} con dos filas. La primera empieza con 2x y la segunda con x.`,
      mision: {
        texto: 'Elige los términos en y y los números para que las tres aspas cuadren.',
        logrado: v => v.ys === '1-3' && v.ns === '3-2',
        bien: 'Listo: las tres aspas dan 7xy, 11y y 7x, los términos del medio.',
      },
      voz: 'Cambia una cosa a la vez y mira qué aspa se arregla.',
      leyenda: [
        { s: 'x, y', t: 'las dos letras' },
        { s: FS('arriba'), t: 'la fila del primer factor' },
        { s: FO('abajo'), t: 'la fila del segundo factor' },
        { s: '✓', t: 'el aspa da el término del polinomio' },
      ],
      controles: [
        { id: 'ys', etiqueta: 'Términos en y', opciones: [{ valor: '3-1', texto: '3y arriba, y abajo' }, { valor: '1-3', texto: 'y arriba, 3y abajo' }] },
        { id: 'ns', etiqueta: 'Números', opciones: [{ valor: '1-6', texto: '1 y 6' }, { valor: '6-1', texto: '6 y 1' }, { valor: '2-3', texto: '2 y 3' }, { valor: '3-2', texto: '3 y 2' }] },
      ],
      dibujo: v => cuaderno4(v),
      lectura: v => { const a = aspas4(v); return [`aspas: ${a.xy}xy, ${a.y}y y ${a.x}x; el polinomio pide 7xy, 11y y 7x`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'En el aspa doble especial de x⁴ + 5x³ + 9x² + 7x + 2, los extremos se parten en x² · x² y 1 · 2. ¿Qué término en x² tiene que poner la columna del medio?',
      datos: ['x⁴ = x² · x²', '2 = 1 · 2', 'El término en x² de P es 9x²'],
      voz: 'Piensa cuánto del 9x² ya ponen los extremos.',
      opciones: [
        { id: 'c', texto: '6x²', correcta: true },
        { id: 'todo', texto: '9x²', error: 'TAL-DE-TODO', siFuera: 'Bien que la columna del medio aporta x². Pero los extremos ya ponen una parte.' },
        { id: 'suma', texto: '12x²', error: 'TAL-DE-SUMA', siFuera: 'Bien lo que dan los extremos. Pero se resta del 9x², no se suma.' },
        { id: 'cruce', texto: '3x²', error: 'TAL-DE-CRUCE', siFuera: 'Bien 2x² + x². Pero eso ya lo ponen los extremos; falta lo demás.' },
      ],
      dibujo: TB(especialT({ fil: [['?', '1'], ['?', '2']], pie: 'falta en x²: ?', alt: 'Doble especial de x⁴ + 5x³ + 9x² + 7x + 2: números 1 y 2; la columna del medio por hallar' })),
      revelar: TB(especialT({ fil: [['2x', '1'], ['3x', '2']], falta: '6x²', pie: '9x² − 3x² = 6x² = 2x · 3x', alt: 'Doble especial: falta 6x², que se parte en 2x y 3x' })),
      coincide: 'Coincide: los extremos dan 3x²; falta 9x² − 3x² = 6x², que se parte en 2x · 3x.',
      noCoincide: 'Revisemos: del 9x², los extremos ya ponen x² · 2 + 1 · x² = 3x².',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: { columnas: null, filas: [
        [{ t: 'x', desde: 1 }, '', { t: 'y', desde: 1 }, '', { t: 'número', desde: 1 }],
        [{ t: '2x', color: 'i', fuerte: true, desde: 1 }, '', { t: 'y', color: 'i', fuerte: true, desde: 1 }, '', { t: '3', color: 'i', fuerte: true, desde: 1 }],
        [{ t: 'x', color: 'f', fuerte: true, desde: 1 }, '', { t: '3y', color: 'f', fuerte: true, desde: 1 }, '', { t: '2', color: 'f', fuerte: true, desde: 1 }],
        [{ t: 'x²', desde: 4 }, '', { t: 'x', desde: 4 }, '', { t: 'número', desde: 4 }],
        [{ t: 'x²', color: 'i', fuerte: true, desde: 4 }, '', { t: '2x', color: 'i', fuerte: true, desde: 5 }, '', { t: '1', color: 'i', fuerte: true, desde: 4 }],
        [{ t: 'x²', color: 'f', fuerte: true, desde: 4 }, '', { t: '3x', color: 'f', fuerte: true, desde: 5 }, '', { t: '2', color: 'f', fuerte: true, desde: 4 }],
      ], flechas: [
        { de: [1, 0], a: [2, 2], desde: 2 }, { de: [2, 0], a: [1, 2], desde: 2 },
        { de: [1, 2], a: [2, 4], desde: 3 }, { de: [2, 2], a: [1, 4], desde: 3 },
        { de: [4, 0], a: [5, 4], desde: 4 }, { de: [5, 0], a: [4, 4], desde: 4 },
      ], separador: { fila: 3 }, alt: 'Aspa doble de 2x² + 7xy + 3y² + 7x + 11y + 6 y aspa doble especial de x⁴ + 5x³ + 9x² + 7x + 2' },
      voz: 'Cada aspa comprueba un término.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se parten los extremos de cada columna.', ecuacion: ['2x² = 2x · x;   3y² = y · 3y;   6 = 3 · 2'] },
        { estado: { corte: 2 }, texto: 'Aspa x–y: 2x · 3y + x · y.', ecuacion: ['6xy + xy = 7xy'] },
        { estado: { corte: 3 }, texto: 'Aspa y–número: y · 2 + 3y · 3.', ecuacion: ['2y + 9y = 11y'] },
        { estado: { corte: 3 }, texto: 'Aspa de los extremos: 2x · 2 + x · 3 = 7x. Cuadran las tres.', ecuacion: [FS('(2x + y + 3)'), FO('(x + 3y + 2)')] },
        { estado: { corte: 4 }, texto: 'Doble especial: los extremos ponen x² · 2 + 1 · x².', ecuacion: ['2x² + x² = 3x²'] },
        { estado: { corte: 5 }, texto: 'Faltan 9x² − 3x² = 6x², partidos en 2x · 3x.', ecuacion: [FS('(x² + 2x + 1)'), FO('(x² + 3x + 2)')] },
        { estado: { corte: 5 }, texto: 'Cada factor se revisa: los dos se abren con aspa simple.', ecuacion: ['(x + 1)³(x + 2)'] },
      ],
    },
    regla: {
      texto: 'Aspa doble: tres columnas y tres aspas, que dan los términos del medio. Doble especial: la columna del medio pone lo que falta del término en x².',
      ecuacion: ['9x² − 3x² = ', FO('6x²'), ' = 2x · 3x'],
      condicion: 'el polinomio va ordenado, con 0 donde falte un término; lo que falta se parte para que cuadren x³ y x.',
      voz: 'Si un aspa no cuadra, cambia esa partición.',
      dibujo: TB(especialT({ fil: [['2x', '1'], ['3x', '2']], falta: '6x²', pie: '9x² − 3x² = 6x² = 2x · 3x', alt: 'Doble especial de x⁴ + 5x³ + 9x² + 7x + 2: falta 6x²' })),
    },
    // Así se resuelve: un aspa doble completa con signos. «Ahora tú» pide un factor, la suma de los factores, lo que falta
    // en x² y los factores primos de una doble especial.
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        const [F, G] = dosFactores(r), T = prod3(F, G), P = seis(T);
        const fila = (H, c) => [{ t: H[0] === 1 ? 'x' : `${H[0]}x`, color: c, fuerte: true }, '', { t: yT(H[1]), color: c, fuerte: true }, '', { t: f(H[2]), color: c, fuerte: true }];
        const tabla = TB({ columnas: ['x', '', 'y', '', 'número'], filas: [fila(F, 'i'), fila(G, 'f')], flechas: [{ de: [0, 0], a: [1, 2] }, { de: [1, 0], a: [0, 2] }, { de: [0, 2], a: [1, 4] }, { de: [1, 2], a: [0, 4] }], alt: `Aspa doble de ${P}` });
        const m = (a, b) => suma([[a, 0, 0]]) + (b ? '' : '');
        return {
          enunciado: [`Factoriza ${P}.`],
          datos: [DB.doble, DA.signo],
          pasos: [
            { tipo: 'pide', texto: 'Piden escribirlo como producto de dos trinomios, cada uno con x, y y un número.' },
            { tipo: 'datos', texto: `Tiene seis términos: ${suma([[T[0], 2, 0]])}, ${suma([[T[2], 0, 2]])} y ${f(T[5])} en los extremos de cada columna.` },
            { tipo: 'regla', texto: 'Aspa doble: se parten los tres extremos; las aspas x–y, y–número y x–número tienen que dar los términos del medio.' },
            { tipo: 'cuentas', texto: `Con las filas ${tri3(F)} y ${tri3(G)}, las aspas dan ${suma([[T[1], 1, 1]])}, ${suma([[T[4], 0, 1]])} y ${suma([[T[3], 1, 0]])}: cuadran.`, dibujo: tabla },
            { tipo: 'cuentas', texto: 'Cada fila es un factor.', ecuacion: [FS(`(${tri3(F)})`), FO(`(${tri3(G)})`)] },
            { tipo: 'sentido', texto: `Al multiplicar las dos filas vuelven los seis términos; ${m(T[5])} = ${f(F[2])} · ${par(G[2])}.` },
          ],
          respuesta: [FS(`(${tri3(F)})`), FO(`(${tri3(G)})`)],
        };
      },
    },
    ahoraTu: {
      voz: 'Escribe las columnas y revisa aspa por aspa.',
      generar(sem) {
        const r = azar(sem + 61), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoDobleFactor, r);
        if (tipo === 1) return conCuatro(casoDobleSuma, r);
        if (tipo === 2) return conCuatro(casoFalta, r);
        return conCuatro(casoEspecialPrimos, r);
      },
    },
  };

  // ---------- Idea 5: divisores binómicos y teorema del factor ----------
  // Objeto: la hoja del cuaderno de Rubén con la tabla de Ruffini de División (alg-reparto, 'cuaderno'). Cambia: el número
  // a que se prueba (de −6 a 6). · Permanece: P = x³ − x² + x − 6. · Progresa: la fila de abajo y la última casilla. · Se
  // reserva: el signo del binomio cuando el número es negativo (la predicción: P(−3) = 0). · Debe verse: solo a = 2 deja
  // la última casilla en 0; entonces P es (x − 2) por la fila de abajo.
  // Errores: TAL-FACTOR-SIGNO copia el signo del número en el binomio · TAL-FACTOR-INDEP toma el término independiente ·
  // TAL-FACTOR-X cree que x siempre es un factor · TAL-FACTOR-CAND cree que todo divisor del independiente anula a P ·
  // TAL-OLVIDA-PRINC prueba solo los divisores del independiente · TAL-FRAC-AL-REVES invierte la fracción ·
  // TAL-INCOMPLETA se para con la fila de Ruffini sin abrirla · TAL-PIDE responde otra cosa.
  const PJ5 = [1, -1, 1, -6];                       // (x − 2)(x² + x + 3)
  const PR5 = [1, 2, -5, -6];                       // la predicción: (x + 3)(x² − x − 2)
  // La tabla de Ruffini de P con a: coeficientes en tinta, a en turquesa, la fila del cociente en violeta y la última
  // casilla (lo que sobra) en naranja.
  function rufTabla(cs, a, { cabeza, hasta = 99, pie } = {}) {
    const b = ruffini(cs, a), n = cs.length;
    return {
      objeto: 'cuaderno', tipo: 'ruffini', coefs: cs.map(c => f(c)), a: { t: f(a), c: 'i' },
      medio: b.slice(0, -1).map((v, k) => (k + 1 < hasta ? f(v * a) : '')),
      abajo: b.map((v, k) => (k < hasta ? { t: f(v), c: k === n - 1 ? 'o' : 'f' } : '')),
      flechas: true, cabeza, pie,
    };
  }
  const CU = datos => RP(datos);
  const cabezaP = (cs, a) => [[[`${poli(cs)} con a = `, null, 400], [f(a), 'i', 700]]];
  const DT = {
    teo: 'Teorema del factor: si P(a) = 0, entonces x − a es un factor de P',
    cand: 'Números por probar: los divisores del término independiente, con + y con −',
    candQ: 'Si el coeficiente principal no es 1: también esos divisores entre los divisores del principal',
    ruf: 'Ruffini: se baja el primero; cada casilla es el de arriba más a por la anterior (a: el número que se prueba)',
    fila: 'Sin la última casilla, la fila de abajo da los coeficientes del otro factor',
    valor: 'P(a): el valor de P cuando x vale a',
    teoC: 'cx − b = c(x − b/c): es un factor de P si P(b/c) = 0',
    indep: 'Si x − a es un factor, P = (x − a) · q, y el término independiente de P es −a por el de q',
  };
  // Un P = (x − a)·(x² + b x + c), con x² + b x + c sin números enteros que lo anulen: solo a lo anula entre los enteros.
  function cubicaUno(r) {
    let a, b, c;
    do { a = r.noCero(-5, 5); b = r.ent(-3, 3); c = r.ent(1, 6); } while (b * b - 4 * c >= 0);
    return { a, cs: mult([1, -a], [1, b, c]), q: [1, b, c] };
  }
  // Ahora tú 1: P(a) = 0 dice qué binomio es un factor (el signo).
  function casoSigno(r) {
    const { a, cs } = cubicaUno(r);
    if (cs.join() === PR5.join() || cs.some(v => v === 0)) return null;
    const P = poli(cs), c0 = cs[3];
    return {
      pregunta: [`Para P(x) = ${P} se sabe que P(${f(a)}) = 0. ¿Cuál de estos binomios es un factor de P?`],
      datos: [DT.teo, DT.valor],
      opciones: ops([
        { id: 'c', texto: FS(binx(a)), correcta: true },
        { id: 'signo', texto: FS(binx(-a)), error: 'TAL-FACTOR-SIGNO', siFuera: `Bien el número ${f(a)}. Pero el factor es x − a: ${binx(-a)} se anula en ${f(-a)}, y P(${f(-a)}) = ${f(evaluar(cs, -a))}.` },
        Math.abs(c0) !== Math.abs(a) ? { id: 'indep', texto: FS(binx(c0)), error: 'TAL-FACTOR-INDEP', siFuera: `Bien que el número sale de P. Pero ${f(c0)} es el término independiente, y P(${f(c0)}) = ${f(evaluar(cs, c0))}.` } : null,
        { id: 'x', texto: FS('x'), error: 'TAL-FACTOR-X', siFuera: `Bien que P tiene x. Pero x sería un factor si P(0) fuera 0, y P(0) = ${f(c0)}.` },
      ]),
      solucion: { texto: `${f(a)} anula a P, así que el binomio es x − (${f(a)}).`, ecuacion: ['x − (', NA(f(a)), ') = ', FS(binx(a))] },
    };
  }
  // Ahora tú 2: cuál de los binomios divide a P: solo el del número que lo anula; los otros son divisores del independiente.
  function casoCual(r) {
    const { a, cs } = cubicaUno(r), c0 = Math.abs(cs[3]);
    const divs = [...Array(c0).keys()].map(k => k + 1).filter(d => c0 % d === 0).flatMap(d => [d, -d]).filter(d => d !== a && evaluar(cs, d) !== 0);
    if (divs.length < 3 || cs.some(v => v === 0)) return null;
    const [d1, d2] = r.mezclar(divs.filter(d => d !== -a));
    if (d1 === undefined || d2 === undefined) return null;
    return {
      pregunta: [`¿Cuál de estos binomios divide exactamente a P(x) = ${poli(cs)}?`],
      datos: [DT.teo, DT.cand, DT.ruf],
      opciones: ops([
        { id: 'c', texto: FS(binx(a)), correcta: true },
        { id: 'd1', texto: FS(binx(d1)), error: 'TAL-FACTOR-CAND', siFuera: `Bien que ${f(d1)} divide a ${f(cs[3])}. Pero P(${f(d1)}) = ${f(evaluar(cs, d1))}: ser candidato no basta.` },
        { id: 'd2', texto: FS(binx(d2)), error: 'TAL-FACTOR-CAND', siFuera: `Bien que ${f(d2)} divide a ${f(cs[3])}. Pero P(${f(d2)}) = ${f(evaluar(cs, d2))}: sobra algo.` },
        { id: 'signo', texto: FS(binx(-a)), error: 'TAL-FACTOR-SIGNO', siFuera: `Bien el número ${f(a)}. Pero el binomio que se anula en ${f(a)} es ${binx(a)}.` },
      ]),
      solucion: { texto: `Se prueban los divisores de ${f(c0)}: ${f(a)} deja resto 0.`, ecuacion: [`P(${f(a)}) = 0   →   `, FS(binx(a)), ' es un factor'] },
    };
  }
  // Ahora tú 3: la suma de los factores primos de una cúbica (x − r)(x − s)(x − t), con r, s y t enteros distintos.
  function casoTres(r) {
    const [u, v, w] = r.mezclar([-4, -3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 3);
    const cs = [[1, -u], [1, -v], [1, -w]].reduce(mult, [1]);
    if (cs.some(c => c === 0) || cs.join() === PR5.join()) return null;
    const s = u + v + w, bien = poli([3, -s]);
    const resto = mult([1, -v], [1, -w]);
    return {
      pregunta: [`¿Cuánto suman los factores primos de P(x) = ${poli(cs)}?`],
      datos: [DT.teo, DT.cand, DT.ruf, DI.cuenta],
      opciones: ops([
        { id: 'c', texto: FO(bien), correcta: true },
        { id: 'signo', texto: FO(poli([3, s])), error: 'TAL-FACTOR-SIGNO', siFuera: 'Bien los tres números que anulan a P. Pero cada binomio es x − a: los signos se cambian.' },
        { id: 'inc', texto: FO(poli(sumar([1, -u], resto))), error: 'TAL-INCOMPLETA', siFuera: `Bien el primer factor, ${binx(u)}. Pero la fila ${poli(resto)} todavía se abre.` },
        { id: 'num', texto: FO(f(-s)), error: 'TAL-PIDE', siFuera: 'Bien los números de los binomios. Pero cada factor también trae su x.' },
      ]),
      solucion: { texto: `Anulan a P: ${f(u)}, ${f(v)} y ${f(w)}. Los factores son ${binx(u)}, ${binx(v)} y ${binx(w)}.`, ecuacion: [`(${binx(u)}) + (${binx(v)}) + (${binx(w)}) = `, FO(bien)] },
    };
  }
  // Ahora tú 4 (nivel examen, como San Marcos 2025-II): un factor cx − b de P = (cx − b)(x − s)(x − t), con c = 2 o 3.
  function casoPrincipal(r) {
    const c = r.uno([2, 3]), b = r.noCero(-5, 5), [s, t] = r.mezclar([-3, -2, -1, 1, 2, 3]).slice(0, 2);
    if (mcdN(b, c) !== 1) return null;
    const cs = [[c, -b], [1, -s], [1, -t]].reduce(mult, [1]);
    if (cs.some(v => v === 0)) return null;
    const anula = x => Math.abs(evaluar(cs, x)) < 1e-9;
    const bien = lin(c, -b), sinC = lin(1, -b), signo = lin(c, b), reves = lin(Math.abs(b), b > 0 ? -c : c);
    if (anula(b) || anula(-b / c) || anula(c / b)) return null;
    return {
      pregunta: [`¿Cuál de estos binomios es un factor de P(x) = ${poli(cs)}?`],
      datos: [DT.teo, DT.teoC, DT.cand, DT.candQ],
      opciones: ops([
        { id: 'c', texto: FS(bien), correcta: true },
        { id: 'sinc', texto: FS(sinC), error: 'TAL-OLVIDA-PRINC', siFuera: `Bien que ${f(b)} divide al independiente. Pero P(${f(b)}) = ${f(evaluar(cs, b))}: falta dividir entre ${c}.` },
        { id: 'signo', texto: FS(signo), error: 'TAL-FACTOR-SIGNO', siFuera: `Bien el ${c} y el ${Math.abs(b)}. Pero ese binomio se anula en ${b > 0 ? '−' : ''}${Math.abs(b)}/${c}, que no anula a P.` },
        { id: 'reves', texto: FS(reves), error: 'TAL-FRAC-AL-REVES', siFuera: `Bien la fracción con ${c} y ${Math.abs(b)}. Pero va el divisor del independiente arriba: ${f(b)}/${c}.` },
      ]),
      solucion: { texto: `${f(b)}/${c} anula a P: el binomio que se anula ahí, con enteros, es ${bien}.`, ecuacion: [`${poli(cs)} = `, FS(`(${bien})`), FO(`(${poli(mult([1, -s], [1, -t]))})`)] },
    };
  }

  // Ejemplos de la idea 5. Cuentas rehechas aparte con sympy (cuentas-ejemplos.py). Letras de nivel 3: E, C, A, D, B.
  const EJEMPLOS_FACTOR = [
    { nivel: 1, titulo: '¿Es un factor?',
      enunciado: ['¿Es x − 1 un factor de P(x) = x³ − 3x + 2?'],
      datos: [DT.teo, DT.valor],
      solucion: [{ texto: 'x − 1 se anula en x = 1. Se evalúa P en 1.', ecuacion: ['1³ − 3 · 1 + 2 = 1 − 3 + 2 = 0'] }],
      respuesta: ['Sí: P(1) = 0'] },
    { nivel: 1, titulo: 'El signo del binomio',
      enunciado: ['Para P(x) = x³ + 3x² − 4 se sabe que P(−2) = 0. ¿Qué binomio es un factor de P?'],
      datos: [DT.teo, DT.valor],
      solucion: [{ texto: 'Si −2 anula a P, el factor es x − (−2).', ecuacion: ['x − (', NA('−2'), ') = ', FS('x + 2')] }],
      respuesta: [FS('x + 2')] },
    { nivel: 1, titulo: 'Qué números probar',
      enunciado: ['Para buscar un divisor binómico de x³ − 2x² − 5x + 6, ¿qué números conviene probar?'],
      datos: [DT.teo, DT.indep],
      solucion: [{ texto: 'Si x − a es un factor, 6 es −a por un entero: a divide a 6. Los candidatos son los divisores de 6, con + y con −.', ecuacion: ['6 = 1 · 6 = 2 · 3'] }],
      respuesta: ['±1, ±2, ±3 y ±6'] },
    { nivel: 1, titulo: 'El otro factor',
      enunciado: ['x − 1 es un factor de x³ − 7x + 6. ¿Cuál es el otro factor?'],
      datos: [DT.ruf, DT.fila],
      figura: CU(rufTabla([1, 0, -7, 6], 1, { cabeza: cabezaP([1, 0, -7, 6], 1) })),
      solucion: [{ texto: 'Con 0 por el x² que falta: la fila de abajo es 1, 1, −6 y la última casilla, 0.', ecuacion: ['x³ − 7x + 6 = ', FS('(x − 1)'), FO('(x² + x − 6)')] }],
      respuesta: [FO('x² + x − 6')] },
    { nivel: 1, titulo: 'Un candidato que no sirve',
      enunciado: ['¿Es x − 3 un factor de P(x) = x³ − 2x² − 1?'],
      datos: [DT.teo, DT.valor],
      solucion: [{ texto: 'Se evalúa P en 3.', ecuacion: ['27 − 18 − 1 = 8'] }],
      respuesta: ['No: P(3) = 8, no 0'] },
    { nivel: 2, titulo: 'Una cúbica entera',
      enunciado: ['Factoriza por completo x³ − 2x² − 5x + 6.'],
      datos: [DT.teo, DT.cand, DT.ruf],
      solucion: [
        { texto: 'Se prueba 1: 1 − 2 − 5 + 6 = 0. La tabla con a = 1 deja 1, −1, −6.', ecuacion: ['x³ − 2x² − 5x + 6 = ', FS('(x − 1)'), FO('(x² − x − 6)')] },
        { texto: 'La fila se abre con aspa: −6 = (−3) · 2 y −3x + 2x = −x.', ecuacion: ['x² − x − 6 = (x − 3)(x + 2)'] },
      ],
      respuesta: ['(x − 1)(x − 3)(x + 2)'] },
    { nivel: 2, titulo: 'Una fila que no se abre',
      enunciado: ['P(x) = x³ − x² − 4. Factorízalo por completo.'],
      datos: [DT.teo, DT.cand, DT.ruf],
      solucion: [
        { texto: 'Candidatos: ±1, ±2, ±4. P(1) = −4; P(2) = 8 − 4 − 4 = 0.', ecuacion: ['x³ − x² − 4 = ', FS('(x − 2)'), FO('(x² + x + 2)')] },
        { texto: 'x² + x + 2 no se abre: 2 = 1 · 2 da un cruce de 3x, y con signos −3x. Es un factor primo.' },
      ],
      respuesta: [FS('(x − 2)'), FO('(x² + x + 2)')] },
    { nivel: 2, titulo: 'Con un 2 adelante',
      enunciado: ['Factoriza por completo P(x) = 2x³ − 3x² − 3x + 2.'],
      datos: [DT.teo, DT.cand, DT.candQ, DT.ruf, DA.aspa],
      solucion: [
        { texto: 'Primero los enteros: P(1) = 2 − 3 − 3 + 2 = −2, no sirve; P(2) = 16 − 12 − 6 + 2 = 0. La tabla con a = 2 deja 2, 1, −1.', ecuacion: ['2x³ − 3x² − 3x + 2 = ', FS('(x − 2)'), FO('(2x² + x − 1)')] },
        { texto: 'La fila se abre con aspa: 2x² = 2x · x, −1 = (−1) · 1 y 2x − x = x.', ecuacion: ['2x² + x − 1 = (2x − 1)(x + 1)'] },
      ],
      respuesta: ['(x − 2)(2x − 1)(x + 1)'] },
    { nivel: 2, titulo: 'Un factor que se repite',
      enunciado: ['P(x) = x³ − 3x + 2. Factorízalo por completo.'],
      datos: [DT.teo, DT.cand, DT.ruf],
      solucion: [
        { texto: 'P(1) = 0. Con 0 por el x², la tabla con a = 1 deja 1, 1, −2.', ecuacion: ['x³ − 3x + 2 = ', FS('(x − 1)'), FO('(x² + x − 2)')] },
        { texto: 'x² + x − 2 = (x − 1)(x + 2): x − 1 sale otra vez.', ecuacion: ['x³ − 3x + 2 = (x − 1)²(x + 2)'] },
      ],
      respuesta: ['(x − 1)²(x + 2)'] },
    { nivel: 2, titulo: 'El número que falta',
      enunciado: ['¿Qué número debe ir en el recuadro de x³ + 2x² − x + ☐ para que x − 1 sea un factor?'],
      datos: [DT.teo, DT.valor],
      solucion: [
        { texto: 'x − 1 es factor si el polinomio vale 0 en x = 1:', ecuacion: ['1 + 2 − 1 + ☐ = 0'] },
        { texto: '2 + ☐ = 0, así que en el recuadro va −2.', ecuacion: ['☐ = ', FO('−2')] },
      ],
      respuesta: [FO('−2')] },
    { nivel: 3, titulo: 'La suma de los factores primos',
      enunciado: ['¿Cuánto suman los factores primos de P(x) = x³ − 4x² + x + 6?'],
      alternativas: ['x² − 4x + 7', '3x + 4', '−4', 'x³ − 4x² + x + 6', '3x − 4'],
      datos: [DT.teo, DT.cand, DT.ruf, DI.cuenta],
      solucion: [
        { texto: 'P(−1) = −1 − 4 − 1 + 6 = 0. La tabla con a = −1 deja 1, −5, 6, y la fila se abre: (x − 2)(x − 3).', ecuacion: ['x³ − 4x² + x + 6 = (x + 1)(x − 2)(x − 3)'] },
        { texto: 'Se suman los tres factores.', ecuacion: ['(x + 1) + (x − 2) + (x − 3) = ', FO('3x − 4')] },
        { texto: ['La ', letra('A'), ' no abre la fila: (x + 1) + (x² − 5x + 6). La ', letra('B'), ' cambia los signos: (x − 1) + (x + 2) + (x + 3).'] },
        { texto: ['La ', letra('C'), ' suma solo los números: 1 − 2 − 3. La ', letra('D'), ' multiplica en vez de sumar: vuelve el polinomio.'] },
      ],
      respuesta: [letra('E'), ', ', FO('3x − 4')] },
    { nivel: 3, titulo: 'El tercer factor',
      enunciado: ['P(x) = 2x³ + 3x² − 11x − 6 tiene los factores x − 2 y x + 3. ¿Cuál es el tercero?'],
      alternativas: ['2x − 1', 'x + 1', '2x + 1', '2x + 3', 'x − 1'],
      datos: [DT.teo, DT.cand, DT.candQ, DT.ruf],
      solucion: [
        { texto: 'Con a = 2 la tabla deja 2, 7, 3; con a = −3, esa fila deja 2 y 1.', ecuacion: ['2x³ + 3x² − 11x − 6 = (x − 2)(x + 3)', FO('(2x + 1)')] },
        { texto: 'Comprueba: 2x + 1 se anula en −1/2, y P(−1/2) = −1/4 + 3/4 + 11/2 − 6 = 0.' },
        { texto: ['La ', letra('A'), ' se anula en 1/2, y P(1/2) = −21/2. La ', letra('B'), ' da P(−1) = 6. La ', letra('E'), ' da P(1) = −12.'] },
        { texto: ['La ', letra('D'), ' copia el 3 de x + 3: se anula en −3/2, y P(−3/2) = 21/2.'] },
      ],
      respuesta: [letra('C'), ', ', FO('2x + 1')] },
    { nivel: 3, titulo: 'El coeficiente por hallar',
      enunciado: ['P(x) = x³ + ☐x² + x − 6 tiene el factor x + 2. ¿Qué número va en el recuadro?'],
      alternativas: ['4', '−1', '16', '−4', '0'],
      datos: [DT.teo, DT.valor],
      solucion: [
        { texto: 'x + 2 se anula en −2: P(−2) = 0.', ecuacion: ['−8 + 4 · ☐ − 2 − 6 = 0'] },
        { texto: '4 · ☐ − 16 = 0, así que en el recuadro va 4.', ecuacion: ['x³ + 4x² + x − 6 = (x + 2)(x² + 2x − 3)'] },
        { texto: ['La ', letra('B'), ' evalúa en 2: 8 + 4 · ☐ + 2 − 6 = 0 da −1. La ', letra('C'), ' no divide entre 4: se queda con 16.'] },
        { texto: ['La ', letra('D'), ' despeja con el signo cambiado. La ', letra('E'), ' toma (−2)³ como 8: 8 + 4 · ☐ − 8 = 0 da 0.'] },
      ],
      respuesta: [letra('A'), ', ', FO('4')] },
    { nivel: 3, titulo: 'Con un 3 adelante',
      enunciado: ['¿Cuál de estos binomios es un factor de P(x) = 3x³ − 4x² − 5x + 2?'],
      alternativas: ['x − 1', '3x + 1', 'x + 2', '3x − 1', 'x − 3'],
      datos: [DT.teo, DT.teoC, DT.cand, DT.candQ],
      solucion: [
        { texto: '3x − 1 se anula en 1/3: P(1/3) = 1/9 − 4/9 − 5/3 + 2 = 0.', ecuacion: ['3x³ − 4x² − 5x + 2 = ', FS('(3x − 1)'), FO('(x² − x − 2)')] },
        { texto: ['La ', letra('A'), ' da P(1) = −4. La ', letra('B'), ' se anula en −1/3, y P(−1/3) = 28/9. La ', letra('C'), ' da P(−2) = −28.'] },
        { texto: ['La ', letra('E'), ' da P(3) = 32: ninguna deja resto 0.'] },
      ],
      respuesta: [letra('D'), ', ', FS('3x − 1')] },
    { nivel: 3, titulo: 'Dos factores con números',
      enunciado: ['P(x) = x⁴ − x³ − 7x² + x + 6 tiene los factores x − 1 y x + 1. Si x = 4, ¿cuánto vale el producto de sus otros dos factores primos?'],
      alternativas: ['15', '6', '90', '7', '14'],
      datos: [DT.teo, DT.ruf, DA.aspa, DI.primo],
      solucion: [
        { texto: '(x − 1)(x + 1) = x² − 1, y P entre x² − 1 deja x² − x − 6 = (x + 2)(x − 3).', ecuacion: ['x⁴ − x³ − 7x² + x + 6 = (x − 1)(x + 1)(x + 2)(x − 3)'] },
        { texto: 'Con x = 4:', ecuacion: ['(4 + 2)(4 − 3) = 6 · 1 = ', FO('6')] },
        { texto: ['La ', letra('A'), ' toma los dos factores dados: 3 · 5 = 15. La ', letra('C'), ' evalúa todo P: 15 · 6 = 90.'] },
        { texto: ['La ', letra('D'), ' suma 6 + 1. La ', letra('E'), ' cambia los signos: (4 − 2)(4 + 3) = 14.'] },
      ],
      respuesta: [letra('B'), ', ', FO('6')] },
  ];

  const factorTeo = {
    id: 'teorema-factor',
    titulo: 'Divisores binómicos y teorema del factor',
    pregunta: '¿Cómo hallas un factor de grado 1 de una cúbica?',
    temas: ['Divisores binómicos', 'Teorema del factor'],
    pieza: 'alg-reparto',
    aprendizaje: 'Si a anula a P, x − a es un factor y la fila de Ruffini da el otro; se prueban los divisores del término independiente.',
    actividad: 'Probar números en la tabla de Ruffini hasta que no sobre nada.',
    // Lee: la tabla del cuaderno, la división exacta de División y qué mirar. No dice qué binomio sale de un número
    // negativo (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'La tabla de Rubén', texto: 'Rubén busca un divisor binómico de x³ − x² + x − 6: un factor de la forma x − a. Usa la tabla de Ruffini de su cuaderno, como en «División de polinomios».',
          pieza: 'alg-reparto', dibujo: CU(rufTabla(PJ5, 1, { cabeza: cabezaP(PJ5, 1) })) },
        { titulo: 'Lo viste en División', texto: 'La última casilla de la tabla es lo que sobra al dividir entre x − a. Si vale 0, la división es exacta y no sobra nada.',
          ecuacion: ['D = d · q + r;   con r = 0:   D = d · q'] },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia el número a y mira la última casilla. Busca el número que la deja en 0.' },
      ],
    },
    ejemplos: EJEMPLOS_FACTOR,
    juega: {
      pieza: 'alg-reparto',
      consigna: 'Rubén busca un factor x − a de x³ − x² + x − 6 con la tabla de Ruffini de su cuaderno.',
      mision: {
        texto: 'Prueba números en la tabla hasta que la última casilla sea 0.',
        logrado: v => v.a === 2,
        bien: 'Listo: con a = 2 no sobra nada. La fila 1, 1, 3 es el otro factor.',
      },
      voz: 'Prueba primero los números que dividen al 6.',
      leyenda: [
        { s: NA('a'), t: 'el número que se prueba' },
        { s: FO('abajo'), t: 'la fila del cociente' },
        { s: SO('la caja'), t: 'la última casilla: lo que sobra' },
      ],
      controles: [{ id: 'a', etiqueta: 'a', color: 'c-i', min: -6, max: 6, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: v => CU(rufTabla(PJ5, v.a, { cabeza: cabezaP(PJ5, v.a) })),
      lectura: v => [`P(${f(v.a)}) = `, SO(f(evaluar(PJ5, v.a))), ': la última casilla'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Para P(x) = x³ + 2x² − 5x − 6 se sabe que P(−3) = 0. ¿Cuál de estos binomios es un factor de P?',
      datos: ['P(−3): el valor de P cuando x vale −3'],
      voz: 'Piensa qué binomio vale 0 cuando x es −3.',
      opciones: [
        { id: 'c', texto: 'x + 3', correcta: true },
        { id: 'signo', texto: 'x − 3', error: 'TAL-FACTOR-SIGNO', siFuera: `Bien el 3. Pero x − 3 se anula en 3, y P(3) = ${f(evaluar(PR5, 3))}.` },
        { id: 'indep', texto: 'x − 6', error: 'TAL-FACTOR-INDEP', siFuera: `Bien que el número sale de P. Pero −6 es el término independiente, y P(6) = ${f(evaluar(PR5, 6))}.` },
        { id: 'x', texto: 'x', error: 'TAL-FACTOR-X', siFuera: 'Bien que P tiene x. Pero x sería un factor si P(0) fuera 0, y P(0) = −6.' },
      ],
      dibujo: CU({ objeto: 'cuaderno', tipo: 'larga', filas: [], cabeza: [[['P(x) = x³ + 2x² − 5x − 6', null, 400]], [['P(−3) = 0', null, 700]], [['factor: ?', null, 700]]] }),
      revelar: CU(rufTabla(PR5, -3, { cabeza: cabezaP(PR5, -3) })),
      coincide: 'Coincide: −3 anula a P, y el binomio que vale 0 en −3 es x − (−3) = x + 3.',
      noCoincide: 'Revisemos: el factor es x − a con a = −3, y x − (−3) = x + 3.',
    },
    mira: {
      pieza: 'alg-reparto',
      datos: Object.assign(rufTabla(PJ5, 1, { cabeza: cabezaP(PJ5, 1) }), { pasos: [
        rufTabla(PJ5, 1, { cabeza: cabezaP(PJ5, 1) }), rufTabla(PJ5, 2, { cabeza: cabezaP(PJ5, 2) }), rufTabla(PJ5, 2, { cabeza: cabezaP(PJ5, 2) }),
        rufTabla(PR5, -3, { cabeza: cabezaP(PR5, -3) }), rufTabla(PR5, -3, { cabeza: cabezaP(PR5, -3) }),
        rufTabla([2, -3, -3, 2], 2, { cabeza: cabezaP([2, -3, -3, 2], 2) })] }),
      voz: 'Se prueba un candidato en la tabla y se mira la última casilla.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Con a = 1 sobra −5: x − 1 no es un factor.', ecuacion: ['P(1) = 1 − 1 + 1 − 6 = −5'] },
        { estado: { paso: 1 }, texto: 'Con a = 2 la última casilla es 0: la división es exacta.', ecuacion: ['P(2) = 8 − 4 + 2 − 6 = 0'] },
        { estado: { paso: 2 }, texto: 'Teorema del factor: x − 2 es un factor; la fila da el otro.', ecuacion: ['x³ − x² + x − 6 = ', FS('(x − 2)'), FO('(x² + x + 3)')] },
        { estado: { paso: 3 }, texto: 'Si −3 anula a P, el factor es x − (−3) = x + 3.', ecuacion: ['x³ + 2x² − 5x − 6 = ', FS('(x + 3)'), FO('(x² − x − 2)')] },
        { estado: { paso: 4 }, texto: 'La fila se sigue abriendo, aquí con aspa simple.', ecuacion: ['x² − x − 2 = (x − 2)(x + 1)'] },
        { estado: { paso: 5 }, texto: 'Se prueban los divisores del término independiente: 2 da 0.', ecuacion: ['2x³ − 3x² − 3x + 2 = ', FS('(x − 2)'), FO('(2x² + x − 1)')] },
      ],
    },
    regla: {
      texto: 'Si a anula a P, x − a es un factor y Ruffini da el otro. Se prueban los divisores del independiente; si el principal no es 1, también fracciones.',
      ecuacion: ['P(x) = ', FS('(x − a)'), ' · ', FO('q(x)')],
      condicion: 'coeficientes enteros; las fracciones son un divisor del independiente entre uno del principal; la fila se sigue abriendo.',
      voz: 'El binomio lleva el número con el signo cambiado: x − a.',
      dibujo: CU(rufTabla(PJ5, 2, { cabeza: cabezaP(PJ5, 2) })),
    },
    // Así se resuelve: la factorización completa de una cúbica con tres números enteros que la anulan. «Ahora tú» pide el
    // binomio que sale de P(a) = 0, cuál divide, la suma de los factores y un principal distinto de 1.
    resuelve: {
      pieza: 'alg-reparto',
      generar(s) {
        const r = azar(s + 900);
        let u, v, w, cs;
        do { [u, v, w] = r.mezclar([-3, -2, -1, 1, 2, 3, 4]).slice(0, 3); cs = [[1, -u], [1, -v], [1, -w]].reduce(mult, [1]); } while (cs.some(c => c === 0) || cs.join() === PR5.join());
        const P = poli(cs), q = ruffini(cs, u).slice(0, -1);
        return {
          enunciado: [`Factoriza por completo ${P}.`],
          datos: [DT.teo, DT.cand, DT.ruf, DA.aspa],
          // Antes de los pasos, la tabla sin el número ni las filas: el número que anula a P se busca (lector B, 19 nov).
          dibujo: CU(Object.assign(rufTabla(cs, u, { hasta: 0 }), { a: { t: '?', c: 'i' }, cabeza: [[[`${P} con a = `, null, 400], ['?', 'i', 700]]] })),
          pasos: [
            { tipo: 'pide', texto: 'Piden escribirlo como producto de factores primos.' },
            { tipo: 'datos', texto: `Es una cúbica con término independiente ${f(cs[3])}: los candidatos son sus divisores, con + y con −.` },
            { tipo: 'regla', texto: 'Teorema del factor: si a anula a P, x − a es un factor; la tabla de Ruffini da el otro.' },
            { tipo: 'cuentas', texto: `Con a = ${f(u)} la última casilla es 0.`, ecuacion: [`${P} = `, FS(`(${binx(u)})`), FO(`(${poli(q)})`)], dibujo: CU(rufTabla(cs, u, { cabeza: cabezaP(cs, u) })) },
            { tipo: 'cuentas', texto: `La fila ${poli(q)} se abre con aspa: ${f(q[2])} = ${par(-v)} · ${par(-w)}.`, ecuacion: [`${poli(q)} = (${binx(v)})(${binx(w)})`] },
            { tipo: 'sentido', texto: `Comprueba: ${f(u)}, ${f(v)} y ${f(w)} dividen a ${f(cs[3])}, y cada uno anula a P.` },
          ],
          respuesta: [`(${binx(u)})(${binx(v)})(${binx(w)})`],
        };
      },
    },
    ahoraTu: {
      voz: 'El número que anula a P da el binomio con el signo cambiado: x − a.',
      generar(sem) {
        const r = azar(sem + 71), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoSigno, r);
        if (tipo === 1) return conCuatro(casoCual, r);
        if (tipo === 2) return conCuatro(casoTres, r);
        return conCuatro(casoPrincipal, r);
      },
    },
  };

  // ---------- Laboratorio (las tres mesas de la ronda 2, con los colores y las letras de la unidad) ----------
  const BALD = () => Kit.piezas['alg-baldosas'], EJES = () => Kit.piezas.ejes;
  const inversa = (escala, p, q) => px => p + (px - escala(p)) * (q - p) / (escala(q) - escala(p));
  // Mesa 1: el aspa con coeficientes, (mx + p)(nx + s): la esquina de la pieza grande cambia m y n; la de afuera, p y s.
  // El primer factor (el ancho) en turquesa y el segundo (el alto) en violeta; las piezas en cruz en tinta.
  const XL = 3;   // largo de x en la mesa (unidades de la pieza)
  const aspaLab = v => ({
    anchos: [{ t: `${v.m === 1 ? '' : v.m}x`, v: v.m * XL, color: 'i' }, { t: String(v.p), v: v.p, color: 'i' }],
    altos: [{ t: `${v.n === 1 ? '' : v.n}x`, v: v.n * XL, color: 'f' }, { t: String(v.s), v: v.s, color: 'f' }],
    celdas: [[{ t: poli([v.m * v.n, 0, 0]) }, { t: poli([v.p * v.n, 0]) }], [{ t: poli([v.m * v.s, 0]) }, { t: String(v.p * v.s) }]],
    total: { t: `${poli([v.m * v.n, v.m * v.s + v.n * v.p, v.p * v.s])}` },
    escala: 19,
    alt: `Rectángulo de lados ${lin(v.m, v.p)} y ${lin(v.n, v.s)}: las dos piezas en cruz suman ${v.m * v.s + v.n * v.p}x`,
  });
  const trinomio = v => [v.m * v.n, v.m * v.s + v.n * v.p, v.p * v.s];
  const mesaAspa = {
    id: 'aspa-con-coeficientes', titulo: 'El aspa con coeficientes', pieza: 'alg-baldosas',
    consigna: 'Arrastra la esquina de la pieza grande (los coeficientes de x) y la de afuera (los números). Las dos piezas en cruz son el aspa.',
    controles: [
      { id: 'm', etiqueta: 'Coeficiente de x arriba', min: 1, max: 2, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      { id: 'n', etiqueta: 'Coeficiente de x abajo', min: 1, max: 2, paso: 1, inicio: 1, decimales: 0, color: 'c-f' },
      { id: 'p', etiqueta: 'Número arriba', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      { id: 's', etiqueta: 'Número abajo', min: 1, max: 4, paso: 1, inicio: 3, decimales: 0, color: 'c-f' },
    ],
    dibujo: v => ({ datos: aspaLab(v), estado: {} }),
    lectura: v => [`${poli(trinomio(v))} = `, FS(`(${lin(v.m, v.p)})`), FO(`(${lin(v.n, v.s)})`)],
    arrastres: [
      { id: 'esquina-mn', etiqueta: 'esquina de la pieza grande: los coeficientes de x', color: 'c-i',
        donde: v => { const g = BALD().geometria(aspaLab(v)); return { x: g.xs[0][1], y: g.ys[0][1] }; },
        mover: (pt, v) => { const g = BALD().geometria(aspaLab(v)); return { m: (pt.x - g.x0) / g.esc / XL, n: (pt.y - g.y0) / g.esc / XL }; } },
      { id: 'esquina-ps', etiqueta: 'esquina de afuera: los números', color: 'c-f',
        donde: v => { const g = BALD().geometria(aspaLab(v)); return { x: g.xs[1][1], y: g.ys[1][1] }; },
        mover: (pt, v) => { const g = BALD().geometria(aspaLab(v)); return { p: (pt.x - g.xs[1][0]) / g.esc, s: (pt.y - g.ys[1][0]) / g.esc }; } },
    ],
    // Retos comprobados (docs/teoria.md §4d): miran el trinomio que arman las piezas, mn x² + (ms + np) x + ps.
    invitaciones: [
      { texto: 'Arma un trinomio con 9x en el medio.', logrado: v => trinomio(v)[1] === 9, bien: 'Los dos productos en cruz sumaron 9.' },
      { texto: 'Haz que el trinomio sea un cuadrado perfecto.', logrado: v => { const [a, b, c] = trinomio(v); return b * b === 4 * a * c; }, bien: 'Las dos filas son iguales: es un binomio al cuadrado.' },
      { texto: 'Consigue x² + 5x + 6 con el aspa.', logrado: v => trinomio(v).join() === [1, 5, 6].join(), bien: '2 · 3 = 6 y 2 + 3 = 5: (x + 2)(x + 3).' },
      { texto: 'Guarda dos aspas con los mismos extremos y distinto término del medio.',
        logrado: (v, guardados) => {
          const t = trinomio(v);
          return guardados.some(g => { const u = trinomio(g); return u[0] === t[0] && u[2] === t[2] && u[1] !== t[1]; })
            && guardados.some(g => ['m', 'n', 'p', 's'].every(k => g[k] === v[k]));
        },
        bien: 'Mismas puntas, distinto cruce: por eso se prueban particiones.' },
    ],
  };
  // Mesa 2: el camino inverso del teorema del factor: se arrastran por el eje tres números que anulan a P y aparece P.
  const YMAX = 20;
  const desarrollo = v => [v.r1, v.r2, v.r3].reduce((acc, a) => mult(acc, [1, -a]), [1]);
  const anulanLab = v => {
    const cs = desarrollo(v);
    const pts = Array.from({ length: 81 }, (_, k) => { const x = -4 + k * 0.1; const y = evaluar(cs, x); return Math.abs(y) <= YMAX ? [Math.round(x * 10) / 10, y] : null; });
    return {
      x: { min: -4, max: 4, paso: 1, nombre: 'x', decimales: 0 },
      y: { min: -YMAX, max: YMAX, paso: 10, nombre: 'P', decimales: 0 },
      curvas: [{ puntos: pts }],
      puntos: [v.r1, v.r2, v.r3].map(a => ({ x: a, y: 0, color: 'i' })),
      alt: `Curva de P(x) = ${poli(cs)}, que vale 0 en ${v.r1}, ${v.r2} y ${v.r3}`,
    };
  };
  const numeroLab = (id, n) => ({ id, etiqueta: `número ${n} sobre el eje`, color: 'c-i',
    donde: v => { const g = EJES().geometria(anulanLab(v)); return { x: g.X(v[id]), y: g.Y(0) }; },
    mover: (pt, v) => { const g = EJES().geometria(anulanLab(v)); return { [id]: inversa(g.X, -4, 4)(pt.x) }; } });
  const MAX_INDEP = (() => { let m = -Infinity; for (let a = -4; a <= 4; a++) for (let b = -4; b <= 4; b++) for (let c = -4; c <= 4; c++) m = Math.max(m, desarrollo({ r1: a, r2: b, r3: c })[3]); return m; })();
  const mesaAnulan = {
    id: 'raices-que-se-arrastran', titulo: 'Números que anulan a P', pieza: 'ejes',
    consigna: 'Arrastra por el eje los tres números que anulan a P. La curva pasa por ellos y abajo aparece P desarrollado.',
    controles: [
      { id: 'r1', etiqueta: 'número 1', min: -4, max: 4, paso: 1, inicio: -2, decimales: 0, color: 'c-i' },
      { id: 'r2', etiqueta: 'número 2', min: -4, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      { id: 'r3', etiqueta: 'número 3', min: -4, max: 4, paso: 1, inicio: 3, decimales: 0, color: 'c-i' },
    ],
    dibujo: v => ({ datos: anulanLab(v), estado: {} }),
    lectura: v => [[v.r1, v.r2, v.r3].map(a => `(${binx(a)})`).join(''), ` = ${poli(desarrollo(v))}`],
    arrastres: [numeroLab('r1', 1), numeroLab('r2', 2), numeroLab('r3', 3)],
    invitaciones: [
      { texto: 'Junta dos números en el mismo lugar.', logrado: v => new Set([v.r1, v.r2, v.r3]).size === 2, bien: 'Ese factor sale al cuadrado: la curva toca el eje y se devuelve.' },
      { texto: 'Haz que x − 4 sea un factor de P.', logrado: v => [v.r1, v.r2, v.r3].includes(4), bien: 'P(4) = 0: x − 4 es un factor.' },
      { texto: 'Haz que el término independiente sea 0.', logrado: v => desarrollo(v)[3] === 0, bien: 'Uno de los números es 0: x es un factor común.' },
      { texto: 'Busca el término independiente más grande.', logrado: v => desarrollo(v)[3] === MAX_INDEP, bien: 'Los tres en −4: (x + 4)³ termina en 64.' },
    ],
  };
  // Mesa 3: MCD y MCM con los seis exponentes libres; la lectura compara grados: MCD · MCM tiene el grado de P · Q.
  // Los exponentes de P en naranja y los de Q en turquesa; el MCD y el MCM en violeta (como en la idea 6).
  const tablaExp = rows => ({
    columnas: ['factor', 'en P', 'en Q', 'MCD', 'MCM'], colorCol: [null, 'o', 'i', 'f', 'f'],
    filas: rows.map(([fac, i, j, des]) => [{ t: fac, fuerte: true }, { t: String(i), color: 'o' }, { t: String(j), color: 'i' },
      { t: String(Math.min(i, j)), color: 'f', fuerte: true, desde: des || 0 }, { t: String(Math.max(i, j)), color: 'f', fuerte: true, desde: des || 0 }]),
    alt: 'Exponente de cada factor en P y en Q; el MCD toma el menor y el MCM el mayor',
  });
  const grados = v => {
    const ps = [[v.i1, v.j1], [v.i2, v.j2], [v.i3, v.j3]];
    return { mcd: ps.reduce((a, [i, j]) => a + Math.min(i, j), 0), mcm: ps.reduce((a, [i, j]) => a + Math.max(i, j), 0),
      pq: ps.reduce((a, [i, j]) => a + i + j, 0), p: ps.reduce((a, [i]) => a + i, 0) };
  };
  const mesaMCD = {
    id: 'mcd-mcm-libre', titulo: 'Seis exponentes para comparar', pieza: 'alg-tabla',
    consigna: 'Elige el exponente de cada factor en P y en Q. Compara el grado de MCD · MCM con el de P · Q.',
    controles: [
      { id: 'i1', etiqueta: 'x − 1 en P', min: 0, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      { id: 'j1', etiqueta: 'x − 1 en Q', min: 0, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      { id: 'i2', etiqueta: 'x + 2 en P', min: 0, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
      { id: 'j2', etiqueta: 'x + 2 en Q', min: 0, max: 3, paso: 1, inicio: 3, decimales: 0, color: 'c-i' },
      { id: 'i3', etiqueta: 'x + 3 en P', min: 0, max: 3, paso: 1, inicio: 0, decimales: 0, color: 'c-o' },
      { id: 'j3', etiqueta: 'x + 3 en Q', min: 0, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
    ],
    dibujo: v => ({ datos: tablaExp([['x − 1', v.i1, v.j1], ['x + 2', v.i2, v.j2], ['x + 3', v.i3, v.j3]]), estado: {} }),
    lectura: v => { const g = grados(v); return [`grado de MCD · MCM: ${g.mcd} + ${g.mcm} = ${g.pq}, el de P · Q`]; },
    invitaciones: [
      { texto: 'Haz que P y Q no tengan ningún factor común.', logrado: v => grados(v).mcd === 0, bien: 'MCD = 1: el MCM es P · Q.' },
      { texto: 'Consigue el MCM de mayor grado.', logrado: v => grados(v).mcm === 9, bien: 'En cada factor, uno de los dos llegó al exponente 3.' },
      { texto: 'Haz que P divida a Q, sin que sean iguales.', logrado: v => { const g = grados(v); return g.mcd === g.p && g.p !== g.pq - g.p; }, bien: 'Si P divide a Q, el MCD es P y el MCM es Q.' },
      { texto: 'Guarda dos casos con el mismo grado de P · Q y distinto grado del MCD.',
        logrado: (v, guardados) => guardados.some(g => grados(g).pq === grados(v).pq && grados(g).mcd !== grados(v).mcd)
          && guardados.some(g => ['i1', 'j1', 'i2', 'j2', 'i3', 'j3'].every(k => g[k] === v[k])),
        bien: 'MCD · MCM tiene el grado de P · Q: uno gana lo que el otro pierde.' },
    ],
  };

  // ---------- Idea 6: MCD y MCM de polinomios ----------
  // Objeto: dos pasadizos del mismo ancho (Lee) y la tabla de factores de P y Q (juego, alg-tabla). Cambia: el exponente
  // de x − 2 en P y en Q (de 0 a 3). · Permanece: los otros factores, (x + 2)² en P y (x + 2)(x + 3) en Q. · Progresa:
  // las columnas MCD y MCM. · Se reserva: P y Q sin factorizar (la predicción: x² − 1 y x² − 2x + 1). · Debe verse: el
  // MCD toma el menor exponente de cada factor común y el MCM el mayor de todos.
  // Errores: TAL-MCD-MAX toma el mayor exponente · TAL-MCD-SINFACTOR toma un factor que no es común · TAL-MCD-PRIMOS no
  // factoriza y cree que no hay nada común · TAL-MCD-MCM confunde MCD y MCM · TAL-MCM-MIN toma el menor en el MCM ·
  // TAL-MCM-SUMA multiplica P · Q (cuenta dos veces lo común) · TAL-FACTOR-SIGNO cambia el signo de un factor.
  const conPot = (t, e) => (e === 0 ? '' : e === 1 ? `(${t})` : `(${t})${sup(e)}`);
  const escribir = rows => { const t = rows.map(([fac, e]) => conPot(fac, e)).join(''); return t === '' ? '1' : /^\([^()]*\)$/.test(t) ? t.slice(1, -1) : t; };
  const tablaJ6 = (i, j, des = 0) => TB(Object.assign(tablaExp([['x − 2', i, j, des], ['x + 2', 2, 1, des], ['x + 3', 0, 1, des]]), { alt: `Exponentes: x − 2 con ${i} en P y ${j} en Q; x + 2 con 2 y 1; x + 3 con 0 y 1. MCD y MCM` }));
  const gradosJ6 = v => ({ mcd: Math.min(v.i, v.j) + 1, mcm: Math.max(v.i, v.j) + 3, pq: v.i + v.j + 4 });
  const DM = {
    mcd: 'MCD: los factores comunes, cada uno con su menor exponente',
    mcm: 'MCM: todos los factores, cada uno con su mayor exponente',
    fact: 'Antes, cada polinomio se factoriza del todo',
    prod: 'MCD · MCM = P · Q, con todos mónicos (coeficiente principal 1)',
    grado: 'El grado de un producto es la suma de los grados de sus factores',
  };
  // Dos polinomios factorizados que comparten un factor con exponentes distintos.
  function parFact(r) {
    const [a, b, c] = r.mezclar([-4, -3, -2, -1, 1, 2, 3, 4]).slice(0, 3);
    const i = r.ent(1, 3), j = r.ent(1, 2), l = r.ent(1, 2); let k = r.ent(1, 3); if (k === i) k = i === 3 ? 1 : i + 1;
    return { a, b, c, i, j, k, l, P: [[binx(a), i], [binx(b), j]], Q: [[binx(a), k], [binx(c), l]] };
  }
  // Ahora tú 1: el MCD de dos factorizados.
  function casoMCD(r) {
    const { a, b, c, i, j, k, l, P, Q } = parFact(r);
    const bien = escribir([[binx(a), Math.min(i, k)]]);
    return {
      pregunta: [`P = ${escribir(P)} y Q = ${escribir(Q)}. ¿Cuál es el MCD de P y Q?`],
      datos: [DM.mcd, DM.mcm],
      opciones: ops([
        { id: 'c', texto: MM(bien), correcta: true },
        { id: 'max', texto: MM(escribir([[binx(a), Math.max(i, k)]])), error: 'TAL-MCD-MAX', siFuera: `Bien ${binx(a)}, el factor común. Pero va con el menor exponente: el MCD divide a los dos.` },
        { id: 'todos', texto: MM(escribir([[binx(a), Math.min(i, k)], [binx(b), j]])), error: 'TAL-MCD-SINFACTOR', siFuera: `Bien el menor exponente de ${binx(a)}. Pero ${binx(b)} no está en Q: no es común.` },
        { id: 'mcm', texto: MM(escribir([[binx(a), Math.max(i, k)], [binx(b), j], [binx(c), l]])), error: 'TAL-MCD-MCM', siFuera: 'Bien los factores con su mayor exponente, pero ese es el MCM: lleva todos.' },
      ]),
      solucion: { texto: `Solo ${binx(a)} es común: va con el menor exponente, ${Math.min(i, k)}.`, ecuacion: ['MCD = ', MM(bien)] },
    };
  }
  // Ahora tú 2: el MCM de dos factorizados.
  function casoMCM(r) {
    const { a, b, c, i, j, k, l, P, Q } = parFact(r);
    const bien = escribir([[binx(a), Math.max(i, k)], [binx(b), j], [binx(c), l]]);
    return {
      pregunta: [`P = ${escribir(P)} y Q = ${escribir(Q)}. ¿Cuál es el MCM de P y Q?`],
      datos: [DM.mcd, DM.mcm],
      opciones: ops([
        { id: 'c', texto: MM(bien), correcta: true },
        { id: 'min', texto: MM(escribir([[binx(a), Math.min(i, k)], [binx(b), j], [binx(c), l]])), error: 'TAL-MCM-MIN', siFuera: `Bien todos los factores. Pero ${binx(a)} va con el mayor exponente: el MCM es múltiplo de los dos.` },
        { id: 'comun', texto: MM(escribir([[binx(a), Math.min(i, k)]])), error: 'TAL-MCD-MCM', siFuera: 'Bien el menor exponente de lo común, pero ese es el MCD: solo los comunes.' },
        { id: 'suma', texto: MM(escribir([[binx(a), i + k], [binx(b), j], [binx(c), l]])), error: 'TAL-MCM-SUMA', siFuera: `Bien todos los factores. Pero sumar exponentes da P · Q: cuenta dos veces ${binx(a)}.` },
      ]),
      solucion: { texto: `Van todos: ${binx(a)} con el mayor exponente, ${Math.max(i, k)}, y los demás como están.`, ecuacion: ['MCM = ', MM(bien)] },
    };
  }
  // Ahora tú 3: el grado del MCM de dos trinomios que hay que factorizar: (x − a)(x − b) y (x − a)(x − c).
  function casoGradoMCM(r) {
    const [a, b, c] = r.mezclar([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 3);
    const P = mult([1, -a], [1, -b]), Q = mult([1, -a], [1, -c]);
    if ([...P, ...Q].some(v => v === 0)) return null;
    return {
      pregunta: [`¿Qué grado tiene el MCM de ${poli(P)} y ${poli(Q)}?`],
      datos: [DM.fact, DM.mcm, DM.grado, DA.aspa],
      opciones: ops([
        { id: 'c', texto: '3', correcta: true },
        { id: 'pq', texto: '4', error: 'TAL-MCM-SUMA', siFuera: `Bien que van todos los factores. Pero ${binx(a)} es común: va una sola vez.` },
        { id: 'mcd', texto: '1', error: 'TAL-MCD-MCM', siFuera: `Bien el factor común, ${binx(a)}. Pero ese es el MCD; el MCM lleva todos.` },
        { id: 'uno', texto: '2', error: 'TAL-MCD-PRIMOS', siFuera: 'Bien el grado de cada uno. Pero el MCM es múltiplo de los dos, y ninguno lo es del otro.' },
      ]),
      solucion: { texto: `${poli(P)} = (${binx(a)})(${binx(b)}) y ${poli(Q)} = (${binx(a)})(${binx(c)}).`, ecuacion: ['MCM = ', MM(`(${binx(a)})(${binx(b)})(${binx(c)})`), ': grado 3'] },
    };
  }
  // Ahora tú 4 (nivel examen, como San Marcos 2025-II): el MCD de una cúbica y un trinomio, evaluado en un número.
  function casoMCDValor(r) {
    const [a, b, c, d] = r.mezclar([-3, -2, -1, 1, 2, 3, 4]).slice(0, 4);
    const P = [[1, -a], [1, -b], [1, -c]].reduce(mult, [1]), Q = mult([1, -a], [1, -d]);
    if ([...P, ...Q].some(v => v === 0) || P.join() === PR5.join()) return null;   // no la predicción de la idea 5
    const k = r.uno([5, 6, 7, 8, 9]);
    const bien = k - a;
    return {
      pregunta: [`Sea M el MCD de P(x) = ${poli(P)} y Q(x) = ${poli(Q)}. ¿Cuánto vale M(${k})?`],
      datos: [DM.fact, DM.mcd, DT.cand, DA.aspa],
      opciones: ops([
        { id: 'c', texto: MM(f(bien)), correcta: true },
        { id: 'signo', texto: MM(f(k + a)), error: 'TAL-FACTOR-SIGNO', siFuera: `Bien que ${f(a)} anula a los dos. Pero el factor es ${binx(a)}.` },
        { id: 'sinf', texto: MM(f((k - a) * (k - b))), error: 'TAL-MCD-SINFACTOR', siFuera: `Bien ${binx(a)}. Pero ${binx(b)} solo está en P: no es común.` },
        { id: 'q', texto: MM(f(evaluar(Q, k))), error: 'TAL-MCD-SINFACTOR', siFuera: `Bien que Q comparte un factor con P. Pero ${binx(d)} no está en P.` },
      ]),
      solucion: { texto: `P = (${binx(a)})(${binx(b)})(${binx(c)}) y Q = (${binx(a)})(${binx(d)}): solo ${binx(a)} es común.`, ecuacion: [`M(${k}) = ${k} ${a > 0 ? '−' : '+'} ${Math.abs(a)} = `, MM(f(bien))] },
    };
  }

  // Ejemplos de la idea 6. Cuentas rehechas aparte con sympy (cuentas-ejemplos.py). Letras de nivel 3: B, D, A, E, C.
  const EJEMPLOS_MCD = [
    { nivel: 1, titulo: 'Los comunes, con el menor',
      enunciado: ['¿Cuál es el MCD de (x − 1)²(x + 2) y (x − 1)(x + 2)³?'],
      datos: [DM.mcd],
      figura: TB(tablaExp([['x − 1', 2, 1, 99], ['x + 2', 1, 3, 99]])),
      solucion: [{ texto: 'Los dos factores son comunes. x − 1 va con el menor exponente, 1; x + 2 también, 1.', ecuacion: ['MCD = ', MM('(x − 1)(x + 2)')] }],
      respuesta: [MM('(x − 1)(x + 2)')] },
    { nivel: 1, titulo: 'Todos, con el mayor',
      enunciado: ['¿Cuál es el MCM de (x − 1)²(x + 2) y (x − 1)(x + 2)³?'],
      datos: [DM.mcm],
      solucion: [{ texto: 'Van todos los factores: x − 1 con el mayor exponente, 2, y x + 2 con 3.', ecuacion: ['MCM = ', MM('(x − 1)²(x + 2)³')] }],
      respuesta: [MM('(x − 1)²(x + 2)³')] },
    { nivel: 1, titulo: 'Sin nada en común',
      enunciado: ['¿Cuál es el MCD de (x + 1)(x − 4) y (x − 2)(x + 3)?'],
      datos: [DM.mcd],
      solucion: [{ texto: 'No comparten ningún factor. El MCD es 1, y el MCM es el producto de los dos.' }],
      respuesta: ['MCD = ', MM('1')] },
    { nivel: 1, titulo: 'Primero factorizar',
      enunciado: ['¿Cuál es el MCD de x² − 4 y x² + 2x?'],
      datos: [DM.fact, DM.mcd, DI.dif],
      solucion: [{ texto: 'El primero es una diferencia de cuadrados.', ecuacion: ['x² − 4 = (x + 2)(x − 2)'] }, { texto: 'Del segundo sale x. Solo x + 2 es común.', ecuacion: ['x² + 2x = x(x + 2)'] }],
      respuesta: [MM('x + 2')] },
    { nivel: 1, titulo: 'El ancho común',
      enunciado: ['Rubén tiene dos pedidos: (x² + 3x + 2) dm² y (x² + 4x + 3) dm². ¿Cuál es el ancho más grande con el que los dos se arman en pasadizos sin que sobre nada?'],
      datos: [DD.piezas, DM.fact, DM.mcd],
      figura: LO({ objeto: 'pedido', columnas: false, filas: [{ nombre: 'Pedido 1', cuenta: [1, 3, 2] }, { nombre: 'Pedido 2', cuenta: [1, 4, 3] }] }),
      solucion: [{ texto: 'x² + 3x + 2 = (x + 1)(x + 2) y x² + 4x + 3 = (x + 1)(x + 3). El lado que tienen los dos es su MCD.', ecuacion: ['MCD = ', MM('x + 1')] }],
      respuesta: [MM('(x + 1) dm')] },
    { nivel: 2, titulo: 'Con potencias de x',
      enunciado: ['¿Cuál es el MCD de x²(x − 1) y x(x − 1)²?'],
      datos: [DM.mcd],
      solucion: [{ texto: 'x y x − 1 son comunes. Cada uno va con su menor exponente: x¹ y (x − 1)¹.', ecuacion: ['MCD = ', MM('x(x − 1)')] }],
      respuesta: [MM('x(x − 1)')] },
    { nivel: 2, titulo: 'MCM de dos trinomios',
      enunciado: ['¿Cuál es el MCM de x² − x − 6 y x² − 9?'],
      datos: [DM.fact, DM.mcm, DA.aspa, DI.dif],
      solucion: [
        { texto: 'Con aspa, x² − x − 6 = (x − 3)(x + 2); con la diferencia de cuadrados, x² − 9 = (x − 3)(x + 3).' },
        { texto: 'Van todos, y x − 3 una sola vez.', ecuacion: ['MCM = ', MM('(x − 3)(x + 2)(x + 3)')] },
      ],
      respuesta: [MM('(x − 3)(x + 2)(x + 3)')] },
    { nivel: 2, titulo: 'Con una diferencia de cubos',
      enunciado: ['¿Cuál es el MCD de x³ − 1 y x² − 1?'],
      datos: [DM.fact, DM.mcd, DI.cubos, DI.dif],
      solucion: [
        { texto: 'El primero es una diferencia de cubos.', ecuacion: ['x³ − 1 = (x − 1)(x² + x + 1)'] },
        { texto: 'El segundo, de cuadrados. Solo x − 1 es común.', ecuacion: ['x² − 1 = (x − 1)(x + 1)'] },
      ],
      respuesta: [MM('x − 1')] },
    { nivel: 2, titulo: 'El grado del MCM',
      enunciado: ['¿Qué grado tiene el MCM de (x + 1)³(x − 2) y (x + 1)(x − 2)²(x + 5)?'],
      datos: [DM.mcm, DM.grado],
      solucion: [
        { texto: 'Van todos, cada uno con su mayor exponente.', ecuacion: ['MCM = (x + 1)³(x − 2)²(x + 5)'] },
        { texto: 'Su grado suma los exponentes.', ecuacion: ['3 + 2 + 1 = ', MM('6')] },
      ],
      respuesta: [MM('6')] },
    { nivel: 2, titulo: 'El polinomio que falta',
      enunciado: ['P = (x − 1)(x + 3). El MCD de P y Q es x − 1 y su MCM es (x − 1)(x + 3)(x + 4). Si Q es mónico de grado 2, ¿cuál es Q?'],
      datos: [DM.prod],
      solucion: [
        { texto: 'Q tiene el factor común x − 1 y lo que el MCM trae de más, x + 4.' },
        { texto: 'Comprueba: MCD · MCM tiene (x − 1)², x + 3 y x + 4, igual que P · Q.', ecuacion: ['Q = ', MM('(x − 1)(x + 4)')] },
      ],
      respuesta: ['Q = ', MM('(x − 1)(x + 4)')] },
    { nivel: 3, titulo: 'El MCD con números',
      enunciado: ['Sea M el MCD de x² − 5x + 6 y x² − x − 2. ¿Cuánto vale M(7)?'],
      alternativas: ['9', '5', '20', '40', '1'],
      datos: [DM.fact, DM.mcd, DA.aspa],
      solucion: [
        { texto: 'Con aspa: x² − 5x + 6 = (x − 2)(x − 3) y x² − x − 2 = (x − 2)(x + 1). Solo x − 2 es común.', ecuacion: ['M(7) = 7 − 2 = ', MM('5')] },
        { texto: ['La ', letra('A'), ' cambia el signo: 7 + 2 = 9. La ', letra('C'), ' evalúa el primero: 49 − 35 + 6 = 20.'] },
        { texto: ['La ', letra('D'), ' evalúa el segundo: 49 − 7 − 2 = 40. La ', letra('E'), ' cree que no hay nada común.'] },
      ],
      respuesta: [letra('B'), ', ', MM('5')] },
    { nivel: 3, titulo: 'El MCM con números',
      enunciado: ['Sea N el MCM de x² − 1 y x² + 3x + 2. ¿Cuánto vale N(3)?'],
      alternativas: ['4', '160', '10', '40', '8'],
      datos: [DM.fact, DM.mcm, DA.aspa, DI.dif],
      solucion: [
        { texto: 'x² − 1 = (x + 1)(x − 1); x² + 3x + 2, con aspa, es (x + 1)(x + 2). Van todos, x + 1 una vez.', ecuacion: ['N(3) = 4 · 2 · 5 = ', MM('40')] },
        { texto: ['La ', letra('A'), ' da el MCD: 3 + 1 = 4. La ', letra('B'), ' multiplica los dos: 8 · 20 = 160.'] },
        { texto: ['La ', letra('C'), ' deja fuera el común: (3 − 1)(3 + 2) = 10. La ', letra('E'), ' evalúa solo el primero: 9 − 1 = 8.'] },
      ],
      respuesta: [letra('D'), ', ', MM('40')] },
    { nivel: 3, titulo: 'Del MCM al polinomio',
      enunciado: ['P = x² + x − 6. El MCD de P y Q es x − 2 y su MCM es (x − 2)(x + 3)(x − 5). Si Q es un trinomio mónico, ¿cuánto vale Q(0)?'],
      alternativas: ['10', '−6', '30', '−2', '−10'],
      datos: [DM.prod, DA.aspa],
      solucion: [
        { texto: 'P = (x − 2)(x + 3). Q lleva el común, x − 2, y lo que el MCM trae de más, x − 5.', ecuacion: ['Q = (x − 2)(x − 5)'] },
        { texto: 'Con x = 0:', ecuacion: ['Q(0) = (−2)(−5) = ', MM('10')] },
        { texto: ['La ', letra('B'), ' da P(0) = −6. La ', letra('C'), ' evalúa el MCM: (−2)(3)(−5) = 30. La ', letra('D'), ' evalúa el MCD: −2.'] },
        { texto: ['La ', letra('E'), ' cambia el signo del común: (0 + 2)(0 − 5) = −10.'] },
      ],
      respuesta: [letra('A'), ', ', MM('10')] },
    { nivel: 3, titulo: 'El grado de MCD por MCM',
      enunciado: ['P = x³ − x y Q = x² + x. ¿Qué grado tiene el producto de su MCD por su MCM?'],
      alternativas: ['1', '3', '2', '6', '5'],
      datos: [DM.fact, DM.prod, DM.grado],
      solucion: [
        { texto: 'P = x(x + 1)(x − 1) y Q = x(x + 1): MCD = x(x + 1), de grado 2; MCM = x(x + 1)(x − 1), de grado 3.' },
        { texto: 'MCD · MCM = P · Q, y el grado de un producto suma los grados.', ecuacion: ['2 + 3 = 3 + 2 = ', MM('5')] },
        { texto: ['La ', letra('A'), ' resta los grados: 3 − 2. La ', letra('B'), ' da solo el MCM, y la ', letra('C'), ', solo el MCD.'] },
        { texto: ['La ', letra('D'), ' multiplica los grados: 3 · 2 = 6.'] },
      ],
      respuesta: [letra('E'), ', ', MM('5')] },
    { nivel: 3, titulo: 'Primos entre sí',
      enunciado: ['¿Cuál es el MCD de x² + 5x + 6 y x² − 4x + 3?'],
      alternativas: ['x + 3', '(x + 2)(x − 1)', '1', 'x − 3', '(x + 2)(x + 3)(x − 1)(x − 3)'],
      datos: [DM.fact, DM.mcd, DA.aspa],
      solucion: [
        { texto: 'Con aspa: x² + 5x + 6 = (x + 2)(x + 3) y x² − 4x + 3 = (x − 1)(x − 3). No comparten ningún factor: MCD = 1.' },
        { texto: ['La ', letra('A'), ' y la ', letra('D'), ' confunden x + 3 con x − 3: son distintos. La ', letra('B'), ' toma un factor de cada uno.'] },
        { texto: ['La ', letra('E'), ' es el MCM: todos los factores.'] },
      ],
      respuesta: [letra('C'), ', ', MM('1')] },
  ];

  const mcdmcm = {
    id: 'mcd-mcm',
    titulo: 'MCD y MCM de polinomios',
    pregunta: '¿Qué exponente lleva cada factor en el MCD y en el MCM?',
    temas: ['MCD y MCM de polinomios'],
    pieza: 'alg-tabla',
    aprendizaje: 'Con P y Q factorizados, el MCD lleva lo común con su menor exponente y el MCM todo con el mayor; MCD · MCM = P · Q.',
    actividad: 'Elegir exponentes en P y en Q y mirar el MCD y el MCM.',
    // Lee: dos pasadizos del mismo ancho, MCD y MCM con números y con polinomios, y qué mirar. P y Q del juego ya están
    // factorizados; la predicción pide factorizar.
    lee: {
      tarjetas: [
        { titulo: 'Dos pasadizos', texto: 'Rubén tiene dos pedidos: (x² + 3x + 2) dm² y (x² + 4x + 3) dm². Los dos se arman en pasadizos del mismo ancho, (x + 1) dm.',
          pieza: 'alg-reparto', dibujo: RP({ objeto: 'pasadizo', ancho: [1, 1], largo: [1, 2], pedido: [1, 3, 2], sobran: false }) },
        { titulo: 'Con números', texto: 'El MCD de 12 y 18 es 6: el mayor número que divide a los dos. El MCM es 36: el menor que es múltiplo de los dos.' },
        { titulo: 'Con polinomios', texto: 'El MCD de dos polinomios es el de mayor grado que divide a los dos. El MCM es el de menor grado que es múltiplo de los dos.' },
        { titulo: 'Qué mirar al jugar', texto: 'P y Q ya están factorizados en la tabla. Cambia los exponentes de x − 2 y compara las columnas MCD y MCM con las de P y Q.' },
      ],
    },
    ejemplos: EJEMPLOS_MCD,
    juega: {
      pieza: 'alg-tabla',
      consigna: 'P tiene los factores x − 2 y (x + 2)²; Q, x − 2, x + 2 y x + 3. Tú eliges los exponentes de x − 2.',
      mision: {
        texto: 'Haz que x − 2 vaya al cuadrado en el MCD y también en el MCM.',
        logrado: v => v.i === 2 && v.j === 2,
        bien: 'Listo: con el mismo exponente en P y en Q, el menor y el mayor coinciden.',
      },
      voz: 'Compara cada exponente del MCD con los de P y Q.',
      leyenda: [
        { s: EP('en P'), t: 'exponente de cada factor en P' },
        { s: EQ('en Q'), t: 'exponente de cada factor en Q' },
        { s: MM('MCD'), t: 'máximo común divisor' },
        { s: MM('MCM'), t: 'mínimo común múltiplo' },
      ],
      controles: [
        { id: 'i', etiqueta: 'Exponente de x − 2 en P', min: 0, max: 3, paso: 1, inicio: 3, decimales: 0, color: 'c-o' },
        { id: 'j', etiqueta: 'Exponente de x − 2 en Q', min: 0, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      ],
      dibujo: v => tablaJ6(v.i, v.j),
      lectura: v => { const g = gradosJ6(v); return [`grado de MCD · MCM: ${g.mcd} + ${g.mcm} = ${g.pq}, el de P · Q`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'P = x² − 1 y Q = x² − 2x + 1. ¿Cuál es el MCD de P y Q?',
      datos: ['x² − 1 = x² − 1²', '2x = 2 · x · 1'],
      voz: 'Piensa en los factores de cada uno.',
      opciones: [
        { id: 'c', texto: 'x − 1', correcta: true },
        { id: 'max', texto: '(x − 1)²', error: 'TAL-MCD-MAX', siFuera: 'Bien que x − 1 es común. Pero (x − 1)² no divide a x² − 1, que lo tiene una vez.' },
        { id: 'sin', texto: 'x² − 1', error: 'TAL-MCD-SINFACTOR', siFuera: 'Bien que x² − 1 tiene a x − 1. Pero no divide a Q: Q no tiene x + 1.' },
        { id: 'uno', texto: '1', error: 'TAL-MCD-PRIMOS', siFuera: 'Bien que no se parecen a simple vista. Pero los dos valen 0 en x = 1.' },
      ],
      dibujo: TB({ columnas: ['', 'factorizado'], filas: [[{ t: 'x² − 1', color: 'o' }, { t: '?', hueco: true }], [{ t: 'x² − 2x + 1', color: 'i' }, { t: '?', hueco: true }]], rotulosFila: ['P', 'Q'], alt: 'P y Q sin factorizar' }),
      revelar: TB(Object.assign(tablaExp([['x − 1', 1, 2], ['x + 1', 1, 0]]), { alt: 'P = (x + 1)(x − 1) y Q = (x − 1)²: MCD x − 1 y MCM (x + 1)(x − 1)²' })),
      coincide: 'Coincide: P = (x + 1)(x − 1) y Q = (x − 1)². Lo común es x − 1, una vez.',
      noCoincide: 'Revisemos: primero se factoriza cada uno; Q es un cuadrado perfecto.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: Object.assign(tablaExp([['x − 1', 1, 2, 1], ['x + 1', 1, 0, 1]]), { alt: 'Exponentes de x − 1 y x + 1 en P y en Q, con el MCD y el MCM' }),
      voz: 'Primero se factoriza; después se compara.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Primero se factoriza cada uno; Q es un cuadrado perfecto, (x − 1)².', ecuacion: ['x² − 1 = (x + 1)(x − 1)'] },
        { estado: { corte: 1 }, texto: 'MCD: solo los comunes, con su menor exponente.', ecuacion: ['MCD = ', MM('x − 1')] },
        { estado: { corte: 1 }, texto: 'MCM: todos los factores, con su mayor exponente.', ecuacion: ['MCM = ', MM('(x + 1)(x − 1)²')] },
        { estado: { corte: 1 }, texto: 'Comprobación: MCD por MCM da P por Q.', ecuacion: ['(x − 1) · (x + 1)(x − 1)² = P · Q'] },
        { estado: { corte: 1 }, texto: 'Si no hay nada común, el MCD es 1 y el MCM, P · Q.', ecuacion: ['MCM = (x + 2)(x − 3)'] },
      ],
    },
    regla: {
      texto: 'Se factorizan los dos del todo. El MCD lleva los factores comunes con su menor exponente; el MCM, todos los factores con su mayor exponente.',
      ecuacion: ['MCD · MCM = ', { llave: ['P · Q'], nota: 'con todos mónicos' }],
      condicion: 'el MCD y el MCM se escriben mónicos (coeficiente principal 1); si no hay nada común, el MCD es 1.',
      voz: 'El menor divide a los dos; el mayor es múltiplo de los dos.',
      dibujo: TB(Object.assign(tablaExp([['x − 1', 1, 2], ['x + 1', 1, 0]]), { alt: 'P = (x + 1)(x − 1) y Q = (x − 1)²: MCD x − 1 y MCM (x + 1)(x − 1)²' })),
    },
    // Así se resuelve: el MCD de dos trinomios que hay que factorizar con aspa. «Ahora tú» pide el MCD o el MCM de dos
    // factorizados, el grado del MCM de dos trinomios y el MCD de una cúbica y un trinomio evaluado en un número.
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        let a, b, c, P, Q;
        do { [a, b, c] = r.mezclar([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 3); P = mult([1, -a], [1, -b]); Q = mult([1, -a], [1, -c]); } while ([...P, ...Q].some(v => v === 0));
        const tabla = TB(Object.assign(tablaExp([[binx(a), 1, 1], [binx(b), 1, 0], [binx(c), 0, 1]]), { alt: `Factores de ${poli(P)} y de ${poli(Q)}` }));
        return {
          enunciado: [`¿Cuál es el MCD de ${poli(P)} y ${poli(Q)}?`],
          datos: [DM.fact, DM.mcd, DA.aspa],
          pasos: [
            { tipo: 'pide', texto: 'Piden el MCD: el polinomio de mayor grado que divide a los dos.' },
            { tipo: 'regla', texto: 'Primero se factorizan del todo; el MCD lleva los factores comunes con su menor exponente.' },
            { tipo: 'cuentas', texto: 'Con aspa simple, el primer trinomio en dos binomios.', ecuacion: [`${poli(P)} = (${binx(a)})(${binx(b)})`] },
            { tipo: 'cuentas', texto: 'Y el segundo.', ecuacion: [`${poli(Q)} = (${binx(a)})(${binx(c)})`] },
            { tipo: 'cuentas', texto: `Solo ${binx(a)} está en los dos, con exponente 1.`, ecuacion: ['MCD = ', MM(binx(a))], dibujo: tabla },
            { tipo: 'sentido', texto: `${binx(a)} divide a los dos: los dos valen 0 en x = ${f(a)}.` },
          ],
          respuesta: ['MCD = ', MM(binx(a))],
        };
      },
    },
    ahoraTu: {
      voz: 'Con los dos factorizados, compara los exponentes de cada factor.',
      generar(sem) {
        const r = azar(sem + 81), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoMCD, r);
        if (tipo === 1) return conCuatro(casoMCM, r);
        if (tipo === 2) return conCuatro(casoGradoMCM, r);
        return conCuatro(casoMCDValor, r);
      },
    },
  };

  // ---------- Unidad ----------
  const LETRAS = {
    x: 'la variable; en las ideas 1 a 3, el lado de la loseta en dm', y: 'la segunda variable',
    a: 'en una identidad, lo que va al cuadrado o al cubo en el primer término; en la idea 5, el número que anula a P', b: 'en una identidad, lo que va al cuadrado o al cubo en el segundo término',
    c: 'una letra cualquiera de una identidad', P: 'el nombre de un polinomio en un enunciado', Q: 'el nombre del segundo polinomio',
    q: 'el cociente de Ruffini: el otro factor', m: 'el número del primer factor en el aspa simple, (x + m)(x + n)', n: 'el número del segundo factor en el aspa simple', M: 'el MCD en un enunciado', N: 'el MCM en un enunciado',
  };
  // Historia: Euclides, Elementos II.5, en la edición comentada de D. E. Joyce (la de la versión anterior era II.4).
  const HISTORIA = {
    texto: 'En la proposición II.5 de los Elementos, Euclides parte un segmento en dos partes desiguales y muestra, con rectángulos y cuadrados, que el rectángulo de las partes más un cuadrado chico completa el cuadrado de la mitad. Leído hoy con letras, es la diferencia de cuadrados: a² − b² = (a + b)(a − b). Euclides no usaba letras ni números negativos: la igualdad algebraica vale más allá de su figura.',
    pregunta: '¿Por qué una figura puede probar una igualdad entre polinomios?',
    fuente: { titulo: 'Euclides, Elementos II.5; edición y comentario de David E. Joyce — Clark University', url: 'https://mathcs.clarku.edu/~djoyce/elements/bookII/propII5.html' },
  };
  const GLOSARIO = [
    { termino: 'factorizar', formas: ['factorizar', 'factoriza', 'factorizan', 'factorización', 'factorizaciones', 'factorizado', 'factorizados', 'factorizando'],
      def: 'Escribir un polinomio como una multiplicación de otros, sin cambiar lo que vale.',
      simple: 'Escribir algo como una multiplicación, como 12 = 3 · 4.', ver: ['factor'],
      ejemplos: ['x² − 1 se factoriza como (x + 1)(x − 1).', '10x + 5 se factoriza como 5(2x + 1).', 'Se comprueba multiplicando: vuelve el polinomio.'] },
    { termino: 'factor', formas: ['factor', 'factores'], local: true, def: 'Cada polinomio que se multiplica en un producto.',
      simple: 'Cada parte que se multiplica, como el 3 de 3 · 4.',
      ejemplos: ['En 5(2x + 1), los factores son 5 y 2x + 1.', 'En (x + 1)(x − 1) hay dos factores.', 'En un pasadizo, el ancho y el largo.'] },
    { termino: 'factor común', formas: ['factor común', 'factores comunes'], def: 'Lo que está en todos los términos y se saca multiplicando afuera del paréntesis.',
      simple: 'Lo que se repite en todos los términos.', ver: ['factor'],
      ejemplos: ['En 10x + 5, es 5.', 'En 2x² + 8x, es 2x.', 'En x(y + 1) + 2(y + 1), es y + 1.'] },
    { termino: 'agrupar', formas: ['agrupar', 'agrupando', 'agrupa', 'agrupan', 'agrupación'], def: 'Juntar los términos en grupos que tengan su propio factor común.',
      simple: 'Juntar los términos de a dos para que aparezca algo común.', ver: ['factor común'],
      ejemplos: ['xy + 2y + 3x + 6 = y(x + 2) + 3(x + 2).', 'Sirve cuando no hay nada común a los cuatro términos.', 'Cada grupo deja el mismo binomio.'] },
    // Idea 2: trinomio, trinomio cuadrado perfecto, factor primo y diferencia de cubos. Ninguno dice cómo se factoriza
    // x⁴ − 16 ni que x² + 4 ya no se abre (la predicción).
    { termino: 'trinomio', formas: ['trinomio', 'trinomios'], def: 'Polinomio de tres términos.',
      simple: 'Una suma de tres términos.', ver: ['trinomio cuadrado perfecto'],
      ejemplos: ['2x² + 7x + 3 es un trinomio.', 'x² − x − 12 también.', 'x² − 9 no: tiene dos términos.'] },
    { termino: 'trinomio cuadrado perfecto', formas: ['trinomio cuadrado perfecto', 'trinomios cuadrados perfectos'],
      def: 'Trinomio que es el cuadrado de un binomio: dos cuadrados y su doble producto.',
      simple: 'Tres términos que salen de elevar un binomio al cuadrado.', ver: ['trinomio'],
      ejemplos: ['x² + 10x + 25 = (x + 5)².', 'x² − 2x + 1 = (x − 1)².', 'x² + 5x + 4 no lo es: 2 · x · 2 = 4x.'] },
    { termino: 'factor primo', formas: ['factor primo', 'factores primos'],
      def: 'Factor de grado 1 o más que ya no se escribe como producto de otros con coeficientes enteros.',
      simple: 'Un factor que ya no se puede abrir más.', ver: ['factor'],
      ejemplos: ['x − 5 lo es: es de grado 1.', 'x² − 9 no lo es: es (x + 3)(x − 3).', 'En 2x(x + 1), son x y x + 1; el 2 no cuenta.'] },
    { termino: 'diferencia de cubos', formas: ['diferencia de cubos', 'diferencias de cubos'],
      def: 'La resta de dos números elevados al cubo: a³ − b³.',
      simple: 'Un cubo menos otro cubo.', ver: ['suma de cubos'],
      ejemplos: ['x³ − 8 lo es: 8 = 2³.', '5³ − 1³ = 125 − 1 = 124.', '27x³ − 1 lo es: 27x³ = (3x)³.'] },
    // Idea 3: aspa simple y término central. Ninguno trae 2x² + 7x + 3 ni dice qué hacer con su 2 (la predicción).
    { termino: 'aspa simple', formas: ['aspa simple', 'aspa', 'aspas'], def: 'Método para factorizar un trinomio: se parten sus extremos y se comprueba con los productos en cruz.',
      simple: 'Una cruz que prueba qué números van en cada factor.', ver: ['término central'],
      ejemplos: ['En x² + 5x + 4, el cruce x · 4 + x · 1 da 5x.', 'Cada fila del aspa es un factor.', 'Si el cruce no da, se prueba otra partición.'] },
    { termino: 'término central', formas: ['término central', 'término del medio', 'términos centrales'], def: 'En un trinomio ordenado, el término que va entre los dos extremos.',
      simple: 'El término de en medio de un trinomio.', ver: ['aspa simple'],
      ejemplos: ['En x² + 5x + 4, es 5x.', 'En x² − 9x + 20, es −9x.', 'En un cuadrado perfecto, es el doble producto.'] },
    // Idea 4: aspa doble y aspa doble especial. Ninguno dice cuánto falta en x² de x⁴ + 5x³ + 9x² + 7x + 2 (la predicción).
    { termino: 'aspa doble', formas: ['aspa doble'], def: 'Aspa para seis términos con x e y: tres columnas y tres aspas que comprueban los términos del medio.',
      simple: 'Tres aspas a la vez, para seis términos con dos letras.', ver: ['aspa simple'],
      ejemplos: ['Columnas: la de x, la de y y la del número.', 'Cada fila es un factor de tres términos.', 'El aspa de los extremos comprueba el término en x.'] },
    { termino: 'aspa doble especial', formas: ['aspa doble especial', 'doble especial'], def: 'Aspa para cuarto grado en una letra: la columna del medio completa el término en x².',
      simple: 'El aspa para polinomios de cuarto grado en una sola letra.', ver: ['aspa doble'],
      ejemplos: ['Sus columnas son x², x y número.', 'El polinomio va ordenado, con 0 donde falte un término.', 'Al final se revisa si cada factor se abre.'] },
    // Idea 5: divisor binómico y teorema del factor. Ninguno dice qué binomio sale de un número negativo (la predicción).
    { termino: 'divisor binómico', formas: ['divisor binómico', 'divisores binómicos'], def: 'Binomio de grado 1, como x − 2, que divide a un polinomio sin dejar resto.',
      simple: 'Un factor de grado 1 que divide exacto.', ver: ['teorema del factor'],
      ejemplos: ['x − 1 lo es de x² − 1.', 'x − 3 no lo es de x² + 1: sobra 10.', 'Se buscan probando números en la tabla de Ruffini.'] },
    { termino: 'teorema del factor', def: 'El teorema que dice cuándo un binomio de grado 1 es un factor de un polinomio.',
      simple: 'La regla que dice cuándo x − a es un factor.', ver: ['divisor binómico', 'teorema del resto'],
      ejemplos: ['Se usa con la tabla de Ruffini.', 'Es el teorema del resto cuando no sobra nada.', 'Sirve para cúbicas, que el aspa simple no abre.'] },
    // Idea 6: MCD y MCM. Ninguno dice el MCD de x² − 1 y x² − 2x + 1 (la predicción).
    { termino: 'MCD', formas: ['MCD', 'máximo común divisor'], def: 'El polinomio de mayor grado que divide a dos polinomios a la vez.',
      simple: 'Lo más grande que divide a los dos.', ver: ['MCM'],
      ejemplos: ['De (x + 1)(x + 2) y (x + 1)(x + 3), es x + 1.', 'De 12 y 18, es 6.', 'De x + 2 y x − 5, es 1.'] },
    { termino: 'MCM', formas: ['MCM', 'mínimo común múltiplo'], def: 'El polinomio de menor grado que es múltiplo de dos polinomios a la vez.',
      simple: 'Lo más chico que contiene a los dos.', ver: ['MCD'],
      ejemplos: ['De (x + 1)(x + 2) y (x + 1)(x + 3), es (x + 1)(x + 2)(x + 3).', 'De 12 y 18, es 36.', 'De x + 2 y x − 5, es (x + 2)(x − 5).'] },
  ];
  const IDEAS = [comun, identidades, aspaSimple, aspaDoble, factorTeo, mcdmcm];
  // «Ahora tú» y «Así se resuelve» no repiten el polinomio de un ejemplo, de la predicción ni del juego de su idea
  // (etapa-delegada, reglas 8 y 15): si sale uno de esos, se prueba con otra semilla del mismo tipo (+ 4 · 1999 · k, para
  // que sem % 4 no cambie). La prueba propia lo comprueba en 400 semillas.
  const POLI = /(?:\d*[xy][⁰¹²³⁴⁵⁶⁷⁸⁹]*(?:[xy][⁰¹²³⁴⁵⁶⁷⁸⁹]*)?|\d+)(?: [+−] (?:\d*[xy][⁰¹²³⁴⁵⁶⁷⁸⁹]*(?:[xy][⁰¹²³⁴⁵⁶⁷⁸⁹]*)?|\d+))+/g;
  const polis = t => (Kit.plano(t).match(POLI) || []).filter(p => /[xy]/.test(p) && (p.split(/ [+−] /).length >= 3 || /[xy][²³⁴]/.test(p)));
  for (const idea of IDEAS) {
    const vetados = new Set([...idea.ejemplos.flatMap(e => polis(e.enunciado)), ...polis(idea.predice.pregunta), ...polis(idea.juega.consigna)]);
    const repite = c => polis(c.pregunta || c.enunciado).some(p => vetados.has(p));
    for (const m of [idea.ahoraTu, idea.resuelve]) {
      const base = m.generar.bind(m);
      m.generar = s => { for (let k = 0; k < 60; k++) { const c = base(s + 7996 * k); if (!repite(c)) return c; } throw new Error(`${idea.id}: sin caso nuevo`); };
    }
  }
  const LAB = [mesaAspa, mesaAnulan, mesaMCD];
  // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
  const LAB_IDEAS = Object.fromEntries(Object.entries({ 'aspa-con-coeficientes': ['aspa-simple'], 'raices-que-se-arrastran': ['teorema-factor'], 'mcd-mcm-libre': ['mcd-mcm'] })
    .map(([k, l]) => [k, l.filter(id => IDEAS.some(i => i.id === id))]));

  return {
    unidad: 'algebra.factorizacion',
    version: '0.3.1',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/alg-baldosas.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/alg-losetas.js', '/nucleo/kit/piezas/alg-reparto.js'],
    colores: COLORES,
    letras: LETRAS,
    laboratorio: LAB,
    glosario: GLOSARIO,
    historia: HISTORIA,
    laboratorioIdeas: LAB_IDEAS,
    ideas: IDEAS,
  };
});
