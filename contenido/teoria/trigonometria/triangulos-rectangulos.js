/*
 * Teoría de «Resolución de triángulos rectángulos» (trigonometria.triangulos-rectangulos), 3.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 4), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (pp. 85–86) y las «Precisiones de Geometría y Trigonometría» del expediente (37° y 53° son aproximaciones del
 * triángulo 3-4-5: cuando se usan, el enunciado lo dice). Forma: angulo-trigonometrico.js.
 * Compañera: Mara (coneja), cercana y rigurosa: primero se nombra el lado desde el ángulo, después se elige la razón.
 * Colores (regla 4), los mismos de razones-trigonometricas-agudas: los ángulos θ, α y β en naranja (c-o), el cateto
 * opuesto (CO; en los problemas, la altura h) en rojo (c-h), el adyacente (CA; la distancia horizontal d) en
 * turquesa (c-i) y la hipotenusa (H; la visual) en verde (c-d).
 * Errores: TR9 (elige mal la razón) es de docs/investigacion/trigonometria-ideas-erroneas.md. Hipótesis de
 * distractor (sin medir): RES-MULTIPLICA, RES-COMPLEMENTO, DEP-VERTICAL, ELEV-OJO (el error objetivo de la matriz: olvidar la altura del instrumento), OBS-CRECE, OBS-CONSTANTE, OBS-45,
 * OBS-SOLO-ARRIBA, OBS-SUMA, OBS-RESTA-ALTURAS.
 * Ronda 2 (14 nov, noche): manijas en las tres ideas (vértice B, pie y punta de la torre, pie del poste), con un
 * «marco» invisible que fija la escala de la pieza triangulo; llaves en las reglas, separadores entre relaciones y
 * laboratorio de tres mesas (instrumento con la altura del ojo, faro con depresión libre y letrero de cerca).
 * La idea 2 juega con elevación y «Mira» con depresión: ver su comentario (hallazgo 9 de docs/auditoria-teoria.md).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: con un ángulo agudo y un lado se resuelve el triángulo; elevación, depresión y observación se miden desde la horizontal.
 *   Persona y condiciones: postulante de 3.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: halla un lado con la razón correcta, distingue elevación de depresión y calcula un ángulo de observación.
 *   Orden de atención: 1.º el ángulo y la horizontal · 2.º el lado conocido · 3.º el que se busca · acción: mover ángulo o distancia.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿qué razón uso, desde dónde se mide la depresión y por qué acercarse no siempre agranda lo que se ve?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const th = { v: 'c-o', t: 'θ' }, al = { v: 'c-o', t: 'α' }, be = { v: 'c-o', t: 'β' };
  const CO = { v: 'c-h', t: 'CO' }, CA = { v: 'c-i', t: 'CA' }, H = { v: 'c-d', t: 'H' };
  const h = { v: 'c-h', t: 'h' }, d = { v: 'c-i', t: 'd' };
  const sub = (x, i) => ({ sub: [x, i] });
  const RAD = Math.PI / 180, GRA = 180 / Math.PI;
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      if (typeof x.valor === 'number' && !Number.isFinite(x.valor)) continue;
      const txt = fmt(x.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }

  // Triángulos notables: coeficientes de (opuesto, adyacente, hipotenusa) como n·√r. 37° y 53° son de convención.
  const NOT = {
    30: { op: [1, 1], ad: [1, 3], hip: [2, 1] }, 45: { op: [1, 1], ad: [1, 1], hip: [1, 2] }, 60: { op: [1, 3], ad: [1, 1], hip: [2, 1] },
    37: { op: [3, 1], ad: [4, 1], hip: [5, 1] }, 53: { op: [4, 1], ad: [3, 1], hip: [5, 1] },
  };
  const conv = g => (g === 37 || g === 53 ? ' (convención 3-4-5)' : '');
  const txt = (k, [nn, r]) => `${k * nn === 1 && r > 1 ? '' : k * nn}${r > 1 ? '√' + r : ''}`;
  const num = (k, [nn, r]) => k * nn * Math.sqrt(r);
  // Lado de un triángulo notable de ángulo g, escalado para que el lado `dado` sea un múltiplo k de su coeficiente.
  const ladoTxt = (g, k, rol) => txt(k, NOT[g][rol]);
  // Un número como texto exacto: entero, o n·√r con r = 2 o 3, o decimal si no es ninguno.
  function fmtNum(x) {
    for (const r of [1, 2, 3]) { const c = x / Math.sqrt(r); if (Math.abs(c - Math.round(c)) < 1e-9) return txt(Math.round(c), [1, r]); }
    for (const r of [1, 2, 3]) { const c = x / Math.sqrt(r) * 3; if (Math.abs(c - Math.round(c)) < 1e-9) return `${Math.round(c)}${r > 1 ? '√' + r : ''}/3`; }
    return f(x);
  }

  // Gesto directo (docs/teoria.md §4b). La pieza «triangulo» ajusta la escala a sus puntos; para que la manija siga
  // al dedo, los juegos agregan un «marco»: un punto que no se ve (paso 99) y fija la caja de la figura. La pieza no
  // trae inversa: se invierte aquí, con su X e Y, que son lineales.
  const TRI = () => Kit.piezas.triangulo;
  const enPx = (dd, x, y) => { const g = TRI().geometria(dd); return { x: g.X(x), y: g.Y(y) }; };
  const delPx = (dd, pt) => {
    const g = TRI().geometria(dd), x0 = g.X(0), y0 = g.Y(0);
    return { x: (pt.x - x0) / (g.X(1) - x0), y: (pt.y - y0) / (g.Y(1) - y0) };
  };
  const conMarco = (dd, x, y) => Object.assign({}, dd, { puntos: dd.puntos.concat([{ id: 'marco', x, y, paso: 99 }]) });

  // Triángulo rectángulo con θ en A y el recto en C (como en la unidad de razones).
  const tri = (co, ca, o = {}) => ({
    puntos: [{ id: 'A', x: 0, y: 0 }, { id: 'C', x: ca, y: 0 }, { id: 'B', x: ca, y: co }],
    lados: [
      { de: 'A', a: 'C', color: 'i', texto: o.ca === undefined ? f(ca) : o.ca, final: o.caF, grosor: 'variable', paso: o.pCa },
      { de: 'C', a: 'B', color: 'h', texto: o.co === undefined ? f(co) : o.co, final: o.coF, grosor: 'variable', paso: o.pCo },
      { de: 'A', a: 'B', color: 'd', texto: o.h === undefined ? f(Math.hypot(co, ca)) : o.h, final: o.hF, grosor: 'variable', lado: -1, paso: o.pH },
    ],
    angulos: [{ en: 'A', de: 'C', a: 'B', texto: o.ang === undefined ? 'θ' : o.ang, color: 'o' }, { en: 'C', de: 'A', a: 'B' }],
  });

  // ---------- Idea 1: un lado y un ángulo bastan ----------
  // Cambia: el ángulo θ y la hipotenusa. · Permanece: el ángulo recto y los nombres de los lados desde θ.
  // Progresa: los dos catetos que salen de H·sen θ y H·cos θ. · Se reserva: conocer un cateto y buscar la
  // hipotenusa, que obliga a dividir (la predicción). · Debe verse: la razón que une el lado dado con el buscado.
  const unJ = v => conMarco(tri(v.H * Math.sin(v.g * RAD), v.H * Math.cos(v.g * RAD), { ang: `${v.g}°`, h: `${v.H}` }), 10, 10);
  const unLado = {
    id: 'un-lado-un-angulo',
    titulo: 'Un lado y un ángulo bastan',
    temas: ['Resolver con un lado y un ángulo'],
    pieza: 'triangulo',
    juega: {
      consigna: 'Elige el ángulo θ y la hipotenusa H. La lectura calcula los dos catetos con el seno y el coseno.',
      voz: 'Desde θ, nombra cuál cateto es opuesto y cuál adyacente.',
      controles: [
        { id: 'g', etiqueta: 'θ', color: 'c-o', min: 10, max: 80, paso: 10, inicio: 30, unidad: '°', decimales: 0 },
        { id: 'H', etiqueta: 'H', color: 'c-d', min: 2, max: 10, paso: 2, inicio: 6, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: unJ(v), estado: {} }),
      lectura: v => [CO, ` = ${v.H} sen ${v.g}° ≈ ${f(v.H * Math.sin(v.g * RAD))} · `, CA, ` ≈ ${f(v.H * Math.cos(v.g * RAD))}`],
      minimo: 3,
      // Se arrastra el vértice B: su dirección desde A es θ y su distancia a A, la hipotenusa H.
      arrastres: [{ id: 'vertice-b', etiqueta: 'vértice B: θ y H', color: 'c-d',
        donde: v => enPx(unJ(v), v.H * Math.cos(v.g * RAD), v.H * Math.sin(v.g * RAD)),
        mover: (pt, v) => { const q = delPx(unJ(v), pt); return { g: Math.atan2(q.y, q.x) * GRA, H: Math.hypot(q.x, q.y) }; } }],
    },
    predice: {
      pregunta: 'En un triángulo rectángulo, el cateto adyacente a 60° mide 5. ¿Cuánto mide la hipotenusa?',
      voz: 'Ahora lo que conoces es un cateto, no la hipotenusa.',
      opciones: [
        { id: 'c', texto: '10', correcta: true },
        { id: 'multiplica', texto: '2,5', error: 'RES-MULTIPLICA', siFuera: 'cos 60° es la razón correcta; pero 5 es el cateto: la hipotenusa es 5 ÷ cos 60°.' },
        { id: 'tan', texto: `5√3 ≈ ${f(5 * Math.sqrt(3))}`, error: 'TR9', siFuera: '5·tan 60° es el otro cateto, el opuesto. Se pedía la hipotenusa.' },
        { id: 'sen', texto: `${f(5 * Math.sin(60 * RAD))}`, error: 'TR9', siFuera: 'Usar 60° está bien; el seno mira al opuesto, y el 5 es el adyacente.' },
      ],
      dibujo: { datos: tri(5 * Math.sqrt(3), 5, { ang: '60°', ca: '5', co: '', h: 'H = ?' }), estado: {} },
      revelar: { datos: tri(5 * Math.sqrt(3), 5, { ang: '60°', ca: '5', co: '5√3', h: 'H = 10' }), estado: {} },
      coincide: 'Coincide: el adyacente es la mitad de la hipotenusa, porque cos 60° = 1/2.',
      noCoincide: 'Revisemos: cos 60° = 1/2, así que el 5 es la mitad de H.',
    },
    mira: {
      pieza: 'triangulo',
      datos: tri(5 * Math.sqrt(3), 5, { ang: '60°', ca: '5', co: '?', coF: '5√3', h: 'H = ?', hF: 'H = 10', pCo: 3 }),
      voz: 'Lado que tienes, lado que buscas, y la razón que los une.',
      pasos: [
        { estado: { paso: 1 }, texto: 'Desde 60°, el 5 es el adyacente y buscamos la hipotenusa.', ecuacion: ['cos 60° = ', { frac: [CA, H] }, ' = ', { frac: ['5', H] }] },
        { estado: { paso: 2, final: true }, texto: 'Se despeja H: el 5 se divide entre la razón.', ecuacion: [H, ' = ', { frac: ['5', 'cos 60°'] }, ' = ', { frac: ['5', '1/2'] }, ' = 10'] },
        { estado: { paso: 3, final: true }, texto: 'El opuesto sale con la tangente, desde el mismo dato.', ecuacion: [CO, ' = ', CA, ' · tan 60° = 5√3'] },
      ],
    },
    regla: {
      texto: 'Con un ángulo agudo y un lado se halla cualquier otro: se elige la razón que une el lado conocido con el buscado y se despeja.',
      ecuacion: [{ llave: [CO], nota: 'opuesto a θ', color: 'c-h' }, ' = ', H, ' sen ', th, '   ·   ', { llave: [CA], nota: 'junto a θ', color: 'c-i' }, ' = ', H, ' cos ', th, '   ·   ', CO, ' = ', CA, ' tan ', th],
      condicion: 'θ agudo en un triángulo rectángulo y los lados nombrados desde θ. Si el dato es un cateto, a veces se divide.',
      voz: 'Escribe la razón con los dos lados; después despeja.',
    },
    ahoraTu: {
      pieza: 'triangulo',
      voz: 'Nombra desde el ángulo el lado que tienes y el que buscas.',
      generar(sem) {
        const rr = azar(sem), g = rr.uno([30, 45, 60, 37, 53]), k = rr.ent(2, 9);
        const roles = ['op', 'ad', 'hip'], nom = { op: `el cateto opuesto a ${g}°`, ad: `el cateto adyacente a ${g}°`, hip: 'la hipotenusa' };
        const dado = roles[sem % 3], pide = roles[(sem + 1 + (Math.floor(sem / 3) % 2)) % 3];
        const tercero = roles.find(x => x !== dado && x !== pide);
        const comp = { op: 'ad', ad: 'op', hip: 'hip' };
        const L = rol => num(k, NOT[g][rol]);
        return {
          pregunta: [`En un triángulo rectángulo, ${nom[dado]} mide ${ladoTxt(g, k, dado)}${conv(g)}. ¿Cuánto mide ${nom[pide]}?`],
          dibujo: { datos: tri(L('op'), L('ad'), { ang: `${g}°`, co: dado === 'op' ? ladoTxt(g, k, 'op') : pide === 'op' ? '?' : '', ca: dado === 'ad' ? ladoTxt(g, k, 'ad') : pide === 'ad' ? '?' : '', h: dado === 'hip' ? ladoTxt(g, k, 'hip') : pide === 'hip' ? '?' : '' }), estado: {} },
          opciones: opciones(ladoTxt(g, k, pide), [
            { id: 'tercero', valor: ladoTxt(g, k, tercero), error: 'TR9', siFuera: `Ese es ${nom[tercero]}: la razón une otros dos lados.` },
            { id: 'comp', valor: fmtNum(L(dado) / num(1, NOT[g][comp[dado]]) * num(1, NOT[g][comp[pide]])), error: 'RES-COMPLEMENTO', siFuera: `Eso nombra los lados desde ${90 - g}°, el otro agudo. Nómbralos desde ${g}°.` },
            { id: 'igual', valor: ladoTxt(g, k, dado), error: 'RES-MULTIPLICA', siFuera: 'El lado dado sirve de punto de partida; falta multiplicarlo o dividirlo por la razón.' },
          ], x => x),
          solucion: {
            texto: `Lados proporcionales al notable de ${g}°: ${['op', 'ad', 'hip'].map(rl => txt(1, NOT[g][rl])).join(', ')}.`,
            ecuacion: [`${nom[pide].replace(/^el |^la /, '')} = ${ladoTxt(g, k, pide)}`],
            dibujo: { datos: tri(L('op'), L('ad'), { ang: `${g}°`, co: ladoTxt(g, k, 'op'), ca: ladoTxt(g, k, 'ad'), h: ladoTxt(g, k, 'hip') }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: elevación y depresión ----------
  // Cambia: el ángulo de elevación θ y la distancia d al pie de la torre. · Permanece: el suelo y la horizontal.
  // Progresa: la altura h = d · tan θ. · Se reserva: mirar hacia abajo desde lo alto (la predicción).
  // Debe verse: que la depresión se mide desde la horizontal de arriba y vale lo mismo que la elevación de abajo.
  const torre = (dv, g, o = {}) => {
    const hv = dv * Math.tan(g * RAD);
    return {
      suelo: true,
      puntos: [{ id: 'O', x: 0, y: 0, rotulo: o.nO || 'ojo' }, { id: 'P', x: dv, y: 0 }, { id: 'T', x: dv, y: hv }],
      lados: [
        { de: 'O', a: 'P', color: 'i', texto: o.d || `d = ${f(dv)} m`, grosor: 'variable' },
        { de: 'P', a: 'T', color: 'h', texto: o.h === undefined ? `h ≈ ${f(hv, 1)} m` : o.h, grosor: 'variable' },
        { de: 'O', a: 'T', color: 'd', visual: true },
      ],
      angulos: [{ en: 'O', de: 'P', a: 'T', texto: `${g}°`, color: 'o' }, { en: 'P', de: 'O', a: 'T' }],
    };
  };
  // Faro de 30 m y lancha: depresión de 37° desde lo alto (convención 3-4-5: la lancha está a 40 m).
  const FARO = {
    suelo: true,
    puntos: [{ id: 'L', x: 0, y: 0, rotulo: 'lancha' }, { id: 'P', x: 40, y: 0 }, { id: 'F', x: 40, y: 30, rotulo: 'faro' }, { id: 'X', x: 0, y: 30 }],
    lados: [
      { de: 'P', a: 'F', color: 'h', texto: '30 m', grosor: 'variable' },
      { de: 'F', a: 'X', horizontal: true, paso: 1 },
      { de: 'F', a: 'L', color: 'd', visual: true },
      { de: 'L', a: 'P', color: 'i', texto: 'x = ?', final: 'x = 40 m', grosor: 'variable' },
    ],
    angulos: [
      { en: 'F', de: 'X', a: 'L', texto: '37°', color: 'o', paso: 1 },
      { en: 'L', de: 'P', a: 'F', texto: '37°', color: 'o', paso: 2 }, { en: 'P', de: 'L', a: 'F' },
    ],
  };
  // El marco depende solo de θ: al mover el pie (d), la escala no cambia y la torre crece de verdad.
  const torreJ = v => conMarco(torre(v.d, v.g), 30, 30 * Math.tan(v.g * RAD));
  const elevacion = {
    id: 'elevacion-depresion',
    titulo: 'Desde la horizontal del ojo',
    temas: ['Ángulos de elevación y depresión'],
    pieza: 'triangulo',
    juega: {
      consigna: 'Miras la punta de una torre. Elige tu distancia d al pie y el ángulo de elevación θ, medido desde la horizontal.',
      voz: 'El ángulo nace en la horizontal de tu ojo y sube.',
      controles: [
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 10, max: 30, paso: 5, inicio: 20, unidad: 'm', decimales: 0 },
        { id: 'g', etiqueta: 'θ', color: 'c-o', min: 15, max: 60, paso: 5, inicio: 30, unidad: '°', decimales: 0 },
      ],
      dibujo: v => ({ datos: torreJ(v), estado: {} }),
      lectura: v => [h, ' = ', d, ` · tan ${v.g}° ≈ ${f(v.d * Math.tan(v.g * RAD), 1)} m`],
      minimo: 3,
      // Se arrastran el pie de la torre (cambia d) y su punta (cambia θ: la visual sube o baja desde el ojo).
      arrastres: [
        { id: 'pie', etiqueta: 'pie de la torre: cambia d', color: 'c-i',
          donde: v => enPx(torreJ(v), v.d, 0),
          mover: (pt, v) => ({ d: delPx(torreJ(v), pt).x }) },
        { id: 'punta', etiqueta: 'punta de la torre: cambia θ', color: 'c-o',
          donde: v => enPx(torreJ(v), v.d, v.d * Math.tan(v.g * RAD)),
          mover: (pt, v) => { const q = delPx(torreJ(v), pt); return { g: Math.atan2(q.y, q.x) * GRA }; } },
      ],
    },
    predice: {
      pregunta: 'Desde lo alto de un faro de 30 m se ve una lancha con un ángulo de depresión de 37° (convención 3-4-5). ¿A qué distancia del pie del faro está?',
      voz: 'Dibuja primero la horizontal en lo alto del faro.',
      opciones: [
        { id: 'c', texto: '40 m', correcta: true },
        { id: 'vertical', texto: '22,5 m', error: 'DEP-VERTICAL', siFuera: 'Usar tan 37° está bien; pero así 37° se mide desde el faro, no desde la horizontal.' },
        { id: 'visual', texto: '50 m', error: 'TR9', siFuera: '50 m es el largo de la visual, la hipotenusa. Se pide la distancia por el suelo.' },
        { id: 'sen', texto: '18 m', error: 'TR9', siFuera: 'Partir del 30 está bien; el seno daría un lado del triángulo de 30 m de visual, no este.' },
      ],
      dibujo: { datos: Object.assign({}, FARO, { lados: FARO.lados.map(l => (l.de === 'L' ? Object.assign({}, l, { final: undefined }) : l)) }), estado: { paso: 1 } },
      revelar: { datos: FARO, estado: { paso: 2, final: true } },
      coincide: 'Coincide: la depresión desde arriba es la elevación desde la lancha.',
      noCoincide: 'Revisemos: los dos ángulos de 37° se miden desde horizontales.',
    },
    // Hallazgo 9: «Juega» mide la elevación desde el suelo y «Mira» la depresión desde el faro. Es a propósito: «Mira»
    // resuelve el caso reservado de la predicción, y muestra que es el mismo triángulo visto desde el otro extremo de
    // la visual. La mesa «faro» del laboratorio deja jugar con la depresión.
    mira: {
      pieza: 'triangulo',
      datos: FARO,
      voz: 'La horizontal de arriba y el suelo son paralelos.',
      pasos: [
        { estado: { paso: 1 }, texto: 'La depresión se mide hacia abajo, desde la horizontal del ojo en lo alto.', ecuacion: ['depresión = 37°'] },
        { estado: { paso: 2 }, texto: 'Horizontal y suelo son paralelos: la elevación desde la lancha también es 37°.', ecuacion: ['elevación = depresión = 37°'] },
        { estado: { paso: 2, final: true }, texto: 'En el triángulo, 30 m es opuesto a 37° y x es adyacente.', ecuacion: ['tan 37° = ', { frac: ['30', 'x'] }, ' ≈ ', { frac: ['3', '4'] }, '  ⇒  x = 40 m'] },
      ],
    },
    regla: {
      texto: 'Elevación y depresión se miden desde la horizontal del ojo, hacia arriba o hacia abajo. Entre dos puntos, la depresión de uno es la elevación del otro.',
      ecuacion: [h, ' = ', d, ' · tan ', { llave: [th], nota: 'elevación', color: 'c-o' }],
      condicion: 'θ medido desde la horizontal. Si el problema da la altura de los ojos, se suma a h.',
      voz: 'Primero la horizontal; después el ángulo.',
    },
    ahoraTu: {
      pieza: 'triangulo',
      voz: 'Ubica la horizontal y el ángulo antes de elegir la razón.',
      generar(sem) {
        const rr = azar(sem), g = rr.uno([30, 45, 60, 37, 53]), k = rr.ent(2, 9);
        const altura = ladoTxt(g, k, 'op'), dist = ladoTxt(g, k, 'ad'), visual = ladoTxt(g, k, 'hip');
        const busca = sem % 3 === 1 ? 'ad' : 'op', tiene = busca === 'ad' ? 'op' : 'ad';
        // Medir el ángulo desde la vertical cambia los papeles: el lado buscado sale con la razón del otro agudo.
        const comp = fmtNum(num(k, NOT[g][tiene]) * num(1, NOT[g][tiene]) / num(1, NOT[g][busca]));
        const dib = { datos: torre(num(k, NOT[g].ad), g, { d: sem % 3 === 1 ? 'd = ?' : `d = ${dist}`, h: sem % 3 === 1 ? `h = ${altura}` : 'h = ?', nO: sem % 3 === 1 ? 'barco' : 'ojo' }), estado: {} };
        if (sem % 3 === 2) {
          return {
            pregunta: [`Un instrumento de 1,5 m de alto está a ${dist} m de un edificio y marca una elevación de ${g}°${conv(g)} hasta la azotea. ¿Cuánto mide el edificio?`],
            dibujo: dib,
            opciones: opciones(`${altura} + 1,5 m`, [
              { id: 'ojo', valor: `${altura} m`, error: 'ELEV-OJO', siFuera: 'Ese tramo está bien calculado; empieza a la altura del instrumento: falta sumar 1,5 m.' },
              { id: 'vertical', valor: `${comp} + 1,5 m`, error: 'DEP-VERTICAL', siFuera: `Sumar 1,5 m va bien; pero ${g}° se mide desde la horizontal, no desde el edificio.` },
              { id: 'visual', valor: `${visual} + 1,5 m`, error: 'TR9', siFuera: 'Sumar 1,5 m va bien; pero se sumó a la visual, no a la altura.' },
            ], x => x),
            solucion: { texto: 'La visual parte a 1,5 m del suelo: ese tramo se suma.', ecuacion: [h, ` = ${dist} · tan ${g}° + 1,5 = ${altura} + 1,5 m`] },
          };
        }
        if (sem % 3 === 1) {
          return {
            pregunta: [`Desde lo alto de un acantilado de ${altura} m se ve un barco con un ángulo de depresión de ${g}°${conv(g)}. ¿A qué distancia horizontal está el barco?`],
            dibujo: dib,
            opciones: opciones(`${dist} m`, [
              { id: 'vertical', valor: `${comp} m`, error: 'DEP-VERTICAL', siFuera: `Eso mide ${g}° desde la pared vertical. La depresión se mide desde la horizontal.` },
              { id: 'visual', valor: `${visual} m`, error: 'TR9', siFuera: 'Ese es el largo de la visual. Se pide la distancia por el suelo.' },
              { id: 'igual', valor: `${altura} m`, error: 'RES-MULTIPLICA', siFuera: `Esa es la altura; solo a 45° la distancia mide lo mismo.` },
            ], x => x),
            solucion: { texto: `La elevación desde el barco también es ${g}°.`, ecuacion: [d, ` = `, { frac: [`${altura}`, `tan ${g}°`] }, ` = ${dist} m`] },
          };
        }
        return {
          pregunta: [`Desde ${dist} m del pie de un edificio, su azotea se ve con un ángulo de elevación de ${g}°${conv(g)}. Sin contar la altura de los ojos, ¿cuánto mide el edificio?`],
          dibujo: dib,
          opciones: opciones(`${altura} m`, [
            { id: 'vertical', valor: `${comp} m`, error: 'DEP-VERTICAL', siFuera: `Eso mide ${g}° desde el edificio. La elevación se mide desde la horizontal.` },
            { id: 'visual', valor: `${visual} m`, error: 'TR9', siFuera: 'Ese es el largo de la visual. Se pide la altura.' },
            { id: 'igual', valor: `${dist} m`, error: 'RES-MULTIPLICA', siFuera: 'Esa es la distancia; solo a 45° la altura mide lo mismo.' },
          ], x => x),
          solucion: { texto: 'La altura es opuesta al ángulo; la distancia, adyacente.', ecuacion: [h, ` = ${dist} · tan ${g}° = ${altura} m`] },
        };
      },
    },
  };

  // ---------- Idea 3: el ángulo de observación ----------
  // Cambia: la distancia d al poste de un letrero que va de 2 m a 6 m de altura. · Permanece: el letrero y el suelo.
  // Progresa: el ángulo β entre las dos visuales. · Se reserva: acercarse más que el juego (la predicción).
  // Debe verse: que β es la resta de dos elevaciones, y que crece, llega a un máximo y vuelve a bajar.
  const H1 = 2, H2 = 6, DMAX = Math.sqrt(H1 * H2);
  const beta = dv => (Math.atan(H2 / dv) - Math.atan(H1 / dv)) * GRA;
  const letrero = (dv, o = {}) => ({
    suelo: true,
    puntos: [{ id: 'O', x: 0, y: 0, rotulo: dv < 4 ? '' : 'ojo' }, { id: 'P', x: dv, y: 0 }, { id: 'A', x: dv, y: H1 }, { id: 'B', x: dv, y: H2 }],
    lados: [
      { de: 'O', a: 'P', color: 'i', texto: o.d || `d = ${f(dv)} m`, grosor: 'variable' },
      { de: 'P', a: 'A', texto: '2 m' },
      { de: 'A', a: 'B', color: 'h', texto: '4 m', grosor: 'variable' },
      { de: 'O', a: 'A', color: 'd', visual: true, paso: o.pA }, { de: 'O', a: 'B', color: 'd', visual: true, paso: o.pB },
    ],
    angulos: [
      { en: 'O', de: 'A', a: 'B', texto: o.beta || 'β', color: 'o', paso: o.pBeta, radio: 46 },
    ].concat(o.alfas ? [{ en: 'O', de: 'P', a: 'A', texto: o.alfas[0], paso: o.pA, radio: 24 }] : []),
  });
  const letJ = v => conMarco(letrero(v.d), 12, H2);
  const observacion = {
    id: 'angulo-observacion',
    titulo: 'Lo que abarca la mirada',
    temas: ['Ángulo de observación'],
    pieza: 'triangulo',
    juega: {
      consigna: 'Un letrero va de 2 m a 6 m de altura. Elige tu distancia d al poste y mira el ángulo β entre las visuales.',
      voz: 'Compara las dos visuales: la de arriba y la de abajo.',
      controles: [{ id: 'd', etiqueta: 'd', color: 'c-i', min: 6, max: 12, paso: 1, inicio: 10, unidad: 'm', decimales: 0 }],
      dibujo: v => ({ datos: letJ(v), estado: {} }),
      lectura: v => [be, ` ≈ ${f(beta(v.d), 1)}°  a  `, d, ` = ${v.d} m`],
      minimo: 3,
      // Se arrastra el pie del poste: acerca o aleja el letrero del ojo.
      arrastres: [{ id: 'pie', etiqueta: 'pie del poste: cambia d', color: 'c-i',
        donde: v => enPx(letJ(v), v.d, 0),
        mover: (pt, v) => ({ d: delPx(letJ(v), pt).x }) }],
    },
    predice: {
      pregunta: 'En el juego, acercarse agranda β. Si sigues acercándote hasta quedar junto al poste, ¿qué le pasa a β?',
      voz: 'Imagina las dos visuales cuando estás casi debajo del letrero.',
      opciones: [
        { id: 'c', texto: 'Crece hasta un máximo y luego baja hacia 0°', correcta: true },
        { id: 'crece', texto: 'Sigue creciendo hasta casi 90°', error: 'OBS-CRECE', siFuera: 'Acercarse lo agranda mientras estás lejos. Muy cerca, las dos visuales quedan casi verticales y se juntan.' },
        { id: 'constante', texto: 'Desde cierta distancia ya no cambia', error: 'OBS-CONSTANTE', siFuera: 'Cerca del máximo cambia poco, es cierto; después vuelve a bajar.' },
        { id: '45', texto: 'Crece hasta 45° y se queda ahí', error: 'OBS-45', siFuera: 'Buscar un tope está bien; aquí el tope es 30°, y después β baja.' },
      ],
      dibujo: { datos: letrero(3, { d: 'd = ?', beta: 'β' }), estado: {} },
      revelar: { datos: letrero(1, { d: 'd = 1 m' }), estado: { fantasma: { texto: `máximo: β = ${f(beta(DMAX))}° a d ≈ ${f(DMAX)} m` } } },
      coincide: `Coincide: el mayor β es ${f(beta(DMAX))}°, a unos ${f(DMAX, 1)} m.`,
      noCoincide: `Revisemos: a 1 m, β ya bajó a ${f(beta(1), 1)}°.`,
    },
    mira: {
      pieza: 'triangulo',
      datos: letrero(DMAX, { d: 'd = 2√3 m', beta: 'β', alfas: ['30°'], pA: 1, pB: 2, pBeta: 3 }),
      voz: 'Dos elevaciones desde el mismo ojo; β es su diferencia.',
      pasos: [
        { estado: { paso: 1 }, texto: 'La visual al borde de abajo sube un ángulo α₁.', ecuacion: ['tan ', sub(al, '1'), ' = ', { frac: ['2', d] }] },
        { estado: { paso: 2 }, texto: 'La visual al borde de arriba sube α₂, más empinada.', ecuacion: ['tan ', sub(al, '2'), ' = ', { frac: ['6', d] }] },
        { estado: { paso: 3 }, texto: 'β es lo que una visual le saca a la otra.', ecuacion: [be, ' = ', sub(al, '2'), ' − ', sub(al, '1')] },
        { estado: { paso: 3 }, texto: 'A d = 2√3 m queda 60° − 30° = 30°: ahí β es máximo.', ecuacion: ['tan ', sub(al, '2'), ' = √3', '   ·   ', 'tan ', sub(al, '1'), ' = ', { frac: ['1', '√3'] }, '   ·   ', be, ' = 30°'] },
      ],
    },
    regla: {
      texto: 'El ángulo de observación de un objeto es la diferencia entre las elevaciones de su borde alto y de su borde bajo. No sale de la altura del objeto sola.',
      ecuacion: [be, ' = ', { llave: [sub(al, '2')], nota: 'borde alto', color: 'c-o' }, ' − ', { llave: [sub(al, '1')], nota: 'borde bajo', color: 'c-o' }, '   ·   ', 'tan ', al, ' = ', { frac: [h, d] }],
      condicion: 'las dos elevaciones se miden desde el mismo ojo y la misma horizontal.',
      voz: 'Resta ángulos, no alturas.',
    },
    ahoraTu: {
      voz: 'Calcula cada elevación por separado y después réstalas.',
      generar(sem) {
        const rr = azar(sem), k = rr.ent(1, 3);
        const juegos = [
          { d: 12, hs: [[9, 37], [12, 45], [16, 53]] },
          { d: 24, hs: [[7, 16], [18, 37], [24, 45], [32, 53]] },
        ];
        const J = juegos[sem % 2];
        const i = rr.ent(0, J.hs.length - 2), j = rr.ent(i + 1, J.hs.length - 1);
        const [ha, aa] = J.hs[i], [hb, ab] = J.hs[j], dv = J.d * k;
        const conv2 = J.d === 24 ? 'los triángulos 3-4-5 y 7-24-25' : 'el triángulo 3-4-5';
        return {
          pregunta: [`Un letrero va de ${ha * k} m a ${hb * k} m de altura. Desde el suelo, a ${dv} m del poste, ¿cuál es su ángulo de observación? Usa la convención de ${conv2}.`],
          opciones: opciones(ab - aa, [
            { id: 'arriba', valor: ab, error: 'OBS-SOLO-ARRIBA', siFuera: `${ab}° es la elevación del borde de arriba. Falta restarle la del borde de abajo.` },
            { id: 'suma', valor: aa + ab, error: 'OBS-SUMA', siFuera: 'Las dos elevaciones son las correctas; el ángulo entre visuales es su resta.' },
            { id: 'alturas', valor: Math.round(Math.atan((hb - ha) / J.d) * GRA * 100) / 100, error: 'OBS-RESTA-ALTURAS', siFuera: 'Restar está bien, pero los ángulos: restar alturas da otro triángulo.' },
          ], v => `${f(v)}°`),
          solucion: { texto: `Las elevaciones miden ${ab}° y ${aa}°; se restan.`, ecuacion: [be, ` = ${ab}° − ${aa}° = ${ab - aa}°`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Ojo a la altura a sobre el suelo: la visual sube θ desde la horizontal del ojo; la torre suma a.
  // El ojo no lleva rótulo: lo marca su manija, y el rótulo «a = …» queda libre a su izquierda.
  function instr(v) {
    const t = v.d * Math.tan(v.g * RAD), Q = { id: 'Q', x: v.d, y: v.a };
    const lados = [
      { de: 'O', a: 'Q', color: 'i', texto: `d = ${f(v.d)} m`, horizontal: v.a > 0, grosor: 'variable' },
      { de: 'Q', a: 'T', color: 'h', texto: `${f(t, 1)} m`, grosor: 'variable' },
      { de: 'O', a: 'T', color: 'd', visual: true },
    ].concat(v.a > 0 ? [{ de: 'S', a: 'O', color: 'h', texto: `a = ${f(v.a)}`, grosor: 'contorno' }, { de: 'P', a: 'Q', texto: `${f(v.a)}`, grosor: 'contorno' }] : []);
    return {
      suelo: true,
      puntos: [{ id: 'S', x: 0, y: 0 }, { id: 'O', x: 0, y: v.a }, { id: 'P', x: v.d, y: 0 }, Q, { id: 'T', x: v.d, y: v.a + t },
        { id: 'marco', x: 12, y: 12 * Math.tan(v.g * RAD) + 2, paso: 99 }, { id: 'margen', x: -2.5, y: 0, paso: 99 }],
      lados,
      angulos: [{ en: 'O', de: 'Q', a: 'T', texto: `${v.g}°`, color: 'o' }],
    };
  }
  // Faro con el pie en el origen y la lancha a la izquierda; marco fijo para que la lancha siga al dedo.
  function faroL(v) {
    const x = v.H / Math.tan(v.g * RAD);
    return {
      suelo: true,
      puntos: [{ id: 'L', x: -x, y: 0, rotulo: 'lancha' }, { id: 'P', x: 0, y: 0, rotulo: 'faro' }, { id: 'F', x: 0, y: v.H }, { id: 'X', x: -x, y: v.H },
        { id: 'marco', x: -30 / Math.tan(30 * RAD), y: 30, paso: 99 }],
      lados: [
        { de: 'P', a: 'F', color: 'h', texto: `${f(v.H)} m`, grosor: 'variable' },
        { de: 'F', a: 'X', horizontal: true },
        { de: 'F', a: 'L', color: 'd', visual: true },
        { de: 'L', a: 'P', color: 'i', texto: `${f(x, 1)} m`, grosor: 'variable' },
      ],
      angulos: [{ en: 'F', de: 'X', a: 'L', texto: `${v.g}°`, color: 'o' }, { en: 'L', de: 'P', a: 'F', texto: `${v.g}°`, color: 'o' }, { en: 'P', de: 'L', a: 'F' }],
    };
  }
  const betaL = v => (Math.atan((v.a + v.L) / v.d) - Math.atan(v.a / v.d)) * GRA;
  const letL = v => ({
    suelo: true,
    puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'ojo' }, { id: 'P', x: v.d, y: 0 }, { id: 'A', x: v.d, y: v.a }, { id: 'B', x: v.d, y: v.a + v.L },
      { id: 'marco', x: 12, y: 10, paso: 99 }],
    lados: [
      { de: 'O', a: 'P', color: 'i', texto: `d = ${f(v.d)} m`, grosor: 'variable' },
      { de: 'P', a: 'A', texto: `${f(v.a)} m` },
      { de: 'A', a: 'B', color: 'h', texto: `${f(v.L)} m`, grosor: 'variable' },
      { de: 'O', a: 'A', color: 'd', visual: true }, { de: 'O', a: 'B', color: 'd', visual: true },
    ],
    angulos: [{ en: 'O', de: 'A', a: 'B', texto: 'β', color: 'o', radio: 46 }],
  });

  return {
    unidad: 'trigonometria.triangulos-rectangulos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/triangulo.js'],
    historia: {
      texto: 'Hacia 1021, al-Biruni escribió un tratado sobre las sombras: relacionaba la altura del Sol, los instrumentos y el cálculo con razones. Para medir algo inalcanzable hacía falta lo mismo que hoy: fijar la horizontal, leer bien el ángulo y conocer una distancia que sí se puede medir.',
      pregunta: '¿Cómo medirías la altura de un edificio sin subir a él?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Abu Rayhan al-Biruni», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Al-Biruni/' },
    },
    ideas: [unLado, elevacion, observacion],
    // Laboratorio (docs/teoria.md §4b). «instrumento»: la altura del ojo se suma a la torre, el error ELEV-OJO que la
    // idea 2 solo pregunta; tres manijas. «faro»: la depresión desde lo alto, con altura y ángulo libres (la idea 2 la
    // deja en «Mira»). «letrero-cerca»: el letrero con sus dos bordes libres y el ojo hasta medio metro del poste,
    // donde β vuelve a bajar; la lectura dice dónde está el máximo.
    laboratorio: [
      {
        id: 'instrumento', titulo: 'El ojo, sobre el suelo', pieza: 'triangulo',
        consigna: 'El ojo está a una altura a. Arrastra el ojo, el pie y la punta. La torre suma el tramo bajo el ojo.',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-h', min: 0, max: 2, paso: 0.5, inicio: 1.5, unidad: 'm', decimales: 1 },
          { id: 'd', etiqueta: 'd', color: 'c-i', min: 2, max: 12, paso: 1, inicio: 6, unidad: 'm', decimales: 0 },
          { id: 'g', etiqueta: 'θ', color: 'c-o', min: 10, max: 60, paso: 1, inicio: 30, unidad: '°', decimales: 0 },
        ],
        dibujo: v => ({ datos: instr(v), estado: {} }),
        lectura: v => [h, ` = ${f(v.d)} · tan ${v.g}° + ${f(v.a)} ≈ ${f(v.d * Math.tan(v.g * RAD) + v.a)} m`],
        // El ojo sube o baja (a); el pie de la torre cambia d; la punta, vista desde el ojo, cambia θ.
        arrastres: [
          { id: 'ojo', etiqueta: 'ojo: cambia su altura a', color: 'c-h',
            donde: v => enPx(instr(v), 0, v.a),
            mover: (pt, v) => ({ a: delPx(instr(v), pt).y }) },
          { id: 'pie', etiqueta: 'pie de la torre: cambia d', color: 'c-i',
            donde: v => enPx(instr(v), v.d, 0),
            mover: (pt, v) => ({ d: delPx(instr(v), pt).x }) },
          { id: 'punta', etiqueta: 'punta de la torre: cambia θ', color: 'c-o',
            donde: v => enPx(instr(v), v.d, v.a + v.d * Math.tan(v.g * RAD)),
            mover: (pt, v) => { const q = delPx(instr(v), pt); return { g: Math.atan2(q.y - v.a, q.x) * GRA }; } },
        ],
      },
      {
        id: 'faro', titulo: 'Depresión desde el faro', pieza: 'triangulo',
        consigna: 'Desde lo alto del faro miras la lancha. Arrastra la lancha y la punta del faro: compara la depresión con la elevación.',
        controles: [
          { id: 'H', etiqueta: 'altura', color: 'c-h', min: 10, max: 30, paso: 2, inicio: 20, unidad: 'm', decimales: 0 },
          { id: 'g', etiqueta: 'θ', color: 'c-o', min: 30, max: 75, paso: 1, inicio: 37, unidad: '°', decimales: 0 },
        ],
        dibujo: v => ({ datos: faroL(v), estado: {} }),
        lectura: v => [`depresión = elevación = ${v.g}° · `, d, ` = ${v.H} ÷ tan ${v.g}° ≈ ${f(v.H / Math.tan(v.g * RAD))} m`],
        // La lancha corre por el agua: cambia el ángulo; la punta del faro cambia su altura.
        arrastres: [
          { id: 'lancha', etiqueta: 'lancha: cambia el ángulo', color: 'c-o',
            donde: v => enPx(faroL(v), -v.H / Math.tan(v.g * RAD), 0),
            mover: (pt, v) => ({ g: Math.atan2(v.H, Math.max(-delPx(faroL(v), pt).x, 1e-6)) * GRA }) },
          { id: 'punta', etiqueta: 'punta del faro: cambia su altura', color: 'c-h',
            donde: v => enPx(faroL(v), 0, v.H),
            mover: (pt, v) => ({ H: delPx(faroL(v), pt).y }) },
        ],
      },
      {
        id: 'letrero-cerca', titulo: 'El letrero, de cerca', pieza: 'triangulo',
        consigna: 'Arrastra el pie del poste y los dos bordes del letrero. Acércate hasta medio metro y busca dónde β es mayor.',
        controles: [
          { id: 'd', etiqueta: 'd', color: 'c-i', min: 0.5, max: 12, paso: 0.5, inicio: 6, unidad: 'm', decimales: 1 },
          { id: 'a', etiqueta: 'borde bajo', color: 'c-h', min: 1, max: 4, paso: 0.5, inicio: 2, unidad: 'm', decimales: 1 },
          { id: 'L', etiqueta: 'letrero', color: 'c-h', min: 1, max: 6, paso: 0.5, inicio: 4, unidad: 'm', decimales: 1 },
        ],
        dibujo: v => ({ datos: letL(v), estado: {} }),
        lectura: v => [be, ` ≈ ${f(betaL(v), 1)}° a `, d, ` = ${f(v.d)} m · el mayor, a ${f(Math.sqrt(v.a * (v.a + v.L)), 1)} m`],
        // El pie del poste cambia d; el borde bajo sube el letrero entero; el borde alto lo estira.
        arrastres: [
          { id: 'pie', etiqueta: 'pie del poste: cambia d', color: 'c-i',
            donde: v => enPx(letL(v), v.d, 0),
            mover: (pt, v) => ({ d: delPx(letL(v), pt).x }) },
          { id: 'bajo', etiqueta: 'borde bajo del letrero', color: 'c-h',
            donde: v => enPx(letL(v), v.d, v.a),
            mover: (pt, v) => ({ a: delPx(letL(v), pt).y }) },
          { id: 'alto', etiqueta: 'borde alto del letrero: cambia su largo', color: 'c-h',
            donde: v => enPx(letL(v), v.d, v.a + v.L),
            mover: (pt, v) => ({ L: delPx(letL(v), pt).y - v.a }) },
        ],
      },
    ],
  };
});
