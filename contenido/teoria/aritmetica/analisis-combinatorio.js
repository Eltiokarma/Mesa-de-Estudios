/*
 * Teoría de «Análisis combinatorio» (aritmetica.analisis-combinatorio). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 9) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR17 (orden donde no importa, o al revés), AR18 (enumerar sin sistema), AR19 (repetición) de
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: antes de elegir fórmula, decidir qué hace iguales a dos resultados.
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de 360 px, sin audio.
 *   Resultado observable: cuenta menús, filas, rondas, anagramas y equipos, y dice por qué usó esa cuenta.
 *   Orden de atención: 1.º los casilleros o la lista de casos · 2.º el número que los resume · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · casos que se agrupan · caso nuevo · «No sé».
 *   Duda que resuelve: «¿cuándo divido entre r! y cuándo no?».
 * Colores (regla 4): n (cuántos hay) naranja (c-o), r (cuántos se eligen o puestos) turquesa (c-i), el resultado
 * verde (c-d) y lo que se repite o se agrupa, rojo (c-h). Piezas: arit-tabla y arit-fichas.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El principio de multiplicación del motor de plantillas/probabilidad-dados cuenta los menús de la mesa 3D (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/probabilidad-dados/motor.js'))
    : fabrica(root.Kit, root.MotorDados);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MDa) {
  'use strict';
  const f = (x, d = 0) => Kit.formatear(x, d);
  const N = { v: 'c-o', t: 'n' }, R = { v: 'c-i', t: 'r' };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt = x => f(x)) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor < 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const fact = k => (k <= 1 ? 1 : k * fact(k - 1));
  const V = (n, r) => (r > n ? 0 : fact(n) / fact(n - r));
  const C = (n, r) => (r > n ? 0 : fact(n) / (fact(r) * fact(n - r)));
  const LET = ['A', 'B', 'C', 'D', 'E', 'F'];
  function combinaciones(xs, r) {
    if (r === 0) return [[]];
    if (xs.length < r) return [];
    const [h, ...t] = xs;
    return [...combinaciones(t, r - 1).map(c => [h, ...c]), ...combinaciones(t, r)];
  }
  function anagramas(pal) {
    const out = new Set();
    const ir = (resto, pre) => { if (!resto.length) { out.add(pre); return; } for (let i = 0; i < resto.length; i++) ir(resto.slice(0, i) + resto.slice(i + 1), pre + resto[i]); };
    ir(pal, '');
    return [...out].sort();
  }
  // Gesto directo (docs/teoria.md §4b) sobre arit-tabla: se tira del borde de la tabla (abajo, una fila más; a la
  // derecha, una columna más). La manija va en el borde para no tapar los rótulos; el lector ajusta al paso y al rango.
  const TABLA = () => Kit.piezas['arit-tabla'];
  // Cuántas columnas de datos (después de la de encabezado) caben hasta x, si hay `k` ahora: en el borde derecho de la
  // columna j da exactamente j, y entre bordes se interpola (más allá del último, con el ancho de la última columna).
  const columnasHasta = (g, x, k) => {
    const borde = j => g.xs[j + 1];
    if (x >= borde(k)) return k + (x - borde(k)) / Math.max(1, borde(k) - borde(k - 1));
    for (let j = k - 1; j >= 0; j--) if (x >= borde(j)) return j + (x - borde(j)) / (borde(j + 1) - borde(j));
    return 0;
  };
  // Filas hasta el punto y: en el borde de abajo de la fila i (contada desde 1) da exactamente i.
  const filasHasta = (g, y) => (y - g.filaY(0)) / g.altoFila;
  const bordeDerecho = (g, k) => ({ x: g.xs[k + 1], y: g.celda(0, 0).y });
  const repes = pal => { const c = {}; for (const x of pal) c[x] = (c[x] || 0) + 1; return Object.values(c).filter(k => k > 1); };

  // Dos grupos de fichas, uno al lado del otro (sin multiplicar: eso es lo que se pregunta).
  const dos = (m, k, rot) => ({ bloques: [{ n: m, columnas: 1, color: 'o', rotulo: rot[0] }, { n: k, columnas: 1, color: 'i', rotulo: rot[1] }], ficha: 22, altoMax: 160 });

  // ---------- Idea 1: «y» multiplica, «o» suma ----------
  // Cambia: cuántas entradas y cuántos segundos. Permanece: una casilla por menú. Progresa: el rectángulo de casillas.
  // Se reserva: una elección con «o» (una sola cosa). Debe verse: «y» llena un rectángulo; «o» pone bloques lado a lado.
  // Dos representaciones a propósito (auditoría, hallazgo 9): la tabla es el rectángulo del «y»; el «o» no forma
  // rectángulo, así que «Mira» pone las opciones en fichas lado a lado y su segundo paso arma el 3 · 2 como la tabla.
  const ENT = ['sopa', 'ceviche', 'papa', 'tamal'], SEG = ['lomo', 'ají', 'trucha', 'cuy'];
  const menu = (e, s) => ({ columnas: ['', ...SEG.slice(0, s).map(t => ({ t, color: 'i' }))], cabeza: true, filasMax: 4,
    filas: ENT.slice(0, e).map(t => [{ t, color: 'o' }, ...SEG.slice(0, s).map(() => ({ t: '●', color: 'd' }))]) });
  const menus = v => v.e * v.s;
  const principios = {
    id: 'principios',
    titulo: '«Y» multiplica, «o» suma',
    temas: ['Principios de adición y multiplicación'],
    pieza: 'arit-tabla',
    // Lee (fase 2): contexto y qué mirar, sin decir qué cuenta va con cada palabra (eso se descubre en Predice).
    lee: {
      tarjetas: [
        { titulo: 'Contar sin listar', texto: 'En un restaurante de Juliaca, el menú trae una entrada y un segundo. Escribir todos los menús posibles cansa. En esta unidad aprendes a contarlos sin escribirlos uno por uno.' },
        { titulo: 'Lee cómo está dicho', texto: 'Los problemas de conteo usan palabras pequeñas con mucho peso, como «y» y «o». Antes de contar, fíjate qué palabra une las opciones y cuántas cosas se eligen.' },
        { titulo: 'Qué mirar', texto: 'En la tabla, cada fila es una entrada y cada columna, un segundo. Cada punto verde es un menú distinto. Cambia los números y cuenta los puntos.' },
      ],
    },
    juega: {
      consigna: 'Un menú tiene una entrada y un segundo. Elige cuántos hay de cada uno: cada punto es un menú distinto.',
      voz: 'Cuenta los puntos: filas por columnas.',
      controles: [
        { id: 'e', etiqueta: 'Entradas', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 's', etiqueta: 'Segundos', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: v => ({ datos: menu(v.e, v.s), estado: {} }),
      lectura: v => [`${v.e} ${v.e === 1 ? 'entrada' : 'entradas'} y ${v.s} ${v.s === 1 ? 'segundo' : 'segundos'}: ${menus(v)} ${menus(v) === 1 ? 'menú' : 'menús'}`],
      minimo: 3,
      // Se tira del borde de abajo (una entrada más) y del borde derecho (un segundo más).
      arrastres: [
        { id: 'entradas', etiqueta: 'última entrada', color: 'c-o',
          donde: v => { const g = TABLA().geometria(menu(v.e, v.s)); return { x: g.celda(0, 0).x, y: g.filaY(v.e) }; },
          mover: (pt, v) => ({ e: filasHasta(TABLA().geometria(menu(v.e, v.s)), pt.y) }) },
        { id: 'segundos', etiqueta: 'último segundo', color: 'c-i',
          donde: v => bordeDerecho(TABLA().geometria(menu(v.e, v.s)), v.s),
          mover: (pt, v) => ({ s: columnasHasta(TABLA().geometria(menu(v.e, v.s)), pt.x, v.s) }) },
      ],
    },
    predice: {
      pregunta: 'De Juliaca a Puno puedes ir en una de 3 combis o en uno de 2 buses. ¿De cuántas formas puedes viajar?',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'por', texto: '6', error: 'AT-Y-O', siFuera: '6 sería cierto si tomaras una combi Y un bus. Aquí tomas uno o el otro.' },
        { id: 'uno', texto: '3', error: 'AT-Y-O', siFuera: 'Faltan los buses: también son formas de viajar.' },
      ],
      pieza: 'arit-fichas',
      dibujo: { datos: { bloques: [{ n: 3, columnas: 3, color: 'o', rotulo: 'combis' }, { n: 2, columnas: 2, color: 'i', rotulo: 'buses' }], ficha: 26, altoMax: 60 }, estado: {} },
      revelar: { datos: { bloques: [{ n: 3, columnas: 3, color: 'o', rotulo: 'combis' }, { n: 2, columnas: 2, color: 'i', rotulo: 'buses' }], ficha: 26, altoMax: 60 }, estado: {} },
      coincide: 'Coincide: son 3 + 2 opciones que no se mezclan.',
    },
    mira: {
      pieza: 'arit-fichas',
      datos: { bloques: [
        { n: 3, columnas: 1, color: 'o', rotulo: '3' },
        { n: 2, columnas: 1, color: 'i', rotulo: '+ 2' },
        { n: 6, columnas: 2, color: 'd', rotulo: '3 · 2', marcoFilas: true, paso: 2 },
      ], ficha: 26, altoMax: 80 },
      pasos: [
        { estado: { paso: 1 }, texto: 'Una sola elección: o combi o bus. Se juntan las opciones.', ecuacion: ['3 + 2 = 5'] },
        { estado: { paso: 2 }, texto: 'Si vas en combi y vuelves en bus, cada combi va con cada bus.', ecuacion: ['3 · 2 = 6'] },
      ],
    },
    regla: {
      texto: 'Principio de multiplicación: una etapa y luego otra multiplican las formas. Principio de adición: elegir una sola opción entre grupos que no se mezclan suma las formas.',
      ecuacion: ['«y»: m · k', '   ·   ', '«o»: m + k'],
      condicion: 'en «o», ninguna opción está en los dos grupos; si alguna se repite, se resta. En «y», las etapas son independientes.',
    },
    // Así se resuelve (fase 2): los mismos tres tipos de «Ahora tú» (caminos, plato, uniforme), con otras semillas.
    resuelve: {
      pieza: 'arit-fichas',
      generar(s) {
        const r = azar(s + 900), m = r.ent(2, 7), k = r.ent(2, 6), t = r.ent(2, 4), tipo = s % 3;
        if (tipo === 2) return {
          enunciado: `Un uniforme lleva un polo (${m} colores), un short (${k} colores) y unas medias (${t} colores). ¿Cuántos uniformes distintos hay?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden cuántos uniformes distintos se pueden armar.' },
            { tipo: 'datos', texto: `Hay ${m} colores de polo, ${k} de short y ${t} de medias.` },
            { tipo: 'regla', texto: 'Un uniforme lleva un polo, un short y unas medias: son tres etapas seguidas. Las etapas seguidas multiplican sus formas.' },
            { tipo: 'cuentas', texto: 'Cada polo va con cada short, y cada pareja va con cada color de medias.', ecuacion: [`${m} · ${k} · ${t} = ${f(m * k * t)}`] },
            { tipo: 'sentido', texto: `Con un solo polo habría ${k} · ${t} = ${f(k * t)} uniformes. Con ${m} polos hay ${m} veces más: ${m} · ${f(k * t)} = ${f(m * k * t)}.` },
          ],
          respuesta: `${f(m * k * t)} uniformes distintos`,
        };
        const y = tipo === 0, total = y ? m * k : m + k;
        return {
          enunciado: y ? `Hay ${m} caminos de A a B y ${k} de B a C. ¿De cuántas formas se va de A a C pasando por B?` : `Para el almuerzo eliges un plato: ${m} de carne o ${k} vegetarianos. ¿Cuántas opciones tienes?`,
          dibujo: { datos: dos(m, k, [String(m), String(k)]), estado: {} },
          pasos: [
            { tipo: 'pide', texto: y ? 'Piden cuántos recorridos distintos hay de A a C.' : 'Piden cuántos platos distintos puedes elegir.' },
            { tipo: 'datos', texto: y ? `${m} caminos en el primer tramo y ${k} en el segundo. Se recorren los dos tramos.` : `${m} platos de carne y ${k} vegetarianos. Se come un solo plato.` },
            { tipo: 'regla', texto: y ? 'Ir de A a B y después de B a C son dos etapas seguidas: sus formas se multiplican.' : 'Elijo una sola cosa entre dos grupos que no comparten platos: sus formas se suman.' },
            y
              ? { tipo: 'cuentas', texto: 'Cada camino del primer tramo sigue con cada camino del segundo.', ecuacion: [`${m} · ${k} = ${f(total)}`],
                dibujo: { datos: { bloques: [{ n: m * k, columnas: k, color: 'd', rotulo: `${m} · ${k}`, marcoFilas: true }], ficha: 22, altoMax: 160 }, estado: {} } }
              : { tipo: 'cuentas', texto: 'Junto los dos grupos de platos en una sola lista.', ecuacion: [`${m} + ${k} = ${f(total)}`] },
            { tipo: 'sentido', texto: y ? `Con un solo camino de A a B habría ${k} recorridos. Con ${m} caminos hay ${m} veces más: ${f(total)}.` : `Cada plato se cuenta una vez. No son ${f(m * k)}: eso sería comer uno de carne y también uno vegetariano.` },
          ],
          respuesta: y ? `${f(total)} formas de ir de A a C` : `${f(total)} opciones de plato`,
        };
      },
    },
    ahoraTu: {
      pieza: 'arit-fichas',
      generar(s) {
        const r = azar(s), m = r.ent(2, 7), k = r.ent(2, 6), y = s % 2 === 0;
        const t = r.ent(2, 4);
        if (s % 5 === 4) return {
          pregunta: `Un uniforme lleva un polo (${m} colores), un short (${k} colores) y unas medias (${t} colores). ¿Cuántos uniformes distintos hay?`,
          opciones: opciones(m * k * t, [
            { id: 'suma', valor: m + k + t, error: 'AT-Y-O', siFuera: 'Eso sería elegir una sola prenda. Aquí se elige una de cada.' },
            { id: 'dos', valor: m * k, error: 'AT-Y-O', siFuera: 'Falta la etapa de las medias.' },
            { id: 'pot', valor: (m + k + t) * 2, error: 'AT-Y-O', siFuera: 'Cada etapa multiplica las anteriores.' },
          ]),
          solucion: { texto: 'Tres etapas, una tras otra: se multiplican.', ecuacion: [`${m} · ${k} · ${t} = ${m * k * t}`] },
        };
        return {
          pregunta: y ? `Hay ${m} caminos de A a B y ${k} de B a C. ¿De cuántas formas se va de A a C pasando por B?` : `Para el almuerzo eliges un plato: ${m} de carne o ${k} vegetarianos. ¿Cuántas opciones tienes?`,
          dibujo: { datos: dos(m, k, [String(m), String(k)]), estado: {} },
          opciones: opciones(y ? m * k : m + k, [
            { id: 'otro', valor: y ? m + k : m * k, error: 'AT-Y-O', siFuera: y ? 'Sumar sería elegir un solo tramo. Aquí se recorren los dos.' : 'Multiplicar sería comer uno de cada. Aquí eliges uno solo.' },
            { id: 'mayor', valor: Math.max(m, k), error: 'AT-Y-O', siFuera: 'Eso cuenta solo uno de los grupos.' },
            { id: 'pot', valor: m ** k, error: 'AR19', siFuera: 'Eso sería repetir una elección de m opciones k veces.' },
          ]),
          solucion: { texto: y ? 'Dos etapas: cada camino del primer tramo sigue con cada uno del segundo.' : 'Una sola elección entre grupos que no se mezclan.', ecuacion: [y ? `${m} · ${k} = ${m * k}` : `${m} + ${k} = ${m + k}`], dibujo: y ? { datos: { bloques: [{ n: m * k, columnas: k, color: 'd', rotulo: `${m} · ${k}`, marcoFilas: true }], ficha: 22, altoMax: 160 }, estado: {} } : undefined },
        };
      },
    },
  };

  // ---------- Idea 2: casilleros que se van quedando sin opciones: factorial y variaciones ----------
  // Cambia: cuántos objetos hay y cuántos puestos se llenan. Permanece: un casillero por puesto, de izquierda a derecha.
  // Progresa: cada casillero tiene una opción menos. Se reserva: llenar todos los puestos (n!). Debe verse: n, n − 1, n − 2…
  const casilleros = (n, r, rep = false) => ({
    columnas: ['puesto', ...Array.from({ length: r }, (_, k) => ({ t: `${k + 1}.º`, color: 'i' }))], cabeza: true, filasMax: 1,
    filas: [[{ t: 'opciones', color: 'o' }, ...Array.from({ length: r }, (_, k) => ({ t: String(rep ? n : Math.max(0, n - k)), color: 'd', paso: k + 1 }))]],
  });
  const manijaPuestos = datosDe => ({
    id: 'puestos', etiqueta: 'último puesto', color: 'c-i',
    donde: v => bordeDerecho(TABLA().geometria(datosDe(v)), v.r),
    mover: (pt, v) => ({ r: columnasHasta(TABLA().geometria(datosDe(v)), pt.x, v.r) }),
  });
  const variaciones = {
    id: 'variaciones',
    titulo: 'Cada puesto, una opción menos',
    temas: ['Factorial', 'Variaciones', 'Permutaciones lineales y circulares'],
    pieza: 'arit-tabla',
    lee: {
      tarjetas: [
        { titulo: 'Puestos con orden', texto: 'En un concurso de matemática en Puno, quedar primero no es lo mismo que quedar segundo. Cuando los puestos tienen orden, cambiar de lugar a dos personas da otro resultado.' },
        { titulo: '¿Se puede repetir?', texto: 'Una persona no puede ocupar dos puestos a la vez. En cambio, en la clave de un celular el mismo dígito sí puede aparecer dos veces. Antes de contar, pregúntate si se repite.' },
        { titulo: 'Qué mirar', texto: 'En la tabla, cada columna es un puesto y debajo está cuántas opciones le quedan. Agrega puestos y mira cómo cambia ese número de un puesto al siguiente.' },
      ],
    },
    juega: {
      consigna: 'Hay n personas distintas y r puestos en fila. Mira cuántas opciones quedan para cada puesto.',
      voz: 'Quien ya se sentó no vuelve a estar disponible.',
      controles: [
        { id: 'n', etiqueta: 'n', color: 'c-o', min: 2, max: 7, paso: 1, inicio: 5, decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: casilleros(v.n, v.r), estado: { paso: v.r } }),
      lectura: v => [`${Array.from({ length: v.r }, (_, k) => Math.max(0, v.n - k)).join(' · ')} = ${f(V(v.n, v.r))} órdenes`],
      minimo: 3,
      // Se tira del borde derecho: un puesto más, con una opción menos.
      arrastres: [manijaPuestos(v => casilleros(v.n, v.r))],
    },
    predice: {
      pregunta: '¿De cuántas formas se pueden ordenar 5 libros distintos en un estante?',
      opciones: [
        { id: 'c', texto: '120', correcta: true },
        { id: 'pot', texto: '3 125', error: 'AR19', siFuera: 'Sería cierto si un libro pudiera ir en dos lugares a la vez. Cada uno se usa una vez.' },
        { id: 'suma', texto: '15', error: 'AT-SUMA-PRODUCTO', siFuera: 'Eso suma 5 + 4 + 3 + 2 + 1; los puestos se llenan uno y otro: se multiplica.' },
        { id: 'cuad', texto: '25', error: 'AT-SUMA-PRODUCTO', siFuera: '5 · 5 cuenta dos puestos con repetición, no cinco.' },
      ],
      dibujo: { datos: casilleros(5, 5), estado: { paso: 0 } },
      revelar: { datos: casilleros(5, 5), estado: { paso: 5 } },
      coincide: 'Coincide: 5 · 4 · 3 · 2 · 1 = 120.',
    },
    mira: {
      datos: casilleros(5, 5),
      pasos: [
        { estado: { paso: 1 }, texto: 'Para el primer lugar hay 5 libros.', ecuacion: ['5'] },
        { estado: { paso: 2 }, texto: 'Para el segundo quedan 4: por cada primero, 4 segundos.', ecuacion: ['5 · 4 = 20'] },
        { estado: { paso: 5 }, texto: 'Así hasta el último, que ya no tiene opción.', ecuacion: ['5! = 5 · 4 · 3 · 2 · 1 = 120'] },
      ],
    },
    regla: {
      texto: 'Ordenar r de n objetos distintos da n(n − 1)… con r factores: es la variación. Si se ordenan todos, es una permutación: n factorial.',
      ecuacion: [{ sub: ['V', [N, ',', R]] }, ' = ', { frac: [[N, '!'], [{ llave: ['(', N, ' − ', R, ')!'], nota: 'los que sobran' }]] }, '   ·   ', { sub: ['P', N] }, ' = ', N, '!'],
      condicion: 'objetos distintos, sin repetir y el orden importa. 0! = 1. Si se puede repetir, cada puesto tiene n opciones: nʳ.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), n = r.ent(5, 9), k = r.ent(2, 4);
        if (s % 3 === 2) {
          const d = r.de([3, 4]), total = 10 ** d;
          return {
            enunciado: `¿Cuántas claves de ${d} dígitos (del 0 al 9) hay si los dígitos se pueden repetir?`,
            dibujo: { datos: casilleros(10, d, true), estado: { paso: 0 } },
            pasos: [
              { tipo: 'pide', texto: `Piden cuántas claves distintas de ${d} dígitos hay.` },
              { tipo: 'datos', texto: [`La clave tiene ${d} casilleros. Cada uno puede ser cualquier dígito del 0 al 9: `, N, ' = 10 opciones.'] },
              { tipo: 'regla', texto: 'Los casilleros se llenan uno tras otro, así que sus opciones se multiplican. Como se puede repetir, ningún casillero pierde opciones.' },
              { tipo: 'cuentas', texto: `Son ${d} casilleros con 10 opciones cada uno.`, ecuacion: [Array(d).fill('10').join(' · '), ' = ', { sup: ['10', String(d)] }, ` = ${f(total)}`],
                dibujo: { datos: casilleros(10, d, true), estado: { paso: d } } },
              { tipo: 'sentido', texto: `Las claves van de ${'0'.repeat(d)} a ${'9'.repeat(d)}: son los números de 0 a ${f(total - 1)}, justo ${f(total)}.` },
            ],
            respuesta: `${f(total)} claves`,
          };
        }
        const premio = k === 2 ? 'el 1.º y el 2.º puesto' : k === 3 ? 'oro, plata y bronce' : 'los 4 primeros puestos';
        const factores = Array.from({ length: k }, (_, j) => n - j).join(' · ');
        return {
          enunciado: `En un concurso con ${n} participantes, ¿de cuántas formas se reparten ${premio}?`,
          dibujo: { datos: casilleros(n, k), estado: { paso: 0 } },
          pasos: [
            { tipo: 'pide', texto: `Piden de cuántas formas se reparten ${k} puestos distintos.` },
            { tipo: 'datos', texto: [N, ` = ${n} participantes y `, R, ` = ${k} puestos. Nadie gana dos puestos.`] },
            { tipo: 'regla', texto: 'Lleno los puestos en orden. El primero tiene todas las opciones; cada puesto siguiente tiene una menos, porque quien ya ganó no vuelve a contar.' },
            { tipo: 'cuentas', texto: `${k} casilleros, de ${n} opciones para abajo.`, ecuacion: [{ sub: ['V', [N, ',', R]] }, ` = ${factores} = ${f(V(n, k))}`],
              dibujo: { datos: casilleros(n, k), estado: { paso: k } } },
            { tipo: 'sentido', texto: `Es menos que ${n} elevado a ${k}, ${f(n ** k)}, que dejaría a alguien ganar dos puestos. Cuadra.` },
          ],
          respuesta: `${f(V(n, k))} formas`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.ent(5, 9), k = r.ent(2, 4);
        if (s % 3 === 2) {
          const d = r.de([3, 4]);
          return {
            pregunta: `¿Cuántas claves de ${d} dígitos (del 0 al 9) hay si los dígitos se pueden repetir?`,
            dibujo: { datos: casilleros(10, d, true), estado: { paso: d } },
            opciones: opciones(10 ** d, [
              { id: 'sin', valor: V(10, d), error: 'AR19', siFuera: 'Eso no deja repetir dígitos; aquí sí se puede.' },
              { id: 'prod', valor: 10 * d, error: 'AT-SUMA-PRODUCTO', siFuera: 'Cada casillero multiplica: son d factores de 10.' },
              { id: 'comb', valor: C(10, d), error: 'AR17', siFuera: 'En una clave el orden importa: 123 no es 321.' },
            ]),
            solucion: { texto: 'Cada dígito tiene 10 opciones, aunque repita.', ecuacion: [{ sup: ['10', String(d)] }, ` = ${f(10 ** d)}`] },
          };
        }
        return {
          pregunta: `En un concurso con ${n} participantes, ¿de cuántas formas se reparten ${k === 2 ? 'el 1.º y el 2.º puesto' : k === 3 ? 'oro, plata y bronce' : 'los 4 primeros puestos'}?`,
          dibujo: { datos: casilleros(n, k), estado: { paso: 0 } },
          opciones: opciones(V(n, k), [
            { id: 'comb', valor: C(n, k), error: 'AR17', siFuera: 'Eso divide entre el orden, pero los puestos son distintos.' },
            { id: 'pot', valor: n ** k, error: 'AR19', siFuera: 'Eso deja que alguien gane dos puestos.' },
            { id: 'fact', valor: fact(n), error: 'AT-TODOS', siFuera: `Eso ordena a los ${n}; solo se reparten ${k} puestos.` },
          ]),
          solucion: { texto: `${k} casilleros, cada uno con una opción menos.`, ecuacion: [`${Array.from({ length: k }, (_, j) => n - j).join(' · ')} = ${f(V(n, k))}`], dibujo: { datos: casilleros(n, k), estado: { paso: k } } },
        };
      },
    },
  };

  // ---------- Idea 3: en ronda, los giros son la misma disposición ----------
  // Cambia: cuántas personas hay en la mesa. Permanece: una disposición y sus giros, fila por fila.
  // Progresa: las n filas de giros de una sola mesa. Se reserva: el total para 5 personas. Debe verse: n filas = 1 mesa.
  const giros = (n, porFila = false) => {
    const g = LET.slice(0, n);
    return { columnas: ['giro', ...g.map((_, k) => ({ t: `silla ${k + 1}`, color: 'i' }))], cabeza: true, filasMax: 5,
      filas: g.map((_, k) => [{ t: String(k + 1), color: 'h', paso: porFila ? k + 1 : 0 }, ...g.map((_, j) => ({ t: g[(j + k) % n], color: 'o', paso: porFila ? k + 1 : 0 }))]) };
  };
  const circular = {
    id: 'circular',
    titulo: 'En ronda, girar no cambia nada',
    temas: ['Permutaciones lineales y circulares'],
    pieza: 'arit-tabla',
    lee: {
      tarjetas: [
        { titulo: 'Una mesa redonda', texto: 'En un almuerzo familiar, todos se sientan alrededor de una mesa redonda. Ahí no hay cabecera ni primer asiento: lo que se nota es quién queda al lado de quién.' },
        { titulo: 'Fila o ronda', texto: 'En una banca del parque sí hay una punta izquierda y una derecha. Por eso sentarse en fila y sentarse en ronda son dos problemas distintos, aunque sean las mismas personas.' },
        { titulo: 'Qué mirar', texto: 'En la tabla, cada letra es una persona y cada columna, una silla. Cada fila corre a todos una silla. Fíjate si alguien cambia de vecinos.' },
      ],
    },
    juega: {
      consigna: 'Las letras son n amigos en una mesa redonda. Cada fila corre a todos una silla: los vecinos de cada uno no cambian.',
      voz: 'Fíjate: todas las filas son la misma ronda.',
      controles: [{ id: 'n', etiqueta: 'n', color: 'c-o', min: 3, max: 5, paso: 1, inicio: 4, decimales: 0 }],
      dibujo: v => ({ datos: giros(v.n), estado: {} }),
      lectura: v => [`${v.n} órdenes en fila, una sola ronda`],
      minimo: 2,
      // Se tira del borde de abajo: un amigo más es una fila (y una silla) más.
      arrastres: [{ id: 'amigos', etiqueta: 'último giro', color: 'c-o',
        donde: v => { const g = TABLA().geometria(giros(v.n)); return { x: g.celda(0, 0).x, y: g.filaY(v.n) }; },
        mover: (pt, v) => ({ n: filasHasta(TABLA().geometria(giros(v.n)), pt.y) }) }],
    },
    predice: {
      pregunta: '¿De cuántas formas distintas se pueden sentar 5 personas en una mesa redonda?',
      opciones: [
        { id: 'c', texto: '24', correcta: true },
        { id: 'fila', texto: '120', error: 'AT-CIRCULAR', siFuera: '120 cuenta filas. En la ronda, cada disposición aparece 5 veces girada.' },
        { id: 'collar', texto: '12', error: 'AT-CIRCULAR', siFuera: 'Sería cierto si también reflejar fuera lo mismo, como en un collar.' },
        { id: 'n', texto: '5', error: 'AT-CIRCULAR', siFuera: 'Eso cuenta los giros de una sola ronda.' },
      ],
      dibujo: { datos: giros(5), estado: {} },
      revelar: { datos: giros(5), estado: { columna: 1 } },
      coincide: 'Coincide: 120 órdenes en fila, agrupados de 5 en 5.',
    },
    mira: {
      datos: giros(4, true),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'En fila, 4 personas se ordenan de 4! = 24 formas.', ecuacion: ['4! = 24'] },
        { estado: { paso: 4, fila: [0, 1, 2, 3] }, texto: 'En ronda, estos 4 giros son la misma mesa.', ecuacion: ['cada ronda = 4 filas'] },
        { estado: { paso: 4, columna: 1 }, texto: 'Fijamos a A en una silla y ordenamos a los demás.', ecuacion: [{ frac: ['4!', '4'] }, ' = 3! = 6'] },
      ],
    },
    regla: {
      texto: 'En una permutación circular (una ronda), girar a todos no cambia la disposición. Se fija a una persona y se ordenan las demás en fila.',
      ecuacion: [{ sub: ['P', ['c', '(', N, ')']] }, ' = ', { llave: ['(', N, ' − 1)!'], nota: 'los demás en fila', color: 'c-o' }],
      condicion: 'personas distintas y solo los giros se toman como iguales. Si también reflejar es igual (un collar), se divide entre 2.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), n = r.ent(4, 8), ronda = s % 3 !== 2;
        const fila = fact(n), mesa = fact(n - 1);
        const factores = j => Array.from({ length: j }, (_, i) => j - i).join(' · ');
        return {
          enunciado: ronda ? `¿De cuántas formas se sientan ${n} personas alrededor de una mesa redonda?` : `¿De cuántas formas se sientan ${n} personas en una banca de ${n} asientos?`,
          dibujo: { datos: giros(Math.min(n, 5)), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ronda ? `Piden cuántas rondas distintas forman ${n} personas.` : `Piden de cuántas formas se ordenan ${n} personas en la banca.` },
            { tipo: 'datos', texto: ronda ? [N, ` = ${n} personas distintas en una mesa redonda: no hay primer asiento.`] : [N, ` = ${n} personas distintas y ${n} asientos: la banca tiene una punta.`] },
            { tipo: 'regla', texto: ronda ? 'Si todos se corren una silla, la ronda es la misma. Por eso fijo a una persona en su silla y ordeno a las demás en fila.' : 'En la banca, correr a todos un asiento cambia quién está en la punta. Es una fila: se ordenan todos.' },
            ronda
              ? { tipo: 'cuentas', texto: `Fijo a A y ordeno a las otras ${n - 1}.`, ecuacion: [{ sub: ['P', ['c', '(', N, ')']] }, ` = (${n} − 1)! = ${factores(n - 1)} = ${f(mesa)}`],
                dibujo: { datos: giros(Math.min(n, 5)), estado: { columna: 1 } } }
              : { tipo: 'cuentas', texto: `Ordeno a las ${n} personas en los ${n} asientos.`, ecuacion: [`${n}! = ${factores(n)} = ${f(fila)}`] },
            { tipo: 'sentido', texto: ronda ? `En fila serían ${n}! = ${f(fila)}. Cada ronda aparece ${n} veces girada: ${f(fila)} ÷ ${n} = ${f(fila / n)}. Cuadra.` : `Son ${n} veces más que en una mesa redonda, ${f(mesa)}: en la banca, cada giro cuenta aparte. ${n} · ${f(mesa)} = ${f(fila)}.` },
          ],
          respuesta: `${f(ronda ? mesa : fila)} formas`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.ent(4, 8), ronda = s % 3 !== 2;
        return {
          pregunta: ronda ? `¿De cuántas formas se sientan ${n} personas alrededor de una mesa redonda?` : `¿De cuántas formas se sientan ${n} personas en una banca de ${n} asientos?`,
          dibujo: { datos: giros(Math.min(n, 5)), estado: {} },
          opciones: opciones(ronda ? fact(n - 1) : fact(n), [
            { id: 'otro', valor: ronda ? fact(n) : fact(n - 1), error: 'AT-CIRCULAR', siFuera: ronda ? 'Eso cuenta filas: en ronda, cada disposición aparece n veces girada.' : 'En una banca hay un primer asiento: girar sí cambia.' },
            { id: 'collar', valor: fact(n - 1) / 2, error: 'AT-CIRCULAR', siFuera: 'Dividir entre 2 vale si reflejar es igual, como en un collar.' },
            { id: 'n', valor: n * (n - 1), error: 'AT-TODOS', siFuera: 'Eso llena solo dos asientos.' },
          ]),
          solucion: { texto: ronda ? 'Se fija una persona y se ordenan las demás.' : 'Es una fila: se ordenan todos.', ecuacion: [ronda ? `(${n} − 1)! = ${f(fact(n - 1))}` : `${n}! = ${f(fact(n))}`] },
        };
      },
    },
  };

  // ---------- Idea 4: letras repetidas, órdenes que se ven iguales ----------
  // Cambia: la palabra. Permanece: la lista de anagramas distintos, de tres en tres. Progresa: cuántos hay.
  // Se reserva: una palabra con dos letras repetidas (BANANA). Debe verse: intercambiar dos A iguales no da otra palabra.
  const PAL = ['SOL', 'ANA', 'OSO', 'PAPA', 'CASA', 'LOLA'];
  const lista = (pal, extra = {}) => {
    const xs = anagramas(pal), filas = [];
    for (let i = 0; i < xs.length; i += 3) filas.push([xs[i], xs[i + 1] || '', xs[i + 2] || '']);
    return Object.assign({ columnas: [{ t: pal, color: 'o' }, '', ''], filas, filasMax: 4 }, extra);
  };
  const casa = { columnas: [{ t: 'con A₁ y A₂', color: 'o' }, { t: 'se lee', color: 'd' }], filasMax: 4,
    filas: [['C A₁ S A₂', { t: 'CASA', paso: 1 }], ['C A₂ S A₁', { t: 'CASA', paso: 1, resalta: true, color: 'd' }], ['A₁ C A₂ S', { t: 'ACAS', paso: 2 }], ['A₂ C A₁ S', { t: 'ACAS', paso: 2, resalta: true, color: 'd' }]] };
  const repeticion = {
    id: 'repeticion',
    titulo: 'Letras iguales, palabras iguales',
    temas: ['Permutaciones con repetición'],
    pieza: 'arit-tabla',
    lee: {
      tarjetas: [
        { titulo: 'Anagramas', texto: 'Con las letras de ROMA se escriben AMOR, MORA o RAMO. Cada orden que usa todas las letras de una palabra es un anagrama, tenga sentido o no.' },
        { titulo: 'Letras gemelas', texto: 'En OSO hay dos letras O. Si cada una tuviera su color, podrías distinguirlas. Escritas iguales, nadie sabe cuál O está adelante y cuál atrás.' },
        { titulo: 'Qué mirar', texto: 'La tabla muestra cada palabra distinta una sola vez. Compara cuántas salen con una palabra de letras distintas y con otra del mismo largo que repite una letra.' },
      ],
    },
    juega: {
      consigna: 'Elige una palabra y mira todos sus ordenamientos distintos. Compara las que repiten una letra con las que no.',
      voz: 'Compara SOL con OSO: mismo largo, distinta cuenta.',
      controles: [{ id: 'p', etiqueta: 'Palabra', opciones: PAL.map(t => ({ valor: t, texto: t })), inicio: 'SOL' }],
      dibujo: v => ({ datos: lista(v.p), estado: {} }),
      lectura: v => [`${v.p}: ${anagramas(v.p).length} distintas de ${fact(v.p.length)} órdenes`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuántas palabras distintas (con o sin sentido) se forman con todas las letras de BANANA?',
      opciones: [
        { id: 'c', texto: '60', correcta: true },
        { id: 'todos', texto: '720', error: 'AT-REPETIDOS', siFuera: '720 = 6! sería cierto si las seis letras fueran distintas.' },
        { id: 'una', texto: '120', error: 'AT-REPETIDOS', siFuera: 'Eso descuenta las tres A, pero las dos N también se repiten.' },
        { id: 'resta', texto: '715', error: 'AT-REPETIDOS', siFuera: 'Lo repetido no se resta: cada palabra aparece repetida varias veces y se divide.' },
      ],
      dibujo: { datos: lista('ANA'), estado: {} },
      revelar: { datos: lista('ANA'), estado: {} },
      coincide: 'Coincide: 6! entre 3! (las A) y entre 2! (las N).',
    },
    mira: {
      datos: casa,
      pasos: [
        { estado: { paso: 0 }, texto: 'Si las dos A de CASA fueran distintas, habría 4! = 24 órdenes.', ecuacion: ['4! = 24'] },
        { estado: { paso: 1, fila: [0, 1] }, texto: 'Pero cambiar A₁ por A₂ da la misma palabra.', ecuacion: ['CASA = CASA'] },
        { estado: { paso: 2, fila: [2, 3] }, texto: 'Cada palabra aparece 2! veces: se divide.', ecuacion: [{ frac: ['4!', '2!'] }, ' = 12'] },
      ],
    },
    regla: {
      texto: 'Permutación con repetición: si de n objetos hay a iguales de un tipo, b de otro…, cada orden se repite a!·b!… veces. Se divide entre eso.',
      ecuacion: [{ frac: [[N, '!'], [{ llave: ['a! · b! ⋯'], nota: 'órdenes repetidos', color: 'c-h' }]] }],
      condicion: 'se usan todos los objetos y los iguales no se distinguen. Si todos son distintos, queda n!.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), pal = r.de(['PERU', 'PUNO', 'LLAMA', 'CUSCO', 'COCA', 'PAPAYA', 'TACNA', 'CALLAO', 'AMAZONAS', 'ARRAS']);
        const rs = repes(pal), div = rs.reduce((x, k) => x * fact(k), 1), todos = fact(pal.length), bien = todos / div;
        const cuantas = {}; for (const x of pal) cuantas[x] = (cuantas[x] || 0) + 1;
        const iguales = Object.keys(cuantas).filter(x => cuantas[x] > 1).map(x => `${cuantas[x]} ${x}`);
        const lista = iguales.length > 1 ? `${iguales.slice(0, -1).join(', ')} y ${iguales[iguales.length - 1]}` : iguales[0];
        return {
          enunciado: `¿Cuántas palabras distintas se forman con todas las letras de ${pal}?`,
          pasos: [
            { tipo: 'pide', texto: `Piden cuántos órdenes distintos de las letras de ${pal} hay, tengan sentido o no.` },
            { tipo: 'datos', texto: rs.length ? [`${pal} tiene `, N, ` = ${pal.length} letras. Se repiten: ${lista}.`] : [`${pal} tiene `, N, ` = ${pal.length} letras, todas distintas.`] },
            { tipo: 'regla', texto: rs.length ? ['Si las letras iguales fueran distintas, habría ', N, '! órdenes. Cambiar de lugar dos letras iguales no da otra palabra: divido entre los órdenes de cada grupo de iguales.'] : ['Si ninguna letra se repite, cada orden es una palabra distinta. Cuento los órdenes de todas las letras: ', N, '!.'] },
            { tipo: 'cuentas', texto: rs.length ? `${f(todos)} órdenes entre ${f(div)}, las veces que se repite cada palabra.` : `Ordeno las ${pal.length} letras.`,
              ecuacion: rs.length ? [{ frac: [`${pal.length}!`, rs.map(k => `${k}!`).join(' · ')] }, ' = ', { frac: [f(todos), f(div)] }, ` = ${f(bien)}`] : [`${pal.length}! = ${f(bien)}`] },
            { tipo: 'sentido', texto: rs.length ? `Comprueba: ${f(bien)} palabras, cada una repetida ${f(div)} veces, dan ${f(bien * div)} órdenes. Cuadra.` : `Con letras distintas no hay nada que dividir: ${f(bien)} palabras.` },
          ],
          respuesta: `${f(bien)} palabras distintas`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), pal = r.de(['PERU', 'PUNO', 'LLAMA', 'CUSCO', 'COCA', 'PAPAYA', 'TACNA', 'CALLAO', 'AMAZONAS', 'ARRAS']);
        const rs = repes(pal), div = rs.reduce((x, k) => x * fact(k), 1), bien = fact(pal.length) / div;
        return {
          pregunta: `¿Cuántas palabras distintas se forman con todas las letras de ${pal}?`,
          opciones: opciones(bien, [
            { id: 'todos', valor: fact(pal.length), error: 'AT-REPETIDOS', siFuera: rs.length ? 'Eso trata como distintas a letras iguales.' : 'Revisa: sí hay que ordenar todas.' },
            rs.length > 1
              ? { id: 'una', valor: fact(pal.length) / fact(rs[0]), error: 'AT-REPETIDOS', siFuera: 'Eso descuenta una letra repetida; hay que dividir también por la otra.' }
              : rs.length === 1
                ? { id: 'una', valor: fact(pal.length) / rs[0], error: 'AT-REPETIDOS', siFuera: `Se divide entre ${rs[0]}!, los órdenes de las letras iguales, no entre ${rs[0]}.` }
                : { id: 'una', valor: fact(pal.length - 1), error: 'AT-REPETIDOS', siFuera: 'Se ordenan todas las letras, no todas menos una.' },
            { id: 'resta', valor: fact(pal.length) - div, error: 'AT-REPETIDOS', siFuera: 'Lo repetido no se resta; cada palabra aparece varias veces y se divide.' },
          ]),
          solucion: { texto: rs.length ? 'Se divide entre los factoriales de las letras repetidas.' : 'Todas las letras son distintas.', ecuacion: [rs.length ? { frac: [`${pal.length}!`, rs.map(k => `${k}!`).join(' · ')] } : `${pal.length}!`, ` = ${f(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: combinaciones: el orden no importa ----------
  // Cambia: cuántas personas hay y cuántas se eligen. Permanece: una fila por grupo, con cuántos órdenes tiene.
  // Se reserva: cargos distintos (presidente y secretario). Debe verse: cada grupo de r junta r! órdenes.
  const equipos = (n, r) => ({ columnas: [{ t: 'grupo', color: 'd' }, { t: 'órdenes', color: 'h' }], filasMax: 10,
    filas: combinaciones(LET.slice(0, n), r).map(c => [c.join(' '), String(fact(r))]) });
  const combis = {
    id: 'combinaciones',
    titulo: 'Elegir no es ordenar',
    temas: ['Combinaciones y números combinatorios'],
    pieza: 'arit-tabla',
    lee: {
      tarjetas: [
        { titulo: 'Elegir un grupo', texto: 'Para la feria de ciencias de tu colegio en Juliaca, el profesor elige a algunos estudiantes del aula. Un grupo se nombra por quiénes están en él.' },
        { titulo: 'Con cargo o sin cargo', texto: 'A veces cada elegido recibe un cargo, como presidente o tesorero. Otras veces todos van con el mismo encargo. Lee bien el problema para saber en cuál de los dos casos estás.' },
        { titulo: 'Qué mirar', texto: 'En la tabla, cada fila es un grupo, escrito con letras. A su lado está cuántos órdenes distintos tiene ese grupo. Cambia cuántos se eligen y mira esa columna.' },
      ],
    },
    juega: {
      consigna: 'De n amigos se elige un grupo de r, sin cargos. Cada fila es un grupo; al lado, cuántos órdenes junta.',
      voz: 'Un grupo es el mismo, lo nombres en el orden que sea.',
      controles: [
        { id: 'n', etiqueta: 'n', color: 'c-o', min: 3, max: 5, paso: 1, inicio: 4, decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: equipos(v.n, v.r), estado: {} }),
      lectura: v => [`${C(v.n, v.r)} grupos · ${V(v.n, v.r)} órdenes`],
      minimo: 3,
    },
    predice: {
      pregunta: 'De 5 personas se elige un presidente y un secretario. ¿De cuántas formas?',
      opciones: [
        { id: 'c', texto: '20', correcta: true },
        { id: 'comb', texto: '10', error: 'AR17', siFuera: '10 sería cierto si fueran dos cargos iguales. Presidente y secretario no se intercambian.' },
        { id: 'pot', texto: '25', error: 'AR19', siFuera: 'Eso deja que una persona tenga los dos cargos.' },
        { id: 'suma', texto: '9', error: 'AT-SUMA-PRODUCTO', siFuera: 'Las etapas se multiplican: 5 para presidente y 4 para secretario.' },
      ],
      dibujo: { datos: equipos(5, 2), estado: {} },
      revelar: { datos: equipos(5, 2), estado: { columna: 1 } },
      coincide: 'Coincide: 10 grupos de dos, y cada uno da 2 formas de repartir los cargos.',
    },
    mira: {
      datos: equipos(5, 2),
      pasos: [
        { estado: { fila: 0 }, texto: 'Con cargos: 5 · 4 = 20. «A presidente, B secretario» no es «B, A».', ecuacion: [{ sub: ['V', '5,2'] }, ' = 20'] },
        { estado: { fila: 0, columna: 1 }, texto: 'Sin cargos, A B y B A son el mismo grupo: 2! órdenes.', ecuacion: ['2! = 2'] },
        { estado: { fila: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }, texto: 'Grupos: los 20 órdenes entre 2.', ecuacion: [{ sub: ['C', '5,2'] }, ' = ', { frac: ['20', '2'] }, ' = 10'] },
      ],
    },
    regla: {
      texto: 'Una combinación es un grupo sin orden. Se cuentan los órdenes y se divide entre los r! de cada grupo: da el número combinatorio.',
      ecuacion: [{ sub: ['C', [N, ',', R]] }, ' = ', { frac: [[N, '!'], [{ llave: [R, '!'], nota: 'por grupo', color: 'c-h' }, ' (', N, ' − ', R, ')!']] }, '   ·   ', { sub: ['C', [N, ',', R]] }, ' = ', { sub: ['C', [N, ',', N, ' − ', R]] }],
      condicion: 'objetos distintos y el orden no importa. Si los puestos tienen roles distintos, no se divide: es una variación.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), n = r.ent(5, 10), k = r.ent(2, 4), cargos = s % 3 === 1;
        const ord = V(n, k), grupos = C(n, k), factores = Array.from({ length: k }, (_, j) => n - j).join(' · ');
        return {
          enunciado: cargos ? `De ${n} postulantes se eligen ${k} para ${k} cargos distintos. ¿De cuántas formas?` : `De ${n} postulantes se elige una comisión de ${k}, sin cargos. ¿De cuántas formas?`,
          pasos: [
            { tipo: 'pide', texto: cargos ? `Piden de cuántas formas se reparten ${k} cargos distintos entre ${n} personas.` : `Piden cuántas comisiones distintas de ${k} personas hay.` },
            { tipo: 'datos', texto: [N, ` = ${n} postulantes, `, R, ` = ${k} elegidos. ${cargos ? 'Cada elegido tiene un cargo distinto.' : 'Todos tienen el mismo encargo.'}`] },
            { tipo: 'regla', texto: cargos ? 'Con cargos, el orden importa: ser presidente no es ser tesorero. Cuento los órdenes, cada cargo con una opción menos.' : 'En una comisión el orden no importa. Cuento como si hubiera cargos y divido entre los órdenes de cada grupo.' },
            cargos
              ? { tipo: 'cuentas', texto: `${k} cargos, de ${n} opciones para abajo.`, ecuacion: [{ sub: ['V', [N, ',', R]] }, ` = ${factores} = ${f(ord)}`] }
              : { tipo: 'cuentas', texto: `Con orden serían ${f(ord)}. Cada comisión aparece ${k}! = ${f(fact(k))} veces.`, ecuacion: [{ sub: ['C', [N, ',', R]] }, ' = ', { frac: [f(ord), `${k}!`] }, ` = ${f(grupos)}`] },
            { tipo: 'sentido', texto: cargos ? `Sin cargos serían ${f(ord)} ÷ ${k}! = ${f(grupos)} comisiones. Con cargos hay más, porque cada grupo se reparte de ${f(fact(k))} formas.` : `Elegir a los ${k} que entran es elegir a los ${n - k} que se quedan: C(${n}, ${n - k}) también da ${f(C(n, n - k))}.` },
          ],
          respuesta: `${f(cargos ? ord : grupos)} formas`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.ent(5, 10), k = r.ent(2, 4), cargos = s % 3 === 1;
        const bien = cargos ? V(n, k) : C(n, k);
        return {
          pregunta: cargos ? `De ${n} postulantes se eligen ${k} para ${k} cargos distintos. ¿De cuántas formas?` : `De ${n} postulantes se elige una comisión de ${k}, sin cargos. ¿De cuántas formas?`,
          opciones: opciones(bien, [
            { id: 'otro', valor: cargos ? C(n, k) : V(n, k), error: 'AR17', siFuera: cargos ? 'Dividir entre el orden vale si no hay cargos; aquí los hay.' : 'Eso cuenta con orden, pero una comisión no tiene cargos.' },
            { id: 'pot', valor: n ** k, error: 'AR19', siFuera: 'Eso deja repetir a una misma persona.' },
            { id: 'prod', valor: n * k, error: 'AT-SUMA-PRODUCTO', siFuera: `Eso multiplica n por k; hay que contar ${k} etapas.` },
          ]),
          solucion: {
            texto: cargos ? 'Hay orden: se cuentan las variaciones.' : 'Sin orden: las variaciones entre k!.',
            ecuacion: cargos ? [{ sub: ['V', `${n},${k}`] }, ` = ${f(bien)}`] : [{ sub: ['C', `${n},${k}`] }, ' = ', { frac: [`${f(V(n, k))}`, `${k}!`] }, ` = ${f(bien)}`],
          },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Grupos contra órdenes: una fila por cada r de 0 a 8; la de r y la de n − r tienen los mismos grupos. Con r > n no
  // hay forma de elegir: esas filas dan 0 y se ven atenuadas.
  // Opciones de cada puesto y su producto (los casilleros libres): las usan la lectura y los retos.
  const opcionesPuestos = v => Array.from({ length: v.r }, (_, k) => (v.rep === 'si' ? v.n : Math.max(0, v.n - k)));
  const formasPuestos = v => opcionesPuestos(v).reduce((a, b) => a * b, 1);
  const tablaGrupos = (n, r) => ({
    columnas: [{ t: 'r', color: 'i' }, { t: 'órdenes', color: 'd' }, { t: 'r!', color: 'h' }, { t: 'grupos', color: 'd' }], filasMax: 9,
    filas: Array.from({ length: 9 }, (_, k) => [{ t: String(k), color: 'i', tenue: k > n }, { t: f(V(n, k)), tenue: k > n }, { t: f(fact(k)), tenue: k > n }, { t: f(C(n, k)), color: 'd', resalta: k <= n && (k === r || k === n - r), tenue: k > n }]),
  });

  // Mesa 3D (ronda 4, docs/3d.md, 3D de contexto): el menú con postre. Con dos tiempos los menús son una tabla; con tres,
  // una caja: cada cubito es un menú. Cambia: cuántos platos hay de cada tiempo y lo que se fija · Permanece: un cubito
  // por menú · Progresa: la caja, que crece por un lado a la vez · Se reserva: el verde, para los menús con un plato fijo ·
  // Debe verse: «y» multiplica: entradas · segundos · postres. Las cuentas son MDa.multiplicacion (regla 1).
  const FIJA = { nada: 'Nada', entrada: 'La primera entrada', postre: 'El primer postre' };
  const menus3 = v => MDa.multiplicacion([v.e, v.s, v.p]);
  const fijos = v => (v.fija === 'entrada' ? MDa.multiplicacion([1, v.s, v.p]) : v.fija === 'postre' ? MDa.multiplicacion([v.e, v.s, 1]) : menus3(v));
  function datosMenu(v) {
    const bloques = [];
    for (let k = 0; k < v.p; k++) for (let j = 0; j < v.s; j++) for (let i = 0; i < v.e; i++)
      bloques.push({ x: i, y: j, z: k, g: (v.fija === 'entrada' ? i === 0 : v.fija === 'postre' ? k === 0 : true) ? 0 : 1 });
    return {
      bloques,
      grupos: [
        { nombre: v.fija === 'nada' ? 'menús' : 'menús con ese plato fijo', color: 'c-d', dice: `${fijos(v)} menús` + (v.fija === 'nada' ? '' : ` con ${FIJA[v.fija].toLowerCase()}`) },
        { nombre: 'menús con otro plato', dice: `${menus3(v) - fijos(v)} menús con otro plato` },
      ],
      // Cada tiempo junto a su lado, afuera de la caja (el margen crece con la caja, para no caer encima).
      marcas: (o => [
        { p: [v.e / 2, -o, 0], texto: `${v.e} ${v.e === 1 ? 'entrada' : 'entradas'}`, color: 'c-o' },
        { p: [v.e + o, v.s * 0.6, 0], texto: `${v.s} ${v.s === 1 ? 'segundo' : 'segundos'}`, color: 'c-i' },
        { p: [-o, -o, v.p / 2], texto: `${v.p} ${v.p === 1 ? 'postre' : 'postres'}`, color: 'c-f' },
      ])(0.9 + 0.2 * Math.max(v.e, v.s, v.p)),
      alt: `Caja de ${v.e} por ${v.s} por ${v.p}: ${menus3(v)} menús distintos` + (v.fija === 'nada' ? '.' : `, ${fijos(v)} de ellos en verde, con ${FIJA[v.fija].toLowerCase()}.`),
    };
  }
  const mesaMenu = {
    id: 'menu-con-postre', titulo: 'El menú con postre', pieza: 'ari-cubitos-3d',
    consigna: 'Cada cubito es un menú: una entrada, un segundo y un postre. Gira la caja y cambia cuántos platos hay.',
    controles: [
      { id: 'e', etiqueta: 'Entradas', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 2, decimales: 0 },
      { id: 's', etiqueta: 'Segundos', color: 'c-i', min: 1, max: 5, paso: 1, inicio: 3, decimales: 0 },
      { id: 'p', etiqueta: 'Postres', color: 'c-f', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
      { id: 'fija', etiqueta: 'Fija', opciones: Object.keys(FIJA).map(k => ({ valor: k, texto: FIJA[k] })) },
    ],
    dibujo: v => ({ datos: datosMenu(v), estado: {} }),
    lectura: v => [`${v.e} · ${v.s} · ${v.p} = `, { v: 'c-d', t: String(menus3(v)) }, ' menús' + (v.fija === 'nada' ? '' : `; ${fijos(v)} en verde`)],
    invitaciones: [
      { texto: 'Con al menos dos platos de cada tiempo, arma justo 24 menús.',
        logrado: v => v.e > 1 && v.s > 1 && v.p > 1 && menus3(v) === 24,
        bien: 'Cada lado de la caja multiplica: 24 cubitos, ninguno repetido.',
        pista: 'Busca tres números, de 2 o más, que multiplicados den 24.' },
      { texto: 'Con 9 platos en total, consigue la mayor cantidad de menús.',
        logrado: v => v.e + v.s + v.p === 9 && menus3(v) === 27,
        bien: 'Repartir parejo da más: 3 · 3 · 3 = 27 le gana a 2 · 3 · 4 = 24.',
        pista: 'Reparte los 9 platos lo más parejo que puedas.' },
      { texto: 'Fija la primera entrada en una caja de 3 × 3 × 3: ¿cuántos menús quedan?',
        logrado: v => v.e === 3 && v.s === 3 && v.p === 3 && v.fija === 'entrada',
        bien: 'Una capa de 3 · 3 = 9: fijar un plato quita un factor.',
        pista: 'Pon 3 en cada tiempo y elige «La primera entrada».' },
      { texto: 'Guarda dos casos con los mismos menús y cajas de distinta forma.',
        logrado: (v, g) => g.some(x => g.some(y => menus3(x) === menus3(y) && [x.e, x.s, x.p].sort().join() !== [y.e, y.s, y.p].sort().join())),
        bien: 'El orden de los factores no cambia el producto, pero la caja sí cambia.',
        pista: 'Prueba 2 · 2 · 3 y después 4 · 3 · 1. Guarda los dos.' },
    ],
  };

  return {
    unidad: 'aritmetica.analisis-combinatorio',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-fichas.js', '/plantillas/probabilidad-dados/motor.js', '/nucleo/kit/piezas/ari-cubitos-3d.js'],
    // Glosario por tema (docs/teoria.md, 4d). «Variación» aquí es la de contar; la «variación porcentual» es de porcentajes.
    glosario: [
      { termino: 'principio de multiplicación', def: 'Si una tarea se hace en etapas seguidas, las formas de cada etapa se multiplican entre sí.',
        ejemplo: '2 entradas y 3 segundos: 2 · 3 = 6 menús.', ver: ['principio de adición'] },
      { termino: 'principio de adición', def: 'Si se elige una sola opción entre grupos que no comparten nada, las formas de cada grupo se suman.',
        ejemplo: '3 combis o 2 buses: 3 + 2 = 5 formas de viajar.', ver: ['principio de multiplicación'] },
      { termino: 'factorial', simbolo: 'n!', def: 'Producto de los enteros de 1 hasta n: cuenta las formas de ordenar n objetos distintos. Además, 0! = 1.',
        ejemplo: '5! = 5 · 4 · 3 · 2 · 1 = 120.', ver: ['permutación'] },
      { termino: 'variación', simbolo: 'V', def: 'Cada forma de elegir r objetos de n y ponerlos en orden: el orden sí importa.',
        ejemplo: 'Presidente y secretario entre 5 personas: 5 · 4 = 20.', ver: ['combinación', 'permutación'] },
      { termino: 'permutación', def: 'Cada forma de ordenar en fila todos los objetos de un grupo; con n distintos hay n!.',
        ejemplo: '4 libros en un estante: 4! = 24 órdenes.', ver: ['factorial', 'variación'] },
      { termino: 'permutación circular', formas: ['permutación circular', 'permutaciones circulares'],
        def: 'Orden en ronda, donde girar a todos no cambia nada; con n objetos distintos hay (n − 1)!.',
        ejemplo: '5 amigos en una mesa redonda: 4! = 24.', ver: ['permutación'] },
      { termino: 'permutación con repetición', formas: ['permutación con repetición', 'permutaciones con repetición'],
        def: 'Orden de objetos donde algunos son iguales: n! se divide entre el factorial de cada grupo de iguales.',
        ejemplo: 'Las letras de CASA: 4! ÷ 2! = 12 palabras.', ver: ['permutación', 'factorial'] },
      { termino: 'anagrama', formas: ['anagrama', 'anagramas'], def: 'Palabra que sale al cambiar de orden todas las letras de otra, tenga sentido o no.',
        ejemplo: 'AMOR y RAMO salen de las letras de ROMA.', ver: ['permutación con repetición'] },
      { termino: 'combinación', def: 'Grupo de r objetos elegidos entre n, sin importar el orden: A con B es igual a B con A.',
        ejemplo: 'Comisión de 2 entre 5 personas: 20 ÷ 2 = 10.', ver: ['variación', 'número combinatorio'] },
      { termino: 'independiente', formas: ['independiente', 'independientes'],
        def: 'Se dice de etapas o eventos en que lo ocurrido en uno no cambia lo que puede pasar en otro.',
        ejemplo: 'Dos dados: lo que sale en el primero no cambia el segundo.', ver: ['principio de multiplicación'] },
      { termino: 'número combinatorio', simbolo: 'C', formas: ['número combinatorio', 'números combinatorios'],
        def: 'Cuántos grupos distintos de r se forman con n objetos: n! entre r! y entre (n − r)!.',
        ejemplo: 'C(5, 2) = 120 ÷ (2 · 6) = 10.', ver: ['combinación'] },
    ],
    // Laboratorio: juego libre, sin preguntas. Los casilleros libres juntan con y sin repetición y el caso de más puestos
    // que personas; la tabla de grupos compara órdenes y grupos para todo r a la vez; la tercera es el menú de la idea 1.
    laboratorio: [
      mesaMenu,
      {
        id: 'casilleros-libres', titulo: 'Casilleros con y sin repetir', pieza: 'arit-tabla',
        consigna: 'Llena r puestos con n objetos. Elige si un objeto puede repetirse. Prueba más puestos que objetos.',
        controles: [
          { id: 'n', etiqueta: 'n', color: 'c-o', min: 2, max: 10, paso: 1, inicio: 4, decimales: 0 },
          { id: 'r', etiqueta: 'r', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 },
          { id: 'rep', etiqueta: 'Repetir', opciones: [{ valor: 'no', texto: 'sin repetir' }, { valor: 'si', texto: 'se puede repetir' }] },
        ],
        dibujo: v => ({ datos: casilleros(v.n, v.r, v.rep === 'si'), estado: { paso: v.r } }),
        lectura: v => {
          const xs = opcionesPuestos(v);
          return [`${v.rep === 'si' ? 'repitiendo' : 'sin repetir'}: ${xs.join(' · ')} = ${f(formasPuestos(v))}`];
        },
        invitaciones: [
          { texto: 'Consigue justo 120 formas sin repetir.',
            logrado: v => v.rep === 'no' && formasPuestos(v) === 120,
            bien: 'Hay más de un camino a 120. ¿Cuántos encontraste?' },
          { texto: 'Sin repetir, pon más puestos que objetos.',
            logrado: v => v.rep === 'no' && v.r > v.n && formasPuestos(v) === 0,
            bien: 'A algún puesto no le queda nadie: cero formas.' },
          { texto: 'Busca la mayor cantidad de formas que permiten los controles.',
            logrado: v => formasPuestos(v) === Math.pow(10, 6),
            bien: 'Un millón: cada uno de los 6 puestos tiene sus 10 opciones.' },
          { texto: 'Guarda el mismo n y r dos veces: una sin repetir y otra repitiendo.',
            logrado: (v, gs) => gs.some(g => g.n === v.n && g.r === v.r && g.rep !== v.rep && formasPuestos(g) !== formasPuestos(v)),
            bien: 'Repetir da más formas: cada puesto conserva todas sus opciones.' },
        ],
        arrastres: [manijaPuestos(v => casilleros(v.n, v.r, v.rep === 'si'))],
      },
      {
        id: 'grupos-ordenes', titulo: 'Órdenes contra grupos', pieza: 'arit-tabla',
        consigna: 'Cada fila elige r de n. Compara los órdenes con los grupos. ¿Qué otra fila tiene los mismos grupos? Prueba r mayor que n.',
        controles: [
          { id: 'n', etiqueta: 'n', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 5, decimales: 0 },
          { id: 'r', etiqueta: 'r', color: 'c-i', min: 0, max: 8, paso: 1, inicio: 2, decimales: 0 },
        ],
        dibujo: v => ({ datos: tablaGrupos(v.n, v.r), estado: { fila: v.r } }),
        lectura: v => [`n = ${v.n}, r = ${v.r}: ${f(V(v.n, v.r))} órdenes ÷ ${f(fact(v.r))} = ${f(C(v.n, v.r))} grupos`],
        invitaciones: [
          { texto: 'Busca una fila donde órdenes y grupos coincidan, con r mayor que 0.',
            logrado: v => v.r >= 1 && v.r <= v.n && V(v.n, v.r) === C(v.n, v.r),
            bien: 'Con un solo elegido no hay nada que ordenar: 1! = 1.' },
          { texto: 'Consigue justo 35 grupos.',
            logrado: v => C(v.n, v.r) === 35,
            bien: 'Elegir 3 de 7 es dejar fuera 4: por eso también sale con r = 4.' },
          { texto: 'Con n = 8, busca la r que da más grupos.',
            logrado: v => v.n === 8 && [0, 1, 2, 3, 4, 5, 6, 7, 8].every(k => C(8, k) <= C(8, v.r)),
            bien: 'El máximo cae al medio: 70 grupos con r = 4.' },
          { texto: 'Guarda dos casos con el mismo n y los mismos grupos, pero distinta r.',
            logrado: (v, gs) => gs.some(g => g.n === v.n && g.r !== v.r && g.r <= g.n && v.r <= v.n && C(g.n, g.r) === C(v.n, v.r)),
            bien: 'Elegir r es lo mismo que dejar fuera n − r.' },
        ],
        // Se baja por la tabla: la fila tocada es r (la manija va en el borde de la columna r, sin tapar el número).
        arrastres: [{ id: 'fila-r', etiqueta: 'fila de r', color: 'c-i',
          donde: v => { const g = TABLA().geometria(tablaGrupos(v.n, v.r)); return { x: g.xs[1], y: g.celda(v.r, 0).y }; },
          mover: (pt, v) => ({ r: filasHasta(TABLA().geometria(tablaGrupos(v.n, v.r)), pt.y) - 0.5 }) }],
      },
      Object.assign({ id: 'menu', titulo: 'El menú', pieza: 'arit-tabla',
        invitaciones: [
          { texto: 'Arma justo 12 menús distintos.',
            logrado: v => menus(v) === 12,
            bien: 'Doce puntos: cada entrada va con cada segundo.' },
          { texto: 'Con 6 platos en total, consigue la mayor cantidad de menús.',
            logrado: v => v.e + v.s === 6 && [1, 2, 3, 4, 5].every(e => e * (6 - e) <= menus(v)),
            bien: 'Repartir parejo da más: 3 · 3 = 9 le gana a 2 · 4 = 8.' },
          { texto: 'Guarda dos casos con los mismos menús y distinto número de entradas.',
            logrado: (v, gs) => gs.some(g => g.e !== v.e && menus(g) === menus(v)),
            bien: 'Filas por columnas: girar el rectángulo no cambia los puntos.' },
        ] }, principios.juega),
    ],
    historia: {
      texto: 'El triángulo aritmético, que reúne las cuentas de esta unidad, se conocía en varias tradiciones antes de Pascal. Su aporte fue estudiar con orden sus propiedades y usos. La dificultad de entonces es la de hoy: decidir qué resultados cuentan como distintos. El orden y la repetición cambian lo que se cuenta; la fórmula viene después.',
      pregunta: '¿Cuándo dos resultados son en realidad el mismo?',
      fuente: { titulo: 'O’Connor y Robertson, Blaise Pascal — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Pascal/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'menu-con-postre': ['principios'],
      'casilleros-libres': ['variaciones'],
      'grupos-ordenes': ['combinaciones'],
      'menu': ['principios'],
    },
    ideas: [principios, variaciones, circular, repeticion, combis],
  };
});
