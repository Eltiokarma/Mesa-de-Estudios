/*
 * Teoría de «Las cuatro operaciones» (aritmetica.cuatro-operaciones), para 5.º de secundaria y preuniversitario. Fuente
 * del contenido: docs/teoria/matriz/aritmetica.json (unidad 12) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 *
 * Etapa 4 del plan de calidad (18 nov): la propuesta aprobada por Gerson con todas sus recomendaciones
 * (docs/etapa4/propuesta-aritmetica.md) y docs/etapa4/decisiones.md, que manda. Fase 2: la idea 1, «La llevada llena una
 * bolsita» (id `otras-bases`, conservado), rehecha con el contrato completo y sus 15 ejemplos. Las ideas viejas
 * (complemento, multiplicar-partes, defecto-exceso, cifras-producto y sumatorias) siguen como estaban, en el orden de la
 * propuesta, hasta la fase 3; `sumatorias` va al final hasta mudarse a Sucesiones y series (con Avance.migrar), y
 * `prestamo` y `cifras-ocultas` entran en la fase 3 (ver el arreglo de ideas, abajo, por el tope de 6 del validador).
 * Hilo de la unidad: el puesto de caramelos de doña Juana en el mercado de Juliaca (pieza arit-puesto, dibujo de
 * prueba), ahora en base 10, con su cuaderno de cuentas (opción cuenta de la pieza).
 *
 * Letras (propuesta §6): n es la base, como en Numeración; sin base escrita, es 10. 34₍₅₎ y a̅b̅c̅ con raya ({ raya } de
 * nucleo/ecuacion.js). × para multiplicar; nunca «·» (el «   ·   » solo separa dos relaciones en una regla). Las letras de
 * las ideas viejas (b, k, a, N) se ajustan en la fase 3.
 *
 * REGLA DE COLORES DE LA UNIDAD: un color fijo por magnitud (docs/molde-unidad.md §5b; propuesta §7, aprobada), en la
 * tabla COLORES (def.colores). El criterio es lo que cada cosa es en el puesto:
 *   - turquesa (c-i): el envase: la base (10, o n), lo que lleva una bolsita, el subíndice ₍ₙ₎;
 *   - naranja (c-o): lo que se muda: la llevada (la bolsita llena que sube) y su aro en el mostrador;
 *   - violeta (c-f): lo que se busca: el resultado de la cuenta (también cuando se da) y la cifra que se anota;
 *   - tinta: los números que se operan (sumandos), los caramelos dibujados, «?» y lo que se pide antes de responder;
 *   - ni verde ni carmín.
 *   La respuesta lleva el color de su magnitud; la letra de una alternativa va en negrita con ese color. Cada ficha de
 *   color dice su magnitud (m); contenido/teoria/aritmetica/cuatro-operaciones.test.js falla si una cambia de color en la
 *   idea 1. Las ideas viejas conservan sus colores hasta la fase 3.
 * Errores: los AT-* son hipótesis de aula (el informe de aritmética no trae cifras de las cuatro operaciones); ver el
 * bloque de cada idea.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: llevar es mudar a la columna de al lado un envase lleno; lo mismo en cualquier base.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, sin audio, con lápiz al lado.
 *   Resultado observable: suma por columnas en base 10 y en base n, con llevadas de 1, de 2 o más y la que abre una
 *     columna nueva; halla la base que hace cuadrar una suma.
 *   Orden de atención: 1.º el pedido sobre el mostrador · 2.º el cuaderno · acción: tocar el montón o el botón fijo.
 *   Estados: juego sin tocar · casos probados · misión lograda · predicción · coincide / no coincide · paso a paso ·
 *     caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué se lleva 1 cuando la columna pasa de 9, y cuándo se lleva otra cosa?».
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/cuatro-operaciones junta y suma por columnas (el juego y la mesa de la idea 1; regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/cuatro-operaciones/motor.js'))
    : fabrica(root.Kit, root.MotorCuatroOperaciones);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MCO) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const n_ = { v: 'c-o', t: 'n' }, N = { v: 'c-o', t: 'N' }, a = { v: 'c-o', t: 'a' }, dd = { v: 'c-i', t: 'd' };
  const q = { v: 'c-d', t: 'q' }, r = { v: 'c-h', t: 'r' }, re = { sub: [{ v: 'c-h', t: 'r' }, 'e'] }, bb = { v: 'c-i', t: 'b' };
  const SUB = '₀₁₂₃₄₅₆₇₈₉', subi = x => String(x).split('').map(c => SUB[+c]).join('');
  const enBase = (x, base) => { if (x === 0) return '0'; let s = ''; while (x > 0) { s = String(x % base) + s; x = Math.floor(x / base); } return s; };
  const valor = (c, base) => c.split('').reduce((v, x) => v * base + +x, 0);
  const nb = (c, base) => `(${c})${subi(base)}`;
  const cifras = x => String(Math.abs(Math.round(x))).length;
  function azar(s) {
    let z0 = (s * 2654435761 + 12345) >>> 0;
    const g = () => { z0 = (z0 + 0x6D2B79F5) >>> 0; let z = z0; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    g.ent = (lo, hi) => lo + Math.floor(g() * (hi - lo + 1));
    g.de = xs => xs[Math.floor(g() * xs.length)];
    return g;
  }
  function opciones(correcta, distractores, fmt = x => String(x)) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      if (x.valor === null || x.valor === undefined || (typeof x.valor === 'number' && (!Number.isFinite(x.valor) || x.valor < 0))) continue;
      const txt = fmt(x.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba cuatro-operaciones.test.js) ----------
  const COLORES = { base: 'i', llevada: 'o', resultado: 'f' };
  const ficha = m => t => ({ v: `c-${COLORES[m]}`, t: String(t), m });
  const bas = ficha('base'), lleva = ficha('llevada'), res = ficha('resultado');
  // Un numeral que se opera (tinta) y uno del resultado (violeta), con la base de subíndice entre paréntesis, en
  // turquesa: 34₍₅₎. En base 10 no se escribe la base.
  const conBase = (c, base) => (base === 10 || base === undefined ? null : bas(`(${base})`));
  const sumN = (c, base) => (conBase(c, base) ? { sub: [String(c), conBase(c, base)] } : String(c));
  const resN = (c, base) => (conBase(c, base) ? { sub: [res(c), conBase(c, base)] } : res(c));
  // La letra de una alternativa, en negrita (Gerson, mesa de revisión, 17 nov), con el color de lo que nombra. El U+2060
  // (invisible) evita que la letra sola salga en cursiva como una variable.
  const letra = (L, m = 'resultado') => ({ v: `c-${COLORES[m]}`, t: `${L}\u2060`, m });
  // Entre dos relaciones de una misma ecuación (en la regla, cada una en su línea).
  const SEP = '   ·   ';

  // Gesto directo (docs/teoria.md §4b). Las manijas leen posiciones con escalas que no cambian mientras se arrastra:
  // fichas de tamaño fijo, rectas con tramo fijo y tiras con la misma escala. Si la escala cambiara con el valor, la
  // manija saltaría bajo el dedo y se dispararía hasta el extremo.
  const FICHAS = () => Kit.piezas['arit-fichas'], RECTA = () => Kit.piezas.recta, TIRAS = () => Kit.piezas['arit-tiras'];
  const inversa = (escala, a0, b0) => px => a0 + (px - escala(a0)) * (b0 - a0) / (escala(b0) - escala(a0));
  // Bloques centrados con fichas de tamaño fijo: el borde derecho del último bloque está en centro + ancho total / 2.
  const bordeDerecho = datos => { const g = FICHAS().geometria(datos), k = g.xs.length - 1, c = g.caja(k); return { x: c.x + c.ancho, y: g.piso - g.paso / 2 }; };
  const anchoTotalEn = (datos, x) => { const g = FICHAS().geometria(datos); return 2 * (x - (g.caja(0).x + (bordeDerecho(datos).x - g.caja(0).x) / 2)); };

  // ---------- Idea 1: dos escaleras forman un rectángulo (adición y sumatorias) ----------
  // Cambia: n, el largo de la escalera. Permanece: el tamaño de cada ficha.
  // Progresa: escalera → su copia girada → rectángulo n × (n + 1) → la mitad. Se reserva: dividir entre 2.
  // Debe verse: dos escaleras iguales llenan exactamente el rectángulo.
  const escaleras = (k, con = 2) => {
    const filas = Array.from({ length: k }, (_, i) => i + 1);
    const tramos = []; for (let i = 0; i < k; i++) tramos.push({ de: i * (k + 1) + i + 1, a: i * (k + 1) + k, color: 'h', paso: con >= 2 ? 0 : 99 });
    return { bloques: [
      { filas, color: 'i', rotulo: `1 + … + ${k}` },
      { n: k * (k + 1), columnas: k + 1, color: 'i', tramos, rotulo: `${k} × ${k + 1}`, paso: con >= 1 ? 0 : 99 },
    ], altoMax: 150, ficha: 15, alt: `Escalera de 1 a ${k} fichas; al lado, dos escaleras iguales forman un rectángulo de ${k} por ${k + 1}` };
  };
  // Ficha fija de 15 (con n = 9 caben 19 columnas): el ancho total es (2n + 1) · 15 + 18, y de ahí sale n.
  const nDeAncho = ancho => (ancho - 18 - 15) / 30;
  const sumatorias = {
    id: 'sumatorias',
    titulo: 'Dos escaleras, un rectángulo',
    temas: ['Adición y sumatorias'],
    pieza: 'arit-fichas',
    // Lee (fase 2): contexto y vocabulario; no dice cómo se calcula la suma (eso se descubre en Predice).
    lee: {
      tarjetas: [
        { titulo: 'Latas en escalera', texto: 'En la feria de Juliaca, las latas de leche se apilan en escalera: 1 arriba, 2 debajo, 3 más abajo. Contarlas una por una cansa cuando la escalera es alta.' },
        { titulo: 'Sumandos consecutivos', texto: 'Cada número de una suma es un sumando. Si van de 1 en 1, sin saltarse ninguno, son consecutivos. Una suma larga que sigue una regla se llama sumatoria.',
          ecuacion: ['1 + 2 + 3 + … + ', n_] },
        { titulo: 'Qué mirar', texto: 'A la izquierda verás la escalera de fichas. A la derecha, dos escaleras iguales juntas. Cambia n y cuenta las filas y las columnas de lo que forman.' },
      ],
    },
    juega: {
      consigna: 'Elige n. A la izquierda, la escalera 1 + 2 + … + n. A la derecha, dos escaleras iguales juntas.',
      voz: 'Cuenta las filas y las columnas del rectángulo.',
      controles: [{ id: 'n', etiqueta: 'n', color: 'c-o', min: 3, max: 9, paso: 1, inicio: 4, decimales: 0 }],
      dibujo: v => ({ datos: escaleras(v.n), estado: {} }),
      lectura: v => [`1 + … + ${v.n} = `, { v: 'c-d', t: String(v.n * (v.n + 1) / 2) }, ` · rectángulo ${v.n} × ${v.n + 1}`],
      minimo: 3,
      // Se tira del borde derecho del rectángulo: agrega una columna y, con ella, un escalón.
      arrastres: [{ id: 'borde', etiqueta: 'borde derecho del rectángulo (n)', color: 'c-o',
        donde: v => bordeDerecho(escaleras(v.n)),
        mover: (pt, v) => ({ n: nDeAncho(anchoTotalEn(escaleras(v.n), pt.x)) }) }],
    },
    predice: {
      pregunta: '¿Cuánto es 1 + 2 + 3 + … + 20?',
      opciones: [
        { id: 'c', texto: '210', correcta: true },
        { id: 'sin-mitad', texto: '420', error: 'AT-MITAD', siFuera: '420 son las dos escaleras juntas. La suma es una sola escalera.' },
        { id: 'cuadrado', texto: '200', error: 'AT-CUADRADO', siFuera: 'Sería cierto si el rectángulo fuera de 20 × 20. Es de 20 × 21.' },
        { id: 'menos', texto: '190', error: 'AT-CONTEO', siFuera: '190 llega hasta 19. Falta sumar el 20.' },
      ],
      dibujo: { datos: escaleras(5, 0), estado: {} },
      revelar: { datos: escaleras(5), estado: {} },
      coincide: 'Coincide: 20 × 21 entre 2 es 210.',
    },
    mira: {
      datos: { bloques: [
        { filas: [1, 2, 3, 4, 5], color: 'i', rotulo: '1 + … + 5' },
        { n: 30, columnas: 6, color: 'i', paso: 1, rotulo: '5 × 6', tramos: [0, 1, 2, 3, 4].map(i => ({ de: i * 6 + i + 1, a: i * 6 + 5, color: 'h', paso: 2 })) },
      ], altoMax: 150, ficha: 26, alt: 'Escalera de 1 a 5; rectángulo de 5 por 6 hecho con dos escaleras' },
      pasos: [
        { estado: { paso: 0 }, texto: 'La escalera 1 + 2 + 3 + 4 + 5 tiene 15 fichas.', ecuacion: ['1 + 2 + 3 + 4 + 5'] },
        { estado: { paso: 1 }, texto: 'Pongo otra igual, girada, encima de ella.', ecuacion: ['dos escaleras'] },
        { estado: { paso: 2 }, texto: 'Juntas llenan un rectángulo de 5 filas y 6 columnas.', ecuacion: ['5 · 6 = 30'] },
        { estado: { paso: 2 }, texto: 'Una escalera es la mitad del rectángulo.', ecuacion: [{ frac: ['5 · 6', '2'] }, ' = ', { v: 'c-d', t: '15' }] },
      ],
    },
    regla: {
      texto: 'La sumatoria de 1 a n es la mitad de un rectángulo de n por n + 1. Para consecutivos de a hasta z: primero más último, por cuántos, entre 2.',
      ecuacion: ['1 + 2 + … + ', n_, ' = ', { llave: [{ frac: [[n_, '(', n_, ' + 1)'], '2'] }], nota: 'medio rectángulo', color: 'c-o' }, '   ·   ', 'a + … + z = ', { frac: ['(a + z)(z − a + 1)', '2'] }],
      condicion: 'los sumandos son consecutivos (suben de 1 en 1). Con pares 2 + 4 + … + 2n, la suma es n(n + 1).',
    },
    // Así se resuelve (fase 2): los tres tipos de «Ahora tú», con las mismas cuentas y otras semillas.
    resuelve: {
      generar(s) {
        const g = azar(s + 900), tipo = s % 3;
        if (tipo === 0) {
          const k = g.ent(12, 60), v = k * (k + 1) / 2;
          return {
            enunciado: `En la feria apilan latas en escalera: 1 arriba, 2 debajo, y así hasta ${k} en la fila de abajo. ¿Cuántas latas hay?`,
            pasos: [
              { tipo: 'pide', texto: `Piden el total de latas: la suma 1 + 2 + … + ${k}.` },
              { tipo: 'datos', texto: `Las filas tienen 1, 2, 3, … hasta ${k} latas: son ${k} sumandos consecutivos que empiezan en 1.` },
              { tipo: 'regla', texto: 'Si pongo otra escalera igual, girada, las dos llenan un rectángulo de n filas y n + 1 columnas. Una sola escalera es la mitad.',
                ecuacion: ['1 + … + ', n_, ' = ', { frac: [[n_, '(', n_, ' + 1)'], '2'] }] },
              { tipo: 'cuentas', texto: `El rectángulo es de ${k} por ${k + 1}; tomo la mitad.`, ecuacion: [{ frac: [`${k} · ${k + 1}`, '2'] }, ` = ${f(k * (k + 1))} ÷ 2 = `, { v: 'c-d', t: f(v) }] },
              { tipo: 'sentido', texto: `Hay ${k} filas y, en promedio, cada una tiene ${f((k + 1) / 2, 1)} latas: ${k} · ${f((k + 1) / 2, 1)} = ${f(v)}. Cuadra.` },
            ],
            respuesta: [`Hay ${f(v)} latas.`],
          };
        }
        if (tipo === 1) {
          const lo = g.ent(10, 40), hi = lo + g.ent(9, 40), c = hi - lo + 1, v = (lo + hi) * c / 2;
          return {
            enunciado: `En una rifa se venden los boletos del ${lo} al ${hi}. Si sumas todos sus números, ¿cuánto da?`,
            pasos: [
              { tipo: 'pide', texto: `Piden la suma ${lo} + ${lo + 1} + … + ${hi}.` },
              { tipo: 'datos', texto: `El primero es ${lo} y el último, ${hi}. Contando los dos extremos, hay ${hi} − ${lo} + 1 = ${c} sumandos.` },
              { tipo: 'regla', texto: 'La escalera y su copia girada forman un rectángulo: primero más último, por cuántos sumandos hay, y la mitad.',
                ecuacion: ['a + … + z = ', { frac: ['(a + z)(z − a + 1)', '2'] }] },
              { tipo: 'cuentas', texto: `Junto primero y último, multiplico por los ${c} sumandos y divido entre 2.`, ecuacion: [{ frac: [`(${lo} + ${hi}) · ${c}`, '2'] }, ` = ${f((lo + hi) * c)} ÷ 2 = `, { v: 'c-d', t: f(v) }] },
              { tipo: 'sentido', texto: `El sumando del medio vale ${f((lo + hi) / 2, 1)}; ${c} sumandos de ese tamaño dan ${f(v)}. Cuadra.` },
            ],
            respuesta: [`La suma da ${f(v)}.`],
          };
        }
        const k = g.ent(10, 40), v = k * (k + 1);
        return {
          enunciado: `¿Cuánto es 2 + 4 + 6 + … + ${2 * k}?`,
          pasos: [
            { tipo: 'pide', texto: `Piden la suma de los pares desde 2 hasta ${2 * k}.` },
            { tipo: 'datos', texto: `Cada sumando es el doble de 1, 2, 3, … hasta ${k}. Son ${k} sumandos.` },
            { tipo: 'regla', texto: 'Si cada sumando es el doble, la suma también es el doble. Y la suma de 1 a n es medio rectángulo de n por n + 1.' },
            { tipo: 'cuentas', texto: `Duplico la suma de 1 a ${k}: el 2 y la mitad se cancelan.`, ecuacion: ['2 · ', { frac: [`${k} · ${k + 1}`, '2'] }, ` = ${k} · ${k + 1} = `, { v: 'c-d', t: f(v) }] },
            { tipo: 'sentido', texto: `Hay ${k} pares y el del medio vale ${k + 1}: ${k} · ${k + 1} = ${f(v)}. Cuadra.` },
          ],
          respuesta: [`2 + 4 + … + ${2 * k} = ${f(v)}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const k = g.ent(12, 60), v = k * (k + 1) / 2;
          return {
            pregunta: `¿Cuánto es 1 + 2 + 3 + … + ${k}?`,
            opciones: opciones(v, [
              { id: 'sin-mitad', valor: k * (k + 1), error: 'AT-MITAD', siFuera: 'Eso son dos escaleras. La suma es una sola.' },
              { id: 'cuadrado', valor: k * k / 2, error: 'AT-CUADRADO', siFuera: `El rectángulo es de ${k} × ${k + 1}, no de ${k} × ${k}.` },
              { id: 'menos', valor: (k - 1) * k / 2, error: 'AT-CONTEO', siFuera: `Eso llega hasta ${k - 1}.` },
            ], x => f(x)),
            solucion: { texto: 'La mitad del rectángulo de n por n + 1.', ecuacion: [{ frac: [`${k} · ${k + 1}`, '2'] }, ` = ${f(v)}`] },
          };
        }
        if (tipo === 1) {
          const lo = g.ent(10, 40), hi = lo + g.ent(9, 40), c = hi - lo + 1, v = (lo + hi) * c / 2;
          return {
            pregunta: `¿Cuánto es ${lo} + ${lo + 1} + ${lo + 2} + … + ${hi}?`,
            opciones: opciones(v, [
              { id: 'cuantos', valor: (lo + hi) * (hi - lo) / 2, error: 'AT-CONTEO', siFuera: `De ${lo} a ${hi} hay ${c} números, no ${hi - lo}.` },
              { id: 'desde-1', valor: hi * (hi + 1) / 2, error: 'AT-DESDE-1', siFuera: `Eso suma desde 1. Aquí se empieza en ${lo}.` },
              { id: 'sin-mitad', valor: (lo + hi) * c, error: 'AT-MITAD', siFuera: 'Falta dividir entre 2.' },
            ], x => f(x)),
            solucion: { texto: `Primero más último, por los ${c} sumandos, entre 2.`, ecuacion: [{ frac: [`(${lo} + ${hi}) · ${c}`, '2'] }, ` = ${f(v)}`] },
          };
        }
        const k = g.ent(10, 40), v = k * (k + 1);
        return {
          pregunta: `¿Cuánto es 2 + 4 + 6 + … + ${2 * k}?`,
          opciones: opciones(v, [
            { id: 'mitad', valor: k * (k + 1) / 2, error: 'AT-MITAD', siFuera: 'Esa es la suma de 1 a n; cada par es el doble.' },
            { id: 'hasta-2k', valor: 2 * k * (2 * k + 1) / 2, error: 'AT-CONTEO', siFuera: `Eso suma todos los números hasta ${2 * k}, también los impares.` },
            { id: 'cuadrado', valor: k * k, error: 'AT-CUADRADO', siFuera: 'Esa es la suma de los impares.' },
          ], x => f(x)),
          solucion: { texto: `Es el doble de 1 + … + ${k}.`, ecuacion: [`2 · `, { frac: [`${k} · ${k + 1}`, '2'] }, ` = ${f(v)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: lo que le falta para la potencia (sustracción y complemento aritmético) ----------
  // Cambia: N. Permanece: la recta de 0 a 10ᵏ, con k = cantidad de cifras de N.
  // Progresa: N → lo que falta hasta 10ᵏ → el atajo cifra por cifra. Se reserva: «de 10 la última no nula».
  // Debe verse: el complemento es una distancia en la recta.
  // fija: recta de 0 a 1 000 siempre (el juego): la meta salta de 100 a 1 000 cuando N gana una cifra, y la manija
  // no cambia de escala bajo el dedo. Sin fija, la recta llega justo a la potencia (predicción, mira, ahora tú).
  const rectaCA = (Nv, final = true, fija = false) => {
    const k = cifras(Nv), P = 10 ** k;
    return {
      min: 0, max: fija ? 1000 : P, paso: (fija ? 1000 : P) / 10, decimales: 0, variable: 'N', color: 'o', filas: 1,
      elementos: [
        // Con la recta fija, N cerca de la meta pierde su rótulo (chocaría con el de la meta; la lectura lo dice).
        { tipo: 'punto', x: Nv, color: 'o', rotulo: fija && P - Nv < 160 ? undefined : f(Nv), fila: 0 },
        { tipo: 'punto', x: P, color: 'i', rotulo: f(P), fila: 0 },
        { tipo: 'distancia', a: Nv, b: P, color: 'd', rotulo: `CA = ${f(P - Nv)}`, fila: 1, desde: final ? 0 : 1 },
      ],
    };
  };
  const ca = x => 10 ** cifras(x) - x;
  const complemento = {
    id: 'complemento',
    titulo: 'Lo que falta para la potencia',
    temas: ['Sustracción y complemento aritmético'],
    pieza: 'recta',
    // Lee (fase 2): el vuelto como contexto y el vocabulario; no da el atajo ni la meta de 3 400.
    lee: {
      tarjetas: [
        { titulo: 'El vuelto', texto: 'Compras algo de 37 soles en el mercado y pagas con un billete de 100. El vuelto es lo que le falta a 37 para llegar a 100.' },
        { titulo: 'Un nombre para eso', texto: 'Lo que le falta a un número para llegar a 10, 100, 1 000 o más se llama complemento aritmético. Se escribe CA.',
          ecuacion: ['CA(', N, ')'] },
        { titulo: 'Qué mirar', texto: 'En la recta, el punto naranja es N y el turquesa es la meta. La cota verde mide lo que falta. Mueve N y mira dónde cae la meta cuando N gana una cifra.' },
      ],
    },
    juega: {
      consigna: 'Elige N. Su complemento aritmético es lo que le falta para llegar a 10, 100 o 1 000, según sus cifras.',
      voz: 'Mira dónde cae la meta turquesa cuando N gana una cifra.',
      controles: [{ id: 'N', etiqueta: 'N', color: 'c-o', min: 20, max: 980, paso: 20, inicio: 80, decimales: 0 }],
      dibujo: v => ({ datos: rectaCA(v.N, true, true), estado: {} }),
      lectura: v => ['CA(', N, `) = ${f(10 ** cifras(v.N))} − ${f(v.N)} = `, { v: 'c-d', t: f(ca(v.N)) }],
      minimo: 3,
      arrastres: [{ id: 'n', etiqueta: 'el número N en la recta', color: 'c-o',
        donde: v => { const g = RECTA().geometria(rectaCA(v.N, true, true)); return { x: g.x(v.N), y: g.filaY(0) }; },
        mover: pt => ({ N: inversa(RECTA().geometria(rectaCA(10, true, true)).x, 0, 1000)(pt.x) }) }],
    },
    predice: {
      pregunta: ['¿Cuál es el complemento aritmético de ', { v: 'c-o', t: '3 400' }, '?'],
      opciones: [
        { id: 'c', texto: '6 600', correcta: true },
        { id: 'nueves', texto: '6 599', error: 'AT-CA9', siFuera: 'Eso resta de 9 todas las cifras. Ese número le falta a 9 999, no a 10 000.' },
        { id: 'k', texto: '96 600', error: 'AT-CA-K', siFuera: 'Sería cierto si 3 400 tuviera cinco cifras. Tiene cuatro: la potencia es 10 000.' },
        { id: 'cada10', texto: '7 600', error: 'AT-CA10', siFuera: 'Eso resta de 10 todas las cifras no nulas. Solo la última no nula se resta de 10.' },
      ],
      dibujo: { datos: rectaCA(3400, false), estado: { corte: 0 } },
      revelar: { datos: rectaCA(3400, false), estado: { corte: 1 } },
      coincide: 'Coincide: 3 400 + 6 600 = 10 000.',
    },
    mira: {
      datos: rectaCA(3400, false),
      pasos: [
        { estado: { corte: 0 }, texto: '3 400 tiene cuatro cifras: su potencia es 10 000.', ecuacion: ['k = 4 → ', { sup: ['10', '4'] }, ' = 10 000'] },
        { estado: { corte: 1 }, texto: 'El complemento aritmético es lo que falta para llegar.', ecuacion: ['CA(3 400) = 10 000 − 3 400 = ', { v: 'c-d', t: '6 600' }] },
        { estado: { corte: 1 }, texto: 'Atajo: 9 menos cada cifra, 10 menos la última no nula.', ecuacion: ['9 − 3 = 6 · 10 − 4 = 6 · 00'] },
      ],
    },
    regla: {
      texto: 'El complemento aritmético de N es lo que le falta para la potencia de 10 con tantos ceros como cifras tiene N.',
      ecuacion: ['CA(', N, ') = ', { llave: [{ sup: ['10', 'k'] }], nota: 'la meta' }, ' − ', N, '   ·   ', N, ' tiene k cifras'],
      condicion: 'k son las cifras de N. En base b la potencia es bᵏ: se resta de b − 1 y de b.',
    },
    // Así se resuelve (fase 2): el mismo número de «Ahora tú» (con s impar, redondeado a centenas), otra semilla.
    resuelve: {
      generar(s) {
        const g = azar(s + 900), k = g.ent(3, 5);
        let Nv = g.ent(10 ** (k - 1), 10 ** k - 1);
        if (s % 2) Nv = Math.floor(Nv / 100) * 100 || 10 ** (k - 1) * 2;
        const P = 10 ** k, v = ca(Nv);
        return {
          enunciado: ['¿Cuál es el complemento aritmético de ', { v: 'c-o', t: f(Nv) }, '?'],
          dibujo: { datos: rectaCA(Nv, false), estado: { corte: 0 } },
          pasos: [
            { tipo: 'pide', texto: ['Piden CA(', N, '): lo que le falta a ', N, ' para llegar a su potencia de 10.'] },
            { tipo: 'datos', texto: ['Cuento las cifras: ', { v: 'c-o', t: f(Nv) }, ` tiene ${k}. Entonces la meta es un 1 seguido de ${k} ceros.`], ecuacion: [{ sup: ['10', String(k)] }, ` = ${f(P)}`] },
            { tipo: 'regla', texto: 'El complemento es la distancia en la recta desde el número hasta esa meta: la meta menos el número.',
              ecuacion: ['CA(', N, ') = ', { sup: ['10', 'k'] }, ' − ', N] },
            { tipo: 'cuentas', texto: 'Resto el número de la meta.', ecuacion: [`CA(${f(Nv)}) = ${f(P)} − ${f(Nv)} = `, { v: 'c-d', t: f(v) }], dibujo: { datos: rectaCA(Nv, false), estado: { corte: 1 } } },
            { tipo: 'sentido', texto: 'Compruebo sumando: el número más su complemento da justo la meta.', ecuacion: [{ v: 'c-o', t: f(Nv) }, ' + ', { v: 'c-d', t: f(v) }, ` = ${f(P)}`] },
          ],
          respuesta: [`CA(${f(Nv)}) = `, { v: 'c-d', t: f(v) }],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), k = g.ent(3, 5);
        let Nv = g.ent(10 ** (k - 1), 10 ** k - 1);
        if (s % 2) Nv = Math.floor(Nv / 100) * 100 || 10 ** (k - 1) * 2;
        const v = ca(Nv), dig = String(Nv).split('');
        const nueves = +dig.map(x => 9 - +x).join('');
        return {
          pregunta: ['¿Cuál es el complemento aritmético de ', { v: 'c-o', t: f(Nv) }, '?'],
          opciones: opciones(v, [
            { id: 'nueves', valor: nueves, error: 'AT-CA9', siFuera: `Eso le falta a ${f(10 ** k - 1)}, no a ${f(10 ** k)}.` },
            { id: 'k', valor: 10 ** (k + 1) - Nv, error: 'AT-CA-K', siFuera: `${f(Nv)} tiene ${k} cifras: la potencia es ${f(10 ** k)}.` },
            { id: 'diez-todas', valor: +dig.map(x => (x === '0' ? '0' : String(10 - +x)).slice(-1)).join(''), error: 'AT-CA10', siFuera: 'Solo la última cifra no nula se resta de 10.' },
          ], x => f(x)),
          solucion: { texto: 'Lo que falta para la potencia de 10.', ecuacion: [`${f(10 ** k)} − ${f(Nv)} = ${f(v)}`], dibujo: { datos: rectaCA(Nv), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: división por defecto y por exceso ----------
  // Cambia: el dividendo y el divisor. Permanece: la recta de múltiplos del divisor.
  // Progresa: el múltiplo de abajo (defecto) → el de arriba (exceso). Se reserva: r + rₑ = d.
  // Debe verse: a está entre dos múltiplos consecutivos; cada resto es una distancia distinta.
  // tramo: [desde, hasta] fijo (el juego y el laboratorio): la recta no se corre cuando a pasa un múltiplo.
  const rectaDiv = (av, dv, final = true, tramo = null) => {
    const qv = Math.floor(av / dv), rv = av - qv * dv;
    const lo = tramo ? tramo[0] : dv * Math.max(0, qv - 1), hi = tramo ? tramo[1] : dv * (qv + 2);
    return {
      min: lo, max: hi, paso: dv, decimales: 0, variable: 'múltiplos de ' + dv, color: 'i', filas: 3,
      elementos: [
        { tipo: 'punto', x: qv * dv, color: 'i', fila: 0 },
        { tipo: 'punto', x: (qv + 1) * dv, color: 'i', fila: 0 },
        { tipo: 'punto', x: av, color: 'o', rotulo: `a = ${f(av)}`, fila: 1 },
        { tipo: 'distancia', a: qv * dv, b: av, color: 'h', rotulo: rv ? `r = ${rv}` : '', fila: 2, desde: final ? 0 : 1 },
        { tipo: 'distancia', a: av, b: (qv + 1) * dv, color: 'd', rotulo: `rₑ = ${dv - rv}`, fila: 3, desde: final ? 0 : 1 },
      ],
    };
  };
  const TRAMO = [15, 70];   // a de 20 a 60 y d hasta 9: los dos múltiplos vecinos caben siempre
  const aEnRecta = tramo => ({ id: 'a', etiqueta: 'el dividendo a en la recta', color: 'c-o',
    donde: v => { const g = RECTA().geometria(rectaDiv(v.a, v.d, true, tramo)); return { x: g.x(v.a), y: g.filaY(1) }; },
    mover: (pt, v) => ({ a: inversa(RECTA().geometria(rectaDiv(v.a, v.d, true, tramo)).x, tramo[0], tramo[1])(pt.x) }) });
  const division = {
    id: 'defecto-exceso',
    titulo: 'Resto por defecto y por exceso',
    temas: ['División entera por defecto y por exceso'],
    pieza: 'recta',
    // Lee (fase 2): vocabulario de la división y qué quiere decir «defecto» y «exceso»; no calcula ningún resto por exceso.
    lee: {
      tarjetas: [
        { titulo: 'Maples de huevos', texto: 'En el mercado, los huevos se venden en maples de 30. Con 100 huevos llenas 3 maples y sobran 10. Repartir en grupos iguales es dividir.' },
        { titulo: 'Los nombres', texto: ['En una división, ', a, ' es el dividendo, el que se reparte, y ', dd, ' es el divisor. El cociente entero ', q, ' cuenta los grupos completos.'],
          ecuacion: [a, ' ÷ ', dd] },
        { titulo: 'Quedarse corto o pasarse', texto: 'Defecto quiere decir quedarse corto; exceso, pasarse. Por eso una división entera se puede mirar de dos maneras: desde el múltiplo de abajo o desde el de arriba.' },
        { titulo: 'Qué mirar', texto: ['En la recta, los puntos turquesa son múltiplos de ', dd, ' y el naranja es ', a, '. Mide la distancia de ', a, ' a cada múltiplo vecino.'] },
      ],
    },
    juega: {
      consigna: 'Elige el dividendo a y el divisor d. La recta marca los múltiplos de d que rodean a a.',
      voz: 'Mide la distancia de a a cada múltiplo vecino.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 20, max: 60, paso: 1, inicio: 26, decimales: 0 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 3, max: 9, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: v => ({ datos: rectaDiv(v.a, v.d, true, TRAMO), estado: { corte: 1 } }),
      lectura: v => { const qv = Math.floor(v.a / v.d), rv = v.a % v.d; return [`${v.a} = ${v.d}·${qv} + ${rv} = ${v.d}·${qv + 1} − ${rv ? v.d - rv : 0}`]; },
      minimo: 3,
      arrastres: [aEnRecta(TRAMO)],
    },
    predice: {
      pregunta: ['Al dividir ', { v: 'c-o', t: '47' }, ' entre ', { v: 'c-i', t: '6' }, ' por defecto, el cociente es 7 y el resto 5. ¿Cuál es el resto por exceso?'],
      opciones: [
        { id: 'c', texto: '1', correcta: true },
        { id: 'mismo', texto: '5', error: 'AT-EXCESO', siFuera: '5 es lo que pasa de 42. Por exceso se mide lo que falta para 48.' },
        { id: 'divisor', texto: '6', error: 'AT-EXCESO', siFuera: '6 es el divisor: la distancia entre dos múltiplos, no la de 47 a 48.' },
        { id: 'suma', texto: '11', error: 'AT-EXCESO', siFuera: '11 suma resto y divisor; el resto por exceso es menor que el divisor.' },
      ],
      dibujo: { datos: rectaDiv(47, 6, false), estado: { corte: 0 } },
      revelar: { datos: rectaDiv(47, 6, false), estado: { corte: 1 } },
      coincide: 'Coincide: a 47 le falta 1 para 48 = 6 · 8.',
    },
    mira: {
      datos: rectaDiv(47, 6, false),
      pasos: [
        { estado: { corte: 0 }, texto: '47 queda entre los múltiplos 42 y 48.', ecuacion: ['6 · 7 = 42 ≤ 47 < 48 = 6 · 8'] },
        { estado: { corte: 1 }, texto: 'Por defecto: lo que pasa de 42. Por exceso: lo que falta para 48.', ecuacion: ['47 = 6 · 7 + ', { v: 'c-h', t: '5' }, ' = 6 · 8 − 1'] },
        { estado: { corte: 1 }, texto: 'Los dos restos juntos cubren un salto de 6.', ecuacion: [{ v: 'c-h', t: '5' }, ' + 1 = 6'] },
      ],
    },
    regla: {
      texto: 'Por defecto, a = dq + r. Por exceso, el cociente sube uno y se resta lo que falta. Los dos restos suman el divisor.',
      ecuacion: [a, ' = ', dd, q, ' + ', { llave: [r], nota: 'lo que pasa', color: 'c-h' }, '   ·   ', a, ' = ', dd, '(', q, ' + 1) − ', { llave: [re], nota: 'lo que falta', color: 'c-h' }, '   ·   ', r, ' + ', re, ' = ', dd],
      condicion: 'd > 0 y 0 < r < d. Si la división es exacta, el resto es 0 y hay un solo cociente.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» (hallar rₑ o hallar a), con las mismas cuentas.
    resuelve: {
      generar(s) {
        const g = azar(s + 900), dv = g.ent(4, 15), qv = g.ent(5, 30), rv = g.ent(1, dv - 1), av = dv * qv + rv;
        const abajo = dv * qv, arriba = dv * (qv + 1), rev = dv - rv;
        if (s % 2 === 0) return {
          enunciado: ['Divide ', { v: 'c-o', t: String(av) }, ' entre ', { v: 'c-i', t: String(dv) }, ' por exceso. ¿Cuánto vale el resto por exceso?'],
          dibujo: { datos: rectaDiv(av, dv, false), estado: { corte: 0 } },
          pasos: [
            { tipo: 'pide', texto: ['Piden ', re, ': lo que le falta al dividendo ', a, ' para llegar al múltiplo de ', dd, ' que queda encima.'] },
            { tipo: 'datos', texto: ['Busco los múltiplos de ', dd, ' que rodean al dividendo ', a, '.'], ecuacion: [`${dv} · ${qv} = ${abajo} < `, { v: 'c-o', t: String(av) }, ` < ${arriba} = ${dv} · ${qv + 1}`] },
            { tipo: 'regla', texto: 'Por exceso me paso al múltiplo de arriba: el cociente sube uno y el resto es lo que falta. Los dos restos juntos dan el divisor.' },
            { tipo: 'cuentas', texto: 'Resto el dividendo del múltiplo de arriba.', ecuacion: [`${arriba} − ${av} = `, { v: 'c-h', t: String(rev) }], dibujo: { datos: rectaDiv(av, dv, false), estado: { corte: 1 } } },
            { tipo: 'sentido', texto: `Por defecto sobran ${av} − ${abajo} = ${rv}. Los dos restos suman el divisor, y ${rev} es menor que ${dv}. Cuadra.`, ecuacion: [`${rv} + ${rev} = ${dv}`] },
          ],
          respuesta: [re, ` = ${rev}`],
        };
        return {
          enunciado: ['En una división, el divisor es ', { v: 'c-i', t: String(dv) }, `, el cociente por defecto es ${qv} y el resto por exceso es ${rev}. ¿Cuál es el dividendo?`],
          pasos: [
            { tipo: 'pide', texto: ['Piden el dividendo ', a, ', el número que se reparte.'] },
            { tipo: 'datos', texto: ['El divisor ', dd, ` es ${dv}, el cociente por defecto es ${qv} y el resto por exceso es ${rev}.`] },
            { tipo: 'regla', texto: 'Por exceso, el cociente es uno más que por defecto. El dividendo es ese múltiplo de arriba menos lo que le falta.',
              ecuacion: [a, ' = ', dd, '(', q, ' + 1) − ', re] },
            { tipo: 'cuentas', texto: `El cociente por exceso es ${qv} + 1 = ${qv + 1}.`, ecuacion: [a, ` = ${dv} · ${qv + 1} − ${rev} = ${arriba} − ${rev} = `, { v: 'c-o', t: String(av) }], dibujo: { datos: rectaDiv(av, dv), estado: { corte: 1 } } },
            { tipo: 'sentido', texto: `Vuelvo a dividir ${av} entre ${dv}: cabe ${qv} veces y sobran ${rv}. Los dos restos suman ${rv} + ${rev} = ${dv}. Cuadra.`, ecuacion: [`${av} = ${dv} · ${qv} + ${rv}`] },
          ],
          respuesta: [a, ` = ${av}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), dv = g.ent(4, 15), qv = g.ent(5, 30), rv = g.ent(1, dv - 1), av = dv * qv + rv;
        if (s % 2 === 0) return {
          pregunta: ['Divide ', { v: 'c-o', t: String(av) }, ' entre ', { v: 'c-i', t: String(dv) }, ' por exceso. ¿Cuánto vale el resto por exceso?'],
          opciones: opciones(dv - rv, [
            { id: 'defecto', valor: rv, error: 'AT-EXCESO', siFuera: 'Ese es el resto por defecto: lo que pasa del múltiplo de abajo.' },
            { id: 'divisor', valor: dv, error: 'AT-EXCESO', siFuera: 'Ese es el divisor, no lo que falta.' },
            { id: 'suma', valor: dv + rv, error: 'AT-EXCESO', siFuera: 'El resto por exceso siempre es menor que el divisor.' },
          ]),
          solucion: { texto: `Le falta eso para ${dv * (qv + 1)} = ${dv} · ${qv + 1}.`, ecuacion: [`${av} = ${dv} · ${qv + 1} − ${dv - rv}`], dibujo: { datos: rectaDiv(av, dv), estado: { corte: 1 } } },
        };
        return {
          pregunta: ['En una división, el divisor es ', { v: 'c-i', t: String(dv) }, `, el cociente por defecto es ${qv} y el resto por exceso es ${dv - rv}. ¿Cuál es el dividendo?`],
          opciones: opciones(av, [
            { id: 'suma', valor: dv * qv + (dv - rv), error: 'AT-EXCESO', siFuera: 'Eso suma el resto por exceso al múltiplo de abajo; se resta del de arriba.' },
            { id: 'exceso-q', valor: dv * qv - (dv - rv), error: 'AT-EXCESO', siFuera: `El cociente por exceso es ${qv + 1}, no ${qv}.` },
            { id: 'arriba', valor: dv * (qv + 1), error: 'AT-EXCESO', siFuera: 'Ese es el múltiplo de arriba; falta restar el resto por exceso.' },
          ]),
          solucion: { texto: 'Por exceso el cociente sube uno y se resta.', ecuacion: [`${dv} · ${qv + 1} − ${dv - rv} = ${av}`] },
        };
      },
    },
  };

  // ---------- Idea 1 (rehecha, 18 nov): la llevada llena una bolsita (adición con llevadas y otras bases) ----------
  // Propuesta aprobada: docs/etapa4/propuesta-aritmetica.md (§1 a §7, con todas sus recomendaciones) y
  // docs/etapa4/decisiones.md. Conserva el id `otras-bases` (no se pierde el avance de nadie); el control `b` del juego
  // viejo pasa al laboratorio (mesa `juego-otras-bases`, el mismo id que tenía el juego como mesa: los casos guardados
  // siguen abriendo).
  // Objeto: el puesto de doña Juana (pieza arit-puesto, dibujo de prueba), ahora en base 10, con su cuaderno de cuentas
  // (opción cuenta de la pieza: la cuenta escrita en columnas, con un icono de caramelo, bolsita y caja sobre cada una).
  // Cambia: los dos pedidos y si los sueltos ya se juntaron. · Permanece: la regla del puesto (10 sueltos = 1 bolsita) y la
  // escala del dibujo. · Progresa: sueltos de los dos pedidos → bolsita que sube → total anotado. · Se reserva: la segunda
  // llevada (bolsitas que llenan una caja) y las otras bases: son de la predicción (34₍₅₎ + 23₍₅₎). · Debe verse: cuando
  // una columna junta 10, la bolsita llena se muda a la columna de al lado; en la columna se anota lo que sobra.
  // El juego llega a pedidos de 11 a 49 (no de 11 a 89, como decía la propuesta): con dos pedidos de hasta 49 nunca se
  // llena una caja (4 + 4 + 1 = 9 bolsitas como mucho) y 9 bolsitas de 10 caben a una escala legible junto al cuaderno
  // (0,73); con 89 + 89 harían falta 17 bolsitas y una caja. La caja es de la predicción.
  // Errores (hipótesis de aula, sin medir: el informe de aritmética no trae cifras de las cuatro operaciones; la trampa 29
  // de docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md respalda las de la llevada olvidada):
  // AT-DECIMAL lleva al llegar a 10 en otra base · AT-LLEVA-OLVIDA no suma la llevada en la columna siguiente ·
  // AT-LLEVA-FINAL no anota la última llevada · AT-LLEVA-UNO lleva 1 donde van 2 o más · AT-LLEVA-CIFRA confunde lo que
  // se anota con lo que se lleva · AT-LLEVA-TODO lleva la suma entera de la columna · AT-CADENA no cuenta la llevada que
  // forma otra · AT-MENOR toma la menor base posible sin comprobar la cuenta · AT-SUMA-COLUMNA toma la suma de las
  // unidades como base.
  const PU = 'arit-puesto';
  const PUESTO = () => Kit.piezas[PU];
  const fig = datos => ({ pieza: PU, datos, estado: {} });
  // Solo el cuaderno, abierto sobre el mostrador: la cuenta como la dan los datos (lo que se pide, con «?»).
  const cuaderno = (sumandos, o = {}) => fig({ cuenta: Object.assign({ solo: true, sumandos: sumandos.map(String), resultado: '?' }, o) });
  // Datos que se repiten (punto 13: herramientas, no el paso hecho). La fórmula de una columna va en los ejemplos y en
  // «Ahora tú», nunca en Predice.
  const DO = {
    bolsita: n => ['1 bolsita = ', bas(n), ' caramelos'],
    caja: n => ['1 caja = ', bas(n), ' bolsitas'],
    todo: n => ['1 bolsita = ', bas(n), ' caramelos; 1 caja = ', bas(n), ' bolsitas; 1 cajón = ', bas(n), ' cajas'],
    base: n => ['En base ', bas(n), ', ', bas(n), ' de una columna forman 1 de la columna siguiente'],
    columna: ['suma de una columna = ', lleva('llevada'), ' × ', bas('n'), ' + ', res('cifra que se anota')],
    cifras: ['En base ', bas('n'), ', las cifras van de 0 a ', bas('n'), ' − 1'],
    ordenes: 'Unidades, decenas y centenas: sueltos, bolsitas y cajas',
    f2: n => [{ sub: [{ raya: ['ab'] }, bas(`(${n})`)] }, ' = a × ', bas(n), ' + b'],
    f3: n => [{ sub: [{ raya: ['abc'] }, bas(`(${n})`)] }, ' = a × ', { sup: [bas(n), '2'] }, ' + b × ', bas(n), ' + c'],
  };
  // Lo que pasa en cada columna, como ecuación: «8 + 7 + 9 = 24 = 2 × 10 + 4» (las cuentas, del motor de la escena).
  const ecColumna = (c, n) => {
    const partes = [c.entran.join(' + ')];
    if (c.llevadaEntra) partes.push(' + ', lleva(c.llevadaEntra));
    partes.push(` = ${c.total}`);
    if (c.llevadaSale) partes.push(' = ', lleva(c.llevadaSale), ' × ', bas(n), ' + ', res(c.cifra));
    return partes;
  };
  const NOMBRE_COL = ['Sueltos', 'Bolsitas', 'Cajas', 'Cajones'];
  // Una base al azar para un numeral de k cifras (la primera no es 0).
  const numeralAzar = (r, k, n) => [r.ent(1, n - 1)].concat(Array.from({ length: k - 1 }, () => r.ent(0, n - 1))).join('');
  // Descomposición con números (la del sentido): 1242₍₆₎ = 1 × 216 + 2 × 36 + 4 × 6 + 2.
  const poli = (c, n) => c.split('').map((d, i, xs) => { const e = xs.length - 1 - i; return e === 0 ? d : `${d} × ${n ** e}`; }).join(' + ');

  // El juego: dos pedidos de base 10 juntos sobre el mostrador, columna por columna (aMano del motor de la escena), y
  // tocar los sueltos junta 10 en una bolsita (juntarMano). La misión la comprueba el mismo motor (regla 1).
  const manoJ = v => {
    let m = MCO.aMano('suma', String(v.p1), String(v.p2), 10);
    const lleno = m.cuentas[0] >= 10, junto = !!(v.ju && lleno);
    if (junto) m = MCO.juntarMano(m, 0);
    return { m, lleno, junto };
  };
  const uni = x => x % 10, dec = x => Math.floor(x / 10);
  const puestoJ = (v, escala) => {
    const { m, lleno, junto } = manoJ(v), [s, b] = m.cuentas;
    return { n: 10, bolsitas: b, sueltos: s, ceros: true, regla: 1, escala, colorCifras: false,
      juntar: lleno && !junto ? 'sueltos' : undefined,
      llevada: junto ? { bolsitas: 1 } : undefined,
      rotulos: { bolsitas: [[`${dec(v.p1)} + ${dec(v.p2)}`]].concat(junto ? [[' + '], ['1', 'o', 700]] : [], [[' bolsitas']]),
        sueltos: junto ? `${s} ${s === 1 ? 'suelto' : 'sueltos'}` : `${uni(v.p1)} + ${uni(v.p2)} sueltos` },
      toque: [{ orden: 'sueltos', control: 'ju', titulo: junto ? 'Tocar para soltar la bolsita otra vez' : 'Tocar para juntar 10 sueltos en una bolsita' }],
      cuenta: { sumandos: [String(v.p1), String(v.p2)], op: '+', llevadas: junto ? { 1: 1 } : {}, resultado: m.listo ? m.texto : '?' } };
  };
  let escJ = null;
  const escalaJ = () => {
    if (escJ) return escJ;
    let mn = 1.7;
    for (let p1 = 11; p1 <= 49; p1++) for (let p2 = 11; p2 <= 49; p2++) for (const ju of [0, 1]) mn = Math.min(mn, PUESTO().geometria(puestoJ({ p1, p2, ju })).sCabe);
    return (escJ = Math.floor(mn * 100) / 100);
  };
  // Predice, «Mira» y la regla: el puesto de bolsitas de 5 con 34₍₅₎ + 23₍₅₎, a una sola escala (la que hace caber el
  // paso más ancho; cuatro-operaciones.test.js comprueba que ninguno la necesite menor).
  const ESC5 = 0.85;
  const P5 = { n: 5, ceros: true, regla: 2, colorCifras: false, escala: ESC5 };
  const CU5 = o => Object.assign({ sumandos: ['34', '23'], base: '5', op: '+', resultado: '?' }, o);
  const ROT5 = { bolsitas: '3 + 2 bolsitas', sueltos: '4 + 3 sueltos' };
  const ROT5b = { bolsitas: [['3 + 2 + '], ['1', 'o', 700], [' bolsitas']], sueltos: '2 sueltos' };
  const ROT5c = { cajas: [['1', 'o', 700], [' caja']], bolsitas: '1 bolsita', sueltos: '2 sueltos' };
  const MIRA5 = Object.assign({}, P5, { pasos: [
    { bolsitas: 5, sueltos: 7, rotulos: ROT5, cuenta: CU5() },
    { bolsitas: 5, sueltos: 7, juntar: 'sueltos', rotulos: ROT5, cuenta: CU5({ foco: 0 }) },
    { bolsitas: 6, sueltos: 2, llevada: { bolsitas: 1 }, rotulos: ROT5b, cuenta: CU5({ foco: 0, llevadas: { 1: 1 }, resultado: '2' }) },
    { bolsitas: 6, sueltos: 2, juntar: 'bolsitas', rotulos: ROT5b, cuenta: CU5({ foco: 1, llevadas: { 1: 1 }, resultado: '2' }) },
    { cajas: 1, bolsitas: 1, sueltos: 2, llevada: { cajas: 1 }, rotulos: ROT5c, cuenta: CU5({ foco: 2, llevadas: { 1: 1, 2: 1 }, resultado: '112' }) },
    { cajas: 1, bolsitas: 1, sueltos: 2, rotulos: ROT5c, cuenta: CU5({ llevadas: { 1: 1, 2: 1 }, resultado: '112' }) },
  ] });

  // Cuatro opciones siempre en «Ahora tú»: si dos errores dan el mismo texto, se arma otro caso con el mismo azar.
  function conCuatro(caso, r) {
    for (let i = 0; i < 4000; i++) { const c = caso(r); if (c && c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  const planoP = x => (Array.isArray(x) ? x.map(planoP).join('') : x && typeof x === 'object'
    ? (x.t !== undefined ? String(x.t) : x.sub ? planoP(x.sub[0]) + planoP(x.sub[1]) : x.raya ? planoP(x.raya) : '') : String(x));
  function opcionesNum(correcta, distractores) {
    const ops = [{ id: 'c', texto: correcta, correcta: true }], vistos = new Set([planoP(correcta)]);
    for (const x of distractores) {
      const t = planoP(x.texto);
      if (vistos.has(t)) continue;
      vistos.add(t);
      ops.push({ id: x.id, texto: x.texto, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  const suma = xs => xs.reduce((a, x) => a + x, 0);
  // Suma con el error «lleva 1 donde van 2»: anota lo que sobra, pero nunca lleva más de 1.
  const sumaLlevaUno = (xs, n) => {
    const L = Math.max(...xs.map(x => x.length)), cs = xs.map(x => x.split('').reverse().map(Number));
    let out = '', ll = 0;
    for (let k = 0; k < L; k++) { const t = suma(cs.map(c => c[k] || 0)) + ll; out = String(t % n) + out; ll = t >= n ? 1 : 0; }
    return (ll ? '1' : '') + out;
  };

  // Ahora tú · tipo 0: ¿cuánto se lleva de los sueltos a las bolsitas? (base 10, tres o cuatro sumandos).
  function casoCuantoLleva(r, k) {
    const xs = Array.from({ length: k }, () => r.ent(12, 98)), us = xs.map(uni), S = suma(us), L = Math.floor(S / 10), w = S % 10;
    if (L < 2 || w === 1 || w === L) return null;
    return {
      pregunta: ['Doña Juana suma en su cuaderno ', xs.join(' + '), '. ¿Cuántas bolsitas lleva de la columna de los sueltos a la de las bolsitas?'],
      datos: [DO.bolsita(10), DO.columna],
      dibujo: cuaderno(xs, { foco: 0 }),
      opciones: opciones(L, [
        { id: 'cifra', valor: w, error: 'AT-LLEVA-CIFRA', siFuera: `Sumar la columna está bien. Pero el ${w} se anota; lo que sube son las bolsitas llenas.` },
        { id: 'uno', valor: 1, error: 'AT-LLEVA-UNO', siFuera: 'Llevar está bien, pero no siempre se lleva 1: depende de cuántas bolsitas se llenan.' },
        { id: 'todo', valor: S, error: 'AT-LLEVA-TODO', siFuera: 'Bien que sumes toda la columna. Pero solo suben las bolsitas llenas; los sueltos que sobran se anotan.' },
      ]),
      solucion: { texto: `La columna junta ${S} sueltos: llena ${L} bolsitas y sobran ${w}.`, ecuacion: [us.join(' + '), ` = ${S} = `, lleva(L), ' × ', bas(10), ' + ', res(w)] },
    };
  }
  // Ahora tú · tipo 1 (nivel examen): tres sumandos en base n, con alguna columna que lleva 2.
  function casoTres(r) {
    const n = r.ent(4, 9), xs = [0, 1, 2].map(() => numeralAzar(r, 3, n));
    const C = MCO.sumaColumnas(xs, n);
    if (!C.columnas.some(c => c.llevadaSale >= 2) || C.texto.length <= 3) return null;
    const dec10 = String(suma(xs.map(Number)));
    return {
      pregunta: ['¿Cuánto es ', sumN(xs[0], n), ' + ', sumN(xs[1], n), ' + ', sumN(xs[2], n), '?'],
      datos: [DO.base(n), DO.columna],
      dibujo: cuaderno(xs, { base: String(n) }),
      opciones: opcionesNum([resN(C.texto, n)], [
        { id: 'decimal', texto: [resN(dec10, n)], error: 'AT-DECIMAL', siFuera: `Sumar por columnas está bien. Pero así se suma en base 10; en base ${n} se lleva al juntar ${n}.` },
        { id: 'uno', texto: [resN(sumaLlevaUno(xs, n), n)], error: 'AT-LLEVA-UNO', siFuera: `Anotar lo que sobra está bien. Pero si la columna junta dos veces ${n}, se llevan 2, no 1.` },
        { id: 'final', texto: [resN(C.texto.slice(1), n)], error: 'AT-LLEVA-FINAL', siFuera: 'Las columnas están bien. Pero la última llevada también se anota: abre una columna nueva.' },
      ]),
      solucion: { texto: `Por columnas, desde los sueltos; si una columna junta dos veces ${n}, se llevan 2.`,
        ecuacion: [sumN(xs[0], n), ' + ', sumN(xs[1], n), ' + ', sumN(xs[2], n), ' = ', resN(C.texto, n)] },
    };
  }
  // Ahora tú · tipo 2 (nivel examen): la base que hace cuadrar una suma (base desconocida, de Numeración, con la llevada).
  function casoBaseOculta(r) {
    const n = r.ent(5, 9), a = numeralAzar(r, 2, n), b = numeralAzar(r, 2, n);
    const C = MCO.sumaColumnas([a, b], n), z = C.texto, c0 = C.columnas[0];
    if (c0.llevadaSale !== 1) return null;
    const mayor = Math.max(...(a + b + z).split('').map(Number)), S = c0.total;
    const sirven = []; for (let m = mayor + 1; m <= 20; m++) if (valor(a, m) + valor(b, m) === valor(z, m)) sirven.push(m);
    if (sirven.length !== 1 || sirven[0] !== n || mayor + 1 === n) return null;
    const N_ = sumNL => sumN(sumNL, 'n');
    return {
      pregunta: ['En cierta base ', bas('n'), ' se cumple ', N_(a), ' + ', N_(b), ' = ', resN(z, 'n'), '. ¿Cuál es ', bas('n'), '?'],
      datos: [DO.columna, DO.cifras],
      dibujo: cuaderno([a, b], { base: 'n', resultado: z }),
      opciones: opciones(n, [
        { id: 'menor', valor: mayor + 1, error: 'AT-MENOR', siFuera: 'Mirar la cifra mayor está bien: la base tiene que pasarla. Pero con esa base la cuenta no cuadra.' },
        { id: 'columna', valor: S, error: 'AT-SUMA-COLUMNA', siFuera: 'Sumar las unidades está bien. Pero esa suma es una bolsita más lo que se anota, no solo la bolsita.' },
        { id: 'diez', valor: 10, error: 'AT-DECIMAL', siFuera: 'Sin base escrita sería 10, es cierto. Pero en base 10 esa cuenta no cuadra.' },
      ], x => `base ${x}`),
      solucion: { texto: `Unidades: ${c0.entran.join(' + ')} = ${S}, y se anota ${c0.cifra}: la bolsita que subió tiene ${S} − ${c0.cifra} = ${n}.`,
        ecuacion: [`${S} = `, lleva(1), ' × ', bas('n'), ' + ', res(c0.cifra), '   →   ', bas('n'), ' = ', bas(n)] },
    };
  }
  // Ahora tú · tipo 3: la cifra de las centenas, con lo que le llega llevado de las decenas (2 o más).
  function casoCentenas(r) {
    const xs = [0, 1, 2].map(() => r.ent(100, 9999)), C = MCO.sumaColumnas(xs.map(String), 10), c2 = C.columnas[2];
    const ll = c2.llevadaEntra, sin = suma(c2.entran), olvida = sin % 10, unoV = (sin + 1) % 10;
    if (ll < 2 || new Set([c2.cifra, olvida, unoV, c2.llevadaSale]).size < 4) return null;
    return {
      pregunta: ['Doña Juana suma ', xs.join(' + '), '. ¿Qué cifra anota en la columna de las centenas?'],
      datos: [DO.ordenes, DO.columna],
      dibujo: cuaderno(xs, { foco: 2 }),
      opciones: opciones(c2.cifra, [
        { id: 'olvida', valor: olvida, error: 'AT-LLEVA-OLVIDA', siFuera: 'Sumar la columna de las centenas está bien. Pero falta lo que llega llevado de las decenas.' },
        { id: 'uno', valor: unoV, error: 'AT-LLEVA-UNO', siFuera: `Sumar lo que llega llevado está bien. Pero de las decenas llegan ${ll}, no 1.` },
        { id: 'sale', valor: c2.llevadaSale, error: 'AT-LLEVA-CIFRA', siFuera: 'Esa es la llevada que sale de las centenas. Se anota lo que sobra después de llevar.' },
      ]),
      solucion: { texto: `Las decenas le llevan ${ll}; la columna junta ${c2.total} y se anota ${c2.cifra}.`, ecuacion: ecColumna(c2, 10) },
    };
  }
  // Ahora tú · tipo 4 (nivel examen): ¿en cuántas columnas se lleva? (base n, con una llevada que forma otra y la final).
  function casoLlevadas(r) {
    const n = r.ent(4, 8), a = numeralAzar(r, 3, n), b = numeralAzar(r, 3, n), C = MCO.sumaColumnas([a, b], n);
    const L = C.llevadas, cadena = C.columnas.filter(c => suma(c.entran) >= n).length;
    const decimal = MCO.sumaColumnas([a, b], 10).llevadas, final = C.texto.length > 3 ? L - 1 : null;
    if (L < 2 || final === null || new Set([L, cadena, decimal, final]).size < 4) return null;
    return {
      pregunta: ['Al sumar ', sumN(a, n), ' + ', sumN(b, n), ', ¿en cuántas columnas se lleva algo a la columna siguiente?'],
      datos: [DO.base(n), DO.columna],
      dibujo: cuaderno([a, b], { base: String(n) }),
      opciones: opciones(L, [
        { id: 'cadena', valor: cadena, error: 'AT-CADENA', siFuera: 'Mirar si las cifras pasan de la base está bien. Pero la llevada que llega también suma.' },
        { id: 'decimal', valor: decimal, error: 'AT-DECIMAL', siFuera: `Contar las llevadas está bien. Pero en base ${n} se lleva al juntar ${n}, no al pasar de 9.` },
        { id: 'final', valor: final, error: 'AT-LLEVA-FINAL', siFuera: 'Las columnas de adentro están bien contadas. Pero la última también lleva: abre una columna nueva.' },
      ], x => (x === 1 ? '1 columna' : `${x} columnas`)),
      solucion: { texto: `Cuento las columnas que juntan ${n} o más, con lo que les llega llevado: ${L}.`,
        ecuacion: [sumN(a, n), ' + ', sumN(b, n), ' = ', resN(C.texto, n)] },
    };
  }

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h): 5 de nivel 1, 5 de nivel 2 y 5 de nivel 3. Cuentas
  // rehechas aparte, sin este archivo (scratchpad de la sesión, cuentas-idea1.js, que suma en cualquier base con su
  // propio código): 6 + 7 = 13; 52 + 36 = 88 sin llevadas; 29 + 45 = 74; 4 + 5 = 9 = 1 × 6 + 3; 6 + 8 = 14 bolsitas;
  // 478 + 356 = 834; 58 + 67 + 49 = 174 (llevada 2); 123₍₄₎ + 213₍₄₎ = 1002₍₄₎ (27 + 39 = 66); 45₍₇₎ + 36₍₇₎ = 114₍₇₎
  // (33 + 27 = 60); 386 + 475 + 299: llegan 2 a las centenas; 35₍ₙ₎ + 24₍ₙ₎ = 62₍ₙ₎ solo con n = 7; 245₍₆₎ + 354₍₆₎ +
  // 155₍₆₎ = 1242₍₆₎ (101 + 142 + 71 = 314), con las trampas 754, 1132 y 242; 3 × 777₍₈₎ = 2775₍₈₎ (3 × 511 = 1533),
  // cifras 21, con las trampas 18, 19 y 9; cuatro cifras de 9 dan 36: se llevan 3; 4999 + 5001 = 10 000 con 4 llevadas.
  // La figura muestra lo que cada dato marca por sí solo (los sumandos escritos, el montón que se da), nunca el
  // resultado: lo que se pide va con «?» en tinta. Ningún ejemplo usa los números de la predicción ni de la misión.
  const EJEMPLOS_LLEVADA = [
    { nivel: 1, titulo: 'Una columna que pasa de 9',
      enunciado: 'En la columna de los sueltos, doña Juana junta 6 + 7 = 13 caramelos. ¿Qué anota en esa columna y qué lleva a la de las bolsitas?',
      datos: [DO.bolsita(10)],
      figura: fig({ n: 10, sueltos: 13, regla: 1, rotulos: { sueltos: '6 + 7 sueltos' } }),
      solucion: [
        { texto: ['Con ', bas(10), ' de los 13 se llena una bolsita; sobran 3, menos que 10.'], ecuacion: ['13 = ', lleva(1), ' × ', bas(10), ' + ', res(3)] },
        { texto: 'Los 3 sueltos se anotan en su columna; la bolsita llena sube a la columna de las bolsitas.' },
      ],
      respuesta: ['Anota ', res(3), ' y lleva ', lleva(1)] },
    { nivel: 1, titulo: '¿Hay algo que llevar?',
      enunciado: 'Doña Juana suma 52 + 36 en su cuaderno. ¿Tiene que llevar algo a otra columna?',
      datos: [DO.bolsita(10), DO.caja(10)],
      figura: cuaderno(['52', '36']),
      solucion: [
        { texto: 'Sueltos: 2 + 6 = 8, menos que 10: no llenan una bolsita. Bolsitas: 5 + 3 = 8, tampoco llenan una caja.' },
        { texto: 'Ninguna columna llega a 10: se anota cada suma tal cual.', ecuacion: ['52 + 36 = ', res(88)] },
      ],
      respuesta: ['No: ninguna columna llega a 10; da ', res(88)] },
    { nivel: 1, titulo: 'Una sola llevada',
      enunciado: 'Doña Juana junta un pedido de 29 caramelos y otro de 45. ¿Cuántos caramelos tiene ahora?',
      datos: [DO.bolsita(10)],
      figura: cuaderno(['29', '45']),
      solucion: [
        { texto: 'Sueltos: 9 + 5 = 14. Se llena una bolsita y sobran 4.', ecuacion: ['9 + 5 = 14 = ', lleva(1), ' × ', bas(10), ' + ', res(4)] },
        { texto: 'Bolsitas: 2 + 4, más la que subió.', ecuacion: ['2 + 4 + ', lleva(1), ' = ', res(7)] },
      ],
      respuesta: [res(74), ' caramelos'] },
    { nivel: 1, titulo: 'Una llevada en base 6',
      enunciado: ['En el puesto de bolsitas de ', bas(6), ', la columna de los sueltos junta 4 + 5 = 9 caramelos. ¿Qué se anota en esa columna y qué se lleva?'],
      datos: [DO.bolsita(6)],
      figura: fig({ n: 6, sueltos: 9, regla: 1, rotulos: { sueltos: '4 + 5 sueltos' } }),
      solucion: [
        { texto: ['Con ', bas(6), ' se llena una bolsita; sobran 3, menos que 6.'], ecuacion: ['9 = ', lleva(1), ' × ', bas(6), ' + ', res(3)] },
        { texto: 'En base 6 no se espera a juntar 10: la bolsita se llena con 6.' },
      ],
      respuesta: ['Se anota ', res(3), ' y se lleva ', lleva(1)] },
    { nivel: 1, titulo: 'Bolsitas que llenan una caja',
      enunciado: 'Al sumar dos pedidos, la columna de las bolsitas junta 6 + 8 = 14 bolsitas de 10. ¿Qué se anota en esa columna y qué se lleva a la de las cajas?',
      datos: [DO.bolsita(10), DO.caja(10)],
      figura: fig({ n: 10, bolsitas: 14, regla: 2, rotulos: { bolsitas: '6 + 8 bolsitas' } }),
      solucion: [
        { texto: ['Con ', bas(10), ' bolsitas se llena una caja; sobran 4 bolsitas.'], ecuacion: ['14 = ', lleva(1), ' × ', bas(10), ' + ', res(4)] },
        { texto: 'Las 4 bolsitas se anotan en su columna; la caja sube a la columna de las cajas: es la llevada.' },
      ],
      respuesta: ['Se anota ', res(4), ' y se lleva ', lleva(1), ' caja'] },
    { nivel: 2, titulo: 'Dos llevadas seguidas',
      enunciado: '¿Cuánto es 478 + 356?',
      datos: [DO.ordenes, DO.columna],
      figura: cuaderno(['478', '356']),
      solucion: [
        { texto: 'Unidades: 8 + 6 = 14. Se anota 4 y se lleva 1.', ecuacion: ['8 + 6 = 14 = ', lleva(1), ' × ', bas(10), ' + ', res(4)] },
        { texto: 'Decenas: 7 + 5 más la que llega. Se anota 3 y se lleva 1.', ecuacion: ['7 + 5 + ', lleva(1), ' = 13 = ', lleva(1), ' × ', bas(10), ' + ', res(3)] },
        { texto: 'Centenas: 4 + 3 más la que llega.', ecuacion: ['4 + 3 + ', lleva(1), ' = ', res(8)] },
      ],
      respuesta: ['478 + 356 = ', res(834)] },
    { nivel: 2, titulo: 'Se llevan 2',
      enunciado: 'Doña Juana suma tres pedidos: 58, 67 y 49 caramelos. ¿Cuántos caramelos son en total?',
      datos: [DO.bolsita(10), DO.columna],
      figura: cuaderno(['58', '67', '49']),
      solucion: [
        { texto: 'Sueltos: 8 + 7 + 9 = 24. Llenan 2 bolsitas y sobran 4: esta vez la llevada es 2.', ecuacion: ['8 + 7 + 9 = 24 = ', lleva(2), ' × ', bas(10), ' + ', res(4)] },
        { texto: 'Bolsitas: 5 + 6 + 4, más las 2 que suben. Llenan 1 caja y sobran 7.', ecuacion: ['5 + 6 + 4 + ', lleva(2), ' = 17 = ', lleva(1), ' × ', bas(10), ' + ', res(7)] },
        { texto: 'La caja abre la columna de las cajas.', ecuacion: ['58 + 67 + 49 = ', res(174)] },
      ],
      respuesta: [res(174), ' caramelos'] },
    { nivel: 2, titulo: 'Una suma en base 4',
      enunciado: ['¿Cuánto es ', sumN('123', 4), ' + ', sumN('213', 4), '?'],
      datos: [DO.base(4), DO.columna],
      figura: cuaderno(['123', '213'], { base: '4' }),
      solucion: [
        { texto: 'Sueltos: 3 + 3 = 6. Se anota 2 y se lleva 1.', ecuacion: ['3 + 3 = 6 = ', lleva(1), ' × ', bas(4), ' + ', res(2)] },
        { texto: 'Bolsitas: 2 + 1 más la que llega = 4. Se anota 0 y se lleva 1.', ecuacion: ['2 + 1 + ', lleva(1), ' = 4 = ', lleva(1), ' × ', bas(4), ' + ', res(0)] },
        { texto: 'Cajas: 1 + 2 más la que llega = 4. Se anota 0, y la llevada abre otra columna.', ecuacion: ['1 + 2 + ', lleva(1), ' = 4 = ', lleva(1), ' × ', bas(4), ' + ', res(0)] },
      ],
      respuesta: [sumN('123', 4), ' + ', sumN('213', 4), ' = ', resN('1002', 4)] },
    { nivel: 2, titulo: 'Comprobar en base 10',
      enunciado: ['Suma ', sumN('45', 7), ' + ', sumN('36', 7), ' y comprueba el total pasando todo a base 10.'],
      datos: [DO.base(7), DO.f2(7), DO.f3(7)],
      figura: cuaderno(['45', '36'], { base: '7' }),
      solucion: [
        { texto: 'Sueltos: 5 + 6 = 11. Se anota 4 y se lleva 1.', ecuacion: ['5 + 6 = 11 = ', lleva(1), ' × ', bas(7), ' + ', res(4)] },
        { texto: 'Bolsitas: 4 + 3 más la que llega = 8. Se anota 1 y se lleva 1, que abre otra columna.', ecuacion: ['4 + 3 + ', lleva(1), ' = 8 = ', lleva(1), ' × ', bas(7), ' + ', res(1)] },
        { texto: ['En base 10: los sumandos valen 4 × 7 + 5 = 33 y 3 × 7 + 6 = 27, que suman 60.'], ecuacion: [resN('114', 7), ' = 1 × 49 + 1 × 7 + 4 = ', res(60)] },
      ],
      respuesta: [resN('114', 7), ', que vale ', res(60)] },
    { nivel: 2, titulo: '¿Cuánto llega a las centenas?',
      enunciado: 'Doña Juana suma 386 + 475 + 299 en su cuaderno. ¿Cuánto lleva a la columna de las centenas?',
      datos: [DO.ordenes, DO.columna],
      figura: cuaderno(['386', '475', '299']),
      solucion: [
        { texto: 'Unidades: 6 + 5 + 9 = 20. Se anota 0 y se llevan 2.', ecuacion: ['6 + 5 + 9 = 20 = ', lleva(2), ' × ', bas(10), ' + ', res(0)] },
        { texto: 'Decenas: 8 + 7 + 9, más las 2 que llegan, da 26. Se anota 6 y se llevan 2.', ecuacion: ['8 + 7 + 9 + ', lleva(2), ' = 26 = ', lleva(2), ' × ', bas(10), ' + ', res(6)] },
      ],
      respuesta: ['Lleva ', lleva(2), ' a las centenas'] },
    { nivel: 3, titulo: 'La base que hace cuadrar',
      enunciado: ['En cierta base ', bas('n') , ' se cumple ', sumN('35', 'n'), ' + ', sumN('24', 'n'), ' = ', resN('62', 'n'), '. ¿Cuál es ', bas('n'), '?'],
      alternativas: ['6', '7', '8', '9'],
      datos: [DO.columna, DO.cifras],
      figura: cuaderno(['35', '24'], { base: 'n', resultado: '62' }),
      solucion: [
        { texto: 'Sueltos: 5 + 4 = 9, pero se anota 2: subió una bolsita de n y sobraron 2.', ecuacion: ['9 = ', lleva(1), ' × ', bas('n'), ' + ', res(2), '   →   ', bas('n'), ' = ', bas(7)] },
        { texto: 'Compruebo la otra columna: 3 + 2 más la que llega da 6, menos que 7. Se anota 6, como dice la cuenta.', ecuacion: ['3 + 2 + ', lleva(1), ' = ', res(6)] },
        { texto: ['Con 6 no sirve: 9 = 1 × 6 + 3 y se anotaría 3. Con 8 o con 9 se anotaría 1 o 0.'] },
      ],
      respuesta: [letra('B', 'base'), ': ', bas('n'), ' = ', bas(7)] },
    { nivel: 3, titulo: 'Tres sumandos en base 6',
      enunciado: ['¿Cuánto es ', sumN('245', 6), ' + ', sumN('354', 6), ' + ', sumN('155', 6), '?'],
      alternativas: [[sumN('754', 6)], [sumN('1132', 6)], [sumN('242', 6)], [sumN('1242', 6)]],
      datos: [DO.base(6), DO.columna],
      figura: cuaderno(['245', '354', '155'], { base: '6' }),
      solucion: [
        { texto: 'Sueltos: 5 + 4 + 5 = 14. Se anota 2 y se llevan 2.', ecuacion: ['5 + 4 + 5 = 14 = ', lleva(2), ' × ', bas(6), ' + ', res(2)] },
        { texto: 'Bolsitas: 4 + 5 + 5 más las 2 que llegan = 16. Se anota 4 y se llevan 2.', ecuacion: ['4 + 5 + 5 + ', lleva(2), ' = 16 = ', lleva(2), ' × ', bas(6), ' + ', res(4)] },
        { texto: 'Cajas: 2 + 3 + 1 más las 2 = 8. Se anota 2 y se lleva 1, que abre otra columna.', ecuacion: ['2 + 3 + 1 + ', lleva(2), ' = 8 = ', lleva(1), ' × ', bas(6), ' + ', res(2)] },
        { texto: ['Las trampas: ', letra('A'), ' suma en base 10; ', letra('B'), ' lleva 1 donde van 2; ', letra('C'), ' olvida la última llevada.'] },
      ],
      respuesta: [letra('D'), ': ', resN('1242', 6)] },
    { nivel: 3, titulo: 'Las cifras del total',
      enunciado: ['Si ', sumN('777', 8), ' + ', sumN('777', 8), ' + ', sumN('777', 8), ' = ', { sub: [{ raya: [res('abcd')] }, bas('(8)')] }, ', ¿cuánto vale a + b + c + d?'],
      alternativas: ['18', '21', '19', '9'],
      datos: [DO.base(8), DO.columna, [{ raya: ['abcd'] }, ': numeral de cifras a, b, c y d']],
      figura: cuaderno(['777', '777', '777'], { base: '8' }),
      solucion: [
        { texto: 'Sueltos: 7 + 7 + 7 = 21. Se anota 5 y se llevan 2.', ecuacion: ['21 = ', lleva(2), ' × ', bas(8), ' + ', res(5)] },
        { texto: 'Las otras dos columnas reciben esas 2: 21 + 2 = 23. Se anota 7 y se llevan 2.', ecuacion: ['21 + ', lleva(2), ' = 23 = ', lleva(2), ' × ', bas(8), ' + ', res(7)] },
        { texto: ['La última llevada, 2, abre otra columna: el total es ', resN('2775', 8), '.'], ecuacion: ['2 + 7 + 7 + 5 = ', res(21)] },
        { texto: ['Las trampas: ', letra('A'), ' lleva 1 donde van 2; ', letra('C'), ' olvida la última llevada; ', letra('D'), ' suma en base 10.'] },
      ],
      respuesta: [letra('B'), ': ', res(21)] },
    { nivel: 3, titulo: 'La mayor llevada',
      enunciado: 'Doña Juana suma cuatro números de dos cifras. ¿Cuál es la mayor llevada que puede pasar de la columna de las unidades a la de las decenas?',
      alternativas: ['1', '2', '3', '4'],
      datos: [DO.columna, 'La mayor cifra en base 10 es 9'],
      figura: cuaderno(['??', '??', '??', '??'], { foco: 0 }),
      solucion: [
        { texto: 'La columna de las unidades junta cuatro cifras. Lo más que puede juntar es 9 + 9 + 9 + 9 = 36.' },
        { texto: 'Con 36 se llenan 3 bolsitas de 10 y sobran 6. Para llevar 4 harían falta 40, y no alcanza.', ecuacion: ['36 = ', lleva(3), ' × ', bas(10), ' + ', res(6)] },
      ],
      respuesta: [letra('C', 'llevada'), ': ', lleva(3)] },
    { nivel: 3, titulo: 'Llevadas en cadena',
      enunciado: '¿En cuántas columnas se lleva algo al sumar 4999 + 5001?',
      alternativas: ['1', '3', '4', '5'],
      datos: [DO.todo(10)],
      figura: cuaderno(['4999', '5001']),
      solucion: [
        { texto: 'Unidades: 9 + 1 = 10. Se anota 0 y se lleva 1.', ecuacion: ['9 + 1 = 10 = ', lleva(1), ' × ', bas(10), ' + ', res(0)] },
        { texto: 'Decenas y centenas: 9 + 0 más la que llega da 10 en cada una. Otra vez 0, y se lleva 1.', ecuacion: ['9 + 0 + ', lleva(1), ' = 10 = ', lleva(1), ' × ', bas(10), ' + ', res(0)] },
        { texto: 'Millares: 4 + 5 más la que llega da 10. La última llevada abre otra columna.', ecuacion: ['4999 + 5001 = ', res('10 000')] },
        { texto: ['Las cuatro columnas llevaron 1. ', letra('A'), ' solo mira las unidades; ', letra('B'), ' olvida la última; ', letra('D'), ' cuenta las cifras del total.'] },
      ],
      respuesta: [letra('C'), ': ', res(4), ' columnas'] },
  ];

  const otrasBases = {
    id: 'otras-bases',
    titulo: 'La llevada llena una bolsita',
    pregunta: '¿Por qué se lleva 1 cuando una columna pasa de 9?',
    temas: ['Adición y sumatorias', 'Operaciones en otras bases'],
    pieza: PU,
    aprendizaje: 'Por columnas, cada 10 de una columna (n en base n) forman 1 de la siguiente: eso es llevar; se anota lo que sobra.',
    actividad: 'Juntar dos pedidos y empacar de 10 en 10 hasta poder anotar el total.',
    // Lee: el puesto en base 10, los sumandos y el cuaderno, y qué mirar. No dice qué pasa en otra base ni con una
    // segunda llevada (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'El puesto en base 10', texto: ['Doña Juana ahora empaca de ', bas(10), ' en ', bas(10), ': 10 sueltos llenan una bolsita y 10 bolsitas, una caja. Es la base 10, la de todos los días: 26 caramelos son 2 bolsitas y 6 sueltos.'],
          pieza: PU, dibujo: { datos: { n: 10, bolsitas: 2, sueltos: 6, regla: 2, rotulos: true, colorCifras: false }, estado: {} } },
        { titulo: 'Sumar es juntar', texto: 'Si le llegan dos pedidos, los junta: suma. Cada pedido es uno de los sumandos. En su cuaderno los escribe uno debajo del otro, sueltos bajo sueltos y bolsitas bajo bolsitas, y suma cada columna.',
          pieza: PU, dibujo: { datos: { n: 10, bolsitas: 3, sueltos: 9, ceros: true, regla: 1, rotulos: { bolsitas: '2 + 1 bolsitas', sueltos: '6 + 3 sueltos' }, cuenta: { sumandos: ['26', '13'], resultado: '39' } }, estado: {} } },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a juntar dos pedidos. Mira la columna de los sueltos: si junta 10 o más, toca el montón y doña Juana llena una bolsita. Fíjate a qué columna se va esa bolsita.' },
      ],
    },
    ejemplos: EJEMPLOS_LLEVADA,
    juega: {
      pieza: PU,
      consigna: 'A doña Juana le llegaron dos pedidos y los junta en el mostrador. Empaca de 10 en 10 y anota la cuenta en su cuaderno.',
      mision: {
        texto: 'Junta los pedidos de 47 y 38, y empaca hasta poder anotar el total.',
        logrado: v => [v.p1, v.p2].sort((x, y) => x - y).join() === '38,47' && manoJ(v).m.listo,
        bien: '15 sueltos llenaron una bolsita que subió: 4 + 3 + 1 = 8 bolsitas y 5 sueltos.',
      },
      voz: 'Toca el montón de sueltos cuando alcance para una bolsita.',
      leyenda: [
        { s: bas('10'), t: 'caramelos por bolsita: la base' },
        { s: lleva('1'), t: 'la llevada: la bolsita llena que sube' },
        { s: res('cifra'), t: 'lo que se anota en el cuaderno' },
        { s: '?', t: 'lo que todavía no se puede anotar' },
      ],
      controles: [
        { id: 'p1', etiqueta: 'Pedido de la mañana', min: 11, max: 49, paso: 1, inicio: 26, decimales: 0 },
        { id: 'p2', etiqueta: 'Pedido de la tarde', min: 11, max: 49, paso: 1, inicio: 15, decimales: 0 },
        { id: 'ju', etiqueta: 'Sueltos', opciones: [{ valor: 0, texto: 'Sin juntar' }, { valor: 1, texto: 'Juntar 10 en una bolsita' }] },
      ],
      dibujo: v => ({ datos: puestoJ(v, escalaJ()), estado: {} }),
      // La relación: lo que junta la columna de los sueltos, y qué pasa con 10 de ellos.
      lectura: v => {
        const { m, lleno, junto } = manoJ(v), us = uni(v.p1) + uni(v.p2);
        if (!lleno) return [`${uni(v.p1)} + ${uni(v.p2)} = `, res(us), ' sueltos: no llenan una bolsita'];
        if (!junto) return [`${uni(v.p1)} + ${uni(v.p2)} = ${us} sueltos: alcanzan para `, lleva(1), ' bolsita'];
        return [`${us} sueltos = `, lleva(1), ' bolsita + ', res(us - 10), `; ahora hay ${m.cuentas[1]} bolsitas`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['En otro puesto, doña Juana usa bolsitas de ', bas(5), ' y cajas de ', bas(5), ' bolsitas. Junta un pedido de ', sumN('34', 5), ' y otro de ', sumN('23', 5), '. ¿Qué total anota en su cuaderno?'],
      datos: [DO.bolsita(5), DO.caja(5)],
      voz: 'Piensa qué hace doña Juana cuando una columna se llena.',
      opciones: [
        { id: 'c', texto: [resN('112', 5)], correcta: true },
        { id: 'decimal', texto: [resN('57', 5)], error: 'AT-DECIMAL', siFuera: 'Sumar por columnas está bien. Pero así se lleva al llegar a 10; aquí 5 sueltos ya llenan una bolsita.' },
        { id: 'diez', texto: [resN('102', 5)], error: 'AT-LLEVA-OLVIDA', siFuera: 'Bien: los 7 sueltos llenan una bolsita y sobran 2. Pero esa bolsita se suma a las otras 3 + 2.' },
        { id: 'sin-lleva', texto: [resN('12', 5)], error: 'AT-LLEVA-FINAL', siFuera: 'Las dos columnas están bien hechas. Pero la caja que se llenó también se anota: abre otra columna.' },
      ],
      dibujo: fig(Object.assign({}, P5, { bolsitas: 5, sueltos: 7, rotulos: ROT5, cuenta: CU5() })),
      revelar: fig(Object.assign({}, P5, { cajas: 1, bolsitas: 1, sueltos: 2, llevada: { cajas: 1 }, rotulos: ROT5c, cuenta: CU5({ llevadas: { 1: 1, 2: 1 }, resultado: '112' }) })),
      coincide: 'Coincide: 7 sueltos dan 1 bolsita y sobran 2; 6 bolsitas dan 1 caja y sobra 1.',
      noCoincide: 'Revisemos: con 5 sueltos ya se llena una bolsita, y con 5 bolsitas, una caja.',
    },
    mira: {
      pieza: PU,
      datos: MIRA5,
      voz: 'Columna por columna, desde los sueltos.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Junto los dos pedidos: 3 + 2 bolsitas y 4 + 3 sueltos.', ecuacion: [sumN('34', 5), ' + ', sumN('23', 5)] },
        { estado: { paso: 1 }, texto: 'Sueltos: 4 + 3 = 7. Con 5 se llena una bolsita y sobran 2.', ecuacion: ['4 + 3 = 7 = ', lleva(1), ' × ', bas(5), ' + ', res(2)] },
        { estado: { paso: 2 }, texto: 'La bolsita sube a la otra columna: es la llevada. Se anota 2.', ecuacion: ['sube ', lleva(1), ', se anota ', res(2)] },
        { estado: { paso: 3 }, texto: 'Bolsitas: 3 + 2 + 1 = 6. Con 5 se llena una caja y sobra 1.', ecuacion: ['3 + 2 + ', lleva(1), ' = 6 = ', lleva(1), ' × ', bas(5), ' + ', res(1)] },
        { estado: { paso: 4 }, texto: ['La caja sube y abre una columna nueva: el total es ', resN('112', 5), '.'], ecuacion: [sumN('34', 5), ' + ', sumN('23', 5), ' = ', resN('112', 5)] },
        { estado: { paso: 5 }, texto: ['En base 10 cuadra: 19 + 13 = 32, y ', resN('112', 5), ' vale 25 + 5 + 2.'], ecuacion: [resN('112', 5), ' = 1 × 25 + 1 × ', bas(5), ' + 2 = ', res(32)] },
      ],
    },
    regla: {
      texto: 'Se suma por columnas, desde las unidades. Cada 10 de una columna forman 1 de la siguiente: se lleva y se anota lo que sobra. En base n, cada n.',
      // Cada relación en su línea y corta, para que quepa a 360 px: la suma de una columna se parte en lo que sube y lo
      // que se anota; lo que se anota es una cifra de la base.
      // (L y c, dichas en las llaves: lo que se lleva y la cifra que se anota.)
      ecuacion: ['columna = ', { llave: [lleva('L'), ' × ', bas('n')], nota: 'L: se lleva', color: 'c-o' }, ' + ', { llave: [res('c')], nota: 'c: se anota', color: 'c-f' }, SEP, '0 ≤ ', res('c'), ' ≤ ', bas('n'), ' − 1'],
      condicion: 'Con varios sumandos se puede llevar 2 o más. La última llevada también se anota: abre una columna nueva.',
      voz: 'Lo que llena un envase sube; lo que sobra se anota.',
    },
    // Así se resuelve: juntar dos pedidos de otro puesto (dos sumandos de tres cifras en base n, con dos llevadas o más),
    // columna por columna, y comprobar en base 10. «Ahora tú» pide otra cosa: cuánto se lleva, tres sumandos, la base
    // que hace cuadrar, una cifra del total o cuántas llevadas hay.
    resuelve: {
      pieza: PU,
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const n = r.de([3, 4, 6, 7, 8, 9]), A = numeralAzar(r, 3, n), B = numeralAzar(r, 3, n), C = MCO.sumaColumnas([A, B], n);
          if (C.llevadas < 2) continue;
          const uso = C.columnas.slice(0, 3);                // las tres columnas de los sumandos
          const extra = C.texto.length > 3;                  // la última llevada abre otra columna
          const paso = (c, k) => {
            const ll = Object.fromEntries(C.columnas.slice(0, k + 1).filter(x => x.llevadaSale).map(x => [x.orden + 1, x.llevadaSale]));
            const parcial = C.texto.slice(C.texto.length - k - 1);
            const ultimo = k === uso.length - 1;
            return { tipo: 'cuentas',
              texto: `${NOMBRE_COL[k]}: ${c.entran.join(' + ')}${c.llevadaEntra ? ` más ${c.llevadaEntra === 1 ? 'la que llega' : `las ${c.llevadaEntra} que llegan`}` : ''} = ${c.total}. Se anota ${c.cifra}${c.llevadaSale ? ` y se lleva ${c.llevadaSale}` : ''}.${ultimo && extra ? ' La llevada abre otra columna.' : ''}`,
              ecuacion: ecColumna(c, n),
              dibujo: cuaderno([A, B], { base: String(n), foco: k, llevadas: ll, resultado: ultimo && extra ? C.texto : parcial }) };
          };
          const T = C.texto, vA = valor(A, n), vB = valor(B, n);
          return {
            enunciado: ['En el puesto de bolsitas de ', bas(n), ', doña Juana junta un pedido de ', sumN(A, n), ' y otro de ', sumN(B, n), '. ¿Qué total anota en su cuaderno?'],
            datos: [DO.base(n), DO.f3(n)],
            dibujo: cuaderno([A, B], { base: String(n) }),
            pasos: [
              { tipo: 'pide', texto: ['Piden el total, escrito en base ', bas(n), ': lo que queda cuando ninguna columna llega a ', bas(n), '.'] },
              { tipo: 'regla', texto: ['Sumo por columnas, desde los sueltos. Cada ', bas(n), ' de una columna forman 1 de la siguiente: se lleva y se anota lo que sobra.'] },
              ...uso.map(paso),
              { tipo: 'sentido', texto: `Compruebo en base 10: los pedidos valen ${vA} y ${vB}, que suman ${vA + vB}; el total también.`,
                ecuacion: [resN(T, n), ` = ${poli(T, n)} = `, res(valor(T, n))] },
            ],
            respuesta: ['Anota ', resN(T, n)],
          };
        }
      },
    },
    ahoraTu: {
      pieza: PU,
      voz: 'Columna por columna: lo que llena un envase sube.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 5;
        if (tipo === 0) return conCuatro(q => casoCuantoLleva(q, 3 + (Math.floor(sem / 5) % 2)), r);
        if (tipo === 1) return conCuatro(casoTres, r);
        if (tipo === 2) return conCuatro(casoBaseOculta, r);
        if (tipo === 3) return conCuatro(casoCentenas, r);
        return conCuatro(casoLlevadas, r);
      },
    },
  };

  // Mesa del laboratorio de la idea 1: cualquier suma de dos pedidos, en la base que elijas (de 6 a 10; la base 5 es de
  // la predicción). Se llama `juego-otras-bases`, como se llamaba el juego viejo en el laboratorio, para que los casos
  // guardados con su control `b` sigan abriendo. Las llevadas las cuenta el motor de la escena (sumaColumnas).
  const sumaLab = v => MCO.sumaColumnas([enBase(v.x, v.b), enBase(v.y, v.b)], v.b);
  const mesaBases = {
    id: 'juego-otras-bases', titulo: 'Sumar en cualquier base', pieza: PU,
    consigna: 'Dos pedidos de caramelos y el tamaño de la bolsita. El cuaderno los suma en esa base, con sus llevadas.',
    controles: [
      { id: 'b', etiqueta: 'Caramelos por bolsita, n', color: 'c-i', min: 6, max: 10, paso: 1, inicio: 6, decimales: 0 },
      { id: 'x', etiqueta: 'Primer pedido (caramelos)', min: 6, max: 99, paso: 1, inicio: 16, decimales: 0 },
      { id: 'y', etiqueta: 'Segundo pedido (caramelos)', min: 6, max: 99, paso: 1, inicio: 15, decimales: 0 },
    ],
    dibujo: v => {
      const C = sumaLab(v), ll = Object.fromEntries(C.columnas.filter(c => c.llevadaSale).map(c => [c.orden + 1, c.llevadaSale]));
      return { datos: { cuenta: { solo: true, sumandos: [enBase(v.x, v.b), enBase(v.y, v.b)], base: v.b === 10 ? '' : String(v.b), llevadas: ll, resultado: C.texto } }, estado: {} };
    },
    lectura: v => [`${v.x} + ${v.y} = `, res(v.x + v.y), ` caramelos; ${sumaLab(v).llevadas} llevadas en base `, bas(v.b)],
    invitaciones: [
      { texto: 'Haz que la suma no lleve nada en ninguna columna.',
        logrado: v => sumaLab(v).llevadas === 0,
        bien: 'Ninguna columna llegó a la base: cada suma se anota tal cual.' },
      { texto: 'Consigue una suma con dos llevadas.',
        logrado: v => sumaLab(v).llevadas === 2,
        bien: 'Dos columnas llenaron un envase: dos llevadas.' },
      { texto: 'Haz que el total tenga una cifra más que los dos pedidos.',
        logrado: v => { const C = sumaLab(v); return C.texto.length > Math.max(...C.sumandos.map(x => x.length)); },
        bien: 'La última llevada abrió una columna nueva.' },
      { texto: 'Guarda dos casos con los mismos pedidos y distinta cantidad de llevadas.',
        logrado: (v, guardados) => guardados.some(g => g.x === v.x && g.y === v.y && g.b !== v.b && sumaLab(g).llevadas !== sumaLab(v).llevadas),
        bien: 'Los mismos caramelos: con otra bolsita, las columnas se llenan distinto.' },
    ],
  };

  // ---------- Idea 5: multiplicar es sumar por partes (multiplicación) ----------
  // Cambia: los dos factores. Permanece: la escala de las tiras (una unidad, el mismo largo).
  // Progresa: a · b como decenas por b más unidades por b. Se reserva: el pedazo que se agrega al subir un factor.
  // Debe verse: si un factor sube k, el producto sube k veces el otro factor.
  const tirasProd = (av, bv, extra = 0, max) => {
    const dec = Math.floor(av / 10) * 10, uni = av - dec;
    const tramos = [{ valor: dec * bv, color: 'o', texto: `${dec}·${bv}` }];
    if (uni) tramos.push({ valor: uni * bv, color: 'i', texto: `${uni}·${bv}` });
    if (extra) tramos.push({ valor: extra * bv, color: 'h', texto: `+${extra}·${bv}`, paso: 1 });
    return { max: max || 360, tiras: [{ rotulo: `${av}${extra ? ' + ' + extra : ''} × ${bv}`, color: 'o', fin: f((av + extra) * bv), tramos }], filas: 1, alt: `Tira de ${av} por ${bv} partida en ${dec} por ${bv} y ${uni} por ${bv}${extra ? `, más ${extra} por ${bv}` : ''}` };
  };
  const multiplicacion = {
    id: 'multiplicar-partes',
    titulo: 'Multiplicar es sumar por partes',
    temas: ['Multiplicación'],
    pieza: 'arit-tiras',
    // Lee (fase 2): vocabulario (factores, producto) y cómo se parte la tira; no dice cuánto sube el producto.
    lee: {
      tarjetas: [
        { titulo: 'Factores y producto', texto: 'En 24 × 7, los números 24 y 7 son los factores, y lo que resulta es el producto. Multiplicar es juntar varios grupos del mismo tamaño.' },
        { titulo: 'De cabeza, en el mercado', texto: 'Para cobrar 12 kilos de papa a 3 soles, muchas caseras piensan 10 kilos y 2 kilos por separado: 30 más 6. Partir un factor ayuda a multiplicar sin papel.' },
        { titulo: 'Qué mirar', texto: 'La tira tiene un pedazo naranja, las decenas por b, y uno turquesa, las unidades por b. Suma los dos pedazos y compara con el número del final.' },
      ],
    },
    juega: {
      consigna: 'Elige los dos factores. La tira del producto se parte en decenas por b y unidades por b.',
      voz: 'Suma los dos pedazos y compara con el total.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 11, max: 39, paso: 1, inicio: 24, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 3, max: 9, paso: 1, inicio: 7, decimales: 0 },
      ],
      dibujo: v => ({ datos: tirasProd(v.a, v.b), estado: {} }),
      lectura: v => { const dc = Math.floor(v.a / 10) * 10; return [`${v.a} · ${v.b} = ${dc * v.b} + ${(v.a - dc) * v.b} = `, { v: 'c-d', t: String(v.a * v.b) }]; },
      minimo: 3,
      // Se tira del final de la tira: cada grupo de b que se agrega sube a en 1 (la escala es fija: 360).
      arrastres: [{ id: 'fin', etiqueta: 'final de la tira (el factor a)', color: 'c-o',
        donde: v => { const g = TIRAS().geometria(tirasProd(v.a, v.b)); return { x: g.x(v.a * v.b), y: g.tiraY(0) }; },
        mover: (pt, v) => ({ a: TIRAS().geometria(tirasProd(v.a, v.b)).deX(pt.x) / v.b }) }],
    },
    predice: {
      pregunta: ['En ', { v: 'c-o', t: '24' }, ' × ', { v: 'c-i', t: '7' }, ', el primer factor aumenta en 3. ¿En cuánto aumenta el producto?'],
      opciones: [
        { id: 'c', texto: 'en 21', correcta: true },
        { id: 'tres', texto: 'en 3', error: 'AT-SUMA', siFuera: 'Sería cierto en una suma. En un producto, cada unidad más vale 7.' },
        { id: 'diez', texto: 'en 10', error: 'AT-SUMA', siFuera: 'Eso suma 3 y 7. Se agregan 3 grupos de 7.' },
        { id: 'triple', texto: 'en 336', error: 'AR7', siFuera: 'Eso triplica todo el producto; solo se agregan 3 grupos de 7.' },
      ],
      dibujo: { datos: tirasProd(24, 7, 3, 200), estado: { paso: 0 } },
      revelar: { datos: tirasProd(24, 7, 3, 200), estado: { paso: 1 } },
      coincide: 'Coincide: 27 × 7 = 24 × 7 + 3 × 7.',
    },
    mira: {
      datos: tirasProd(24, 7, 3, 200),
      pasos: [
        { estado: { paso: 0 }, texto: '24 × 7 es 20 grupos de 7 más 4 grupos de 7.', ecuacion: ['24 · 7 = 140 + 28 = 168'] },
        { estado: { paso: 1 }, texto: 'Con 3 más, se agregan 3 grupos de 7.', ecuacion: ['27 · 7 = 168 + 3 · 7'] },
        { estado: { paso: 1 }, texto: 'El producto sube 21.', ecuacion: ['189 − 168 = ', { v: 'c-d', t: '21' }] },
      ],
    },
    regla: {
      texto: 'Propiedad distributiva: multiplicar reparte sobre la suma. Si un factor aumenta k, el producto aumenta k veces el otro factor.',
      ecuacion: ['(m + n) · ', bb, ' = m · ', bb, ' + n · ', bb, '   ·   ', '(a + k) · ', bb, ' = a · ', bb, ' + ', { llave: ['k · ', bb], nota: 'lo que sube', color: 'c-h' }],
      condicion: 'el otro factor no cambia. Si los dos cambian, se suman los dos aportes y el de k por el otro cambio.',
    },
    // Así se resuelve (fase 2): cuánto cambia el producto (s par) o el producto por partes (s impar), como «Ahora tú».
    resuelve: {
      generar(s) {
        const g = azar(s + 900), av = g.ent(12, 60), bv = g.ent(4, 15), k = g.ent(2, 9);
        const B = { v: 'c-i', t: String(bv) };
        if (s % 2 === 0) {
          const baja = s % 4 !== 0, nuevo = baja ? av - k : av + k, max = (av + k) * bv;
          const mayor = Math.max(av, nuevo), menor = Math.min(av, nuevo);
          return {
            enunciado: [`En ${av} × `, B, `, el primer factor ${baja ? 'disminuye' : 'aumenta'} en ${k}. ¿En cuánto cambia el producto?`],
            dibujo: { datos: tirasProd(av, bv, 0, max), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden cuánto cambia el producto, no cuánto vale el producto nuevo.' },
              { tipo: 'datos', texto: ['El segundo factor, ', B, `, no cambia. El primero pasa de ${av} a ${nuevo}.`] },
              { tipo: 'regla', texto: ['Multiplicar por ', B, ' es juntar grupos de ', B, `. Si el primer factor cambia en ${k}, cambian ${k} grupos de `, B, '; lo demás queda igual.'] },
              { tipo: 'cuentas', texto: [`El pedazo rojo son los ${k} grupos de `, B, baja ? ' que se quitan.' : ' que se agregan.'], ecuacion: [`${k} · ${bv} = `, { v: 'c-h', t: String(k * bv) }],
                dibujo: { datos: tirasProd(menor, bv, k, max), estado: { paso: 1 } } },
              { tipo: 'sentido', texto: 'Compruebo con los dos productos completos: su diferencia da lo mismo.', ecuacion: [`${mayor} · ${bv} − ${menor} · ${bv} = ${f(mayor * bv)} − ${f(menor * bv)} = ${f(mayor * bv - menor * bv)}`] },
            ],
            respuesta: [`El producto ${baja ? 'disminuye' : 'aumenta'} en `, { v: 'c-h', t: String(k * bv) }, '.'],
          };
        }
        const dec = Math.floor(av / 10) * 10, uni = av - dec, cerca = Math.round(av / 10) * 10;
        return {
          enunciado: [`¿Cuánto es ${av} × `, B, '? Hazlo por partes.'],
          dibujo: { datos: tirasProd(av, bv, 0, av * bv), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el producto, partiendo el primer factor en decenas y unidades.' },
            { tipo: 'datos', texto: [`${av} es ${dec} + ${uni}, y el otro factor es `, B, '.'] },
            { tipo: 'regla', texto: 'Multiplicar una suma es multiplicar cada parte y sumar los resultados: decenas por b más unidades por b.' },
            { tipo: 'cuentas', texto: uni ? 'El pedazo naranja son las decenas; el turquesa, las unidades.' : 'No hay unidades: la tira es un solo pedazo naranja, el de las decenas.',
              ecuacion: [`${dec} · ${bv} + ${uni} · ${bv} = ${f(dec * bv)} + ${f(uni * bv)} = `, { v: 'c-d', t: f(av * bv) }] },
            { tipo: 'sentido', texto: `Orden de magnitud: ${av} está cerca de ${cerca}, y ${cerca} · ${bv} = ${f(cerca * bv)}, cerca de ${f(av * bv)}. Cuadra.` },
          ],
          respuesta: [`${av} × ${bv} = `, { v: 'c-d', t: f(av * bv) }],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), av = g.ent(12, 60), bv = g.ent(4, 15), k = g.ent(2, 9);
        if (s % 2 === 0) return {
          pregunta: [`En ${av} × `, { v: 'c-i', t: String(bv) }, `, el primer factor ${s % 4 ? 'disminuye' : 'aumenta'} en ${k}. ¿En cuánto cambia el producto?`],
          opciones: opciones(k * bv, [
            { id: 'k', valor: k, error: 'AT-SUMA', siFuera: `Eso sería en una suma; cada unidad vale ${bv}.` },
            { id: 'suma', valor: k + bv, error: 'AT-SUMA', siFuera: `Se agregan o quitan ${k} grupos de ${bv}, no ${k} + ${bv}.` },
            { id: 'veces', valor: k * av * bv, error: 'AR7', siFuera: 'No se multiplica todo el producto; solo cambian unos grupos.' },
          ], x => `en ${f(x)}`),
          solucion: { texto: `${k} grupos de ${bv}.`, ecuacion: [`${k} · ${bv} = ${k * bv}`] },
        };
        const dec = Math.floor(av / 10) * 10;
        return {
          pregunta: `¿Cuánto es ${av} × ${bv}? Hazlo por partes.`,
          dibujo: { datos: tirasProd(av, bv, 0, av * bv), estado: {} },
          opciones: opciones(av * bv, [
            { id: 'sin-unidades', valor: dec * bv, error: 'AT-PARTES', siFuera: 'Falta el pedazo de las unidades.' },
            { id: 'unidades', valor: dec * bv + (av - dec), error: 'AT-PARTES', siFuera: `Las unidades también se multiplican por ${bv}.` },
            { id: 'suma', valor: av + bv, error: 'AT-SUMA', siFuera: 'Eso suma los factores.' },
          ], x => f(x)),
          solucion: { texto: 'Decenas por b más unidades por b.', ecuacion: [`${dec}·${bv} + ${av - dec}·${bv} = ${f(av * bv)}`] },
        };
      },
    },
  };

  // ---------- Idea 6: cuántas cifras tendrá (cantidad de cifras de un producto o cociente) ----------
  // Cambia: cuántas cifras tienen A y B. Permanece: la tabla con el menor y el mayor posible.
  // Progresa: extremos de A, de B y de A·B. Se reserva: las cifras del producto, entre dos valores.
  // Debe verse: con extremos se acota; no hay una sola respuesta.
  const tablaCotas = (m, n, con = 9) => {
    const loA = 10 ** (m - 1), hiA = 10 ** m - 1, loB = 10 ** (n - 1), hiB = 10 ** n - 1;
    const lo = loA * loB, hi = hiA * hiB;
    return { columnas: [{ t: '' }, { t: 'menor' }, { t: 'mayor' }, { t: 'cifras' }], filas: [
      [{ t: 'A', color: 'o' }, f(loA), f(hiA), { t: String(m), color: 'o' }],
      [{ t: 'B', color: 'i' }, f(loB), f(hiB), { t: String(n), color: 'i' }],
      [{ t: 'A·B', color: 'd', paso: con >= 1 ? 0 : 1 }, { t: f(lo), paso: con >= 1 ? 0 : 1 }, { t: f(hi), paso: con >= 1 ? 0 : 1 }, { t: `${cifras(lo)} o ${cifras(hi)}`, color: 'd', resalta: true, paso: con >= 1 ? 0 : 2 }],
    ], filasMax: 3, cabeza: true };
  };
  const cotas = {
    id: 'cifras-producto',
    titulo: 'Cuántas cifras tendrá',
    temas: ['Cantidad de cifras de un producto o cociente'],
    pieza: 'arit-tabla',
    // Lee (fase 2): para qué sirve estimar las cifras y qué es acotar; no dice cuántas cifras salen.
    lee: {
      tarjetas: [
        { titulo: 'Antes de multiplicar', texto: 'Si en la feria se venden 48 sacos de chuño de 52 kilos cada uno, ¿son cientos o miles de kilos? Saberlo sin hacer la cuenta ayuda a descartar respuestas.' },
        { titulo: 'Acotar', texto: 'Acotar es encerrar un número entre un menor y un mayor posibles. Si no conoces un número, pero sabes cuántas cifras tiene, ya puedes acotarlo.' },
        { titulo: 'Qué mirar', texto: 'La tabla multiplica el menor A por el menor B, y el mayor A por el mayor B. Cambia las cifras y compara cuántas cifras tienen esos dos productos.' },
      ],
    },
    juega: {
      consigna: 'Elige cuántas cifras tienen A y B. La tabla multiplica los menores y los mayores posibles.',
      voz: 'Compara las cifras del menor y del mayor producto.',
      controles: [
        { id: 'm', etiqueta: 'cifras de A', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'n', etiqueta: 'cifras de B', color: 'c-i', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaCotas(v.m, v.n), estado: {} }),
      lectura: v => [`A·B tiene ${v.m + v.n - 1} o ${v.m + v.n} cifras`],
      minimo: 3,
    },
    predice: {
      pregunta: ['A tiene ', { v: 'c-o', t: '5' }, ' cifras y B tiene ', { v: 'c-i', t: '3' }, '. ¿Cuántas cifras puede tener A × B?'],
      opciones: [
        { id: 'c', texto: '7 u 8', correcta: true },
        { id: 'suma', texto: 'siempre 8', error: 'AT-COTA', siFuera: '8 es el máximo; con 10 000 × 100 salen solo 7.' },
        { id: 'prod', texto: '15', error: 'AT-COTA', siFuera: 'Las cifras se suman, no se multiplican: 15 sería absurdo con números chicos.' },
        { id: 'menos', texto: 'siempre 7', error: 'AT-COTA', siFuera: '7 es el mínimo; con 99 999 × 999 salen 8.' },
      ],
      dibujo: { datos: tablaCotas(5, 3, 0), estado: { paso: 0 } },
      revelar: { datos: tablaCotas(5, 3, 0), estado: { paso: 2 } },
      coincide: 'Coincide: de 10 000 × 100 a 99 999 × 999.',
    },
    mira: {
      datos: tablaCotas(5, 3, 0),
      pasos: [
        { estado: { paso: 0, fila: [0, 1] }, texto: 'Cada número está entre el menor y el mayor de su cantidad de cifras.', ecuacion: [{ sup: ['10', '4'] }, ' ≤ A < ', { sup: ['10', '5'] }] },
        { estado: { paso: 1, fila: 2 }, texto: 'El producto queda entre el producto de los menores y el de los mayores.', ecuacion: [{ sup: ['10', '6'] }, ' ≤ A·B < ', { sup: ['10', '8'] }] },
        { estado: { paso: 2, fila: 2 }, texto: 'Por eso tiene 5 + 3 − 1 o 5 + 3 cifras.', ecuacion: ['7 ≤ cifras ≤ 8'] },
      ],
    },
    regla: {
      texto: 'Si A tiene m cifras y B tiene n, A · B tiene m + n − 1 o m + n. El cociente entero A ÷ B tiene m − n o m − n + 1.',
      ecuacion: ['m + n − 1 ≤ c ≤ m + n', '   ·   ', 'c: cifras de A·B'],
      condicion: 'A y B son enteros positivos y, en el cociente, A ≥ B. Para decidir entre los dos, se miran las primeras cifras.',
    },
    // Así se resuelve (fase 2): cifras del producto (s par, con la tabla) o del cociente (s impar), como «Ahora tú».
    resuelve: {
      generar(s) {
        const g = azar(s + 900), m = s % 2 === 0 ? g.ent(3, 5) : g.ent(4, 9), n = g.ent(2, m - 1);
        const loA = 10 ** (m - 1), hiA = 10 ** m - 1, loB = 10 ** (n - 1), hiB = 10 ** n - 1;
        const A = { v: 'c-o', t: 'A' }, Bv = { v: 'c-i', t: 'B' };
        const pide = que => ({ tipo: 'pide', texto: `Piden cuántas cifras puede tener ${que}.` });
        const datos = { tipo: 'datos', texto: [A, ` tiene ${m} cifras: va de ${f(loA)} a ${f(hiA)}. `, Bv, ` tiene ${n}: va de ${f(loB)} a ${f(hiB)}.`] };
        const cif = x => `${cifras(x)} ${cifras(x) === 1 ? 'cifra' : 'cifras'}`;
        if (s % 2 === 0) {
          const lo = loA * loB, hi = hiA * hiB;
          return {
            enunciado: [A, ' tiene ', { v: 'c-o', t: String(m) }, ' cifras y ', Bv, ' tiene ', { v: 'c-i', t: String(n) }, ' cifras. ¿Cuántas cifras puede tener A × B?'],
            dibujo: { datos: tablaCotas(m, n, 0), estado: { paso: 0 } },
            pasos: [
              pide('el producto A × B'),
              datos,
              { tipo: 'regla', texto: 'No conozco A ni B, así que acoto: el producto queda entre el de los dos menores y el de los dos mayores.' },
              { tipo: 'cuentas', texto: `El menor producto tiene ${cif(lo)} y el mayor, ${cif(hi)}.`, ecuacion: [`${f(lo)} ≤ A · B ≤ ${f(hi)}`], dibujo: { datos: tablaCotas(m, n, 0), estado: { paso: 2 } } },
              { tipo: 'sentido', texto: `Cuadra con la cuenta corta: ${m} + ${n} − 1 = ${m + n - 1} y ${m} + ${n} = ${m + n}.` },
            ],
            respuesta: [{ v: 'c-d', t: `${cifras(lo)} o ${cifras(hi)}` }, ' cifras'],
          };
        }
        const qlo = Math.floor(loA / hiB), qhi = Math.floor(hiA / loB);
        return {
          enunciado: [A, ' tiene ', { v: 'c-o', t: String(m) }, ' cifras y ', Bv, ' tiene ', { v: 'c-i', t: String(n) }, ' cifras. ¿Cuántas cifras puede tener el cociente entero de A entre B?'],
          pasos: [
            pide('el cociente entero de A entre B'),
            datos,
            { tipo: 'regla', texto: 'Acoto el cociente: es más chico con el menor A y el mayor B, y más grande con el mayor A y el menor B.' },
            { tipo: 'cuentas', texto: `El cociente entero más chico tiene ${cif(qlo)} y el más grande, ${cif(qhi)}.`,
              ecuacion: [`${f(loA)} ÷ ${f(hiB)} → ${f(qlo)}   ·   ${f(hiA)} ÷ ${f(loB)} → ${f(qhi)}`] },
            { tipo: 'sentido', texto: `Cuadra con la cuenta corta: ${m} − ${n} = ${m - n} y ${m} − ${n} + 1 = ${m - n + 1}.` },
          ],
          respuesta: [{ v: 'c-d', t: `${cifras(qlo)} o ${cifras(qhi)}` }, ' cifras'],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), m = s % 2 === 0 ? g.ent(3, 5) : g.ent(4, 9), n = g.ent(2, m - 1);   // con tabla, A de 5 cifras como máximo (que quepa a 360 px)
        if (s % 2 === 0) return {
          pregunta: ['A tiene ', { v: 'c-o', t: String(m) }, ' cifras y B tiene ', { v: 'c-i', t: String(n) }, '. ¿Cuántas cifras puede tener A × B?'],
          opciones: opciones(`${m + n - 1} o ${m + n}`, [
            { id: 'suma', valor: `siempre ${m + n}`, error: 'AT-COTA', siFuera: `${m + n} es el máximo; el mínimo es ${m + n - 1}.` },
            { id: 'prod', valor: `${m * n}`, error: 'AT-COTA', siFuera: 'Las cifras no se multiplican.' },
            { id: 'menos', valor: `${m + n - 2} o ${m + n - 1}`, error: 'AT-COTA', siFuera: `Prueba con los mayores: llegan a ${m + n} cifras.` },
          ]),
          solucion: { texto: 'Entre el producto de los menores y el de los mayores.', ecuacion: [`${m + n - 1} ≤ cifras ≤ ${m + n}`], dibujo: { datos: tablaCotas(m, n), estado: {} } },
        };
        return {
          pregunta: ['A tiene ', { v: 'c-o', t: String(m) }, ' cifras y B tiene ', { v: 'c-i', t: String(n) }, '. ¿Cuántas cifras puede tener el cociente entero de A entre B?'],
          opciones: opciones(`${m - n} o ${m - n + 1}`, [
            { id: 'resta', valor: `siempre ${m - n}`, error: 'AT-COTA', siFuera: `Con ${f(10 ** m - 1)} ÷ ${f(10 ** (n - 1))} salen ${m - n + 1} cifras.` },
            { id: 'div', valor: `${f(m / n, 1)}`, error: 'AT-COTA', siFuera: 'Las cifras no se dividen.' },
            { id: 'suma', valor: `${m + n - 1} o ${m + n}`, error: 'AT-SENTIDO', siFuera: 'Eso es para el producto, no para el cociente.' },
          ]),
          solucion: { texto: 'Se acota con el menor y el mayor posible.', ecuacion: [`${m - n} ≤ cifras ≤ ${m - n + 1}`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Escalera de a hasta z y su copia girada: un rectángulo de (z − a + 1) filas por (a + z) columnas. Ficha fija de 11.
  function escalerasAZ(a0, z0) {
    const k = z0 - a0 + 1, c = a0 + z0;
    const filas = Array.from({ length: k }, (_, i) => a0 + i);
    const tramos = filas.map((x, i) => ({ de: i * c + x, a: i * c + c - 1, color: 'h' }));
    return { bloques: [
      { filas, color: 'i', rotulo: `${a0} + … + ${z0}` },
      { n: k * c, columnas: c, color: 'i', tramos, rotulo: `${k} × ${c}` },
    ], altoMax: 150, ficha: 11, alt: `Escalera de ${a0} a ${z0}; al lado, dos escaleras iguales forman un rectángulo de ${k} por ${c}` };
  }
  // Suma de la escalera de a hasta z (la misma que lee la mesa) y la menor suma que dejan sus controles.
  const sumaAZ = v => (v.z - v.a + 1) * (v.a + v.z) / 2;
  let MIN_AZ = Infinity; for (let a0 = 1; a0 <= 4; a0++) for (let z0 = 5; z0 <= 10; z0++) MIN_AZ = Math.min(MIN_AZ, sumaAZ({ a: a0, z: z0 }));
  // Restos de la mesa de la recta: por defecto y por exceso (0 si la división es exacta).
  const rLab = v => v.a % v.d, reLab = v => (rLab(v) ? v.d - rLab(v) : 0);
  // Lo que sube el producto de la tira de arriba a la de abajo, y la mayor subida con k ≤ 9 y b ≤ 9.
  const sube = v => (v.a + v.k) * v.b - v.a * v.b;
  const MAX_SUBE = sube({ a: 10, b: 9, k: 9 });
  // Recta de 0 a 112 (fija) con los dos múltiplos vecinos; si la división es exacta, a cae sobre el múltiplo.
  function rectaLab(av, dv) {
    const qv = Math.floor(av / dv), rv = av - qv * dv;
    return {
      min: 0, max: 112, paso: dv, decimales: 0, variable: 'múltiplos de ' + dv, color: 'i', filas: 3,
      elementos: [
        { tipo: 'punto', x: qv * dv, color: 'i', fila: 0 },
        { tipo: 'punto', x: (qv + 1) * dv, color: 'i', fila: 0 },
        { tipo: 'punto', x: av, color: 'o', rotulo: `a = ${f(av)}`, fila: 1 },
        ...(rv ? [
          { tipo: 'distancia', a: qv * dv, b: av, color: 'h', rotulo: `r = ${rv}`, fila: 2 },
          { tipo: 'distancia', a: av, b: (qv + 1) * dv, color: 'h', rotulo: `rₑ = ${dv - rv}`, fila: 3 },
        ] : []),
      ],
    };
  }
  // Dos tiras a la misma escala (0 a 432 = 48 · 9): a · b arriba y (a + k) · b abajo, con el pedazo k · b en rojo.
  function dosProductos(av, bv, k) {
    const base = Math.min(av, av + k), extra = Math.abs(k) * bv;
    const abajo = [{ valor: base * bv, color: 'o', texto: `${base}·${bv}` }];
    if (k > 0) abajo.push({ valor: extra, color: 'h', texto: `+${k}·${bv}` });
    const arriba = [{ valor: base * bv, color: 'o', texto: `${base}·${bv}` }];
    if (k < 0) arriba.push({ valor: extra, color: 'h', hueco: true });
    return { max: 432, filas: 2, alt: `Tira de ${av} por ${bv} y tira de ${av + k} por ${bv}: difieren en ${Math.abs(k)} por ${bv}`, tiras: [
      { rotulo: `${av} × ${bv}`, color: 'o', fin: f(av * bv), tramos: arriba },
      { rotulo: `${av + k} × ${bv}`, color: 'o', fin: f((av + k) * bv), tramos: abajo },
    ] };
  }

  return {
    unidad: 'aritmetica.cuatro-operaciones',
    version: '0.3.0',
    // Un color fijo por magnitud (cabecera); lo comprueba cuatro-operaciones.test.js en la idea 1. La unidad declara
    // calidad: 2 recién en la fase 3, cuando sus siete ideas estén rehechas.
    colores: COLORES,
    estado: 'completa',
    // El motor de la escena va antes que las piezas (regla 1: el juego y la mesa de la idea 1 cuentan con él).
    requiere: ['/plantillas/cuatro-operaciones/motor.js', '/nucleo/kit/piezas/arit-puesto.js', '/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-tiras.js'],
    // Glosario: las palabras que esta unidad estrena en el curso (docs/teoria.md §4d). La idea 1 estrena «sumandos» y
    // «llevada», cada una con su aproximación (simple) y tres ejemplos. «llevada» va local mientras Razonamiento numérico
    // la siga definiendo (la propuesta, pregunta 8: se estrena aquí y allá se marca «se explica en…»; ese cambio es de la
    // integración, fuera del alcance de esta fase). «acotar», «cociente», «resto», «potencia» y «cifra oculta» son de
    // Numeración: aquí no se definen (el «acotar» de abajo es de la idea vieja de cifras de un producto; sale en la fase 3).
    glosario: [
      // «sumandos» va en plural a propósito: «sumando» suelto es el gerundio en razones y estadística.
      { termino: 'sumandos', def: 'Los números que se juntan en una suma.',
        simple: 'Cada pedido que se junta: el de la mañana y el de la tarde.',
        ver: ['llevada', 'sumatoria'],
        ejemplos: ['En 26 + 13 hay dos: 26 y 13.', 'En 3 + 4 + 5 = 12 son tres: 3, 4 y 5.', 'En 52₍₇₎ + 14₍₇₎ los dos están en base 7.'] },
      { termino: 'llevada', local: true, formas: ['llevada', 'llevadas'],
        def: 'Lo que pasa a la columna de la izquierda cuando una columna junta la base o más.',
        simple: 'La bolsita llena que sube a la columna de al lado.',
        ver: ['sumandos', 'base de numeración'],
        ejemplos: ['9 + 6 = 15: se anota 5 y la llevada es 1.', 'En base 4, 3 + 2 = 5 = 1 × 4 + 1: se lleva 1.', '9 + 8 + 7 = 24: la llevada es 2.'] },
      { termino: 'sumatoria', def: 'Suma de muchos términos que siguen una regla, como 1 + 2 + … + n.',
        ejemplo: '1 + 2 + … + 20 = 20 · 21 / 2 = 210.', ver: ['sumandos', 'consecutivo'] },
      { termino: 'consecutivo', def: 'Números enteros que van uno detrás del otro, de 1 en 1, sin saltarse ninguno.',
        formas: ['consecutivos', 'consecutivo', 'consecutivas'], ejemplo: '7, 8 y 9 lo son; 7, 9 y 11 no.' },
      { termino: 'complemento aritmético', simbolo: 'CA', def: 'Lo que le falta a un número para llegar a 10, 100, 1000…, según cuántas cifras tiene.',
        ejemplo: 'CA(3 400) = 10 000 − 3 400 = 6 600.', ver: ['potencia'] },
      { termino: 'dividendo', simbolo: 'a', def: 'El número que se reparte en una división: el que va antes del signo ÷.',
        ejemplo: 'En 47 ÷ 6, es 47.', ver: ['divisor'] },
      { termino: 'divisor', simbolo: 'd', def: 'El número entre el que se divide. Si no sobra nada, se dice que divide al otro.',
        ejemplo: 'En 47 ÷ 6, es 6: 47 = 6 · 7 + 5.', ver: ['dividendo'] },
      { termino: 'cociente entero', simbolo: 'q', def: 'Cuántas veces cabe completo el divisor en el dividendo, sin contar lo que sobra.',
        formas: ['cociente entero', 'cocientes enteros'], ejemplo: '47 ÷ 6: cabe 7 veces, porque 6 · 7 = 42 ≤ 47.', ver: ['resto', 'divisor'] },
      { termino: 'resto por defecto', simbolo: 'r', def: 'Lo que pasa el dividendo del múltiplo del divisor que queda justo debajo.',
        formas: ['resto por defecto', 'restos por defecto', 'por defecto'], ejemplo: '47 = 6 · 7 + 5: es 5.', ver: ['resto por exceso'] },
      { termino: 'resto por exceso', simbolo: 'rₑ', def: 'Lo que le falta al dividendo para llegar al múltiplo del divisor que queda justo encima.',
        formas: ['resto por exceso', 'restos por exceso', 'por exceso'], ejemplo: '47 = 6 · 8 − 1: es 1, y 5 + 1 = 6.', ver: ['resto por defecto'] },
      { termino: 'división exacta', def: 'La que no deja nada sobrante: el dividendo es un múltiplo del divisor.',
        formas: ['división es exacta', 'división exacta', 'divisiones exactas'], ejemplo: '48 ÷ 6 = 8 y no sobra nada.', ver: ['divisor'] },
      // «préstamo» vuelve en la fase 3, con la idea `prestamo` (hoy ninguna idea lo usa).
      { termino: 'acotar', def: 'Encerrar un número desconocido entre un valor menor y otro mayor que sí se conocen.',
        formas: ['acotar', 'acoto', 'acotarlo', 'acota'], ejemplo: 'Si A tiene 3 cifras, 100 ≤ A ≤ 999.' },
      { termino: 'propiedad distributiva', def: 'Multiplicar una suma da lo mismo que multiplicar cada parte y sumar los resultados.',
        ejemplo: '24 · 7 = 20 · 7 + 4 · 7 = 140 + 28 = 168.' },
    ],
    // Laboratorio: juego libre, sin preguntas. «Escaleras que no empiezan en 1» generaliza la idea 1 (de a hasta z);
    // «Restos con números grandes» abre a hasta 100 y d hasta 12, con divisiones exactas; «Dos productos» pone a · b
    // y (a + k) · b en la misma escala, con k negativo también.
    laboratorio: [
      mesaBases,
      {
        id: 'escaleras-a-z', titulo: 'Escaleras que no empiezan en 1', pieza: 'arit-fichas',
        consigna: 'La escalera va de a hasta z. Dos escaleras iguales forman un rectángulo. Tira de su borde para cambiar z.',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 3, decimales: 0 },
          { id: 'z', etiqueta: 'z', color: 'c-i', min: 5, max: 10, paso: 1, inicio: 7, decimales: 0 },
        ],
        dibujo: v => ({ datos: escalerasAZ(v.a, v.z), estado: {} }),
        lectura: v => { const k = v.z - v.a + 1; return [`${v.a} + … + ${v.z} = ${k} · ${v.a + v.z} / 2 = `, { v: 'c-d', t: String(sumaAZ(v)) }]; },
        invitaciones: [
          { texto: 'Haz que la escalera sume justo 42.',
            logrado: v => sumaAZ(v) === 42,
            bien: '3 + … + 9: siete sumandos, (3 + 9) · 7 / 2 = 42.' },
          { texto: 'Busca el rectángulo más parecido a un cuadrado.',
            logrado: v => (v.a + v.z) - (v.z - v.a + 1) === 1,
            bien: 'Desde 1, las columnas son una más que las filas: n por n + 1.' },
          { texto: 'Busca la escalera con la suma más chica.',
            logrado: v => sumaAZ(v) === MIN_AZ,
            bien: '4 + 5 = 9: dos sumandos, medio rectángulo de 2 por 9.' },
          { texto: 'Guarda dos escaleras distintas que sumen 15.',
            logrado: (v, guardados) => sumaAZ(v) === 15 && guardados.some(g => (g.a !== v.a || g.z !== v.z) && sumaAZ(g) === 15),
            bien: '5 × 6 y 3 × 10: dos rectángulos de 30, la misma mitad.' },
        ],
        arrastres: [{ id: 'borde', etiqueta: 'borde derecho del rectángulo (z)', color: 'c-i',
          donde: v => bordeDerecho(escalerasAZ(v.a, v.z)),
          // Ancho total: (z + (a + z)) · 11 + 18, de ahí z.
          mover: (pt, v) => ({ z: ((anchoTotalEn(escalerasAZ(v.a, v.z), pt.x) - 18) / 11 - v.a) / 2 }) }],
      },
      {
        id: 'restos-grandes', titulo: 'Restos con números grandes', pieza: 'recta',
        consigna: 'a de 0 a 100 y d de 2 a 12. Arrastra a: cuando cae en un múltiplo, la división es exacta.',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-o', min: 0, max: 100, paso: 1, inicio: 47, decimales: 0 },
          { id: 'd', etiqueta: 'd', color: 'c-i', min: 2, max: 12, paso: 1, inicio: 6, decimales: 0 },
        ],
        dibujo: v => ({ datos: rectaLab(v.a, v.d), estado: { corte: 1 } }),
        lectura: v => {
          const qv = Math.floor(v.a / v.d), rv = v.a % v.d;
          return rv ? [`${v.a} ÷ ${v.d}: r = ${rv}, `, re, ` = ${v.d - rv} (suman ${v.d})`] : [`${v.a} ÷ ${v.d} es exacta: ${v.a} = ${v.d} · ${qv}`];
        },
        // Retos: rLab y reLab son los mismos restos que mide la recta (v.a % v.d y lo que falta).
        invitaciones: [
          { texto: 'Haz que la división sea exacta con a mayor que 90.',
            logrado: v => v.a > 90 && rLab(v) === 0,
            bien: 'a cae sobre un múltiplo: no sobra ni falta nada.' },
          { texto: 'Haz que los dos restos sean iguales.',
            logrado: v => rLab(v) > 0 && rLab(v) === reLab(v),
            bien: 'Solo pasa con divisor par: cada resto es la mitad de d.' },
          { texto: 'Con d = 12, consigue el resto por exceso más grande posible.',
            logrado: v => v.d === 12 && rLab(v) > 0 && reLab(v) === v.d - 1,
            bien: 'rₑ = 11 cuando r = 1: los dos restos siempre suman 12.' },
          { texto: 'Guarda dos casos con el mismo d y los restos intercambiados.',
            logrado: (v, guardados) => rLab(v) > 0 && guardados.some(g => g.d === v.d && rLab(g) > 0 && rLab(g) !== rLab(v) && rLab(g) === reLab(v)),
            bien: 'Lo que a uno le sobra, al otro le falta: posiciones en espejo.' },
        ],
        arrastres: [{ id: 'a', etiqueta: 'el dividendo a en la recta', color: 'c-o',
          donde: v => { const g = RECTA().geometria(rectaLab(v.a, v.d)); return { x: g.x(v.a), y: g.filaY(1) }; },
          mover: (pt, v) => ({ a: inversa(RECTA().geometria(rectaLab(v.a, v.d)).x, 0, 112)(pt.x) }) }],
      },
      {
        id: 'dos-productos', titulo: 'Dos productos', pieza: 'arit-tiras',
        consigna: 'Arriba a · b; abajo (a + k) · b, con la misma escala. Arrastra el final de cada tira.',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-o', min: 10, max: 39, paso: 1, inicio: 24, decimales: 0 },
          { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 9, paso: 1, inicio: 7, decimales: 0 },
          { id: 'k', etiqueta: 'k', color: 'c-h', min: -9, max: 9, paso: 1, inicio: 3, decimales: 0 },
        ],
        dibujo: v => ({ datos: dosProductos(v.a, v.b, v.k), estado: {} }),
        lectura: v => [`${v.a + v.k} · ${v.b} − ${v.a} · ${v.b} = ${v.k} · ${v.b} = `, { v: 'c-h', t: f(sube(v)) }],
        invitaciones: [
          { texto: 'Haz que el producto baje justo 24.',
            logrado: v => sube(v) === -24,
            bien: 'Bajar 24 es quitar grupos de b: 4 de 6, o 3 de 8.' },
          { texto: 'Haz que las dos tiras midan lo mismo.',
            logrado: v => sube(v) === 0,
            bien: 'Con k = 0 no se agrega ni se quita ningún grupo.' },
          { texto: 'Consigue la mayor subida que dejan los controles.',
            logrado: v => sube(v) === MAX_SUBE,
            bien: 'Nueve grupos de 9: 81, sin importar cuánto vale a.' },
          { texto: 'Guarda dos casos con distinto a y la misma subida.',
            logrado: (v, guardados) => sube(v) !== 0 && guardados.some(g => g.a !== v.a && sube(g) === sube(v)),
            bien: 'Cambió a y la subida no: solo cuentan k y b.' },
        ],
        arrastres: [
          { id: 'fin-a', etiqueta: 'final de la tira de arriba (a)', color: 'c-o',
            donde: v => { const g = TIRAS().geometria(dosProductos(v.a, v.b, v.k)); return { x: g.x(v.a * v.b), y: g.tiraY(0) }; },
            mover: (pt, v) => ({ a: TIRAS().geometria(dosProductos(v.a, v.b, v.k)).deX(pt.x) / v.b }) },
          { id: 'fin-k', etiqueta: 'final de la tira de abajo (k)', color: 'c-h',
            donde: v => { const g = TIRAS().geometria(dosProductos(v.a, v.b, v.k)); return { x: g.x((v.a + v.k) * v.b), y: g.tiraY(1) }; },
            mover: (pt, v) => ({ k: TIRAS().geometria(dosProductos(v.a, v.b, v.k)).deX(pt.x) / v.b - v.a }) },
        ],
      },
    ],
    historia: {
      texto: 'Los papiros matemáticos egipcios multiplican sin nuestra tabla: duplican y suman algunos duplicados. Para 13 × 7 bastaba sumar 8 × 7, 4 × 7 y 1 × 7. Dividir era buscar qué múltiplos formaban una cantidad. Enseña que una operación y su procedimiento no son lo mismo: lo que se conserva es la propiedad de repartir.',
      pregunta: '¿Cómo multiplicarías solo duplicando y sumando?',
      fuente: { titulo: 'O’Connor y Robertson, Egyptian Papyri — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Egyptian_papyri/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'juego-otras-bases': ['otras-bases'],
      'escaleras-a-z': ['sumatorias'],
      'restos-grandes': ['defecto-exceso'],
      'dos-productos': ['multiplicar-partes'],
    },
    // Orden de la propuesta aprobada (docs/etapa4/propuesta-aritmetica.md §1): 1 otras-bases (la llevada), 2 prestamo,
    // 3 complemento, 4 cifras-ocultas, 5 multiplicar-partes, 6 defecto-exceso, 7 cifras-producto. Fase 2: la idea 1 está
    // completa; las demás siguen como estaban, en ese orden. `prestamo` y `cifras-ocultas` (nuevas) entran en la fase 3:
    // el validador (nucleo/teoria.js) admite hasta 6 ideas y la unidad tendrá 7 (8 mientras `sumatorias` no se mude a
    // Sucesiones y series con Avance.migrar). `sumatorias` va al final, tal cual, hasta esa migración.
    ideas: [otrasBases, complemento, multiplicacion, division, cotas, sumatorias],
  };
});
