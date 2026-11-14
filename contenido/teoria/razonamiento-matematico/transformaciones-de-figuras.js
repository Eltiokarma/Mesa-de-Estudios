/*
 * Teoría de «Movimiento y comparación de figuras» (razonamiento-matematico.transformaciones-de-figuras).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 16); historia: la disección de Dudeney (1905, MacTutor).
 * Precisión: trasladar, girar y reflejar conservan distancias y áreas; el reflejo invierte la orientación; ampliar k veces
 * multiplica las áreas por k²; en un rodamiento, el centro y un punto del borde recorren caminos distintos.
 * Colores (regla 4): la figura original turquesa (c-i), la imagen naranja (c-o), la esquina marcada rojo (c-h), el área
 * barrida verde (c-d).
 * Compañero: Faro (zorro). Códigos: RME20, RME21, RME22, RME23, RME24, RME25 (existentes); RMT-TRF-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: saber qué conserva cada movimiento y medir lo que cambia: área ampliada, vueltas al rodar y área barrida.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: reconoce la transformación entre dos figuras, calcula áreas semejantes, vueltas de una rueda y un área barrida.
 *   Orden de atención: 1.º la figura y su imagen · 2.º la lectura · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «si duplico los lados, ¿el área también se duplica?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const k = { v: 'c-o', t: 'k' }, Ar = { v: 'c-d', t: 'A' }, R = { v: 'c-i', t: 'R' }, th = { v: 'c-h', t: 'θ' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría de rm-plano (X, Y en unidades del problema).
  const PLANO = () => Kit.piezas['rm-plano'];
  const aFig = (datos, x, y) => { const g = PLANO().geometria(datos); return { x: g.X(x), y: g.Y(y) }; };
  const aUnid = (datos, pt) => { const g = PLANO().geometria(datos); return [(pt.x - g.X(0)) / g.k, (pt.y - g.Y(0)) / g.k]; };
  // Ángulo en grados, en sentido antihorario desde el eje x, del punto (x, y) visto desde O (y hacia abajo).
  const angulo = (O, x, y) => ((Math.atan2(-(y - O[1]), x - O[0]) * 180 / Math.PI) + 360) % 360;
  function opcionesTexto(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) { if (!d.texto || vistos.has(d.texto) || /NaN|Infinity/.test(d.texto) || ops.length >= 4) continue; vistos.add(d.texto); ops.push(d); }
    return ops;
  }

  // ---------- Idea 1: mover sin deformar (isometrías) ----------
  // Cambia: el movimiento aplicado · Permanece: la pieza P de 5 cuadritos y su esquina marcada · Progresa: la imagen ·
  // Se reserva: el reflejo, que no se logra girando · Debe verse: lados y área iguales; el reflejo invierte el orden.
  const PIEZA = [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]];   // la «P»: no tiene simetrías
  const MOV = {
    traslada: ([x, y]) => [x, y],
    gira90: ([x, y]) => [-y, x],
    gira180: ([x, y]) => [-x, -y],
    refleja: ([x, y]) => [-x, y],
  };
  // Piezas de 5 cuadritos sin simetrías: cada movimiento da una imagen distinta. La primera casilla es la marcada.
  const PIEZAS = {
    P: PIEZA,
    F: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],
    L: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]],
    N: [[1, 0], [1, 1], [0, 2], [1, 2], [0, 3]],
    Y: [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]],
  };
  const NOMBRE = { traslada: 'Traslación', gira90: 'Giro de 90°', gira180: 'Giro de 180°', refleja: 'Reflejo en un espejo' };
  const norm = cs => { const mx = Math.min(...cs.map(c => c[0])), my = Math.min(...cs.map(c => c[1])); return cs.map(([x, y]) => [x - mx, y - my]); };
  function celdas(cs, dx, dy, color, marca, extra = {}) {
    return cs.map(([x, y], i) => ({ puntos: [[dx + x, dy + y], [dx + x + 1, dy + y], [dx + x + 1, dy + y + 1], [dx + x, dy + y + 1]], color: i === 0 && marca ? 'h' : color, relleno: i === 0 && marca ? 0.55 : 0.25, desde: extra.desde || 0 }));
  }
  function mover(mov, extra = {}) {
    const img = norm(PIEZA.map(MOV[mov]));
    return { ancho: 10, alto: 5, cuadricula: 1, poligonos: celdas(PIEZA, 1, 1, 'i', true).concat(celdas(img, 6, 1, 'o', true, extra)), textos: [{ x: 2, y: 4.5, t: 'original', color: 'i' }, { x: 7.5, y: 4.5, t: extra.etiqueta || 'imagen', color: 'o' }], pie: extra.pie };
  }
  const isometria = {
    id: 'mover-sin-deformar',
    titulo: 'Mover sin deformar',
    temas: ['Congruencia de figuras', 'Rotación y traslación'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Aplica un movimiento a la pieza. Fíjate en el cuadrito rojo y en el orden de las esquinas: ¿qué se mantiene y qué cambia?',
      voz: 'Compara la pieza girada con la reflejada.',
      controles: [{ id: 'm', etiqueta: 'Movimiento', opciones: Object.keys(MOV).map(m => ({ valor: m, texto: NOMBRE[m] })) }],
      dibujo: val => ({ datos: mover(val.m), estado: {} }),
      lectura: val => [`5 cuadritos · ${val.m === 'refleja' ? 'orientación invertida' : 'misma orientación'}`],
      minimo: 4,
      // Lleva el cuadrito rojo de la imagen a otro lugar: queda el movimiento que lo pone más cerca.
      arrastres: [{ id: 'cuadrito-rojo', etiqueta: 'cuadrito rojo de la imagen', color: 'c-h',
        donde: val => { const c = norm(PIEZA.map(MOV[val.m]))[0]; return aFig(mover(val.m), 6 + c[0] + 0.5, 1 + c[1] + 0.5); },
        mover: (pt, val) => {
          const [x, y] = aUnid(mover(val.m), pt);
          let mejor = val.m, dmin = Infinity;
          for (const m of Object.keys(MOV)) { const c = norm(PIEZA.map(MOV[m]))[0], d = Math.hypot(6 + c[0] + 0.5 - x, 1 + c[1] + 0.5 - y); if (d < dmin) { dmin = d; mejor = m; } }
          return { m: mejor };
        } }],
    },
    predice: {
      pregunta: 'Con solo giros y traslaciones sobre la mesa, sin levantar la pieza, ¿se puede llevar la pieza a su reflejo?',
      opciones: [
        { id: 'si', texto: 'Sí, con un giro de 180°', error: 'RME24', siFuera: 'El giro de 180° mueve el cuadrito rojo, pero no invierte el orden de las esquinas.' },
        { id: 'c', texto: 'No: el reflejo invierte la orientación', correcta: true },
        { id: 'si2', texto: 'Sí, con dos giros de 90°', error: 'RME24', siFuera: 'Dos giros de 90° son un giro de 180°: la orientación sigue igual.' },
      ],
      dibujo: { datos: mover('refleja', { etiqueta: 'reflejo' }), estado: {} },
      revelar: { datos: mover('gira180', { etiqueta: 'giro de 180°', pie: 'Ningún giro coincide con el reflejo' }), estado: {} },
      coincide: 'Coincide: girar y trasladar conservan la orientación; para el reflejo hay que voltear la pieza.',
    },
    mira: {
      datos: Object.assign(mover('refleja', { etiqueta: 'reflejo' }), { lineas: [{ de: [5, 0.5], a: [5, 4], discontinua: true, grosor: 'contorno', desde: 1 }] }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Las dos piezas tienen los mismos lados y la misma área: son congruentes.' },
        { estado: { corte: 1 }, texto: 'Una es la imagen de la otra en un espejo.' },
        { estado: { corte: 1 }, texto: 'Recorriendo el borde, una va en sentido horario y la otra al revés.' },
      ],
    },
    regla: {
      texto: 'Trasladar, girar y reflejar no cambian distancias, ángulos ni áreas: dan figuras congruentes. Girar y trasladar conservan la orientación; reflejar la invierte.',
      ecuacion: [{ llave: ['|T(P) − T(Q)|'], nota: 'entre imágenes', color: 'c-o' }, ' = ', { llave: ['|P − Q|'], nota: 'entre originales', color: 'c-i' }],
      condicion: 'la figura no se estira ni se corta; para pasar de una a su reflejo en el plano hace falta voltearla.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Sigue el cuadrito rojo y el sentido del borde.',
      generar(s) {
        const r = azar(s), m = Object.keys(MOV)[s % 4], nom = Object.keys(PIEZAS)[Math.floor(s / 4) % 5], pz = PIEZAS[nom];
        const img = norm(pz.map(MOV[m]));
        void r;
        return {
          pregunta: `¿Qué movimiento lleva la pieza ${nom} turquesa a la naranja?`,
          dibujo: { datos: { ancho: 10, alto: 5, cuadricula: 1, poligonos: celdas(pz, 0.5, 0.5, 'i', true).concat(celdas(img, 5.5, 0.5, 'o', true)) }, estado: {} },
          opciones: [
            ...Object.keys(MOV).map(x => (x === m ? { id: x, texto: NOMBRE[x], correcta: true } : { id: x, texto: NOMBRE[x], error: x === 'refleja' || m === 'refleja' ? 'RME24' : 'RME23', siFuera: 'Aplica ese movimiento a la pieza turquesa: el cuadrito rojo no cae donde está el naranja.' })),
          ],
          solucion: { texto: m === 'refleja' ? 'La orientación se invirtió: es un reflejo.' : 'La orientación se mantiene; el cuadrito rojo indica el giro.' },
        };
      },
    },
  };

  // ---------- Idea 2: semejanza y áreas ----------
  // Cambia: el factor de ampliación · Permanece: la figura de 3 cuadritos · Progresa: los cuadritos de la copia ·
  // Se reserva: un área dada (12 cm²) · Debe verse: lados por k, área por k².
  function ampliar(kk, extra = {}) {
    const base = [[0, 0], [1, 0], [0, 1]];
    const big = [];
    for (const [x, y] of base) for (let i = 0; i < kk; i++) for (let j = 0; j < kk; j++) big.push([x * kk + i, y * kk + j]);
    return {
      ancho: 10, alto: 6.2, cuadricula: 0,
      poligonos: celdas(base, 0.5, 0.5, 'i', false).concat(celdas(big, 3.4, 0.5, 'o', false)),
      textos: [{ x: 1.5, y: 3, t: '3 cuadritos', color: 'i' }],
      pie: extra.pie || `Lados × ${kk} · cuadritos: ${3 * kk * kk}`,
    };
  }
  const semejanza = {
    id: 'semejanza',
    titulo: 'Lados por k, área por k²',
    temas: ['Semejanza de figuras', 'Aplicaciones de áreas'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Amplía la figura de 3 cuadritos multiplicando sus lados por k. Cuenta los cuadritos de la copia.',
      voz: 'Cada cuadrito se vuelve un cuadrado de k por k.',
      controles: [{ id: 'k', etiqueta: 'k', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: ampliar(val.k), estado: {} }),
      lectura: val => [k, ` = ${val.k}`, '   ·   ', 'área = 3 · ', { sup: [String(val.k), '2'] }, ` = ${3 * val.k * val.k}`],
      minimo: 3,
      // Se estira la copia desde su esquina de arriba a la derecha: la diagonal crece con k.
      arrastres: [{ id: 'esquina', etiqueta: 'esquina de la copia', color: 'c-o',
        donde: val => aFig(ampliar(val.k), 3.4 + 2 * val.k, 0.5),
        mover: (pt, val) => ({ k: (aUnid(ampliar(val.k), pt)[0] - 3.4) / 2 }) }],
    },
    predice: {
      pregunta: 'Un terreno de 12 cm² en el plano se dibuja de nuevo con todas sus medidas al doble. ¿Cuánto mide el área del nuevo dibujo?',
      opciones: [
        { id: 'doble', texto: '24 cm²', error: 'RMT-TRF-1', siFuera: '24 sería estirando en un solo sentido. Al doble de largo y de ancho, cada cuadrito se vuelve 4.' },
        { id: 'c', texto: '48 cm²', correcta: true },
        { id: 'triple', texto: '36 cm²', error: 'RMT-TRF-2', siFuera: '36 sería con medidas al triple... de un lado; aquí es k = 2 y k² = 4.' },
      ],
      dibujo: { datos: ampliar(1, { pie: 'Original' }), estado: {} },
      revelar: { datos: ampliar(2, { pie: 'k = 2 · área × 4: 12 · 4 = 48 cm²' }), estado: {} },
      coincide: 'Coincide: con k = 2, cada cuadrito se vuelve 2 × 2 = 4 cuadritos.',
    },
    mira: {
      datos: ampliar(2),
      pasos: [
        { estado: { corte: 0 }, texto: 'Cada lado se multiplica por 2.', ecuacion: [k, ' = 2'] },
        { estado: { corte: 0 }, texto: 'Cada cuadrito se vuelve un cuadrado de 2 × 2: 4 cuadritos.', ecuacion: [{ sup: [k, '2'] }, ' = 4'] },
        { estado: { corte: 0 }, texto: 'El área total se multiplica por 4.', ecuacion: ['12 · 4 = 48 cm²'] },
      ],
    },
    regla: {
      texto: 'Si una figura se amplía con factor k, sus longitudes se multiplican por k, sus áreas por k² y sus volúmenes por k³.',
      ecuacion: [{ sub: [Ar, 'nueva'] }, ' = ', { sup: [k, '2'] }, ' · ', { sub: [Ar, 'original'] }],
      condicion: 'todas las medidas se multiplican por el mismo k (la figura no se estira solo a lo ancho).',
    },
    ahoraTu: {
      voz: 'Primero halla k; después elévalo al cuadrado.',
      generar(s) {
        const r = azar(s), kk = r.elegir([2, 3, 4, 5, 0.5]), A0 = kk === 0.5 ? 4 * r.ent(3, 15) : r.ent(3, 20), tipo = s % 2;
        const A1 = A0 * kk * kk;
        const frase = kk === 0.5 ? 'a la mitad' : kk === 2 ? 'al doble' : kk === 3 ? 'al triple' : `${kk} veces más grandes`;
        if (tipo) {
          return {
            pregunta: `Una figura de ${f(A0)} cm² se copia con todas sus medidas ${frase}. ¿Cuál es el área de la copia?`,
            opciones: opcionesTexto(`${f(A1)} cm²`, [
              { id: 'k', texto: `${f(A0 * kk)} cm²`, error: 'RMT-TRF-1', siFuera: 'El área no cambia con k, sino con k².' },
              { id: 'k3', texto: `${f(A0 * kk ** 3)} cm²`, error: 'RMT-TRF-3', siFuera: 'k³ es para volúmenes.' },
              { id: 'suma', texto: `${f(A0 + kk)} cm²`, error: 'RMT-TRF-4', siFuera: 'Ampliar multiplica, no suma.' },
            ]),
            solucion: { texto: `k = ${f(kk)}, así que el área se multiplica por ${f(kk * kk)}.`, ecuacion: [`${f(A0)} · ${f(kk * kk)} = ${f(A1)} cm²`] },
          };
        }
        return {
          pregunta: `Dos figuras semejantes tienen áreas de ${f(Math.min(A0, A1))} cm² y ${f(Math.max(A0, A1))} cm². ¿Cuántas veces más largo es cada lado de la mayor?`,
          opciones: opcionesTexto(f(Math.max(kk, 1 / kk)), [
            { id: 'k2', texto: f(Math.max(kk, 1 / kk) ** 2), error: 'RMT-TRF-1', siFuera: 'Esa es la razón de áreas; los lados van con su raíz.' },
            { id: 'mitad', texto: f(Math.max(kk, 1 / kk) ** 2 / 2), error: 'RMT-TRF-5', siFuera: 'La razón de lados es la raíz de la de áreas, no la mitad.' },
            { id: 'mas', texto: f(Math.max(kk, 1 / kk) + 1), error: 'RMT-TRF-4', siFuera: 'Comprueba: el cuadrado de ese número no da la razón de áreas.' },
          ]),
          solucion: { texto: 'La razón de áreas es k²; la de lados, su raíz.', ecuacion: [k, ` = `, { raiz: `${f(Math.max(A0, A1))} / ${f(Math.min(A0, A1))}` }, ` = ${f(Math.max(kk, 1 / kk))}`] },
        };
      },
    },
  };

  // ---------- Idea 3: rodamiento ----------
  // Cambia: cuántas vueltas da la rueda · Permanece: el radio · Progresa: lo que avanza el centro · Se reserva: la moneda
  // que rueda alrededor de otra · Debe verse: el centro avanza 2πR por vuelta; en un camino curvo cuenta el camino del centro.
  const RUEDA = 0.6;
  function rueda(n, extra = {}) {
    // Radio 0,6: dos vueltas (7,54) caben a escala real, así la rueda y su avance se miden con la misma regla.
    const Rr = RUEDA, pasos = Math.max(1, Math.round(n * 4)), d = 2 * Math.PI * Rr * n, x0 = 1, escala = Math.min(1, 7.6 / Math.max(d, 0.01));
    const ruedas = [{ x: x0, y: 2.6, r: Rr, color: 'i', relleno: 0.08, discontinua: true, marca: 180 }];
    ruedas.push({ x: x0 + d * escala, y: 2.6, r: Rr, color: 'i', marca: (180 + 360 * n) % 360 });
    return {
      ancho: 10, alto: 5,
      circulos: ruedas,
      lineas: [{ de: [0.1, 2.6 + Rr], a: [9.9, 2.6 + Rr], grosor: 'contorno' }, { de: [x0, 2.6], a: [x0 + d * escala, 2.6], color: 'o', flecha: d > 0.3, grosor: 'variable' }],
      textos: [{ x: 5, y: 4.4, t: `centro: ${f(2 * n, 2)}πR`, color: 'o' }],
      pie: extra.pie,
      nodos: [], aristas: [], void: pasos,
    };
  }
  function monedas(extra = {}) {
    return {
      ancho: 10, alto: 6.2,
      circulos: [{ x: 5, y: 3.4, r: 1.2, color: 'i', relleno: 0.2, rotulo: 'fija' }, { x: 5, y: 1, r: 1.2, color: 'o', relleno: 0.1, marca: 180, discontinua: !!extra.camino, rotulo: 'rueda', en: [5, 0.85] }, { x: 5, y: 3.4, r: 2.4, color: 'o', relleno: 0, discontinua: true, grosor: 'contorno', desde: extra.camino || 0 }].filter(c => !(c.desde && !extra.camino)),
      pie: extra.pie,
    };
  }
  const rodar = {
    id: 'rodamiento',
    titulo: 'Lo que recorre el centro',
    temas: ['Rodamiento y recorrido de un punto'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Una rueda de radio R rueda sin resbalar sobre el piso. Cambia cuántas vueltas da y mira cuánto avanza su centro.',
      voz: 'Sigue el radio marcado: da una vuelta por cada 2πR.',
      controles: [{ id: 'n', etiqueta: 'Vueltas', min: 0.5, max: 2, paso: 0.5, inicio: 0.5, decimales: 1, color: 'c-h' }],
      dibujo: val => ({ datos: rueda(val.n), estado: {} }),
      lectura: val => [`${f(val.n, 1)} ${val.n === 1 ? 'vuelta' : 'vueltas'} → el centro avanza ${f(2 * val.n, 2)}π`, R],
      minimo: 3,
      // Se empuja la rueda por su centro: cada 2πR de avance es una vuelta.
      arrastres: [{ id: 'centro', etiqueta: 'centro de la rueda', color: 'c-o',
        donde: val => aFig(rueda(val.n), 1 + 2 * Math.PI * RUEDA * val.n, 2.6),
        mover: (pt, val) => ({ n: (aUnid(rueda(val.n), pt)[0] - 1) / (2 * Math.PI * RUEDA) }) }],
    },
    predice: {
      pregunta: 'Una moneda rueda sin resbalar alrededor de otra moneda igual, que está fija, hasta volver a su lugar. ¿Cuántas vueltas sobre sí misma da?',
      opciones: [
        { id: 'una', texto: '1 vuelta', error: 'RME20', siFuera: '1 sería si su centro recorriera un borde de radio R. El centro recorre un círculo de radio 2R.' },
        { id: 'c', texto: '2 vueltas', correcta: true },
        { id: 'media', texto: '1,5 vueltas', error: 'RME21', siFuera: 'Cuenta el camino del centro: 2π · 2R, entre 2πR por vuelta.' },
      ],
      dibujo: { datos: monedas(), estado: {} },
      revelar: { datos: monedas({ camino: 0.0001, pie: 'El centro recorre 2π · 2R: 2 vueltas' }), estado: {} },
      coincide: 'Coincide: el centro recorre una circunferencia de radio 2R, el doble de largo.',
    },
    // Hallazgo 9: el juego rueda en línea recta y Mira usa las dos monedas de la predicción. Son dos representaciones a
    // propósito: la recta enseña «una vuelta por cada 2πR del centro»; las monedas muestran que en un camino curvo manda
    // el camino del centro, no el borde. El primer paso de Mira repite la regla de la recta antes de pasar a la curva.
    mira: {
      datos: monedas({ camino: 1 }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Al rodar sin resbalar, por cada vuelta el centro avanza 2πR.', ecuacion: ['vueltas = ', { frac: ['camino del centro', ['2π', R]] }] },
        { estado: { corte: 1 }, texto: 'Alrededor de la moneda fija, el centro recorre un círculo de radio 2R.', ecuacion: ['camino = 2π · 2', R] },
        { estado: { corte: 1 }, texto: 'Así da 2 vueltas.', ecuacion: [{ frac: [['4π', R], ['2π', R]] }, ' = 2'] },
      ],
    },
    regla: {
      texto: 'Una rueda que rueda sin resbalar da tantas vueltas como el camino de su centro dividido entre su perímetro. Un punto del borde hace otro camino.',
      ecuacion: ['vueltas = ', { frac: ['camino del centro', [{ llave: ['2π', R], nota: 'una vuelta', color: 'c-i' }]] }],
      condicion: 'la rueda no resbala; alrededor de un círculo fijo de radio r, el centro recorre 2π(r + R).',
    },
    ahoraTu: {
      voz: 'Calcula el camino del centro, no el del borde.',
      generar(s) {
        const r = azar(s), Rr = r.ent(1, 5), tipo = s % 2;
        if (tipo) {
          const rf = Rr * r.ent(1, 4), bien = (rf + Rr) / Rr;
          return {
            pregunta: `Una moneda de radio ${Rr} cm rueda sin resbalar alrededor de un disco fijo de radio ${rf} cm, una vuelta completa. ¿Cuántas vueltas da sobre sí misma?`,
            opciones: opcionesTexto(f(bien), [
              { id: 'borde', texto: f(rf / Rr), error: 'RME20', siFuera: 'Eso usa el borde del disco fijo; el centro recorre un círculo mayor.' },
              { id: 'mas', texto: f(bien + 1), error: 'RME21', siFuera: 'Revisa el radio del camino del centro: r + R.' },
              { id: 'una', texto: '1', error: 'RME20', siFuera: 'Dar la vuelta al disco no es dar una vuelta propia.' },
            ]),
            solucion: { texto: `El centro recorre 2π(${rf} + ${Rr}).`, ecuacion: [`(${rf} + ${Rr}) / ${Rr} = ${f(bien)}`] },
          };
        }
        const nv = r.ent(2, 9), d = 2 * Rr * nv;
        return {
          pregunta: `Una rueda de radio ${Rr} dm rueda sin resbalar en línea recta y su centro avanza ${d}π dm. ¿Cuántas vueltas da?`,
          opciones: opcionesTexto(f(nv), [
            { id: 'r', texto: f(d / Rr), error: 'RMT-TRF-6', siFuera: 'Una vuelta avanza 2πR, no πR.' },
            { id: 'd', texto: f(nv * 2), error: 'RMT-TRF-6', siFuera: 'Una vuelta avanza 2πR.' },
            { id: 'pi', texto: f(d), error: 'RMT-TRF-7', siFuera: 'Eso es el camino, no las vueltas.' },
          ]),
          solucion: { texto: `Cada vuelta avanza 2π · ${Rr} = ${2 * Rr}π dm.`, ecuacion: [`${d}π / ${2 * Rr}π = ${nv}`] },
        };
      },
    },
  };

  // ---------- Idea 4: área barrida ----------
  // Cambia: el ángulo que gira un segmento · Permanece: el largo y el punto fijo (un extremo) · Progresa: el sector ·
  // Se reserva: girar alrededor del punto medio · Debe verse: el área barrida depende de la distancia al punto fijo.
  function sector(L, ang, pivote, extra = {}) {
    const O = [5, 3], Rr = pivote === 'medio' ? L / 2 : L, n = 24;
    const pts = [O].concat(Array.from({ length: n + 1 }, (_, i) => { const a = Math.PI * ang / 180 * i / n; return [O[0] + Rr * Math.cos(a), O[1] - Rr * Math.sin(a)]; }));
    const pol = [{ puntos: pts, color: 'd', relleno: 0.3 }];
    if (pivote === 'medio') pol.push({ puntos: [O].concat(Array.from({ length: n + 1 }, (_, i) => { const a = Math.PI + Math.PI * ang / 180 * i / n; return [O[0] + Rr * Math.cos(a), O[1] - Rr * Math.sin(a)]; })), color: 'd', relleno: 0.3 });
    const a = Math.PI * ang / 180;
    const ext = pivote === 'medio' ? [[O[0] - Rr, O[1]], [O[0] + Rr, O[1]]] : [O, [O[0] + Rr, O[1]]];
    const fin = pivote === 'medio' ? [[O[0] - Rr * Math.cos(a), O[1] + Rr * Math.sin(a)], [O[0] + Rr * Math.cos(a), O[1] - Rr * Math.sin(a)]] : [O, [O[0] + Rr * Math.cos(a), O[1] - Rr * Math.sin(a)]];
    return {
      ancho: 10, alto: 6.2,
      poligonos: pol,
      lineas: [{ de: ext[0], a: ext[1], color: 'i', grosor: 'variable', discontinua: true }, { de: fin[0], a: fin[1], color: 'i', grosor: 'variable' }],
      nodos: [{ id: 'o', x: O[0], y: O[1], r: 5, relleno: 1, color: 'h' }],
      pie: extra.pie,
    };
  }
  const L0 = 2.6;
  const barrida = {
    id: 'area-barrida',
    titulo: 'El área que barre un giro',
    temas: ['Área de la región generada'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Un segmento de largo L gira alrededor de uno de sus extremos. Cambia el ángulo y mira la región que barre.',
      voz: 'La región es un trozo de círculo de radio L.',
      controles: [{ id: 'a', etiqueta: 'Giro', min: 45, max: 360, paso: 45, inicio: 90, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: val => ({ datos: sector(L0, val.a, 'extremo'), estado: {} }),
      lectura: val => [Ar, ` = ${f(val.a / 360, 3)} · π`, { sup: ['L', '2'] }],
      minimo: 3,
      // Se gira el segmento por su extremo libre; casi una vuelta completa se lee como 360°.
      arrastres: [{ id: 'extremo-libre', etiqueta: 'extremo que gira', color: 'c-h',
        donde: val => { const a = val.a * Math.PI / 180; return aFig(sector(L0, val.a, 'extremo'), 5 + L0 * Math.cos(a), 3 - L0 * Math.sin(a)); },
        mover: (pt, val) => { const [x, y] = aUnid(sector(L0, val.a, 'extremo'), pt); let a = angulo([5, 3], x, y); if (a < 22.5) a += 360; return { a }; } }],
    },
    predice: {
      pregunta: 'Un segmento de 6 cm gira 180° alrededor de su punto medio. ¿Qué área barre?',
      opciones: [
        { id: 'extremo', texto: '18π cm²', error: 'RME25', siFuera: '18π sería girando 180° alrededor de un extremo, con radio 6.' },
        { id: 'c', texto: '9π cm²', correcta: true },
        { id: 'mitad', texto: '4,5π cm²', error: 'RMT-TRF-8', siFuera: 'Cada mitad barre medio círculo de radio 3: juntas, un círculo entero.' },
        { id: 'treinta6', texto: '36π cm²', error: 'RMT-TRF-9', siFuera: '36π es un círculo de radio 6; el radio aquí es 3.' },
      ],
      dibujo: { datos: sector(L0, 0.001, 'medio'), estado: {} },
      revelar: { datos: sector(L0, 180, 'medio', { pie: 'Dos medios círculos de radio 3: 9π cm²' }), estado: {} },
      coincide: 'Coincide: cada mitad barre medio círculo de radio 3; juntas forman un círculo de 9π.',
    },
    mira: {
      datos: sector(L0, 180, 'medio'),
      pasos: [
        { estado: { corte: 0 }, texto: 'El punto fijo es el medio: cada mitad mide 3 cm.', ecuacion: ['radio = 3 cm'] },
        { estado: { corte: 0 }, texto: 'Cada mitad barre medio círculo de radio 3.', ecuacion: [{ frac: [['π · ', { sup: ['3', '2'] }], '2'] }, ' = 4,5π'] },
        { estado: { corte: 0 }, texto: 'Las dos mitades: un círculo completo.', ecuacion: [Ar, ' = 9π cm²'] },
      ],
    },
    regla: {
      texto: 'Un segmento que gira un ángulo θ alrededor de un punto barre sectores cuyo radio es la distancia de cada extremo al punto fijo.',
      ecuacion: [Ar, ' = ', { frac: [th, '360°'] }, ' · π · ', { llave: [{ sup: ['r', '2'] }], nota: 'r: radio', color: 'c-i' }],
      condicion: 'el punto fijo está en el segmento y el giro no pasa de una vuelta; lo pisado cuenta una vez.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Ubica el punto fijo y mide los radios.',
      generar(s) {
        const r = azar(s), L = 2 * r.ent(2, 9), ang = r.elegir([60, 90, 120, 180, 270, 360]), medio = s % 2 === 1;
        const rad = medio ? L / 2 : L, areaPi = (medio ? 2 : 1) * ang / 360 * rad * rad;
        const fmt = v => `${f(v, 2)}π cm²`;
        return {
          pregunta: `Un segmento de ${L} cm gira ${ang}° alrededor de ${medio ? 'su punto medio' : 'uno de sus extremos'}. ¿Qué área barre?`,
          dibujo: { datos: sector(L0, 0.001, medio ? 'medio' : 'extremo'), estado: {} },
          opciones: opcionesTexto(fmt(medio && ang > 180 ? Math.PI * 0 + (L / 2) ** 2 : areaPi), [
            { id: 'otro', texto: fmt(medio ? ang / 360 * L * L : 2 * ang / 360 * (L / 2) ** 2), error: 'RME25', siFuera: medio ? 'Ese radio es el largo entero; gira desde el medio.' : 'Gira desde un extremo: el radio es todo el segmento.' },
            { id: 'diam', texto: fmt(ang / 360 * (L * L) / 2), error: 'RMT-TRF-8', siFuera: 'Revisa el radio de cada sector.' },
            { id: 'circ', texto: fmt(rad * rad), error: 'RMT-TRF-9', siFuera: 'Eso es un círculo completo; el giro es de ' + ang + '°.' },
          ]),
          solucion: { texto: medio ? `Dos sectores de radio ${L / 2} y ${ang}°${ang > 180 ? '; se pisan y cubren el círculo' : ''}.` : `Un sector de radio ${L} y ${ang}°.`, ecuacion: [Ar, ` = ${fmt(medio && ang > 180 ? (L / 2) ** 2 : areaPi)}`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: dos movimientos seguidos (la idea 1 deja uno). Casos raros: dos reflejos devuelven la orientación; un giro
  // y un reflejo dan otro reflejo.
  const CORTO = { traslada: 'Traslación', gira90: 'Giro 90°', gira180: 'Giro 180°', refleja: 'Reflejo' };
  const OPS_MOV = Object.keys(MOV).map(m => ({ valor: m, texto: CORTO[m] }));
  const POS = [0.3, 3.6, 6.9];
  const etapas = val => { const a = norm(PIEZA.map(MOV[val.m1])), b = norm(a.map(MOV[val.m2])); return [PIEZA, a, b]; };
  const datosDos = val => {
    const [p0, p1, p2] = etapas(val), inv = (val.m1 === 'refleja') !== (val.m2 === 'refleja');
    return { ancho: 10, alto: 5.2, cuadricula: 0,
      poligonos: celdas(p0, POS[0], 0.6, 'i', true).concat(celdas(p1, POS[1], 0.6, 'o', true), celdas(p2, POS[2], 0.6, 'd', true)),
      textos: [{ x: 1.3, y: 4.4, t: 'original', color: 'i' }, { x: 4.9, y: 4.4, t: CORTO[val.m1], color: 'o' }, { x: 8.2, y: 4.4, t: CORTO[val.m2], color: 'd' }],
      pie: inv ? 'Al final: orientación invertida' : 'Al final: misma orientación' };
  };
  const manijaMov = (id, k, ctl) => ({ id, etiqueta: `cuadrito rojo tras el ${k === 1 ? 'primer' : 'segundo'} movimiento`, color: 'c-h',
    donde: val => { const c = etapas(val)[k][0]; return aFig(datosDos(val), POS[k] + c[0] + 0.5, 0.6 + c[1] + 0.5); },
    mover: (pt, val) => {
      const [x, y] = aUnid(datosDos(val), pt);
      let mejor = val[ctl], dmin = Infinity;
      for (const m of Object.keys(MOV)) {
        const c = etapas(Object.assign({}, val, { [ctl]: m }))[k][0], d = Math.hypot(POS[k] + c[0] + 0.5 - x, 0.6 + c[1] + 0.5 - y) - (m === val[ctl] ? 1e-6 : 0);
        if (d < dmin) { dmin = d; mejor = m; }
      }
      return { [ctl]: mejor };
    } });
  const mesaDos = {
    id: 'dos-movimientos', titulo: 'Dos movimientos seguidos', pieza: 'rm-plano',
    consigna: 'Aplica un movimiento y después otro. Lleva cada cuadrito rojo a su sitio y mira cómo queda la orientación.',
    controles: [{ id: 'm1', etiqueta: 'Primero', opciones: OPS_MOV }, { id: 'm2', etiqueta: 'Después', opciones: OPS_MOV }],
    dibujo: val => ({ datos: datosDos(val), estado: {} }),
    lectura: val => [`${CORTO[val.m1]} y luego ${CORTO[val.m2].toLowerCase()}: `, (val.m1 === 'refleja') !== (val.m2 === 'refleja') ? 'invertida' : 'igual'],
    arrastres: [manijaMov('primero', 1, 'm1'), manijaMov('despues', 2, 'm2')],
  };
  // Mesa 2: la moneda que rueda alrededor de un disco más grande, con cuánto del recorrido se lleva a mano.
  // El radio de la moneda se ajusta para que el camino del centro, de radio (q + 1)·R, llene la figura.
  const RMq = q => 2.8 / (q + 1), OM = [5, 3.1];
  const datosDisco = val => {
    const RM = RMq(val.q), rf = val.q * RM, D = rf + RM, a = val.a * Math.PI / 180, cx = OM[0] + D * Math.sin(a), cy = OM[1] - D * Math.cos(a);
    const vueltas = val.a / 360 * (val.q + 1);
    return { ancho: 10, alto: 6.2,
      circulos: [{ x: OM[0], y: OM[1], r: rf, color: 'i', relleno: 0.2 }, { x: OM[0], y: OM[1], r: D, color: 'o', relleno: 0, discontinua: true, grosor: 'contorno' },
        { x: cx, y: cy, r: RM, color: 'o', relleno: 0.12, marca: (180 + val.a * (val.q + 1)) % 360 }],
      pie: `Vueltas propias: ${f(vueltas, 2)}` };
  };
  const mesaDisco = {
    id: 'moneda-y-disco', titulo: 'La moneda y el disco', pieza: 'rm-plano',
    consigna: 'Lleva la moneda alrededor del disco fijo y cambia el tamaño del disco. Sigue el radio marcado de la moneda.',
    controles: [
      { id: 'q', etiqueta: 'Disco (radios de moneda)', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      { id: 'a', etiqueta: 'Recorrido', min: 0, max: 360, paso: 30, inicio: 90, unidad: '°', decimales: 0, color: 'c-o' },
    ],
    dibujo: val => ({ datos: datosDisco(val), estado: {} }),
    lectura: val => { const v = val.a / 360 * (val.q + 1); return [`Disco de radio ${val.q === 1 ? '' : val.q}R · ${val.a}°: `, `${f(v, 2)} ${v === 1 ? 'vuelta propia' : 'vueltas propias'}`]; },
    arrastres: [{ id: 'moneda', etiqueta: 'moneda que rueda', color: 'c-o',
      donde: val => { const D = 2.8, a = val.a * Math.PI / 180; return aFig(datosDisco(val), OM[0] + D * Math.sin(a), OM[1] - D * Math.cos(a)); },
      mover: (pt, val) => {
        const [x, y] = aUnid(datosDisco(val), pt);
        let a = ((Math.atan2(x - OM[0], -(y - OM[1])) * 180 / Math.PI) + 360) % 360;   // 0° arriba, sentido horario
        if (val.a > 270 && a < 15) a = 360;
        return { a };
      } }],
  };
  // Mesa 3: el punto fijo se corre por el segmento (de un extremo al medio) y el giro llega hasta media vuelta.
  const LS = 4, OS = [5, 4.3];
  const datosBarre = val => {
    const a = val.t * Math.PI / 180, b = LS - val.p, n = 24;
    const arco = (r, a0) => [OS].concat(Array.from({ length: n + 1 }, (_, i) => { const u = a0 + a * i / n; return [OS[0] + r * Math.cos(u), OS[1] - r * Math.sin(u)]; }));
    const pol = [{ puntos: arco(b, 0), color: 'd', relleno: 0.3 }];
    if (val.p > 0) pol.push({ puntos: arco(val.p, Math.PI), color: 'd', relleno: 0.3 });
    return { ancho: 10, alto: 6.6, poligonos: pol,
      lineas: [{ de: [OS[0] - val.p, OS[1]], a: [OS[0] + b, OS[1]], color: 'i', grosor: 'variable', discontinua: true },
        { de: [OS[0] - val.p * Math.cos(a), OS[1] + val.p * Math.sin(a)], a: [OS[0] + b * Math.cos(a), OS[1] - b * Math.sin(a)], color: 'i', grosor: 'variable' }],
      nodos: [{ id: 'o', x: OS[0], y: OS[1], r: 5, relleno: 1, color: 'h' }],
      pie: `Radios ${f(val.p, 1)} y ${f(b, 1)} cm` };
  };
  const areaBarre = val => val.t / 360 * (val.p * val.p + (LS - val.p) ** 2);
  const mesaBarre = {
    id: 'punto-fijo-movil', titulo: 'El punto fijo se corre', pieza: 'rm-plano',
    consigna: 'Un segmento de 4 cm gira alrededor del punto rojo. Corre el punto fijo y gira el extremo: compara las áreas.',
    controles: [
      { id: 'p', etiqueta: 'Punto fijo, desde el extremo', min: 0, max: 2, paso: 0.5, inicio: 1, unidad: 'cm', decimales: 1, color: 'c-h' },
      { id: 't', etiqueta: 'Giro', min: 30, max: 180, paso: 15, inicio: 90, unidad: '°', decimales: 0, color: 'c-h' },
    ],
    dibujo: val => ({ datos: datosBarre(val), estado: {} }),
    lectura: val => [`Fijo a ${f(val.p, 1)} cm · ${val.t}°: `, Ar, ` = ${f(areaBarre(val), 2)}π cm²`],
    arrastres: [
      { id: 'extremo-izquierdo', etiqueta: 'dónde está el punto fijo', color: 'c-h',
        donde: val => aFig(datosBarre(val), OS[0] - val.p, OS[1]),
        mover: (pt, val) => ({ p: OS[0] - aUnid(datosBarre(val), pt)[0] }) },
      { id: 'extremo-que-gira', etiqueta: 'extremo que gira', color: 'c-h',
        donde: val => { const a = val.t * Math.PI / 180, b = LS - val.p; return aFig(datosBarre(val), OS[0] + b * Math.cos(a), OS[1] - b * Math.sin(a)); },
        mover: (pt, val) => { const [x, y] = aUnid(datosBarre(val), pt); let a = angulo(OS, x, y); if (a > 270) a = 0; return { t: a }; } },
    ],
  };

  return {
    unidad: 'razonamiento-matematico.transformaciones-de-figuras',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-plano.js'],
    // Laboratorio: dos movimientos seguidos, la moneda alrededor de discos de varios tamaños y el segmento con el punto
    // fijo que se corre.
    laboratorio: [mesaDos, mesaDisco, mesaBarre],
    historia: {
      texto: 'En 1905, Henry Dudeney mostró una disección articulada: cuatro piezas que forman un triángulo equilátero o un cuadrado. Cambiar la disposición conservaba el área. Eso no significa que todo movimiento conserve también el perímetro o la orientación: hay que mirar qué transformación se aplicó.',
      pregunta: '¿Qué se conserva cuando una figura se mueve?',
      fuente: { titulo: 'Henry Ernest Dudeney · MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Dudeney/' },
    },
    ideas: [isometria, semejanza, rodar, barrida],
  };
});
