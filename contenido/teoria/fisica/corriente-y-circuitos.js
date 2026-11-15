/*
 * Teoría de «Corriente eléctrica y circuitos» (fisica.corriente-y-circuitos). Molde: docs/teoria.md y la unidad de
 * referencia contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 15) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Colores (regla 4): voltaje V y fem ε naranja (c-o), resistencia R turquesa (c-i), corriente I rojo (c-h) y
 * potencia P verde (c-d). La carga, el tiempo y la resistividad van en tinta.
 * Estado: completa (14 nov 2026): seis ideas que cubren los ocho temas del catálogo.
 * Códigos de error: C1, C2, C4, C5, C8, C11 y C14 de docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md.
 * Nuevos (hipótesis, sin dato propio): CI-LUZ (los electrones van casi a la velocidad de la luz), CI-RAPIDO
 * (confunde la rapidez de los electrones con la de la señal), CI-RHO (R crece con el área), CI-REQ (suma resistencias
 * en paralelo), CI-INV (reparte la corriente en proporción a R), CI-UNID (mm² sin pasar a m²).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: seis relaciones de un circuito de una pila, cada una jugada antes de preguntarla.
 *   Persona y condiciones: postulante de 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: halla corrientes y voltajes en serie y en paralelo, y predice qué foco brilla más.
 *   Orden de atención: 1.º el circuito con sus aparatos · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿la corriente se gasta en el foco, o lo que se gasta es energía?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const V = { v: 'c-o', t: 'V' }, EPS = { v: 'c-o', t: 'ε' }, R = { v: 'c-i', t: 'R' }, I = { v: 'c-h', t: 'I' }, P = { v: 'c-d', t: 'P' };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const x = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    x.ent = (lo, hi) => lo + Math.floor(x() * (hi - lo + 1));
    x.de = xs => xs[Math.floor(x() * xs.length)];
    return x;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const o of distractores) {
      const txt = fmt(o.valor);
      if (vistos.has(txt) || !Number.isFinite(o.valor)) continue;
      vistos.add(txt);
      ops.push({ id: o.id, texto: txt, error: o.error, siFuera: o.siFuera });
    }
    return ops.slice(0, 4);
  }
  const A = (lectura, desde) => ({ tipo: 'A', lectura, desde });
  const resist = (rot, extra = {}) => Object.assign({ tipo: 'R', rotulo: rot, color: 'i' }, extra);
  const foco = (rot, brillo, extra = {}) => Object.assign({ tipo: 'foco', rotulo: rot, brillo, color: 'd' }, extra);
  const pila = (eps, extra = {}) => Object.assign({ rotulo: `${f(eps)} V`, color: 'o' }, extra);
  const diez = e => ({ sup: ['10', e] });
  // Reóstato (dato opcional de fis-circuito): alambre de RMAX ohmios con cursor; en el circuito queda k = R/RMAX.
  const reostato = (rot, rr, rmax, extra = {}) => resist(rot, Object.assign({ reostato: rr / rmax }, extra));
  // Gesto directo: la manija es el cursor del reóstato; geometria(datos) de la pieza da dónde cae y qué fracción marca.
  const CIR = () => Kit.piezas['fis-circuito'];
  const cursor = (datos, lugar, k, rmax) => {
    const el = CIR().geometria(datos)[lugar][k];
    return { donde: rr => el.cursor(rr / rmax), mover: pt => el.k(pt) * rmax };
  };

  // ---------- Idea 1: la corriente no se gasta ----------
  // Cambia: el voltaje de la pila y la resistencia del foco · Permanece: dos amperímetros, antes y después del foco ·
  // Progresa: la lectura de los dos, siempre igual · Se reserva: lo lento que avanzan los electrones ·
  // Debe verse: el foco gasta energía, no corriente.
  const N_CU = 8.5e28, QE = 1.6e-19;
  const vDeriva = (i, amm2) => i / (N_CU * QE * amm2 * 1e-6) * 1000;   // mm/s
  // Animación (15 nov): puntos de carga que avanzan por los cables (dato `flujo` de fis-circuito). Recorren 12 px por
  // segundo por cada ampere: con el doble de corriente pasan el doble de rápido. Es una escala, no la rapidez real de
  // los electrones (esa es de milímetros por segundo; la idea 1 lo pregunta). El reloj da vueltas de 20 s.
  const VQ = 12;
  const TQ = { id: 't', etiqueta: 't', color: 'c-d', min: 0, max: 20, paso: 0.5, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } };
  const conFlujo = (fig, tt, it, ramas) => Object.assign({}, fig, { datos: Object.assign({}, fig.datos, { flujo: { fase: it * tt * VQ, ramas: (ramas || []).map(i => i * tt * VQ), color: 'h' } }) });
  const conAmperimetros = (eps, r, o = {}) => {
    const i = eps / r;
    return { datos: { fuente: pila(eps), serie: [A(o.leer === false ? '' : `${f(i, 2)} A`, o.desde), foco(`R = ${f(r)} Ω`, Math.min(1, eps * i / 72), { corriente: o.corriente }), A(o.leer === false ? '' : `${f(i, 2)} A`, o.desde)] }, estado: {} };
  };
  const corriente = {
    id: 'no-se-gasta',
    titulo: 'La corriente no se gasta',
    temas: ['Intensidad y densidad de corriente', 'Modelo de Drude'],
    pieza: 'fis-circuito',
    juega: {
      consigna: 'Un foco entre dos amperímetros. Los puntos marcan la carga que pasa, no su rapidez real. Cambia la pila y el foco: compara los amperímetros.',
      voz: 'Si el foco se comiera corriente, el segundo marcaría menos.',
      controles: [
        { id: 'e', etiqueta: 'ε', color: 'c-o', min: 3, max: 12, paso: 3, inicio: 6, unidad: 'V', decimales: 0 },
        { id: 'r', etiqueta: 'R', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 3, unidad: 'Ω', decimales: 0 },
        TQ,
      ],
      dibujo: val => conFlujo(conAmperimetros(val.e, val.r), val.t, val.e / val.r),
      lectura: val => [I, ` = ${f(val.e / val.r, 2)}\u00a0A antes y después · en ${f(val.t, 1)}\u00a0s pasaron ${f(val.e / val.r * val.t, 1)}\u00a0C`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Por un cable de cobre de 1 mm² de sección pasan 2 A. ¿Más o menos a qué rapidez avanzan sus electrones libres?',
      opciones: [
        { id: 'c', texto: `Unos ${f(vDeriva(2, 1), 2)} mm/s, más lento que una hormiga`, correcta: true },
        { id: 'luz', texto: 'Casi a la rapidez de la luz', error: 'CI-LUZ', siFuera: 'La señal que enciende el foco sí viaja casi así. Cada electrón avanza mucho más lento.' },
        { id: 'auto', texto: 'Unos 2 m/s, como una persona caminando', error: 'CI-RAPIDO', siFuera: 'Sería cierto con muy pocos electrones libres. El cobre tiene muchísimos y basta que avancen despacio.' },
      ],
      dibujo: conAmperimetros(6, 3),
      revelar: conAmperimetros(6, 3, { corriente: { texto: `${f(vDeriva(2, 1), 2)} mm/s`, color: 'h' } }),
      coincide: 'Coincide: hay tantísimos electrones libres que, avanzando lento, igual pasan 2 C cada segundo.',
    },
    mira: {
      datos: conAmperimetros(6, 3, { desde: 1, corriente: { texto: '2 A', color: 'h' } }).datos,
      pasos: [
        { estado: { corte: 0 }, texto: 'Corriente es carga que cruza un corte del cable cada segundo.', ecuacion: [I, ' = ', { frac: ['Δq', 'Δt'] }, ' = 2 C/s = 2 A'] },
        { estado: { corte: 1 }, texto: 'Los dos amperímetros marcan 2 A: la carga no se queda en el foco.', ecuacion: [{ sub: [I, 'antes'] }, ' = ', { sub: [I, 'después'] }] },
        { estado: { corte: 1 }, texto: 'Densidad de corriente: la corriente repartida en el área del cable.', ecuacion: ['J = ', { frac: [I, 'A'] }, ' = 2 A/mm²'] },
        { estado: { corte: 1 }, texto: 'Modelo de Drude: electrones que chocan y avanzan lento en promedio.', ecuacion: [{ sub: ['v', 'd'] }, ' = ', { frac: [I, 'n e A'] }, ` = ${f(vDeriva(2, 1), 2)} mm/s`] },
      ],
    },
    regla: {
      texto: 'En un circuito de una sola malla, la misma corriente pasa por todos los puntos. El foco transforma energía; la carga sigue de largo.',
      ecuacion: [I, ' = ', { frac: ['Δq', 'Δt'] }, '   ·   ', 'J = ', { frac: [I, 'A'] }, '   ·   ', I, ' = ', { llave: ['n e'], nota: 'carga por m³' }, ' A ', { llave: [{ sub: ['v', 'd'] }], nota: 'rapidez media' }],
      condicion: 'corriente estable, sin ramas ni carga que se acumule. La corriente convencional va al revés que los electrones.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const qq = x.de([12, 30, 60, 90, 120]), t = x.de([4, 5, 6, 10, 20]);
          return {
            pregunta: `Por un cable pasan ${f(qq)} C de carga en ${f(t)} s. ¿Cuál es la intensidad de corriente?`,
            opciones: opciones(qq / t, [
              { id: 'por', valor: qq * t, error: 'C2', siFuera: 'Esa cuenta multiplica; la corriente es carga por segundo.' },
              { id: 'inv', valor: t / qq, error: 'C2', siFuera: 'Esa cuenta invierte el cociente.' },
              { id: 'q', valor: qq, error: 'C2', siFuera: 'Esa es la carga total, no la que pasa cada segundo.' },
            ], n => `${f(n, 2)} A`),
            solucion: { texto: 'Carga entre tiempo.', ecuacion: [I, ` = ${f(qq)} / ${f(t)} = ${f(qq / t, 2)} A`] },
          };
        }
        if (tipo === 1) {
          const e = x.de([6, 9, 12]), r1 = x.de([2, 3]), r2 = x.de([1, 3, 6]), i = e / (r1 + r2);
          return {
            pregunta: ['Una pila de ', `${f(e)} V alimenta dos resistencias en serie, de ${f(r1)} Ω y ${f(r2)} Ω. Un amperímetro va después de las dos. ¿Qué marca?`],
            dibujo: { datos: { fuente: pila(e), serie: [resist(`${f(r1)} Ω`), resist(`${f(r2)} Ω`), A('?')] }, estado: {} },
            opciones: opciones(i, [
              { id: 'gasta', valor: e / r1 - e / (r1 + r2) > 0 ? i / 2 : i / 3, error: 'C2', siFuera: 'Esa cuenta supone que cada resistencia se queda con parte de la corriente.' },
              { id: 'primera', valor: e / r1, error: 'C4', siFuera: 'Esa es la corriente si solo existiera la primera resistencia.' },
              { id: 'segunda', valor: e / r2, error: 'C4', siFuera: 'Esa es la corriente si solo existiera la segunda.' },
            ], n => `${f(n, 2)} A`),
            solucion: { texto: 'En serie, la misma corriente pasa por todo: se usa la resistencia total.', ecuacion: [I, ` = ${f(e)} / (${f(r1)} + ${f(r2)}) = ${f(i, 2)} A`] },
          };
        }
        const i = x.de([1, 2, 4, 5]), amm = x.de([1, 2, 4]), vd = vDeriva(i, amm);
        return {
          pregunta: [`Un cable de cobre de ${f(amm)} mm² lleva ${f(i)} A. Con n = 8,5 × `, diez('28'), ' electrones/m³ y e = 1,6 × ', diez('−19'), ' C, ¿qué rapidez media tienen los electrones?'],
          opciones: opciones(vd, [
            { id: 'unid', valor: vd / 1e6, error: 'CI-UNID', siFuera: 'Esa cuenta deja el área en mm². Hay que pasarla a m².' },
            { id: 'sin-i', valor: vd / i, error: 'C2', siFuera: 'Esa sería con 1 A; aquí la corriente es otra.' },
            { id: 'luz', valor: vd * 1000, error: 'CI-RAPIDO', siFuera: 'Esa cuenta da metros en lugar de milímetros por segundo.' },
          ], n => `${f(n, 3)} mm/s`),
          solucion: { texto: 'Se despeja v de I = n e A v, con el área en m².', ecuacion: [{ sub: ['v', 'd'] }, ` = ${f(i)} / (8,5×`, diez('28'), ' · 1,6×', diez('−19'), ` · ${f(amm)}×`, diez('−6'), `) = ${f(vd, 3)} mm/s`] },
        };
      },
    },
  };

  // ---------- Idea 2: Ohm y la resistividad ----------
  // Cambia: el material, el largo y el grosor del alambre · Permanece: la recta V–I pasa por el origen ·
  // Progresa: la pendiente, que es R · Se reserva: cambiar largo y área a la vez ·
  // Debe verse: R crece con el largo y baja con el área; para un óhmico, V/I no cambia.
  const RHO = { nicromo: 1.1e-6, constantan: 4.9e-7 };   // Ω·m
  const resistencia = (mat, L, amm) => RHO[mat] * L / (amm * 1e-6);
  const EJE_VI = () => ({
    x: { min: 0, max: 4, paso: 1, nombre: 'I', unidad: 'A', decimales: 0, color: 'h' },
    y: { min: 0, max: 20, paso: 5, nombre: 'V', unidad: 'V', decimales: 0, color: 'o' },
  });
  const rectaVI = (rr, rotulo, extra = {}) => {
    const imax = Math.min(4, 20 / rr);
    return Object.assign({ puntos: [[0, 0], [imax, rr * imax]], color: 'i', rotulo }, extra);
  };
  const ohm = {
    id: 'ohm-resistividad',
    titulo: 'La pendiente es la resistencia',
    temas: ['Resistencia, resistividad y ley de Ohm'],
    pieza: 'ejes',
    juega: {
      consigna: 'Un alambre metálico en una fuente que sube y baja sola. Mira el punto en la recta V contra I. Cambia material y largo.',
      voz: 'Más empinada quiere decir más voltaje para la misma corriente.',
      controles: [
        { id: 'm', etiqueta: 'Material', opciones: [{ valor: 'nicromo', texto: 'Nicromo' }, { valor: 'constantan', texto: 'Constantán' }] },
        { id: 'L', etiqueta: 'Largo', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'm', decimales: 0 },
        { id: 'i', etiqueta: 'corriente', color: 'c-h', min: 0, max: 1, paso: 0.25, inicio: 0.25, unidad: '× máx', decimales: 2, auto: { velocidad: 0.3, modo: 'rebota' } },
      ],
      // El punto: la fuente sube y la corriente crece hasta donde cabe en la gráfica; V = R·I (regla 1).
      dibujo: val => { const rr = resistencia(val.m, val.L, 1), ii = val.i * Math.min(4, 20 / rr); return { datos: Object.assign(EJE_VI(), { curvas: [rectaVI(rr, `R = ${f(rr, 2)} Ω`)], puntos: [{ x: ii, y: rr * ii, color: 'o', guias: true }] }), estado: {} }; },
      lectura: val => { const rr = resistencia(val.m, val.L, 1), ii = val.i * Math.min(4, 20 / rr); return [V, ` = ${f(rr * ii, 1)}\u00a0V, `, I, ` = ${f(ii, 2)}\u00a0A → `, R, ` = ${f(rr, 2)}\u00a0Ω`]; },
      minimo: 3,
      // Arrastra la punta de la recta hacia arriba o abajo: más largo, más empinada (la pendiente es R).
      arrastres: [{ id: 'pendiente', etiqueta: 'punta de la recta V–I (largo del alambre)', color: 'c-i',
        donde: val => { const g = Kit.piezas.ejes.geometria(EJE_VI()), rr = resistencia(val.m, val.L, 1); return { x: g.X(4), y: g.Y(4 * rr) }; },
        mover: (pt, val) => ({ L: Kit.piezas.ejes.geometria(EJE_VI()).Yi(pt.y) / 4 / resistencia(val.m, 1, 1) }) }],
    },
    predice: {
      pregunta: 'Un alambre de nicromo de 2 m y 1 mm² se cambia por otro de nicromo de 4 m y 2 mm². ¿Qué pasa con su resistencia?',
      opciones: [
        { id: 'c', texto: 'No cambia', correcta: true },
        { id: 'doble', texto: 'Se duplica: es más largo', error: 'CI-RHO', siFuera: 'Por el largo sí se duplicaría. Pero el área también se duplica, y eso la divide entre 2.' },
        { id: 'cuatro', texto: 'Se cuadruplica', error: 'CI-RHO', siFuera: 'Sería cierto si el área ayudara a frenar la corriente. Más área deja pasar más.' },
        { id: 'mitad', texto: 'Se reduce a la mitad', error: 'CI-RHO', siFuera: 'Sería cierto si solo cambiara el área. El largo también cambió.' },
      ],
      dibujo: { datos: Object.assign(EJE_VI(), { curvas: [rectaVI(resistencia('nicromo', 2, 1), '2 m; 1 mm²')] }), estado: {} },
      revelar: { datos: Object.assign(EJE_VI(), { curvas: [rectaVI(resistencia('nicromo', 2, 1), '2 m; 1 mm²'), rectaVI(resistencia('nicromo', 4, 2), '4 m; 2 mm²', { discontinua: true, en: [1.5, 6] })] }), estado: {} },
      coincide: `Coincide: el doble de largo y el doble de área dan la misma R = ${f(resistencia('nicromo', 2, 1), 2)} Ω.`,
    },
    mira: {
      datos: Object.assign(EJE_VI(), {
        curvas: [rectaVI(resistencia('nicromo', 2, 1), '', { desde: 1 })],
        puntos: [{ x: 3, y: 3 * resistencia('nicromo', 2, 1), color: 'o', rotulo: `${f(3 * resistencia('nicromo', 2, 1), 1)} V`, guias: true, desde: 2 }],
      }),
      pasos: [
        { estado: { corte: 0 }, texto: 'La resistencia depende del material (su resistividad ρ), del largo y del área.', ecuacion: [R, ' = ρ ', { frac: ['L', 'A'] }] },
        { estado: { corte: 1 }, texto: 'Nicromo, 2 m y 1 mm²: el área se pasa a m².', ecuacion: [R, ' = 1,1×', diez('−6'), ' · ', { frac: ['2', ['1×', diez('−6')]] }, ` = ${f(resistencia('nicromo', 2, 1), 2)} Ω`] },
        { estado: { corte: 2 }, texto: 'En este alambre, V es proporcional a I: la recta pasa por el origen.', ecuacion: [V, ' = ', I, R, ` = 3 · ${f(resistencia('nicromo', 2, 1), 1)} = ${f(3 * resistencia('nicromo', 2, 1), 1)} V`] },
        { estado: { corte: 2 }, texto: 'Doble de largo multiplica por 2; doble de área divide entre 2.', ecuacion: [{ frac: ['2L', '2A'] }, ' = ', { frac: ['L', 'A'] }] },
      ],
    },
    regla: {
      texto: 'La resistencia eléctrica crece con el largo y baja con el área. Ley de Ohm: en un conductor óhmico, el voltaje es proporcional a la corriente: R es la pendiente.',
      ecuacion: [R, ' = ', { llave: ['ρ'], nota: 'el material' }, ' ', { frac: ['L', 'A'] }, '   ·   ', V, ' = ', I, R],
      condicion: 'conductor óhmico a temperatura fija. Un foco caliente no es óhmico: su R sube al calentarse.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s);
        if (s % 2) {
          const kL = x.de([2, 3, 1 / 2]), kA = x.de([2, 3, 1 / 2]), r0 = x.de([4, 6, 12]);
          if (kL === kA) return { pregunta: `Un alambre tiene ${f(r0)} Ω. Otro, del mismo material, es ${kL > 1 ? f(kL) + ' veces más largo' : 'la mitad de largo'} y tiene ${kL > 1 ? f(kA) + ' veces el área' : 'la mitad del área'}. ¿Qué resistencia tiene?`,
            opciones: opciones(r0, [{ id: 'l', valor: r0 * kL, error: 'CI-RHO', siFuera: 'Esa cuenta solo mira el largo.' }, { id: 'a', valor: r0 / kA, error: 'CI-RHO', siFuera: 'Esa cuenta solo mira el área.' }, { id: 'ra', valor: r0 * kL * kA, error: 'CI-RHO', siFuera: 'Esa cuenta multiplica por el área; el área divide.' }], n => `${f(n, 2)} Ω`),
            solucion: { texto: 'Los dos factores se cancelan.', ecuacion: [R, ` = ${f(r0)} · ${f(kL, 2)} / ${f(kA, 2)} = ${f(r0, 2)} Ω`] } };
          const r1 = r0 * kL / kA;
          const dL = kL >= 1 ? `${f(kL)} veces más largo` : 'la mitad de largo', dA = kA >= 1 ? `${f(kA)} veces el área` : 'la mitad del área';
          return {
            pregunta: `Un alambre tiene ${f(r0)} Ω. Otro del mismo material es ${dL} y tiene ${dA}. ¿Qué resistencia tiene?`,
            opciones: opciones(r1, [
              { id: 'ra', valor: r0 * kL * kA, error: 'CI-RHO', siFuera: 'Esa cuenta multiplica por el área; el área divide.' },
              { id: 'l', valor: r0 * kL, error: 'CI-RHO', siFuera: 'Esa cuenta solo mira el largo.' },
              { id: 'a', valor: r0 / kA, error: 'CI-RHO', siFuera: 'Esa cuenta solo mira el área.' },
            ], n => `${f(n, 2)} Ω`),
            solucion: { texto: 'R se multiplica por el factor del largo y se divide por el del área.', ecuacion: [R, ` = ${f(r0)} · ${f(kL, 2)} / ${f(kA, 2)} = ${f(r1, 2)} Ω`] },
          };
        }
        const L = x.de([1, 2, 3, 5]), amm = x.de([0.5, 1, 2]), m = x.de(['nicromo', 'constantan']), rr = resistencia(m, L, amm);
        return {
          pregunta: ['¿Qué resistencia tiene un alambre de ', m === 'nicromo' ? 'nicromo (ρ = 1,1 × ' : 'constantán (ρ = 4,9 × ', diez(m === 'nicromo' ? '−6' : '−7'), ` Ω·m) de ${f(L)} m de largo y ${f(amm, 1)} mm² de sección?`],
          opciones: opciones(rr, [
            { id: 'unid', valor: rr * 1e-6, error: 'CI-UNID', siFuera: 'Esa cuenta deja el área en mm². Hay que pasarla a m².' },
            { id: 'inv', valor: RHO[m] * amm * 1e-6 / L * 1e12, error: 'CI-RHO', siFuera: 'Esa cuenta pone el área arriba y el largo abajo.' },
            { id: 'sin-l', valor: rr / L, error: 'CI-RHO', siFuera: 'Esa sería la resistencia de un metro.' },
          ], n => `${f(n, 2)} Ω`),
          solucion: { texto: 'ρ por largo entre área, con el área en m².', ecuacion: [R, ` = ${m === 'nicromo' ? '1,1' : '4,9'}×`, diez(m === 'nicromo' ? '−6' : '−7'), ` · ${f(L)} / ${f(amm, 1)}×`, diez('−6'), ` = ${f(rr, 2)} Ω`] },
        };
      },
    },
  };

  // ---------- Idea 3: fem, resistencia interna y aparatos de medida ----------
  // Cambia: la resistencia que conecta la pila (el cursor de un reóstato) · Permanece: la pila (12 V y 1 Ω adentro) y un voltímetro en sus bornes ·
  // Progresa: la corriente y lo que marca el voltímetro · Se reserva: el circuito abierto, sin corriente ·
  // Debe verse: el voltímetro marca menos que ε solo cuando hay corriente, por lo que se pierde adentro.
  // La R de afuera es un reóstato de 12 Ω: el alumno corre su cursor (gesto directo) o usa − y +.
  const FEM = 12, RINT = 1, RMAX3 = 12;
  const pilaReal = (rx, o = {}) => {
    const abierto = rx === Infinity, i = abierto ? 0 : FEM / (rx + RINT), vt = FEM - i * RINT;
    return { datos: {
      fuente: { rotulo: `ε = ${FEM} V`, r: `r = ${RINT} Ω`, voltimetro: o.leer === false ? '?' : `${f(vt, 2)} V`, color: 'o' },
      serie: [A(o.leer === false ? '?' : `${f(i, 2)} A`), ...(abierto ? [] : [reostato(`R = ${f(rx)} Ω`, rx, RMAX3)])],
      abierto,
    }, estado: {} };
  };
  const fem = {
    id: 'fem-y-medidores',
    titulo: 'La pila también se resiste',
    temas: ['Fuerza electromotriz', 'Amperímetro y voltímetro'],
    pieza: 'fis-circuito',
    juega: {
      consigna: 'Pila real: 12 V de fem y 1 Ω adentro. El cursor del reóstato se mueve solo: mira el amperímetro y el voltímetro.',
      voz: 'Mira qué pasa con el voltímetro cuando la corriente crece.',
      controles: [{ id: 'r', etiqueta: 'R', color: 'c-i', min: 1, max: 11, paso: 1, inicio: 5, unidad: 'Ω', decimales: 0, auto: { velocidad: 2.5, modo: 'rebota' } }],
      // Mientras corre, R avanza de décima en décima de ohm (los rótulos no muestran más cifras).
      dibujo: val => pilaReal(Math.round(val.r * 10) / 10),
      lectura: val => [I, ` = ${f(FEM / (val.r + RINT), 2)}\u00a0A · `, V, ` en bornes = ${f(FEM - FEM / (val.r + RINT) * RINT, 2)}\u00a0V`],
      minimo: 3,
      // Corre el cursor del reóstato: más alambre en el circuito, más R, menos corriente.
      arrastres: [{ id: 'cursor', etiqueta: 'cursor del reóstato', color: 'c-i',
        donde: val => cursor(pilaReal(val.r).datos, 'serie', 1, RMAX3).donde(val.r),
        mover: (pt, val) => ({ r: cursor(pilaReal(val.r).datos, 'serie', 1, RMAX3).mover(pt) }) }],
    },
    predice: {
      pregunta: 'Si ahora abres el interruptor y no pasa corriente, ¿qué marca el voltímetro en los bornes de la pila?',
      opciones: [
        { id: 'c', texto: '12 V', correcta: true },
        { id: 'cero', texto: '0 V: no hay corriente', error: 'C8', siFuera: 'Sin corriente no hay caída en el resistor. Pero la pila sigue separando cargas: su fem está ahí.' },
        { id: 'once', texto: '11 V', error: 'C1', siFuera: 'Se pierde 1 V adentro solo si pasa 1 A. Sin corriente, adentro no se pierde nada.' },
      ],
      dibujo: pilaReal(Infinity, { leer: false }),
      revelar: pilaReal(Infinity),
      coincide: 'Coincide: con I = 0 no se pierde nada en r, y el voltímetro marca toda la fem.',
    },
    mira: {
      datos: pilaReal(5).datos,
      pasos: [
        { estado: {}, texto: 'La corriente depende de toda la resistencia del circuito, también la de adentro.', ecuacion: [I, ' = ', { frac: [EPS, [R, ' + r']] }, ' = ', { frac: ['12', '5 + 1'] }, ' = 2 A'] },
        { estado: {}, texto: 'Adentro de la pila se pierden 2 A · 1 Ω = 2 V.', ecuacion: [V, ' = ', EPS, ' − ', I, 'r = 12 − 2 = 10 V'] },
        { estado: {}, texto: 'El amperímetro va en serie: la corriente tiene que pasar por él.', ecuacion: ['ideal: resistencia ≈ 0'] },
        { estado: {}, texto: 'El voltímetro va en paralelo: compara dos puntos sin robar corriente.', ecuacion: ['ideal: resistencia muy grande'] },
      ],
    },
    regla: {
      texto: 'La fem es la energía que la pila da a cada coulomb. Con corriente, parte se pierde en su resistencia interna y el voltaje en bornes baja.',
      ecuacion: [{ llave: [V], nota: 'en bornes', color: 'c-o' }, ' = ', EPS, ' − ', { llave: [I, ' r'], nota: 'se pierde', color: 'c-o' }, '   ·   ', I, ' = ', { frac: [EPS, [R, ' + r']] }],
      condicion: 'pila con r constante. Amperímetro ideal en serie y voltímetro ideal en paralelo: así no cambian lo que miden.',
    },
    ahoraTu: {
      pieza: 'fis-circuito',
      generar(s) {
        const x = azar(s), e = x.de([6, 9, 12, 24]), r = x.de([0.5, 1, 2]), rx = x.de([2, 4, 5, 10]);
        const i = e / (rx + r), vt = e - i * r;
        const pideI = s % 2 === 1;
        return {
          pregunta: [`Una pila de `, EPS, ` = ${f(e)} V con r = ${f(r, 1)} Ω alimenta una resistencia de ${f(rx)} Ω. ¿Qué marca ${pideI ? 'el amperímetro en serie' : 'el voltímetro en sus bornes'}?`],
          dibujo: { datos: { fuente: { rotulo: `ε = ${f(e)} V`, r: `r = ${f(r, 1)} Ω`, voltimetro: pideI ? null : '?', color: 'o' }, serie: [A(pideI ? '?' : ''), resist(`R = ${f(rx)} Ω`)] }, estado: {} },
          opciones: pideI ? opciones(i, [
            { id: 'sin-r', valor: e / rx, error: 'C1', siFuera: 'Esa cuenta olvida la resistencia de adentro de la pila.' },
            { id: 'solo-r', valor: e / r, error: 'C12', siFuera: 'Esa sería la corriente en cortocircuito, sin R.' },
            { id: 'por', valor: e * (rx + r) / 10, error: 'C7', siFuera: 'Esa cuenta multiplica; la corriente divide la fem entre la resistencia.' },
          ], n => `${f(n, 2)} A`) : opciones(vt, [
            { id: 'fem', valor: e, error: 'C1', siFuera: 'Sería cierto sin corriente. Con corriente, adentro se pierde I·r.' },
            { id: 'caida', valor: i * r, error: 'C8', siFuera: 'Esa es la caída dentro de la pila, no lo que queda en bornes.' },
            { id: 'suma', valor: e + i * r, error: 'C1', siFuera: 'Esa cuenta suma la pérdida; se resta.' },
          ], n => `${f(n, 2)} V`),
          solucion: { texto: pideI ? 'La fem empuja contra toda la resistencia, adentro y afuera.' : 'A la fem se le resta lo que se pierde adentro.', ecuacion: pideI ? [I, ` = ${f(e)} / (${f(rx)} + ${f(r, 1)}) = ${f(i, 2)} A`] : [V, ` = ${f(e)} − ${f(i, 2)} · ${f(r, 1)} = ${f(vt, 2)} V`] },
        };
      },
    },
  };

  // ---------- Idea 4: serie y paralelo ----------
  // Cambia: cuántos focos iguales hay en serie y la pila · Permanece: focos iguales (4 Ω) y pila ideal ·
  // Progresa: el brillo de cada foco, que baja al sumar focos en serie · Se reserva: el paralelo, al quitar un foco ·
  // Debe verse: en paralelo cada foco tiene toda la pila; quitar uno no cambia a los demás.
  const RF = 4, PMAX = 36;
  const enSerie = (n, e) => {
    const i = e / (n * RF), p = i * i * RF;
    return { datos: { fuente: pila(e), serie: Array.from({ length: n }, () => foco(`${RF}\u00a0Ω`, p / PMAX, { lectura: `${f(p, 2)}\u00a0W` })) }, estado: {} };
  };
  const enParalelo = (n, e, o = {}) => {
    const p = e * e / RF;
    return { datos: { fuente: pila(e), ramas: Array.from({ length: n }, () => foco(`${RF}\u00a0Ω`, o.apagado ? 0 : p / PMAX, { lectura: o.leer === false ? '' : `${f(p, 2)}\u00a0W` })) }, estado: {} };
  };
  const reqDe = (modo, rs) => (modo === 'serie' ? rs.reduce((a, b) => a + b, 0) : 1 / rs.reduce((a, b) => a + 1 / b, 0));
  const seriePar = {
    id: 'serie-paralelo',
    titulo: 'En paralelo, toda la pila',
    temas: ['Resistencias en serie y en paralelo'],
    pieza: 'fis-circuito',
    juega: {
      consigna: 'Focos iguales de 4 Ω en serie, uno detrás de otro. Agrega focos y cambia la pila: mira el brillo y cuánta carga pasa.',
      voz: 'En serie, cada foco nuevo apaga un poco a los demás.',
      controles: [
        { id: 'n', etiqueta: 'Focos', min: 1, max: 3, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'e', etiqueta: 'ε', color: 'c-o', min: 6, max: 12, paso: 6, inicio: 12, unidad: 'V', decimales: 0 },
        TQ,
      ],
      dibujo: val => conFlujo(enSerie(val.n, val.e), val.t, val.e / (val.n * RF)),
      lectura: val => [R, ` total = ${f(val.n * RF)}\u00a0Ω · `, I, ` = ${f(val.e / (val.n * RF), 2)}\u00a0A · ${f(val.e / (val.n * RF) * val.t, 1)}\u00a0C en ${f(val.t, 1)}\u00a0s`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora tres focos iguales están en paralelo con una pila ideal de 12 V. Desenroscas uno. ¿Qué pasa con el brillo de los otros dos?',
      opciones: [
        { id: 'c', texto: 'Siguen igual', correcta: true },
        { id: 'mas', texto: 'Brillan más: la corriente se reparte entre menos', error: 'C1', siFuera: 'Sería cierto si la pila diera siempre la misma corriente. Da el mismo voltaje.' },
        { id: 'menos', texto: 'Brillan menos', error: 'C4', siFuera: 'Así pasa en serie, donde comparten el voltaje. En paralelo cada uno tiene los 12 V.' },
        { id: 'apaga', texto: 'Se apagan todos', error: 'C5', siFuera: 'Se apagarían en serie, con un solo camino. Aquí cada foco tiene su propio camino.' },
      ],
      dibujo: enParalelo(3, 12, { leer: false }),
      revelar: { datos: { fuente: pila(12), ramas: [foco('4\u00a0Ω', 1, { lectura: '36\u00a0W' }), foco('4\u00a0Ω', 1, { lectura: '36\u00a0W' }), foco('vacío', 0)] }, estado: {} },
      coincide: 'Coincide: cada foco recibe los 12 V de la pila, haya dos o tres.',
    },
    mira: {
      datos: enParalelo(3, 12).datos,
      pasos: [
        { estado: {}, texto: 'En paralelo, los extremos de cada foco van a los bornes de la pila.', ecuacion: [{ sub: [V, 'foco'] }, ' = 12 V'] },
        { estado: {}, texto: 'Cada foco lleva su propia corriente.', ecuacion: [{ sub: [I, 'foco'] }, ' = 12/4 = 3 A'] },
        { estado: {}, texto: 'La pila entrega la suma; si quitas uno, entrega menos.', ecuacion: [{ sub: [I, 'pila'] }, ' = 3 + 3 + 3 = 9 A  →  6 A'] },
        { estado: {}, texto: 'La resistencia equivalente baja al sumar ramas.', ecuacion: [{ frac: ['1', { sub: [R, 'eq'] }] }, ' = ', { frac: ['3', '4'] }, '  →  ', { sub: [R, 'eq'] }, ` = ${f(4 / 3, 2)} Ω`] },
      ],
    },
    regla: {
      texto: 'En serie, la corriente es la misma y los voltajes se suman. En paralelo, el voltaje es el mismo y las corrientes se suman.',
      ecuacion: ['serie: ', { sub: [R, 'eq'] }, ' = Σ', R, '   ·   ', 'paralelo: ', { frac: ['1', { sub: [R, 'eq'] }] }, ' = Σ', { frac: ['1', R] }],
      condicion: 'pila ideal (sin resistencia interna) y focos que se comportan como resistencias fijas.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), modo = s % 2 ? 'paralelo' : 'serie', rs = [x.de([2, 3, 6]), x.de([3, 6, 12])], tres = s % 3 === 0;
        if (tres) rs.push(x.de([4, 6, 12]));
        const req = reqDe(modo, rs);
        return {
          pregunta: `Resistencias de ${rs.map(v => f(v) + ' Ω').join(', ')} se conectan en ${modo}. ¿Cuál es la resistencia equivalente?`,
          dibujo: { datos: modo === 'serie' ? { fuente: pila(12), serie: rs.map(v => resist(`${f(v)} Ω`)) } : { fuente: pila(12), ramas: rs.map(v => resist(`${f(v)} Ω`)) }, estado: {} },
          opciones: opciones(req, [
            { id: 'otra', valor: reqDe(modo === 'serie' ? 'paralelo' : 'serie', rs), error: 'CI-REQ', siFuera: modo === 'serie' ? 'Esa es la regla del paralelo.' : 'Esa es la suma, que vale en serie.' },
            { id: 'inv', valor: rs.reduce((a, b) => a + 1 / b, 0), error: 'CI-REQ', siFuera: 'Esa es la suma de inversas; falta invertirla.' },
            { id: 'prom', valor: rs.reduce((a, b) => a + b, 0) / rs.length, error: 'CI-REQ', siFuera: 'El promedio no es ninguna de las dos reglas.' },
          ], n => `${f(n, 2)} Ω`),
          solucion: { texto: modo === 'serie' ? 'En serie se suman.' : 'En paralelo se suman las inversas y se invierte.', ecuacion: [{ sub: [R, 'eq'] }, ` = ${f(req, 2)} Ω`] },
        };
      },
    },
  };

  // ---------- Idea 5: Kirchhoff, nudos y mallas ----------
  // Cambia: la resistencia de una de las dos ramas (el cursor de su reóstato) · Permanece: la pila (12 V) y R₁ = 2 Ω en serie ·
  // Progresa: la corriente que entra al nudo y el voltaje de las ramas · Se reserva: cómo se reparte en el nudo ·
  // Debe verse: por la rama de menor resistencia pasa más corriente; lo que entra al nudo sale.
  // R₃ es un reóstato de 6 Ω (su cursor se arrastra); con r2 se pide también R₂ como reóstato (mesa del laboratorio).
  const R1 = 2, R2K = 3, RMAX5 = 6;
  // Reparto en el nudo: R₁ en serie con R₂ ∥ R₃ y la pila de 12 V. Lo usan la figura, la lectura y los retos.
  const reparto = (r2, r3) => {
    const rp = r2 * r3 / (r2 + r3), it = 12 / (R1 + rp), vp = it * rp;
    return { rp, it, vp, i2: vp / r2, i3: vp / r3 };
  };
  const kirchhoff = (r3, o = {}) => {
    const r2 = o.r2 || R2K, rmax = o.rmax || RMAX5;
    const { it, vp, i2, i3 } = reparto(r2, r3);
    const rama2 = o.r2 ? reostato : (rot, rr, m, ex) => resist(rot, ex), dc = o.r2 ? 1 : 2;   // la mesa usa 1 decimal en la figura
    return { datos: {
      fuente: pila(12),
      // En la mesa, la flecha sobre R₁ da la corriente que llega al nudo (sin amperímetro, para que no se encimen).
      serie: o.r2 ? [resist(`R₁ = ${R1} Ω`, { corriente: { texto: `${f(it, dc)} A`, color: 'h' } })] : [A(`${f(it, dc)} A`), resist(`R₁ = ${R1} Ω`)],
      ramas: [rama2(`R₂ = ${f(r2)} Ω`, r2, rmax, { voltimetro: o.v === false ? null : `${f(vp, 2)} V`, corriente: o.ramas ? { texto: `${f(i2, dc)} A`, color: 'h' } : null, desde: o.desde }),
        reostato(`R₃ = ${f(r3)} Ω`, r3, rmax, { corriente: o.ramas ? { texto: `${f(i3, dc)} A`, color: 'h' } : null, desde: o.desde })],
    }, estado: {} };
  };
  const nudos = {
    id: 'kirchhoff',
    titulo: 'Lo que entra al nudo sale',
    temas: ['Leyes de Kirchhoff'],
    pieza: 'fis-circuito',
    juega: {
      consigna: 'R₁ en serie y después dos ramas en paralelo. Mira cómo la carga que llega al nudo se reparte. Cambia R₃.',
      voz: 'Las dos ramas comparten el mismo voltaje. Fíjate en eso.',
      controles: [{ id: 'r3', etiqueta: 'R₃', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 6, unidad: 'Ω', decimales: 0 }, TQ],
      dibujo: val => { const q = reparto(R2K, val.r3); return conFlujo(kirchhoff(val.r3), val.t, q.it, [q.i2, q.i3]); },
      lectura: val => { const rp = R2K * val.r3 / (R2K + val.r3), it = 12 / (R1 + rp); return [I, ` = ${f(it, 2)}\u00a0A · `, V, ` ramas = ${f(it * rp, 2)}\u00a0V · ${f(it * val.t, 1)}\u00a0C en ${f(val.t, 1)}\u00a0s`]; },
      minimo: 3,
      arrastres: [{ id: 'cursor-r3', etiqueta: 'cursor del reóstato R₃', color: 'c-i',
        donde: val => cursor(kirchhoff(val.r3).datos, 'ramas', 1, RMAX5).donde(val.r3),
        mover: (pt, val) => ({ r3: cursor(kirchhoff(val.r3).datos, 'ramas', 1, RMAX5).mover(pt) }) }],
    },
    predice: {
      pregunta: 'En un nudo entran 6 A y se reparten entre dos ramas en paralelo: una de 2 Ω y otra de 4 Ω. ¿Cuánta corriente va por la de 2 Ω?',
      opciones: [
        { id: 'c', texto: '4 A', correcta: true },
        { id: 'mitad', texto: '3 A', error: 'C11', siFuera: 'Mitad y mitad sería cierto si las dos ramas tuvieran la misma resistencia.' },
        { id: 'inv', texto: '2 A', error: 'CI-INV', siFuera: 'Esa es la corriente de la rama de 4 Ω. La de menor resistencia deja pasar más.' },
        { id: 'todo', texto: '6 A', error: 'C11', siFuera: 'La corriente no va toda por el camino fácil: las dos ramas tienen el mismo voltaje.' },
      ],
      dibujo: { datos: { fuente: pila(12), serie: [A('6 A')], ramas: [resist('2 Ω'), resist('4 Ω')] }, estado: {} },
      revelar: { datos: { fuente: pila(12), serie: [A('6 A')], ramas: [resist('2 Ω', { corriente: { texto: '4 A', color: 'h' }, voltimetro: '8 V' }), resist('4 Ω', { corriente: { texto: '2 A', color: 'h' } })] }, estado: {} },
      coincide: 'Coincide: con el mismo voltaje, la rama de 2 Ω lleva el doble que la de 4 Ω.',
    },
    mira: {
      datos: kirchhoff(6, { ramas: true, desde: 2 }).datos,
      pasos: [
        { estado: { corte: 0 }, texto: 'Ramas de 3 Ω y 6 Ω en paralelo equivalen a 2 Ω.', ecuacion: [{ sub: [R, '23'] }, ' = ', { frac: ['3 · 6', '3 + 6'] }, ' = 2 Ω'] },
        { estado: { corte: 1 }, texto: 'Malla: la fem se reparte entre R₁ y las ramas.', ecuacion: ['12 = ', I, ' · 2 + ', I, ' · 2  →  ', I, ' = 3 A'] },
        { estado: { corte: 2 }, texto: 'Las dos ramas tienen 6 V. Cada una lleva V/R.', ecuacion: [{ sub: [I, '2'] }, ' = 6/3 = 2 A', '   ·   ', { sub: [I, '3'] }, ' = 6/6 = 1 A'] },
        { estado: { corte: 2 }, texto: 'Nudo: lo que entra es lo que sale.', ecuacion: ['3 A = 2 A + 1 A'] },
      ],
    },
    regla: {
      texto: 'Leyes de Kirchhoff: en un nudo, la suma de corrientes que entran es igual a la que sale. En una malla cerrada, las subidas y bajadas de voltaje suman cero.',
      ecuacion: ['Σ', { sub: [I, 'entran'] }, ' = Σ', { sub: [I, 'salen'] }, '   ·   ', { llave: ['Σ', EPS], nota: 'lo que sube', color: 'c-o' }, ' = ', { llave: ['Σ', I, R], nota: 'lo que baja', color: 'c-o' }],
      condicion: 'corrientes estables; los signos se fijan con un sentido de recorrido elegido antes de empezar.',
    },
    ahoraTu: {
      pieza: 'fis-circuito',
      generar(s) {
        const x = azar(s), ra = x.de([2, 3, 4, 6]), rb0 = x.de([3, 6, 12]), rb = rb0 === ra ? 2 * ra : rb0, it = x.de([3, 6, 9, 12]);
        const rp = ra * rb / (ra + rb), v = it * rp, ia = v / ra;
        return {
          pregunta: `En un nudo entran ${f(it)} A y se reparten entre dos ramas en paralelo, de ${f(ra)} Ω y ${f(rb)} Ω. ¿Cuánta corriente va por la de ${f(ra)} Ω?`,
          dibujo: { datos: { fuente: pila(12), serie: [A(`${f(it)} A`)], ramas: [resist(`${f(ra)} Ω`), resist(`${f(rb)} Ω`)] }, estado: {} },
          opciones: opciones(ia, [
            { id: 'mitad', valor: it / 2, error: 'C11', siFuera: 'Mitad y mitad solo si las dos ramas fueran iguales.' },
            { id: 'inv', valor: it - ia, error: 'CI-INV', siFuera: 'Esa es la corriente de la otra rama.' },
            { id: 'todo', valor: it, error: 'C11', siFuera: 'La corriente no va toda por una rama: las dos tienen el mismo voltaje.' },
          ], n => `${f(n, 2)} A`),
          solucion: { texto: 'Las dos ramas tienen el mismo voltaje; se reparte al revés que R.', ecuacion: [V, ` = ${f(it)} · ${f(rp, 2)} = ${f(v, 2)} V`, '   ·   ', I, ` = ${f(v, 2)}/${f(ra)} = ${f(ia, 2)} A`] },
        };
      },
    },
  };

  // ---------- Idea 6: potencia y efecto Joule ----------
  // Cambia: la resistencia del primer foco, en paralelo con otro de 6 Ω · Permanece: la pila de 12 V ·
  // Progresa: el brillo de cada uno · Se reserva: los mismos focos en serie, donde el orden se invierte ·
  // Debe verse: «el de menos R brilla más» vale en paralelo; en serie, brilla más el de más R.
  // Hallazgo 9: el juego muestra los focos en paralelo y «Mira» los mismos dos focos en serie, a propósito: la
  // predicción pregunta por la serie y el paso 3 vuelve al paralelo que el alumno movió para contrastar V²/R con I²R.
  const RB = 6, PM6 = 72;
  const dosPar = (ra, o = {}) => ({ datos: { fuente: pila(12), ramas: [foco(`${f(ra)}\u00a0Ω`, (144 / ra) / PM6, { lectura: `${f(144 / ra, 1)}\u00a0W` }), foco(`${RB}\u00a0Ω`, (144 / RB) / PM6, { lectura: `${f(144 / RB, 1)}\u00a0W` })] }, estado: {} });
  const dosSerie = (ra, o = {}) => {
    const i = 12 / (ra + RB), pa = i * i * ra, pb = i * i * RB;
    return { datos: { fuente: pila(12), serie: [foco(`${f(ra)}\u00a0Ω`, o.apagado ? 0 : pa / PM6 * 4, { lectura: o.leer === false ? '' : `${f(pa, 1)}\u00a0W`, desde: o.desde }), foco(`${RB}\u00a0Ω`, o.apagado ? 0 : pb / PM6 * 4, { lectura: o.leer === false ? '' : `${f(pb, 1)}\u00a0W`, desde: o.desde })] }, estado: {} };
  };
  const potencia = {
    id: 'potencia-joule',
    titulo: 'Qué foco brilla más',
    temas: ['Potencia y efecto Joule'],
    pieza: 'fis-circuito',
    juega: {
      consigna: 'Dos focos en paralelo con una pila de 12 V; el segundo tiene 6 Ω. Cambia la resistencia del primero: compara brillo y corriente.',
      voz: 'En paralelo, ¿brilla más el de menos o el de más resistencia?',
      controles: [{ id: 'ra', etiqueta: 'R del primero', color: 'c-i', min: 2, max: 12, paso: 2, inicio: 2, unidad: 'Ω', decimales: 0 }, TQ],
      dibujo: val => conFlujo(dosPar(val.ra), val.t, 12 / val.ra + 12 / RB, [12 / val.ra, 12 / RB]),
      // P = V²/R en cada foco; la energía que convierte cada uno en t es P·t (regla 1).
      lectura: val => [P, ` = ${f(144 / val.ra, 1)}\u00a0W y ${f(144 / RB, 1)}\u00a0W · ${f(144 / val.ra * val.t, 0)}\u00a0J y ${f(144 / RB * val.t, 0)}\u00a0J`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Los mismos focos, de 2 Ω y 6 Ω, ahora se conectan en serie a la pila de 12 V. ¿Cuál brilla más?',
      opciones: [
        { id: 'c', texto: 'El de 6 Ω', correcta: true },
        { id: 'dos', texto: 'El de 2 Ω, como en paralelo', error: 'C14', siFuera: 'En paralelo es cierto: tienen el mismo voltaje. En serie comparten la corriente, y P = I²R.' },
        { id: 'igual', texto: 'Igual: los recorre la misma corriente', error: 'C4', siFuera: 'La corriente sí es la misma. Pero el de más R convierte más energía con esa corriente.' },
      ],
      dibujo: dosSerie(2, { apagado: true, leer: false }),
      revelar: dosSerie(2),
      coincide: 'Coincide: en serie la misma corriente, 1,5 A, da más potencia en la R mayor.',
    },
    mira: {
      datos: dosSerie(2, { desde: 1 }).datos,
      pasos: [
        { estado: { corte: 0 }, texto: 'En serie la corriente es una sola.', ecuacion: [I, ' = ', { frac: ['12', '2 + 6'] }, ' = 1,5 A'] },
        { estado: { corte: 1 }, texto: 'Con la misma corriente, la potencia crece con R.', ecuacion: [P, ' = ', { sup: [I, '2'] }, R, ` = 2,25 · 2 = 4,5 W`, '   ·   ', `2,25 · 6 = 13,5 W`] },
        { estado: { corte: 1 }, texto: 'En paralelo era al revés: mismo V, y P = V²/R.', ecuacion: [P, ' = ', { frac: [{ sup: [V, '2'] }, R] }] },
        { estado: { corte: 1 }, texto: 'Efecto Joule: esa energía sale como calor y luz cada segundo.', ecuacion: ['E = ', P, ' t'] },
      ],
    },
    regla: {
      texto: 'La potencia eléctrica es voltaje por corriente. Con la misma corriente (serie) rinde más la R mayor; con el mismo voltaje (paralelo), la menor.',
      ecuacion: [P, ' = ', V, I, ' = ', { llave: [{ sup: [I, '2'] }, R], nota: 'misma I', color: 'c-h' }, ' = ', { llave: [{ frac: [{ sup: [V, '2'] }, R] }], nota: 'mismo V', color: 'c-o' }, '   ·   ', 'E = ', P, ' t'],
      condicion: 'resistencias fijas. El brillo de un foco sigue a su potencia, no a su corriente sola.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const v = x.de([12, 24, 220]), rr = v === 220 ? x.de([44, 55, 110]) : x.de([4, 6, 12]), p = v * v / rr;
          return {
            pregunta: ['¿Qué potencia disipa una resistencia de ', R, ` = ${f(rr)} Ω conectada a `, V, ` = ${f(v)} V?`],
            opciones: opciones(p, [
              { id: 'vr', valor: v / rr, error: 'C7', siFuera: 'Esa es la corriente, en amperios.' },
              { id: 'vxr', valor: v * rr, error: 'C14', siFuera: 'Esa cuenta multiplica por R; con V fijo, R divide.' },
              { id: 'sin2', valor: v * v / rr / 2, error: 'C14', siFuera: 'Esa cuenta divide entre 2 sin razón.' },
            ], n => `${f(n, 1)} W`),
            solucion: { texto: 'Con el voltaje fijo, P = V²/R.', ecuacion: [P, ' = ', { sup: [f(v), '2'] }, ` / ${f(rr)} = ${f(p, 1)} W`] },
          };
        }
        if (tipo === 1) {
          const p = x.de([60, 100, 1000, 1500]), h = x.de([2, 3, 5, 8]), kwh = p * h / 1000;
          return {
            pregunta: `Un aparato de ${f(p)} W funciona ${f(h)} horas. ¿Cuánta energía consume, en kilovatios hora?`,
            opciones: opciones(kwh, [
              { id: 'wh', valor: p * h, error: 'CI-UNID', siFuera: 'Ese número está en vatios hora, no en kilovatios hora.' },
              { id: 'div', valor: p / h / 1000, error: 'C14', siFuera: 'Esa cuenta divide entre el tiempo; la energía es P por t.' },
              { id: 's', valor: p * h * 3600 / 1e6, error: 'CI-UNID', siFuera: 'Ese número son megajoules, no kilovatios hora.' },
            ], n => `${f(n, 2)} kWh`),
            solucion: { texto: 'Energía es potencia por tiempo.', ecuacion: [`E = ${f(p / 1000, 2)} kW · ${f(h)} h = ${f(kwh, 2)} kWh`] },
          };
        }
        const ra = x.de([2, 3, 4]), rb = x.de([6, 8, 12]), e = x.de([12, 24]), i = e / (ra + rb), pb = i * i * rb;
        return {
          pregunta: `Resistencias de ${f(ra)} Ω y ${f(rb)} Ω en serie con una pila de ${f(e)} V. ¿Qué potencia disipa la de ${f(rb)} Ω?`,
          dibujo: { datos: { fuente: pila(e), serie: [resist(`${f(ra)} Ω`), resist(`${f(rb)} Ω`)] }, estado: {} },
          opciones: opciones(pb, [
            { id: 'v2r', valor: e * e / rb, error: 'C14', siFuera: 'Esa usa los 12 V enteros; en serie el voltaje se reparte.' },
            { id: 'ir', valor: i * rb, error: 'C7', siFuera: 'Ese es su voltaje, I·R, no su potencia.' },
            { id: 'otra', valor: i * i * ra, error: 'C14', siFuera: 'Esa es la potencia de la otra resistencia.' },
          ], n => `${f(n, 2)} W`),
          solucion: { texto: 'Primero la corriente común; luego I²R.', ecuacion: [I, ` = ${f(e)}/${f(ra + rb)} = ${f(i, 2)} A`, '   ·   ', P, ' = ', { sup: [f(i, 2), '2'] }, ` · ${f(rb)} = ${f(pb, 2)} W`] },
        };
      },
    },
  };

  // Mesa «pila real con reóstato»: con R = 0 es un cortocircuito (toda la fem se pierde adentro).
  const cuentaPila = val => { const i = val.e / (val.r + val.ri); return { i, v: val.e - i * val.ri, p: i * i * val.r }; };
  const labPila = val => {
    const c = cuentaPila(val);
    return { datos: {
      fuente: { rotulo: `ε = ${f(val.e)} V`, r: `r = ${f(val.ri, 1)} Ω`, voltimetro: `${f(c.v, 2)} V`, color: 'o' },
      serie: [A(`${f(c.i, 2)}\u00a0A`), reostato(`R = ${f(val.r)}\u00a0Ω`, val.r, 20, { lectura: `${f(c.p, 1)}\u00a0W` })],
    }, estado: {} };
  };

  // Para los retos del laboratorio (docs/teoria.md, 4d): todos los casos de una mesa (para sus extremos, con las mismas
  // cuentas que dibujan) y «este caso es uno de los guardados».
  const casosDe = ctl => ctl.reduce((acc, c) => {
    const vs = c.opciones ? c.opciones.map(o => o.valor) : [];
    if (!c.opciones) for (let k = 0; c.min + k * c.paso <= c.max + 1e-9; k++) vs.push(Math.round((c.min + k * c.paso) * 1e6) / 1e6);
    return acc.flatMap(a => vs.map(v => Object.assign({}, a, { [c.id]: v })));
  }, [{}]);
  const mismo = (g, val) => Object.keys(val).every(k => g[k] === val[k]);
  const CTL_PILA = [
    { id: 'e', etiqueta: 'ε', color: 'c-o', min: 3, max: 24, paso: 3, inicio: 12, unidad: 'V', decimales: 0 },
    { id: 'ri', etiqueta: 'r interna', min: 0.5, max: 4, paso: 0.5, inicio: 2, unidad: 'Ω', decimales: 1 },
    { id: 'r', etiqueta: 'R', color: 'c-i', min: 0, max: 20, paso: 1, inicio: 6, unidad: 'Ω', decimales: 0 },
  ];
  const CTL_RAMAS = [
    { id: 'r2', etiqueta: 'R₂', color: 'c-i', min: 1, max: 12, paso: 1, inicio: 3, unidad: 'Ω', decimales: 0 },
    { id: 'r3', etiqueta: 'R₃', color: 'c-i', min: 1, max: 12, paso: 1, inicio: 6, unidad: 'Ω', decimales: 0 },
  ];
  const I_PILA_MAX = Math.max(...casosDe(CTL_PILA).map(v => cuentaPila(v).i));
  const I_NUDO_MAX = Math.max(...casosDe(CTL_RAMAS).map(v => reparto(v.r2, v.r3).it));
  const R_ALAMBRE_MAX = Math.max(...casosDe(ohm.juega.controles).map(v => resistencia(v.m, v.L, 1)));

  return {
    unidad: 'fisica.corriente-y-circuitos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-circuito.js', '/nucleo/kit/piezas/ejes.js'],
    // Glosario del tema (docs/teoria.md, 4d). Carga, conductor, diferencia de potencial, en serie y en paralelo vienen
    // de «Electrostática»; potencia y energía, de «Trabajo y energía». «Resistencia» a secas no se marca (la
    // referencia dice «resistencia del aire»); «nudo» tampoco (en estática es el nudo de las cuerdas).
    glosario: [
      { termino: 'corriente eléctrica', simbolo: 'I', medida: 'A (ampere)', formas: ['corriente eléctrica', 'corrientes eléctricas', 'corriente', 'corrientes'],
        def: 'Cantidad de carga que cruza un corte del cable en cada segundo.',
        ejemplo: '30 C en 5 s: I = 30 / 5 = 6 A.', ver: ['densidad de corriente', 'voltaje'] },
      { termino: 'densidad de corriente', simbolo: 'J', medida: 'A/m²', def: 'Corriente que pasa por cada unidad de área del cable: la corriente entre la sección.',
        ejemplo: '2 A por un cable de 1 mm²: J = 2 A/mm².', ver: ['corriente eléctrica'] },
      { termino: 'resistencia eléctrica', simbolo: 'R', medida: 'Ω (ohmio)', formas: ['resistencia eléctrica', 'resistencias eléctricas'],
        def: 'Cuánto se opone un objeto al paso de la corriente: el voltaje que pide por cada ampere.',
        ejemplo: 'Con 12 V pasan 3 A: R = 12 / 3 = 4 Ω.', ver: ['ley de Ohm', 'resistividad'] },
      { termino: 'resistividad', simbolo: 'ρ', medida: 'Ω·m', def: 'Cuánto se opone un material al paso de la corriente, sin importar la forma del alambre.',
        ejemplo: 'Nicromo de 2 m y 1 mm²: R = 1,1 × 10⁻⁶ · 2 / 10⁻⁶ = 2,2 Ω.', ver: ['resistencia eléctrica'] },
      { termino: 'ley de Ohm', def: 'En muchos conductores a temperatura fija, el voltaje es proporcional a la corriente: V = IR.',
        ejemplo: '4 Ω con 3 A: V = 3 · 4 = 12 V.', ver: ['resistencia eléctrica'] },
      { termino: 'voltaje', simbolo: 'V', medida: 'V (voltio)', def: 'Otro nombre de la diferencia de potencial: la energía que gana o pierde cada coulomb entre dos puntos.',
        ver: ['diferencia de potencial', 'fuerza electromotriz'] },
      { termino: 'fuerza electromotriz', simbolo: 'ε', medida: 'V', formas: ['fuerza electromotriz', 'fem'],
        def: 'Energía que una pila o un generador da a cada coulomb que lo atraviesa.',
        ejemplo: 'Una pila de 12 V da 12 J a cada coulomb.', ver: ['resistencia interna', 'voltaje'] },
      { termino: 'resistencia interna', simbolo: 'r', medida: 'Ω', def: 'Resistencia de la propia pila: con corriente, se come parte de su energía y baja el voltaje de sus bornes.',
        ejemplo: '12 V, r = 1 Ω y 2 A: en bornes quedan 12 − 2 · 1 = 10 V.', ver: ['fuerza electromotriz', 'cortocircuito'] },
      { termino: 'amperímetro', def: 'Aparato que mide la corriente. Va en serie, para que la corriente pase por él.', ver: ['voltímetro'] },
      { termino: 'voltímetro', def: 'Aparato que mide el voltaje entre dos puntos. Va en paralelo y casi no roba corriente.', ver: ['amperímetro'] },
      { termino: 'cortocircuito', def: 'Unir los bornes sin resistencia: la corriente se dispara y todo el voltaje se pierde dentro de la pila.',
        ejemplo: 'Pila de 12 V con r = 2 Ω en corto: I = 12 / 2 = 6 A.', ver: ['resistencia interna'] },
      { termino: 'reóstato', def: 'Resistencia que se puede cambiar corriendo un cursor sobre un alambre largo.', ver: ['resistencia eléctrica'] },
      { termino: 'leyes de Kirchhoff', formas: ['leyes de Kirchhoff', 'ley de Kirchhoff'],
        def: 'Dos reglas de circuitos: lo que entra a un nudo sale, y en cada malla los voltajes suman cero.',
        ejemplo: 'Entran 3 A a un nudo y salen 2 A y 1 A.', ver: ['malla'] },
      { termino: 'malla', def: 'Camino cerrado de un circuito que sale de un punto y vuelve a él.', ver: ['leyes de Kirchhoff'] },
      { termino: 'efecto Joule', def: 'Calentamiento de un conductor por el que pasa corriente: la energía eléctrica se vuelve calor.',
        ejemplo: '6 Ω con 2 A: P = 2² · 6 = 24 W de calor.', ver: ['resistencia eléctrica'] },
    ],
    // Laboratorio: la pila real con todo suelto (incluido el cortocircuito y la potencia que llega a R), las dos
    // ramas con sus dos cursores y la recta V–I de la idea 2.
    laboratorio: [
      {
        id: 'pila-reostato', titulo: 'Pila real con reóstato', pieza: 'fis-circuito',
        consigna: 'El cursor corre solo. Elige la fem y la resistencia interna. ¿Con qué R recibe más potencia el reóstato? Prueba también R = 0.',
        controles: [CTL_PILA[0], CTL_PILA[1], Object.assign({}, CTL_PILA[2], { auto: { velocidad: 4, modo: 'rebota' } })],
        dibujo: val => labPila(val),
        lectura: val => { const c = cuentaPila(val); return [R, ` = ${f(val.r)}\u00a0Ω: `, I, ` = ${f(c.i, 2)}\u00a0A · `, V, ` = ${f(c.v, 2)}\u00a0V · `, P, ` = ${f(c.p, 1)}\u00a0W`]; },
        arrastres: [{ id: 'cursor', etiqueta: 'cursor del reóstato', color: 'c-i',
          donde: val => cursor(labPila(val).datos, 'serie', 1, 20).donde(val.r),
          mover: (pt, val) => ({ r: cursor(labPila(val).datos, 'serie', 1, 20).mover(pt) }) }],
        // Retos comprobados (docs/teoria.md, 4d): cuentaPila es la misma cuenta que escribe los rótulos del circuito.
        invitaciones: [
          { texto: 'Haz un cortocircuito: que el voltaje en los bornes de la pila sea cero.',
            logrado: val => Math.abs(cuentaPila(val).v) < 1e-9,
            bien: 'En corto, todo el voltaje se queda adentro de la pila. ¿Y la corriente?' },
          { texto: 'Con esa pila, busca la R que recibe más potencia.',
            logrado: val => {
              const p = cuentaPila(val).p;
              const al = d => (val.r + d < 0 || val.r + d > 20 ? -1 : cuentaPila(Object.assign({}, val, { r: val.r + d })).p);
              return p > 0 && p >= al(-1) && p >= al(1);
            },
            bien: 'La potencia máxima llega cuando R se parece a la resistencia interna.' },
          { texto: 'Consigue la mayor corriente que permite la mesa.',
            logrado: val => Math.abs(cuentaPila(val).i - I_PILA_MAX) < 1e-9,
            bien: 'Fem grande, poca r y en corto: por eso un corto calienta tanto.' },
          { texto: 'Guarda dos casos con la misma pila: que uno lleve el doble de corriente.',
            logrado: (val, guardados) => guardados.some(g => g.e === val.e && g.ri === val.ri
              && (Math.abs(cuentaPila(g).i - 2 * cuentaPila(val).i) < 1e-9 || Math.abs(cuentaPila(val).i - 2 * cuentaPila(g).i) < 1e-9))
              && guardados.some(g => mismo(g, val)),
            bien: 'Doble de corriente, más voltaje perdido adentro: en bornes queda ε − Ir.' },
        ],
      },
      {
        id: 'dos-ramas', titulo: 'Dos ramas, dos cursores', pieza: 'fis-circuito',
        consigna: 'R₁ = 2 Ω en serie y dos reóstatos en paralelo. Corre los dos cursores y mira cómo se reparte la corriente en el nudo.',
        controles: CTL_RAMAS,
        dibujo: val => kirchhoff(val.r3, { r2: val.r2, rmax: 12, ramas: true, v: false }),
        lectura: val => { const { it, vp } = reparto(val.r2, val.r3); return [I, ` = ${f(it, 2)}\u00a0A = ${f(vp / val.r2, 2)}\u00a0A + ${f(vp / val.r3, 2)}\u00a0A`]; },
        arrastres: ['r2', 'r3'].map((id, k) => ({ id: `cursor-${id}`, etiqueta: `cursor del reóstato ${id === 'r2' ? 'R₂' : 'R₃'}`, color: 'c-i',
          donde: val => cursor(kirchhoff(val.r3, { r2: val.r2, rmax: 12, ramas: true, v: false }).datos, 'ramas', k, 12).donde(val[id]),
          mover: (pt, val) => ({ [id]: cursor(kirchhoff(val.r3, { r2: val.r2, rmax: 12, ramas: true, v: false }).datos, 'ramas', k, 12).mover(pt) }) })),
        invitaciones: [
          { texto: 'Haz que las dos ramas lleven la misma corriente.',
            logrado: val => Math.abs(reparto(val.r2, val.r3).i2 - reparto(val.r2, val.r3).i3) < 1e-9,
            bien: 'Ramas iguales, mitad y mitad. ¿Qué pasa si una se hace el doble?' },
          { texto: 'Logra que por R₂ pase el triple de corriente que por R₃.',
            logrado: val => Math.abs(reparto(val.r2, val.r3).i2 - 3 * reparto(val.r2, val.r3).i3) < 1e-9,
            bien: 'La rama de menos resistencia lleva más, y lo que entra al nudo sale.' },
          { texto: 'Haz que entre al nudo la mayor corriente posible.',
            logrado: val => Math.abs(reparto(val.r2, val.r3).it - I_NUDO_MAX) < 1e-9,
            bien: 'Ramas al mínimo: menos resistencia equivalente, más corriente total.' },
          { texto: 'Guarda dos casos con distinta R₂ y la misma corriente total.',
            logrado: (val, guardados) => guardados.some(g => g.r2 !== val.r2 && Math.abs(reparto(g.r2, g.r3).it - reparto(val.r2, val.r3).it) < 1e-9)
              && guardados.some(g => mismo(g, val)),
            bien: 'Otras ramas, la misma resistencia equivalente: la pila no nota la diferencia.' },
        ],
      },
      Object.assign({ id: 'recta-vi', titulo: 'La recta V contra I', pieza: 'ejes',
        invitaciones: [
          { texto: 'Busca la recta más empinada.',
            logrado: val => Math.abs(resistencia(val.m, val.L, 1) - R_ALAMBRE_MAX) < 1e-12,
            bien: 'Nicromo y largo: más voltaje para la misma corriente. La pendiente es R.' },
          { texto: 'Haz que con 4 A el alambre pida menos de 5 V.',
            logrado: val => 4 * resistencia(val.m, val.L, 1) < 5,
            bien: 'Poca pendiente, poca resistencia: alambre corto o un material que conduce mejor.' },
          { texto: 'Guarda dos alambres del mismo material: uno con el triple de resistencia.',
            logrado: (val, guardados) => guardados.some(g => g.m === val.m
              && (Math.abs(resistencia(g.m, g.L, 1) - 3 * resistencia(val.m, val.L, 1)) < 1e-12
                || Math.abs(resistencia(val.m, val.L, 1) - 3 * resistencia(g.m, g.L, 1)) < 1e-12))
              && guardados.some(g => mismo(g, val)),
            bien: 'Triple de largo, triple de resistencia: R crece con el largo.' },
        ] }, ohm.juega),
    ],
    historia: {
      texto: 'Antes de 1800 la electricidad se veía en chispas y descargas breves. Ese año, Alessandro Volta apiló discos de dos metales separados por cartón húmedo y obtuvo, por primera vez, una corriente que duraba. Con fuentes así, Georg Ohm midió en 1827 cómo la corriente dependía del largo y del grosor del alambre.',
      pregunta: '¿Qué cambió cuando la electricidad pudo durar?',
      fuente: { titulo: 'Museo Galileo — La pila de Volta', url: 'https://catalogo.museogalileo.it/approfondimento/Pila.html' },
    },
    ideas: [corriente, ohm, fem, seriePar, nudos, potencia],
  };
});
