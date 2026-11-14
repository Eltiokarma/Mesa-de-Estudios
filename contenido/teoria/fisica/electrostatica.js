/*
 * Teoría de «Electrostática» (fisica.electrostatica). Molde: docs/teoria.md y la unidad de referencia
 * contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 14) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Colores (regla 4): carga q naranja (c-o), distancia r y d turquesa (c-i), fuerza F rojo (c-h), campo E verde (c-d).
 * El potencial V, la energía U y la capacidad C van en tinta: el kit tiene cuatro tokens y se distinguen por su letra.
 * Estado: completa (14 nov 2026): seis ideas que cubren los ocho temas del catálogo.
 * Códigos de error: EL1, EL2 y EL8 de docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md. Nuevos
 * (hipótesis, sin dato propio): EL-E0V (E = 0 implica V = 0), EL-VSIGNO (suma potenciales como flechas o sin signo),
 * EL-DIST (la energía ganada depende de la distancia entre placas), EL-CV (más capacidad, más voltaje en serie),
 * EL-REPARTO (reparte el voltaje por igual), EL-CON (aplica el caso conectado a un condensador aislado), EL-R2 (1/r en
 * vez de 1/r²), EL-UNID (cm sin pasar a m).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: seis relaciones entre cargas, campos y condensadores, cada una jugada antes de preguntarla.
 *   Persona y condiciones: postulante de 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: halla una fuerza de Coulomb, suma campos como flechas y potenciales como números, y reparte Q y V.
 *   Orden de atención: 1.º las cargas y sus flechas · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué el campo se suma con flechas y el potencial con números?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const q = { v: 'c-o', t: 'q' }, r = { v: 'c-i', t: 'r' }, d = { v: 'c-i', t: 'd' }, F = { v: 'c-h', t: 'F' }, E = { v: 'c-d', t: 'E' };
  const K = 9e9;
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const x = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    x.ent = (lo, hi) => lo + Math.floor(x() * (hi - lo + 1));
    x.de = xs => xs[Math.floor(x() * xs.length)];
    return x;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const o of distractores) {
      const txt = fmt(o.valor);
      if (vistos.has(txt) || !Number.isFinite(o.valor)) continue;
      vistos.add(txt);
      ops.push({ id: o.id, texto: txt, error: o.error, siFuera: o.siFuera });
    }
    return ops.slice(0, 4);
  }
  const pn = n => (n < 0 ? `(${f(n, 2)})` : f(n, 2));
  const conSigno = (n, u) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${f(Math.abs(n), 2)}${u ? ' ' + u : ''}`;
  // Notación científica con coma decimal: 3,2 × 10⁻¹⁷.
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const cien = (n, dd = 2) => {
    if (n === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(n))), m = n / 10 ** e;
    return `${f(m, dd)} × 10${String(e).split('').map(c => SUP[c]).join('')}`;
  };
  const carga = (x, y, rad, qq, nombre, paso, hasta) => ({ c: [x, y], r: rad, color: qq === 0 ? undefined : 'o', relleno: qq === 0 ? false : 0.2, rotulo: nombre, paso, hasta });
  const textoQ = (x, y, qq, u, paso, hasta) => ({ en: [x, y], texto: conSigno(qq, u), color: qq === 0 ? undefined : 'o', peso: 700, paso, hasta });

  // ---------- Idea 1: la carga se conserva y se reparte ----------
  // Cambia: las cargas de dos esferas iguales · Permanece: la suma total, antes y después de tocarse ·
  // Progresa: la fila de «después» · Se reserva: la cadena de dos contactos con una tercera esfera ·
  // Debe verse: al tocarse, dos esferas idénticas quedan con la mitad del total cada una.
  const FILAS = [2.2, -0.6, -3.4];
  const VISTA1 = { x0: -2.6, x1: 10.6, y0: -5.2, y1: 3.4 };
  const fila = (y, qs, rotulo, paso, hasta) => {
    const xs = qs.length === 2 ? [3.5, 7.5] : [2.3, 5.6, 8.9];
    return {
      discos: qs.map((qq, k) => carga(xs[k], y, 0.75, qq, 'ABC'[k], paso, hasta)),
      textos: [...qs.map((qq, k) => textoQ(xs[k], y - 1.45, qq, '', paso, hasta)), { en: [-2.4, y - 0.2], texto: rotulo, ancla: 'start', peso: 600, paso, hasta }],
    };
  };
  const juntar = (...partes) => {
    const o = { vista: VISTA1, discos: [], textos: [], segmentos: [] };
    for (const p of partes) for (const k of ['discos', 'textos', 'segmentos']) o[k].push(...(p[k] || []));
    return o;
  };
  const contacto = {
    id: 'electrizacion',
    titulo: 'La carga se reparte',
    temas: ['Carga y electrización'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Dos esferas metálicas iguales se tocan y se separan. Elige sus cargas, en microcoulombs, y mira cómo quedan.',
      voz: 'Suma las dos cargas de arriba y luego las de abajo.',
      controles: [
        { id: 'a', etiqueta: 'q de A', color: 'c-o', min: -6, max: 8, paso: 2, inicio: 6, unidad: 'μC', decimales: 0 },
        { id: 'b', etiqueta: 'q de B', color: 'c-o', min: -6, max: 8, paso: 2, inicio: -2, unidad: 'μC', decimales: 0 },
      ],
      dibujo: val => ({ datos: juntar(fila(FILAS[0], [val.a, val.b], 'antes'), fila(FILAS[1], [(val.a + val.b) / 2, (val.a + val.b) / 2], 'después')), estado: {} }),
      lectura: val => [`Total antes: ${conSigno(val.a + val.b, 'μC')} · total después: ${conSigno(val.a + val.b, 'μC')}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Tres esferas metálicas iguales: A tiene +12 μC; B y C, ninguna carga. A toca a B y se separan. Luego B toca a C. ¿Con qué carga queda C?',
      opciones: [
        { id: 'c', texto: '+3 μC', correcta: true },
        { id: 'tercio', texto: '+4 μC', error: 'EL-TERCIO', siFuera: 'Repartir entre tres sería cierto si las tres se tocaran a la vez.' },
        { id: 'seis', texto: '+6 μC', error: 'EL8', siFuera: '+6 μC es lo que B recibe de A. Al tocar a C, lo vuelve a repartir.' },
        { id: 'todo', texto: '+12 μC', error: 'EL8', siFuera: 'La carga no pasa entera: entre esferas iguales se reparte por mitades.' },
      ],
      dibujo: { datos: juntar(fila(FILAS[0], [12, 0, 0], 'inicio')), estado: {} },
      revelar: { datos: juntar(fila(FILAS[0], [12, 0, 0], 'inicio'), fila(FILAS[1], [6, 6, 0], 'A con B'), fila(FILAS[2], [6, 3, 3], 'B con C')), estado: {} },
      coincide: 'Coincide: B queda con +6 μC y, al tocar a C, cada una se lleva la mitad.',
    },
    mira: {
      datos: juntar(fila(FILAS[0], [12, 0, 0], 'inicio'), fila(FILAS[1], [6, 6, 0], 'A con B', 1), fila(FILAS[2], [6, 3, 3], 'B con C', 2)),
      pasos: [
        { estado: { paso: 0 }, texto: 'Al inicio solo A tiene carga: +12 μC.', ecuacion: ['total = +12 μC'] },
        { estado: { paso: 1 }, texto: 'A toca a B: el total, +12 μC, se reparte entre dos esferas iguales.', ecuacion: [{ sub: [q, 'A'] }, ' = ', { sub: [q, 'B'] }, ' = ', { frac: ['12 + 0', '2'] }, ' = +6 μC'] },
        { estado: { paso: 2 }, texto: 'B toca a C: ahora se reparten los +6 μC de B.', ecuacion: [{ sub: [q, 'B'] }, ' = ', { sub: [q, 'C'] }, ' = ', { frac: ['6 + 0', '2'] }, ' = +3 μC'] },
        { estado: { paso: 2 }, texto: 'La suma de las tres sigue siendo +12 μC: la carga se conservó.', ecuacion: ['6 + 3 + 3 = 12 μC'] },
      ],
    },
    regla: {
      texto: 'La carga total de un sistema aislado no cambia: solo pasa de un cuerpo a otro. Dos esferas conductoras iguales que se tocan quedan con la mitad del total.',
      ecuacion: [{ sub: [q, '1'] }, "' = ", { sub: [q, '2'] }, "' = ", { frac: [[{ sub: [q, '1'] }, ' + ', { sub: [q, '2'] }], '2'] }],
      condicion: 'las esferas son conductoras, del mismo tamaño y están aisladas. Si son de distinto tamaño, la grande se lleva más.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), a = x.de([-8, -4, 4, 8, 12, 16]), b = x.de([-6, -2, 0, 2, 6]), c = x.de([-4, 0, 4]);
        const ab = (a + b) / 2, bc = (ab + c) / 2;
        return {
          pregunta: `Tres esferas metálicas iguales tienen A = ${conSigno(a, 'μC')}, B = ${conSigno(b, 'μC')} y C = ${conSigno(c, 'μC')}. A toca a B; después B toca a C. ¿Con qué carga queda C?`,
          dibujo: { datos: juntar(fila(FILAS[0], [a, b, c], 'inicio')), estado: {} },
          opciones: opciones(bc, [
            { id: 'tercio', valor: (a + b + c) / 3, error: 'EL-TERCIO', siFuera: 'Ese sería el reparto si las tres se tocaran a la vez.' },
            { id: 'ab', valor: ab, error: 'EL8', siFuera: 'Esa es la carga de B tras tocar a A; falta el segundo contacto.' },
            { id: 'suma', valor: ab + c, error: 'EL8', siFuera: 'Esa es la suma de B y C: falta repartirla entre las dos.' },
          ], n => conSigno(n, 'μC')),
          solucion: { texto: 'Cada contacto reparte en mitades la suma de las dos esferas que se tocan.', ecuacion: [{ sub: [q, 'B'] }, ` = (${pn(a)} + ${pn(b)})/2 = ${f(ab)} · `, { sub: [q, 'C'] }, ` = (${pn(ab)} + ${pn(c)})/2 = ${conSigno(bc, 'μC')}`],
            dibujo: { datos: juntar(fila(FILAS[0], [a, b, c], 'inicio'), fila(FILAS[1], [ab, ab, c], 'A con B'), fila(FILAS[2], [ab, bc, bc], 'B con C')), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: Coulomb, la misma fuerza sobre las dos ----------
  // Cambia: la carga (igual en las dos) y la distancia · Permanece: la escala de las flechas (0,5 px por newton) ·
  // Progresa: el largo de las flechas al acercar o cargar · Se reserva: cargas distintas, que el juego no muestra ·
  // Debe verse: las dos flechas miden lo mismo aunque una carga sea cuatro veces la otra.
  const FPX = 0.75;  // px por newton
  const VISTA2 = { x0: -1, x1: 13, y0: -4.4, y1: 1.8 };
  const fCoulomb = (q1, q2, rc) => K * q1 * 1e-6 * q2 * 1e-6 / (rc / 100) ** 2;
  const par = (q1, q2, rc, y = 0, paso, conValor = true, hasta) => {
    const x1 = 6 - rc / 2, x2 = 6 + rc / 2, Fv = fCoulomb(q1, q2, rc);
    return {
      discos: [carga(x1, y, 0.6, q1, '+', paso, hasta), carga(x2, y, 0.6, q2, '+', paso, hasta)],
      textos: [textoQ(x1, y - 1.3, q1, 'μC', paso, hasta), textoQ(x2, y - 1.3, q2, 'μC', paso, hasta)],
      segmentos: [{ de: [x1, y + 0.9], a: [x2, y + 0.9], color: 'i', texto: `${f(rc, 0)} cm`, paso, hasta }],
      flechas: [
        { de: [x1 - 0.65, y], d: [-Fv, 0], escala: FPX, color: 'h', rotulo: conValor ? `${f(Fv, 1)} N` : 'F', paso, hasta },
        { de: [x2 + 0.65, y], d: [Fv, 0], escala: FPX, color: 'h', rotulo: conValor ? `${f(Fv, 1)} N` : 'F', paso, hasta },
      ],
    };
  };
  const lienzo2 = (...ps) => {
    const o = { vista: VISTA2, discos: [], textos: [], segmentos: [], flechas: [] };
    for (const p of ps) for (const k of Object.keys(o)) if (k !== 'vista') o[k].push(...(p[k] || []));
    return o;
  };
  const coulomb = {
    id: 'coulomb',
    titulo: 'La misma fuerza sobre las dos',
    temas: ['Ley de Coulomb'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Dos cargas iguales se empujan. Elige cuánta carga tiene cada una y a qué distancia están.',
      voz: 'Duplica la distancia y mira cuánto se acortan las flechas.',
      controles: [
        { id: 'q', etiqueta: 'q', color: 'c-o', min: 2, max: 3, paso: 1, inicio: 2, unidad: 'μC', decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 3, max: 6, paso: 1, inicio: 3, unidad: 'cm', decimales: 0 },
      ],
      dibujo: val => ({ datos: lienzo2(par(val.q, val.q, val.r)), estado: {} }),
      lectura: val => [F, ` = ${f(fCoulomb(val.q, val.q, val.r), 1)} N sobre cada carga`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora las cargas son distintas: 1 μC y 4 μC, a 3 cm. ¿Sobre cuál actúa una fuerza eléctrica mayor?',
      opciones: [
        { id: 'c', texto: 'Las dos sienten la misma fuerza', correcta: true },
        { id: 'chica', texto: 'Sobre la de 1 μC', error: 'EL2', siFuera: 'La de 1 μC sí se movería más si pesaran igual. La fuerza, en cambio, es la misma.' },
        { id: 'grande', texto: 'Sobre la de 4 μC', error: 'EL1', siFuera: 'La de 4 μC aporta más a la fuerza, pero esa fuerza actúa igual sobre las dos.' },
      ],
      dibujo: { datos: lienzo2({ discos: par(1, 4, 3).discos, textos: par(1, 4, 3).textos, segmentos: par(1, 4, 3).segmentos }), estado: {} },
      revelar: { datos: lienzo2(par(1, 4, 3)), estado: {} },
      coincide: 'Coincide: cada carga empuja a la otra con 40 N. Es una sola interacción.',
    },
    mira: {
      datos: lienzo2(
        { discos: par(1, 4, 3).discos, textos: par(1, 4, 3).textos, segmentos: par(1, 4, 3).segmentos },
        { flechas: par(1, 4, 3, 0, 1).flechas },
        Object.assign(par(1, 4, 6, -3.3, 3), { textos: [] }),
      ),
      pasos: [
        { estado: { paso: 0 }, texto: 'En la fórmula entran las dos cargas multiplicadas.', ecuacion: [F, ' = k ', { frac: [[{ sub: [q, '1'] }, { sub: [q, '2'] }], { sup: [r, '2'] }] }] },
        { estado: { paso: 1 }, texto: 'Con 1 μC, 4 μC y 0,03 m, sale lo mismo para las dos.', ecuacion: [F, ' = 9×10⁹ · ', { frac: ['1×10⁻⁶ · 4×10⁻⁶', '0,03²'] }, ` = ${f(fCoulomb(1, 4, 3), 0)} N`] },
        { estado: { paso: 1 }, texto: 'Acción y reacción: iguales, opuestas y sobre cuerpos distintos.', ecuacion: [{ sub: [F, '1 sobre 2'] }, ' = −', { sub: [F, '2 sobre 1'] }] },
        { estado: { paso: 3 }, texto: 'Al doble de distancia, la fuerza es la cuarta parte.', ecuacion: ['(2', r, ')² = 4', { sup: [r, '2'] }, `  →  ${f(fCoulomb(1, 4, 6), 0)} N`] },
      ],
    },
    regla: {
      texto: 'Dos cargas puntuales se atraen o se repelen con fuerzas iguales y opuestas, proporcionales al producto de las cargas e inversas al cuadrado de la distancia.',
      ecuacion: [F, ' = k ', { frac: [[{ abs: [{ sub: [q, '1'] }, { sub: [q, '2'] }] }], { sup: [r, '2'] }] }, '   ·   k = 9 × 10⁹ N·m²/C²'],
      condicion: 'cargas puntuales y quietas, en el aire o el vacío, con q en coulombs y r en metros.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s);
        if (s % 2) {
          const q1 = x.de([1, 2, 3, 5]), q2 = x.de([2, 4, 6]), rc = x.de([3, 6, 10, 30]), Fv = fCoulomb(q1, q2, rc);
          return {
            pregunta: ['Dos cargas de ', { sub: [q, '1'] }, ` = ${f(q1)} μC y `, { sub: [q, '2'] }, ` = ${f(q2)} μC están a `, r, ` = ${f(rc)} cm. ¿Qué fuerza se ejercen?`],
            opciones: opciones(Fv, [
              { id: 'r1', valor: Fv * rc / 100, error: 'EL-R2', siFuera: 'Esa cuenta divide entre r y no entre r².' },
              { id: 'cm', valor: Fv / 1e4, error: 'EL-UNID', siFuera: 'Esa cuenta deja r en centímetros. k pide metros.' },
              { id: 'suma', valor: K * (q1 + q2) * 1e-6 * 1e-6 / (rc / 100) ** 2, error: 'EL1', siFuera: 'Esa cuenta suma las cargas. En Coulomb se multiplican.' },
            ], n => `${n >= 0.1 && n < 1e4 ? f(n, 1) : cien(n, 1)} N`),
            solucion: { texto: 'Cargas en coulombs, distancia en metros.', ecuacion: [F, ` = 9×10⁹ · ${f(q1)}×10⁻⁶ · ${f(q2)}×10⁻⁶ / ${f(rc / 100)}² = ${Fv >= 0.1 && Fv < 1e4 ? f(Fv, 1) : cien(Fv, 1)} N`] },
          };
        }
        const F0 = x.de([8, 12, 18, 36, 90]), k = x.de([2, 3, 1 / 2, 1 / 3]), F1 = F0 / (k * k);
        const dice = k >= 1 ? `${k === 2 ? 'el doble' : 'el triple'}` : `${k === 0.5 ? 'la mitad' : 'la tercera parte'}`;
        return {
          pregunta: ['Dos cargas se repelen con ', F, ` = ${f(F0)} N. Si la distancia entre ellas pasa a ser ${dice}, ¿qué fuerza se ejercen?`],
          opciones: opciones(F1, [
            { id: 'lineal', valor: F0 / k, error: 'EL-R2', siFuera: 'Esa cuenta divide entre la distancia, no entre su cuadrado.' },
            { id: 'directa', valor: F0 * k * k, error: 'EL-R2', siFuera: 'Esa cuenta crece con la distancia; Coulomb va al revés.' },
            { id: 'igual', valor: F0, error: 'EL1', siFuera: 'Sería cierto si la distancia no cambiara.' },
          ], n => `${f(n, 2)} N`),
          solucion: { texto: `La fuerza se divide entre el cuadrado del factor: ${f(k * k, 2)}.`, ecuacion: [F, ` = ${f(F0)} / ${f(k, 2)}² = ${f(F1, 2)} N`] },
        };
      },
    },
  };

  // ---------- Idea 3: el campo se suma con flechas; el potencial, con números ----------
  // Cambia: dónde está el punto P y el signo de la segunda carga · Permanece: las dos cargas de 2 nC a 10 cm ·
  // Progresa: E₁, E₂ y su suma en P · Se reserva: el potencial en el punto donde E = 0 ·
  // Debe verse: E puede ser cero donde V no lo es.
  const QN = 2;                          // nC
  const VISTA3 = { x0: -1.6, x1: 11.6, y0: -2.2, y1: 3.4 };
  const S3 = 280 / 13.2;                 // px por cm en esta vista (para dibujar líneas de campo en cm)
  const EPX = 4;                         // px por kN/C
  const Ede = (qn, xc) => K * qn * 1e-9 / (xc / 100) ** 2 / 1000;   // kN/C, módulo
  const Vde = (qn, xc) => K * qn * 1e-9 / (xc / 100);              // V, con signo
  const lineas = (x0, signo, paso) => Array.from({ length: 8 }, (_, k) => {
    const a = k * Math.PI / 4, c = Math.cos(a), sn = Math.sin(a);
    return signo > 0
      ? { de: [x0 + 0.75 * c, 0.75 * sn], d: [0.9 * c, 0.9 * sn], escala: S3, color: 'd', paso }
      : { de: [x0 + 1.65 * c, 1.65 * sn], d: [-0.9 * c, -0.9 * sn], escala: S3, color: 'd', paso };
  });
  function campo(xp, s2, o = {}) {
    const e1 = Ede(QN, xp), e2 = Ede(QN, 10 - xp);
    const v1 = e1, v2 = s2 > 0 ? -e2 : e2;   // componente x: la 1 empuja a la derecha; la 2 (positiva) a la izquierda
    const tot = v1 + v2;
    const datos = {
      vista: VISTA3,
      discos: [carga(0, 0, 0.5, QN, '+'), carga(10, 0, 0.5, s2 * QN, s2 > 0 ? '+' : '−')],
      textos: [textoQ(0, -1.4, QN, 'nC'), textoQ(10, -1.4, s2 * QN, 'nC'), { en: [xp, -0.9], texto: 'P', peso: 700 }],
      puntos: [{ x: xp, y: 0, hueco: true }],
      flechas: [...(o.lineas === undefined ? [] : [...lineas(0, 1, o.lineas), ...lineas(10, s2, o.lineas)]),
        { de: [xp, 2.2], d: [v1, 0], escala: EPX, color: 'd', rotulo: o.valores ? `${f(e1, 1)}` : 'E₁', discontinua: true, paso: o.e },
        { de: [xp, 1.2], d: [v2, 0], escala: EPX, color: 'd', rotulo: o.valores ? `${f(e2, 1)}` : 'E₂', discontinua: true, paso: o.e },
        { de: [xp, 0], d: [tot, 0], escala: EPX, color: 'd', rotulo: o.valores ? `E = ${f(Math.abs(tot), 1)}` : 'E', paso: o.tot }],
      segmentos: [],
    };
    if (o.v !== undefined) datos.textos.push(
      { en: [xp, 3.0], texto: `V = ${f(Vde(QN, xp), 0)} + ${f(Vde(s2 * QN, 10 - xp), 0)} = ${f(Vde(QN, xp) + Vde(s2 * QN, 10 - xp), 0)} V`, peso: 700, paso: o.v });
    return datos;
  }
  const superposicion = {
    id: 'campo-potencial',
    titulo: 'Campo cero no es potencial cero',
    temas: ['Campo eléctrico y líneas de fuerza', 'Energía potencial y potencial eléctrico'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Dos cargas de 2 nC a 10 cm. Mueve P y cambia el signo de la segunda. Mira cómo se suman E₁ y E₂.',
      voz: 'Busca un punto donde las dos flechas se cancelen.',
      controles: [
        { id: 'x', etiqueta: 'P en', min: 3, max: 7, paso: 1, inicio: 4, unidad: 'cm', decimales: 0 },
        { id: 's', etiqueta: 'Segunda carga', opciones: [{ valor: 1, texto: 'Positiva' }, { valor: -1, texto: 'Negativa' }] },
      ],
      dibujo: val => ({ datos: campo(val.x, val.s, { valores: false }), estado: {} }),
      lectura: val => {
        const t = Ede(QN, val.x) - val.s * Ede(QN, 10 - val.x);
        return Math.abs(t) < 1e-9 ? [E, ' = 0 en P'] : [E, ` = ${f(Math.abs(t), 1)} kN/C hacia la ${t > 0 ? 'derecha' : 'izquierda'}`];
      },
      minimo: 4,
    },
    predice: {
      pregunta: 'Con las dos cargas positivas, en el punto medio el campo total es cero. ¿Cuánto vale ahí el potencial eléctrico?',
      opciones: [
        { id: 'c', texto: `${f(2 * Vde(QN, 5), 0)} V`, correcta: true },
        { id: 'cero', texto: '0 V: el campo es cero', error: 'EL-E0V', siFuera: 'E = 0 es cierto: las flechas se cancelan. El potencial no es flecha, y los dos aportes son positivos.' },
        { id: 'una', texto: `${f(Vde(QN, 5), 0)} V`, error: 'EL-VSIGNO', siFuera: 'Ese es el potencial de una sola carga. Las dos aportan.' },
        { id: 'neg', texto: `−${f(2 * Vde(QN, 5), 0)} V`, error: 'EL-VSIGNO', siFuera: 'Las dos cargas son positivas: sus potenciales son positivos.' },
      ],
      dibujo: { datos: campo(5, 1, { valores: false }), estado: {} },
      revelar: { datos: campo(5, 1, { valores: false, v: 0 }), estado: {} },
      coincide: 'Coincide: los campos se cancelan como flechas; los potenciales se suman como números.',
    },
    mira: {
      datos: campo(5, 1, { valores: true, lineas: 0, e: 1, tot: 2, v: 3 }),
      pasos: [
        { estado: { paso: 0 }, texto: 'Las líneas salen de cada carga positiva. P está a 5 cm de ambas.', ecuacion: [E, ' = k ', { frac: [q, { sup: [r, '2'] }] }, ` = ${f(Ede(QN, 5), 1)} kN/C`] },
        { estado: { paso: 1 }, texto: 'Las dos flechas son iguales y opuestas.', ecuacion: [{ sub: [E, '1'] }, ' = −', { sub: [E, '2'] }] },
        { estado: { paso: 2 }, texto: 'Sumadas como flechas, se cancelan: no hay campo en P.', ecuacion: [E, ' = 0'] },
        { estado: { paso: 3 }, texto: 'El potencial es un número con signo: los dos aportes se suman.', ecuacion: ['V = k', { frac: [q, r] }, ' + k', { frac: [q, r] }, ` = ${f(Vde(QN, 5), 0)} + ${f(Vde(QN, 5), 0)} = ${f(2 * Vde(QN, 5), 0)} V`] },
      ],
    },
    regla: {
      texto: 'El campo de varias cargas es la suma de sus flechas. El potencial es la suma de números con signo. Uno puede ser cero sin que el otro lo sea.',
      ecuacion: [E, ' = k', { frac: [q, { sup: [r, '2'] }] }, ' (flecha)   ·   V = k', { frac: [q, r] }, ' (número con signo)'],
      condicion: 'cargas puntuales y V = 0 muy lejos de ellas. Las líneas de campo salen de + y entran a −.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), qa = x.de([2, 4, 6]), qb = x.de([2, 4, 6]) * (s % 2 ? -1 : 1), sep = x.de([6, 10, 20]);
        const m = sep / 2, va = Vde(qa, m), vb = Vde(qb, m), v = va + vb;
        if (s % 3 === 0) {
          const e = Ede(qa, m) + (qb < 0 ? Ede(-qb, m) : -Ede(qb, m));
          return {
            pregunta: ['Dos cargas de ', `${conSigno(qa, 'nC')} y ${conSigno(qb, 'nC')} están a ${f(sep)} cm. ¿Cuánto vale el campo `, E, ' en el punto medio?'],
            opciones: opciones(Math.abs(e), [
              { id: 'otra', valor: Math.abs(Ede(qa, m) + (qb < 0 ? -1 : 1) * Ede(Math.abs(qb), m)), error: 'EL-VSIGNO', siFuera: qb < 0 ? 'Esa cuenta resta los campos; con signos opuestos, en el medio apuntan igual.' : 'Esa cuenta suma los campos; con signos iguales, en el medio se oponen.' },
              { id: 'una', valor: Ede(qa, m), error: 'EL-VSIGNO', siFuera: 'Ese es el campo de una sola carga.' },
              { id: 'r', valor: Ede(qa, sep), error: 'EL-R2', siFuera: 'Esa cuenta usa toda la separación; P está a la mitad.' },
            ], n => `${f(n, 1)} kN/C`),
            solucion: { texto: qb < 0 ? 'Con signos opuestos, en el medio las dos flechas apuntan igual: se suman.' : 'Con signos iguales, en el medio las flechas se oponen: se restan.', ecuacion: [E, ` = ${f(Ede(qa, m), 1)} ${qb < 0 ? '+' : '−'} ${f(Ede(Math.abs(qb), m), 1)} = ${f(Math.abs(e), 1)} kN/C`] },
          };
        }
        return {
          pregunta: [`Dos cargas de ${conSigno(qa, 'nC')} y ${conSigno(qb, 'nC')} están a ${f(sep)} cm. ¿Cuánto vale el potencial en el punto medio?`],
          opciones: opciones(v, [
            { id: 'abs', valor: Math.abs(va) + Math.abs(vb), error: 'EL-VSIGNO', siFuera: 'Esa cuenta olvida el signo de la carga negativa.' },
            { id: 'una', valor: va, error: 'EL-VSIGNO', siFuera: 'Ese es el aporte de una sola carga.' },
            { id: 'cm', valor: v / 100, error: 'EL-UNID', siFuera: 'Esa cuenta deja r en centímetros. k pide metros.' },
          ], n => conSigno(n, 'V')),
          solucion: { texto: 'Cada carga aporta kq/r con su signo; se suman como números.', ecuacion: ['V = ', `${f(va, 0)} + (${f(vb, 0)}) = ${conSigno(v, 'V')}`] },
        };
      },
    },
  };

  // ---------- Idea 4: placas, campo uniforme y equipotenciales ----------
  // Cambia: el voltaje entre placas, su separación y la partícula · Permanece: el campo igual en todo el espacio entre placas ·
  // Progresa: el largo de E y de F · Se reserva: la energía ganada, que no depende de la separación ·
  // Debe verse: E = ΔV/d es el mismo en cualquier punto; la energía ganada es qΔV.
  const QE = 1.6e-19;
  const VISTA4 = { x0: -2.2, x1: 8.6, y0: -3, y1: 3.2 };
  const EPX4 = 3.2;   // px por kV/m
  function placas(dv, dc, part, o = {}) {
    const Ev = dv / (dc / 100) / 1000;   // kV/m
    const sg = part === 'p' ? 1 : -1;    // el campo apunta de + (izquierda) a − (derecha)
    const xp = part === 'p' ? 0.8 : dc - 0.8;
    const eq = [0.25, 0.5, 0.75].map(k => k * dc);
    return {
      vista: VISTA4,
      poligonos: [{ puntos: [[0, -2.4], [0, 2.4]], grosor: 'variable' }, { puntos: [[dc, -2.4], [dc, 2.4]], grosor: 'variable' }],
      segmentos: [
        ...eq.map(xx => ({ de: [xx, -2.3], a: [xx, 2.3], discontinua: true, grosor: 'fino', paso: o.eq })),
        { de: [0, -2.75], a: [dc, -2.75], color: 'i', texto: `${f(dc, 0)} cm`, lado: -1 },
      ],
      textos: [
        { en: [0, 2.85], texto: `+${f(dv, 0)} V`, peso: 700 }, { en: [dc, 2.85], texto: '0 V', peso: 700 },
        { en: [dc / 2, -2.0], texto: `${f(dv / 2, 0)} V`, peso: 600, paso: o.eq },
        { en: [xp, -0.9], texto: part === 'p' ? 'protón' : 'electrón', peso: 600 },
      ],
      discos: [{ c: [xp, 0], r: 0.25, color: 'o', relleno: 0.4, rotulo: '' }],
      flechas: [
        ...[0.3, 0.55].map(k => ({ de: [k * dc, 1.4], d: [Ev, 0], escala: EPX4, color: 'd', rotulo: k === 0.3 ? 'E' : '', paso: o.e })),
        { de: [xp, 0], d: [sg * Ev, 0], escala: EPX4, color: 'h', rotulo: 'F', paso: o.f },
      ],
    };
  }
  const uniforme = {
    id: 'campo-uniforme',
    titulo: 'Entre placas, el campo es parejo',
    temas: ['Carga en campo uniforme', 'Superficies equipotenciales y conductores', 'Energía potencial y potencial eléctrico'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Dos placas metálicas con un voltaje entre ellas. Cambia el voltaje, la separación y la partícula, y mira el campo y la fuerza.',
      voz: 'Compara las flechas de E en dos lugares distintos entre las placas.',
      controles: [
        { id: 'dv', etiqueta: 'ΔV', min: 100, max: 400, paso: 100, inicio: 200, unidad: 'V', decimales: 0 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 2, max: 6, paso: 2, inicio: 4, unidad: 'cm', decimales: 0 },
        { id: 'p', etiqueta: 'Partícula', opciones: [{ valor: 'p', texto: 'Protón' }, { valor: 'e', texto: 'Electrón' }] },
      ],
      dibujo: val => ({ datos: placas(val.dv, val.d, val.p), estado: {} }),
      lectura: val => [E, ` = ${f(val.dv / (val.d / 100), 0)} V/m · `, F, ` = ${cien(QE * val.dv / (val.d / 100), 1)} N`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Un electrón parte del reposo junto a la placa de 0 V y llega a la de +200 V. ¿Qué energía cinética gana?',
      opciones: [
        { id: 'c', texto: '200 eV', correcta: true },
        { id: 'dist', texto: 'Depende de la distancia entre placas', error: 'EL-DIST', siFuera: 'La fuerza sí depende de d. Pero con placas más juntas recorre menos: el producto no cambia.' },
        { id: 'cero', texto: '0: el electrón es negativo', error: 'EL-VSIGNO', siFuera: 'Su carga es negativa, por eso va hacia la placa positiva. Ahí gana energía.' },
        { id: 'mitad', texto: '100 eV', error: 'EL-VSIGNO', siFuera: 'Esa es la ganancia a media distancia. Llega hasta la otra placa.' },
      ],
      dibujo: { datos: placas(200, 4, 'e', { e: 9, f: 9 }), estado: {} },
      revelar: { datos: placas(200, 4, 'e'), estado: {} },
      coincide: 'Coincide: gana su carga por la diferencia de potencial, 200 eV, que son 3,2 × 10⁻¹⁷ J.',
    },
    mira: {
      datos: placas(200, 4, 'e', { e: 1, f: 2, eq: 3 }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Entre placas el campo es el mismo en todo punto.', ecuacion: [E, ' = ', { frac: ['ΔV', d] }, ' = ', { frac: ['200', '0,04'] }, ' = 5000 V/m'] },
        { estado: { paso: 2 }, texto: 'La fuerza sobre el electrón es constante y va contra E.', ecuacion: [F, ' = ', q, E, ` = 1,6×10⁻¹⁹ · 5000 = ${cien(QE * 5000, 1)} N`] },
        { estado: { paso: 2 }, texto: 'El trabajo es fuerza por distancia: la d se cancela.', ecuacion: ['W = ', F, d, ' = ', q, E, d, ' = ', q, 'ΔV = 200 eV'] },
        { estado: { paso: 3 }, texto: 'Las líneas a trazos son equipotenciales: moverse sobre una no cuesta trabajo.', ecuacion: ['ΔV = 0  →  W = 0'] },
        { estado: { paso: 3 }, texto: 'Cada placa es conductora: dentro del metal E = 0 y V es único.', ecuacion: ['conductor: ', E, ' = 0 adentro'] },
      ],
    },
    regla: {
      texto: 'Entre placas paralelas el campo es uniforme. Una carga gana una energía cinética igual a su carga por la diferencia de potencial que recorre.',
      ecuacion: [E, ' = ', { frac: ['ΔV', d] }, '   ·   ', F, ' = ', q, E, '   ·   ΔK = |', q, '| ΔV'],
      condicion: 'placas grandes y cercanas; solo actúa la fuerza eléctrica. 1 eV = 1,6 × 10⁻¹⁹ J.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), dv = x.de([50, 100, 150, 300, 500]), dc = x.de([1, 2, 5, 10]);
        if (s % 2) return {
          pregunta: ['Dos placas paralelas están a ', d, ` = ${f(dc)} cm con ${f(dv)} V entre ellas. ¿Cuánto vale el campo `, E, ' entre ellas?'],
          opciones: opciones(dv / (dc / 100), [
            { id: 'cm', valor: dv / dc, error: 'EL-UNID', siFuera: 'Esa cuenta deja d en centímetros. El campo va en V/m.' },
            { id: 'por', valor: dv * dc / 100, error: 'EL-DIST', siFuera: 'Esa cuenta multiplica por d. Más separación da menos campo.' },
            { id: 'v', valor: dv, error: 'EL-VSIGNO', siFuera: 'Ese es el voltaje; falta dividir entre la separación.' },
          ], n => `${f(n, 0)} V/m`),
          solucion: { texto: 'Voltaje entre separación, en metros.', ecuacion: [E, ` = ${f(dv)} / ${f(dc / 100)} = ${f(dv / (dc / 100), 0)} V/m`] },
        };
        const zq = x.de([1, 2]), nom = zq === 1 ? 'un protón' : 'una partícula alfa (carga +2e)';
        return {
          pregunta: [`${nom === 'un protón' ? 'Un protón' : 'Una partícula alfa (carga +2e)'} parte del reposo junto a la placa positiva y llega a la negativa, con ${f(dv)} V entre ellas y `, d, ` = ${f(dc)} cm. ¿Qué energía cinética gana?`],
          opciones: opciones(zq * dv, [
            { id: 'd', valor: zq * dv * dc, error: 'EL-DIST', siFuera: 'Esa cuenta multiplica por la separación; la energía solo depende de ΔV.' },
            { id: 'carga', valor: dv, error: 'EL-VSIGNO', siFuera: zq === 2 ? 'Esa es la ganancia de una sola carga e; la alfa tiene dos.' : 'Esa cuenta pierde la carga.' },
            { id: 'mitad', valor: zq * dv / 2, error: 'EL-VSIGNO', siFuera: 'Esa es la ganancia a media distancia.' },
          ], n => `${f(n, 0)} eV`),
          solucion: { texto: 'Gana su carga por la diferencia de potencial; la separación no entra.', ecuacion: ['ΔK = ', `${f(zq)}e · ${f(dv)} V = ${f(zq * dv, 0)} eV`] },
        };
      },
    },
  };

  // ---------- Idea 5: condensadores en serie y en paralelo ----------
  // Cambia: cómo se conectan dos condensadores y la capacidad del primero · Permanece: la pila de 12 V ·
  // Progresa: la carga de cada uno · Se reserva: el reparto del voltaje en serie ·
  // Debe verse: en serie la carga es la misma; en paralelo, el voltaje.
  const EPS = 12, C2 = 6;
  const conectar = (modo, c1, c2, o = {}) => {
    const ceq = modo === 'serie' ? c1 * c2 / (c1 + c2) : c1 + c2;
    const Q = ceq * EPS, q1 = modo === 'serie' ? Q : c1 * EPS, q2 = modo === 'serie' ? Q : c2 * EPS;
    const el = (c, qq, k) => ({ tipo: 'C', rotulo: `C${k} = ${f(c)} μF`, lectura: o.q === false ? '' : `${f(qq, 1)} μC`, color: 'o', voltimetro: o.v ? `${f(qq / c, 1)} V` : null, desde: o.desde });
    const e1 = el(c1, q1, '₁'), e2 = el(c2, q2, '₂');
    return { datos: modo === 'serie' ? { fuente: { rotulo: `${EPS} V` }, serie: [e1, e2] } : { fuente: { rotulo: `${EPS} V` }, ramas: [e1, e2] }, estado: {} };
  };
  const ceqDe = (modo, c1, c2) => (modo === 'serie' ? c1 * c2 / (c1 + c2) : c1 + c2);
  const condensadores = {
    id: 'serie-paralelo',
    titulo: 'En serie, la misma carga',
    temas: ['Condensadores en serie y en paralelo'],
    pieza: 'fis-circuito',
    juega: {
      consigna: 'Dos condensadores, descargados, se conectan a una pila de 12 V. Elige cómo conectarlos y cuánto vale C₁. Mira la carga de cada uno.',
      voz: 'Compara la carga de los dos en serie y luego en paralelo.',
      controles: [
        { id: 'm', etiqueta: 'Conexión', opciones: [{ valor: 'serie', texto: 'En serie' }, { valor: 'paralelo', texto: 'En paralelo' }] },
        { id: 'c1', etiqueta: 'C₁', min: 2, max: 6, paso: 1, inicio: 3, unidad: 'μF', decimales: 0 },
      ],
      dibujo: val => conectar(val.m, val.c1, C2),
      lectura: val => [`Capacidad equivalente: ${f(ceqDe(val.m, val.c1, C2), 2)} μF`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En serie, C₁ = 2 μF y C₂ = 6 μF con la pila de 12 V. ¿Qué voltaje queda en C₁?',
      opciones: [
        { id: 'c', texto: '9 V', correcta: true },
        { id: 'grande', texto: '3 V', error: 'EL-CV', siFuera: '3 V es lo que queda en C₂. Con la misma carga, el de menor capacidad necesita más voltaje.' },
        { id: 'igual', texto: '6 V', error: 'EL-REPARTO', siFuera: 'Mitad y mitad sería cierto si los dos tuvieran la misma capacidad.' },
        { id: 'todo', texto: '12 V', error: 'EL-REPARTO', siFuera: '12 V en cada uno sería cierto en paralelo. En serie se reparten.' },
      ],
      dibujo: conectar('serie', 2, 6, { q: false }),
      revelar: conectar('serie', 2, 6, { v: true }),
      coincide: 'Coincide: los dos guardan 9 μC; V = Q/C da 9 V y 3 V, que suman 12 V.',
    },
    mira: {
      datos: conectar('serie', 2, 6, { v: true, desde: 2 }).datos,
      pasos: [
        { estado: { corte: 0 }, texto: 'En serie se suman las inversas.', ecuacion: [{ frac: ['1', { sub: ['C', 'eq'] }] }, ' = ', { frac: ['1', '2'] }, ' + ', { frac: ['1', '6'] }, '  →  ', { sub: ['C', 'eq'] }, ' = 1,5 μF'] },
        { estado: { corte: 1 }, texto: 'La pila entrega una sola carga, que llega igual a los dos.', ecuacion: [q, ' = ', { sub: ['C', 'eq'] }, ' · 12 = 18 μC'] },
        { estado: { corte: 2 }, texto: 'Cada voltaje es su carga entre su capacidad.', ecuacion: [{ sub: ['V', '1'] }, ' = 18/2 = 9 V · ', { sub: ['V', '2'] }, ' = 18/6 = 3 V'] },
        { estado: { corte: 2 }, texto: 'En paralelo sería al revés: mismo V y las cargas se suman.', ecuacion: [{ sub: ['C', 'eq'] }, ' = ', { sub: ['C', '1'] }, ' + ', { sub: ['C', '2'] }] },
      ],
    },
    regla: {
      texto: 'En serie, todos guardan la misma carga y los voltajes se suman. En paralelo, todos tienen el mismo voltaje y las cargas se suman.',
      ecuacion: ['serie: ', { frac: ['1', { sub: ['C', 'eq'] }] }, ' = Σ', { frac: ['1', 'C'] }, '   ·   paralelo: ', { sub: ['C', 'eq'] }, ' = ΣC   ·   ', q, ' = C V'],
      condicion: 'los condensadores empiezan descargados y se conectan a la misma pila.',
    },
    ahoraTu: {
      pieza: 'fis-circuito',
      generar(s) {
        const x = azar(s), modo = s % 2 ? 'paralelo' : 'serie', c1 = x.de([2, 3, 4, 6]), c2 = x.de([3, 6, 12]), v = x.de([6, 12, 24]);
        const ceq = ceqDe(modo, c1, c2), pide = s % 3;
        if (pide === 0) return {
          pregunta: `Dos condensadores de ${f(c1)} μF y ${f(c2)} μF se conectan en ${modo}. ¿Cuál es su capacidad equivalente?`,
          dibujo: { datos: modo === 'serie' ? { fuente: { rotulo: `${f(v)} V` }, serie: [{ tipo: 'C', rotulo: `${f(c1)} μF`, color: 'o' }, { tipo: 'C', rotulo: `${f(c2)} μF`, color: 'o' }] } : { fuente: { rotulo: `${f(v)} V` }, ramas: [{ tipo: 'C', rotulo: `${f(c1)} μF`, color: 'o' }, { tipo: 'C', rotulo: `${f(c2)} μF`, color: 'o' }] }, estado: {} },
          opciones: opciones(ceq, [
            { id: 'otra', valor: ceqDe(modo === 'serie' ? 'paralelo' : 'serie', c1, c2), error: 'EL-CV', siFuera: modo === 'serie' ? 'Esa es la suma, que vale en paralelo.' : 'Esa es la regla de las inversas, que vale en serie.' },
            { id: 'prom', valor: (c1 + c2) / 2, error: 'EL-REPARTO', siFuera: 'El promedio no es ninguna de las dos reglas.' },
            { id: 'inv', valor: 1 / c1 + 1 / c2, error: 'EL-CV', siFuera: 'Esa es la suma de inversas; falta invertir el resultado.' },
          ], n => `${f(n, 2)} μF`),
          solucion: { texto: modo === 'serie' ? 'En serie se suman las inversas.' : 'En paralelo las capacidades se suman.', ecuacion: [{ sub: ['C', 'eq'] }, modo === 'serie' ? ` = ${f(c1)}·${f(c2)}/(${f(c1)} + ${f(c2)}) = ${f(ceq, 2)} μF` : ` = ${f(c1)} + ${f(c2)} = ${f(ceq, 2)} μF`] },
        };
        const q1 = modo === 'serie' ? ceq * v : c1 * v;
        return {
          pregunta: `Dos condensadores de ${f(c1)} μF y ${f(c2)} μF, en ${modo}, se conectan a ${f(v)} V. ¿Qué carga guarda el de ${f(c1)} μF?`,
          opciones: opciones(q1, [
            { id: 'otro', valor: modo === 'serie' ? c1 * v : ceq * v, error: 'EL-CV', siFuera: modo === 'serie' ? 'Esa cuenta le da los 12 V enteros; en serie el voltaje se reparte.' : 'Esa es la carga total de los dos.' },
            { id: 'div', valor: c1 / v, error: 'EL-UNID', siFuera: 'Esa cuenta divide; la carga es C por V.' },
            { id: 'mitad', valor: ceq * v / 2, error: 'EL-REPARTO', siFuera: 'La carga no se reparte por mitades.' },
          ], n => `${f(n, 2)} μC`),
          solucion: { texto: modo === 'serie' ? 'En serie los dos tienen la carga del equivalente.' : 'En paralelo cada uno tiene todo el voltaje.', ecuacion: [q, modo === 'serie' ? ` = ${f(ceq, 2)} · ${f(v)} = ${f(q1, 2)} μC` : ` = ${f(c1)} · ${f(v)} = ${f(q1, 2)} μC`] },
        };
      },
    },
  };

  // ---------- Idea 6: la energía de un condensador ----------
  // Cambia: cuánto se separan las placas de un condensador conectado · Permanece: la pila (V fijo) ·
  // Progresa: las barras de C, Q y U, como múltiplos de su valor inicial · Se reserva: el condensador desconectado ·
  // Debe verse: conectado o aislado deciden qué se mantiene, y la energía va en sentidos opuestos.
  const factores = (modo, k) => (modo === 'con'
    ? { C: 1 / k, Q: 1 / k, V: 1, U: 1 / k }
    : { C: 1 / k, Q: 1, V: k, U: k });
  const fmtF = x => (Math.abs(x - 1) < 1e-9 ? 'igual' : x > 1 ? `×${f(x, 2)}` : `×${f(x, 2)}`);
  const barrasF = (modo, k, corte) => {
    const fs = factores(modo, k);
    return { max: 3, referencia: { valor: 1, texto: 'antes' }, barras: [
      { rotulo: 'C', valor: fs.C, texto: fmtF(fs.C), desde: corte ? 1 : 0 },
      { rotulo: 'Q', valor: fs.Q, texto: fmtF(fs.Q), color: 'o', desde: corte ? 2 : 0 },
      { rotulo: 'V', valor: fs.V, texto: fmtF(fs.V), desde: corte ? 2 : 0 },
      { rotulo: 'U', valor: fs.U, texto: fmtF(fs.U), desde: corte ? 3 : 0 },
    ] };
  };
  const energia = {
    id: 'energia-condensador',
    titulo: 'Conectado o aislado cambia todo',
    temas: ['Energía de un condensador'],
    pieza: 'fis-cuentas',
    juega: {
      consigna: 'Un condensador cargado sigue conectado a su pila. Separa sus placas y mira cuántas veces cambian C, Q, V y U.',
      voz: 'Con la pila conectada, ¿qué barra no se mueve?',
      controles: [{ id: 'k', etiqueta: 'Separación', min: 1, max: 3, paso: 1, inicio: 2, unidad: '× d', decimales: 0 }],
      dibujo: val => ({ datos: barrasF('con', val.k), estado: {} }),
      lectura: val => ['U = ½ C V² → ', fmtF(1 / val.k), ' la energía inicial'],
      minimo: 2,
    },
    predice: {
      pregunta: 'Ahora el condensador cargado se desconecta de la pila y después separas sus placas al doble. ¿Qué pasa con su energía?',
      opciones: [
        { id: 'c', texto: 'Se duplica', correcta: true },
        { id: 'mitad', texto: 'Se reduce a la mitad', error: 'EL-CON', siFuera: 'Así pasa con la pila conectada, que mantiene V. Aislado, lo que se mantiene es Q.' },
        { id: 'igual', texto: 'No cambia: la carga es la misma', error: 'EL-CON', siFuera: 'Q sí se mantiene. Pero C baja y U = Q²/2C sube.' },
        { id: 'cuatro', texto: 'Se cuadruplica', error: 'EL-R2', siFuera: 'Sería cierto si se duplicara V con C fija. Aquí C también cambia.' },
      ],
      dibujo: { datos: barrasF('ais', 2, true), estado: { corte: 0 } },
      revelar: { datos: barrasF('ais', 2), estado: {} },
      coincide: 'Coincide: sin pila, Q no cambia; C se reduce a la mitad y U = Q²/2C se duplica.',
    },
    mira: {
      datos: barrasF('ais', 2, true),
      pasos: [
        { estado: { corte: 1 }, texto: 'Al doble de separación, la capacidad es la mitad.', ecuacion: ['C = ε₀ ', { frac: ['A', d] }, '  →  ', { frac: ['C', '2'] }] },
        { estado: { corte: 2 }, texto: 'Desconectado, la carga no tiene a dónde ir: Q fija. Entonces V se duplica.', ecuacion: ['V = ', { frac: [q, 'C'] }, '  →  2V'] },
        { estado: { corte: 3 }, texto: 'La energía se duplica: la pone quien separa las placas.', ecuacion: ['U = ', { frac: [{ sup: [q, '2'] }, '2C'] }, '  →  2U'] },
      ],
    },
    regla: {
      texto: 'Un condensador guarda energía U = ½QV. Si está conectado, se mantiene V; si está aislado, se mantiene Q. De eso depende cómo cambia U.',
      ecuacion: ['U = ½ ', q, ' V = ½ C ', { sup: ['V', '2'] }, ' = ', { frac: [{ sup: [q, '2'] }, '2C'] }],
      condicion: 'condensador de placas paralelas sin pérdidas; se dice antes si sigue conectado a la pila o no.',
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), c = x.de([2, 4, 5, 10, 20]), v = x.de([10, 12, 20, 50, 100]);
        if (s % 2) {
          const u = 0.5 * c * v * v;     // μJ
          return {
            pregunta: `Un condensador de ${f(c)} μF está cargado a ${f(v)} V. ¿Cuánta energía guarda?`,
            opciones: opciones(u, [
              { id: 'sin-medio', valor: c * v * v, error: 'EL-CON', siFuera: 'Esa cuenta olvida el ½.' },
              { id: 'sin-cuad', valor: 0.5 * c * v, error: 'EL-R2', siFuera: 'Esa cuenta no eleva V al cuadrado: esa es Q/2.' },
              { id: 'q', valor: c * v, error: 'EL-CON', siFuera: 'Esa es la carga en μC, no la energía.' },
            ], n => `${f(n, 0)} μJ`),
            solucion: { texto: 'Con C en μF, la energía sale en μJ.', ecuacion: [`U = ½ · ${f(c)} · ${f(v)}² = ${f(u, 0)} μJ`] },
          };
        }
        const k = x.de([2, 3]), con = s % 4 === 0;
        const res = con ? 1 / k : k;
        return {
          pregunta: `Un condensador cargado ${con ? 'sigue conectado a su pila' : 'se desconecta de su pila'} y sus placas se separan ${k === 2 ? 'al doble' : 'al triple'}. ¿Por cuánto se multiplica su energía?`,
          opciones: opciones(res, [
            { id: 'otro', valor: con ? k : 1 / k, error: 'EL-CON', siFuera: con ? 'Así sería aislado, con Q fija. Aquí la pila fija V.' : 'Así sería conectado, con V fija. Aquí Q queda fija.' },
            { id: 'igual', valor: 1, error: 'EL-CON', siFuera: 'Algo se mantiene, pero C cambia y con ella U.' },
            { id: 'cuad', valor: con ? 1 / (k * k) : k * k, error: 'EL-R2', siFuera: 'U no depende del cuadrado de la separación.' },
          ], n => `×${f(n, 2)}`),
          solucion: { texto: con ? 'V fijo y C dividida: U = ½CV² se divide igual.' : 'Q fija y C dividida: U = Q²/2C se multiplica.', ecuacion: [`U → ×${f(res, 2)}`] },
        };
      },
    },
  };

  return {
    unidad: 'fisica.electrostatica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-lienzo.js', '/nucleo/kit/piezas/fis-circuito.js', '/nucleo/kit/piezas/fis-cuentas.js'],
    historia: {
      texto: 'En el siglo XVIII era fácil sacar chispas y difícil medir una fuerza eléctrica pequeña. Charles-Augustin de Coulomb usó una balanza de torsión: un hilo fino que se retuerce un ángulo según la fuerza. Variando la separación entre dos esferas cargadas, publicó entre 1785 y 1789 que la fuerza cae con el cuadrado de la distancia.',
      pregunta: '¿Cómo medirías una fuerza que no puedes sentir?',
      fuente: { titulo: 'National MagLab — Torsion balance (1785)', url: 'https://nationalmaglab.org/magnet-academy/history-of-electricity-magnetism/museum/torsion-balance-1785/' },
    },
    ideas: [contacto, coulomb, superposicion, uniforme, condensadores, energia],
  };
});
