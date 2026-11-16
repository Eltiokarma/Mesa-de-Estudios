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
    // El trozo de color no se parte: con 14 letras o menos cabe en la miniatura de un caso guardado del laboratorio.
    if (t.length <= 14) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 14) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 14) n++;
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

  // Gesto directo (docs/teoria.md §4b). En la tabla, el marcador se arrastra de fila en fila (rv-texto.ancla y
  // cercana). En el gráfico, se agarra la punta de una barra: rv-barras.extremo da dónde está y valorEn, la inversa
  // de la escala, convierte la x del dedo en el valor que quedaría ahí.
  const RV = () => Kit.piezas['rv-texto'], RB = () => Kit.piezas['rv-barras'];
  // Si la barra de valor v debe terminar en x (los datos fijos), el eje tiene que empezar en m: v − m = r (max − m),
  // con r la fracción del ancho que ocupa; se despeja m = (v − r·max) / (1 − r).
  const minPara = (d, v, x) => {
    const L = RB().disponer(d), r = (x - L.x0) / (L.x1 - L.x0);
    return r >= 0.999 ? d.max : (v - r * d.max) / (1 - r);
  };
  // La manija va 10 px dentro de la punta, para no tapar la cifra escrita al lado; mover lo compensa.
  const DENTRO = 10;
  const punta = (d, id) => { const p = RB().extremo(d, id); return { x: p.x - DENTRO, y: p.y }; };
  const masCercano = (lista, v) => lista.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));

  // ---------- Idea 1: la tabla, su fila y su total ----------
  // Cambia: la fila que se mira y si se mira la cantidad o la proporción. Permanece: la tabla de tres colegios.
  // Progresa: el porcentaje calculado de cada fila. Se reserva: «¿cuál aprobó mejor?» (predicción).
  // Debe verse: que B tiene más aprobados y C la mayor proporción.
  const COLE = [{ id: 'A', ap: 20, tot: 40 }, { id: 'B', ap: 30, tot: 100 }, { id: 'C', ap: 18, tot: 30 }];
  // El sello va en una tarjeta debajo de la tabla: en la cabecera lo taparía el botón de la lupa.
  const tabla = (filas, titulo = 'Aprobados por colegio') => ({ secciones: [
    { id: 't', titulo, modo: 'lista', fragmentos: filas.map(c => ({ id: c.id, t: `Colegio ${c.id}: ${f(c.ap)} aprobados de ${f(c.tot)} alumnos` })) },
    { id: 'r', titulo: 'Lo que miras', modo: 'tarjeta', fragmentos: [] },
  ] });
  const mejor = filas => filas.reduce((m, c) => (pct(c.ap, c.tot) > pct(m.ap, m.tot) ? c : m));
  const masAprob = filas => filas.reduce((m, c) => (c.ap > m.ap ? c : m));
  // «Así se resuelve»: las mismas cuentas de «Ahora tú» (pct, mejor, masAprob), otras semillas y otras tablas de la región.
  const CTX_TABLA = [
    { titulo: 'Vacunados por barrio', fila: 'Barrio', el: 'el', parte: 'vacunados', todo: 'vecinos' },
    { titulo: 'Asistencia por taller', fila: 'Taller', el: 'el', parte: 'asistentes', todo: 'inscritos' },
    { titulo: 'Aprobados por sección', fila: 'Sección', el: 'la', parte: 'aprobados', todo: 'alumnos' },
    { titulo: 'Votos por comité', fila: 'Comité', el: 'el', parte: 'votantes', todo: 'socios' },
  ];
  const tablaRes = (filas, x) => ({ secciones: [
    { id: 't', titulo: x.titulo, modo: 'lista', fragmentos: filas.map(c => ({ id: c.id, t: `${x.fila} ${c.id}: ${f(c.ap)} ${x.parte} de ${f(c.tot)} ${x.todo}` })) },
    { id: 'r', titulo: 'Lo que miras', modo: 'tarjeta', fragmentos: [] },
  ] });
  const tablaIdea = {
    id: 'tabla',
    titulo: 'Cada dato con su total',
    temas: ['Tablas y cuadros'],
    pieza: 'rv-texto',
    // Lee (fase 2): dónde se ven tablas y cómo se recorren, sin decir con qué se compara cada colegio.
    lee: {
      tarjetas: [
        { titulo: 'Tablas de todos los días', texto: 'El horario de las combis en el paradero, la lista de precios del mercado y la libreta de notas son tablas. No se leen de corrido: se busca la fila y la columna que interesan.' },
        { titulo: 'Fila, columna y total', texto: 'Cada fila es un caso, como un colegio, y cada columna, un tipo de dato. El total de una fila cuenta a todos los de ese caso: en un colegio, aprobados y desaprobados juntos.' },
        { titulo: 'Qué mirar al jugar', texto: 'Verás tres colegios. Elige uno y alterna entre «cantidad» y «proporción». Después pasa a otro colegio y fíjate qué colegio queda arriba en cada forma de mirar.' },
      ],
    },
    juega: {
      consigna: 'Elige un colegio de la tabla y mira su cantidad de aprobados o su proporción sobre el total de alumnos.',
      voz: 'Una cantidad sola no dice si es mucho o poco.',
      controles: [
        { id: 'c', etiqueta: 'Colegio', opciones: COLE.map(c => ({ valor: c.id, texto: c.id })) },
        { id: 'm', etiqueta: 'Mirar', opciones: [{ valor: 'n', texto: 'cantidad' }, { valor: 'p', texto: 'proporción' }] },
      ],
      dibujo: val => { const c = COLE.find(x => x.id === val.c); return { datos: tabla(COLE), estado: { marcas: { [c.id]: val.m === 'p' ? 'd' : 'i' }, sellos: { r: { t: val.m === 'p' ? `${f(pct(c.ap, c.tot))} %` : `${f(c.ap)} aprobados`, c: val.m === 'p' ? 'd' : 'i' } } } }; },
      lectura: val => { const c = COLE.find(x => x.id === val.c); return val.m === 'p' ? [dato(`${f(c.ap)}`), ' de ', total(`${f(c.tot)}`), ` = ${f(pct(c.ap, c.tot))} %`] : [dato(`${f(c.ap)} aprobados`), ' (sin el total)']; },
      minimo: 4,
      // Arrastra el marcador por las filas de la tabla.
      arrastres: [{ id: 'fila', etiqueta: 'fila de la tabla', color: 'c-i', donde: val => RV().ancla(tabla(COLE), val.c), mover: (pt) => ({ c: RV().cercana(tabla(COLE), pt, COLE.map(c => c.id)) }) }],
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
      revelar: { datos: tabla(COLE), estado: { marcas: Object.fromEntries(COLE.map(c => [c.id, c === mejor(COLE) ? 'i' : 'd'])), sellos: { r: { t: COLE.map(c => `${c.id} ${f(pct(c.ap, c.tot))} %`).join(' · '), c: 'i' } } } },
      coincide: `Coincide: ${mejor(COLE).id} aprobó el ${f(pct(mejor(COLE).ap, mejor(COLE).tot))} % de sus alumnos.`,
    },
    mira: {
      datos: tabla(COLE),
      pasos: [
        { estado: { marcas: { B: 'h' }, sellos: { r: { t: 'B: 30 aprobados', c: 'h' } } }, texto: 'B tiene más aprobados: 30. Pero tiene 100 alumnos.', ecuacion: [engana('30'), ' es más, pero de ', total('100')] },
        { estado: { marcas: { A: 'd', B: 'd', C: 'd' }, sellos: { r: { t: 'A 50 % · B 30 % · C 60 %', c: 'd' } }, nuevo: ['A', 'B', 'C'] }, texto: 'Cada fila se divide entre su propio total.', ecuacion: [{ frac: [dato('aprobados'), total('total')] }, ' × 100'] },
        { estado: { marcas: { C: 'i' }, sellos: { r: { t: `C: ${f(pct(18, 30))} %`, c: 'i' } }, nuevo: ['C'] }, texto: `C aprobó 18 de 30: el ${f(pct(18, 30))} %, la mayor proporción.`, ecuacion: [{ frac: [dato('18'), total('30')] }, ` = ${f(pct(18, 30))} %`] },
      ],
    },
    regla: {
      texto: 'En una tabla, cada dato es el cruce de una fila y una columna. Para comparar grupos de distinto tamaño, se compara la proporción: cada cantidad entre su propio total.',
      ecuacion: ['proporción = ', { frac: [{ llave: [dato('parte')], nota: 'lo que cuentas', color: 'c-i', arriba: true }, { llave: [total('total de su fila')], nota: 'su propio total', color: 'c-d' }] }],
      condicion: 'los totales son distintos; si fueran iguales, comparar cantidades daría lo mismo.',
    },
    // Así se resuelve (fase 2): el mismo problema de «Ahora tú», con azar(s + 900) y las mismas cuentas.
    resuelve: {
      pieza: 'rv-texto',
      generar(s) {
        const r = azar(s + 900), x = CTX_TABLA[r.ent(0, CTX_TABLA.length - 1)];
        // Como en «Ahora tú»: el de más cantidad no es el de mayor proporción; además, los porcentajes redondeados difieren.
        let filas;
        for (let k = 0; k < 80; k++) {
          filas = ['A', 'B', 'C'].map(id => { const tot = [20, 25, 40, 50, 80, 100][r.ent(0, 5)]; return { id, tot, ap: r.ent(Math.ceil(tot * 0.2), Math.floor(tot * 0.9)) }; });
          const m = mejor(filas), n = masAprob(filas), ps = filas.map(c => Math.round(pct(c.ap, c.tot)));
          if (m !== n && new Set(ps).size === 3 && filas.filter(c => c.ap === n.ap).length === 1) break;
        }
        const m = mejor(filas), n = masAprob(filas), P = c => f(pct(c.ap, c.tot));
        const fig = estado => ({ datos: tablaRes(filas, x), estado });
        const nombre = c => `${x.fila} ${c.id}`;
        return {
          enunciado: `Mira la tabla «${x.titulo}». ¿Qué ${x.fila.toLowerCase()} tuvo la mayor proporción de ${x.parte}?`,
          dibujo: fig({}),
          pasos: [
            { tipo: 'pide', texto: `Piden ${x.el} ${x.fila.toLowerCase()} con la mayor proporción de ${x.parte}, no ${x.el} que tiene más ${x.parte}.` },
            { tipo: 'datos', texto: `Cada fila trae los ${x.parte} y su total de ${x.todo}. Los totales son distintos: ${filas.map(c => f(c.tot)).join(', ')}.`,
              dibujo: fig({ marcas: Object.fromEntries(filas.map(c => [c.id, 'd'])) }) },
            { tipo: 'regla', texto: 'Si los grupos tienen distinto tamaño, comparo cada cantidad con su propio total: divido y multiplico por 100.',
              ecuacion: [{ frac: [dato(x.parte), total(x.todo)] }, ' × 100'] },
            { tipo: 'aplica', texto: `Divido cada fila entre su total. ${nombre(m)} queda arriba: ${f(m.ap)} de ${f(m.tot)} es el ${P(m)} %.`,
              ecuacion: [{ frac: [dato(f(m.ap)), total(f(m.tot))] }, ` × 100 = ${P(m)} %`],
              dibujo: fig({ marcas: { [m.id]: 'i' }, sellos: { r: { t: filas.map(c => `${c.id} ${P(c)} %`).join(' · '), c: 'i' } }, nuevo: [m.id] }) },
            { tipo: 'sentido', texto: `Tienta ${nombre(n)}, con más ${x.parte} (${f(n.ap)}). Pero son de ${f(n.tot)}: su proporción es ${P(n)} %, menor que ${P(m)} %.`,
              dibujo: fig({ marcas: { [m.id]: 'i', [n.id]: 'h' }, sellos: { r: { t: `${n.id}: ${f(n.ap)} de ${f(n.tot)} = ${P(n)} %`, c: 'h' } }, nuevo: [n.id] }) },
          ],
          respuesta: `${nombre(m)}, con el ${P(m)} %`,
        };
      },
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
          solucion: { texto: `Se divide cada fila entre su total: ${m.id} tiene ${f(pct(m.ap, m.tot))} %.`, ecuacion: [{ frac: [dato(f(m.ap)), total(f(m.tot))] }, ` = ${f(pct(m.ap, m.tot))} %`], dibujo: { datos: tabla(filas, 'Aprobados por grupo'), estado: { marcas: { [m.id]: 'i' }, sellos: { r: { t: filas.map(c => `${c.id} ${f(pct(c.ap, c.tot))} %`).join(' · '), c: 'i' } } } } },
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
  // «Así se resuelve»: otros gráficos de dos barras, con las mismas cuentas de «Ahora tú» (pct y seVe).
  const CTX_BARRAS = [
    { titulo: 'Visitantes de dos museos', a: 'Museo A', b: 'Museo B' },
    { titulo: 'Votos de dos listas', a: 'Lista A', b: 'Lista B' },
    { titulo: 'Pasajeros de dos rutas', a: 'Ruta A', b: 'Ruta B' },
    { titulo: 'Socios de dos clubes', a: 'Club A', b: 'Club B' },
  ];
  const escala = {
    id: 'escala',
    titulo: 'La escala cambia la imagen',
    temas: ['Gráficos'],
    pieza: 'rv-barras',
    // Lee (fase 2): qué es un gráfico de barras y su eje, sin decir cómo se compara cuando el eje está cortado.
    lee: {
      tarjetas: [
        { titulo: 'Gráficos por todas partes', texto: 'En los noticieros, en los afiches de la municipalidad y en los libros del colegio aparecen gráficos de barras. Cada barra representa un dato: ventas, votos, asistentes o lo que se esté contando.' },
        { titulo: 'El eje y su escala', texto: 'El eje es la línea con números que acompaña a las barras. La escala dice qué valor corresponde a cada marca. Cada marca del eje lleva su número escrito.' },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego, las ventas de Puno y Juliaca no cambian: tú eliges dónde empieza el eje. Mira cómo cambia el largo de las barras y qué dice la lectura de abajo.' },
      ],
    },
    juega: {
      consigna: 'Cambia dónde empieza el eje del gráfico. Los datos no cambian; mira cuánto más larga se ve la barra de Juliaca.',
      voz: 'Mira primero el número donde empieza el eje.',
      controles: [{ id: 'min', etiqueta: 'El eje empieza en', opciones: [{ valor: 0, texto: '0 t' }, { valor: 60, texto: '60 t' }, { valor: 80, texto: '80 t' }] }],
      dibujo: val => ({ datos: grafico(val.min), estado: { marcas: { j: 'o' } } }),
      lectura: val => ['Se ve ', engana(`${f(seVe(82, 88, val.min), 1)} veces`), ' · es ', dato(`${f(pct(88 - 82, 82), 1)} %`), ' más'],
      minimo: 3,
      // Estira la barra de Juliaca: los datos no cambian, así que para que se vea más larga el eje tiene que empezar
      // más arriba. Suelta en el inicio de eje más cercano de los tres.
      arrastres: [{ id: 'juliaca', etiqueta: 'punta de la barra de Juliaca', color: 'c-o',
        donde: val => punta(grafico(val.min), 'j'),
        mover: (pt, val) => ({ min: masCercano([0, 60, 80], minPara(grafico(val.min), 88, pt.x + DENTRO)) }) }],
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
      ecuacion: [{ frac: [[prueba('B'), ' − ', dato('A')], { llave: [dato('A')], nota: 'la base', color: 'c-i' }] }, ' × 100'],
      condicion: 'se mira primero el número donde empieza el eje; un corte en el eje avisa que no es cero.',
    },
    // Así se resuelve (fase 2): el mismo problema de «Ahora tú», con azar(s + 900) y las mismas cuentas.
    resuelve: {
      pieza: 'rv-barras',
      generar(s) {
        const r = azar(s + 900), x = CTX_BARRAS[r.ent(0, CTX_BARRAS.length - 1)];
        const a = r.ent(40, 90), b = a + r.ent(2, 8), min = a - r.ent(2, 5);
        const real = pct(b - a, a), parece = seVe(a, b, min);
        const datos = desde => ({ titulo: x.titulo, barras: [{ id: 'a', nombre: x.a, valor: a }, { id: 'b', nombre: x.b, valor: b }], min: desde, max: b + 2, unidad: '', fuente: 'Datos inventados' });
        return {
          enunciado: `En el gráfico «${x.titulo}», ¿cuánto más es el valor de ${x.b} que el de ${x.a}?`,
          dibujo: { datos: datos(min), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden cuánto más es ${x.b} que ${x.a}, en porcentaje: la diferencia comparada con ${x.a}.` },
            { tipo: 'datos', texto: `El eje empieza en ${f(min)}, no en cero. Los valores escritos son ${f(a)} para ${x.a} y ${f(b)} para ${x.b}.`,
              dibujo: { datos: datos(min), estado: { marcas: { a: 'i', b: 'o' } } } },
            { tipo: 'regla', texto: 'Si el eje no arranca en cero, el largo de las barras engaña. Uso los números escritos: la diferencia entre la base, por 100.',
              ecuacion: [{ frac: [[prueba('B'), ' − ', dato('A')], dato('A')] }, ' × 100'] },
            { tipo: 'aplica', texto: `Resto ${f(b)} − ${f(a)} = ${f(b - a)} y lo divido entre ${f(a)}, el valor de ${x.a}.`,
              ecuacion: [{ frac: [[prueba(f(b)), ' − ', dato(f(a))], dato(f(a))] }, ` × 100 ≈ ${f(real)} %`],
              dibujo: { datos: datos(0), estado: { marcas: { a: 'i', b: 'o' } } } },
            { tipo: 'sentido', texto: `Con el eje en ${f(min)}, ${x.b} parece unas ${f(parece, 1)} veces ${x.a}. Con el eje en cero, la diferencia se ve de su tamaño real: ${f(real)} % es creíble.` },
          ],
          respuesta: `Cerca de ${f(real)} % más`,
        };
      },
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
  // «Así se resuelve»: otras ciudades y productos, con las mismas cuentas de «Ahora tú» (una resta de dos barras).
  const CTX_MIXTO = [
    { c: ['Ayaviri', 'Lampa'], prod: 'queso' }, { c: ['Yunguyo', 'Pomata'], prod: 'papa' },
    { c: ['Ilave', 'Acora'], prod: 'lana' }, { c: ['Putina', 'Moho'], prod: 'quinua' },
  ];
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
    // Lee (fase 2): qué es un texto mixto y una infografía, sin decir qué parte trae la cifra que pide la predicción.
    lee: {
      tarjetas: [
        { titulo: 'Texto con gráfico', texto: 'Un afiche de la posta sobre la anemia trae un título, unas frases y un gráfico. Es un texto mixto: una parte va en párrafo y otra se muestra en barras o en una tabla.' },
        { titulo: 'La infografía', texto: 'Una infografía junta título, texto breve, cifras y dibujos para explicar un tema de un vistazo. Se usan mucho en periódicos, campañas de salud y libros escolares.' },
        { titulo: 'Qué mirar al jugar', texto: 'Verás una infografía de las ferias de quinua. Elige cada afirmación y mira qué se marca: el título, el texto, unas barras o nada. El color dice si la respalda.' },
      ],
    },
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
        { estado: { marcas: { p24: 'd', p25: 'i', j24: 'd', j25: 'i' } }, texto: 'El gráfico da las cifras: Puno +12 t y Juliaca +13 t.', ecuacion: [dato('82 − 70'), '   ·   ', dato('88 − 75')] },
        { estado: { texto: 'h' }, texto: 'Precio y ventas suben juntos, pero nada dice que uno cause lo otro.', ecuacion: [engana('juntos'), ' ≠ ', engana('causa')] },
      ],
    },
    regla: {
      texto: 'En un texto mixto o una infografía, texto, título y gráfico se completan: cada afirmación se respalda con la parte que la dice o con ambas.',
      ecuacion: [{ llave: [total('título')], nota: 'qué y cuándo', color: 'c-d' }, ' + ', { llave: [dato('datos')], nota: 'texto y gráfico', color: 'c-i' }],
      condicion: 'se responde con los datos y no solo con el título; dos datos que suben juntos no prueban una causa.',
    },
    // Así se resuelve (fase 2): el mismo problema de «Ahora tú», con azar(s + 900) y las mismas cuentas.
    resuelve: {
      pieza: 'rv-barras',
      generar(s) {
        const r = azar(s + 900), x = CTX_MIXTO[r.ent(0, CTX_MIXTO.length - 1)], ciudades = x.c;
        const a1 = r.ent(40, 70), a2 = a1 + r.ent(5, 15), b1 = r.ent(40, 70), b2 = b1 + r.ent(5, 15);
        const cual = r.ent(0, 1), [x1, x2, nom] = cual ? [b1, b2, ciudades[1]] : [a1, a2, ciudades[0]];
        const otraC = ciudades[1 - cual], ids = cual ? ['b1', 'b2'] : ['a1', 'a2'];
        const datos = { titulo: `Venta de ${x.prod}: ${ciudades[0]} y ${ciudades[1]}`, texto: `En 2025 hubo más ferias en la región. Las dos ciudades vendieron más ${x.prod} que en 2024.`, barras: [{ id: 'a1', nombre: `${ciudades[0]} 24`, valor: a1 }, { id: 'a2', nombre: `${ciudades[0]} 25`, valor: a2 }, { id: 'b1', nombre: `${ciudades[1]} 24`, valor: b1 }, { id: 'b2', nombre: `${ciudades[1]} 25`, valor: b2 }], min: 0, max: 90, unidad: ' t', fuente: 'Datos inventados' };
        return {
          enunciado: `Mira la infografía. ¿Cuántas toneladas más de ${x.prod} vendió ${nom} en 2025 que en 2024?`,
          dibujo: { datos, estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden cuánto creció la venta de ${nom}: la diferencia entre sus dos años, en toneladas.` },
            { tipo: 'datos', texto: 'El texto dice que las dos ciudades vendieron más, pero no da cifras. El título dice qué y cuándo; las cifras están en las barras.',
              dibujo: { datos, estado: { titulo: 'd', texto: 'i' } } },
            { tipo: 'regla', texto: 'En una infografía, título, texto y gráfico se completan. Busco qué parte trae el dato que piden y lo leo ahí.' },
            { tipo: 'aplica', texto: `Leo las dos barras de ${nom}: ${f(x2)} t en 2025 y ${f(x1)} t en 2024. Las resto.`,
              ecuacion: [prueba(f(x2)), ' − ', dato(f(x1)), ` = ${f(x2 - x1)} t`],
              dibujo: { datos, estado: { marcas: { [ids[0]]: 'i', [ids[1]]: 'o' } } } },
            { tipo: 'sentido', texto: `No son ${f(x2)} t: eso es solo lo de 2025. Tampoco sirve comparar con ${otraC}. El crecimiento de ${nom} es ${f(x2 - x1)} t.` },
          ],
          respuesta: `${f(x2 - x1)} toneladas más`,
        };
      },
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

  // ---------- Laboratorio: el eje libre ----------
  // Más rica que la idea 2: el eje empieza donde quieras (de 0 a 80, de 2 en 2) y también cambia lo que vendió
  // Juliaca. Se agarran las dos puntas: la de Puno (82 t, fija) mueve el inicio del eje; la de Juliaca, su valor.
  // La lectura escribe el inicio del eje, cuánto más se ve y cuánto más es: un caso guardado se lee solo.
  const libre = (min, j) => ({ titulo: 'Venta de quinua en 2025', barras: [{ id: 'p', nombre: 'Puno', valor: 82 }, { id: 'j', nombre: 'Juliaca', valor: j }], min, max: 100, unidad: ' t', fuente: 'Datos inventados' });
  const mesaEje = {
    id: 'eje-libre', titulo: 'El eje libre', pieza: 'rv-barras',
    consigna: 'La punta de Puno mueve el inicio del eje; la de Juliaca, su venta. Compara lo que se ve con lo que es.',
    voz: 'Mira el número donde empieza el eje.',
    controles: [
      { id: 'min', etiqueta: 'Eje desde', color: 'c-h', min: 0, max: 80, paso: 2, inicio: 0, unidad: 't', decimales: 0 },
      { id: 'j', etiqueta: 'Juliaca', color: 'c-o', min: 82, max: 100, paso: 1, inicio: 88, unidad: 't', decimales: 0 },
    ],
    dibujo: val => ({ datos: libre(val.min, val.j), estado: { marcas: { j: 'o', p: 'i' } } }),
    lectura: val => ['Eje desde ', engana(`${f(val.min)} t`), ' · se ve ', engana(`${f(seVe(82, val.j, val.min), 1)} veces`), ' · es ', dato(`${f(pct(val.j - 82, 82), 1)} %`), ' más'],
    arrastres: [
      { id: 'puno', etiqueta: 'punta de la barra de Puno (mueve el inicio del eje)', color: 'c-h',
        donde: val => punta(libre(val.min, val.j), 'p'),
        mover: (pt, val) => ({ min: minPara(libre(val.min, val.j), 82, pt.x + DENTRO) }) },
      { id: 'juliaca', etiqueta: 'punta de la barra de Juliaca', color: 'c-o',
        donde: val => punta(libre(val.min, val.j), 'j'),
        mover: (pt, val) => ({ j: RB().valorEn(libre(val.min, val.j), pt.x + DENTRO) }) },
    ],
    // Retos: cada logrado usa seVe y pct, las mismas cuentas que escribe la lectura.
    invitaciones: [
      { texto: 'Haz que Juliaca se vea al menos tres veces más larga que Puno.',
        logrado: val => seVe(82, val.j, val.min) >= 3,
        bien: 'Se ve el triple, pero los números escritos siguen diciendo cuánto es de verdad.' },
      { texto: 'Haz que Juliaca se vea justo el doble de larga que Puno.',
        logrado: val => Math.abs(seVe(82, val.j, val.min) - 2) < 1e-9,
        bien: 'El doble a la vista, aunque Juliaca vende apenas un poco más. Revisa el eje.' },
      { texto: 'Pon Juliaca en 100 t y deja la imagen fiel a los datos.',
        logrado: val => val.j === 100 && Math.abs(seVe(82, val.j, val.min) - val.j / 82) < 1e-9,
        bien: 'Con el eje en cero, el largo de cada barra dice lo mismo que su número.' },
      { texto: 'Guarda dos casos con la misma venta de Juliaca que se vean muy distintos.',
        logrado: (val, guardados) => guardados.some(g => g.j === val.j && g.min !== val.min && Math.abs(seVe(82, g.j, g.min) - seVe(82, val.j, val.min)) >= 0.5),
        bien: 'Mismos datos, dos imágenes. Lo único que cambió fue dónde empieza el eje.' },
    ],
  };

  return {
    unidad: 'razonamiento-verbal.textos-discontinuos',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js', '/nucleo/kit/piezas/rv-barras.js'],
    historia: {
      texto: 'En 1859, Florence Nightingale y Harriet Martineau publicaron un informe que unía texto y gráficos sobre la salud de los soldados británicos en la guerra de Crimea. Sus diagramas separaban las causas de muerte para que el público entendiera los datos. Leerlos exigía mirar a la vez categorías, convenciones y explicaciones, como en todo texto discontinuo.',
      pregunta: '¿Qué miras primero en un gráfico?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Nightingale y Martineau, 1859)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/comprensionlectora.htm' },
    },
    glosario: [
      { termino: 'texto discontinuo', def: 'Texto que da su información en tablas, gráficos, mapas o listas, y no en párrafos seguidos.',
        formas: ['texto discontinuo', 'textos discontinuos'], ver: ['tabla', 'gráfico', 'infografía'] },
      { termino: 'tabla', def: 'Cuadro de filas y columnas: cada dato está en el cruce de una fila con una columna.',
        ejemplo: 'Fila «Colegio C», columna «aprobados»: 18.', ver: ['proporción'] },
      { termino: 'gráfico', def: 'Dibujo que muestra datos con barras, líneas o sectores para compararlos de un vistazo.',
        formas: ['gráfico', 'gráficos'], ver: ['gráfico de barras', 'eje'] },
      { termino: 'gráfico de barras', def: 'Dibujo en que cada dato es una barra; su largo es fiel al valor si el eje empieza en cero.',
        formas: ['gráfico de barras'], ver: ['eje', 'escala'] },
      { termino: 'infografía', def: 'Pieza que junta título, texto breve, cifras y dibujos para explicar un tema.',
        formas: ['infografía', 'infografías'], ver: ['texto mixto'] },
      { termino: 'texto mixto', def: 'Texto que combina párrafos con una tabla o un gráfico; las dos partes se completan.',
        formas: ['texto mixto', 'textos mixtos'], ver: ['infografía', 'texto discontinuo'] },
      { termino: 'eje', def: 'Línea con números que da la escala de un gráfico; primero se mira dónde empieza.',
        ejemplo: `Con el eje desde 80 t, la barra de 88 t se ve ${f(seVe(82, 88, 80))} veces la de 82 t.`, formas: ['eje', 'ejes'], ver: ['escala'] },
      { termino: 'escala', def: 'Cómo se reparten los valores a lo largo del eje: qué número corresponde a cada marca.',
        ver: ['eje'] },
      { termino: 'proporción', def: 'Una cantidad dividida entre su propio total; sirve para comparar grupos de distinto tamaño.',
        ejemplo: `18 aprobados de 30 alumnos: ${f(pct(18, 30))} %.`, formas: ['proporción', 'proporciones'], ver: ['tabla'] },
    ],
    laboratorio: [
      mesaEje,
      Object.assign({ id: 'tabla', titulo: 'La tabla y sus totales', pieza: 'rv-texto',
        // Retos: se comprueban con pct, mejor y masAprob, las cuentas que escriben el sello y la lectura.
        invitaciones: [
          { texto: 'Busca el colegio con la mayor proporción de aprobados y mírala.',
            logrado: val => val.m === 'p' && val.c === mejor(COLE).id,
            bien: 'Aprobó la mayor parte de sus alumnos, aunque no tiene más aprobados.' },
          { texto: 'Muestra el colegio con más aprobados, mirando solo la cantidad.',
            logrado: val => val.m === 'n' && val.c === masAprob(COLE).id,
            bien: 'Es la cantidad más alta. ¿Y si la comparas con su propio total?' },
          { texto: 'Guarda dos colegios: el de más aprobados, con menor proporción.',
            logrado: (val, guardados) => guardados.some(g => {
              const a = COLE.find(x => x.id === g.c), b = COLE.find(x => x.id === val.c);
              return a !== b && (a.ap - b.ap) * (pct(a.ap, a.tot) - pct(b.ap, b.tot)) < 0;
            }),
            bien: 'Más aprobados no es aprobar mejor: cada fila se mide con su total.' },
        ] }, tablaIdea.juega),
      Object.assign({ id: 'texto-y-grafico', titulo: 'Texto y gráfico juntos', pieza: 'rv-barras',
        // Retos: se comprueban con AFIRMA, la tabla que dice qué parte respalda cada afirmación.
        invitaciones: [
          { texto: 'Elige la afirmación que respaldan a la vez el texto y el gráfico.',
            logrado: val => AFIRMA[val.a].ok && AFIRMA[val.a].estado.texto === 'i' && !!AFIRMA[val.a].estado.marcas,
            bien: 'El texto dice que crecieron; las barras dicen cuánto. Se completan.' },
          { texto: 'Busca la afirmación que la infografía no permite sostener.',
            logrado: val => !AFIRMA[val.a].ok,
            bien: 'Precio y ventas suben juntos, pero nada dice que uno cause lo otro.' },
          { texto: 'Guarda una afirmación respaldada y otra que no lo esté.',
            logrado: (val, guardados) => guardados.some(g => AFIRMA[g.a].ok) && guardados.some(g => !AFIRMA[g.a].ok),
            bien: 'Compáralas: ¿qué parte de la infografía sostiene a la primera?' },
        ] }, mixtos.juega),
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'eje-libre': ['escala'],
      'tabla': ['tabla'],
      'texto-y-grafico': ['texto-y-grafico'],
    },
    ideas: [tablaIdea, escala, mixtos],
  };
});
