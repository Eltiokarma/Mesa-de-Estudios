/*
 * Teoría de «Arreglos numéricos y cuadrados mágicos» (razonamiento-matematico.arreglos-numericos).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 6); historia: Magic Squares, ETH Library.
 * Precisión del curso: la regla «centro = suma mágica / 3» es del cuadrado 3 × 3, no de todo arreglo.
 * Colores (regla 4): la suma de cada línea naranja (c-o), los vértices (que cuentan dos veces) rojo (c-h),
 * el centro turquesa (c-i), el total verde (c-d).
 * Compañero: Faro (zorro). Códigos: RMT-ARR-* nuevos (hipótesis); RMP1 (casillas compartidas contadas una vez).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: calcular la suma de cada línea antes de llenar el tablero, con el total y lo que se cuenta dos veces.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: halla la suma mágica, el centro del 3 × 3, la suma por lado de un polígono y si un reparto es posible.
 *   Orden de atención: 1.º el tablero o el polígono con sus números · 2.º la lectura de sumas · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿cómo sé la suma de cada fila sin terminar el cuadrado?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const S = { v: 'c-o', t: 'S' }, Tt = { v: 'c-d', t: 'T' }, Vv = { v: 'c-h', t: 'V' }, c = { v: 'c-i', t: 'c' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    r.barajar = xs => { const y = xs.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  function opcionesTexto(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const x of distractores) { if (vistos.has(x.texto) || ops.length >= 4) continue; vistos.add(x.texto); ops.push(x); }
    return ops;
  }
  const suma = xs => xs.reduce((m, x) => m + x, 0);
  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría que exporta rm-fichas. El cuadrado mágico y el
  // triángulo eligen conjuntos de números (no hay nada continuo que arrastrar): quedan con − y + y opciones.
  const FICHAS = () => Kit.piezas['rm-fichas'];
  function permutaciones(xs) {
    if (xs.length <= 1) return [xs.slice()];
    return xs.flatMap((x, i) => permutaciones(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p)));
  }

  // ---------- Idea 1: la suma mágica sale del total ----------
  // Cambia: desde qué número empieza el cuadrado 4 × 4 · Permanece: la forma del cuadrado · Progresa: el total y la suma
  // de cada fila · Se reserva: el centro del 3 × 3 · Debe verse: cada fila se lleva una parte igual del total.
  const DURER = [[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]];
  function cuadrado(m, extra = {}) {
    const n = m.length;
    return {
      columnas: Array(n).fill('').concat(['Suma']), filas: null, ancho: 52,
      celdas: m.map(fila => fila.map(x => (x === null ? '' : { t: String(x), color: extra.centro && fila === m[(n - 1) / 2] && x === fila[(n - 1) / 2] ? 'i' : undefined }))
        .concat([{ t: fila.every(x => x !== null) ? String(suma(fila)) : '', color: 'o', desde: extra.sumas || 0 }])),
      marcos: extra.marcos || [],
      notas: [{ t: extra.nota || `Total ${suma(m.flat().filter(x => x !== null))} entre ${n} filas` }],
    };
  }
  const desde4 = a => DURER.map(f => f.map(x => x + a - 1));
  const magico = {
    id: 'suma-magica',
    titulo: 'La suma mágica sale del total',
    temas: ['Cuadrados mágicos'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Un cuadrado mágico 4 × 4 usa 16 números seguidos, una vez cada uno. Cambia desde qué número empieza y mira la suma de cada fila.',
      voz: 'Compara la suma de una fila con el total de los 16.',
      controles: [{ id: 'a', etiqueta: 'Empieza en', min: 1, max: 5, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: cuadrado(desde4(val.a)), estado: {} }),
      lectura: val => { const T = suma(desde4(val.a).flat()); return [Tt, ` = ${T} · `, S, ` = ${T} / 4 = ${T / 4}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'En un cuadrado mágico 3 × 3 con los números del 1 al 9, ¿qué número va en la casilla del centro?',
      voz: 'Primero halla la suma de cada fila.',
      opciones: [
        { id: 'nueve', texto: '9', error: 'RMT-ARR-1', siFuera: 'El mayor al centro pasa en otros acertijos; aquí cuatro líneas lo comparten y lo fijan en 5.' },
        { id: 'quince', texto: '15', error: 'RMT-ARR-2', siFuera: '15 es la suma de cada fila; el centro es una sola casilla.' },
        { id: 'c', texto: '5', correcta: true },
        { id: 'cualquiera', texto: 'Cualquiera de los nueve', error: 'RMT-ARR-3', siFuera: 'Hay varios cuadrados mágicos 3 × 3, pero en todos el centro es 5.' },
      ],
      dibujo: { datos: cuadrado([[null, null, null], [null, null, null], [null, null, null]], { nota: 'Números del 1 al 9' }), estado: {} },
      revelar: { datos: cuadrado([[2, 7, 6], [9, 5, 1], [4, 3, 8]], { centro: true, nota: 'Cada fila, columna y diagonal suma 15' }), estado: {} },
      coincide: 'Coincide: en todo cuadrado mágico 3 × 3 con 1 a 9, el centro es 5.',
    },
    mira: {
      datos: cuadrado([[2, 7, 6], [9, 5, 1], [4, 3, 8]], {
        centro: true, sumas: 1,
        marcos: [{ f: 1, c: 0, ancho: 3, color: 'i', desde: 2 }, { f: 0, c: 1, alto: 3, color: 'i', desde: 2 }],
        nota: '4 líneas por el centro: 4 · 15 = 45 + 3c',
      }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Del 1 al 9 suman 45; tres filas iguales: 15 cada una.', ecuacion: [S, ' = 45 / 3 = 15'] },
        { estado: { corte: 1 }, texto: 'Cada fila suma 15.' },
        { estado: { corte: 2 }, texto: 'Por el centro pasan 4 líneas: suman 60.' },
        { estado: { corte: 2 }, texto: 'Esas líneas cubren las 9 casillas y el centro tres veces más.', ecuacion: ['60 = 45 + 3', c, '  ⇒  ', c, ' = 5'] },
      ],
    },
    regla: {
      texto: 'En un cuadrado mágico, cada fila se lleva la misma parte del total: se divide la suma de todos los números entre el número de filas.',
      ecuacion: [{ llave: [S], nota: 'cada fila', color: 'c-o' }, ' = ', { frac: [Tt, 'n'] }, '   ·   ', 'de 1 a ', { sup: ['n', '2'] }, ': ', S, ' = ', { frac: [['n(', { sup: ['n', '2'] }, ' + 1)'], '2'] }],
      condicion: 'cada número se usa una vez. «Centro = S / 3» vale solo en el 3 × 3, donde cuatro líneas pasan por el centro.',
    },
    ahoraTu: {
      pieza: 'rm-tablero',
      voz: 'Calcula el total antes de llenar casillas.',
      generar(s) {
        const r = azar(s), a = r.ent(1, 12), d = r.ent(1, 3), pide = s % 2 ? 'centro' : 'suma';
        const nums = Array.from({ length: 9 }, (_, k) => a + d * k), T = suma(nums), Sm = T / 3, cen = Sm / 3;
        const bien = pide === 'suma' ? Sm : cen;
        return {
          pregunta: `Un cuadrado mágico 3 × 3 usa una vez cada número: ${nums.join(', ')}. ¿Cuánto ${pide === 'suma' ? 'suma cada fila' : 'vale la casilla del centro'}?`,
          dibujo: { datos: cuadrado([[null, null, null], [null, null, null], [null, null, null]], { nota: `Números del ${a} al ${a + 8 * d}` }), estado: {} },
          opciones: opcionesTexto(String(bien), [
            { id: 'total', texto: String(T), error: 'RMT-ARR-2', siFuera: 'Ese es el total de los nueve; se reparte entre tres filas.' },
            { id: 'otro', texto: String(pide === 'suma' ? cen : Sm), error: 'RMT-ARR-2', siFuera: pide === 'suma' ? 'Ese es el centro, no la suma de una fila.' : 'Esa es la suma de una fila; el centro es la tercera parte.' },
            { id: 'mayor', texto: String(nums[8]), error: 'RMT-ARR-1', siFuera: 'El mayor no tiene por qué ir al centro.' },
            { id: 'medio', texto: String(pide === 'suma' ? nums[8] + nums[0] : nums[0] + nums[8]), error: 'RMT-ARR-4', siFuera: 'Sumar extremos no reparte el total.' },
          ]),
          solucion: { texto: pide === 'suma' ? 'El total entre tres filas.' : 'El centro es la tercera parte de la suma de una fila.', ecuacion: [S, ` = ${T} / 3 = ${Sm}`, ...(pide === 'centro' ? ['   ·   ', c, ` = ${Sm} / 3 = ${cen}`] : [])] },
        };
      },
    },
  };

  // ---------- Idea 2: arreglos en polígonos ----------
  // Cambia: qué números van en los vértices · Permanece: el triángulo con 1 a 6 · Progresa: la suma por lado · Se reserva:
  // el cuadrado con 1 a 8, donde la cuenta da la cota · Debe verse: los vértices se cuentan dos veces.
  const TRI = { v: [[5, 0.6], [1.4, 5.4], [8.6, 5.4]], m: [[3.2, 3], [5, 5.4], [6.8, 3]] };   // m: lados v0-v1, v1-v2, v2-v0
  function arregloTri(V, nums = [1, 2, 3, 4, 5, 6]) {
    for (const p of permutaciones(nums.filter(x => !V.includes(x)))) for (const q of permutaciones(V)) {
      const L = [q[0] + p[0] + q[1], q[1] + p[1] + q[2], q[2] + p[2] + q[0]];
      if (L[0] === L[1] && L[1] === L[2]) return { v: q, m: p, S: L[0] };
    }
    return null;
  }
  function dibujoTri(A, extra = {}) {
    return {
      ancho: 10, alto: 6.2,
      poligonos: [{ puntos: TRI.v, relleno: 0, grosor: 'contorno' }],
      nodos: TRI.v.map(([x, y], k) => ({ id: 'v' + k, x, y, t: A ? String(A.v[k]) : '', color: 'h', r: 16 }))
        .concat(TRI.m.map(([x, y], k) => ({ id: 'm' + k, x, y, t: A ? String(A.m[k]) : '', r: 16 }))),
      pie: extra.pie || (A ? `Cada lado suma ${A.S}` : ''),
    };
  }
  const VERT = { '1,2,3': [1, 2, 3], '4,5,6': [4, 5, 6], '1,3,5': [1, 3, 5], '2,4,6': [2, 4, 6] };
  // Cuadrado con 1 a 8 (4 vértices y 4 lados): la mayor suma por lado se busca entre todos los arreglos.
  const SQ = { v: [[1.6, 0.6], [8.4, 0.6], [8.4, 5.4], [1.6, 5.4]], m: [[5, 0.6], [8.4, 3], [5, 5.4], [1.6, 3]] };
  const mejorCuadrado = (() => {
    let mejor = null;
    for (const p of permutaciones([1, 2, 3, 4, 5, 6, 7, 8])) {
      const v = p.slice(0, 4), m = p.slice(4);
      const L = [0, 1, 2, 3].map(k => v[k] + m[k] + v[(k + 1) % 4]);
      if (L.every(x => x === L[0]) && (!mejor || L[0] > mejor.S)) mejor = { v, m, S: L[0] };
    }
    return mejor;
  })();
  const dibujoSq = (A, extra = {}) => ({
    ancho: 10, alto: 6.2,
    poligonos: [{ puntos: SQ.v, relleno: 0, grosor: 'contorno' }],
    nodos: SQ.v.map(([x, y], k) => ({ id: 'v' + k, x, y, t: A ? String(A.v[k]) : '', color: 'h', r: 16 })).concat(SQ.m.map(([x, y], k) => ({ id: 'm' + k, x, y, t: A ? String(A.m[k]) : '', r: 16 }))),
    pie: extra.pie,
  });
  const poligono = {
    id: 'vertices-dos-veces',
    titulo: 'Los vértices cuentan dos veces',
    temas: ['Arreglos en polígonos'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Los números del 1 al 6 van en el triángulo y cada lado debe sumar lo mismo. Elige qué números van en las esquinas.',
      voz: 'Fíjate en la suma de las esquinas y en la suma por lado.',
      controles: [{ id: 'V', etiqueta: 'Esquinas', opciones: Object.keys(VERT).map(k => ({ valor: k, texto: k.replace(/,/g, ', ') })) }],
      dibujo: val => ({ datos: dibujoTri(arregloTri(VERT[val.V])), estado: {} }),
      lectura: val => { const V = suma(VERT[val.V]); return [Vv, ` = ${V} · `, S, ` = (21 + ${V}) / 3 = ${(21 + V) / 3}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora un cuadrado con los números del 1 al 8: uno en cada esquina y uno en medio de cada lado. ¿Cuál es la mayor suma igual por lado?',
      opciones: [
        { id: 'tope', texto: '15,5', error: 'RMT-ARR-5', siFuera: 'Con 5, 6, 7 y 8 en las esquinas saldría 15,5, pero una suma de enteros no puede ser 15,5.' },
        { id: 'c', texto: String(mejorCuadrado.S), correcta: true },
        { id: 'nueve', texto: '9', error: 'RMP1', siFuera: '9 sería 36 / 4: olvida que las esquinas se cuentan dos veces.' },
        { id: 'veinti', texto: '21', error: 'RMT-ARR-6', siFuera: 'Eso pone los mayores en cada lado a la vez; cada número se usa una sola vez.' },
      ],
      dibujo: { datos: dibujoSq(null), estado: {} },
      revelar: { datos: dibujoSq(mejorCuadrado, { pie: `Cada lado suma ${mejorCuadrado.S}` }), estado: {} },
      coincide: 'Coincide: 4S = 36 + esquinas; la mayor suma de esquinas que deja S entero es 24.',
    },
    mira: {
      datos: Object.assign(dibujoTri(arregloTri([4, 5, 6])), { pie: undefined, textos: [{ x: 5, y: 6.75, t: '3S = 21 + (4 + 5 + 6) = 36', color: 'o', desde: 2 }] }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Al sumar los tres lados, cada número entra una vez…', ecuacion: ['1 + 2 + … + 6 = 21'] },
        { estado: { corte: 1 }, texto: '…y cada esquina entra dos veces: está en dos lados.', ecuacion: ['3', S, ' = 21 + ', Vv] },
        { estado: { corte: 2 }, texto: 'Esquinas mayores, suma por lado mayor.', ecuacion: [S, ' = (21 + 15) / 3 = 12'] },
      ],
    },
    regla: {
      texto: 'Al sumar todos los lados de un polígono, los números de las esquinas aparecen dos veces. Eso fija la suma por lado y cuáles son posibles.',
      ecuacion: ['lados · ', S, ' = ', { llave: [Tt], nota: 'total', color: 'c-d' }, ' + ', { llave: [Vv], nota: 'esquinas', color: 'c-h' }],
      condicion: 'cada número se usa una vez, cada esquina está en dos lados y la suma por lado tiene que ser entera.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Escribe la ecuación de los lados antes de probar.',
      generar(s) {
        const r = azar(s), a0 = r.ent(1, 5), nums = [0, 1, 2, 3, 4, 5].map(k => a0 + k), Tn = suma(nums);
        let V = null, A = null;
        while (!A) { V = r.barajar(nums).slice(0, 3).sort((p, q) => p - q); A = arregloTri(V, nums); }
        const Vs = suma(V), bien = (Tn + Vs) / 3;
        return {
          pregunta: `Los números del ${a0} al ${a0 + 5} van en un triángulo, con ${V.join(', ')} en las esquinas. Si cada lado suma lo mismo, ¿cuánto suma cada lado?`,
          dibujo: { datos: dibujoTri({ v: V, m: ['', '', ''], S: 0 }, { pie: ' ' }), estado: {} },
          opciones: opcionesTexto(String(bien), [
            { id: 'sin', texto: String(Tn / 3), error: 'RMP1', siFuera: `${Tn / 3} es ${Tn} / 3: no cuenta dos veces las esquinas.` },
            { id: 'total', texto: String(Tn + Vs), error: 'RMT-ARR-2', siFuera: 'Esa es la suma de los tres lados juntos.' },
            { id: 'esq', texto: String(Vs), error: 'RMT-ARR-4', siFuera: 'Esa es solo la suma de las esquinas.' },
            { id: 'dos', texto: String(Math.round((Tn + 2 * Vs) / 3)), error: 'RMT-ARR-7', siFuera: 'Las esquinas se cuentan dos veces, no tres.' },
          ]),
          solucion: { texto: `Los tres lados suman ${Tn} más las esquinas otra vez.`, ecuacion: ['3', S, ` = ${Tn} + ${Vs}  ⇒  `, S, ` = ${bien}`], dibujo: { datos: dibujoTri(A), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: repartir con condiciones ----------
  // Cambia: hasta qué número se reparte · Permanece: dos grupos que deben sumar igual · Progresa: el total y su paridad ·
  // Se reserva: el caso de total par que igual no se puede · Debe verse: total impar ⇒ imposible; par no basta.
  function particion(nums) {
    const T = suma(nums);
    if (T % 2) return null;
    const n = nums.length;
    for (let m = 0; m < 1 << n; m++) { let t = 0; for (let i = 0; i < n; i++) if (m >> i & 1) t += nums[i]; if (t === T / 2) return nums.filter((_, i) => m >> i & 1); }
    return null;
  }
  function grupos(nums, extra = {}) {
    const g = particion(nums);
    const ficha = (x, col) => ({ t: String(x), forma: 'cuadrado', color: col });
    return {
      filas: g ? [
        { rotulo: `Grupo 1 · suma ${suma(g)}`, caja: true, fichas: g.map(x => ficha(x, 'd')) },
        { rotulo: `Grupo 2 · suma ${suma(nums) - suma(g)}`, caja: true, fichas: nums.filter(x => !g.includes(x)).map(x => ficha(x, 'i')) },
      ] : [{ rotulo: `Total ${suma(nums)}`, caja: true, fichas: nums.map(x => ficha(x)) }, { rotulo: 'No hay reparto parejo', fichas: [] }],
      tam: 28,
      pie: extra.pie || `Total: ${suma(nums)} (${suma(nums) % 2 ? 'impar' : 'par'})`,
    };
  }
  const hasta = n => Array.from({ length: n }, (_, k) => k + 1);
  // El juego agrega una fila de arriba con los lugares de 1 a tope: los que entran van llenos y los demás, huecos.
  // Así la manija (el final de los que entran) tiene siempre el mismo lugar para cada n.
  function gruposConFila(nums, tope, extra) {
    const d = grupos(nums, extra);
    const fila = { rotulo: `Números: ${nums.length}`, fichas: Array.from({ length: tope }, (_, k) => k < nums.length ? { t: String(nums[k]), forma: 'cuadrado' } : { t: '', forma: 'cuadrado', hueca: true }) };
    return Object.assign(d, { filas: [fila].concat(d.filas), tam: Math.min(28, d.tam) });
  }
  // La manija va entre el último número que entra y el primer lugar hueco (o al final de la fila llena), en el borde
  // de abajo para no tapar las cifras.
  const finDeFila = (d, n) => { const g = FICHAS().geometria(d), fl = g.filas[0]; return { x: fl.fichas[0].cx + (n - 0.5) * fl.paso, y: fl.y + g.lado - 2 }; };
  const nDeFila = (d, pt) => { const g = FICHAS().geometria(d), fl = g.filas[0]; return (pt.x - fl.fichas[0].cx) / fl.paso + 0.5; };
  const reparto = {
    id: 'reparto-parejo',
    titulo: 'Repartir en dos sumas iguales',
    temas: ['Distribución de números con condiciones'],
    pieza: 'rm-fichas',
    juega: {
      consigna: 'Se reparten los números del 1 al n en dos grupos que sumen lo mismo. Cambia n y mira cuándo se puede.',
      voz: 'Mira si el total es par o impar.',
      controles: [{ id: 'n', etiqueta: 'n', min: 3, max: 8, paso: 1, inicio: 3, decimales: 0 }],
      dibujo: val => ({ datos: gruposConFila(hasta(val.n), 8), estado: {} }),
      lectura: val => { const T = suma(hasta(val.n)); return [Tt, ` = ${T}: `, T % 2 ? 'impar, no se puede' : `par, cada grupo ${T / 2}`]; },
      minimo: 4,
      // Arrastra el final de la fila de números: entran o salen números al reparto.
      arrastres: [{ id: 'hasta', etiqueta: 'hasta qué número se reparte', color: 'c-d',
        donde: val => finDeFila(gruposConFila(hasta(val.n), 8), val.n),
        mover: (pt, val) => ({ n: nDeFila(gruposConFila(hasta(val.n), 8), pt) }) }],
    },
    predice: {
      pregunta: 'Los números 2, 4, 6, 8 y 10 suman 30, que es par. ¿Se pueden repartir en dos grupos de igual suma?',
      opciones: [
        { id: 'si', texto: 'Sí: el total es par', error: 'RMT-ARR-8', siFuera: 'El total par es necesario, pero cada grupo debería sumar 15, y sumando pares nunca sale impar.' },
        { id: 'diez', texto: 'Sí: 10 con 4, y 2 con 6 y 8', error: 'RMT-ARR-9', siFuera: 'Suma otra vez: 10 + 4 = 14 y 2 + 6 + 8 = 16.' },
        { id: 'c', texto: 'No: cada grupo sumaría 15, y con pares no sale', correcta: true },
      ],
      dibujo: { datos: { filas: [{ rotulo: 'Números', caja: true, fichas: [2, 4, 6, 8, 10].map(x => ({ t: String(x), forma: 'cuadrado' })) }, { rotulo: ' ', fichas: [] }], tam: 28, pie: 'Total 30 (par)' }, estado: {} },
      revelar: { datos: grupos([2, 4, 6, 8, 10], { pie: 'Mitad 15: con pares no se llega' }), estado: {} },
      coincide: 'Coincide: el total par no basta; la mitad, 15, no se arma con números pares.',
    },
    mira: {
      datos: grupos([1, 2, 3, 4, 5, 6, 7]),
      pasos: [
        { estado: { corte: 0 }, texto: 'Del 1 al 7 suman 28: cada grupo debe sumar 14.', ecuacion: [Tt, ' = 28 ⇒ 14 y 14'] },
        { estado: { corte: 0 }, texto: 'Si el total fuera impar, no habría mitad entera.' },
        { estado: { corte: 0 }, texto: 'Total par no basta: si la mitad no se puede armar, no hay reparto.' },
      ],
    },
    regla: {
      texto: 'Para repartir en dos grupos de igual suma, el total debe ser par y cada grupo suma la mitad. Además, esa mitad se tiene que poder armar con los números.',
      ecuacion: ['cada grupo = ', { frac: [Tt, '2'] }],
      condicion: 'el total par es necesario pero no suficiente: hay que mostrar un reparto que cumpla.',
    },
    ahoraTu: {
      pieza: 'rm-fichas',
      voz: 'Calcula la mitad del total y busca quién la completa.',
      generar(s) {
        const r = azar(s), n = r.ent(4, 6);
        const nums = r.barajar([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 15, 20]).slice(0, n).sort((p, q) => p - q);
        const T = suma(nums), g = particion(nums);
        const bien = g ? 'Sí se puede' : T % 2 ? 'No: el total es impar' : 'No, aunque el total es par';
        return {
          pregunta: `¿Se pueden repartir ${nums.join(', ')} en dos grupos que sumen lo mismo?`,
          dibujo: { datos: { filas: [{ rotulo: 'Números', caja: true, fichas: nums.map(x => ({ t: String(x), forma: 'cuadrado' })) }, { rotulo: ' ', fichas: [] }], tam: 28, pie: ' ' }, estado: {} },
          opciones: [
            { id: 'si', texto: 'Sí se puede', error: 'RMT-ARR-8', siFuera: 'Busca un grupo que sume la mitad exacta: no existe.' },
            { id: 'impar', texto: 'No: el total es impar', error: 'RMT-ARR-10', siFuera: `Suma otra vez: el total es ${T}.` },
            { id: 'par', texto: 'No, aunque el total es par', error: 'RMT-ARR-9', siFuera: 'Hay un grupo que suma justo la mitad.' },
          ].map(o => (o.texto === bien ? { id: o.id, texto: o.texto, correcta: true } : o)),
          solucion: { texto: g ? `Total ${T}: un grupo suma ${T / 2} y el otro también.` : T % 2 ? `El total ${T} es impar: no hay mitad entera.` : `Total ${T}, pero ningún grupo suma ${T / 2}.`, dibujo: { datos: grupos(nums), estado: {} } },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: el reparto con números seguidos desde a hasta a + n − 1 (la idea solo empieza en 1): hasta 10 números.
  const seguidos = (a, n) => Array.from({ length: n }, (_, k) => a + k);
  const mesaReparto = {
    id: 'reparto-libre', titulo: 'Reparte números seguidos', pieza: 'rm-fichas',
    consigna: 'Elige desde qué número empiezas y arrastra el final de la fila. ¿Cuándo salen dos grupos de igual suma?',
    controles: [
      { id: 'a', etiqueta: 'Desde', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
      { id: 'n', etiqueta: 'Cuántos', color: 'c-d', min: 2, max: 10, paso: 1, inicio: 4, decimales: 0 },
    ],
    dibujo: val => ({ datos: Object.assign(gruposConFila(seguidos(val.a, val.n), 10), { tam: 22 }), estado: {} }),
    lectura: val => {
      const ns = seguidos(val.a, val.n), T = suma(ns);
      return [`Del ${val.a} al ${val.a + val.n - 1}: `, Tt, ` = ${T}`, T % 2 ? ', impar' : particion(ns) ? `, grupos de ${T / 2}` : ', par pero no sale'];
    },
    arrastres: [{ id: 'hasta', etiqueta: 'cuántos números se reparten', color: 'c-d',
      donde: val => finDeFila(Object.assign(gruposConFila(seguidos(val.a, val.n), 10), { tam: 22 }), val.n),
      mover: (pt, val) => ({ n: nDeFila(Object.assign(gruposConFila(seguidos(val.a, val.n), 10), { tam: 22 }), pt) }) }],
  };
  // Mesa 2: el cuadrado mágico 3 × 3 con números en progresión (a, a + d, …): el centro y la suma se mueven juntos.
  const LO_SHU = [[2, 7, 6], [9, 5, 1], [4, 3, 8]];
  const mesaMagico = {
    id: 'magico-libre', titulo: 'Cuadrado mágico con otros números', pieza: 'rm-tablero',
    consigna: 'Cambia el primer número y el salto entre números. Mira cómo cambian la suma por fila y el centro.',
    controles: [
      { id: 'a', etiqueta: 'Primer número', color: 'c-i', min: 1, max: 10, paso: 1, inicio: 1, decimales: 0 },
      { id: 'd', etiqueta: 'Salto', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 1, decimales: 0 },
    ],
    dibujo: val => ({ datos: cuadrado(LO_SHU.map(f => f.map(x => val.a + (x - 1) * val.d)), { centro: true, sumas: 0 }), estado: {} }),
    lectura: val => { const T = suma(LO_SHU.flat().map(x => val.a + (x - 1) * val.d)); return [S, ` = ${T / 3} · `, c, ` = ${T / 9}`]; },
  };
  // Mesa 3: el triángulo con esquinas libres: aparecen esquinas sin arreglo posible (el caso raro).
  const mesaTri = {
    id: 'triangulo-libre', titulo: 'Esquinas a elección', pieza: 'rm-plano',
    consigna: 'Elige tres esquinas distintas del 1 al 6. A veces la suma da entera y aun así no hay arreglo.',
    controles: ['Esquina 1', 'Esquina 2', 'Esquina 3'].map((e, k) => ({ id: 'e' + k, etiqueta: e, color: 'c-h', min: 1, max: 6, paso: 1, inicio: [1, 3, 5][k], decimales: 0 })),
    dibujo: val => {
      const V = [val.e0, val.e1, val.e2], ok = new Set(V).size === 3, A = ok ? arregloTri(V) : null;
      return { datos: dibujoTri(A || { v: V, m: ['', '', ''], S: 0 }, { pie: !ok ? 'Las esquinas se repiten' : A ? `Cada lado suma ${A.S}` : 'No hay arreglo con esas esquinas' }), estado: {} };
    },
    lectura: val => {
      const V = [val.e0, val.e1, val.e2];
      if (new Set(V).size < 3) return ['Elige tres esquinas distintas'];
      const Sv = (21 + suma(V)) / 3;
      return [Vv, ` = ${suma(V)} · `, S, ` = ${Number.isInteger(Sv) ? Sv : `${21 + suma(V)}/3`}`, arregloTri(V) ? '' : ' · sin arreglo'];
    },
  };

  return {
    unidad: 'razonamiento-matematico.arreglos-numericos',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-tablero.js', '/nucleo/kit/piezas/rm-plano.js', '/nucleo/kit/piezas/rm-fichas.js'],
    // Laboratorio: el reparto de números seguidos con arrastre, el cuadrado mágico en progresión y el triángulo con
    // esquinas libres (donde aparecen esquinas sin arreglo).
    laboratorio: [mesaReparto, mesaMagico, mesaTri],
    historia: {
      texto: 'Los cuadrados mágicos circularon por muchas culturas, con usos recreativos, simbólicos y matemáticos; en la Europa del siglo XVII se renovó el interés por construirlos. No tienen un único inventor. La pregunta útil es qué se mantiene cuando se mueven los números: la suma de cada fila se conoce antes de llenar el tablero.',
      pregunta: '¿Qué no cambia aunque cambies los números de lugar?',
      fuente: { titulo: 'Magic Squares · ETH Library', url: 'https://library.ethz.ch/en/collections-and-archives/platforms/virtual-exhibitions/Its-all-math-and-games/magic-squares.html' },
    },
    ideas: [magico, poligono, reparto],
  };
});
