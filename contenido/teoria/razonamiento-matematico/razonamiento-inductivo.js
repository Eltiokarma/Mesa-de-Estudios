/*
 * Teoría de «Razonamiento inductivo» (razonamiento-matematico.razonamiento-inductivo). Molde: docs/teoria.md y
 * docs/molde-unidad.md. Etapa 8 del plan de calidad (docs/plan-calidad.md §7), primera unidad de la rama «Números y
 * patrones». Propuesta: docs/etapa8/propuesta-razonamiento-matematico.md (Gerson delegó el criterio y revisa después).
 * Seis ideas: 1. figuras-que-crecen «La figura que crece» (fósforos sobre la mesa) · 2. tres-casos-no-prueban «Tres
 * casos no prueban» (la torta del cumpleaños) · 3. cada-caso-con-su-lugar «Cada caso con su lugar» (chapitas) ·
 * 4. arreglo-triangular «Filas de un triángulo de números» (la pirámide de latas) · 5. cuenta-larga «Casos chicos de una
 * cuenta larga» (la calculadora del salón) · 6. lo-que-se-repite «Lo que se repite» (la pulsera de mostacillas). Los ids
 * publicados figuras-que-crecen y tres-casos-no-prueban no cambian, ni sus predicciones; impares-y-cuadrados salió (la
 * suma de impares es de aritmetica.sucesiones-y-series).
 * Público: 5.º de secundaria y preuniversitario.
 *
 * Colores (molde §5b, por papel; la pieza rm-patrones los fija y razonamiento-inductivo.test.js lo comprueba):
 *   tinta ....... los objetos, lo que ya estaba, los números
 *   o naranja ... el primer dato: lo que tiene la figura 1; el caso que se elige (la fila, el lugar, los nueves)
 *   i turquesa .. lo que agrega cada paso; el ciclo que se repite; el contraejemplo que se cuenta
 *   f violeta ... lo pedido, ya comprobado (solo al resolver)
 *   Sin verde ni carmín: no hay ángulos y el verde no puede ir junto al naranja.
 * Letras: n, el número de la figura, de la fila o del caso (letras: { n }). Las mostacillas llevan la letra de su color
 * (R, V, N, B): los resueltos nombran cada alternativa por su valor, nunca por su letra (decisión de la Etapa 3).
 * Errores: RM2 (objeto entero, docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md), RMP1, RMP26, RMP27, RMP86 y
 * RMP160 a RMP171 (docs/investigacion/codigos-rm-procesos.md, todos hipótesis).
 * Historia: Hume y el problema de la inducción (SEP); el polinomio de Euler (MathWorld). Compañero: Faro (zorro).
 *
 * Ficha de tarea (diseno-y-animacion), idea 1:
 *   Promesa: contar la figura lejana de una sucesión de fósforos sin dibujarla.
 *   Persona y condiciones: postulante de 5.º o preuniversitario, celular de gama baja, sin conexión en el aula.
 *   Resultado observable: dice lo que trae la primera figura y lo que agrega cada paso, y cuenta la figura n.
 *   Orden de atención: 1.º la fila de fósforos · 2.º lo turquesa de cada cuadrado nuevo y la lectura · acción: agregar.
 *   Estados: juego sin tocar · misión cumplida · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «si cada cuadrado tiene 4 fósforos, ¿por qué 20 cuadrados no son 80?».
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/cubitos-pintados cuenta, cubito por cubito, las caras pintadas de la mesa «El cubo que crece».
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/cubitos-pintados/motor.js'))
    : fabrica(root.Kit, root.MotorCubitos);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MC) {
  'use strict';
  const f0 = x => Kit.formatear(x, 0);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    r.barajar = xs => { const y = xs.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const suma = xs => xs.reduce((a, b) => a + b, 0);
  const lista = (xs, y = 'y') => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} ${y} ${xs[xs.length - 1]}` : xs.join(''));
  const PZ = 'rm-patrones';
  const N = { v: 'c-o', t: 'n' };     // el número del caso, en el color del dato
  const F = t => ({ v: 'c-f', t });   // lo pedido, ya comprobado: violeta
  const O = t => ({ v: 'c-o', t });   // lo que trae el primer caso: naranja
  const I = t => ({ v: 'c-i', t });   // lo que agrega cada paso o lo que se repite: turquesa
  const pl = (x, u) => `${f0(x)} ${x === 1 ? u[0] : u[1]}`;
  // Opciones de «Ahora tú» con números: la correcta y los errores que dan un valor distinto (y posible).
  function opcionesNum(correcta, unidad, distractores, max = 4) {
    const t = x => (unidad ? pl(x, unidad) : f0(x));
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: t(correcta), correcta: true }];
    for (const d of distractores) {
      if (!d || !Number.isFinite(d.valor) || d.valor < 0 || !Number.isInteger(d.valor) || vistos.has(d.valor) || ops.length >= max) continue;
      vistos.add(d.valor); ops.push({ id: d.id, texto: t(d.valor), error: d.error, siFuera: d.siFuera });
    }
    return ops;
  }
  const opcionesTexto = (correcta, distractores, max = 4) => {
    const vistos = new Set([correcta]), ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) { if (!d || vistos.has(d.texto) || ops.length >= max) continue; vistos.add(d.texto); ops.push(d); }
    return ops;
  };
  // Casos ya usados por idea (el juego, la predicción y los 15 ejemplos): «Ahora tú» y «Así se resuelve» no los repiten
  // (regla 15 de la Etapa 6; la auditoría de Certezas, A3). Cada ejemplo guarda su clave en _caso.
  const CLAVES = {};
  const usado = (idea, clave) => !!(CLAVES[idea] && CLAVES[idea].has(clave));
  const juntar = (idea, ejemplos, extra) => { CLAVES[idea] = new Set(extra.concat(ejemplos.map(e => e._caso).filter(Boolean))); };
  // Un ejemplo: con alternativas (nivel 3), la última línea del resuelto nombra cada incorrecta por su valor.
  function ejemplo(o) {
    const e = { nivel: o.nivel, titulo: o.titulo, enunciado: o.enunciado, datos: o.datos, solucion: o.solucion, respuesta: o.respuesta, _caso: o.caso || null };
    if (o.figura) e.figura = o.figura;
    if (o.alternativas) {
      const ok = o.alternativas.filter(a => a === o.correcta);
      if (ok.length !== 1) throw new Error(`ejemplo «${o.titulo}»: la correcta debe estar una sola vez`);
      e.alternativas = o.alternativas;
      e.solucion = o.solucion.concat((Array.isArray(o.explica) ? o.explica : [o.explica]).map(texto => ({ texto })));
    }
    return e;
  }

  // ---------- Idea 1: la figura que crece ----------
  // Objeto de la primera pantalla: fósforos sobre la mesa (rm-patrones, escena «fosforos»). Cambia: cuántos cuadrados
  // tiene la fila. · Permanece: el primer cuadrado de 4 fósforos. · Progresa: los 3 que agrega cada cuadrado nuevo.
  // · Se reserva: la fila de 20 (Predice). · Debe verse: el lado compartido no se cuenta dos veces.
  const H3 = Math.sqrt(3) / 2;
  // Las formas: los fósforos de la figura k, en unidades (un fósforo mide 1). El papel de cada uno: 'dato' si es de la
  // primera figura, 'agrega' si lo trajo un paso. primero y agrega se cuentan sobre el dibujo (abajo se comprueba).
  const FORMAS = {
    cuadrado: { nombre: ['cuadrado', 'cuadrados'], fila: 'una fila de cuadrados pegados', dato: 'Los cuadrados van pegados: dos vecinos comparten un fósforo.',
      palitos(k) {
        const ps = [[0, 0, 0, 1, 'dato']];
        for (let i = 0; i < k; i++) { const p = i ? 'agrega' : 'dato'; ps.push([i, 0, i + 1, 0, p], [i, 1, i + 1, 1, p], [i + 1, 0, i + 1, 1, p]); }
        return ps;
      } },
    triangulo: { nombre: ['triángulo', 'triángulos'], fila: 'una fila de triángulos, uno con la punta arriba y el siguiente con la punta abajo', dato: 'Dos triángulos vecinos comparten un fósforo.',
      palitos(k) {
        const ps = [];
        for (let i = 0; i < k; i++) {
          const a = i / 2, p = i ? 'agrega' : 'dato';
          if (i % 2 === 0) { if (!i) ps.push([a, H3, a + 0.5, 0, p]); ps.push([a, H3, a + 1, H3, p], [a + 0.5, 0, a + 1, H3, p]); }
          else ps.push([a, 0, a + 1, 0, p], [a + 1, 0, a + 0.5, H3, p]);
        }
        return ps;
      } },
    casita: { nombre: ['casita', 'casitas'], fila: 'una fila de casitas pegadas (cada casita: un cuadrado con techo de dos fósforos)', dato: 'Dos casitas vecinas comparten una pared.',
      palitos(k) {
        const ps = [[0, H3, 0, H3 + 1, 'dato']];
        for (let i = 0; i < k; i++) {
          const p = i ? 'agrega' : 'dato';
          ps.push([i, H3, i + 1, H3, p], [i, H3 + 1, i + 1, H3 + 1, p], [i + 1, H3, i + 1, H3 + 1, p], [i, H3, i + 0.5, 0, p], [i + 1, H3, i + 0.5, 0, p]);
        }
        return ps;
      } },
    doble: { nombre: ['columna', 'columnas'], fila: 'una fila de columnas de dos cuadrados, uno sobre otro', dato: 'Dos columnas vecinas comparten sus fósforos del medio.',
      palitos(k) {
        const ps = [[0, 0, 0, 1, 'dato'], [0, 1, 0, 2, 'dato']];
        for (let i = 0; i < k; i++) { const p = i ? 'agrega' : 'dato'; ps.push([i, 0, i + 1, 0, p], [i, 1, i + 1, 1, p], [i, 2, i + 1, 2, p], [i + 1, 0, i + 1, 1, p], [i + 1, 1, i + 1, 2, p]); }
        return ps;
      } },
  };
  const ALTO_F = { cuadrado: 1, triangulo: H3, casita: H3 + 1, doble: 2 };
  // Lo que trae la primera y lo que agrega cada paso, contado en el dibujo (no escrito a mano).
  for (const [k, F] of Object.entries(FORMAS)) {
    F.primero = F.palitos(1).length; F.agrega = F.palitos(2).length - F.primero;
    if (F.palitos(7).length !== F.primero + 6 * F.agrega) throw new Error(`forma ${k}: no crece siempre igual`);
  }
  const fos = (forma, k) => FORMAS[forma].palitos(k).length;
  const figFos = (forma, ks, o = {}) => ({ pieza: PZ, datos: Object.assign({ escena: 'fosforos', columna: true, alto: ALTO_F[forma], unidad: o.unidad || 40,
    figuras: ks.map(k => ({ titulo: `Figura ${k}`, palitos: FORMAS[forma].palitos(k).map(p => (o.sinPapel ? p.slice(0, 4) : p)) })) },
  o.nota ? { nota: o.nota } : {}, o.meta ? { meta: o.meta } : {}), estado: {} });
  const fosTxt = (forma, ks) => `Las figuras ${lista(ks.map(String))} tienen ${lista(ks.map(k => String(fos(forma, k))))} fósforos.`;
  const D_FIG = 'Figura n: lo de la figura 1 más lo que agrega cada paso, por (n − 1) pasos.';
  const D_IGUAL = 'Cada figura se arma desde la anterior, siempre de la misma manera.';
  const FOS = ['fósforo', 'fósforos'];
  const K_J1 = 6, T_J1 = fos('cuadrado', K_J1);
  if (T_J1 !== 19) throw new Error('juego de la idea 1: la fila de 6 cuadrados debe usar 19 fósforos');
  const K_P1 = 20, R_P1 = fos('cuadrado', K_P1);
  if (R_P1 !== 61) throw new Error('predicción de la idea 1');
  function lecturaJ1(val) {
    const t = fos('cuadrado', val.k);
    if (val.k === 1) return ['1 cuadrado: 4 fósforos, todos del primero'];
    return [`4 del primero y 3 × ${f0(val.k - 1)} nuevos: ${pl(t, FOS)}`];
  }
  // «Ahora tú» y «Así se resuelve»: claves para no repetir ejemplos, juego ni predicción.
  const kFos = (forma, k) => `fos|${forma}|${k}`;
  const kInv = (forma, k) => `inv|${forma}|${k}`;
  const kDif = (forma, a, b) => `dif|${forma}|${a}|${b}`;
  function distFos(forma, k) {
    const F = FORMAS[forma], bien = fos(forma, k), plu = F.nombre[1];
    return [
      { id: 'todos', valor: F.primero * k, error: 'RMP1', siFuera: `Bien que cuentas ${f0(F.primero)} por ${F.nombre[0]}, pero los vecinos comparten: cada nuevo trae ${f0(F.agrega)}.` },
      k % 2 === 0 ? { id: 'doble', valor: 2 * fos(forma, k / 2), error: 'RM2', siFuera: `Dos filas de ${f0(k / 2)} ${plu} sueltas usan ${f0(2 * fos(forma, k / 2))}; pegadas, comparten fósforos.` } : null,
      { id: 'sin1', valor: F.agrega * k, error: 'RMP160', siFuera: `${f0(F.agrega)} es lo que trae cada nuevo; el primero trae ${f0(F.primero)}: faltan ${f0(F.primero - F.agrega)}.` },
      { id: 'sig', valor: fos(forma, k + 1), error: 'RMP161', siFuera: `Diste un paso de más: de la figura 1 a la ${f0(k)} hay ${f0(k - 1)} pasos.` },
    ].filter(Boolean).filter(d => d.valor !== bien);
  }
  const figuras = {
    id: 'figuras-que-crecen',
    titulo: 'La figura que crece',
    pregunta: '¿Cómo se cuenta una figura sin dibujarla?',
    temas: ['Inducción con figuras'],
    pieza: PZ,
    aprendizaje: 'La figura n se cuenta por cómo se arma: lo que tiene la primera más lo que agrega cada paso, por los n − 1 pasos.',
    actividad: 'Armar filas de cuadrados con fósforos y mirar cuántos trae cada uno nuevo.',
    // Lee: los fósforos, la sucesión y la letra n. No dice cuántos fósforos tiene la fila de 20 (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Fósforos sobre la mesa', texto: 'En los exámenes aparecen figuras armadas con fósforos iguales. Se dibujan la figura 1, la 2 y la 3, y te preguntan por una figura lejana, que nadie quiere dibujar.',
          pieza: PZ, dibujo: figFos('cuadrado', [1, 2, 3], { sinPapel: true }) },
        { titulo: 'Una lista con orden', texto: ['Las figuras forman una sucesión: una lista en orden, donde cada una tiene su lugar. La letra ', N, ' dice ese lugar. Una cuenta con ', N, ' que da cualquier figura es su término general.'] },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego, el primer cuadrado va en naranja. Lo que trae cada cuadrado nuevo va en turquesa. Fíjate cuántos fósforos turquesa trae cada uno.' },
      ],
    },
    juega: {
      pieza: PZ,
      consigna: 'Con fósforos iguales se arma una fila de cuadrados pegados. Agrega cuadrados y mira cuántos fósforos trae cada uno nuevo.',
      mision: {
        texto: `Arma la fila que usa justo ${f0(T_J1)} fósforos.`,
        logrado: v => fos('cuadrado', v.k) === T_J1,
        bien: [`Son ${f0(K_J1)} cuadrados: 4 fósforos del primero y 3 por cada uno de los otros ${f0(K_J1 - 1)}.`],
      },
      voz: 'Mira qué trae cada cuadrado nuevo: el lado de su izquierda ya estaba.',
      leyenda: [
        { s: O('fósforo naranja'), t: 'los del primer cuadrado' },
        { s: I('fósforo turquesa'), t: 'los que trae cada cuadrado nuevo' },
      ],
      controles: [{ id: 'k', etiqueta: 'Cuadrados', min: 1, max: 7, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: { escena: 'fosforos', alto: 1, unidad: 40, figuras: [{ palitos: FORMAS.cuadrado.palitos(val.k) }] }, estado: {} }),
      lectura: val => lecturaJ1(val),
      minimo: 3,
    },
    predice: {
      pregunta: `Con la misma regla, ¿cuántos fósforos tiene la fila de ${f0(K_P1)} cuadrados?`,
      datos: [fosTxt('cuadrado', [1, 2, 3])],
      voz: 'Piensa qué trae el primero y qué trae cada uno de los demás.',
      opciones: [
        { id: 'cuatro', texto: pl(4 * K_P1, FOS), error: 'RMP1', siFuera: 'Bien que cada cuadrado tiene 4 fósforos, pero dos vecinos comparten uno: cada nuevo trae 3.' },
        { id: 'prop', texto: pl(4 * fos('cuadrado', 5), FOS), error: 'RM2', siFuera: `La fila de 5 usa ${f0(fos('cuadrado', 5))}; cuatro filas de 5 pegadas no son 4 veces eso: se comparten fósforos.` },
        { id: 'c', texto: pl(R_P1, FOS), correcta: true },
        { id: 'tres', texto: pl(3 * K_P1, FOS), error: 'RMP160', siFuera: `3 por cuadrado es lo que trae cada nuevo; el primero trae 4: falta uno.` },
      ],
      dibujo: figFos('cuadrado', [1, 2, 3], { sinPapel: true }),
      revelar: figFos('cuadrado', [1, 2, 3], { nota: [{ t: `Fila de ${f0(K_P1)}: 4 + 3 × ${f0(K_P1 - 1)} = ${f0(R_P1)} fósforos`, papel: 'seguro' }] }),
      coincide: `Coincide: el primero trae 4 y cada uno de los otros ${f0(K_P1 - 1)} trae 3.`,
      noCoincide: 'Revisemos: cada cuadrado nuevo comparte un lado con el anterior.',
    },
    mira: {
      pieza: PZ,
      datos: { escena: 'fosforos', alto: 1, unidad: 36, notas: 1, figuras: [{ titulo: 'Figura 4', palitos: FORMAS.cuadrado.palitos(4).map((p, i) => p.concat([i < 4 ? 0 : 1])) }],
        nota: [{ t: '4 + 3 × 3 = 13 fósforos', desde: 2 }] },
      voz: 'Lo del primero, y lo que agrega cada paso.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El primer cuadrado usa 4 fósforos.', ecuacion: [O('4')] },
        { estado: { corte: 1 }, texto: 'Cada cuadrado nuevo comparte un lado: trae solo 3.', ecuacion: [O('4'), ' + ', I('3'), ' + ', I('3'), ' + ', I('3'), ' = 13'] },
        { estado: { corte: 2 }, texto: 'De la figura 1 a la 4 hay 3 pasos; cada uno agrega 3.', ecuacion: [O('4'), ' + ', I('3'), ' × 3 = 13'] },
        { estado: { corte: 2 }, texto: 'De la figura 1 a la figura n hay n − 1 pasos.', ecuacion: [O('4'), ' + ', I('3'), ' × (', N, ' − 1)'] },
      ],
    },
    regla: {
      texto: 'Para contar la figura n sin dibujarla, mira cómo se arma: lo que tiene la figura 1, más lo que agrega cada paso por los n − 1 pasos.',
      ecuacion: [{ llave: ['figura 1'], nota: 'lo que tiene', color: 'c-o' }, ' + ', { llave: ['paso × (', N, ' − 1)'], nota: 'lo que agregan los pasos', color: 'c-i' }],
      condicion: 'cada figura se arma desde la anterior agregando siempre lo mismo; de la figura 1 a la n hay n − 1 pasos.',
      voz: 'La figura lejana sale de la construcción, no de dibujarla.',
    },
    ejemplos: null,
    // Así se resuelve: casitas y columnas de dos pisos (directo e inverso). «Ahora tú» usa cuadrados y triángulos.
    resuelve: {
      pieza: PZ,
      generar(s) {
        const r = azar(s + 900), forma = ['casita', 'doble'][s % 2], F = FORMAS[forma], inverso = Math.floor(s / 2) % 2 === 1;
        let k;
        do { k = r.ent(14, 39); } while (usado('figuras-que-crecen', inverso ? kInv(forma, k) : kFos(forma, k)));
        const t = fos(forma, k), plu = F.nombre[1];
        const base = {
          dibujo: figFos(forma, [1, 2, 3], { sinPapel: true }),
          pasos: [
            { tipo: 'pide', texto: inverso ? `Piden cuántas ${plu} tiene la figura que usa ${pl(t, FOS)}.` : `Piden los fósforos de la figura ${f0(k)}, sin dibujarla.` },
            { tipo: 'datos', texto: `Las figuras 1, 2 y 3 tienen ${f0(fos(forma, 1))}, ${f0(fos(forma, 2))} y ${f0(fos(forma, 3))}. ${F.dato}`,
              dibujo: figFos(forma, [1, 2, 3]) },
            { tipo: 'regla', texto: `La figura 1 trae ${f0(F.primero)} fósforos y cada ${F.nombre[0]} nueva trae ${f0(F.agrega)}: lo que ya estaba no se vuelve a poner.` },
          ],
        };
        if (!inverso) {
          base.pasos.push({ tipo: 'cuentas', texto: `De la figura 1 a la ${f0(k)} hay ${f0(k - 1)} pasos.`, ecuacion: [O(f0(F.primero)), ' + ', I(f0(F.agrega)), ` × ${f0(k - 1)} = `, F_(t)] },
            { tipo: 'sentido', texto: `Compruebo la cuenta con la figura 3: ${f0(F.primero)} + ${f0(F.agrega)} × 2 = ${f0(fos(forma, 3))}, como en el dibujo.` });
          return Object.assign(base, { enunciado: `Con fósforos iguales se arma ${F.fila}. ¿Cuántos fósforos tiene la figura ${f0(k)}?`, datos: [D_FIG, D_IGUAL], respuesta: [F_(pl(t, FOS))] });
        }
        base.pasos.push({ tipo: 'cuentas', texto: `Quito los ${f0(F.primero)} de la figura 1; lo que queda lo traen los pasos, de ${f0(F.agrega)} en ${f0(F.agrega)}.`, ecuacion: [`(${f0(t)} − ${f0(F.primero)}) ÷ ${f0(F.agrega)} = ${f0(k - 1)}`] },
          { tipo: 'cuentas', texto: `Son ${f0(k - 1)} pasos después de la figura 1: la figura tiene uno más.`, ecuacion: [`${f0(k - 1)} + 1 = `, F_(f0(k))] },
          { tipo: 'sentido', texto: `Compruebo: ${f0(F.primero)} + ${f0(F.agrega)} × ${f0(k - 1)} = ${f0(t)} fósforos.` });
        return Object.assign(base, { enunciado: `Con fósforos iguales se arma ${F.fila}. Una de las figuras usa ${pl(t, FOS)}. ¿Cuántas ${plu} tiene?`, datos: [D_FIG, D_IGUAL], respuesta: [F_(pl(k, F.nombre))] });
      },
    },
    // Ahora tú, por tipos (semilla % 3): 0 la figura k (cuadrados o triángulos) · 1 cuántas tiene la figura de T fósforos
    // · 2 cuántos fósforos más tiene la figura b que la a. Cada distractor dice el valor de su error.
    ahoraTu: {
      pieza: PZ,
      voz: 'Primero lo que trae la figura 1; después, lo de cada paso.',
      generar(s) {
        const r = azar(s), tipo = s % 3, forma = r.elegir(['cuadrado', 'triangulo']), F = FORMAS[forma], plu = F.nombre[1];
        const dibujo = figFos(forma, [1, 2, 3], { sinPapel: true });
        if (tipo === 0) {
          let k;
          do { k = r.ent(12, 60); } while ((forma === 'cuadrado' && (k === K_P1 || k === K_J1)) || usado('figuras-que-crecen', kFos(forma, k)));
          const bien = fos(forma, k);
          return { pregunta: `Con fósforos iguales se arma ${F.fila}. ¿Cuántos fósforos tiene la figura ${f0(k)}?`, datos: [D_FIG, F.dato], dibujo,
            opciones: opcionesNum(bien, FOS, distFos(forma, k)),
            solucion: { texto: `La figura 1 trae ${f0(F.primero)} y cada uno de los otros ${f0(k - 1)} pasos agrega ${f0(F.agrega)}.`, ecuacion: [O(f0(F.primero)), ' + ', I(f0(F.agrega)), ` × ${f0(k - 1)} = `, F_(f0(bien))] } };
        }
        if (tipo === 1) {
          let k;
          do { k = r.ent(15, 70); } while ((forma === 'cuadrado' && (k === K_P1 || k === K_J1)) || usado('figuras-que-crecen', kInv(forma, k)));
          const t = fos(forma, k);
          const ds = [
            { id: 'sin1', valor: k - 1, error: 'RMP160', siFuera: `${f0(k - 1)} son los pasos después de la figura 1; falta contar la figura 1.` },
            { id: 'mas1', valor: k + 1, error: 'RMP161', siFuera: `Bien que quitas lo de la figura 1, pero contaste un paso de más.` },
            { id: 'mas2', valor: k + 2, error: 'RMP161', siFuera: 'Contaste dos pasos de más: comprueba tu respuesta con la cuenta de la figura.' },
            { id: 'menos2', valor: k - 2, error: 'RMP161', siFuera: 'Contaste un paso de menos y olvidaste la figura 1.' },
            t % F.primero === 0 ? { id: 'todos', valor: t / F.primero, error: 'RMP1', siFuera: `Dividir entre ${f0(F.primero)} sería si cada ${F.nombre[0]} tuviera sus fósforos propios.` } : null,
            t % F.agrega === 0 ? { id: 'agrega', valor: t / F.agrega, error: 'RMP160', siFuera: `Dividir entre ${f0(F.agrega)} olvida que la figura 1 trae ${f0(F.primero)}.` } : null,
          ].sort((x, y) => (x && x.id.endsWith('2') ? 1 : 0) - (y && y.id.endsWith('2') ? 1 : 0));
          return { pregunta: `Con fósforos iguales se arma ${F.fila}. Una de las figuras usa ${pl(t, FOS)}. ¿Cuántos ${plu} tiene?`, datos: [D_FIG, F.dato], dibujo,
            opciones: opcionesNum(k, F.nombre, ds),
            solucion: { texto: `Sin los ${f0(F.primero)} de la figura 1 quedan los pasos, de ${f0(F.agrega)} en ${f0(F.agrega)}; la figura 1 suma uno.`, ecuacion: [`(${f0(t)} − ${f0(F.primero)}) ÷ ${f0(F.agrega)} + 1 = `, F_(f0(k))] } };
        }
        let a, b;
        do { a = r.ent(5, 30); b = a + r.ent(6, 25); } while (usado('figuras-que-crecen', kDif(forma, a, b)));
        const bien = F.agrega * (b - a);
        const ds = [
          { id: 'mas1', valor: F.agrega * (b - a + 1), error: 'RMP161', siFuera: `Contaste ${f0(b - a + 1)} pasos; de la figura ${f0(a)} a la ${f0(b)} hay ${f0(b - a)}.` },
          { id: 'todos', valor: F.primero * (b - a), error: 'RMP1', siFuera: `Cada ${F.nombre[0]} nuevo no trae ${f0(F.primero)}: comparte con su vecino y trae ${f0(F.agrega)}.` },
          { id: 'fig', valor: fos(forma, b - a), error: 'RM2', siFuera: `Esos son los fósforos de la figura ${f0(b - a)}, que trae los de una figura 1.` },
          { id: 'total', valor: fos(forma, b), error: 'RMP160', siFuera: `Esa es la figura ${f0(b)} entera; piden solo lo que tiene de más que la ${f0(a)}.` },
        ];
        return { pregunta: `Con fósforos iguales se arma ${F.fila}. ¿Cuántos fósforos más tiene la figura ${f0(b)} que la figura ${f0(a)}?`, datos: [D_FIG, F.dato], dibujo,
          opciones: opcionesNum(bien, FOS, ds),
          solucion: { texto: `De la figura ${f0(a)} a la ${f0(b)} hay ${f0(b - a)} pasos, y cada paso agrega ${f0(F.agrega)}.`, ecuacion: [I(f0(F.agrega)), ` × ${f0(b - a)} = `, F_(f0(bien))] } };
      },
    },
  };
  function F_(t) { return F(typeof t === 'number' ? f0(t) : t); }

  // ---------- Ejemplos resueltos de «La figura que crece» (pestaña «Ejemplos»; molde §3) ----------
  // Cada número sale de contar los fósforos del dibujo (FORMAS); además se resolvieron aparte con un script que no usa
  // el código de la unidad (scratchpad e8-rm/verificar.py, que arma cada figura fósforo por fósforo): 1 → 25 · 2 → 21 ·
  // 3 → 5 · 4 → 31 · 5 → 27 · 6 → 15 · 7 → 36 · 8 → 126 · 9 → 40 · 10 → 17 · 11 → 121 (A) · 12 → 101 (B) · 13 → 30 (C)
  // · 14 → 30 (D) · 15 → 502 (E). La figura es el planteamiento: las figuras 1 a 3, nunca la pedida.
  function ejDirecto(nivel, titulo, forma, k) {
    const F = FORMAS[forma], t = fos(forma, k);
    return ejemplo({ nivel, titulo, caso: kFos(forma, k),
      enunciado: `Con fósforos iguales se arma ${F.fila}. ¿Cuántos fósforos tiene la figura ${f0(k)}?`,
      datos: [D_FIG, F.dato], figura: figFos(forma, [1, 2, 3], { sinPapel: true }),
      solucion: [{ texto: `La figura 1 tiene ${f0(F.primero)}; cada ${F.nombre[0]} nuevo trae ${f0(F.agrega)}, porque comparte con su vecino.`.replace(/cada (casita|columna) nuevo/, 'cada $1 nueva') },
        { texto: `De la figura 1 a la ${f0(k)} hay ${f0(k - 1)} pasos.`, ecuacion: [O(f0(F.primero)), ' + ', I(f0(F.agrega)), ` × ${f0(k - 1)} = `, F_(t)] }],
      respuesta: [F_(pl(t, FOS))] });
  }
  function ejInverso(o) {
    const F = FORMAS[o.forma], t = fos(o.forma, o.k);
    return ejemplo(Object.assign({ caso: kInv(o.forma, o.k),
      enunciado: `Con fósforos iguales se arma ${F.fila}. Una de las figuras usa ${pl(t, FOS)}. ¿Cuántas ${F.nombre[1]} tiene?`.replace(/¿Cuántas (cuadrados|triángulos)/, '¿Cuántos $1'),
      datos: [D_FIG, F.dato], figura: figFos(o.forma, [1, 2, 3], { sinPapel: true }),
      solucion: [{ texto: `Sin los ${f0(F.primero)} de la figura 1 quedan los fósforos de los pasos, de ${f0(F.agrega)} en ${f0(F.agrega)}.`, ecuacion: [`(${f0(t)} − ${f0(F.primero)}) ÷ ${f0(F.agrega)} = ${f0(o.k - 1)}`] },
        { texto: `Son ${f0(o.k - 1)} pasos después de la figura 1: la figura tiene uno más.`, ecuacion: [`${f0(o.k - 1)} + 1 = `, F_(o.k)] }],
      respuesta: [F_(pl(o.k, F.nombre))] }, o));
  }
  const EJEMPLOS_FIG = [
    ejDirecto(1, 'Ocho cuadrados', 'cuadrado', 8),
    ejDirecto(1, 'Diez triángulos', 'triangulo', 10),
    ejemplo({ nivel: 1, titulo: 'Lo que trae cada casita', caso: 'agrega|casita',
      enunciado: `Con fósforos iguales se arma ${FORMAS.casita.fila}. ¿Cuántos fósforos trae cada casita nueva?`,
      datos: [D_IGUAL, FORMAS.casita.dato], figura: figFos('casita', [1, 2, 3], { sinPapel: true }),
      solucion: [{ texto: 'Una casita nueva pone su techo (2), su piso, su lado de arriba y su pared derecha; la izquierda ya estaba.', ecuacion: [`2 + 1 + 1 + 1 = `, F_(FORMAS.casita.agrega)] }],
      respuesta: [F_(pl(FORMAS.casita.agrega, FOS))] }),
    ejDirecto(1, 'Seis casitas', 'casita', 6),
    ejDirecto(1, 'Cinco columnas de dos pisos', 'doble', 5),
    ejInverso({ nivel: 2, titulo: 'Cuadrados con 46 fósforos', forma: 'cuadrado', k: 15 }),
    ejemplo({ nivel: 2, titulo: 'Entre las figuras 12 y 30', caso: kDif('triangulo', 12, 30),
      enunciado: `Con fósforos iguales se arma ${FORMAS.triangulo.fila}. ¿Cuántos fósforos más tiene la figura 30 que la figura 12?`,
      datos: [D_FIG, FORMAS.triangulo.dato], figura: figFos('triangulo', [1, 2, 3], { sinPapel: true }),
      solucion: [{ texto: 'De la figura 12 a la 30 hay 18 pasos.', ecuacion: ['30 − 12 = 18'] },
        { texto: 'Cada paso agrega un triángulo, que trae 2 fósforos.', ecuacion: [I('2'), ' × 18 = ', F_(2 * 18)] }],
      respuesta: [F_(pl(2 * 18, FOS))] }),
    ejDirecto(2, 'Veinticinco casitas', 'casita', 25),
    ejemplo({ nivel: 2, titulo: 'Con dos cajas de fósforos', caso: 'cajas|cuadrado|80',
      enunciado: `Tienes dos cajas con 40 fósforos cada una y armas ${FORMAS.cuadrado.fila}. ¿Cuántos cuadrados tiene la fila más larga que puedes armar?`,
      datos: [D_FIG, FORMAS.cuadrado.dato, 'No es necesario usar todos los fósforos.'], figura: figFos('cuadrado', [1, 2, 3], { sinPapel: true }),
      solucion: [{ texto: 'Hay 80 fósforos. Sin los 4 del primer cuadrado quedan 76; cada cuadrado nuevo usa 3.', ecuacion: ['76 = 3 × 25 + 1'] },
        { texto: 'Caben 25 cuadrados nuevos y sobra un fósforo. Con el primero son 26.', ecuacion: ['25 + 1 = ', F_(26)] }],
      respuesta: [F_(pl(26, ['cuadrado', 'cuadrados']))] }),
    ejInverso({ nivel: 2, titulo: 'Dos pisos con 87 fósforos', forma: 'doble', k: 17 }),
    // Nivel 3 (tipo examen), con alternativas por su valor. Letras: A, B, C, D, E.
    ejemplo({ nivel: 3, titulo: 'La fila de 40 cuadrados', caso: kFos('cuadrado', 40),
      enunciado: `Con fósforos iguales se arma ${FORMAS.cuadrado.fila}. ¿Cuántos fósforos tiene la figura 40?`,
      datos: [D_FIG, FORMAS.cuadrado.dato], figura: figFos('cuadrado', [1, 2, 3], { sinPapel: true }),
      alternativas: ['121 fósforos', '160 fósforos', '120 fósforos', '124 fósforos', '122 fósforos'], correcta: '121 fósforos',
      solucion: [{ texto: 'La figura 1 tiene 4; cada uno de los otros 39 cuadrados trae 3.', ecuacion: [O('4'), ' + ', I('3'), ' × 39 = ', F_(121)] }],
      explica: '160 cuenta 4 por cuadrado; 120 olvida el fósforo de más del primero; 124 es la figura 41; 122 junta dos filas de 20 sin pegarlas.',
      respuesta: [F_('121 fósforos')] }),
    ejemplo({ nivel: 3, titulo: 'Cincuenta triángulos', caso: kFos('triangulo', 50),
      enunciado: `Con fósforos iguales se arma ${FORMAS.triangulo.fila}. ¿Cuántos fósforos tiene la figura 50?`,
      datos: [D_FIG, FORMAS.triangulo.dato], figura: figFos('triangulo', [1, 2, 3], { sinPapel: true }),
      alternativas: ['150 fósforos', '101 fósforos', '100 fósforos', '103 fósforos', '102 fósforos'], correcta: '101 fósforos',
      solucion: [{ texto: 'La figura 1 tiene 3; cada uno de los otros 49 triángulos trae 2.', ecuacion: [O('3'), ' + ', I('2'), ' × 49 = ', F_(101)] }],
      explica: '150 cuenta 3 por triángulo; 100 olvida el fósforo de más del primero; 103 es la figura 51; 102 junta dos filas de 25 sin pegarlas.',
      respuesta: [F_('101 fósforos')] }),
    ejInverso({ nivel: 3, titulo: 'La casita de 151 fósforos', forma: 'casita', k: 30,
      alternativas: ['29 casitas', '25 casitas', '30 casitas', '31 casitas'], correcta: '30 casitas',
      explica: '29 son los pasos, sin la casita 1; 25 sale de repartir 151 entre 6, como si cada casita tuviera sus 6 fósforos; 31 cuenta un paso de más.' }),
    ejInverso({ nivel: 3, titulo: 'Dos pisos con 152 fósforos', forma: 'doble', k: 30,
      alternativas: ['29 columnas', '31 columnas', '21 columnas', '30 columnas'], correcta: '30 columnas',
      explica: '29 son los pasos, sin la columna 1; 31 cuenta un paso de más; 21 sale de repartir 152 entre 7, como si cada columna tuviera sus 7 fósforos.' }),
    ejemplo({ nivel: 3, titulo: 'La columna 100', caso: kFos('doble', 100),
      enunciado: `Con fósforos iguales se arma ${FORMAS.doble.fila}. ¿Cuántos fósforos tiene la figura 100?`,
      datos: [D_FIG, FORMAS.doble.dato], figura: figFos('doble', [1, 2, 3], { sinPapel: true }),
      alternativas: ['700 fósforos', '500 fósforos', '507 fósforos', '504 fósforos', '502 fósforos'], correcta: '502 fósforos',
      solucion: [{ texto: 'La figura 1 tiene 7; cada una de las otras 99 columnas trae 5.', ecuacion: [O('7'), ' + ', I('5'), ' × 99 = ', F_(502)] }],
      explica: '700 cuenta 7 por columna; 500 olvida los 2 de más de la primera; 507 es la figura 101; 504 junta dos filas de 50 sin pegarlas.',
      respuesta: [F_('502 fósforos')] }),
  ];
  // Comprobación al cargar: los totales que dicen los textos salen de contar el dibujo.
  if (fos('cuadrado', 40) !== 121 || fos('triangulo', 50) !== 101 || fos('casita', 30) !== 151 || fos('doble', 30) !== 152 || fos('doble', 100) !== 502
    || fos('cuadrado', 15) !== 46 || fos('doble', 17) !== 87 || fos('cuadrado', 26) > 80 || fos('cuadrado', 27) <= 80) throw new Error('ejemplos de la idea 1');
  figuras.ejemplos = EJEMPLOS_FIG;
  juntar('figuras-que-crecen', EJEMPLOS_FIG, [kFos('cuadrado', K_J1), kFos('cuadrado', K_P1)]);

  // ---------- Idea 2: tres casos no prueban ----------
  // Objeto: la torta del cumpleaños vista desde arriba (rm-patrones, escena «torta»). Cambia: cuántas velitas hay en el
  // borde. · Permanece: un corte recto entre cada par de velitas. · Progresa: los pedazos 1, 2, 4, 8, 16. · Se reserva:
  // la torta de 6 velitas, donde «se duplica» falla (Predice). · Debe verse: un patrón visto es una hipótesis.
  // Los pedazos los cuenta la pieza (prueba de rm-patrones: 1 + cortes + cruces de la figura); aquí no se enseña esa cuenta
  // (las regiones con rectas son de Máximos y mínimos).
  const PEDAZOS = [1, 2, 4, 8, 16, 31, 57];
  const pedazos = k => PEDAZOS[k - 1];
  const torta = (k, o = {}) => ({ pieza: PZ, datos: Object.assign({ escena: 'torta', velitas: k, titulo: o.titulo || 'Torta del cumpleaños' }, o.nota ? { nota: o.nota } : {}, o.notas ? { notas: o.notas } : {}), estado: {} });
  const K_J2 = 4, K_P2 = 6;
  function lecturaJ2(val) {
    if (val.k === 1) return ['1 velita: ningún corte, 1 pedazo'];
    return [`Velitas 1 a ${f0(val.k)}: ${lista(rango(1, val.k).map(x => f0(pedazos(x))))} pedazos`];
  }
  const esPrimo = x => x > 1 && rango(2, Math.floor(Math.sqrt(x))).every(d => x % d);
  const D_PRIMO = 'Un número primo tiene solo dos divisores: 1 y él mismo.';
  const D_CONTRA = 'Contraejemplo: un caso que no cumple lo que se afirma.';
  // Afirmaciones que fallan: el polinomio n × n + n + p (primo de n = 0 a p − 2 con p = 5, 11, 17, 41) y 6 × n ± 1.
  const POLI = p => ({ t: `n × n + n + ${p}`, f: n => n * n + n + p, desde: 0 });
  const SEIS = s => ({ t: `6 × n ${s > 0 ? '+' : '−'} 1`, f: n => 6 * n + s, desde: 1 });
  const DOS = { t: '2 × n × n + 11', f: n => 2 * n * n + 11, desde: 0 };
  const IMPAR = { t: '2 × n + 1', f: n => 2 * n + 1, desde: 1 };
  const primerFallo = A => { for (let x = A.desde; ; x++) if (!esPrimo(A.f(x))) return x; };
  for (const [A, x] of [[POLI(5), 4], [POLI(11), 10], [POLI(17), 16], [POLI(41), 40], [SEIS(1), 4], [SEIS(-1), 6], [DOS, 11], [IMPAR, 4]]) if (primerFallo(A) !== x) throw new Error(`idea 2: ${A.t}`);
  const factores = x => { for (let d = 2; d * d <= x; d++) if (x % d === 0) return `${f0(d)} × ${f0(x / d)}`; return null; };
  const kAfirma = (t, tipo) => `afirma|${t}|${tipo}`;
  const kReglas = (a, b, c, regla) => `reglas|${a},${b},${c}|${regla}`;
  const tres = {
    id: 'tres-casos-no-prueban',
    titulo: 'Tres casos no prueban',
    pregunta: 'Si una regla funciona en cinco casos, ¿ya está probada?',
    temas: ['Inducción verbal', 'Inducción numérica'],
    pieza: PZ,
    aprendizaje: 'Un patrón visto en unos casos es una hipótesis: vale si se explica por cómo se arma; un solo contraejemplo la descarta.',
    actividad: 'Poner velitas en el borde de una torta, cortarla y anotar los pedazos.',
    lee: {
      tarjetas: [
        { titulo: 'Adivinar la regla', texto: 'Si ves 2, 4, 6, piensas que sigue 8. Pasar de unos casos a una regla dicha con palabras se llama inducción. La regla que propones así es una hipótesis: falta probarla.' },
        { titulo: 'La torta del cumpleaños', texto: 'La torta tiene velitas en el borde. Se corta en línea recta de cada velita a cada otra, sin que tres cortes pasen por un mismo punto. Después se cuentan los pedazos.',
          pieza: PZ, dibujo: torta(3) },
        { titulo: 'Dos reglas para una lista', texto: 'La lista 1, 2, 4 puede seguir con 8 (cada número es el doble del anterior) o con 7 (se suma 1, después 2, después 3). Tres números no deciden cuál.' },
        { titulo: 'Qué mirar al jugar', texto: 'Pon velitas una por una y anota cuántos pedazos salen. Di con tus palabras qué parece pasar con cada velita nueva.' },
      ],
    },
    juega: {
      pieza: PZ,
      consigna: 'La torta se corta en línea recta entre cada par de velitas. Pon velitas y anota cuántos pedazos salen.',
      mision: {
        texto: `Pon las velitas que dejan la torta en ${f0(pedazos(K_J2))} pedazos.`,
        logrado: v => pedazos(v.k) === pedazos(K_J2),
        bien: [`Con ${f0(K_J2)} velitas, ${f0(pedazos(K_J2))} pedazos. Mira la lista: ¿qué parece pasar con cada velita nueva?`],
      },
      voz: 'Anota la lista y di qué parece pasar. ¿Ya está probado?',
      leyenda: [
        { s: 'velita', t: 'el círculo del borde, con su llama' },
        { s: 'corte', t: 'una línea recta entre dos velitas' },
      ],
      controles: [{ id: 'k', etiqueta: 'Velitas', min: 1, max: 5, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: { escena: 'torta', velitas: val.k, titulo: 'Torta del cumpleaños' }, estado: {} }),
      lectura: val => lecturaJ2(val),
      minimo: 3,
    },
    predice: {
      pregunta: `Con 1, 2, 3, 4 y 5 velitas salen 1, 2, 4, 8 y 16 pedazos. ¿Cuántos salen con ${f0(K_P2)} velitas?`,
      datos: ['Las velitas van en el borde y tres cortes nunca pasan por un mismo punto.'],
      voz: 'Antes de responder, piensa: ¿cinco casos prueban una regla?',
      opciones: [
        { id: 'doble', texto: '32 pedazos', error: 'RMP162', siFuera: '32 sigue «cada velita duplica», que valió hasta 5 velitas. Con 6, los cortes ya no duplican.' },
        { id: 'c', texto: `${f0(pedazos(K_P2))} pedazos`, correcta: true },
        { id: 'mas', texto: '24 pedazos', error: 'RMP163', siFuera: 'Sumaste 8 otra vez, lo que creció de 4 a 5 velitas; nada dice que el paso se repita.' },
      ],
      dibujo: torta(5),
      revelar: torta(K_P2, { nota: [{ t: `${f0(K_P2)} velitas: ${f0(pedazos(K_P2))} pedazos, no 32`, papel: 'seguro' }] }),
      coincide: `Coincide: con ${f0(K_P2)} velitas salen ${f0(pedazos(K_P2))}. La regla «se duplica» era solo una hipótesis.`,
      noCoincide: 'Revisemos: «se duplica» valió cinco veces, pero nadie explicó por qué.',
    },
    mira: {
      pieza: PZ,
      datos: { escena: 'torta', velitas: K_P2, titulo: 'Torta con 6 velitas', notas: 1, nota: [{ t: '31 pedazos: falla «se duplica»', papel: 'agrega', desde: 2 }] },
      voz: 'Un caso que no cumple basta para descartar.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Hasta 5 velitas, cada una nueva duplicó los pedazos.', ecuacion: ['1, 2, 4, 8, 16'] },
        { estado: { corte: 1 }, texto: 'La hipótesis «se duplica» dice que con 6 salen 32.', ecuacion: ['16 × 2 = 32'] },
        { estado: { corte: 2 }, texto: 'Con 6 velitas se cuentan 31 pedazos (con la lupa se ven todos).', ecuacion: [I('31'), ' ≠ 32'] },
        { estado: { corte: 2 }, texto: 'Un solo caso que no cumple descarta la hipótesis.' },
      ],
    },
    regla: {
      texto: 'Lo que se ve en unos casos es una hipótesis. Vale si se explica por cómo se arma cada caso; un solo caso que no cumple, un contraejemplo, la descarta.',
      ecuacion: [{ llave: ['un caso que falla'], nota: 'contraejemplo', color: 'c-i' }, ' la descarta'],
      condicion: 'muchos casos que cumplen no prueban la regla: uno más puede descartarla, nunca probarla. Si caben varias reglas, decide el enunciado.',
      voz: 'Muchos casos no prueban; uno solo puede descartar.',
    },
    ejemplos: null,
    // Así se resuelve (semilla % 2): 0 el primer n que falla en 2 × n + 1 o en 2 × n × n + 11 · 1 dos reglas para 2, 5, 11.
    // (6 × n − 1 es el ejemplo 15: no se repite.)
    // «Ahora tú» usa n × n + n + 11, 17 o 41 y las listas a, 2a, 4a.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const A = r.elegir([IMPAR, DOS]), x = primerFallo(A), v = A.f(x), casos = rango(A.desde, x - 1);
          return {
            enunciado: `Se afirma: «${A.t} es primo para todo n desde ${f0(A.desde)}». Se revisa con n = ${f0(A.desde)}, ${f0(A.desde + 1)}, ${f0(A.desde + 2)}… ¿Cuál es el primer n que no cumple?`,
            datos: [D_PRIMO, D_CONTRA],
            pasos: [
              { tipo: 'pide', texto: 'Piden el primer caso que no cumple: un contraejemplo.' },
              { tipo: 'datos', texto: `Los primeros casos dan ${lista(casos.map(c => f0(A.f(c))))}: todos primos.` },
              { tipo: 'regla', texto: 'Que cumplan varios casos no prueba la afirmación: un solo caso que falle la descarta. Se siguen revisando, en orden.' },
              { tipo: 'cuentas', texto: `Con n = ${f0(x)} sale ${f0(v)}, que no es primo.`, ecuacion: [`${f0(v)} = ${factores(v)}`] },
              { tipo: 'sentido', texto: `Los ${f0(casos.length)} casos anteriores sí eran primos: por eso parecía una regla.` },
            ],
            respuesta: [F(`n = ${f0(x)}`)],
          };
        }
        const regla = r.elegir(['doble', 'suma']), quinto = regla === 'doble' ? 47 : 32, otro = regla === 'doble' ? 32 : 47;
        return {
          enunciado: `La lista 2, 5, 11 sigue esta regla: ${regla === 'doble' ? 'cada número es el doble del anterior, más 1' : 'lo que se suma crece de 3 en 3 (3, 6, 9…)'}. ¿Cuál es el quinto número?`,
          datos: ['Cada número de la lista sale del anterior con la regla dada.'],
          pasos: [
            { tipo: 'pide', texto: 'Piden el quinto número de la lista 2, 5, 11.' },
            { tipo: 'datos', texto: 'Tres números admiten más de una regla: el enunciado dice cuál se usa.' },
            { tipo: 'regla', texto: regla === 'doble' ? 'Uso la regla dada: el doble del anterior, más 1.' : 'Uso la regla dada: se suma 3, después 6, después 9, después 12.' },
            { tipo: 'cuentas', texto: 'Sigo la lista dos pasos más.', ecuacion: regla === 'doble' ? ['11 × 2 + 1 = 23', '   ·   ', '23 × 2 + 1 = ', F('47')] : ['11 + 9 = 20', '   ·   ', '20 + 12 = ', F('32')] },
            { tipo: 'sentido', texto: `Con la otra regla saldría ${f0(otro)}. Por eso el enunciado tenía que decir cuál usar.` },
          ],
          respuesta: [F(f0(quinto))],
        };
      },
    },
    // Ahora tú (semilla % 3): 0 cuál de los casos es un contraejemplo · 1 el cuarto número con la regla que fija el
    // enunciado · 2 el primer n que no cumple.
    ahoraTu: {
      voz: 'Prueba casos hasta encontrar uno que no cumpla.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const p = r.elegir([11, 17]), A = POLI(p), x = primerFallo(A);
          const otros = r.barajar(rango(1, Math.min(9, x - 1))).slice(0, 3).sort((a, b) => a - b);
          return {
            pregunta: `Se afirma: «${A.t} es primo para todo n desde 0». ¿Cuál de estos casos es un contraejemplo?`, datos: [D_PRIMO, D_CONTRA],
            opciones: opcionesTexto(`n = ${f0(x)}`, otros.map(c => ({ id: `n${c}`, texto: `n = ${f0(c)}`, error: 'RMP162', siFuera: `Con n = ${f0(c)} sale ${f0(A.f(c))}, que es primo: ese caso cumple.` }))),
            solucion: { texto: `Con n = ${f0(x)} sale ${f0(x)} × ${f0(x + 1)} + ${f0(p)}, que es ${f0(p)} × ${f0(p)}: no es primo.`, ecuacion: [`${f0(x)} × ${f0(x)} + ${f0(x)} + ${f0(p)} = ${f0(A.f(x))} = ${factores(A.f(x))}`] },
          };
        }
        if (tipo === 1) {
          let a, regla;
          do { a = r.ent(3, 9); regla = r.elegir(['doble', 'suma']); } while (usado('tres-casos-no-prueban', kReglas(a, 2 * a, 4 * a, regla)));
          const bien = regla === 'doble' ? 8 * a : 7 * a;
          return {
            pregunta: `La lista ${f0(a)}, ${f0(2 * a)}, ${f0(4 * a)} sigue esta regla: ${regla === 'doble' ? 'cada número es el doble del anterior' : `lo que se suma crece de ${f0(a)} en ${f0(a)}`}. ¿Cuál es el cuarto número?`,
            datos: ['Cada número de la lista sale del anterior con la regla dada.'],
            opciones: opcionesNum(bien, null, [
              { id: 'otra', valor: regla === 'doble' ? 7 * a : 8 * a, error: 'RMP164', siFuera: 'Esa sale con la otra regla que también encaja con los tres números; el enunciado fijó esta.' },
              { id: 'ultimo', valor: 6 * a, error: 'RMP163', siFuera: `Sumaste otra vez ${f0(2 * a)}, lo último que creció; la regla dada dice otra cosa.` },
              { id: 'primero', valor: 5 * a, error: 'RMP169', siFuera: `Sumaste ${f0(a)}, lo que creció al principio; la regla dada dice otra cosa.` },
            ]),
            solucion: { texto: regla === 'doble' ? 'Con la regla dada, el cuarto es el doble del tercero.' : `Se sumó ${f0(a)} y después ${f0(2 * a)}: ahora toca ${f0(3 * a)}.`, ecuacion: [regla === 'doble' ? `${f0(4 * a)} × 2 = ` : `${f0(4 * a)} + ${f0(3 * a)} = `, F(f0(bien))] },
          };
        }
        let p; do { p = r.elegir([11, 17]); } while (usado('tres-casos-no-prueban', kAfirma(POLI(p).t, 'primero')));
        const A = POLI(p), x = primerFallo(A), antes = x - 1 - r.ent(0, 2);
        return {
          pregunta: `Se afirma: «${A.t} es primo para todo n desde 0». Se revisa con n = 0, 1, 2, 3… ¿Cuál es el primer n que no cumple?`, datos: [D_PRIMO, D_CONTRA],
          opciones: opcionesTexto(`n = ${f0(x)}`, [
            { id: 'nunca', texto: 'Ninguno: siempre da primo', error: 'RMP162', siFuera: `Los primeros ${f0(x)} casos dan primos, pero eso no prueba que todos lo den.` },
            { id: 'antes', texto: `n = ${f0(antes)}`, error: 'RMP162', siFuera: `Con n = ${f0(antes)} sale ${f0(A.f(antes))}, que es primo: todavía cumple.` },
            { id: 'despues', texto: `n = ${f0(x + 1)}`, error: 'RMP161', siFuera: `Con n = ${f0(x + 1)} tampoco sale primo, pero antes ya falló n = ${f0(x)}.` },
          ]),
          solucion: { texto: `Hasta n = ${f0(x - 1)} todo sale primo; con n = ${f0(x)} sale ${f0(x)} × ${f0(x + 1)} + ${f0(p)}.`, ecuacion: [`${f0(A.f(x))} = ${factores(A.f(x))}`] },
        };
      },
    },
  };

  // ---------- Ejemplos resueltos de «Tres casos no prueban» ----------
  // Comprobados al cargar (esPrimo, primerFallo) y aparte en scratchpad e8-rm/verificar.py: 1 → 27 · 2 → sí, 10 es par ·
  // 3 → 8 · 4 → 7 · 5 → la regla es falsa · 6 → n = 4 · 7 → n = 4 · 8 → vale, por n + n = 2 × n · 9 → 16 duplica, 14
  // suma 2, 4, 6 · 10 → n = 11 · 11 → n = 40 (B) · 12 → 31 (C) · 13 → hipótesis (D) · 14 → 2 + 3 (E) · 15 → n = 6 (A).
  const D_REGLA = 'Cada número de la lista sale del anterior con la regla dada.';
  if (!(!esPrimo(27) && [7, 17, 37].every(esPrimo) && !esPrimo(2047) && [3, 7, 31, 127].every(esPrimo) && esPrimo(1601) && !esPrimo(41 * 43))) throw new Error('ejemplos de la idea 2');
  const EJEMPLOS_TRES = [
    ejemplo({ nivel: 1, titulo: 'Los que terminan en 7', caso: kAfirma('termina7', 'cual'),
      enunciado: 'Se afirma: «todo número que termina en 7 es primo». ¿Cuál de estos es un contraejemplo: 7, 17, 27 o 37?',
      datos: [D_PRIMO, D_CONTRA],
      solucion: [{ texto: '7, 17 y 37 solo se dividen entre 1 y entre sí mismos. El 27, no:', ecuacion: ['27 = 3 × 9'] }],
      respuesta: [F('27')] }),
    ejemplo({ nivel: 1, titulo: '¿Es impar siempre?', caso: kAfirma('n×n+1', 'impar'),
      enunciado: 'Se afirma: «n × n + 1 es impar para todo n». ¿Es n = 3 un contraejemplo?',
      datos: ['Un número par es múltiplo de 2; uno impar, no.', D_CONTRA],
      solucion: [{ texto: 'Con n = 3 la cuenta da un número par: no cumple.', ecuacion: ['3 × 3 + 1 = 10'] }],
      respuesta: [F('Sí: da 10, que es par')] }),
    ejemplo({ nivel: 1, titulo: 'El doble del anterior', caso: kReglas(1, 2, 4, 'doble'),
      enunciado: 'La lista 1, 2, 4 sigue esta regla: cada número es el doble del anterior. ¿Cuál es el cuarto número?',
      datos: [D_REGLA],
      solucion: [{ texto: 'El cuarto es el doble del tercero.', ecuacion: ['4 × 2 = ', F('8')] }],
      respuesta: [F('8')] }),
    ejemplo({ nivel: 1, titulo: 'Sumar 1, 2, 3', caso: kReglas(1, 2, 4, 'suma'),
      enunciado: 'La lista 1, 2, 4 sigue esta regla: se suma 1, después 2, después 3, y así. ¿Cuál es el cuarto número?',
      datos: [D_REGLA],
      solucion: [{ texto: 'Se sumó 1 y después 2: ahora toca sumar 3.', ecuacion: ['4 + 3 = ', F('7')] }],
      respuesta: [F('7')] }),
    ejemplo({ nivel: 1, titulo: 'Nueve casos y uno falla', caso: 'diez|falla',
      enunciado: 'Una regla sobre unas figuras funcionó en las figuras 1 a 9 y falló en la figura 10. ¿Qué se concluye de la regla?',
      datos: [D_CONTRA],
      solucion: [{ texto: 'La figura 10 es un caso que no cumple: un contraejemplo. Uno solo basta, aunque nueve hayan cumplido.' }],
      respuesta: [F('Es falsa: la figura 10 la contradice')] }),
    ejemplo({ nivel: 2, titulo: 'El primer n que falla', caso: kAfirma(POLI(5).t, 'primero'),
      enunciado: 'Se afirma: «n × n + n + 5 es primo para todo n desde 0». ¿Cuál es el primer n que no cumple?',
      datos: [D_PRIMO, D_CONTRA],
      solucion: [{ texto: 'Con n = 0, 1, 2 y 3 salen 5, 7, 11 y 17: todos primos.' },
        { texto: 'Con n = 4 sale 25, que no es primo.', ecuacion: ['4 × 4 + 4 + 5 = 25 = 5 × 5'] }],
      respuesta: [F('n = 4')] }),
    ejemplo({ nivel: 2, titulo: 'Seis por n más uno', caso: kAfirma(SEIS(1).t, 'primero'),
      enunciado: 'Se afirma: «6 × n + 1 es primo para todo n desde 1». ¿Cuál es el primer n que no cumple?',
      datos: [D_PRIMO, D_CONTRA],
      solucion: [{ texto: 'Con n = 1, 2 y 3 salen 7, 13 y 19: primos.' },
        { texto: 'Con n = 4 sale 25, que no es primo.', ecuacion: ['6 × 4 + 1 = 25 = 5 × 5'] }],
      respuesta: [F('n = 4')] }),
    ejemplo({ nivel: 2, titulo: 'Tres casos y un argumento', caso: 'n+n|par',
      enunciado: 'Un alumno ve que 1 + 1, 2 + 2 y 3 + 3 dan números pares y dice: «la suma de un número consigo mismo es par». ¿Lo prueban esos tres casos?',
      datos: ['Un número par es 2 × (un número entero).'],
      solucion: [{ texto: 'Tres casos no prueban nada: solo dan una hipótesis.' },
        { texto: 'Lo que la prueba es un argumento que vale para todo n.', ecuacion: ['n + n = 2 × n'] }],
      respuesta: [F('No; la prueba el argumento n + n = 2 × n')] }),
    ejemplo({ nivel: 2, titulo: 'Dos finales para 2, 4, 8', caso: 'reglas|2,4,8|dos',
      enunciado: 'La lista 2, 4, 8 puede seguir con 16 o con 14. ¿Qué regla da cada uno?',
      datos: [D_REGLA],
      solucion: [{ texto: 'Si cada número es el doble del anterior, sigue 16.', ecuacion: ['8 × 2 = 16'] },
        { texto: 'Si lo que se suma crece de 2 en 2 (2, 4, 6), sigue 14.', ecuacion: ['8 + 6 = 14'] }],
      respuesta: [F('16: el doble; 14: sumar 2, 4, 6')] }),
    ejemplo({ nivel: 2, titulo: 'Un primo que no sirve', caso: 'mersenne|cual',
      enunciado: 'Se afirma: «si n es primo, 2ⁿ − 1 también es primo». Se revisa con n = 2, 3, 5, 7 y 11. ¿Cuál es un contraejemplo?',
      datos: [D_PRIMO, '2ⁿ: el 2 multiplicado n veces. Por ejemplo, 2⁵ = 32.', '2¹¹ = 2048.'],
      solucion: [{ texto: 'Con 2, 3, 5 y 7 salen 3, 7, 31 y 127: todos primos.' },
        { texto: 'Con n = 11 sale 2047, que no es primo.', ecuacion: ['2048 − 1 = 2047 = 23 × 89'] }],
      respuesta: [F('n = 11')] }),
    // Nivel 3 (tipo examen), con alternativas por su valor. Letras: B, C, D, E, A.
    ejemplo({ nivel: 3, titulo: 'El polinomio de Euler', caso: kAfirma(POLI(41).t, 'primero'),
      enunciado: 'Se afirma: «n × n + n + 41 es primo para todo n desde 0». Se revisa con n = 0, 1, 2, 3… ¿Cuál es el primer n que no cumple?',
      datos: [D_PRIMO, D_CONTRA, 'Desde n = 0 hasta n = 39 la cuenta da números primos.'],
      alternativas: ['n = 39', 'n = 40', 'n = 41', 'n = 1', 'Ninguno: siempre da primo'], correcta: 'n = 40',
      solucion: [{ texto: 'Hasta n = 39 todo sale primo. Con n = 40:', ecuacion: ['40 × 40 + 40 + 41 = 1681 = 41 × 41'] }],
      explica: 'n = 39 da 1601, primo; n = 41 tampoco cumple, pero ya falló n = 40; n = 1 da 43, primo; «Ninguno: siempre da primo» toma 40 casos como prueba.',
      respuesta: [F('n = 40')] }),
    ejemplo({ nivel: 3, titulo: 'El quinto de 1, 3, 7', caso: kReglas(1, 3, 7, 'doble'),
      enunciado: 'La lista 1, 3, 7 sigue esta regla: cada número es el doble del anterior, más 1. ¿Cuál es el quinto número?',
      datos: [D_REGLA],
      alternativas: ['15', '21', '31', '63', '30'], correcta: '31',
      solucion: [{ texto: 'El cuarto es 7 × 2 + 1 = 15, y el quinto sale del cuarto.', ecuacion: ['15 × 2 + 1 = ', F('31')] }],
      explica: '15 es el cuarto; 21 sale con otra regla que encaja (sumar 2, 4, 6, 8); 63 es el sexto; 30 olvida el «más 1».',
      respuesta: [F('31')] }),
    ejemplo({ nivel: 3, titulo: 'Cinco casos que cumplen', caso: kAfirma('n×n−n+11', 'que'),
      enunciado: 'La afirmación «n × n − n + 11 es primo» se revisó con n = 1, 2, 3, 4 y 5: salen 11, 13, 17, 23 y 31. Con solo esos cinco casos, ¿qué se puede afirmar?',
      datos: [D_PRIMO, D_CONTRA],
      alternativas: ['Ya está probada', 'Es falsa', 'Solo vale de n = 1 a n = 5', 'Es una hipótesis sin probar', 'Solo vale para los n impares'], correcta: 'Es una hipótesis sin probar',
      solucion: [{ texto: 'Cinco casos que cumplen no prueban que todos cumplan, ni que alguno falle: falta un argumento o un contraejemplo.' },
        { texto: 'Seguir revisando la descarta recién en n = 11: sale 121 = 11 × 11. Con los cinco casos solos, eso no se sabía.' }],
      explica: ['«Ya está probada» toma cinco casos como prueba; «Es falsa» no se sabe con esos cinco: ninguno la contradice.', '«Solo vale de n = 1 a n = 5» olvida que n = 6 da 41, primo; «Solo vale para los n impares» olvida que 2 y 4 cumplen.'],
      respuesta: [F('Es una hipótesis sin probar')] }),
    ejemplo({ nivel: 3, titulo: 'La suma de dos primos', caso: 'dos-primos|par',
      enunciado: 'Se afirma: «la suma de dos números primos es par». ¿Cuál de estas sumas es un contraejemplo?',
      datos: [D_PRIMO, D_CONTRA],
      alternativas: ['3 + 5', '5 + 7', '11 + 13', '7 + 7', '2 + 3'], correcta: '2 + 3',
      solucion: [{ texto: '2 y 3 son primos y suman 5, que es impar: no cumple.', ecuacion: ['2 + 3 = 5'] }],
      explica: '3 + 5 = 8, 5 + 7 = 12, 11 + 13 = 24 y 7 + 7 = 14 son pares: cumplen. Para que la suma sea impar, un primo tiene que ser par: el 2.',
      respuesta: [F('2 + 3')] }),
    ejemplo({ nivel: 3, titulo: 'Seis por n menos uno', caso: kAfirma(SEIS(-1).t, 'cual'),
      enunciado: 'Se afirma: «6 × n − 1 es primo para todo n desde 1». ¿Cuál de estos casos es un contraejemplo?',
      datos: [D_PRIMO, D_CONTRA],
      alternativas: ['n = 6', 'n = 5', 'n = 7', 'n = 4', 'n = 8'], correcta: 'n = 6',
      solucion: [{ texto: 'Con n = 6 sale 35, que no es primo.', ecuacion: ['6 × 6 − 1 = 35 = 5 × 7'] }],
      explica: 'n = 5 da 29, n = 7 da 41, n = 4 da 23 y n = 8 da 47: todos primos, cumplen.',
      respuesta: [F('n = 6')] }),
  ];
  tres.ejemplos = EJEMPLOS_TRES;
  juntar('tres-casos-no-prueban', EJEMPLOS_TRES, []);

  // ---------- Idea 3: cada caso con su lugar ----------
  // Objeto: chapitas (tapas de gaseosa) sobre la mesa, en rectángulos (rm-patrones, escena «chapitas»). Cambia: el
  // número de la figura. · Permanece: filas iguales. · Progresa: lo que agrega cada paso (4, 6, 8…), que crece. · Se
  // reserva: la figura 10 (Predice). · Debe verse: cada figura es filas por columnas, con su número de lugar.
  const RECT = {
    rect1: { f: n => n * (n + 1), filas: n => n, cols: n => n + 1, cuenta: n => `${f0(n)} × ${f0(n + 1)}`, gen: 'n × (n + 1)' },
    rect2: { f: n => n * (n + 2), filas: n => n, cols: n => n + 2, cuenta: n => `${f0(n)} × ${f0(n + 2)}`, gen: 'n × (n + 2)' },
    cuad1: { f: n => (n + 1) * (n + 1), filas: n => n + 1, cols: n => n + 1, cuenta: n => `${f0(n + 1)} × ${f0(n + 1)}`, gen: '(n + 1) × (n + 1)' },
    rect3: { f: n => (n + 1) * (n + 2), filas: n => n + 1, cols: n => n + 2, cuenta: n => `${f0(n + 1)} × ${f0(n + 2)}`, gen: '(n + 1) × (n + 2)' },
  };
  const tri = n => n * (n + 1) / 2;
  const CHAP = ['chapita', 'chapitas'], MON = ['moneda', 'monedas'];
  // Las chapitas nuevas de la figura n (las que no estaban en la n − 1, puesta en la misma esquina): turquesa.
  const nuevas = (R, n) => { const m = []; if (n < 2) return m; const fa = R.filas(n - 1), ca = R.cols(n - 1);
    for (let i = 0; i < R.filas(n); i++) for (let j = 0; j < R.cols(n); j++) if (i >= fa || j >= ca) m.push([i, j, 'agrega']); return m; };
  const figRect = (forma, ks, o = {}) => { const R = RECT[forma];
    return { pieza: PZ, datos: Object.assign({ escena: 'chapitas', figuras: ks.map(k => Object.assign({ titulo: `Figura ${k}`, filas: Array(R.filas(k)).fill(R.cols(k)) }, o.marcas ? { marcas: nuevas(R, k) } : {})) },
      o.nota ? { nota: o.nota } : {}, o.notas ? { notas: o.notas } : {}), estado: {} }; };
  const figTri = (ks, o = {}) => ({ pieza: PZ, datos: Object.assign({ escena: 'chapitas', tocan: true, figuras: ks.map(k => ({ titulo: o.porLado ? `${k} por lado` : `Figura ${k}`, filas: rango(1, k), centrar: true })) }, o.nota ? { nota: o.nota } : {}), estado: {} });
  const D_LUGAR = 'Cada figura se arma con la misma regla; su número de lugar es n.';
  const D_TRI = '1 + 2 + 3 + … + n = n × (n + 1) ÷ 2';
  const K_J3 = 5, K_P3 = 10, R_P3 = RECT.rect1.f(K_P3);
  if (RECT.rect1.f(K_J3) !== 30 || R_P3 !== 110) throw new Error('idea 3: juego o predicción');
  const kRect = (forma, k) => `rect|${forma}|${k}`, kRinv = (forma, k) => `rinv|${forma}|${k}`, kTri = (tipo, k) => `tri|${tipo}|${k}`;
  // Errores de una figura que crece cada vez más: sumar siempre lo del primer paso, el lugar por sí mismo, el doble de la
  // mitad y la figura siguiente. Cada uno con el valor que da de verdad.
  function distRect(f, k, txt = CHAP) {
    const lin = f(1) + (f(2) - f(1)) * (k - 1);
    return [
      { id: 'lineal', valor: lin, error: 'RMP86', siFuera: `Sumaste siempre ${f0(f(2) - f(1))}, lo del primer paso; pero lo que se agrega crece en cada figura.` },
      { id: 'cuadrado', valor: k * k, error: 'RMP166', siFuera: `${f0(k)} × ${f0(k)} usa el lugar dos veces; mira bien filas y columnas en la figura.` },
      k % 2 === 0 ? { id: 'doble', valor: 2 * f(k / 2), error: 'RM2', siFuera: `Dos figuras ${f0(k / 2)} juntas no forman la figura ${f0(k)}: no crece en proporción.` } : null,
      { id: 'sig', valor: f(k + 1), error: 'RMP161', siFuera: `Esa es la figura ${f0(k + 1)}: corriste el lugar en uno.` },
    ].filter(Boolean).filter(d => d.valor !== f(k));
  }
  const cada = {
    id: 'cada-caso-con-su-lugar',
    titulo: 'Cada caso con su lugar',
    pregunta: '¿Qué haces si cada figura agrega más que la anterior?',
    temas: ['Inducción con figuras', 'Inducción numérica'],
    pieza: PZ,
    aprendizaje: 'Si lo que agrega cada paso cambia, no se suma siempre lo mismo: cada caso se escribe como una cuenta con su lugar.',
    actividad: 'Armar rectángulos de chapitas y escribir cada uno como filas por columnas.',
    lee: {
      tarjetas: [
        { titulo: 'Chapitas sobre la mesa', texto: 'Con tapas de gaseosa se arman figuras en filas iguales. La figura 1 tiene 2 chapitas; la 2, 6; la 3, 12. Te preguntan por una figura lejana.',
          pieza: PZ, dibujo: figRect('rect1', [1, 2, 3]) },
        { titulo: 'Cuando el paso cambia', texto: 'Si cada paso agrega siempre lo mismo, se dice que hay crecimiento lineal, como los fósforos de la idea 1. Aquí, de la figura 1 a la 2 se agregan 4 y de la 2 a la 3, 6.' },
        { titulo: 'Monedas en triángulo', texto: 'Si las monedas se ponen en triángulo (1 arriba, 2 debajo, 3 debajo…), salen 1, 3, 6, 10…: son los números triangulares.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cuenta las filas y las columnas de cada figura. Compara esos dos números con el número de la figura.' },
      ],
    },
    juega: {
      pieza: PZ,
      consigna: 'Las chapitas se ordenan en filas iguales. Cambia el número de la figura y mira cuántas filas y columnas tiene.',
      mision: {
        texto: `Arma la figura que tiene ${f0(RECT.rect1.f(K_J3))} chapitas.`,
        logrado: v => RECT.rect1.f(v.n) === RECT.rect1.f(K_J3),
        bien: [`La figura ${f0(K_J3)}: ${f0(K_J3)} filas de ${f0(K_J3 + 1)} chapitas.`],
      },
      voz: 'Cuenta filas y columnas. ¿Qué tienen que ver con el número de la figura?',
      leyenda: [{ s: I('chapita turquesa'), t: 'las que agregó el último paso' }],
      controles: [{ id: 'n', etiqueta: 'Figura', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: { escena: 'chapitas', altoFilas: 6, radio: 11, figuras: [{ filas: Array(val.n).fill(val.n + 1), marcas: val.n > 1 ? nuevas(RECT.rect1, val.n) : [] }] }, estado: {} }),
      lectura: val => [`Figura ${f0(val.n)}: ${f0(val.n)} ${val.n === 1 ? 'fila' : 'filas'} de ${f0(val.n + 1)} chapitas, ${f0(RECT.rect1.f(val.n))} en total`],
      minimo: 3,
    },
    predice: {
      pregunta: `Con la misma regla, ¿cuántas chapitas tiene la figura ${f0(K_P3)}?`,
      datos: ['Las figuras 1, 2, 3 y 4 tienen 2, 6, 12 y 20 chapitas.'],
      voz: 'Lo que se agrega no es siempre lo mismo.',
      opciones: [
        { id: 'c', texto: pl(R_P3, CHAP), correcta: true },
        { id: 'lineal', texto: pl(2 + 4 * (K_P3 - 1), CHAP), error: 'RMP86', siFuera: 'Sumaste siempre 4, lo del primer paso; pero después se agregan 6, 8…' },
        { id: 'cuadrado', texto: pl(K_P3 * K_P3, CHAP), error: 'RMP166', siFuera: 'Bien que las filas son 10; las columnas son una más: 11.' },
        { id: 'doble', texto: pl(2 * RECT.rect1.f(5), CHAP), error: 'RM2', siFuera: 'La figura 5 tiene 30, pero la 10 no es dos figuras 5: no crece en proporción.' },
      ],
      dibujo: figRect('rect1', [1, 2, 3, 4]),
      revelar: { pieza: PZ, datos: { escena: 'chapitas', figuras: [{ titulo: 'Figura 10', filas: Array(10).fill(11) }], nota: [{ t: `10 filas de 11 chapitas: ${f0(R_P3)}`, papel: 'seguro' }] }, estado: {} },
      coincide: `Coincide: la figura 10 tiene 10 filas de 11 chapitas.`,
      noCoincide: 'Revisemos: escribe cada figura como filas por columnas.',
    },
    mira: {
      pieza: PZ,
      datos: Object.assign(figRect('rect1', [1, 2, 3, 4], { marcas: true }).datos, { notas: 2, nota: [{ t: 'Agrega 4, 6, 8: no siempre lo mismo', desde: 0 }, { t: '1 × 2, 2 × 3, 3 × 4, 4 × 5', papel: 'dato', desde: 1 }] }),
      voz: 'Cada figura con su número de lugar.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Lo que agrega cada paso cambia: 4, después 6, después 8.', ecuacion: ['2, 6, 12, 20'] },
        { estado: { corte: 1 }, texto: 'Cada figura es un rectángulo: filas por columnas.', ecuacion: [O('1 × 2'), ', ', O('2 × 3'), ', ', O('3 × 4'), ', ', O('4 × 5')] },
        { estado: { corte: 1 }, texto: 'Las filas son el número de la figura; las columnas, uno más.', ecuacion: [N, ' × (', N, ' + 1)'] },
        { estado: { corte: 1 }, texto: 'La figura 10 tiene 10 filas de 11.', ecuacion: ['10 × 11 = ', F('110')] },
      ],
    },
    regla: {
      texto: 'Si lo que agrega cada paso cambia, no sumes siempre lo mismo. Escribe cada caso como una cuenta con su número de lugar y cambia ese número por n.',
      ecuacion: [{ llave: ['1 × 2, 2 × 3, 3 × 4'], nota: 'cada caso', color: 'c-o' }, '   ·   ', { llave: [N, ' × (', N, ' + 1)'], nota: 'la figura n', color: 'c-i' }],
      condicion: 'la cuenta sale de las filas y columnas de la figura. Un caso más solo la comprueba: si falla, se descarta.',
      voz: 'Primero escribe los casos; después, la regla.',
    },
    ejemplos: null,
    // Así se resuelve (semilla % 2): 0 la figura k de (n + 1) × (n + 1) o (n + 1) × (n + 2) · 1 qué figura tiene T con
    // n × (n + 2). «Ahora tú» usa n × (n + 1), n × (n + 2) en directo y los números triangulares.
    resuelve: {
      pieza: PZ,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const forma = r.elegir(['cuad1', 'rect3']), R = RECT[forma];
          let k; do { k = r.ent(8, 25); } while (usado('cada-caso-con-su-lugar', kRect(forma, k)));
          const v = [1, 2, 3].map(R.f);
          return {
            enunciado: `Con chapitas en filas iguales, las figuras 1, 2 y 3 tienen ${lista(v.map(f0))} chapitas. ¿Cuántas tiene la figura ${f0(k)}?`,
            datos: [D_LUGAR], dibujo: figRect(forma, [1, 2, 3]),
            pasos: [
              { tipo: 'pide', texto: `Piden las chapitas de la figura ${f0(k)}.` },
              { tipo: 'datos', texto: `Lo que agrega cada paso cambia: ${f0(v[1] - v[0])} y después ${f0(v[2] - v[1])}. No es crecimiento lineal.` },
              { tipo: 'regla', texto: 'Escribo cada caso como filas por columnas, con su número de lugar.', ecuacion: [[1, 2, 3].map(R.cuenta).join(', ')] },
              { tipo: 'cuentas', texto: `La figura n es ${R.gen}. Con n = ${f0(k)}:`, ecuacion: [`${R.cuenta(k)} = `, F(f0(R.f(k)))] },
              { tipo: 'sentido', texto: `Compruebo con la figura 4: ${R.cuenta(4)} = ${f0(R.f(4))}, la figura 3 con ${f0(R.f(4) - v[2])} chapitas más (su fila y su columna nuevas).` },
            ],
            respuesta: [F(pl(R.f(k), CHAP))],
          };
        }
        const R = RECT.rect2;
        let k; do { k = r.ent(7, 20); } while (usado('cada-caso-con-su-lugar', kRinv('rect2', k)));
        const t = R.f(k);
        return {
          enunciado: `Con chapitas en filas iguales, las figuras 1, 2 y 3 tienen 3, 8 y 15 chapitas. ¿Qué figura tiene ${f0(t)} chapitas?`,
          datos: [D_LUGAR], dibujo: figRect('rect2', [1, 2, 3]),
          pasos: [
            { tipo: 'pide', texto: `Piden el número de la figura que tiene ${f0(t)} chapitas.` },
            { tipo: 'datos', texto: 'Las figuras son 1 × 3, 2 × 4 y 3 × 5: filas por columnas.' },
            { tipo: 'regla', texto: 'Las filas son el número de la figura y las columnas, dos más: la figura n es n × (n + 2).' },
            { tipo: 'cuentas', texto: `Busco dos números que se diferencien en 2 y den ${f0(t)}.`, ecuacion: [`${f0(k)} × ${f0(k + 2)} = ${f0(t)}`] },
            { tipo: 'sentido', texto: `La figura ${f0(k + 1)} ya tendría ${f0(R.f(k + 1))}: se pasa.` },
          ],
          respuesta: [F(`La figura ${f0(k)}`)],
        };
      },
    },
    // Ahora tú (semilla % 3): 0 la figura k (n × (n + 1) o n × (n + 2)) · 1 qué figura tiene T (n × (n + 1)) · 2 monedas en
    // triángulo, con 1 + 2 + … + n en los datos.
    ahoraTu: {
      pieza: PZ,
      voz: 'Escribe las figuras 1, 2 y 3 como filas por columnas.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const forma = r.elegir(['rect1', 'rect2']), R = RECT[forma];
          let k; do { k = r.ent(8, 30); } while ((forma === 'rect1' && (k === K_P3 || k === K_J3)) || usado('cada-caso-con-su-lugar', kRect(forma, k)));
          const v = [1, 2, 3].map(R.f);
          return { pregunta: `Con chapitas en filas iguales, las figuras 1, 2 y 3 tienen ${lista(v.map(f0))} chapitas. ¿Cuántas tiene la figura ${f0(k)}?`,
            datos: [D_LUGAR], dibujo: figRect(forma, [1, 2, 3]), opciones: opcionesNum(R.f(k), CHAP, distRect(R.f, k)),
            solucion: { texto: `Cada figura es ${R.gen}: ${[1, 2, 3].map(R.cuenta).join(', ')}.`, ecuacion: [`${R.cuenta(k)} = `, F(f0(R.f(k)))] } };
        }
        if (tipo === 1) {
          const R = RECT.rect1;
          let k; do { k = r.ent(8, 25); } while (k === K_P3 || k === K_J3 || usado('cada-caso-con-su-lugar', kRinv('rect1', k)));
          const t = R.f(k), lin = (t - 2) / 4 + 1;
          return { pregunta: `Con chapitas en filas iguales, las figuras 1, 2 y 3 tienen 2, 6 y 12 chapitas. ¿Qué figura tiene ${f0(t)} chapitas?`,
            datos: [D_LUGAR], dibujo: figRect('rect1', [1, 2, 3]),
            opciones: opcionesNum(k, null, [
              { id: 'mas', valor: k + 1, error: 'RMP161', siFuera: `La figura ${f0(k + 1)} tiene ${f0(R.f(k + 1))}: se pasa.` },
              { id: 'menos', valor: k - 1, error: 'RMP161', siFuera: `La figura ${f0(k - 1)} tiene ${f0(R.f(k - 1))}: le faltan.` },
              Number.isInteger(lin) ? { id: 'lineal', valor: lin, error: 'RMP86', siFuera: 'Contaste como si cada paso agregara 4; lo que se agrega crece.' } : null,
              { id: 'mitad', valor: t / 2, error: 'RMP166', siFuera: `${f0(t / 2)} es la mitad de ${f0(t)}; busca dos números seguidos que den ${f0(t)}.` },
            ]),
            solucion: { texto: `La figura n es n × (n + 1); busco dos números seguidos que den ${f0(t)}.`, ecuacion: [`${f0(k)} × ${f0(k + 1)} = ${f0(t)}`] } };
        }
        let k; do { k = r.ent(8, 30); } while (usado('cada-caso-con-su-lugar', kTri('directo', k)));
        return { pregunta: `Se ponen monedas en triángulo: la figura 1 tiene 1; la 2, 3 (1 + 2); la 3, 6 (1 + 2 + 3). ¿Cuántas monedas tiene la figura ${f0(k)}?`,
          datos: [D_TRI, D_LUGAR], dibujo: figTri([1, 2, 3, 4]),
          opciones: opcionesNum(tri(k), MON, [
            { id: 'cuadrado', valor: k * k, error: 'RMP166', siFuera: `${f0(k)} × ${f0(k)} sería un cuadrado de monedas; el triángulo es la mitad de un rectángulo.` },
            { id: 'sin2', valor: k * (k + 1), error: 'RMP167', siFuera: `Bien la cuenta ${f0(k)} × ${f0(k + 1)}, pero falta dividir entre 2.` },
            { id: 'lineal', valor: 1 + 2 * (k - 1), error: 'RMP86', siFuera: 'Sumaste siempre 2, lo del primer paso; cada fila nueva trae una moneda más.' },
            { id: 'sig', valor: tri(k + 1), error: 'RMP161', siFuera: `Esa es la figura ${f0(k + 1)}: corriste el lugar en uno.` },
          ]),
          solucion: { texto: `La figura ${f0(k)} tiene filas de 1 hasta ${f0(k)} monedas.`, ecuacion: [`${f0(k)} × ${f0(k + 1)} ÷ 2 = `, F(f0(tri(k)))] } };
      },
    },
  };

  // ---------- Ejemplos resueltos de «Cada caso con su lugar» ----------
  // Comprobados al cargar (RECT, tri) y aparte en scratchpad e8-rm/verificar.py, que arma cada figura chapita por chapita:
  // 1 → 42 · 2 → 80 · 3 → 10 · 4 → 64 · 5 → no: 4, después 6 · 6 → figura 8 · 7 → 56 · 8 → 55 · 9 → n × (n + 2) · 10 →
  // 91 cuadrados (cuadrícula de 6 × 6) · 11 → 420 (C) · 12 → 135 (D) · 13 → 20 (E) · 14 → 33 (A) · 15 → 225 (B).
  function ejRect(nivel, titulo, forma, k, extra = {}) {
    const R = RECT[forma], v = [1, 2, 3].map(R.f);
    return ejemplo(Object.assign({ nivel, titulo, caso: kRect(forma, k),
      enunciado: `Con chapitas en filas iguales, las figuras 1, 2 y 3 tienen ${lista(v.map(f0))} chapitas. ¿Cuántas tiene la figura ${f0(k)}?`,
      datos: [D_LUGAR], figura: figRect(forma, [1, 2, 3]),
      solucion: [{ texto: `Cada figura es filas por columnas: ${[1, 2, 3].map(R.cuenta).join(', ')}. La figura n es ${R.gen}.` },
        { texto: `Con n = ${f0(k)}:`, ecuacion: [`${R.cuenta(k)} = `, F(f0(R.f(k)))] }],
      respuesta: [F(pl(R.f(k), CHAP))] }, extra));
  }
  const tang = n => 3 * tri(n - 1);
  // Cuadrados de todos los tamaños en una cuadrícula de n × n, contados bloque por bloque (cada esquina y cada lado).
  const CUAD_TODOS = n => { let c = 0; for (let k = 1; k <= n; k++) for (let x = 0; x + k <= n; x++) for (let y = 0; y + k <= n; y++) c++; return c; };
  if (CUAD_TODOS(1) !== 1 || CUAD_TODOS(2) !== 5 || CUAD_TODOS(6) !== 91 || CUAD_TODOS(6) !== 36 + 25 + 16 + 9 + 4 + 1) throw new Error('ejemplo de la cuadrícula');
  // Cuadrículas de fósforos de 1 × 1, 2 × 2…, una junto a otra (el planteamiento: sin contar nada).
  const palitosCuad = n => { const ps = []; for (let i = 0; i <= n; i++) for (let j = 0; j < n; j++) ps.push([j, i, j + 1, i], [i, j, i, j + 1]); return ps; };
  const figCuad = ns => ({ pieza: PZ, datos: { escena: 'fosforos', alto: Math.max(...ns), unidad: 30, figuras: ns.map(n => ({ titulo: `${n} × ${n}`, palitos: palitosCuad(n) })) }, estado: {} });
  if (RECT.rect1.f(20) !== 420 || tang(10) !== 135 || tri(20) !== 210 || RECT.rect2.f(16) - RECT.rect2.f(15) !== 33 || RECT.cuad1.f(14) !== 225
    || RECT.rect1.f(8) !== 72 || RECT.rect2.f(9) !== 99 || RECT.rect3.f(6) !== 56 || tri(10) !== 55) throw new Error('ejemplos de la idea 3');
  const EJEMPLOS_CADA = [
    ejRect(1, 'Seis filas de siete', 'rect1', 6),
    ejRect(1, 'Columnas dos más que filas', 'rect2', 8),
    ejemplo({ nivel: 1, titulo: 'Lo que agrega la figura 5', caso: 'agrega|rect1|5',
      enunciado: 'Con chapitas en filas iguales, las figuras 1, 2 y 3 tienen 2, 6 y 12 chapitas. ¿Cuántas chapitas se agregan para pasar de la figura 4 a la 5?',
      datos: [D_LUGAR], figura: figRect('rect1', [1, 2, 3]),
      solucion: [{ texto: 'Las figuras son 1 × 2, 2 × 3 y 3 × 4: filas por columnas. La 4 es 4 × 5 = 20 y la 5, 5 × 6 = 30.', ecuacion: ['30 − 20 = ', F('10')] }],
      respuesta: [F('10 chapitas')] }),
    ejRect(1, 'Cuadrados de chapitas', 'cuad1', 7),
    ejemplo({ nivel: 1, titulo: '¿Agrega siempre lo mismo?', caso: 'lineal|rect1',
      enunciado: 'Las figuras 1, 2 y 3 de chapitas tienen 2, 6 y 12. ¿Crecen agregando siempre lo mismo?',
      datos: ['Crecimiento lineal: cada paso agrega lo mismo.'], figura: figRect('rect1', [1, 2, 3]),
      solucion: [{ texto: 'De la 1 a la 2 se agregan 4; de la 2 a la 3, 6. No es lo mismo.', ecuacion: ['6 − 2 = 4', '   ·   ', '12 − 6 = 6'] }],
      respuesta: [F('No: agrega 4 y después 6')] }),
    ejemplo({ nivel: 2, titulo: 'La figura de 72 chapitas', caso: kRinv('rect1', 8),
      enunciado: 'Con chapitas en filas iguales, las figuras 1, 2 y 3 tienen 2, 6 y 12 chapitas. ¿Qué figura tiene 72 chapitas?',
      datos: [D_LUGAR], figura: figRect('rect1', [1, 2, 3]),
      solucion: [{ texto: 'Las figuras son 1 × 2, 2 × 3 y 3 × 4: la figura n es n × (n + 1).' },
        { texto: 'Busco dos números seguidos que den 72.', ecuacion: ['8 × 9 = 72'] }],
      respuesta: [F('La figura 8')] }),
    ejRect(2, 'Dos más en cada lado', 'rect3', 6),
    ejemplo({ nivel: 2, titulo: 'Monedas en triángulo', caso: kTri('directo', 10),
      enunciado: 'Se ponen monedas en triángulo: la figura 1 tiene 1; la 2, 3 (1 + 2); la 3, 6 (1 + 2 + 3). ¿Cuántas monedas tiene la figura 10?',
      datos: [D_TRI, D_LUGAR], figura: figTri([1, 2, 3, 4]),
      solucion: [{ texto: 'La figura 10 tiene filas de 1 hasta 10 monedas.', ecuacion: ['1 + 2 + … + 10'] },
        { texto: 'Con la suma de los datos:', ecuacion: ['10 × 11 ÷ 2 = ', F('55')] }],
      respuesta: [F('55 monedas')] }),
    ejemplo({ nivel: 2, titulo: 'La regla de 3, 8, 15', caso: 'regla|rect2',
      enunciado: 'Las figuras 1, 2, 3 y 4 de chapitas tienen 3, 8, 15 y 24. ¿Cuál es la cuenta de la figura n?',
      datos: [D_LUGAR], figura: figRect('rect2', [1, 2, 3, 4]),
      solucion: [{ texto: 'Escribo cada caso como filas por columnas, con su lugar.', ecuacion: ['1 × 3, 2 × 4, 3 × 5, 4 × 6'] },
        { texto: 'Las filas son el lugar; las columnas, dos más.', ecuacion: [F('n × (n + 2)')] }],
      respuesta: [F('n × (n + 2)')] }),
    // Apertura (los cuadrados del tablero; aperturas-para-la-teoria, 28 nov): cuadrados de todos los tamaños en una
    // cuadrícula de n × n, por casos chicos y con el porqué. No da el 3 × 3 de la pregunta de la apertura ni el 204, y
    // evita el 4 × 4 (30) porque 30 es la misión de esta idea. CUAD_TODOS cuenta bloque por bloque, arriba se comprueba.
    ejemplo({ nivel: 2, titulo: 'Cuadrados de todos los tamaños', caso: 'cuadricula|6',
      enunciado: 'Con fósforos se arman cuadrículas de n × n, como las casillas de un tablero. Contando los cuadrados de todos los tamaños, la de 1 × 1 tiene 1 y la de 2 × 2 tiene 5. ¿Cuántos tiene la de 6 × 6?',
      datos: ['Un cuadrado de la cuadrícula es una casilla o un bloque de k × k casillas.'], figura: figCuad([1, 2, 3]),
      solucion: [{ texto: ['En la de 2 × 2, los 5 son ', O('4 casillas'), ' y ', I('1 bloque de 2 × 2'), ': cada tamaño se cuenta aparte, y los bloques grandes se montan sobre las casillas.'],
        ecuacion: ['5 = ', O('2 × 2'), ' + ', I('1 × 1')] },
        { texto: 'El porqué: en una cuadrícula de n × n, un bloque de k × k cabe en n − k + 1 lugares a lo ancho y en otros tantos a lo alto.' },
        { texto: 'En la de 6 × 6 caben 6 × 6 casillas, 5 × 5 bloques de 2 × 2, y así hasta 1 bloque de 6 × 6:',
          ecuacion: ['36 + 25 + 16 + 9 + 4 + 1 = ', F(f0(CUAD_TODOS(6)))] }],
      respuesta: [F(`${f0(CUAD_TODOS(6))} cuadrados`)] }),
    // Nivel 3 (tipo examen), con alternativas por su valor. Letras: C, D, E, A, B.
    ejRect(3, 'La figura 20', 'rect1', 20, { alternativas: ['400 chapitas', '78 chapitas', '420 chapitas', '462 chapitas', '220 chapitas'], correcta: '420 chapitas',
      explica: '400 es 20 × 20, sin la columna de más; 78 suma siempre 4; 462 es la figura 21; 220 junta dos figuras 10.' }),
    ejemplo({ nivel: 3, titulo: 'Monedas que se tocan', caso: kTri('tangencias', 10),
      enunciado: 'Se ponen monedas iguales en triángulo, cada una tocando a sus vecinas. Con 2 monedas por lado hay 3 puntos de contacto; con 3, 9; con 4, 18. ¿Cuántos hay con 10 por lado?',
      datos: [D_TRI, 'Un punto de contacto: donde se tocan dos monedas.'], figura: figTri([2, 3, 4], { porLado: true }),
      alternativas: ['165', '45', '150', '135', '51'], correcta: '135',
      solucion: [{ texto: 'Escribo cada caso con su lugar: 3 = 3 × 1, 9 = 3 × 3, 18 = 3 × 6. Los 1, 3, 6 son 1, 1 + 2, 1 + 2 + 3.' },
        { texto: 'Con 10 por lado se suma hasta 9:', ecuacion: ['3 × (9 × 10 ÷ 2) = 3 × 45 = ', F('135')] }],
      explica: '165 es el de 11 por lado; 45 olvida multiplicar por 3; 150 usa 10 × 10 ÷ 2 y no 9 × 10 ÷ 2; 51 suma siempre 6, lo del primer paso.',
      respuesta: [F('135 puntos de contacto')] }),
    ejemplo({ nivel: 3, titulo: 'El triángulo de 210 monedas', caso: kTri('inverso', 20),
      enunciado: 'Se ponen monedas en triángulo: la figura 1 tiene 1; la 2, 3; la 3, 6. ¿Qué figura tiene 210 monedas?',
      datos: [D_TRI, D_LUGAR], figura: figTri([1, 2, 3]),
      alternativas: ['21', '105', '19', '15', '20'], correcta: '20',
      solucion: [{ texto: 'La figura n tiene n × (n + 1) ÷ 2 monedas. El doble de 210 es 420.' },
        { texto: 'Busco dos números seguidos que den 420.', ecuacion: ['20 × 21 = 420'] }],
      explica: '21 da 231 y 19 da 190; 105 es 210 entre 2; 15 toma la figura como un cuadrado (15 × 15 = 225).',
      respuesta: [F('La figura 20')] }),
    ejemplo({ nivel: 3, titulo: 'Entre la figura 15 y 16', caso: 'agrega|rect2|16',
      enunciado: 'Con chapitas en filas iguales, las figuras 1, 2 y 3 tienen 3, 8 y 15 chapitas. ¿Cuántas chapitas se agregan para pasar de la figura 15 a la 16?',
      datos: [D_LUGAR], figura: figRect('rect2', [1, 2, 3]),
      alternativas: ['33', '5', '288', '35', '31'], correcta: '33',
      solucion: [{ texto: 'Filas por columnas: 1 × 3, 2 × 4, 3 × 5. La figura n es n × (n + 2): la 15 tiene 15 × 17 = 255; la 16, 16 × 18 = 288.', ecuacion: ['288 − 255 = ', F('33')] }],
      explica: '5 es lo del primer paso, como si fuera lineal; 288 es la figura 16; 35 va de la 16 a la 17; 31, de la 14 a la 15.',
      respuesta: [F('33 chapitas')] }),
    ejRect(3, 'El cuadrado de la figura 14', 'cuad1', 14, { alternativas: ['196 chapitas', '225 chapitas', '69 chapitas', '256 chapitas', '128 chapitas'], correcta: '225 chapitas',
      explica: '196 es 14 × 14, sin la fila de más; 69 suma siempre 5; 256 es la figura 15; 128 junta dos figuras 7.' }),
  ];
  cada.ejemplos = EJEMPLOS_CADA;
  juntar('cada-caso-con-su-lugar', EJEMPLOS_CADA, [kRect('rect1', K_J3), kRect('rect1', K_P3)]);

  // ---------- Idea 4: filas de un triángulo de números ----------
  // Objeto: la pirámide de latas de la bodega, cada lata con su número (rm-patrones, escena «latas»). Cambia: la fila que
  // se elige. · Permanece: los impares en orden, fila 1 arriba. · Progresa: las sumas 1, 8, 27, 64. · Se reserva: la fila
  // 10 (Predice). · Debe verse: cada suma con su número de fila; la fila de prueba no se usa para encontrar la regla.
  const ARR = {
    impares: { fila: i => rango(1, i).map(j => i * (i - 1) + 2 * j - 1), nombre: 'los números impares en orden: 1, 3, 5, 7…' },
    naturales: { fila: i => rango(1, i).map(j => tri(i - 1) + j), nombre: 'los números 1, 2, 3, 4… en orden' },
    pascal: { fila: i => { let f = [1]; for (let k = 1; k < i; k++) f = [1, ...f.slice(1).map((x, j) => x + f[j]), 1]; return f; }, nombre: 'números: cada uno es la suma de los dos que tiene encima' },
  };
  const filaS = (tipo, i) => suma(ARR[tipo].fila(i));
  const LATA = ['lata', 'latas'];
  const piramide = (tipo, nf, o = {}) => ({ pieza: PZ, datos: Object.assign({ escena: 'latas', rotulos: o.rotulos !== false, filas: rango(1, nf).map(i => ARR[tipo].fila(i)) },
    o.resaltar ? { resaltar: o.resaltar } : {}, o.tapar ? { tapar: o.tapar } : {}, o.nota ? { nota: o.nota } : {}, o.notas ? { notas: o.notas } : {}), estado: {} });
  const D_IMP = 'Las latas llevan los números impares en orden: 1, 3, 5, 7…';
  const D_FILA = 'La fila n tiene n latas; la fila 1 es la de arriba.';
  const D_PAS = 'Cada número es la suma de los dos que tiene encima; los de los bordes son 1.';
  const D_CUBO = 'n³ = n × n × n (el número «al cubo»).';
  const K_J4 = 4, K_P4 = 10;
  if (filaS('impares', K_J4) !== 64 || filaS('impares', K_P4) !== 1000) throw new Error('idea 4: juego o predicción');
  for (let i = 1; i <= 30; i++) if (filaS('impares', i) !== i ** 3 || filaS('pascal', i) !== 2 ** (i - 1) || ARR.impares.fila(i)[i - 1] !== i * i + i - 1) throw new Error('idea 4: filas');
  const kArr = (tipo, pide, k) => `arr|${tipo}|${pide}|${k}`;
  const masTxt = xs => xs.map(f0).join(' + ');
  const arreglo = {
    id: 'arreglo-triangular',
    titulo: 'Filas de un triángulo de números',
    pregunta: '¿Cómo se suma una fila lejana sin escribir las anteriores?',
    temas: ['Inducción numérica'],
    pieza: PZ,
    aprendizaje: 'En un arreglo por filas se calculan las filas chicas, se escribe cada resultado con su número de fila y se busca por qué vale.',
    actividad: 'Elegir una fila de la pirámide de latas y sumar sus números.',
    lee: {
      tarjetas: [
        { titulo: 'La pirámide de latas', texto: 'En la bodega las latas se apilan en filas: arriba 1, debajo 2, después 3… Cada lata lleva un número impar, en orden: 1, 3, 5, 7…',
          pieza: PZ, dibujo: piramide('impares', 4) },
        { titulo: 'Un arreglo triangular', texto: 'Números puestos así, en filas que crecen de uno en uno, forman un arreglo triangular. En los exámenes preguntan por una fila lejana: su suma, su primer número o el último.' },
        { titulo: 'Al cubo', texto: 'Un número al cubo es ese número multiplicado tres veces por sí mismo: 2³ = 2 × 2 × 2 = 8. Se escribe con un 3 chiquito arriba.' },
        { titulo: 'Qué mirar al jugar', texto: 'Elige una fila y mira cuánto suman sus latas. Escribe cada suma junto a su número de fila y busca qué tienen que ver.' },
      ],
    },
    juega: {
      pieza: PZ,
      consigna: 'En la pirámide de latas, cada fila sigue con los impares. Elige una fila y mira cuánto suman sus números.',
      mision: {
        texto: `Busca la fila cuyas latas suman ${f0(filaS('impares', K_J4))}.`,
        logrado: v => filaS('impares', v.k) === filaS('impares', K_J4),
        bien: [`La fila ${f0(K_J4)}: ${masTxt(ARR.impares.fila(K_J4))} = ${f0(filaS('impares', K_J4))}.`],
      },
      voz: 'Anota cada suma con su número de fila.',
      leyenda: [{ s: O('lata naranja'), t: 'la fila que elegiste' }, { s: 'Fila 1', t: 'la de arriba; cada fila, una lata más' }],
      controles: [{ id: 'k', etiqueta: 'Fila', min: 1, max: 5, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: piramide('impares', 5, { resaltar: [{ fila: val.k - 1, papel: 'dato' }] }).datos, estado: {} }),
      lectura: val => [`Fila ${f0(val.k)}: ${val.k === 1 ? '1' : `${masTxt(ARR.impares.fila(val.k))} = ${f0(filaS('impares', val.k))}`}`],
      minimo: 3,
    },
    predice: {
      pregunta: `Con la misma pirámide, ¿cuánto suman las latas de la fila ${f0(K_P4)}?`,
      datos: ['Las filas 1, 2 y 3 suman 1, 8 y 27.', `La fila ${f0(K_P4)} tiene ${f0(K_P4)} latas.`],
      voz: 'Escribe cada suma con su número de fila.',
      opciones: [
        { id: 'cien', texto: '100', error: 'RMP168', siFuera: '100 suman los 10 primeros impares, del 1 al 19; la fila 10 no empieza en 1.' },
        { id: 'doble', texto: f0(2 * filaS('impares', 5)), error: 'RM2', siFuera: 'La fila 5 suma 125, pero la fila 10 no es dos filas 5: no crece en proporción.' },
        { id: 'c', texto: '1000', correcta: true },
        { id: 'lineal', texto: '160', error: 'RMP86', siFuera: 'Sumaste 19 en cada fila, lo que creció de la 2 a la 3; pero eso cambia.' },
      ],
      dibujo: piramide('impares', 4),
      revelar: piramide('impares', K_P4, { rotulos: false, resaltar: [{ fila: K_P4 - 1, papel: 'seguro' }], nota: [{ t: 'Fila 10: de 91 a 109, suma 1000', papel: 'seguro' }] }),
      coincide: 'Coincide: la fila 10 suma 10 × 10 × 10 = 1000.',
      noCoincide: 'Revisemos: escribe 1, 8, 27 como un número multiplicado por sí mismo.',
    },
    mira: {
      pieza: PZ,
      datos: Object.assign(piramide('impares', 5).datos, { resaltar: [{ fila: 4, papel: 'agrega', desde: 2 }], notas: 1, nota: [{ t: 'Fila 5: el del medio es 25 = 5 × 5', desde: 3 }] }),
      voz: 'Cada suma con su número de fila; después, una fila de prueba.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Las filas 1 a 4 suman 1, 8, 27 y 64.', ecuacion: ['1, 8, 27, 64'] },
        { estado: { corte: 1 }, texto: 'Cada suma es su número de fila al cubo.', ecuacion: [{ sup: ['1', '3'] }, ', ', { sup: ['2', '3'] }, ', ', { sup: ['3', '3'] }, ', ', { sup: ['4', '3'] }] },
        { estado: { corte: 2 }, texto: 'Se comprueba con la fila 5, que no se usó.', ecuacion: ['21 + 23 + 25 + 27 + 29 = 125', '   ·   ', { sup: ['5', '3'] }, ' = 125'] },
        { estado: { corte: 3 }, texto: 'Por qué: 5 latas que promedian 25, el del medio.', ecuacion: ['5 × 25 = 125'] },
      ],
    },
    regla: {
      texto: 'Para una fila lejana, calcula las filas chicas y escribe cada resultado con su número de fila. La regla vale si ves por qué: n latas que promedian n × n.',
      ecuacion: [{ llave: [N], nota: 'latas', color: 'c-o' }, ' × ', { llave: [N, ' × ', N], nota: 'su promedio', color: 'c-i' }, ' = ', { sup: [N, '3'] }],
      condicion: 'cada fila sigue la misma regla. En una fila par se promedian las dos del medio: (15 + 17) ÷ 2 = 16.',
      voz: 'Cada fila con su número; la de prueba, aparte.',
    },
    ejemplos: null,
    // Así se resuelve (semilla % 2): 0 el último número de la fila k del arreglo de 1, 2, 3… · 1 la suma de una fila lejana
    // (26 a 40) de los impares. «Ahora tú» usa filas 6 a 25 de los impares, sus últimos números y el arreglo de sumas.
    resuelve: {
      pieza: PZ,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          let k; do { k = r.ent(9, 40); } while (usado('arreglo-triangular', kArr('naturales', 'ultimo', k)));
          return {
            enunciado: `En una pirámide de latas, las latas llevan los números 1, 2, 3, 4… en orden, fila por fila. ¿Qué número lleva la última lata de la fila ${f0(k)}?`,
            datos: [D_FILA, D_TRI], dibujo: piramide('naturales', 4),
            pasos: [
              { tipo: 'pide', texto: `Piden el último número de la fila ${f0(k)}.` },
              { tipo: 'datos', texto: 'Los últimos de las filas 1 a 4 son 1, 3, 6 y 10.' },
              { tipo: 'regla', texto: 'Escribo cada caso con su número de fila: el último de la fila n cuenta todas las latas hasta ahí.', ecuacion: ['1, 1 + 2, 1 + 2 + 3, 1 + 2 + 3 + 4'] },
              { tipo: 'cuentas', texto: `Hasta la fila ${f0(k)} hay 1 + 2 + … + ${f0(k)} latas.`, ecuacion: [`${f0(k)} × ${f0(k + 1)} ÷ 2 = `, F(f0(tri(k)))] },
              { tipo: 'sentido', texto: 'Compruebo con la fila 4, que no usé para la regla: 4 × 5 ÷ 2 = 10, como en el dibujo.' },
            ],
            respuesta: [F(f0(tri(k)))],
          };
        }
        let k; do { k = r.ent(26, 40); } while (usado('arreglo-triangular', kArr('impares', 'suma', k)));
        return {
          enunciado: `En la pirámide de latas con los impares en orden, ¿cuánto suman las latas de la fila ${f0(k)}?`,
          datos: [D_IMP, D_FILA, D_CUBO], dibujo: piramide('impares', 4),
          pasos: [
            { tipo: 'pide', texto: `Piden la suma de la fila ${f0(k)}.` },
            { tipo: 'datos', texto: 'Las filas 1, 2 y 3 suman 1, 8 y 27.' },
            { tipo: 'regla', texto: 'Escribo cada suma con su número de fila: 1 × 1 × 1, 2 × 2 × 2, 3 × 3 × 3. La fila n suma n³.' },
            { tipo: 'cuentas', texto: `Con n = ${f0(k)}:`, ecuacion: [`${f0(k)} × ${f0(k)} × ${f0(k)} = `, F(f0(k ** 3))] },
            { tipo: 'sentido', texto: 'Vale siempre: la fila n tiene n latas que promedian n × n. Compruebo con la fila 4: 13 + 15 + 17 + 19 = 64.' },
          ],
          respuesta: [F(f0(k ** 3))],
        };
      },
    },
    // Ahora tú (semilla % 3): 0 la suma de la fila k (impares) · 1 el último número de la fila k (impares) · 2 la suma de
    // la fila k del arreglo donde cada número es la suma de los dos de encima.
    ahoraTu: {
      pieza: PZ,
      voz: 'Calcula las filas chicas y escríbelas con su número.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          let k; do { k = r.ent(6, 25); } while (k === K_P4 || usado('arreglo-triangular', kArr('impares', 'suma', k)));
          return { pregunta: `En la pirámide de latas con los impares en orden, ¿cuánto suman las latas de la fila ${f0(k)}?`,
            datos: [D_IMP, D_FILA, D_CUBO], dibujo: piramide('impares', 4),
            opciones: opcionesNum(k ** 3, null, [
              { id: 'cuad', valor: k * k, error: 'RMP168', siFuera: `${f0(k * k)} suman los ${f0(k)} primeros impares; la fila ${f0(k)} no empieza en 1.` },
              k % 2 === 0 ? { id: 'doble', valor: 2 * (k / 2) ** 3, error: 'RM2', siFuera: `Dos filas ${f0(k / 2)} no forman la fila ${f0(k)}: no crece en proporción.` } : null,
              { id: 'sig', valor: (k + 1) ** 3, error: 'RMP161', siFuera: `Esa es la fila ${f0(k + 1)}: corriste el lugar en uno.` },
              { id: 'lineal', valor: 1 + 7 * (k - 1), error: 'RMP86', siFuera: 'Sumaste 7 por fila, lo del primer paso; lo que crece cambia en cada fila.' },
            ]),
            solucion: { texto: 'Las filas 1, 2 y 3 suman 1, 8 y 27: cada una, su número al cubo.', ecuacion: [`${f0(k)} × ${f0(k)} × ${f0(k)} = `, F(f0(k ** 3))] } };
        }
        if (tipo === 1) {
          let k; do { k = r.ent(6, 30); } while (usado('arreglo-triangular', kArr('impares', 'ultimo', k)));
          const bien = k * k + k - 1;
          return { pregunta: `En la pirámide de latas con los impares en orden, ¿qué número lleva la última lata de la fila ${f0(k)}?`,
            datos: [D_IMP, D_FILA], dibujo: piramide('impares', 4),
            opciones: opcionesNum(bien, null, [
              { id: 'impar', valor: 2 * k - 1, error: 'RMP168', siFuera: `${f0(2 * k - 1)} es el impar número ${f0(k)}; antes de la fila ${f0(k)} ya hay muchas latas.` },
              { id: 'sin1', valor: k * (k + 1), error: 'RMP167', siFuera: `Bien el ${f0(k)} × ${f0(k + 1)}, pero falta restar 1: 5 = 2 × 3 − 1, 11 = 3 × 4 − 1.` },
              { id: 'sig', valor: k * k + k + 1, error: 'RMP161', siFuera: `Esa es la primera lata de la fila ${f0(k + 1)}.` },
            ]),
            solucion: { texto: 'Los últimos son 1, 5, 11, 19: 1 × 2 − 1, 2 × 3 − 1, 3 × 4 − 1, 4 × 5 − 1.', ecuacion: [`${f0(k)} × ${f0(k + 1)} − 1 = `, F(f0(bien))] } };
        }
        let k; do { k = r.ent(8, 14); } while (usado('arreglo-triangular', kArr('pascal', 'suma', k)));
        return { pregunta: `En una pirámide de latas, cada número es la suma de los dos que tiene encima. Las filas 1, 2, 3 y 4 suman 1, 2, 4 y 8. ¿Cuánto suma la fila ${f0(k)}?`,
          datos: [D_PAS, D_FILA], dibujo: piramide('pascal', 4),
          opciones: opcionesNum(2 ** (k - 1), null, [
            { id: 'sig', valor: 2 ** k, error: 'RMP161', siFuera: `Esa es la fila ${f0(k + 1)}: corriste el lugar en uno.` },
            { id: 'lineal', valor: 2 * (k - 1), error: 'RMP86', siFuera: 'Seguiste 2, 4, 6…: sumaste 2 por fila desde la fila 2. Pero cada suma duplica la anterior.' },
            { id: 'cuad', valor: k * k, error: 'RMP166', siFuera: `${f0(k)} × ${f0(k)} no sale de los casos: 1, 2, 4, 8 no son 1, 4, 9, 16.` },
          ]),
          solucion: { texto: 'Cada número pasa a las dos latas de abajo: la suma se duplica en cada fila.', ecuacion: [{ sup: ['2', f0(k - 1)] }, ' = ', F(f0(2 ** (k - 1)))] } };
      },
    },
  };

  // ---------- Ejemplos resueltos de «Filas de un triángulo de números» ----------
  // Comprobados al cargar (ARR arma cada fila lata por lata) y aparte en scratchpad e8-rm/verificar.py: 1 → 216 · 2 → 13,
  // 15, 17 y 19 · 3 → 16 · 4 → 29 · 5 → 21 · 6 → 1728 · 7 → 91 · 8 → 29 · 9 → 1024 · 10 → fila 10 · 11 → 8000 (D) ·
  // 12 → 239 (E) · 13 → 505 (A) · 14 → 16 384 (B) · 15 → fila 45 (C).
  const enFila = x => { for (let k = 1; ; k++) if (k * k + k - 1 >= x) return k; };
  if (filaS('naturales', 10) !== 505 || ARR.naturales.fila(8)[0] !== 29 || ARR.naturales.fila(6)[5] !== 21 || enFila(99) !== 10 || enFila(2027) !== 45 || ARR.impares.fila(10)[0] !== 91) throw new Error('ejemplos de la idea 4');
  const ejSuma = (nivel, titulo, k, extra = {}) => ejemplo(Object.assign({ nivel, titulo, caso: kArr('impares', 'suma', k),
    enunciado: `En la pirámide de latas con los impares en orden, ¿cuánto suman las latas de la fila ${f0(k)}?`,
    datos: [D_IMP, D_FILA, D_CUBO], figura: piramide('impares', 4),
    solucion: [{ texto: 'Las filas 1, 2, 3 y 4 suman 1, 8, 27 y 64: cada una es su número de fila al cubo.' },
      { texto: `Con la fila ${f0(k)}:`, ecuacion: [`${f0(k)} × ${f0(k)} × ${f0(k)} = `, F(f0(k ** 3))] }],
    respuesta: [F(f0(k ** 3))] }, extra));
  const EJEMPLOS_ARR = [
    ejSuma(1, 'La fila 6', 6),
    ejemplo({ nivel: 1, titulo: 'Las latas de la fila 4', caso: kArr('impares', 'lista', 4),
      enunciado: 'En la pirámide de latas con los impares en orden, las filas 1 a 3 llevan 1; 3, 5; 7, 9, 11. ¿Qué números lleva la fila 4?',
      datos: [D_IMP, D_FILA], figura: piramide('impares', 4, { tapar: [3] }),
      solucion: [{ texto: 'La fila 3 termina en 11. La fila 4 tiene 4 latas, con los 4 impares que siguen.' }],
      respuesta: [F('13, 15, 17 y 19')] }),
    ejemplo({ nivel: 1, titulo: 'Sumas que se duplican', caso: kArr('pascal', 'suma', 5),
      enunciado: 'En una pirámide de latas, cada número es la suma de los dos que tiene encima. Las filas 1 a 4 suman 1, 2, 4 y 8. ¿Cuánto suma la fila 5?',
      datos: [D_PAS, D_FILA], figura: piramide('pascal', 4),
      solucion: [{ texto: 'Cada número de una fila pasa a las dos latas que tiene debajo (los bordes repiten el 1): en la fila siguiente cuenta dos veces.' }, { texto: 'Por eso cada fila suma el doble de la anterior.', ecuacion: ['8 × 2 = ', F('16')] }],
      respuesta: [F('16')] }),
    ejemplo({ nivel: 1, titulo: 'La última de la fila 5', caso: kArr('impares', 'ultimo', 5),
      enunciado: 'En la pirámide de latas con los impares en orden, la fila 4 termina en 19. ¿Qué número lleva la última lata de la fila 5?',
      datos: [D_IMP, D_FILA], figura: piramide('impares', 4),
      solucion: [{ texto: 'La fila 5 tiene 5 latas: los 5 impares que siguen al 19.', ecuacion: ['21, 23, 25, 27, ', F('29')] }],
      respuesta: [F('29')] }),
    ejemplo({ nivel: 1, titulo: 'Números del 1 en adelante', caso: kArr('naturales', 'ultimo', 6),
      enunciado: 'En una pirámide de latas, las latas llevan los números 1, 2, 3, 4… en orden, fila por fila. ¿Qué número lleva la última lata de la fila 6?',
      datos: [D_FILA], figura: piramide('naturales', 4),
      solucion: [{ texto: 'Hasta la fila 6 hay 1 + 2 + 3 + 4 + 5 + 6 latas: la última lleva ese número.', ecuacion: ['1 + 2 + 3 + 4 + 5 + 6 = ', F('21')] }],
      respuesta: [F('21')] }),
    ejSuma(2, 'La fila 12', 12),
    ejemplo({ nivel: 2, titulo: 'La primera de la fila 10', caso: kArr('impares', 'primero', 10),
      enunciado: 'En la pirámide de latas con los impares en orden, ¿qué número lleva la primera lata de la fila 10?',
      datos: [D_IMP, D_FILA], figura: piramide('impares', 4),
      solucion: [{ texto: 'Las primeras son 1, 3, 7, 13: con su número de fila, 1 × 0 + 1, 2 × 1 + 1, 3 × 2 + 1, 4 × 3 + 1.' },
        { texto: 'La fila n empieza en n × (n − 1) + 1.', ecuacion: ['10 × 9 + 1 = ', F('91')] }],
      respuesta: [F('91')] }),
    ejemplo({ nivel: 2, titulo: 'La primera de la fila 8', caso: kArr('naturales', 'primero', 8),
      enunciado: 'En una pirámide de latas con los números 1, 2, 3, 4… en orden, fila por fila, ¿qué número lleva la primera lata de la fila 8?',
      datos: [D_FILA, D_TRI], figura: piramide('naturales', 4),
      solucion: [{ texto: 'Antes de la fila 8 están las filas 1 a 7, con 1 + 2 + … + 7 latas.', ecuacion: ['7 × 8 ÷ 2 = 28'] },
        { texto: 'La fila 8 empieza en el que sigue.', ecuacion: ['28 + 1 = ', F('29')] }],
      respuesta: [F('29')] }),
    ejemplo({ nivel: 2, titulo: 'La fila 11 de las sumas', caso: kArr('pascal', 'suma', 11),
      enunciado: 'En una pirámide de latas, cada número es la suma de los dos que tiene encima. Las filas 1 a 4 suman 1, 2, 4 y 8. ¿Cuánto suma la fila 11?',
      datos: [D_PAS, D_FILA], figura: piramide('pascal', 4),
      solucion: [{ texto: 'Cada número de una fila pasa a las dos latas que tiene debajo (los bordes repiten el 1): por eso la suma se duplica.' },
        { texto: 'Con su número de fila: 1, 2, 2 × 2, 2 × 2 × 2. La fila n suma 2 × 2 × … × 2, con n − 1 doses.' },
        { texto: 'La fila 11:', ecuacion: [{ sup: ['2', '10'] }, ' = ', F('1024')] }],
      respuesta: [F('1024')] }),
    ejemplo({ nivel: 2, titulo: '¿En qué fila está el 99?', caso: kArr('impares', 'donde', 99),
      enunciado: 'En la pirámide de latas con los impares en orden, ¿en qué fila está la lata con el 99?',
      datos: [D_IMP, D_FILA], figura: piramide('impares', 4),
      solucion: [{ texto: 'La última lata de la fila n lleva n × (n + 1) − 1 (1, 5, 11, 19…).' },
        { texto: 'La fila 9 termina en 89 y la fila 10 en 109: el 99 está en la fila 10.', ecuacion: ['9 × 10 − 1 = 89', '   ·   ', '10 × 11 − 1 = 109'] }],
      respuesta: [F('En la fila 10')] }),
    // Nivel 3 (tipo examen), con alternativas por su valor. Letras: D, E, A, B, C.
    ejSuma(3, 'La fila 20', 20, { alternativas: ['400', '2000', '9261', '8000', '6859'], correcta: '8000',
      explica: '400 suman los 20 primeros impares; 2000 junta dos filas 10; 9261 es la fila 21; 6859, la fila 19.' }),
    ejemplo({ nivel: 3, titulo: 'La última de la fila 15', caso: kArr('impares', 'ultimo', 15),
      enunciado: 'En la pirámide de latas con los impares en orden, ¿qué número lleva la última lata de la fila 15?',
      datos: [D_IMP, D_FILA], figura: piramide('impares', 4),
      alternativas: ['29', '240', '225', '241', '239'], correcta: '239',
      solucion: [{ texto: 'Los últimos son 1, 5, 11, 19: con su número de fila, 1 × 2 − 1, 2 × 3 − 1, 3 × 4 − 1, 4 × 5 − 1.' },
        { texto: 'La fila 15:', ecuacion: ['15 × 16 − 1 = ', F('239')] }],
      explica: '29 es el impar número 15; 240 olvida restar 1; 225 es 15 × 15; 241 es la primera de la fila 16.',
      respuesta: [F('239')] }),
    ejemplo({ nivel: 3, titulo: 'La fila 10, contando de uno', caso: kArr('naturales', 'suma', 10),
      enunciado: 'En una pirámide de latas con los números 1, 2, 3, 4… en orden, fila por fila, ¿cuánto suman las latas de la fila 10?',
      datos: [D_FILA, D_TRI], figura: piramide('naturales', 4),
      alternativas: ['505', '550', '55', '1000', '460'], correcta: '505',
      solucion: [{ texto: 'La fila 10 termina en 1 + 2 + … + 10 = 55 y tiene 10 latas: va del 46 al 55.' },
        { texto: 'Son 10 números que promedian (46 + 55) ÷ 2.', ecuacion: ['10 × 101 ÷ 2 = ', F('505')] }],
      explica: '550 multiplica la última lata por 10; 55 es solo la última; 1000 usa la regla de los impares; 460 multiplica la primera por 10.',
      respuesta: [F('505')] }),
    ejemplo({ nivel: 3, titulo: 'La fila 15 de las sumas', caso: kArr('pascal', 'suma', 15),
      enunciado: 'En una pirámide de latas, cada número es la suma de los dos que tiene encima. Las filas 1 a 4 suman 1, 2, 4 y 8. ¿Cuánto suma la fila 15?',
      datos: [D_PAS, D_FILA, '2¹⁰ = 1024'], figura: piramide('pascal', 4),
      alternativas: ['32 768', '16 384', '225', '28', '8192'], correcta: '16 384',
      solucion: [{ texto: 'Cada número de una fila pasa a las dos latas que tiene debajo (los bordes repiten el 1): por eso la suma se duplica.' },
        { texto: 'La fila 15 suma 2 × 2 × … × 2, con 14 doses.', ecuacion: [{ sup: ['2', '14'] }, ' = 1024 × 16 = ', F('16 384')] }],
      explica: '32 768 es la fila 16; 225 es 15 × 15; 28 es 2 × 14, que suma 2 por fila desde la fila 2; 8192 es la fila 14.',
      respuesta: [F('16 384')] }),
    ejemplo({ nivel: 3, titulo: '¿En qué fila está el 2027?', caso: kArr('impares', 'donde', 2027),
      enunciado: 'En la pirámide de latas con los impares en orden, ¿en qué fila está la lata con el 2027?',
      datos: [D_IMP, D_FILA], figura: piramide('impares', 4),
      alternativas: ['44', '1014', '45', '46'], correcta: '45',
      solucion: [{ texto: 'La última lata de la fila n lleva n × (n + 1) − 1.' },
        { texto: 'La fila 44 termina en 1979 y la 45 en 2069: el 2027 está en la 45.', ecuacion: ['44 × 45 − 1 = 1979', '   ·   ', '45 × 46 − 1 = 2069'] }],
      explica: '44 termina antes, en 1979; 1014 es el lugar del 2027 entre los impares, no su fila; 46 empieza en 2071.',
      respuesta: [F('En la fila 45')] }),
  ];
  arreglo.ejemplos = EJEMPLOS_ARR;
  juntar('arreglo-triangular', EJEMPLOS_ARR, [kArr('impares', 'suma', K_J4), kArr('impares', 'suma', K_P4)]);

  // ---------- Idea 5: casos chicos de una cuenta larga ----------
  // Objeto: la calculadora del salón (rm-patrones, escena «calculadora»), con la cinta de los casos de antes. Cambia:
  // cuántos nueves tiene el número. · Permanece: el número se multiplica por sí mismo. · Progresa: las sumas de cifras 9,
  // 18, 27… · Se reserva: 25 nueves, que no caben en la pantalla (Predice). · Debe verse: qué cambia de un caso al siguiente.
  // Las cuentas se hacen con BigInt (exactas, cifra por cifra): nada se escribe a mano.
  const rep = (d, n) => String(d).repeat(n);
  const cuad = s => (BigInt(s) * BigInt(s)).toString();
  const cifras = s => suma(String(s).split('').map(Number));
  const miles = s => String(s).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const corto = (d, n) => (n <= 6 ? miles(rep(d, n)) : `${d}${d}…${d}`);
  const CIF = ['cifra', 'cifras'];
  const K_J5 = 4, K_P5 = 25;
  if (cifras(cuad(rep(9, K_J5))) !== 36 || cifras(cuad(rep(9, K_P5))) !== 225) throw new Error('idea 5: juego o predicción');
  const cinta = (d, ks, o = {}) => ks.map((k, i) => ({ t: o.suma ? `Con ${f0(k)}: ${miles(cuad(rep(d, k)))}, suma ${f0(cifras(cuad(rep(d, k))))}` : `${miles(rep(d, k))} × ${miles(rep(d, k))} = ${miles(cuad(rep(d, k)))}`, desde: o.desde ? o.desde[i] : 0 }));
  const calc = (d, n, o = {}) => ({ pieza: PZ, datos: Object.assign({ escena: 'calculadora', cuenta: `${corto(d, n)} × ${corto(d, n)}${n > 6 ? ` (${f0(n)} cifras ${d} cada uno)` : ''}`,
    resultado: o.resultado !== undefined ? o.resultado : n <= 5 ? miles(cuad(rep(d, n))) : 'Error', cinta: o.cinta || [], lineas: o.lineas || (o.cinta || []).length },
  o.nota ? { nota: o.nota } : {}, o.notas ? { notas: o.notas } : {}, o.papelResultado ? { papelResultado: o.papelResultado } : {}), estado: {} });
  const NOM = { 9: ['nueve', 'nueves'], 3: ['tres', 'treses'], 6: ['seis', 'seises'], 1: ['uno', 'unos'] };
  const numTxt = (d, n) => `${corto(d, n)}, con ${f0(n)} cifras ${d},`;
  const D_SUMA = 'Suma de cifras: se suman los dígitos del número; la de 2026 es 2 + 0 + 2 + 6 = 10.';
  const D_PANT = 'La calculadora del salón muestra hasta 10 cifras.';
  // Por qué la suma de cifras es 9 por cada cifra (la forma del resultado, comprobada con BigInt en la prueba de la unidad).
  const FORMA_RES = { 3: 'Unos, un 0, ochos y un 9: cada 1 con un 8 suma 9, como el 0 con el 9.',
    6: 'Cuatros, un 3, cincos y un 6: cada 4 con un 5 suma 9, como el 3 con el 6.' };
  const UNOS = n => `Las cifras suben de 1 a ${n} y bajan (12 321): vale hasta 9 unos; con 10, hay llevadas.`;
  const kLarga = (d, pide, n) => `larga|${d}|${pide}|${n}`;
  function lecturaJ5(val) { return [`Con ${f0(val.k)} ${val.k === 1 ? 'nueve' : 'nueves'}, las cifras suman ${f0(cifras(cuad(rep(9, val.k))))}`]; }
  const larga = {
    id: 'cuenta-larga',
    titulo: 'Casos chicos de una cuenta larga',
    pregunta: '¿Cómo se calcula una cuenta que no cabe en la calculadora?',
    temas: ['Inducción numérica'],
    pieza: PZ,
    aprendizaje: 'Una cuenta de muchas cifras repetidas sale de sus casos chicos: se ve qué cambia y por qué, y se comprueba con otro caso.',
    actividad: 'Multiplicar en la calculadora números de puros nueves y sumar las cifras del resultado.',
    lee: {
      tarjetas: [
        { titulo: 'La calculadora no alcanza', texto: 'La calculadora del salón muestra hasta 10 cifras. Una cuenta como 99…9 × 99…9, con 30 nueves cada uno, no cabe en su pantalla. Aun así se puede saber cosas de su resultado.',
          pieza: PZ, dibujo: calc(9, 30, { resultado: 'Error' }) },
        { titulo: 'Suma de cifras', texto: 'La suma de cifras de un número se obtiene sumando sus dígitos: la de 2026 es 2 + 0 + 2 + 6 = 10. No es lo mismo que el número.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia cuántos nueves tiene el número. Mira el resultado en la pantalla y anota su suma de cifras, caso por caso, en la cinta.' },
      ],
    },
    juega: {
      pieza: PZ,
      consigna: 'En la calculadora, un número de puros nueves se multiplica por sí mismo. Cambia cuántos nueves tiene y mira la cinta.',
      mision: {
        texto: `Busca cuántos nueves dan una suma de cifras de ${f0(cifras(cuad(rep(9, K_J5))))}.`,
        logrado: v => cifras(cuad(rep(9, v.k))) === cifras(cuad(rep(9, K_J5))),
        bien: [`Con ${f0(K_J5)} nueves sale ${miles(cuad(rep(9, K_J5)))}, que suma ${f0(cifras(cuad(rep(9, K_J5))))}.`],
      },
      voz: 'Anota cada suma junto a su número de nueves.',
      leyenda: [{ s: 'pantalla', t: 'la cuenta de ahora y su resultado' }, { s: 'cinta', t: 'los casos de antes y su suma' }],
      controles: [{ id: 'k', etiqueta: 'Nueves', min: 1, max: 5, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: calc(9, val.k, { cinta: cinta(9, rango(1, val.k), { suma: true }), lineas: 5 }).datos, estado: {} }),
      lectura: val => lecturaJ5(val),
      minimo: 3,
    },
    predice: {
      pregunta: `¿Cuánto suman las cifras del resultado de 99…9 × 99…9, con ${f0(K_P5)} nueves cada uno?`,
      datos: ['9 × 9 = 81, 99 × 99 = 9801 y 999 × 999 = 998 001.'],
      voz: 'Mira qué cambia de un caso al siguiente.',
      opciones: [
        { id: 'solo9', texto: '216', error: 'RMP170', siFuera: 'Contaste los 24 nueves del resultado, pero también están el 8 y el 1: suman 9 más.' },
        { id: 'c', texto: f0(cifras(cuad(rep(9, K_P5)))), correcta: true },
        { id: 'nueve', texto: '9', error: 'RMP169', siFuera: '9 es la suma con un solo nueve; con más nueves la suma crece: 9, 18, 27…' },
        { id: 'veces', texto: '2025', error: 'RM2', siFuera: '2025 es 25 veces 81; pero el resultado no es 81 repetido 25 veces.' },
      ],
      dibujo: calc(9, K_P5, { cinta: cinta(9, [1, 2, 3]), lineas: 3 }),
      revelar: calc(9, K_P5, { cinta: cinta(9, [1, 2, 3], { suma: true }), lineas: 3, nota: [{ t: `${f0(K_P5)} nueves: 9 × ${f0(K_P5)} = ${f0(cifras(cuad(rep(9, K_P5))))}`, papel: 'seguro' }] }),
      coincide: 'Coincide: cada nueve más suma 9 más a las cifras.',
      noCoincide: 'Revisemos: escribe cada suma de cifras junto a su número de nueves.',
    },
    mira: {
      pieza: PZ,
      datos: calc(9, 4, { cinta: cinta(9, [1, 2, 3, 4], { suma: true, desde: [0, 0, 0, 1] }), lineas: 4, notas: 1, nota: [{ t: 'n − 1 nueves, un 8, n − 1 ceros y un 1', papel: 'agrega', desde: 2 }] }).datos,
      voz: 'Primero los casos; después, el porqué.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Con 1, 2 y 3 nueves, las cifras suman 9, 18 y 27.', ecuacion: ['9, 18, 27'] },
        { estado: { corte: 1 }, texto: 'Se comprueba con 4 nueves, que no se usó: suma 36.', ecuacion: ['9 × 4 = 36'] },
        { estado: { corte: 2 }, texto: 'Por qué: multiplicar por 99…9 es multiplicar por 100…0 y restar.', ecuacion: ['9 × (', N, ' − 1) + 8 + 1 = 9 × ', N] },
        { estado: { corte: 2 }, texto: 'Con 25 nueves, la suma de cifras es 9 × 25.', ecuacion: ['9 × 25 = ', F('225')] },
      ],
    },
    regla: {
      texto: 'Para n cifras repetidas, calcula los casos de 1, 2 y 3 cifras, mira qué cambia y explica por qué. Un caso más lo comprueba.',
      ecuacion: [{ llave: ['casos 1, 2, 3'], nota: 'se calculan', color: 'c-o' }, ' ⇒ patrón', '   ·   ', { llave: ['caso 4'], nota: 'lo comprueba', color: 'c-i' }],
      condicion: 'las cifras se repiten siempre igual. El caso de prueba no se usa para encontrar el patrón; si falla, lo descarta.',
      voz: 'Lo que la calculadora no muestra, lo dicen los casos chicos.',
    },
    ejemplos: null,
    // Así se resuelve (semilla % 2): 0 la suma de cifras de 99…9 × 99…9 con 30 a 80 nueves · 1 la cifra del medio de
    // 11…1 × 11…1. «Ahora tú» usa treses y seises, la cantidad de cifras y la suma de cifras con unos.
    resuelve: {
      pieza: PZ,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          let n; do { n = r.ent(30, 80); } while (usado('cuenta-larga', kLarga(9, 'suma', n)));
          return {
            enunciado: `¿Cuánto suman las cifras del resultado de 99…9 × 99…9, con ${f0(n)} nueves cada uno?`,
            datos: [D_SUMA, D_PANT], dibujo: calc(9, n, { cinta: cinta(9, [1, 2, 3]), lineas: 3 }),
            pasos: [
              { tipo: 'pide', texto: `Piden la suma de cifras de un resultado que no cabe en la pantalla (${f0(2 * n)} cifras).` },
              { tipo: 'datos', texto: 'Los casos chicos: 81, 9801 y 998 001 suman 9, 18 y 27.' },
              { tipo: 'regla', texto: 'Escribo cada suma con su número de nueves: 9 × 1, 9 × 2, 9 × 3. Lo compruebo con 4 nueves: 99 980 001 suma 36.' },
              { tipo: 'cuentas', texto: `Con ${f0(n)} nueves:`, ecuacion: [`9 × ${f0(n)} = `, F(f0(9 * n))] },
              { tipo: 'sentido', texto: `El resultado tiene ${f0(n - 1)} nueves, un 8, ${f0(n - 1)} ceros y un 1: suman lo mismo.` },
            ],
            respuesta: [F(f0(9 * n))],
          };
        }
        let n; do { n = r.ent(4, 9); } while (usado('cuenta-larga', kLarga(1, 'resultado', n)));
        const res = cuad(rep(1, n));
        return {
          enunciado: `¿Qué cifra está en el medio del resultado de ${miles(rep(1, n))} × ${miles(rep(1, n))}?`,
          datos: [D_PANT], dibujo: calc(1, n, { resultado: '?', cinta: cinta(1, [1, 2, 3]), lineas: 3 }),
          pasos: [
            { tipo: 'pide', texto: `Piden la cifra del medio del resultado, que tiene ${f0(2 * n - 1)} cifras.` },
            { tipo: 'datos', texto: 'Casos chicos: 1, 121 y 12 321. Las cifras suben de 1 en 1 y vuelven a bajar.' },
            { tipo: 'regla', texto: 'La cifra del medio es la cantidad de unos: 1, 2, 3. Lo compruebo con 1111 × 1111 = 1 234 321.' },
            { tipo: 'cuentas', texto: `Con ${f0(n)} unos, el resultado sube hasta ${f0(n)} y baja.`, ecuacion: [miles(res)] },
            { tipo: 'sentido', texto: 'Funciona mientras no haya llevadas: hasta 9 unos.' },
          ],
          respuesta: [F(f0(n))],
        };
      },
    },
    // Ahora tú (semilla % 3): 0 la suma de cifras con treses o seises · 1 cuántas cifras tiene 99…9 × 99…9 · 2 la suma de
    // cifras de 11…1 × 11…1 (hasta 9 unos).
    ahoraTu: {
      pieza: PZ,
      voz: 'Haz los casos de 1, 2 y 3 cifras antes de saltar al grande.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const d = r.elegir([3, 6]);
          let n; do { n = r.ent(8, 60); } while (usado('cuenta-larga', kLarga(d, 'suma', n)));
          const bien = cifras(cuad(rep(d, n)));
          return { pregunta: `¿Cuánto suman las cifras del resultado de ${corto(d, n)} × ${corto(d, n)}, con ${f0(n)} cifras ${d} cada uno?`,
            datos: [D_SUMA, D_PANT], dibujo: calc(d, n, { cinta: cinta(d, [1, 2, 3]), lineas: 3 }),
            opciones: opcionesNum(bien, null, [
              { id: 'parte', valor: 9 * (n - 1), error: 'RMP170', siFuera: `Bien las cifras que se repiten, pero faltan las dos que no se repiten (${d === 3 ? 'el 0 y el 9' : 'el 3 y el 6'}).` },
              { id: 'primero', valor: 9, error: 'RMP169', siFuera: '9 es la suma del primer caso; con más cifras la suma crece: 9, 18, 27…' },
              { id: 'sig', valor: 9 * (n + 1), error: 'RMP161', siFuera: `Esa sería con ${f0(n + 1)} cifras: corriste el caso en uno.` },
              d === 6 ? { id: 'veces', valor: 36 * n, error: 'RM2', siFuera: `${f0(36 * n)} es ${f0(n)} veces 36; el resultado no es 36 repetido.` } : null,
            ]),
            solucion: { texto: FORMA_RES[d], ecuacion: [`9 × ${f0(n)} = `, F(f0(bien))] } };
        }
        if (tipo === 1) {
          let n; do { n = r.ent(8, 60); } while (usado('cuenta-larga', kLarga(9, 'cuantas', n)));
          const bien = cuad(rep(9, n)).length;
          return { pregunta: `¿Cuántas cifras tiene el resultado de 99…9 × 99…9, con ${f0(n)} nueves cada uno?`,
            datos: [D_PANT], dibujo: calc(9, n, { cinta: cinta(9, [1, 2, 3]), lineas: 3 }),
            opciones: opcionesNum(bien, CIF, [
              { id: 'menos', valor: 2 * n - 1, error: 'RMP167', siFuera: `Con 2 nueves sale 9801: 4 cifras, el doble justo; no una menos.` },
              { id: 'igual', valor: n, error: 'RMP169', siFuera: 'El resultado no tiene las mismas cifras que el número: 9 × 9 = 81 ya tiene dos.' },
              { id: 'cuad', valor: n * n, error: 'RMP166', siFuera: `${f0(n)} × ${f0(n)} no sale de los casos: 2, 4, 6 cifras crecen de 2 en 2.` },
              { id: 'mas', valor: 2 * n + 1, error: 'RMP161', siFuera: 'Contaste una cifra de más: 81, 9801 y 998 001 tienen 2, 4 y 6.' },
            ]),
            solucion: { texto: 'Los casos 1, 2 y 3 tienen 2, 4 y 6 cifras: el doble de los nueves.', ecuacion: [`2 × ${f0(n)} = `, F(f0(bien))] } };
        }
        let n; do { n = r.ent(4, 9); } while (usado('cuenta-larga', kLarga(1, 'suma', n)));
        const bien = cifras(cuad(rep(1, n)));
        return { pregunta: `¿Cuánto suman las cifras del resultado de ${miles(rep(1, n))} × ${miles(rep(1, n))}?`,
          datos: [D_SUMA, D_PANT], dibujo: calc(1, n, { resultado: '?', cinta: cinta(1, [1, 2, 3]), lineas: 3 }),
          opciones: opcionesNum(bien, null, [
            { id: 'cuantas', valor: 2 * n - 1, error: 'RMP170', siFuera: `${f0(2 * n - 1)} es cuántas cifras tiene el resultado; piden cuánto suman.` },
            { id: 'mitad', valor: n * (n + 1) / 2, error: 'RMP167', siFuera: 'Sumaste solo la subida (1, 2, 3…); las cifras también bajan.' },
            { id: 'antes', valor: (n - 1) * (n - 1), error: 'RMP161', siFuera: `Esa es la suma con ${f0(n - 1)} unos: corriste el caso en uno.` },
          ]),
          solucion: { texto: UNOS(f0(n)), ecuacion: [`${f0(n)} × ${f0(n)} = `, F(f0(bien))] } };
      },
    },
  };

  // ---------- Ejemplos resueltos de «Casos chicos de una cuenta larga» ----------
  // Cada número sale de multiplicar con BigInt (cifra por cifra) y de sumar sus cifras; aparte, en scratchpad
  // e8-rm/verificar.py, con los enteros de Python: 1 → 9 999 800 001 · 2 → 54 · 3 → 123 454 321 · 4 → 36 · 5 → 14 · 6 →
  // 360 · 7 → 108 · 8 → 64 · 9 → 19 · 10 → 29 · 11 → 450 (E) · 12 → 81 (A) · 13 → 70 (B) · 14 → 180 (C) · 15 → 0 (D).
  const veinte = cuad(rep(9, 20));
  if (cuad(rep(9, 5)) !== '9999800001' || cifras(cuad(rep(9, 6))) !== 54 || cuad('11111') !== '123454321' || cifras(cuad('3333')) !== 36 || cuad(rep(9, 7)).length !== 14
    || cifras(cuad(rep(9, 40))) !== 360 || cifras(cuad(rep(6, 12))) !== 108 || cifras(cuad(rep(1, 8))) !== 64 || cifras(cuad(rep(3, 50))) !== 450 || cifras(cuad(rep(1, 9))) !== 81
    || cuad(rep(9, 35)).length !== 70 || cifras(cuad(rep(6, 20))) !== 180 || veinte[24] !== '0' || (veinte.match(/0/g) || []).length !== 19 || (cuad(rep(9, 30)).match(/9/g) || []).length !== 29) throw new Error('ejemplos de la idea 5');
  const casosTxt = (d, ks) => ks.map(k => miles(cuad(rep(d, k)))).join(', ');
  const EJEMPLOS_LARGA = [
    ejemplo({ nivel: 1, titulo: 'Cinco nueves', caso: kLarga(9, 'resultado', 5),
      enunciado: 'Con 9 × 9 = 81, 99 × 99 = 9801, 999 × 999 = 998 001 y 9999 × 9999 = 99 980 001, ¿cuánto da 99 999 × 99 999?',
      datos: [D_PANT], figura: calc(9, 5, { resultado: '?', cinta: cinta(9, [1, 2, 3, 4]), lineas: 4 }),
      solucion: [{ texto: 'Con n nueves salen n − 1 nueves, un 8, n − 1 ceros y un 1. Con 5: cuatro nueves, un 8, cuatro ceros y un 1.' }],
      respuesta: [F('9 999 800 001')] }),
    ejemplo({ nivel: 1, titulo: 'Suma de cifras con seis nueves', caso: kLarga(9, 'suma', 6),
      enunciado: '¿Cuánto suman las cifras de 999 999 × 999 999?',
      datos: [D_SUMA, D_PANT], figura: calc(9, 6, { cinta: cinta(9, [1, 2, 3], { suma: true }), lineas: 3 }),
      solucion: [{ texto: 'Con 1, 2 y 3 nueves las cifras suman 9, 18 y 27: 9 por cada nueve.', ecuacion: ['9 × 6 = ', F('54')] }],
      respuesta: [F('54')] }),
    ejemplo({ nivel: 1, titulo: 'Cinco unos', caso: kLarga(1, 'resultado', 5),
      enunciado: 'Con 11 × 11 = 121, 111 × 111 = 12 321 y 1111 × 1111 = 1 234 321, ¿cuánto da 11 111 × 11 111?',
      datos: [D_PANT], figura: calc(1, 5, { resultado: '?', cinta: cinta(1, [2, 3, 4]), lineas: 3 }),
      solucion: [{ texto: 'Las cifras suben de 1 hasta la cantidad de unos y vuelven a bajar. Con 5 unos, suben hasta 5.' }],
      respuesta: [F('123 454 321')] }),
    ejemplo({ nivel: 1, titulo: 'Cuatro treses', caso: kLarga(3, 'suma', 4),
      enunciado: 'Con 3 × 3 = 9, 33 × 33 = 1089 y 333 × 333 = 110 889, ¿cuánto suman las cifras de 3333 × 3333?',
      datos: [D_SUMA], figura: calc(3, 4, { resultado: '?', cinta: cinta(3, [1, 2, 3]), lineas: 3 }),
      solucion: [{ texto: 'Las sumas de cifras de los casos son 9, 18 y 27: 9 por cada tres.' }, { texto: FORMA_RES[3], ecuacion: ['9 × 4 = ', F('36')] }],
      respuesta: [F('36')] }),
    ejemplo({ nivel: 1, titulo: '¿Cuántas cifras con siete nueves?', caso: kLarga(9, 'cuantas', 7),
      enunciado: '¿Cuántas cifras tiene el resultado de 9 999 999 × 9 999 999?',
      datos: [D_PANT], figura: calc(9, 7, { cinta: cinta(9, [1, 2, 3]), lineas: 3 }),
      solucion: [{ texto: '81, 9801 y 998 001 tienen 2, 4 y 6 cifras: el doble de los nueves.', ecuacion: ['2 × 7 = ', F('14')] }],
      respuesta: [F('14 cifras')] }),
    ejemplo({ nivel: 2, titulo: 'Cuarenta nueves', caso: kLarga(9, 'suma', 40),
      enunciado: '¿Cuánto suman las cifras del resultado de 99…9 × 99…9, con 40 nueves cada uno?',
      datos: [D_SUMA, D_PANT], figura: calc(9, 40, { cinta: cinta(9, [1, 2, 3]), lineas: 3 }),
      solucion: [{ texto: 'Los casos 1, 2 y 3 suman 9, 18 y 27; el caso 4, que sirve para comprobar, suma 36.' },
        { texto: 'Con 40 nueves:', ecuacion: ['9 × 40 = ', F('360')] }],
      respuesta: [F('360')] }),
    ejemplo({ nivel: 2, titulo: 'Doce seises', caso: kLarga(6, 'suma', 12),
      enunciado: '¿Cuánto suman las cifras del resultado de 66…6 × 66…6, con 12 cifras 6 cada uno?',
      datos: [D_SUMA, D_PANT], figura: calc(6, 12, { cinta: cinta(6, [1, 2, 3]), lineas: 3 }),
      solucion: [{ texto: `Los casos dan ${casosTxt(6, [1, 2, 3])}, que suman 9, 18 y 27.` },
        { texto: FORMA_RES[6], ecuacion: ['9 × 12 = ', F('108')] }],
      respuesta: [F('108')] }),
    ejemplo({ nivel: 2, titulo: 'Ocho unos', caso: kLarga(1, 'suma', 8),
      enunciado: '¿Cuánto suman las cifras del resultado de 11 111 111 × 11 111 111?',
      datos: [D_SUMA, D_PANT], figura: calc(1, 8, { cinta: cinta(1, [1, 2, 3]), lineas: 3 }),
      solucion: [{ texto: 'Los casos 1, 121 y 12 321 suman 1, 4 y 9: la cantidad de unos por sí misma.' },
        { texto: UNOS(8), ecuacion: ['8 × 8 = ', F('64')] }],
      respuesta: [F('64')] }),
    ejemplo({ nivel: 2, titulo: 'Los ceros del resultado', caso: kLarga(9, 'ceros', 20),
      enunciado: '¿Cuántos ceros tiene el resultado de 99…9 × 99…9, con 20 nueves cada uno?',
      datos: [D_PANT], figura: calc(9, 20, { cinta: cinta(9, [2, 3, 4]), lineas: 3 }),
      solucion: [{ texto: '9801, 998 001 y 99 980 001 tienen 1, 2 y 3 ceros: uno menos que los nueves.', ecuacion: ['20 − 1 = ', F('19')] }],
      respuesta: [F('19 ceros')] }),
    ejemplo({ nivel: 2, titulo: 'Los nueves del resultado', caso: kLarga(9, 'nueves', 30),
      enunciado: '¿Cuántas cifras 9 tiene el resultado de 99…9 × 99…9, con 30 nueves cada uno?',
      datos: [D_PANT], figura: calc(9, 30, { cinta: cinta(9, [2, 3, 4]), lineas: 3 }),
      solucion: [{ texto: '9801, 998 001 y 99 980 001 tienen 1, 2 y 3 nueves: uno menos que el número.', ecuacion: ['30 − 1 = ', F('29')] }],
      respuesta: [F('29')] }),
    // Nivel 3 (tipo examen), con alternativas por su valor. Letras: E, A, B, C, D.
    ejemplo({ nivel: 3, titulo: 'Cincuenta treses', caso: kLarga(3, 'suma', 50),
      enunciado: '¿Cuánto suman las cifras del resultado de 33…3 × 33…3, con 50 cifras 3 cada uno?',
      datos: [D_SUMA, D_PANT], figura: calc(3, 50, { cinta: cinta(3, [1, 2, 3]), lineas: 3 }),
      alternativas: ['441', '9', '459', '100', '450'], correcta: '450',
      solucion: [{ texto: `Los casos dan ${casosTxt(3, [1, 2, 3])}: sus cifras suman 9, 18 y 27.` },
        { texto: FORMA_RES[3], ecuacion: ['9 × 50 = ', F('450')] }],
      explica: '441 deja fuera el 0 y el 9, que no se repiten; 9 es el primer caso; 459 sería con 51 treses; 100 cuenta las cifras, no las suma.',
      respuesta: [F('450')] }),
    ejemplo({ nivel: 3, titulo: 'Nueve unos', caso: kLarga(1, 'suma', 9),
      enunciado: '¿Cuánto suman las cifras del resultado de 111 111 111 × 111 111 111?',
      datos: [D_SUMA, D_PANT], figura: calc(1, 9, { cinta: cinta(1, [1, 2, 3]), lineas: 3 }),
      alternativas: ['81', '17', '45', '9', '64'], correcta: '81',
      solucion: [{ texto: 'Los casos 1, 121 y 12 321 suman 1, 4 y 9: la cantidad de unos por sí misma.' }, { texto: UNOS(9), ecuacion: ['9 × 9 = ', F('81')] }],
      explica: '17 es cuántas cifras tiene el resultado; 45 suma solo la subida (1 a 9); 9 es la cifra del medio; 64 es con 8 unos.',
      respuesta: [F('81')] }),
    ejemplo({ nivel: 3, titulo: 'Cifras con 35 nueves', caso: kLarga(9, 'cuantas', 35),
      enunciado: '¿Cuántas cifras tiene el resultado de 99…9 × 99…9, con 35 nueves cada uno?',
      datos: [D_PANT], figura: calc(9, 35, { cinta: cinta(9, [1, 2, 3]), lineas: 3 }),
      alternativas: ['35', '70', '69', '71', '1225'], correcta: '70',
      solucion: [{ texto: '81, 9801 y 998 001 tienen 2, 4 y 6 cifras: el doble de los nueves.', ecuacion: ['2 × 35 = ', F('70')] }],
      explica: '35 cree que el resultado tiene las cifras del número; 69 y 71 se corren en una; 1225 es 35 × 35.',
      respuesta: [F('70 cifras')] }),
    ejemplo({ nivel: 3, titulo: 'Veinte seises', caso: kLarga(6, 'suma', 20),
      enunciado: '¿Cuánto suman las cifras del resultado de 66…6 × 66…6, con 20 cifras 6 cada uno?',
      datos: [D_SUMA, D_PANT], figura: calc(6, 20, { cinta: cinta(6, [1, 2, 3]), lineas: 3 }),
      alternativas: ['720', '171', '180', '189', '9'], correcta: '180',
      solucion: [{ texto: `Los casos dan ${casosTxt(6, [1, 2, 3])}: sus cifras suman 9, 18 y 27.` }, { texto: FORMA_RES[6], ecuacion: ['9 × 20 = ', F('180')] }],
      explica: '720 es 20 veces 36; 171 deja fuera el 3 y el 6, que no se repiten; 189 sería con 21 seises; 9 es el primer caso.',
      respuesta: [F('180')] }),
    ejemplo({ nivel: 3, titulo: 'La cifra del lugar 25', caso: kLarga(9, 'lugar', 20),
      enunciado: 'El resultado de 99…9 × 99…9, con 20 nueves cada uno, se lee de izquierda a derecha. ¿Qué cifra ocupa el lugar 25?',
      datos: [D_PANT], figura: calc(9, 20, { cinta: cinta(9, [2, 3, 4]), lineas: 3 }),
      alternativas: ['9', '8', '1', '0'], correcta: '0',
      solucion: [{ texto: 'Con 20 nueves salen 19 nueves (lugares 1 a 19), un 8 (lugar 20), 19 ceros (lugares 21 a 39) y un 1 (lugar 40).' },
        { texto: 'El lugar 25 cae entre los ceros.', ecuacion: [F('0')] }],
      explica: '9 ocupa solo los lugares 1 a 19; el 8 está en el lugar 20; el 1, en el 40.',
      respuesta: [F('0')] }),
  ];
  larga.ejemplos = EJEMPLOS_LARGA;
  juntar('cuenta-larga', EJEMPLOS_LARGA, [kLarga(9, 'suma', K_J5), kLarga(9, 'suma', K_P5)]);

  // ---------- Idea 6: lo que se repite ----------
  // Objeto: la pulsera de mostacillas de la feria de Puno (rm-patrones, escena «pulsera»); en los ejercicios, también
  // tiras de fichas con cifras. Cambia: el lugar que se elige. · Permanece: el ciclo roja, verde, negra, blanca. ·
  // Progresa: cuántos ciclos completos caben y cuántas sobran. · Se reserva: el lugar 50 (Predice). · Debe verse: lo que
  // sobra al dividir entre el largo del ciclo dice qué toca.
  const COLORES = { R: ['roja', 'Roja'], V: ['verde', 'Verde'], N: ['negra', 'Negra'], B: ['blanca', 'Blanca'], D: ['dorada', 'Dorada'], C: ['celeste', 'Celeste'] };
  const CIC1 = ['R', 'V', 'N', 'B'];
  // Lo que toca en el lugar k de un ciclo (k desde 1), contando antes los términos que no se repiten (pre).
  const toca = (ciclo, k, pre = []) => (k <= pre.length ? pre[k - 1] : ciclo[(k - pre.length - 1) % ciclo.length]);
  const conResto = (L, k) => ({ q: Math.floor(k / L), r: k % L });
  const sobraTxt = r => (r === 0 ? 'no sobra nada' : r === 1 ? 'sobra 1' : `sobran ${f0(r)}`);
  const cicloTxt = ciclo => lista(ciclo.map(c => COLORES[c][0]));
  const figPul = (ciclo, n, o = {}) => ({ pieza: PZ, datos: Object.assign({ escena: 'pulsera', cuentas: rango(1, n).map(k => toca(ciclo, k)), porFila: o.porFila || 12, puntos: true,
    ciclo: { de: 0, largo: ciclo.length, t: `ciclo de ${f0(ciclo.length)}` } }, o.marcas ? { marcas: o.marcas } : {}, o.nota ? { nota: o.nota } : {}, o.notas ? { notas: o.notas } : {}), estado: {} });
  const figTira = (xs, o = {}) => ({ pieza: PZ, datos: Object.assign({ escena: 'pulsera', forma: 'ficha', cuentas: xs.map(String), porFila: 12, puntos: true },
    o.ciclo ? { ciclo: o.ciclo } : {}, o.nota ? { nota: o.nota } : {}), estado: {} });
  const D_CICLO = 'Ciclo: lo que se repite igual, siempre en el mismo orden.';
  const D_RES = 'Residuo: lo que sobra al dividir. 17 entre 5 da 3 y sobran 2 (17 = 5 × 3 + 2).';
  // La sucesión de las cifras de las unidades: desde el tercero, cada término es la última cifra del producto de los dos
  // anteriores. Se escriben términos hasta que dos seguidos vuelven a salir: ahí empieza a repetirse.
  function unidades(a, b, N) { const s = [a, b]; while (s.length < N) s.push((s[s.length - 1] * s[s.length - 2]) % 10); return s; }
  function cicloDe(a, b) {
    const s = unidades(a, b, 80);
    for (let i = 0; i < 40; i++) for (let p = 1; p <= 20; p++) if (rango(i, i + 30).every(j => s[j] === s[j + p])) return { pre: i, largo: p, s };
    return null;
  }
  const K_J6 = 24, K_P6 = 50;
  if (toca(CIC1, K_P6) !== 'V') throw new Error('idea 6: predicción');
  const kRep = (tipo, que, k) => `rep|${tipo}|${que}|${k}`;
  function lecturaJ6(val) {
    const { q, r } = conResto(4, val.k), c = COLORES[toca(CIC1, val.k)][0];
    if (val.k < 4) return [`Lugar ${f0(val.k)}: todavía dentro del primer ciclo, ${c}`];
    return [`Lugar ${f0(val.k)}: ${f0(q)} ${q === 1 ? 'ciclo' : 'ciclos'} de 4 y ${sobraTxt(r)}: ${c}`];
  }
  const repite = {
    id: 'lo-que-se-repite',
    titulo: 'Lo que se repite',
    pregunta: '¿Cómo sabes qué toca en el lugar 50 de una lista que se repite?',
    temas: ['Inducción numérica', 'Inducción con figuras'],
    pieza: PZ,
    aprendizaje: 'Si una lista se repite en un ciclo, el lugar pedido se divide entre el largo del ciclo y el residuo dice qué toca.',
    actividad: 'Elegir un lugar de la pulsera y ver qué mostacilla está ahí.',
    lee: {
      tarjetas: [
        { titulo: 'La pulsera de la feria', texto: 'En la feria de Puno venden pulseras de mostacillas que repiten un mismo dibujo: una roja, una verde, una negra y una blanca, y otra vez. Cada mostacilla lleva la letra de su color.',
          pieza: PZ, dibujo: figPul(CIC1, 12) },
        { titulo: 'El ciclo', texto: 'Lo que se repite igual, una y otra vez, es un ciclo. Su largo es cuántas cosas tiene: el de la pulsera tiene 4 mostacillas.' },
        { titulo: 'Antes del ciclo', texto: 'A veces la lista empieza con algo que no se repite. Pasa con la cifra de las unidades de algunas cuentas: los primeros términos quedan fuera y recién después se repite.' },
        { titulo: 'Qué mirar al jugar', texto: 'Elige un lugar de la pulsera y mira qué mostacilla toca. Fíjate en los lugares que llevan el mismo color.' },
      ],
    },
    juega: {
      pieza: PZ,
      consigna: 'La pulsera repite roja, verde, negra y blanca. Elige un lugar y mira qué mostacilla está ahí.',
      mision: {
        texto: 'Busca un lugar mayor que 20 con mostacilla blanca.',
        logrado: v => v.k > 20 && toca(CIC1, v.k) === 'B',
        bien: ['Blanca: ese lugar cierra un ciclo completo de 4, sin que sobre nada.'],
      },
      voz: 'Cuenta cuántos ciclos de 4 caben y cuántas sobran.',
      leyenda: [{ s: 'R, V, N, B', t: 'roja, verde, negra y blanca' }, { s: I('ciclo de 4'), t: 'lo que se repite' }, { s: O('borde naranja'), t: 'el lugar que elegiste' }],
      controles: [{ id: 'k', etiqueta: 'Lugar', min: 1, max: 30, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: figPul(CIC1, 30, { porFila: 10, marcas: [{ i: val.k - 1, papel: 'dato' }] }).datos, estado: {} }),
      lectura: val => lecturaJ6(val),
      minimo: 3,
    },
    predice: {
      pregunta: `En la misma pulsera, ¿de qué color es la mostacilla del lugar ${f0(K_P6)}?`,
      datos: ['La pulsera repite roja, verde, negra y blanca, siempre en ese orden.'],
      voz: 'No hace falta contar hasta 50.',
      opciones: [
        { id: 'blanca', texto: 'Blanca', error: 'RMP171', siFuera: '12 son los ciclos completos; lo que decide es lo que sobra al dividir entre 4: 2.' },
        { id: 'c', texto: 'Verde', correcta: true },
        { id: 'negra', texto: 'Negra', error: 'RMP27', siFuera: 'Bien que sobran 2, pero contaste uno de más: la segunda del ciclo es la verde.' },
        { id: 'roja', texto: 'Roja', error: 'RMP27', siFuera: 'Bien que sobran 2, pero contaste uno de menos: la roja es la primera del ciclo.' },
      ],
      dibujo: figPul(CIC1, 12),
      revelar: figPul(CIC1, 12, { marcas: [{ i: 1, papel: 'seguro' }], nota: [{ t: '50 = 4 × 12 + 2: la segunda, verde', papel: 'seguro' }] }),
      coincide: 'Coincide: 12 ciclos completos y sobran 2; la segunda del ciclo es verde.',
      noCoincide: 'Revisemos: divide 50 entre 4 y mira lo que sobra.',
    },
    mira: {
      pieza: PZ,
      datos: figPul(CIC1, 12, { marcas: [3, 7, 11].map(i => ({ i, papel: 'agrega', desde: 1 })).concat([{ i: 1, papel: 'seguro', desde: 3 }]), notas: 1, nota: [{ t: '50 = 4 × 12 + 2', desde: 2 }] }).datos,
      voz: 'Lo que sobra al dividir dice cuál toca.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El dibujo se repite cada 4: es un ciclo de largo 4.', ecuacion: ['R, V, N, B, R, V, N, B…'] },
        { estado: { corte: 1 }, texto: 'Los lugares 4, 8, 12… cierran un ciclo: ahí siempre va blanca.', ecuacion: ['4 × 1, 4 × 2, 4 × 3'] },
        { estado: { corte: 2 }, texto: '50 entre 4 da 12 ciclos completos y sobran 2.', ecuacion: ['50 = 4 × 12 + 2'] },
        { estado: { corte: 3 }, texto: 'Las 2 que sobran se cuentan desde el inicio: la segunda es verde.', ecuacion: [F('verde')] },
      ],
    },
    regla: {
      texto: 'Si una lista se repite en un ciclo, divide el lugar entre el largo del ciclo. El residuo dice cuál toca; si es 0, toca la última del ciclo.',
      ecuacion: ['lugar ÷ ', { llave: ['largo'], nota: 'del ciclo', color: 'c-i' }, ' ⇒ ', { llave: ['residuo'], nota: 'cuál toca', color: 'c-o' }],
      condicion: 'el ciclo empieza en el lugar 1; si antes hay términos que no se repiten, se descuentan primero.',
      voz: 'No cuentes todo: divide y mira lo que sobra.',
    },
    ejemplos: null,
    // Así se resuelve (semilla % 2): 0 una pulsera de 6 colores · 1 un número que empieza con una cifra y sigue con un
    // bloque repetido. «Ahora tú» usa pulseras de 4 o 5 colores, bloques sin cifra de inicio y la cifra de las unidades.
    resuelve: {
      pieza: PZ,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const ciclo = r.barajar(['R', 'V', 'N', 'B', 'D', 'C']);
          let k; do { k = r.ent(60, 300); } while (k % 6 === 0 && r() < 0.5);
          const { q, r: re } = conResto(6, k), c = toca(ciclo, k);
          return {
            enunciado: `Una pulsera repite ${cicloTxt(ciclo)}, siempre en ese orden. ¿De qué color es la mostacilla del lugar ${f0(k)}?`,
            datos: [D_CICLO, D_RES], dibujo: figPul(ciclo, 12),
            pasos: [
              { tipo: 'pide', texto: `Piden el color de la mostacilla ${f0(k)}.` },
              { tipo: 'datos', texto: 'El ciclo tiene 6 mostacillas; la lista empieza con el ciclo.' },
              { tipo: 'regla', texto: 'Divido el lugar entre el largo del ciclo: el residuo dice cuál toca (si es 0, la última).' },
              { tipo: 'cuentas', texto: `${f0(k)} entre 6 da ${f0(q)} ciclos completos y ${sobraTxt(re)}.`, ecuacion: [`${f0(k)} = 6 × ${f0(q)} + ${f0(re)}`] },
              { tipo: 'sentido', texto: `${re === 0 ? 'No sobra nada: toca la última del ciclo' : `Toca la mostacilla ${f0(re)} del ciclo`}, la ${COLORES[c][0]}.` },
            ],
            respuesta: [F(COLORES[c][1])],
          };
        }
        const bloque = r.barajar(rango(1, 9)).slice(0, r.ent(3, 4)), ini = r.elegir(rango(1, 9).filter(d => !bloque.includes(d)));
        let k; do { k = r.ent(60, 300); } while ((k - 1) % bloque.length === 0 && r() < 0.5);
        const lista_ = rango(1, 14).map(j => toca(bloque, j, [ini])), { q, r: re } = conResto(bloque.length, k - 1), c = toca(bloque, k, [ini]);
        return {
          enunciado: `Un número empieza con ${f0(ini)} y sigue con el bloque ${bloque.join('')} repetido: ${lista_.join('')}… ¿Qué cifra ocupa el lugar ${f0(k)}?`,
          datos: [D_CICLO, D_RES], dibujo: figTira(lista_, { ciclo: { de: 1, largo: bloque.length, t: `ciclo de ${f0(bloque.length)}` } }),
          pasos: [
            { tipo: 'pide', texto: `Piden la cifra del lugar ${f0(k)}.` },
            { tipo: 'datos', texto: `El ${f0(ini)} del inicio no se repite; el ciclo, ${bloque.join('')}, tiene ${f0(bloque.length)} cifras.` },
            { tipo: 'regla', texto: 'Descuento lo que va antes del ciclo y divido entre su largo.', ecuacion: [`${f0(k)} − 1 = ${f0(k - 1)}`] },
            { tipo: 'cuentas', texto: `${f0(k - 1)} entre ${f0(bloque.length)} da ${f0(q)} y ${sobraTxt(re)}.`, ecuacion: [`${f0(k - 1)} = ${f0(bloque.length)} × ${f0(q)} + ${f0(re)}`] },
            { tipo: 'sentido', texto: `${re === 0 ? 'No sobra nada: toca la última cifra del ciclo' : `Toca la cifra ${f0(re)} del ciclo`}: ${f0(c)}.` },
          ],
          respuesta: [F(f0(c))],
        };
      },
    },
    // Ahora tú (semilla % 3): 0 una pulsera de 4 o 5 colores · 1 un bloque de 4 a 6 cifras · 2 la cifra de las unidades
    // de una sucesión (con términos antes del ciclo).
    ahoraTu: {
      pieza: PZ,
      voz: 'Divide el lugar entre el largo del ciclo y mira lo que sobra.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          let ciclo, k;
          do { ciclo = r.barajar(['R', 'V', 'N', 'B', 'D']).slice(0, r.ent(4, 5)); k = r.ent(40, 200); } while (usado('lo-que-se-repite', kRep('pulsera', ciclo.join(''), k)) || (ciclo.join('') === 'RVNB' && k === K_P6));
          const L = ciclo.length, { q, r: re } = conResto(L, k), c = toca(ciclo, k), nom = x => COLORES[x][1];
          const ds = [
            { id: 'cociente', texto: nom(toca(ciclo, q === 0 ? L : q)), error: 'RMP171', siFuera: `${f0(q)} son los ciclos completos; lo que decide es lo que sobra al dividir entre ${f0(L)}: ${f0(re)}.` },
            { id: 'mas', texto: nom(toca(ciclo, k + 1)), error: 'RMP27', siFuera: `Bien la división, pero contaste una de más: esa va en el lugar ${f0(k + 1)}.` },
            { id: 'menos', texto: nom(toca(ciclo, k - 1)), error: 'RMP27', siFuera: `Bien la división, pero contaste una de menos: esa va en el lugar ${f0(k - 1)}.` },
            { id: 'mas2', texto: nom(toca(ciclo, k + 2)), error: 'RMP27', siFuera: `Contaste dos de más: esa va en el lugar ${f0(k + 2)}.` },
          ].filter(d => d.texto !== nom(c));
          return { pregunta: `Una pulsera repite ${cicloTxt(ciclo)}, siempre en ese orden. ¿De qué color es la mostacilla del lugar ${f0(k)}?`,
            datos: [D_CICLO, D_RES], dibujo: figPul(ciclo, 12), opciones: opcionesTexto(nom(c), ds),
            solucion: { texto: `${f0(k)} entre ${f0(L)} da ${f0(q)} y ${sobraTxt(re)}: ${re === 0 ? 'la última del ciclo' : `la ${f0(re)}.ª del ciclo`}.`, ecuacion: [`${f0(k)} = ${f0(L)} × ${f0(q)} + ${f0(re)}`] } };
        }
        if (tipo === 1) {
          let bloque, k;
          do { bloque = r.barajar(rango(1, 9)).slice(0, r.ent(4, 6)); k = r.ent(50, 300); } while (usado('lo-que-se-repite', kRep('bloque', bloque.join(''), k)));
          const L = bloque.length, { q, r: re } = conResto(L, k), c = toca(bloque, k);
          return { pregunta: `Se escribe el bloque ${bloque.join('')} una y otra vez: ${rango(1, 2 * L + 2).map(j => toca(bloque, j)).join('')}… ¿Qué cifra ocupa el lugar ${f0(k)}?`,
            datos: [D_CICLO, D_RES], dibujo: figTira(rango(1, 12).map(j => toca(bloque, j)), { ciclo: { de: 0, largo: L, t: `ciclo de ${f0(L)}` } }),
            opciones: opcionesNum(c, null, [
              { id: 'cociente', valor: toca(bloque, q === 0 ? L : q), error: 'RMP171', siFuera: `${f0(q)} son los bloques completos; lo que decide es lo que sobra: ${f0(re)}.` },
              { id: 'mas', valor: toca(bloque, k + 1), error: 'RMP27', siFuera: `Contaste una de más: esa cifra va en el lugar ${f0(k + 1)}.` },
              { id: 'menos', valor: toca(bloque, k - 1), error: 'RMP27', siFuera: `Contaste una de menos: esa cifra va en el lugar ${f0(k - 1)}.` },
              { id: 'mas2', valor: toca(bloque, k + 2), error: 'RMP27', siFuera: `Contaste dos de más: esa cifra va en el lugar ${f0(k + 2)}.` },
              { id: 'primera', valor: bloque[0], error: 'RMP27', siFuera: 'Esa es la primera del bloque; el residuo dice cuál toca.' },
            ]),
            solucion: { texto: `${f0(k)} entre ${f0(L)} da ${f0(q)} y ${sobraTxt(re)}.`, ecuacion: [`${f0(k)} = ${f0(L)} × ${f0(q)} + ${f0(re)}`] } };
        }
        let a, b, C, N;
        for (let t = 0; t < 200; t++) {
          a = r.ent(2, 9); b = r.ent(2, 9); C = cicloDe(a, b); N = r.ent(40, 200);
          if (!C || C.pre < 1 || C.largo < 3 || usado('lo-que-se-repite', kRep('unidades', `${a}${b}`, N))) continue;
          const sq = unidades(a, b, N + 2), malas = new Set([sq[C.pre + ((N - 1) % C.largo)], sq[N], sq[N - 2], sq[C.pre], sq[N + 1]].filter(x => x !== sq[N - 1]));
          if (malas.size >= 3) break;
        }
        const s20 = unidades(a, b, N + 2), bien = s20[N - 1], sinPre = s20[C.pre + ((N - 1) % C.largo)], mas = s20[N];
        return { pregunta: `Una sucesión empieza ${a}, ${b}. Desde el tercero, cada término es la cifra de las unidades del producto de los dos anteriores: ${s20.slice(0, 8).join(', ')}… ¿Cuál es el término ${f0(N)}?`,
          datos: [D_CICLO, D_RES, 'Cifra de las unidades: la última; la de 48 es 8.'],
          opciones: opcionesNum(bien, null, [
            { id: 'sinpre', valor: sinPre, error: 'RMP26', siFuera: `Bien el ciclo de ${f0(C.largo)}, pero no descontaste los ${f0(C.pre)} términos de antes, que no se repiten.` },
            { id: 'mas', valor: mas, error: 'RMP27', siFuera: `Contaste uno de más: ese es el término ${f0(N + 1)}.` },
            { id: 'primero', valor: s20[C.pre], error: 'RMP169', siFuera: 'Ese es el primero del ciclo; el residuo dice cuál toca.' },
            { id: 'menos', valor: s20[N - 2], error: 'RMP27', siFuera: `Contaste uno de menos: ese es el término ${f0(N - 1)}.` },
            { id: 'mas2', valor: s20[N + 1], error: 'RMP27', siFuera: `Contaste dos de más: ese es el término ${f0(N + 2)}.` },
          ]),
          solucion: { texto: `Antes del ciclo van ${f0(C.pre)} términos; el ciclo tiene ${f0(C.largo)}. Descuento y divido.`, ecuacion: [`${f0(N)} − ${f0(C.pre)} = ${f0(N - C.pre)} = ${f0(C.largo)} × ${f0(Math.floor((N - C.pre) / C.largo))} + ${f0((N - C.pre) % C.largo)}`] } };
      },
    },
  };

  // ---------- Ejemplos resueltos de «Lo que se repite» ----------
  // Comprobados al cargar (toca, cicloDe) y aparte en scratchpad e8-rm/verificar.py, que escribe la lista término por
  // término hasta el lugar pedido: 1 → negra · 2 → blanca · 3 → roja · 4 → 5 · 5 → 3 · 6 → 2 · 7 → 2 · 8 → 200 · 9 → 8 ·
  // 10 → blanca · 11 → negra (A) · 12 → 568 (B) · 13 → 4 (C) · 14 → 3 (D) · 15 → verde (E).
  const C23 = cicloDe(2, 3);
  const C6 = ['R', 'V', 'N', 'B', 'D', 'C'];
  if (toca(CIC1, 31) !== 'N' || toca(CIC1, 48) !== 'B' || toca(['R', 'N', 'B'], 25) !== 'R' || toca([3, 5, 7], 20) !== 5 || toca([2, 4, 6, 8], 101) !== 2 || toca([2, 4, 6, 8], 102, [5]) !== 2
    || C23.pre !== 2 || C23.largo !== 6 || unidades(2, 3, 20)[19] !== 8 || unidades(2, 3, 102)[101] !== 4 || toca(['R', 'V', 'N', 'B', 'D'], 99) !== 'B' || toca(CIC1, 2027) !== 'N'
    || toca([3, 5, 1], 200, [7]) !== 3 || toca(C6, 500) !== 'V' || suma(rango(1, 203).map(j => toca([3, 1, 4, 1, 5], j))) !== 568) throw new Error('ejemplos de la idea 6');
  const ejPul = (nivel, titulo, ciclo, k, extra = {}) => {
    const L = ciclo.length, { q, r: re } = conResto(L, k), c = toca(ciclo, k);
    return ejemplo(Object.assign({ nivel, titulo, caso: kRep('pulsera', ciclo.join(''), k),
      enunciado: `Una pulsera repite ${cicloTxt(ciclo)}, siempre en ese orden. ¿De qué color es la mostacilla del lugar ${f0(k)}?`,
      datos: [D_CICLO, D_RES], figura: figPul(ciclo, 12),
      solucion: [{ texto: `El ciclo tiene ${f0(L)} mostacillas. ${f0(k)} entre ${f0(L)} da ${f0(q)} y ${sobraTxt(re)}.`, ecuacion: [`${f0(k)} = ${f0(L)} × ${f0(q)} + ${f0(re)}`] },
        { texto: re === 0 ? 'No sobra nada: toca la última del ciclo.' : `Toca la mostacilla ${f0(re)} del ciclo.`, ecuacion: [F(COLORES[c][0])] }],
      respuesta: [F(COLORES[c][1])] }, extra));
  };
  const D_UNI = 'Cifra de las unidades: la última; la de 48 es 8.';
  const EJEMPLOS_REP = [
    ejPul(1, 'La mostacilla 31', CIC1, 31),
    ejPul(1, 'La mostacilla 48', CIC1, 48),
    ejPul(1, 'Un ciclo de tres', ['R', 'N', 'B'], 25),
    ejemplo({ nivel: 1, titulo: 'Cifras que se repiten', caso: kRep('bloque', '357', 20),
      enunciado: 'Se escribe el bloque 357 una y otra vez: 357357357… ¿Qué cifra ocupa el lugar 20?',
      datos: [D_CICLO, D_RES], figura: figTira(rango(1, 12).map(j => toca([3, 5, 7], j)), { ciclo: { de: 0, largo: 3, t: 'ciclo de 3' } }),
      solucion: [{ texto: '20 entre 3 da 6 y sobran 2: la segunda cifra del ciclo.', ecuacion: ['20 = 3 × 6 + 2'] }],
      respuesta: [F('5')] }),
    ejemplo({ nivel: 1, titulo: 'El largo del ciclo', caso: 'largo|159',
      enunciado: 'Una lista sigue así: 1, 5, 9, 1, 5, 9, 1, 5, 9… ¿Cuánto mide su ciclo?',
      datos: [D_CICLO], figura: figTira([1, 5, 9, 1, 5, 9, 1, 5, 9]),
      solucion: [{ texto: 'Después del 9 vuelve el 1, y todo se repite: 1, 5, 9.' }],
      respuesta: [F('3 términos')] }),
    ejemplo({ nivel: 2, titulo: 'El lugar 101', caso: kRep('bloque', '2468', 101),
      enunciado: 'Se escribe el bloque 2468 una y otra vez: 246824682468… ¿Qué cifra ocupa el lugar 101?',
      datos: [D_CICLO, D_RES], figura: figTira(rango(1, 12).map(j => toca([2, 4, 6, 8], j)), { ciclo: { de: 0, largo: 4, t: 'ciclo de 4' } }),
      solucion: [{ texto: '101 entre 4 da 25 y sobra 1.', ecuacion: ['101 = 4 × 25 + 1'] }, { texto: 'Toca la primera cifra del ciclo.', ecuacion: [F('2')] }],
      respuesta: [F('2')] }),
    ejemplo({ nivel: 2, titulo: 'Un 5 antes del ciclo', caso: kRep('bloque5', '2468', 102),
      enunciado: 'Un número empieza con 5 y sigue con el bloque 2468 repetido: 5246824682468… ¿Qué cifra ocupa el lugar 102?',
      datos: [D_CICLO, D_RES], figura: figTira(rango(1, 12).map(j => toca([2, 4, 6, 8], j, [5])), { ciclo: { de: 1, largo: 4, t: 'ciclo de 4' } }),
      solucion: [{ texto: 'El 5 no se repite: lo descuento.', ecuacion: ['102 − 1 = 101'] }, { texto: '101 entre 4 da 25 y sobra 1: la primera del ciclo.', ecuacion: ['101 = 4 × 25 + 1', '   ·   ', F('2')] }],
      respuesta: [F('2')] }),
    ejemplo({ nivel: 2, titulo: 'La suma de 40 cifras', caso: kRep('suma', '2468', 40),
      enunciado: 'Se escribe el bloque 2468 una y otra vez: 246824682468… ¿Cuánto suman las 40 primeras cifras?',
      datos: [D_CICLO, D_RES], figura: figTira(rango(1, 12).map(j => toca([2, 4, 6, 8], j)), { ciclo: { de: 0, largo: 4, t: 'ciclo de 4' } }),
      solucion: [{ texto: '40 entre 4 da 10 ciclos completos, sin que sobre nada. Cada ciclo suma 2 + 4 + 6 + 8 = 20.', ecuacion: ['10 × 20 = ', F('200')] }],
      respuesta: [F('200')] }),
    ejemplo({ nivel: 2, titulo: 'Las unidades del producto', caso: kRep('unidades', '23', 20),
      enunciado: 'Una sucesión empieza 2, 3. Desde el tercero, cada término es la cifra de las unidades del producto de los dos anteriores. ¿Cuál es el término 20?',
      datos: [D_CICLO, D_RES, D_UNI], figura: figTira(unidades(2, 3, 12)),
      solucion: [{ texto: 'Los términos son 2, 3, 6, 8, 8, 4, 2, 8, 6, 8, 8, 4… Desde el tercero se repite 6, 8, 8, 4, 2, 8: un ciclo de 6.' },
        { texto: 'Descuento los 2 de antes y divido entre 6.', ecuacion: ['20 − 2 = 18 = 6 × 3 + 0'] },
        { texto: 'No sobra nada: toca la última del ciclo.', ecuacion: [F('8')] }],
      respuesta: [F('8')] }),
    ejPul(2, 'Un ciclo de cinco', ['R', 'V', 'N', 'B', 'D'], 99),
    // Nivel 3 (tipo examen), con alternativas por su valor. Letras: A, B, C, D, E.
    ejPul(3, 'La mostacilla 2027', CIC1, 2027, { alternativas: ['Negra', 'Blanca', 'Verde', 'Roja'], correcta: 'Negra',
      explica: 'Blanca sería si no sobrara nada; verde, si sobraran 2; roja, si sobrara 1.' }),
    ejemplo({ nivel: 3, titulo: 'Las 203 primeras cifras', caso: kRep('suma', '31415', 203),
      enunciado: 'Se escribe el bloque 31415 una y otra vez: 314153141531415… ¿Cuánto suman las 203 primeras cifras?',
      datos: [D_CICLO, D_RES], figura: figTira(rango(1, 12).map(j => toca([3, 1, 4, 1, 5], j)), { ciclo: { de: 0, largo: 5, t: 'ciclo de 5' } }),
      alternativas: ['560', '568', '574', '203', '2842'], correcta: '568',
      solucion: [{ texto: '203 entre 5 da 40 ciclos completos y sobran 3. Cada ciclo suma 3 + 1 + 4 + 1 + 5 = 14.', ecuacion: ['203 = 5 × 40 + 3'] },
        { texto: 'Los 40 ciclos y las 3 cifras que sobran (3, 1 y 4):', ecuacion: ['40 × 14 + 3 + 1 + 4 = ', F('568')] }],
      explica: '560 olvida las 3 cifras que sobran; 574 cuenta un ciclo completo de más; 203 cuenta las cifras sin sumarlas; 2842 multiplica 203 por 14.',
      respuesta: [F('568')] }),
    ejemplo({ nivel: 3, titulo: 'El término 102', caso: kRep('unidades', '23', 102),
      enunciado: 'Una sucesión empieza 2, 3. Desde el tercero, cada término es la cifra de las unidades del producto de los dos anteriores. ¿Cuál es el término 102?',
      datos: [D_CICLO, D_RES, D_UNI], figura: figTira(unidades(2, 3, 12)),
      alternativas: ['8', '2', '4', '6', '3'], correcta: '4',
      solucion: [{ texto: 'Desde el tercero se repite 6, 8, 8, 4, 2, 8: un ciclo de 6, con 2 términos antes.' },
        { texto: 'Descuento los 2 y divido entre 6: sobran 4, el cuarto del ciclo.', ecuacion: ['102 − 2 = 100 = 6 × 16 + 4', '   ·   ', F('4')] }],
      explica: '8 no descuenta los 2 términos de antes; 2 cuenta uno de más; 6 es el primero del ciclo; 3 es el segundo término de la lista.',
      respuesta: [F('4')] }),
    ejemplo({ nivel: 3, titulo: 'Un 7 y luego 351', caso: kRep('bloque7', '351', 200),
      enunciado: 'Un número empieza con 7 y sigue con el bloque 351 repetido: 7351351351… ¿Qué cifra ocupa el lugar 200?',
      datos: [D_CICLO, D_RES], figura: figTira(rango(1, 12).map(j => toca([3, 5, 1], j, [7])), { ciclo: { de: 1, largo: 3, t: 'ciclo de 3' } }),
      alternativas: ['5', '1', '7', '3'], correcta: '3',
      solucion: [{ texto: 'El 7 no se repite: lo descuento y divido entre 3.', ecuacion: ['200 − 1 = 199 = 3 × 66 + 1'] },
        { texto: 'Sobra 1: la primera cifra del ciclo.', ecuacion: [F('3')] }],
      explica: '5 no descuenta el 7 del inicio; 1 es la última del ciclo, que tocaría si no sobrara nada; 7 está solo en el lugar 1.',
      respuesta: [F('3')] }),
    ejPul(3, 'Seis colores, lugar 500', C6, 500, { alternativas: ['Roja', 'Negra', 'Dorada', 'Celeste', 'Verde'], correcta: 'Verde',
      explica: 'Roja y negra cuentan una de menos y una de más; dorada mira los 83 ciclos y no lo que sobra; celeste es la última: no sobraría nada.' }),
  ];
  repite.ejemplos = EJEMPLOS_REP;
  juntar('lo-que-se-repite', EJEMPLOS_REP, [kRep('pulsera', 'RVNB', K_P6)]);
  // ---------- El cubo que crece (laboratorio 3D, 15 nov: exploración libre, sin predicciones) ----------
  // Un cubo de n × n × n cubitos pintado por fuera. El motor de plantillas/cubitos-pintados cuenta, cubito por cubito,
  // cuántas caras pintadas tiene cada uno; la pieza rm-cubitos-3d dibuja esas mismas caras (regla 1). Separar deja ver
  // los de adentro; resaltar apaga los demás. La inducción: con n = 2, 3, 4… cada grupo crece a su manera.
  const TONO_CARA = ['blanca', 'pintada', 'base'];
  const pintadoDe = val => MC.pintado({ dims: [val.n, val.n, val.n] });
  const cuantos = (val, k) => pintadoDe(val).cuenta[k];
  const VER = [{ valor: -1, texto: 'Todos' }, { valor: 3, texto: '3 caras' }, { valor: 2, texto: '2 caras' }, { valor: 1, texto: '1 cara' }, { valor: 0, texto: 'Sin pintar' }];
  function datosCubo(val) {
    const r = pintadoDe(val), c = r.cuenta, n3 = val.n * val.n * val.n;
    return {
      celdas: r.celdas.map((p, i) => (val.ver === -1 || r.pintadas[i] === val.ver
        ? { p, caras: r.porCara[i].map(x => ({ tono: TONO_CARA[x] })) } : { p, tono: 'tenue' })),
      separar: val.sep / 4,
      marcas: [{ p: [val.n / 2, -0.4, 0], texto: `n = ${val.n}`, color: 'c-o' }],
      alt: `Cubo de ${val.n} × ${val.n} × ${val.n} = ${n3} cubitos, pintado por fuera: ${c[3]} con tres caras pintadas, ${c[2]} con dos, ${c[1]} con una y ${c[0]} sin pintar.`,
    };
  }
  const mesaCubo = {
    id: 'cubo-que-crece', titulo: 'El cubo que crece', pieza: 'rm-cubitos-3d',
    consigna: 'Gira el cubo pintado con el dedo. Cambia el lado, sepáralo y resalta un grupo: mira cómo crece cada uno.',
    controles: [
      { id: 'n', etiqueta: 'Lado (n)', color: 'c-o', min: 2, max: 6, paso: 1, inicio: 3, decimales: 0 },
      { id: 'sep', etiqueta: 'Separar', min: 0, max: 4, paso: 1, inicio: 0, decimales: 0 },
      { id: 'ver', etiqueta: 'Resaltar', opciones: VER },
    ],
    dibujo: val => ({ datos: datosCubo(val), estado: {} }),
    lectura: val => { const c = pintadoDe(val).cuenta; return [`${c[3]} con 3 · ${c[2]} con 2 · ${c[1]} con 1 · ${c[0]} sin pintar`]; },
    // Retos comprobados con el mismo motor que pinta las caras (docs/teoria.md §4d).
    invitaciones: [
      { texto: 'En el cubo de lado 4, separa los cubitos y resalta los que no tienen pintura.',
        logrado: val => val.n === 4 && val.sep >= 2 && val.ver === 0 && cuantos(val, 0) > 0,
        bien: 'Son 8 cubitos interiores: un cubo de lado 2 escondido. Lado n − 2, siempre.',
        pista: 'Lado 4, separa dos pasos o más y elige «Sin pintar».' },
      { texto: 'Busca el cubo que tiene 36 cubitos con dos caras pintadas.',
        logrado: val => cuantos(val, 2) === 36 && val.ver === 2,
        bien: 'Viven en las 12 aristas, 3 en cada una: 12 · (n − 2) = 36.',
        pista: 'Resalta «2 caras»: están en las aristas, sin contar las esquinas.' },
      { texto: 'Encuentra un cubo sin ningún cubito de dos caras pintadas.',
        logrado: val => cuantos(val, 2) === 0,
        bien: 'Con lado 2 todo es esquina: los 8 cubitos tienen tres caras.',
        pista: 'Achica el cubo lo más que puedas.' },
      { texto: 'Haz que los de una cara pintada sean más que los de dos.',
        logrado: val => cuantos(val, 1) > cuantos(val, 2),
        bien: 'Desde lado 5 ganan las caras: un cuadrado crece más rápido que una recta.',
        pista: 'Agranda el cubo y compara los dos números de la lectura.' },
      { texto: 'Guarda los cubos de lado 3 y 4: ¿qué grupo creció más?',
        logrado: (val, guardados) => guardados.some(x => x.n === 3) && guardados.some(x => x.n === 4),
        bien: 'Las esquinas siguen en 8; los de una cara saltan de 6 a 24.',
        pista: 'Guarda el de lado 3, sube a 4 y guarda otra vez.' },
    ],
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1 (idea 1): cuatro formas de fósforos hasta la figura 8; los retos cuentan los fósforos del dibujo.
  const fosLab = val => FORMAS[val.forma].palitos(val.k);
  const MAS_BAJO_20 = Math.max(...Object.keys(FORMAS).flatMap(forma => rango(1, 8).map(k => fos(forma, k))).filter(x => x < 20));
  const mesaFosforos = {
    id: 'palitos-libres', titulo: 'Cuatro formas de crecer', pieza: PZ,
    consigna: 'Elige la forma y cuántas figuras tiene la fila. Compara lo que agrega cada forma en cada paso.',
    controles: [
      { id: 'forma', etiqueta: 'Forma', opciones: [{ valor: 'cuadrado', texto: 'Cuadrados' }, { valor: 'triangulo', texto: 'Triángulos' }, { valor: 'casita', texto: 'Casitas' }, { valor: 'doble', texto: 'Dos pisos' }] },
      { id: 'k', etiqueta: 'Figuras', min: 1, max: 8, paso: 1, inicio: 3, decimales: 0 },
    ],
    dibujo: val => ({ datos: { escena: 'fosforos', alto: 2, unidad: 34, figuras: [{ palitos: fosLab(val) }] }, estado: {} }),
    lectura: val => { const F = FORMAS[val.forma]; return [`${f0(F.primero)} + ${f0(F.agrega)} × ${f0(val.k - 1)} = ${pl(fos(val.forma, val.k), FOS)}`]; },
    invitaciones: [
      { texto: 'Arma una fila de exactamente 22 fósforos.', logrado: val => fosLab(val).length === 22,
        bien: 'Hay dos maneras: 7 cuadrados o 4 columnas de dos pisos. ¿Las encontraste?' },
      { texto: 'Guarda dos formas distintas que usen el mismo número de fósforos.',
        logrado: (val, g) => g.some(x => g.some(y => y.forma !== x.forma && fosLab(y).length === fosLab(x).length)),
        bien: 'Mismo total, distinta construcción: el número solo no dice cómo creció.' },
      { texto: 'Busca la fila con más fósforos que siga por debajo de 20.', logrado: val => fosLab(val).length === MAS_BAJO_20,
        bien: `${f0(MAS_BAJO_20)} fósforos. Lo que agrega cada paso decide a qué totales se llega.` },
    ],
  };
  // Mesa 2 (idea 2): la torta hasta 7 velitas, el caso que la idea no deja jugar.
  const duplica = k => pedazos(k) === 2 ** (k - 1);
  const PRIMERA_FALLA = rango(1, 7).find(k => !duplica(k));
  const mesaTorta = {
    id: 'seis-puntos', titulo: 'La torta hasta 7 velitas', pieza: PZ,
    consigna: 'Pon hasta 7 velitas en el borde de la torta. Compara los pedazos con lo que daría duplicar.',
    controles: [{ id: 'k', etiqueta: 'Velitas', min: 1, max: 7, paso: 1, inicio: 4, decimales: 0 }],
    dibujo: val => ({ datos: { escena: 'torta', velitas: val.k, titulo: 'Torta del cumpleaños' }, estado: {} }),
    lectura: val => [`${f0(val.k)} ${val.k === 1 ? 'velita' : 'velitas'}: ${pl(pedazos(val.k), ['pedazo', 'pedazos'])}; duplicar daría ${f0(2 ** (val.k - 1))}`],
    invitaciones: [
      { texto: 'Encuentra el primer número de velitas en que «se duplica» deja de valer.', logrado: val => val.k === PRIMERA_FALLA,
        bien: 'Cinco casos seguidos cumplían, y aun así el sexto la descarta: un contraejemplo basta.' },
      { texto: 'Consigue exactamente 16 pedazos.', logrado: val => pedazos(val.k) === 16,
        bien: 'Con 5 velitas todavía se duplica: el patrón aguanta hasta aquí.' },
      { texto: 'Guarda un caso que cumpla «se duplica» y otro que no.',
        logrado: (val, g) => g.some(x => duplica(x.k)) && g.some(x => !duplica(x.k)),
        bien: 'Los dos caben en la misma mesa: el patrón era una hipótesis.' },
    ],
  };
  // Mesa 3 (idea 4): tres pirámides de latas y la fila que se elige.
  const latasLab = val => piramide(val.tipo, 6, { resaltar: [{ fila: val.k - 1, papel: 'dato' }] }).datos;
  const mesaLatas = {
    id: 'latas-libres', titulo: 'Tres pirámides de latas', pieza: PZ,
    consigna: 'Elige cómo se numeran las latas y una fila. Compara las sumas de las filas en cada pirámide.',
    controles: [
      { id: 'tipo', etiqueta: 'Números', opciones: [{ valor: 'impares', texto: 'Impares' }, { valor: 'naturales', texto: '1, 2, 3…' }, { valor: 'pascal', texto: 'Suma de arriba' }] },
      { id: 'k', etiqueta: 'Fila', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 },
    ],
    dibujo: val => ({ datos: latasLab(val), estado: {} }),
    lectura: val => [`Fila ${f0(val.k)}: suma ${f0(filaS(val.tipo, val.k))}`],
    invitaciones: [
      { texto: 'En la pirámide de impares, busca la fila que suma 216.', logrado: val => val.tipo === 'impares' && filaS('impares', val.k) === 216,
        bien: 'La fila 6: 6 × 6 × 6 = 216.' },
      { texto: 'En la pirámide de sumas de arriba, busca la fila que suma 32.', logrado: val => val.tipo === 'pascal' && filaS('pascal', val.k) === 32,
        bien: 'La fila 6: cada número pasa a las dos latas de abajo.' },
      { texto: 'Guarda la misma fila en dos pirámides distintas y compara sus sumas.',
        logrado: (val, g) => g.some(x => g.some(y => y.k === x.k && y.tipo !== x.tipo)),
        bien: 'La misma fila suma distinto: la regla depende de cómo se numera.' },
    ],
  };
  // Mesa 4 (idea 6): el largo del ciclo y el lugar, a elección.
  const pulLab = val => C6.slice(0, val.L);
  const mesaPulsera = {
    id: 'pulsera-libre', titulo: 'Pulseras de otros ciclos', pieza: PZ,
    consigna: 'Elige cuántos colores tiene el ciclo y un lugar. Mira cuántos ciclos caben y cuántas sobran.',
    controles: [
      { id: 'L', etiqueta: 'Colores del ciclo', min: 3, max: 6, paso: 1, inicio: 4, decimales: 0 },
      { id: 'k', etiqueta: 'Lugar', min: 1, max: 36, paso: 1, inicio: 10, decimales: 0 },
    ],
    dibujo: val => ({ datos: figPul(pulLab(val), 36, { porFila: 12, marcas: [{ i: val.k - 1, papel: 'dato' }] }).datos, estado: {} }),
    lectura: val => { const { q, r } = conResto(val.L, val.k); return [`Lugar ${f0(val.k)}: ${f0(q)} de ${f0(val.L)} y ${sobraTxt(r)}, ${COLORES[toca(pulLab(val), val.k)][0]}`]; },
    invitaciones: [
      { texto: 'Haz que el lugar 30 sea la última mostacilla de su ciclo.', logrado: val => val.k === 30 && 30 % val.L === 0,
        bien: 'El largo del ciclo divide a 30 sin que sobre nada.' },
      { texto: 'Con un ciclo de 5, busca un lugar mayor que 30 con mostacilla roja.', logrado: val => val.L === 5 && val.k > 30 && toca(pulLab(val), val.k) === 'R',
        bien: '31 o 36: sobra 1, la primera del ciclo.' },
      { texto: 'Guarda el mismo lugar con dos ciclos distintos que den el mismo color.',
        logrado: (val, g) => g.some(x => g.some(y => y.k === x.k && y.L !== x.L && toca(pulLab(y), y.k) === toca(pulLab(x), x.k))),
        bien: 'Distintos ciclos pueden coincidir en un lugar: miraste lo que sobra en cada uno.' },
    ],
  };

  // ---------- Glosario (docs/teoria.md, 4d): lo que la unidad estrena en el curso, de 2 a 4 términos por idea ----------
  // Ningún ejemplo trae la respuesta de una predicción (61, 31, 110, 1000, 225, verde): regla glosario-predice.
  // «Número primo» y «residuo» se estrenan en Certezas y en Cronometría y calendarios; aquí solo se marcan.
  const GLOSARIO = [
    // Idea 1
    { termino: 'sucesión', def: 'Lista ordenada de números o figuras: primero, segundo, tercero… cada uno en su lugar.', simple: 'Una lista en orden, donde cada cosa tiene su puesto.',
      formas: ['sucesión', 'sucesiones'], ejemplos: ['2, 4, 6, 8 es una sucesión: el 6 va en el tercer lugar.', 'Las figuras 1, 2 y 3 de fósforos forman una sucesión.', 'En una sucesión importa el orden: 8, 6, 4, 2 es otra.'], ver: ['término general'] },
    { termino: 'término general', def: 'Cuenta con n que da cualquier elemento de la sucesión sin calcular los anteriores.', simple: 'La cuenta que te da el caso que quieras, sin hacer los otros.',
      ejemplos: ['Si cada figura tiene 2 × n fichas, la figura 7 tiene 14.', 'Con n + 5, el lugar 10 vale 15.', 'Con n × n, la figura 6 tiene 36.'], ver: ['sucesión'] },
    // Idea 2
    { termino: 'inducción', def: 'Pasar de unos casos vistos a una regla general. Da una hipótesis, todavía no una prueba.', simple: 'Sacar una regla mirando unos cuantos casos.',
      formas: ['inducción'], ejemplos: ['Ver 2, 4, 6 y decir «van de dos en dos» es inducción.', 'Contar las figuras 1, 2 y 3 y proponer cuánto tendrá la 9.', 'La inducción propone; el argumento prueba.'], ver: ['hipótesis'] },
    { termino: 'hipótesis', def: 'Regla que se propone a partir de algunos casos y que todavía falta probar.', simple: 'Lo que crees que pasa, pero todavía no está probado.',
      ejemplos: ['«Todos los cuervos son negros», después de ver diez negros.', '«Sigue el 8», después de ver 1, 2 y 4.', 'Si se explica por cómo se arma cada caso, deja de ser hipótesis.'], ver: ['contraejemplo'] },
    { termino: 'contraejemplo', def: 'Un caso que cumple las condiciones pero no la regla. Basta uno para descartarla.', simple: 'El caso que demuestra que una regla falla.',
      formas: ['contraejemplo', 'contraejemplos'], ejemplos: ['El 9 es contraejemplo de «todo impar es primo».', 'Un cuervo blanco es contraejemplo de «todos los cuervos son negros».', 'Un solo contraejemplo basta, aunque mil casos cumplan.'], ver: ['hipótesis'] },
    // Idea 3
    { termino: 'crecimiento lineal', def: 'Forma de crecer de una sucesión que agrega siempre lo mismo en cada paso.', simple: 'Crecer sumando siempre lo mismo.',
      ejemplos: ['3, 7, 11, 15 tiene crecimiento lineal: agrega 4 cada vez.', '2, 6, 12, 20 no lo tiene: agrega 4, 6, 8.', 'Una fila de cuadrados de fósforos crece así: 3 por cuadrado.'], ver: ['número triangular'] },
    { termino: 'número triangular', def: 'Número de monedas que forman un triángulo con filas de 1, 2, 3… monedas.', simple: 'Las monedas que caben en un triángulo bien armado.',
      formas: ['número triangular', 'números triangulares'], ejemplos: ['1, 3, 6 y 10 son números triangulares.', 'Con filas de 1, 2, 3, 4 y 5 monedas salen 15.', 'Cada número triangular agrega una fila más larga que la anterior.'], ver: ['crecimiento lineal'] },
    // Idea 4
    { termino: 'arreglo triangular', def: 'Números puestos en filas que crecen de uno en uno: 1 arriba, 2 debajo, 3 debajo…', simple: 'Números apilados como una pirámide.',
      formas: ['arreglo triangular', 'arreglos triangulares'], ejemplos: ['Una pirámide de latas numeradas es un arreglo triangular.', 'En un arreglo triangular, la fila 7 tiene 7 números.', 'Se pregunta por la suma, el primero o el último de una fila.'], ver: ['al cubo'] },
    { termino: 'al cubo', def: 'Un número multiplicado tres veces por sí mismo: n × n × n.', simbolo: 'n³', simple: 'Multiplicar el número por sí mismo, tres veces.',
      ejemplos: ['2 al cubo: 2 × 2 × 2 = 8.', '3³ = 27.', '5 al cubo es 125.'] },
    { termino: 'patrón', def: 'Algo que se repite o cambia igual de un caso al siguiente y deja proponer el que viene.', simple: 'Lo que se repite y te deja adivinar lo que sigue.',
      formas: ['patrón', 'patrones'], ejemplos: ['En 5, 10, 15, el patrón es sumar 5.', 'En una pulsera roja, verde, roja, verde, el patrón es alternar.', 'Un patrón visto es una hipótesis hasta que se explica.'], ver: ['hipótesis'] },
    // Idea 5
    { termino: 'suma de cifras', def: 'Lo que da sumar los dígitos de un número.', simple: 'Sumar los dígitos de un número, uno por uno.',
      ejemplos: ['La suma de cifras de 47 es 4 + 7 = 11.', 'La de 1000 es 1.', 'La de 9801 es 18.'] },
    { termino: 'caso de prueba', def: 'Caso que no se usó para encontrar un patrón y sirve para comprobarlo.', simple: 'Un caso extra para ver si la regla aguanta.',
      formas: ['caso de prueba', 'casos de prueba'], ejemplos: ['Si la regla salió de las figuras 1, 2 y 3, la 4 es un caso de prueba.', 'Si el caso de prueba falla, la regla se descarta.', 'Que cumpla un caso de prueba no prueba la regla: solo no la descarta.'], ver: ['contraejemplo'] },
    // Idea 6
    { termino: 'ciclo', def: 'Grupo de términos que se repite igual, siempre en el mismo orden.', simple: 'Lo que se repite igual, una y otra vez.',
      formas: ['ciclo', 'ciclos'], ejemplos: ['En 3, 5, 3, 5, 3, 5 el ciclo es 3, 5.', 'Los días de la semana forman un ciclo de 7.', 'Una pulsera roja, negra, roja, negra tiene un ciclo de 2.'], ver: ['patrón'] },
    { termino: 'cifra de las unidades', def: 'La última cifra de un número, la de la derecha.', simple: 'El último dígito de un número.',
      ejemplos: ['La cifra de las unidades de 2026 es 6.', 'La de 7 × 8 = 56 es 6.', 'La de 120 es 0.'] },
    // El laboratorio (cubo pintado)
    { termino: 'cara pintada', formas: ['cara pintada', 'caras pintadas'], simple: 'La cara de un cubito que quedó por fuera.',
      def: 'Cara de un cubito que quedaba por fuera del cuerpo cuando se pintó; las de adentro quedan sin pintar.',
      ejemplos: ['En un cubo de 3 × 3 × 3, el cubito de una esquina tiene 3 caras pintadas.', 'Un cubito del medio de una cara tiene 1 cara pintada.', 'Las caras que tocan a otro cubito no se pintan.'], ver: ['cubito interior'] },
    { termino: 'cubito interior', formas: ['cubito interior', 'cubitos interiores'], simple: 'Un cubito escondido adentro, sin pintura.',
      def: 'Cubito que no toca ninguna cara del cubo grande: no recibe pintura.',
      ejemplos: ['Cubo de lado 5: los interiores forman un cubo de lado 3, con 27 cubitos.', 'Un cubo de lado 2 no tiene cubitos interiores.', 'En el cubo de lado 4 hay 8 interiores.'], ver: ['cara pintada'] },
  ];

  const IDEAS = [figuras, tres, cada, arreglo, larga, repite];
  return {
    unidad: 'razonamiento-matematico.razonamiento-inductivo',
    version: '0.4.1',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-patrones.js', '/plantillas/cubitos-pintados/motor.js', '/nucleo/kit/piezas/rm-cubitos-3d.js'],
    letras: { n: 'el número de la figura, de la fila o del caso' },
    glosario: GLOSARIO,
    laboratorio: [mesaCubo, mesaFosforos, mesaTorta, mesaLatas, mesaPulsera],
    // A qué idea pertenece cada mesa (Gerson, 16 nov). La mesa de los impares que no empiezan en 1 salió con su idea.
    laboratorioIdeas: { 'cubo-que-crece': ['cada-caso-con-su-lugar'], 'palitos-libres': ['figuras-que-crecen'], 'seis-puntos': ['tres-casos-no-prueban'],
      'latas-libres': ['arreglo-triangular'], 'pulsera-libre': ['lo-que-se-repite'] },
    historia: {
      texto: 'En 1739 y 1748, David Hume preguntó qué justifica pasar de lo observado a lo que no se ha observado. En matemática, la duda tiene un ejemplo famoso: n × n + n + 41 da números primos de n = 0 a n = 39, y falla en n = 40. Cuarenta casos no probaban nada.',
      pregunta: '¿Cuántos casos hacen falta para estar seguro?',
      fuente: { titulo: 'The Problem of Induction · Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/induction-problem/' },
    },
    ideas: IDEAS,
  };
});
