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
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura; aPlano la vuelve coordenadas del
  // problema y el lector ajusta cada valor al paso y al rango de su control.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, q) => G.aPlano(datos, q);
  const sep = '   ·   ';
  const sup2 = x => ({ sup: [x, '2'] });
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
  // Sin arrastre: n cuenta lados y no hay objeto que al moverse agregue uno. El radio, que sí se agarra, se arrastra en
  // la mesa «poligono-libre» del laboratorio.
  const central = {
    id: 'central-y-apotema',
    titulo: 'Radio, apotema y ángulo central',
    temas: ['Ángulo central y apotema'],
    pieza: 'geo-figura',
    // Lee (fase 2): qué es regular, el centro, radio y apotema. No dice que el hexágono tenga radio igual al lado
    // ni cómo sale su apotema (eso lo pregunta «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Lados y ángulos iguales', texto: 'Una señal de PARE tiene ocho lados iguales y ocho ángulos iguales: es un polígono regular. Un rombo tiene sus cuatro lados iguales, pero sus ángulos no lo son; por eso no es regular.' },
        { titulo: 'Un centro para todo', texto: 'Todo polígono regular tiene un centro O que está a la misma distancia de todos sus vértices. Si unes O con cada vértice, el polígono queda partido en triángulos con la punta en O.' },
        { titulo: 'Radio y apotema', texto: ['El radio ', cR, ' va de O a un vértice. La apotema ', cA, ' va de O al punto medio de un lado y cae perpendicular a él. Los dos salen del centro, pero no llegan al mismo lugar.'] },
        { titulo: 'Qué mirar', texto: ['Al jugar, cambia el número de lados n. Mira el triángulo sombreado, el ángulo rojo en O y cómo cambia la apotema ', cA, ' frente al radio ', cR, '.'] },
      ],
    },
    juega: {
      consigna: 'El polígono regular se parte en n triángulos iguales desde el centro O. Cambia n y compara el radio con la apotema.',
      voz: 'Sube n. Mira cómo la apotema se acerca al radio.',
      controles: [{ id: 'n', etiqueta: 'n', min: 3, max: 12, paso: 1, inicio: 5, unidad: 'lados', decimales: 0 }],
      dibujo: v => ({ datos: reg(v.n, 3, { tri: true, central: true, R: 'R', a: 'a' }), estado: {} }),
      lectura: v => [`central ${f(360 / v.n, 1)}°`, sep, cR, ' = 3', sep, cA, ` = ${f(apot(v.n, 3))}`],
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
        { estado: { corte: 1 }, texto: 'La apotema es la altura del triángulo.', ecuacion: [cA, ' = ', { raiz: [sup2('6'), ' − ', sup2('3')] }, ' = 3√3'] },
        { estado: { corte: 1 }, texto: 'Área: n triángulos de base ℓ y altura a.', ecuacion: ['S = ', frac(['P · ', cA], '2'), ' = ', frac('36 · 3√3', '2'), ' = 54√3'] },
      ],
    },
    regla: {
      texto: 'Un polígono regular de n lados son n triángulos isósceles iguales: ángulo central 360°/n, lado 2R·sen(180°/n), apotema R·cos(180°/n) y área P · a / 2.',
      ecuacion: [cL, ' = 2', cR, ' sen ', { llave: [frac('180°', 'n')], nota: 'medio central', color: 'c-h' }, sep, cA, ' = ', cR, ' cos ', frac('180°', 'n'), sep, 'S = ', frac(['P · ', cA], '2')],
      condicion: 'el polígono tiene lados y ángulos iguales. R llega al vértice y a llega perpendicular al punto medio del lado.',
      voz: 'Radio al vértice, apotema al medio del lado.',
    },
    // Así se resuelve (fase 2): los tres tipos de «Ahora tú» (ángulo central, apotema del hexágono y área), con otras
    // semillas y las mismas cuentas (lado, apot y 2a·tan(180°/n)).
    resuelve: {
      voz: 'Primero ubica el triángulo central. Lo demás sale de ahí.',
      generar(s) {
        const r = azar(s + 900), t = s % 3, k = r.ent(2, 10);
        if (t === 0) {
          const n = r.de([5, 8, 9, 10, 12, 15, 18, 20, 24, 36]), c = 360 / n;
          return {
            enunciado: [`¿Cuánto mide el ángulo central de un polígono regular de ${n} lados?`],
            dibujo: { datos: reg(n, 3, { central: true, alt: `Polígono regular de ${n} lados con su centro O y el ángulo central en rojo` }), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden el ángulo central: el que forman en O los radios de dos vértices seguidos.' },
              { tipo: 'datos', texto: `El polígono es regular y tiene ${n} lados.`, ecuacion: [`n = ${n}`] },
              { tipo: 'regla', texto: 'Desde O, el polígono se parte en n triángulos iguales. Sus ángulos en O son iguales y juntos dan una vuelta completa.' },
              { tipo: 'cuentas', texto: 'Reparto la vuelta de 360° entre los n ángulos iguales.', ecuacion: [`central = 360° ÷ ${n} = ${f(c, 1)}°`],
                dibujo: { datos: reg(n, 3, { tri: true, central: true, alt: `Polígono regular de ${n} lados partido en ${n} triángulos iguales desde O; cada ángulo en O mide ${f(c, 1)}°` }), estado: {} } },
              { tipo: 'sentido', texto: `Compruebo de vuelta: ${n} ángulos de ${f(c, 1)}° suman ${f(n * c, 1)}°, una vuelta. Cuadra.` },
            ],
            respuesta: [`El ángulo central mide ${f(c, 1)}°.`],
          };
        }
        if (t === 1) {
          const l = 2 * k, a = k * Math.sqrt(3);
          return {
            enunciado: ['Un hexágono regular tiene lado ', cL, ` = ${l}. ¿Cuánto mide su apotema?`],
            dibujo: { datos: reg(6, 3, { l: `${l}` }), estado: {} },
            pasos: [
              { tipo: 'pide', texto: ['Piden la apotema ', cA, ': va de O al punto medio de un lado.'] },
              { tipo: 'datos', texto: ['Es un hexágono regular de lado ', cL, ` = ${l}; medio lado mide ${k}.`] },
              { tipo: 'regla', texto: ['La apotema es la altura de un triángulo central. Con el radio ', cR, ' y medio lado arma un triángulo rectángulo.'],
                ecuacion: [sup2(cA), ' = ', sup2(cR), ' − ', sup2('(ℓ/2)')] },
              { tipo: 'cuentas', texto: ['En el hexágono el ángulo central mide 60°: cada triángulo es equilátero y ', cR, ` = ${l}. Uso Pitágoras.`],
                ecuacion: [cA, ` = √(${l}² − ${k}²) = √${3 * k * k} = ${k}√3 ≈ ${f(a)}`],
                dibujo: { datos: reg(6, 3, { tri: true, l: `${l}`, R: `${l}`, a: `${k}√3` }), estado: {} } },
              { tipo: 'sentido', texto: ['La apotema, ', f(a), ', es un cateto: sale menor que el radio, ', `${l}`, ', que es la hipotenusa. Cuadra.'] },
            ],
            respuesta: [cA, ` = ${k}√3 ≈ ${f(a)}`],
          };
        }
        const n = r.de([4, 6, 8, 10, 12]), a = k, l = 2 * a * Math.tan(Math.PI / n), P = n * l, S = n * l * a / 2;
        return {
          enunciado: [`Un polígono regular de ${n} lados tiene lado ${f(l)} y apotema ${a}. ¿Cuál es su área?`],
          dibujo: { datos: reg(n, 3, { l: f(l), a: `${a}` }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el área S del polígono regular.' },
            { tipo: 'datos', texto: [`Tiene n = ${n} lados, `, cL, ` = ${f(l)} y `, cA, ` = ${a}.`] },
            { tipo: 'regla', texto: ['Desde O salen n triángulos iguales. Cada uno tiene base ', cL, ' y altura ', cA, '; sumo sus áreas.'],
              ecuacion: ['S = n · ', frac([cL, ' · ', cA], '2'), ' = ', frac(['P · ', cA], '2')] },
            { tipo: 'cuentas', texto: 'Primero el perímetro; después, perímetro por apotema entre 2.',
              ecuacion: [`P = ${n} · ${f(l)} = ${f(P)}   →   S = ${f(P)} · ${a} / 2 = ${f(S)}`],
              dibujo: { datos: reg(n, 3, { tri: true, l: f(l), a: `${a}` }), estado: {} } },
            { tipo: 'sentido', texto: `Compruebo con un triángulo: ${f(l)} · ${a} / 2 = ${f(l * a / 2)}; por ${n} triángulos da ${f(S)}. Cuadra.` },
          ],
          respuesta: [`S = ${f(S)}`],
        };
      },
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
  // Sin arrastre: el control elige entre tres polígonos (opciones), no es un número que se mueva. La mesa
  // «inscritos-con-radio» agrega el radio, que sí se arrastra.
  const notIdea = {
    id: 'inscritos-notables',
    titulo: 'Triángulo, cuadrado y hexágono inscritos',
    temas: ['Polígonos regulares inscritos notables'],
    pieza: 'geo-figura',
    // Lee (fase 2): qué es inscrito y qué quiere decir «en función de R». No da la apotema del triángulo (la pregunta
    // de «Predice») ni el baricentro.
    lee: {
      tarjetas: [
        { titulo: 'Vértices en la circunferencia', texto: ['Un polígono está inscrito cuando todos sus vértices tocan la circunferencia. Entonces el radio ', cR, ' de la circunferencia es también el radio del polígono: va del centro a cada vértice.'] },
        { titulo: 'En función de R', texto: ['Escribir el lado «en función de ', cR, '» es dejarlo como ', cR, ' por un número fijo. Así, si el radio se duplica, el lado también se duplica, y la apotema igual.'] },
        { titulo: 'Tres que vuelven siempre', texto: 'En los exámenes de admisión aparecen una y otra vez el triángulo equilátero, el cuadrado y el hexágono regular inscritos. Reconocer su lado y su apotema ahorra cuentas largas.' },
        { titulo: 'Qué mirar', texto: ['Al jugar, cambia de polígono y lee su lado ', cL, ' y su apotema ', cA, ' en función de ', cR, '. En el triángulo, la apotema sale con un signo de pregunta: guárdala para después.'] },
      ],
    },
    juega: {
      consigna: 'Elige el polígono regular inscrito en la circunferencia de radio R. Mira su lado y su apotema escritos en función de R.',
      voz: 'Cambia de polígono. Compara cada lado con R.',
      controles: [{ id: 'n', etiqueta: 'polígono', opciones: [{ valor: 4, texto: 'cuadrado' }, { valor: 6, texto: 'hexágono' }, { valor: 3, texto: 'triángulo' }] }],
      dibujo: v => ({ datos: Object.assign(reg(v.n, 3, { R: 'R', l: `ℓ = ${NOT[v.n][0]}`, a: v.n === 3 ? undefined : `a = ${NOT[v.n][1]}` }), { circulos: [{ centro: 'O', r: 3, grosor: 'fino', discontinua: true }] }), estado: {} }),
      lectura: v => [cL, ` = ${NOT[v.n][0]}`, sep, cA, v.n === 3 ? ' = ?' : ` = ${NOT[v.n][1]}`],
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
        { estado: { corte: 0 }, texto: 'Así la apotema es la mitad del radio.', ecuacion: [cA, ' = ', frac(cR, '2'), ' = 3', sep, cL, ' = R√3 = 6√3'] },
      ],
    },
    regla: {
      texto: 'Inscritos en la circunferencia de radio R, lado y apotema valen: triángulo, R√3 y R/2; cuadrado, R√2 y R√2/2; hexágono, R y R√3/2.',
      ecuacion: [{ sub: [cL, '3'] }, ' = R√3', sep, { sub: [cL, '4'] }, ' = R√2', sep, { sub: [cL, '6'] }, ' = R'],
      condicion: 'los polígonos son regulares y sus vértices están en la circunferencia de radio R.',
      voz: 'Tres polígonos, tres pares que conviene reconocer.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» con otras semillas, calculado con lado y apot.
    resuelve: {
      voz: 'Reconoce el polígono y fíjate si piden lado o apotema.',
      generar(s) {
        const r = azar(s + 900), R = 2 * r.ent(1, 8), n = [3, 4, 6][s % 3], pideL = (s >> 1) % 2 === 0;
        const val = pideL ? lado(n, R) : apot(n, R), forma = NOT[n][pideL ? 0 : 1], h = R / 2;
        // R es par: R√2/2 y R√3/2 se simplifican a (R/2)√2 y (R/2)√3.
        const conR = { 'R√3': `${R}√3`, 'R√2': `${R}√2`, R: `${R}`, 'R/2': `${h}`, 'R√2/2': `${h === 1 ? '' : h}√2`, 'R√3/2': `${h === 1 ? '' : h}√3` }[forma];
        // Igualdades seguidas sin repetir: «16√3/2 = 8√3 ≈ 13,86», «14/2 = 7», «6».
        const exacto = Math.abs(val - Math.round(val)) < 1e-9;
        const cadena = xs => { const u = [...new Set([...xs, f(val)])]; return u.map((x, i) => i === 0 ? x : `${i === u.length - 1 && !exacto ? '≈' : '='} ${x}`).join(' '); };
        const nom = { 3: 'triángulo equilátero', 4: 'cuadrado', 6: 'hexágono regular' }[n], que = pideL ? 'lado' : 'apotema';
        const sim = pideL ? cL : cA, circ = { circulos: [{ centro: 'O', r: 3, grosor: 'fino', discontinua: true }] };
        const fig = (rot, alt) => ({ datos: Object.assign(reg(n, 3, Object.assign({ R: `R = ${R}`, alt }, pideL ? { l: rot } : { a: rot })), circ), estado: {} });
        return {
          enunciado: [`En una circunferencia de radio R = ${R} se inscribe un ${nom}. ¿Cuánto mide su ${que}?`],
          dibujo: fig(pideL ? 'ℓ' : 'a', `${nom[0].toUpperCase()}${nom.slice(1)} inscrito en una circunferencia de radio ${R}; se pide su ${que}`),
          pasos: [
            { tipo: 'pide', texto: [`Piden ${pideL ? 'el lado ' : 'la apotema '}`, sim, ` del ${nom}: ${pideL ? 'une dos vértices seguidos' : 'va del centro al punto medio de un lado'}.`] },
            { tipo: 'datos', texto: ['Está inscrito: sus vértices tocan la circunferencia, así que ', cR, ` = ${R} llega a cada vértice.`] },
            { tipo: 'regla', texto: [`En los inscritos notables, lado y apotema son el radio por un número fijo. Para el ${nom}:`], ecuacion: [sim, ` = ${forma}`] },
            { tipo: 'cuentas', texto: ['Reemplazo ', cR, ` = ${R} en la fórmula.`],
              ecuacion: [sim, ` = ${cadena([forma.replace('R', `${R}`), conR])}`],
              dibujo: fig(`${que === 'lado' ? 'ℓ' : 'a'} = ${conR}`, `${nom[0].toUpperCase()}${nom.slice(1)} inscrito en una circunferencia de radio ${R}: su ${que} mide ${conR}`) },
            { tipo: 'sentido', texto: pideL ? `El lado, ${f(val)}, no pasa del diámetro, ${2 * R}: ninguna cuerda es más larga que el diámetro.`
              : `La apotema, ${f(val)}, es menor que el radio, ${R}: llega al medio del lado, no al vértice.` },
          ],
          respuesta: [sim, ` = ${cadena([conR])}`],
        };
      },
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
  // Sin arrastre: n cuenta lados (el polígono de 2n sale de partir cada arco); no hay objeto que agarrar.
  // Hallazgo 9: «Mira» usa el mismo dibujo del juego (doble), con zoom al lado de abajo: el triángulo pequeño no se lee
  // en la vista completa.
  const dobleIdea = {
    id: 'dos-n-lados',
    titulo: 'De n lados a 2n lados',
    temas: ['Polígono de 2n lados'],
    pieza: 'geo-figura',
    // Lee (fase 2): Arquímedes y qué es partir cada arco. No da el triángulo pequeño ni la fórmula del lado de 2n,
    // ni compara cuerda con arco (son las opciones de «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Arquímedes y π', texto: 'Hace más de 2000 años, Arquímedes estimó el número π con polígonos regulares inscritos en una circunferencia. Empezó con un hexágono y fue duplicando sus lados: 12, 24, 48 y 96.' },
        { titulo: 'Partir cada arco', texto: 'Cada lado de un polígono inscrito tiene encima un arco de la circunferencia. Si marcas el punto medio de cada arco, aparecen vértices nuevos y el polígono pasa a tener el doble de lados.' },
        { titulo: 'Qué mirar', texto: 'Al jugar, sube n y compara el perímetro del polígono naranja con la circunferencia. Fíjate cuánto falta cada vez que los lados se duplican.' },
      ],
    },
    juega: {
      consigna: 'Cada arco del polígono de n lados se parte en dos: aparece el de 2n lados (naranja). Compara su perímetro con la circunferencia.',
      voz: 'Duplica los lados. Mira qué tanto se acerca a la circunferencia.',
      controles: [{ id: 'n', etiqueta: 'n', min: 3, max: 8, paso: 1, inicio: 4, unidad: 'lados', decimales: 0 }],
      dibujo: v => ({ datos: doble(v.n, 3), estado: {} }),
      lectura: v => [`perímetro de ${2 * v.n}: ${f(2 * v.n * lado(2 * v.n, 3))}`, sep, `circunferencia: ${f(6 * Math.PI)}`],
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
        { estado: { corte: 4 }, texto: 'AP, el lado de 2n, es la hipotenusa: Pitágoras.', ecuacion: [sup2('ℓ₂ₙ'), ' = ', sup2('(ℓₙ/2)'), ' + ', sup2(['(R − ', cA, ')'])] },
        { estado: { corte: 4 }, texto: 'Como (ℓₙ/2)² + a² = R², al desarrollar queda:', ecuacion: [sup2('ℓ₂ₙ'), ' = 2', sup2('R'), ' − 2R', cA] },
      ],
    },
    regla: {
      texto: 'Al pasar de n a 2n lados, el lado nuevo cumple ℓ₂ₙ² = 2R² − 2R·aₙ. El perímetro crece hacia la circunferencia, sin alcanzarla con n finito.',
      ecuacion: [sup2('ℓ₂ₙ'), ' = 2', sup2('R'), ' − 2R · ', { llave: [{ sub: [cA, 'n'] }], nota: 'apotema de n', color: 'c-i' }],
      condicion: 'los dos polígonos son regulares e inscritos en la misma circunferencia; aₙ es la apotema del de n lados.',
      voz: 'Más lados se acercan al círculo, pero no lo igualan.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» con otras semillas: apot del polígono de n y la fórmula de 2n.
    resuelve: {
      voz: 'Dos pasos: la apotema del de n lados y luego la fórmula.',
      generar(s) {
        const r = azar(s + 900), R = r.ent(1, 10), n = [3, 4, 6][s % 3], a = apot(n, R), l2 = Math.sqrt(2 * R * R - 2 * R * a), ln = lado(n, R);
        const nom = { 3: 'hexágono', 4: 'octógono', 6: 'dodecágono' }[n], viejo = { 3: 'triángulo equilátero', 4: 'cuadrado', 6: 'hexágono' }[n];
        const aN = { sub: [cA, `${n}`] };
        return {
          enunciado: [`En una circunferencia de radio ${R}, ¿cuánto mide el lado del ${nom} regular inscrito? (Parte del polígono de ${n} lados.)`],
          dibujo: { datos: doble(n, 3, { alt: `${viejo[0].toUpperCase()}${viejo.slice(1)} y ${nom} regulares inscritos en la misma circunferencia de radio ${R}` }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden el lado del ${nom} regular inscrito en la circunferencia de radio ${R}.` },
            { tipo: 'datos', texto: `El ${nom} tiene ${2 * n} lados: sale de partir cada arco del ${viejo} inscrito, de ${n} lados.`, ecuacion: [cR, ` = ${R}`, sep, `n = ${n}`] },
            { tipo: 'regla', texto: 'El lado nuevo es la hipotenusa de un triángulo rectángulo: un cateto es medio lado viejo; el otro, el tramo del medio del lado al arco. Desarrollado:',
              ecuacion: [sup2('ℓ₂ₙ'), ' = 2', sup2('R'), ' − 2R · ', { sub: [cA, 'n'] }] },
            { tipo: 'cuentas', texto: `Primero la apotema del ${viejo}, con los inscritos notables.`, ecuacion: [aN, ` = ${NOT[n][1]} = ${f(a)}`] },
            { tipo: 'cuentas', texto: 'Reemplazo el radio y esa apotema en la fórmula y saco la raíz.',
              ecuacion: [`ℓ = √(2 · ${R}² − 2 · ${R} · ${f(a)}) = ${f(l2)}`],
              dibujo: { datos: doble(n, 3, { letras: true, zoom: true, l2: `${Math.abs(l2 - Math.round(l2)) < 1e-9 ? '' : '≈ '}${f(l2)}`, alt: `Detalle de un lado del ${viejo}: el lado del ${nom} es la hipotenusa y mide unos ${f(l2)}` }), estado: {} } },
            { tipo: 'sentido', texto: `El lado nuevo, ${f(l2)}, es menor que el del ${viejo} (${f(ln)}) y mayor que su mitad (${f(ln / 2)}). Cuadra.` },
          ],
          respuesta: [`El lado del ${nom} mide ${Math.abs(l2 - Math.round(l2)) < 1e-9 ? '' : 'unos '}${f(l2)}.`],
        };
      },
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
  // L (opcional, 10 por defecto) solo cambia los rótulos: «Así se resuelve» corta segmentos de otro largo.
  const corteFig = (t, L = 10) => {
    const Pp = [10 * t, 0], r1 = 10 / (10 * t), r2 = (10 * t) / (10 - 10 * t);
    return {
      alt: `Segmento AB de ${f(L)} cortado en P a ${f(L * t)}: AB/AP = ${f(r1)} y AP/PB = ${f(r2)}`,
      vista: { x: [-0.6, 10.6], y: [-1.6, 1.6] },
      puntos: [pt('A', [0, 0], { rotulo: 'A', lado: 90 }), pt('B', [10, 0], { rotulo: 'B', lado: 90 }), pt('P', Pp, { rotulo: 'P', color: 'h', lado: 90 })],
      segmentos: [{ de: 'A', a: 'P', color: 'o', grosor: 'variable', texto: f(L * t), lado: -1 }, { de: 'P', a: 'B', color: 'i', grosor: 'variable', texto: f(L - L * t), lado: -1 }],
    };
  };
  const penta = (o = {}) => {
    const V = vert(5, 3).map(p => [p[0], p[1] + 0.3]), k = o.pasos || {};
    return {
      alt: o.alt || `Pentágono regular de lado ${o.l || '1'} con una diagonal`,
      vista: { x: [-3.6, 3.6], y: [-3.2, 3.8] },
      puntos: V.map((p, i) => pt('V' + i, p, { rotulo: 'ABCDE'[i], lado: 270 - 36 - 72 * i })),
      regiones: [{ puntos: V.map((_, i) => 'V' + i), color: 'd', opacidad: 0.06 }, ...(o.tri ? [{ puntos: ['V0', 'V2', 'V3'], color: 'o', opacidad: 0.18, desde: k.tri || 0 }] : [])],
      segmentos: [...V.map((_, i) => ({ de: 'V' + i, a: 'V' + ((i + 1) % 5), texto: i === 0 ? (o.l || '1') : undefined, color: i === 0 ? 'd' : undefined, grosor: i === 0 ? 'variable' : undefined })),
        { de: 'V0', a: 'V2', color: 'h', grosor: 'variable', texto: o.d || 'd' }, ...(o.tri ? [{ de: 'V0', a: 'V3', color: 'h', grosor: 'fino', desde: k.tri || 0 }] : [])],
      angulos: o.tri ? [{ en: 'V0', de: 'V2', a: 'V3', color: 'o', texto: '36°', radio: 30, desde: k.tri || 0 }, { en: 'V2', de: 'V3', a: 'V0', color: 'o', texto: '72°', radio: 20, desde: k.ang || 0 }] : [],
    };
  };
  // Hallazgo 9: el juego corta un segmento y «Mira» usa el pentágono. Son dos representaciones a propósito: el corte es
  // la definición de la razón; el pentágono, donde aparece sin buscarla. La predicción hace de puente entre las dos.
  const aurea = {
    id: 'seccion-aurea',
    titulo: 'La razón áurea del pentágono',
    temas: ['Sección áurea'],
    pieza: 'geo-figura',
    // Lee (fase 2): el corte y sus dos razones, con nombre. No da el valor de φ ni dice que aparece en el pentágono
    // (eso lo pregunta «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Cortar en dos partes', texto: 'Si cortas en dos una cinta de 10 m para adornar la fiesta de la Candelaria, en Puno, te queda una parte mayor y una menor. Puedes comparar el total con la mayor, y la mayor con la menor.' },
        { titulo: 'Dos razones', texto: 'Cada comparación es una razón: total entre mayor, y mayor entre menor. Casi siempre dan números distintos. Si cortas justo en la mitad, la primera da 2 y la segunda, 1.' },
        { titulo: 'Un corte con nombre', texto: 'Hay un corte especial en que las dos razones dan lo mismo. Se llama sección áurea, y a esa razón común se le llama razón áurea. Se escribe con la letra griega φ (fi).' },
        { titulo: 'Qué mirar', texto: 'Al jugar, corre el punto P por el segmento AB y lee las dos razones. Busca dónde se acercan lo más posible y anota ese valor.' },
      ],
    },
    juega: {
      consigna: 'AB mide 10. Corre P y compara el total entre la parte mayor (AB/AP) con la mayor entre la menor (AP/PB).',
      voz: 'Busca el punto donde las dos razones casi coinciden.',
      controles: [{ id: 't', etiqueta: 'AP / AB', min: 0.5, max: 0.75, paso: 0.01, inicio: 0.55, unidad: '', decimales: 2, color: 'c-o' }],
      dibujo: v => ({ datos: corteFig(v.t), estado: {} }),
      // Se agarra el punto de corte P y se corre por el segmento AB.
      arrastres: [{ id: 'punto-p', etiqueta: 'punto de corte P', color: 'c-o',
        donde: v => enPantalla(corteFig(v.t), [10 * v.t, 0]),
        mover: (q, v) => ({ t: alPlano(corteFig(v.t), q)[0] / 10 }) }],
      lectura: v => [`AB/AP = ${f(1 / v.t, 3)}`, sep, `AP/PB = ${f(v.t / (1 - v.t), 3)}`],
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
        { estado: { corte: 1 }, texto: 'ACD tiene ángulos de 36°, 72° y 72°: lados d, d y 1.', ecuacion: ['AC = AD = d', sep, 'CD = 1'] },
        { estado: { corte: 1 }, texto: 'La bisectriz de un ángulo de 72° arma otro igual, más chico.', ecuacion: [frac('d', '1'), ' = ', frac('1', 'd − 1')] },
        { estado: { corte: 1 }, texto: 'Resuelve la ecuación cuadrática.', ecuacion: [sup2('d'), ' = d + 1 → d = ', frac('1 + √5', '2'), ' = φ'] },
      ],
    },
    regla: {
      texto: 'Hay sección áurea si el total es a la parte mayor como esta a la menor. Esa razón es φ = (1 + √5)/2; cumple φ² = φ + 1.',
      ecuacion: [{ llave: ['φ'], nota: 'razón áurea', color: 'c-h' }, ' = ', frac('1 + √5', '2'), ' ≈ 1,618', sep, { sup: ['φ', '2'] }, ' = φ + 1', sep, frac('diagonal', 'lado'), ' = φ'],
      condicion: 'el pentágono es regular: entonces diagonal entre lado da exactamente φ, para cualquier tamaño.',
      voz: 'φ no es una medida: es una razón. Úsala con su lado.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» (diagonal del pentágono y parte mayor), con otras semillas
    // y la misma cuenta con PHI.
    resuelve: {
      voz: 'Decide si la parte pedida es mayor o menor que el dato.',
      generar(s) {
        const r = azar(s + 900), L = r.ent(2, 20), t = s % 2;
        if (t === 0) {
          const d = L * PHI;
          return {
            enunciado: [`Un pentágono regular tiene lado ${L}. ¿Cuánto mide cada diagonal?`],
            dibujo: { datos: penta({ l: `${L}`, alt: `Pentágono regular de lado ${L} con una diagonal d` }), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden la diagonal d: el segmento que une dos vértices que no son seguidos.' },
              { tipo: 'datos', texto: `El pentágono es regular y su lado mide ${L}.` },
              { tipo: 'regla', texto: 'En todo pentágono regular, la diagonal entre el lado da la razón áurea φ, sea del tamaño que sea.',
                ecuacion: [frac('d', 'lado'), ' = φ = ', frac('1 + √5', '2'), ' ≈ 1,618'] },
              { tipo: 'cuentas', texto: 'La diagonal es φ veces el lado: multiplico.', ecuacion: [`d = ${L} · 1,618 = ${f(d)}`],
                dibujo: { datos: penta({ l: `${L}`, d: `d ≈ ${f(d)}`, alt: `Pentágono regular de lado ${L}: su diagonal mide unos ${f(d)}` }), estado: {} } },
              { tipo: 'sentido', texto: `La diagonal, ${f(d)}, es mayor que un lado (${L}) y menor que dos lados juntos (${2 * L}). Cuadra.` },
            ],
            respuesta: [`Cada diagonal mide unos ${f(d)}.`],
          };
        }
        const M = L / PHI, m = L - M;
        return {
          enunciado: [`Un segmento de ${L} se divide en sección áurea. ¿Cuánto mide la parte mayor?`],
          dibujo: { datos: { alt: `Segmento AB de ${L}, que se va a cortar en sección áurea`, vista: { x: [-0.6, 10.6], y: [-1.6, 1.6] },
            puntos: [pt('A', [0, 0], { rotulo: 'A', lado: 90 }), pt('B', [10, 0], { rotulo: 'B', lado: 90 })],
            segmentos: [{ de: 'A', a: 'B', grosor: 'variable', texto: `${L}`, lado: -1 }] }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden la parte mayor ', { v: 'c-o', t: 'AP' }, ' del segmento cortado en sección áurea.'] },
            { tipo: 'datos', texto: `El segmento total AB mide ${L}.` },
            { tipo: 'regla', texto: 'En la sección áurea, el total entre la parte mayor da φ ≈ 1,618, y la mayor entre la menor da lo mismo.',
              ecuacion: [frac('AB', 'AP'), ' = ', frac('AP', 'PB'), ' = φ'] },
            { tipo: 'cuentas', texto: 'La parte mayor es el total dividido entre φ; la menor es lo que sobra.',
              ecuacion: [{ v: 'c-o', t: 'AP' }, ` = ${L} ÷ 1,618 = ${f(M)}`, sep, { v: 'c-i', t: 'PB' }, ` = ${L} − ${f(M)} = ${f(m)}`],
              dibujo: { datos: corteFig(1 / PHI, L), estado: {} } },
            { tipo: 'sentido', texto: `Compruebo la otra razón: ${f(M)} ÷ ${f(m)} ≈ ${f(M / m, 3)}, también φ. Cuadra.` },
          ],
          respuesta: [`La parte mayor mide unos ${f(M)}.`],
        };
      },
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

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 1: n llega a 24 y el radio se arrastra desde un vértice. La lectura da lado, apotema
  // y el cociente perímetro / diámetro, que se acerca a π sin alcanzarlo.
  const regLibre = (n, R) => Object.assign(reg(n, R, { tri: n <= 12, central: true, R: 'R', a: 'a', vista: { x: [-4.8, 4.8], y: [-4.8, 4.8] } }),
    { circulos: [{ centro: 'O', r: R, grosor: 'fino', discontinua: true }] });
  const mesaPoligono = {
    id: 'poligono-libre', titulo: 'Polígono que se vuelve círculo', pieza: 'geo-figura',
    consigna: 'Sube n hasta 24 y arrastra un vértice para cambiar el radio. Mira el perímetro entre el diámetro.',
    controles: [
      { id: 'n', etiqueta: 'n', min: 3, max: 24, paso: 1, inicio: 6, unidad: 'lados', decimales: 0 },
      { id: 'R', etiqueta: 'R', min: 1, max: 4, paso: 0.5, inicio: 3, unidad: '', decimales: 1, color: 'c-o' },
    ],
    dibujo: v => ({ datos: regLibre(v.n, v.R), estado: {} }),
    // Se agarra el vértice del radio naranja: alejarlo del centro agranda el polígono sin cambiar su forma.
    arrastres: [{ id: 'vertice-radio', etiqueta: 'vértice del radio', color: 'c-o',
      donde: v => enPantalla(regLibre(v.n, v.R), vert(v.n, v.R)[0]),
      mover: (q, v) => { const z = alPlano(regLibre(v.n, v.R), q); return { R: Math.hypot(z[0], z[1]) }; } }],
    lectura: v => [cL, ` = ${f(lado(v.n, v.R))}`, sep, cA, ` = ${f(apot(v.n, v.R))}`, sep, frac('P', '2R'), ` = ${f(v.n * lado(v.n, 1) / 2, 3)}`],
    // Retos comprobados con lado() y apot(), las mismas funciones que dibujan y leen la mesa.
    invitaciones: [
      { texto: 'Acerca lo más posible el perímetro entre el diámetro a π.',
        logrado: v => Math.abs(pSobreD(v.n) - Math.PI) - DIST_PI < 1e-12,
        bien: 'Con 24 lados, 3,133. Más lados acercan, pero ninguno llega a π.' },
      { texto: 'Haz que el lado mida justo el doble de la apotema.',
        logrado: v => Math.abs(lado(v.n, v.R) - 2 * apot(v.n, v.R)) < 1e-9,
        bien: 'El cuadrado: su ángulo central es recto. ¿Por qué solo él?' },
      { texto: 'Consigue una apotema que mida justo la mitad del radio.',
        logrado: v => Math.abs(apot(v.n, v.R) - v.R / 2) < 1e-9,
        bien: 'El triángulo equilátero: O parte su altura en 2 : 1, como el baricentro.' },
      { texto: 'Haz que la apotema pase del 99 % del radio.',
        logrado: v => apot(v.n, v.R) > 0.99 * v.R,
        bien: 'El polígono casi se pega a la circunferencia: radio y apotema se juntan.' },
      { texto: 'Guarda dos polígonos con el mismo n y distinto radio; compara P/2R.',
        logrado: (v, guardados) => guardados.some(g => guardados.some(h => g.n === h.n && g.R !== h.R)),
        bien: 'Mismo n, mismo P/2R: el tamaño cambia, la forma no.' },
    ],
  };
  // Perímetro entre diámetro del polígono de n lados (no depende de R) y su menor distancia a π en la grilla de la mesa.
  const pSobreD = n => n * lado(n, 1) / 2;
  const DIST_PI = (() => { let m = Infinity; for (let n = 3; n <= 24; n++) m = Math.min(m, Math.abs(pSobreD(n) - Math.PI)); return m; })();

  // Mesa 2, más rica que la idea 2: además de elegir el polígono, el radio se arrastra; la lectura da la fórmula y su
  // valor, para ver que R√3, R√2 y R siguen al radio.
  const insLibre = (n, R) => Object.assign(reg(n, R, { R: 'R', l: 'ℓ', a: 'a', vista: { x: [-4.8, 4.8], y: [-4.8, 4.8] } }),
    { circulos: [{ centro: 'O', r: R, grosor: 'fino', discontinua: true }] });
  const NOTa = { 3: 'R/2', 4: 'R√2/2', 6: 'R√3/2' };
  const mesaInscritos = {
    id: 'inscritos-con-radio', titulo: 'Inscritos con radio libre', pieza: 'geo-figura',
    consigna: 'Elige el polígono y arrastra un vértice para cambiar R. Compara el lado y la apotema con R.',
    controles: [
      { id: 'n', etiqueta: 'polígono', opciones: [{ valor: 3, texto: 'triángulo' }, { valor: 4, texto: 'cuadrado' }, { valor: 6, texto: 'hexágono' }] },
      { id: 'R', etiqueta: 'R', min: 1, max: 4, paso: 0.5, inicio: 2, unidad: '', decimales: 1, color: 'c-o' },
    ],
    dibujo: v => ({ datos: insLibre(v.n, v.R), estado: {} }),
    arrastres: [{ id: 'vertice-radio', etiqueta: 'vértice del radio', color: 'c-o',
      donde: v => enPantalla(insLibre(v.n, v.R), vert(v.n, v.R)[0]),
      mover: (q, v) => { const z = alPlano(insLibre(v.n, v.R), q); return { R: Math.hypot(z[0], z[1]) }; } }],
    lectura: v => [cL, ` = ${NOT[v.n][0]} = ${f(lado(v.n, v.R))}`, sep, cA, ` = ${NOTa[v.n]} = ${f(apot(v.n, v.R))}`],
    invitaciones: [
      { texto: 'Consigue un lado que mida exactamente 4.',
        logrado: v => Math.abs(lado(v.n, v.R) - 4) < 1e-9,
        bien: 'Solo el hexágono: su lado es el radio. Los otros llevan raíz.' },
      { texto: 'Consigue una apotema que mida justo 2.',
        logrado: v => Math.abs(apot(v.n, v.R) - 2) < 1e-9,
        bien: 'Triángulo con R = 4: a = R/2 = 2. ¿Qué radio pediría el cuadrado?' },
      { texto: 'Con R = 4, busca la apotema más larga de los tres.',
        logrado: v => v.R === 4 && Math.abs(apot(v.n, 4) - Math.max(...[3, 4, 6].map(n => apot(n, 4)))) < 1e-9,
        bien: 'El hexágono: con más lados, la apotema se acerca más al radio.' },
      { texto: 'Guarda un triángulo y un hexágono con el mismo radio; compara sus lados.',
        logrado: (v, guardados) => guardados.some(g => g.n === 3 && guardados.some(h => h.n === 6 && h.R === g.R)),
        bien: 'Mismo R: el lado del triángulo es √3 veces el del hexágono.' },
    ],
  };

  // Mesa 3, más rica que la idea 4: P recorre casi todo AB (la idea lo deja entre 0,5 y 0,75), así aparecen los dos
  // puntos áureos; la lectura compara total/mayor con mayor/menor, sea cual sea la parte mayor.
  const mesaCorte = {
    id: 'corte-libre', titulo: 'Los dos cortes áureos', pieza: 'geo-figura',
    consigna: 'Corre P por todo AB. Busca dónde total/mayor y mayor/menor coinciden. Hay dos lugares: encuéntralos.',
    controles: [{ id: 't', etiqueta: 'AP / AB', min: 0.1, max: 0.9, paso: 0.002, inicio: 0.5, unidad: '', decimales: 3, color: 'c-o' }],
    dibujo: v => ({ datos: corteFig(v.t), estado: {} }),
    arrastres: [{ id: 'punto-p', etiqueta: 'punto de corte P', color: 'c-o',
      donde: v => enPantalla(corteFig(v.t), [10 * v.t, 0]),
      mover: (q, v) => ({ t: alPlano(corteFig(v.t), q)[0] / 10 }) }],
    lectura: v => { const M = Math.max(v.t, 1 - v.t), m = Math.min(v.t, 1 - v.t); return [`total/mayor = ${f(1 / M, 3)}`, sep, `mayor/menor = ${f(M / m, 3)}`]; },
    // Retos comprobados con razones(), la misma cuenta de la lectura (total/mayor y mayor/menor).
    invitaciones: [
      { texto: 'Encuentra un corte en que total/mayor y mayor/menor queden lo más iguales posible.',
        logrado: v => { const q = razones(v.t); return Math.abs(Math.abs(q.tm - q.mm) - DIF_AUREA) < 1e-9; },
        bien: 'Las dos rozan 1,618: es φ, la sección áurea. ¿Dónde está el otro corte?' },
      { texto: 'Haz que mayor/menor valga justo 1,5.',
        logrado: v => Math.abs(razones(v.t).mm - 1.5) < 1e-9,
        bien: 'Partes 6 y 4: mayor/menor es 1,5, pero total/mayor da 1,667. Todavía no coinciden.' },
      { texto: 'Corta de modo que la parte mayor sea más del doble de la menor.',
        logrado: v => razones(v.t).mm > 2,
        bien: 'Mayor/menor pasó de 2 y total/mayor no llega a 1,5: lejos de φ.' },
      { texto: 'Lleva mayor/menor a su valor más grande.',
        logrado: v => Math.abs(razones(v.t).mm - MM_MAX) < 1e-9,
        bien: 'En el borde, nueve veces. Total/mayor apenas pasa de 1: las dos se separan.' },
    ],
  };
  const razones = t => { const M = Math.max(t, 1 - t), m = Math.min(t, 1 - t); return { tm: 1 / M, mm: M / m }; };
  const T_CORTE = Array.from({ length: 401 }, (_, k) => +(0.1 + 0.002 * k).toFixed(3));
  const DIF_AUREA = Math.min(...T_CORTE.map(t => { const q = razones(t); return Math.abs(q.tm - q.mm); }));
  const MM_MAX = Math.max(...T_CORTE.map(t => razones(t).mm));

  return {
    unidad: 'geometria.poligonos-regulares',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js'],
    historia: {
      texto: 'Los polígonos regulares juntan dos preguntas: medirlos y construirlos con regla y compás. Los Elementos construyen varios inscritos en la circunferencia. Siglos después, Gauss relacionó la construcción del polígono de diecisiete lados con el álgebra. Dibujar uno en pantalla, conocer su ángulo central y demostrar que se puede construir son logros distintos.',
      pregunta: '¿Por qué más lados acercan el polígono al círculo sin igualarlo?',
      fuente: { titulo: 'Euclides, Elementos, libro IV (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookIV/bookIV.html' },
    },
    // Glosario: lo que este tema estrena. Ángulo central, hexágono, isósceles, inscrito, perímetro y diagonal vienen
    // de unidades anteriores y el lector los marca solos.
    glosario: [
      { termino: 'número pi', simbolo: 'π', formas: ['número pi', 'π'], def: 'Cuántas veces cabe el diámetro en la vuelta de una circunferencia; vale aproximadamente 3,1416.', ver: ['diámetro'] },
      { termino: 'polígono regular', formas: ['polígono regular', 'polígonos regulares'],
        def: 'Polígono con todos sus lados iguales y todos sus ángulos iguales.',
        ejemplo: 'El cuadrado lo es; el rombo no: lados iguales, ángulos distintos.', ver: ['apotema'] },
      { termino: 'apotema', simbolo: 'a', formas: ['apotema', 'apotemas'],
        def: 'Segmento perpendicular del centro de un polígono regular al punto medio de uno de sus lados.',
        ejemplo: 'Hexágono de lado 6: √(36 − 9) = 3√3 ≈ 5,2.', ver: ['polígono regular', 'ángulo central'] },
      { termino: 'seno', simbolo: 'sen', formas: ['seno', 'senos', 'sen'],
        def: 'En un triángulo rectángulo, el cateto opuesto a un ángulo agudo dividido entre la hipotenusa.',
        ejemplo: 'sen 30° = 1/2: el hexágono tiene lado 2R · sen 30° = R.', ver: ['coseno'] },
      { termino: 'coseno', simbolo: 'cos', formas: ['coseno', 'cosenos', 'cos'],
        def: 'En un triángulo rectángulo, el cateto pegado a un ángulo agudo dividido entre la hipotenusa.',
        ejemplo: 'cos 60° = 1/2: el triángulo equilátero tiene apotema R · cos 60° = R/2.', ver: ['seno', 'apotema'] },
      { termino: 'sección áurea', formas: ['sección áurea', 'secciones áureas'],
        def: 'Corte de un segmento en que el total es a la parte mayor como la mayor es a la menor.',
        ejemplo: 'AB = 10: el corte queda a unos 6,18 de A.', ver: ['razón áurea'] },
      { termino: 'razón áurea', simbolo: 'φ', formas: ['razón áurea', 'razones áureas'],
        def: 'El número (1 + √5)/2 ≈ 1,618, que cumple φ² = φ + 1.',
        ejemplo: 'En el pentágono regular, diagonal entre lado da φ.', ver: ['sección áurea'] },
      { termino: 'ecuación cuadrática', formas: ['ecuación cuadrática', 'ecuaciones cuadráticas'],
        def: 'Ecuación donde la incógnita aparece elevada al cuadrado, pero no a potencias mayores.',
        ejemplo: 'd² = d + 1 da d = (1 + √5)/2.' },
      { termino: 'regla y compás', formas: ['regla y compás'],
        def: 'Construir figuras solo con una regla sin marcas y un compás, sin medir longitudes ni ángulos.' },
    ],
    // Laboratorio: las tres mesas son más ricas que sus ideas (n hasta 24 con radio libre, inscritos con radio libre y
    // el corte áureo en todo el segmento).
    laboratorio: [mesaPoligono, mesaInscritos, mesaCorte],
    ideas: [central, notIdea, dobleIdea, aurea],
  };
});
