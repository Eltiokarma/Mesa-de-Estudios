/*
 * Generador «MRUV y caída libre»: la práctica de las seis ideas de fisica.mruv-y-caida-libre
 * (contenido/teoria/fisica/mruv-y-caida-libre.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['fis-mruv']) y en Node (require).
 *
 * La física vive en el motor de la escena MRUV (plantillas/mruv/motor.js: movil, enesimoSegundo, cruces,
 * igualVelocidad, lanzamientoVertical, pendiente), que este generador llama y no copia (propuesta, §7). En el navegador,
 * si la escena todavía no lo cargó, se pide al mismo servidor antes de registrarse (como rm-cuadros con su motor).
 *
 * Propuesta aprobada: docs/etapa4/propuesta-fisica.md, parte B (§1, §5, §6, §7 y §8) y docs/etapa4/decisiones.md.
 * Objetos de la unidad: la combi que arranca del paradero y frena frente al colegio (B1, B2), el atleta y el mototaxi
 * con su gráfica v–t (B3), el mototaxi y la combi que lo alcanza, con sus gráficas (B4), la regla que se atrapa, la
 * ventana, el puente y el pozo (B5) y la pelota pateada junto al pabellón o desde la azotea (B6). Valores de problema,
 * sin fuente (§8): combis de 2 a 30 m/s (en km/h, de 18 a 108), mototaxis de 4 a 15 m/s, atletas de 6 a 10 m/s,
 * pelotas pateadas o lanzadas de 5 a 20 m/s, puentes hasta 125 m, azoteas hasta 40 m, pozos de 20 a 80 m; el sonido a unos
 * 340 m/s y g = 10 m/s² como convención del examen.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los
 * de esa idea; sin idea, las seis con el mismo peso.
 *   aceleracion            acel (1; sub acelera o frena) a = Δv/Δt · velocidad (1) v = v₀ + a·t · tiempo (1) cuánto
 *                          tarda en llegar a una rapidez · kmh (2; sub arranca o frena) con km/h · izquierda (2; sub
 *                          frena o acelera) hacia el − · medias (3; sub tramo2 o total) aceleración media en dos tramos
 *                          con km/h, como San Marcos 2021 (82, 11 set) · velocimetro (3) lo que marca a los t s, en km/h
 *   ecuaciones-mruv        avance (1) Δx con la velocidad media · frenado (1) distancia de frenado (el tipo
 *                          mruv-y-caida-libre/frenado-distancia de contenido/ejercicios/tipos.json) · posicion (1) x
 *                          desde el grifo · v2 (2) v² = v₀² + 2aΔx · kmh-frenado (2) como San Marcos 2019-II (80) ·
 *                          horaria (3; sub velocidad o desplazamiento) x = A + Bt ± Ct², como San Marcos 2025-II (89)
 *                          y 2026-II (92) · proporcion (3) el mismo freno al doble o al triple, como San Marcos
 *                          2026-I (81) · enesimo (3) lo que avanza en el n-ésimo segundo
 *   pendiente-aceleracion  pendiente (1; sub sube o baja) a como pendiente de v–t · area (1; sub tri o trap) Δx como
 *                          área · retroceso (2; sub desplazamiento o distancia) avanza y retrocede · tramos (2) acelera y
 *                          sigue parejo · cruza-eje (3; sub desplazamiento o distancia) la recta que pasa bajo el eje ·
 *                          tren (3; sub tiempo o vmax) el viaje más corto, como San Marcos 2020-I (105) · area-acel (3)
 *                          la aceleración desde el área, como San Marcos 2021 (86, 12 set)
 *   graficas-xt-at         at-v (1; sub acelera o frena) v final desde a–t · forma (1; sub x–t, v–t o a–t) qué forma
 *                          tiene cada gráfica · igual-velocidad (1) misma velocidad no es encuentro · tramos-at (2) a–t
 *                          por tramos · alcance (2; sub tiempo o donde) · at-distancia (3) a–t en tres tramos desde el
 *                          reposo, como San Marcos 2022 (89) · alcance-detras (3) la combi que sale de atrás, como San
 *                          Marcos 2024-II (80) · separacion (3) la mayor separación antes del alcance
 *   caida-reposo           altura (1) h = ½gt² · caida-v (1; sub tiempo o altura) · caida-t (1) · regla (2) el tiempo
 *                          de reacción con la regla en cm · caida-kmh (2) · doble (2) más alto, ¿cuánto más tarda? ·
 *                          caida-enesimo (3) · dos-esferas (3) como San Marcos 2019-II (105) · pozo (3) con el eco
 *   caida-libre            subida (1) · altura-max (1) · velocidad-t (1) · posicion-t (2) · velocidad-y (2) ·
 *                          kmh-altura (2) · azotea (3) dos raíces · encuentro (3; sub tiempo o altura) piedra y pelota
 *                          en la misma vertical · retorno (3; sub v0 o altura) vuelve a la mano T s después
 *
 * Notación (propuesta §5 y cabecera de la unidad): sin magnitudes vectoriales; v, a y Δx son números con signo sobre un
 * eje (+ hacia la derecha o hacia arriba, con la línea del eje en `datos`). «v_0» y «a_m» con subíndice de verdad (la
 * app los muestra así). d, la distancia recorrida, en tinta. g es positiva; con el eje hacia arriba, a = −g. «·»
 * multiplica, «−» es el signo menos tipográfico y la coma, el decimal.
 * Colores: un color fijo por magnitud, el de la unidad (docs/molde-unidad.md §5b; propuesta §6): la velocidad y la
 * rapidez naranja (v, o), el tiempo turquesa (t, i), la posición, el desplazamiento y la altura violeta (x, f), la
 * aceleración y g carmín (a, h). La distancia recorrida y lo que se pide, en tinta. Sin verde. Ninguna alternativa ni
 * explicación nombra una letra de alternativa (y ninguna letra va en violeta).
 * Datos (docs/plan-calidad.md §3, punto 13): la fórmula general de cada idea (a = Δv/Δt, v = v₀ + a·t, las cuatro
 * ecuaciones del MRUV, las áreas, h = ½gt², y = v₀t − ½gt²), el eje con su signo, las equivalencias (1 km = 1000 m,
 * 1 m = 100 cm), g y el sonido «unos 340 m/s»; nunca el paso hecho, el atajo (tₛ = v₀/g, H = v₀²/2g, dₙ = v₀ + a(n − ½))
 * ni la respuesta.
 * Errores: los códigos de la unidad (cabecera de mruv-y-caida-libre.js), con el respaldo del informe de cinemática:
 * C1, G1, G3 y G4 documentados (Thornton y Sokoloff 1998; Beichner 1994); K1-a, K3, K4 y C2 parciales (Trowbridge y
 * McDermott, sin porcentaje; Carrascosa y otros 2004); U1-kmh, U2-cm, PR1 y PR1-frenado, de
 * docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md (hipótesis); los demás, hipótesis de diseño anotadas
 * en docs/investigacion/cinematica-ideas-erroneas.md («MRUV y caída libre (18 nov)»). Nuevos aquí (hipótesis, lista
 * NUEVOS en generador.test.js), con el significado en el informe de cinemática:
 * K-SIN-V0, K-INVERSA, K-RESTA-T, K-MITAD, MED-SIN-RESTA, MED-SUMA-A, U1-al-reves, U1-ms (B1) · MRUV-RESTA,
 * MRUV-SIN-CUADRADO, MRUV-RAIZ, MRUV-SIN-DOS, MRUV-SIN-V0, MRUV-SUMA-RAIZ, MRUV-POS-INICIAL, MRUV-DISTANCIA,
 * MRUV-DIF-D, MRUV-ENESIMO, MRUV-VEL-N, MRUV-ANTERIOR, MRUV-OTRO-SEG, DX-SIGNO (B2) · DX-SOLO-TRI, DX-MEDIA-V,
 * DX-TRAPECIO, MRUV-DOBLE-TRAMO, MRUV-VMAX, MRUV-MEDIA-V, G4-tiempo (B3) · AT-TRAMO, AT-TODO, AT-ALTURA, K-ALC-TIEMPO,
 * K-ALC-SIN-D, K-SEP-ALCANCE, K-SEP-TIEMPO, K-SEP-MOTO (B4) · C-IGUAL, C-CUADRADO, C-ANTERIOR, C-OTRO-SEG, C-SUMA-T,
 * C-SOLO-UNA, C-SONIDO-DOBLE, U2-cm (B5) · C-SIN-G, C-SIN-V0, C-MITAD-T, C-SOLO-G, C-VUELTA-SOLTAR, C-ENC-CAIDO,
 * C-ENC-SIN-G, C-ENC-MITAD-H, C-CUARTO (B6).
 * De todos los errores de un problema van 3 o 4, elegidos para que la correcta no quede en el centro ni en un extremo
 * (elegirErrores). Cada explicación empieza por lo que el alumno hizo bien y muestra lo que da su error.
 * La práctica no repite ninguna Predice de la unidad: ni la combi de 20 a 8 m/s en 4 s, ni la que frena con 2 m/s² a
 * 10 o 20 m/s, ni el mototaxi de 3 s a 4 m/s que retrocede 4 s a 1,5 m/s, ni el mototaxi a 10 m/s con la combi de
 * 2 m/s².
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const motor = nodo ? require('../mruv/motor.js') : (root.MotorMRUV || cargarMotor(root));
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones, motor);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;

  // La app carga un solo archivo por generador (app/practica.js). El motor vive en la escena mruv (y el service worker
  // ya lo guarda, porque es archivo de esa plantilla): se pide al mismo servidor y se ejecuta como un script en línea.
  function cargarMotor(r) {
    const doc = r.document, actual = doc && doc.currentScript;
    const url = new URL('../mruv/motor.js', actual && actual.src ? actual.src : r.location.href).href;
    const x = new XMLHttpRequest();
    x.open('GET', url, false);
    x.send(null);
    if (x.status !== 200 && x.status !== 0) throw new Error('fis-mruv: no se pudo cargar el motor del MRUV');
    const s = doc.createElement('script');
    s.text = `${x.responseText}\n//# sourceURL=${url}`;
    doc.head.appendChild(s);
    if (!r.MotorMRUV) throw new Error('fis-mruv: el motor del MRUV no se registró');
    return r.MotorMRUV;
  }
})(typeof self !== 'undefined' ? self : this, function (Azar, P, M) {
  'use strict';
  const ID = 'fis-mruv';
  const CIN = 'docs/investigacion/cinematica-ideas-erroneas.md';
  const TRA = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const G = M.G;   // 10 m/s², la del motor
  const v = P.v;
  // Miles con espacio que no se parte; coma decimal y «−» de verdad (P.formatear).
  const f = (x, d = 2) => P.formatear(x, d).replace(/ /g, ' ');
  const ms = x => `${f(x)} m/s`, ms2 = x => `${f(x)} m/s²`, sg = x => `${f(x)} s`, mt = x => `${f(x)} m`;
  const kmh = x => `${f(x)} km/h`, cm = x => `${f(x)} cm`;
  const limpio = (x, d = 2) => Number.isFinite(x) && Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-7;
  const igual = (a, b) => Math.abs(a - b) < 1e-9;
  const ORD = { 2: 'segundo', 3: 'tercer', 4: 'cuarto', 5: 'quinto', 6: 'sexto', 7: 'séptimo', 8: 'octavo', 9: 'noveno', 10: 'décimo' };

  const VARS = {
    v: { nombre: 'la velocidad', color: 'o' }, t: { nombre: 'el tiempo', color: 'i' },
    x: { nombre: 'la posición', color: 'f' }, a: { nombre: 'la aceleración', color: 'h' },
  };
  const NOMBRES_IDEA = {
    'pendiente-aceleracion': { x: 'el desplazamiento' },
    'caida-reposo': { x: 'la altura', a: 'la gravedad' },
    'caida-libre': { x: 'la altura', a: 'la gravedad' },
  };
  const V = t => v('v', t), T = t => v('t', t), X = t => v('x', t), A = t => v('a', t);

  // ---- Errores: el respaldo sale del código ----
  const RESPALDO = { C1: 'documentado', G1: 'documentado', G3: 'documentado', G4: 'documentado',
    'K1-a': 'parcial', K3: 'parcial', K4: 'parcial', C2: 'parcial' };
  const resp = id => (/^(U1|U2|PR1)\b/.test(id) ? ['hipotesis', TRA] : [RESPALDO[id] || 'hipotesis', CIN]);
  // Un error: su código, el valor que da y la explicación (recibe el texto de la alternativa).
  const e = (id, valor, explicar) => ({ id, valor, explicar });
  const et = (id, texto, explicar) => ({ id, clave: texto, texto, explicar });

  // ---- Datos que se repiten (herramientas, no el paso hecho) ----
  const D = {
    acel: 'Aceleración: a = Δv/Δt, con Δv = v − v_0',
    eje: '+ hacia la derecha y − hacia la izquierda.',
    adelante: '+ hacia adelante; v negativa: va hacia atrás.',
    kmh: '1 km = 1000 m y 1 h = 3600 s',
    media: 'Aceleración media de un tramo: a_m = Δv/Δt, con el Δv y el Δt de ese tramo',
    vt: 'Velocidad con aceleración constante: v = v_0 + a · t',
    dx: 'Desplazamiento: Δx = (v_0 + v)/2 · t',
    horaria: 'Posición: x = x_0 + v_0 · t + ½ · a · t²',
    v2: 'Velocidad y desplazamiento: v² = v_0² + 2 · a · Δx',
    enesimo: 'El n-ésimo segundo va de t = n − 1 s a t = n s.',
    pend: 'Pendiente de la gráfica v–t: a = Δv/Δt',
    area: 'Área bajo la gráfica v–t: Δx, con su signo (bajo el eje, negativa).',
    dist: 'La distancia recorrida suma las áreas sin signo.',
    fig: 'Rectángulo: base · altura. Triángulo: base · altura ÷ 2. Trapecio: (base 1 + base 2) ÷ 2 · altura.',
    graficas: 'x–t: posición contra tiempo; v–t: velocidad contra tiempo; a–t: aceleración contra tiempo.',
    incl: 'Inclinación de x–t en un instante: v. Área bajo a–t: Δv.',
    alcance: 'Se alcanzan cuando están en la misma posición a la vez.',
    separacion: 'Separación: la posición del que va adelante menos la del otro.',
    cuadratica: 'Si p · t² + q · t + r = 0: t = (−q ± √(q² − 4pr)) ÷ (2p)',
    g: 'g = 10 m/s² (convención del examen); sin aire.',
    caida: 'Desde el reposo: v = g · t, h = ½ · g · t²',
    caidaV2: 'Velocidad y lo que cayó: v² = 2 · g · h',
    abajo: 'h se mide hacia abajo, desde donde se suelta.',
    cm: '1 m = 100 cm',
    sonido: 'Sonido en el aire: unos 340 m/s, sin aceleración.',
    arriba: 'Eje hacia arriba: + al subir, − al bajar; la altura se mide desde donde sale.',
    lv: 'Velocidad: v = v_0 − g · t',
    ly: 'Altura: y = v_0 · t − ½ · g · t²',
    lv2: 'Velocidad y altura: v² = v_0² − 2 · g · y',
  };
  const DB2 = [D.vt, D.dx, D.horaria, D.v2, D.eje];
  const DB3 = [D.pend, D.area, D.dist, D.fig, D.adelante];
  const DB4 = [D.graficas, D.horaria, D.vt, D.incl];
  const DB5 = [D.g, D.caida, D.caidaV2, D.abajo];
  const DB6 = [D.g, D.arriba, D.lv, D.ly, D.lv2];

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    aceleracion: ['acel', 'velocidad', 'tiempo', 'kmh', 'izquierda', 'medias', 'velocimetro'],
    'ecuaciones-mruv': ['avance', 'frenado', 'posicion', 'v2', 'kmh-frenado', 'horaria', 'proporcion', 'enesimo'],
    'pendiente-aceleracion': ['pendiente', 'area', 'retroceso', 'tramos', 'cruza-eje', 'tren', 'area-acel'],
    'graficas-xt-at': ['at-v', 'forma', 'igual-velocidad', 'tramos-at', 'alcance', 'at-distancia', 'alcance-detras', 'separacion'],
    'caida-reposo': ['altura', 'caida-v', 'caida-t', 'regla', 'caida-kmh', 'doble', 'caida-enesimo', 'dos-esferas', 'pozo'],
    'caida-libre': ['subida', 'altura-max', 'velocidad-t', 'posicion-t', 'velocidad-y', 'kmh-altura', 'azotea', 'encuentro', 'retorno'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = {
    acel: 1, velocidad: 1, tiempo: 1, kmh: 2, izquierda: 2, medias: 3, velocimetro: 3,
    avance: 1, frenado: 1, posicion: 1, v2: 2, 'kmh-frenado': 2, horaria: 3, proporcion: 3, enesimo: 3,
    pendiente: 1, area: 1, retroceso: 2, tramos: 2, 'cruza-eje': 3, tren: 3, 'area-acel': 3,
    'at-v': 1, forma: 1, 'igual-velocidad': 1, 'tramos-at': 2, alcance: 2, 'at-distancia': 3, 'alcance-detras': 3, separacion: 3,
    altura: 1, 'caida-v': 1, 'caida-t': 1, regla: 2, 'caida-kmh': 2, doble: 2, 'caida-enesimo': 3, 'dos-esferas': 3, pozo: 3,
    subida: 1, 'altura-max': 1, 'velocidad-t': 1, 'posicion-t': 2, 'velocidad-y': 2, 'kmh-altura': 2, azotea: 3, encuentro: 3, retorno: 3,
  };

  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): las seis ideas, de menos a más, con dos preguntas de examen al final.
  const PAPEL = { 'papel-1': ['acel', 'frena'], 'papel-2': ['frenado'], 'papel-3': ['altura'],
    'papel-4': ['retroceso', 'desplazamiento'], 'papel-5': ['tramos-at'], 'papel-6': ['posicion-t'],
    'papel-7': ['horaria', 'velocidad'], 'papel-8': ['encuentro', 'tiempo'] };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && PAPEL[String(semilla)];
    let tipo, sub0;
    if (forzado) [tipo, sub0] = forzado;
    else {
      const idea = TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS);
      tipo = rng.elegir(TIPOS_POR_IDEA[idea]);
    }
    for (let intento = 0; intento < 800; intento++) {
      const pr = CONSTRUIR[tipo](rng, sub0);
      const p = pr && cerrar(rng, semilla, tipo, pr);
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  // Qué errores van: de todos los posibles, 4 (o 3) con los que la correcta no es la más parecida a las demás ni, si es
  // un número, la mayor o la menor (probarFugas, nucleo/probar-generador.js).
  const trozos = t => String(t).replace(/[()]/g, ' ').split(/[\s;,]+|(?=[+−\-·/])|(?<=[+−\-·/])/).filter(Boolean);
  const distancia = (a, b) => { const X1 = trozos(a), X2 = trozos(b); let d = 0; for (let i = 0; i < Math.max(X1.length, X2.length); i++) if (X1[i] !== X2[i]) d++; return d; };
  function subconjuntos(l, k) {
    if (k === 0) return [[]];
    const r = [];
    for (let i = 0; i <= l.length - k; i++) for (const resto of subconjuntos(l.slice(i + 1), k - 1)) r.push([l[i], ...resto]);
    return r;
  }
  function elegirErrores(rng, correcta, errores, numero) {
    const vistos = new Set([correcta.texto]), pool = [];
    for (const x of rng.barajar(errores)) if (!vistos.has(x.texto)) { vistos.add(x.texto); pool.push(x); }
    const bueno = sub => {
      const al = [correcta, ...sub], sc = al.map(a => al.reduce((t, b) => t + distancia(a.texto, b.texto), 0));
      const min = Math.min(...sc);
      if (sc[0] === min && sc.filter(x => x === min).length === 1) return false;
      if (numero) { const vs = al.map(a => a.valor); if (correcta.valor === Math.max(...vs) || correcta.valor === Math.min(...vs)) return false; }
      return true;
    };
    for (const k of [4, 3]) for (const sub of subconjuntos(pool, Math.min(k, pool.length))) if (sub.length >= 3 && bueno(sub)) return sub;
    return pool.slice(0, 4);
  }

  // Arma las alternativas y el problema. Variables: solo las que se usan.
  function cerrar(rng, semilla, tipo, o) {
    let alternativas, respuesta;
    const conRespaldo = x => { const [respaldo, fuente] = resp(x.id); return Object.assign({}, x, { explicacion: x.explicar(x.texto), respaldo, fuente }); };
    if (typeof o.correcta === 'string') {
      const errores = elegirErrores(rng, { texto: o.correcta }, o.errores.filter(Boolean).map(conRespaldo), false);
      alternativas = P.armarTexto({ correcta: { clave: o.correcta, texto: o.correcta }, errores, rng });
      respuesta = { valor: o.correcta, texto: o.correcta, unidad: '' };
    } else {
      const ok = o.fmt(o.correcta);
      const validos = o.errores.filter(x => x && Number.isFinite(x.valor) && !igual(x.valor, o.correcta) && (o.negativos || x.valor > 0)
        && P.enEscala(x.valor, o.correcta, x.id) && Math.abs(x.valor - o.correcta) >= 0.02 * Math.abs(o.correcta)).map(x => conRespaldo(Object.assign({}, x, { texto: o.fmt(x.valor) }))).filter(x => x.texto !== ok);
      const errores = elegirErrores(rng, { texto: ok, valor: o.correcta }, validos, true);
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.fmt, negativos: true });
      respuesta = { valor: o.correcta, unidad: o.unidad || '' };
    }
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const nombres = Object.assign({}, NOMBRES_IDEA[IDEA_DE[tipo]], o.nombres);
    const variables = Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k], nombres[k] ? { nombre: nombres[k] } : {})]));
    return {
      id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas, solucion: o.solucion, respuesta,
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }

  // ======================= Idea B1: la aceleración =======================

  function acel(rng, forzado) {
    const sub = forzado || rng.elegir(['acelera', 'frena']);
    const dt = rng.entero(2, 8), aa = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 4]);
    let v0, v1;
    if (sub === 'acelera') { v0 = rng.elegir([0, 0, 2, 3, 4, 5, 6, 8]); v1 = v0 + aa * dt; } else { v1 = rng.entero(1, 8); v0 = v1 + aa * dt; }
    if (!Number.isInteger(v0) || !Number.isInteger(v1) || v0 > 30 || v1 > 30) return null;
    if (sub === 'frena' && v0 === 20 && v1 === 8 && dt === 4) return null;   // la predicción de la idea 1
    const a = M.pendiente(0, v0, dt, v1), dv = v1 - v0;
    const enunciado = sub === 'frena'
      ? ['Una combi va a ', V(ms(v0)), ' hacia la derecha y frena parejo: ', T(sg(dt)), ' después va a ', V(ms(v1)), ', todavía hacia la derecha.']
      : v0 === 0 ? ['Una combi arranca del paradero y acelera parejo: a los ', T(sg(dt)), ' va a ', V(ms(v1)), '.']
        : ['Una combi pasa por el grifo a ', V(ms(v0)), ' y acelera parejo: ', T(sg(dt)), ' después va a ', V(ms(v1)), '.'];
    return {
      enunciado, pregunta: ['¿Cuánto vale su aceleración, con su signo?'],
      datos: [D.acel, D.eje], correcta: a, fmt: ms2, negativos: true,
      errores: [
        v0 !== 0 && e('K4', v1 / dt, t => `Bien que dividas entre ${dt} s. Pero a usa el cambio de velocidad, ${v1} − ${v0}, no solo ${v1}; así sale ${t}.`),
        e('K-SINDIV', dv, t => `Bien el cambio de velocidad, ${f(dv)} m/s. Pero ocurrió en ${dt} s: falta dividir entre el tiempo; ${t} no es.`),
        e('K-POR', dv * dt, t => `Bien el cambio de velocidad, ${f(dv)} m/s. Pero se divide entre el tiempo, no se multiplica; así sale ${t}.`),
        e('K-CUADRADO', dv / (dt * dt), t => `Bien el cambio de velocidad. Pero se divide entre ${dt} s, sin elevarlo al cuadrado; así sale ${t}.`),
        v0 !== 0 && e('K-SUMA', (v1 + v0) / dt, t => `Bien que dividas entre el tiempo. Pero el cambio es la final menos la inicial, no la suma; así sale ${t}.`),
        sub === 'frena'
          ? e('K3', -a, t => `Bien: pierde ${f(-a)} m/s cada segundo. Pero la velocidad baja: a apunta al revés que v y es negativa; ${t} apunta hacia donde se mueve.`)
          : e('K-SIGNO', -a, t => `Bien el valor, ${f(a)}. Pero la velocidad sube yendo hacia la derecha: a es positiva; ${t} tiene el signo al revés.`),
      ],
      solucion: [
        ['El cambio de velocidad: ', V(`${v1} − ${v0} = ${f(dv)} m/s`), ', en ', T(sg(dt)), '.'],
        ['a = ', V(f(dv)), ' ÷ ', T(f(dt)), ' = ', A(ms2(a)), sub === 'frena' ? ': negativa, porque frena yendo hacia el +.' : '.'],
      ],
      _datos: { sub, v0, v1, dt },
    };
  }

  function velocidad(rng) {
    const v0 = rng.entero(2, 14), a = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, -0.5, -1, -1.5, -2]), t = rng.entero(2, 8);
    const m = M.movil({ v0, a, frena: true }), vf = m.v(t);
    if (!(v0 + a * t > 0) || !limpio(vf, 1)) return null;
    const frena = a < 0;
    return {
      enunciado: ['Una combi pasa por el grifo a ', V(ms(v0)), ` y ${frena ? 'frena' : 'acelera'} parejo con `, A(`a = ${f(a)} m/s²`), '.'],
      pregunta: ['¿Qué velocidad tiene ', T(sg(t)), ' después?'],
      datos: [D.vt, D.eje], correcta: vf, fmt: ms,
      errores: [
        e('K-TIEMPO', v0 + a, t2 => `Bien que partas de ${v0} m/s y uses a. Pero ${t2} es la velocidad después de un solo segundo; ${t - 1 === 1 ? 'falta 1 s más' : `faltan ${t - 1} s más`}.`),
        e('K-CUADRADO', v0 + a * t * t, t2 => `Bien que partas de ${v0} m/s. Pero v cambia ${f(Math.abs(a))} m/s por segundo: a · t, sin elevar t; así sale ${t2}.`),
        e('K-SIGNO', v0 - a * t, t2 => `Bien el cambio, ${f(Math.abs(a * t))} m/s. Pero ${frena ? 'frena: se resta' : 'acelera: se suma'}; con el signo al revés sale ${t2}.`),
        e('K-SIN-V0', a * t, t2 => `Bien a · t = ${f(a * t)} m/s: lo que cambió. Pero se suma a los ${v0} m/s con que pasó por el grifo; ${t2} es solo el cambio.`),
      ],
      solucion: [
        ['En ', T(sg(t)), ` cambia `, A(f(a)), ' · ', T(f(t)), ` = ${f(a * t)} m/s.`],
        ['v = ', V(f(v0)), ` ${a < 0 ? '−' : '+'} ${f(Math.abs(a * t))} = `, V(ms(vf)), '.'],
      ],
      _datos: { v0, a, t },
    };
  }

  function tiempo(rng) {
    const v0 = rng.elegir([0, 0, 2, 3, 4, 5, 6]), a = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 4]), dt = rng.entero(2, 10);
    const v1 = v0 + a * dt;
    if (!Number.isInteger(v1) || v1 > 30) return null;
    const res = (v1 - v0) / M.pendiente(0, v0, dt, v1);   // el motor da la pendiente; el tiempo, al despejar
    const dv = v1 - v0;
    return {
      enunciado: v0 === 0 ? ['Una combi arranca del paradero con ', A(`a = ${f(a)} m/s²`), '.'] : ['Una combi pasa por el grifo a ', V(ms(v0)), ' y acelera con ', A(`a = ${f(a)} m/s²`), '.'],
      pregunta: ['¿Cuánto tarda en llegar a ', V(ms(v1)), '?'],
      datos: [D.acel, D.eje], correcta: res, fmt: sg,
      errores: [
        v0 > 0 && e('K4', v1 / a, t => `Bien que dividas entre a. Pero la combi no parte de 0: tiene que ganar ${v1} − ${v0} = ${dv} m/s; ${t} cuenta los ${v1} enteros.`),
        e('K-POR', dv * a, t => `Bien el cambio, ${dv} m/s. Pero gana ${f(a)} m/s cada segundo: se divide entre a, no se multiplica; así sale ${t}.`),
        e('K-INVERSA', a / dv, t => `Bien el cambio, ${dv} m/s, y a. Pero el tiempo es el cambio entre a, no al revés; así sale ${t}.`),
        v0 > 0 ? e('K-SUMA', (v1 + v0) / a, t => `Bien que dividas entre a. Pero lo que gana es ${v1} − ${v0}, no la suma; así sale ${t}.`)
          : e('K-SINDIV', dv, t => `Bien el cambio, ${dv} m/s. Pero gana ${f(a)} m/s cada segundo: falta dividir entre a; ${t} no es.`),
      ],
      solucion: [['Tiene que ganar ', V(`${v1} − ${v0} = ${dv} m/s`), ' y gana ', A(f(a)), ' m/s cada segundo.'], ['Δt = ', V(f(dv)), ' ÷ ', A(f(a)), ' = ', T(sg(res)), '.']],
      _datos: { v0, a, dt },
    };
  }

  const KMH = [18, 36, 54, 72, 90, 108];
  function kmhB1(rng, forzado) {
    const sub = forzado || rng.elegir(['arranca', 'frena']);
    const dt = rng.entero(2, 10);
    let k0, k1;
    if (sub === 'arranca') { k0 = 0; k1 = rng.elegir(KMH.slice(1)); } else { k0 = rng.elegir(KMH.slice(1)); k1 = rng.elegir(KMH.filter(k => k < k0)); }
    const v0 = k0 / 3.6, v1 = k1 / 3.6, a = M.pendiente(0, v0, dt, v1), dv = v1 - v0;
    if (!limpio(a)) return null;
    if (k0 === 0 && k1 === 54 && dt === 5) return null;   // un ejemplo de la unidad
    return {
      enunciado: sub === 'arranca' ? ['Una combi arranca del paradero y, ', T(sg(dt)), ' después, su velocímetro marca ', V(kmh(k1)), '.']
        : ['Una combi va a ', V(kmh(k0)), ' hacia la derecha y frena parejo: ', T(sg(dt)), ' después va a ', V(kmh(k1)), '.'],
      pregunta: ['¿Cuánto vale su aceleración, en m/s²?'],
      datos: [D.acel, D.kmh, D.eje], correcta: a, fmt: ms2, negativos: true,
      errores: [
        e('U1-kmh', (k1 - k0) / dt, t => `Bien el cambio entre el tiempo. Pero en km/h: falta pasar a m/s; así sale ${t}.`),
        e('U1-al-reves', (k1 - k0) * 3.6 / dt, t => `Bien que conviertas los km/h. Pero a m/s se divide entre 3,6, no se multiplica; así sale ${t}.`),
        sub === 'frena' && e('K4', v1 / dt, t => `Bien los m/s y el tiempo. Pero a usa el cambio, ${f(v1)} − ${f(v0)}, no solo la final; así sale ${t}.`),
        e('K-SINDIV', dv, t => `Bien el cambio en m/s, ${f(dv)}. Pero ocurrió en ${dt} s: falta dividir; ${t} no es.`),
        sub === 'frena' ? e('K3', -a, t => `Bien el valor en m/s². Pero la combi frena yendo hacia el +: a es negativa; ${t} apunta hacia donde se mueve.`)
          : e('K-SIGNO', -a, t => `Bien el valor en m/s². Pero la velocidad sube yendo hacia el +: a es positiva; ${t} tiene el signo al revés.`),
      ],
      solucion: [
        sub === 'arranca' ? ['En m/s: ', V(`${k1} km/h = ${k1} 000 m ÷ 3600 s = ${f(v1)} m/s`), '.'] : ['En m/s: ', V(`${k0} km/h = ${f(v0)} m/s`), ' y ', V(`${k1} km/h = ${f(v1)} m/s`), '.'],
        ['a = (', V(`${f(v1)} − ${f(v0)}`), ') ÷ ', T(f(dt)), ' = ', A(ms2(a)), '.'],
      ],
      _datos: { sub, k0, k1, dt },
    };
  }

  function izquierda(rng, forzado) {
    const sub = forzado || rng.elegir(['frena', 'acelera']);
    const dt = rng.entero(2, 6), aa = rng.elegir([1, 1.5, 2, 2.5, 3, 4]);
    let S0, S1;
    if (sub === 'frena') { S1 = rng.entero(2, 12); S0 = S1 + aa * dt; } else { S0 = rng.entero(2, 12); S1 = S0 + aa * dt; }
    if (!Number.isInteger(S0) || !Number.isInteger(S1) || Math.max(S0, S1) > 30) return null;
    const v0 = -S0, v1 = -S1, a = M.pendiente(0, v0, dt, v1), dv = v1 - v0;
    return {
      enunciado: ['Una combi pasa por el paradero hacia la izquierda a ', V(ms(S0)), ` y ${sub} parejo: `, T(sg(dt)), ' después va a ', V(ms(S1)), ', todavía hacia la izquierda.'],
      pregunta: ['¿Cuánto vale su aceleración, con su signo?'],
      datos: [D.acel, D.eje], correcta: a, fmt: ms2, negativos: true,
      errores: [
        sub === 'frena' ? e('K3', -a, t => `Bien el valor, ${f(a)}. Pero frena: a apunta al revés que v, hacia el +; ${t} apunta hacia donde se mueve.`)
          : e('K-SIGNO', -a, t => `Bien el valor, ${f(-a)}. Pero las velocidades son −${S0} y −${S1}: el cambio es negativo; con las rapideces sale ${t}.`),
        e('K4', v1 / dt, t => `Bien que dividas entre ${dt} s. Pero a usa el cambio, (−${S1}) − (−${S0}), no solo la final; así sale ${t}.`),
        e('K-SUMA', (v1 + v0) / dt, t => `Bien los signos de las dos velocidades. Pero el cambio es la final menos la inicial; sumarlas da ${t}.`),
        e('K-SINDIV', dv, t => `Bien el cambio con su signo, ${f(dv)} m/s. Pero ocurrió en ${dt} s: falta dividir; ${t} no es.`),
      ],
      solucion: [
        ['Hacia la izquierda las velocidades son negativas: ', V(`v_0 = −${S0} m/s`), ' y ', V(`v = −${S1} m/s`), '.'],
        ['a = (', V(`−${S1} − (−${S0})`), ') ÷ ', T(f(dt)), ' = ', A(ms2(a)), sub === 'frena' ? ': positiva, porque frena yendo hacia el −.' : ': negativa, como v, porque acelera.'],
      ],
      _datos: { sub, S0, S1, dt },
    };
  }

  function medias(rng, forzado) {
    const sub = forzado || rng.elegir(['tramo2', 'total']);
    const k1 = rng.elegir([18, 36, 54, 72]), k2 = rng.elegir(KMH.filter(k => k > k1));
    const t1 = rng.entero(2, 8), t2 = rng.entero(2, 8);
    if (t1 === t2) return null;   // con tramos iguales, promediar daría bien
    const v1 = k1 / 3.6, v2 = k2 / 3.6;
    const m = M.movil({ v0: 0, tramos: [{ dur: t1, a: v1 / t1 }, { dur: t2, a: (v2 - v1) / t2 }] });
    const a1 = M.pendiente(0, 0, t1, m.v(t1)), a2 = M.pendiente(t1, m.v(t1), t1 + t2, m.v(t1 + t2)), aT = M.pendiente(0, 0, t1 + t2, m.v(t1 + t2));
    const ok = sub === 'tramo2' ? a2 : aT;
    if (!limpio(a1) || !limpio(a2) || !limpio(aT)) return null;
    const errores = sub === 'tramo2' ? [
      e('K4', v2 / (t1 + t2), t => `Bien los m/s. Pero el segundo tramo empieza en ${f(v1)} m/s a los ${t1} s: dividir la final entre el tiempo total da ${t}.`),
      e('MED-SIN-RESTA', v2 / t2, t => `Bien los ${t2} s del segundo tramo. Pero su cambio es ${f(v2)} − ${f(v1)}, no solo la final; así sale ${t}.`),
      e('MED-TRAMO', a1, t => `Bien la aceleración media del primer tramo, ${t}. Pero piden la del segundo, de ${f(v1)} a ${f(v2)} m/s.`),
      e('U1-kmh', (k2 - k1) / t2, t => `Bien el cambio del segundo tramo entre su tiempo. Pero en km/h: falta pasar a m/s; así sale ${t}.`),
    ] : [
      e('MED-PROMEDIO-A', (a1 + a2) / 2, t => `Bien las dos aceleraciones, ${f(a1)} y ${f(a2)}. Pero no se promedian: los tramos duran distinto; así sale ${t}.`),
      e('MED-SUMA-A', a1 + a2, t => `Bien las dos aceleraciones. Pero no se suman: se mira el cambio de todo el viaje entre todo el tiempo; sumarlas da ${t}.`),
      e('MED-TRAMO', a2, t => `Bien la aceleración del segundo tramo, ${t}. Pero piden la media de los ${t1 + t2} s.`),
      e('U1-kmh', k2 / (t1 + t2), t => `Bien el cambio de todo el viaje entre el tiempo total. Pero en km/h: falta pasar a m/s; así sale ${t}.`),
    ];
    return {
      enunciado: ['Una moto arranca del reposo. A los ', T(sg(t1)), ' va a ', V(kmh(k1)), ' y, ', T(sg(t2)), ' después, a ', V(kmh(k2)), '.'],
      pregunta: [sub === 'tramo2' ? '¿Cuál es su aceleración media en el segundo tramo, en m/s²?' : '¿Cuál es su aceleración media en todo el viaje, en m/s²?'],
      datos: [D.media, D.kmh], correcta: ok, fmt: ms2, errores,
      solucion: [
        ['En m/s: ', V(`${k1} km/h = ${f(v1)} m/s`), ' y ', V(`${k2} km/h = ${f(v2)} m/s`), '.'],
        sub === 'tramo2' ? ['a_m = (', V(`${f(v2)} − ${f(v1)}`), ') ÷ ', T(f(t2)), ' = ', A(ms2(a2)), '.']
          : ['a_m = (', V(`${f(v2)} − 0`), ') ÷ ', T(`${t1 + t2}`), ' = ', A(ms2(aT)), '.'],
      ],
      _datos: { sub, k1, k2, t1, t2 },
    };
  }

  function velocimetro(rng) {
    const K = rng.elegir([54, 72, 90, 108]), Tt = rng.entero(5, 12), t = rng.entero(2, Tt - 1);
    const m = M.movil({ v0: 0, a: K / 3.6 / Tt }), vt = m.v(t) * 3.6;
    if (!limpio(vt) || !limpio(K / 3.6 / Tt) || !limpio(vt / 3.6) || 2 * t === Tt || (K === 90 && Tt === 10 && t === 4)) return null;
    return {
      enunciado: ['En la carretera, una combi arranca del paradero y, acelerando parejo, llega a ', V(kmh(K)), ' en ', T(sg(Tt)), '.'],
      pregunta: ['¿Qué marcaba su velocímetro, en km/h, a los ', T(sg(t)), '?'],
      datos: [D.acel, D.vt, D.kmh], correcta: vt, fmt: kmh,
      errores: [
        e('K-RESTA-T', K * (Tt - t) / Tt, x => `Bien que la velocidad crezca parejo. Pero a los ${t} s ya ganó su parte; ${x} es lo que le faltaba ganar.`),
        e('K-CUADRADO', K * t * t / (Tt * Tt), x => `Bien partir de 0 y llegar a ${K} km/h. Pero v crece igual cada segundo, sin elevar t al cuadrado; así sale ${x}.`),
        e('U1-ms', vt / 3.6, x => `Bien la cuenta en m/s. Pero piden km/h: falta multiplicar por 3,6; ${x} es el número en m/s.`),
        e('K-MITAD', K / 2, x => `Bien que vaya más lento que ${K} km/h. Pero la mitad sería a los ${f(Tt / 2)} s, no a los ${t} s; ${x} no es.`),
      ],
      solucion: [
        ['a = ', V(`${K} km/h = ${f(K / 3.6)} m/s`), ' ÷ ', T(f(Tt)), ` = ${f(K / 3.6 / Tt)} m/s².`],
        ['A los ', T(sg(t)), `: v = ${f(K / 3.6 / Tt)} · ${t} = ${f(vt / 3.6)} m/s = `, V(kmh(vt)), '.'],
      ],
      _datos: { K, T: Tt, t },
    };
  }

  // ======================= Idea B2: las ecuaciones del MRUV =======================

  function avance(rng) {
    const v0 = rng.entero(2, 10), v1 = v0 + rng.entero(2, 16), t = rng.entero(2, 8);
    const a = (v1 - v0) / t, dx = M.movil({ v0, a }).desplazamiento(0, t);
    if (!limpio(dx, 1) || !limpio(a)) return null;
    return {
      enunciado: ['Una combi pasa por el paradero a ', V(ms(v0)), ' y acelera parejo: ', T(sg(t)), ' después va a ', V(ms(v1)), '.'],
      pregunta: ['¿Cuántos metros avanzó en ese tiempo?'],
      datos: DB2, correcta: dx, fmt: mt,
      errores: [
        e('DX-RECT', v1 * t, x => `Bien que multipliques por ${t} s. Pero no fue a ${v1} m/s todo el tiempo; así sale ${x}.`),
        e('DX-INICIAL', v0 * t, x => `Bien que multipliques por ${t} s. Pero su velocidad cambió desde ${v0} m/s; así sale ${x}.`),
        e('DX-SEMI', (v0 + v1) * t, x => `Bien la suma de las velocidades. Pero la media es la mitad de esa suma; sin dividir sale ${x}.`),
        e('MRUV-RESTA', (v1 - v0) / 2 * t, x => `Bien la media entre dos y por ${t} s. Pero la media suma las velocidades, no las resta; así sale ${x}.`),
        e('MRUV-ACEL', a, x => `Bien a = ${f(a)} m/s². Pero ese número es cuánto cambia v por segundo, no lo que avanzó: ${x} no es.`),
      ],
      solucion: [
        ['Velocidad media: (', V(`${v0} + ${v1}`), `) ÷ 2 = ${f((v0 + v1) / 2)} m/s.`],
        ['Δx = ', V(f((v0 + v1) / 2)), ' · ', T(f(t)), ' = ', X(mt(dx)), '.'],
      ],
      _datos: { v0, v1, t },
    };
  }

  const VEHICULOS = [['Frente al colegio, una combi', 'la combi'], ['En la carretera, un auto', 'el auto'], ['En la avenida, un mototaxi', 'el mototaxi']];
  function frenado(rng) {
    const [quien] = rng.elegir(VEHICULOS);
    const v0 = rng.entero(6, 30), Af = rng.elegir([1, 1.5, 2, 2.5, 3, 4, 5, 6]);
    if (quien.includes('mototaxi') && v0 > 15) return null;
    if (Af === 2 && (v0 === 10 || v0 === 20)) return null;   // la predicción de la idea 2
    const m = M.movil({ v0, a: -Af, frena: true }), ts = m.tParada, d = m.distancia(0, ts + 5);
    if (!limpio(d, 1) || !limpio(ts, 1) || d > 300) return null;
    return {
      enunciado: [`${quien} va a `, V(ms(v0)), ' y frena parejo con ', A(`a = −${f(Af)} m/s²`), ' hasta detenerse.'],
      pregunta: ['¿Cuántos metros recorre mientras frena?'],
      datos: DB2, correcta: d, fmt: mt, negativos: true,
      errores: [
        e('MRUV-VT', v0 * ts, x => `Bien los ${f(ts)} s de frenado. Pero no va a ${v0} m/s todo el tiempo: su media es ${f(v0 / 2)}; así sale ${x}.`),
        e('MRUV-TIEMPO', ts, x => `Bien: tarda ${f(ts)} s en parar. Pero piden metros, no segundos; ${x} no es.`),
        e('MRUV-SIGNO-D', -d, x => `Bien el valor. Pero avanza hacia adelante: Δx es positivo; la negativa es a. ${x} no es.`),
        e('PR1', v0 / (2 * Af), x => `Bien la ecuación sin tiempo. Pero la velocidad va al cuadrado: ${v0}², no ${v0}; así sale ${x}.`),
      ],
      solucion: [
        ['Al detenerse, v = 0: ', '0 = ', V(`${v0}²`), ' + 2 · (', A(`−${f(Af)}`), ') · Δx.'],
        ['Δx = ', `${v0 * v0} ÷ ${f(2 * Af)} = `, X(mt(d)), '.'],
      ],
      _datos: { v0, A: Af },
    };
  }

  function posicion(rng) {
    const x0 = rng.elegir([0, 10, 15, 20, 25, 30, 40, 50]), v0 = rng.entero(1, 8), a = rng.elegir([0.5, 1, 2, 3]), t = rng.entero(2, 8);
    const x = M.movil({ x0, v0, a }).x(t);
    if (!limpio(x, 1)) return null;
    return {
      enunciado: x0 ? ['El grifo está ', X(mt(x0)), ' delante del paradero. Una combi pasa por el grifo a ', V(ms(v0)), ' y acelera con ', A(`a = ${f(a)} m/s²`), '.']
        : ['Una combi pasa por el paradero a ', V(ms(v0)), ' y acelera con ', A(`a = ${f(a)} m/s²`), '.'],
      pregunta: ['¿A cuántos metros del paradero está ', T(sg(t)), ' después?'],
      datos: DB2, correcta: x, fmt: mt,
      errores: [
        x0 && e('MRU-X0', x - x0, y => `Bien lo que avanzó desde el grifo, ${y}. Pero el grifo ya estaba a ${x0} m del paradero.`),
        e('MRUV-MEDIO', x0 + v0 * t + a * t * t, y => `Bien que partas ${x0 ? 'del grifo' : 'del paradero'}. Pero el término de a lleva un ½; sin él sale ${y}.`),
        e('MRUV-SIN-A', x0 + v0 * t, y => `Bien ${x0 ? `${x0} + ` : ''}${v0} · ${t}. Pero eso sería sin acelerar: falta ½ · a · t²; así sale ${y}.`),
        e('MRUV-SIN-CUADRADO', x0 + v0 * t + a * t / 2, y => `Bien el ½ · a. Pero el tiempo va al cuadrado en ½ · a · t²; sin elevarlo sale ${y}.`),
      ],
      solucion: [
        ['x = ', X(f(x0)), ' + ', V(f(v0)), ' · ', T(f(t)), ' + ½ · ', A(f(a)), ' · ', T(`${t}²`), '.'],
        [`x = ${f(x0)} + ${f(v0 * t)} + ${f(a * t * t / 2)} = `, X(mt(x)), '.'],
      ],
      _datos: { x0, v0, a, t },
    };
  }

  function v2(rng) {
    const v0 = rng.entero(0, 10), vf = v0 + rng.entero(2, 14), a = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 4]);
    const dx = (vf * vf - v0 * v0) / (2 * a);
    if (!Number.isInteger(dx) || dx > 200 || dx < 5 || (v0 === 5 && a === 2 && dx === 36)) return null;
    // El motor: el instante en que llega (Δt de v = v₀ + a·t) y su velocidad ahí, que debe estar en x = Δx.
    const m = M.movil({ v0, a }), tl = (vf - v0) / a;
    if (Math.abs(m.x(tl) - dx) > 1e-9) return null;
    const ok = m.v(tl);
    return {
      enunciado: [v0 ? 'Una combi pasa por el paradero a ' : 'Una combi arranca del paradero', ...(v0 ? [V(ms(v0))] : []), ' y acelera con ', A(`a = ${f(a)} m/s²`), '.'],
      pregunta: ['¿Qué velocidad lleva al llegar al grifo, ', X(mt(dx)), ' más adelante?'],
      datos: DB2, correcta: ok, fmt: ms,
      errores: [
        e('MRUV-RAIZ', vf * vf, x => `Bien v_0² + 2 · a · Δx = ${vf * vf}. Pero eso es v²: falta sacar la raíz; ${x} no es.`),
        e('MRUV-SIN-DOS', Math.sqrt(v0 * v0 + a * dx), x => `Bien la ecuación sin tiempo y la raíz. Pero lleva 2 · a · Δx; sin el 2 sale ${x}.`),
        v0 && e('MRUV-SIN-V0', Math.sqrt(2 * a * dx), x => `Bien 2 · a · Δx y la raíz. Pero falta v_0² = ${v0 * v0}: no arranca quieta; así sale ${x}.`),
        v0 && e('MRUV-SUMA-RAIZ', v0 + Math.sqrt(2 * a * dx), x => `Bien v_0 y 2 · a · Δx. Pero la raíz va sobre la suma de v_0² y 2aΔx; separadas dan ${x}.`),
      ],
      solucion: [
        ['v² = ', V(`${v0}²`), ' + 2 · ', A(f(a)), ' · ', X(f(dx)), ` = ${v0 * v0} + ${f(2 * a * dx)} = ${vf * vf}.`],
        ['v = √', String(vf * vf), ' = ', V(ms(ok)), '.'],
      ],
      _datos: { v0, a, dx },
    };
  }

  function kmhFrenado(rng) {
    const [quien] = rng.elegir(VEHICULOS.slice(0, 2));
    const k0 = rng.elegir([36, 54, 72, 90, 108]), Af = rng.elegir([2, 2.5, 4, 5, 6, 8]);
    if ((k0 === 54 && Af === 2.5) || (k0 === 72 && Af === 5)) return null;   // ejemplos de la unidad
    const v0 = k0 / 3.6, m = M.movil({ v0, a: -Af, frena: true }), ts = m.tParada, d = m.distancia(0, ts + 5);
    if (!limpio(d, 2) || d > 300) return null;
    return {
      enunciado: [`${quien} va a `, V(kmh(k0)), ' cuando un perro cruza; frena parejo con ', A(`a = −${f(Af)} m/s²`), ' hasta detenerse.'],
      pregunta: ['¿Cuántos metros recorre mientras frena?'],
      datos: [...DB2, D.kmh], correcta: d, fmt: mt, negativos: true,
      errores: [
        e('U1-kmh', k0 * k0 / (2 * Af), x => `Bien la ecuación sin tiempo. Pero con los km/h: falta pasar a m/s; así sale ${x}.`),
        e('MRUV-VT', v0 * ts, x => `Bien los ${f(v0)} m/s y los ${f(ts)} s de frenado. Pero su media es la mitad de ${f(v0)}; así sale ${x}.`),
        e('MRUV-TIEMPO', ts, x => `Bien: tarda ${f(ts)} s en parar. Pero piden metros, no segundos; ${x} no es.`),
        e('MRUV-SIGNO-D', -d, x => `Bien el valor. Pero avanza hacia adelante: Δx es positivo; la negativa es a. ${x} no es.`),
        e('PR1', v0 / (2 * Af), x => `Bien pasar a ${f(v0)} m/s. Pero la velocidad va al cuadrado en v² = v_0² + 2aΔx; así sale ${x}.`),
      ],
      solucion: [
        ['En m/s: ', V(`${k0} km/h = ${f(v0)} m/s`), '.'],
        ['0 = ', V(`${f(v0)}²`), ' + 2 · (', A(`−${f(Af)}`), ') · Δx, así que Δx = ', `${f(v0 * v0)} ÷ ${f(2 * Af)} = `, X(mt(d)), '.'],
      ],
      _datos: { k0, A: Af },
    };
  }

  // x = A + Bt ± Ct² escrita con sus colores: x violeta y t turquesa; los números, en tinta.
  const ecuacionX = (A0, B, C, s) => [X('x'), ` = ${A0 ? `${A0} + ` : ''}${B}`, T('t'), ` ${s < 0 ? '−' : '+'} ${C === 1 ? '' : C}`, T('t²')];
  function horaria(rng, forzado) {
    const sub = forzado || rng.elegir(['velocidad', 'desplazamiento']);
    const A0 = rng.entero(0, 12), B = rng.entero(2, 12), C = rng.elegir([1, 1, 2, 3]), s = rng.elegir([1, -1]);
    const m = M.movil({ x0: A0, v0: B, a: 2 * s * C });   // un carrito en un riel: sube, se detiene y baja (sin freno)
    const X0 = tt => A0 + B * tt + s * C * tt * tt;
    const enunciado = ['Un carrito se mueve sobre un riel recto. Su posición es ', ...ecuacionX(A0, B, C, s), ', con x en metros y t en segundos.'];
    if (sub === 'velocidad') {
      const t = rng.entero(1, 5), ok = m.v(t);
      if (ok === 0 || (A0 === 4 && B === 6 && C === 1 && s < 0 && t === 2)) return null;
      return {
        enunciado, pregunta: ['¿Qué velocidad tiene en ', T(`t = ${sg(t)}`), '?'],
        datos: [D.horaria, D.vt, D.eje], correcta: ok, fmt: ms, negativos: true,
        errores: [
          e('MRUV-MEDIO-A', B + s * C * t, x => `Bien la idea de v = v_0 + a · t, con v_0 = ${B}. Pero el ${s < 0 ? '−' : ''}${C} que acompaña a t² es ½ · a: a = ${s < 0 ? '−' : ''}${2 * C} m/s²; así sale ${x}.`),
          e('MRUV-POSICION', X0(t), x => `Bien reemplazar t = ${t}. Pero ${x} es el valor de x a ese instante: una posición, no una velocidad.`),
          e('MRUV-SIN-V0', 2 * s * C * t, x => `Bien a = ${s < 0 ? '−' : ''}${2 * C} m/s². Pero el carrito ya iba a ${B} m/s en t = 0; sin v_0 sale ${x}.`),
          e('K-SIGNO', B - 2 * s * C * t, x => `Bien v_0 = ${B} y |a| = ${2 * C}. Pero el término de t² ${s < 0 ? 'resta: a es negativa' : 'suma: a es positiva'}; así sale ${x}.`),
        ],
        solucion: [
          ['Se compara con x = x_0 + v_0 · t + ½ · a · t²: ', V(`v_0 = ${B} m/s`), ' y ½ · a = ', `${s < 0 ? '−' : ''}${C}`, ', así que ', A(`a = ${s < 0 ? '−' : ''}${2 * C} m/s²`), '.'],
          ['v = ', V(f(B)), ` ${s < 0 ? '−' : '+'} ${2 * C} · `, T(f(t)), ' = ', V(ms(ok)), '.'],
        ],
        _datos: { sub, A: A0, B, C, s, t },
      };
    }
    const t1 = rng.entero(0, 3), t2 = t1 + rng.entero(2, 4);
    const ok = m.desplazamiento(t1, t2), d = m.distancia(t1, t2);
    if (ok === 0 || (A0 === 4 && B === 6 && C === 1 && s < 0 && t1 === 1 && t2 === 4)) return null;
    return {
      enunciado, pregunta: ['¿Cuál es su desplazamiento entre ', T(`t = ${t1} s`), ' y ', T(`t = ${t2} s`), '?'],
      datos: [D.horaria, 'Desplazamiento: Δx = x final − x inicial', D.eje], correcta: ok, fmt: mt, negativos: true,
      errores: [
        e('MRUV-POSICION-FINAL', X0(t2), x => `Bien x a los ${t2} s, ${x}. Pero esa es su posición; el desplazamiento resta la de los ${t1} s.`),
        t1 > 0 && e('MRUV-DESDE-0', X0(t2) - A0, x => `Bien la resta. Pero desde t = ${t1} s, no desde t = 0; así sale ${x}.`),
        e('MRUV-POS-INICIAL', X0(t1), x => `Bien x a los ${t1} s, ${x}. Pero esa es la posición inicial; falta restarla de la final.`),
        d - Math.abs(ok) > 1e-9 && e('MRUV-DISTANCIA', d, x => `Bien que cuentes lo que se movió. Pero el carrito da la vuelta: ${x} es la distancia recorrida, no el desplazamiento.`),
        e('DX-SIGNO', -ok, x => `Bien las dos posiciones. Pero Δx es la final menos la inicial; al revés sale ${x}.`),
      ],
      solucion: [
        ['x(', T(String(t2)), ') = ', X(mt(X0(t2))), ' y x(', T(String(t1)), ') = ', X(mt(X0(t1))), '.'],
        ['Δx = ', `${f(X0(t2))} − ${f(X0(t1))} = `, X(mt(ok)), '.'],
      ],
      _datos: { sub, A: A0, B, C, s, t1, t2 },
    };
  }

  function proporcion(rng) {
    const k1 = rng.elegir([18, 36, 54]), k = rng.elegir([2, 3]), d1 = rng.entero(4, 20), k2 = k1 * k;
    if (k2 > 108 || (k1 === 36 && d1 === 8 && k === 2)) return null;
    const Af = (k1 / 3.6) ** 2 / (2 * d1), m = M.movil({ v0: k2 / 3.6, a: -Af, frena: true }), ok = m.distancia(0, m.tParada + 1);
    if (!limpio(ok, 1)) return null;
    return {
      enunciado: ['Una combi a ', V(kmh(k1)), ' necesita ', X(mt(d1)), ' para frenar hasta parar.'],
      pregunta: ['Con el mismo freno, ¿cuántos metros necesita si va a ', V(kmh(k2)), '?'],
      datos: [...DB2, D.kmh], correcta: ok, fmt: mt,
      errores: [
        e('PR1-frenado', d1 * k, x => `Bien que crezca: tarda ${k} veces más en parar. Pero en cada segundo también va ${k} veces más rápido; así sale ${x}.`),
        e('MRUV-FRENO-IGUAL', d1, x => `Bien: el freno es el mismo. Pero tiene que quitar ${k} veces más velocidad; ${x} no alcanza.`),
        e('MRUV-VT', 2 * ok, x => `Bien el freno que sale de los ${d1} m. Pero en el segundo caso, v_0 · t sin la mitad da ${x}.`),
        e('MRUV-DIF-D', d1 * (k * k - 1), x => `Bien que v² crezca ${k * k} veces. Pero ${x} es cuánto más necesita, no el total.`),
      ],
      solucion: [
        ['Con el mismo a, v² = v_0² + 2aΔx da Δx proporcional a v_0²: ', V(`${k2} km/h`), ` es ${k} veces ${k1} km/h.`],
        [`Δx = ${d1} · ${k}² = `, X(mt(ok)), '.'],
      ],
      _datos: { k1, k, d1 },
    };
  }

  function enesimo(rng) {
    const v0 = rng.elegir([0, 0, 1, 2, 3, 4, 6]), a = rng.elegir([1, 2, 3, 4]), n = rng.entero(3, 8);
    const ok = M.enesimoSegundo(v0, a, n), m = M.movil({ v0, a });
    if (v0 === 0 && a === 2 && n === 5) return null;   // un ejemplo de la unidad
    return {
      enunciado: v0 ? ['Una combi pasa por el paradero a ', V(ms(v0)), ' y acelera con ', A(`a = ${f(a)} m/s²`), '.'] : ['Una combi arranca del paradero con ', A(`a = ${f(a)} m/s²`), '.'],
      pregunta: [`¿Cuántos metros avanza durante el ${ORD[n]} segundo?`],
      datos: [D.horaria, D.vt, D.enesimo], correcta: ok, fmt: mt,
      errores: [
        e('MRUV-ENESIMO', m.x(n), x => `Bien x a los ${n} s, ${x}. Pero eso es lo que avanza en los ${n} s enteros; piden solo el último de ellos.`),
        e('MRUV-VEL-N', m.v(n), x => `Bien la velocidad a los ${n} s. Pero ese número está en m/s; lo que avanza en ese segundo es ${f(ok)} m, no ${x}.`),
        e('MRUV-ANTERIOR', m.x(n - 1), x => `Bien x a los ${n - 1} s, ${x}. Pero ahí empieza el ${ORD[n]} segundo: falta restarla de x a los ${n} s.`),
        e('MRUV-OTRO-SEG', M.enesimoSegundo(v0, a, n - 1), x => `Bien la resta de dos posiciones. Pero ${x} es lo del segundo anterior, de ${n - 2} s a ${n - 1} s.`),
      ],
      solucion: [
        [`El ${ORD[n]} segundo va de `, T(`${n - 1} s`), ' a ', T(`${n} s`), `: x(${n}) = ${f(m.x(n))} m y x(${n - 1}) = ${f(m.x(n - 1))} m.`],
        [`${f(m.x(n))} − ${f(m.x(n - 1))} = `, X(mt(ok)), '.'],
      ],
      _datos: { v0, a, n },
    };
  }

  // ======================= Idea B3: la gráfica v–t =======================

  function pendiente(rng, forzado) {
    const sub = forzado || rng.elegir(['sube', 'baja']);
    const Tt = rng.entero(2, 8), aa = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3]);
    let v1, v2;
    if (sub === 'sube') { v1 = rng.entero(0, 10); v2 = v1 + aa * Tt; } else { v2 = rng.entero(0, 6); v1 = v2 + aa * Tt; }
    if (!Number.isInteger(v1) || !Number.isInteger(v2) || v1 > 30 || v2 > 30) return null;
    const a = M.pendiente(0, v1, Tt, v2), dv = v2 - v1, area = (v1 + v2) / 2 * Tt;
    return {
      enunciado: ['La gráfica v–t de una combi es una recta que va de ', V(ms(v1)), ' a ', V(ms(v2)), ' en ', T(sg(Tt)), '.'],
      pregunta: ['¿Cuánto vale su aceleración, con su signo?'],
      datos: DB3, correcta: a, fmt: ms2, negativos: true,
      errores: [
        e('G4', area, x => `Bien leer la recta. Pero ${x} es el área: lo que avanzó; la aceleración es la pendiente.`),
        v1 && v2 && e('K4', v2 / Tt, x => `Bien dividir entre ${Tt} s. Pero la pendiente usa el cambio, ${v2} − ${v1}; solo con ${v2} sale ${x}.`),
        e('K-SINDIV', dv, x => `Bien el cambio de v, ${f(dv)} m/s. Pero la pendiente lo divide entre los ${Tt} s; ${x} no es.`),
        e('K-SIGNO', -a, x => `Bien el valor de la pendiente. Pero la recta ${sub}: a es ${sub === 'sube' ? 'positiva' : 'negativa'}; ${x} tiene el signo al revés.`),
      ],
      solucion: [['Pendiente: (', V(`${v2} − ${v1}`), ') ÷ ', T(f(Tt)), ' = ', A(ms2(a)), '.']],
      _datos: { sub, v1, v2, T: Tt },
    };
  }

  function area(rng, forzado) {
    const sub = forzado || rng.elegir(['tri', 'trap']);
    const Tt = rng.entero(2, 10);
    const quien = rng.elegir(['Un atleta', 'Una ciclista', 'Una combi']);
    if (sub === 'tri') {
      const V1 = rng.entero(4, quien === 'Un atleta' ? 10 : 16), ok = M.movil({ v0: 0, a: V1 / Tt }).desplazamiento(0, Tt);
      if (!limpio(ok, 1) || (V1 === 8 && Tt === 4)) return null;
      return {
        enunciado: [`${quien} sale del reposo y llega a `, V(ms(V1)), ' en ', T(sg(Tt)), ', acelerando parejo: su gráfica v–t es una recta que sube desde 0.'],
        pregunta: ['¿Cuántos metros avanza en ese tiempo?'],
        datos: DB3, correcta: ok, fmt: mt,
        errores: [
          e('DX-TRIANGULO', V1 * Tt, x => `Bien la idea del área: base ${Tt} s, altura ${V1} m/s. Pero el triángulo es base por altura entre 2; así sale ${x}.`),
          e('G4', V1 / Tt, x => `Bien leer la recta. Pero ${x} es la pendiente: la aceleración. Lo que avanzó es el área.`),
          e('DX-ALTURA', V1, x => `Bien leer la velocidad final, ${V1} m/s. Pero lo que avanza es el área, no la altura; ${x} no es.`),
        ],
        solucion: [['El área es un triángulo: ', T(f(Tt)), ' · ', V(f(V1)), ' ÷ 2 = ', X(mt(ok)), '.']],
        _datos: { sub, V1, T: Tt },
      };
    }
    const v1 = rng.entero(1, 8), v2 = v1 + rng.entero(2, 10), ok = M.movil({ v0: v1, a: (v2 - v1) / Tt }).desplazamiento(0, Tt);
    if (!limpio(ok, 1) || (quien === 'Un atleta' && v2 > 10)) return null;
    return {
      enunciado: [`La velocidad de ${quien.toLowerCase()} sube en línea recta de `, V(ms(v1)), ' a ', V(ms(v2)), ' en ', T(sg(Tt)), '.'],
      pregunta: ['¿Cuántos metros avanza en ese tiempo?'],
      datos: DB3, correcta: ok, fmt: mt,
      errores: [
        e('DX-SEMI', (v1 + v2) * Tt, x => `Bien las dos bases del trapecio. Pero su suma se divide entre 2; sin dividir sale ${x}.`),
        e('DX-RECT', v2 * Tt, x => `Bien que multipliques por ${Tt} s. Pero no fue a ${v2} m/s todo el tiempo; así sale ${x}.`),
        e('DX-INICIAL', v1 * Tt, x => `Bien que multipliques por ${Tt} s. Pero su velocidad subió desde ${v1} m/s; así sale ${x}.`),
        e('DX-ALTURA', v1 + v2, x => `Bien que uses las dos velocidades. Pero lo que avanza es el área, no la suma de las alturas; ${x} no es.`),
      ],
      solucion: [['El área es un trapecio: (', V(`${v1} + ${v2}`), ') ÷ 2 · ', T(f(Tt)), ' = ', X(mt(ok)), '.']],
      _datos: { sub, v1, v2, T: Tt },
    };
  }

  function retroceso(rng, forzado) {
    const sub = forzado || rng.elegir(['desplazamiento', 'distancia']);
    const v1 = rng.entero(2, 8), t1 = rng.entero(2, 6), v2 = rng.elegir([1, 1.5, 2, 2.5, 3, 4]), t2 = rng.entero(2, 6);
    if (v1 === 4 && t1 === 3 && v2 === 1.5 && t2 === 4) return null;   // la predicción de la idea 3
    const A1 = M.movil({ v0: v1 }).desplazamiento(0, t1), A2 = -M.movil({ v0: -v2 }).desplazamiento(0, t2);
    const dx = A1 - A2, d = A1 + A2;
    if (igual(dx, 0) || igual(A1, A2)) return null;
    const enunciado = ['Un mototaxi avanza ', T(sg(t1)), ' a ', V(ms(v1)), ' y después retrocede ', T(sg(t2)), ' a ', V(ms(v2)), ' para estacionarse.'];
    const sol = [['Áreas de la gráfica v–t: ', V(f(v1)), ' · ', T(f(t1)), ` = ${f(A1)} m sobre el eje y `, V(f(v2)), ' · ', T(f(t2)), ` = ${f(A2)} m bajo el eje.`]];
    if (sub === 'desplazamiento') return {
      enunciado, pregunta: ['¿Cuál es su desplazamiento, con su signo?'],
      datos: DB3, correcta: dx, fmt: mt, negativos: true,
      errores: [
        e('DX-SUMA', d, x => `Bien las dos áreas. Pero la de abajo es hacia atrás: se resta; sumarlas da ${x}.`),
        e('DX-IDA', A1, x => `Bien el tramo de ida, ${x}. Pero después retrocedió ${f(A2)} m.`),
        e('DX-ALTURA', v1 - v2, x => `Bien restar lo de atrás. Pero lo que avanza es el área, no la altura de la gráfica; ${x} no es.`),
        e('DX-SIGNO', -dx, x => `Bien la resta de las áreas. Pero el desplazamiento es lo de ida menos lo de vuelta; al revés sale ${x}.`),
      ],
      solucion: [...sol, ['Δx = ', `${f(A1)} − ${f(A2)} = `, X(mt(dx)), '.']],
      _datos: { sub, v1, t1, v2, t2 },
    };
    return {
      enunciado, pregunta: ['¿Cuántos metros recorrió en total?'],
      datos: DB3, correcta: d, fmt: mt, negativos: true,
      errores: [
        e('DX-RESTA', dx, x => `Bien las dos áreas. Pero ${x} es el desplazamiento; la distancia recorrida cuenta todo el camino, sin signo.`),
        e('DX-IDA', A1, x => `Bien el tramo de ida, ${x}. Pero también recorrió los ${f(A2)} m de vuelta.`),
        e('DX-ALTURA', v1 + v2, x => `Bien sumar sin signo. Pero lo que se recorre es el área, no la altura de la gráfica; ${x} no es.`),
        e('DX-TRIANGULO', d / 2, x => `Bien sumar las dos áreas. Pero son rectángulos: base por altura, sin dividir entre 2; así sale ${x}.`),
        e('DX-RECT', Math.max(v1, v2) * (t1 + t2), x => `Bien multiplicar por los ${t1 + t2} s. Pero no fue a ${f(Math.max(v1, v2))} m/s todo el tiempo; así sale ${x}.`),
      ],
      solucion: [...sol, ['d = ', `${f(A1)} + ${f(A2)} = ${mt(d)}`, '.']],
      _datos: { sub, v1, t1, v2, t2 },
    };
  }

  function tramos(rng) {
    const V1 = rng.entero(6, 10), t1 = rng.entero(2, 5), t2 = rng.entero(2, 10);
    if (V1 === 9 && t1 === 3 && t2 === 5) return null;   // un ejemplo de la unidad
    const m = M.movil({ v0: 0, tramos: [{ dur: t1, a: V1 / t1 }, { dur: t2, a: 0 }] }), ok = m.desplazamiento(0, t1 + t2);
    if (!limpio(ok, 1)) return null;
    return {
      enunciado: ['Un atleta acelera parejo desde el reposo hasta ', V(ms(V1)), ' en ', T(sg(t1)), ' y sigue a esa rapidez ', T(sg(t2)), ' más.'],
      pregunta: ['¿Cuántos metros avanza en total?'],
      datos: DB3, correcta: ok, fmt: mt,
      errores: [
        e('DX-TRAMO', V1 * t2, x => `Bien el tramo parejo, ${x}. Falta lo que avanzó mientras aceleraba.`),
        e('DX-TRIANGULO', V1 * t1 + V1 * t2, x => `Bien las dos áreas. Pero la primera es un triángulo: base por altura entre 2; así sale ${x}.`),
        e('DX-SOLO-TRI', V1 * t1 / 2, x => `Bien el triángulo de la salida, ${x}. Falta el rectángulo de los ${t2} s a ${V1} m/s.`),
        e('DX-MEDIA-V', V1 / 2 * (t1 + t2), x => `Bien multiplicar por todo el tiempo. Pero no fue a ${f(V1 / 2)} m/s todo el viaje: solo al acelerar; así sale ${x}.`),
      ],
      solucion: [
        ['Triángulo: ', T(f(t1)), ' · ', V(f(V1)), ` ÷ 2 = ${f(V1 * t1 / 2)} m. Rectángulo: `, V(f(V1)), ' · ', T(f(t2)), ` = ${f(V1 * t2)} m.`],
        ['En total, ', X(mt(ok)), '.'],
      ],
      _datos: { V: V1, t1, t2 },
    };
  }

  function cruzaEje(rng, forzado) {
    const sub = forzado || rng.elegir(['desplazamiento', 'distancia']);
    const aa = rng.elegir([1, 2, 3]), t0 = rng.entero(1, 5), tb = rng.entero(1, 4);
    const V1 = aa * t0, V2 = aa * tb, Tt = t0 + tb;
    if ((V1 === 8 && V2 === 4 && Tt === 6) || (V1 === 6 && V2 === 4 && Tt === 5) || t0 === tb) return null;   // ejemplos de la unidad
    const m = M.movil({ v0: V1, a: -aa }), dx = m.desplazamiento(0, Tt), d = m.distancia(0, Tt);
    const A1 = V1 * t0 / 2, A2 = V2 * tb / 2;
    const enunciado = ['La velocidad de un mototaxi baja en línea recta de ', V(ms(V1)), ' a ', V(ms(-V2)), ' en ', T(sg(Tt)), ': frena y sigue en reversa.'];
    const sol = [['La recta corta el eje en ', T(`t = ${t0} s`), ` (baja ${aa} m/s cada segundo). Triángulos: ${f(A1)} m sobre el eje y ${f(A2)} m bajo el eje.`]];
    if (sub === 'desplazamiento') return {
      enunciado, pregunta: ['¿Cuál es su desplazamiento, con su signo?'],
      datos: DB3, correcta: dx, fmt: mt, negativos: true,
      errores: [
        e('DX-SUMA', d, x => `Bien los dos triángulos. Pero el de abajo es hacia atrás: se resta; sumarlos da ${x}.`),
        e('DX-IDA', A1, x => `Bien el triángulo de ida, ${x}. Pero después retrocedió ${f(A2)} m.`),
        e('DX-TRIANGULO', 2 * dx, x => `Bien restar el de abajo. Pero cada triángulo es base por altura entre 2; así sale ${x}.`),
        e('DX-SIGNO', -dx, x => `Bien la resta de las áreas. Pero es lo de arriba menos lo de abajo; al revés sale ${x}.`),
      ],
      solucion: [...sol, ['Δx = ', `${f(A1)} − ${f(A2)} = `, X(mt(dx)), '.']],
      _datos: { sub, a: aa, t0, tb },
    };
    return {
      enunciado, pregunta: ['¿Cuántos metros recorrió en total?'],
      datos: DB3, correcta: d, fmt: mt, negativos: true,
      errores: [
        e('DX-RESTA', dx, x => `Bien los dos triángulos. Pero ${x} es el desplazamiento; la distancia recorrida suma todo, sin signo.`),
        e('DX-IDA', A1, x => `Bien el triángulo de ida, ${x}. Pero también recorrió los ${f(A2)} m de reversa.`),
        e('DX-TRIANGULO', 2 * d, x => `Bien sumar sin signo. Pero cada triángulo es base por altura entre 2; así sale ${x}.`),
        e('DX-TRAPECIO', (V1 + V2) / 2 * Tt, x => `Bien la idea del área. Pero la recta cruza el eje: son dos triángulos, no un trapecio; así sale ${x}.`),
      ],
      solucion: [...sol, ['d = ', `${f(A1)} + ${f(A2)} = ${mt(d)}`, '.']],
      _datos: { sub, a: aa, t0, tb },
    };
  }

  function tren(rng, forzado) {
    const sub = forzado || rng.elegir(['tiempo', 'vmax']);
    const aa = rng.elegir([0.5, 1, 2]), k = rng.entero(5, 20), Dd = aa * k * k;
    if (Dd > 2000 || !Number.isInteger(Dd) || (aa === 1 && Dd === 400)) return null;
    const m = M.movil({ v0: 0, frena: true, tramos: [{ dur: k, a: aa }, { a: -aa }] }), ttot = m.tParada, vmax = m.v(k);
    if (Math.abs(m.x(ttot + 1) - Dd) > 1e-6) return null;
    const enunciado = ['Un tren sale del reposo y acelera con ', A(`${f(aa)} m/s²`), '; después frena con la misma aceleración y para en la estación siguiente, a ', X(mt(Dd)), '.'];
    const sol = [['La gráfica v–t es un triángulo: sube ', A(f(aa)), ' m/s cada segundo hasta la mitad del camino y baja igual.'],
      ['Cada mitad: ', X(f(Dd / 2)), ' = ½ · ', A(f(aa)), ' · t², así que t = ', T(sg(k)), ' y ', V(`v máx = ${ms(vmax)}`), '.']];
    if (sub === 'tiempo') return {
      enunciado, pregunta: ['¿Cuál es el menor tiempo del viaje?'],
      datos: [...DB3.slice(0, 2), D.fig, D.horaria], correcta: ttot, fmt: sg,
      errores: [
        e('MRUV-MITAD', k, x => `Bien el triángulo. Pero ${x} es solo el tiempo de acelerar; falta frenar.`),
        e('MRUV-SOLO-ACELERA', Math.sqrt(2 * Dd / aa), x => `Bien ½ · a · t². Pero eso sería si acelerara todo el camino; también tiene que frenar. Así sale ${x}.`),
        e('MRUV-DOBLE-TRAMO', 2 * Math.sqrt(2 * Dd / aa), x => `Bien que acelere y frene. Pero cada parte recorre la mitad del camino, no todo; así sale ${x}.`),
        e('MRUV-VMAX', vmax, x => `Bien la rapidez máxima, ${f(vmax)} m/s. Pero piden segundos; ${x} no es el tiempo.`),
      ],
      solucion: [...sol, ['El viaje dura ', T(`2 · ${k} = ${sg(ttot)}`), '.']],
      _datos: { sub, a: aa, k },
    };
    return {
      enunciado, pregunta: ['¿Cuál es la mayor rapidez que alcanza?'],
      datos: [...DB3.slice(0, 2), D.fig, D.horaria], correcta: vmax, fmt: ms,
      errores: [
        e('MRUV-SOLO-ACELERA', Math.sqrt(2 * aa * Dd), x => `Bien v² = 2aΔx. Pero eso sería si acelerara todo el camino; acelera solo la mitad. Así sale ${x}.`),
        e('MRUV-MEDIA-V', vmax / 2, x => `Bien la rapidez media del viaje, ${x}. Pero piden la mayor, la de la mitad del camino.`),
        e('MRUV-TIEMPO', ttot, x => `Bien el tiempo del viaje, ${f(ttot)} s. Pero ese número está en segundos; ${x} no es la rapidez.`),
      ],
      solucion: sol,
      _datos: { sub, a: aa, k },
    };
  }

  function areaAcel(rng) {
    const V1 = rng.entero(4, 14), t = rng.entero(2, 10), Dd = V1 * t / 2;
    if (!limpio(Dd, 1) || (V1 === 12 && Dd === 36)) return null;
    const m = M.movil({ v0: V1, a: -V1 / t, frena: true }), ok = m.a(0);
    if (Math.abs(m.distancia(0, t + 1) - Dd) > 1e-9 || !limpio(ok)) return null;
    return {
      enunciado: ['Una ciclista va a ', V(ms(V1)), ' y frena parejo hasta detenerse. En su gráfica v–t, el área bajo la recta es ', X(mt(Dd)), '.'],
      pregunta: ['¿Cuánto vale su aceleración, con su signo?'],
      datos: DB3, correcta: ok, fmt: ms2, negativos: true,
      errores: [
        e('K-SIGNO', -ok, x => `Bien el valor, ${f(-ok)}. Pero la recta baja: la pendiente es negativa; ${x} tiene el signo al revés.`),
        e('DX-TRIANGULO', -V1 * V1 / Dd, x => `Bien la idea del área. Pero el triángulo es base por altura entre 2: la base es 2 · ${f(Dd)} ÷ ${V1}, no ${f(Dd)} ÷ ${V1}; así sale ${x}.`),
        e('G4', -V1 / Dd, x => `Bien dividir la velocidad. Pero el área no es el tiempo: primero se despeja la base del triángulo; así sale ${x}.`),
        e('G4-tiempo', t, x => `Bien despejar la base del triángulo: ${t} s. Pero ese es el tiempo de frenado; la aceleración es la pendiente. ${x} no es.`),
      ],
      solucion: [
        ['Triángulo: ', X(f(Dd)), ' = base · ', V(f(V1)), ' ÷ 2, así que la base es ', T(sg(t)), '.'],
        ['Pendiente: (0 − ', V(f(V1)), ') ÷ ', T(f(t)), ' = ', A(ms2(ok)), '.'],
      ],
      _datos: { V: V1, t },
    };
  }

  // ======================= Idea B4: gráficas x–t y a–t =======================

  function atV(rng, forzado) {
    const sub = forzado || rng.elegir(['acelera', 'frena']);
    const v0 = rng.entero(2, 15), aa = rng.elegir([0.5, 1, 1.5, 2, 3]), Tt = rng.entero(2, 6), a = sub === 'frena' ? -aa : aa;
    const ok = M.movil({ v0, tramos: [{ dur: Tt, a }] }).v(Tt);
    if (ok <= 0 || !limpio(ok, 1) || (v0 === 4 && a === 2 && Tt === 5) || (v0 === 10 && a === -2 && Tt === 3)) return null;
    return {
      enunciado: ['Una combi va a ', V(ms(v0)), ' y su gráfica a–t es una horizontal en ', A(ms2(a)), ' durante ', T(sg(Tt)), '.'],
      pregunta: ['¿Qué velocidad tiene al final?'],
      datos: [...DB4, D.fig], correcta: ok, fmt: ms, negativos: true,
      errores: [
        e('K-SIN-V0', a * Tt, x => `Bien el área de a–t, ${x}: lo que cambió v. Pero se suma a los ${v0} m/s con que iba.`),
        e('K-CUADRADO', v0 + a * Tt * Tt, x => `Bien partir de ${v0} m/s. Pero el área de a–t es base por altura, a · t, sin elevar t; así sale ${x}.`),
        e('K-TIEMPO', v0 + a, x => `Bien partir de ${v0} m/s y usar a. Pero ${x} es la velocidad después de un segundo; dura ${Tt} s.`),
        e('K-SIGNO', v0 - a * Tt, x => `Bien el área, ${f(Math.abs(a * Tt))} m/s. Pero a es ${a > 0 ? 'positiva: se suma' : 'negativa: se resta'}; así sale ${x}.`),
      ],
      solucion: [['El área de a–t: ', A(f(a)), ' · ', T(f(Tt)), ` = ${f(a * Tt)} m/s, lo que cambia v.`], ['v = ', V(f(v0)), ` ${a < 0 ? '−' : '+'} ${f(Math.abs(a * Tt))} = `, V(ms(ok)), '.']],
      _datos: { sub, v0, a, T: Tt },
    };
  }

  // Formas de las tres gráficas (las de la teoría, idea 4) para cada movimiento.
  const FORMAS = {
    constante: { 'x–t': 'Una recta inclinada que sube', 'v–t': V0 => `Una horizontal en ${ms(V0)}`, 'a–t': () => 'Una horizontal en 0' },
    acelera: { 'x–t': 'Una curva que se empina cada vez más', 'v–t': 'Una recta inclinada que sube', 'a–t': a => `Una horizontal en ${ms2(a)}` },
    frena: { 'x–t': 'Una curva que se aplana hasta quedar horizontal', 'v–t': 'Una recta que baja hasta 0', 'a–t': a => `Una horizontal en ${ms2(-a)}` },
  };
  function forma(rng, forzado) {
    const g = forzado || rng.elegir(['x–t', 'v–t', 'a–t']), mov = rng.elegir(['constante', 'acelera', 'frena']);
    const num = mov === 'constante' ? rng.entero(6, 15) : rng.elegir([1, 1.5, 2, 2.5, 3]);
    const de = (m2, g2) => { const x = FORMAS[m2][g2]; return typeof x === 'function' ? x(m2 === 'constante' ? num : num) : x; };
    const ok = de(mov, g), otras = ['x–t', 'v–t', 'a–t'].filter(x => x !== g), opuesto = mov === 'acelera' ? 'frena' : mov === 'frena' ? 'acelera' : null;
    const enunciado = mov === 'constante' ? ['Una combi va siempre a ', V(ms(num)), ' por la avenida.']
      : mov === 'acelera' ? ['Una combi arranca del paradero y acelera parejo con ', A(`a = ${f(num)} m/s²`), '.']
        : ['Una combi frena parejo con ', A(`a = −${f(num)} m/s²`), ' hasta detenerse, sin retroceder.'];
    const errores = [
      ...otras.map(o2 => et('G3', de(mov, o2), x => `Bien: «${x}» es la forma de su gráfica ${o2}. Pero piden la ${g}; cada gráfica tiene la suya.`)),
      opuesto && et('G-SENTIDO', de(opuesto, g), x => `Bien el tipo de gráfica. Pero «${x}» sería la ${g} de una combi que ${opuesto}.`),
      mov === 'constante' && g === 'x–t' && et('G1', 'Una horizontal, como la avenida', x => `Bien que la avenida sea plana. Pero la gráfica no es una foto del camino: «${x}» diría que la combi está quieta.`),
      mov === 'constante' && g !== 'x–t' && et('G-SENTIDO', de('acelera', g), x => `Bien el tipo de gráfica. Pero «${x}» sería la ${g} de una combi que acelera; esta va pareja.`),
    ];
    return {
      enunciado, pregunta: [`¿Cómo es su gráfica ${g} mientras tanto?`],
      datos: [D.graficas, D.vt, D.horaria], correcta: ok, errores,
      solucion: [
        mov === 'constante' ? ['Va siempre a ', V(ms(num)), ': x crece lo mismo cada segundo, v no cambia y a = 0.']
          : mov === 'acelera' ? ['v sube ', A(f(num)), ' m/s cada segundo: x crece cada vez más y a no cambia.']
            : ['v baja ', A(f(num)), ' m/s cada segundo hasta 0: x crece cada vez menos y a no cambia.'],
        [`Su gráfica ${g}: ${ok.charAt(0).toLowerCase()}${ok.slice(1)}.`],
      ],
      _datos: { sub: g, mov, num },
    };
  }

  function igualVelocidad(rng) {
    const Vm = rng.elegir([6, 8, 9, 10, 12, 15]), aa = rng.elegir([1, 1.5, 2, 3]);
    if ((Vm === 10 && aa === 2) || (Vm === 12 && aa === 3)) return null;   // la predicción de la idea 4 y un ejemplo
    const moto = { v0: Vm }, combi = { v0: 0, a: aa };
    const [ok] = M.igualVelocidad(moto, combi, 60), [, alc] = M.cruces(moto, combi, 60);
    if (!limpio(ok, 2) || ok > 15) return null;
    return {
      enunciado: ['Un mototaxi pasa por el paradero a ', V(ms(Vm)), ' justo cuando una combi arranca de ahí con ', A(`a = ${f(aa)} m/s²`), '.'],
      pregunta: ['¿A los cuántos segundos tienen la misma velocidad?'],
      datos: [...DB4, D.alcance], correcta: ok, fmt: sg,
      errores: [
        e('K1-a', alc, x => `Bien: a los ${x} están en el mismo lugar. Pero ahí la combi ya va más rápido; la misma velocidad fue antes.`),
        e('K-POR', Vm * aa, x => `Bien usar ${Vm} m/s y a. Pero la combi gana ${f(aa)} m/s cada segundo: se divide, no se multiplica; así sale ${x}.`),
        e('K-INVERSA', aa / Vm, x => `Bien usar ${Vm} m/s y a. Pero el tiempo es la velocidad entre a, no al revés; así sale ${x}.`),
      ],
      solucion: [['La combi va a ', A(f(aa)), ' · ', T('t'), '; el mototaxi, siempre a ', V(f(Vm)), '.'], ['Iguales cuando ', T('t'), ` = ${Vm} ÷ ${f(aa)} = `, T(sg(ok)), ': ahí sus rectas x–t tienen la misma inclinación.']],
      _datos: { V: Vm, a: aa },
    };
  }

  function tramosAt(rng) {
    const a1 = rng.elegir([1, 2, 3, 4]), t1 = rng.entero(2, 5), a2 = rng.elegir([-2, -1, 1, 2, 3]), t2 = rng.entero(2, 5);
    const ok = M.movil({ v0: 0, tramos: [{ dur: t1, a: a1 }, { dur: t2, a: a2 }] }).v(t1 + t2);
    if (ok <= 0) return null;
    return {
      enunciado: ['Una combi arranca del reposo. Su gráfica a–t vale ', A(ms2(a1)), ' durante ', T(sg(t1)), ' y después ', A(ms2(a2)), ' durante ', T(sg(t2)), '.'],
      pregunta: ['¿Qué velocidad tiene al final?'],
      datos: [...DB4, D.fig], correcta: ok, fmt: ms,
      errores: [
        e('AT-TRAMO', a1 * t1, x => `Bien el área del primer tramo, ${x}. Falta el segundo: ${f(a2)} · ${t2}, que también cambia v.`),
        e('AT-TODO', a1 * (t1 + t2), x => `Bien partir del reposo y usar áreas. Pero a vale ${f(a1)} solo los primeros ${t1} s; así sale ${x}.`),
        e('AT-ALTURA', a1 + a2, x => `Bien juntar los dos tramos. Pero lo que cambia v es el área, no la altura de cada tramo; ${x} no es.`),
        e('K-SIGNO', a1 * t1 - a2 * t2, x => `Bien las dos áreas. Pero el segundo tramo está ${a2 > 0 ? 'sobre el eje: se suma' : 'bajo el eje: se resta'}; así sale ${x}.`),
      ],
      solucion: [['Áreas de a–t: ', A(f(a1)), ' · ', T(f(t1)), ` = ${f(a1 * t1)} m/s y `, A(f(a2)), ' · ', T(f(t2)), ` = ${f(a2 * t2)} m/s.`], ['v = 0 + ', `${f(a1 * t1)} ${a2 < 0 ? '−' : '+'} ${f(Math.abs(a2 * t2))} = `, V(ms(ok)), '.']],
      _datos: { a1, t1, a2, t2 },
    };
  }

  function alcance(rng, forzado) {
    const sub = forzado || rng.elegir(['tiempo', 'donde']);
    const Vm = rng.elegir([4, 5, 6, 8, 9, 10, 12]), aa = rng.elegir([1, 1.5, 2, 3, 4]);
    if ((Vm === 10 && aa === 2) || (Vm === 6 && aa === 1.5)) return null;   // la predicción y un ejemplo de la idea 4
    const moto = { v0: Vm }, combi = { v0: 0, a: aa }, [, t] = M.cruces(moto, combi, 100);
    if (!limpio(t, 2) || !t) return null;
    const x = M.movil(moto).x(t), tv = Vm / aa;
    const enunciado = ['Un mototaxi pasa por el paradero a ', V(ms(Vm)), ' justo cuando una combi arranca de ahí con ', A(`a = ${f(aa)} m/s²`), '.'];
    const sol = [['Mototaxi: x = ', V(f(Vm)), ' · ', T('t'), '. Combi: x = ½ · ', A(f(aa)), ' · ', T('t²'), '.'],
      ['Iguales: ', `${Vm} · t = ${f(aa / 2)} · t², así que t = `, T(sg(t)), ' (t = 0 es la salida) y ', X(`x = ${mt(x)}`), '.']];
    if (sub === 'tiempo') return {
      enunciado, pregunta: ['¿A los cuántos segundos la combi alcanza al mototaxi?'],
      datos: [...DB4, D.alcance], correcta: t, fmt: sg,
      errores: [
        e('K1-a', tv, y => `Bien que la combi lo vaya alcanzando. Pero a los ${y} solo van igual de rápido; ahí la combi aún va atrás.`),
        e('K-INVERSA', 2 * aa / Vm, y => `Bien igualar las dos posiciones. Pero al despejar, t = 2 · ${Vm} ÷ ${f(aa)}, no al revés; así sale ${y}.`),
        e('MRUV-MEDIO', Vm / aa, y => `Bien igualar las posiciones. Pero la combi avanza ½ · a · t²; sin el ½ sale ${y}.`),
        e('K-POR', Vm * aa, y => `Bien usar ${Vm} m/s y a. Pero al despejar t se divide entre a; multiplicar da ${y}.`),
      ],
      solucion: sol, _datos: { sub, V: Vm, a: aa },
    };
    return {
      enunciado, pregunta: ['¿A cuántos metros del paradero la alcanza?'],
      datos: [...DB4, D.alcance], correcta: x, fmt: mt,
      errores: [
        e('K1-a', Vm * tv, y => `Bien que el mototaxi avance ${Vm} m/s. Pero ${y} es donde está cuando van igual de rápido; la combi aún va atrás.`),
        e('MRUV-MEDIO', aa * t * t, y => `Bien el tiempo del alcance, ${f(t)} s. Pero la combi avanza ½ · a · t²; sin el ½ sale ${y}.`),
        e('K-ALC-TIEMPO', t, y => `Bien el tiempo del alcance, ${f(t)} s. Pero piden metros; ${y} no es.`),
        e('K-ALC-SIN-D', 2 * x, y => `Bien el tiempo del alcance. Pero el mototaxi va a ${Vm} m/s, no al doble; así sale ${y}.`),
      ],
      solucion: sol, _datos: { sub, V: Vm, a: aa },
    };
  }

  function atDistancia(rng) {
    const a1 = rng.elegir([1, 2, 3, 4]), t1 = rng.entero(2, 4), t2 = rng.entero(1, 4), a3 = rng.elegir([1, 2, 4]);
    const vmax = a1 * t1, t3 = vmax / a3;
    if (!Number.isInteger(t3) || t3 > 8 || (a1 === 4 && t1 === 2 && t2 === 3 && a3 === 2)) return null;
    const m = M.movil({ v0: 0, frena: true, tramos: [{ dur: t1, a: a1 }, { dur: t2, a: 0 }, { dur: t3, a: -a3 }] });
    const T3 = t1 + t2 + t3, ok = m.distancia(0, T3);
    return {
      enunciado: ['Una combi parte del reposo. Su gráfica a–t vale ', A(ms2(a1)), ' durante ', T(sg(t1)), ', 0 durante ', T(sg(t2)), ' y ', A(ms2(-a3)), ' durante ', T(sg(t3)), '.'],
      pregunta: ['¿Cuántos metros recorre en total?'],
      datos: [...DB4, 'Área bajo v–t: Δx.', D.fig], correcta: ok, fmt: mt,
      errores: [
        e('G4', a1 * t1 + a3 * t3, x => `Bien leer las áreas de a–t. Pero esas áreas son cambios de velocidad, en m/s; la distancia es el área de v–t. ${x} no es.`),
        e('DX-TRAMO', vmax * t2, x => `Bien el tramo parejo, a ${vmax} m/s. Falta lo que avanzó mientras aceleraba y mientras frenaba; ${x} no alcanza.`),
        e('DX-RECT', vmax * T3, x => `Bien la velocidad máxima, ${vmax} m/s. Pero no fue así todo el viaje: al acelerar y al frenar son triángulos; así sale ${x}.`),
        e('G4-medio', vmax * T3 / 2, x => `Bien la idea del área. Pero el tramo parejo es un rectángulo entero, sin dividir entre 2; así sale ${x}.`),
      ],
      solucion: [
        ['v sube a ', A(f(a1)), ' · ', T(f(t1)), ' = ', V(ms(vmax)), ', se queda así y baja a 0 en los últimos ', T(sg(t3)), '.'],
        ['Áreas de v–t: ', `${f(vmax * t1 / 2)} + ${f(vmax * t2)} + ${f(vmax * t3 / 2)} = ${mt(ok)}`, '.'],
      ],
      _datos: { a1, t1, t2, a3 },
    };
  }

  function alcanceDetras(rng) {
    const aa = rng.elegir([1, 2, 3, 4]), Vm = rng.entero(4, 12), t = rng.entero(4, 14);
    const Dd = aa * t * t / 2 - Vm * t;
    if (Dd < 5 || Dd > 120 || !Number.isInteger(Dd) || (Vm === 8 && Dd === 20 && aa === 2)) return null;
    const moto = { x0: Dd, v0: Vm }, combi = { x0: 0, v0: 0, a: aa }, cr = M.cruces(moto, combi, 60);
    if (cr.length !== 1 || !igual(cr[0], t)) return null;
    const ok = M.movil(moto).desplazamiento(0, t);
    return {
      enunciado: ['Un mototaxi pasa por el grifo a ', V(ms(Vm)), '. En ese instante, una combi arranca del paradero, ', X(mt(Dd)), ' detrás, con ', A(`a = ${f(aa)} m/s²`), '.'],
      pregunta: ['¿Cuántos metros recorre el mototaxi hasta que lo alcanzan?'],
      datos: [...DB4, D.alcance, D.cuadratica], correcta: ok, fmt: mt,
      errores: [
        e('K-ALC-PERSEGUIDOR', Dd + ok, x => `Bien el tiempo del alcance, ${t} s. Pero ${x} es lo que recorre la combi: salió ${Dd} m más atrás.`),
        e('K-ALC-D', Dd, x => `Bien que la combi tenga que cerrar la distancia. Pero ${x} es la separación al empezar; el mototaxi sigue avanzando.`),
        e('K1-a', Vm * Vm / aa, x => `Bien la velocidad del mototaxi. Pero ${x} es lo que avanza hasta que van igual de rápido; ahí la combi aún va atrás.`),
        e('K-ALC-SIN-D', 2 * Vm * Vm / aa, x => `Bien igualar las posiciones. Pero la combi sale ${Dd} m detrás, no del grifo; así sale ${x}.`),
      ],
      solucion: [
        ['Desde el paradero: mototaxi x = ', X(f(Dd)), ' + ', V(f(Vm)), ' · ', T('t'), '; combi x = ½ · ', A(f(aa)), ' · ', T('t²'), '.'],
        ['Iguales: ', `${f(aa / 2)}t² − ${Vm}t − ${Dd} = 0, con t = `, T(sg(t)), '. El mototaxi recorre ', V(f(Vm)), ' · ', T(f(t)), ' = ', X(mt(ok)), '.'],
      ],
      _datos: { a: aa, V: Vm, t },
    };
  }

  function separacion(rng) {
    const Vm = rng.elegir([4, 6, 8, 9, 10, 12, 15]), aa = rng.elegir([1, 1.5, 2, 3]);
    if ((Vm === 12 && aa === 2) || (Vm === 10 && aa === 2)) return null;   // un ejemplo y la predicción de la idea 4
    const moto = M.movil({ v0: Vm }), combi = M.movil({ v0: 0, a: aa }), [tv] = M.igualVelocidad({ v0: Vm }, { v0: 0, a: aa }, 60);
    const ok = moto.x(tv) - combi.x(tv);
    if (!limpio(ok, 2) || !limpio(tv, 2)) return null;
    return {
      enunciado: ['Un mototaxi pasa por el paradero a ', V(ms(Vm)), ' justo cuando una combi arranca de ahí con ', A(`a = ${f(aa)} m/s²`), '.'],
      pregunta: ['Antes del alcance, ¿cuál es la mayor separación entre los dos?'],
      datos: [...DB4, D.separacion], correcta: ok, fmt: mt,
      errores: [
        e('K-SEP-ALCANCE', moto.x(2 * tv), x => `Bien la posición del mototaxi. Pero ${x} es donde la combi lo alcanza; ahí la separación es 0.`),
        e('K-SEP-TIEMPO', tv, x => `Bien: la separación es mayor cuando van igual de rápido, a los ${f(tv)} s. Pero piden metros; ${x} no es.`),
        e('K-SEP-MOTO', moto.x(tv), x => `Bien el instante, ${f(tv)} s. Pero ${x} es lo que avanzó el mototaxi; falta restar lo de la combi.`),
      ],
      solucion: [
        ['La separación crece mientras el mototaxi va más rápido: la mayor es cuando la combi llega a ', V(ms(Vm)), ', a los ', T(sg(tv)), '.'],
        ['Mototaxi: ', `${f(moto.x(tv))} m; combi: ½ · ${f(aa)} · ${f(tv)}² = ${f(combi.x(tv))} m. Separación: `, X(mt(ok)), '.'],
      ],
      _datos: { V: Vm, a: aa },
    };
  }

  // ======================= Idea B5: caída libre desde el reposo =======================

  // Desde dónde se suelta algo, según la altura (todo posible: ventanas de 1 a 15 m, azoteas hasta 45, puentes hasta 125).
  const lugarCaida = h => (h <= 15 ? { frase: 'Sueltas un borrador desde una ventana', de: 'del patio', llega: 'al patio' }
    : h <= 45 ? { frase: 'Una maceta cae desde una azotea', de: 'de la vereda', llega: 'a la vereda' }
      : { frase: 'Sueltas una piedra desde un puente', de: 'del río', llega: 'al río' });
  const caer = h => M.lanzamientoVertical({ y0: h, v0: 0 });   // el motor: tiempo y velocidad al llegar al piso

  function altura(rng) {
    const t = rng.elegir([1.5, 2.5, 3, 3.5, 4, 4.5, 5]), h = M.movil({ v0: 0, a: G }).x(t), L = lugarCaida(h);
    return {
      enunciado: [`${L.frase} y llega ${L.llega} en `, T(sg(t)), '.'],
      pregunta: ['¿Desde qué altura cayó?'],
      datos: DB5, correcta: h, fmt: mt,
      errores: [
        e('C-MEDIO', G * t * t, x => `Bien g · t². Pero lo que cae lleva un ½: ½ · g · t²; sin él sale ${x}.`),
        e('C-LINEAL', G * t / 2, x => `Bien el ½ · g. Pero el tiempo va al cuadrado; sin elevarlo sale ${x}.`),
        e('C-VELOCIDAD', G * t, x => `Bien usar g y t. Pero g · t = ${x} en número es la velocidad al llegar; piden la altura.`),
      ],
      solucion: [['h = ½ · ', A(f(G)), ' · ', T(`${f(t)}²`), ' = ', X(mt(h)), '.']],
      _datos: { t },
    };
  }

  function caidaV(rng, forzado) {
    const sub = forzado || rng.elegir(['tiempo', 'altura']);
    const t = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 4]), h = 5 * t * t;
    if (sub === 'tiempo') {
      const ok = M.movil({ v0: 0, a: G }).v(t), L = lugarCaida(h);
      return {
        enunciado: [`${L.frase} y llega ${L.llega} en `, T(sg(t)), '.'],
        pregunta: ['¿Con qué rapidez llega?'],
        datos: DB5, correcta: ok, fmt: ms,
        errores: [
          e('C-MEDIO', G * t / 2, x => `Bien usar g y t. Pero el ½ va en lo que cae, no en la velocidad: v = g · t; así sale ${x}.`),
          e('K-CUADRADO', G * t * t, x => `Bien partir del reposo con g. Pero v gana g cada segundo: g · t, sin elevar t; así sale ${x}.`),
          e('C-ALTURA', h, x => `Bien ½ · g · t² = ${f(h)} m: la altura. Pero piden la velocidad, no los metros; ${x} no es.`),
        ],
        solucion: [['v = ', A(f(G)), ' · ', T(f(t)), ' = ', V(ms(ok)), '.']],
        _datos: { sub, t },
      };
    }
    if (h < 5) return null;
    const ok = -caer(h).vSuelo, L = lugarCaida(h);
    return {
      enunciado: [`${L.frase} a `, X(mt(h)), ` ${L.de}.`],
      pregunta: ['¿Con qué rapidez llega?'],
      datos: DB5, correcta: ok, fmt: ms,
      errores: [
        e('C-RAIZ', 2 * G * h, x => `Bien 2 · g · h = ${f(2 * G * h)}. Pero eso es v²: falta sacar la raíz; ${x} no es.`),
        e('C-MEDIO', Math.sqrt(G * h), x => `Bien la raíz. Pero v² = 2 · g · h: falta el 2; así sale ${x}.`),
        e('C-TIEMPO', t, x => `Bien el tiempo de caída, ${f(t)} s. Pero piden la rapidez; ${x} no es.`),
      ],
      solucion: [['v² = 2 · ', A(f(G)), ' · ', X(f(h)), ` = ${f(2 * G * h)}, así que v = `, V(ms(ok)), '.']],
      _datos: { sub, t },
    };
  }

  function caidaT(rng) {
    const t = rng.elegir([0.6, 0.8, 1.2, 1.5, 2, 2.5, 3, 4]), h = 5 * t * t, ok = caer(h).tSuelo, L = lugarCaida(h);
    return {
      enunciado: [`${L.frase} a `, X(mt(h)), ` ${L.de}.`],
      pregunta: ['¿Cuánto tarda en llegar?'],
      datos: DB5, correcta: ok, fmt: sg,
      errores: [
        e('C-MEDIO', Math.sqrt(h / G), x => `Bien la raíz. Pero h = ½ · g · t²: queda t² = 2h ÷ g; sin el 2 sale ${x}.`),
        e('C-LINEAL', 2 * h / G, x => `Bien 2h ÷ g. Pero eso es t²: falta sacar la raíz; ${x} no es.`),
        e('C-VELOCIDAD', Math.sqrt(2 * G * h), x => `Bien la raíz de 2 · g · h. Pero esa es la rapidez al llegar, en m/s; ${x} no es el tiempo.`),
      ],
      solucion: [['', X(f(h)), ' = ½ · ', A(f(G)), ' · t², así que t² = ', `${f(2 * h / G)} y t = `, T(sg(ok)), '.']],
      _datos: { t },
    };
  }

  function regla(rng) {
    const t = rng.elegir([0.1, 0.12, 0.14, 0.15, 0.16, 0.18, 0.22, 0.24]), dcm = 500 * t * t, ok = caer(dcm / 100).tSuelo;
    return {
      enunciado: ['Tu compañero suelta una regla entre tus dedos y la atrapas cuando ya cayó ', X(cm(dcm)), '.'],
      pregunta: ['¿Cuánto tardaste en cerrar los dedos?'],
      datos: [...DB5, D.cm], correcta: ok, fmt: sg,
      errores: [
        e('U2-cm', Math.sqrt(2 * dcm / G), x => `Bien t² = 2h ÷ g y la raíz. Pero h va en metros: ${f(dcm)} cm = ${f(dcm / 100, 4)} m; con los cm sale ${x}.`),
        e('C-MEDIO', Math.sqrt(dcm / 100 / G), x => `Bien pasar a ${f(dcm / 100, 4)} m y sacar la raíz. Pero t² = 2h ÷ g: falta el 2; así sale ${x}.`),
        e('C-LINEAL', 2 * dcm / 100 / G, x => `Bien 2h ÷ g con h en metros. Pero eso es t²: falta la raíz; ${x} no es.`),
      ],
      solucion: [['En metros: ', X(`${f(dcm)} cm = ${f(dcm / 100, 4)} m`), '.'], ['t² = 2 · ', `${f(dcm / 100, 4)} ÷ `, A(f(G)), ` = ${f(2 * dcm / 100 / G, 4)}, así que t = `, T(sg(ok)), '.']],
      _datos: { t },
    };
  }

  function caidaKmh(rng) {
    const t = rng.elegir([2, 3, 4, 5]), h = 5 * t * t, vms = -caer(h).vSuelo, ok = vms * 3.6;
    return {
      enunciado: ['Una piedra se suelta desde un puente a ', X(mt(h)), ' del río.'],
      pregunta: ['¿Con qué rapidez llega al agua, en km/h?'],
      datos: [...DB5, D.kmh], correcta: ok, fmt: kmh,
      errores: [
        e('U1-kmh', vms, x => `Bien la rapidez, ${f(vms)} m/s. Pero piden km/h: falta multiplicar por 3,6; ${x} es el número en m/s.`),
        e('U1-al-reves', vms / 3.6, x => `Bien ${f(vms)} m/s. Pero para pasar a km/h se multiplica por 3,6, no se divide; así sale ${x}.`),
        e('C-MEDIO', Math.sqrt(G * h) * 3.6, x => `Bien la raíz y los km/h. Pero v² = 2 · g · h: falta el 2; así sale ${x}.`),
        e('C-TIEMPO', t * 3.6, x => `Bien multiplicar por 3,6. Pero ${t} s es el tiempo de caída, no la rapidez; así sale ${x}.`),
        e('K-CUADRADO', G * t * t * 3.6, x => `Bien los ${t} s de caída y el 3,6. Pero v = g · t, sin elevar t al cuadrado; así sale ${x}.`),
      ],
      solucion: [['v² = 2 · ', A(f(G)), ' · ', X(f(h)), ` = ${2 * G * h}, así que v = `, V(ms(vms)), '.'], ['En km/h: ', `${f(vms)} · 3,6 = `, V(kmh(ok)), '.']],
      _datos: { t },
    };
  }

  function doble(rng) {
    const t = rng.elegir([1, 1.5, 2, 2.5, 3]), k = rng.elegir([2, 4, 9]);
    const ok = caer(k * 5 * t * t).tSuelo;
    const veces = { 2: 'el doble de esa altura', 4: 'una altura cuatro veces mayor', 9: 'una altura nueve veces mayor' }[k];
    return {
      enunciado: ['Una piedra tarda ', T(sg(t)), ' en caer desde lo alto de un edificio.'],
      pregunta: [`¿Cuánto tarda en caer desde ${veces}?`],
      datos: DB5, correcta: ok, fmt: sg,
      errores: [
        e('C-LINEAL', k * t, x => `Bien que tarde más. Pero h va con t²: con ${k} veces la altura, t² es ${k} veces mayor, no t; así sale ${x}.`),
        e('C-IGUAL', t, x => `Bien: g es la misma. Pero desde más alto tarda más; ${x} es el tiempo de antes.`),
        e('C-CUADRADO', k * k * t, x => `Bien que h y t no crezcan igual. Pero t crece menos que h, no más; así sale ${x}.`),
      ],
      solucion: [['h = ½ · g · t²: con ', `${k} veces la altura, t² es ${k} veces mayor y t, √${k} veces.`], ['t = ', T(f(t)), ` · √${k} = `, T(sg(ok)), '.']],
      _datos: { t, k },
    };
  }

  function caidaEnesimo(rng) {
    const n = rng.entero(2, 8), m = M.movil({ v0: 0, a: G }), ok = M.enesimoSegundo(0, G, n);
    return {
      enunciado: ['Una piedra se suelta desde lo alto de un acantilado y todavía no llega al mar.'],
      pregunta: [`¿Cuántos metros cae durante el ${ORD[n]} segundo?`],
      datos: [...DB5, D.enesimo], correcta: ok, fmt: mt,
      errores: [
        e('C-ENESIMO', m.x(n), x => `Bien ½ · g · ${n}² = ${x}. Pero eso es lo que cae en los ${n} s enteros; piden solo el último de ellos.`),
        e('C-VELOCIDAD', m.v(n), x => `Bien g · ${n}. Pero ese número es su velocidad a los ${n} s, en m/s; ${x} no es.`),
        e('C-ANTERIOR', m.x(n - 1), x => `Bien lo que cayó hasta los ${n - 1} s, ${x}. Falta restarlo de lo que cayó hasta los ${n} s.`),
        n > 2 && e('C-OTRO-SEG', M.enesimoSegundo(0, G, n - 1), x => `Bien restar dos alturas. Pero ${x} es lo del segundo anterior, de ${n - 2} s a ${n - 1} s.`),
      ],
      solucion: [[`Hasta los ${n} s cae ½ · `, A(f(G)), ' · ', T(`${n}²`), ` = ${f(m.x(n))} m; hasta los ${n - 1} s, ${f(m.x(n - 1))} m.`], [`${f(m.x(n))} − ${f(m.x(n - 1))} = `, X(mt(ok)), '.']],
      _datos: { n },
    };
  }

  function dosEsferas(rng) {
    const k1 = rng.entero(1, 4), k2 = k1 + rng.entero(1, 3), h1 = 5 * k1 * k1, h2 = 5 * k2 * k2;
    const m1 = rng.elegir([1, 2, 3]), m2 = rng.elegir([4, 5, 6]);
    const pesada2 = rng.entero(0, 1) === 1, ma = pesada2 ? m1 : m2, mb = pesada2 ? m2 : m1;
    const t1 = caer(h1).tSuelo, t2 = caer(h2).tSuelo, ok = t2 - t1;
    if (h1 === 20 && h2 === 45) return null;   // un ejemplo de la unidad
    return {
      enunciado: ['Se sueltan a la vez una esfera de ', `${ma} kg desde `, X(mt(h1)), ` y otra de ${mb} kg desde `, X(mt(h2)), '.'],
      pregunta: ['¿Cuántos segundos después de la primera llega la segunda al suelo?'],
      datos: DB5, correcta: ok, fmt: sg,
      errores: [
        e('C-RESTA-ALTURAS', Math.sqrt(2 * (h2 - h1) / G), x => `Bien: la masa no cuenta. Pero ${x} es el tiempo de caer la diferencia desde el reposo; cada una sale del reposo.`),
        e('C-SUMA-T', t1 + t2, x => `Bien los dos tiempos, ${f(t1)} s y ${f(t2)} s. Pero se pide la diferencia, no la suma; ${x} no es.`),
        e('C-MEDIO', Math.sqrt(h2 / G) - Math.sqrt(h1 / G), x => `Bien restar los dos tiempos. Pero t² = 2h ÷ g: falta el 2 en cada uno; así sale ${x}.`),
        e('C-SOLO-UNA', t2, x => `Bien el tiempo de la segunda, ${x}. Pero piden cuánto después de la primera llega.`),
      ],
      solucion: [['Sin aire, la masa no cuenta. ', T(`t = √(2h ÷ g)`), ': ', T(sg(t1)), ' desde ', X(mt(h1)), ' y ', T(sg(t2)), ' desde ', X(mt(h2)), '.'], ['Diferencia: ', T(sg(ok)), '.']],
      _datos: { k1, k2 },
    };
  }

  function pozo(rng) {
    const t = rng.elegir([2, 3, 4]), h = 5 * t * t, lugar = rng.elegir(['un pozo seco', 'una quebrada honda']);
    const tc = caer(h).tSuelo, ts = h / 340, ok = tc + ts;
    return {
      enunciado: [`Sueltas una piedra en ${lugar} de `, X(mt(h)), ' de profundidad.'],
      pregunta: ['¿Cuánto después de soltarla oyes el golpe en el fondo?'],
      datos: [...DB5, D.sonido], correcta: ok, fmt: sg,
      errores: [
        e('C-SIN-SONIDO', tc, x => `Bien la caída, ${x}. Pero el sonido también tarda en subir.`),
        e('C-VUELTA', 2 * tc, x => `Bien la caída. Pero el sonido sube a unos 340 m/s, no como la piedra; así sale ${x}.`),
        e('C-SONIDO-DOBLE', tc + 2 * ts, x => `Bien la caída y el sonido a 340 m/s. Pero el sonido solo sube, una vez; así sale ${x}.`),
        e('C-MEDIO', Math.sqrt(h / G) + ts, x => `Bien sumar lo del sonido. Pero en la caída t² = 2h ÷ g: falta el 2; así sale ${x}.`),
      ],
      solucion: [['La piedra baja en ', T(`√(2 · ${h} ÷ 10) = ${sg(tc)}`), '; el sonido sube en ', T(`${h} ÷ 340 = ${sg(ts)}`), '.'], ['En total, ', T(sg(ok)), '.']],
      _datos: { t },
    };
  }

  // ======================= Idea B6: lanzamiento vertical =======================

  const patea = v0 => M.lanzamientoVertical({ v0 });   // el motor: subida, altura máxima, vuelta al piso
  function subida(rng) {
    const v0 = rng.entero(5, 20), L = patea(v0), ok = L.tSubida;
    return {
      enunciado: ['Pateas una pelota hacia arriba con ', V(`v_0 = ${ms(v0)}`), ' junto al pabellón.'],
      pregunta: ['¿Cuánto tarda en llegar a lo más alto?'],
      datos: DB6, correcta: ok, fmt: sg,
      errores: [
        e('C-ALTURA', L.H, x => `Bien que uses g. Pero el tiempo sale de v_0 entre g, no de la altura: ${f(L.H)} m es la altura máxima; ${x} no es.`),
        e('C-VUELTA', 2 * ok, x => `Bien v_0 ÷ g para subir. Pero ${x} es subir y volver a bajar; piden solo hasta lo más alto.`),
        e('C-MITAD-T', ok / 2, x => `Bien v_0 y g. Pero en lo más alto v = 0: 0 = v_0 − g · t, sin dividir entre 2; así sale ${x}.`),
      ],
      solucion: [['En lo más alto, v = 0: 0 = ', V(f(v0)), ' − ', A(f(G)), ' · t.'], ['t = ', `${v0} ÷ 10 = `, T(sg(ok)), '.']],
      _datos: { v0 },
    };
  }

  function alturaMax(rng) {
    const v0 = rng.entero(4, 20), L = patea(v0), ok = L.H;
    if (v0 === 12 || v0 === 10 || v0 === 20) return null;   // ejemplos de la unidad y de su glosario
    return {
      enunciado: ['Lanzas una pelota hacia arriba con ', V(`v_0 = ${ms(v0)}`), '.'],
      pregunta: ['¿Qué altura máxima alcanza?'],
      datos: DB6, correcta: ok, fmt: mt,
      errores: [
        e('C-MEDIO', 2 * ok, x => `Bien v_0². Pero se divide entre 2 · g: 0 = v_0² − 2 · g · H; sin el 2 sale ${x}.`),
        e('C-TIEMPO', L.tSubida, x => `Bien v_0 ÷ g = ${f(L.tSubida)} s. Pero ese es el tiempo de subida; piden la altura. ${x} no es.`),
        e('C-VUELTA', 2 * L.tSubida, x => `Bien usar v_0 y g. Pero ${f(2 * L.tSubida)} s es el tiempo de subir y bajar; ${x} no es la altura.`),
      ],
      solucion: [['En lo más alto, v = 0: 0 = ', V(`${v0}²`), ' − 2 · ', A(f(G)), ' · ', X('H'), '.'], ['', X('H'), ` = ${v0 * v0} ÷ 20 = `, X(mt(ok)), '.']],
      _datos: { v0 },
    };
  }

  function velocidadT(rng) {
    const v0 = rng.entero(10, 20), t = rng.entero(1, 4), ok = M.movil(patea(v0).movil).v(t);
    if (ok === 0 || ((v0 === 35 || v0 === 25) && t === 4) || (v0 === 20 && t === 3)) return null;   // la prueba fis-02 y un ejemplo
    return {
      enunciado: ['Pateas una pelota hacia arriba con ', V(`v_0 = ${ms(v0)}`), '. El eje va hacia arriba.'],
      pregunta: ['¿Qué velocidad tiene en ', T(`t = ${sg(t)}`), ', con su signo?'],
      datos: DB6, correcta: ok, fmt: ms, negativos: true,
      errores: [
        e('K3', v0 + G * t, x => `Bien que uses g · t. Pero g tira hacia abajo: se resta; así sale ${x}.`),
        e('K-SIGNO', -ok, x => `Bien el valor de la rapidez. Pero ${ok < 0 ? 'ya pasó lo más alto: va hacia abajo' : 'todavía sube: va hacia arriba'}; ${x} tiene el signo al revés.`),
        e('K-TIEMPO', v0 - G, x => `Bien v_0 − g = ${x}. Pero esa es la velocidad después de un segundo; ${t - 1 === 1 ? 'falta 1 s más' : `faltan ${t - 1} s más`}.`),
        e('C-SIN-V0', -G * t, x => `Bien −g · t = ${x}: lo que cambió. Pero salió con ${v0} m/s hacia arriba; falta sumarlos.`),
      ],
      solucion: [['v = ', V(f(v0)), ' − ', A(f(G)), ' · ', T(f(t)), ' = ', V(ms(ok)), ok < 0 ? ': ya va hacia abajo.' : ': todavía sube.']],
      _datos: { v0, t },
    };
  }

  function posicionT(rng) {
    const v0 = rng.entero(10, 20), t = rng.elegir([1, 1.5, 2, 2.5, 3, 3.5]), L = patea(v0), y = M.movil(L.movil).x(t);
    if (y <= 0 || igual(t, L.tSubida) || (v0 === 20 && t === 3)) return null;
    return {
      enunciado: ['Pateas una pelota hacia arriba desde el patio con ', V(`v_0 = ${ms(v0)}`), '.'],
      pregunta: ['¿A qué altura sobre el patio está en ', T(`t = ${sg(t)}`), '?'],
      datos: DB6, correcta: y, fmt: mt,
      errores: [
        e('K3', v0 * t + G * t * t / 2, x => `Bien v_0 · t y ½ · g · t². Pero g tira hacia abajo: se resta; así sale ${x}.`),
        e('C-MEDIO', v0 * t - G * t * t, x => `Bien restar el término de g. Pero lleva un ½: ½ · g · t²; sin él sale ${x}.`),
        e('C-SIN-G', v0 * t, x => `Bien v_0 · t. Pero eso sería sin gravedad: falta restar ½ · g · t²; así sale ${x}.`),
        igual(L.H, y) ? null : e('C-ALTURA', L.H, x => `Bien que la pelota suba. Pero ${x} es su altura máxima; a los ${f(t)} s está en otro lugar.`),
        e('C-SOLO-G', G * t * t / 2, x => `Bien ½ · g · t² = ${x}. Pero eso es lo que le quitó la gravedad; falta v_0 · t.`),
      ],
      solucion: [['y = ', V(f(v0)), ' · ', T(f(t)), ' − ½ · ', A(f(G)), ' · ', T(`${f(t)}²`), ` = ${f(v0 * t)} − ${f(G * t * t / 2)} = `, X(mt(y)), t > L.tSubida ? ': ya va bajando.' : ': todavía sube.']],
      _datos: { v0, t },
    };
  }

  function velocidadY(rng) {
    const v0 = rng.entero(10, 20), vb = rng.entero(2, v0 - 2), y = (v0 * v0 - vb * vb) / (2 * G);
    if (!Number.isInteger(y) || (v0 === 20 && y === 15)) return null;
    const m = M.movil(patea(v0).movil), tb = (v0 + vb) / G, ok = m.v(tb);
    if (Math.abs(m.x(tb) - y) > 1e-9) return null;
    return {
      enunciado: ['Pateas una pelota hacia arriba con ', V(`v_0 = ${ms(v0)}`), '. El eje va hacia arriba.'],
      pregunta: ['¿Qué velocidad tiene, con su signo, cuando pasa por ', X(mt(y)), ' al bajar?'],
      datos: DB6, correcta: ok, fmt: ms, negativos: true,
      errores: [
        e('K-SIGNO', -ok, x => `Bien el valor de la rapidez. Pero al bajar va hacia el −; ${x} tiene el signo al revés.`),
        e('K3', -Math.sqrt(v0 * v0 + 2 * G * y), x => `Bien la raíz y el signo de bajada. Pero al subir g quita velocidad: v_0² − 2 · g · y; con + sale ${x}.`),
        e('C-SIN-V0', -Math.sqrt(2 * G * y), x => `Bien 2 · g · y y la raíz. Pero salió con ${v0} m/s: falta v_0²; así sale ${x}.`),
        e('C-MEDIO', -Math.sqrt(v0 * v0 - G * y), x => `Bien v_0² y la raíz. Pero lleva 2 · g · y; sin el 2 sale ${x}.`),
      ],
      solucion: [['v² = ', V(`${v0}²`), ' − 2 · ', A(f(G)), ' · ', X(f(y)), ` = ${vb * vb}, así que |v| = ${vb} m/s.`], ['Al bajar va hacia el −: ', V(`v = ${ms(ok)}`), '.']],
      _datos: { v0, vb },
    };
  }

  function kmhAltura(rng) {
    const k0 = rng.elegir([36, 54, 72]), v0 = k0 / 3.6, L = patea(v0), ok = L.H;
    return {
      enunciado: ['Pateas una pelota hacia arriba a ', V(kmh(k0)), '.'],
      pregunta: ['¿Qué altura máxima alcanza?'],
      datos: [...DB6, D.kmh], correcta: ok, fmt: mt,
      errores: [
        e('U1-kmh', k0 * k0 / (2 * G), x => `Bien 0 = v_0² − 2 · g · H. Pero con los km/h: falta pasar a m/s; así sale ${x}.`),
        e('C-MEDIO', 2 * ok, x => `Bien ${f(v0)} m/s al cuadrado. Pero se divide entre 2 · g; sin el 2 sale ${x}.`),
        e('C-TIEMPO', L.tSubida, x => `Bien ${f(v0)} m/s ÷ g. Pero ese es el tiempo de subida, en segundos; ${x} no es la altura.`),
      ],
      solucion: [['En m/s: ', V(`${k0} km/h = ${ms(v0)}`), '.'], ['', X('H'), ` = ${f(v0)}² ÷ (2 · 10) = `, X(mt(ok)), '.']],
      _datos: { k0 },
    };
  }

  function azotea(rng) {
    const v0 = rng.elegir([5, 10, 15]), t = rng.entero(2, 5), Y0 = 5 * t * t - v0 * t;
    if (Y0 < 5 || Y0 > 40 || (Y0 === 15 && v0 === 10)) return null;
    const ok = M.lanzamientoVertical({ y0: Y0, v0 }).tSuelo;
    if (!igual(ok, t)) return null;
    const tv = 2 * v0 / G, tl = Math.sqrt(2 * Y0 / G);
    return {
      enunciado: ['Desde una azotea a ', X(mt(Y0)), ' del patio, lanzas una pelota hacia arriba con ', V(`v_0 = ${ms(v0)}`), '.'],
      pregunta: ['¿Cuánto tarda en llegar al patio?'],
      datos: [...DB6, D.cuadratica], correcta: ok, fmt: sg,
      errores: [
        e('C-VUELTA', tv, x => `Bien la subida y la bajada. Pero ${x} es cuando vuelve a la altura de la azotea; todavía le falta bajar hasta el patio.`),
        e('C-SOLTAR', tl, x => `Bien la caída de ${Y0} m. Pero ${x} sería si la soltaras desde la azotea; primero sube.`),
        e('C-SUBIDA', v0 / G, x => `Bien v_0 ÷ g. Pero ${x} es solo el tiempo de subida hasta lo más alto; después baja todo.`),
        e('C-VUELTA-SOLTAR', tv + tl, x => `Bien que suba, vuelva y caiga. Pero al pasar por la azotea ya baja a ${v0} m/s, no desde el reposo; así sale ${x}.`),
      ],
      solucion: [
        ['El patio está en y = ', X(`−${Y0} m`), ': −', `${Y0} = ${v0} · t − 5 · t².`],
        [`5t² − ${v0}t − ${Y0} = 0 da t = `, T(sg(ok)), ' (la otra raíz es negativa).'],
      ],
      _datos: { v0, t },
    };
  }

  function encuentro(rng, forzado) {
    const sub = forzado || rng.elegir(['tiempo', 'altura']);
    const v0 = rng.elegir([10, 12, 15, 18, 20]), t = rng.elegir([1, 1.5, 2]), H = v0 * t;
    if ((H === 40 && v0 === 20) || H < 15) return null;
    const piedra = { x0: H, v0: 0, a: -G }, pelota = patea(v0).movil, [te] = M.cruces(piedra, pelota, 10);
    if (te === undefined || !igual(te, t)) return null;
    const y = M.movil(pelota).x(te);
    if (y <= 0 || y >= H) return null;
    const enunciado = ['Desde lo alto de un edificio de ', X(mt(H)), ' sueltas una piedra y, a la vez, desde el suelo lanzan una pelota hacia arriba con ', V(`v_0 = ${ms(v0)}`), ', en la misma vertical.'];
    const sol = [['Piedra: y = ', X(f(H)), ' − 5 · ', T('t²'), '. Pelota: y = ', V(f(v0)), ' · ', T('t'), ' − 5 · ', T('t²'), '.'],
      ['Iguales: ', `${f(H)} = ${v0} · t, así que t = `, T(sg(te)), ', a ', X(`y = ${mt(y)}`), ' del suelo.']];
    if (sub === 'tiempo') return {
      enunciado, pregunta: ['¿A los cuántos segundos se encuentran?'],
      datos: DB6, correcta: te, fmt: sg,
      errores: [
        e('C-ENC-MITAD', te / 2, x => `Bien que se acerquen. Pero se acercan a la rapidez de la pelota, ${v0} m/s, sin dividir; así sale ${x}.`),
        e('C-ENC-CAIDA', Math.sqrt(2 * H / G), x => `Bien la caída de la piedra. Pero ${x} es lo que tardaría en caer todo, sin encontrarse.`),
        e('C-SUBIDA', v0 / G, x => `Bien v_0 ÷ g. Pero ${x} es el tiempo de subida de la pelota; se encuentran antes o después.`),
      ],
      solucion: sol, _datos: { sub, v0, t },
    };
    return {
      enunciado, pregunta: ['¿A qué altura del suelo se encuentran?'],
      datos: DB6, correcta: y, fmt: mt,
      errores: [
        e('C-ENC-CAIDO', H - y, x => `Bien el instante del encuentro, ${f(te)} s. Pero ${x} es lo que bajó la piedra; la altura es lo que le queda.`),
        e('C-ENC-SIN-G', v0 * te, x => `Bien v_0 · t para la pelota. Pero también la frena g: falta restar ½ · g · t²; así sale ${x}.`),
        igual(patea(v0).H, y) ? null : e('C-ALTURA', patea(v0).H, x => `Bien que la pelota suba. Pero ${x} es su altura máxima; se encuentran en otro lugar.`),
        e('C-ENC-MITAD-H', H / 2, x => `Bien que se encuentren entre el suelo y el techo. Pero no a la mitad: la piedra gana velocidad y la pelota la pierde. ${x} no es.`),
      ],
      solucion: sol, _datos: { sub, v0, t },
    };
  }

  function retorno(rng, forzado) {
    const sub = forzado || rng.elegir(['v0', 'altura']);
    const Tt = rng.elegir([1, 1.2, 1.6, 2, 2.4, 2.8, 3, 3.6]);
    if (Tt === 4) return null;   // un ejemplo de la unidad
    const v0 = G * Tt / 2, L = patea(v0);
    if (!igual(L.tSuelo, Tt)) return null;
    const enunciado = ['Lanzas una pelota hacia arriba y vuelve a tu mano ', T(sg(Tt)), ' después.'];
    const sol = [['Sube y baja en el mismo tiempo: sube ', T(sg(Tt / 2)), '. En lo más alto, v = 0: ', V(`v_0 = ${f(G)} · ${f(Tt / 2)} = ${ms(v0)}`), '.']];
    if (sub === 'v0') return {
      enunciado, pregunta: ['¿Con qué rapidez salió?'],
      datos: DB6, correcta: v0, fmt: ms,
      errores: [
        e('C-VUELTA', G * Tt, x => `Bien v_0 = g · t. Pero ${f(Tt)} s es subir y bajar; sube solo la mitad. Así sale ${x}.`),
        e('C-CUARTO', G * Tt / 4, x => `Bien la mitad para subir. Pero no se divide otra vez; así sale ${x}.`),
        e('C-ALTURA', L.H, x => `Bien el tiempo de subida. Pero ${x} es la altura que alcanza, en metros.`),
      ],
      solucion: sol, _datos: { sub, T: Tt },
    };
    return {
      enunciado, pregunta: ['¿Qué altura alcanzó sobre tu mano?'],
      datos: DB6, correcta: L.H, fmt: mt,
      errores: [
        e('C-VUELTA', G * Tt * Tt / 2, x => `Bien ½ · g · t². Pero ${f(Tt)} s es subir y bajar; baja solo la mitad del tiempo. Así sale ${x}.`),
        e('C-MEDIO', G * (Tt / 2) ** 2, x => `Bien la mitad del tiempo para bajar. Pero lo que cae lleva un ½: ½ · g · t²; así sale ${x}.`),
        e('C-TIEMPO', v0, x => `Bien v_0 = ${f(v0)} m/s. Pero ese número es la rapidez de salida; ${x} no es la altura.`),
      ],
      solucion: [...sol, ['Baja desde el reposo en ', T(sg(Tt / 2)), ': ', X('H'), ` = ½ · 10 · ${f(Tt / 2)}² = `, X(mt(L.H)), '.']],
      _datos: { sub, T: Tt },
    };
  }

  const CONSTRUIR = {
    acel, velocidad, tiempo, kmh: kmhB1, izquierda, medias, velocimetro,
    avance, frenado, posicion, v2, 'kmh-frenado': kmhFrenado, horaria, proporcion, enesimo,
    pendiente, area, retroceso, tramos, 'cruza-eje': cruzaEje, tren, 'area-acel': areaAcel,
    'at-v': atV, forma, 'igual-velocidad': igualVelocidad, 'tramos-at': tramosAt, alcance, 'at-distancia': atDistancia,
    'alcance-detras': alcanceDetras, separacion,
    altura, 'caida-v': caidaV, 'caida-t': caidaT, regla, 'caida-kmh': caidaKmh, doble, 'caida-enesimo': caidaEnesimo,
    'dos-esferas': dosEsferas, pozo,
    subida, 'altura-max': alturaMax, 'velocidad-t': velocidadT, 'posicion-t': posicionT, 'velocidad-y': velocidadY,
    'kmh-altura': kmhAltura, azotea, encuentro, retorno,
  };

  return { id: ID, titulo: 'MRUV y caída libre', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
