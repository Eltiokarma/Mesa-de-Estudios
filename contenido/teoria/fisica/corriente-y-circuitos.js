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

  // ---------- Idea 1: la corriente no se gasta ----------
  // Cambia: el voltaje de la pila y la resistencia del foco · Permanece: dos amperímetros, antes y después del foco ·
  // Progresa: la lectura de los dos, siempre igual · Se reserva: lo lento que avanzan los electrones ·
  // Debe verse: el foco gasta energía, no corriente.
  const N_CU = 8.5e28, QE = 1.6e-19;
  const vDeriva = (i, amm2) => i / (N_CU * QE * amm2 * 1e-6) * 1000;   // mm/s
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
      consigna: 'Un foco con un amperímetro antes y otro después. Cambia la pila y el foco, y compara lo que marcan los dos.',
      voz: 'Si el foco se comiera corriente, el segundo marcaría menos.',
      controles: [
        { id: 'e', etiqueta: 'ε', color: 'c-o', min: 3, max: 12, paso: 3, inicio: 6, unidad: 'V', decimales: 0 },
        { id: 'r', etiqueta: 'R', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 3, unidad: 'Ω', decimales: 0 },
      ],
      dibujo: val => conAmperimetros(val.e, val.r),
      lectura: val => [I, ` = ${f(val.e / val.r, 2)} A antes y después del foco`],
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
      ecuacion: [I, ' = ', { frac: ['Δq', 'Δt'] }, '   ·   J = ', { frac: [I, 'A'] }, '   ·   ', I, ' = n e A ', { sub: ['v', 'd'] }],
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
          pregunta: `Un cable de cobre de ${f(amm)} mm² lleva ${f(i)} A. Con n = 8,5 × 10²⁸ electrones/m³ y e = 1,6 × 10⁻¹⁹ C, ¿qué rapidez media tienen los electrones?`,
          opciones: opciones(vd, [
            { id: 'unid', valor: vd / 1e6, error: 'CI-UNID', siFuera: 'Esa cuenta deja el área en mm². Hay que pasarla a m².' },
            { id: 'sin-i', valor: vd / i, error: 'C2', siFuera: 'Esa sería con 1 A; aquí la corriente es otra.' },
            { id: 'luz', valor: vd * 1000, error: 'CI-RAPIDO', siFuera: 'Esa cuenta da metros en lugar de milímetros por segundo.' },
          ], n => `${f(n, 3)} mm/s`),
          solucion: { texto: 'Se despeja v de I = n e A v, con el área en m².', ecuacion: [{ sub: ['v', 'd'] }, ` = ${f(i)} / (8,5×10²⁸ · 1,6×10⁻¹⁹ · ${f(amm)}×10⁻⁶) = ${f(vd, 3)} mm/s`] },
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
      consigna: 'Un alambre metálico conectado a una fuente que puedes subir. Elige el material y su largo, y mira la recta V contra I.',
      voz: 'Más empinada quiere decir más voltaje para la misma corriente.',
      controles: [
        { id: 'm', etiqueta: 'Material', opciones: [{ valor: 'nicromo', texto: 'Nicromo' }, { valor: 'constantan', texto: 'Constantán' }] },
        { id: 'L', etiqueta: 'Largo', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'm', decimales: 0 },
      ],
      dibujo: val => ({ datos: Object.assign(EJE_VI(), { curvas: [rectaVI(resistencia(val.m, val.L, 1), `R = ${f(resistencia(val.m, val.L, 1), 2)} Ω`)] }), estado: {} }),
      lectura: val => [R, ` = ${f(resistencia(val.m, val.L, 1), 2)} Ω con 1 mm² de sección`],
      minimo: 3,
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
        { estado: { corte: 0 }, texto: 'La resistencia depende del material, del largo y del área.', ecuacion: [R, ' = ρ ', { frac: ['L', 'A'] }] },
        { estado: { corte: 1 }, texto: 'Nicromo, 2 m y 1 mm²: el área se pasa a m².', ecuacion: [R, ' = 1,1×10⁻⁶ · ', { frac: ['2', '1×10⁻⁶'] }, ` = ${f(resistencia('nicromo', 2, 1), 2)} Ω`] },
        { estado: { corte: 2 }, texto: 'En este alambre, V es proporcional a I: la recta pasa por el origen.', ecuacion: [V, ' = ', I, R, ` = 3 · ${f(resistencia('nicromo', 2, 1), 1)} = ${f(3 * resistencia('nicromo', 2, 1), 1)} V`] },
        { estado: { corte: 2 }, texto: 'Doble de largo multiplica por 2; doble de área divide entre 2.', ecuacion: [{ frac: ['2L', '2A'] }, ' = ', { frac: ['L', 'A'] }] },
      ],
    },
    regla: {
      texto: 'La resistencia crece con el largo y baja con el área. En un conductor óhmico, el voltaje es proporcional a la corriente: R es la pendiente.',
      ecuacion: [R, ' = ρ ', { frac: ['L', 'A'] }, '   ·   ', V, ' = ', I, R],
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
          pregunta: ['¿Qué resistencia tiene un alambre de ', m === 'nicromo' ? 'nicromo (ρ = 1,1 × 10⁻⁶ Ω·m)' : 'constantán (ρ = 4,9 × 10⁻⁷ Ω·m)', ` de ${f(L)} m de largo y ${f(amm, 1)} mm² de sección?`],
          opciones: opciones(rr, [
            { id: 'unid', valor: rr * 1e-6, error: 'CI-UNID', siFuera: 'Esa cuenta deja el área en mm². Hay que pasarla a m².' },
            { id: 'inv', valor: RHO[m] * amm * 1e-6 / L * 1e12, error: 'CI-RHO', siFuera: 'Esa cuenta pone el área arriba y el largo abajo.' },
            { id: 'sin-l', valor: rr / L, error: 'CI-RHO', siFuera: 'Esa sería la resistencia de un metro.' },
          ], n => `${f(n, 2)} Ω`),
          solucion: { texto: 'ρ por largo entre área, con el área en m².', ecuacion: [R, ` = ${m === 'nicromo' ? '1,1×10⁻⁶' : '4,9×10⁻⁷'} · ${f(L)} / ${f(amm, 1)}×10⁻⁶ = ${f(rr, 2)} Ω`] },
        };
      },
    },
  };

  // ---------- Idea 3: fem, resistencia interna y aparatos de medida ----------
  // Cambia: la resistencia que conecta la pila · Permanece: la pila (12 V y 1 Ω adentro) y un voltímetro en sus bornes ·
  // Progresa: la corriente y lo que marca el voltímetro · Se reserva: el circuito abierto, sin corriente ·
  // Debe verse: el voltímetro marca menos que ε solo cuando hay corriente, por lo que se pierde adentro.
  const FEM = 12, RINT = 1;
  const pilaReal = (rx, o = {}) => {
    const abierto = rx === Infinity, i = abierto ? 0 : FEM / (rx + RINT), vt = FEM - i * RINT;
    return { datos: {
      fuente: { rotulo: `ε = ${FEM} V`, r: `r = ${RINT} Ω`, voltimetro: o.leer === false ? '?' : `${f(vt, 2)} V`, color: 'o' },
      serie: [A(o.leer === false ? '?' : `${f(i, 2)} A`), ...(abierto ? [] : [resist(`R = ${f(rx)} Ω`)])],
      abierto,
    }, estado: {} };
  };
  const fem = {
    id: 'fem-y-medidores',
    titulo: 'La pila también se resiste',
    temas: ['Fuerza electromotriz', 'Amperímetro y voltímetro'],
    pieza: 'fis-circuito',
    juega: {
      consigna: 'Una pila real: 12 V de fem y 1 Ω adentro. El amperímetro va en serie y el voltímetro en sus bornes. Cambia R.',
      voz: 'Mira qué pasa con el voltímetro cuando la corriente crece.',
      controles: [{ id: 'r', etiqueta: 'R', color: 'c-i', min: 1, max: 11, paso: 1, inicio: 5, unidad: 'Ω', decimales: 0 }],
      dibujo: val => pilaReal(val.r),
      lectura: val => [I, ` = ${f(FEM / (val.r + RINT), 2)} A · `, V, ` en bornes = ${f(FEM - FEM / (val.r + RINT) * RINT, 2)} V`],
      minimo: 3,
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
      ecuacion: [V, ' = ', EPS, ' − ', I, ' r   ·   ', I, ' = ', { frac: [EPS, [R, ' + r']] }],
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
    return { datos: { fuente: pila(e), serie: Array.from({ length: n }, () => foco(`${RF} Ω`, p / PMAX, { lectura: `${f(p, 2)} W` })) }, estado: {} };
  };
  const enParalelo = (n, e, o = {}) => {
    const p = e * e / RF;
    return { datos: { fuente: pila(e), ramas: Array.from({ length: n }, () => foco(`${RF} Ω`, o.apagado ? 0 : p / PMAX, { lectura: o.leer === false ? '' : `${f(p, 2)} W` })) }, estado: {} };
  };
  const reqDe = (modo, rs) => (modo === 'serie' ? rs.reduce((a, b) => a + b, 0) : 1 / rs.reduce((a, b) => a + 1 / b, 0));
  const seriePar = {
    id: 'serie-paralelo',
    titulo: 'En paralelo, toda la pila',
    temas: ['Resistencias en serie y en paralelo'],
    pieza: 'fis-circuito',
    juega: {
      consigna: 'Focos iguales de 4 Ω, uno detrás de otro (en serie). Agrega focos y cambia la pila; mira el brillo de cada uno.',
      voz: 'En serie, cada foco nuevo apaga un poco a los demás.',
      controles: [
        { id: 'n', etiqueta: 'Focos', min: 1, max: 3, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'e', etiqueta: 'ε', color: 'c-o', min: 6, max: 12, paso: 6, inicio: 12, unidad: 'V', decimales: 0 },
      ],
      dibujo: val => enSerie(val.n, val.e),
      lectura: val => [R, ` total = ${f(val.n * RF)} Ω · `, I, ` = ${f(val.e / (val.n * RF), 2)} A`],
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
      revelar: { datos: { fuente: pila(12), ramas: [foco('4 Ω', 1, { lectura: '36 W' }), foco('4 Ω', 1, { lectura: '36 W' }), foco('vacío', 0)] }, estado: {} },
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
      ecuacion: ['serie: ', { sub: [R, 'eq'] }, ' = Σ', R, '   ·   paralelo: ', { frac: ['1', { sub: [R, 'eq'] }] }, ' = Σ', { frac: ['1', R] }],
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
  // Cambia: la resistencia de una de las dos ramas · Permanece: la pila (12 V) y R₁ = 2 Ω en serie ·
  // Progresa: la corriente que entra al nudo y el voltaje de las ramas · Se reserva: cómo se reparte en el nudo ·
  // Debe verse: por la rama de menor resistencia pasa más corriente; lo que entra al nudo sale.
  const R1 = 2, R2K = 3;
  const kirchhoff = (r3, o = {}) => {
    const rp = R2K * r3 / (R2K + r3), it = 12 / (R1 + rp), vp = it * rp;
    const i2 = vp / R2K, i3 = vp / r3;
    return { datos: {
      fuente: pila(12),
      serie: [A(`${f(it, 2)} A`), resist(`R₁ = ${R1} Ω`)],
      ramas: [resist(`R₂ = ${R2K} Ω`, { voltimetro: o.v === false ? null : `${f(vp, 2)} V`, corriente: o.ramas ? { texto: `${f(i2, 2)} A`, color: 'h' } : null, desde: o.desde }),
        resist(`R₃ = ${f(r3)} Ω`, { corriente: o.ramas ? { texto: `${f(i3, 2)} A`, color: 'h' } : null, desde: o.desde })],
    }, estado: {} };
  };
  const nudos = {
    id: 'kirchhoff',
    titulo: 'Lo que entra al nudo sale',
    temas: ['Leyes de Kirchhoff'],
    pieza: 'fis-circuito',
    juega: {
      consigna: 'R₁ en serie y después dos ramas en paralelo. Cambia R₃ y mira la corriente que entra al nudo y el voltaje de las ramas.',
      voz: 'Las dos ramas comparten el mismo voltaje. Fíjate en eso.',
      controles: [{ id: 'r3', etiqueta: 'R₃', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 6, unidad: 'Ω', decimales: 0 }],
      dibujo: val => kirchhoff(val.r3),
      lectura: val => { const rp = R2K * val.r3 / (R2K + val.r3), it = 12 / (R1 + rp); return [I, ` = ${f(it, 2)} A · `, V, ` ramas = ${f(it * rp, 2)} V`]; },
      minimo: 3,
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
        { estado: { corte: 2 }, texto: 'Las dos ramas tienen 6 V. Cada una lleva V/R.', ecuacion: [{ sub: [I, '2'] }, ' = 6/3 = 2 A · ', { sub: [I, '3'] }, ' = 6/6 = 1 A'] },
        { estado: { corte: 2 }, texto: 'Nudo: lo que entra es lo que sale.', ecuacion: ['3 A = 2 A + 1 A'] },
      ],
    },
    regla: {
      texto: 'En un nudo, la suma de corrientes que entran es igual a la que sale. En una malla cerrada, las subidas y bajadas de voltaje suman cero.',
      ecuacion: ['Σ', { sub: [I, 'entran'] }, ' = Σ', { sub: [I, 'salen'] }, '   ·   Σ', EPS, ' = Σ', I, R],
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
          solucion: { texto: 'Las dos ramas tienen el mismo voltaje; se reparte al revés que R.', ecuacion: [V, ` = ${f(it)} · ${f(rp, 2)} = ${f(v, 2)} V · `, I, ` = ${f(v, 2)}/${f(ra)} = ${f(ia, 2)} A`] },
        };
      },
    },
  };

  // ---------- Idea 6: potencia y efecto Joule ----------
  // Cambia: la resistencia del primer foco, en paralelo con otro de 6 Ω · Permanece: la pila de 12 V ·
  // Progresa: el brillo de cada uno · Se reserva: los mismos focos en serie, donde el orden se invierte ·
  // Debe verse: «el de menos R brilla más» vale en paralelo; en serie, brilla más el de más R.
  const RB = 6, PM6 = 72;
  const dosPar = (ra, o = {}) => ({ datos: { fuente: pila(12), ramas: [foco(`${f(ra)} Ω`, (144 / ra) / PM6, { lectura: `${f(144 / ra, 1)} W` }), foco(`${RB} Ω`, (144 / RB) / PM6, { lectura: `${f(144 / RB, 1)} W` })] }, estado: {} });
  const dosSerie = (ra, o = {}) => {
    const i = 12 / (ra + RB), pa = i * i * ra, pb = i * i * RB;
    return { datos: { fuente: pila(12), serie: [foco(`${f(ra)} Ω`, o.apagado ? 0 : pa / PM6 * 4, { lectura: o.leer === false ? '' : `${f(pa, 1)} W`, desde: o.desde }), foco(`${RB} Ω`, o.apagado ? 0 : pb / PM6 * 4, { lectura: o.leer === false ? '' : `${f(pb, 1)} W`, desde: o.desde })] }, estado: {} };
  };
  const potencia = {
    id: 'potencia-joule',
    titulo: 'Qué foco brilla más',
    temas: ['Potencia y efecto Joule'],
    pieza: 'fis-circuito',
    juega: {
      consigna: 'Dos focos en paralelo con una pila de 12 V; el segundo tiene 6 Ω. Cambia la resistencia del primero y compara su brillo.',
      voz: 'En paralelo, ¿brilla más el de menos o el de más resistencia?',
      controles: [{ id: 'ra', etiqueta: 'R del primero', color: 'c-i', min: 2, max: 12, paso: 2, inicio: 2, unidad: 'Ω', decimales: 0 }],
      dibujo: val => dosPar(val.ra),
      lectura: val => [P, ` = ${f(144 / val.ra, 1)} W y ${f(144 / RB, 1)} W`],
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
        { estado: { corte: 1 }, texto: 'Con la misma corriente, la potencia crece con R.', ecuacion: [P, ' = ', { sup: [I, '2'] }, R, ` = 2,25 · 2 = 4,5 W · 2,25 · 6 = 13,5 W`] },
        { estado: { corte: 1 }, texto: 'En paralelo era al revés: mismo V, y P = V²/R.', ecuacion: [P, ' = ', { frac: [{ sup: [V, '2'] }, R] }] },
        { estado: { corte: 1 }, texto: 'Efecto Joule: esa energía sale como calor y luz cada segundo.', ecuacion: ['E = ', P, ' t'] },
      ],
    },
    regla: {
      texto: 'La potencia eléctrica es voltaje por corriente. Con la misma corriente (serie) rinde más la R mayor; con el mismo voltaje (paralelo), la menor.',
      ecuacion: [P, ' = ', V, I, ' = ', { sup: [I, '2'] }, R, ' = ', { frac: [{ sup: [V, '2'] }, R] }, '   ·   E = ', P, ' t'],
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
            solucion: { texto: 'Con el voltaje fijo, P = V²/R.', ecuacion: [P, ` = ${f(v)}² / ${f(rr)} = ${f(p, 1)} W`] },
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
          solucion: { texto: 'Primero la corriente común; luego I²R.', ecuacion: [I, ` = ${f(e)}/${f(ra + rb)} = ${f(i, 2)} A · `, P, ` = ${f(i, 2)}² · ${f(rb)} = ${f(pb, 2)} W`] },
        };
      },
    },
  };

  return {
    unidad: 'fisica.corriente-y-circuitos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-circuito.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Antes de 1800 la electricidad se veía en chispas y descargas breves. Ese año, Alessandro Volta apiló discos de dos metales separados por cartón húmedo y obtuvo, por primera vez, una corriente que duraba. Con fuentes así, Georg Ohm midió en 1827 cómo la corriente dependía del largo y del grosor del alambre.',
      pregunta: '¿Qué cambió cuando la electricidad pudo durar?',
      fuente: { titulo: 'Museo Galileo — La pila de Volta', url: 'https://catalogo.museogalileo.it/approfondimento/Pila.html' },
    },
    ideas: [corriente, ohm, fem, seriePar, nudos, potencia],
  };
});
