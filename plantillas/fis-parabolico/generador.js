/*
 * Generador «Movimiento parabólico»: la práctica de las cinco ideas de fisica.movimiento-parabolico-y-circular
 * (contenido/teoria/fisica/movimiento-parabolico-y-circular.js). Formato "predicciones" (docs/arquitectura.md). Funciona
 * en el navegador (window.Generadores['fis-parabolico']) y en Node (require). 19 nov 2026, fase 3 de la Etapa 5.
 *
 * La física vive en el motor de la escena (plantillas/tiro-parabolico/motor.js: proyectil, con g = 10 m/s² y los senos
 * y cosenos del examen), que este generador llama y no copia (docs/etapa5/propuesta-fisica.md §7). En el navegador, si
 * la escena todavía no lo cargó, se pide al mismo servidor antes de registrarse (como fis-mruv con el suyo).
 *
 * Objetos de la unidad (propuesta §2 y §8): la piedra lanzada de lado desde una peña a orillas del lago, la azotea, la
 * mesa con su canica y la avioneta que suelta víveres (A1, A2); la pelota que patea el arquero en la cancha (A3, A4); el
 * chorro de la manguera (A4); el dron sobre las calles y una partícula con x(t) e y(t) (A5). Valores de problema, sin
 * fuente: piedras de 5 a 20 m/s, pelotas pateadas de 10 a 25 m/s, peñas y azoteas de 5 a 80 m, avionetas de 144 a
 * 216 km/h a 80–180 m del suelo, drones de 2 a 15 m/s; g = 10 m/s² (convención del examen).
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las cinco con el mismo peso.
 *   un-reloj-dos-ejes       caida-t (1) cuánto tarda en caer, con la rapidez de lado de sobra · alcance-h (2) a qué
 *                           distancia cae · avioneta (3) cuánto antes de la marca suelta el paquete, en km/h (P4)
 *   velocidad-en-vuelo      vy-t (1) la velocidad hacia abajo a los t s · llegada (2) la rapidez al llegar al piso ·
 *                           angulo-t (3) el instante en que la velocidad forma 37°, 45° o 53° con la horizontal
 *   tiro-oblicuo            componentes (1; sub lado o sube) · altura-t (2) la altura a los t s · vuelo-avance (3) el
 *                           tiempo de vuelo con lo que avanza, como San Marcos 2022 (85) · azotea (3) desde una azotea,
 *                           con ángulo, hasta el piso (dos raíces)
 *   altura-y-alcance        altura-max (1) · alcance (2) · alcance-45 (3) la rapidez con el ángulo de mayor alcance y el
 *                           tiempo de vuelo, como San Marcos 2026-I (89) · veces (3) el alcance a otra rapidez (PR1)
 *   ecuaciones-en-el-plano  posicion (1) una coordenada a los t s · distancia (2) la distancia a la plaza ·
 *                           particula (3) x = x₀ + a·t e y = c·t², como San Marcos 2025-I (81)
 *
 * Notación (propuesta §5): «v_0», «v_0x», «v_0y», «v_x», «v_y» con subíndice de verdad (la app los muestra así); h es lo
 * que cae, medido hacia abajo (A1, A2); y, la altura sobre la salida (A3 a A5); H la altura máxima y R el alcance.
 * Colores: un color fijo por magnitud, el de la unidad (velocidad naranja, tiempo turquesa, posición y altura violeta,
 * aceleración carmín; sin verde). Ninguna alternativa ni explicación nombra una letra de alternativa.
 * Datos (contrato, punto 13): las fórmulas generales de cada idea (x = v_0 · t, h = ½ · g · t², v_y = g · t,
 * y = v_0y · t − ½ · g · t², v_y² = v_0y² − 2 · g · y), sen y cos de 37° y 53° como convención del examen, la fórmula
 * general de segundo grado y las equivalencias; nunca el atajo (t = 2v_0 sen θ/g, H = v_0² sen²θ/2g, R = v_0² sen 2θ/g;
 * decisión 6) ni la respuesta.
 * Errores: los códigos de la unidad (cabecera de la teoría y docs/investigacion/cinematica-ideas-erroneas.md, sección
 * «Movimiento parabólico»): P2 y P4 con respaldo del informe (Prescott y Mitchelmore 2005); los demás (TP-, 2D-, PR-,
 * K-TIEMPO, C-LINEAL, U1-kmh) son hipótesis.
 * La práctica no repite ninguna Predice de la unidad: ni 15 m/s de lado a los 2 s, ni 25 m/s con 53° en la cima, ni el
 * chorro de 10 m/s a 30°, ni el dron con 6t y 8t.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const motor = nodo ? require('../tiro-parabolico/motor.js') : (root.MotorTiro || cargarMotor(root));
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones, motor);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;

  function cargarMotor(r) {
    const doc = r.document, actual = doc && doc.currentScript;
    const url = new URL('../tiro-parabolico/motor.js', actual && actual.src ? actual.src : r.location.href).href;
    const x = new XMLHttpRequest();
    x.open('GET', url, false);
    x.send(null);
    if (x.status !== 200 && x.status !== 0) throw new Error('fis-parabolico: no se pudo cargar el motor del tiro');
    const s = doc.createElement('script');
    s.text = `${x.responseText}\n//# sourceURL=${url}`;
    doc.head.appendChild(s);
    if (!r.MotorTiro) throw new Error('fis-parabolico: el motor del tiro no se registró');
    return r.MotorTiro;
  }
})(typeof self !== 'undefined' ? self : this, function (Azar, P, M) {
  'use strict';
  const ID = 'fis-parabolico';
  const CIN = 'docs/investigacion/cinematica-ideas-erroneas.md';
  const G = M.G;
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d).replace(/ /g, ' ');
  const ms = x => `${f(x)} m/s`, sg = x => `${f(x)} s`, mt = x => `${f(x)} m`, gr = x => `${f(x)}°`;
  const igual = (a, b) => Math.abs(a - b) < 1e-9;

  const VARS = { v: { nombre: 'la velocidad', color: 'o' }, t: { nombre: 'el tiempo', color: 'i' }, x: { nombre: 'la posición', color: 'f' }, a: { nombre: 'la aceleración', color: 'h' } };
  const V = t => v('v', t), T = t => v('t', t), X = t => v('x', t), A = t => v('a', t);

  // ---- Errores: el respaldo sale del código ----
  const RESPALDO = { P2: 'documentado', P4: 'documentado' };
  const TRA = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const resp = id => (/^(U1|PR1)\b/.test(id) ? ['hipotesis', TRA] : [RESPALDO[id] || 'hipotesis', CIN]);
  const e = (id, valor, explicar) => ({ id, valor, explicar });

  // ---- Datos (herramientas, no el paso hecho) ----
  const D = {
    lado: 'De lado avanza parejo: x = v_0 · t',
    cae: 'Hacia abajo cae desde el reposo: h = ½ · g · t²',
    vy: 'Hacia abajo, desde el reposo: v_y = g · t',
    rap: 'Rapidez: v = √(v_x² + v_y²)',
    ang: 'Ángulo θ de la velocidad con la horizontal: tan θ = v_y/v_x',
    tan: 'tan 37° = 3/4, tan 45° = 1 y tan 53° = 4/3 (convención del examen)',
    g: 'g = 10 m/s² (convención del examen); sin resistencia del aire.',
    kmh: '1 km = 1000 m y 1 h = 3600 s',
    comp: 'Componentes de la salida: v_0x = v_0 · cos θ y v_0y = v_0 · sen θ',
    trig: 'sen 37° = cos 53° = 3/5 y cos 37° = sen 53° = 4/5 (convención del examen)',
    trig30: 'sen 30° = cos 60° = 1/2 y cos 30° = sen 60° = √3/2',
    trig45: 'sen 45° = cos 45° = √2/2',
    x: 'De lado: x = v_0x · t',
    y: 'Altura sobre la salida, eje hacia arriba: y = v_0y · t − ½ · g · t²',
    v2: 'Velocidad vertical y altura: v_y² = v_0y² − 2 · g · y',
    H: 'Altura máxima H: la altura del punto donde v_y = 0',
    R: 'Alcance R: lo que avanza de lado hasta volver al piso',
    cuadratica: 'Si p · t² + q · t + r = 0: t = (−q ± √(q² − 4pr)) ÷ (2p)',
    plano: 'x: lo que avanzó al este; y: al norte, en metros. El este y el norte forman 90°.',
    eje: 'Posición en un eje: salida + velocidad · t + ½ · aceleración · t²',
    dist: 'Distancia al origen: d = √(x² + y²)',
  };
  const trigDe = a => (a === 37 || a === 53 ? D.trig : a === 45 ? D.trig45 : D.trig30);

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    'un-reloj-dos-ejes': ['caida-t', 'alcance-h', 'avioneta'],
    'velocidad-en-vuelo': ['vy-t', 'llegada', 'angulo-t'],
    'tiro-oblicuo': ['componentes', 'altura-t', 'vuelo-avance', 'azotea'],
    'altura-y-alcance': ['altura-max', 'alcance', 'alcance-45', 'veces'],
    'ecuaciones-en-el-plano': ['posicion', 'distancia', 'particula'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { 'caida-t': 1, 'alcance-h': 2, avioneta: 3, 'vy-t': 1, llegada: 2, 'angulo-t': 3, componentes: 1, 'altura-t': 2, 'vuelo-avance': 3, azotea: 3,
    'altura-max': 1, alcance: 2, 'alcance-45': 3, veces: 3, posicion: 1, distancia: 2, particula: 3 };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): las cinco ideas, de menos a más.
  const PAPEL = { 'papel-1': ['caida-t'], 'papel-2': ['vy-t'], 'papel-3': ['componentes', 'lado'], 'papel-4': ['alcance-h'],
    'papel-5': ['alcance'], 'papel-6': ['distancia'], 'papel-7': ['vuelo-avance'], 'papel-8': ['alcance-45'] };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && PAPEL[String(semilla)];
    let tipo, sub0;
    if (forzado) [tipo, sub0] = forzado;
    else { const idea = TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS); tipo = rng.elegir(TIPOS_POR_IDEA[idea]); }
    for (let intento = 0; intento < 800; intento++) {
      const pr = CONSTRUIR[tipo](rng, sub0);
      const p = pr && cerrar(rng, semilla, tipo, pr);
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  // Qué errores van: 4 (o 3) con los que la correcta no es la más parecida a las demás ni la mayor o la menor.
  const trozos = t => String(t).replace(/[()]/g, ' ').split(/[\s;,]+|(?=[+−\-·/])|(?<=[+−\-·/])/).filter(Boolean);
  const distancia = (a, b) => { const X1 = trozos(a), X2 = trozos(b); let d = 0; for (let i = 0; i < Math.max(X1.length, X2.length); i++) if (X1[i] !== X2[i]) d++; return d; };
  function subconjuntos(l, k) {
    if (k === 0) return [[]];
    const r = [];
    for (let i = 0; i <= l.length - k; i++) for (const resto of subconjuntos(l.slice(i + 1), k - 1)) r.push([l[i], ...resto]);
    return r;
  }
  function elegirErrores(rng, correcta, errores) {
    const vistos = new Set([correcta.texto]), pool = [];
    for (const x of rng.barajar(errores)) if (!vistos.has(x.texto)) { vistos.add(x.texto); pool.push(x); }
    const bueno = sub => {
      const al = [correcta, ...sub], sc = al.map(a => al.reduce((t, b) => t + distancia(a.texto, b.texto), 0));
      const min = Math.min(...sc);
      if (sc[0] === min && sc.filter(x => x === min).length === 1) return false;
      const vs = al.map(a => a.valor);
      return !(correcta.valor === Math.max(...vs) || correcta.valor === Math.min(...vs));
    };
    for (const k of [4, 3]) for (const sub of subconjuntos(pool, Math.min(k, pool.length))) if (sub.length >= 3 && bueno(sub)) return sub;
    return pool.slice(0, 4);
  }
  function cerrar(rng, semilla, tipo, o) {
    const conRespaldo = x => { const [respaldo, fuente] = resp(x.id); return Object.assign({}, x, { explicacion: x.explicar(x.texto), respaldo, fuente }); };
    const ok = o.fmt(o.correcta);
    const validos = o.errores.filter(x => x && Number.isFinite(x.valor) && x.valor > 0 && !igual(x.valor, o.correcta)
      && P.enEscala(x.valor, o.correcta, x.id) && Math.abs(x.valor - o.correcta) >= 0.02 * Math.abs(o.correcta)).map(x => conRespaldo(Object.assign({}, x, { texto: o.fmt(x.valor) }))).filter(x => x.texto !== ok);
    const errores = elegirErrores(rng, { texto: ok, valor: o.correcta }, validos);
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.fmt, negativos: true });
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const variables = Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])]));
    return {
      id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad || '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }
  const tCae = h => M.proyectil({ vx: 1, vy: 0, y0: h }).tVuelo;

  // ======================= A1: tiro horizontal =======================
  const SITIOS = [
    { donde: h => ['Desde una peña de ', X(mt(h)), ' a orillas del lago se lanza una piedra de lado a '], llega: 'al agua', alturas: [20, 45, 80] },
    { donde: h => ['Desde una azotea de ', X(mt(h)), ' se lanza una pelota de lado a '], llega: 'al piso', alturas: [5, 20, 45] },
  ];
  function caidaT(rng) {
    const st = rng.elegir(SITIOS), h = rng.elegir(st.alturas), v0 = rng.elegir([5, 6, 8, 12, 15]), t = tCae(h);
    if (h === 45 && v0 === 10) return null;   // el juego de la idea 1
    return {
      enunciado: [...st.donde(h), V(ms(v0)), '.'], pregunta: [`¿Cuánto tarda en llegar ${st.llega}?`],
      datos: [D.lado, D.cae, D.g], correcta: t, fmt: sg,
      errores: [
        e('P2', h / v0, x => `Bien dividir una distancia entre una rapidez. Pero los ${v0} m/s son de lado: no la hacen bajar. ${x} no es.`),
        e('TP-SIN-MEDIO', Math.sqrt(h / G), x => `Bien usar solo la altura. Pero lo que cae es ½ · g · t²: sin el ½ sale ${x}.`),
        e('TP-RAIZ', 2 * h / G, x => `Bien el despeje de t². Pero falta la raíz cuadrada: ${x} es t².`),
        e('C-LINEAL', h / G, x => `Bien usar g. Pero eso sería bajar con velocidad fija; al caer acelera. ${x} no es.`),
      ],
      solucion: [['El tiempo sale solo de la altura: ', X(f(h)), ' = ½ · ', A('10'), ' · ', T('t²'), ', así que ', T(`t = ${sg(t)}`), '.'], ['Los ', V(ms(v0)), ' de lado no cambian ese tiempo.']],
      _datos: { h, v0 },
    };
  }
  function alcanceH(rng) {
    const h = rng.elegir([5, 20, 45, 80, 1.25, 0.8]), v0 = h < 2 ? rng.elegir([1, 1.5, 2, 3]) : rng.elegir([4, 6, 8, 12, 14, 15]), p = M.proyectil({ vx: v0, vy: 0, y0: h });
    const lugar = h < 2 ? ['Una canica sale de lado del borde de una mesa de ', X(mt(h)), ' a '] : ['Desde una azotea de ', X(mt(h)), ' se lanza una pelota de lado a '];
    return {
      enunciado: [...lugar, V(ms(v0)), '.'], pregunta: ['¿A qué distancia del pie cae?'],
      datos: [D.lado, D.cae, D.g], correcta: p.alcance, fmt: mt,
      errores: [
        e('TP-RAIZ', v0 * 2 * h / G, x => `Bien multiplicar la rapidez por un tiempo. Pero 2h/g es t²: falta la raíz; así sale ${x}.`),
        e('TP-SIN-MEDIO', v0 * Math.sqrt(h / G), x => `Bien los dos pasos. Pero en el tiempo falta el ½ de ½ · g · t²; así sale ${x}.`),
        e('K-TIEMPO', v0, x => `Bien que avance parejo. Pero ${x} es lo de un segundo: falta multiplicar por todo el vuelo.`),
        e('TP-ALTURA', h, x => `Bien leer los datos. Pero ${x} es la altura; el alcance se mide por el piso.`),
      ],
      solucion: [['Tiempo de vuelo: ', X(f(h)), ' = ½ · ', A('10'), ' · ', T('t²'), ', así que ', T(`t = ${sg(p.tVuelo)}`), '.'], ['De lado: ', X(`x = ${f(v0)} · ${f(p.tVuelo)} = ${mt(p.alcance)}`), '.']],
      _datos: { h, v0 },
    };
  }
  function avioneta(rng) {
    const k = rng.elegir([144, 180, 216]), h = rng.elegir([80, 125, 180]), v0 = k / 3.6, p = M.proyectil({ vx: v0, vy: 0, y0: h });
    if (k === 144 && h === 125) return null;   // un ejemplo de la teoría
    return {
      enunciado: ['Una avioneta vuela de lado a ', V(`${f(k)} km/h`), ', a ', X(mt(h)), ' del suelo, y debe dejar víveres sobre una marca.'],
      pregunta: ['¿A qué distancia de lado, antes de la marca, debe soltar el paquete?'],
      datos: [D.lado, D.cae, D.g, D.kmh], correcta: p.alcance, fmt: mt,
      errores: [
        e('P4', h, x => `Bien la altura. Pero el paquete no cae recto: sigue avanzando con la avioneta. ${x} no es.`),
        e('U1-kmh', k * p.tVuelo, x => `Bien el tiempo de caída. Pero con los km/h: falta pasar a m/s; así sale ${x}.`),
        e('TP-RAIZ', v0 * 2 * h / G, x => `Bien pasar a m/s. Pero 2h/g es t²: falta la raíz; así sale ${x}.`),
        e('TP-SIN-MEDIO', v0 * Math.sqrt(h / G), x => `Bien pasar a m/s. Pero en el tiempo falta el ½ de ½ · g · t²; así sale ${x}.`),
      ],
      solucion: [['En m/s: ', V(`${f(k)} km/h = ${ms(v0)}`), '. Cae ', X(mt(h)), ' en ', T(sg(p.tVuelo)), '.'], ['Mientras cae avanza: ', X(`x = ${f(v0)} · ${f(p.tVuelo)} = ${mt(p.alcance)}`), '.']],
      _datos: { k, h },
    };
  }

  // ======================= A2: la velocidad en cada instante =======================
  function vyT(rng) {
    const v0 = rng.elegir([4, 6, 8, 12]), t = rng.elegir([1.5, 2.5, 3, 3.5, 4]);
    return {
      enunciado: ['Una piedra sale de lado a ', V(ms(v0)), ' desde una peña alta.'], pregunta: ['¿Con qué velocidad hacia abajo va ', T(sg(t)), ' después?'],
      datos: [D.vy, D.g], correcta: G * t, fmt: ms,
      errores: [
        e('TP-SUMA', v0 + G * t, x => `Bien los 10 m/s por segundo. Pero la rapidez de lado no se suma a la de abajo; ${x} no es.`),
        e('TP-CAIDA', G * t * t / 2, x => `Bien usar el tiempo. Pero ${x} son los metros que cayó, no su velocidad.`),
        e('TP-V-CONSTANTE', v0, x => `Bien: de lado sigue a ${x}. Pero hacia abajo gana 10 m/s cada segundo.`),
        e('K-TIEMPO', G, x => `Bien que gane 10 m/s por segundo. Pero ${x} es un solo segundo: falta el tiempo.`),
      ],
      solucion: [['Hacia abajo parte de cero y gana 10 m/s cada segundo: ', V(`v_y = 10 · ${f(t)} = ${ms(G * t)}`), '.']],
      _datos: { v0, t },
    };
  }
  function llegada(rng) {
    const [h, v0] = rng.elegir([[20, 15], [45, 16], [80, 9], [5, 10], [20, 10], [45, 12], [80, 18], [20, 20]]), p = M.proyectil({ vx: v0, vy: 0, y0: h }), vy = -p.vFinal.vy;
    return {
      enunciado: ['Desde una torre de ', X(mt(h)), ' se lanza una pelota de lado a ', V(ms(v0)), '.'], pregunta: ['¿Con qué rapidez llega al piso?'],
      datos: [D.cae, D.vy, D.rap, D.g], correcta: p.vFinal.modulo, fmt: ms,
      errores: [
        e('TP-SOLO-VY', vy, x => `Bien: ${x} es la velocidad hacia abajo al llegar. Falta juntarla con la de lado.`),
        e('TP-SUMA', vy + v0, x => `Bien las dos componentes. Pero forman un ángulo recto: con Pitágoras, no sumando. ${x} no es.`),
        e('TP-V-CONSTANTE', v0, x => `Bien: de lado sigue a ${x}. Pero además viene cayendo.`),
        e('TP-RESTA-V', Math.abs(vy - v0), x => `Bien las dos componentes. Pero no van en la misma línea: no se restan. ${x} no es.`),
      ],
      solucion: [['Cae ', X(mt(h)), ' en ', T(sg(p.tVuelo)), ': llega con ', V(`v_y = ${ms(vy)}`), ' hacia abajo.'], ['Con Pitágoras: ', V(`v = √(${f(v0)}² + ${f(vy)}²) = ${ms(p.vFinal.modulo)}`), '.']],
      _datos: { h, v0 },
    };
  }
  function anguloT(rng) {
    const [v0, ang] = rng.elegir([[20, 37], [16, 37], [12, 37], [8, 37], [15, 53], [6, 53], [9, 53], [18, 53], [8, 45], [15, 45], [20, 53]]);
    const tn = { 37: 0.75, 45: 1, 53: 4 / 3 }[ang], t = v0 * tn / G, sn = M.trig(ang).sen;
    return {
      enunciado: ['Una piedra sale de lado a ', V(ms(v0)), ' desde una peña alta.'], pregunta: [`¿En qué instante su velocidad forma ${ang}° con la horizontal?`],
      datos: [D.vy, D.ang, D.tan, D.g], correcta: t, fmt: sg,
      errores: [
        ang !== 45 && e('TP-TAN-INV', v0 / tn / G, x => `Bien usar tan θ. Pero es lo que baja entre lo que avanza, no al revés; así sale ${x}.`),
        e('TP-VY', v0 * tn, x => `Bien: ${x} sería la velocidad hacia abajo que hace falta, en m/s. Falta dividir entre 10.`),
        ang !== 45 && e('TP-45', v0 / G, x => `Bien buscar la velocidad hacia abajo. Pero ${x} es el instante de los 45°.`),
        e('TP-SENO', v0 * sn / G, x => `Bien buscar la velocidad hacia abajo. Pero sale de la de lado con tan θ, no con el seno: ${x} no es.`),
        e('TP-DOBLE-T', 2 * t, x => `Bien la velocidad hacia abajo. Pero gana 10 m/s cada segundo, no 5: ${x} no es.`),
      ],
      solucion: [['A ', `${ang}°`, ', tan θ = v_y/v_x, así que ', V(`v_y = ${f(v0)} · ${f(tn)} = ${ms(v0 * tn)}`), '.'], ['Esa velocidad hacia abajo la gana en ', T(`t = ${f(v0 * tn)} ÷ 10 = ${sg(t)}`), '.']],
      _datos: { v0, ang },
    };
  }

  // ======================= A3: lanzar con ángulo =======================
  const PATADAS = [[10, 37], [15, 37], [20, 37], [10, 53], [15, 53], [20, 53], [20, 30], [12, 30], [20, 60], [10, 60], [25, 37]];
  const patada = (v0, a) => ['El arquero patea la pelota desde el piso a ', V(ms(v0)), ` con ${a}°.`];
  function componentes(rng, forzado) {
    const sub = forzado || rng.elegir(['lado', 'sube']), [v0, a] = rng.elegir(PATADAS), p = M.proyectil({ v0, angulo: a });
    const ok = sub === 'lado' ? p.vx : p.vy, otra = sub === 'lado' ? p.vy : p.vx;
    return {
      enunciado: patada(v0, a), pregunta: [sub === 'lado' ? '¿Cuánto vale su velocidad horizontal al salir?' : '¿Con qué velocidad vertical sale?'],
      datos: [D.comp, trigDe(a)], correcta: ok, fmt: ms,
      errores: [
        e('TP-SENCOS', otra, x => `Bien partir la rapidez. Pero ${sub === 'lado' ? 'de lado va el coseno' : 'lo que sube lleva el seno'}; ${x} es la otra parte.`),
        e('TP-V0', v0, x => `Bien leer la rapidez. Pero ${x} es la entera: cada parte sale de multiplicarla por seno o coseno.`),
        e('TP-MITAD', v0 / 2, x => `Bien que cada parte sea menor. Pero no se reparte por mitades: depende del ángulo. ${x} no es.`),
        e('TP-ANGULO', v0 * a / 90, x => `Bien que la parte dependa del ángulo. Pero no en proporción a los grados: ${x} no es.`),
      ],
      solucion: [[sub === 'lado' ? 'De lado va la parte del coseno: ' : 'Hacia arriba va la parte del seno: ', V(`${sub === 'lado' ? 'v_0x' : 'v_0y'} = ${f(v0)} · ${sub === 'lado' ? 'cos' : 'sen'} ${a}° = ${ms(ok)}`), '.']],
      _datos: { sub, v0, a },
    };
  }
  function alturaT(rng) {
    const [v0, a] = rng.elegir(PATADAS), p = M.proyectil({ v0, angulo: a }), t = rng.elegir([0.5, 1, 1.5, 2].filter(q => q < p.tVuelo - 0.2)), y = p.estado(t).y;
    if (t === undefined) return null;
    return {
      enunciado: patada(v0, a), pregunta: ['¿A qué altura está ', T(sg(t)), ' después?'],
      datos: [D.comp, trigDe(a), D.y, D.g], correcta: y, fmt: mt,
      errores: [
        e('TP-SIN-G', p.vy * t, x => `Bien lo que sube por su velocidad. Pero la gravedad le quita ½ · g · t²; ${x} no es.`),
        e('TP-SIN-MEDIO', p.vy * t - G * t * t, x => `Bien restar lo que quita la gravedad. Pero es ½ · g · t², con el ½; así sale ${x}.`),
        e('TP-V0', v0 * t - G * t * t / 2, x => `Bien la ecuación. Pero hacia arriba solo sube la parte vertical; con la rapidez entera sale ${x}.`),
        e('TP-SENCOS', p.vx * t - G * t * t / 2, x => `Bien la ecuación. Pero lo que sube lleva el seno; con el coseno sale ${x}.`),
      ],
      solucion: [['Sube con ', V(`v_0y = ${ms(p.vy)}`), '.'], ['', X(`y = ${f(p.vy)} · ${f(t)} − 5 · ${f(t)}² = ${mt(y)}`), '.']],
      _datos: { v0, a, t },
    };
  }
  function vueloAvance(rng) {
    const [v0, a] = rng.elegir(PATADAS), p = M.proyectil({ v0, angulo: a });
    return {
      enunciado: ['Una pelota pateada a ', V(ms(v0)), ` con ${a}° cae a `, X(mt(p.alcance)), ' de donde salió.'], pregunta: ['¿Cuánto tiempo estuvo en el aire?'],
      datos: [D.comp, trigDe(a), D.x], correcta: p.tVuelo, fmt: sg,
      errores: [
        e('TP-V0', p.alcance / v0, x => `Bien dividir lo que avanza entre una rapidez. Pero de lado solo va la parte horizontal; ${x} no es.`),
        e('TP-SENCOS', p.alcance / p.vy, x => `Bien dividir lo que avanza entre una rapidez. Pero de lado va el coseno, no el seno; ${x} no es.`),
        e('TP-SUBIDA', p.tSubida, x => `Bien el camino. Pero ${x} es solo la subida: el vuelo dura el doble.`),
        e('TP-V0-VUELO', 2 * v0 / G, x => `Bien la subida y la bajada. Pero solo sube la parte vertical, no los ${v0} m/s; ${x} no es.`),
      ],
      solucion: [['De lado avanza parejo con ', V(`v_0x = ${ms(p.vx)}`), ' todo el vuelo.'], ['', T(`t = ${f(p.alcance)} ÷ ${f(p.vx)} = ${sg(p.tVuelo)}`), '.']],
      _datos: { v0, a },
    };
  }
  function azotea(rng) {
    const [h, v0, a] = rng.elegir([[16, 20, 53], [32, 20, 37], [40, 20, 30], [45, 20, 53], [15, 20, 30], [30, 10, 30], [27, 10, 37], [21, 10, 53]]), p = M.proyectil({ v0, angulo: a, y0: h });
    return {
      enunciado: ['Desde una azotea de ', X(mt(h)), ' se lanza una pelota a ', V(ms(v0)), ` con ${a}° hacia arriba.`], pregunta: ['¿Cuánto tarda en llegar al piso?'],
      datos: [D.comp, trigDe(a), D.y, D.cuadratica, D.g], correcta: p.tVuelo, fmt: sg,
      errores: [
        e('TP-VUELVE', 2 * p.vy / G, x => `Bien la subida y la bajada. Pero ${x} es cuando vuelve a la altura de la azotea; le falta bajar.`),
        e('TP-SOLTAR', tCae(h), x => `Bien la caída de ${h} m. Pero ${x} sería soltándola; primero sube.`),
        e('TP-SUBIDA', p.tSubida, x => `Bien la parte que sube. Pero ${x} es solo hasta lo más alto.`),
        e('TP-SENCOS', M.proyectil({ vx: p.vy, vy: p.vx, y0: h }).tVuelo, x => `Bien la ecuación de segundo grado. Pero lo que sube lleva el seno; con el coseno sale ${x}.`),
      ],
      solucion: [['Sube con ', V(`v_0y = ${ms(p.vy)}`), '; el piso está en ', X(`y = −${f(h)} m`), '.'], [`5t² − ${f(p.vy)}t − ${f(h)} = 0 da `, T(`t = ${sg(p.tVuelo)}`), ' (la otra raíz es negativa).']],
      _datos: { h, v0, a },
    };
  }

  // ======================= A4: altura máxima y alcance =======================
  const TIROS4 = [[10, 37], [15, 37], [20, 37], [25, 37], [10, 53], [15, 53], [20, 53], [25, 53], [20, 30], [12, 30], [20, 60]];
  function alturaMax(rng) {
    const [v0, a] = rng.elegir(TIROS4), p = M.proyectil({ v0, angulo: a });
    return {
      enunciado: ['Una pelota sale del piso a ', V(ms(v0)), ` con ${a}°.`], pregunta: ['¿Qué altura máxima alcanza?'],
      datos: [D.comp, trigDe(a), D.v2, D.H, D.g], correcta: p.H, fmt: mt,
      errores: [
        e('TP-MEDIO', p.vy * p.vy / G, x => `Bien lo que sube, al cuadrado. Pero se divide entre 2 · g, no solo entre g; así sale ${x}.`),
        e('TP-V0', v0 * v0 / (2 * G), x => `Bien la cuenta. Pero ${x} sería lanzándola recto hacia arriba; solo sube su parte vertical.`),
        e('TP-SENCOS', p.vx * p.vx / (2 * G), x => `Bien la cuenta. Pero la altura la da lo que sube, con el seno; con el coseno sale ${x}.`),
        e('TP-TIEMPO', p.tSubida, x => `Bien que arriba v_y = 0. Pero ${x} es el tiempo de subida, en segundos.`),
      ],
      solucion: [['Sube con ', V(`v_0y = ${ms(p.vy)}`), '; arriba la velocidad vertical vale 0.'], ['0 = ', V(`${f(p.vy)}²`), ' − 2 · ', A('10'), ' · H, así que ', X(`H = ${mt(p.H)}`), '.']],
      _datos: { v0, a },
    };
  }
  function alcance(rng) {
    const [v0, a] = rng.elegir(TIROS4), p = M.proyectil({ v0, angulo: a });
    return {
      enunciado: ['Una pelota sale del piso a ', V(ms(v0)), ` con ${a}°.`], pregunta: ['¿A qué distancia cae?'],
      datos: [D.comp, trigDe(a), D.x, D.y, D.g], correcta: p.alcance, fmt: mt,
      errores: [
        e('TP-SUBIDA', p.alcance / 2, x => `Bien lo de lado por un tiempo. Pero ese es solo el de subida; así sale ${x}.`),
        e('TP-V0', v0 * p.tVuelo, x => `Bien el tiempo de vuelo. Pero de lado avanza solo con su parte horizontal; ${x} no es.`),
        e('TP-SENCOS', p.vy * p.tVuelo, x => `Bien el tiempo de vuelo. Pero de lado va el coseno; con lo que sube sale ${x}.`),
        e('TP-ALTURA', p.H, x => `Bien la cuenta de la cima. Pero ${x} es la altura máxima; el alcance se mide por el piso.`),
      ],
      solucion: [['Sube ', T(sg(p.tSubida)), ' y baja otro tanto: vuela ', T(sg(p.tVuelo)), '.'], ['De lado: ', X(`R = ${f(p.vx)} · ${f(p.tVuelo)} = ${mt(p.alcance)}`), '.']],
      _datos: { v0, a },
    };
  }
  function alcance45(rng) {
    const [k, v0] = rng.elegir([[1, 10], [3, 30], [1.5, 15], [2.5, 25], [4, 40]]), uy = G * k * Math.SQRT2 / 2;
    const tt = k === 1 ? '√2 s' : `${f(k)}√2 s`;
    return {
      enunciado: ['Una pelota se patea con el ángulo que le da el mayor alcance y está ', T(tt), ' en el aire.'], pregunta: ['¿Con qué rapidez salió?'],
      datos: [D.comp, D.trig45, D.y, D.g], correcta: v0, fmt: ms,
      errores: [
        e('TP-COMPONENTE', uy, x => `Bien: ${x} es lo que sube. La rapidez entera es mayor: se divide entre sen 45°.`),
        e('TP-SUBIDA', 2 * uy, x => `Bien que arriba la vertical valga 0. Pero sube solo la mitad del vuelo; ${x} no es.`),
        e('TP-SEN-POR', uy * Math.SQRT2 / 2, x => `Bien lo que sube. Pero para la rapidez entera se divide entre sen 45°; multiplicando sale ${x}.`),
        e('TP-SUBIDA-V0', 2 * v0, x => `Bien dividir entre sen 45°. Pero sube solo la mitad del vuelo; así sale ${x}.`),
      ],
      solucion: [['El mayor alcance es a 45°. Sube la mitad del vuelo: ', V(`v_0y = 10 · ${f(k / 2)}√2 = ${ms(uy)}`), '.'], ['', V(`v_0 = ${f(uy)} ÷ sen 45° = ${ms(v0)}`), '.']],
      _datos: { k, v0 },
    };
  }
  function veces(rng) {
    const [v0, a] = rng.elegir([[10, 53], [20, 37], [12, 30], [10, 60], [15, 37], [8, 45]]), [k, cuanto] = rng.elegir([[3, 'el triple'], [2, 'el doble'], [0.5, 'la mitad'], [1.5, '1,5 veces']]);
    const R1 = M.proyectil({ v0, angulo: a }).alcance, R2 = M.proyectil({ v0: k * v0, angulo: a }).alcance;
    if (v0 === 10 && a === 30) return null;   // la predicción de la idea 4
    return {
      enunciado: ['A ', V(ms(v0)), ` con ${a}°, una pelota cae a `, X(mt(R1)), '.'], pregunta: ['Con el mismo ángulo y ', V(cuanto), ' de esa rapidez, ¿a qué distancia cae?'],
      datos: [D.comp, D.x, D.y, D.g], correcta: R2, fmt: mt,
      errores: [
        e('PR1-alcance', k * R1, x => `Bien que el alcance cambie. Pero no en proporción: también cambia el tiempo de vuelo; ${x} no es.`),
        e('PR-CUBO', k * k * k * R1, x => `Bien que cambie más que la rapidez. Pero solo cambian dos cosas: el tiempo y el avance; ${x} no es.`),
        e('TP-SOLO-ANGULO', R1, x => `Bien que el ángulo sea el mismo. Pero la rapidez también decide el alcance; ${x} no es.`),
        e('PR-DOBLE-K', 2 * k * R1, x => `Bien multiplicar. Pero el factor es ${f(k)} · ${f(k)}, no 2 · ${f(k)}; así sale ${x}.`),
      ],
      solucion: [['Lo de lado se multiplica por ', V(f(k)), ' y el tiempo de vuelo también.'], ['', X(`R = ${f(k)} · ${f(k)} · ${f(R1)} = ${mt(R2)}`), '.']],
      _datos: { v0, a, k },
    };
  }

  // ======================= A5: ecuaciones en el plano =======================
  const DRONES = [[3, 4], [4, 3], [5, 12], [12, 5], [9, 12], [8, 15], [15, 8], [2, 3], [5, 2], [7, 24]];
  function posicion(rng) {
    const [a, b] = rng.elegir(DRONES), t = rng.elegir([2, 3, 4, 5]), norte = rng.elegir([true, false]);
    return {
      enunciado: ['Un dron sale de la plaza con x = ', V(f(a)), T('t'), ' e y = ', V(f(b)), T('t'), ' (en metros y segundos).'],
      pregunta: [`¿Cuántos metros al ${norte ? 'norte' : 'este'} está a los `, T(sg(t)), '?'],
      datos: [D.plano, D.eje], correcta: (norte ? b : a) * t, fmt: mt,
      errores: [
        e('2D-EJE', (norte ? a : b) * t, x => `Bien reemplazar el tiempo. Pero ${x} es la otra coordenada.`),
        e('2D-SIN-T', norte ? b : a, x => `Bien leer la ecuación. Pero ${x} es lo de un solo segundo: falta el tiempo.`),
        e('2D-CUADRADO', (norte ? b : a) * t * t, x => `Bien reemplazar el tiempo. Pero la ecuación tiene t, no t²; así sale ${x}.`),
        e('2D-DIST', Math.hypot(a * t, b * t), x => `Bien las dos coordenadas. Pero ${x} es la distancia a la plaza; piden solo una.`),
      ],
      solucion: [['Se reemplaza el tiempo: ', X(`${norte ? 'y' : 'x'} = ${f(norte ? b : a)} · ${f(t)} = ${mt((norte ? b : a) * t)}`), '.']],
      _datos: { a, b, t, sub: norte ? 'norte' : 'este' },
    };
  }
  function distanciaD(rng) {
    const [a, b] = rng.elegir(DRONES), t = rng.elegir([2, 3, 4]), X0 = a * t, Y0 = b * t, d = Math.hypot(X0, Y0);
    return {
      enunciado: ['Un dron sale de la plaza con x = ', V(f(a)), T('t'), ' e y = ', V(f(b)), T('t'), ' (en metros y segundos).'],
      pregunta: ['¿A qué distancia de la plaza está a los ', T(sg(t)), '?'],
      datos: [D.plano, D.eje, D.dist], correcta: d, fmt: mt,
      errores: [
        e('2D-SUMA', X0 + Y0, x => `Bien las dos coordenadas. Pero sumarlas es ir por las calles: van con Pitágoras. ${x} no es.`),
        e('2D-UNA', Math.max(X0, Y0), x => `Bien reemplazar el tiempo. Pero ${x} es solo la coordenada mayor.`),
        e('2D-SIN-T', Math.hypot(a, b), x => `Bien Pitágoras. Pero con lo de un segundo; falta el tiempo. ${x} no es.`),
        e('2D-RESTA', Math.abs(X0 - Y0), x => `Bien las dos coordenadas. Pero forman un ángulo recto: no se restan. ${x} no es.`),
      ],
      solucion: [['A los ', T(sg(t)), ': ', X(`x = ${mt(X0)}`), ' e ', X(`y = ${mt(Y0)}`), '.'], ['Con Pitágoras: ', X(`d = √(${f(X0)}² + ${f(Y0)}²) = ${mt(d)}`), '.']],
      _datos: { a, b, t },
    };
  }
  function particula(rng) {
    const [x0, a, c] = rng.elegir([[2, 2, 2], [3, 6, 2], [1, 2, 3], [1, 4, 3], [2, 7, 3], [2, 5, 4], [3, 6, 5], [1, 10, 5], [1, 3, 6], [2, 4, 6], [2, 8, 6]]);
    const t = 2, X0 = x0 + a * t, Y0 = c * t * t, d = Math.hypot(X0, Y0);
    return {
      enunciado: ['Una partícula se mueve con x = ', X(f(x0)), ' + ', V(f(a)), T('t'), ' e y = ', A(f(c)), T('t²'), ' (en metros y segundos).'],
      pregunta: ['¿A qué distancia del origen está a los ', T('2 s'), '?'],
      datos: [D.eje, D.dist], correcta: d, fmt: mt,
      errores: [
        e('2D-SUMA', X0 + Y0, x => `Bien las dos coordenadas. Pero sumarlas no da la distancia; ${x} no es.`),
        e('2D-UNA', Math.max(X0, Y0), x => `Bien las coordenadas. Pero ${x} es solo la mayor.`),
        e('2D-CUADRADO', Math.hypot(X0, c * t), x => `Bien Pitágoras. Pero y lleva t²: a los 2 s es ${f(c)} · 4; así sale ${x}.`),
        e('2D-SIN-X0', Math.hypot(a * t, Y0), x => `Bien Pitágoras. Pero x no sale de 0: suma ${f(x0)} m; sin eso sale ${x}.`),
      ],
      solucion: [['A los 2 s: ', X(`x = ${f(x0)} + ${f(a)} · 2 = ${mt(X0)}`), ' e ', X(`y = ${f(c)} · 4 = ${mt(Y0)}`), '.'], ['', X(`d = √(${f(X0)}² + ${f(Y0)}²) = ${mt(d)}`), '.']],
      _datos: { x0, a, c },
    };
  }

  const CONSTRUIR = {
    'caida-t': caidaT, 'alcance-h': alcanceH, avioneta, 'vy-t': vyT, llegada, 'angulo-t': anguloT,
    componentes, 'altura-t': alturaT, 'vuelo-avance': vueloAvance, azotea,
    'altura-max': alturaMax, alcance, 'alcance-45': alcance45, veces, posicion, distancia: distanciaD, particula,
  };

  return { id: ID, titulo: 'Movimiento parabólico', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
