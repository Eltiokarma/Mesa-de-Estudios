/*
 * Teoría de «Exponentes y radicales» (algebra.exponentes-y-productos-notables), para 5.º de secundaria y
 * preuniversitario. Molde: docs/teoria.md. Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 3).
 *
 * Partición (17 nov, Gerson; docs/etapa3/decisiones.md, «Segunda ronda»; docs/etapa3/propuesta-algebra-exponentes.md
 * §9): la unidad «Exponentes, radicales y productos notables» se partió en dos, como Magnitudes y Vectores. Esta conserva
 * el id (el progreso de los alumnos se guarda con él) y se queda con `leyes-exponentes`, `radicales` y, cuando se
 * escriba, `exponente-fraccionario` (nueva; con ella entra el tema «Exponente fraccionario» al catálogo). Los productos
 * notables, los radicales dobles y la racionalización pasaron tal cual a contenido/teoria/algebra/productos-notables.js
 * (algebra.productos-notables), con sus mesas; Avance.migrar (nucleo/avance.js) mueve el avance de esas ideas y mesas.
 * La historia de Descartes se fue con ellos (habla de figuras y productos); la de esta unidad espera una fuente
 * comprobada (propuesta §8).
 *
 * Etapa 3 del plan de calidad, fase 2 del método: por ahora está rehecha SOLO la idea 1, «El exponente cuenta factores»
 * (`leyes-exponentes`), para el visto bueno de Gerson; `radicales` y las dos mesas siguen como estaban, con sus colores
 * viejos, hasta que les toque. Por eso la unidad no declara todavía calidad: 2; exponentes-y-productos-notables.test.js
 * corre la idea 1 sola con calidad 2 (misión, leyenda, datos, glosario).
 * Objeto de la primera pantalla: una hoja de cuaderno que se dobla por la mitad (o en tres, como una carta); pieza
 * alg-objeto, objeto 'hoja', dibujo de prueba. Cada doblez multiplica las capas por la base: los dobleces se suman y las
 * capas se multiplican.
 *
 * Letras de la idea 1: a, la base; m y n, los exponentes (m, los dobleces que la hoja ya tiene; n, los que se hacen
 * después). x e y son números que se buscan o que no se conocen, siempre en tinta. Las medidas no van en metros: la m es
 * el exponente. «·» es multiplicar; dos relaciones de una misma ecuación se separan con la raya (SEP) o con «;».
 *
 * REGLA DE COLORES DE LA UNIDAD: un color fijo por magnitud (docs/molde-unidad.md §5b; decisiones, 17 nov), en la tabla
 * COLORES (def.colores), la misma en el juego, la figura, la fórmula, los datos, los ejemplos y «Ahora tú»:
 *   - naranja (c-o): el primer exponente, m (los dobleces que ya tiene la hoja) y el paquete de capas que dejan;
 *   - turquesa (c-i): el segundo exponente, n (los dobleces más) y cuántas veces se repite el paquete;
 *   - violeta (c-f): el resultado: el exponente que resulta, las capas al final, el valor que se pide. En una figura,
 *     solo si se da; lo que se pide va con «?» en tinta;
 *   - tinta: la base (es la misma en toda la cuenta), los demás exponentes de una cuenta larga y las letras x e y;
 *   - ni carmín (es de los ángulos) ni verde (iría junto al naranja).
 *   La respuesta lleva el color de su magnitud; la letra de una alternativa va en negrita, en violeta (nombra un valor
 *   del resultado). Cada ficha de color dice su magnitud (m); exponentes-y-productos-notables.test.js falla si una
 *   magnitud cambia de color (hoy en la idea 1; cada idea que se rehaga se suma a IDEAS_REHECHAS).
 * Errores de la idea 1 (hipótesis de diseño, sin dato propio; docs/investigacion/algebra-funciones-ideas-erroneas.md):
 *   AL11 reparte el exponente sobre una suma (2ˣ⁺³ = 2ˣ + 2³) · AL32 iguala exponentes con bases distintas ·
 *   TAL-EXP-NEG cree que el exponente negativo cambia el signo · TAL-EXP-POR multiplica la base por el exponente ·
 *   TAL-EXP-FRAC divide entre base por exponente (1/6 por 2⁻³) · TAL-EXP-PRODUCTO multiplica exponentes en un producto
 *   · TAL-EXP-COCIENTE suma el exponente del divisor · TAL-EXP-BASE multiplica las bases · TAL-EXP-ELEVAR suma al elevar
 *   ((a²)ˣ = a²⁺ˣ) · TAL-EXP-SUMA suma el exponente al valor (5 + 3) · TAL-EXP-RESTA resta exponentes en una resta de
 *   potencias · TAL-EXP-DATO usa el número 8 como exponente · TAL-SIGNO cambia el signo de una resta.
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
  const COLORES = { 'primer exponente': 'o', 'segundo exponente': 'i', resultado: 'f' };
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
  // Los dobleces que caben (la pieza dice lo mismo): en tres, a lo más 3.
  const cabe = v => (v.a === 3 && v.m + v.n > 3 ? { m: v.m, n: Math.max(0, 3 - v.m), topado: true } : { m: v.m, n: v.n, topado: false });
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
        { id: 'expo', texto: [String(p - q)], error: 'TAL-EXP-RESTA', siFuera: `Restar está bien, pero los valores: ${pot(B, p)} − ${pot(B, q)}, no los exponentes.` },
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
      datos: [`${A} = ${pot(p, k)} y ${c} = ${pot(p, j)}`, LEY.potencia, LEY.producto, LEY.igualar],
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
      enunciado: ['Si ', pw('2', 'x'), ' = 5, ¿cuánto vale ', pw('2', ['x + ', e2('3')]), '?   A) 8   B) 15   C) 40   D) 125   E) 13'],
      datos: [LEY.producto],
      solucion: [
        { texto: 'No hace falta hallar x. Se separa la potencia en dos factores de base 2 y se reemplaza el dato.', ecuacion: [pw('2', ['x + ', e2('3')]), ' = ', pw('2', 'x'), ' · ', pw('2', e2('3')), ' = 5 · 8 = ', res('40')] },
        { texto: ['La ', letra('A'), ' suma 3 al valor, y la ', letra('E'), ' reparte el exponente en una suma: 5 + 2³. El exponente sumado multiplica.'] },
      ],
      respuesta: [letra('C'), ', ', res('40')] },
    { nivel: 3, titulo: 'Un factor común',
      enunciado: ['Simplifica ', { frac: [[pw('2', 'x + 3'), ' − ', pw('2', 'x + 1')], pw('2', 'x')] }, '.   A) 4   B) 6   C) 2   D) 8   E) 10'],
      datos: [LEY.producto, 'p · c − q · c = (p − q) · c: el factor común c sale'],
      solucion: [
        { texto: 'Cada término se separa en 2ˣ por otra potencia de 2.', ecuacion: [pw('2', 'x + 3'), ' = ', pw('2', 'x'), ' · 8', SEP, pw('2', 'x + 1'), ' = ', pw('2', 'x'), ' · 2'] },
        { texto: 'Arriba, 2ˣ es factor común; al dividir entre 2ˣ, se simplifica.', ecuacion: [{ frac: [[pw('2', 'x'), ' · (8 − 2)'], pw('2', 'x')] }, ' = 8 − 2 = ', res('6')] },
        { texto: ['La ', letra('A'), ' resta los exponentes, 3 − 1 = 2, y da 2² = 4. Eso vale al dividir potencias, no al restarlas.'] },
      ],
      respuesta: [letra('B'), ', ', res('6')] },
    { nivel: 3, titulo: 'A la misma base',
      enunciado: ['Halla x si ', pw('4', 'x'), ' · 8 = ', pw('2', '11'), '.   A) 2   B) 4   C) 6   D) 8   E) 1,5'],
      datos: ['4 = 2² y 8 = 2³', LEY.potencia, LEY.producto, LEY.igualar],
      solucion: [
        { texto: 'Se pasa todo a base 2: 4ˣ es (2²)ˣ = 2²ˣ, y 8 es 2³.', ecuacion: [pw('4', 'x'), ' · 8 = ', pw('2', '2x'), ' · ', pw('2', '3'), ' = ', pw('2', '2x + 3')] },
        { texto: 'Las dos potencias de 2 son iguales, así que sus exponentes también.', ecuacion: ['2x + 3 = 11   →   2x = 8   →   x = ', res('4')] },
        { texto: ['La ', letra('D'), ' iguala x + 3 = 11 sin pasar el 4 a base 2: con bases distintas, los exponentes no se igualan.'] },
      ],
      respuesta: [letra('B'), ', x = ', res('4')] },
    { nivel: 3, titulo: 'El signo y la base',
      enunciado: ['¿Cuánto vale −', pw('2', '4'), ' + ', pw('(−2)', '4'), ' + ', pw('(−2)', '3'), '?   A) 0   B) −8   C) 8   D) −40   E) 24'],
      datos: ['En (−2)⁴ la base es −2; en −2⁴ la base es 2 y el menos queda afuera', 'Un producto con un número par de factores negativos es positivo; con impar, negativo'],
      solucion: [
        { texto: '−2⁴ tiene base 2: es −(2⁴) = −16. En (−2)⁴ la base es −2: cuatro factores negativos dan 16.', ecuacion: ['−', pw('2', '4'), ' = −16', SEP, pw('(−2)', '4'), ' = 16', SEP, pw('(−2)', '3'), ' = −8'] },
        { texto: 'Tres factores negativos dan negativo. Se juntan los tres valores.', ecuacion: ['−16 + 16 + (−8) = ', res('−8')] },
        { texto: ['La ', letra('E'), ' toma −2⁴ como (−2)⁴; la ', letra('D'), ' hace negativo también a (−2)⁴.'] },
      ],
      respuesta: [letra('B'), ', ', res('−8')] },
    { nivel: 3, titulo: 'Dos potencias iguales',
      enunciado: ['Si ', pw('9', 'x'), ' = ', pw('27', 'y'), ' y x + y = 5, ¿cuánto vale x?   A) 2   B) 3   C) 5/2   D) 4   E) 1'],
      datos: ['9 = 3² y 27 = 3³', LEY.potencia, LEY.igualar],
      solucion: [
        { texto: 'A base 3: 9ˣ = 3²ˣ y 27ʸ = 3³ʸ. Como son iguales, sus exponentes también.', ecuacion: [pw('3', '2x'), ' = ', pw('3', '3y'), '   →   2x = 3y'] },
        { texto: 'Con y = 5 − x: 2x = 15 − 3x, así que 5x = 15.', ecuacion: ['x = ', res('3'), ' y y = 2'] },
        { texto: 'Lo reviso: 9³ = 729 y 27² = 729. Cuadra.' },
        { texto: ['La ', letra('C'), ' iguala x = y sin pasar a base 3: con bases distintas, los exponentes no se igualan.'] },
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
      leyenda: [
        { s: mm, t: 'dobleces que la hoja ya tiene' },
        { s: nn, t: 'dobleces que le haces después' },
        { s: e1('8 capas'), t: 'el paquete que dejan los m dobleces' },
        { s: e2('× 4'), t: 'cuántas veces se repite ese paquete' },
        { s: res('32 capas'), t: 'hojitas encimadas al final, vistas de canto' },
        { s: 'Por la mitad', t: 'cada doblez multiplica las capas por 2' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Cómo se dobla', opciones: [{ valor: 2, texto: 'Por la mitad' }, { valor: 3, texto: 'En tres' }] },
        { id: 'm', etiqueta: 'Dobleces que ya tiene, m', color: 'c-o', min: 0, max: 3, paso: 1, inicio: 3, decimales: 0 },
        { id: 'n', etiqueta: 'Dobleces más, n', color: 'c-i', min: 0, max: 2, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => hoja({ base: v.a, m: v.m, n: v.n }),
      // La relación: los dobleces se suman y las capas se multiplican.
      lectura: v => {
        const c = cabe(v);
        if (c.topado) return ['En tres solo caben 3 dobleces: ', e1(v.m), ' + ', e2(v.n), ' es más'];
        return [e1(c.m), ' + ', e2(c.n), ' = ', res(c.m + c.n), ` dobleces; ${v.a ** c.m} · ${v.a ** c.n} = `, res(v.a ** (c.m + c.n)), ' capas'];
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

  // ---------- Idea 2: la raíz principal no es negativa ----------
  // Cambia: los dos números bajo la raíz · Permanece: las cuatro filas de la tabla · Progresa: la diferencia
  // entre √(a + b) y √a + √b · Se reserva: el x negativo bajo el cuadrado · Debe verse: √(x²) = |x|.
  // Dos representaciones a propósito (hallazgo 9): el juego compara sumas y productos en la tabla, sin negativos, para
  // que la predicción sobre √((−5)²) sea algo no visto; «Mira» pasa a la gráfica porque el caso negativo es lo nuevo.
  // El laboratorio (índice par contra impar) junta las dos cosas con el punto que se arrastra.
  const ejesRaiz = (extra = {}) => Object.assign({
    x: { min: -6, max: 6, paso: 2, nombre: 'x', decimales: 0, color: 'o' },
    y: { min: -6, max: 6, paso: 2, nombre: 'y', decimales: 0 },
  }, extra);
  const VX = Array.from({ length: 13 }, (_, k) => k - 6);
  const radicales = {
    id: 'radicales',
    titulo: 'La raíz principal nunca es negativa',
    temas: ['Propiedades de radicales'],
    pieza: 'alg-tabla',
    // Lee (fase 2): la raíz como lado de un cuadrado y sus nombres; no habla de negativos bajo el cuadrado («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'El lado de un terreno', texto: 'Un terreno cuadrado en Puno tiene 400 m² de área. Su lado es el número que, multiplicado por sí mismo, da 400: mide 20 m. Ese número es la raíz cuadrada de 400.',
          ecuacion: ['√400 = 20, porque 20 · 20 = 400'] },
        { titulo: 'Las partes', texto: 'En √a, el signo √ es el radical y lo que está debajo es el radicando. Si no lleva un número chico, el índice es 2 y se trata de la raíz cuadrada.' },
        { titulo: 'Qué mirar al jugar', texto: 'La tabla compara dos caminos: sumar primero y sacar la raíz después, o sacar las raíces y sumar. Lo mismo con el producto. Fíjate en qué filas sale verde y en cuáles rojo.' },
      ],
    },
    juega: {
      consigna: 'Elige a y b. Compara la raíz de la suma con la suma de raíces, y la raíz del producto con el producto de raíces.',
      voz: 'Mira cuándo coinciden y cuándo no.',
      controles: [
        { id: 'a', etiqueta: 'a', min: 0, max: 16, paso: 1, inicio: 9, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: 0, max: 16, paso: 1, inicio: 16, decimales: 0, color: 'c-i' },
      ],
      dibujo: v => {
        const s1 = Math.sqrt(v.a + v.b), s2 = Math.sqrt(v.a) + Math.sqrt(v.b), p1 = Math.sqrt(v.a * v.b), p2 = Math.sqrt(v.a) * Math.sqrt(v.b);
        const ig = (x, y) => Math.abs(x - y) < 1e-9;
        return {
          datos: {
            columnas: ['expresión', 'valor'],
            filas: [[`√(${v.a} + ${v.b})`, f(s1)], [`√${v.a} + √${v.b}`, { t: f(s2), color: ig(s1, s2) ? 'd' : 'h', fuerte: true }], [`√(${v.a} · ${v.b})`, f(p1)], [`√${v.a} · √${v.b}`, { t: f(p2), color: ig(p1, p2) ? 'd' : 'h', fuerte: true }]],
            separador: { fila: 2 },
            alt: `Raíz de la suma ${f(s1)} contra suma de raíces ${f(s2)}; raíz del producto ${f(p1)} igual al producto de raíces`,
          }, estado: {},
        };
      },
      lectura: v => [`√(a + b) = ${f(Math.sqrt(v.a + v.b))}`, '   ·   ', `√a + √b = ${f(Math.sqrt(v.a) + Math.sqrt(v.b))}`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuánto vale √((−5)²)?',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'menos', texto: '−5', error: 'TAL-RAIZ-X', siFuera: '−5 sería cierto si √(x²) fuera siempre x. La raíz principal nunca es negativa.' },
        { id: 'doble', texto: '±5', error: 'TAL-RAIZ-DOBLE', siFuera: '±5 son las soluciones de x² = 25; el símbolo √ da solo la no negativa.' },
        { id: 'cuadrado', texto: '25', error: 'TAL-RAIZ-FALTA', siFuera: '25 es (−5)²; falta sacar la raíz.' },
      ],
      pieza: 'ejes',
      dibujo: { datos: ejesRaiz({ curvas: [{ puntos: [[-6, -6], [6, 6]], color: 'h', discontinua: true, rotulo: 'y = x', en: [4, 4] }], alt: 'Plano con la recta y = x, sin la gráfica de la raíz' }), estado: {} },
      revelar: { datos: ejesRaiz({ curvas: [{ puntos: [[-6, -6], [6, 6]], color: 'h', discontinua: true, rotulo: 'y = x', en: [4, 4] }, { puntos: VX.map(x => [x, Math.abs(x)]), color: 'd', rotulo: 'y = √(x²)', en: [-6, 6] }], puntos: [{ x: -5, y: 5, color: 'd', rotulo: '5', guias: true }], alt: 'La gráfica de raíz de x al cuadrado es la de valor absoluto: en x = −5 vale 5' }), estado: {} },
      coincide: 'Coincide: (−5)² = 25 y la raíz principal de 25 es 5.',
    },
    mira: {
      pieza: 'ejes',
      datos: ejesRaiz({
        curvas: [{ puntos: [[-6, -6], [6, 6]], color: 'h', discontinua: true, rotulo: 'y = x', en: [4, 4], desde: 1 },
          { puntos: VX.filter(x => x >= 0).map(x => [x, x]), color: 'd', desde: 1 },
          { puntos: VX.filter(x => x <= 0).map(x => [x, -x]), color: 'd', rotulo: 'y = √(x²)', en: [-6, 6], desde: 2 }],
        puntos: [{ x: -3, y: 3, color: 'd', rotulo: '|−3| = 3', guias: true, desde: 3 }],
        alt: 'Raíz de x al cuadrado coincide con x si x es positivo y con −x si es negativo: es |x|',
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Para x ≥ 0, √(x²) coincide con x.', ecuacion: ['√(3²) = √9 = 3'] },
        { estado: { corte: 2 }, texto: 'Para x < 0, el cuadrado borra el signo y la raíz da el positivo.', ecuacion: ['√((−3)²) = √9 = 3'] },
        { estado: { corte: 3 }, texto: 'En los dos casos el resultado es la distancia al cero.', ecuacion: [{ raiz: ['x²'] }, ' = ', { llave: [{ abs: ['x'] }], nota: 'distancia al cero', color: 'c-d' }] },
        { estado: { corte: 3 }, texto: 'El producto se reparte; la suma no.', ecuacion: ['√(9 · 16) = 3 · 4 = 12', '   ·   ', '√(9 + 16) = 5 ≠ 7'] },
      ],
    },
    regla: {
      texto: 'El símbolo √ da la raíz principal, que nunca es negativa; por eso √(x²) = |x|. La raíz se reparte sobre un producto de no negativos, nunca sobre una suma.',
      ecuacion: [{ raiz: ['x²'] }, ' = ', { llave: [{ abs: ['x'] }], nota: 'nunca negativo', color: 'c-d' }, '   ·   ', { raiz: [a, ' · ', b] }, ' = ', { raiz: [a] }, ' · ', { raiz: [b] }],
      condicion: 'en los reales, la raíz de índice par pide radicando no negativo (a, b ≥ 0); la impar admite negativos: ∛(−8) = −2.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = s % 3;
        if (tipo === 0) {
          const k = r.ent(2, 12), neg = r() < 0.5, xv = neg ? -k : k;
          return {
            enunciado: `Si x = ${f(xv, 0)}, ¿cuánto vale √(x²)?`,
            pasos: [
              { tipo: 'pide', texto: `Piden √(x²) cuando x vale ${f(xv, 0)}.` },
              { tipo: 'datos', texto: `x = ${f(xv, 0)}. Primero se eleva al cuadrado y después se saca la raíz.` },
              { tipo: 'regla', texto: 'El símbolo √ da el número no negativo que, al cuadrado, da lo de adentro. Por eso √(x²) es la distancia de x al cero.',
                ecuacion: [{ raiz: ['x²'] }, ' = ', { abs: ['x'] }] },
              { tipo: 'cuentas', texto: 'Elevo al cuadrado y saco la raíz.', ecuacion: [{ raiz: [`(${f(xv, 0)})²`] }, ` = √${k * k} = ${k}`] },
              { tipo: 'sentido', texto: `${k} no es negativo y ${k} · ${k} = ${k * k}: es la raíz principal. ${neg ? `Da ${k}, no ${f(xv, 0)}.` : `Aquí coincide con x.`}` },
            ],
            respuesta: `√(x²) = ${k}`,
          };
        }
        if (tipo === 1) {
          const c = r.ent(2, 6), t = r.uno([2, 3, 5, 6, 7]), N = c * c * t;
          return {
            enunciado: `Simplifica √${N} sacando de la raíz todo lo que se pueda.`,
            pasos: [
              { tipo: 'pide', texto: `Piden escribir √${N} con el número más chico posible bajo la raíz.` },
              { tipo: 'datos', texto: `El radicando es ${N}. Busco el mayor cuadrado perfecto que lo divide: ${N} = ${c * c} · ${t}.` },
              { tipo: 'regla', texto: 'La raíz de un producto de números no negativos es el producto de las raíces. Así, la raíz del cuadrado sale entera.',
                ecuacion: [{ raiz: [a, ' · ', b] }, ' = ', { raiz: [a] }, ' · ', { raiz: [b] }] },
              { tipo: 'cuentas', texto: `Separo ${c * c} y ${t}, y saco la raíz de ${c * c}.`, ecuacion: [`√${N} = √${c * c} · √${t} = ${c}√${t}`] },
              { tipo: 'sentido', texto: `Lo reviso al revés: (${c}√${t})² = ${c * c} · ${t} = ${N}. Y ${t} ya no tiene ningún cuadrado adentro.` },
            ],
            respuesta: `√${N} = ${c}√${t}`,
          };
        }
        const [p, q, h] = r.uno([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]);
        return {
          enunciado: ['Si ', a, ` = ${p} y `, b, ` = ${q}, ¿cuánto vale `, { raiz: [a, '² + ', b, '²'] }, '?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden la raíz de la suma ', a, '² + ', b, '².'] },
            { tipo: 'datos', texto: [a, ` = ${p} y `, b, ` = ${q}.`] },
            { tipo: 'regla', texto: 'La raíz no se reparte sobre una suma. Primero se hace todo lo de adentro y al final se saca la raíz.' },
            { tipo: 'cuentas', texto: 'Elevo al cuadrado, sumo bajo la raíz y saco la raíz.', ecuacion: [`√(${p}² + ${q}²) = √(${p * p} + ${q * q}) = √${h * h} = ${h}`] },
            { tipo: 'sentido', texto: `${h} · ${h} = ${h * h}: cuadra. Y ${h} es menor que ${p} + ${q} = ${p + q}: repartir la raíz habría dado de más.` },
          ],
          respuesta: ['√(', a, '² + ', b, `²) = ${h}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const k = r.ent(2, 12), neg = s % 2 === 0, x = neg ? -k : k;
          return {
            pregunta: `Si x = ${f(x, 0)}, ¿cuánto vale √(x²)?`,
            opciones: distintas([{ id: 'c', texto: f(k, 0), correcta: true },
              { id: 'x', texto: f(-k, 0), error: 'TAL-RAIZ-X', siFuera: neg ? 'Eso sería cierto si √(x²) fuera x; la raíz principal no es negativa.' : `Con x = ${k}, √(x²) = ${k}: la raíz principal no es negativa.` },
              { id: 'pm', texto: `±${k}`, error: 'TAL-RAIZ-DOBLE', siFuera: `±${k} resuelve t² = ${k * k}; √ da solo la no negativa.` },
              { id: 'cuad', texto: f(k * k, 0), error: 'TAL-RAIZ-FALTA', siFuera: `${k * k} es x²; falta sacar la raíz.` }]),
            solucion: { texto: 'La raíz del cuadrado es el valor absoluto.', ecuacion: [{ raiz: [`(${f(x, 0)})²`] }, ` = √${k * k} = ${k}`] },
          };
        }
        if (tipo === 1) {
          const c = r.ent(2, 6), t = r.uno([2, 3, 5, 6, 7]), N = c * c * t;
          return {
            pregunta: `Simplifica √${N} sacando de la raíz todo lo que se pueda.`,
            opciones: distintas([{ id: 'c', texto: `${c}√${t}`, correcta: true },
              { id: 'adentro', texto: `${c * c}√${t}`, error: 'TAL-RAIZ-FALTA', siFuera: `${c * c} sale de la raíz como √${c * c} = ${c}, no como ${c * c}.` },
              { id: 'invertido', texto: `${t}√${c}`, error: 'TAL-RAIZ-SIMP', siFuera: `${t}√${c} da √${t * t * c}; el que sale es el cuadrado ${c * c}.` },
              { id: 'suma', texto: `${c} + √${t}`, error: 'AL9', siFuera: `Eso sería √(${c * c} + ${t}) repartida; aquí es un producto: ${c * c} · ${t}.` }]),
            solucion: { texto: `${N} = ${c * c} · ${t}, y ${c * c} es un cuadrado.`, ecuacion: [`√${N} = √${c * c} · √${t} = ${c}√${t}`] },
          };
        }
        const [p, q, h] = r.uno([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]);
        return {
          pregunta: ['Si ', a, ` = ${p} y `, b, ` = ${q}, ¿cuánto vale `, { raiz: [a, '² + ', b, '²'] }, '?'],
          opciones: distintas([{ id: 'c', texto: f(h, 0), correcta: true },
            { id: 'suma', texto: f(p + q, 0), error: 'AL9', siFuera: `${p + q} sería cierto si la raíz se repartiera sobre la suma; no se reparte.` },
            { id: 'sin', texto: f(p * p + q * q, 0), error: 'TAL-RAIZ-FALTA', siFuera: `${p * p + q * q} es a² + b²; falta sacar la raíz.` },
            { id: 'resta', texto: f(q - p, 0), error: 'AL9', siFuera: 'La raíz de una suma no se calcula con a y b sueltos.' }]),
          solucion: { texto: 'Primero se suma bajo la raíz; después se saca la raíz.', ecuacion: [`√(${p * p} + ${q * q}) = √${h * h} = ${h}`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 2: la raíz del cuadrado contra la raíz cúbica del cubo, con x negativo (lo que la idea 2 reserva).
  const ejesIndice = v => ejesRaiz({
    curvas: [{ puntos: [[-6, -6], [6, 6]], color: 'h', discontinua: true, rotulo: 'y = x', en: [4.5, 3] },
      { puntos: VX.map(x => [x, v.k === 2 ? Math.abs(x) : x]), color: 'd', rotulo: v.k === 2 ? 'y = √(x²)' : 'y = ∛(x³)', en: v.k === 2 ? [-6, 6] : [-6, -6] }],
    puntos: [{ x: v.x, y: v.k === 2 ? Math.abs(v.x) : v.x, color: 'o', rotulo: f(v.k === 2 ? Math.abs(v.x) : v.x, 0), guias: true }],
    alt: v.k === 2 ? `Raíz de x al cuadrado: en x = ${v.x} vale ${Math.abs(v.x)}` : `Raíz cúbica de x al cubo: en x = ${v.x} vale ${v.x}`,
  });
  const raizDe = v => (v.k === 2 ? Math.abs(v.x) : v.x);
  const XS_INDICE = Array.from({ length: 13 }, (_, k) => k - 6);
  const mesaIndice = {
    id: 'raiz-de-la-potencia', titulo: 'Índice par contra índice impar', pieza: 'ejes',
    consigna: 'Arrastra el punto por la gráfica, también hacia los negativos. Cambia el índice y compara.',
    controles: [
      { id: 'x', etiqueta: 'x', min: -6, max: 6, paso: 1, inicio: -3, decimales: 0, color: 'c-o' },
      { id: 'k', etiqueta: 'Índice', opciones: [{ valor: 2, texto: '√(x²)' }, { valor: 3, texto: '∛(x³)' }] },
    ],
    dibujo: v => ({ datos: ejesIndice(v), estado: {} }),
    lectura: v => (v.k === 2 ? [{ v: 'c-o', t: 'x' }, ` = ${f(v.x, 0)}   →   √(x²) = ${f(Math.abs(v.x), 0)}`] : [{ v: 'c-o', t: 'x' }, ` = ${f(v.x, 0)}   →   ∛(x³) = ${f(v.x, 0)}`]),
    arrastres: [
      { id: 'punto', etiqueta: 'punto de la gráfica', color: 'c-o',
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
        bien: 'En x = −6 la distancia es 12: la raíz da 6, no −6.' },
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
          [{ t: pot(v.a, v.m + v.n), color: 'd', fuerte: true }, `${f(v.m, 0)} + (${f(v.n, 0)}) = ${f(v.m + v.n, 0)}`, { t: valorPot(v.a, v.m + v.n), color: 'd', fuerte: true }],
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
    version: '0.3.0',
    // Un color fijo por magnitud (cabecera); lo comprueba exponentes-y-productos-notables.test.js.
    colores: COLORES,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-objeto.js', '/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/ejes.js'],
    laboratorio: [mesaIndice, mesaSigno],
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
      { termino: 'radical', simbolo: '√', def: 'Expresión con el signo √ que pide una raíz: el número que, elevado al índice, da lo de adentro.',
        ver: ['índice', 'radicando'] },
      { termino: 'índice', def: 'Número chico en el signo √ que dice qué raíz se saca: 2 la cuadrada, 3 la cúbica.',
        ejemplo: '∛8 = 2, porque 2³ = 8.', ver: ['radical'] },
      { termino: 'radicando', def: 'Lo que está debajo del signo √.', ejemplo: 'En √(x + 9), es x + 9.', ver: ['radical'] },
      { termino: 'área', formas: ['área', 'áreas'], def: 'Cuánta superficie cubre una figura plana: en un rectángulo, largo por ancho.',
        ejemplo: 'Un cuadrado de 20 m de lado tiene 400 m² de área.', ver: ['volumen'] },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'raiz-de-la-potencia': ['radicales'],
      'exponentes-con-signo': ['leyes-exponentes'],
    },
    ideas: [leyes, radicales],
  };
});
