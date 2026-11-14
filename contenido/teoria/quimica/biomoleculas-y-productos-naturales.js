/*
 * Teoría de «Biomoléculas y productos naturales» (quimica.biomoleculas-y-productos-naturales). Molde: docs/teoria.md
 * y contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 18), su historia (Sanger) y las precisiones de
 * Química: «toda unión libera agua» es falso (la adición del eteno, en hidrocarburos, es el contraejemplo; aquí se
 * recuerda en la regla de los lípidos y en la condición), desnaturalizar no es hidrolizar, natural no es inocuo, las
 * vitaminas no son fuente de energía. Errores: docs/investigacion/biomoleculas-ideas-erroneas.md (BM, BMH). Los QM-
 * son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: contar enlaces, aguas y masas al unir unidades, y distinguir cambiar la forma de romper la cadena.
 *   Persona y condiciones: postulante de 5.º, celular de 360 px, sin audio; ya conoce los grupos funcionales.
 *   Resultado observable: calcula la masa de un polisacárido, una grasa o un péptido; dice si un proceso corta
 *     enlaces o solo despliega; clasifica vitaminas por solubilidad y productos naturales por estructura.
 *   Orden de atención: 1.º la cadena de bloques · 2.º las aguas que salen · acción: cambiar n o el compuesto · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿la masa del dímero es la suma?, ¿cocinar rompe la proteína?, ¿las vitaminas dan energía?
 *
 * Colores (regla 4): número de unidades n turquesa c-i, masa M naranja c-o, agua rojo c-h, enlace que une las
 * unidades (glucosídico, éster, peptídico) verde c-d.
 * Datos (no van al alumno), con masas atómicas enteras (C 12, H 1, O 16, N 14): glucosa C₆H₁₂O₆ 180; glicerol
 * C₃H₈O₃ 92; ácidos palmítico 256, esteárico 284, oleico 282, láurico 200, mirístico 228; aminoácidos Gly 75,
 * Ala 89, Ser 105, Val 117, Cys 121, Thr 119. β-caroteno: 11 dobles enlaces conjugados, λmax 455 nm; eteno 171,
 * butadieno 217 y hexatrieno 258 nm (OpenStax Organic Chemistry §14.7–14.9; no verificados con otra fuente). Clasificaciones de vitaminas, alcaloides
 * (cafeína, nicotina, quinina) y polifenoles (quercetina, catequina, antocianinas) según OpenStax Organic Chemistry,
 * «Chemistry Matters» cap. 2 y 20, no verificadas con una segunda fuente.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 0) => Kit.formatear(n, d);
  const nV = { v: 'c-i', t: 'n' }, MV = { v: 'c-o', t: 'M' }, agua = { v: 'c-h', t: 'H₂O' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    r.mezcla = l => { const x = l.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
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
  const mol = (datos) => ({ datos: Object.assign({ atomos: [], enlaces: [], escala: 36, alto: 180 }, datos), estado: {} });

  // ---------- Cadenas de bloques (monosacáridos o aminoácidos) ----------
  // n bloques en fila cada `paso`; enlaces en verde; un H₂O bajo cada enlace (o ninguno). pref separa varias cadenas.
  function cadena(rotulos, { y = 0, paso = 1.6, pref = 'u', aguas = true, desde, hasta, x0 = 0 } = {}) {
    const extra = o => Object.assign(o, desde !== undefined ? { desde } : {}, hasta !== undefined ? { hasta } : {});
    const atomos = rotulos.map((t, i) => extra({ id: `${pref}${i}`, t, x: x0 + i * paso, y, color: 'i' }));
    const enlaces = rotulos.slice(1).map((_, i) => extra({ a: `${pref}${i}`, b: `${pref}${i + 1}`, orden: 1, color: 'd' }));
    const textos = aguas ? rotulos.slice(1).map((_, i) => extra({ x: x0 + (i + 0.5) * paso, y: y + 1.05, t: 'H₂O', color: 'h' })) : [];
    return { atomos, enlaces, textos };
  }
  const juntar = (...ps) => ({ atomos: ps.flatMap(p => p.atomos || []), enlaces: ps.flatMap(p => p.enlaces || []), textos: ps.flatMap(p => p.textos || []) });

  // ---------- Idea 1: unir azúcares suelta agua ----------
  // Cambia: cuántas glucosas se unen · Permanece: 180 por glucosa, 18 por agua · Progresa: n bloques, n − 1 enlaces,
  // n − 1 aguas · Se reserva: la sacarosa (dos azúcares distintos con la misma masa) · Debe verse: un agua bajo cada enlace.
  const GLU = 180, AGUA = 18;
  const masaPoli = n => GLU * n - AGUA * (n - 1);
  const azucares = {
    id: 'unir-azucares',
    titulo: 'Cada unión de azúcares suelta agua',
    temas: ['Carbohidratos'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Elige cuántas glucosas se unen en cadena. Cuenta los enlaces que se forman y las moléculas de agua que salen.',
      voz: 'Cuenta enlaces y aguas; compáralos con el número de glucosas.',
      controles: [{ id: 'n', etiqueta: 'n glucosas', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 2, unidad: '', decimales: 0 }],
      dibujo: val => mol(cadena(Array(val.n).fill('Glc'))),
      lectura: val => [nV, ` = ${val.n}: ${val.n - 1} enlaces, ${val.n - 1} aguas · `, MV, ` = ${f(masaPoli(val.n))} u`],
      minimo: 3,
    },
    predice: {
      pregunta: ['La sacarosa (azúcar de mesa) se forma uniendo una glucosa (180 u) con una fructosa (180 u). ¿Cuál es la masa molecular ', MV, ' de la sacarosa?'],
      voz: 'Piensa qué se va cuando se unen.',
      opciones: [
        { id: 'c', texto: '342 u', correcta: true },
        { id: 'suma', texto: '360 u', error: 'BMH5', siFuera: '360 u sería si se juntaran sin perder nada. Al unirse sale una molécula de agua.' },
        { id: 'mas', texto: '378 u', error: 'BM9', siFuera: 'Eso suma el agua. El agua sale de la unión: se resta.' },
        { id: 'doble', texto: '324 u', error: 'QM-DOS-AGUAS', siFuera: 'Eso resta dos aguas. Una sola unión suelta una sola agua.' },
      ],
      dibujo: mol(cadena(['Glc', 'Fru'], { aguas: false })),
      revelar: mol(Object.assign(cadena(['Glc', 'Fru']), { textos: [{ x: 0.8, y: 1.05, t: 'H₂O', color: 'h' }, { x: 0.8, y: -1.0, t: '180 + 180 − 18 = 342', color: 'o' }] })),
      coincide: 'Coincide: 360 − 18 = 342 u.',
      noCoincide: 'Al unirse sale un agua: 180 + 180 − 18 = 342 u.',
    },
    mira: {
      datos: mol(juntar(
        cadena(['Glc', 'Glc'], { aguas: false, desde: 1, hasta: 1, pref: 'a' }),
        cadena(['Glc', 'Glc'], { desde: 2, pref: 'b' }),
        cadena(['Glc', 'Glc', 'Glc', 'Glc'], { y: 2.6, desde: 3, pref: 'c', x0: -1.6 }),
      )).datos,
      voz: 'Sigamos el inventario: unidades, enlaces y aguas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Dos glucosas sueltas: 180 u cada una.', ecuacion: ['2 × 180 = 360 u'] },
        { estado: { corte: 2 }, texto: 'Se unen: se forma un enlace glucosídico y sale un agua.', ecuacion: ['maltosa: 360 − 18 = 342 u'] },
        { estado: { corte: 3 }, texto: 'Con cuatro glucosas hay tres enlaces y salen tres aguas.', ecuacion: [MV, ' = 4 · 180 − 3 · 18 = 666 u'] },
        { estado: { corte: 3 }, texto: 'Almidón y celulosa: muchas glucosas, con distinto tipo de enlace.' },
      ],
    },
    regla: {
      texto: 'Al unir n monosacáridos en cadena se forman n − 1 enlaces glucosídicos y salen n − 1 aguas. La masa es la suma menos 18 por cada agua.',
      ecuacion: [MV, ' = 180 · ', nV, ' − 18 · (', nV, ' − 1)'],
      condicion: 'para glucosas (C₆H₁₂O₆, 180 u) unidas en una cadena. La hidrólisis hace lo inverso: consume una agua por enlace.',
      voz: 'Cada unión, un agua menos.',
    },
    ahoraTu: {
      voz: 'Cuenta las uniones primero.',
      generar(s) {
        const r = azar(s), n = r.ent(3, 12), m = masaPoli(n);
        return {
          pregunta: ['Un oligosacárido tiene ', nV, ` = ${n} glucosas unidas en cadena. ¿Cuál es su masa molecular `, MV, '?'],
          opciones: opciones(m, [
            { id: 'suma', valor: GLU * n, error: 'BMH8', siFuera: 'Eso suma las glucosas sin restar el agua que sale en cada unión.' },
            { id: 'n-aguas', valor: GLU * n - AGUA * n, error: 'BMH6', siFuera: `Eso resta ${n} aguas. Con ${n} unidades en cadena hay ${n - 1} uniones.` },
            { id: 'mas', valor: GLU * n + AGUA * (n - 1), error: 'BM9', siFuera: 'Eso suma el agua. El agua sale de cada unión: se resta.' },
          ], x => `${f(x)} u`),
          solucion: { texto: `${n} glucosas y ${n - 1} uniones: salen ${n - 1} aguas.`, ecuacion: [MV, ` = 180 · ${n} − 18 · ${n - 1} = ${f(m)} u`] },
        };
      },
    },
  };

  // ---------- Idea 2: una grasa es glicerol con tres ácidos grasos ----------
  // Cambia: el tipo de ácido graso · Permanece: el glicerol con sus tres uniones éster · Progresa: de saturado (recto)
  // a insaturado (con codo cis) · Se reserva: que una grasa no es un polímero · Debe verse: tres uniones, tres aguas.
  const ACIDOS = {
    palmitico: { nombre: 'palmítico', cad: 'C₁₅H₃₁', M: 256, sat: true },
    estearico: { nombre: 'esteárico', cad: 'C₁₇H₃₅', M: 284, sat: true },
    oleico: { nombre: 'oleico', cad: 'C₁₇H₃₃', M: 282, sat: false },
    laurico: { nombre: 'láurico', cad: 'C₁₁H₂₃', M: 200, sat: true },
    miristico: { nombre: 'mirístico', cad: 'C₁₃H₂₇', M: 228, sat: true },
  };
  const GLIC = 92, FILA = 2.0;
  function grasa(k, { aguas = true, desde } = {}) {
    const a = ACIDOS[k], at = [], en = [], tx = [];
    const ex = o => Object.assign(o, desde !== undefined ? { desde } : {});
    ['CH₂', 'CH', 'CH₂'].forEach((t, i) => {
      const y = i * FILA;
      at.push({ id: `g${i}`, t, x: 0, y }, ex({ id: `o${i}`, t: 'O', x: 1.15, y, color: 'h' }), ex({ id: `c${i}`, t: 'C', x: 2.3, y }), ex({ id: `k${i}`, t: a.cad, x: 3.9, y }));
      en.push({ a: `g${i}`, b: `o${i}`, orden: 1 }, ex({ a: `o${i}`, b: `c${i}`, orden: 1, color: 'd' }), ex({ a: `c${i}`, b: `k${i}`, orden: 1 }));
      if (i) en.push({ a: `g${i - 1}`, b: `g${i}`, orden: 1 });
      if (aguas) tx.push(ex({ x: 5.6, y, t: '+ H₂O', color: 'h' }));
    });
    // El C=O de cada éster, arriba de su C (un poco corrido para no chocar con la fila de arriba).
    [0, 1, 2].forEach(i => { at.push(ex({ id: `d${i}`, t: 'O', x: 2.3, y: i * FILA - 0.85, color: 'h' })); en.push(ex({ a: `c${i}`, b: `d${i}`, orden: 2 })); });
    if (!a.sat) tx.push({ x: 3.0, y: 2 * FILA + 0.9, t: 'cada cadena con un doble cis', color: 'd' });
    return { atomos: at, enlaces: en, textos: tx };
  }
  const masaGrasa = k => GLIC + 3 * ACIDOS[k].M - 3 * AGUA;
  const lipidos = {
    id: 'grasas-trigliceridos',
    titulo: 'Una grasa: glicerol y tres ácidos',
    temas: ['Lípidos'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Cambia el ácido graso. Mira las tres uniones éster con el glicerol y si la cadena tiene un doble enlace.',
      voz: 'Cuenta las uniones del glicerol.',
      controles: [{ id: 'k', etiqueta: 'Ácido graso', opciones: ['palmitico', 'estearico', 'oleico'].map(k => ({ valor: k, texto: ACIDOS[k].nombre })) }],
      dibujo: val => mol(Object.assign(grasa(val.k), { escala: 32, alto: 240 })),
      lectura: val => [`${ACIDOS[val.k].sat ? 'Saturada: suele ser sólida (grasa)' : 'Insaturada: suele ser líquida (aceite)'} · `, MV, ` = ${f(masaGrasa(val.k))} u`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Para formar una grasa, el glicerol se une con tres ácidos grasos por enlaces éster. ¿Cuántas moléculas de agua salen?',
      voz: 'Cuenta cuántas uniones hay que formar.',
      opciones: [
        { id: 'c', texto: 'Tres: una por cada unión éster', correcta: true },
        { id: 'una', texto: 'Una, porque se forma una sola grasa', error: 'BMH6', siFuera: 'Sale una por cada unión, no por cada molécula. Aquí hay tres uniones.' },
        { id: 'cero', texto: 'Ninguna: los átomos se suman', error: 'QM-AGUA', siFuera: 'Así pasa en una adición. La unión éster sí suelta agua: un OH y un H.' },
      ],
      dibujo: mol(Object.assign(grasa('palmitico', { aguas: false }), { escala: 32, alto: 240 })),
      revelar: mol(Object.assign(grasa('palmitico'), { escala: 32, alto: 240 })),
      coincide: 'Coincide: tres uniones éster, tres aguas.',
      noCoincide: 'Cada unión éster suelta un agua: son tres.',
    },
    mira: {
      datos: (() => {
        const g = grasa('palmitico', { desde: 2 });
        g.textos.forEach(t => { t.desde = 3; });
        g.textos.push({ x: 2.6, y: 2 * FILA + 0.95, t: '92 + 3 · 256 − 3 · 18 = 806 u', color: 'o', desde: 4 });
        return mol(Object.assign(g, { escala: 32, alto: 250 })).datos;
      })(),
      voz: 'Armemos la grasa unión por unión.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El glicerol es una cadena de tres carbonos con tres OH.', ecuacion: ['C₃H₈O₃: 92 u'] },
        { estado: { corte: 2 }, texto: 'Cada OH se une con un ácido graso por un enlace éster.', ecuacion: ['3 ácidos palmíticos: 3 · 256 u'] },
        { estado: { corte: 3 }, texto: 'Cada unión suelta un agua: salen tres.', ecuacion: ['3 · 18 = 54 u'] },
        { estado: { corte: 4 }, texto: 'La masa de la grasa es la suma menos las aguas.', ecuacion: [MV, ' = 92 + 768 − 54 = 806 u'] },
      ],
    },
    regla: {
      texto: 'Una grasa o un aceite es un triéster: glicerol unido a tres ácidos grasos, con tres uniones y tres aguas que salen. Los dobles cis suelen volverla líquida.',
      ecuacion: [MV, ' = 92 + 3 · ', { sub: [MV, 'ácido'] }, ' − 3 · 18'],
      condicion: 'los lípidos son diversos: ceras, fosfolípidos y colesterol no son triglicéridos. Una grasa no es un polímero.',
      voz: 'Glicerol, tres ácidos, tres aguas.',
    },
    ahoraTu: {
      voz: 'Suma, y resta una agua por unión.',
      generar(s) {
        const ks = Object.keys(ACIDOS), k = ks[s % ks.length], a = ACIDOS[k], m = masaGrasa(k);
        return {
          pregunta: ['Una grasa se forma con glicerol (92 u) y tres moléculas de ácido ', `${a.nombre} (${f(a.M)} u). ¿Cuál es su masa molecular `, MV, '?'],
          opciones: opciones(m, [
            { id: 'suma', valor: GLIC + 3 * a.M, error: 'BMH7', siFuera: 'Eso suma todo sin restar las tres aguas que salen al formar los ésteres.' },
            { id: 'una', valor: GLIC + 3 * a.M - AGUA, error: 'BMH6', siFuera: 'Eso resta una sola agua. Hay tres uniones éster: salen tres.' },
            { id: 'un-acido', valor: GLIC + a.M - AGUA, error: 'QM-TRES-ACIDOS', siFuera: 'Eso usa un solo ácido graso. La grasa lleva tres.' },
          ], x => `${f(x)} u`),
          solucion: { texto: 'Tres uniones éster: se restan tres aguas.', ecuacion: [MV, ` = 92 + 3 · ${f(a.M)} − 3 · 18 = ${f(m)} u`] },
        };
      },
    },
  };

  // ---------- Idea 3: péptidos, plegado y desnaturalización ----------
  // Cambia: cuántos aminoácidos y si la cadena está plegada · Permanece: los enlaces peptídicos · Progresa: plegada,
  // desplegada, cortada · Se reserva: la hidrólisis, que es lo único que corta · Debe verse: que desplegar no quita
  // ningún enlace verde.
  const AA = { Gly: 75, Ala: 89, Ser: 105, Val: 117, Cys: 121, Thr: 119 };
  const SEC = ['Gly', 'Ala', 'Ser', 'Val', 'Cys', 'Thr'];
  function plegada(desde, hasta) {
    const pos = [[0, 0], [1.6, 0], [3.2, 0], [3.2, 1.7], [1.6, 1.7], [0, 1.7]];
    const ex = o => Object.assign(o, desde !== undefined ? { desde } : {}, hasta !== undefined ? { hasta } : {});
    const atomos = SEC.map((t, i) => ex({ id: `p${i}`, t, x: pos[i][0], y: pos[i][1], color: 'i' }));
    const enlaces = SEC.slice(1).map((_, i) => ex({ a: `p${i}`, b: `p${i + 1}`, orden: 1, color: 'd' }));
    enlaces.push(ex({ a: 'p0', b: 'p5', discontinuo: true }), ex({ a: 'p1', b: 'p4', discontinuo: true }));
    return { atomos, enlaces, textos: [] };
  }
  const proteinas = {
    id: 'peptidos-plegado',
    titulo: 'Desplegar no es cortar',
    temas: ['Aminoácidos y proteínas'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Elige cuántos aminoácidos forman la cadena. Cuenta los enlaces peptídicos (verdes) y el agua que salió en cada uno.',
      voz: 'Compara el número de bloques con el de enlaces.',
      controles: [{ id: 'n', etiqueta: 'n aminoácidos', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 2, unidad: '', decimales: 0 }],
      dibujo: val => mol(cadena(SEC.slice(0, val.n), { paso: 1.5 })),
      lectura: val => [nV, ` = ${val.n} aminoácidos: ${val.n - 1} enlaces peptídicos, ${val.n - 1} aguas`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Al cocinar un huevo, la clara pasa de transparente a blanca porque sus proteínas se desnaturalizan. ¿Qué pasa con sus enlaces peptídicos?',
      voz: 'Separa el plegado de la cadena misma.',
      opciones: [
        { id: 'c', texto: 'Siguen enteros: solo cambia el plegado', correcta: true },
        { id: 'rompe', texto: 'Se rompen: quedan aminoácidos sueltos', error: 'BMH1', siFuera: 'Eso es la hidrólisis, que necesita agua y enzimas o ácido. Cocinar solo despliega la cadena.' },
        { id: 'agua', texto: 'Se rompen y sale agua', error: 'BM9', siFuera: 'Romper un enlace peptídico consume agua, no la suelta. Y cocinar no lo rompe.' },
      ],
      dibujo: mol(Object.assign(plegada(), { escala: 40, alto: 200 })),
      revelar: mol(Object.assign(cadena(SEC, { paso: 1.5, aguas: false }), { textos: [{ x: 3.75, y: 1.05, t: '5 enlaces, los mismos', color: 'd' }] })),
      coincide: 'Coincide: la cadena se despliega con sus cinco enlaces.',
      noCoincide: 'Se pierde el plegado (las uniones punteadas); los cinco enlaces siguen.',
    },
    mira: {
      datos: (() => {
        const a = plegada(1, 1);
        const b = cadena(SEC, { paso: 1.5, aguas: false, desde: 2, hasta: 2, pref: 'q', x0: -2.15, y: 0.85 });
        const c = cadena(SEC.map(t => t), { paso: 1.5, aguas: false, desde: 3, pref: 'r', x0: -2.15, y: 0.85 });
        c.enlaces = [];
        c.textos = [{ x: 1.6, y: 2.2, t: '+ 5 H₂O entran', color: 'h', desde: 3 }];
        return mol(Object.assign(juntar(a, b, c), { escala: 34, alto: 200 })).datos;
      })(),
      voz: 'Comparemos plegar, desplegar y cortar.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Plegada: atracciones débiles (punteadas) sostienen la forma.', ecuacion: ['5 enlaces peptídicos'] },
        { estado: { corte: 2 }, texto: 'Desnaturalizada: se pierden las punteadas; los enlaces siguen.', ecuacion: ['5 enlaces peptídicos'] },
        { estado: { corte: 3 }, texto: 'Hidrolizada: entra agua y corta cada enlace peptídico.', ecuacion: ['5 enlaces + 5 H₂O → 6 aminoácidos'] },
      ],
    },
    regla: {
      texto: 'n aminoácidos en cadena forman n − 1 enlaces peptídicos y sueltan n − 1 aguas. Desnaturalizar cambia el plegado sin cortar enlaces; hidrolizar los corta y consume agua.',
      ecuacion: ['enlaces = ', nV, ' − 1   ·   ', MV, ' = suma − 18 · (', nV, ' − 1)'],
      condicion: 'una sola cadena lineal; los puentes disulfuro no son enlaces peptídicos. Desnaturalizada no significa digerida ni sin valor.',
      voz: 'Forma y cadena son dos preguntas distintas.',
    },
    ahoraTu: {
      voz: 'Cuenta aminoácidos y uniones.',
      generar(s) {
        const r = azar(s);
        if (s % 2) {
          const n = r.ent(3, 40);
          return {
            pregunta: ['Una cadena lineal tiene ', nV, ` = ${n} aminoácidos. ¿Cuántos enlaces peptídicos tiene?`],
            opciones: opciones(n - 1, [
              { id: 'n', valor: n, error: 'BMH6', siFuera: `Habría ${n} enlaces si la cadena se cerrara en anillo. En línea, el último no se une a otro.` },
              { id: 'mas', valor: n + 1, error: 'BMH6', siFuera: 'Eso cuenta de más: entre n bloques en fila hay n − 1 uniones.' },
              { id: 'doble', valor: 2 * (n - 1), error: 'QM-DOS-AGUAS', siFuera: 'Eso cuenta cada enlace dos veces. Cada unión es un solo enlace.' },
            ], x => `${f(x)}`),
            solucion: { texto: `Entre ${n} bloques en fila hay ${n - 1} uniones.`, ecuacion: [`enlaces = ${n} − 1 = ${n - 1}`] },
          };
        }
        const sec = r.mezcla(Object.keys(AA)).slice(0, 3), suma = sec.reduce((x, k) => x + AA[k], 0), m = suma - 2 * AGUA;
        return {
          pregunta: ['El tripéptido ', `${sec.join('–')} se forma con ${sec.map(k => `${k} (${AA[k]} u)`).join(', ')}. ¿Cuál es su masa molecular `, MV, '?'],
          opciones: opciones(m, [
            { id: 'suma', valor: suma, error: 'BMH7', siFuera: 'Eso suma los aminoácidos sin restar el agua de cada enlace peptídico.' },
            { id: 'tres', valor: suma - 3 * AGUA, error: 'BMH6', siFuera: 'Eso resta tres aguas. Tres aminoácidos en fila forman dos enlaces.' },
            { id: 'una', valor: suma - AGUA, error: 'BMH6', siFuera: 'Eso resta una sola agua. Hay dos enlaces peptídicos.' },
          ], x => `${f(x)} u`),
          solucion: { texto: 'Dos enlaces peptídicos: salen dos aguas.', ecuacion: [MV, ` = ${suma} − 2 · 18 = ${f(m)} u`] },
        };
      },
    },
  };

  // ---------- Idea 4: vitaminas: se disuelven en grasa o en agua ----------
  // Cambia: la vitamina · Permanece: las dos columnas (grasa y agua) · Progresa: de la estructura (cadena larga o
  // muchos OH) a dónde se disuelve y si se acumula · Se reserva: que no dan energía · Debe verse: en qué columna cae.
  const VIT = {
    A: ['A', 'lipo'], D: ['D', 'lipo'], E: ['E', 'lipo'], K: ['K', 'lipo'],
    C: ['C', 'hidro'], B1: ['B₁', 'hidro'], B2: ['B₂', 'hidro'], B9: ['B₉ (ácido fólico)', 'hidro'], B12: ['B₁₂', 'hidro'],
  };
  const columnas = (marca, conTodo = true) => ({
    datos: {
      columnas: [
        { titulo: 'En grasa', color: 'o', nodos: [{ texto: 'A, D, E y K', tenue: marca && VIT[marca][1] !== 'lipo' }, { texto: 'cadena larga de C e H, poco polar', desde: conTodo ? 0 : 1 }, { texto: 'se guardan en el tejido graso', desde: conTodo ? 0 : 2 }] },
        { titulo: 'En agua', color: 'i', nodos: [{ texto: 'C y grupo B', tenue: marca && VIT[marca][1] !== 'hidro' }, { texto: 'varios OH o N, polares', desde: conTodo ? 0 : 1 }, { texto: 'el exceso sale con la orina', desde: conTodo ? 0 : 2 }] },
      ],
    },
    estado: {},
  });
  const vitaminas = {
    id: 'vitaminas-solubilidad',
    titulo: 'Vitaminas: en grasa o en agua',
    temas: ['Vitaminas'],
    pieza: 'quim-cadena',
    juega: {
      consigna: 'Elige una vitamina y mira en qué columna cae. Lee qué parte de su estructura decide dónde se disuelve.',
      voz: 'La estructura decide dónde se disuelve.',
      controles: [{ id: 'k', etiqueta: 'Vitamina', opciones: ['A', 'D', 'C', 'B12'].map(k => ({ valor: k, texto: VIT[k][0] })) }],
      dibujo: val => columnas(val.k),
      lectura: val => [`Vitamina ${VIT[val.k][0]}: se disuelve en ${VIT[val.k][1] === 'lipo' ? 'grasa (liposoluble)' : 'agua (hidrosoluble)'}.`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una tableta de vitamina C trae 500 mg. ¿Cuánta energía aporta al cuerpo, comparada con 500 mg de azúcar?',
      voz: 'Piensa para qué usa el cuerpo una vitamina.',
      opciones: [
        { id: 'c', texto: 'Prácticamente ninguna: regula procesos, no es combustible', correcta: true },
        { id: 'igual', texto: 'Igual que el azúcar: ambas son moléculas orgánicas', error: 'BM1', siFuera: 'Ser orgánica no basta. El cuerpo quema azúcares y grasas; las vitaminas participan en reacciones.' },
        { id: 'mas', texto: 'Más que el azúcar: por eso «dan energía»', error: 'BM1', siFuera: 'Ayudan a que el cuerpo use su energía, cierto. Pero ellas mismas no son la fuente.' },
      ],
      dibujo: columnas(null),
      revelar: { datos: { columnas: [{ titulo: 'Fuente de energía', color: 'o', nodos: [{ texto: 'azúcares y grasas' }, { texto: 'se queman con O₂' }] }, { titulo: 'Vitaminas', color: 'i', nodos: [{ texto: 'cantidades muy pequeñas' }, { texto: 'ayudan a que ocurran reacciones' }] }] }, estado: {} },
      coincide: 'Coincide: las vitaminas regulan; no son combustible.',
      noCoincide: 'El cuerpo obtiene energía de azúcares y grasas; las vitaminas regulan.',
    },
    mira: {
      datos: columnas(null, false).datos,
      voz: 'Leamos las dos columnas de arriba abajo.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Dos grupos: A, D, E y K; y la C con el grupo B.' },
        { estado: { corte: 1 }, texto: 'A, D, E y K: poco polares. C y B: muchos grupos polares.' },
        { estado: { corte: 2 }, texto: 'Lo liposoluble se acumula en grasa; lo hidrosoluble sale con la orina.' },
      ],
    },
    regla: {
      texto: 'Las vitaminas se clasifican por solubilidad: A, D, E y K en grasa (liposolubles); C y el grupo B en agua (hidrosolubles). Regulan procesos; no son fuente de energía.',
      ecuacion: ['liposolubles: A, D, E, K   ·   hidrosolubles: C, B'],
      condicion: 'la solubilidad sale de la estructura: más zonas polares, más afinidad por el agua. Natural no significa inocuo en exceso.',
      voz: 'Dónde se disuelve dice dónde se guarda.',
    },
    ahoraTu: {
      voz: 'Ubícala en una de las dos columnas.',
      generar(s) {
        const r = azar(s), ks = Object.keys(VIT), k = ks[s % ks.length], [nom, tipo] = VIT[k];
        const lipo = { id: 'lipo', texto: 'Liposoluble: se disuelve en grasa' }, hidro = { id: 'hidro', texto: 'Hidrosoluble: se disuelve en agua' };
        const energia = { id: 'energia', texto: 'Es una fuente de energía', error: 'BM1', siFuera: 'Las vitaminas regulan reacciones; la energía viene de azúcares y grasas.' };
        const ok = tipo === 'lipo' ? lipo : hidro, mal = tipo === 'lipo' ? hidro : lipo;
        return {
          pregunta: `¿Cómo se clasifica la vitamina ${nom}?`,
          opciones: r.mezcla([Object.assign({ correcta: true }, ok), Object.assign({ error: 'QM-VITAMINA', siFuera: tipo === 'lipo' ? 'Sería hidrosoluble si tuviera muchos grupos polares. Esta es de las A, D, E y K.' : 'Sería liposoluble si fuera de las A, D, E y K, poco polares.' }, mal), energia]),
          solucion: { texto: tipo === 'lipo' ? 'Es de las A, D, E y K: se disuelve en grasa.' : 'Es la C o del grupo B: se disuelve en agua.', ecuacion: [tipo === 'lipo' ? 'liposoluble' : 'hidrosoluble'] },
        };
      },
    },
  };

  // ---------- Idea 5: alcaloides, polifenoles y el color ----------
  // Cambia: el rasgo de estructura · Permanece: la escala y la idea de familia por estructura · Progresa: N en un
  // anillo, OH sobre anillos, dobles alternados que dan color · Se reserva: el largo de la cadena de dobles que pasa
  // de incoloro a naranja · Debe verse: el rasgo que define la familia.
  function anillo(t, sust = {}, dobles = true) {
    const atomos = [], enlaces = [];
    for (let i = 0; i < 6; i++) {
      const g = (-90 + 60 * i) * Math.PI / 180;
      atomos.push({ id: `r${i}`, t: t[i], x: 1.15 * Math.cos(g), y: 1.15 * Math.sin(g), color: t[i] === 'N' ? 'o' : undefined });
      enlaces.push({ a: `r${i}`, b: `r${(i + 1) % 6}`, orden: dobles && i % 2 === 0 ? 2 : 1 });
    }
    for (const [i, s] of Object.entries(sust)) {
      const g = (-90 + 60 * i) * Math.PI / 180;
      atomos.push({ id: `s${i}`, t: s, x: 2.3 * Math.cos(g), y: 2.3 * Math.sin(g), color: s === 'OH' ? 'h' : undefined });
      enlaces.push({ a: `r${i}`, b: `s${i}`, orden: 1 });
    }
    atomos.forEach(a => { if (!a.color) delete a.color; });
    return { atomos, enlaces };
  }
  // Un tramo de una cadena con dobles alternados (los «…» dicen que sigue).
  function tramo() {
    const ts = ['CH', 'CH', 'CH', 'CH', 'CH', 'CH'];
    const atomos = ts.map((t, i) => ({ id: `z${i}`, t, x: i * 1.2, y: i % 2 ? 0.6 : 0 }));
    const enlaces = ts.slice(1).map((_, i) => Object.assign({ a: `z${i}`, b: `z${i + 1}`, orden: i % 2 === 0 ? 2 : 1 }, i % 2 === 0 ? { color: 'd' } : {}));
    return mol({ atomos, enlaces, escala: 38, alto: 150, textos: [{ x: -0.9, y: 0, t: '…' }, { x: 6.9, y: 0.6, t: '…' }] });
  }
  // Longitud de onda absorbida contra número de dobles alternados: solo los puntos medidos (no se interpola).
  const ABS = [[1, 171, 'eteno'], [2, 217, 'butadieno'], [3, 258, 'hexatrieno'], [11, 455, 'β-caroteno']];
  const ejesAbs = (puntos, extra = {}) => ({ datos: Object.assign({
    x: { min: 0, max: 12, paso: 1, cada: 2, nombre: 'dobles alternados', decimales: 0 },
    y: { min: 0, max: 700, paso: 100, cada: 2, nombre: 'λ', unidad: 'nm', decimales: 0, color: 'd' },
    areas: [{ puntos: [[0, 400], [12, 400], [12, 700], [0, 700]], cerrada: true, color: 'o' }],
    curvas: [{ puntos: [[1.5, 620]], color: 'o', rotulo: 'luz visible (400–700 nm)', en: [1.5, 620] }],   // solo el rótulo de la franja
    puntos,
    alt: 'Longitud de onda que absorbe cada molécula contra su número de dobles enlaces alternados; la franja de arriba, desde 400 nm, es la luz visible.',
  }, extra), estado: {} });
  const RASGO = {
    alcaloide: { fig: () => mol(Object.assign(anillo(['CH', 'CH', 'CH', 'N', 'CH', 'CH']), { escala: 40, alto: 200, resaltos: [{ atomos: ['r3'], color: 'o', texto: 'N en el anillo' }] })), lee: 'Alcaloide (cafeína, quinina): N dentro de un anillo.' },
    polifenol: { fig: () => mol(Object.assign(anillo(['CH', 'CH', 'CH', 'C', 'C', 'CH'], { 3: 'OH', 4: 'OH' }), { escala: 36, alto: 220, resaltos: [{ atomos: ['s3', 's4'], color: 'h', texto: 'varios OH' }] })), lee: 'Polifenol (té, maíz morado): varios OH en anillos aromáticos.' },
    colorante: { fig: () => tramo(), lee: 'Carotenoide (achiote, zanahoria): muchos dobles alternados.' },
  };
  const naturales = {
    id: 'productos-naturales',
    titulo: 'Familias por estructura, no por origen',
    temas: ['Alcaloides y polifenoles', 'Colorantes naturales'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Cada familia de productos naturales tiene un rasgo de estructura. Elige una y mira el rasgo resaltado.',
      voz: 'Busca el rasgo que comparten, no de dónde vienen.',
      controles: [{ id: 'k', etiqueta: 'Familia', opciones: [{ valor: 'alcaloide', texto: 'Alcaloide' }, { valor: 'polifenol', texto: 'Polifenol' }, { valor: 'colorante', texto: 'Carotenoide' }] }],
      dibujo: val => RASGO[val.k].fig(),
      lectura: val => [RASGO[val.k].lee],
      minimo: 3,
    },
    predice: {
      pregunta: 'El β-caroteno de la zanahoria tiene 11 dobles enlaces alternados seguidos; el eteno, uno solo. ¿Cuál absorbe luz visible y se ve de color?',
      voz: 'Piensa en el largo de los dobles alternados.',
      opciones: [
        { id: 'c', texto: 'El β-caroteno: muchos dobles alternados', correcta: true },
        { id: 'eteno', texto: 'El eteno: el doble enlace da el color', error: 'QM-COLOR', siFuera: 'Un doble absorbe luz, pero ultravioleta, que no vemos. Hacen falta muchos alternados.' },
        { id: 'natural', texto: 'Los dos, porque son naturales', error: 'BMH14', siFuera: 'El color no depende del origen. Depende de la estructura: el eteno es incoloro.' },
      ],
      pieza: 'ejes',
      dibujo: ejesAbs([]),
      revelar: ejesAbs([{ x: 1, y: 171, color: 'd', rotulo: 'eteno: 171 nm' }, { x: 11, y: 455, color: 'd', rotulo: 'β-caroteno: 455 nm' }]),
      coincide: 'Coincide: la cadena larga de dobles alternados da color.',
      noCoincide: 'El eteno absorbe ultravioleta; el β-caroteno, luz azul: se ve naranja.',
    },
    mira: {
      pieza: 'ejes',
      datos: ejesAbs(ABS.map(([k, l, n], i) => ({ x: k, y: l, color: 'd', rotulo: i < 2 ? undefined : `${n}: ${l} nm`, desde: i === 0 ? 1 : i < 3 ? 2 : 3 }))).datos,
      voz: 'Alarguemos la cadena de dobles alternados.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Eteno: un doble enlace; absorbe ultravioleta, se ve incoloro.' },
        { estado: { corte: 2 }, texto: 'Con dos y tres alternados, la luz absorbida se acerca al visible.', ecuacion: ['217 nm · 258 nm'] },
        { estado: { corte: 3 }, texto: 'Once alternados (β-caroteno): absorbe azul y se ve naranja.', ecuacion: ['455 nm'] },
      ],
    },
    regla: {
      texto: 'Alcaloide: producto natural con N, casi siempre en un anillo. Polifenol: varios OH sobre anillos aromáticos. Un colorante absorbe luz visible gracias a muchos dobles alternados.',
      ecuacion: ['más dobles alternados → absorbe luz de mayor longitud de onda'],
      condicion: 'son familias por estructura, no por origen. Natural no significa inocuo: la nicotina es un alcaloide tóxico.',
      voz: 'Primero el rasgo de estructura; el origen no clasifica.',
    },
    ahoraTu: {
      voz: 'Busca el rasgo de su familia.',
      generar(s) {
        const CASOS = [
          ['La cafeína del café tiene N dentro de sus anillos.', 'alcaloide'], ['La quinina de la cascarilla tiene un N en un anillo.', 'alcaloide'],
          ['La nicotina del tabaco tiene N en dos anillos.', 'alcaloide'], ['La quercetina de la cebolla tiene varios OH en anillos aromáticos.', 'polifenol'],
          ['La catequina del té tiene varios OH sobre anillos aromáticos.', 'polifenol'], ['Las antocianinas del maíz morado tienen varios OH en anillos aromáticos.', 'polifenol'],
          ['La bixina del achiote tiene una cadena larga de dobles alternados.', 'colorante'], ['El licopeno del tomate tiene una cadena larga de dobles alternados.', 'colorante'],
        ];
        const r = azar(s), [txt, fam] = CASOS[s % CASOS.length];
        const nom = { alcaloide: 'Alcaloide', polifenol: 'Polifenol', colorante: 'Carotenoide (colorante de cadena)' };
        const si = { alcaloide: 'Sería alcaloide si tuviera N, casi siempre en un anillo.', polifenol: 'Sería polifenol si tuviera varios OH sobre anillos aromáticos.', colorante: 'Sería carotenoide si su rasgo fuera una cadena larga de dobles alternados.' };
        return {
          pregunta: `${txt} ¿A qué familia pertenece?`,
          dibujo: RASGO[fam].fig(),
          opciones: r.mezcla(Object.keys(nom).map(k => (k === fam ? { id: 'c', texto: nom[k], correcta: true } : { id: k, texto: nom[k], error: 'QM-NATURAL', siFuera: si[k] }))),
          solucion: { texto: { alcaloide: 'Tiene N en un anillo: alcaloide.', polifenol: 'Varios OH en anillos aromáticos: polifenol.', colorante: 'Muchos dobles alternados: carotenoide, da color.' }[fam], ecuacion: [nom[fam]] },
        };
      },
    },
  };

  return {
    unidad: 'quimica.biomoleculas-y-productos-naturales',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-molecula.js', '/nucleo/kit/piezas/quim-cadena.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Saber que una proteína está hecha de aminoácidos no dice en qué orden van. Desde 1943, Frederick Sanger cortó la insulina con reacciones controladas, separó los trozos y los identificó, hasta reconstruir su secuencia; lo contó en su conferencia Nobel de 1958. Romper enlaces, cambiar el plegado y medir una función resultaron ser preguntas distintas.',
      pregunta: '¿Cómo sabrías el orden de las piezas de una cadena que no ves?',
      fuente: { titulo: 'F. Sanger, conferencia Nobel (1958)', url: 'https://www.nobelprize.org/prizes/chemistry/1958/sanger/lecture/' },
    },
    ideas: [azucares, lipidos, proteinas, vitaminas, naturales],
  };
});
