/*
 * Teoría de «Funciones orgánicas» (quimica.funciones-organicas). Molde: docs/teoria.md y
 * contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 17), su historia y las precisiones de Química
 * («el nombre no sale solo de la cadena más larga»). Errores: docs/investigacion/quimica-materia-nomenclatura-
 * organica-ideas-erroneas.md (FO1–FO4, HC3) y atomo-enlace (EN15). Los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: reconocer un grupo funcional por todos sus átomos y vecinos, y nombrar un compuesto con un solo grupo.
 *   Persona y condiciones: postulante de 4.º–5.º, celular de 360 px, sin audio; ya lee fórmulas semidesarrolladas.
 *   Resultado observable: clasifica alcohol, fenol, éter, aldehído, cetona, ácido, éster, amina, amida y nitrilo;
 *     reconoce isómeros de función y da el nombre IUPAC de un alcohol con el menor localizador.
 *   Orden de atención: 1.º el grupo resaltado · 2.º sus vecinos · acción: cambiar la molécula · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿todo lo que tiene O es alcohol?, ¿todo NH₂ es amina?, ¿cuál es la cadena principal?
 *
 * Colores (regla 4): grupo funcional (resalto) turquesa c-i, oxígeno rojo c-h, nitrógeno naranja c-o, número
 * localizador verde c-d. Datos (no van al alumno): ebullición del etanol 78 °C y del metoximetano −24 °C (CRC
 * Handbook); nombres según IUPAC 2013 (P-44.1: la cadena principal lleva el grupo principal antes que el largo;
 * 2-etilbutan-1-ol), comprobados a mano. La amida casi no es básica (OpenStax Organic Chemistry §24.3).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    r.mezcla = l => { const x = l.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
    return r;
  }
  const ang = (g, r = 1) => [r * Math.cos(g * Math.PI / 180), r * Math.sin(g * Math.PI / 180)];

  // ---------- Estructuras ----------
  // fila: rótulos en línea (y = 0, cada 1,25); arriba/abajo: { índice: [rótulo, orden] } a 1,1 de su carbono;
  // enl: órdenes de los enlaces de la fila (por defecto 1). O en rojo y N en naranja; `grupo` son los índices del
  // grupo funcional (claves 'f3', 'a1', 'b2'…), para resaltarlo.
  const colorDe = t => (/^(O|OH|HO)$/.test(t) ? 'h' : /N/.test(t) ? 'o' : null);
  function est({ fila, arriba = {}, abajo = {}, enl = [], dx = 1.25 }) {
    const n = fila.map((t, i) => ({ id: `f${i}`, t, x: i * dx, y: 0, color: colorDe(t) }));
    const e = fila.slice(1).map((_, i) => ({ a: `f${i}`, b: `f${i + 1}`, orden: enl[i] || 1, color: enl[i] > 1 ? colorDe(fila[i + 1]) || colorDe(fila[i]) : null }));
    for (const [lado, dy, pre] of [[arriba, -1.15, 'a'], [abajo, 1.15, 'b']]) for (const [k, [t, orden]] of Object.entries(lado)) {
      n.push({ id: `${pre}${k}`, t, x: k * dx, y: dy, color: colorDe(t) });
      e.push({ a: `f${k}`, b: `${pre}${k}`, orden: orden || 1, color: orden > 1 ? colorDe(t) : null });
    }
    return { n, e };
  }
  // Anillo de seis (hexágono) con dobles alternados si `aromatico`; `sust` = { vértice: rótulo } hacia afuera.
  function anillo6(aromatico, sust = {}, h = 'CH') {
    const n = [], e = [], R = 1.2;
    for (let i = 0; i < 6; i++) {
      const [x, y] = ang(-90 + 60 * i, R);
      n.push({ id: `r${i}`, t: sust[i] ? 'C' : (aromatico ? 'CH' : h), x, y, color: null });
      e.push({ a: `r${i}`, b: `r${(i + 1) % 6}`, orden: aromatico && i % 2 === 0 ? 2 : 1, color: null });
    }
    if (!aromatico) for (const i of Object.keys(sust)) n[i].t = 'CH';
    for (const [i, t] of Object.entries(sust)) {
      const [x, y] = ang(-90 + 60 * i, R + 1.15);
      const partes = Array.isArray(t) ? t : [t];
      n.push({ id: `s${i}`, t: partes[0], x, y, color: colorDe(partes[0]) });
      e.push({ a: `r${i}`, b: `s${i}`, orden: 1 });
      if (partes[1]) { n.push({ id: `t${i}`, t: partes[1], x: x + 1.15, y, color: colorDe(partes[1]) }); e.push({ a: `s${i}`, b: `t${i}`, orden: 1 }); }
    }
    return { n, e };
  }
  function figura(lista, extra = {}) {
    const atomos = [], enlaces = [];
    lista.forEach(([m, dx, dy, pref, props]) => {
      for (const a of m.n) atomos.push(Object.assign({}, a, { id: pref + a.id, x: a.x + dx, y: a.y + dy }, props || {}, a.color ? {} : { color: undefined }));
      for (const b of m.e) enlaces.push(Object.assign({}, b, { a: pref + b.a, b: pref + b.b }, props || {}));
    });
    atomos.forEach(a => { if (!a.color) delete a.color; });
    enlaces.forEach(b => { if (!b.color) delete b.color; });
    return { datos: Object.assign({ atomos, enlaces, escala: 42, alto: 190 }, extra), estado: {} };
  }
  const una = (m, grupo, texto, extra = {}) => figura([[m, 0, 0, '']], Object.assign({ resaltos: grupo ? [{ atomos: grupo, color: 'i', texto }] : [] }, extra));

  const MOL = {
    etanol: { m: est({ fila: ['CH₃', 'CH₂', 'OH'] }), g: ['f1', 'f2'], f: 'C₂H₆O', fam: 'alcohol', nombre: 'etanol' },
    metanol: { m: est({ fila: ['CH₃', 'OH'] }), g: ['f0', 'f1'], f: 'CH₄O', fam: 'alcohol', nombre: 'metanol' },
    'propan-1-ol': { m: est({ fila: ['CH₃', 'CH₂', 'CH₂', 'OH'] }), g: ['f2', 'f3'], fam: 'alcohol', nombre: 'propan-1-ol' },
    'propan-2-ol': { m: est({ fila: ['CH₃', 'CH', 'CH₃'], abajo: { 1: ['OH'] } }), g: ['f1', 'b1'], fam: 'alcohol', nombre: 'propan-2-ol' },
    metoximetano: { m: est({ fila: ['CH₃', 'O', 'CH₃'] }), g: ['f0', 'f1', 'f2'], f: 'C₂H₆O', fam: 'eter', nombre: 'metoximetano' },
    metoxietano: { m: est({ fila: ['CH₃', 'O', 'CH₂', 'CH₃'] }), g: ['f0', 'f1', 'f2'], fam: 'eter', nombre: 'metoxietano' },
    etoxietano: { m: est({ fila: ['CH₃', 'CH₂', 'O', 'CH₂', 'CH₃'] }), g: ['f1', 'f2', 'f3'], fam: 'eter', nombre: 'etoxietano' },
    fenol: { m: anillo6(true, { 3: 'OH' }), g: ['r3', 's3'], fam: 'fenol', nombre: 'fenol' },
    '4-metilfenol': { m: anillo6(true, { 3: 'OH', 0: 'CH₃' }), g: ['r3', 's3'], fam: 'fenol', nombre: '4-metilfenol' },
    ciclohexanol: { m: anillo6(false, { 3: 'OH' }, 'CH₂'), g: ['r3', 's3'], fam: 'alcohol', nombre: 'ciclohexanol' },
    metoxibenceno: { m: anillo6(true, { 3: ['O', 'CH₃'] }), g: ['r3', 's3', 't3'], fam: 'eter', nombre: 'metoxibenceno' },
    metanal: { m: est({ fila: ['H', 'CH'], arriba: { 1: ['O', 2] } }), g: ['f1', 'a1'], fam: 'aldehido', nombre: 'metanal' },
    etanal: { m: est({ fila: ['CH₃', 'CH'], arriba: { 1: ['O', 2] } }), g: ['f1', 'a1'], fam: 'aldehido', nombre: 'etanal' },
    propanal: { m: est({ fila: ['CH₃', 'CH₂', 'CH'], arriba: { 2: ['O', 2] } }), g: ['f2', 'a2'], f: 'C₃H₆O', fam: 'aldehido', nombre: 'propanal' },
    butanal: { m: est({ fila: ['CH₃', 'CH₂', 'CH₂', 'CH'], arriba: { 3: ['O', 2] } }), g: ['f3', 'a3'], f: 'C₄H₈O', fam: 'aldehido', nombre: 'butanal' },
    propanona: { m: est({ fila: ['CH₃', 'C', 'CH₃'], arriba: { 1: ['O', 2] } }), g: ['f1', 'a1'], f: 'C₃H₆O', fam: 'cetona', nombre: 'propanona' },
    butanona: { m: est({ fila: ['CH₃', 'C', 'CH₂', 'CH₃'], arriba: { 1: ['O', 2] } }), g: ['f1', 'a1'], f: 'C₄H₈O', fam: 'cetona', nombre: 'butanona' },
    'pentan-3-ona': { m: est({ fila: ['CH₃', 'CH₂', 'C', 'CH₂', 'CH₃'], arriba: { 2: ['O', 2] } }), g: ['f2', 'a2'], fam: 'cetona', nombre: 'pentan-3-ona' },
    'pentan-2-ona': { m: est({ fila: ['CH₃', 'C', 'CH₂', 'CH₂', 'CH₃'], arriba: { 1: ['O', 2] } }), g: ['f1', 'a1'], fam: 'cetona', nombre: 'pentan-2-ona' },
    'acido-etanoico': { m: est({ fila: ['CH₃', 'C', 'OH'], arriba: { 1: ['O', 2] } }), g: ['f1', 'a1', 'f2'], f: 'C₂H₄O₂', fam: 'acido', nombre: 'ácido etanoico' },
    'acido-propanoico': { m: est({ fila: ['CH₃', 'CH₂', 'C', 'OH'], arriba: { 2: ['O', 2] } }), g: ['f2', 'a2', 'f3'], f: 'C₃H₆O₂', fam: 'acido', nombre: 'ácido propanoico' },
    'metanoato-de-metilo': { m: est({ fila: ['H', 'C', 'O', 'CH₃'], arriba: { 1: ['O', 2] } }), g: ['f1', 'a1', 'f2'], f: 'C₂H₄O₂', fam: 'ester', nombre: 'metanoato de metilo' },
    'etanoato-de-metilo': { m: est({ fila: ['CH₃', 'C', 'O', 'CH₃'], arriba: { 1: ['O', 2] } }), g: ['f1', 'a1', 'f2'], f: 'C₃H₆O₂', fam: 'ester', nombre: 'etanoato de metilo' },
    metilamina: { m: est({ fila: ['CH₃', 'NH₂'] }), g: ['f0', 'f1'], fam: 'amina', nombre: 'metanamina' },
    etilamina: { m: est({ fila: ['CH₃', 'CH₂', 'NH₂'] }), g: ['f1', 'f2'], fam: 'amina', nombre: 'etanamina' },
    dimetilamina: { m: est({ fila: ['CH₃', 'NH', 'CH₃'] }), g: ['f0', 'f1', 'f2'], fam: 'amina', nombre: 'N-metilmetanamina' },
    etanamida: { m: est({ fila: ['CH₃', 'C', 'NH₂'], arriba: { 1: ['O', 2] } }), g: ['f1', 'a1', 'f2'], fam: 'amida', nombre: 'etanamida' },
    propanamida: { m: est({ fila: ['CH₃', 'CH₂', 'C', 'NH₂'], arriba: { 2: ['O', 2] } }), g: ['f2', 'a2', 'f3'], fam: 'amida', nombre: 'propanamida' },
    'n-metiletanamida': { m: est({ fila: ['CH₃', 'C', 'NH', 'CH₃'], arriba: { 1: ['O', 2] } }), g: ['f1', 'a1', 'f2'], fam: 'amida', nombre: 'N-metiletanamida' },
    etanonitrilo: { m: est({ fila: ['CH₃', 'C', 'N'], enl: [1, 3] }), g: ['f1', 'f2'], fam: 'nitrilo', nombre: 'etanonitrilo' },
    propanonitrilo: { m: est({ fila: ['CH₃', 'CH₂', 'C', 'N'], enl: [1, 1, 3] }), g: ['f2', 'f3'], fam: 'nitrilo', nombre: 'propanonitrilo' },
  };
  const NOMBRE_FAM = { alcohol: 'Alcohol', fenol: 'Fenol', eter: 'Éter', aldehido: 'Aldehído', cetona: 'Cetona', acido: 'Ácido carboxílico', ester: 'Éster', amina: 'Amina', amida: 'Amida', nitrilo: 'Nitrilo' };
  const vista = (k, extra) => una(MOL[k].m, MOL[k].g, NOMBRE_FAM[MOL[k].fam].toLowerCase(), extra);
  // Caso de «Ahora tú»: una molécula dibujada y las familias del grupo como opciones.
  function clasificar(s, lista, familias, si, porque, errores) {
    const r = azar(s), k = lista[s % lista.length], m = MOL[k];
    const ops = r.mezcla(familias.map(fam => (fam === m.fam ? { id: 'c', texto: NOMBRE_FAM[fam], correcta: true } : { id: fam, texto: NOMBRE_FAM[fam], error: errores[m.fam] || 'QM-GRUPO', siFuera: si[fam] })));
    return {
      pregunta: `¿A qué familia pertenece el ${m.nombre}?`,
      dibujo: una(m.m, null),
      opciones: ops,
      solucion: { texto: porque[m.fam], ecuacion: [NOMBRE_FAM[m.fam]] },
    };
  }

  // ---------- Idea 1: el OH y el O se leen con sus vecinos ----------
  // Cambia: dónde está el oxígeno · Permanece: el resalto del grupo y la escala · Progresa: OH en cadena, OH en anillo
  // aromático, O entre carbonos · Se reserva: el ciclohexanol (OH en anillo que no es aromático) · Debe verse: a qué
  // está unido el oxígeno.
  const GRUPO_O = { etanol: 'OH en un carbono de cadena: alcohol.', metoximetano: 'O entre dos carbonos: éter.', fenol: 'OH en un anillo aromático: fenol.' };
  const oxigeno = {
    id: 'alcohol-fenol-eter',
    titulo: 'El oxígeno y sus vecinos',
    temas: ['Grupos funcionales', 'Alcoholes, fenoles y éteres'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Las tres moléculas tienen oxígeno. Elige una y mira a qué átomos está unido el O: eso decide la familia.',
      voz: 'No basta ver un O: revisa sus dos vecinos.',
      controles: [{ id: 'k', etiqueta: 'Molécula', opciones: Object.keys(GRUPO_O).map(k => ({ valor: k, texto: MOL[k].nombre })) }],
      dibujo: val => vista(val.k),
      lectura: val => [GRUPO_O[val.k]],
      minimo: 3,
    },
    predice: {
      pregunta: 'El ciclohexanol tiene un OH unido a un anillo de seis carbonos, como el fenol. Pero su anillo solo tiene enlaces simples. ¿A qué familia pertenece?',
      voz: 'Fíjate en el anillo, no solo en el OH.',
      opciones: [
        { id: 'c', texto: 'Alcohol: su anillo no es aromático', correcta: true },
        { id: 'fenol', texto: 'Fenol: tiene OH en un anillo', error: 'QM-FENOL', siFuera: 'Sería fenol si el anillo fuera aromático, con dobles alternados. Este solo tiene simples.' },
        { id: 'eter', texto: 'Éter: el O está junto a un anillo', error: 'FO4', siFuera: 'Sería éter si el O estuviera entre dos carbonos. Aquí el O lleva un H.' },
      ],
      dibujo: una(MOL.ciclohexanol.m, null),
      revelar: vista('ciclohexanol'),
      coincide: 'Coincide: OH en un carbono con solo simples.',
      noCoincide: 'El anillo del ciclohexanol no es aromático: es un alcohol.',
    },
    mira: {
      datos: figura([[MOL.etanol.m, 0, 0, 'a', { desde: 1 }], [MOL.metoximetano.m, 0, 2.1, 'b', { desde: 3 }], [MOL.fenol.m, 4.7, 0.6, 'c', { desde: 2 }]], {
        escala: 38, alto: 270,
        resaltos: [{ atomos: ['af1', 'af2'], color: 'i', texto: 'alcohol', desde: 1 }, { atomos: ['cr3', 'cs3'], color: 'i', texto: 'fenol', desde: 2 }, { atomos: ['bf0', 'bf1', 'bf2'], color: 'i', texto: 'éter', desde: 3 }],
      }).datos,
      voz: 'Revisemos los vecinos del oxígeno en cada una.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Etanol: el OH va en un carbono con solo enlaces simples.', ecuacion: ['R–OH: alcohol'] },
        { estado: { corte: 2 }, texto: 'Fenol: el OH va en un carbono de un anillo aromático.', ecuacion: ['Ar–OH: fenol'] },
        { estado: { corte: 3 }, texto: 'Metoximetano: el O está entre dos carbonos y no tiene H.', ecuacion: ['R–O–R′: éter'] },
        { estado: { corte: 3 }, texto: 'Un grupo funcional es un patrón completo: átomos y uniones.' },
      ],
    },
    regla: {
      texto: 'Un grupo funcional es un patrón de átomos y uniones. Alcohol: OH en un carbono de solo simples. Fenol: OH en un anillo aromático. Éter: O entre dos carbonos.',
      ecuacion: ['R–OH · Ar–OH · R–O–R′'],
      condicion: 'se mira todo el entorno del oxígeno, no solo que esté. R es una cadena de carbonos; Ar, un anillo aromático.',
      voz: 'Primero el O, después sus dos vecinos.',
    },
    ahoraTu: {
      voz: 'Busca el O y revisa sus vecinos.',
      generar(s) {
        return clasificar(s, ['metanol', 'propan-2-ol', 'metoxietano', '4-metilfenol', 'ciclohexanol', 'metoxibenceno', 'propan-1-ol', 'etoxietano', 'fenol'], ['alcohol', 'fenol', 'eter'], {
          alcohol: 'Sería alcohol si el OH estuviera en un carbono con solo simples.',
          fenol: 'Sería fenol si el OH estuviera en un anillo aromático.',
          eter: 'Sería éter si el O estuviera entre dos carbonos, sin H.',
        }, {
          alcohol: 'El OH está en un carbono con solo enlaces simples.', fenol: 'El OH está unido a un anillo aromático.', eter: 'El O está entre dos carbonos y no lleva H.',
        }, { alcohol: 'QM-FENOL', fenol: 'QM-FENOL', eter: 'QM-O-ALCOHOL' });
      },
    },
  };

  // ---------- Idea 2: el carbonilo: aldehído o cetona ----------
  // Cambia: dónde está el C=O · Permanece: la cadena de carbonos · Progresa: del extremo (con H) al medio (con dos C)
  // · Se reserva: el C=O en medio de una cadena larga · Debe verse: qué tiene el carbono del C=O además del O.
  const CARB = { propanal: 'C=O en el extremo, con un H: aldehído (-al).', propanona: 'C=O en medio, entre dos carbonos: cetona (-ona).', butanal: 'C=O en el extremo de cuatro carbonos: aldehído.', butanona: 'C=O en el carbono 2: cetona.' };
  const carbonilo = {
    id: 'aldehido-cetona',
    titulo: 'El C=O: extremo o medio',
    temas: ['Aldehídos y cetonas'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Mueve el grupo C=O por la cadena. Mira qué más tiene unido el carbono del C=O: un H o dos carbonos.',
      voz: 'Mira los vecinos del carbono del C=O.',
      controles: [{ id: 'k', etiqueta: 'Molécula', opciones: Object.keys(CARB).map(k => ({ valor: k, texto: MOL[k].nombre })) }],
      dibujo: val => vista(val.k),
      lectura: val => [CARB[val.k]],
      minimo: 3,
    },
    predice: {
      pregunta: 'En una cadena de cinco carbonos, el C=O está en el carbono 3, justo en el medio. ¿Qué es?',
      voz: 'Cuenta los vecinos del carbono del C=O.',
      opciones: [
        { id: 'c', texto: 'Una cetona: tiene dos carbonos vecinos', correcta: true },
        { id: 'aldehido', texto: 'Un aldehído: tiene un C=O', error: 'QM-CARBONILO', siFuera: 'Sería aldehído si el carbono del C=O tuviera un H. En el medio tiene dos carbonos.' },
        { id: 'alcohol', texto: 'Un alcohol: tiene oxígeno', error: 'QM-O-ALCOHOL', siFuera: 'Sería alcohol si el O llevara un H en enlace simple. Aquí es un doble C=O.' },
      ],
      dibujo: una(MOL['pentan-3-ona'].m, null, null, { escala: 38 }),
      revelar: vista('pentan-3-ona', { escala: 38 }),
      coincide: 'Coincide: pentan-3-ona, una cetona.',
      noCoincide: 'Con dos carbonos vecinos, el C=O es de cetona: pentan-3-ona.',
    },
    mira: {
      datos: figura([[MOL.propanal.m, 0, 0, 'a', { desde: 1 }], [MOL.propanona.m, 0.6, 3.0, 'b', { desde: 2 }]], {
        escala: 40, alto: 260,
        resaltos: [{ atomos: ['af2', 'aa2'], color: 'i', texto: 'aldehído', desde: 1 }, { atomos: ['bf1', 'ba1'], color: 'i', texto: 'cetona', desde: 2 }],
      }).datos,
      voz: 'Comparemos el carbono del C=O en las dos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Propanal: el C=O está en el extremo y su carbono lleva un H.', ecuacion: ['R–CHO: aldehído, -al'] },
        { estado: { corte: 2 }, texto: 'Propanona: el C=O está en medio, con dos carbonos vecinos.', ecuacion: ['R–CO–R′: cetona, -ona'] },
        { estado: { corte: 2 }, texto: 'Los dos son C₃H₆O: mismo inventario, otra familia.', ecuacion: ['C₃H₆O'] },
      ],
    },
    regla: {
      texto: 'El carbonilo C=O es de aldehído si su carbono tiene un H (va en el extremo, -al) y de cetona si tiene dos carbonos vecinos (en medio, -ona).',
      ecuacion: ['R–CHO (-al)   ·   R–CO–R′ (-ona)'],
      condicion: 'el C=O no debe tener un O o un N unidos al mismo carbono: eso ya sería ácido, éster o amida.',
      voz: 'Cuenta qué rodea al carbono del C=O.',
    },
    ahoraTu: {
      voz: 'Mira los vecinos del carbono del C=O.',
      generar(s) {
        return clasificar(s, ['etanal', 'propanona', 'butanal', 'butanona', 'pentan-2-ona', 'metanal', 'pentan-3-ona', 'propanal'], ['aldehido', 'cetona', 'alcohol'], {
          aldehido: 'Sería aldehído si el carbono del C=O llevara un H.',
          cetona: 'Sería cetona si el carbono del C=O tuviera dos carbonos vecinos.',
          alcohol: 'Sería alcohol si hubiera un OH con enlace simple, no un C=O.',
        }, { aldehido: 'El carbono del C=O lleva un H: aldehído.', cetona: 'El carbono del C=O está entre dos carbonos: cetona.' }, { aldehido: 'QM-CARBONILO', cetona: 'QM-CARBONILO' });
      },
    },
  };

  // ---------- Idea 3: ácido, éster y el agua que sale ----------
  // Cambia: qué hay junto al C=O · Permanece: el C=O · Progresa: C=O con OH (ácido), C=O con O–C (éster), y la unión
  // de ácido y alcohol · Se reserva: el agua que sale (esta unión sí la suelta) · Debe verse: de dónde salen los
  // átomos del agua.
  const ACID = { 'acido-etanoico': 'C=O con un OH en el mismo carbono: ácido carboxílico.', 'etanoato-de-metilo': 'C=O con un O que va a otro carbono: éster.', propanona: 'C=O sin O vecino: cetona, para comparar.' };
  function esterificacion(conProductos) {
    const ac = est({ fila: ['CH₃', 'C', 'OH'], arriba: { 1: ['O', 2] } }), al = est({ fila: ['HO', 'CH₂', 'CH₃'] });
    const es = est({ fila: ['CH₃', 'C', 'O', 'CH₂', 'CH₃'], arriba: { 1: ['O', 2] } }), ag = est({ fila: ['H₂O'] });
    const lista = [[ac, 0, 0, 'a'], [al, 3.7, 0, 'b']];
    if (conProductos) lista.push([es, 0, 3.4, 'c'], [ag, 6.5, 3.4, 'd']);
    const extra = { escala: 34, alto: 270, textos: [{ x: 3.1, y: -0.55, t: '+', peso: 700 }], flechas: [{ de: [3.1, 1.3], a: [3.1, 2.3] }], resaltos: [{ atomos: ['af2', 'bf0'], color: 'h', texto: 'OH + H' }] };
    if (conProductos) extra.textos.push({ x: 5.75, y: 3.4, t: '+', peso: 700 });
    return figura(lista, extra);
  }
  const acidos = {
    id: 'acido-ester',
    titulo: 'Ácido, éster y el agua',
    temas: ['Ácidos carboxílicos y ésteres'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Compara qué está unido al carbono del C=O: un OH, un O que sigue a otro carbono, o solo carbonos.',
      voz: 'El vecino del C=O decide la familia.',
      controles: [{ id: 'k', etiqueta: 'Molécula', opciones: Object.keys(ACID).map(k => ({ valor: k, texto: MOL[k].nombre })) }],
      dibujo: val => vista(val.k),
      lectura: val => [ACID[val.k]],
      minimo: 3,
    },
    predice: {
      pregunta: 'El ácido etanoico y el etanol se unen y forman un éster, el etanoato de etilo. ¿Sale alguna otra molécula?',
      voz: 'Haz el inventario de átomos antes y después.',
      opciones: [
        { id: 'c', texto: 'Sí: sale una molécula de agua', correcta: true },
        { id: 'nada', texto: 'No: todo queda en el éster', error: 'QM-ESTER-AGUA', siFuera: 'Así pasa en una adición. Aquí el OH del ácido y un H del alcohol salen como agua.' },
        { id: 'h2', texto: 'Sí: sale hidrógeno, H₂', error: 'QM-ESTER-AGUA', siFuera: 'Saldría H₂ si se juntaran dos H solos. El H se va con el OH del ácido.' },
      ],
      dibujo: esterificacion(false),
      revelar: esterificacion(true),
      coincide: 'Coincide: esta unión suelta agua. No toda unión lo hace.',
      noCoincide: 'El OH del ácido y el H del alcohol forman agua.',
    },
    mira: {
      datos: (() => {
        const d = esterificacion(true).datos;
        d.atomos.forEach(a => { a.desde = a.id.startsWith('c') || a.id.startsWith('d') ? 3 : 1; });
        d.enlaces.forEach(e => { e.desde = e.a.startsWith('c') || e.a.startsWith('d') ? 3 : 1; });
        d.textos.forEach((t, i) => { t.desde = i ? 3 : 1; });
        d.flechas.forEach(fl => { fl.desde = 3; });
        d.resaltos.forEach(r => { r.desde = 2; });
        return d;
      })(),
      voz: 'Sigamos los átomos que forman el agua.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Un ácido carboxílico y un alcohol.', ecuacion: ['CH₃COOH + CH₃CH₂OH'] },
        { estado: { corte: 2 }, texto: 'El OH del ácido y el H del OH del alcohol se juntan.', ecuacion: ['OH + H → H₂O'] },
        { estado: { corte: 3 }, texto: 'Queda el éster unido por el O, y sale agua.', ecuacion: ['⇌ CH₃COOCH₂CH₃ + H₂O'] },
        { estado: { corte: 3 }, texto: 'Nombre: el ácido da «etanoato» y el alcohol, «de etilo».', ecuacion: ['etanoato de etilo'] },
      ],
    },
    regla: {
      texto: 'Ácido carboxílico: C=O con un OH en el mismo carbono (-oico). Éster: C=O con un O que sigue a otro carbono (-ato de -ilo). Ácido + alcohol → éster + agua.',
      ecuacion: ['CH₃COOH + CH₃CH₂OH ⇌ CH₃COOCH₂CH₃ + H₂O'],
      condicion: 'es un equilibrio con catalizador ácido y no llega al 100 %. Esta unión suelta agua; una adición, no.',
      voz: 'Al nombrar el éster, el ácido va primero.',
    },
    ahoraTu: {
      voz: 'El ácido da la primera palabra; el alcohol, la segunda.',
      generar(s) {
        const ACIDOS = [['metanoico', 'metanoato'], ['etanoico', 'etanoato'], ['propanoico', 'propanoato'], ['butanoico', 'butanoato']];
        const ALCS = [['metanol', 'metilo'], ['etanol', 'etilo'], ['propan-1-ol', 'propilo']];
        const r = azar(s), [ac, sal] = ACIDOS[s % 4], [alc, ilo] = ALCS[Math.floor(s / 4) % 3];
        const raiz = x => x.replace(/(anoato|anoico)$/, '').replace(/ilo$/, '');
        const alAcido = { metilo: 'metanoato', etilo: 'etanoato', propilo: 'propanoato' }[ilo], alAlc = { metanoato: 'metilo', etanoato: 'etilo', propanoato: 'propilo', butanoato: 'butilo' }[sal];
        const ops = [{ id: 'c', texto: `${sal} de ${ilo}`, correcta: true }];
        const malos = [
          { id: 'cruzado', texto: `${alAcido} de ${alAlc}`, error: 'QM-ESTER-NOMBRE', siFuera: 'Ese nombre cambia los papeles: la parte «-ato» viene del ácido, no del alcohol.' },
          { id: 'ol', texto: `${sal} de ${alc}`, error: 'QM-ESTER-NOMBRE', siFuera: 'El alcohol pierde su H y entra como grupo: se nombra con «-ilo».' },
          { id: 'ico', texto: `ácido ${ac}`, error: 'QM-ESTER-NOMBRE', siFuera: 'Ese es el ácido de partida. El éster ya perdió el OH del ácido.' },
        ];
        for (const m of malos) if (!ops.some(o => o.texto === m.texto)) ops.push(m);
        void raiz;
        return {
          pregunta: `El ácido ${ac} reacciona con el ${alc} y forma un éster y agua. ¿Cómo se llama el éster?`,
          opciones: r.mezcla(ops),
          solucion: { texto: `El ácido ${ac} da «${sal}»; el ${alc} da «de ${ilo}».`, ecuacion: [`${sal} de ${ilo}`] },
        };
      },
    },
  };

  // ---------- Idea 4: amina, amida y nitrilo ----------
  // Cambia: lo que rodea al nitrógeno · Permanece: el N resaltado · Progresa: N con carbonos de cadena, N junto a un
  // C=O, N con triple enlace · Se reserva: la amida, que tiene NH₂ y no es amina · Debe verse: si el C vecino del N
  // tiene un C=O.
  const NIT = { metilamina: 'N unido a un carbono de cadena: amina.', etanamida: 'N unido al carbono de un C=O: amida.', etanonitrilo: 'N con triple enlace al carbono: nitrilo.' };
  const nitrogeno = {
    id: 'amina-amida-nitrilo',
    titulo: 'El nitrógeno y su carbono',
    temas: ['Aminas, amidas y nitrilos'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Las tres tienen nitrógeno. Mira a qué carbono está unido el N y con qué enlace.',
      voz: 'Revisa el carbono vecino del N.',
      controles: [{ id: 'k', etiqueta: 'Molécula', opciones: Object.keys(NIT).map(k => ({ valor: k, texto: MOL[k].nombre })) }],
      dibujo: val => vista(val.k),
      lectura: val => [NIT[val.k]],
      minimo: 3,
    },
    predice: {
      pregunta: 'La propanamida termina en NH₂, igual que la etanamina. ¿La propanamida es una amina?',
      voz: 'Mira qué tiene el carbono vecino del NH₂.',
      opciones: [
        { id: 'c', texto: 'No: su N está junto a un C=O; es amida', correcta: true },
        { id: 'amina', texto: 'Sí: tiene NH₂', error: 'QM-N-AMINA', siFuera: 'Sería amina si el carbono vecino del N no tuviera un C=O.' },
        { id: 'nitrilo', texto: 'No: es un nitrilo', error: 'QM-N-AMINA', siFuera: 'Sería nitrilo si el N tuviera triple enlace con el carbono.' },
      ],
      dibujo: una(MOL.propanamida.m, null),
      revelar: vista('propanamida'),
      coincide: 'Coincide: el C=O junto al N la hace amida.',
      noCoincide: 'El carbono vecino del NH₂ tiene un C=O: es una amida.',
    },
    mira: {
      datos: figura([[MOL.etilamina.m, 0, 0, 'a', { desde: 1 }], [MOL.propanamida.m, -0.6, 2.9, 'b', { desde: 2 }]], {
        escala: 40, alto: 260,
        resaltos: [{ atomos: ['af1', 'af2'], color: 'i', texto: 'amina', desde: 1 }, { atomos: ['bf2', 'ba2', 'bf3'], color: 'i', texto: 'amida', desde: 2 }],
      }).datos,
      voz: 'Comparemos el carbono vecino del N.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Etanamina: el N va unido a un carbono de cadena.', ecuacion: ['R–NH₂: amina'] },
        { estado: { corte: 2 }, texto: 'Propanamida: el N va unido al carbono de un C=O.', ecuacion: ['R–CO–NH₂: amida'] },
        { estado: { corte: 2 }, texto: 'El C=O jala los electrones del N: la amida casi no es básica.' },
      ],
    },
    regla: {
      texto: 'Amina: N unido a carbonos de cadena (o a H). Amida: N unido al carbono de un C=O. Nitrilo: N con triple enlace al carbono final.',
      ecuacion: ['R–NH₂ · R–CO–NH₂ · R–C≡N'],
      condicion: 'se mira el carbono vecino del N. Una amida y una amina con NH₂ no se comportan igual.',
      voz: 'NH₂ no basta: mira el carbono de al lado.',
    },
    ahoraTu: {
      voz: 'Encuentra el N y revisa su carbono vecino.',
      generar(s) {
        return clasificar(s, ['metilamina', 'etanamida', 'etanonitrilo', 'dimetilamina', 'propanamida', 'propanonitrilo', 'n-metiletanamida', 'etilamina'], ['amina', 'amida', 'nitrilo'], {
          amina: 'Sería amina si el N estuviera unido solo a carbonos de cadena o a H.',
          amida: 'Sería amida si el carbono vecino del N tuviera un C=O.',
          nitrilo: 'Sería nitrilo si el N tuviera triple enlace con el carbono.',
        }, { amina: 'El N está unido a carbonos de cadena, sin C=O al lado.', amida: 'El N está unido al carbono de un C=O.', nitrilo: 'El N tiene triple enlace con el carbono: C≡N.' }, { amina: 'QM-N-AMINA', amida: 'QM-N-AMINA', nitrilo: 'QM-N-AMINA' });
      },
    },
  };

  // ---------- Idea 5: isómeros de función ----------
  // Cambia: el par de moléculas · Permanece: la fórmula molecular del par · Progresa: de contar átomos a comparar
  // propiedades · Se reserva: los puentes de hidrógeno del etanol · Debe verse: mismo inventario, grupo distinto.
  const PARES = {
    c2h6o: { a: 'etanol', b: 'metoximetano', f: 'C₂H₆O', lee: 'C₂H₆O: alcohol y éter. Isómeros de función.' },
    c3h6o: { a: 'propanal', b: 'propanona', f: 'C₃H₆O', lee: 'C₃H₆O: aldehído y cetona. Isómeros de función.' },
    c2h4o2: { a: 'acido-etanoico', b: 'metanoato-de-metilo', f: 'C₂H₄O₂', lee: 'C₂H₄O₂: ácido y éster. Isómeros de función.' },
  };
  const par = (k, extra = {}) => figura([[MOL[PARES[k].a].m, 0, 0, 'a'], [MOL[PARES[k].b].m, 0, 2.6, 'b']], Object.assign({
    escala: 40, alto: 250,
    resaltos: [{ atomos: MOL[PARES[k].a].g.map(x => 'a' + x), color: 'i', texto: NOMBRE_FAM[MOL[PARES[k].a].fam].toLowerCase() }, { atomos: MOL[PARES[k].b].g.map(x => 'b' + x), color: 'i', texto: NOMBRE_FAM[MOL[PARES[k].b].fam].toLowerCase() }],
  }, extra));
  function puentes(conPuentes) {
    const et = est({ fila: ['CH₃', 'CH₂', 'O'] }), et2 = est({ fila: ['CH₃', 'CH₂', 'O'] });
    et.n.push({ id: 'h', t: 'H', x: 2.5, y: 1.0 }); et.e.push({ a: 'f2', b: 'h', orden: 1 });
    et2.n.push({ id: 'h', t: 'H', x: 2.5, y: 1.0 }); et2.e.push({ a: 'f2', b: 'h', orden: 1 });
    const extra = { escala: 40, alto: 230 };
    const d = figura([[et, 0, 0, 'a'], [et2, 0, 2.2, 'b']], extra).datos;
    if (conPuentes) d.enlaces.push({ a: 'ah', b: 'bf2', discontinuo: true, color: 'i' });
    if (conPuentes) d.textos = [{ x: 4.4, y: 1.55, t: 'puente de H', color: 'i' }];
    return { datos: d, estado: {} };
  }
  const isomeria = {
    id: 'isomeria-funcion',
    titulo: 'Misma fórmula, otra familia',
    temas: ['Isomería de función'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Cada par tiene la misma fórmula molecular. Cuenta los átomos de las dos y compara su grupo funcional.',
      voz: 'Mismo inventario de átomos; mira dónde están.',
      controles: [{ id: 'k', etiqueta: 'Fórmula', opciones: Object.keys(PARES).map(k => ({ valor: k, texto: PARES[k].f })) }],
      dibujo: val => par(val.k),
      lectura: val => [PARES[val.k].lee],
      minimo: 3,
    },
    predice: {
      pregunta: 'El etanol hierve a 78 °C. El metoximetano tiene la misma fórmula, C₂H₆O. ¿Cómo es su punto de ebullición?',
      voz: 'Piensa en qué une a las moléculas entre sí.',
      opciones: [
        { id: 'c', texto: 'Mucho menor: −24 °C', correcta: true },
        { id: 'igual', texto: 'Igual: tiene los mismos átomos', error: 'FO1', siFuera: 'Sería igual si fueran la misma sustancia. El grupo distinto cambia cómo se atraen.' },
        { id: 'mayor', texto: 'Mayor: su O está en el centro', error: 'FO2', siFuera: 'Sería mayor si sus moléculas se unieran con más fuerza. Sin H en el O, no forman puentes.' },
      ],
      dibujo: par('c2h6o'),
      revelar: par('c2h6o', { textos: [{ x: 4.2, y: 0, t: '78 °C', color: 'h' }, { x: 4.2, y: 2.6, t: '−24 °C', color: 'h' }] }),
      coincide: 'Coincide: el éter hierve mucho antes.',
      noCoincide: 'El metoximetano hierve a −24 °C: sus moléculas no forman puentes de hidrógeno.',
    },
    mira: {
      datos: (() => { const d = puentes(true).datos; d.enlaces[d.enlaces.length - 1].desde = 2; d.textos[0].desde = 2; return d; })(),
      voz: 'Miremos dos moléculas de etanol juntas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En el etanol, el O lleva un H unido.', ecuacion: ['CH₃CH₂–O–H'] },
        { estado: { corte: 2 }, texto: 'Ese H se atrae con el O de la molécula vecina.', ecuacion: ['O–H ··· O'] },
        { estado: { corte: 2 }, texto: 'El éter no tiene H en su O: no forma esos puentes.', ecuacion: ['CH₃–O–CH₃'] },
        { estado: { corte: 2 }, texto: 'Por eso el etanol hierve a 78 °C y el éter, a −24 °C.' },
      ],
    },
    regla: {
      texto: 'Isómeros de función: misma fórmula molecular y distinto grupo funcional. Por eso tienen propiedades distintas, como la temperatura de ebullición.',
      ecuacion: ['C₂H₆O: etanol (78 °C) · metoximetano (−24 °C)'],
      condicion: 'la comparación vale si el resto de la estructura es parecido. El grupo funcional no decide solo todas las propiedades.',
      voz: 'Misma fórmula no es misma sustancia.',
    },
    ahoraTu: {
      voz: 'Busca la misma fórmula con otro grupo.',
      generar(s) {
        const CASOS = [
          ['etanol', 'C₂H₆O', 'metoximetano', 'metanol', 'etanal'],
          ['propanal', 'C₃H₆O', 'propanona', 'propan-1-ol', 'etanal'],
          ['ácido propanoico', 'C₃H₆O₂', 'etanoato de metilo', 'ácido etanoico', 'propanal'],
          ['propanona', 'C₃H₆O', 'propanal', 'butanona', 'propan-2-ol'],
          ['butanal', 'C₄H₈O', 'butanona', 'propanal', 'butan-1-ol'],
          ['ácido etanoico', 'C₂H₄O₂', 'metanoato de metilo', 'ácido propanoico', 'etanol'],
          ['propan-1-ol', 'C₃H₈O', 'metoxietano', 'propan-2-ol', 'propanal'],
        ];
        const r = azar(s), [mol, fm, bien, otro, mal] = CASOS[s % CASOS.length];
        const posicion = mol === 'propan-1-ol';
        return {
          pregunta: `¿Cuál es un isómero de función del ${mol} (${fm})?`,
          opciones: r.mezcla([
            { id: 'c', texto: `El ${bien}`, correcta: true },
            { id: 'otro', texto: `El ${otro}`, error: posicion ? 'QM-ISO-POSICION' : 'FO3', siFuera: posicion ? 'El propan-2-ol tiene la misma fórmula, pero el mismo grupo: es isómero de posición.' : 'Ese compuesto tiene otro número de átomos o el mismo grupo: no es isómero de función.' },
            { id: 'mal', texto: `El ${mal}`, error: 'FO3', siFuera: 'Ese compuesto tiene otra fórmula molecular. Un isómero necesita el mismo inventario de átomos.' },
          ]),
          solucion: { texto: `Tiene la misma fórmula, ${fm}, con otro grupo funcional.`, ecuacion: [`${mol} y ${bien}: ${fm}`] },
        };
      },
    },
  };

  // ---------- Idea 6: nombrar: cadena principal, menor número y sufijo ----------
  // Cambia: la posición del OH y desde dónde se numera · Permanece: la cadena de cinco carbonos · Progresa: de
  // numerar a elegir la cadena que lleva el grupo · Se reserva: la cadena más larga que no tiene el OH · Debe verse:
  // el número que le toca al carbono del OH.
  function pentanol(p, desde) {
    const m = est({ fila: ['CH₃', 'CH₂', 'CH₂', 'CH₂', 'CH₃'].map((t, i) => (i === 0 || i === 4 ? (i + 1 === p ? 'CH₂' : 'CH₃') : (i + 1 === p ? 'CH' : 'CH₂'))), abajo: { [p - 1]: ['OH'] } });
    const textos = [0, 1, 2, 3, 4].map(i => ({ x: i * 1.25, y: -0.95, t: String(desde === 'izq' ? i + 1 : 5 - i), color: 'd' }));
    return figura([[m, 0, 0, '']], { escala: 42, alto: 190, textos });
  }
  const sufijo = n => ['', 'met', 'et', 'prop', 'but', 'pent', 'hex', 'hept'][n] + 'an';
  function rama() {
    // 2-etilbutan-1-ol: HO–CH₂–CH(CH₂CH₃)–CH₂–CH₃
    return { n: [
      { id: 'o', t: 'HO', x: 0, y: 0 }, { id: 'c1', t: 'CH₂', x: 1.25, y: 0 }, { id: 'c2', t: 'CH', x: 2.5, y: 0 }, { id: 'c3', t: 'CH₂', x: 3.75, y: 0 }, { id: 'c4', t: 'CH₃', x: 5.0, y: 0 },
      { id: 'e1', t: 'CH₂', x: 2.5, y: -1.2 }, { id: 'e2', t: 'CH₃', x: 2.5, y: -2.4 },
    ].map(a => Object.assign(a, { color: a.t === 'HO' ? 'h' : null })), e: [['o', 'c1'], ['c1', 'c2'], ['c2', 'c3'], ['c3', 'c4'], ['c2', 'e1'], ['e1', 'e2']].map(([a, b]) => ({ a, b, orden: 1 })) };
  }
  const nombre = {
    id: 'nombrar-monofuncional',
    titulo: 'Cadena, número y sufijo',
    temas: ['Nomenclatura de compuestos monofuncionales'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Mueve el OH por la cadena y elige desde qué extremo numerar. El nombre lleva el número del carbono del OH.',
      voz: 'Prueba los dos extremos y compara el número del OH.',
      controles: [
        { id: 'p', etiqueta: 'OH en el carbono', min: 1, max: 5, paso: 1, inicio: 2, unidad: '', decimales: 0, color: 'c-d' },
        { id: 'd', etiqueta: 'Numerar desde', opciones: [{ valor: 'izq', texto: 'Izquierda' }, { valor: 'der', texto: 'Derecha' }] },
      ],
      dibujo: val => pentanol(val.p, val.d),
      lectura: val => { const n = val.d === 'izq' ? val.p : 6 - val.p, menor = Math.min(val.p, 6 - val.p); return ['El OH queda en el ', { v: 'c-d', t: String(n) }, ` · nombre: pentan-${menor}-ol`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'En HO–CH₂–CH(CH₂CH₃)–CH₂–CH₃, la cadena más larga tiene cinco carbonos pero no lleva el OH; otra de cuatro sí lo lleva. ¿Cuál es la cadena principal?',
      voz: 'Piensa qué tiene que contener la cadena principal.',
      opciones: [
        { id: 'c', texto: 'La de cuatro carbonos, que lleva el OH', correcta: true },
        { id: 'larga', texto: 'La de cinco, porque es la más larga', error: 'QM-CADENA-LARGA', siFuera: 'El largo decide entre cadenas que llevan el grupo. Primero, la cadena debe contener el OH.' },
        { id: 'igual', texto: 'Cualquiera de las dos', error: 'HC3', siFuera: 'Darían nombres distintos para la misma molécula. La regla elige la que lleva el OH.' },
      ],
      dibujo: figura([[rama(), 0, 0, '']], { escala: 40, alto: 210 }),
      revelar: figura([[rama(), 0, 0, '']], { escala: 40, alto: 210, resaltos: [{ atomos: ['o', 'c1', 'c2', 'c3', 'c4'], color: 'i', texto: '2-etilbutan-1-ol' }] }),
      coincide: 'Coincide: la cadena principal lleva el grupo funcional.',
      noCoincide: 'La cadena principal debe llevar el OH, aunque haya otra más larga.',
    },
    mira: {
      datos: figura([[rama(), 0, 0, '']], {
        escala: 40, alto: 230,
        resaltos: [{ atomos: ['o', 'c1', 'c2', 'c3', 'c4'], color: 'i', desde: 1 }, { atomos: ['e1', 'e2'], color: 'o', desde: 3 }],
        textos: [{ x: 1.25, y: 0.95, t: '1', color: 'd', desde: 2 }, { x: 2.5, y: 0.95, t: '2', color: 'd', desde: 2 }, { x: 3.75, y: 0.95, t: '3', color: 'd', desde: 2 }, { x: 5.0, y: 0.95, t: '4', color: 'd', desde: 2 }, { x: 3.6, y: -1.8, t: 'etil', color: 'o', desde: 3 }],
      }).datos,
      voz: 'Nombremos paso a paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cadena principal: la que lleva el OH, de cuatro carbonos.', ecuacion: ['butano → butanol'] },
        { estado: { corte: 2 }, texto: 'Se numera desde el extremo más cercano al OH: queda en 1.', ecuacion: ['butan-1-ol'] },
        { estado: { corte: 3 }, texto: 'La rama de dos carbonos (etil) cuelga del carbono 2.', ecuacion: ['2-etil'] },
        { estado: { corte: 3 }, texto: 'Se juntan rama, cadena y sufijo.', ecuacion: ['2-etilbutan-1-ol'] },
      ],
    },
    regla: {
      texto: 'Para nombrar: la cadena principal lleva el grupo; se numera para darle el menor número; las ramas van con su número; al final, el sufijo (-ol, -al, -ona, -oico).',
      ecuacion: ['número-rama + cadena + número-sufijo'],
      condicion: 'para un solo grupo funcional (IUPAC). Con varios grupos, dobles o empates hay reglas extra; la cadena más larga no basta.',
      voz: 'Primero el grupo, después el largo.',
    },
    ahoraTu: {
      voz: 'Numera desde el extremo más cercano al OH.',
      generar(s) {
        const r = azar(s), n = 3 + (s % 4), p = r.ent(1, n), menor = Math.min(p, n + 1 - p), otro = n + 1 - menor;
        const fila = Array.from({ length: n }, (_, i) => (i === 0 || i === n - 1 ? (i + 1 === p ? 'CH₂' : 'CH₃') : (i + 1 === p ? 'CH' : 'CH₂')));
        const m = est({ fila, abajo: { [p - 1]: ['OH'] } });
        const nom = k => `${sufijo(n)}-${k}-ol`;
        return {
          pregunta: '¿Cuál es el nombre IUPAC de este alcohol?',
          dibujo: figura([[m, 0, 0, '']], { escala: 42, alto: 180 }),
          opciones: r.mezcla([
            { id: 'c', texto: nom(menor), correcta: true },
            { id: 'otro', texto: nom(otro), error: 'QM-LOCANTE', siFuera: 'Ese número sale al contar desde el otro extremo. Se cuenta desde el más cercano al OH.' },
            { id: 'al', texto: `${sufijo(n)}al`, error: 'QM-SUFIJO', siFuera: '«-al» es para un aldehído, con C=O en el extremo. Aquí hay un OH: «-ol».' },
            { id: 'largo', texto: `${sufijo(n + 1)}-${menor}-ol`, error: 'QM-CONTEO', siFuera: `Ese nombre cuenta ${n + 1} carbonos. La cadena tiene ${n}.` },
          ].filter((o, i, l) => l.findIndex(x => x.texto === o.texto) === i)),
          solucion: { texto: `Cadena de ${n} carbonos; el OH queda en el ${menor} contando desde el extremo más cercano.`, ecuacion: [nom(menor)] },
        };
      },
    },
  };

  return {
    unidad: 'quimica.funciones-organicas',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-molecula.js'],
    historia: {
      texto: 'Para ordenar las sustancias orgánicas había que mirar más allá de la fórmula completa. En 1832, Liebig y Wöhler notaron que un grupo de átomos pasaba intacto de una sustancia a otra en varias reacciones. Esa búsqueda de partes que conservan su identidad llevó, con el tiempo, a la idea actual de grupo funcional: alcoholes, ácidos o amidas se comportan de forma parecida.',
      pregunta: '¿Qué parte de una molécula conviene mirar primero?',
      fuente: { titulo: 'OpenStax, Organic Chemistry, §3.1', url: 'https://openstax.org/books/organic-chemistry/pages/3-1-functional-groups' },
    },
    ideas: [oxigeno, carbonilo, acidos, nitrogeno, isomeria, nombre],
  };
});
