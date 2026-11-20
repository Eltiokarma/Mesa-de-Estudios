/*
 * Generador «Ángulos en posición normal»: la práctica de las cinco ideas de trigonometria.angulos-en-posicion-normal
 * (contenido/teoria/trigonometria/angulos-en-posicion-normal.js). Formato "predicciones" (docs/arquitectura.md). Funciona
 * en el navegador (window.Generadores['trig-posicion-normal']) y en Node (require). No usa ningún motor: las razones son
 * cocientes de x, y y r = √(x² + y²) con números de la forma c·√t, exactos.
 *
 * Propuesta: docs/etapa8/propuesta-trigonometria.md §7 (Gerson delegó el criterio). Objetos, como en la teoría: el plano
 * del pueblo (la casa), la rueda de la fortuna, la veleta, el reloj y la rueda de bicicleta.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; generar(semilla, { tipo }) uno solo; sin nada, las cinco ideas con el mismo peso.
 *   razones-coordenadas     razon-punto (1) una razón de P(x, y) · expresion (2) sec θ ± tan θ o csc θ ± cot θ ·
 *                           coordenada-falta (3) P(a, y) o P(x, a) con r y el signo de a (San Marcos: el signo de la abscisa)
 *   signos-cuadrante        signos (1) los signos de dos razones de un ángulo · cuadrante-signos (2) el cuadrante por dos
 *                           signos · razon-cuadrante (3) una razón y el cuadrante dan otra (San Marcos 2026-II: la raíz del
 *                           cuadrante)
 *   cuadrantales            razon-eje (1) una razón de 0°, 90°, 180°, 270° o 360° · expresion-ejes (2) p sen A − q cos B +
 *                           t tan C · multiplos (3) un cociente con θ, 2θ, θ/2… para θ = 90° o 180°
 *   giro-horario            cuadrante-negativo (1) el cuadrante de un ángulo negativo · razon-negativo (2) una razón de un
 *                           negativo sobre un eje · cuenta-positivas (3) cuántas de cuatro razones de negativos son positivas
 *   coterminales-negativos  coterminal (1) el coterminal entre 0° y 360° · cual-coterminal (2) cuál es coterminal · k-veces
 *                           (3) α = kβ coterminales con β en un intervalo
 * Lo que la teoría dejó fuera no entra: el ángulo de referencia, la paridad sen(−θ) = −sen θ, la circunferencia de radio 1.
 *
 * Notación y colores (regla de la unidad, cabecera de la teoría; docs/molde-unidad.md §5b): los ángulos en carmín (ang,
 * h), la ordenada y en naranja (y, o), la abscisa x en turquesa (x, i) y lo que se pide (la razón) en violeta (f). Letras:
 * θ, α, β, P, x, y, r, a, n. Datos (docs/plan-calidad.md §3, punto 13): las definiciones con x, y, r, los signos de las
 * coordenadas en cada cuadrante, los puntos de los ejes y la condición de coterminales; nunca el paso hecho ni la respuesta.
 * Errores: TR7, TR10, TR11, TR12 y TR15 son de docs/investigacion/trigonometria-ideas-erroneas.md (parciales); los TRPN-,
 * TRNEG- y RN- son hipótesis de aula, con los códigos de la teoría. Cada explicación empieza por lo que el alumno hizo bien
 * y dice el valor que da su error.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'trig-posicion-normal';
  const TRF = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d);
  const fa = g => String(g).replace('-', '−');   // grados sin espacio de miles, como en el examen
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const mod360 = g => ((g % 360) + 360) % 360;

  // ---- Números c·√t: (p√u)/(q√w) simplificado ----
  function sinCuad(N) { let s = 1, t = N; for (let k = 2; k * k <= t; k++) while (t % (k * k) === 0) { t /= k * k; s *= k; } return [s, t]; }
  function coc(p, u, q, w) {
    if (q === 0) return null;
    const [s, t] = sinCuad(u * w);
    let n = p * s, d = q * w;
    if (d < 0) { n = -n; d = -d; }
    const m = gcd(n, d) || 1;
    return { n: n / m, d: d / m, t };
  }
  const valor = c => (c === null ? null : c.n / c.d * Math.sqrt(c.t));
  function txt(c) {
    if (c === null) return 'No está definida';
    if (c.n === 0) return '0';
    const a = Math.abs(c.n), cuerpo = c.t === 1 ? `${a}` : `${a === 1 ? '' : a}√${c.t}`;
    return `${c.n < 0 ? '−' : ''}${cuerpo}${c.d === 1 ? '' : '/' + c.d}`;
  }
  const clave = c => (c === null ? 'indef' : `${c.n}/${c.d}r${c.t}`);
  const radio = (x, y) => sinCuad(x * x + y * y);
  function razon(fn, x, y) {
    const [s, t] = radio(x, y);
    return { sen: coc(y, 1, s, t), cos: coc(x, 1, s, t), tan: coc(y, 1, x, 1), cot: coc(x, 1, y, 1), sec: coc(s, t, x, 1), csc: coc(s, t, y, 1) }[fn];
  }
  const NOMBRE = { sen: 'seno', cos: 'coseno', tan: 'tangente', cot: 'cotangente', sec: 'secante', csc: 'cosecante' };
  const RECI = { sen: 'csc', cos: 'sec', tan: 'cot', cot: 'tan', sec: 'cos', csc: 'sen' };
  const CRUZA = { sen: 'cos', cos: 'sen', tan: 'cot', cot: 'tan', sec: 'csc', csc: 'sec' };
  const PARTE = { sen: 'y/r', cos: 'x/r', tan: 'y/x', cot: 'x/y', sec: 'r/x', csc: 'r/y' };
  const ROM = ['', 'I', 'II', 'III', 'IV'];
  const cuad = g => { const m = mod360(g); return m % 90 === 0 ? 0 : Math.ceil(m / 90); };
  const SIG = { 1: [1, 1], 2: [-1, 1], 3: [-1, -1], 4: [1, -1] };
  const signoDe = (fn, q) => { const [sx, sy] = SIG[q]; return { sen: sy, csc: sy, cos: sx, sec: sx, tan: sx * sy, cot: sx * sy }[fn]; };
  const sg = s => (s > 0 ? '+' : '−');
  const eje = g => ({ 0: [1, 0], 90: [0, 1], 180: [-1, 0], 270: [0, -1] })[mod360(g)];
  function enEje(fn, g) { const [x, y] = eje(g), [p, q] = { sen: [y, 1], cos: [x, 1], tan: [y, x], cot: [x, y], sec: [1, x], csc: [1, y] }[fn]; return q === 0 ? null : p / q; }
  const ejeTxt = val => (val === null ? 'No está definida' : val === 0 ? '0' : val > 0 ? '1' : '−1');

  const TH = v('ang', 'θ');
  const VARS = {
    ang: { nombre: 'el ángulo', color: 'h' },
    x: { nombre: 'la abscisa de P', color: 'i' },
    y: { nombre: 'la ordenada de P', color: 'o' },
    pide: { nombre: 'la razón que se pide', color: 'f' },
  };
  const resp = id => (/^TR(7|10|11|12|15)$/.test(id) ? { respaldo: 'parcial', fuente: TRF } : { respaldo: 'hipotesis', fuente: null });
  const err = (id, c, texto, explicacion) => Object.assign({ id, clave: c, texto, explicacion }, resp(id));

  // ---- Datos (una línea cada uno; herramientas, no el paso hecho) ----
  const D = {
    def: 'Con P(x, y) en el lado final: sen θ = y/r, cos θ = x/r y tan θ = y/x.',
    rec: 'cot θ = x/y, sec θ = r/x y csc θ = r/y.',
    r: 'r = √(x² + y²): la distancia de P al origen, siempre positiva.',
    cuad: 'Cuadrantes: I (x > 0, y > 0), II (x < 0, y > 0), III (x < 0, y < 0) y IV (x > 0, y < 0).',
    eje: 'Sobre los ejes, con r = a: 0° da (a, 0); 90°, (0, a); 180°, (−a, 0); 270°, (0, −a).',
    cero: 'Entre 0 no se divide: a/0 no da ningún número.',
    neg: 'Un ángulo negativo gira en sentido horario desde el eje x positivo.',
    vuelta: 'Una vuelta mide 360°.',
    cot: 'Coterminales: α − β = 360° · n, con n entero.',
  };

  const TERNAS = [[3, 4], [5, 12], [8, 15], [7, 24], [20, 21], [6, 8], [9, 12], [12, 16]];
  function punto(rng) {
    const [a, b] = rng.elegir(TERNAS), swap = rng.entero(0, 1);
    return [(rng.entero(0, 1) ? 1 : -1) * (swap ? b : a), (rng.entero(0, 1) ? 1 : -1) * (swap ? a : b)];
  }

  // ===================== Idea 1: las razones salen de P =====================
  function razonPunto(rng) {
    const [x, y] = punto(rng), fn = rng.elegir(['sen', 'cos', 'tan', 'cot', 'sec', 'csc']), ok = razon(fn, x, y);
    const errs = [
      err('TR12', clave(razon(fn, Math.abs(x), Math.abs(y))), txt(razon(fn, Math.abs(x), Math.abs(y))), `El tamaño del cociente está bien; faltan los signos de P: sin ellos sale ${txt(razon(fn, Math.abs(x), Math.abs(y)))}.`),
      err('TRPN-INVERSA', clave(razon(RECI[fn], x, y)), txt(razon(RECI[fn], x, y)), `Los números están bien, pero ${txt(razon(RECI[fn], x, y))} va al revés: es la ${NOMBRE[RECI[fn]]}.`),
      err('TR11', clave(razon(CRUZA[fn], x, y)), txt(razon(CRUZA[fn], x, y)), `Hacer un cociente está bien, pero ${txt(razon(CRUZA[fn], x, y))} cambia x por y: es la ${NOMBRE[CRUZA[fn]]}.`),
    ];
    if (fn === 'sen' || fn === 'cos') { const c = fn === 'sen' ? y : x; errs.push(err('TR7', `n${c}`, f(c), `${f(c)} es la coordenada de P, bien leída; el ${NOMBRE[fn]} la divide entre r.`)); }
    const [s, t] = radio(x, y);
    return {
      enunciado: ['El lado final de ', TH, ` pasa por P(${f(x)}, ${f(y)}).`], pregunta: [`¿Cuánto vale ${fn} `, TH, '?'],
      datos: [D.def].concat(['cot', 'sec', 'csc'].includes(fn) ? [D.rec] : [], ['tan', 'cot'].includes(fn) ? [] : [D.r]),
      correcta: { clave: clave(ok), texto: txt(ok) }, errores: errs,
      solucion: [[`r = ${t === 1 ? s : (s === 1 ? '' : s) + '√' + t}.`], [`${fn} `, TH, ` = ${PARTE[fn]} = `, v('pide', txt(ok))]],
      _datos: { x, y, fn },
    };
  }
  const EXPR = { 'sec θ + tan θ': ['r', '+y', 'x'], 'sec θ − tan θ': ['r', '-y', 'x'], 'csc θ + cot θ': ['r', '+x', 'y'], 'csc θ − cot θ': ['r', '-x', 'y'] };
  const OTRA = { 'sec θ + tan θ': 'sec θ − tan θ', 'sec θ − tan θ': 'sec θ + tan θ', 'csc θ + cot θ': 'csc θ − cot θ', 'csc θ − cot θ': 'csc θ + cot θ' };
  function valExpr(e, x, y) {
    const r = Math.hypot(x, y), [, s, d] = EXPR[e], sgn = s[0] === '+' ? 1 : -1, otro = s[1] === 'x' ? x : y, den = d === 'x' ? x : y;
    return coc(r + sgn * otro, 1, den, 1);
  }
  function expresion(rng) {
    const [x, y] = punto(rng), e = rng.elegir(Object.keys(EXPR)), ok = valExpr(e, x, y);
    if (!ok || ok.n === 0) return null;
    const ab = valExpr(e, Math.abs(x), Math.abs(y)), otra = valExpr(OTRA[e], x, y), inv = coc(ok.d, 1, ok.n, 1), r = Math.hypot(x, y), cs = coc(x + y, 1, r, 1);
    return {
      enunciado: ['El lado final de ', TH, ` pasa por P(${f(x)}, ${f(y)}).`], pregunta: [`Calcula E = ${e.replace(/θ/g, 'θ')}.`],
      datos: [D.def, D.rec, D.r],
      correcta: { clave: clave(ok), texto: txt(ok) },
      errores: [
        err('TR12', clave(ab), txt(ab), `Elegir las razones está bien; faltan los signos de P: sin ellos sale ${txt(ab)}.`),
        err('RN-SUMA', clave(otra), txt(otra), `Los cocientes están bien; ${txt(otra)} es ${OTRA[e]}, el otro signo entre ellos.`),
        err('TRPN-INVERSA', clave(inv), txt(inv), `La suma de los cocientes está bien; ${txt(inv)} la da vuelta.`),
        err('TR11', clave(cs), txt(cs), `Sumar dos razones está bien; ${txt(cs)} suma sen θ y cos θ, no las de E.`),
      ],
      solucion: [[`r = ${f(r)}. Las dos razones de E tienen el mismo denominador, ${EXPR[e][2]}: se suman los numeradores.`], ['E = ', v('pide', txt(ok))]],
      _datos: { x, y, e },
    };
  }
  function coordenadaFalta(rng) {
    const [x, y] = punto(rng), r = Math.hypot(x, y), falta = rng.entero(0, 1) ? 'x' : 'y';
    const fn = falta === 'x' ? rng.elegir(['cos', 'tan']) : rng.elegir(['sen', 'cot']);
    const signo = (falta === 'x' ? x : y) < 0 ? 'negativo' : 'positivo';
    const Pt = falta === 'x' ? `P(a, ${f(y)})` : `P(${f(x)}, a)`, [x2, y2] = falta === 'x' ? [-x, y] : [x, -y];
    const ok = razon(fn, x, y), mal = razon(fn, x2, y2);
    return {
      enunciado: ['El lado final de ', TH, ` pasa por ${Pt}, con a ${signo}, y su radio vector mide ${f(r)}.`], pregunta: [`¿Cuánto vale ${fn} `, TH, '?'],
      datos: [D.def].concat(fn === 'cot' ? [D.rec] : [], [D.r]),
      correcta: { clave: clave(ok), texto: txt(ok) },
      errores: [
        err('RN-SIGNO-DATO', clave(mal), txt(mal), `a² está bien; pero a es ${signo}: con el otro signo sale ${txt(mal)}.`),
        err('TRPN-INVERSA', clave(razon(RECI[fn], x, y)), txt(razon(RECI[fn], x, y)), `a está bien; ${txt(razon(RECI[fn], x, y))} es la ${NOMBRE[RECI[fn]]}, al revés.`),
        err('TR11', clave(razon(CRUZA[fn], x, y)), txt(razon(CRUZA[fn], x, y)), `a está bien; ${txt(razon(CRUZA[fn], x, y))} cambia x por y: es la ${NOMBRE[CRUZA[fn]]}.`),
      ],
      solucion: [[`a² = ${f(r * r)} − ${f(falta === 'x' ? y * y : x * x)}; con su signo, a = ${f(falta === 'x' ? x : y)}.`], [`${fn} `, TH, ` = ${PARTE[fn]} = `, v('pide', txt(ok))]],
      _datos: { x, y, fn, falta },
    };
  }

  // ===================== Idea 2: el signo sale de x e y =====================
  const PARES = [['sen', 'cos'], ['tan', 'cos'], ['sen', 'tan'], ['csc', 'sec'], ['cot', 'sen'], ['sec', 'tan']];
  function signos(rng) {
    let g = 10 * rng.entero(1, 35); while (g % 90 === 0) g += 10;
    const q = cuad(g), [a, b] = rng.elegir(PARES), combo = k => `${a} ${sg(signoDe(a, k))}, ${b} ${sg(signoDe(b, k))}`, [sx, sy] = SIG[q];
    return {
      enunciado: [TH, ` = ${g}° está en posición normal.`], pregunta: [`¿Qué signos tienen ${a} `, TH, ` y ${b} `, TH, '?'],
      datos: [D.def, D.rec, D.cuad],
      correcta: { clave: `q${q}`, texto: combo(q) },
      errores: [1, 2, 3, 4].filter(k => k !== q).map(k => err(SIG[k][0] === sy && SIG[k][1] === sx ? 'TR11' : k === 1 ? 'TR12' : 'TRPN-TODO-NEG', `q${k}`, combo(k),
        `Esos signos son los del cuadrante ${ROM[k]}; ${g}° está en el ${ROM[q]}: x ${sg(sx)}, y ${sg(sy)}.`)),
      solucion: [[`${g}° está en el cuadrante ${ROM[q]}: x ${sg(sx)} e y ${sg(sy)}.`], [v('pide', combo(q))]],
      _datos: { g, a, b },
    };
  }
  const CONDS = [['sen', 1], ['sen', -1], ['cos', 1], ['cos', -1], ['tan', 1], ['tan', -1], ['csc', -1], ['sec', 1], ['cot', -1]];
  function cuadranteSignos(rng) {
    const c1 = rng.elegir(CONDS), c2 = rng.elegir(CONDS);
    if (c1[0] === c2[0]) return null;
    const cumple = c => [1, 2, 3, 4].filter(k => signoDe(c[0], k) === c[1]), ambos = cumple(c1).filter(k => cumple(c2).includes(k));
    if (ambos.length !== 1) return null;
    const q = ambos[0], s = ([fn, x]) => `${fn} θ ${x > 0 ? '> 0' : '< 0'}`;
    return {
      enunciado: [TH, ` cumple ${s(c1)} y ${s(c2)}.`], pregunta: ['¿En qué cuadrante está ', TH, '?'],
      datos: [D.def, D.rec, D.cuad],
      correcta: { clave: `q${q}`, texto: `En el ${ROM[q]}` },
      errores: [1, 2, 3, 4].filter(k => k !== q).map(k => {
        const en1 = cumple(c1).includes(k), en2 = cumple(c2).includes(k);
        return err(en1 || en2 ? 'RN-UNA-CONDICION' : 'TRPN-TODO-NEG', `q${k}`, `En el ${ROM[k]}`,
          en1 || en2 ? `En el ${ROM[k]} se cumple ${s(en1 ? c1 : c2)}, bien; pero no ${s(en1 ? c2 : c1)}.` : `Mirar los signos de x e y está bien; en el ${ROM[k]} no se cumple ninguna de las dos.`);
      }),
      solucion: [[`${s(c1)}: ${cumple(c1).map(k => ROM[k]).join(' y ')}; ${s(c2)}: ${cumple(c2).map(k => ROM[k]).join(' y ')}.`], [v('pide', `Cuadrante ${ROM[q]}`)]],
      _datos: { c1, c2 },
    };
  }
  function razonCuadrante(rng) {
    const [a, b] = rng.elegir(TERNAS), swap = rng.entero(0, 1), q = rng.entero(1, 4), [sx, sy] = SIG[q];
    const x = sx * (swap ? b : a), y = sy * (swap ? a : b);
    const dado = rng.elegir(['sen', 'cos', 'tan']), pide = rng.elegir(['sen', 'cos', 'tan', 'sec', 'csc', 'cot'].filter(z => z !== dado && z !== RECI[dado]));
    const [x2, y2] = dado === 'sen' ? [-x, y] : dado === 'cos' ? [x, -y] : [-x, -y], q2 = cuad(Math.atan2(y2, x2) * 180 / Math.PI);
    const ok = razon(pide, x, y);
    return {
      enunciado: [TH, ` está en el cuadrante ${ROM[q]} y ${dado} `, TH, ` = ${txt(razon(dado, x, y))}.`], pregunta: [`¿Cuánto vale ${pide} `, TH, '?'],
      datos: [D.def].concat(['sec', 'csc', 'cot'].includes(pide) ? [D.rec] : [], [D.r, D.cuad]),
      correcta: { clave: clave(ok), texto: txt(ok) },
      errores: [
        err('RN-RAIZ', clave(razon(pide, x2, y2)), txt(razon(pide, x2, y2)), `Armar P con ${dado} θ está bien; pero ese signo es del cuadrante ${ROM[q2]}: da ${txt(razon(pide, x2, y2))}.`),
        err('TR12', clave(razon(pide, Math.abs(x), Math.abs(y))), txt(razon(pide, Math.abs(x), Math.abs(y))), `El tamaño está bien; en el ${ROM[q]}, x ${sg(sx)} e y ${sg(sy)} ponen el signo.`),
        err('TRPN-INVERSA', clave(razon(RECI[pide], x, y)), txt(razon(RECI[pide], x, y)), `P está bien armado; ${txt(razon(RECI[pide], x, y))} es la ${NOMBRE[RECI[pide]]}, al revés.`),
        err('TR11', clave(razon(CRUZA[pide], x, y)), txt(razon(CRUZA[pide], x, y)), `P está bien armado; ${txt(razon(CRUZA[pide], x, y))} cambia x por y: es la ${NOMBRE[CRUZA[pide]]}.`),
      ],
      solucion: [[`Con ${dado} θ y los signos del ${ROM[q]}: P(${f(x)}, ${f(y)}) y r = ${f(Math.hypot(x, y))}.`], [`${pide} `, TH, ` = ${PARTE[pide]} = `, v('pide', txt(ok))]],
      _datos: { x, y, q, dado, pide },
    };
  }

  // ===================== Idea 3: cero no es «no definida» =====================
  const FNS = ['sen', 'cos', 'tan', 'cot', 'sec', 'csc'];
  const OPS = ['0', '1', '−1', 'No está definida'], claveEje = t => ({ 0: 'e0', 1: 'e1', '−1': 'em1', 'No está definida': 'indef' })[t];
  function opcionesEje(okTxt, malTxt) {
    return OPS.filter(t => t !== okTxt).map(t => {
      if (t === 'No está definida') return err('TRPN-CERO-INDEF', claveEje(t), t, 'Sería así con el 0 abajo del cociente; aquí ese 0 no está abajo.');
      if (okTxt === 'No está definida') return err(t === '0' ? 'TRPN-TAN-CERO' : 'TRPN-INFINITO', claveEje(t), t, t === '0' ? 'El 0 está, pero abajo: entre 0 no se divide.' : 'Ubicar el eje está bien; pero el cociente pide dividir entre 0.');
      return t === malTxt ? err('TR15', claveEje(t), t, `Ese valor sale de girar en el otro sentido; el punto de este ángulo da ${okTxt}.`)
        : t === '0' ? err('TR11', claveEje(t), t, 'Sería 0 con el 0 arriba del cociente; aquí arriba no hay 0.')
          // Cierre (20 nov): si la razón vale 0, «el tamaño 1 está bien» era falso (el 1 sale de la otra coordenada).
          : okTxt === '0' ? err('TR11', claveEje(t), t, `${t} usaría la coordenada que no es 0; aquí el 0 queda arriba del cociente: vale 0.`)
            : err('TR12', claveEje(t), t, `El tamaño 1 está bien; el signo sale de la coordenada del punto: da ${okTxt}.`);
    });
  }
  function razonEje(rng) {
    const g = rng.elegir([0, 90, 180, 270, 360]), fn = rng.elegir(FNS), val = enEje(fn, g), ok = ejeTxt(val);
    return {
      enunciado: [TH, ` = ${g}° está en posición normal.`], pregunta: [`¿Cuánto vale ${fn} `, TH, '?'],
      datos: [D.def].concat(['cot', 'sec', 'csc'].includes(fn) ? [D.rec] : [], [D.eje, D.cero]),
      correcta: { clave: claveEje(ok), texto: ok }, errores: opcionesEje(ok, null),
      solucion: [[`${g}° cae sobre un eje. ${fn} θ = ${PARTE[fn]}, con r = a.`], [`${fn} ${g}° `, val === null ? 'no está definida' : '= ', val === null ? '' : v('pide', ok)]],
      _datos: { g, fn },
    };
  }
  function expresionEjes(rng) {
    const p = rng.entero(1, 5), q = rng.entero(1, 5), t = rng.entero(1, 4), A = rng.elegir([90, 270]), B = rng.elegir([0, 180, 360]), C = rng.elegir([0, 180, 360]);
    const sA = enEje('sen', A), cB = enEje('cos', B), ok = p * sA - q * cB;
    const k = c => (c === 1 ? '' : c + ' ');
    return {
      enunciado: ['Las tres razones son de ángulos sobre los ejes.'], pregunta: [`Calcula E = ${k(p)}sen ${A}° − ${k(q)}cos ${B}° + ${k(t)}tan ${C}°.`],
      datos: [D.def, D.eje],
      correcta: { clave: `n${ok}`, texto: f(ok) },
      errores: [
        err('TR12', `n${p * sA + q * cB}`, f(p * sA + q * cB), `Los tres valores están bien; falta el menos de E: así sale ${f(p * sA + q * cB)}.`),
        err('TR11', `n${p * enEje('cos', A) - q * enEje('sen', B)}`, f(p * enEje('cos', A) - q * enEje('sen', B)), `Reemplazar está bien, pero ${f(p * enEje('cos', A) - q * enEje('sen', B))} cambia x por y en los dos primeros.`),
        err('TRPN-TAN-UNO', `n${ok + t}`, f(ok + t), `Lo demás está bien; tan ${C}° = 0/a = 0, no 1: con 1 sale ${f(ok + t)}.`),
        err('TRPN-CERO-INDEF', 'indef', 'No está definida', `tan ${C}° tiene el 0 arriba: vale 0, y E sí tiene valor.`),
      ],
      solucion: [[`sen ${A}° = ${ejeTxt(sA)}, cos ${B}° = ${ejeTxt(cB)} y tan ${C}° = 0.`], ['E = ', v('pide', f(ok))]],
      _datos: { p, q, t, A, B, C },
    };
  }
  function multiplos(rng) {
    const T = rng.elegir([90, 180]), ks = T === 90 ? [1, 2, 3, 4] : [0.5, 1, 1.5, 2];
    const t1 = [rng.entero(1, 3), rng.elegir(['sen', 'cos']), rng.elegir(ks)], t2 = [rng.elegir([1, -1]) * rng.entero(1, 3), rng.elegir(['sen', 'cos', 'tan']), rng.elegir(ks)];
    const t3 = [rng.entero(1, 2), rng.elegir(['sec', 'csc', 'cos', 'sen']), rng.elegir(ks)], d = rng.entero(0, 3);
    if (t1[2] === t2[2] && t1[1] === t2[1]) return null;
    const val = ([c, fn, k], mult = true) => { const z = enEje(fn, mult ? T * k : T); return z === null ? null : c * z; };
    const vs = [t1, t2, t3].map(z => val(z));
    if (vs.some(z => z === null) || vs[2] + d === 0) return null;
    const ok = coc(vs[0] + vs[1], 1, vs[2] + d, 1);
    const sm = [t1, t2, t3].map(z => val(z, false)), abs = [t1, t2, t3].map(([c, fn, k]) => c * Math.abs(enEje(fn, T * k)));
    const errs = [];
    if (sm.every(z => z !== null) && sm[2] + d) { const e = coc(sm[0] + sm[1], 1, sm[2] + d, 1); errs.push(err('RN-SIN-MULTIPLO', clave(e), txt(e), `Los ejes están bien; pero cada razón lleva su múltiplo de θ: sin él sale ${txt(e)}.`)); }
    // abs[1] ya lleva el signo de la expresión (cierre, 20 nov: antes se le quitaba también el menos de E).
    if (abs[2] + d) { const e = coc(abs[0] + abs[1], 1, abs[2] + d, 1); errs.push(err('TR12', clave(e), txt(e), `Los ángulos están bien; sin los signos de los puntos sale ${txt(e)}.`)); }
    if (vs[0] + vs[1]) { const e = coc(vs[2] + d, 1, vs[0] + vs[1], 1); errs.push(err('RN-REVES', clave(e), txt(e), `Arriba y abajo están bien; ${txt(e)} los da vuelta.`)); }
    errs.push(err('TRPN-CERO-INDEF', 'indef', 'No está definida', 'Cada razón existe en su ángulo y el denominador no es 0: E sí tiene valor.'));
    const tt = ([c, fn, k], conSigno) => `${conSigno ? (c < 0 ? '− ' : '+ ') : ''}${Math.abs(c) === 1 ? '' : Math.abs(c) + ' '}${fn} ${k === 1 ? 'θ' : k === 0.5 ? '(θ/2)' : k === 1.5 ? '(3θ/2)' : k + 'θ'}`;
    return {
      enunciado: [TH, ` = ${T}°.`], pregunta: [`Calcula E = (${tt(t1)} ${tt(t2, true)})/(${tt(t3)}${d ? ' + ' + d : ''}).`],
      datos: [D.def, D.rec, D.eje],
      correcta: { clave: clave(ok), texto: txt(ok) }, errores: errs,
      solucion: [[[t1, t2, t3].map(([c, fn, k]) => `${fn} ${f(T * k)}° = ${ejeTxt(enEje(fn, T * k))}`).join('; ') + '.'], ['E = ', v('pide', txt(ok))]],
      _datos: { T, t1, t2, t3, d },
    };
  }

  // ===================== Idea 4: el giro horario va con menos =====================
  function cuadranteNegativo(rng) {
    let g = -10 * rng.entero(1, 35); while (g % 90 === 0) g -= 10;
    const q = cuad(g), qa = cuad(-g), qm = cuad(g + 180);
    return {
      enunciado: [TH, ` = ${fa(g)}° está en posición normal.`], pregunta: ['¿En qué cuadrante termina su lado final?'],
      datos: [D.neg, D.cuad, D.vuelta],
      correcta: { clave: `q${q}`, texto: `En el ${ROM[q]}` },
      errores: [1, 2, 3, 4].filter(k => k !== q).map(k => (k === qa ? err('TR15', `q${k}`, `En el ${ROM[k]}`, `Medir ${-g}° está bien; pero el signo menos pide girar en sentido horario: no termina en el ${ROM[k]}.`)
        : k === qm ? err('TRNEG-180', `q${k}`, `En el ${ROM[k]}`, `Buscar un ángulo positivo está bien; pero se suma una vuelta, 360°, no 180°.`)
          : err('TRNEG-CUENTA', `q${k}`, `En el ${ROM[k]}`, 'Girar en sentido horario está bien; cuenta los cuartos de vuelta: −90°, −180°, −270°.'))),
      solucion: [[`Horario: IV, III, II y I, un cuarto de vuelta cada uno.`], [v('pide', `Cuadrante ${ROM[q]}`)]],
      _datos: { g },
    };
  }
  function razonNegativo(rng) {
    const g = rng.elegir([-90, -180, -270, -360]), fn = rng.elegir(FNS), val = enEje(fn, g), ok = ejeTxt(val), mal = ejeTxt(enEje(fn, -g));
    return {
      enunciado: [TH, ` = ${fa(g)}° está en posición normal.`], pregunta: [`¿Cuánto vale ${fn} `, TH, '?'],
      datos: [D.def].concat(['cot', 'sec', 'csc'].includes(fn) ? [D.rec] : [], [D.neg, D.eje]),
      correcta: { clave: claveEje(ok), texto: ok }, errores: opcionesEje(ok, mal === ok ? null : mal),
      solucion: [[`${fa(g)}° gira en sentido horario y cae sobre un eje.`], [`${fn}(${fa(g)}°) `, val === null ? 'no está definida' : '= ', val === null ? '' : v('pide', ok)]],
      _datos: { g, fn },
    };
  }
  function cuentaPositivas(rng) {
    const items = [0, 1, 2, 3].map(() => { let g = -10 * rng.entero(1, 35); while (g % 90 === 0) g -= 10; return [rng.elegir(FNS), g]; });
    if (new Set(items.map(z => z[1])).size < 4) return null;
    const pos = gs => gs.filter(([fn, g]) => signoDe(fn, cuad(g)) > 0).length;
    const ok = pos(items), ab = pos(items.map(([fn, g]) => [fn, -g])), med = pos(items.map(([fn, g]) => [fn, g + 180]));
    return {
      enunciado: [`Cuatro razones de ángulos negativos: ${items.map(([fn, g]) => `${fn}(${fa(g)}°)`).join(', ')}.`], pregunta: ['¿Cuántas son positivas?'],
      datos: [D.def, D.rec, D.neg, D.cuad],
      correcta: { clave: `c${ok}`, texto: String(ok) },
      errores: [
        err('TRNEG-TODO-NEG', 'c0', '0', 'Contar las positivas está bien; pero un ángulo negativo no hace negativas sus razones: deciden x e y.'),
        err('TR15', `c${ab}`, String(ab), `Mirar cada cuadrante está bien; ${ab} sale de girar los ángulos en sentido antihorario.`),
        err('TRNEG-180', `c${med}`, String(med), `Buscar el cuadrante está bien; ${med} sale de sumar 180° en vez de 360°.`),
        err('RN-REVES', `c${4 - ok}`, String(4 - ok), `Los cuadrantes están bien; ${4 - ok} cuenta las negativas.`),
      ],
      solucion: [[items.map(([fn, g]) => `${fn}(${fa(g)}°): ${ROM[cuad(g)]}, ${sg(signoDe(fn, cuad(g)))}`).join('; ') + '.'], [v('pide', `${ok}`)]],
      _datos: { items },
    };
  }

  // ===================== Idea 5: más vueltas, mismo lado final =====================
  function coterminal(rng) {
    const g = (rng.entero(0, 1) ? 1 : -1) * 10 * rng.entero(40, 200), m = mod360(g);
    if (m === 0) return null;
    const n = (g - m) / 360;
    return {
      enunciado: ['Un giro de ', v('ang', `${fa(g)}°`), '.'], pregunta: ['¿Qué ángulo entre 0° y 360° es coterminal con él?'],
      datos: [D.cot, D.vuelta],
      correcta: { clave: `g${m}`, texto: `${m}°` },
      errores: [
        err('TR15', `g${mod360(Math.abs(g))}`, `${mod360(Math.abs(g))}°`, `Contar vueltas está bien; pero con el signo: ${mod360(Math.abs(g))}° es de ${Math.abs(g)}°.`),
        err('RN-REVES', `g${mod360(-g)}`, `${mod360(-g)}°`, `Hallar lo que sobra está bien; ${mod360(-g)}° completa la vuelta al revés.`),
        err('TRNEG-180', `g${mod360(g + 180)}`, `${mod360(g + 180)}°`, `Quitar giros enteros está bien; ${mod360(g + 180)}° quita media vuelta de más.`),
        err('RN-UNA-VUELTA', `g${m + 360}`, `${m + 360}°`, `${m + 360}° también es coterminal, pero pasa de 360°: falta una vuelta.`),
      ],
      solucion: [[`${fa(g)}° = ${m}° + 360° · (${fa(n)}).`], [v('pide', `${m}°`)]],
      _datos: { g },
    };
  }
  function cualCoterminal(rng) {
    const g = 10 * rng.entero(2, 34) * (rng.entero(0, 1) ? 1 : -1), k = rng.elegir([-3, -2, -1, 1, 2, 3]), k2 = rng.elegir([-2, -1, 1, 2]);
    if (g % 90 === 0) return null;
    const ok = g + 360 * k, cand = [
      ['TR15', -g + 360 * k2, `Sumar vueltas está bien; pero se partió de ${fa(-g)}°, con el signo cambiado.`],
      ['TRNEG-180', g + 180 + 360 * k2, `La diferencia con ${fa(g)}° es ${fa(180 + 360 * k2)}°: no es un múltiplo de 360°.`],
      ['RN-UNA-VUELTA', g + 300 * k, `Sumar giros está bien; pero ${fa(300 * k)}° no son vueltas enteras.`],
      ['RN-CUARTO', g + 90 * (2 * k2 + 1), `La diferencia con ${fa(g)}° es ${fa(90 * (2 * k2 + 1))}°: termina en otro cuadrante.`],
    ].filter(([, a]) => mod360(a - g) !== 0);
    return {
      enunciado: ['Un ángulo de ', v('ang', `${fa(g)}°`), '.'], pregunta: ['¿Cuál de estos ángulos es coterminal con él?'],
      datos: [D.cot],
      correcta: { clave: `g${ok}`, texto: `${fa(ok)}°` },
      errores: cand.map(([id, a, e]) => err(id, `g${a}`, `${fa(a)}°`, e)),
      solucion: [[`${fa(ok)}° − (${fa(g)}°) = 360° · (${fa(k)}): un número entero de vueltas.`], [v('pide', `${fa(ok)}°`)]],
      _datos: { g, k },
    };
  }
  function kVeces(rng) {
    const k = rng.elegir([3, 4, 5, 7, 9, 10]), paso = 360 / (k - 1), n = rng.entero(1, 6), b = paso * n;
    if (!Number.isInteger(b) || b >= 1000) return null;
    const lo = Math.floor((b - paso / 2) / 10) * 10, hi = Math.ceil((b + paso / 2) / 10) * 10;
    if (lo <= 0 || [0, 1, 2, 3, 4, 5, 6, 7, 8].map(m => paso * m).filter(x => x > lo && x < hi).length !== 1) return null;
    const malK = 360 / k * n;   // si no es entero, va con «≈»
    const cand = [['RN-K', malK, `Plantear con 360° · n está bien; pero ${k}β − β = ${k - 1}β, no ${k}β.`], ['RN-ALFA', k * b, `${fa(k * b)}° es α = ${k}β; piden β.`],
      ['RN-UNA-VUELTA', paso * (n - 1), `β = ${paso}° · n está bien; con n = ${n - 1} queda fuera del intervalo.`], ['RN-UNA-VUELTA', paso * (n + 1), `β = ${paso}° · n está bien; con n = ${n + 1} queda fuera del intervalo.`]]
      .filter(([, a]) => a > 0 && a !== b);
    return {
      enunciado: [v('ang', 'α'), ' y ', v('ang', 'β'), ` son coterminales, α = ${k}β, y β está entre ${lo}° y ${hi}°.`], pregunta: ['¿Cuánto mide ', v('ang', 'β'), '?'],
      datos: [D.cot],
      correcta: { clave: `g${b}`, texto: `${b}°` },
      errores: cand.map(([id, a, e]) => err(id, `g${a}`, Number.isInteger(a) ? `${fa(a)}°` : `≈ ${f(a)}°`, e)),
      solucion: [[`${k}β − β = ${k - 1}β = 360° · n, así que β = ${paso}° · n; en el intervalo, n = ${n}.`], ['β = ', v('pide', `${b}°`)]],
      _datos: { k, lo, hi },
    };
  }

  const CONSTRUIR = { 'razon-punto': razonPunto, expresion, 'coordenada-falta': coordenadaFalta, signos, 'cuadrante-signos': cuadranteSignos, 'razon-cuadrante': razonCuadrante,
    'razon-eje': razonEje, 'expresion-ejes': expresionEjes, multiplos, 'cuadrante-negativo': cuadranteNegativo, 'razon-negativo': razonNegativo, 'cuenta-positivas': cuentaPositivas,
    coterminal, 'cual-coterminal': cualCoterminal, 'k-veces': kVeces };
  const TIPOS_POR_IDEA = {
    'razones-coordenadas': ['razon-punto', 'expresion', 'coordenada-falta'],
    'signos-cuadrante': ['signos', 'cuadrante-signos', 'razon-cuadrante'],
    cuadrantales: ['razon-eje', 'expresion-ejes', 'multiplos'],
    'giro-horario': ['cuadrante-negativo', 'razon-negativo', 'cuenta-positivas'],
    'coterminales-negativos': ['coterminal', 'cual-coterminal', 'k-veces'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map((t, k) => [t, k + 1])));
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): de menos a más, las cinco ideas.
  const PAPEL = { 'papel-1': 'razon-punto', 'papel-2': 'signos', 'papel-3': 'razon-eje', 'papel-4': 'cuadrante-negativo', 'papel-5': 'coterminal',
    'papel-6': 'coordenada-falta', 'papel-7': 'razon-cuadrante', 'papel-8': 'k-veces' };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && !o.tipo && PAPEL[String(semilla)];
    const tipo = o.tipo && CONSTRUIR[o.tipo] ? o.tipo : forzado || rng.elegir(TIPOS_POR_IDEA[TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS)]);
    for (let intento = 0; intento < 500; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      if (!pr) continue;
      const errores = pr.errores.filter(e => e && e.clave !== pr.correcta.clave);
      for (let i = errores.length - 1; i > 0; i--) { const j = rng.entero(0, i); [errores[i], errores[j]] = [errores[j], errores[i]]; }
      let alternativas;
      try { alternativas = P.armarTexto({ correcta: pr.correcta, errores, rng, total: 4 }); } catch (e) { continue; }
      if (alternativas.length < 4) continue;
      const usadas = new Set();
      for (const linea of [pr.enunciado, pr.pregunta, ...pr.solucion]) for (const x of linea) if (x && typeof x === 'object' && x.v) usadas.add(x.v);
      return {
        id: `${ID}#${semilla}`, variables: Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])])),
        enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas, solucion: pr.solucion,
        respuesta: { valor: pr.correcta.clave, unidad: '' },
        _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, pr._datos),
      };
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  return { id: ID, titulo: 'Ángulos en posición normal', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
