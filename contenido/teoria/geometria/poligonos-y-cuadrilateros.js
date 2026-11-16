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
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura; aPlano la vuelve coordenadas del
  // problema y el lector ajusta cada valor al paso y al rango de su control.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, q) => G.aPlano(datos, q);
  const sep = '   ·   ';
  // Polígono convexo de n lados, irregular a propósito (no prototípico), siempre igual para el mismo n.
  const vertices = n => Array.from({ length: n }, (_, k) => U.polar([0, 0], 3 + 0.3 * Math.cos(k * 1.7 + n), 100 + 360 * k / n + 6 * Math.sin(k * 2.3 + n)));
  // o.regular: los n vértices sobre la misma circunferencia, a la misma distancia (para los problemas de polígono regular).
  const regulares = n => Array.from({ length: n }, (_, k) => U.polar([0, 0], 3, 100 + 360 * k / n));
  const poli = (n, o = {}) => {
    const V = o.regular ? regulares(n) : vertices(n);
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
    // todas: el corte desde el que aparecen; todas: 0 las muestra desde el inicio (antes, el 0 no dibujaba ninguna).
    if (o.todas !== undefined) for (let i = 0; i < n; i++) for (let j = i + 2; j < n; j++) if (!(i === 0 && j === n - 1)) seg.push({ de: LETRAS[i], a: LETRAS[j], color: 'i', grosor: 'fino', desde: o.todas });
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

  // Las cuentas de «Así se resuelve» en las ideas 1 y 2 (las mismas de «Ahora tú»).
  const sumaInterior = n => (n - 2) * 180;
  const numDiagonales = n => n * (n - 3) / 2;

  // ---------- Idea 1: suma de ángulos interiores y exteriores ----------
  // Cambia: el número de lados n · Permanece: la triangulación desde A · Progresa: los triángulos (n − 2) ·
  // Se reserva: el giro completo de los exteriores · Debe verse: cada triángulo aporta 180°; los exteriores, una vuelta.
  // Sin arrastre: n cuenta lados, y no hay un objeto de la figura que al moverse agregue un lado; queda con − y +.
  const sumaIdea = {
    id: 'suma-de-angulos',
    titulo: 'Triángulos dentro del polígono',
    temas: ['Suma de ángulos internos y externos'],
    pieza: 'geo-figura',
    // Lee (fase 2): vocabulario y qué mirar. No dice cuánto suman los exteriores (la pregunta de «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Polígonos en la calle', texto: 'La señal de «Pare» tiene ocho lados: es un octógono. Una figura cerrada de lados rectos es un polígono, y se nombra por sus lados: el pentágono tiene 5; el hexágono, 6; el octógono, 8.' },
        { titulo: 'Rincón y giro', texto: 'Cada vértice tiene un ángulo interior: el rincón de adentro, entre dos lados. Si caminas por el borde, en cada vértice giras para seguir por el lado siguiente: ese giro es el ángulo exterior.' },
        { titulo: 'Qué mirar al jugar', texto: ['Desde el vértice A, unas diagonales parten el polígono en triángulos. Cambia el número de lados ', n_, ' y cuenta los triángulos cada vez. Compara cuántos salen con ', n_, '.'] },
      ],
    },
    juega: {
      consigna: 'Cambia el número de lados. Desde el vértice A, las diagonales parten el polígono en triángulos. Cuenta los triángulos.',
      voz: 'Cambia n y cuenta triángulos. Compara con n.',
      controles: [{ id: 'n', etiqueta: 'n', min: 3, max: 10, paso: 1, inicio: 5, unidad: 'lados', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: poli(v.n, { triangulos: true }), estado: {} }),
      lectura: v => [`${v.n - 2} triángulos`, sep, `suma interior = ${(v.n - 2) * 180}°`],
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
      ecuacion: [{ sub: ['S', 'i'] }, ' = ', { llave: ['(', n_, ' − 2)'], nota: 'triángulos', color: 'c-o' }, ' · 180°', sep, { sub: ['S', 'e'] }, ' = 360°'],
      condicion: 'el polígono es convexo y se toma un solo ángulo exterior en cada vértice.',
      voz: 'Los triángulos explican el número; no hace falta memorizarlo.',
    },
    // Así se resuelve (fase 2): los tres casos de «Ahora tú» (suma, exterior del regular, número de lados) con otras
    // semillas y las mismas cuentas. n llega hasta 10 para que el polígono se pueda dibujar (vértices A a J).
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = s % 3, Si = { sub: ['S', 'i'] }, Se = { sub: ['S', 'e'] };
        const regla = { tipo: 'regla', texto: 'Desde un vértice, las diagonales parten el polígono en triángulos. Cada triángulo aporta 180°, y salen dos triángulos menos que lados.',
          ecuacion: [Si, ' = (', n_, ' − 2) · 180°'] };
        if (tipo === 0) {
          const n = r.ent(5, 10), S = sumaInterior(n), prom = S / n;
          return {
            enunciado: ['¿Cuánto suman los ángulos interiores de un polígono convexo de ', n_, ` = ${n} lados?`],
            dibujo: { datos: poli(n, { alt: `Polígono convexo de ${n} lados` }), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden la suma de todos los ángulos de adentro, no uno solo.' },
              { tipo: 'datos', texto: ['El polígono es convexo y tiene ', n_, ` = ${n} lados.`] },
              regla,
              { tipo: 'cuentas', texto: `Desde A salen ${n - 2} triángulos, de 180° cada uno.`, ecuacion: [Si, ` = (${n} − 2) · 180° = ${n - 2} · 180° = ${S}°`],
                dibujo: { datos: poli(n, { triangulos: true }), estado: {} } },
              { tipo: 'sentido', texto: `Comprueba: ${S}° ÷ ${n} ${Number.isInteger(prom) ? '=' : '≈'} ${gr(prom)} por ángulo, en promedio. Es menos de 180°, como en todo polígono convexo.` },
            ],
            respuesta: [Si, ` = ${S}°`],
          };
        }
        if (tipo === 1) {
          const n = r.de([5, 6, 8, 9, 10]), e = 360 / n;
          return {
            enunciado: ['Un polígono regular tiene ', n_, ` = ${n} lados. ¿Cuánto mide cada ángulo exterior?`],
            dibujo: { datos: poli(n, { regular: true, alt: `Polígono regular de ${n} lados` }), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden un solo ángulo exterior: lo que se gira en un vértice para seguir por el lado siguiente.' },
              { tipo: 'datos', texto: ['Es regular: sus ', n_, ` = ${n} ángulos exteriores miden lo mismo.`] },
              { tipo: 'regla', texto: 'Al recorrer todo el borde y volver al inicio, los giros suman una vuelta entera, tenga los lados que tenga.', ecuacion: [Se, ' = 360°'] },
              { tipo: 'cuentas', texto: `Reparto la vuelta en ${n} giros iguales.`, ecuacion: [`360° ÷ ${n} = ${gr(e)}`],
                dibujo: { datos: poli(n, { regular: true, exteriores: true, alt: `Polígono regular de ${n} lados con su ángulo exterior en cada vértice` }), estado: {} } },
              { tipo: 'sentido', texto: `Comprueba: cada interior mide 180° − ${gr(e)} = ${gr(180 - e)}, y ${n} · ${gr(180 - e)} = ${sumaInterior(n)}°, la suma de ${n - 2} triángulos.` },
            ],
            respuesta: ['cada exterior mide ', gr(e)],
          };
        }
        const n = r.ent(5, 10), S = sumaInterior(n);
        return {
          enunciado: [`Los ángulos interiores de un polígono convexo suman ${S}°. ¿Cuántos lados tiene?`],
          pasos: [
            { tipo: 'pide', texto: ['Piden el número de lados ', n_, '.'] },
            { tipo: 'datos', texto: `Los ángulos interiores suman ${S}°.` },
            regla,
            { tipo: 'cuentas', texto: 'Divido entre 180° para contar los triángulos y sumo 2, porque hay dos triángulos menos que lados.', ecuacion: [`${S}° ÷ 180° = ${n - 2}`, '   →   ', n_, ` = ${n - 2} + 2 = ${n}`] },
            { tipo: 'sentido', texto: `Comprueba en el dibujo: ${n} lados, ${n - 2} triángulos desde A, y ${n - 2} · 180° = ${S}°.`,
              dibujo: { datos: poli(n, { triangulos: true }), estado: {} } },
          ],
          respuesta: [n_, ` = ${n} lados`],
        };
      },
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
    // Lee (fase 2): qué es una diagonal y por qué no va a los vecinos. No dice cómo se corrige la repetición.
    lee: {
      tarjetas: [
        { titulo: 'De punta a punta', texto: 'Una diagonal une dos vértices que no son vecinos. Los dos palitos que cruzan una cometa van de punta a punta: son las diagonales de esa figura de cuatro lados.' },
        { titulo: 'Un lado no es diagonal', texto: 'El segmento entre dos vértices vecinos ya es un lado. Por eso, desde un vértice no sale diagonal hacia él mismo ni hacia sus dos vecinos.' },
        { titulo: 'Qué mirar al jugar', texto: ['Elige ', n_, ' y cuenta las diagonales que salen del vértice marcado. Después pasa a otro vértice: ¿salen las mismas? Prueba con varios valores de ', n_, '.'] },
      ],
    },
    juega: {
      consigna: 'Elige n y un vértice. Mira las diagonales que salen de ese vértice: no van a sí mismo ni a sus dos vecinos.',
      voz: 'Cuenta desde un vértice. Prueba otro vértice: ¿cambia?',
      controles: [
        { id: 'n', etiqueta: 'n', min: 4, max: 10, paso: 1, inicio: 6, unidad: 'lados', decimales: 0, color: 'c-o' },
        { id: 'v', etiqueta: 'Vértice', min: 0, max: 3, paso: 1, inicio: 0, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: poli(v.n, { diagDe: v.v }), estado: {} }),
      // Se agarra el vértice de partida y se lleva a otro (A, B, C o D): la manija salta al vértice más cercano.
      arrastres: [{ id: 'vertice-partida', etiqueta: 'vértice de partida', color: 'c-o',
        donde: v => enPantalla(poli(v.n, { diagDe: v.v }), vertices(v.n)[v.v]),
        mover: (q, v) => { const z = alPlano(poli(v.n, { diagDe: v.v }), q), V = vertices(v.n).slice(0, 4); let k = 0; V.forEach((p, i) => { if (U.dist(p, z) < U.dist(V[k], z)) k = i; }); return { v: k }; } }],
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
      ecuacion: ['D = ', { frac: [{ llave: [n_, '(', n_, ' − 3)'], nota: 'desde cada vértice', color: 'c-o', arriba: true }, '2'] }],
      condicion: 'se excluyen el propio vértice y sus dos vecinos, porque esos segmentos son lados.',
      voz: 'Dos extremos por diagonal: por eso se divide entre 2.',
    },
    // Así se resuelve (fase 2): los dos casos de «Ahora tú» (diagonales de n lados, lados con D diagonales), con otras
    // semillas y la misma cuenta n(n − 3)/2. n llega hasta 10 para que el polígono se pueda dibujar.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), n = r.ent(5, 10), D = numDiagonales(n);
        const regla = { tipo: 'regla', texto: 'Cuento las diagonales que salen de cada vértice. Así, cada diagonal aparece dos veces, una por cada extremo: divido entre 2.',
          ecuacion: ['D = ', { frac: [[n_, '(', n_, ' − 3)'], '2'] }] };
        if (s % 2) return {
          enunciado: [`Un polígono convexo tiene ${D} diagonales. ¿Cuántos lados tiene?`],
          pasos: [
            { tipo: 'pide', texto: ['Piden el número de lados ', n_, '.'] },
            { tipo: 'datos', texto: `El polígono tiene ${D} diagonales en total.` },
            regla,
            { tipo: 'cuentas', texto: `Busco dos números que se diferencien en 3 y que, multiplicados, den el doble del dato: ${2 * D}.`,
              ecuacion: [n_, '(', n_, ` − 3) = 2 · ${D} = ${2 * D} = ${n} · ${n - 3}`, '   →   ', n_, ` = ${n}`] },
            { tipo: 'sentido', texto: `Comprueba en el dibujo: desde A salen ${n - 3} diagonales, y ${n} · ${n - 3} ÷ 2 = ${D}.`,
              dibujo: { datos: poli(n, { diagDe: 0 }), estado: {} } },
          ],
          respuesta: [n_, ` = ${n} lados`],
        };
        return {
          enunciado: ['¿Cuántas diagonales tiene un polígono convexo de ', n_, ` = ${n} lados?`],
          dibujo: { datos: poli(n, { alt: `Polígono convexo de ${n} lados` }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden todas las diagonales del polígono, cada una contada una sola vez.' },
            { tipo: 'datos', texto: [n_, ` = ${n} vértices. Desde A no sale diagonal hacia A ni hacia sus dos vecinos.`], ecuacion: ['desde A: ', n_, ` − 3 = ${n - 3}`],
              dibujo: { datos: poli(n, { diagDe: 0 }), estado: {} } },
            regla,
            { tipo: 'cuentas', texto: `${n} vértices por ${n - 3} diagonales dan ${n * (n - 3)} extremos. Cada diagonal tiene dos: la mitad.`, ecuacion: [`D = ${n} · ${n - 3} ÷ 2 = ${D}`],
              dibujo: { datos: poli(n, { todas: 0, alt: `Polígono convexo de ${n} lados con sus ${D} diagonales` }), estado: {} } },
            { tipo: 'sentido', texto: `Comprueba: ${n} vértices forman ${n * (n - 1) / 2} parejas. Son ${n} lados más ${D} diagonales: ${n} + ${D} = ${n + D}.` },
          ],
          respuesta: `D = ${D} diagonales`,
        };
      },
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
  // D a partir del punto de la pantalla en para(t, b) sin giro: D − (2,5; b/2) = b(cos t, sen t − 1/2). Con w = z + (2,5; 0),
  // b sale de (3/4)b² − w_y·b − |w|² = 0 y t, de atan2. Así la manija cae exacta donde dicen t y b.
  const desdeD = z => {
    const w = [z[0] + 2.5, z[1]], b = (w[1] + Math.sqrt(w[1] * w[1] + 3 * (w[0] * w[0] + w[1] * w[1]))) / 1.5;
    return { b, t: U.grados(Math.atan2(w[1] + b / 2, w[0])) };
  };
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
    // Lee (fase 2): paralelas y nombres por condiciones. No dice qué nombres gana un cuadrado (la pregunta de «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Lados paralelos', texto: 'Dos lados son paralelos si, aunque los prolongues, nunca se cruzan, como los dos rieles del tren que llega a Juliaca. Un paralelogramo tiene dos pares de lados opuestos paralelos.' },
        { titulo: 'Un nombre, una lista', texto: 'En geometría, cada nombre trae una lista de condiciones sobre los lados, los ángulos o las diagonales. La figura que cumple toda la lista gana ese nombre.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia el ángulo A y el lado b. La lectura muestra el nombre de la figura: fíjate en qué valores cambia y qué cambió en la figura en ese momento.' },
      ],
    },
    juega: {
      consigna: 'Los lados opuestos siempre son paralelos. Cambia el ángulo A y el lado b, y mira qué nombre recibe la figura.',
      voz: 'Deforma la figura. Revisa qué condición gana o pierde.',
      controles: [
        { id: 't', etiqueta: '∠A', min: 45, max: 135, paso: 15, inicio: 60, unidad: '°', decimales: 0, color: 'c-d' },
        { id: 'b', etiqueta: 'b', min: 3, max: 6, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: para(v.t, v.b, { lados: v.b === 5, rectos: v.t === 90 }), estado: {} }),
      // Se agarra el vértice D: girarlo cambia el ángulo A y alejarlo cambia el lado b (la figura queda centrada).
      arrastres: [{ id: 'vertice-d', etiqueta: 'vértice D', color: 'c-i',
        donde: v => { const D = U.polar([0, 0], v.b, v.t); return enPantalla(para(v.t, v.b), [D[0] - 2.5, D[1] - v.b / 2]); },
        mover: (q, v) => desdeD(alPlano(para(v.t, v.b), q)) }],
      lectura: v => [`lados 5 y `, { v: 'c-i', t: `${v.b}` }, sep, nombrePar(v.t, v.b)],
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
        { estado: { corte: 0 }, texto: 'Paralelogramo: dos pares de lados paralelos.', ecuacion: ['AB ∥ DC', sep, 'AD ∥ BC'] },
        { estado: { corte: 1 }, texto: 'En todo paralelogramo, las diagonales se cortan en su punto medio.', ecuacion: ['AO = OC', sep, 'BO = OD'] },
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
    // Así se resuelve (fase 2): los dos casos de «Ahora tú» (∠C con ángulos en x, nombre por las diagonales), con otras
    // semillas y las mismas cuentas. Si ∠B queda de 10° o menos se prueba la semilla s + 2, como en «Ahora tú».
    resuelve: {
      pieza: 'geo-figura',
      generar(s) {
        if (s % 2 === 0) {
          let k = s, r, x, a1, b1, A, B;
          for (;;) { r = azar(k + 900); x = r.ent(10, 25); a1 = r.ent(2, 4); b1 = r.ent(5, 30); A = a1 * x + b1; B = 180 - A; if (B > 10) break; k += 2; }
          const a2 = r.ent(1, 3), b2 = B - a2 * x, a = a1 + a2, b = b1 + b2;
          const ex = (p, q) => `${p === 1 ? '' : p}x${q === 0 ? '' : ` ${q < 0 ? '−' : '+'} ${Math.abs(q)}`}°`;
          const fig = conAng => ({ datos: para(A, 3, { sinAng: !conAng, alt: `Paralelogramo ABCD con ∠A = ${conAng ? `${A}°` : ex(a1, b1)}` }), estado: {} });
          return {
            enunciado: [`En el paralelogramo ABCD, ∠A = ${ex(a1, b1)} y ∠B = ${ex(a2, b2)}. ¿Cuánto mide ∠C?`],
            dibujo: fig(false),
            pasos: [
              { tipo: 'pide', texto: 'Piden ∠C, el ángulo del vértice opuesto a A.' },
              { tipo: 'datos', texto: '∠A y ∠B vienen en función de x. Son vecinos: comparten el lado AB.', ecuacion: [`∠A = ${ex(a1, b1)}`, sep, `∠B = ${ex(a2, b2)}`] },
              { tipo: 'regla', texto: 'Como los lados opuestos son paralelos, dos ángulos vecinos suman 180°. Y los ángulos opuestos miden lo mismo.', ecuacion: ['∠A + ∠B = 180°', sep, '∠C = ∠A'] },
              { tipo: 'cuentas', texto: 'Sumo ∠A y ∠B, igualo a 180° y despejo x. Después reemplazo x en ∠A.',
                ecuacion: [`${ex(a, b)} = 180°   →   x = ${x}   →   ∠A = ${a1} · ${x} + ${b1} = ${A}°`], dibujo: fig(true) },
              { tipo: 'sentido', texto: `Comprueba: ∠B = ${a2} · ${x} ${b2 < 0 ? '−' : '+'} ${Math.abs(b2)} = ${B}°, y ${A}° + ${B}° = 180°. ∠C copia a ∠A.` },
            ],
            respuesta: `∠C = ${A}°`,
          };
        }
        const r = azar(s + 900);
        const casos = [['iguales', 'perpendiculares', 'cuadrado'], ['iguales', 'no perpendiculares', 'rectángulo'], ['distintas', 'perpendiculares', 'rombo'], ['distintas', 'no perpendiculares', 'paralelogramo']];
        const [c1, c2, bien] = casos[r.ent(0, 3)], lado = r.ent(4, 12);
        const iguales = c1 === 'iguales', perp = c2 === 'perpendiculares';
        // La figura dibuja los datos: diagonales con la misma marca si son iguales y el ángulo recto en O si se cruzan a 90°.
        const fig = para(iguales ? 90 : 60, perp ? 5 : 3, { giro: 15, sinAng: true, diagIguales: iguales, perp, alt: `Paralelogramo ABCD con diagonales ${c1} y ${c2}` });
        const sentido = {
          cuadrado: 'También es rectángulo y rombo, pero «cuadrado» dice más: incluye las dos condiciones a la vez.',
          'rectángulo': 'No es cuadrado: le faltan diagonales perpendiculares. Y «rectángulo» dice más que «paralelogramo».',
          rombo: 'No es cuadrado: le faltan diagonales iguales. Y «rombo» dice más que «paralelogramo».',
          paralelogramo: 'No cumple ninguna condición extra: ni ángulos rectos ni lados iguales. Queda «paralelogramo».',
        }[bien];
        return {
          enunciado: [`Un paralelogramo de lado mayor ${lado} cm tiene diagonales ${c1} y ${c2}. ¿Cuál es el nombre más preciso para él?`],
          dibujo: { datos: fig, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el nombre más preciso: el que dice más propiedades de la figura.' },
            { tipo: 'datos', texto: `Es paralelogramo, así que sus diagonales se cortan en su punto medio. Además, son ${c1} y ${c2}.` },
            { tipo: 'regla', texto: 'Diagonales iguales delatan ángulos rectos: rectángulo. Diagonales perpendiculares delatan lados iguales: rombo. Con las dos, cuadrado.' },
            { tipo: 'aplica', texto: `Diagonales ${c1}: ${iguales ? 'tiene' : 'no tiene'} ángulos rectos. Diagonales ${c2}: ${perp ? 'tiene' : 'no tiene'} cuatro lados iguales.`, ecuacion: [`${c1} y ${c2}   →   ${bien}`] },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: `Es un ${bien}.`,
        };
      },
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
  // Trapecio de bases B y b para «Así se resuelve»: el de la idea (base mayor de 10) con la menor a escala, 10b/B, y
  // centrada. Los rótulos son los del problema: B, b, la mediana (mn) y el tramo PQ (pq).
  const trapEscala = (B, b, o = {}) => {
    const bd = 10 * b / B, rb = o.b || `b = ${b}`;
    const datos = trap(bd, (10 - bd) / 2, { diag: o.diag, B: `B = ${B}`, b: rb,
      alt: `Trapecio de bases B = ${B} y ${rb}, con su mediana MN${o.mn ? ` = ${o.mn}` : ''}${o.diag ? `, sus diagonales y el tramo PQ${o.pq ? ` = ${o.pq}` : ''}` : ''}` });
    datos.segmentos = datos.segmentos.map(g => (g.de === 'M' && g.a === 'N' ? Object.assign({}, g, { texto: o.mn })
      : g.de === 'P' && g.a === 'Q' ? Object.assign({}, g, { texto: o.pq }) : g));
    return { datos, estado: {} };
  };
  const trapecios = {
    id: 'trapecios',
    titulo: 'La mediana del trapecio',
    temas: ['Trapecios'],
    pieza: 'geo-figura',
    // Lee (fase 2): bases y mediana. No dice cuánto mide PQ (la pregunta de «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Un balde de costado', texto: ['Visto de costado, un balde dibuja un trapecio: la boca y el fondo son paralelos y de distinto largo. Esos dos lados son las bases: la mayor se llama ', { v: 'c-d', t: 'B' }, ' y la menor, ', { v: 'c-i', t: 'b' }, '.'] },
        { titulo: 'La mediana', texto: ['Los lados no paralelos tienen cada uno su punto medio: M y N. El segmento ', { v: 'c-o', t: 'MN' }, ' es la mediana del trapecio y cruza la figura de un lado al otro.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Haz dos pruebas por separado. Primero corre la base menor de lado a lado, sin cambiar su largo. Después cambia su largo ', { v: 'c-i', t: 'b' }, '. Mira cuál de las dos mueve la medida de ', { v: 'c-o', t: 'MN' }, '.'] },
      ],
    },
    juega: {
      consigna: 'La base mayor mide 10. Cambia la base menor b y córrela. M y N son puntos medios de los lados no paralelos.',
      voz: 'Corre la base menor. Comprueba de qué depende MN.',
      controles: [
        { id: 'b', etiqueta: 'b', min: 2, max: 8, paso: 1, inicio: 4, unidad: '', decimales: 0, color: 'c-i' },
        { id: 'd', etiqueta: 'b corrida', min: 0, max: 2, paso: 1, inicio: 1, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: trap(v.b, v.d * (10 - v.b) / 2), estado: {} }),
      // Se agarra el centro de la base menor y se corre (izquierda, centro, derecha). Su largo b queda con − y +: una
      // segunda manija en un extremo se encimaba con esta cuando b = 2. La mesa «trapecio-libre» estira los dos extremos.
      arrastres: [{ id: 'base-menor', etiqueta: 'base menor', color: 'c-i',
        donde: v => enPantalla(trap(v.b, v.d * (10 - v.b) / 2), [v.d * (10 - v.b) / 2 + v.b / 2, 4]),
        mover: (q, v) => ({ d: (alPlano(trap(v.b, v.d * (10 - v.b) / 2), q)[0] - v.b / 2) / ((10 - v.b) / 2) }) }],
      lectura: v => [{ v: 'c-o', t: 'MN' }, ' = ', { frac: [['10 + ', { v: 'c-i', t: `${v.b}` }], '2'] }, ` = ${f((10 + v.b) / 2)}`],
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
      ecuacion: [{ v: 'c-o', t: 'MN' }, ' = ', { llave: [{ frac: [[{ v: 'c-d', t: 'B' }, ' + ', { v: 'c-i', t: 'b' }], '2'] }], nota: 'semisuma', color: 'c-o' }, sep, { v: 'c-h', t: 'PQ' }, ' = ', { llave: [{ frac: [[{ v: 'c-d', t: 'B' }, ' − ', { v: 'c-i', t: 'b' }], '2'] }], nota: 'semidiferencia', color: 'c-h' }],
      condicion: 'el trapecio tiene exactamente un par de lados paralelos (las bases) y M, N son puntos medios de los otros dos.',
      voz: 'Todo sale de la base media del triángulo.',
    },
    // Así se resuelve (fase 2): los tres casos de «Ahora tú» (mediana, tramo PQ, base menor), con otras semillas y las
    // mismas cuentas. El dibujo es el trapecio de la idea con la base menor a escala (b/B) y los rótulos del problema.
    resuelve: {
      pieza: 'geo-figura',
      generar(s) {
        const r = azar(s + 900), B = 2 * r.ent(5, 15), b = 2 * r.ent(1, B / 2 - 1), tipo = s % 3, m = (B + b) / 2, p = (B - b) / 2;
        const MN = { v: 'c-o', t: 'MN' }, PQ = { v: 'c-h', t: 'PQ' }, Bv = { v: 'c-d', t: 'B' }, bv = { v: 'c-i', t: 'b' };
        const fig = o => trapEscala(B, b, o);
        if (tipo === 0) return {
          enunciado: [`Un trapecio tiene bases ${B} y ${b}. ¿Cuánto mide su mediana `, MN, '?'],
          dibujo: fig({ mn: '?' }),
          pasos: [
            { tipo: 'pide', texto: ['Piden la mediana ', MN, ': el segmento entre los puntos medios de los lados no paralelos.'] },
            { tipo: 'datos', texto: ['Base mayor ', Bv, ` = ${B} y base menor `, bv, ` = ${b}.`] },
            { tipo: 'regla', texto: 'La mediana va entre las dos bases, a media altura: mide el promedio de las dos.', ecuacion: [MN, ' = ', { frac: [[Bv, ' + ', bv], '2'] }] },
            { tipo: 'cuentas', texto: 'Sumo las bases y saco la mitad.', ecuacion: [MN, ` = (${B} + ${b}) ÷ 2 = ${f(m)}`], dibujo: fig({ mn: f(m) }) },
            { tipo: 'sentido', texto: `Comprueba: ${f(m)} queda entre ${b} y ${B}, a la misma distancia de las dos: ${f(B - m)} de cada una.` },
          ],
          respuesta: [MN, ` = ${f(m)}`],
        };
        if (tipo === 1) return {
          enunciado: [`Un trapecio tiene bases ${B} y ${b}. ¿Cuánto mide el segmento `, PQ, ' que une los puntos medios de sus diagonales?'],
          dibujo: fig({ diag: true, pq: '?' }),
          pasos: [
            { tipo: 'pide', texto: ['Piden ', PQ, ', el tramo de la mediana que queda entre los puntos medios de las diagonales.'] },
            { tipo: 'datos', texto: ['Bases ', Bv, ` = ${B} y `, bv, ` = ${b}. P es el punto medio de AC, y Q, el de BD.`] },
            { tipo: 'regla', texto: 'Cada diagonal arma un triángulo con una base. Su base media mide la mitad de esa base, y PQ es la diferencia de las dos mitades.',
              ecuacion: [PQ, ' = ', { frac: [[Bv, ' − ', bv], '2'] }] },
            { tipo: 'cuentas', texto: 'MQ es la mitad de la base mayor y MP, la mitad de la menor. Resto.', ecuacion: [PQ, ` = MQ − MP = ${f(B / 2)} − ${f(b / 2)} = ${f(p)}`],
              dibujo: fig({ diag: true, pq: f(p) }) },
            { tipo: 'sentido', texto: ['Comprueba: ', MN, ` = MP + PQ + QN = ${f(b / 2)} + ${f(p)} + ${f(b / 2)} = ${f(m)}, la semisuma de las bases.`] },
          ],
          respuesta: [PQ, ` = ${f(p)}`],
        };
        return {
          enunciado: ['La mediana de un trapecio mide ', MN, ` = ${f(m)} y su base mayor, ${B}. ¿Cuánto mide la base menor?`],
          dibujo: fig({ mn: f(m), b: 'b = ?' }),
          pasos: [
            { tipo: 'pide', texto: ['Piden la base menor ', bv, '.'] },
            { tipo: 'datos', texto: ['La mediana ', MN, ` = ${f(m)} y la base mayor `, Bv, ` = ${B}.`] },
            { tipo: 'regla', texto: 'La mediana es la mitad de la suma de las bases. Entonces, las dos bases juntas suman el doble de la mediana.', ecuacion: [Bv, ' + ', bv, ' = 2 · ', MN] },
            { tipo: 'cuentas', texto: 'Duplico la mediana y le quito la base mayor.', ecuacion: [bv, ` = 2 · ${f(m)} − ${B} = ${f(2 * m)} − ${B} = ${b}`], dibujo: fig({ mn: f(m) }) },
            { tipo: 'sentido', texto: `Comprueba: (${B} + ${b}) ÷ 2 = ${f(m)}, la mediana del dato. Y ${b} es menor que ${B}, como toda base menor.` },
          ],
          respuesta: [bv, ` = ${b}`],
        };
      },
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
  const medios = (...V) => V.map((p, k) => U.medio(p, V[(k + 1) % 4]));
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
    // Lee (fase 2): qué es un trapezoide y cómo se arma la figura de adentro. No dice cuánto mide su perímetro.
    lee: {
      tarjetas: [
        { titulo: 'Ningún par paralelo', texto: 'Un trapezoide es un cuadrilátero sin lados paralelos. Muchas chacras del altiplano tienen esa forma: cuatro bordes rectos y ninguno paralelo a otro.' },
        { titulo: 'Cuatro puntos medios', texto: 'Marca el punto medio de cada lado y llámalos M, N, P y Q. Unidos en orden, forman otro cuadrilátero, dentro del primero.' },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve el vértice D lejos y cerca. La lectura compara los lados opuestos de la figura de adentro: fíjate si alguna vez dejan de medir lo mismo.' },
      ],
    },
    juega: {
      consigna: 'ABCD es un trapezoide: ningún par de lados paralelos. Mueve D y mira la figura que forman los puntos medios de sus lados.',
      voz: 'Deforma el cuadrilátero. Comprueba qué forma permanece adentro.',
      controles: [
        { id: 'dx', etiqueta: 'D a lo ancho', min: 0, max: 4, paso: 1, inicio: 1, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'dy', etiqueta: 'D a lo alto', min: 3, max: 6, paso: 1, inicio: 5, unidad: '', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: varig(v.dx, v.dy, { letras: true }), estado: {} }),
      // Se agarra el vértice D y se deforma el cuadrilátero: A, B y C quedan quietos.
      arrastres: [{ id: 'vertice-d', etiqueta: 'vértice D', color: 'c-o',
        donde: v => enPantalla(varig(v.dx, v.dy, { letras: true }), [v.dx, v.dy]),
        mover: (q, v) => { const z = alPlano(varig(v.dx, v.dy, { letras: true }), q); return { dx: z[0], dy: z[1] }; } }],
      lectura: v => { const M = medios([0, 0], [8, -0.6], [7, 4.6], [v.dx, v.dy]); return [`MN = PQ = ${f(U.dist(M[0], M[1]), 2)}`, sep, `NP = QM = ${f(U.dist(M[1], M[2]), 2)}`]; },
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
        { estado: { corte: 2 }, texto: 'En el triángulo ACD, PQ también es base media de AC.', ecuacion: ['PQ = ', { frac: ['AC', '2'] }, sep, 'PQ ∥ MN'] },
        { estado: { corte: 3 }, texto: 'Con la diagonal BD pasa lo mismo: NP = QM = BD/2.', ecuacion: ['NP = QM = ', { frac: ['BD', '2'] }] },
        { estado: { corte: 3 }, texto: 'Lados opuestos paralelos: paralelogramo. Su perímetro, AC + BD.', ecuacion: ['perímetro = ', { llave: ['AC + BD'], nota: 'las diagonales', color: 'c-d' }] },
      ],
    },
    regla: {
      texto: 'En cualquier cuadrilátero, los puntos medios de los lados forman un paralelogramo cuyo perímetro es la suma de las diagonales. Sus ángulos interiores suman 360°.',
      ecuacion: ['perímetro = ', { llave: ['AC + BD'], nota: 'las diagonales', color: 'c-d' }, sep, 'A + B + C + D = 360°'],
      condicion: 'el cuadrilátero es trapezoide, trapecio o paralelogramo: solo se usa la base media de los triángulos de cada diagonal.',
      voz: 'Una diagonal convierte el problema en dos triángulos conocidos.',
    },
    // Así se resuelve (fase 2): los dos casos de «Ahora tú» (perímetro con las diagonales, cuarto ángulo), con otras
    // semillas y las mismas cuentas. Si el cuarto ángulo sale de 20° o menos, o de 180° o más, se prueba s + 2.
    // Las figuras no van a escala: llevan los rótulos del problema.
    resuelve: {
      pieza: 'geo-figura',
      generar(s) {
        const AC = { v: 'c-d', t: 'AC' }, BD = { v: 'c-i', t: 'BD' };
        if (s % 2 === 0) {
          const r = azar(s + 900), p = 2 * r.ent(3, 12), q = 2 * r.ent(3, 12);
          const datos = varig(1, 5, { letras: true, diag: true, d1: `AC = ${p}`, d2: `BD = ${q}`, pasos: { par: 1 },
            alt: `Cuadrilátero ABCD con diagonales AC = ${p} y BD = ${q}; sus puntos medios M, N, P y Q forman un paralelogramo` });
          return {
            enunciado: [`Las diagonales de un cuadrilátero miden ${p} y ${q}. ¿Cuál es el perímetro del paralelogramo de los puntos medios?`],
            dibujo: { datos, estado: { corte: 0 } },
            pasos: [
              { tipo: 'pide', texto: 'Piden el perímetro de MNPQ, la figura que forman los puntos medios de los cuatro lados.' },
              { tipo: 'datos', texto: ['Las diagonales miden ', AC, ` = ${p} y `, BD, ` = ${q}.`] },
              { tipo: 'regla', texto: 'Cada diagonal parte el cuadrilátero en dos triángulos. En cada uno, el lado de adentro es base media: mide la mitad de la diagonal.',
                ecuacion: ['MN = PQ = ', { frac: [AC, '2'] }, sep, 'NP = QM = ', { frac: [BD, '2'] }] },
              { tipo: 'cuentas', texto: 'Hay dos lados por cada diagonal. Sumo los cuatro.', ecuacion: [`2 · ${p / 2} + 2 · ${q / 2} = ${p} + ${q} = ${p + q}`], dibujo: { datos, estado: { corte: 1 } } },
              { tipo: 'sentido', texto: `Comprueba: el perímetro salió igual a la suma de las diagonales, ${p} + ${q}. No hizo falta saber cuánto miden los lados de ABCD.` },
            ],
            respuesta: `El perímetro es ${p + q}.`,
          };
        }
        let k = s, r, a, b, c, d;
        for (;;) { r = azar(k + 900); a = 5 * r.ent(10, 22); b = 5 * r.ent(10, 22); c = 5 * r.ent(10, 22); d = 360 - a - b - c; if (d > 20 && d < 180) break; k += 2; }
        const fig = txt => {
          const base = varig(2, 6), letras = ['A', 'B', 'C', 'D'];
          return { datos: { alt: `Trapezoide ABCD con ángulos A = ${a}°, B = ${b}°, C = ${c}° y D = ${txt}`, vista: base.vista,
            puntos: base.puntos.filter(x => letras.includes(x.id)), regiones: base.regiones.slice(0, 1), segmentos: base.segmentos.slice(0, 4),
            angulos: [{ en: 'A', de: 'B', a: 'D', texto: `${a}°`, color: 'i' }, { en: 'B', de: 'C', a: 'A', texto: `${b}°`, color: 'i' },
              { en: 'C', de: 'D', a: 'B', texto: `${c}°`, color: 'i' }, { en: 'D', de: 'A', a: 'C', texto: txt, color: 'h' }] }, estado: {} };
        };
        return {
          enunciado: [`Un trapezoide tiene ángulos de ${a}°, ${b}° y ${c}°. ¿Cuánto mide el cuarto ángulo?`],
          dibujo: fig('?'),
          pasos: [
            { tipo: 'pide', texto: 'Piden el ángulo que falta; en el dibujo, el del vértice D.' },
            { tipo: 'datos', texto: `Los otros tres miden ${a}°, ${b}° y ${c}°. Juntos suman ${a + b + c}°.` },
            { tipo: 'regla', texto: 'Una diagonal parte cualquier cuadrilátero en dos triángulos de 180°: sus cuatro ángulos suman 360°.', ecuacion: ['A + B + C + D = 360°'] },
            { tipo: 'cuentas', texto: 'A los 360° les quito lo que ya suman los otros tres.', ecuacion: [`D = 360° − ${a + b + c}° = ${d}°`], dibujo: fig(`${d}°`) },
            { tipo: 'sentido', texto: `Comprueba: ${a}° + ${b}° + ${c}° + ${d}° = 360°. Y ${d}° es menor que 180°: el trapezoide no tiene entrantes.` },
          ],
          respuesta: `El cuarto ángulo mide ${d}°.`,
        };
      },
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

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 5: se mueven C y D por todo el plano, así ABCD puede ser cóncavo o cruzado (lo que la
  // idea no deja probar), y el cuadrilátero de puntos medios sigue siendo paralelogramo.
  const tipoCuad = V => {
    const cruz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const corta = (p, q, r2, t) => cruz(p, q, r2) * cruz(p, q, t) < 0 && cruz(r2, t, p) * cruz(r2, t, q) < 0;
    if (corta(V[0], V[1], V[2], V[3]) || corta(V[1], V[2], V[3], V[0])) return 'cruzado';
    const sg = V.map((p, k) => Math.sign(cruz(p, V[(k + 1) % 4], V[(k + 2) % 4])));
    return sg.every(x => x === sg[0]) ? 'convexo' : 'cóncavo';
  };
  const cuadLibre = (cx, cy, dx, dy) => {
    const V = [[0, 0], [8, 0], [cx, cy], [dx, dy]], M = medios(...V);
    return {
      alt: `Cuadrilátero ${tipoCuad(V)} ABCD: sus puntos medios forman un paralelogramo de lados ${f(U.dist(M[0], M[1]), 2)} y ${f(U.dist(M[1], M[2]), 2)}`,
      vista: { x: [-2.6, 10.6], y: [-1.4, 7.4] },
      puntos: [...V.map((p, k) => ({ id: 'ABCD'[k], x: p[0], y: p[1], rotulo: 'ABCD'[k], lado: [-135, -45, 45, 135][k] })),
        ...M.map((p, k) => ({ id: 'M' + k, x: p[0], y: p[1], rotulo: 'MNPQ'[k], color: 'o', lado: [-90, 0, 90, 180][k] }))],
      regiones: [{ puntos: ['M0', 'M1', 'M2', 'M3'], color: 'o', opacidad: 0.16 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'D' }, { de: 'D', a: 'A' },
        { de: 'A', a: 'C', color: 'd', grosor: 'fino', discontinua: true }, { de: 'B', a: 'D', color: 'i', grosor: 'fino', discontinua: true },
        { de: 'M0', a: 'M1', color: 'd', paralela: 1 }, { de: 'M2', a: 'M3', color: 'd', paralela: 1 }, { de: 'M1', a: 'M2', color: 'i', paralela: 2 }, { de: 'M3', a: 'M0', color: 'i', paralela: 2 }],
    };
  };
  const verticesCuad = v => [[0, 0], [8, 0], [v.cx, v.cy], [v.dx, v.dy]];
  // Lados MN y NP del paralelogramo de adentro, y el coseno del ángulo en N (0 si es recto).
  const ladosAdentro = v => { const M = medios(...verticesCuad(v)); return [U.dist(M[0], M[1]), U.dist(M[1], M[2])]; };
  const cruceAdentro = v => {
    const M = medios(...verticesCuad(v)), p = [M[0][0] - M[1][0], M[0][1] - M[1][1]], q = [M[2][0] - M[1][0], M[2][1] - M[1][1]];
    return (p[0] * q[0] + p[1] * q[1]) / (Math.hypot(...p) * Math.hypot(...q) || 1);
  };
  const mesaCuad = {
    id: 'cuadrilatero-libre', titulo: 'Cóncavo, cruzado o convexo', pieza: 'geo-figura',
    consigna: 'Arrastra C y D a cualquier lado: hasta un cuadrilátero cóncavo o cruzado. Mira si adentro sigue el paralelogramo.',
    controles: [
      { id: 'cx', etiqueta: 'C a lo ancho', min: -2, max: 10, paso: 0.5, inicio: 7, unidad: '', decimales: 1 },
      { id: 'cy', etiqueta: 'C a lo alto', min: 0.5, max: 7, paso: 0.5, inicio: 5, unidad: '', decimales: 1 },
      { id: 'dx', etiqueta: 'D a lo ancho', min: -2, max: 10, paso: 0.5, inicio: 1, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'dy', etiqueta: 'D a lo alto', min: 0.5, max: 7, paso: 0.5, inicio: 5.5, unidad: '', decimales: 1, color: 'c-o' },
    ],
    dibujo: v => ({ datos: cuadLibre(v.cx, v.cy, v.dx, v.dy), estado: {} }),
    arrastres: [
      { id: 'vertice-c', etiqueta: 'vértice C', color: 'c-i',
        donde: v => enPantalla(cuadLibre(v.cx, v.cy, v.dx, v.dy), [v.cx, v.cy]),
        mover: (q, v) => { const z = alPlano(cuadLibre(v.cx, v.cy, v.dx, v.dy), q); return { cx: z[0], cy: z[1] }; } },
      { id: 'vertice-d', etiqueta: 'vértice D', color: 'c-o',
        donde: v => enPantalla(cuadLibre(v.cx, v.cy, v.dx, v.dy), [v.dx, v.dy]),
        mover: (q, v) => { const z = alPlano(cuadLibre(v.cx, v.cy, v.dx, v.dy), q); return { dx: z[0], dy: z[1] }; } },
    ],
    lectura: v => {
      const V = [[0, 0], [8, 0], [v.cx, v.cy], [v.dx, v.dy]], M = medios(...V);
      return [`${tipoCuad(V)}`, sep, `MN = PQ = ${f(U.dist(M[0], M[1]), 2)}`, sep, `NP = QM = ${f(U.dist(M[1], M[2]), 2)}`];
    },
    // Retos: el tipo sale de tipoCuad y los lados de adentro, de los puntos medios que se dibujan (medios).
    invitaciones: [
      { texto: 'Convierte ABCD en un cuadrilátero cóncavo, con un entrante.',
        logrado: v => tipoCuad(verticesCuad(v)) === 'cóncavo',
        bien: 'Con entrante y todo, adentro queda un paralelogramo. Comprueba sus lados opuestos.' },
      { texto: 'Cruza dos lados de ABCD: haz un cuadrilátero cruzado.',
        logrado: v => tipoCuad(verticesCuad(v)) === 'cruzado',
        bien: 'Ni cruzado se rompe: cada lado de adentro es base media de un triángulo.' },
      { texto: 'Consigue que el paralelogramo de adentro sea un rombo.',
        logrado: v => { const L = ladosAdentro(v); return Math.abs(L[0] - L[1]) < 1e-9; },
        bien: 'Rombo adentro porque AC y BD miden igual. Cada lado es media diagonal.' },
      { texto: 'Consigue que el paralelogramo de adentro sea un rectángulo.',
        logrado: v => Math.abs(cruceAdentro(v)) < 1e-9,
        bien: 'Ángulo recto adentro: las diagonales AC y BD son perpendiculares.' },
      { texto: 'Guarda un caso convexo y otro cruzado. Compara las figuras de adentro.',
        // La grilla de esta mesa es grande: el reto pide los dos tipos, no medidas exactas iguales.
        logrado: (v, guardados) => guardados.some(g => g.cx === v.cx && g.cy === v.cy && g.dx === v.dx && g.dy === v.dy)
          && ['convexo', 'cruzado'].every(t => guardados.some(g => tipoCuad(verticesCuad(g)) === t)),
        bien: 'En los dos hay un paralelogramo: sus lados miden la mitad de AC y BD.' },
    ],
  };

  // Mesa 2, más rica que la idea 3: el ángulo va de 5° en 5° y los dos lados se cambian; se dibujan las diagonales con
  // su largo y el ángulo entre ellas, para ver cuándo son iguales (rectángulo) y cuándo perpendiculares (rombo).
  const nombreLibre = (t, a, b) => (t === 90 && a === b ? 'cuadrado' : t === 90 ? 'rectángulo' : a === b ? 'rombo' : 'paralelogramo');
  const diagonalesDe = (t, a, b) => {
    const D = U.polar([0, 0], b, t), C = [a + D[0], D[1]], O = U.medio([0, 0], C);
    return { D, C, O, ac: Math.hypot(...C), bd: U.dist([a, 0], D), cruce: U.angulo(O, [0, 0], D) };
  };
  const paraLibre = (t, a, b) => {
    const { D, C, O, ac, bd, cruce } = diagonalesDe(t, a, b);
    return {
      alt: `${nombreLibre(t, a, b)} de lados ${f(a)} y ${f(b)} con ángulo de ${t}°: diagonales de ${f(ac, 2)} y ${f(bd, 2)} que se cruzan a ${f(cruce, 0)}°`,
      vista: { x: [-4.2, 9.2], y: [-0.9, 5.6] },
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -135 }, { id: 'B', x: a, y: 0, rotulo: 'B', lado: -45 }, { id: 'C', x: C[0], y: C[1], rotulo: 'C', lado: 45 }, { id: 'D', x: D[0], y: D[1], rotulo: 'D', lado: 135 },
        { id: 'O', x: O[0], y: O[1], sinPunto: true }],
      regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'i', opacidad: 0.08 }],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable', paralela: 1 }, { de: 'D', a: 'C', color: 'o', grosor: 'variable', paralela: 1 },
        { de: 'A', a: 'D', color: 'i', grosor: 'variable', paralela: 2 }, { de: 'B', a: 'C', color: 'i', grosor: 'variable', paralela: 2 },
        { de: 'A', a: 'C', color: 'h', grosor: 'fino' }, { de: 'B', a: 'D', color: 'h', grosor: 'fino' }],
      angulos: [{ en: 'A', de: 'B', a: 'D', color: 'd', texto: `${t}°` }, { en: 'O', de: 'C', a: 'D', color: 'h', radio: 16, texto: `${f(180 - cruce, 0)}°` }],
    };
  };
  // La diagonal AC más larga entre todos los casos de la mesa (se calcula una vez, con los controles de la mesa).
  let acMax;
  const acMaxima = () => {
    if (acMax === undefined) {
      const rango = c => Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => c.min + k * c.paso);
      const [ct, ca, cb] = mesaPara.controles;
      acMax = 0;
      for (const t of rango(ct)) for (const a of rango(ca)) for (const b of rango(cb)) acMax = Math.max(acMax, diagonalesDe(t, a, b).ac);
    }
    return acMax;
  };
  const mesaPara = {
    id: 'paralelogramo-libre', titulo: 'Diagonales del paralelogramo', pieza: 'geo-figura',
    consigna: 'Arrastra D y B. Busca diagonales iguales, luego un cruce de 90°, luego las dos cosas. Lee el nombre que gana.',
    controles: [
      { id: 't', etiqueta: '∠A', min: 45, max: 135, paso: 5, inicio: 60, unidad: '°', decimales: 0, color: 'c-d' },
      { id: 'a', etiqueta: 'Lado AB', min: 2, max: 5, paso: 0.5, inicio: 4.5, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'b', etiqueta: 'Lado AD', min: 2, max: 5, paso: 0.5, inicio: 3, unidad: '', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: paraLibre(v.t, v.a, v.b), estado: {} }),
    arrastres: [
      { id: 'vertice-d', etiqueta: 'vértice D', color: 'c-i',
        donde: v => enPantalla(paraLibre(v.t, v.a, v.b), U.polar([0, 0], v.b, v.t)),
        mover: (q, v) => { const z = alPlano(paraLibre(v.t, v.a, v.b), q); return { t: U.grados(Math.atan2(Math.max(z[1], 0), z[0])), b: Math.hypot(z[0], z[1]) }; } },
      { id: 'vertice-b', etiqueta: 'vértice B', color: 'c-o',
        donde: v => enPantalla(paraLibre(v.t, v.a, v.b), [v.a, 0]),
        mover: (q, v) => ({ a: alPlano(paraLibre(v.t, v.a, v.b), q)[0] }) },
    ],
    lectura: v => {
      const { ac, bd } = diagonalesDe(v.t, v.a, v.b);
      // AC − BD = 0 dice «diagonales iguales» sin comparar dos números; el cruce va escrito en la figura, en O.
      return [nombreLibre(v.t, v.a, v.b), sep, `AC − BD = ${f(Math.abs(ac - bd) < 1e-9 ? 0 : ac - bd, 2)}`];
    },
    // Retos: las diagonales y su cruce salen de diagonalesDe, la misma función que dibuja.
    invitaciones: [
      { texto: 'Consigue diagonales iguales sin que la figura sea un cuadrado.',
        logrado: v => { const d = diagonalesDe(v.t, v.a, v.b); return Math.abs(d.ac - d.bd) < 1e-9 && v.a !== v.b; },
        bien: 'Diagonales iguales: ∠A quedó recto. Es un rectángulo, con cualquier par de lados.' },
      { texto: 'Haz que las diagonales se crucen a 90° con ∠A distinto de 90°.',
        logrado: v => Math.abs(diagonalesDe(v.t, v.a, v.b).cruce - 90) < 1e-6 && v.t !== 90,
        bien: 'Cruce recto: los cuatro lados son iguales. Es un rombo, sin importar ∠A.' },
      { texto: 'Logra las dos cosas a la vez: diagonales iguales y cruce de 90°.',
        logrado: v => { const d = diagonalesDe(v.t, v.a, v.b); return Math.abs(d.ac - d.bd) < 1e-9 && Math.abs(d.cruce - 90) < 1e-6; },
        bien: 'Cumple las dos condiciones: el cuadrado es rectángulo y también rombo.' },
      { texto: 'Busca la diagonal AC más larga que permite la mesa.',
        // La más larga de la grilla: se recorre la grilla real de la mesa con diagonalesDe.
        logrado: v => Math.abs(diagonalesDe(v.t, v.a, v.b).ac - acMaxima()) < 1e-9,
        bien: 'AC queda frente a ∠B: cuanto más abierto ∠B, más larga AC.' },
      { texto: 'Guarda dos casos con los mismos lados y ∠A que sumen 180°.',
        logrado: (v, guardados) => v.t !== 90 && guardados.some(g => g.t === v.t && g.a === v.a && g.b === v.b)
          && guardados.some(g => g.a === v.a && g.b === v.b && g.t + v.t === 180),
        bien: 'Las diagonales se intercambian: la AC de uno es la BD del otro.' },
    ],
  };

  // Mesa 3, más rica que la idea 4: D se mueve libre (posición y altura) y C estira la base menor, que puede salirse
  // por encima de B. La lectura da la mediana y el tramo central a la vez.
  const puntosTrap = (dx, h, b) => {
    const A = [0, 0], Bb = [10, 0], D = [dx, h], C = [dx + b, h];
    return { A, Bb, C, D, M: U.medio(A, D), N: U.medio(Bb, C), P: U.medio(A, C), Q: U.medio(Bb, D) };
  };
  // Medidas que se leen en la figura: mediana, tramo PQ y los dos lados no paralelos.
  const medTrap = v => {
    const p = puntosTrap(v.dx, v.h, v.b);
    return { mn: U.dist(p.M, p.N), pq: U.dist(p.P, p.Q), ad: U.dist(p.A, p.D), bc: U.dist(p.Bb, p.C) };
  };
  const trapLibre = (dx, h, b) => {
    const { C, D, M, N, P, Q } = puntosTrap(dx, h, b);
    return {
      alt: `Trapecio de bases 10 y ${f(b)} y altura ${f(h)}: la mediana mide ${f((10 + b) / 2)} y el tramo entre las diagonales, ${f((10 - b) / 2)}`,
      vista: { x: [-3.6, 14.6], y: [-0.8, 6.6] },
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -120 }, { id: 'B', x: 10, y: 0, rotulo: 'B', lado: -60 }, { id: 'C', x: C[0], y: h, rotulo: 'C', lado: 60 }, { id: 'D', x: dx, y: h, rotulo: 'D', lado: 120 },
        { id: 'M', x: M[0], y: M[1], rotulo: 'M', lado: 180 }, { id: 'N', x: N[0], y: N[1], rotulo: 'N', lado: 0 }, { id: 'P', x: P[0], y: P[1], color: 'h' }, { id: 'Q', x: Q[0], y: Q[1], color: 'h' }],
      regiones: [{ puntos: ['A', 'B', 'C', 'D'], color: 'i', opacidad: 0.08 }],
      segmentos: [{ de: 'A', a: 'B', color: 'd', grosor: 'variable', texto: 'B = 10', paralela: 1 }, { de: 'D', a: 'C', color: 'i', grosor: 'variable', paralela: 1 },
        { de: 'B', a: 'C' }, { de: 'A', a: 'D' }, { de: 'A', a: 'C', grosor: 'fino', discontinua: true }, { de: 'B', a: 'D', grosor: 'fino', discontinua: true },
        { de: 'M', a: 'N', color: 'o', grosor: 'fino' }, { de: 'P', a: 'Q', color: 'h', grosor: 'variable' }],
    };
  };
  const mesaTrap = {
    id: 'trapecio-libre', titulo: 'Trapecio estirable', pieza: 'geo-figura',
    consigna: 'Arrastra D para correr y subir la base menor; arrastra C para estirarla. Mira la mediana y el tramo rojo.',
    controles: [
      { id: 'dx', etiqueta: 'D a lo ancho', min: -3, max: 6, paso: 0.5, inicio: 2, unidad: '', decimales: 1 },
      { id: 'h', etiqueta: 'altura', min: 1, max: 6, paso: 0.5, inicio: 4, unidad: '', decimales: 1 },
      { id: 'b', etiqueta: 'b', min: 1, max: 8, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: trapLibre(v.dx, v.h, v.b), estado: {} }),
    arrastres: [
      { id: 'vertice-d', etiqueta: 'vértice D', color: 'c-i',
        donde: v => enPantalla(trapLibre(v.dx, v.h, v.b), [v.dx, v.h]),
        mover: (q, v) => { const z = alPlano(trapLibre(v.dx, v.h, v.b), q); return { dx: z[0], h: z[1] }; } },
      { id: 'vertice-c', etiqueta: 'vértice C', color: 'c-i',
        donde: v => enPantalla(trapLibre(v.dx, v.h, v.b), [v.dx + v.b, v.h]),
        mover: (q, v) => ({ b: alPlano(trapLibre(v.dx, v.h, v.b), q)[0] - v.dx }) },
    ],
    lectura: v => [{ v: 'c-o', t: 'MN' }, ` = ${f((10 + v.b) / 2, 2)}`, sep, { v: 'c-h', t: 'PQ' }, ` = ${f((10 - v.b) / 2, 2)}`],
    // Retos: MN, PQ y los lados salen de los puntos que dibuja trapLibre (puntosTrap), no de la fórmula.
    invitaciones: [
      { texto: 'Haz que la mediana MN mida justo 8.',
        logrado: v => Math.abs(medTrap(v).mn - 8) < 1e-9,
        bien: 'MN = 8 con b = 6: la semisuma de 10 y 6. ¿Importó la altura?' },
      { texto: 'Busca el tramo rojo PQ más corto que deja la mesa.',
        logrado: v => Math.abs(medTrap(v).pq - pqMinimo()) < 1e-9,
        bien: 'Con bases casi iguales, PQ casi desaparece. ¿Qué pasaría si b midiera 10?' },
      { texto: 'Haz un trapecio isósceles: AD y BC del mismo largo.',
        logrado: v => { const m = medTrap(v); return Math.abs(m.ad - m.bc) < 1e-9; },
        bien: 'Lados no paralelos iguales. MN sigue dependiendo solo de las bases.' },
      { texto: 'Estira la base menor hasta que C pase más allá de B.',
        logrado: v => v.dx + v.b > 10,
        bien: 'C pasó más allá de B y la mediana sigue siendo la semisuma de las bases.' },
      { texto: 'Guarda dos casos con la misma b, otra altura y otro corrimiento.',
        logrado: (v, guardados) => guardados.some(g => g.dx === v.dx && g.h === v.h && g.b === v.b)
          && guardados.some(g => g.b === v.b && g.h !== v.h && g.dx !== v.dx && Math.abs(medTrap(g).mn - medTrap(v).mn) < 1e-9),
        bien: 'Misma MN en los dos: la altura y el corrimiento no la mueven.' },
    ],
  };
  // El PQ más corto entre todos los casos de la mesa (con sus controles reales).
  let pqMin;
  const pqMinimo = () => {
    if (pqMin === undefined) {
      const c = mesaTrap.controles.find(x => x.id === 'b');
      pqMin = Infinity;
      for (let b = c.min; b <= c.max + 1e-9; b += c.paso) pqMin = Math.min(pqMin, medTrap({ dx: 0, h: 4, b }).pq);
    }
    return pqMin;
  };

  return {
    unidad: 'geometria.poligonos-y-cuadrilateros',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'En la proposición I.34 de los Elementos, una diagonal parte el paralelogramo en dos triángulos congruentes: así se justifica que sus lados opuestos son iguales. La misma idea de descomponer sirve para polígonos más grandes. Las clasificaciones escolares de hoy no coinciden palabra por palabra con las antiguas: conviene declarar las definiciones antes de comparar.',
      pregunta: '¿Qué línea convierte una figura nueva en triángulos conocidos?',
      fuente: { titulo: 'Euclides, Elementos I.34 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/propI34.html' },
    },
    // Glosario (docs/teoria.md, 4d): lo que esta unidad estrena en el curso. Ángulo interior y exterior, diagonal,
    // paralelogramo, cuadrado, mediana y base media se definen en unidades anteriores (triángulos, segmentos, congruencia).
    glosario: [
      { termino: 'polígono', def: 'Figura plana cerrada hecha de segmentos rectos, unidos de dos en dos por sus extremos.',
        ejemplo: 'Un pentágono tiene 5 lados, 5 vértices y sus ángulos interiores suman 540°.', ver: ['polígono convexo', 'cuadrilátero'] },
      { termino: 'polígono convexo', formas: ['polígono convexo', 'polígonos convexos'],
        def: 'Figura de lados rectos sin entrantes: cada ángulo interior mide menos de 180°.',
        ejemplo: 'Un rectángulo lo es: sus cuatro ángulos miden 90°.', ver: ['cóncavo'] },
      { termino: 'cóncavo', formas: ['cóncavo', 'cóncavos', 'cóncava', 'cóncavas'],
        def: 'Dicho de un polígono con un entrante: al menos un ángulo interior mide más de 180°.',
        ejemplo: 'Una punta de flecha de cuatro lados: el vértice del entrante pasa de 180°.', ver: ['polígono convexo'] },
      { termino: 'cuadrilátero cruzado', formas: ['cuadrilátero cruzado', 'cuadriláteros cruzados', 'cruzado'],
        def: 'Cuatro segmentos que se cierran, pero dos lados se cortan entre sí, como un lazo.',
        ver: ['cuadrilátero'] },
      { termino: 'cuadrilátero', def: 'Polígono de cuatro lados: tiene cuatro vértices, cuatro ángulos y dos diagonales.',
        ejemplo: 'Sus ángulos interiores suman (4 − 2) · 180° = 360°.', ver: ['trapecio', 'trapezoide', 'rombo'] },
      { termino: 'rombo', def: 'Paralelogramo con sus cuatro lados iguales. Sus diagonales se cortan en ángulo recto.',
        ejemplo: 'Un cuadrado es un rombo que además tiene ángulos rectos.', ver: ['cuadrilátero', 'paralelogramo'] },
      { termino: 'trapecio', def: 'Cuadrilátero con exactamente un par de lados paralelos, que se llaman bases.',
        ejemplo: 'Bases de 10 y 4: la mediana mide (10 + 4)/2 = 7.', ver: ['mediana del trapecio', 'trapezoide'] },
      { termino: 'trapezoide', def: 'Cuadrilátero sin ningún par de lados paralelos.',
        ejemplo: 'Diagonales de 10 y 14: el paralelogramo de sus puntos medios tiene perímetro 24.', ver: ['trapecio', 'paralelogramo'] },
      { termino: 'mediana del trapecio', formas: ['mediana del trapecio', 'medianas del trapecio', 'mediana MN'],
        def: 'Segmento entre los puntos medios de los lados no paralelos. Mide la semisuma de las bases.',
        ejemplo: 'Bases 10 y 6: (10 + 6)/2 = 8.', ver: ['trapecio'] },
      { termino: 'semisuma', def: 'La mitad de la suma de dos cantidades.', ejemplo: 'Semisuma de 10 y 4: (10 + 4)/2 = 7.', ver: ['semidiferencia'] },
      { termino: 'semidiferencia', def: 'La mitad de la resta de dos cantidades: la mayor menos la menor.',
        ejemplo: 'Semidiferencia de 10 y 4: (10 − 4)/2 = 3.', ver: ['semisuma'] },
      { termino: 'perímetro', def: 'Suma de las longitudes de todos los lados de una figura.',
        ejemplo: 'Lados 5, 3, 5 y 3: 5 + 3 + 5 + 3 = 16.' },
      { termino: 'pentágono', def: 'Polígono de cinco lados.', ejemplo: 'Sus ángulos interiores suman (5 − 2) · 180° = 540°.' },
      { termino: 'hexágono', def: 'Polígono de seis lados.', ejemplo: 'Sus ángulos interiores suman (6 − 2) · 180° = 720°.' },
      { termino: 'octógono', def: 'Polígono de ocho lados.', ejemplo: 'Sus ángulos interiores suman (8 − 2) · 180° = 1080°.' },
      { termino: 'decágono', def: 'Polígono de diez lados.', ejemplo: 'Tiene 10 · (10 − 3)/2 = 35 diagonales.' },
    ],
    // Laboratorio: las tres mesas son más ricas que sus ideas (cuadrilátero cóncavo y cruzado, paralelogramo con las
    // diagonales medidas y trapecio con los dos extremos de la base menor libres).
    laboratorio: [mesaCuad, mesaPara, mesaTrap],
    ideas: [sumaIdea, diagonales, paralelogramos, trapecios, trapezoides],
  };
});
