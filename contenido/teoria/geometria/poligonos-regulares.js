/*
 * Teoría de «Polígonos regulares» (geometria.poligonos-regulares). Molde: docs/teoria.md.
 * Fuente: docs/teoria/matriz/geometria.json (unidad 9); Elementos IV (polígonos inscritos) y XIII.8 (diagonal del pentágono).
 * Compañera: Neri (nutria). Pieza: geo-figura.
 *
 * Ficha de tarea
 *   Promesa: ver el polígono regular como n triángulos isósceles iguales alrededor del centro, y sacar de ahí lado,
 *     apotema, área, el paso a 2n lados y la razón áurea del pentágono.
 *   Persona y condiciones: postulante de 4.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: calcula ángulo central, lado, apotema y área; usa los inscritos notables (3, 4 y 6), la fórmula
 *     del lado de 2n y φ = (1 + √5)/2.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Estados: jugando · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿radio o apotema?»: el radio llega al vértice; la apotema, al medio del lado.
 *
 * Colores: radio naranja (c-o), apotema turquesa (c-i), lado verde (c-d), lo pedido rojo (c-h).
 * Códigos: GE-REG y GE-AUR son hipótesis nuevas (la matriz da «confundir radio y apotema» como hipótesis).
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
  const PHI = (1 + Math.sqrt(5)) / 2;
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
  const cR = { v: 'c-o', t: 'R' }, cA = { v: 'c-i', t: 'a' }, cL = { v: 'c-d', t: 'ℓ' };
  const lado = (n, R) => 2 * R * Math.sin(Math.PI / n), apot = (n, R) => R * Math.cos(Math.PI / n);
  const vert = (n, R) => Array.from({ length: n }, (_, k) => U.polar([0, 0], R, 270 - 180 / n - 360 * k / n));
  // Polígono regular con su centro, un radio, la apotema al lado de abajo y, si se pide, los n triángulos centrales.
  const reg = (n, R, o = {}) => {
    const V = vert(n, R), M = U.medio(V[0], V[n - 1]), k = o.pasos || {};
    const pts = [pt('O', [0, 0], { rotulo: 'O', lado: 90 }), ...V.map((p, i) => pt('V' + i, p, {})), pt('M', M, { sinPunto: true })];
    const seg = V.map((p, i) => ({ de: 'V' + i, a: 'V' + ((i + 1) % n), color: i === n - 1 ? 'd' : undefined, grosor: i === n - 1 ? 'variable' : undefined, texto: i === n - 1 && o.l ? o.l : undefined }));
    if (o.tri) V.forEach((p, i) => seg.push({ de: 'O', a: 'V' + i, grosor: 'fino', desde: k.tri || 0 }));
    seg.push({ de: 'O', a: 'V0', color: 'o', grosor: 'variable', texto: o.R }, { de: 'O', a: 'M', color: 'i', grosor: 'variable', texto: o.a });
    return {
      alt: o.alt || `Polígono regular de ${n} lados con radio ${f(R)}: lado ${f(lado(n, R))}, apotema ${f(apot(n, R))} y ángulo central de ${f(360 / n, 1)}°`,
      vista: o.vista || { x: [-R - 0.8, R + 0.8], y: [-R - 0.8, R + 0.8] },
      puntos: pts, segmentos: seg,
      regiones: [{ puntos: V.map((_, i) => 'V' + i), color: 'd', opacidad: 0.06 }, ...(o.tri ? [{ puntos: ['O', 'V0', `V${n - 1}`], color: 'o', opacidad: 0.2, desde: k.tri || 0 }] : [])],
      angulos: [{ en: 'M', de: 'V0', a: 'O', color: 'i' }, ...(o.central ? [{ en: 'O', de: `V${n - 1}`, a: 'V0', color: 'h', radio: 14 }] : [])],
    };
  };

  // ---------- Idea 1: ángulo central y apotema ----------
  // Cambia: el número de lados n · Permanece: el radio R = 3 · Progresa: los n triángulos centrales ·
  // Se reserva: el hexágono (radio = lado) · Debe verse: la apotema es la altura de cada triángulo, no el radio.
  const central = {
    id: 'central-y-apotema',
    titulo: 'Radio, apotema y ángulo central',
    temas: ['Ángulo central y apotema'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'El polígono regular se parte en n triángulos iguales desde el centro O. Cambia n y compara el radio con la apotema.',
      voz: 'Sube n. Mira cómo la apotema se acerca al radio.',
      controles: [{ id: 'n', etiqueta: 'n', min: 3, max: 12, paso: 1, inicio: 5, unidad: 'lados', decimales: 0 }],
      dibujo: v => ({ datos: reg(v.n, 3, { tri: true, central: true, R: 'R', a: 'a' }), estado: {} }),
      lectura: v => ['central ', `${f(360 / v.n, 1)}° · `, cR, ' = 3 · ', cA, ` = ${f(apot(v.n, 3))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Un hexágono regular tiene lado 6. ¿Cuánto mide su apotema?',
      voz: 'Ubica a dónde llega la apotema y a dónde el radio.',
      opciones: [
        { id: 'c', texto: '3√3 ≈ 5,2', correcta: true },
        { id: 'radio', texto: '6', error: 'GE-REG1', siFuera: '6 es el radio: llega al vértice. La apotema llega al medio del lado y es más corta.' },
        { id: 'mitad', texto: '3', error: 'GE-REG2', siFuera: '3 es medio lado. La apotema es la altura de cada triángulo.' },
        { id: 'sin-raiz', texto: '27', error: 'GE-REG2', siFuera: '27 es la apotema al cuadrado: falta la raíz.' },
      ],
      dibujo: { datos: reg(6, 6, { l: '6' }), estado: {} },
      revelar: { datos: reg(6, 6, { tri: true, l: '6', R: '6', a: '3√3' }), estado: {} },
      coincide: 'Coincide: cada triángulo es equilátero de lado 6 y su altura es 3√3.',
    },
    mira: {
      datos: reg(6, 6, { tri: true, central: true, l: '6', R: 'R', a: 'a', pasos: { tri: 1 }, alt: 'El hexágono regular de lado 6 son seis triángulos equiláteros: radio 6 y apotema 3√3' }),
      voz: 'Cuenta triángulos: el polígono regular está hecho de ellos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Seis triángulos iguales; el ángulo central mide 360°/6.', ecuacion: ['central = 60°'] },
        { estado: { corte: 1 }, texto: 'Con 60° y dos radios iguales, cada triángulo es equilátero: R = ℓ.', ecuacion: [cR, ' = ', cL, ' = 6'] },
        { estado: { corte: 1 }, texto: 'La apotema es la altura del triángulo.', ecuacion: [cA, ' = ', { raiz: ['6² − 3²'] }, ' = 3√3'] },
        { estado: { corte: 1 }, texto: 'Área: n triángulos de base ℓ y altura a.', ecuacion: ['S = ', frac(['P · ', cA], '2'), ' = ', frac('36 · 3√3', '2'), ' = 54√3'] },
      ],
    },
    regla: {
      texto: 'Un polígono regular de n lados son n triángulos isósceles iguales: ángulo central 360°/n, lado 2R·sen(180°/n), apotema R·cos(180°/n) y área P · a / 2.',
      ecuacion: [cL, ' = 2', cR, ' sen ', frac('180°', 'n'), '   ·   ', cA, ' = ', cR, ' cos ', frac('180°', 'n'), '   ·   S = ', frac(['P · ', cA], '2')],
      condicion: 'el polígono tiene lados y ángulos iguales. R llega al vértice y a llega perpendicular al punto medio del lado.',
      voz: 'Radio al vértice, apotema al medio del lado.',
    },
    ahoraTu: {
      voz: 'Arma el triángulo central: radio, apotema y medio lado.',
      generar(s) {
        const r = azar(s), t = s % 3, k = r.ent(2, 10);
        if (t === 0) {
          const n = r.de([5, 8, 9, 10, 12, 15, 18, 20, 24, 36]);
          return {
            pregunta: [`¿Cuánto mide el ángulo central de un polígono regular de ${n} lados?`],
            opciones: opciones(360 / n, [
              { id: 'interior', valor: 180 - 360 / n, error: 'GE-REG3', siFuera: 'Ese es el ángulo interior. El central se mide en O.' },
              { id: '180', valor: 180 / n, error: 'GE-REG3', siFuera: 'Ese es medio ángulo central: el que forma la apotema con el radio.' },
              { id: 'suma', valor: 180 * (n - 2), error: 'GE-REG3', siFuera: 'Esa es la suma de los ángulos interiores.' },
            ], x => `${f(x, 1)}°`),
            solucion: { texto: 'Los n ángulos centrales completan una vuelta.', ecuacion: [`360° ÷ ${n} = ${f(360 / n, 1)}°`] },
          };
        }
        if (t === 1) {
          const l = 2 * k;
          return {
            pregunta: ['Un hexágono regular tiene lado ', cL, ` = ${l}. ¿Cuánto mide su apotema?`],
            dibujo: { datos: reg(6, 3, { l: `${l}` }), estado: {} },
            opciones: opciones(k * Math.sqrt(3), [
              { id: 'radio', valor: l, error: 'GE-REG1', siFuera: 'Ese es el radio, igual al lado en el hexágono.' },
              { id: 'mitad', valor: k, error: 'GE-REG2', siFuera: 'Ese es medio lado.' },
              { id: 'cuad', valor: 3 * k * k, error: 'GE-REG2', siFuera: 'Ese es a²: falta la raíz.' },
            ], x => f(x)),
            solucion: { texto: 'Triángulo equilátero de lado ℓ: altura ℓ√3/2.', ecuacion: [cA, ` = ${l}√3/2 = ${f(k * Math.sqrt(3))}`] },
          };
        }
        const n = r.de([4, 6, 8, 10, 12]), a = k, l = 2 * a * Math.tan(Math.PI / n), S = n * l * a / 2;
        return {
          pregunta: [`Un polígono regular de ${n} lados tiene lado ${f(l)} y apotema ${a}. ¿Cuál es su área?`],
          opciones: opciones(S, [
            { id: 'sin2', valor: n * l * a, error: 'GE-REG4', siFuera: 'Falta la mitad: cada triángulo tiene área ℓ · a / 2.' },
            { id: 'radio', valor: n * l * l / 2, error: 'GE-REG1', siFuera: 'Eso usa el lado como altura; la altura de cada triángulo es la apotema.' },
            { id: 'per', valor: n * l, error: 'GE4', siFuera: 'Ese es el perímetro.' },
          ], x => f(x)),
          solucion: { texto: 'Área: semiperímetro por apotema.', ecuacion: [`S = ${n} · ${f(l)} · ${a} / 2 = ${f(S)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: los inscritos notables (3, 4 y 6) ----------
  // Cambia: el polígono (3, 4 o 6) · Permanece: la circunferencia de radio R · Progresa: lado y apotema en términos de R ·
  // Se reserva: la apotema del triángulo · Debe verse: en el triángulo, la apotema es un tercio de la altura: R/2.
  const NOT = { 3: ['R√3', 'R/2'], 4: ['R√2', 'R√2/2'], 6: ['R', 'R√3/2'] };
  const notIdea = {
    id: 'inscritos-notables',
    titulo: 'Triángulo, cuadrado y hexágono inscritos',
    temas: ['Polígonos regulares inscritos notables'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Elige el polígono regular inscrito en la circunferencia de radio R. Mira su lado y su apotema escritos en función de R.',
      voz: 'Cambia de polígono. Compara cada lado con R.',
      controles: [{ id: 'n', etiqueta: 'polígono', opciones: [{ valor: 4, texto: 'cuadrado' }, { valor: 6, texto: 'hexágono' }, { valor: 3, texto: 'triángulo' }] }],
      dibujo: v => ({ datos: Object.assign(reg(v.n, 3, { R: 'R', l: `ℓ = ${NOT[v.n][0]}`, a: v.n === 3 ? undefined : `a = ${NOT[v.n][1]}` }), { circulos: [{ centro: 'O', r: 3, grosor: 'fino', discontinua: true }] }), estado: {} }),
      lectura: v => [cL, ` = ${NOT[v.n][0]} · `, cA, v.n === 3 ? ' = ?' : ` = ${NOT[v.n][1]}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un triángulo equilátero está inscrito en una circunferencia de radio R = 6. ¿Cuánto mide su apotema?',
      voz: 'El centro del triángulo es también su baricentro.',
      opciones: [
        { id: 'c', texto: '3', correcta: true },
        { id: 'hex', texto: '3√3', error: 'GE-REG5', siFuera: 'R√3/2 = 3√3 es la apotema del hexágono inscrito, no la del triángulo.' },
        { id: 'radio', texto: '6', error: 'GE-REG1', siFuera: '6 es el radio: llega al vértice. La apotema llega al medio del lado.' },
        { id: 'altura', texto: '9', error: 'GE-REG5', siFuera: '9 es la altura completa del triángulo: radio más apotema.' },
      ],
      dibujo: { datos: Object.assign(reg(3, 6, { R: 'R = 6', a: 'a' }), { circulos: [{ centro: 'O', r: 6, grosor: 'fino', discontinua: true }] }), estado: {} },
      revelar: { datos: Object.assign(reg(3, 6, { R: 'R = 6', a: 'a = 3' }), { circulos: [{ centro: 'O', r: 6, grosor: 'fino', discontinua: true }] }), estado: {} },
      coincide: 'Coincide: en el triángulo equilátero la apotema es la mitad del radio.',
    },
    mira: {
      datos: Object.assign(reg(3, 6, { R: 'R = 6', a: 'a = 3', alt: 'Triángulo equilátero inscrito: el centro es el baricentro, que parte la altura en 6 y 3' }), { circulos: [{ centro: 'O', r: 6, grosor: 'fino', discontinua: true }] }),
      voz: 'Usa el baricentro: la razón 2 : 1 ya la conoces.',
      pasos: [
        { estado: { corte: 0 }, texto: 'En el equilátero, O es también el baricentro.', ecuacion: ['O = G'] },
        { estado: { corte: 0 }, texto: 'G parte la altura en 2 : 1: el radio es el tramo largo.', ecuacion: [cR, ' = 2 · ', cA] },
        { estado: { corte: 0 }, texto: 'Así la apotema es la mitad del radio.', ecuacion: [cA, ' = ', frac(cR, '2'), ' = 3 · ', cL, ' = R√3 = 6√3'] },
      ],
    },
    regla: {
      texto: 'Inscritos en la circunferencia de radio R, lado y apotema valen: triángulo, R√3 y R/2; cuadrado, R√2 y R√2/2; hexágono, R y R√3/2.',
      ecuacion: [cL, '₃ = R√3 · ', cL, '₄ = R√2 · ', cL, '₆ = R'],
      condicion: 'los polígonos son regulares y sus vértices están en la circunferencia de radio R.',
      voz: 'Tres polígonos, tres pares que conviene reconocer.',
    },
    ahoraTu: {
      voz: 'Identifica el polígono y si te piden lado o apotema.',
      generar(s) {
        const r = azar(s), R = 2 * r.ent(1, 8), n = [3, 4, 6][s % 3], pideL = (s >> 1) % 2 === 0;
        const val = pideL ? lado(n, R) : apot(n, R);
        const nom = { 3: 'un triángulo equilátero', 4: 'un cuadrado', 6: 'un hexágono regular' }[n];
        const otros = [3, 4, 6].filter(x => x !== n);
        return {
          pregunta: [`En una circunferencia de radio R = ${R} se inscribe ${nom}. ¿Cuánto mide su ${pideL ? 'lado' : 'apotema'}?`],
          opciones: opciones(val, [
            { id: 'cruz', valor: pideL ? apot(n, R) : lado(n, R), error: 'GE-REG1', siFuera: pideL ? 'Esa es la apotema; el lado une dos vértices.' : 'Ese es el lado; la apotema llega al medio del lado.' },
            { id: 'o1', valor: pideL ? lado(otros[0], R) : apot(otros[0], R), error: 'GE-REG5', siFuera: `Ese valor corresponde al polígono de ${otros[0]} lados.` },
            { id: 'o2', valor: pideL ? lado(otros[1], R) : apot(otros[1], R), error: 'GE-REG5', siFuera: `Ese valor corresponde al polígono de ${otros[1]} lados.` },
            { id: 'R', valor: R, error: 'GE-REG1', siFuera: 'Ese es el radio.' },
          ], x => f(x)),
          solucion: { texto: `Para n = ${n}: ${pideL ? `ℓ = ${NOT[n][0]}` : `a = ${NOT[n][1]}`}.`, ecuacion: [`${f(val)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: del polígono de n al de 2n lados ----------
  // Cambia: n · Permanece: R · Progresa: el polígono de 2n se acerca a la circunferencia ·
  // Se reserva: la fórmula del lado de 2n · Debe verse: medio lado y R − a forman un triángulo rectángulo.
  const doble = (n, R, o = {}) => {
    const V = vert(n, R), W = vert(2 * n, R).map((p, i) => U.polar([0, 0], R, 270 - 90 / n - 180 * i / n));
    const A = V[n - 1], Bq = V[0], M = U.medio(A, Bq), Pm = U.polar([0, 0], R, 270), k = o.pasos || {};
    return {
      alt: o.alt || `Polígono regular de ${n} lados y el de ${2 * n} lados inscritos en la misma circunferencia de radio ${R}`,
      vista: o.zoom ? { x: [-R * 0.85, R * 0.85], y: [-R - 0.6, 0.6] } : { x: [-R - 0.8, R + 0.8], y: [-R - 0.8, R + 0.8] },
      puntos: [pt('O', [0, 0], { rotulo: 'O', lado: 90 }), ...(o.zoom ? [] : [...V.map((p, i) => pt('V' + i, p, {})), ...W.map((p, i) => pt('W' + i, p, { color: 'o' }))]), pt('M', M, { rotulo: o.letras ? 'H' : undefined, lado: 45 }), pt('P', Pm, { rotulo: o.letras ? 'P' : undefined, lado: -90 }),
        pt('A', A, { rotulo: o.letras ? 'A' : undefined, lado: 225 }), pt('Bq', Bq, { rotulo: o.letras ? 'B' : undefined, lado: -45 })],
      // En la vista de detalle solo se dibuja el lado de abajo, su arco y el centro: nada queda fuera del marco.
      circulos: o.zoom ? [] : [{ centro: 'O', r: R, grosor: 'fino', discontinua: true }],
      arcos: o.zoom ? [{ centro: [0, 0], r: R, de: 270 - 180 / n, a: 270 + 180 / n, grosor: 'fino', discontinua: true }] : [],
      segmentos: [...(o.zoom ? [{ de: 'A', a: 'Bq' }, { de: 'Bq', a: 'P', color: 'o', grosor: 'fino' }]
        : [...V.map((_, i) => ({ de: 'V' + i, a: 'V' + ((i + 1) % n) })), ...W.map((_, i) => ({ de: 'W' + i, a: 'W' + ((i + 1) % (2 * n)), color: 'o', grosor: 'fino' }))]),
        ...(o.letras ? [{ de: 'O', a: 'M', color: 'i', grosor: 'variable', texto: 'a', desde: k.a || 0 }, { de: 'M', a: 'P', color: 'h', grosor: 'variable', texto: 'R − a', desde: k.ra || 0 },
          { de: 'A', a: 'P', color: 'o', grosor: 'variable', texto: o.l2 || 'ℓ₂ₙ', desde: k.l2 || 0 }, { de: 'A', a: 'M', color: 'd', grosor: 'variable', texto: 'ℓₙ/2', lado: 1, desde: k.l || 0 }] : [])],
      angulos: o.letras ? [{ en: 'M', de: 'A', a: 'P', color: 'h', desde: k.ra || 0 }] : [],
    };
  };
  const dobleIdea = {
    id: 'dos-n-lados',
    titulo: 'De n lados a 2n lados',
    temas: ['Polígono de 2n lados'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'Cada arco del polígono de n lados se parte en dos: aparece el de 2n lados (naranja). Compara su perímetro con la circunferencia.',
      voz: 'Duplica los lados. Mira qué tanto se acerca a la circunferencia.',
      controles: [{ id: 'n', etiqueta: 'n', min: 3, max: 8, paso: 1, inicio: 4, unidad: 'lados', decimales: 0 }],
      dibujo: v => ({ datos: doble(v.n, 3), estado: {} }),
      lectura: v => [`perímetro de ${2 * v.n}: ${f(2 * v.n * lado(2 * v.n, 3))} · circunferencia: ${f(6 * Math.PI)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En una circunferencia de radio 1, el cuadrado inscrito tiene lado √2. ¿Cuánto mide el lado del octógono regular inscrito?',
      voz: 'El octógono parte cada arco del cuadrado en dos.',
      opciones: [
        { id: 'c', texto: '√(2 − √2) ≈ 0,77', correcta: true },
        { id: 'mitad', texto: '√2/2 ≈ 0,71', error: 'GE-REG6', siFuera: 'La mitad del lado del cuadrado es la cuerda partida, no el lado nuevo: ese sube hasta el arco.' },
        { id: 'apot', texto: '1 − √2/2 ≈ 0,29', error: 'GE-REG6', siFuera: 'R − a es la flecha del arco; el lado nuevo es la hipotenusa con medio lado.' },
        { id: 'arco', texto: 'π/4 ≈ 0,79', error: 'GE-REG7', siFuera: 'π/4 es el arco; la cuerda siempre es un poco más corta que su arco.' },
      ],
      dibujo: { datos: doble(4, 3, { letras: true, pasos: { a: 9, ra: 9, l2: 9, l: 9 }, alt: 'Cuadrado inscrito y octógono que parte cada arco en dos' }), estado: {} },
      revelar: { datos: doble(4, 3, { letras: true, zoom: true, l2: '≈ 0,77 R' }), estado: {} },
      coincide: 'Coincide: ℓ₈ = √(2 − √2) ≈ 0,765 con R = 1.',
    },
    mira: {
      datos: doble(4, 3, { letras: true, zoom: true, pasos: { a: 1, ra: 2, l: 3, l2: 4 }, alt: 'Medio lado del cuadrado y la flecha R − a forman un triángulo rectángulo cuya hipotenusa es el lado del octógono' }),
      voz: 'El lado nuevo es la hipotenusa de un triángulo pequeño.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La apotema del cuadrado llega al medio H del lado AB.', ecuacion: [cA, ' = R√2/2'] },
        { estado: { corte: 2 }, texto: 'De H al arco quedan R − a.', ecuacion: ['HP = R − ', cA] },
        { estado: { corte: 3 }, texto: 'AH es medio lado del cuadrado.', ecuacion: ['AH = ℓₙ/2'] },
        { estado: { corte: 4 }, texto: 'AP, el lado de 2n, es la hipotenusa: Pitágoras y se simplifica.', ecuacion: ['ℓ₂ₙ² = (ℓₙ/2)² + (R − a)² = 2R² − 2R', cA] },
      ],
    },
    regla: {
      texto: 'Al pasar de n a 2n lados, el lado nuevo cumple ℓ₂ₙ² = 2R² − 2R·aₙ. El perímetro crece hacia la circunferencia, sin alcanzarla con n finito.',
      ecuacion: ['ℓ₂ₙ = ', { raiz: ['2R² − 2R · aₙ'] }],
      condicion: 'los dos polígonos son regulares e inscritos en la misma circunferencia; aₙ es la apotema del de n lados.',
      voz: 'Más lados se acercan al círculo, pero no lo igualan.',
    },
    ahoraTu: {
      voz: 'Calcula la apotema del de n lados; después el lado de 2n.',
      generar(s) {
        const r = azar(s), R = r.ent(1, 10), n = [3, 4, 6][s % 3], a = apot(n, R), l2 = Math.sqrt(2 * R * R - 2 * R * a);
        const nom = { 3: 'hexágono', 4: 'octógono', 6: 'dodecágono' }[n];
        return {
          pregunta: [`En una circunferencia de radio ${R}, ¿cuánto mide el lado del ${nom} regular inscrito? (Parte del polígono de ${n} lados.)`],
          opciones: opciones(l2, [
            { id: 'mitad', valor: lado(n, R) / 2, error: 'GE-REG6', siFuera: 'Esa es la mitad del lado anterior; el nuevo lado sube hasta el arco.' },
            { id: 'flecha', valor: R - a, error: 'GE-REG6', siFuera: 'R − a es solo la flecha: un cateto del triángulo.' },
            { id: 'arco', valor: 2 * Math.PI * R / (2 * n), error: 'GE-REG7', siFuera: 'Ese es el arco; la cuerda es un poco más corta.' },
          ], x => f(x)),
          solucion: { texto: `a${n} = ${f(a)}.`, ecuacion: [`ℓ = √(2 · ${R}² − 2 · ${R} · ${f(a)}) = ${f(l2)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: la sección áurea ----------
  // Cambia: dónde se corta el segmento · Permanece: AB · Progresa: AB/AP frente a AP/PB ·
  // Se reserva: la diagonal del pentágono · Debe verse: φ cumple φ² = φ + 1 y aparece como diagonal/lado.
  const corteFig = t => {
    const Pp = [10 * t, 0], r1 = 10 / (10 * t), r2 = (10 * t) / (10 - 10 * t);
    return {
      alt: `Segmento AB de 10 cortado en P a ${f(10 * t)}: AB/AP = ${f(r1)} y AP/PB = ${f(r2)}`,
      vista: { x: [-0.6, 10.6], y: [-1.6, 1.6] },
      puntos: [pt('A', [0, 0], { rotulo: 'A', lado: 90 }), pt('B', [10, 0], { rotulo: 'B', lado: 90 }), pt('P', Pp, { rotulo: 'P', color: 'h', lado: 90 })],
      segmentos: [{ de: 'A', a: 'P', color: 'o', grosor: 'variable', texto: f(10 * t), lado: -1 }, { de: 'P', a: 'B', color: 'i', grosor: 'variable', texto: f(10 - 10 * t), lado: -1 }],
    };
  };
  const penta = (o = {}) => {
    const V = vert(5, 3).map(p => [p[0], p[1] + 0.3]), k = o.pasos || {};
    return {
      alt: o.alt || 'Pentágono regular de lado 1 con una diagonal',
      vista: { x: [-3.6, 3.6], y: [-3.2, 3.8] },
      puntos: V.map((p, i) => pt('V' + i, p, { rotulo: 'ABCDE'[i], lado: 270 - 36 - 72 * i })),
      regiones: [{ puntos: V.map((_, i) => 'V' + i), color: 'd', opacidad: 0.06 }, ...(o.tri ? [{ puntos: ['V0', 'V2', 'V3'], color: 'o', opacidad: 0.18, desde: k.tri || 0 }] : [])],
      segmentos: [...V.map((_, i) => ({ de: 'V' + i, a: 'V' + ((i + 1) % 5), texto: i === 0 ? '1' : undefined, color: i === 0 ? 'd' : undefined, grosor: i === 0 ? 'variable' : undefined })),
        { de: 'V0', a: 'V2', color: 'h', grosor: 'variable', texto: o.d || 'd' }, ...(o.tri ? [{ de: 'V0', a: 'V3', color: 'h', grosor: 'fino', desde: k.tri || 0 }] : [])],
      angulos: o.tri ? [{ en: 'V0', de: 'V2', a: 'V3', color: 'o', texto: '36°', radio: 30, desde: k.tri || 0 }, { en: 'V2', de: 'V3', a: 'V0', color: 'o', texto: '72°', radio: 20, desde: k.ang || 0 }] : [],
    };
  };
  const aurea = {
    id: 'seccion-aurea',
    titulo: 'La razón áurea del pentágono',
    temas: ['Sección áurea'],
    pieza: 'geo-figura',
    juega: {
      consigna: 'AB mide 10. Corre P y compara el total entre la parte mayor (AB/AP) con la mayor entre la menor (AP/PB).',
      voz: 'Busca el punto donde las dos razones casi coinciden.',
      controles: [{ id: 't', etiqueta: 'AP', min: 0.5, max: 0.75, paso: 0.01, inicio: 0.55, unidad: 'de AB', decimales: 2, color: 'c-o' }],
      dibujo: v => ({ datos: corteFig(v.t), estado: {} }),
      lectura: v => [`AB/AP = ${f(1 / v.t, 3)} · AP/PB = ${f(v.t / (1 - v.t), 3)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'En un pentágono regular de lado 1, ¿cuánto mide una diagonal?',
      voz: 'Piensa si la razón que buscaste aparece aquí.',
      opciones: [
        { id: 'c', texto: '(1 + √5)/2 ≈ 1,62', correcta: true },
        { id: 'raiz2', texto: '√2 ≈ 1,41', error: 'GE-AUR1', siFuera: '√2 es la diagonal del cuadrado de lado 1, no la del pentágono.' },
        { id: 'dos', texto: '2', error: 'GE-AUR1', siFuera: 'Dos lados juntos serían 2; la diagonal es más corta que ese camino.' },
        { id: 'raiz3', texto: '√3 ≈ 1,73', error: 'GE-AUR1', siFuera: '√3 es la diagonal larga del hexágono de lado 1.' },
      ],
      dibujo: { datos: penta(), estado: {} },
      revelar: { datos: penta({ d: 'd ≈ 1,618' }), estado: {} },
      coincide: 'Coincide: la diagonal es φ veces el lado.',
    },
    mira: {
      datos: penta({ tri: true, d: 'φ', pasos: { tri: 1, ang: 1 }, alt: 'El triángulo ACD de ángulos 36°, 72° y 72° tiene lados φ, φ y 1' }),
      voz: 'Un triángulo de 36°, 72° y 72° esconde a φ.',
      pasos: [
        { estado: { corte: 1 }, texto: 'ACD tiene ángulos de 36°, 72° y 72°: lados d, d y 1.', ecuacion: ['AC = AD = d · CD = 1'] },
        { estado: { corte: 1 }, texto: 'La bisectriz de un ángulo de 72° arma otro igual, más chico.', ecuacion: [frac('d', '1'), ' = ', frac('1', 'd − 1')] },
        { estado: { corte: 1 }, texto: 'Resuelve la ecuación cuadrática.', ecuacion: ['d² = d + 1 → d = ', frac('1 + √5', '2'), ' = φ'] },
      ],
    },
    regla: {
      texto: 'Hay sección áurea si el total es a la parte mayor como esta a la menor. Esa razón es φ = (1 + √5)/2; cumple φ² = φ + 1.',
      ecuacion: ['φ = ', frac('1 + √5', '2'), ' ≈ 1,618   ·   ', { sup: ['φ', '2'] }, ' = φ + 1   ·   ', frac('diagonal', 'lado'), ' = φ'],
      condicion: 'el pentágono es regular: entonces diagonal entre lado da exactamente φ, para cualquier tamaño.',
      voz: 'φ no es una medida: es una razón. Úsala con su lado.',
    },
    ahoraTu: {
      voz: 'Multiplica o divide por φ según la parte que te pidan.',
      generar(s) {
        const r = azar(s), L = r.ent(2, 20), t = s % 2;
        if (t === 0) return {
          pregunta: [`Un pentágono regular tiene lado ${L}. ¿Cuánto mide cada diagonal?`],
          opciones: opciones(L * PHI, [
            { id: 'div', valor: L / PHI, error: 'GE-AUR2', siFuera: 'Dividir entre φ da una medida menor; la diagonal es mayor que el lado.' },
            { id: 'doble', valor: 2 * L, error: 'GE-AUR1', siFuera: 'Dos lados serían un camino más largo que la diagonal.' },
            { id: 'raiz2', valor: L * Math.SQRT2, error: 'GE-AUR1', siFuera: 'ℓ√2 es la diagonal de un cuadrado.' },
          ], x => f(x)),
          solucion: { texto: 'Diagonal = φ · lado.', ecuacion: [`${L} · 1,618 = ${f(L * PHI)}`] },
        };
        return {
          pregunta: [`Un segmento de ${L} se divide en sección áurea. ¿Cuánto mide la parte mayor?`],
          opciones: opciones(L / PHI, [
            { id: 'mitad', valor: L / 2, error: 'GE-AUR2', siFuera: 'La mitad haría iguales las dos partes; aquí la mayor es la parte áurea.' },
            { id: 'menor', valor: L - L / PHI, error: 'GE-AUR2', siFuera: 'Esa es la parte menor.' },
            { id: 'por', valor: L * PHI, error: 'GE-AUR2', siFuera: 'Multiplicar por φ da más que el total.' },
          ], x => f(x)),
          solucion: { texto: 'Total / parte mayor = φ.', ecuacion: [`${L} ÷ 1,618 = ${f(L / PHI)}`] },
        };
      },
    },
  };

  return {
    unidad: 'geometria.poligonos-regulares',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'Los polígonos regulares juntan dos preguntas: medirlos y construirlos con regla y compás. Los Elementos construyen varios inscritos en la circunferencia. Siglos después, Gauss relacionó la construcción del polígono de diecisiete lados con el álgebra. Dibujar uno en pantalla, conocer su ángulo central y demostrar que se puede construir son logros distintos.',
      pregunta: '¿Por qué más lados acercan el polígono al círculo sin igualarlo?',
      fuente: { titulo: 'Euclides, Elementos, libro IV (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookIV/bookIV.html' },
    },
    ideas: [central, notIdea, dobleIdea, aurea],
  };
});
