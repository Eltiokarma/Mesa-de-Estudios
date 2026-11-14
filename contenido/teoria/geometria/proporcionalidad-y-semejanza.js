/*
 * Teoría de «Proporcionalidad y semejanza» (geometria.proporcionalidad-y-semejanza). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 6), microguion «Geometría 6: el área cambia con el cuadrado de la
 * escala» del expediente (idea 5) y Elementos VI.2 (Thales por áreas) y VI.3 (bisectriz).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: usar razones entre segmentos (Thales, bisectriz, Ceva y Menelao) y semejanza emparejando lados por sus
 *     ángulos, y separar la escala de longitudes (k) de la de áreas (k²).
 *   Persona y condiciones: postulante de 4.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: halla segmentos con Thales y con la bisectriz, completa Ceva y Menelao, resuelve semejanzas
 *     antiparalelas y escala áreas por k².
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿qué lado va con cuál?» y «¿por qué el área no se duplica?».
 *
 * Colores: segmento o razón de arriba naranja (c-o), la de abajo turquesa (c-i), referencia verde (c-d), pedido rojo (c-h).
 * Precisión del expediente: arrastrar muestra casos; la prueba (áreas, paralela auxiliar) explica por qué.
 * Códigos: GE1, GE2, GE8, GE22 (docs/investigacion/geometria-ideas-erroneas.md); GE-THA, GE-CEV, GE-SEM hipótesis nuevas.
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
  const f = (n, d = 2) => Kit.formatear(n, d);
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
  const pt = (id, p, o = {}) => Object.assign({ id, x: p[0], y: p[1] }, o);
  const frac = (a, b) => ({ frac: [a, b] });
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura; aPlano la vuelve coordenadas del
  // problema, sobreRecta da la fracción de un lado y el lector ajusta cada valor al paso y al rango de su control.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, pt) => G.aPlano(datos, pt);
  const sobre = (datos, A, B, pt) => G.sobreRecta(datos, A, B, pt);

  // ---------- Idea 1: Thales ----------
  // Cambia: la altura del corte paralelo · Permanece: el triángulo · Progresa: AD/DB y AE/EC, siempre iguales ·
  // Se reserva: el corte inclinado · Debe verse: la igualdad viene de áreas con alturas comunes, no de medir.
  const TA = [2, 5], TB = [0, 0], TC = [7, 0];
  const thales = (t, o = {}) => {
    const D = U.mezcla(TA, TB, t), E = o.E || U.mezcla(TA, TC, t);
    const k = o.pasos || {};
    const ad = U.dist(TA, D), db = U.dist(D, TB), ae = U.dist(TA, E), ec = U.dist(E, TC);
    return {
      alt: o.alt || `Recta DE ${o.E ? 'inclinada' : 'paralela a BC'}: AD/DB = ${f(ad / db)} y AE/EC = ${f(ae / ec)}`,
      vista: { x: [-0.8, 7.8], y: [-0.8, 5.6] },
      puntos: [pt('A', TA, { rotulo: 'A', lado: 90 }), pt('B', TB, { rotulo: 'B', lado: -120 }), pt('C', TC, { rotulo: 'C', lado: -60 }), pt('D', D, { rotulo: 'D', lado: 180 }), pt('E', E, { rotulo: 'E', lado: 0 })],
      regiones: o.areas ? [{ puntos: ['A', 'D', 'E'], color: 'o', opacidad: 0.22, desde: k.ade || 0 }, { puntos: ['D', 'B', 'E'], color: 'i', opacidad: 0.22, desde: k.dbe || 0, hasta: k.dbeHasta },
        { puntos: ['D', 'C', 'E'], color: 'd', opacidad: 0.22, desde: k.dce || 99 }] : [],
      segmentos: [{ de: 'A', a: 'D', color: 'o', grosor: 'variable', texto: o.sinNum ? undefined : f(ad) }, { de: 'D', a: 'B', color: 'i', grosor: 'variable', texto: o.sinNum ? undefined : f(db) },
        { de: 'A', a: 'E', color: 'o', grosor: 'variable', texto: o.sinNum ? undefined : f(ae) }, { de: 'E', a: 'C', color: 'i', grosor: 'variable', texto: o.sinNum ? undefined : f(ec) },
        { de: 'B', a: 'C', paralela: o.E ? 0 : 1 }, { de: 'D', a: 'E', color: o.E ? 'h' : undefined, paralela: o.E ? 0 : 1 },
        ...(o.areas ? [{ de: 'B', a: 'E', grosor: 'fino', discontinua: true, desde: k.dbe || 0 }, { de: 'D', a: 'C', grosor: 'fino', discontinua: true, desde: k.dce || 99 }] : [])],
    };
  };
  const ED = U.corte(U.mezcla(TA, TB, 0.5), U.polar(U.mezcla(TA, TB, 0.5), 1, 14), TA, TC);
  const thalesIdea = {
    id: 'thales',
    titulo: 'Una paralela corta en proporción',
    temas: ['Teorema de Thales'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La recta DE es paralela a BC. Súbela o bájala y compara la razón AD/DB con la razón AE/EC.',
      voz: 'Mueve el corte. Comprueba las dos razones cada vez.',
      controles: [{ id: 't', etiqueta: 'D desde A', min: 0.2, max: 0.8, paso: 0.1, inicio: 0.4, unidad: 'de AB', decimales: 1 }],
      dibujo: v => ({ datos: thales(v.t), estado: {} }),
      // Se agarra D, que corre por AB; E lo acompaña en AC porque DE sigue paralela a BC.
      arrastres: [{ id: 'punto-d', etiqueta: 'punto D en AB', color: 'c-o',
        donde: v => enPantalla(thales(v.t), U.mezcla(TA, TB, v.t)),
        mover: (p, v) => ({ t: sobre(thales(v.t), TA, TB, p) }) }],
      lectura: v => [frac({ v: 'c-o', t: 'AD' }, { v: 'c-i', t: 'DB' }), ` = ${f(v.t / (1 - v.t))}   ·   `, frac({ v: 'c-o', t: 'AE' }, { v: 'c-i', t: 'EC' }), ` = ${f(v.t / (1 - v.t))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora D queda en la mitad de AB y la recta DE se inclina un poco: ya no es paralela a BC. ¿Qué pasa con las dos razones?',
      voz: 'El corte se inclinó. Decide con la condición, no con el aspecto.',
      opciones: [
        { id: 'c', texto: 'Dejan de ser iguales', correcta: true },
        { id: 'iguales', texto: 'Siguen iguales: D y E siguen en los lados', error: 'GE-THA1', siFuera: 'Estar en los lados no basta. La igualdad viene del paralelismo con BC.' },
        { id: 'uno', texto: 'Las dos valen 1, por el punto medio', error: 'GE-THA2', siFuera: 'AD/DB sí vale 1. E ya no está en la mitad de AC.' },
      ],
      dibujo: { datos: thales(0.5, { E: ED, sinNum: true, alt: 'D en la mitad de AB; la recta DE se inclinó y ya no es paralela a BC' }), estado: {} },
      revelar: { datos: thales(0.5, { E: ED }), estado: {} },
      coincide: 'Coincide: sin paralelismo, las razones dejan de coincidir.',
    },
    mira: {
      datos: thales(0.4, { areas: true, sinNum: true, pasos: { ade: 0, dbe: 1, dce: 3, dbeHasta: 3 }, alt: 'Áreas de ADE, DBE y DCE: las dos últimas son iguales porque DE es paralela a BC' }),
      voz: 'La prueba usa áreas, no reglas de medir.',
      pasos: [
        { estado: { corte: 1 }, texto: 'ADE y DBE tienen la misma altura desde E.', ecuacion: [frac('[ADE]', '[DBE]'), ' = ', frac({ v: 'c-o', t: 'AD' }, { v: 'c-i', t: 'DB' })] },
        { estado: { corte: 2 }, texto: 'DBE y DCE: misma base DE y misma altura entre paralelas.', ecuacion: ['[DBE] = [DCE]'] },
        { estado: { corte: 3 }, texto: 'ADE y DCE tienen la misma altura desde D.', ecuacion: [frac('[ADE]', '[DCE]'), ' = ', frac({ v: 'c-o', t: 'AE' }, { v: 'c-i', t: 'EC' })] },
        { estado: { corte: 3 }, texto: 'Mismo numerador y denominadores iguales: razones iguales.', ecuacion: [frac({ v: 'c-o', t: 'AD' }, { v: 'c-i', t: 'DB' }), ' = ', frac({ v: 'c-o', t: 'AE' }, { v: 'c-i', t: 'EC' })] },
      ],
    },
    regla: {
      texto: 'Una paralela a un lado del triángulo corta a los otros dos en partes proporcionales. Y al revés: si las razones son iguales, la recta es paralela.',
      ecuacion: ['DE ∥ BC  ⇔  ', { llave: [frac({ v: 'c-o', t: 'AD' }, { v: 'c-i', t: 'DB' })], nota: 'en AB', color: 'c-o' }, ' = ', { llave: [frac({ v: 'c-o', t: 'AE' }, { v: 'c-i', t: 'EC' })], nota: 'en AC', color: 'c-i' }],
      condicion: 'se comparan tramos que se corresponden en el mismo orden. Vale igual para tres paralelas cortadas por dos secantes.',
      voz: 'Primero la paralela; después la proporción.',
    },
    ahoraTu: {
      voz: 'Empareja los tramos en el mismo orden.',
      generar(s) {
        const r = azar(s), a = r.ent(2, 9), b = r.ent(2, 9), c = r.ent(2, 9), x = b * c / a;
        const tri = s % 2 === 0;
        return {
          pregunta: tri ? ['En el triángulo ABC, DE es paralela a BC. Si ', { v: 'c-o', t: 'AD' }, ` = ${a}, `, { v: 'c-i', t: 'DB' }, ` = ${b} y `, { v: 'c-o', t: 'AE' }, ` = ${c}, ¿cuánto mide `, { v: 'c-i', t: 'EC' }, '?']
            : [`Tres rectas paralelas cortan a dos secantes. En la primera quedan tramos de ${a} y ${b}; en la segunda, el primer tramo mide ${c}. ¿Cuánto mide el segundo?`],
          dibujo: tri ? { datos: thales(a / (a + b), { sinNum: true, alt: `DE paralela a BC con AD = ${a}, DB = ${b} y AE = ${c}` }), estado: {} } : undefined,
          opciones: opciones(x, [
            { id: 'invertida', valor: a * c / b, error: 'GE22', siFuera: 'Esa razón está invertida: compara arriba con arriba y abajo con abajo.' },
            { id: 'diferencia', valor: c + (b - a), error: 'GE-THA3', siFuera: 'Sumar la diferencia sería cierto si los tramos crecieran igual; crecen en proporción.' },
            { id: 'total', valor: c * (a + b) / a, error: 'GE22', siFuera: 'Ese es el lado completo AC, no el tramo de abajo.' },
          ], n => f(n)),
          solucion: { texto: 'Arriba con arriba, abajo con abajo.', ecuacion: [frac(`${a}`, `${b}`), ' = ', frac(`${c}`, 'x'), ` → x = ${f(x)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: teorema de la bisectriz y del incentro ----------
  // Cambia: los lados AB y AC · Permanece: el ángulo A y su bisectriz · Progresa: el punto D en BC ·
  // Se reserva: el 6-8-10 (D no es el punto medio) · Debe verse: BD/DC copia la razón de los lados vecinos.
  const bisec = (c, b, o = {}) => {
    const A = [0, 0], B = U.polar(A, c, 235), C = U.polar(A, b, 305);
    const D = [(b * B[0] + c * C[0]) / (b + c), (b * B[1] + c * C[1]) / (b + c)];
    return {
      alt: `AB = ${f(c)} y AC = ${f(b)}: la bisectriz de A corta BC en D con BD/DC = ${f(c / b)}`,
      vista: { x: [-5.4, 5.4], y: [-6.4, 0.9] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: 'B', lado: 200 }), pt('C', C, { rotulo: 'C', lado: -20 }), pt('D', D, { rotulo: 'D', color: 'h', lado: -90 })],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable', texto: f(c) }, { de: 'A', a: 'C', color: 'i', grosor: 'variable', texto: f(b) },
        { de: 'B', a: 'D', color: 'o', texto: f(U.dist(B, D)) }, { de: 'D', a: 'C', color: 'i', texto: f(U.dist(D, C)) }, { de: 'A', a: 'D', color: 'h', discontinua: true }],
      angulos: [{ en: 'A', de: 'B', a: 'D', color: 'h', rayita: 1, radio: 30 }, { en: 'A', de: 'D', a: 'C', color: 'h', rayita: 1, radio: 30 }],
    };
  };
  const recto = (o = {}) => {
    const A = [0, 0], B = [6, 0], C = [0, 8], D = [24 / 7, 24 / 7], E = [-8, 0], k = o.pasos || {};
    return {
      alt: o.alt || 'Triángulo rectángulo en A con AB = 6 y AC = 8; la bisectriz del ángulo recto corta la hipotenusa en D',
      vista: { x: o.E ? [-8.8, 7] : [-1.2, 7], y: [-1, 8.8] },
      puntos: [pt('A', A, { rotulo: 'A', lado: -135 }), pt('B', B, { rotulo: 'B', lado: -45 }), pt('C', C, { rotulo: 'C', lado: 135 }), pt('D', D, { rotulo: 'D', color: 'h', lado: 30 }),
        ...(o.E ? [pt('E', E, { rotulo: 'E', lado: -135, desde: k.e || 0 })] : [])],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable', texto: '6' }, { de: 'A', a: 'C', color: 'i', grosor: 'variable', texto: '8' }, { de: 'A', a: 'D', color: 'h', discontinua: true },
        { de: 'B', a: 'D', color: 'o', texto: o.num ? '30/7' : undefined }, { de: 'D', a: 'C', color: 'i', texto: o.num ? '40/7' : undefined },
        ...(o.E ? [{ de: 'E', a: 'A', color: 'i', grosor: 'variable', texto: '8', desde: k.e || 0 }, { de: 'E', a: 'C', color: 'd', paralela: 1, desde: k.ec || 0 }, { de: 'A', a: 'D', paralela: 1, desde: k.ec || 0 }] : [])],
      angulos: [{ en: 'A', de: 'B', a: 'C' }, ...(o.E ? [{ en: 'E', de: 'A', a: 'C', color: 'd', texto: '45°', desde: k.ec || 0 }, { en: 'C', de: 'E', a: 'A', color: 'd', texto: '45°', desde: k.ec || 0 }] : [])],
    };
  };
  const bisectriz = {
    id: 'bisectriz',
    titulo: 'La bisectriz copia la razón',
    temas: ['Teoremas de la bisectriz y del incentro'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'AD es la bisectriz del ángulo A. Cambia los lados AB y AC y compara cómo queda partido BC.',
      voz: 'Cambia un lado. Mira hacia dónde se corre D.',
      controles: [
        { id: 'c', etiqueta: 'AB', min: 2, max: 6, paso: 1, inicio: 3, unidad: '', decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'AC', min: 2, max: 6, paso: 1, inicio: 6, unidad: '', decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: bisec(v.c, v.b), estado: {} }),
      // Se agarran B y C, que corren por sus lados: el ángulo A y su bisectriz no se mueven.
      arrastres: [
        { id: 'vertice-b', etiqueta: 'vértice B', color: 'c-o',
          donde: v => enPantalla(bisec(v.c, v.b), U.polar([0, 0], v.c, 235)),
          mover: (p, v) => ({ c: sobre(bisec(v.c, v.b), [0, 0], U.polar([0, 0], 1, 235), p) }) },
        { id: 'vertice-c', etiqueta: 'vértice C', color: 'c-i',
          donde: v => enPantalla(bisec(v.c, v.b), U.polar([0, 0], v.b, 305)),
          mover: (p, v) => ({ b: sobre(bisec(v.c, v.b), [0, 0], U.polar([0, 0], 1, 305), p) }) },
      ],
      lectura: v => [frac({ v: 'c-o', t: 'AB' }, { v: 'c-i', t: 'AC' }), ` = ${f(v.c / v.b)}   ·   `, frac({ v: 'c-o', t: 'BD' }, { v: 'c-i', t: 'DC' }), ` = ${f(v.c / v.b)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En el triángulo rectángulo de catetos AB = 6 y AC = 8 (hipotenusa 10), la bisectriz del ángulo recto corta la hipotenusa. ¿En qué tramos la parte?',
      voz: 'La bisectriz parte el ángulo en dos. ¿Y el lado?',
      opciones: [
        { id: 'c', texto: '30/7 y 40/7', correcta: true },
        { id: 'mitad', texto: '5 y 5', error: 'GE8', siFuera: 'La mitad la da la mediana. La bisectriz parte el lado según los lados vecinos.' },
        { id: 'altura', texto: '3,6 y 6,4', error: 'GE8', siFuera: 'Esos son los tramos que deja la altura, no la bisectriz.' },
        { id: 'lados', texto: '6 y 4', error: 'GE-THA2', siFuera: 'La razón sería 6 : 4. Debe ser 6 : 8, y sumar 10.' },
      ],
      dibujo: { datos: recto(), estado: {} },
      revelar: { datos: recto({ num: true }), estado: {} },
      coincide: 'Coincide: 10 en razón 6 : 8 da 30/7 y 40/7.',
    },
    // Hallazgo 9: «Mira» prueba el caso de la predicción (el rectángulo 6-8-10), no el triángulo del juego: la prueba con
    // la paralela EC necesita un ángulo A concreto (90°) para leer los 45°.
    mira: {
      datos: recto({ E: true, num: true, pasos: { e: 1, ec: 2 }, alt: 'Se prolonga BA hasta E con AE = AC = 8; EC resulta paralela a AD y Thales da BD/DC = 6/8' }),
      voz: 'Una paralela convierte la bisectriz en Thales.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Prolongamos BA hasta E, con AE = AC = 8.', ecuacion: ['AE = AC'] },
        { estado: { corte: 2 }, texto: 'ACE es isósceles: sus ángulos iguales miden la mitad de A. EC ∥ AD.', ecuacion: ['∠E = ∠ACE = 45°'] },
        { estado: { corte: 2 }, texto: 'Thales en el triángulo BEC con la paralela AD.', ecuacion: [frac({ v: 'c-o', t: 'BD' }, { v: 'c-i', t: 'DC' }), ' = ', frac('BA', 'AE'), ' = ', frac('6', '8')] },
      ],
    },
    regla: {
      texto: 'La bisectriz interior de A parte el lado BC en la razón de los lados vecinos. En el incentro I, la bisectriz queda partida en razón (AB + AC) : BC.',
      ecuacion: [{ llave: [frac({ v: 'c-o', t: 'BD' }, { v: 'c-i', t: 'DC' })], nota: 'tramos de BC', color: 'c-h' }, ' = ', { llave: [frac({ v: 'c-o', t: 'AB' }, { v: 'c-i', t: 'AC' })], nota: 'lados vecinos', color: 'c-o' }, '   ·   ', frac('AI', 'ID'), ' = ', frac('AB + AC', 'BC')],
      condicion: 'AD es la bisectriz interior del ángulo A y D está en BC; I es el corte de las bisectrices.',
      voz: 'Cada tramo copia al lado que lo toca.',
    },
    ahoraTu: {
      voz: 'Ubica los lados vecinos de cada tramo.',
      generar(s) {
        const r = azar(s);
        let c, b, a;
        do { c = r.ent(4, 12); b = r.ent(4, 12); a = r.ent(Math.abs(b - c) + 1, b + c - 1); } while (b === c);
        if (s % 2 === 0) {
          const bd = a * c / (b + c);
          return {
            pregunta: ['En el triángulo ABC, ', { v: 'c-o', t: 'AB' }, ` = ${c}, `, { v: 'c-i', t: 'AC' }, ` = ${b} y BC = ${a}. La bisectriz de A corta BC en D. ¿Cuánto mide `, { v: 'c-o', t: 'BD' }, '?'],
            opciones: opciones(bd, [
              { id: 'mitad', valor: a / 2, error: 'GE8', siFuera: 'La mitad la da la mediana, no la bisectriz.' },
              { id: 'invertida', valor: a * b / (b + c), error: 'GE22', siFuera: 'Esa es DC: BD va con su lado vecino AB.' },
              { id: 'razon', valor: c / b, error: 'GE-THA2', siFuera: 'Esa es la razón; falta repartir BC con ella.' },
            ], n => f(n)),
            solucion: { texto: `BC se reparte en razón ${c} : ${b}.`, ecuacion: [{ v: 'c-o', t: 'BD' }, ` = ${a} · `, frac(`${c}`, `${c} + ${b}`), ` = ${f(bd)}`] },
          };
        }
        return {
          pregunta: ['En el triángulo ABC, ', { v: 'c-o', t: 'AB' }, ` = ${c}, `, { v: 'c-i', t: 'AC' }, ` = ${b} y BC = ${a}. I es el incentro y AD, la bisectriz de A. ¿Cuánto vale AI/ID?`],
          opciones: opciones((b + c) / a, [
            { id: 'invertida', valor: a / (b + c), error: 'GE22', siFuera: 'Esa razón está invertida: AI es el tramo largo.' },
            { id: 'lados', valor: c / b, error: 'GE-THA2', siFuera: 'AB/AC es la razón en que D parte BC, no la de AI con ID.' },
            { id: 'baricentro', valor: 2, error: 'GE-THA2', siFuera: '2 : 1 es la razón del baricentro en las medianas.' },
          ], n => f(n)),
          solucion: { texto: 'La bisectriz desde B parte AD en la razón AB : BD.', ecuacion: [frac('AI', 'ID'), ' = ', frac(`${c} + ${b}`, `${a}`), ` = ${f((b + c) / a)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: Ceva y Menelao ----------
  // Cambia: D en BC y E en CA · Permanece: el triángulo · Progresa: el producto de las tres razones, siempre 1 ·
  // Se reserva: tres puntos alineados (Menelao) · Debe verse: concurrencia y colinealidad se prueban con el mismo producto.
  const MA = [1.6, 5], MB = [0, 0], MC = [7, 0];
  const ceva = (td, te) => {
    const D = U.mezcla(MB, MC, td), E = U.mezcla(MC, MA, te), P = U.corte(MA, D, MB, E), F = U.corte(MC, P, MA, MB);
    const r1 = U.dist(MA, F) / U.dist(F, MB), r2 = U.dist(MB, D) / U.dist(D, MC), r3 = U.dist(MC, E) / U.dist(E, MA);
    return {
      d: { alt: `Cevianas AD, BE y CF concurrentes en P: AF/FB · BD/DC · CE/EA = ${f(r1 * r2 * r3)}`, vista: { x: [-0.8, 7.8], y: [-0.8, 5.6] },
        puntos: [pt('A', MA, { rotulo: 'A', lado: 90 }), pt('B', MB, { rotulo: 'B', lado: -120 }), pt('C', MC, { rotulo: 'C', lado: -60 }), pt('D', D, { rotulo: 'D', color: 'o', lado: -90 }),
          pt('E', E, { rotulo: 'E', color: 'i', lado: 30 }), pt('F', F, { rotulo: 'F', color: 'd', lado: 160 }), pt('P', P, { rotulo: 'P', color: 'h', lado: -30 })],
        regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.05 }],
        segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'A', a: 'D', color: 'o' }, { de: 'B', a: 'E', color: 'i' }, { de: 'C', a: 'F', color: 'd' }] },
      r: [r1, r2, r3],
    };
  };
  const mene = (o = {}) => {
    const F = U.mezcla(MA, MB, 0.5), D = U.mezcla(MB, MC, 0.7), E = U.corte(F, D, MC, MA), k = o.pasos || {};
    const G = U.corte(MC, [MC[0] + (MA[0] - MB[0]), MC[1] + (MA[1] - MB[1])], F, D);
    const r1 = U.dist(MA, F) / U.dist(F, MB), r2 = U.dist(MB, D) / U.dist(D, MC), r3 = U.dist(MC, E) / U.dist(E, MA);
    return {
      d: { alt: o.alt || `Una recta corta AB en F, BC en D y la prolongación de CA en E: AF/FB · BD/DC · CE/EA = ${f(r1 * r2 * r3)}`, vista: { x: [-0.8, 12], y: [-3.2, 5.6] },
        puntos: [pt('A', MA, { rotulo: 'A', lado: 90 }), pt('B', MB, { rotulo: 'B', lado: -120 }), pt('C', MC, { rotulo: 'C', lado: 60 }), pt('D', D, { rotulo: 'D', color: 'o', lado: -120 }),
          pt('E', E, { rotulo: 'E', color: 'i', lado: -45 }), pt('F', F, { rotulo: 'F', color: 'd', lado: 160 }), ...(o.G ? [pt('G', G, { rotulo: 'G', lado: 0, desde: k.g || 0 })] : [])],
        regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.05 }],
        segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'C', a: 'E', discontinua: true }, { de: 'F', a: 'E', color: 'h', grosor: 'variable' },
          ...(o.G ? [{ de: 'C', a: 'G', color: 'd', paralela: 1, desde: k.g || 0 }, { de: 'A', a: 'B', paralela: 1, desde: k.g || 0 }] : [])],
        rotulos: o.num ? [{ x: 11.8, y: 3.4, ancla: 'end', texto: `${f(r1)} · ${f(r2)} · ${f(r3)} = 1`, color: 'h' }] : [] },
      r: [r1, r2, r3],
    };
  };
  const cevaIdea = {
    id: 'ceva-menelao',
    titulo: 'Tres razones cuyo producto es 1',
    temas: ['Menelao y Ceva'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Las cevianas AD, BE y CF pasan por un mismo punto P. Mueve D y E; F se acomoda. Mira el producto de las razones.',
      voz: 'Mueve D y E. Comprueba si el producto cambia.',
      controles: [
        { id: 'd', etiqueta: 'D en BC', min: 0.2, max: 0.8, paso: 0.1, inicio: 0.5, unidad: '', decimales: 1, color: 'c-o' },
        { id: 'e', etiqueta: 'E en CA', min: 0.2, max: 0.8, paso: 0.1, inicio: 0.4, unidad: '', decimales: 1, color: 'c-i' },
      ],
      dibujo: v => ({ datos: ceva(v.d, v.e).d, estado: {} }),
      // Se agarran D (corre por BC) y E (corre por CA); F se acomoda solo.
      arrastres: [
        { id: 'punto-d', etiqueta: 'punto D en BC', color: 'c-o',
          donde: v => enPantalla(ceva(v.d, v.e).d, U.mezcla(MB, MC, v.d)),
          mover: (p, v) => ({ d: sobre(ceva(v.d, v.e).d, MB, MC, p) }) },
        { id: 'punto-e', etiqueta: 'punto E en CA', color: 'c-i',
          donde: v => enPantalla(ceva(v.d, v.e).d, U.mezcla(MC, MA, v.e)),
          mover: (p, v) => ({ e: sobre(ceva(v.d, v.e).d, MC, MA, p) }) },
      ],
      lectura: v => { const [a, b, c] = ceva(v.d, v.e).r; return [`${f(a)} · ${f(b)} · ${f(c)} = ${f(a * b * c)}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora no hay cevianas: una recta corta AB en F, BC en D y la prolongación de CA en E. ¿Cuánto vale AF/FB · BD/DC · CE/EA, con largos?',
      voz: 'Un punto quedó fuera del lado. ¿Cambia el producto?',
      opciones: [
        { id: 'c', texto: '1, también', correcta: true },
        { id: 'menos', texto: 'Menos de 1, porque E está fuera', error: 'GE-CEV1', siFuera: 'E fuera sí cambia la figura. Con largos, el producto vuelve a ser 1.' },
        { id: 'nada', texto: 'No se puede usar: E no está en el lado', error: 'GE-CEV1', siFuera: 'Ceva pide puntos en los lados; este es otro teorema, que acepta prolongaciones.' },
        { id: 'menos1', texto: '−1', error: 'GE-CEV2', siFuera: '−1 aparece con razones con signo. Con largos, como aquí, vale 1.' },
      ],
      dibujo: { datos: mene().d, estado: {} },
      revelar: { datos: mene({ num: true }).d, estado: {} },
      coincide: 'Coincide: es el teorema de Menelao. El producto, con largos, también es 1.',
    },
    // Hallazgo 9: «Mira» prueba Menelao, el caso de la predicción, no las cevianas del juego: son dos teoremas con el
    // mismo producto, y la paralela por C solo tiene sentido con la recta que corta los tres lados.
    mira: {
      datos: mene({ G: true, num: true, pasos: { g: 1 }, alt: 'Por C se traza una paralela a AB que corta la recta en G: dos pares de triángulos semejantes dan el producto 1' }).d,
      voz: 'Una paralela por C da dos semejanzas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Por C trazamos una paralela a AB; corta la recta en G.', ecuacion: ['CG ∥ AB'] },
        { estado: { corte: 1 }, texto: 'CGD y BFD son semejantes.', ecuacion: [frac('CG', 'BF'), ' = ', frac('DC', 'BD')] },
        { estado: { corte: 1 }, texto: 'CGE y AFE también.', ecuacion: [frac('CG', 'AF'), ' = ', frac('CE', 'EA')] },
        { estado: { corte: 1 }, texto: 'Divide una entre otra y ordena.', ecuacion: [frac('AF', 'FB'), ' · ', frac('BD', 'DC'), ' · ', frac('CE', 'EA'), ' = 1'] },
      ],
    },
    regla: {
      texto: 'Ceva: tres cevianas concurren si el producto de las razones, recorriendo el triángulo, vale 1. Menelao: tres puntos de lados o prolongaciones están alineados si vale 1.',
      ecuacion: [frac('AF', 'FB'), ' · ', frac('BD', 'DC'), ' · ', frac('CE', 'EA'), ' = 1'],
      condicion: 'se usan largos y se recorre A → F → B → D → C → E → A. En Menelao quedan uno o tres puntos afuera.',
      voz: 'Recorre el triángulo en orden: así no se cruzan los tramos.',
    },
    ahoraTu: {
      voz: 'Recorre el triángulo en orden y despeja la razón que falta.',
      generar(s) {
        const r = azar(s), p = r.ent(1, 5), q = r.ent(1, 5), m = r.ent(2, 6), n = r.ent(2, 6);
        const x = (q * n) / (p * m); // CE/EA para que (p/q)(m/n)x = 1
        const nom = s % 2 === 0 ? 'Las cevianas AD, BE y CF son concurrentes' : 'Una recta corta AB en F, BC en D y la prolongación de CA en E';
        return {
          pregunta: [`${nom}. Si AF/FB = ${p}/${q} y BD/DC = ${m}/${n}, ¿cuánto vale CE/EA?`],
          opciones: opciones(x, [
            { id: 'producto', valor: (p * m) / (q * n), error: 'GE-CEV3', siFuera: 'Ese es el producto de las dos razones dadas; la tercera es su inversa.' },
            { id: 'suma', valor: (p * m + q * n) / (q * n), error: 'GE-CEV3', siFuera: 'El teorema multiplica las razones; no las suma.' },
            { id: 'una', valor: (q * m) / (p * n), error: 'GE-CEV3', siFuera: 'Esa invierte solo una de las razones; hay que invertir el producto completo.' },
            { id: 'uno', valor: 1, error: 'GE-CEV3', siFuera: 'El producto de las tres vale 1; cada razón por separado, no.' },
          ], n2 => f(n2)),
          solucion: { texto: 'El producto de las tres razones es 1.', ecuacion: [`${p}/${q} · ${m}/${n} · x = 1 → x = ${f(x)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: criterios de semejanza ----------
  // Cambia: la escala y el giro de la copia · Permanece: los ángulos · Progresa: los lados ×k ·
  // Se reserva: la antiparalela (correspondencia cruzada) · Debe verse: se emparejan los lados opuestos a ángulos iguales.
  const base = [[0, 0], [4, 0], [1.2, 2.6]];
  // Centro de la copia y posición de B′: la copia gira y se escala alrededor de (8; 1).
  const G0s = [(0 + 4 + 1.2) / 3, 2.6 / 3];
  const vertB2 = (k, giro) => { const v = [4 - G0s[0], -G0s[1]], q = U.polar([0, 0], Math.hypot(...v) * k, U.grados(Math.atan2(v[1], v[0])) + giro); return [q[0] + 8, q[1] + 1]; };
  const copia = (k, giro) => {
    const G0 = [(0 + 4 + 1.2) / 3, 2.6 / 3];
    const c = base.map(p => { const v = [p[0] - G0[0], p[1] - G0[1]], q = U.polar([0, 0], Math.hypot(...v) * k, U.grados(Math.atan2(v[1], v[0])) + giro); return [q[0] + 8, q[1] + 1]; });
    const nom = ['A', 'B', 'C'], nomp = ["A'", "B'", "C'"];
    return {
      alt: `Triángulo ABC y su copia A'B'C' a escala ${f(k)} y girada ${giro}°: mismos ángulos, lados multiplicados por ${f(k)}`,
      vista: { x: [-0.6, 11.4], y: [-2.4, 4.4] },
      puntos: base.map((p, i) => pt(nom[i], p, { rotulo: nom[i] })).concat(c.map((p, i) => pt('p' + i, p, { rotulo: nomp[i] }))),
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.12 }, { puntos: ['p0', 'p1', 'p2'], color: 'o', opacidad: 0.12 }],
      segmentos: [{ de: 'A', a: 'B', texto: '4' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'p0', a: 'p1', color: 'o', texto: f(4 * k) }, { de: 'p1', a: 'p2', color: 'o' }, { de: 'p2', a: 'p0', color: 'o' }],
      angulos: [{ en: 'A', de: 'B', a: 'C', color: 'd', rayita: 1 }, { en: 'p0', de: 'p1', a: 'p2', color: 'd', rayita: 1 }, { en: 'B', de: 'C', a: 'A', color: 'h', rayita: 2 }, { en: 'p1', de: 'p2', a: 'p0', color: 'h', rayita: 2 }],
    };
  };
  const anti = (AB, AC, AE, o = {}) => {
    const A = [0, 0], B = [AB, 0], C = U.polar(A, AC, 52), AD = AC * AE / AB, D = [AD, 0], E = U.polar(A, AE, 52), k = o.pasos || {};
    return {
      alt: o.alt || `Triángulo ABC con D en AB y E en AC; el ángulo ADE es igual al ángulo ACB, así que ADE es semejante a ACB`,
      vista: { x: [-0.8, AB + 0.8], y: [-1, AC * Math.sin(U.rad(52)) + 0.9] },
      puntos: [pt('A', A, { rotulo: 'A', lado: -135 }), pt('B', B, { rotulo: 'B', lado: -45 }), pt('C', C, { rotulo: 'C', lado: 90 }), pt('D', D, { rotulo: 'D', color: 'h', lado: -90 }), pt('E', E, { rotulo: 'E', lado: 140 })],
      regiones: [{ puntos: ['A', 'D', 'E'], color: 'o', opacidad: 0.18, desde: k.tri || 0 }],
      segmentos: [{ de: 'A', a: 'B', texto: `AB = ${f(AB)}`, lado: -1 }, { de: 'B', a: 'C' }, { de: 'A', a: 'C' }, { de: 'D', a: 'E', color: 'o', grosor: 'variable' },
        { de: 'A', a: 'E', color: 'i', grosor: 'variable', texto: `${f(AE)}`, lado: 1 }, { de: 'A', a: 'D', color: 'h', grosor: 'variable', texto: o.sol ? f(AD) : 'x' },
        { de: 'E', a: 'C', texto: o.sinAC ? undefined : `AC = ${f(AC)}`, lado: 1, grosor: 'fino' }],
      angulos: [{ en: 'D', de: 'A', a: 'E', color: 'd', rayita: 1, radio: 22 }, { en: 'C', de: 'A', a: 'B', color: 'd', rayita: 1, radio: 26 }, { en: 'A', de: 'B', a: 'C', color: 'h', radio: 18, desde: k.a || 0 }],
    };
  };
  const semejanza = {
    id: 'semejanza',
    titulo: 'Emparejar lados por sus ángulos',
    temas: ['Criterios de semejanza de triángulos'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'La copia A′B′C′ tiene los mismos ángulos que ABC. Cambia su escala k y gírala. Mira qué lado queda frente a cada marca.',
      voz: 'Gira la copia. Sigue los ángulos marcados, no la posición.',
      controles: [
        { id: 'k', etiqueta: 'k', min: 0.5, max: 1.5, paso: 0.25, inicio: 1, unidad: '', decimales: 2, color: 'c-o' },
        { id: 'g', etiqueta: 'giro', min: 0, max: 180, paso: 45, inicio: 45, unidad: '°', decimales: 0 },
      ],
      dibujo: v => ({ datos: copia(v.k, v.g), estado: {} }),
      // Se agarra B′ de la copia: alejarlo del centro la agranda (k) y rodearlo la gira.
      arrastres: [{ id: 'vertice-b2', etiqueta: 'vértice B′ de la copia', color: 'c-o',
        donde: v => enPantalla(copia(v.k, v.g), vertB2(v.k, v.g)),
        mover: (p, v) => {
          const q = alPlano(copia(v.k, v.g), p), w = [q[0] - 8, q[1] - 1], b = [4 - G0s[0], -G0s[1]];
          let g = U.grados(Math.atan2(w[1], w[0]) - Math.atan2(b[1], b[0]));
          g = ((g % 360) + 360) % 360; if (g > 270) g -= 360;
          return { k: Math.hypot(...w) / Math.hypot(...b), g };
        } }],
      lectura: v => ["A'B'/AB = ", `${f(v.k)}   ·   mismos ángulos`],
      minimo: 4,
    },
    predice: {
      pregunta: 'En el triángulo ABC, AB = 9 y AC = 6. D está en AB y E en AC, con AE = 3 y el ángulo ADE igual al ángulo ACB. ¿Cuánto mide AD?',
      voz: 'Antes de escribir la razón, empareja los ángulos iguales.',
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'posicion', texto: '4,5', error: 'GE22', siFuera: 'AD/AB = AE/AC sería cierto si DE fuera paralela a BC. Aquí D corresponde a C.' },
        { id: 'mitad', texto: '3', error: 'GE-SEM1', siFuera: 'Igual a AE sería cierto si el triángulo ADE fuera isósceles; no hay dato para eso.' },
        { id: 'resta', texto: '6', error: 'GE-SEM1', siFuera: 'Restar 9 − 3 supone que AD y AE se completan entre sí; están en lados distintos.' },
      ],
      dibujo: { datos: anti(9, 6, 3), estado: {} },
      revelar: { datos: anti(9, 6, 3, { sol: true }), estado: {} },
      coincide: 'Coincide: ADE ∼ ACB, así que AD/AC = AE/AB.',
    },
    mira: {
      datos: anti(9, 6, 3, { sol: true, pasos: { a: 1, tri: 2 } }),
      voz: 'Escribe la correspondencia antes de la razón.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El ángulo A es común a los dos triángulos.', ecuacion: ['∠A = ∠A'] },
        { estado: { corte: 2 }, texto: '∠ADE = ∠ACB. Por AA, ADE ∼ ACB: D va con C.', ecuacion: ['A↔A', '   ·   ', 'D↔C', '   ·   ', 'E↔B'] },
        { estado: { corte: 2 }, texto: 'Lados frente a ángulos iguales: AD con AC, AE con AB.', ecuacion: [frac({ v: 'c-h', t: 'AD' }, 'AC'), ' = ', frac({ v: 'c-i', t: 'AE' }, 'AB'), ' → ', { v: 'c-h', t: 'AD' }, ' = ', frac('6 · 3', '9'), ' = 2'] },
      ],
    },
    regla: {
      texto: 'Dos triángulos son semejantes con dos ángulos iguales (AA), con un ángulo igual entre lados proporcionales (LAL) o con los tres lados proporcionales (LLL).',
      ecuacion: [frac("A'B'", 'AB'), ' = ', frac("B'C'", 'BC'), ' = ', frac("C'A'", 'CA'), ' = ', { llave: ['k'], nota: 'escala', color: 'c-o' }],
      condicion: 'los lados se emparejan por los ángulos opuestos iguales, no por su posición en el dibujo.',
      voz: 'Escribe primero qué vértice va con cuál.',
    },
    ahoraTu: {
      voz: 'Decide si DE es paralela o antiparalela; después empareja.',
      generar(s) {
        const r = azar(s), AB = r.ent(6, 12), AC = r.ent(4, 10), AE = r.ent(2, Math.min(AC, AB) - 1), par = s % 2 === 1;
        const bien = par ? AB * AE / AC : AC * AE / AB, malo = par ? AC * AE / AB : AB * AE / AC;
        return {
          pregunta: par ? [`En el triángulo ABC, AB = ${AB} y AC = ${AC}. D está en AB y E en AC, con AE = ${AE} y DE paralela a BC. ¿Cuánto mide AD?`]
            : [`En el triángulo ABC, AB = ${AB} y AC = ${AC}. D está en AB y E en AC, con AE = ${AE} y el ángulo ADE igual al ACB. ¿Cuánto mide AD?`],
          dibujo: par ? undefined : { datos: anti(AB, AC, AE), estado: {} },
          opciones: opciones(bien, [
            { id: 'cruzada', valor: malo, error: 'GE22', siFuera: par ? 'Esa razón empareja AD con AC; con DE paralela, D va con B.' : 'Esa razón supone DE paralela a BC; aquí D va con C.' },
            { id: 'igual', valor: AE, error: 'GE-SEM1', siFuera: 'AD igual a AE supondría un isósceles; no hay ese dato.' },
            { id: 'resta', valor: AB - AE, error: 'GE-SEM1', siFuera: 'AD y AE están en lados distintos: no se completan entre sí.' },
          ], n => f(n)),
          solucion: { texto: par ? 'Paralela: D va con B y E con C.' : 'Antiparalela: D va con C y E con B.', ecuacion: par ? ['AD/AB = AE/AC → AD = ', `${AB} · ${AE} / ${AC} = ${f(bien)}`] : ['AD/AC = AE/AB → AD = ', `${AC} · ${AE} / ${AB} = ${f(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: el área cambia con el cuadrado de la escala (microguion «Geometría 6») ----------
  // Cambia: la escala k · Permanece: la forma (3 por 2) · Progresa: copias del original dentro de la ampliada ·
  // Se reserva: la cuadrícula (el área se revela al contar) · Debe verse: la escala actúa en las dos dimensiones.
  const ampl = (k, o = {}) => {
    const W = 3, H = 2, x0 = 4.4;
    const reg = [{ puntos: [[0, 0], [W, 0], [W, H], [0, H]], color: 'i', opacidad: 0.25, sinBorde: false },
      { puntos: [[x0, 0], [x0 + W * k, 0], [x0 + W * k, H * k], [x0, H * k]], color: 'o', opacidad: 0.14, sinBorde: false }];
    if (o.copias) for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) reg.push({ puntos: [[x0 + W * i, H * j], [x0 + W * (i + 1), H * j], [x0 + W * (i + 1), H * (j + 1)], [x0 + W * i, H * (j + 1)]], color: 'i', opacidad: 0.18, discontinua: true, desde: o.copias === 'paso' ? 1 : 0 });
    if (o.fantasma) reg.push({ puntos: [[x0, 0], [x0 + W * k, 0], [x0 + W * k, H], [x0, H]], color: 'h', opacidad: 0.12, discontinua: true });
    return {
      alt: o.alt || `Rectángulo de 3 por 2 y su ampliación a escala ${f(k)}: ${f(3 * k)} por ${f(2 * k)}${o.copias ? `; caben ${f(k * k)} copias del original` : ''}`,
      vista: { x: [-0.6, x0 + 9.4], y: [-0.9, 6.6] },
      cuadricula: o.cuadricula ? { paso: 1 } : undefined,
      puntos: [pt('a', [0, 0], { sinPunto: true }), pt('b', [W, 0], { sinPunto: true }), pt('c', [0, H], { sinPunto: true }), pt('A', [x0, 0], { sinPunto: true }), pt('B', [x0 + W * k, 0], { sinPunto: true }), pt('C', [x0, H * k], { sinPunto: true })],
      regiones: reg,
      segmentos: [{ de: 'a', a: 'b', color: 'i', texto: '3' }, { de: 'a', a: 'c', color: 'i', texto: '2' },
        { de: 'A', a: 'B', color: 'o', grosor: 'variable', texto: f(3 * k), lado: -1 }, { de: 'A', a: 'C', color: 'o', grosor: 'variable', texto: f(2 * k), lado: -1 }],
    };
  };
  const areaEscala = {
    id: 'area-y-escala',
    titulo: 'El área crece con k²',
    temas: ['Criterios de semejanza de triángulos'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'El rectángulo de 3 por 2 se amplía con escala k: cada lado se multiplica por k. Cambia k y mira lados y perímetro.',
      voz: 'Cambia k. Sigue los dos lados a la vez.',
      controles: [{ id: 'k', etiqueta: 'k', min: 0.5, max: 3, paso: 0.5, inicio: 1.5, unidad: '', decimales: 1, color: 'c-o' }],
      dibujo: v => ({ datos: ampl(v.k), estado: {} }),
      // Se agarra la esquina de arriba a la derecha de la ampliada: corre por la diagonal, así los dos lados crecen juntos.
      arrastres: [{ id: 'esquina', etiqueta: 'esquina de la ampliada', color: 'c-o',
        donde: v => enPantalla(ampl(v.k), [4.4 + 3 * v.k, 2 * v.k]),
        mover: (p, v) => ({ k: sobre(ampl(v.k), [4.4, 0], [7.4, 2], p) }) }],
      lectura: v => [`lados ${f(3 * v.k)} y ${f(2 * v.k)}   ·   perímetro 10 → ${f(10 * v.k)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Duplicamos los dos lados del rectángulo de 3 por 2 (k = 2). ¿Cuántas veces aumenta su área?',
      voz: 'Piensa en el área, no en el perímetro.',
      opciones: [
        { id: 'c', texto: '4 veces', correcta: true },
        { id: 'lineal', texto: '2 veces', error: 'GE1', siFuera: 'El doble funciona si cambia solo un lado. Aquí cambian ambos.' },
        { id: 'seis', texto: '6 veces', error: 'GE1', siFuera: 'Seis es el área original; el factor sale de multiplicar k por k.' },
        { id: 'cubo', texto: '8 veces', error: 'GE2', siFuera: '8 = 2³ sería el factor de un volumen, con tres dimensiones.' },
      ],
      dibujo: { datos: ampl(2), estado: {} },
      revelar: { datos: ampl(2, { copias: true, cuadricula: true }), estado: {} },
      coincide: 'Coincide: caben 4 copias del original. Área 6 → 24.',
    },
    mira: {
      datos: ampl(3, { copias: 'paso', cuadricula: true, alt: 'Con escala 3, el rectángulo de 9 por 6 contiene 9 copias del original de 3 por 2' }),
      voz: 'Cuenta copias completas. Así la regla sale sola.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Con k = 3, la ampliada mide 9 por 6.', ecuacion: ['3 · 3 = 9', '   ·   ', '2 · 3 = 6'] },
        { estado: { corte: 1 }, texto: 'Caben 3 copias a lo ancho y 3 a lo alto: 9.', ecuacion: ['3 · 3 = 9 copias'] },
        { estado: { corte: 1 }, texto: 'Cada lado aporta su k: el área se multiplica por k · k.', ecuacion: ["A' = (k b)(k h) = ", { sup: ['k', '2'] }, ' A = 9 · 6 = 54'] },
      ],
    },
    regla: {
      texto: 'En figuras semejantes de razón k, las longitudes y el perímetro se multiplican por k, las áreas por k² y los volúmenes por k³.',
      ecuacion: ["P' = k P", '   ·   ', "A' = ", { sup: ['k', '2'] }, ' A', '   ·   ', "V' = ", { sup: ['k', '3'] }, ' V'],
      condicion: 'todas las longitudes se multiplican por el mismo k > 0. Si cambia solo un lado, ya no son semejantes.',
      voz: 'La escala actúa en cada dimensión: dos en el área.',
    },
    ahoraTu: {
      voz: 'Decide qué magnitud te piden: longitud, perímetro o área.',
      generar(s) {
        const r = azar(s), tipo = s % 3, k = r.de([2, 3, 4, 0.5]), A = r.ent(3, 15), P = r.ent(8, 30);
        if (tipo === 2) return {
          pregunta: [`Un triángulo de perímetro ${P} se amplía a escala k = ${f(k)}. ¿Cuál es el perímetro del triángulo ampliado?`],
          opciones: opciones(P * k, [
            { id: 'cuadrado', valor: P * k * k, error: 'GE1', siFuera: 'k² es el factor de las áreas; el perímetro es una longitud.' },
            { id: 'igual', valor: P, error: 'GE1', siFuera: 'El perímetro sí cambia: cada lado se multiplica por k.' },
            { id: 'suma', valor: P + k, error: 'GE1', siFuera: 'La escala multiplica; no suma.' },
          ], n => f(n)),
          solucion: { texto: 'El perímetro es una longitud: se multiplica por k.', ecuacion: [`${P} · ${f(k)} = ${f(P * k)}`] },
        };
        return {
          pregunta: [`Un triángulo${tipo ? ' girado' : ''} tiene área ${A}. Se construye otro semejante con escala k = ${f(k)}. ¿Cuál es su área?`],
          opciones: opciones(A * k * k, [
            { id: 'lineal', valor: A * k, error: 'GE1', siFuera: 'Multiplicar por k funciona si cambia solo un lado. Aquí cambian base y altura.' },
            { id: 'cubo', valor: A * k ** 3, error: 'GE2', siFuera: 'k³ es para volúmenes; el área tiene dos dimensiones.' },
            { id: 'doble', valor: A * 2 * k, error: 'GE1', siFuera: 'El factor no es 2k: es k por k.' },
          ], n => f(n)),
          solucion: { texto: 'Base y altura se multiplican por k: el área por k².', ecuacion: [`${A} · `, { sup: [f(k), '2'] }, ` = ${f(A * k * k)}`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 1: D y E se mueven cada uno por su lado. La idea mantiene DE paralela; aquí el alumno
  // la inclina (el caso de la predicción) y busca a mano cuándo las dos razones vuelven a coincidir.
  const thalesLibre = (t, te) => thales(t, Math.abs(t - te) < 1e-9 ? {} : { E: U.mezcla(TA, TC, te) });
  const mesaThales = {
    id: 'corte-libre', titulo: 'Corte paralelo o inclinado', pieza: 'geo-figura',
    consigna: 'Arrastra D y E por separado. Compara las dos razones y busca cuándo DE queda paralela a BC.',
    controles: [
      { id: 't', etiqueta: 'D desde A', min: 0.1, max: 0.9, paso: 0.1, inicio: 0.4, unidad: 'de AB', decimales: 1, color: 'c-o' },
      { id: 'te', etiqueta: 'E desde A', min: 0.1, max: 0.9, paso: 0.1, inicio: 0.6, unidad: 'de AC', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: thalesLibre(v.t, v.te), estado: {} }),
    arrastres: [
      { id: 'punto-d', etiqueta: 'punto D en AB', color: 'c-o',
        donde: v => enPantalla(thalesLibre(v.t, v.te), U.mezcla(TA, TB, v.t)),
        mover: (p, v) => ({ t: sobre(thalesLibre(v.t, v.te), TA, TB, p) }) },
      { id: 'punto-e', etiqueta: 'punto E en AC', color: 'c-i',
        donde: v => enPantalla(thalesLibre(v.t, v.te), U.mezcla(TA, TC, v.te)),
        mover: (p, v) => ({ te: sobre(thalesLibre(v.t, v.te), TA, TC, p) }) },
    ],
    lectura: v => [frac({ v: 'c-o', t: 'AD' }, { v: 'c-i', t: 'DB' }), ` = ${f(v.t / (1 - v.t))}   ·   `, frac({ v: 'c-o', t: 'AE' }, { v: 'c-i', t: 'EC' }),
      ` = ${f(v.te / (1 - v.te))}${Math.abs(v.t - v.te) < 1e-9 ? ': paralela' : ''}`],
  };
  // Mesa 2, más rica que la idea 2: además de los lados, se abre el ángulo A. Deja ver que la razón BD/DC no depende
  // del ángulo, solo de AB y AC.
  const bisecLibre = (c, b, ang) => {
    const A = [0, 0], B = U.polar(A, c, 270 - ang / 2), C = U.polar(A, b, 270 + ang / 2);
    const D = [(b * B[0] + c * C[0]) / (b + c), (b * B[1] + c * C[1]) / (b + c)];
    return {
      alt: `AB = ${f(c)}, AC = ${f(b)} y ángulo A de ${ang}°: la bisectriz corta BC en D con BD/DC = ${f(c / b)}`,
      vista: { x: [-7.4, 7.4], y: [-7.4, 0.9] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: 'B', lado: 180 }), pt('C', C, { rotulo: 'C', lado: 0 }), pt('D', D, { rotulo: 'D', color: 'h', lado: -90 })],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable', texto: f(c) }, { de: 'A', a: 'C', color: 'i', grosor: 'variable', texto: f(b) },
        { de: 'B', a: 'D', color: 'o', texto: f(U.dist(B, D)) }, { de: 'D', a: 'C', color: 'i', texto: f(U.dist(D, C)) }, { de: 'A', a: 'D', color: 'h', discontinua: true }],
      angulos: [{ en: 'A', de: 'B', a: 'D', color: 'h', rayita: 1, radio: 26 }, { en: 'A', de: 'D', a: 'C', color: 'h', rayita: 1, radio: 26 }],
    };
  };
  const dirB = g => (g > 90 ? g - 360 : g);
  const mesaBisectriz = {
    id: 'bisectriz-libre', titulo: 'Bisectriz con ángulo libre', pieza: 'geo-figura',
    consigna: 'Arrastra B y C: cambian los lados y la abertura de A. Mira si la razón BD/DC depende del ángulo.',
    controles: [
      { id: 'c', etiqueta: 'AB', min: 1, max: 7, paso: 0.5, inicio: 3, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'b', etiqueta: 'AC', min: 1, max: 7, paso: 0.5, inicio: 6, unidad: '', decimales: 1, color: 'c-i' },
      { id: 'ang', etiqueta: '∠A', min: 50, max: 150, paso: 10, inicio: 70, unidad: '°', decimales: 0, color: 'c-h' },
    ],
    dibujo: v => ({ datos: bisecLibre(v.c, v.b, v.ang), estado: {} }),
    arrastres: [
      // Se agarra B: su distancia a A es AB y su dirección abre o cierra el ángulo (simétrico respecto a la bisectriz).
      { id: 'vertice-b', etiqueta: 'vértice B', color: 'c-o',
        donde: v => enPantalla(bisecLibre(v.c, v.b, v.ang), U.polar([0, 0], v.c, 270 - v.ang / 2)),
        mover: (p, v) => { const q = alPlano(bisecLibre(v.c, v.b, v.ang), p); return { c: Math.hypot(...q), ang: 2 * (-90 - dirB(U.grados(Math.atan2(q[1], q[0])))) }; } },
      { id: 'vertice-c', etiqueta: 'vértice C', color: 'c-i',
        donde: v => enPantalla(bisecLibre(v.c, v.b, v.ang), U.polar([0, 0], v.b, 270 + v.ang / 2)),
        mover: (p, v) => { const q = alPlano(bisecLibre(v.c, v.b, v.ang), p); return { b: Math.hypot(...q), ang: 2 * (90 + U.grados(Math.atan2(q[1], q[0]))) }; } },
    ],
    lectura: v => [{ v: 'c-h', t: '∠A' }, ` ${v.ang}°   ·   `, frac({ v: 'c-o', t: 'BD' }, { v: 'c-i', t: 'DC' }), ' = ', frac({ v: 'c-o', t: 'AB' }, { v: 'c-i', t: 'AC' }), ` = ${f(v.c / v.b)}`],
  };
  // Mesa 3, más rica que la idea 5: ancho y alto con escalas distintas. Con kx ≠ ky la figura ya no es semejante y el
  // área se multiplica por kx · ky; solo con kx = ky aparece k².
  const ampl2 = (kx, ky) => {
    const x0 = 4.4;
    return {
      alt: `Rectángulo de 3 por 2 estirado ${f(kx)} veces a lo ancho y ${f(ky)} a lo alto: ${f(3 * kx)} por ${f(2 * ky)}, área ${f(6 * kx * ky)}`,
      vista: { x: [-0.6, x0 + 9.4], y: [-0.9, 6.6] },
      cuadricula: { paso: 1 },
      puntos: [pt('a', [0, 0], { sinPunto: true }), pt('b', [3, 0], { sinPunto: true }), pt('c', [0, 2], { sinPunto: true }), pt('A', [x0, 0], { sinPunto: true }), pt('B', [x0 + 3 * kx, 0], { sinPunto: true }), pt('C', [x0, 2 * ky], { sinPunto: true })],
      regiones: [{ puntos: [[0, 0], [3, 0], [3, 2], [0, 2]], color: 'i', opacidad: 0.25 },
        { puntos: [[x0, 0], [x0 + 3 * kx, 0], [x0 + 3 * kx, 2 * ky], [x0, 2 * ky]], color: kx === ky ? 'o' : 'h', opacidad: 0.14 }],
      segmentos: [{ de: 'a', a: 'b', color: 'i', texto: '3' }, { de: 'a', a: 'c', color: 'i', texto: '2' },
        { de: 'A', a: 'B', color: 'o', grosor: 'variable', texto: f(3 * kx), lado: -1 }, { de: 'A', a: 'C', color: 'o', grosor: 'variable', texto: f(2 * ky), lado: -1 }],
    };
  };
  const mesaEstirar = {
    id: 'estirar', titulo: 'Ampliar o estirar', pieza: 'geo-figura',
    consigna: 'Arrastra la esquina a cualquier lugar. Compara el factor del área con k² cuando las dos escalas coinciden.',
    controles: [
      { id: 'kx', etiqueta: 'k a lo ancho', min: 0.5, max: 3, paso: 0.5, inicio: 2, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'ky', etiqueta: 'k a lo alto', min: 0.5, max: 3, paso: 0.5, inicio: 1, unidad: '', decimales: 1, color: 'c-o' },
    ],
    dibujo: v => ({ datos: ampl2(v.kx, v.ky), estado: {} }),
    // Se agarra la esquina libre: su x da el ancho y su y, el alto.
    arrastres: [{ id: 'esquina', etiqueta: 'esquina de la figura nueva', color: 'c-o',
      donde: v => enPantalla(ampl2(v.kx, v.ky), [4.4 + 3 * v.kx, 2 * v.ky]),
      mover: (p, v) => { const q = alPlano(ampl2(v.kx, v.ky), p); return { kx: (q[0] - 4.4) / 3, ky: q[1] / 2 }; } }],
    lectura: v => [`área × ${f(v.kx * v.ky)}   ·   ${v.kx === v.ky ? 'semejante' : 'no semejante'}`],
  };

  return {
    unidad: 'geometria.proporcionalidad-y-semejanza',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'El libro VI de los Elementos conecta forma y proporción. En su proposición 2, una paralela a un lado corta proporcionalmente los otros dos, y el texto también demuestra el recíproco. La prueba pasa por áreas de triángulos con alturas iguales. El nombre escolar de «Thales» no basta para saber quién descubrió cada versión.',
      pregunta: '¿Qué tienen que ver las áreas con las proporciones?',
      fuente: { titulo: 'Euclides, Elementos VI.2 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookVI/propVI2.html' },
    },
    // Laboratorio: las tres mesas son más ricas que sus ideas: D y E libres (corte inclinado), la bisectriz con el ángulo
    // A libre y el rectángulo estirado con dos escalas.
    laboratorio: [mesaThales, mesaBisectriz, mesaEstirar],
    ideas: [thalesIdea, bisectriz, cevaIdea, semejanza, areaEscala],
  };
});
