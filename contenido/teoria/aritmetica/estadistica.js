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
 * Ronda 2 (14 nov 2026): gesto directo en las ideas 2 a 6 (techo de la barra, el último dato, el promedio ponderado,
 * el último dato tomado y el dato más alejado). La idea 1 es la tabla de la cuenta, sin lugar que agarrar.
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
  // «=» si el valor sale exacto con dos decimales; «≈» si se redondea (lo usan los ejemplos resueltos).
  const igual = (v, d = 2) => (Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-9 ? ' = ' : ' ≈ ');
  const hermanos = k => (k === 1 ? '1 hermano' : `${k} hermanos`);
  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de la pieza; el lector ajusta al paso y al rango.
  const RECTA = () => Kit.piezas.recta, EJES = () => Kit.piezas.ejes;
  const inversa = (escala, lo, hi) => px => lo + (px - escala(lo)) * (hi - lo) / (escala(hi) - escala(lo));
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
    lee: {
      tarjetas: [
        { titulo: 'Preguntar a una parte', texto: 'Un colegio de Juliaca quiere saber cuántos hermanos tienen sus 600 alumnos. No pregunta a todos: elige a 20. Los 600 son la población; los 20 que responden son la muestra.' },
        { titulo: 'Qué se anota', texto: 'Lo que se anota de cada alumno es la variable. Si es una cualidad, como el color favorito, es cualitativa. Si es un número, es cuantitativa: discreta si se cuenta, continua si se mide.' },
        { titulo: 'Cómo se lee la tabla', texto: ['La columna ', x, ' da las respuestas posibles: 0, 1, 2 hermanos… La columna ', fr, ' dice cuántos alumnos dieron cada respuesta. Al jugar, cambia una ', fr, ' y mira qué columnas se mueven.'] },
      ],
    },
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
        { estado: { paso: 3, columna: 3 }, texto: 'La frecuencia acumulada F va sumando: a lo más 2 hermanos son 14.', ecuacion: [Fa, ' = 3 + 6 + 5 = 14'] },
      ],
    },
    regla: {
      texto: 'La población es todo el grupo que interesa; la muestra, la parte que se observa. La tabla cuenta f, divide h = f/n y acumula F.',
      ecuacion: ['Σ', fr, ' = n', '   ·   ', h, ' = ', { llave: [{ frac: [fr, 'n'] }], nota: 'parte del total', color: 'c-i' }, '   ·   ', 'Σ', h, ' = 1'],
      condicion: 'la variable es cualitativa (colores) o cuantitativa: discreta (se cuenta) o continua (se mide). F pide valores ordenables.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = s % 3;
        if (tipo === 2) {
          const casos = [
            ['el distrito donde vive cada alumno', 'Cualitativa', 'La respuesta es un nombre, como Juliaca o Caracoto: una cualidad, no un número.'],
            ['la estatura de cada alumno, en cm', 'Cuantitativa continua', 'Es un número que se mide con cinta métrica y puede tener decimales: 158,5 cm.'],
            ['cuántos libros leyó cada alumno este año', 'Cuantitativa discreta', 'Es un número que se cuenta: 0, 1, 2… No hay 2,5 libros leídos.'],
            ['el deporte favorito de cada alumno', 'Cualitativa', 'La respuesta es una palabra, como fútbol o vóley: una cualidad.'],
            ['la temperatura de cada mañana, en °C', 'Cuantitativa continua', 'Es un número que se mide con termómetro y puede tener decimales.'],
            ['cuántas personas viven en cada casa', 'Cuantitativa discreta', 'Es un número que se cuenta: personas enteras.'],
          ];
          const [que, bien, porque] = casos[r.ent(0, casos.length - 1)];
          return {
            enunciado: `En una encuesta se anota ${que}. ¿Qué tipo de variable es?`,
            pasos: [
              { tipo: 'pide', texto: 'Piden el tipo de variable: qué clase de respuesta se anota de cada uno.' },
              { tipo: 'datos', texto: `De cada uno se anota ${que}.` },
              { tipo: 'regla', texto: 'Si la respuesta es una palabra, la variable es cualitativa. Si es un número, es cuantitativa: discreta cuando se cuenta, continua cuando se mide.' },
              { tipo: 'aplica', texto: porque },
              { tipo: 'sentido', texto: 'Prueba: ¿tiene sentido sacar un promedio de las respuestas? Si no, es cualitativa. ¿Tiene sentido un valor con decimales? Si sí, es continua.' },
            ],
            respuesta: bien,
          };
        }
        const fs = [r.ent(1, 6), r.ent(2, 8), r.ent(2, 8), r.ent(1, 6), r.ent(1, 4)], n = suma(fs), k = r.ent(1, 3);
        const F = suma(fs.slice(0, k + 1)), hk = fs[k] / n, hasta = Array.from({ length: k + 1 }, (_, i) => i);
        const oculta = { datos: tablaHermanos(fs, { pasoH: 9, pasoF: 9 }), estado: {} };
        if (tipo === 0) {
          return {
            enunciado: `En la tabla de hermanos, ¿cuántos alumnos tienen a lo más ${hermanos(k)}?`,
            dibujo: oculta,
            pasos: [
              { tipo: 'pide', texto: `Piden cuántos alumnos tienen ${hermanos(k)} o menos: «a lo más ${k}» incluye al ${k}.` },
              { tipo: 'datos', texto: ['La columna ', fr, ` da ${fs.slice(0, k + 1).join(', ')} alumnos para x de 0 a ${k}. En total son n = ${n}.`] },
              { tipo: 'regla', texto: 'Contar hasta un valor es acumular: sumo los alumnos de ese valor y los de todos los valores anteriores.' },
              { tipo: 'cuentas', texto: ['Sumo la columna ', fr, ` desde x = 0 hasta x = ${k}.`], ecuacion: [Fa, ` = ${fs.slice(0, k + 1).join(' + ')} = ${F}`],
                dibujo: { datos: tablaHermanos(fs, { resalta: k }), estado: { fila: hasta } } },
              { tipo: 'sentido', texto: `Los que tienen más de ${k} son ${n} − ${F} = ${n - F}. Juntos con los ${F} dan los ${n} alumnos: cuadra.` },
            ],
            respuesta: `${F} alumnos`,
          };
        }
        return {
          enunciado: `En la tabla de hermanos, ¿qué frecuencia relativa tiene x = ${k}?`,
          dibujo: oculta,
          pasos: [
            { tipo: 'pide', texto: ['Piden ', h, ` de x = ${k}: qué parte del total de alumnos tiene ${hermanos(k)}.`] },
            { tipo: 'datos', texto: [`Con ${hermanos(k)} hay `, fr, ` = ${fs[k]} alumnos, y en total son n = ${n}.`] },
            { tipo: 'regla', texto: 'La parte del total sale de dividir cuántos son entre todos los que respondieron.', ecuacion: [h, ' = ', { frac: [fr, 'n'] }] },
            { tipo: 'cuentas', texto: `Divido ${fs[k]} entre ${n}.`, ecuacion: [h, ' = ', { frac: [String(fs[k]), String(n)] }, `${igual(hk, 3)}${fm(hk, 3)}`],
              dibujo: { datos: tablaHermanos(fs, { pasoF: 9, resalta: k }), estado: { fila: k, columna: 2 } } },
            { tipo: 'sentido', texto: `Una parte del total queda entre 0 y 1. De vuelta: ${fm(hk, 3)} · ${n} ≈ ${fm(hk * n)}, la f de x = ${k}.` },
          ],
          respuesta: ['La frecuencia relativa es ', h, `${igual(hk, 3)}${fm(hk, 3)}`],
        };
      },
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
      y: { min: 0, max: o.ymax || Math.ceil((top + 1) / 2) * 2, paso: 2, nombre: 'f', decimales: 0, color: 'i' },
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
    lee: {
      tarjetas: [
        { titulo: 'Cómo llegas al colegio', texto: 'En Juliaca, unos alumnos llegan en combi, otros a pie, en bici o en mototaxi. Cada forma de llegar es una categoría, y cuántos alumnos la eligen es su frecuencia.' },
        { titulo: 'Barras', texto: 'En un gráfico de barras, cada categoría tiene su barra y la altura cuenta su frecuencia. Para comparar de forma honesta, todas las barras arrancan del mismo piso: el 0.' },
        { titulo: 'Sectores', texto: 'Un gráfico de sectores reparte un círculo en tajadas, una por categoría. Lo verás en los resultados de una elección o en un informe del colegio. Al jugar, mira la barra de combi frente a las demás.' },
      ],
    },
    juega: {
      consigna: 'Cómo llegan los alumnos: combi, a pie, bici o mototaxi (barras 1 a 4). Cambia cuántos van en combi y compara las barras.',
      voz: 'Cada barra empieza en 0: su altura es la frecuencia.',
      controles: [{ id: 'c', etiqueta: 'f de combi', color: 'c-i', min: 2, max: 12, paso: 2, inicio: 8, decimales: 0 }],
      // El eje vertical queda fijo de 0 a 14: al subir la barra de combi, las demás no se achican.
      dibujo: v => ({ datos: barras([v.c, 5, 3, 4], NOMBRES, { conF: true, marca: 0, ymax: 14 }), estado: {} }),
      // Arrastra el techo de la barra de combi: su altura es la frecuencia.
      arrastres: [
        { id: 'combi', etiqueta: 'techo de la barra de combi', color: 'c-i',
          donde: v => { const g = EJES().geometria(barras([v.c, 5, 3, 4], NOMBRES, { ymax: 14 })); return { x: g.X(1), y: g.Y(v.c) }; },
          mover: (pt, v) => ({ c: inversa(EJES().geometria(barras([v.c, 5, 3, 4], NOMBRES, { ymax: 14 })).Y, 0, 14)(pt.y) }) },
      ],
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
        { estado: { corte: 3 }, texto: 'El rótulo de la barra da esa parte de los 360° de un círculo.', ecuacion: ['0,25 · 360° = 90°'] },
      ],
    },
    regla: {
      texto: 'Barras para categorías o valores contados, con el eje desde 0; histograma, barras pegadas para datos medidos en intervalos; sectores, partes de un todo.',
      ecuacion: ['ángulo = ', h, ' · ', { llave: ['360°'], nota: 'todo el círculo' }, '   ·   ', h, ' = ', { frac: [fr, 'n'] }],
      condicion: 'un eje que no empieza en 0 exagera las diferencias. Los sectores solo sirven si las partes forman un todo.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), n = r.de([20, 24, 30, 36, 40, 60]), fs = [0, 0, 0, 0];
        const div = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12].filter(d => (360 * d) % n === 0 && d < n / 2);
        fs[1] = r.de(div); fs[2] = r.ent(1, Math.floor((n - fs[1]) / 3)); fs[3] = r.ent(1, Math.floor((n - fs[1] - fs[2]) / 2)); fs[0] = n - fs[1] - fs[2] - fs[3];
        const ang = 360 * fs[1] / n;
        return {
          enunciado: `De ${n} alumnos, ${fs[1]} ${fs[1] === 1 ? 'llega' : 'llegan'} a pie. En un gráfico de sectores, ¿qué ángulo le toca a «a pie»?`,
          dibujo: { datos: barras(fs, NOMBRES, { marca: 1 }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden cuántos grados del círculo le tocan a la tajada de «a pie».' },
            { tipo: 'datos', texto: `Son ${n} alumnos en total y ${fs[1]} ${fs[1] === 1 ? 'llega' : 'llegan'} a pie: la barra 2, en rojo.`, ecuacion: [fr, ` = ${fs[1]}`, '   ·   ', `n = ${n}`] },
            { tipo: 'regla', texto: 'Cada categoría se queda con la misma parte del círculo que tiene del total de alumnos. El círculo entero mide 360°.',
              ecuacion: ['ángulo = ', h, ' · 360°'] },
            { tipo: 'cuentas', texto: 'Primero, qué parte del total son; después, esa parte de 360°.',
              ecuacion: [h, ' = ', { frac: [String(fs[1]), String(n)] }, '   →   ', { frac: [String(fs[1]), String(n)] }, ` · 360° = ${fm(ang)}°`],
              dibujo: { datos: barras(fs, NOMBRES, { grados: true, marca: 1 }), estado: {} } },
            { tipo: 'sentido', texto: `Los otros ${n - fs[1]} alumnos se llevan 360° − ${fm(ang)}° = ${fm(360 - ang)}°. Juntos dan el círculo entero.` },
          ],
          respuesta: `${fm(ang)}° para «a pie»`,
        };
      },
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
    lee: {
      tarjetas: [
        { titulo: 'Un día típico', texto: 'La dueña de una tienda de Juliaca anota cuánto vende cada día. Cuando le preguntan «¿cuánto vendes en un día normal?», no lee toda la lista: busca un solo número que represente a todos.' },
        { titulo: 'Tres candidatos', texto: 'Para ese número hay tres muy usados: la media, la mediana y la moda. Los tres buscan el centro de los datos, pero cada uno lo busca a su manera. A veces coinciden y a veces no.' },
        { titulo: 'Qué mirar', texto: ['Cada dato es un punto naranja en la recta; si dos datos son iguales, se apilan. El punto verde es la media, ', xb, ', y el rojo, la mediana, ', Me, '. Al jugar, lleva el último dato lejos y sigue a los dos.'] },
      ],
    },
    juega: {
      consigna: 'Cinco datos: 2, 4, 4, 9 y uno que tú eliges. Muévelo lejos y mira qué pasa con la media y con la mediana.',
      voz: 'Lleva el último dato hasta el extremo derecho.',
      controles: [{ id: 'u', etiqueta: 'Último dato', color: 'c-o', min: 1, max: 30, paso: 1, inicio: 6, decimales: 0 }],
      dibujo: v => ({ datos: rectaCentrales([2, 4, 4, 9, v.u], { max: 30 }), estado: {} }),
      // Arrastra el último dato por la recta (si coincide con otro, se apila encima).
      arrastres: [
        { id: 'ultimo', etiqueta: 'último dato', color: 'c-o',
          donde: v => { const d = rectaCentrales([2, 4, 4, 9, v.u], { max: 30 }), g = RECTA().geometria(d); return { x: g.x(v.u), y: g.filaY(d.elementos[4].fila) }; },
          mover: pt => ({ u: inversa(RECTA().geometria(rectaCentrales([2, 4, 4, 9, 6], { max: 30 })).x, 0, 30)(pt.x) }) },
      ],
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
      ecuacion: [xb, ' = ', { llave: [{ frac: [['Σ', x], 'n'] }], nota: 'reparte la suma', color: 'c-d' }, '   ·   ', Me, ' = el dato central'],
      condicion: 'para la mediana primero se ordena; con n par, se promedian los dos del medio. Puede haber varias modas o ninguna.',
    },
    resuelve: {
      generar(s, t = s + 900) {
        const r = azar(t), n = r.de([5, 6, 7]);
        const xs = Array.from({ length: n }, () => r.ent(1, 15));
        xs[r.ent(0, n - 1)] = xs[0];               // al menos una repetición
        const pide = ['media', 'mediana', 'moda'][s % 3];
        const cuenta = {}; xs.forEach(v => { cuenta[v] = (cuenta[v] || 0) + 1; });
        const maxc = Math.max(...Object.values(cuenta)), modas = Object.keys(cuenta).filter(k => cuenta[k] === maxc).map(Number);
        if (pide === 'moda' && modas.length > 1) return this.generar(s, t + 600);
        const o = ordenar(xs), m = media(xs), me = mediana(xs), mo = modas[0], sx = suma(xs);
        const sim = { media: xb, mediana: Me, moda: 'moda' }[pide];
        const regla = {
          media: 'La media reparte la suma en partes iguales: sumo todos los datos y divido entre cuántos son.',
          mediana: 'La mediana es el dato que queda al centro después de ordenar. Si son una cantidad par, promedio los dos del centro.',
          moda: 'La moda es el valor que más veces aparece. En la recta, es la pila de puntos más alta.',
        }[pide];
        const centro = n % 2 ? `el dato número ${(n + 1) / 2}` : `los datos número ${n / 2} y ${n / 2 + 1}`;
        const cuentas = {
          media: { texto: `Sumo los ${n} datos y divido entre ${n}.`, ecuacion: [xb, ` = ${fm(sx)} ÷ ${n} = ${fm(m)}`] },
          mediana: { texto: `Con ${n} datos ordenados, el centro es ${centro}.`,
            ecuacion: n % 2 ? [`${o.join(', ')}   →   `, Me, ` = ${fm(me)}`] : [Me, ` = (${o[n / 2 - 1]} + ${o[n / 2]}) ÷ 2 = ${fm(me)}`] },
          moda: { texto: 'Cuento cuántas veces aparece cada valor y me quedo con el que más se repite.', ecuacion: [`${mo} aparece ${maxc} veces`] },
        }[pide];
        const sentido = {
          media: `Queda entre ${o[0]} y ${o[n - 1]}, el menor y el mayor dato. Y ${n} veces la media devuelve la suma, ${fm(sx)}.`,
          mediana: `En la lista ordenada quedan ${Math.floor(n / 2)} datos antes del centro y ${Math.floor(n / 2)} después: ${fm(me)} está justo en medio.`,
          moda: `Ningún otro valor aparece ${maxc} veces: en la recta, la pila del ${mo} es la más alta.`,
        }[pide];
        return {
          enunciado: `Para los datos ${xs.join(', ')}, ¿cuál es la ${pide}?`,
          dibujo: { datos: rectaCentrales(xs, { sinMedia: true, sinMediana: true }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden la ${pide} de estos ${n} datos.` },
            { tipo: 'datos', texto: `Ordenados de menor a mayor quedan así.`, ecuacion: [x, `: ${o.join(', ')}`] },
            { tipo: 'regla', texto: regla },
            { tipo: 'cuentas', texto: cuentas.texto, ecuacion: cuentas.ecuacion,
              dibujo: { datos: rectaCentrales(xs, { sinMedia: pide !== 'media', sinMediana: pide !== 'mediana' }), estado: {} } },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: [sim, ` = ${fm({ media: m, mediana: me, moda: mo }[pide])}`],
        };
      },
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
    lee: {
      tarjetas: [
        { titulo: 'Cursos con créditos', texto: 'En la UNA Puno, como en otras universidades, cada curso tiene créditos: uno de 4 créditos tiene más horas de clase que uno de 2. Por eso el promedio del ciclo no se saca igual que en el colegio.' },
        { titulo: 'El peso de cada dato', texto: ['El número que dice cuánto cuenta cada dato se llama peso, ', w, '. En las notas, el peso son los créditos. En un examen de admisión, puede ser cuántas preguntas tiene cada curso.'] },
        { titulo: 'Qué mirar', texto: 'Los puntos naranjas son las notas 12 y 18, con sus créditos encima. El punto verde es el promedio ponderado. Al jugar, dale más créditos a un curso y mira hacia dónde se corre el verde.' },
      ],
    },
    juega: {
      consigna: 'Un alumno sacó 12 en un curso y 18 en otro. Cambia los créditos de cada curso y mira su promedio ponderado.',
      voz: 'Compara el punto verde con el punto medio 15.',
      controles: [
        { id: 'a', etiqueta: 'Créditos del 12', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'Créditos del 18', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: rectaNotas([12, 18], [v.a, v.b]), estado: {} }),
      // Arrastra el promedio ponderado: salen los créditos del 12 que lo dejan ahí (con los del 18 fijos).
      arrastres: [
        { id: 'ponderado', etiqueta: 'promedio ponderado', color: 'c-i',
          donde: v => { const g = RECTA().geometria(rectaNotas([12, 18], [v.a, v.b])); return { x: g.x((12 * v.a + 18 * v.b) / (v.a + v.b)), y: g.filaY(0) }; },
          mover: (pt, v) => {
            const m = Math.min(17.9, Math.max(12.1, inversa(RECTA().geometria(rectaNotas([12, 18], [v.a, v.b])).x, 8, 20)(pt.x)));
            return { a: v.b * (18 - m) / (m - 12) };
          } },
      ],
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
      ecuacion: [sub(xb, 'p'), ' = ', { llave: [{ frac: [['Σ', w, x], ['Σ', w]] }], nota: 'pesa según w', color: 'c-i' }, '   ·   ', 'G = ', { raiz: [sub(x, '1'), '·…·', sub(x, 'n')], indice: 'n' }],
      condicion: 'los pesos son positivos y dicen cuánto cuenta cada dato. La geométrica pide datos positivos.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        if (s % 3 === 2) {
          const [a, b] = r.de([[1.2, 1.8], [1.1, 1.6], [0.9, 1.6], [1.25, 1.8], [2, 1.125]]), P = a * b, G = Math.sqrt(P), A = (a + b) / 2;
          return {
            enunciado: `Una población se multiplica por ${fm(a, 3)} el primer año y por ${fm(b, 3)} el segundo. ¿Qué factor anual igual, repetido dos años, da lo mismo?`,
            pasos: [
              { tipo: 'pide', texto: 'Piden un solo factor G que, usado los dos años, deje la población igual que los dos factores reales.' },
              { tipo: 'datos', texto: 'En dos años, la población queda multiplicada por el producto de los dos factores.', ecuacion: [`${fm(a, 3)} · ${fm(b, 3)} = ${fm(P, 4)}`] },
              { tipo: 'regla', texto: 'Cuando los cambios se multiplican, el factor igual que los reemplaza es la media geométrica: la raíz del producto.' },
              { tipo: 'cuentas', texto: 'G repetido dos años es G · G. Lo igualo al producto y saco raíz cuadrada.',
                ecuacion: [`G · G = ${fm(P, 4)}   →   G = `, { raiz: fm(P, 4) }, `${igual(G, 4)}${fm(G, 4)}`] },
              { tipo: 'sentido', texto: `Comprueba: ${fm(G, 4)} · ${fm(G, 4)}${igual(G, 4).trim() === '=' ? ' = ' : ' ≈ '}${fm(G * G, 4)}, el mismo producto. El promedio simple, ${fm(A, 4)}, daría ${fm(A * A, 4)}: se pasa.` },
            ],
            respuesta: `G${igual(G, 4)}${fm(G, 4)} cada año`,
          };
        }
        const notas = [r.ent(8, 13), r.ent(12, 16), r.ent(15, 20)], pesos = [r.ent(1, 5), r.ent(1, 5), r.ent(1, 5)];
        if (pesos[0] === pesos[1] && pesos[1] === pesos[2]) pesos[2] += 1;
        const num = suma(notas.map((n, k) => n * pesos[k])), den = suma(pesos), p = num / den, ms = media(notas);
        const lo = Math.min(...notas), hi = Math.max(...notas);
        return {
          enunciado: `Notas ${notas.join(', ')} en cursos de ${pesos.join(', ')} créditos, en ese orden. ¿Cuál es el promedio ponderado?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden el promedio ponderado de las tres notas, donde cada curso pesa sus créditos.' },
            { tipo: 'datos', texto: 'Tengo tres notas y los créditos de cada curso, en el mismo orden.', ecuacion: [x, `: ${notas.join(', ')}`, '   ·   ', w, `: ${pesos.join(', ')}`] },
            { tipo: 'regla', texto: 'Cada nota cuenta tantas veces como créditos tiene: multiplico nota por créditos, sumo y divido entre el total de créditos.' },
            { tipo: 'cuentas', texto: 'Arriba, cada nota por sus créditos; abajo, la suma de los créditos.',
              ecuacion: [sub(xb, 'p'), ' = ', { frac: [notas.map((n, k) => `${n} · ${pesos[k]}`).join(' + '), pesos.join(' + ')] }, ' = ', { frac: [String(num), String(den)] }, ` = ${fm(p)}`] },
            { tipo: 'sentido', texto: `Queda entre ${lo} y ${hi}, la nota menor y la mayor. ${Math.abs(p - ms) < 1e-9 ? 'Aquí coincide con el promedio simple.' : `El promedio simple daría ${fm(ms)}: la diferencia la ponen los créditos.`}` },
          ],
          respuesta: [sub(xb, 'p'), ` = ${fm(p)}`],
        };
      },
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
    lee: {
      tarjetas: [
        { titulo: 'El cuarto de arriba', texto: 'Tras un examen de admisión, alguien puede decirte: «quedaste en el cuarto de arriba». Para saberlo, se ordenan todos los puntajes y se parten en cuatro grupos con la misma cantidad de postulantes.' },
        { titulo: 'Tres cortes', texto: 'Para partir en cuatro hacen falta tres cortes: los cuartiles Q1, Q2 y Q3. El del medio, Q2, ya lo conoces con otro nombre de la idea anterior.' },
        { titulo: 'Cien grupos', texto: 'Si en vez de cuatro grupos se hacen cien, los cortes se llaman percentiles. «Estás en el percentil 80» quiere decir que el 80 % de los puntajes quedó debajo del tuyo.' },
        { titulo: 'Qué mirar', texto: 'Los datos naranjas ya están ordenados en la recta y los cuartiles salen en rojo. Al jugar, toma más o menos datos de la lista y cuenta cuántos quedan entre dos cortes.' },
      ],
    },
    juega: {
      consigna: 'Elige cuántos datos se toman de la lista. Mira dónde caen los tres cuartiles: cortan los datos ordenados en cuatro partes.',
      voz: 'Cuenta cuántos datos quedan entre dos cuartiles.',
      controles: [{ id: 'n', etiqueta: 'n datos', color: 'c-o', min: 5, max: 11, paso: 1, inicio: 7, decimales: 0 }],
      dibujo: v => ({ datos: rectaCuartiles(BASE.slice(0, v.n)), estado: {} }),
      // Arrastra el último dato tomado hacia la derecha para tomar más de la lista, o a la izquierda para tomar menos.
      arrastres: [
        { id: 'ultimo', etiqueta: 'último dato tomado', color: 'c-o',
          donde: v => { const g = RECTA().geometria(rectaCuartiles(BASE.slice(0, v.n))); return { x: g.x(BASE[v.n - 1]), y: g.filaY(1) }; },
          mover: (pt, v) => {
            const val = inversa(RECTA().geometria(rectaCuartiles(BASE.slice(0, v.n))).x, 0, 26)(pt.x);
            return { n: [5, 6, 7, 8, 9, 10, 11].reduce((a, k) => (Math.abs(BASE[k - 1] - val) < Math.abs(BASE[a - 1] - val) ? k : a)) };
          } },
      ],
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
      ecuacion: [sub('Q', 'k'), ' en ', { llave: [{ frac: [['k (n + 1)'], '4'] }], nota: 'posición, no valor', color: 'c-h' }, '   ·   ', sub('P', 'k'), ' en ', { frac: [['k (n + 1)'], '100'] }],
      condicion: 'hay varias convenciones; esta unidad usa (n + 1). Si la posición cae entre dos datos, se interpola entre ellos.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), n = r.de([7, 11, 15]);
        const xs = []; let v = r.ent(1, 5);
        for (let k = 0; k < n; k++) { xs.push(v); v += r.ent(1, 4); }
        const k = s % 2 ? 3 : 1, pos = k * (n + 1) / 4, val = cuartil(xs, k);
        const max = Math.ceil((Math.max(...xs) + 1) / 5) * 5;
        return {
          enunciado: `Datos ordenados: ${xs.join(', ')}. Con la posición k(n + 1)/4, ¿cuánto vale Q${k}?`,
          dibujo: { datos: Object.assign(rectaCuartiles(xs, { sin: true }), { max }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden ', sub('Q', String(k)), `: el corte que deja debajo ${k === 1 ? 'la cuarta parte' : 'tres cuartas partes'} de los datos.`] },
            { tipo: 'datos', texto: `Son n = ${n} datos, ya ordenados de menor a mayor, y k = ${k}.` },
            { tipo: 'regla', texto: 'Primero hallo el lugar del cuartil en la lista ordenada; después leo qué dato está en ese lugar. El lugar no es la respuesta.',
              ecuacion: ['lugar = ', { frac: [['k (n + 1)'], '4'] }] },
            { tipo: 'cuentas', texto: `Cuento ${fm(pos)} lugares desde el menor: ahí está el ${fm(val)}.`,
              ecuacion: ['lugar = ', { frac: [`${k} · (${n} + 1)`, '4'] }, ` = ${fm(pos)}   →   `, sub('Q', String(k)), ` = ${fm(val)}`],
              dibujo: { datos: Object.assign(rectaCuartiles(xs), { max }), estado: {} } },
            { tipo: 'sentido', texto: `${fm(val)} es un dato de la lista. Antes de él hay ${fm(pos - 1)} datos y después ${fm(n - pos)}: es el corte de ${k === 1 ? 'abajo' : 'arriba'}.` },
          ],
          respuesta: [sub('Q', String(k)), ` = ${fm(val)}`],
        };
      },
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
  const rectaDisp = a => Object.assign(rectaDispersion([10 - a, 10 - a / 2, 10 + a / 2, 10 + a], { distancias: true }), { min: 0, max: 20 });
  const dispersion = {
    id: 'dispersion',
    titulo: 'Qué tan lejos de la media',
    temas: ['Varianza, desviación estándar y coeficiente de variación'],
    pieza: 'recta',
    lee: {
      tarjetas: [
        { titulo: 'Mismo promedio', texto: 'Dos salones de Puno tienen promedio 14. En uno, casi todos sacaron entre 13 y 15; en el otro hay notas de 6 y de 20. El promedio es el mismo, pero los salones no se parecen.' },
        { titulo: 'Dispersión', texto: 'Cuánto se separan los datos de su centro se llama dispersión. Para medirla, se mira la distancia de cada dato a la media: si todas son cortas, los datos están juntos.' },
        { titulo: 'Qué mirar', texto: 'Los puntos naranjas son los datos, el verde es la media y las cotas turquesa marcan cuánto se aleja cada dato. Al jugar, abre la separación a y mira la lectura mientras la media se queda en 10.' },
      ],
    },
    juega: {
      consigna: 'Cuatro datos con media 10: 10 − a, 10 − a/2, 10 + a/2 y 10 + a. Abre o cierra la separación a.',
      voz: 'La media no se mueve. ¿Qué cambia?',
      controles: [{ id: 'a', etiqueta: 'a', color: 'c-o', min: 2, max: 8, paso: 2, inicio: 4, decimales: 0 }],
      dibujo: v => ({ datos: rectaDisp(v.a), estado: { corte: 1 } }),
      // Arrastra el dato de la derecha: los cuatro se abren o se cierran juntos alrededor de 10.
      arrastres: [
        { id: 'extremo', etiqueta: 'dato más alejado, a la derecha', color: 'c-o',
          donde: v => { const g = RECTA().geometria(rectaDisp(v.a)); return { x: g.x(10 + v.a), y: g.filaY(1) }; },
          mover: (pt, v) => ({ a: inversa(RECTA().geometria(rectaDisp(v.a)).x, 0, 20)(pt.x) - 10 }) },
      ],
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
        { estado: { corte: 1 }, texto: 'Distancias a la media 5: 3, 1 y 4.', ecuacion: ['2 − 5 = −3', '   ·   ', '4 − 5 = −1', '   ·   ', '9 − 5 = 4'] },
        { estado: { corte: 1 }, texto: 'Con signo suman 0; al cuadrado, no se anulan.', ecuacion: ['9 + 1 + 16 = 26'] },
        { estado: { corte: 1 }, texto: 'Varianza: el promedio de esos cuadrados.', ecuacion: ['σ² = ', { frac: ['26', '3'] }, ' ≈ 8,67'] },
        { estado: { corte: 1 }, texto: 'Desviación estándar: la raíz, en las unidades de los datos.', ecuacion: ['σ = ', { raiz: '8,67' }, ' ≈ 2,94', '   ·   ', 'CV = ', { frac: ['2,94', '5'] }, ' ≈ 0,59'] },
      ],
    },
    regla: {
      texto: 'La varianza promedia los cuadrados de las distancias a la media; la desviación estándar es su raíz. El coeficiente de variación (CV) compara la dispersión con la media.',
      ecuacion: ['σ² = ', { llave: [{ frac: [['Σ', { sup: [['(', x, ' − ', xb, ')'], '2'] }], 'N'] }], nota: 'promedio de cuadrados', color: 'c-i' }, '   ·   ', 'σ = ', { raiz: 'σ²' }, '   ·   ', 'CV = ', { frac: ['σ', xb] }],
      condicion: 'para toda la población se divide entre N; para una muestra, entre n − 1. El CV pide media positiva.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), m = r.ent(4, 12), d = [r.ent(1, 4), r.ent(1, 4)];
        const xs = [m - d[0], m + d[0], m - d[1], m + d[1], m].slice(0, s % 2 ? 4 : 5), n = xs.length;
        const muestral = s % 3 === 1, pob = varianza(xs), mu = varianza(xs, true);
        const desv = xs.map(v => v - m), cuad = desv.map(e => e * e), sc = suma(cuad);
        const conSigno = desv.map((e, i) => (i === 0 ? fm(e) : e < 0 ? `− ${fm(-e)}` : `+ ${fm(e)}`)).join(' ');
        const dibujo = { datos: rectaDispersion(xs), estado: {} }, conCotas = { datos: rectaDispersion(xs, { distancias: true }), estado: { corte: 1 } };
        if (s % 5 === 4) {
          const sg = Math.sqrt(pob), cv = sg / m;
          return {
            enunciado: `Para la población ${xs.join(', ')} (media ${m}), σ = ${fm(sg)}. ¿Cuál es el coeficiente de variación?`,
            dibujo,
            pasos: [
              { tipo: 'pide', texto: 'Piden el coeficiente de variación: qué tan grande es σ comparada con la media.' },
              { tipo: 'datos', texto: `Son todos los datos, con media ${m}.`, ecuacion: ['σ = ', `${fm(sg)}`, '   ·   ', xb, ` = ${m}`] },
              { tipo: 'regla', texto: 'Para comparar la dispersión con el tamaño de los datos, divido la desviación estándar entre la media.', ecuacion: ['CV = ', { frac: ['σ', xb] }] },
              { tipo: 'cuentas', texto: `Divido ${fm(sg)} entre ${m}.`, ecuacion: [`CV = ${fm(sg)} ÷ ${m}${igual(cv, 3)}${fm(cv, 3)}`], dibujo: conCotas },
              { tipo: 'sentido', texto: `De vuelta: ${fm(cv, 3)} · ${m} ≈ ${fm(cv * m)}, la σ. O sea, σ es el ${fm(100 * cv, 1)} % de la media.` },
            ],
            respuesta: `CV${igual(cv, 3)}${fm(cv, 3)}`,
          };
        }
        const bien = muestral ? mu : pob, den = n - (muestral ? 1 : 0);
        return {
          enunciado: `${muestral ? 'Una muestra' : 'Toda la población'}: ${xs.join(', ')}, con media ${m}. ¿Cuál es su varianza ${muestral ? 'muestral' : 'poblacional'}?`,
          dibujo,
          pasos: [
            { tipo: 'pide', texto: `Piden la varianza ${muestral ? 'muestral: los datos son solo una parte del grupo' : 'poblacional: están todos los datos del grupo'}.` },
            { tipo: 'datos', texto: `Son ${n} datos con media ${m}.`, ecuacion: [x, `: ${xs.join(', ')}`, '   ·   ', xb, ` = ${m}`] },
            { tipo: 'regla', texto: `Mido cuánto se aleja cada dato de la media, elevo esas distancias al cuadrado y las promedio, dividiendo entre ${muestral ? 'n − 1 porque es una muestra' : 'N porque son todos'}.` },
            { tipo: 'cuentas', texto: `Distancias: ${desv.map(e => fm(Math.abs(e))).join(', ')}. Sus cuadrados suman ${fm(sc)}, y divido entre ${den}.`,
              ecuacion: [{ frac: [cuad.map(c => fm(c)).join(' + '), String(den)] }, ' = ', { frac: [fm(sc), String(den)] }, `${igual(bien)}${fm(bien)}`], dibujo: conCotas },
            { tipo: 'sentido', texto: `Con signo, las distancias se anulan: ${conSigno} = 0. Por eso se usan los cuadrados. La varianza sale en unidades al cuadrado.` },
          ],
          respuesta: `La varianza ${muestral ? 'muestral' : 'poblacional'} es${igual(bien) === ' = ' ? ' ' : ' ≈ '}${fm(bien)}`,
        };
      },
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

  // ---------- Laboratorio ----------
  // Más rico que los juegos: cinco datos que se mueven todos (aparece y desaparece la moda); las cuatro barras a la vez,
  // con sus ángulos de sector; y cuatro datos libres con la varianza de población y la de muestra lado a lado.
  const CINCO = [1, 2, 3, 4, 5];
  // Las modas de una lista (vacía si ningún valor se repite); las usan la lectura y los retos.
  const modasDe = xs => {
    const c = {}; xs.forEach(v => { c[v] = (c[v] || 0) + 1; });
    const max = Math.max(...Object.values(c));
    return max < 2 ? [] : Object.keys(c).filter(k => c[k] === max);
  };
  const modaDe = xs => { const ms = modasDe(xs); return ms.length ? `moda ${ms.join(' y ')}` : 'sin moda'; };
  const datosDe = (v, ks) => ks.map(k => v[`x${k}`]);
  // Ángulo de cada barra en el gráfico de sectores: lo usan la lectura y los retos.
  const angulosLab = v => { const fs = [0, 1, 2, 3].map(k => v[`f${k}`]), n = suma(fs); return fs.map(fi => 360 * fi / n); };
  const rectaCinco = v => rectaCentrales(CINCO.map(k => v[`x${k}`]), { max: 30 });
  const barrasLab = v => barras([0, 1, 2, 3].map(k => v[`f${k}`]), NOMBRES, { conF: true, ymax: 14 });
  const CUATRO = [1, 2, 3, 4];
  const rectaCuatro = v => Object.assign(rectaDispersion(CUATRO.map(k => v[`x${k}`]), { distancias: true }), { min: 0, max: 20, filas: 5 });
  const laboratorio = [
    {
      id: 'cinco-datos', titulo: 'Cinco datos que se mueven', pieza: 'recta',
      consigna: 'Arrastra los cinco datos por la recta. Junta dos para que aparezca una moda y aleja uno para ver la media.',
      controles: CINCO.map(k => ({ id: `x${k}`, etiqueta: `Dato ${k}`, color: 'c-o', min: 0, max: 30, paso: 1, inicio: [3, 5, 8, 12, 20][k - 1], decimales: 0 })),
      dibujo: v => ({ datos: rectaCinco(v), estado: {} }),
      lectura: v => { const xs = CINCO.map(k => v[`x${k}`]); return [xb, ` = ${fm(media(xs))} · `, Me, ` = ${fm(mediana(xs))} · ${modaDe(xs)}`]; },
      invitaciones: [
        { texto: 'Haz que la media y la mediana sean iguales.',
          logrado: v => { const xs = datosDe(v, CINCO); return Math.abs(media(xs) - mediana(xs)) < 1e-9; },
          bien: 'Iguales cuando los datos se reparten parejo a los dos lados del centro.' },
        { texto: 'Aleja la media más de 5 de la mediana.',
          logrado: v => { const xs = datosDe(v, CINCO); return Math.abs(media(xs) - mediana(xs)) > 5; },
          bien: 'Un dato lejano arrastra la media; la mediana casi no se entera.' },
        { texto: 'Consigue que haya dos modas a la vez.',
          logrado: v => modasDe(datosDe(v, CINCO)).length === 2,
          bien: 'Dos valores empatan en repeticiones: los datos tienen dos modas.' },
        { texto: 'Guarda dos casos con la misma mediana y medias que difieran en más de 5.',
          logrado: (v, gs) => gs.some(g => mediana(datosDe(g, CINCO)) === mediana(datosDe(v, CINCO))
            && Math.abs(media(datosDe(g, CINCO)) - media(datosDe(v, CINCO))) > 5),
          bien: 'La mediana no ve qué tan lejos están los extremos; la media sí.' },
      ],
      arrastres: CINCO.map(k => ({
        id: `dato-${k}`, etiqueta: `dato ${k}`, color: 'c-o',
        donde: v => { const d = rectaCinco(v), g = RECTA().geometria(d); return { x: g.x(v[`x${k}`]), y: g.filaY(d.elementos[k - 1].fila) }; },
        mover: (pt, v) => ({ [`x${k}`]: inversa(RECTA().geometria(rectaCinco(v)).x, 0, 30)(pt.x) }),
      })),
    },
    {
      id: 'cuatro-barras', titulo: 'Las cuatro barras y sus sectores', pieza: 'ejes',
      consigna: 'Arrastra el techo de cada barra. La lectura da el ángulo que le toca a cada una en un gráfico de sectores.',
      controles: [0, 1, 2, 3].map(k => ({ id: `f${k}`, etiqueta: `f de ${NOMBRES[k]}`, color: 'c-i', min: 1, max: 14, paso: 1, inicio: [8, 5, 3, 4][k], decimales: 0 })),
      dibujo: v => ({ datos: barrasLab(v), estado: {} }),
      lectura: v => { const n = suma([0, 1, 2, 3].map(k => v[`f${k}`])); return [`n = ${n}: ${angulosLab(v).map(a => `${fm(a, 0)}°`).join(', ')}`]; },
      invitaciones: [
        { texto: 'Haz que el ángulo de combi en la lectura sea 180°.',
          logrado: v => Math.abs(angulosLab(v)[0] - 180) < 1e-9,
          bien: 'Medio círculo es la mitad de los alumnos: combi iguala a los otros tres juntos.' },
        { texto: 'Consigue que los cuatro ángulos de la lectura midan 90°.',
          logrado: v => angulosLab(v).every(a => Math.abs(a - 90) < 1e-9),
          bien: 'Barras iguales, ángulos iguales: cada una es la cuarta parte del total.' },
        { texto: 'Haz que una barra sea el triple de otra y mira sus ángulos.',
          logrado: v => { const fs = [0, 1, 2, 3].map(k => v[`f${k}`]); return fs.some(a => fs.some(b => a === 3 * b)); },
          bien: 'El triple de alumnos da el triple de grados: el ángulo es proporcional.' },
        { texto: 'Guarda dos casos con la misma barra de combi y distinto ángulo para combi.',
          logrado: (v, gs) => gs.some(g => g.f0 === v.f0 && Math.abs(angulosLab(g)[0] - angulosLab(v)[0]) > 1e-9),
          bien: 'Mismos alumnos, otro ángulo: la tajada depende también del total.' },
      ],
      arrastres: [0, 1, 2, 3].map(k => ({
        id: `barra-${k}`, etiqueta: `techo de la barra de ${NOMBRES[k]}`, color: 'c-i',
        donde: v => { const g = EJES().geometria(barrasLab(v)); return { x: g.X(k + 1), y: g.Y(v[`f${k}`]) }; },
        mover: (pt, v) => ({ [`f${k}`]: inversa(EJES().geometria(barrasLab(v)).Y, 0, 14)(pt.y) }),
      })),
    },
    {
      id: 'poblacion-muestra', titulo: 'Varianza de población y de muestra', pieza: 'recta',
      consigna: 'Arrastra cuatro datos. Compara la varianza que divide entre N con la que divide entre n − 1.',
      controles: CUATRO.map(k => ({ id: `x${k}`, etiqueta: `Dato ${k}`, color: 'c-o', min: 0, max: 20, paso: 1, inicio: [6, 9, 11, 14][k - 1], decimales: 0 })),
      dibujo: v => ({ datos: rectaCuatro(v), estado: { corte: 1 } }),
      lectura: v => { const xs = CUATRO.map(k => v[`x${k}`]); return [xb, ` = ${fm(media(xs))} · σ² = ${fm(varianza(xs))} · s² = ${fm(varianza(xs, true))}`]; },
      invitaciones: [
        { texto: 'Haz que las dos varianzas valgan 0.',
          logrado: v => varianza(datosDe(v, CUATRO)) === 0,
          bien: 'Sin distancias a la media no hay dispersión: los datos coinciden.' },
        { texto: 'Consigue que s² valga justo 12.',
          logrado: v => Math.abs(varianza(datosDe(v, CUATRO), true) - 12) < 1e-9,
          bien: 'Los cuadrados de las distancias suman 36, y 36 ÷ 3 = 12.' },
        { texto: 'Haz que s² le gane a σ² por más de 5.',
          logrado: v => { const xs = datosDe(v, CUATRO); return varianza(xs, true) - varianza(xs) > 5; },
          bien: 'Con cuatro datos, s² siempre es 4/3 de σ². Compruébalo en la lectura.' },
        { texto: 'Guarda dos casos con la misma media y distinta varianza.',
          logrado: (v, gs) => gs.some(g => media(datosDe(g, CUATRO)) === media(datosDe(v, CUATRO))
            && Math.abs(varianza(datosDe(g, CUATRO)) - varianza(datosDe(v, CUATRO))) > 1e-9),
          bien: 'La media no dice cuánto se separan los datos; la varianza sí.' },
      ],
      arrastres: CUATRO.map(k => ({
        id: `dato-${k}`, etiqueta: `dato ${k}`, color: 'c-o',
        donde: v => { const d = rectaCuatro(v), g = RECTA().geometria(d); return { x: g.x(v[`x${k}`]), y: g.filaY(d.elementos[k - 1].fila) }; },
        mover: (pt, v) => ({ [`x${k}`]: inversa(RECTA().geometria(rectaCuatro(v)).x, 0, 20)(pt.x) }),
      })),
    },
  ];

  return {
    unidad: 'aritmetica.estadistica',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/recta.js'],
    // Glosario por tema (docs/teoria.md, 4d). «Media» (y la geométrica y la armónica) se estrenan en razones y proporciones.
    // «Muestra» va con su artículo: el verbo «muestra» sale en muchas unidades. «Continua» y «dato» no van solos:
    // en otras unidades significan otra cosa (proporción continua, el dato de un problema).
    glosario: [
      { termino: 'población', def: 'Todo el grupo de personas o cosas sobre el que se quiere saber algo.',
        ejemplo: 'Todos los alumnos del colegio.', ver: ['muestra'] },
      { termino: 'muestra', formas: ['una muestra', 'la muestra', 'muestras'],
        def: 'Parte del grupo que de verdad se observa o se pregunta, para sacar conclusiones del grupo entero.',
        ejemplo: '20 alumnos elegidos entre los 600 del colegio.', ver: ['población'] },
      { termino: 'variable cualitativa', formas: ['variable cualitativa', 'cualitativa', 'cualitativas'],
        def: 'Característica que se describe con palabras o categorías, no con números.',
        ejemplo: 'Cómo llega cada alumno: combi, a pie, bici o mototaxi.', ver: ['variable cuantitativa'] },
      { termino: 'variable cuantitativa', formas: ['variable cuantitativa', 'cuantitativa', 'cuantitativas'],
        def: 'Característica que se expresa con números: discreta si se cuenta, continua si se mide.',
        ejemplo: 'Número de hermanos (discreta); estatura en centímetros (continua).', ver: ['variable cualitativa'] },
      { termino: 'frecuencia', simbolo: 'f', def: 'Cuántas veces aparece un valor o una categoría entre los datos.',
        ejemplo: 'Si 5 alumnos tienen 2 hermanos, la frecuencia de x = 2 es 5.', ver: ['frecuencia relativa', 'frecuencia acumulada'] },
      { termino: 'frecuencia relativa', simbolo: 'h', def: 'Qué parte del total tiene un valor: sus apariciones entre el número de datos. Todas suman 1.',
        ejemplo: '5 de 20 alumnos: h = 5 ÷ 20 = 0,25.', ver: ['frecuencia'] },
      { termino: 'frecuencia acumulada', simbolo: 'F', def: 'Cuántos datos hay hasta un valor, incluido: se suman las cuentas de ese valor y de los anteriores.',
        ejemplo: '3, 6 y 5 alumnos con 0, 1 y 2 hermanos: hasta 2 hay 14.', ver: ['frecuencia'] },
      { termino: 'histograma', def: 'Gráfico de barras pegadas para datos medidos y agrupados en intervalos; cada barra cubre su intervalo.',
        ejemplo: 'Estaturas de 150 a 155 cm, de 155 a 160 cm…: barras juntas.', ver: ['frecuencia'] },
      { termino: 'gráfico de sectores', formas: ['gráfico de sectores', 'gráficos de sectores', 'sectores'],
        def: 'Círculo partido en tajadas: cada categoría toma de los 360° la misma parte que tiene del total.',
        ejemplo: '5 de 20 alumnos van a pie: 0,25 · 360° = 90°.', ver: ['frecuencia relativa'] },
      { termino: 'mediana', simbolo: 'Me', def: 'El dato del centro con los datos ordenados; si son una cantidad par, el promedio de los dos centrales.',
        ejemplo: 'En 2, 4, 4, 9 y 90 es 4, aunque el 90 esté lejos.', ver: ['moda', 'cuartil'] },
      { termino: 'moda', def: 'El valor que más se repite entre los datos. Puede haber varias o ninguna.',
        ejemplo: 'En 2, 4, 4 y 9 es 4.', ver: ['mediana'] },
      { termino: 'media ponderada', formas: ['media ponderada', 'promedio ponderado'],
        def: 'Promedio en que cada dato cuenta según su peso: suma de dato por peso, entre la suma de pesos.',
        ejemplo: '12 con 1 crédito y 18 con 3: (12 + 54) ÷ 4 = 16,5.', ver: ['mediana'] },
      { termino: 'cuartil', simbolo: 'Q', def: 'Cada uno de los tres valores que parten los datos ordenados en cuatro grupos con igual cantidad.',
        ejemplo: 'Con 7 datos ordenados, Q1 es el 2.º, Q2 el 4.º y Q3 el 6.º.', ver: ['mediana', 'percentil'] },
      { termino: 'percentil', def: 'Valor que deja por debajo un porcentaje dado de los datos ordenados.',
        ejemplo: 'El percentil 90 deja debajo el 90 % de los datos.', ver: ['cuartil'] },
      { termino: 'dispersión', def: 'Cuánto se separan los datos entre sí o de su centro.', ver: ['varianza', 'desviación estándar'] },
      { termino: 'varianza', simbolo: 'σ²', def: 'Promedio de los cuadrados de las distancias de cada dato a la media: mide cuánto se separan.',
        ejemplo: 'Datos 2, 4 y 9, media 5: (9 + 1 + 16) ÷ 3 ≈ 8,67.', ver: ['desviación estándar', 'dispersión'] },
      { termino: 'desviación estándar', simbolo: 'σ', def: 'Raíz cuadrada de la varianza: cuánto se aleja un dato típico de la media, en sus mismas unidades.',
        ejemplo: 'Con varianza 8,67: σ = √8,67 ≈ 2,94.', ver: ['varianza', 'coeficiente de variación'] },
      { termino: 'coeficiente de variación', simbolo: 'CV', formas: ['coeficiente de variación', 'CV'],
        def: 'Desviación estándar entre la media: compara cuánto se separan datos de tamaños distintos.',
        ejemplo: 'σ = 2,94 y media 5: 2,94 ÷ 5 ≈ 0,59.', ver: ['desviación estándar'] },
    ],
    laboratorio,
    historia: {
      texto: 'Londres ya anotaba nacimientos y entierros cuando John Graunt los estudió en 1662. Convirtió listas administrativas en preguntas sobre una población: cuántos morían de cada causa, si nacían más varones. Lo que se podía concluir dependía de cómo se habían anotado los datos, como hoy. Esta unidad sigue esa pregunta: qué resumen elegir y qué se pierde al reducir muchos datos a un número.',
      pregunta: '¿Qué se pierde cuando todo un salón se resume en un promedio?',
      fuente: { titulo: 'John Graunt, Natural and political observations… (1662) — Wellcome Collection', url: 'https://wellcomecollection.org/works/sds578rr' },
    },
    ideas: [tabla, graficos, centrales, ponderada, cuartiles, dispersion],
  };
});
