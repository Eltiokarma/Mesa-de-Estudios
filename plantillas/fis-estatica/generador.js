/*
 * Generador «Estática»: la práctica de las seis ideas de fisica.estatica (contenido/teoria/fisica/estatica.js).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['fis-estatica']) y en Node
 * (require). 19 nov 2026, etapa 6 (docs/etapa6/propuesta-fisica.md §7).
 *
 * La física de la barra, el nudo con dos cuerdas, la rampa con roce y el momento de una fuerza vive en el motor de la
 * escena (plantillas/estatica/motor.js: barra, nudo, planoRoce, momentoFuerza, con g = 10 m/s² y los senos del examen),
 * que este generador llama y no copia. En el navegador, si la escena no lo cargó, se pide al mismo servidor antes de
 * registrarse (como fis-parabolico con el suyo). Las cuentas de una sola línea (la normal con una fuerza vertical, el
 * resorte, la polea móvil) se hacen aquí.
 *
 * Objetos (propuesta §2 y §8): el costal sobre la balanza de la bodega, cajas apiladas, la persona que sube una pesa; el
 * letrero colgado de dos cables, la escaladora contra la pared; el ropero, la caja en la rampa, la caja jalada con ángulo;
 * la balanza de resorte del mercado, la polea móvil con resorte; la llave, el sube y baja; el tablón del pintor, la barra
 * sobre un caballete, la escalera en la pared lisa. Valores de problema, sin fuente.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las seis con el mismo peso.
 *   diagrama-y-parejas    balanza (1) lo que marca con una cuerda o una mano · apiladas (2) la normal del piso o entre
 *                         cajas · pesa (3) la persona que sube una pesa a velocidad constante (San Marcos 2019-I)
 *   nudo-en-equilibrio    simetrico (1) cables iguales · asimetrico (2) 37° y 53° · pared (3) la escaladora (2023-II)
 *   rozamiento-se-ajusta  quieto (1) cuánto frena el piso · rampa (2) la caja quieta en la rampa · oblicua (3) la normal
 *                         con la fuerza inclinada a velocidad constante (2025-I)
 *   resorte-proporcional  estira (1) cuánto se estira · largo (2) cuánto mide · polea (3) la carga en la polea móvil con
 *                         un resorte (2027-I)
 *   torque-y-brazo        torque (1) fuerza perpendicular · balancin (2) dónde equilibra · inclinada (3) la llave con
 *                         ángulo
 *   cuerpo-rigido         apoyos (2) el tablón con el pintor · caballete (2) la carga que equilibra una barra · escalera
 *                         (3) el rozamiento del piso con la pared lisa (2021)
 *
 * Colores (los de la unidad, un color por clase de fuerza): peso carmín, normal y apoyos violeta, tensión y mano naranja,
 * rozamiento turquesa; sin verde. Ninguna explicación nombra una letra de alternativa.
 * Datos (contrato, punto 13): la ley de cada idea, los senos del examen y las equivalencias; nunca la respuesta.
 * Errores: los códigos de la unidad (cabecera de la teoría y docs/investigacion/estatica-energia-ideas-erroneas.md,
 * «Estática (19 nov)»): E1, E8 y E10 con respaldo del informe; los demás son hipótesis.
 * La práctica no repite ninguna Predice de la unidad (ni 40 kg con 100 N, ni 37°/53° con 100 N, ni 120 N con tope de
 * 200 N, ni el pintor sobre el caballete B).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const motor = nodo ? require('../estatica/motor.js') : (root.MotorEstatica || cargarMotor(root));
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones, motor);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;

  function cargarMotor(r) {
    const doc = r.document, actual = doc && doc.currentScript;
    const url = new URL('../estatica/motor.js', actual && actual.src ? actual.src : r.location.href).href;
    const x = new XMLHttpRequest();
    x.open('GET', url, false);
    x.send(null);
    if (x.status !== 200 && x.status !== 0) throw new Error('fis-estatica: no se pudo cargar el motor de estática');
    const s = doc.createElement('script');
    s.text = `${x.responseText}\n//# sourceURL=${url}`;
    doc.head.appendChild(s);
    if (!r.MotorEstatica) throw new Error('fis-estatica: el motor de estática no se registró');
    return r.MotorEstatica;
  }
})(typeof self !== 'undefined' ? self : this, function (Azar, P, M) {
  'use strict';
  const ID = 'fis-estatica';
  const EST = 'docs/investigacion/estatica-energia-ideas-erroneas.md';
  const G = M.G;
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d).replace(/ /g, ' ');
  const nw = x => `${f(x)} N`, mt = x => `${f(x)} m`, cm = x => `${f(x)} cm`, nm = x => `${f(x)} N·m`, kg = x => `${f(x)} kg`;
  const igual = (a, b) => Math.abs(a - b) < 1e-9;
  const exacto = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const S = a => M.trig(a).sen, C = a => M.trig(a).cos;

  const VARS = { P: { nombre: 'el peso', color: 'h' }, N: { nombre: 'la normal', color: 'f' }, T: { nombre: 'la tensión o la mano', color: 'o' }, f: { nombre: 'el rozamiento', color: 'i' } };
  const Pp = t => v('P', t), Nn = t => v('N', t), Tt = t => v('T', t), Ff = t => v('f', t);

  const RESPALDO = { E1: 'documentado', E8: 'documentado', E10: 'documentado' };
  const e = (id, valor, explicar) => ({ id, valor, explicar });

  const D = {
    peso: 'Peso: P = m · g, con g = 10 m/s² (convención del examen)',
    primera: 'Quieto o a velocidad constante, las fuerzas suman cero: lo de arriba iguala a lo de abajo',
    tercera: 'Tercera ley: la fuerza de A sobre B es igual y opuesta a la de B sobre A',
    balanza: 'La balanza marca con qué fuerza la aprietan: la normal que hace sobre lo que se apoya',
    comp: 'Una fuerza F que forma θ con la horizontal: F · cos θ de lado y F · sen θ hacia arriba',
    equil: 'Partícula en equilibrio: lo horizontal suma cero y lo vertical suma cero',
    trig: 'sen 37° = cos 53° = 3/5 y cos 37° = sen 53° = 4/5 (convención del examen)',
    trig30: 'sen 30° = cos 60° = 1/2 y cos 30° = sen 60° = √3/2',
    est: 'Rozamiento estático: f_s ≤ μ_s · N; quieto, vale lo que haga falta hasta ese tope',
    cin: 'Rozamiento cinético: f_k = μ_k · N mientras desliza',
    rampa: 'En una rampa de ángulo θ: P · sen θ a lo largo y P · cos θ contra ella',
    hooke: 'Fuerza elástica: F_e = k · x, con x lo que se estira desde el largo natural',
    largo: 'Largo del resorte: L = L_0 + x, con L_0 el largo natural',
    cm: '1 m = 100 cm',
    polea: 'Una cuerda ideal jala con la misma T en todos sus tramos, también al pasar por una polea',
    tau: 'Torque: τ = F · d, con d el brazo: la distancia del eje a la línea de la fuerza',
    brazo: 'Fuerza que forma θ con una barra, a L del eje: d = L · sen θ',
    giro: 'Sin girar, los torques horarios igualan a los antihorarios',
    rigido: 'Cuerpo rígido en equilibrio: las fuerzas suman cero y los torques, respecto de un punto, también',
    cg: 'El peso de una barra o un tablón parejo actúa en su centro',
    pared: 'Una pared lisa solo empuja perpendicular a ella: no tiene rozamiento',
  };

  const TIPOS_POR_IDEA = {
    'diagrama-y-parejas': ['balanza', 'apiladas', 'pesa'],
    'nudo-en-equilibrio': ['simetrico', 'asimetrico', 'pared'],
    'rozamiento-se-ajusta': ['quieto', 'rampa', 'oblicua'],
    'resorte-proporcional': ['estira', 'largo', 'polea'],
    'torque-y-brazo': ['torque', 'balancin', 'inclinada'],
    'cuerpo-rigido': ['apoyos', 'caballete', 'escalera'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { balanza: 1, apiladas: 2, pesa: 3, simetrico: 1, asimetrico: 2, pared: 3, quieto: 1, rampa: 2, oblicua: 3,
    estira: 1, largo: 2, polea: 3, torque: 1, balancin: 2, inclinada: 3, apoyos: 2, caballete: 2, escalera: 3 };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): de menos a más.
  const PAPEL = { 'papel-1': 'balanza', 'papel-2': 'simetrico', 'papel-3': 'quieto', 'papel-4': 'estira', 'papel-5': 'balancin',
    'papel-6': 'apoyos', 'papel-7': 'oblicua', 'papel-8': 'escalera', 'papel-9': 'pared', 'papel-10': 'polea' };

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
    if (!exacto(o.correcta)) return null;
    const conRespaldo = x => Object.assign({}, x, { explicacion: x.explicar(x.texto), respaldo: RESPALDO[x.id] || 'hipotesis', fuente: EST });
    const ok = o.fmt(o.correcta);
    const vistos = new Set([ok]);
    const errores = [];
    for (const x of o.errores) {
      // Un error que da la correcta descarta el caso: quien se equivoca así acertaría (auditoría del 19 nov: pasaba con
      // el ropero a la mitad del tope, los cables a 30°, el tablón con L = 4a…, y el error se borraba sin avisar).
      if (x && Number.isFinite(x.valor) && igual(x.valor, o.correcta)) return null;
      if (!x || !Number.isFinite(x.valor) || x.valor <= 0 || Math.abs(x.valor - o.correcta) < 0.02 * o.correcta) continue;
      const t = o.fmt(x.valor);
      if (vistos.has(t)) continue;
      vistos.add(t);
      errores.push(conRespaldo(Object.assign({}, x, { texto: t })));
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

  // ======================= 1: primera y tercera ley =======================
  function balanza(rng) {
    const [cosa, lo, quieto] = rng.elegir([['un costal de arroz', 'lo', 'quieto'], ['una caja de frutas', 'la', 'quieta'], ['un saco de papas', 'lo', 'quieto']]), m = rng.elegir([15, 20, 25, 30, 35, 45]), Fz = rng.elegir([50, 60, 80, 120]), abajo = rng.elegir([true, false]);
    if (m === 40 && Fz === 100) return null;   // la Predice
    const Pv = m * G, Nv = abajo ? Pv + Fz : Pv - Fz;
    return {
      enunciado: [`Sobre la balanza de la bodega hay ${cosa} de ${m} kg. ${abajo ? `${lo[0].toUpperCase()}${lo.slice(1)} empujas hacia abajo con la mano, con ` : `Una cuerda ${lo} jala hacia arriba con `}`, Tt(nw(Fz)), ` y sigue ${quieto}.`],
      pregunta: ['¿Cuánto marca la balanza?'], datos: [D.peso, D.primera, D.balanza], correcta: Nv, fmt: nw,
      errores: [
        e('N-MG', Pv, x => `Bien calculado el peso, pero la balanza no marca siempre el peso: la otra fuerza ${abajo ? 'aprieta más' : 'sostiene una parte'}. ${x} sería sin esa fuerza.`),
        e('N-SIGNO', abajo ? Pv - Fz : Pv + Fz, x => `Bien contada esa fuerza, pero con el signo cambiado: ${abajo ? 'la mano empuja hacia abajo, como el peso, y se suma' : 'la cuerda jala hacia arriba y sostiene una parte, así que se resta'}. Así sale ${x}.`),
        e('N-F', Fz, x => `Bien leída esa fuerza, pero la balanza también aguanta el peso del cuerpo, que es lo principal. ${x} es solo la otra fuerza.`),
        e('N-MASA', m, x => `Bien la masa, pero la balanza marca una fuerza, en newtons: primero se pasa la masa a peso. ${x} es la masa con otra unidad.`),
      ],
      solucion: [['El peso es la masa por g: ', Pp(`P = ${m} · 10 = ${nw(Pv)}`), '.'], [abajo ? 'Está quieto, y la balanza aguanta el peso y la mano: ' : 'Está quieto, y la balanza aguanta lo que la cuerda no sostiene: ', Nn(`N = ${Pv} ${abajo ? '+' : '−'} ${Fz} = ${nw(Nv)}`), '.']],
      _datos: { m, F: Fz, abajo },
    };
  }
  function apiladas(rng) {
    const a = rng.elegir([2, 3, 4, 6]), b = rng.elegir([5, 7, 8, 10]), entre = rng.elegir([true, false]), pide = entre ? a * G : (a + b) * G;
    return {
      enunciado: [`Una caja de ${a} kg está sobre otra de ${b} kg, y las dos están quietas en el piso.`],
      pregunta: [entre ? '¿Con qué fuerza empuja la caja de abajo a la de arriba?' : '¿Con qué fuerza empuja el piso a la caja de abajo?'],
      datos: [D.peso, D.primera, D.tercera], correcta: pide, fmt: nw,
      errores: [
        e('ES-SOLO', b * G, x => (entre ? `Bien usado el peso de la caja de abajo, pero la de arriba no la carga: solo necesita que la sostengan a ella. ${x} no es.` : `Bien usado el peso de la caja de abajo, pero la de arriba también la aprieta hacia abajo. ${x} deja fuera esa caja.`)),
        e('ES-PILA', entre ? (a + b) * G : a * G, x => (entre ? `Bien sumados los dos pesos, pero eso es lo que aguanta el piso; la de arriba solo necesita su propio peso. ${x} no es.` : `Bien usado el peso de la caja de arriba, pero el piso sostiene las dos cajas. ${x} deja fuera la de abajo.`)),
        e('N-SIGNO', Math.abs(b - a) * G, x => `Bien usados los dos pesos, pero ninguno se opone al otro: los dos empujan hacia abajo, así que no se restan. ${x} no es.`),
        e('N-MASA', entre ? a : a + b, x => `Bien los kilos, pero la fuerza va en newtons, y cada kilo pesa 10 N. ${x} es la masa.`),
      ],
      solucion: [entre ? ['Sobre la caja de arriba solo actúan su peso y el empujón de la de abajo; quieta, ese empujón iguala su peso: ', Nn(`N = ${a} · 10 = ${nw(pide)}`), '.'] : ['El piso sostiene las dos cajas, porque la de arriba aprieta a la de abajo con su peso: ', Nn(`N = (${a} + ${b}) · 10 = ${nw(pide)}`), '.']],
      _datos: { a, b, entre },
    };
  }
  function pesa(rng) {
    const Mm = rng.elegir([50, 55, 60, 65]), mp = rng.elegir([5, 10, 15, 20]), Nv = (Mm + mp) * G;
    return {
      enunciado: [`Una persona de ${Mm} kg está sobre la balanza y sube una pesa de ${mp} kg a velocidad constante.`],
      pregunta: ['Mientras sube, ¿cuánto marca la balanza?'], datos: [D.peso, D.primera, D.tercera, D.balanza], correcta: Nv, fmt: nw,
      errores: [
        e('N-MG', Mm * G, x => `Bien el peso de la persona, pero la pesa le aprieta las manos con su peso, y eso llega a la balanza. ${x} no es.`),
        e('N-SIGNO', (Mm - mp) * G, x => `Bien contada la pesa, pero empuja las manos hacia abajo, como el peso de la persona, así que se suma. ${x} no es.`),
        e('ES-SUBIR', (Mm + 2 * mp) * G, x => `Bien sumada la pesa, pero una sola vez: a velocidad constante sus fuerzas suman cero y no hace falta fuerza extra. ${x} no es.`),
        e('N-F', mp * G, x => `Bien el peso de la pesa, pero falta lo que pesa la persona, que también está sobre la balanza. ${x} no es.`),
      ],
      solucion: [['A velocidad constante la pesa no acelera: la mano la empuja con su peso y, por la tercera ley, la pesa empuja la mano igual.'], ['La balanza aguanta a la persona y a la pesa: ', Nn(`N = (${Mm} + ${mp}) · 10 = ${nw(Nv)}`), '.']],
      _datos: { M: Mm, mp },
    };
  }

  // ======================= 2: equilibrio de una partícula =======================
  function simetrico(rng) {
    const a = rng.elegir([30, 37, 53]), Pv = rng.elegir([60, 80, 90, 120, 150, 160, 200]);
    const r = M.nudo({ P: Pv, a1: a, a2: a }), Tv = r.T1;
    return {
      enunciado: [`Un letrero de `, Pp(nw(Pv)), ` cuelga de un nudo con dos cables iguales que forman ${a}° con el techo.`],
      pregunta: ['¿Cuánto jala cada cable?'], datos: [D.comp, D.equil, a === 30 ? D.trig30 : D.trig], correcta: Tv, fmt: nw,
      errores: [
        e('E8', Pv / 2, x => `Bien repartido entre dos, pero eso vale con cables verticales: inclinados, solo una parte del jalón sube, y cada uno jala más. ${x} se queda corto.`),
        e('ST-SENCOS', Pv / (2 * C(a)), x => `Bien la idea, pero con el ángulo medido desde el techo, lo que sube va con el seno; el coseno da la parte de lado. Con el coseno sale ${x}.`),
        e('ST-P', Pv, x => `Bien que jale bastante, pero son dos cables y se reparten la carga. ${x} sería un solo cable vertical.`),
        e('ST-POR', Pv * S(a) / 2, x => `Bien usado el seno, pero se divide entre él: la parte que sube, T · sen θ, es la que iguala la mitad del peso. Multiplicando sale ${x}.`),
      ],
      solucion: [['Las partes horizontales se cancelan, porque los cables son iguales, y las verticales de los dos sostienen el peso: ', `2 · T · sen ${a}° = ${Pv}`, '.'], ['Se despeja lo que jala cada uno: ', Tt(`T = ${nw(Tv)}`), '.']],
      _datos: { P: Pv, a },
    };
  }
  function asimetrico(rng) {
    const Pv = rng.elegir([50, 150, 200, 250, 300]), cual = rng.elegir([37, 53]);
    const r = M.nudo({ P: Pv, a1: 37, a2: 53 }), Tv = cual === 37 ? r.T1 : r.T2, otro = cual === 37 ? r.T2 : r.T1;
    return {
      enunciado: ['Un letrero de ', Pp(nw(Pv)), ' cuelga de un nudo con dos cables: uno forma 37° con el techo y el otro, 53°.'],
      pregunta: [`¿Cuánto jala el cable de ${cual}°?`], datos: [D.comp, D.equil, D.trig], correcta: Tv, fmt: nw,
      errores: [
        e('E8', Pv / 2, x => `Bien que se repartan el peso, pero no por mitades: con ángulos distintos, el cable más parado carga más. ${x} no es.`),
        e('E8-b', otro, x => `Bien halladas las dos tensiones, pero ${x} es la del otro cable: el de 53°, más parado, jala más.`),
        e('ST-P', Pv, x => `Bien que jale, pero los dos cables se reparten el peso, y ninguno lo carga solo. ${x} no es.`),
        e('ST-COMP', Tv * S(cual), x => `Bien la parte vertical de ese cable, pero piden todo lo que jala, que es más, porque otra parte va de lado. No es ${x}.`),
      ],
      solucion: [['Con T₁ el cable de 37° y T₂ el de 53°, de lado se cancelan: T₁ · 4/5 = T₂ · 3/5. Hacia arriba suman el peso.'], [`Resolviendo las dos ecuaciones, el de ${cual}° jala `, Tt(`T = ${nw(Tv)}`), '.']],
      _datos: { P: Pv, cual },
    };
  }
  function pared(rng) {
    const m = rng.elegir([45, 50, 60, 70, 80]), a = rng.elegir([37, 53]), Pv = m * G, Tv = Pv / C(a), Nv = Tv * S(a);
    if (!exacto(Tv)) return null;
    return {
      enunciado: [`Una escaladora de ${m} kg está quieta, con los pies contra una pared lisa, colgada de una cuerda que forma ${a}° con la pared.`],
      pregunta: ['¿Con qué fuerza la empuja la pared?'], datos: [D.peso, D.equil, D.trig, D.pared], correcta: Nv, fmt: nw,
      errores: [
        e('ES-PESO', Pv, x => `Bien que la pared empuje, pero una pared lisa empuja de lado y no sostiene el peso. ${x} es el peso, que lo sostiene la cuerda.`),
        e('ST-T', Tv, x => `Bien hallado lo que jala la cuerda, ${x}, pero la pared solo iguala su parte horizontal, que es menor.`),
        e('ST-SENCOS', Pv * S(a), x => `Bien usado el seno, pero sobre la cuerda, no sobre el peso: primero se halla la cuerda con lo vertical. Partir el peso da ${x}.`),
        e('ST-POR', Pv * C(a), x => `Bien partir una fuerza, pero el peso ya es vertical y no tiene parte de lado: se parte la cuerda. ${x} no es.`),
      ],
      solucion: [['La pared lisa solo empuja de lado, así que hacia arriba sostiene solo la cuerda: ', Tt(`T · cos ${a}° = ${Pv}`), `, y T = ${nw(Tv)}.`], ['De lado, la pared iguala la parte horizontal de la cuerda: ', Nn(`N = ${f(Tv)} · sen ${a}° = ${nw(Nv)}`), '.']],
      _datos: { m, a },
    };
  }

  // ======================= 3: rozamiento =======================
  function quieto(rng) {
    const m = rng.elegir([20, 30, 40, 50, 60]), mus = rng.elegir([0.3, 0.4, 0.5, 0.6]), Pv = m * G, tope = mus * Pv, Fz = rng.elegir([0.4, 0.5, 0.6, 0.8]) * tope;
    if (m === 50 && igual(Fz, 120)) return null;   // la Predice
    const r = M.planoRoce({ m, angulo: 0, mus, F: Fz });
    if (!r.quieto) return null;
    return {
      enunciado: [`Un ropero de ${m} kg está en un piso con μ_s = ${f(mus)}. Lo empujas de lado con `, Tt(nw(Fz)), '.'],
      pregunta: ['¿Con cuánta fuerza lo frena el piso?'], datos: [D.peso, D.est, D.primera], correcta: Math.abs(r.roce), fmt: nw,
      errores: [
        e('E10', tope, x => `Bien calculado el tope, ${x}, pero tu empujón no llega a él: mientras no desliza, el piso frena solo lo que haga falta.`),
        e('RZ-RESTA', tope - Fz, x => `Bien comparado con el tope, pero lo que falta para llegar a él no es lo que frena el piso: frena lo que empujas. ${x} no es.`),
        e('RZ-N', Pv, x => `Bien la normal, ${x}, pero el rozamiento es otra fuerza, de lado, y aquí vale mucho menos.`),
        e('RZ-MU', mus * Fz, x => `Bien usado μ_s, pero se multiplica por la normal, no por tu empujón, y solo da el tope. ${x} no es.`),
      ],
      solucion: [['El tope del estático es μ_s por la normal, que aquí es el peso: ', Ff(`f_s máx = ${f(mus)} · ${Pv} = ${nw(tope)}`), '. Tu empujón no llega, así que sigue quieto.'], ['Quieto, el piso frena justo lo que empujas: ', Ff(`f_s = ${nw(Fz)}`), '.']],
      _datos: { m, mus, F: Fz },
    };
  }
  function rampa(rng) {
    const m = rng.elegir([5, 8, 10, 15, 20]), a = rng.elegir([30, 37]), mus = 0.8, pideN = rng.elegir([true, false]);
    const r = M.planoRoce({ m, angulo: a, mus, F: 0 }), val = pideN ? r.N : Math.abs(r.roce);
    return {
      enunciado: [`Una caja de ${m} kg está quieta en una rampa de ${a}°; entre ellas, μ_s = ${f(mus)}.`],
      pregunta: [pideN ? '¿Con cuánta fuerza la empuja la rampa?' : '¿Con cuánta fuerza la sostiene el rozamiento?'],
      datos: [D.peso, D.rampa, D.est, a === 30 ? D.trig30 : D.trig], correcta: val, fmt: nw,
      errores: [
        e('ST-SENCOS', pideN ? m * G * S(a) : m * G * C(a), x => `Bien partido el peso, pero ${pideN ? 'contra la rampa va P · cos θ; P · sen θ es la parte que la haría bajar' : 'a lo largo va P · sen θ; P · cos θ es la parte que la aprieta'}. ${x} es la otra parte.`),
        e('N-MG', m * G, x => `Bien el peso, ${x}, pero en la rampa se parte en dos direcciones, y cada fuerza equilibra solo una parte.`),
        e('E10', mus * m * G * C(a), x => pideN ? `Bien el tope μ_s · N, ${x}, pero ese es el rozamiento más grande posible, y piden lo que empuja la rampa: la normal, que no lleva μ_s e iguala P · cos θ.` : `Bien el tope μ_s · N, ${x}, pero la caja está quieta sin estar a punto de resbalar: el rozamiento vale lo justo.`),
        e('N-MASA', pideN ? m * C(a) : m * S(a), x => `Bien el ángulo, pero se parte el peso, en newtons, no la masa. ${x} no es.`),
      ],
      solucion: [[`El peso, ${nw(m * G)}, se parte en dos: una parte a lo largo de la rampa y otra contra ella.`], pideN ? ['La caja no se hunde: contra la rampa, ', Nn(`N = ${m * G} · cos ${a}° = ${nw(val)}`), '.'] : ['La caja no resbala: a lo largo, el rozamiento iguala la parte que la haría bajar, ', Ff(`f_s = ${m * G} · sen ${a}° = ${nw(val)}`), '.']],
      _datos: { m, a, pideN },
    };
  }
  function oblicua(rng) {
    const m = rng.elegir([20, 25, 30, 40, 50]), Fz = rng.elegir([50, 100, 150]), a = rng.elegir([37, 53]), Pv = m * G, Nv = Pv - Fz * S(a);
    if (Nv <= 0) return null;
    return {
      enunciado: [`Arrastras una caja de ${m} kg a velocidad constante con una fuerza de `, Tt(nw(Fz)), ` que forma ${a}° sobre la horizontal.`],
      pregunta: ['¿Con cuánta fuerza la empuja el piso?'], datos: [D.peso, D.comp, D.trig, D.primera], correcta: Nv, fmt: nw,
      errores: [
        e('N-MG', Pv, x => `Bien que la normal sostenga la caja, pero no sola: tu fuerza inclinada también la sostiene un poco. ${x} no es.`),
        e('N-SIGNO', Pv + Fz * S(a), x => `Bien la parte vertical de tu fuerza, pero jala hacia arriba y ayuda al piso, así que se resta. ${x} no es.`),
        e('ST-SENCOS', Pv - Fz * C(a), x => `Bien restar, pero con θ sobre la horizontal, hacia arriba va F · sen θ; con el coseno sale ${x}.`),
        e('N-F', Fz * S(a), x => `Bien esa parte de tu fuerza, ${x}, pero la normal es lo que pone el piso para el resto del peso.`),
      ],
      solucion: [['Tu fuerza va inclinada, y su parte vertical levanta un poco la caja: ', Tt(`${Fz} · sen ${a}° = ${nw(Fz * S(a))}`), '.'], ['Lo vertical suma cero, así que el piso sostiene el resto del peso: ', Nn(`N = ${Pv} − ${f(Fz * S(a))} = ${nw(Nv)}`), '.']],
      _datos: { m, F: Fz, a },
    };
  }

  // ======================= 4: fuerza elástica =======================
  function estira(rng) {
    const m = rng.elegir([1, 1.5, 2, 3, 4]), k = rng.elegir([200, 250, 400, 500]), Pv = m * G, x = Pv / k * 100;
    return {
      enunciado: [`En la balanza de resorte del mercado, de k = ${k} N/m, cuelgas una bolsa de ${f(m)} kg.`],
      pregunta: ['¿Cuánto se estira el resorte?'], datos: [D.peso, D.hooke, D.primera, D.cm], correcta: x, fmt: cm,
      errores: [
        e('U-cm', Pv / k, x2 => `Bien la división, pero da metros, porque k va en N/m; escrito en centímetros sin pasar es ${x2}.`),
        e('RS-INV', k / Pv, x2 => `Bien usados k y el peso, pero x es la fuerza entre k: un resorte más duro se estira menos. Al revés sale ${x2}.`),
        e('N-MASA', m / k * 100, x2 => `Bien en centímetros, pero el resorte sostiene el peso, en newtons, no la masa. ${x2} no es.`),
        e('RS-DOBLE', 2 * x, x2 => `Bien la proporción, pero ${x2} sería con el doble de peso.`),
      ],
      solucion: [['La bolsa está quieta, así que el resorte la sostiene con su peso: ', Tt(`F_e = ${nw(Pv)}`), '.'], [`La deformación es esa fuerza entre k, en metros, pasada a centímetros: x = ${Pv} ÷ ${k} = ${f(Pv / k, 4)} m = ${cm(x)}.`]],
      unidad: 'cm', _datos: { m, k },
    };
  }
  function largo(rng) {
    const L0 = rng.elegir([10, 15, 20, 25]), m = rng.elegir([1, 2, 3]), k = rng.elegir([200, 400, 500]), x = m * G / k * 100, L = L0 + x;
    return {
      enunciado: [`Un resorte de k = ${k} N/m mide ${L0} cm sin nada colgado. Le cuelgas ${m} kg.`],
      pregunta: ['¿Cuánto mide ahora?'], datos: [D.peso, D.hooke, D.largo, D.cm], correcta: L, fmt: cm,
      errores: [
        e('RS-SOLO-X', x, x2 => `Bien lo que se estira, ${x2}, pero piden cuánto mide: su largo es el natural más eso.`),
        e('RS-ENCOGE', L0 - x, x2 => `Bien calculado x, pero colgado se estira y el largo crece; no baja a ${x2}.`),
        e('RS-LARGO', L0 * (1 + m), x2 => `Bien que crezca con el peso, pero lo proporcional es la deformación, no el largo entero. ${x2} no es.`),
        e('U-cm', L0 + x / 100, x2 => `Bien sumar, pero x salió en metros y el largo está en centímetros; sin pasarlo da ${x2}.`),
      ],
      solucion: [[`Lo que se estira es el peso entre k: x = ${m * G} ÷ ${k} = ${f(x / 100, 4)} m = ${cm(x)}.`], [`Mide su largo natural más lo que se estiró: L = ${L0} + ${f(x)} = ${cm(L)}.`]],
      unidad: 'cm', _datos: { L0, m, k },
    };
  }
  function polea(rng) {
    const Pv = rng.elegir([80, 120, 160, 200, 240]), k = rng.elegir([1000, 2000, 4000]), Tv = Pv / 2, x = Tv / k * 100;
    return {
      enunciado: [`Una carga de `, Pp(nw(Pv)), ` cuelga de una polea móvil liviana. Un tramo vertical de la cuerda va al techo y el otro, a un resorte de ${k} N/m amarrado al techo.`],
      pregunta: ['¿Cuánto se estira el resorte?'], datos: [D.hooke, D.polea, D.equil, D.cm], correcta: x, fmt: cm,
      errores: [
        e('RS-POLEA', Pv / k * 100, x2 => `Bien la ley del resorte, pero el resorte está en un solo tramo, y la polea cuelga de dos: ${x2} es con toda la carga.`),
        e('MS-SUMA', Pv / 4 / k * 100, x2 => `Bien repartir, pero la polea cuelga de dos tramos, no de cuatro. ${x2} no es.`),
        e('U-cm', Tv / k, x2 => `Bien la cuenta, pero salió en metros; sin pasarlo a centímetros da ${x2}.`),
        e('RS-DOBLE', 2 * Pv / k * 100, x2 => `Bien la polea, pero reparte la carga entre los dos tramos, no la duplica. ${x2} no es.`),
      ],
      solucion: [['La polea cuelga de dos tramos con la misma tensión, que se reparten la carga: ', Tt(`T = ${Pv} ÷ 2 = ${nw(Tv)}`), '. El resorte está en un tramo y jala eso.'], [`Se estira esa fuerza entre k: x = ${Tv} ÷ ${k} = ${f(Tv / k, 4)} m = ${cm(x)}.`]],
      unidad: 'cm', _datos: { P: Pv, k },
    };
  }

  // ======================= 5: torque =======================
  function torque(rng) {
    const Fz = rng.elegir([20, 30, 40, 60, 80]), dc = rng.elegir([15, 20, 25, 30, 40]), r = M.momentoFuerza({ F: Fz, d: dc / 100, angulo: 90 });
    return {
      enunciado: [`Jalas la punta de una llave de ${dc} cm con `, Tt(nw(Fz)), ', perpendicular a ella.'],
      pregunta: ['¿Qué torque das?'], datos: [D.tau, D.cm], correcta: Math.abs(r.tau), fmt: nm,
      errores: [
        e('U-cm', Fz * dc, x => `Bien multiplicado, pero el torque va en N·m y el brazo tiene que ir en metros; con centímetros sale ${x}.`),
        e('TQ-DIV', Fz / (dc / 100), x => `Bien usados la fuerza y el brazo, pero se multiplican: más brazo da más giro. Dividir da ${x}.`),
        e('TQ-MITAD', Fz * dc / 200, x => `Bien fuerza por brazo, pero jalas la punta: el brazo es todo el largo. Con la mitad sale ${x}.`),
        e('TQ-SUMA', Fz + dc / 100, x => `Bien usados los dos datos, pero el torque es la fuerza por el brazo, no su suma. ${x} no es.`),
      ],
      solucion: [[`La fuerza es perpendicular, así que el brazo es todo el largo de la llave, ${mt(dc / 100)}.`], [`El torque es la fuerza por el brazo: τ = ${Fz} · ${f(dc / 100)} = ${nm(Math.abs(r.tau))}.`]],
      unidad: 'N·m', _datos: { F: Fz, d: dc },
    };
  }
  function balancin(rng) {
    const ma = rng.elegir([30, 36, 40]), da = rng.elegir([1, 1.5, 2]), mb = rng.elegir([20, 24, 25]), db = ma * da / mb;
    if (!exacto(db) || db > 2.5) return null;   // un sube y baja de verdad: hasta 2,5 m del apoyo
    const r = M.barra({ L: 6, m: 0, apoyos: [{ x: 3 }], cargas: [{ x: 3 - da, F: ma * G }, { x: 3 + db, F: mb * G }] });
    if (Math.abs(r.momentos(3).neto) > 1e-6) return null;
    return {
      enunciado: [`En el sube y baja, una niña de ${ma} kg se sienta a ${mt(da)} del apoyo.`],
      pregunta: [`¿A qué distancia del otro lado debe sentarse un niño de ${mb} kg para que quede horizontal?`], datos: [D.peso, D.tau, D.giro], correcta: db, fmt: mt,
      errores: [
        e('TQ-IGUAL', da, x => `Bien que se equilibre, pero con pesos distintos las distancias no pueden ser iguales: se igualan los torques. ${x} no es.`),
        e('TQ-INV', mb * da / ma, x => `Bien la proporción, pero al revés: el más liviano tiene que ir más lejos. ${x} no es.`),
        e('TQ-RESTA', da + (ma - mb) / 10, x => `Bien que se aleje, pero no se suma la diferencia de kilos: se igualan peso por distancia. ${x} no es.`),
        e('TQ-DOBLE', 2 * db, x => `Bien igualar torques, pero ${x} daría el doble del torque necesario, y bajaría ese lado.`),
      ],
      solucion: [['Para que quede horizontal, los torques se igualan: cada peso por su distancia al apoyo, ', Pp(`${ma * G} · ${f(da)} = ${mb * G} · d`), '.'], [`Se despeja d = ${mt(db)}: el niño, más liviano, va más lejos del apoyo.`]],
      unidad: 'm', _datos: { ma, da, mb },
    };
  }
  function inclinada(rng) {
    const Fz = rng.elegir([40, 50, 60, 100]), L = rng.elegir([0.2, 0.3, 0.4, 0.5]), a = rng.elegir([30, 37, 53]), r = M.momentoFuerza({ F: Fz, d: L, angulo: a });
    return {
      enunciado: [`Jalas la punta de una llave de ${mt(L)} con `, Tt(nw(Fz)), ` que forman ${a}° con la llave.`],
      pregunta: ['¿Qué torque das?'], datos: [D.tau, D.brazo, a === 30 ? D.trig30 : D.trig], correcta: Math.abs(r.tau), fmt: nm,
      errores: [
        e('TQ-BRAZO', Fz * L, x => `Bien fuerza por distancia, pero con la fuerza inclinada el brazo es menor que la llave. ${x} no es.`),
        e('TQ-COS', Fz * L * C(a), x => `Bien acortado el brazo, pero con θ medido desde la llave va con el seno; con el coseno sale ${x}.`),
        e('TQ-DIV', Fz * S(a) / L, x => `Bien la parte de la fuerza que hace girar, pero se multiplica por la distancia al eje, no se divide. ${x} no es.`),
        e('TQ-ENTRE-SEN', Fz * L / S(a), x => `Bien usado el seno, pero inclinar acorta el brazo: se multiplica por sen θ, que es menor que 1. Dividiendo sale ${x}.`),
      ],
      solucion: [[`La fuerza va inclinada, así que el brazo es el largo por el seno del ángulo: ${f(L)} · sen ${a}° = ${mt(Math.abs(r.brazo))}.`], [`El torque es la fuerza por ese brazo: τ = ${Fz} · ${f(Math.abs(r.brazo), 3)} = ${nm(Math.abs(r.tau))}.`]],
      unidad: 'N·m', _datos: { F: Fz, L, a },
    };
  }

  // ======================= 6: cuerpo rígido =======================
  function apoyos(rng) {
    const Pb = rng.elegir([100, 200, 300]), Pv = rng.elegir([500, 600, 700]), x = rng.elegir([0.5, 1, 1.5, 2.5, 3]), pideB = rng.elegir([true, false]);
    if (Pb === 200 && Pv === 600) return null;   // el juego y la Predice
    const r = M.barra({ L: 4, P: Pb, apoyos: [{ x: 0 }, { x: 4 }], cargas: [{ x, F: Pv }] }), val = pideB ? r.R2 : r.R;
    return {
      enunciado: [`Un tablón parejo de 4 m y `, Pp(nw(Pb)), ` está sobre dos caballetes en sus puntas, A y B. Un pintor de `, Pp(nw(Pv)), ` se para a ${mt(x)} de A.`],
      pregunta: [`¿Cuánto empuja el caballete ${pideB ? 'B' : 'A'}?`], datos: [D.rigido, D.cg, D.tau], correcta: val, fmt: nw,
      errores: [
        e('RG-SIN-PESO', pideB ? Pv * x / 4 : Pv * (4 - x) / 4, x2 => `Bien los torques del pintor, pero el tablón también pesa, y su peso va en el centro. ${x2} lo olvida.`),
        e('RG-MITAD', (Pb + Pv) / 2, x2 => `Bien que se repartan el peso, pero por mitades solo si el pintor está en el medio. ${x2} no es.`),
        e('RG-OTRO', pideB ? r.R : r.R2, x2 => `Bien la cuenta, pero ${x2} es lo que empuja el otro caballete; el más cercano al pintor carga más.`),
        e('RG-TODO', Pb + Pv, x2 => `Bien el peso total, ${x2}, pero lo sostienen dos caballetes, y cada uno pone solo una parte.`),
      ],
      solucion: [[`Se toman torques respecto de ${pideB ? 'A' : 'B'}, donde ese caballete no hace torque; el peso del tablón actúa en su centro, a 2 m.`], [`Al despejar, el caballete ${pideB ? 'B' : 'A'} empuja `, Nn(nw(val)), '.']],
      _datos: { Pb, P: Pv, x, pideB },
    };
  }
  function caballete(rng) {
    const L = rng.elegir([3, 4, 6]), m = rng.elegir([10, 20, 30]), a = rng.elegir([0.5, 1]);
    const r = M.barra({ L, m, apoyos: [{ x: a }], cargas: [{ x: 0, F: '?' }] }), Pc = r.incognita;
    if (!(Pc > 0)) return null;
    return {
      enunciado: [`Un tablón parejo de ${mt(L)} y ${kg(m)} está sobre un solo caballete, a ${mt(a)} de su punta A.`],
      pregunta: ['¿Qué peso hay que poner en A para que quede horizontal?'], datos: [D.peso, D.cg, D.tau, D.giro], correcta: Pc, fmt: nw,
      errores: [
        e('E1', m * G * (L - 2 * a) / L, x => `Bien buscado un equilibrio, pero se igualan torques, peso por distancia al caballete, no lo que pesa cada lado. ${x} no es.`),
        e('RG-PUNTA', m * G * (L - a) / a, x => `Bien el brazo de la carga, pero el peso de un tablón parejo va en su centro, no en la otra punta. ${x} no es.`),
        e('TQ-IGUAL', m * G, x => `Bien que equilibre al tablón, pero sus brazos son distintos, así que sus pesos también. ${x} no es.`),
        e('TQ-INV', m * G * a / (L / 2 - a), x => `Bien los brazos, pero cambiados: la carga por ${f(L / 2 - a)} m y el tablón por ${f(a)} m dan ${x}. Cada peso va con el suyo: la carga, ${f(a)} m hasta el caballete, y el tablón, ${f(L / 2 - a)} m; por eso la carga pesa ${a < L / 2 - a ? 'más' : 'menos'} que el tablón.`),
      ],
      solucion: [[`El tablón pesa ${nw(m * G)}, y su peso actúa en su centro, a ${mt(L / 2 - a)} del caballete.`], ['Los torques respecto del caballete se igualan: ', Pp(`P · ${f(a)} = ${m * G} · ${f(L / 2 - a)}`), `, así que P = ${nw(Pc)}.`]],
      _datos: { L, m, a },
    };
  }
  function escalera(rng) {
    const L = rng.elegir([4, 5]), Pe = rng.elegir([100, 150, 200, 300]), a = rng.elegir([37, 53]), Pv = rng.elegir([0, 400, 600]), s = Pv ? rng.elegir([0.5, 0.75]) * L : 0;
    // Torques respecto del pie (motor: momentos en el plano), con la escalera desde (0, 0) hasta (L cos a, L sen a).
    const c = C(a), sn = S(a), q = M.momentos2D([{ x: L / 2 * c, y: L / 2 * sn, Fx: 0, Fy: -Pe }, ...(Pv ? [{ x: s * c, y: s * sn, Fx: 0, Fy: -Pv }] : [])], { x: 0, y: 0 });
    const Np = -q.neto / (L * sn);
    if (!exacto(Np) || !exacto(s)) return null;
    return {
      enunciado: [`Una escalera pareja de ${mt(L)} y `, Pp(nw(Pe)), ` se apoya en una pared lisa, a ${a}° del piso.${Pv ? ` Una persona de ${nw(Pv)} sube hasta ${mt(s)} del pie.` : ''}`],
      pregunta: ['¿Con cuánta fuerza la frena el piso?'], datos: [D.rigido, D.cg, D.tau, D.pared, D.trig], correcta: Np, fmt: nw,
      errores: [
        e('RG-NORMAL', Pe + Pv, x => `Bien lo que sostiene el piso hacia arriba, ${x}, pero esa es la normal; el rozamiento es la fuerza de lado.`),
        e('ST-SENCOS', (Pe * L / 2 * sn + Pv * s * sn) / (L * c), x => `Bien los torques respecto del pie, pero los pesos son verticales y su brazo es horizontal, con el coseno; cambiando seno y coseno sale ${x}.`),
        e('RG-SIN-PESO', Pv ? Pe * L / 2 * c / (L * sn) : Pe / 2, x => (Pv ? `Bien la escalera, pero la persona también hace torque respecto del pie. ${x} la olvida.` : `Bien buscada una parte del peso, pero sale de igualar torques, no de partirlo en dos. ${x} no es.`)),
        e('N-MG', Pe, x => `Bien el peso de la escalera, ${x}, pero el piso frena de lado, con lo mismo que empuja la pared.`),
      ],
      solucion: [['Se toman torques respecto del pie, donde las fuerzas del piso no hacen torque: la pared, con brazo L · sen θ; los pesos, con su distancia horizontal.'], ['La escalera no se desliza, así que el piso frena lo que empuja la pared: ', Ff(`f = ${nw(Np)}`), '.']],
      _datos: { L, Pe, a, P: Pv, s },
    };
  }

  const CONSTRUIR = { balanza, apiladas, pesa, simetrico, asimetrico, pared, quieto, rampa, oblicua, estira, largo, polea, torque, balancin, inclinada, apoyos, caballete, escalera };
  return { id: ID, titulo: 'Estática', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
