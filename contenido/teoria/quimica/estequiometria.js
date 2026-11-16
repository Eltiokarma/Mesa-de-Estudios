/*
 * Teoría de «Estequiometría» (quimica.estequiometria). Molde: docs/teoria.md y contenido/teoria/quimica/materia-y-energia.js.
 * Compañera: Bruna (castora), voz resolutiva y cálida: ordena inventarios y deja que la predicción exista.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 8), historia-ecuaciones (Richter, 1792) y las precisiones
 * de Química del expediente. Errores: docs/investigacion/estequiometria-ideas-erroneas.md (ES) y gases-soluciones (SO15);
 * los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: pasar de lo que se pesa a lo que reacciona y a lo que se obtiene, con limitante, pureza y rendimiento.
 *   Persona y condiciones: postulante de 4.º–5.º, celular de 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: calcula la masa de un producto por la vía de los moles, elige el limitante por n/ν, aplica
 *     pureza al reactivo y rendimiento al producto, y halla una masa equivalente con el θ de la reacción.
 *   Orden de atención: 1.º la receta (coeficientes) · 2.º las partículas o la barra · acción: probar casos · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿limita el que pesa menos?, ¿los porcentajes se suman?, ¿el H₂SO₄ tiene una sola masa equivalente?
 *
 * Colores (regla 4): n moles turquesa c-i, m masa naranja c-o, porcentajes (pureza y rendimiento) rojo c-h, V volumen
 * verde c-d. Átomos: N naranja hueco, H turquesa hueco, O rojo lleno (solo en las ideas de partículas).
 * Masas molares redondeadas de academia (g/mol): H 1, C 12, N 14, O 16, Mg 24, Ca 40; NH₃ 17, H₂O 18, CaCO₃ 100, CaO 56.
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §4.3 y §4.4; IUPAC Gold Book (equivalent entity).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const n = { v: 'c-i', t: 'n' }, m = { v: 'c-o', t: 'm' }, P = { v: 'c-h', t: 'p' }, eta = { v: 'c-h', t: 'η' }, V = { v: 'c-d', t: 'V' };
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
  const g = x => `${f(x, 2)} g`, mol = x => `${f(x, 2)} mol`;

  // ---------- Partículas ----------
  const ATOMOS = { N: { color: 'o', estilo: 'punto', r: 6 }, H: { color: 'i', estilo: 'hueco', r: 4.5 }, O: { color: 'h', estilo: 'lleno', r: 6 } };
  const ESPECIES = {
    N2: [['N', -5, 0], ['N', 5, 0]], H2: [['H', -4, 0], ['H', 4, 0]], O2: [['O', -5, 0], ['O', 5, 0]],
    NH3: [['N', 0, -1], ['H', -7, 4], ['H', 7, 4], ['H', 0, 8]], H2O: [['O', 0, -1], ['H', -6, 4], ['H', 6, 4]],
  };
  const lupa = (cajas, extra = {}) => ({ datos: Object.assign({ atomos: ATOMOS, especies: ESPECIES, alto: 150, separacion: 24, flechas: true, cajas }, extra), estado: {} });

  // Reacciones para «Ahora tú»: coeficientes y masas molares (g/mol).
  const REACCIONES = [
    { ec: 'N₂ + 3 H₂ → 2 NH₃', A: ['N₂', 1, 28], B: ['H₂', 3, 2], C: ['NH₃', 2, 17] },
    { ec: '2 H₂ + O₂ → 2 H₂O', A: ['H₂', 2, 2], B: ['O₂', 1, 32], C: ['H₂O', 2, 18] },
    { ec: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O', A: ['CH₄', 1, 16], B: ['O₂', 2, 32], C: ['CO₂', 1, 44] },
    { ec: '2 Mg + O₂ → 2 MgO', A: ['Mg', 2, 24], B: ['O₂', 1, 32], C: ['MgO', 2, 40] },
    { ec: 'C + O₂ → CO₂', A: ['C', 1, 12], B: ['O₂', 1, 32], C: ['CO₂', 1, 44] },
  ];

  // ---------- Idea 1: de masa a masa se pasa por moles ----------
  // Cambia: cuántos moles de N₂ entran · Permanece: la receta N₂ + 3 H₂ → 2 NH₃ y las dos cajas · Progresa: de contar
  // partículas a pesar (m → n → n → m) · Se reserva: los gramos, que no siguen la razón 1 : 3 · Debe verse: que la receta
  // multiplica moles enteros, no gramos.
  const receta = k => lupa([
    { titulo: 'Reactivos', forma: 'caja', particulas: [{ e: 'N2', n: k }, { e: 'H2', n: 3 * k }], cuenta: [{ e: 'N2', texto: `${k}` }, { e: 'H2', texto: `${3 * k}` }] },
    { titulo: 'Productos', forma: 'caja', particulas: [{ e: 'NH3', n: 2 * k }], cuenta: [{ e: 'NH3', texto: `${2 * k}` }] },
  ]);
  const relaciones = {
    id: 'via-de-los-moles',
    titulo: 'De gramos a gramos, por moles',
    temas: ['Relaciones masa-masa, mol-mol y volumen-volumen'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Cada bolita es 1 mol de moléculas. Los moles de N₂ suben y bajan solos: mira cuánto H₂ pide la receta y cuánto NH₃ sale.',
      voz: 'La receta cuenta moléculas. Comprueba que se repite igual.',
      controles: [{ id: 'k', etiqueta: 'N₂', color: 'c-i', min: 1, max: 3, paso: 1, inicio: 1, unidad: 'mol', decimales: 0, auto: { velocidad: 0.6, modo: 'rebota' } }],
      dibujo: val => receta(Math.round(val.k)),
      lectura: val => { const k = Math.round(val.k); return [`${k} N₂ + ${3 * k} H₂ → ${2 * k} NH₃ (en mol)`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Para N₂ + 3 H₂ → 2 NH₃ tienes 28 g de N₂ (1 mol). ¿Qué ', m, ' de H₂ hace falta? (H₂: 2 g/mol)'],
      voz: 'Piensa qué cuenta la receta: gramos o moléculas.',
      opciones: [
        { id: 'c', texto: '6 g', correcta: true },
        { id: 'tres', texto: '3 g', error: 'ES19', siFuera: 'El 3 es la razón en moles, bien leído. En gramos, 3 mol de H₂ pesan 6 g.' },
        { id: 'triple', texto: '84 g', error: 'ES19', siFuera: 'Eso aplica el 3 a los gramos de N₂. La razón 1 : 3 es entre moles.' },
        { id: 'igual', texto: '28 g', error: 'ES4', siFuera: 'Masas iguales no son moles iguales: 28 g de H₂ serían 14 mol.' },
      ],
      dibujo: lupa([{ titulo: '28 g de N₂', forma: 'caja', particulas: [{ e: 'N2', n: 1 }] }, { titulo: 'H₂ que hace falta', forma: 'caja', particulas: [] }]),
      revelar: lupa([{ titulo: '28 g de N₂', forma: 'caja', particulas: [{ e: 'N2', n: 1 }], rotulo: '1 mol' }, { titulo: 'H₂ que hace falta', forma: 'caja', particulas: [{ e: 'H2', n: 3 }], rotulo: '3 mol = 6 g' }]),
      coincide: 'Coincide: 1 mol de N₂ pide 3 mol de H₂, que pesan 6 g.',
      noCoincide: '1 mol de N₂ pide 3 mol de H₂; esos 3 mol pesan 6 g.',
    },
    // Hallazgo 9 de la auditoría: son dos representaciones a propósito. La lupa cuenta moles como bolitas, pero no
    // pesa; la cadena ordena el camino masa → moles → receta → masa, que es lo que la lupa no puede mostrar.
    mira: {
      pieza: 'quim-cadena',
      datos: { columnas: [{ titulo: 'Masa → masa', color: 'o', nodos: [
        { texto: '28 g de N₂', color: 'o', desde: 1 },
        { texto: '28 ÷ 28 g/mol = 1 mol de N₂', color: 'i', desde: 2 },
        { texto: '1 mol · 3/1 = 3 mol de H₂', color: 'i', desde: 3 },
        { texto: '3 mol · 2 g/mol = 6 g de H₂', color: 'o', desde: 4 },
      ] }, { titulo: 'Volumen → volumen', color: 'd', nodos: [
        { texto: '1 L de N₂', color: 'd', desde: 5 },
        { texto: 'misma P y T: L como mol', desde: 5 },
        { texto: '3 L de H₂', color: 'd', desde: 5 },
        { texto: '2 L de NH₃', color: 'd', desde: 5 },
      ] }] },
      voz: 'Ordenemos el camino: primero a moles, después la receta.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se parte de lo que se pesa: 28 g de N₂.', ecuacion: [m, ' = 28 g'] },
        { estado: { corte: 2 }, texto: 'La masa molar pasa los gramos a moles.', ecuacion: [n, ' = ', { frac: [m, 'M'] }, ' = ', { frac: ['28', '28'] }, ' = 1 mol'] },
        { estado: { corte: 3 }, texto: 'La receta multiplica moles: 3 de H₂ por cada 1 de N₂.', ecuacion: [{ sub: [n, 'H₂'] }, ' = 1 · ', { frac: ['3', '1'] }, ' = 3 mol'] },
        { estado: { corte: 4 }, texto: 'Recién al final se vuelve a gramos.', ecuacion: [m, ' = 3 · 2 = 6 g'] },
        { estado: { corte: 5 }, texto: 'Entre gases a igual P y T, los litros siguen la razón molar.', ecuacion: ['1 L : 3 L : 2 L'] },
      ],
    },
    regla: {
      texto: 'Los coeficientes relacionan moles, no gramos. Para ir de una masa a otra: masa → moles → receta → moles → masa.',
      ecuacion: [{ sub: [n, 'B'] }, ' = ', { sub: [n, 'A'] }, ' · ', { llave: [{ frac: [{ sub: ['ν', 'B'] }, { sub: ['ν', 'A'] }] }], nota: 'coeficientes' }, '   ·   ', n, ' = ', { frac: [m, { llave: ['M'], nota: 'masa molar' }] }],
      condicion: 'entre gases, los volúmenes siguen la misma razón que los moles solo si se miden a igual presión y temperatura.',
      voz: 'Primero a moles. La receta no lee gramos.',
    },
    ahoraTu: {
      voz: 'Escribe el camino: masa, moles, receta, masa.',
      generar(s) {
        const r = azar(s), R = REACCIONES[s % REACCIONES.length];
        const [a, na, Ma] = R.A, [b, nb, Mb] = R.B;
        const nA = r.ent(1, 6), mA = nA * Ma;
        const nB = nA * nb / na, mB = nB * Mb;
        return {
          pregunta: [`En ${R.ec}, ¿qué masa de ${b} reacciona con `, m, ` = ${f(mA, 0)} g de ${a}? (${a}: ${Ma} g/mol; ${b}: ${Mb} g/mol)`],
          opciones: opciones(mB, [
            { id: 'gramos', valor: mA * nb / na, error: 'ES19', siFuera: 'Eso aplica la receta a los gramos. La razón de coeficientes es entre moles.' },
            { id: 'sin-coef', valor: nA * Mb, error: 'ES8', siFuera: 'Eso olvida los coeficientes: sería cierto si la receta fuera 1 a 1.' },
            { id: 'invertida', valor: nA * na / nb * Mb, error: 'ES8', siFuera: 'Eso invierte la razón de coeficientes. Va el de lo que buscas arriba.' },
            { id: 'moles', valor: nB, error: 'ES3', siFuera: 'Esos son los moles de la respuesta; falta pasarlos a gramos.' },
          ], g),
          solucion: { texto: `${f(nA, 2)} mol de ${a}; la receta da ${f(nB, 2)} mol de ${b}.`, ecuacion: [m, ` = ${f(nB, 2)} · ${Mb} = ${f(mB, 2)} g`] },
        };
      },
    },
  };

  // ---------- Idea 2: limita el menor n/ν ----------
  // Cambia: cuántas moléculas de H₂ y de O₂ hay · Permanece: la receta 2 H₂ + O₂ → 2 H₂O · Progresa: se forman paquetes
  // de la receta hasta que uno se acaba · Se reserva: el sobrante, marcado con aro · Debe verse: qué reactivo se acaba.
  function limitante(h, o) {
    const xi = Math.min(h / 2, o), agua = 2 * Math.floor(xi + 1e-9);
    const sobraH = h - agua, sobraO = o - agua / 2;
    return { agua, sobraH, sobraO, lim: h / 2 < o ? 'H₂' : o < h / 2 ? 'O₂' : 'ninguno' };
  }
  const limitanteFig = (h, o) => {
    const L = limitante(h, o);
    return lupa([
      { titulo: 'Antes', forma: 'caja', particulas: [{ e: 'H2', n: h }, { e: 'O2', n: o }], cuenta: [{ e: 'H2', texto: `${h}` }, { e: 'O2', texto: `${o}` }] },
      { titulo: 'Después', forma: 'caja', particulas: [{ e: 'H2O', n: L.agua }, { e: 'H2', n: L.sobraH, resalta: true }, { e: 'O2', n: L.sobraO, resalta: true }], cuenta: [{ e: 'H2O', texto: `${L.agua}` }] },
    ]);
  };
  // Animación: la reacción ocurre paquete por paquete (2 H₂ + O₂ → 2 H₂O, uno cada 0,9 s) hasta que algo se acaba;
  // a la derecha, la mezcla de ese momento. Al final queda la figura de siempre: el agua y lo que sobra, con su aro.
  const paquetes = (h, o) => Math.floor(Math.min(h / 2, o) + 1e-9);
  const hechos = (h, o, t) => Math.min(paquetes(h, o), Math.floor(t / 0.9));
  function limitanteT(h, o, t) {
    const P = paquetes(h, o), p = hechos(h, o, t);
    if (p === P) return limitanteFig(h, o);
    return lupa([
      { titulo: 'Antes', forma: 'caja', particulas: [{ e: 'H2', n: h }, { e: 'O2', n: o }], cuenta: [{ e: 'H2', texto: `${h}` }, { e: 'O2', texto: `${o}` }] },
      { titulo: 'Reaccionando', forma: 'caja', particulas: [{ e: 'H2O', n: 2 * p }, { e: 'H2', n: h - 2 * p }, { e: 'O2', n: o - p }], cuenta: [{ e: 'H2O', texto: `${2 * p}` }] },
    ]);
  }
  const limita = {
    id: 'reactivo-limitante',
    titulo: 'El que se acaba primero',
    temas: ['Reactivo limitante y en exceso'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Elige cuántas moléculas de H₂ y de O₂ hay. La receta 2 H₂ + O₂ → 2 H₂O ocurre sola, paquete por paquete. Lo sobrante lleva aro.',
      voz: 'Arma paquetes de la receta hasta que algo se acabe.',
      controles: [
        { id: 'h', etiqueta: 'H₂', min: 2, max: 10, paso: 1, inicio: 4, unidad: 'moléculas', decimales: 0 },
        { id: 'o', etiqueta: 'O₂', min: 1, max: 6, paso: 1, inicio: 4, unidad: 'moléculas', decimales: 0 },
        { id: 't', etiqueta: 't', min: 0, max: 7, paso: 0.1, inicio: 7, unidad: 's', decimales: 1, auto: { velocidad: 1 } },
      ],
      dibujo: val => limitanteT(val.h, val.o, val.t),
      lectura: val => {
        const L = limitante(val.h, val.o), P = paquetes(val.h, val.o), p = hechos(val.h, val.o, val.t);
        if (p < P) return [`Paquete ${p} de ${P}: ${2 * p} H₂O · quedan ${val.h - 2 * p} H₂ y ${val.o - p} O₂`];
        return [L.lim === 'ninguno' ? 'Se acaban los dos a la vez' : `Limita ${L.lim} · sobran ${L.lim === 'H₂' ? `${f(L.sobraO, 1)} O₂` : `${f(L.sobraH, 0)} H₂`}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['Para N₂ + 3 H₂ → 2 NH₃ hay 84 g de N₂ (3 mol) y 12 g de H₂ (6 mol). ¿Cuál reactivo limita?'],
      voz: 'Compara lo que tienes con lo que pide la receta.',
      opciones: [
        { id: 'c', texto: 'El H₂, aunque hay más moles de él', correcta: true },
        { id: 'menos-mol', texto: 'El N₂, porque hay menos moles', error: 'ES20', siFuera: 'Hay menos moles de N₂, cierto. Pero la receta pide 3 de H₂ por cada N₂.' },
        { id: 'coef', texto: 'El N₂, porque su coeficiente es 1', error: 'ES21', siFuera: 'El coeficiente solo dice la proporción. Hay que dividir los moles entre él.' },
        { id: 'ninguno', texto: 'Ninguno: se acaban los dos', error: 'ES22', siFuera: 'Se acabarían los dos si hubiera 9 mol de H₂ para 3 de N₂.' },
      ],
      dibujo: lupa([{ titulo: 'Antes', forma: 'caja', particulas: [{ e: 'N2', n: 3 }, { e: 'H2', n: 6 }] }, { titulo: 'Después', forma: 'caja', particulas: [] }]),
      revelar: lupa([{ titulo: 'Antes', forma: 'caja', particulas: [{ e: 'N2', n: 3 }, { e: 'H2', n: 6 }] }, { titulo: 'Después', forma: 'caja', particulas: [{ e: 'NH3', n: 4 }, { e: 'N2', n: 1, resalta: true }], rotulo: 'sobra 1 N₂' }]),
      coincide: 'Coincide: 6 mol de H₂ alcanzan para 2 mol de N₂; sobra 1.',
      noCoincide: 'Los 6 mol de H₂ solo alcanzan para 2 de los 3 mol de N₂.',
    },
    mira: {
      datos: lupa([
        { titulo: 'Antes', forma: 'caja', particulas: [{ e: 'N2', n: 3, desde: 1 }, { e: 'H2', n: 6, desde: 1 }] },
        { titulo: 'Después', forma: 'caja', particulas: [{ e: 'NH3', n: 4, desde: 3 }, { e: 'N2', n: 1, resalta: true, desde: 4 }], cuenta: [{ e: 'NH3', texto: '4', desde: 3 }, { e: 'N2', texto: '1', desde: 4 }] },
      ]).datos,
      voz: 'Dividamos cada cantidad entre su coeficiente.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Hay 3 mol de N₂ y 6 mol de H₂.', ecuacion: [{ sub: [n, 'N₂'] }, ' = 3', '   ·   ', { sub: [n, 'H₂'] }, ' = 6'] },
        { estado: { corte: 2 }, texto: 'Cada uno entre su coeficiente: ¿para cuántas recetas alcanza?', ecuacion: [{ frac: ['3', '1'] }, ' = 3', '   ·   ', { frac: ['6', '3'] }, ' = 2'] },
        { estado: { corte: 3 }, texto: 'El menor, 2, manda: se hacen 2 recetas y salen 4 mol de NH₃.', ecuacion: ['2 · 2 = 4 mol NH₃'] },
        { estado: { corte: 4 }, texto: 'El N₂ usado es 2 mol; sobra 1 mol. Está en exceso.', ecuacion: ['3 − 2 · 1 = 1 mol N₂'] },
      ],
    },
    regla: {
      texto: 'Limita el reactivo con el menor cociente entre sus moles y su coeficiente. Ese cociente fija cuánto producto sale; del otro reactivo sobra.',
      ecuacion: ['recetas = mín ', { par: [{ frac: [{ sub: [n, 'A'] }, { sub: ['ν', 'A'] }] }, '; ', { frac: [{ sub: [n, 'B'] }, { sub: ['ν', 'B'] }] }] }],
      condicion: 'se comparan moles divididos entre coeficientes, no masas ni moles sueltos; el exceso se calcula después de consumir en proporción.',
      voz: 'Divide antes de comparar. Así cada uno habla en recetas.',
    },
    ahoraTu: {
      voz: 'Calcula cuántas recetas permite cada reactivo.',
      generar(s) {
        const r = azar(s), R = REACCIONES[s % 3];
        const [a, na, Ma] = R.A, [b, nb, Mb] = R.B, [c, nc] = R.C;
        let nA = r.ent(1, 6), nB = r.ent(1, 9);
        if (nA / na === nB / nb) nB += 1;
        const rec = Math.min(nA / na, nB / nb), lim = nA / na < nB / nb ? a : b, prod = rec * nc;
        void Ma; void Mb;
        return {
          pregunta: [`En ${R.ec} hay ${nA} mol de ${a} y ${nB} mol de ${b}. ¿Cuántos moles de ${c} se forman como máximo?`],
          opciones: opciones(prod, [
            { id: 'otro', valor: Math.max(nA / na, nB / nb) * nc, error: 'ES20', siFuera: `Eso usa el reactivo que sobra. Limita ${lim}: se acaba primero.` },
            { id: 'menor', valor: Math.min(nA, nB) * nc, error: 'ES21', siFuera: 'Eso compara moles sin dividir entre los coeficientes.' },
            { id: 'suma', valor: nA + nB, error: 'ES14', siFuera: 'Los moles no se conservan al reaccionar; se conservan los átomos.' },
          ], mol),
          solucion: { texto: `Recetas: ${f(nA / na, 2)} con ${a} y ${f(nB / nb, 2)} con ${b}. Limita ${lim}.`, ecuacion: [`${f(rec, 2)} · ${nc} = ${f(prod, 2)} mol de ${c}`] },
        };
      },
    },
  };

  // ---------- Idea 3: pureza al reactivo, rendimiento al producto ----------
  // Cambia: la pureza de la muestra y el rendimiento · Permanece: CaCO₃ → CaO + CO₂ y el máximo teórico · Progresa: la
  // barra pierde primero la impureza y después lo que el proceso no entrega · Se reserva: que los porcentajes no se suman
  // · Debe verse: que el segundo recorte muerde lo que quedó.
  const barra = (total, pur, ren, extra = {}) => Object.assign({
    total, sufijo: ' g', decimales: 1, color: 'o',
    tramos: [{ tipo: 'descuento', pct: 100 - pur, color: 'h' }, { tipo: 'descuento', pct: 100 - ren, color: 'h' }].filter(t => t.pct > 0),
    marca: 'queda',
  }, extra);
  // Geometría de barra-porcentaje para el gesto (la pieza no exporta geometria, solo valores): la barra va de x = 10 a
  // 310 con el total a 310, su centro está en y = 60 y la fila del primer pedazo, en y = 103. Pedido al molde: exportarla.
  // Como x es fracción del total, la manija no depende de los gramos: la parte pura está en p/100 y el final en p·η.
  // pf: la pureza que se dibuja (en la idea, la que anima el control, llevada a su paso de 10 %).
  const arrastresBarra = (pf = val => val.p) => [
    { id: 'pureza', etiqueta: 'borde de la parte pura', color: 'c-h',
      donde: val => ({ x: 10 + 3 * pf(val), y: 103 }),
      mover: pt => ({ p: (pt.x - 10) / 3 }) },
    { id: 'rendimiento', etiqueta: 'final de la barra: lo que se obtiene', color: 'c-h',
      donde: val => ({ x: 10 + 300 * pf(val) * val.e / 1e4, y: 60 }),
      mover: (pt, val) => ({ e: 1e4 * (pt.x - 10) / (300 * Math.max(1, pf(val))) }) },
  ];
  // Animación (docs/3d.md §6): la pureza cambia sola y se lee en su paso de 10 %.
  const p10 = val => Math.round(val.p / 10) * 10;
  const pureza = {
    id: 'pureza-rendimiento',
    titulo: 'Pureza y rendimiento recortan',
    temas: ['Rendimiento de una reacción', 'Reactivos impuros'],
    pieza: 'barra-porcentaje',
    juega: {
      consigna: '100 g de caliza puros darían 56 g de CaO (CaCO₃ → CaO + CO₂). La pureza de la muestra cambia sola; elige el rendimiento del horno.',
      voz: 'Mira qué parte de la barra recorta cada porcentaje.',
      controles: [
        { id: 'p', etiqueta: 'Pureza', color: 'c-h', min: 50, max: 100, paso: 10, inicio: 80, unidad: '%', decimales: 0, auto: { velocidad: 12, modo: 'rebota' } },
        { id: 'e', etiqueta: 'Rendimiento', color: 'c-h', min: 50, max: 100, paso: 10, inicio: 100, unidad: '%', decimales: 0 },
      ],
      dibujo: val => ({ datos: barra(56, p10(val), val.e), estado: { corte: 2 } }),
      lectura: val => [`Pureza ${f(p10(val), 0)} %: se obtienen `, m, ` = ${f(56 * p10(val) / 100 * val.e / 100, 1)} g de CaO`],
      minimo: 3,
      // Dos manijas: el borde izquierdo del pedazo de impureza (fila 1) es la parte pura, y el extremo de la barra es lo
      // que el horno entrega. Mover la pureza corre también el final: el rendimiento muerde lo que quedó.
      arrastres: arrastresBarra(p10),
    },
    predice: {
      pregunta: ['200 g de caliza con 80 % de CaCO₃ se calientan; el rendimiento es 75 %. ¿Qué ', m, ' de CaO se obtiene? (CaCO₃ 100 g/mol, CaO 56 g/mol)'],
      voz: 'Decide a qué se aplica cada porcentaje.',
      opciones: [
        { id: 'c', texto: '67,2 g', correcta: true },
        { id: 'suma', texto: '61,6 g', error: 'QM-SUMA-PCT', siFuera: 'Eso resta 20 % y 25 % juntos. El rendimiento se aplica a lo que quedó.' },
        { id: 'sin-pureza', texto: '84 g', error: 'QM-IMPURO', siFuera: 'Eso trata la caliza como pura. Solo 160 g son CaCO₃.' },
        { id: 'sin-rend', texto: '89,6 g', error: 'QM-TEORICO', siFuera: 'Ese es el máximo teórico. El horno entrega el 75 % de eso.' },
      ],
      dibujo: { datos: barra(112, 80, 75), estado: { corte: 0 } },
      revelar: { datos: barra(112, 80, 75), estado: { corte: 2, final: true } },
      coincide: 'Coincide: 112 g · 0,80 · 0,75 = 67,2 g.',
      noCoincide: 'Primero la pureza (89,6 g teóricos) y después el 75 % de eso: 67,2 g.',
    },
    mira: {
      datos: barra(112, 80, 75),
      voz: 'Un porcentaje a la vez, sobre lo que queda.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Si los 200 g fueran CaCO₃ puro, saldrían 112 g de CaO.', ecuacion: ['200 g · ', { frac: ['56', '100'] }, ' = 112 g'] },
        { estado: { corte: 1 }, texto: 'Solo el 80 % es CaCO₃: el máximo teórico baja a 89,6 g.', ecuacion: ['112 · 0,80 = 89,6 g'] },
        { estado: { corte: 2 }, texto: 'El horno entrega el 75 % de ese máximo.', ecuacion: ['89,6 · 0,75 = 67,2 g'] },
        { estado: { corte: 2, final: true }, texto: 'Los dos recortes se multiplican; no se suman.', ecuacion: [m, ' = 112 · 0,80 · 0,75 = 67,2 g'] },
      ],
    },
    regla: {
      texto: 'La pureza recorta la masa que reacciona; el rendimiento recorta el producto teórico. Se aplican uno sobre el resultado del otro: se multiplican.',
      ecuacion: [{ sub: [m, 'real'] }, ' = ', { sub: [m, 'teórica'] }, ' · ', { llave: [P, ' · ', eta], nota: 'pureza y rendimiento', color: 'c-h' }, '   ·   ', eta, ' = ', { frac: [{ sub: [m, 'real'] }, { sub: [m, 'teórica'] }] }],
      condicion: 'la masa teórica sale de la parte pura del reactivo limitante; el rendimiento no cambia la ecuación balanceada.',
      voz: 'Cada porcentaje tiene su lugar. No los juntes.',
    },
    ahoraTu: {
      pieza: 'barra-porcentaje',
      voz: 'Primero la parte pura; después el rendimiento.',
      generar(s) {
        const r = azar(s), mm = 50 * r.ent(2, 8), pur = 5 * r.ent(12, 19), ren = 5 * r.ent(12, 19);
        const teo = mm * 0.56, pura = teo * pur / 100, real = pura * ren / 100;
        return {
          pregunta: [`Una muestra de ${mm} g de caliza tiene ${pur} % de CaCO₃ y el rendimiento es ${ren} %. ¿Qué `, m, ' de CaO se obtiene? (CaCO₃ → CaO + CO₂; 100 y 56 g/mol)'],
          dibujo: { datos: barra(teo, pur, ren), estado: { corte: 0 } },
          opciones: opciones(real, [
            { id: 'suma', valor: teo * (1 - (100 - pur) / 100 - (100 - ren) / 100), error: 'QM-SUMA-PCT', siFuera: 'Eso resta los dos porcentajes juntos. El segundo se aplica a lo que quedó.' },
            { id: 'sin-pureza', valor: teo * ren / 100, error: 'QM-IMPURO', siFuera: 'Eso trata la muestra como si fuera CaCO₃ puro.' },
            { id: 'sin-rend', valor: pura, error: 'QM-TEORICO', siFuera: 'Ese es el máximo teórico; falta aplicar el rendimiento.' },
          ], n2 => `${f(n2, 1)} g`),
          solucion: { texto: `Teórico puro: ${f(pura, 1)} g; el proceso entrega el ${ren} %.`, ecuacion: [m, ` = ${f(teo, 1)} · ${f(pur / 100, 2)} · ${f(ren / 100, 2)} = ${f(real, 1)} g`], dibujo: { datos: barra(teo, pur, ren), estado: { corte: 2, final: true } } },
        };
      },
    },
  };

  // ---------- Idea 4: la masa equivalente depende de la reacción ----------
  // Cambia: la sustancia y cuántos H⁺, OH⁻ o electrones intercambia · Permanece: las fichas de iones y la cuenta de
  // cargas · Progresa: de contar fichas a dividir la masa molar · Se reserva: el mismo H₂SO₄ con θ = 1 · Debe verse:
  // cuántas fichas intercambia la sustancia en esa reacción.
  const ACIDOS = {
    hcl: { texto: 'HCl', M: 36.5, th: 1, fichas: [{ t: 'H⁺', carga: 1, n: 1 }, { t: 'Cl⁻', carga: -1, n: 1 }], que: 'H⁺' },
    h2so4: { texto: 'H₂SO₄', M: 98, th: 2, fichas: [{ t: 'H⁺', carga: 1, n: 2 }, { t: 'SO₄²⁻', carga: -2, n: 1 }], que: 'H⁺' },
    h3po4: { texto: 'H₃PO₄', M: 98, th: 3, fichas: [{ t: 'H⁺', carga: 1, n: 3 }, { t: 'PO₄³⁻', carga: -3, n: 1 }], que: 'H⁺' },
    caoh2: { texto: 'Ca(OH)₂', M: 74, th: 2, fichas: [{ t: 'Ca²⁺', carga: 2, n: 1 }, { t: 'OH⁻', carga: -1, n: 2 }], que: 'OH⁻' },
  };
  const fichas = k => ({ datos: { fichas: ACIDOS[k].fichas, neta: 'carga total' }, estado: {} });
  // Animación: al neutralizarse, los H⁺ (u OH⁻) se van de a uno, cada segundo; lo que queda muestra su carga. Después
  // de 2 s sin ninguno, la sustancia vuelve entera y empieza otra vez.
  const salen = (k, t) => Math.max(0, Math.min(ACIDOS[k].th, Math.floor(t - 0.5)));
  const fichasT = (k, t) => { const A = ACIDOS[k], n = salen(k, t); return { datos: { fichas: A.fichas.map(x => (x.t === A.que ? Object.assign({}, x, { n: x.n - n }) : x)).filter(x => x.n > 0), neta: 'carga total' }, estado: {} }; };
  const equivalente = {
    id: 'masa-equivalente',
    titulo: 'Equivalente: lo que se intercambia',
    temas: ['Equivalente químico y masa equivalente'],
    pieza: 'quim-fichas',
    juega: {
      consigna: 'Elige un ácido o una base: al neutralizarse, sus H⁺ u OH⁻ se van solos, de a uno. Cuenta cuántos entrega: ese número es θ.',
      voz: 'Cuenta las fichas que se intercambian; las demás se quedan.',
      controles: [{ id: 'k', etiqueta: 'Sustancia', opciones: Object.keys(ACIDOS).map(k => ({ valor: k, texto: ACIDOS[k].texto })) },
        { id: 't', etiqueta: 't', min: 0, max: 6, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } }],
      dibujo: val => fichasT(val.k, val.t),
      lectura: val => {
        const A = ACIDOS[val.k], n = salen(val.k, val.t);
        return n < A.th ? [`${A.texto}: entregó ${n} ${A.que} de ${A.th}`] : [`θ = ${A.th} ${A.que}`, '   ·   ', `masa equivalente = ${f(A.M, 1)}/${A.th} = ${f(A.M / A.th, 2)} g`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['En H₂SO₄ + NaOH → NaHSO₄ + H₂O, el ácido cede un solo H⁺. ¿Cuál es la masa equivalente del H₂SO₄ en esta reacción? (98 g/mol)'],
      voz: 'Fíjate cuántos H⁺ se van en esta reacción.',
      opciones: [
        { id: 'c', texto: '98 g', correcta: true },
        { id: 'dos', texto: '49 g', error: 'QM-EQ-FIJO', siFuera: '49 g vale si cede sus dos H⁺. Aquí cede uno: θ = 1.' },
        { id: 'tres', texto: '32,7 g', error: 'QM-EQ-FIJO', siFuera: 'Eso divide entre 3. El H₂SO₄ tiene a lo más dos H⁺ que ceder.' },
        { id: 'doble', texto: '196 g', error: 'SO15', siFuera: 'Eso multiplica por θ. La masa equivalente es la masa molar dividida.' },
      ],
      dibujo: { datos: { fichas: [{ t: 'H⁺', carga: 1, n: 1 }, { t: 'H⁺', carga: 1, n: 1 }, { t: 'SO₄²⁻', carga: -2, n: 1 }], neta: 'carga total' }, estado: {} },
      revelar: { datos: { fichas: [{ t: 'H⁺ cedido', carga: 1, n: 1, color: 'h' }, { t: 'HSO₄⁻', carga: -1, n: 1 }], neta: 'carga total' }, estado: {} },
      coincide: 'Coincide: en esta reacción θ = 1 y la masa equivalente es 98 g.',
      noCoincide: 'Aquí sale un solo H⁺: θ = 1, así que la masa equivalente es 98/1 = 98 g.',
    },
    mira: {
      datos: { fichas: [{ t: 'H⁺', carga: 1, n: 2, color: 'h', desde: 1 }, { t: 'OH⁻', carga: -1, n: 2, color: 'i', desde: 3 }], neta: 'carga sin pareja' },
      voz: 'Cuenta lo que se intercambia en la reacción completa.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Con NaOH suficiente, el H₂SO₄ cede sus dos H⁺: θ = 2.', ecuacion: ['H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O'] },
        { estado: { corte: 2 }, texto: 'Un equivalente cede 1 mol de H⁺: aquí, medio mol de ácido.', ecuacion: [{ sub: ['M', 'eq'] }, ' = ', { frac: ['98', '2'] }, ' = 49 g'] },
        { estado: { corte: 3 }, texto: 'Cada H⁺ se encuentra con un OH⁻: un equivalente con uno.', ecuacion: ['#eq ácido = #eq base'] },
        { estado: { corte: 3 }, texto: 'Si solo cede un H⁺, θ = 1 y la masa equivalente es 98 g.' },
      ],
    },
    regla: {
      texto: 'La masa equivalente es la masa molar entre θ: los H⁺, OH⁻ o electrones que intercambia la sustancia en esa reacción. Reaccionan equivalente con equivalente.',
      ecuacion: [{ sub: ['M', 'eq'] }, ' = ', { frac: ['M', { llave: ['θ'], nota: 'lo intercambiado' }] }, '   ·   ', '#eq = ', { frac: [m, { sub: ['M', 'eq'] }] }],
      condicion: 'θ lo fija la reacción, no la fórmula sola: el H₂SO₄ tiene θ = 2 o θ = 1 según cuántos H⁺ cede.',
      voz: 'Antes de dividir, pregunta qué se intercambia aquí.',
    },
    ahoraTu: {
      voz: 'Cuenta θ en la reacción indicada.',
      generar(s) {
        const CASOS = [
          ['HCl, que cede su H⁺', 36.5, 1], ['H₂SO₄, que cede sus dos H⁺', 98, 2], ['H₃PO₄, que cede sus tres H⁺', 98, 3],
          ['H₃PO₄, que cede solo un H⁺', 98, 1], ['Ca(OH)₂, que entrega sus dos OH⁻', 74, 2], ['Al(OH)₃, que entrega sus tres OH⁻', 78, 3],
          ['NaOH, que entrega su OH⁻', 40, 1], ['KMnO₄, cuyo Mn gana 5 electrones (pasa a Mn²⁺)', 158, 5],
        ];
        const [txt, M, th] = CASOS[s % CASOS.length];
        return {
          pregunta: [`¿Cuál es la masa equivalente del ${txt}? (masa molar ${f(M, 1)} g/mol)`],
          opciones: opciones(M / th, [
            { id: 'molar', valor: M, error: 'QM-EQ-FIJO', siFuera: 'Esa es la masa molar: sería la equivalente si θ fuera 1.' },
            { id: 'por', valor: M * th, error: 'SO15', siFuera: 'Eso multiplica por θ. La masa equivalente es la masa molar dividida entre θ.' },
            { id: 'mas', valor: M / (th + 1), error: 'QM-EQ-FIJO', siFuera: `Eso divide entre ${th + 1}. Se intercambian ${th}.` },
          ], x => `${f(x, 2)} g`),
          solucion: { texto: `En esta reacción θ = ${th}.`, ecuacion: [{ sub: ['M', 'eq'] }, ` = ${f(M, 1)}/${th} = ${f(M / th, 2)} g`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: dos recetas con la misma lupa; cada bolita es 1 mol. Lo que sobra queda con aro.
  const RECETAS = {
    nh3: { ec: 'N₂ + 3 H₂ → 2 NH₃', a: ['N2', 'N₂', 1], b: ['H2', 'H₂', 3], c: ['NH3', 'NH₃', 2] },
    h2o: { ec: '2 H₂ + O₂ → 2 H₂O', a: ['H2', 'H₂', 2], b: ['O2', 'O₂', 1], c: ['H2O', 'H₂O', 2] },
  };
  const libre = v => {
    const R = RECETAS[v.r], [ea, , ca] = R.a, [eb, , cb] = R.b, [ec, , cc] = R.c;
    const rec = Math.floor(Math.min(v.x / ca, v.y / cb)), sa = v.x - rec * ca, sb = v.y - rec * cb;
    return { rec, sa, sb, dib: lupa([
      { titulo: 'Antes', forma: 'caja', particulas: [{ e: ea, n: v.x }, { e: eb, n: v.y }], cuenta: [{ e: ea, texto: `${v.x}` }, { e: eb, texto: `${v.y}` }] },
      { titulo: 'Después', forma: 'caja', particulas: [{ e: ec, n: rec * cc }, { e: ea, n: sa, resalta: true }, { e: eb, n: sb, resalta: true }], cuenta: [{ e: ec, texto: `${rec * cc}` }] },
    ], { separacion: 20, alt: `${R.ec}: con ${v.x} y ${v.y} mol salen ${rec * cc} mol de producto; sobran ${sa} y ${sb} mol.` }) };
  };
  // Mesa 2: la caliza entera, con su masa, pureza y rendimiento en rangos amplios. Se cuenta en g de CaO.
  const caliza = v => ({ datos: barra(v.mm * 0.56, v.p, v.e), estado: { corte: 2 } });
  // Para los retos: los gramos de CaO salen de la misma pieza que dibuja la barra (último valor tras los recortes).
  const BP = () => Kit.piezas['barra-porcentaje'];
  const cao = v => { const x = BP().valores(caliza(v).datos); return x[x.length - 1]; };
  // La caliza más liviana de la mesa que llega a 100 g de CaO, y el mayor producto sin sobrante (se buscan una vez).
  let liviana_ = null, techo_ = null;
  const liviana = () => {
    if (liviana_ === null) { liviana_ = Infinity; for (let mm = 50; mm <= 400; mm += 50) if (cao({ mm, p: 100, e: 100 }) >= 100 - 1e-9) liviana_ = Math.min(liviana_, mm); }
    return liviana_;
  };
  const techo = () => {
    if (techo_ === null) { techo_ = 0; for (const r of Object.keys(RECETAS)) for (let x = 0; x <= 8; x++) for (let y = 0; y <= 12; y++) { const L = libre({ r, x, y }); if (!L.sa && !L.sb) techo_ = Math.max(techo_, L.rec * RECETAS[r].c[2]); } }
    return techo_;
  };

  return {
    unidad: 'quimica.estequiometria',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/quim-cadena.js', '/nucleo/kit/piezas/barra-porcentaje.js', '/nucleo/kit/piezas/quim-fichas.js'],
    historia: {
      texto: 'En 1792, Jeremias Richter usó la palabra «estequiometría» para hablar de cuánto de una sustancia transforma a otra; estudiaba, sobre todo, neutralizaciones. Hoy contamos esas proporciones con moles y ecuaciones, un lenguaje posterior. La idea sigue igual: toda reacción tiene una receta. El limitante, la pureza y el rendimiento separan lo que permite la receta de lo que entrega una muestra real.',
      pregunta: '¿Cuántos panes salen si te falta harina pero sobra azúcar?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §4.3', url: 'https://openstax.org/books/chemistry-2e/pages/4-3-reaction-stoichiometry' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que este tema estrena en química. Reactivo, producto, coeficiente y
    // ecuación vienen de «Reacciones químicas y balance»; el lector las marca solas.
    glosario: [
      { termino: 'estequiometría', def: 'Cálculo de cuánto de cada sustancia entra y sale de una reacción, según su ecuación balanceada.',
        ejemplo: '28 g de N₂ piden 6 g de H₂ para formar NH₃.', ver: ['razón molar'] },
      { termino: 'razón molar', def: 'Cuántos moles de una sustancia van por cada mol de otra: el cociente de sus coeficientes.',
        formas: ['razón molar', 'relación molar'], ejemplo: 'N₂ + 3 H₂ → 2 NH₃: 3 mol de H₂ por mol de N₂.', ver: ['coeficiente'] },
      { termino: 'reactivo limitante', def: 'El reactivo que se acaba primero: decide cuánto producto sale.',
        formas: ['reactivo limitante', 'limitante', 'limita'], ejemplo: '3 mol N₂ y 6 mol H₂: 3/1 y 6/3 = 2; limita el H₂.', ver: ['reactivo en exceso'] },
      { termino: 'reactivo en exceso', def: 'El reactivo que sobra cuando el otro ya se acabó.',
        formas: ['reactivo en exceso', 'en exceso', 'exceso'], ejemplo: 'Con 3 mol N₂ y 6 mol H₂, sobra 1 mol de N₂.', ver: ['reactivo limitante'] },
      { termino: 'producto teórico', medida: 'g', def: 'Lo máximo que saldría si toda la parte pura del limitante reaccionara según la receta.',
        formas: ['producto teórico', 'máximo teórico', 'masa teórica', 'rendimiento teórico'], ejemplo: '200 g de caliza al 80 %: 89,6 g de CaO.', ver: ['rendimiento'] },
      { termino: 'rendimiento', medida: '%', def: 'Qué porcentaje del producto teórico se obtiene de verdad en el proceso.',
        formas: ['rendimiento porcentual', 'rendimiento'], ejemplo: 'De 89,6 g posibles salen 67,2 g: 75 %.', ver: ['producto teórico'] },
      { termino: 'pureza', medida: '%', def: 'Qué porcentaje de una muestra es la sustancia que reacciona; el resto es materia que no reacciona.',
        formas: ['pureza', 'impureza', 'impurezas'], ejemplo: '200 g de caliza al 80 %: 160 g de CaCO₃.' },
      { termino: 'equivalente', def: 'Cantidad de sustancia que intercambia 1 mol de H⁺, de OH⁻ o de electrones en una reacción.',
        formas: ['equivalente', 'equivalentes'], ejemplo: 'Medio mol de H₂SO₄ que cede sus 2 H⁺ es 1 equivalente.', ver: ['masa equivalente'] },
      { termino: 'masa equivalente', simbolo: 'M_eq', medida: 'g', def: 'Masa molar dividida entre θ, lo que la sustancia intercambia: la masa de un equivalente.',
        ejemplo: 'H₂SO₄ con θ = 2: 98 / 2 = 49 g.', ver: ['equivalente', 'masa molar'] },
    ],
    // Laboratorio (docs/teoria.md §4b), sin preguntas. La primera mesa deja elegir la receta (la idea 2 solo trae la
    // del agua) y llegar a 12 mol; la segunda suma la masa de la muestra y rangos de 10 % a 100 %. Los rótulos y la
    // lectura dicen las entradas, para que la miniatura guardada se lea sola.
    laboratorio: [
      {
        id: 'limitante-libre', titulo: 'Dos recetas, un limitante', pieza: 'quim-particulas',
        consigna: 'Elige la receta y los moles del primer reactivo; los del segundo cambian solos. Cada bolita es 1 mol. Pausa cuando no sobre nada.',
        controles: [
          { id: 'r', etiqueta: 'Receta', opciones: Object.keys(RECETAS).map(k => ({ valor: k, texto: RECETAS[k].ec })) },
          { id: 'x', etiqueta: 'primer reactivo', color: 'c-i', min: 0, max: 8, paso: 1, inicio: 3, unidad: 'mol', decimales: 0 },
          { id: 'y', etiqueta: 'segundo reactivo', color: 'c-i', min: 0, max: 12, paso: 1, inicio: 6, unidad: 'mol', decimales: 0, auto: { velocidad: 1.2, modo: 'rebota' } },
        ],
        dibujo: v => libre(Object.assign({}, v, { y: Math.round(v.y) })).dib,
        lectura: v => {
          v = Object.assign({}, v, { y: Math.round(v.y) }); const R = RECETAS[v.r], L = libre(v); return [`${v.x} ${R.a[1]} + ${v.y} ${R.b[1]} → ${L.rec * R.c[2]} ${R.c[1]}`, L.sa + L.sb ? ` · sobra ${L.sa ? `${L.sa} ${R.a[1]}` : `${L.sb} ${R.b[1]}`}` : ' · no sobra nada']; },
        // Retos: los decide libre(), la misma cuenta de recetas que dibuja la lupa.
        invitaciones: [
          { texto: 'Busca una mezcla que dé producto y en la que no sobre nada.',
            logrado: v => { const L = libre(v); return L.rec > 0 && !L.sa && !L.sb; },
            bien: 'Proporción justa: los moles van como los coeficientes.' },
          { texto: 'Con la receta del agua, haz que limite el reactivo del que hay más moles.',
            logrado: v => { const L = libre(v); return v.r === 'h2o' && v.x > v.y && L.sa === 0 && L.sb > 0; },
            bien: 'Hay más H₂, pero la receta pide el doble: se acaba primero.' },
          { texto: 'Saca la mayor cantidad de producto posible sin que sobre nada.',
            logrado: v => { const L = libre(v); return !L.sa && !L.sb && L.rec * RECETAS[v.r].c[2] === techo(); },
            bien: 'El techo lo pone el reactivo que llega primero a su tope.' },
          { texto: 'Guarda dos mezclas con el mismo producto y distinto sobrante.',
            logrado: (v, g) => { const L = libre(v); return L.rec > 0
              && g.some(x => { const X = libre(x); return x.r === v.r && X.rec === L.rec && X.sa + X.sb !== L.sa + L.sb; })
              && g.some(x => x.r === v.r && x.x === v.x && x.y === v.y); },
            bien: 'Lo que sobra no suma producto: manda el limitante.' },
        ],
      },
      {
        id: 'caliza', titulo: 'La caliza de verdad', pieza: 'barra-porcentaje',
        consigna: 'Cambia cuánta caliza entra, su pureza y el rendimiento del horno. Arrastra el borde de la parte pura y el final de la barra.',
        controles: [
          { id: 'mm', etiqueta: 'Caliza', color: 'c-o', min: 50, max: 400, paso: 50, inicio: 200, unidad: 'g', decimales: 0 },
          { id: 'p', etiqueta: 'Pureza', color: 'c-h', min: 10, max: 100, paso: 5, inicio: 80, unidad: '%', decimales: 0 },
          { id: 'e', etiqueta: 'Rendimiento', color: 'c-h', min: 10, max: 100, paso: 5, inicio: 75, unidad: '%', decimales: 0 },
        ],
        dibujo: v => caliza(v),
        lectura: v => [`${v.mm} g · ${v.p} % · ${v.e} % → `, m, ` = ${f(v.mm * 0.56 * v.p / 100 * v.e / 100, 1)} g de CaO`],
        arrastres: arrastresBarra(),
        invitaciones: [
          { texto: 'Consigue justo 56 g de CaO.',
            logrado: v => Math.abs(cao(v) - 56) < 1e-6,
            bien: '56 g salen de 100 g de CaCO₃ puro bien aprovechado. ¿Hay otra manera?' },
          { texto: 'Guarda dos casos con pureza y rendimiento intercambiados, misma caliza. Compara el CaO.',
            logrado: (v, g) => v.p !== v.e && g.some(x => x.mm === v.mm && x.p === v.e && x.e === v.p)
              && g.some(x => x.mm === v.mm && x.p === v.p && x.e === v.e),
            bien: 'El mismo CaO: los dos recortes se multiplican y el orden no importa.' },
          { texto: 'Busca la caliza más liviana que igual dé al menos 100 g de CaO.',
            logrado: v => cao(v) >= 100 - 1e-9 && v.mm === liviana(),
            bien: 'Con tan poca caliza, pureza y rendimiento tienen que estar al tope.' },
          { texto: 'Haz que las impurezas pesen más que el CaO que se obtiene.',
            logrado: v => v.mm * (100 - v.p) / 100 > cao(v),
            bien: 'Mucha piedra y poco producto. ¿Qué pesa más aquí, la pureza o el horno?' },
        ],
      },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'limitante-libre': ['reactivo-limitante'],
      'caliza': ['pureza-rendimiento'],
    },
    ideas: [relaciones, limita, pureza, equivalente],
  };
});
