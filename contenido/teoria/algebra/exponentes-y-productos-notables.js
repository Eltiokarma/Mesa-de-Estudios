/*
 * Teoría de «Exponentes y radicales» (algebra.exponentes-y-productos-notables), para 5.º de secundaria y
 * preuniversitario. Molde: docs/teoria.md. Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 3).
 *
 * Partición (17 nov, Gerson; docs/etapa3/decisiones.md, «Segunda ronda»; docs/etapa3/propuesta-algebra-exponentes.md
 * §9): la unidad «Exponentes, radicales y productos notables» se partió en dos, como Magnitudes y Vectores. Esta conserva
 * el id (el progreso de los alumnos se guarda con él) y se queda con `leyes-exponentes`, `radicales` y
 * `exponente-fraccionario` (nueva, 18 nov; con ella entró el tema «Exponente fraccionario» al catálogo). Los productos
 * notables, los radicales dobles y la racionalización pasaron tal cual a contenido/teoria/algebra/productos-notables.js
 * (algebra.productos-notables), con sus mesas; Avance.migrar (nucleo/avance.js) mueve el avance de esas ideas y mesas.
 * La historia de Descartes se fue con ellos (habla de figuras y productos); la de esta unidad espera una fuente
 * comprobada (propuesta §8).
 *
 * Etapa 3 del plan de calidad, fases 2 y 3 del método: la idea 1, «El exponente cuenta factores» (`leyes-exponentes`),
 * tuvo el visto bueno de Gerson (17 nov); el 18 nov se rehizo `radicales` («La raíz cuadrada es un lado») y se escribió
 * `exponente-fraccionario` (nueva). Con las tres pasadas por el contrato, la unidad declara calidad: 2.
 * Objetos de la primera pantalla (pieza alg-objeto, dibujos de prueba): idea 1, la hoja de cuaderno que se dobla por la
 * mitad (o en tres, como una carta): los dobleces se suman y las capas se multiplican; idea 2, dos biohuertos cuadrados
 * del colegio y uno solo que junta sus áreas: el área es el radicando y el lado, la raíz; idea 3, una caja cúbica de
 * cartón al lado de una loseta cuadrada con el mismo número: el exponente 1/3 da la arista y el 1/2, el lado.
 * Mesas (18 nov): se quedan las dos, con los colores de la unidad. `raiz-de-la-potencia` (índice par contra impar,
 * idea 2): la gráfica y el punto en violeta (son el resultado) y y = x en tinta (antes carmín y verde); `exponentes-con-
 * signo` (idea 1): la fila del resultado en violeta (antes verde). La idea 3 no tiene mesa: el laboratorio usa su juego.
 *
 * Letras: a, la base; m y n, los exponentes (m, los dobleces que la hoja ya tiene; n, los que se hacen después); en la
 * idea 3, m es el exponente de adentro y n el índice («Lee» lo avisa). a y b de √(a·b) van en tinta, como la base; los
 * números de las dos áreas, naranja y turquesa. x e y son números que se buscan o que no se conocen, siempre en tinta.
 * En las ideas de la hoja y de la caja las medidas no van en metros (la m es el exponente); los biohuertos sí, en m y m². «·» es multiplicar; dos relaciones de una misma ecuación se separan con la raya (SEP) o con «;».
 *
 * REGLA DE COLORES DE LA UNIDAD: un color fijo por magnitud (docs/molde-unidad.md §5b; decisiones, 17 nov), en la tabla
 * COLORES (def.colores), la misma en el juego, la figura, la fórmula, los datos, los ejemplos y «Ahora tú»:
 *   - naranja (c-o): el primer exponente, m (los dobleces que ya tiene la hoja) y el paquete de capas que dejan; el
 *     primer radicando (el área del biohuerto 1) y su lado; el exponente de adentro de una raíz;
 *   - turquesa (c-i): el segundo exponente, n (los dobleces más) y cuántas veces se repite el paquete; el segundo
 *     radicando (el biohuerto 2) y su lado; el índice de una raíz (el n de 1/n);
 *   - violeta (c-f): el resultado: el exponente que resulta, las capas al final, el valor que se pide, el lado del
 *     biohuerto junto, la arista y el lado de la loseta. En una figura, solo si se da; lo que se pide va con «?» en tinta;
 *   - tinta: la base (es la misma en toda la cuenta), los demás exponentes de una cuenta larga, las letras x e y, el
 *     área del biohuerto junto (el total) y el volumen y el área de la caja y la loseta (el número que se da);
 *   - ni carmín (es de los ángulos) ni verde (iría junto al naranja).
 *   La respuesta lleva el color de su magnitud; la letra de una alternativa va en negrita, en violeta (nombra un valor
 *   del resultado). Cada ficha de color dice su magnitud (m); exponentes-y-productos-notables.test.js falla si una
 *   magnitud cambia de color, en las tres ideas, también en el índice de una raíz (turquesa, como el n de 1/n).
 * Correcciones del 18 nov (rutinas/auditoria/algebra.exponentes-y-productos-notables.md, «Correcciones»): leyendas sin
 * los valores de la misión cumplida, índice con su color, glosario y datos que no regalan la predicción ni el paso, la
 * raíz cúbica presentada en la idea 2 y con su «Ahora tú», y los distractores de nivel 3 explicados.
 * Los errores de las ideas 2 y 3 están en el comentario de cada idea.
 * Errores de la idea 1 (hipótesis de diseño, sin dato propio; docs/investigacion/algebra-funciones-ideas-erroneas.md):
 *   AL11 reparte el exponente sobre una suma (2ˣ⁺³ = 2ˣ + 2³) · AL32 iguala exponentes con bases distintas ·
 *   TAL-EXP-NEG cree que el exponente negativo cambia el signo · TAL-EXP-POR multiplica la base por el exponente ·
 *   TAL-EXP-FRAC divide entre base por exponente (1/6 por 2⁻³) · TAL-EXP-PRODUCTO multiplica exponentes en un producto
 *   · TAL-EXP-COCIENTE suma el exponente del divisor · TAL-EXP-BASE multiplica las bases · TAL-EXP-ELEVAR suma al elevar
 *   ((a²)ˣ = a²⁺ˣ) · TAL-EXP-SUMA suma el exponente al valor (5 + 3) · TAL-EXP-RESTA resta exponentes en una resta de
 *   potencias · TAL-EXP-SOLO-EXP resta los exponentes y no los valores · TAL-EXP-DATO usa el número 8 como exponente
 *   · TAL-SIGNO cambia el signo de una resta.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: con la misma base, los exponentes cuentan factores; por eso se suman, se restan o se multiplican.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, sin audio, con lápiz al lado.
 *   Resultado observable: escribe productos, cocientes y potencias de potencias como una sola potencia, usa a⁰ = 1 y
 *     a⁻ⁿ = 1/aⁿ, y pasa a la misma base para hallar un exponente.
 *   Orden de atención: 1.º la hoja (de arriba y de canto) · 2.º la tira de dobleces y la cuenta de capas · acción: los
 *     controles.
 *   Estados: juego sin tocar · casos probados · misión lograda · predicción · coincide / no coincide · paso a paso ·
 *     caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué 2³ · 2² es 2⁵ y no 2⁶, y por qué 2⁻³ no es un número negativo?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const a = { v: 'c-o', t: 'a' }, b = { v: 'c-i', t: 'b' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    return r;
  }
  // Opciones distintas por su texto: la correcta primero; un distractor que repite un texto se descarta.
  function distintas(ops, max = 4) {
    const vistos = new Set(), out = [];
    for (const o of ops) { if (!o) continue; const t = JSON.stringify(o.texto); if (vistos.has(t) || /NaN|undefined/.test(t)) continue; vistos.add(t); out.push(o); }
    return out.slice(0, max);
  }
  // Exponente entero en superíndice Unicode: 2 → «²», −3 → «⁻³».
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '−': '⁻' };
  const sup = e => String(e).split('').map(c => SUP[c] || c).join('');
  const pot = (base, e) => `${base}${sup(e)}`;
  // Valor exacto de bᵉ como texto: entero o fracción 1/bᵏ.
  const valorPot = (base, e) => (e >= 0 ? f(base ** e, 0) : `1/${f(base ** -e, 0)}`);
  // √k escrito sin raíz si k es un cuadrado perfecto.
  const esCuad = k => Number.isInteger(Math.sqrt(k));
  const EJES = () => Kit.piezas.ejes;
  const inversa = (escala, p, q) => px => p + (px - escala(p)) * (q - p) / (escala(q) - escala(p));

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba el test de la unidad) ----------
  const COLORES = { 'primer exponente': 'o', 'segundo exponente': 'i', resultado: 'f', 'primer radicando': 'o', 'segundo radicando': 'i' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: String(t), m: mg });
  const e1 = ficha('primer exponente'), e2 = ficha('segundo exponente'), res = ficha('resultado');
  // Una potencia: la base en tinta y el exponente como venga (texto, ficha de color o partes).
  const pw = (base, exp) => ({ sup: [String(base), exp] });
  // Un número entero con su signo menos tipográfico.
  const z = x => (x < 0 ? `−${-x}` : String(x));
  // La letra de una alternativa, en negrita (Gerson, mesa de revisión, 17 nov), en violeta: nombra un valor del resultado.
  // El U+2060 (invisible) evita que la letra sola salga en cursiva como una variable.
  const letra = L => ({ v: 'c-f', t: `${L}⁠`, m: 'resultado' });
  // Entre dos relaciones de una misma ecuación (en la regla, cada una en su línea; en el texto, una raya fina).
  const SEP = '   ·   ';
  // Texto plano de partes (para comparar opciones).
  const txt = x => (Array.isArray(x) ? x.map(txt).join('') : x && typeof x === 'object'
    ? (x.t !== undefined ? String(x.t) : x.sup ? `${txt(x.sup[0])}^(${txt(x.sup[1])})` : x.frac ? `(${txt(x.frac[0])})/(${txt(x.frac[1])})` : x.par ? `(${txt(x.par)})` : '') : String(x));

  // ---------- Idea 1 (rehecha, 17 nov): el exponente cuenta factores ----------
  // Propuesta aprobada por Gerson: docs/etapa3/propuesta-algebra-exponentes.md (§1 a §6) y docs/etapa3/decisiones.md.
  // Objeto de la primera pantalla: la hoja de cuaderno que se dobla (pieza alg-objeto, dibujo de prueba).
  // Cambia: cómo se dobla (por la mitad o en tres), los dobleces que ya tiene (m) y los que se hacen después (n).
  // · Permanece: la hoja y la escala del dibujo. · Progresa: m dobleces dejan un paquete de bᵐ capas; n dobleces más lo
  // repiten bⁿ veces. · Se reserva: el exponente negativo (la predicción: 2⁻³ es lo que mide la cara de arriba). · Debe
  // verse: los dobleces se suman y las capas se multiplican: bᵐ · bⁿ = bᵐ⁺ⁿ.
  // El juego no tiene exponentes negativos ni fracciones; sí muestra 0 dobleces = 1 capa (a⁰ = 1). Ningún ejemplo pide el
  // valor de una potencia de exponente negativo (es la predicción); «Ahora tú» sí, ya después de predecir.
  const HO = 'alg-objeto';
  const hoja = datos => ({ pieza: HO, datos: Object.assign({ objeto: 'hoja' }, datos), estado: {} });
  // Las leyes, como datos (punto 13: la fórmula general, no el paso hecho), con los colores de la regla.
  const mm = e1('m'), nn = e2('n');
  // Una tabla de potencias como herramienta (auditoría, B7): no dice cuál es la que sirve.
  const POTS = p => `Potencias de ${p}: ${(p === 2 ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4]).map(e => p ** e).join(', ')}`;
  const LEY = {
    def: [pw('a', 'n'), ' = a · a · … · a, con n factores a'],
    producto: [pw('a', mm), ' · ', pw('a', nn), ' = ', pw('a', [mm, ' + ', nn])],
    cociente: [pw('a', mm), ' ÷ ', pw('a', nn), ' = ', pw('a', [mm, ' − ', nn]), ', con a ≠ 0'],
    potencia: [{ sup: [{ par: [pw('a', mm)] }, nn] }, ' = ', pw('a', [mm, ' · ', nn])],
    negativo: [pw('a', ['−', nn]), ' = ', { frac: ['1', pw('a', nn)] }, ', con a ≠ 0'],
    cero: [pw('a', '0'), ' = 1, con a ≠ 0'],
    igualar: 'Si dos potencias de la misma base son iguales, sus exponentes también lo son',
    dobla: 'Cada doblez por la mitad duplica las capas de la hoja',
  };
  // Los dobleces que caben (la pieza dice lo mismo): en tres, a lo más 3; por la mitad, a lo más 5.
  const tope = v => (v.a === 3 ? 3 : 5);
  const cabe = v => (v.m + v.n > tope(v) ? { m: v.m, n: Math.max(0, tope(v) - v.m), topado: true } : { m: v.m, n: v.n, topado: false });
  // Singular o plural: «1 capa», «2 capas» (auditoría, B14).
  const pl = (k, uno, varios) => (k === 1 ? uno : varios);
  // Cuatro opciones siempre en «Ahora tú»: si dos errores dan el mismo texto, se arma otro caso con el mismo azar.
  function conCuatro(caso, r) {
    for (let i = 0; i < 80; i++) { const c = caso(r); if (c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  // Opciones por su texto plano: la correcta primero; hasta 4.
  function opcionesP(correcta, distractores) {
    const ops = [{ id: 'c', texto: correcta, correcta: true }], vistos = new Set([txt(correcta)]);
    for (const x of distractores) {
      const t = txt(x.texto);
      if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue;
      vistos.add(t);
      ops.push({ id: x.id, texto: x.texto, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }

  // Ahora tú 1: producto y cociente de la misma base, como una sola potencia.
  function casoProducto(r) {
    const B = r.uno([2, 3, 5, 7, 10]), p = r.ent(2, 9), q = r.ent(1, 6), t = r.ent(1, p + q - 1), e = p + q - t;
    const op = x => [pw(B, z(x))];
    return {
      pregunta: ['Escribe ', pw(B, e1(p)), ' · ', pw(B, e2(q)), ' ÷ ', pw(B, String(t)), ` como una sola potencia de ${B}.`],
      datos: [LEY.producto, LEY.cociente],
      opciones: opcionesP(op(e), [
        { id: 'producto', texto: op(p * q - t), error: 'TAL-EXP-PRODUCTO', siFuera: 'Bien que juntes todo en una potencia. Pero en un producto los exponentes se suman, no se multiplican.' },
        { id: 'cociente', texto: op(p + q + t), error: 'TAL-EXP-COCIENTE', siFuera: 'Sumar los del producto está bien. Pero al dividir, el exponente del divisor se resta.' },
        { id: 'base', texto: [pw(B * B, z(e))], error: 'TAL-EXP-BASE', siFuera: `Sumar y restar los exponentes está bien. Pero la base no cambia: sigue siendo ${B}.` },
      ]),
      solucion: { texto: 'Misma base: en el producto se suman los exponentes y se resta el del divisor.',
        ecuacion: [pw(B, [e1(p), ' + ', e2(q), ` − ${t}`]), ' = ', pw(B, res(e))] },
    };
  }
  // Ahora tú 2: potencia de una potencia por otra potencia con exponente negativo.
  function casoElevar(r) {
    const B = r.uno([2, 3, 5, 10]), p = r.ent(2, 5), q = r.ent(2, 4), w = -r.ent(1, 6), e = p * q + w;
    const op = x => [pw(B, z(x))];
    return {
      pregunta: ['Escribe ', { sup: [{ par: [pw(B, e1(p))] }, e2(q)] }, ' · ', pw(B, z(w)), ` como una sola potencia de ${B}.`],
      datos: [LEY.potencia, LEY.producto],
      opciones: opcionesP(op(e), [
        { id: 'elevar', texto: op(p + q + w), error: 'TAL-EXP-ELEVAR', siFuera: 'Bien que sumes el último exponente con su signo. Pero elevar una potencia multiplica los exponentes.' },
        { id: 'signo', texto: op(p * q - w), error: 'TAL-EXP-NEG', siFuera: `Multiplicar al elevar está bien. Pero ${z(w)} es negativo: se suma con su signo.` },
        { id: 'todo', texto: op(p * q * w), error: 'TAL-EXP-PRODUCTO', siFuera: 'Bien: elevar multiplica. Pero después, en el producto, los exponentes se suman.' },
      ]),
      solucion: { texto: 'Elevar multiplica los exponentes; después, el producto los suma con su signo.',
        ecuacion: [pw(B, [e1(p), ' · ', e2(q), ` + (${z(w)})`]), ' = ', pw(B, res(z(e)))] },
    };
  }
  // Ahora tú 3: el valor de un producto cuyo exponente sale negativo (después de predecir).
  function casoNegativo(r) {
    const [B, k] = r.uno([[2, 3], [3, 2], [3, 3], [4, 2], [5, 2], [10, 2], [10, 3]]), p = r.ent(1, 6), q = -(p + k);
    const den = B ** k, frac = (x, y) => [{ frac: [String(x), String(y)] }];
    return {
      pregunta: ['¿Cuánto vale ', pw(B, e1(p)), ' · ', pw(B, e2(z(q))), '?'],
      datos: [LEY.producto, LEY.negativo],
      opciones: opcionesP(frac(1, den), [
        { id: 'signo', texto: [z(-den)], error: 'TAL-EXP-NEG', siFuera: `Bien que llegues a ${B}${sup(k)}. Pero el exponente negativo no cambia el signo: indica dividir.` },
        { id: 'por', texto: [z(-B * k)], error: 'TAL-EXP-POR', siFuera: `Sumar los exponentes está bien. Pero ${pot(B, z(-k))} no es ${B} · (−${k}): una potencia no multiplica base por exponente.` },
        { id: 'frac', texto: frac(1, B * k), error: 'TAL-EXP-FRAC', siFuera: `Bien: sale una fracción. Pero se divide entre ${B} ${k} veces, no entre ${B} · ${k}.` },
      ]),
      solucion: { texto: 'Se suman los exponentes con su signo; el exponente negativo indica dividir.',
        ecuacion: [pw(B, [e1(p), ` + (`, e2(z(q)), ')']), ' = ', pw(B, z(-k)), ' = ', { frac: ['1', pw(B, String(k))] }, ' = ', { frac: [res(1), res(den)] }] },
    };
  }
  // Ahora tú 4 (nivel examen): con 2ˣ = 5 dado, sin hallar x; o el factor común de dos potencias.
  function casoDato(r, sem) {
    if (sem % 2 === 0) {
      const B = r.uno([2, 3, 5]), K = r.ent(2, 9), j = B === 5 ? 2 : r.ent(2, 3), ans = K * B ** j;
      return {
        pregunta: ['Si ', pw(B, 'x'), ` = ${K}, ¿cuánto vale `, pw(B, ['x + ', e2(j)]), '?'],
        datos: [LEY.producto],
        opciones: opcionesP([String(ans)], [
          { id: 'suma', texto: [String(K + j)], error: 'TAL-EXP-SUMA', siFuera: `Usar el dato ${K} está bien. Pero el exponente no se suma al valor: ${pot(B, j)} es un factor.` },
          { id: 'reparte', texto: [String(K + B ** j)], error: 'AL11', siFuera: `Bien que calcules ${pot(B, j)} = ${B ** j}. Pero se multiplica: un exponente sumado no se reparte en una suma.` },
          { id: 'por', texto: [String(K * j)], error: 'TAL-EXP-POR', siFuera: `Multiplicar el dato está bien. Pero por ${pot(B, j)} = ${B ** j}, no por ${j}.` },
        ]),
        solucion: { texto: 'No hace falta x: se separa la potencia y se reemplaza el dato.',
          ecuacion: [pw(B, ['x + ', e2(j)]), ' = ', pw(B, 'x'), ' · ', pw(B, e2(j)), ` = ${K} · ${B ** j} = `, res(ans)] },
      };
    }
    const B = r.uno([2, 3]), p = r.ent(3, 4), q = r.ent(1, 2), ans = B ** p - B ** q;
    const expr = { frac: [[pw(B, `x + ${p}`), ' − ', pw(B, `x + ${q}`)], pw(B, 'x')] };
    return {
      pregunta: ['Simplifica ', expr, '.'],
      datos: [LEY.producto, 'p · c − q · c = (p − q) · c: el factor común c sale'],
      opciones: opcionesP([String(ans)], [
        { id: 'resta', texto: [String(B ** (p - q))], error: 'TAL-EXP-RESTA', siFuera: `Bien que separes la potencia de x. Pero ${p} − ${q} se resta así solo al dividir potencias, no al restarlas.` },
        { id: 'signo', texto: [String(B ** p + B ** q)], error: 'TAL-SIGNO', siFuera: `Sacar el factor común está bien. Pero arriba hay una resta: ${B ** p} − ${B ** q}.` },
        { id: 'expo', texto: [String(p - q)], error: 'TAL-EXP-SOLO-EXP', siFuera: `Restar está bien, pero los valores: ${pot(B, p)} − ${pot(B, q)}, no los exponentes.` },
      ]),
      solucion: { texto: `Cada término trae ${pot(B, 'x')} como factor; sale y se simplifica con el de abajo.`,
        ecuacion: [{ frac: [[pw(B, 'x'), ` · (${B ** p} − ${B ** q})`], pw(B, 'x')] }, ` = ${B ** p} − ${B ** q} = `, res(ans)] },
    };
  }
  // Ahora tú 5 (nivel examen): pasar a la misma base para hallar el exponente.
  function casoMismaBase(r) {
    const p = r.uno([2, 3]), k = p === 2 ? r.uno([2, 3]) : 2, j = r.uno([1, 2, 3].filter(x => x !== k && p ** x <= 27)), x0 = r.ent(1, 4);
    const A = p ** k, c = p ** j, N = k * x0 + j;
    // x entero, o como fracción simplificada (8/3), nunca un decimal cortado.
    const mcd = (u, w) => (w ? mcd(w, u % w) : Math.abs(u));
    const op = (num, den = 1) => { const g = mcd(num, den); return [`x = ${z(num / g)}${den / g === 1 ? '' : `/${den / g}`}`]; };
    return {
      pregunta: ['Halla x si ', pw(A, 'x'), ` · ${c} = `, pw(p, String(N)), '.'],
      datos: [POTS(p), LEY.potencia, LEY.producto, LEY.igualar],
      opciones: opcionesP(op(x0), [
        { id: 'bases', texto: op(N - j), error: 'AL32', siFuera: `Igualar exponentes está bien, pero con la misma base: antes, ${A} se escribe ${pot(p, k)}.` },
        { id: 'elevar', texto: op(N - j - k), error: 'TAL-EXP-ELEVAR', siFuera: `Pasar ${A} a ${pot(p, k)} está bien. Pero (${pot(p, k)})ˣ multiplica: ${k}x, no ${k} + x.` },
        { id: 'dato', texto: op(N - c, k), error: 'TAL-EXP-DATO', siFuera: `Bien que uses ${k}x. Pero ${c} no es exponente: es ${pot(p, j)}, y suma ${j}.` },
      ]),
      solucion: { texto: `Todo a base ${p}; después se igualan los exponentes.`,
        ecuacion: [pw(A, 'x'), ` · ${c} = `, pw(p, `${k}x + ${j}`), '   →   ', `${k}x + ${j} = ${N}`, '   →   x = ', res(x0)] },
    };
  }

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h): 5 de nivel 1, 5 de nivel 2 y 5 de nivel 3. Cuentas
  // rehechas aparte, sin este archivo (scratchpad de la sesión, cuentas-idea1.py): 2⁴ = 16; 5³ = 125; 3⁴ · 3² = 3⁶;
  // 7⁹ ÷ 7⁵ = 7⁴; (2³)⁴ = 2¹²; 2⁵ ÷ 2² = 2³ = 8; (5²)³ · 5⁴ ÷ 5⁸ = 5² = 25; 6⁵ ÷ 6⁵ = 6⁰ = 1; 3⁵ · 3⁻² = 3³ = 27;
  // 4³ · 2⁵ = 2048 = 2¹¹; 2ˣ = 5 → 2ˣ⁺³ = 40; (2ˣ⁺³ − 2ˣ⁺¹)/2ˣ = 6; 4ˣ · 8 = 2¹¹ → x = 4 (4⁴ · 8 = 2048), con los errores
  // x = 6, 8 y 1,5; −2⁴ + (−2)⁴ + (−2)³ = −8, con los errores 24, −40 y 8; 9ˣ = 27ʸ con x + y = 5 → x = 3, y = 2
  // (9³ = 27² = 729), con el error 5/2. Ninguna figura muestra la respuesta (las capas que se piden van sin el canto) y
  // ningún ejemplo pide el valor de una potencia de exponente negativo (es la predicción).
  const EJEMPLOS_LEYES = [
    { nivel: 1, titulo: 'Cuatro dobleces',
      enunciado: 'Doblas una hoja de cuaderno por la mitad 4 veces. ¿Cuántas capas quedan? Escríbelo como potencia de 2 y calcula.',
      datos: [LEY.dobla, LEY.def],
      figura: hoja({ m: 4, canto: false }),
      solucion: [
        { texto: 'Cada doblez multiplica las capas por 2. Con 4 dobleces, el 2 aparece 4 veces como factor.', ecuacion: ['2 · 2 · 2 · 2 = ', pw('2', e1('4')), ' = ', res('16')] },
      ],
      respuesta: [pw('2', e1('4')), ' = ', res('16'), ' capas'] },
    { nivel: 1, titulo: 'Base y exponente',
      enunciado: ['En la potencia ', pw('5', e1('3')), ', ¿cuál es la base, cuál es el exponente y cuánto vale?'],
      datos: [LEY.def],
      solucion: [
        { texto: 'La base es el número que se repite como factor: 5. El exponente cuenta cuántas veces se repite: 3.', ecuacion: [pw('5', e1('3')), ' = 5 · 5 · 5 = ', res('125')] },
      ],
      respuesta: ['Base 5, exponente ', e1('3'), '; vale ', res('125')] },
    { nivel: 1, titulo: 'Juntar dos potencias',
      enunciado: ['Escribe ', pw('3', e1('4')), ' · ', pw('3', e2('2')), ' como una sola potencia de 3.'],
      datos: [LEY.producto],
      solucion: [
        { texto: '3⁴ son 4 factores 3, y 3² son 2 factores 3 más. Juntos son 4 + 2 = 6 factores 3.', ecuacion: [pw('3', e1('4')), ' · ', pw('3', e2('2')), ' = ', pw('3', [e1('4'), ' + ', e2('2')]), ' = ', pw('3', res('6'))] },
      ],
      respuesta: [pw('3', res('6'))] },
    { nivel: 1, titulo: 'Dividir dos potencias',
      enunciado: ['Escribe ', pw('7', e1('9')), ' ÷ ', pw('7', e2('5')), ' como una sola potencia de 7.'],
      datos: [LEY.cociente],
      solucion: [
        { texto: 'Dividir entre 7⁵ quita 5 de los 9 factores 7: quedan 9 − 5 = 4.', ecuacion: [pw('7', e1('9')), ' ÷ ', pw('7', e2('5')), ' = ', pw('7', [e1('9'), ' − ', e2('5')]), ' = ', pw('7', res('4'))] },
      ],
      respuesta: [pw('7', res('4'))] },
    { nivel: 1, titulo: 'Potencia de una potencia',
      enunciado: ['Escribe ', { sup: [{ par: [pw('2', e1('3'))] }, e2('4')] }, ' como una sola potencia de 2.'],
      datos: [LEY.potencia],
      solucion: [
        { texto: '(2³)⁴ es 2³ repetido 4 veces como factor. El 3 se suma 4 veces: 3 · 4 = 12.',
          ecuacion: [{ sup: [{ par: [pw('2', e1('3'))] }, e2('4')] }, ' = ', pw('2', e1('3')), ' · ', pw('2', e1('3')), ' · ', pw('2', e1('3')), ' · ', pw('2', e1('3')), ' = ', pw('2', res('12'))] },
      ],
      respuesta: [pw('2', res('12'))] },
    { nivel: 2, titulo: 'Desdoblar la hoja',
      enunciado: 'Una hoja doblada por la mitad 5 veces se desdobla 2 veces. ¿Cuántas capas le quedan?',
      datos: ['Cada doblez por la mitad duplica las capas; desdoblar una vez las parte en 2', LEY.cociente],
      figura: hoja({ m: 5, canto: false }),
      solucion: [
        { texto: 'Con 5 dobleces hay 2⁵ capas. Desdoblar 2 veces divide entre 2 y otra vez entre 2: entre 2².', ecuacion: [pw('2', e1('5')), ' ÷ ', pw('2', e2('2')), ' = ', pw('2', res('3')), ' = ', res('8')] },
        { texto: 'Lo reviso con números: 32 capas, partidas en 2, son 16; partidas otra vez, 8.' },
      ],
      respuesta: [res('8'), ' capas'] },
    { nivel: 2, titulo: 'Tres leyes juntas',
      enunciado: ['Escribe ', { sup: [{ par: [pw('5', '2')] }, '3'] }, ' · ', pw('5', '4'), ' ÷ ', pw('5', '8'), ' como una sola potencia de 5 y calcula su valor.'],
      datos: [LEY.potencia, LEY.producto, LEY.cociente],
      solucion: [
        { texto: 'Primero, la potencia de una potencia: se multiplican sus exponentes, 2 · 3 = 6.', ecuacion: [{ sup: [{ par: [pw('5', '2')] }, '3'] }, ' = ', pw('5', '6')] },
        { texto: 'Después, el producto suma y la división resta: 6 + 4 − 8 = 2.', ecuacion: [pw('5', '6'), ' · ', pw('5', '4'), ' ÷ ', pw('5', '8'), ' = ', pw('5', res('2')), ' = ', res('25')] },
      ],
      respuesta: [pw('5', res('2')), ' = ', res('25')] },
    { nivel: 2, titulo: 'El exponente cero',
      enunciado: ['¿Cuánto vale ', pw('6', e1('5')), ' ÷ ', pw('6', e2('5')), '? Resuélvelo de dos maneras: con la ley de la división y sin ella.'],
      datos: [LEY.cociente, 'Un número distinto de 0, dividido entre sí mismo, da 1'],
      solucion: [
        { texto: 'Con la ley, se restan los exponentes: 5 − 5 = 0.', ecuacion: [pw('6', e1('5')), ' ÷ ', pw('6', e2('5')), ' = ', pw('6', res('0'))] },
        { texto: 'Sin la ley: es un número dividido entre sí mismo, así que da 1. Las dos maneras tienen que dar lo mismo.', ecuacion: [pw('6', res('0')), ' = ', res('1')] },
      ],
      respuesta: ['Vale ', res('1'), '; por eso ', pw('6', '0'), ' = 1'] },
    { nivel: 2, titulo: 'Un exponente con signo',
      enunciado: ['Escribe ', pw('3', e1('5')), ' · ', pw('3', e2('−2')), ' como una sola potencia de 3 y calcula su valor.'],
      datos: [[...LEY.producto, ', también con exponentes negativos']],
      solucion: [
        { texto: 'Se suman los exponentes, cada uno con su signo: 5 + (−2) = 3.', ecuacion: [pw('3', e1('5')), ' · ', pw('3', e2('−2')), ' = ', pw('3', [e1('5'), ' + (', e2('−2'), ')']), ' = ', pw('3', res('3')), ' = ', res('27')] },
        { texto: 'El −2 no vuelve negativo el resultado: quita 2 de los 5 factores 3.' },
      ],
      respuesta: [pw('3', res('3')), ' = ', res('27')] },
    { nivel: 2, titulo: 'Cambiar la base',
      enunciado: ['Escribe ', pw('4', e1('3')), ' · ', pw('2', e2('5')), ' como una sola potencia de 2.'],
      datos: ['4 = 2²', LEY.potencia, LEY.producto],
      solucion: [
        { texto: 'Las bases no son iguales: así no se suman los exponentes. Primero se escribe 4 como 2².', ecuacion: [pw('4', e1('3')), ' = ', { sup: [{ par: [pw('2', '2')] }, e1('3')] }, ' = ', pw('2', e1('6'))] },
        { texto: 'Con la misma base, se suman: 6 + 5 = 11.', ecuacion: [pw('2', e1('6')), ' · ', pw('2', e2('5')), ' = ', pw('2', res('11'))] },
        { texto: 'No es 8⁸: las bases no se multiplican, y con bases distintas los exponentes no se suman.' },
      ],
      respuesta: [pw('2', res('11'))] },
    { nivel: 3, titulo: 'El dato escondido',
      enunciado: ['Si ', pw('2', 'x'), ' = 5, ¿cuánto vale ', pw('2', ['x + ', e2('3')]), '?'],
      alternativas: ['8', '15', '40', '125', '13'],
      datos: [LEY.producto],
      solucion: [
        { texto: 'No hace falta hallar x. Se separa la potencia en dos factores de base 2 y se reemplaza el dato.', ecuacion: [pw('2', ['x + ', e2('3')]), ' = ', pw('2', 'x'), ' · ', pw('2', e2('3')), ' = 5 · 8 = ', res('40')] },
        { texto: ['La ', letra('A'), ' suma 3 al valor; la ', letra('B'), ' multiplica por 3, no por 2³; la ', letra('D'), ' eleva 5 al cubo; la ', letra('E'), ' reparte el exponente: 5 + 2³.'] },
      ],
      respuesta: [letra('C'), ', ', res('40')] },
    { nivel: 3, titulo: 'Un factor común',
      enunciado: ['Simplifica ', { frac: [[pw('2', 'x + 3'), ' − ', pw('2', 'x + 1')], pw('2', 'x')] }, '.'],
      alternativas: ['4', '6', '2', '8', '10'],
      datos: [LEY.producto, 'p · c − q · c = (p − q) · c: el factor común c sale'],
      solucion: [
        { texto: 'Cada término se separa en 2ˣ por otra potencia de 2.', ecuacion: [pw('2', 'x + 3'), ' = ', pw('2', 'x'), ' · 8', SEP, pw('2', 'x + 1'), ' = ', pw('2', 'x'), ' · 2'] },
        { texto: 'Arriba, 2ˣ es factor común; al dividir entre 2ˣ, se simplifica.', ecuacion: [{ frac: [[pw('2', 'x'), ' · (8 − 2)'], pw('2', 'x')] }, ' = 8 − 2 = ', res('6')] },
        { texto: ['La ', letra('A'), ' resta exponentes, 2² = 4, como al dividir; la ', letra('C'), ' se queda en 3 − 1; la ', letra('D'), ' olvida un término; la ', letra('E'), ' suma 8 + 2.'] },
      ],
      respuesta: [letra('B'), ', ', res('6')] },
    { nivel: 3, titulo: 'A la misma base',
      enunciado: ['Halla x si ', pw('4', 'x'), ' · 8 = ', pw('2', '11'), '.'],
      alternativas: ['2', '4', '6', '8', '1,5'],
      datos: [POTS(2), LEY.potencia, LEY.producto, LEY.igualar],
      solucion: [
        { texto: 'Se pasa todo a base 2: 4ˣ es (2²)ˣ = 2²ˣ, y 8 es 2³.', ecuacion: [pw('4', 'x'), ' · 8 = ', pw('2', '2x'), ' · ', pw('2', '3'), ' = ', pw('2', '2x + 3')] },
        { texto: 'Las dos potencias de 2 son iguales, así que sus exponentes también.', ecuacion: ['2x + 3 = 11   →   2x = 8   →   x = ', res('4')] },
        { texto: ['La ', letra('D'), ' no pasa el 4 a base 2; la ', letra('C'), ' suma al elevar, 2 + x; la ', letra('E'), ' usa el 8 como exponente; la ', letra('A'), ' divide 8 entre 4.'] },
      ],
      respuesta: [letra('B'), ', x = ', res('4')] },
    { nivel: 3, titulo: 'El signo y la base',
      enunciado: ['¿Cuánto vale −', pw('2', '4'), ' + ', pw('(−2)', '4'), ' + ', pw('(−2)', '3'), '?'],
      alternativas: ['0', '−8', '8', '−40', '24'],
      datos: ['En −aⁿ el exponente toca solo a a; en (−a)ⁿ toca a −a', 'Un producto con un número par de factores negativos es positivo; con impar, negativo'],
      solucion: [
        { texto: '−2⁴ tiene base 2: es −(2⁴) = −16. En (−2)⁴ la base es −2: cuatro factores negativos dan 16.', ecuacion: ['−', pw('2', '4'), ' = −16', SEP, pw('(−2)', '4'), ' = 16', SEP, pw('(−2)', '3'), ' = −8'] },
        { texto: 'Tres factores negativos dan negativo. Se juntan los tres valores.', ecuacion: ['−16 + 16 + (−8) = ', res('−8')] },
        { texto: ['La ', letra('E'), ' toma −2⁴ como (−2)⁴; la ', letra('D'), ' hace negativo también a (−2)⁴; la ', letra('C'), ' deja positivo (−2)³; la ', letra('A'), ' se olvida de (−2)³.'] },
      ],
      respuesta: [letra('B'), ', ', res('−8')] },
    { nivel: 3, titulo: 'Dos potencias iguales',
      enunciado: ['Si ', pw('9', 'x'), ' = ', pw('27', 'y'), ' y x + y = 5, ¿cuánto vale x?'],
      alternativas: ['2', '3', '5/2', '4', '1'],
      datos: [POTS(3), LEY.potencia, LEY.igualar],
      solucion: [
        { texto: 'A base 3: 9ˣ = 3²ˣ y 27ʸ = 3³ʸ. Como son iguales, sus exponentes también.', ecuacion: [pw('3', '2x'), ' = ', pw('3', '3y'), '   →   2x = 3y'] },
        { texto: 'Con y = 5 − x: 2x = 15 − 3x, así que 5x = 15.', ecuacion: ['x = ', res('3'), ' y y = 2'] },
        { texto: ['Lo reviso: 9³ = 27² = 729. La ', letra('C'), ' iguala x = y sin pasar a base 3; la ', letra('A'), ' da y; la ', letra('D'), ' y la ', letra('E'), ' suman 5, pero 9⁴ ≠ 27.'] },
      ],
      respuesta: [letra('B'), ', x = ', res('3')] },
  ];

  // «Mira»: la hoja doblada 3 veces se desdobla; cada paso divide las capas entre 2, hasta 1 capa y la hoja abierta.
  const MIRA = { objeto: 'hoja', pasos: [{ m: 3 }, { m: 2 }, { m: 0 }, { m: 3, abierta: true, parte: '1/8' }, { m: 3, abierta: true, parte: '1/8' }] };

  const leyes = {
    id: 'leyes-exponentes',
    titulo: 'El exponente cuenta factores',
    pregunta: '¿Qué significa un exponente negativo, como el de 2⁻³?',
    temas: ['Leyes de exponentes'],
    pieza: HO,
    aprendizaje: 'Con la misma base, multiplicar suma exponentes, dividir los resta y elevar los multiplica; a⁰ = 1 y un exponente negativo divide.',
    actividad: 'Doblar una hoja varias veces y contar sus dobleces y sus capas.',
    // Lee: la hoja, la potencia con sus nombres y la carta en tres. No toca el exponente cero ni el negativo («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Una hoja que se dobla', texto: 'Toma una hoja de tu cuaderno y dóblala por la mitad: quedan 2 capas, una encima de otra. Dóblala otra vez por la mitad y las capas vuelven a duplicarse: ahora son 4.',
          pieza: HO, dibujo: hoja({ m: 2 }) },
        { titulo: 'Potencia, base y exponente', texto: 'Con 3 dobleces hay 2 · 2 · 2 = 8 capas. Para no repetir tanto, se escribe 2³ y se lee «2 al cubo»: es una potencia. La base, 2, es el número que se repite; el exponente, 3, cuenta cuántas veces.',
          ecuacion: ['2 · 2 · 2 = ', pw('2', e1('3')), ' = 8'] },
        { titulo: 'Por la mitad o en tres', texto: 'Una carta se dobla en tres partes: cada doblez triplica las capas. Con 2 dobleces en tres hay 3 · 3 = 3² = 9 capas. Ahí la base es 3.',
          ecuacion: ['3 · 3 = ', pw('3', e1('2')), ' = 9'] },
        { titulo: 'Qué mirar al jugar', texto: ['Vas a doblar la hoja ', mm, ' veces y después ', nn, ' veces más. Fíjate en dos cuentas: cuántos dobleces hay en total y cuántas capas quedan. ¿Cambian de la misma manera?'] },
      ],
    },
    ejemplos: EJEMPLOS_LEYES,
    juega: {
      pieza: HO,
      consigna: 'Una hoja de cuaderno se dobla por la mitad o en tres, como una carta. A la izquierda, doblada; a la derecha, sus capas.',
      mision: {
        texto: ['La hoja ya tiene ', e1(3), ' dobleces por la mitad. Dóblala más hasta tener ', res(32), ' capas.'],
        logrado: val => val.a === 2 && val.m === 3 && val.n === 2,
        bien: 'Listo: 3 + 2 = 5 dobleces, y el paquete de 8 capas, cuatro veces, da 32.',
      },
      voz: 'Cuenta los dobleces y las capas: ¿cambian igual?',
      // Sin los valores de la misión cumplida (auditoría, M1): la leyenda es fija y se lee antes de jugar.
      leyenda: [
        { s: mm, t: 'dobleces que la hoja ya tiene' },
        { s: nn, t: 'dobleces que le haces después' },
        { s: e1('paquete'), t: 'capas que dejan los m dobleces (marco naranja)' },
        { s: e2('× veces'), t: 'cuántas veces se repite ese paquete' },
        { s: res('capas'), t: 'todas las hojitas encimadas, vistas de canto' },
        { s: 'Por la mitad', t: 'cada doblez multiplica las capas por 2' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Cómo se dobla', opciones: [{ valor: 2, texto: 'Por la mitad' }, { valor: 3, texto: 'En tres' }] },
        { id: 'm', etiqueta: 'Dobleces que ya tiene, m', color: 'c-o', min: 0, max: 3, paso: 1, inicio: 3, decimales: 0 },
        { id: 'n', etiqueta: 'Dobleces más, n', color: 'c-i', min: 0, max: 3, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => hoja({ base: v.a, m: v.m, n: v.n }),
      // La relación: los dobleces se suman y las capas se multiplican.
      lectura: v => {
        const c = cabe(v);
        if (c.topado) return [`${v.a === 3 ? 'En tres' : 'Por la mitad'} solo caben ${tope(v)} dobleces: `, e1(v.m), ' + ', e2(v.n), ' es más'];
        const k = c.m + c.n, L = v.a ** k;
        return [e1(c.m), ' + ', e2(c.n), ' = ', res(k), ` ${pl(k, 'doblez', 'dobleces')}; ${v.a ** c.m} · ${v.a ** c.n} = `, res(L), ` ${pl(L, 'capa', 'capas')}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'La hoja doblada 3 veces tiene 2³ = 8 capas, y las 8 juntas forman 1 hoja. Si sumar exponentes vale también con negativos, 2³ · 2⁻³ = 2⁰ = 1. ¿Cuánto vale 2⁻³?',
      datos: ['2³ = 2 · 2 · 2 = 8', 'La hoja sin doblar es 1 capa'],
      voz: 'Piensa en una sola capa de la hoja doblada.',
      opciones: [
        { id: 'c', texto: [{ frac: ['1', '8'] }], correcta: true },
        { id: 'negativo', texto: '−8', error: 'TAL-EXP-NEG', siFuera: 'Bien que uses el 8 de 2³. Pero el exponente negativo no cambia el signo: indica dividir.' },
        { id: 'por', texto: '−6', error: 'TAL-EXP-POR', siFuera: 'Usar el 2 y el 3 está bien. Pero una potencia no multiplica la base por el exponente.' },
        { id: 'sexto', texto: [{ frac: ['1', '6'] }], error: 'TAL-EXP-FRAC', siFuera: 'Bien: sale una fracción. Pero se divide entre 2 · 2 · 2, no entre 2 · 3.' },
      ],
      dibujo: hoja({ m: 3, parte: '?', total: 'tinta' }),
      revelar: hoja({ m: 3, abierta: true, parte: '1/8' }),
      coincide: 'Coincide: cada capa es 1/8 de la hoja, y 8 capas de 1/8 forman 1 hoja.',
      noCoincide: 'Revisemos: 2³ · 2⁻³ tiene que dar 1, así que 2⁻³ es lo que, por 8, da 1.',
    },
    mira: {
      pieza: HO,
      datos: MIRA,
      voz: 'Desdoblemos la hoja de a un doblez.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Con 3 dobleces hay 8 capas.', ecuacion: ['2 · 2 · 2 = ', pw('2', e1('3')), ' = 8'] },
        { estado: { paso: 1 }, texto: 'Al desdoblar una vez, el exponente baja 1: las capas, entre 2.', ecuacion: [pw('2', '2'), ' = 8 ÷ 2 = 4'] },
        { estado: { paso: 2 }, texto: 'Desdoblada del todo, queda 1 capa: el exponente llega a 0.', ecuacion: [pw('2', '1'), ' = 2', SEP, pw('2', '0'), ' = 2 ÷ 2 = 1'] },
        { estado: { paso: 3 }, texto: 'Abierta, la hoja muestra 8 partes: la cara doblada era 1/8.', ecuacion: [pw('2', '−3'), ' = ', { frac: ['1', pw('2', '3')] }, ' = ', res('1/8')] },
        { estado: { paso: 4 }, texto: '8 capas de 1/8 de hoja forman 1 hoja entera.', ecuacion: [pw('2', e1('3')), ' · ', pw('2', '−3'), ' = ', pw('2', '0'), ' = 1'] },
      ],
    },
    regla: {
      texto: 'Con la misma base, al multiplicar potencias se suman los exponentes; al dividir, se restan; al elevar una potencia, se multiplican. Un exponente negativo indica dividir.',
      ecuacion: [pw('a', mm), ' · ', pw('a', nn), ' = ', { llave: [pw('a', [mm, ' + ', nn])], nota: 'se suman', color: 'c-f' }, SEP,
        pw('a', mm), ' ÷ ', pw('a', nn), ' = ', { llave: [pw('a', [mm, ' − ', nn])], nota: 'se restan', color: 'c-f' }, SEP,
        { sup: [{ par: [pw('a', mm)] }, nn] }, ' = ', { llave: [pw('a', [mm, ' · ', nn])], nota: 'se multiplican', color: 'c-f' }, SEP,
        pw('a', '0'), ' = 1', SEP, pw('a', ['−', nn]), ' = ', { llave: [{ frac: ['1', pw('a', nn)] }], nota: 'indica dividir', color: 'c-f' }],
      condicion: 'a ≠ 0 con exponente 0 o negativo. Las leyes piden la misma base; el exponente toca solo su base: −2⁴ = −16.',
      voz: 'Misma base primero; después, sumar, restar o multiplicar exponentes.',
    },
    // Así se resuelve: el valor de una expresión con las tres leyes (potencia de potencia, producto y división). «Ahora
    // tú» pide otra cosa: escribir como una sola potencia, el valor de un producto, un dato sin hallar x o una base común.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        let B, p, q, w, e, t;
        do {
          B = r.uno([2, 3, 5]); p = r.ent(2, 3); q = r.ent(2, 3); w = s % 2 ? -r.ent(1, 4) : r.ent(1, 3);
          e = r.ent(B === 2 ? -2 : -1, B === 2 ? 4 : 2); t = p * q + w - e;
        } while (t < 1);
        const val = valorPot(B, e);
        const expr = [{ sup: [{ par: [pw(B, String(p))] }, String(q)] }, ' · ', pw(B, z(w)), ' ÷ ', pw(B, z(t))];
        return {
          enunciado: ['Calcula el valor de ', ...expr, '.'],
          datos: [LEY.potencia, LEY.producto, LEY.cociente, LEY.cero, LEY.negativo],
          pasos: [
            { tipo: 'pide', texto: `Piden el valor de la expresión. Conviene juntarla primero en una sola potencia de ${B}.` },
            { tipo: 'regla', texto: 'Primero, la potencia de una potencia: se multiplican los exponentes. Después, el producto los suma y la división resta el del divisor.' },
            { tipo: 'cuentas', texto: 'Junto todos los exponentes en una sola cuenta, cada uno con su signo.',
              ecuacion: [`${p} · ${q} + (${z(w)}) − (${z(t)}) = ${z(e)}   →   `, pw(B, res(z(e)))] },
            { tipo: 'cuentas', texto: e < 0 ? 'El exponente salió negativo: indica dividir.' : e === 0 ? 'Con exponente 0, la potencia vale 1.' : `Calculo la potencia: ${e} ${e === 1 ? 'factor' : 'factores'} ${B}.`,
              ecuacion: e < 0 ? [pw(B, z(e)), ' = ', { frac: ['1', pw(B, String(-e))] }, ' = ', res(val)] : [pw(B, z(e)), ' = ', res(val)] },
            { tipo: 'sentido', texto: `Lo reviso al revés: ${pot(B, z(e))} · ${pot(B, z(t))} = ${pot(B, z(e + t))}, que es (${pot(B, p)})${sup(q)} · ${pot(B, z(w))}. Cuadra.` },
          ],
          respuesta: ['La expresión vale ', res(val)],
        };
      },
    },
    ahoraTu: {
      pieza: HO,
      voz: 'Primero, la misma base; después, los exponentes.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoProducto, r);
        if (tipo === 1) return conCuatro(casoElevar, r);
        if (tipo === 2) return conCuatro(casoNegativo, r);
        if (tipo === 3) return conCuatro(q => casoDato(q, Math.floor(sem / 5)), r);
        return conCuatro(casoMismaBase, r);
      },
    },
  };

  // Los factores de una potencia, escritos (la mesa «Exponentes con signo»).
  const factores = (base, e) => (e === 0 ? 'ninguno' : Array(e).fill(base).join('·'));

  // La gráfica de √(x²) (Predice y Mira de la idea 2, y la mesa del índice par contra impar).
  const ejesRaiz = (extra = {}) => Object.assign({
    x: { min: -6, max: 6, paso: 2, nombre: 'x', decimales: 0 },
    y: { min: -6, max: 6, paso: 2, nombre: 'y', decimales: 0 },
  }, extra);
  const VX = Array.from({ length: 13 }, (_, k) => k - 6);

  // ---------- Idea 2 (rehecha, 18 nov): la raíz cuadrada es un lado ----------
  // Propuesta aprobada: docs/etapa3/propuesta-algebra-exponentes.md (§1 a §6, idea 2). Objeto de la primera pantalla: dos
  // biohuertos cuadrados del colegio y uno solo que junta sus áreas (pieza alg-objeto, objeto 'huertos'): el área es el
  // radicando y el lado del cerco, la raíz. Cambia: las dos áreas. · Permanece: la escala de los tres biohuertos. ·
  // Progresa: el lado del junto contra los dos lados seguidos. · Se reserva: un número negativo elevado al cuadrado (la
  // predicción: √((−5)²)). · Debe verse: √(a + b) < √a + √b; la raíz no se reparte en una suma.
  // El título de la propuesta («La raíz principal nunca es negativa») decía la respuesta de la predicción en el mapa y en
  // la tira de ideas, antes de predecir: se cambió por «La raíz cuadrada es un lado» (como la pregunta de la idea 1).
  // Ningún ejemplo pide la raíz del cuadrado de un negativo (es la predicción); «Ahora tú» sí, ya después de predecir.
  // Errores (hipótesis de diseño): TAL-RAIZ-X √(x²) = x siempre · TAL-RAIZ-DOBLE da ±, como las soluciones de x² = 25 ·
  // TAL-RAIZ-FALTA se queda en el cuadrado · AL9 reparte la raíz en una suma · TAL-RAIZ-SALE saca el factor sin su raíz ·
  // TAL-RAIZ-SIMP saca el número que no es cuadrado · TAL-SIGNO cambia el signo de una resta · TAL-RAIZ-CUBICA cree que la
  // raíz cúbica de un negativo es positiva · TAL-RAIZ-NOEXISTE cree que no existe · TAL-RAIZ-INDICE usa índice 2 en vez de 3
  // · TAL-RAIZ-NEG da un negativo con x positivo · TAL-RAIZ-LADOS resta los lados en vez de sumar las áreas (18 nov).
  const r1 = ficha('primer radicando'), r2 = ficha('segundo radicando');
  const HU = (datos, k = 6.7) => ({ pieza: HO, datos: Object.assign({ objeto: 'huertos', escala: k }, datos), estado: {} });
  // Una raíz: entera si es exacta; si no, con ≈ y un decimal.
  const raizT = x => { const r = Math.sqrt(x); return Number.isInteger(r) ? String(r) : `≈ ${f(r, 1)}`; };
  const exacta = x => Number.isInteger(Math.sqrt(x));
  const DR = {
    def: 'La raíz cuadrada √a es el número no negativo que, multiplicado por sí mismo, da a',
    lado: 'Lado de un cuadrado = √(área)',
    // a y b con el color de su radicando (auditoría, B11), como m y n en las leyes de la idea 1.
    producto: [{ raiz: [[r1('a'), ' · ', r2('b')]] }, ' = ', { raiz: [r1('a')] }, ' · ', { raiz: [r2('b')] }, ', con a, b ≥ 0'],
    raizAbs: ['√(x²) = ', { abs: ['x'] }],
    abs: '|x| es la distancia de x al cero: |−3| = 3 y |3| = 3',
    cubica: 'La raíz cúbica ∛a es el número que, elevado al cubo, da a',
    cubos: 'Cubos: 2³ = 8, 3³ = 27, 4³ = 64, 5³ = 125',
    semejantes: 'p√t + q√t = (p + q)√t: se suman las raíces iguales',
    cuadrados: 'Cuadrados: 4, 9, 16, 25, 36, 49, 64, 81, 100',
  };
  // Ahora tú 1: la raíz del cuadrado de un número (también negativo).
  function casoCuadrado(r) {
    const k = r.ent(2, 12), x = r.uno([-k, -k, k]);
    return {
      pregunta: `Si x = ${z(x)}, ¿cuánto vale √(x²)?`,
      datos: [DR.def],
      opciones: opcionesP([String(k)], [
        { id: 'x', texto: [z(-k)], error: x < 0 ? 'TAL-RAIZ-X' : 'TAL-RAIZ-NEG', siFuera: x < 0 ? `Elevar al cuadrado primero está bien. Pero √${k * k} es ${k}: la raíz cuadrada no es negativa.` : `Bien que eleves x al cuadrado. Pero la raíz de ${k * k} es ${k}, no un negativo.` },
        { id: 'doble', texto: [`±${k}`], error: 'TAL-RAIZ-DOBLE', siFuera: `±${k} son las soluciones de t² = ${k * k}. El signo √ da una sola: la no negativa.` },
        { id: 'falta', texto: [String(k * k)], error: 'TAL-RAIZ-FALTA', siFuera: `${k * k} es x² y está bien calculado. Falta sacar la raíz.` },
      ]),
      solucion: { texto: 'Primero el cuadrado y después la raíz: da la distancia de x al cero.', ecuacion: [{ raiz: [`(${z(x)})²`] }, ` = √${k * k} = `, res(k)] },
    };
  }
  // Ahora tú 2: dos biohuertos que se juntan (la raíz de una suma).
  function casoJuntar(r) {
    const [p, q, h] = r.uno([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]]);
    return {
      pregunta: ['Un biohuerto cuadrado de ', r1(p * p), ' m² y otro de ', r2(q * q), ' m² se juntan en uno solo, también cuadrado. ¿Cuánto mide su lado?'],
      datos: [DR.lado],
      dibujo: HU({ a: p * p, b: q * q, ladoA: false, ladoB: false, ladoJ: '?', comparar: false }, 0),
      opciones: opcionesP([`${h} m`], [
        { id: 'reparte', texto: [`${p + q} m`], error: 'AL9', siFuera: `Bien que saques las raíces: ${p} y ${q}. Pero la raíz de una suma no es la suma de raíces.` },
        { id: 'falta', texto: [`${p * p + q * q} m`], error: 'TAL-RAIZ-FALTA', siFuera: `${p * p + q * q} m² es el área del biohuerto junto. Falta sacarle la raíz.` },
        { id: 'resta', texto: [`${q - p} m`], error: 'TAL-RAIZ-LADOS', siFuera: `Usar los dos lados está bien, pero restarlos no da el lado del junto: se suman las áreas.` },
      ]),
      solucion: { texto: 'Se suman las áreas y después se saca la raíz.', ecuacion: [{ raiz: [[r1(p * p), ' + ', r2(q * q)]] }, ` = √${h * h} = `, res(`${h} m`)] },
    };
  }
  // Ahora tú 3: el producto de dos raíces.
  function casoProductoRaiz(r) {
    const [A, B] = r.uno([[2, 8], [3, 12], [2, 18], [3, 27], [5, 20], [8, 18], [6, 24], [2, 32], [12, 27]]), k = Math.sqrt(A * B);
    return {
      pregunta: ['¿Cuánto vale ', { raiz: [r1(A)] }, ' · ', { raiz: [r2(B)] }, '?'],
      datos: [DR.producto],
      opciones: opcionesP([String(k)], [
        { id: 'suma', texto: [`√${A + B}`], error: 'AL9', siFuera: `Juntar todo en una raíz está bien. Pero se multiplica: ${A} · ${B}, no ${A} + ${B}.` },
        { id: 'falta', texto: [String(A * B)], error: 'TAL-RAIZ-FALTA', siFuera: `${A} · ${B} = ${A * B} está bien. Falta sacarle la raíz.` },
        { id: 'doble', texto: [`±${k}`], error: 'TAL-RAIZ-DOBLE', siFuera: `${k} está bien, pero una raíz cuadrada da un solo número: el no negativo.` },
      ]),
      solucion: { texto: 'La raíz se reparte en un producto: se juntan en una sola.', ecuacion: [{ raiz: [r1(A)] }, ' · ', { raiz: [r2(B)] }, ' = ', { raiz: [`${A} · ${B}`] }, ` = √${A * B} = `, res(k)] },
    };
  }
  // Ahora tú 4 (nivel examen): la raíz del cuadrado de una resta que sale negativa.
  function casoResta(r) {
    const [k, t, cuenta] = r.uno([['3', 'π', '3 < π'], ['1', '√2', '1 < √2'], ['2', '√5', '2 < √5'], ['4', '√17', '4 < √17'], ['3', '√10', '3 < √10'], ['2', '√7', '2 < √7']]);
    return {
      pregunta: ['Simplifica ', { raiz: [`(${k} − ${t})²`] }, '.'],
      datos: [DR.raizAbs, DR.abs, cuenta],
      opciones: opcionesP([`${t} − ${k}`], [
        { id: 'x', texto: [`${k} − ${t}`], error: 'TAL-RAIZ-X', siFuera: `Quitar la raíz y el cuadrado está bien. Pero ${k} − ${t} es negativo, y la raíz no lo es.` },
        { id: 'doble', texto: [`±(${k} − ${t})`], error: 'TAL-RAIZ-DOBLE', siFuera: 'Pensar en el signo está bien. Pero √ da un solo número: el no negativo.' },
        { id: 'falta', texto: [`(${k} − ${t})²`], error: 'TAL-RAIZ-FALTA', siFuera: 'Esa expresión es lo de adentro, bien copiado. Falta sacarle la raíz.' },
      ]),
      solucion: { texto: `Da |${k} − ${t}|. Como ${cuenta}, la resta es negativa y se le cambia el signo.`, ecuacion: [{ raiz: [`(${k} − ${t})²`] }, ` = |${k} − ${t}| = `, res(`${t} − ${k}`)] },
    };
  }
  // Ahora tú 6: una raíz cúbica, también de un negativo (auditoría, M9: la regla trae ∛ y «Ahora tú» no lo practicaba).
  function casoCubica(r) {
    const k = r.ent(2, 5), neg = r() < 0.6, N = neg ? -(k ** 3) : k ** 3, x = neg ? -k : k;
    return {
      pregunta: ['¿Cuánto vale ', { raiz: [z(N)], indice: e2('3') }, '?'],
      datos: [DR.cubica, DR.cubos],
      opciones: opcionesP([z(x)], [
        { id: 'signo', texto: [z(-x)], error: 'TAL-RAIZ-CUBICA', siFuera: neg ? `Bien el ${k}: ${k}³ = ${k ** 3}. Pero ${z(N)} es negativo, y (${z(-x)})³ no.` : `Bien el ${k}. Pero (${z(-x)})³ es negativo, y ${N} es positivo.` },
        neg ? { id: 'noexiste', texto: ['No existe'], error: 'TAL-RAIZ-NOEXISTE', siFuera: 'Eso pasa con la raíz cuadrada de un negativo. La cúbica sí existe: tres factores negativos dan negativo.' }
          : { id: 'cuadrada', texto: [String(k * k)], error: 'TAL-RAIZ-INDICE', siFuera: `Bien que busques un número por sí mismo. Pero el índice es 3: ${k} · ${k} · ${k}, no ${k} · ${k}.` },
        { id: 'tercio', texto: [N % 3 === 0 ? z(N / 3) : `${z(N)}/3`], error: 'TAL-EXP-POR', siFuera: `Bien: el índice es 3. Pero la raíz no divide entre 3: busca qué número, al cubo, da ${z(N)}.` },
      ]),
      solucion: { texto: `Tres factores ${z(x)} dan ${z(N)}${neg ? ': con índice impar, el signo se queda' : ''}.`, ecuacion: [{ raiz: [z(N)], indice: e2('3') }, ' = ', res(z(x)), `, porque (${z(x)})³ = ${z(N)}`] },
    };
  }
  // Ahora tú 5 (nivel examen): sumar y restar raíces después de simplificarlas.
  function casoSemejantes(r) {
    const t = r.uno([2, 3, 5]);
    let c1, c2, c3;
    do { c1 = r.ent(2, 6); c2 = r.ent(2, 6); c3 = r.ent(2, 5); } while (c1 === c2 || c2 === c3 || c1 === c3 || c1 + c2 - c3 < 1 || c1 * c1 + c2 * c2 <= c3 * c3);
    const [N1, N2, N3] = [c1 * c1 * t, c2 * c2 * t, c3 * c3 * t], e = c1 + c2 - c3, raizC = c => (c === 1 ? `√${t}` : `${c}√${t}`);
    return {
      pregunta: ['Simplifica ', { raiz: [String(N1)] }, ' + ', { raiz: [String(N2)] }, ' − ', { raiz: [String(N3)] }, '.'],
      datos: [DR.producto, DR.semejantes, DR.cuadrados],
      opciones: opcionesP([raizC(e)], [
        { id: 'reparte', texto: [`√${N1 + N2 - N3}`], error: 'AL9', siFuera: 'Juntar en una sola raíz está bien en un producto, no en una suma.' },
        { id: 'signo', texto: [raizC(c1 + c2 + c3)], error: 'TAL-SIGNO', siFuera: `Simplificar cada raíz está bien. Pero la última se resta: ${c1} + ${c2} − ${c3}.` },
        { id: 'sale', texto: [String(e * t)], error: 'TAL-RAIZ-SALE', siFuera: `Bien la cuenta ${c1} + ${c2} − ${c3} = ${e}. Pero el ${t} se queda dentro de la raíz.` },
      ]),
      solucion: { texto: `Se saca de cada raíz su cuadrado; quedan raíces de ${t}, que se suman como cosas iguales.`,
        ecuacion: [`${raizC(c1)} + ${raizC(c2)} − ${raizC(c3)} = `, res(raizC(e))] },
    };
  }

  // Ejemplos resueltos de la idea 2. Cuentas rehechas aparte (scratchpad, cuentas-ideas23.py): √49 = 7; √1600 = 40;
  // √(4 · 25) = 2 · 5 = 10; √25 = 5 contra 3 + 4 = 7; ∛(−27) = −3; √72 = 6√2; √(81 + 144) = 15 contra 9 + 12 = 21;
  // √12 · √3 = 6; 4√50 = 20√2 ≈ 28,3; √12 + √27 = 5√3; √50 + √18 − √8 = 6√2 (errores √60 y 10√2); √72 − √32 = 2√2;
  // ∛(−64) + √81 − ∛8 = 3 (errores 11, 15); √(4x) = 12 con √x = 6 (errores 24, 10, 144); 3√5 = √45, 2√11 = √44, 4√3 = √48.
  // Ninguna figura muestra lo que se pide (va con «?» o sin rótulo).
  const EJEMPLOS_RADICALES = [
    { nivel: 1, titulo: 'El lado del biohuerto',
      enunciado: ['Un biohuerto cuadrado del colegio tiene ', r1(49), ' m² de área. ¿Cuánto mide su lado?'],
      datos: [DR.lado, DR.def],
      figura: HU({ a: 49, b: 0, junto: false, ladoA: '?', nombreA: 'Biohuerto' }, 0),
      solucion: [{ texto: 'El lado es el número que, multiplicado por sí mismo, da el área: 7 · 7 = 49.', ecuacion: [{ raiz: [r1(49)] }, ' = ', res(7)] }],
      respuesta: ['El lado mide ', res('7 m')] },
    { nivel: 1, titulo: 'Una raíz grande',
      enunciado: '¿Cuánto vale √1600?',
      datos: [DR.def],
      solucion: [{ texto: 'Busco el número que, por sí mismo, da 1600. Como 4 · 4 = 16 y 100 = 10 · 10, pruebo 40: 40 · 40 = 1600.', ecuacion: ['√1600 = ', res(40)] }],
      respuesta: ['√1600 = ', res(40)] },
    { nivel: 1, titulo: 'La raíz de un producto',
      enunciado: ['Calcula ', { raiz: [[r1(4), ' · ', r2(25)]] }, ' de dos maneras: multiplicando primero y sacando las raíces primero.'],
      datos: [DR.producto],
      solucion: [{ texto: 'Multiplicando primero: 4 · 25 = 100 y √100 = 10. Sacando las raíces primero: 2 · 5 = 10. Dan lo mismo.', ecuacion: [{ raiz: [[r1(4), ' · ', r2(25)]] }, ' = ', { raiz: [r1(4)] }, ' · ', { raiz: [r2(25)] }, ' = 2 · 5 = ', res(10)] }],
      respuesta: ['Las dos maneras dan ', res(10)] },
    { nivel: 1, titulo: 'La raíz de una suma',
      enunciado: ['¿Es ', { raiz: [[r1(9), ' + ', r2(16)]] }, ' igual a ', { raiz: [r1(9)] }, ' + ', { raiz: [r2(16)] }, '?'],
      datos: [DR.def],
      solucion: [{ texto: 'Primero lo de adentro: 9 + 16 = 25, y √25 = 5. En cambio, √9 + √16 = 3 + 4 = 7.', ecuacion: [{ raiz: [[r1(9), ' + ', r2(16)]] }, ' = ', res(5), ', pero ', { raiz: [r1(9)] }, ' + ', { raiz: [r2(16)] }, ' = 7'] }],
      respuesta: ['No: ', res(5), ' no es 7'] },
    { nivel: 1, titulo: 'Una raíz cúbica',
      enunciado: '¿Cuánto vale ∛(−27)?',
      datos: [DR.cubica],
      solucion: [{ texto: 'Busco el número que, elevado al cubo, da −27. Tres factores negativos dan negativo: (−3) · (−3) · (−3) = −27.', ecuacion: ['∛(−27) = ', res('−3')] }],
      respuesta: ['∛(−27) = ', res('−3')] },
    { nivel: 2, titulo: 'Sacar de la raíz',
      enunciado: 'Simplifica √72: saca de la raíz todo lo que se pueda.',
      datos: [DR.producto, DR.cuadrados],
      solucion: [
        { texto: 'Busco el cuadrado más grande que divide a 72: 36, porque 72 = 36 · 2.', ecuacion: ['√72 = ', { raiz: ['36 · 2'] }] },
        { texto: 'La raíz se reparte en el producto: √36 sale como 6, y el 2 se queda adentro.', ecuacion: [{ raiz: ['36'] }, ' · ', { raiz: ['2'] }, ' = ', res('6√2')] },
      ],
      respuesta: ['√72 = ', res('6√2')] },
    { nivel: 2, titulo: 'Dos biohuertos juntos',
      enunciado: ['Dos biohuertos cuadrados, de ', r1(81), ' m² y de ', r2(144), ' m², se juntan en uno solo, también cuadrado. ¿Cuánto mide su lado, y cuánto los dos lados de antes, uno tras otro?'],
      datos: [DR.lado],
      figura: HU({ a: 81, b: 144, ladoA: false, ladoB: false, ladoJ: '?', areaJ: '?', comparar: false }, 0),
      solucion: [
        { texto: 'El biohuerto junto tiene las dos áreas: 81 + 144 = 225 m². Su lado es la raíz de eso.', ecuacion: [{ raiz: [[r1(81), ' + ', r2(144)]] }, ' = √225 = ', res('15 m')] },
        { texto: 'Los lados de antes miden √81 = 9 m y √144 = 12 m: seguidos, 21 m. El junto queda más corto.', ecuacion: [{ raiz: [r1(81)] }, ' + ', { raiz: [r2(144)] }, ' = 9 + 12 = 21'] },
      ],
      respuesta: ['El lado del junto mide ', res('15 m'), '; los dos de antes, 21 m'] },
    { nivel: 2, titulo: 'Multiplicar dos raíces',
      enunciado: ['¿Cuánto vale ', { raiz: [r1(12)] }, ' · ', { raiz: [r2(3)] }, '?'],
      datos: [DR.producto],
      solucion: [
        { texto: 'Ninguna de las dos raíces es exacta, pero el producto se junta en una sola raíz.', ecuacion: [{ raiz: [r1(12)] }, ' · ', { raiz: [r2(3)] }, ' = ', { raiz: [[r1(12), ' · ', r2(3)]] }, ' = √36'] },
        { texto: '36 sí es un cuadrado: 6 · 6.', ecuacion: ['√36 = ', res(6)] },
      ],
      respuesta: [res(6)] },
    { nivel: 2, titulo: 'El cerco del biohuerto',
      enunciado: ['Un biohuerto cuadrado tiene ', r1(50), ' m². ¿Cuántos metros de cerco necesita para rodearlo?'],
      datos: [DR.lado, 'Perímetro de un cuadrado = 4 · lado', DR.producto, '√2 ≈ 1,414'],
      figura: HU({ a: 50, b: 0, junto: false, ladoA: '?', nombreA: 'Biohuerto' }, 0),
      solucion: [
        { texto: 'El lado es √50. Como 50 = 25 · 2, sale el 5 y queda √2.', ecuacion: [{ raiz: [r1(50)] }, ' = ', { raiz: ['25 · 2'] }, ' = 5√2'] },
        { texto: 'El cerco da la vuelta: cuatro lados.', ecuacion: ['4 · 5√2 = ', res('20√2'), ' ≈ 20 · 1,414 ≈ 28,3'] },
      ],
      respuesta: [res('20√2 m'), ', unos 28,3 m'] },
    { nivel: 2, titulo: 'Sumar raíces',
      enunciado: 'Simplifica √12 + √27.',
      datos: [DR.producto, DR.semejantes, DR.cuadrados],
      solucion: [
        { texto: 'Simplifico cada raíz: 12 = 4 · 3 y 27 = 9 · 3. Las dos quedan con √3.', ecuacion: ['√12 = 2√3', SEP, '√27 = 3√3'] },
        { texto: 'Ahora son raíces iguales: se suman sus números de adelante.', ecuacion: ['2√3 + 3√3 = ', res('5√3')] },
        { texto: 'No es √39: la raíz no se reparte en una suma.' },
      ],
      respuesta: [res('5√3')] },
    { nivel: 3, titulo: 'Tres raíces',
      enunciado: 'Simplifica √50 + √18 − √8.',
      alternativas: ['√60', '6√2', '10√2', '4√2', '6√6'],
      datos: [DR.producto, DR.semejantes, DR.cuadrados],
      solucion: [
        { texto: 'Cada raíz trae un cuadrado y un 2: 50 = 25 · 2, 18 = 9 · 2 y 8 = 4 · 2.', ecuacion: ['5√2 + 3√2 − 2√2'] },
        { texto: 'Se suman y se restan los números de adelante: 5 + 3 − 2 = 6.', ecuacion: ['5√2 + 3√2 − 2√2 = ', res('6√2')] },
        { texto: ['La ', letra('A'), ' junta todo en una raíz: no se reparte en una suma. La ', letra('C'), ' suma también la última; la ', letra('D'), ' cambia los signos; la ', letra('E'), ' cambia √2 por √6.'] },
      ],
      respuesta: [letra('B'), ', ', res('6√2')] },
    { nivel: 3, titulo: 'Cuánto más de cerco',
      enunciado: ['Un biohuerto cuadrado tiene ', r1(72), ' m² y otro, ', r2(32), ' m². ¿Cuántos metros más mide el lado del primero?'],
      alternativas: ['√40 m', '2√2 m', '10√2 m', '2 m', '40 m'],
      datos: [DR.lado, DR.producto, DR.semejantes],
      figura: HU({ a: 72, b: 32, junto: false, ladoA: false, ladoB: false }, 0),
      solucion: [
        { texto: 'Los lados son √72 y √32. Los simplifico: 72 = 36 · 2 y 32 = 16 · 2.', ecuacion: [{ raiz: [r1(72)] }, ' = 6√2', SEP, { raiz: [r2(32)] }, ' = 4√2'] },
        { texto: 'Son raíces iguales: se restan sus números de adelante.', ecuacion: ['6√2 − 4√2 = ', res('2√2')] },
        { texto: ['La ', letra('A'), ' resta las áreas dentro de una raíz; la ', letra('C'), ' suma 6 + 4; la ', letra('D'), ' se olvida de √2; la ', letra('E'), ' resta las áreas, sin raíz.'] },
      ],
      respuesta: [letra('B'), ', ', res('2√2 m'), ', unos 2,8 m'] },
    { nivel: 3, titulo: 'Con raíces cúbicas',
      enunciado: '¿Cuánto vale ∛(−64) + √81 − ∛8?',
      alternativas: ['3', '11', '−3', '15', 'No existe'],
      datos: [DR.def, DR.cubica, 'Cubos: 2³ = 8, 3³ = 27, 4³ = 64'],
      solucion: [
        { texto: 'La raíz cúbica de un negativo existe y es negativa: (−4)³ = −64. Las otras dos: √81 = 9 y ∛8 = 2.', ecuacion: ['∛(−64) = −4', SEP, '√81 = 9', SEP, '∛8 = 2'] },
        { texto: 'Se juntan con sus signos.', ecuacion: ['−4 + 9 − 2 = ', res(3)] },
        { texto: ['La ', letra('B'), ' toma ∛(−64) como 4; la ', letra('E'), ' cree que no existe, como con √; la ', letra('C'), ' cambia todos los signos; la ', letra('D'), ' suma todo: 4 + 9 + 2.'] },
      ],
      respuesta: [letra('A'), ', ', res(3)] },
    { nivel: 3, titulo: 'Sin hallar x',
      enunciado: 'Si √x = 6, ¿cuánto vale √(4x)?',
      alternativas: ['24', '12', '10', '8', '144'],
      datos: [DR.producto],
      solucion: [
        { texto: 'No hace falta hallar x: la raíz se reparte en el producto 4 · x.', ecuacion: [{ raiz: ['4 · x'] }, ' = ', { raiz: ['4'] }, ' · ', { raiz: ['x'] }, ' = 2 · 6 = ', res(12)] },
        { texto: 'Lo reviso: x = 36, 4x = 144 y √144 = 12. Cuadra.' },
        { texto: ['La ', letra('A'), ' saca el 4 sin su raíz; la ', letra('E'), ' se queda en 4x; la ', letra('C'), ' y la ', letra('D'), ' suman 4 + 6 y 2 + 6 en vez de multiplicar.'] },
      ],
      respuesta: [letra('B'), ', ', res(12)] },
    { nivel: 3, titulo: 'El mayor de tres',
      enunciado: '¿Cuál de estos números es el mayor: 3√5, 2√11 o 4√3?',
      alternativas: ['3√5', '2√11', '4√3', 'Son iguales', 'No se puede saber'],
      datos: ['k√a = √(k² · a), con k ≥ 0', 'Entre dos raíces cuadradas, es mayor la de mayor radicando'],
      solucion: [
        { texto: 'Meto el número de adelante en la raíz, elevándolo al cuadrado.', ecuacion: ['3√5 = √45', SEP, '2√11 = √44', SEP, '4√3 = √48'] },
        { texto: 'Ahora se comparan los radicandos: 48 es el mayor.', ecuacion: ['√48 > √45 > √44   →   ', res('4√3'), ' es el mayor'] },
        { texto: ['La ', letra('B'), ' mira solo el número de adentro, 11; la ', letra('A'), ' queda segunda: √45 < √48; la ', letra('D'), ' y la ', letra('E'), ' no ven que, metidos, se comparan.'] },
      ],
      respuesta: [letra('C'), ', ', res('4√3')] },
  ];

  const radicales = {
    id: 'radicales',
    titulo: 'La raíz cuadrada es un lado',
    pregunta: '¿Qué número da la raíz cuadrada, y cuándo se puede repartir?',
    temas: ['Propiedades de radicales'],
    pieza: HO,
    aprendizaje: '√a es el lado de un cuadrado de área a, nunca negativo: √(x²) = |x|. La raíz se reparte en un producto, no en una suma.',
    actividad: 'Juntar dos biohuertos cuadrados en uno solo y comparar sus lados.',
    // Lee: el biohuerto, la raíz y el radicando. No dice que la raíz no es negativa ni habla de negativos al cuadrado
    // (es la predicción); el valor absoluto llega en «Mira».
    lee: {
      tarjetas: [
        { titulo: 'El lado de un biohuerto', texto: 'En el colegio hay un biohuerto cuadrado de 36 m². Su lado es el número que, multiplicado por sí mismo, da 36: mide 6 m, porque 6 · 6 = 36. Ese número es la raíz cuadrada de 36.',
          pieza: HO, dibujo: HU({ a: 36, b: 0, junto: false, nombreA: 'Biohuerto' }) },
        { titulo: 'Raíz y radicando', texto: 'Se escribe √36 = 6 y se lee «raíz cuadrada de 36». Lo que va debajo del signo √ es el radicando: aquí, el área del biohuerto. El resultado es su lado.',
          ecuacion: [{ raiz: [r1(36)] }, ' = 6, porque 6 · 6 = 36'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir el área de dos biohuertos. Al lado aparece uno solo, con las dos áreas juntas. Compara su lado con los dos lados de antes, puestos uno tras otro.' },
      ],
    },
    ejemplos: EJEMPLOS_RADICALES,
    juega: {
      pieza: HO,
      consigna: 'El colegio junta dos biohuertos cuadrados en uno solo, también cuadrado. Las barras de abajo comparan los lados.',
      mision: {
        texto: 'Elige las dos áreas para que el biohuerto junto mida 100 m².',
        logrado: val => val.a + val.b === 100,
        bien: 'Listo: el junto mide 10 m de lado, menos que los dos lados de antes seguidos.',
      },
      voz: 'Compara el lado del junto con los dos lados seguidos.',
      // Con letras y palabras, sin los valores de la misión cumplida (auditoría, M1).
      leyenda: [
        { s: r1('a'), t: 'área del biohuerto 1 (m²): el radicando' },
        { s: r2('b'), t: 'área del biohuerto 2 (m²)' },
        { s: r1('√a'), t: 'lado del biohuerto 1, en m' },
        { s: r2('√b'), t: 'lado del biohuerto 2, en m' },
        { s: res('√(a + b)'), t: 'lado del biohuerto que junta las dos áreas' },
        { s: 'barras', t: 'los dos lados seguidos contra el del junto' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Área del biohuerto 1, a (m²)', color: 'c-o', min: 1, max: 100, paso: 1, inicio: 36, decimales: 0 },
        { id: 'b', etiqueta: 'Área del biohuerto 2, b (m²)', color: 'c-i', min: 1, max: 100, paso: 1, inicio: 49, decimales: 0 },
      ],
      dibujo: v => HU({ a: v.a, b: v.b }),
      // La relación: la raíz de la suma es menor que la suma de las raíces.
      lectura: v => {
        const s = Math.sqrt(v.a) + Math.sqrt(v.b), ex = exacta(v.a) && exacta(v.b);
        return [r1(`√${v.a}`), ' + ', r2(`√${v.b}`), ` ${ex ? '=' : '≈'} ${f(s, ex ? 0 : 1)}; pero `, res(`√${v.a + v.b}`), ` ${exacta(v.a + v.b) ? '=' : '≈'} ${f(Math.sqrt(v.a + v.b), exacta(v.a + v.b) ? 0 : 1)}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Un compañero dice que la raíz y el cuadrado se cancelan, así que √((−5)²) = −5. ¿Cuánto vale √((−5)²)?',
      datos: ['(−5)² = (−5) · (−5) = 25'],
      voz: 'Primero el cuadrado; después, la raíz.',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'menos', texto: '−5', error: 'TAL-RAIZ-X', siFuera: 'Sería cierto si √(x²) fuera siempre x. Pero √25 es 5: la raíz cuadrada no es negativa.' },
        { id: 'doble', texto: '±5', error: 'TAL-RAIZ-DOBLE', siFuera: '±5 son las dos soluciones de x² = 25. El signo √ da una sola: la no negativa.' },
        { id: 'cuadrado', texto: '25', error: 'TAL-RAIZ-FALTA', siFuera: 'Bien calculado (−5)² = 25. Falta sacarle la raíz.' },
      ],
      // Un cuadrado de (−5)² = 25 m² con su lado por hallar (auditoría, M6: el plano con y = x no decía nada y empujaba
      // hacia −5). El plano queda para «Mira» y la regla, donde se explica.
      dibujo: HU({ a: 25, b: 0, junto: false, ladoA: '?', nombreA: 'Un cuadrado de (−5)² m²' }),
      revelar: HU({ a: 25, b: 0, junto: false, nombreA: 'Su lado mide 5 m, no −5 m' }),
      coincide: 'Coincide: (−5)² = 25, y la raíz cuadrada de 25 es 5.',
      noCoincide: 'Revisemos: primero (−5)² = 25; después, √25 es el número no negativo que, al cuadrado, da 25.',
    },
    mira: {
      pieza: 'ejes',
      datos: ejesRaiz({
        curvas: [{ puntos: [[-6, -6], [6, 6]], discontinua: true, rotulo: 'y = x', en: [4, 4], desde: 1 },
          { puntos: VX.filter(x => x >= 0).map(x => [x, x]), color: 'f', desde: 1 },
          { puntos: VX.filter(x => x <= 0).map(x => [x, -x]), color: 'f', rotulo: 'y = √(x²)', en: [-6, 6], desde: 2 }],
        puntos: [{ x: -3, y: 3, color: 'f', rotulo: '|−3| = 3', guias: true, desde: 3 }],
        alt: 'Raíz de x al cuadrado coincide con x si x es positivo y con −x si es negativo: es |x|',
      }),
      voz: 'Probemos con positivos y con negativos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Si x no es negativo, √(x²) vuelve a ser x.', ecuacion: [{ raiz: ['3²'] }, ' = √9 = 3'] },
        { estado: { corte: 2 }, texto: 'Si x es negativo, el cuadrado borra el signo: la raíz da positivo.', ecuacion: [{ raiz: ['(−3)²'] }, ' = √9 = 3'] },
        { estado: { corte: 3 }, texto: 'Siempre da la distancia de x al cero: su valor absoluto, |x|.', ecuacion: [{ raiz: ['x²'] }, ' = ', { llave: [{ abs: ['x'] }], nota: 'nunca negativo', color: 'c-f' }] },
        { estado: { corte: 3 }, texto: 'En un producto, la raíz se reparte; en una suma, no.', ecuacion: [{ raiz: ['9 · 16'] }, ' = 3 · 4 = 12', SEP, { raiz: ['9 + 16'] }, ' = 5, no 3 + 4'] },
        { estado: { corte: 3 }, texto: 'Con índice 3, el número chico, es la raíz cúbica: sí da negativos.', ecuacion: [{ raiz: ['−8'], indice: e2('3') }, ' = −2, porque (−2)³ = −8'] },
      ],
    },
    regla: {
      texto: 'La raíz cuadrada √a es el número no negativo que, al cuadrado, da a. Por eso √(x²) = |x|. La raíz se reparte en un producto, nunca en una suma.',
      ecuacion: [{ raiz: ['x²'] }, ' = ', { llave: [{ abs: ['x'] }], nota: 'nunca negativo', color: 'c-f' }, SEP,
        { raiz: [[r1('a'), ' · ', r2('b')]] }, ' = ', { llave: [[{ raiz: [r1('a')] }, ' · ', { raiz: [r2('b')] }]], nota: 'se reparte', color: 'c-f' }, SEP,
        { raiz: [[r1('a'), ' + ', r2('b')]] }, ' ≠ ', { raiz: [r1('a')] }, ' + ', { raiz: [r2('b')] }],
      condicion: 'a, b ≥ 0. |x| es la distancia de x al cero: |−5| = 5. La raíz cúbica sí admite negativos: ∛(−8) = −2.',
      voz: 'Primero lo de adentro; la raíz al final.',
    },
    // Así se resuelve: sacar de una raíz su cuadrado más grande. «Ahora tú» pide otra cosa: la raíz del cuadrado de un
    // número, dos biohuertos que se juntan, un producto de raíces, una resta que sale negativa o una suma de raíces.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), c = r.ent(2, 7), t = r.uno([2, 3, 5, 6, 7]), N = c * c * t;
        return {
          enunciado: `Saca de la raíz todo lo que se pueda: simplifica √${N}.`,
          datos: [DR.producto, DR.cuadrados],
          pasos: [
            { tipo: 'pide', texto: `Piden escribir √${N} con el número más chico posible dentro de la raíz.` },
            { tipo: 'regla', texto: 'La raíz se reparte en un producto. Si separo un cuadrado, su raíz sale entera.', ecuacion: DR.producto },
            { tipo: 'cuentas', texto: `Busco el cuadrado más grande que divide a ${N}: ${c * c}, porque ${N} = ${c * c} · ${t}.`, ecuacion: [`√${N} = `, { raiz: [`${c * c} · ${t}`] }, ` = √${c * c} · √${t} = `, res(`${c}√${t}`)] },
            { tipo: 'sentido', texto: `Lo reviso al revés: (${c}√${t})² = ${c * c} · ${t} = ${N}. Y en ${t} ya no queda ningún cuadrado.` },
          ],
          respuesta: [`√${N} = `, res(`${c}√${t}`)],
        };
      },
    },
    ahoraTu: {
      pieza: HO,
      voz: 'Primero lo de adentro; la raíz al final.',
      generar(sem) {
        const r = azar(sem + 47), tipo = sem % 6;
        if (tipo === 0) return conCuatro(casoCuadrado, r);
        if (tipo === 1) return conCuatro(casoJuntar, r);
        if (tipo === 2) return conCuatro(casoProductoRaiz, r);
        if (tipo === 3) return conCuatro(casoResta, r);
        if (tipo === 4) return conCuatro(casoSemejantes, r);
        return conCuatro(casoCubica, r);
      },
    },
  };

  // ---------- Idea 3 (nueva, 18 nov): la raíz es un exponente fraccionario ----------
  // Propuesta aprobada (idea 3). Objeto de la primera pantalla: una caja cúbica de cartón de V dm³ al lado de una loseta
  // cuadrada de V dm² (pieza alg-objeto, objeto 'caja'). Cambia: el exponente (1/3, 1/2, 1, 2 o 3) y el número (8, 27 o 64). ·
  // Permanece: la caja, la loseta y su escala. · Progresa: el exponente que da la arista y el que da el lado. · Se
  // reserva: un exponente como 2/3 (la predicción: 27^(2/3) es el área de la tapa). · Debe verse: elevar a 1/n deshace
  // elevar a n: es la raíz de índice n.
  // Letras: m es el exponente de lo de adentro (naranja, como en la idea 1) y n el índice (turquesa): en la idea 1, n era
  // el segundo exponente; «Lee» lo avisa (propuesta §5). El resultado, violeta; la base y el número, en tinta.
  // Ningún ejemplo usa la tapa de una caja ni 27^(2/3) (es la predicción); los demás m/n sí.
  // Errores (hipótesis de diseño): TAL-EXP-POR multiplica la base por el exponente (27 · 2/3) · TAL-FRAC-MEDIO saca la raíz
  // y se olvida del m · TAL-FRAC-INVIERTE invierte índice y exponente · TAL-FRAC-ANIDA no aplica la raíz de afuera a
  // la de adentro · TAL-FRAC-AFUERA se olvida de la raíz de afuera · TAL-FRAC-SUMA suma numeradores y denominadores ·
  // TAL-FRAC-DIVIDE divide donde se multiplica · TAL-EXP-SUMA suma el índice al exponente · TAL-FRAC-RESTA le resta el
  // índice al exponente.
  const CJ = (datos) => ({ pieza: HO, datos: Object.assign({ objeto: 'caja' }, datos), estado: {} });
  const mcdN = (u, w) => (w ? mcdN(w, u % w) : Math.abs(u));
  // Una fracción simplificada como texto: 4/6 → «2/3», 6/3 → «2».
  const fq = (p, q) => { const g = mcdN(p, q) || 1, a1 = p / g, b1 = q / g; return b1 === 1 ? String(a1) : `${a1}/${b1}`; };
  // Una raíz de índice n escrita en el texto: ⁵√(x³).
  const SUPI = { 2: '', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷' };
  const raizI = (n, dentro) => `${SUPI[n] || n}√${dentro}`;
  const DF = {
    def: [pw('a', ['1/', nn]), ' = ', { raiz: ['a'], indice: nn }, ': el número que, elevado a ', nn, ', da a'],
    dos: ['√a = ', pw('a', ['1/', e2('2')]), ': la raíz cuadrada tiene índice ', e2('2')],
    mn: [pw('a', [mm, '/', nn]), ' = ', { raiz: [pw('a', mm)], indice: nn }, ' = ', { sup: [{ par: [{ raiz: ['a'], indice: nn }] }, mm] }],
    producto: LEY.producto,
    potencia: LEY.potencia,
    igualar: LEY.igualar,
  };
  // Ahora tú 1: de raíz a potencia de exponente fraccionario.
  // x elevado a 1 se escribe x (auditoría, B15).
  const xe = (k, exp) => (k === 1 ? 'x' : pw('x', exp === undefined ? String(k) : exp));
  function casoARaiz(r) {
    const n = r.uno([3, 4, 5, 7]), m = r.uno([1, 2, 3, 4, 5, 6].filter(x => x !== n && mcdN(x, n) === 1));
    const op = (p, q) => [pw('x', fq(p, q))];
    return {
      pregunta: ['Escribe ', { raiz: [xe(m, e1(m))], indice: e2(String(n)) }, ' con un exponente fraccionario.'],
      datos: [DF.mn],
      opciones: opcionesP(op(m, n), [
        { id: 'invierte', texto: op(n, m), error: 'TAL-FRAC-INVIERTE', siFuera: `Usar ${m} y ${n} en una fracción está bien. Pero el índice ${n} va abajo: la raíz divide.` },
        { id: 'por', texto: [pw('x', String(m * n))], error: 'TAL-EXP-POR', siFuera: `Bien que juntes ${m} y ${n}. Pero sacar raíz divide el exponente, no lo multiplica.` },
        { id: 'resta', texto: [pw('x', z(m - n))], error: 'TAL-FRAC-RESTA', siFuera: `La raíz sí cambia el exponente, es cierto. Pero lo divide entre ${n}: no le resta ${n}.` },
      ]),
      solucion: { texto: 'El exponente de adentro va arriba y el índice, abajo.', ecuacion: [{ raiz: [xe(m, e1(m))], indice: e2(String(n)) }, ' = ', pw('x', res(fq(m, n)))] },
    };
  }
  // Ahora tú 2: el valor de una potencia de exponente fraccionario.
  function casoValorFrac(r) {
    const [B, m, n] = r.uno([[8, 2, 3], [16, 3, 4], [32, 2, 5], [4, 3, 2], [9, 3, 2], [25, 3, 2], [64, 2, 3], [81, 3, 4], [125, 2, 3], [16, 5, 4]]);
    const raiz = Math.round(B ** (1 / n)), ans = raiz ** m;
    const otro = B ** (n / m), otroT = Number.isInteger(Math.round(otro * 1e6) / 1e6) ? String(Math.round(otro)) : `≈ ${f(otro, 1)}`;
    return {
      pregunta: ['¿Cuánto vale ', pw(B, [e1(m), '/', e2(n)]), '?'],
      datos: [DF.mn],
      opciones: opcionesP([String(ans)], [
        { id: 'por', texto: [fq(B * m, n)], error: 'TAL-EXP-POR', siFuera: `Usar ${m}/${n} está bien. Pero no se multiplica ${B} por ${m}/${n}: se saca raíz y se eleva.` },
        { id: 'medio', texto: [String(raiz)], error: 'TAL-FRAC-MEDIO', siFuera: `Bien la raíz: ${raizI(n, B)} = ${raiz}. Falta elevarla a ${m}.` },
        { id: 'invierte', texto: [otroT], error: 'TAL-FRAC-INVIERTE', siFuera: `Elevar y sacar raíz está bien. Pero el índice es ${n}, el de abajo: aquí se invirtió.` },
      ]),
      solucion: { texto: 'Primero la raíz, que sale exacta; después, la potencia.', ecuacion: [pw(B, [e1(m), '/', e2(n)]), ' = ', { sup: [{ par: [{ raiz: [String(B)], indice: n === 2 ? undefined : e2(String(n)) }] }, e1(m)] }, ` = ${raiz}${sup(m)} = `, res(ans)] },
    };
  }
  // Ahora tú 3 (nivel examen): la suma de tres potencias de exponente fraccionario.
  function casoSumaFrac(r) {
    const P = [[8, 2, 3], [16, 3, 4], [32, 2, 5], [4, 3, 2], [9, 3, 2], [27, 1, 3], [64, 1, 2], [16, 1, 4], [81, 1, 2]];
    let a, b, c;
    do { a = r.uno(P); b = r.uno(P); c = r.uno(P); } while (a === b || b === c || a === c);
    const val = ([B, m, n]) => Math.round(B ** (1 / n)) ** m, ans = val(a) + val(b) - val(c);
    const pot = ([B, m, n]) => pw(B, `${m}/${n}`);
    return {
      pregunta: ['¿Cuánto vale ', pot(a), ' + ', pot(b), ' − ', pot(c), '?'],
      datos: [DF.mn],
      opciones: opcionesP([z(ans)], [
        { id: 'signo', texto: [z(val(a) + val(b) + val(c))], error: 'TAL-SIGNO', siFuera: `Cada valor está bien. Pero el último se resta: ${val(a)} + ${val(b)} − ${val(c)}.` },
        { id: 'medio', texto: [z(Math.round(a[0] ** (1 / a[2])) + Math.round(b[0] ** (1 / b[2])) - Math.round(c[0] ** (1 / c[2])))], error: 'TAL-FRAC-MEDIO', siFuera: 'Bien las raíces. Pero falta elevar cada una a su numerador.' },
        { id: 'por', texto: [z(Math.round(a[0] * a[1] / a[2] + b[0] * b[1] / b[2] - c[0] * c[1] / c[2]))], error: 'TAL-EXP-POR', siFuera: 'Usar cada fracción está bien. Pero no multiplica la base: es raíz y potencia.' },
      ]),
      solucion: { texto: 'Cada potencia: primero su raíz, después su exponente de arriba.', ecuacion: [`${val(a)} + ${val(b)} − ${val(c)} = `, res(z(ans))] },
    };
  }
  // Ahora tú 4 (nivel examen): una raíz dentro de otra, como una sola potencia.
  function casoAnidado(r) {
    const a = r.ent(1, 3), b = r.uno([1, 2]);
    // √(xᵃ · ∛(xᵇ)) = x^((a + b/3)/2) = x^((3a + b)/6)
    const op = (p, q) => [pw('x', fq(p, q))];
    return {
      pregunta: ['Escribe ', { raiz: [[xe(a), ' · ', { raiz: [xe(b)], indice: e2('3') }]] }, ' como una sola potencia de x.'],
      datos: [DF.mn, DF.producto, DF.potencia],
      opciones: opcionesP(op(3 * a + b, 6), [
        { id: 'afuera', texto: op(3 * a + b, 3), error: 'TAL-FRAC-AFUERA', siFuera: `Juntar x${a === 1 ? '' : sup(a)} con la raíz cúbica está bien. Falta la raíz de afuera: todo se divide entre 2.` },
        { id: 'anida', texto: op(3 * a + 2 * b, 6), error: 'TAL-FRAC-ANIDA', siFuera: `Bien x${a === 1 ? '' : sup(a)} entre 2. Pero la raíz de afuera también divide al ${b}/3: queda ${b}/6.` },
        { id: 'suma', texto: op(a + b, 5), error: 'TAL-FRAC-SUMA', siFuera: 'Sumar exponentes en el producto está bien, pero las fracciones no se suman arriba con arriba y abajo con abajo.' },
      ]),
      solucion: { texto: 'De adentro hacia afuera: el producto suma los exponentes y la raíz cuadrada los divide entre 2.', ecuacion: [pw('x', `(${a} + ${b}/3)/2`), ' = ', pw('x', res(fq(3 * a + b, 6)))] },
    };
  }
  // Ahora tú 5 (nivel examen): hallar el exponente que está dentro de una raíz.
  function casoEcuacionRaiz(r) {
    const n = r.uno([2, 3, 4]), k = r.ent(2, 5), x0 = n * k;
    const op = v => [`x = ${v}`];
    return {
      pregunta: ['Halla x si ', { raiz: [pw('2', 'x')], indice: n === 2 ? undefined : e2(String(n)) }, ` = ${2 ** k}.`],
      datos: [`${2 ** k} = 2${sup(k)}`, DF.mn, DF.igualar],
      opciones: opcionesP(op(x0), [
        { id: 'divide', texto: op(fq(k, n)), error: 'TAL-FRAC-DIVIDE', siFuera: `Igualar exponentes está bien: x/${n} = ${k}. Pero se despeja multiplicando por ${n}.` },
        { id: 'olvida', texto: op(k), error: 'TAL-FRAC-AFUERA', siFuera: `Bien que escribas ${2 ** k} como 2${sup(k)}. Pero la raíz divide el exponente: x/${n}.` },
        { id: 'suma', texto: op(k + n), error: 'TAL-EXP-SUMA', siFuera: `Usar el ${k} y el índice ${n} está bien, pero la raíz divide entre ${n}: no se suma.` },
      ]),
      solucion: { texto: 'Se escribe todo como potencia de 2 y se igualan los exponentes.', ecuacion: [pw('2', `x/${n}`), ' = ', pw('2', String(k)), `   →   x/${n} = ${k}   →   x = `, res(x0)] },
    };
  }

  // Ejemplos resueltos de la idea 3. Cuentas rehechas aparte (scratchpad, cuentas-ideas23.py): 125^(1/3) = 5; ⁵√(x³) =
  // x^(3/5); x^(4/7) = ⁷√(x⁴); 81^(1/4) = 3; 49^(1/2) = 7; 32^(2/5) = 4; ∛(x²) · ∛(x⁴) = x²; √(∛x) = x^(1/6); 64^(2/6) = 4;
  // 16^(1/2) + 16^(1/4) + 16^(3/4) = 14; √(x · ∛(x²)) = x^(5/6) (errores x^(5/3), x^(7/6), x^(3/5)); 8^(2/3) + 16^(3/4) −
  // 27^(1/3) = 9 (error 15); ∛(2ˣ) = 32 → x = 15 (errores 5/3, 8, 96); ∛3 > √2 (9 > 8); ⁴√(8√2) = 2^(7/8) (errores 2^(7/2),
  // 2^(3/4)). La caja va solo en el ejemplo 1 (su arista, con «?»): ningún ejemplo usa la tapa (es la predicción).
  const EJEMPLOS_FRACCIONARIO = [
    { nivel: 1, titulo: 'La arista de la caja',
      enunciado: 'Una caja cúbica de cartón tiene 125 dm³. Escribe su arista como una potencia de 125 y calcúlala.',
      datos: [DF.def, '5³ = 125'],
      figura: CJ({ V: 125, loseta: false, arista: '?' }),
      solucion: [{ texto: 'La arista es el número que, elevado al cubo, da 125: la raíz cúbica, que es elevar a 1/3.', ecuacion: [pw('125', ['1/', e2('3')]), ' = ∛125 = ', res('5')] }],
      respuesta: ['La arista es ', pw('125', '1/3'), ' = ', res('5 dm')] },
    { nivel: 1, titulo: 'De raíz a potencia',
      enunciado: ['Escribe ', { raiz: [pw('x', e1('3'))], indice: e2('5') }, ' con un exponente fraccionario.'],
      datos: [DF.mn],
      solucion: [{ texto: 'El exponente de adentro, 3, va arriba; el índice, 5, va abajo.', ecuacion: [{ raiz: [pw('x', e1('3'))], indice: e2('5') }, ' = ', pw('x', [e1('3'), '/', e2('5')])] }],
      respuesta: [pw('x', res('3/5'))] },
    { nivel: 1, titulo: 'De potencia a raíz',
      enunciado: ['Escribe ', pw('x', [e1('4'), '/', e2('7')]), ' como una raíz.'],
      datos: [DF.mn],
      solucion: [{ texto: 'El de abajo, 7, es el índice de la raíz; el de arriba, 4, es el exponente de adentro.', ecuacion: [pw('x', [e1('4'), '/', e2('7')]), ' = ', { raiz: [pw('x', e1('4'))], indice: e2('7') }] }],
      respuesta: [{ raiz: [pw('x', res('4'))], indice: e2('7') }] },
    { nivel: 1, titulo: 'Una raíz cuarta',
      enunciado: ['¿Cuánto vale ', pw('81', ['1/', e2('4')]), '?'],
      datos: [DF.def],
      solucion: [{ texto: 'Elevar a 1/4 es sacar la raíz cuarta: el número que, multiplicado 4 veces por sí mismo, da 81. Es 3: 3 · 3 · 3 · 3 = 81.', ecuacion: [pw('81', ['1/', e2('4')]), ' = ', { raiz: ['81'], indice: e2('4') }, ' = ', res(3)] }],
      respuesta: [res(3)] },
    { nivel: 1, titulo: 'El lado de la loseta',
      enunciado: 'Una loseta cuadrada tiene 49 dm². ¿A qué exponente hay que elevar 49 para obtener su lado, y cuánto mide?',
      datos: [DF.def],
      solucion: [{ texto: 'El lado es la raíz cuadrada del área, y sacar raíz cuadrada es elevar a 1/2.', ecuacion: [pw('49', ['1/', e2('2')]), ' = √49 = ', res('7')] }],
      respuesta: ['A ', e2('1/2'), '; el lado mide ', res('7 dm')] },
    { nivel: 2, titulo: 'Raíz y después potencia',
      enunciado: ['¿Cuánto vale ', pw('32', [e1('2'), '/', e2('5')]), '?'],
      datos: [DF.mn, '2⁵ = 32'],
      solucion: [
        { texto: 'Primero la raíz quinta de 32: el número que, elevado a 5, da 32. Es 2.', ecuacion: [{ raiz: ['32'], indice: e2('5') }, ' = 2'] },
        { texto: 'Después, el exponente de arriba: 2 al cuadrado.', ecuacion: [pw('32', [e1('2'), '/', e2('5')]), ' = ', pw('2', e1('2')), ' = ', res(4)] },
      ],
      respuesta: [res(4)] },
    { nivel: 2, titulo: 'Dos raíces cúbicas',
      enunciado: ['Escribe ', { raiz: [pw('x', e1('2'))], indice: e2('3') }, ' · ', { raiz: [pw('x', e2('4'))], indice: e2('3') }, ' como una sola potencia de x.'],
      datos: [DF.mn, DF.producto],
      solucion: [
        { texto: 'Cada raíz pasa a exponente fraccionario: arriba el exponente de adentro, abajo el índice 3.', ecuacion: [pw('x', [e1('2'), '/3']), ' · ', pw('x', [e2('4'), '/3'])] },
        { texto: 'Misma base: se suman los exponentes, 2/3 + 4/3 = 6/3 = 2.', ecuacion: [pw('x', '2/3 + 4/3'), ' = ', pw('x', res('2'))] },
      ],
      respuesta: [pw('x', res('2'))] },
    { nivel: 2, titulo: 'Una raíz dentro de otra',
      enunciado: ['Escribe ', { raiz: [{ raiz: ['x'], indice: e2('3') }] }, ' como una sola raíz.'],
      datos: [DF.mn, DF.dos, DF.potencia],
      solucion: [
        { texto: 'La de adentro es x elevado a 1/3. La de afuera, raíz cuadrada, eleva todo a 1/2.', ecuacion: [{ sup: [{ par: [pw('x', '1/3')] }, '1/2'] }] },
        { texto: 'Potencia de una potencia: se multiplican, 1/3 · 1/2 = 1/6.', ecuacion: [pw('x', res('1/6')), ' = ', { raiz: ['x'], indice: e2('6') }] },
      ],
      respuesta: [{ raiz: ['x'], indice: e2('6') }, ' = ', pw('x', res('1/6'))] },
    { nivel: 2, titulo: 'Simplificar el exponente',
      enunciado: ['¿Cuánto vale ', pw('64', [e1('2'), '/', e2('6')]), '?'],
      datos: [DF.mn, 'Una fracción se simplifica dividiendo arriba y abajo entre lo mismo'],
      solucion: [
        { texto: 'El exponente 2/6 se simplifica: es 1/3.', ecuacion: [pw('64', '2/6'), ' = ', pw('64', '1/3')] },
        { texto: 'Elevar a 1/3 es sacar raíz cúbica: 4 · 4 · 4 = 64.', ecuacion: [pw('64', '1/3'), ' = ∛64 = ', res(4)] },
      ],
      respuesta: [res(4)] },
    { nivel: 2, titulo: 'Tres potencias de 16',
      enunciado: ['¿Cuánto vale ', pw('16', '1/2'), ' + ', pw('16', '1/4'), ' + ', pw('16', '3/4'), '?'],
      datos: [DF.mn],
      solucion: [
        { texto: 'Raíz cuadrada de 16: 4. Raíz cuarta de 16: 2, porque 2 · 2 · 2 · 2 = 16.', ecuacion: [pw('16', '1/2'), ' = 4', SEP, pw('16', '1/4'), ' = 2'] },
        { texto: '16 elevado a 3/4 es la raíz cuarta elevada al cubo: 2³ = 8. Se suman los tres.', ecuacion: ['4 + 2 + 8 = ', res(14)] },
      ],
      respuesta: [res(14)] },
    { nivel: 3, titulo: 'Una raíz anidada',
      enunciado: ['Escribe ', { raiz: [['x · ', { raiz: [pw('x', '2')], indice: e2('3') }]] }, ' como una sola potencia de x.'],
      alternativas: [[pw('x', '5/6')], [pw('x', '5/3')], [pw('x', '1/3')], [pw('x', '7/6')], [pw('x', '3/5')]],
      datos: [DF.mn, DF.producto, DF.potencia],
      solucion: [
        { texto: 'Adentro, x por x elevado a 2/3: misma base, se suman los exponentes, 1 + 2/3 = 5/3.', ecuacion: ['x · ', pw('x', '2/3'), ' = ', pw('x', '5/3')] },
        { texto: 'Afuera, la raíz cuadrada divide ese exponente entre 2.', ecuacion: [{ sup: [{ par: [pw('x', '5/3')] }, '1/2'] }, ' = ', pw('x', res('5/6'))] },
        { texto: ['La ', letra('B'), ' olvida la raíz de afuera; la ', letra('D'), ' divide solo la x: 1/2 + 2/3; la ', letra('C'), ' olvida la x; la ', letra('E'), ' invierte 5/3.'] },
      ],
      respuesta: [letra('A'), ', ', pw('x', res('5/6'))] },
    { nivel: 3, titulo: 'Sumar y restar potencias',
      enunciado: ['¿Cuánto vale ', pw('8', '2/3'), ' + ', pw('16', '3/4'), ' − ', pw('27', '1/3'), '?'],
      alternativas: ['15', '9', '13', '3', '21'],
      datos: [DF.mn],
      solucion: [
        { texto: 'Cada potencia: primero su raíz, después el exponente de arriba.', ecuacion: [pw('8', '2/3'), ' = 2² = 4', SEP, pw('16', '3/4'), ' = 2³ = 8', SEP, pw('27', '1/3'), ' = 3'] },
        { texto: 'Se juntan con sus signos.', ecuacion: ['4 + 8 − 3 = ', res(9)] },
        { texto: ['La ', letra('A'), ' suma el 3; la ', letra('C'), ' hace 16 · 3/4 = 12; la ', letra('D'), ' toma 27 elevado a 1/3 como 27 ÷ 3 = 9; la ', letra('E'), ', además, lo suma.'] },
      ],
      respuesta: [letra('B'), ', ', res(9)] },
    { nivel: 3, titulo: 'El exponente escondido',
      enunciado: ['Halla x si ', { raiz: [pw('2', 'x')], indice: e2('3') }, ' = 32.'],
      alternativas: ['5/3', '8', '15', '96', '2'],
      datos: ['32 = 2⁵', DF.mn, DF.igualar],
      solucion: [
        { texto: 'La raíz cúbica divide el exponente entre 3, y 32 es 2⁵.', ecuacion: [pw('2', 'x/3'), ' = ', pw('2', '5')] },
        { texto: 'Igualo exponentes y despejo multiplicando por 3.', ecuacion: ['x/3 = 5   →   x = ', res(15)] },
        { texto: ['La ', letra('A'), ' divide entre 3 en vez de multiplicar; la ', letra('B'), ' suma el índice: 5 + 3; la ', letra('D'), ' multiplica 32 · 3; la ', letra('E'), ' toma la base 2 como x.'] },
      ],
      respuesta: [letra('C'), ', x = ', res(15)] },
    { nivel: 3, titulo: 'Cuál es mayor',
      enunciado: '¿Cuál es mayor: ∛3 o √2?',
      alternativas: ['∛3', '√2', 'Son iguales', 'No se puede saber'],
      datos: [DF.mn, DF.potencia, 'Si a, b > 0 y k es un entero positivo, a > b cuando aᵏ > bᵏ'],
      solucion: [
        { texto: 'Escribo los dos con exponente: 3 elevado a 1/3 y 2 elevado a 1/2. Los elevo a 6, múltiplo de 3 y de 2.', ecuacion: [{ sup: [{ par: [pw('3', '1/3')] }, '6'] }, ' = 3² = 9', SEP, { sup: [{ par: [pw('2', '1/2')] }, '6'] }, ' = 2³ = 8'] },
        { texto: '9 es mayor que 8, así que ∛3 es mayor que √2.', ecuacion: ['∛3 ≈ 1,44 > √2 ≈ 1,41'] },
        { texto: ['La ', letra('B'), ' cree que la raíz cuadrada da más porque su índice es menor; la ', letra('C'), ' y la ', letra('D'), ' no ven que, elevando a 6, se pueden comparar.'] },
      ],
      respuesta: [letra('A'), ', ', res('∛3')] },
    { nivel: 3, titulo: 'Raíz de un producto',
      enunciado: ['Escribe ', { raiz: [['8 · ', { raiz: ['2'] }]], indice: e2('4') }, ' como una potencia de 2.'],
      alternativas: [[pw('2', '3/4')], [pw('2', '7/2')], [pw('2', '1/8')], [pw('2', '7/8')], [pw('2', '2')]],
      datos: ['8 = 2³', DF.mn, DF.producto, DF.potencia],
      solucion: [
        { texto: 'Adentro, todo en base 2: 8 es 2³ y √2 es 2 elevado a 1/2; se suman los exponentes.', ecuacion: [pw('2', '3'), ' · ', pw('2', '1/2'), ' = ', pw('2', '7/2')] },
        { texto: 'La raíz cuarta divide ese exponente entre 4.', ecuacion: [{ sup: [{ par: [pw('2', '7/2')] }, '1/4'] }, ' = ', pw('2', res('7/8'))] },
        { texto: ['La ', letra('B'), ' se olvida de la raíz cuarta; la ', letra('A'), ' se olvida del √2; la ', letra('C'), ' se olvida del 8; la ', letra('E'), ' toma √2 como 2: ⁴√16 = 2.'] },
      ],
      respuesta: [letra('D'), ', ', pw('2', res('7/8'))] },
  ];

  // «Mira»: la caja de 64 y su loseta; después, la caja de 27 y su tapa.
  const MIRA_FRAC = { objeto: 'caja', pasos: [{ V: 64, arista: true }, { V: 64, lado: true }, { V: 27, loseta: false, arista: true }, { V: 27, loseta: false, arista: true, tapa: '9 dm²' }, { V: 27, loseta: false, arista: true, tapa: '9 dm²' }] };
  const EXPS = { '1/3': 3, '1/2': 2, 1: 1, 2: 1 / 2, 3: 1 / 3 };
  const fraccionario = {
    id: 'exponente-fraccionario',
    titulo: 'La raíz es un exponente fraccionario',
    pregunta: '¿Qué significa un exponente como 2/3?',
    temas: ['Exponente fraccionario'],
    pieza: HO,
    aprendizaje: 'Elevar a 1/n es sacar raíz de índice n; m/n es raíz y potencia juntas, con las leyes de exponentes.',
    actividad: 'Buscar el exponente que convierte el volumen de una caja en su arista.',
    // Lee: la caja y la loseta, el índice y el aviso de las letras. No habla de exponentes como 2/3 (es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Una caja y una loseta', texto: 'Una caja cúbica de cartón tiene 64 dm³: su arista mide 4 dm, porque 4 · 4 · 4 = 64. A su lado, una loseta cuadrada de 64 dm² mide 8 dm de lado, porque 8 · 8 = 64.',
          pieza: HO, dibujo: CJ({ V: 64, arista: true, lado: true }) },
        { titulo: 'El índice de una raíz', texto: 'La arista es la raíz cúbica de 64: ∛64 = 4. Una raíz escrita con su signo es un radical, y el número chico, 3, es su índice. En la raíz cuadrada el índice es 2 y no se escribe.',
          ecuacion: [{ raiz: ['64'], indice: e2('3') }, ' = 4', SEP, '√64 = 8'] },
        { titulo: 'Las mismas letras', texto: ['En esta idea, ', nn, ' es el índice de la raíz y ', mm, ', el exponente de lo que está adentro. En la idea 1, n era el segundo exponente: así lo escriben los libros.'],
          ecuacion: [{ raiz: [pw('a', mm)], indice: nn }] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elevar el número de la caja a un exponente: 1/3, 1/2, 1, 2 o 3. Mira cuál da la arista de la caja y cuál, el lado de la loseta.' },
      ],
    },
    ejemplos: EJEMPLOS_FRACCIONARIO,
    juega: {
      pieza: HO,
      consigna: 'Una caja cúbica de cartón y una loseta cuadrada tienen el mismo número: dm³ la caja y dm² la loseta.',
      mision: {
        texto: 'La caja tiene 64 dm³. Elige el exponente que convierte 64 en su arista.',
        logrado: val => val.e === '1/3' && val.V === 64,
        bien: 'Listo: 64 elevado a 1/3 es ∛64 = 4 dm, porque 4 · 4 · 4 = 64.',
      },
      voz: '¿Qué exponente deshace el cubo?',
      // Con palabras, sin los valores de la misión cumplida (auditoría, M1).
      leyenda: [
        { s: 'dm³', t: 'el volumen de la caja de cartón' },
        { s: 'dm²', t: 'el área de la loseta' },
        { s: e2('exponente'), t: 'arriba: a qué se eleva el número' },
        { s: res('arista'), t: 'cada borde de la caja' },
        { s: res('lado'), t: 'cada lado de la loseta' },
        { s: '∛ y √', t: 'raíz cúbica y raíz cuadrada' },
      ],
      controles: [
        { id: 'e', etiqueta: 'Exponente', color: 'c-i', opciones: ['1', '1/2', '1/3', '2', '3'].map(x => ({ valor: x, texto: x })) },
        { id: 'V', etiqueta: 'Número de la caja y de la loseta', opciones: [{ valor: 64, texto: '64' }, { valor: 27, texto: '27' }, { valor: 8, texto: '8' }] },
      ],
      dibujo: v => CJ({ V: v.V, arista: v.e === '1/3', lado: v.e === '1/2' }),
      // La relación: el exponente 1/3 da la arista y el 1/2, el lado (con la cuenta que lo comprueba).
      lectura: v => {
        const n = EXPS[v.e], r = v.V ** (1 / n), ex = Math.abs(r - Math.round(r)) < 1e-9, t = ex ? String(Math.round(r)) : f(r, 1);
        if (n <= 1) return [pw(v.V, e2(v.e)), ` = ${f(v.V ** (1 / n), 0)}: ni arista ni lado`];
        return [pw(v.V, e2(v.e)), ` = ${n === 3 ? '∛' : '√'}${v.V} ${ex ? '=' : '≈'} `, res(`${t} dm`), n === 3 ? ': la arista' : ': lado de la loseta'];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['Una caja cúbica tiene 27 dm³. Su tapa es un cuadrado. ¿Cuánto vale ', pw('27', [e1('2'), '/', e2('3')]), ', el área de la tapa?'],
      datos: ['27 = 3 · 3 · 3'],
      voz: 'Piensa primero en la arista.',
      opciones: [
        { id: 'c', texto: '9 dm²', correcta: true },
        { id: 'por', texto: '18 dm²', error: 'TAL-EXP-POR', siFuera: 'Usar el 2 y el 3 está bien. Pero 27 · 2/3 multiplica la base por el exponente.' },
        { id: 'medio', texto: '3 dm²', error: 'TAL-FRAC-MEDIO', siFuera: 'Bien: ∛27 = 3 es la arista. Falta el 2 de arriba: la tapa es la arista al cuadrado.' },
        { id: 'invierte', texto: '≈ 140,3 dm²', error: 'TAL-FRAC-INVIERTE', siFuera: 'Usar los dos números está bien, pero invertidos: eso es 27 elevado a 3/2.' },
      ],
      dibujo: CJ({ V: 27, loseta: false, tapa: '?' }),
      revelar: CJ({ V: 27, loseta: false, arista: true, tapa: '9 dm²' }),
      coincide: 'Coincide: la arista es ∛27 = 3, y la tapa mide 3 · 3 = 9 dm².',
      noCoincide: 'Revisemos: 27 elevado a 1/3 es la arista, 3 dm; la tapa es esa arista al cuadrado.',
    },
    mira: {
      pieza: HO,
      datos: MIRA_FRAC,
      voz: 'Cada exponente deshace una potencia.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Elevar a 1/3 deshace el cubo: da la arista de la caja.', ecuacion: [pw('64', e2('1/3')), ' = ∛64 = ', res(4), ', porque ', { sup: [{ par: [pw('64', e2('1/3'))] }, '3'] }, ' = ', pw('64', '1'), ' = 64'] },
        { estado: { paso: 1 }, texto: 'Elevar a 1/2 deshace el cuadrado: da el lado de la loseta.', ecuacion: [pw('64', e2('1/2')), ' = √64 = ', res(8)] },
        { estado: { paso: 2 }, texto: 'Otra caja, de 27 dm³: su arista es 27 elevado a 1/3.', ecuacion: [pw('27', ['1/', e2('3')]), ' = ∛27 = ', res(3)] },
        { estado: { paso: 3 }, texto: 'La tapa es la arista al cuadrado: 27 elevado a 2/3.', ecuacion: [pw('27', [e1('2'), '/', e2('3')]), ' = ', { sup: [{ par: [pw('27', '1/3')] }, e1('2')] }, ' = 3² = ', res(9)] },
        { estado: { paso: 4 }, texto: 'También se puede elevar primero y sacar la raíz después.', ecuacion: [{ raiz: [pw('27', e1('2'))], indice: e2('3') }, ' = ∛729 = ', res(9)] },
      ],
    },
    regla: {
      texto: 'Sacar la raíz de índice n es elevar a 1/n. La raíz de una potencia es una potencia de exponente fraccionario, y valen las leyes de los exponentes.',
      ecuacion: [pw('a', ['1/', nn]), ' = ', { llave: [{ raiz: ['a'], indice: nn }], nota: 'raíz de índice n', color: 'c-f' }, SEP,
        pw('a', [mm, '/', nn]), ' = ', { raiz: [pw('a', mm)], indice: nn }, ' = ', { sup: [{ par: [{ raiz: ['a'], indice: nn }] }, mm] }],
      condicion: 'Si n es par, a ≥ 0; si n es impar, a puede ser negativo: ∛(−8) = −2. m/n se puede simplificar.',
      voz: 'Arriba, el exponente; abajo, el índice.',
    },
    // Así se resuelve: el producto de dos raíces de x como una sola potencia. «Ahora tú» pide otra cosa: pasar una raíz a
    // exponente, el valor de una potencia, una suma de potencias, una raíz anidada o el exponente escondido.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        let n1, m1, n2, m2;
        do { n1 = r.uno([2, 3, 4]); n2 = r.uno([2, 3]); m1 = r.ent(1, n1 - 1); m2 = r.ent(1, n2); } while (n1 === n2 || mcdN(m1, n1) !== 1 || mcdN(m2, n2) !== 1);
        const num = m1 * n2 + m2 * n1, den = n1 * n2, res2 = fq(num, den);
        const rz = (m, n) => ({ raiz: [m === 1 ? 'x' : pw('x', String(m))], indice: n === 2 ? undefined : e2(String(n)) });
        return {
          enunciado: ['Escribe ', rz(m1, n1), ' · ', rz(m2, n2), ' como una sola potencia de x, con x > 0.'],
          datos: [DF.mn, DF.producto, 'p/q + r/s = (p · s + r · q)/(q · s)'],
          pasos: [
            { tipo: 'pide', texto: 'Piden una sola potencia de x: hay que hallar su exponente, que será una fracción.' },
            { tipo: 'regla', texto: 'Cada raíz es una potencia de exponente fraccionario: arriba el exponente de adentro, abajo el índice. Después, misma base: se suman los exponentes.' },
            { tipo: 'cuentas', texto: 'Paso cada raíz a exponente.', ecuacion: [rz(m1, n1), ' · ', rz(m2, n2), ' = ', pw('x', `${m1}/${n1}`), ' · ', pw('x', `${m2}/${n2}`)] },
            { tipo: 'cuentas', texto: `Sumo las fracciones con denominador común ${den}.`, ecuacion: [`${m1}/${n1} + ${m2}/${n2} = ${m1 * n2}/${den} + ${m2 * n1}/${den} = ${res2}   →   `, pw('x', res(res2))] },
            { tipo: 'sentido', texto: `Lo reviso con x = ${2 ** den}: las dos raíces dan ${2 ** (m1 * n2)} y ${2 ** (m2 * n1)}, y ${2 ** den} elevado a ${res2} da ${2 ** num}, su producto. Cuadra.` },
          ],
          respuesta: [pw('x', res(res2))],
        };
      },
    },
    ahoraTu: {
      pieza: HO,
      voz: 'Arriba, el exponente; abajo, el índice.',
      generar(sem) {
        const r = azar(sem + 59), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoARaiz, r);
        if (tipo === 1) return conCuatro(casoValorFrac, r);
        if (tipo === 2) return conCuatro(casoSumaFrac, r);
        if (tipo === 3) return conCuatro(casoAnidado, r);
        return conCuatro(casoEcuacionRaiz, r);
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 2: la raíz del cuadrado contra la raíz cúbica del cubo, con x negativo (lo que la idea 2 reserva).
  const ejesIndice = v => ejesRaiz({
    curvas: [{ puntos: [[-6, -6], [6, 6]], discontinua: true, rotulo: 'y = x', en: [4, 5.2] },
      { puntos: VX.map(x => [x, v.k === 2 ? Math.abs(x) : x]), color: 'f', rotulo: v.k === 2 ? 'y = √(x²)' : 'y = ∛(x³)', en: v.k === 2 ? [-6, 6] : [-6, -6] }],
    puntos: [{ x: v.x, y: v.k === 2 ? Math.abs(v.x) : v.x, color: 'f', rotulo: f(v.k === 2 ? Math.abs(v.x) : v.x, 0), guias: true }],
    alt: v.k === 2 ? `Raíz de x al cuadrado: en x = ${v.x} vale ${Math.abs(v.x)}` : `Raíz cúbica de x al cubo: en x = ${v.x} vale ${v.x}`,
  });
  const raizDe = v => (v.k === 2 ? Math.abs(v.x) : v.x);
  const XS_INDICE = Array.from({ length: 13 }, (_, k) => k - 6);
  const mesaIndice = {
    id: 'raiz-de-la-potencia', titulo: 'Índice par contra índice impar', pieza: 'ejes',
    consigna: 'Arrastra el punto por la gráfica, también hacia los negativos. Cambia el índice y compara.',
    controles: [
      { id: 'x', etiqueta: 'x', min: -6, max: 6, paso: 1, inicio: -3, decimales: 0 },
      { id: 'k', etiqueta: 'Índice', opciones: [{ valor: 2, texto: '√(x²)' }, { valor: 3, texto: '∛(x³)' }] },
    ],
    dibujo: v => ({ datos: ejesIndice(v), estado: {} }),
    lectura: v => (v.k === 2 ? [`x = ${f(v.x, 0)}   →   √(x²) = `, { v: 'c-f', t: f(Math.abs(v.x), 0) }] : [`x = ${f(v.x, 0)}   →   ∛(x³) = `, { v: 'c-f', t: f(v.x, 0) }]),
    arrastres: [
      { id: 'punto', etiqueta: 'punto de la gráfica', color: 'c-f',
        donde: v => { const g = EJES().geometria(ejesIndice(v)); return { x: g.X(v.x), y: g.Y(v.k === 2 ? Math.abs(v.x) : v.x) }; },
        mover: (pt, v) => { const g = EJES().geometria(ejesIndice(v)); return { x: inversa(g.X, -6, 6)(pt.x) }; } },
    ],
    invitaciones: [
      { texto: 'Con √(x²), pon el punto en un negativo donde la raíz dé 4.',
        logrado: v => v.k === 2 && v.x < 0 && raizDe(v) === 4,
        bien: '√((−4)²) = 4: el índice par devuelve el valor absoluto.' },
      { texto: 'Haz que ∛(x³) dé un número negativo.',
        logrado: v => v.k === 3 && raizDe(v) < 0,
        bien: 'El índice impar conserva el signo. ¿Y el par?' },
      { texto: 'Con √(x²), busca el punto que más se aleja de la recta y = x.',
        logrado: v => v.k === 2 && raizDe(v) - v.x === Math.max(...XS_INDICE.map(x => raizDe({ k: 2, x }) - x)),
        bien: 'En x = −6 la raíz da 6 y la recta, −6: 12 de diferencia.' },
      { texto: 'Guarda el mismo x con los dos índices, cuando den resultados distintos.',
        logrado: (v, guardados) => guardados.some(g => g.x === v.x && g.k !== v.k && raizDe(g) !== raizDe(v)) && guardados.some(g => g.x === v.x && g.k === v.k),
        bien: 'Solo los negativos los separan: ahí √(x²) = −x.' },
    ],
  };
  // Mesa 3: la tabla de la idea 1 con exponentes negativos, que la idea solo deja predecir.
  const factoresConSigno = (base, e) => (e >= 0 ? factores(base, e) : `1/(${factores(base, -e)})`);
  const mesaSigno = {
    id: 'exponentes-con-signo', titulo: 'Exponentes con signo', pieza: 'alg-tabla',
    consigna: 'Elige la base y dos exponentes, también negativos. La última fila suma los exponentes: ¿el valor coincide?',
    controles: [
      { id: 'a', etiqueta: 'Base', min: 2, max: 5, paso: 1, inicio: 2, decimales: 0 },
      { id: 'm', etiqueta: 'm', min: -3, max: 3, paso: 1, inicio: 3, decimales: 0, color: 'c-o' },
      { id: 'n', etiqueta: 'n', min: -3, max: 3, paso: 1, inicio: -2, decimales: 0, color: 'c-i' },
    ],
    dibujo: v => ({
      datos: {
        columnas: ['potencia', 'factores', 'valor'],
        filas: [
          [{ t: pot(v.a, v.m), color: 'o', fuerte: true }, factoresConSigno(v.a, v.m), valorPot(v.a, v.m)],
          [{ t: pot(v.a, v.n), color: 'i', fuerte: true }, factoresConSigno(v.a, v.n), valorPot(v.a, v.n)],
          [{ t: pot(v.a, v.m + v.n), color: 'f', fuerte: true }, `${f(v.m, 0)} + (${f(v.n, 0)}) = ${f(v.m + v.n, 0)}`, { t: valorPot(v.a, v.m + v.n), color: 'f', fuerte: true }],
        ],
        alt: `${v.a} elevado a ${v.m} por ${v.a} elevado a ${v.n} es ${v.a} elevado a ${v.m + v.n}, que vale ${valorPot(v.a, v.m + v.n)}`,
      }, estado: {},
    }),
    lectura: v => [`${pot(v.a, v.m)} · ${pot(v.a, v.n)} = ${pot(v.a, v.m + v.n)} = ${valorPot(v.a, v.m + v.n)}`],
    invitaciones: [
      { texto: 'Consigue que el producto valga 1, sin que m ni n sean 0.',
        logrado: v => v.m !== 0 && Math.pow(v.a, v.m) * Math.pow(v.a, v.n) === 1,
        bien: 'Exponentes opuestos se anulan: la suma da 0 y a⁰ = 1.' },
      { texto: 'Busca el producto más pequeño de toda la mesa.',
        logrado: v => Math.pow(v.a, v.m + v.n) === Math.min(...[2, 3, 4, 5].map(a => Math.pow(a, -6))),
        bien: 'Base grande y exponente muy negativo: 1/5⁶, casi nada.' },
      { texto: 'Con m y n de distinto signo, haz que el producto sea menor que 1.',
        logrado: v => v.m * v.n < 0 && Math.pow(v.a, v.m + v.n) < 1,
        bien: 'Gana el exponente negativo: el resultado queda bajo la raya de fracción.' },
      { texto: 'Guarda dos casos con la misma base y el mismo valor, pero distinto m.',
        logrado: (v, guardados) => guardados.some(g => g.a === v.a && g.m !== v.m && g.m + g.n === v.m + v.n) && guardados.some(g => g.a === v.a && g.m === v.m && g.n === v.n),
        bien: 'Solo importa la suma m + n: muchas parejas dan la misma.' },
    ],
  };

  return {
    unidad: 'algebra.exponentes-y-productos-notables',
    version: '0.4.0',
    // Las tres ideas pasaron por el contrato (18 nov): la unidad entera se valida con calidad 2.
    calidad: 2,
    // Un color fijo por magnitud (cabecera); lo comprueba exponentes-y-productos-notables.test.js.
    colores: COLORES,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-objeto.js', '/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/ejes.js'],
    laboratorio: [mesaIndice, mesaSigno],
    // «raíz» (de una ecuación) se define en Ecuaciones; aquí no se marca: la raíz de esta unidad es la raíz cuadrada.
    glosarioSin: ['raíz'],
    // Glosario por tema (docs/teoria.md §4d): las palabras que esta unidad estrena en álgebra.
    glosario: [
      // Los tres que estrena la idea 1 (rehecha, 17 nov), con su aproximación (simple) y tres ejemplos.
      { termino: 'potencia', formas: ['potencia', 'potencias'], simbolo: 'aⁿ', def: 'Producto de un mismo número repetido varias veces, escrito corto con un número chico arriba.',
        simple: 'Una multiplicación repetida escrita corta: 2³ en vez de 2 · 2 · 2.', ver: ['base', 'exponente'],
        ejemplos: ['Con 3 dobleces por la mitad, la hoja tiene 2³ = 8 capas.', '5² = 5 · 5 = 25.', '10⁴ = 10 000: un 1 seguido de cuatro ceros.'] },
      { termino: 'base', formas: ['base', 'bases'], def: 'En una potencia, el número que se repite como factor.',
        simple: 'El número que se multiplica una y otra vez.', ver: ['exponente'],
        ejemplos: ['En 2³ es el 2: por la mitad, cada doblez duplica las capas.', 'En 5⁴ es el 5: 5 · 5 · 5 · 5.', 'Una carta doblada en tres tiene base 3: cada doblez triplica.'] },
      { termino: 'exponente', formas: ['exponente', 'exponentes'], def: 'El número chico de arriba en una potencia: cuántas veces se repite la base como factor.',
        simple: 'Cuántas veces se multiplica; en la hoja, cuántos dobleces.', ver: ['base', 'potencia'],
        ejemplos: ['En 2⁵ es el 5: cinco factores 2.', 'En 10³ es el 3: 10 · 10 · 10 = 1000.', 'Con exponente 0 queda 1: la hoja sin doblar es 1 capa.'] },
      // Los que estrena la idea 2 (rehecha, 18 nov). «valor absoluto» se define en «Valor absoluto y radicales» (Gerson,
      // mesa del 18 nov, cuarta ronda): aquí no se repite; el lector lo marca igual, con «Se explica en…» esa unidad
      // (nucleo/glosario.js: un término del curso vale en todas sus unidades).
      // Sin «no negativo» (auditoría, M3): eso es la predicción; lo dicen la regla y los datos de después.
      { termino: 'raíz cuadrada', formas: ['raíz cuadrada', 'raíces cuadradas'], simbolo: '√', def: 'El número que, multiplicado por sí mismo, da lo de adentro: el lado de un cuadrado de esa área.',
        simple: 'El lado de un cuadrado cuando se conoce su área.', ver: ['radicando', 'radical'],
        ejemplos: ['√36 = 6, porque 6 · 6 = 36.', 'Un biohuerto cuadrado de 49 m² tiene 7 m de lado.', '√2 no es exacta: vale unos 1,41.'] },
      { termino: 'radicando', formas: ['radicando', 'radicandos'], def: 'Lo que está debajo del signo √.',
        simple: 'Lo que está adentro de la raíz.', ver: ['raíz cuadrada'],
        ejemplos: ['En √36, es 36.', 'En √(9 + 16), es 9 + 16 = 25.', 'En el biohuerto, el radicando es el área.'] },
      { termino: 'área', formas: ['área', 'áreas'], def: 'Cuánta superficie cubre una figura plana: en un rectángulo, largo por ancho.',
        simple: 'Cuánto piso cubre una figura.', ver: ['volumen'],
        ejemplos: ['Un cuadrado de 6 m de lado tiene 36 m² de área.', 'Dos biohuertos de 36 y 64 m² juntos cubren 100 m².', 'Una loseta de 8 dm de lado cubre 64 dm².'] },
      // Los que estrena la idea 3 (nueva, 18 nov).
      { termino: 'radical', formas: ['radical', 'radicales'], simbolo: 'ⁿ√', def: 'Expresión con el signo √ que pide una raíz: el número que, elevado al índice, da lo de adentro.',
        simple: 'Una raíz escrita con su signo: √, ∛ o ⁴√.', ver: ['índice', 'radicando'],
        ejemplos: ['∛64 es un radical: vale 4.', '⁵√(x³) es un radical de índice 5.', 'Todo radical es una potencia: ∛x es x elevado a 1/3.'] },
      { termino: 'índice', formas: ['índice', 'índices'], def: 'Número chico en el signo de raíz que dice qué raíz se saca: 2 la cuadrada, 3 la cúbica.',
        simple: 'Cuántas veces se multiplica el resultado para volver a lo de adentro.', ver: ['radical'],
        ejemplos: ['En ∛8 el índice es 3: 2 · 2 · 2 = 8.', 'En √9 el índice es 2 y no se escribe.', 'En ⁴√81 es 4: 3 · 3 · 3 · 3 = 81.'] },
      { termino: 'exponente fraccionario', formas: ['exponente fraccionario', 'exponentes fraccionarios'], def: 'Un exponente que es una fracción, como 1/2 o 1/3: el número de abajo es el índice de una raíz.',
        simple: 'Una raíz escrita arriba, como fracción: 1/3 es raíz cúbica.', ver: ['índice', 'radical'],
        ejemplos: ['64 elevado a 1/3 es ∛64 = 4.', '16 elevado a 1/4 es ⁴√16 = 2.', 'x elevado a 1/5 es ⁵√x.'] },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'raiz-de-la-potencia': ['radicales'],
      'exponentes-con-signo': ['leyes-exponentes'],
    },
    ideas: [leyes, radicales, fraccionario],
  };
});
