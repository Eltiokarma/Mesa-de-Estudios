/*
 * Teoría de «Cinética química» (quimica.cinetica-quimica). Molde: docs/teoria.md y
 * contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 12) y docs/teoria/fuentes/historia-ecuaciones-2.pdf.
 * Errores: docs/investigacion/cinetica-ideas-erroneas.md (CI); los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: medir qué tan rápido va una reacción, explicar qué la acelera y sacar el orden de los datos.
 *   Persona y condiciones: postulante de 5.º, celular de gama baja a 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: calcula una rapidez media normalizada, lee Eₐ y ΔH de un perfil, predice el efecto de un
 *     factor, deduce el orden con dos experimentos y usa la vida media de primer orden.
 *   Orden de atención: 1.º la gráfica (curva, pendiente, cima o área) · 2.º la lectura en vivo · acción: probar casos.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿la rapidez es constante?, ¿el orden es el coeficiente?, ¿el catalizador da energía?
 *
 * Colores (regla 4): [A] concentración naranja c-o, t tiempo turquesa c-i, r rapidez rojo c-h, E energía (Eₐ) verde c-d.
 * ΔH, k y los órdenes van en tinta. Fuentes (no van al alumno): OpenStax Chemistry 2e §12.1–12.7.
 * La curva de energías (Maxwell–Boltzmann) es un modelo en unidades arbitrarias: f(E) = (E/θ²)·e^(−E/θ); la fracción
 * con E ≥ Eₐ es (1 + Eₐ/θ)·e^(−Eₐ/θ). Sirve para comparar, no para medir.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const A = { v: 'c-o', t: '[A]' }, t = { v: 'c-i', t: 't' }, r = { v: 'c-h', t: 'r' }, Ea = { sub: [{ v: 'c-d', t: 'E' }, 'a'] };
  const dA = ['Δ', A], dt = ['Δ', t];
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
  // Gesto directo: inversas de X e Y de la pieza ejes (la manija se ubica con la geometría de la propia figura).
  const G = datos => Kit.piezas.ejes.geometria(datos);
  const xEn = (datos, px) => { const g = G(datos); return datos.x.min + (px - g.X(datos.x.min)) * (datos.x.max - datos.x.min) / (g.X(datos.x.max) - g.X(datos.x.min)); };
  const yEn = (datos, py) => { const g = G(datos); return datos.y.min + (py - g.Y(datos.y.min)) * (datos.y.max - datos.y.min) / (g.Y(datos.y.max) - g.Y(datos.y.min)); };
  const muestra = (fn, a, b, k = 40) => Array.from({ length: k + 1 }, (_, i) => { const x = a + (b - a) * i / k; return [x, fn(x)]; });

  // ---------- Idea 1: la rapidez es una pendiente, y baja ----------
  // Cambia: el intervalo de 2 min que se mira · Permanece: la curva de [A] y sus ejes · Progresa: la cuerda se aplana
  // con el tiempo · Se reserva: normalizar con el coeficiente · Debe verse: la inclinación de la cuerda.
  const A0 = 0.8, K1 = 0.25, conc = x => A0 * Math.exp(-K1 * x);
  const ejesVel = (extra = {}) => Object.assign({
    x: { min: 0, max: 10, paso: 2, nombre: 't', unidad: 'min', decimales: 0, color: 'i' },
    y: { min: 0, max: 0.8, paso: 0.2, nombre: '[A]', unidad: 'mol/L', decimales: 1, color: 'o' },
    curvas: [{ puntos: muestra(conc, 0, 10), color: 'o' }],
    alt: 'Concentración del reactivo A contra el tiempo: baja rápido al inicio y cada vez más despacio.',
  }, extra);
  const cuerda = (a, b, extra = {}) => Object.assign({ puntos: [[a, conc(a)], [b, conc(b)]], color: 'h' }, extra);
  // Animación (decisión de Gerson, 15 nov: química se mueve sola). El intervalo avanza solo, 8 min en 5 s, una y otra vez:
  // la curva de [A] se dibuja hasta el final del intervalo (lo que falta va punteado) y la cuerda roja se va aplanando.
  const desdeA = val => {
    const b = Math.min(10, val.a + 2);
    return { datos: ejesVel({ curvas: [{ puntos: muestra(conc, 0, b), color: 'o' }, { puntos: muestra(conc, b, 10, 20), color: 'o', discontinua: true }, cuerda(val.a, b)],
      puntos: [{ x: val.a, y: conc(val.a), color: 'o' }, { x: b, y: conc(b), color: 'o' }] }), estado: {} };
  };
  // Los datos de «Ahora tú» y «Así se resuelve»: a A → B, [A] de c1 a c2 en T segundos (mismas cuentas, otras semillas).
  const casoRapidez = R => {
    const a = R.de([1, 2, 3]), c1 = R.ent(6, 10) / 10, c2 = R.ent(1, 5) / 10, T = R.ent(2, 5) * 10;
    return { a, c1, c2, T, v: (c1 - c2) / T / a };
  };
  const velocidad = {
    id: 'rapidez-pendiente',
    titulo: 'La rapidez es una pendiente',
    temas: ['Velocidad de reacción'],
    pieza: 'ejes',
    // Lee (fase 2): qué estudia la cinética y cómo se lee Δ. No dice cómo entra el coeficiente (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Rápido y lento', texto: 'Un fósforo arde en un segundo; la calamina de un techo se oxida en meses. Las dos son reacciones químicas, pero van a ritmos muy distintos. La cinética química estudia ese ritmo.' },
        { titulo: 'La letra delta', texto: ['Δ es la letra griega delta y se lee «cambio de». ', dA, ' es cuánto cambió la concentración de A, en mol/L; ', dt, ', cuánto tiempo pasó mientras tanto.'],
          ecuacion: [dA, ' = final − inicial'] },
        { titulo: 'Qué mirar', texto: 'En el juego, la curva naranja es [A] y la recta roja une dos instantes separados por 2 min. Mira si la recta queda igual de inclinada mientras la reacción avanza.' },
      ],
    },
    juega: {
      consigna: 'La reacción avanza sola (8 min en 5 s). La recta roja une [A] en los extremos de 2 min: mira cómo se aplana.',
      voz: 'Mira qué tan inclinada queda la recta roja.',
      controles: [{ id: 'a', etiqueta: 'Desde', color: 'c-i', min: 0, max: 8, paso: 1, inicio: 0, unidad: 'min', decimales: 0, auto: { velocidad: 1.6 } }],
      dibujo: val => desdeA(val),
      lectura: val => [`De ${f(val.a, 1)} a ${f(val.a + 2, 1)} min: `, r, ` media = ${f((conc(val.a) - conc(val.a + 2)) / 2, 3)}\u00a0mol/(L·min)`],
      minimo: 3,
      // Se agarra el primer punto de la cuerda y se corre por la curva: elige desde qué minuto se mide; la cuerda se aplana.
      arrastres: [{ id: 'desde', etiqueta: 'inicio del intervalo sobre la curva', color: 'c-i',
        donde: val => { const g = G(ejesVel()); return { x: g.X(val.a), y: g.Y(conc(val.a)) }; },
        mover: pt => ({ a: xEn(ejesVel(), pt.x) }) }],
    },
    predice: {
      pregunta: 'En 2 N₂O₅ → 4 NO₂ + O₂, el NO₂ aparece a 0,40 mol/(L·min). ¿A qué ritmo desaparece el N₂O₅?',
      voz: 'Compara los coeficientes de los dos.',
      opciones: [
        { id: 'c', texto: '0,20 mol/(L·min)', correcta: true },
        { id: 'igual', texto: '0,40 mol/(L·min)', error: 'QM-NORMA', siFuera: 'Sería igual si los coeficientes fueran iguales. Por cada 2 N₂O₅ salen 4 NO₂.' },
        { id: 'doble', texto: '0,80 mol/(L·min)', error: 'QM-NORMA', siFuera: 'Eso usa la proporción al revés: el NO₂ aparece el doble de rápido.' },
        { id: 'o2', texto: '0,10 mol/(L·min)', error: 'QM-NORMA', siFuera: '0,10 es el ritmo del O₂, que tiene coeficiente 1.' },
      ],
      dibujo: { datos: { x: { min: 0, max: 2, paso: 1, nombre: 't', unidad: 'min', decimales: 0, color: 'i' }, y: { min: 0, max: 1, paso: 0.2, nombre: 'c', unidad: 'mol/L', decimales: 1 }, curvas: [{ puntos: [[0, 0], [2, 0.8]], rotulo: 'NO₂' }], alt: 'El NO₂ sube de 0 a 0,8 mol/L en 2 minutos.' }, estado: {} },
      revelar: { datos: { x: { min: 0, max: 2, paso: 1, nombre: 't', unidad: 'min', decimales: 0, color: 'i' }, y: { min: 0, max: 1, paso: 0.2, nombre: 'c', unidad: 'mol/L', decimales: 1 }, curvas: [{ puntos: [[0, 0], [2, 0.8]], rotulo: 'NO₂' }, { puntos: [[0, 1], [2, 0.6]], color: 'o', rotulo: 'N₂O₅', en: [2, 0.6] }], alt: 'En 2 minutos el NO₂ sube 0,8 mol/L y el N₂O₅ baja 0,4 mol/L: la mitad.' }, estado: {} },
      coincide: 'Coincide: por cada 4 NO₂ que aparecen, se gastan 2 N₂O₅.',
      noCoincide: 'Se gastan 2 N₂O₅ por cada 4 NO₂: la mitad de rápido.',
    },
    mira: {
      datos: ejesVel({ curvas: [{ puntos: muestra(conc, 0, 10), color: 'o' }, cuerda(0, 2, { desde: 1 }), cuerda(6, 8, { desde: 2 })], puntos: [{ x: 0, y: conc(0), color: 'o', rotulo: `${f(conc(0), 2)}`, desde: 1 }, { x: 2, y: conc(2), color: 'o', rotulo: `${f(conc(2), 2)}`, desde: 1 }, { x: 6, y: conc(6), color: 'o', desde: 2 }, { x: 8, y: conc(8), color: 'o', desde: 2 }] }),
      voz: 'Comparemos dos intervalos del mismo largo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'De 0 a 2 min, [A] baja de 0,80 a 0,49 mol/L.', ecuacion: [r, ' = −', { frac: [dA, dt] }, ` = ${f((conc(0) - conc(2)) / 2, 3)} mol/(L·min)`] },
        { estado: { corte: 2 }, texto: 'De 6 a 8 min baja mucho menos: la recta es más plana.', ecuacion: [r, ` = ${f((conc(6) - conc(8)) / 2, 3)} mol/(L·min)`] },
        { estado: { corte: 2 }, texto: 'La rapidez no es constante: baja cuando queda menos reactivo.' },
        { estado: { corte: 2 }, texto: 'Para que sea una sola, cada ritmo se divide entre su coeficiente.', ecuacion: ['2 A → B:   ', r, ' = −', { frac: ['1', '2'] }, ' ', { frac: [dA, dt] }, ' = ', { frac: ['Δ[B]', dt] }] },
      ],
    },
    regla: {
      texto: 'La rapidez de reacción es cuánto cambia una concentración por unidad de tiempo, dividido entre su coeficiente. Suele ser mayor al inicio y va bajando.',
      ecuacion: [r, ' = −', { llave: [{ frac: ['1', 'a'] }], nota: 'coeficiente' }, ' ', { llave: [{ frac: [dA, dt] }], nota: 'pendiente' }],
      condicion: 'es una rapidez media en un intervalo; no es la cantidad de producto final ni dice si la reacción es espontánea.',
      voz: 'Una rapidez siempre lleva su intervalo.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú», con otras semillas.
    resuelve: {
      generar(s) {
        const { a, c1, c2, T, v } = casoRapidez(azar(s + 900)), cambio = c1 - c2, ritmoA = cambio / T;
        return {
          enunciado: [`En ${a === 1 ? '' : a + ' '}A → B, la concentración de A baja de ${f(c1, 1)} a ${f(c2, 1)} mol/L en ${f(T, 0)} s. ¿Cuál es la rapidez media de la reacción?`],
          pasos: [
            { tipo: 'pide', texto: ['Piden la rapidez media ', r, ' de la reacción: una sola, que vale para todas sus sustancias.'] },
            { tipo: 'datos', texto: [A, ` pasa de ${f(c1, 1)} a ${f(c2, 1)} mol/L en `, t, ` = ${f(T, 0)} s. El coeficiente de A es ${a}.`] },
            { tipo: 'regla', texto: 'Mido cuánto baja la concentración en cada segundo y divido ese ritmo entre el coeficiente de la sustancia.',
              ecuacion: [r, ' = −', { frac: ['1', 'a'] }, ' ', { frac: [dA, dt] }] },
            { tipo: 'cuentas', texto: 'Primero el cambio de concentración; después lo divido entre el tiempo y el coeficiente.',
              ecuacion: [dA, ` = ${f(c2, 1)} − ${f(c1, 1)} = −${f(cambio, 1)} mol/L   →   `, r, ` = ${f(cambio, 1)} / (${a} · ${f(T, 0)}) = ${f(v, 5)} mol/(L·s)`] },
            { tipo: 'sentido', texto: a === 1
              ? 'Mol/L entre segundos da mol/(L·s). Con coeficiente 1, la rapidez de la reacción es el mismo ritmo al que se gasta A.'
              : `Mol/L entre segundos da mol/(L·s). A se gasta a ${f(ritmoA, 5)} mol/(L·s): ${a} veces la rapidez de la reacción.` },
          ],
          respuesta: [r, ` = ${f(v, 5)} mol/(L·s)`],
        };
      },
    },
    ahoraTu: {
      voz: 'Divide el cambio entre el tiempo y entre el coeficiente.',
      generar(s) {
        const { a, c1, c2, T, v } = casoRapidez(azar(s));
        return {
          pregunta: [`En ${a === 1 ? '' : a + ' '}A → B, la concentración de A baja de ${f(c1, 1)} a ${f(c2, 1)} mol/L en ${f(T, 0)} s. ¿Cuál es la rapidez media de la reacción?`],
          opciones: opciones(v, [
            { id: 'sin-coef', valor: (c1 - c2) / T, error: 'QM-NORMA', siFuera: 'Ese es el ritmo de A. La rapidez de la reacción se divide entre su coeficiente.' },
            { id: 'final', valor: c2 / T, error: 'CI1', siFuera: 'Eso usa lo que queda. La rapidez usa el cambio.' },
            { id: 'inv', valor: T / (c1 - c2), error: 'QM-INV', siFuera: 'Eso divide el tiempo entre el cambio, al revés.' },
          ], x => `${f(x, 4)} mol/(L·s)`),
          solucion: { texto: 'Cambio de concentración entre el tiempo, y entre el coeficiente.', ecuacion: [r, ` = ${f(c1 - c2, 1)} / (${f(a, 0)} · ${f(T, 0)}) = ${f(v, 4)} mol/(L·s)`] },
        };
      },
    },
  };

  // ---------- Idea 2: el perfil de energía ----------
  // Cambia: Eₐ y ΔH · Permanece: el nivel de los reactivos (100 kJ/mol) y el eje del avance · Progresa: la cima sube o
  // baja sin mover los productos · Se reserva: la Eₐ de la reacción inversa · Debe verse: que Eₐ y ΔH se miden desde
  // lugares distintos.
  const R0 = 100;
  function perfil(ea, dh, extra = {}) {
    const cima = R0 + ea, P = R0 + dh;
    const y = x => x <= 2 ? R0 : x <= 5 ? R0 + (cima - R0) * (1 - Math.cos(Math.PI * (x - 2) / 3)) / 2 : x <= 8 ? P + (cima - P) * (1 + Math.cos(Math.PI * (x - 5) / 3)) / 2 : P;
    return Object.assign({
      x: { min: 0, max: 10, paso: 10, nombre: 'avance', decimales: 0 },
      y: { min: 0, max: 200, paso: 50, nombre: 'E', unidad: 'kJ/mol', decimales: 0, color: 'd' },
      curvas: [{ puntos: muestra(y, 0, 10, 50) }],
      puntos: [{ x: 0.4, y: R0 }, { x: 9.6, y: P }],
      alt: `Perfil de energía: reactivos a ${f(R0, 0)} kJ/mol, cima (complejo activado) a ${f(cima, 0)} y productos a ${f(P, 0)}. Eₐ = ${f(ea, 0)} kJ/mol; ΔH = ${f(dh, 0)} kJ/mol.`,
    }, extra);
  }
  const flechaEa = (ea, extra = {}) => Object.assign({ puntos: [[1.2, R0 + ea], [5, R0 + ea], null, [1.2, R0], [1.2, R0 + ea]], color: 'd', discontinua: true, rotulo: `Eₐ = ${f(ea, 0)}`, en: [1.2, R0 + ea / 2] }, extra);
  const flechaDH = (dh, extra = {}) => Object.assign({ puntos: [[5.5, R0], [9.6, R0], null, [9.6, R0], [9.6, R0 + dh]], discontinua: true, rotulo: `ΔH = ${f(dh, 0)}`, en: [9.6, R0 + dh] }, extra);
  // Los datos y la figura de «Ahora tú»; «Así se resuelve» los usa con otras semillas.
  const casoPerfil = R => ({ ea: 10 * R.ent(3, 9), dh: 10 * R.de([-6, -5, -4, -3, -2, 2, 3, 4, 5]) });
  const dibPerfil = (ea, dh, curvas) => ({ datos: perfil(ea, dh, Object.assign({ puntos: [{ x: 0.4, y: R0, rotulo: `${f(R0, 0)}` }, { x: 5, y: R0 + ea, color: 'd', rotulo: `${f(R0 + ea, 0)}` }, { x: 9.6, y: R0 + dh, rotulo: `${f(R0 + dh, 0)}` }] }, curvas ? { curvas: [perfil(ea, dh).curvas[0], ...curvas] } : {})), estado: {} });
  const perfilEnergia = {
    id: 'perfil-energia',
    titulo: 'La cima del perfil de energía',
    temas: ['Teoría de colisiones y complejo activado', 'Perfil de energía de una reacción'],
    pieza: 'ejes',
    // Lee (fase 2): el empujón inicial y las palabras exotérmica y endotérmica. No habla de la reacción inversa (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'El empujón inicial', texto: 'Un fósforo no se prende solo dentro de su caja: hay que frotarlo. Ese empujón es la energía que la reacción necesita para arrancar, aunque después libere mucho calor.' },
        { titulo: 'Libera o absorbe', texto: 'Si una reacción libera calor, como el gas que arde en la cocina, es exotérmica. Si lo absorbe, como la piedra caliza que se vuelve cal en un horno, es endotérmica.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el eje horizontal es el avance de la reacción y el vertical, la energía en kJ/mol. Mueve las dos perillas y mira qué parte del perfil cambia con cada una.' },
      ],
    },
    juega: {
      consigna: 'La cima sube y baja sola: es la energía de activación. Cambia ΔH y mira qué parte del perfil mueve cada uno.',
      voz: 'Una perilla mueve la cima; la otra, el final.',
      controles: [
        // Animación: Eₐ barre su rango sola (la cima sube y baja); los productos se quedan donde los pone ΔH.
        { id: 'ea', etiqueta: 'Eₐ', color: 'c-d', min: 20, max: 90, paso: 10, inicio: 50, unidad: 'kJ/mol', decimales: 0, auto: { velocidad: 20, modo: 'rebota' } },
        { id: 'dh', etiqueta: 'ΔH', min: -60, max: 60, paso: 20, inicio: -40, unidad: 'kJ/mol', decimales: 0 },
      ],
      dibujo: val => ({ datos: perfil(val.ea, val.dh, { curvas: [perfil(val.ea, val.dh).curvas[0], flechaEa(val.ea)] }), estado: {} }),
      lectura: val => [Ea, ` = ${f(val.ea, 0)} · ΔH = ${f(val.dh, 0)}\u00a0kJ/mol: ${val.dh < 0 ? 'exotérmica' : val.dh > 0 ? 'endotérmica' : 'sin calor neto'}`],
      minimo: 3,
      // Dos manijas: la cima se sube o se baja (Eₐ) y el nivel de los productos también (ΔH). Se ve que una no arrastra a la otra.
      arrastres: [
        { id: 'cima', etiqueta: 'cima del perfil (energía de activación)', color: 'c-d',
          donde: val => { const g = G(perfil(val.ea, val.dh)); return { x: g.X(5), y: g.Y(R0 + val.ea) }; },
          mover: (pt, val) => ({ ea: yEn(perfil(val.ea, val.dh), pt.y) - R0 }) },
        { id: 'productos', etiqueta: 'nivel de los productos (calor de reacción)',
          donde: val => { const g = G(perfil(val.ea, val.dh)); return { x: g.X(8.8), y: g.Y(R0 + val.dh) }; },
          mover: (pt, val) => ({ dh: yEn(perfil(val.ea, val.dh), pt.y) - R0 }) },
      ],
    },
    predice: {
      pregunta: ['Una reacción tiene ', Ea, ' = 50 kJ/mol y ΔH = −30 kJ/mol. ¿Cuánto vale la energía de activación de la reacción inversa?'],
      voz: 'Ubica la cima y mírala desde los productos.',
      opciones: [
        { id: 'c', texto: '80 kJ/mol', correcta: true },
        { id: 'igual', texto: '50 kJ/mol, la misma', error: 'QM-EA-INV', siFuera: 'Sería la misma si reactivos y productos estuvieran al mismo nivel. Aquí los productos están más abajo.' },
        { id: 'resta', texto: '20 kJ/mol', error: 'QM-EA-INV', siFuera: 'Eso resta. Desde los productos, que están más abajo, la cima queda más lejos.' },
        { id: 'dh', texto: '30 kJ/mol', error: 'CI5', siFuera: 'Ese es el calor de reacción. La barrera se mide hasta la cima.' },
      ],
      dibujo: { datos: perfil(50, -30, { curvas: [perfil(50, -30).curvas[0], flechaEa(50), flechaDH(-30)] }), estado: {} },
      revelar: { datos: perfil(50, -30, { curvas: [perfil(50, -30).curvas[0], flechaEa(50), flechaDH(-30), { puntos: [[7.4, 70], [7.4, 150], null, [5, 150], [7.4, 150]], color: 'h', discontinua: true, rotulo: 'inversa: 80', en: [7.4, 112] }] }), estado: {} },
      coincide: 'Coincide: desde los productos (70) hasta la cima (150) hay 80 kJ/mol.',
      noCoincide: 'Desde los productos, a 70, hasta la cima, a 150, hay 80 kJ/mol.',
    },
    mira: {
      datos: perfil(60, -40, {
        curvas: [perfil(60, -40).curvas[0], flechaEa(60, { desde: 3 }), flechaDH(-40, { desde: 4 })],
        puntos: [{ x: 0.4, y: R0, rotulo: 'reactivos', desde: 1, hasta: 2 }, { x: 0.4, y: R0, desde: 3 }, { x: 5, y: 160, color: 'd', rotulo: 'complejo activado', desde: 2 }, { x: 9.6, y: 60, rotulo: 'productos', desde: 1, hasta: 3 }, { x: 9.6, y: 60, desde: 4 }],
      }),
      voz: 'Leamos el perfil de izquierda a derecha.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El eje horizontal es el avance de la reacción, no el tiempo.' },
        { estado: { corte: 2 }, texto: 'Solo los choques con energía y orientación suficientes llegan a la cima.', ecuacion: ['cima: complejo activado, inestable'] },
        { estado: { corte: 3 }, texto: 'La energía de activación se mide desde los reactivos hasta la cima.', ecuacion: [Ea, ' = 160 − 100 = 60 kJ/mol'] },
        { estado: { corte: 4 }, texto: 'El calor de reacción va de reactivos a productos.', ecuacion: ['ΔH = 60 − 100 = −40 kJ/mol'] },
        { estado: { corte: 4 }, texto: 'La reacción inversa sube desde los productos.', ecuacion: [Ea, '(inversa) = 60 − (−40) = 100 kJ/mol'] },
      ],
    },
    regla: {
      texto: 'Para reaccionar, las partículas deben chocar con energía y orientación suficientes. La cima es el complejo activado: Eₐ se mide desde los reactivos y ΔH, de reactivos a productos.',
      ecuacion: [Ea, '(inversa) = ', { llave: [Ea], nota: 'de ida', color: 'c-d' }, ' − ΔH'],
      condicion: 'Eₐ y ΔH son independientes; el complejo activado no es un producto que se pueda guardar en un frasco.',
      voz: 'Dos medidas distintas: la barrera y el desnivel.',
    },
    resuelve: {
      pieza: 'ejes',
      generar(s) {
        // Se vuelve a sortear si la cima no queda por encima de los productos: un perfil así no tiene barrera de vuelta.
        const R = azar(s + 900);
        let C = casoPerfil(R);
        while (C.ea <= C.dh) C = casoPerfil(R);
        const { ea, dh } = C, cima = R0 + ea, P = R0 + dh, inv = ea - dh;
        const niveles = `Los reactivos están a ${f(R0, 0)} kJ/mol, la cima a ${f(cima, 0)} y los productos a ${f(P, 0)}.`;
        if (s % 2 === 0) return {
          enunciado: `${niveles} ¿Cuánto vale ΔH, el calor de reacción?`,
          dibujo: dibPerfil(ea, dh),
          pasos: [
            { tipo: 'pide', texto: 'Piden ΔH: el desnivel de energía entre los productos y los reactivos.' },
            { tipo: 'datos', texto: `Tres niveles: reactivos a ${f(R0, 0)}, cima a ${f(cima, 0)} y productos a ${f(P, 0)} kJ/mol.` },
            { tipo: 'regla', texto: 'ΔH compara solo los dos extremos: energía de los productos menos la de los reactivos. La cima no entra en esta cuenta.',
              ecuacion: ['ΔH = ', { sub: ['E', 'productos'] }, ' − ', { sub: ['E', 'reactivos'] }] },
            { tipo: 'cuentas', texto: 'Resto en ese orden: productos menos reactivos.', ecuacion: [`ΔH = ${f(P, 0)} − ${f(R0, 0)} = ${f(dh, 0)} kJ/mol`],
              dibujo: dibPerfil(ea, dh, [flechaDH(dh)]) },
            { tipo: 'sentido', texto: dh < 0
              ? 'Sale negativo porque los productos quedaron más abajo: la reacción libera calor, es exotérmica.'
              : 'Sale positivo porque los productos quedaron más arriba: la reacción absorbe calor, es endotérmica.' },
          ],
          respuesta: `ΔH = ${f(dh, 0)} kJ/mol`,
        };
        return {
          enunciado: [`${niveles} ¿Cuánto vale la `, Ea, ' de la reacción inversa?'],
          dibujo: dibPerfil(ea, dh),
          pasos: [
            { tipo: 'pide', texto: ['Piden la ', Ea, ' de la inversa: la barrera para volver de los productos a los reactivos.'] },
            { tipo: 'datos', texto: `Reactivos a ${f(R0, 0)}, cima a ${f(cima, 0)} y productos a ${f(P, 0)} kJ/mol. La cima es la misma de ida y de vuelta.` },
            { tipo: 'regla', texto: 'Cada barrera se mide desde donde se parte hasta la cima. La reacción inversa parte de los productos.' },
            { tipo: 'cuentas', texto: 'Resto la cima menos los productos.', ecuacion: [Ea, `(inversa) = ${f(cima, 0)} − ${f(P, 0)} = ${f(inv, 0)} kJ/mol`],
              dibujo: dibPerfil(ea, dh, [flechaEa(ea), { puntos: [[7.4, P], [7.4, cima], null, [5, cima], [7.4, cima]], color: 'h', discontinua: true, rotulo: `inversa: ${f(inv, 0)}`, en: [7.4, (P + cima) / 2] }]) },
            { tipo: 'sentido', texto: dh < 0
              ? `Los productos están más abajo que los reactivos, así que la vuelta es más larga que la ida: ${f(inv, 0)} contra ${f(ea, 0)} kJ/mol.`
              : `Los productos están más arriba que los reactivos, así que la vuelta es más corta que la ida: ${f(inv, 0)} contra ${f(ea, 0)} kJ/mol.` },
          ],
          respuesta: [Ea, `(inversa) = ${f(inv, 0)} kJ/mol`],
        };
      },
    },
    ahoraTu: {
      pieza: 'ejes',
      voz: 'Ubica tres niveles: reactivos, cima y productos.',
      generar(s) {
        const R = azar(s), { ea, dh } = casoPerfil(R);
        const pide = s % 2 ? 'inversa' : 'dh';
        const dib = dibPerfil(ea, dh);
        if (pide === 'dh') return {
          pregunta: 'Los reactivos están a 100 kJ/mol, la cima y los productos donde marca la figura. ¿Cuánto vale ΔH?',
          dibujo: dib,
          opciones: opciones(dh, [
            { id: 'ea', valor: ea, error: 'CI5', siFuera: 'Esa es la energía de activación. ΔH va de reactivos a productos.' },
            { id: 'signo', valor: -dh, error: 'QM-SIGNO-DH', siFuera: 'Eso cambia el signo: se resta productos menos reactivos.' },
            { id: 'cima', valor: ea - dh, error: 'QM-EA-INV', siFuera: 'Esa es la barrera vista desde los productos.' },
          ], x => `${f(x, 0)} kJ/mol`),
          solucion: { texto: 'Productos menos reactivos.', ecuacion: [`ΔH = ${f(R0 + dh, 0)} − 100 = ${f(dh, 0)} kJ/mol`] },
        };
        return {
          pregunta: ['Con el perfil de la figura (reactivos a 100 kJ/mol), ¿cuánto vale la ', Ea, ' de la reacción inversa?'],
          dibujo: dib,
          opciones: opciones(ea - dh, [
            { id: 'igual', valor: ea, error: 'QM-EA-INV', siFuera: 'Esa es la barrera desde los reactivos. La inversa empieza en los productos.' },
            { id: 'suma', valor: ea + dh, error: 'QM-EA-INV', siFuera: 'Eso suma ΔH con su signo al revés.' },
            { id: 'dh', valor: Math.abs(dh), error: 'CI5', siFuera: 'Eso es el desnivel entre reactivos y productos, no la barrera.' },
          ], x => `${f(x, 0)} kJ/mol`),
          solucion: { texto: 'De los productos hasta la cima.', ecuacion: [Ea, `(inversa) = ${f(R0 + ea, 0)} − ${f(R0 + dh, 0)} = ${f(ea - dh, 0)} kJ/mol`] },
        };
      },
    },
  };

  // ---------- Idea 3: qué acelera una reacción ----------
  // Cambia: la temperatura y el catalizador · Permanece: la forma del modelo de energías y sus ejes · Progresa: el área
  // a la derecha de Eₐ crece · Se reserva: moler un sólido (más choques, no choques más fuertes) · Debe verse: el área
  // sombreada, que es la fracción de choques que pueden reaccionar.
  const fracc = (ea, th) => (1 + ea / th) * Math.exp(-ea / th);
  const mb = th => x => (x / (th * th)) * Math.exp(-x / th);
  function energias(th, ea, extra = {}) {
    const curva = muestra(mb(th), 0, 10, 50);
    return Object.assign({
      x: { min: 0, max: 10, paso: 2, nombre: 'E', unidad: 'u. a.', decimales: 0, color: 'd' },
      y: { min: 0, max: 0.4, paso: 0.1, nombre: 'fracción', decimales: 1 },
      curvas: [{ puntos: curva }, { puntos: [[ea, 0], [ea, 0.3]], color: 'd', discontinua: true, rotulo: 'Eₐ', en: [ea, 0.3] }],
      areas: [{ puntos: curva.filter(p => p[0] >= ea - 1e-9), color: 'd', rotulo: `${f(100 * fracc(ea, th), 1)} %` }],
      alt: `Modelo de reparto de energías de las moléculas: ${f(100 * fracc(ea, th), 1)} % tiene energía mayor o igual que Eₐ (área sombreada).`,
    }, extra);
  }
  // Animación: la temperatura sube y baja sola entre 300 y 390 K. En el modelo, el ancho θ de la curva es proporcional a
  // T (θ = T / 300 K: 1 a 300 K y 1,3 a 390 K, los mismos dos casos de «Mira»). Modelo cualitativo, en u. a.
  const tht = T => T / 300, CAT = { no: 6, si: 4 };
  const ATOMOS = { Zn: { color: 'o', estilo: 'lleno', r: 6 }, H: { color: 'h', estilo: 'hueco', r: 4.5 } };
  const bloque = (polvo) => {
    const out = [];
    for (let i = 0; i < 16; i++) {
      const cx = i % 4, cy = Math.floor(i / 4);
      const borde = cx === 0 || cx === 3 || cy === 0 || cy === 3;
      out.push(polvo ? { e: 'Zn', n: 1, x: 0.1 + 0.8 * ((i * 0.618034) % 1), y: 0.08 + 0.84 * (i + 0.5) / 16, resalta: true }
        : { e: 'Zn', n: 1, x: 0.38 + cx * 0.08, y: 0.4 + cy * 0.16, resalta: borde });
    }
    return out;
  };
  const zinc = polvo => ({ datos: { atomos: ATOMOS, especies: {}, alto: 150, separacion: 18, cajas: [{ titulo: polvo ? 'Zinc en polvo' : 'Un trozo de zinc', forma: 'vaso', nivel: 0.95, particulas: [...bloque(polvo), { e: 'H', n: 8 }], cuenta: [{ e: 'Zn', texto: polvo ? '16 expuestos' : '12 expuestos' }] }] }, estado: {} });
  // Los casos de «Ahora tú» y «Así se resuelve»: [cambio, efecto, porqué, qué mueve, comprobación de la vida diaria].
  const CASOS_F = [
    ['Enfrías la mezcla de reacción', 'lenta', 'Menos moléculas superan Eₐ.', 'fraccion', 'Por eso los alimentos duran más dentro del refrigerador.'],
    ['Diluyes con agua el ácido que reacciona con un metal', 'lenta', 'Menos choques por segundo.', 'choques', 'Con el ácido diluido, las burbujas de hidrógeno salen más despacio.'],
    ['Agregas un catalizador adecuado', 'rapida', 'Otro camino con menor Eₐ.', 'fraccion', 'El catalizador no se gasta: al final se recupera igual que entró.'],
    ['Calientas la mezcla de reacción', 'rapida', 'Más moléculas superan Eₐ.', 'fraccion', 'Por eso la olla a presión, más caliente, cocina más rápido.'],
    ['Usas magnesio en polvo en vez de una cinta', 'rapida', 'Más superficie: más choques por segundo.', 'choques', 'Es la misma masa de magnesio, pero mucho más de ella queda al alcance del ácido.'],
    ['Agregas un gas que no reacciona, con el recipiente cerrado y del mismo volumen', 'igual', 'Las concentraciones de los reactivos no cambian.', 'ninguno', 'Sube la presión total, pero cada reactivo sigue con la misma cantidad en el mismo volumen.'],
    ['Aumentas la concentración de un reactivo en solución', 'rapida', 'Más choques por segundo.', 'choques', 'Con más partículas en el mismo volumen, se encuentran más a menudo.'],
  ];
  const NOM_F = { rapida: 'Va más rápido', lenta: 'Va más lento', igual: 'No cambia la rapidez' };
  const factores = {
    id: 'factores-velocidad',
    titulo: 'Qué acelera una reacción',
    temas: ['Factores que afectan la velocidad'],
    pieza: 'ejes',
    // Lee (fase 2): temperatura y catalizador en la vida diaria. No habla de moler ni de superficie (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'En la cocina', texto: 'La leche se corta antes si queda fuera del refrigerador, y la olla a presión cocina más rápido porque el agua hierve más caliente. En Juliaca, donde el agua hierve a unos 87 °C, eso se nota.' },
        { titulo: 'Catalizador', texto: 'Un catalizador acelera una reacción y al final sale igual que entró. En los autos, el convertidor catalítico cambia gases tóxicos del escape por otros menos dañinos.' },
        { titulo: 'Qué mirar', texto: 'En el juego, la curva reparte las moléculas según su energía y la línea marca Eₐ. Mira cómo cambia el área sombreada al calentar y al poner el catalizador.' },
      ],
    },
    juega: {
      consigna: 'La temperatura sube y baja sola; la curva reparte las moléculas por energía. Pon el catalizador: el área sombreada son las que pueden reaccionar.',
      voz: 'Mira el área a la derecha de la línea de Eₐ.',
      controles: [
        { id: 'T', etiqueta: 'T', min: 300, max: 390, paso: 30, inicio: 300, unidad: 'K', decimales: 0, auto: { velocidad: 30, modo: 'rebota' } },
        { id: 'cat', etiqueta: 'Catalizador', opciones: [{ valor: 'no', texto: 'Sin' }, { valor: 'si', texto: 'Con' }] },
      ],
      dibujo: val => ({ datos: energias(tht(val.T), CAT[val.cat]), estado: {} }),
      lectura: val => [`A ${f(val.T, 0)} K pueden reaccionar ${f(100 * fracc(CAT[val.cat], tht(val.T)), 1)} % de los choques`],
      minimo: 3,
      // La línea de Eₐ se agarra por arriba y se corre: hacia la izquierda es poner el catalizador (control de opciones:
      // cae en la Eₐ más cercana). El área sombreada responde.
      arrastres: [{ id: 'barrera', etiqueta: 'línea de Eₐ: a la izquierda, con catalizador', color: 'c-d',
        donde: val => { const g = G(energias(tht(val.T), CAT[val.cat])); return { x: g.X(CAT[val.cat]), y: g.Y(0.3) }; },
        mover: (pt, val) => { const e = xEn(energias(tht(val.T), CAT[val.cat]), pt.x); return { cat: Math.abs(e - CAT.si) < Math.abs(e - CAT.no) ? 'si' : 'no' }; } }],
    },
    predice: {
      pieza: 'quim-particulas',
      pregunta: 'Un trozo de zinc reacciona con ácido. Si lo cambias por la misma masa de zinc en polvo, va más rápido. ¿Por qué?',
      voz: 'Piensa en dónde puede chocar el ácido.',
      opciones: [
        { id: 'c', texto: 'Hay más superficie: más choques por segundo', correcta: true },
        { id: 'energia', texto: 'Cada choque tiene más energía', error: 'QM-MOLER', siFuera: 'Eso pasa al calentar. Moler no cambia la energía de cada choque.' },
        { id: 'ea', texto: 'Baja la energía de activación', error: 'CI4', siFuera: 'Eso hace un catalizador. Moler deja la misma barrera.' },
        { id: 'igual', texto: 'No debería cambiar: es la misma masa', error: 'QM-MASA', siFuera: 'La masa es la misma, sí. Pero el ácido solo toca los átomos de afuera.' },
      ],
      dibujo: zinc(false),
      revelar: zinc(true),
      coincide: 'Coincide: en polvo, todos los átomos quedan al alcance del ácido.',
      noCoincide: 'En polvo, más átomos quedan expuestos: hay más choques por segundo.',
    },
    mira: {
      datos: (() => {
        const base = muestra(mb(1), 0, 10, 50), alta = muestra(mb(1.3), 0, 10, 50);
        return {
          x: { min: 0, max: 10, paso: 2, nombre: 'E', unidad: 'u. a.', decimales: 0, color: 'd' },
          y: { min: 0, max: 0.4, paso: 0.1, nombre: 'fracción', decimales: 1 },
          curvas: [{ puntos: base, rotulo: 'T₁', en: [1, 0.37], hasta: 1 }, { puntos: alta, rotulo: 'T₂ > T₁', en: [1.3, 0.28], desde: 2 }, { puntos: [[6, 0], [6, 0.3]], color: 'd', discontinua: true, rotulo: 'Eₐ', en: [6, 0.3], hasta: 2 }, { puntos: [[4, 0], [4, 0.3]], color: 'd', discontinua: true, rotulo: 'Eₐ con catalizador', en: [4, 0.3], desde: 3 }],
          areas: [{ puntos: base.filter(p => p[0] >= 6), color: 'd', rotulo: `${f(100 * fracc(6, 1), 1)} %`, hasta: 1 }, { puntos: alta.filter(p => p[0] >= 6), color: 'd', rotulo: `${f(100 * fracc(6, 1.3), 1)} %`, desde: 2, hasta: 2 }, { puntos: alta.filter(p => p[0] >= 4), color: 'd', rotulo: `${f(100 * fracc(4, 1.3), 1)} %`, desde: 3 }],
          alt: 'Modelo de energías: al calentar, la curva se estira hacia la derecha y crece el área sobre Eₐ; con catalizador, Eₐ se corre a la izquierda y el área crece más.',
        };
      })(),
      voz: 'Separemos dos causas: más choques y choques que alcanzan.',
      pasos: [
        { estado: { corte: 1 }, texto: `A T₁, solo el ${f(100 * fracc(6, 1), 1)} % de los choques supera Eₐ.` },
        { estado: { corte: 2 }, texto: `Al calentar, más moléculas tienen energía alta: ${f(100 * fracc(6, 1.3), 1)} %.`, ecuacion: ['más temperatura → más choques eficaces'] },
        { estado: { corte: 3 }, texto: `Un catalizador abre otro camino con menor Eₐ: ${f(100 * fracc(4, 1.3), 1)} %.`, ecuacion: ['no cambia ΔH ni la constante de equilibrio'] },
        { estado: { corte: 3 }, texto: 'Más concentración, superficie o mezcla dan más choques por segundo.' },
      ],
    },
    regla: {
      texto: 'Una reacción va más rápido si hay más choques por segundo (concentración, superficie, mezcla) o si más choques superan Eₐ (temperatura, catalizador).',
      ecuacion: [r, ' ∝ ', { llave: ['Z'], nota: 'choques por segundo' }, ' · ', { llave: ['f'], nota: 'superan la barrera', color: 'c-d' }],
      condicion: 'moler o agitar ayuda cuando la reacción ocurre en una superficie o la frena la mezcla; el catalizador no cambia ΔH.',
      voz: 'Pregunta siempre cuál de las dos cosas cambió.',
    },
    resuelve: {
      generar(s) {
        const R = azar(s + 900), [caso, efecto, porque, mueve, vida] = CASOS_F[R.ent(0, CASOS_F.length - 1)];
        const aplica = {
          choques: `Este cambio mueve los choques por segundo, no su energía. ${porque}`,
          fraccion: `Este cambio mueve la fracción de choques que superan Eₐ. ${porque}`,
          ninguno: `${porque} Ni los choques por segundo ni la fracción que supera Eₐ cambian.`,
        }[mueve];
        return {
          enunciado: `${caso}. ¿La reacción va más rápido, más lento o igual?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden si la rapidez sube, baja o se queda igual después del cambio.' },
            { tipo: 'datos', texto: `El cambio: ${caso.charAt(0).toLowerCase() + caso.slice(1)}. Todo lo demás se mantiene.` },
            { tipo: 'regla', texto: 'La rapidez depende de dos cosas: cuántos choques hay por segundo y qué fracción de ellos supera la barrera Eₐ.',
              ecuacion: [r, ' ∝ ', { llave: ['Z'], nota: 'choques por segundo' }, ' · ', { llave: ['f'], nota: 'superan la barrera', color: 'c-d' }] },
            { tipo: 'aplica', texto: aplica },
            { tipo: 'sentido', texto: vida },
          ],
          respuesta: `${NOM_F[efecto]}.`,
        };
      },
    },
    ahoraTu: {
      voz: 'Decide si cambian los choques o la fracción que alcanza.',
      generar(s) {
        const CASOS = CASOS_F;
        const [caso, efecto, porque] = CASOS[s % CASOS.length];
        const nom = NOM_F;
        const si = { rapida: 'Sería más rápido si hubiera más choques o más choques con E ≥ Eₐ.', lenta: 'Sería más lento si bajaran los choques o los que superan Eₐ.', igual: 'No cambiaría si ni los choques ni la fracción que alcanza variaran.' };
        return {
          pregunta: `${caso}. ¿Qué pasa con la rapidez?`,
          opciones: Object.keys(nom).map(k => (k === efecto ? { id: 'c', texto: nom[k], correcta: true } : { id: k, texto: nom[k], error: k === 'igual' ? 'CI3' : 'QM-FACTOR', siFuera: si[k] })),
          solucion: { texto: porque },
        };
      },
    },
  };

  // ---------- Idea 4: el orden sale de los experimentos ----------
  // Cambia: el orden y la concentración · Permanece: k y los ejes r–[A] · Progresa: recta horizontal, recta, parábola
  // · Se reserva: el coeficiente de la ecuación, que no decide el orden · Debe verse: cuántas veces sube r al duplicar [A].
  const K = 0.5;
  const ejesOrden = (mm, extra = {}) => Object.assign({
    x: { min: 0, max: 1, paso: 0.2, nombre: '[A]', unidad: 'mol/L', decimales: 1, color: 'o' },
    y: { min: 0, max: 0.5, paso: 0.1, nombre: 'r', unidad: 'mol/(L·s)', decimales: 1, color: 'h' },
    curvas: [{ puntos: muestra(x => K * x ** mm, 0, 1), color: 'h' }],
    alt: `Rapidez contra concentración para orden ${mm}: r = ${f(K, 1)}·[A]${['⁰', '', '²'][mm]}.`,
  }, extra);
  const ORDEN = { 0: 'cero', 1: 'uno', 2: 'dos' };
  // Los datos de «Ahora tú» y «Así se resuelve»: con q impar se busca el orden; con q par, la nueva rapidez.
  const casoOrden = (R, q) => {
    const mm = q % 3, x = R.de([2, 3]), y = x ** mm;
    return q % 2 ? { busca: true, mm, x, y } : { busca: false, mm, x, y, r0: R.ent(2, 9) / 1000 };
  };
  const orden = {
    id: 'orden-reaccion',
    titulo: 'El orden sale de los datos',
    temas: ['Leyes de velocidad y orden de reacción'],
    pieza: 'ejes',
    // Lee (fase 2): la ley de velocidad y cómo se hacen los experimentos. No dice de dónde sale el orden (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Una fórmula para la rapidez', texto: ['La ley de velocidad dice cómo depende la rapidez de las concentraciones. Cada concentración va elevada a un número, el orden respecto a esa sustancia. ', 'k es la constante de velocidad.'],
          ecuacion: [r, ' = k', { sup: [A, 'm'] }] },
        { titulo: 'Un cambio a la vez', texto: 'En el laboratorio se repite la misma reacción varias veces, cambiando una sola concentración y dejando igual todo lo demás, también la temperatura. Así se ve el efecto de esa sustancia sola.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el segundo punto siempre tiene el doble de [A] que el primero. Elige cada orden y cuenta cuántas veces más arriba queda el segundo punto.' },
      ],
    },
    juega: {
      consigna: '[A] sube y baja sola; el segundo punto queda siempre en el doble. Elige el orden y compara las dos rapideces.',
      voz: 'Cuenta cuántas veces sube r cuando [A] se duplica.',
      controles: [
        { id: 'm', etiqueta: 'Orden', opciones: [0, 1, 2].map(k => ({ valor: k, texto: ORDEN[k] })) },
        // Animación: [A] barre su rango sola; la pareja de puntos corre por la curva y la razón de rapideces no cambia.
        { id: 'a', etiqueta: '[A]', color: 'c-o', min: 0.2, max: 0.5, paso: 0.1, inicio: 0.3, unidad: 'mol/L', decimales: 1, auto: { velocidad: 0.1, modo: 'rebota' } },
      ],
      dibujo: val => ({ datos: ejesOrden(val.m, { puntos: [{ x: val.a, y: K * val.a ** val.m, color: 'h', guias: true }, { x: 2 * val.a, y: K * (2 * val.a) ** val.m, color: 'h', guias: true }] }), estado: {} }),
      lectura: val => [A, ` ${f(val.a, 2)} → ${f(2 * val.a, 2)}: `, r, ` ${f(K * val.a ** val.m, 2)} → ${f(K * (2 * val.a) ** val.m, 2)}, por ${f(2 ** val.m, 0)}`],
      minimo: 3,
      // El primer punto se corre por la curva: el dedo elige [A]; el segundo, en 2[A], lo sigue y se compara su altura.
      arrastres: [{ id: 'concentracion', etiqueta: 'concentración sobre la curva', color: 'c-o',
        donde: val => { const g = G(ejesOrden(val.m)); return { x: g.X(val.a), y: g.Y(K * val.a ** val.m) }; },
        mover: (pt, val) => ({ a: xEn(ejesOrden(val.m), pt.x) }) }],
    },
    predice: {
      pregunta: ['Para 2 A → B se mide que, al duplicar ', A, ', la rapidez inicial se duplica. ¿Cuál es el orden respecto a A?'],
      voz: 'Usa el dato del experimento, no solo la ecuación.',
      opciones: [
        { id: 'c', texto: 'Uno', correcta: true },
        { id: 'coef', texto: 'Dos, porque su coeficiente es 2', error: 'CI9', siFuera: 'El coeficiente sería el orden en una etapa elemental. Aquí manda el experimento: 2¹ = 2.' },
        { id: 'cuatro', texto: 'Cuatro', error: 'QM-ORDEN', siFuera: 'El orden es el exponente, no el factor. Si r se cuadruplicara, sería 2.' },
        { id: 'cero', texto: 'Cero', error: 'QM-ORDEN', siFuera: 'Con orden cero, r no cambiaría al duplicar [A].' },
      ],
      dibujo: { datos: ejesOrden(1, { curvas: [], puntos: [{ x: 0.3, y: 0.15, color: 'h', rotulo: 'r', guias: true }, { x: 0.6, y: 0.3, color: 'h', rotulo: '2r', guias: true }] }), estado: {} },
      revelar: { datos: ejesOrden(1, { puntos: [{ x: 0.3, y: 0.15, color: 'h', rotulo: 'r', guias: true }, { x: 0.6, y: 0.3, color: 'h', rotulo: '2r', guias: true }] }), estado: {} },
      coincide: 'Coincide: 2ᵐ = 2 da m = 1, aunque el coeficiente sea 2.',
      noCoincide: 'Si 2ᵐ = 2, entonces m = 1. El coeficiente no lo decide.',
    },
    mira: {
      datos: ejesOrden(2, {
        curvas: [{ puntos: muestra(x => 0.2 * x * x, 0, 1), color: 'h', desde: 3 }],
        y: { min: 0, max: 0.2, paso: 0.05, nombre: 'r', unidad: 'mol/(L·s)', decimales: 2, color: 'h' },
        puntos: [{ x: 0.1, y: 0.002, color: 'h', desde: 1 }, { x: 0.2, y: 0.008, color: 'h', rotulo: '0,008', desde: 1 }, { x: 0.6, y: 0.072, color: 'h', rotulo: '0,072', desde: 4 }],
      }),
      voz: 'Dos experimentos bastan si solo cambia una concentración.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Con [A] de 0,1 a 0,2 mol/L, r pasa de 0,002 a 0,008.' },
        { estado: { corte: 2 }, texto: '[A] se multiplicó por 2 y r por 4.', ecuacion: [{ sup: ['2', 'm'] }, ' = 4  →  m = 2'] },
        { estado: { corte: 3 }, texto: 'Con m = 2 se despeja k de cualquier experimento.', ecuacion: ['k = ', { frac: [r, { sup: [A, '2'] }] }, ' = 0,002 / 0,01 = 0,2 L/(mol·s)'] },
        { estado: { corte: 4 }, texto: 'La ley predice otros casos: con 0,6 mol/L, r = 0,072.', ecuacion: [r, ' = 0,2 · 0,6² = 0,072 mol/(L·s)'] },
      ],
    },
    regla: {
      texto: 'La ley de velocidad se obtiene con experimentos: si [A] se multiplica por x y r por y, el orden m cumple xᵐ = y.',
      ecuacion: [r, ' = ', { llave: ['k'], nota: 'constante' }, { sup: [A, 'm'] }, { sup: ['[B]', 'n'] }, '   ·   ', { llave: ['m + n'], nota: 'orden total' }],
      condicion: 'los órdenes no se copian de los coeficientes de la ecuación global; las unidades de k dependen del orden total.',
      voz: 'El exponente lo dicen los datos.',
    },
    resuelve: {
      generar(s) {
        const q = s + 900, { busca, mm, x, y, r0 } = casoOrden(azar(q), q);
        const pot = { sup: [`${f(x, 0)}`, `${f(mm, 0)}`] };
        if (busca) {
          const sentido = ['Orden cero: la rapidez no cambió aunque hubiera más A. Esa concentración no la afecta.',
            'Orden uno: la rapidez creció lo mismo que [A].',
            `Orden dos: la rapidez creció más que [A], porque ${f(x, 0)} · ${f(x, 0)} = ${f(y, 0)}.`][mm];
          return {
            enunciado: ['Al multiplicar ', A, ` por ${f(x, 0)} (con lo demás fijo), la rapidez se multiplica por ${f(y, 0)}. ¿Cuál es el orden respecto a A?`],
            pasos: [
              { tipo: 'pide', texto: ['Piden el orden m: el exponente de ', A, ' en la ley de velocidad.'] },
              { tipo: 'datos', texto: [A, ` se multiplica por ${f(x, 0)} y `, r, ` por ${f(y, 0)}; lo demás no cambia.`] },
              { tipo: 'regla', texto: ['Si solo cambia ', A, ', la rapidez queda multiplicada por el factor de ', A, ' elevado al orden.'],
                ecuacion: [{ sup: [`${f(x, 0)}`, 'm'] }, ` = ${f(y, 0)}`] },
              { tipo: 'cuentas', texto: `Busco a qué número hay que elevar ${f(x, 0)} para que dé ${f(y, 0)}.`, ecuacion: [pot, ` = ${f(x ** mm, 0)}   →   m = ${f(mm, 0)}`] },
              { tipo: 'sentido', texto: sentido },
            ],
            respuesta: `Orden ${ORDEN[mm]} respecto a A.`,
          };
        }
        const nuevo = r0 * y;
        return {
          enunciado: ['Una reacción es de orden ', ORDEN[mm], ` respecto a A y va a ${f(r0, 3)} mol/(L·s). ¿A qué rapidez va si `, A, ` se multiplica por ${f(x, 0)}?`],
          pasos: [
            { tipo: 'pide', texto: ['Piden la nueva rapidez ', r, ' cuando ', A, ` crece ${f(x, 0)} veces.`] },
            { tipo: 'datos', texto: [`Orden ${ORDEN[mm]} respecto a A; `, r, ` = ${f(r0, 3)} mol/(L·s) al inicio; `, A, ` por ${f(x, 0)}.`] },
            { tipo: 'regla', texto: ['La rapidez se multiplica por el factor de ', A, ' elevado al orden. Lo demás de la ley no cambia.'],
              ecuacion: [r, ' = k', { sup: [A, 'm'] }] },
            { tipo: 'cuentas', texto: `Elevo ${f(x, 0)} al orden y multiplico la rapidez de antes.`, ecuacion: [r, ` = ${f(r0, 3)} · `, pot, ` = ${f(r0, 3)} · ${f(y, 0)} = ${f(nuevo, 3)} mol/(L·s)`] },
            { tipo: 'sentido', texto: mm === 0
              ? 'Con orden cero no cambia, aunque haya más A. Las unidades siguen en mol/(L·s).'
              : `Creció ${f(y, 0)} veces, ${mm === 1 ? 'lo mismo que [A]' : 'más que [A]'}. Las unidades siguen en mol/(L·s).` },
          ],
          respuesta: [r, ` = ${f(nuevo, 3)} mol/(L·s)`],
        };
      },
    },
    ahoraTu: {
      voz: 'Escribe la razón de rapideces como potencia.',
      generar(s) {
        const R = azar(s), C = casoOrden(R, s), mm = C.mm, x = C.x, y = C.y;
        if (C.busca) {
          return {
            pregunta: ['Al multiplicar ', A, ` por ${f(x, 0)} (con lo demás fijo), la rapidez se multiplica por ${f(y, 0)}. ¿Cuál es el orden respecto a A?`],
            opciones: [0, 1, 2, 3].filter(k => k !== mm).slice(0, 3).map(k => ({ id: `m${k}`, texto: `Orden ${ORDEN[k] || 'tres'}`, error: k === y ? 'QM-ORDEN' : 'CI9', siFuera: `Con orden ${k}, r se multiplicaría por ${f(x ** k, 0)}.` })).concat([{ id: 'c', texto: `Orden ${ORDEN[mm]}`, correcta: true }]),
            solucion: { texto: `${f(x, 0)} elevado al orden da ${f(y, 0)}.`, ecuacion: [{ sup: [`${f(x, 0)}`, 'm'] }, ` = ${f(y, 0)}  →  m = ${f(mm, 0)}`] },
          };
        }
        const r0 = C.r0;
        return {
          pregunta: ['Una reacción es de orden ', ORDEN[mm], ` respecto a A y va a ${f(r0, 3)} mol/(L·s). ¿A qué rapidez va si `, A, ` se multiplica por ${f(x, 0)}?`],
          opciones: opciones(r0 * y, [
            { id: 'lineal', valor: r0 * x, error: 'QM-ORDEN', siFuera: 'Eso supone orden uno: r crece igual que [A].' },
            { id: 'igual', valor: r0, error: 'QM-ORDEN', siFuera: 'Eso supone orden cero: r no depende de [A].' },
            { id: 'cuad', valor: r0 * x * x, error: 'QM-ORDEN', siFuera: 'Eso supone orden dos.' },
            { id: 'suma', valor: r0 + x, error: 'QM-ORDEN', siFuera: 'La concentración multiplica; no se suma.' },
          ], v => `${f(v, 3)} mol/(L·s)`),
          solucion: { texto: `r se multiplica por ${f(x, 0)} elevado al orden.`, ecuacion: [r, ` = ${f(r0, 3)} · ${f(x, 0)}${['⁰', '¹', '²'][mm]} = ${f(r0 * y, 3)} mol/(L·s)`] },
        };
      },
    },
  };

  // ---------- Idea 5: la vida media de primer orden ----------
  // Cambia: la concentración inicial y el orden · Permanece: k y los ejes · Progresa: mitad, mitad, mitad · Se reserva:
  // que en segundo orden cada mitad tarda más · Debe verse: marcas de vida media igual separadas (primer orden).
  const KP = 0.2, KS = 0.5;
  const ejesVida = (extra = {}) => Object.assign({
    x: { min: 0, max: 12, paso: 2, nombre: 't', unidad: 'min', decimales: 0, color: 'i' },
    y: { min: 0, max: 1, paso: 0.2, nombre: '[A]', unidad: 'mol/L', decimales: 1, color: 'o' },
  }, extra);
  function vida(a0, ord) {
    const cf = ord === 1 ? x => a0 * Math.exp(-KP * x) : x => a0 / (1 + KS * a0 * x);
    const marcas = [];
    let tt = 0, c0 = a0;
    for (let k = 0; k < 4; k++) {
      const th = ord === 1 ? Math.log(2) / KP : 1 / (KS * c0);
      if (tt + th > 12) break;
      tt += th; c0 /= 2; marcas.push([tt, c0, th]);
    }
    return { cf, marcas };
  }
  // Animación: la reacción corre sola, 12 min en 6 s. La curva se dibuja hasta t (lo que falta, punteado), el punto
  // naranja baja por ella y cada marca de «mitad» aparece recién cuando el punto la pasa.
  const vidaT = val => {
    const v = vida(val.a0, val.o), tt = Math.min(12, Math.max(0, val.t)), pasadas = v.marcas.filter(m => m[0] <= tt + 1e-9);
    return { v, tt, pasadas, datos: ejesVida({
      curvas: [{ puntos: muestra(v.cf, 0, tt), color: 'o' }, { puntos: muestra(v.cf, tt, 12, 20), color: 'o', discontinua: true }],
      puntos: [...pasadas.map(([x, y]) => ({ x, y, color: 'i', guias: true })), { x: tt, y: v.cf(tt), color: 'o', rotulo: f(v.cf(tt), 2) }],
      alt: `Concentración contra tiempo, ${val.o === 1 ? 'primer' : 'segundo'} orden, desde ${f(val.a0, 1)} mol/L: a los ${f(tt, 1)} min quedan ${f(v.cf(tt), 2)} mol/L y van ${pasadas.length} mitades.` }) };
  };
  // Los datos de «Ahora tú» y «Así se resuelve»: vida media th, nn vidas medias y masa inicial m0.
  const casoVida = R => { const th = R.ent(2, 12) * 5, nn = R.ent(1, 4), m0 = 2 ** nn * R.ent(3, 12); return { th, nn, m0, tiempo: nn * th }; };
  const vidaMedia = {
    id: 'vida-media',
    titulo: 'La mitad en tiempos iguales',
    temas: ['Vida media'],
    pieza: 'ejes',
    // Lee (fase 2): sustancias que se descomponen, primer orden y ln 2. No cuenta mitades (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Lo que se acaba', texto: 'El agua oxigenada del botiquín se descompone poco a poco en agua y oxígeno, aunque el frasco esté cerrado. Muchas sustancias se gastan así, con el tiempo. La pregunta es cuánto queda después de un rato.' },
        { titulo: 'Primer orden', texto: 'Una reacción es de primer orden cuando su rapidez es proporcional a la concentración de un solo reactivo: con el doble de reactivo, va el doble de rápido.' },
        { titulo: 'El número ln 2', texto: `En las fórmulas de esta idea aparece ln 2, el logaritmo natural de 2. Es un número fijo, cerca de ${f(Math.log(2), 3)}; la calculadora lo da con la tecla ln.`,
          ecuacion: [`ln 2 ≈ ${f(Math.log(2), 3)}`] },
        { titulo: 'Qué mirar', texto: 'En el juego, cada punto turquesa aparece cuando la concentración llega a la mitad de la anterior. Mide el tiempo entre puntos seguidos y después cambia el orden.' },
      ],
    },
    juega: {
      consigna: 'La reacción corre sola (12 min en 6 s). Cada punto turquesa marca una mitad: mide cuánto los separa y cambia el orden.',
      voz: 'Mide la distancia entre puntos seguidos.',
      controles: [
        { id: 'a0', etiqueta: '[A]₀', color: 'c-o', min: 0.4, max: 1, paso: 0.2, inicio: 0.8, unidad: 'mol/L', decimales: 1 },
        { id: 'o', etiqueta: 'Orden', opciones: [{ valor: 1, texto: 'Primero' }, { valor: 2, texto: 'Segundo' }] },
        { id: 't', etiqueta: 't', color: 'c-i', min: 0, max: 12, paso: 0.5, inicio: 1, unidad: 'min', decimales: 1, auto: { velocidad: 2 } },
      ],
      dibujo: val => ({ datos: vidaT(val).datos, estado: {} }),
      lectura: val => { const x = vidaT(val); return [t, ` = ${f(x.tt, 1)} min: `, A, ` = ${f(x.v.cf(x.tt), 2)} · mitades: ${x.pasadas.length ? x.pasadas.map(m => f(m[0], 1)).join('; ') : 'ninguna'}`]; },
      minimo: 3,
      // El inicio de la curva se sube o se baja: el dedo elige [A]₀ y las marcas de cada mitad se reacomodan (o no, en primer orden).
      arrastres: [{ id: 'inicio', etiqueta: 'concentración inicial', color: 'c-o',
        donde: val => { const g = G(ejesVida()); return { x: g.X(0), y: g.Y(val.a0) }; },
        mover: pt => ({ a0: yEn(ejesVida(), pt.y) }) },
      // El punto que avanza también se agarra y se corre por la curva: es elegir el instante.
      { id: 'instante', etiqueta: 'instante sobre la curva', color: 'c-i',
        donde: val => { const x = vidaT(val), g = G(x.datos); return { x: g.X(x.tt), y: g.Y(x.v.cf(x.tt)) }; },
        mover: pt => ({ t: xEn(ejesVida(), pt.x) }) }],
    },
    predice: {
      pregunta: 'Una sustancia se descompone con primer orden y su vida media es 10 min. Empiezas con 80 g. ¿Cuánto queda a los 30 min?',
      voz: 'Cuenta cuántas vidas medias caben.',
      opciones: [
        { id: 'c', texto: '10 g', correcta: true },
        { id: 'dos', texto: '20 g', error: 'QM-CONTEO', siFuera: '20 g quedarían a los 20 min. En 30 min caben tres vidas medias.' },
        { id: 'lineal', texto: '0 g: pierde 40 g cada 10 min', error: 'QM-LINEAL', siFuera: 'Eso sería si perdiera siempre la misma masa. Pierde la mitad de lo que queda.' },
        { id: 'tercio', texto: `${f(80 / 3, 1)} g`, error: 'QM-DIVIDE', siFuera: 'Eso divide entre 3. Cada vida media divide entre 2.' },
      ],
      dibujo: { datos: { x: { min: 0, max: 40, paso: 10, nombre: 't', unidad: 'min', decimales: 0, color: 'i' }, y: { min: 0, max: 80, paso: 20, nombre: 'm', unidad: 'g', decimales: 0 }, puntos: [{ x: 0, y: 80, color: 'o', rotulo: '80 g' }], alt: 'Masa inicial de 80 g a t = 0.' }, estado: {} },
      revelar: { datos: { x: { min: 0, max: 40, paso: 10, nombre: 't', unidad: 'min', decimales: 0, color: 'i' }, y: { min: 0, max: 80, paso: 20, nombre: 'm', unidad: 'g', decimales: 0 }, curvas: [{ puntos: muestra(x => 80 * 2 ** (-x / 10), 0, 40), color: 'o' }], puntos: [[0, 80], [10, 40], [20, 20], [30, 10]].map(([x, y]) => ({ x, y, color: 'o', rotulo: `${f(y, 0)} g`, guias: x === 30 })), alt: 'La masa baja a la mitad cada 10 minutos: 80, 40, 20 y 10 g a los 30 minutos.' }, estado: {} },
      coincide: 'Coincide: 80 → 40 → 20 → 10 g en tres vidas medias.',
      noCoincide: 'Cada 10 min queda la mitad: 80 → 40 → 20 → 10 g.',
    },
    mira: {
      datos: (() => {
        const v = vida(0.8, 1);
        return ejesVida({ curvas: [{ puntos: muestra(v.cf, 0, 12), color: 'o' }], puntos: [{ x: 0, y: 0.8, color: 'o', rotulo: '0,8', desde: 1 }, ...v.marcas.map(([x, y], i) => ({ x, y, color: 'i', rotulo: f(y, 2), guias: true, desde: Math.min(i + 2, 4) }))] });
      })(),
      voz: 'Midamos el tiempo entre cada mitad.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Primer orden con k = 0,2 por minuto; al inicio, 0,8 mol/L.' },
        { estado: { corte: 2 }, texto: 'Queda la mitad a los 3,5 min.', ecuacion: [{ sub: [t, '½'] }, ' = ', { frac: ['ln 2', 'k'] }, ` = ${f(Math.log(2) / KP, 2)} min`] },
        { estado: { corte: 3 }, texto: 'La siguiente mitad tarda lo mismo, aunque haya menos.', ecuacion: ['0,8 → 0,4 → 0,2'] },
        { estado: { corte: 4 }, texto: 'Después de n vidas medias queda una fracción ½ⁿ.', ecuacion: [A, ' = ', { sub: [A, '0'] }, ' · ', { sup: ['(½)', 'n'] }] },
      ],
    },
    regla: {
      texto: 'En una reacción de primer orden, la concentración baja a la mitad en tiempos iguales, sin importar cuánto había al inicio.',
      ecuacion: [{ llave: [{ sub: [t, '½'] }], nota: 'vida media' }, ' = ', { frac: ['ln 2', 'k'] }],
      condicion: 'solo para primer orden; en segundo orden cada vida media dura más que la anterior.',
      voz: 'Mitad, mitad, mitad: cuenta los pasos.',
    },
    resuelve: {
      generar(s) {
        const { th, nn, m0, tiempo } = casoVida(azar(s + 900)), tMedia = { sub: [t, '½'] };
        if (s % 2) {
          const cadena = Array.from({ length: nn + 1 }, (_, k) => f(m0 / 2 ** k, 2)).join(' → '), queda = m0 / 2 ** nn;
          return {
            enunciado: [`Primer orden, vida media de ${f(th, 0)} min. Empiezas con ${f(m0, 0)} g. ¿Cuánto queda a los `, t, ` = ${f(tiempo, 0)} min?`],
            pasos: [
              { tipo: 'pide', texto: `Piden la masa que todavía no se descompone a los ${f(tiempo, 0)} min.` },
              { tipo: 'datos', texto: [tMedia, ` = ${f(th, 0)} min, ${f(m0, 0)} g al inicio y `, t, ` = ${f(tiempo, 0)} min.`] },
              { tipo: 'regla', texto: 'En primer orden, cada vida media deja la mitad de lo que había, sin importar cuánto quede.' },
              { tipo: 'cuentas', texto: `Cuento vidas medias: ${f(tiempo, 0)} ÷ ${f(th, 0)} = ${f(tiempo / th, 0)}. Parto a la mitad ${nn === 1 ? "una vez" : f(nn, 0) + " veces"}.`, ecuacion: [`${cadena} g`] },
              { tipo: 'sentido', texto: `De vuelta: ${f(queda, 2)} · ${f(2 ** nn, 0)} = ${f(queda * 2 ** nn, 0)} g, lo del inicio. Nunca llega a cero de golpe.` },
            ],
            respuesta: `Quedan ${f(queda, 2)} g.`,
          };
        }
        const k = Math.log(2) / th;
        return {
          enunciado: `Una reacción de primer orden tiene vida media de ${f(th, 0)} min. ¿Cuánto vale su constante k?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden la constante de velocidad k de una reacción de primer orden.' },
            { tipo: 'datos', texto: [tMedia, ` = ${f(th, 0)} min.`] },
            { tipo: 'regla', texto: 'En primer orden, la vida media y k están amarradas por ln 2. Despejo k de esa fórmula.', ecuacion: [tMedia, ' = ', { frac: ['ln 2', 'k'] }, '   →   k = ', { frac: ['ln 2', tMedia] }] },
            { tipo: 'cuentas', texto: 'Divido ln 2 entre la vida media.', ecuacion: [`k = ${f(Math.log(2), 4)} / ${f(th, 0)} = ${f(k, 4)} min⁻¹`] },
            { tipo: 'sentido', texto: `Uno entre minutos da min⁻¹. De vuelta: ln 2 / ${f(k, 4)} ≈ ${f(Math.log(2) / k, 0)} min, la vida media del dato.` },
          ],
          respuesta: `k = ${f(k, 4)} min⁻¹`,
        };
      },
    },
    ahoraTu: {
      voz: 'Cuenta vidas medias antes de calcular.',
      generar(s) {
        const R = azar(s), { th, nn, m0, tiempo } = casoVida(R);
        if (s % 2) {
          return {
            pregunta: [`Primer orden, vida media de ${f(th, 0)} min. Empiezas con ${f(m0, 0)} g. ¿Cuánto queda a los `, t, ` = ${f(tiempo, 0)} min?`],
            opciones: opciones(m0 / 2 ** nn, [
              { id: 'menos', valor: m0 / 2 ** (nn - 1), error: 'QM-CONTEO', siFuera: 'Eso cuenta una vida media menos.' },
              { id: 'div', valor: m0 / (2 * nn), error: 'QM-DIVIDE', siFuera: 'Eso divide entre 2n; cada vida media vuelve a dividir entre 2.' },
              { id: 'lineal', valor: Math.max(0, m0 - nn * m0 / 2), error: 'QM-LINEAL', siFuera: 'Eso resta siempre la misma masa; se pierde la mitad de lo que queda.' },
            ], x => `${f(x, 2)} g`),
            solucion: { texto: `${f(tiempo, 0)} min son ${f(nn, 0)} vidas medias.`, ecuacion: [`${f(m0, 0)} · (½)${['', '¹', '²', '³', '⁴'][nn]} = ${f(m0 / 2 ** nn, 2)} g`] },
          };
        }
        const k = Math.log(2) / th;
        return {
          pregunta: [`Una reacción de primer orden tiene vida media de ${f(th, 0)} min. ¿Cuánto vale su constante k?`],
          opciones: opciones(k, [
            { id: 'inv', valor: 1 / th, error: 'QM-VIDA', siFuera: 'Eso olvida el ln 2.' },
            { id: 'mitad', valor: th / 2, error: 'QM-VIDA', siFuera: 'Eso divide el tiempo; k es ln 2 entre la vida media.' },
            { id: 'prod', valor: Math.log(2) * th, error: 'QM-INV', siFuera: 'Eso multiplica; se divide entre la vida media.' },
          ], x => `${f(x, 4)} min⁻¹`),
          solucion: { texto: 'Se despeja k de la vida media.', ecuacion: [`k = ln 2 / ${f(th, 0)} = ${f(k, 4)} min⁻¹`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Perfil: el camino con catalizador es otra cima (Eₐ a la mitad) sobre los mismos reactivos y productos.
  const labEaCat = val => Math.max(val.ea / 2, val.dh, 0);
  const eaVista = val => (val.cat === 'si' ? labEaCat(val) : val.ea);   // la barrera que muestra la lectura
  const labPerfil = val => {
    const base = perfil(val.ea, val.dh), curvas = [base.curvas[0], flechaEa(val.ea), flechaDH(val.dh)];
    if (val.cat === 'si') curvas.push(Object.assign({}, perfil(labEaCat(val), val.dh).curvas[0], { color: 'd', discontinua: true, rotulo: 'con catalizador', en: [5, R0 + labEaCat(val)] }));
    return Object.assign(base, { curvas,
      alt: `Perfil de energía con reactivos a 100, cima a ${f(R0 + val.ea, 0)} y productos a ${f(R0 + val.dh, 0)} kJ/mol${val.cat === 'si' ? `; con catalizador, la cima baja a ${f(R0 + labEaCat(val), 0)} y los productos no cambian` : ''}.` });
  };
  // Orden 0: [A] = [A]₀ − kt (hasta 0); orden 1: [A]₀·e^(−kt); orden 2: [A]₀ / (1 + k[A]₀t).
  const labConc = (val, x) => (val.o === 0 ? Math.max(0, val.a0 - val.k * x) : val.o === 1 ? val.a0 * Math.exp(-val.k * x) : val.a0 / (1 + val.k * val.a0 * x));
  // Animación: el instante avanza solo (12 min en 6 s); la curva se dibuja hasta él y lo que falta va punteado.
  const labCurva = val => ejesVida({
    curvas: [{ puntos: muestra(x => labConc(val, x), 0, val.t, 48), color: 'o' }, { puntos: muestra(x => labConc(val, x), val.t, 12, 24), color: 'o', discontinua: true }],
    puntos: [{ x: 0, y: val.a0, color: 'o' }, { x: val.t, y: labConc(val, val.t), color: 'i', rotulo: f(labConc(val, val.t), 2), guias: true }],
    alt: `Concentración contra tiempo, orden ${ORDEN[val.o]}, k = ${f(val.k, 2)}: de ${f(val.a0, 1)} mol/L a ${f(labConc(val, val.t), 2)} mol/L a los ${f(val.t, 1)} min.`,
  });

  return {
    unidad: 'quimica.cinetica-quimica',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/quim-particulas.js'],
    historia: {
      texto: 'Una reacción posible puede ser demasiado lenta para verla en una clase, o tan rápida que no se alcanza a medir. Ese problema separó el estudio de la rapidez del balance de materia. En 1889, Svante Arrhenius relacionó la constante de velocidad con la temperatura mediante una energía de activación. Esa relación ayuda a interpretar mediciones, pero no revela por sí sola el mecanismo.',
      pregunta: '¿Cómo medirías algo que cambia mientras lo mides?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §12.3 y §12.4', url: 'https://openstax.org/books/chemistry-2e/pages/12-3-rate-laws' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso. Los ejemplos se calculan aquí.
    glosario: [
      { termino: 'cinética química', def: 'Parte de la química que estudia qué tan rápido ocurren las reacciones y qué las acelera.',
        ver: ['rapidez de reacción'] },
      { termino: 'logaritmo natural', simbolo: 'ln', def: 'Logaritmo en base e, el número 2,718…; la calculadora lo da con la tecla ln.',
        ejemplo: `ln 2 ≈ ${f(Math.log(2), 3)}: aparece en la vida media de primer orden.`, ver: ['vida media'] },
      { termino: 'rapidez de reacción', simbolo: 'r', medida: 'mol/(L·s)', formas: ['rapidez de reacción', 'velocidad de reacción', 'rapidez', 'rapideces'],
        def: 'Cuánto cambia la concentración de una sustancia en cada unidad de tiempo, dividido entre su coeficiente.',
        ejemplo: `[A] baja de 0,80 a ${f(conc(2), 2)} mol/L en 2 min: r = ${f((conc(0) - conc(2)) / 2, 2)} mol/(L·min).`, ver: ['ley de velocidad'] },
      { termino: 'perfil de energía', def: 'Gráfica de la energía a lo largo del avance de la reacción, con una cima entre reactivos y productos.',
        ver: ['energía de activación', 'complejo activado'] },
      { termino: 'energía de activación', simbolo: 'Eₐ', medida: 'kJ/mol', def: 'Barrera que deben superar los reactivos al chocar para convertirse en productos.',
        ejemplo: `Reactivos a 100 y cima a 160 kJ/mol: Eₐ = ${f(160 - R0, 0)} kJ/mol.`, ver: ['complejo activado', 'catalizador'] },
      { termino: 'complejo activado', def: 'Arreglo inestable de átomos en la cima del perfil, a medio camino entre reactivos y productos.',
        ver: ['perfil de energía'] },
      { termino: 'calor de reacción', simbolo: 'ΔH', medida: 'kJ/mol', def: 'Energía de los productos menos la de los reactivos: negativo si la reacción libera calor.',
        ejemplo: `Reactivos a 100 y productos a 60 kJ/mol: ΔH = ${f(60 - R0, 0)} kJ/mol.`, ver: ['exotérmica', 'endotérmica'] },
      { termino: 'catalizador', def: 'Sustancia que abre un camino con menor barrera y acelera la reacción sin gastarse.',
        ejemplo: 'Con la barrera a la mitad, más choques la superan; ΔH no cambia.', ver: ['energía de activación'] },
      { termino: 'ley de velocidad', def: 'Fórmula que da la rapidez según las concentraciones, cada una elevada a su orden.',
        ejemplo: `r = k[A]²: con k = 0,2 y [A] = 0,6 mol/L, r = ${f(0.2 * 0.6 * 0.6, 3)} mol/(L·s).`, ver: ['orden de reacción', 'constante de velocidad'] },
      { termino: 'orden de reacción', formas: ['orden de reacción', 'orden', 'órdenes'],
        def: 'Exponente de una concentración en la ley de velocidad; sale de experimentos, no de los coeficientes.',
        ejemplo: `[A] se duplica y r se cuadruplica: 2ᵐ = 4, m = ${f(Math.log(4) / Math.log(2), 0)}.`, ver: ['ley de velocidad'] },
      { termino: 'constante de velocidad', simbolo: 'k', def: 'Número que multiplica a las concentraciones en la ley de velocidad; crece con la temperatura.',
        ver: ['ley de velocidad'] },
      { termino: 'vida media', simbolo: 't½', medida: 'min o s', def: 'Tiempo que tarda la concentración de un reactivo en bajar a la mitad.',
        ejemplo: `Primer orden con k = 0,2 por minuto: t½ = ln 2 / 0,2 = ${f(Math.log(2) / KP, 2)} min.`, ver: ['primer orden'] },
      { termino: 'primer orden', def: 'Caso en que la rapidez es proporcional a una sola concentración: esta baja a la mitad en tiempos iguales.',
        ver: ['vida media', 'orden de reacción'] },
      { termino: 'mecanismo', def: 'Serie de pasos sencillos por los que los reactivos llegan a ser productos.', ver: ['etapa elemental'] },
      { termino: 'etapa elemental', def: 'Un solo paso de un mecanismo, tal como chocan las partículas; ahí el orden coincide con el coeficiente.',
        ver: ['mecanismo', 'orden de reacción'] },
    ],
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La primera (animada desde la 0.2.0) junta orden 0, 1 y 2
    // con k y [A]₀ libres, y un instante que avanza solo y se arrastra por la curva. La segunda es el perfil con
    // catalizador: el camino nuevo, punteado, baja la cima sin mover reactivos ni productos (la idea 2 no tiene
    // catalizador). Las lecturas dicen entradas y resultado.
    laboratorio: [
      {
        id: 'curva-con-todo', titulo: 'La curva con todo', pieza: 'ejes',
        consigna: 'La reacción corre sola (12 min en 6 s). Elige el orden, k y [A]₀, y mira cuánto queda en cada instante.',
        controles: [
          { id: 'o', etiqueta: 'Orden', opciones: [1, 2, 0].map(k => ({ valor: k, texto: ORDEN[k] })) },
          { id: 'k', etiqueta: 'k', min: 0.05, max: 0.5, paso: 0.05, inicio: 0.2, decimales: 2 },
          { id: 'a0', etiqueta: '[A]₀', color: 'c-o', min: 0.2, max: 1, paso: 0.1, inicio: 0.8, unidad: 'mol/L', decimales: 1 },
          { id: 't', etiqueta: 't', color: 'c-i', min: 0, max: 12, paso: 0.5, inicio: 5, unidad: 'min', decimales: 1, auto: { velocidad: 2 } },
        ],
        dibujo: val => ({ datos: labCurva(val), estado: {} }),
        lectura: val => [`Orden ${ORDEN[val.o]} · k ${f(val.k, 2)} · ${f(val.t, 1)} min: de ${f(val.a0, 1)} a ${f(labConc(val, val.t), 2)}\u00a0mol/L`],
        arrastres: [{ id: 'instante', etiqueta: 'instante sobre la curva', color: 'c-i',
          donde: val => { const g = G(labCurva(val)); return { x: g.X(val.t), y: g.Y(labConc(val, val.t)) }; },
          mover: (pt, val) => ({ t: xEn(labCurva(val), pt.x) }) }],
        // Retos: los comprueba labConc, la misma función que traza la curva.
        invitaciones: [
          { texto: 'En primer orden, pon el instante justo en una vida media.',
            logrado: val => val.o === 1 && val.t > 0 && Math.abs(labConc(val, val.t) / val.a0 - 0.5) < 0.01,
            bien: 'Queda la mitad. Cambia [A]₀: ¿se corre ese instante?' },
          { texto: 'Con orden cero, busca el primer instante en que se acaba el reactivo.',
            logrado: val => val.o === 0 && val.t > 0 && labConc(val, val.t) < 1e-9 && labConc(val, val.t - 0.5) > 1e-9,
            bien: 'En orden cero baja lo mismo cada minuto, hasta acabarse.' },
          { texto: 'Haz que en el instante quede menos del 10 % del inicio.',
            logrado: val => labConc(val, val.t) < 0.1 * val.a0,
            bien: 'Casi no queda. ¿Qué orden tarda más en llegar ahí?' },
          { texto: 'Guarda dos casos de orden uno: mismo k e instante, distinta [A]₀.',
            logrado: (val, guardados) => val.o === 1 && guardados.some(g => g.o === 1 && g.k === val.k && g.t === val.t && g.a0 !== val.a0)
              && guardados.some(g => g.o === val.o && g.k === val.k && g.t === val.t && g.a0 === val.a0),
            bien: 'En los dos queda la misma fracción: el primer orden no mira cuánto había.' },
        ],
      },
      {
        id: 'perfil-catalizador', titulo: 'El perfil con catalizador', pieza: 'ejes',
        consigna: 'Arrastra la cima y los productos. Pon el catalizador y compara las dos cimas: ¿cambia ΔH?',
        controles: [
          { id: 'ea', etiqueta: 'Eₐ', color: 'c-d', min: 20, max: 100, paso: 10, inicio: 60, unidad: 'kJ/mol', decimales: 0 },
          { id: 'dh', etiqueta: 'ΔH', min: -80, max: 20, paso: 10, inicio: -40, unidad: 'kJ/mol', decimales: 0 },
          { id: 'cat', etiqueta: 'Catalizador', opciones: [{ valor: 'no', texto: 'Sin' }, { valor: 'si', texto: 'Con (Eₐ a la mitad)' }] },
        ],
        dibujo: val => ({ datos: labPerfil(val), estado: {} }),
        lectura: val => { const e = val.cat === 'si' ? labEaCat(val) : val.ea; return [val.cat === 'si' ? 'Con catalizador: ' : 'Sin catalizador: ', Ea, ` = ${f(e, 0)} · ΔH = ${f(val.dh, 0)} → inversa ${f(e - val.dh, 0)}\u00a0kJ/mol`]; },
        arrastres: [
          { id: 'cima', etiqueta: 'cima sin catalizador (energía de activación)', color: 'c-d',
            donde: val => { const g = G(labPerfil(val)); return { x: g.X(5), y: g.Y(R0 + val.ea) }; },
            mover: (pt, val) => ({ ea: yEn(labPerfil(val), pt.y) - R0 }) },
          { id: 'productos', etiqueta: 'nivel de los productos (calor de reacción)',
            donde: val => { const g = G(labPerfil(val)); return { x: g.X(8.8), y: g.Y(R0 + val.dh) }; },
            mover: (pt, val) => ({ dh: yEn(labPerfil(val), pt.y) - R0 }) },
        ],
        // Retos (docs/teoria.md §4d): los comprueban labEaCat y los niveles del perfil, lo mismo que se dibuja.
        invitaciones: [
          { texto: 'Haz una reacción endotérmica: los productos más arriba que los reactivos.',
            logrado: val => val.dh > 0,
            bien: 'Ahora absorbe calor. ¿La barrera de vuelta es mayor o menor que la de ida?' },
          { texto: 'Consigue que la reacción inversa tenga una barrera de 150 kJ/mol.',
            logrado: val => eaVista(val) - val.dh === 150,
            bien: 'La vuelta sube desde los productos: Eₐ más lo que bajaron.' },
          { texto: 'Con catalizador, deja la barrera en solo 20 kJ/mol.',
            logrado: val => val.cat === 'si' && labEaCat(val) === 20,
            bien: 'La cima bajó y los productos no se movieron. ¿Qué pasó con ΔH?' },
          { texto: 'Guarda el mismo perfil sin catalizador y con él.',
            logrado: (val, guardados) => guardados.some(g => g.cat !== val.cat && g.ea === val.ea && g.dh === val.dh)
              && guardados.some(g => g.cat === val.cat && g.ea === val.ea && g.dh === val.dh),
            bien: 'Dos cimas y un mismo ΔH: el catalizador abre otro camino, no cambia el balance.' },
        ],
      },
    ],
    ideas: [velocidad, perfilEnergia, factores, orden, vidaMedia],
  };
});
