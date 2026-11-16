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
  const f1 = n => Kit.formatear(n, 1).replace(/^(−?\d+)$/, '$1,0');   // un decimal siempre (la lectura no salta de ancho)
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
  // La celda armada sin papeles (Lee y el enunciado de «Así se resuelve»): metales, disoluciones y voltímetro sin lectura.
  const celdaSola = (a, b) => ({ datos: { izq: { electrodo: a, disolucion: MET[a].ion }, der: { electrodo: b, disolucion: MET[b].ion }, electrones: null, iones: false, medidor: '? V',
    alt: `Pila sin resolver: ${a} en ${MET[a].ion} a la izquierda y ${b} en ${MET[b].ion} a la derecha, unidos por un alambre con voltímetro y por el puente salino.` }, estado: {} });
  const celda = {
    id: 'pila-galvanica',
    titulo: 'Electrones por el alambre',
    temas: ['Semirreacciones y potenciales de reducción', 'Celdas galvánicas y fem'],
    pieza: 'quim-celda',
    // Lee (fase 2): contexto, vocabulario y qué mirar. No dice qué lleva la carga en el puente (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Pilas por todas partes', texto: 'La pila de una linterna o la batería de tu celular sacan corriente de una reacción química. Por dentro, una sustancia pierde electrones y otra los gana.' },
        { titulo: 'Ánodo y cátodo', texto: 'El electrodo donde una sustancia pierde electrones, la oxidación, se llama ánodo. Donde otra los gana, la reducción, se llama cátodo. El nombre sale de lo que pasa, no del lado del dibujo.' },
        { titulo: 'Las partes de la celda', texto: 'En la figura hay dos vasos, cada uno con su metal en una disolución de sus iones. Un alambre con un voltímetro une los metales, y un tubo, el puente salino, une los vasos.', dibujo: celdaSola('Zn', 'Cu') },
        { titulo: 'Qué mirar', texto: 'Prueba varios pares de metales. Fíjate qué electrodo se pinta de rojo, hacia dónde corren los puntos turquesa y cuánto marca el voltímetro.' },
      ],
    },
    juega: {
      consigna: 'Electrones (puntos turquesa) por el alambre e iones por el puente, a rapidez de dibujo. Arma la pila y mira hacia dónde van.',
      voz: 'Ubica primero dónde ocurre la oxidación.',
      // Animación (ronda 5): la carga avanza con t. Con la misma resistencia, la corriente es proporcional a la fem, así
      // que los puntos corren más rápido con más fem (flujo = fem · t, en espacios entre puntos). Cada punto representa
      // muchísimas partículas; la rapidez es de dibujo, no la real.
      controles: [
        { id: 'a', etiqueta: 'Izquierda', opciones: ['Mg', 'Zn', 'Fe', 'Cu'].map(x => ({ valor: x, texto: x })) },
        { id: 'b', etiqueta: 'Derecha', opciones: ['Zn', 'Pb', 'Cu', 'Ag'].map(x => ({ valor: x, texto: x })) },
        { id: 't', etiqueta: 't', min: 0, max: 6, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } },
      ],
      dibujo: val => { const p = pila(val.a, val.b); return { datos: Object.assign({}, p.datos, { flujo: Math.abs(MET[val.b].e0 - MET[val.a].e0) * val.t }), estado: {} }; },
      lectura: val => {
        if (val.a === val.b) return ['Metales iguales: no hay corriente.'];
        const an = MET[val.a].e0 < MET[val.b].e0 ? val.a : val.b, ca = an === val.a ? val.b : val.a;
        return [`${f1(val.t)} s · ánodo ${an} → cátodo ${ca} · `, E0, ` = ${fv(MET[ca].e0 - MET[an].e0)}`];
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
      ecuacion: [{ sub: [E0, 'celda'] }, ' = ', { llave: [{ sub: [E0, 'cátodo'] }], nota: 'se reduce', color: 'c-d' }, ' − ', { llave: [{ sub: [E0, 'ánodo'] }], nota: 'se oxida', color: 'c-d' }],
      condicion: 'a 1 M, 1 atm y 25 °C. Si se multiplica una semirreacción por 2, su potencial no cambia.',
      voz: 'Primero el papel de cada electrodo; la fem sale después.',
    },
    // Así se resuelve (fase 2): la misma cuenta de «Ahora tú» (MET y pila), con otras semillas.
    resuelve: {
      pieza: 'quim-celda',
      generar(s) {
        const r = azar(s + 900), ks = ['Mg', 'Zn', 'Fe', 'Pb', 'Ni', 'Cu', 'Ag'];
        const a = r.de(ks), b = r.de(ks.filter(x => x !== a));
        const an = MET[a].e0 < MET[b].e0 ? a : b, ca = an === a ? b : a, e = MET[ca].e0 - MET[an].e0;
        const sinV = x => fv(x).replace(' V', '');
        const igualar = MET[ca].z !== MET[an].z;
        return {
          enunciado: [`Una pila tiene un electrodo de ${a} en ${MET[a].ion} y otro de ${b} en ${MET[b].ion}, a 1 M y 25 °C. ¿Cuál es su `, E0, ' y cuál es el ánodo?'],
          dibujo: celdaSola(a, b),
          pasos: [
            { tipo: 'pide', texto: ['Piden la fem ', E0, ': lo que marcaría el voltímetro. Y cuál electrodo se oxida.'] },
            { tipo: 'datos', texto: 'Los potenciales de reducción de los dos pares, de la tabla.', ecuacion: [`${MET[a].ion}/${a}: ${fv(MET[a].e0)}   ·   ${MET[b].ion}/${b}: ${fv(MET[b].e0)}`] },
            { tipo: 'regla', texto: 'El par de potencial más bajo cede electrones: ese es el ánodo. El otro los toma y es el cátodo. La fem es cátodo menos ánodo.' },
            { tipo: 'cuentas', texto: `${an} tiene el potencial más bajo: es el ánodo. ${ca} es el cátodo.`,
              ecuacion: [E0, ` = ${sinV(MET[ca].e0)} − (${sinV(MET[an].e0)}) = ${fv(e)}`], dibujo: pila(a, b) },
            { tipo: 'sentido', texto: igualar
              ? `Salió positiva, como en toda pila bien armada. Aunque ${MET.Ag.ion} toma un solo electrón y hay que duplicarlo, su potencial no se multiplica.`
              : 'Salió positiva, como en toda pila bien armada. Si salía negativa, habrías restado al revés: el ánodo estaba mal elegido.' },
          ],
          respuesta: [E0, ` = ${fv(e)}; ánodo de ${an}, cátodo de ${ca}`],
        };
      },
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
  // Gesto directo: la flecha va del metal al ion sobre la escala. Su punta se arrastra hacia otro ion y su cola hacia otro
  // metal (controles de opciones: cae en el par más cercano).
  const RX = (datos = ESCALA()) => Kit.piezas.recta.geometria(datos);
  const masCerca = (lista, px) => { const g = RX(), e = -2.5 + (px - g.x(-2.5)) * 3.5 / (g.x(1) - g.x(-2.5)); return lista.reduce((a, b) => (Math.abs(MET[b].e0 - e) < Math.abs(MET[a].e0 - e) ? b : a)); };
  const flechaEsc = (metales, iones, datos = () => ESCALA()) => [
    { id: 'ion', etiqueta: 'punta de la flecha: el ion que se reduce', color: 'c-d',
      donde: val => ({ x: RX(datos(val)).x(MET[val.ion].e0), y: RX(datos(val)).filaY(0) }), mover: pt => ({ ion: masCerca(iones, pt.x) }) },
    { id: 'metal', etiqueta: 'cola de la flecha: el metal que se oxida', color: 'c-d',
      donde: val => ({ x: RX(datos(val)).x(MET[val.met].e0), y: RX(datos(val)).filaY(0) }), mover: pt => ({ met: masCerca(metales, pt.x) }) },
  ];
  const mide = t => Math.min(1, Math.max(0, t / 3));
  const espont = {
    id: 'espontaneidad',
    titulo: 'Espontánea si E es positivo',
    temas: ['Espontaneidad redox', 'Semirreacciones y potenciales de reducción'],
    pieza: 'recta',
    // Lee (fase 2): sin decir qué pasa con el cobre en Zn²⁺ (eso se predice); la escala se presenta sin leer su orden.
    lee: {
      tarjetas: [
        { titulo: 'El clavo que se cobrea', texto: 'Si dejas un clavo de hierro en una disolución azul de sulfato de cobre, sale cubierto de una capa rojiza. El hierro pasó a la disolución y los iones Cu²⁺ se volvieron cobre metálico.',
          ecuacion: ['Fe + Cu²⁺ → Fe²⁺ + Cu'] },
        { titulo: 'Reacción espontánea', texto: 'Una reacción espontánea ocurre sola, sin una pila ni un enchufe que la empuje. Espontánea no quiere decir rápida: algunas tardan días en notarse.' },
        { titulo: 'La escala', texto: 'Cada par, como Cu²⁺/Cu, tiene su potencial de reducción, en voltios. La escala de la figura pone los seis pares en orden, del más negativo al más positivo.',
          dibujo: { datos: ESCALA(), estado: {} } },
        { titulo: 'Qué mirar', texto: 'Elige un metal y una disolución. La flecha va del metal al ion: fíjate hacia dónde apunta y qué signo tiene el número que marca.' },
      ],
    },
    juega: {
      consigna: 'Elige metal y disolución. La flecha mide sola, en la escala, del metal al ion: si apunta a la derecha, el ion se reduce.',
      voz: 'Compara las dos posiciones en la escala.',
      // Animación (ronda 5): la flecha crece del metal al ion en 3 s (es una regla que mide la resta, no una reacción
      // que avanza) y queda 1 s con su E°; luego vuelve a medir.
      controles: [
        { id: 'met', etiqueta: 'Metal', opciones: ['Mg', 'Zn', 'Fe'].map(x => ({ valor: x, texto: x })) },
        { id: 'ion', etiqueta: 'Disolución', opciones: ['Pb', 'Cu', 'Ag'].map(x => ({ valor: x, texto: MET[x].ion })) },
        { id: 't', etiqueta: 't', min: 0, max: 4, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } },
      ],
      dibujo: val => {
        const a = MET[val.met].e0, b = MET[val.ion].e0, q = mide(val.t), punta = a + (b - a) * q;
        const el = q * Math.abs(b - a) < 0.05 ? { tipo: 'punto', x: a, color: 'd', fila: 0 } : { tipo: 'salto', a, b: punta, color: 'd', rotulo: fv(punta - a), fila: 0 };
        return { datos: ESCALA([el]), estado: {} };
      },
      lectura: val => {
        const e = MET[val.ion].e0 - MET[val.met].e0;
        if (mide(val.t) < 1) return [`La flecha mide ${fv(e * mide(val.t))} desde el ${val.met}…`];
        return [E0, ` = ${fv(e)}: ${e > 0 ? `el ${val.met} se disuelve; aparece ${val.ion}` : 'no hay reacción'}.`];
      },
      minimo: 3,
      arrastres: flechaEsc(['Mg', 'Zn', 'Fe'], ['Pb', 'Cu', 'Ag']),
    },
    predice: {
      pregunta: 'Ahora pones cobre metálico en una disolución de Zn²⁺. ¿Se cubre el cobre de zinc?',
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
      ecuacion: ['Δ', { sup: ['G', '°'] }, ' = −', { llave: ['n'], nota: 'mol de e⁻' }, ' ', { llave: ['F'], nota: 'de Faraday' }, ' ', E0, '   ·   ', E0, ' > 0 →\u00a0espontánea'],
      condicion: 'en condiciones estándar; con otras concentraciones el potencial cambia (ecuación de Nernst) y puede invertir el sentido.',
      voz: 'Ubica, resta y mira el signo.',
    },
    // Así se resuelve (fase 2): el mismo caso de «Ahora tú» (metal en la disolución de otro ion), con otras semillas.
    // La escala trae los siete pares, Ni incluido, como la mesa «Cualquier metal, cualquier ion».
    resuelve: {
      generar(s) {
        const r = azar(s + 900), ks = ['Mg', 'Zn', 'Fe', 'Pb', 'Ni', 'Cu', 'Ag'];
        const met = r.de(ks), ion = r.de(ks.filter(x => x !== met));
        const e = MET[ion].e0 - MET[met].e0, si = e > 0, sinV = x => fv(x).replace(' V', '');
        const sieteSin = { datos: Object.assign(ESCALA(TODOS.map(x => ({ tipo: 'punto', x: MET[x].e0, rotulo: `${MET[x].ion}/${x}`, fila: FILA_LAB[x], abierto: true })), false),
          { filas: 4, alt: 'Escala de potenciales estándar de reducción: Mg −2,37; Zn −0,76; Fe −0,45; Ni −0,26; Pb −0,13; Cu +0,34; Ag +0,80 V.' }), estado: {} };
        return {
          enunciado: [`Pones ${met} metálico en una disolución 1 M de ${MET[ion].ion}. ¿Ocurre sola la redox? ¿Cuánto vale su `, E0, '?'],
          dibujo: sieteSin,
          pasos: [
            { tipo: 'pide', texto: [`Piden si el ${MET[ion].ion} le quita electrones al ${met} sin ayuda, y el `, E0, ' de esa reacción.'] },
            { tipo: 'datos', texto: 'Los potenciales de reducción de los dos pares, de la tabla.', ecuacion: [`${MET[ion].ion}/${ion}: ${fv(MET[ion].e0)}   ·   ${MET[met].ion}/${met}: ${fv(MET[met].e0)}`] },
            { tipo: 'regla', texto: ['El ion que se reduciría va primero: ', E0, ' es su potencial menos el del metal. Si sale positivo, la reacción ocurre sola.'] },
            { tipo: 'cuentas', texto: `La flecha va del ${met} al ${MET[ion].ion} y ${si ? 'apunta a la derecha' : 'apunta a la izquierda'}.`,
              ecuacion: [E0, ` = ${sinV(MET[ion].e0)} − (${sinV(MET[met].e0)}) = ${fv(e)}`], dibujo: { datos: escalaLab({ met, ion }), estado: {} } },
            { tipo: 'sentido', texto: si
              ? `Positivo: el ${met} se disuelve y se deposita ${ion}. La cantidad de metal no cambia ese signo.`
              : `Negativo: no pasa nada. Al revés, ${ion} metálico en ${MET[met].ion}, sí ocurriría: ${fv(-e)}.` },
          ],
          respuesta: [`${si ? 'Sí ocurre sola' : 'No ocurre'}: `, E0, ` = ${fv(e)}`],
        };
      },
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
    // Lee (fase 2): carga y faraday como vocabulario. No compara metales (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Metal puesto con corriente', texto: 'Muchas piezas se platean o se cobrean con corriente: se cuelgan en una disolución con iones del metal, y una fuente los va depositando encima, capa por capa. Eso es una electrólisis.' },
        { titulo: 'La carga que pasa', texto: 'La carga Q que pasa por la celda es la corriente por el tiempo, con el tiempo en segundos. Se mide en coulomb: 2 A durante un minuto son 120 C.',
          ecuacion: ['Q = ', I, ' · t'] },
        { titulo: 'Un mol de electrones', texto: 'Un mol de electrones lleva unos 96 485 C. Esa carga se llama faraday, F. Contar coulomb es una manera de contar electrones.' },
        { titulo: 'Qué mirar', texto: 'La recta turquesa es la masa de cobre depositada con el tiempo. Sube la corriente y fíjate cómo cambia su inclinación.' },
      ],
    },
    juega: {
      consigna: 'La gráfica muestra el cobre que una fuente deposita en el cátodo; una hora pasa en 6 s. Elige la corriente y mira la masa.',
      voz: 'Mira cómo cambia la recta al subir la corriente.',
      // Animación (ronda 5): t corre solo de 0 a 60 min (10 min por segundo); la recta se dibuja llena hasta t y
      // punteada después.
      controles: [
        { id: 'i', etiqueta: 'I', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 2, unidad: 'A', decimales: 0 },
        { id: 't', etiqueta: 't', min: 0, max: 60, paso: 10, inicio: 0, unidad: 'min', decimales: 0, auto: { velocidad: 10 } },
      ],
      dibujo: val => ({ datos: ejesM({ curvas: [{ puntos: [[val.t, mDep('Cu', val.i, val.t)], [60, mDep('Cu', val.i, 60)]], color: 'i', discontinua: true, rotulo: `Cu, ${f(val.i, 1)} A`, en: [10, 7] }, { puntos: [[0, 0], [val.t, mDep('Cu', val.i, val.t)]], color: 'i' }], puntos: [{ x: val.t, y: mDep('Cu', val.i, val.t), color: 'i', rotulo: `${f(mDep('Cu', val.i, val.t))} g`, guias: true }] }), estado: {} }),
      lectura: val => ['Q = ', I, `·t = ${f(val.i * val.t * 60, 0)} C · `, m, ` = ${f(mDep('Cu', val.i, val.t))} g`],
      minimo: 3,
      // Dos manijas: el punto se corre por la recta (elige t) y el extremo de la recta sube o baja (elige I: más corriente,
      // más pendiente). La masa responde en la lectura.
      arrastres: [
        { id: 'tiempo', etiqueta: 'tiempo sobre la recta', color: 'c-i',
          donde: val => { const g = Kit.piezas.ejes.geometria(ejesM()); return { x: g.X(val.t), y: g.Y(mDep('Cu', val.i, val.t)) }; },
          mover: pt => { const g = Kit.piezas.ejes.geometria(ejesM()); return { t: (pt.x - g.X(0)) * 60 / (g.X(60) - g.X(0)) }; } },
        { id: 'corriente', etiqueta: 'extremo de la recta: más arriba, más corriente', color: 'c-o',
          donde: val => { const g = Kit.piezas.ejes.geometria(ejesM()); return { x: g.X(60), y: g.Y(mDep('Cu', val.i, 60)) }; },
          mover: pt => { const g = Kit.piezas.ejes.geometria(ejesM()), mm = (pt.y - g.Y(0)) * 8 / (g.Y(8) - g.Y(0)); return { i: mm / mDep('Cu', 1, 60) }; } },
      ],
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
    // Hallazgo 9: son dos representaciones a propósito. La gráfica m–t del juego dice cuánto se deposita; la celda de
    // «Mira» dice por dónde va la carga y dónde ocurre cada proceso, que es lo que el paso a paso explica antes de contar.
    // La recta del juego vuelve en el revelado de la predicción.
    mira: {
      pieza: 'quim-celda',
      datos: { tipo: 'electrolitica', izq: { electrodo: 'C', rol: 'ánodo', proceso: 'oxidación', color: 'h' }, der: { electrodo: 'C', rol: 'cátodo', proceso: 'reducción', color: 'i', disolucion: 'CuSO₄(ac)' },
        electrones: 'der', iones: true, medidor: '2 A', desde: { electrones: 1, roles: 2, iones: 3, medidor: 4 } },
      voz: 'Sigamos la carga desde la fuente.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La fuente empuja electrones hacia un electrodo: la reacción no ocurriría sola.' },
        { estado: { corte: 2 }, texto: 'En el cátodo el Cu²⁺ toma dos electrones y se deposita.', ecuacion: ['Cu²⁺ + 2e⁻ → Cu'] },
        { estado: { corte: 3 }, texto: 'En el líquido, los iones llevan la carga de un electrodo al otro.' },
        { estado: { corte: 4 }, texto: 'En 30 min con 2 A pasan 3\u00a0600 C.', ecuacion: ['Q = ', I, '·t = 2 · 1\u00a0800 = 3\u00a0600 C'] },
        { estado: { corte: 4 }, texto: 'Cada mol de cobre necesita 2 mol de electrones.', ecuacion: [m, ' = ', { frac: [['63,55 · 3\u00a0600'], ['2 · 96\u00a0485']] }, ` = ${f(mDep('Cu', 2, 30))} g`] },
      ],
    },
    regla: {
      texto: 'En la electrólisis una fuente fuerza una redox que no ocurre sola. La masa depositada es proporcional a la carga que pasa e inversa a los electrones por ion.',
      ecuacion: [m, ' = ', { frac: [['M ', I, ' t'], [{ llave: ['z'], nota: 'e⁻ por ion' }, ' F']] }, '   ·   ', 'F = 96\u00a0485\u00a0C/mol'],
      condicion: 't en segundos y eficiencia del 100 %; en agua pueden competir otras reacciones, como formar H₂ en vez del metal.',
      voz: 'Carga primero; después, cuántos electrones pide cada ion.',
    },
    // Así se resuelve (fase 2): la misma ley de «Ahora tú» (mDep), con otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), x = r.de(['Cu', 'Ag', 'Zn', 'Ni']), i = r.ent(1, 6), t = 5 * r.ent(2, 12), X = MET[x];
        const q = i * t * 60, ne = q / F, mm = mDep(x, i, t);
        return {
          enunciado: [`Una corriente `, I, ` = ${f(i, 0)} A pasa ${f(t, 0)} min por una disolución de ${X.ion}. ¿Qué masa `, m, ` de ${x} se deposita? (M = ${f(X.M)} g/mol)`],
          pasos: [
            { tipo: 'pide', texto: ['Piden la masa ', m, ` de ${x} que se deposita en el cátodo.`] },
            { tipo: 'datos', texto: `La corriente, el tiempo pasado a segundos, la masa molar y los electrones que toma cada ${X.ion}.`,
              ecuacion: [I, ` = ${f(i, 0)} A · t = ${f(t, 0)} · 60 = ${f(t * 60, 0)} s · M = ${f(X.M)} g/mol · z = ${X.z}`] },
            { tipo: 'regla', texto: 'Primero la carga: corriente por tiempo. Cada 96 485 C es un mol de electrones, y cada mol de metal pide z moles de electrones.' },
            { tipo: 'cuentas', texto: 'Carga, después moles de electrones, después masa.',
              ecuacion: [`Q = ${f(i, 0)} · ${f(t * 60, 0)} = ${f(q, 0)} C → ${f(ne, 4)} mol e⁻ → `, m, ` = ${f(ne, 4)} ÷ ${X.z} · ${f(X.M)} = ${f(mm)} g`] },
            { tipo: 'sentido', texto: `Unos pocos amperios durante minutos depositan gramos, no kilos. Si usabas minutos en vez de segundos, salía 60 veces menos: ${f(mm / 60)} g.` },
          ],
          respuesta: [m, ` = ${f(mm)} g de ${x}`],
        };
      },
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
          solucion: { texto: `Q = I·t con t en segundos; cada ion toma ${X.z} electrón${X.z > 1 ? 'es' : ''}.`, ecuacion: [m, ` = ${f(X.M)} · ${f(i, 0)} · ${f(t * 60, 0)} / (${X.z} · 96\u00a0485) = ${f(mm)} g`] },
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
    // Lee (fase 2): qué es el mapa y sus ejes. No dice dónde están las líneas ni cómo cambian con el pH (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Rejas que se oxidan', texto: 'En Puno, las rejas y los techos de calamina se corroen con la lluvia y la humedad. Para saber qué es estable en el agua, los químicos usan un mapa de dos datos.' },
        { titulo: 'Los ejes del mapa', texto: ['En el eje horizontal va el pH, de 0, muy ácido, a 14, muy básico. En el vertical va el potencial ', E, ' del electrodo, en voltios: más arriba, más oxidante.'] },
        { titulo: 'Las dos líneas del agua', texto: 'El agua puede oxidarse y soltar oxígeno, O₂, o reducirse y soltar hidrógeno, H₂. Cada cambio tiene su línea en el mapa, y cada punto cae arriba, abajo o entre ellas.' },
        { titulo: 'Qué mirar', texto: 'El punto sube y baja solo. Cambia el pH y fíjate en qué potencial cruza el punto cada línea del agua.' },
      ],
    },
    juega: {
      consigna: 'El punto sube y baja solo: es el potencial. Elige el pH y mira qué zonas cruza: qué le pasa al agua.',
      voz: 'Busca los bordes de la zona donde el agua no cambia.',
      // Animación (ronda 5): E barre de −1 a 1,5 V y vuelve (0,5 V por segundo); el punto cruza las dos líneas del agua.
      controles: [
        { id: 'p', etiqueta: 'pH', min: 0, max: 14, paso: 1, inicio: 7, decimales: 0 },
        { id: 'e', etiqueta: 'E', color: 'c-d', min: -1, max: 1.5, paso: 0.25, inicio: 0.5, unidad: 'V', decimales: 2, auto: { velocidad: 0.5, modo: 'rebota' } },
      ],
      dibujo: val => ({ datos: ejesP({ puntos: [{ x: val.p, y: val.e, color: 'd', guias: true }] }), estado: {} }),
      lectura: val => [`pH ${f(val.p, 0)}, `, E, ` = ${f(val.e)} V: ${zona(val.p, val.e)}.`],
      minimo: 4,
      // El punto se arrastra en las dos direcciones: hacia los lados cambia el pH y hacia arriba el potencial.
      arrastres: [{ id: 'punto', etiqueta: 'punto (pH, potencial)', color: 'c-d',
        donde: val => { const g = Kit.piezas.ejes.geometria(ejesP()); return { x: g.X(val.p), y: g.Y(val.e) }; },
        mover: pt => { const g = Kit.piezas.ejes.geometria(ejesP()); return { p: (pt.x - g.X(0)) * 14 / (g.X(14) - g.X(0)), e: -1 + (pt.y - g.Y(-1)) * 2.5 / (g.Y(1.5) - g.Y(-1)) }; } }],
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
      ecuacion: [E, ' = 1,23\u00a0−\u00a00,0592\u00a0pH', '   ·   ', E, ' = −0,0592\u00a0pH'],
      condicion: 'a 25 °C y gases a 1 atm. Es termodinámica: no dice la rapidez de un proceso, por ejemplo de la corrosión.',
      voz: 'Ubica el punto y lee la zona.',
    },
    // Así se resuelve (fase 2): la misma línea de «Ahora tú» (eO2 o eH2), con otras semillas; la línea alterna al revés.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), p = r.ent(1, 13), arriba = s % 2 === 1;
        const e = arriba ? eO2(p) : eH2(p), otra = arriba ? eH2(p) : eO2(p);
        return {
          enunciado: ['A pH ', `${f(p, 0)} y 25 °C, ¿a qué potencial `, E, ` está la línea donde el agua ${arriba ? 'empieza a oxidarse a O₂' : 'empieza a reducirse a H₂'}?`],
          dibujo: { datos: ejesP(), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden el potencial ', E, ` de la línea ${arriba ? 'de arriba, O₂/H₂O' : 'de abajo, H₂O/H₂'}, justo en pH ${f(p, 0)}.`] },
            { tipo: 'datos', texto: `El pH es ${f(p, 0)} y la temperatura, 25 °C. A pH 0, esa línea está en ${arriba ? '1,23 V' : '0 V'}.` },
            { tipo: 'regla', texto: 'Las dos líneas del agua bajan 0,0592 V por cada unidad de pH. Se parte del valor a pH 0 y se resta.' },
            { tipo: 'cuentas', texto: `Reemplazo pH = ${f(p, 0)} en la ecuación de la línea.`,
              ecuacion: [E, ` = ${arriba ? '1,23' : '0'} − 0,0592 · ${f(p, 0)} = ${fv(e)}`],
              dibujo: { datos: ejesP({ puntos: [{ x: p, y: e, color: 'd', rotulo: fv(e), guias: true }] }), estado: {} } },
            { tipo: 'sentido', texto: `Quedó por debajo de su valor a pH 0, porque la línea baja. La otra línea va siempre 1,23 V ${arriba ? 'más abajo' : 'más arriba'}: aquí, ${fv(otra)}.` },
          ],
          respuesta: [E, ` = ${fv(e)}`],
        };
      },
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

  // ---------- Laboratorio ----------
  const TODOS = ['Mg', 'Zn', 'Fe', 'Ni', 'Pb', 'Cu', 'Ag'];
  const eLab = val => MET[val.ion].e0 - MET[val.met].e0;   // el E° que rotula la flecha
  const DEPOSITA = ['Cu', 'Ag', 'Zn', 'Ni', 'Pb'];
  const FILA_LAB = { Mg: 2, Zn: 1, Fe: 2, Ni: 3, Pb: 4, Cu: 1, Ag: 3 };
  // Los siete pares (con Ni, que la escala de la idea no trae), repartidos en tres filas para que no choquen los rótulos.
  const escalaLab = val => Object.assign(ESCALA([...TODOS.map((x, i) => ({ tipo: 'punto', x: MET[x].e0, rotulo: `${MET[x].ion}/${x}`, fila: FILA_LAB[x], abierto: true })), { tipo: 'salto', a: MET[val.met].e0, b: MET[val.ion].e0, color: 'd', rotulo: val.met === val.ion ? '0 V' : fv(MET[val.ion].e0 - MET[val.met].e0), fila: 0 }], false),
    { filas: 4, alt: `Escala de potenciales con una flecha del par ${MET[val.met].ion}/${val.met} al par ${MET[val.ion].ion}/${val.ion}: E° = ${fv(MET[val.ion].e0 - MET[val.met].e0)}.` });
  const depLab = val => ejesM({
    x: { min: 0, max: 120, paso: 20, nombre: 't', unidad: 'min', decimales: 0 },
    y: { min: 0, max: 50, paso: 10, nombre: 'm', unidad: 'g', decimales: 0, color: 'i' },
    curvas: [{ puntos: [[0, 0], [120, mDep('Cu', val.i, 120)]], color: 'i', discontinua: val.x !== 'Cu', rotulo: val.x === 'Cu' ? `Cu, ${f(val.i, 1)} A` : 'Cu' }]
      .concat(val.x === 'Cu' ? [] : [{ puntos: [[0, 0], [120, mDep(val.x, val.i, 120)]], color: 'i', rotulo: `${val.x}, ${f(val.i, 1)} A` }]),
    puntos: [{ x: val.t, y: mDep(val.x, val.i, val.t), color: 'i', rotulo: `${f(mDep(val.x, val.i, val.t))} g`, guias: true }],
    alt: `Masa de ${val.x} depositada contra tiempo con ${f(val.i, 1)} A: ${f(mDep(val.x, val.i, val.t))} g a los ${f(val.t, 0)} min. La recta punteada es la del cobre.`,
  });
  // La pila que trabaja (ronda 5): una pila galvánica que entrega la corriente I durante t. Faraday (mDep) dice cuánta
  // masa pierde el ánodo y cuánta gana el cátodo con la misma carga. Cada barra empieza con 10 g; su ancho sigue a la
  // raíz de su masa (barra de sección cuadrada y largo fijo). La rapidez de los puntos crece con I; es de dibujo.
  const M0 = 10;
  const papeles = val => { const an = MET[val.a].e0 < MET[val.b].e0 ? val.a : val.b; return { an, ca: an === val.a ? val.b : val.a }; };
  const cambio = val => {
    if (val.a === val.b) return { pierde: 0, gana: 0 };
    const { an, ca } = papeles(val);
    return { pierde: Math.min(M0, mDep(an, val.i, val.t)), gana: mDep(ca, val.i, val.t) };
  };
  const pilaLab = val => {
    const p = pila(val.a, val.b).datos;
    if (val.a === val.b) return { datos: p, estado: {} };
    const { an, ca } = papeles(val), c = cambio(val), izqAn = an === val.a;
    const gAn = Math.sqrt((M0 - c.pierde) / M0), gCa = Math.sqrt((M0 + c.gana) / M0);
    return { datos: Object.assign({}, p, { flujo: val.i * val.t / 20, grosor: { izq: izqAn ? gAn : gCa, der: izqAn ? gCa : gAn },
      alt: `Pila de ${an} (ánodo) y ${ca} (cátodo) con ${f(val.i, 1)} A durante ${f(val.t, 0)} min: el ${an} pierde ${f(c.pierde)} g y el ${ca} gana ${f(c.gana)} g. Los electrones van por el alambre; los iones, por el puente.` }), estado: {} };
  };
  const zonaCorta = (p, e) => (e > eO2(p) ? 'se oxida' : e < eH2(p) ? 'se reduce' : 'estable');
  const mapaLab = val => ejesP({
    curvas: ejesP().curvas.concat([{ puntos: [[0, MET[val.x].e0], [14, MET[val.x].e0]], color: 'h', discontinua: true, rotulo: `${MET[val.x].ion} / ${val.x}`, en: [2, MET[val.x].e0 + 0.12] }]),
    puntos: [{ x: val.p, y: val.e, color: 'd', rotulo: `(${f(val.p, 0)}; ${f(val.e)} V)` }],
    alt: `Diagrama potencial-pH del agua con la línea horizontal del par ${MET[val.x].ion}/${val.x} en ${fv(MET[val.x].e0)}; el punto está en pH ${f(val.p, 0)} y ${f(val.e)} V.`,
  });

  return {
    unidad: 'quimica.electroquimica',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-celda.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'En una carta de marzo de 1800, Alessandro Volta describió una pila de discos metálicos que sostenía una corriente eléctrica. Décadas después, Michael Faraday midió cuánta materia transformaba una cantidad de electricidad y publicó sus resultados en 1834. Hoy los contamos con electrones e iones: una pila saca corriente de una reacción, y la electrólisis usa corriente para forzarla.',
      pregunta: '¿Cómo medirías cuánta materia transforma una corriente?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §17.2 y §17.7', url: 'https://openstax.org/books/chemistry-2e/pages/17-7-electrolysis' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso. Los ejemplos se calculan aquí.
    glosario: [
      { termino: 'pila galvánica', formas: ['pila galvánica', 'pilas galvánicas', 'pila', 'pilas'],
        def: 'Dispositivo que saca corriente eléctrica de una redox espontánea, con la oxidación y la reducción en vasos separados.',
        ejemplo: `Zinc y cobre: ${fv(MET.Cu.e0 - MET.Zn.e0)}.`, ver: ['ánodo', 'cátodo', 'puente salino'] },
      { termino: 'electrodo', def: 'Pieza conductora, casi siempre un metal, donde ocurre la oxidación o la reducción.',
        ver: ['ánodo', 'cátodo'] },
      { termino: 'ánodo', def: 'Electrodo donde ocurre la oxidación; de ahí salen los electrones hacia el alambre.',
        ejemplo: 'En la pila de zinc y cobre: Zn → Zn²⁺ + 2e⁻.', ver: ['cátodo', 'oxidación'] },
      { termino: 'cátodo', def: 'Electrodo donde ocurre la reducción: ahí llegan los electrones y una especie los toma.',
        ejemplo: 'Cu²⁺ + 2e⁻ → Cu: el cobre se deposita.', ver: ['ánodo', 'reducción'] },
      { termino: 'puente salino', formas: ['puente salino', 'puente'],
        def: 'Tubo con una sal disuelta que une los dos vasos: por él viajan iones y se cierra el circuito.',
        ver: ['pila galvánica'] },
      { termino: 'potencial de reducción', simbolo: 'E°', medida: 'V', formas: ['potencial de reducción', 'potenciales de reducción', 'potencial', 'potenciales'],
        def: 'Tendencia de un par a tomar electrones, en voltios, comparada con el hidrógeno. Mientras más alto, más fácil se reduce.',
        ejemplo: `Cu²⁺/Cu: ${fv(MET.Cu.e0)}; Zn²⁺/Zn: ${fv(MET.Zn.e0)}.`, ver: ['fuerza electromotriz'] },
      { termino: 'fuerza electromotriz', formas: ['fuerza electromotriz', 'fem'],
        def: 'Diferencia de potencial de una pila: el del cátodo menos el del ánodo.',
        ejemplo: `${f(MET.Cu.e0)} − (${f(MET.Zn.e0)}) = ${fv(MET.Cu.e0 - MET.Zn.e0)}.`, ver: ['potencial de reducción'] },
      { termino: 'reacción espontánea', formas: ['reacción espontánea', 'espontánea', 'espontáneas', 'espontáneo'],
        def: 'La que ocurre sola, sin que una fuente la empuje. En una redox, pasa cuando E° es positivo.',
        ver: ['energía libre'] },
      { termino: 'energía libre', simbolo: 'ΔG°', medida: 'kJ/mol', def: 'Energía disponible para hacer trabajo; si baja durante la reacción, esta ocurre sola.',
        ver: ['reacción espontánea'] },
      { termino: 'metal noble', formas: ['metal noble', 'metales nobles', 'noble', 'nobles'],
        def: 'Metal que se oxida con dificultad, como la plata o el oro: su potencial de reducción es alto.',
        ver: ['potencial de reducción'] },
      { termino: 'electrólisis', def: 'Uso de una corriente externa para forzar una redox que no ocurriría sola.',
        ejemplo: `2 A durante 30 min depositan ${f(mDep('Cu', 2, 30))} g de cobre.`, ver: ['faraday'] },
      { termino: 'faraday', simbolo: 'F', medida: 'C/mol', def: 'Carga eléctrica de un mol de electrones: unos 96 485 coulomb.',
        ejemplo: `2 mol de electrones llevan ${f(2 * F, 0)} C.`, ver: ['electrólisis'] },
      { termino: 'coulomb', simbolo: 'C', def: 'Unidad de carga eléctrica: la que lleva una corriente de 1 A en 1 s.',
        ejemplo: `2 A durante 1 min: 2 · 60 = ${f(2 * 60, 0)} C.`, ver: ['faraday'] },
      { termino: 'diagrama de Pourbaix', formas: ['diagrama de Pourbaix', 'Pourbaix'],
        def: 'Mapa de potencial contra pH que muestra qué especie es estable en cada zona.',
        ver: ['potencial de reducción'] },
    ],
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La primera (ronda 5, animada) es una pila que trabaja: el
    // ánodo adelgaza y el cátodo engorda según Faraday. La segunda abre la escala a los siete pares, en los dos
    // sentidos (la idea 2 solo deja metales activos contra iones nobles). La tercera deposita cinco metales con más
    // corriente y más tiempo, con la recta del cobre de fondo. La cuarta pone un metal sobre el mapa del agua: se ve que
    // su línea no depende del pH. Las lecturas dicen entradas y resultado, para que el caso guardado se lea solo.
    laboratorio: [
      {
        id: 'pila-que-trabaja', titulo: 'La pila que trabaja', pieza: 'quim-celda',
        consigna: 'La pila da corriente sola; una hora pasa en 6 s. Mira el ánodo adelgazar y el cátodo engordar con metal nuevo.',
        controles: [
          { id: 'a', etiqueta: 'Izquierda', opciones: ['Mg', 'Zn', 'Fe', 'Cu'].map(x => ({ valor: x, texto: x })) },
          { id: 'b', etiqueta: 'Derecha', opciones: ['Zn', 'Pb', 'Cu', 'Ag'].map(x => ({ valor: x, texto: x })) },
          { id: 'i', etiqueta: 'I', color: 'c-o', min: 0.5, max: 5, paso: 0.5, inicio: 2, unidad: 'A', decimales: 1 },
          { id: 't', etiqueta: 't', min: 0, max: 60, paso: 5, inicio: 0, unidad: 'min', decimales: 0, auto: { velocidad: 10 } },
        ],
        dibujo: val => pilaLab(val),
        lectura: val => {
          if (val.a === val.b) return ['Metales iguales: no hay corriente.'];
          const { an, ca } = papeles(val), c = cambio(val);
          return [`${f(val.t, 0)} min · `, m, `(${an}) −${f(c.pierde)} g · `, m, `(${ca}) +${f(c.gana)} g`];
        },
        // Retos: los comprueba mDep (Faraday), la misma cuenta que adelgaza y engorda las barras.
        invitaciones: [
          { texto: 'Pausa la pila cuando el cátodo ya ganó más de 1 g.',
            logrado: val => cambio(val).gana > 1,
            bien: 'Cada gramo pide su carga: corriente por tiempo.',
            pista: 'Espera a que la lectura pase de 1 g y pausa; ajusta t con − y +.' },
          { texto: 'Haz que el cátodo gane más masa que la que pierde el ánodo.',
            logrado: val => cambio(val).gana > cambio(val).pierde + 1e-9,
            bien: 'Los mismos electrones, pero cada metal pesa distinto por mol.' },
          { texto: 'Con plata en el cátodo, logra que gane más de 10 g.',
            logrado: val => val.a !== val.b && papeles(val).ca === 'Ag' && cambio(val).gana > 10,
            bien: 'Un electrón por átomo y átomos pesados: la plata engorda rápido.' },
          { texto: 'Arma la pila de mayor fem.',
            logrado: val => val.a === 'Mg' && val.b === 'Ag',
            bien: `Magnesio y plata: los más alejados en la escala, ${fv(MET.Ag.e0 - MET.Mg.e0).replace('+', '')}.` },
        ],
      },
      {
        id: 'escala-completa', titulo: 'Cualquier metal, cualquier ion', pieza: 'recta',
        consigna: 'Arrastra la cola de la flecha a un metal y la punta a un ion. Busca qué pares reaccionan solos.',
        controles: [
          { id: 'met', etiqueta: 'Metal', opciones: TODOS.map(x => ({ valor: x, texto: x })) },
          { id: 'ion', etiqueta: 'Disolución', opciones: TODOS.slice().reverse().map(x => ({ valor: x, texto: MET[x].ion })) },
        ],
        dibujo: val => ({ datos: escalaLab(val), estado: {} }),
        lectura: val => { const e = MET[val.ion].e0 - MET[val.met].e0; return [`${val.met} en ${MET[val.ion].ion} → `, E0, ` = ${fv(e)}: ${e > 0 ? 'ocurre' : 'no ocurre'}`]; },
        arrastres: flechaEsc(TODOS, TODOS, escalaLab),
        // Retos (docs/teoria.md §4d): los comprueba eLab, el mismo E° que rotula la flecha.
        invitaciones: [
          { texto: 'Pon un metal en una disolución con la que no reaccione.',
            logrado: val => eLab(val) < 0,
            bien: 'El ion está más abajo que el metal: no toma sus electrones.' },
          { texto: 'Busca un par que dé exactamente +1,10 V.',
            logrado: val => Math.abs(eLab(val) - 1.1) < 1e-9,
            bien: 'Zinc en Cu²⁺: la misma pila de los dos vasos.' },
          { texto: 'Busca el par que reacciona solo con la menor fem posible.',
            logrado: val => eLab(val) > 0 && TODOS.every(a => TODOS.every(b => MET[b].e0 - MET[a].e0 <= 0 || MET[b].e0 - MET[a].e0 >= eLab(val) - 1e-9)),
            bien: 'Muy poco, pero positivo: igual ocurre. Lo que manda es el signo.' },
          { texto: 'Guarda un par y el mismo par al revés.',
            logrado: (val, guardados) => val.met !== val.ion && guardados.some(g => g.met === val.ion && g.ion === val.met)
              && guardados.some(g => g.met === val.met && g.ion === val.ion),
            bien: 'Mismo número con otro signo: solo un sentido es una reacción espontánea.' },
        ],
      },
      {
        id: 'deposito-libre', titulo: 'Deposita cualquier metal', pieza: 'ejes',
        consigna: 'Elige el metal, la corriente y el tiempo. Compara su recta con la del cobre, punteada.',
        controles: [
          { id: 'x', etiqueta: 'Metal', opciones: ['Cu', 'Ag', 'Zn', 'Ni', 'Pb'].map(x => ({ valor: x, texto: `${x} (${MET[x].ion})` })) },
          { id: 'i', etiqueta: 'I', color: 'c-o', min: 0.5, max: 5, paso: 0.5, inicio: 2, unidad: 'A', decimales: 1 },
          { id: 't', etiqueta: 't', min: 5, max: 120, paso: 5, inicio: 60, unidad: 'min', decimales: 0 },
        ],
        dibujo: val => ({ datos: depLab(val), estado: {} }),
        lectura: val => [`${val.x}: ${f(val.i, 1)} A · ${f(val.t, 0)} min → `, m, ` = ${f(mDep(val.x, val.i, val.t))} g`],
        arrastres: [
          { id: 'tiempo', etiqueta: 'tiempo sobre la recta', color: 'c-i',
            donde: val => { const g = Kit.piezas.ejes.geometria(depLab(val)); return { x: g.X(val.t), y: g.Y(mDep(val.x, val.i, val.t)) }; },
            mover: (pt, val) => { const g = Kit.piezas.ejes.geometria(depLab(val)); return { t: (pt.x - g.X(0)) * 120 / (g.X(120) - g.X(0)) }; } },
          { id: 'corriente', etiqueta: 'extremo de la recta: más arriba, más corriente', color: 'c-o',
            donde: val => { const g = Kit.piezas.ejes.geometria(depLab(val)); return { x: g.X(120), y: g.Y(mDep(val.x, val.i, 120)) }; },
            mover: (pt, val) => { const g = Kit.piezas.ejes.geometria(depLab(val)), mm = (pt.y - g.Y(0)) * 50 / (g.Y(50) - g.Y(0)); return { i: mm / mDep(val.x, 1, 120) }; } },
        ],
        // Retos: los comprueba mDep, la misma ley de Faraday que traza las rectas.
        invitaciones: [
          { texto: 'Con 5 A, busca el menor tiempo que deposita al menos 10 g de cobre.',
            logrado: val => val.x === 'Cu' && val.i === 5 && mDep('Cu', 5, val.t) >= 10 && mDep('Cu', 5, val.t - 5) < 10,
            bien: 'Más de hora y media para 10 g. ¿Cuánto tardaría la plata?' },
          { texto: 'Busca el metal que menos masa deposita con la misma corriente y tiempo.',
            logrado: val => DEPOSITA.every(x => mDep(val.x, val.i, val.t) <= mDep(x, val.i, val.t) + 1e-12),
            bien: 'El níquel: masa molar baja y dos electrones por átomo.' },
          { texto: 'Guarda plata y cobre con la misma corriente y el mismo tiempo.',
            logrado: (val, guardados) => (val.x === 'Ag' || val.x === 'Cu') && guardados.some(g => (g.x === 'Ag' || g.x === 'Cu') && g.x !== val.x && g.i === val.i && g.t === val.t)
              && guardados.some(g => g.x === val.x && g.i === val.i && g.t === val.t),
            bien: 'Misma carga, pero la plata pesa más del triple: un electrón por átomo, no dos.' },
          { texto: 'Guarda dos casos del mismo metal, igual masa y distinta corriente.',
            logrado: (val, guardados) => guardados.some(g => g.x === val.x && g.i !== val.i && Math.abs(mDep(g.x, g.i, g.t) - mDep(val.x, val.i, val.t)) < 1e-9)
              && guardados.some(g => g.x === val.x && g.i === val.i && g.t === val.t),
            bien: 'La masa sigue a la carga, corriente por tiempo, no a la corriente sola.' },
        ],
      },
      {
        id: 'metal-en-el-mapa', titulo: 'Un metal en el mapa', pieza: 'ejes',
        consigna: 'Elige un metal: su línea es horizontal. Mueve el punto y lee qué le pasa al agua y al metal.',
        controles: [
          { id: 'x', etiqueta: 'Metal', opciones: ['Zn', 'Fe', 'Cu', 'Ag'].map(x => ({ valor: x, texto: x })) },
          { id: 'p', etiqueta: 'pH', min: 0, max: 14, paso: 1, inicio: 7, decimales: 0 },
          { id: 'e', etiqueta: 'E', color: 'c-d', min: -1, max: 1.5, paso: 0.05, inicio: 0, unidad: 'V', decimales: 2 },
        ],
        dibujo: val => ({ datos: mapaLab(val), estado: {} }),
        lectura: val => [`pH ${f(val.p, 0)} · ${f(val.e)} V → agua ${zonaCorta(val.p, val.e)} · ${val.x} ${val.e > MET[val.x].e0 ? 'se oxida' : 'estable'}`],
        arrastres: [{ id: 'punto', etiqueta: 'punto (pH, potencial)', color: 'c-d',
          donde: val => { const g = Kit.piezas.ejes.geometria(ejesP()); return { x: g.X(val.p), y: g.Y(val.e) }; },
          mover: pt => { const g = Kit.piezas.ejes.geometria(ejesP()); return { p: (pt.x - g.X(0)) * 14 / (g.X(14) - g.X(0)), e: -1 + (pt.y - g.Y(-1)) * 2.5 / (g.Y(1.5) - g.Y(-1)) }; } }],
        // Retos: los comprueban eO2, eH2 y el E° del metal, las mismas líneas del mapa.
        invitaciones: [
          { texto: 'Lleva el punto a donde el agua se reduce y suelta H₂.',
            logrado: val => val.e < eH2(val.p),
            bien: 'Bajo la línea de abajo, el agua gana electrones. ¿Qué pasa si subes el pH?' },
          { texto: 'Busca un punto donde el agua y el metal estén estables a la vez.',
            logrado: val => zonaCorta(val.p, val.e) === 'estable' && val.e <= MET[val.x].e0,
            bien: 'Entre las dos líneas y bajo la del metal: ahí no se corroe.' },
          { texto: 'En pH 14, pon el punto justo sobre la línea del H₂.',
            logrado: val => val.p === 14 && Math.abs(val.e - eH2(14)) < 0.025,
            bien: `A pH 14 esa línea bajó a ${fv(eH2(14))}. La del metal no se movió.` },
          { texto: 'Con plata, haz que el metal se oxide sin que el agua suelte O₂.',
            logrado: val => val.x === 'Ag' && val.e > MET.Ag.e0 && zonaCorta(val.p, val.e) !== 'se oxida',
            bien: 'En medio ácido o neutro, la plata se oxida antes que el agua.' },
        ],
      },
    ],
    ideas: [celda, espont, faraday, pourbaix],
  };
});
