/*
 * Teoría de «Polígonos y cuadriláteros» (geometria.poligonos-y-cuadrilateros). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 4); Elementos I.34 (la diagonal del paralelogramo).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: contar ángulos y diagonales sin fórmulas sueltas (triangular, contar dos veces) y nombrar cuadriláteros
 *     por sus propiedades, aceptando que un cuadrado también es rectángulo y rombo.
 *   Persona y condiciones: postulante de 3.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: halla la suma de ángulos interiores y exteriores, el número de diagonales, la mediana de un
 *     trapecio y el perímetro del paralelogramo de los puntos medios.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿de dónde sale (n − 2)·180°?» y «¿un cuadrado es rectángulo?».
 *
 * Colores: n y lo que se cuenta naranja (c-o), lo que acompaña turquesa (c-i), referencia verde (c-d), lo pedido rojo (c-h).
 * Convención declarada (sílabo peruano): trapecio = exactamente un par de lados paralelos; trapezoide = ninguno.
 * Códigos: GE10 (inclusión de clases), GE23 (suma y diagonales); GE-POL, GE-TRP y GE-VAR son hipótesis nuevas.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/kit/piezas/geo-figura.js'))
    : fabrica(root.Kit, root.Kit.piezas['geo-figura']);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, G) {
  'use strict';
  const U = G.util;
  const f = (n, d = 1) => Kit.formatear(n, d);
  const gr = n => `${f(n)}°`;
  const n_ = { v: 'c-o', t: 'n' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt, n = 4) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor <= 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, n);
  }
  const LETRAS = 'ABCDEFGHIJ';
  // Polígono convexo de n lados, irregular a propósito (no prototípico), siempre igual para el mismo n.
  const vertices = n => Array.from({ length: n }, (_, k) => U.polar([0, 0], 3 + 0.3 * Math.cos(k * 1.7 + n), 100 + 360 * k / n + 6 * Math.sin(k * 2.3 + n)));
  const poli = (n, o = {}) => {
    const V = vertices(n);
    const P = V.map((p, k) => ({ id: LETRAS[k], x: p[0], y: p[1], rotulo: LETRAS[k], lado: 100 + 360 * k / n }));
    const seg = [];
    for (let k = 0; k < n; k++) seg.push({ de: LETRAS[k], a: LETRAS[(k + 1) % n] });
    const reg = [], ang = [];
    if (o.triangulos) for (let k = 1; k < n - 1; k++) {
      reg.push({ puntos: ['A', LETRAS[k], LETRAS[k + 1]], color: k % 2 ? 'o' : 'i', opacidad: 0.14, desde: o.triDesde || 0 });
      if (k > 1) seg.push({ de: 'A', a: LETRAS[k], color: 'o', grosor: 'fino', desde: o.triDesde || 0 });
    }
    if (o.diagDe !== undefined) {
      const v = o.diagDe;
      for (let k = 0; k < n; k++) if (k !== v && k !== (v + 1) % n && k !== (v + n - 1) % n) seg.push({ de: LETRAS[v], a: LETRAS[k], color: 'o', grosor: 'variable' });
    }
    if (o.todas) for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) seg.push({ de: LETRAS[i], a: LETRAS[j], color: 'i', grosor: 'fino', desde: o.todas });
    if (o.exteriores) for (let k = 0; k < n; k++) {
      const a = V[k], b = V[(k + 1) % n], e = [b[0] + (b[0] - a[0]) * 0.4, b[1] + (b[1] - a[1]) * 0.4];
      P.push({ id: 'e' + k, x: e[0], y: e[1], sinPunto: true });
      seg.push({ de: LETRAS[(k + 1) % n], a: 'e' + k, discontinua: true, grosor: 'fino', desde: o.extDesde || 0 });
      ang.push({ en: LETRAS[(k + 1) % n], de: 'e' + k, a: LETRAS[(k + 2) % n], color: 'h', radio: 16, desde: o.extDesde || 0 });
    }
    return {
      alt: o.alt || `Polígono convexo de ${n} lados${o.triangulos ? `, partido en ${n - 2} triángulos desde A` : ''}${o.diagDe !== undefined ? `; desde ${LETRAS[o.diagDe]} salen ${n - 3} diagonales` : ''}`,
      vista: { x: [-4.4, 4.4], y: [-4, 4.2] },
      puntos: P, regiones: reg, segmentos: seg, angulos: ang,
    };
  };

  // ---------- Idea 1: suma de ángulos interiores y exteriores ----------
  // Cambia: el número de lados n · Permanece: la triangulación desde A · Progresa: los triángulos (n − 2) ·
  // Se reserva: el giro completo de los exteriores · Debe verse: cada triángulo aporta 180°; los exteriores, una vuelta.
  const sumaIdea = {
    id: 'suma-de-angulos',
    titulo: 'Triángulos dentro del polígono',
    temas: ['Suma de ángulos internos y externos'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Cambia el número de lados. Desde el vértice A, las diagonales parten el polígono en triángulos. Cuenta los triángulos.',
      voz: 'Cambia n y cuenta triángulos. Compara con n.',
      controles: [{ id: 'n', etiqueta: 'n', min: 3, max: 10, paso: 1, inicio: 5, unidad: 'lados', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: poli(v.n, { triangulos: true }), estado: {} }),
      lectura: v => [`${v.n - 2} triángulos · suma interior = ${(v.n - 2) * 180}°`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Recorres el borde de un octógono. En cada vértice giras el ángulo exterior para seguir por el lado siguiente. ¿Cuánto giras en total al volver al inicio?',
      voz: 'No cuentes triángulos: sigue el giro de tu cuerpo.',
      opciones: [
        { id: 'c', texto: '360°', correcta: true },
        { id: 'interior', texto: '1080°', error: 'GE-POL1', siFuera: '1080° es la suma interior del octógono. Los exteriores son los giros, no los rincones.' },
        { id: 'ocho', texto: '1440°', error: 'GE23', siFuera: '8 · 180° contaría cada vértice entero. El triángulo interior ya usa parte de esos 180°.' },
        { id: 'depende', texto: 'Depende de la forma', error: 'GE-POL2', siFuera: 'Cada giro sí depende de la forma; la suma de todos es una vuelta completa.' },
      ],
      dibujo: { datos: poli(8, { alt: 'Octógono convexo irregular' }), estado: {} },
      revelar: { datos: poli(8, { exteriores: true, alt: 'Octógono con su ángulo exterior en cada vértice: los ocho giros suman una vuelta' }), estado: {} },
      coincide: 'Coincide: al volver al inicio diste una vuelta completa.',
    },
    mira: {
      datos: poli(6, { triangulos: true, triDesde: 1, exteriores: true, extDesde: 3, alt: 'Hexágono: cuatro triángulos desde A y seis ángulos exteriores' }),
      voz: 'Cuenta triángulos para el interior; resta para el exterior.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Un hexágono: n = 6 lados.', ecuacion: [n_, ' = 6'] },
        { estado: { corte: 1 }, texto: 'Desde A salen diagonales: quedan n − 2 = 4 triángulos.', ecuacion: ['(', n_, ' − 2) · 180° = 720°'] },
        { estado: { corte: 2 }, texto: 'En cada vértice, interior más exterior forman 180°.', ecuacion: [n_, ' · 180° = 1080°'] },
        { estado: { corte: 3 }, texto: 'Exteriores: lo que sobra después del interior.', ecuacion: ['1080° − 720° = 360°'] },
      ],
    },
    regla: {
      texto: 'Un polígono de n lados se parte en n − 2 triángulos: sus ángulos interiores suman (n − 2) · 180°. Un exterior por vértice suma siempre 360°.',
      ecuacion: [{ sub: ['S', 'i'] }, ' = (', n_, ' − 2) · 180°   ·   ', { sub: ['S', 'e'] }, ' = 360°'],
      condicion: 'el polígono es convexo y se toma un solo ángulo exterior en cada vértice.',
      voz: 'Los triángulos explican el número; no hace falta memorizarlo.',
    },
    ahoraTu: {
      voz: 'Decide si te piden un interior, un exterior o el número de lados.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const n = r.ent(5, 15);
          return {
            pregunta: ['¿Cuánto suman los ángulos interiores de un polígono convexo de ', n_, ` = ${n} lados?`],
            opciones: opciones((n - 2) * 180, [
              { id: 'n180', valor: n * 180, error: 'GE23', siFuera: `${n} · 180° contaría ${n} triángulos; desde un vértice salen ${n - 2}.` },
              { id: 'menos1', valor: (n - 1) * 180, error: 'GE23', siFuera: 'Revisa el conteo: desde un vértice salen n − 2 triángulos.' },
              { id: 'ext', valor: 360, error: 'GE-POL1', siFuera: '360° es la suma de los exteriores, no la de los interiores.' },
            ], gr),
            solucion: { texto: `${n - 2} triángulos de 180°.`, ecuacion: [`(${n} − 2) · 180° = ${(n - 2) * 180}°`] },
          };
        }
        if (tipo === 1) {
          const n = r.de([5, 6, 8, 9, 10, 12, 15, 18, 20]);
          return {
            pregunta: ['Un polígono regular tiene ', n_, ` = ${n} lados. ¿Cuánto mide cada ángulo exterior?`],
            opciones: opciones(360 / n, [
              { id: 'interior', valor: 180 - 360 / n, error: 'GE-POL1', siFuera: 'Ese es cada ángulo interior. El exterior completa 180° con él.' },
              { id: 'suma', valor: 180 * (n - 2) / n / 2, error: 'GE-POL3', siFuera: 'Dividir la suma interior entre 2n no da ningún ángulo de la figura.' },
              { id: '180n', valor: 180 / n, error: 'GE-POL3', siFuera: 'Los exteriores suman 360°, no 180°.' },
            ], gr),
            solucion: { texto: 'Los exteriores suman 360° y son iguales.', ecuacion: [`360° ÷ ${n} = ${gr(360 / n)}`] },
          };
        }
        const n = r.ent(5, 14), S = (n - 2) * 180;
        return {
          pregunta: [`Los ángulos interiores de un polígono convexo suman ${S}°. ¿Cuántos lados tiene?`],
          opciones: opciones(n, [
            { id: 'sin2', valor: S / 180, error: 'GE23', siFuera: `${S / 180} es el número de triángulos; el polígono tiene 2 lados más.` },
            { id: 'mas1', valor: S / 180 + 1, error: 'GE23', siFuera: 'Faltaría un lado: los triángulos son n − 2.' },
            { id: 'doble', valor: n + 2, error: 'GE23', siFuera: 'Ese sumaría 2 de más. Comprueba con (n − 2) · 180°.' },
          ], x => `${f(x, 0)} lados`),
          solucion: { texto: 'Divide entre 180° y suma los 2 vértices sin triángulo propio.', ecuacion: [`${S}° ÷ 180° + 2 = ${n}`] },
        };
      },
    },
  };

  // ---------- Idea 2: número de diagonales ----------
  // Cambia: n y el vértice de partida · Permanece: el polígono · Progresa: las n − 3 diagonales de un vértice ·
  // Se reserva: todas las diagonales a la vez · Debe verse: contar desde cada vértice cuenta cada diagonal dos veces.
  const diagonales = {
    id: 'diagonales',
    titulo: 'Cada diagonal se cuenta dos veces',
    temas: ['Número de diagonales'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Elige n y un vértice. Mira las diagonales que salen de ese vértice: no van a sí mismo ni a sus dos vecinos.',
      voz: 'Cuenta desde un vértice. Prueba otro vértice: ¿cambia?',
      controles: [
        { id: 'n', etiqueta: 'n', min: 4, max: 10, paso: 1, inicio: 6, unidad: 'lados', decimales: 0, color: 'c-o' },
        { id: 'v', etiqueta: 'Vértice', min: 0, max: 3, paso: 1, inicio: 0, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: poli(v.n, { diagDe: v.v }), estado: {} }),
      lectura: v => [`Desde ${LETRAS[v.v]}: ${v.n - 3} diagonales`],
      minimo: 4,
    },
    predice: {
      pregunta: 'En un decágono, de cada vértice salen 7 diagonales. ¿Cuántas diagonales tiene el decágono en total?',
      voz: 'Antes de multiplicar, piensa en los dos extremos de cada diagonal.',
      opciones: [
        { id: 'c', texto: '35', correcta: true },
        { id: 'doble', texto: '70', error: 'GE-POL4', siFuera: '10 · 7 sí cuenta lo que sale de cada vértice, pero cada diagonal tiene dos extremos: queda contada dos veces.' },
        { id: 'lados', texto: '45', error: 'GE23', siFuera: '45 = 10 · 9 ÷ 2 une todos los pares de vértices, incluidos los 10 lados.' },
        { id: 'siete', texto: '7', error: 'GE-POL4', siFuera: '7 son las de un solo vértice. Faltan las de los otros nueve.' },
      ],
      dibujo: { datos: poli(10, { diagDe: 0 }), estado: {} },
      revelar: { datos: poli(10, { todas: 0, alt: 'Decágono con sus 35 diagonales' }), estado: {} },
      coincide: 'Coincide: 10 · 7 cuenta cada diagonal dos veces; 70 ÷ 2 = 35.',
    },
    mira: {
      datos: poli(6, { diagDe: 0, todas: 2, alt: 'Hexágono: 3 diagonales desde A y 9 en total' }),
      voz: 'Cuenta por vértices y corrige la repetición.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Desde A salen n − 3 = 3 diagonales.', ecuacion: [n_, ' − 3 = 3'] },
        { estado: { corte: 2 }, texto: 'Desde cada uno de los 6 vértices salen 3: 18 extremos.', ecuacion: [n_, '(', n_, ' − 3) = 18'] },
        { estado: { corte: 2 }, texto: 'Cada diagonal tiene dos extremos: se contó dos veces.', ecuacion: ['D = ', { frac: [[n_, '(', n_, ' − 3)'], '2'] }, ' = 9'] },
      ],
    },
    regla: {
      texto: 'De cada vértice salen n − 3 diagonales. Como cada diagonal tiene dos extremos, el total es n(n − 3)/2.',
      ecuacion: ['D = ', { frac: [[n_, '(', n_, ' − 3)'], '2'] }],
      condicion: 'se excluyen el propio vértice y sus dos vecinos, porque esos segmentos son lados.',
      voz: 'Dos extremos por diagonal: por eso se divide entre 2.',
    },
    ahoraTu: {
      voz: 'Cuenta desde un vértice; después corrige la repetición.',
      generar(s) {
        const r = azar(s), n = r.ent(5, 20), D = n * (n - 3) / 2;
        if (s % 2) return {
          pregunta: [`Un polígono convexo tiene ${D} diagonales. ¿Cuántos lados tiene?`],
          opciones: opciones(n, [
            { id: 'mas', valor: n + 1, error: 'GE-POL4', siFuera: `Con ${n + 1} lados habría ${(n + 1) * (n - 2) / 2} diagonales.` },
            { id: 'menos', valor: n - 1, error: 'GE-POL4', siFuera: `Con ${n - 1} lados habría ${(n - 1) * (n - 4) / 2} diagonales.` },
            { id: 'doble', valor: 2 * n, error: 'GE-POL4', siFuera: 'Prueba el valor en n(n − 3)/2: da muchas más diagonales.' },
          ], x => `${f(x, 0)} lados`),
          solucion: { texto: 'Busca n con n(n − 3)/2 igual al dato.', ecuacion: [`${n}(${n} − 3)/2 = ${D}`] },
        };
        return {
          pregunta: ['¿Cuántas diagonales tiene un polígono convexo de ', n_, ` = ${n} lados?`],
          opciones: opciones(D, [
            { id: 'doble', valor: n * (n - 3), error: 'GE-POL4', siFuera: 'Ese cuenta cada diagonal dos veces, una por extremo.' },
            { id: 'pares', valor: n * (n - 1) / 2, error: 'GE23', siFuera: 'Ese une todos los pares de vértices, incluidos los lados.' },
            { id: 'uno', valor: n - 3, error: 'GE-POL4', siFuera: 'Esas son las de un solo vértice.' },
          ], x => f(x, 0)),
          solucion: { texto: `${n} vértices por ${n - 3} diagonales, entre 2.`, ecuacion: [`${n}(${n} − 3)/2 = ${D}`] },
        };
      },
    },
  };

  // ---------- Idea 3: la familia de los paralelogramos ----------
  // Cambia: el ángulo y el lado b · Permanece: lados opuestos paralelos · Progresa: el nombre que se gana con cada condición ·
  // Se reserva: el cuadrado girado · Debe verse: un cuadrado cumple la definición de rectángulo y la de rombo.
  const nombrePar = (t, b) => (t === 90 && b === 5 ? 'cuadrado' : t === 90 ? 'rectángulo' : b === 5 ? 'rombo' : 'paralelogramo');
  const para = (t, b, o = {}) => {
    const A = [0, 0], B = [5, 0], D = U.polar(A, b, t), C = [B[0] + D[0], D[1]];
    const giro = o.giro || 0;
    const R = p => { const c = Math.cos(U.rad(giro)), s = Math.sin(U.rad(giro)); const q = [p[0] - 2.5, p[1] - b / 2]; return [q[0] * c - q[1] * s, q[0] * s + q[1] * c]; };
    const [a, bb, cc, dd] = [A, B, C, D].map(R), O = U.medio(a, cc);
    const k = o.pasos || {};
    const nom = nombrePar(t, b);
    return {
      alt: o.alt || `${nom} de lados 5 y ${b} con ángulo de ${t}°: sus diagonales se cortan en su punto medio`,
      vista: { x: [-4.6, 5.4], y: [-3.6, 3.8] },
      puntos: [{ id: 'A', x: a[0], y: a[1], rotulo: 'A' }, { id: 'B', x: bb[0], y: bb[1], rotulo: 'B' }, { id: 'C', x: cc[0], y: cc[1], rotulo: 'C' }, { id: 'D', x: dd[0], y: dd[1], rotulo: 'D' },
        { id: 'O', x: O[0], y: O[1], sinPunto: true }],
      regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'i', opacidad: 0.08 }],
      segmentos: [{ de: 'A', a: 'B', paralela: 1, marcas: o.lados ? 1 : 0, color: 'o', grosor: 'variable' }, { de: 'D', a: 'C', paralela: 1, marcas: o.lados ? 1 : 0, color: 'o', grosor: 'variable' },
        { de: 'B', a: 'C', paralela: 2, marcas: o.lados ? 1 : 0, color: 'i', grosor: 'variable' }, { de: 'A', a: 'D', paralela: 2, marcas: o.lados ? 1 : 0, color: 'i', grosor: 'variable' },
        { de: 'A', a: 'O', grosor: 'fino', marcas: 1, desde: k.diag || 0, hasta: o.diagHasta }, { de: 'O', a: 'C', grosor: 'fino', marcas: 1, desde: k.diag || 0 },
        { de: 'B', a: 'O', grosor: 'fino', marcas: o.diagIguales ? 1 : 2, desde: k.diag || 0 }, { de: 'O', a: 'D', grosor: 'fino', marcas: o.diagIguales ? 1 : 2, desde: k.diag || 0 }],
      angulos: [{ en: 'A', de: 'B', a: 'D', color: 'd', texto: o.rectos || o.sinAng ? undefined : `${t}°`, desde: k.ang || 0 },
        ...(o.rectos ? [{ en: 'B', de: 'C', a: 'A', color: 'd', desde: k.rect || 0 }, { en: 'C', de: 'D', a: 'B', color: 'd', desde: k.rect || 0 }, { en: 'D', de: 'A', a: 'C', color: 'd', desde: k.rect || 0 }] : []),
        ...(o.perp ? [{ en: 'O', de: 'C', a: 'D', color: 'h', desde: k.perp || 0 }] : [])],
    };
  };
  const paralelogramos = {
    id: 'paralelogramos',
    titulo: 'Nombres que se ganan con condiciones',
    temas: ['Paralelogramos'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Los lados opuestos siempre son paralelos. Cambia el ángulo A y el lado b, y mira qué nombre recibe la figura.',
      voz: 'Deforma la figura. Revisa qué condición gana o pierde.',
      controles: [
        { id: 't', etiqueta: '∠A', min: 45, max: 135, paso: 15, inicio: 60, unidad: '°', decimales: 0, color: 'c-d' },
        { id: 'b', etiqueta: 'b', min: 3, max: 6, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: para(v.t, v.b, { lados: v.b === 5, rectos: v.t === 90 }), estado: {} }),
      lectura: v => [`lados 5 y `, { v: 'c-i', t: `${v.b}` }, ` · ${nombrePar(v.t, v.b)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'La figura tiene cuatro lados iguales y cuatro ángulos rectos, y está girada. ¿Es un rectángulo? ¿Es un rombo?',
      voz: 'Ignora el giro. Revisa las definiciones una por una.',
      opciones: [
        { id: 'c', texto: 'Es las dos cosas: es un cuadrado', correcta: true },
        { id: 'otra', texto: 'Ninguna: el cuadrado es otra figura', error: 'GE10', siFuera: 'Las figuras sí se ven distintas; el cuadrado cumple la definición de rectángulo y la de rombo.' },
        { id: 'rombo', texto: 'Solo rombo, porque está girada', error: 'GE9', siFuera: 'Girada parece rombo, pero girar no cambia sus ángulos rectos: también es rectángulo.' },
      ],
      dibujo: { datos: para(90, 5, { giro: 45, lados: true, rectos: true, alt: 'Cuadrilátero girado 45° con cuatro lados iguales y cuatro ángulos rectos' }), estado: { corte: 0 } },
      revelar: { datos: para(90, 5, { giro: 45, lados: true, rectos: true, diagIguales: true, perp: true, alt: 'Cuadrado girado: diagonales iguales, perpendiculares y que se cortan en su punto medio' }), estado: {} },
      coincide: 'Coincide: cumple las condiciones del rectángulo y las del rombo.',
    },
    mira: {
      datos: para(90, 5, { giro: 20, lados: true, rectos: true, diagIguales: true, perp: true, pasos: { diag: 1, rect: 2, perp: 3 }, alt: 'Cuadrado: paralelogramo con ángulos rectos y lados iguales; sus diagonales son iguales y perpendiculares' }),
      voz: 'Cada condición agrega una propiedad. Ninguna quita las anteriores.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Paralelogramo: dos pares de lados paralelos.', ecuacion: ['AB ∥ DC · AD ∥ BC'] },
        { estado: { corte: 1 }, texto: 'En todo paralelogramo, las diagonales se cortan en su punto medio.', ecuacion: ['AO = OC · BO = OD'] },
        { estado: { corte: 2 }, texto: 'Con cuatro ángulos rectos es rectángulo: diagonales iguales.', ecuacion: ['AC = BD'] },
        { estado: { corte: 3 }, texto: 'Con cuatro lados iguales es rombo: diagonales perpendiculares.', ecuacion: ['AC ⟂ BD'] },
        { estado: { corte: 3 }, texto: 'Con las dos condiciones a la vez, es cuadrado.', ecuacion: ['cuadrado = rectángulo y rombo'] },
      ],
    },
    regla: {
      texto: 'Paralelogramo: dos pares de lados paralelos; sus diagonales se bisecan. Rectángulo: además, ángulos rectos. Rombo: además, lados iguales. Cuadrado: las dos cosas.',
      condicion: 'las clases se incluyen: todo cuadrado es rectángulo y rombo, y todos son paralelogramos. El nombre no depende de la posición.',
      voz: 'Nombra por las propiedades, no por cómo está apoyada la figura.',
    },
    ahoraTu: {
      voz: 'Lee las condiciones y decide qué nombre ganan.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const x = r.ent(10, 25), a1 = r.ent(2, 4), b1 = r.ent(5, 30), A = a1 * x + b1, B = 180 - A;
          if (B <= 10) return this.generar(s + 2);
          const a2 = r.ent(1, 3), b2 = B - a2 * x;
          const ex = (a, b) => `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}°`;
          return {
            pregunta: [`En el paralelogramo ABCD, ∠A = ${ex(a1, b1)} y ∠B = ${ex(a2, b2)}. ¿Cuánto mide ∠C?`],
            dibujo: { datos: para(Math.round(A / 15) * 15 || 60, 3, { sinAng: true, alt: `Paralelogramo ABCD con ∠A = ${ex(a1, b1)} y ∠B = ${ex(a2, b2)}` }), estado: {} },
            opciones: opciones(A, [
              { id: 'b', valor: B, error: 'GE-POL5', siFuera: `${B}° es ∠B. ∠C es opuesto a ∠A y mide lo mismo que él.` },
              { id: 'x', valor: x, error: 'GE-POL5', siFuera: `${x} es el valor de x; falta reemplazarlo en ∠A.` },
              { id: 'recto', valor: 90, error: 'GE-POL5', siFuera: 'Cada ángulo mediría 90° solo en un rectángulo; aquí A y B suman 180° sin ser iguales.' },
            ], gr),
            solucion: { texto: 'A y B son consecutivos: suman 180°. C es opuesto a A.', ecuacion: [`${ex(a1, b1)} + ${ex(a2, b2)} = 180° → x = ${x} → ∠C = ${A}°`] },
          };
        }
        const casos = [['iguales', 'perpendiculares', 'cuadrado'], ['iguales', 'no perpendiculares', 'rectángulo'], ['distintas', 'perpendiculares', 'rombo'], ['distintas', 'no perpendiculares', 'paralelogramo']];
        const [c1, c2, bien] = casos[r.ent(0, 3)], lado = r.ent(4, 12);
        const motivo = { cuadrado: 'diagonales iguales y perpendiculares', 'rectángulo': 'diagonales iguales, sin ser perpendiculares', rombo: 'diagonales perpendiculares y distintas', paralelogramo: 'diagonales distintas y no perpendiculares' };
        return {
          pregunta: [`Un paralelogramo de lado mayor ${lado} cm tiene diagonales ${c1} y ${c2}. ¿Cuál es el nombre más preciso para él?`],
          opciones: [{ id: 'c', texto: bien, correcta: true }].concat(['cuadrado', 'rectángulo', 'rombo', 'paralelogramo'].filter(x => x !== bien).map(x => ({ id: x.normalize('NFD').replace(/[̀-ͯ]/g, ''), texto: x, error: 'GE10', siFuera: `Sería ${x} si tuviera ${motivo[x]}.` }))),
          solucion: { texto: 'Diagonales iguales: rectángulo. Perpendiculares: rombo. Ambas: cuadrado.', ecuacion: [bien] },
        };
      },
    },
  };

  // ---------- Idea 4: trapecios ----------
  // Cambia: la base menor b y su posición · Permanece: la base mayor B = 10 · Progresa: la mediana (B + b)/2 ·
  // Se reserva: el segmento entre los puntos medios de las diagonales · Debe verse: dos bases medias, una de cada triángulo.
  const trap = (b, d, o = {}) => {
    const A = [0, 0], B = [10, 0], D = [d, 4], C = [d + b, 4];
    const M = U.medio(A, D), N = U.medio(B, C), P = U.medio(A, C), Q = U.medio(B, D);
    const k = o.pasos || {};
    const pts = [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -120 }, { id: 'B', x: 10, y: 0, rotulo: 'B', lado: -60 }, { id: 'C', x: C[0], y: 4, rotulo: 'C', lado: 60 }, { id: 'D', x: d, y: 4, rotulo: 'D', lado: 120 },
      { id: 'M', x: M[0], y: 2, rotulo: 'M', lado: 180 }, { id: 'N', x: N[0], y: 2, rotulo: 'N', lado: 0 }];
    if (o.diag) pts.push({ id: 'P', x: P[0], y: 2, rotulo: 'P', color: 'h', lado: 110, desde: k.pq || 0 }, { id: 'Q', x: Q[0], y: 2, rotulo: 'Q', color: 'h', lado: 70, desde: k.pq || 0 });
    return {
      alt: o.alt || `Trapecio de bases 10 y ${b}: la mediana MN mide ${f((10 + b) / 2)}${o.diag ? ` y el segmento PQ entre los puntos medios de las diagonales, ${f((10 - b) / 2)}` : ''}`,
      vista: { x: [-0.8, 10.8], y: [-0.8, 4.8] },
      puntos: pts,
      regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'i', opacidad: 0.08 }],
      segmentos: [{ de: 'A', a: 'B', color: 'd', grosor: 'variable', texto: o.B || 'B = 10', paralela: 1 }, { de: 'D', a: 'C', color: 'i', grosor: 'variable', texto: o.b || `b = ${f(b)}`, paralela: 1 },
        { de: 'B', a: 'C' }, { de: 'A', a: 'D' }, { de: 'A', a: 'M', marcas: 1 }, { de: 'M', a: 'D', marcas: 1 }, { de: 'B', a: 'N', marcas: 2 }, { de: 'N', a: 'C', marcas: 2 },
        ...(o.diag ? [{ de: 'A', a: 'C', grosor: 'fino', desde: k.diag || 0 }, { de: 'B', a: 'D', grosor: 'fino', desde: k.diag || 0 }] : []),
        ...(o.sinMN ? [] : [{ de: 'M', a: 'N', color: 'o', grosor: o.diag ? 'fino' : 'variable', texto: o.diag ? undefined : `${f((10 + b) / 2)}`, desde: k.mn || 0 }]),
        ...(o.diag && k.mp !== undefined ? [{ de: 'M', a: 'P', color: 'i', grosor: 'variable', texto: `${f(b / 2)}`, desde: k.mp }, { de: 'M', a: 'Q', color: 'd', grosor: 'variable', desde: k.mq, lado: -1, texto: '5' }] : []),
        ...(o.diag ? [{ de: 'P', a: 'Q', color: 'h', grosor: 'variable', texto: o.sinPQ ? undefined : `${f((10 - b) / 2)}`, desde: k.pq || 0 }] : [])],
    };
  };
  const trapecios = {
    id: 'trapecios',
    titulo: 'La mediana del trapecio',
    temas: ['Trapecios'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La base mayor mide 10. Cambia la base menor b y córrela. M y N son puntos medios de los lados no paralelos.',
      voz: 'Corre la base menor. Comprueba de qué depende MN.',
      controles: [
        { id: 'b', etiqueta: 'b', min: 2, max: 8, paso: 1, inicio: 4, unidad: '', decimales: 0, color: 'c-i' },
        { id: 'd', etiqueta: 'b corrida', min: 0, max: 2, paso: 1, inicio: 1, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: trap(v.b, v.d * (10 - v.b) / 2), estado: {} }),
      lectura: v => [{ v: 'c-o', t: 'MN' }, ` = ${f((10 + v.b) / 2)} · `, { frac: [['10 + ', { v: 'c-i', t: `${v.b}` }], '2'] }, ` = ${f((10 + v.b) / 2)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Con B = 10 y b = 4, P y Q son los puntos medios de las diagonales AC y BD. Los dos caen sobre MN. ¿Cuánto mide PQ?',
      voz: 'Piensa qué triángulo tiene a P como punto medio.',
      opciones: [
        { id: 'c', texto: '3', correcta: true },
        { id: 'mediana', texto: '7', error: 'GE-TRP1', siFuera: '7 es la mediana MN completa. PQ es solo su tramo central.' },
        { id: 'sin-mitad', texto: '6', error: 'GE-TRP2', siFuera: 'Restar las bases va bien; falta la mitad, porque cada tramo es una base media.' },
        { id: 'b2', texto: '2', error: 'GE-TRP2', siFuera: '2 es la mitad de b: mide MP, uno de los tramos que sobran.' },
      ],
      dibujo: { datos: trap(4, 3, { diag: true, sinPQ: true, alt: 'Trapecio de bases 10 y 4 con sus diagonales; P y Q son sus puntos medios' }), estado: {} },
      revelar: { datos: trap(4, 3, { diag: true }), estado: {} },
      coincide: 'Coincide: PQ = (10 − 4)/2 = 3.',
    },
    mira: {
      datos: trap(4, 3, { diag: true, pasos: { diag: 0, mp: 1, mq: 2, pq: 3, mn: 4 }, alt: 'MP es base media del triángulo ACD y MQ lo es del ABD: PQ es su diferencia' }),
      voz: 'Dos triángulos, dos bases medias. Resta.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En el triángulo ACD, MP es base media: mitad de b.', ecuacion: ['MP = ', { frac: [{ v: 'c-i', t: 'b' }, '2'] }, ' = 2'] },
        { estado: { corte: 2 }, texto: 'En el triángulo ABD, MQ es base media: mitad de B.', ecuacion: ['MQ = ', { frac: [{ v: 'c-d', t: 'B' }, '2'] }, ' = 5'] },
        { estado: { corte: 3 }, texto: 'PQ es lo que va de P a Q.', ecuacion: [{ v: 'c-h', t: 'PQ' }, ' = ', { frac: [[{ v: 'c-d', t: 'B' }, ' − ', { v: 'c-i', t: 'b' }], '2'] }, ' = 3'] },
        { estado: { corte: 4 }, texto: 'Y la mediana completa suma las dos mitades.', ecuacion: [{ v: 'c-o', t: 'MN' }, ' = ', { frac: [[{ v: 'c-d', t: 'B' }, ' + ', { v: 'c-i', t: 'b' }], '2'] }, ' = 7'] },
      ],
    },
    regla: {
      texto: 'La mediana de un trapecio es paralela a las bases y mide su semisuma. El tramo entre los puntos medios de las diagonales mide su semidiferencia.',
      ecuacion: [{ v: 'c-o', t: 'MN' }, ' = ', { frac: [[{ v: 'c-d', t: 'B' }, ' + ', { v: 'c-i', t: 'b' }], '2'] }, '   ·   ', { v: 'c-h', t: 'PQ' }, ' = ', { frac: [[{ v: 'c-d', t: 'B' }, ' − ', { v: 'c-i', t: 'b' }], '2'] }],
      condicion: 'el trapecio tiene exactamente un par de lados paralelos (las bases) y M, N son puntos medios de los otros dos.',
      voz: 'Todo sale de la base media del triángulo.',
    },
    ahoraTu: {
      voz: 'Identifica bases, mediana y tramo central antes de operar.',
      generar(s) {
        const r = azar(s), B = 2 * r.ent(5, 15), b = 2 * r.ent(1, B / 2 - 1), tipo = s % 3;
        const MN = { v: 'c-o', t: 'MN' }, PQ = { v: 'c-h', t: 'PQ' };
        if (tipo === 0) return {
          pregunta: [`Un trapecio tiene bases ${B} y ${b}. ¿Cuánto mide su mediana `, MN, '?'],
          opciones: opciones((B + b) / 2, [
            { id: 'pq', valor: (B - b) / 2, error: 'GE-TRP1', siFuera: 'Esa es la semidiferencia: mide PQ, no la mediana.' },
            { id: 'suma', valor: B + b, error: 'GE-TRP2', siFuera: 'Sumar las bases va bien; la mediana es la mitad.' },
            { id: 'B2', valor: B / 2, error: 'GE-TRP2', siFuera: 'Eso usa solo la base mayor. La mediana promedia las dos.' },
          ], x => f(x, 1)),
          solucion: { texto: 'La mediana es la semisuma de las bases.', ecuacion: [MN, ` = (${B} + ${b}) ÷ 2 = ${(B + b) / 2}`] },
        };
        if (tipo === 1) return {
          pregunta: [`Un trapecio tiene bases ${B} y ${b}. ¿Cuánto mide el segmento `, PQ, ' que une los puntos medios de sus diagonales?'],
          opciones: opciones((B - b) / 2, [
            { id: 'mn', valor: (B + b) / 2, error: 'GE-TRP1', siFuera: 'Esa es la mediana completa; PQ es su tramo central.' },
            { id: 'resta', valor: B - b, error: 'GE-TRP2', siFuera: 'Restar las bases va bien; falta la mitad.' },
            { id: 'b2', valor: b / 2, error: 'GE-TRP2', siFuera: 'Esa es la mitad de b: mide MP, no PQ.' },
          ], x => f(x, 1)),
          solucion: { texto: 'PQ es la semidiferencia de las bases.', ecuacion: [PQ, ` = (${B} − ${b}) ÷ 2 = ${(B - b) / 2}`] },
        };
        const m = (B + b) / 2;
        return {
          pregunta: ['La mediana de un trapecio mide ', MN, ` = ${m} y su base mayor, ${B}. ¿Cuánto mide la base menor?`],
          opciones: opciones(b, [
            { id: 'resta', valor: B - m, error: 'GE-TRP2', siFuera: `Restar ${m} de ${B} olvida que la mediana es la mitad de la suma.` },
            { id: 'mitad', valor: m / 2, error: 'GE-TRP2', siFuera: 'La mediana no es el doble de la base menor; es la semisuma.' },
            { id: 'suma', valor: 2 * m, error: 'GE-TRP2', siFuera: `${2 * m} es la suma de las dos bases.` },
          ], x => f(x, 1)),
          solucion: { texto: 'Las dos bases suman el doble de la mediana.', ecuacion: [`b = 2 · ${m} − ${B} = ${b}`] },
        };
      },
    },
  };

  // ---------- Idea 5: trapezoides y el paralelogramo de los puntos medios ----------
  // Cambia: el vértice D del cuadrilátero · Permanece: A, B y C · Progresa: el cuadrilátero de puntos medios ·
  // Se reserva: su perímetro = suma de diagonales · Debe verse: cada lado es base media de un triángulo de diagonal.
  const varig = (dx, dy, o = {}) => {
    const A = [0, 0], B = [8, -0.6], C = [7, 4.6], D = [dx, dy];
    const M = [A, B, C, D].map((p, k, l) => U.medio(p, l[(k + 1) % 4]));
    const k = o.pasos || {};
    const d1 = U.dist(A, C), d2 = U.dist(B, D);
    return {
      alt: o.alt || `Trapezoide ABCD: los puntos medios de sus lados forman un paralelogramo de perímetro ${f(d1 + d2)}, la suma de las diagonales`,
      vista: { x: [-0.8, 8.8], y: [-1.4, 6.6] },
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -135 }, { id: 'B', x: 8, y: -0.6, rotulo: 'B', lado: -45 }, { id: 'C', x: 7, y: 4.6, rotulo: 'C', lado: 45 }, { id: 'D', x: dx, y: dy, rotulo: 'D', lado: 135, color: 'o' },
        ...M.map((p, i) => ({ id: 'M' + i, x: p[0], y: p[1], rotulo: o.letras ? 'MNPQ'[i] : undefined }))],
      regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'i', opacidad: 0.06 }, { puntos: ['M0', 'M1', 'M2', 'M3'], color: 'o', opacidad: 0.16, desde: k.par || 0 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'D' }, { de: 'D', a: 'A' },
        ...(o.diag ? [{ de: 'A', a: 'C', color: 'd', grosor: 'fino', texto: o.d1, desde: k.d1 || 0 }, { de: 'B', a: 'D', color: 'i', grosor: 'fino', texto: o.d2, desde: k.d2 || 0 }] : []),
        { de: 'M0', a: 'M1', color: o.diag ? 'd' : 'o', paralela: 1, desde: k.par || 0 }, { de: 'M2', a: 'M3', color: o.diag ? 'd' : 'o', paralela: 1, desde: k.par2 || k.par || 0 },
        { de: 'M1', a: 'M2', color: o.diag ? 'i' : 'o', paralela: 2, desde: k.par3 || k.par || 0 }, { de: 'M3', a: 'M0', color: o.diag ? 'i' : 'o', paralela: 2, desde: k.par3 || k.par || 0 }],
    };
  };
  const trapezoides = {
    id: 'trapezoides',
    titulo: 'Puntos medios de cualquier cuadrilátero',
    temas: ['Trapezoides'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'ABCD es un trapezoide: ningún par de lados paralelos. Mueve D y mira la figura que forman los puntos medios de sus lados.',
      voz: 'Deforma el cuadrilátero. Comprueba qué forma permanece adentro.',
      controles: [
        { id: 'dx', etiqueta: 'D a lo ancho', min: 0, max: 4, paso: 1, inicio: 1, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'dy', etiqueta: 'D a lo alto', min: 3, max: 6, paso: 1, inicio: 5, unidad: '', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: varig(v.dx, v.dy), estado: {} }),
      lectura: v => ['adentro: un paralelogramo · ángulos de ABCD: 360°'],
      minimo: 4,
    },
    predice: {
      pregunta: 'Las diagonales de un trapezoide miden 10 y 14. ¿Cuál es el perímetro del paralelogramo que forman los puntos medios de sus lados?',
      voz: 'Busca triángulos que tengan una diagonal como base.',
      opciones: [
        { id: 'c', texto: '24', correcta: true },
        { id: 'mitad', texto: '12', error: 'GE-VAR1', siFuera: 'Cada lado sí es la mitad de una diagonal, pero hay dos lados por cada diagonal.' },
        { id: 'doble', texto: '48', error: 'GE-VAR1', siFuera: '48 sería cierto si cada lado midiera una diagonal entera. Es una base media.' },
        { id: 'lados', texto: 'Depende de los lados', error: 'GE-VAR2', siFuera: 'Los lados del trapezoide cambian su forma; el perímetro adentro solo depende de las diagonales.' },
      ],
      dibujo: { datos: varig(1, 5, { letras: true }), estado: {} },
      revelar: { datos: varig(1, 5, { letras: true, diag: true, d1: 'AC', d2: 'BD' }), estado: {} },
      coincide: 'Coincide: dos lados de 5 y dos de 7. Perímetro: 10 + 14 = 24.',
    },
    mira: {
      datos: varig(1, 5, { letras: true, diag: true, pasos: { d1: 1, par: 1, par2: 2, d2: 3, par3: 3 } }),
      voz: 'Cada diagonal parte el cuadrilátero en dos triángulos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En el triángulo ABC, MN es base media: paralela a AC y mitad.', ecuacion: ['MN = ', { frac: ['AC', '2'] }] },
        { estado: { corte: 2 }, texto: 'En el triángulo ACD, PQ también es base media de AC.', ecuacion: ['PQ = ', { frac: ['AC', '2'] }, ' · PQ ∥ MN'] },
        { estado: { corte: 3 }, texto: 'Con la diagonal BD pasa lo mismo: NP = QM = BD/2.', ecuacion: ['NP = QM = ', { frac: ['BD', '2'] }] },
        { estado: { corte: 3 }, texto: 'Lados opuestos paralelos: paralelogramo. Su perímetro, AC + BD.', ecuacion: ['perímetro = AC + BD'] },
      ],
    },
    regla: {
      texto: 'En cualquier cuadrilátero, los puntos medios de los lados forman un paralelogramo cuyo perímetro es la suma de las diagonales. Sus ángulos interiores suman 360°.',
      ecuacion: ['perímetro = AC + BD   ·   A + B + C + D = 360°'],
      condicion: 'el cuadrilátero es trapezoide, trapecio o paralelogramo: solo se usa la base media de los triángulos de cada diagonal.',
      voz: 'Una diagonal convierte el problema en dos triángulos conocidos.',
    },
    ahoraTu: {
      voz: 'Ubica qué triángulo y qué diagonal usa cada lado.',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const p = 2 * r.ent(3, 12), q = 2 * r.ent(3, 12);
          return {
            pregunta: [`Las diagonales de un cuadrilátero miden ${p} y ${q}. ¿Cuál es el perímetro del paralelogramo de los puntos medios?`],
            opciones: opciones(p + q, [
              { id: 'mitad', valor: (p + q) / 2, error: 'GE-VAR1', siFuera: 'Cada lado es la mitad de una diagonal, pero son dos lados por diagonal.' },
              { id: 'doble', valor: 2 * (p + q), error: 'GE-VAR1', siFuera: 'Eso supone lados iguales a las diagonales; son bases medias.' },
              { id: 'producto', valor: p * q / 2, error: 'GE-VAR2', siFuera: 'pq/2 se parece al área de un rombo; aquí se pide un perímetro.' },
            ], x => f(x, 1)),
            solucion: { texto: 'Dos lados de AC/2 y dos de BD/2.', ecuacion: [`2 · ${p / 2} + 2 · ${q / 2} = ${p + q}`] },
          };
        }
        const a = 5 * r.ent(10, 22), b = 5 * r.ent(10, 22), c = 5 * r.ent(10, 22), d = 360 - a - b - c;
        if (d <= 20 || d >= 180) return this.generar(s + 2);
        return {
          pregunta: [`Un trapezoide tiene ángulos de ${a}°, ${b}° y ${c}°. ¿Cuánto mide el cuarto ángulo?`],
          opciones: opciones(d, [
            { id: '180', valor: 180 - (a + b + c) % 180, error: 'GE-POL1', siFuera: 'Restar de 180° vale para triángulos; un cuadrilátero suma 360°.' },
            { id: '540', valor: 540 - a - b - c, error: 'GE23', siFuera: '540° es la suma de un pentágono. Con 4 lados: 2 triángulos, 360°.' },
            { id: 'prom', valor: (a + b + c) / 3, error: 'GE-POL3', siFuera: 'El promedio sería cierto si los cuatro ángulos fueran iguales.' },
          ], gr),
          solucion: { texto: 'Un cuadrilátero se parte en 2 triángulos: 360°.', ecuacion: [`360° − ${a}° − ${b}° − ${c}° = ${d}°`] },
        };
      },
    },
  };

  return {
    unidad: 'geometria.poligonos-y-cuadrilateros',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'En la proposición I.34 de los Elementos, una diagonal parte el paralelogramo en dos triángulos congruentes: así se justifica que sus lados opuestos son iguales. La misma idea de descomponer sirve para polígonos más grandes. Las clasificaciones escolares de hoy no coinciden palabra por palabra con las antiguas: conviene declarar las definiciones antes de comparar.',
      pregunta: '¿Qué línea convierte una figura nueva en triángulos conocidos?',
      fuente: { titulo: 'Euclides, Elementos I.34 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/propI34.html' },
    },
    ideas: [sumaIdea, diagonales, paralelogramos, trapecios, trapezoides],
  };
});
