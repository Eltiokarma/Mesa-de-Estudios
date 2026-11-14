/*
 * Teoría de «Textos discontinuos e infografías» (razonamiento-verbal.textos-discontinuos). Molde: docs/teoria.md.
 * Contenido: matriz de verbal (unidad 11), historia (Nightingale y Martineau, 1859) y códigos RV34, RV45–RV48.
 * Datos inventados para el ejercicio (se dice al pie). Ruta C · Comparar.
 * Regla 1: todo porcentaje, diferencia y razón que se ve se calcula aquí; «Ahora tú» genera los datos con semilla.
 *
 * Ficha de tarea:
 *   Promesa: leer una tabla o un gráfico por su total, su escala y su leyenda, y unirlos con el texto que los acompaña.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; textos discontinuos (UNI 13, UNMSM 1, 9 y 15).
 *   Resultado observable: marca los elementos exactos que respaldan una comparación y calcula cuando corresponde.
 *   Orden de atención: 1.º el título y la escala · 2.º la fila o barra marcada · 3.º el cálculo · acción: cambiar.
 *   Estados: dato leído (i) · comparación engañosa (h) · escala que no empieza en cero (corte rojo).
 *   Duda que resuelve: ¿por qué el colegio con más aprobados no es el que mejor aprobó?
 *
 * Colores (regla 4): el dato que respalda i (turquesa), la afirmación o el valor que se prueba o (naranja), el total o
 * la escala d (verde), lo que engaña h (rojo).
 * Códigos: RV34, RV45 (fila o barra vecina), RV46 (absoluto contra relativo), RV47 (junto no es causa), RV48 (título
 * en vez de datos); RVG1 (largo de barra con escala truncada) es hipótesis nueva.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const corto = (fn, t) => {
    if (t.length <= 26) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 24) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 18) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const dato = t => ({ v: 'c-i', t }), prueba = t => ({ v: 'c-o', t }), total = t => ({ v: 'c-d', t }), engana = t => ({ v: 'c-h', t });
  const f = (n, d = 0) => Kit.formatear(n, d);
  const pct = (a, b) => (100 * a) / b;
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    return r;
  }
  // Opciones sin repetidos: la correcta primero; un distractor que coincide en texto se descarta.
  function opciones(correcta, malas) {
    const vistos = new Set([correcta]);
    const out = [{ id: 'c', texto: correcta, correcta: true }];
    for (const [texto, error, siFuera] of malas) { if (vistos.has(texto)) continue; vistos.add(texto); out.push({ id: `e${out.length}`, texto, error, siFuera }); }
    return out;
  }

  // ---------- Idea 1: la tabla, su fila y su total ----------
  // Cambia: la fila que se mira y si se mira la cantidad o la proporción. Permanece: la tabla de tres colegios.
  // Progresa: el porcentaje calculado de cada fila. Se reserva: «¿cuál aprobó mejor?» (predicción).
  // Debe verse: que B tiene más aprobados y C la mayor proporción.
  const COLE = [{ id: 'A', ap: 20, tot: 40 }, { id: 'B', ap: 30, tot: 100 }, { id: 'C', ap: 18, tot: 30 }];
  const tabla = (filas, titulo = 'Aprobados por colegio') => ({ secciones: [{ id: 't', titulo, modo: 'lista', fragmentos: filas.map(c => ({ id: c.id, t: `Colegio ${c.id}: ${f(c.ap)} aprobados de ${f(c.tot)} alumnos` })) }] });
  const mejor = filas => filas.reduce((m, c) => (pct(c.ap, c.tot) > pct(m.ap, m.tot) ? c : m));
  const masAprob = filas => filas.reduce((m, c) => (c.ap > m.ap ? c : m));
  const tablaIdea = {
    id: 'tabla',
    titulo: 'Cada dato con su total',
    temas: ['Tablas y cuadros'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Elige un colegio de la tabla y mira su cantidad de aprobados o su proporción sobre el total de alumnos.',
      voz: 'Una cantidad sola no dice si es mucho o poco.',
      controles: [
        { id: 'c', etiqueta: 'Colegio', opciones: COLE.map(c => ({ valor: c.id, texto: c.id })) },
        { id: 'm', etiqueta: 'Mirar', opciones: [{ valor: 'n', texto: 'cantidad' }, { valor: 'p', texto: 'proporción' }] },
      ],
      dibujo: val => { const c = COLE.find(x => x.id === val.c); return { datos: tabla(COLE), estado: { marcas: { [c.id]: val.m === 'p' ? 'd' : 'i' }, sellos: { t: { t: val.m === 'p' ? `${f(pct(c.ap, c.tot))} %` : `${f(c.ap)} aprobados`, c: val.m === 'p' ? 'd' : 'i' } } } }; },
      lectura: val => { const c = COLE.find(x => x.id === val.c); return val.m === 'p' ? [dato(`${f(c.ap)}`), ' de ', total(`${f(c.tot)}`), ` = ${f(pct(c.ap, c.tot))} %`] : [dato(`${f(c.ap)} aprobados`), ' (sin el total)']; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Según la tabla, ¿qué colegio tuvo la mayor proporción de aprobados?',
      voz: 'Compara cada fila con su propio total.',
      opciones: opciones(`Colegio ${mejor(COLE).id}`, [
        [`Colegio ${masAprob(COLE).id}`, 'RV46', `Tiene más aprobados (${f(masAprob(COLE).ap)}), pero de ${f(masAprob(COLE).tot)}: su proporción es menor.`],
        ['Colegio A', 'RV45', `A aprobó el ${f(pct(20, 40))} %; otro colegio lo supera.`],
        ['No se puede saber', 'RV34', 'Se puede: cada fila trae los aprobados y su total.'],
      ]),
      dibujo: { datos: tabla(COLE), estado: {} },
      revelar: { datos: tabla(COLE), estado: { marcas: Object.fromEntries(COLE.map(c => [c.id, c === mejor(COLE) ? 'i' : 'd'])), sellos: { t: { t: COLE.map(c => `${c.id} ${f(pct(c.ap, c.tot))} %`).join(' · '), c: 'i' } } } },
      coincide: `Coincide: ${mejor(COLE).id} aprobó el ${f(pct(mejor(COLE).ap, mejor(COLE).tot))} % de sus alumnos.`,
    },
    mira: {
      datos: tabla(COLE),
      pasos: [
        { estado: { marcas: { B: 'h' }, sellos: { t: { t: 'B: 30 aprobados', c: 'h' } } }, texto: 'B tiene más aprobados: 30. Pero tiene 100 alumnos.', ecuacion: [engana('30'), ' es más, pero de ', total('100')] },
        { estado: { marcas: { A: 'd', B: 'd', C: 'd' }, sellos: { t: { t: 'A 50 % · B 30 % · C 60 %', c: 'd' } }, nuevo: ['A', 'B', 'C'] }, texto: 'Cada fila se divide entre su propio total.', ecuacion: [{ frac: [dato('aprobados'), total('total')] }, ' × 100'] },
        { estado: { marcas: { C: 'i' }, sellos: { t: { t: `C: ${f(pct(18, 30))} %`, c: 'i' } }, nuevo: ['C'] }, texto: `C aprobó 18 de 30: el ${f(pct(18, 30))} %, la mayor proporción.`, ecuacion: [{ frac: [dato('18'), total('30')] }, ` = ${f(pct(18, 30))} %`] },
      ],
    },
    regla: {
      texto: 'En una tabla, cada dato es el cruce de una fila y una columna. Para comparar grupos de distinto tamaño, se compara la proporción: cada cantidad entre su propio total.',
      ecuacion: ['proporción = ', { frac: [dato('parte'), total('total de su fila')] }],
      condicion: 'los totales son distintos; si fueran iguales, comparar cantidades daría lo mismo.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        // Tres grupos: el de más aprobados no es el de mayor proporción (se reintenta hasta que pase).
        let filas;
        for (let k = 0; k < 50; k++) {
          filas = ['A', 'B', 'C'].map(id => { const tot = [20, 25, 40, 50, 80, 100][r.ent(0, 5)]; return { id, tot, ap: r.ent(Math.ceil(tot * 0.2), Math.floor(tot * 0.9)) }; });
          const m = mejor(filas), n = masAprob(filas), ps = filas.map(c => pct(c.ap, c.tot));
          if (m !== n && new Set(ps.map(p => p.toFixed(3))).size === 3 && filas.filter(c => c.ap === n.ap).length === 1) break;
        }
        const m = mejor(filas), n = masAprob(filas), otro = filas.find(c => c !== m && c !== n);
        return {
          pregunta: '¿Qué grupo tuvo la mayor proporción de aprobados?',
          dibujo: { datos: tabla(filas, 'Aprobados por grupo'), estado: {} },
          opciones: opciones(`Grupo ${m.id}`, [
            [`Grupo ${n.id}`, 'RV46', `Tiene más aprobados, pero su proporción es ${f(pct(n.ap, n.tot))} %.`],
            [`Grupo ${otro.id}`, 'RV45', `Su proporción es ${f(pct(otro.ap, otro.tot))} %: no es la mayor.`],
            ['No se puede saber', 'RV34', 'Se puede: cada fila trae su total.'],
          ]),
          solucion: { texto: `Se divide cada fila entre su total: ${m.id} tiene ${f(pct(m.ap, m.tot))} %.`, ecuacion: [{ frac: [dato(f(m.ap)), total(f(m.tot))] }, ` = ${f(pct(m.ap, m.tot))} %`], dibujo: { datos: tabla(filas, 'Aprobados por grupo'), estado: { marcas: { [m.id]: 'i' }, sellos: { t: { t: filas.map(c => `${c.id} ${f(pct(c.ap, c.tot))} %`).join(' · '), c: 'i' } } } } },
        };
      },
    },
  };

  // ---------- Idea 2: la escala del gráfico ----------
  // Cambia: dónde empieza el eje. Permanece: los datos (82 t y 88 t). Progresa: cuánto más larga «se ve» la barra.
  // Se reserva: leer un gráfico ya truncado (predicción). Debe verse: el corte rojo del eje y la razón calculada.
  const FER = { titulo: 'Venta de quinua en 2025', barras: [{ id: 'p', nombre: 'Puno', valor: 82 }, { id: 'j', nombre: 'Juliaca', valor: 88 }], max: 90, unidad: ' t', fuente: 'Datos inventados' };
  const grafico = min => Object.assign({}, FER, { min });
  const seVe = (a, b, min) => (b - min) / (a - min);
  const escala = {
    id: 'escala',
    titulo: 'La escala cambia la imagen',
    temas: ['Gráficos'],
    pieza: 'rv-barras',
    juega: {
      consigna: 'Cambia dónde empieza el eje del gráfico. Los datos no cambian; mira cuánto más larga se ve la barra de Juliaca.',
      voz: 'Mira primero el número donde empieza el eje.',
      controles: [{ id: 'min', etiqueta: 'El eje empieza en', opciones: [{ valor: 0, texto: '0 t' }, { valor: 60, texto: '60 t' }, { valor: 80, texto: '80 t' }] }],
      dibujo: val => ({ datos: grafico(val.min), estado: { marcas: { j: 'o' } } }),
      lectura: val => ['Se ve ', engana(`${f(seVe(82, 88, val.min), 1)} veces`), ' · es ', dato(`${f(pct(88 - 82, 82), 1)} %`), ' más'],
      minimo: 3,
    },
    predice: {
      pregunta: 'En este gráfico, ¿cuánto más vendió la feria B que la feria A?',
      voz: 'Antes de comparar largos, mira dónde empieza el eje.',
      opciones: opciones(`Cerca de ${f(pct(95 - 90, 90))} % más`, [
        [`Unas ${f(seVe(90, 95, 88))} veces más`, 'RVG1', 'Es lo que parece por el largo, pero el eje empieza en 88: las barras exageran.'],
        ['El doble', 'RVG1', 'La barra de B se ve mucho más larga solo porque el eje no empieza en cero.'],
        ['No se puede saber sin el texto', 'RV34', 'Los valores están escritos junto a cada barra: se puede calcular.'],
      ]),
      dibujo: { datos: { titulo: 'Ventas de dos ferias', barras: [{ id: 'a', nombre: 'Feria A', valor: 90 }, { id: 'b', nombre: 'Feria B', valor: 95 }], min: 88, max: 96, unidad: ' t', fuente: 'Datos inventados' }, estado: {} },
      revelar: { datos: { titulo: 'Ventas de dos ferias', barras: [{ id: 'a', nombre: 'Feria A', valor: 90 }, { id: 'b', nombre: 'Feria B', valor: 95 }], min: 0, max: 96, unidad: ' t', fuente: 'Datos inventados' }, estado: { marcas: { a: 'i', b: 'i' } } },
      coincide: `Coincide: 5 t más sobre 90 t es cerca del ${f(pct(5, 90))} %; con el eje en cero se ve.`,
    },
    mira: {
      datos: grafico(80),
      pasos: [
        { estado: { marcas: { j: 'h', p: 'h' } }, texto: `Con el eje en 80, Juliaca se ve ${f(seVe(82, 88, 80))} veces más larga.`, ecuacion: [engana('88 − 80'), ' frente a ', engana('82 − 80')] },
        { estado: { marcas: { j: 'o', p: 'i' } }, texto: 'Los valores escritos son 88 t y 82 t: la diferencia es 6 t.', ecuacion: [prueba('88'), ' − ', dato('82'), ' = 6 t'] },
        { estado: { marcas: { j: 'o', p: 'i' } }, texto: `6 t sobre 82 t es solo un ${f(pct(6, 82), 1)} % más.`, ecuacion: [{ frac: ['6', dato('82')] }, ` × 100 = ${f(pct(6, 82), 1)} %`] },
      ],
    },
    regla: {
      texto: 'En un gráfico de barras, el largo es fiel al dato solo si el eje empieza en cero. Si no, se comparan los valores escritos, no los largos.',
      ecuacion: ['cuánto más = ', { frac: [[prueba('B'), ' − ', dato('A')], dato('A')] }, ' × 100'],
      condicion: 'se mira primero el número donde empieza el eje; un corte en el eje avisa que no es cero.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), a = r.ent(40, 90), b = a + r.ent(2, 8), min = a - r.ent(2, 5);
        const real = pct(b - a, a), parece = seVe(a, b, min);
        return {
          pregunta: '¿Cuánto más es el valor de B que el de A?',
          dibujo: { datos: { titulo: 'Asistentes a dos talleres', barras: [{ id: 'a', nombre: 'Taller A', valor: a }, { id: 'b', nombre: 'Taller B', valor: b }], min, max: b + 2, unidad: '', fuente: 'Datos inventados' }, estado: {} },
          opciones: opciones(`Cerca de ${f(real)} % más`, [
            [`Unas ${f(parece, 1)} veces más`, 'RVG1', 'Es lo que parece por el largo; el eje no empieza en cero.'],
            [`${f(b - a)} % más`, 'RV46', `${f(b - a)} es la diferencia en asistentes, no en porcentaje.`],
            ['No se puede saber', 'RV34', 'Los valores están escritos: se puede calcular.'],
          ]),
          solucion: { texto: `Se usan los valores escritos: ${f(b - a)} sobre ${f(a)}.`, ecuacion: [{ frac: [`${f(b)} − ${f(a)}`, dato(f(a))] }, ` × 100 ≈ ${f(real)} %`], dibujo: { datos: { titulo: 'Asistentes a dos talleres', barras: [{ id: 'a', nombre: 'Taller A', valor: a }, { id: 'b', nombre: 'Taller B', valor: b }], min: 0, max: b + 2, unidad: '', fuente: 'Datos inventados' }, estado: { marcas: { a: 'i', b: 'o' } } } },
        };
      },
    },
  };

  // ---------- Idea 3: texto y gráfico juntos (textos mixtos e infografías) ----------
  // Cambia: la afirmación que se pone a prueba. Permanece: la infografía (título, texto y barras de dos años).
  // Progresa: qué parte la respalda: el gráfico, el texto, los dos, o ninguno. Se reserva: calcular un crecimiento
  // (predicción). Debe verse: que aparecer juntos (precio y ventas) no prueba que uno cause lo otro.
  const INFO = {
    titulo: 'Ferias de quinua: 2024 y 2025',
    texto: 'En 2025 subió el precio de la quinua. Las dos ferias vendieron más que el año anterior.',
    barras: [{ id: 'p24', nombre: 'Puno 24', valor: 70 }, { id: 'p25', nombre: 'Puno 25', valor: 82 }, { id: 'j24', nombre: 'Juliaca 24', valor: 75 }, { id: 'j25', nombre: 'Juliaca 25', valor: 88 }],
    min: 0, max: 100, unidad: ' t', fuente: 'Datos inventados',
  };
  const AFIRMA = {
    juliaca: { texto: 'Juliaca vendió más en 2025', estado: { marcas: { j25: 'i', p25: 'd' } }, dice: 'Lo respalda el gráfico: 88 > 82', ok: true },
    ambas: { texto: 'Las dos ferias crecieron', estado: { texto: 'i', marcas: { p24: 'd', p25: 'i', j24: 'd', j25: 'i' } }, dice: 'Lo respaldan el texto y el gráfico', ok: true },
    precio: { texto: 'El precio hizo subir las ventas', estado: { texto: 'h', titulo: 'h' }, dice: 'No: solo aparecen juntos, no dice la causa', ok: false },
  };
  const mixtos = {
    id: 'texto-y-grafico',
    titulo: 'Texto y gráfico se leen juntos',
    temas: ['Textos mixtos', 'Infografías'],
    pieza: 'rv-barras',
    juega: {
      consigna: 'Pon a prueba cada afirmación con la infografía. Mira qué parte la respalda: el texto, el gráfico, los dos o ninguno.',
      voz: 'Que dos cosas aparezcan juntas no dice que una cause la otra.',
      controles: [{ id: 'a', etiqueta: 'Afirmación', opciones: Object.entries(AFIRMA).map(([valor, x]) => ({ valor, texto: x.texto })) }],
      dibujo: val => ({ datos: INFO, estado: AFIRMA[val.a].estado }),
      lectura: val => [corto(AFIRMA[val.a].ok ? dato : engana, AFIRMA[val.a].dice)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Según la infografía, ¿cuántas toneladas más vendió Juliaca en 2025 que en 2024?',
      opciones: opciones(`${f(88 - 75)} toneladas`, [
        [`${f(88)} toneladas`, 'RV45', '88 t es lo que vendió en 2025; falta restar lo de 2024.'],
        [`${f(88 - 82)} toneladas`, 'RV45', 'Eso compara Juliaca con Puno en 2025, no Juliaca en dos años.'],
        ['El texto no lo dice', 'RV48', 'El texto no da cifras, pero el gráfico sí: hay que leer los dos.'],
      ]),
      dibujo: { datos: INFO, estado: {} },
      revelar: { datos: INFO, estado: { marcas: { j24: 'd', j25: 'i' } } },
      coincide: `Coincide: 88 − 75 = ${f(88 - 75)} t, leído en las dos barras de Juliaca.`,
    },
    mira: {
      datos: INFO,
      pasos: [
        { estado: { titulo: 'd' }, texto: 'El título dice qué y cuándo: ferias de quinua, dos años.', ecuacion: [total('título'), ' = qué + cuándo'] },
        { estado: { titulo: 'd', texto: 'i' }, texto: 'El texto da hechos sin cifras: subió el precio y crecieron las ventas.', ecuacion: [dato('texto'), ' = hechos'] },
        { estado: { marcas: { p24: 'd', p25: 'i', j24: 'd', j25: 'i' } }, texto: 'El gráfico da las cifras: Puno +12 t y Juliaca +13 t.', ecuacion: [dato('82 − 70'), ' · ', dato('88 − 75')] },
        { estado: { texto: 'h' }, texto: 'Precio y ventas suben juntos, pero nada dice que uno cause lo otro.', ecuacion: [engana('juntos'), ' ≠ ', engana('causa')] },
      ],
    },
    regla: {
      texto: 'En un texto mixto o una infografía, texto, título y gráfico se completan: cada afirmación se respalda con la parte que la dice o con ambas.',
      ecuacion: [total('título'), ' + ', dato('texto'), ' + ', dato('gráfico'), ' → respaldo'],
      condicion: 'se responde con los datos y no solo con el título; dos datos que suben juntos no prueban una causa.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), ciudades = [['Ilave', 'Ayaviri'], ['Lampa', 'Azángaro'], ['Juli', 'Huancané']][s % 3];
        const a1 = r.ent(40, 70), a2 = a1 + r.ent(5, 15), b1 = r.ent(40, 70), b2 = b1 + r.ent(5, 15);
        const cual = s % 2, [x1, x2, nom] = cual ? [b1, b2, ciudades[1]] : [a1, a2, ciudades[0]];
        const otro = cual ? a2 : b2;
        const datos = { titulo: `Venta de lana: ${ciudades[0]} y ${ciudades[1]}`, texto: 'En 2025 hubo más ferias en la región. Las dos ciudades vendieron más lana que en 2024.', barras: [{ id: 'a1', nombre: `${ciudades[0]} 24`, valor: a1 }, { id: 'a2', nombre: `${ciudades[0]} 25`, valor: a2 }, { id: 'b1', nombre: `${ciudades[1]} 24`, valor: b1 }, { id: 'b2', nombre: `${ciudades[1]} 25`, valor: b2 }], min: 0, max: 90, unidad: ' t', fuente: 'Datos inventados' };
        return {
          pregunta: `¿Cuántas toneladas más vendió ${nom} en 2025 que en 2024?`,
          dibujo: { datos, estado: {} },
          opciones: opciones(`${f(x2 - x1)} toneladas`, [
            [`${f(x2)} toneladas`, 'RV45', `${f(x2)} t es lo de 2025; falta restar lo de 2024.`],
            [`${f(Math.abs(x2 - otro))} toneladas`, 'RV45', 'Eso compara las dos ciudades en 2025.'],
            ['El texto no lo dice', 'RV48', 'Las cifras están en el gráfico.'],
          ]),
          solucion: { texto: `Se leen las dos barras de ${nom} y se restan.`, ecuacion: [prueba(f(x2)), ' − ', dato(f(x1)), ` = ${f(x2 - x1)} t`], dibujo: { datos, estado: { marcas: cual ? { b1: 'd', b2: 'i' } : { a1: 'd', a2: 'i' } } } },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-verbal.textos-discontinuos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js', '/nucleo/kit/piezas/rv-barras.js'],
    historia: {
      texto: 'En 1859, Florence Nightingale y Harriet Martineau publicaron un informe que unía texto y gráficos sobre la salud de los soldados británicos en la guerra de Crimea. Sus diagramas separaban las causas de muerte para que el público entendiera los datos. Leerlos exigía mirar a la vez categorías, convenciones y explicaciones.',
      pregunta: '¿Qué miras primero en un gráfico?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Nightingale y Martineau, 1859)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/comprensionlectora.htm' },
    },
    ideas: [tablaIdea, escala, mixtos],
  };
});
