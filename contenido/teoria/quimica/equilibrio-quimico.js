/*
 * Teoría de «Equilibrio químico» (quimica.equilibrio-quimico). Molde: docs/teoria.md y
 * contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 13), docs/teoria/fuentes/historia-ecuaciones-2.pdf y las
 * precisiones de Química del expediente: «el sistema responde en contra» se reemplaza por comparar Q con K, con gas
 * inerte a V constante y catalizador como contrastes. Errores: docs/investigacion/equilibrio-acidos-electroquimica-
 * ideas-erroneas.md (EQ) y estequiometria (ES); los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: reconocer un equilibrio por sus rapideces, escribir K, usar el grado de reacción y predecir la respuesta
 *     a un cambio comparando Q con K.
 *   Persona y condiciones: postulante de 5.º, celular de gama baja a 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: calcula Kc, Kp y concentraciones de equilibrio con α, y dice hacia dónde evoluciona una
 *     mezcla perturbada, incluidos los casos que no se desplazan.
 *   Orden de atención: 1.º la figura (curvas, partículas o la recta Q–K) · 2.º la lectura en vivo · acción: probar casos.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿en equilibrio todo es igual?, ¿se detuvo?, ¿todo cambio desplaza?, ¿el catalizador da más producto?
 *
 * Colores (regla 4): concentración [ ] naranja c-o, t tiempo turquesa c-i, r rapidez rojo c-h, K y Q verde c-d (en la
 * recta, K va en verde y Q en naranja porque es la concentración actual). Las partículas van en tinta: N lleno, O hueco.
 * El valor de K al calentar (4) es ilustrativo: solo dice que K baja en una reacción exotérmica.
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §13.2 y §13.3; R = 0,082 atm·L/(mol·K).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const t = { v: 'c-i', t: 't' }, r = { v: 'c-h', t: 'r' }, K = { v: 'c-d', t: 'K' }, Q = { v: 'c-d', t: 'Q' };
  const Kc = { sub: [K, 'c'] }, Kp = { sub: [K, 'p'] };
  const cc = x => ({ v: 'c-o', t: `[${x}]` });
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.de = l => l[Math.floor(rr() * l.length)];
    return rr;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const muestra = (fn, a, b, k = 40) => Array.from({ length: k + 1 }, (_, i) => { const x = a + (b - a) * i / k; return [x, fn(x)]; });
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function cien(x, d = 2) {
    let e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e;
    if (Math.abs(+m.toFixed(d)) >= 10) { e += 1; m /= 10; }
    return `${f(m, d)} × 10${String(e).split('').map(c => SUP[c]).join('')}`;
  }
  const fijo = (x, d) => Math.round(x * 10 ** d) / 10 ** d;

  // ---------- Idea 1: equilibrio dinámico ----------
  // Cambia: el instante que se mira · Permanece: A ⇌ B con kd = 0,30 y ki = 0,15 por minuto, y sus ejes · Progresa: las
  // dos rapideces se acercan hasta igualarse · Se reserva: que las concentraciones no se igualan · Debe verse: las
  // curvas planas a distinta altura.
  const KD = 0.3, KI = 0.15, AEQ = KI / (KD + KI);
  const cA = x => AEQ + (1 - AEQ) * Math.exp(-(KD + KI) * x), cB = x => 1 - cA(x);
  const ejesEq = (extra = {}) => Object.assign({
    x: { min: 0, max: 10, paso: 2, nombre: 't', unidad: 'min', decimales: 0, color: 'i' },
    y: { min: 0, max: 1, paso: 0.2, nombre: '[ ]', unidad: 'mol/L', decimales: 1, color: 'o' },
    curvas: [{ puntos: muestra(cA, 0, 10), color: 'o', rotulo: 'A', en: [6, cA(6)] }, { puntos: muestra(cB, 0, 10), rotulo: 'B', en: [6, cB(6)] }],
    alt: `Reacción A ⇌ B que empieza solo con A (1 mol/L): A baja y B sube hasta quedar planas en ${f(AEQ, 2)} y ${f(1 - AEQ, 2)} mol/L.`,
  }, extra);
  const dinamico = {
    id: 'equilibrio-dinamico',
    titulo: 'Equilibrio: dos rapideces iguales',
    temas: ['Reacciones reversibles y equilibrio dinámico'],
    pieza: 'ejes',
    juega: {
      consigna: 'La reacción A ⇌ B empieza solo con A. Mueve el tiempo y compara la rapidez directa (A → B) con la inversa (B → A).',
      voz: 'Mira las dos rapideces, no solo las curvas.',
      controles: [{ id: 't', etiqueta: 't', color: 'c-i', min: 0, max: 10, paso: 1, inicio: 0, unidad: 'min', decimales: 0 }],
      dibujo: val => ({ datos: ejesEq({ puntos: [{ x: val.t, y: cA(val.t), color: 'o', guias: true }, { x: val.t, y: cB(val.t) }] }), estado: {} }),
      lectura: val => [r, ` directa ${f(KD * cA(val.t), 3)} · inversa ${f(KI * cB(val.t), 3)} mol/(L·min)`],
      minimo: 3,
    },
    predice: {
      pregunta: 'A los 10 minutos las dos rapideces ya son iguales. ¿Cómo son en ese momento las concentraciones de A y de B?',
      voz: 'Anota tu predicción y después miramos las curvas.',
      opciones: [
        { id: 'c', texto: 'Constantes, pero distintas entre sí', correcta: true },
        { id: 'iguales', texto: 'Iguales: por eso se llama equilibrio', error: 'EQ1', siFuera: 'Lo que se iguala son las rapideces. Las cantidades quedan donde K lo dice.' },
        { id: 'cero', texto: 'Ya no cambian porque la reacción se detuvo', error: 'EQ3', siFuera: 'No cambian, bien visto. Pero las dos reacciones siguen ocurriendo al mismo ritmo.' },
        { id: 'oscilan', texto: 'Suben y bajan, turnándose', error: 'EQ2', siFuera: 'Se transforman en ambos sentidos a la vez, no por turnos; por eso se ven quietas.' },
      ],
      dibujo: { datos: ejesEq({ curvas: ejesEq().curvas.map(c => Object.assign({}, c, { puntos: c.puntos.filter(p => p[0] <= 4) })) }), estado: {} },
      revelar: { datos: ejesEq({ puntos: [{ x: 10, y: cA(10), color: 'o', rotulo: `${f(cA(10), 2)}` }, { x: 10, y: cB(10), rotulo: `${f(cB(10), 2)}` }] }), estado: {} },
      coincide: 'Coincide: las curvas se aplanan a distinta altura.',
      noCoincide: 'Las curvas se aplanan, cada una a su altura: B queda en el doble de A.',
    },
    mira: {
      datos: ejesEq({ puntos: [{ x: 0, y: 1, color: 'o', desde: 1 }, { x: 8, y: cA(8), color: 'o', rotulo: f(cA(8), 2), desde: 3 }, { x: 8, y: cB(8), rotulo: f(cB(8), 2), desde: 3 }] }),
      voz: 'Sigamos las dos rapideces.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Al inicio solo hay A: la directa va rápido y la inversa es cero.', ecuacion: [r, ' directa = 0,30 · 1 = 0,30'] },
        { estado: { corte: 2 }, texto: 'A baja y B sube: la directa se frena y la inversa crece.' },
        { estado: { corte: 3 }, texto: 'Cuando se igualan, las concentraciones dejan de cambiar.', ecuacion: [`0,30 · ${f(AEQ, 2)} = 0,15 · ${f(1 - AEQ, 2)} = ${f(KD * AEQ, 2)}`] },
        { estado: { corte: 3 }, texto: 'Las cantidades quedan distintas; su cociente es la constante K.', ecuacion: [K, ' = ', { frac: [cc('B'), cc('A')] }, ` = ${f((1 - AEQ) / AEQ, 0)}`] },
      ],
    },
    regla: {
      texto: 'En equilibrio, la reacción directa y la inversa siguen ocurriendo con la misma rapidez. Por eso las concentraciones no cambian, aunque no sean iguales.',
      ecuacion: [{ sub: [r, 'directa'] }, ' = ', { sub: [r, 'inversa'] }],
      condicion: 'en un sistema cerrado y a temperatura constante; se llega igual empezando desde los reactivos o desde los productos.',
      voz: 'Quieto por fuera, en movimiento por dentro.',
    },
    ahoraTu: {
      voz: 'Escribe K con las concentraciones de equilibrio.',
      generar(s) {
        const R = azar(s), k = R.de([1, 2, 3, 4, 9]), c0 = fijo(R.ent(2, 10) * 0.1, 1), b = c0 * k / (1 + k);
        return {
          pregunta: [`En A ⇌ B, `, K, ` = ${f(k, 0)}. Empiezas solo con A, a ${f(c0, 1)} mol/L. ¿Cuánto vale `, cc('B'), ' en el equilibrio?'],
          opciones: opciones(b, [
            { id: 'mitad', valor: c0 / 2, error: 'EQ1', siFuera: 'La mitad sería cierto solo con K = 1. Aquí K dice otra proporción.' },
            { id: 'todo', valor: c0, error: 'EQ3', siFuera: 'Eso supone que A se acaba. En equilibrio queda algo de A.' },
            { id: 'kc0', valor: k * c0 / (k + 2), error: 'QM-K', siFuera: 'Revisa la suma: [A] + [B] debe dar lo que había al inicio.' },
          ], x => `${f(x, 3)} mol/L`),
          solucion: { texto: `[B] = K·[A] y [A] + [B] = ${f(c0, 1)}.`, ecuacion: [cc('B'), ` = ${f(c0, 1)} · ${f(k, 0)} / ${f(1 + k, 0)} = ${f(b, 3)} mol/L`] },
        };
      },
    },
  };

  // ---------- Idea 2: Kc y Kp ----------
  // Cambia: la mezcla de equilibrio · Permanece: 2 NO₂ ⇌ N₂O₄ a la misma temperatura; cada bolita, 0,1 mol/L · Progresa:
  // más NO₂ y mucho más N₂O₄ · Se reserva: Kp y el Δn de gases · Debe verse: el cociente con exponente no cambia.
  const ATOMOS = { N: { estilo: 'lleno', r: 5 }, O: { estilo: 'hueco', r: 4.5 }, H: { estilo: 'punto', r: 4 }, P: { color: 'o', estilo: 'lleno', r: 5 }, Cl: { estilo: 'hueco', r: 4 } };
  const ESPECIES = {
    NO2: [['N', 0, -1], ['O', -6, 4], ['O', 6, 4]], N2O4: [['N', -3.5, 0], ['N', 3.5, 0], ['O', -8, -5], ['O', -8, 5], ['O', 8, -5], ['O', 8, 5]],
    N2: [['N', -4, 0], ['N', 4, 0]], H2: [['H', -3.5, 0], ['H', 3.5, 0]], NH3: [['N', 0, 0], ['H', -7, 5], ['H', 7, 5], ['H', 0, -8]],
    PCl5: [['P', 0, 0], ['Cl', -8, 0], ['Cl', 8, 0], ['Cl', 0, -8], ['Cl', -5, 7], ['Cl', 5, 7]], PCl3: [['P', 0, 0], ['Cl', -8, 2], ['Cl', 8, 2], ['Cl', 0, -8]], Cl2: [['Cl', -4, 0], ['Cl', 4, 0]],
  };
  const lupa = (cajas, extra = {}) => ({ datos: Object.assign({ atomos: ATOMOS, especies: ESPECIES, alto: 150, separacion: 24, cajas }, extra), estado: {} });
  const KN = 10;                                                   // Kc de 2 NO₂ ⇌ N₂O₄ en el modelo
  const MEZCLAS = { 1: [1, 1], 2: [2, 4], 3: [3, 9] };             // bolitas de NO₂ y de N₂O₄ (0,1 mol/L cada una)
  const mezcla = k => { const [a, b] = MEZCLAS[k]; return lupa([{ titulo: 'Equilibrio', forma: 'caja', particulas: [{ e: 'NO2', n: a }, { e: 'N2O4', n: b }], rotulo: `NO₂ ${f(a / 10, 1)} · N₂O₄ ${f(b / 10, 1)} mol/L` }], { separacion: 30 }); };
  const kc = {
    id: 'kc-kp',
    titulo: 'La constante: Kc y Kp',
    temas: ['Kc y Kp'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Tres mezclas de 2 NO₂ ⇌ N₂O₄ en equilibrio, a la misma temperatura. Cada bolita es 0,1 mol/L. Compara el cociente de cada una.',
      voz: 'Prueba con y sin el exponente 2.',
      controles: [{ id: 'k', etiqueta: 'Mezcla', opciones: [1, 2, 3].map(k => ({ valor: k, texto: `Mezcla ${k}` })) }],
      dibujo: val => mezcla(val.k),
      lectura: val => { const [a, b] = MEZCLAS[val.k]; return [cc('N₂O₄'), ' / ', { sup: [cc('NO₂'), '2'] }, ` = ${f(b / 10, 1)} / ${f((a / 10) ** 2, 2)} = ${f((b / 10) / (a / 10) ** 2, 0)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Para N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g), ¿cómo se relaciona ', Kp, ' con ', Kc, '?'],
      voz: 'Cuenta las moléculas de gas a cada lado.',
      opciones: [
        { id: 'c', texto: [Kp, ' = ', Kc, ' · ', { sup: ['(RT)', '−2'] }], correcta: true },
        { id: 'igual', texto: [Kp, ' = ', Kc, ', siempre'], error: 'QM-KP', siFuera: 'Son iguales solo si hay las mismas moléculas de gas a cada lado (Δn = 0).' },
        { id: 'signo', texto: [Kp, ' = ', Kc, ' · ', { sup: ['(RT)', '2'] }], error: 'QM-DN', siFuera: 'El 2 está bien. El signo sale de productos menos reactivos: 2 − 4.' },
        { id: 'todo', texto: [Kp, ' = ', Kc, ' · ', { sup: ['(RT)', '6'] }], error: 'QM-DN', siFuera: 'Eso suma todos los coeficientes. Δn resta reactivos de productos.' },
      ],
      dibujo: lupa([{ titulo: 'Reactivos', forma: 'caja', particulas: [{ e: 'N2', n: 1 }, { e: 'H2', n: 3 }] }, { titulo: 'Productos', forma: 'caja', particulas: [{ e: 'NH3', n: 2 }] }], { flechas: true }),
      revelar: lupa([{ titulo: 'Reactivos', forma: 'caja', particulas: [{ e: 'N2', n: 1 }, { e: 'H2', n: 3 }], rotulo: '4 moléculas de gas' }, { titulo: 'Productos', forma: 'caja', particulas: [{ e: 'NH3', n: 2 }], rotulo: '2 de gas' }], { flechas: true }),
      coincide: 'Coincide: Δn = 2 − 4 = −2.',
      noCoincide: 'Δn = 2 − 4 = −2: el exponente es −2.',
    },
    mira: {
      datos: mezcla(3).datos,
      voz: 'Escribamos K con orden: productos arriba, reactivos abajo.',
      pasos: [
        { estado: {}, texto: 'Kc: productos arriba y reactivos abajo, cada uno elevado a su coeficiente.', ecuacion: [Kc, ' = ', { frac: [cc('N₂O₄'), { sup: [cc('NO₂'), '2'] }] }] },
        { estado: {}, texto: 'En esta mezcla: 0,9 entre 0,3 al cuadrado.', ecuacion: [Kc, ` = 0,9 / 0,09 = ${f(0.9 / 0.09, 0)}`] },
        { estado: {}, texto: 'Sólidos y líquidos puros no entran en K.', ecuacion: ['CaCO₃(s) ⇌ CaO(s) + CO₂(g):   ', Kc, ' = ', cc('CO₂')] },
        { estado: {}, texto: 'Con gases, Kp usa presiones parciales; Δn = 1 − 2 = −1.', ecuacion: [Kp, ' = ', Kc, ' · ', { sup: ['(RT)', 'Δn'] }, ` = 10 · (0,082 · 298)⁻¹ = ${f(KN / (0.082 * 298), 3)}`] },
      ],
    },
    regla: {
      texto: 'K es el cociente de las concentraciones de equilibrio, productos sobre reactivos, cada una elevada a su coeficiente. Sólidos y líquidos puros no entran.',
      ecuacion: [Kp, ' = ', Kc, ' · ', { sup: ['(RT)', 'Δn'] }],
      condicion: 'Δn: moles de gas de productos menos reactivos; R = 0,082 atm·L/(mol·K), T en kelvin. K solo cambia con T.',
      voz: 'Coeficientes como exponentes; sólidos fuera.',
    },
    ahoraTu: {
      voz: 'Escribe primero la expresión de K.',
      generar(s) {
        const R = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const h2 = fijo(R.ent(1, 5) * 0.1, 1), i2 = fijo(R.ent(1, 5) * 0.1, 1), hi = fijo(R.ent(4, 12) * 0.1, 1), k = hi * hi / (h2 * i2);
          return {
            pregunta: [`En H₂ + I₂ ⇌ 2 HI, en equilibrio: [H₂] = ${f(h2, 1)}, [I₂] = ${f(i2, 1)} y [HI] = ${f(hi, 1)} mol/L. ¿Cuánto vale `, Kc, '?'],
            opciones: opciones(k, [
              { id: 'sin-exp', valor: hi / (h2 * i2), error: 'QM-EXP', siFuera: 'Falta elevar [HI] a su coeficiente, 2.' },
              { id: 'inv', valor: (h2 * i2) / (hi * hi), error: 'QM-INV', siFuera: 'Eso pone los reactivos arriba. K = productos / reactivos.' },
              { id: 'doble', valor: 2 * hi / (h2 * i2), error: 'QM-EXP', siFuera: 'El coeficiente va como exponente, no como factor.' },
            ], x => f(x, 2)),
            solucion: { texto: 'Productos arriba, reactivos abajo, con exponentes.', ecuacion: [Kc, ` = ${f(hi, 1)}² / (${f(h2, 1)} · ${f(i2, 1)}) = ${f(k, 2)}`] },
          };
        }
        if (tipo === 1) {
          const co2 = fijo(R.ent(1, 9) * 0.01, 2);
          return {
            pregunta: [`En CaCO₃(s) ⇌ CaO(s) + CO₂(g), en equilibrio hay [CO₂] = ${f(co2, 2)} mol/L y ${f(R.ent(5, 50), 0)} g de cada sólido. ¿Cuánto vale `, Kc, '?'],
            opciones: [
              { id: 'c', texto: `${f(co2, 2)}`, correcta: true },
              { id: 'falta', texto: 'No se puede: faltan las concentraciones de los sólidos', error: 'EQ13', siFuera: 'Los sólidos puros no entran en K: su «concentración» no cambia.' },
              { id: 'cuad', texto: `${f(co2 * co2, 4)}`, error: 'QM-EXP', siFuera: 'El coeficiente del CO₂ es 1: no se eleva al cuadrado.' },
            ],
            solucion: { texto: 'Solo el gas entra en la expresión.', ecuacion: [Kc, ` = [CO₂] = ${f(co2, 2)}`] },
          };
        }
        const T = R.de([300, 400, 500]), kcv = R.ent(2, 9);
        const dn = R.de([[-1, '2 NO₂ ⇌ N₂O₄'], [1, 'PCl₅ ⇌ PCl₃ + Cl₂'], [-2, 'N₂ + 3 H₂ ⇌ 2 NH₃']]);
        const kp = kcv * (0.082 * T) ** dn[0];
        return {
          pregunta: [`Para ${dn[1]} (todos gases), `, Kc, ` = ${f(kcv, 0)} a ${f(T, 0)} K. ¿Cuánto vale `, Kp, '? (R = 0,082)'],
          opciones: opciones(kp, [
            { id: 'igual', valor: kcv, error: 'QM-KP', siFuera: 'Serían iguales solo con Δn = 0.' },
            { id: 'signo', valor: kcv * (0.082 * T) ** -dn[0], error: 'QM-DN', siFuera: 'Ese es el signo de Δn al revés: productos menos reactivos.' },
          ], x => (x >= 0.01 ? f(x, 3) : cien(x))),
          solucion: { texto: `Δn = ${f(dn[0], 0)} (moles de gas de productos menos reactivos).`, ecuacion: [Kp, ` = ${f(kcv, 0)} · (0,082 · ${f(T, 0)})^(${f(dn[0], 0)})`] },
        };
      },
    },
  };

  // ---------- Idea 3: el grado de reacción α ----------
  // Cambia: α · Permanece: 10 moléculas de N₂O₄ al inicio, en 1 L · Progresa: por cada N₂O₄ que se disocia aparecen dos
  // NO₂ · Se reserva: que el total de moléculas cambia · Debe verse: inicio y equilibrio lado a lado, contados.
  const grado = {
    id: 'grado-reaccion',
    titulo: 'El grado de reacción α',
    temas: ['Grado de reacción'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Empiezas con 10 moléculas de N₂O₄ ⇌ 2 NO₂. Elige qué fracción α se disocia y cuenta qué hay en el equilibrio.',
      voz: 'Por cada una que se rompe, aparecen dos.',
      controles: [{ id: 'a', etiqueta: 'α', min: 0.1, max: 0.9, paso: 0.1, inicio: 0.2, decimales: 1 }],
      dibujo: val => {
        const x = Math.round(10 * val.a);
        return lupa([{ titulo: 'Inicio', forma: 'caja', particulas: [{ e: 'N2O4', n: 10 }], rotulo: '10 N₂O₄' },
          { titulo: 'Equilibrio', forma: 'caja', particulas: [{ e: 'N2O4', n: 10 - x }, { e: 'NO2', n: 2 * x }], rotulo: `${10 - x} N₂O₄ · ${2 * x} NO₂` }], { flechas: true, separacion: 25 });
      },
      lectura: val => { const x = Math.round(10 * val.a); return [`Quedan ${10 - x} N₂O₄ y hay ${2 * x} NO₂: ${10 + x} moléculas`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'En un recipiente de 1 L hay 1 mol de PCl₅. Se disocia el 50 % según PCl₅ ⇌ PCl₃ + Cl₂. ¿Cuántos moles de gas hay en total en el equilibrio?',
      voz: 'Arma la cuenta de inicio, cambio y equilibrio.',
      opciones: [
        { id: 'c', texto: '1,5 mol', correcta: true },
        { id: 'uno', texto: '1 mol: los moles se conservan', error: 'ES14', siFuera: 'Se conservan los átomos, no las moléculas. Cada PCl₅ da dos moléculas.' },
        { id: 'medio', texto: '0,5 mol', error: 'QM-ALFA', siFuera: '0,5 mol es lo que queda de PCl₅. Falta sumar lo que se formó.' },
        { id: 'dos', texto: '2 mol', error: 'QM-ALFA', siFuera: 'Sería 2 si se disociara todo. Solo se disocia la mitad.' },
      ],
      dibujo: lupa([{ titulo: 'Inicio', forma: 'caja', particulas: [{ e: 'PCl5', n: 6 }] }, { titulo: 'α = 0,5', forma: 'caja', particulas: [] }], { flechas: true }),
      revelar: lupa([{ titulo: 'Inicio', forma: 'caja', particulas: [{ e: 'PCl5', n: 6 }], rotulo: '6 moléculas' }, { titulo: 'α = 0,5', forma: 'caja', particulas: [{ e: 'PCl5', n: 3 }, { e: 'PCl3', n: 3 }, { e: 'Cl2', n: 3 }], rotulo: '9 moléculas' }], { flechas: true }),
      coincide: 'Coincide: 0,5 + 0,5 + 0,5 = 1,5 mol.',
      noCoincide: 'Quedan 0,5 de PCl₅ y se forman 0,5 de PCl₃ y 0,5 de Cl₂: 1,5 mol.',
    },
    mira: {
      datos: lupa([{ titulo: 'Inicio', forma: 'caja', particulas: [{ e: 'PCl5', n: 6, desde: 1 }] }, { titulo: 'Equilibrio', forma: 'caja', particulas: [{ e: 'PCl5', n: 3, desde: 2 }, { e: 'PCl3', n: 3, desde: 3 }, { e: 'Cl2', n: 3, desde: 3 }] }], { flechas: true }).datos,
      voz: 'Tres filas: inicio, cambio y equilibrio.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Inicio: c mol/L de PCl₅ y nada de productos.', ecuacion: ['PCl₅: c   ·   PCl₃: 0   ·   Cl₂: 0'] },
        { estado: { corte: 2 }, texto: 'Se disocia la fracción α: el PCl₅ pierde cα.', ecuacion: ['PCl₅: c(1 − α)'] },
        { estado: { corte: 3 }, texto: 'Cada uno que se rompe da un PCl₃ y un Cl₂.', ecuacion: ['PCl₃: cα   ·   Cl₂: cα'] },
        { estado: { corte: 3 }, texto: 'Con c = 1 mol/L y α = 0,5 sale la constante.', ecuacion: [Kc, ' = ', { frac: ['cα · cα', 'c(1 − α)'] }, ` = ${f(1 * 0.25 / 0.5, 1)}`] },
      ],
    },
    regla: {
      texto: 'El grado de reacción α es la fracción del reactivo que reacciona hasta el equilibrio. Con él se arma la tabla inicio–cambio–equilibrio y se calcula K.',
      ecuacion: ['α = ', { frac: ['lo que reacciona', 'lo que había'] }],
      condicion: 'el cambio de cada especie sigue sus coeficientes; el número total de moléculas puede cambiar aunque los átomos se conserven.',
      voz: 'Inicio, cambio, equilibrio: una fila por especie.',
    },
    ahoraTu: {
      voz: 'Arma la tabla antes de reemplazar.',
      generar(s) {
        const R = azar(s), c0 = fijo(R.ent(2, 20) * 0.1, 1), a = fijo(R.ent(1, 9) * 0.1, 1);
        if (s % 2) {
          const k = c0 * a * a / (1 - a);
          return {
            pregunta: [`PCl₅ ⇌ PCl₃ + Cl₂ empieza con ${f(c0, 1)} mol/L de PCl₅ y se disocia con α = ${f(a, 1)}. ¿Cuánto vale `, Kc, '?'],
            opciones: opciones(k, [
              { id: 'sin-resta', valor: c0 * a * a, error: 'QM-ALFA', siFuera: 'Falta dividir entre lo que queda de PCl₅: c(1 − α).' },
              { id: 'alfa', valor: a / (1 - a), error: 'QM-ALFA', siFuera: 'Faltan las concentraciones: α es una fracción, no una concentración.' },
              { id: 'sin-cuad', valor: c0 * a / (1 - a), error: 'QM-EXP', siFuera: 'Arriba van dos productos: cα · cα.' },
            ], x => f(x, 3)),
            solucion: { texto: 'Productos cα cada uno; queda c(1 − α) de PCl₅.', ecuacion: [Kc, ` = ${f(c0 * a, 2)}² / ${f(c0 * (1 - a), 2)} = ${f(k, 3)}`] },
          };
        }
        return {
          pregunta: [`N₂O₄ ⇌ 2 NO₂ empieza con ${f(c0, 1)} mol/L de N₂O₄ y se disocia con α = ${f(a, 1)}. ¿Cuánto vale [NO₂] en el equilibrio?`],
          opciones: opciones(2 * c0 * a, [
            { id: 'sin-coef', valor: c0 * a, error: 'QM-COEF', siFuera: 'Cada N₂O₄ da dos NO₂: falta el coeficiente 2.' },
            { id: 'queda', valor: c0 * (1 - a), error: 'QM-ALFA', siFuera: 'Eso es lo que queda de N₂O₄.' },
          ], x => `${f(x, 2)} mol/L`),
          solucion: { texto: 'Se forman dos NO₂ por cada N₂O₄ que reacciona.', ecuacion: [`[NO₂] = 2 · ${f(c0, 1)} · ${f(a, 1)} = ${f(2 * c0 * a, 2)} mol/L`] },
        };
      },
    },
  };

  // ---------- Idea 4: Le Chatelier es comparar Q con K ----------
  // Cambia: la perturbación · Permanece: 2 NO₂ ⇌ N₂O₄ con K = 10 y la mezcla 0,3 / 0,9 mol/L · Progresa: Q se aleja de
  // K y la reacción vuelve hacia K · Se reserva: el gas inerte a V fijo (Q no cambia) y el catalizador · Debe verse:
  // de qué lado de K cae Q.
  const qDe = (no2, n2o4) => n2o4 / (no2 * no2);
  const CAMBIOS = {
    'mas-no2': { texto: 'Añadir NO₂', no2: 0.6, n2o4: 0.9 },
    'menos-n2o4': { texto: 'Retirar N₂O₄', no2: 0.3, n2o4: 0.45 },
    'mas-n2o4': { texto: 'Añadir N₂O₄', no2: 0.3, n2o4: 1.8 },
    comprimir: { texto: 'Reducir V a la mitad', no2: 0.6, n2o4: 1.8 },
    expandir: { texto: 'Duplicar V', no2: 0.15, n2o4: 0.45 },
    calentar: { texto: 'Calentar', no2: 0.3, n2o4: 0.9, K: 4 },
  };
  const hacia = (q, k) => (Math.abs(q - k) < 1e-9 ? 'no se desplaza' : q < k ? 'hacia N₂O₄ (productos)' : 'hacia NO₂ (reactivos)');
  function rectaQK(q, k, extra = {}) {
    const lejos = Math.abs(q - k) > 1e-9;
    return Object.assign({
      min: 0, max: 25, paso: 1, cada: 5, decimales: 1, variable: '', filas: 2,
      elementos: [
        { tipo: 'punto', x: k, color: 'd', rotulo: `K = ${f(k, 1)}`, fila: 2 },
        { tipo: 'punto', x: q, color: 'o', rotulo: `Q = ${f(q, 1)}`, fila: lejos ? 1 : 2, abierto: !lejos },
        ...(lejos ? [{ tipo: 'salto', a: q, b: k, color: 'o', fila: 1 }] : []),
      ],
      alt: `Recta numérica con K = ${f(k, 1)} y Q = ${f(q, 1)}: ${hacia(q, k)}.`,
    }, extra);
  }
  const chatelier = {
    id: 'le-chatelier',
    titulo: 'Le Chatelier: compara Q con K',
    temas: ['Principio de Le Chatelier'],
    pieza: 'recta',
    juega: {
      consigna: '2 NO₂ ⇌ N₂O₄ está en equilibrio con 0,3 y 0,9 mol/L (K = 10, exotérmica). Elige un cambio y mira dónde cae Q.',
      voz: 'La flecha va de Q hacia K. Eso dice hacia dónde avanza.',
      controles: [{ id: 'k', etiqueta: 'Cambio', opciones: Object.keys(CAMBIOS).map(k => ({ valor: k, texto: CAMBIOS[k].texto })) }],
      dibujo: val => { const C = CAMBIOS[val.k], q = qDe(C.no2, C.n2o4); return { datos: rectaQK(q, C.K || KN), estado: {} }; },
      lectura: val => { const C = CAMBIOS[val.k], q = qDe(C.no2, C.n2o4), k = C.K || KN; return [Q, ` = ${f(q, 1)}, `, K, ` = ${f(k, 0)}: ${hacia(q, k)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'A la misma mezcla en equilibrio le inyectas argón, que no reacciona, sin cambiar el volumen del recipiente. Sube la presión total. ¿Qué pasa?',
      voz: 'Revisa si cambia alguna concentración de la expresión de Q.',
      opciones: [
        { id: 'c', texto: 'No se desplaza: Q sigue igual a K', correcta: true },
        { id: 'productos', texto: 'Avanza hacia N₂O₄, porque subió la presión', error: 'EQ14', siFuera: 'Sería cierto al comprimir: ahí suben las concentraciones. El argón no cambia [NO₂] ni [N₂O₄].' },
        { id: 'reactivos', texto: 'Retrocede hacia NO₂', error: 'QM-INERTE', siFuera: 'Retrocedería si Q pasara a K. Con el volumen fijo, Q no cambia.' },
        { id: 'para', texto: 'La reacción se detiene', error: 'EQ3', siFuera: 'En equilibrio la reacción nunca se detiene: sigue en los dos sentidos.' },
      ],
      dibujo: { datos: rectaQK(KN, KN, { elementos: [{ tipo: 'punto', x: KN, color: 'd', rotulo: 'K = 10', fila: 2 }] }), estado: {} },
      revelar: { datos: rectaQK(KN, KN), estado: {} },
      coincide: 'Coincide: con V fijo, ninguna concentración cambia y Q sigue en K.',
      noCoincide: 'Con V fijo, el argón no cambia ninguna concentración: Q = K.',
    },
    mira: {
      datos: {
        min: 0, max: 25, paso: 1, cada: 5, decimales: 1, variable: '', filas: 3,
        elementos: [
          { tipo: 'punto', x: KN, color: 'd', rotulo: 'K = 10', fila: 3, desde: 1 },
          { tipo: 'punto', x: qDe(0.6, 0.9), color: 'o', rotulo: `con NO₂: Q = ${f(qDe(0.6, 0.9), 1)}`, fila: 2, desde: 2 },
          { tipo: 'salto', a: qDe(0.6, 0.9), b: KN, color: 'o', fila: 2, desde: 2 },
          { tipo: 'punto', x: 4, color: 'd', rotulo: 'caliente: K = 4', fila: 1, desde: 4 },
          { tipo: 'salto', a: KN, b: 4, color: 'o', fila: 1, desde: 4 },
        ],
        alt: 'Recta Q–K: al añadir NO₂, Q baja a 2,5 y la mezcla avanza hacia K = 10; al calentar, es K la que baja a 4 y la mezcla retrocede.',
      },
      voz: 'En cada cambio, primero calcula Q; después compáralo con K.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En equilibrio Q vale lo mismo que K.', ecuacion: [Q, ' = ', { frac: [cc('N₂O₄'), { sup: [cc('NO₂'), '2'] }] }, ' = 0,9 / 0,09 = 10'] },
        { estado: { corte: 2 }, texto: 'Añadir NO₂ baja Q: la mezcla avanza hacia N₂O₄.', ecuacion: [Q, ` = 0,9 / 0,36 = ${f(qDe(0.6, 0.9), 1)} < `, K] },
        { estado: { corte: 3 }, texto: 'Un catalizador no cambia Q ni K: solo llega antes al equilibrio.' },
        { estado: { corte: 4 }, texto: 'Calentar no cambia Q: cambia K. Aquí K baja y la mezcla retrocede.', ecuacion: [Q, ' = 10 > ', K, ' = 4'] },
      ],
    },
    regla: {
      texto: 'Tras un cambio, compara Q con K. Si Q < K, avanza hacia productos; si Q > K, hacia reactivos; si Q = K, no se desplaza. Solo la temperatura cambia K.',
      ecuacion: [Q, ' < ', K, ' → productos   ·   ', Q, ' > ', K, ' → reactivos'],
      condicion: 'un gas inerte a volumen fijo no cambia Q; el catalizador acelera la llegada al equilibrio sin cambiar K.',
      voz: 'El sistema no decide nada: lo dice la comparación.',
    },
    ahoraTu: {
      pieza: 'recta',
      voz: 'Calcula Q después del cambio y compáralo con K.',
      generar(s) {
        const CASOS = [
          { sis: '2 NO₂ ⇌ N₂O₄ (K = 10), con [NO₂] = 0,3 y [N₂O₄] = 0,9 mol/L', acc: 'Añades NO₂ hasta 0,5 mol/L', q: qDe(0.5, 0.9), k: 10 },
          { sis: '2 NO₂ ⇌ N₂O₄ (K = 10), con [NO₂] = 0,3 y [N₂O₄] = 0,9 mol/L', acc: 'Añades N₂O₄ hasta 1,5 mol/L', q: qDe(0.3, 1.5), k: 10 },
          { sis: '2 NO₂ ⇌ N₂O₄ (K = 10), con [NO₂] = 0,3 y [N₂O₄] = 0,9 mol/L', acc: 'Agregas un catalizador', q: 10, k: 10 },
          { sis: 'H₂ + I₂ ⇌ 2 HI (K = 4), con [H₂] = [I₂] = 0,5 y [HI] = 1 mol/L', acc: 'Reduces el volumen a la mitad', q: 4, k: 4 },
          { sis: 'H₂ + I₂ ⇌ 2 HI (K = 4), con [H₂] = [I₂] = 0,5 y [HI] = 1 mol/L', acc: 'Retiras HI hasta 0,5 mol/L', q: 0.25 / 0.25, k: 4 },
          { sis: 'H₂ + I₂ ⇌ 2 HI (K = 4), con [H₂] = [I₂] = 0,5 y [HI] = 1 mol/L', acc: 'Añades HI hasta 2 mol/L', q: 4 / 0.25, k: 4 },
          { sis: '2 NO₂ ⇌ N₂O₄ (K = 10), con [NO₂] = 0,3 y [N₂O₄] = 0,9 mol/L', acc: 'Duplicas el volumen', q: qDe(0.15, 0.45), k: 10 },
        ];
        const C = CASOS[s % CASOS.length], dir = Math.abs(C.q - C.k) < 1e-9 ? 'nada' : C.q < C.k ? 'prod' : 'reac';
        const nom = { prod: 'Avanza hacia productos', reac: 'Retrocede hacia reactivos', nada: 'No se desplaza' };
        const si = { prod: 'Avanzaría hacia productos si Q quedara menor que K.', reac: 'Retrocedería si Q quedara mayor que K.', nada: 'No se desplazaría si Q siguiera igual a K.' };
        return {
          pregunta: `${C.sis}. ${C.acc}. ¿Hacia dónde evoluciona la mezcla?`,
          opciones: Object.keys(nom).map(k => (k === dir ? { id: 'c', texto: nom[k], correcta: true } : { id: k, texto: nom[k], error: k === 'nada' ? 'EQ14' : 'QM-QK', siFuera: si[k] })),
          solucion: { texto: `Después del cambio, Q = ${f(C.q, 2)} y K = ${f(C.k, 0)}.`, ecuacion: [Q, ` = ${f(C.q, 2)} ${dir === 'nada' ? '=' : dir === 'prod' ? '<' : '>'} `, K, ` = ${f(C.k, 0)}`], dibujo: { datos: rectaQK(Math.min(25, C.q), C.k), estado: {} } },
        };
      },
    },
  };

  return {
    unidad: 'quimica.equilibrio-quimico',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/recta.js'],
    historia: {
      texto: 'Algunas mezclas conservan su composición aunque la transformación no haya terminado. En 1864, Cato Guldberg y Peter Waage propusieron la ley de acción de masas, que después se revisó hasta su forma moderna. No basta con decir que un sistema «se opone» a un cambio: hacen falta variables, temperatura y una comparación con números.',
      pregunta: '¿Cómo puede algo estar quieto si por dentro sigue cambiando?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §13.2 y §13.3', url: 'https://openstax.org/books/chemistry-2e/pages/13-3-shifting-equilibria-le-chateliers-principle' },
    },
    ideas: [dinamico, kc, grado, chatelier],
  };
});
