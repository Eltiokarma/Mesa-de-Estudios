/*
 * Teoría de «Números complejos» (algebra.numeros-complejos). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 14), expediente teoria-152-unidades (Álgebra) y
 * historia-ecuaciones (pp. 57–68). Errores: los CX de plantillas/numeros-complejos/ (hipótesis) y TAL-* nuevos.
 * Colores (regla 4): z naranja (c-o), w turquesa (c-i), el resultado verde (c-d), el conjugado y lo que falla rojo (c-h).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · ver cada complejo como una flecha del plano y cada operación como un movimiento de esa flecha.
 * Persona y condiciones · 5.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · opera en forma binómica y polar, halla módulo, conjugado, potencias, todas las raíces y regiones.
 * Orden de atención · 1.º la flecha z · 2.º la flecha que resulta · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué multiplicar gira y estira, y por qué una raíz cúbica de 8 no es solo 2.
 * Gesto (ronda 2) · se arrastra la punta de la flecha z (ideas 1 a 4), la raíz vecina que se acerca o se aleja de la
 *   primera (idea 5, cambia n) y el borde de la región (idea 6). Laboratorio: dos flechas con cuatro operaciones, la
 *   espiral de las potencias (el caso |z| ≠ 1 que las ideas no muestran) y un disco con centro, radio y punto libres.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const z = { v: 'c-o', t: 'z' }, w = { v: 'c-i', t: 'w' }, I = { v: 'c-d', t: 'i' };
  const RAD = Math.PI / 180;
  const limpio = x => { const r = Math.round(x * 1e9) / 1e9; return Object.is(r, -0) ? 0 : r; };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r.mezclar = l => { const x = l.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  // a + bi escrito como se escribe a mano: «−2 + i», «3i», «4», «1 − 2,5i».
  function fc(a, b, d = 2) {
    a = limpio(a); b = limpio(b);
    if (Math.abs(b) < 1e-9) return f(a, d);
    const bi = Math.abs(Math.abs(b) - 1) < 1e-9 ? 'i' : `${f(Math.abs(b), d)}i`;
    if (Math.abs(a) < 1e-9) return b < 0 ? `−${bi}` : bi;
    return `${f(a, d)} ${b < 0 ? '−' : '+'} ${bi}`;
  }
  const mul = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
  const porI = ([a, b]) => [-b, a];
  const cis = (r, g) => [limpio(r * Math.cos(g * RAD)), limpio(r * Math.sin(g * RAD))];
  const red = g => ((g % 360) + 360) % 360;
  const raizTxt = n => { const k = Math.round(Math.sqrt(n)); return k * k === n ? f(k) : `√${n}`; };
  // El plano complejo de la pieza «flechas» con una ventana fija de ±L (dos flechas de largo 0 fijan la escala).
  // caja = [x0, y0, x1, y1] ajusta la ventana a lo que hay que mostrar (la escala es la misma en los dos ejes).
  const plano = (L, flechas, extra = {}, caja = [-L, -L, L, L]) => Object.assign({ ejes: true, flechas: [...flechas, { de: [caja[0], caja[1]], a: [caja[0], caja[1]] }, { de: [caja[2], caja[3]], a: [caja[2], caja[3]] }] }, extra);
  const fl = (p, color, rotulo, o = {}) => Object.assign({ de: [0, 0], a: p, color, rotulo }, o);
  const SUPS = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'], supTxt = n => String(n).split('').map(c => SUPS[+c]).join('');

  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de la pieza. Cada juego fija la ventana del
  // plano (dos flechas de largo 0 en las esquinas), así que la escala no cambia mientras se arrastra: la geometría se
  // calcula con los mismos datos que dibuja el juego y el punto del dedo se pasa a número complejo con su inversa.
  const FL = () => Kit.piezas.flechas, EJES = () => Kit.piezas.ejes;
  const aPx = (datos, p) => { const g = FL().geometria(datos); return { x: g.X(p[0]), y: g.Y(p[1]) }; };
  const deltaPx = (datos, pt) => { const g = FL().geometria(datos); return [(pt.x - g.X(0)) / g.s, (g.Y(0) - pt.y) / g.s]; };
  // Ángulo de un punto en grados: los de abajo a la izquierda pasan a (180°, 270°) para que el arrastre no salte de 0 a 120.
  const angulo = ([px, py], corte = -90) => { const g = Math.atan2(py, px) / RAD; return g < corte ? g + 360 : g; };
  const puntaZ = (dibujo, cx, cy) => ({
    id: 'punta-z', etiqueta: 'punta de la flecha z', color: 'c-o',
    donde: val => aPx(dibujo(val).datos, [val[cx], val[cy]]),
    mover: (pt, val) => { const [px, py] = deltaPx(dibujo(val).datos, pt); return { [cx]: px, [cy]: py }; },
  });

  // ---------- Idea 1: multiplicar por i gira 90° ----------
  // Cambia: la flecha z y cuántas veces se multiplica por i · Permanece: el largo de la flecha · Progresa: el giro
  // de 90° en 90° · Se reserva: el cuarto giro, que vuelve a z · Debe verse: i² = −1 es media vuelta.
  // Se agarra: la punta de z (a y b a la vez); la flecha verde gira con ella.
  const POT = ['1', 'i', '−1', '−i'];
  const supI = k => (k === 1 ? [I] : [{ sup: [I, String(k)] }]);
  const dibujoGiro = val => {
    let p = [val.a, val.b];
    for (let k = 0; k < val.k; k++) p = porI(p);
    const ang = Math.atan2(val.b, val.a) / RAD;
    const arcos = val.k > 0 && val.k < 4 && (val.a || val.b) ? [{ en: [0, 0], de: red(ang), a: red(ang + 90 * val.k), texto: `${90 * val.k}°`, color: 'd', radio: 22 }] : [];
    return { datos: plano(3.3, [fl([val.a, val.b], 'o', 'z'), ...(val.k ? [fl(p, 'd', val.k === 1 ? 'z·i' : `z·i${supTxt(val.k)}`)] : [])], { angulos: arcos }), estado: {} };
  };
  const giro = {
    id: 'por-i-gira',
    titulo: 'Multiplicar por i gira 90°',
    temas: ['Unidad imaginaria'],
    pieza: 'flechas',
    juega: {
      consigna: 'Elige z = a + bi y cuántas veces lo multiplicas por i. Mira hacia dónde va la flecha verde y si cambia su largo.',
      voz: 'Creo que hay un patrón en los giros. Prueba varias veces.',
      controles: [
        { id: 'a', etiqueta: 'a', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
        { id: 'k', etiqueta: 'Veces por i', min: 0, max: 4, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: dibujoGiro,
      lectura: val => { let p = [val.a, val.b]; for (let k = 0; k < val.k; k++) p = porI(p); return [z, ' · ', ...(val.k ? supI(val.k) : ['1']), ` = ${fc(...p)}`]; },
      minimo: 4,
      // Se arrastra la punta de z; la flecha verde la sigue girada. Las veces por i quedan en − y +: la flecha
      // verde con k = 0 y k = 4 cae encima de z, y una segunda manija ahí no se distinguiría de la primera.
      arrastres: [puntaZ(dibujoGiro, 'a', 'b')],
    },
    predice: (() => {
      const n = 50, r = n % 4;
      return {
        pregunta: ['Cada multiplicación por ', I, ' gira 90°. ¿Cuánto vale ', { sup: [I, String(n)] }, '?'],
        opciones: [
          { id: 'c', texto: POT[r], correcta: true },
          { id: 'uno', texto: POT[0], error: 'CX4', siFuera: `1 sería cierto si ${n} fuera múltiplo de 4; ${n} entre 4 deja resto ${r}.` },
          { id: 'i', texto: POT[1], error: 'CX2', siFuera: `i sale con resto 1; ${n} entre 4 deja resto ${r}.` },
          { id: 'menos-i', texto: POT[3], error: 'CX4', siFuera: `−i sale con resto 3; ${n} entre 4 deja resto ${r}.` },
        ],
        dibujo: { datos: plano(1.6, [fl([1, 0], 'o', '1')]), estado: {} },
        revelar: { datos: plano(1.6, [fl([1, 0], 'o', '1'), fl(cis(1, 90 * r), 'd', `i${supTxt(n)}`)], { puntos: [{ x: 0, y: 1, rotulo: 'i' }, { x: -1, y: 0, rotulo: '−1' }, { x: 0, y: -1, rotulo: '−i' }] }), estado: {} },
        coincide: `Coincide: ${n} = 4 · ${Math.floor(n / 4)} + ${r}; los grupos de cuatro giros vuelven al inicio.`,
      };
    })(),
    mira: (() => {
      const z0 = [2, 1], ps = [z0]; for (let k = 1; k <= 4; k++) ps.push(porI(ps[k - 1]));
      return {
        datos: plano(2.4, [
          fl(z0, 'o', 'z'),
          fl(ps[1], 'd', 'z·i', { paso: 2 }), fl(ps[2], 'd', 'z·i²', { paso: 3 }), fl(ps[3], 'd', 'z·i³', { paso: 4 }),
        ], { angulos: [{ en: [0, 0], de: red(Math.atan2(1, 2) / RAD), a: red(Math.atan2(1, 2) / RAD + 90), texto: '90°', color: 'd', paso: 2, radio: 20 }] }),
        voz: 'Comprobemos el giro con un z concreto.',
        pasos: [
          { estado: { paso: 1 }, texto: 'z = 2 + i: dos a la derecha, uno arriba.', ecuacion: [z, ' = 2 + i'] },
          { estado: { paso: 2 }, texto: 'Por i: la parte real pasa arriba y la imaginaria, a la izquierda.', ecuacion: ['(2 + i)·', I, ` = 2i + i² = ${fc(...ps[1])}`] },
          { estado: { paso: 3 }, texto: 'Otra vez por i: media vuelta. Por eso i² = −1.', ecuacion: [z, '·', { sup: [I, '2'] }, ` = ${fc(...ps[2])} = −`, z] },
          { estado: { paso: 4 }, texto: 'Tres giros: tres cuartos de vuelta.', ecuacion: [z, '·', { sup: [I, '3'] }, ` = ${fc(...ps[3])}`] },
          { estado: { paso: 4 }, texto: 'El cuarto giro vuelve a z: i⁴ = 1.', ecuacion: [z, '·', { sup: [I, '4'] }, ` = ${fc(...ps[4])} = `, z] },
        ],
      };
    })(),
    regla: {
      texto: 'i² = −1. Multiplicar por i gira la flecha 90° en sentido antihorario sin cambiar su largo. Cuatro giros vuelven al inicio: iⁿ depende del resto de n entre 4.',
      ecuacion: ['(a + b', I, ')·', I, ' = ', { llave: ['−b + a', I], nota: 'girada 90°', color: 'c-d' }, '   ·   ', { sup: [I, '4'] }, ' = 1'],
      condicion: 'a y b son reales; el eje real va a la derecha y el imaginario hacia arriba.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const n = r.ent(11, 99), k = n % 4;
          return {
            pregunta: ['¿Cuánto vale ', { sup: [I, String(n)] }, '?'],
            opciones: [0, 1, 2, 3].map(j => (j === k ? { id: 'c', texto: POT[j], correcta: true }
              : { id: `r${j}`, texto: POT[j], error: j === 0 ? 'CX4' : 'TAL-I-RESTO', siFuera: `${POT[j]} sale cuando el resto entre 4 es ${j}; ${n} deja resto ${k}.` })),
            solucion: { texto: `${n} = 4 · ${Math.floor(n / 4)} + ${k}: los grupos de cuatro valen 1.`, ecuacion: [{ sup: [I, String(n)] }, ' = ', { sup: [I, String(k)] }, ` = ${POT[k]}`] },
          };
        }
        let a, b; do { a = r.ent(-4, 4); b = r.ent(-4, 4); } while (a === 0 || b === 0 || Math.abs(a) === Math.abs(b));
        const k = r.ent(1, 3);
        const ps = [[a, b]]; for (let j = 1; j <= 3; j++) ps.push(porI(ps[j - 1]));
        return {
          pregunta: [z, ` = ${fc(a, b)}. ¿Cuánto vale `, z, ' · ', ...supI(k), '?'],
          dibujo: { datos: plano(4.5, [fl([a, b], 'o', 'z')]), estado: {} },
          opciones: distintas([
            { id: 'c', texto: fc(...ps[k]), correcta: true },
            ...[1, 2, 3].filter(j => j !== k).map(j => ({ id: `g${j}`, texto: fc(...ps[j]), error: 'TAL-I-RESTO', siFuera: `Ese es el giro de ${90 * j}°; aquí ${k === 1 ? 'hay un giro' : `hay ${k} giros`} de 90°.` })),
            { id: 'cambia', texto: fc(b, a), error: 'CX1', siFuera: 'Intercambiar partes sin cambiar signo no es girar: i · bi = −b.' },
            { id: 'cero', texto: fc(a, b), error: 'CX6', siFuera: 'Esa es z sin girar; cada factor i gira 90°.' },
          ]).slice(0, 4),
          solucion: { texto: `Cada factor i gira 90°: ${k === 1 ? 'un giro' : `${k} giros`} en total.`, ecuacion: [`(${fc(a, b)})·`, ...supI(k), ` = ${fc(...ps[k])}`], dibujo: { datos: plano(4.5, [fl([a, b], 'o', 'z'), fl(ps[k], 'd', 'resultado')]), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: sumar componentes, multiplicar distribuyendo ----------
  // Cambia: z y la operación · Permanece: w = 1 + i · Progresa: la flecha resultado · Se reserva: el término i·i que
  // cambia de signo · Debe verse: la suma es el paralelogramo; el producto no es «parte con parte».
  // Se agarra: la punta de z; w queda fija para que el cambio de la flecha verde se deba solo a z.
  const W2 = [1, 1];
  const dibujoBin = val => {
    const p = [val.a, val.b], res = val.op === 'suma' ? [val.a + 1, val.b + 1] : mul(p, W2);
    const guias = val.op === 'suma' ? [{ de: p, a: res }, { de: W2, a: res }] : [];
    return { datos: plano(4.2, [fl(p, 'o', 'z'), fl(W2, 'i', 'w'), fl(res, 'd', val.op === 'suma' ? 'z + w' : 'z·w')], { guias }), estado: {} };
  };
  const binomica = {
    id: 'forma-binomica',
    titulo: 'Sumar partes, multiplicar distribuyendo',
    temas: ['Forma binómica y operaciones'],
    pieza: 'flechas',
    juega: {
      consigna: 'Elige z = a + bi y la operación con w = 1 + i. Compara la flecha verde de la suma con la del producto.',
      voz: 'La suma arma un paralelogramo. Mira qué hace el producto.',
      controles: [
        { id: 'a', etiqueta: 'a', min: -2, max: 2, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
        { id: 'op', etiqueta: 'Operación', opciones: [{ valor: 'suma', texto: 'z + w' }, { valor: 'producto', texto: 'z · w' }] },
      ],
      dibujo: dibujoBin,
      arrastres: [puntaZ(dibujoBin, 'a', 'b')],
      lectura: val => { const res = val.op === 'suma' ? [val.a + 1, val.b + 1] : mul([val.a, val.b], W2); return [z, val.op === 'suma' ? ' + ' : ' · ', w, ` = ${fc(...res)}`]; },
      minimo: 4,
    },
    predice: (() => {
      const A = [2, 3], B = [1, 1], P = mul(A, B);
      return {
        pregunta: ['¿Cuánto vale (2 + 3i)(1 + i)?'],
        opciones: [
          { id: 'c', texto: fc(...P), correcta: true },
          { id: 'partes', texto: fc(A[0] * B[0], A[1] * B[1]), error: 'CX7', siFuera: 'Eso multiplica real con real e imaginaria con imaginaria; faltan los productos cruzados.' },
          { id: 'i2', texto: fc(A[0] * B[0] + A[1] * B[1], A[0] * B[1] + A[1] * B[0]), error: 'CX1', siFuera: 'Eso sería cierto si i² fuera 1; 3i · i = 3i² = −3.' },
          { id: 'suma', texto: fc(A[0] + B[0], A[1] + B[1]), error: 'TAL-SUMA', siFuera: 'Esa es la suma, que junta partes; el producto distribuye.' },
        ],
        dibujo: { datos: plano(0, [fl(A, 'o', 'z'), fl(B, 'i', 'w')], {}, [-1.5, -0.3, 3, 5.3]), estado: {} },
        revelar: { datos: plano(0, [fl(A, 'o', 'z'), fl(B, 'i', 'w'), fl(P, 'd', 'z·w')], {}, [-1.5, -0.3, 3, 5.3]), estado: {} },
        coincide: `Coincide: 2 + 2i + 3i + 3i², y 3i² = −3; queda ${fc(...P)}.`,
      };
    })(),
    mira: (() => {
      const A = [2, 3], B = [1, 1], P = mul(A, B);
      return {
        datos: plano(0, [fl(A, 'o', 'z'), fl(B, 'i', 'w'), fl(P, 'd', 'z·w', { paso: 5 })], {}, [-1.5, -0.3, 3, 5.3]),
        pasos: [
          { estado: { paso: 1 }, texto: 'Cada término de z multiplica a cada término de w.', ecuacion: ['(2 + 3i)(1 + i) = 2·1 + 2·i + 3i·1 + 3i·i'] },
          { estado: { paso: 2 }, texto: 'Los tres primeros productos son directos.', ecuacion: ['2 + 2i + 3i'] },
          { estado: { paso: 3 }, texto: 'El último lleva i · i = i², que vale −1.', ecuacion: ['3i·i = 3', { sup: [I, '2'] }, ' = −3'] },
          { estado: { paso: 4 }, texto: 'Se juntan las partes reales y las imaginarias.', ecuacion: ['(2 − 3) + (2 + 3)i'] },
          { estado: { paso: 5 }, texto: 'El producto apunta a otro lado: no es parte con parte.', ecuacion: [z, '·', w, ` = ${fc(...P)}`] },
        ],
      };
    })(),
    regla: {
      texto: 'La suma junta las partes reales y las imaginarias por separado. El producto distribuye término a término y cambia i² por −1.',
      ecuacion: ['(a + bi)(c + di) = ', { llave: ['(ac − bd)'], nota: 'parte real', color: 'c-d' }, ' + ', { llave: ['(ad + bc)i'], nota: 'parte imaginaria', color: 'c-d' }],
      condicion: 'a, b, c y d son reales; la parte imaginaria de a + bi es b, sin la i.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let A, B; do { A = [r.ent(-4, 4), r.ent(-4, 4)]; B = [r.ent(-3, 3), r.ent(-3, 3)]; } while (!A[1] || !B[1] || !B[0] || !A[0]);
        const op = ['producto', 'producto', 'suma', 'resta'][s % 4];
        const pa = v => (v < 0 ? `(${f(v)})` : f(v));
        const bien = op === 'producto' ? mul(A, B) : op === 'suma' ? [A[0] + B[0], A[1] + B[1]] : [A[0] - B[0], A[1] - B[1]];
        const signo = op === 'producto' ? '·' : op === 'suma' ? '+' : '−';
        const malos = op === 'producto' ? [
          { id: 'partes', v: [A[0] * B[0], A[1] * B[1]], error: 'CX7', siFuera: 'Faltan los productos cruzados: a·di y bi·c.' },
          { id: 'i2', v: [A[0] * B[0] + A[1] * B[1], A[0] * B[1] + A[1] * B[0]], error: 'CX1', siFuera: 'Eso usa i² = 1; en realidad i² = −1.' },
          { id: 'suma', v: [A[0] + B[0], A[1] + B[1]], error: 'TAL-SUMA', siFuera: 'Esa es la suma; el producto distribuye.' },
          { id: 'cruz', v: [A[0] * B[0] - A[1] * B[1], A[0] * B[1] - A[1] * B[0]], error: 'TAL-SIGNO', siFuera: 'La parte imaginaria suma ad + bc; no resta.' },
        ] : [
          { id: 'cruz', v: op === 'suma' ? [A[0] + B[1], A[1] + B[0]] : [A[0] - B[1], A[1] - B[0]], error: 'TAL-PARTES', siFuera: 'Eso mezcla una parte real con una imaginaria.' },
          { id: 'prod', v: mul(A, B), error: 'TAL-SUMA', siFuera: 'Ese es el producto; aquí se pide la ' + op + '.' },
          { id: 'signo', v: op === 'suma' ? [A[0] - B[0], A[1] - B[1]] : [A[0] + B[0], A[1] + B[1]], error: 'TAL-SIGNO', siFuera: op === 'suma' ? 'Eso resta; aquí se suma.' : 'Eso suma; al restar, cada parte de w cambia de signo.' },
          { id: 'solo-real', v: op === 'suma' ? [A[0] + B[0], A[1]] : [A[0] - B[0], A[1]], error: 'TAL-PARTES', siFuera: 'Falta operar también las partes imaginarias.' },
        ];
        return {
          pregunta: [z, ` = ${fc(...A)} y `, w, ` = ${fc(...B)}. ¿Cuánto vale `, z, ` ${signo} `, w, '?'],
          opciones: distintas([{ id: 'c', texto: fc(...bien), correcta: true }, ...malos.map(m => ({ id: m.id, texto: fc(...m.v), error: m.error, siFuera: m.siFuera }))]).slice(0, 4),
          solucion: {
            texto: op === 'producto' ? 'Se distribuye y se cambia i² por −1.' : 'Real con real e imaginaria con imaginaria.',
            ecuacion: op === 'producto' ? [`(${pa(A[0])}·${pa(B[0])} − ${pa(A[1])}·${pa(B[1])}) + (${pa(A[0])}·${pa(B[1])} + ${pa(A[1])}·${pa(B[0])})i = ${fc(...bien)}`] : [z, ` ${signo} `, w, ` = ${fc(...bien)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 3: el conjugado es el reflejo; el módulo, el largo ----------
  // Cambia: a y b · Permanece: el eje real como espejo · Progresa: catetos, módulo y producto z·z̄ · Se reserva: el
  // denominador que queda real al dividir · Debe verse: z·z̄ cae sobre el eje real y vale |z|².
  // Se agarra: la punta de z; el reflejo rojo la sigue del otro lado del eje real.
  const dibujoConj = val => ({ datos: plano(4.5, [fl([val.a, val.b], 'o', 'z'), ...(val.b ? [fl([val.a, -val.b], 'h', 'z̄')] : [])], { guias: [{ de: [0, 0], a: [val.a, 0] }, { de: [val.a, 0], a: [val.a, val.b] }] }), estado: {} });
  const conj = {
    id: 'conjugado-modulo',
    titulo: 'Reflejo y largo de la flecha',
    temas: ['Conjugado y módulo'],
    pieza: 'flechas',
    juega: {
      consigna: 'Elige a y b. La flecha roja es el conjugado, a − bi. Las líneas punteadas son los catetos a y b.',
      voz: 'Mira dónde cae el conjugado respecto del eje real.',
      controles: [
        { id: 'a', etiqueta: 'a', min: -4, max: 4, paso: 1, inicio: 3, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: -4, max: 4, paso: 1, inicio: 4, decimales: 0, color: 'c-o' },
      ],
      dibujo: dibujoConj,
      lectura: val => [{ abs: [z] }, ` = ${raizTxt(val.a ** 2 + val.b ** 2)}   ·   `, z, '·z̄', ` = ${val.a ** 2 + val.b ** 2}`],
      minimo: 3,
      arrastres: [puntaZ(dibujoConj, 'a', 'b')],
    },
    predice: (() => {
      const A = [2, 1], C = [2, -1], P = mul(A, C);
      return {
        pregunta: ['¿Cuánto vale (2 + i)(2 − i)?'],
        opciones: [
          { id: 'c', texto: fc(...P), correcta: true },
          { id: 'i2', texto: fc(4 - 1, 0), error: 'CX1', siFuera: '3 sería cierto si i² fuera 1; aquí −i·i = −i² = +1.' },
          { id: 'real', texto: '4', error: 'TAL-SOLO-REAL', siFuera: '4 es solo 2·2; falta el producto de las partes imaginarias.' },
          { id: 'partes', texto: fc(4, -1), error: 'CX7', siFuera: 'Eso multiplica parte con parte; los cruzados 2i y −2i se cancelan.' },
        ],
        dibujo: { datos: plano(0, [fl(A, 'o', 'z'), fl(C, 'h', 'z̄')], {}, [-0.4, -1.6, 5.4, 1.6]), estado: {} },
        revelar: { datos: plano(0, [fl(A, 'o', 'z'), fl(C, 'h', 'z̄'), fl(P, 'd', 'z·z̄ = 5')], {}, [-0.4, -1.6, 5.4, 1.6]), estado: {} },
        coincide: `Coincide: 4 − 2i + 2i − i² = 4 + 1 = ${fc(...P)}, un número real.`,
      };
    })(),
    mira: (() => {
      const A = [3, 4], num = mul(A, [1, -2]);
      return {
        datos: plano(4.4, [fl(A, 'o', 'z', { valor: '5', valorPaso: 3 }), fl([3, -4], 'h', 'z̄', { paso: 2 })], { guias: [{ de: [0, 0], a: [3, 0], paso: 3 }, { de: [3, 0], a: [3, 4], paso: 3 }] }),
        pasos: [
          { estado: { paso: 1 }, texto: 'z = 3 + 4i.', ecuacion: [z, ' = 3 + 4i'] },
          { estado: { paso: 2 }, texto: 'El conjugado cambia el signo de b: se refleja en el eje real.', ecuacion: ['z̄ = 3 − 4i'] },
          { estado: { paso: 3 }, texto: 'El módulo es la hipotenusa de los catetos 3 y 4.', ecuacion: [{ abs: [z] }, ' = ', { llave: [{ raiz: ['3² + 4²'] }], nota: 'hipotenusa', color: 'c-o' }, ' = 5'] },
          { estado: { paso: 3 }, texto: 'z por su conjugado da un número real: el módulo al cuadrado.', ecuacion: [z, '·z̄ = 9 + 16 = 25 = ', { sup: [{ abs: [z] }, '2'] }] },
          { estado: { paso: 3 }, texto: 'Para dividir, se multiplica arriba y abajo por el conjugado del divisor.', ecuacion: [{ frac: ['3 + 4i', '1 + 2i'] }, ' = ', { frac: ['(3 + 4i)(1 − 2i)', '1 + 4'] }, ' = ', { frac: [fc(...num), '5'] }] },
        ],
      };
    })(),
    regla: {
      texto: 'El conjugado de a + bi es a − bi, su reflejo en el eje real. El módulo es el largo de la flecha; z por su conjugado da su cuadrado.',
      ecuacion: [{ abs: [z] }, ' = ', { llave: [{ raiz: ['a² + b²'] }], nota: 'largo', color: 'c-o' }, '   ·   ', z, '·', { llave: ['z̄'], nota: 'reflejo', color: 'c-h' }, ' = ', { sup: [{ abs: [z] }, '2'] }],
      condicion: 'para dividir entre w se multiplica arriba y abajo por w̄, y w tiene que ser distinto de 0.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const [p, q, h] = r.uno([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [12, 5, 13], [4, 3, 5]]);
          const a = p * r.uno([1, -1]), b = q * r.uno([1, -1]);
          return {
            pregunta: [z, ` = ${fc(a, b)}. ¿Cuánto vale `, { abs: [z] }, '?'],
            opciones: distintas([
              { id: 'c', texto: f(h), correcta: true },
              { id: 'suma', texto: f(p + q), error: 'CX19', siFuera: 'Eso suma los catetos; el módulo es la hipotenusa.' },
              { id: 'sin-raiz', texto: f(h * h), error: 'CX11', siFuera: `Eso es a² + b²; falta la raíz: √${h * h}.` },
              { id: 'resta', texto: f(Math.abs(p - q) || h + 1), error: 'TAL-MOD-RESTA', siFuera: 'Los catetos no se restan: se elevan al cuadrado y se suman.' },
            ]),
            solucion: { texto: 'Catetos |a| y |b|; el módulo es la hipotenusa.', ecuacion: [{ abs: [z] }, ' = ', { raiz: [`${p}² + ${q}²`] }, ` = ${h}`] },
          };
        }
        if (tipo === 1) {
          let a, b; do { a = r.ent(-6, 6); b = r.ent(-6, 6); } while (!a || !b);
          const n = a * a + b * b;
          return {
            pregunta: [z, ` = ${fc(a, b)}. ¿Cuánto vale `, z, ' · z̄?'],
            opciones: distintas([
              { id: 'c', texto: f(n), correcta: true },
              { id: 'i2', texto: f(a * a - b * b), error: 'CX1', siFuera: 'Eso usa i² = 1; el término −b²i² suma b².' },
              { id: 'partes', texto: fc(a * a, -b * b), error: 'CX7', siFuera: 'Eso multiplica parte con parte; el resultado es real.' },
              { id: 'raiz', texto: raizTxt(n), error: 'TAL-MOD-NO-CUAD', siFuera: 'Ese es el módulo; z·z̄ es el módulo al cuadrado.' },
            ]),
            solucion: { texto: 'Los términos con i se cancelan y queda a² + b².', ecuacion: [z, `·z̄ = ${a * a} + ${b * b} = ${n}`] },
          };
        }
        // División exacta: se elige el cociente q y el divisor v; el dividendo es q·v.
        let q, v; do { q = [r.ent(-3, 3), r.ent(-3, 3)]; v = [r.ent(-2, 2), r.ent(1, 3)]; } while (!q[0] || !q[1] || !v[0]);
        const u = mul(q, v);
        return {
          pregunta: ['¿Cuánto vale ', { frac: [fc(...u), fc(...v)] }, '?'],
          opciones: distintas([
            { id: 'c', texto: fc(...q), correcta: true },
            { id: 'conj', texto: fc(q[0], -q[1]), error: 'TAL-CONJ-SIGNO', siFuera: 'Ese es el conjugado del cociente; revisa el signo de la parte imaginaria.' },
            { id: 'opuesto', texto: fc(-q[0], -q[1]), error: 'CX13', siFuera: 'Ese es el opuesto; multiplícalo por el divisor y compara.' },
            { id: 'cambia', texto: fc(q[1], q[0]), error: 'CX14', siFuera: 'Eso intercambia la parte real con la imaginaria.' },
          ]),
          solucion: { texto: `Por el conjugado ${fc(v[0], -v[1])} arriba y abajo; abajo queda ${v[0] ** 2 + v[1] ** 2}.`, ecuacion: [{ frac: [`(${fc(...u)})(${fc(v[0], -v[1])})`, String(v[0] ** 2 + v[1] ** 2)] }, ` = ${fc(...q)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: multiplicar estira y gira ----------
  // Cambia: el módulo y el argumento de z · Permanece: w = 1,5 con 60° · Progresa: el ángulo que se suma y el largo
  // que se multiplica · Se reserva: la potencia (De Moivre) · Debe verse: los ángulos se suman, los módulos se multiplican.
  const POLAR = (r, g) => `${f(r)}(cos ${f(red(g), 0)}° + i sen ${f(red(g), 0)}°)`;
  // Se agarra: la punta de z, que fija a la vez su largo r y su ángulo θ; w queda quieta como referencia.
  const dibujoPolar = val => {
    const P = cis(val.r * 1.5, val.t + 60);
    return { datos: plano(0, [fl(cis(val.r, val.t), 'o', 'z'), fl(cis(1.5, 60), 'i', 'w'), fl(P, 'd', 'z·w')], { angulos: [{ en: [0, 0], de: 0, a: val.t + 60, texto: `${val.t + 60}°`, color: 'd', radio: 30 }] }, [-3.9, -0.4, 3.9, 3.9]), estado: {} };
  };
  // corte: desde qué ángulo negativo se suma una vuelta (−90° si el control llega a 120°; −7,5° si llega a 345°).
  const puntaPolar = (dibujo, cr, ct, id = 'punta-z', color = 'c-o', nombre = 'z', corte = -90) => ({
    id, etiqueta: `punta de la flecha ${nombre}: largo y ángulo`, color,
    donde: val => aPx(dibujo(val).datos, cis(val[cr], val[ct])),
    mover: (pt, val) => { const q = deltaPx(dibujo(val).datos, pt); return { [cr]: Math.hypot(q[0], q[1]), [ct]: angulo(q, corte) }; },
  });
  const polar = {
    id: 'polar',
    titulo: 'Multiplicar estira y gira',
    temas: ['Forma polar y exponencial', 'Fórmula de De Moivre y raíces'],
    pieza: 'flechas',
    juega: {
      consigna: 'Elige el módulo r y el argumento θ de z. La flecha turquesa w tiene módulo 1,5 y argumento 60°. Mira el producto.',
      voz: 'Fíjate en el ángulo del producto. ¿Se suman o se multiplican?',
      controles: [
        { id: 'r', etiqueta: 'r', min: 1.5, max: 2.5, paso: 0.5, inicio: 2, decimales: 1, color: 'c-o' },
        { id: 't', etiqueta: 'θ', min: 0, max: 120, paso: 15, inicio: 30, unidad: '°', decimales: 0, color: 'c-o' },
      ],
      dibujo: dibujoPolar,
      arrastres: [puntaPolar(dibujoPolar, 'r', 't')],
      lectura: val => [z, '·', w, `: módulo ${f(val.r * 1.5)}, argumento ${f(val.t + 60, 0)}°`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Un complejo tiene módulo 1,5 y argumento 30°; otro, módulo 2 y argumento 60°. ¿Cómo es su producto?',
      opciones: [
        { id: 'c', texto: `Módulo ${f(1.5 * 2)} y argumento ${30 + 60}°`, correcta: true },
        { id: 'suma-mod', texto: `Módulo ${f(1.5 + 2)} y argumento ${30 + 60}°`, error: 'CX19', siFuera: 'Los argumentos sí se suman; los módulos, en cambio, se multiplican: 1,5 · 2.' },
        { id: 'mult-arg', texto: `Módulo ${f(1.5 * 2)} y argumento ${30 * 60}°`, error: 'CX20', siFuera: 'Los módulos sí se multiplican; los argumentos se suman: 30° + 60°.' },
        { id: 'resta-arg', texto: `Módulo ${f(1.5 * 2)} y argumento ${60 - 30}°`, error: 'CX21', siFuera: 'Restar argumentos sale al dividir; al multiplicar, se suman.' },
      ],
      dibujo: { datos: plano(0, [fl(cis(1.5, 30), 'o', 'z'), fl(cis(2, 60), 'i', 'w')], {}, [-0.5, -0.3, 1.7, 3.2]), estado: {} },
      revelar: { datos: plano(0, [fl(cis(1.5, 30), 'o', 'z'), fl(cis(2, 60), 'i', 'w'), fl(cis(3, 90), 'd', 'z·w = 3i')], { angulos: [{ en: [0, 0], de: 0, a: 90, texto: '90°', color: 'd', radio: 22 }] }, [-0.5, -0.3, 1.7, 3.2]), estado: {} },
      coincide: 'Coincide: 1,5 · 2 = 3 y 30° + 60° = 90°; el producto es 3i.',
    },
    mira: {
      datos: plano(0, [fl(cis(1.5, 30), 'o', 'z'), fl(cis(2, 60), 'i', 'w', { paso: 2 }), fl(cis(3, 90), 'd', 'z·w', { paso: 4 })], {
        angulos: [{ en: [0, 0], de: 0, a: 30, texto: '30°', color: 'o', paso: 1, radio: 46 }, { en: [0, 0], de: 0, a: 60, texto: '60°', color: 'i', paso: 2, radio: 30 }],
      }, [-0.5, -0.3, 1.7, 3.2]),
      voz: 'Creo que conviene mirar largo y ángulo por separado.',
      pasos: [
        { estado: { paso: 1 }, texto: 'z: largo 1,5, inclinada 30° desde el eje real.', ecuacion: [z, ` = ${POLAR(1.5, 30)}`] },
        { estado: { paso: 2 }, texto: 'w: largo 2, inclinada 60°.', ecuacion: [w, ` = ${POLAR(2, 60)}`] },
        { estado: { paso: 3 }, texto: 'El producto multiplica los largos.', ecuacion: [{ abs: [z, '·', w] }, ` = 1,5 · 2 = ${f(1.5 * 2)}`] },
        { estado: { paso: 4 }, texto: 'Y suma los ángulos: 30° + 60° = 90°. Queda 3i.', ecuacion: [z, '·', w, ` = ${POLAR(3, 90)} = 3i`] },
        { estado: { paso: 4 }, texto: 'Elevar a n es multiplicar n veces: módulo rⁿ, ángulo nθ.', ecuacion: [{ sup: [{ par: [POLAR(2, 30)] }, '3'] }, ` = ${POLAR(8, 90)}`] },
      ],
    },
    regla: {
      texto: 'Forma polar: z = r(cos θ + i sen θ) = r·eⁱᶿ. Al multiplicar, los módulos se multiplican y los argumentos se suman: zⁿ tiene módulo rⁿ y ángulo nθ.',
      ecuacion: [{ sup: [z, 'n'] }, ' = ', { llave: [{ sup: ['r', 'n'] }], nota: 'largo', color: 'c-o' }, { llave: ['(cos nθ + i sen nθ)'], nota: 'gira nθ', color: 'c-d' }],
      condicion: 'r = |z| > 0; el argumento vale salvo vueltas de 360°, y z = 0 no tiene argumento.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const rr = r.uno([1, 2, 3]), t = r.uno([15, 30, 45, 60, 90, 120, 150]), n = r.ent(2, 4);
        const M = rr ** n, A = red(n * t);
        const op = (id, m, g, error, siFuera) => ({ id, texto: `Módulo ${f(m)} y argumento ${f(red(g), 0)}°`, error, siFuera });
        return {
          pregunta: [z, ` = ${POLAR(rr, t)}. ¿Cómo es `, { sup: [z, String(n)] }, '?'],
          opciones: distintas([
            { id: 'c', texto: `Módulo ${f(M)} y argumento ${f(A, 0)}°`, correcta: true },
            op('mod-n', n * rr, n * t, 'CX31', `El módulo no se multiplica por ${n}: se eleva a ${n}.`),
            op('arg', M, t, 'TAL-ARG-IGUAL', `El argumento también cambia: se multiplica por ${n}.`),
            op('mod', rr, n * t, 'CX30', `El argumento está bien; falta elevar el módulo a ${n}.`),
            op('arg-suma', M, t + n, 'CX5', `El argumento se multiplica por ${n}, no se le suma.`),
          ]).slice(0, 4),
          solucion: { texto: `De Moivre: módulo ${rr} a la ${n}, argumento ${n} · ${t}°.`, ecuacion: [{ sup: [z, String(n)] }, ` = ${POLAR(M, A)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: n raíces, un polígono regular ----------
  // Cambia: n y el argumento de w · Permanece: el módulo de las raíces (2) · Progresa: los vértices del polígono ·
  // Se reserva: las raíces que no están en el eje real · Debe verse: separación 360°/n, siempre n raíces.
  const raicesDe = (m, phi, n) => Array.from({ length: n }, (_, k) => cis(m, (phi + 360 * k) / n));
  // Se agarra: la segunda raíz (k = 1). Su ángulo es (φ + 360°)/n: acercarla a la primera obliga a que quepan más
  // raíces en la vuelta, así que el arrastre cambia n y el polígono se rehace entero.
  const dibujoRaices = val => {
    const R = raicesDe(2, val.phi, val.n);
    return { datos: plano(2.4, R.map((p, k) => fl(p, 'd', k === 0 ? `${f((val.phi) / val.n, 1)}°` : '')), { contorno: R }), estado: {} };
  };
  const raices = {
    id: 'raices',
    titulo: 'n raíces en un polígono',
    temas: ['Fórmula de De Moivre y raíces'],
    pieza: 'flechas',
    juega: {
      consigna: 'Elige el índice n y hacia dónde apunta w. Las flechas verdes son todas las raíces n-ésimas de w, de módulo 2.',
      voz: 'Cuenta las flechas y mide el ángulo entre vecinas.',
      controles: [
        { id: 'n', etiqueta: 'n', min: 2, max: 6, paso: 1, inicio: 3, decimales: 0, color: 'c-d' },
        { id: 'phi', etiqueta: 'w apunta', opciones: [{ valor: 0, texto: 'a 0°' }, { valor: 90, texto: 'a 90°' }, { valor: 180, texto: 'a 180°' }] },
      ],
      dibujo: dibujoRaices,
      lectura: val => [`${val.n} raíces de módulo 2, separadas ${f(360 / val.n, 0)}°`],
      minimo: 3,
      arrastres: [{
        id: 'raiz-vecina', etiqueta: 'segunda raíz: acércala a la primera', color: 'c-d',
        donde: val => aPx(dibujoRaices(val).datos, cis(2, (val.phi + 360) / val.n)),
        mover: (pt, val) => { const q = deltaPx(dibujoRaices(val).datos, pt), g = angulo(q, 0.5); return { n: (val.phi + 360) / g }; },
      }],
    },
    predice: (() => {
      const cubo = x => x ** 3;
      return {
        pregunta: '¿Cuántas raíces cúbicas tiene el número 8, contando las complejas?',
        opciones: [
          { id: 'c', texto: 'Tres: 2 y dos más, a 120° y 240°', correcta: true },
          { id: 'una', texto: 'Una sola: 2', error: 'TAL-UNA-RAIZ', siFuera: '2 sí es raíz, la real. En el plano hay otras dos con el mismo módulo.' },
          { id: 'dos', texto: 'Dos: 2 y −2', error: 'TAL-RAIZ-PAR', siFuera: `±2 vale para raíces cuadradas; (−2)³ = ${f(cubo(-2))}, no 8.` },
          { id: 'ejes', texto: 'Tres: 2, −2 y 2i', error: 'TAL-RAIZ-EJES', siFuera: `(−2)³ = ${f(cubo(-2))} y (2i)³ = −8i: no dan 8.` },
        ],
        dibujo: { datos: plano(2.4, [fl([2, 0], 'd', '2')]), estado: {} },
        revelar: { datos: plano(2.4, raicesDe(2, 0, 3).map((p, k) => fl(p, 'd', ['2', '−1 + i√3', '−1 − i√3'][k])), { contorno: raicesDe(2, 0, 3) }), estado: {} },
        coincide: 'Coincide: las tres tienen módulo 2 y argumentos 0°, 120° y 240°.',
      };
    })(),
    mira: (() => {
      const R = raicesDe(2, 0, 3);
      return {
        datos: plano(2.4, [fl(R[0], 'd', '2', { paso: 1 }), fl(R[1], 'd', '−1 + i√3', { paso: 3 }), fl(R[2], 'd', '−1 − i√3', { paso: 4 })], {
          angulos: [{ en: [0, 0], de: 0, a: 120, texto: '120°', color: 'd', paso: 3, radio: 18 }],
        }),
        pasos: [
          { estado: { paso: 1 }, texto: '8 tiene módulo 8 y argumento 0°. Una raíz es 2.', ecuacion: ['2³ = 8'] },
          { estado: { paso: 2 }, texto: 'Cada raíz cúbica tiene módulo 2, y su ángulo por 3 da vueltas enteras.', ecuacion: ['3θ = 0°, 360° o 720°'] },
          { estado: { paso: 3 }, texto: 'θ = 120°: al triplicar, 360°, que es lo mismo que 0°.', ecuacion: ['2(cos 120° + i sen 120°) = −1 + i√3'] },
          { estado: { paso: 4 }, texto: 'θ = 240°: al triplicar, 720°, dos vueltas.', ecuacion: ['2(cos 240° + i sen 240°) = −1 − i√3'] },
          { estado: { paso: 4 }, texto: 'Con 360° vuelve la primera: son exactamente tres.', ecuacion: ['θ = 0°, 120°, 240°'] },
        ],
      };
    })(),
    regla: {
      texto: 'Un complejo w distinto de 0 tiene exactamente n raíces n-ésimas. Todas tienen el mismo módulo y se separan 360°/n: son los vértices de un polígono regular.',
      ecuacion: [{ sub: [z, 'k'] }, ' = ', { llave: [{ raiz: ['r'], indice: 'n' }], nota: 'mismo largo', color: 'c-d' }, '·(cos ', { frac: ['φ + 360°k', 'n'] }, ' + i sen ', { frac: ['φ + 360°k', 'n'] }, ')'],
      condicion: 'w = r(cos φ + i sen φ) y k = 0, 1, …, n − 1; con k = n se repite la primera raíz.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const n = r.ent(2, 4), phiOk = r.uno([0, 60, 90, 120, 180, 240, 270].filter(g => g % n === 0 && g > 0 || s % 7 === 0 && g === 0));
        const m = r.ent(2, 3), R = m ** n;
        const args = Array.from({ length: n }, (_, k) => red((phiOk + 360 * k) / n));
        // Cada lista se ordena: dos listas con los mismos ángulos son la misma respuesta.
        const lista = l => l.map(red).sort((x, y) => x - y).map(g => `${f(g, 0)}°`).join(', ');
        return {
          pregunta: [w, ` = ${POLAR(R, phiOk)}. ¿Qué argumentos tienen sus raíces de índice ${n}?`],
          opciones: distintas([
            { id: 'c', texto: lista(args), correcta: true },
            { id: 'una', texto: lista([red(phiOk / n)]), error: 'TAL-UNA-RAIZ', siFuera: `Esa es una raíz; hay ${n}, separadas ${f(360 / n, 0)}°.` },
            { id: 'sin-dividir', texto: lista(Array.from({ length: n }, (_, k) => red(phiOk + 360 * k / n))), error: 'TAL-RAIZ-PHI', siFuera: `La separación está bien; el ángulo de w también se divide entre ${n}.` },
            { id: 'media', texto: lista(Array.from({ length: n }, (_, k) => red(phiOk / n + 180 * k / n))), error: 'TAL-RAIZ-SEPARA', siFuera: `Las raíces se separan 360°/${n}, no 180°/${n}.` },
          ]),
          solucion: { texto: `Se divide φ entre ${n} y se suman vueltas de ${f(360 / n, 0)}°.`, ecuacion: [`θ = ${f(phiOk, 0)}°/${n} + ${f(360 / n, 0)}°·k`], dibujo: { datos: plano(m * 1.2, raicesDe(m, phiOk, n).map(p => fl(p, 'd', '')), { contorno: n > 2 ? raicesDe(m, phiOk, n) : undefined }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 6: |z − z₀| es una distancia ----------
  // Cambia: el tipo de región y su medida · Permanece: el plano con Re e Im · Progresa: la región sombreada ·
  // Se reserva: el punto que queda fuera por poco · Debe verse: el módulo de una resta es una distancia.
  // Se agarra: el borde de la región. Juego y «Mira» usan el mismo plano de ejes (misma escala en los dos ejes).
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));
  const circulo = (cx, cy, rr, n = 48) => Array.from({ length: n + 1 }, (_, k) => [cx + rr * Math.cos(2 * Math.PI * k / n), cy + rr * Math.sin(2 * Math.PI * k / n)]);
  // Misma escala en los dos ejes (254 px para 12 unidades en x, 170 px para 8 en y): el disco se ve redondo.
  const EJE = (y0 = -4) => ({ x: { min: -6, max: 6, paso: 1, nombre: 'Re', decimales: 0 }, y: { min: y0, max: y0 + 8, paso: 1, nombre: 'Im', decimales: 0 } });
  const disco = (cx, cy, rr, o = {}) => ({ areas: [{ puntos: circulo(cx, cy, rr), color: 'd', cerrada: true, desde: o.desde }], curvas: [{ puntos: circulo(cx, cy, rr), color: 'd', desde: o.desde }], puntos: [{ x: cx, y: cy, color: 'i', rotulo: o.rotulo, desde: o.desde }] });
  const region = val => {
    const k = val.v;
    if (val.tipo === 'disco') return Object.assign(EJE(), disco(1, 1, k, { rotulo: '1 + i' }), { alt: `Disco de centro 1 + i y radio ${k}` });
    if (val.tipo === 're') return Object.assign(EJE(), { areas: [{ puntos: [[k - 2, -4], [6, -4], [6, 4], [k - 2, 4]], color: 'd', cerrada: true }], curvas: [{ puntos: [[k - 2, -4], [k - 2, 4]], color: 'd' }], alt: `Semiplano Re(z) ≥ ${k - 2}` });
    return Object.assign(EJE(), { areas: [{ puntos: [[-6, -4], [6, -4], [6, k - 2], [-6, k - 2]], color: 'd', cerrada: true }], curvas: [{ puntos: [[-6, k - 2], [6, k - 2]], color: 'd', discontinua: true }], alt: `Semiplano Im(z) < ${k - 2}` });
  };
  const regiones = {
    id: 'regiones',
    titulo: 'El módulo mide distancias',
    temas: ['Regiones en el plano complejo'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige un tipo de región y mueve su medida. El borde continuo está incluido; el discontinuo, no.',
      voz: 'Mira qué controla el número en cada región.',
      controles: [
        { id: 'tipo', etiqueta: 'Región', opciones: [{ valor: 'disco', texto: '|z − (1 + i)| ≤ r' }, { valor: 're', texto: 'Re(z) ≥ k' }, { valor: 'im', texto: 'Im(z) < k' }] },
        { id: 'v', etiqueta: 'Medida', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-d' },
      ],
      dibujo: val => ({ datos: region(val), estado: {} }),
      // Se agarra el borde: en el disco, su punto de la derecha (el radio); en los semiplanos, la recta borde.
      arrastres: [{
        id: 'borde', etiqueta: 'borde de la región', color: 'c-d',
        donde: val => { const g = EJES().geometria(region(val)); return val.tipo === 'disco' ? { x: g.X(1 + val.v), y: g.Y(1) } : val.tipo === 're' ? { x: g.X(val.v - 2), y: g.Y(2.5) } : { x: g.X(4), y: g.Y(val.v - 2) }; },
        mover: (pt, val) => {
          const g = EJES().geometria(region(val)), re = inversa(g.X, -6, 6)(pt.x), im = inversa(g.Y, -4, 4)(pt.y);
          return { v: val.tipo === 'disco' ? re - 1 : val.tipo === 're' ? re + 2 : im + 2 };
        },
      }],
      lectura: val => [val.tipo === 'disco' ? `Disco de centro 1 + i y radio ${val.v}` : val.tipo === 're' ? `Re(z) ≥ ${f(val.v - 2)}: a la derecha, con borde` : `Im(z) < ${f(val.v - 2)}: abajo, sin borde`],
      minimo: 4,
    },
    predice: {
      pregunta: ['¿Qué región describe ', { abs: [z, ' − 3i'] }, ' ≤ 2?'],
      opciones: [
        { id: 'c', texto: 'Un disco de centro 3i y radio 2', correcta: true },
        { id: 'signo', texto: 'Un disco de centro −3i y radio 2', error: 'TAL-CENTRO-SIGNO', siFuera: 'Eso sería |z + 3i| ≤ 2; |z − 3i| mide la distancia a 3i.' },
        { id: 'borde', texto: 'Solo la circunferencia de centro 3i', error: 'TAL-BORDE', siFuera: 'Esa es |z − 3i| = 2; con ≤ entran también los puntos de adentro.' },
        { id: 'real', texto: 'Un disco de centro 3 y radio 2', error: 'TAL-REAL-IMAG', siFuera: '3i está sobre el eje imaginario, no sobre el real.' },
      ],
      dibujo: { datos: Object.assign(EJE(-2), { alt: 'Plano complejo vacío' }), estado: {} },
      revelar: { datos: Object.assign(EJE(-2), disco(0, 3, 2, { rotulo: '3i' }), { alt: 'Disco de centro 3i y radio 2' }), estado: {} },
      coincide: 'Coincide: son los puntos a distancia 2 o menos de 3i.',
    },
    mira: (() => {
      const P = [-1, 2], C = [1, 1], d2 = (P[0] - C[0]) ** 2 + (P[1] - C[1]) ** 2, d = Math.sqrt(d2);
      const D = disco(C[0], C[1], 2, { rotulo: fc(...C) });
      return {
        datos: Object.assign(EJE(), D, {
          curvas: [...D.curvas, { puntos: [C, P], color: 'h', desde: 3 }],
          puntos: [...D.puntos, { x: P[0], y: P[1], color: 'o', rotulo: fc(...P), desde: 2 }],
          alt: `Disco de centro ${fc(...C)} y radio 2; el punto ${fc(...P)} está a distancia ${f(d)} del centro`,
        }),
        pasos: [
          { estado: { corte: 1 }, texto: `La región |z − (${fc(...C)})| ≤ 2: disco de centro ${fc(...C)}.`, ecuacion: [{ abs: [z, ` − (${fc(...C)})`] }, ' ≤ 2'] },
          { estado: { corte: 2 }, texto: `¿Está z = ${fc(...P)} en la región?`, ecuacion: [z, ` = ${fc(...P)}`] },
          { estado: { corte: 3 }, texto: 'Se resta el centro y se mide el largo.', ecuacion: [{ abs: [`(${fc(...P)}) − (${fc(...C)})`] }, ' = ', { abs: [fc(P[0] - C[0], P[1] - C[1])] }, ` = √${d2} ≈ ${f(d)}`] },
          { estado: { corte: 3 }, texto: `Como ${f(d)} > 2, el punto queda fuera, por poco.`, ecuacion: [`√${d2} > 2`] },
        ],
      };
    })(),
    regla: {
      texto: '|z − z₀| es la distancia entre z y z₀: |z − z₀| ≤ r es un disco de centro z₀ y radio r. Re(z) ≥ k e Im(z) < k son semiplanos.',
      ecuacion: [{ llave: [{ abs: [z, ' − ', { sub: [z, '0'] }] }], nota: 'distancia a z₀', color: 'c-o' }, ' ≤ ', { llave: ['r'], nota: 'radio', color: 'c-d' }],
      condicion: '≤ incluye el borde y < lo deja fuera; el centro es z₀, con el signo contrario al que se ve sumado.',
    },
    ahoraTu: {
      pieza: 'ejes',
      generar(s) {
        const r = azar(s);
        const c = [r.ent(-2, 2), r.ent(-1, 1)], R = r.ent(1, 3);
        const dentroDe = fc(-c[0], -c[1]);
        const term = (v, im) => (v === 0 ? '' : ` ${v > 0 ? '+' : '−'} ${im ? (Math.abs(v) === 1 ? 'i' : `${Math.abs(v)}i`) : Math.abs(v)}`);
        const expr = 'z' + term(-c[0], false) + term(-c[1], true);
        if (s % 2 === 0 && (c[0] || c[1])) {
          return {
            pregunta: ['¿Cuál es el centro de la región ', { abs: [expr] }, ` ≤ ${R}?`],
            opciones: distintas([
              { id: 'c', texto: fc(...c), correcta: true },
              { id: 'signo', texto: dentroDe, error: 'TAL-CENTRO-SIGNO', siFuera: 'Esos son los números que acompañan a z; el centro lleva los signos contrarios.' },
              { id: 'real', texto: fc(c[0], -c[1]), error: 'TAL-CENTRO-SIGNO', siFuera: 'Ahí cambió el signo de una sola parte; cambian las dos.' },
              { id: 'imag', texto: fc(-c[0], c[1]), error: 'TAL-CENTRO-SIGNO', siFuera: 'Ahí cambió el signo de una sola parte; cambian las dos.' },
            ]),
            solucion: { texto: `Se escribe como |z − (${fc(...c)})|: distancia a ese centro.`, ecuacion: [{ abs: [expr] }, ' = ', { abs: [`z − (${fc(...c)})`] }], dibujo: { datos: Object.assign(EJE(-4), disco(c[0], c[1], R, { rotulo: fc(...c) })), estado: {} } },
          };
        }
        // El punto se elige para que «dentro» y «fuera» salgan parejos según la semilla.
        const quiere = s % 4 === 1 || s % 4 === 2;
        let p; do { p = [r.ent(-4, 4), r.ent(-4, 4)]; } while (((p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 <= R * R) !== quiere);
        const d2 = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2, adentro = d2 <= R * R;
        const ds = raizTxt(d2);
        return {
          pregunta: ['¿El punto ', fc(...p), ' está en la región ', { abs: [expr] }, ` ≤ ${R}?`],
          opciones: [
            { id: 'c', texto: adentro ? 'Sí, está dentro o en el borde' : 'No, está fuera', correcta: true },
            { id: 'otra', texto: adentro ? 'No, está fuera' : 'Sí, está dentro o en el borde', error: adentro ? 'TAL-DISTANCIA' : 'TAL-CENTRO-SIGNO', siFuera: adentro ? `Sería cierto si su distancia al centro pasara de ${R}; es ${ds}.` : `Sería cierto si su distancia al centro fuera ${R} o menos; es ${ds}.` },
          ],
          solucion: { texto: `Su distancia al centro ${fc(...c)} es ${ds}, ${adentro ? 'no más' : 'más'} que ${R}.`, ecuacion: [{ abs: [`(${fc(...p)}) − (${fc(...c)})`] }, ` = ${ds}`], dibujo: { datos: Object.assign(EJE(-4), disco(c[0], c[1], R), { puntos: [{ x: c[0], y: c[1], color: 'i' }, { x: p[0], y: p[1], color: 'o', rotulo: fc(...p) }] }), estado: {} } },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: dos flechas libres (largo y ángulo) y cuatro operaciones. Más rica que las ideas 2 y 4: w también se
  // mueve, y la resta y el cociente, que las ideas no juegan, se ven como flechas.
  const OPS = { suma: ' + ', resta: ' − ', producto: '·', cociente: ' ÷ ' };
  const opera = (op, p, q) => (op === 'suma' ? [p[0] + q[0], p[1] + q[1]] : op === 'resta' ? [p[0] - q[0], p[1] - q[1]]
    : op === 'producto' ? mul(p, q) : (d => [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d])(q[0] * q[0] + q[1] * q[1]));
  const dibujoDos = val => {
    const p = cis(val.rz, val.tz), q = cis(val.rw, val.tw), res = opera(val.op, p, q);
    const guias = val.op === 'suma' ? [{ de: p, a: res }, { de: q, a: res }] : val.op === 'resta' ? [{ de: q, a: p }] : [];
    // Ventana fija de ±3: con largos de 0,5 a 1,5 el resultado más largo (cociente 1,5 ÷ 0,5) mide 3.
    return { datos: plano(3, [fl(p, 'o', 'z'), fl(q, 'i', 'w'), fl(res, 'd', `z${OPS[val.op].trim()}w`)], { guias }), estado: {} };
  };
  const lecturaDos = val => {
    const res = opera(val.op, cis(val.rz, val.tz), cis(val.rw, val.tw));
    if (val.op === 'producto') { const g = val.tz + val.tw; return [z, '·', w, `: módulo ${f(val.rz)} · ${f(val.rw)} = ${f(val.rz * val.rw)}, ángulo ${g}°${g >= 360 ? ` = ${g - 360}°` : ''}`]; }
    if (val.op === 'cociente') return [z, ' ÷ ', w, `: módulo ${f(val.rz)} ÷ ${f(val.rw)} = ${f(val.rz / val.rw)}, ángulo ${val.tz - val.tw}°`];
    return [z, OPS[val.op], w, ` = ${fc(res[0], res[1])}, módulo ${f(Math.hypot(...res))}`];
  };
  // Mesa 2: las potencias z, z², …, zⁿ encadenadas. El caso que las ideas no dejan probar: |z| ≠ 1, la espiral que
  // se abre o se cierra; con |z| = 1 las puntas quedan en una circunferencia.
  const potencias = (r, t, n) => Array.from({ length: n }, (_, k) => cis(r ** (k + 1), t * (k + 1)));
  const dibujoEspiral = val => {
    const P = potencias(val.r, val.t, val.n);
    // Ventana fija de ±1,8 (1,1⁶ ≈ 1,77) y la circunferencia de radio 1 como referencia tenue.
    return { datos: plano(1.8, P.map((p, k) => fl(p, k ? 'd' : 'o', k ? (k === val.n - 1 ? `z${supTxt(k + 1)}` : '') : 'z')), { guias: P.slice(1).map((p, k) => ({ de: P[k], a: p })), contorno: circulo(0, 0, 1) }), estado: {} };
  };
  // Mesa 3: un disco |z − z₀| ≤ r con centro, radio y un punto que se arrastran: la distancia del punto al centro decide.
  const dibujoDisco = val => {
    const D = disco(val.cx, val.cy, val.r, { rotulo: fc(val.cx, val.cy) });
    const dd = Math.hypot(val.px - val.cx, val.py - val.cy);
    return { datos: Object.assign(EJE(), D, {
      curvas: [...D.curvas, { puntos: [[val.cx, val.cy], [val.px, val.py]], color: 'h' }],
      puntos: [...D.puntos, { x: val.px, y: val.py, color: 'o', rotulo: fc(val.px, val.py) }],
      alt: `Disco de centro ${fc(val.cx, val.cy)} y radio ${val.r}; el punto ${fc(val.px, val.py)} está a distancia ${f(dd)}`,
    }), estado: {} };
  };
  const ejeInv = (datos, pt) => { const g = EJES().geometria(datos); return [inversa(g.X, -6, 6)(pt.x), inversa(g.Y, -4, 4)(pt.y)]; };
  const laboratorio = [
    {
      id: 'dos-flechas', titulo: 'Dos flechas, cuatro operaciones', pieza: 'flechas',
      consigna: 'Arrastra las puntas de z y de w y elige la operación. Compara cómo cambian largo y ángulo de la flecha verde.',
      controles: [
        { id: 'rz', etiqueta: '|z|', min: 0.5, max: 1.5, paso: 0.25, inicio: 1.5, decimales: 2, color: 'c-o' },
        { id: 'tz', etiqueta: 'ángulo de z', min: 0, max: 345, paso: 15, inicio: 30, unidad: '°', decimales: 0, color: 'c-o' },
        { id: 'rw', etiqueta: '|w|', min: 0.5, max: 1.5, paso: 0.25, inicio: 1.25, decimales: 2, color: 'c-i' },
        { id: 'tw', etiqueta: 'ángulo de w', min: 0, max: 345, paso: 15, inicio: 120, unidad: '°', decimales: 0, color: 'c-i' },
        { id: 'op', etiqueta: 'Operación', opciones: [{ valor: 'suma', texto: 'z + w' }, { valor: 'resta', texto: 'z − w' }, { valor: 'producto', texto: 'z · w' }, { valor: 'cociente', texto: 'z ÷ w' }] },
      ],
      dibujo: dibujoDos,
      lectura: lecturaDos,
      arrastres: [puntaPolar(dibujoDos, 'rz', 'tz', 'punta-z', 'c-o', 'z', -7.5), puntaPolar(dibujoDos, 'rw', 'tw', 'punta-w', 'c-i', 'w', -7.5)],
    },
    {
      id: 'espiral', titulo: 'Potencias que giran en espiral', pieza: 'flechas',
      consigna: 'Arrastra la punta de z y elige hasta qué potencia llegas. Si |z| no es 1, las puntas dejan la circunferencia de radio 1.',
      controles: [
        { id: 'r', etiqueta: '|z|', min: 0.9, max: 1.1, paso: 0.05, inicio: 1.05, decimales: 2, color: 'c-o' },
        { id: 't', etiqueta: 'ángulo de z', min: 0, max: 120, paso: 5, inicio: 40, unidad: '°', decimales: 0, color: 'c-o' },
        { id: 'n', etiqueta: 'hasta la potencia', min: 1, max: 6, paso: 1, inicio: 6, decimales: 0, color: 'c-d' },
      ],
      dibujo: dibujoEspiral,
      lectura: val => [`|z| = ${f(val.r)}, ${val.t}°: `, { sup: [z, String(val.n)] }, ` mide ${f(val.r ** val.n)} y gira ${val.t * val.n}°`],
      arrastres: [puntaPolar(dibujoEspiral, 'r', 't')],
    },
    {
      id: 'disco-libre', titulo: 'Un disco y un punto', pieza: 'ejes',
      consigna: 'Arrastra el centro, el borde del disco y el punto z. La línea roja es la distancia del punto al centro.',
      controles: [
        { id: 'cx', etiqueta: 'Re del centro', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
        { id: 'cy', etiqueta: 'Im del centro', min: -1, max: 1, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
        { id: 'r', etiqueta: 'r', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-d' },
        { id: 'px', etiqueta: 'Re de z', min: -6, max: 6, paso: 1, inicio: -1, decimales: 0, color: 'c-o' },
        { id: 'py', etiqueta: 'Im de z', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      ],
      dibujo: dibujoDisco,
      lectura: val => { const d2 = (val.px - val.cx) ** 2 + (val.py - val.cy) ** 2; return [{ abs: [z, ` − (${fc(val.cx, val.cy)})`] }, ` = ${raizTxt(d2)}: ${d2 <= val.r * val.r ? 'dentro' : 'fuera'}, radio ${val.r}`]; },
      arrastres: [
        { id: 'centro', etiqueta: 'centro del disco', color: 'c-i',
          donde: val => { const g = EJES().geometria(dibujoDisco(val).datos); return { x: g.X(val.cx), y: g.Y(val.cy) }; },
          mover: (pt, val) => { const [re, im] = ejeInv(dibujoDisco(val).datos, pt); return { cx: re, cy: im }; } },
        { id: 'radio', etiqueta: 'borde del disco', color: 'c-d',
          donde: val => { const g = EJES().geometria(dibujoDisco(val).datos); return { x: g.X(val.cx), y: g.Y(val.cy - val.r) }; },
          mover: (pt, val) => { const [, im] = ejeInv(dibujoDisco(val).datos, pt); return { r: val.cy - im }; } },
        { id: 'punto', etiqueta: 'punto z', color: 'c-o',
          donde: val => { const g = EJES().geometria(dibujoDisco(val).datos); return { x: g.X(val.px), y: g.Y(val.py) }; },
          mover: (pt, val) => { const [re, im] = ejeInv(dibujoDisco(val).datos, pt); return { px: re, py: im }; } },
      ],
    },
  ];

  return {
    unidad: 'algebra.numeros-complejos',
    version: '0.2.0',
    laboratorio,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/flechas.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Los complejos no nacieron solo para resolver cuadráticas sin raíces reales. En el siglo XVI, las fórmulas de ciertas cúbicas con soluciones reales hacían aparecer raíces de números negativos, y Bombelli dio reglas para operar con ellas. Más tarde, interpretaciones geométricas como la de Argand, que circulaba hacia 1806, los convirtieron en puntos y flechas del plano.',
      pregunta: '¿Qué sentido tendría multiplicar una flecha?',
      fuente: { titulo: 'O’Connor y Robertson, Rafael Bombelli — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Bombelli/' },
    },
    ideas: [giro, binomica, conj, polar, raices, regiones],
  };
});
