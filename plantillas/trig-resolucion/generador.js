/*
 * Generador «Resolución de triángulos rectángulos»: la práctica de las cinco ideas de
 * trigonometria.triangulos-rectangulos (contenido/teoria/trigonometria/triangulos-rectangulos.js). Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['trig-resolucion']) y en Node (require). No usa
 * ningún motor: las cuentas son productos y cocientes de las razones de los ángulos notables, exactas (a + b√2 + c√3 + e√6).
 *
 * Propuesta: docs/etapa7/propuesta-trigonometria.md §7 (Gerson delegó el criterio). Objetos, como en la teoría: la
 * cometa, la escalera, el poste con su cable, la antena, el faro, la ventana, la torre, el cerro, el dron, la cámara del
 * poste, el letrero. Valores de problema, sin fuente.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; generar(semilla, { tipo }) uno solo; sin nada, las cinco ideas con el mismo peso.
 *   un-lado-un-angulo    cateto (1) un cateto con la hipotenusa · perimetro (2) el perímetro con la hipotenusa ·
 *                        altura-hip (3) la altura sobre la hipotenusa (a sen θ cos θ, con números)
 *   cateto-y-angulo      otro-cateto (1) el otro cateto con tan o cot · hipotenusa (2) la hipotenusa con sec o csc ·
 *                        puente (3) el suelo más el cable de un poste (San Marcos 2020-I, con números)
 *   elevacion-depresion  elevacion (1) la altura desde el suelo · ojos-depresion (2) con los ojos o desde lo alto ·
 *                        ventana (3) una depresión y una elevación desde una ventana (San Marcos 2027-I)
 *   dos-angulos          separacion (1) la distancia entre dos lugares, con la altura · altura-dos (2) la altura con lo
 *                        que hay entre los lugares, del mismo lado o de lados opuestos · movil (3) la cámara del poste
 *                        (rapidez) o el dron (altura), con d = v · t
 *   angulo-observacion   observacion (1) el ángulo con notables · largo (2) el largo con la elevación del borde bajo y el
 *                        ángulo · ventana-obs (3) desde una ventana: una depresión y una elevación que se suman
 * Lo que la teoría dejó fuera no entra: la tangente de una suma o diferencia, las identidades y los oblicuángulos.
 *
 * Notación y colores (regla de la unidad, cabecera de la teoría; docs/molde-unidad.md §5b): los ángulos en carmín (ang,
 * h), el cateto opuesto y las alturas en naranja (op, o), el adyacente y las distancias por el suelo en turquesa (ad, i);
 * la hipotenusa y lo demás en tinta. Sin violeta ni verde. Letras: θ, α, β, φ, H, h, d, v, t.
 * Datos (docs/plan-calidad.md §3, punto 13): la fórmula de cada tipo y los valores de los notables, «(convención del
 * examen)» en 37°, 53°, 16° y 74°; nunca el paso hecho ni la respuesta. Errores: TR9 (parcial) de
 * docs/investigacion/trigonometria-ideas-erroneas.md; los demás son hipótesis de aula, con los códigos de la teoría. Cada
 * explicación empieza por lo que el alumno hizo bien y dice lo que da su error.
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
  const ID = 'trig-resolucion';
  const TRF = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d);
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

  // ---- Números exactos: a + b√2 + c√3 + e√6, con coeficientes racionales ----
  const RS = [1, 2, 3, 6];
  const q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const m = gcd(n, d) || 1; return [n / m, d / m]; };
  const qs = (a, b) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), qm = (a, b) => q(a[0] * b[0], a[1] * b[1]);
  const cero = () => ({ 1: [0, 1], 2: [0, 1], 3: [0, 1], 6: [0, 1] });
  const E = (n, d = 1, r = 1) => { const x = cero(); x[r] = q(n, d); return x; };
  const suma = (a, b) => { const x = cero(); for (const r of RS) x[r] = qs(a[r], b[r]); return x; };
  const resta = (a, b) => { const x = cero(); for (const r of RS) x[r] = qs(a[r], [-b[r][0], b[r][1]]); return x; };
  const MR = { '1,1': [1, 1], '1,2': [1, 2], '1,3': [1, 3], '1,6': [1, 6], '2,2': [2, 1], '2,3': [1, 6], '2,6': [2, 3], '3,3': [3, 1], '3,6': [3, 2], '6,6': [6, 1] };
  const por = (a, b) => {
    const x = cero();
    for (const r of RS) for (const s of RS) {
      if (!a[r][0] || !b[s][0]) continue;
      const [k, t] = MR[[Math.min(r, s), Math.max(r, s)].join(',')];
      x[t] = qs(x[t], qm(qm(a[r], b[s]), [k, 1]));
    }
    return x;
  };
  const terminos = a => RS.filter(r => a[r][0]);
  const entre = (a, b) => {
    const t = terminos(b);
    if (t.length === 1) { const r = t[0], [n, d] = b[r]; return por(a, E(d, n * r, r)); }
    if (t.length === 2 && t[0] === 1) {
      const r = t[1], A = b[1], B = b[r], conj = suma(E(A[0], A[1]), E(-B[0], B[1], r)), den = qs(qm(A, A), [-r * B[0] * B[0], B[1] * B[1]]);
      return por(por(a, conj), E(den[1], den[0]));
    }
    throw new Error('entre: divisor no soportado');
  };
  const val = a => RS.reduce((s, r) => s + a[r][0] / a[r][1] * Math.sqrt(r), 0);
  const exacto = a => terminos(a).every(r => r === 1);
  function txt(a) {
    const t0 = terminos(a), pos = t0.findIndex(r => a[r][0] > 0), t = pos > 0 ? [t0[pos]].concat(t0.filter((r, i) => i !== pos)) : t0;
    if (!t.length) return '0';
    const D = t.reduce((m, r) => m * a[r][1] / gcd(m, a[r][1]), 1);
    const parte = (n, r) => `${r === 1 ? Math.abs(n) : Math.abs(n) === 1 ? '' : Math.abs(n)}${r === 1 ? '' : '√' + r}`;
    let s = '';
    t.forEach((r, i) => { const n = a[r][0] * D / a[r][1]; s += i === 0 ? (n < 0 ? '−' : '') + parte(n, r) : (n < 0 ? ' − ' : ' + ') + parte(n, r); });
    if (D === 1) return s;
    return t.length > 1 ? `(${s})/${D}` : `${s}/${D}`;
  }
  // Un largo con su unidad, exacto y, si no lo es con 3 decimales o menos, con su valor: «15√2 m ≈ 21,21 m», «49/12 m ≈
  // 4,08 m» (cierre, 19 nov: «… = 4,08 m» era un redondeo sin «≈»). En una alternativa, un racional así va «≈ 4,08 m».
  const decExacto = x => exacto(x) && Math.abs(Math.round(val(x) * 1000) - val(x) * 1000) < 1e-6;
  const largo = (x, u) => (decExacto(x) ? `${f(val(x), 3)} ${u}` : `${txt(x)} ${u} ≈ ${f(val(x))} ${u}`);
  const opcion = (x, u) => (!decExacto(x) && exacto(x) ? `≈ ${f(val(x))} ${u}` : largo(x, u));

  // ---- Los notables y sus razones ----
  const R3 = E(1, 1, 3), R2 = E(1, 1, 2);
  const NOT = {
    30: { op: E(1), ad: R3, hip: E(2) }, 45: { op: E(1), ad: E(1), hip: R2 }, 60: { op: R3, ad: E(1), hip: E(2) },
    37: { op: E(3), ad: E(4), hip: E(5) }, 53: { op: E(4), ad: E(3), hip: E(5) }, 16: { op: E(7), ad: E(24), hip: E(25) }, 74: { op: E(24), ad: E(7), hip: E(25) },
  };
  const PARTES = { sen: ['op', 'hip'], cos: ['ad', 'hip'], tan: ['op', 'ad'], cot: ['ad', 'op'], sec: ['hip', 'ad'], csc: ['hip', 'op'] };
  const rz = (r, g) => entre(NOT[g][PARTES[r][0]], NOT[g][PARTES[r][1]]);
  const CONV = g => g === 37 || g === 53 || g === 16 || g === 74;
  const valores = g => `sen ${g}° = ${txt(rz('sen', g))}, cos ${g}° = ${txt(rz('cos', g))} y tan ${g}° = ${txt(rz('tan', g))}${CONV(g) ? ' (convención del examen)' : ''}.`;
  const tanes = gs => { const ps = gs.map(g => `tan ${g}° = ${txt(rz('tan', g))}`); return `${ps.slice(0, -1).join(', ')} y ${ps[ps.length - 1]}${gs.some(CONV) ? ' (convención del examen)' : ''}.`; };

  const ANG = x => v('ang', x), OP = x => v('op', x), AD = x => v('ad', x);
  const VARS = {
    ang: { nombre: 'el ángulo', color: 'h' },
    op: { nombre: 'el cateto opuesto o la altura', color: 'o' },
    ad: { nombre: 'el cateto adyacente o la distancia por el suelo', color: 'i' },
  };

  // ---- Errores: el respaldo sale del código ----
  const resp = id => (id === 'TR9' ? { respaldo: 'parcial', fuente: TRF } : { respaldo: 'hipotesis', fuente: null });
  // Las alternativas con sus textos exactos: el valor numérico de cada una lleva su texto.
  function alternativas(correcta, errs, u, conTexto) {
    const mapa = new Map(), clave = x => x.toFixed(8);
    const t = conTexto || (x => opcion(x, u));
    mapa.set(clave(val(correcta)), t(correcta));
    const errores = [];
    for (const e of errs) {
      if (!e || !e.ex) continue;
      const x = val(e.ex);
      if (!(x > 0) || mapa.has(clave(x))) continue;
      const texto = t(e.ex);
      mapa.set(clave(x), texto);
      errores.push(Object.assign({ id: e.id, valor: x, explicacion: e.explicar(texto) }, resp(e.id)));
    }
    return { correcta: val(correcta), errores, fmt: x => mapa.get(clave(x)) || `${f(x)} ${u}` };
  }
  const grados = x => `${txt(x)}°`;

  // ---- Datos (una línea cada uno; herramientas, no el paso hecho) ----
  const D = {
    rz: 'sen θ = CO/H, cos θ = CA/H y tan θ = CO/CA.',
    rzr: 'cot θ = CA/CO, sec θ = H/CA y csc θ = H/CO.',
    hip: 'Con la hipotenusa: CO = H · sen θ y CA = H · cos θ, con los catetos nombrados desde θ.',
    cat: 'Lado buscado = lado conocido · la razón de θ con el buscado arriba y el conocido abajo.',
    perim: 'Perímetro: la suma de los tres lados.',
    alturaH: 'La altura sobre la hipotenusa forma ángulo recto con ella; los ángulos agudos de un triángulo rectángulo suman 90°.',
    elev: 'Lo que sube o baja la visual = d · tan θ, con θ medido desde la horizontal del ojo.',
    ojo: 'Si la visual sale de los ojos o de un instrumento, su altura sobre el suelo se suma.',
    alt: 'Entre dos horizontales, la visual forma ángulos alternos internos: miden lo mismo.',
    dos: 'Con la misma altura h: d₁ = h · cot α y d₂ = h · cot β.',
    lados: 'Del mismo lado del pie, entre los lugares hay d₁ − d₂; de lados opuestos, d₁ + d₂.',
    vt: 'd = v · t: distancia = rapidez · tiempo, si la rapidez no cambia.',
    obs: 'Ángulo de observación: φ = β − α, con tan α = h₁/d y tan β = h₂/d (alturas sobre los ojos).',
    abajo: 'Si un borde está bajo los ojos, su visual baja: es una depresión, y los dos ángulos se suman.',
  };

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    'un-lado-un-angulo': ['cateto', 'perimetro', 'altura-hip'],
    'cateto-y-angulo': ['otro-cateto', 'hipotenusa', 'puente'],
    'elevacion-depresion': ['elevacion', 'ojos-depresion', 'ventana'],
    'dos-angulos': ['separacion', 'altura-dos', 'movil'],
    'angulo-observacion': ['observacion', 'largo', 'ventana-obs'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { cateto: 1, perimetro: 2, 'altura-hip': 3, 'otro-cateto': 1, hipotenusa: 2, puente: 3, elevacion: 1, 'ojos-depresion': 2, ventana: 3,
    separacion: 1, 'altura-dos': 2, movil: 3, observacion: 1, largo: 2, 'ventana-obs': 3 };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): de menos a más, las cinco ideas.
  const PAPEL = { 'papel-1': ['cateto'], 'papel-2': ['hipotenusa'], 'papel-3': ['ojos-depresion'], 'papel-4': ['separacion'], 'papel-5': ['observacion'],
    'papel-6': ['puente'], 'papel-7': ['ventana'], 'papel-8': ['movil'] };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && !o.tipo && PAPEL[String(semilla)];
    let tipo;
    if (o.tipo && CONSTRUIR[o.tipo]) tipo = o.tipo;
    else if (forzado) tipo = forzado[0];
    else tipo = rng.elegir(TIPOS_POR_IDEA[TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS)]);
    for (let intento = 0; intento < 500; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      const p = pr && cerrar(rng, semilla, tipo, pr);
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  function cerrar(rng, semilla, tipo, o) {
    const errores = o.errores.filter(x => x && Number.isFinite(x.valor) && x.valor > 0 && Math.abs(x.valor - o.correcta) > 1e-9 * Math.max(1, o.correcta) && P.enEscala(x.valor, o.correcta, x.id));
    // El orden de los errores se baraja: así no salen siempre los mismos cuatro (y la correcta no queda en un extremo).
    for (let i = errores.length - 1; i > 0; i--) { const j = rng.entero(0, i); [errores[i], errores[j]] = [errores[j], errores[i]]; }
    const alts = P.armar({ correcta: o.correcta, errores, rng, texto: o.fmt });
    if (alts.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const variables = Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])]));
    return {
      id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas: alts, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }
  const nombre = r => ({ sen: 'seno', cos: 'coseno', tan: 'tangente', cot: 'cotangente', sec: 'secante', csc: 'cosecante' }[r]);

  // ======================= Idea 1: la hipotenusa y un ángulo =======================
  function cateto(rng) {
    const obj = rng.elegir(['cometa', 'escalera', 'triangulo']);
    const g = rng.elegir(obj === 'escalera' ? [53, 60, 74] : [30, 37, 53, 60, 16, 74]), pide = rng.elegir(['op', 'ad']);
    const H = rng.elegir(g === 16 || g === 74 ? [25, 50] : CONV(g) ? [5, 10, 15, 20] : [4, 6, 8, 12]);
    const u = obj === 'triangulo' ? 'cm' : 'm', r = pide === 'op' ? 'sen' : 'cos', otra = pide === 'op' ? 'cos' : 'sen';
    const ok = por(E(H), rz(r, g));
    const lado = pide === 'op' ? 'opuesto' : 'adyacente';
    const enun = obj === 'cometa' ? [`La pita de una cometa mide ${H} m, está tensa y forma `, ANG(`${g}°`), ' con el suelo.']
      : obj === 'escalera' ? [`Una escalera de ${H} m está apoyada en una pared y forma `, ANG(`${g}°`), ' con el piso.']
        : [`La hipotenusa de un triángulo rectángulo mide ${H} cm y uno de sus ángulos agudos, `, ANG(`${g}°`), '.'];
    const preg = obj === 'cometa' ? [pide === 'op' ? '¿A qué altura vuela la cometa?' : '¿A qué distancia de la estaca, por el suelo, está el punto justo debajo de la cometa?']
      : obj === 'escalera' ? [pide === 'op' ? '¿A qué altura de la pared llega su punta?' : '¿A qué distancia de la pared está su pie?']
        : [`¿Cuánto mide el cateto ${lado} a ${g}°?`];
    const A = alternativas(ok, [
      { id: 'TR9', ex: por(E(H), rz(otra, g)), explicar: x => `Bien que multipliques la hipotenusa por una razón. Pero el ${lado} va con el ${nombre(r)}; con el ${nombre(otra)} sale ${x}.` },
      { id: 'RES-DIVIDE', ex: entre(E(H), rz(r, g)), explicar: x => `Bien el ${nombre(r)}. Pero un cateto es menor que la hipotenusa: dividir da ${x}.` },
      { id: 'RES-IGUAL', ex: E(H), explicar: x => `Bien que partas de la hipotenusa. Pero ${x} es ella misma: falta multiplicarla por la razón.` },
      { id: 'RES-COMPLEMENTO', ex: por(E(H), rz(r, 90 - g)), explicar: x => `Bien la idea de multiplicar. Pero nombras los lados desde ${90 - g}°, el otro agudo: sale ${x}.` },
    ], u);
    return {
      enunciado: enun, pregunta: preg, datos: [D.hip, valores(g)], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [[`Desde ${g}°, el lado pedido es el ${lado}: la hipotenusa por el ${nombre(r)}.`], [pide === 'op' ? OP('CO') : AD('CA'), ` = ${H} · ${r} ${g}° = ${H} · ${txt(rz(r, g))} = `, pide === 'op' ? OP(largo(ok, u)) : AD(largo(ok, u)), '.']],
      _datos: { obj, g, H, pide },
    };
  }
  function perimetro(rng) {
    const g = rng.elegir([30, 37, 45, 53, 60, 16]), H = rng.elegir(g === 16 ? [25, 50] : CONV(g) ? [10, 20, 30, 40] : [6, 10, 14, 18]);
    const co = por(E(H), rz('sen', g)), ca = por(E(H), rz('cos', g)), Pm = suma(E(H), suma(co, ca));
    const A = alternativas(Pm, [
      { id: 'RES-SIN-H', ex: suma(co, ca), explicar: x => `Bien los dos catetos. Pero el perímetro también lleva la hipotenusa: sin ella sale ${x}.` },
      { id: 'RES-UN-SENO', ex: suma(E(H), suma(co, co)), explicar: x => `Bien el opuesto con el seno. Pero el adyacente va con el coseno: así sale ${x}.` },
      { id: 'RES-DIVIDE', ex: suma(E(H), suma(entre(E(H), rz('sen', g)), entre(E(H), rz('cos', g)))), explicar: x => `Bien seno y coseno. Pero los catetos se multiplican por ellos: dividir da ${x}.` },
    ], 'cm');
    return {
      enunciado: [`La hipotenusa de una escuadra (un triángulo rectángulo) mide ${H} cm y uno de sus ángulos, `, ANG(`${g}°`), '.'],
      pregunta: ['¿Cuánto mide su perímetro?'], datos: [D.hip, valores(g), D.perim], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [['Cada cateto es la hipotenusa por su razón: ', OP(txt(co)), ' y ', AD(txt(ca)), '.'], [`${H} + ${txt(co)} + ${txt(ca)} = ${largo(Pm, 'cm')}.`]],
      _datos: { g, H },
    };
  }
  function alturaHip(rng) {
    const g = rng.elegir([30, 60, 37, 53]), a = rng.elegir(CONV(g) ? [25, 50, 75] : [8, 12, 16, 20]);
    const ok = por(por(E(a), rz('sen', g)), rz('cos', g));
    const A = alternativas(ok, [
      { id: 'RES-UN-PASO', ex: por(E(a), rz('sen', g)), explicar: x => `Bien el primer paso: ${x} es un cateto. Falta el triángulo chico, donde la altura es otro cateto.` },
      { id: 'RES-UN-PASO', ex: por(E(a), rz('cos', g)), explicar: x => `Bien el primer paso: ${x} es el otro cateto. Falta multiplicarlo por el seno en el triángulo chico.` },
      { id: 'RES-OTRO-PEDAZO', ex: por(por(E(a), rz('sen', g)), rz('sen', g)), explicar: x => `Bien que uses dos triángulos. Pero ${x} es un pedazo de la hipotenusa, no la altura.` },
      { id: 'RES-OTRO-PEDAZO', ex: por(por(E(a), rz('cos', g)), rz('cos', g)), explicar: x => `Bien que uses dos triángulos. Pero ${x} es el otro pedazo de la hipotenusa.` },
    ], 'cm');
    return {
      enunciado: [`En un triángulo rectángulo, la hipotenusa mide ${a} cm y uno de sus ángulos agudos mide `, ANG(`${g}°`), '.'],
      pregunta: ['¿Cuánto mide la altura trazada desde el ángulo recto hasta la hipotenusa?'], datos: [D.hip, valores(g), D.alturaH], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [[`El cateto adyacente a ${g}° mide ${a} · cos ${g}° = `, AD(txt(por(E(a), rz('cos', g)))), '.'], [`En el triángulo chico, con el mismo ${g}°, la altura es su opuesto: ${txt(por(E(a), rz('cos', g)))} · sen ${g}° = ${largo(ok, 'cm')}.`]],
      _datos: { g, a },
    };
  }

  // ======================= Idea 2: un cateto y un ángulo =======================
  function otroCateto(rng) {
    const g = rng.elegir([30, 37, 53, 60, 16, 74]), tiene = rng.elegir(['op', 'ad']), k = rng.elegir(g === 16 || g === 74 ? [7, 14, 24] : CONV(g) ? [6, 9, 12] : [4, 6, 10]);
    const obj = rng.elegir(['antena', 'sombra']);
    const r = tiene === 'op' ? 'cot' : 'tan', inv = tiene === 'op' ? 'tan' : 'cot', hip = tiene === 'op' ? 'csc' : 'sec';
    const ok = por(E(k), rz(r, g));
    const enun = obj === 'antena'
      ? (tiene === 'op' ? [`Una antena de ${k} m tiene un cable tensor que forma `, ANG(`${g}°`), ' con el suelo.'] : ['La estaca del cable tensor de una antena está a ', AD(`${k} m`), ' de su pie, y el cable forma ', ANG(`${g}°`), ' con el suelo.'])
      : (tiene === 'op' ? [`Un poste de ${k} m da su sombra cuando el sol está a `, ANG(`${g}°`), ' sobre el horizonte.'] : ['La sombra de un poste mide ', AD(`${k} m`), ' cuando el sol está a ', ANG(`${g}°`), ' sobre el horizonte.']);
    const preg = obj === 'antena' ? [tiene === 'op' ? '¿A qué distancia del pie de la antena está la estaca?' : '¿Cuánto mide la antena?'] : [tiene === 'op' ? '¿Cuánto mide la sombra?' : '¿Cuánto mide el poste?'];
    const A = alternativas(ok, [
      { id: 'REC-INVERSA', ex: por(E(k), rz(inv, g)), explicar: x => `Bien la razón entre los dos catetos. Pero el buscado va arriba: con la ${nombre(inv)} sale ${x}.` },
      { id: 'RES-HIP', ex: por(E(k), rz(hip, g)), explicar: x => `Bien que multipliques por una razón. Pero la ${nombre(hip)} da la hipotenusa, ${x}.` },
      { id: 'TR9', ex: por(E(k), rz(tiene === 'op' ? 'cos' : 'sen', g)), explicar: x => `Bien que multipliques el dato. Pero esa razón no une los dos catetos: da ${x}.` },
    ], 'm');
    return {
      enunciado: enun, pregunta: preg, datos: [D.cat, D.rzr, valores(g)], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [[`El buscado entre el conocido, desde ${g}°: la ${nombre(r)}.`], [tiene === 'op' ? AD('d') : OP('h'), ` = ${k} · ${txt(rz(r, g))} = `, tiene === 'op' ? AD(largo(ok, 'm')) : OP(largo(ok, 'm')), '.']],
      _datos: { obj, g, k, tiene },
    };
  }
  function hipotenusa(rng) {
    const obj = rng.elegir(['cable', 'escalera']), g = rng.elegir(obj === 'escalera' ? [53, 60] : [30, 37, 53, 60]);
    const k = obj === 'escalera' ? rng.elegir(CONV(g) ? [1.2, 1.5, 1.8] : [1, 1.5, 2]) : rng.elegir(CONV(g) ? [6, 9, 12] : [5, 6, 8]);
    const tiene = obj === 'cable' ? 'op' : 'ad', r = tiene === 'op' ? 'csc' : 'sec', mal = tiene === 'op' ? 'sen' : 'cos', otra = tiene === 'op' ? 'sec' : 'csc';
    const K = E(Math.round(k * 10), 10), ok = por(K, rz(r, g));
    const A = alternativas(ok, [
      { id: 'RES-MULTIPLICA', ex: por(K, rz(mal, g)), explicar: x => `Bien que uses el ${nombre(mal)}. Pero así la hipotenusa, ${x}, sale menor que el cateto: va la recíproca.` },
      { id: 'TR9', ex: por(K, rz(otra, g)), explicar: x => `Bien la hipotenusa arriba. Pero abajo va el cateto que conoces: con la ${nombre(otra)} sale ${x}.` },
      { id: 'RES-HIP', ex: por(K, rz(tiene === 'op' ? 'cot' : 'tan', g)), explicar: x => `Bien que multipliques. Pero esa razón da el otro cateto, ${x}, no la hipotenusa.` },
      { id: 'RES-SUMA-CATETOS', ex: suma(K, por(K, rz(tiene === 'op' ? 'cot' : 'tan', g))), explicar: x => `Bien el otro cateto. Pero la hipotenusa no es la suma de los catetos, ${x}: va la ${nombre(r)}.` },
    ], 'm');
    return {
      enunciado: obj === 'cable' ? [`Un poste de ${f(k)} m se sujeta con un cable que va de su punta a una estaca y forma `, ANG(`${g}°`), ' con el suelo.']
        : ['El pie de una escalera está a ', AD(`${f(k)} m`), ' de la pared y la escalera forma ', ANG(`${g}°`), ' con el piso.'],
      pregunta: [obj === 'cable' ? '¿Cuánto mide el cable?' : '¿Cuánto mide la escalera?'], datos: [D.cat, D.rzr, valores(g)], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [[`La hipotenusa sobre el cateto conocido: la ${nombre(r)} de ${g}°.`], [`H = ${f(k)} · ${txt(rz(r, g))} = ${largo(ok, 'm')}.`]],
      _datos: { obj, g, k },
    };
  }
  function puente(rng) {
    const g = rng.elegir([30, 37, 53, 60, 45]), h = rng.elegir(CONV(g) ? [6, 12, 24] : [3, 6, 9]);
    const bp = por(E(h), rz('cot', g)), pt = por(E(h), rz('csc', g)), ok = suma(bp, pt);
    const A = alternativas(ok, [
      { id: 'RES-COMPLEMENTO', ex: suma(por(E(h), rz('tan', g)), por(E(h), rz('sec', g))), explicar: x => `Bien cotangente y cosecante como idea. Pero esas razones miran desde la punta del poste: sale ${x}.` },
      { id: 'REC-INVERSA', ex: suma(por(E(h), rz('tan', g)), por(E(h), rz('sen', g))), explicar: x => `Bien los lados. Pero el poste, que conoces, va abajo: con las razones al revés sale ${x}.` },
      { id: 'RES-MULTIPLICA', ex: suma(bp, por(E(h), rz('sen', g))), explicar: x => `Bien el suelo, ${txt(bp)}. Pero el cable es mayor que el poste: va la cosecante, no el seno. Sale ${x}.` },
      { id: 'RES-SIN-H', ex: pt, explicar: x => `Bien el cable, ${x}. Falta sumarle el suelo hasta la estaca.` },
    ], 'm');
    return {
      enunciado: [`Un cable va de la punta de un poste de ${h} m a una estaca en el suelo y forma `, ANG(`${g}°`), ' con el suelo.'],
      pregunta: ['¿Cuánto suman el largo del cable y la distancia de la estaca al pie del poste?'], datos: [D.cat, D.rzr, valores(g)], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [['El suelo, con la cotangente: ', AD(txt(bp)), '. El cable, con la cosecante: ', txt(pt), '.'], [`${txt(bp)} + ${txt(pt)} = ${largo(ok, 'm')}.`]],
      _datos: { g, h },
    };
  }

  // ======================= Idea 3: elevación y depresión =======================
  function elevacion(rng) {
    const obj = rng.elegir(['torre', 'edificio', 'árbol']), g = rng.elegir([30, 37, 53, 60, 16]), dv = rng.elegir(g === 16 ? [24, 48] : CONV(g) ? [8, 12, 20] : [6, 10, 15]);
    const ok = por(E(dv), rz('tan', g));
    const A = alternativas(ok, [
      { id: 'DEP-VERTICAL', ex: por(E(dv), rz('cot', g)), explicar: x => `Bien la distancia por una razón. Pero ${g}° se mide desde la horizontal: con la cotangente sale ${x}.` },
      { id: 'TR9', ex: por(E(dv), rz('sen', g)), explicar: x => `Bien que partas de la distancia. Pero el seno no une la distancia con la altura: da ${x}.` },
      { id: 'RES-IGUAL', ex: E(dv), explicar: x => `Bien la distancia. Pero solo a 45° la altura mide lo mismo, ${x}.` },
    ], 'm');
    const que = { torre: 'la punta de una torre', edificio: 'la azotea de un edificio', 'árbol': 'la copa de un árbol' }[obj];
    return {
      enunciado: ['Desde un punto del suelo, a ', AD(`${dv} m`), ` del pie, ${que} se ve con `, ANG(`${g}°`), ' de elevación.'],
      pregunta: ['¿Cuánto mide de alto?'], datos: [D.elev, valores(g)], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [['La altura es el opuesto a la elevación; la distancia, el adyacente: la tangente.'], [OP('h'), ` = ${dv} · ${txt(rz('tan', g))} = `, OP(largo(ok, 'm')), '.']],
      _datos: { obj, g, dv },
    };
  }
  function ojosDepresion(rng) {
    if (rng.entero(0, 1)) {
      const g = rng.elegir([30, 37, 45, 53, 60]), dv = rng.elegir(CONV(g) ? [8, 12, 16] : [6, 10, 12]), ojo = rng.elegir([1.5, 1.2]);
      const sobre = por(E(dv), rz('tan', g)), O = E(Math.round(ojo * 10), 10), ok = suma(sobre, O);
      const tx = x => (decExacto(x) ? `${f(val(x), 3)} m` : `${txt(resta(x, O))} + ${f(ojo)} m ≈ ${f(val(x))} m`);   // «32/3 + 1,5 m ≈ 12,17 m», no «12,17 m»
      const A = alternativas(ok, [
        { id: 'ELEV-OJO', ex: sobre, explicar: x => `Bien el tramo sobre los ojos, ${x}. Falta sumar los ${f(ojo)} m de abajo.` },
        { id: 'DEP-VERTICAL', ex: suma(por(E(dv), rz('cot', g)), O), explicar: x => `Bien que sumes ${f(ojo)} m. Pero ${g}° se mide desde la horizontal: va la tangente; así sale ${x}.` },
        { id: 'TR9', ex: suma(por(E(dv), rz('sen', g)), O), explicar: x => `Bien que sumes ${f(ojo)} m. Pero el seno no une la distancia con la altura: sale ${x}.` },
        { id: 'RES-IGUAL', ex: suma(E(dv), O), explicar: x => `Bien que sumes ${f(ojo)} m. Pero solo a 45° el tramo de arriba mide lo que la distancia: así sale ${x}.` },
      ], 'm', x => (decExacto(x) ? `${f(val(x), 3)} m` : exacto(x) ? `≈ ${f(val(x))} m` : (terminos(resta(x, O)).length === 1 ? tx(x) : largo(x, 'm'))));
      return {
        enunciado: [`Una persona, con los ojos a ${f(ojo)} m del suelo, está a `, AD(`${dv} m`), ' de un edificio y ve su azotea con ', ANG(`${g}°`), ' de elevación.'],
        pregunta: ['¿Cuánto mide el edificio?'], datos: [D.elev, D.ojo, valores(g)], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
        solucion: [['La tangente da el tramo sobre los ojos: ', OP(txt(sobre)), ` m. Se suman los ${f(ojo)} m de abajo.`], [OP('h'), ' = ', OP(A.fmt(val(ok))), '.']],
        _datos: { sub: 'ojos', g, dv, ojo },
      };
    }
    const g = rng.elegir([30, 37, 53, 60, 16, 74]), h = rng.elegir(g === 16 || g === 74 ? [7, 14, 21] : CONV(g) ? [12, 24, 36] : [10, 20, 30]), obj = rng.elegir(['faro', 'acantilado']);
    const ok = por(E(h), rz('cot', g));
    const A = alternativas(ok, [
      { id: 'DEP-VERTICAL', ex: por(E(h), rz('tan', g)), explicar: x => `Bien la altura por una razón. Pero así mides ${g}° desde la pared vertical: sale ${x}.` },
      { id: 'TR9', ex: por(E(h), rz('csc', g)), explicar: x => `Bien que partas de la altura. Pero ${x} es el largo de la visual, no la distancia por el suelo.` },
      { id: 'RES-IGUAL', ex: E(h), explicar: x => `Bien la altura. Pero solo a 45° la distancia mide lo mismo, ${x}.` },
    ], 'm');
    return {
      enunciado: [`Desde lo alto de ${obj === 'faro' ? 'un faro' : 'un acantilado'} de `, OP(`${h} m`), ` se ve ${obj === 'faro' ? 'una lancha' : 'un barco'} con `, ANG(`${g}°`), ' de depresión.'],
      pregunta: ['¿A qué distancia del pie está?'], datos: [D.elev, D.alt, D.rzr, valores(g)], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [[`La elevación desde abajo también es ${g}°: la altura es el opuesto y el suelo, el adyacente.`], [AD('d'), ` = ${h} · ${txt(rz('cot', g))} = `, AD(largo(ok, 'm')), '.']],
      _datos: { sub: 'depresion', g, h, obj },
    };
  }
  function ventana(rng) {
    const gb = rng.elegir([30, 37, 45, 53]), h0 = rng.elegir(gb === 37 ? [6, 9, 12] : gb === 53 ? [8, 12, 16] : [6, 8, 10]), ga = rng.elegir([30, 37, 45, 53, 60].filter(x => x !== gb));
    const dist = por(E(h0), rz('cot', gb)), arriba = por(dist, rz('tan', ga)), ok = suma(E(h0), arriba);
    const A = alternativas(ok, [
      { id: 'DEP-RESTA', ex: resta(arriba, E(h0)), explicar: x => `Bien los dos tramos. Pero se suman, porque el edificio tiene los dos; restar da ${x}.` },
      { id: 'ELEV-OJO', ex: arriba, explicar: x => `Bien el tramo sobre la ventana, ${x}. Falta sumarle los ${h0} m de abajo.` },
      { id: 'DEP-VERTICAL', ex: suma(E(h0), por(por(E(h0), rz('tan', gb)), rz('tan', ga))), explicar: x => `Bien que sumes. Pero la distancia sale con la cotangente de ${gb}°, desde la horizontal; así da ${x}.` },
      { id: 'TR9', ex: suma(E(h0), por(dist, entre(E(1), rz('cos', ga)))), explicar: x => `Bien la distancia y la suma. Pero arriba se tomó la visual, no la altura: así sale ${x}.` },
    ], 'm');
    return {
      enunciado: [`Desde una ventana a ${h0} m del suelo se ve la base de un edificio de enfrente con `, ANG(`${gb}°`), ' de depresión y su azotea con ', ANG(`${ga}°`), ' de elevación.'],
      pregunta: ['¿Cuánto mide ese edificio?'], datos: [D.elev, D.alt, valores(gb), valores(ga)], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [['Con la depresión, la distancia entre los edificios: ', AD(`${h0} · cot ${gb}° = ${txt(dist)}`), '.'], [`Arriba: ${txt(dist)} · tan ${ga}° = ${txt(arriba)}. Con lo de abajo: `, OP(largo(ok, 'm')), '.']],
      _datos: { h0, gb, ga },
    };
  }

  // ======================= Idea 4: dos ángulos hacia la misma punta =======================
  const PARES = [[37, 45], [45, 53], [37, 53], [30, 60], [30, 45], [45, 60], [16, 37]];
  const cotDif = (a, b) => resta(rz('cot', a), rz('cot', b)), cotSum = (a, b) => suma(rz('cot', a), rz('cot', b));
  function separacion(rng) {
    const [ga, gb] = rng.elegir(PARES), h = rng.elegir(ga === 16 ? [21, 42] : ga === 30 ? [6, 9, 12] : [12, 24, 36]), op = rng.entero(0, 1) === 1;
    const d1 = por(E(h), rz('cot', ga)), d2 = por(E(h), rz('cot', gb)), ok = op ? suma(d1, d2) : resta(d1, d2);
    const A = alternativas(ok, [
      { id: op ? 'DOS-RESTA' : 'DOS-SUMA', ex: op ? resta(d1, d2) : suma(d1, d2), explicar: x => `Bien las dos distancias al pie. Pero ${op ? 'a lados opuestos se suman' : 'del mismo lado se restan'}; así sale ${x}.` },
      { id: 'DOS-SOLO', ex: d1, explicar: x => `Bien la distancia del lugar ${op ? 'de un lado' : 'lejano'}, ${x}. Falta la otra.` },
      { id: 'DOS-TAN', ex: op ? suma(por(E(h), rz('tan', ga)), por(E(h), rz('tan', gb))) : resta(por(E(h), rz('tan', gb)), por(E(h), rz('tan', ga))), explicar: x => `Bien la idea. Pero las distancias al pie salen con la cotangente, no con la tangente: da ${x}.` },
      { id: 'TR9', ex: por(E(h), rz('csc', ga)), explicar: x => `Bien que partas de la altura. Pero ${x} es el largo de una visual, no una distancia por el suelo.` },
    ], 'm');
    return {
      // Desde puntos del suelo: si miraran personas, su altura de ojos se sumaría (idea 3; cierre, 19 nov).
      enunciado: op ? [`Desde dos puntos del suelo, a lados opuestos de una torre de `, OP(`${h} m`), ', su punta se ve con ', ANG(`${ga}°`), ' y con ', ANG(`${gb}°`), ' de elevación.']
        : ['La punta de una torre de ', OP(`${h} m`), ' se ve desde un punto del suelo con ', ANG(`${ga}°`), ' y, desde otro más cerca, del mismo lado, con ', ANG(`${gb}°`), '.'],
      pregunta: ['¿Qué distancia hay entre los dos puntos de observación?'], datos: [D.dos, D.lados, D.rzr, valores(ga), valores(gb)], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [['Las distancias al pie: ', AD(txt(d1)), ' y ', AD(txt(d2)), '.'], [`${op ? 'Se suman' : 'Se restan'}: `, AD(largo(ok, 'm')), '.']],
      _datos: { ga, gb, h, op },
    };
  }
  function alturaDos(rng) {
    const op = rng.entero(0, 1) === 1;
    const lista = op ? [[37, 53, [25, 50]], [30, 60, [16, 24]], [45, 45, [10, 16]], [37, 45, [7, 14]], [45, 53, [7, 14]]] : [[37, 45, [5, 10]], [45, 53, [3, 6]], [37, 53, [7, 14]], [30, 60, [20, 40]], [30, 45, [10, 20]], [16, 37, [44, 88]]];
    const [ga, gb, ms] = rng.elegir(lista), m = rng.elegir(ms);
    const den = op ? cotSum(ga, gb) : cotDif(ga, gb), ok = entre(E(m), den);
    const A = alternativas(ok, [
      { id: 'DOS-UN-TRIANGULO', ex: por(E(m), rz('tan', gb)), explicar: x => `Bien la tangente de ${gb}°. Pero ${m} m no es una distancia al pie: así sale ${x}.` },
      { id: op ? 'DOS-RESTA' : 'DOS-SUMA', ex: ga === gb ? null : entre(E(m), op ? cotDif(ga, gb) : cotSum(ga, gb)), explicar: x => `Bien las cotangentes. Pero ${op ? 'a lados opuestos se suman' : 'del mismo lado se restan'}; así sale ${x}.` },
      { id: 'DOS-MULTIPLICA', ex: por(E(m), den), explicar: x => `Bien las cotangentes. Pero la altura por ellas da los ${m} m: hay que dividir, no multiplicar (${x}).` },
      { id: 'DOS-TAN', ex: entre(E(m), op ? suma(rz('tan', ga), rz('tan', gb)) : resta(rz('tan', gb), rz('tan', ga))), explicar: x => `Bien que dividas. Pero las distancias al pie salen con la cotangente, no con la tangente: da ${x}.` },
      { id: 'RES-IGUAL', ex: E(m), explicar: x => `Bien que partas de ${x}. Pero esa es la distancia entre los lugares, no la altura.` },
    ], 'm');
    return {
      enunciado: op ? ['Desde dos puntos del suelo, a lados opuestos de un poste y separados ', AD(`${m} m`), ', su punta se ve con ', ANG(`${ga}°`), ' y con ', ANG(`${gb}°`), ' de elevación.']
        : ['Desde un punto del suelo, la punta de una torre se ve con ', ANG(`${ga}°`), ' de elevación. Avanzas ', AD(`${m} m`), ' hacia ella y la ves con ', ANG(`${gb}°`), '.'],
      pregunta: [op ? '¿Cuánto mide el poste?' : '¿Cuánto mide la torre?'], datos: [D.dos, D.lados, D.rzr, valores(ga)].concat(ga === gb ? [] : [valores(gb)]), correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [[`Las dos distancias al pie, con la misma altura, ${op ? 'se suman' : 'se restan'}: h · (${txt(den)}) = ${m}.`], [OP('h'), ` = ${m} ÷ (${txt(den)}) = `, OP(largo(ok, 'm')), '.']],
      _datos: { ga, gb, m, op },
    };
  }
  function movil(rng) {
    if (rng.entero(0, 1)) {
      const [ga, gb] = rng.elegir([[37, 53], [45, 53], [37, 45], [30, 60]]), h = rng.elegir(ga === 30 ? [6, 9] : [12, 24]), t = rng.elegir([2, 3, 4]);
      const d1 = por(E(h), rz('cot', ga)), d2 = por(E(h), rz('cot', gb)), m = resta(d1, d2), ok = entre(m, E(t));
      const A = alternativas(ok, [
        { id: 'DOS-SIN-T', ex: m, explicar: x => `Bien lo que recorrió, ${x.replace(' m/s', ' m')}. Falta dividir entre los ${t} s.` },
        { id: 'DOS-SUMA', ex: entre(suma(d1, d2), E(t)), explicar: x => `Bien que dividas entre el tiempo. Pero del mismo lado las distancias se restan; sumar da ${x}.` },
        { id: 'DOS-SOLO', ex: entre(d1, E(t)), explicar: x => `Bien que dividas entre el tiempo. Pero el auto no llegó al poste: ${x} usa una sola distancia.` },
        { id: 'DOS-INVIERTE', ex: entre(E(t), m), explicar: x => `Bien la distancia y el tiempo. Pero la rapidez es distancia entre tiempo; al revés sale ${x}.` },
      ], 'm/s');
      return {
        enunciado: ['Una cámara en lo alto de un poste de ', OP(`${h} m`), ' ve un auto que se acerca con ', ANG(`${ga}°`), ` de depresión y, ${t} s después, con `, ANG(`${gb}°`), '.'],
        pregunta: ['¿Qué rapidez lleva el auto?'], datos: [D.dos, D.vt, D.rzr, valores(ga), valores(gb)], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
        solucion: [['Las distancias al pie: ', AD(txt(d1)), ' y ', AD(txt(d2)), `; recorrió ${txt(m)} m.`], [`v = ${txt(m)} ÷ ${t} = ${largo(ok, 'm/s')}.`]],
        _datos: { sub: 'camara', ga, gb, h, t },
      };
    }
    const [ga, gb] = rng.elegir([[37, 53], [37, 45], [45, 53], [30, 60]]), vv = rng.elegir([4, 5, 6, 8]), t = rng.elegir(ga === 37 && gb === 53 ? [7] : [3, 4, 5]);
    const m = vv * t, ok = entre(E(m), cotDif(ga, gb));
    if (val(ok) < 10 || val(ok) > 120) return null;   // un dron vuela entre unos 10 m y 120 m de alto
    const A = alternativas(ok, [
      { id: 'DOS-SUMA', ex: entre(E(m), cotSum(ga, gb)), explicar: x => `Bien lo avanzado, ${m} m. Pero del mismo lado las distancias se restan; sumar da ${x}.` },
      { id: 'DOS-UN-TRIANGULO', ex: por(E(m), rz('tan', gb)), explicar: x => `Bien lo avanzado. Pero ${m} m no es la distancia al punto: así sale ${x}.` },
      { id: 'DOS-SIN-T', ex: entre(E(vv), cotDif(ga, gb)), explicar: x => `Bien la resta de cotangentes. Pero en ${t} s avanza ${m} m, no ${vv} m: así sale ${x}.` },
      { id: 'DOS-TAN', ex: entre(E(m), resta(rz('tan', gb), rz('tan', ga))), explicar: x => `Bien que dividas lo avanzado. Pero las distancias salen con la cotangente: con tangentes da ${x}.` },
      { id: 'RES-IGUAL', ex: E(m), explicar: x => `Bien lo avanzado, ${x}. Pero eso no es la altura.` },
    ], 'm');
    return {
      enunciado: [`Un dron vuela recto y horizontal, a ${vv} m/s, hacia un punto P del suelo. Lo ve con `, ANG(`${ga}°`), ` de depresión y, ${t} s después, con `, ANG(`${gb}°`), '.'],
      pregunta: ['¿A qué altura vuela?'], datos: [D.dos, D.vt, D.rzr, valores(ga), valores(gb)], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [[`En ${t} s avanza ${vv} · ${t} = `, AD(`${m} m`), ': la resta de las dos distancias a P.'], [OP('h'), ` = ${m} ÷ (${txt(cotDif(ga, gb))}) = `, OP(largo(ok, 'm')), '.']],
      _datos: { sub: 'dron', ga, gb, vv, t },
    };
  }

  // ======================= Idea 5: ángulo de observación =======================
  const TAB = { 12: [[9, 37], [12, 45], [16, 53]], 24: [[7, 16], [18, 37], [24, 45], [32, 53]], 7: [[7, 45], [24, 74]] };
  function observacion(rng) {
    const d0 = rng.elegir([12, 24, 7]), hs = TAB[d0], k = d0 === 24 ? 1 : rng.entero(1, 2);
    const i = rng.entero(0, hs.length - 2), j = rng.entero(i + 1, hs.length - 1), [ha, aa] = hs[i], [hb, ab] = hs[j], dv = d0 * k;
    const ok = E(ab - aa);
    const A = alternativas(ok, [
      { id: 'OBS-SOLO-ARRIBA', ex: E(ab), explicar: x => `Bien la elevación del borde de arriba, ${x}. Falta restarle la del borde de abajo.` },
      { id: 'OBS-SOLO-ABAJO', ex: E(aa), explicar: x => `Bien la elevación del borde de abajo, ${x}. El ángulo de observación es lo que hay entre las dos visuales.` },
      { id: 'OBS-SUMA', ex: E(aa + ab), explicar: x => `Bien las dos elevaciones. Pero el ángulo entre las visuales es su resta; sumarlas da ${x}.` },
      { id: 'OBS-ALTURAS-GRADOS', ex: E((hb - ha) * k), explicar: x => `Bien que restes. Pero se restan los ángulos, no las alturas: ${x} es la resta de metros.` },
    ], '°', grados);
    return {
      enunciado: [`Una franja pintada en un edificio va de `, OP(`${ha * k} m`), ' a ', OP(`${hb * k} m`), ' sobre tus ojos. Estás a ', AD(`${dv} m`), ' del edificio.'],
      pregunta: ['¿Cuál es su ángulo de observación?'], datos: [D.obs, tanes([16, 37, 45]), tanes([53, 74])], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [[`tan β = ${hb * k}/${dv} y tan α = ${ha * k}/${dv}: son `, ANG(`${ab}°`), ' y ', ANG(`${aa}°`), '.'], ['φ = ', ANG(`${ab}° − ${aa}° = ${ab - aa}°`), '.']],
      _datos: { d0, k, ha, hb, aa, ab },
    };
  }
  const LARGOS = [[12, 37, 16], [12, 37, 8], [12, 45, 8], [24, 16, 21], [24, 16, 29], [24, 37, 16], [24, 16, 37], [24, 37, 8], [7, 45, 29]];
  const TANG = { 16: E(7, 24), 37: E(3, 4), 45: E(1), 53: E(4, 3), 74: E(24, 7) };
  function largoObs(rng) {
    const [d0, ga, gf] = rng.elegir(LARGOS), k = d0 === 24 ? 1 : rng.entero(1, 2), gb = ga + gf, dv = d0 * k;
    const alto = por(E(dv), TANG[gb]), bajo = por(E(dv), TANG[ga]), ok = resta(alto, bajo);
    const A = alternativas(ok, [
      { id: 'OBS-SOLO-ARRIBA', ex: alto, explicar: x => `Bien la altura del borde de arriba, ${x}. Falta restarle la del borde de abajo.` },
      { id: 'OBS-RESTA-ALTURAS', ex: TANG[gf] ? por(E(dv), TANG[gf]) : null, explicar: x => `Bien usar ${gf}°. Pero ${gf}° no se mide desde la horizontal de los ojos: ${x} no es el largo.` },
      { id: 'OBS-SUMA', ex: suma(alto, bajo), explicar: x => `Bien las dos alturas. Pero el letrero es lo que hay entre ellas: sumar da ${x}.` },
      { id: 'OBS-SOLO-ABAJO', ex: bajo, explicar: x => `Bien la altura del borde de abajo, ${x}. Pero se pide el largo del letrero.` },
    ], 'm');
    return {
      enunciado: ['Estás a ', AD(`${dv} m`), ' de un letrero. Su borde de abajo se ve con ', ANG(`${ga}°`), ' de elevación y el letrero abarca ', ANG(`${gf}°`), '.'],
      pregunta: ['¿Cuánto mide el letrero?'], datos: [D.obs, tanes([16, 37, 45]), tanes([53, 74])], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [[`El borde de arriba se ve con ${ga}° + ${gf}° = `, ANG(`${gb}°`), '. Sus alturas: ', OP(txt(alto)), ' y ', OP(txt(bajo)), '.'], [`${txt(alto)} − ${txt(bajo)} = ${largo(ok, 'm')}.`]],
      _datos: { d0, k, ga, gf },
    };
  }
  function ventanaObs(rng) {
    const d0 = rng.elegir([12, 24]), hs = TAB[d0], i = rng.entero(0, hs.length - 1), j = rng.entero(0, hs.length - 1);
    const [h0, gb] = hs[i], [arr, ga] = hs[j];
    const A = alternativas(E(gb + ga), [
      { id: 'OBS-RESTA', ex: E(Math.abs(ga - gb)), explicar: x => `Bien las dos visuales. Pero una baja y la otra sube: se suman; restar da ${x}.` },
      { id: 'OBS-SOLO-ARRIBA', ex: E(ga), explicar: x => `Bien la elevación a la azotea, ${x}. Falta la depresión a la base.` },
      { id: 'OBS-SOLO-ABAJO', ex: E(gb), explicar: x => `Bien la depresión a la base, ${x}. Falta la elevación a la azotea.` },
      { id: 'DEP-VERTICAL', ex: E(90 - gb + ga), explicar: x => `Bien que sumes. Pero la depresión se mide desde la horizontal, no desde la pared: así sale ${x}.` },
    ], '°', grados);
    return {
      enunciado: [`Desde una ventana a ${h0} m del suelo miras un edificio de ${h0 + arr} m que está enfrente, a `, AD(`${d0} m`), '.'],
      pregunta: ['¿Qué ángulo abarca ese edificio desde la ventana?'], datos: [D.obs, D.abajo, tanes([16, 37, 45]), tanes([53, 74])], correcta: A.correcta, fmt: A.fmt, errores: A.errores,
      solucion: [[`La base, ${h0} m abajo: depresión de tan ${h0}/${d0}, `, ANG(`${gb}°`), `. La azotea, ${arr} m arriba: elevación de tan ${arr}/${d0}, `, ANG(`${ga}°`), '.'], ['Se suman: φ = ', ANG(`${gb + ga}°`), '.']],
      _datos: { d0, h0, arr, gb, ga },
    };
  }

  const CONSTRUIR = {
    cateto, perimetro, 'altura-hip': alturaHip, 'otro-cateto': otroCateto, hipotenusa, puente, elevacion, 'ojos-depresion': ojosDepresion, ventana,
    separacion, 'altura-dos': alturaDos, movil, observacion, largo: largoObs, 'ventana-obs': ventanaObs,
  };

  return { id: ID, titulo: 'Resolución de triángulos rectángulos', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
