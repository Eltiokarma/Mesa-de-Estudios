/*
 * Teoría de «Polinomios» (algebra.polinomios). Molde: docs/teoria.md; forma de Álgebra: logica-y-conjuntos.js.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 7), expediente teoria-152-unidades (Álgebra) y
 * historia-ecuaciones (pp. 57–68). Errores: PO1–PO35 de plantillas/polinomios/ (hipótesis del proyecto), AL16 de
 * docs/investigacion/algebra-funciones-ideas-erroneas.md y TAL-* nuevos (hipótesis, rutinas/teoria-algebra.md).
 * Colores (regla 4): exponente o término de x y el polinomio P naranja (c-o); exponente de y y el polinomio Q
 * turquesa (c-i); grado, valor o resultado verde (c-d); lo que falta o el error rojo (c-h).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · leer la estructura de un polinomio (grados, casillas, coeficientes) y operar sin perder un término.
 * Persona y condiciones · 3.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · halla grados, valores numéricos y coeficientes de un producto; decide si dos polinomios son iguales.
 * Orden de atención · 1.º la tabla de casillas o la curva · 2.º la casilla o el punto que cambia · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué dos polinomios que valen lo mismo en un punto no son, por eso, el mismo polinomio.
 *
 * Ronda 2 (14 nov 2026): gesto directo en «Evaluar es reemplazar cada x» (el punto (x; P(x)) se arrastra por la curva),
 * llaves en las reglas, separador «   ·   » y laboratorio de tres mesas: un cúbico que se arma y se evalúa con el
 * punto, P contra Q en curvas con sus casillas contadas y la cuadrícula del producto con tres controles. Las ideas 1,
 * 3, 4 y 5 juegan con tablas que se reacomodan con el valor: se quedan con − y +.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const P = { v: 'c-o', t: 'P' }, Q = { v: 'c-i', t: 'Q' }, x = { v: 'c-o', t: 'x' };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r();                                  // la primera salida se parece entre semillas vecinas: se descarta
    r.noCero = (lo, hi) => { let v = 0; while (v === 0) v = lo + Math.floor(r() * (hi - lo + 1)); return v; };
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  // ---------- Escritura de polinomios ----------
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = n => String(n).split('').map(c => SUP[c]).join('');
  const pot = (v, e) => (e === 0 ? '' : e === 1 ? v : v + sup(e));
  // Un monomio c·x^a·y^b con su signo; primero: sin «+» delante.
  function mono(c, partes, primero) {
    const lit = partes.map(([v, e]) => pot(v, e)).join('');
    const abs = Math.abs(c), num = abs === 1 && lit ? '' : f(abs);
    const signo = c < 0 ? (primero ? '−' : ' − ') : (primero ? '' : ' + ');
    return signo + num + lit;
  }
  // Polinomio en x con coeficientes de mayor a menor grado: [2, 0, −5, 1] → «2x³ − 5x + 1».
  function poli(cs, v = 'x') {
    const n = cs.length - 1, out = [];
    cs.forEach((c, k) => { if (c !== 0) out.push([c, n - k]); });
    if (!out.length) return '0';
    return out.map(([c, e], i) => mono(c, [[v, e]], i === 0)).join('');
  }
  const par = v => (v < 0 ? `(${f(v)})` : f(v));
  const evaluar = (cs, a) => cs.reduce((acc, c) => acc * a + c, 0);
  // Gesto directo: la manija vive en el viewBox de la pieza; la inversa lineal de su escala da el valor.
  const EJES = () => Kit.piezas.ejes;
  const inversa = (escala, p, q) => px => p + (px - escala(p)) * (q - p) / (escala(q) - escala(p));
  const multiplicar = (A, B) => { const out = Array(A.length + B.length - 1).fill(0); A.forEach((a, i) => B.forEach((b, j) => { out[i + j] += a * b; })); return out; };

  // ---------- Idea 1: el grado se suma dentro del término ----------
  // Cambia: los exponentes del primer término · Permanece: los otros dos términos · Progresa: las columnas de
  // exponentes y de grado · Se reserva: la fila que da el grado absoluto · Debe verse: suma dentro, máximo entre filas.
  const tablaGrados = (terminos, cortes = {}) => {
    const gr = terminos.map(([, a, b]) => a + b), max = Math.max(...gr);
    return {
      columnas: ['término', 'exp. de x', 'exp. de y', 'grado'], colorCol: [null, 'o', 'i', 'd'],
      filas: terminos.map(([c, a, b], k) => [mono(c, [['x', a], ['y', b]], true) || f(c), { t: f(a), desde: cortes.x || 0, color: 'o' }, { t: f(b), desde: cortes.y || 0, color: 'i' }, { t: f(gr[k]), desde: cortes.g || 0, color: 'd', fuerte: gr[k] === max }]),
      resaltes: gr.map((g, k) => (g === max ? { f: k, c: 0, ancho: 4, color: 'd', desde: cortes.max || 0 } : null)).filter(Boolean),
      alt: `Términos con sus exponentes de x y de y; el grado mayor es ${max}`,
    };
  };
  const PRED1 = [[3, 2, 1], [-2, 1, 3], [1, 0, 0]];   // 3x²y − 2xy³ + 1
  const grados = {
    id: 'grados',
    titulo: 'El grado se suma por término',
    temas: ['Grado absoluto y relativo'],
    pieza: 'alg-tabla',
    // Lee (fase 2): vocabulario del término y contexto, sin decir cómo se calcula el grado absoluto (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Letras que guardan precios', texto: 'En una feria de Juliaca, si x es el precio del kilo de papa e y el del kilo de quinua, 3x + 2y es lo que pagas por 3 kilos de papa y 2 de quinua.' },
        { titulo: 'Las partes de un término', texto: 'En el término −2xy³ hay un coeficiente, −2, y dos letras con sus exponentes: x lleva 1 e y lleva 3. Si una letra no muestra exponente, lleva un 1 que no se escribe.',
          ecuacion: ['−2', { sup: ['x', '1'] }, { sup: [{ v: 'c-i', t: 'y' }, '3'] }] },
        { titulo: 'Dos clases de grado', texto: 'El grado relativo mira una sola letra. El grado absoluto mira el polinomio entero. En el juego vas a descubrir cómo se halla cada uno.' },
        { titulo: 'Qué mirar', texto: 'Cambia los exponentes del primer término. Mira qué columnas cambian, qué fila queda marcada en verde y qué dice la lectura de abajo.' },
      ],
    },
    juega: {
      consigna: 'P = 3xᵃyᵇ − 2xy³ + 5x². Cambia los exponentes del primer término y mira el grado de cada fila y el de todo P.',
      voz: 'Creo que conviene mirar fila por fila.',
      controles: [
        { id: 'a', etiqueta: 'exp. de x', min: 0, max: 5, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'exp. de y', min: 0, max: 5, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      ],
      dibujo: val => ({ datos: tablaGrados([[3, val.a, val.b], [-2, 1, 3], [5, 2, 0]]), estado: {} }),
      lectura: val => {
        const t = [[val.a, val.b], [1, 3], [2, 0]];
        return [`GR(x) = ${Math.max(...t.map(z => z[0]))}`, '   ·   ', `GR(y) = ${Math.max(...t.map(z => z[1]))}`, '   ·   ', `GA = ${Math.max(...t.map(z => z[0] + z[1]))}`];
      },
      minimo: 3,
    },
    predice: (() => {
      const gr = PRED1.map(([, a, b]) => a + b), GA = Math.max(...gr);
      const GRx = Math.max(...PRED1.map(t => t[1])), GRy = Math.max(...PRED1.map(t => t[2]));
      const todos = PRED1.reduce((s, t) => s + t[1] + t[2], 0);
      return {
        pregunta: '¿Cuál es el grado absoluto de 3x²y − 2xy³ + 1?',
        opciones: [
          { id: 'c', texto: f(GA), correcta: true },
          { id: 'relativo', texto: f(Math.max(GRx, GRy)), error: 'PO10', siFuera: `${Math.max(GRx, GRy)} es el mayor grado relativo, el de y. El absoluto suma los exponentes de cada término.` },
          { id: 'todos', texto: f(todos), error: 'PO11', siFuera: `${todos} suma los exponentes de todos los términos; el grado se suma dentro de cada término.` },
          { id: 'suma-rel', texto: f(GRx + GRy), error: 'PO28', siFuera: `${GRx + GRy} suma los dos grados relativos, que salen de términos distintos.` },
        ],
        dibujo: { datos: tablaGrados(PRED1, { g: 1, max: 1 }), estado: { corte: 0 } },
        revelar: { datos: tablaGrados(PRED1), estado: {} },
        coincide: `Coincide: los términos tienen grados ${gr.join(', ')}; el mayor es ${GA}.`,
      };
    })(),
    mira: {
      datos: tablaGrados(PRED1, { x: 1, y: 2, g: 3, max: 4 }),
      voz: 'Las formas cambian; el grado se lee igual en cada fila.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Exponentes de x en cada término. El mayor, 2, es GR(x).', ecuacion: ['GR(', x, ') = 2'] },
        { estado: { corte: 2 }, texto: 'Exponentes de y. El mayor, 3, es GR(y).', ecuacion: ['GR(', { v: 'c-i', t: 'y' }, ') = 3'] },
        { estado: { corte: 3 }, texto: 'Grado de cada término: sus exponentes sumados.', ecuacion: ['2 + 1 = 3', '   ·   ', '1 + 3 = 4', '   ·   ', '0 + 0 = 0'] },
        { estado: { corte: 4 }, texto: 'El grado absoluto es el mayor de esos grados.', ecuacion: ['GA = máx(3; 4; 0) = 4'] },
      ],
    },
    regla: {
      texto: 'El grado de un término es la suma de sus exponentes. El grado absoluto es el mayor de esos grados; el relativo a x, el mayor exponente de x.',
      ecuacion: ['GA = máx(', { llave: [{ sub: ['g', '1'] }, '; ', { sub: ['g', '2'] }, '; …'], nota: 'grado por término', color: 'c-d' }, ')'],
      condicion: 'los exponentes son enteros no negativos; el polinomio cero no tiene grado y se trata por convención aparte.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (las mismas cuentas), con otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        let ts;
        do { ts = [0, 1, 2].map(() => [r.noCero(-6, 7), r.ent(0, 5), r.ent(0, 5)]); } while (new Set(ts.map(t => t[1] + ',' + t[2])).size < 3 || ts.some(t => t[1] + t[2] === 0));
        const gr = ts.map(t => t[1] + t[2]), GA = Math.max(...gr), GRx = Math.max(...ts.map(t => t[1])), GRy = Math.max(...ts.map(t => t[2]));
        const texto = ts.map(([c, a, b], i) => mono(c, [['x', a], ['y', b]], i === 0)).join('');
        const sueltos = ts.map(([c, a, b]) => mono(c, [['x', a], ['y', b]], true)).join('; ');
        const pide = ['GA', 'GR(x)', 'GR(y)'][s % 3], esGA = pide === 'GA', letra = pide === 'GR(y)' ? 'y' : 'x';
        const exps = ts.map(t => (letra === 'x' ? t[1] : t[2]));
        const bien = esGA ? GA : Math.max(...exps), tm = ts[exps.indexOf(bien)];
        const datos = { tipo: 'datos', texto: `Tiene tres términos: ${sueltos}.` };
        const pasos = esGA ? [
          { tipo: 'pide', texto: 'Piden el grado absoluto: el grado del polinomio entero.' },
          datos,
          { tipo: 'regla', texto: 'Primero sumo los exponentes dentro de cada término: ese es su grado. El grado absoluto es el mayor de esos tres grados.' },
          { tipo: 'cuentas', texto: 'Sumo el exponente de x y el de y en cada fila, y elijo el mayor.',
            ecuacion: [...ts.flatMap((t, k) => [`${t[1]} + ${t[2]} = ${gr[k]}`, '   ·   ']), `GA = máx(${gr.join('; ')}) = ${GA}`], dibujo: { datos: tablaGrados(ts), estado: {} } },
          { tipo: 'sentido', texto: `Comprueba: GA no es menor que GR(x) = ${GRx} ni que GR(y) = ${GRy}, y no pasa de su suma, ${GRx + GRy}. ${GA} cumple.` },
        ] : [
          { tipo: 'pide', texto: `Piden el grado relativo a ${letra}.` },
          datos,
          { tipo: 'regla', texto: `Para el grado relativo a ${letra} miro solo los exponentes de ${letra}, término por término, y me quedo con el mayor. La otra letra no cuenta.` },
          { tipo: 'cuentas', texto: `Los exponentes de ${letra} son ${exps.join(', ')}.`, ecuacion: [`${pide} = máx(${exps.join('; ')}) = ${bien}`], dibujo: { datos: tablaGrados(ts), estado: {} } },
          { tipo: 'sentido', texto: bien === 0 ? `Comprueba: ningún término lleva ${letra}; por eso su grado relativo es 0.`
            : `Comprueba: el término ${mono(tm[0], [['x', tm[1]], ['y', tm[2]]], true)} lleva ${letra}${sup(bien)}, y ningún otro término lleva un exponente de ${letra} mayor.` },
        ];
        return {
          enunciado: `¿Cuál es ${esGA ? 'el grado absoluto' : `el grado relativo a ${letra}`} de ${texto}?`,
          dibujo: { datos: tablaGrados(ts, { g: 1, max: 1 }), estado: { corte: 0 } },
          pasos,
          respuesta: `${pide} = ${bien}`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let ts;
        do { ts = [0, 1, 2].map(() => [r.noCero(-6, 7), r.ent(0, 5), r.ent(0, 5)]); } while (new Set(ts.map(t => t[1] + ',' + t[2])).size < 3 || ts.some(t => t[1] + t[2] === 0));
        const gr = ts.map(t => t[1] + t[2]), GA = Math.max(...gr), GRx = Math.max(...ts.map(t => t[1])), GRy = Math.max(...ts.map(t => t[2]));
        const todos = ts.reduce((a, t) => a + t[1] + t[2], 0), sx = ts.reduce((a, t) => a + t[1], 0);
        const texto = ts.map(([c, a, b], i) => mono(c, [['x', a], ['y', b]], i === 0)).join('');
        const pide = ['GA', 'GR(x)', 'GR(y)'][s % 3];
        let bien, ds;
        if (pide === 'GA') {
          bien = GA;
          ds = [{ id: 'rel', v: Math.max(GRx, GRy), error: 'PO10', siFuera: 'Ese es un grado relativo. El absoluto suma los exponentes dentro de cada término.' },
            { id: 'todos', v: todos, error: 'PO11', siFuera: 'Eso suma los exponentes de todos los términos juntos.' },
            { id: 'sumarel', v: GRx + GRy, error: 'PO28', siFuera: 'Eso suma los grados relativos, que salen de términos distintos.' },
            { id: 'n', v: 3, error: 'PO9', siFuera: 'Eso cuenta los términos; el grado mira los exponentes.' }];
        } else {
          const enX = pide === 'GR(x)';
          bien = enX ? GRx : GRy;
          ds = [{ id: 'ga', v: GA, error: 'TAL-GA-GR', siFuera: 'Ese es el grado absoluto. El relativo mira solo una letra.' },
            { id: 'otra', v: enX ? GRy : GRx, error: 'TAL-LETRA', siFuera: `Ese es el mayor exponente de ${enX ? 'y' : 'x'}.` },
            { id: 'suma', v: enX ? sx : ts.reduce((a, t) => a + t[2], 0), error: 'PO11', siFuera: 'Eso suma los exponentes de esa letra; el grado relativo es el mayor.' }];
        }
        return {
          pregunta: `¿Cuál es ${pide === 'GA' ? 'el grado absoluto' : `el grado relativo a ${pide[3]}`} de ${texto}?`,
          opciones: distintas([{ id: 'c', texto: f(bien), correcta: true }, ...ds.map(d => ({ id: d.id, texto: f(d.v), error: d.error, siFuera: d.siFuera }))]).slice(0, 4),
          solucion: {
            texto: pide === 'GA' ? `Grados de los términos: ${gr.join(', ')}. El mayor es ${GA}.` : `Exponentes de ${pide[3]}: ${ts.map(t => (pide === 'GR(x)' ? t[1] : t[2])).join(', ')}. El mayor es ${bien}.`,
            ecuacion: [`${pide} = ${bien}`],
            dibujo: { datos: tablaGrados(ts), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: evaluar es reemplazar en cada x ----------
  // Cambia: el valor de x · Permanece: la curva de P · Progresa: el punto (a; P(a)) y su altura · Se reserva:
  // x = 1 y x = 0 como valores especiales · Debe verse: P(a) es una altura de la curva, no un coeficiente.
  // Gesto: el alumno lleva el punto por la curva; x lo pone el dedo y P(x) lo pone la curva.
  const muestra = (cs, a, b) => Array.from({ length: Math.round((b - a) * 10) + 1 }, (_, k) => { const t = a + k / 10; return [Math.round(t * 10) / 10, evaluar(cs, t)]; });
  const rango = (cs, a, b, extra = []) => {
    const ys = [...muestra(cs, a, b).map(p => p[1]), ...extra, 0];
    const paso = Math.max(...ys.map(Math.abs)) > 40 ? 20 : 10;
    return { min: Math.floor(Math.min(...ys) / paso) * paso, max: Math.ceil(Math.max(...ys) / paso) * paso, paso };
  };
  const curvaP = (cs, a, b, puntos, rot) => {
    const rg = rango(cs, a, b);
    return {
      x: { min: a, max: b, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: rg.min, max: rg.max, paso: rg.paso, nombre: 'P(x)', decimales: 0, color: 'd' },
      curvas: [{ puntos: muestra(cs, a, b), color: 'o', rotulo: rot }],
      puntos, alt: `Gráfica de P(x) = ${poli(cs)}${puntos.length ? ': ' + puntos.filter(p => p.rotulo).map(p => p.rotulo).join('; ') : ''}`,
    };
  };
  const J2 = [1, 0, -3, 1];          // x³ − 3x + 1
  const dibujoJ2 = a => curvaP(J2, -2, 2, [{ x: a, y: evaluar(J2, a), color: 'd', guias: true, rotulo: `P(${f(a)}) = ${f(evaluar(J2, a))}` }], 'P');
  const PRED2 = [2, -1, 3, -5];      // 2x³ − x² + 3x − 5
  const valor = {
    id: 'valor-numerico',
    titulo: 'Evaluar es reemplazar cada x',
    temas: ['Valor numérico'],
    pieza: 'ejes',
    // Lee: qué es evaluar y cómo se lee P(3), sin adelantar qué da P(1) (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Una fórmula que espera', texto: 'Un reparto en Juliaca cobra 2 soles de base y 1 sol por kilómetro: el costo es x + 2. Si recorres 3 km, pagas 3 + 2 = 5 soles. Eso es evaluar.',
          ecuacion: [P, '(x) = x + 2', '   ·   ', P, '(3) = 5'] },
        { titulo: 'Cómo se lee', texto: 'P(3) se lee «P de 3». Es el valor del polinomio cuando x vale 3. No quiere decir P por 3.' },
        { titulo: 'Con números negativos', texto: 'Si x vale −2, se escribe entre paréntesis para no perder el signo: x² es (−2)² = 4 y x³ es (−2)³ = −8.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el punto verde se mueve sobre la curva. Su altura es P(x). Prueba x = 0, x = 1 y algún valor negativo.' },
      ],
    },
    juega: {
      consigna: 'P(x) = x³ − 3x + 1. Elige un valor de x: el punto marca su altura, que es P(x).',
      voz: 'Prueba también valores negativos de x.',
      controles: [{ id: 'a', etiqueta: 'x', min: -2, max: 2, paso: 1, inicio: 0, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: dibujoJ2(val.a), estado: {} }),
      lectura: val => [P, `(${f(val.a)}) = ${f(evaluar(J2, val.a))}`],
      minimo: 3,
      // Se arrastra el punto (x; P(x)) por la curva: el dedo elige x y la altura responde.
      arrastres: [{ id: 'punto', etiqueta: 'punto de la curva', color: 'c-o',
        donde: val => { const g = EJES().geometria(dibujoJ2(val.a)); return { x: g.X(val.a), y: g.Y(evaluar(J2, val.a)) }; },
        mover: (pt, val) => { const g = EJES().geometria(dibujoJ2(val.a)); return { a: inversa(g.X, -2, 2)(pt.x) }; } }],
    },
    predice: (() => {
      const v1 = evaluar(PRED2, 1), sinSigno = PRED2.reduce((s, c) => s + Math.abs(c), 0);
      return {
        pregunta: ['Si ', P, '(x) = 2x³ − x² + 3x − 5, ¿cuánto vale ', P, '(1)?'],
        opciones: [
          { id: 'c', texto: f(v1), correcta: true },
          { id: 'indep', texto: f(PRED2[3]), error: 'PO12', siFuera: '−5 es P(0), el término independiente. Con x = 1 cuentan todos los coeficientes.' },
          { id: 'abs', texto: f(sinSigno), error: 'PO21', siFuera: `${sinSigno} suma los coeficientes sin sus signos; −x² y −5 restan.` },
          { id: 'principal', texto: f(PRED2[0]), error: 'PO20', siFuera: '2 es el coeficiente principal; P(1) suma todos los coeficientes.' },
        ],
        dibujo: { datos: curvaP(PRED2, -2, 2, [], 'P'), estado: {} },
        revelar: { datos: curvaP(PRED2, -2, 2, [{ x: 1, y: v1, color: 'd', guias: true, rotulo: `P(1) = ${f(v1)}` }], 'P'), estado: {} },
        coincide: `Coincide: con x = 1 cada potencia vale 1, y queda 2 − 1 + 3 − 5 = ${f(v1)}.`,
      };
    })(),
    mira: {
      datos: curvaP(PRED2, -1, 2, [
        { x: 0, y: evaluar(PRED2, 0), color: 'd', rotulo: f(evaluar(PRED2, 0)), desde: 1 },
        { x: 1, y: evaluar(PRED2, 1), color: 'd', rotulo: f(evaluar(PRED2, 1)), guias: true, desde: 2 },
        { x: -1, y: evaluar(PRED2, -1), color: 'h', rotulo: f(evaluar(PRED2, -1)), guias: true, desde: 3 },
      ], 'P'),
      pasos: [
        { estado: { corte: 1 }, texto: 'Con x = 0 se anulan todos los términos con x.', ecuacion: [P, `(0) = ${f(evaluar(PRED2, 0))}`] },
        { estado: { corte: 2 }, texto: 'Con x = 1 cada potencia vale 1: queda la suma de coeficientes.', ecuacion: [P, `(1) = 2 − 1 + 3 − 5 = ${f(evaluar(PRED2, 1))}`] },
        { estado: { corte: 3 }, texto: 'Con x = −1, las potencias impares cambian de signo y las pares no.', ecuacion: [P, `(−1) = 2(−1) − 1 + 3(−1) − 5 = ${f(evaluar(PRED2, -1))}`] },
      ],
    },
    regla: {
      texto: 'Evaluar es reemplazar x por el número en cada término y operar. P(1) es la suma de los coeficientes y P(0), el término independiente.',
      ecuacion: [P, '(x) = ax³ + bx² + cx + d', '   ·   ', P, '(1) = ', { llave: ['a + b + c + d'], nota: 'suma de coeficientes', color: 'c-d' }, '   ·   ', P, '(0) = ', { llave: ['d'], nota: 'independiente', color: 'c-d' }],
      condicion: 'se respeta cada signo y cada potencia: (−2)² = 4, pero (−2)³ = −8.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        const cs = [r.noCero(-3, 3), r.ent(-4, 4), r.ent(-4, 4), r.ent(-6, 6)];
        const a = [-2, -1, 2, 1, 0][s % 5];
        const bien = evaluar(cs, a);
        const ts = cs.map((c, k) => [c, 3 - k]).filter(([c]) => c !== 0);
        const sust = ts.map(([c, e], i) => { const sg = c < 0 ? (i ? ' − ' : '−') : (i ? ' + ' : ''); return sg + (e === 0 ? f(Math.abs(c)) : `${f(Math.abs(c))}·${par(a ** e + 0)}`); }).join('');
        const vals = ts.map(([c, e]) => c * a ** e + 0);
        const suma = vals.map((v, i) => (i ? (v < 0 ? ` − ${f(-v)}` : ` + ${f(v)}`) : f(v))).join('');
        return {
          enunciado: ['Si ', P, `(x) = ${poli(cs)}, ¿cuánto vale `, P, `(${f(a)})?`],
          dibujo: { datos: curvaP(cs, -2, 2, [], 'P'), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden ', P, `(${f(a)}): el valor del polinomio cuando x vale ${f(a)}.`] },
            { tipo: 'datos', texto: ['El polinomio es ', P, `(x) = ${poli(cs)}, y x vale ${f(a)}.`] },
            { tipo: 'regla', texto: 'Cambio cada x por el número, con su signo, y opero. Primero las potencias, después los productos y al final las sumas.' },
            { tipo: 'cuentas', texto: `Con x = ${f(a)}: x³ = ${f(a ** 3 + 0)}, x² = ${f(a ** 2 + 0)} y x = ${f(a)}. Multiplico cada potencia por su coeficiente y sumo.`,
              ecuacion: [P, `(${f(a)}) = ${sust} = ${suma} = ${f(bien)}`],
              dibujo: { datos: curvaP(cs, -2, 2, [{ x: a, y: bien, color: 'd', guias: true, rotulo: `P(${f(a)}) = ${f(bien)}` }], 'P'), estado: {} } },
            { tipo: 'sentido', texto: `Comprueba en la gráfica: en x = ${f(a)}, la curva pasa a la altura ${f(bien)}.` },
          ],
          respuesta: [P, `(${f(a)}) = ${f(bien)}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'ejes',
      generar(s) {
        const r = azar(s);
        const cs = [r.noCero(-3, 3), r.ent(-4, 4), r.ent(-4, 4), r.ent(-6, 6)];
        const a = [-2, -1, 2, 1, 0][s % 5];
        const bien = evaluar(cs, a);
        // (−a)ⁿ par leído como negativo: cada potencia par de un negativo cambia de signo.
        const malPar = a < 0 ? cs.reduce((acc, c, k) => { const e = 3 - k; const p = e % 2 === 0 && e > 0 ? -Math.pow(-a, e) : Math.pow(a, e); return acc + c * p; }, 0) : NaN;
        const ds = [
          { id: 'par', v: malPar, error: 'PO15', siFuera: 'Una potencia par de un negativo es positiva: (−2)² = 4.' },
          { id: 'menos', v: evaluar(cs, -a), error: 'TAL-SIGNO-X', siFuera: `Ese es P(${f(-a)}): el valor se reemplaza con su signo.` },
          { id: 'suma', v: evaluar(cs, 1), error: 'PO7', siFuera: 'Esa es la suma de coeficientes, P(1).' },
          { id: 'indep', v: cs[3], error: 'PO12', siFuera: 'Ese es el término independiente, P(0).' },
          { id: 'princ', v: cs[0] * a, error: 'TAL-PRINCIPAL', siFuera: 'Eso usa solo el primer coeficiente; cada término aporta.' },
        ].filter(d => Number.isFinite(d.v) && d.v !== bien);
        return {
          pregunta: ['Si ', P, `(x) = ${poli(cs)}, ¿cuánto vale `, P, `(${f(a)})?`],
          opciones: distintas([{ id: 'c', texto: f(bien), correcta: true }, ...ds.map(d => ({ id: d.id, texto: f(d.v), error: d.error, siFuera: d.siFuera }))]).slice(0, 4),
          solucion: {
            texto: `Se reemplaza x por ${f(a)} en cada término.`,
            ecuacion: [P, `(${f(a)}) = ${f(bien)}`],
            dibujo: { datos: curvaP(cs, -2, 2, [{ x: a, y: bien, color: 'd', guias: true, rotulo: `P(${f(a)}) = ${f(bien)}` }], 'P'), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 3: una casilla por potencia ----------
  // Cambia: el polinomio · Permanece: las casillas de x⁵ a x⁰ · Progresa: los ceros que llenan las casillas vacías
  // · Se reserva: el conteo n + 1 · Debe verse: completo significa ninguna casilla vacía, el cero también cuenta.
  const POT = [5, 4, 3, 2, 1, 0];
  const POLS = {
    'x⁴ − 3x² + 1': [[1, 4], [-3, 2], [1, 0]],
    '2x³ + x² − x + 4': [[2, 3], [1, 2], [-1, 1], [4, 0]],
    '5 − x + x³': [[5, 0], [-1, 1], [1, 3]],
    'x² + 3x⁴ − 1': [[1, 2], [3, 4], [-1, 0]],
  };
  const ordenado = ts => { const e = ts.map(t => t[1]); return e.every((v, i) => !i || v < e[i - 1]) || e.every((v, i) => !i || v > e[i - 1]); };
  const tablaCasillas = (ts, { ceros = true, desdeCeros = 0, conOrden = true } = {}) => {
    const grado = Math.max(...ts.map(t => t[1]));
    const cols = POT.filter(e => e <= Math.max(grado, 0));
    const fila = cols.map(e => { const i = ts.findIndex(t => t[1] === e); return i >= 0 ? { t: f(ts[i][0]), color: 'o', fuerte: true } : (ceros ? { t: '0', color: 'h', hueco: true, desde: desdeCeros } : ''); });
    const orden = cols.map(e => { const i = ts.findIndex(t => t[1] === e); return i >= 0 ? `${i + 1}.º` : ''; });
    return {
      columnas: cols.map(e => (e === 0 ? 'x⁰' : pot('x', e) === 'x' ? 'x¹' : pot('x', e))),
      rotulosFila: conOrden ? ['coef.', 'escrito'] : ['coef.'],
      filas: conOrden ? [fila, orden] : [fila],
      alt: `Casillas de las potencias de x, de x${sup(grado)} a x⁰, con los coeficientes; las vacías llevan 0`,
    };
  };
  // Así se resuelve: casillas de x^n a x⁰ para cualquier grado (POT llega solo a x⁵).
  const casillasN = (ts, ceros) => {
    const n = Math.max(...ts.map(t => t[1])), cols = Array.from({ length: n + 1 }, (_, k) => n - k);
    return {
      columnas: cols.map(e => (e === 0 ? 'x⁰' : e === 1 ? 'x¹' : pot('x', e))),
      rotulosFila: ['coef.'],
      filas: [cols.map(e => { const t = ts.find(z => z[1] === e); return t ? { t: f(t[0]), color: 'o', fuerte: true } : (ceros ? { t: '0', color: 'h', hueco: true } : ''); })],
      alt: `Casillas de x${sup(n)} a x⁰ con los coeficientes${ceros ? '; las vacías llevan 0' : ''}`,
    };
  };
  const especiales = {
    id: 'completo-ordenado',
    titulo: 'Una casilla por cada potencia',
    temas: ['Polinomios especiales'],
    pieza: 'alg-tabla',
    // Lee: ordenar y las tres palabras, sin decir cuántas casillas tiene un polinomio completo (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Ordenar es elegir un sentido', texto: 'La lista de tu salón se ordena por apellido. Un polinomio se ordena por sus exponentes: 2x³ + x² − x + 4 baja de exponente en exponente; 5 − x + x³ sube.' },
        { titulo: 'Tres palabras', texto: 'Completo, ordenado y homogéneo describen cómo está armado un polinomio. Las dos primeras se ven en la tabla del juego. La tercera mira el grado de cada término.' },
        { titulo: 'Qué mirar', texto: 'Arriba, cada coeficiente cae en la columna de su potencia. Fíjate en las casillas rojas y en cuántas columnas tiene la tabla de cada polinomio.' },
      ],
    },
    juega: {
      consigna: 'Elige un polinomio. Arriba va cada coeficiente en la casilla de su potencia; abajo, en qué orden se escribió cada término.',
      voz: 'Fíjate en las casillas que quedan con cero.',
      controles: [{ id: 'p', etiqueta: 'Polinomio', opciones: Object.keys(POLS).map(t => ({ valor: t, texto: t })) }],
      dibujo: val => ({ datos: tablaCasillas(POLS[val.p]), estado: {} }),
      lectura: val => {
        const ts = POLS[val.p], g = Math.max(...ts.map(t => t[1])), faltan = g + 1 - ts.length;
        return [`Completo: ${faltan ? `no, faltan ${faltan}` : 'sí'}`, '   ·   ', `ordenado: ${ordenado(ts) ? 'sí' : 'no'}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Si x⁵ − 3x² + 1 se escribe completo y ordenado, ¿cuántos términos tiene?',
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'sin-ceros', texto: '3', error: 'PO1', siFuera: '3 son los términos escritos. Completo pide también los de coeficiente 0.' },
        { id: 'sin-x0', texto: '5', error: 'PO9', siFuera: '5 serían de x⁵ a x¹. Falta la casilla de x⁰, el término independiente.' },
        { id: 'cuatro', texto: '4', error: 'TAL-COMPLETO', siFuera: 'Completar no es agregar uno: van todas las potencias de x⁵ a x⁰.' },
      ],
      dibujo: { datos: tablaCasillas([[1, 5], [-3, 2], [1, 0]], { ceros: false, conOrden: false }), estado: {} },
      revelar: { datos: tablaCasillas([[1, 5], [-3, 2], [1, 0]], { conOrden: false }), estado: {} },
      coincide: 'Coincide: de x⁵ a x⁰ hay 6 casillas; tres llevan 0.',
    },
    mira: {
      datos: tablaCasillas([[1, 5], [-3, 2], [1, 0]], { desdeCeros: 2, conOrden: false }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada coeficiente va en la casilla de su potencia.', ecuacion: ['x⁵ − 3x² + 1'] },
        { estado: { corte: 2 }, texto: 'Las potencias que no aparecen llevan coeficiente 0.', ecuacion: ['x⁵ + 0x⁴ + 0x³ − 3x² + 0x + 1'] },
        { estado: { corte: 2 }, texto: 'De x⁵ a x⁰ hay 5 + 1 = 6 casillas: 6 términos.', ecuacion: ['grado 5 → 6 términos'] },
      ],
    },
    regla: {
      texto: 'Completo: tiene todas las potencias, del grado hasta x⁰. Ordenado: los exponentes solo bajan o solo suben. Homogéneo: todos sus términos tienen el mismo grado.',
      ecuacion: ['grado n → ', { llave: ['n + 1'], nota: 'con x⁰', color: 'c-d' }, ' casillas'],
      condicion: 'las casillas de coeficiente 0 cuentan al completar; la homogeneidad mira el grado de cada término no nulo.',
    },
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const n = r.ent(3, 8), m = r.ent(2, Math.min(4, n));
          // Las m potencias escritas: la del grado y m − 1 más, distintas.
          const exps = [n];
          while (exps.length < m) { const e = r.ent(0, n - 1); if (!exps.includes(e)) exps.push(e); }
          exps.sort((u, v) => v - u);
          const ts = exps.map(e => [r.noCero(-5, 6), e]);
          const cs = Array(n + 1).fill(0); ts.forEach(([c, e]) => { cs[n - e] = c; });
          const falta = n + 1 - m;
          return {
            enunciado: `${poli(cs)} tiene grado ${n} y ${m} términos escritos. Si se completa, ¿cuántos términos tendrá?`,
            dibujo: { datos: casillasN(ts, false), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden cuántos términos tendrá el polinomio cuando esté completo.' },
              { tipo: 'datos', texto: `Tiene grado ${n} y ${m} términos escritos: faltan algunas potencias entre x${sup(n)} y x⁰.` },
              { tipo: 'regla', texto: 'Completo quiere decir que aparece cada potencia de x, desde la del grado hasta x⁰. Las que faltan se escriben con coeficiente 0 y también cuentan.' },
              { tipo: 'cuentas', texto: `Cuento las casillas: de x${sup(n)} a x¹ hay ${n}, y falta sumar la de x⁰.`, ecuacion: [`${n} + 1 = ${n + 1}`], dibujo: { datos: casillasN(ts, true), estado: {} } },
              { tipo: 'sentido', texto: `Comprueba: ${m} casillas tienen su coeficiente y ${falta} ${falta === 1 ? 'lleva' : 'llevan'} 0. Juntas: ${m} + ${falta} = ${m + falta}.` },
            ],
            respuesta: `${n + 1} términos`,
          };
        }
        // Homogéneo: el mismo generador de «Ahora tú».
        let g, a1, b1, a2, b2, a3, b3;
        do { g = r.ent(5, 9); a2 = r.ent(1, g - 1); b2 = g - a2; a3 = r.ent(0, g); b3 = g - a3; b1 = r.ent(1, g - 1); a1 = g - b1; } while (a2 === a3 || a1 === a2 || a1 === a3);
        const c2 = r.noCero(-5, 5), c3 = r.noCero(-5, 5);
        const t2 = mono(c2, [['x', a2], ['y', b2]], false), t3 = mono(c3, [['x', a3], ['y', b3]], false);
        const m = g - b1;
        const tabla = lleno => ({
          columnas: ['término', 'exp. de x', 'exp. de y', 'grado'], colorCol: [null, 'o', 'i', 'd'],
          filas: [
            [lleno ? `2${pot('x', m)}${pot('y', b1)}` : `2xᵐ${pot('y', b1)}`, lleno ? { t: f(m), color: 'o', fuerte: true } : { t: 'm', color: 'o' }, { t: f(b1), color: 'i' }, lleno ? { t: f(m + b1), color: 'd', fuerte: true } : { t: '?', hueco: true }],
            [mono(c2, [['x', a2], ['y', b2]], true), { t: f(a2), color: 'o' }, { t: f(b2), color: 'i' }, { t: f(a2 + b2), color: 'd' }],
            [mono(c3, [['x', a3], ['y', b3]], true), { t: f(a3), color: 'o' }, { t: f(b3), color: 'i' }, { t: f(a3 + b3), color: 'd' }],
          ],
          alt: `Exponentes y grado de cada término; los otros dos tienen grado ${g}`,
        });
        return {
          enunciado: `¿Qué valor de m hace homogéneo a 2xᵐ${pot('y', b1)}${t2}${t3}?`,
          dibujo: { datos: tabla(false), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el exponente m que hace que todos los términos tengan el mismo grado.' },
            { tipo: 'datos', texto: `Los otros dos términos tienen grado ${a2} + ${b2} = ${a2 + b2} y ${a3} + ${b3} = ${a3 + b3}.` },
            { tipo: 'regla', texto: 'En un polinomio homogéneo todos los términos tienen el mismo grado, y el grado de un término es la suma de los exponentes de sus letras.' },
            { tipo: 'cuentas', texto: `El primer término tiene grado m + ${b1}, y debe valer ${g}.`, ecuacion: [`m + ${b1} = ${g} → m = ${g} − ${b1} = ${m}`], dibujo: { datos: tabla(true), estado: {} } },
            { tipo: 'sentido', texto: `Comprueba: 2${pot('x', m)}${pot('y', b1)} tiene grado ${m} + ${b1} = ${m + b1}, igual que los otros dos términos.` },
          ],
          respuesta: `m = ${m}`,
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const n = r.ent(3, 8), m = r.ent(2, Math.min(4, n));
          return {
            pregunta: `Un polinomio de grado ${n} tiene ${m} términos escritos. Si se completa, ¿cuántos términos tendrá?`,
            opciones: distintas([
              { id: 'c', texto: f(n + 1), correcta: true },
              { id: 'n', texto: f(n), error: 'PO9', siFuera: `Eso olvida la casilla de x⁰: de x${sup(n)} a x⁰ hay ${n + 1}.` },
              { id: 'm', texto: f(m), error: 'PO1', siFuera: 'Esos son los términos escritos; completar agrega los de coeficiente 0.' },
              { id: 'falta', texto: f(n + 1 - m), error: 'TAL-COMPLETO', siFuera: 'Esos son los términos que faltan, no el total.' },
            ]),
            solucion: { texto: `Hay una casilla por cada potencia, de x${sup(n)} a x⁰.`, ecuacion: [`${n} + 1 = ${n + 1}`] },
          };
        }
        // Homogéneo: halla m para que los tres términos tengan el mismo grado.
        let g, a1, b1, a2, b2, a3, b3;
        do { g = r.ent(5, 9); a2 = r.ent(1, g - 1); b2 = g - a2; a3 = r.ent(0, g); b3 = g - a3; b1 = r.ent(1, g - 1); a1 = g - b1; } while (a2 === a3 || a1 === a2 || a1 === a3);
        const t2 = mono(r.noCero(-5, 5), [['x', a2], ['y', b2]], false), t3 = mono(r.noCero(-5, 5), [['x', a3], ['y', b3]], false);
        return {
          pregunta: `¿Qué valor de m hace homogéneo a 2xᵐ${pot('y', b1)}${t2}${t3}?`,
          opciones: distintas([
            { id: 'c', texto: f(a1), correcta: true },
            { id: 'g', texto: f(g), error: 'TAL-HOMOG', siFuera: `${g} es el grado común; m es el exponente que lo completa.` },
            { id: 'igual', texto: f(a2), error: 'TAL-HOMOG-EXP', siFuera: 'Homogéneo no pide exponentes iguales, sino grados iguales.' },
            { id: 'suma', texto: f(g + b1), error: 'TAL-HOMOG-SIGNO', siFuera: `Eso suma ${b1}; hay que restarlo del grado común.` },
          ]),
          solucion: { texto: `Los otros términos tienen grado ${g}; m + ${b1} = ${g}.`, ecuacion: [`m = ${g} − ${b1} = ${a1}`] },
        };
      },
    },
  };

  // ---------- Idea 4: iguales casilla por casilla ----------
  // Cambia: los coeficientes a y b · Permanece: Q y el término independiente · Progresa: las casillas que
  // coinciden · Se reserva: el punto donde dos polinomios distintos valen igual · Debe verse: igualdad = cada casilla.
  // Dos representaciones a propósito (hallazgo 9): el juego ajusta casillas en la tabla; la predicción y «Mira» pasan a
  // las curvas, porque lo reservado (dos polinomios distintos que valen igual en un punto) solo se ve en la gráfica.
  // El último paso de «Mira» vuelve a las casillas. La mesa «Dos curvas, tres casillas» junta las dos vistas.
  const Qcs = [2, 5, 3];
  const tablaIgualdad = (pc, qc, marcar = true) => ({
    columnas: ['x²', 'x¹', 'x⁰'], rotulosFila: ['P', 'Q'], colorFila: ['o', 'i'],
    filas: [pc.map((c, k) => ({ t: f(c), color: 'o', fuerte: true, marca: marcar ? (c === qc[k] ? 'ok' : 'no') : undefined })), qc.map(c => ({ t: f(c), color: 'i', fuerte: true }))],
    resaltes: marcar ? pc.map((c, k) => (c === qc[k] ? { f: 0, c: k, alto: 2, color: 'd' } : null)).filter(Boolean) : [],
    alt: 'Coeficientes de P y de Q, casilla por casilla',
  });
  const dosCurvas = (cp, cq, puntos, extra = {}) => ({
    x: { min: -1, max: 3, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
    y: { min: -2, max: 10, paso: 2, nombre: 'y', decimales: 0 },
    curvas: [{ puntos: muestra(cp, -1, 3), color: 'o', rotulo: 'P', en: [2.6, evaluar(cp, 2.6)] }, { puntos: muestra(cq, -1, 3), color: 'i', rotulo: 'Q', en: [2.6, evaluar(cq, 2.6)] }],
    puntos, alt: 'P(x) = x² + 1 y Q(x) = 2x: se tocan en x = 1 y se separan en los demás valores', ...extra,
  });
  const igualdad = {
    id: 'igualdad',
    titulo: 'Iguales casilla por casilla',
    temas: ['Igualdad de polinomios'],
    pieza: 'alg-tabla',
    // Lee: qué es «idéntico» y cómo se comparan, sin decir si basta un valor común (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Escrito de otra forma', texto: 'x + 2x² y 2x² + x son el mismo polinomio con los términos en otro orden. Cuando dos polinomios son el mismo, se dice que son idénticos.',
          ecuacion: ['x + 2x² ≡ 2x² + x'] },
        { titulo: 'Uno debajo del otro', texto: 'Para comparar dos polinomios conviene escribirlos en filas: P en la naranja y Q en la turquesa, cada coeficiente en la columna de su potencia.' },
        { titulo: 'Qué mirar', texto: 'En el juego, mueve a y b. Mira qué casillas de P cambian, cuántas coinciden con Q y qué marca aparece cuando coinciden.' },
      ],
    },
    juega: {
      consigna: 'P = ax² + (b − 1)x + 3 y Q = 2x² + 5x + 3. Ajusta a y b hasta que P y Q coincidan en todas las casillas.',
      voz: 'Una casilla a la vez. Las demás no se mueven.',
      controles: [
        { id: 'a', etiqueta: 'a', min: -2, max: 5, paso: 1, inicio: 0, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: -2, max: 8, paso: 1, inicio: 0, decimales: 0, color: 'c-o' },
      ],
      dibujo: val => ({ datos: tablaIgualdad([val.a, val.b - 1, 3], Qcs), estado: {} }),
      lectura: val => {
        const k = [val.a, val.b - 1, 3].filter((c, i) => c === Qcs[i]).length;
        return [`Coinciden ${k} de 3 casillas${k === 3 ? ': P ≡ Q' : ''}`];
      },
      minimo: 3,
    },
    predice: {
      pieza: 'ejes',
      pregunta: ['', P, '(x) = x² + 1 y ', Q, '(x) = 2x valen 2 cuando x = 1. ¿Son el mismo polinomio?'],
      opciones: [
        { id: 'c', texto: 'No: sus coeficientes son distintos', correcta: true },
        { id: 'un-valor', texto: 'Sí: valen lo mismo en x = 1', error: 'TAL-UNVALOR', siFuera: 'Coinciden en x = 1, pero con x = 0 valen 1 y 0.' },
        { id: 'grado', texto: 'No se sabe sin conocer más valores', error: 'TAL-COEF', siFuera: 'Los coeficientes ya deciden: x² + 0x + 1 frente a 0x² + 2x + 0.' },
      ],
      dibujo: { datos: dosCurvas([1, 0, 1], [2, 0], [{ x: 1, y: 2, color: 'd', rotulo: '(1; 2)' }]), estado: {} },
      revelar: { datos: dosCurvas([1, 0, 1], [2, 0], [{ x: 1, y: 2, color: 'd', rotulo: '(1; 2)' }, { x: 0, y: 1, color: 'o' }, { x: 0, y: 0, color: 'i' }]), estado: {} },
      coincide: 'Coincide: se tocan en x = 1 y se separan en los demás valores.',
    },
    mira: {
      pieza: 'ejes',
      datos: dosCurvas([1, 0, 1], [2, 0], [
        { x: 1, y: 2, color: 'd', rotulo: '(1; 2)', desde: 1 },
        { x: 0, y: 1, color: 'o', desde: 2 }, { x: 0, y: 0, color: 'i', desde: 2 },
        { x: 2, y: 5, color: 'o', desde: 3 }, { x: 2, y: 4, color: 'i', desde: 3 },
      ]),
      pasos: [
        { estado: { corte: 1 }, texto: 'En x = 1 las dos curvas pasan por el mismo punto.', ecuacion: [P, '(1) = 2 = ', Q, '(1)'] },
        { estado: { corte: 2 }, texto: 'En x = 0 ya no: P vale 1 y Q vale 0.', ecuacion: [P, '(0) = 1 ≠ 0 = ', Q, '(0)'] },
        { estado: { corte: 3 }, texto: 'En x = 2 tampoco. Un punto común no las hace iguales.', ecuacion: [P, '(2) = 5 ≠ 4 = ', Q, '(2)'] },
        { estado: { corte: 3 }, texto: 'Casilla por casilla: 1 ≠ 0 en x², 0 ≠ 2 en x.', ecuacion: ['x² + 0x + 1  ≢  0x² + 2x + 0'] },
      ],
    },
    regla: {
      texto: 'Dos polinomios son idénticos si tienen el mismo coeficiente en cada potencia: a = m, b = n y c = p. Entonces valen lo mismo para todo x.',
      ecuacion: ['ax² + bx + c ≡ mx² + nx + p', '   ·   ', { llave: ['a = m, b = n, c = p'], nota: 'casilla por casilla', color: 'c-d' }],
      condicion: 'coincidir en uno o en dos valores de x no basta; los coeficientes deben ser iguales en todas las casillas.',
    },
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        const p = r.ent(1, 5), q = r.ent(1, 5), A = r.noCero(-4, 6), B = r.noCero(-4, 8), c = r.noCero(-5, 5);
        const m = A + p, n = B - q, pide = s % 2 ? 'm + n' : 'm · n';
        const val = pide === 'm + n' ? m + n : m * n;
        const pFila = [{ t: `m − ${p}`, color: 'o' }, { t: `n + ${q}`, color: 'o' }, { t: f(c), color: 'o', fuerte: true }];
        const sinMarcar = { columnas: ['x²', 'x¹', 'x⁰'], rotulosFila: ['P', 'Q'], colorFila: ['o', 'i'], filas: [pFila, [A, B, c].map(v => ({ t: f(v), color: 'i', fuerte: true }))], alt: 'Coeficientes de P, con m y n, y de Q, casilla por casilla' };
        return {
          enunciado: [P, `(x) = (m − ${p})x² + (n + ${q})x ${c < 0 ? '−' : '+'} ${Math.abs(c)} y `, Q, `(x) = ${poli([A, B, c])} son idénticos. ¿Cuánto vale ${pide}?`],
          dibujo: { datos: sinMarcar, estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden ${pide}, con los valores de m y n que hacen idénticos a P y Q.` },
            { tipo: 'datos', texto: [`En x², `, P, ` tiene m − ${p} y `, Q, ` tiene ${f(A)}. En x, `, P, ` tiene n + ${q} y `, Q, ` tiene ${f(B)}.`] },
            { tipo: 'regla', texto: 'Dos polinomios idénticos tienen el mismo coeficiente en cada potencia. Por eso igualo los coeficientes de x² entre sí, y los de x entre sí.' },
            { tipo: 'cuentas', texto: `Despejo m y n, y después calculo ${pide}.`,
              ecuacion: [`m − ${p} = ${f(A)} → m = ${f(m)}`, '   ·   ', `n + ${q} = ${f(B)} → n = ${f(n)}`, '   ·   ', `${pide} = ${par(m)} ${pide === 'm + n' ? '+' : '·'} ${par(n)} = ${f(val)}`],
              dibujo: { datos: tablaIgualdad([m - p, n + q, c], [A, B, c]), estado: {} } },
            { tipo: 'sentido', texto: ['Comprueba: con m = ', f(m), ' y n = ', f(n), ', ', P, ` = ${poli([m - p, n + q, c])}, igual que `, Q, ' en las tres casillas.'] },
          ],
          respuesta: `${pide} = ${f(val)}`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        const p = r.ent(1, 5), q = r.ent(1, 5), A = r.noCero(-4, 6), B = r.noCero(-4, 8), c = r.noCero(-5, 5);
        // P = (m − p)x² + (n + q)x + c ≡ Q = A x² + B x + c → m = A + p, n = B − q.
        const m = A + p, n = B - q, pide = s % 2 ? 'm + n' : 'm · n';
        const val = (mm, nn) => (pide === 'm + n' ? mm + nn : mm * nn);
        return {
          pregunta: [P, `(x) = (m − ${p})x² + (n + ${q})x ${c < 0 ? '−' : '+'} ${Math.abs(c)} y `, Q, `(x) = ${poli([A, B, c])} son idénticos. ¿Cuánto vale ${pide}?`],
          opciones: distintas([
            { id: 'c', texto: f(val(m, n)), correcta: true },
            { id: 'signos', texto: f(val(A - p, B + q)), error: 'AL16', siFuera: `Al despejar m, el ${p} pasa sumando: m = ${A} + ${p}.` },
            { id: 'solo-m', texto: f(val(m, B)), error: 'TAL-COEF', siFuera: `n + ${q} es el coeficiente; n vale ${B} − ${q}.` },
            { id: 'coef', texto: f(val(A, B)), error: 'TAL-COEF', siFuera: 'Esos son los coeficientes de Q, no los valores de m y n.' },
            { id: 'solo-n', texto: f(val(A, n)), error: 'TAL-COEF', siFuera: `m − ${p} es el coeficiente; m vale ${A} + ${p}.` },
          ]).slice(0, 4),
          solucion: { texto: 'Se iguala cada casilla: la de x² y la de x.', ecuacion: [`m − ${p} = ${f(A)} → m = ${f(m)}`, '   ·   ', `n + ${q} = ${f(B)} → n = ${f(n)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: cada término por cada término ----------
  // Cambia: a en P = x + a y b en Q = x² + bx + 2 · Permanece: la cuadrícula 2 × 3 · Progresa: los productos que
  // se llenan · Se reserva: las dos casillas que dan x² · Debe verse: los semejantes salen de casillas distintas.
  const tablaProducto = (pc, qc, cortes = {}) => {
    const pt = pc.map((c, i) => [c, pc.length - 1 - i]), qt = qc.map((c, j) => [c, qc.length - 1 - j]);
    const term = ([c, e], primero = true) => mono(c, [['x', e]], primero) || f(c);
    return {
      columnas: qt.map(t => term(t)), colorCol: qt.map(() => 'i'),
      rotulosFila: pt.map(t => term(t)), colorFila: pt.map(() => 'o'),
      filas: pt.map(([a, e], i) => qt.map(([b, g]) => ({ t: a * b === 0 ? '0' : term([a * b, e + g]), desde: cortes[`f${i}`] || 0 }))),
      resaltes: (cortes.resaltar || []).map(([fi, cj]) => ({ f: fi, c: cj, color: 'd', desde: cortes.desdeR || 0 })),
      alt: `Cuadrícula del producto (${poli(pc)})(${poli(qc)}): cada término de P por cada término de Q`,
    };
  };
  const operaciones = {
    id: 'operaciones',
    titulo: 'Cada término por cada término',
    temas: ['Operaciones con polinomios'],
    pieza: 'alg-tabla',
    // Lee: semejantes y la idea de la cuadrícula, sin decir qué casillas dan x² (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Términos semejantes', texto: 'Dos términos son semejantes si tienen la misma parte literal: 3x² y −5x² lo son; 3x² y 3x no. Al sumar, solo se juntan los semejantes.',
          ecuacion: ['3x² − 5x² = −2x²'] },
        { titulo: 'Como en el cuaderno', texto: 'Cuando multiplicas 23 · 14 en tu cuaderno, cada cifra de un número multiplica a cada cifra del otro. Con polinomios se hace algo parecido, término por término.' },
        { titulo: 'Qué mirar', texto: 'En la cuadrícula, cada fila es un término de P y cada columna, uno de Q. Busca las casillas que tienen la misma potencia de x.' },
      ],
    },
    juega: {
      consigna: 'P = x + a y Q = x² + bx + 2. Cada casilla multiplica un término de P (fila) por uno de Q (columna). Cambia a y b.',
      voz: 'Busca las casillas con la misma potencia de x.',
      controles: [
        { id: 'a', etiqueta: 'a', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: -3, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      ],
      dibujo: val => ({ datos: tablaProducto([1, val.a], [1, val.b, 2]), estado: {} }),
      lectura: val => [P, '·', Q, ` = ${poli(multiplicar([1, val.a], [1, val.b, 2]))}`],
      minimo: 3,
    },
    predice: (() => {
      const pc = [1, 2], qc = [1, -3, 1], prod = multiplicar(pc, qc);
      return {
        pregunta: '¿Cuál es el coeficiente de x² en (x + 2)(x² − 3x + 1)?',
        opciones: [
          { id: 'c', texto: f(prod[1]), correcta: true },
          { id: 'una', texto: '−3', error: 'TAL-SEMEJANTE', siFuera: '−3 sale de x · (−3x). También 2 · x² da x²: hay dos casillas.' },
          { id: 'otra', texto: '2', error: 'TAL-SEMEJANTE', siFuera: '2 sale de 2 · x². Falta x · (−3x), que también da x².' },
          { id: 'coef', texto: '−6', error: 'TAL-COEF-MULT', siFuera: '−6 multiplica 2 por −3, que da un término en x, no en x².' },
        ],
        dibujo: { datos: tablaProducto(pc, qc, { f0: 1, f1: 1 }), estado: { corte: 0 } },
        revelar: { datos: tablaProducto(pc, qc, { resaltar: [[0, 1], [1, 0]] }), estado: {} },
        coincide: `Coincide: x · (−3x) = −3x² y 2 · x² = 2x²; juntos, ${f(prod[1])}x².`,
      };
    })(),
    mira: (() => {
      const pc = [1, 2], qc = [1, -3, 1], prod = multiplicar(pc, qc);
      return {
        datos: tablaProducto(pc, qc, { f0: 1, f1: 2, resaltar: [[0, 1], [1, 0]], desdeR: 3 }),
        pasos: [
          { estado: { corte: 1 }, texto: 'x multiplica a cada término de Q.', ecuacion: ['x³ − 3x² + x'] },
          { estado: { corte: 2 }, texto: '2 multiplica a cada término de Q.', ecuacion: ['2x² − 6x + 2'] },
          { estado: { corte: 3 }, texto: 'Las casillas con x² son semejantes: se suman sus coeficientes.', ecuacion: ['−3x² + 2x² = −x²'] },
          { estado: { corte: 3 }, texto: 'Grado 1 por grado 2 da grado 3.', ecuacion: [`${poli(prod)}`] },
        ],
      };
    })(),
    regla: {
      texto: 'Multiplicar es multiplicar cada término por cada término y luego juntar los semejantes. Sumar solo junta términos con la misma parte literal.',
      ecuacion: ['grado(', P, '·', Q, ') = ', { llave: ['grado ', P, ' + grado ', Q], nota: 'se suman', color: 'c-d' }],
      condicion: 'solo se suman coeficientes de términos semejantes; al juntarlos algún término puede cancelarse.',
    },
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        if (s % 3 === 2) {
          const m = r.ent(2, 6), n = r.ent(1, 5);
          const tabla = lleno => ({ columnas: ['P', 'Q', 'P · Q'], colorCol: ['o', 'i', 'd'], rotulosFila: ['grado'], filas: [[f(m), f(n), lleno ? { t: f(m + n), color: 'd', fuerte: true } : { t: '?', hueco: true }]], alt: `Grados: P ${m}, Q ${n}, P · Q por hallar` });
          return {
            enunciado: `P tiene grado ${m} y Q tiene grado ${n}. ¿Qué grado tiene P · Q?`,
            dibujo: { datos: tabla(false), estado: {} },
            pasos: [
              { tipo: 'pide', texto: ['Piden el grado del producto ', P, ' · ', Q, '.'] },
              { tipo: 'datos', texto: ['El término de mayor grado de ', P, ` lleva x${sup(m)}, y el de `, Q, ` lleva x${sup(n)}.`] },
              { tipo: 'regla', texto: 'El término de mayor grado del producto sale de multiplicar los términos de mayor grado de cada uno. Al multiplicar potencias de x, los exponentes se suman.' },
              { tipo: 'cuentas', texto: 'Multiplico esos dos términos y miro el exponente.', ecuacion: [`x${sup(m)} · x${sup(n)} = x${sup(m + n)}`, '   ·   ', `${m} + ${n} = ${m + n}`], dibujo: { datos: tabla(true), estado: {} } },
              { tipo: 'sentido', texto: `Comprueba: x${sup(m)} son ${m} factores x y x${sup(n)} son ${n}; juntos, ${m + n} factores x. Ningún otro producto llega a ese grado.` },
            ],
            respuesta: `grado ${m + n}`,
          };
        }
        const a = r.noCero(-4, 4), b = r.noCero(-4, 4), c = r.noCero(-5, 5);
        const prod = multiplicar([1, a], [1, b, c]);
        const enX2 = s % 3 === 0, cual = enX2 ? 'x²' : 'x';
        const bien = enX2 ? prod[1] : prod[2];
        const bx = mono(b, [['x', 1]], true);
        const sumaC = prod.reduce((u, v) => u + v, 0);
        return {
          enunciado: `¿Cuál es el coeficiente de ${cual} en (${poli([1, a])})(${poli([1, b, c])})?`,
          dibujo: { datos: tablaProducto([1, a], [1, b, c], { f0: 1, f1: 1 }), estado: { corte: 0 } },
          pasos: [
            { tipo: 'pide', texto: `Piden el número que multiplica a ${cual} cuando el producto ya está desarrollado.` },
            { tipo: 'datos', texto: ['', P, ` = ${poli([1, a])} tiene 2 términos y `, Q, ` = ${poli([1, b, c])} tiene 3: la cuadrícula tiene 2 · 3 = 6 casillas.`] },
            { tipo: 'regla', texto: 'Cada término de P multiplica a cada término de Q. Después junto las casillas que tienen la misma potencia de x y sumo sus coeficientes.' },
            { tipo: 'cuentas', texto: enX2 ? `Dan x² dos casillas: x por ${bx}, y ${f(a)} por x². Sumo sus coeficientes.` : `Dan x dos casillas: x por ${f(c)}, y ${f(a)} por ${bx}. Sumo sus coeficientes.`,
              ecuacion: [enX2 ? `${f(b)} + ${par(a)} = ${f(bien)}` : `${f(c)} + ${par(a)} · ${par(b)} = ${f(bien)}`],
              dibujo: { datos: tablaProducto([1, a], [1, b, c], { resaltar: enX2 ? [[0, 1], [1, 0]] : [[0, 2], [1, 1]] }), estado: {} } },
            { tipo: 'sentido', texto: ['Comprueba con x = 1: ', P, '(1) · ', Q, `(1) = ${f(1 + a)} · ${par(1 + b + c)} = ${f((1 + a) * (1 + b + c))}, lo mismo que suman los coeficientes del producto.`],
              ecuacion: [P, ' · ', Q, ` = ${poli(prod)}   →   suma ${f(sumaC)}`] },
          ],
          respuesta: `El coeficiente de ${cual} es ${f(bien)}`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const m = r.ent(2, 6), n = r.ent(1, 5);
          return {
            pregunta: `P tiene grado ${m} y Q tiene grado ${n}. ¿Qué grado tiene P · Q?`,
            opciones: distintas([
              { id: 'c', texto: f(m + n), correcta: true },
              { id: 'mult', texto: f(m * n), error: 'PO5', siFuera: 'Los grados no se multiplican: xᵐ · xⁿ = xᵐ⁺ⁿ.' },
              { id: 'max', texto: f(Math.max(m, n)), error: 'PO23', siFuera: 'Ese es el grado de P + Q (si no se cancela); el producto suma grados.' },
              { id: 'dif', texto: f(Math.abs(m - n)), error: 'TAL-GRADO-RESTA', siFuera: 'Restar grados corresponde a dividir, no a multiplicar.' },
            ]),
            solucion: { texto: 'El término de mayor grado sale de multiplicar los dos principales.', ecuacion: [`${m} + ${n} = ${m + n}`] },
          };
        }
        const a = r.noCero(-4, 4), b = r.noCero(-4, 4), c = r.noCero(-5, 5);
        const prod = multiplicar([1, a], [1, b, c]);
        const enX2 = s % 3 === 0;
        const bien = enX2 ? prod[1] : prod[2];
        const ds = enX2
          ? [{ id: 'una', v: b, siFuera: `Falta ${f(a)} · x², que también da x².` }, { id: 'otra', v: a, siFuera: `Falta x · (${f(b)}x), que también da x².` }, { id: 'mult', v: a * b, siFuera: `${f(a)} · ${par(b)} da un término en x, no en x².` }]
          : [{ id: 'una', v: c, siFuera: `Falta ${f(a)} · ${par(b)}x, que también da x.` }, { id: 'otra', v: a * b, siFuera: `Falta x · ${par(c)}, que también da x.` }, { id: 'mult', v: a * c, siFuera: `${f(a)} · ${par(c)} da el término independiente.` }];
        return {
          pregunta: `¿Cuál es el coeficiente de ${enX2 ? 'x²' : 'x'} en (${poli([1, a])})(${poli([1, b, c])})?`,
          opciones: distintas([{ id: 'c', texto: f(bien), correcta: true }, ...ds.map(d => ({ id: d.id, texto: f(d.v), error: d.id === 'mult' ? 'TAL-COEF-MULT' : 'TAL-SEMEJANTE', siFuera: d.siFuera }))]),
          solucion: {
            texto: `Dos casillas dan ${enX2 ? 'x²' : 'x'}; se suman.`,
            ecuacion: [enX2 ? `${f(b)} + ${par(a)} = ${f(bien)}` : `${f(c)} + ${f(a)} · ${par(b)} = ${f(bien)}`],
            dibujo: { datos: tablaProducto([1, a], [1, b, c], { resaltar: enX2 ? [[0, 1], [1, 0]] : [[0, 2], [1, 1]] }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: un polinomio cúbico que el alumno arma, con el punto que recorre la curva en pasos de medio.
  const cubica = v => [1, v.b, v.c, v.d];
  const dibujoCub = v => curvaP(cubica(v), -3, 3, [{ x: v.x, y: evaluar(cubica(v), v.x), color: 'd', guias: true, rotulo: f(evaluar(cubica(v), v.x)) }], 'P');
  const mesaCubica = {
    id: 'curva-cubica', titulo: 'Arma tu polinomio y evalúalo', pieza: 'ejes',
    consigna: 'P(x) = x³ + bx² + cx + d. Elige coeficientes y arrastra el punto por la curva: ¿qué altura tiene en x = 0 y en x = 1?',
    controles: [
      { id: 'x', etiqueta: 'x', min: -3, max: 3, paso: 0.5, inicio: 1, decimales: 1, color: 'c-o' },
      { id: 'b', etiqueta: 'b', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
      { id: 'c', etiqueta: 'c', min: -6, max: 6, paso: 1, inicio: -3, decimales: 0 },
      { id: 'd', etiqueta: 'd', min: -5, max: 5, paso: 1, inicio: 1, decimales: 0 },
    ],
    dibujo: v => ({ datos: dibujoCub(v), estado: {} }),
    lectura: v => [P, `(x) = ${poli(cubica(v))}:  `, P, `(${f(v.x, 1)}) = ${f(evaluar(cubica(v), v.x), 3)}`],
    arrastres: [{ id: 'punto', etiqueta: 'punto de la curva', color: 'c-o',
      donde: v => { const g = EJES().geometria(dibujoCub(v)); return { x: g.X(v.x), y: g.Y(evaluar(cubica(v), v.x)) }; },
      mover: (pt, v) => { const g = EJES().geometria(dibujoCub(v)); return { x: inversa(g.X, -3, 3)(pt.x) }; } }],
    // Retos comprobados (docs/teoria.md §4d): evalúan con evaluar(cubica(v), x), lo mismo que pone el punto.
    invitaciones: [
      { texto: 'Pon el punto en x = 1 y haz que caiga sobre el eje x.',
        logrado: v => v.x === 1 && evaluar(cubica(v), 1) === 0,
        bien: 'P(1) es la suma de los coeficientes: 1 + b + c + d = 0.' },
      { texto: 'Haz que la curva corte el eje y en −4.',
        logrado: v => evaluar(cubica(v), 0) === -4,
        bien: 'P(0) es el término independiente: se lee en el eje y.' },
      { texto: 'Pon el punto en x = 1 y haz que P(1) = P(−1).',
        logrado: v => v.x === 1 && evaluar(cubica(v), 1) === evaluar(cubica(v), -1),
        bien: 'P(1) − P(−1) = 2 + 2c: con c = −1 se empatan.' },
      { texto: 'Busca el punto más alto que se puede lograr en esta mesa.',
        logrado: v => evaluar(cubica(v), v.x) === MAX_CUBICA,
        bien: 'Todo al máximo y x = 3: 27 + 27 + 18 + 5 = 77.' },
      { texto: 'Guarda dos polinomios distintos con la misma altura en el mismo x.',
        logrado: (v, guardados) => guardados.some(g => g.x === v.x && (g.b !== v.b || g.c !== v.c || g.d !== v.d) && evaluar(cubica(g), g.x) === evaluar(cubica(v), v.x))
          && guardados.some(g => ['x', 'b', 'c', 'd'].every(k => g[k] === v[k])),
        bien: '¿Fue en x = 0? Ahí solo manda d: los demás términos se anulan.' },
    ],
  };
  // La mayor altura de la mesa del cúbico (x de −3 a 3 cada 0,5; b, c y d en sus rangos): se calcula, no se escribe.
  const MAX_CUBICA = (() => {
    let m = -Infinity;
    for (let x = -3; x <= 3; x += 0.5) for (let b = -3; b <= 3; b++) for (let c = -6; c <= 6; c++) for (let d = -5; d <= 5; d++) m = Math.max(m, evaluar([1, b, c, d], x));
    return m;
  })();
  // Mesa 2: P contra Q en curvas y en casillas a la vez; el cursor x mide las dos alturas.
  const QL = [1, 2, -1];   // Q(x) = x² + 2x − 1
  const dosLab = v => {
    const pc = [v.a, v.b, v.c], yp = evaluar(pc, v.t), yq = evaluar(QL, v.t);
    const ys = [...muestra(pc, -3, 2), ...muestra(QL, -3, 2)].map(z => z[1]);
    const lo = Math.floor(Math.min(0, ...ys) / 4) * 4, hi = Math.ceil(Math.max(0, ...ys) / 4) * 4;
    return {
      x: { min: -3, max: 2, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: lo, max: hi, paso: hi - lo > 24 ? 8 : 4, nombre: 'y', decimales: 0 },
      curvas: [{ puntos: muestra(QL, -3, 2), color: 'i', rotulo: 'Q', en: [-3, evaluar(QL, -3)] }, { puntos: muestra(pc, -3, 2), color: 'o', rotulo: 'P', en: [2, evaluar(pc, 2)] }],
      puntos: [{ x: v.t, y: yq, color: 'i' }, { x: v.t, y: yp, color: 'o', guias: true }],
      alt: `P(x) = ${poli(pc)} y Q(x) = x² + 2x − 1; en x = ${f(v.t)}, P vale ${f(yp)} y Q vale ${f(yq)}`,
    };
  };
  const mesaDos = {
    id: 'dos-curvas', titulo: 'Dos curvas, tres casillas', pieza: 'ejes',
    consigna: 'P(x) = ax² + bx + c y Q(x) = x² + 2x − 1. Busca un x donde valgan igual sin que las casillas coincidan.',
    controles: [
      { id: 't', etiqueta: 'x', min: -3, max: 2, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
      { id: 'a', etiqueta: 'a', min: -1, max: 2, paso: 1, inicio: 0, decimales: 0 },
      { id: 'b', etiqueta: 'b', min: -2, max: 4, paso: 1, inicio: 2, decimales: 0 },
      { id: 'c', etiqueta: 'c', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
    ],
    dibujo: v => ({ datos: dosLab(v), estado: {} }),
    lectura: v => {
      const k = [v.a, v.b, v.c].filter((c, i) => c === QL[i]).length;
      return [P, ` = ${f(evaluar([v.a, v.b, v.c], v.t))}, `, Q, ` = ${f(evaluar(QL, v.t))}`, '   ·   ', `casillas: ${k} de 3`];
    },
    arrastres: [{ id: 'cursor', etiqueta: 'punto de P en la curva', color: 'c-o',
      donde: v => { const g = EJES().geometria(dosLab(v)); return { x: g.X(v.t), y: g.Y(evaluar([v.a, v.b, v.c], v.t)) }; },
      mover: (pt, v) => { const g = EJES().geometria(dosLab(v)); return { t: inversa(g.X, -3, 2)(pt.x) }; } }],
    invitaciones: [
      { texto: 'Haz que P y Q valgan igual en x = −2, con casillas distintas.',
        logrado: v => v.t === -2 && evaluar([v.a, v.b, v.c], -2) === evaluar(QL, -2) && [v.a, v.b, v.c].some((c, i) => c !== QL[i]),
        bien: 'Empatan en un punto, pero no son el mismo polinomio.' },
      { texto: 'Copia Q casilla por casilla.',
        logrado: v => [v.a, v.b, v.c].every((c, i) => c === QL[i]),
        bien: 'Mismos coeficientes: valen igual en todo x. Son idénticos.' },
      { texto: 'Haz que P sea constante y valga lo mismo que Q en el x marcado.',
        logrado: v => v.a === 0 && v.b === 0 && evaluar([v.a, v.b, v.c], v.t) === evaluar(QL, v.t),
        bien: 'Grado 0: una recta horizontal que corta a la parábola Q.' },
      { texto: 'Sin copiar Q, guarda dos x donde P y Q empaten sin cambiar los coeficientes.',
        logrado: (v, guardados) => {
          const empata = g => evaluar([g.a, g.b, g.c], g.t) === evaluar(QL, g.t), igual = g => g.a === v.a && g.b === v.b && g.c === v.c;
          return [v.a, v.b, v.c].some((c, i) => c !== QL[i]) && empata(v) && guardados.some(g => igual(g) && g.t !== v.t && empata(g)) && guardados.some(g => igual(g) && g.t === v.t);
        },
        bien: 'Dos empates no bastan para ser idénticos: en grado 2 hacen falta tres.' },
    ],
  };
  // Mesa 3: el producto con un control más (el término independiente de Q).
  const mesaProducto = {
    id: 'producto-libre', titulo: 'La cuadrícula del producto', pieza: 'alg-tabla',
    consigna: 'P = x + a y Q = x² + bx + c. ¿Con qué valores se cancela el término en x² o el término en x?',
    controles: [
      { id: 'a', etiqueta: 'a', min: -4, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      { id: 'b', etiqueta: 'b', min: -4, max: 4, paso: 1, inicio: -2, decimales: 0, color: 'c-i' },
      { id: 'c', etiqueta: 'c', min: -4, max: 4, paso: 1, inicio: 4, decimales: 0, color: 'c-i' },
    ],
    dibujo: v => ({ datos: tablaProducto([1, v.a], [1, v.b, v.c]), estado: {} }),
    lectura: v => [P, '·', Q, ` = ${poli(multiplicar([1, v.a], [1, v.b, v.c]))}`],
    invitaciones: [
      { texto: 'Consigue un producto sin término independiente.',
        logrado: v => multiplicar([1, v.a], [1, v.b, v.c])[3] === 0,
        bien: 'Basta que a o c sea 0: el término independiente es a · c.' },
      { texto: 'Haz que todos los coeficientes del producto sean positivos.',
        logrado: v => multiplicar([1, v.a], [1, v.b, v.c]).every(c => c > 0),
        bien: 'Con todo positivo, ningún término se resta al juntar los semejantes.' },
      { texto: 'Busca el producto con el mayor término independiente.',
        logrado: v => multiplicar([1, v.a], [1, v.b, v.c])[3] === Math.max(...[-4, 4].flatMap(a => [-4, 4].map(c => a * c))),
        bien: 'a · c = 16: dos signos iguales dan positivo.' },
      { texto: 'Haz que el producto sea x³ − 8.',
        logrado: v => poli(multiplicar([1, v.a], [1, v.b, v.c])) === poli([1, 0, 0, -8]),
        bien: '(x − 2)(x² + 2x + 4): los términos del medio se cancelan.' },
    ],
  };

  return {
    unidad: 'algebra.polinomios',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/ejes.js'],
    laboratorio: [mesaCubica, mesaDos, mesaProducto],
    // Glosario por tema (docs/teoria.md §4d): las palabras que esta unidad estrena en álgebra.
    glosario: [
      { termino: 'polinomio', formas: ['polinomio', 'polinomios'], def: 'Suma de términos con letras elevadas a exponentes enteros no negativos.',
        ejemplo: 'x³ − 3x + 1 es uno; 1/x no lo es.', ver: ['término', 'grado'] },
      { termino: 'término', formas: ['término', 'términos'], def: 'Cada sumando de una expresión: un número por letras con sus exponentes.',
        ejemplo: 'En 2x² − 5x + 3 hay tres: 2x², −5x y 3.', ver: ['coeficiente', 'parte literal'] },
      { termino: 'variable', formas: ['variable', 'variables'], def: 'Letra que puede tomar distintos valores numéricos.', ejemplo: 'En P(x) = x² + 1, es x.' },
      { termino: 'parte literal', def: 'Las letras de un término con sus exponentes, sin el número que las multiplica.', ejemplo: 'En −7x²y es x²y.' },
      { termino: 'grado', formas: ['grado', 'grados'], def: 'En un término, la suma de los exponentes de sus letras.', ejemplo: '3x²y⁴ tiene 2 + 4 = 6.',
        ver: ['grado absoluto', 'grado relativo'] },
      { termino: 'grado absoluto', def: 'El mayor de los grados de los términos de un polinomio.', ejemplo: 'x³y + x²y⁴: los grados son 4 y 6; es 6.' },
      { termino: 'grado relativo', def: 'El mayor exponente que tiene una letra elegida en el polinomio.', ejemplo: 'En x³y + x²y⁴, respecto a x es 3.' },
      { termino: 'evaluar', formas: ['evaluar', 'evalúa', 'evaluarlo'], def: 'Reemplazar la letra por un número y hacer las cuentas.',
        ejemplo: 'P(x) = x² − 1 en x = 3: P(3) = 8.' },
      { termino: 'completo', formas: ['completo', 'completos'], def: 'Así es un polinomio que tiene todas las potencias de la letra, desde su grado hasta x⁰.',
        ejemplo: 'x³ + x − 1 no lo es: falta x².' },
      { termino: 'ordenado', formas: ['ordenado', 'ordenados'], def: 'Así es un polinomio cuyos exponentes solo bajan, o solo suben, de un término al siguiente.' },
      { termino: 'homogéneo', formas: ['homogéneo', 'homogéneos'], def: 'Así es un polinomio cuyos términos tienen todos el mismo grado.', ejemplo: 'x² + 3xy − y²: grado 2 en cada uno.' },
      { termino: 'idéntico', formas: ['idéntico', 'idénticos'], def: 'Dos polinomios lo son si tienen el mismo coeficiente en cada potencia: valen igual para todo x.' },
      { termino: 'semejante', formas: ['semejante', 'semejantes'], def: 'Dos términos lo son si tienen la misma parte literal: solo esos se pueden juntar al sumar.',
        ejemplo: '3x² + 5x² = 8x²; 3x² + 5x no se junta.' },
    ],
    historia: {
      texto: 'En 1591, François Viète defendió usar letras para las cantidades conocidas y para las desconocidas. No era todavía nuestra escritura de polinomios, pero permitió razonar sobre familias enteras de problemas y no solo sobre ejemplos con números. Esa es la idea de esta unidad: coeficientes, exponentes y variables cumplen papeles distintos, y operar debe conservar el valor de la expresión.',
      pregunta: '¿Qué ganas al escribir una letra en vez de un número?',
      fuente: { titulo: 'O’Connor y Robertson, François Viète — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Viete/' },
    },
    ideas: [grados, valor, especiales, igualdad, operaciones],
  };
});
