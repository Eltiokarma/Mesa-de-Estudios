/*
 * Teoría de «Certezas» (razonamiento-matematico.certezas). Molde: docs/teoria.md y docs/molde-unidad.md. Etapa 7 del
 * plan de calidad (docs/plan-calidad.md §7), cuarta y última unidad de la rama «Lógica», después de Razonamiento
 * deductivo, Ordenamiento de información y Verdades y mentiras. Propuesta: docs/etapa7/propuesta-razonamiento-matematico.md
 * (Gerson delegó el criterio y revisa después). Seis ideas: 1. peor-caso «Prepara la peor suerte» (la tómbola de la
 * kermés) · 2. palomar «Más objetos que casilleros» (la tómbola y el calendario de cumpleaños) · 3. una-de-cada «Una de
 * cada clase» (la tómbola y el cajón de los guantes) · 4. condicion «Números que cumplen algo» (el bingo) · 5. parejas
 * «Parejas y sumas» (las cartas de la feria) · 6. llaves «Llaves y candados» (los casilleros del gimnasio). Los ids
 * publicados (peor-caso, palomar, llaves) no cambian.
 * Público: 5.º de secundaria y preuniversitario.
 *
 * Paleta de deducción (la de la rama Lógica, decisión de Gerson del 17 nov): un papel fijo por color en la teoría, los
 * ejemplos, la escena y la práctica.
 *   tinta ....... lo que amarra: el recipiente, lo que queda dentro, las letras y números de cada objeto, la meta
 *   o naranja ... lo supuesto: la peor suerte (lo que sale sin cumplir la meta; cada prueba que falla)
 *   i turquesa .. lo que sale de ahí: la extracción que obliga a cumplir la meta (lo que se deduce sin probar)
 *   f violeta ... lo seguro y lo pedido, ya comprobado (el total; antes de comprobar, en tinta)
 *   gris ........ lo descartado: una suerte que no es la peor, con su raya
 *   Sin verde ni carmín en toda la unidad. El color real de una bolita no se pinta: lleva la letra de su color (R roja,
 *   V verde, N negra, B blanca). La pieza rm-certeza fija los papeles y certezas.test.js falla si aparece verde o carmín,
 *   o si una figura de antes de responder trae violeta.
 * Letras: ninguna de fórmula (letras: {}); la regla se dice en palabras («uno menos de lo pedido en cada casillero»).
 * Las figuras tienen letras (R, V, N, B, I, D): los resueltos nombran cada alternativa por su valor, nunca por su letra
 * (decisión de la Etapa 3). La letra de la correcta, 6 veces cada una en los 30 ejemplos de nivel 3.
 * Errores: RM6 (el caso con suerte; docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md) y los RMP de
 * docs/investigacion/codigos-rm-procesos.md, todos hipótesis: RMP30 dejar fuera lo que no sirve (solo las que sirven, los
 * sin pareja, el 1 entre los primos), RMP31 armar mal el peor caso (mirar solo el color en los guantes, tomar las más
 * grandes), RMP32 contar mal el conjunto (contar las que sirven), RMP33 contar mal los casilleros (sin el 29 de febrero),
 * RMP34 el último paso (sin la que obliga, una de más, probar la última llave), RMP77 lo posible por lo seguro, RMP78 creer
 * que no se puede asegurar nada, RMP152 sacar todo, RMP153 lo pedido en cada casillero, RMP154 todas las llaves con
 * todos los candados, RMP155 «casilleros + 1» con cualquier meta.
 * Historia: el principio del palomar (University of Lethbridge). Compañero: Faro (zorro).
 *
 * Ficha de tarea (diseno-y-animacion), idea 1:
 *   Promesa: decir cuántas extracciones aseguran una meta, armando la peor suerte posible.
 *   Persona y condiciones: postulante de 5.º o preuniversitario, celular de gama baja, sin conexión en el aula.
 *   Resultado observable: arma el peor caso (lo que no sirve y una menos de lo pedido) y suma la que obliga.
 *   Orden de atención: 1.º la tómbola y la meta · 2.º lo que salió y la lectura · acción: elegir qué sale.
 *   Estados: juego sin tocar · peor caso armado · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «si con suerte basta con 3, ¿por qué la respuesta es 10?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f0 = x => Kit.formatear(x, 0);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    r.barajar = xs => { const y = xs.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  const lista = (xs, y = 'y') => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} ${y} ${xs[xs.length - 1]}` : xs.join(''));
  const suma = xs => xs.reduce((a, b) => a + b, 0);
  const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const CR = 'rm-certeza';
  const F = t => ({ v: 'c-f', t });   // lo seguro y lo pedido, en violeta
  const O = t => ({ v: 'c-o', t });   // la peor suerte, en naranja
  const I = t => ({ v: 'c-i', t });   // la que obliga, en turquesa
  // Opciones de «Ahora tú» con números: la correcta y los errores que dan un valor distinto (y posible).
  function opcionesNum(correcta, unidad, distractores, max = 4) {
    const t = x => `${f0(x)} ${x === 1 ? unidad[0] : unidad[1]}`;
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: t(correcta), correcta: true }];
    for (const d of distractores) {
      if (!d || !Number.isFinite(d.valor) || d.valor < 1 || vistos.has(d.valor) || ops.length >= max) continue;
      vistos.add(d.valor); ops.push({ id: d.id, texto: t(d.valor), error: d.error, siFuera: d.siFuera });
    }
    return ops;
  }
  const opcionesTexto = (correcta, distractores, max = 4) => {
    const vistos = new Set([correcta]), ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) { if (!d || vistos.has(d.texto) || ops.length >= max) continue; vistos.add(d.texto); ops.push(d); }
    return ops;
  };

  // ---------- Colores de las bolitas (la letra va en la bolita; el color real no se pinta) ----------
  const COL = { R: ['roja', 'rojas'], V: ['verde', 'verdes'], N: ['negra', 'negras'], B: ['blanca', 'blancas'] };
  const nom = (c, n) => COL[c][n === 1 ? 0 : 1];
  const cant = (c, n) => `${f0(n)} ${nom(c, n)}`;
  const urnaTxt = urna => lista(urna.map(([c, n]) => cant(c, n)));
  const totalU = urna => suma(urna.map(x => x[1]));
  const deU = (urna, c) => (urna.find(x => x[0] === c) || [c, 0])[1];
  const bolas = urna => urna.flatMap(([c, n]) => Array.from({ length: n }, () => ({ forma: 'bola', t: c })));
  // Lo que sale, en orden: [color, papel, desde]. Se toma la última bolita de ese color que queda (las demás no se mueven).
  function salidasDe(urna, seq) {
    const objs = bolas(urna), usados = new Set();
    return seq.map(([c, papel, desde]) => {
      let i = -1;
      for (let k = objs.length - 1; k >= 0; k--) if (objs[k].t === c && !usados.has(k)) { i = k; break; }
      usados.add(i);
      return Object.assign({ i, papel }, desde ? { desde } : {});
    });
  }
  const tombola = (urna, seq, o = {}) => Object.assign({ escena: 'recipiente', recipiente: o.recipiente || 'tombola', objetos: bolas(urna) },
    o.titulo ? { titulo: o.titulo } : {}, o.meta ? { meta: o.meta } : {}, seq ? { salieron: salidasDe(urna, seq), reserva: o.reserva || totalU(urna) } : o.reserva ? { reserva: o.reserva } : {},
    o.cuenta ? { cuenta: o.cuenta } : {}, o.nota !== undefined ? { nota: o.nota } : {});
  // El mayor grupo que puede salir SIN cumplir la meta, probando todas las cantidades posibles de cada clase.
  function peorCuentas(topes, logra) {
    let mejor = -1, vMejor = null;
    const v = [];
    (function rec(i) {
      if (i === topes.length) { if (!logra(v)) { const s = suma(v); if (s > mejor) { mejor = s; vMejor = v.slice(); } } return; }
      for (let c = 0; c <= topes[i]; c++) { v.push(c); rec(i + 1); v.pop(); }
    })(0);
    return { max: mejor, v: vMejor };
  }
  // Todas las extracciones posibles de m bolitas (cuántas de cada color).
  function extracciones(topes, m) {
    const out = [], v = [];
    (function rec(i, resta) {
      if (i === topes.length) { if (resta === 0) out.push(v.slice()); return; }
      for (let c = 0; c <= Math.min(topes[i], resta); c++) { v.push(c); rec(i + 1, resta - c); v.pop(); }
    })(0, m);
    return out;
  }
  // Casos ya usados por idea (el juego, la predicción y los 15 ejemplos): «Ahora tú» y «Así se resuelve» no los repiten
  // (regla 15 de la Etapa 6; cierre del 19 nov). Cada ejemplo guarda su clave en _caso; se juntan al armar cada idea.
  const CLAVES = {};
  const usado = (idea, clave) => !!(CLAVES[idea] && CLAVES[idea].has(clave));
  const kColor = (urna, c, k) => `color|${JSON.stringify(urna)}|${c}|${k}`;
  const kMismo = (urna, k) => `mismo|${JSON.stringify(urna)}|${k}`;
  const kCal = (C, k, ya) => `cal|${C}|${k}|${ya || 0}`;
  const kCada = urna => `cada|${JSON.stringify(urna)}`;
  const kGu = (pares, c) => `guantes|${JSON.stringify(pares)}|${c || ''}`;
  const kDos = (urna, a, b, k) => `dos|${JSON.stringify(urna)}|${a}|${b}|${k}`;
  const kCond = (desde, N, nombre, k) => `cond|${desde}|${N}|${nombre}|${k}`;
  const kPar = (N, S, cop) => `pareja|${N}|${S}|${cop}`;
  const kSup = (vals, S) => `supera|${vals.join(',')}|${S}`;
  const kBil = (B, M) => `billetes|${JSON.stringify(B)}|${M}`;
  const kLl = (n, k, ya) => `llaves|${n}|${k}|${ya || 0}`;
  const juntar = (idea, ejemplos, extra) => { CLAVES[idea] = new Set(extra.concat(ejemplos.map(e => e._caso).filter(Boolean))); };
  const D_SIN = 'Se saca sin mirar, una por una, y lo que sale no vuelve.';
  const D_CERT = 'Con certeza: la meta se cumple salga lo que salga, en cualquier orden.';
  const BOL = ['bolita', 'bolitas'];
  const pl = (n, u) => `${f0(n)} ${n === 1 ? u[0] : u[1]}`;

  // ---------- Idea 1: prepara la peor suerte ----------
  // Objeto de la primera pantalla: la tómbola de la kermés del aniversario (rm-certeza, escena «recipiente»). Cambia:
  // cuántas bolitas de cada color salen (el alumno hace de mala suerte). · Permanece: la tómbola (5 rojas, 4 verdes,
  // 3 negras) y la meta, 2 rojas. · Progresa: cuántas salen sin cumplir. · Se reserva: la meta de 3 rojas (Predice).
  // · Debe verse: lo que no sirve sale primero; con una roja menos de lo pedido ya no queda nada que no sirva.
  const U1 = [['R', 5], ['V', 4], ['N', 3]];
  const META1 = 2;
  const seq1 = val => {
    const s = [];
    for (let k = 0; k < val.v; k++) s.push(['V', 'peor']);
    for (let k = 0; k < val.n; k++) s.push(['N', 'peor']);
    for (let k = 0; k < val.r; k++) s.push(['R', k + 1 < META1 ? 'peor' : k + 1 === META1 ? 'obliga' : 'amarra']);
    return s;
  };
  const PEOR1 = peorCuentas(U1.map(x => x[1]), v => v[0] >= META1);   // [rojas, verdes, negras]
  if (PEOR1.max !== 8) throw new Error('juego de la idea 1: el peor caso debe ser 8');
  function lecturaJ1(val) {
    const t = val.r + val.v + val.n;
    if (val.r >= META1) return [`Con ${f0(META1)} rojas la meta ya se cumple: la mala suerte perdió`];
    if (!t) return ['Todavía no sale nada: elige qué saca la mala suerte'];
    const queda = val.v < 4 || val.n < 3 || val.r < META1 - 1;
    return [`${pl(t, BOL)} sin ${f0(META1)} rojas: ${queda ? 'aún cabe algo sin cumplir' : 'ya no queda nada que no sirva'}`];
  }
  // La predicción: la misma tómbola, 3 rojas. Peor caso: 4 verdes, 3 negras y 2 rojas; la décima obliga.
  const K_P1 = 3, NOSIRVE_P1 = totalU(U1) - deU(U1, 'R');
  const R_P1 = peorCuentas(U1.map(x => x[1]), v => v[0] >= K_P1).max + 1;
  if (R_P1 !== NOSIRVE_P1 + K_P1) throw new Error('predicción de la idea 1: las cuentas no cuadran');
  const seqP1 = [...Array(4).fill(['V', 'peor', 1]), ...Array(3).fill(['N', 'peor', 1]), ...Array(K_P1 - 1).fill(['R', 'peor', 2]), ['R', 'obliga', 3]];
  const cuentaP1 = [{ t: `${f0(NOSIRVE_P1)} no sirven`, papel: 'peor', desde: 1 }, { t: `+ ${f0(K_P1 - 1)} rojas`, papel: 'peor', desde: 2 },
    { t: '+ 1 obliga', papel: 'obliga', desde: 3 }, { t: `= ${f0(R_P1)}`, papel: 'seguro', desde: 4 }];
  const META_P1 = `Meta: ${cant('R', K_P1)}, con certeza`;

  // ---------- Casos de «Así se resuelve» y «Ahora tú» de la idea 1 ----------
  const COLS = ['R', 'V', 'N', 'B'];
  function urnaAzar(r, nc, lo, hi) {
    const cs = r.barajar(COLS).slice(0, nc).sort((a, b) => COLS.indexOf(a) - COLS.indexOf(b));
    return cs.map(c => [c, r.ent(lo, hi)]);
  }
  // k de un color dado: lo que no sirve + k.
  // Nunca el caso del juego ni el de la predicción (la tómbola de 5, 4 y 3 con 2 o 3 rojas).
  const esU1 = urna => JSON.stringify(urna) === JSON.stringify(U1);
  function casoColor(r, nc, lo, hi) {
    let urna, c, n, k;
    do { urna = urnaAzar(r, nc, lo, hi); [c, n] = r.elegir(urna); k = r.ent(2, Math.min(n, 5)); } while ((esU1(urna) && c === 'R' && k <= 3) || usado('peor-caso', kColor(urna, c, k)));
    const otros = urna.filter(x => x[0] !== c), O = suma(otros.map(x => x[1])), bien = O + k;
    if (peorCuentas(urna.map(x => x[1]), v => v[urna.findIndex(x => x[0] === c)] >= k).max + 1 !== bien) throw new Error('casoColor');
    return { urna, c, n, k, otros, O, bien, T: totalU(urna) };
  }
  const seqColor = (cs, papelUltima = 'obliga') => [...cs.otros.flatMap(([c, n]) => Array(n).fill([c, 'peor'])), ...Array(cs.k - 1).fill([cs.c, 'peor']), [cs.c, papelUltima]];
  function distColor(cs) {
    const sing = nom(cs.c, 1), plu = nom(cs.c, 2);
    return [
      { id: 'suerte', valor: cs.k, error: 'RM6', siFuera: `Con buena suerte, las ${f0(cs.k)} primeras serían ${plu}. La certeza pide que alcance con la peor suerte.` },
      { id: 'sin1', valor: cs.bien - 1, error: 'RMP34', siFuera: `Armaste bien el peor caso: ${f0(cs.bien - 1)} sin cumplir. Falta la siguiente, la ${sing} que obliga.` },
      { id: 'solo', valor: cs.n, error: 'RMP30', siFuera: `${f0(cs.n)} son todas las ${plu}, pero nada las obliga a salir primero: antes caben las ${f0(cs.O)} que no sirven.` },
      { id: 'todo', valor: cs.T, error: 'RMP152', siFuera: `Sacar las ${f0(cs.T)} asegura la meta, pero sobran: basta lo que no sirve y ${f0(cs.k)} ${plu}.` },
      { id: 'mas', valor: cs.bien + 1, error: 'RMP34', siFuera: `Sumaste una de más: después del peor caso, la siguiente ya obliga.` },
    ];
  }
  // «¿Qué es seguro?» después de sacar m: lo que vale en todas las extracciones posibles de m.
  const claseTxt = (urna, v) => lista(urna.map(([c], i) => (v[i] ? cant(c, v[i]) : null)).filter(Boolean));
  function casoSeguro(r) {
    for (let t = 0; t < 400; t++) {
      const urna = urnaAzar(r, 3, 3, 8), T = totalU(urna), topes = urna.map(x => x[1]);
      const ci = topes.indexOf(Math.max(...topes)), O = T - topes[ci], m = r.ent(O + 1, Math.min(T - 1, O + topes[ci] - 2));
      if (m <= O || m >= T) continue;
      const ext = extracciones(topes, m), g = m - O;
      if (Math.min(...ext.map(v => v[ci])) !== g) continue;
      // Otra clase que puede no salir.
      const di = [0, 1, 2].find(i => i !== ci && ext.some(v => v[i] === 0));
      if (di === undefined) continue;
      const ej = (pred) => ext.find(pred);
      const sinMas = ej(v => v[ci] === g), sinD = ej(v => v[di] === 0), sinTres = ej(v => v.some(x => x === 0));
      if (!sinMas || !sinD || !sinTres || g + 1 > topes[ci]) continue;
      return { urna, T, ci, O, m, g, di, sinMas, sinD, sinTres, c: urna[ci][0], d: urna[di][0] };
    }
    return null;
  }
  const alMenos = (c, n) => (n === 1 ? `Salió al menos una ${nom(c, 1)}` : `Salieron al menos ${f0(n)} ${nom(c, 2)}`);
  const cuantasTxt = cs => `${f0(cs.O)} + ${f0(cs.k - 1)} + 1 = ${f0(cs.bien)}`;

  const peor = {
    id: 'peor-caso',
    titulo: 'Prepara la peor suerte',
    pregunta: '¿Por qué no basta con sacar justo las que pides?',
    temas: ['Peor caso', 'Extracción de objetos'],
    pieza: CR,
    aprendizaje: 'Para estar seguro se arma el peor caso: sale todo lo que no sirve y una menos de lo pedido; la siguiente obliga.',
    actividad: 'Hacer de mala suerte: sacar todo lo que se pueda sin cumplir la meta.',
    // Lee: la tómbola, suerte contra certeza y qué es hacer de mala suerte. No dice cuántas aseguran 3 rojas (Predice).
    lee: {
      tarjetas: [
        { titulo: 'La tómbola de la kermés', texto: 'En la kermés del aniversario hay una tómbola: una caja cerrada con bolitas de colores. Metes la mano y sacas una sin mirar. Lo que sale no vuelve a la caja.',
          pieza: CR, dibujo: { datos: tombola(U1, null), estado: {} } },
        { titulo: 'Con suerte o con certeza', texto: 'Con buena suerte, las dos primeras bolitas ya podrían ser rojas. Pero tener algo «con certeza» pide más: que la meta se cumpla salga lo que salga, en cualquier orden.' },
        { titulo: 'La peor suerte', texto: 'Para estar seguro, imagina que la suerte juega en contra y te da primero lo que no te sirve. Esa peor suerte tiene un nombre: el peor caso. Son dos nombres para lo mismo.' },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego tú haces de mala suerte: eliges cuántas bolitas de cada color salen. Mira cuántas pueden salir sin que se cumpla la meta.' },
      ],
    },
    juega: {
      pieza: CR,
      consigna: 'La tómbola de la kermés tiene 5 rojas, 4 verdes y 3 negras. La meta: 2 rojas. Tú haces de mala suerte.',
      mision: {
        texto: 'Saca la mayor cantidad de bolitas sin llegar a 2 rojas.',
        logrado: v => v.r < META1 && v.r + v.v + v.n === PEOR1.max,
        bien: [`Ese es el peor caso: ${pl(PEOR1.max, BOL)} sin ${f0(META1)} rojas. La siguiente tiene que ser roja.`],
      },
      voz: 'La mala suerte saca primero lo que no sirve.',
      leyenda: [
        { s: 'R, V, N', t: 'bolita roja, verde o negra' },
        { s: O('borde naranja'), t: 'salió y todavía no cumple la meta' },
        { s: I('borde turquesa'), t: 'la bolita que cumple la meta' },
      ],
      controles: [
        { id: 'v', etiqueta: 'Verdes que salen', min: 0, max: 4, paso: 1, inicio: 0, decimales: 0 },
        { id: 'n', etiqueta: 'Negras que salen', min: 0, max: 3, paso: 1, inicio: 0, decimales: 0 },
        { id: 'r', etiqueta: 'Rojas que salen', min: 0, max: 5, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: val => ({ datos: tombola(U1, seq1(val), { meta: `Meta: ${cant('R', META1)}` }), estado: {} }),
      lectura: val => lecturaJ1(val),
      minimo: 3,
    },
    predice: {
      pregunta: `En la misma tómbola, ¿cuántas bolitas hay que sacar, como mínimo, para tener con certeza ${cant('R', K_P1)}?`,
      datos: [`La tómbola tiene ${urnaTxt(U1)}.`, D_SIN],
      voz: 'Haz de mala suerte otra vez, con la meta nueva.',
      opciones: [
        { id: 'c', texto: pl(R_P1, BOL), correcta: true },
        { id: 'tres', texto: pl(K_P1, BOL), error: 'RM6', siFuera: 'Con buena suerte, las tres primeras serían rojas. La certeza pide que alcance con la peor suerte.' },
        { id: 'cinco', texto: pl(deU(U1, 'R'), BOL), error: 'RMP30', siFuera: `${f0(deU(U1, 'R'))} son todas las rojas, pero nada las obliga a salir primero: antes caben ${f0(NOSIRVE_P1)} que no sirven.` },
        { id: 'doce', texto: pl(totalU(U1), BOL), error: 'RMP152', siFuera: `Sacar las ${f0(totalU(U1))} asegura las rojas, pero sobran ${f0(totalU(U1) - R_P1)}: con la peor suerte, la meta ya se cumple antes.` },
      ],
      dibujo: { datos: tombola(U1, null, { meta: META_P1 }), estado: {} },
      revelar: { datos: tombola(U1, seqP1, { meta: META_P1, cuenta: cuentaP1 }), estado: { corte: 4 } },
      coincide: `Coincide: ${f0(NOSIRVE_P1)} que no sirven, ${f0(K_P1 - 1)} rojas sin cumplir y la que obliga.`,
      noCoincide: `Revisemos: con la peor suerte salen primero las ${f0(NOSIRVE_P1)} bolitas que no son rojas.`,
    },
    mira: {
      pieza: CR,
      datos: tombola(U1, seqP1, { meta: META_P1, cuenta: cuentaP1 }),
      voz: 'Primero lo que no sirve, después lo justo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La peor suerte saca primero lo que no sirve: 4 verdes y 3 negras.', ecuacion: [`4 + 3 = ${f0(NOSIRVE_P1)}`] },
        { estado: { corte: 2 }, texto: 'Después salen rojas, pero solo 2: todavía no hay 3.', ecuacion: [`${f0(NOSIRVE_P1)} + 2 = ${f0(R_P1 - 1)}`] },
        { estado: { corte: 3 }, texto: 'Ya no queda nada que no sirva: la siguiente es roja y obliga.', ecuacion: [`${f0(R_P1 - 1)} + 1 = ${f0(R_P1)}`] },
        { estado: { corte: 4 }, texto: `Con ${f0(R_P1 - 1)} la meta todavía podía fallar; con ${f0(R_P1)}, ya no.` },
      ],
    },
    regla: {
      texto: 'Para tener certeza, arma el peor caso (la peor suerte): sale todo lo que no sirve y, de lo que sirve, una menos de lo pedido. La siguiente obliga.',
      ecuacion: [{ llave: ['peor caso'], nota: 'lo que no sirve y una menos de lo pedido', color: 'c-o' }, ' + ', { llave: ['1'], nota: 'la que obliga', color: 'c-i' }],
      condicion: 'se saca sin mirar y sin devolver. Seguro es lo que pasa en todas las extracciones posibles, también en la peor.',
      voz: 'La certeza se gana contra la peor suerte.',
    },
    // En el mundo (docs/teoria.md, 4k): la tanda de penales se corta cuando ni la peor suerte cambia el resultado
    // (IFAB, regla 10). No usa tómbolas ni la meta de 3 rojas (Predice); el caso de la pregunta es otro marcador.
    // Revisión del Escribidor Escribano (28 nov): «A gana la tanda 4 a 2» se leía como tanda ya ganada, y eso
    // respondía la pregunta; pasa a «A va ganando». Regla 10 de la IFAB cotejada: se corta cuando el otro no alcanza.
    mundo: {
      hecho: 'Una tanda de penales puede terminar antes del quinto tiro',
      parrafos: [
        'Cuando un partido de eliminación termina empatado, se puede definir con una tanda de cinco penales por equipo, que patean por turnos. El reglamento del fútbol manda cortar la tanda apenas un equipo lleva más goles de los que el otro podría alcanzar, aunque metiera todos los tiros que le quedan.',
        ['Es la peor suerte escrita en el reglamento: se supone que el rival mete todos los tiros que le faltan. Si tu equipo gana 3 a 0 después de tres tiros por equipo, el rival tiene dos más:',
          { linea: [O('0 + 2'), ' = 2, menos que 3'] },
          'Ni con esos dos goles alcanza a tu equipo, que ya ganó con certeza, y la tanda termina ahí.'],
      ],
      pregunta: {
        texto: 'Después de cuatro tiros por equipo, A va ganando la tanda 4 a 2. ¿Hace falta patear los quintos tiros?',
        opciones: [
          { id: 'no', texto: 'No: aunque B meta su quinto tiro, llega a 3', correcta: true },
          { id: 'cinco', texto: 'Sí: siempre se patean los cinco tiros de cada equipo', error: 'RMP152',
            siFuera: 'Es cierto que la tanda es de cinco tiros por equipo. Pero el reglamento la corta cuando el resultado ya no puede cambiar, y aquí B no alcanza a A ni metiendo su último tiro.' },
          { id: 'achica', texto: 'Sí: B todavía puede meter su tiro y achicar la diferencia', error: 'RMP77',
            siFuera: 'Es verdad que B puede meter su quinto tiro, pero achicar no basta: con ese gol llega a 3, y A ya tiene 4. Para seguir pateando, B tendría que poder empatar.' },
        ],
        porque: 'Con la peor suerte para A, B mete su quinto tiro y llega a 3 goles. Como A ya tiene 4, el ganador no cambia salga lo que salga, y la tanda termina.',
      },
      fuente: 'IFAB, Reglas de Juego 2025/26, regla 10 (tiros desde el punto penal).',
    },
    ejemplos: null,
    // Así se resuelve: una bolsa del sorteo, k de un color. «Ahora tú» usa la tómbola (otro enunciado) y otros tipos.
    resuelve: {
      pieza: CR,
      generar(s) {
        const r = azar(s + 900), cs = casoColor(r, 3, 3, 8), plu = nom(cs.c, 2);
        const meta = `Meta: ${cant(cs.c, cs.k)}`, op = { titulo: 'Bolsa del sorteo', meta };
        return {
          enunciado: `Para el sorteo de la kermés, una bolsa tiene ${urnaTxt(cs.urna)}. ¿Cuántas bolitas hay que sacar, como mínimo, para tener con certeza ${cant(cs.c, cs.k)}?`,
          datos: [D_SIN, D_CERT],
          dibujo: { datos: tombola(cs.urna, null, op), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden el menor número de bolitas que asegura ${cant(cs.c, cs.k)}, aunque la suerte juegue en contra.` },
            { tipo: 'datos', texto: `Las que no son ${plu} no sirven: ${urnaTxt(cs.otros)}.`, ecuacion: [`${cs.otros.map(x => f0(x[1])).join(' + ')} = ${f0(cs.O)}`] },
            { tipo: 'regla', texto: 'La peor suerte saca primero todo lo que no sirve y, de lo que sirve, una menos de lo pedido. La siguiente obliga.' },
            { tipo: 'cuentas', texto: `Peor caso: ${f0(cs.O)} que no sirven y ${cant(cs.c, cs.k - 1)}, sin cumplir todavía.`, ecuacion: [`${f0(cs.O)} + ${f0(cs.k - 1)} = ${f0(cs.bien - 1)}`],
              dibujo: { datos: tombola(cs.urna, seqColor(cs, 'peor').slice(0, -1), op), estado: {} } },
            { tipo: 'cuentas', texto: `Ya no queda nada que no sirva: la siguiente es ${nom(cs.c, 1)} y obliga.`, ecuacion: [`${f0(cs.bien - 1)} + 1 = `, F(f0(cs.bien))],
              dibujo: { datos: tombola(cs.urna, seqColor(cs), op), estado: {} } },
            { tipo: 'sentido', texto: `Con una menos, la peor suerte todavía deja solo ${cant(cs.c, cs.k - 1)}: no alcanza.` },
          ],
          respuesta: [F(pl(cs.bien, BOL))],
        };
      },
    },
    // Ahora tú, por tipos (semilla % 4): 0 tómbola de tres colores, k de un color · 1 «¿qué es seguro?» después de sacar
    // m (lo que vale en todas las extracciones; el «siempre cierto» de la Etapa 3) · 2 cuatro colores, nivel examen ·
    // 3 hallar antes las cantidades (2022, pregunta 18). Cada distractor dice el valor de su error.
    ahoraTu: {
      pieza: CR,
      voz: 'Saca primero todo lo que no sirve.',
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo === 1) {
          const q = casoSeguro(r), { urna, c, d, g } = q;
          const correcta = alMenos(c, g);
          const ops = opcionesTexto(correcta, [
            { id: 'mas', texto: alMenos(c, g + 1), error: 'RMP77', siFuera: `Puede pasar, pero no siempre: con ${claseTxt(urna, q.sinMas)} salen solo ${f0(g)}.` },
            { id: 'otra', texto: `Salió al menos una ${nom(d, 1)}`, error: 'RMP77', siFuera: `Puede pasar, pero no siempre: con ${claseTxt(urna, q.sinD)} no sale ninguna ${nom(d, 1)}.` },
            { id: 'tres', texto: 'Salieron de los tres colores', error: 'RMP77', siFuera: `Puede pasar, pero no siempre: con ${claseTxt(urna, q.sinTres)} falta un color.` },
            { id: 'nada', texto: 'No se puede asegurar nada', error: 'RMP78', siFuera: `Sí se puede: sin ${nom(c, 2)} salen a lo más ${f0(q.O)}; las otras son ${nom(c, 2)}.` },
          ], 5);
          return { pregunta: `De la tómbola de la kermés, con ${urnaTxt(urna)}, salieron ${pl(q.m, BOL)} sin mirar. ¿Qué es seguro?`,
            datos: [D_SIN, 'Seguro: lo que pasa en todas las extracciones posibles.'],
            dibujo: { datos: tombola(urna, null), estado: {} }, opciones: ops,
            solucion: { texto: `Sin ${nom(c, 2)} salen a lo más ${f0(q.O)}. Las otras ${f0(g)} tienen que ser ${nom(c, g)}: seguro, al menos ${f0(g)}.`, ecuacion: [`${f0(q.m)} − ${f0(q.O)} = `, F(f0(g))] } };
        }
        let cs, preg;
        if (tipo === 3) {
          // 30 bolitas: rojas, la mitad de verdes que de rojas y el resto negras.
          for (let t = 0; t < 100; t++) {
            const T = r.elegir([24, 30, 36]), R = 2 * r.ent(3, Math.floor(T / 5)), V = R / 2, N = T - R - V;
            if (N < 3) continue;
            const urna = [['R', R], ['V', V], ['N', N]], [c, n] = r.elegir(urna), k = r.ent(2, Math.min(n, 5));
            if (usado('peor-caso', kColor(urna, c, k))) continue;
            const otros = urna.filter(x => x[0] !== c), O = suma(otros.map(x => x[1]));
            cs = { urna, c, n, k, otros, O, bien: O + k, T };
            preg = `En la tómbola hay ${pl(T, BOL)}: ${cant('R', R)}, la mitad de verdes que de rojas y el resto, negras. ¿Cuántas hay que sacar, como mínimo, para tener con certeza ${cant(c, k)}?`;
            break;
          }
        } else {
          cs = casoColor(r, tipo === 2 ? 4 : 3, tipo === 2 ? 4 : 2, tipo === 2 ? 12 : 8);
          preg = `En la tómbola de la kermés hay ${urnaTxt(cs.urna)}. ¿Cuántas bolitas hay que sacar, como mínimo, para tener con certeza ${cant(cs.c, cs.k)}?`;
        }
        const ops = opcionesNum(cs.bien, BOL, distColor(cs), 5);
        return { pregunta: preg, datos: [D_SIN, D_CERT],
          dibujo: { datos: tombola(cs.urna, null, { meta: `Meta: ${cant(cs.c, cs.k)}` }), estado: {} }, opciones: ops,
          solucion: { texto: `Peor caso: las ${f0(cs.O)} que no son ${nom(cs.c, 2)} y ${cant(cs.c, cs.k - 1)}. La siguiente obliga.`, ecuacion: [`${f0(cs.O)} + ${f0(cs.k - 1)} + 1 = `, F(f0(cs.bien))],
            dibujo: { datos: tombola(cs.urna, seqColor(cs), { meta: `Meta: ${cant(cs.c, cs.k)}` }), estado: {} } } };
      },
    },
  };

  // ---------- Ejemplos resueltos de «Prepara la peor suerte» (pestaña «Ejemplos»; molde §3) ----------
  // Cada número sale de las cuentas de abajo (peorCuentas prueba todas las cantidades posibles de cada color); además se
  // resolvieron aparte con un script que no usa el código de la unidad (scratchpad e7-rm/ejemplos.py, fuerza bruta sobre
  // todas las extracciones): 1 → 5 · 2 → 6 · 3 → 4 · 4 → 6 · 5 → 7 · 6 → 12 · 7 → 4 · 8 → 9 · 9 → 8 · 10 → 19 ·
  // 11 → 27 (A) · 12 → al menos 3 rojas (B) · 13 → 29 (C) · 14 → 12 (D) · 15 → 28 (E). La figura es el planteamiento: la
  // tómbola llena y la meta, nunca lo que sale. La respuesta, en violeta; las alternativas se nombran por su valor.
  const figT = (urna, meta, o = {}) => ({ pieza: CR, datos: tombola(urna, null, Object.assign({ meta }, o)), estado: {} });
  // Lo que no sirve, sumado: «4 + 3 = 7» (con un solo color, sin cuenta).
  const sumaOtros = otros => (otros.length > 1 ? [`${otros.map(x => f0(x[1])).join(' + ')} = ${f0(suma(otros.map(x => x[1])))}`] : undefined);
  // k de un color dado. o.alts: [{ v, por }] en el orden A–E, con la correcta { ok: true }; o.explica: la línea que
  // nombra cada alternativa incorrecta por su valor.
  function ejColor(o) {
    const { urna, c, k } = o, otros = urna.filter(x => x[0] !== c), Oo = suma(otros.map(x => x[1])), bien = Oo + k;
    const ok = peorCuentas(urna.map(x => x[1]), v => v[urna.findIndex(x => x[0] === c)] >= k).max + 1;
    if (ok !== bien) throw new Error(`ejemplo «${o.titulo}»: ${ok} contra ${bien}`);
    const sol = [{ texto: `Lo que no sirve: ${urnaTxt(otros)}. Con la peor suerte, todo eso sale primero.`, ecuacion: sumaOtros(otros) }];
    if (k > 1) sol.push({ texto: `Después, ${cant(c, k - 1)}: todavía no hay ${f0(k)}.`, ecuacion: [`${f0(Oo)} + ${f0(k - 1)} = ${f0(bien - 1)}`] });
    sol.push({ texto: `Ya no queda nada que no sirva: la siguiente es ${nom(c, 1)} y obliga.`, ecuacion: [`${f0(bien - 1)} + 1 = `, F(f0(bien))] });
    const meta = k === 1 ? `una ${nom(c, 1)}` : cant(c, k);
    return ejCierra(Object.assign({ _caso: kColor(urna, c, k) }, o), bien, sol, `En ${o.recipTxt || 'la tómbola'} hay ${urnaTxt(urna)}. ¿Cuántas bolitas hay que sacar, como mínimo, para tener con certeza ${meta}?`,
      figT(urna, `Meta: ${meta}`, o.titulo2 ? { titulo: o.titulo2 } : {}));
  }
  // Junta el ejemplo: con alternativas, la última línea explica cada una por su valor (y las de antes se compactan).
  function ejCierra(o, bien, sol, enunciado, figura, unidad = BOL) {
    const e = { nivel: o.nivel, titulo: o.titulo, enunciado: o.enunciado || enunciado, datos: o.datos || [D_SIN, D_CERT], figura, solucion: sol, respuesta: [F(pl(bien, unidad))], _caso: o.caso || o._caso || null };
    if (o.alts) {
      const buenas = o.alts.filter(a => a.ok);
      if (buenas.length !== 1 || buenas[0].v !== bien) throw new Error(`ejemplo «${o.titulo}»: la correcta no es ${bien}`);
      e.alternativas = o.alts.map(a => pl(a.v, unidad));
      if (sol.length > 3) e.solucion = [sol[0], { texto: sol.slice(1).map(x => (typeof x.texto === 'string' ? x.texto : x.texto.map(y => (typeof y === 'string' ? y : y.t)).join(''))).join(' '), ecuacion: sol[sol.length - 1].ecuacion }];
      e.solucion = e.solucion.concat([{ texto: o.explica }]);
    }
    if (o.figura === false) delete e.figura;
    return e;
  }
  const EJEMPLOS_PEOR = [
    ejColor({ nivel: 1, titulo: 'Una roja, con certeza', urna: [['R', 3], ['V', 2], ['N', 2]], c: 'R', k: 1 }),
    (() => {
      const urna = [['R', 4], ['V', 3], ['N', 2]], otros = urna.filter(x => x[0] !== 'V'), Oo = suma(otros.map(x => x[1]));
      if (peorCuentas(urna.map(x => x[1]), v => v[1] >= 1).max !== Oo) throw new Error('ejemplo 2');
      return { nivel: 1, titulo: 'Lo que sale sin una verde', _caso: kColor(urna, 'V', 1), enunciado: `En la tómbola hay ${urnaTxt(urna)}. ¿Cuántas bolitas pueden salir, como máximo, sin que salga ninguna verde?`,
        datos: [D_SIN], figura: figT(urna, 'Sin ninguna verde: ¿cuántas, como máximo?'),
        solucion: [{ texto: `Sin verdes solo pueden salir las ${nom('R', 2)} y las ${nom('N', 2)}: todas.`, ecuacion: [`${f0(otros[0][1])} + ${f0(otros[1][1])} = `, F(f0(Oo))] }],
        respuesta: [F(pl(Oo, BOL))] };
    })(),
    ejColor({ nivel: 1, titulo: 'Dos negras en una bolsa chica', urna: [['R', 2], ['N', 3]], c: 'N', k: 2, recipTxt: 'una bolsa', titulo2: 'Bolsa' }),
    ejColor({ nivel: 1, titulo: 'Una blanca entre canicas', urna: [['R', 5], ['B', 4]], c: 'B', k: 1, recipTxt: 'una lata de canicas', titulo2: 'Lata' }),
    ejColor({ nivel: 1, titulo: 'Las dos negras', urna: [['R', 3], ['V', 2], ['N', 2]], c: 'N', k: 2 }),
    ejColor({ nivel: 2, titulo: 'Tres rojas entre cuatro colores', urna: [['R', 5], ['V', 4], ['N', 3], ['B', 2]], c: 'R', k: 3 }),
    (() => {
      const urna = [['R', 5], ['V', 2], ['N', 2]], m = 8, Oo = 4, g = Math.min(...extracciones(urna.map(x => x[1]), m).map(v => v[0]));
      if (g !== m - Oo) throw new Error('ejemplo 7');
      return { nivel: 2, titulo: 'Lo seguro después de sacar 8', enunciado: `De la tómbola, con ${urnaTxt(urna)}, salieron ${pl(m, BOL)} sin mirar. ¿Cuántas rojas salieron, como mínimo, con seguridad?`,
        datos: [D_SIN, 'Seguro: lo que pasa en todas las extracciones posibles.'], figura: figT(urna, 'Salieron 8: ¿cuántas rojas, seguro?'),
        solucion: [{ texto: `Con la peor suerte, primero salen las que no son rojas: 2 verdes y 2 negras, ${f0(Oo)} en total.` },
          { texto: 'Las otras de las 8 ya tienen que ser rojas.', ecuacion: [`${f0(m)} − ${f0(Oo)} = `, F(f0(g))] }],
        respuesta: [F(`Al menos ${cant('R', g)}`)] };
    })(),
    (() => {
      const urna = [['R', 6], ['V', 2], ['N', 3]], k = 3, bien = 6 + k;
      if (peorCuentas(urna.map(x => x[1]), v => v[1] + v[2] >= k).max + 1 !== bien) throw new Error('ejemplo 8');
      return { nivel: 2, titulo: 'Verdes o negras, da igual', enunciado: `En la tómbola hay ${urnaTxt(urna)}. ¿Cuántas hay que sacar, como mínimo, para tener con certeza 3 bolitas que sean verdes o negras?`,
        datos: [D_SIN, D_CERT, 'Sirve una verde o una negra: cualquiera de las dos.'], figura: figT(urna, 'Meta: 3 verdes o negras'),
        solucion: [{ texto: 'Aquí lo único que no sirve son las rojas: con la peor suerte salen las 6.' },
          { texto: 'Después, 2 verdes o negras: todavía no hay 3.', ecuacion: ['6 + 2 = 8'] },
          { texto: 'La siguiente es verde o negra y obliga.', ecuacion: ['8 + 1 = ', F(f0(bien))] }],
        respuesta: [F(pl(bien, BOL))] };
    })(),
    (() => {
      // Ya salieron 2 verdes; quedan 4 rojas, 3 verdes y 3 negras. Meta: 2 rojas.
      const queda = [['R', 4], ['V', 3], ['N', 3]], k = 2, mas = 6 + k;
      if (peorCuentas(queda.map(x => x[1]), v => v[0] >= k).max + 1 !== mas) throw new Error('ejemplo 9');
      return { nivel: 2, titulo: 'Ya salieron dos verdes', enunciado: 'En la tómbola había 4 rojas, 5 verdes y 3 negras. Ya salieron 2 verdes. ¿Cuántas más hay que sacar, como mínimo, para tener con certeza 2 rojas?',
        datos: [D_SIN, D_CERT], figura: { pieza: CR, datos: tombola([['R', 4], ['V', 5], ['N', 3]], [['V', 'amarra'], ['V', 'amarra']], { meta: 'Meta: 2 rojas', reserva: 2 }), estado: {} },
        solucion: [{ texto: 'Quedan 4 rojas, 3 verdes y 3 negras. Lo que no sirve: 3 verdes y 3 negras.', ecuacion: ['3 + 3 = 6'] },
          { texto: 'Con la peor suerte salen esas 6 y una roja: todavía no hay 2.', ecuacion: ['6 + 1 = 7'] },
          { texto: 'La siguiente es roja y obliga.', ecuacion: ['7 + 1 = ', F(f0(mas))] }],
        respuesta: [F(`${pl(mas, BOL)} más`)] };
    })(),
    (() => {
      const T = 20, R = 8, V = R / 2, N = T - R - V, k = 3, bien = R + N + k;
      return Object.assign(ejColor({ nivel: 2, titulo: 'Primero, cuántas hay', urna: [['R', R], ['V', V], ['N', N]], c: 'V', k,
        enunciado: `En la tómbola hay ${pl(T, BOL)}: 8 rojas, la mitad de verdes que de rojas y el resto, negras. ¿Cuántas hay que sacar, como mínimo, para tener con certeza 3 verdes?` }), {
        solucion: [{ texto: `Verdes: la mitad de 8, 4. Negras: el resto.`, ecuacion: [`${f0(T)} − 8 − 4 = ${f0(N)}`] },
          { texto: `Lo que no sirve: 8 rojas y ${f0(N)} negras. Salen todas y 2 verdes sin cumplir.`, ecuacion: [`8 + ${f0(N)} + 2 = ${f0(bien - 1)}`] },
          { texto: 'La siguiente es verde y obliga.', ecuacion: [`${f0(bien - 1)} + 1 = `, F(f0(bien))] }],
        respuesta: [F(pl(bien, BOL))] });
    })(),
    // Nivel 3 (tipo examen), con alternativas por su valor.
    ejColor({ nivel: 3, titulo: 'La tómbola grande', urna: [['R', 12], ['V', 9], ['N', 7], ['B', 5]], c: 'R', k: 6,
      alts: [{ v: 27, ok: true }, { v: 26 }, { v: 28 }, { v: 33 }, { v: 6 }],
      explica: '26 se queda en el peor caso, sin la que obliga; 28 suma una de más; 33 es sacar todas; 6 es contar con buena suerte.' }),
    (() => {
      const urna = [['R', 7], ['V', 5], ['N', 4]], m = 12, topes = urna.map(x => x[1]), ext = extracciones(topes, m);
      const g = Math.min(...ext.map(v => v[0]));
      const alts = [alMenos('R', g + 1), alMenos('R', g), 'Salió al menos una negra', alMenos('V', 2), 'Salieron de los tres colores'];
      // Cada alternativa incorrecta tiene una extracción que la rompe; la correcta vale en todas.
      const vale = [v => v[0] >= g + 1, v => v[0] >= g, v => v[2] >= 1, v => v[1] >= 2, v => v.every(x => x >= 1)];
      if (!ext.every(vale[1]) || vale.some((f, i) => i !== 1 && ext.every(f))) throw new Error('ejemplo 12');
      return { nivel: 3, titulo: '¿Qué es seguro?', enunciado: `De la tómbola, con ${urnaTxt(urna)}, salieron 12 bolitas sin mirar. ¿Qué es seguro?`,
        alternativas: alts, datos: [D_SIN, 'Seguro: lo que pasa en todas las extracciones posibles.'], figura: figT(urna, 'Salieron 12: ¿qué es seguro?'),
        solucion: [{ texto: `Con la peor suerte, sin rojas salen a lo más 5 verdes y 4 negras: 9. Las otras ${f0(g)} son rojas, salga lo que salga.`, ecuacion: [`12 − 9 = `, F(f0(g))] },
          { texto: `«${alts[0]}» falla con 3 rojas, 5 verdes y 4 negras; «${alts[2]}» y «${alts[4]}», con 7 rojas y 5 verdes.`.replace('Salieron de los tres colores', 'De los tres colores') },
          { texto: `«${alts[3]}» falla con 7 rojas, 4 negras y una verde.` }],
        respuesta: [F(alMenos('R', g))] };
    })(),
    (() => {
      const T = 30, R = 12, V = 6, N = T - R - V, k = 5, bien = R + N + k;
      return ejColor({ nivel: 3, titulo: 'Cantidades escondidas', urna: [['R', R], ['V', V], ['N', N]], c: 'V', k,
        enunciado: `En la tómbola hay ${pl(T, BOL)}: 12 rojas, la mitad de verdes que de rojas y el resto, negras. ¿Cuántas hay que sacar, como mínimo, para tener con certeza 5 verdes?`,
        alts: [{ v: 5 }, { v: 24 }, { v: bien, ok: true }, { v: T }, { v: bien - 1 }],
        explica: `5 es con buena suerte; 24 son solo las que no sirven, sin las verdes; ${f0(T)} es sacar todo; ${f0(bien - 1)} olvida la que obliga.` });
    })(),
    (() => {
      // Ya salieron 3 negras y 2 rojas; quedan 4 rojas, 8 verdes y 2 negras. Meta: 4 rojas en total (faltan 2).
      const queda = [['R', 4], ['V', 8], ['N', 2]], falta = 2, mas = 10 + falta;
      if (peorCuentas(queda.map(x => x[1]), v => v[0] >= falta).max + 1 !== mas) throw new Error('ejemplo 14');
      return { nivel: 3, titulo: 'Las que faltan', enunciado: 'En la tómbola había 6 rojas, 8 verdes y 5 negras. Ya salieron 3 negras y 2 rojas. ¿Cuántas más hay que sacar, como mínimo, para tener con certeza 4 rojas en total?',
        alternativas: ['2 bolitas', '11 bolitas', '17 bolitas', '12 bolitas', '15 bolitas'], datos: [D_SIN, D_CERT],
        figura: { pieza: CR, datos: tombola([['R', 6], ['V', 8], ['N', 5]], [['N', 'amarra'], ['N', 'amarra'], ['N', 'amarra'], ['R', 'amarra'], ['R', 'amarra']], { meta: 'Meta: 4 rojas en total', reserva: 5 }), estado: {} },
        solucion: [{ texto: 'Faltan 2 rojas. Quedan 4 rojas, 8 verdes y 2 negras: lo que no sirve son 10.', ecuacion: ['8 + 2 = 10'] },
          { texto: 'Peor caso: las 10 y una roja. La siguiente roja obliga.', ecuacion: ['10 + 1 + 1 = ', F(f0(mas))] },
          { texto: '2 es con buena suerte; 11 olvida la que obliga; 17 cuenta desde el principio, sin lo que ya salió; 15 deja las 5 negras en la tómbola.' }],
        respuesta: [F(`${pl(mas, BOL)}`)] };
    })(),
    ejColor({ nivel: 3, titulo: 'Cuatro colores, meta grande', urna: [['R', 10], ['V', 8], ['N', 6], ['B', 4]], c: 'V', k: 8,
      alts: [{ v: 8 }, { v: 20 }, { v: 27 }, { v: 29 }, { v: 28, ok: true }],
      explica: '8 es con buena suerte; 20 son solo las que no sirven; 27 olvida la que obliga; 29 suma una de más.' }),
  ];
  peor.ejemplos = EJEMPLOS_PEOR;
  juntar('peor-caso', EJEMPLOS_PEOR, [kColor(U1, 'R', META1), kColor(U1, 'R', K_P1)]);

  // ---------- Idea 2: más objetos que casilleros ----------
  // Objeto: la misma tómbola (rm-certeza, escena «recipiente») y, en Predice, el calendario de cumpleaños del salón
  // (escena «casilleros»). Cambia: cuántas bolitas de cada color salen. · Permanece: la tómbola de la idea 1. · Progresa:
  // cuántas caben en cada color sin llegar a 3. · Se reserva: los meses (Predice). · Debe verse: cada color es un
  // casillero, y la peor suerte reparte parejo, uno menos de lo pedido en cada uno.
  const META2 = 3;
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
  const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  // La peor suerte reparte parejo: una de cada color por vuelta. La que hace llegar un color a lo pedido, obliga.
  function seqParejo(cuenta, colores, meta) {
    const s = [], n = colores.map(() => 0), vueltas = Math.max(...cuenta);
    let cumple = false;
    for (let v = 0; v < vueltas; v++) colores.forEach((c, i) => {
      if (v >= cuenta[i]) return;
      n[i]++;
      const llega = !cumple && n[i] >= meta;
      s.push([c, cumple ? 'amarra' : llega ? 'obliga' : 'peor']);
      if (llega) cumple = true;
    });
    return s;
  }
  const valJ2 = val => [val.r, val.v, val.n];
  function lecturaJ2(val) {
    const x = valJ2(val), t = suma(x), i = x.findIndex(y => y >= META2);
    if (i >= 0) return [`Ya hay ${cant(U1[i][0], x[i])}: la meta se cumple`];
    if (!t) return ['Todavía no sale nada: elige qué saca la mala suerte'];
    const queda = x.some((y, k) => y < META2 - 1 && y < U1[k][1]);
    return [`${pl(t, BOL)} sin 3 iguales: ${queda ? 'aún cabe algo sin cumplir' : 'la siguiente repite un color por tercera vez'}`];
  }
  const PEOR2 = peorCuentas(U1.map(x => x[1]), v => Math.max(...v) >= META2);
  if (PEOR2.max !== 6) throw new Error('juego de la idea 2: el peor caso debe ser 6');
  // La predicción: 3 alumnos el mismo mes. Peor caso: 2 en cada mes (24); el 25 obliga.
  const K_P2 = 3, R_P2 = (K_P2 - 1) * MESES.length + 1;
  const calP2 = (n, o = {}) => ({ escena: 'casilleros', tituloCal: 'Cumpleaños del salón', columnas: 4, meta: 'Meta: 3 el mismo mes, con certeza',
    casilleros: MESES.map((t, k) => (o.mira ? { t, n: k ? K_P2 - 1 : K_P2, papeles: k ? ['peor', 'peor'] : ['peor', 'peor', 'obliga'], desdes: k ? [1, 2] : [1, 2, 3] }
      : { t, n: n === null ? 0 : (k ? n : n + (o.mas || 0)), papeles: Array.from({ length: K_P2 }, (_, j) => (j < K_P2 - 1 ? 'peor' : 'obliga')) })),
    ...(o.cuenta ? { cuenta: o.cuenta } : {}) });
  const cuentaP2 = [{ t: `${f0(R_P2 - 1)} sin 3 iguales`, papel: 'peor', desde: 2 }, { t: '+ 1 obliga', papel: 'obliga', desde: 3 }, { t: `= ${f0(R_P2)}`, papel: 'seguro', desde: 4 }];

  // ---------- Casos de «Así se resuelve» y «Ahora tú» de la idea 2 ----------
  // k del mismo color: en cada color, lo pedido menos 1 o todas las que tiene si son menos; uno más obliga.
  function casoMismo(r, nc, conEscaso) {
    for (let t = 0; t < 400; t++) {
      const k = r.ent(3, 5), urna = urnaAzar(r, nc, k, k + 6);
      if (conEscaso) { const i = r.ent(0, nc - 1); urna[i][1] = r.ent(1, k - 2); }
      const topes = urna.map(x => x[1]), peorN = suma(topes.map(x => Math.min(x, k - 1)));
      if (!topes.some(x => x >= k) || usado('palomar', kMismo(urna, k))) continue;
      if (peorCuentas(topes, v => Math.max(...v) >= k).max !== peorN) throw new Error('casoMismo');
      const escasos = urna.filter(x => x[1] < k - 1);
      if (conEscaso !== escasos.length > 0) continue;
      return { urna, k, topes, peorN, bien: peorN + 1, escasos, T: totalU(urna) };
    }
    return null;
  }
  function distMismo(cs) {
    const nc = cs.urna.length, todos = (cs.k - 1) * nc + 1;
    return [
      { id: 'suerte', valor: cs.k, error: 'RM6', siFuera: `Con buena suerte, las ${f0(cs.k)} primeras serían del mismo color. La certeza pide la peor suerte.` },
      { id: 'sin1', valor: cs.peorN, error: 'RMP34', siFuera: `Armaste bien el peor caso: ${f0(cs.peorN)} sin ${f0(cs.k)} iguales. Falta la siguiente, la que obliga.` },
      { id: 'escaso', valor: todos, error: 'RMP33', siFuera: `Diste ${f0(cs.k - 1)} a cada color, pero un color con menos bolitas solo aporta las que tiene.` },
      { id: 'cada', valor: cs.k * nc, error: 'RMP153', siFuera: `${f0(cs.k * nc)} es ${f0(cs.k)} de cada color; la meta pide ${f0(cs.k)} de uno solo.` },
      { id: 'mas1', valor: nc + 1, error: 'RMP155', siFuera: `Con ${f0(nc + 1)} se repite un color, pero solo dos veces; la meta pide ${f0(cs.k)}.` },
    ];
  }
  const casillerosDe = (nombres, o = {}) => ({ escena: 'casilleros', tituloCal: o.titulo || 'Cumpleaños', columnas: nombres.length === 7 ? 4 : 4,
    meta: o.meta, casilleros: nombres.map(t => ({ t, n: 0 })) });
  // El calendario: casilleros (meses, días de la semana, días del mes o fechas), k personas en el mismo.
  const CALS = {
    mes: { c: 12, nombre: 'el mismo mes', dato: 'Un año tiene 12 meses; cada persona cumple años en uno.', dib: () => casillerosDe(MESES, { titulo: 'Meses del año' }) },
    semana: { c: 7, nombre: 'el mismo día de la semana', dato: 'La semana tiene 7 días; cada persona nació en uno de ellos.', dib: () => casillerosDe(DIAS, { titulo: 'Días de la semana' }) },
    dia: { c: 31, nombre: 'el mismo día del mes (de 1 a 31)', dato: 'Los días del mes van del 1 al 31; cada persona nació en uno.' },
    fecha: { c: 366, nombre: 'el mismo día y mes', dato: 'Las fechas posibles son los 365 días del año y el 29 de febrero.' },
  };
  const PER = ['persona', 'personas'];
  function distCal(cal, k, ya) {
    const bien = (k - 1) * cal.c + 1 - ya;
    const d = [
      { id: 'suerte', valor: ya ? 1 : k, error: 'RM6', siFuera: ya ? 'Con suerte, el siguiente coincide con alguien. La certeza pide la peor suerte.' : `Con suerte, los ${f0(k)} primeros coinciden. La certeza pide la peor suerte.` },
      { id: 'sin1', valor: bien - 1, error: 'RMP34', siFuera: `Con ${f0((k - 1) * cal.c)} en total puede haber justo ${f0(k - 1)} en cada casillero. Falta uno que obligue.` },
      { id: 'cada', valor: k * cal.c - ya, error: 'RMP153', siFuera: `Eso es pedir ${f0(k)} en cada casillero; la meta pide ${f0(k)} en uno solo, no en todos.` },
    ];
    if (k > 2) d.push({ id: 'mas1', valor: cal.c + 1 - ya, error: 'RMP155', siFuera: `Con ${f0(cal.c + 1)} en total se repite un casillero, pero solo dos veces.` });
    if (cal.c === 366) d.unshift({ id: 'bis', valor: (k - 1) * 365 + 1 - ya, error: 'RMP33', siFuera: 'Contaste 365 fechas. Alguien puede haber nacido el 29 de febrero: son 366.' });
    if (ya) d.unshift({ id: 'resta', valor: bien + ya, error: 'RMP92', siFuera: `${f0(bien + ya)} es el total que asegura la meta; ya hay ${f0(ya)}: falta restarlos.` });
    return d;
  }

  const palo = {
    id: 'palomar',
    titulo: 'Más objetos que casilleros',
    pregunta: '¿Cuántos alumnos aseguran que tres cumplan años el mismo mes?',
    temas: ['Peor caso'],
    pieza: CR,
    aprendizaje: 'Para tener varios iguales, la peor suerte pone en cada casillero uno menos de lo pedido; uno más obliga a repetir.',
    actividad: 'Sacar bolitas evitando que algún color llegue a tres.',
    lee: {
      tarjetas: [
        { titulo: 'Del mismo color', texto: 'Otra meta para la tómbola: sacar 3 bolitas del mismo color, el que sea: rojas, verdes o negras. Piensa cada color como un casillero que se va llenando: hay más bolitas que casilleros.',
          pieza: CR, dibujo: { datos: tombola(U1, null, { meta: 'Meta: 3 del mismo color' }), estado: {} } },
        { titulo: 'Casilleros', texto: 'Cada bolita que sale cae en el casillero de su color. Un calendario también tiene casilleros: cada mes es uno, y cada persona cae en el mes de su cumpleaños.' },
        { titulo: 'Qué mirar al jugar', texto: 'Haz de mala suerte: saca bolitas sin que ningún color llegue a 3. Mira cuántas caben en cada casillero antes de que uno se llene.' },
      ],
    },
    juega: {
      pieza: CR,
      consigna: 'La misma tómbola: 5 rojas, 4 verdes y 3 negras. La meta ahora: 3 del mismo color, el que sea. Tú haces de mala suerte.',
      mision: {
        texto: 'Saca la mayor cantidad de bolitas sin tener 3 del mismo color.',
        logrado: v => Math.max(...valJ2(v)) < META2 && suma(valJ2(v)) === PEOR2.max,
        bien: [`Peor caso: ${f0(META2 - 1)} de cada color, ${pl(PEOR2.max, BOL)}. La siguiente repite un color por tercera vez.`],
      },
      voz: '¿Cuántas caben de cada color sin llegar a 3?',
      leyenda: [
        { s: 'R, V, N', t: 'bolita roja, verde o negra' },
        { s: O('borde naranja'), t: 'salió y todavía no cumple la meta' },
        { s: I('borde turquesa'), t: 'la que completa 3 iguales' },
      ],
      controles: [
        { id: 'r', etiqueta: 'Rojas que salen', min: 0, max: 5, paso: 1, inicio: 0, decimales: 0 },
        { id: 'v', etiqueta: 'Verdes que salen', min: 0, max: 4, paso: 1, inicio: 0, decimales: 0 },
        { id: 'n', etiqueta: 'Negras que salen', min: 0, max: 3, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: val => ({ datos: tombola(U1, seqParejo(valJ2(val), ['R', 'V', 'N'], META2), { meta: 'Meta: 3 del mismo color' }), estado: {} }),
      lectura: val => lecturaJ2(val),
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuántos alumnos debe tener un salón, como mínimo, para que con certeza 3 de ellos cumplan años el mismo mes?',
      datos: ['Un año tiene 12 meses.', 'Cada alumno cumple años en un solo mes.'],
      voz: 'Cada mes es un casillero.',
      opciones: [
        { id: 'c', texto: `${f0(R_P2)} alumnos`, correcta: true },
        { id: 'tres', texto: '3 alumnos', error: 'RM6', siFuera: 'Con suerte, los tres primeros nacieron el mismo mes. La certeza pide que alcance con la peor suerte.' },
        { id: 'sin1', texto: `${f0(R_P2 - 1)} alumnos`, error: 'RMP34', siFuera: `Con ${f0(R_P2 - 1)} puede haber justo 2 por mes: ninguno con 3. Falta uno que obligue.` },
        { id: 'cada', texto: `${f0(K_P2 * 12)} alumnos`, error: 'RMP153', siFuera: `${f0(K_P2 * 12)} es pedir 3 en cada mes; la meta pide 3 en un mismo mes, no en los 12.` },
        { id: 'trece', texto: '13 alumnos', error: 'RMP155', siFuera: 'Con 13, dos cumplen el mismo mes; para que sean 3 hacen falta más.' },
      ],
      dibujo: { datos: calP2(null), estado: {} },
      revelar: { datos: calP2(null, { mira: true, cuenta: cuentaP2 }), estado: { corte: 4 } },
      coincide: `Coincide: 2 en cada mes son ${f0(R_P2 - 1)} sin cumplir; el que sigue obliga.`,
      noCoincide: 'Revisemos: la peor suerte reparte parejo, 2 en cada mes, antes de repetir 3.',
    },
    mira: {
      pieza: CR,
      datos: calP2(null, { mira: true, cuenta: cuentaP2 }),
      voz: 'Parejo, vuelta por vuelta.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La peor suerte reparte parejo: un alumno en cada mes.', ecuacion: ['1 × 12 = 12'] },
        { estado: { corte: 2 }, texto: 'Otra vuelta: 2 en cada mes, y todavía ningún mes con 3.', ecuacion: [`2 × 12 = ${f0(R_P2 - 1)}`] },
        { estado: { corte: 3 }, texto: `El alumno ${f0(R_P2)} cae en un mes que ya tiene 2: obliga.`, ecuacion: [`${f0(R_P2 - 1)} + 1 = ${f0(R_P2)}`] },
        { estado: { corte: 4 }, texto: `Es el principio del palomar: con ${f0(R_P2 - 1)} podía fallar; con ${f0(R_P2)}, no.` },
      ],
    },
    regla: {
      texto: 'Para asegurar varios en un mismo casillero, la peor suerte pone en cada casillero uno menos de lo pedido. Uno más obliga a repetir.',
      ecuacion: [{ llave: ['(pedido − 1) × casilleros'], nota: 'peor caso', color: 'c-o' }, ' + 1'],
      condicion: 'cada objeto cae en un solo casillero. Si un casillero no llega a «lo pedido − 1», aporta solo los que tiene.',
      voz: 'Parejo hasta el borde, y uno más.',
    },
    // En el mundo: el palomar con números de pelos en Lima (no cumpleaños: esos son la Predice y los ejemplos). Los
    // casilleros van del 0 al 999 999, porque nadie se acerca a un millón de pelos; la cuenta la hace el código.
    // Revisión del Escribidor Escribano (28 nov): la cifra de pelos salía de un sitio comercial (Medihair) y se decía
    // como hecho. Ahora sale de StatPearls (NCBI): «Anatomy, Hair» da 80 000 a 120 000 pelos terminales en personas
    // sanas y «Hair Transplantation», 100 000 a 150 000 folículos; se dice como estimación y con el techo más alto.
    // Lima: el INEI dio 10,1 millones en mayo de 2026 y 9,6 millones en los resultados por provincia (julio); con
    // cualquiera de las dos pasa de 9 000 001, así que el texto dice «cerca de 10 millones».
    mundo: (() => {
      const C = 1000000, K = 10, peorL = (K - 1) * C + 1, CIUDAD = 3 * C + 1;
      return {
        hecho: `Al menos ${K === 10 ? 'diez' : f0(K)} limeños tienen el mismo número de pelos`,
        parrafos: [
          `Los manuales de medicina calculan que una cabeza sana tiene entre ${f0(80000)} y ${f0(150000)} pelos, según la persona, así que nadie se acerca a un millón. Lima Metropolitana tiene cerca de 10 millones de habitantes según los Censos Nacionales 2025, muchas más personas que números de pelos posibles.`,
          [`Cada número de pelos, del 0 al ${f0(C - 1)}, es un casillero, y cada persona cae en el de su cabeza. La peor suerte pone ${f0(K - 1)} personas en cada casillero, y una más ya obliga a que diez compartan uno:`,
            { linea: [O(`${f0(K - 1)} × ${f0(C)}`), ` + 1 = ${f0(peorL)}`] },
            'Lima tiene más gente que esa cantidad, así que diez personas, por lo menos, tienen el mismo número de pelos.'],
        ],
        pregunta: {
          texto: `Si en una ciudad vivieran ${f0(CIUDAD)} personas, ¿cuántas, como mínimo, tendrían con certeza el mismo número de pelos?`,
          opciones: [
            { id: 'c', texto: '4 personas', correcta: true },
            { id: 'tres', texto: '3 personas', error: 'RMP34',
              siFuera: `Es cierto que ${f0(3 * C)} personas llenan los casilleros con 3 en cada uno. Pero en la ciudad vive una persona más, y esa persona tiene que caer en un casillero que ya tiene 3.` },
            { id: 'dos', texto: '2 personas', error: 'RMP155',
              siFuera: 'Dos iguales es seguro apenas hay más personas que casilleros. Pero aquí hay más del triple de personas que casilleros, y la peor suerte no logra dejar solo dos en cada uno.' },
            { id: 'nada', texto: 'Ninguna, porque hay personas que no tienen pelo', error: 'RMP78',
              siFuera: 'Es verdad que hay personas sin pelo, pero el 0 también es un casillero: quien no tiene pelo cae ahí, y la cantidad de casilleros no cambia.' },
          ],
          porque: `La peor suerte pone 3 personas en cada uno de los ${f0(C)} casilleros y así acomoda a ${f0(3 * C)}. La persona que sobra cae en un casillero que ya tiene 3, y lo deja con 4.`,
        },
        fuente: 'Pelos: StatPearls (NCBI), «Anatomy, Hair» y «Hair Transplantation»; población: INEI, Censos Nacionales 2025.',
      };
    })(),
    ejemplos: null,
    // Así se resuelve: una bolsa con un color escaso (la condición de la regla). «Ahora tú»: la tómbola y los calendarios.
    resuelve: {
      pieza: CR,
      generar(s) {
        const r = azar(s + 900), cs = casoMismo(r, 3, true), op = { titulo: 'Bolsa del sorteo', meta: `Meta: ${f0(cs.k)} del mismo color` };
        const partes = cs.urna.map(([c, n]) => Math.min(n, cs.k - 1));
        return {
          enunciado: `Una bolsa del sorteo tiene ${urnaTxt(cs.urna)}. ¿Cuántas bolitas hay que sacar, como mínimo, para tener con certeza ${f0(cs.k)} del mismo color?`,
          datos: [D_SIN, D_CERT],
          dibujo: { datos: tombola(cs.urna, null, op), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden el menor número de bolitas que asegura ${f0(cs.k)} de un mismo color, el que sea.` },
            { tipo: 'datos', texto: `Cada color es un casillero. De ${lista(cs.escasos.map(([c, n]) => nom(c, 2)))} hay menos de ${f0(cs.k - 1)}.` },
            { tipo: 'regla', texto: `La peor suerte pone en cada color uno menos de lo pedido, ${f0(cs.k - 1)}; un color con menos aporta todas las suyas. Uno más obliga.` },
            { tipo: 'cuentas', texto: 'Peor caso, color por color:', ecuacion: [`${partes.map(f0).join(' + ')} = ${f0(cs.peorN)}`],
              dibujo: { datos: tombola(cs.urna, seqParejo(partes, cs.urna.map(x => x[0]), cs.k), op), estado: {} } },
            { tipo: 'cuentas', texto: `La siguiente cae en un color que ya tiene ${f0(cs.k - 1)}: obliga.`, ecuacion: [`${f0(cs.peorN)} + 1 = `, F(f0(cs.bien))],
              dibujo: { datos: tombola(cs.urna, seqParejo(partes.map((x, i) => x + (i === cs.topes.findIndex(y => y >= cs.k) ? 1 : 0)), cs.urna.map(x => x[0]), cs.k), op), estado: {} } },
            { tipo: 'sentido', texto: `Si diera ${f0(cs.k - 1)} a cada color contaría bolitas que no existen.` },
          ],
          respuesta: [F(pl(cs.bien, BOL))],
        };
      },
    },
    // Ahora tú (semilla % 4): 0 tómbola de tres colores, todos con bastantes · 1 cuatro colores, uno escaso · 2 calendario:
    // meses o días de la semana · 3 nivel examen: días del mes, fechas con el 29 de febrero o «ya hay m, ¿cuántos más?».
    ahoraTu: {
      pieza: CR,
      voz: 'Uno menos de lo pedido en cada casillero.',
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo <= 1) {
          const cs = casoMismo(r, tipo === 0 ? 3 : 4, tipo === 1), partes = cs.urna.map(([, n]) => Math.min(n, cs.k - 1)), meta = `Meta: ${f0(cs.k)} del mismo color`;
          return { pregunta: `En la tómbola hay ${urnaTxt(cs.urna)}. ¿Cuántas bolitas hay que sacar, como mínimo, para tener con certeza ${f0(cs.k)} del mismo color?`,
            datos: [D_SIN, D_CERT], dibujo: { datos: tombola(cs.urna, null, { meta }), estado: {} }, opciones: opcionesNum(cs.bien, BOL, distMismo(cs), 5),
            solucion: { texto: `En cada color, ${f0(cs.k - 1)} o las que haya si son menos. La siguiente obliga.`, ecuacion: [`${partes.map(f0).join(' + ')} + 1 = `, F(f0(cs.bien))],
              dibujo: { datos: tombola(cs.urna, seqParejo(partes, cs.urna.map(x => x[0]), cs.k), { meta }), estado: {} } } };
        }
        let cal, k, ya, total;
        do {
          cal = tipo === 2 ? CALS[r.elegir(['mes', 'semana'])] : CALS[r.elegir(['dia', 'fecha', 'mes'])];
          k = cal.c > 31 ? r.ent(2, 3) : r.ent(2, 5);
          const conYa = tipo === 3 && cal.c !== 31 && r() < 0.6;
          total = (k - 1) * cal.c + 1; ya = conYa ? r.ent(Math.ceil(total / 2), total - 2) : 0;
        } while (usado('palomar', kCal(cal.c, k, ya)));
        const bien = total - ya;
        const preg = ya ? `En un club ya hay ${pl(ya, PER)} inscritas. ¿Cuántas más deben inscribirse, como mínimo, para que con certeza ${f0(k)} cumplan años ${cal.nombre}?`
          : `¿Cuántas personas debe haber, como mínimo, para que con certeza ${f0(k)} de ellas cumplan años ${cal.nombre}?`;
        return { pregunta: preg, datos: [cal.dato, D_CERT],
          dibujo: cal.dib ? { datos: Object.assign(cal.dib(), { meta: `Meta: ${f0(k)} en un mismo casillero` }), estado: {} } : undefined,
          opciones: opcionesNum(bien, PER, distCal(cal, k, ya), 5),
          solucion: { texto: `Peor caso: ${f0(k - 1)} en cada uno de los ${f0(cal.c)} casilleros; uno más obliga${ya ? `, y ya hay ${f0(ya)}` : ''}.`,
            ecuacion: ya ? [`${f0(k - 1)} × ${f0(cal.c)} + 1 − ${f0(ya)} = `, F(f0(bien))] : [`${f0(k - 1)} × ${f0(cal.c)} + 1 = `, F(f0(bien))] } };
      },
    },
  };

  // ---------- Ejemplos de «Más objetos que casilleros» ----------
  // Resueltos aparte (e7-rm/ejemplos.py): 1 → 4 · 2 → 8 · 3 → 3 · 4 → 13 · 5 → 5 · 6 → 8 · 7 → 22 · 8 → 32 · 9 → 5 ·
  // 10 → 10 · 11 → 21 (B) · 12 → 87 (C) · 13 → 22 (D) · 14 → 14 (E) · 15 → 29 (A).
  function ejMismo(o) {
    const { urna, k } = o, topes = urna.map(x => x[1]), partes = topes.map(x => Math.min(x, k - 1)), peorN = suma(partes), bien = peorN + 1;
    if (peorCuentas(topes, v => Math.max(...v) >= k).max !== peorN) throw new Error(`ejemplo «${o.titulo}»`);
    const escasos = urna.filter(x => x[1] < k - 1);
    const sol = [
      { texto: `Cada color es un casillero. La peor suerte saca ${f0(k - 1)} de cada uno${escasos.length ? `; de ${lista(escasos.map(([c]) => nom(c, 2)))}, solo las que hay` : ''}.`, ecuacion: [`${partes.map(f0).join(' + ')} = ${f0(peorN)}`] },
      { texto: `La siguiente cae en un color que ya tiene ${f0(k - 1)}: obliga.`, ecuacion: [`${f0(peorN)} + 1 = `, F(f0(bien))] },
    ];
    return ejCierra(Object.assign({ _caso: kMismo(urna, k) }, o), bien, sol, `En ${o.recipTxt || 'la tómbola'} hay ${urnaTxt(urna)}. ¿Cuántas ${o.cosa ? o.cosa[1] : 'bolitas'} hay que sacar, como mínimo, para tener con certeza ${f0(k)} del mismo color?`,
      figT(urna, `Meta: ${f0(k)} del mismo color`, o.titulo2 ? { titulo: o.titulo2, recipiente: o.recipiente } : {}), o.cosa || BOL);
  }
  function ejCal(o) {
    const cal = CALS[o.cal], { k } = o, ya = o.ya || 0, bien = (k - 1) * cal.c + 1 - ya;
    const sol = [
      { texto: `Hay ${f0(cal.c)} casilleros. La peor suerte pone ${f0(k - 1)} en cada uno sin que ${f0(k)} coincidan.`, ecuacion: [`${f0(k - 1)} × ${f0(cal.c)} = ${f0((k - 1) * cal.c)}`] },
      { texto: 'Una persona más cae en un casillero lleno: obliga.', ecuacion: [`${f0((k - 1) * cal.c)} + 1 = ${ya ? f0(bien + ya) : ''}`, ...(ya ? [] : [F(f0(bien))])] },
    ];
    if (ya) sol.push({ texto: `Ya hay ${f0(ya)}: faltan`, ecuacion: [`${f0(bien + ya)} − ${f0(ya)} = `, F(f0(bien))] });
    const enun = ya ? `En ${o.lugar} ya hay ${pl(ya, PER)} inscritas. ¿Cuántas más deben inscribirse, como mínimo, para que con certeza ${f0(k)} cumplan años ${cal.nombre}?`
      : `¿Cuántas personas debe haber, como mínimo, para que con certeza ${f0(k)} de ellas cumplan años ${cal.nombre}?`;
    return ejCierra(Object.assign({ _caso: kCal(cal.c, k, ya) }, o), bien, sol, enun, cal.dib ? { pieza: CR, datos: Object.assign(cal.dib(), { meta: `Meta: ${f0(k)} en un mismo casillero` }), estado: {} } : undefined, PER);
  }
  const datosCal = c => [CALS[c].dato, D_CERT];
  const EJEMPLOS_PALO = [
    ejMismo({ nivel: 1, titulo: 'Dos del mismo color', urna: [['R', 3], ['V', 3], ['N', 3]], k: 2 }),
    ejCal({ nivel: 1, titulo: 'Mismo día de la semana', cal: 'semana', k: 2, datos: datosCal('semana') }),
    ejMismo({ nivel: 1, titulo: 'Medias del mismo color', urna: [['N', 8], ['B', 6]], k: 2, recipTxt: 'un cajón oscuro', titulo2: 'Cajón', recipiente: 'cajon', cosa: ['media', 'medias'],
      enunciado: 'En un cajón oscuro hay 8 medias negras y 6 blancas, sueltas. ¿Cuántas hay que sacar, como mínimo, para tener con certeza 2 del mismo color?' }),
    ejCal({ nivel: 1, titulo: 'Dos el mismo mes', cal: 'mes', k: 2, datos: datosCal('mes') }),
    ejMismo({ nivel: 1, titulo: 'Tres iguales entre dos colores', urna: [['R', 5], ['V', 5]], k: 3 }),
    ejMismo({ nivel: 2, titulo: 'Un color escaso', urna: [['R', 6], ['V', 5], ['N', 1]], k: 4 }),
    ejCal({ nivel: 2, titulo: 'Cuatro el mismo día', cal: 'semana', k: 4, datos: datosCal('semana') }),
    ejCal({ nivel: 2, titulo: 'El mismo día del mes', cal: 'dia', k: 2, datos: datosCal('dia') }),
    ejCal({ nivel: 2, titulo: 'Ya hay 20 en el taller', cal: 'mes', k: 3, ya: 20, lugar: 'el taller de danza', datos: datosCal('mes') }),
    ejMismo({ nivel: 2, titulo: 'Dos colores escasos', urna: [['R', 7], ['V', 6], ['N', 2], ['B', 1]], k: 4 }),
    ejMismo({ nivel: 3, titulo: 'Muchas de cada color', urna: [['R', 10], ['V', 10], ['N', 10], ['B', 10]], k: 6,
      alts: [{ v: 6 }, { v: 21, ok: true }, { v: 20 }, { v: 24 }, { v: 5 }],
      explica: '6 es con buena suerte; 20 olvida la que obliga; 24 son 6 de cada color; 5 solo asegura que se repita un color dos veces.' }),
    ejCal({ nivel: 3, titulo: 'Fechas de cumpleaños', cal: 'fecha', k: 2, ya: 280, lugar: 'una academia', datos: datosCal('fecha'),
      alts: [{ v: 1 }, { v: 367 }, { v: 87, ok: true }, { v: 86 }, { v: 88 }],
      explica: '1 es con buena suerte; 367 es el total, sin restar a los inscritos; 86 olvida el 29 de febrero; 88 suma uno de más.' }),
    (() => {
      // Fichas del 1 al 30: la suma de cifras es el casillero. Cuántas hay con cada suma (11 tiene una sola: el 29).
      const cuenta = {};
      for (let x = 1; x <= 30; x++) { const s = String(x).split('').reduce((a, b) => a + +b, 0); cuenta[s] = (cuenta[s] || 0) + 1; }
      const sumas = Object.keys(cuenta).map(Number), peorN = suma(sumas.map(s => Math.min(cuenta[s], 2))), bien = peorN + 1;
      const pocos = sumas.filter(s => cuenta[s] < 2);
      if (bien !== 22 || pocos.join() !== '11') throw new Error('ejemplo de suma de cifras');
      return { nivel: 3, titulo: 'La misma suma de cifras', enunciado: 'En una bolsa hay 30 fichas numeradas del 1 al 30. ¿Cuántas hay que sacar, como mínimo, para tener con certeza 3 cuya suma de cifras sea la misma?',
        alternativas: ['3 fichas', `${f0(2 * sumas.length + 1)} fichas`, `${f0(peorN)} fichas`, `${f0(bien)} fichas`, `${f0(3 * sumas.length)} fichas`],
        datos: [D_SIN, 'Suma de cifras: 27 tiene 2 + 7 = 9.', 'Del 1 al 30, la suma de cifras va de 1 a 11.'],
        figura: { pieza: CR, datos: { escena: 'recipiente', recipiente: 'tombola', titulo: 'Bolsa', meta: 'Meta: 3 con la misma suma de cifras',
          objetos: rango(1, 30).map(x => ({ forma: 'ficha', t: String(x) })) }, estado: {} },
        solucion: [{ texto: 'Cada suma de cifras es un casillero: son 11 (de 1 a 11). La suma 11 solo la tiene el 29.' },
          { texto: 'Peor caso: 2 fichas por suma, pero de la suma 11 solo una.', ecuacion: [`2 × 10 + 1 = ${f0(peorN)}`] },
          { texto: 'La siguiente completa 3 en alguna suma.', ecuacion: [`${f0(peorN)} + 1 = `, F(f0(bien))] },
          { texto: `3 es con buena suerte; ${f0(2 * sumas.length + 1)} da 2 a la suma 11, que tiene una; ${f0(peorN)} olvida la que obliga; ${f0(3 * sumas.length)} son 3 de cada suma.` }],
        respuesta: [F(`${f0(bien)} fichas`)] };
    })(),
    ejMismo({ nivel: 3, titulo: 'Cuatro colores, dos escasos', urna: [['R', 10], ['V', 8], ['N', 3], ['B', 2]], k: 5,
      alts: [{ v: 5 }, { v: 17 }, { v: 13 }, { v: 20 }, { v: 14, ok: true }],
      explica: '5 es con buena suerte; 17 da 4 a las negras y las blancas, que tienen menos; 13 olvida la que obliga; 20 son 5 de cada color.' }),
    ejCal({ nivel: 3, titulo: 'Cinco el mismo día', cal: 'semana', k: 5, datos: datosCal('semana'),
      alts: [{ v: 29, ok: true }, { v: 28 }, { v: 35 }, { v: 8 }, { v: 5 }],
      explica: '28 olvida la que obliga; 35 son 5 en cada día; 8 solo asegura dos el mismo día; 5 es con buena suerte.' }),
  ];
  palo.ejemplos = EJEMPLOS_PALO;
  juntar('palomar', EJEMPLOS_PALO, [kMismo(U1, META2), kCal(12, K_P2, 0)]);

  // ---------- Idea 3: una de cada clase ----------
  // Objeto: la tómbola y, en Predice, el cajón de los guantes de educación física (rm-certeza, recipiente «cajon»). Cambia:
  // cuántas bolitas de cada color salen. · Permanece: la tómbola. · Progresa: qué color queda para el final. · Se reserva:
  // los guantes izquierdos y derechos (Predice). · Debe verse: la peor suerte agota las clases más grandes.
  const valJ3 = val => [val.r, val.v, val.n];
  function seqClases(cuenta, colores, completa) {
    const s = [], vistos = colores.map(() => 0);
    let cumple = false;
    colores.forEach((c, i) => { for (let k = 0; k < cuenta[i]; k++) { vistos[i]++; const llega = !cumple && completa(vistos); s.push([c, cumple ? 'amarra' : llega ? 'obliga' : 'peor']); if (llega) cumple = true; } });
    return s;
  }
  const todas = v => v.every(x => x >= 1);
  function lecturaJ3(val) {
    const x = valJ3(val), t = suma(x), topes = U1.map(y => y[1]);
    if (todas(x)) return ['Ya hay una de cada color: la meta se cumple'];
    if (!t) return ['Todavía no sale nada: elige qué saca la mala suerte'];
    const queda = x.some((y, i) => y < topes[i] && !todas(x.map((z, j) => z + (j === i ? 1 : 0))));
    return [`${pl(t, BOL)} sin los tres colores: ${queda ? 'aún cabe algo sin cumplir' : 'la siguiente completa los tres colores'}`];
  }
  const PEOR3 = peorCuentas(U1.map(x => x[1]), todas);
  if (PEOR3.max !== 9) throw new Error('juego de la idea 3: el peor caso debe ser 9');
  // Guantes: cada par, un izquierdo (I) y un derecho (D). relleno 1: negro; 0: blanco.
  const guantes = pares => pares.flatMap(([c, p]) => ['I', 'D'].flatMap(m => Array.from({ length: p }, () => ({ forma: 'guante', t: m, relleno: c === 'N' ? 1 : 0 }))));
  // Las clases de guantes, en el orden de guantes(): negro I, negro D, blanco I, blanco D…
  const topesG = pares => pares.flatMap(([, p]) => [p, p]);
  const parUsable = (pares, solo) => v => pares.some(([c], i) => (!solo || c === solo) && v[2 * i] >= 1 && v[2 * i + 1] >= 1);
  // Lo que sale: índices de los guantes en el orden pedido ([[clase, papel, desde], …]; clase = 2·color + mano).
  function salenG(pares, seq) {
    const objs = guantes(pares), inicio = [], usados = new Set();
    let k = 0; for (const [, p] of pares) { inicio.push(k, k + p); k += 2 * p; }
    return seq.map(([cl, papel, desde]) => { let i = inicio[cl]; while (usados.has(i)) i++; usados.add(i); return Object.assign({ i, papel }, desde ? { desde } : {}); });
  }
  const cajon = (pares, seq, o = {}) => Object.assign({ escena: 'recipiente', recipiente: 'cajon', titulo: 'Cajón de guantes', objetos: guantes(pares) },
    o.meta ? { meta: o.meta } : {}, seq ? { salieron: salenG(pares, seq), reserva: 2 * suma(pares.map(x => x[1])) } : {}, o.cuenta ? { cuenta: o.cuenta } : {},
    { nota: [{ t: 'I: izquierdo · D: derecho' }, { t: 'En gris, los guantes negros' }] });
  const PARES_P3 = [['N', 4], ['B', 3]];
  const R_P3 = peorCuentas(topesG(PARES_P3), parUsable(PARES_P3)).max + 1;
  if (R_P3 !== 4 + 3 + 1) throw new Error('predicción de la idea 3');
  const seqP3 = [...Array(4).fill([0, 'peor', 1]), ...Array(3).fill([2, 'peor', 2]), [1, 'obliga', 3]];
  const cuentaP3 = [{ t: `${f0(R_P3 - 1)} izquierdos`, papel: 'peor', desde: 2 }, { t: '+ 1 obliga', papel: 'obliga', desde: 3 }, { t: `= ${f0(R_P3)}`, papel: 'seguro', desde: 4 }];
  const META_P3 = 'Meta: un par que se pueda usar';
  const D_PAR = 'Un par que se puede usar: un guante izquierdo y uno derecho, los dos del mismo color.';
  const GUA = ['guante', 'guantes'];
  const nomG = c => (c === 'N' ? 'negros' : 'blancos');
  const paresTxt = pares => lista(pares.map(([c, p]) => `${pl(p, ['par', 'pares'])} de guantes ${nomG(c)}`));

  // ---------- Casos de «Así se resuelve» y «Ahora tú» de la idea 3 ----------
  function casoCada(r, nc) {
    for (let t = 0; t < 200; t++) {
      const urna = urnaAzar(r, nc, 2, 9), topes = urna.map(x => x[1]), mn = Math.min(...topes);
      if (topes.filter(x => x === mn).length > 1 || esU1(urna) || usado('una-de-cada', kCada(urna))) continue;
      const bien = totalU(urna) - mn + 1;
      if (peorCuentas(topes, todas).max + 1 !== bien) throw new Error('casoCada');
      return { urna, topes, mn, bien, T: totalU(urna), chico: urna[topes.indexOf(mn)][0], grandes: urna.filter(x => x[1] !== mn) };
    }
    return null;
  }
  function distCada(cs) {
    const mx = Math.max(...cs.topes);
    return [
      { id: 'suerte', valor: cs.urna.length, error: 'RM6', siFuera: `Con buena suerte, las ${f0(cs.urna.length)} primeras serían de colores distintos. La certeza pide la peor suerte.` },
      { id: 'sin1', valor: cs.bien - 1, error: 'RMP34', siFuera: `Armaste bien el peor caso: ${f0(cs.bien - 1)} sin el color que falta. Falta la que obliga.` },
      { id: 'uno', valor: mx + 1, error: 'RMP31', siFuera: `Agotaste un solo color, ${f0(mx)} bolitas; la peor suerte agota también el siguiente más grande.` },
      { id: 'todo', valor: cs.T, error: 'RMP152', siFuera: `Sacar las ${f0(cs.T)} asegura los colores, pero sobran: el color más escaso no hace falta entero.` },
    ];
  }
  const seqCada = cs => seqClases(cs.urna.map(x => (x[0] === cs.chico ? 1 : x[1])), cs.urna.map(x => x[0]), todas);
  // Guantes: de cualquier color o de uno dado.
  function casoGuantes(r, solo) {
    let pares, c;
    do {
      pares = [['N', r.ent(2, 7)], ['B', r.ent(2, 7)]];
      if (pares[0][1] === pares[1][1]) pares[1][1]++;
      c = solo ? r.elegir(['N', 'B']) : null;
    } while (usado('una-de-cada', kGu(pares, c)));
    const topes = topesG(pares);
    const p = peorCuentas(topes, parUsable(pares, c)), bien = p.max + 1, T = suma(topes);
    const otros = c ? 2 * suma(pares.filter(x => x[0] !== c).map(x => x[1])) : 0, pc = c ? pares.find(x => x[0] === c)[1] : 0;
    if (bien !== (c ? otros + pc + 1 : suma(pares.map(x => x[1])) + 1)) throw new Error('casoGuantes');
    return { pares, c, bien, T, otros, pc };
  }
  function distGuantes(cs) {
    const d = [{ id: 'suerte', valor: 2, error: 'RM6', siFuera: 'Con buena suerte, los dos primeros guantes forman par. La certeza pide la peor suerte.' },
      { id: 'sin1', valor: cs.bien - 1, error: 'RMP34', siFuera: `Con ${f0(cs.bien - 1)} pueden faltar todavía: ${cs.c ? 'de su color, todos de una mano' : 'pueden ser todos de una sola mano'}.` },
      { id: 'todo', valor: cs.T, error: 'RMP152', siFuera: `Sacar los ${f0(cs.T)} asegura el par, pero sobran: la peor suerte cumple antes.` }];
    if (cs.c) {
      d.push({ id: 'color', valor: cs.otros + 2, error: 'RMP31', siFuera: `Agotaste el otro color, pero de ${nomG(cs.c)} pueden salir ${f0(cs.pc)} de una sola mano sin formar par.` });
      d.push({ id: 'olvida', valor: cs.pc + 1, error: 'RMP30', siFuera: `Miraste solo los ${nomG(cs.c)}; antes pueden salir los ${f0(cs.otros)} del otro color.` });
    } else d.push({ id: 'color', valor: 3, error: 'RMP31', siFuera: 'Con 3, dos son del mismo color, pero pueden ser dos izquierdos: no se usan.' });
    return d;
  }
  const seqGuantes = cs => {
    const s = [];
    cs.pares.forEach(([c, p], i) => {
      if (cs.c && c !== cs.c) { for (let k = 0; k < p; k++) s.push([2 * i, 'peor'], [2 * i + 1, 'peor']); }
      else for (let k = 0; k < p; k++) s.push([2 * i, 'peor']);
    });
    const ic = cs.c ? cs.pares.findIndex(x => x[0] === cs.c) : 0;
    s.push([2 * ic + 1, 'obliga']);
    return s;
  };
  // Nivel examen: al menos k de dos colores a la vez (2025-I, pregunta 28).
  function casoDosColores(r) {
    for (let t = 0; t < 200; t++) {
      const urna = urnaAzar(r, 4, 3, 9), k = r.ent(2, 3), [a, b] = r.barajar([0, 1, 2, 3]).slice(0, 2).sort();
      if (urna[a][1] < k || urna[b][1] < k || urna[a][1] === urna[b][1] || usado('una-de-cada', kDos(urna, urna[a][0], urna[b][0], k))) continue;
      const topes = urna.map(x => x[1]), p = peorCuentas(topes, v => v[a] >= k && v[b] >= k);
      const otros = suma(topes.filter((_, i) => i !== a && i !== b)), mx = Math.max(topes[a], topes[b]), mn = Math.min(topes[a], topes[b]);
      if (p.max !== otros + mx + k - 1) throw new Error('casoDosColores');
      return { urna, k, a, b, bien: p.max + 1, otros, mx, mn, T: totalU(urna) };
    }
    return null;
  }

  const unaDeCada = {
    id: 'una-de-cada',
    titulo: 'Una de cada clase',
    pregunta: '¿Qué sale primero si la meta pide una de cada color?',
    temas: ['Peor caso', 'Extracción de objetos'],
    pieza: CR,
    aprendizaje: 'Si la meta pide una de cada clase, la peor suerte agota primero las clases más grandes; la que falta llega al final.',
    actividad: 'Sacar bolitas sin completar los tres colores, dejando uno para el final.',
    lee: {
      tarjetas: [
        { titulo: 'Una de cada color', texto: 'Nueva meta para la tómbola: tener por lo menos una bolita de cada color, una roja, una verde y una negra.',
          pieza: CR, dibujo: { datos: tombola(U1, null, { meta: 'Meta: una de cada color' }), estado: {} } },
        { titulo: 'Guantes sueltos', texto: 'En el cajón de educación física hay guantes sueltos. Cada guante es izquierdo o derecho. Un par que se puede usar es un izquierdo y un derecho del mismo color.' },
        { titulo: 'Qué mirar al jugar', texto: 'Haz de mala suerte: saca bolitas sin completar los tres colores. Prueba qué color te conviene dejar para el final.' },
      ],
    },
    juega: {
      pieza: CR,
      consigna: 'La tómbola de siempre: 5 rojas, 4 verdes y 3 negras. La meta ahora: una de cada color. Tú haces de mala suerte.',
      mision: {
        texto: 'Saca la mayor cantidad de bolitas sin tener una de cada color.',
        logrado: v => !todas(valJ3(v)) && suma(valJ3(v)) === PEOR3.max,
        bien: [`Peor caso: 5 rojas y 4 verdes, ${pl(PEOR3.max, BOL)}. La siguiente es negra.`],
      },
      voz: 'Prueba qué color conviene dejar para el final.',
      leyenda: [
        { s: 'R, V, N', t: 'bolita roja, verde o negra' },
        { s: O('borde naranja'), t: 'salió y todavía no cumple la meta' },
        { s: I('borde turquesa'), t: 'la que completa los tres colores' },
      ],
      controles: [
        { id: 'r', etiqueta: 'Rojas que salen', min: 0, max: 5, paso: 1, inicio: 0, decimales: 0 },
        { id: 'v', etiqueta: 'Verdes que salen', min: 0, max: 4, paso: 1, inicio: 0, decimales: 0 },
        { id: 'n', etiqueta: 'Negras que salen', min: 0, max: 3, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: val => ({ datos: tombola(U1, seqClases(valJ3(val), ['R', 'V', 'N'], todas), { meta: 'Meta: una de cada color' }), estado: {} }),
      lectura: val => lecturaJ3(val),
      minimo: 3,
    },
    predice: {
      pregunta: 'En el cajón hay 4 pares de guantes negros y 3 pares de guantes blancos, sueltos. ¿Cuántos hay que sacar, como mínimo, para tener con certeza un par que se pueda usar?',
      datos: [D_PAR, D_SIN],
      voz: 'Piensa qué clases de guante hay.',
      opciones: [
        { id: 'c', texto: pl(R_P3, GUA), correcta: true },
        { id: 'color', texto: pl(3, GUA), error: 'RMP31', siFuera: 'Con 3, dos son del mismo color, pero pueden ser dos izquierdos: no se usan.' },
        { id: 'sin1', texto: pl(R_P3 - 1, GUA), error: 'RMP34', siFuera: `Con ${f0(R_P3 - 1)} pueden ser todos izquierdos: ninguno forma par. Falta el que obliga.` },
        { id: 'todo', texto: pl(14, GUA), error: 'RMP152', siFuera: `Sacar los 14 asegura el par, pero sobran ${f0(14 - R_P3)}: la peor suerte cumple antes.` },
        { id: 'suerte', texto: pl(2, GUA), error: 'RM6', siFuera: 'Con suerte, dos guantes ya forman par. La certeza pide que alcance con la peor suerte.' },
      ],
      dibujo: { datos: cajon(PARES_P3, null, { meta: META_P3 }), estado: {} },
      revelar: { datos: cajon(PARES_P3, seqP3, { meta: META_P3, cuenta: cuentaP3 }), estado: { corte: 4 } },
      coincide: `Coincide: ${f0(R_P3 - 1)} de una sola mano no forman par; el siguiente sí.`,
      noCoincide: 'Revisemos: la peor suerte puede sacar solo izquierdos, de los dos colores.',
    },
    mira: {
      pieza: CR,
      datos: cajon(PARES_P3, seqP3, { meta: META_P3, cuenta: cuentaP3 }),
      voz: 'Las clases aquí son color y mano.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La peor suerte saca guantes de una sola mano: los 4 izquierdos negros.' },
        { estado: { corte: 2 }, texto: 'Después, los 3 izquierdos blancos. Van 7 y ningún par se usa.', ecuacion: [`4 + 3 = ${f0(R_P3 - 1)}`] },
        { estado: { corte: 3 }, texto: 'Ya no quedan izquierdos: el siguiente es derecho y forma par.', ecuacion: [`${f0(R_P3 - 1)} + 1 = ${f0(R_P3)}`] },
        { estado: { corte: 4 }, texto: 'Como en la tómbola: se agota todo y lo que falta llega al final.' },
      ],
    },
    regla: {
      texto: 'Para tener una de cada clase, la peor suerte saca enteras todas las clases menos la más chica, que llega al final. Con guantes, salen todos los de una mano.',
      ecuacion: [{ llave: ['peor caso'], nota: 'todas las clases menos la más chica', color: 'c-o' }, ' + ', { llave: ['1'], nota: 'la que falta', color: 'c-i' }],
      condicion: 'se saca sin mirar. Si se pide un par de un color dado, antes salen todos los guantes de los otros colores.',
      voz: 'Lo que falta llega al final.',
    },
    // En el mundo: el robo de las 220 zapatillas del pie derecho en Huancayo (2023). Zapatillas y no guantes (Predice).
    // Revisión del Escribidor Escribano (28 nov): Canal N, Correo y Semana dicen que se las llevaron en tres cajas
    // grandes (no «en sus cajas», que hacía pensar en cajas de zapatillas). «Salió entera la clase» no le cuadraba a un
    // robo; ahora se la llevaron. La izquierda que faltaba tenía que ser del mismo modelo y de la misma talla.
    mundo: {
      hecho: 'En Huancayo robaron 220 zapatillas, todas del pie derecho',
      parrafos: [
        'En 2023, unos ladrones entraron de madrugada a una tienda de calzado de Huancayo y se llevaron unas 220 zapatillas en tres cajas grandes. Todas eran del pie derecho, así que el botín no formaba ni un par que se pudiera vender.',
        ['Un par que se puede usar pide una zapatilla de cada pie, y los ladrones se llevaron justo la peor suerte: la clase entera del pie derecho. Con 220 zapatillas no lograron ni un par, y les habría bastado una izquierda del mismo modelo y talla:',
          { linea: [O('220 derechas'), ' + ', I('1 izquierda'), ' = un par'] }],
      ],
      pregunta: {
        texto: 'En un almacén a oscuras hay 40 zapatillas sueltas del mismo modelo y talla: 20 derechas y 20 izquierdas. ¿Cuántas hay que sacar, como mínimo, para tener con certeza un par?',
        opciones: [
          { id: 'c', texto: '21 zapatillas', correcta: true },
          { id: 'tres', texto: '3 zapatillas', error: 'RMP31',
            siFuera: 'Con medias de dos colores bastan 3, porque cualquier media hace par con otra del mismo color. Las zapatillas tienen pie, y entre 3 derechas no hay ningún par.' },
          { id: 'dos', texto: '2 zapatillas', error: 'RM6',
            siFuera: 'Con buena suerte, una derecha y una izquierda forman el par al segundo intento. La certeza pide que alcance también si salen solo derechas.' },
          { id: 'veinte', texto: '20 zapatillas', error: 'RMP34',
            siFuera: 'Es cierto que pueden salir las 20 derechas sin formar un par. Pero ahí la meta todavía no se cumple: falta la siguiente, que tiene que ser izquierda.' },
        ],
        porque: 'La peor suerte saca entera una clase, las 20 zapatillas de un mismo pie, sin formar ningún par. La siguiente es del otro pie y completa el par, así que hacen falta 21.',
      },
      fuente: 'Robo de unas 220 zapatillas del pie derecho en Huancayo, Canal N y Semana (mayo de 2023).',
    },
    ejemplos: null,
    // Así se resuelve: los guantes (cierre del 19 nov: la predicción es de guantes y las bolitas ya están en el juego,
    // en «Ahora tú» y en los ejemplos). Un par de cualquier color o de un color dado.
    resuelve: {
      pieza: CR,
      generar(s) {
        const r = azar(s + 900), cs = casoGuantes(r, r() < 0.5), pide = cs.c ? `un par ${cs.c === 'N' ? 'negro' : 'blanco'} que se pueda usar` : 'un par que se pueda usar';
        const meta = `Meta: ${pide}`, seq = seqGuantes(cs), otro = cs.c ? nomG(cs.pares.find(x => x[0] !== cs.c)[0]) : '';
        return {
          enunciado: `En el cajón de educación física hay ${paresTxt(cs.pares)}, sueltos. ¿Cuántos guantes hay que sacar, como mínimo, para tener con certeza ${pide}?`,
          datos: [D_PAR, D_SIN],
          dibujo: { datos: cajon(cs.pares, null, { meta }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden el menor número de guantes que asegura ${pide}: un izquierdo y un derecho${cs.c ? ` ${cs.c === 'N' ? 'negros' : 'blancos'}` : ' del mismo color'}.` },
            { tipo: 'datos', texto: cs.c ? `Los ${otro} no sirven. De los ${nomG(cs.c)} hay ${f0(cs.pc)} izquierdos y ${f0(cs.pc)} derechos.`
              : `Las clases son color y mano: izquierdos y derechos de cada color.` },
            { tipo: 'regla', texto: cs.c ? 'La peor suerte saca primero lo que no sirve y, del color pedido, solo una mano. El siguiente forma par.'
              : 'La peor suerte saca guantes de una sola mano, de todos los colores. El siguiente forma par.' },
            { tipo: 'cuentas', texto: cs.c ? `Peor caso: los ${f0(cs.otros)} ${otro} y ${f0(cs.pc)} ${nomG(cs.c)} de una sola mano.` : `Peor caso: los izquierdos de los dos colores, ${lista(cs.pares.map(([c, p]) => `${f0(p)} ${nomG(c)}`))}.`,
              ecuacion: cs.c ? [`${f0(cs.otros)} + ${f0(cs.pc)} = ${f0(cs.bien - 1)}`] : [`${cs.pares.map(x => f0(x[1])).join(' + ')} = ${f0(cs.bien - 1)}`],
              dibujo: { datos: cajon(cs.pares, seq.slice(0, -1), { meta }), estado: {} } },
            { tipo: 'cuentas', texto: cs.c ? `Ya no quedan ${nomG(cs.c)} de esa mano: el siguiente es de la otra y forma par.` : 'Ya no quedan izquierdos: el siguiente es derecho y forma par con el izquierdo de su color.', ecuacion: [`${f0(cs.bien - 1)} + 1 = `, F(f0(cs.bien))],
              dibujo: { datos: cajon(cs.pares, seq, { meta }), estado: {} } },
            { tipo: 'sentido', texto: cs.c ? `Mirar solo los ${nomG(cs.c)} daría ${f0(cs.pc + 1)}: olvida que antes pueden salir los ${otro}.` : 'Con 3 ya hay dos del mismo color, pero pueden ser los dos izquierdos: el color solo no basta.' },
          ],
          respuesta: [F(pl(cs.bien, GUA))],
        };
      },
    },
    // Ahora tú (semilla % 4): 0 una de cada color, cuatro colores · 1 un par de guantes de cualquier color · 2 un par de un
    // color dado · 3 nivel examen: al menos k de dos colores a la vez.
    ahoraTu: {
      pieza: CR,
      voz: 'Agota lo que más hay; lo que falta, al final.',
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo === 0) {
          const cs = casoCada(r, 4), meta = 'Meta: una de cada color';
          return { pregunta: `En la tómbola hay ${urnaTxt(cs.urna)}. ¿Cuántas bolitas hay que sacar, como mínimo, para tener con certeza una de cada color?`,
            datos: [D_SIN, D_CERT], dibujo: { datos: tombola(cs.urna, null, { meta }), estado: {} }, opciones: opcionesNum(cs.bien, BOL, distCada(cs), 5),
            solucion: { texto: `Salen todas, menos las ${nom(cs.chico, 2)}, que son las que menos hay. La siguiente completa.`, ecuacion: [`${f0(cs.T)} − ${f0(cs.mn)} + 1 = `, F(f0(cs.bien))],
              dibujo: { datos: tombola(cs.urna, seqCada(cs), { meta }), estado: {} } } };
        }
        if (tipo === 3) {
          const cs = casoDosColores(r), A = cs.urna[cs.a][0], B = cs.urna[cs.b][0], meta = `Meta: ${cant(A, cs.k)} y ${cant(B, cs.k)}`;
          const d = [{ id: 'suerte', valor: 2 * cs.k, error: 'RM6', siFuera: `Con buena suerte, las ${f0(2 * cs.k)} primeras serían justo las pedidas. La certeza pide la peor suerte.` },
            { id: 'sin1', valor: cs.bien - 1, error: 'RMP34', siFuera: `Armaste bien el peor caso: ${f0(cs.bien - 1)} sin cumplir. Falta la que obliga.` },
            { id: 'chico', valor: cs.otros + cs.mn + cs.k, error: 'RMP31', siFuera: `Agotaste el color pedido que menos hay; la peor suerte agota el que más hay: ${f0(cs.mx)}.` },
            { id: 'todo', valor: cs.T, error: 'RMP152', siFuera: `Sacar las ${f0(cs.T)} asegura la meta, pero sobran.` }];
          return { pregunta: `En la tómbola hay ${urnaTxt(cs.urna)}. ¿Cuántas hay que sacar, como mínimo, para tener con certeza ${cant(A, cs.k)} y ${cant(B, cs.k)}?`,
            datos: [D_SIN, D_CERT], dibujo: { datos: tombola(cs.urna, null, { meta }), estado: {} }, opciones: opcionesNum(cs.bien, BOL, d, 5),
            solucion: { texto: `Peor caso: los otros colores (${f0(cs.otros)}), todas las del color pedido que más hay (${f0(cs.mx)}) y ${f0(cs.k - 1)} del otro.`, ecuacion: [`${f0(cs.otros)} + ${f0(cs.mx)} + ${f0(cs.k - 1)} + 1 = `, F(f0(cs.bien))] } };
        }
        const cs = casoGuantes(r, tipo === 2), meta = cs.c ? `Meta: un par ${cs.c === 'N' ? 'negro' : 'blanco'} que se pueda usar` : 'Meta: un par que se pueda usar';
        return { pregunta: `En el cajón hay ${paresTxt(cs.pares)}, sueltos. ¿Cuántos hay que sacar, como mínimo, para tener con certeza un par ${cs.c ? `${cs.c === 'N' ? 'negro' : 'blanco'} ` : ''}que se pueda usar?`,
          datos: [D_PAR, D_SIN], dibujo: { datos: cajon(cs.pares, null, { meta }), estado: {} }, opciones: opcionesNum(cs.bien, GUA, distGuantes(cs), 5),
          solucion: { texto: cs.c ? `Peor caso: los ${f0(cs.otros)} del otro color y ${f0(cs.pc)} de una sola mano del pedido. El siguiente forma par.`
            : `Peor caso: los guantes de una sola mano, ${f0(cs.bien - 1)}. El siguiente forma par.`,
            ecuacion: cs.c ? [`${f0(cs.otros)} + ${f0(cs.pc)} + 1 = `, F(f0(cs.bien))] : [`${f0(cs.bien - 1)} + 1 = `, F(f0(cs.bien))],
            dibujo: { datos: cajon(cs.pares, seqGuantes(cs), { meta }), estado: {} } } };
      },
    },
  };

  // ---------- Ejemplos de «Una de cada clase» ----------
  // Resueltos aparte (e7-rm/ejemplos.py): 1 → 5 · 2 → 6 · 3 → 3 · 4 → 5 · 5 → 12 · 6 → 13 · 7 → 11 · 8 → 13 · 9 → 11 ·
  // 10 → 10 · 11 → 17 (C) · 12 → 21 (D) · 13 → 14 (E) · 14 → 22 (A) · 15 → 13 (B).
  function ejCada(o) {
    const { urna } = o, topes = urna.map(x => x[1]), mn = Math.min(...topes), bien = totalU(urna) - mn + 1;
    if (peorCuentas(topes, todas).max + 1 !== bien) throw new Error(`ejemplo «${o.titulo}»`);
    const chico = urna.find(x => x[1] === mn)[0], grandes = urna.filter(x => x[0] !== chico);
    const sol = [{ texto: `Lo que más hay sale primero: ${urnaTxt(grandes)}. Las ${nom(chico, 2)} quedan para el final.`, ecuacion: sumaOtros(grandes) },
      { texto: `La siguiente es ${nom(chico, 1)} y completa.`, ecuacion: [`${f0(bien - 1)} + 1 = `, F(f0(bien))] }];
    return ejCierra(Object.assign({ _caso: kCada(urna) }, o), bien, sol, `En la tómbola hay ${urnaTxt(urna)}. ¿Cuántas bolitas hay que sacar, como mínimo, para tener con certeza una de cada color?`,
      figT(urna, 'Meta: una de cada color'));
  }
  function ejGuantes(o) {
    const { pares, c } = o, topes = topesG(pares), bien = peorCuentas(topes, parUsable(pares, c)).max + 1;
    const otros = c ? 2 * suma(pares.filter(x => x[0] !== c).map(x => x[1])) : 0, pc = c ? pares.find(x => x[0] === c)[1] : 0;
    if (bien !== (c ? otros + pc + 1 : suma(pares.map(x => x[1])) + 1)) throw new Error(`ejemplo «${o.titulo}»`);
    const sol = c ? [
      { texto: `Los ${nomG(pares.find(x => x[0] !== c)[0])} no sirven: con la peor suerte salen los ${f0(otros)}.` },
      { texto: `De los ${nomG(c)}, ${f0(pc)} de una sola mano, sin par.`, ecuacion: [`${f0(otros)} + ${f0(pc)} = ${f0(bien - 1)}`] },
      { texto: 'El siguiente es de la otra mano y forma par.', ecuacion: [`${f0(bien - 1)} + 1 = `, F(f0(bien))] }]
      : [{ texto: `La peor suerte saca guantes de una sola mano: ${lista(pares.map(([cc, p]) => `${f0(p)} ${nomG(cc)}`))}.`, ecuacion: pares.length > 1 ? [`${pares.map(x => f0(x[1])).join(' + ')} = ${f0(bien - 1)}`] : undefined },
        { texto: 'El siguiente es de la otra mano y forma par con uno de su color.', ecuacion: [`${f0(bien - 1)} + 1 = `, F(f0(bien))] }];
    const pide = c ? `un par ${c === 'N' ? 'negro' : 'blanco'} que se pueda usar` : 'un par que se pueda usar';
    return ejCierra(Object.assign({ datos: [D_PAR, D_SIN], _caso: kGu(pares, c) }, o), bien, sol, `En el cajón hay ${paresTxt(pares)}, sueltos. ¿Cuántos hay que sacar, como mínimo, para tener con certeza ${pide}?`,
      { pieza: CR, datos: cajon(pares, null, { meta: `Meta: ${pide}` }), estado: {} }, GUA);
  }
  function ejDos(o) {
    const { urna, a, b, k } = o, topes = urna.map(x => x[1]), ia = urna.findIndex(x => x[0] === a), ib = urna.findIndex(x => x[0] === b);
    const p = peorCuentas(topes, v => v[ia] >= k && v[ib] >= k), bien = p.max + 1;
    const otros = urna.filter(x => x[0] !== a && x[0] !== b), grande = topes[ia] >= topes[ib] ? a : b, chico = grande === a ? b : a;
    if (p.max !== suma(otros.map(x => x[1])) + deU(urna, grande) + k - 1) throw new Error(`ejemplo «${o.titulo}»`);
    const sol = [{ texto: `No sirven: ${urnaTxt(otros)}. Y la peor suerte agota el color pedido que más hay: ${cant(grande, deU(urna, grande))}.` },
      { texto: `De las ${nom(chico, 2)}, ${f0(k - 1)} sin llegar a ${f0(k)}.`, ecuacion: [`${f0(suma(otros.map(x => x[1])))} + ${f0(deU(urna, grande))} + ${f0(k - 1)} = ${f0(p.max)}`] },
      { texto: `La siguiente es ${nom(chico, 1)} y completa.`, ecuacion: [`${f0(p.max)} + 1 = `, F(f0(bien))] }];
    return ejCierra(Object.assign({ _caso: kDos(urna, a, b, k) }, o), bien, sol, `En la tómbola hay ${urnaTxt(urna)}. ¿Cuántas hay que sacar, como mínimo, para tener con certeza ${cant(a, k)} y ${cant(b, k)}?`,
      figT(urna, `Meta: ${cant(a, k)} y ${cant(b, k)}`));
  }
  // Fichas cuadradas y redondas de dos colores: un par de distinta forma e igual color (2026-II, pregunta 28).
  function ejFormas(o) {
    const { clases } = o;   // [[color, cuadradas, redondas], …]
    const topes = clases.flatMap(x => [x[1], x[2]]), logra = v => clases.some((_, i) => v[2 * i] >= 1 && v[2 * i + 1] >= 1);
    const p = peorCuentas(topes, logra), bien = p.max + 1, mx = clases.map(x => Math.max(x[1], x[2]));
    if (p.max !== suma(mx)) throw new Error(`ejemplo «${o.titulo}»`);
    const objs = clases.flatMap(([c, q, rd]) => [...Array.from({ length: q }, () => ({ forma: 'carta', t: c })), ...Array.from({ length: rd }, () => ({ forma: 'bola', t: c }))]);
    const txt = clases.map(([c, q, rd]) => `${nom(c, 2)}: ${f0(q)} cuadradas y ${f0(rd)} redondas`).join('; ');
    const sol = [{ texto: `De cada color, la peor suerte saca una sola forma, la que más hay: ${lista(clases.map(([c], i) => `${f0(mx[i])} ${nom(c, 2)}`))}.`, ecuacion: [`${mx.map(f0).join(' + ')} = ${f0(p.max)}`] },
      { texto: 'La siguiente es de la otra forma y hace par con una de su color.', ecuacion: [`${f0(p.max)} + 1 = `, F(f0(bien))] }];
    return ejCierra(Object.assign({ datos: [D_SIN, 'Cada ficha es cuadrada o redonda, y roja o negra.', D_CERT] }, o), bien, sol,
      `Una bolsa tiene fichas ${txt}. ¿Cuántas hay que sacar, como mínimo, para tener con certeza dos de distinta forma y del mismo color?`,
      { pieza: CR, datos: { escena: 'recipiente', recipiente: 'tombola', titulo: 'Bolsa', meta: 'Meta: distinta forma, mismo color', objetos: objs }, estado: {} }, ['ficha', 'fichas']);
  }
  const EJEMPLOS_CADA = [
    ejCada({ nivel: 1, titulo: 'Una de cada, dos colores', urna: [['R', 4], ['V', 2]] }),
    ejCada({ nivel: 1, titulo: 'Una de cada color', urna: [['R', 3], ['V', 2], ['N', 1]] }),
    ejGuantes({ nivel: 1, titulo: 'Un par, un solo color', pares: [['N', 2]] }),
    ejGuantes({ nivel: 1, titulo: 'Un par, dos colores', pares: [['N', 2], ['B', 2]] }),
    ejCada({ nivel: 1, titulo: 'La más escasa, al final', urna: [['R', 6], ['V', 5], ['N', 1]] }),
    ejCada({ nivel: 2, titulo: 'Cuatro colores', urna: [['R', 5], ['V', 4], ['N', 3], ['B', 2]] }),
    ejGuantes({ nivel: 2, titulo: 'Un par negro', pares: [['N', 4], ['B', 3]], c: 'N' }),
    ejGuantes({ nivel: 2, titulo: 'Un par blanco', pares: [['N', 5], ['B', 2]], c: 'B' }),
    ejDos({ nivel: 2, titulo: 'Dos rojas y dos verdes', urna: [['R', 4], ['V', 6], ['N', 3]], a: 'R', b: 'V', k: 2 }),
    ejFormas({ nivel: 2, titulo: 'Distinta forma, mismo color', clases: [['R', 4, 2], ['N', 3, 5]] }),
    ejGuantes({ nivel: 3, titulo: 'Un par blanco, examen', pares: [['N', 6], ['B', 4]], c: 'B',
      alts: [{ v: 2 }, { v: 5 }, { v: 17, ok: true }, { v: 16 }, { v: 20 }],
      explica: '2 es con buena suerte; 5 olvida que antes salen los 12 negros; 16 olvida el que obliga; 20 es sacar todos.' }),
    ejDos({ nivel: 3, titulo: 'Tres rojas y tres verdes', urna: [['R', 8], ['V', 5], ['N', 6], ['B', 4]], a: 'R', b: 'V', k: 3,
      alts: [{ v: 6 }, { v: 18 }, { v: 20 }, { v: 21, ok: true }, { v: 23 }],
      explica: '6 es con buena suerte; 18 agota las verdes, que son menos; 20 olvida la que obliga; 23 es sacar todo.' }),
    ejFormas({ nivel: 3, titulo: 'Formas y colores', clases: [['R', 6, 3], ['N', 4, 7]],
      alts: [{ v: 2 }, { v: 3 }, { v: 13 }, { v: 20 }, { v: 14, ok: true }],
      explica: '2 es con buena suerte; 3 mira solo el color; 13 olvida la que obliga; 20 es sacar todas.' }),
    ejCada({ nivel: 3, titulo: 'Cuatro colores, examen', urna: [['R', 9], ['V', 7], ['N', 5], ['B', 2]],
      alts: [{ v: 22, ok: true }, { v: 21 }, { v: 23 }, { v: 10 }, { v: 4 }],
      explica: '21 olvida la que obliga; 23 es sacar todo; 10 agota solo las rojas; 4 es con buena suerte.' }),
    ejGuantes({ nivel: 3, titulo: 'Guantes de dos colores', pares: [['N', 7], ['B', 5]],
      alts: [{ v: 3 }, { v: 13, ok: true }, { v: 12 }, { v: 24 }, { v: 2 }],
      explica: '3 mira solo el color, sin las manos; 12 olvida el que obliga; 24 es sacar todos; 2 es con buena suerte.' }),
  ];
  unaDeCada.ejemplos = EJEMPLOS_CADA;
  juntar('una-de-cada', EJEMPLOS_CADA, [kCada(U1), kGu(PARES_P3, null)]);

  // ---------- Idea 4: números que cumplen algo ----------
  // Objeto: el bingo de la kermés, el tablero con las bolillas del 1 al 20 (rm-certeza, recipiente «bingo»; lo que sale
  // se marca en su lugar). Cambia: cuántas bolillas salen que no sirven y cuántas que sí. · Permanece: el tablero y la
  // meta, 2 múltiplos de 3. · Progresa: cuántas no sirven. · Se reserva: los primos (Predice). · Debe verse: lo que no
  // sirve hay que contarlo; sale todo primero.
  const esPrimo = n => n > 1 && rango(2, n - 1).every(d => n % d);
  const BOLI = ['bolilla', 'bolillas'];
  const N4 = 20, D4 = 3, K4 = 2;
  const sirve4 = x => x % D4 === 0;
  const NO4 = rango(1, N4).filter(x => !sirve4(x)), SI4 = rango(1, N4).filter(sirve4);
  // El tablero del bingo, con lo que salió marcado en su lugar ({ número: papel }).
  const tablero = (N, marcas = {}, o = {}) => Object.assign({ escena: 'recipiente', recipiente: 'bingo', titulo: o.titulo || 'Bingo', enSuLugar: true,
    objetos: rango(o.desde || 1, N).map(x => ({ forma: 'ficha', t: String(x) })),
    salieron: Object.entries(marcas).map(([x, p]) => Object.assign({ i: +x - (o.desde || 1) }, typeof p === 'string' ? { papel: p } : p)) },
  o.meta ? { meta: o.meta } : {}, o.cuenta ? { cuenta: o.cuenta } : {});
  // El tablero del bingo sin marcas, con sus números a la vista (cierre del 19 nov: el bombo con las bolillas tapadas no
  // dejaba ver cuáles cumplen; un tablero sin marcas no muestra ninguna cuenta).
  const bombo = (N, meta, desde = 1) => ({ pieza: CR, datos: tablero(N, {}, { meta, desde }), estado: {} });
  const marcasJ4 = val => {
    const m = {};
    NO4.slice(0, val.nm).forEach(x => { m[x] = 'peor'; });
    SI4.slice(0, val.m).forEach((x, i) => { m[x] = i + 1 < K4 ? 'peor' : 'obliga'; });
    return m;
  };
  function lecturaJ4(val) {
    const t = val.nm + val.m;
    if (val.m >= K4) return [`Ya salieron ${f0(K4)} múltiplos de 3: la meta se cumple`];
    if (!t) return ['Todavía no sale nada: elige qué saca la mala suerte'];
    const queda = val.nm < NO4.length || val.m < K4 - 1;
    return [`${pl(t, BOLI)} sin ${f0(K4)} múltiplos de 3: ${queda ? 'aún cabe algo sin cumplir' : 'ya no queda nada que no sirva'}`];
  }
  const PEOR4 = NO4.length + K4 - 1;
  // La predicción: una bolilla con número primo, del 1 al 20.
  const PRIMOS20 = rango(1, N4).filter(esPrimo), NOP = rango(1, N4).filter(x => !esPrimo(x)), R_P4 = NOP.length + 1;
  if (R_P4 !== 13) throw new Error('predicción de la idea 4');
  const marcasP4 = (o = {}) => Object.assign(Object.fromEntries(NOP.map(x => [x, o.mira ? { papel: 'peor', desde: 1 } : 'peor'])), { [PRIMOS20[0]]: o.mira ? { papel: 'obliga', desde: 2 } : 'obliga' });
  const cuentaP4 = [{ t: `${f0(NOP.length)} no primos`, papel: 'peor', desde: 1 }, { t: '+ 1 obliga', papel: 'obliga', desde: 2 }, { t: `= ${f0(R_P4)}`, papel: 'seguro', desde: 3 }];
  const META_P4 = 'Meta: una bolilla con número primo';

  // ---------- Casos de «Así se resuelve» y «Ahora tú» de la idea 4 ----------
  const COND = {
    mult: d => ({ es: x => x % d === 0, adj: `múltiplo de ${d}`, nombre: [`múltiplo de ${d}`, `múltiplos de ${d}`], dato: `Múltiplo de ${d}: se divide entre ${d} sin residuo (${d}, ${2 * d}, ${3 * d}…).` }),
    primo: () => ({ es: esPrimo, adj: 'primo', nombre: ['número primo', 'números primos'], dato: 'Un primo tiene solo dos divisores, 1 y él mismo; el 1 no es primo.' }),
    par: () => ({ es: x => x % 2 === 0, adj: 'par', nombre: ['número par', 'números pares'], dato: 'Par: múltiplo de 2 (2, 4, 6…). Impar: los demás.' }),
    impar: () => ({ es: x => x % 2 === 1, adj: 'impar', nombre: ['número impar', 'números impares'], dato: 'Impar: no es múltiplo de 2 (1, 3, 5…).' }),
    termina: d => ({ es: x => x % 10 === d, adj: `que termina en ${d}`, nombre: [`número que termina en ${d}`, `números que terminan en ${d}`], dato: `Terminan en ${d}: ${d}, ${10 + d}, ${20 + d}, ${30 + d}…` }),
    multAoB: (a, b) => ({ es: x => x % a === 0 || x % b === 0, adj: `múltiplo de ${a} o de ${b}`, nombre: [`múltiplo de ${a} o de ${b}`, `múltiplos de ${a} o de ${b}`], dato: `Múltiplo de ${a} o de ${b}: de uno de los dos, o de los dos a la vez.` }),
  };
  function cond(N, c, k, desde = 1) {
    const nums = rango(desde, N), si = nums.filter(c.es), no = nums.filter(x => !c.es(x));
    const p = peorCuentas([no.length, si.length], v => v[1] >= k);
    if (p.max + 1 !== no.length + k) throw new Error('cond');
    return { nums, si, no, k, bien: no.length + k, N, desde };
  }
  function distCond(cs, c) {
    return [
      { id: 'suerte', valor: cs.k, error: 'RM6', siFuera: `Con buena suerte, las ${f0(cs.k)} primeras serían ${c.nombre[1]}. La certeza pide la peor suerte.` },
      { id: 'sirven', valor: cs.si.length + cs.k, error: 'RMP32', siFuera: `Contaste las que cumplen, ${f0(cs.si.length)}; pero las que salen primero son las que no cumplen, ${f0(cs.no.length)}.` },
      { id: 'sin1', valor: cs.bien - 1, error: 'RMP34', siFuera: `Armaste bien el peor caso: ${f0(cs.bien - 1)} sin cumplir. Falta la que obliga.` },
      { id: 'todo', valor: cs.nums.length, error: 'RMP152', siFuera: `Sacar las ${f0(cs.nums.length)} asegura la meta, pero sobran.` },
    ];
  }
  const metaK = (k, c) => `Meta: ${k === 1 ? 'una' : f0(k)} con número ${c.adj}`;
  const kTxt = (k, c) => `${k === 1 ? 'una bolilla' : `${f0(k)} bolillas`} con número ${c.adj}`;
  function casoCond(r, tipo) {
    // Ni el juego (2 múltiplos de 3 del 1 al 20) ni la predicción (un primo del 1 al 20).
    for (;;) {
      const N = tipo === 0 ? r.elegir([20, 24, 30, 36, 40]) : tipo === 1 ? r.elegir([15, 20, 25, 30]) : r.elegir([12, 15, 20, 25, 30]);
      const c = tipo === 0 ? COND.mult(r.elegir([3, 4, 5, 6])) : tipo === 1 ? COND.primo() : r() < 0.5 ? COND.par() : COND.impar();
      const k = tipo === 0 ? r.ent(1, 3) : tipo === 1 ? r.ent(1, 2) : r.ent(2, 3);
      if (!usado('condicion', kCond(1, N, c.nombre[1], k))) return { c, cs: cond(N, c, k) };
    }
  }

  const condicion = {
    id: 'condicion',
    titulo: 'Números que cumplen algo',
    pregunta: '¿Cómo se cuenta lo que no sirve en un bingo?',
    temas: ['Peor caso', 'Extracción de objetos'],
    pieza: CR,
    aprendizaje: 'Con fichas numeradas, se cuentan las que no cumplen: salen todas primero; después, las que cumplen, una menos de lo pedido.',
    actividad: 'Sacar bolillas del bingo sin juntar dos múltiplos de 3.',
    lee: {
      tarjetas: [
        { titulo: 'El bingo de la kermés', texto: 'En el bingo de la kermés hay bolillas numeradas del 1 al 20, una de cada número. Sale una sin mirar y se marca en el tablero.',
          pieza: CR, dibujo: { datos: tablero(N4), estado: {} } },
        { titulo: 'Las que sirven', texto: 'Ahora la meta no es un color: es algo que cumple el número, por ejemplo ser múltiplo de 3 (3, 6, 9…). Las bolillas que no lo cumplen no sirven.' },
        { titulo: 'Qué mirar al jugar', texto: 'Haz de mala suerte: saca primero las que no sirven. Para saber cuántas son, tienes que contarlas en el tablero.' },
      ],
    },
    juega: {
      pieza: CR,
      consigna: 'El bingo de la kermés tiene bolillas del 1 al 20. La meta: 2 bolillas con número múltiplo de 3. Tú haces de mala suerte.',
      mision: {
        texto: 'Saca la mayor cantidad de bolillas sin tener 2 múltiplos de 3.',
        logrado: v => v.m < K4 && v.nm + v.m === PEOR4,
        bien: [`Peor caso: las ${f0(NO4.length)} que no son múltiplos y uno que sí. La siguiente obliga.`],
      },
      voz: 'Antes de sacar, mira cuáles no sirven.',
      leyenda: [
        { s: '1 a 20', t: 'el número de cada bolilla' },
        { s: O('borde naranja'), t: 'salió y todavía no cumple la meta' },
        { s: I('borde turquesa'), t: 'la que completa la meta' },
      ],
      controles: [
        { id: 'nm', etiqueta: 'Salen sin ser múltiplo de 3', min: 0, max: NO4.length, paso: 1, inicio: 0, decimales: 0 },
        { id: 'm', etiqueta: 'Salen múltiplos de 3', min: 0, max: K4, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: val => ({ datos: tablero(N4, marcasJ4(val), { meta: 'Meta: 2 múltiplos de 3' }), estado: {} }),
      lectura: val => lecturaJ4(val),
      minimo: 3,
    },
    predice: {
      pregunta: 'En el mismo bingo, del 1 al 20, ¿cuántas bolillas hay que sacar, como mínimo, para tener con certeza una con número primo?',
      datos: ['Bolillas del 1 al 20, una de cada número.', `Primos del 1 al 20: ${lista(PRIMOS20.map(String))}.`],
      voz: '¿Cuáles no sirven?',
      opciones: [
        { id: 'c', texto: pl(R_P4, BOLI), correcta: true },
        { id: 'suerte', texto: pl(1, BOLI), error: 'RM6', siFuera: 'Con suerte, la primera ya tiene número primo. La certeza pide que alcance con la peor suerte.' },
        { id: 'sirven', texto: pl(PRIMOS20.length + 1, BOLI), error: 'RMP32', siFuera: `Contaste los primos, ${f0(PRIMOS20.length)}, y sumaste 1. Pero lo que sale primero son los que no son primos.` },
        { id: 'sin1', texto: pl(NOP.length, BOLI), error: 'RMP34', siFuera: `Con ${f0(NOP.length)} pueden haber salido justo los que no son primos. Falta la que obliga.` },
        { id: 'todo', texto: pl(N4, BOLI), error: 'RMP152', siFuera: `Sacar las ${f0(N4)} asegura un primo, pero sobran ${f0(N4 - R_P4)}.` },
      ],
      dibujo: { datos: tablero(N4, {}, { meta: META_P4 }), estado: {} },
      revelar: { datos: tablero(N4, marcasP4(), { meta: META_P4, cuenta: cuentaP4 }), estado: { corte: 3 } },
      coincide: `Coincide: los ${f0(NOP.length)} que no son primos salen primero; el siguiente es primo.`,
      noCoincide: `Revisemos: los que no son primos son ${f0(N4)} − ${f0(PRIMOS20.length)}, y salen todos antes.`,
    },
    mira: {
      pieza: CR,
      datos: tablero(N4, marcasP4({ mira: true }), { meta: META_P4, cuenta: cuentaP4 }),
      voz: 'Primero se cuenta, después se suma.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Los que no son primos salen todos primero. Son el total menos los primos.', ecuacion: [`${f0(N4)} − ${f0(PRIMOS20.length)} = ${f0(NOP.length)}`] },
        { estado: { corte: 2 }, texto: 'Solo quedan números primos: la siguiente (aquí, el 2) obliga.', ecuacion: [`${f0(NOP.length)} + 1 = ${f0(R_P4)}`] },
        { estado: { corte: 3 }, texto: `Con ${f0(NOP.length)} todavía podía no haber primo; con ${f0(R_P4)}, ya no.` },
      ],
    },
    regla: {
      texto: 'Cuenta las que no cumplen: con la peor suerte salen todas primero. Después, de las que cumplen, una menos de lo pedido (si piden una, ninguna). La siguiente obliga.',
      ecuacion: [{ llave: ['peor caso'], nota: 'las que no cumplen y una menos de lo pedido', color: 'c-o' }, ' + ', { llave: ['1'], nota: 'la que obliga', color: 'c-i' }],
      condicion: 'cada número está una sola vez. Las que no cumplen son el total menos las que cumplen.',
      voz: 'Lo que no sirve se cuenta, no se adivina.',
    },
    // En el mundo: La Tinka (6 bolillas del 1 al 48, sin devolver). Lo seguro sale de contar las que no cumplen.
    // Revisión del Escribidor Escribano (28 nov): el primer párrafo decía que una jugada puede salir sin ningún par, y
    // eso descartaba de antemano la alternativa «Al menos un número par». Ahora el ejemplo de lo que no es seguro es
    // otro (los 40 números del 1 al 40 alcanzan para llenar la jugada), que no responde ninguna alternativa y hace
    // contraste con lo seguro: 40 que no cumplen no se agotan, 5 sí.
    // «Los 6 números de la jugada»: la Boliyapa, que se sortea aparte, no entra en la cuenta.
    mundo: {
      hecho: 'En La Tinka siempre sale un número menor que 44',
      parrafos: [
        'En cada sorteo de La Tinka, los 6 números de la jugada salen de un bolillero con las bolillas del 1 al 48, y la que sale no vuelve. Con tan pocas bolillas casi nada es seguro: ni siquiera sale con certeza un número mayor que 40, porque los seis pueden salir del 1 al 40.',
        ['Contando las que no cumplen, la regla encuentra algo que sí es seguro. Si la meta es un número menor que 44, no sirven los del 44 al 48, y la peor suerte saca primero esas cinco:',
          { linea: [O('5'), ' + ', I('1'), ' = 6'] },
          'La sexta bolilla tiene que ser menor que 44, así que en todo sorteo sale por lo menos una.'],
      ],
      pregunta: {
        texto: 'En el mismo sorteo de 6 bolillas del 1 al 48, ¿qué sale con certeza en toda jugada?',
        opciones: [
          { id: 'c', texto: 'Al menos un número que no termina en 0', correcta: true },
          { id: 'par', texto: 'Al menos un número par', error: 'RMP77',
            siFuera: 'Es probable que salga un número par, porque la mitad de los números lo son. Pero los impares son 24, más que las 6 bolillas, y pueden salir solo impares.' },
          { id: 'cifra', texto: 'Al menos un número de una cifra', error: 'RMP32',
            siFuera: 'Hay 9 números de una cifra, y pueden salir. Pero los que no cumplen son los de dos cifras, que son 39, y la peor suerte saca 6 de ellos.' },
          { id: 'nada', texto: 'Nada, porque 6 bolillas de 48 son muy pocas', error: 'RMP78',
            siFuera: 'Es cierto que casi nada es seguro con 6 bolillas. Pero cuando las que no cumplen son menos de 6, la peor suerte se queda sin ellas antes de terminar.' },
        ],
        porque: 'Terminan en 0 el 10, el 20, el 30 y el 40, que son 4. La peor suerte los saca primero, y la quinta bolilla ya no puede terminar en 0.',
      },
      fuente: 'La Tinka: 6 números del 1 al 48, según Infobae (mayo de 2026) y la guía de juego de Líbero.',
    },
    ejemplos: null,
    resuelve: {
      pieza: CR,
      generar(s) {
        const r = azar(s + 900);
        let N, d, k;
        do { N = r.elegir([24, 30, 36]); d = r.elegir([4, 5, 6]); k = r.ent(2, 3); } while (usado('condicion', kCond(1, N, COND.mult(d).nombre[1], k)));
        const c = COND.mult(d), cs = cond(N, c, k);
        return {
          enunciado: `En otro bingo, las bolillas van del 1 al ${f0(N)}. ¿Cuántas hay que sacar, como mínimo, para tener con certeza ${kTxt(k, c)}?`,
          datos: [`Bolillas del 1 al ${f0(N)}, una de cada número.`, c.dato, D_SIN],
          dibujo: bombo(N, metaK(k, c)),
          pasos: [
            { tipo: 'pide', texto: `Piden el menor número de bolillas que asegura ${kTxt(k, c)}, salga lo que salga.` },
            { tipo: 'datos', texto: `Múltiplos de ${f0(d)} hasta ${f0(N)}: ${f0(d)}, ${f0(2 * d)}, …, ${f0(cs.si[cs.si.length - 1])}. Son ${f0(cs.si.length)}.` },
            { tipo: 'regla', texto: 'Las que no cumplen salen todas primero; después, una menos de lo pedido. La siguiente obliga.' },
            { tipo: 'cuentas', texto: 'Las que no cumplen son el total menos los múltiplos:', ecuacion: [`${f0(N)} − ${f0(cs.si.length)} = ${f0(cs.no.length)}`] },
            { tipo: 'cuentas', texto: `Peor caso: esas ${f0(cs.no.length)} y ${f0(k - 1)} ${k - 1 === 1 ? 'múltiplo' : 'múltiplos'}. La siguiente obliga.`, ecuacion: [`${f0(cs.no.length)} + ${f0(k - 1)} + 1 = `, F(f0(cs.bien))] },
            { tipo: 'sentido', texto: `Contar los múltiplos (${f0(cs.si.length)}) no basta: lo que sale primero es lo que no sirve.` },
          ],
          respuesta: [F(pl(cs.bien, BOLI))],
        };
      },
    },
    // Ahora tú (semilla % 4): 0 k múltiplos de d · 1 primos · 2 pares o impares · 3 nivel examen: múltiplos de a o de b
    // (sin contar dos veces los comunes) o un producto par.
    ahoraTu: {
      pieza: CR,
      voz: 'Cuenta primero las que no cumplen.',
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo === 3) {
          if (Math.floor(s / 4) % 2) {
            let N; do { N = r.elegir([15, 18, 21, 25, 30]); } while (usado('condicion', `prodpar|${N}`));
            const impares = rango(1, N).filter(x => x % 2).length, bien = impares + 1;
            if (peorCuentas([impares, N - impares], v => v[1] >= 1 && v[0] + v[1] >= 2).max + 1 !== bien) throw new Error('producto par');
            const d = [{ id: 'suerte', valor: 2, error: 'RM6', siFuera: 'Con suerte, las dos primeras ya dan producto par. La certeza pide la peor suerte.' },
              { id: 'sin1', valor: impares, error: 'RMP34', siFuera: `Con ${f0(impares)} pueden salir solo impares: su producto es impar. Falta la que obliga.` },
              { id: 'pares', valor: N - impares + 1, error: 'RMP32', siFuera: `Contaste los pares, ${f0(N - impares)}; pero los que salen primero son los impares, que no sirven.` },
              { id: 'todo', valor: N, error: 'RMP152', siFuera: `Sacar las ${f0(N)} asegura el producto par, pero sobran.` }];
            return { pregunta: `En un bingo con bolillas del 1 al ${f0(N)}, ¿cuántas hay que sacar, como mínimo, para tener con certeza dos cuyo producto sea par?`,
              datos: [`Bolillas del 1 al ${f0(N)}, una de cada número.`, 'Un producto es par si alguno de sus factores es par.', D_SIN],
              dibujo: bombo(N, 'Meta: dos con producto par'), opciones: opcionesNum(bien, BOLI, d, 5),
              solucion: { texto: `Los impares no sirven entre sí: salen los ${f0(impares)}. La siguiente es par y da producto par.`, ecuacion: [`${f0(impares)} + 1 = `, F(f0(bien))] } };
          }
          let a, b, N, k;
          do { [a, b] = r.elegir([[2, 3], [2, 5], [3, 5], [3, 4], [4, 6]]); N = r.elegir([30, 40, 60]); k = r.ent(2, 4); } while (usado('condicion', kCond(1, N, COND.multAoB(a, b).nombre[1], k)));
          const c = COND.multAoB(a, b), cs = cond(N, c, k);
          const A = Math.floor(N / a), B = Math.floor(N / b), AB = cs.si.length;
          const d = distCond(cs, c).concat([{ id: 'comunes', valor: N - A - B + k, error: 'RMP32', siFuera: `Restaste ${f0(A)} y ${f0(B)}, pero los múltiplos de los dos a la vez quedaron restados dos veces.` }]);
          return { pregunta: `En un bingo con bolillas del 1 al ${f0(N)}, ¿cuántas hay que sacar, como mínimo, para tener con certeza ${kTxt(k, c)}?`,
            datos: [`Bolillas del 1 al ${f0(N)}, una de cada número.`, c.dato, `Múltiplos de ${a} hasta ${f0(N)}: tantos como veces cabe ${a} en ${f0(N)}.`, D_SIN],
            dibujo: bombo(N, metaK(k, c)), opciones: opcionesNum(cs.bien, BOLI, [d[4], d[0], d[2], d[1], d[3]], 5),
            solucion: { texto: `Cumplen ${f0(A)} + ${f0(B)} − ${f0(A + B - AB)} = ${f0(AB)} (los comunes, una vez). No cumplen ${f0(cs.no.length)}; se suman ${f0(k)}.`, ecuacion: [`${f0(cs.no.length)} + ${f0(k)} = `, F(f0(cs.bien))] } };
        }
        const { c, cs } = casoCond(r, tipo);
        return { pregunta: `En un bingo con bolillas del 1 al ${f0(cs.N)}, ¿cuántas hay que sacar, como mínimo, para tener con certeza ${kTxt(cs.k, c)}?`,
          datos: [`Bolillas del 1 al ${f0(cs.N)}, una de cada número.`, c.dato, D_SIN],
          dibujo: bombo(cs.N, metaK(cs.k, c)),
          opciones: opcionesNum(cs.bien, BOLI, distCond(cs, c), 5),
          solucion: { texto: `No cumplen ${f0(cs.no.length)} de las ${f0(cs.N)}: salen todas, y ${f0(cs.k - 1)} que sí. La siguiente obliga.`, ecuacion: [`${f0(cs.no.length)} + ${f0(cs.k - 1)} + 1 = `, F(f0(cs.bien))] } };
      },
    },
  };

  // ---------- Ejemplos de «Números que cumplen algo» ----------
  // Resueltos aparte (e7-rm/ejemplos.py, contando número por número): 1 → 17 · 2 → 9 · 3 → 7 · 4 → 18 · 5 → 8 · 6 → 26 ·
  // 7 → 18 · 8 → 7 · 9 → 10 · 10 → 9 · 11 → 14 (D) · 12 → 14 (E) · 13 → 39 (A) · 14 → 44 (B) · 15 → 13 (C).
  // La figura es el bombo con las bolillas dentro (sus números no se ven): así no muestra ninguna cuenta.
  function ejCond(o) {
    const c = o.c, desde = o.desde || 1, cs = cond(o.N, c, o.k, desde), n = cs.nums.length;
    const sol = [
      { texto: `Cumplen ${f0(cs.si.length)}${cs.si.length <= 8 ? ` (${lista(cs.si.map(String))})` : ''}. Las que no cumplen son las demás.`, ecuacion: [`${f0(n)} − ${f0(cs.si.length)} = ${f0(cs.no.length)}`] },
      { texto: `Peor caso: salen las ${f0(cs.no.length)} que no cumplen${o.k > 1 ? ` y ${f0(o.k - 1)} que sí` : ''}. La siguiente obliga.`, ecuacion: [`${f0(cs.no.length)}${o.k > 1 ? ` + ${f0(o.k - 1)}` : ''} + 1 = `, F(f0(cs.bien))] },
    ];
    const rangoTxt = `del ${f0(desde)} al ${f0(o.N)}`;
    return ejCierra(Object.assign({ datos: [`Bolillas ${rangoTxt}, una de cada número.`, c.dato, D_SIN], _caso: kCond(desde, o.N, c.nombre[1], o.k) }, o), cs.bien, sol,
      `En un bingo con bolillas ${rangoTxt}, ¿cuántas hay que sacar, como mínimo, para tener con certeza ${kTxt(o.k, c)}?`, bombo(o.N, metaK(o.k, c), desde), BOLI);
  }
  const EJEMPLOS_COND = [
    ejCond({ nivel: 1, titulo: 'Un múltiplo de 5', N: 20, c: COND.mult(5), k: 1 }),
    ejCond({ nivel: 1, titulo: 'Una bolilla par', N: 15, c: COND.par(), k: 1 }),
    ejCond({ nivel: 1, titulo: 'Dos impares', N: 10, c: COND.impar(), k: 2 }),
    (() => {
      const N = 24, c = COND.mult(4), cs = cond(N, c, 1);
      return { nivel: 1, titulo: 'Las que no sirven', _caso: kCond(1, N, c.nombre[1], 1), enunciado: `En un bingo con bolillas del 1 al ${f0(N)}, la meta es un múltiplo de 4. ¿Cuántas bolillas no sirven?`,
        datos: [`Bolillas del 1 al ${f0(N)}, una de cada número.`, c.dato], figura: bombo(N, 'Meta: un número múltiplo de 4'),
        solucion: [{ texto: `Múltiplos de 4 hasta ${f0(N)}: ${lista(cs.si.map(String))}. No sirven las demás.`, ecuacion: [`${f0(N)} − ${f0(cs.si.length)} = `, F(f0(cs.no.length))] }],
        respuesta: [F(pl(cs.no.length, BOLI))] };
    })(),
    ejCond({ nivel: 1, titulo: 'Un primo del 1 al 12', N: 12, c: COND.primo(), k: 1 }),
    ejCond({ nivel: 2, titulo: 'Tres múltiplos de 4', N: 30, c: COND.mult(4), k: 3 }),
    ejCond({ nivel: 2, titulo: 'Dos primos del 1 al 25', N: 25, c: COND.primo(), k: 2 }),
    (() => {
      const N = 12, impares = rango(1, N).filter(x => x % 2).length, bien = impares + 1;
      return { nivel: 2, titulo: 'Un producto par', _caso: `prodpar|${N}`, enunciado: `En un bingo con bolillas del 1 al ${f0(N)}, ¿cuántas hay que sacar, como mínimo, para tener con certeza dos cuyo producto sea par?`,
        datos: [`Bolillas del 1 al ${f0(N)}, una de cada número.`, 'Un producto es par si alguno de sus factores es par.', D_SIN], figura: bombo(N, 'Meta: dos con producto par'),
        solucion: [{ texto: `Dos impares dan producto impar: no sirven entre sí. Con la peor suerte salen los ${f0(impares)} impares.` },
          { texto: 'La siguiente es par: con cualquiera de las que salieron da producto par.', ecuacion: [`${f0(impares)} + 1 = `, F(f0(bien))] }],
        respuesta: [F(pl(bien, BOLI))] };
    })(),
    (() => {
      // Ya salieron 1, 2, 4, 5 y 7. Quedan 15: los 6 múltiplos de 3 y 9 que no lo son.
      const N = 20, ya = [1, 2, 4, 5, 7], queda = rango(1, N).filter(x => !ya.includes(x)), no = queda.filter(x => x % 3), bien = no.length + 1;
      if (no.length !== 9) throw new Error('ejemplo 9 de la idea 4');
      return { nivel: 2, titulo: 'Ya salieron cinco', enunciado: 'En un bingo con bolillas del 1 al 20 ya salieron el 1, el 2, el 4, el 5 y el 7. ¿Cuántas más hay que sacar, como mínimo, para tener con certeza un múltiplo de 3?',
        datos: ['Bolillas del 1 al 20, una de cada número.', COND.mult(3).dato, D_SIN],
        figura: { pieza: CR, datos: tablero(N, Object.fromEntries(ya.map(x => [x, 'amarra'])), { meta: 'Meta: un múltiplo de 3' }), estado: {} },
        solucion: [{ texto: 'No son múltiplos de 3: 14 del 1 al 20. Ya salieron 5 de ellos.', ecuacion: [`14 − 5 = ${f0(no.length)}`] },
          { texto: `Con la peor suerte salen esas ${f0(no.length)}; la siguiente es múltiplo de 3.`, ecuacion: [`${f0(no.length)} + 1 = `, F(f0(bien))] }],
        respuesta: [F(`${pl(bien, BOLI)} más`)] };
    })(),
    (() => {
      const N = 15, imp = rango(1, N).filter(x => x % 2).length, par = N - imp, bien = Math.max(imp, par) + 1;
      if (peorCuentas([imp, par], v => v[0] >= 1 && v[1] >= 1).max + 1 !== bien) throw new Error('suma impar');
      return { nivel: 2, titulo: 'Una suma impar', enunciado: `En un bingo con bolillas del 1 al ${f0(N)}, ¿cuántas hay que sacar, como mínimo, para tener con certeza dos cuya suma sea impar?`,
        datos: [`Bolillas del 1 al ${f0(N)}, una de cada número.`, 'Una suma de dos números es impar si uno es par y el otro, impar.', D_SIN], figura: bombo(N, 'Meta: dos con suma impar'),
        solucion: [{ texto: `Hace falta un par y un impar. La peor suerte agota la clase más grande: los ${f0(imp)} impares.` },
          { texto: 'La siguiente es par y completa.', ecuacion: [`${f0(imp)} + 1 = `, F(f0(bien))] }],
        respuesta: [F(pl(bien, BOLI))] };
    })(),
    (() => {
      const N = 30, c = COND.multAoB(2, 3), cs = cond(N, c, 4);
      return ejCierra({ nivel: 3, titulo: 'Múltiplos de 2 o de 3', _caso: kCond(1, N, c.nombre[1], 4), datos: [`Bolillas del 1 al ${f0(N)}, una de cada número.`, c.dato, 'Múltiplos de 6: los que son de 2 y de 3 a la vez.'],
        alts: [{ v: 4 }, { v: 9 }, { v: cs.bien - 1 }, { v: cs.bien, ok: true }, { v: cs.si.length + 4 }],
        explica: `4 es con buena suerte; 9 resta dos veces los múltiplos de 6; ${f0(cs.bien - 1)} olvida la que obliga; ${f0(cs.si.length + 4)} cuenta las ${f0(cs.si.length)} que sí cumplen y les suma 4.` },
      cs.bien, [{ texto: 'Múltiplos de 2: 15. De 3: 10. De los dos a la vez (de 6): 5, que no se cuentan dos veces.', ecuacion: [`15 + 10 − 5 = ${f0(cs.si.length)}`] },
        { texto: `No cumplen ${f0(cs.no.length)}. Salen todas, y 3 que sí; la siguiente obliga.`, ecuacion: [`${f0(cs.no.length)} + 3 + 1 = `, F(f0(cs.bien))] }],
      `En un bingo con bolillas del 1 al ${f0(N)}, ¿cuántas hay que sacar, como mínimo, para tener con certeza ${kTxt(4, c)}?`, bombo(N, metaK(4, c)), BOLI);
    })(),
    (() => {
      const N = 25, impares = rango(1, N).filter(x => x % 2).length, bien = impares + 1;
      return { nivel: 3, titulo: 'El producto par, examen', _caso: `prodpar|${N}`, enunciado: `En un bingo con bolillas del 1 al ${f0(N)}, ¿cuántas hay que sacar, como mínimo, para tener con certeza dos cuyo producto sea par?`,
        alternativas: ['2 bolillas', '13 bolillas', '25 bolillas', '15 bolillas', '14 bolillas'],
        datos: [`Bolillas del 1 al ${f0(N)}, una de cada número.`, 'Un producto es par si alguno de sus factores es par.', D_SIN], figura: bombo(N, 'Meta: dos con producto par'),
        solucion: [{ texto: `Del 1 al 25 hay ${f0(impares)} impares y 12 pares. Dos impares dan producto impar: salen los ${f0(impares)}.` },
          { texto: 'La siguiente es par y da producto par con cualquiera.', ecuacion: [`${f0(impares)} + 1 = `, F(f0(bien))] },
          { texto: `2 es con buena suerte; 13 olvida la que obliga; 25 es sacar todo; 15 suma una de más.` }],
        respuesta: [F(pl(bien, BOLI))] };
    })(),
    ejCond({ nivel: 3, titulo: 'Boletos que terminan en 7', N: 40, c: COND.termina(7), k: 3,
      alts: [{ v: 39, ok: true }, { v: 38 }, { v: 40 }, { v: 7 }, { v: 3 }],
      explica: '38 olvida la que obliga; 40 es sacar todo; 7 cuenta los 4 que sí terminan en 7 y les suma 3; 3 es con buena suerte.' }),
    ejCond({ nivel: 3, titulo: 'Dos múltiplos de 6', N: 50, c: COND.mult(6), k: 2,
      alts: [{ v: 2 }, { v: 44, ok: true }, { v: 43 }, { v: 10 }, { v: 50 }],
      explica: '2 es con buena suerte; 43 olvida la que obliga; 10 cuenta los 8 múltiplos de 6 y les suma 2; 50 es sacar todo.' }),
    ejCond({ nivel: 3, titulo: 'Tres pares del 10 al 30', N: 30, desde: 10, c: COND.par(), k: 3,
      alts: [{ v: 3 }, { v: 14 }, { v: 13, ok: true }, { v: 12 }, { v: 21 }],
      explica: '3 es con buena suerte; 14 cuenta los 11 pares y les suma 3; 12 olvida la que obliga; 21 es sacar todo.' }),
  ];
  condicion.ejemplos = EJEMPLOS_COND;
  juntar('condicion', EJEMPLOS_COND, [kCond(1, N4, COND.mult(D4).nombre[1], K4), kCond(1, N4, COND.primo().nombre[1], 1)]);

  // ---------- Idea 5: parejas y sumas ----------
  // Objeto: las cartas de la feria, del 1 al 7, en la mesa; las que suman 8 van juntas y unidas por una raya
  // (rm-certeza, recipiente «mesa»). Cambia: de cada pareja, cuántas salen; si sale el 4. · Permanece: las cartas y la
  // meta, dos que sumen 8. · Progresa: cuántas salen sin pareja completa. · Se reserva: del 1 al 10 y suma 12 (Predice).
  // · Debe verse: cada pareja admite una sola carta; las que no tienen pareja salen todas.
  const CAR = ['carta', 'cartas'];
  const S5 = 8, GR5 = [[1, 7], [2, 6], [3, 5], [4]];
  // Parejas de 1..N que suman S, las que no tienen pareja y el número que es la mitad de S (necesitaría otro igual).
  function parejasDe(N, S) {
    const pares = [], solos = [];
    let mitad = null;
    for (let x = 1; x <= N; x++) { const y = S - x; if (y === x) mitad = x; else if (y >= 1 && y <= N) { if (x < y) pares.push([x, y]); } else solos.push(x); }
    return { pares, solos: mitad ? solos.concat([mitad]).sort((a, b) => a - b) : solos, mitad };
  }
  const cartasMesa = (grupos, marcas = {}, o = {}) => Object.assign({ escena: 'recipiente', recipiente: 'mesa', titulo: o.titulo || 'Mesa de la feria', enSuLugar: true,
    objetos: grupos.flatMap((g, k) => g.map(x => Object.assign({ forma: 'carta', t: String(x) }, o.sueltas ? {} : { grupo: k }))) },
  { salieron: Object.entries(marcas).map(([x, p]) => Object.assign({ i: grupos.flat().indexOf(+x) }, typeof p === 'string' ? { papel: p } : p)) },
  o.meta ? { meta: o.meta } : {}, o.cuenta ? { cuenta: o.cuenta } : {});
  const OPC_PAR = [{ valor: 0, texto: 'Ninguna' }, { valor: 1, texto: 'Una' }, { valor: 2, texto: 'Las dos' }];
  const valJ5 = val => [val.a, val.b, val.c];
  const marcasJ5 = val => {
    const m = {};
    valJ5(val).forEach((n, k) => { if (n >= 1) m[GR5[k][0]] = 'peor'; if (n >= 2) m[GR5[k][1]] = 'obliga'; });
    if (val.d) m[4] = 'peor';
    return m;
  };
  function lecturaJ5(val) {
    const x = valJ5(val), t = suma(x) + val.d;
    if (x.some(n => n === 2)) return [`Ya hay dos que suman ${f0(S5)}: la meta se cumple`];
    if (!t) return ['Todavía no sale nada: elige qué saca la mala suerte'];
    const queda = x.some(n => n === 0) || !val.d;
    return [`${pl(t, CAR)} sin dos que sumen ${f0(S5)}: ${queda ? 'aún cabe algo sin cumplir' : 'la siguiente cierra una pareja'}`];
  }
  const PEOR5 = GR5.length;   // una de cada pareja y el 4
  // La predicción: cartas del 1 al 10, dos que sumen 12.
  const N_P5 = 10, S_P5 = 12, PJ_P5 = parejasDe(N_P5, S_P5), R_P5 = PJ_P5.pares.length + PJ_P5.solos.length + 1;
  if (R_P5 !== 7) throw new Error('predicción de la idea 5');
  const UNO_P5 = rango(1, N_P5).map(x => [x]);
  const marcasP5 = (o = {}) => {
    const m = {}, p = (papel, desde) => (o.mira ? { papel, desde } : papel);
    PJ_P5.pares.forEach(([x]) => { m[x] = p('peor', 1); });
    PJ_P5.solos.forEach(x => { m[x] = p('peor', 2); });
    m[PJ_P5.pares[0][1]] = p('obliga', 3);
    return m;
  };
  // Después de responder (Mira y el revelar), las cartas van juntas por pareja, con su raya, como en el juego.
  const GR_P5 = PJ_P5.pares.map(x => x.slice()).concat(PJ_P5.solos.map(x => [x]));
  const cuentaP5 = [{ t: `${f0(PJ_P5.pares.length)}, una por pareja`, papel: 'peor', desde: 1 }, { t: `+ ${f0(PJ_P5.solos.length)} solas`, papel: 'peor', desde: 2 }, { t: '+ 1 obliga', papel: 'obliga', desde: 3 }, { t: `= ${f0(R_P5)}`, papel: 'seguro', desde: 4 }];
  const META_P5 = 'Meta: dos que sumen 12';

  // ---------- Casos de «Así se resuelve» y «Ahora tú» de la idea 5 ----------
  function casoPareja(r, copias = 1) {
    for (let t = 0; t < 200; t++) {
      const N = r.ent(7, 14), S = r.ent(Math.floor(N / 2) + 3, N + 3), pj = parejasDe(N, S);
      if (pj.pares.length < 2 || (copias === 1 && !pj.solos.length) || (copias > 1 && pj.mitad)) continue;
      if (usado('parejas', kPar(N, S, copias))) continue;   // ni el juego, ni la predicción, ni un ejemplo
      const malo = copias * pj.pares.length + copias * (pj.solos.length - (pj.mitad ? 1 : 0)) + (pj.mitad ? 1 : 0);
      return { N, S, pj, copias, malo, bien: malo + 1, T: copias * N };
    }
    return null;
  }
  function distPareja(cs) {
    const u = cs.copias === 1 ? CAR : ['disco', 'discos'];
    return [
      { id: 'suerte', valor: 2, error: 'RM6', siFuera: 'Con buena suerte, las dos primeras ya suman lo pedido. La certeza pide la peor suerte.' },
      { id: 'sinsolas', valor: cs.copias * cs.pj.pares.length + 1, error: 'RMP30', siFuera: `Contaste las parejas, pero ${lista(cs.pj.solos.map(String))} no ${cs.pj.solos.length === 1 ? 'tiene pareja: también sale' : 'tienen pareja: también salen'}.` },
      { id: 'sin1', valor: cs.bien - 1, error: 'RMP34', siFuera: `Armaste bien el peor caso: ${pl(cs.bien - 1, u)} sin pareja completa. Falta la que obliga.` },
      { id: 'todo', valor: cs.T, error: 'RMP152', siFuera: `Sacar ${cs.copias === 1 ? 'las' : 'los'} ${f0(cs.T)} asegura la pareja, pero sobran.` },
      ...(cs.copias > 1 ? [{ id: 'copia', valor: cs.pj.pares.length + cs.pj.solos.length + 1, error: 'RMP31', siFuera: `Contaste un disco por número; pero de cada lado de una pareja salen las ${f0(cs.copias)} copias.` }] : []),
    ];
  }
  // Que la suma pase de S: salen primero las más chicas.
  function supera(valores, S) {
    const ord = valores.slice().sort((a, b) => a - b);
    let s = 0;
    for (let m = 1; m <= ord.length; m++) { s += ord[m - 1]; if (s > S) return { m, chicas: ord.slice(0, m - 1), suma: s - ord[m - 1], grandes: ord.slice().reverse() }; }
    return null;
  }
  function casoSupera(r) {
    for (let t = 0; t < 200; t++) {
      const N = r.ent(7, 12), S = r.ent(N + 2, Math.floor(N * (N + 1) / 2) - N - 1), sp = supera(rango(1, N), S);
      if (!sp || sp.m < 3 || usado('parejas', kSup(rango(1, N), S))) continue;
      let g = 0, s = 0; for (const x of sp.grandes) { g++; s += x; if (s > S) break; }
      return { N, S, sp, bien: sp.m, grandes: g };
    }
    return null;
  }
  const BIL = ['billete', 'billetes'];
  function billetes(B, M) {
    const vs = Object.keys(B).map(Number).sort((a, b) => a - b);
    let malo = 0; const det = [];
    for (const x of vs) {
      const y = M - x;
      if (y === x) { malo += Math.min(B[x], 1); det.push({ vals: [x], toma: Math.min(B[x], 1) }); }
      else if (B[y] !== undefined) { if (x < y) { const t = Math.max(B[x], B[y]); malo += t; det.push({ vals: [x, y], toma: t }); } }
      else { malo += B[x]; det.push({ vals: [x], toma: B[x], solo: true }); }
    }
    return { malo, bien: malo + 1, det, T: suma(vs.map(v => B[v])) };
  }
  const billTxt = B => `billetes: ${lista(Object.keys(B).map(Number).sort((a, b) => a - b).map(v => `${f0(B[v])} de S/ ${f0(v)}`))}`;

  const parejas = {
    id: 'parejas',
    titulo: 'Parejas y sumas',
    pregunta: '¿Qué cartas saca la mala suerte si buscas dos que sumen algo?',
    temas: ['Peor caso', 'Extracción de objetos'],
    pieza: CR,
    aprendizaje: 'Para tener dos que sumen algo, la peor suerte saca una de cada pareja y todas las sin pareja; la siguiente completa una.',
    actividad: 'Sacar cartas sin completar ninguna pareja que sume 8.',
    lee: {
      tarjetas: [
        { titulo: 'Las cartas de la feria', texto: 'En un juego de la feria hay cartas numeradas del 1 al 7, una de cada número. Se sacan sin mirar y no se devuelven.',
          pieza: CR, dibujo: { datos: cartasMesa(rango(1, 7).map(x => [x]), {}, { sueltas: true }), estado: {} } },
        { titulo: 'Parejas', texto: 'La meta es tener dos cartas que sumen 8. Dos cartas que suman lo pedido forman una pareja: el 1 y el 7, por ejemplo.' },
        { titulo: 'Qué mirar al jugar', texto: 'En la mesa, cada pareja va junta y unida por una raya. Haz de mala suerte: saca cartas sin completar ninguna pareja.' },
      ],
    },
    juega: {
      pieza: CR,
      consigna: 'Cartas del 1 al 7 en la mesa de la feria. La meta: dos cartas que sumen 8. Tú haces de mala suerte.',
      mision: {
        texto: 'Saca la mayor cantidad de cartas sin tener dos que sumen 8.',
        logrado: v => valJ5(v).every(n => n === 1) && v.d === 1,
        bien: [`Peor caso: una de cada pareja y el 4, ${pl(PEOR5, CAR)}. La siguiente cierra una pareja.`],
      },
      voz: '¿Qué carta completaría cada pareja?',
      leyenda: [
        { s: '1 a 7', t: 'el número de cada carta' },
        { s: 'raya', t: 'une dos cartas que suman 8' },
        { s: O('borde naranja'), t: 'salió y todavía no cumple la meta' },
        { s: I('borde turquesa'), t: 'la que completa una pareja' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Del 1 y el 7 salen', opciones: OPC_PAR },
        { id: 'b', etiqueta: 'Del 2 y el 6 salen', opciones: OPC_PAR },
        { id: 'c', etiqueta: 'Del 3 y el 5 salen', opciones: OPC_PAR },
        { id: 'd', etiqueta: 'El 4', opciones: [{ valor: 0, texto: 'No sale' }, { valor: 1, texto: 'Sale' }] },
      ],
      dibujo: val => ({ datos: cartasMesa(GR5, marcasJ5(val), { meta: `Meta: dos que sumen ${f0(S5)}` }), estado: {} }),
      lectura: val => lecturaJ5(val),
      minimo: 3,
    },
    predice: {
      pregunta: `Con cartas del 1 al ${f0(N_P5)}, una de cada número, ¿cuántas hay que sacar, como mínimo, para tener con certeza dos que sumen ${f0(S_P5)}?`,
      datos: [`Cartas del 1 al ${f0(N_P5)}, una de cada número.`, D_SIN],
      voz: 'Busca las parejas, y las que se quedan solas.',
      opciones: [
        { id: 'c', texto: pl(R_P5, CAR), correcta: true },
        { id: 'suerte', texto: pl(2, CAR), error: 'RM6', siFuera: 'Con suerte, las dos primeras ya suman 12. La certeza pide que alcance con la peor suerte.' },
        { id: 'sinsolas', texto: pl(PJ_P5.pares.length + 1, CAR), error: 'RMP30', siFuera: `Contaste una de cada pareja, ${f0(PJ_P5.pares.length)}, y sumaste 1. Pero el 1 y el 6 no tienen pareja: también salen.` },
        { id: 'sin1', texto: pl(R_P5 - 1, CAR), error: 'RMP34', siFuera: `Con ${f0(R_P5 - 1)} todavía puede no haber pareja completa. Falta la que obliga.` },
        { id: 'todo', texto: pl(N_P5, CAR), error: 'RMP152', siFuera: `Sacar las ${f0(N_P5)} asegura la pareja, pero sobran ${f0(N_P5 - R_P5)}.` },
      ],
      dibujo: { datos: cartasMesa(UNO_P5, {}, { sueltas: true, meta: META_P5 }), estado: {} },
      revelar: { datos: cartasMesa(GR_P5, marcasP5(), { meta: META_P5, cuenta: cuentaP5 }), estado: { corte: 4 } },
      coincide: `Coincide: una de cada pareja, las ${f0(PJ_P5.solos.length)} sin pareja y la que obliga.`,
      noCoincide: 'Revisemos: el 1 y el 6 no tienen con quién sumar 12; salen sin cumplir.',
    },
    mira: {
      pieza: CR,
      datos: cartasMesa(GR_P5, marcasP5({ mira: true }), { meta: META_P5, cuenta: cuentaP5 }),
      voz: 'Una de cada pareja, y las solas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La peor suerte saca una carta de cada pareja que suma 12.', ecuacion: ['2 + 10 = 3 + 9 = 4 + 8 = 5 + 7 = 12'] },
        { estado: { corte: 2 }, texto: 'El 1 y el 6 no tienen pareja: también salen, sin cumplir.', ecuacion: [`${f0(PJ_P5.pares.length)} + ${f0(PJ_P5.solos.length)} = ${f0(R_P5 - 1)}`] },
        { estado: { corte: 3 }, texto: 'La siguiente completa una pareja: obliga.', ecuacion: [`${f0(R_P5 - 1)} + 1 = ${f0(R_P5)}`] },
        { estado: { corte: 4 }, texto: `Con ${f0(R_P5 - 1)} todavía podía fallar; con ${f0(R_P5)}, ya no.` },
      ],
    },
    regla: {
      texto: 'Para tener dos que sumen lo pedido, la peor suerte saca una de cada pareja y todas las que no tienen pareja. La siguiente completa una.',
      ecuacion: [{ llave: ['peor caso'], nota: 'una de cada pareja y todas las sin pareja', color: 'c-o' }, ' + ', { llave: ['1'], nota: 'la que obliga', color: 'c-i' }],
      condicion: 'cada número está una vez. Si la suma debe pasar de un número, la peor suerte da primero las más chicas.',
      voz: 'De cada pareja, una carta; de las solas, todas.',
    },
    // En el mundo: las caras opuestas de un dado suman 7, y cada esquina junta una cara de cada pareja (el peor caso).
    // La pregunta pasa a un dado de 8 caras, con la regla dicha en el enunciado. Figura: la esquina del 1, el 2 y el 3,
    // en naranja (lo supuesto), sin violeta ni turquesa.
    // Revisión del Escribidor Escribano (28 nov): «ya seguían dados de hace unos cuatro mil años» era falso: los dados
    // de Egipto y Mesopotamia solían ponerse 1-2, 3-4 y 5-6, y en Europa la suma 7 se impuso hacia 1450 (Eerkens y de
    // Voogt, Acta Archaeologica, 2017; nota de UC Davis, 2018). La línea «3 + 1 = 4» se leía como suma de los números
    // de las caras; ahora termina en «4 caras». El cierre ya no dice «mal numerado», sino que no sigue la numeración de hoy.
    mundo: {
      hecho: 'Ninguna esquina del dado junta dos caras que sumen 7',
      parrafos: [
        'En un dado, las caras opuestas suman 7: el 1 está frente al 6, el 2 frente al 5 y el 3 frente al 4. Así se numeran los dados de hoy, una costumbre que en Europa se impuso hacia 1450. Como dos caras opuestas nunca se tocan, cada esquina junta tres caras, una de cada pareja.',
        ['Esa esquina es el peor caso de la regla, una cara de cada pareja, porque en el dado no hay caras sin pareja. Una cuarta cara es opuesta a una de las tres y completa una suma de 7:',
          { linea: [O('3'), ' + ', I('1'), ' = 4 caras'] },
          'Por eso basta mirar una esquina: si junta dos caras que suman 7, el dado no sigue la numeración de hoy.'],
      ],
      figura: {
        svg: `<svg viewBox="0 0 320 190" width="320" height="190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M90 22L148 52L90 82L32 52Z" style="fill:var(--card);stroke:var(--c-o)" stroke-width="3" stroke-linejoin="round"/>
    <path d="M32 52L90 82L90 160L32 130Z" style="fill:var(--card);stroke:var(--c-o)" stroke-width="3" stroke-linejoin="round"/>
    <path d="M90 82L148 52L148 130L90 160Z" style="fill:var(--card);stroke:var(--c-o)" stroke-width="3" stroke-linejoin="round"/>
    <text x="90" y="60" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">1</text>
    <text x="61" y="129" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">2</text>
    <text x="119" y="129" text-anchor="middle" font-size="24" font-weight="800" fill="currentColor">3</text>
    <text x="236" y="62" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--c-o)">Se ven: 1, 2 y 3</text>
    <text x="236" y="96" text-anchor="middle" font-size="17" fill="currentColor">Detrás quedan</text>
    <text x="236" y="120" text-anchor="middle" font-size="17" fill="currentColor">el 6, el 5 y el 4</text>
    <text x="236" y="154" text-anchor="middle" font-size="15" style="fill:var(--muted)">Ninguna suma 7</text>
  </svg>`,
        alt: 'Un dado visto desde una esquina, con el 1 arriba y el 2 y el 3 a los lados, bordeados en naranja. Detrás quedan el 6, el 5 y el 4, opuestos a ellos, así que ninguna de las tres caras que se ven suma 7 con otra.',
      },
      pregunta: {
        texto: 'En un dado de 8 caras, las caras opuestas suman 9. ¿Cuántas caras tienes que mirar, como mínimo, para ver con certeza dos que sumen 9?',
        opciones: [
          { id: 'c', texto: '5 caras', correcta: true },
          { id: 'cuatro', texto: '4 caras', error: 'RMP34',
            siFuera: 'Es cierto que con el dado de 6 caras bastan 4. Pero aquí hay cuatro parejas, y 4 caras pueden ser una de cada pareja, como el 1, el 2, el 3 y el 4.' },
          { id: 'dos', texto: '2 caras', error: 'RM6',
            siFuera: 'Con buena suerte, las dos primeras caras ya suman 9. La certeza pide que alcance también si la suerte te muestra una cara de cada pareja.' },
          { id: 'ocho', texto: '8 caras', error: 'RMP152',
            siFuera: 'Mirar las 8 caras asegura la suma, pero sobran: con la peor suerte, la suma de 9 ya aparece antes de mirar la última.' },
        ],
        porque: 'Suman 9 el 1 y el 8, el 2 y el 7, el 3 y el 6, el 4 y el 5. La peor suerte muestra una cara de cada pareja, que son cuatro, y la quinta completa una.',
      },
      fuente: 'Numeración de los dados: Eerkens y de Voogt, Acta Archaeologica (2017); dado de 8 caras, Wolfram Demonstrations.',
    },
    ejemplos: null,
    resuelve: {
      pieza: CR,
      generar(s) {
        const r = azar(s + 900), cs = casoPareja(r), { pj } = cs;
        return {
          enunciado: `En otro juego de la feria hay fichas del 1 al ${f0(cs.N)}, una de cada número. ¿Cuántas hay que sacar, como mínimo, para tener con certeza dos que sumen ${f0(cs.S)}?`,
          datos: [`Fichas del 1 al ${f0(cs.N)}, una de cada número.`, D_SIN],
          dibujo: { datos: cartasMesa(rango(1, cs.N).map(x => [x]), {}, { sueltas: true, titulo: 'Fichas', meta: `Meta: dos que sumen ${f0(cs.S)}` }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden el menor número de fichas que asegura dos que sumen ${f0(cs.S)}.` },
            { tipo: 'datos', texto: `Parejas: ${pj.pares.map(p => `${p[0]} y ${p[1]}`).join('; ')}. Sin pareja: ${lista(pj.solos.map(String))}.` },
            { tipo: 'regla', texto: 'La peor suerte saca una de cada pareja y todas las que no tienen pareja. La siguiente completa una.' },
            { tipo: 'cuentas', texto: `Peor caso: ${f0(pj.pares.length)} de las parejas y ${f0(pj.solos.length)} sin pareja.`, ecuacion: [`${f0(pj.pares.length)} + ${f0(pj.solos.length)} = ${f0(cs.malo)}`] },
            { tipo: 'cuentas', texto: 'La siguiente es la compañera de alguna que ya salió.', ecuacion: [`${f0(cs.malo)} + 1 = `, F(f0(cs.bien))] },
            { tipo: 'sentido', texto: `Si olvidara ${lista(pj.solos.map(String))}, contaría de menos: esas también pueden salir sin cumplir.` },
          ],
          respuesta: [F(pl(cs.bien, ['ficha', 'fichas']))],
        };
      },
    },
    // Ahora tú (semilla % 4): 0 cartas del 1 al N, dos que sumen S · 1 discos repetidos (dos de cada número) · 2 que la
    // suma pase de S · 3 nivel examen: billetes que sumen un monto exacto.
    ahoraTu: {
      pieza: CR,
      voz: 'Una de cada pareja, y todas las solas.',
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo === 2) {
          const cs = casoSupera(r), u = CAR;
          const d = [{ id: 'grandes', valor: cs.grandes, error: 'RMP31', siFuera: `Tomaste las más grandes: con ${f0(cs.grandes)} ya pasaría. La peor suerte da primero las más chicas.` },
            { id: 'sin1', valor: cs.bien - 1, error: 'RMP34', siFuera: `Con ${f0(cs.bien - 1)} las más chicas suman ${f0(cs.sp.suma)}: todavía no pasa de ${f0(cs.S)}.` },
            { id: 'mas', valor: cs.bien + 1, error: 'RMP34', siFuera: 'Sumaste una de más: después de las más chicas, la siguiente ya obliga.' },
            { id: 'todo', valor: cs.N, error: 'RMP152', siFuera: `Voltear las ${f0(cs.N)} asegura la suma, pero sobran.` }];
          return { pregunta: `Hay ${f0(cs.N)} cartas boca abajo, numeradas del 1 al ${f0(cs.N)}. ¿Cuántas hay que voltear, como mínimo, para que con certeza la suma de las volteadas pase de ${f0(cs.S)}?`,
            datos: [`Cartas del 1 al ${f0(cs.N)}, una de cada número.`, `Pasar de ${f0(cs.S)}: ${f0(cs.S + 1)} o más.`],
            dibujo: { datos: cartasMesa(rango(1, cs.N).map(() => ['?']), {}, { sueltas: true, meta: `Meta: suma mayor que ${f0(cs.S)}` }), estado: {} },
            opciones: opcionesNum(cs.bien, u, d, 5),
            solucion: { texto: `Las más chicas primero, del 1 al ${f0(cs.bien - 1)}: suman ${f0(cs.sp.suma)}, sin pasar. La siguiente sí pasa.`, ecuacion: [`${f0(cs.bien - 1)} + 1 = `, F(f0(cs.bien))] } };
        }
        if (tipo === 3) {
          let B, M;
          do { B = { 10: r.ent(3, 7), 20: r.ent(2, 6), 50: r.ent(2, 5), 100: r.ent(1, 4) }; M = r.elegir([60, 70, 120, 150]); } while (usado('parejas', kBil(B, M)));
          const bl = billetes(B, M);
          const par = bl.det.find(x => x.vals.length === 2), d = [
            { id: 'suerte', valor: 2, error: 'RM6', siFuera: 'Con buena suerte, los dos primeros ya suman el monto. La certeza pide la peor suerte.' },
            { id: 'sin1', valor: bl.bien - 1, error: 'RMP34', siFuera: `Armaste bien el peor caso: ${pl(bl.malo, BIL)} sin el monto. Falta el que obliga.` },
            { id: 'solo', valor: (par ? par.toma : 0) + 1, error: 'RMP30', siFuera: 'Miraste solo los billetes que forman el monto; los que no sirven también salen antes.' },
            { id: 'todo', valor: bl.T, error: 'RMP152', siFuera: `Sacar los ${f0(bl.T)} asegura el monto, pero sobran.` }];
          return { pregunta: `La caja de la colecta tiene ${billTxt(B)}. ¿Cuántos hay que sacar, como mínimo, para tener con certeza dos que sumen S/ ${f0(M)}?`,
            datos: [D_SIN, `Dos billetes suman S/ ${f0(M)} si sus valores suman ${f0(M)}.`],
            opciones: opcionesNum(bl.bien, BIL, d, 5),
            solucion: { texto: 'Peor caso: salen todos los que no hacen pareja y, de cada pareja, el valor del que hay más.', ecuacion: [`${bl.det.map(x => f0(x.toma)).join(' + ')} + 1 = `, F(f0(bl.bien))] } };
        }
        const cs = casoPareja(r, tipo === 1 ? 2 : 1), u = tipo === 1 ? ['disco', 'discos'] : CAR;
        const preg = tipo === 1 ? `En una caja hay discos numerados del 1 al ${f0(cs.N)}, dos de cada número. ¿Cuántos hay que sacar, como mínimo, para tener con certeza dos que sumen ${f0(cs.S)}?`
          : `Con cartas del 1 al ${f0(cs.N)}, una de cada número, ¿cuántas hay que sacar, como mínimo, para tener con certeza dos que sumen ${f0(cs.S)}?`;
        return { pregunta: preg, datos: [tipo === 1 ? `Discos del 1 al ${f0(cs.N)}, dos de cada número.` : `Cartas del 1 al ${f0(cs.N)}, una de cada número.`, D_SIN],
          dibujo: { datos: cartasMesa(rango(1, cs.N).map(x => [x]), {}, { sueltas: true, titulo: tipo === 1 ? 'Caja de discos' : undefined, meta: `Meta: dos que sumen ${f0(cs.S)}` }), estado: {} },
          opciones: opcionesNum(cs.bien, u, distPareja(cs), 5),
          solucion: { texto: `Parejas: ${f0(cs.pj.pares.length)}; ${!cs.pj.solos.length ? 'todos los números tienen pareja' : `sin pareja: ${cs.pj.solos.length > 4 ? `${f0(cs.pj.solos.length)} números` : lista(cs.pj.solos.map(String))}`}. ${tipo === 1 ? 'De cada pareja salen los dos discos de un lado.' : 'Sale una de cada pareja y las solas.'}`,
            ecuacion: [`${f0(cs.malo)} + 1 = `, F(f0(cs.bien))] } };
      },
    },
  };

  // ---------- Ejemplos de «Parejas y sumas» ----------
  // Resueltos aparte (e7-rm/ejemplos.py, todos los grupos de cartas posibles): 1 → 4 · 2 → el 1 y el 2 · 3 → 6 · 4 → 5 ·
  // 5 → 5 · 6 → 7 · 7 → 8 · 8 → 5 · 9 → 10 · 10 → 8 · 11 → 13 (E) · 12 → 13 (A) · 13 → 8 (B) · 14 → 9 (C) · 15 → 15 (D).
  const figCartas = (N, meta, o = {}) => ({ pieza: CR, datos: cartasMesa(rango(1, N).map(x => [o.tapadas ? '?' : x]), {}, Object.assign({ sueltas: true, meta }, o)), estado: {} });
  function ejPareja(o) {
    const { N, S } = o, copias = o.copias || 1, pj = parejasDe(N, S);
    const malo = copias * pj.pares.length + copias * (pj.solos.length - (pj.mitad ? 1 : 0)) + (pj.mitad ? 1 : 0), bien = malo + 1;
    const u = copias > 1 ? ['disco', 'discos'] : CAR;
    const sol = [{ texto: `${pj.pares.length > 6 ? `Parejas que suman ${f0(S)}: de ${pj.pares[0][0]} y ${pj.pares[0][1]} a ${pj.pares[pj.pares.length - 1][0]} y ${pj.pares[pj.pares.length - 1][1]}, ${f0(pj.pares.length)} en total` : `Parejas que suman ${f0(S)}: ${pj.pares.map(p => `${p[0]} y ${p[1]}`).join('; ')}`}.${pj.solos.length ? ` Sin pareja: ${lista(pj.solos.map(String))}${pj.mitad ? ` (el ${pj.mitad} necesitaría otro ${pj.mitad})` : ''}.` : ''}` },
      { texto: copias > 1 ? `Peor caso: de cada pareja, los ${f0(copias)} de un mismo lado${pj.solos.length ? ', y los que no tienen pareja' : ''}${pj.mitad ? ` (del ${pj.mitad}, uno solo)` : ''}: ${pl(malo, u)} sin pareja completa.`
        : `Peor caso: una carta de cada pareja${pj.solos.length ? ' y todas las sin pareja' : ''}: ${pl(malo, u)} sin pareja completa.`,
        ecuacion: [copias > 1 ? `${f0(copias)} × ${f0(pj.pares.length)}${pj.solos.length - (pj.mitad ? 1 : 0) ? ` + ${f0(copias)} × ${f0(pj.solos.length - (pj.mitad ? 1 : 0))}` : ''}${pj.mitad ? ' + 1' : ''} = ${f0(malo)}`
          : `${f0(pj.pares.length)}${pj.solos.length ? ` + ${f0(pj.solos.length)}` : ''} = ${f0(malo)}`] },
      { texto: 'La siguiente completa una pareja: obliga.', ecuacion: [`${f0(malo)} + 1 = `, F(f0(bien))] }];
    const enun = copias > 1 ? `En una caja hay discos numerados del 1 al ${f0(N)}, ${copias === 2 ? 'dos' : 'tres'} de cada número. ¿Cuántos hay que sacar, como mínimo, para tener con certeza dos que sumen ${f0(S)}?`
      : `Con cartas del 1 al ${f0(N)}, una de cada número, ¿cuántas hay que sacar, como mínimo, para tener con certeza dos que sumen ${f0(S)}?`;
    return ejCierra(Object.assign({ _caso: kPar(N, S, copias), datos: [copias > 1 ? `Discos del 1 al ${f0(N)}, ${copias === 2 ? 'dos' : 'tres'} de cada número.` : `Cartas del 1 al ${f0(N)}, una de cada número.`, D_SIN] }, o),
      bien, sol, enun, figCartas(N, `Meta: dos que sumen ${f0(S)}`, copias > 1 ? { titulo: 'Caja de discos' } : {}), u);
  }
  function ejSupera(o) {
    const sp = supera(o.valores, o.S), bien = sp.m;
    const prox = o.valores.slice().sort((a, b) => a - b)[bien - 1];
    const sol = [{ texto: `La peor suerte da primero las más chicas: ${pl(bien - 1, CAR)} que suman`, ecuacion: [`${sp.chicas.join(' + ')} = ${f0(sp.suma)}`] },
      { texto: `Todavía no pasa de ${f0(o.S)}. La siguiente, la más chica que queda (el ${f0(prox)}), ya pasa:`, ecuacion: [`${f0(sp.suma)} + ${f0(prox)} = ${f0(sp.suma + prox)}`] },
      { texto: 'Se cuentan las cartas volteadas:', ecuacion: [`${f0(bien - 1)} + 1 = `, F(f0(bien))] }];
    return ejCierra(Object.assign({ _caso: kSup(o.valores, o.S), datos: [`Las cartas: ${lista(o.valores.map(String))}.`, `Pasar de ${f0(o.S)}: ${f0(o.S + 1)} o más.`] }, o), bien, sol,
      `Hay ${f0(o.valores.length)} cartas boca abajo con los números ${lista(o.valores.map(String))}. ¿Cuántas hay que voltear, como mínimo, para que con certeza la suma de las volteadas pase de ${f0(o.S)}?`,
      { pieza: CR, datos: cartasMesa(o.valores.map(() => ['?']), {}, { sueltas: true, meta: `Meta: suma mayor que ${f0(o.S)}` }), estado: {} }, CAR);
  }
  function ejBilletes(o) {
    const bl = billetes(o.B, o.M);
    const sol = [{ texto: bl.det.map(x => (x.vals.length === 2 ? `S/ ${x.vals[0]} y S/ ${x.vals[1]} hacen pareja: salen los ${f0(x.toma)} del que hay más` : x.solo ? `S/ ${x.vals[0]} no hace pareja: salen los ${f0(x.toma)}` : `S/ ${x.vals[0]} con otro igual: sale ${f0(x.toma)}`)).join('; ') + '.' },
      { texto: 'El siguiente completa el monto.', ecuacion: [`${bl.det.map(x => f0(x.toma)).join(' + ')} + 1 = `, F(f0(bl.bien))] }];
    return ejCierra(Object.assign({ _caso: kBil(o.B, o.M), datos: [D_SIN, `Dos billetes suman S/ ${f0(o.M)} si sus valores suman ${f0(o.M)}.`] }, o), bl.bien, sol,
      `La caja de la colecta tiene ${billTxt(o.B)}. ¿Cuántos hay que sacar, como mínimo, para tener con certeza dos que sumen S/ ${f0(o.M)}?`, undefined, BIL);
  }
  // Dos colores con los números del 1 al N cada uno: dos de distinto color y distinto número que sumen S (2023-I, 28).
  function ejColorSuma(o) {
    const { N, S } = o, pj = parejasDe(N, S), malo = N + pj.solos.length, bien = malo + 1;
    const objs = [...rango(1, N).map(x => ({ forma: 'bola', t: String(x) })), ...rango(1, N).map(x => ({ forma: 'bola', t: String(x), relleno: 1 }))];
    const sol = [{ texto: `Dos del mismo color no sirven: con la peor suerte salen los ${f0(N)} blancos.` },
      { texto: `De los negros, los que no tienen pareja: ${lista(pj.solos.map(String))}${pj.mitad ? ` (el ${pj.mitad} necesita un ${pj.mitad} de otro número)` : ''}.`, ecuacion: [`${f0(N)} + ${f0(pj.solos.length)} = ${f0(malo)}`] },
      { texto: 'El siguiente es negro con pareja entre los blancos.', ecuacion: [`${f0(malo)} + 1 = `, F(f0(bien))] }];
    return ejCierra(Object.assign({ datos: [`Bolos blancos del 1 al ${f0(N)} y negros del 1 al ${f0(N)}.`, D_SIN] }, o), bien, sol,
      `En una caja hay bolos blancos numerados del 1 al ${f0(N)} y negros, también del 1 al ${f0(N)}. ¿Cuántos hay que sacar, como mínimo, para tener con certeza dos de distinto color y distinto número que sumen ${f0(S)}?`,
      { pieza: CR, datos: { escena: 'recipiente', recipiente: 'tombola', titulo: 'Caja de bolos', meta: `Meta: distinto color, suma ${f0(S)}`, objetos: objs, nota: 'En gris, los bolos negros.' }, estado: {} }, ['bolo', 'bolos']);
  }
  const EJEMPLOS_PAR = [
    ejPareja({ nivel: 1, titulo: 'Dos que sumen 6', N: 5, S: 6 }),
    (() => {
      const N = 8, S = 11, pj = parejasDe(N, S);
      return { nivel: 1, titulo: 'Las que no tienen pareja', _caso: kPar(N, S, 1), enunciado: `Con cartas del 1 al ${f0(N)}, una de cada número, la meta es tener dos que sumen ${f0(S)}. ¿Qué cartas no tienen pareja?`,
        datos: [`Cartas del 1 al ${f0(N)}, una de cada número.`], figura: figCartas(N, `Meta: dos que sumen ${f0(S)}`),
        solucion: [{ texto: `Al 1 le faltaría el 10 y al 2, el 9: no están. Las demás sí: ${pj.pares.map(p => `${p[0]} y ${p[1]}`).join('; ')}.` }],
        respuesta: [F(`El ${pj.solos[0]} y el ${pj.solos[1]}`)] };
    })(),
    ejPareja({ nivel: 1, titulo: 'Dos que sumen 10', N: 9, S: 10 }),
    ejSupera({ nivel: 1, titulo: 'Que la suma pase de 10', valores: rango(1, 6), S: 10 }),
    ejPareja({ nivel: 1, titulo: 'Todas con pareja', N: 8, S: 9 }),
    ejPareja({ nivel: 2, titulo: 'Discos repetidos', N: 6, S: 7, copias: 2 }),
    ejPareja({ nivel: 2, titulo: 'El número de la mitad', N: 10, S: 14 }),
    ejSupera({ nivel: 2, titulo: 'Que pase de 20', valores: [2, 3, 5, 6, 8, 9], S: 20 }),
    ejBilletes({ nivel: 2, titulo: 'Billetes de la colecta', B: { 10: 5, 20: 4, 50: 3 }, M: 70 }),
    ejPareja({ nivel: 2, titulo: 'Dos que sumen 15', N: 12, S: 15 }),
    ejPareja({ nivel: 3, titulo: 'Del 1 al 20, suma 25', N: 20, S: 25,
      alts: [{ v: 2 }, { v: 9 }, { v: 12 }, { v: 20 }, { v: 13, ok: true }],
      explica: '2 es con buena suerte; 9 olvida del 1 al 4, que no tienen pareja; 12 olvida la que obliga; 20 es sacar todas.' }),
    ejPareja({ nivel: 3, titulo: 'Tres discos de cada número', N: 8, S: 9, copias: 3,
      alts: [{ v: 13, ok: true }, { v: 5 }, { v: 12 }, { v: 24 }, { v: 2 }],
      explica: '5 cuenta un disco por número; 12 olvida el que obliga; 24 es sacar todos; 2 es con buena suerte.' }),
    ejSupera({ nivel: 3, titulo: 'Voltear hasta pasar de 30', valores: rango(1, 10), S: 30,
      alts: [{ v: 4 }, { v: 8, ok: true }, { v: 7 }, { v: 10 }, { v: 9 }],
      explica: '4 toma las más grandes (10 + 9 + 8 + 7); 7 suma 28 y no pasa; 10 es voltear todas; 9 suma una de más.' }),
    ejColorSuma({ nivel: 3, titulo: 'Distinto color, suma 9', N: 6, S: 9,
      alts: [{ v: 2 }, { v: 7 }, { v: 9, ok: true }, { v: 8 }, { v: 12 }],
      explica: '2 es con buena suerte; 7 olvida que también salen el 1 y el 2 negros; 8 olvida el que obliga; 12 es sacar todos.' }),
    ejBilletes({ nivel: 3, titulo: 'Un monto exacto', B: { 10: 6, 20: 5, 50: 4, 100: 3 }, M: 60,
      alts: [{ v: 2 }, { v: 7 }, { v: 14 }, { v: 15, ok: true }, { v: 18 }],
      explica: '2 es con buena suerte; 7 mira solo los de S/ 10; 14 olvida el que obliga; 18 es sacar todos.' }),
  ];
  parejas.ejemplos = EJEMPLOS_PAR;
  juntar('parejas', EJEMPLOS_PAR, [kPar(7, S5, 1), kPar(N_P5, S_P5, 1)]);

  // ---------- Idea 6: llaves y candados ----------
  // Objeto: los casilleros del gimnasio, 4 candados y 4 llaves sueltas (rm-certeza, escena «llaves»: filas = llaves,
  // columnas = candados). Cambia: en qué intento abre cada llave (el alumno hace de mala suerte). · Permanece: los
  // candados. · Progresa: cuántas pruebas se gastan. · Se reserva: 10 llaves (Predice). · Debe verse: el último candado
  // de cada llave ya no se prueba: se deduce.
  const PRU = ['prueba', 'pruebas'];
  const N6 = 4;
  // Las marcas de cada llave: prueba los candados que quedan, en orden; abre en el intento k (el último se deduce).
  function filasLlaves(n, intentos, nc = n) {
    const libres = rango(0, nc - 1), filas = [], pruebas = [];
    intentos.forEach((k, i) => {
      const quedan = libres.length, fila = Array(nc).fill('-');
      libres.forEach(j => { fila[j] = ''; });
      const t = Math.min(k, quedan - 1);
      for (let q = 0; q < k - 1; q++) fila[libres[q]] = 'x';
      fila[libres[k - 1]] = k < quedan ? 'a' : 'd';
      pruebas.push(t);
      libres.splice(k - 1, 1);
      filas.push(fila);
      void i;
    });
    return { filas, pruebas };
  }
  const peorLlaves = (n, nc = n) => filasLlaves(n, rango(1, n).map(i => nc - i + 1), nc);
  const valJ6 = val => [val.a, val.b, val.c, 1];
  function datosJ6(val, o = {}) {
    const L = filasLlaves(N6, valJ6(val));
    return Object.assign({ escena: 'llaves', llaves: N6, filas: L.filas, totales: L.pruebas.map(t => pl(t, PRU)) }, o);
  }
  function lecturaJ6(val) {
    const p = filasLlaves(N6, valJ6(val)).pruebas;
    return [`Pruebas: ${p.slice(0, 3).map(f0).join(' + ')} = ${f0(suma(p))}; la llave 4 no se prueba`];
  }
  const MAX6 = suma(peorLlaves(N6).pruebas);
  if (MAX6 !== 6) throw new Error('juego de la idea 6');
  // La predicción: 10 llaves y 10 candados. Peor caso: 9 + 8 + … + 1.
  const N_P6 = 10, R_P6 = suma(rango(1, N_P6 - 1));
  if (R_P6 !== 45 || suma(peorLlaves(N_P6).pruebas) !== R_P6) throw new Error('predicción de la idea 6');
  const sumaBaja = n => (n <= 1 ? '0' : n <= 5 ? rango(1, n - 1).reverse().join(' + ') : `${n - 1} + ${n - 2} + … + 1`);

  function distLlaves(n, k = n) {
    const bien = suma(rango(1, k).map(i => n - i)), todas = suma(rango(1, k).map(i => n - i + 1));
    return { bien, d: [
      { id: 'suerte', valor: k, error: 'RM6', siFuera: k < n ? `Con buena suerte, cada llave abre en su primer intento: ${f0(k)}. La certeza pide la peor suerte.`
        : 'Una prueba por llave es contar con que cada una abra al primer intento; la certeza pide la peor suerte.' },
      { id: 'ultima', valor: todas, error: 'RMP34', siFuera: `Probaste también el último candado de cada llave, pero ese ya se sabe sin probar.` },
      { id: 'todas', valor: n * k, error: 'RMP154', siFuera: `${f0(n * k)} es probar cada llave en todos los candados, también en los que ya se abrieron.` },
      { id: 'primera', valor: n - 1, error: 'RMP31', siFuera: `${f0(n - 1)} son las pruebas de la primera llave; faltan las de las otras.` },
    ] };
  }

  const ident = {
    id: 'llaves',
    titulo: 'Llaves y candados',
    pregunta: '¿Por qué la última llave no se prueba?',
    temas: ['Identificación de objetos', 'Peor caso'],
    pieza: CR,
    aprendizaje: 'En el peor caso cada llave falla en todos los candados que quedan menos uno, que ya no se prueba: se deduce.',
    actividad: 'Decidir en qué intento abre cada llave para gastar la mayor cantidad de pruebas.',
    lee: {
      tarjetas: [
        { titulo: 'Los casilleros del gimnasio', texto: 'En el gimnasio del colegio hay 4 casilleros con candado y 4 llaves sueltas, mezcladas. Cada llave abre un solo candado. Los números solo sirven para nombrarlas: la llave 1 no tiene por qué abrir el candado 1.',
          pieza: CR, dibujo: { datos: { escena: 'llaves', llaves: N6, filas: [] }, estado: {} } },
        { titulo: 'Una prueba', texto: 'Probar es meter una llave en un candado: abre o no abre. Identificar es saber, con certeza, qué llave abre cada candado.' },
        { titulo: 'Qué mirar al jugar', texto: 'Tú haces de mala suerte: decides en qué intento abre cada llave. Mira cuántas pruebas gasta cada llave.' },
      ],
    },
    juega: {
      pieza: CR,
      consigna: 'Cuatro candados del gimnasio y sus cuatro llaves, mezcladas. Cada llave prueba los candados que quedan, en orden. Tú haces de mala suerte.',
      mision: {
        texto: 'Haz que la mala suerte gaste la mayor cantidad de pruebas.',
        logrado: v => suma(filasLlaves(N6, valJ6(v)).pruebas) === MAX6,
        bien: [`Peor caso: 3 + 2 + 1 = ${f0(MAX6)} pruebas. Lo que queda se sabe sin probar.`],
      },
      voz: 'Si quedan dos candados y uno falla, el otro ya se sabe.',
      leyenda: [
        { s: O('✗'), t: 'una prueba que falla' },
        { s: '✓', t: 'una prueba que abre' },
        { s: I('✓'), t: 'se sabe sin probar' },
        { s: '–', t: 'candado que ya tiene su llave' },
      ],
      controles: [
        { id: 'a', etiqueta: 'La llave 1 abre en el intento', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
        { id: 'b', etiqueta: 'La llave 2 abre en el intento', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 },
        { id: 'c', etiqueta: 'La llave 3 abre en el intento', min: 1, max: 2, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: val => ({ datos: datosJ6(val), estado: {} }),
      lectura: val => lecturaJ6(val),
      minimo: 3,
    },
    predice: {
      pregunta: `En otro gimnasio hay ${f0(N_P6)} candados y ${f0(N_P6)} llaves mezcladas. ¿Cuántas pruebas hacen falta, como mínimo, para saber con certeza qué llave abre cada candado?`,
      datos: ['Cada llave abre un solo candado.', 'Una prueba: meter una llave en un candado.'],
      voz: 'Piensa en la peor suerte de cada llave.',
      opciones: [
        { id: 'c', texto: pl(R_P6, PRU), correcta: true },
        { id: 'suerte', texto: pl(N_P6, PRU), error: 'RM6', siFuera: 'Una prueba por llave es contar con que cada una abra al primer intento; la certeza pide la peor suerte.' },
        { id: 'ultima', texto: pl(R_P6 + N_P6, PRU), error: 'RMP34', siFuera: `${f0(R_P6 + N_P6)} prueba también el último candado de cada llave, que ya se sabe sin probar.` },
        { id: 'todas', texto: pl(N_P6 * N_P6, PRU), error: 'RMP154', siFuera: 'Probar todas con todas asegura, pero cada candado abierto ya no se vuelve a probar.' },
      ],
      dibujo: { datos: { escena: 'llaves', llaves: N_P6, filas: [] }, estado: {} },
      revelar: { datos: { escena: 'llaves', llaves: N_P6, filas: peorLlaves(N_P6).filas, cuenta: [{ t: sumaBaja(N_P6), papel: 'peor' }, { t: `= ${f0(R_P6)}`, papel: 'seguro' }] }, estado: {} },
      coincide: `Coincide: la primera llave falla 9 veces, la segunda 8… y la última no se prueba.`,
      noCoincide: 'Revisemos: cada candado abierto sale del juego, y el último de cada llave se sabe sin probar.',
    },
    mira: {
      pieza: CR,
      datos: Object.assign({ escena: 'llaves', llaves: N6 }, (() => { const L = peorLlaves(N6); return { filas: L.filas, totales: L.pruebas.map(t => pl(t, PRU)), filasDesde: [1, 2, 3, 3] }; })()),
      voz: 'Cada llave, una prueba menos que la anterior.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Llave 1: falla en 3 candados; el cuarto ya se sabe, sin probar.' },
        { estado: { corte: 2 }, texto: 'Llave 2: quedan 3 candados; falla en 2 y el tercero se sabe.' },
        { estado: { corte: 3 }, texto: 'Llave 3: falla en 1. La llave 4 ni se prueba.', ecuacion: [`3 + 2 + 1 = ${f0(MAX6)}`] },
        { estado: { corte: 3 }, texto: 'Con 10 llaves pasa igual: 9 pruebas, 8, 7… hasta 1.', ecuacion: [`9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 = ${f0(R_P6)}`] },
      ],
    },
    regla: {
      texto: 'En el peor caso, cada llave falla en todos los candados que quedan menos uno, que ya no se prueba: se deduce. Cada llave, una prueba menos.',
      ecuacion: [{ llave: ['(llaves − 1) + … + 2 + 1'], nota: 'pruebas: una menos por llave', color: 'c-o' }],
      condicion: 'cada llave abre un solo candado. Con más candados que llaves, la primera falla en todos menos uno: 7 candados, 6 pruebas.',
      voz: 'Lo último no se prueba: se deduce.',
    },
    // En el mundo: la clave PIN de 4 cifras y el bloqueo del BCP (más de 3 claves equivocadas en una compra). Un solo
    // candado con muchas claves: la condición de la regla («la primera falla en todos menos uno»). Cuentas en código.
    mundo: (() => {
      const N = 10000, PEOR = N - 1, POR_DIA = 4, ANOS = Math.floor(PEOR / POR_DIA / 365), M = 1000;
      return {
        hecho: 'Una clave de cuatro cifras aguanta años de intentos',
        parrafos: [
          `La clave PIN de una tarjeta del BCP tiene 4 cifras, y con cifras del 0 al 9 hay ${f0(N)} claves posibles, del 0000 al 9999. Si en una compra alguien escribe una clave equivocada más de 3 veces, el banco bloquea la tarjeta hasta las 00:00 del día siguiente.`,
          ['Quien no sabe la clave prueba una por una, y cada intento acierta o falla, como una llave en un candado. En el peor caso falla en todas menos una, la que se deduce sin probarla:',
            { linea: [O(`${f0(N)} − 1`), ` = ${PEOR} pruebas`] },
            `Con ${f0(POR_DIA)} intentos por día como mucho, ese peor caso le tomaría más de ${ANOS === 6 ? 'seis' : f0(ANOS)} años, así que el bloqueo protege tu tarjeta.`],
        ],
        pregunta: {
          texto: 'Un candado de maleta tiene 3 ruedas, cada una con las cifras del 0 al 9. ¿Cuántas pruebas hacen falta, como mínimo, para saber con certeza su clave?',
          opciones: [
            { id: 'c', texto: `${M - 1} pruebas`, correcta: true },
            { id: 'todas', texto: `${M} pruebas`, error: 'RMP34',
              siFuera: `Es cierto que hay ${M} claves, del 000 al 999. Pero si ${M - 1} fallan, la que queda es la clave: se deduce sin probarla.` },
            { id: 'ruedas', texto: '30 pruebas', error: 'RMP32',
              siFuera: 'Sería así si cada rueda se pudiera probar sola. El candado abre solo con las tres cifras juntas, y cada prueba es una clave entera.' },
            { id: 'suma', texto: `${f0((M - 1) * M / 2)} pruebas`, error: 'RMP154',
              siFuera: 'La suma de una prueba menos por llave sirve con muchas llaves y muchos candados. Aquí hay un solo candado, y cada clave que falla es una sola prueba.' },
          ],
          porque: `Con tres ruedas hay ${M} claves. En el peor caso fallan todas menos una, que son ${M - 1} pruebas, y la última ya no se prueba: es la clave.`,
        },
        fuente: 'BCP, página «Clave PIN»: clave de 4 dígitos y bloqueo tras más de 3 claves incorrectas en una compra.',
      };
    })(),
    ejemplos: null,
    resuelve: {
      pieza: CR,
      generar(s) {
        const r = azar(s + 900);
        let n; do { n = r.ent(5, 14); } while (usado('llaves', kLl(n, n, 0)));
        const L = peorLlaves(n), bien = suma(L.pruebas);
        return {
          enunciado: `En la sala de cómputo hay ${f0(n)} armarios con candado y sus ${f0(n)} llaves, mezcladas. ¿Cuántas pruebas hacen falta, como mínimo, para saber con certeza qué llave abre cada uno?`,
          datos: ['Cada llave abre un solo candado.', 'Una prueba: meter una llave en un candado.'],
          dibujo: { datos: { escena: 'llaves', llaves: n, filas: [] }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden cuántas pruebas aseguran saber todas las llaves, aunque la suerte juegue en contra.' },
            { tipo: 'datos', texto: `Hay ${f0(n)} llaves y ${f0(n)} candados; cada candado abierto ya no se vuelve a probar.` },
            { tipo: 'regla', texto: 'Cada llave falla en todos los candados que quedan menos uno; ese último se deduce sin probar.' },
            { tipo: 'cuentas', texto: `La primera llave gasta ${f0(n - 1)}, la segunda ${f0(n - 2)}, y así hasta 1; la última no se prueba.`, ecuacion: [`${n > 9 ? `${f0(n - 1)} + ${f0(n - 2)} + … + 1` : L.pruebas.slice(0, -1).map(f0).join(' + ')} = `, F(f0(bien))],
              dibujo: { datos: { escena: 'llaves', llaves: n, filas: L.filas }, estado: {} } },
            { tipo: 'sentido', texto: `Probar todas con todas serían ${f0(n * n)}: sobran las de los candados ya abiertos y los que se deducen.` },
          ],
          respuesta: [F(pl(bien, PRU))],
        };
      },
    },
    // Ahora tú (semilla % 4): 0 n llaves y n candados · 1 más candados que llaves · 2 ya se sabe la llave de m candados ·
    // 3 nivel examen: 9 a 12 puertas.
    ahoraTu: {
      pieza: CR,
      voz: 'Cada llave, una prueba menos.',
      generar(s) {
        const r = azar(s), tipo = s % 4, D = ['Cada llave abre un solo candado.', 'Una prueba: meter una llave en un candado.'];
        if (tipo === 1) {
          let k, n; do { k = r.ent(3, 5); n = k + r.ent(1, 3); } while (usado('llaves', kLl(n, k, 0)));
          const { bien, d } = distLlaves(n, k);
          d.push({ id: 'iguales', valor: suma(rango(1, k - 1)), error: 'RMP31', siFuera: `Contaste como si hubiera ${f0(k)} candados; con ${f0(n)}, cada llave falla en más.` });
          return { pregunta: `Hay ${f0(n)} casilleros con candado, pero solo ${f0(k)} llaves, y cada llave abre uno de ellos. ¿Cuántas pruebas hacen falta, como mínimo, para saber con certeza qué abre cada llave?`,
            datos: D, dibujo: { datos: { escena: 'llaves', llaves: k, candados: n, filas: [] }, estado: {} }, opciones: opcionesNum(bien, PRU, d, 5),
            solucion: { texto: `Cada llave falla en todos los que quedan menos uno: ${rango(1, k).map(i => f0(n - i)).join(', ')}.`, ecuacion: [`${rango(1, k).map(i => f0(n - i)).join(' + ')} = `, F(f0(bien))],
              dibujo: { datos: { escena: 'llaves', llaves: k, candados: n, filas: peorLlaves(k, n).filas }, estado: {} } } };
        }
        if (tipo === 2) {
          let n, m; do { n = r.ent(7, 10); m = r.ent(2, 4); } while (usado('llaves', kLl(n, n, m)));
          const q = n - m, bien = suma(rango(1, q - 1));
          const d = [{ id: 'suerte', valor: q, error: 'RM6', siFuera: 'Una prueba por cada llave que falta es contar con que todas abran al primer intento.' },
            { id: 'restar', valor: suma(rango(1, n - 1)), error: 'RMP92', siFuera: `Contaste las ${f0(n)} llaves; las de ${f0(m)} candados ya se saben y no se prueban.` },
            { id: 'ultima', valor: suma(rango(1, q)), error: 'RMP34', siFuera: 'Probaste también el último candado de cada llave, que se sabe sin probar.' },
            { id: 'todas', valor: q * q, error: 'RMP154', siFuera: `${f0(q * q)} es probar todas con todas, también los candados ya abiertos.` }];
          return { pregunta: `Hay ${f0(n)} candados y ${f0(n)} llaves mezcladas. Ya se sabe qué llave abre ${f0(m)} de los candados. ¿Cuántas pruebas más hacen falta, como mínimo, para saber con certeza las demás?`,
            datos: D, dibujo: { datos: { escena: 'llaves', llaves: n, filas: [] }, estado: {} }, opciones: opcionesNum(bien, PRU, d, 5),
            solucion: { texto: `Quedan ${f0(q)} llaves y ${f0(q)} candados: ${sumaBaja(q)}.`, ecuacion: [`${rango(1, q - 1).reverse().map(f0).join(' + ')} = `, F(f0(bien))] } };
        }
        let n; do { n = tipo === 3 ? r.ent(9, 15) : r.ent(5, 11); } while (usado('llaves', kLl(n, n, 0)));
        const { bien, d } = distLlaves(n), cosa = tipo === 3 ? 'puertas de aulas' : 'casilleros con candado';
        return { pregunta: `Hay ${f0(n)} ${cosa} y ${f0(n)} llaves mezcladas; cada llave abre ${tipo === 3 ? 'una sola puerta' : 'un solo candado'}. ¿Cuántas pruebas hacen falta, como mínimo, para saber con certeza qué abre cada llave?`,
          datos: tipo === 3 ? ['Cada llave abre una sola puerta.', 'Una prueba: meter una llave en una cerradura.'] : D,
          // Con más de 12 llaves la cuadrícula no cabe a 390 px: va sin dibujo.
          dibujo: n <= 12 ? { datos: { escena: 'llaves', llaves: n, filas: [] }, estado: {} } : undefined, opciones: opcionesNum(bien, PRU, d, 5),
          solucion: Object.assign({ texto: `La primera falla ${f0(n - 1)} veces, la segunda ${f0(n - 2)}… y la última no se prueba.`, ecuacion: [`${n > 9 ? `${f0(n - 1)} + ${f0(n - 2)} + … + 1` : rango(1, n - 1).reverse().map(f0).join(' + ')} = `, F(f0(bien))] },
            n <= 12 ? { dibujo: { datos: { escena: 'llaves', llaves: n, filas: peorLlaves(n).filas }, estado: {} } } : {}) };
      },
    },
  };

  // ---------- Ejemplos de «Llaves y candados» ----------
  // Resueltos aparte (e7-rm/ejemplos.py; el peor caso de las llaves, por búsqueda sobre todos los repartos posibles para
  // n ≤ 5, y la suma para los demás): 1 → 3 · 2 → 4 · 3 → 1 · 4 → 10 · 5 → ninguna · 6 → 21 · 7 → 9 · 8 → 15 · 9 → 15 ·
  // 10 → 4 · 11 → 36 (A) · 12 → 66 (B) · 13 → 18 (C) · 14 → 28 (D) · 15 → una caja (E). El 14 rehecho en el cierre (19 nov):
  // antes daba la misma cuenta que el 8 (15 pruebas).
  const figLl = (n, nc) => ({ pieza: CR, datos: Object.assign({ escena: 'llaves', llaves: n, filas: [] }, nc ? { candados: nc } : {}), estado: {} });
  const D_LL = ['Cada llave abre un solo candado.', 'Una prueba: meter una llave en un candado.'];
  function ejLlaves(o) {
    const n = o.n, k = o.k || n, ya = o.ya || 0, q = n - ya, nc = o.k ? n : q;
    const pr = o.k ? rango(1, k).map(i => n - i) : rango(1, q).map(i => q - i), bien = suma(pr);
    const sol = [{ texto: o.k ? `Cada llave falla en todos los candados que quedan menos uno: ${pr.map(f0).join(', ')}.` : ya ? `Quedan ${f0(q)} llaves y ${f0(q)} candados por saber: la primera de esas llaves falla, como mucho, en ${pl(q - 1, ['candado', 'candados'])}.` : `La primera llave falla en ${pl(n - 1, ['candado', 'candados'])}; el último se sabe sin probar.` },
      q === 2 && !o.k ? { texto: 'A la segunda llave le queda un solo candado: no se prueba. Basta la prueba de la primera.', ecuacion: ['1 + 0 = ', F(f0(bien))] }
        : { texto: o.k ? 'Se suman las pruebas de cada llave.' : 'Cada llave siguiente, una prueba menos; la última no se prueba.', ecuacion: [`${pr.filter(x => x > 0).length > 8 ? `${f0(pr[0])} + ${f0(pr[1])} + ${f0(pr[2])} + … + ${f0(pr.filter(x => x > 0).slice(-1)[0])}` : pr.filter(x => x > 0).map(f0).join(' + ')} = `, F(f0(bien))] }];
    const enun = o.enunciado || (o.k ? `Hay ${f0(n)} casilleros con candado, pero solo ${f0(k)} llaves, y cada llave abre uno de ellos. ¿Cuántas pruebas hacen falta, como mínimo, para saber con certeza qué abre cada llave?`
      : ya ? `Hay ${f0(n)} candados y ${f0(n)} llaves mezcladas. Ya se sabe qué llave abre ${f0(ya)} de los candados. ¿Cuántas pruebas más hacen falta, como mínimo, para saber las demás?`
        : `En el gimnasio hay ${f0(n)} casilleros con candado y sus ${f0(n)} llaves, mezcladas. ¿Cuántas pruebas hacen falta, como mínimo, para saber con certeza qué llave abre cada candado?`);
    return ejCierra(Object.assign({ datos: D_LL, _caso: o.k ? kLl(n, k, 0) : kLl(n, n, ya) }, o), bien, sol, enun, figLl(o.k ? k : n, o.k ? n : null), PRU);
  }
  const EJEMPLOS_LL = [
    ejLlaves({ nivel: 1, titulo: 'Tres llaves', n: 3 }),
    (() => {
      const n = 5;
      return { nivel: 1, titulo: 'Solo la primera llave', enunciado: `Hay ${f0(n)} candados y ${f0(n)} llaves mezcladas. ¿Cuántas pruebas hacen falta, como mínimo, para saber con certeza qué candado abre la primera llave?`,
        datos: D_LL, figura: figLl(n),
        solucion: [{ texto: `Con la peor suerte falla en 4 candados. El quinto ya se sabe: es el que queda.`, ecuacion: [`${f0(n)} − 1 = `, F(f0(n - 1))] }],
        respuesta: [F(pl(n - 1, PRU))] };
    })(),
    ejLlaves({ nivel: 1, titulo: 'Dos llaves', n: 2 }),
    ejLlaves({ nivel: 1, titulo: 'Cinco casilleros', n: 5 }),
    {
      nivel: 1, titulo: 'La última llave', enunciado: 'Hay 6 candados y 6 llaves. Ya se sabe qué llave abre 5 de los candados. ¿Cuántas pruebas hacen falta para la última llave?',
      datos: D_LL, figura: figLl(6),
      solucion: [{ texto: 'Queda una llave y un solo candado: tiene que ser ese. Se sabe sin probar.' }],
      respuesta: [F('Ninguna: se deduce')],
    },
    ejLlaves({ nivel: 2, titulo: 'Siete casilleros', n: 7 }),
    ejLlaves({ nivel: 2, titulo: 'Más candados que llaves', n: 5, k: 3 }),
    ejLlaves({ nivel: 2, titulo: 'Ya se saben dos', n: 8, ya: 2 }),
    ejLlaves({ nivel: 2, titulo: 'Las puertas del pasillo', n: 6, datos: ['Cada llave abre una sola puerta.', 'Una prueba: meter una llave en una cerradura.'],
      enunciado: 'En el pasillo hay 6 puertas de aulas y 6 llaves mezcladas. ¿Cuántas pruebas hacen falta, como mínimo, para saber con certeza qué puerta abre cada llave?' }),
    (() => {
      const n = 5;
      return { nivel: 2, titulo: 'Abrir un candado dado', enunciado: `Hay ${f0(n)} candados y ${f0(n)} llaves mezcladas. ¿Cuántas pruebas hacen falta, como mínimo, para abrir con certeza el candado 1, solo ese?`,
        datos: D_LL, figura: figLl(n),
        solucion: [{ texto: 'Ahora se prueban llaves en el candado 1. Con la peor suerte fallan 4.' },
          { texto: 'La quinta llave tiene que abrirlo, pero hay que meterla para abrirlo: una prueba más.', ecuacion: ['4 + 1 = ', F('5')] }],
        respuesta: [F(pl(n, PRU))] };
    })(),
    ejLlaves({ nivel: 3, titulo: 'Llaves y puertas', n: 9, datos: ['Cada llave abre una sola puerta.', 'Una prueba: meter una llave en una cerradura.'],
      enunciado: 'Un portero tiene 9 llaves mezcladas para las 9 puertas de un pasillo. ¿Cuántas pruebas hacen falta, como mínimo, para saber con certeza qué llave abre cada puerta?',
      alts: [{ v: 36, ok: true }, { v: 45 }, { v: 81 }, { v: 9 }, { v: 8 }],
      explica: '45 prueba la última de cada llave; 81 es 9 × 9, todas con todas; 9 es una prueba por llave, con suerte; 8 son las de la primera llave.' }),
    ejLlaves({ nivel: 3, titulo: 'Doce casilleros', n: 12,
      alts: [{ v: 78 }, { v: 66, ok: true }, { v: 144 }, { v: 12 }, { v: 11 }],
      explica: '78 prueba la última de cada llave; 144 es 12 × 12, todas con todas; 12 es una prueba por llave, con suerte; 11 son las de la primera llave.' }),
    ejLlaves({ nivel: 3, titulo: 'Siete candados, cuatro llaves', n: 7, k: 4,
      alts: [{ v: 4 }, { v: 22 }, { v: 18, ok: true }, { v: 28 }, { v: 6 }],
      explica: '4 es con buena suerte; 22 prueba también el último que queda; 28 es cada llave en los 7; 6 cuenta como si hubiera 4 candados.' }),
    ejLlaves({ nivel: 3, titulo: 'Ya se saben cuatro', n: 12, ya: 4,
      alts: [{ v: 66 }, { v: 36 }, { v: 64 }, { v: 28, ok: true }, { v: 8 }],
      explica: '66 cuenta también las 4 llaves sabidas; 36 prueba la última de cada llave; 64 es 8 × 8, todas con todas; 8 es una prueba por llave, con suerte.' }),
    {
      nivel: 3, titulo: 'Cajas mal rotuladas', enunciado: 'Tres cajas tienen los rótulos «fresa», «limón» y «mezcla», y los tres están mal puestos. ¿De cuántas cajas hay que sacar un caramelo, como mínimo, para rotular bien las tres?',
      alternativas: ['De ninguna', 'De dos cajas', 'De las tres cajas', 'No se puede saber', 'De una caja'],
      datos: ['Una caja tiene solo fresa, otra solo limón y otra, de los dos.', 'Ningún rótulo dice lo que tiene su caja.'],
      solucion: [{ texto: 'La caja «mezcla» no tiene mezcla: tiene solo fresa o solo limón. Un caramelo de ella lo dice.' },
        { texto: 'Si sale fresa, la caja «limón» no tiene limón ni fresa: tiene la mezcla, y la caja «fresa», limón. Se deduce.' },
        { texto: '«De ninguna» no alcanza: quedan dos repartos posibles. «De dos cajas» y «De las tres cajas» sobran. «No se puede saber» falla: con una basta.' }],
      respuesta: [F('De una caja'), ': la rotulada «mezcla»'],
    },
  ];
  ident.ejemplos = EJEMPLOS_LL;
  juntar('llaves', EJEMPLOS_LL, [kLl(N6, N6, 0), kLl(N_P6, N_P6, 0)]);

  // ---------- Glosario ----------
  const GLOSARIO = [
    // Idea 1
    { termino: 'extracción', def: 'Sacar objetos de un recipiente uno tras otro, sin ver cuál sale.', simple: 'Sacar sin mirar.',
      formas: ['extracción', 'extracciones'], ejemplos: [
        'Sacar bolitas de la tómbola con los ojos cerrados.',
        'Sacar canicas de una lata sin mirar dentro.',
        'Cada extracción deja una bolita menos en la tómbola.'], ver: ['sin devolver'] },
    { termino: 'sin devolver', def: 'Lo que se saca no vuelve al recipiente: cada vez quedan menos para sacar.', simple: 'Lo que sale ya no vuelve.',
      ejemplos: [
        'De 9 bolitas, tras sacar 2 sin devolver, quedan 7.',
        'Si salió la única blanca, ya no puede volver a salir.',
        'Sin devolver, nunca salen más bolitas de un color de las que hay.'], ver: ['extracción'] },
    { termino: 'peor caso', def: 'La forma más desfavorable en que pueden salir las cosas: lo que no sirve sale primero.', simple: 'Cuando la suerte juega totalmente en contra.',
      formas: ['peor caso', 'peores casos', 'peor suerte', 'mala suerte'], ejemplos: [
        'Para una blanca entre 5 rojas y 4 blancas, primero salen las 5 rojas.',
        'Si la meta se cumple en el peor caso, se cumple siempre.',
        'El peor caso no es lo más probable: es lo más desfavorable.'], ver: ['extracción'] },
  ];
  GLOSARIO.push(
    // Idea 2
    { termino: 'casillero', def: 'Cada lugar donde cae un objeto que se reparte: un mes, un color, un día de la semana.', simple: 'Cada cajita donde cae algo.',
      formas: ['casillero', 'casilleros'], ejemplos: [
        'Para los cumpleaños por mes hay 12 casilleros.',
        'En una tómbola de dos colores, cada color es un casillero.',
        'Los días de la semana son 7 casilleros.'], ver: ['principio del palomar'] },
    { termino: 'principio del palomar', def: 'Si hay más objetos que casilleros, algún casillero recibe por lo menos dos.', simple: 'Si no alcanzan los lugares, alguien comparte.',
      ejemplos: [
        '8 personas y 7 días de la semana: dos nacieron el mismo día.',
        '13 alumnos y 12 meses: dos cumplen años el mismo mes.',
        'Con 3 colores, 4 bolitas ya repiten un color.'], ver: ['casillero'] },
  );
  GLOSARIO.push(
    // Idea 3
    { termino: 'una de cada', def: 'Por lo menos un objeto de cada clase: de cada color, o de cada mano.', simple: 'Que no falte ninguna clase.',
      formas: ['una de cada', 'uno de cada'], ejemplos: [
        'Una de cada color: una roja, una verde y una negra, como mínimo.',
        'Con dos rojas y una verde ya hay una de cada entre esos dos colores.',
        'Si falta un color, todavía no hay una de cada.'] },
    { termino: 'par usable', def: 'Un guante izquierdo y uno derecho del mismo color: se pueden poner juntos.', simple: 'Un izquierdo y un derecho que combinan.',
      formas: ['par usable', 'par que se pueda usar', 'par que se puede usar'], ejemplos: [
        'Un izquierdo negro y un derecho negro son un par usable.',
        'Dos izquierdos negros no son un par usable.',
        'Un izquierdo negro y un derecho blanco tampoco lo son.'] },
  );
  GLOSARIO.push(
    // Idea 4
    { termino: 'bolilla', def: 'Bolita numerada del bingo o de un sorteo; cada número está en una sola.', simple: 'La bolita del bingo, con su número.',
      formas: ['bolilla', 'bolillas'], ejemplos: [
        'En un bingo del 1 al 30 hay 30 bolillas.',
        'La bolilla 7 sale una sola vez: no se devuelve.',
        'Las bolillas se sacan del bombo sin mirar.'] },
    { termino: 'número primo', def: 'Número mayor que 1 que solo se divide entre 1 y entre sí mismo.', simple: 'Un número que no sale de multiplicar otros dos menores.',
      formas: ['número primo', 'números primos'], ejemplos: [
        '7 es primo: solo lo dividen 1 y 7.',
        '9 no es primo: 3 × 3 = 9.',
        'El 1 no es primo, y el 2 es el único primo par.'] },
  );
  GLOSARIO.push(
    // Idea 5
    { termino: 'pareja', def: 'Dos números distintos que juntos cumplen la meta, por ejemplo que sumen lo pedido.', simple: 'Dos que juntos dan lo que se busca.',
      formas: ['pareja', 'parejas'], ejemplos: [
        'Para sumar 9, el 4 y el 5 son una pareja.',
        'Con cartas del 1 al 5, para sumar 7 hay dos parejas: 2 y 5, 3 y 4.',
        'De una pareja, una sola carta todavía no cumple la meta.'], ver: ['sin pareja'] },
    { termino: 'sin pareja', def: 'Número que no tiene con quién cumplir la meta entre los que hay.', simple: 'El que se queda solo.',
      ejemplos: [
        'Del 1 al 5, para sumar 9, el 1, el 2 y el 3 quedan sin pareja.',
        'Para sumar 8, el 4 necesitaría otro 4: si hay uno solo, queda sin pareja.',
        'Las que no tienen pareja también pueden salir sin cumplir.'], ver: ['pareja'] },
  );
  GLOSARIO.push(
    // Idea 6
    { termino: 'identificar', def: 'Saber con certeza qué objeto corresponde a cada otro, por ejemplo qué llave abre cada candado.', simple: 'Saber qué va con qué.',
      formas: ['identificar', 'identifica', 'identificación', 'identificadas'], ejemplos: [
        'Identificar 3 llaves es saber qué candado abre cada una.',
        'Rotular bien tres cajas también es identificar.',
        'Si una llave queda sola con un candado, ya está identificada.'], ver: ['deducir'] },
    { termino: 'deducir', def: 'Sacar una conclusión segura de lo que ya se sabe, sin tener que probarla.', simple: 'Saberlo sin probarlo, por lo que ya sabes.',
      formas: ['deducir', 'deduce', 'deducen', 'deducirla'], ejemplos: [
        'Si una llave falló en 2 de 3 candados, se deduce que abre el tercero.',
        'Si una caja no puede tener lo que dice su rótulo, se deduce qué tiene.',
        'Lo que se deduce no gasta pruebas.'], ver: ['identificar'] },
  );

  // ---------- Laboratorio ----------
  // Mesa 1 (ideas 1 y 3): la tómbola que arma el alumno, con tres metas; la figura muestra el peor caso de esa meta.
  const METAS_LAB = [
    { valor: 'rojas2', texto: '2 rojas', logra: v => v[0] >= 2, posible: u => u[0] >= 2 },
    { valor: 'igual3', texto: '3 del mismo color', logra: v => Math.max(...v) >= 3, posible: u => Math.max(...u) >= 3 },
    { valor: 'cada', texto: 'Una de cada color', logra: v => Math.min(...v) >= 1, posible: () => true },
  ];
  function labUrna(val) {
    const urna = [['R', val.R], ['V', val.V], ['N', val.N]], m = METAS_LAB.find(x => x.valor === val.meta), topes = urna.map(x => x[1]);
    if (!m.posible(topes)) return { urna, m, imposible: true };
    const p = peorCuentas(topes, m.logra), seq = [];
    urna.forEach(([c], i) => { for (let k = 0; k < p.v[i]; k++) seq.push([c, 'peor']); });
    // La que obliga: cualquier bolita que quede cumple la meta; se muestra una de un color que todavía queda.
    const queda = urna.findIndex(([, n], i) => n > p.v[i] && m.logra(p.v.map((x, j) => x + (j === i ? 1 : 0))));
    if (queda >= 0) seq.push([urna[queda][0], 'obliga']);
    return { urna, m, p, seq };
  }
  const mesaUrna = {
    id: 'urna-libre', titulo: 'Arma tu tómbola', pieza: CR,
    consigna: 'Elige cuántas bolitas hay de cada color y la meta. La figura saca el peor caso: todo lo que puede salir sin cumplir.',
    controles: [
      { id: 'meta', etiqueta: 'Meta', opciones: METAS_LAB.map(x => ({ valor: x.valor, texto: x.texto })) },
      { id: 'R', etiqueta: 'Rojas', min: 1, max: 6, paso: 1, inicio: 4, decimales: 0 },
      { id: 'V', etiqueta: 'Verdes', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 },
      { id: 'N', etiqueta: 'Negras', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
    ],
    dibujo: val => { const L = labUrna(val); return { datos: tombola(L.urna, L.imposible ? null : L.seq, { meta: `Meta: ${L.m.texto.toLowerCase()}`, reserva: totalU(L.urna) }), estado: {} }; },
    lectura: val => { const L = labUrna(val); return L.imposible ? ['Con estas bolitas la meta no se puede cumplir'] : [`${pl(L.p.max, BOL)} sin cumplir; con ${f0(L.p.max + 1)} es seguro`]; },
    invitaciones: [
      { texto: 'Arma una tómbola donde hagan falta 10 bolitas para tener 2 rojas con certeza.', logrado: val => val.meta === 'rojas2' && !labUrna(val).imposible && labUrna(val).p.max + 1 === 10,
        bien: 'Las que no son rojas suman 8: salen todas, una roja, y la décima obliga.' },
      { texto: 'Con la meta «una de cada color», haz que el peor caso deje fuera las negras.', logrado: val => val.meta === 'cada' && val.N < val.R && val.N < val.V,
        bien: 'La peor suerte agota los colores que más hay; el más escaso llega al final.' },
      { texto: 'Con «3 del mismo color», pon solo 1 negra y mira cuántas salen sin cumplir.', logrado: val => val.meta === 'igual3' && val.N === 1 && val.R >= 3,
        bien: 'Sale la única negra: un color escaso aporta todo lo que tiene.' },
    ],
  };
  // Mesa 2 (idea 2): casilleros y meta a elección; el calendario se llena parejo hasta la que obliga.
  function labPalomar(val) {
    const c = val.c, k = val.k, peorN = (k - 1) * c;
    const casilleros = rango(1, c).map(i => ({ t: `Caja ${i}`, n: k - 1 + (i === 1 ? 1 : 0), papeles: Array.from({ length: k }, (_, j) => (i === 1 && j === k - 1 ? 'obliga' : 'peor')) }));
    return { peorN, datos: { escena: 'casilleros', tituloCal: 'Casilleros', columnas: Math.min(4, c), meta: `Meta: ${f0(k)} en un mismo casillero`, casilleros } };
  }
  const mesaPalomar = {
    id: 'palomar-libre', titulo: 'Casilleros a elección', pieza: CR,
    consigna: 'Elige cuántos casilleros hay y cuántos iguales pide la meta. La figura llena cada casillero parejo, como la peor suerte.',
    controles: [
      { id: 'c', etiqueta: 'Casilleros', min: 2, max: 8, paso: 1, inicio: 3, decimales: 0 },
      { id: 'k', etiqueta: 'Iguales que pide la meta', min: 2, max: 4, paso: 1, inicio: 2, decimales: 0 },
    ],
    dibujo: val => ({ datos: labPalomar(val).datos, estado: {} }),
    lectura: val => [`${f0(labPalomar(val).peorN)} sin cumplir; con ${f0(labPalomar(val).peorN + 1)} es seguro`],
    invitaciones: [
      { texto: 'Busca casilleros y meta donde hagan falta 13 objetos para estar seguro.', logrado: val => labPalomar(val).peorN + 1 === 13,
        bien: 'Por ejemplo, 4 casilleros y meta 4: 3 en cada uno son 12; el 13 obliga.' },
      { texto: 'Con meta 2, haz que hagan falta 9 objetos.', logrado: val => val.k === 2 && val.c === 8,
        bien: 'Con meta 2 basta uno más que los casilleros: el principio del palomar.' },
      { texto: 'Duplica los casilleros y mira cuánto cambia lo que hace falta.', logrado: (val, g) => g.some(x => x.k === val.k && x.c * 2 === val.c),
        bien: 'El peor caso se duplica; la que obliga sigue siendo una sola.' },
    ],
  };
  // Mesa 3 (idea 6): más llaves; la cuadrícula del peor caso.
  const mesaLlaves = {
    id: 'llaves-libre', titulo: 'Más llaves', pieza: CR,
    consigna: 'Cambia cuántas llaves y candados hay. La cuadrícula muestra el peor caso: cada llave falla en todos menos el último.',
    controles: [{ id: 'n', etiqueta: 'Llaves y candados', min: 2, max: 7, paso: 1, inicio: 3, decimales: 0 }],
    dibujo: val => { const L = peorLlaves(val.n); return { datos: { escena: 'llaves', llaves: val.n, filas: L.filas, totales: val.n <= 5 ? L.pruebas.map(t => pl(t, PRU)) : undefined }, estado: {} }; },
    lectura: val => [`Peor caso: ${sumaBaja(val.n)} = ${f0(suma(peorLlaves(val.n).pruebas))} pruebas`],
    invitaciones: [
      { texto: 'Busca cuántas llaves hacen falta para que el peor caso pase de 20 pruebas.', logrado: val => suma(peorLlaves(val.n).pruebas) > 20 && suma(peorLlaves(val.n - 1).pruebas) <= 20,
        bien: 'Con 7 llaves: 6 + 5 + 4 + 3 + 2 + 1 = 21.' },
      { texto: 'Pasa de 4 a 5 llaves y mira cuántas pruebas se agregan.', logrado: (val, g) => val.n === 5 && g.some(x => x.n === 4),
        bien: 'Se agregan 4: la nueva primera llave falla en 4 candados.' },
    ],
  };
  const laboratorio = [mesaUrna, mesaPalomar, mesaLlaves];
  const laboratorioIdeas = { 'urna-libre': ['peor-caso', 'una-de-cada'], 'palomar-libre': ['palomar'], 'llaves-libre': ['llaves'] };
  const IDEAS = [peor, palo, unaDeCada, condicion, parejas, ident];

  return {
    unidad: 'razonamiento-matematico.certezas',
    version: '0.3.1',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-certeza.js'],
    letras: {},
    // Glosario (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso, de 2 a 4 por idea con su `simple`.
    // «Certeza» y «seguro» se estrenan en Razonamiento deductivo.
    glosario: GLOSARIO,
    laboratorio,
    laboratorioIdeas,
    historia: {
      texto: 'El principio del palomar se asocia con Dirichlet: si hay más objetos que casillas, alguna casilla recibe al menos dos. Sirve para demostrar una certeza sin conocer el reparto concreto. Garantizar algo no es lo mismo que esperar que pase: hay que vencer incluso a la peor suerte.',
      pregunta: '¿Qué es estar seguro aunque la suerte juegue en contra?',
      fuente: { titulo: 'The Pigeonhole Principle · University of Lethbridge', url: 'https://opentext.uleth.ca/Ramsey/sec_Pigeon.html' },
    },
    ideas: IDEAS,
  };
});
