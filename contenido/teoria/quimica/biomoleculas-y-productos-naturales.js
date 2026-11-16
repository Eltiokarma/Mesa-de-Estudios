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
  const pl = (k, uno, varios) => `${k} ${k === 1 ? uno : varios}`;
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
  // Gesto directo (docs/teoria.md §4b). La pieza recentra la figura con todo lo que trae: cada punto se calcula con
  // el encuadre del dibujo del valor actual. La manija del último bloque va 24 px arriba de él, para no tapar el
  // rótulo; la opción (o el número) que gana es la de manija más cercana al dedo.
  const QM = () => Kit.piezas['quim-molecula'];
  const sobre = (dib, id, dy = -24) => { const d = dib.datos, g = QM().encuadre(d), a = d.atomos.find(x => x.id === id); return { x: g.X(a.x), y: g.Y(a.y) + dy }; };
  const cercana = (valores, donde, pt, val, id, medida) => {
    const dist = medida || ((q, p) => Math.hypot(q.x - p.x, q.y - p.y));
    let mejor = valores[0], dm = Infinity;
    for (const o of valores) { const dd = dist(donde(Object.assign({}, val, { [id]: o })), pt); if (dd < dm - 1e-9) { dm = dd; mejor = o; } }
    return mejor;
  };
  const juntar = (...ps) => ({ atomos: ps.flatMap(p => p.atomos || []), enlaces: ps.flatMap(p => p.enlaces || []), textos: ps.flatMap(p => p.textos || []) });

  // ---------- Animación (decisión de Gerson, 15 nov: química se mueve sola) ----------
  // En cámara lenta, las uniones se forman una por una entre 0,4 s y 4,8 s; la molécula queda armada 1,2 s y vuelve a
  // empezar (t de 0 a 6 s). Cada unión tiene su avance q de 0 a 1: hasta 0,7 el bloque se acerca; al tocarse aparece
  // el enlace verde y su agua baja a su sitio. Los tiempos son ilustrativos (aquí no hay cinética); lo que se cuenta,
  // enlaces, aguas y masa, es exacto en cada cuadro. Sin t (predicción, «Mira», «Ahora tú»), la molécula está armada.
  const TT = { id: 't', etiqueta: 't', min: 0, max: 6, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } };
  const suave = x => { const y = Math.max(0, Math.min(1, x)); return y * y * (3 - 2 * y); };
  const avanceU = (t, U) => (t === undefined ? U : Math.max(0, Math.min(1, (t - 0.4) / 4.4)) * U);
  const qU = (s, i) => Math.max(0, Math.min(1, s - i));
  const TOCA = 0.7;
  const formadas = (t, U) => { const s = avanceU(t, U); let k = 0; for (let i = 0; i < U; i++) if (qU(s, i) >= TOCA - 1e-9) k++; return k; };
  // La cadena que se arma: el bloque i (desde el segundo) baja desde 1,2 unidades arriba de su sitio mientras su unión
  // avanza. Dos anclas invisibles fijan el alto del encuadre (la figura no salta mientras bajan los bloques y el agua).
  function cadenaViva(rotulos, t, { paso = 1.6 } = {}) {
    const U = rotulos.length - 1, s = avanceU(t, U), atomos = [], enlaces = [], textos = [];
    rotulos.forEach((r, i) => {
      const q = i ? qU(s, i - 1) : 1;
      atomos.push({ id: `u${i}`, t: r, x: i * paso, y: -1.2 * (1 - suave(q / TOCA)), color: 'i' });
      if (i && q >= TOCA - 1e-9) {
        enlaces.push({ a: `u${i - 1}`, b: `u${i}`, orden: 1, color: 'd' });
        textos.push({ x: (i - 0.5) * paso, y: 0.35 + 0.7 * suave((q - TOCA) / (1 - TOCA)), t: 'H₂O', color: 'h' });
      }
    });
    textos.push({ x: 0, y: -1.2, t: '', hasta: -1 }, { x: 0, y: 1.05, t: '', hasta: -1 });
    return { atomos, enlaces, textos };
  }

  // ---------- Idea 1: unir azúcares suelta agua ----------
  // Cambia: cuántas glucosas se unen · Permanece: 180 por glucosa, 18 por agua · Progresa: n bloques, n − 1 enlaces,
  // n − 1 aguas · Se reserva: la sacarosa (dos azúcares distintos con la misma masa) · Debe verse: un agua bajo cada enlace.
  const GLU = 180, AGUA = 18;
  const masaPoli = n => GLU * n - AGUA * (n - 1);
  const azucarViva = val => mol(cadenaViva(Array(Math.round(val.n)).fill('Glc'), val.t));
  const azucares = {
    id: 'unir-azucares',
    titulo: 'Cada unión de azúcares suelta agua',
    temas: ['Carbohidratos'],
    pieza: 'quim-molecula',
    // Lee (fase 2): contexto y vocabulario. No dice qué pasa con la masa al unir (eso se predice con la sacarosa).
    lee: {
      tarjetas: [
        { titulo: 'Azúcares de todos los días', texto: 'La glucosa le da energía a tus células. El azúcar de mesa, el almidón de la papa y del chuño, y la celulosa de las plantas están hechos de azúcares simples unidos entre sí.' },
        { titulo: 'Monosacáridos', texto: 'Un monosacárido es un azúcar simple, como la glucosa o la fructosa. Las dos tienen la fórmula C₆H₁₂O₆ y masa 180 u, aunque sus átomos están ordenados de otra manera.',
          ecuacion: ['6 · 12 + 12 · 1 + 6 · 16 = 180 u'] },
        { titulo: 'Qué mirar', texto: 'En el juego, cada bloque Glc es una glucosa y la línea verde que une dos bloques es un enlace glucosídico. Cuenta bloques y enlaces, y sigue la masa en la lectura.' },
      ],
    },
    juega: {
      consigna: 'En cámara lenta, las glucosas bajan y se unen una por una. Con cada enlace sale un agua y la masa baja 18 u.',
      voz: 'Cuenta enlaces y aguas; compáralos con el número de glucosas.',
      controles: [{ id: 'n', etiqueta: 'n glucosas', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 3, unidad: '', decimales: 0 }, TT],
      dibujo: val => azucarViva(val),
      // La masa del momento: las glucosas menos el agua que ya salió (al final, la de la cadena entera).
      lectura: val => { const u = formadas(val.t, val.n - 1); return [`${f(val.t, 1)} s · `, nV, ` = ${val.n}: ${pl(u, 'enlace', 'enlaces')}, ${pl(u, 'agua', 'aguas')} · `, MV, ` = ${f(GLU * val.n - AGUA * u)} u`]; },
      minimo: 3,
      // Se agarra la última glucosa y se tira a la derecha para alargar la cadena. Responden los enlaces verdes, las
      // aguas bajo cada uno y la masa, que sube 162 u por glucosa (180 menos el agua que sale).
      arrastres: [{ id: 'ultima', etiqueta: 'última glucosa: tira para alargar la cadena', color: 'c-i',
        donde: val => sobre(azucarViva(val), `u${Math.round(val.n) - 1}`),
        mover: (pt, val) => ({ n: cercana([1, 2, 3, 4, 5, 6], v => sobre(azucarViva(v), `u${v.n - 1}`), pt, val, 'n') }) }],
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
      ecuacion: [MV, ' = ', { llave: ['180 · ', nV], nota: 'las glucosas', color: 'c-i' }, ' − ', { llave: ['18 · (', nV, ' − 1)'], nota: 'aguas que salen', color: 'c-h' }],
      condicion: 'para glucosas (C₆H₁₂O₆, 180 u) unidas en una cadena. La hidrólisis hace lo inverso: consume una agua por enlace.',
      voz: 'Cada unión, un agua menos.',
    },
    // Así se resuelve (fase 2): la misma cuenta de «Ahora tú» (masaPoli), con otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), n = r.ent(3, 12), m = masaPoli(n);
        return {
          enunciado: ['Un oligosacárido tiene ', nV, ` = ${n} glucosas unidas en una cadena abierta. ¿Cuál es su masa molecular `, MV, '?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden la masa molecular ', MV, ` de la cadena de ${n} glucosas.`] },
            { tipo: 'datos', texto: ['Hay ', nV, ` = ${n} glucosas de 180 u cada una. Cada agua pesa 18 u.`] },
            { tipo: 'regla', texto: 'Cada unión entre dos glucosas suelta un agua. En una cadena abierta hay una unión menos que bloques.' },
            { tipo: 'cuentas', texto: `${n} glucosas en fila: ${n - 1} uniones y ${n - 1} aguas que salen.`,
              ecuacion: [MV, ` = 180 · ${n} − 18 · ${n - 1} = ${f(180 * n)} − ${f(18 * (n - 1))} = ${f(m)} u`] },
            { tipo: 'sentido', texto: `Otra forma: la primera glucosa pesa 180 u y cada una que se agrega suma 180 − 18 = 162 u. 180 + 162 · ${n - 1} = ${f(GLU + (GLU - AGUA) * (n - 1))} u.` },
          ],
          respuesta: [MV, ` = ${f(m)} u`],
        };
      },
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
  // Masa de una cadena CₓHᵧ escrita con subíndices (C₁₅H₃₁ → 15 · 12 + 31 · 1), para comprobar la grasa con su fórmula.
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const masaCadena = cad => { const n = t => Number([...t].map(c => SUB.indexOf(c)).join('')); const [, c, h] = cad.match(/^C([₀-₉]+)H([₀-₉]+)$/); return 12 * n(c) + n(h); };
  // Animación de la grasa: los tres ácidos llegan por la derecha, uno por uno (la misma línea de tiempo que la cadena).
  // Mientras su unión avanza, el ácido (C, su C=O y su cadena) está corrido hasta 1 unidad a la derecha; al tocarse,
  // aparece la unión éster verde y su agua sale hacia la derecha. Un ancla invisible fija el ancho del encuadre.
  function grasaViva(k, t) {
    const g = grasa(k, { aguas: false }), s = avanceU(t, 3);
    for (let i = 0; i < 3; i++) {
      const q = qU(s, i), dx = 1.0 * (1 - suave(q / TOCA));
      for (const a of g.atomos) if (a.id === `c${i}` || a.id === `k${i}` || a.id === `d${i}`) a.x += dx;
      if (q < TOCA - 1e-9) g.enlaces = g.enlaces.filter(e => !(e.a === `o${i}` && e.b === `c${i}`));
      else g.textos.push({ x: 5.3 + 0.6 * suave((q - TOCA) / (1 - TOCA)), y: i * FILA, t: '+ H₂O', color: 'h' });
    }
    g.textos.push({ x: 5.9, y: 0, t: '', hasta: -1 });
    return mol(Object.assign(g, { escala: 32, alto: 240 }));
  }
  const lipidos = {
    id: 'grasas-trigliceridos',
    titulo: 'Una grasa: glicerol y tres ácidos',
    temas: ['Lípidos'],
    pieza: 'quim-molecula',
    // Lee (fase 2): las piezas de una grasa, sin decir cuántas aguas salen (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Grasas y aceites', texto: 'La manteca y el sebo son sólidos; el aceite de cocina es líquido. Todos son lípidos: no se mezclan con el agua y guardan mucha energía en poco espacio.' },
        { titulo: 'Las piezas', texto: 'Una grasa se arma con dos tipos de piezas: un glicerol, C₃H₈O₃, que tiene tres grupos OH, y ácidos grasos, cadenas largas de carbono con un grupo COOH en la punta.' },
        { titulo: 'Saturado o no', texto: 'Un ácido graso saturado solo tiene enlaces simples entre sus carbonos. Si tiene un doble enlace cis, su cadena hace un codo y se acomoda peor junto a las otras.' },
        { titulo: 'Qué mirar', texto: 'Cambia el ácido graso y sigue la lectura: cuántos ésteres se forman, si la grasa es sólida o líquida y cuánto cambia la masa.' },
      ],
    },
    juega: {
      consigna: 'En cámara lenta, cada ácido graso se une a un OH del glicerol y suelta un agua. Cambia el ácido: ¿trae doble enlace?',
      voz: 'Cuenta las uniones del glicerol.',
      controles: [{ id: 'k', etiqueta: 'Ácido graso', opciones: ['palmitico', 'estearico', 'oleico'].map(k => ({ valor: k, texto: ACIDOS[k].nombre })) }, TT],
      dibujo: val => grasaViva(val.k, val.t),
      // Sin arrastre: se cambia de ácido graso (otra molécula); el codo cis no está dibujado como geometría que se
      // pueda doblar, solo nombrado. La mesa «Tres ácidos distintos» del laboratorio los combina. La masa del momento
      // es la de las piezas menos el agua que ya salió.
      lectura: val => { const u = formadas(val.t, 3), a = ACIDOS[val.k]; return [`${f(val.t, 1)} s: ${u} de 3 ésteres · ${a.sat ? 'saturada (sólida)' : 'insaturada (líquida)'} · `, MV, ` = ${f(GLIC + 3 * a.M - AGUA * u)} u`]; },
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
      ecuacion: [MV, ' = ', { llave: ['92'], nota: 'glicerol' }, ' + ', { llave: ['3 · ', { sub: [MV, 'ácido'] }], nota: 'tres ácidos', color: 'c-o' }, ' − ', { llave: ['3 · 18'], nota: 'tres aguas', color: 'c-h' }],
      condicion: 'los lípidos son diversos: ceras, fosfolípidos y colesterol no son triglicéridos. Una grasa no es un polímero.',
      voz: 'Glicerol, tres ácidos, tres aguas.',
    },
    // Así se resuelve (fase 2): la misma cuenta de «Ahora tú» (masaGrasa), con otras semillas. El sentido la rehace con
    // la fórmula: C₃H₅ más tres grupos COO–cadena, con la cadena de ACIDOS leída átomo por átomo.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), k = r.de(Object.keys(ACIDOS)), a = ACIDOS[k], mm = masaGrasa(k);
        const cad = masaCadena(a.cad), coo = 12 + 2 * 16, c3h5 = 3 * 12 + 5;
        const figura = aguas => mol(Object.assign(grasa(k, { aguas }), { escala: 32, alto: 240 }));
        return {
          enunciado: ['Una grasa se forma con glicerol (92 u) y tres moléculas de ácido ', `${a.nombre} (${f(a.M)} u). ¿Cuál es su masa molecular `, MV, '?'],
          dibujo: figura(false),
          pasos: [
            { tipo: 'pide', texto: ['Piden la masa molecular ', MV, ` de la grasa: glicerol con tres ácidos ${a.nombre}s.`] },
            { tipo: 'datos', texto: `Glicerol: 92 u. Cada ácido ${a.nombre}: ${f(a.M)} u. Cada agua: 18 u.` },
            { tipo: 'regla', texto: 'Cada OH del glicerol se une a un ácido por un enlace éster, y cada unión suelta un agua. Tres uniones, tres aguas.' },
            { tipo: 'cuentas', texto: 'Sumo las cuatro piezas y resto las tres aguas.',
              ecuacion: [MV, ` = 92 + 3 · ${f(a.M)} − 3 · 18 = ${f(GLIC + 3 * a.M)} − 54 = ${f(mm)} u`], dibujo: figura(true) },
            { tipo: 'sentido', texto: `Con la fórmula: C₃H₅ pesa ${f(c3h5)} u y cada grupo COO–${a.cad}, ${f(coo + cad)} u. ${f(c3h5)} + 3 · ${f(coo + cad)} = ${f(c3h5 + 3 * (coo + cad))} u. Cuadra.` },
          ],
          respuesta: [MV, ` = ${f(mm)} u`],
        };
      },
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
  const peptidoVivo = val => mol(cadenaViva(SEC.slice(0, Math.round(val.n)), val.t, { paso: 1.5 }));
  const proteinas = {
    id: 'peptidos-plegado',
    titulo: 'Desplegar no es cortar',
    temas: ['Aminoácidos y proteínas'],
    pieza: 'quim-molecula',
    // Lee (fase 2): contexto, bloques y plegado. No dice qué hace el calor con la cadena (eso se predice con el huevo).
    lee: {
      tarjetas: [
        { titulo: 'Proteínas en tu plato', texto: 'La quinua, el huevo, el queso y el cuy son ricos en proteínas. Tu cuerpo las usa para armar músculos, enzimas y defensas.' },
        { titulo: 'Bloques y enlaces', texto: 'Una proteína es una cadena de aminoácidos. Entre dos aminoácidos vecinos hay un enlace peptídico: en el juego es la línea verde entre dos bloques.' },
        { titulo: 'La forma importa', texto: 'Una proteína larga no queda estirada: se pliega en una forma propia. De esa forma depende el trabajo que hace en el cuerpo.' },
        { titulo: 'Qué mirar', texto: 'Cambia el número de aminoácidos y cuenta, en cada caso, cuántos bloques, cuántos enlaces verdes y cuántas aguas hay.' },
      ],
    },
    juega: {
      consigna: 'En cámara lenta, los aminoácidos se unen uno por uno. Cuenta los enlaces peptídicos (verdes) y las aguas que salen.',
      voz: 'Compara el número de bloques con el de enlaces.',
      controles: [{ id: 'n', etiqueta: 'n aminoácidos', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 4, unidad: '', decimales: 0 }, TT],
      dibujo: val => peptidoVivo(val),
      lectura: val => { const u = formadas(val.t, val.n - 1); return [`${f(val.t, 1)} s · `, nV, ` = ${val.n}: ${pl(u, 'enlace peptídico', 'enlaces peptídicos')}, ${pl(u, 'agua', 'aguas')}`]; },
      minimo: 3,
      // Se agarra el último aminoácido y se tira para alargar la cadena; responden los enlaces verdes y las aguas.
      arrastres: [{ id: 'ultimo', etiqueta: 'último aminoácido: tira para alargar', color: 'c-i',
        donde: val => sobre(peptidoVivo(val), `u${Math.round(val.n) - 1}`),
        mover: (pt, val) => ({ n: cercana([2, 3, 4, 5, 6], v => sobre(peptidoVivo(v), `u${v.n - 1}`), pt, val, 'n') }) }],
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
      ecuacion: ['enlaces = ', nV, ' − 1', '   ·   ', MV, ' = ', { llave: ['suma'], nota: 'los aminoácidos' }, ' − ', { llave: ['18 · (', nV, ' − 1)'], nota: 'aguas que salen', color: 'c-h' }],
      condicion: 'una sola cadena lineal; los puentes disulfuro no son enlaces peptídicos. Desnaturalizada no significa digerida ni sin valor.',
      voz: 'Forma y cadena son dos preguntas distintas.',
    },
    // Así se resuelve (fase 2): los mismos dos casos de «Ahora tú» (contar enlaces o la masa de un tripéptido), con
    // otras semillas y en el orden contrario.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const n = r.ent(3, 40);
          return {
            enunciado: ['Una cadena lineal tiene ', nV, ` = ${n} aminoácidos. ¿Cuántos enlaces peptídicos tiene?`],
            pasos: [
              { tipo: 'pide', texto: `Piden cuántos enlaces peptídicos hay en una cadena lineal de ${n} aminoácidos.` },
              { tipo: 'datos', texto: ['Hay ', nV, ` = ${n} bloques en fila, sin cerrarse en anillo.`] },
              { tipo: 'regla', texto: 'Cada enlace peptídico une dos aminoácidos vecinos. En una fila abierta hay una unión menos que bloques.' },
              { tipo: 'cuentas', texto: 'Resto uno al número de aminoácidos.', ecuacion: [`enlaces = ${n} − 1 = ${n - 1}`] },
              { tipo: 'sentido', texto: `Pruébalo chico: 3 aminoácidos en fila tienen 2 enlaces. Con ${n}, salen también ${n - 1} aguas al formarse.` },
            ],
            respuesta: `${n - 1} enlaces peptídicos`,
          };
        }
        const sec = r.mezcla(Object.keys(AA)).slice(0, 3), suma = sec.reduce((x, k) => x + AA[k], 0), mm = suma - 2 * AGUA;
        return {
          enunciado: ['El tripéptido ', `${sec.join('–')} se forma con ${sec.map(k => `${k} (${AA[k]} u)`).join(', ')}. ¿Cuál es su masa molecular `, MV, '?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden la masa molecular ', MV, ` del tripéptido ${sec.join('–')}.`] },
            { tipo: 'datos', texto: `Las masas de los tres aminoácidos: ${sec.map(k => `${k}, ${AA[k]} u`).join('; ')}. Cada agua: 18 u.` },
            { tipo: 'regla', texto: 'Tres aminoácidos en fila forman dos enlaces peptídicos, y cada enlace suelta un agua. Se suma todo y se restan las aguas.' },
            { tipo: 'cuentas', texto: 'Sumo los tres y resto dos aguas.', ecuacion: [MV, ` = ${sec.map(k => AA[k]).join(' + ')} − 2 · 18 = ${suma} − 36 = ${f(mm)} u`] },
            { tipo: 'sentido', texto: `De vuelta: si se hidroliza, entran dos aguas. ${f(mm)} + 36 = ${f(mm + 2 * AGUA)} u, justo la suma de los tres.` },
          ],
          respuesta: [MV, ` = ${f(mm)} u`],
        };
      },
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
  // Animación del juego: la vitamina se agita con aceite y agua y se deja en reposo (modelo cualitativo, cámara lenta).
  // Ocho moléculas empiezan repartidas, cuatro en cada capa; las cuatro de la capa que no la disuelve cruzan, una por
  // una (cada una en 1 s, desde 0,6 + 1,6·m s), a la capa que sí: «lo parecido disuelve a lo parecido». Todas cruzan
  // porque estas vitaminas son mucho más solubles en una fase que en la otra; el ritmo es ilustrativo, no medido.
  // Las dos capas van lado a lado (la pieza pone las cajas en fila); los títulos dicen cuál es cuál.
  const PP = () => Kit.piezas['quim-particulas'];
  const SITIOS = [[0.2, 0.18], [0.72, 0.3], [0.36, 0.52], [0.78, 0.76], [0.16, 0.84], [0.56, 0.12], [0.5, 0.7], [0.86, 0.5]];
  const cruce = (t, m) => (t === undefined ? 1 : suave((t - 0.6 - 1.6 * m) / 1.0));
  function reparto(k, t) {
    const destino = VIT[k][1] === 'lipo' ? 0 : 1, cajas = [{ titulo: 'Capa de aceite', forma: 'caja', particulas: [] }, { titulo: 'Capa de agua', forma: 'caja', particulas: [] }];
    const base = { atomos: { V: { estilo: 'lleno', r: 6 }, ac: { color: 'o', estilo: 'hueco', r: 3 }, ag: { color: 'i', estilo: 'hueco', r: 3 } }, especies: { vit: [['V', 0, 0]] }, alto: 150, separacion: 22, cajas };
    const g = PP().geometria(base), r0 = PP().region(cajas[0], g, 0), r1 = PP().region(cajas[1], g, 1);
    // Posición absoluta del sitio j en la caja c, llevada a coordenadas de la caja 0 (todas las vitaminas van en ella).
    const en = (c, [u, v]) => { const r = c ? r1 : r0; return [(r.x + r.w * u - r0.x) / r0.w, (r.y + r.h * v - r0.y) / r0.h]; };
    let m = 0, llegaron = 0;
    for (let j = 0; j < 8; j++) {
      const desde = j % 2;
      let x, y;
      if (desde === destino) { [x, y] = en(desde, SITIOS[j]); llegaron++; }
      else {
        const p = cruce(t, m++), a = en(desde, SITIOS[j]), b = en(destino, SITIOS[(j + 3) % 8]);
        x = a[0] + (b[0] - a[0]) * p; y = a[1] + (b[1] - a[1]) * p - 0.25 * Math.sin(Math.PI * p);
        if (p >= 0.5) llegaron++;
      }
      cajas[0].particulas.push({ e: 'vit', n: 1, x, y });
    }
    cajas[0].particulas.push({ e: 'ac', n: 12 }); cajas[1].particulas.push({ e: 'ag', n: 12 });
    const lugar = destino ? 'el agua' : 'el aceite';
    return { llegaron, lugar, dib: { datos: Object.assign(base, { agita: t === undefined ? undefined : t, agitaAmp: 1.5,
      alt: `Vitamina ${VIT[k][0]} agitada con aceite y agua: ${llegaron} de 8 moléculas ya están en ${lugar}, la capa que la disuelve.` }), estado: {} } };
  }
  const vitaminas = {
    id: 'vitaminas-solubilidad',
    titulo: 'Vitaminas: en grasa o en agua',
    temas: ['Vitaminas'],
    pieza: 'quim-cadena',
    // Lee (fase 2): qué es una vitamina y las dos palabras de la idea. No dice si dan energía (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Qué son', texto: 'Las vitaminas son moléculas orgánicas que el cuerpo necesita y no fabrica, o fabrica poco. Las sacamos de frutas, verduras, carnes, huevos y lácteos.' },
        { titulo: '¿Agua o aceite?', texto: 'Algunas sustancias se mezclan con el agua y otras con el aceite: piensa en las gotas de aceite que flotan en la sopa. A una vitamina le pasa lo mismo, según su estructura.' },
        { titulo: 'Dos palabras', texto: 'Liposoluble quiere decir que se disuelve en grasa; hidrosoluble, que se disuelve en agua. El camu camu de la selva es una de las frutas más ricas en vitamina C.' },
        { titulo: 'Qué mirar', texto: 'Elige una vitamina y espera: mira a qué caja, la del aceite o la del agua, se van sus moléculas.' },
      ],
    },
    juega: {
      consigna: 'Agitamos la vitamina con aceite y agua. En reposo, cada molécula se va a la capa que la disuelve (modelo, cámara lenta).',
      voz: 'La estructura decide dónde se disuelve.',
      pieza: 'quim-particulas',
      controles: [{ id: 'k', etiqueta: 'Vitamina', opciones: ['A', 'D', 'C', 'B12'].map(k => ({ valor: k, texto: VIT[k][0] })) },
        { id: 't', etiqueta: 't', min: 0, max: 8, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } }],
      dibujo: val => reparto(val.k, val.t).dib,
      // Sin arrastre, a propósito: llevar la vitamina a su capa sería responder con el gesto la pregunta de «Ahora
      // tú». Aquí las moléculas van solas y el alumno lee por qué. Las columnas de la predicción y «Mira» dicen la razón.
      lectura: val => { const x = reparto(val.k, val.t); return [`${f(val.t, 1)} s · vitamina ${VIT[val.k][0]}: ${x.llegaron} de 8 en ${x.lugar}`]; },
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
      ecuacion: [{ llave: ['A, D, E, K'], nota: 'en grasa', color: 'c-o' }, '   ·   ', { llave: ['C y grupo B'], nota: 'en agua', color: 'c-i' }],
      condicion: 'la solubilidad sale de la estructura: más zonas polares, más afinidad por el agua. Natural no significa inocuo en exceso.',
      voz: 'Dónde se disuelve dice dónde se guarda.',
    },
    // Así se resuelve (fase 2): la misma clasificación de «Ahora tú» (VIT), con otras semillas. Sin cuentas: «Lo aplico».
    resuelve: {
      generar(s) {
        const r = azar(s + 900), k = r.de(Object.keys(VIT)), [nom, tipo] = VIT[k], lipo = tipo === 'lipo';
        return {
          enunciado: `¿La vitamina ${nom} es liposoluble o hidrosoluble? ¿Dónde se guarda su exceso?`,
          pasos: [
            { tipo: 'pide', texto: `Piden si la vitamina ${nom} se disuelve en grasa o en agua, y qué pasa con lo que sobra.` },
            { tipo: 'datos', texto: lipo ? `La vitamina ${nom} es casi toda cadenas de carbono e hidrógeno: poco polar.` : `La vitamina ${nom} tiene varios grupos OH o N: es polar.` },
            { tipo: 'regla', texto: 'Lo parecido disuelve a lo parecido: lo poco polar, en grasa; lo polar, en agua. Así, A, D, E y K son liposolubles; C y el grupo B, hidrosolubles.' },
            { tipo: 'aplica', texto: lipo ? `La ${nom} es una de las A, D, E y K: es liposoluble.` : k === 'C' ? 'La C es polar: es hidrosoluble, como todo el grupo B.' : `La ${nom} es del grupo B, como la C: es hidrosoluble.`, dibujo: columnas(k) },
            { tipo: 'sentido', texto: lipo ? 'Cuadra con el cuerpo: lo que se disuelve en grasa se guarda en el tejido graso, y su exceso se acumula.' : 'Cuadra con el cuerpo: lo que se disuelve en agua no se guarda mucho, y el exceso sale con la orina.' },
          ],
          respuesta: lipo ? 'Liposoluble: el exceso se guarda en la grasa' : 'Hidrosoluble: el exceso sale con la orina',
        };
      },
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
  // Animación del juego: la molécula gira sola en el plano (15 s por vuelta). Afirmación de la pieza: la orientación en
  // el papel no cambia la molécula; el rasgo resaltado sigue ahí en cualquier giro. Gira alrededor del centro de sus
  // átomos; los rótulos quedan derechos. Alto fijo de 250 px para que quepa la cadena del carotenoide parada.
  const girar = (dib, g) => {
    if (g === undefined) return dib;
    const d = dib.datos, a = g * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
    const cx = d.atomos.reduce((x, q) => x + q.x, 0) / d.atomos.length, cy = d.atomos.reduce((x, q) => x + q.y, 0) / d.atomos.length;
    const rot = q => Object.assign({}, q, { x: cx + (q.x - cx) * c - (q.y - cy) * sn, y: cy + (q.x - cx) * sn + (q.y - cy) * c });
    // El nombre del rasgo no va bajo su marco (al girar caería sobre el anillo): va afuera, en la dirección del rasgo
    // desde el centro, y gira con la molécula.
    const lejos = Math.max(...d.atomos.map(q => Math.hypot(q.x - cx, q.y - cy)));
    const nombres = (d.resaltos || []).filter(r => r.texto).map(r => {
      const as = d.atomos.filter(q => r.atomos.includes(q.id)), mx = as.reduce((x, q) => x + q.x, 0) / as.length - cx, my = as.reduce((x, q) => x + q.y, 0) / as.length - cy, L = Math.hypot(mx, my) || 1;
      return { x: cx + mx / L * (lejos + 1.1), y: cy + my / L * (lejos + 1.1), t: r.texto, color: r.color, peso: 700 };
    });
    const resaltos = (d.resaltos || []).map(r => Object.assign({}, r, { texto: undefined }));
    return { datos: Object.assign({}, d, { atomos: d.atomos.map(rot), textos: [...(d.textos || []), ...nombres].map(rot), resaltos, escala: Math.min(d.escala, 32), alto: 250 }), estado: {} };
  };
  // Los casos de «Ahora tú» y «Así se resuelve»: qué rasgo tiene cada sustancia y su familia.
  const CASOS = [
    ['La cafeína del café tiene N dentro de sus anillos.', 'alcaloide'], ['La quinina de la cascarilla tiene un N en un anillo.', 'alcaloide'],
    ['La nicotina del tabaco tiene N en dos anillos.', 'alcaloide'], ['La quercetina de la cebolla tiene varios OH en anillos aromáticos.', 'polifenol'],
    ['La catequina del té tiene varios OH sobre anillos aromáticos.', 'polifenol'], ['Las antocianinas del maíz morado tienen varios OH en anillos aromáticos.', 'polifenol'],
    ['La bixina del achiote tiene una cadena larga de dobles alternados.', 'colorante'], ['El licopeno del tomate tiene una cadena larga de dobles alternados.', 'colorante'],
  ];
  const NOM_FAM = { alcaloide: 'Alcaloide', polifenol: 'Polifenol', colorante: 'Carotenoide (colorante de cadena)' };
  const naturales = {
    id: 'productos-naturales',
    titulo: 'Familias por estructura, no por origen',
    temas: ['Alcaloides y polifenoles', 'Colorantes naturales'],
    pieza: 'quim-molecula',
    // Lee (fase 2): qué es un producto natural y cómo se agrupan. No dice qué molécula tiene color (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Química de las plantas', texto: 'Las plantas fabrican miles de sustancias: la cafeína del café, el rojo del achiote, el morado del maíz de la chicha morada. Se llaman productos naturales.' },
        { titulo: 'Familias por estructura', texto: 'Los químicos no los agrupan por la planta de donde salen, sino por un rasgo de su estructura: un átomo, un grupo o una forma que se repite en toda la familia.' },
        { titulo: 'Dobles alternados', texto: 'En una cadena de dobles alternados, los enlaces van doble, simple, doble, simple… En el juego, cada doble enlace se ve como dos rayas entre dos átomos.' },
        { titulo: 'Qué mirar', texto: 'Elige cada familia y busca el rasgo marcado en el dibujo. La molécula gira, pero su rasgo sigue en su sitio.' },
      ],
    },
    juega: {
      consigna: 'Cada familia tiene un rasgo de estructura. La molécula gira sola: el dibujo cambia, la molécula no. Elige una familia.',
      voz: 'Busca el rasgo que comparten, no de dónde vienen.',
      controles: [{ id: 'k', etiqueta: 'Familia', opciones: [{ valor: 'alcaloide', texto: 'Alcaloide' }, { valor: 'polifenol', texto: 'Polifenol' }, { valor: 'colorante', texto: 'Carotenoide' }] },
        { id: 'g', etiqueta: 'giro', min: 0, max: 360, paso: 15, inicio: 0, unidad: '°', decimales: 0, auto: { velocidad: 24 } }],
      dibujo: val => girar(RASGO[val.k].fig(), val.g),
      // Sin arrastre: las tres familias son moléculas distintas con rasgos distintos (N en anillo, OH, dobles); se
      // eligen. La mesa «Dobles alternados y color» del laboratorio sí desliza el punto por la gráfica.
      lectura: val => [`${RASGO[val.k].lee} Giro: ${f(val.g, 0)}°.`],
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
    // Hallazgo 9: dos representaciones a propósito. El juego muestra el rasgo de estructura (quim-molecula); la
    // predicción y «Mira» pasan a la gráfica λ contra dobles alternados porque el color es una medida, no un dibujo.
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
      ecuacion: ['más dobles alternados → mayor ', { llave: [{ v: 'c-d', t: 'λ' }], nota: 'longitud de onda', color: 'c-d' }],
      condicion: 'son familias por estructura, no por origen. Natural no significa inocuo: la nicotina es un alcaloide tóxico.',
      voz: 'Primero el rasgo de estructura; el origen no clasifica.',
    },
    // Así se resuelve (fase 2): la misma clasificación de «Ahora tú» (CASOS y RASGO), con otras semillas. «Lo aplico».
    resuelve: {
      generar(s) {
        const r = azar(s + 900), [txt, fam] = CASOS[r.ent(0, CASOS.length - 1)];
        const sust = txt.split(/ tienen? /)[0], varias = /^Las /.test(sust);
        const cual = (sust[0].toLowerCase() + sust.slice(1)).replace(/^el /, 'del ').replace(/^(la|las) /, 'de $1 ');
        const rasgo = { alcaloide: 'N dentro de un anillo', polifenol: 'varios OH sobre anillos aromáticos', colorante: 'una cadena larga de dobles alternados' }[fam];
        const cuadra = { alcaloide: 'Cuadra: como otros alcaloides, tiene un efecto fuerte en el cuerpo, aunque venga de una planta.',
          polifenol: 'Cuadra: como muchos polifenoles, da color o un sabor astringente. El origen no decidió la familia.',
          colorante: 'Cuadra: tiene color, como el β-caroteno de la zanahoria. El origen no decidió la familia.' }[fam];
        return {
          enunciado: `${txt} ¿A qué familia de productos naturales pertenece?`,
          dibujo: RASGO[fam].fig(),
          pasos: [
            { tipo: 'pide', texto: `Piden la familia ${cual}: alcaloide, polifenol o carotenoide.` },
            { tipo: 'datos', texto: `El rasgo que da el enunciado: ${rasgo}.` },
            { tipo: 'regla', texto: 'La familia la decide un rasgo de estructura: N en un anillo es alcaloide; varios OH en anillos aromáticos, polifenol; muchos dobles alternados, carotenoide.' },
            { tipo: 'aplica', texto: `${varias ? 'Tienen' : 'Tiene'} ${rasgo}: ${varias ? 'son' : 'es'} ${NOM_FAM[fam].toLowerCase()}.` },
            { tipo: 'sentido', texto: cuadra },
          ],
          respuesta: NOM_FAM[fam],
        };
      },
    },
    ahoraTu: {
      voz: 'Busca el rasgo de su familia.',
      generar(s) {
        const r = azar(s), [txt, fam] = CASOS[s % CASOS.length], nom = NOM_FAM;
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


  // ---------- Laboratorio ----------
  // Mesa 1: un polímero de 1 a 8 bloques (glucosas o aminoácidos), abierto o cerrado en anillo. El caso raro que la
  // idea no deja probar: en anillo hay tantas uniones como bloques (las ciclodextrinas son anillos de 6 a 8 glucosas).
  // Las masas se suman bloque por bloque y se resta 18 por unión.
  const BLOQUES = { glc: { nombre: 'glucosas', rot: () => 'Glc', M: () => GLU }, aa: { nombre: 'aminoácidos', rot: i => SEC[i % SEC.length], M: i => AA[SEC[i % SEC.length]] } };
  function polimero(val) {
    const b = BLOQUES[val.b], n = val.n, anillo = val.forma === 'anillo' && n >= 3, uniones = anillo ? n : n - 1;
    const rot = Array.from({ length: n }, (_, i) => b.rot(i)), suma = rot.reduce((acc, _, i) => acc + b.M(i), 0), masa = suma - AGUA * uniones;
    // Animación: las uniones se forman una por una con la línea de tiempo de las ideas (t). En la cadena, los bloques
    // bajan a su sitio; en el anillo, quedan en su lugar y los enlaces aparecen en orden: el último cierra la vuelta.
    const u = formadas(val.t, uniones);
    let d;
    if (anillo) {
      const R = 1.6 / (2 * Math.sin(Math.PI / n));
      const atomos = rot.map((t, i) => ({ id: `u${i}`, t, x: R * Math.cos(2 * Math.PI * i / n - Math.PI / 2), y: R * Math.sin(2 * Math.PI * i / n - Math.PI / 2), color: 'i' }));
      const enlaces = rot.slice(0, u).map((_, i) => ({ a: `u${i}`, b: `u${(i + 1) % n}`, orden: 1, color: 'd' }));
      d = { atomos, enlaces, textos: [{ x: 0, y: 0, t: `${u} H₂O`, color: 'h' }] };
    } else d = cadenaViva(rot, val.t);
    const aviso = val.forma === 'anillo' && n < 3 ? [{ x: (n - 1) * 0.8, y: -1.1, t: 'un anillo pide 3 bloques', color: 'h' }] : [];
    d.textos = d.textos.concat(aviso);
    return { dib: mol(Object.assign(d, { escala: 25, alto: 230 })), n, uniones, masa, anillo, nombre: b.nombre, u, masaAhora: suma - AGUA * u };
  }
  // En la cadena, la manija va arriba del último bloque; en el anillo, 22 px hacia afuera del centro (160, 115).
  const manijaPol = val => {
    const c = polimero(val), q = sobre(c.dib, `u${c.n - 1}`, c.anillo ? 0 : -22);
    if (!c.anillo) return q;
    const vx = q.x - 160, vy = q.y - 115, L = Math.hypot(vx, vy);
    return { x: q.x + 22 * vx / L, y: q.y + 22 * vy / L };
  };
  // Mesa 2: una grasa con tres ácidos que se eligen por separado (la idea solo deja tres iguales).
  const grasaMixta = val => {
    const ks = [val.a1, val.a2, val.a3], m = GLIC + ks.reduce((x, k) => x + ACIDOS[k].M, 0) - 3 * AGUA;
    const ins = ks.filter(k => !ACIDOS[k].sat).length;
    return { ks, m, ins };
  };
  function dibujoMixta(val) {
    const { ks } = grasaMixta(val), at = [], en = [], tx = [];
    ['CH₂', 'CH', 'CH₂'].forEach((t, i) => {
      const y = i * FILA, a = ACIDOS[ks[i]];
      at.push({ id: `g${i}`, t, x: 0, y }, { id: `o${i}`, t: 'O', x: 1.15, y, color: 'h' }, { id: `c${i}`, t: 'C', x: 2.3, y }, { id: `k${i}`, t: a.cad, x: 3.9, y }, { id: `d${i}`, t: 'O', x: 2.3, y: y - 0.85, color: 'h' });
      en.push({ a: `g${i}`, b: `o${i}`, orden: 1 }, { a: `o${i}`, b: `c${i}`, orden: 1, color: 'd' }, { a: `c${i}`, b: `k${i}`, orden: 1 }, { a: `c${i}`, b: `d${i}`, orden: 2 });
      if (i) en.push({ a: `g${i - 1}`, b: `g${i}`, orden: 1 });
      tx.push(a.sat ? { x: 6.5, y, t: 'saturado' } : { x: 6.5, y, t: 'doble cis', color: 'd' });
    });
    return mol({ atomos: at, enlaces: en, textos: tx, escala: 30, alto: 230 });
  }
  // Mesa 3: el punto se desliza por las mediciones de la gráfica λ contra dobles alternados (no se interpola).
  const puntoAbs = val => { const [k, l] = ABS.find(a => String(a[0]) === val.d); const g = Kit.piezas.ejes.geometria(ejesAbs([]).datos); return { x: g.X(k), y: g.Y(l) }; };

  return {
    unidad: 'quimica.biomoleculas-y-productos-naturales',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-molecula.js', '/nucleo/kit/piezas/quim-cadena.js', '/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Saber que una proteína está hecha de aminoácidos no dice en qué orden van. Desde 1943, Frederick Sanger cortó la insulina con reacciones controladas, separó los trozos y los identificó, hasta reconstruir su secuencia; lo contó en su conferencia Nobel de 1958. Romper enlaces, cambiar el plegado y medir una función resultaron ser preguntas distintas.',
      pregunta: '¿Cómo sabrías el orden de las piezas de una cadena que no ves?',
      fuente: { titulo: 'F. Sanger, conferencia Nobel (1958)', url: 'https://www.nobelprize.org/prizes/chemistry/1958/sanger/lecture/' },
    },
    // Laboratorio (docs/teoria.md §4b): sin preguntas. La primera mesa es más rica que los juegos: dos tipos de
    // bloque, hasta 8 y el anillo. La segunda arma una grasa con tres ácidos distintos; la tercera desliza el punto
    // por las mediciones de color. La lectura dice entradas y resultado, para que un caso guardado se lea solo.
    glosario: [
      { termino: 'monosacárido', def: 'Azúcar simple que no se parte en azúcares más chicos, como la glucosa o la fructosa.',
        formas: ['monosacárido', 'monosacáridos'], ejemplo: 'Glucosa, C₆H₁₂O₆: 6 · 12 + 12 + 6 · 16 = 180 u.', ver: ['enlace glucosídico'] },
      { termino: 'enlace glucosídico', def: 'Unión entre dos azúcares a través de un oxígeno; al formarse suelta una molécula de agua.',
        formas: ['enlace glucosídico', 'enlaces glucosídicos'], ejemplo: 'Dos glucosas: 180 + 180 − 18 = 342 u, la maltosa.', ver: ['hidrólisis', 'monosacárido'] },
      { termino: 'hidrólisis', def: 'Ruptura de un enlace usando una molécula de agua: lo inverso de la unión que la soltó.',
        ejemplo: 'Maltosa + H₂O → dos glucosas: 342 + 18 = 360 u.', ver: ['enlace glucosídico', 'enlace peptídico'] },
      { termino: 'polímero', def: 'Molécula grande hecha de muchas unidades pequeñas, iguales o parecidas, unidas en cadena.',
        ejemplo: 'Almidón y celulosa: cadenas de cientos de glucosas.', ver: ['monosacárido', 'proteína'] },
      { termino: 'ácido graso', def: 'Ácido carboxílico de cadena larga; en las grasas comunes suele tener de 12 a 18 carbonos.',
        formas: ['ácido graso', 'ácidos grasos'], ejemplo: 'Ácido palmítico, C₁₅H₃₁COOH: 256 u.', ver: ['ácido carboxílico', 'triglicérido'] },
      { termino: 'triglicérido', def: 'Grasa formada por glicerol unido a tres ácidos grasos; cada unión suelta un agua.',
        formas: ['triglicérido', 'triglicéridos'], ejemplo: 'Glicerol y tres esteáricos: 92 + 3 · 284 − 3 · 18 = 890 u.', ver: ['ácido graso', 'éster'] },
      { termino: 'glicerol', def: 'Alcohol de tres carbonos con tres grupos OH, C₃H₈O₃; es la base de las grasas.',
        ejemplo: '3 · 12 + 8 · 1 + 3 · 16 = 92 u.', ver: ['triglicérido', 'alcohol'] },
      { termino: 'lípido', formas: ['lípido', 'lípidos'], def: 'Biomolécula que no se mezcla con el agua, como las grasas, los aceites, las ceras y el colesterol.',
        ver: ['triglicérido', 'ácido graso'] },
      { termino: 'aminoácido', def: 'Molécula con un grupo amino, NH₂, y un grupo ácido, COOH: el bloque de las proteínas.',
        formas: ['aminoácido', 'aminoácidos'], ejemplo: 'Glicina, NH₂CH₂COOH: 75 u.', ver: ['enlace peptídico'] },
      { termino: 'enlace peptídico', def: 'Unión C(=O)–NH entre dos aminoácidos; al formarse suelta una molécula de agua.',
        formas: ['enlace peptídico', 'enlaces peptídicos'], ejemplo: 'Dos glicinas: 75 + 75 − 18 = 132 u.', ver: ['aminoácido', 'amida'] },
      { termino: 'proteína', def: 'Cadena larga de aminoácidos unidos por enlaces peptídicos, plegada en una forma propia.',
        ver: ['desnaturalización'] },
      { termino: 'desnaturalización', def: 'Pérdida del plegado de una proteína por calor, ácido o sal, sin cortar sus enlaces peptídicos.',
        formas: ['desnaturalización', 'desnaturalizar', 'desnaturalizan', 'desnaturalizada', 'desnaturalizado'],
        ejemplo: 'La clara del huevo frito pasa de transparente a blanca.', ver: ['hidrólisis'] },
      { termino: 'liposoluble', def: 'Que se disuelve en grasas y no en agua, por ser casi toda cadenas de C e H.',
        formas: ['liposoluble', 'liposolubles'], ejemplo: 'Vitaminas A, D, E y K: se guardan en la grasa del cuerpo.', ver: ['hidrosoluble'] },
      { termino: 'hidrosoluble', def: 'Que se disuelve en agua, por tener varios grupos OH u otros grupos polares.',
        formas: ['hidrosoluble', 'hidrosolubles'], ejemplo: 'Vitamina C: el exceso sale por la orina.', ver: ['liposoluble'] },
      { termino: 'alcaloide', def: 'Sustancia de plantas con nitrógeno, casi siempre dentro de un anillo, de efecto fuerte en el cuerpo.',
        ejemplo: 'Cafeína del café; quinina de la cascarilla.', ver: ['polifenol'] },
      { termino: 'polifenol', def: 'Sustancia de plantas con varios OH unidos a anillos aromáticos; muchos dan color o sabor astringente.',
        ejemplo: 'Las antocianinas del maíz morado.', ver: ['fenol', 'alcaloide'] },
      { termino: 'carotenoide', def: 'Colorante natural de cadena larga con muchos dobles enlaces alternados; absorbe luz azul y se ve naranja.',
        ejemplo: 'β-caroteno: 11 dobles, absorbe a 455 nm.', ver: ['polifenol'] },
    ],
    laboratorio: [
      {
        id: 'polimero', titulo: 'Cadena o anillo de bloques', pieza: 'quim-molecula',
        consigna: 'En cámara lenta, los bloques se unen solos. Arrastra el último para alargar; ciérralo en anillo y cuenta uniones y aguas otra vez.',
        controles: [
          { id: 'b', etiqueta: 'Bloques', opciones: [{ valor: 'glc', texto: 'Glucosas' }, { valor: 'aa', texto: 'Aminoácidos' }] },
          { id: 'n', etiqueta: 'n', color: 'c-i', min: 1, max: 8, paso: 1, inicio: 4, unidad: '', decimales: 0 },
          { id: 'forma', etiqueta: 'Forma', opciones: [{ valor: 'abierta', texto: 'Cadena' }, { valor: 'anillo', texto: 'Anillo' }] },
          TT,
        ],
        dibujo: val => polimero(val).dib,
        // La masa del momento: los bloques menos el agua que ya salió; con la molécula armada, la del polímero.
        lectura: val => { const c = polimero(val); return [`${f(val.t, 1)} s · ${c.n} ${c.nombre} · ${c.u} de ${pl(c.uniones, 'unión', 'uniones')} · `, MV, ` = ${f(c.masaAhora)} u`]; },
        // Se agarra el último bloque: en la cadena, más a la derecha es más largo; en el anillo, más lejos del centro
        // es un anillo más grande. Responden las uniones, las aguas y la masa.
        arrastres: [{ id: 'ultimo', etiqueta: 'último bloque: arrástralo para alargar', color: 'c-i',
          donde: manijaPol,
          mover: (pt, val) => {
            const radio = q => Math.hypot(q.x - 160, q.y - 115);
            if (val.forma === 'anillo' && val.n >= 3) return { n: cercana([3, 4, 5, 6, 7, 8], manijaPol, pt, val, 'n', (q, p) => Math.abs(radio(q) - radio(p))) };
            return { n: cercana([1, 2, 3, 4, 5, 6, 7, 8], manijaPol, pt, val, 'n') };
          } }],
        invitaciones: [
          { texto: 'Arma el disacárido de glucosa: dos glucosas y una sola agua.',
            logrado: val => { const c = polimero(val); return val.b === 'glc' && c.n === 2 && c.uniones === 1; },
            bien: '180 + 180 − 18 = 342 u. ¿Cuántas aguas suelta con tres?' },
          { texto: 'Arma un polímero que suelte exactamente 5 aguas.',
            logrado: val => polimero(val).uniones === 5,
            bien: 'Cadena de 6 o anillo de 5: se cuentan uniones, no bloques.' },
          { texto: 'Guarda una cadena y un anillo con los mismos bloques: compara masas.',
            logrado: (val, guardados) => { const c = polimero(val);
              return guardados.some(g => g.b === val.b && g.n === val.n && polimero(g).anillo !== c.anillo); },
            bien: 'El anillo suelta una agua más: pesa 18 u menos.' },
          { texto: 'Busca el polímero más pesado que se puede armar aquí.',
            logrado: val => { const m = polimero(val).masa;
              return ['glc', 'aa'].every(b => ['abierta', 'anillo'].every(forma => polimero({ b, n: 8, forma }).masa <= m + 1e-9)); },
            bien: 'Ocho bloques en cadena: la masa crece, pero cada unión resta 18 u.' },
          { texto: 'Pausa una cadena justo cuando ya salieron dos aguas y falta al menos otra.',
            logrado: val => { const c = polimero(val); return !c.anillo && c.u === 2 && c.uniones > 2; },
            bien: 'Dos uniones hechas, dos aguas fuera: la masa ya bajó 36 u.',
            pista: 'Mira la lectura: pausa cuando diga «2 de» y ajusta t con − y +.' },
          { texto: 'Pide un anillo que no se puede cerrar.',
            logrado: val => val.forma === 'anillo' && !polimero(val).anillo,
            bien: 'Con menos de tres bloques no hay vuelta que cerrar.' },
        ],
      },
      {
        id: 'grasa-mixta', titulo: 'Tres ácidos distintos', pieza: 'quim-molecula',
        consigna: 'Elige un ácido graso para cada OH del glicerol. Mira la masa y cuántas cadenas llevan un doble cis.',
        controles: ['a1', 'a2', 'a3'].map((id, i) => ({ id, etiqueta: `Ácido ${i + 1}`, opciones: Object.keys(ACIDOS).map(k => ({ valor: k, texto: ACIDOS[k].nombre })) })),
        dibujo: dibujoMixta,
        lectura: val => { const g = grasaMixta(val); return [`${g.ins} de 3 con doble cis`, '   ·   ', MV, ` = ${f(g.m)} u`]; },
        // Sin arrastre: cada cadena se elige de una lista de ácidos; no hay una variable continua que agarrar.
        invitaciones: [
          { texto: 'Arma un triglicérido con sus tres cadenas insaturadas, como un aceite.',
            logrado: val => grasaMixta(val).ins === 3,
            bien: 'Tres codos cis: las cadenas no se apilan y queda líquida.' },
          { texto: 'Busca el triglicérido más liviano posible.',
            logrado: val => grasaMixta(val).m === GLIC + 3 * Math.min(...Object.values(ACIDOS).map(a => a.M)) - 3 * AGUA,
            bien: 'Tres cadenas cortas: menos carbonos, menos masa.' },
          { texto: 'Consigue que solo una de las tres cadenas lleve un doble cis.',
            logrado: val => grasaMixta(val).ins === 1,
            bien: 'Un solo codo ya estorba el apilado de las cadenas.' },
          { texto: 'Guarda dos grasas con la misma masa y ácidos distintos.',
            logrado: (val, guardados) => { const a = grasaMixta(val), ka = a.ks.slice().sort().join();
              return guardados.some(g => { const b = grasaMixta(g); return b.m === a.m && b.ks.slice().sort().join() !== ka; }); },
            bien: 'Igual masa, otros ácidos: la balanza sola no dice qué grasa es.' },
        ],
      },
      {
        id: 'dobles-y-color', titulo: 'Dobles alternados y color', pieza: 'ejes',
        consigna: 'Desliza el punto por las moléculas medidas. Mira cuándo la luz absorbida entra en la franja visible.',
        controles: [{ id: 'd', etiqueta: 'Molécula', opciones: ABS.map(([k, , nom]) => ({ valor: String(k), texto: nom })) }],
        dibujo: val => { const [k, l, nom] = ABS.find(a => String(a[0]) === val.d); return ejesAbs([{ x: k, y: l, color: 'd', rotulo: `${nom}: ${l} nm`, guias: true }]); },
        lectura: val => { const [k, l, nom] = ABS.find(a => String(a[0]) === val.d); return [`${nom}: ${k} ${k > 1 ? 'dobles' : 'doble'} → `, { v: 'c-d', t: 'λ' }, ` = ${l} nm, ${l >= 400 ? 'visible: tiene color' : 'ultravioleta: incoloro'}`]; },
        // El punto se desliza por las mediciones: cae en la molécula de número de dobles más cercano (no interpola).
        arrastres: [{ id: 'medida', etiqueta: 'punto de la medición', color: 'c-d',
          donde: puntoAbs,
          mover: (pt, val) => ({ d: cercana(ABS.map(a => String(a[0])), puntoAbs, pt, val, 'd', (q, p) => Math.abs(q.x - p.x)) }) }],
        invitaciones: [
          { texto: 'Busca la primera molécula de la lista que ya tiene color.',
            logrado: val => { const [k, l] = ABS.find(a => String(a[0]) === val.d); return l >= 400 && ABS.every(([k2, l2]) => k2 >= k || l2 < 400); },
            bien: 'Once dobles alternados: absorbe azul y la vemos naranja.' },
          { texto: 'Encuentra la molécula incolora que absorbe la λ más larga.',
            logrado: val => { const [, l] = ABS.find(a => String(a[0]) === val.d); return l < 400 && ABS.every(([, l2]) => l2 >= 400 || l2 <= l); },
            bien: 'Sigue en el ultravioleta: le falta cadena para tener color.' },
          { texto: 'Guarda dos moléculas y compara cuánto sube λ con los dobles.',
            logrado: (val, guardados) => guardados.some(g => g.d !== val.d),
            bien: 'Más dobles alternados, más larga la luz que absorbe.' },
        ],
      },
    ],
    ideas: [azucares, lipidos, proteinas, vitaminas, naturales],
  };
});
