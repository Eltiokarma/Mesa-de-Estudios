/*
 * Teoría de «Tablas, gráficos y suficiencia de datos» (razonamiento-matematico.tablas-graficos-y-suficiencia).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 18) y el microguion RM de suficiencia del expediente
 * (x + y = 10 no basta; con x − y = 2, sí); historia: Nightingale y Hugh Small (University of York).
 * Precisión: los datos bastan si hay al menos un caso compatible y todos dan el mismo valor pedido.
 * Colores (regla 4): el valor de antes turquesa (c-i), el de después naranja (c-o), lo que cambia verde (c-d), el eje
 * que engaña rojo (c-h).
 * Compañero: Faro (zorro). Códigos: RMT-TAB-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: leer un gráfico con su escala, contar puntos de un campeonato y decidir si unos datos bastan.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: compara crecimientos absolutos y porcentuales, calcula puntos de una liga y elige qué datos bastan.
 *   Orden de atención: 1.º las barras o la tabla · 2.º la lectura · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «si encontré una solución, ¿ya bastan los datos?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-i', t: 'x' }, y = { v: 'c-o', t: 'y' }, E = { v: 'c-h', t: 'E' }, Pn = { v: 'c-d', t: 'P' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opcionesTexto(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) { if (!d.texto || vistos.has(d.texto) || /NaN|Infinity/.test(d.texto) || ops.length >= 4) continue; vistos.add(d.texto); ops.push(d); }
    return ops;
  }

  const plural = (n, uno, varios) => `${f(n, 0)} ${n === 1 ? uno : varios}`;
  // Gesto directo (docs/teoria.md §4b): las manijas viven en la geometría que exporta rm-plano.
  const PLANO = () => Kit.piezas['rm-plano'];
  const Y0_G = 5.2, ALTO_G = 4.4;   // piso y alto de las barras de grafico(), en unidades del plano
  // Valor que marca el dedo según la escala del gráfico (piso = base, techo = tope).
  const valorEn = (datos, base, tope, py) => { const g = PLANO().geometria(datos); return base + (g.Y(Y0_G) - py) / (g.k * ALTO_G) * (tope - base); };

  // ---------- Idea 1: leer con la escala ----------
  // Cambia: dónde empieza el eje vertical · Permanece: las ventas (90 y 100) · Progresa: cuánto más alta se ve la barra ·
  // Se reserva: crecer más en soles contra crecer más en porcentaje · Debe verse: la altura dibujada depende del eje.
  function grafico(barras, base, tope, extra = {}) {
    const y0 = 5.2, alto = 4.4, Y = v => y0 - alto * (v - base) / (tope - base);
    const paso = barras.length > 2 ? 1.9 : 2.2;
    const poligonos = barras.map((b, i) => { const x0 = 2.4 + i * paso; return { puntos: [[x0, y0], [x0 + 1.4, y0], [x0 + 1.4, Y(b.v)], [x0, Y(b.v)]], color: b.color, relleno: 0.35 }; });
    const textos = barras.map((b, i) => ({ x: 3.1 + i * paso, y: Y(b.v) - 0.35, t: String(b.v), color: b.color }))
      .concat(barras.map((b, i) => ({ x: 3.1 + i * paso, y: y0 + 0.45, t: b.rotulo, color: b.color })))
      .concat([{ x: 1.3, y: y0, t: String(base), color: base ? 'h' : undefined, ancla: 'end' }, { x: 1.3, y: Y(tope), t: String(tope), ancla: 'end' }]);
    return { ancho: 10, alto: 6, lineas: [{ de: [1.6, y0 + 0.05], a: [1.6, 0.4], flecha: true, grosor: 'contorno', color: base ? 'h' : undefined }, { de: [1.5, y0], a: [9.6, y0], grosor: 'contorno' }], poligonos, textos, pie: extra.pie };
  }
  const datosLeer = val => grafico([{ v: 90, color: 'i', rotulo: 'Marzo' }, { v: 100, color: 'o', rotulo: 'Abril' }], val.b, 100);
  const leer = {
    id: 'leer-con-escala',
    titulo: 'La altura depende del eje',
    temas: ['Lectura de tablas y gráficos'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Una tienda vendió 90 cajas en marzo y 100 en abril. Cambia dónde empieza el eje vertical y compara las barras.',
      voz: 'Los datos no cambian; solo cambia el dibujo.',
      controles: [{ id: 'b', etiqueta: 'El eje empieza en', opciones: [0, 50, 80, 85].map(v => ({ valor: v, texto: String(v) })) }],
      dibujo: val => ({ datos: datosLeer(val), estado: {} }),
      lectura: val => [`Aumento real: 11 % · la barra se ve ${f((100 - val.b) / (90 - val.b), 1)} veces`],
      minimo: 3,
      // Se arrastra el piso del eje hacia arriba: el valor que marca el dedo es donde empieza el eje (el más cercano).
      arrastres: [{ id: 'piso', etiqueta: 'dónde empieza el eje vertical', color: 'c-h',
        donde: val => { const g = PLANO().geometria(datosLeer(val)); return { x: g.X(1.6), y: g.Y(Y0_G) }; },
        mover: (pt, val) => { const v = valorEn(datosLeer(val), val.b, 100, pt.y); return { b: [0, 50, 80, 85].reduce((m, o) => (Math.abs(o - v) < Math.abs(m - v) ? o : m), val.b) }; } }],
    },
    predice: {
      pregunta: 'La tienda A pasó de vender 200 a 250 cajas; la tienda B, de 50 a 80. ¿Cuál creció más en porcentaje?',
      opciones: [
        { id: 'a', texto: 'La A: aumentó 50 cajas', error: 'RMT-TAB-1', siFuera: 'La A creció más en cajas (50 contra 30), pero el porcentaje compara con lo que tenía.' },
        { id: 'c', texto: 'La B: creció 60 %', correcta: true },
        { id: 'igual', texto: 'Igual: las dos subieron', error: 'RMT-TAB-2', siFuera: 'Subir no dice cuánto: A subió 25 % y B, 60 %.' },
      ],
      dibujo: { datos: grafico([{ v: 200, color: 'i', rotulo: 'A' }, { v: 250, color: 'o', rotulo: 'A' }, { v: 50, color: 'i', rotulo: 'B' }, { v: 80, color: 'o', rotulo: 'B' }], 0, 250, { pie: 'Turquesa: antes · naranja: después' }), estado: {} },
      revelar: { datos: grafico([{ v: 200, color: 'i', rotulo: 'A' }, { v: 250, color: 'o', rotulo: 'A' }, { v: 50, color: 'i', rotulo: 'B' }, { v: 80, color: 'o', rotulo: 'B' }], 0, 250, { pie: 'A: +50 = 25 % · B: +30 = 60 %' }), estado: {} },
      coincide: 'Coincide: 30 sobre 50 es más que 50 sobre 200.',
    },
    mira: {
      datos: grafico([{ v: 90, color: 'i', rotulo: 'Marzo' }, { v: 100, color: 'o', rotulo: 'Abril' }], 80, 100, { pie: 'Con el eje en 80, abril parece el doble' }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Con el eje en 80, la barra de abril mide el doble.', ecuacion: ['(100 − 80) / (90 − 80) = 2'] },
        { estado: { corte: 0 }, texto: 'Pero las ventas solo subieron 10 de 90.', ecuacion: ['10 / 90 ≈ 11 %'] },
        { estado: { corte: 0 }, texto: 'Se lee el número del eje, no la altura dibujada.' },
      ],
    },
    regla: {
      texto: 'Un gráfico se lee con su escala: dónde empieza el eje y qué unidad usa. Un crecimiento en porcentaje se compara con el valor inicial, no con la altura.',
      ecuacion: ['crecimiento % = ', { frac: ['después − antes', { llave: ['antes'], nota: 'el inicio', color: 'c-i' }] }, ' · 100'],
      condicion: 'el eje está rotulado; si no empieza en 0, las alturas no son proporcionales a los valores.',
    },
    ahoraTu: {
      voz: 'Calcula cada aumento sobre su propio inicio.',
      generar(s) {
        const r = azar(s);
        let a0, a1, b0, b1;
        do { a0 = 10 * r.ent(10, 30); a1 = a0 + 10 * r.ent(2, 8); b0 = 10 * r.ent(2, 8); b1 = b0 + 10 * r.ent(1, 5); } while ((a1 - a0) / a0 === (b1 - b0) / b0 || a1 - a0 === b1 - b0);
        const pa = (a1 - a0) / a0 * 100, pb = (b1 - b0) / b0 * 100, pide = s % 2 ? 'porcentaje' : 'cantidad';
        const ganaA = pide === 'porcentaje' ? pa > pb : a1 - a0 > b1 - b0;
        return {
          pregunta: `Un colegio A pasó de ${a0} a ${a1} alumnos; otro, B, de ${b0} a ${b1}. ¿Cuál creció más en ${pide === 'porcentaje' ? 'porcentaje' : 'número de alumnos'}?`,
          opciones: [
            { id: 'a', texto: `El A (${pide === 'porcentaje' ? `${f(pa, 1)} %` : `+${a1 - a0}`})`, error: 'RMT-TAB-1', siFuera: pide === 'porcentaje' ? 'Compara cada aumento con su inicio.' : 'Compara cuántos alumnos sumó cada uno.' },
            { id: 'b', texto: `El B (${pide === 'porcentaje' ? `${f(pb, 1)} %` : `+${b1 - b0}`})`, error: 'RMT-TAB-1', siFuera: pide === 'porcentaje' ? 'Compara cada aumento con su inicio.' : 'Compara cuántos alumnos sumó cada uno.' },
            { id: 'igual', texto: 'Crecieron igual', error: 'RMT-TAB-2', siFuera: 'Los dos aumentos son distintos.' },
          ].map(o => ((o.id === 'a' && ganaA) || (o.id === 'b' && !ganaA) ? { id: o.id, texto: o.texto, correcta: true } : o)),
          solucion: { texto: `A: +${a1 - a0} (${f(pa, 1)} %). B: +${b1 - b0} (${f(pb, 1)} %).` },
        };
      },
    },
  };

  // ---------- Idea 2: situaciones deportivas ----------
  // Cambia: cuántos partidos terminan empatados · Permanece: liga de 4 equipos, todos contra todos · Progresa: los
  // puntos repartidos · Se reserva: una liga de 5 · Debe verse: un partido reparte 3 puntos, o 2 si es empate.
  function liga(n, emp, extra = {}) {
    const G = n * (n - 1) / 2;
    return {
      columnas: ['Partidos', 'Empates', 'Puntos'], filas: [`${n} equipos`], ancho: 84,
      celdas: [[{ t: String(G) }, { t: String(emp), color: 'h' }, { t: String(3 * G - emp), color: 'd', resalto: 'd' }]],
      notas: [{ t: extra.nota || `3 · ${G} − ${emp} = ${3 * G - emp} puntos` }, { t: 'Gana 3, empata 1, pierde 0' }],
    };
  }
  // Sin arrastre: la tabla solo trae conteos (partidos, empates, puntos); no hay un objeto que agarrar.
  const deportes = {
    id: 'puntos-de-una-liga',
    titulo: 'Cuántos puntos reparte una liga',
    temas: ['Situaciones deportivas'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Liga de 4 equipos, todos contra todos una vez. Ganar da 3 puntos y empatar, 1 a cada uno. Cambia cuántos partidos se empatan.',
      voz: 'Un empate reparte 2 puntos en vez de 3.',
      controles: [{ id: 'e', etiqueta: 'Empates', min: 0, max: 6, paso: 1, inicio: 0, decimales: 0, color: 'c-h' }],
      dibujo: val => ({ datos: liga(4, val.e), estado: {} }),
      lectura: val => [Pn, ` = 3 · 6 − `, E, ` = ${18 - val.e}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En una liga de 5 equipos, todos contra todos una vez, hubo 3 empates. ¿Cuántos puntos sumaron entre todos los equipos?',
      opciones: [
        { id: 'veinte', texto: '20 partidos', error: 'RMT-TAB-3', siFuera: 'Cada partido se juega una vez: A contra B es el mismo que B contra A.' },
        { id: 'c', texto: '27 puntos', correcta: true },
        { id: 'treinta', texto: '30 puntos', error: 'RMT-TAB-4', siFuera: '30 sería sin empates; cada empate reparte un punto menos.' },
        { id: 'treinta3', texto: '33 puntos', error: 'RMT-TAB-5', siFuera: 'Un empate no suma puntos de más: reparte 2 en vez de 3.' },
      ],
      dibujo: { datos: liga(5, 0, { nota: '¿Cuántos puntos con 3 empates?' }), estado: {} },
      revelar: { datos: liga(5, 3), estado: {} },
      coincide: 'Coincide: 10 partidos reparten 30 puntos, menos 1 por cada empate.',
    },
    mira: {
      datos: liga(5, 3),
      pasos: [
        { estado: { corte: 0 }, texto: 'Todos contra todos: cada par de equipos juega una vez.', ecuacion: [{ frac: ['5 · 4', '2'] }, ' = 10 partidos'] },
        { estado: { corte: 0 }, texto: 'Si todos tuvieran ganador: 3 puntos por partido.', ecuacion: ['3 · 10 = 30'] },
        { estado: { corte: 0 }, texto: 'Cada empate reparte 2: un punto menos.', ecuacion: [Pn, ' = 30 − 3 = 27'] },
      ],
    },
    regla: {
      texto: 'En una liga de n equipos, todos contra todos una vez, se juegan n(n − 1)/2 partidos. Cada partido con ganador reparte 3 puntos; cada empate, 2.',
      ecuacion: [Pn, ' = 3 · ', { llave: [{ frac: ['n(n − 1)', '2'] }], nota: 'partidos', color: 'c-i' }, ' − ', { llave: [E], nota: 'empates', color: 'c-h' }],
      condicion: 'se juega una sola vuelta y el sistema es 3, 1 y 0; con ida y vuelta, los partidos se duplican.',
    },
    ahoraTu: {
      pieza: 'rm-tablero',
      voz: 'Primero los partidos; luego los puntos.',
      generar(s) {
        const r = azar(s), n = r.ent(4, 8), G = n * (n - 1) / 2, emp = r.ent(0, Math.min(6, G)), pide = s % 3;
        if (pide === 2) {
          const Pt = 3 * G - emp;
          return {
            pregunta: `En una liga de ${n} equipos, todos contra todos una vez, se repartieron ${Pt} puntos en total (3 por ganar, 1 por empatar). ¿Cuántos partidos terminaron empatados?`,
            opciones: opcionesTexto(String(emp), [
              { id: 'g', texto: String(G - emp), error: 'RMT-TAB-6', siFuera: 'Esos son los partidos con ganador.' },
              { id: 'dob', texto: String(2 * emp + 1), error: 'RMT-TAB-5', siFuera: 'Cada empate quita solo un punto.' },
              { id: 'n', texto: String(Math.abs(3 * n * (n - 1) - Pt)), error: 'RMT-TAB-3', siFuera: 'Contaste cada partido dos veces.' },
            ]),
            solucion: { texto: `${G} partidos darían ${3 * G}; faltan ${emp}, uno por empate.`, ecuacion: [E, ` = ${3 * G} − ${Pt} = ${emp}`] },
          };
        }
        const bien = pide ? 3 * G - emp : G;
        return {
          pregunta: pide ? `En una liga de ${n} equipos, todos contra todos una vez, hubo ${emp} empates. ¿Cuántos puntos se repartieron en total?` : `En una liga de ${n} equipos, cada uno juega una vez contra cada otro. ¿Cuántos partidos se juegan?`,
          opciones: opcionesTexto(String(bien), pide ? [
            { id: 'sin', texto: String(3 * G), error: 'RMT-TAB-4', siFuera: 'Faltan los puntos que no se dan en los empates.' },
            { id: 'mas', texto: String(3 * G + emp), error: 'RMT-TAB-5', siFuera: 'Un empate reparte menos puntos, no más.' },
            { id: 'dob', texto: String(3 * n * (n - 1) - emp), error: 'RMT-TAB-3', siFuera: 'Contaste cada partido dos veces.' },
          ] : [
            { id: 'dob', texto: String(n * (n - 1)), error: 'RMT-TAB-3', siFuera: 'A contra B es el mismo partido que B contra A.' },
            { id: 'n2', texto: String(n * n), error: 'RMT-TAB-7', siFuera: 'Un equipo no juega contra sí mismo.' },
            { id: 'n', texto: String(n - 1), error: 'RMT-TAB-8', siFuera: 'Esos son los partidos de un solo equipo.' },
          ]),
          solucion: { texto: pide ? `${G} partidos: 3 puntos cada uno, menos 1 por empate.` : 'Cada par de equipos juega una vez.', ecuacion: [pide ? `3 · ${G} − ${emp} = ${bien}` : `${n} · ${n - 1} / 2 = ${G}`] },
        };
      },
    },
  };

  // ---------- Idea 3: suficiencia de datos ----------
  // Cambia: el valor de x · Permanece: el dato x + y = 10 · Progresa: los casos que cumplen el dato · Se reserva: un segundo
  // dato que dice lo mismo · Debe verse: basta si todos los casos compatibles dan el mismo valor pedido.
  function casos(lista, extra = {}) {
    return {
      columnas: ['x', 'y', extra.columna || 'Cumple'], filas: lista.map((_, i) => `Caso ${i + 1}`), ancho: 70,
      celdas: lista.map(([a, b, ok]) => [{ t: String(a), color: 'i' }, { t: String(b), color: 'o' }, { marca: ok ? 'si' : 'no', color: ok ? 'd' : 'h' }]),
      notas: [{ t: extra.nota || 'Dato: x + y = 10' }],
    };
  }
  // Sin arrastre en la idea: los casos son filas de una tabla. En el laboratorio, los casos son puntos del plano y el
  // punto sí se arrastra sobre las rectas de los datos.
  const suficiencia = {
    id: 'suficiencia',
    titulo: 'Bastan si todos coinciden',
    temas: ['Suficiencia de datos'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'x e y son enteros entre 0 y 10, y se sabe que x + y = 10. Prueba distintos valores de x: todos cumplen el dato.',
      voz: 'Si dos casos cumplen y dan x distinto, el dato no basta.',
      controles: [{ id: 'x', etiqueta: 'x', min: 0, max: 10, paso: 1, inicio: 4, decimales: 0, color: 'c-i' }],
      dibujo: val => ({ datos: casos([[4, 6, true], [val.x, 10 - val.x, true]]), estado: {} }),
      lectura: val => [x, ` = ${val.x}, `, y, ` = ${10 - val.x}: cumple`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Se agrega un segundo dato: 2x + 2y = 20. Con los dos datos juntos, ¿se puede saber el valor de x?',
      opciones: [
        { id: 'si', texto: 'Sí: ahora hay dos ecuaciones', error: 'RMT-TAB-9', siFuera: 'Dos ecuaciones bastan si dicen cosas distintas. Esta es la primera multiplicada por 2.' },
        { id: 'c', texto: 'No: el segundo dato dice lo mismo que el primero', correcta: true },
        { id: 'contra', texto: 'No: los datos se contradicen', error: 'RMT-TAB-10', siFuera: 'No se contradicen: (4, 6) cumple los dos.' },
      ],
      dibujo: { datos: casos([[4, 6, true], [7, 3, true]], { nota: 'Dato I: x + y = 10 · Dato II: 2x + 2y = 20' }), estado: {} },
      revelar: { datos: casos([[4, 6, true], [7, 3, true]], { nota: 'Los dos casos cumplen I y II: x no se fija' }), estado: {} },
      coincide: 'Coincide: (4, 6) y (7, 3) cumplen los dos datos y dan x distinto. El dato II es redundante.',
    },
    mira: {
      datos: casos([[4, 6, false], [7, 3, false], [6, 4, true]], { columna: 'x − y = 2', nota: 'Los tres cumplen x + y = 10' }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Con x + y = 10, hay casos que dan x distinto: no basta.' },
        { estado: { corte: 0 }, texto: 'Si en cambio se sabe x − y = 2, solo (6, 4) cumple los dos.', ecuacion: [x, ' + ', y, ' = 10', '   ·   ', x, ' − ', y, ' = 2'] },
        { estado: { corte: 0 }, texto: 'Un solo valor de x: ahí los datos sí bastan.', ecuacion: [x, ' = 6'] },
      ],
    },
    regla: {
      texto: 'En suficiencia de datos, los datos bastan si al menos un caso los cumple y todos los que los cumplen dan el mismo valor de lo pedido.',
      ecuacion: ['bastan  ⇔  ', { llave: ['casos ≠ ∅'], nota: 'hay alguno', color: 'c-d' }, ' y ', { llave: ['un solo valor'], nota: 'todos coinciden', color: 'c-i' }],
      condicion: 'se buscan todos los casos compatibles, no solo uno; y se compara solo la cantidad pedida, no todo el caso.',
    },
    ahoraTu: {
      voz: 'Busca dos casos que cumplan los datos y den valores distintos.',
      generar(s) {
        const r = azar(s), a = r.ent(3, 9), b = r.ent(1, a - 1), tipo = s % 5;
        const CLAVE = { A: 'Basta I sola', B: 'Basta II sola', C: 'Juntas bastan, solas no', D: 'Cualquiera sola basta', E: 'Ni juntas bastan' };
        const items = [
          { q: 'x', I: `x + y = ${a + b}`, II: `y = ${b}`, k: 'C', sol: `Juntas: x = ${a}. Sola, I deja muchos casos.` },
          { q: 'el área de un rectángulo', I: `sus lados miden ${a} y ${b} cm`, II: `su perímetro mide ${2 * (a + b)} cm`, k: 'A', sol: `I da ${a * b} cm²; II admite rectángulos de áreas distintas.` },
          { q: 'x', I: `x² = ${a * a}`, II: `x = ${a}`, k: 'B', sol: `I permite ${a} y −${a}; II fija x.` },
          { q: 'x + y', I: `x + y = ${a + b}`, II: `${2}x + ${2}y = ${2 * (a + b)}`, k: 'D', sol: `Cada dato solo fija x + y = ${a + b}.` },
          { q: 'x', I: `x + y = ${a + b}`, II: 'x > 0 e y > 0', k: 'E', sol: 'Aun juntas admiten casos con x distinto.' },
        ][tipo];
        return {
          pregunta: `Se pide ${items.q}. Dato I: ${items.I}. Dato II: ${items.II}. ¿Qué datos bastan?`,
          opciones: Object.keys(CLAVE).map(kx => (kx === items.k ? { id: kx, texto: CLAVE[kx], correcta: true } : { id: kx, texto: CLAVE[kx], error: 'RMT-TAB-9', siFuera: 'Busca dos casos que cumplan esos datos y den distinto valor de lo pedido.' })),
          solucion: { texto: items.sol },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: dos barras y el piso del eje, todo arrastrable: el caso raro es un piso tan alto que una barra «crece» varias veces.
  const TOPE = 150;
  // Cuántas veces es abril respecto de marzo: en las ventas y en las alturas dibujadas (desde el piso del eje).
  const razonReal = val => val.c / val.a, razonDibujo = val => (val.c - val.b) / (val.a - val.b);
  const casi = (p, q) => Math.abs(p - q) < 1e-9;
  // El menor aumento real que el dibujo muestra como el doble o más, buscado con las mismas razones en toda la mesa.
  let menorDoble = null;
  const menorAumentoDoble = () => {
    if (menorDoble !== null) return menorDoble;
    menorDoble = Infinity;
    for (let a = 85; a <= 150; a += 5) for (let c = a + 5; c <= 150; c += 5) for (let b = 0; b <= 80; b += 5)
      if (razonDibujo({ a, b, c }) >= 2 - 1e-9) menorDoble = Math.min(menorDoble, razonReal({ a, b, c }));
    return menorDoble;
  };
  const datosEje = val => grafico([{ v: val.a, color: 'i', rotulo: 'Marzo' }, { v: val.c, color: 'o', rotulo: 'Abril' }], val.b, TOPE);
  const mesaEje = {
    id: 'eje-libre', titulo: 'Barras y eje a tu gusto', pieza: 'rm-plano',
    consigna: 'Arrastra el techo de cada barra y el piso del eje. Compara el aumento real con lo que muestra el dibujo.',
    controles: [
      { id: 'a', etiqueta: 'Marzo', min: 85, max: 150, paso: 5, inicio: 90, decimales: 0, color: 'c-i' },
      { id: 'c', etiqueta: 'Abril', min: 85, max: 150, paso: 5, inicio: 100, decimales: 0, color: 'c-o' },
      { id: 'b', etiqueta: 'El eje empieza en', min: 0, max: 80, paso: 5, inicio: 0, decimales: 0, color: 'c-h' },
    ],
    dibujo: val => ({ datos: datosEje(val), estado: {} }),
    lectura: val => [`Real: ×${f(razonReal(val), 2)} · dibujo: ×${f(razonDibujo(val), 2)}`],
    arrastres: [
      { id: 'piso', etiqueta: 'dónde empieza el eje vertical', color: 'c-h',
        donde: val => { const g = PLANO().geometria(datosEje(val)); return { x: g.X(1.6), y: g.Y(Y0_G) }; },
        mover: (pt, val) => ({ b: valorEn(datosEje(val), val.b, TOPE, pt.y) }) },
      ...[['a', 0, 'marzo', 'c-i'], ['c', 1, 'abril', 'c-o']].map(([id, k, mes, color]) => ({ id: `techo-${mes}`, etiqueta: `ventas de ${mes}`, color,
        // La manija va justo bajo el techo, dentro de la barra, para no tapar el número que está encima.
        donde: val => { const g = PLANO().geometria(datosEje(val)); return { x: g.X(3.1 + 2.2 * k), y: g.Y(Y0_G - ALTO_G * (val[id] - val.b) / (TOPE - val.b) + 0.45) }; },
        mover: (pt, val) => { const g = PLANO().geometria(datosEje(val)); return { [id]: valorEn(datosEje(val), val.b, TOPE, pt.y - 0.45 * g.k) }; } })),
    ],
    // Retos: las mismas dos razones que da la lectura (ventas contra alturas dibujadas).
    invitaciones: [
      { texto: 'Haz que la barra de abril se vea justo el triple de la de marzo.',
        logrado: val => casi(razonDibujo(val), 3),
        bien: 'El triple en el dibujo, pero mira cuánto subieron de verdad las ventas.' },
      { texto: 'Busca el aumento real más chico que el dibujo muestre como el doble.',
        logrado: val => val.c > val.a && razonDibujo(val) >= 2 - 1e-9 && casi(razonReal(val), menorAumentoDoble()),
        bien: 'Un aumento pequeñito, dibujado como el doble: el piso alto lo infla.' },
      { texto: 'Con el eje lejos de 0, logra que dibujo y ventas digan lo mismo.',
        logrado: val => val.b >= 50 && casi(razonDibujo(val), razonReal(val)),
        bien: 'Solo si nada cambió. Con el eje cortado, toda diferencia se agranda.' },
      { texto: 'Guarda dos casos que suban las mismas cajas con distinto aumento real.',
        logrado: (val, guardados) => guardados.some(p => guardados.some(q => p.c - p.a > 0 && p.c - p.a === q.c - q.a && !casi(razonReal(p), razonReal(q)))),
        bien: 'Mismas cajas de más, distinto porcentaje: todo depende de dónde se parte.' },
    ],
  };
  // Mesa 2: ligas de 3 a 8 equipos, a una o dos vueltas. Sin arrastre: la tabla son solo conteos.
  const partidos = val => val.n * (val.n - 1) / 2 * val.v;
  const puntos = val => 3 * partidos(val) - Math.min(val.e, partidos(val));
  const ligaLibre = val => {
    const G = partidos(val), e = Math.min(val.e, G);
    return {
      columnas: ['Partidos', 'Empates', 'Puntos'], filas: [`${val.n} equipos`], ancho: 84,
      celdas: [[{ t: String(G) }, { t: String(e), color: 'h' }, { t: String(3 * G - e), color: 'd', resalto: 'd' }]],
      notas: [{ t: `${val.v === 2 ? 'Ida y vuelta' : 'Una vuelta'}: 3 · ${G} − ${e} = ${3 * G - e}` }, { t: val.e > G ? `Solo hay ${G} partidos para empatar` : 'Gana 3, empata 1, pierde 0' }],
    };
  };
  const mesaLiga = {
    id: 'liga-libre', titulo: 'Arma tu liga', pieza: 'rm-tablero',
    consigna: 'Elige cuántos equipos, si se juega ida y vuelta y cuántos empates hubo. Mira cuántos puntos se reparten.',
    controles: [
      { id: 'n', etiqueta: 'Equipos', min: 3, max: 8, paso: 1, inicio: 4, decimales: 0, color: 'c-i' },
      { id: 'v', etiqueta: 'Vueltas', opciones: [{ valor: 1, texto: 'Una' }, { valor: 2, texto: 'Ida y vuelta' }] },
      { id: 'e', etiqueta: 'Empates', min: 0, max: 20, paso: 1, inicio: 2, decimales: 0, color: 'c-h' },
    ],
    dibujo: val => ({ datos: ligaLibre(val), estado: {} }),
    lectura: val => { const G = partidos(val), e = Math.min(val.e, G); return [plural(G, 'partido', 'partidos'), ', ', plural(e, 'empate', 'empates'), ': ', Pn, ` = ${puntos(val)}`]; },
    invitaciones: [
      { texto: 'Arma una liga que reparta exactamente 50 puntos.',
        logrado: val => puntos(val) === 50,
        bien: 'Hay más de una liga con 50. ¿Cuántos empates pide cada una?' },
      { texto: 'Con 6 equipos a una vuelta, reparte la menor cantidad de puntos posible.',
        logrado: val => val.n === 6 && val.v === 1 && puntos(val) === 2 * partidos(val),
        bien: 'Todos empatados: 2 puntos por partido. Menos no se puede repartir.' },
      { texto: 'Guarda la misma liga sin empates, a una vuelta y a ida y vuelta.',
        logrado: (val, guardados) => guardados.some(p => guardados.some(q => p.n === q.n && p.v === 1 && q.v === 2 && p.e === 0 && q.e === 0)),
        bien: 'Ida y vuelta duplica los partidos y, sin empates, también los puntos.' },
      { texto: 'Guarda dos ligas con distinto número de equipos y los mismos puntos.',
        logrado: (val, guardados) => guardados.some(p => guardados.some(q => p.n !== q.n && puntos(p) === puntos(q))),
        bien: 'Equipos distintos, mismo total: el número de puntos no dice el tamaño.' },
    ],
  };
  // Mesa 3: los casos como puntos del plano. El dato I es la recta x + y = 10; el dato II, otra recta o la misma.
  // Se arrastra el punto (x, y) y se cuentan los casos enteros que cumplen los dos.
  const DATO2 = [
    { valor: 0, texto: 'Sin dato II', ok: () => true },
    { valor: 1, texto: '2x + 2y = 20', ok: (a, b) => 2 * a + 2 * b === 20, de: [0, 10], a: [10, 0] },
    { valor: 2, texto: 'x − y = 2', ok: (a, b) => a - b === 2, de: [2, 0], a: [10, 8] },
    { valor: 3, texto: 'y = 3', ok: (a, b) => b === 3, de: [0, 3], a: [10, 3] },
  ];
  const cumpleAmbos = val => val.x + val.y === 10 && DATO2[val.d2].ok(val.x, val.y);
  const casosDe = d2 => { const xs = []; for (let a = 0; a <= 10; a++) if (DATO2[d2].ok(a, 10 - a)) xs.push(a); return xs; };
  const datosPlano = val => {
    const d2 = DATO2[val.d2], P = (a, b) => [a, 10 - b];   // y matemática hacia arriba
    const lineas = [{ de: P(0, 10), a: P(10, 0), color: 'i', grosor: 'variable', rotulo: 'I', en: P(1, 9.6) }];
    if (d2.de) lineas.push({ de: P(...d2.de), a: P(...d2.a), color: 'o', discontinua: true, rotulo: 'II', en: P(d2.a[0] - 0.6, d2.a[1] + 0.6) });
    const casos = casosDe(val.d2);
    const ok1 = val.x + val.y === 10, ok2 = d2.ok(val.x, val.y);
    return {
      ancho: 10, alto: 10, cuadricula: 1, lineas,
      nodos: casos.map(a => ({ id: `c${a}`, x: a, y: 10 - (10 - a), r: 5, color: 'd', relleno: 0.9 }))
        .concat([{ id: 'p', x: val.x, y: 10 - val.y, r: 8, color: ok1 && ok2 ? 'd' : 'h', relleno: 0.3 }]),
      pie: `${plural(casos.length, 'caso cumple', 'casos cumplen')}: ${casos.length === 1 ? 'basta' : 'no basta'}`,
    };
  };
  const mesaPlano = {
    id: 'casos-en-el-plano', titulo: 'Los casos en el plano', pieza: 'rm-plano',
    consigna: 'Dato I: x + y = 10, con x e y enteros de 0 a 10. Elige el dato II y arrastra el punto. ¿Cuántos casos quedan?',
    controles: [
      { id: 'd2', etiqueta: 'Dato II', opciones: DATO2.map(d => ({ valor: d.valor, texto: d.texto })) },
      { id: 'x', etiqueta: 'x', min: 0, max: 10, paso: 1, inicio: 4, decimales: 0, color: 'c-i' },
      { id: 'y', etiqueta: 'y', min: 0, max: 10, paso: 1, inicio: 6, decimales: 0, color: 'c-o' },
    ],
    dibujo: val => ({ datos: datosPlano(val), estado: {} }),
    lectura: val => {
      const ok1 = val.x + val.y === 10, ok2 = DATO2[val.d2].ok(val.x, val.y);
      return [`(${val.x}, ${val.y}): `, ok1 && ok2 ? 'cumple los datos' : ok1 ? 'cumple I, no II' : 'no cumple I'];
    },
    arrastres: [{ id: 'punto', etiqueta: 'el caso (x, y)', color: 'c-i',
      donde: val => { const g = PLANO().geometria(datosPlano(val)); return { x: g.X(val.x), y: g.Y(10 - val.y) }; },
      mover: (pt, val) => { const g = PLANO().geometria(datosPlano(val)); return { x: (pt.x - g.X(0)) / g.k, y: 10 - (pt.y - g.Y(0)) / g.k }; } }],
    // Retos: los casos los cuenta casosDe, la misma función que pinta los puntos verdes.
    invitaciones: [
      { texto: 'Elige un dato II que deje un solo caso y pon el punto ahí.',
        logrado: val => casosDe(val.d2).length === 1 && cumpleAmbos(val),
        bien: 'Un solo caso compatible: con esos dos datos, x ya se sabe.' },
      { texto: 'Elige un dato II que no quite ningún caso de la recta I.',
        logrado: val => val.d2 !== 0 && casosDe(val.d2).length === casosDe(0).length,
        bien: 'Ese dato es redundante: dice lo mismo que el dato I.' },
      { texto: 'Pon el punto en un caso que cumpla el dato II, pero no el I.',
        logrado: val => val.d2 !== 0 && val.x + val.y !== 10 && DATO2[val.d2].ok(val.x, val.y),
        bien: 'Cumple uno solo: no es caso compatible. Tiene que cumplir los dos.' },
      { texto: 'Guarda dos casos con el mismo dato II que cumplan los dos y den x distinto.',
        logrado: (val, guardados) => guardados.some(p => guardados.some(q => p.d2 === q.d2 && p.x !== q.x && cumpleAmbos(p) && cumpleAmbos(q))),
        bien: 'Dos casos, dos valores de x: con esos datos, x no se puede saber.' },
    ],
  };

  return {
    unidad: 'razonamiento-matematico.tablas-graficos-y-suficiencia',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-plano.js', '/nucleo/kit/piezas/rm-tablero.js'],
    // Laboratorio: barras y piso del eje arrastrables, ligas de una o dos vueltas, y los casos de suficiencia como
    // puntos del plano.
    // Glosario: los términos que esta unidad estrena en el curso (los demás vienen de unidades anteriores).
    glosario: [
      { termino: 'gráfico', formas: ['gráfico', 'gráficos'],
        def: 'Dibujo que muestra datos con barras, líneas o sectores para compararlos de un vistazo.', ver: ['escala', 'eje vertical'] },
      { termino: 'eje vertical',
        def: 'Recta de pie, al costado de un dibujo de datos, donde se leen los valores. No siempre empieza en cero.',
        ver: ['escala'] },
      { termino: 'escala', formas: ['escala', 'escalas'],
        def: 'Regla que dice qué valor corresponde a cada marca de un eje: dónde empieza y cuánto vale cada tramo.',
        ejemplo: 'Eje desde 80: la barra de 90 mide 10 y la de 100 mide 20.', ver: ['eje vertical'] },
      { termino: 'porcentaje', simbolo: '%', formas: ['porcentaje', 'porcentajes'],
        def: 'Cuántas partes de cada 100: compara una cantidad con otra que se toma como el total.',
        ejemplo: '30 de 50 es el 60 %, porque 30 / 50 = 0,6.', ver: ['crecimiento porcentual'] },
      { termino: 'crecimiento porcentual', formas: ['crecimiento porcentual', 'crecimiento en porcentaje'],
        def: 'Cuánto aumentó algo comparado con lo que había al inicio, contado de cada 100.',
        ejemplo: 'De 50 a 80: sube 30 sobre 50, un 60 %.', ver: ['porcentaje'] },
      { termino: 'todos contra todos',
        def: 'Forma de jugar una liga en que cada equipo enfrenta una vez a cada uno de los demás.',
        ejemplo: '4 equipos: 4 · 3 / 2 = 6 partidos.', ver: ['ida y vuelta'] },
      { termino: 'ida y vuelta',
        def: 'Cada pareja de equipos de la liga juega dos veces, una en la cancha de cada uno.',
        ejemplo: '4 equipos: 2 · 6 = 12 partidos.', ver: ['todos contra todos'] },
      { termino: 'empate', formas: ['empate', 'empates', 'empatar', 'empatados', 'empatan', 'empata'],
        def: 'Partido que termina sin ganador; en el sistema de 3, 1 y 0 puntos, da 1 a cada equipo.',
        ejemplo: 'Un partido así reparte 2 puntos; uno con ganador, 3.' },
      { termino: 'suficiencia de datos',
        def: 'Decidir si la información dada alcanza para hallar un solo valor de lo que se pide.',
        ver: ['caso compatible', 'dato redundante'] },
      { termino: 'caso compatible', formas: ['caso compatible', 'casos compatibles'],
        def: 'Valores que cumplen todos los datos dados. Puede no haber ninguno, haber uno o haber muchos.',
        ejemplo: 'Con x + y = 10, (4, 6) y (7, 3) lo son.', ver: ['suficiencia de datos'] },
      { termino: 'dato redundante', formas: ['dato redundante', 'redundante'],
        def: 'Información que no agrega nada nuevo, porque se deduce de otra que ya se tenía.',
        ejemplo: '2x + 2y = 20 repite x + y = 10: basta dividir entre 2.', ver: ['suficiencia de datos'] },
    ],
    laboratorio: [mesaEje, mesaLiga, mesaPlano],
    historia: {
      texto: 'En la década de 1850, Florence Nightingale usó tablas y diagramas para argumentar sobre la mortalidad y las condiciones sanitarias. El historiador Hugh Small mostró también cómo se corrigió la forma de representar esos datos. Un gráfico es una decisión: hay que leer su escala antes de creerle a la altura.',
      pregunta: '¿Puede un gráfico decir la verdad y aun así engañar?',
      fuente: { titulo: 'Florence Nightingale’s Statistical Diagrams · Hugh Small, University of York', url: 'https://www.york.ac.uk/depts/maths/histstat/small.htm' },
    },
    ideas: [leer, deportes, suficiencia],
  };
});
