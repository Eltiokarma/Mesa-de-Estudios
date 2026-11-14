/*
 * Teoría de «Electroquímica» (quimica.electroquimica). Molde: docs/teoria.md y contenido/teoria/quimica/materia-y-energia.js.
 * Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 15), historia-ecuaciones-2.pdf y las precisiones de
 * Química del expediente (los electrones nunca cruzan el puente; ánodo y cátodo se definen por el proceso, no por el
 * signo ni por el lado del dibujo; Pourbaix dice qué es estable, no qué tan rápido).
 * Errores: docs/investigacion/equilibrio-acidos-electroquimica-ideas-erroneas.md (EC); los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: armar una pila sabiendo dónde se oxida, por dónde va cada carga y cuánto metal deposita una corriente.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: dice ánodo y cátodo de una pila nueva y su fem, si una redox es espontánea, la masa que
 *     deposita una electrólisis y en qué zona de un diagrama potencial-pH está un punto.
 *   Orden de atención: 1.º la celda (electrodos, alambre, puente) · 2.º la lectura en vivo · acción: probar pares.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿qué cruza el puente?, ¿por qué el cobre no se cubre de zinc?, ¿de qué depende la masa depositada?
 *
 * Colores (regla 4): potencial E verde c-d, corriente I naranja c-o, masa m turquesa c-i. En la celda, el electrodo
 * que se oxida va en rojo (c-h) y el que se reduce en turquesa: es el papel, no el metal. El tiempo t va en tinta.
 * E° de OpenStax Chemistry 2e, apéndice L (a 25 °C, redondeados a centésimas): Mg −2,37; Zn −0,76; Fe −0,45;
 * Pb −0,13; Cu +0,34; Ag +0,80 V. F = 96 485 C/mol. Masas molares de la IUPAC.
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §17.2–17.4 y §17.7; MIT OCW 10.626 (2014), lección 11 (Pourbaix).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const fv = n => `${n > 0 ? '+' : ''}${Kit.formatear(n, 2).replace(/^(−?\d+)$/, '$1,00').replace(/,(\d)$/, ',$10')} V`;
  const E = { v: 'c-d', t: 'E' }, I = { v: 'c-o', t: 'I' }, m = { v: 'c-i', t: 'm' };
  const E0 = { sup: [E, '°'] };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
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

  // Potenciales estándar de reducción y datos de cada metal.
  const MET = {
    Mg: { e0: -2.37, ion: 'Mg²⁺', z: 2, M: 24.305 }, Zn: { e0: -0.76, ion: 'Zn²⁺', z: 2, M: 65.38 }, Fe: { e0: -0.45, ion: 'Fe²⁺', z: 2, M: 55.845 },
    Pb: { e0: -0.13, ion: 'Pb²⁺', z: 2, M: 207.2 }, Cu: { e0: 0.34, ion: 'Cu²⁺', z: 2, M: 63.546 }, Ag: { e0: 0.80, ion: 'Ag⁺', z: 1, M: 107.868 },
    Ni: { e0: -0.26, ion: 'Ni²⁺', z: 2, M: 58.693 },
  };
  const F = 96485;

  // ---------- Idea 1: la pila: electrones por el alambre, iones por el puente ----------
  // Cambia: los dos metales · Permanece: el dibujo de la celda (vasos, alambre, voltímetro, puente) · Progresa: rol,
  // electrones, iones y fem, en ese orden · Se reserva: el puente, donde solo viajan iones · Debe verse: que ningún
  // electrón entra al líquido.
  function pila(a, b, desde = {}) {
    const A = MET[a], B = MET[b];
    if (a === b) return { datos: { izq: { electrodo: a, disolucion: A.ion, color: undefined }, der: { electrodo: b, disolucion: B.ion }, electrones: null, iones: false, medidor: '0,00 V', alt: `Dos semiceldas iguales de ${a}: no hay diferencia de potencial y no circula corriente.` }, estado: {} };
    const izqAnodo = A.e0 < B.e0;
    const lado = (x, X, anodo) => ({ electrodo: x, disolucion: X.ion, rol: anodo ? 'ánodo' : 'cátodo', proceso: anodo ? 'oxidación' : 'reducción', color: anodo ? 'h' : 'i' });
    return { datos: { izq: lado(a, A, izqAnodo), der: lado(b, B, !izqAnodo), electrones: izqAnodo ? 'der' : 'izq', iones: true, medidor: fv(Math.abs(B.e0 - A.e0)).replace('+', ''), desde }, estado: {} };
  }
  const celda = {
    id: 'pila-galvanica',
    titulo: 'Electrones por el alambre',
    temas: ['Semirreacciones y potenciales de reducción', 'Celdas galvánicas y fem'],
    pieza: 'quim-celda',
    juega: {
      consigna: 'Arma una pila con dos metales, cada uno en una disolución de sus iones. Mira cuál se oxida, adónde van los electrones y la fem.',
      voz: 'Ubica primero dónde ocurre la oxidación.',
      controles: [
        { id: 'a', etiqueta: 'Izquierda', opciones: ['Mg', 'Zn', 'Fe', 'Cu'].map(x => ({ valor: x, texto: x })) },
        { id: 'b', etiqueta: 'Derecha', opciones: ['Zn', 'Pb', 'Cu', 'Ag'].map(x => ({ valor: x, texto: x })) },
      ],
      dibujo: val => pila(val.a, val.b),
      lectura: val => {
        if (val.a === val.b) return ['Metales iguales: no hay corriente.'];
        const an = MET[val.a].e0 < MET[val.b].e0 ? val.a : val.b, ca = an === val.a ? val.b : val.a;
        return [`Ánodo ${an}, cátodo ${ca} · `, E0, ` = ${fv(MET[ca].e0 - MET[an].e0)}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'En la pila de zinc y cobre, la corriente da la vuelta completa: alambre, disoluciones y puente salino. ¿Qué lleva la carga dentro del puente?',
      voz: 'Piensa qué partículas pueden moverse en un líquido.',
      opciones: [
        { id: 'c', texto: 'Iones: cationes hacia el cátodo y aniones hacia el ánodo', correcta: true },
        { id: 'electrones', texto: 'Los mismos electrones que salen del zinc', error: 'EC1', siFuera: 'Los electrones sí recorren el alambre. En un líquido no viajan sueltos: ahí se mueven iones.' },
        { id: 'nada', texto: 'Nada: el puente solo separa los vasos', error: 'QM-PUENTE-PARED', siFuera: 'Separa las disoluciones, cierto. Pero sin el paso de iones el circuito queda abierto.' },
        { id: 'negativos', texto: 'Solo los iones negativos', error: 'EC5', siFuera: 'Los aniones sí se mueven. Los cationes también, en sentido contrario.' },
      ],
      dibujo: { datos: Object.assign({}, pila('Zn', 'Cu').datos, { iones: false }), estado: {} },
      revelar: pila('Zn', 'Cu'),
      coincide: 'Coincide: en el puente se mueven iones; los electrones quedan en el alambre.',
      noCoincide: 'Dentro del puente se mueven iones; los electrones solo van por el alambre.',
    },
    mira: {
      datos: pila('Zn', 'Cu', { roles: 1, electrones: 2, iones: 3, medidor: 4 }).datos,
      voz: 'Sigamos la carga por todo el circuito.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El zinc se oxida: es el ánodo.', ecuacion: ['Zn → Zn²⁺ + 2e⁻'] },
        { estado: { corte: 2 }, texto: 'Los electrones salen del zinc y van por el alambre al cobre.' },
        { estado: { corte: 2 }, texto: 'En el cobre, el Cu²⁺ los toma: reducción, es el cátodo.', ecuacion: ['Cu²⁺ + 2e⁻ → Cu'] },
        { estado: { corte: 3 }, texto: 'En el puente se mueven iones y cierran el circuito.' },
        { estado: { corte: 4 }, texto: 'La fem es el potencial del cátodo menos el del ánodo.', ecuacion: [E0, ' = 0,34 − (−0,76) = 1,10 V'] },
      ],
    },
    regla: {
      texto: 'Oxidación en el ánodo, reducción en el cátodo. Los electrones van por el alambre del ánodo al cátodo; en las disoluciones y el puente se mueven iones.',
      ecuacion: [{ sub: [E0, 'celda'] }, ' = ', { sub: [E0, 'cátodo'] }, ' − ', { sub: [E0, 'ánodo'] }],
      condicion: 'a 1 M, 1 atm y 25 °C. Si se multiplica una semirreacción por 2, su potencial no cambia.',
      voz: 'Primero el papel de cada electrodo; la fem sale después.',
    },
    ahoraTu: {
      pieza: 'quim-celda',
      voz: 'Decide cuál se oxida antes de restar.',
      generar(s) {
        const r = azar(s), ks = ['Mg', 'Zn', 'Fe', 'Pb', 'Ni', 'Cu', 'Ag'];
        const a = ks[s % ks.length]; let b = r.de(ks.filter(x => x !== a));
        const an = MET[a].e0 < MET[b].e0 ? a : b, ca = an === a ? b : a, e = MET[ca].e0 - MET[an].e0;
        const dist = [
          { id: 'suma', valor: MET[ca].e0 + MET[an].e0, error: 'QM-FEM-SUMA', siFuera: 'Eso suma los potenciales. La fem es cátodo menos ánodo.' },
          { id: 'al-reves', valor: -e, error: 'EC8', siFuera: 'Eso resta al revés. Con el cátodo bien elegido, la fem de una pila sale positiva.' },
        ];
        if (MET[ca].z !== MET[an].z) dist.push({ id: 'por-z', valor: MET[ca].e0 * 2 - MET[an].e0, error: 'QM-E-ESCALA', siFuera: 'Eso duplica el potencial del Ag⁺ al igualar electrones. El potencial no se multiplica.' });
        else dist.push({ id: 'uno', valor: MET[ca].e0, error: 'QM-FEM-UNO', siFuera: 'Eso es solo el potencial del cátodo. Falta restar el del ánodo.' });
        return {
          pregunta: [`Una pila tiene un electrodo de ${a} en ${MET[a].ion} y otro de ${b} en ${MET[b].ion} (1 M, 25 °C). ¿Cuánto vale su `, E0, '?'],
          opciones: opciones(e, dist, fv),
          solucion: { texto: `Se oxida el de potencial más bajo: ${an} es el ánodo y ${ca}, el cátodo.`, ecuacion: [E0, ` = ${fv(MET[ca].e0).replace(' V', '')} − (${fv(MET[an].e0).replace(' V', '')}) = ${fv(e)}`], dibujo: pila(a, b) },
        };
      },
    },
  };

  // ---------- Idea 2: espontánea si E > 0 ----------
  // Cambia: el metal y el ion de la disolución · Permanece: la escala de potenciales con sus seis pares · Progresa: de
  // ubicar los dos puntos a restar · Se reserva: el cobre en Zn²⁺, el par al revés · Debe verse: quién está más arriba.
  const PARES_ESC = ['Mg', 'Zn', 'Fe', 'Pb', 'Cu', 'Ag'];
  const ESCALA = (extra = [], resto = true) => ({
    min: -2.5, max: 1, paso: 0.5, cada: 2, variable: 'E°', color: 'd', sufijo: ' V', decimales: 2, filas: 3,
    elementos: [...(resto ? PARES_ESC.map((x, i) => ({ tipo: 'punto', x: MET[x].e0, rotulo: `${MET[x].ion}/${x}`, fila: [1, 2, 3][i % 3], abierto: true })) : []), ...extra],
    alt: 'Escala de potenciales estándar de reducción: Mg −2,37; Zn −0,76; Fe −0,45; Pb −0,13; Cu +0,34; Ag +0,80 V.',
  });
  const espont = {
    id: 'espontaneidad',
    titulo: 'Espontánea si E es positivo',
    temas: ['Espontaneidad redox', 'Semirreacciones y potenciales de reducción'],
    pieza: 'recta',
    juega: {
      consigna: 'Pon una barra de metal en una disolución de otro ion. El ion se reduce si en la escala está más arriba que el metal.',
      voz: 'Compara las dos posiciones en la escala.',
      controles: [
        { id: 'met', etiqueta: 'Metal', opciones: ['Mg', 'Zn', 'Fe'].map(x => ({ valor: x, texto: x })) },
        { id: 'ion', etiqueta: 'Disolución', opciones: ['Pb', 'Cu', 'Ag'].map(x => ({ valor: x, texto: MET[x].ion })) },
      ],
      dibujo: val => ({ datos: ESCALA([{ tipo: 'salto', a: MET[val.met].e0, b: MET[val.ion].e0, color: 'd', rotulo: fv(MET[val.ion].e0 - MET[val.met].e0), fila: 0 }]), estado: {} }),
      lectura: val => { const e = MET[val.ion].e0 - MET[val.met].e0; return [E0, ` = ${fv(e)}: ${e > 0 ? `el ${val.met} se disuelve; aparece ${val.ion}` : 'no hay reacción'}.`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora metes una cuchara de cobre en una disolución de Zn²⁺. ¿Se cubre la cuchara de zinc?',
      voz: 'Ubica los dos pares en la escala antes de responder.',
      opciones: [
        { id: 'c', texto: `No: E° = ${fv(MET.Zn.e0 - MET.Cu.e0)}, no es espontánea`, correcta: true },
        { id: 'siempre', texto: 'Sí: un metal siempre desplaza al ion de otro', error: 'QM-DESPLAZA', siFuera: 'Pasa cuando el ion está más arriba en la escala. El Zn²⁺ está más abajo que el cobre.' },
        { id: 'noble', texto: 'Sí, porque el cobre es más noble', error: 'QM-NOBLE', siFuera: 'Más noble significa que el cobre se oxida menos. Por eso justamente no cede electrones al Zn²⁺.' },
        { id: 'cantidad', texto: 'Depende de cuánto cobre haya', error: 'QM-CANTIDAD', siFuera: 'La cantidad cambia cuánto reacciona, no si reacciona. El signo de E° decide.' },
      ],
      dibujo: { datos: ESCALA(), estado: {} },
      revelar: { datos: ESCALA([{ tipo: 'salto', a: MET.Cu.e0, b: MET.Zn.e0, color: 'd', rotulo: fv(MET.Zn.e0 - MET.Cu.e0), fila: 0 }]), estado: {} },
      coincide: 'Coincide: el Zn²⁺ está más abajo que el cobre, E° sale negativo.',
      noCoincide: 'El Zn²⁺ está más abajo que el cobre: E° negativo, no hay reacción.',
    },
    mira: {
      datos: ESCALA([
        { tipo: 'salto', a: MET.Zn.e0, b: MET.Cu.e0, color: 'd', rotulo: '+1,10 V', fila: 0, desde: 2 },
      ]),
      voz: 'Leamos la escala de abajo hacia arriba.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Más a la derecha, más tendencia a reducirse.', ecuacion: ['Ag⁺ se reduce más fácil que Mg²⁺'] },
        { estado: { corte: 2 }, texto: 'Zn en Cu²⁺: el ion está más arriba que el metal.', ecuacion: [E0, ' = 0,34 − (−0,76) = +1,10 V'] },
        { estado: { corte: 2 }, texto: 'E positivo significa energía libre negativa: ocurre sola.', ecuacion: ['Δ', { sup: ['G', '°'] }, ' = −n F ', E0, ' < 0'] },
        { estado: { corte: 2 }, texto: 'Al revés, cobre en Zn²⁺, E sale −1,10 V: no ocurre.' },
      ],
    },
    regla: {
      texto: 'Una redox es espontánea si su E° es positivo: se reduce la especie de potencial más alto y se oxida la de potencial más bajo.',
      ecuacion: ['Δ', { sup: ['G', '°'] }, ' = −n F ', E0, '   ·   ', E0, ' > 0 → espontánea'],
      condicion: 'en condiciones estándar; con otras concentraciones el potencial cambia (ecuación de Nernst) y puede invertir el sentido.',
      voz: 'Ubica, resta y mira el signo.',
    },
    ahoraTu: {
      voz: 'Ubica el metal y el ion en la escala.',
      generar(s) {
        const ks = ['Mg', 'Zn', 'Fe', 'Pb', 'Ni', 'Cu', 'Ag'];
        const met = ks[s % ks.length], ion = ks[(s * 3 + 1) % ks.length] === met ? ks[(s + 2) % ks.length] : ks[(s * 3 + 1) % ks.length];
        const e = MET[ion].e0 - MET[met].e0, si = e > 0;
        return {
          pregunta: `Metes una barra de ${met} en una disolución 1 M de ${MET[ion].ion}. ¿Ocurre una reacción redox espontánea?`,
          opciones: [
            { id: 'c', texto: `${si ? 'Sí' : 'No'}: E° = ${fv(e)}`, correcta: true },
            { id: 'signo', texto: `${si ? 'No' : 'Sí'}: E° = ${fv(-e)}`, error: 'EC8', siFuera: 'Eso resta al revés. El potencial del ion que se reduce va primero.' },
            { id: 'cantidad', texto: 'Depende de la masa de la barra', error: 'QM-CANTIDAD', siFuera: 'La masa cambia cuánto reacciona, no si reacciona. Lo decide el signo de E°.' },
          ],
          solucion: { texto: si ? `El ${MET[ion].ion} está más arriba: se reduce y el ${met} se oxida.` : `El ${MET[ion].ion} está más abajo que el ${met}: no se reduce.`, ecuacion: [E0, ` = ${fv(MET[ion].e0).replace(' V', '')} − (${fv(MET[met].e0).replace(' V', '')}) = ${fv(e)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: electrólisis y Faraday ----------
  // Cambia: la corriente y el tiempo · Permanece: Cu²⁺ que se deposita, los ejes m–t · Progresa: más corriente, más
  // pendiente · Se reserva: la plata, que con la misma carga deposita más masa · Debe verse: m proporcional a I·t.
  const mDep = (x, i, tmin) => MET[x].M * i * tmin * 60 / (MET[x].z * F);
  const ejesM = (extra = {}) => Object.assign({
    x: { min: 0, max: 60, paso: 10, nombre: 't', unidad: 'min', decimales: 0 },
    y: { min: 0, max: 8, paso: 2, nombre: 'm', unidad: 'g', decimales: 0, color: 'i' },
    alt: 'Masa depositada contra tiempo: rectas que crecen en proporción a la carga I·t.',
  }, extra);
  const faraday = {
    id: 'electrolisis-faraday',
    titulo: 'La carga decide la masa',
    temas: ['Electrólisis', 'Leyes de Faraday'],
    pieza: 'ejes',
    juega: {
      consigna: 'Una fuente hace pasar corriente por una disolución de Cu²⁺ y se deposita cobre en el cátodo. Elige la corriente y el tiempo.',
      voz: 'Mira cómo cambia la recta al subir la corriente.',
      controles: [
        { id: 'i', etiqueta: 'I', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 2, unidad: 'A', decimales: 0 },
        { id: 't', etiqueta: 't', min: 10, max: 60, paso: 10, inicio: 30, unidad: 'min', decimales: 0 },
      ],
      dibujo: val => ({ datos: ejesM({ curvas: [{ puntos: [[0, 0], [60, mDep('Cu', val.i, 60)]], color: 'i', rotulo: `Cu, ${val.i} A` }], puntos: [{ x: val.t, y: mDep('Cu', val.i, val.t), color: 'i', rotulo: `${f(mDep('Cu', val.i, val.t))} g`, guias: true }] }), estado: {} }),
      lectura: val => ['Q = ', I, `·t = ${f(val.i * val.t * 60, 0)} C · `, m, ` = ${f(mDep('Cu', val.i, val.t))} g`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Con la misma corriente y el mismo tiempo depositas plata (Ag⁺ + e⁻ → Ag) en vez de cobre (Cu²⁺ + 2e⁻ → Cu). ¿Qué masa de plata sale?',
      voz: 'Cuenta cuántos electrones necesita cada ion.',
      opciones: [
        { id: 'c', texto: `Unas ${f(mDep('Ag', 1, 1) / mDep('Cu', 1, 1), 1)} veces la del cobre`, correcta: true },
        { id: 'igual', texto: 'La misma: igual carga, igual masa', error: 'QM-FARADAY-MASA', siFuera: 'Igual carga da igual número de electrones. La masa depende de qué ion y cuántos electrones pide.' },
        { id: 'mitad', texto: 'La mitad: la plata toma un solo electrón', error: 'QM-FARADAY-Z', siFuera: 'Un electrón por átomo hace que se depositen más átomos de plata, no menos.' },
        { id: 'doble', texto: 'Exactamente el doble, por los electrones', error: 'QM-FARADAY-M', siFuera: 'Los electrones dan el doble de átomos, bien. Pero cada átomo de plata además pesa más.' },
      ],
      dibujo: { datos: ejesM({ curvas: [{ puntos: [[0, 0], [60, mDep('Cu', 2, 60)]], color: 'i', rotulo: 'Cu, 2 A' }] }), estado: {} },
      revelar: { datos: ejesM({ curvas: [{ puntos: [[0, 0], [60, mDep('Cu', 2, 60)]], color: 'i', rotulo: 'Cu, 2 A' }, { puntos: [[0, 0], [60 * 8 / mDep('Ag', 2, 60), 8]], color: 'i', rotulo: 'Ag, 2 A', discontinua: true }], puntos: [{ x: 30, y: mDep('Ag', 2, 30), color: 'i', rotulo: `Ag: ${f(mDep('Ag', 2, 30))} g`, guias: true }, { x: 30, y: mDep('Cu', 2, 30), color: 'i', rotulo: `Cu: ${f(mDep('Cu', 2, 30))} g` }] }), estado: {} },
      coincide: 'Coincide: el doble de átomos y cada uno más pesado.',
      noCoincide: 'Con un electrón por átomo se depositan el doble de átomos, y cada uno pesa más.',
    },
    mira: {
      pieza: 'quim-celda',
      datos: { tipo: 'electrolitica', izq: { electrodo: 'C', rol: 'ánodo', proceso: 'oxidación', color: 'h' }, der: { electrodo: 'C', rol: 'cátodo', proceso: 'reducción', color: 'i', disolucion: 'CuSO₄(ac)' },
        electrones: 'der', iones: true, medidor: '2 A', desde: { electrones: 1, roles: 2, iones: 3, medidor: 4 } },
      voz: 'Sigamos la carga desde la fuente.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La fuente empuja electrones hacia un electrodo: la reacción no ocurriría sola.' },
        { estado: { corte: 2 }, texto: 'En el cátodo el Cu²⁺ toma dos electrones y se deposita.', ecuacion: ['Cu²⁺ + 2e⁻ → Cu'] },
        { estado: { corte: 3 }, texto: 'En el líquido, los iones llevan la carga de un electrodo al otro.' },
        { estado: { corte: 4 }, texto: 'En 30 min con 2 A pasan 3 600 C.', ecuacion: ['Q = ', I, '·t = 2 · 1 800 = 3 600 C'] },
        { estado: { corte: 4 }, texto: 'Cada mol de cobre necesita 2 mol de electrones.', ecuacion: [m, ' = ', { frac: [['63,55 · 3 600'], ['2 · 96 485']] }, ` = ${f(mDep('Cu', 2, 30))} g`] },
      ],
    },
    regla: {
      texto: 'En la electrólisis una fuente fuerza una redox que no ocurre sola. La masa depositada es proporcional a la carga que pasa e inversa a los electrones por ion.',
      ecuacion: [m, ' = ', { frac: [['M ', I, ' t'], 'z F'] }, '   ·   F = 96 485 C/mol'],
      condicion: 't en segundos y eficiencia del 100 %; en agua pueden competir otras reacciones, como formar H₂ en vez del metal.',
      voz: 'Carga primero; después, cuántos electrones pide cada ion.',
    },
    ahoraTu: {
      voz: 'Pasa el tiempo a segundos.',
      generar(s) {
        const r = azar(s), x = ['Cu', 'Ag', 'Zn', 'Ni'][s % 4], i = r.ent(1, 6), t = 5 * r.ent(2, 12), mm = mDep(x, i, t), X = MET[x];
        return {
          pregunta: [`Una corriente `, I, ` = ${f(i, 0)} A pasa ${f(t, 0)} min por una disolución de ${X.ion}. ¿Qué masa de ${x} se deposita? (M = ${f(X.M)} g/mol)`],
          opciones: opciones(mm, [
            { id: 'sin-z', valor: mm * X.z, error: 'QM-FARADAY-Z', siFuera: `Eso olvida dividir entre z: cada ${X.ion} necesita ${X.z} electrones.` },
            { id: 'min', valor: mm / 60, error: 'QM-T-MIN', siFuera: 'Eso usa el tiempo en minutos. La carga en coulomb pide segundos.' },
            { id: 'por-z', valor: mm * X.z * X.z, error: 'QM-FARADAY-Z', siFuera: 'Eso multiplica por los electrones en vez de dividir.' },
          ], n => `${f(n)} g`),
          solucion: { texto: `Q = I·t con t en segundos; cada ion toma ${X.z} electrón${X.z > 1 ? 'es' : ''}.`, ecuacion: [m, ` = ${f(X.M)} · ${f(i, 0)} · ${f(t * 60, 0)} / (${X.z} · 96 485) = ${f(mm)} g`] },
        };
      },
    },
  };

  // ---------- Idea 4: el diagrama de Pourbaix del agua ----------
  // Cambia: el pH y el potencial del punto · Permanece: las dos líneas del agua · Progresa: de la línea de arriba a la
  // de abajo y a la ventana entre ellas · Se reserva: el valor a pH 7, que no es 0 · Debe verse: que las líneas bajan con el pH.
  const eO2 = p => 1.23 - 0.0592 * p, eH2 = p => -0.0592 * p;
  const ejesP = (extra = {}) => Object.assign({
    x: { min: 0, max: 14, paso: 2, nombre: 'pH', decimales: 0 },
    y: { min: -1, max: 1.5, paso: 0.5, nombre: 'E', unidad: 'V', decimales: 1, color: 'd' },
    curvas: [{ puntos: [[0, eO2(0)], [14, eO2(14)]], color: 'd', rotulo: 'O₂ / H₂O', en: [7, eO2(7) + 0.12] }, { puntos: [[0, eH2(0)], [14, eH2(14)]], color: 'd', rotulo: 'H₂O / H₂', en: [12, eH2(12) - 0.25] }],
    alt: 'Diagrama potencial-pH del agua: arriba de la línea O₂/H₂O el agua se oxida a O₂; abajo de la línea H₂O/H₂ se reduce a H₂; entre las dos es estable.',
  }, extra);
  const zona = (p, e) => (e > eO2(p) ? 'el agua se oxida a O₂' : e < eH2(p) ? 'el agua se reduce a H₂' : 'el agua es estable');
  const pourbaix = {
    id: 'pourbaix',
    titulo: 'Potencial y pH en un mapa',
    temas: ['Diagrama de Pourbaix (solo San Marcos)'],
    pieza: 'ejes',
    juega: {
      consigna: 'Mueve el punto: elige el pH de la disolución y el potencial de un electrodo. El mapa dice qué le pasa al agua.',
      voz: 'Busca los bordes de la zona donde el agua no cambia.',
      controles: [
        { id: 'p', etiqueta: 'pH', min: 0, max: 14, paso: 1, inicio: 7, decimales: 0 },
        { id: 'e', etiqueta: 'E', color: 'c-d', min: -1, max: 1.5, paso: 0.25, inicio: 0.5, unidad: 'V', decimales: 2 },
      ],
      dibujo: val => ({ datos: ejesP({ puntos: [{ x: val.p, y: val.e, color: 'd', rotulo: `(${f(val.p, 0)}; ${f(val.e)} V)` }] }), estado: {} }),
      lectura: val => [`pH ${f(val.p, 0)}, `, E, ` = ${f(val.e)} V: ${zona(val.p, val.e)}.`],
      minimo: 4,
    },
    predice: {
      pregunta: ['A pH 7, ¿por debajo de qué potencial ', E, ' el agua empieza a reducirse a H₂?'],
      voz: 'Fíjate en la línea de abajo, no en el cero.',
      opciones: [
        { id: 'c', texto: `${fv(eH2(7))}`, correcta: true },
        { id: 'cero', texto: '0,00 V, como el electrodo de hidrógeno', error: 'EC10', siFuera: 'El 0 V es para pH 0. La línea baja 0,0592 V por cada unidad de pH.' },
        { id: 'ph14', texto: `${fv(eH2(14))}`, error: 'QM-POURBAIX-PH', siFuera: 'Ese es el valor a pH 14. A pH 7 la línea está a la mitad.' },
        { id: 'o2', texto: `${fv(eO2(7))}`, error: 'QM-POURBAIX-LINEA', siFuera: 'Esa es la línea de arriba: ahí el agua se oxida a O₂.' },
      ],
      dibujo: { datos: ejesP(), estado: {} },
      revelar: { datos: ejesP({ puntos: [{ x: 7, y: eH2(7), color: 'd', rotulo: fv(eH2(7)), guias: true }] }), estado: {} },
      coincide: 'Coincide: a pH 7 la línea de abajo está en −0,41 V.',
      noCoincide: 'La línea de abajo baja con el pH: a pH 7 está en −0,41 V.',
    },
    mira: {
      datos: ejesP({
        curvas: [{ puntos: [[0, eO2(0)], [14, eO2(14)]], color: 'd', rotulo: 'O₂ / H₂O', en: [7, eO2(7) + 0.12], desde: 1 }, { puntos: [[0, eH2(0)], [14, eH2(14)]], color: 'd', rotulo: 'H₂O / H₂', en: [12, eH2(12) - 0.25], desde: 2 }],
        areas: [{ puntos: [[0, eO2(0)], [14, eO2(14)], [14, eH2(14)], [0, eH2(0)]], cerrada: true, color: 'i', rotulo: 'agua estable', desde: 3 }],
      }),
      voz: 'Vamos línea por línea.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Arriba de esta línea, el agua se oxida y suelta O₂.', ecuacion: [E, ' = 1,23 − 0,0592 · pH'] },
        { estado: { corte: 2 }, texto: 'Debajo de esta otra, el agua se reduce y suelta H₂.', ecuacion: [E, ' = −0,0592 · pH'] },
        { estado: { corte: 3 }, texto: 'Entre las dos líneas, el agua es la especie estable.' },
        { estado: { corte: 3 }, texto: 'El mapa dice qué es estable, no qué tan rápido cambia.' },
      ],
    },
    regla: {
      texto: 'Un diagrama de Pourbaix marca, para cada pH y potencial, qué especie es estable. Para el agua, entre sus dos líneas el agua no se oxida ni se reduce.',
      ecuacion: [E, ' = 1,23 − 0,0592 pH   ·   ', E, ' = −0,0592 pH'],
      condicion: 'a 25 °C y gases a 1 atm. Es termodinámica: no dice la rapidez de un proceso, por ejemplo de la corrosión.',
      voz: 'Ubica el punto y lee la zona.',
    },
    ahoraTu: {
      voz: 'Reemplaza el pH en la ecuación de la línea.',
      generar(s) {
        const r = azar(s), p = r.ent(1, 13), arriba = s % 2 === 0;
        const e = arriba ? eO2(p) : eH2(p);
        return {
          pregunta: ['A pH ', `${f(p, 0)}, ¿a qué potencial `, E, ` está la línea donde el agua ${arriba ? 'empieza a oxidarse a O₂' : 'empieza a reducirse a H₂'}? (25 °C)`],
          opciones: opciones(e, [
            { id: 'sin-ph', valor: arriba ? 1.23 : 0, error: 'EC10', siFuera: 'Ese es el valor a pH 0. La línea baja 0,0592 V por unidad de pH.' },
            { id: 'suma', valor: arriba ? 1.23 + 0.0592 * p : 0.0592 * p, error: 'QM-POURBAIX-SIGNO', siFuera: 'Eso suma. Al subir el pH, las dos líneas bajan.' },
            { id: 'otra', valor: arriba ? eH2(p) : eO2(p), error: 'QM-POURBAIX-LINEA', siFuera: 'Esa es la otra línea del agua.' },
          ], fv),
          dibujo: { datos: ejesP(), estado: {} },
          solucion: { dibujo: { datos: ejesP({ puntos: [{ x: p, y: e, color: 'd', rotulo: fv(e), guias: true }] }), estado: {} }, texto: arriba ? 'Línea O₂/H₂O: empieza en 1,23 V y baja con el pH.' : 'Línea H₂O/H₂: empieza en 0 V y baja con el pH.', ecuacion: [E, ` = ${arriba ? '1,23 ' : ''}− 0,0592 · ${f(p, 0)} = ${fv(e)}`] },
        };
      },
    },
  };

  return {
    unidad: 'quimica.electroquimica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-celda.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'En una carta de marzo de 1800, Alessandro Volta describió una pila de discos metálicos que sostenía una corriente eléctrica. Décadas después, Michael Faraday midió cuánta materia transformaba una cantidad de electricidad y publicó sus resultados en 1834. Hoy los contamos con electrones e iones: una pila saca corriente de una reacción, y la electrólisis usa corriente para forzarla.',
      pregunta: '¿Cómo medirías cuánta materia transforma una corriente?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §17.2 y §17.7', url: 'https://openstax.org/books/chemistry-2e/pages/17-7-electrolysis' },
    },
    ideas: [celda, espont, faraday, pourbaix],
  };
});
