/*
 * Teoría de «Máximos y mínimos» (razonamiento-matematico.maximos-y-minimos).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 13) y el desarrollo RM13 del expediente (personas,
 * precios, regiones y reflejos); historia: Dantzig, programación lineal (INFORMS).
 * Precisión: un extremo se demuestra con una cota y un caso que la alcanza; probar unos valores solo sugiere un candidato.
 * Colores (regla 4): lo que se optimiza naranja (c-o), la variable que se elige turquesa (c-i), el reflejo verde (c-d),
 * lo que sobra o se repite rojo (c-h).
 * Compañero: Faro (zorro). Códigos: RMT-MAX-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: encontrar el mejor caso y explicar por qué no hay uno mejor.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: halla el mínimo de personas, el precio que más recauda, el máximo de regiones y el camino más corto.
 *   Orden de atención: 1.º la figura o la gráfica · 2.º la lectura del valor · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿cómo sé que no hay uno mejor que este?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const p = { v: 'c-i', t: 'p' }, R = { v: 'c-o', t: 'R' }, n = { v: 'c-i', t: 'n' }, L = { v: 'c-o', t: 'L' };
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
    for (const x of distractores) { if (!x.texto || vistos.has(x.texto) || /NaN|Infinity/.test(x.texto) || ops.length >= 4) continue; vistos.add(x.texto); ops.push(x); }
    return ops;
  }

  const f0 = x => Kit.formatear(x, 0);
  const pl = (x, uno, varios) => `${f0(x)} ${x === 1 ? uno : varios}`;
  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría que exportan rm-fichas, ejes y rm-plano.
  const FICHAS = () => Kit.piezas['rm-fichas'], EJES = () => Kit.piezas.ejes, PLANO = () => Kit.piezas['rm-plano'];
  const enPlano = (d, q) => { const g = PLANO().geometria(d); return { x: g.X(q[0]), y: g.Y(q[1]) }; };
  const dePlano = (d, pt) => { const g = PLANO().geometria(d); return [(pt.x - g.X(0)) / g.k, (pt.y - g.Y(0)) / g.k]; };
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));
  // Todos los casos de los controles de una mesa (para los retos que piden «el menor» o «el mayor» de la mesa).
  const pasosDe = c => Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => +(c.min + k * c.paso).toFixed(6));
  const casosDe = ctr => ctr.reduce((acc, c) => acc.flatMap(v => pasosDe(c).map(x => Object.assign({}, v, { [c.id]: x }))), [{}]);
  const una = calc => { let m; return () => (m === undefined ? (m = calc()) : m); };

  // ---------- Idea 1: cantidad mínima de personas ----------
  // Cambia: cuántas personas tienen los dos papeles · Permanece: 3 docentes y 4 músicos · Progresa: el total que baja ·
  // Se reserva: tres papeles · Debe verse: una persona con dos etiquetas cuenta una vez.
  function gente(a, b, ambos, extra = {}) {
    const filas = [
      { rotulo: 'Docente y músico', fichas: Array.from({ length: ambos }, () => ({ t: 'DM', color: 'd', forma: 'circulo' })) },
      { rotulo: 'Solo docente', fichas: Array.from({ length: a - ambos }, () => ({ t: 'D', color: 'i' })) },
      { rotulo: 'Solo músico', fichas: Array.from({ length: b - ambos }, () => ({ t: 'M', color: 'o' })) },
    ];
    return { filas, tam: 30, pie: extra.pie || `Personas: ${a + b - ambos}` };
  }
  // El final de la fila de los que tienen los dos papeles, medido con la fila llena (3 fichas): medio paso después de
  // la última ficha, o al borde izquierdo si está vacía.
  const finFila = c0 => { const g = FICHAS().geometria(gente(3, 4, 3)), fl = g.filas[0]; return { x: fl.fichas[0].cx + (c0 - 0.5) * fl.paso, y: fl.y + g.lado / 2 }; };
  const personas = {
    id: 'minimo-personas',
    titulo: 'Menos personas, más papeles',
    temas: ['Cantidad mínima de personas u objetos'],
    pieza: 'rm-fichas',
    juega: {
      consigna: 'En una reunión hay 3 docentes y 4 músicos; una persona puede ser las dos cosas. Cambia cuántas lo son y cuenta las personas.',
      voz: 'Una ficha con dos letras es una sola persona.',
      controles: [{ id: 'c', etiqueta: 'Son ambas cosas', min: 0, max: 3, paso: 1, inicio: 0, decimales: 0, color: 'c-d' }],
      dibujo: val => ({ datos: gente(3, 4, val.c), estado: {} }),
      lectura: val => [`3 + 4 − ${val.c} = ${7 - val.c} personas`],
      minimo: 3,
      // Arrastra el final de la fila «Docente y músico»: cada lugar que ganas junta un docente con un músico.
      arrastres: [{ id: 'ambos', etiqueta: 'cuántos son docente y músico', color: 'c-d',
        donde: val => finFila(val.c),
        mover: (pt, val) => { const g = FICHAS().geometria(gente(3, 4, 3)), fl = g.filas[0]; return { c: (pt.x - fl.fichas[0].cx) / fl.paso + 0.5 }; } }],
    },
    predice: {
      pregunta: 'En un taller, 5 personas cantan, 4 bailan y 3 actúan. Cada persona puede hacer varias cosas. ¿Cuántas personas hay, como mínimo?',
      opciones: [
        { id: 'suma', texto: '12', error: 'RMT-DED-11', siFuera: '12 sería si nadie hiciera dos cosas. Los papeles pueden compartirse.' },
        { id: 'c', texto: '5', correcta: true },
        { id: 'tres', texto: '3', error: 'RMT-MAX-1', siFuera: 'Con 3 personas no alcanzan 5 cantantes.' },
        { id: 'cuatro', texto: '4', error: 'RMT-MAX-1', siFuera: 'Con 4 personas no alcanzan 5 cantantes.' },
      ],
      dibujo: { datos: { filas: [{ rotulo: 'Cantan 5 · bailan 4 · actúan 3', fichas: [] }, { rotulo: ' ', fichas: [] }, { rotulo: ' ', fichas: [] }], tam: 30, pie: '¿Mínimo de personas?' }, estado: {} },
      revelar: { datos: { filas: [{ rotulo: 'Las 5 cantan', fichas: Array.from({ length: 5 }, (_, k) => ({ t: k < 3 ? 'CBA' : k < 4 ? 'CB' : 'C', color: 'd' })) }, { rotulo: '4 de ellas bailan; 3, actúan', fichas: [] }, { rotulo: ' ', fichas: [] }], tam: 34, pie: 'Cota: al menos 5, y 5 alcanzan' }, estado: {} },
      coincide: 'Coincide: hacen falta al menos 5 para los cantantes, y esas 5 pueden cubrir lo demás.',
    },
    mira: {
      datos: gente(3, 4, 3, { pie: '4 personas: cota y caso coinciden' }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Hay 4 músicos: nunca puede haber menos de 4 personas.', ecuacion: ['personas ≥ 4'] },
        { estado: { corte: 0 }, texto: 'Si los 3 docentes también son músicos, alcanza con 4.', ecuacion: ['3 + 4 − 3 = 4'] },
        { estado: { corte: 0 }, texto: 'Se demostró el mínimo: una cota y un caso que la alcanza.' },
      ],
    },
    regla: {
      texto: 'Para el mínimo de personas, se superponen los papeles todo lo permitido. El mínimo se demuestra con una cota (no puede haber menos) y un caso que la alcanza.',
      ecuacion: ['|A ∪ B| = |A| + |B| − ', { llave: ['|A ∩ B|'], nota: 'con dos papeles', color: 'c-d' }],
      condicion: 'el enunciado permite que una persona tenga varios papeles; si no, se suman.',
    },
    ahoraTu: {
      pieza: 'rm-fichas',
      voz: 'Busca una cota y un caso que la alcance.',
      generar(s) {
        const r = azar(s);
        if (s % 2) {
          const Nn = r.ent(20, 60), c = r.ent(4, 9), bien = Math.ceil(Nn / c);
          return {
            pregunta: `${Nn} alumnos viajan en autos de ${c} asientos (sin contar al chofer). ¿Cuántos autos hacen falta, como mínimo?`,
            opciones: opcionesTexto(String(bien), [
              { id: 'abajo', texto: String(Math.floor(Nn / c)), error: 'RMT-MAX-2', siFuera: 'Con esos autos quedan alumnos sin asiento.' },
              { id: 'mas', texto: String(bien + 1), error: 'RMT-MAX-3', siFuera: 'Uno menos ya alcanza.' },
              { id: 'div', texto: f(Nn / c, 2), error: 'RMT-MAX-4', siFuera: 'Los autos se cuentan enteros.' },
            ]),
            solucion: { texto: `${Nn} / ${c} = ${f(Nn / c, 2)}: se redondea hacia arriba.`, ecuacion: [`⌈${Nn} / ${c}⌉ = ${bien}`] },
          };
        }
        const a = r.ent(3, 9), b = r.ent(3, 9), c = r.ent(2, 9), bien = Math.max(a, b, c);
        return {
          pregunta: `En un grupo, ${a} personas juegan fútbol, ${b} juegan vóley y ${c} juegan básquet. Cada una puede jugar varios. ¿Cuántas personas hay, como mínimo?`,
          dibujo: { datos: { filas: [{ rotulo: `Fútbol ${a} · vóley ${b} · básquet ${c}`, fichas: [] }, { rotulo: ' ', fichas: [] }, { rotulo: ' ', fichas: [] }], tam: 30, pie: '¿Mínimo?' }, estado: {} },
          opciones: opcionesTexto(String(bien), [
            { id: 'suma', texto: String(a + b + c), error: 'RMT-DED-11', siFuera: 'Eso supone que nadie juega dos deportes.' },
            { id: 'min', texto: String(Math.min(a, b, c)), error: 'RMT-MAX-1', siFuera: 'No alcanzan para el deporte con más jugadores.' },
            { id: 'prom', texto: String(Math.round((a + b + c) / 3)), error: 'RMT-MAX-5', siFuera: 'El promedio no cubre al deporte más grande.' },
          ]),
          solucion: { texto: `Hacen falta al menos ${bien}, y esas ${bien} pueden cubrir los otros deportes.`, ecuacion: [`mín = máx(${a}, ${b}, ${c}) = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 2: el precio que más recauda ----------
  // Cambia: el precio · Permanece: el modelo de ventas q = 80 − 2p · Progresa: la recaudación sobre la curva · Se reserva:
  // otro modelo cuyo mejor precio no es redondo · Debe verse: subir el precio vende menos; el máximo está en el medio.
  const recauda = (a, b) => pp => pp * (a - b * pp);
  function curva(a, b, marca, extra = {}) {
    const pmax = a / b, Rm = recauda(a, b)(a / (2 * b));
    const pts = Array.from({ length: 41 }, (_, k) => { const x = pmax * k / 40; return [x, recauda(a, b)(x)]; });
    const ymax = Math.ceil(Rm * 1.15 / 100) * 100;
    return {
      x: { min: 0, max: pmax, paso: pmax / 4, nombre: 'p', unidad: 'S/', decimales: 1, color: 'i' },
      y: { min: 0, max: ymax, paso: ymax / 4, nombre: 'R', unidad: 'S/', decimales: 0, color: 'o' },
      curvas: [{ puntos: pts, color: 'o' }],
      puntos: marca === null ? [] : [{ x: marca, y: recauda(a, b)(marca), color: 'i', guias: true, rotulo: `S/ ${f(recauda(a, b)(marca), 1)}` }].concat(extra.vertice ? [{ x: a / (2 * b), y: Rm, color: 'd', rotulo: `máx ${f(Rm, 1)}`, desde: extra.vertice }] : []),
      compacto: true,
    };
  }
  const precios = {
    id: 'precio-que-mas-recauda',
    titulo: 'El precio que más recauda',
    temas: ['Precios máximos y mínimos'],
    pieza: 'ejes',
    juega: {
      consigna: 'Si la entrada cuesta p soles, se venden 80 − 2p entradas. Cambia el precio y mira cuánto se recauda en total.',
      voz: 'Subir el precio también baja las ventas.',
      controles: [{ id: 'p', etiqueta: 'Precio', min: 5, max: 35, paso: 5, inicio: 5, unidad: 'S/', decimales: 0, color: 'c-i' }],
      dibujo: val => ({ datos: curva(80, 2, val.p), estado: {} }),
      lectura: val => [R, ` = ${val.p} · ${80 - 2 * val.p} = S/ ${recauda(80, 2)(val.p)}`],
      minimo: 4,
      // Arrastra el punto sobre la curva a lo largo del eje del precio.
      arrastres: [{ id: 'precio', etiqueta: 'precio de la entrada', color: 'c-i',
        donde: val => { const g = EJES().geometria(curva(80, 2, val.p)); return { x: g.X(val.p), y: g.Y(recauda(80, 2)(val.p)) }; },
        mover: (pt, val) => { const g = EJES().geometria(curva(80, 2, val.p)); return { p: inversa(g.X, 0, 40)(pt.x) }; } }],
    },
    predice: {
      pregunta: 'En otra función, si la entrada cuesta p soles se venden 90 − 2p entradas. ¿Qué precio da la mayor recaudación?',
      opciones: [
        { id: 'veinte', texto: 'S/ 20', error: 'RMT-MAX-6', siFuera: 'S/ 20 era el mejor con 80 − 2p. Con 90 − 2p, la curva se corre.' },
        { id: 'c', texto: 'S/ 22,50', correcta: true },
        { id: 'cuarenta5', texto: 'S/ 45', error: 'RMT-MAX-7', siFuera: 'A S/ 45 no se vende ninguna entrada: se recauda 0.' },
        { id: 'veinticinco', texto: 'S/ 25', error: 'RMT-MAX-8', siFuera: 'S/ 25 recauda 1000; S/ 22,50 recauda 1012,50.' },
      ],
      dibujo: { datos: curva(90, 2, null), estado: {} },
      revelar: { datos: curva(90, 2, 22.5, { vertice: 0 }), estado: {} },
      coincide: 'Coincide: el máximo está en la mitad entre los precios que recaudan 0: 0 y 45.',
    },
    mira: {
      datos: curva(90, 2, 10, { vertice: 2 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Se recauda cero con precio 0 o si nadie compra (p = 45).', ecuacion: [R, ' = ', p, '(90 − 2', p, ')'] },
        { estado: { corte: 2 }, texto: 'La curva es simétrica: el máximo está en el medio.', ecuacion: [p, ' = (0 + 45) / 2 = 22,5'] },
        { estado: { corte: 2 }, texto: 'Completando el cuadrado se ve que nada supera ese valor.', ecuacion: [R, ' = 1012,5 − 2', { sup: [['(', p, ' − 22,5)'], '2'] }, ' ≤ 1012,5'] },
      ],
    },
    regla: {
      texto: 'Si se vende q = a − bp a precio p, la recaudación R = p(a − bp) es máxima en el punto medio entre sus dos ceros.',
      ecuacion: [p, ' = ', { frac: ['a', '2b'] }, '   ·   ', R, ' máx = ', { frac: [{ sup: ['a', '2'] }, '4b'] }],
      condicion: 'el modelo de ventas es exacto en ese rango de precios; si solo se permiten ciertos precios, se comparan esos.',
    },
    ahoraTu: {
      pieza: 'ejes',
      voz: 'Halla los dos precios que recaudan cero.',
      generar(s) {
        const r = azar(s), b = r.ent(1, 4), a = 2 * b * r.ent(8, 30);
        const pm = a / (2 * b), Rm = a * a / (4 * b);
        const pideR = s % 2 === 1;
        return {
          pregunta: `Si la entrada cuesta p soles, se venden ${a} − ${b === 1 ? '' : b}p entradas. ¿${pideR ? 'Cuál es la mayor recaudación posible' : 'Qué precio da la mayor recaudación'}?`,
          dibujo: { datos: curva(a, b, null), estado: {} },
          opciones: pideR ? opcionesTexto(`S/ ${f(Rm)}`, [
            { id: 'cero', texto: `S/ ${f(a * a / b)}`, error: 'RMT-MAX-9', siFuera: 'Eso multiplica el precio más alto por todas las entradas.' },
            { id: 'mitad', texto: `S/ ${f(Rm / 2)}`, error: 'RMT-MAX-9', siFuera: 'Revisa: el máximo es p · q en el precio óptimo.' },
            { id: 'p', texto: `S/ ${f(pm)}`, error: 'RMT-MAX-10', siFuera: 'Ese es el precio, no la recaudación.' },
          ]) : opcionesTexto(`S/ ${f(pm)}`, [
            { id: 'cero', texto: `S/ ${f(a / b)}`, error: 'RMT-MAX-7', siFuera: 'A ese precio no se vende nada.' },
            { id: 'a2', texto: `S/ ${f(a / 2)}`, error: 'RMT-MAX-11', siFuera: 'Falta dividir entre b.' },
            { id: 'cerca', texto: `S/ ${f(pm + 5)}`, error: 'RMT-MAX-8', siFuera: 'Ese precio recauda menos que el del medio.' },
          ]),
          solucion: { texto: `Recauda 0 en p = 0 y en p = ${f(a / b)}; el máximo está en el medio.`, ecuacion: [p, ` = ${f(pm)}`, '   ·   ', R, ` = ${f(pm)} · ${f(a - b * pm)} = ${f(Rm)}`], dibujo: { datos: curva(a, b, pm, { vertice: 0 }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: el máximo de regiones con rectas ----------
  // Cambia: cuántas rectas · Permanece: rectas sin paralelas ni tres por un punto · Progresa: las regiones nuevas ·
  // Se reserva: 6 rectas (no son 64) · Debe verse: la recta número n agrega n regiones.
  const REC = [[[0.2, 1.2], [9.8, 4.6]], [[0.2, 5.4], [9.8, 0.9]], [[2.4, 0.2], [4.6, 6]], [[0.2, 3.3], [9.8, 2.2]], [[6.2, 0.2], [7.6, 6]], [[0.2, 0.4], [6.6, 6]]];
  const regiones = k => 1 + k * (k + 1) / 2;
  function rectas(k, extra = {}) {
    return {
      ancho: 10, alto: 6.2,
      poligonos: [{ puntos: [[0.2, 0.2], [9.8, 0.2], [9.8, 6], [0.2, 6]], relleno: 0, grosor: 'cuadricula' }],
      lineas: REC.slice(0, k).map((l, i) => ({ de: l[0], a: l[1], color: i === k - 1 ? 'o' : 'i', grosor: i === k - 1 ? 'variable' : 'contorno', desde: extra.paso ? i + 1 : 0 })),
      pie: extra.pie,
    };
  }
  const regionesIdea = {
    id: 'regiones-con-rectas',
    titulo: 'Cada recta nueva, más regiones',
    temas: ['Regiones pintadas'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Traza rectas en el plano, sin paralelas y sin que tres pasen por un mismo punto. Cuenta en cuántas regiones queda partido.',
      voz: 'La recta nueva, en naranja, corta a cada recta anterior.',
      controles: [{ id: 'k', etiqueta: 'Rectas', min: 0, max: 4, paso: 1, inicio: 0, decimales: 0, color: 'c-i' }],
      dibujo: val => ({ datos: rectas(val.k), estado: {} }),
      lectura: val => [n, ` = ${val.k} rectas · ${regiones(val.k)} regiones`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Con 0, 1, 2, 3 y 4 rectas hay como máximo 1, 2, 4, 7 y 11 regiones. ¿Cuántas, como máximo, con 6 rectas?',
      opciones: [
        { id: 'pot', texto: '64', error: 'RMT-IND-3', siFuera: '64 duplica cada vez; desde la tercera recta ya no se duplica.' },
        { id: 'c', texto: '22', correcta: true },
        { id: 'quince', texto: '16', error: 'RMT-MAX-12', siFuera: '16 sumaría 5 una sola vez; la sexta recta agrega 6 más.' },
        { id: 'veinte', texto: '21', error: 'RMT-MAX-13', siFuera: '21 olvida la región que había sin rectas.' },
      ],
      dibujo: { datos: rectas(4), estado: {} },
      revelar: { datos: rectas(6, { pie: '11 + 5 + 6 = 22 regiones' }), estado: {} },
      coincide: 'Coincide: la quinta recta agrega 5 y la sexta, 6.',
    },
    mira: {
      datos: rectas(4, { paso: true }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Una recta parte el plano en 2.', ecuacion: ['1 + 1 = 2'] },
        { estado: { corte: 2 }, texto: 'La segunda corta a la primera: se parte en 2 trozos y agrega 2.', ecuacion: ['2 + 2 = 4'] },
        { estado: { corte: 3 }, texto: 'La tercera corta a dos: 3 trozos, 3 regiones nuevas.', ecuacion: ['4 + 3 = 7'] },
        { estado: { corte: 4 }, texto: 'La recta número n tiene n trozos: agrega n regiones.', ecuacion: ['7 + 4 = 11'] },
      ],
    },
    regla: {
      texto: 'Si ninguna recta es paralela a otra y no pasan tres por un punto, la recta número n agrega n regiones. Así se alcanza el máximo.',
      ecuacion: ['regiones = 1 + ', { frac: [[n, '(', n, ' + 1)'], '2'] }, '   ·   ', { llave: ['1 + 2 + … + ', n], nota: 'lo que agregan', color: 'c-i' }, ' = ', { frac: [[n, '(', n, ' + 1)'], '2'] }],
      condicion: 'son rectas completas en el plano; con paralelas o rectas que pasan por un mismo punto, hay menos regiones.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Suma lo que agrega cada recta.',
      generar(s) {
        const r = azar(s), k = r.ent(5, 14), bien = regiones(k);
        return {
          pregunta: `¿Cuántas regiones, como máximo, forman ${k} rectas en un plano?`,
          dibujo: { datos: rectas(3, { pie: '3 rectas: 7 regiones' }), estado: {} },
          opciones: opcionesTexto(String(bien), [
            { id: 'sin1', texto: String(bien - 1), error: 'RMT-MAX-13', siFuera: 'Falta la región que hay sin rectas.' },
            { id: 'pot', texto: String(2 ** k), error: 'RMT-IND-3', siFuera: 'Las regiones no se duplican con cada recta.' },
            { id: 'dob', texto: String(2 * k), error: 'RMT-MAX-12', siFuera: 'Cada recta agrega más que 2.' },
          ]),
          solucion: { texto: `La recta número n agrega n regiones.`, ecuacion: [`1 + ${k} · ${k + 1} / 2 = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 4: el camino más corto con reflejo ----------
  // Cambia: dónde se toca el río · Permanece: A, B y el río · Progresa: el largo del camino · Se reserva: el punto exacto
  // que da el mínimo · Debe verse: reflejar B vuelve recto el camino quebrado.
  const PA = [1, 1.9], PB = [8.2, 0.5], RIO = 2.9;   // A y B sobre el río (y hacia abajo); el río es y = RIO
  const B2 = [PB[0], 2 * RIO - PB[1]];
  const largo = x => Math.hypot(x - PA[0], RIO - PA[1]) + Math.hypot(PB[0] - x, RIO - PB[1]);
  const xOpt = PA[0] + (B2[0] - PA[0]) * (RIO - PA[1]) / (B2[1] - PA[1]);
  function rio(x, extra = {}) {
    return {
      ancho: 10, alto: 6.2,
      lineas: [{ de: [0, RIO], a: [10, RIO], color: 'i', grosor: 'contorno' }]
        .concat(x === null ? [] : [{ de: PA, a: [x, RIO], color: 'o' }, { de: [x, RIO], a: PB, color: 'o' }])
        .concat(extra.reflejo ? [{ de: [x, RIO], a: B2, color: 'd', discontinua: true, desde: extra.reflejo }, { de: PB, a: B2, grosor: 'cuadricula', discontinua: true, desde: extra.reflejo }] : []),
      nodos: [{ id: 'a', x: PA[0], y: PA[1], t: 'A', r: 13 }, { id: 'b', x: PB[0], y: PB[1], t: 'B', r: 13 }]
        .concat(extra.reflejo ? [{ id: 'b2', x: B2[0], y: B2[1], t: 'B′', r: 13, color: 'd', desde: extra.reflejo }] : [])
        .concat(x === null ? [] : [{ id: 'p', x, y: RIO, r: 6, relleno: 1, color: 'o' }]),
      textos: [{ x: 9.2, y: RIO + 0.45, t: 'río', color: 'i' }],
      pie: extra.pie,
    };
  }
  const xs = [1, 2.8, 4.6, 6.4, 8.2];
  const reflejo = {
    id: 'reflejo',
    titulo: 'Reflejar para enderezar el camino',
    temas: ['Recorridos mínimos con reflejos y simetrías'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Hay que ir de A al río, llenar un balde y llevarlo a B. Cambia dónde tocas el río y mira el largo total.',
      voz: 'Busca dónde el camino se hace más corto.',
      controles: [{ id: 'k', etiqueta: 'Punto', min: 0, max: 4, paso: 1, inicio: 0, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: rio(xs[val.k]), estado: {} }),
      lectura: val => [L, ` = ${f(largo(xs[val.k]), 2)} (en cuadros)`],
      minimo: 4,
      // Arrastra el punto donde se toca el río.
      arrastres: [{ id: 'orilla', etiqueta: 'punto donde se toca el río', color: 'c-o',
        donde: val => enPlano(rio(xs[val.k]), [xs[val.k], RIO]),
        mover: (pt, val) => { const x = dePlano(rio(xs[val.k]), pt)[0]; return { k: xs.map((v, i) => [Math.abs(v - x), i]).sort((a, b) => a[0] - b[0])[0][1] }; } }],
    },
    predice: {
      pregunta: '¿Dónde conviene tocar el río para que el camino de A al río y luego a B sea el más corto?',
      opciones: [
        { id: 'medio', texto: 'En el punto medio entre A y B', error: 'RMT-MAX-14', siFuera: 'El medio sirve si A y B están a la misma distancia del río; B está más lejos.' },
        { id: 'abajo', texto: 'Justo debajo de A', error: 'RMT-MAX-15', siFuera: 'Ir recto al río desde A acorta el primer tramo, pero alarga mucho el segundo.' },
        { id: 'c', texto: 'Donde la recta de A al reflejo de B corta el río', correcta: true },
      ],
      dibujo: { datos: rio(null), estado: {} },
      revelar: { datos: rio(xOpt, { reflejo: 0, pie: `Mínimo: ${f(largo(xOpt), 2)}` }), estado: {} },
      coincide: 'Coincide: el tramo hacia B mide lo mismo que hacia su reflejo, y lo más corto es una recta.',
    },
    mira: {
      datos: rio(xOpt, { reflejo: 1 }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Un camino quebrado: de A al río y del río a B.' },
        { estado: { corte: 1 }, texto: 'Se refleja B en el río: ir a B o a B′ mide igual.', ecuacion: ['PB = PB′'] },
        { estado: { corte: 1 }, texto: 'De A a B′, lo más corto es la recta.', ecuacion: [L, ' mín = AB′'] },
      ],
    },
    regla: {
      texto: 'Para ir de A a B tocando una recta, se refleja B. El camino más corto mide AB′: d es la distancia horizontal; a y b, las alturas.',
      ecuacion: [L, ' mín = AB′ = ', { raiz: [{ sup: ['d', '2'] }, ' + ', { sup: ['(a + b)', '2'] }] }],
      condicion: 'A y B están del mismo lado de la recta y se puede tocar cualquier punto de ella.',
    },
    ahoraTu: {
      voz: 'Refleja uno de los puntos y mide la recta.',
      generar(s) {
        const r = azar(s);
        const [d, h] = r.elegir([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [9, 12], [12, 9], [8, 15], [15, 8]]);
        const a = r.ent(1, h - 1), b = h - a, bien = Math.hypot(d, h);
        return {
          pregunta: `A está a ${a} km de un río recto y B, a ${b} km, del mismo lado; sus pies en el río distan ${d} km. ¿Cuánto mide el camino más corto de A al río y a B?`,
          opciones: opcionesTexto(`${f(bien)} km`, [
            { id: 'directo', texto: `${f(Math.hypot(d, Math.abs(a - b)), 2)} km`, error: 'RMT-MAX-16', siFuera: 'Esa es la recta de A a B sin tocar el río.' },
            { id: 'suma', texto: `${f(a + b + d)} km`, error: 'RMT-MAX-15', siFuera: 'Eso va en ángulos rectos; la recta diagonal es más corta.' },
            { id: 'medio', texto: `${f(Math.hypot(d / 2, a) + Math.hypot(d / 2, b), 2)} km`, error: 'RMT-MAX-14', siFuera: 'Eso toca el río en el medio, que no es el mejor punto.' },
          ]),
          solucion: { texto: 'Se refleja B: la recta de A a B′ tiene catetos d y a + b.', ecuacion: [L, ` = `, { raiz: [{ sup: [String(d), '2'] }, ' + ', { sup: [String(h), '2'] }] }, ` = ${f(bien)} km`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: tres rectas fijas y una cuarta que el alumno mueve y gira. Es el caso raro que la idea 3 no deja probar:
  // con una paralela o con tres rectas por un punto, las regiones bajan del máximo (11).
  const CAJA = [0.2, 0.2, 9.8, 6];
  const FIJAS = [{ p: [0, 1.5], d: [1, 0] }, { p: [7, 0], d: [0, 1] }, { p: [2, 0.5], d: [1, 1] }];
  const dirDe = th => [Math.cos(th * Math.PI / 180), Math.sin(th * Math.PI / 180)];
  // Recorta la recta (punto y dirección) a la caja: Liang-Barsky.
  function recorte(r) {
    let t0 = -1e9, t1 = 1e9;
    const [px, py] = r.p, [dx, dy] = r.d;
    for (const [q, d0, lo, hi] of [[px, dx, CAJA[0], CAJA[2]], [py, dy, CAJA[1], CAJA[3]]]) {
      if (Math.abs(d0) < 1e-12) { if (q < lo || q > hi) return null; continue; }
      const a0 = (lo - q) / d0, a1 = (hi - q) / d0;
      t0 = Math.max(t0, Math.min(a0, a1)); t1 = Math.min(t1, Math.max(a0, a1));
    }
    return t1 > t0 ? [[px + t0 * dx, py + t0 * dy], [px + t1 * dx, py + t1 * dy]] : null;
  }
  // Regiones de todo el plano (las rectas son infinitas): 1 + rectas + Σ (rectas por el punto − 1) en cada cruce.
  // Se avisa si algún cruce cae fuera del dibujo, para que no se cuente a ojo solo lo que se ve.
  // Una recta encima de otra (la misma recta dos veces) se cuenta una sola vez: no parte nada nuevo.
  function contarRegiones(todas) {
    const misma = (a, b) => Math.abs(a.d[0] * b.d[1] - a.d[1] * b.d[0]) < 1e-9 && Math.abs((b.p[0] - a.p[0]) * a.d[1] - (b.p[1] - a.p[1]) * a.d[0]) < 1e-9;
    const rs = todas.filter((r, i) => !todas.slice(0, i).some(o => misma(o, r)));
    const encima = rs.length < todas.length;
    const ps = [];
    let paralelas = false, fuera = false;
    for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
      const [a, b] = [rs[i], rs[j]], det = a.d[0] * b.d[1] - a.d[1] * b.d[0];
      if (Math.abs(det) < 1e-9) { paralelas = true; continue; }
      const t = ((b.p[0] - a.p[0]) * b.d[1] - (b.p[1] - a.p[1]) * b.d[0]) / det;
      const x = a.p[0] + t * a.d[0], y = a.p[1] + t * a.d[1];
      if (x <= CAJA[0] || x >= CAJA[2] || y <= CAJA[1] || y >= CAJA[3]) fuera = true;
      const q = ps.find(o => Math.hypot(o.x - x, o.y - y) < 1e-6);
      if (q) q.r.add(i).add(j); else ps.push({ x, y, r: new Set([i, j]) });
    }
    const regiones = 1 + rs.length + ps.reduce((m, o) => m + o.r.size - 1, 0);
    return { regiones, paralelas, fuera, encima, triple: ps.some(o => o.r.size >= 3) };
  }
  const cuarta = val => ({ p: [val.px, val.py], d: dirDe(val.th) });
  function mesaRectasDatos(val) {
    const rs = FIJAS.concat([cuarta(val)]);
    return {
      ancho: 10, alto: 6.2,
      poligonos: [{ puntos: [[CAJA[0], CAJA[1]], [CAJA[2], CAJA[1]], [CAJA[2], CAJA[3]], [CAJA[0], CAJA[3]]], relleno: 0, grosor: 'cuadricula' }],
      lineas: rs.map((r, i) => { const q = recorte(r); return q && { de: q[0], a: q[1], color: i === 3 ? 'o' : 'i', grosor: i === 3 ? 'variable' : 'contorno' }; }).filter(Boolean),
    };
  }
  // La manija de giro va a 1,6 cuadros del pivote, hacia el lado que queda dentro de la caja.
  const brazo = val => { const d = dirDe(val.th), sg = val.px + 1.6 * d[0] > 9.6 || val.py + 1.6 * d[1] > 5.9 || val.py + 1.6 * d[1] < 0.3 ? -1 : 1; return [val.px + sg * 1.6 * d[0], val.py + sg * 1.6 * d[1]]; };
  const mesaRectas = {
    id: 'cuarta-recta', titulo: 'Mueve la cuarta recta', pieza: 'rm-plano',
    consigna: 'Arrastra el punto naranja y gira la recta. ¿Cuándo se pierden regiones? Prueba paralelas y tres por un punto.',
    controles: [
      { id: 'px', etiqueta: 'Pasa por x', color: 'c-o', min: 0.5, max: 9.5, paso: 0.5, inicio: 5, decimales: 1 },
      { id: 'py', etiqueta: 'Pasa por y', color: 'c-o', min: 0.5, max: 5.5, paso: 0.5, inicio: 3, decimales: 1 },
      { id: 'th', etiqueta: 'Giro', color: 'c-o', min: 0, max: 165, paso: 15, inicio: 135, unidad: '°', decimales: 0 },
    ],
    dibujo: val => ({ datos: Object.assign(mesaRectasDatos(val), { nodos: [{ id: 'p', x: val.px, y: val.py, r: 6, relleno: 1, color: 'o' }] }), estado: {} }),
    lectura: val => {
      const q = contarRegiones(FIJAS.concat([cuarta(val)]));
      if (q.encima) return [`Encima de otra recta: 3 rectas, ${q.regiones} regiones`];
      return [`4 rectas: ${q.regiones} regiones`, q.paralelas ? ' · hay paralelas' : q.triple ? ' · tres por un punto' : q.fuera ? ' · un cruce fuera del dibujo' : ' · el máximo'];
    },
    arrastres: [
      { id: 'pivote', etiqueta: 'punto por donde pasa la recta', color: 'c-o',
        donde: val => enPlano(mesaRectasDatos(val), [val.px, val.py]),
        mover: (pt, val) => { const [x, y] = dePlano(mesaRectasDatos(val), pt); return { px: x, py: y }; } },
      { id: 'giro', etiqueta: 'giro de la recta', color: 'c-o',
        donde: val => enPlano(mesaRectasDatos(val), brazo(val)),
        mover: (pt, val) => { const [x, y] = dePlano(mesaRectasDatos(val), pt); return { th: ((Math.atan2(y - val.py, x - val.px) * 180 / Math.PI) % 180 + 180) % 180 }; } },
    ],
    // Retos: cada uno cuenta las regiones con contarRegiones, el mismo motor de la lectura.
    invitaciones: [
      { texto: 'Pon la cuarta recta paralela a una de las otras tres.',
        logrado: val => { const q = reg4(val); return q.paralelas && !q.encima; },
        bien: 'Una paralela no corta a esa recta: falta un trozo y una región.' },
      { texto: 'Haz que la cuarta recta pase justo por un cruce de dos rectas fijas.',
        logrado: val => { const q = reg4(val); return q.triple && !q.paralelas; },
        bien: 'Tres por un punto: dos cortes se juntan en uno y se pierde una región.' },
      { texto: 'Busca la posición que deja el menor número de regiones.',
        logrado: val => { const q = reg4(val); return !q.encima && q.regiones === menosRegiones(); },
        bien: 'Paralela y por un cruce a la vez: se pierden dos regiones de golpe.' },
      { texto: 'Logra el máximo de regiones con un cruce fuera del dibujo.',
        logrado: val => { const q = reg4(val); return q.regiones === regiones(4) && q.fuera; },
        bien: 'No se ve, pero el cruce existe: la recta sigue y parte el plano igual.' },
    ],
  };
  const reg4 = val => contarRegiones(FIJAS.concat([cuarta(val)]));
  const menosRegiones = una(() => Math.min(...casosDe(mesaRectas.controles).map(reg4).filter(q => !q.encima).map(q => q.regiones)));
  // Mesa 2: el río con A fija y B que se mueve: el punto del río es libre y se compara con el mínimo.
  function rioLibre(val) {
    const B = [val.bx, val.by], B2l = [val.bx, 2 * RIO - val.by];
    return {
      ancho: 10, alto: 6.2,
      lineas: [{ de: [0, RIO], a: [10, RIO], color: 'i', grosor: 'contorno' }, { de: PA, a: [val.x, RIO], color: 'o' }, { de: [val.x, RIO], a: B, color: 'o' },
        { de: [val.x, RIO], a: B2l, color: 'd', discontinua: true }, { de: B, a: B2l, grosor: 'cuadricula', discontinua: true }],
      nodos: [{ id: 'a', x: PA[0], y: PA[1], t: 'A', r: 13 }, { id: 'b', x: B[0], y: B[1], t: 'B', r: 13 }, { id: 'b2', x: B2l[0], y: B2l[1], t: 'B′', r: 13, color: 'd' }],
      textos: [{ x: 0.6, y: RIO + 0.45, t: 'río', color: 'i' }],
    };
  }
  const largoLibre = val => Math.hypot(val.x - PA[0], RIO - PA[1]) + Math.hypot(val.bx - val.x, RIO - val.by);
  const minLibre = val => Math.hypot(val.bx - PA[0], (2 * RIO - val.by) - PA[1]);
  const mesaRio = {
    id: 'rio-libre', titulo: 'El río con B móvil', pieza: 'rm-plano',
    consigna: 'Mueve B y el punto del río. ¿El camino más corto pasa siempre por donde la recta de A a B′ corta el río?',
    controles: [
      { id: 'x', etiqueta: 'Toca el río en', color: 'c-o', min: 0, max: 10, paso: 0.1, inicio: 5, decimales: 1 },
      { id: 'bx', etiqueta: 'B a lo ancho', color: 'c-d', min: 2, max: 9.5, paso: 0.5, inicio: 8, decimales: 1 },
      { id: 'by', etiqueta: 'B a lo alto', color: 'c-d', min: 0.5, max: 2, paso: 0.5, inicio: 0.5, decimales: 1 },
    ],
    dibujo: val => ({ datos: rioLibre(val), estado: {} }),
    lectura: val => [L, ` = ${f(largoLibre(val), 2)} · el mínimo es ${f(minLibre(val), 2)}`],
    arrastres: [
      { id: 'orilla', etiqueta: 'punto donde se toca el río', color: 'c-o',
        donde: val => enPlano(rioLibre(val), [val.x, RIO]),
        mover: (pt, val) => ({ x: dePlano(rioLibre(val), pt)[0] }) },
      { id: 'b', etiqueta: 'posición de B', color: 'c-d',
        donde: val => enPlano(rioLibre(val), [val.bx, val.by]),
        mover: (pt, val) => { const [x, y] = dePlano(rioLibre(val), pt); return { bx: x, by: y }; } },
    ],
    // Retos: el mejor punto es el de la grilla más cercano a donde la recta de A a B′ corta el río (xRio).
    invitaciones: [
      { texto: 'Toca el río en el punto que da el camino más corto.',
        logrado: val => enMejor(val),
        bien: 'Es justo donde la recta de A a B′ cruza el río.' },
      { texto: 'Toca el río justo debajo de B. ¿Mejora o empeora?',
        logrado: val => Math.abs(val.x - val.bx) < 1e-9,
        bien: 'Ir derecho a B alarga el tramo desde A: el total crece.' },
      { texto: 'Logra el camino mínimo más corto de todos moviendo también B.',
        logrado: val => enMejor(val) && Math.abs(minLibre(val) - menorMin()) < 1e-9,
        bien: 'B cerca de A y cerca del río: la recta AB′ se acorta.' },
      { texto: 'Guarda dos casos con B en sitios distintos, cada uno en su mejor punto.',
        logrado: (val, guardados) => guardados.some(g => enMejor(g) && guardados.some(h => enMejor(h) && (h.bx !== g.bx || h.by !== g.by))),
        bien: 'Distinto B, distinto punto, la misma receta: reflejar y trazar la recta.' },
    ],
  };
  const xRio = val => PA[0] + (val.bx - PA[0]) * (RIO - PA[1]) / ((2 * RIO - val.by) - PA[1]);
  const enMejor = val => Math.abs(val.x - xRio(val)) <= mesaRio.controles[0].paso / 2 + 1e-9;
  const menorMin = una(() => Math.min(...casosDe(mesaRio.controles.slice(1)).map(minLibre)));
  // Mesa 3: el modelo de ventas a elección (q = a − bp): el mejor precio se corre con a y con b.
  const pLibre = val => Math.min(val.p, val.a / val.b);
  const mesaPrecio = {
    id: 'precio-libre', titulo: 'Tu propio modelo de ventas', pieza: 'ejes',
    consigna: 'Elige cuántas entradas se venden a precio 0 (a) y cuántas se pierden por sol (b). Busca el mejor precio.',
    controles: [
      { id: 'a', etiqueta: 'a', color: 'c-o', min: 40, max: 120, paso: 10, inicio: 90, decimales: 0 },
      { id: 'b', etiqueta: 'b', color: 'c-d', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
      { id: 'p', etiqueta: 'Precio', color: 'c-i', min: 0, max: 60, paso: 0.5, inicio: 15, unidad: 'S/', decimales: 1 },
    ],
    dibujo: val => ({ datos: curva(val.a, val.b, pLibre(val)), estado: {} }),
    lectura: val => [p, ` = ${f(pLibre(val), 1)}: `, R, ` = S/ ${f(recauda(val.a, val.b)(pLibre(val)), 1)} · mejor `, p, ` = ${f(val.a / (2 * val.b), 2)}`],
    arrastres: [{ id: 'precio', etiqueta: 'precio de la entrada', color: 'c-i',
      donde: val => { const g = EJES().geometria(curva(val.a, val.b, pLibre(val))); return { x: g.X(pLibre(val)), y: g.Y(recauda(val.a, val.b)(pLibre(val))) }; },
      mover: (pt, val) => {
        const g = EJES().geometria(curva(val.a, val.b, pLibre(val))), pm = val.a / val.b, x = inversa(g.X, 0, pm)(pt.x);
        // Si el control está más allá del último precio que vende, la manija queda al final y no lo baja sin querer.
        return { p: val.p > pm && x >= pm - 0.25 ? val.p : x };
      } }],
    // Retos: la recaudación sale de recauda(a, b), la misma que dibuja la curva.
    invitaciones: [
      { texto: 'Pon el precio que más recauda para el modelo que elegiste.',
        logrado: val => { const R0 = rLibre(val), d = mesaPrecio.controles[2].paso; return val.p <= val.a / val.b && R0 >= recauda(val.a, val.b)(val.p - d) - 1e-9 && R0 >= recauda(val.a, val.b)(val.p + d) - 1e-9; },
        bien: 'El mejor precio queda a la mitad entre los dos que recaudan cero.' },
      { texto: 'Haz que se recaude cero, aunque la entrada no sea gratis.',
        logrado: val => val.p > 0 && rLibre(val) === 0,
        bien: 'A ese precio nadie compra. Es el segundo cero de la curva.' },
      { texto: 'Busca la mayor recaudación que permite esta mesa.',
        logrado: val => Math.abs(rLibre(val) - mayorR()) < 1e-9,
        bien: 'Más público (a grande) y pocas pérdidas por sol (b chico).' },
      { texto: 'Busca un precio mayor que S/ 10 que recaude lo mismo que S/ 10.',
        logrado: val => { const R10 = recauda(val.a, val.b)(10); return R10 > 0 && pLibre(val) > 10 && Math.abs(rLibre(val) - R10) < 1e-9; },
        bien: 'Están a igual distancia del mejor precio: la curva es simétrica.' },
    ],
  };
  const rLibre = val => recauda(val.a, val.b)(pLibre(val));
  const mayorR = una(() => Math.max(...casosDe(mesaPrecio.controles).map(rLibre)));

  return {
    unidad: 'razonamiento-matematico.maximos-y-minimos',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-fichas.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/rm-plano.js'],
    // Glosario (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso.
    glosario: [
      { termino: 'cota', def: 'Valor que el resultado no puede cruzar, como «al menos 4». Con un caso que lo alcanza, prueba el mejor.',
        formas: ['cota', 'cotas'], ejemplo: 'Hay 4 músicos: al menos 4 personas. Si 4 alcanzan, el mínimo es 4.' },
      { termino: 'recaudación', simbolo: 'R', medida: 'S/', def: 'Dinero total que se junta al vender: el precio de cada entrada por las entradas vendidas.',
        ejemplo: 'A S/ 20 se venden 80 − 40 = 40 entradas: R = S/ 800.', ver: ['modelo de ventas'] },
      { termino: 'modelo de ventas', def: 'Fórmula que dice cuántas entradas se venden a cada precio. Con ella se calcula lo que se junta.',
        formas: ['modelo de ventas', 'modelos de ventas'], ejemplo: 'q = 80 − 2p: a S/ 10 se venden 60 entradas.', ver: ['recaudación'] },
      { termino: 'punto medio', def: 'El punto que queda justo a la mitad entre otros dos, a la misma distancia de ambos.',
        ejemplo: 'Entre los precios 0 y 45, el punto medio es 22,5.' },
      { termino: 'simétrica', def: 'Que se ve igual a los dos lados de una línea, como doblada sobre ella.',
        formas: ['simétrica', 'simétricas', 'simétrico', 'simétricos', 'simetría', 'simetrías'], ejemplo: 'p(90 − 2p) da 1000 con p = 20 y con p = 25.', ver: ['punto medio'] },
      { termino: 'completar el cuadrado', def: 'Reescribir una expresión como un número menos un cuadrado, para ver su mayor valor de un vistazo.',
        formas: ['completar el cuadrado', 'completando el cuadrado'], ejemplo: 'p(90 − 2p) = 1012,5 − 2(p − 22,5)²: nunca pasa de 1012,5.' },
      { termino: 'paralela', def: 'Recta que nunca corta a otra del mismo plano, por más que las prolongues.',
        formas: ['paralela', 'paralelas'], ejemplo: 'Dos rectas horizontales distintas son paralelas: no se cruzan.' },
      { termino: 'reflejo', def: 'Copia de espejo: el punto pasa al otro lado de la recta, a la misma distancia de ella.',
        formas: ['reflejo', 'reflejos', 'reflejar', 'refleja', 'reflejando', 'reflejada', 'reflejado'], ejemplo: 'B a 2,4 cuadros sobre el río: su reflejo B′ queda 2,4 cuadros debajo.', ver: ['simétrica'] },
      { termino: 'optimizar', def: 'Buscar el mejor valor posible: el mayor o el menor, según lo que se pida.',
        formas: ['optimizar', 'optimiza', 'optimizan'], ver: ['cota', 'restricción'] },
      { termino: 'restricción', def: 'Condición que limita lo que se puede elegir, como «sin rectas paralelas» o «precio entero».',
        formas: ['restricción', 'restricciones'], ver: ['optimizar'] },
      { termino: 'programación lineal', def: 'Método para hallar la mejor decisión cuando lo que se busca y las condiciones son de primer grado.',
        ver: ['restricción', 'optimizar'] },
    ],
    // Laboratorio: la cuarta recta que se mueve y gira (paralelas y tres por un punto), el río con B móvil y el modelo
    // de ventas a elección.
    laboratorio: [mesaRectas, mesaRio, mesaPrecio],
    historia: {
      texto: 'Desde 1947, George Dantzig trabajó en organizar decisiones con restricciones: así nació la programación lineal. No todos los problemas de mínimos del examen son de ese tipo, pero comparten algo: decir qué se optimiza, qué está permitido y por qué no hay una opción mejor.',
      pregunta: '¿Cómo se demuestra que no hay nada mejor?',
      fuente: { titulo: 'George Dantzig · entrevista de historia oral, INFORMS', url: 'https://www.informs.org/Explore/History-of-O.R.-Excellence/Oral-Histories/George-Dantzig' },
    },
    ideas: [personas, precios, regionesIdea, reflejo],
  };
});
