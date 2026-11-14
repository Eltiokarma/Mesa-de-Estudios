/*
 * Teoría de «Termodinámica» (fisica.termodinamica). Molde: docs/teoria.md y la unidad de referencia
 * contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 13) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Colores (regla 4): P naranja (c-o), V turquesa (c-i), T rojo (c-h), U y ΔU verde (c-d). Q, W y η van en tinta:
 * el kit tiene cuatro tokens y estas magnitudes se distinguen por su barra rotulada, no por color.
 * Estado: completa (14 nov 2026): seis ideas que cubren los siete temas del catálogo.
 * Códigos de error nuevos (hipótesis, sin dato propio): T-CELSIUS (usar °C en PV = nRT), T-INVERSA (P baja al
 * calentar a V fijo), T-SIGNO (cambia el signo de ΔU), T-AREA (suma áreas sin signo en un ciclo), T-CVCP (cree que a
 * volumen fijo hace falta más calor), T-SUPERA (no compara con el máximo de Carnot). Los demás, de
 * docs/investigacion/fluidos-calor-termodinamica-ideas-erroneas.md (T3 a T15).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: seis relaciones de un gas que se calienta y empuja un pistón, cada una jugada antes de preguntarla.
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: predice P con PV = nRT, hace la cuenta Q − W = ΔU con signos y lee el trabajo como área.
 *   Orden de atención: 1.º la figura (P–V o las barras) · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué el calor y el trabajo dependen del camino y la energía interna no?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const P = { v: 'c-o', t: 'P' }, V = { v: 'c-i', t: 'V' }, T = { v: 'c-h', t: 'T' }, U = { v: 'c-d', t: 'U' };
  const dU = ['Δ', U], dV = ['Δ', V], dT = ['Δ', T];
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
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
  const conSigno = (n, u = 'J') => `${n > 0 ? '+' : n < 0 ? '−' : ''}${f(Math.abs(n), 0)} ${u}`;
  // Barras de la primera ley: lo que entra como calor, lo que sale como trabajo (−W) y el resultado ΔU = Q − W.
  const cuentas = (q, w, max = 600, extra = {}) => ({
    max: Math.max(max, Math.abs(q), Math.abs(w), Math.abs(q - w)), igual: 2,
    barras: [
      { rotulo: 'Q', valor: q, texto: conSigno(q), desde: extra.dq },
      { rotulo: '−W', valor: -w, texto: conSigno(-w), desde: extra.dw },
      { rotulo: 'ΔU', valor: q - w, texto: conSigno(q - w), color: 'd', desde: extra.du },
    ],
  });

  // ---------- Idea 1: PV = nRT con la temperatura absoluta ----------
  // Cambia: T y V del gas · Permanece: n = 1 mol y la curva de cada temperatura · Progresa: la presión del punto ·
  // Se reserva: el calentamiento a volumen fijo, que se pregunta con °C · Debe verse: P se duplica cuando T (en K) se duplica.
  const R_ATM = 0.082;
  const presion = (t, v) => R_ATM * t / v;
  const isoterma = t => Array.from({ length: 33 }, (_, k) => { const v = 2 + k * 0.25; return [v, presion(t, v)]; });
  const EJE_PV = (pmax = 30) => ({
    x: { min: 0, max: 10, paso: 2, nombre: 'V', unidad: 'L', decimales: 0, color: 'i' },
    y: { min: 0, max: pmax, paso: 10, nombre: 'P', unidad: 'atm', decimales: 0, color: 'o' },
  });
  const gas = {
    id: 'gas-ideal',
    titulo: 'La temperatura va en kelvin',
    temas: ['Leyes de los gases y ecuación de estado', 'Modelo cinético y energía interna'],
    pieza: 'ejes',
    juega: {
      consigna: 'Un mol de gas en un cilindro. Elige su temperatura y su volumen, y mira dónde cae su presión.',
      voz: 'Cada curva es una temperatura. Prueba moverte sobre una y saltar a otra.',
      controles: [
        { id: 't', etiqueta: 'T', color: 'c-h', min: 200, max: 600, paso: 100, inicio: 300, unidad: 'K', decimales: 0 },
        { id: 'v', etiqueta: 'V', color: 'c-i', min: 2, max: 10, paso: 2, inicio: 4, unidad: 'L', decimales: 0 },
      ],
      dibujo: val => ({ datos: Object.assign(EJE_PV(), {
        curvas: [{ puntos: isoterma(val.t), color: 'h', rotulo: `${f(val.t, 0)} K` }],
        puntos: [{ x: val.v, y: presion(val.t, val.v), color: 'o', rotulo: `${f(presion(val.t, val.v), 1)} atm`, guias: true }],
      }), estado: {} }),
      lectura: val => [P, ` = ${f(presion(val.t, val.v), 2)} atm · `, 'PV/T = 0,082 siempre'],
      minimo: 3,
    },
    predice: {
      pregunta: ['Un gas en un tanque rígido está a 27 °C. Lo calientas hasta 327 °C sin que escape nada. ¿Qué pasa con su presión?'],
      opciones: [
        { id: 'c', texto: 'Se duplica', correcta: true },
        { id: 'celsius', texto: 'Se multiplica por 12', error: 'T-CELSIUS', siFuera: '327/27 ≈ 12 sería cierto si 0 °C fuera el cero de energía. Ese cero es 0 K.' },
        { id: 'igual', texto: 'No cambia: el tanque es el mismo', error: 'T3', siFuera: 'El volumen sí es el mismo. Pero las moléculas, más rápidas, golpean más fuerte las paredes.' },
        { id: 'mitad', texto: 'Se reduce a la mitad', error: 'T-INVERSA', siFuera: 'Eso pasaría al duplicar el volumen a T fija. Aquí V no cambia y T sube.' },
      ],
      dibujo: { datos: Object.assign(EJE_PV(), { curvas: [{ puntos: isoterma(300), color: 'h', rotulo: '300 K' }], puntos: [{ x: 4, y: presion(300, 4), color: 'o', rotulo: `${f(presion(300, 4), 2)} atm`, guias: true }] }), estado: {} },
      revelar: { datos: Object.assign(EJE_PV(), {
        curvas: [{ puntos: isoterma(300), color: 'h', rotulo: '300 K' }, { puntos: isoterma(600), color: 'h', rotulo: '600 K', discontinua: true, en: [3.3, 17] }],
        puntos: [{ x: 4, y: presion(300, 4), color: 'o', rotulo: `${f(presion(300, 4), 2)} atm` }, { x: 4, y: presion(600, 4), color: 'o', rotulo: `${f(presion(600, 4), 1)} atm`, guias: true }],
      }), estado: {} },
      coincide: 'Coincide: 27 °C son 300 K y 327 °C son 600 K. La temperatura absoluta se duplica.',
    },
    mira: {
      datos: Object.assign(EJE_PV(), {
        curvas: [{ puntos: isoterma(300), color: 'h', rotulo: '300 K', desde: 1 }, { puntos: isoterma(600), color: 'h', rotulo: '600 K', discontinua: true, en: [3.3, 17], desde: 2 }],
        puntos: [
          { x: 4, y: presion(300, 4), color: 'o', rotulo: 'A', guias: true, desde: 1 },
          { x: 4, y: presion(600, 4), color: 'o', rotulo: 'B', guias: true, desde: 2 },
          { x: 8, y: presion(600, 8), color: 'o', rotulo: 'C', guias: true, desde: 3 },
        ],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: `A: 1 mol a 300 K en 4 L tiene ${f(presion(300, 4), 2)} atm.`, ecuacion: [P, ' = ', { frac: ['0,082 · 300', '4'] }, ` = ${f(presion(300, 4), 2)} atm`] },
        { estado: { corte: 2 }, texto: 'B: mismo volumen a 600 K. La presión se duplica.', ecuacion: [{ frac: [{ sub: [P, 'B'] }, { sub: [P, 'A'] }] }, ' = ', { frac: [{ sub: [T, 'B'] }, { sub: [T, 'A'] }] }, ' = 2'] },
        { estado: { corte: 3 }, texto: 'C: a 600 K y el doble de volumen, vuelve la presión de A.', ecuacion: [{ sub: [P, 'C'] }, ` = ${f(presion(600, 8), 2)} atm`] },
        { estado: { corte: 3 }, texto: 'T mide la energía de las moléculas: U depende solo de T.', ecuacion: [U, ' = ', { frac: ['3', '2'] }, ' n R ', T, '  (gas monoatómico)'] },
      ],
    },
    regla: {
      texto: 'En un gas ideal, presión por volumen es proporcional a la temperatura absoluta. Su energía interna depende solo de T.',
      ecuacion: [P, V, ' = n R ', T],
      condicion: 'T en kelvin, gas a presión baja y lejos de condensarse. R = 0,082 atm·L/(mol·K) = 8,31 J/(mol·K).',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const t1 = r.de([27, 77, 127, 177]), p1 = r.de([2, 3, 4, 5]), fac = r.de([1.5, 2]);
          const k1 = t1 + 273, k2 = k1 * fac, t2 = k2 - 273, p2 = p1 * fac;
          return {
            pregunta: ['Un tanque rígido tiene gas a ', P, ` = ${f(p1)} atm y ${f(t1)} °C. Se calienta hasta ${f(t2)} °C. ¿Qué presión alcanza?`],
            opciones: opciones(p2, [
              { id: 'celsius', valor: p1 * t2 / t1, error: 'T-CELSIUS', siFuera: 'Esa cuenta usa °C. La proporción vale con kelvin.' },
              { id: 'inversa', valor: p1 / fac, error: 'T-INVERSA', siFuera: 'Así cambiaría si el volumen creciera a T fija.' },
              { id: 'igual', valor: p1, error: 'T3', siFuera: 'Sería cierto si la temperatura no cambiara.' },
            ], n => `${f(n, 2)} atm`),
            solucion: { texto: `Pasa de ${f(k1)} K a ${f(k2)} K: P crece en la misma proporción.`, ecuacion: [{ sub: [P, '2'] }, ` = ${f(p1)} · ${f(k2)}/${f(k1)} = ${f(p2, 2)} atm`] },
          };
        }
        if (tipo === 1) {
          const v1 = r.de([2, 3, 4, 6]), p1 = r.de([2, 4, 6]), v2 = v1 * r.de([2, 3]), p2 = p1 * v1 / v2;
          return {
            pregunta: ['A temperatura fija, un gas pasa de ', V, ` = ${f(v1)} L a ${f(v2)} L. Si su presión era ${f(p1)} atm, ¿cuál es ahora?`],
            opciones: opciones(p2, [
              { id: 'directa', valor: p1 * v2 / v1, error: 'T-INVERSA', siFuera: 'Esa sería la presión si P creciera con V. A T fija, PV no cambia.' },
              { id: 'igual', valor: p1, error: 'T3', siFuera: 'Sería cierto si el volumen no cambiara.' },
              { id: 'resta', valor: p1 - (v2 - v1) / 2, error: 'T-RESTA', siFuera: 'Esa cuenta resta. El producto PV se conserva.' },
            ], n => `${f(n, 2)} atm`),
            solucion: { texto: 'A temperatura fija, el producto PV se mantiene.', ecuacion: [{ sub: [P, '2'] }, ` = ${f(p1)} · ${f(v1)} / ${f(v2)} = ${f(p2, 2)} atm`] },
          };
        }
        const n = r.de([0.5, 1, 2]), t = r.de([300, 400, 600]), v = r.de([4, 8, 12]), p = n * R_ATM * t / v;
        return {
          pregunta: [`Hay ${f(n, 1)} mol de gas a `, T, ` = ${f(t)} K en `, V, ` = ${f(v)} L. ¿Qué presión tiene? Usa R = 0,082 atm·L/(mol·K).`],
          opciones: opciones(p, [
            { id: 'sin-n', valor: R_ATM * t / v, error: 'T-MOLES', siFuera: 'Esa sería la presión de un solo mol.' },
            { id: 'por-v', valor: n * R_ATM * t * v, error: 'T-INVERSA', siFuera: 'Esa cuenta multiplica por V. El volumen divide.' },
            { id: 'celsius', valor: n * R_ATM * (t - 273) / v, error: 'T-CELSIUS', siFuera: 'Esa cuenta pasa T a °C. La ecuación pide kelvin.' },
          ], x => `${f(x, 2)} atm`),
          solucion: { texto: 'Se despeja P de la ecuación de estado.', ecuacion: [P, ` = ${f(n, 1)} · 0,082 · ${f(t)} / ${f(v)} = ${f(p, 2)} atm`] },
        };
      },
    },
  };

  // ---------- Idea 2: primera ley, una cuenta con signos ----------
  // Cambia: el calor que entra y el trabajo que el gas hace · Permanece: el cero común y el orden Q, −W, ΔU ·
  // Progresa: el largo de la barra ΔU · Se reserva: el caso en que el gas recibe calor y aun así se enfría ·
  // Debe verse: ΔU es la suma de las dos barras de la izquierda.
  const primera = {
    id: 'primera-ley',
    titulo: 'Entra calor, sale trabajo',
    temas: ['Primera ley'],
    pieza: 'fis-cuentas',
    juega: {
      consigna: 'Elige el calor que recibe el gas y el trabajo que hace al empujar el pistón. Negativo es al revés.',
      voz: 'Mira la tercera barra: es la suma de las otras dos.',
      controles: [
        { id: 'q', etiqueta: 'Q', min: -400, max: 600, paso: 100, inicio: 300, unidad: 'J', decimales: 0 },
        { id: 'w', etiqueta: 'W', min: -300, max: 500, paso: 100, inicio: 100, unidad: 'J', decimales: 0 },
      ],
      dibujo: val => ({ datos: cuentas(val.q, val.w), estado: {} }),
      lectura: val => [dU, ` = ${conSigno(val.q - val.w)}`, val.q - val.w > 0 ? ' · el gas se calienta' : val.q - val.w < 0 ? ' · el gas se enfría' : ' · T no cambia'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un gas recibe 200 J de calor y, al expandirse, hace 500 J de trabajo sobre el pistón. ¿Cuánto cambia su energía interna?',
      opciones: [
        { id: 'c', texto: '−300 J: se enfría', correcta: true },
        { id: 'suma', texto: '+700 J', error: 'T9', siFuera: 'Sumar sería cierto si el pistón empujara al gas. Aquí el gas empuja y gasta energía.' },
        { id: 'todo', texto: '+200 J: todo el calor se queda', error: 'T8', siFuera: 'Sería cierto si el volumen no cambiara. Al expandirse, parte sale como trabajo.' },
        { id: 'signo', texto: '+300 J', error: 'T-SIGNO', siFuera: 'La diferencia es 300 J, bien. Pero salió más de lo que entró: U baja.' },
      ],
      dibujo: { datos: cuentas(200, 500, 600, { du: 9 }), estado: { corte: 1 } },
      revelar: { datos: cuentas(200, 500), estado: {} },
      coincide: 'Coincide: entraron 200 J y salieron 500 J. La energía interna baja 300 J.',
    },
    mira: {
      datos: cuentas(200, 500, 600, { dw: 1, du: 2 }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Entran 200 J como calor: suman.', ecuacion: ['Q = +200 J'] },
        { estado: { corte: 1 }, texto: 'El gas empuja el pistón: 500 J salen como trabajo.', ecuacion: ['W = +500 J  →  −W = −500 J'] },
        { estado: { corte: 2 }, texto: 'La energía interna cambia lo que entró menos lo que salió.', ecuacion: [dU, ' = 200 − 500 = −300 J'] },
        { estado: { corte: 2 }, texto: 'ΔU negativo: la temperatura baja aunque recibió calor.', ecuacion: [dU, ' < 0  →  ', dT, ' < 0'] },
      ],
    },
    regla: {
      texto: 'La energía interna cambia en el calor que recibe el gas menos el trabajo que el gas hace.',
      ecuacion: [dU, ' = Q − W'],
      condicion: 'Q > 0 si el gas recibe calor; W > 0 si el gas se expande y empuja. Otra convención cambia los signos.',
    },
    ahoraTu: {
      pieza: 'fis-cuentas',
      generar(s) {
        const r = azar(s), q = r.de([-300, -200, 100, 200, 300, 400, 500, 600]), w0 = r.de([-200, -100, 100, 200, 300, 400]);
        const w = w0 === q ? w0 + 100 : w0;
        const pideQ = s % 3 === 2, du = q - w;
        const desc = `${q >= 0 ? `recibe ${f(q)} J de calor` : `pierde ${f(-q)} J de calor`} y ${w >= 0 ? `hace ${f(w)} J de trabajo al expandirse` : `recibe ${f(-w)} J de trabajo al ser comprimido`}`;
        if (pideQ) return {
          pregunta: [`Un gas ${w >= 0 ? `hace ${f(w)} J de trabajo al expandirse` : `es comprimido con ${f(-w)} J de trabajo`} y su energía interna cambia `, dU, ` = ${conSigno(du)}. ¿Cuánto calor recibió?`],
          opciones: opciones(q, [
            { id: 'resta', valor: du - w, error: 'T9', siFuera: 'Esa cuenta usa el signo de W al revés.' },
            { id: 'du', valor: du, error: 'T8', siFuera: 'Ese es ΔU: falta la energía que salió o entró como trabajo.' },
            { id: 'signo', valor: -q, error: 'T-SIGNO', siFuera: 'El valor está bien, el signo no: revisa si entra o sale.' },
          ], n => conSigno(n)),
          solucion: { texto: 'Se despeja Q de la primera ley.', ecuacion: [`Q = `, dU, ` + W = ${f(du)} + (${f(w)}) = ${conSigno(q)}`], dibujo: { datos: cuentas(q, w), estado: {} } },
        };
        return {
          pregunta: `Un gas ${desc}. ¿Cuánto cambia su energía interna?`,
          dibujo: { datos: cuentas(q, w, 600, { du: 9 }), estado: { corte: 1 } },
          opciones: opciones(du, [
            { id: 'suma', valor: q + w, error: 'T9', siFuera: 'Esa cuenta suma el trabajo que hizo el gas: ese trabajo sale.' },
            { id: 'todo', valor: q, error: 'T8', siFuera: 'Ese es solo el calor. Falta restar el trabajo.' },
            { id: 'signo', valor: -du, error: 'T-SIGNO', siFuera: 'El valor está bien, el signo no: compara lo que entra con lo que sale.' },
          ], n => conSigno(n)),
          solucion: { texto: 'Lo que entró como calor menos lo que salió como trabajo.', ecuacion: [dU, ` = ${f(q)} − (${f(w)}) = ${conSigno(du)}`], dibujo: { datos: cuentas(q, w), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: el trabajo es un área del diagrama P–V ----------
  // Cambia: el camino entre dos estados · Permanece: los estados 1 y 2 · Progresa: el área bajo cada camino ·
  // Se reserva: la vuelta completa, cuya área encerrada no es cero · Debe verse: W depende del camino; U no.
  const E1 = [2, 100], E2 = [6, 300];
  const EJE_KPA = () => ({
    x: { min: 0, max: 8, paso: 2, nombre: 'V', unidad: 'L', decimales: 0, color: 'i' },
    y: { min: 0, max: 400, paso: 100, nombre: 'P', unidad: 'kPa', decimales: 0, color: 'o' },
  });
  const CAMINOS = {
    arriba: [E1, [E1[0], E2[1]], E2],
    abajo: [E1, [E2[0], E1[1]], E2],
    recta: [E1, E2],
  };
  // El borde de arriba de cada área (sin los tramos verticales, que no encierran área).
  const TECHO = { arriba: [[2, 300], [6, 300]], abajo: [[2, 100], [6, 100]], recta: [E1, E2] };
  const areaBajo = pts => pts.slice(1).reduce((s, p, k) => s + (p[0] - pts[k][0]) * (p[1] + pts[k][1]) / 2, 0); // kPa·L = J
  const NOMBRE_CAMINO = { arriba: 'Primero sube P', abajo: 'Primero crece V', recta: 'En línea recta' };
  const camino = c => ({ datos: Object.assign(EJE_KPA(), {
    curvas: [{ puntos: CAMINOS[c], color: 'o' }],
    areas: [{ puntos: TECHO[c], color: 'i', rotulo: `W = ${f(areaBajo(CAMINOS[c]), 0)} J` }],
    puntos: [{ x: E1[0], y: E1[1], color: 'o', rotulo: '1' }, { x: E2[0], y: E2[1], color: 'o', rotulo: '2' }],
  }), estado: {} });
  const WA = areaBajo(CAMINOS.arriba), WB = areaBajo(CAMINOS.abajo), WN = WA - WB;
  const ciclo = (conArea, corte = {}) => Object.assign(EJE_KPA(), {
    curvas: [{ puntos: CAMINOS.arriba, color: 'o', desde: corte.ida }, { puntos: CAMINOS.abajo, color: 'o', discontinua: true, desde: corte.vuelta }],
    areas: conArea ? [
      ...(corte.ida !== undefined ? [{ puntos: [[2, 300], [6, 300]], color: 'i', rotulo: `ida +${f(WA, 0)} J`, desde: corte.ida, hasta: corte.ida }] : []),
      ...(corte.vuelta !== undefined ? [{ puntos: [[2, 100], [6, 100]], color: 'i', rotulo: `vuelta −${f(WB, 0)} J`, desde: corte.vuelta, hasta: corte.vuelta }] : []),
      { puntos: [[2, 100], [2, 300], [6, 300], [6, 100]], color: 'd', rotulo: `neto ${f(WN, 0)} J`, cerrada: true, desde: corte.neto },
    ] : [],
    puntos: [{ x: 2, y: 100, color: 'o', rotulo: '1' }, { x: 6, y: 300, color: 'o', rotulo: '2' }],
  });
  const area = {
    id: 'trabajo-area',
    titulo: 'El trabajo es un área',
    temas: ['Procesos y diagrama P-V'],
    pieza: 'ejes',
    juega: {
      consigna: 'El gas pasa del estado 1 al estado 2. Elige el camino y mira el área bajo él.',
      voz: 'Los extremos no cambian. Fíjate en lo que sí cambia.',
      controles: [{ id: 'c', etiqueta: 'Camino', opciones: Object.keys(CAMINOS).map(k => ({ valor: k, texto: NOMBRE_CAMINO[k] })) }],
      dibujo: val => camino(val.c),
      lectura: val => [`W = ${f(areaBajo(CAMINOS[val.c]), 0)} J · `, dU, ' es igual en los tres'],
      minimo: 3,
    },
    predice: {
      pregunta: 'El gas va de 1 a 2 por el camino «primero sube P» y regresa de 2 a 1 por «primero crece V». ¿Cuánto trabajo neto hace en la vuelta completa?',
      opciones: [
        { id: 'c', texto: `${f(WN, 0)} J`, correcta: true },
        { id: 'cero', texto: '0 J: volvió al inicio', error: 'T10', siFuera: 'ΔU = 0 al volver al inicio es cierto. El trabajo depende del camino, y aquí son distintos.' },
        { id: 'suma', texto: `${f(WA + WB, 0)} J`, error: 'T-AREA', siFuera: 'Esa cuenta suma la vuelta. Al comprimirse, el gas recibe trabajo: esa área resta.' },
        { id: 'ida', texto: `${f(WA, 0)} J`, error: 'T5', siFuera: 'Ese es el trabajo de la ida. Falta la vuelta.' },
      ],
      dibujo: { datos: ciclo(false), estado: {} },
      revelar: { datos: ciclo(true, { neto: 0 }), estado: {} },
      coincide: 'Coincide: el trabajo neto es el área encerrada por la vuelta.',
    },
    mira: {
      datos: ciclo(true, { ida: 1, vuelta: 2, neto: 3 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Ida: se expande a 300 kPa. El área bajo el camino es positiva.', ecuacion: [`W = 300 · (6 − 2) = +${f(WA, 0)} J`] },
        { estado: { corte: 2 }, texto: 'Vuelta: se comprime a 100 kPa. El gas recibe trabajo: negativo.', ecuacion: [`W = 100 · (2 − 6) = −${f(WB, 0)} J`] },
        { estado: { corte: 3 }, texto: 'Neto: la diferencia es el área encerrada.', ecuacion: [`W = ${f(WA, 0)} − ${f(WB, 0)} = ${f(WN, 0)} J`] },
        { estado: { corte: 3 }, texto: 'Volvió a 1: ΔU = 0, así que recibió ese mismo calor neto.', ecuacion: [dU, ' = 0  →  Q = W = ', `${f(WN, 0)} J`] },
      ],
    },
    regla: {
      texto: 'El trabajo del gas es el área bajo su camino en P–V: positiva al expandirse y negativa al comprimirse. En un ciclo, el área encerrada.',
      ecuacion: ['W = área bajo P–V   ·   isobárico: W = ', P, dV],
      condicion: 'el proceso es lento (cuasiestático): el gas tiene una presión definida en cada punto del camino. 1 kPa·L = 1 J.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), p = r.de([100, 150, 200, 250, 300]), a = r.ent(1, 4), b = a + r.ent(2, 4);
        const vi = s % 2 ? b : a, vf = s % 2 ? a : b, w = p * (vf - vi);
        return {
          pregunta: ['Un gas a presión fija ', P, ` = ${f(p)} kPa pasa de `, V, ` = ${f(vi)} L a ${f(vf)} L. ¿Cuánto trabajo hace el gas?`],
          dibujo: { datos: Object.assign(EJE_KPA(), { curvas: [{ puntos: [[vi, p], [vf, p]], color: 'o' }], puntos: [{ x: vi, y: p, color: 'o', rotulo: '1' }, { x: vf, y: p, color: 'o', rotulo: '2' }] }), estado: {} },
          opciones: opciones(w, [
            { id: 'signo', valor: -w, error: 'T-SIGNO', siFuera: w < 0 ? 'El área mide eso, pero al comprimirse el gas recibe trabajo: negativo.' : 'Al expandirse, el gas empuja: el trabajo es positivo.' },
            { id: 'pv', valor: p * vf, error: 'T5', siFuera: 'Ese es P por el volumen final, no por el cambio.' },
            { id: 'cero', valor: 0, error: 'T10', siFuera: 'Sería cierto si el volumen no cambiara.' },
          ], n => conSigno(n)),
          solucion: { texto: 'Es el área del rectángulo bajo el camino, con signo.', ecuacion: [`W = ${f(p)} · (${f(vf)} − ${f(vi)}) = ${conSigno(w)}`],
            dibujo: { datos: Object.assign(EJE_KPA(), { curvas: [{ puntos: [[vi, p], [vf, p]], color: 'o' }], areas: [{ puntos: [[Math.min(vi, vf), p], [Math.max(vi, vf), p]], color: 'i', rotulo: conSigno(w) }] }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: cuatro procesos, cuatro restricciones ----------
  // Cambia: el proceso (qué se mantiene fijo) · Permanece: el gas (helio) y las tres barras Q, −W, ΔU ·
  // Progresa: qué barra queda en cero · Se reserva: el isotérmico, donde entra calor y T no sube ·
  // Debe verse: «isotérmico» no es «sin calor» y «adiabático» no es «a temperatura fija».
  const NR = 10;              // n·R del gas, en J/K (n ≈ 1,2 mol de helio); ΔT = 20 K donde la temperatura cambia
  const NRT_ISO = 577;        // n·R·T del isotérmico (J): el volumen se duplica y W = nRT ln 2 ≈ 400 J
  const PROC = {
    isotermico: { texto: 'Isotérmico', q: NRT_ISO * Math.log(2), w: NRT_ISO * Math.log(2), fijo: 'T fija' },
    isobarico: { texto: 'Isobárico', q: 2.5 * NR * 20, w: NR * 20, fijo: 'P fija' },
    isocorico: { texto: 'Isocórico', q: 1.5 * NR * 20, w: 0, fijo: 'V fijo' },
    adiabatico: { texto: 'Adiabático', q: 0, w: 1.5 * NR * 20, fijo: 'sin calor' },
  };
  const barrasProc = (k, corte) => ({ max: 600, igual: 2, barras: [
    { rotulo: 'Q', valor: PROC[k].q, texto: conSigno(PROC[k].q), desde: corte ? 3 : 0 },
    { rotulo: '−W', valor: -PROC[k].w, texto: conSigno(-PROC[k].w), desde: corte ? 2 : 0 },
    { rotulo: 'ΔU', valor: PROC[k].q - PROC[k].w, texto: conSigno(PROC[k].q - PROC[k].w), color: 'd', desde: corte ? 1 : 0 },
  ] });
  const procesos = {
    id: 'cuatro-procesos',
    titulo: 'Qué fija cada proceso',
    temas: ['Procesos y diagrama P-V', 'Primera ley'],
    pieza: 'fis-cuentas',
    juega: {
      consigna: 'El mismo gas se expande o se calienta de cuatro maneras. Elige el proceso y mira qué barra queda en cero.',
      voz: 'En cada proceso hay algo que no cambia. Busca qué es.',
      controles: [{ id: 'p', etiqueta: 'Proceso', opciones: Object.keys(PROC).map(k => ({ valor: k, texto: PROC[k].texto })) }],
      dibujo: val => ({ datos: barrasProc(val.p), estado: {} }),
      lectura: val => [`${PROC[val.p].fijo} · `, dT, ` ${PROC[val.p].q - PROC[val.p].w > 0.5 ? 'positivo' : PROC[val.p].q - PROC[val.p].w < -0.5 ? 'negativo' : '= 0'}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Un gas ideal se expande lentamente a temperatura constante y hace 400 J de trabajo. ¿Cuánto calor recibe?',
      opciones: [
        { id: 'c', texto: '400 J', correcta: true },
        { id: 'cero', texto: '0 J: la temperatura no cambia', error: 'T11', siFuera: 'T fija sí da ΔU = 0. Para hacer 400 J de trabajo sin enfriarse, necesita recibir 400 J.' },
        { id: 'menos', texto: '−400 J', error: 'T-SIGNO', siFuera: 'El valor está bien. Pero el gas recibe ese calor: entra, positivo.' },
        { id: 'nose', texto: 'Falta saber la temperatura', error: 'T12', siFuera: 'Para Q = W basta saber que T no cambia, no cuánto vale.' },
      ],
      dibujo: { datos: { max: 600, igual: 2, barras: [{ rotulo: 'Q', valor: 400, texto: '?', desde: 9 }, { rotulo: '−W', valor: -400, texto: '−400 J' }, { rotulo: 'ΔU', valor: 0, texto: '?', color: 'd', desde: 9 }] }, estado: { corte: 0 } },
      revelar: { datos: { max: 600, igual: 2, barras: [{ rotulo: 'Q', valor: 400, texto: '+400 J' }, { rotulo: '−W', valor: -400, texto: '−400 J' }, { rotulo: 'ΔU', valor: 0, texto: '0 J', color: 'd' }] }, estado: {} },
      coincide: 'Coincide: con T fija, la energía interna no cambia, y todo el calor sale como trabajo.',
    },
    mira: {
      datos: barrasProc('isotermico', true),
      pasos: [
        { estado: { corte: 1 }, texto: 'Isotérmico: T no cambia, así que U tampoco.', ecuacion: [dT, ' = 0  →  ', dU, ' = 0'] },
        { estado: { corte: 2 }, texto: `El gas se expande y hace ${f(PROC.isotermico.w, 0)} J de trabajo.`, ecuacion: [`W = +${f(PROC.isotermico.w, 0)} J`] },
        { estado: { corte: 3 }, texto: 'Para que U no baje, entra el mismo calor.', ecuacion: ['Q = W = ', `${f(PROC.isotermico.q, 0)} J`] },
        { estado: { corte: 3, fantasma: { indice: 2, valor: -PROC.adiabatico.w, rotulo: 'adiabático: Q = 0 y ΔU = −W' } }, texto: 'Contraste: adiabático, Q = 0. El trabajo sale de U y el gas se enfría.', ecuacion: [dU, ' = −W < 0'] },
      ],
    },
    regla: {
      texto: 'Isotérmico: ΔU = 0, así que Q = W. Adiabático: Q = 0, así que ΔU = −W. Isocórico: W = 0, así que Q = ΔU. Isobárico: W = PΔV.',
      ecuacion: [dU, ' = Q − W   en los cuatro'],
      condicion: 'gas ideal y procesos lentos. «Isotérmico» habla de T; «adiabático» habla de calor: son condiciones distintas.',
    },
    ahoraTu: {
      pieza: 'fis-cuentas',
      generar(s) {
        const r = azar(s), k = ['isotermico', 'adiabatico', 'isocorico'][s % 3], x = r.de([150, 200, 250, 300, 350, 400, 450]);
        if (k === 'isotermico') return {
          pregunta: ['Un gas ideal se comprime a temperatura constante y recibe ', `${f(x)} J de trabajo. ¿Cuánto calor intercambia?`],
          opciones: opciones(-x, [
            { id: 'cero', valor: 0, error: 'T11', siFuera: 'ΔU = 0 sí. Pero el trabajo que entra tiene que salir como calor.' },
            { id: 'signo', valor: x, error: 'T-SIGNO', siFuera: 'El valor está bien; el calor sale del gas: negativo.' },
            { id: 'doble', valor: -2 * x, error: 'T9', siFuera: 'Esa cuenta cuenta dos veces el trabajo.' },
          ], n => conSigno(n)),
          solucion: { texto: 'T fija: ΔU = 0, así que Q = W, y W es negativo al comprimir.', ecuacion: [`Q = W = −${f(x)} J`] },
        };
        if (k === 'adiabatico') return {
          pregunta: `Un gas se expande sin intercambiar calor (adiabático) y hace ${f(x)} J de trabajo. ¿Cuánto cambia su energía interna?`,
          opciones: opciones(-x, [
            { id: 'cero', valor: 0, error: 'T4', siFuera: 'Sería cierto si la temperatura fuera fija. Sin calor, el trabajo sale de U.' },
            { id: 'signo', valor: x, error: 'T-SIGNO', siFuera: 'El valor está bien; U baja porque el gas gasta energía al empujar.' },
            { id: 'doble', valor: -2 * x, error: 'T9', siFuera: 'Esa cuenta resta dos veces el trabajo.' },
          ], n => conSigno(n)),
          solucion: { texto: 'Sin calor, todo el trabajo sale de la energía interna: se enfría.', ecuacion: [dU, ` = 0 − ${f(x)} = −${f(x)} J`] },
        };
        return {
          pregunta: `Un gas en un tanque rígido (isocórico) recibe ${f(x)} J de calor. ¿Cuánto trabajo hace?`,
          opciones: opciones(0, [
            { id: 'todo', valor: x, error: 'T5', siFuera: 'Sería cierto a temperatura fija. Sin cambio de volumen, no hay área: W = 0.' },
            { id: 'mitad', valor: x / 2, error: 'T6', siFuera: 'No hay reparto: el pistón no se mueve.' },
            { id: 'neg', valor: -x, error: 'T-SIGNO', siFuera: 'Nada empuja ni es empujado: V no cambia.' },
          ], n => conSigno(n)),
          solucion: { texto: 'Sin cambio de volumen no hay trabajo: todo el calor sube U.', ecuacion: ['W = 0  ·  ', dU, ` = Q = ${f(x)} J`] },
        };
      },
    },
  };

  // ---------- Idea 5: cp y cv ----------
  // Cambia: si el gas se calienta a volumen fijo o a presión fija · Permanece: n, ΔT y la barra ΔU ·
  // Progresa: la barra de trabajo, que solo aparece a presión fija · Se reserva: la diferencia cp − cv = R ·
  // Debe verse: para el mismo ΔT, a presión fija hace falta más calor.
  const R = 8.31;
  const calentar = (modo, n, dt, mono = true) => {
    const du = (mono ? 1.5 : 2.5) * n * R * dt, w = modo === 'P' ? n * R * dt : 0;
    return { du, w, q: du + w };
  };
  const barrasCal = (modo, n, dt, corte) => {
    const c = calentar(modo, n, dt);
    return { max: Math.max(700, c.q), igual: 2, barras: [
      { rotulo: 'Q', valor: c.q, texto: conSigno(c.q), desde: corte ? 3 : 0 },
      { rotulo: '−W', valor: -c.w, texto: conSigno(-c.w), desde: corte ? 2 : 0 },
      { rotulo: 'ΔU', valor: c.du, texto: conSigno(c.du), color: 'd', desde: corte ? 1 : 0 },
    ] };
  };
  const cpcv = {
    id: 'cp-cv',
    titulo: 'A presión fija cuesta más',
    temas: ['cp y cv'],
    pieza: 'fis-cuentas',
    juega: {
      consigna: 'Calientas helio con el pistón trabado: el volumen no cambia. Elige cuántos moles y cuánto sube la temperatura.',
      voz: 'Mira qué barra queda en cero y cuánto calor pide cada mol.',
      controles: [
        { id: 'n', etiqueta: 'n', min: 1, max: 3, paso: 1, inicio: 1, unidad: 'mol', decimales: 0 },
        { id: 'dt', etiqueta: 'ΔT', color: 'c-h', min: 10, max: 30, paso: 10, inicio: 20, unidad: 'K', decimales: 0 },
      ],
      dibujo: val => ({ datos: barrasCal('V', val.n, val.dt), estado: {} }),
      lectura: val => [`Q = ${f(calentar('V', val.n, val.dt).q, 0)} J · Q/(n`, dT, `) = ${f(calentar('V', val.n, val.dt).q / (val.n * val.dt), 2)} J/(mol·K)`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Calientas 1 mol de helio 20 K: una vez a volumen fijo y otra a presión fija. ¿En cuál necesitas más calor?',
      opciones: [
        { id: 'c', texto: 'A presión fija', correcta: true },
        { id: 'v', texto: 'A volumen fijo: el gas está encerrado', error: 'T-CVCP', siFuera: 'Encerrado, la presión sube, pero eso no gasta energía: el pistón no se mueve.' },
        { id: 'igual', texto: 'Igual: el ΔT es el mismo', error: 'T6', siFuera: 'ΔU sí es igual. Pero a presión fija el gas además empuja el pistón.' },
      ],
      dibujo: { datos: barrasCal('V', 1, 20), estado: {} },
      revelar: { datos: barrasCal('P', 1, 20), estado: { fantasma: { indice: 0, valor: calentar('V', 1, 20).q, rotulo: 'a volumen fijo' } } },
      coincide: `Coincide: ${f(calentar('P', 1, 20).q, 0)} J contra ${f(calentar('V', 1, 20).q, 0)} J. La diferencia es el trabajo.`,
    },
    mira: {
      datos: barrasCal('P', 1, 20, true),
      pasos: [
        { estado: { corte: 1 }, texto: 'U depende solo de T: sube lo mismo en los dos casos.', ecuacion: [dU, ` = ${f(1.5)} · 8,31 · 20 = ${f(calentar('P', 1, 20).du, 0)} J`] },
        { estado: { corte: 2 }, texto: 'A presión fija el gas se expande y empuja.', ecuacion: ['W = ', P, dV, ` = nR`, dT, ` = ${f(calentar('P', 1, 20).w, 0)} J`] },
        { estado: { corte: 3 }, texto: 'El calor cubre las dos cosas.', ecuacion: [`Q = ${f(calentar('P', 1, 20).du, 0)} + ${f(calentar('P', 1, 20).w, 0)} = ${f(calentar('P', 1, 20).q, 0)} J`] },
        { estado: { corte: 3, fantasma: { indice: 0, valor: calentar('V', 1, 20).q, rotulo: 'a volumen fijo' } }, texto: 'Por mol y por kelvin: la diferencia es justo R.', ecuacion: [{ sub: ['c', 'p'] }, ' − ', { sub: ['c', 'v'] }, ' = R = 8,31 J/(mol·K)'] },
      ],
    },
    regla: {
      texto: 'Para el mismo ΔT, a presión fija se necesita más calor que a volumen fijo, porque el gas además hace trabajo.',
      ecuacion: ['Q = n ', { sub: ['c', 'v'] }, dT, '  ·  Q = n ', { sub: ['c', 'p'] }, dT, '  ·  ', { sub: ['c', 'p'] }, ' − ', { sub: ['c', 'v'] }, ' = R'],
      condicion: 'gas ideal. Monoatómico (He, Ar): cv = 3R/2. Diatómico a temperatura ambiente (N₂, O₂): cv = 5R/2.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.de([1, 2, 3]), dt = r.de([10, 20, 30, 40]), mono = s % 4 < 2, modo = s % 2 ? 'P' : 'V';
        const c = calentar(modo, n, dt, mono), otro = calentar(modo === 'P' ? 'V' : 'P', n, dt, mono);
        const nom = mono ? 'helio (monoatómico)' : 'nitrógeno (diatómico)';
        return {
          pregunta: `Calientas ${f(n)} mol de ${nom} ${f(dt)} K a ${modo === 'P' ? 'presión fija' : 'volumen fijo'}. ¿Cuánto calor necesitas? Usa R = 8,31 J/(mol·K).`,
          opciones: opciones(c.q, [
            { id: 'otro', valor: otro.q, error: modo === 'P' ? 'T6' : 'T-CVCP', siFuera: modo === 'P' ? 'Ese sería el calor a volumen fijo: falta el trabajo.' : 'Ese sería a presión fija: aquí el pistón no se mueve.' },
            { id: 'mono', valor: calentar(modo, n, dt, !mono).q, error: 'T-CV', siFuera: mono ? 'Ese usa cv = 5R/2, de un gas diatómico.' : 'Ese usa cv = 3R/2, de un gas monoatómico.' },
            { id: 'r', valor: n * R * dt, error: 'T8', siFuera: 'Ese es solo nRΔT: el trabajo a presión fija.' },
          ], x => `${f(x, 0)} J`),
          solucion: { texto: `${modo === 'P' ? 'A presión fija' : 'A volumen fijo'}, c = ${modo === 'P' ? (mono ? '5R/2' : '7R/2') : (mono ? '3R/2' : '5R/2')}.`, ecuacion: [`Q = ${f(n)} · ${modo === 'P' ? (mono ? '2,5' : '3,5') : (mono ? '1,5' : '2,5')} · 8,31 · ${f(dt)} = ${f(c.q, 0)} J`] },
        };
      },
    },
  };

  // ---------- Idea 6: la máquina térmica y su techo ----------
  // Cambia: la temperatura del foco caliente y del frío · Permanece: el calor que entra (1000 J) ·
  // Progresa: el trabajo máximo y el calor que se echa al frío · Se reserva: el motor que promete más que Carnot ·
  // Debe verse: siempre sale calor al foco frío; el máximo lo fijan las dos temperaturas.
  const QC = 1000;
  const motor = (tc, tf, fantasma, oculto) => {
    const eta = 1 - tf / tc, w = QC * eta;
    return { datos: { max: 1000, igual: 0, barras: [
      { rotulo: 'Qcal', valor: QC, texto: `+${f(QC, 0)} J` },
      { rotulo: '−W', valor: -w, texto: conSigno(-w), desde: oculto ? 9 : 0 },
      { rotulo: '−Qfrío', valor: -(QC - w), texto: conSigno(-(QC - w)), desde: oculto ? 9 : 0 },
    ] }, estado: Object.assign(fantasma ? { fantasma } : {}, oculto ? { corte: 0 } : {}) };
  };
  const carnot = {
    id: 'maquina-termica',
    titulo: 'Ningún motor gana a Carnot',
    temas: ['Máquinas térmicas y ciclo de Carnot', 'Segunda ley'],
    pieza: 'fis-cuentas',
    juega: {
      consigna: 'Un motor ideal recibe 1000 J del foco caliente en cada ciclo. Elige las dos temperaturas y mira cuánto trabajo puede dar.',
      voz: 'Busca un par de temperaturas que dé más trabajo.',
      controles: [
        { id: 'tc', etiqueta: 'T caliente', color: 'c-h', min: 400, max: 800, paso: 100, inicio: 500, unidad: 'K', decimales: 0 },
        { id: 'tf', etiqueta: 'T fría', color: 'c-h', min: 200, max: 350, paso: 50, inicio: 300, unidad: 'K', decimales: 0 },
      ],
      dibujo: val => motor(val.tc, val.tf),
      lectura: val => [`η máx = ${f(100 * (1 - val.tf / val.tc), 1)} % · W = ${f(QC * (1 - val.tf / val.tc), 0)} J`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un inventor dice que su motor trabaja entre un foco a 400 K y otro a 300 K, y convierte en trabajo el 40 % del calor que recibe. ¿Es posible?',
      opciones: [
        { id: 'c', texto: 'No: el máximo es 25 %', correcta: true },
        { id: 'menos-100', texto: 'Sí: 40 % es menos que 100 %', error: 'T15', siFuera: 'Es cierto que nunca llega a 100 %. Pero el techo real lo fijan las dos temperaturas.' },
        { id: 'sin-roce', texto: 'Sí, si no tiene rozamiento', error: 'T14', siFuera: 'Quitar el rozamiento acerca al máximo de Carnot, pero no lo supera.' },
      ],
      dibujo: motor(400, 300, { indice: 1, valor: -400, rotulo: 'lo que promete: 400 J' }, true),
      revelar: motor(400, 300, { indice: 1, valor: -400, rotulo: 'lo que promete: 400 J' }),
      coincide: 'Coincide: entre 400 K y 300 K, ni un motor ideal pasa de 1 − 300/400 = 25 %.',
    },
    mira: {
      datos: motor(400, 300).datos,
      pasos: [
        { estado: {}, texto: 'Entran 1000 J del foco a 400 K.', ecuacion: [{ sub: ['Q', 'cal'] }, ' = 1000 J'] },
        { estado: {}, texto: 'El máximo que se convierte depende solo de las temperaturas.', ecuacion: [{ sub: ['η', 'máx'] }, ' = 1 − ', { frac: [{ sub: [T, 'f'] }, { sub: [T, 'c'] }] }, ' = 1 − 300/400 = 25 %'] },
        { estado: {}, texto: 'Como mucho 250 J salen como trabajo.', ecuacion: [{ sub: ['W', 'máx'] }, ' = 0,25 · 1000 = 250 J'] },
        { estado: { fantasma: { indice: 1, valor: -400, rotulo: 'lo que promete: 400 J' } }, texto: 'Los otros 750 J van al foco frío. No hay motor que los evite.', ecuacion: [{ sub: ['Q', 'frío'] }, ' = 1000 − 250 = 750 J'] },
      ],
    },
    regla: {
      texto: 'Un motor térmico siempre echa calor al foco frío. Su rendimiento no supera el de Carnot, que depende solo de las dos temperaturas.',
      ecuacion: ['η = ', { frac: ['W', { sub: ['Q', 'cal'] }] }, ' ≤ 1 − ', { frac: [{ sub: [T, 'f'] }, { sub: [T, 'c'] }] }],
      condicion: 'temperaturas en kelvin. El máximo lo alcanza solo una máquina reversible; las reales rinden menos.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tc = r.de([400, 500, 600, 800]), tf = r.de([300, 350]), q = r.de([500, 1000, 2000]);
        const eta = 1 - tf / tc, pideW = s % 2 === 1;
        if (pideW) return {
          pregunta: ['Un motor trabaja entre ', T, ` = ${f(tc)} K y ${f(tf)} K y recibe ${f(q)} J de calor por ciclo. ¿Cuál es el trabajo máximo que puede dar?`],
          opciones: opciones(q * eta, [
            { id: 'frio', valor: q * tf / tc, error: 'T-SUPERA', siFuera: 'Ese es el calor que va al foco frío.' },
            { id: 'todo', valor: q, error: 'T15', siFuera: 'Sería un rendimiento de 100 %: siempre sale calor al frío.' },
            { id: 'resta', valor: q * (tc - tf) / 1000, error: 'T-CELSIUS', siFuera: 'Esa cuenta no divide entre la temperatura caliente.' },
          ], x => `${f(x, 0)} J`),
          solucion: { texto: 'El máximo es el rendimiento de Carnot por el calor que entra.', ecuacion: [`W = (1 − ${f(tf)}/${f(tc)}) · ${f(q)} = ${f(q * eta, 0)} J`]},
        };
        const tcC = tc - 273, tfC = tf - 273;
        return {
          pregunta: `Un motor ideal trabaja entre ${f(tcC)} °C y ${f(tfC)} °C. ¿Cuál es su rendimiento máximo?`,
          opciones: opciones(100 * eta, [
            { id: 'celsius', valor: 100 * (1 - tfC / tcC), error: 'T-CELSIUS', siFuera: 'Esa cuenta usa °C. El cociente de Carnot pide kelvin.' },
            { id: 'cociente', valor: 100 * tf / tc, error: 'T-SUPERA', siFuera: 'Esa es la fracción que se echa al foco frío.' },
            { id: 'cien', valor: 100, error: 'T15', siFuera: 'Sería sin foco frío, y eso la segunda ley no lo permite.' },
          ], x => `${f(x, 1)} %`),
          solucion: { texto: `En kelvin: ${f(tc)} K y ${f(tf)} K.`, ecuacion: [`η = 1 − ${f(tf)}/${f(tc)} = ${f(100 * eta, 1)} %`] },
        };
      },
    },
  };

  return {
    unidad: 'fisica.termodinamica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/fis-cuentas.js'],
    historia: {
      texto: 'Las máquinas de vapor ya movían minas antes de que alguien supiera su límite. En 1824, Sadi Carnot se preguntó cuánto trabajo puede dar el calor que pasa de un cuerpo caliente a uno frío, con una máquina ideal. Décadas después, las mediciones de Joule y el trabajo de Clausius y Kelvin separaron dos ideas: la energía se conserva, y no todo el calor puede volverse trabajo.',
      pregunta: '¿Por qué un motor necesita también un lugar frío?',
      fuente: { titulo: 'APS News — Sadi Carnot and heat engines', url: 'https://www.aps.org/apsnews/2009/05/sadi-carnot-heat-engines' },
    },
    ideas: [gas, primera, area, procesos, cpcv, carnot],
  };
});
