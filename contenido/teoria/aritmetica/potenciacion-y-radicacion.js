/*
 * Teoría de «Potenciación y radicación» (aritmetica.potenciacion-y-radicacion). Molde: docs/teoria.md; forma de porcentajes.js.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 17) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Los AT-* son hipótesis nuevas (no hay códigos de esta unidad en docs/investigacion/).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver un cuadrado perfecto como fichas que forman un cuadrado, y la raíz entera como el cuadrado más grande que cabe.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: decide si un número es cuadrado o cubo perfecto por sus exponentes, descarta con la última cifra
 *     sin confundir descartar con confirmar, halla raíz entera y residuo, y acota una raíz por décimas y centésimas.
 *   Orden de atención: 1.º el cuadrado de fichas o la tabla de exponentes · 2.º lo que sobra y lo que falta · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «si 2 021 termina en 1, ¿por qué no es un cuadrado?».
 * Colores (regla 4): N naranja (c-o), la raíz q turquesa (c-i), el residuo rojo (c-h), el cuadrado siguiente verde (c-d).
 * Ronda 2 (14 nov 2026): gesto directo en las ideas 2 a 4 (la fila de la última cifra, el hueco de la ficha siguiente y
 * el tramo de cuadrados); la idea 1 es una tabla de exponentes que se eligen, sin lugar que agarrar. Llaves y laboratorio.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/potenciacion arma el cubo de cubitos y su residuo de la mesa 3D (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/potenciacion/motor.js'))
    : fabrica(root.Kit, root.MotorPotenciacion);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MP) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const N = { v: 'c-o', t: 'N' }, q = { v: 'c-i', t: 'q' }, r = { v: 'c-h', t: 'r' };
  const q1 = { par: [q, ' + 1'] };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const rr = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.de = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
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
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const pot = (p, e) => (e === 1 ? String(p) : `${p}${String(e).split('').map(c => SUP[c]).join('')}`);
  const escribir = fs => fs.filter(([, e]) => e > 0).map(([p, e]) => pot(p, e)).join(' · ') || '1';
  const isqrt = n => { let x = Math.floor(Math.sqrt(n)); while (x * x > n) x--; while ((x + 1) * (x + 1) <= n) x++; return x; };
  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de la pieza; el lector ajusta al paso y al rango.
  const TABLA = () => Kit.piezas['arit-tabla'], FICHAS = () => Kit.piezas['arit-fichas'], RECTA = () => Kit.piezas.recta;
  const inversa = (escala, lo, hi) => px => lo + (px - escala(lo)) * (hi - lo) / (escala(hi) - escala(lo));
  const icbrt = n => { let x = Math.floor(Math.cbrt(n)); while (x * x * x > n) x--; while ((x + 1) ** 3 <= n) x++; return x; };

  // ---------- Idea 1: cuadrado o cubo perfecto según los exponentes ----------
  // Cambia: los exponentes de 2, 3 y 5. Permanece: la tabla primo → exponente → ¿par? → ¿múltiplo de 3?
  // Progresa: un exponente impar → todos pares. Se reserva: el factor mínimo que completa. Debe verse: basta un exponente impar.
  const PR = [2, 3, 5];
  const tablaExp = (es, marca = {}) => ({
    columnas: [{ t: 'primo' }, { t: 'exponente', color: 'o' }, { t: '¿par?' }, { t: '¿de a 3?' }],
    filas: PR.map((p, i) => [String(p), { t: String(es[i]), color: 'o' },
      { t: es[i] % 2 === 0 ? 'sí' : 'no', color: es[i] % 2 ? 'h' : undefined, resalta: marca.par && es[i] % 2 === 1 },
      { t: es[i] % 3 === 0 ? 'sí' : 'no', color: es[i] % 3 ? 'h' : undefined, resalta: marca.cubo && es[i] % 3 !== 0 }]),
    filasMax: 3, cabeza: true,
  });
  const valor = es => PR.reduce((acc, p, i) => acc * p ** es[i], 1);
  const clasif = es => { const c = es.every(e => e % 2 === 0), u = es.every(e => e % 3 === 0); return c && u ? 'cuadrado y cubo' : c ? 'cuadrado perfecto' : u ? 'cubo perfecto' : 'ni cuadrado ni cubo'; };
  const perfectos = {
    id: 'perfectos',
    titulo: 'Los exponentes deciden',
    temas: ['Cuadrados y cubos perfectos'],
    pieza: 'arit-tabla',
    // Lee (fase 2): vocabulario y contexto; no dice qué factor falta (eso lo descubre en Predice).
    lee: {
      tarjetas: [
        { titulo: 'Una caja de la feria', texto: 'En la feria de Juliaca, una caja trae 3 filas de 3 bolsas de chuño, en 3 pisos: 3 · 3 · 3 = 27 bolsas. Se escribe 3³: el 3 pequeño de arriba es el exponente y dice cuántas veces se multiplica.',
          ecuacion: ['3 · 3 · 3 = ', { sup: ['3', '3'] }, ' = 27'] },
        { titulo: 'Cuadrados y cubos', texto: '49 es un cuadrado perfecto porque es 7 · 7: con 49 fichas se arma un cuadrado de 7 por 7. 27 es un cubo perfecto porque es 3 · 3 · 3, como la caja de chuño.' },
        { titulo: 'Partir en primos', texto: 'Todo entero mayor que 1 se escribe como producto de primos, y cada primo lleva su exponente. Esa es su factorización en primos.',
          ecuacion: ['360 = ', { sup: ['2', '3'] }, ' · ', { sup: ['3', '2'] }, ' · 5'] },
        { titulo: 'Qué mirar', texto: 'En el juego eliges los exponentes de 2, de 3 y de 5. Mira las columnas «¿par?» y «¿de a 3?» de la tabla, y lo que dice la lectura cuando cambias uno solo.' },
      ],
    },
    juega: {
      consigna: 'Arma un número con sus exponentes de 2, 3 y 5. La tabla dice si cada exponente es par o múltiplo de 3.',
      voz: 'Busca un número que sea cuadrado y cubo a la vez.',
      controles: [
        { id: 'a', etiqueta: 'exponente de 2', color: 'c-o', min: 0, max: 6, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'exponente de 3', color: 'c-o', min: 0, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'c', etiqueta: 'exponente de 5', color: 'c-o', min: 0, max: 3, paso: 1, inicio: 0, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaExp([v.a, v.b, v.c]), estado: {} }),
      lectura: v => { const es = [v.a, v.b, v.c]; return [N, ` = ${escribir(PR.map((p, i) => [p, es[i]]))} = ${f(valor(es), 0)}: ${clasif(es)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Por qué número mínimo hay que multiplicar ', { v: 'c-o', t: '72' }, ' para obtener un cuadrado perfecto?'],
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'tres', texto: '3', error: 'AT-EXPONENTE', siFuera: '3 sería cierto si el exponente de 3 fuera impar. En 72 = 2³ · 3² el impar es el del 2.' },
        { id: 'cuatro', texto: '4', error: 'AT-EXPONENTE', siFuera: '4 = 2² deja el exponente de 2 en 5, todavía impar.' },
        { id: 'raiz', texto: '72', error: 'AT-EXPONENTE', siFuera: '72 · 72 sí es cuadrado, pero no es el mínimo.' },
      ],
      dibujo: { datos: { columnas: [{ t: 'primo' }, { t: 'exponente', color: 'o' }], filas: [['2', '?'], ['3', '?'], ['5', '?']], filasMax: 3, cabeza: true }, estado: {} },
      revelar: { datos: tablaExp([3, 2, 0], { par: true }), estado: {} },
      coincide: 'Coincide: 72 · 2 = 144 = 2⁴ · 3² = 12².',
    },
    mira: {
      datos: tablaExp([3, 2, 0], { par: true }),
      pasos: [
        { estado: { fila: 0 }, texto: '72 = 2³ · 3²: el exponente de 2 es impar.', ecuacion: ['72 = ', { sup: ['2', '3'] }, ' · ', { sup: ['3', '2'] }] },
        { estado: { fila: 1 }, texto: 'El de 3 ya es par: no hace falta tocarlo.', ecuacion: [{ sup: ['3', '2'] }, ' = ', { sup: ['3', '2'] }] },
        { estado: { fila: 0 }, texto: 'Un 2 más deja todos pares: 144 es 12 al cuadrado.', ecuacion: ['72 · 2 = ', { sup: ['2', '4'] }, ' · ', { sup: ['3', '2'] }, ' = ', { sup: ['12', '2'] }] },
      ],
    },
    regla: {
      texto: 'Un entero positivo es cuadrado perfecto si todos los exponentes de sus primos son pares, y cubo perfecto si todos son múltiplos de 3.',
      ecuacion: [N, ' = ', { llave: [{ sup: ['p', '2a'] }, ' · ', { sup: ['s', '2b'] }], nota: 'exponentes pares' }, ' = ', { sup: [{ par: [{ sup: ['p', 'a'] }, ' · ', { sup: ['s', 'b'] }] }, '2'] }],
      condicion: 'se mira la factorización en primos completa; un solo exponente impar basta para que no sea cuadrado.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú», con otras semillas, resuelto paso a paso.
    resuelve: {
      generar(s) {
        const rr = azar(s + 900), cubo = s % 3 === 2;
        let es;
        do { es = [rr.ent(0, 5), rr.ent(0, 4), rr.ent(0, 2)]; } while (valor(es) < 6 || (cubo ? es.every(e => e % 3 === 0) : es.every(e => e % 2 === 0)));
        const k = cubo ? 3 : 2, nombre = cubo ? 'cubo' : 'cuadrado';
        const sube = es.map(e => (k - e % k) % k), nuevos = es.map((e, i) => e + sube[i]);
        const falta = PR.reduce((acc, p, i) => acc * p ** sube[i], 1), Nv = valor(es), lado = PR.reduce((acc, p, i) => acc * p ** (nuevos[i] / k), 1);
        const faltan = PR.map((p, i) => [p, sube[i]]).filter(([, e]) => e > 0);
        const dice = faltan.map(([p, e]) => `al ${p} le ${e === 1 ? 'falta' : 'faltan'} ${e}`).join(', ');
        return {
          enunciado: ['¿Por qué número mínimo hay que multiplicar ', { v: 'c-o', t: f(Nv, 0) }, ` para obtener un ${nombre} perfecto?`],
          dibujo: { datos: { columnas: [{ t: 'primo' }, { t: 'exponente', color: 'o' }], filas: PR.map(p => [String(p), '?']), filasMax: 3, cabeza: true }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden el factor más chico que convierte a ', { v: 'c-o', t: f(Nv, 0) }, ` en un ${nombre} perfecto.`] },
            { tipo: 'datos', texto: 'Primero lo parto en primos y anoto el exponente de cada uno.', ecuacion: [{ v: 'c-o', t: f(Nv, 0) }, ` = ${escribir(PR.map((p, i) => [p, es[i]]))}`],
              dibujo: { datos: tablaExp(es), estado: {} } },
            { tipo: 'regla', texto: cubo ? 'Un cubo perfecto necesita que cada exponente sea múltiplo de 3. Subo cada exponente hasta el múltiplo de 3 más cercano hacia arriba.'
              : 'Un cuadrado perfecto necesita que cada exponente sea par. Solo toco los exponentes impares, y les sumo 1.' },
            { tipo: 'cuentas', texto: `Miro la tabla: ${dice}. Multiplico solo esos primos.`,
              ecuacion: (escribir(faltan) === String(falta) ? [] : [`${escribir(faltan)} = ${f(falta, 0)}`, '   ·   ']).concat([`${f(Nv, 0)} · ${f(falta, 0)} = ${f(Nv * falta, 0)}`]),
              dibujo: { datos: tablaExp(es, cubo ? { cubo: true } : { par: true }), estado: {} } },
            { tipo: 'sentido', texto: `Compruebo: ${f(Nv * falta, 0)} = ${escribir(PR.map((p, i) => [p, nuevos[i]]))} = ${pot(lado, k)}. Con un factor menor, algún exponente quedaría sin completar.` },
          ],
          respuesta: `Hay que multiplicar por ${f(falta, 0)}.`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const rr = azar(s), cubo = s % 3 === 2;
        let es;
        do { es = [rr.ent(0, 5), rr.ent(0, 4), rr.ent(0, 2)]; } while (valor(es) < 6 || (cubo ? es.every(e => e % 3 === 0) : es.every(e => e % 2 === 0)));
        const k = cubo ? 3 : 2;
        const falta = PR.reduce((acc, p, i) => acc * p ** ((k - es[i] % k) % k), 1);
        const Nv = valor(es);
        return {
          pregunta: ['¿Por qué número mínimo hay que multiplicar ', { v: 'c-o', t: f(Nv, 0) }, ` para obtener un ${cubo ? 'cubo' : 'cuadrado'} perfecto?`],
          opciones: opciones(falta, [
            { id: 'primos', valor: PR.filter((p, i) => es[i] % k).reduce((a2, p) => a2 * p, 1), error: 'AT-EXPONENTE', siFuera: 'Eso agrega un factor por primo; a veces falta más de uno para llegar al múltiplo.' },
            { id: 'todo', valor: PR.filter((p, i) => es[i] > 0).reduce((a2, p) => a2 * p, 1), error: 'AT-EXPONENTE', siFuera: 'No hay que tocar los primos que ya tienen el exponente justo.' },
            { id: 'mismo', valor: Nv, error: 'AT-EXPONENTE', siFuera: `Multiplicar por ${f(Nv, 0)} funciona a veces, pero no es lo mínimo.` },
            { id: 'doble', valor: falta * 2, error: 'AT-EXPONENTE', siFuera: 'Ese factor de más vuelve a dejar un exponente que no sirve.' },
            { id: 'cuad', valor: falta * falta, error: 'AT-EXPONENTE', siFuera: 'Eso eleva lo que falta; sobran factores.' },
          ], n => f(n, 0)),
          solucion: { texto: `Factorizado: ${escribir(PR.map((p, i) => [p, es[i]]))}. Se completa cada exponente.`, ecuacion: [`${f(Nv, 0)} · ${falta} = ${f(Nv * falta, 0)} = ${escribir(PR.map((p, i) => [p, es[i] + (k - es[i] % k) % k]))}`], dibujo: { datos: tablaExp(es, cubo ? { cubo: true } : { par: true }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: un criterio de exclusión descarta, no confirma ----------
  // Cambia: n, y con él la última cifra de n². Permanece: la tabla de las diez últimas cifras.
  // Progresa: las cifras que aparecen → las que nunca aparecen (2, 3, 7, 8). Se reserva: 2 021, que pasa el filtro y no es cuadrado.
  // Debe verse: la columna de n² nunca tiene 2, 3, 7 ni 8.
  const tablaCifras = n => ({
    columnas: [{ t: 'n termina en', color: 'i' }, { t: 'n² termina en', color: 'o' }],
    filas: Array.from({ length: 10 }, (_, k) => [{ t: String(k), color: 'i' }, { t: String((k * k) % 10), color: 'o', resalta: n !== null && k === n % 10 }]),
    filasMax: 10,
  });
  const exclusion = {
    id: 'exclusion',
    titulo: 'Descartar no es confirmar',
    temas: ['Criterios de inclusión y exclusión'],
    pieza: 'arit-tabla',
    // Lee: vocabulario (última cifra, criterio) sin decir si pasar el filtro confirma (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'La cifra de las unidades', texto: 'La última cifra de un número es la de las unidades: en 2 021 es 1, y en 169 es 9. Muchos atajos de examen miran solo esa cifra, sin hacer toda la cuenta.' },
        { titulo: 'Pruebas rápidas', texto: 'Un criterio de exclusión es una prueba rápida que mira un rasgo del número, como su última cifra, para sacar de la lista a los que no pueden ser cuadrados perfectos.' },
        { titulo: 'Qué mirar', texto: 'En el juego eliges n y la tabla marca en qué cifra termina n². Recorre las diez filas: anota qué cifras salen en la columna de la derecha y cuáles no salen nunca.' },
      ],
    },
    juega: {
      consigna: 'Elige n. Mira en qué cifra termina n². Busca las cifras en que nunca termina un cuadrado.',
      voz: 'Revisa la columna de la derecha completa antes de concluir.',
      controles: [{ id: 'n', etiqueta: 'n', color: 'c-i', min: 1, max: 39, paso: 1, inicio: 13, unidad: '', decimales: 0 }],
      dibujo: v => ({ datos: tablaCifras(v.n), estado: { fila: v.n % 10 } }),
      lectura: v => [`${v.n}² = ${v.n * v.n}: termina en ${(v.n * v.n) % 10}`],
      minimo: 4,
      // Arrastra la marca por las filas: cambia la última cifra de n y deja la decena (la decena va con − y +).
      arrastres: [
        { id: 'ultima-cifra', etiqueta: 'última cifra de n', color: 'c-i',
          donde: v => TABLA().geometria(tablaCifras(v.n)).celda(v.n % 10, 0),
          mover: (pt, v) => {
            const g = TABLA().geometria(tablaCifras(v.n));
            const fila = Math.min(9, Math.max(0, Math.floor((pt.y - g.filaY(0)) / g.altoFila)));
            return { n: 10 * Math.floor(v.n / 10) + fila };
          } },
      ],
    },
    predice: {
      pregunta: 'El número 2 021 termina en 1, como 1, 81 o 121. ¿Es un cuadrado perfecto?',
      opciones: [
        { id: 'c', texto: 'No: queda entre 44² y 45²', correcta: true },
        { id: 'si', texto: 'Sí, porque termina en 1', error: 'AT-INCLUSION', siFuera: 'Terminar en 1 solo dice que no se descarta. Hay que comprobar con la raíz.' },
        { id: 'impar', texto: 'No, porque es impar', error: 'AT-IMPAR', siFuera: 'Hay cuadrados impares, como 81 o 121: ser impar no descarta.' },
      ],
      dibujo: { datos: tablaCifras(null), estado: { fila: 1 } },
      revelar: { datos: { columnas: [{ t: 'n' }, { t: 'n²', color: 'o' }], filas: [['44', '1 936'], [{ t: '?' }, { t: '2 021', color: 'h', resalta: true }], ['45', '2 025']], filasMax: 3 }, estado: {} },
      coincide: 'Coincide: 44² = 1 936 y 45² = 2 025; no hay entero entre 44 y 45.',
    },
    mira: {
      datos: tablaCifras(null),
      pasos: [
        { estado: {}, texto: 'La última cifra de n² solo depende de la última de n.', ecuacion: ['13² = 169', '   ·   ', '23² = 529'] },
        { estado: { fila: [2, 3, 7, 8] }, texto: 'Ningún cuadrado termina en 2, 3, 7 u 8: esos se descartan.', ecuacion: ['termina en 2, 3, 7 u 8   ⇒   no es cuadrado'] },
        { estado: { fila: [1, 9] }, texto: 'Terminar en 1 no asegura nada: también 2 021 termina en 1.', ecuacion: [{ sup: ['44', '2'] }, ' = 1 936 < 2 021 < 2 025 = ', { sup: ['45', '2'] }] },
      ],
    },
    regla: {
      texto: 'Un criterio de exclusión solo descarta: si falla, no es cuadrado. Si se cumple, todavía hay que comprobar con la raíz o la factorización.',
      ecuacion: ['termina en 2, 3, 7 u 8   ⇒   ', N, ' no es cuadrado'],
      condicion: 'la condición es necesaria, no suficiente. Los cubos pueden terminar en cualquier cifra.',
    },
    resuelve: {
      generar(s) {
        const rr = azar(s + 900), k = rr.ent(12, 60);
        const Nv = k * k + rr.de([2, 6, 4 * k - 1]);
        const c = isqrt(Nv), cifra = Nv % 10, descarta = [2, 3, 7, 8].includes(cifra);
        const vecinos = `${c}² = ${f(c * c, 0)} < ${f(Nv, 0)} < ${f((c + 1) ** 2, 0)} = ${c + 1}²`;
        return {
          enunciado: ['¿Es ', { v: 'c-o', t: f(Nv, 0) }, ' un cuadrado perfecto?'],
          dibujo: { datos: tablaCifras(null), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden decidir si ', { v: 'c-o', t: f(Nv, 0) }, ' es un entero multiplicado por sí mismo.'] },
            { tipo: 'datos', texto: `El número termina en ${cifra}. Busco esa cifra en la columna de la derecha de la tabla.` },
            { tipo: 'regla', texto: 'Primero el filtro rápido: si termina en 2, 3, 7 u 8, ya no es cuadrado. Si el filtro no lo saca, comparo con los cuadrados vecinos.' },
            descarta
              ? { tipo: 'cuentas', texto: `En la columna de la derecha no sale ningún ${cifra}: ningún cuadrado termina así. Queda descartado sin más cuentas.`, ecuacion: [`termina en ${cifra}   ⇒   no es cuadrado`] }
              : { tipo: 'cuentas', texto: `El ${cifra} sí sale en la columna de la derecha (filas marcadas), así que el filtro no decide. Busco los dos cuadrados que lo rodean.`, ecuacion: [vecinos],
                dibujo: { datos: tablaCifras(null), estado: { fila: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(j => (j * j) % 10 === cifra) } } },
            descarta
              ? { tipo: 'sentido', texto: 'Lo confirmo con los cuadrados vecinos: queda entre los dos, y entre dos enteros seguidos no hay otro entero.', ecuacion: [vecinos] }
              : { tipo: 'sentido', texto: `Entre ${c} y ${c + 1} no hay otro entero, así que ningún entero al cuadrado da ${f(Nv, 0)}.` },
          ],
          respuesta: descarta ? `No: ningún cuadrado termina en ${cifra}.` : `No: está entre ${c}² y ${c + 1}².`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const rr = azar(s), k = rr.ent(12, 60), tipo = s % 3;
        if (tipo === 0) {
          const Nv = k * k + rr.de([2, 6, 4 * k - 1]) ;
          const c = isqrt(Nv);
          const es = c * c === Nv, cifra = Nv % 10, descarta = [2, 3, 7, 8].includes(cifra);
          return {
            pregunta: ['¿Es ', { v: 'c-o', t: f(Nv, 0) }, ' un cuadrado perfecto?'],
            opciones: opciones(es ? 'Sí' : descarta ? `No: ningún cuadrado termina en ${cifra}` : `No: está entre ${c}² y ${c + 1}²`, [
              { id: 'si', valor: es ? 'No' : `Sí, porque termina en ${cifra}`, error: 'AT-INCLUSION', siFuera: 'Que la última cifra no descarte no confirma nada.' },
              { id: 'otro', valor: descarta ? `No: está entre ${c}² y ${c + 1}²` : `No: ningún cuadrado termina en ${cifra}`, error: 'AT-INCLUSION', siFuera: descarta ? 'Es cierto, pero la última cifra ya bastaba.' : `Hay cuadrados que terminan en ${cifra}.` },
            ], String),
            solucion: { texto: descarta ? `Termina en ${cifra}: se descarta.` : `Se comprueba con los cuadrados vecinos.`, ecuacion: [`${c}² = ${f(c * c, 0)}`, '   ·   ', `${c + 1}² = ${f((c + 1) ** 2, 0)}`] },
          };
        }
        const cifras = [2, 3, 7, 8, 0, 1, 4, 5, 6, 9], cf = rr.de(cifras);
        const nunca = [2, 3, 7, 8].includes(cf);
        return {
          pregunta: `Un número termina en ${cf}. ¿Qué se puede concluir sobre si es cuadrado perfecto?`,
          opciones: opciones(nunca ? 'Que no lo es' : 'Nada todavía: hay que comprobar', [
            { id: 'si', valor: 'Que sí lo es', error: 'AT-INCLUSION', siFuera: 'Ninguna última cifra asegura que sea cuadrado.' },
            { id: 'contrario', valor: nunca ? 'Nada todavía: hay que comprobar' : 'Que no lo es', error: 'AT-INCLUSION', siFuera: nunca ? `Ningún cuadrado termina en ${cf}: ya se descarta.` : `Hay cuadrados que terminan en ${cf}, como ${[...Array(10).keys()].map(x => x * x).find(x => x % 10 === cf) + (cf === 0 ? 100 : 0)}.` },
          ], String),
          solucion: { texto: 'Los cuadrados solo terminan en 0, 1, 4, 5, 6 o 9.', ecuacion: ['termina en 2, 3, 7 u 8   ⇒   no es cuadrado'], dibujo: { datos: tablaCifras(null), estado: { fila: [2, 3, 7, 8] } } },
        };
      },
    },
  };

  // ---------- Idea 3: la raíz entera es el cuadrado más grande que cabe ----------
  // Cambia: N fichas. Permanece: el tamaño de la ficha. Progresa: el cuadrado q × q, lo que sobra y lo que falta para (q + 1)².
  // Se reserva: el residuo nunca pasa de 2q. Debe verse: q² ≤ N < (q + 1)².
  const fichasRaiz = (Nv, mostrarFaltan = true) => {
    const qq = isqrt(Nv), rv = Nv - qq * qq, faltan = (qq + 1) ** 2 - Nv;
    return {
      altoMax: 150,
      bloques: [
        { n: qq * qq, columnas: qq, color: 'i', rotulo: `${qq}² = ${qq * qq}` },
        { n: rv, columnas: qq + 1, color: 'h', rotulo: `sobran ${rv}`, huecos: mostrarFaltan ? faltan : 0, huecosPaso: 1 },
      ],
    };
  };
  // La manija es el primer hueco: la ficha siguiente. Arrastrarla por la L de huecos agrega fichas al residuo; llevarla
  // a la izquierda del bloque quita una ficha (el cuadrado vuelve a ser el anterior).
  const hueco = (id, minimo) => ({
    id: 'siguiente-ficha', etiqueta: 'lugar de la ficha siguiente', color: 'c-o',
    donde: v => { const Nv = v[id], qq = isqrt(Nv); return FICHAS().geometria(fichasRaiz(Nv)).ficha(1, Nv - qq * qq); },
    mover: (pt, v) => {
      const Nv = v[id], qq = isqrt(Nv), g = FICHAS().geometria(fichasRaiz(Nv)), c = g.caja(1);
      if (pt.x < c.x) return { [id]: Math.max(minimo, qq * qq - 1) };
      const col = Math.min(qq, Math.floor((pt.x - c.x) / g.paso));
      const fila = Math.min(1, Math.max(0, Math.floor((pt.y - c.y) / g.paso)));
      return { [id]: qq * qq + Math.min(2 * qq + 1, fila * (qq + 1) + col) };
    },
  });
  const raiz = {
    id: 'raiz-entera',
    titulo: 'El cuadrado más grande que cabe',
    temas: ['Raíz cuadrada y cúbica entera'],
    pieza: 'arit-fichas',
    // Lee: contexto y vocabulario (raíz, residuo); no hace la cuenta de un caso (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Un piso cuadrado', texto: 'Imagina que tienes 50 losetas iguales para el patio de tu casa en Puno y quieres un piso cuadrado. ¿De qué tamaño sale el más grande? Esa pregunta, con números, es una raíz entera.' },
        { titulo: 'Raíz y residuo', texto: 'La raíz cuadrada es la operación inversa de elevar al cuadrado: como 6² = 36, √36 = 6. Si el número no es cuadrado perfecto, se habla de raíz entera y de residuo, lo que sobra.',
          ecuacion: [{ sup: ['6', '2'] }, ' = 36   ⇔   √36 = 6'] },
        { titulo: 'Qué mirar', texto: 'En el juego eliges cuántas fichas hay. Mira el cuadrado turquesa, las fichas rojas que sobran y los huecos punteados: son las que faltan para el cuadrado siguiente.' },
      ],
    },
    juega: {
      consigna: 'Elige cuántas fichas hay. Se arma el cuadrado más grande posible; mira las que sobran y las que faltan para el siguiente.',
      voz: 'Fíjate cuántas faltan cuando el cuadrado está recién completo.',
      controles: [{ id: 'N', etiqueta: 'N', color: 'c-o', min: 2, max: 60, paso: 1, inicio: 30, unidad: 'fichas', decimales: 0 }],
      dibujo: v => ({ datos: fichasRaiz(v.N), estado: { paso: 1 } }),
      lectura: v => { const qq = isqrt(v.N); return [q, ` = ${qq}, `, r, ` = ${v.N - qq * qq}, faltan ${(qq + 1) ** 2 - v.N}`]; },
      minimo: 3,
      arrastres: [hueco('N', 2)],
    },
    predice: {
      pregunta: ['¿Cuál es la raíz cuadrada entera de ', { v: 'c-o', t: '80' }, ' y su residuo?'],
      opciones: [
        { id: 'c', texto: 'Raíz 8, residuo 16', correcta: true },
        { id: 'exceso', texto: 'Raíz 9, residuo 1', error: 'AT-RAIZ-EXCESO', siFuera: '9 es la raíz por exceso: 9² = 81 se pasa de 80 por 1.' },
        { id: 'decimal', texto: 'Raíz 8,94, residuo 0', error: 'AT-RAIZ-DECIMAL', siFuera: '8,94 es una aproximación; la raíz entera es un entero.' },
        { id: 'mitad', texto: 'Raíz 40, residuo 0', error: 'AT-RAIZ-MITAD', siFuera: '40 es la mitad de 80; la raíz es el número que multiplicado por sí mismo cabe.' },
      ],
      dibujo: { datos: { altoMax: 150, bloques: [{ n: 80, columnas: 10, color: 'o', rotulo: '80 fichas' }] }, estado: {} },
      revelar: { datos: fichasRaiz(80), estado: { paso: 1 } },
      coincide: 'Coincide: 8² = 64 cabe; 9² = 81 ya no.',
    },
    mira: {
      datos: fichasRaiz(80),
      pasos: [
        { estado: { paso: 0 }, texto: 'Con 80 fichas, el cuadrado más grande es de 8 por 8.', ecuacion: [{ sup: ['8', '2'] }, ' = 64 ≤ 80'] },
        { estado: { paso: 0 }, texto: 'Sobran 80 − 64 = 16 fichas: es el residuo.', ecuacion: [r, ' = 80 − 64 = 16'] },
        { estado: { paso: 1 }, texto: 'Para un cuadrado de 9 faltaría 1 ficha: 81 se pasa.', ecuacion: ['80 < 81 = ', { sup: ['9', '2'] }] },
      ],
    },
    regla: {
      texto: 'La raíz cuadrada entera de N es el mayor q con q² ≤ N; el residuo es N − q². La raíz cúbica entera usa q³ ≤ N < (q + 1)³.',
      ecuacion: [{ sup: [q, '2'] }, ' ≤ ', N, ' < ', { sup: [q1, '2'] }, '   ·   ', r, ' = ', { llave: [N, ' − ', { sup: [q, '2'] }], nota: 'lo que sobra', color: 'c-h' }, ' ≤ 2', q],
      condicion: 'N es entero no negativo. Si el residuo pasara de 2q, cabría un cuadrado más grande.',
    },
    resuelve: {
      generar(s) {
        const rr = azar(s + 900), cub = s % 3 === 2;
        if (cub) {
          const k = rr.ent(3, 12), Nv = k ** 3 + rr.ent(1, 3 * k * k + 3 * k);
          const c = icbrt(Nv), rv = Nv - c ** 3;
          return {
            enunciado: ['¿Cuál es la raíz cúbica entera de ', { v: 'c-o', t: f(Nv, 0) }, ' y su residuo?'],
            pasos: [
              { tipo: 'pide', texto: ['Piden la raíz cúbica entera de ', N, ' y lo que sobra, el residuo.'] },
              { tipo: 'datos', texto: ['Tengo ', N, ` = ${f(Nv, 0)}. Busco el mayor entero cuyo cubo no pase de ese número.`] },
              { tipo: 'regla', texto: 'La raíz cúbica entera es el mayor número que, multiplicado tres veces por sí mismo, cabe en N. Lo que queda afuera es el residuo.' },
              { tipo: 'cuentas', texto: [`Pruebo cubos cercanos: ${c}³ cabe y ${c + 1}³ ya se pasa. Después resto para hallar `, r, '.'],
                ecuacion: [`${c}³ = ${f(c ** 3, 0)} ≤ ${f(Nv, 0)} < ${f((c + 1) ** 3, 0)} = ${c + 1}³`, '   ·   ', r, ` = ${f(Nv, 0)} − ${f(c ** 3, 0)} = ${f(rv, 0)}`] },
              { tipo: 'sentido', texto: `Compruebo: ${f(c ** 3, 0)} + ${f(rv, 0)} = ${f(Nv, 0)}. Y el residuo ${f(rv, 0)} no llega a ${f((c + 1) ** 3 - c ** 3, 0)}, lo que separa ${c}³ de ${c + 1}³.` },
            ],
            respuesta: [q, ` = ${c}`, '   ·   ', r, ` = ${f(rv, 0)}`],
          };
        }
        const k = rr.ent(6, 40), Nv = k * k + rr.ent(1, 2 * k);
        const c = isqrt(Nv), rv = Nv - c * c, conFichas = Nv <= 120;
        return {
          enunciado: ['¿Cuál es la raíz cuadrada entera de ', { v: 'c-o', t: f(Nv, 0) }, ' y su residuo?'],
          dibujo: conFichas ? { datos: { altoMax: 150, bloques: [{ n: Nv, columnas: c + 1, color: 'o', rotulo: `${Nv} fichas` }] }, estado: {} } : undefined,
          pasos: [
            { tipo: 'pide', texto: ['Piden la raíz cuadrada entera de ', N, ' y lo que sobra, el residuo.'] },
            { tipo: 'datos', texto: conFichas ? ['Hay ', N, ` = ${Nv} fichas. Busco el lado del cuadrado más grande que se arma con ellas.`]
              : ['Tengo ', N, ` = ${f(Nv, 0)}. Busco el mayor entero cuyo cuadrado no pase de ese número.`] },
            { tipo: 'regla', texto: 'La raíz entera es el mayor número que, multiplicado por sí mismo, cabe en N. Lo que queda afuera es el residuo.' },
            { tipo: 'cuentas', texto: [`Pruebo cuadrados cercanos: ${c}² cabe y ${c + 1}² ya se pasa. Después resto para hallar `, r, '.'],
              ecuacion: [`${c}² = ${f(c * c, 0)} ≤ ${f(Nv, 0)} < ${f((c + 1) ** 2, 0)} = ${c + 1}²`, '   ·   ', r, ` = ${f(Nv, 0)} − ${f(c * c, 0)} = ${rv}`],
              dibujo: conFichas ? { datos: fichasRaiz(Nv), estado: { paso: 1 } } : undefined },
            { tipo: 'sentido', texto: `Compruebo: ${f(c * c, 0)} + ${rv} = ${f(Nv, 0)}. Y el residuo ${rv} no pasa de 2 · ${c} = ${2 * c}; si pasara, cabría un cuadrado más grande.` },
          ],
          respuesta: [q, ` = ${c}`, '   ·   ', r, ` = ${rv}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const rr = azar(s), cub = s % 3 === 2;
        if (cub) {
          const k = rr.ent(3, 12), Nv = k ** 3 + rr.ent(1, 3 * k * k + 3 * k);
          const c = icbrt(Nv), rv = Nv - c ** 3;
          return {
            pregunta: ['¿Cuál es la raíz cúbica entera de ', { v: 'c-o', t: f(Nv, 0) }, ' y su residuo?'],
            opciones: opciones(`Raíz ${c}, residuo ${rv}`, [
              { id: 'exceso', valor: `Raíz ${c + 1}, residuo ${(c + 1) ** 3 - Nv}`, error: 'AT-RAIZ-EXCESO', siFuera: `${c + 1}³ = ${(c + 1) ** 3} se pasa de ${Nv}: esa es por exceso.` },
              { id: 'cuadrada', valor: `Raíz ${isqrt(Nv)}, residuo ${Nv - isqrt(Nv) ** 2}`, error: 'AT-INDICE', siFuera: 'Esa es la raíz cuadrada; se pide la cúbica.' },
              { id: 'falta', valor: `Raíz ${c}, residuo ${(c + 1) ** 3 - Nv}`, error: 'AT-FALTA', siFuera: `Eso es lo que falta para ${(c + 1) ** 3}; el residuo es lo que sobra sobre ${c ** 3}.` },
            ], String),
            solucion: { texto: `${c}³ cabe y ${c + 1}³ ya no.`, ecuacion: [`${c}³ = ${f(c ** 3, 0)} ≤ ${f(Nv, 0)} < ${f((c + 1) ** 3, 0)} = ${c + 1}³`, '   ·   ', `r = ${rv}`] },
          };
        }
        const k = rr.ent(6, 40), Nv = k * k + rr.ent(1, 2 * k);
        const c = isqrt(Nv), rv = Nv - c * c;
        return {
          pregunta: ['¿Cuál es la raíz cuadrada entera de ', { v: 'c-o', t: f(Nv, 0) }, ' y su residuo?'],
          dibujo: Nv <= 120 ? { datos: { altoMax: 150, bloques: [{ n: Nv, columnas: c + 1, color: 'o', rotulo: `${Nv} fichas` }] }, estado: {} } : undefined,
          opciones: opciones(`Raíz ${c}, residuo ${rv}`, [
            { id: 'exceso', valor: `Raíz ${c + 1}, residuo ${(c + 1) ** 2 - Nv}`, error: 'AT-RAIZ-EXCESO', siFuera: `${c + 1}² = ${(c + 1) ** 2} se pasa: esa es la raíz por exceso.` },
            { id: 'menos', valor: `Raíz ${c - 1}, residuo ${Nv - (c - 1) ** 2}`, error: 'AT-RESIDUO', siFuera: `Con ese residuo cabe un cuadrado más grande: el residuo pasa de ${2 * (c - 1)}.` },
            { id: 'falta', valor: `Raíz ${c}, residuo ${(c + 1) ** 2 - Nv}`, error: 'AT-FALTA', siFuera: `Eso es lo que falta para ${(c + 1) ** 2}; el residuo es lo que sobra sobre ${c * c}.` },
          ], String),
          solucion: { texto: `${c}² cabe y ${c + 1}² ya no.`, ecuacion: [`${c}² = ${c * c} ≤ ${Nv} < ${(c + 1) ** 2} = ${c + 1}²`, '   ·   ', `r = ${rv}`], dibujo: Nv <= 120 ? { datos: fichasRaiz(Nv), estado: { paso: 1 } } : undefined },
        };
      },
    },
  };

  // ---------- Idea 4: aproximar es encerrar entre dos valores ----------
  // Cambia: el candidato x. Permanece: el 2 en la recta de los cuadrados. Progresa: décimas → centésimas, el intervalo se achica.
  // Se reserva: la comprobación elevando al cuadrado. Debe verse: x² a un lado del 2 y (x + paso)² al otro.
  const rectaAprox = (x, h, Nv, desde = 0) => ({
    min: Math.floor(x * x * 10) / 10 - 0.2, max: Math.ceil((x + h) * (x + h) * 10) / 10 + 0.2, paso: 0.1, cada: 2, decimales: 2, variable: 'cuadrados', filas: 2,
    elementos: [
      { tipo: 'punto', x: Nv, color: 'o', fila: 1, rotulo: `N = ${f(Nv)}` },
      { tipo: 'intervalo', a: x * x, b: (x + h) * (x + h), ca: true, cb: false, color: 'i', fila: 2, rotulo: `${f(x)}² a ${f(x + h)}²`, desde },
    ],
  });
  const rectaJuego = x => ({ datos: Object.assign(rectaAprox(x, 0.1, 2), { min: 0.8, max: 4.2, paso: 0.2, cada: 5 }), estado: {} });
  const aprox = {
    id: 'aproximadas',
    titulo: 'Encerrar la raíz por pasos',
    temas: ['Raíces aproximadas'],
    pieza: 'recta',
    // Lee: vocabulario (décima, centésima, aproximación) sin dar cifras de √2 (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Raíces que no se acaban', texto: 'La raíz de 2 no tiene decimales que terminen ni que se repitan: es un número irracional. En el examen no hay calculadora, así que hay que acercarse a mano.' },
        { titulo: 'Décimas y centésimas', texto: 'Una décima es 0,1 y una centésima es 0,01. Entre 3,2 y 3,3 caben 3,21, 3,22, 3,23 y así. Cada paso más fino da una aproximación mejor.' },
        { titulo: 'Qué mirar', texto: 'En el juego eliges x y se dibuja el tramo de los cuadrados, de x² al cuadrado de la décima siguiente. Mira de qué lado del punto naranja queda cada borde.' },
      ],
    },
    juega: {
      consigna: 'Busca √2 probando décimas: se dibuja el tramo entre x² y el cuadrado de la décima siguiente. Encierra el 2.',
      voz: 'Comprueba elevando al cuadrado, no a ojo.',
      controles: [{ id: 'x', etiqueta: 'x', color: 'c-i', min: 1, max: 1.9, paso: 0.1, inicio: 1.2, unidad: '', decimales: 1 }],
      dibujo: v => rectaJuego(v.x),
      lectura: v => [`${f(v.x)}² = ${f(v.x * v.x)} · ${f(v.x + 0.1)}² = ${f((v.x + 0.1) ** 2)}`],
      minimo: 3,
      // Arrastra el tramo por la recta de los cuadrados: su borde izquierdo es x², y x es la raíz de donde lo sueltas.
      arrastres: [
        { id: 'tramo', etiqueta: 'inicio del tramo de cuadrados', color: 'c-i',
          donde: v => { const g = RECTA().geometria(rectaJuego(v.x).datos); return { x: g.x(v.x * v.x), y: g.filaY(2) }; },
          mover: (pt, v) => ({ x: Math.sqrt(Math.max(0, inversa(RECTA().geometria(rectaJuego(v.x).datos).x, 0.8, 4.2)(pt.x))) }) },
      ],
    },
    predice: {
      pregunta: '√2 está entre 1,4 y 1,5, porque 1,96 < 2 < 2,25. ¿Entre qué centésimas está?',
      opciones: [
        { id: 'c', texto: 'Entre 1,41 y 1,42', correcta: true },
        { id: 'medio', texto: 'Entre 1,45 y 1,46', error: 'AT-MEDIO', siFuera: 'Sería cierto si 2 quedara en el medio de 1,96 y 2,25. Está muy cerca de 1,96.' },
        { id: 'abajo', texto: 'Entre 1,40 y 1,41', error: 'AT-COMPROBAR', siFuera: '1,41² = 1,9881 todavía es menor que 2: la raíz está después de 1,41.' },
        { id: 'arriba', texto: 'Entre 1,42 y 1,43', error: 'AT-COMPROBAR', siFuera: '1,42² = 2,0164 ya se pasa de 2.' },
      ],
      dibujo: { datos: rectaAprox(1.4, 0.1, 2, 9), estado: {} },
      revelar: { datos: rectaAprox(1.41, 0.01, 2), estado: {} },
      coincide: 'Coincide: 1,41² = 1,9881 < 2 < 2,0164 = 1,42².',
    },
    mira: {
      datos: {
        min: 1.9, max: 2.3, paso: 0.05, cada: 2, decimales: 2, variable: 'cuadrados', filas: 3,
        elementos: [
          { tipo: 'punto', x: 2, color: 'o', fila: 3, rotulo: 'N = 2' },
          { tipo: 'intervalo', a: 1.4 ** 2, b: 1.5 ** 2, ca: true, cb: false, color: 'i', fila: 1, rotulo: '1,4² a 1,5²', desde: 1 },
          { tipo: 'intervalo', a: 1.41 ** 2, b: 1.42 ** 2, ca: true, cb: false, color: 'd', fila: 2, rotulo: '1,41² a 1,42²', desde: 2 },
        ],
      },
      pasos: [
        { estado: { corte: 0 }, texto: 'Se busca √2: un número que al cuadrado dé 2.', ecuacion: [{ raiz: '2' }, ' = ?'] },
        { estado: { corte: 1 }, texto: 'Por décimas: 1,4² = 1,96 y 1,5² = 2,25 lo encierran.', ecuacion: ['1,96 < 2 < 2,25'] },
        { estado: { corte: 2 }, texto: 'Por centésimas: 1,41² = 1,9881 y 1,42² = 2,0164.', ecuacion: ['1,41 < ', { raiz: '2' }, ' < 1,42'] },
      ],
    },
    regla: {
      texto: 'Aproximar √N es encerrarla: se busca a con a² ≤ N < (a + h)², con h = 0,1, 0,01… Cada paso se comprueba elevando al cuadrado.',
      ecuacion: [{ sup: ['a', '2'] }, ' ≤ ', N, ' < ', { llave: [{ sup: [{ par: ['a + h'] }, '2'] }], nota: 'ya se pasa' }, '   ·   ', '⇒  a ≤ ', { raiz: N }, ' < a + h'],
      condicion: '√N es la raíz no negativa. La raíz no se reparte en una suma: √(9 + 16) = 5, no 7.',
    },
    resuelve: {
      generar(s) {
        const rr = azar(s + 900);
        if (s % 3 === 2) {
          const [a2, b2] = rr.de([[9, 16], [36, 64], [25, 144], [64, 225], [81, 144]]);
          const c = Math.sqrt(a2 + b2), reparte = Math.sqrt(a2) + Math.sqrt(b2);
          return {
            enunciado: `¿Cuánto vale √(${a2} + ${b2})?`,
            pasos: [
              { tipo: 'pide', texto: `Piden la raíz de toda la suma ${a2} + ${b2}.` },
              { tipo: 'datos', texto: `Dentro de la raíz hay una suma de dos números: ${a2} y ${b2}.` },
              { tipo: 'regla', texto: 'La raíz no se reparte en una suma. Primero hago la suma de adentro y después saco la raíz.' },
              { tipo: 'cuentas', texto: 'Sumo y busco el número que, al cuadrado, da el total.', ecuacion: [`√(${a2} + ${b2}) = √${a2 + b2} = ${f(c)}`] },
              { tipo: 'sentido', texto: `Compruebo: ${f(c)}² = ${f(c * c, 0)}. Repartir daría ${f(reparte)}, y ${f(reparte)}² = ${f(reparte * reparte, 0)}, que no es ${a2 + b2}.` },
            ],
            respuesta: `√(${a2} + ${b2}) = ${f(c)}`,
          };
        }
        let Nv;
        do { Nv = rr.ent(2, 99); } while (isqrt(Nv) ** 2 === Nv);
        const a = isqrt(Nv), x = Math.sqrt(Nv);
        const d = Math.floor(x * 10 + 1e-9) / 10;
        const porDecima = s % 3 === 1;
        const lo = porDecima ? d : a, h = porDecima ? 0.1 : 1;
        return {
          enunciado: ['¿Entre qué ', porDecima ? 'décimas' : 'enteros consecutivos', ' está ', { raiz: { v: 'c-o', t: String(Nv) } }, '?'],
          pasos: [
            { tipo: 'pide', texto: `Piden dos ${porDecima ? 'décimas seguidas' : 'enteros seguidos'} que encierren la raíz de ${Nv}.` },
            porDecima
              ? { tipo: 'datos', texto: `Primero los enteros: ${a}² = ${a * a} y ${a + 1}² = ${(a + 1) ** 2}. La raíz está entre ${a} y ${a + 1}.` }
              : { tipo: 'datos', texto: `${Nv} no es cuadrado perfecto, así que su raíz no es un entero: cae entre dos.` },
            { tipo: 'regla', texto: `Encierro la raíz: busco un número cuyo cuadrado no pase de ${Nv}, y el siguiente, cuyo cuadrado ya se pasa.` },
            { tipo: 'cuentas', texto: `Elevo al cuadrado: ${f(lo)}² todavía cabe y ${f(lo + h)}² ya se pasa.`,
              ecuacion: [`${f(lo)}² = ${f(lo * lo)} ≤ ${Nv} < ${f((lo + h) ** 2)} = ${f(lo + h)}²`] },
            porDecima
              ? { tipo: 'sentido', texto: `Cuadra con los enteros: ${f(lo)} y ${f(lo + h)} no salen del tramo de ${a} a ${a + 1}, y están a una décima.` }
              : { tipo: 'sentido', texto: `Cuadra: ${a} y ${a + 1} son seguidos, y ${Nv} queda entre sus cuadrados, ${a * a} y ${(a + 1) ** 2}.` },
          ],
          respuesta: `Entre ${f(lo)} y ${f(lo + h)}.`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const rr = azar(s);
        if (s % 3 === 2) {
          const [a2, b2] = rr.de([[9, 16], [36, 64], [25, 144], [64, 225], [81, 144]]);
          const c = Math.sqrt(a2 + b2);
          return {
            pregunta: `¿Cuánto vale √(${a2} + ${b2})?`,
            opciones: opciones(c, [
              { id: 'reparte', valor: Math.sqrt(a2) + Math.sqrt(b2), error: 'AT-REPARTIR', siFuera: 'La raíz no se reparte en una suma: primero se suma.' },
              { id: 'mitad', valor: (a2 + b2) / 2, error: 'AT-RAIZ-MITAD', siFuera: 'La mitad no es la raíz.' },
              { id: 'suma', valor: a2 + b2, error: 'AT-REPARTIR', siFuera: 'Falta sacar la raíz de la suma.' },
            ], n => f(n)),
            solucion: { texto: 'Primero se suma, después la raíz.', ecuacion: [`√(${a2} + ${b2}) = √${a2 + b2} = ${f(c)}`] },
          };
        }
        let Nv;
        do { Nv = rr.ent(2, 99); } while (isqrt(Nv) ** 2 === Nv);
        const a = isqrt(Nv), x = Math.sqrt(Nv);
        const d = Math.floor(x * 10 + 1e-9) / 10;
        const porDecima = s % 3 === 1;
        const lo = porDecima ? d : a, h = porDecima ? 0.1 : 1;
        const t = n => `Entre ${f(n)} y ${f(n + h)}`;
        return {
          pregunta: ['¿Entre qué ', porDecima ? 'décimas' : 'enteros consecutivos', ' está ', { raiz: { v: 'c-o', t: String(Nv) } }, '?'],
          opciones: opciones(lo, [
            { id: 'mitad', valor: porDecima ? Math.floor(Nv / 2 * 10) / 10 : Math.floor(Nv / 2), error: 'AT-RAIZ-MITAD', siFuera: 'La mitad no es la raíz: compruébalo elevando al cuadrado.' },
            { id: 'arriba', valor: lo + h, error: 'AT-COMPROBAR', siFuera: `${f(lo + h)}² = ${f((lo + h) ** 2)} ya pasa de ${Nv}.` },
            { id: 'abajo', valor: lo - h, error: 'AT-COMPROBAR', siFuera: `${f(lo)}² = ${f(lo * lo)} todavía es menor que ${Nv}: la raíz está más allá.` },
          ].map(o => Object.assign(o, { valor: o.valor > 0 ? o.valor : NaN })), n => t(n)),
          solucion: { texto: 'Se eleva al cuadrado cada extremo.', ecuacion: [`${f(lo)}² = ${f(lo * lo)} ≤ ${Nv} < ${f((lo + h) ** 2)} = ${f(lo + h)}²`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Más rico que los juegos: N hasta 200 fichas; un cuarto primo (7) para ver cuadrados y cubos a la vez; y encerrar
  // la raíz de cualquier N de 2 a 20, no solo de 2.
  const PR4 = [2, 3, 5, 7];
  const tablaExp4 = es => ({
    columnas: [{ t: 'primo' }, { t: 'exponente', color: 'o' }, { t: '¿par?' }, { t: '¿de a 3?' }],
    filas: PR4.map((p, i) => [String(p), { t: String(es[i]), color: 'o' },
      { t: es[i] % 2 === 0 ? 'sí' : 'no', color: es[i] % 2 ? 'h' : undefined }, { t: es[i] % 3 === 0 ? 'sí' : 'no', color: es[i] % 3 ? 'h' : undefined }]),
    filasMax: 4, cabeza: true,
  });
  const rectaN = v => ({ datos: { min: 0, max: 22, paso: 1, cada: 5, decimales: 2, variable: 'cuadrados', filas: 2, elementos: [
    { tipo: 'punto', x: v.N, color: 'o', fila: 1, rotulo: `N = ${f(v.N, 0)}` },
    { tipo: 'intervalo', a: v.x * v.x, b: (v.x + 0.1) ** 2, ca: true, cb: false, color: 'i', fila: 2, rotulo: `${f(v.x)}² a ${f(v.x + 0.1)}²` },
  ] }, estado: {} });
  // Para los retos: si la décima x encierra a √N (la misma prueba que escribe la lectura de la mesa «encerrar»).
  const encierra = v => v.x * v.x <= v.N + 1e-9 && v.N < (v.x + 0.1) ** 2 - 1e-9;
  const residuo = Nv => Nv - isqrt(Nv) ** 2;
  const mismo = (g, v, ks) => g.some(x => ks.every(k => x[k] === v[k]));
  const NMAX = 200;
  const R = r;                                      // el residuo, con su color (r queda tapado dentro de las funciones)
  // Mesa 3D (ronda 4, docs/3d.md): la raíz cúbica entera, que en fichas planas no se puede ver.
  // Cambia: N y si la cáscara va aparte · Permanece: el cubo punteado de (k + 1)³ · Progresa: el residuo, que llena
  // caras, después aristas, después la esquina · Se reserva: el residuo 0 (no queda ningún cubito rojo) · Debe verse:
  // la raíz cúbica es el lado del cubo más grande que cabe. Todo lo cuenta MP.cuboConResto (regla 1).
  const cubo = v => MP.cuboConResto(v.N, v.sep === 1);
  const alCubo = k => `${k}³`;
  function datosCubo(v) {
    const r = cubo(v), K = r.k, abre = v.sep === 1 ? 1.5 : 0;
    return {
      bloques: r.cubo.map(c => ({ x: c.x, y: c.y, z: c.z, g: 0 })).concat(r.resto.map(c => ({ x: c.x, y: c.y, z: c.z, g: 1 }))),
      grupos: [
        { nombre: `cubitos del cubo ${alCubo(K)}`, color: 'c-i', rotulo: K ? alCubo(K) : '', rotuloEn: [K / 2, -0.9, 0], dice: `${K}³ = ${r.potencia} cubitos: el cubo más grande que cabe` },
        { nombre: 'cubitos del residuo', color: 'c-h', rotulo: r.r ? `r = ${r.r}` : '', dice: `Residuo: ${r.r} ${r.r === 1 ? 'cubito' : 'cubitos'} sobre ${K}³` },
      ],
      marco: { x: 0, y: 0, z: 0, w: K + 1 + abre, h: K + 1 + abre, d: K + 1 + abre, color: 'c-d', rotulo: `${K + 1}³` },
      alt: `${r.N} cubitos: el cubo ${K}³ = ${r.potencia} en turquesa y ${r.r} de residuo en rojo; faltan ${r.falta} para ${K + 1}³ = ${r.siguiente}.`,
    };
  }
  const mesaCubo = {
    id: 'cubo-de-cubitos', titulo: 'El cubo de cubitos', pieza: 'ari-cubitos-3d',
    consigna: 'Gira el cubo con el dedo. Cambia N: los cubitos que no caben en el cubo turquesa quedan en rojo.',
    controles: [
      { id: 'N', etiqueta: 'N', color: 'c-o', min: 1, max: 250, paso: 1, inicio: 50, unidad: 'cubitos', decimales: 0 },
      { id: 'sep', etiqueta: 'Cáscara', opciones: [{ valor: 0, texto: 'Pegada' }, { valor: 1, texto: 'Aparte' }] },
    ],
    dibujo: v => ({ datos: datosCubo(v), estado: {} }),
    lectura: v => { const r = cubo(v); return [N, ` = ${v.N}: ${r.k}³ = ${r.potencia}, `, R, ` = ${r.r}, faltan ${r.falta}`]; },
    invitaciones: [
      { texto: 'Arma un cubo perfecto de más de 100 cubitos.',
        logrado: v => cubo(v).exacto && v.N > 100,
        bien: 'Residuo 0: no sobra ningún cubito y la raíz cúbica es exacta.',
        pista: 'Busca un N sin cubitos rojos: 5 · 5 · 5 o 6 · 6 · 6.' },
      { texto: 'Pon la cáscara aparte y llena justo sus tres caras grandes.',
        logrado: v => v.sep === 1 && cubo(v).k > 1 && cubo(v).r === 3 * cubo(v).k ** 2,
        bien: 'Tres caras de k · k: el primer paso para crecer al cubo siguiente.',
        pista: 'Con raíz 3, las tres caras piden 3 · 9 = 27 cubitos.' },
      { texto: 'Haz que falte un solo cubito para el cubo siguiente.',
        logrado: v => cubo(v).falta === 1,
        bien: 'Falta la esquina: el residuo llegó a 3k² + 3k, el mayor posible.',
        pista: 'Pon la cáscara aparte y busca la esquina vacía.' },
      { texto: 'Encuentra un N mayor que 1 que sea cuadrado y cubo perfecto a la vez.',
        logrado: v => v.N > 1 && cubo(v).exacto && MP.esCuadrado(v.N),
        bien: '64 = 8² = 4³: es una sexta potencia, 2⁶.',
        pista: 'Revisa los cubos perfectos uno por uno: ¿cuál tiene raíz cuadrada exacta?' },
      { texto: 'Guarda dos N con la misma raíz cúbica y distinto residuo.',
        logrado: (v, g) => g.some(x => g.some(y => cubo(x).k === cubo(y).k && cubo(x).r !== cubo(y).r)),
        bien: 'La misma raíz sirve desde k³ hasta (k + 1)³ − 1.',
        pista: 'Guarda 30 y después 50: los dos tienen raíz 3.' },
    ],
  };
  const laboratorio = [
    mesaCubo,
    {
      id: 'raiz-grande', titulo: 'Raíz entera hasta 200 fichas', pieza: 'arit-fichas',
      consigna: 'Elige N hasta 200. Arrastra el primer hueco: cada lugar que avanzas es una ficha más en el residuo.',
      controles: [{ id: 'N', etiqueta: 'N', color: 'c-o', min: 2, max: NMAX, paso: 1, inicio: 50, unidad: 'fichas', decimales: 0 }],
      dibujo: v => ({ datos: fichasRaiz(v.N), estado: { paso: 1 } }),
      lectura: v => { const qq = isqrt(v.N); return [N, ` = ${v.N}: `, q, ` = ${qq}, `, r, ` = ${v.N - qq * qq}, faltan ${(qq + 1) ** 2 - v.N}`]; },
      arrastres: [hueco('N', 2)],
      invitaciones: [
        { texto: 'Consigue que no sobre ninguna ficha.',
          logrado: v => residuo(v.N) === 0,
          bien: 'Residuo 0: N es un cuadrado perfecto y su raíz es exacta.' },
        { texto: 'Busca el cuadrado perfecto más grande que se puede armar en esta mesa.',
          logrado: v => residuo(v.N) === 0 && isqrt(v.N) === isqrt(NMAX),
          bien: '14² = 196; el cuadrado de 15 ya pide 225 fichas.' },
        { texto: 'Haz que falte justo una ficha para el cuadrado siguiente.',
          logrado: v => (isqrt(v.N) + 1) ** 2 - v.N === 1,
          bien: 'Ahí el residuo llega a 2q, el mayor posible antes de crecer.' },
        { texto: 'Guarda dos N con la misma raíz entera y distinto residuo.',
          logrado: (v, g) => mismo(g, v, ['N']) && g.some(x => x.N !== v.N && isqrt(x.N) === isqrt(v.N)),
          bien: 'La misma raíz sirve para todo N desde q² hasta (q + 1)² − 1.' },
      ],
    },
    {
      // Sin arrastre: los exponentes son números que se eligen, no lugares de la tabla.
      id: 'cuatro-primos', titulo: 'Cuadrados y cubos con cuatro primos', pieza: 'arit-tabla',
      consigna: 'Arma un número con los exponentes de 2, 3, 5 y 7. Busca uno que sea cuadrado y cubo a la vez.',
      controles: PR4.map((p, i) => ({ id: `e${p}`, etiqueta: `exponente de ${p}`, color: 'c-o', min: 0, max: 6, paso: 1, inicio: [2, 3, 0, 1][i], unidad: '', decimales: 0 })),
      dibujo: v => ({ datos: tablaExp4(PR4.map(p => v[`e${p}`])), estado: {} }),
      lectura: v => { const es = PR4.map(p => v[`e${p}`]); return [N, ` = ${escribir(PR4.map((p, i) => [p, es[i]]))}: ${clasif(es)}`]; },
      invitaciones: [
        { texto: 'Arma un número mayor que 1 que sea cuadrado y cubo a la vez.',
          logrado: v => { const es = PR4.map(p => v[`e${p}`]); return clasif(es) === 'cuadrado y cubo' && es.some(e => e > 0); },
          bien: 'Exponentes múltiplos de 6: es una sexta potencia, como 64 = 2⁶.' },
        { texto: 'Haz un cubo perfecto que no sea cuadrado perfecto.',
          logrado: v => clasif(PR4.map(p => v[`e${p}`])) === 'cubo perfecto',
          bien: 'Basta un exponente impar, como el 3, para que no sea cuadrado.' },
        { texto: 'Busca el menor cuadrado perfecto que use los cuatro primos.',
          // Todos pares y ninguno 0: el menor es con todos en 2.
          logrado: v => { const es = PR4.map(p => v[`e${p}`]); return clasif(es) !== 'ni cuadrado ni cubo' && es.every(e => e === 2); },
          bien: '2² · 3² · 5² · 7² = 210² = 44 100.' },
        { texto: 'Guarda un cuadrado perfecto y un cubo perfecto que difieran en un solo exponente.',
          logrado: (v, g) => mismo(g, v, PR4.map(p => `e${p}`)) && g.some(x => {
            const ex = PR4.map(p => x[`e${p}`]), ev = PR4.map(p => v[`e${p}`]);
            const cambios = ex.filter((e, i) => e !== ev[i]).length, cx = clasif(ex), cv = clasif(ev);
            return cambios === 1 && ((cx === 'cuadrado perfecto' && cv === 'cubo perfecto') || (cx === 'cubo perfecto' && cv === 'cuadrado perfecto'));
          }),
          bien: 'Un exponente decide: par para el cuadrado, múltiplo de 3 para el cubo.' },
      ],
    },
    {
      id: 'encerrar', titulo: 'Encerrar la raíz de cualquier N', pieza: 'recta',
      consigna: 'Arrastra N y el tramo de cuadrados. Busca la décima x con x² ≤ N y el cuadrado siguiente ya pasado.',
      controles: [
        { id: 'N', etiqueta: 'N', color: 'c-o', min: 2, max: 20, paso: 1, inicio: 7, unidad: '', decimales: 0 },
        { id: 'x', etiqueta: 'x', color: 'c-i', min: 1, max: 4.5, paso: 0.1, inicio: 2, unidad: '', decimales: 1 },
      ],
      dibujo: rectaN,
      lectura: v => (encierra(v)
        ? [{ raiz: { v: 'c-o', t: String(v.N) } }, ` está entre ${f(v.x)} y ${f(v.x + 0.1)}`]
        : [`${f(v.x)}² = ${f(v.x * v.x)} · `, N, ` = ${v.N} queda fuera`]),
      arrastres: [
        { id: 'punto-n', etiqueta: 'el número N', color: 'c-o',
          donde: v => { const g = RECTA().geometria(rectaN(v).datos); return { x: g.x(v.N), y: g.filaY(1) }; },
          mover: (pt, v) => ({ N: inversa(RECTA().geometria(rectaN(v).datos).x, 0, 22)(pt.x) }) },
        { id: 'tramo', etiqueta: 'inicio del tramo de cuadrados', color: 'c-i',
          donde: v => { const g = RECTA().geometria(rectaN(v).datos); return { x: g.x(v.x * v.x), y: g.filaY(2) }; },
          mover: (pt, v) => ({ x: Math.sqrt(Math.max(0, inversa(RECTA().geometria(rectaN(v).datos).x, 0, 22)(pt.x))) }) },
      ],
      invitaciones: [
        { texto: 'Encierra la raíz de 10 entre dos décimas seguidas.',
          logrado: v => v.N === 10 && encierra(v),
          bien: '3,1² = 9,61 y 3,2² = 10,24: √10 ≈ 3,16 queda entre ellas.' },
        { texto: 'Haz que N caiga justo en el borde izquierdo del tramo.',
          logrado: v => encierra(v) && Math.abs(v.x * v.x - v.N) < 1e-9,
          bien: 'El borde es x²: si toca a N, la raíz es exacta.' },
        { texto: 'Encierra el mayor N de la mesa.',
          logrado: v => v.N === 20 && encierra(v),
          bien: '4,4² = 19,36 y 4,5² = 20,25: √20 está cerca de 4,47.' },
        { texto: 'Guarda dos casos con el mismo tramo: uno que encierra a N y otro que no.',
          logrado: (v, g) => mismo(g, v, ['N', 'x']) && g.some(x => x.x === v.x && encierra(x) !== encierra(v)),
          bien: 'Cada tramo mide menos de 1: a lo sumo cabe un entero.' },
      ],
    },
  ];

  return {
    unidad: 'aritmetica.potenciacion-y-radicacion',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/recta.js', '/plantillas/potenciacion/motor.js', '/nucleo/kit/piezas/ari-cubitos-3d.js'],
    glosario: [
      { termino: 'cuadrado perfecto', formas: ['cuadrado perfecto', 'cuadrados perfectos'],
        def: 'Entero que resulta de multiplicar otro entero por sí mismo: sus primos tienen exponentes pares.',
        ejemplo: '144 = 2⁴ · 3² = 12².', ver: ['cubo perfecto', 'raíz entera'] },
      { termino: 'cubo perfecto', formas: ['cubo perfecto', 'cubos perfectos'],
        def: 'Entero que es otro entero multiplicado tres veces por sí mismo: sus exponentes son múltiplos de 3.',
        ejemplo: '216 = 2³ · 3³ = 6³.', ver: ['cuadrado perfecto', 'raíz cúbica'] },
      { termino: 'raíz entera', formas: ['raíz cuadrada entera', 'raíz entera', 'raíces enteras'],
        def: 'El mayor entero cuyo cuadrado no pasa de N: el lado del mayor cuadrado que se arma con N fichas.',
        ejemplo: 'De 80 es 8, porque 8² = 64 ≤ 80 < 81 = 9².', ver: ['residuo', 'raíz por exceso'] },
      { termino: 'raíz cúbica', formas: ['raíz cúbica entera', 'raíz cúbica', 'cúbica'],
        def: 'Número que, multiplicado tres veces por sí mismo, da N. La entera es el mayor q con q³ ≤ N.',
        ejemplo: 'De 30, la entera es 3: 3³ = 27 ≤ 30 < 64 = 4³.', ver: ['cubo perfecto'] },
      { termino: 'residuo', simbolo: 'r', def: 'Lo que sobra al sacar la raíz entera: N menos el cuadrado de esa raíz.',
        ejemplo: '80 − 8² = 16.', ver: ['raíz entera'] },
      { termino: 'raíz por exceso', formas: ['raíz por exceso'],
        def: 'El menor entero cuyo cuadrado ya pasa de N: la raíz entera más 1.',
        ejemplo: 'De 80 es 9: 9² = 81 pasa a 80 por 1.', ver: ['raíz entera'] },
      { termino: 'criterio de exclusión', formas: ['criterio de exclusión', 'criterios de exclusión'],
        def: 'Prueba rápida que solo sirve para descartar: si falla, el número no es cuadrado; si se cumple, falta comprobar.',
        ejemplo: 'Ningún cuadrado termina en 7: 2 027 no es cuadrado.', ver: ['condición necesaria'] },
      { termino: 'condición necesaria', formas: ['condición necesaria', 'necesaria', 'necesarias'],
        def: 'Lo que tiene que cumplirse para que algo sea cierto, aunque cumplirlo no alcance.',
        ejemplo: 'Para ser cuadrado hay que terminar en 0, 1, 4, 5, 6 o 9; 2 021 cumple y no es.', ver: ['condición suficiente'] },
      { termino: 'condición suficiente', formas: ['condición suficiente', 'suficiente', 'suficientes'],
        def: 'Lo que basta para asegurar algo: si se cumple, ya no hace falta comprobar más.',
        ejemplo: 'Tener todos los exponentes pares basta para ser cuadrado perfecto.', ver: ['condición necesaria'] },
      { termino: 'operación inversa', formas: ['operación inversa', 'operaciones inversas'],
        def: 'Operación que deshace lo que hizo otra: aplicada después, devuelve el número del inicio.',
        ejemplo: '5² = 25 y √25 = 5: la raíz deshace el cuadrado.', ver: ['raíz entera'] },
    ],
    laboratorio,
    historia: {
      texto: 'La tablilla babilónica YBC 7289 muestra un cuadrado con su diagonal y una aproximación de la raíz de dos en base 60, muy precisa. Sabemos qué valor se escribió, pero no cómo se obtuvo: un número no revela el método. Esta unidad une potencias y raíces como operaciones inversas, y separa los valores exactos de las aproximaciones.',
      pregunta: '¿Cómo comprobarías una raíz sin calculadora?',
      fuente: { titulo: 'MCT 042 YBC 07289, P255048 — Cuneiform Digital Library Initiative', url: 'https://cdli.earth/artifacts/255048' },
    },
    ideas: [perfectos, exclusion, raiz, aprox],
  };
});
