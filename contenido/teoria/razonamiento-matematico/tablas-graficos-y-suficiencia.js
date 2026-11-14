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
  const leer = {
    id: 'leer-con-escala',
    titulo: 'La altura depende del eje',
    temas: ['Lectura de tablas y gráficos'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Una tienda vendió 90 cajas en marzo y 100 en abril. Cambia dónde empieza el eje vertical y compara las barras.',
      voz: 'Los datos no cambian; solo cambia el dibujo.',
      controles: [{ id: 'b', etiqueta: 'El eje empieza en', opciones: [0, 50, 80, 85].map(v => ({ valor: v, texto: String(v) })) }],
      dibujo: val => ({ datos: grafico([{ v: 90, color: 'i', rotulo: 'Marzo' }, { v: 100, color: 'o', rotulo: 'Abril' }], val.b, 100), estado: {} }),
      lectura: val => [`Aumento real: 11 % · la barra se ve ${f((100 - val.b) / (90 - val.b), 1)} veces`],
      minimo: 3,
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
      ecuacion: ['crecimiento % = ', { frac: ['después − antes', 'antes'] }, ' · 100'],
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
      ecuacion: [Pn, ' = 3 · ', { frac: ['n(n − 1)', '2'] }, ' − ', E],
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
      coincide: 'Coincide: (4, 6) y (7, 3) cumplen los dos datos y dan x distinto.',
    },
    mira: {
      datos: casos([[4, 6, false], [7, 3, false], [6, 4, true]], { columna: 'x − y = 2', nota: 'Los tres cumplen x + y = 10' }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Con x + y = 10, hay casos que dan x distinto: no basta.' },
        { estado: { corte: 0 }, texto: 'Si en cambio se sabe x − y = 2, solo (6, 4) cumple los dos.', ecuacion: [x, ' + ', y, ' = 10 y ', x, ' − ', y, ' = 2'] },
        { estado: { corte: 0 }, texto: 'Un solo valor de x: ahí los datos sí bastan.', ecuacion: [x, ' = 6'] },
      ],
    },
    regla: {
      texto: 'Los datos bastan si existe al menos un caso que los cumple y todos los casos que los cumplen dan el mismo valor de lo pedido.',
      ecuacion: ['bastan ⇔ casos ≠ ∅ y lo pedido tiene un solo valor'],
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

  return {
    unidad: 'razonamiento-matematico.tablas-graficos-y-suficiencia',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-plano.js', '/nucleo/kit/piezas/rm-tablero.js'],
    historia: {
      texto: 'En la década de 1850, Florence Nightingale usó tablas y diagramas para argumentar sobre la mortalidad y las condiciones sanitarias. El historiador Hugh Small mostró también cómo se corrigió la forma de representar esos datos. Un gráfico es una decisión: hay que leer su escala antes de creerle a la altura.',
      pregunta: '¿Puede un gráfico decir la verdad y aun así engañar?',
      fuente: { titulo: 'Florence Nightingale’s Statistical Diagrams · Hugh Small, University of York', url: 'https://www.york.ac.uk/depts/maths/histstat/small.htm' },
    },
    ideas: [leer, deportes, suficiencia],
  };
});
