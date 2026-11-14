/*
 * Teoría de «Razones y proporciones» (aritmetica.razones-y-proporciones). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 3) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR6, AR7 y AR14 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: distinguir comparar restando de comparar dividiendo, y usar la que conserva lo que el problema conserva.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja de 360 px, en el aula o en la combi, sin audio.
 *   Resultado observable: resuelve razones con suma o diferencia, cuarta y media proporcional, medias y series de razones.
 *   Orden de atención: 1.º las tiras a la misma escala · 2.º las partes iguales de cada tira · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción elegida · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «si 4 es a 6, ¿por qué 6 no es a 8?».
 * Colores (regla 4): antecedente a naranja (c-o), consecuente b turquesa (c-i), constante k verde (c-d); en las medias,
 * la aritmética A rojo (c-h) y la geométrica G verde (c-d), la armónica H en tinta.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const a = { v: 'c-o', t: 'a' }, b = { v: 'c-i', t: 'b' }, k = { v: 'c-d', t: 'k' };
  const c = { v: 'c-o', t: 'c' }, d = { v: 'c-i', t: 'd' };
  const A = { v: 'c-h', t: 'A' }, G = { v: 'c-d', t: 'G' };
  const mcd = (x, y) => (y ? mcd(y, x % y) : Math.abs(x));
  const razon = (x, y) => { const g = mcd(x, y) || 1; return `${f(x / g)}/${f(y / g)}`; };
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
    for (const x of distractores) {
      const txt = fmt(x.valor);
      if (vistos.has(txt) || !Number.isFinite(x.valor) || x.valor < 0) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Una tira de n partes iguales de tamaño u (las partes se cuentan; el largo es n·u a la escala común).
  const tira = (rotulo, color, n, u, o = {}) => Object.assign({ rotulo, color, fin: o.fin, paso: o.paso, tramos: [{ valor: n * u, color, partes: n, texto: o.texto }] }, o.extra || {});

  // ---------- Idea 1: restar o dividir, dos comparaciones distintas ----------
  // Cambia: las dos tiras se estiran (×k) o se alargan (+s). Permanece: la escala común de 30 unidades.
  // Progresa: qué comparación sobrevive a cada cambio. Se reserva: el Sr. Alto, donde la diferencia no sirve.
  // Debe verse: al multiplicar, la razón queda igual y la diferencia crece.
  const comparar = {
    id: 'restar-dividir',
    titulo: 'Restar o dividir: dos comparaciones',
    temas: ['Razón aritmética y geométrica'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Las tiras a y b empiezan en 3 y 5. Estíralas multiplicando o agrégales lo mismo a las dos. Mira qué comparación se mantiene.',
      voz: 'Prueba solo multiplicar, y luego solo sumar.',
      controles: [
        { id: 'k', etiqueta: 'Multiplica ×', color: 'c-d', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
        { id: 's', etiqueta: 'Suma +', min: 0, max: 6, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => {
        const x = 3 * v.k + v.s, y = 5 * v.k + v.s;
        return { datos: { max: 26, regla: { paso: 1, cada: 5 }, filas: 2, tiras: [tira('a', 'o', x, 1, { fin: f(x) }), tira('b', 'i', y, 1, { fin: f(y) })] }, estado: {} };
      },
      lectura: v => { const x = 3 * v.k + v.s, y = 5 * v.k + v.s; return [b, ' − ', a, ` = ${f(y - x)} · `, a, ' : ', b, ` = ${razon(x, y)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'El Sr. Bajo mide 4 botones o 6 clips. El Sr. Alto mide 6 botones. ¿Cuántos clips mide el Sr. Alto?',
      opciones: [
        { id: 'c', texto: '9 clips', correcta: true },
        { id: 'resta', texto: '8 clips', error: 'AR6', siFuera: 'Sería cierto si se conservara la diferencia de 2. Se conserva la razón: 1 botón = 1,5 clips.' },
        { id: 'doble', texto: '12 clips', error: 'AR7', siFuera: 'Sería cierto si el Sr. Alto midiera el doble del Bajo. Mide 6 botones, no 8.' },
        { id: 'invierte', texto: '4 clips', error: 'AT-INVIERTE', siFuera: 'Eso usa la razón al revés: el clip es más chico, así que caben más clips.' },
      ],
      dibujo: { datos: { max: 9, filas: 4, tiras: [tira('Bajo en botones', 'o', 4, 1.5), tira('Bajo en clips', 'i', 6, 1), tira('Alto en botones', 'o', 6, 1.5)] }, estado: {} },
      revelar: { datos: { max: 9, filas: 4, tiras: [tira('Bajo en botones', 'o', 4, 1.5), tira('Bajo en clips', 'i', 6, 1), tira('Alto en botones', 'o', 6, 1.5), tira('Alto en clips', 'i', 9, 1, { fin: '9' })] }, estado: {} },
      coincide: 'Coincide: cada botón mide lo mismo que 1,5 clips, en los dos señores.',
    },
    mira: {
      datos: { max: 9, filas: 4, tiras: [tira('Bajo en botones', 'o', 4, 1.5), tira('Bajo en clips', 'i', 6, 1), tira('Alto en botones', 'o', 6, 1.5, { paso: 2 }), tira('Alto en clips', 'i', 9, 1, { paso: 3, fin: '9' })] },
      pasos: [
        { estado: { paso: 1 }, texto: 'El Sr. Bajo mide lo mismo en botones que en clips.', ecuacion: ['4 botones = 6 clips'] },
        { estado: { paso: 1 }, texto: 'Un botón mide un clip y medio: es una razón.', ecuacion: [{ frac: ['6', '4'] }, ' = 1,5 clips por botón'] },
        { estado: { paso: 2 }, texto: 'El Sr. Alto mide 6 botones.', ecuacion: ['6 botones'] },
        { estado: { paso: 3 }, texto: 'Cada botón vale 1,5 clips: 6 por 1,5.', ecuacion: ['6 · 1,5 = 9 clips'] },
      ],
    },
    regla: {
      texto: 'La razón aritmética compara restando; la geométrica, dividiendo. Multiplicar las dos cantidades conserva la geométrica; sumarles lo mismo conserva la aritmética.',
      ecuacion: ['razón aritmética: ', a, ' − ', b, '   ·   razón geométrica: ', { frac: [a, b] }, ' = ', k],
      condicion: 'b no es cero. «a y b están en razón 3 a 5» quiere decir a = 3k y b = 5k.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), m = r.ent(1, 5), n = m + r.ent(1, 4), kk = r.ent(2, 9);
        const x = m * kk, y = n * kk, suma = s % 2 === 0;
        const dato = suma ? x + y : y - x;
        const partes = (rot, col, cuantas) => ({ rotulo: rot, color: col, fin: f(cuantas * kk), tramos: Array.from({ length: cuantas }, () => ({ valor: kk, color: col, texto: f(kk) })) });
        const datos = { max: y, filas: 2, tiras: [partes('a', 'o', m), partes('b', 'i', n)] };
        return {
          pregunta: ['Dos números ', a, ' y ', b, ` están en razón ${m} a ${n}. Su ${suma ? 'suma' : 'diferencia'} es ${f(dato)}. ¿Cuánto vale `, b, '?'],
          opciones: opciones(y, [
            { id: 'a', valor: x, error: 'AT-CUAL', siFuera: 'Ese es a, el número menor.' },
            { id: 'k', valor: kk, error: 'AT-CONSTANTE', siFuera: 'Ese es el valor de cada parte, k; b tiene varias partes.' },
            { id: 'sin-k', valor: suma ? dato * n / (n - m) : dato * n / (m + n), error: 'AT-PARTES', siFuera: `Eso reparte entre ${suma ? n - m : m + n} partes; ${suma ? 'la suma tiene' : 'la diferencia tiene'} ${suma ? m + n : n - m}.` },
            { id: 'resta', valor: suma ? dato - n : dato + n, error: 'AR6', siFuera: 'Eso trata la razón como una resta.' },
          ], n2 => f(n2)),
          solucion: {
            texto: `${suma ? 'La suma' : 'La diferencia'} son ${suma ? m + n : n - m} partes iguales de ${f(kk)}.`,
            ecuacion: [k, ` = ${f(dato)} ÷ ${suma ? m + n : n - m} = ${f(kk)} → `, b, ` = ${n} · ${f(kk)} = ${f(y)}`],
            dibujo: { datos, estado: {} },
          },
          dibujo: { datos: { max: y, filas: 2, tiras: [tira('a', 'o', m, kk), tira('b', 'i', n, kk)] }, estado: {} },
        };
      },
    },
  };

  // ---------- Idea 2: proporción, productos cruzados; continua si se repite el medio ----------
  // Cambia: las tiras c y d como k veces a y b. Permanece: el par a, b y la escala.
  // Progresa: de proporción discreta (cuatro términos) a continua (medio repetido). Se reserva: x² = 36 en el caso continuo.
  // Debe verse: a·d y b·c dan el mismo número.
  const proporcion = {
    id: 'proporcion',
    titulo: 'Proporción: los productos cruzados',
    temas: ['Proporciones discretas y continuas'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Elige a y b, y el factor k que lleva a hasta c y b hasta d. Compara a · d con b · c.',
      voz: 'Comprueba los dos productos en cada caso.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 },
        { id: 'k', etiqueta: 'k', color: 'c-d', min: 2, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: { max: 24, filas: 4, regla: { paso: 1, cada: 4 }, tiras: [tira('a', 'o', v.a, 1, { fin: f(v.a) }), tira('b', 'i', v.b, 1, { fin: f(v.b) }), tira('c', 'o', v.a * v.k, 1, { fin: f(v.a * v.k) }), tira('d', 'i', v.b * v.k, 1, { fin: f(v.b * v.k) })] }, estado: {} }),
      lectura: v => [a, ' · ', d, ` = ${f(v.a * v.b * v.k)} · `, b, ' · ', c, ` = ${f(v.a * v.b * v.k)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['En la proporción continua ', { frac: ['4', 'x'] }, ' = ', { frac: ['x', '9'] }, ', ¿cuánto vale x?'],
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'media', texto: '6,5', error: 'AT-MEDIA', siFuera: '6,5 es el promedio de 4 y 9: sería cierto si fueran diferencias iguales, no razones.' },
        { id: 'producto', texto: '36', error: 'AT-PRODUCTO', siFuera: '36 es x · x; falta sacar la raíz.' },
        { id: 'suma', texto: '13', error: 'AR6', siFuera: '13 suma los extremos; la proporción iguala cocientes.' },
      ],
      dibujo: { datos: { max: 9, filas: 3, tiras: [tira('4', 'o', 4, 1), tira('x', 'i', 0.0001, 1, { extra: { tramos: [{ valor: 9, hueco: true }] } }), tira('9', 'o', 9, 1)] }, estado: {} },
      revelar: { datos: { max: 9, filas: 3, tiras: [tira('4', 'o', 4, 1), tira('x = 6', 'i', 6, 1), tira('9', 'o', 9, 1)] }, estado: {} },
      coincide: 'Coincide: 4 · 9 = 36 y 6 · 6 = 36.',
    },
    mira: {
      datos: { max: 9, filas: 3, tiras: [tira('4', 'o', 4, 1), tira('x = 6', 'i', 6, 1, { paso: 3 }), tira('9', 'o', 9, 1)] },
      pasos: [
        { estado: { paso: 1 }, texto: 'En una proporción, los productos cruzados son iguales.', ecuacion: [{ frac: ['4', 'x'] }, ' = ', { frac: ['x', '9'] }, ' ⇔ 4 · 9 = x · x'] },
        { estado: { paso: 2 }, texto: 'Aquí el medio se repite: x por x es 36.', ecuacion: [{ sup: ['x', '2'] }, ' = 36'] },
        { estado: { paso: 3 }, texto: 'x es el número positivo que multiplicado por sí mismo da 36.', ecuacion: ['x = √36 = 6'] },
      ],
    },
    regla: {
      texto: 'Una proporción iguala dos razones y equivale a que los productos cruzados sean iguales. Es continua cuando los dos medios son el mismo número.',
      ecuacion: [{ frac: [a, b] }, ' = ', { frac: [c, d] }, ' ⇔ ', a, ' · ', d, ' = ', b, ' · ', c, '   ·   continua: ', { sup: [b, '2'] }, ' = ', a, ' · ', d],
      condicion: 'b y d no son cero. En la continua a : b = b : d, b es media proporcional y d, tercera proporcional.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {     // cuarta proporcional (discreta)
          const x = r.ent(2, 9), y = r.ent(2, 9), kk = r.ent(2, 5);
          if (x === y) return this.generar(s + 1000);
          const cc = x * kk, dd = y * kk;
          return {
            pregunta: ['Halla la cuarta proporcional: ', { frac: [String(x), String(y)] }, ' = ', { frac: [String(cc), 'd'] }, '. ¿Cuánto vale d?'],
            opciones: opciones(dd, [
              { id: 'resta', valor: cc + (y - x), error: 'AR6', siFuera: 'Eso conserva la diferencia; la proporción conserva el cociente.' },
              { id: 'invierte', valor: x * cc / y, error: 'AT-INVIERTE', siFuera: 'Eso cruza los productos al revés.' },
              { id: 'producto', valor: y * cc, error: 'AT-PRODUCTO', siFuera: `Falta dividir entre ${x}.` },
            ], f),
            solucion: { texto: 'Los productos cruzados son iguales.', ecuacion: [`${x} · d = ${y} · ${cc} → d = ${f(dd)}`] },
          };
        }
        const m = r.ent(1, 4), n = r.ent(m + 1, 6), u = r.ent(1, 3);   // continua: m²u : m n u = m n u : n² u
        const x = m * m * u, z = n * n * u, med = m * n * u;
        return {
          pregunta: ['Halla la media proporcional de ', `${f(x)} y ${f(z)}: `, { frac: [f(x), 'b'] }, ' = ', { frac: ['b', f(z)] }, '. ¿Cuánto vale b?'],
          opciones: opciones(med, [
            { id: 'media', valor: (x + z) / 2, error: 'AT-MEDIA', siFuera: 'Ese es el promedio; aquí se igualan cocientes, no diferencias.' },
            { id: 'producto', valor: x * z, error: 'AT-PRODUCTO', siFuera: 'Ese es b · b; falta la raíz.' },
            { id: 'suma', valor: x + z, error: 'AR6', siFuera: 'Eso suma los extremos.' },
          ], f),
          solucion: { texto: 'El medio por sí mismo es el producto de los extremos.', ecuacion: [{ sup: ['b', '2'] }, ` = ${f(x)} · ${f(z)} = ${f(x * z)} → b = ${f(med)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: tres medias; elegir según qué se suma ----------
  // Cambia: a y b, con A, G y H sobre la recta. Permanece: el orden H ≤ G ≤ A.
  // Progresa: A, luego G, luego H. Se reserva: la ida y vuelta, donde la media correcta es H.
  // Debe verse: H a la izquierda del promedio cuando los tramos tienen la misma distancia.
  const rectaMedias = (x, y, extra = {}) => {
    const Av = (x + y) / 2, Gv = Math.sqrt(x * y), Hv = 2 * x * y / (x + y);
    return Object.assign({
      min: Math.floor(Math.min(x, y) - 1), max: Math.ceil(Math.max(x, y) + 1), paso: 1, cada: 2, decimales: 2, filas: 3, variable: 'valor',
      elementos: [
        { tipo: 'punto', x, color: 'o', rotulo: f(x), fila: 0 },
        { tipo: 'punto', x: y, color: 'i', rotulo: f(y), fila: 0 },
        { tipo: 'punto', x: Av, color: 'h', rotulo: `A = ${f(Av)}`, fila: 3, desde: extra.dA || 0 },
        { tipo: 'punto', x: Gv, color: 'd', rotulo: `G = ${f(Gv)}`, fila: 2, desde: extra.dG || 0 },
        { tipo: 'punto', x: Hv, rotulo: `H = ${f(Hv)}`, fila: 1, desde: extra.dH || 0 },
      ],
    }, extra.datos || {});
  };
  const medias = {
    id: 'medias',
    titulo: 'Tres medias para dos números',
    temas: ['Medias aritmética, geométrica y armónica'],
    pieza: 'recta',
    juega: {
      consigna: 'Elige dos números. La recta muestra sus tres medias: aritmética, geométrica y armónica. Mira su orden.',
      voz: 'Prueba también dos números iguales.',
      controles: [
        { id: 'x', etiqueta: 'a', color: 'c-o', min: 2, max: 18, paso: 2, inicio: 4, decimales: 0 },
        { id: 'y', etiqueta: 'b', color: 'c-i', min: 2, max: 18, paso: 2, inicio: 16, decimales: 0 },
      ],
      dibujo: v => ({ datos: rectaMedias(v.x, v.y, { datos: { min: 0, max: 20, cada: 5 } }), estado: {} }),
      lectura: v => [A, ` = ${f((v.x + v.y) / 2)} · `, G, ` = ${f(Math.sqrt(v.x * v.y))} · H = ${f(2 * v.x * v.y / (v.x + v.y))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una combi va de Juliaca a Puno a 60 km/h y vuelve por la misma pista a 40 km/h. ¿Cuál es su rapidez media en todo el viaje?',
      opciones: [
        { id: 'c', texto: '48 km/h', correcta: true },
        { id: 'prom', texto: '50 km/h', error: 'AR14', siFuera: '50 sería cierto si viajara el mismo tiempo a cada rapidez. Viaja más tiempo a 40.' },
        { id: 'geo', texto: '49 km/h', error: 'AT-MEDIA', siFuera: 'Eso se acerca a la media geométrica; aquí lo que se suma son tiempos.' },
        { id: 'suma', texto: '100 km/h', error: 'AT-SUMA', siFuera: 'Eso suma las rapideces; la media queda entre 40 y 60.' },
      ],
      dibujo: { datos: rectaMedias(40, 60, { dA: 9, dG: 9, dH: 9 }), estado: {} },
      revelar: { datos: rectaMedias(40, 60, { dG: 9 }), estado: {} },
      coincide: 'Coincide: tarda más a 40 km/h, así que la media se acerca a 40.',
    },
    mira: {
      datos: rectaMedias(40, 60, { dA: 1, dG: 9, dH: 3 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'El promedio simple sería 50, si los tiempos fueran iguales.', ecuacion: [A, ' = ', { frac: ['40 + 60', '2'] }, ' = 50'] },
        { estado: { corte: 2 }, texto: 'Con 120 km por tramo: 2 h de ida y 3 h de vuelta.', ecuacion: [{ frac: ['120', '60'] }, ' + ', { frac: ['120', '40'] }, ' = 5 h'] },
        { estado: { corte: 3 }, texto: 'Rapidez media: distancia total entre tiempo total.', ecuacion: [{ frac: ['240', '5'] }, ' = 48 = ', { frac: ['2 · 40 · 60', '40 + 60'] }] },
      ],
    },
    regla: {
      texto: 'Para dos positivos a y b hay tres medias, siempre en el orden H ≤ G ≤ A; las tres coinciden solo si a = b.',
      ecuacion: [A, ' = ', { frac: [[a, ' + ', b], '2'] }, '   ·   ', G, ' = ', { raiz: [a, b] }, '   ·   H = ', { frac: [['2', a, b], [a, ' + ', b]] }],
      condicion: 'tiempos iguales piden la aritmética; distancias iguales en cada tramo piden la armónica; factores que se multiplican, la geométrica.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), [x, y] = r.de([[4, 9], [2, 8], [4, 16], [9, 16], [3, 12], [5, 20], [8, 18], [6, 24], [1, 9]]);
        const Av = (x + y) / 2, Gv = Math.sqrt(x * y), Hv = 2 * x * y / (x + y);
        const pide = ['A', 'G', 'H'][s % 3];
        const valor = { A: Av, G: Gv, H: Hv }[pide], nombre = { A: 'aritmética', G: 'geométrica', H: 'armónica' }[pide];
        const otras = [{ id: 'A', valor: Av, nombre: 'aritmética' }, { id: 'G', valor: Gv, nombre: 'geométrica' }, { id: 'H', valor: Hv, nombre: 'armónica' }].filter(o => o.id !== pide);
        return {
          pregunta: [`¿Cuál es la media ${nombre} de `, { v: 'c-o', t: f(x) }, ' y ', { v: 'c-i', t: f(y) }, '?'],
          dibujo: { datos: rectaMedias(x, y, { dA: 9, dG: 9, dH: 9 }), estado: {} },
          opciones: opciones(valor, [
            ...otras.map(o => ({ id: o.id, valor: o.valor, error: 'AT-MEDIA', siFuera: `Esa es la media ${o.nombre}.` })),
            { id: 'prod', valor: x * y, error: 'AT-PRODUCTO', siFuera: 'Ese es el producto; la geométrica es su raíz.' },
          ], n2 => f(n2)),
          solucion: {
            texto: `La media ${nombre}, calculada con su fórmula.`,
            ecuacion: pide === 'A' ? [A, ` = (${f(x)} + ${f(y)}) ÷ 2 = ${f(Av)}`] : pide === 'G' ? [G, ` = √(${f(x)} · ${f(y)}) = ${f(Gv)}`] : [`H = 2 · ${f(x)} · ${f(y)} ÷ ${f(x + y)} = ${f(Hv)}`],
            dibujo: { datos: rectaMedias(x, y), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 4: serie de razones iguales; la suma conserva la razón ----------
  // Cambia: k, que estira las tres tiras de arriba. Permanece: los consecuentes 2, 3 y 5.
  // Progresa: cada par → la suma de todos. Se reserva: el total dado, de donde sale k.
  // Debe verse: sumar antecedentes y consecuentes da la misma razón k.
  const serieDatos = (bs, kk, o = {}) => {
    const tiras = [];
    bs.forEach((bi, i) => tiras.push(tira(`par ${i + 1}`, 'o', bi, kk, { texto: o.sinTexto ? undefined : f(bi * kk), paso: o.pasos ? 1 : 0, extra: { tramos: [{ valor: bi * kk, color: 'o', partes: bi, texto: o.sinTexto ? undefined : f(bi * kk) }] } })));
    const suma = bs.reduce((x, y) => x + y, 0);
    tiras.push(tira('consecuentes', 'i', suma, 1, { fin: f(suma), paso: o.pasos ? 2 : 0, extra: { tramos: bs.map(bi => ({ valor: bi, color: 'i', partes: bi })) } }));
    tiras.push(tira('antecedentes', 'o', suma, kk, { fin: o.sinTexto ? '?' : f(suma * kk), paso: o.pasos ? 3 : 0, extra: { tramos: bs.map(bi => ({ valor: bi * kk, color: 'o', partes: bi })) } }));
    return { max: suma * Math.max(kk, 1), filas: bs.length + 2, tiras };
  };
  const serie = {
    id: 'serie',
    titulo: 'Razones iguales: la suma también',
    temas: ['Serie de razones geométricas equivalentes'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Tres razones iguales: cada antecedente es k veces su consecuente 2, 3 y 5. Cambia k y compara las sumas.',
      voz: 'Divide la suma de arriba entre la suma de abajo.',
      controles: [{ id: 'k', etiqueta: 'k', color: 'c-d', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 }],
      dibujo: v => ({ datos: serieDatos([2, 3, 5], v.k), estado: {} }),
      lectura: v => [`Antecedentes ${f(10 * v.k)} ÷ consecuentes 10 = `, k, ` = ${f(v.k)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Se cumple ', { frac: [a, '3'] }, ' = ', { frac: [b, '5'] }, ' = ', { frac: [c, '7'] }, ' y ', a, ' + ', b, ' + ', c, ' = 60. ¿Cuánto vale ', b, '?'],
      opciones: [
        { id: 'c', texto: '20', correcta: true },
        { id: 'divide', texto: '12', error: 'AT-PARTES', siFuera: '12 sería 60 ÷ 5: tomaría el 5 como todas las partes. Hay 3 + 5 + 7 = 15.' },
        { id: 'tercio', texto: '15', error: 'AT-REPARTE-IGUAL', siFuera: 'Eso no usa las razones: 15 es la suma de los consecuentes.' },
        { id: 'otro', texto: '28', error: 'AT-CUAL', siFuera: '28 es c, el que tiene 7 partes.' },
      ],
      dibujo: { datos: serieDatos([3, 5, 7], 4, { sinTexto: true }), estado: {} },
      revelar: { datos: serieDatos([3, 5, 7], 4), estado: {} },
      coincide: 'Coincide: 60 ÷ 15 = 4, y b son 5 partes de 4.',
    },
    mira: {
      datos: serieDatos([3, 5, 7], 4, { pasos: true }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Cada antecedente es k veces su consecuente.', ecuacion: [a, ' = 3', k, '   ', b, ' = 5', k, '   ', c, ' = 7', k] },
        { estado: { paso: 2 }, texto: 'Los consecuentes suman 3 + 5 + 7 = 15 partes.', ecuacion: ['3 + 5 + 7 = 15'] },
        { estado: { paso: 3 }, texto: 'Los antecedentes suman 60: cada parte vale 4.', ecuacion: [k, ' = ', { frac: ['60', '15'] }, ' = 4'] },
        { estado: { paso: 3 }, texto: 'b tiene 5 partes de 4.', ecuacion: [b, ' = 5 · 4 = 20'] },
      ],
    },
    regla: {
      texto: 'Si varias razones son iguales a k, la suma de los antecedentes entre la suma de los consecuentes también es k.',
      ecuacion: [{ frac: [a, '3'] }, ' = ', { frac: [b, '5'] }, ' = … = ', k, ' ⇒ ', { frac: [[a, ' + ', b, ' + …'], '3 + 5 + …'] }, ' = ', k],
      condicion: 'ningún consecuente es cero y su suma tampoco. Con n razones, el producto de antecedentes entre el de consecuentes es kⁿ.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), bs = [r.ent(1, 4), r.ent(2, 6), r.ent(3, 8)], kk = r.ent(2, 6), i = s % 3;
        if (bs[0] === bs[1] || bs[1] === bs[2] || bs[0] === bs[2]) return this.generar(s + 977);
        const suma = bs.reduce((x, y) => x + y, 0), total = suma * kk, nom = ['a', 'b', 'c'][i];
        const v = (t, col) => ({ v: col, t });
        return {
          pregunta: ['Se cumple ', { frac: [v('a', 'c-o'), String(bs[0])] }, ' = ', { frac: [v('b', 'c-o'), String(bs[1])] }, ' = ', { frac: [v('c', 'c-o'), String(bs[2])] }, ` y a + b + c = ${f(total)}. ¿Cuánto vale ${nom}?`],
          opciones: opciones(bs[i] * kk, [
            { id: 'divide', valor: total / bs[i], error: 'AT-PARTES', siFuera: `Eso toma ${bs[i]} como todas las partes; hay ${suma}.` },
            { id: 'igual', valor: total / 3, error: 'AT-REPARTE-IGUAL', siFuera: 'Eso reparte en tres partes iguales, sin usar las razones.' },
            { id: 'k', valor: kk, error: 'AT-CONSTANTE', siFuera: `Ese es k, lo que vale cada parte; ${nom} tiene ${bs[i]} partes.` },
          ], f),
          solucion: { texto: `Cada parte vale ${f(total)} ÷ ${suma}.`, ecuacion: [k, ` = ${f(total)} ÷ ${suma} = ${f(kk)} → ${nom} = ${bs[i]} · ${f(kk)} = ${f(bs[i] * kk)}`] },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.razones-y-proporciones',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tiras.js', '/nucleo/kit/piezas/recta.js'],
    historia: {
      texto: 'En la matemática griega había longitudes que ninguna unidad común medía un número entero de veces. La teoría atribuida a Eudoxo, conservada en el libro V de los Elementos, comparaba esas magnitudes por sus múltiplos. No eran todavía fracciones escritas como hoy. Una proporción afirma que dos comparaciones son iguales: primero se decide qué se compara y en qué orden.',
      pregunta: '¿Cómo compararías dos largos sin una regla común?',
      fuente: { titulo: 'O’Connor y Robertson, Eudoxus — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Eudoxus/' },
    },
    ideas: [comparar, proporcion, medias, serie],
  };
});
