/*
 * Teoría de «Estadística descriptiva» (aritmetica.estadistica). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 8) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR14 y AR15 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 * Convención de cuartiles (la app la declara): posición k(n + 1)/4 en los datos ordenados, interpolando si cae entre dos.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: organizar datos, elegir el resumen que corresponde y saber qué se pierde al reducirlos a un número.
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de gama baja de 360 px, en el aula o en la combi, sin audio.
 *   Resultado observable: arma tablas de frecuencias, lee gráficos y calcula media, mediana, moda, cuartiles, varianza y CV.
 *   Orden de atención: 1.º los datos en la recta o la tabla · 2.º el resumen que se mueve (o no) · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · predicción elegida · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué la mediana casi no se mueve cuando aparece un dato muy grande?».
 * Colores (regla 4): los datos x naranja (c-o), las frecuencias f turquesa (c-i), la media verde (c-d), la mediana y los
 * cuartiles rojo (c-h).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const fm = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-o', t: 'x' }, fr = { v: 'c-i', t: 'f' }, xb = { v: 'c-d', t: 'x̄' }, Me = { v: 'c-h', t: 'Me' };
  const h = { v: 'c-i', t: 'h' }, Fa = { v: 'c-i', t: 'F' }, w = { v: 'c-i', t: 'w' };
  const sub = (b, i) => ({ sub: [b, i] });
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || (typeof d.valor === 'number' && !Number.isFinite(d.valor))) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const suma = xs => xs.reduce((a, b) => a + b, 0);
  const media = xs => suma(xs) / xs.length;
  const ordenar = xs => xs.slice().sort((a, b) => a - b);
  const mediana = xs => { const o = ordenar(xs), n = o.length; return n % 2 ? o[(n - 1) / 2] : (o[n / 2 - 1] + o[n / 2]) / 2; };
  // Cuartil k con la convención de la unidad: posición k(n + 1)/4, interpolando entre vecinos.
  const cuartil = (xs, k) => { const o = ordenar(xs), pos = k * (o.length + 1) / 4, i = Math.floor(pos); if (i < 1) return o[0]; if (i >= o.length) return o[o.length - 1]; return o[i - 1] + (pos - i) * (o[i] - o[i - 1]); };
  const varianza = (xs, muestral) => { const m = media(xs); return suma(xs.map(v => (v - m) ** 2)) / (xs.length - (muestral ? 1 : 0)); };
  // Datos sobre la recta: los repetidos se apilan en filas (se ve la moda sin contar).
  function puntos(xs, color = 'o', fila0 = 0) {
    const vistos = {};
    return xs.map(v => { const k = vistos[v] = (vistos[v] || 0) + 1; return { tipo: 'punto', x: v, color, fila: fila0 + k - 1 }; });
  }

  // ---------- Idea 1: población, muestra, variable y tabla de frecuencias ----------
  // Cambia: cuántos alumnos de la muestra tienen 2 hermanos. Permanece: las otras filas y las columnas x, f, h, F.
  // Progresa: f → h = f/n → F acumulada. Se reserva: «a lo más 2», que se lee en F, no en f.
  // Debe verse: la columna h siempre suma 1 y la última F es n.
  const tablaHermanos = (fs, o = {}) => {
    const n = suma(fs);
    let acum = 0;
    const filas = fs.map((fi, k) => { acum += fi; return [String(k), { t: fm(fi), color: 'i' }, { t: fm(fi / n, 3), paso: o.pasoH || 0 }, { t: fm(acum), paso: o.pasoF || 0, resalta: o.resalta === k, color: 'i' }]; });
    filas.push([{ t: 'total' }, { t: fm(n), color: 'i' }, { t: '1', paso: o.pasoH || 0 }, '']);
    return { columnas: [{ t: 'x hermanos', color: 'o' }, { t: 'f', color: 'i' }, { t: 'h = f/n' }, { t: 'F' }], filas, cabeza: true, filasMax: fs.length + 1 };
  };
  const tabla = {
    id: 'tabla-frecuencias',
    titulo: 'Contar, dividir, acumular',
    temas: ['Población, muestra y variables', 'Tablas de frecuencias'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Se preguntó a una muestra de alumnos de un colegio cuántos hermanos tienen. Cambia cuántos dijeron 2 y mira las columnas.',
      voz: 'Mira qué columnas cambian y cuál siempre suma 1.',
      controles: [{ id: 'f2', etiqueta: 'f de x = 2', color: 'c-i', min: 1, max: 9, paso: 1, inicio: 5, decimales: 0 }],
      dibujo: v => ({ datos: tablaHermanos([3, 6, v.f2, 4, 2], { pasoF: 9 }), estado: {} }),
      lectura: v => [`n = ${fm(15 + v.f2)} · h de 2 = ${fm(v.f2 / (15 + v.f2), 3)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En la tabla de 20 alumnos, ¿cuántos tienen a lo más 2 hermanos?',
      opciones: [
        { id: 'c', texto: '14 alumnos', correcta: true },
        { id: 'f', texto: '5 alumnos', error: 'AT-F-ACUMULADA', siFuera: '5 son los que tienen exactamente 2. «A lo más 2» incluye 0, 1 y 2.' },
        { id: 'resto', texto: '6 alumnos', error: 'AT-COMPLEMENTO', siFuera: '6 son los que tienen más de 2.' },
        { id: 'h', texto: '0,25', error: 'AT-RELATIVA', siFuera: '0,25 es la frecuencia relativa de x = 2, no un número de alumnos.' },
      ],
      dibujo: { datos: tablaHermanos([3, 6, 5, 4, 2], { pasoF: 9 }), estado: {} },
      revelar: { datos: tablaHermanos([3, 6, 5, 4, 2], { resalta: 2 }), estado: { fila: [0, 1, 2] } },
      coincide: 'Coincide: 3 + 6 + 5 = 14; es la F de la fila x = 2.',
    },
    mira: {
      datos: tablaHermanos([3, 6, 5, 4, 2], { pasoH: 2, pasoF: 3, resalta: 2 }),
      pasos: [
        { estado: { paso: 1, columna: 1 }, texto: 'f cuenta cuántos datos hay de cada valor; suman n = 20.', ecuacion: ['Σ', fr, ' = n = 20'] },
        { estado: { paso: 2, columna: 2 }, texto: 'h divide cada f entre n; las h suman 1.', ecuacion: [h, ' = ', { frac: [fr, 'n'] }, ' = ', { frac: ['5', '20'] }, ' = 0,25'] },
        { estado: { paso: 3, columna: 3 }, texto: 'F va sumando: a lo más 2 hermanos son 14.', ecuacion: [Fa, ' = 3 + 6 + 5 = 14'] },
      ],
    },
    regla: {
      texto: 'La población es todo el grupo que interesa; la muestra, la parte que se observa. La tabla cuenta f, divide h = f/n y acumula F.',
      ecuacion: ['Σ', fr, ' = n   ·   ', h, ' = ', { frac: [fr, 'n'] }, '   ·   Σ', h, ' = 1'],
      condicion: 'la variable es cualitativa (colores) o cuantitativa: discreta (se cuenta) o continua (se mide). F pide valores ordenables.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 2) {
          const casos = [
            ['el color favorito de cada alumno', 'Cualitativa'], ['la estatura de cada alumno, en cm', 'Cuantitativa continua'],
            ['el número de mascotas de cada familia', 'Cuantitativa discreta'], ['la marca de celular de cada alumno', 'Cualitativa'],
            ['el tiempo que tarda cada alumno en llegar', 'Cuantitativa continua'], ['la cantidad de cursos aprobados', 'Cuantitativa discreta'],
          ];
          const [que, bien] = casos[r.ent(0, casos.length - 1)];
          const todas = ['Cualitativa', 'Cuantitativa discreta', 'Cuantitativa continua'];
          const ops = [{ id: 'c', texto: bien, correcta: true }];
          for (const t of todas) if (t !== bien) ops.push({ id: t.slice(-6), texto: t, error: 'AT-TIPO-VARIABLE', siFuera: t === 'Cualitativa' ? 'Sería cierto si la respuesta fuera una cualidad, no un número.' : t.endsWith('discreta') ? 'Sería cierto si se contara; aquí se mide o es una cualidad.' : 'Sería cierto si se midiera con decimales; aquí se cuenta o es una cualidad.' });
          ops.push({ id: 'muestra', texto: 'Es una muestra', error: 'AT-MUESTRA-VARIABLE', siFuera: 'La muestra son las personas observadas; aquí se pregunta qué se anota de cada una.' });
          return { pregunta: `En una encuesta a 30 alumnos se anota ${que}. ¿Qué tipo de variable es?`, opciones: ops, solucion: { texto: bien === 'Cualitativa' ? 'Se anota una cualidad.' : bien.endsWith('discreta') ? 'Se cuenta: toma valores enteros.' : 'Se mide: puede tomar cualquier valor.' } };
        }
        const fs = [r.ent(1, 6), r.ent(2, 8), r.ent(2, 8), r.ent(1, 6), r.ent(1, 4)], n = suma(fs), k = r.ent(1, 3);
        const F = suma(fs.slice(0, k + 1));
        const pideF = tipo === 0;
        return {
          pregunta: pideF ? `En la tabla, ¿cuántos alumnos tienen a lo más ${k} hermanos?` : `En la tabla, ¿qué frecuencia relativa tiene x = ${k}?`,
          dibujo: { datos: tablaHermanos(fs, { pasoH: 9, pasoF: 9 }), estado: {} },
          opciones: pideF
            ? opciones(F, [
              { id: 'f', valor: fs[k], error: 'AT-F-ACUMULADA', siFuera: `Esos son los que tienen exactamente ${k}.` },
              { id: 'resto', valor: n - F, error: 'AT-COMPLEMENTO', siFuera: `Esos son los que tienen más de ${k}.` },
              { id: 'antes', valor: F - fs[k], error: 'AT-ESTRICTO', siFuera: `Eso es «menos de ${k}»; «a lo más» incluye a ${k}.` },
            ], v => `${fm(v)} alumnos`)
            : opciones(fs[k] / n, [
              { id: 'f', valor: fs[k], error: 'AT-RELATIVA', siFuera: 'Esa es la frecuencia absoluta f.' },
              { id: 'pct', valor: fs[k] / 100, error: 'AT-CIEN', siFuera: 'Eso divide entre 100; se divide entre n.' },
              { id: 'F', valor: F / n, error: 'AT-F-ACUMULADA', siFuera: 'Esa es la relativa acumulada.' },
            ], v => fm(v, 3)),
          solucion: {
            texto: pideF ? `Se suman las f hasta x = ${k}.` : 'f entre n.',
            ecuacion: pideF ? [Fa, ` = ${fs.slice(0, k + 1).join(' + ')} = ${F}`] : [h, ` = ${fs[k]} ÷ ${n} = ${fm(fs[k] / n, 3)}`],
            dibujo: { datos: tablaHermanos(fs, { resalta: pideF ? k : undefined }), estado: { fila: k } },
          },
        };
      },
    },
  };

  // ---------- Idea 2: gráficos: barras con la misma base y sectores en grados ----------
  // Cambia: la frecuencia de una categoría. Permanece: el eje de las barras desde 0.
  // Progresa: f → h → ángulo del sector. Se reserva: el ángulo, que es parte de 360°, no de 100.
  // Debe verse: la barra mide f; el rótulo dice la porción en grados.
  const barras = (fs, nombres, o = {}) => {
    const n = suma(fs), top = Math.max(...fs);
    return {
      x: { min: 0, max: fs.length + 1, paso: 1, nombre: o.xnombre || 'categoría', decimales: 0, color: 'o' },
      y: { min: 0, max: Math.ceil((top + 1) / 2) * 2, paso: 2, nombre: 'f', decimales: 0, color: 'i' },
      areas: fs.map((fi, k) => ({ puntos: [[k + 0.65, fi], [k + 1.35, fi]], color: k === o.marca ? 'h' : 'i', rotulo: o.grados ? `${fm(360 * fi / n, 1)}°` : o.conF ? fm(fi) : undefined, desde: o.grados ? (o.desde || 0) : 0 })),
      alt: `Barras de ${nombres.map((t, k) => `${t}: ${fs[k]}`).join(', ')}`,
      compacto: true,
    };
  };
  const NOMBRES = ['combi', 'a pie', 'bici', 'mototaxi'];
  const graficos = {
    id: 'graficos',
    titulo: 'Barras y sectores',
    temas: ['Gráficos estadísticos'],
    pieza: 'ejes',
    juega: {
      consigna: 'Cómo llegan los alumnos: combi, a pie, bici o mototaxi (barras 1 a 4). Cambia cuántos van en combi y compara las barras.',
      voz: 'Cada barra empieza en 0: su altura es la frecuencia.',
      controles: [{ id: 'c', etiqueta: 'f de combi', color: 'c-i', min: 2, max: 12, paso: 2, inicio: 8, decimales: 0 }],
      dibujo: v => ({ datos: barras([v.c, 5, 3, 4], NOMBRES, { conF: true, marca: 0 }), estado: {} }),
      lectura: v => [`combi: ${fm(v.c)} de ${fm(v.c + 12)} → `, h, ` = ${fm(v.c / (v.c + 12), 3)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'De 20 alumnos, 5 llegan a pie. En un gráfico de sectores, ¿qué ángulo le toca a «a pie»?',
      opciones: [
        { id: 'c', texto: '90°', correcta: true },
        { id: 'pct', texto: '25°', error: 'AT-GRADOS-PORCENTAJE', siFuera: '25 es el porcentaje. El círculo completo tiene 360°, no 100.' },
        { id: 'f', texto: '5°', error: 'AT-RELATIVA', siFuera: '5 es la frecuencia; el ángulo es su parte de 360°.' },
        { id: 'resto', texto: '270°', error: 'AT-COMPLEMENTO', siFuera: '270° es lo que les toca a los otros 15.' },
      ],
      dibujo: { datos: barras([8, 5, 3, 4], NOMBRES, { marca: 1 }), estado: {} },
      revelar: { datos: barras([8, 5, 3, 4], NOMBRES, { grados: true, marca: 1 }), estado: {} },
      coincide: 'Coincide: 5 de 20 es la cuarta parte, y la cuarta parte de 360° es 90°.',
    },
    mira: {
      datos: barras([8, 5, 3, 4], NOMBRES, { grados: true, marca: 1, desde: 3 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Las barras miden la frecuencia desde 0: a pie son 5.', ecuacion: [fr, ' = 5'] },
        { estado: { corte: 2 }, texto: 'En el total de 20, eso es la cuarta parte.', ecuacion: [h, ' = ', { frac: ['5', '20'] }, ' = 0,25'] },
        { estado: { corte: 3 }, texto: 'El sector toma esa parte de los 360° del círculo.', ecuacion: ['0,25 · 360° = 90°'] },
      ],
    },
    regla: {
      texto: 'Barras para categorías o valores contados, con el eje desde 0; histograma, barras pegadas para datos medidos en intervalos; sectores, partes de un todo.',
      ecuacion: ['ángulo = ', h, ' · 360° = ', { frac: [fr, 'n'] }, ' · 360°'],
      condicion: 'un eje que no empieza en 0 exagera las diferencias. Los sectores solo sirven si las partes forman un todo.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.de([20, 24, 30, 36, 40, 60]), fs = [0, 0, 0, 0];
        const div = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12].filter(d => (360 * d) % n === 0 && d < n / 2);
        fs[1] = r.de(div); fs[2] = r.ent(1, Math.floor((n - fs[1]) / 3)); fs[3] = r.ent(1, Math.floor((n - fs[1] - fs[2]) / 2)); fs[0] = n - fs[1] - fs[2] - fs[3];
        const ang = 360 * fs[1] / n;
        return {
          pregunta: `De ${n} alumnos, ${fs[1]} llegan a pie. En un gráfico de sectores, ¿qué ángulo le toca a «a pie»?`,
          dibujo: { datos: barras(fs, NOMBRES, { marca: 1 }), estado: {} },
          opciones: opciones(ang, [
            { id: 'pct', valor: 100 * fs[1] / n, error: 'AT-GRADOS-PORCENTAJE', siFuera: 'Ese es el porcentaje; el círculo tiene 360°.' },
            { id: 'f', valor: fs[1], error: 'AT-RELATIVA', siFuera: 'Esa es la frecuencia.' },
            { id: 'resto', valor: 360 - ang, error: 'AT-COMPLEMENTO', siFuera: 'Ese es el ángulo de los demás.' },
          ], v => `${fm(v)}°`),
          solucion: { texto: 'Su parte del total, por 360°.', ecuacion: [{ frac: [String(fs[1]), String(n)] }, ` · 360° = ${fm(ang)}°`], dibujo: { datos: barras(fs, NOMBRES, { grados: true, marca: 1 }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: media, mediana y moda ante un dato extremo ----------
  // Cambia: el último dato. Permanece: los otros cuatro datos, ordenados en la recta.
  // Progresa: la media se va tras el dato extremo; la mediana se queda. Se reserva: la moda, que se ve en la pila.
  // Debe verse: el punto verde se mueve mucho; el rojo, nada.
  const rectaCentrales = (xs, o = {}) => {
    const m = media(xs), me = mediana(xs), max = o.max || Math.max(10, Math.ceil((Math.max(...xs) + 2) / 5) * 5);
    const el = puntos(xs, 'o', 2);
    if (!o.sinMedia) el.push({ tipo: 'punto', x: m, color: 'd', rotulo: `x̄ = ${fm(m)}`, fila: 1, desde: o.dMedia || 0 });
    if (!o.sinMediana) el.push({ tipo: 'punto', x: me, color: 'h', rotulo: `Me = ${fm(me)}`, fila: 0, desde: o.dMediana || 0 });
    return { min: 0, max, paso: 1, cada: 5, decimales: 2, filas: 4, variable: 'x', color: 'o', elementos: el };
  };
  const centrales = {
    id: 'centrales',
    titulo: 'Media, mediana y moda',
    temas: ['Media, mediana y moda'],
    pieza: 'recta',
    juega: {
      consigna: 'Cinco datos: 2, 4, 4, 9 y uno que tú eliges. Muévelo lejos y mira qué pasa con la media y con la mediana.',
      voz: 'Lleva el último dato hasta el extremo derecho.',
      controles: [{ id: 'u', etiqueta: 'Último dato', color: 'c-o', min: 1, max: 30, paso: 1, inicio: 6, decimales: 0 }],
      dibujo: v => ({ datos: rectaCentrales([2, 4, 4, 9, v.u], { max: 30 }), estado: {} }),
      lectura: v => [xb, ` = ${fm(media([2, 4, 4, 9, v.u]))} · `, Me, ` = ${fm(mediana([2, 4, 4, 9, v.u]))} · moda 4`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Los datos son 2, 4 y 9. Si el 9 se cambia por 90, ¿qué pasa con la mediana?',
      opciones: [
        { id: 'c', texto: 'Sigue siendo 4', correcta: true },
        { id: 'media', texto: 'Sube a 32, como la media', error: 'AT-MEDIANA-MEDIA', siFuera: 'La media sí sube a 32. La mediana es el dato del medio, y sigue siendo 4.' },
        { id: 'medio', texto: 'Pasa a 47', error: 'AT-MEDIANA-RANGO', siFuera: '47 es el punto medio entre 4 y 90; la mediana es el dato del medio.' },
        { id: 'noto', texto: 'Pasa a 90', error: 'AT-MEDIANA-ORDEN', siFuera: 'Eso toma el último dato; la mediana necesita ordenar y elegir el central.' },
      ],
      dibujo: { datos: Object.assign(rectaCentrales([2, 4, 90], { sinMedia: true, sinMediana: true }), { max: 90, cada: 2, paso: 5 }), estado: {} },
      revelar: { datos: Object.assign(rectaCentrales([2, 4, 90]), { max: 90, cada: 2, paso: 5 }), estado: {} },
      coincide: 'Coincide: ordenados, 2, 4, 90; el del medio sigue siendo 4.',
    },
    mira: {
      datos: Object.assign(rectaCentrales([2, 4, 90], { dMedia: 1, dMediana: 2 }), { max: 90, cada: 2, paso: 5 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'La media reparte la suma en partes iguales: el 90 la arrastra.', ecuacion: [xb, ' = ', { frac: ['2 + 4 + 90', '3'] }, ' = 32'] },
        { estado: { corte: 2 }, texto: 'La mediana ordena y toma el del medio: 4.', ecuacion: ['2, ', Me, ' = 4, 90'] },
        { estado: { corte: 2 }, texto: 'La moda es el valor que más se repite; aquí no hay.', ecuacion: ['moda: el de mayor ', fr] },
      ],
    },
    regla: {
      texto: 'La media es la suma entre n y se deja arrastrar por un dato extremo. La mediana es el dato central ordenado. La moda, el más frecuente.',
      ecuacion: [xb, ' = ', { frac: [['Σ', x], 'n'] }, '   ·   ', Me, ': el central (o el promedio de los dos centrales)'],
      condicion: 'para la mediana primero se ordena; con n par, se promedian los dos del medio. Puede haber varias modas o ninguna.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.de([5, 6, 7]);
        const xs = Array.from({ length: n }, () => r.ent(1, 15));
        xs[r.ent(0, n - 1)] = xs[0];               // al menos una repetición
        const pide = ['media', 'mediana', 'moda'][s % 3];
        const cuenta = {}; xs.forEach(v => { cuenta[v] = (cuenta[v] || 0) + 1; });
        const maxc = Math.max(...Object.values(cuenta)), modas = Object.keys(cuenta).filter(k => cuenta[k] === maxc).map(Number);
        if (pide === 'moda' && modas.length > 1) return this.generar(s + 600);
        const m = media(xs), me = mediana(xs), mo = modas[0];
        const valor = { media: m, mediana: me, moda: mo }[pide];
        const sinOrden = xs[Math.floor((n - 1) / 2)];
        return {
          pregunta: `Para los datos ${xs.join(', ')}, ¿cuál es la ${pide}?`,
          dibujo: { datos: rectaCentrales(xs, { sinMedia: true, sinMediana: true }), estado: {} },
          opciones: opciones(valor, [
            { id: 'otra1', valor: pide === 'media' ? me : m, error: 'AT-MEDIANA-MEDIA', siFuera: pide === 'media' ? 'Esa es la mediana.' : 'Esa es la media.' },
            { id: 'otra2', valor: pide === 'moda' ? me : mo, error: 'AT-MODA', siFuera: pide === 'moda' ? 'Esa es la mediana.' : 'Esa es la moda.' },
            { id: 'sin-orden', valor: sinOrden, error: 'AT-MEDIANA-ORDEN', siFuera: 'Ese es el del medio sin ordenar.' },
            { id: 'suma', valor: suma(xs), error: 'AT-SUMA', siFuera: 'Esa es la suma; falta dividir entre n.' },
          ], v => fm(v)),
          solucion: {
            texto: pide === 'media' ? 'La suma entre n.' : pide === 'mediana' ? 'Se ordena y se toma el central.' : 'El valor que más se repite.',
            ecuacion: pide === 'media' ? [xb, ` = ${fm(suma(xs))} ÷ ${n} = ${fm(m)}`] : pide === 'mediana' ? [`${ordenar(xs).join(', ')} → `, Me, ` = ${fm(me)}`] : [`moda = ${mo} (${maxc} veces)`],
            dibujo: { datos: rectaCentrales(xs), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 4: media ponderada, geométrica y armónica ----------
  // Cambia: los créditos de cada curso. Permanece: las notas 12 y 18.
  // Progresa: el punto ponderado se corre al curso con más créditos. Se reserva: el crecimiento, donde manda la geométrica.
  // Debe verse: la ponderada no es el promedio de las notas.
  const rectaNotas = (notas, pesos, o = {}) => {
    const p = suma(notas.map((n, k) => n * pesos[k])) / suma(pesos);
    const el = notas.map((n, k) => ({ tipo: 'punto', x: n, color: 'o', rotulo: `${fm(pesos[k])} cr.`, fila: 1 }));
    if (!o.sin) el.push({ tipo: 'punto', x: p, color: 'd', rotulo: `${fm(p)}`, fila: 0 });
    return { min: 8, max: 20, paso: 1, cada: 2, decimales: 2, filas: 1, variable: 'nota', color: 'o', elementos: el };
  };
  const ponderada = {
    id: 'ponderada',
    titulo: 'Cuando cada dato pesa distinto',
    temas: ['Medias ponderada, geométrica y armónica'],
    pieza: 'recta',
    juega: {
      consigna: 'Un alumno sacó 12 en un curso y 18 en otro. Cambia los créditos de cada curso y mira su promedio ponderado.',
      voz: 'Compara el punto verde con el punto medio 15.',
      controles: [
        { id: 'a', etiqueta: 'Créditos del 12', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'Créditos del 18', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: rectaNotas([12, 18], [v.a, v.b]), estado: {} }),
      lectura: v => [`Ponderado ${fm((12 * v.a + 18 * v.b) / (v.a + v.b))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un precio sube 10 % el primer año y 50 % el segundo. ¿Qué aumento anual igual, repetido dos años, da el mismo precio final?',
      opciones: [
        { id: 'c', texto: '28,45 % cada año', correcta: true },
        { id: 'aritmetica', texto: '30 % cada año', error: 'AT-MEDIA-FACTORES', siFuera: '30 % sería cierto si los aumentos se sumaran. Se multiplican: 1,3 · 1,3 da 1,69, no 1,65.' },
        { id: 'suma', texto: '60 % cada año', error: 'AT-SUMA', siFuera: '60 % es la suma de los dos aumentos, no uno que se repite.' },
        { id: 'total', texto: '65 % cada año', error: 'AT-TOTAL', siFuera: '65 % es el aumento total de los dos años.' },
      ],
      dibujo: { datos: { min: 1, max: 1.7, paso: 0.05, cada: 2, decimales: 2, filas: 1, variable: 'factor', color: 'o', elementos: [{ tipo: 'punto', x: 1.1, color: 'o', rotulo: '1,1', fila: 1 }, { tipo: 'punto', x: 1.5, color: 'o', rotulo: '1,5', fila: 1 }] }, estado: {} },
      revelar: { datos: { min: 1, max: 1.7, paso: 0.05, cada: 2, decimales: 2, filas: 1, variable: 'factor', color: 'o', elementos: [{ tipo: 'punto', x: 1.1, color: 'o', rotulo: '1,1', fila: 1 }, { tipo: 'punto', x: 1.5, color: 'o', rotulo: '1,5', fila: 1 }, { tipo: 'punto', x: Math.sqrt(1.65), color: 'd', rotulo: `G = ${fm(Math.sqrt(1.65), 4)}`, fila: 0 }] }, estado: { fantasma: { marca: 1.3, rotulo: 'aritmética' } } },
      coincide: 'Coincide: 1,2845 · 1,2845 = 1,65, igual que 1,1 · 1,5.',
    },
    mira: {
      datos: rectaNotas([12, 18], [1, 3]),
      pasos: [
        { estado: {}, texto: 'Media ponderada: cada nota pesa sus créditos.', ecuacion: [{ frac: ['12 · 1 + 18 · 3', '1 + 3'] }, ' = 16,5'] },
        { estado: {}, texto: 'Geométrica: para factores que se multiplican, como aumentos sucesivos.', ecuacion: ['G = ', { raiz: '1,1 · 1,5' }, ' = 1,2845'] },
        { estado: {}, texto: 'Armónica: para rapideces en tramos de igual distancia.', ecuacion: ['H = ', { frac: ['2 · 60 · 40', '60 + 40'] }, ' = 48'] },
      ],
    },
    regla: {
      texto: 'La media ponderada multiplica cada dato por su peso y divide entre la suma de pesos. La geométrica promedia factores; la armónica, rapideces con la misma distancia.',
      ecuacion: [sub(xb, 'p'), ' = ', { frac: [['Σ', w, x], ['Σ', w]] }, '   ·   G = ', { raiz: [sub(x, '1'), '·…·', sub(x, 'n')], indice: 'n' }],
      condicion: 'los pesos son positivos y dicen cuánto cuenta cada dato. La geométrica pide datos positivos.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const [a, b] = r.de([[1.2, 1.8], [1.1, 1.6], [0.9, 1.6], [1.25, 1.8], [2, 1.125]]), G = Math.sqrt(a * b);
          return {
            pregunta: `Una población se multiplica por ${fm(a)} el primer año y por ${fm(b)} el segundo. ¿Qué factor anual igual, repetido dos años, da lo mismo?`,
            opciones: opciones(G, [
              { id: 'arit', valor: (a + b) / 2, error: 'AT-MEDIA-FACTORES', siFuera: 'Ese es el promedio simple; los factores se multiplican.' },
              { id: 'producto', valor: a * b, error: 'AT-TOTAL', siFuera: 'Ese es el factor de los dos años juntos.' },
              { id: 'arm', valor: 2 * a * b / (a + b), error: 'AT-MEDIA', siFuera: 'Esa es la armónica; para factores va la geométrica.' },
            ], v => fm(v, 4)),
            solucion: { texto: 'La geométrica: raíz del producto.', ecuacion: ['G = ', { raiz: `${fm(a)} · ${fm(b)}` }, ` = ${fm(G, 4)}`] },
          };
        }
        const notas = [r.ent(8, 13), r.ent(12, 16), r.ent(15, 20)], pesos = [r.ent(1, 5), r.ent(1, 5), r.ent(1, 5)];
        if (pesos[0] === pesos[1] && pesos[1] === pesos[2]) pesos[2] += 1;
        const p = suma(notas.map((n, k) => n * pesos[k])) / suma(pesos);
        return {
          pregunta: `Notas ${notas.join(', ')} en cursos de ${pesos.join(', ')} créditos, en ese orden. ¿Cuál es el promedio ponderado?`,
          opciones: opciones(p, [
            { id: 'simple', valor: media(notas), error: 'AR15', siFuera: 'Ese es el promedio simple; los créditos pesan.' },
            { id: 'sin-dividir', valor: suma(notas.map((n, k) => n * pesos[k])), error: 'AT-SUMA', siFuera: 'Falta dividir entre la suma de créditos.' },
            { id: 'entre-n', valor: suma(notas.map((n, k) => n * pesos[k])) / notas.length, error: 'AT-PARTES', siFuera: 'Se divide entre los créditos, no entre 3.' },
          ], v => fm(v)),
          solucion: { texto: 'Cada nota por sus créditos, entre los créditos.', ecuacion: [{ frac: [notas.map((n, k) => `${n} · ${pesos[k]}`).join(' + '), pesos.join(' + ')] }, ` = ${fm(p)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: cuartiles y percentiles ----------
  // Cambia: cuántos datos hay. Permanece: la convención de posición k(n + 1)/4.
  // Progresa: Q2 al centro, Q1 y Q3 en los centros de cada mitad. Se reserva: la posición que cae entre dos datos.
  // Debe verse: entre cuartiles queda la cuarta parte de los datos.
  const BASE = [3, 5, 6, 8, 10, 12, 15, 16, 18, 21, 25];
  const rectaCuartiles = (xs, o = {}) => {
    const q = [1, 2, 3].map(k => cuartil(xs, k));
    const el = puntos(ordenar(xs), 'o', 1);
    q.forEach((v, k) => { if (!o.sin) el.push({ tipo: 'punto', x: v, color: 'h', rotulo: `Q${k + 1} = ${fm(v)}`, fila: k === 1 ? 3 : 2, desde: o.desde ? k + 1 : 0 }); });
    if (!o.sin && !o.sinCaja) el.push({ tipo: 'intervalo', a: q[0], b: q[2], ca: true, cb: true, color: 'h', fila: 4, desde: o.desde ? 3 : 0, rotulo: 'la mitad central' });
    return { min: 0, max: 26, paso: 1, cada: 5, decimales: 2, filas: 4, variable: 'x', color: 'o', elementos: el };
  };
  const cuartiles = {
    id: 'cuartiles',
    titulo: 'Cortar los datos en cuartos',
    temas: ['Cuartiles y percentiles'],
    pieza: 'recta',
    juega: {
      consigna: 'Elige cuántos datos se toman de la lista. Mira dónde caen los tres cuartiles: cortan los datos ordenados en cuatro partes.',
      voz: 'Cuenta cuántos datos quedan entre dos cuartiles.',
      controles: [{ id: 'n', etiqueta: 'n datos', color: 'c-o', min: 5, max: 11, paso: 1, inicio: 7, decimales: 0 }],
      dibujo: v => ({ datos: rectaCuartiles(BASE.slice(0, v.n)), estado: {} }),
      lectura: v => [`Posición de Q1: (n + 1)/4 = ${fm((v.n + 1) / 4)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Con la convención de esta unidad, Q1 está en la posición (n + 1)/4. Para 3, 5, 6, 8, 10, 12, 15, ¿cuánto vale Q1?',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'posicion', texto: '2', error: 'AT-POSICION-VALOR', siFuera: '2 es la posición, no el valor que está en ella.' },
        { id: 'mediana', texto: '8', error: 'AT-CUARTIL-MEDIANA', siFuera: '8 es Q2, la mediana.' },
        { id: 'cuarto', texto: '25 %', error: 'AT-CUARTIL-PORCENTAJE', siFuera: 'Q1 deja debajo el 25 % de los datos, pero su valor es un dato.' },
      ],
      dibujo: { datos: rectaCuartiles(BASE.slice(0, 7), { sin: true }), estado: {} },
      revelar: { datos: rectaCuartiles(BASE.slice(0, 7)), estado: {} },
      coincide: 'Coincide: (7 + 1)/4 = 2, y el segundo dato es 5.',
    },
    mira: {
      datos: rectaCuartiles(BASE.slice(0, 7), { desde: true }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Q1 en la posición (7 + 1)/4 = 2: el segundo dato.', ecuacion: [sub('Q', '1'), ' = 5'] },
        { estado: { corte: 2 }, texto: 'Q2 en la posición 4: es la mediana.', ecuacion: [sub('Q', '2'), ' = 8'] },
        { estado: { corte: 3 }, texto: 'Q3 en la posición 6. Entre Q1 y Q3 está la mitad central.', ecuacion: [sub('Q', '3'), ' = 12'] },
      ],
    },
    regla: {
      texto: 'Los cuartiles cortan los datos ordenados en cuatro partes con igual cantidad de datos. El percentil k deja debajo el k % de los datos.',
      ecuacion: [sub('Q', 'k'), ' en ', { frac: [['k (n + 1)'], '4'] }, '   ·   ', sub('P', 'k'), ' en ', { frac: [['k (n + 1)'], '100'] }],
      condicion: 'hay varias convenciones; esta unidad usa (n + 1). Si la posición cae entre dos datos, se interpola entre ellos.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.de([7, 11, 15]);
        const xs = []; let v = r.ent(1, 5);
        for (let k = 0; k < n; k++) { xs.push(v); v += r.ent(1, 4); }
        const k = s % 2 ? 3 : 1, pos = k * (n + 1) / 4, val = cuartil(xs, k);
        return {
          pregunta: `Datos ordenados: ${xs.join(', ')}. Con la posición k(n + 1)/4, ¿cuánto vale Q${k}?`,
          dibujo: { datos: Object.assign(rectaCuartiles(xs, { sin: true }), { max: Math.ceil((Math.max(...xs) + 1) / 5) * 5 }), estado: {} },
          opciones: opciones(val, [
            { id: 'posicion', valor: pos, error: 'AT-POSICION-VALOR', siFuera: 'Esa es la posición, no el dato.' },
            { id: 'mediana', valor: cuartil(xs, 2), error: 'AT-CUARTIL-MEDIANA', siFuera: 'Esa es la mediana, Q2.' },
            { id: 'otro', valor: cuartil(xs, 4 - k), error: 'AT-CUARTIL-OTRO', siFuera: `Ese es Q${4 - k}.` },
          ], x => fm(x)),
          solucion: { texto: `Posición ${fm(pos)}: el dato número ${fm(pos)}.`, ecuacion: [sub('Q', String(k)), ` = ${fm(val)}`], dibujo: { datos: Object.assign(rectaCuartiles(xs), { max: Math.ceil((Math.max(...xs) + 1) / 5) * 5 }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 6: varianza, desviación estándar y coeficiente de variación ----------
  // Cambia: qué tan separados están los datos de su media. Permanece: la media 10.
  // Progresa: distancias → cuadrados → promedio → raíz. Se reserva: dividir entre n − 1 en una muestra.
  // Debe verse: con la misma media, los datos más separados dan más varianza.
  const rectaDispersion = (xs, o = {}) => {
    const m = media(xs), el = puntos(xs, 'o', 1);
    el.push({ tipo: 'punto', x: m, color: 'd', rotulo: `x̄ = ${fm(m)}`, fila: 0 });
    if (o.distancias) xs.forEach((v, k) => { if (v !== m) el.push({ tipo: 'distancia', a: Math.min(v, m), b: Math.max(v, m), color: 'i', rotulo: fm(Math.abs(v - m)), fila: 2 + (k % 2), desde: 1 }); });
    return { min: Math.floor(Math.min(...xs, m) - 1), max: Math.ceil(Math.max(...xs, m) + 1), paso: 1, cada: 2, decimales: 2, filas: 3, variable: 'x', color: 'o', elementos: el };
  };
  const dispersion = {
    id: 'dispersion',
    titulo: 'Qué tan lejos de la media',
    temas: ['Varianza, desviación estándar y coeficiente de variación'],
    pieza: 'recta',
    juega: {
      consigna: 'Cuatro datos con media 10: 10 − a, 10 − a/2, 10 + a/2 y 10 + a. Abre o cierra la separación a.',
      voz: 'La media no se mueve. ¿Qué cambia?',
      controles: [{ id: 'a', etiqueta: 'a', color: 'c-o', min: 2, max: 8, paso: 2, inicio: 4, decimales: 0 }],
      dibujo: v => ({ datos: Object.assign(rectaDispersion([10 - v.a, 10 - v.a / 2, 10 + v.a / 2, 10 + v.a], { distancias: true }), { min: 0, max: 20 }), estado: { corte: 1 } }),
      lectura: v => { const xs = [10 - v.a, 10 - v.a / 2, 10 + v.a / 2, 10 + v.a]; return [`σ² = ${fm(varianza(xs))} · σ = ${fm(Math.sqrt(varianza(xs)))}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Para la población de datos 2, 4 y 9 (media 5), ¿cuál es la varianza poblacional?',
      opciones: [
        { id: 'c', texto: '8,67', correcta: true },
        { id: 'muestral', texto: '13', error: 'AT-N-MENOS-1', siFuera: '13 divide entre n − 1 = 2: es la varianza muestral. Aquí son todos los datos.' },
        { id: 'cero', texto: '0', error: 'AT-DESVIOS-SUMAN-CERO', siFuera: 'Los desvíos con signo suman 0; por eso se elevan al cuadrado.' },
        { id: 'sigma', texto: '2,94', error: 'AT-SIGMA-VARIANZA', siFuera: '2,94 es la desviación estándar, la raíz de la varianza.' },
      ],
      dibujo: { datos: rectaDispersion([2, 4, 9]), estado: {} },
      revelar: { datos: rectaDispersion([2, 4, 9], { distancias: true }), estado: { corte: 1 } },
      coincide: 'Coincide: (9 + 1 + 16) ÷ 3 = 26/3 ≈ 8,67.',
    },
    mira: {
      datos: rectaDispersion([2, 4, 9], { distancias: true }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Distancias a la media 5: 3, 1 y 4.', ecuacion: ['2 − 5 = −3   ·   4 − 5 = −1   ·   9 − 5 = 4'] },
        { estado: { corte: 1 }, texto: 'Con signo suman 0; al cuadrado, no se anulan.', ecuacion: ['9 + 1 + 16 = 26'] },
        { estado: { corte: 1 }, texto: 'Varianza: el promedio de esos cuadrados.', ecuacion: ['σ² = ', { frac: ['26', '3'] }, ' ≈ 8,67'] },
        { estado: { corte: 1 }, texto: 'Desviación estándar: la raíz, en las unidades de los datos.', ecuacion: ['σ = ', { raiz: '8,67' }, ' ≈ 2,94   ·   CV = ', { frac: ['2,94', '5'] }, ' ≈ 0,59'] },
      ],
    },
    regla: {
      texto: 'La varianza promedia los cuadrados de las distancias a la media; la desviación estándar es su raíz. El CV compara la dispersión con la media.',
      ecuacion: ['σ² = ', { frac: [['Σ', { sup: [['(', x, ' − ', xb, ')'], '2'] }], 'N'] }, '   ·   σ = ', { raiz: 'σ²' }, '   ·   CV = ', { frac: ['σ', xb] }],
      condicion: 'para toda la población se divide entre N; para una muestra, entre n − 1. El CV pide media positiva.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), m = r.ent(4, 12), d = [r.ent(1, 4), r.ent(1, 4)];
        const xs = [m - d[0], m + d[0], m - d[1], m + d[1], m].slice(0, s % 2 ? 4 : 5);
        const muestral = s % 3 === 1, pob = varianza(xs), mu = varianza(xs, true);
        const pideCV = s % 5 === 4;
        if (pideCV) {
          const cv = Math.sqrt(pob) / m;
          return {
            pregunta: `Para la población ${xs.join(', ')} (media ${m}), σ = ${fm(Math.sqrt(pob))}. ¿Cuál es el coeficiente de variación?`,
            opciones: opciones(cv, [
              { id: 'inv', valor: m / Math.sqrt(pob), error: 'AT-INVIERTE', siFuera: 'Eso divide la media entre σ; el CV es σ entre la media.' },
              { id: 'var', valor: pob / m, error: 'AT-SIGMA-VARIANZA', siFuera: 'Eso usa la varianza; el CV usa σ.' },
              { id: 'sigma', valor: Math.sqrt(pob), error: 'AT-OLVIDA', siFuera: 'Esa es σ; falta dividir entre la media.' },
            ], v => fm(v, 3)),
            solucion: { texto: 'σ entre la media.', ecuacion: [`CV = ${fm(Math.sqrt(pob))} ÷ ${m} = ${fm(cv, 3)}`] },
          };
        }
        const bien = muestral ? mu : pob;
        return {
          pregunta: `${muestral ? 'Una muestra' : 'Toda la población'}: ${xs.join(', ')}, con media ${m}. ¿Cuál es su varianza ${muestral ? 'muestral' : 'poblacional'}?`,
          dibujo: { datos: rectaDispersion(xs), estado: {} },
          opciones: opciones(bien, [
            { id: 'otra', valor: muestral ? pob : mu, error: 'AT-N-MENOS-1', siFuera: muestral ? 'Eso divide entre n; en una muestra se divide entre n − 1.' : 'Eso divide entre n − 1; para la población se divide entre N.' },
            { id: 'sigma', valor: Math.sqrt(bien), error: 'AT-SIGMA-VARIANZA', siFuera: 'Esa es la desviación estándar.' },
            { id: 'abs', valor: suma(xs.map(v => Math.abs(v - m))) / xs.length, error: 'AT-SIN-CUADRADO', siFuera: 'Eso promedia distancias sin elevarlas al cuadrado.' },
          ], v => fm(v)),
          solucion: { texto: `Cuadrados de las distancias, entre ${muestral ? 'n − 1' : 'N'}.`, ecuacion: [{ frac: [xs.map(v => `${(v - m) ** 2}`).join(' + '), String(xs.length - (muestral ? 1 : 0))] }, ` = ${fm(bien)}`], dibujo: { datos: rectaDispersion(xs, { distancias: true }), estado: { corte: 1 } } },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.estadistica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/recta.js'],
    historia: {
      texto: 'Londres ya anotaba nacimientos y entierros cuando John Graunt los estudió en 1662. Convirtió listas administrativas en preguntas sobre una población: cuántos morían de cada causa, si nacían más varones. Lo que se podía concluir dependía de cómo se habían anotado los datos, como hoy. Esta unidad sigue esa pregunta: qué resumen elegir y qué se pierde al reducir muchos datos a un número.',
      pregunta: '¿Qué se pierde cuando todo un salón se resume en un promedio?',
      fuente: { titulo: 'John Graunt, Natural and political observations… (1662) — Wellcome Collection', url: 'https://wellcomecollection.org/works/sds578rr' },
    },
    ideas: [tabla, graficos, centrales, ponderada, cuartiles, dispersion],
  };
});
