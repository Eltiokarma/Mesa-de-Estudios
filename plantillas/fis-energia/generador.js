/*
 * Generador «Trabajo, energía y potencia»: la práctica de las seis ideas de fisica.trabajo-y-energia
 * (contenido/teoria/fisica/trabajo-y-energia.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['fis-energia']) y en Node (require). 19 nov 2026, etapa 8 (docs/etapa8/propuesta-fisica.md §7).
 *
 * La física vive en el motor de la escena (plantillas/energia/motor.js: trabajos, energias, rapidez, trabajoResorte y
 * potencia, con g = 10 m/s² y los senos del examen), que este generador llama y no copia. En el navegador, si la escena no
 * lo cargó, se pide al mismo servidor antes de registrarse (como fis-dinamica con el suyo).
 *
 * Objetos (propuesta §2 y §8): la caja, el trineo y el costal arrastrados; el carrito y la bicicleta; el libro, la olla y
 * el resorte; el tobogán y la montaña rusa; la rampa de tablones y la pelota que bota; la grúa, la bomba y el tractor.
 * Valores de problema, sin fuente.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las seis con el mismo peso.
 *   trabajo-y-angulo          inclinada (1) el trabajo de una cuerda inclinada · roce (2) el trabajo del rozamiento ·
 *                             oblicua (3) el rozamiento con la cuerda inclinada (San Marcos 2019-II)
 *   trabajo-energia-cinetica  delta (1) el trabajo neto entre dos rapideces · empujon (2) la rapidez tras empujar contra
 *                             el rozamiento · frenadoMu (3) μ_k con la distancia de frenado (San Marcos 2024-I)
 *   energia-potencial         epg (1) la energía con una referencia que no es el piso · epe (2) un resorte en cm ·
 *                             estirar (3) estirar desde el largo natural, de x₁ a x₂
 *   conservacion-energia      rampa (1) la rapidez al pie · desnivel (2) con rapidez al empezar (San Marcos 2024-I) ·
 *                             vertical (3) el estiramiento máximo del resorte vertical (San Marcos 2025-II)
 *   energia-y-rozamiento      calor (1) la energía cinética abajo, con el calor dado · botes (2) los botes que pierden
 *                             un porcentaje (San Marcos 2024-II) · aspera (3) la rapidez al pie de una rampa áspera de 37°
 *   potencia-y-eficiencia     grua (1) la potencia útil · consumida (2) lo que consume con su eficiencia (2024-I) ·
 *                             tractor (3) la rapidez en la cuesta con rozamiento (San Marcos 2023-I)
 *
 * Colores (los de la unidad): el peso y su trabajo carmín, la normal violeta, la mano o la cuerda naranja, el
 * rozamiento turquesa; las energías, el trabajo neto y la potencia en tinta; sin verde. Ninguna explicación nombra una
 * letra de alternativa. Datos (contrato, punto 13): la fórmula de cada idea, los senos del examen; nunca la respuesta.
 * Errores: los códigos de la unidad (cabecera de la teoría y docs/investigacion/estatica-energia-ideas-erroneas.md,
 * «Trabajo, energía y potencia (19 nov 2026)»): W1, W14 y W15 con el respaldo del informe; los demás son hipótesis.
 * La práctica no repite ninguna Predice de la unidad (ni la mochila, ni 90 J para 3 m/s, ni la maceta, ni los
 * toboganes de 4 m, ni las rampas de 3 m, ni el motor que entrega 500 W con el 80 %).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const motor = nodo ? require('../energia/motor.js') : (root.MotorEnergia || cargarMotor(root));
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones, motor);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;

  function cargarMotor(r) {
    const doc = r.document, actual = doc && doc.currentScript;
    const url = new URL('../energia/motor.js', actual && actual.src ? actual.src : r.location.href).href;
    const x = new XMLHttpRequest();
    x.open('GET', url, false);
    x.send(null);
    if (x.status !== 200 && x.status !== 0) throw new Error('fis-energia: no se pudo cargar el motor de energía');
    const s = doc.createElement('script');
    s.text = `${x.responseText}\n//# sourceURL=${url}`;
    doc.head.appendChild(s);
    if (!r.MotorEnergia) throw new Error('fis-energia: el motor de energía no se registró');
    return r.MotorEnergia;
  }
})(typeof self !== 'undefined' ? self : this, function (Azar, P, M) {
  'use strict';
  const ID = 'fis-energia';
  const ENE = 'docs/investigacion/estatica-energia-ideas-erroneas.md';
  const G = M.G;
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d).replace(/ /g, ' ');
  const J = x => `${f(x)} J`, W_ = x => `${f(x)} W`, ms = x => `${f(x)} m/s`, mt = x => `${f(x)} m`, nw = x => `${f(x)} N`;
  const igual = (a, b) => Math.abs(a - b) < 1e-9;
  const exacto = x => Number.isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;

  const VARS = { mg: { nombre: 'el peso', color: 'h' }, N: { nombre: 'la normal', color: 'f' }, F: { nombre: 'la mano, la cuerda o el motor', color: 'o' }, f: { nombre: 'el rozamiento', color: 'i' } };
  const Ff = t => v('F', t), Fr = t => v('f', t), Fp = t => v('mg', t);

  const RESPALDO = { W1: 'documentado', W14: 'documentado', W15: 'parcial' };
  const e = (id, valor, explicar) => ({ id, valor, explicar });

  const D = {
    trabajo: 'Trabajo de una fuerza constante: W = F · d · cos θ, con θ entre la fuerza y el avance',
    cos: 'cos 0° = 1 y cos 180° = −1',
    trig: 'sen 37° = 0,6 y cos 37° = 0,8; sen 53° = 0,8 y cos 53° = 0,6 (convención del examen)',
    peso: 'Peso: m · g, con g = 10 m/s²',
    comp: 'Una fuerza F a θ sobre la horizontal: F · cos θ de lado y F · sen θ hacia arriba',
    normal: 'Si no sube ni baja, lo vertical suma cero',
    cin: 'Rozamiento cinético: f_k = μ_k · N mientras desliza, contra el deslizamiento',
    ec: 'Energía cinética: E_C = ½ · m · v²',
    teorema: 'Trabajo neto: W_neto = ½ · m · v² − ½ · m · v₀²',
    suma: 'W_neto: la suma, con su signo, de los trabajos de todas las fuerzas',
    epg: 'Energía potencial gravitatoria: E_PG = m · g · h, con h sobre la referencia (negativa debajo)',
    epe: 'Energía potencial elástica: E_PE = ½ · k · x², con x la deformación en metros',
    cm: '1 m = 100 cm',
    conserva: 'Sin rozamiento: E_M al inicio = E_M al final, con E_M = E_C + E_PG + E_PE',
    balance: 'Con rozamiento: E_M al final = E_M al inicio + W_f, con W_f = −f_k · d',
    rampa: 'En una rampa de ángulo θ: la normal es m · g · cos θ y el largo, h / sen θ',
    pierde: 'Si pierde un p % de su energía, le queda (100 − p) %',
    potencia: 'Potencia: P = W / t (1 W = 1 J/s); para subir a rapidez constante, W = m · g · h',
    efic: 'Eficiencia: η = P_útil / P_consumida; un porcentaje se divide entre 100',
    fv: 'A rapidez constante: P = F · v, con F en la dirección de v',
    kw: '1 kW = 1000 W',
    g: 'g = 10 m/s²',
    cuesta: 'En una rampa de ángulo θ, el peso tira m · g · sen θ rampa abajo',
    constante: 'A rapidez constante, la fuerza neta es cero',
    calor: 'Lo que se vuelve calor vale lo mismo que −W_f',
  };

  const TIPOS_POR_IDEA = {
    'trabajo-y-angulo': ['inclinada', 'roce', 'oblicua'],
    'trabajo-energia-cinetica': ['delta', 'empujon', 'frenadoMu'],
    'energia-potencial': ['epg', 'epe', 'estirar'],
    'conservacion-energia': ['rampa', 'desnivel', 'vertical'],
    'energia-y-rozamiento': ['calor', 'botes', 'aspera'],
    'potencia-y-eficiencia': ['grua', 'consumida', 'tractor'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { inclinada: 1, roce: 2, oblicua: 3, delta: 1, empujon: 2, frenadoMu: 3, epg: 1, epe: 2, estirar: 3, rampa: 1, desnivel: 2, vertical: 3,
    calor: 1, botes: 2, aspera: 3, grua: 1, consumida: 2, tractor: 3 };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-10»): de menos a más.
  const PAPEL = { 'papel-1': 'inclinada', 'papel-2': 'delta', 'papel-3': 'epe', 'papel-4': 'rampa', 'papel-5': 'grua', 'papel-6': 'botes',
    'papel-7': 'oblicua', 'papel-8': 'vertical', 'papel-9': 'aspera', 'papel-10': 'tractor' };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && PAPEL[String(semilla)];
    const tipo = forzado || rng.elegir(TIPOS_POR_IDEA[TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS)]);
    for (let intento = 0; intento < 800; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      const p = pr && cerrar(rng, semilla, tipo, pr);
      if (p) return p;
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  function cerrar(rng, semilla, tipo, o) {
    if (!exacto(o.correcta) || !(o.correcta > 0)) return null;
    // g en los Datos de todo problema que usa el peso (lector en frío B de la teoría, 20 nov)
    if (o.datos.some(l => /m · g|peso/.test(l)) && !o.datos.some(l => /g = 10 m\/s²/.test(l))) o.datos = [...o.datos, D.g];
    const ok = o.fmt(o.correcta);
    // los datos no traen la respuesta escrita
    if (o.datos.some(l => new RegExp(`(?<![\\d,])${ok.replace(/[/()·]/g, '\\$&')}(?![\\d²])`).test(l))) return null;
    const vistos = new Set([ok]), errores = [];
    for (const x of o.errores) {
      // Un error que da la correcta descarta el caso: quien se equivoca así acertaría (auditoría de Estática, M4).
      if (x && Number.isFinite(x.valor) && (igual(x.valor, o.correcta) || o.fmt(x.valor) === ok)) return null;
      if (!x || !Number.isFinite(x.valor) || x.valor <= 0 || Math.abs(x.valor - o.correcta) < 0.02 * o.correcta) continue;
      const t = o.fmt(x.valor);
      if (vistos.has(t)) continue;
      vistos.add(t);
      errores.push(Object.assign({}, x, { texto: t, explicacion: x.explicar(t), respaldo: RESPALDO[x.id] || 'hipotesis', fuente: ENE }));
    }
    if (errores.length < 3) return null;
    const alternativas = P.armar({ correcta: o.correcta, errores: errores.slice(0, 4), rng, texto: o.fmt });
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    return {
      id: `${ID}#${semilla}`, variables: Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])])),
      enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos, alternativas, solucion: o.solucion,
      respuesta: { valor: o.correcta, unidad: o.unidad || '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }

  // ======================= 1: trabajo de una fuerza =======================
  function inclinada(rng) {
    const cosa = rng.elegir(['una caja', 'un trineo de arena', 'una maleta']), Fv = rng.elegir([20, 25, 50, 75, 100]), ang = rng.elegir([37, 53]), d = rng.elegir([2, 4, 6, 8, 12]);
    if (Fv === 40 && ang === 37 && d === 5) return null;   // la misión
    if (Fv === 50 && ang === 37 && d === 6) return null;   // el ejemplo 1.2
    const { cos, sen } = M.notable(ang), Wv = M.trabajos({ m: 1, d, F: Fv * cos, mu: 0 }).WF;
    return {
      enunciado: [`Jalas ${cosa} con una cuerda a ${ang}° sobre la horizontal, con `, Ff(nw(Fv)), `, mientras avanza ${mt(d)} por el piso.`],
      pregunta: ['¿Cuánto trabajo hace la cuerda?'], datos: [D.trabajo, D.trig], correcta: Wv, fmt: J,
      errores: [
        e('TR-SIN-COS', Fv * d, x => `Bien fuerza por distancia. Pero la cuerda va inclinada: solo cuenta su parte a lo largo del piso; sin el coseno sale ${x}.`),
        e('TR-SENO', Fv * d * sen, x => `Bien inclinar la fuerza. Pero el seno da la parte que levanta, que no avanza; así sale ${x}.`),
        e('TR-SIN-D', Fv * cos, x => `Bien la parte a lo largo del piso, ${x} en número. Falta multiplicarla por la distancia.`),
      ],
      solucion: [[`A lo largo del piso van ${f(Fv)} · ${f(cos)} = ${nw(Fv * cos)}.`], [`W = ${f(Fv * cos)} · ${f(d)} = ${J(Wv)}.`]],
      _datos: { F: Fv, ang, d },
    };
  }
  function roce(rng) {
    const cosa = rng.elegir(['un costal', 'una caja', 'un mueble']), m = rng.elegir([10, 15, 20, 30, 40]), mu = rng.elegir([0.1, 0.2, 0.25, 0.4]), d = rng.elegir([2, 3, 5, 8]);
    if (m === 20 && mu === 0.3 && d === 5) return null;   // el ejemplo 1.9
    const r = M.trabajos({ m, d, mu, angulo: 0, sentido: 'arriba', F: 'constante' }), Wr = -r.Wroce;
    return {
      enunciado: [`Arrastras ${cosa} de ${m} kg a lo largo de ${mt(d)} por un piso horizontal, con una cuerda horizontal. Entre el piso y la carga, μ_k = ${f(mu)}.`],
      pregunta: ['¿Cuánta energía disipa el rozamiento (el valor de su trabajo, sin el signo)?'], datos: [D.peso, D.normal, D.cin, D.trabajo, D.cos], correcta: Wr, fmt: J,
      errores: [
        e('TR-SIN-G', mu * m * d, x => `Bien μ_k por la distancia. Pero la normal es el peso, m · g: sin g sale ${x}.`),
        e('TR-SIN-MU', m * G * d, x => `Bien la normal por la distancia. Pero el rozamiento es μ_k por la normal; sin μ_k sale ${x}.`),
        e('TR-SIN-D', mu * m * G, x => `Bien el rozamiento, ${x} en número. Falta multiplicarlo por la distancia.`),
      ],
      solucion: [[`La normal es el peso: ${m * G} N; el rozamiento, ${f(mu)} · ${m * G} = `, Fr(nw(r.roce)), '.'], [`Su trabajo vale −${f(r.roce)} · ${f(d)} = −${J(Wr)}: disipa ${J(Wr)}.`]],
      _datos: { m, mu, d },
    };
  }
  function oblicua(rng) {
    const m = rng.elegir([8, 10, 12, 20]), Fv = rng.elegir([20, 40, 50, 100]), mu = rng.elegir([0.2, 0.25, 0.5]), d = rng.elegir([2, 3, 4, 5]);
    const Nn = m * G - Fv * 0.6, fr = mu * Nn, Wr = fr * d;
    if (!(Nn > 0) || !(Fv * 0.8 > fr)) return null;
    if (m === 10 && Fv === 50 && mu === 0.5 && d === 4) return null;   // el ejemplo 1.11
    return {
      enunciado: [`Un bloque de ${m} kg es arrastrado ${mt(d)} por un piso horizontal con una cuerda que jala con `, Ff(nw(Fv)), ` a 37° sobre la horizontal. Entre el piso y el bloque, μ_k = ${f(mu)}.`],
      pregunta: ['¿Cuánta energía disipa el rozamiento?'], datos: [D.peso, D.comp, D.trig, D.normal, D.cin, D.trabajo], correcta: Wr, fmt: J,
      errores: [
        e('N-MG', mu * m * G * d, x => `Bien μ_k por la normal y por la distancia. Pero la cuerda levanta un poco: con la normal igual al peso sale ${x}.`),
        e('N-SUMA', mu * (m * G + Fv * 0.6) * d, x => `Bien mirar lo vertical de la cuerda. Pero jala hacia arriba: se resta; sumando sale ${x}.`),
        e('TR-CUERDA', Fv * 0.8 * d, x => `Bien la parte de la cuerda a lo largo del piso. Pero ${x} es el trabajo de la cuerda, no el del rozamiento.`),
        e('TR-SIN-D', fr, x => `Bien el rozamiento, ${x} en número. Falta multiplicarlo por los ${f(d)} m.`),
      ],
      solucion: [['La normal: ', v('N', `N = ${m * G} − ${f(Fv)} · 0,6 = ${nw(Nn)}`), '.'], ['El rozamiento: ', Fr(`f_k = ${f(mu)} · ${f(Nn)} = ${nw(fr)}`), `; disipa ${f(fr)} · ${f(d)} = ${J(Wr)}.`]],
      _datos: { m, F: Fv, mu, d },
    };
  }

  // ======================= 2: trabajo neto y energía cinética =======================
  function delta(rng) {
    const [cosa, ms_, v0s, vs] = rng.elegir([['un carrito', [20, 30, 40], [1, 2], [3, 4, 5]], ['una bicicleta con su ciclista', [60, 70, 80], [2, 4], [6, 8]], ['una pelota', [0.4, 0.5], [5, 10], [15, 20]]]);
    const m = rng.elegir(ms_), v0 = rng.elegir(v0s), vf = rng.elegir(vs);
    if (m === 80 && v0 === 5) return null;   // el ejemplo 2.8
    const Wv = M.energias({ m, v: vf }).Ec - M.energias({ m, v: v0 }).Ec;
    return {
      enunciado: [`${cosa[0].toUpperCase() + cosa.slice(1)} de ${f(m)} kg pasa de ${ms(v0)} a ${ms(vf)}.`],
      pregunta: [`¿Cuánto trabajo neto se hizo sobre ${cosa.startsWith('una') ? 'ella' : 'él'}?`], datos: [D.teorema], correcta: Wv, fmt: J,
      errores: [
        e('TE-SIN-V0', m * vf * vf / 2, x => `Bien la energía del final, ${x}. Pero ya tenía energía al empezar: se resta.`),
        e('TE-RESTA-V', m * (vf - v0) ** 2 / 2, x => `Bien la fórmula. Pero se restan energías, no rapideces antes de elevar; así sale ${x}.`),
        e('TE-SIN-MEDIO', m * (vf * vf - v0 * v0), x => `Bien la diferencia. Pero falta el ½ de la energía cinética; sin él sale ${x}.`),
      ],
      solucion: [[`Al final: ½ · ${f(m)} · ${vf}² = ${J(m * vf * vf / 2)}; al empezar: ½ · ${f(m)} · ${v0}² = ${J(m * v0 * v0 / 2)}.`], [`W_neto = ${J(Wv)}.`]],
      _datos: { m, v0, v: vf },
    };
  }
  function empujon(rng) {
    const m = rng.elegir([4, 5, 8, 10, 20]), Fv = rng.elegir([30, 40, 60, 80]), fr = rng.elegir([10, 20]), d = rng.elegir([2, 3, 4, 5, 6]);
    if (m === 10 && Fv === 50) return null;   // el ejemplo 2.6
    const Wn = (Fv - fr) * d, vf = Math.sqrt(2 * Wn / m);
    if (!(Fv > fr) || !exacto(vf) || vf > 10) return null;
    return {
      enunciado: [`Empujas desde el reposo un carrito de ${m} kg con `, Ff(nw(Fv)), ` horizontales a lo largo de ${mt(d)}, y el piso lo frena con `, Fr(nw(fr)), '.'],
      pregunta: ['¿Con qué rapidez queda?'], datos: [D.suma, D.teorema], correcta: vf, fmt: ms,
      errores: [
        e('TE-SIN-ROCE', Math.sqrt(2 * Fv * d / m), x => `Bien el teorema. Pero el rozamiento también trabaja, en contra; sin él sale ${x}.`),
        e('TE-SIN-RAIZ', 2 * Wn / m, x => `Bien el trabajo neto. Pero eso es v²; sin la raíz sale ${x}.`),
        e('TE-SIN-DOS', Math.sqrt(Wn / m), x => `Bien el trabajo neto. Pero el ½ de la energía deja un 2 al despejar; sin él sale ${x}.`),
        e('TE-SUMA-ROCE', Math.sqrt(2 * (Fv + fr) * d / m), x => `Bien sumar los dos trabajos. Pero el del rozamiento es negativo: se resta; sumando sale ${x}.`),
      ],
      solucion: [[`W_neto = ${f(Fv)} · ${f(d)} − ${f(fr)} · ${f(d)} = ${J(Wn)}.`], [`½ · ${m} · v² = ${f(Wn)}: v = ${ms(vf)}.`]],
      _datos: { m, F: Fv, f: fr, d },
    };
  }
  function frenadoMu(rng) {
    const v0 = rng.elegir([4, 6, 8, 10, 12]), d = rng.elegir([4, 5, 8, 10, 16, 20]), mu = v0 * v0 / (2 * G * d);
    if (v0 === 10 && d === 25) return null;   // el ejemplo 2.11
    if (!(mu >= 0.1 && mu <= 0.8) || !exacto(mu)) return null;
    return {
      enunciado: [`Una caja desliza por un piso horizontal a ${ms(v0)} y el rozamiento la detiene en ${mt(d)}.`],
      pregunta: ['¿Cuánto vale el coeficiente de rozamiento cinético?'], datos: [D.teorema, D.cin, D.peso, D.normal, D.trabajo], correcta: mu, fmt: x => f(x),
      errores: [
        e('TE-SIN-MEDIO', v0 * v0 / (G * d), x => `Bien igualar el trabajo del rozamiento a la energía. Pero la cinética lleva el ½; sin él sale ${x}.`),
        e('TE-LINEAL', v0 / (2 * G * d), x => `Bien el planteo. Pero la energía va con v², no con v; así sale ${x}.`),
        e('TE-INVIERTE', 2 * G * d / (v0 * v0), x => `Bien la ecuación. Pero al despejar μ_k la fracción va al revés; así sale ${x}.`),
      ],
      solucion: [[`El rozamiento quita toda la energía cinética; la masa se cancela: μ_k · 10 · ${f(d)} = ½ · ${v0}².`], [`μ_k = ${f(mu)}.`]],
      _datos: { v0, d },
    };
  }

  // ======================= 3: energía potencial =======================
  function epg(rng) {
    const cosa = rng.elegir(['Una caja', 'Una olla', 'Un balde']), m = rng.elegir([2, 3, 4, 5]), h1 = rng.elegir([1.2, 1.5, 2, 2.4]), h0 = rng.elegir([0.5, 0.8, 1]);
    const E = M.energias({ m, y: h1 - h0 }).Ep;
    return {
      enunciado: [`${cosa} de ${m} kg está en un estante a ${mt(h1)} del piso. La referencia es una mesa de ${mt(h0)} de alto.`],
      pregunta: ['¿Cuánto vale su energía potencial gravitatoria?'], datos: [D.epg, D.peso], correcta: E, fmt: J,
      errores: [
        e('EP-REF', m * G * h1, x => `Bien m · g · h. Pero h se mide desde la referencia que dan, no desde el piso; así sale ${x}.`),
        e('EP-SIN-G', m * Math.abs(h1 - h0), x => `Bien la altura sobre la referencia. Pero falta g; sin ella sale ${x}.`),
        e('EP-SUMA', m * G * (h1 + h0), x => `Bien usar las dos alturas. Pero se restan; sumando sale ${x}.`),
      ],
      solucion: [[`Sobre la referencia: h = ${f(h1)} − ${f(h0)} = ${f(h1 - h0)} m.`], [`E_PG = ${m} · 10 · ${f(h1 - h0)} = ${J(E)}.`]],
      _datos: { m, h1, h0 },
    };
  }
  function epe(rng) {
    const k = rng.elegir([200, 400, 500, 800, 1000]), xc = rng.elegir([5, 10, 20, 30]), x = xc / 100, E = M.trabajoResorte(k, 0, x);
    if ((k === 200 || k === 400) && xc === 10) return null;   // los ejemplos 3.4 y Mira
    if (rng.moneda()) {
      // la deformación, en centímetros, con la energía que guarda
      if (!exacto(E)) return null;
      return {
        enunciado: [`Un resorte de ${k} N/m está comprimido y guarda ${J(E)}.`],
        pregunta: ['¿Cuántos centímetros está comprimido?'], datos: [D.epe, D.cm], correcta: xc, fmt: x2 => `${f(x2)} cm`,
        errores: [
          e('EP-SIN-RAIZ', 100 * 2 * E / k, x2 => `Bien despejar x². Pero eso es x² en metros cuadrados; sin la raíz sale ${x2}.`),
          e('EP-SIN-MEDIO', 100 * Math.sqrt(E / k), x2 => `Bien la raíz. Pero el ½ deja un 2 al despejar; sin él sale ${x2}.`),
          e('EP-INVIERTE', 100 * Math.sqrt(k / (2 * E)), x2 => `Bien la raíz. Pero al despejar x² la fracción va al revés; así sale ${x2}.`),
        ],
        solucion: [[`x² = 2 · ${f(E)} ÷ ${k} = ${f(x * x, 4)} m²; x = ${f(x)} m.`], [`En centímetros: ${xc} cm.`]],
        _datos: { k, xc, variante: 'x' },
      };
    }
    return {
      enunciado: [`Un resorte de ${k} N/m se comprime ${xc} cm.`],
      pregunta: ['¿Cuánta energía potencial elástica guarda?'], datos: [D.epe, D.cm], correcta: E, fmt: J,
      errores: [
        e('EP-LINEAL', k * x / 2, x2 => `Bien el ½ y la k. Pero x va al cuadrado; así sale ${x2}.`),
        e('EP-SIN-MEDIO', k * x * x, x2 => `Bien k por x al cuadrado. Pero el área es un triángulo: lleva el ½; sin él sale ${x2}.`),
        e('EP-CM', k * xc * xc / 2, x2 => `Bien la fórmula. Pero x va en metros; con centímetros sale ${x2}.`),
      ],
      solucion: [[`En metros, x = ${f(x)} m.`], [`E_PE = ½ · ${k} · ${f(x)}² = ${J(E)}.`]],
      _datos: { k, xc, variante: 'E' },
    };
  }
  function estirar(rng) {
    const k = rng.elegir([200, 400, 500, 800]), L0 = rng.elegir([10, 15, 20]), a = rng.elegir([5, 10]), b = rng.elegir([15, 20, 25]);
    const x1 = a / 100, x2 = b / 100, Wv = M.trabajoResorte(k, x1, x2);
    if (!exacto(Wv)) return null;
    return {
      enunciado: [`Un resorte de ${k} N/m mide ${L0} cm sin deformar. Lo estiras desde que mide ${L0 + a} cm hasta que mide ${L0 + b} cm.`],
      pregunta: ['¿Cuánto trabajo cuesta?'], datos: [D.epe, D.cm], correcta: Wv, fmt: J,
      errores: [
        e('EP-DIF', M.trabajoResorte(k, 0, x2 - x1), x => `Bien las dos deformaciones. Pero se restan las energías, no las deformaciones antes de elevar; así sale ${x}.`),
        e('EP-FINAL', M.trabajoResorte(k, 0, x2), x => `Bien la energía del final, ${x}. Pero ya estaba estirado: se resta la del comienzo.`),
        e('EP-LARGO', M.trabajoResorte(k, (L0 + a) / 100, (L0 + b) / 100), x => `Bien restar las energías. Pero x se mide desde el largo natural, no desde 0; así sale ${x}.`),
      ],
      solucion: [[`Deformaciones: ${f(x1)} m y ${f(x2)} m.`], [`W = ½ · ${k} · (${f(x2)}² − ${f(x1)}²) = ${J(Wv)}.`]],
      _datos: { k, L0, a, b },
    };
  }

  // ======================= 4: conservación =======================
  function rampa(rng) {
    const cosa = rng.elegir(['un bloque de hielo, por una rampa', 'un niño, por un tobogán', 'un trineo, por una duna']).split(', '), hh = rng.elegir([0.45, 1.25, 2.45, 4.05, 7.2, 11.25]);
    const vf = M.rapidez(hh, 0, 0, G);
    return {
      enunciado: [`Sin rozamiento, ${cosa[0]} baja ${cosa[1]} de ${mt(hh)} de alto, desde el reposo.`],
      pregunta: ['¿Con qué rapidez llega abajo?'], datos: [D.conserva, D.epg, D.ec], correcta: vf, fmt: ms,
      errores: [
        e('CE-SIN-RAIZ', 2 * G * hh, x => `Bien igualar las energías. Pero eso es v²; sin la raíz sale ${x}.`),
        e('TE-SIN-DOS', Math.sqrt(G * hh), x => `Bien la raíz. Pero el ½ de la cinética deja un 2 al despejar; sin él sale ${x}.`),
        e('CE-GH', G * hh, x => `Bien usar g y h. Pero falta el 2 y falta la raíz; así sale ${x}.`),
      ],
      solucion: [[`La energía potencial de arriba es la cinética de abajo: v² = 2 · 10 · ${f(hh)}.`], [`v = ${ms(vf)}.`]],
      _datos: { h: hh },
    };
  }
  function desnivel(rng) {
    const v0 = rng.elegir([2, 4, 6, 8, 10]), dh = rng.elegir([1.6, 2.4, 3, 4.2, 5, 6.4]), vf = M.rapidez(dh, 0, v0, G);
    if (!exacto(vf) || (v0 === 4 && dh === 2.4)) return null;
    return {
      enunciado: [`Un carrito de montaña rusa pasa por un punto a ${ms(v0)} y baja, sin rozamiento, hasta otro punto ${mt(dh)} más abajo.`],
      pregunta: ['¿Con qué rapidez pasa por ese punto?'], datos: [D.conserva, D.epg, D.ec], correcta: vf, fmt: ms,
      errores: [
        e('CE-SIN-V0', Math.sqrt(2 * G * dh), x => `Bien la bajada. Pero ya traía rapidez; sin su energía sale ${x}.`),
        e('CE-SUMA-V', v0 + Math.sqrt(2 * G * dh), x => `Bien las dos partes. Pero se suman energías, no rapideces; así sale ${x}.`),
        e('TE-SIN-DOS', Math.sqrt(v0 * v0 + G * dh), x => `Bien sumar lo que traía. Pero la bajada aporta 2 · g · h a v²; así sale ${x}.`),
      ],
      solucion: [[`Por kilo: v² = ${v0}² + 2 · 10 · ${f(dh)} = ${f(vf * vf)}.`], [`v = ${ms(vf)}.`]],
      _datos: { v0, dh },
    };
  }
  function vertical(rng) {
    const m = rng.elegir([1, 2, 3, 5]), k = rng.elegir([100, 200, 250, 500]), x = 2 * m * G / k;
    if (!exacto(x) || (m === 4 && k === 400)) return null;
    return {
      enunciado: [`Cuelgas un bloque de ${m} kg de un resorte de ${k} N/m que está en su largo natural, y lo sueltas desde el reposo.`],
      pregunta: ['¿Cuánto se estira el resorte como máximo?'], datos: [D.conserva, D.epg, D.epe], correcta: x, fmt: mt,
      errores: [
        e('CE-EQUILIBRIO', m * G / k, x2 => `Bien, ahí se quedaría quieto: ${x2}. Pero suelto, pasa de largo hasta el doble.`),
        e('EP-SIN-MEDIO', m * G / (2 * k), x2 => `Bien igualar las energías. Pero el ½ va con el resorte, no con el peso; así sale ${x2}.`),
        e('EP-SIN-G', 2 * m / k, x2 => `Bien el planteo. Pero lo que baja aporta m · g · x; sin g sale ${x2}.`),
        e('EP-RAIZ', Math.sqrt(2 * m * G / k), x2 => `Bien igualar las energías. Pero se cancela una x de cada lado, no se saca raíz; así sale ${x2}.`),
      ],
      solucion: [[`Abajo del todo se detiene: ${m} · 10 · x = ½ · ${k} · x².`], [`x = ${mt(x)}.`]],
      _datos: { m, k },
    };
  }

  // ======================= 5: energía con rozamiento =======================
  function calor(rng) {
    const [cosa, mm] = rng.elegir([['Un bloque', [2, 4, 5]], ['Un niño', [25, 30, 40]], ['Una caja', [3, 6, 10]]]), m = rng.elegir(mm), hh = rng.elegir([1.5, 2, 3, 4, 5]);
    const E = M.energias({ m, y: hh }).Ep, Q = Math.round(E * rng.elegir([0.1, 0.2, 0.3, 0.4]));
    if (!(Q > 0 && Q < E)) return null;
    return {
      enunciado: [`${cosa} de ${m} kg baja desde ${mt(hh)} de alto, partiendo del reposo, y el rozamiento convierte ${J(Q)} en calor.`],
      pregunta: ['¿Con qué energía cinética llega abajo?'], datos: [D.balance, D.calor, D.epg], correcta: E - Q, fmt: J,
      errores: [
        e('CE-ROCE', E, x => `Bien la energía de arriba, ${x}. Así llegaría sin rozamiento; aquí una parte se volvió calor.`),
        e('W14', E + Q, x => `Bien juntar las dos. Pero el calor sale de la misma energía: se resta; sumando sale ${x}.`),
        e('RZ-CALOR', Q, x => `Bien el calor, ${x}. Pero esa es la parte que se fue, no la que llega como movimiento.`),
      ],
      solucion: [[`Arriba: ${m} · 10 · ${f(hh)} = ${J(E)}.`], [`Abajo llega E_C = ${f(E)} − ${f(Q)} = ${J(E - Q)}.`]],
      _datos: { m, h: hh, Q },
    };
  }
  function botes(rng) {
    const H = rng.elegir([2, 4, 5, 8, 10]), p = rng.elegir([10, 20, 25, 50]), n = rng.elegir([1, 2, 3]), q = 1 - p / 100, hh = H * q ** n;
    const malas = [H * (1 - n * p / 100), n >= 2 ? H * q : H * p / 100, H * q ** (2 * n)];
    if (!exacto(hh) || !(malas[0] > 0) || (H === 5 && p === 20 && n === 2) || (H === 2 && p === 25)) return null;
    const cual = ['primer', 'segundo', 'tercer'][n - 1];
    return {
      enunciado: [`Una pelota se suelta desde ${mt(H)} y en cada bote pierde el ${p} % de su energía.`],
      pregunta: [`¿Hasta qué altura sube después del ${cual} bote?`], datos: [D.pierde, D.epg], correcta: hh, fmt: mt,
      errores: [
        e('RZ-LINEAL', malas[0], x => `Bien la pérdida de cada bote. Pero cada ${p} % es de lo que traía, no del comienzo; así sale ${x}.`),
        e(n >= 2 ? 'RZ-UNO' : 'RZ-PIERDE', malas[1], x => (n >= 2 ? `Bien un bote, ${x}. Pero hay que repetirlo en cada bote.` : `Bien el porcentaje. Pero ${x} es lo que pierde, no lo que le queda.`)),
        e('RZ-TRAMO', malas[2], x => `Bien multiplicar por lo que queda. Pero pierde en cada bote, no al bajar y al subir; así sale ${x}.`),
      ],
      solucion: [[`En cada bote le queda el ${100 - p} % de la energía, y la altura va con ella.`], [`h = ${f(H)}${` · ${f(q)}`.repeat(n)} = ${mt(hh)}.`]],
      _datos: { H, p, n },
    };
  }
  function aspera(rng) {
    const hh = rng.elegir([1.25, 1.8, 2.5, 3.2, 4.5, 5, 7.2]), mu = rng.elegir([0.15, 0.3, 0.45]);
    const r = M.trabajos({ m: 1, d: hh / 0.6, angulo: 37, mu, sentido: 'abajo', v0: 0 }), vf = r.v;
    if (!exacto(vf) || (hh === 3 && mu === 0.3)) return null;
    return {
      enunciado: [`Una caja baja desde el reposo por una rampa de 37° y ${mt(hh)} de alto, con μ_k = ${f(mu)}.`],
      pregunta: ['¿Con qué rapidez llega abajo?'], datos: [D.balance, D.rampa, D.trig, D.cin], correcta: vf, fmt: ms,
      errores: [
        e('CE-ROCE', M.rapidez(hh, 0, 0, G), x => `Bien la energía de arriba. Así sería sin rozamiento; aquí la rampa le quita una parte. Sale ${x}.`),
        e('RZ-NMG', Math.sqrt(2 * G * hh - 2 * mu * G * hh / 0.6), x => `Bien restar el rozamiento. Pero en la rampa la normal es m · g · cos 37°; con el peso entero sale ${x}.`),
        e('CE-SIN-RAIZ', vf * vf, x => `Bien el balance. Pero eso es v²; sin la raíz sale ${x}.`),
      ],
      solucion: [[`Por kilo: arriba ${f(G * hh)} J; el rozamiento quita ${f(mu)} · 8 · ${f(hh / 0.6)} = ${J(mu * 8 * hh / 0.6)}.`], [`½ · v² = ${f(vf * vf / 2)}: v = ${ms(vf)}.`]],
      _datos: { h: hh, mu },
    };
  }

  // ======================= 6: potencia y eficiencia =======================
  function grua(rng) {
    const cosa = rng.elegir(['Una grúa', 'Un montacargas', 'Un torno']), m = rng.elegir([40, 80, 100, 200]), hh = rng.elegir([5, 10, 15, 20]), min = rng.entero(1, 10) <= 3, t = min ? rng.elegir([1, 2]) : rng.elegir([5, 10, 20, 25]);
    const ts = min ? 60 * t : t, r = M.potencia({ m, h: hh, t: ts });
    return {
      enunciado: [`${cosa} sube ${m} kg a ${mt(hh)} de altura en ${t} ${min ? (t === 1 ? 'minuto' : 'minutos') : 's'}, a rapidez constante.`],
      pregunta: ['¿Qué potencia útil desarrolla?'], datos: [D.potencia, D.peso, ...(min ? ['1 min = 60 s'] : [])], correcta: r.Putil, fmt: W_,
      errores: [
        e('W15', r.W, x => `Bien el trabajo, ${x} en número. Pero la potencia lo reparte entre los segundos.`),
        e('PO-SIN-G', m * hh / ts, x => `Bien dividir entre el tiempo. Pero el trabajo es el peso por la altura; sin g sale ${x}.`),
        min ? e('PO-MIN', r.W / t, x => `Bien el trabajo entre el tiempo. Pero el tiempo va en segundos; en minutos sale ${x}.`)
          : e('PO-FUERZA', m * G, x => `Bien el peso de la carga, ${x} en número. Pero esa es una fuerza; la potencia es trabajo por segundo.`),
      ],
      solucion: [[`W = ${m} · 10 · ${f(hh)} = ${J(r.W)}, en ${ts} s.`], [`P = ${f(r.W)} / ${ts} = ${W_(r.Putil)}.`]],
      _datos: { m, h: hh, t, min },
    };
  }
  function consumida(rng) {
    const cosa = rng.elegir(['Un motor', 'Una bomba', 'Una licuadora']), Pu = rng.elegir([300, 600, 900, 1200, 1500]), ef = rng.elegir([0.6, 0.75, 0.9]), Pc = Pu / ef;
    if (!exacto(Pc)) return null;
    return {
      enunciado: [`${cosa} con una eficiencia del ${f(ef * 100)} % entrega ${W_(Pu)} útiles.`],
      pregunta: ['¿Qué potencia consume?'], datos: [D.efic], correcta: Pc, fmt: W_,
      errores: [
        e('PO-EFIC', Pu * ef, x => `Bien usar la eficiencia. Pero lo consumido es más que lo útil: se divide; multiplicando sale ${x}.`),
        e('PO-IGNORA', Pu, x => `Bien, ${x} es lo que entrega. Pero consume más, porque pierde una parte.`),
        e('PO-SUMA', Pu * (2 - ef), x => `Bien que consume más. Pero lo perdido es una fracción de lo consumido, no de lo útil; así sale ${x}.`),
        e('PO-PIERDE', Pu / (1 - ef), x => `Bien dividir lo útil. Pero entre la eficiencia, no entre lo que pierde; así sale ${x}.`),
      ],
      solucion: [['Lo útil entre la eficiencia:'], [`P_consumida = ${f(Pu)} / ${f(ef)} = ${W_(Pc)}.`]],
      _datos: { Pu, ef },
    };
  }
  function tractor(rng) {
    const m = rng.elegir([1000, 1500, 2000]), mu = rng.elegir([0.25, 0.5]), Pk = rng.elegir([24, 30, 36, 48]), Fv = m * G * (0.6 + mu * 0.8), vf = Pk * 1000 / Fv;
    if (!exacto(vf)) return null;
    return {
      enunciado: [`Un tractor con su remolque suma ${m} kg y desarrolla ${Pk} kW útiles. Sube una cuesta de 37° con μ_k = ${f(mu)}, a rapidez constante.`],
      pregunta: ['¿Con qué rapidez sube?'], datos: [D.fv, D.constante, D.cuesta, D.rampa, D.cin, D.trig, D.kw], correcta: vf, fmt: ms,
      errores: [
        e('PO-SIN-ROCE', Pk * 1000 / (m * G * 0.6), x => `Bien el peso a lo largo de la cuesta. Pero falta el rozamiento; sin él sale ${x}.`),
        e('PO-SIN-PESO', Pk * 1000 / (m * G * mu * 0.8), x => `Bien el rozamiento. Pero en la cuesta el peso también tira hacia abajo; sin él sale ${x}.`),
        e('N-MG', Pk * 1000 / (m * G * (0.6 + mu)), x => `Bien sumar las dos. Pero en la cuesta la normal es m · g · cos 37°; con el peso entero sale ${x}.`),
      ],
      solucion: [['El motor vence ', Ff(`F = ${m * G} · 0,6 + ${f(mu)} · ${m * G} · 0,8 = ${nw(Fv)}`), '.'], [`v = ${f(Pk * 1000)} / ${f(Fv)} = ${ms(vf)}.`]],
      _datos: { m, mu, P: Pk },
    };
  }

  const CONSTRUIR = { inclinada, roce, oblicua, delta, empujon, frenadoMu, epg, epe, estirar, rampa, desnivel, vertical, calor, botes, aspera, grua, consumida, tractor };
  return { id: ID, titulo: 'Trabajo, energía y potencia', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
