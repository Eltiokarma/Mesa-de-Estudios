/*
 * Teoría de «Razonamiento inductivo» (razonamiento-matematico.razonamiento-inductivo).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 7); historia: Hume y el problema de la inducción (SEP).
 * Precisión del curso: tres casos no prueban una fórmula; la regla sale de cómo se construye la figura.
 * Colores (regla 4): la figura n verde (c-d), lo que se agrega en cada paso naranja (c-o), el primer elemento turquesa
 * (c-i), lo que falla rojo (c-h).
 * Compañero: Faro (zorro). Códigos: RM2 (objeto entero), RMP1 (piezas compartidas); RMT-IND-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: pasar de unos casos a una regla, y saber cuándo esa regla está probada y cuándo es una apuesta.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: escribe la regla de una figura que crece, explica por qué y detecta un patrón que se rompe.
 *   Orden de atención: 1.º la figura que crece · 2.º la lectura con el conteo · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «si funciona en tres casos, ¿ya está?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const n = { v: 'c-d', t: 'n' }, P = { v: 'c-o', t: 'P' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opcionesNum(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: f(correcta), correcta: true }];
    for (const x of distractores) { if (vistos.has(x.valor) || !Number.isFinite(x.valor) || x.valor < 0 || ops.length >= 4) continue; vistos.add(x.valor); ops.push({ id: x.id, texto: f(x.valor), error: x.error, siFuera: x.siFuera }); }
    return ops;
  }

  // ---------- Idea 1: figuras que crecen (palitos) ----------
  // Cambia: cuántos cuadrados · Permanece: el primer cuadrado de 4 palitos · Progresa: los 3 palitos que agrega cada
  // cuadrado · Se reserva: la figura 20, que no se dibuja · Debe verse: el lado compartido no se cuenta dos veces.
  function palitos(k, forma = 'cuadrado', extra = {}) {
    const lineas = [];
    const L = Math.min(2, 8.6 / Math.max(k, 1));
    const x0 = 5 - (k * L) / 2;
    const y0 = forma === 'doble' ? 1.6 : 2.4;
    for (let i = 0; i < k; i++) {
      const a = x0 + i * L, b = a + L, nuevo = i > 0 ? 'o' : 'i';
      if (forma === 'cuadrado' || forma === 'doble') {
        const filas = forma === 'doble' ? 2 : 1;
        for (let fi = 0; fi < filas; fi++) {
          const ya = y0 + fi * L, yb = ya + L;
          if (fi === 0) lineas.push({ de: [a, ya], a: [b, ya], color: nuevo });           // arriba
          lineas.push({ de: [a, yb], a: [b, yb], color: nuevo });                          // abajo
          lineas.push({ de: [b, ya], a: [b, yb], color: nuevo });                          // derecha
          if (i === 0) lineas.push({ de: [a, ya], a: [a, yb], color: 'i' });               // izquierda del primero
        }
      }
    }
    if (forma === 'triangulo') {
      // Fila de k triángulos alternados (arriba, abajo, …) entre dos rectas.
      const h = L * 0.87, top = y0, bot = y0 + h;
      for (let i = 0; i < k; i++) {
        const nuevo = i > 0 ? 'o' : 'i', a = x0 + i * L / 2;
        if (i % 2 === 0) { // triángulo con la base abajo
          lineas.push({ de: [a, bot], a: [a + L, bot], color: nuevo });
          if (i === 0) lineas.push({ de: [a, bot], a: [a + L / 2, top], color: 'i' });
          lineas.push({ de: [a + L / 2, top], a: [a + L, bot], color: nuevo });
        } else {           // triángulo con la base arriba
          lineas.push({ de: [a, top], a: [a + L, top], color: nuevo });
          lineas.push({ de: [a + L, top], a: [a + L / 2, bot], color: nuevo });
        }
      }
    }
    return { ancho: 10, alto: 5, lineas: lineas.map(l => Object.assign(l, { grosor: 'variable' })), pie: extra.pie };
  }
  const FORMAS = {
    cuadrado: { nombre: 'cuadrados en fila', primero: 4, agrega: 3 },
    triangulo: { nombre: 'triángulos en fila', primero: 3, agrega: 2 },
    doble: { nombre: 'columnas de dos cuadrados', primero: 7, agrega: 5 },
  };
  const cuenta = (forma, k) => FORMAS[forma].primero + FORMAS[forma].agrega * (k - 1);
  const figuras = {
    id: 'figuras-que-crecen',
    titulo: 'La regla sale de construir',
    temas: ['Inducción con figuras'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Una fila de cuadrados hecha con palitos. Agrega cuadrados y cuenta: el primero va en turquesa; lo que agrega cada uno nuevo, en naranja.',
      voz: 'Cuenta solo los palitos naranjas que trae cada cuadrado.',
      controles: [{ id: 'k', etiqueta: 'Cuadrados', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0, color: 'c-d' }],
      dibujo: val => ({ datos: palitos(val.k), estado: {} }),
      lectura: val => [P, ` = 4 + 3 · ${val.k - 1} = ${cuenta('cuadrado', val.k)} palitos`],
      minimo: 4,
    },
    predice: {
      pregunta: '¿Cuántos palitos tiene la fila de 20 cuadrados?',
      opciones: [
        { id: 'cuatro', texto: '80', error: 'RMP1', siFuera: '80 sería si cada cuadrado tuviera sus 4 palitos propios; los vecinos comparten uno.' },
        { id: 'prop', texto: '64', error: 'RM2', siFuera: '64 es 4 veces la figura de 5 (16). La figura no es proporcional: el palito inicial no se repite.' },
        { id: 'c', texto: '61', correcta: true },
        { id: 'tres', texto: '60', error: 'RMT-IND-1', siFuera: '60 es 3 · 20: falta el palito izquierdo del primer cuadrado.' },
      ],
      dibujo: { datos: palitos(3), estado: {} },
      revelar: { datos: palitos(3, 'cuadrado', { pie: '4 + 3 · 19 = 61 palitos' }), estado: {} },
      coincide: 'Coincide: el primero trae 4 y cada uno de los otros 19 trae 3.',
    },
    mira: {
      datos: palitos(4, 'cuadrado'),
      pasos: [
        { estado: { corte: 0 }, texto: 'El primer cuadrado usa 4 palitos.', ecuacion: ['figura 1: 4'] },
        { estado: { corte: 0 }, texto: 'Cada cuadrado nuevo comparte un lado: trae solo 3.', ecuacion: ['figura 4: 4 + 3 + 3 + 3 = 13'] },
        { estado: { corte: 0 }, texto: 'Con n cuadrados: 4 más 3 por cada uno de los otros n − 1.', ecuacion: [P, ' = 4 + 3(', n, ' − 1) = 3', n, ' + 1'] },
      ],
    },
    regla: {
      texto: 'Una fórmula vale para todas las figuras cuando sale de cómo se construyen: lo que pone la primera más lo que agrega cada paso.',
      ecuacion: [P, ' = (primera) + (lo que agrega) · (', n, ' − 1)'],
      condicion: 'cada figura se arma desde la anterior siempre de la misma manera; ver tres casos no basta sin conocer la construcción.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Mira qué trae la primera figura y qué agrega cada paso.',
      generar(s) {
        const r = azar(s), forma = ['cuadrado', 'triangulo', 'doble'][s % 3], k = r.ent(10, 40), F = FORMAS[forma];
        const bien = cuenta(forma, k);
        return {
          pregunta: `Una figura de ${F.nombre}, hecha con palitos. ¿Cuántos palitos tiene la figura ${k}?`,
          dibujo: { datos: palitos(3, forma, { pie: `Figuras 1 a 3: ${cuenta(forma, 1)}, ${cuenta(forma, 2)}, ${cuenta(forma, 3)} palitos` }), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'todos', valor: F.primero * k, error: 'RMP1', siFuera: 'Cuenta dos veces los palitos compartidos.' },
            { id: 'prop', valor: Math.round(cuenta(forma, 3) * k / 3), error: 'RM2', siFuera: 'La figura no crece en proporción: el inicio no se repite.' },
            { id: 'sin1', valor: F.agrega * k, error: 'RMT-IND-1', siFuera: 'Falta el palito extra de la primera figura.' },
            { id: 'uno', valor: cuenta(forma, k + 1), error: 'RMT-IND-2', siFuera: 'Esa es la figura siguiente.' },
          ]),
          solucion: { texto: `La primera trae ${F.primero} y cada una de las otras ${k - 1} agrega ${F.agrega}.`, ecuacion: [P, ` = ${F.primero} + ${F.agrega} · ${k - 1} = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 2: tres casos no prueban ----------
  // Cambia: cuántos puntos en la circunferencia · Permanece: se unen todos con todos · Progresa: las regiones 1, 2, 4, 8, 16 ·
  // Se reserva: 6 puntos, donde la duplicación falla · Debe verse: un patrón visto es una hipótesis.
  const regiones = k => { const C = (a, b) => (b < 0 || b > a ? 0 : [...Array(b)].reduce((m, _, i) => m * (a - i) / (i + 1), 1)); return C(k, 4) + C(k, 2) + 1; };
  function cuerdas(k, extra = {}) {
    // Ángulos irregulares para que no se crucen tres cuerdas en un punto (así sale el máximo de regiones).
    const ANG = [0, 1.15, 2.05, 3.3, 4.2, 5.25];
    const pts = Array.from({ length: k }, (_, i) => [5 + 2.6 * Math.sin(ANG[i]), 3 - 2.6 * Math.cos(ANG[i])]);
    const lineas = [];
    for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) lineas.push({ de: pts[i], a: pts[j], color: 'o', grosor: 'contorno' });
    return {
      ancho: 10, alto: 6,
      circulos: [{ x: 5, y: 3, r: 2.6, relleno: 0.05, grosor: 'contorno' }],
      lineas,
      nodos: pts.map(([x, y], i) => ({ id: 'p' + i, x, y, r: 6, relleno: 1, color: 'd' })),
      pie: extra.pie,
    };
  }
  const tresCasos = {
    id: 'tres-casos-no-prueban',
    titulo: 'Tres casos no prueban',
    temas: ['Inducción verbal', 'Inducción numérica'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Pon puntos en una circunferencia y únelos todos con todos. Cuenta en cuántas regiones queda partido el círculo.',
      voz: 'Escribe con palabras qué parece pasar con cada punto nuevo.',
      controles: [{ id: 'k', etiqueta: 'Puntos', min: 1, max: 5, paso: 1, inicio: 1, decimales: 0, color: 'c-d' }],
      dibujo: val => ({ datos: cuerdas(val.k), estado: {} }),
      lectura: val => [`${val.k} puntos: ${regiones(val.k)} regiones`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Con 1, 2, 3, 4 y 5 puntos salen 1, 2, 4, 8 y 16 regiones. ¿Cuántas salen con 6 puntos?',
      opciones: [
        { id: 'doble', texto: '32', error: 'RMT-IND-3', siFuera: '32 sigue el patrón «se duplica», que vale hasta 5 puntos. Con 6, las cuerdas no alcanzan a duplicar.' },
        { id: 'c', texto: '31', correcta: true },
        { id: 'mas', texto: '24', error: 'RMT-IND-4', siFuera: '24 suma 8, como si la diferencia también se duplicara a medias.' },
      ],
      dibujo: { datos: cuerdas(5), estado: {} },
      revelar: { datos: cuerdas(6, { pie: '6 puntos: 31 regiones, no 32' }), estado: {} },
      coincide: 'Coincide: el patrón «se duplica» era una hipótesis, y con 6 puntos falla.',
    },
    mira: {
      datos: cuerdas(6),
      pasos: [
        { estado: { corte: 0 }, texto: 'Los casos 1, 2, 4, 8, 16 sugieren la regla «se duplica».', ecuacion: ['hipótesis: ', { sup: ['2', 'k − 1'] }] },
        { estado: { corte: 0 }, texto: 'Con 6 puntos se cuentan 31 regiones: la hipótesis falla.', ecuacion: [{ sup: ['2', '5'] }, ' = 32 ≠ 31'] },
        { estado: { corte: 0 }, texto: 'La regla correcta sale de contar cruces y cuerdas.', ecuacion: ['regiones = 1 + cuerdas + cruces'] },
      ],
    },
    regla: {
      texto: 'Lo que se ve en algunos casos es una hipótesis. Se acepta como regla solo si se explica por qué vale siempre; si un caso la contradice, se descarta.',
      ecuacion: ['casos que cumplen ⇏ regla · un caso que no cumple ⇒ no hay regla'],
      condicion: 'para afirmar la regla hace falta un argumento, por ejemplo cómo se construye cada caso desde el anterior.',
    },
    ahoraTu: {
      voz: 'Prueba la regla en un caso más antes de creerla.',
      generar(s) {
        const r = azar(s);
        const tipo = s % 3;
        if (tipo === 0) {
          const k = r.ent(6, 8), bien = regiones(k);
          return {
            pregunta: `Con puntos en una circunferencia unidos todos con todos (sin tres cuerdas que se crucen en un punto), ¿cuántas regiones hay con ${k} puntos?`,
            opciones: opcionesNum(bien, [
              { id: 'doble', valor: 2 ** (k - 1), error: 'RMT-IND-3', siFuera: 'Esa es la hipótesis «se duplica», que falla desde 6 puntos.' },
              { id: 'menos', valor: 2 ** (k - 1) - 1, error: 'RMT-IND-4', siFuera: 'Restar uno a la duplicación tampoco es la regla.' },
              { id: 'cuerdas', valor: k * (k - 1) / 2, error: 'RMT-IND-5', siFuera: 'Esas son las cuerdas, no las regiones.' },
            ]),
            solucion: { texto: 'Regiones = 1 + número de cuerdas + número de cruces.', ecuacion: [`1 + ${k * (k - 1) / 2} + ${regiones(k) - 1 - k * (k - 1) / 2} = ${bien}`] },
          };
        }
        // Una sucesión con dos reglas posibles: el enunciado fija cuál.
        const a = r.ent(1, 5), seq = [a, 2 * a, 4 * a], regla = tipo === 1 ? 'duplica' : 'suma';
        const sig = regla === 'duplica' ? 8 * a : 4 * a + 3 * a;   // suma: diferencias a, 2a, 3a
        return {
          pregunta: `La sucesión empieza ${seq.join(', ')}. Si ${regla === 'duplica' ? 'cada término es el doble del anterior' : 'las diferencias entre términos aumentan de ' + a + ' en ' + a}, ¿cuál es el cuarto término?`,
          opciones: opcionesNum(sig, [
            { id: 'otra', valor: regla === 'duplica' ? 7 * a : 8 * a, error: 'RMT-IND-6', siFuera: 'Esa sigue la otra regla posible; el enunciado eligió esta.' },
            { id: 'mas', valor: 6 * a, error: 'RMT-IND-7', siFuera: `Eso suma ${2 * a} otra vez; la regla dada es otra.` },
            { id: 'cinco', valor: 5 * a, error: 'RMT-IND-7', siFuera: 'Eso suma la primera diferencia.' },
          ]),
          solucion: { texto: 'Los tres primeros términos admiten varias reglas; la que dice el enunciado decide el cuarto.', ecuacion: [regla === 'duplica' ? `${4 * a} · 2 = ${sig}` : `${4 * a} + ${3 * a} = ${sig}`] },
        };
      },
    },
  };

  // ---------- Idea 3: sumas que se ven (impares y cuadrados) ----------
  // Cambia: cuántos impares se suman · Permanece: el cuadrado que crece por esquinas · Progresa: las L de colores ·
  // Se reserva: la suma de los primeros 20 impares · Debe verse: cada impar es una L que completa el cuadrado siguiente.
  function lCuadrado(k, extra = {}) {
    const N = Math.max(k, 1), col = ['i', 'o', 'd', 'h'];
    return {
      columnas: null, filas: null, ancho: 40,
      celdas: Array.from({ length: N }, (_, f2) => Array.from({ length: N }, (_, c2) => {
        const capa = Math.max(f2, c2);
        return capa < k ? { t: String(2 * capa + 1), color: col[capa % 4], resalto: col[capa % 4] } : '';
      })),
      notas: [{ t: extra.nota || (k === 1 ? '1 = 1 × 1' : `1 + … + ${2 * k - 1} = ${k} × ${k} = ${k * k}`) }],
    };
  }
  const impares = {
    id: 'impares-y-cuadrados',
    titulo: 'Impares que arman cuadrados',
    temas: ['Inducción numérica'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Cada número impar es una «L» de casillas. Agrega impares y mira qué figura forman juntas.',
      voz: 'Cuenta las casillas de cada lado del cuadrado.',
      controles: [{ id: 'k', etiqueta: 'Impares', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0, color: 'c-d' }],
      dibujo: val => ({ datos: lCuadrado(val.k), estado: {} }),
      lectura: val => [`Suma de ${val.k} impares = ${val.k} × ${val.k} = ${val.k * val.k}`],
      minimo: 4,
    },
    predice: {
      pregunta: '¿Cuánto suman los primeros 20 números impares: 1 + 3 + 5 + … + 39?',
      opciones: [
        { id: 'c', texto: '400', correcta: true },
        { id: 'mitad', texto: '200', error: 'RMT-IND-8', siFuera: '200 sería 20 · 20 / 2. Las L forman un cuadrado entero de 20 × 20.' },
        { id: 'trian', texto: '420', error: 'RMT-IND-9', siFuera: '420 es 20 · 21: esa es la cuenta de los pares 2 + 4 + … + 40.' },
        { id: 'ultimo', texto: '39', error: 'RMT-IND-10', siFuera: '39 es el último impar, no la suma.' },
      ],
      dibujo: { datos: lCuadrado(4, { nota: '1 + 3 + 5 + 7' }), estado: {} },
      revelar: { datos: lCuadrado(6, { nota: '20 L forman 20 × 20 = 400' }), estado: {} },
      coincide: 'Coincide: 20 L forman un cuadrado de 20 por 20.',
    },
    mira: {
      datos: lCuadrado(4),
      pasos: [
        { estado: { corte: 0 }, texto: 'Un cuadrado de 3 × 3 tiene 9 casillas.', ecuacion: ['1 + 3 + 5 = 9'] },
        { estado: { corte: 0 }, texto: 'Para llegar a 4 × 4 se agrega una L de 3 + 3 + 1 = 7.', ecuacion: ['9 + 7 = 16'] },
        { estado: { corte: 0 }, texto: 'La L que va de n − 1 a n tiene 2n − 1 casillas.', ecuacion: [{ sup: [n, '2'] }, ' − ', { sup: [['(', n, ' − 1)'], '2'] }, ' = 2', n, ' − 1'] },
      ],
    },
    regla: {
      texto: 'La suma de los primeros n impares es n²: cada impar es la L que convierte un cuadrado en el siguiente. El dibujo explica por qué vale para todo n.',
      ecuacion: ['1 + 3 + … + (2', n, ' − 1) = ', { sup: [n, '2'] }],
      condicion: 'se suman impares seguidos desde 1; si se empieza en otro impar, se resta el cuadrado que falta.',
    },
    ahoraTu: {
      pieza: 'rm-tablero',
      voz: 'Cuenta cuántos términos hay antes de usar la regla.',
      generar(s) {
        const r = azar(s), k = r.ent(8, 30), ultimo = 2 * k - 1, tipo = s % 2;
        const pregunta = tipo ? `¿Cuánto suman 1 + 3 + 5 + … + ${ultimo}?` : `¿Cuánto suman los primeros ${k} números impares?`;
        return {
          pregunta,
          dibujo: { datos: lCuadrado(3, { nota: '1 + 3 + 5 = 3 × 3' }), estado: {} },
          opciones: opcionesNum(k * k, [
            { id: 'ult', valor: ultimo * ultimo, error: 'RMT-IND-11', siFuera: `Se elevó el último impar; hay ${k} términos, no ${ultimo}.` },
            { id: 'pares', valor: k * (k + 1), error: 'RMT-IND-9', siFuera: 'Esa es la suma de los primeros pares.' },
            { id: 'mitad', valor: Math.round(k * k / 2), error: 'RMT-IND-8', siFuera: 'Las L forman el cuadrado entero.' },
          ]),
          solucion: { texto: tipo ? `Hay (${ultimo} + 1) / 2 = ${k} impares.` : `Los primeros ${k} impares forman un cuadrado de ${k} × ${k}.`, ecuacion: [`${k}² = ${k * k}`] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-matematico.razonamiento-inductivo',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-plano.js', '/nucleo/kit/piezas/rm-tablero.js'],
    historia: {
      texto: 'En 1739 y 1748, David Hume preguntó qué justifica pasar de lo observado a lo que no se ha observado. Esa duda filosófica es distinta de la inducción matemática, que es una demostración. En un examen, reconocer un patrón da una hipótesis: varias reglas pueden encajar con los mismos primeros términos.',
      pregunta: '¿Cuántos casos hacen falta para estar seguro?',
      fuente: { titulo: 'The Problem of Induction · Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/induction-problem/' },
    },
    ideas: [figuras, tresCasos, impares],
  };
});
