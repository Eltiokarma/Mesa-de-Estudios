/*
 * Generador «Dinámica»: la práctica de las seis ideas de fisica.dinamica (contenido/teoria/fisica/dinamica.js).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['fis-dinamica']) y en Node
 * (require). 19 nov 2026, etapa 7 (docs/etapa7/propuesta-fisica.md §7).
 *
 * La física vive en el motor de la escena (plantillas/dinamica/motor.js: resultante, empujon, piso, plano, mesaPolea,
 * atwood, ascensor, loma, vertical y curva, con g = 10 m/s² y los senos del examen), que este generador llama y no copia.
 * En el navegador, si la escena no lo cargó, se pide al mismo servidor antes de registrarse (como fis-estatica con el suyo).
 *
 * Objetos (propuesta §2 y §8): el carrito del mercado, la caja empujada; la mochila y la caja en la Luna o en Marte; el
 * costal arrastrado, el ladrillo de la rampa; el costal sobre la mesa y el balde que cuelga, la máquina de Atwood; la
 * persona en la balanza del ascensor, la grúa; el auto en la loma, la plataforma que gira, el carrito del rizo. Valores
 * de problema, sin fuente.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las seis con el mismo peso.
 *   fuerza-neta-acelera       neta (1) dos fuerzas opuestas · reposo (2) la rapidez tras empujar · recorrido (3) la
 *                             fuerza que hace recorrer d en t (San Marcos 2026-II)
 *   masa-y-peso               pesoLugar (1) el peso en la Luna o Marte · lugares (2) del peso en un lugar al de otro ·
 *                             levantar (3) levantar una caja en la Luna o Marte (2024-II)
 *   rozamiento-en-movimiento  arrastre (1) jalar lo que ya desliza · frenado (2) la distancia de frenado (2019-I) ·
 *                             oblicua (3) jalar a 37° (2025-II) · rampa (3) lo que sube por la rampa áspera (2027-I)
 *   plano-y-polea             mesa (1) la aceleración de la mesa lisa · atwood (2) la tensión de la Atwood · aspera (3)
 *                             la tensión con la mesa áspera (2024-I)
 *   ascensor-y-marcos         balanza (1) lo que marca · grua (2) el cable que sube acelerando (2027-I) · lectura (3) de
 *                             lo que marca, la aceleración (2023-I)
 *   centripeta-es-resultante  loma (1) la normal en la cima · plataforma (2) el radio máximo (2019-II) · rizo (3) la
 *                             normal en lo alto del rizo (2026-I)
 *
 * Colores (los de la unidad, un color por clase de fuerza): peso carmín, normal violeta, tensión y mano naranja,
 * rozamiento turquesa; la aceleración en tinta; sin verde. Ninguna explicación nombra una letra de alternativa.
 * Datos (contrato, punto 13): la ley de cada idea, los senos del examen y las fórmulas de MRUV; nunca la respuesta.
 * Errores: los códigos de la unidad (cabecera de la teoría y docs/investigacion/dinamica-ideas-erroneas.md,
 * «Dinámica (19 nov 2026)»): D1 con respaldo del informe; W5 de estatica-energia; los demás son hipótesis.
 * La práctica no repite ninguna Predice de la unidad (ni 30 kg con 60 N, ni 20 kg con 40 N en la Luna, ni 3 kg con 2 kg
 * en la mesa, ni 50 kg que sube frenando 2 m/s², ni la hondonada de 20 m a 8 m/s).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const motor = nodo ? require('../dinamica/motor.js') : (root.MotorDinamica || cargarMotor(root));
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones, motor);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;

  function cargarMotor(r) {
    const doc = r.document, actual = doc && doc.currentScript;
    const url = new URL('../dinamica/motor.js', actual && actual.src ? actual.src : r.location.href).href;
    const x = new XMLHttpRequest();
    x.open('GET', url, false);
    x.send(null);
    if (x.status !== 200 && x.status !== 0) throw new Error('fis-dinamica: no se pudo cargar el motor de dinámica');
    const s = doc.createElement('script');
    s.text = `${x.responseText}\n//# sourceURL=${url}`;
    doc.head.appendChild(s);
    if (!r.MotorDinamica) throw new Error('fis-dinamica: el motor de dinámica no se registró');
    return r.MotorDinamica;
  }
})(typeof self !== 'undefined' ? self : this, function (Azar, P, M) {
  'use strict';
  const ID = 'fis-dinamica';
  const DIN = 'docs/investigacion/dinamica-ideas-erroneas.md', EST = 'docs/investigacion/estatica-energia-ideas-erroneas.md';
  const G = M.G;
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d).replace(/ /g, ' ');
  const nw = x => `${f(x)} N`, ms2 = x => `${f(x)} m/s²`, ms = x => `${f(x)} m/s`, mt = x => `${f(x)} m`, kg = x => `${f(x)} kg`;
  const igual = (a, b) => Math.abs(a - b) < 1e-9;
  const exacto = x => Number.isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;

  const VARS = { P: { nombre: 'el peso', color: 'h' }, N: { nombre: 'la normal', color: 'f' }, T: { nombre: 'la tensión o la mano', color: 'o' }, f: { nombre: 'el rozamiento', color: 'i' } };
  const Pp = t => v('P', t), Nn = t => v('N', t), Tt = t => v('T', t), Ff = t => v('f', t);

  const RESPALDO = { D1: 'documentado', W5: 'documentado' };
  const FUENTE = { W5: EST };
  const e = (id, valor, explicar) => ({ id, valor, explicar });

  const D = {
    peso: 'Peso: P = m · g, con g = 10 m/s² en la Tierra (convención del examen)',
    lugares: 'g en la Luna: unos 1,6 m/s²; en Marte: unos 3,7 m/s²',
    segunda: 'Segunda ley: ΣF = m · a, con las fuerzas sumadas con su sentido',
    reposo: 'Desde el reposo, con a constante: v = a · t y d = a · t² / 2',
    mruv: 'Con a constante: v² = v₀² + 2 · a · d',
    cin: 'Rozamiento cinético: f_k = μ_k · N mientras desliza, contra el deslizamiento',
    normal: 'La normal: lo perpendicular al piso suma cero',
    comp: 'Una fuerza F a θ sobre la horizontal: F · cos θ de lado y F · sen θ hacia arriba',
    rampa: 'En una rampa de ángulo θ: P · sen θ a lo largo y P · cos θ contra ella',
    trig: 'sen 37° = 3/5 y cos 37° = 4/5 (convención del examen)',
    juntos: 'Unidos por una cuerda tensa: la misma aceleración; para el sistema, ΣF de afuera = (m₁ + m₂) · a',
    bloque: 'Para un solo bloque: ΣF sobre él = m · a',
    cuerda: 'Una cuerda ideal jala con la misma tensión T en sus dos puntas',
    eje: 'Hacia arriba es positivo: a > 0 si la aceleración apunta hacia arriba',
    vertical: 'Sobre la persona o el bloque: lo de arriba menos lo de abajo = m · a',
    ac: 'Aceleración centrípeta: a_c = v² / r = ω² · r, hacia el centro',
    centro: 'En una curva: la suma de fuerzas hacia el centro = m · a_c',
    est: 'Rozamiento estático: f_s ≤ μ_s · N mientras no resbala',
  };

  const TIPOS_POR_IDEA = {
    'fuerza-neta-acelera': ['neta', 'reposo', 'recorrido'],
    'masa-y-peso': ['pesoLugar', 'lugares', 'levantar'],
    'rozamiento-en-movimiento': ['arrastre', 'frenado', 'oblicua', 'rampa'],
    'plano-y-polea': ['mesa', 'atwood', 'aspera'],
    'ascensor-y-marcos': ['balanza', 'grua', 'lectura'],
    'centripeta-es-resultante': ['loma', 'plataforma', 'rizo'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { neta: 1, reposo: 2, recorrido: 3, pesoLugar: 1, lugares: 2, levantar: 3, arrastre: 1, frenado: 2, oblicua: 3, rampa: 3,
    mesa: 1, atwood: 2, aspera: 3, balanza: 1, grua: 2, lectura: 3, loma: 1, plataforma: 2, rizo: 3 };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): de menos a más.
  const PAPEL = { 'papel-1': 'neta', 'papel-2': 'pesoLugar', 'papel-3': 'arrastre', 'papel-4': 'atwood', 'papel-5': 'balanza',
    'papel-6': 'loma', 'papel-7': 'oblicua', 'papel-8': 'rizo', 'papel-9': 'aspera', 'papel-10': 'recorrido' };

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
    // los datos no traen la respuesta escrita (g = 10 m/s² cuando la respuesta es 10 m/s²)
    const okTexto = o.fmt(o.correcta);
    if (o.datos.some(l => new RegExp(`(?<![\\d,])${okTexto.replace(/[/()·]/g, '\\$&')}(?![\\d])`).test(l))) return null;
    const conRespaldo = x => Object.assign({}, x, { explicacion: x.explicar(x.texto), respaldo: RESPALDO[x.id] || 'hipotesis', fuente: FUENTE[x.id] || DIN });
    const ok = o.fmt(o.correcta), vistos = new Set([ok]), errores = [];
    for (const x of o.errores) {
      // Un error que da la correcta descarta el caso: quien se equivoca así acertaría (auditoría de Estática, M4).
      if (x && Number.isFinite(x.valor) && (igual(x.valor, o.correcta) || o.fmt(x.valor) === ok)) return null;
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

  // ======================= 1: segunda ley =======================
  function neta(rng) {
    const [cosa, lo] = rng.elegir([['una caja', 'la'], ['un carrito', 'lo'], ['un trineo de arena', 'lo']]), m = rng.elegir([4, 5, 8, 10, 25]), F1 = rng.elegir([40, 50, 70, 90, 120]), F2 = rng.elegir([10, 20, 30]);
    if (m === 30 && F1 - F2 === 60) return null;   // la Predice
    if (m === 10 && F1 === 70 && F2 === 30) return null;   // el ejemplo 1.6 (auditoría, B1)
    const a = M.resultante([{ F: F1, angulo: 0 }, { F: F2, angulo: 180 }], m).a;
    return {
      enunciado: [`Sobre ${cosa} de ${m} kg, en un piso liso, tú ${lo} empujas con `, Tt(nw(F1)), ' hacia la derecha y tu amigo con ', Tt(nw(F2)), ' hacia la izquierda.'],
      pregunta: ['¿Cuánto acelera?'], datos: [D.segunda], correcta: a, fmt: ms2,
      errores: [
        e('DN-SUMA', (F1 + F2) / m, x => `Bien dividir entre la masa, pero sumaste las dos fuerzas como si empujaran juntas. Tu amigo empuja en contra, así que su fuerza se resta; sumando sale ${x}.`),
        e('DN-UNA', F1 / m, x => `Bien la fuerza mayor, pero la usaste sola, como si tu amigo no empujara. Su fuerza también actúa, en contra, y la neta es la resta; con una sola sale ${x}.`),
        e('DN-INV', m / (F1 - F2), x => `Bien la fuerza neta, pero dividiste la masa entre ella. La aceleración es la fuerza neta entre la masa, porque más masa acelera menos; al revés sale ${x}.`),
        e('DN-POR', (F1 - F2) * m, x => `Bien la fuerza neta, pero la multiplicaste por la masa. Se divide, porque con más masa la misma fuerza acelera menos; multiplicando sale ${x}.`),
      ],
      solucion: [['Las fuerzas se oponen, así que se restan y gana la mayor; la fuerza neta es ', `${F1} − ${F2} = ${F1 - F2} N, a la derecha.`], [`Esa fuerza neta, dividida entre la masa, da la aceleración: a = ${F1 - F2} ÷ ${m} = ${ms2(a)}.`]],
      _datos: { m, F1, F2 },
    };
  }
  function reposo(rng) {
    const m = rng.elegir([2, 4, 5, 8]), Fv = rng.elegir([4, 6, 10, 12, 20]), t = rng.elegir([2, 3, 4, 5]);
    const r = M.empujon({ m, F: Fv, dur: t, muk: 0 }), vf = r.v(t);
    if (vf > 12) return null;   // una caja empujada a mano no pasa de unos 12 m/s (auditoría, M6)
    return {
      enunciado: [`Una caja de ${m} kg está quieta en un piso liso. La empujas con `, Tt(nw(Fv)), ` horizontales durante ${t} s.`],
      pregunta: ['¿Qué rapidez tiene al terminar?'], datos: [D.segunda, D.reposo], correcta: vf, fmt: ms,
      errores: [
        e('DN-SOLO-A', Fv / m, x => `Bien la aceleración, pero te quedaste ahí. La aceleración es lo que gana de rapidez en cada segundo, y falta multiplicarla por el tiempo: ${x} es solo a.`),
        e('DN-SIN-M', Fv * t, x => `Bien usar la fuerza y el tiempo, pero no pasaste por la masa. La rapidez que gana depende de la aceleración, la fuerza entre la masa; sin dividir sale ${x}.`),
        e('DN-MEDIO', Fv * t / (2 * m), x => `Bien la aceleración, pero dividiste entre 2. El medio va en la distancia, d = a · t² / 2; la rapidez desde el reposo es v = a · t; con el medio sale ${x}.`),
      ],
      solucion: [[`La segunda ley da la aceleración, la fuerza entre la masa: a = ${Fv} ÷ ${m} = ${ms2(Fv / m)}.`], [`Parte del reposo y gana esa rapidez en cada segundo, así que v = a · t = ${f(Fv / m)} · ${t} = ${ms(vf)}.`]],
      _datos: { m, F: Fv, t },
    };
  }
  function recorrido(rng) {
    const m = rng.elegir([2, 4, 5, 8]), a = rng.elegir([1, 2, 3, 4]), t = rng.elegir([2, 3, 4, 5]), d = a * t * t / 2;
    if (!exacto(d) || (m === 5 && d === 16)) return null;   // el ejemplo de examen
    const Fv = m * a;
    return {
      enunciado: [`Una caja de ${m} kg parte del reposo en un piso liso. Una sola fuerza horizontal constante la hace recorrer ${mt(d)} en ${t} s.`],
      pregunta: ['¿Cuánto vale esa fuerza?'], datos: [D.segunda, D.reposo], correcta: Fv, fmt: nw,
      errores: [
        e('DN-VMEDIA', m * d / t, x => `Bien multiplicar por la masa, pero d ÷ t es la velocidad media, en m/s, no la aceleración. La aceleración sale de d = a · t² / 2; así sale ${x}.`),
        e('DN-SIN-DOS', m * d / (t * t), x => `Bien usar d = a · t² / 2, pero al despejar perdiste el 2: como a está dividida entre 2, el 2 pasa multiplicando; sin el 2 sale ${x}.`),
        e('DN-VFINAL', 2 * m * d / t, x => `Bien: 2d ÷ t es la rapidez con que termina. Pero la segunda ley pide la aceleración, y falta dividir otra vez entre el tiempo; así sale ${x}.`),
        e('DN-POR-D', m * d, x => `Bien usar la masa, pero la multiplicaste por la distancia. La segunda ley la multiplica por la aceleración, que hay que sacar antes; así sale ${x}.`),
      ],
      solucion: [[`Parte del reposo, así que la aceleración se despeja de d = a · t² / 2: a = 2 · ${f(d)} ÷ ${t}² = ${ms2(a)}.`], ['Con esa aceleración, la segunda ley da la fuerza, masa por aceleración: ', Tt(`F = ${m} · ${a} = ${nw(Fv)}`), '.']],
      _datos: { m, d, t },
    };
  }

  // ======================= 2: masa y peso =======================
  const LUGAR = [['la Luna', 1.6], ['Marte', 3.7]];
  function pesoLugar(rng) {
    const [lugar, g2] = rng.elegir(LUGAR), cosa = rng.elegir(['Una mochila', 'Una caja de herramientas', 'Un saco de quinua']), PT = rng.elegir([30, 50, 70, 90, 110]);
    const mm = PT / G, P2 = mm * g2;
    return {
      enunciado: [`${cosa} pesa `, Pp(nw(PT)), ' en la Tierra.'],
      pregunta: [`¿Cuánto pesa en ${lugar}?`], datos: [D.peso, D.lugares], correcta: P2, fmt: nw,
      errores: [
        e('MP-IGUAL', PT, x => `Bien que la masa no cambia, pero el peso sí cambia: es la masa por la g del lugar. Dejaste el peso de aquí: ${x} es el de la Tierra.`),
        e('MP-DIV', PT / g2, x => `Bien usar la g del lugar, pero dividiste entre ella el peso de la Tierra. Primero se saca la masa, el peso entre 10, y esa masa se multiplica por la nueva g; dividiendo el peso sale ${x}.`),
        e('MP-POR', PT * g2, x => `Bien multiplicar por la nueva g, pero multiplicaste el peso, que ya lleva dentro la g de la Tierra. Lo que se multiplica es la masa; así sale ${x}.`),
        e('MP-MASA', mm, x => `Bien: ${x} es su masa, en kilogramos. Pero te piden un peso, en newtons, y falta multiplicar esa masa por la g del lugar.`),
      ],
      solucion: [[`La masa no cambia de lugar, así que primero se saca con la g de la Tierra: m = ${PT} ÷ 10 = ${kg(mm)}.`], [`Esa misma masa, con la g de ${lugar}, da el peso allá: `, Pp(`P = ${f(mm)} · ${f(g2)} = ${nw(P2)}`), '.']],
      _datos: { PT, g2 },
    };
  }
  function lugares(rng) {
    const [l1, g1] = rng.elegir(LUGAR), [l2, g2] = l1 === 'la Luna' ? ['Marte', 3.7] : ['la Luna', 1.6], mm = rng.elegir([5, 10, 20, 40]), P1 = mm * g1, P2 = mm * g2;
    return {
      enunciado: [`En ${l1}, una balanza de resorte marca `, Pp(nw(P1)), ' con una roca colgada y quieta.'],
      pregunta: [`¿Cuánto marcaría con la misma roca en ${l2}?`], datos: [D.peso, D.lugares, 'Colgada y quieta, la balanza de resorte marca el peso'], correcta: P2, fmt: nw,
      errores: [
        e('MP-IGUAL', P1, x => `Bien que es la misma roca, pero su peso cambia con el lugar, porque depende de la g de cada uno. Dejaste el peso de antes: ${x} es el de ${l1}.`),
        e('MP-G-TIERRA', P1 / G * g2, x => `Bien cambiar de g, pero sacaste la masa con la g de la Tierra. La balanza estaba en ${l1} y marcaba el peso de allá, así que la masa sale con la g de ${l1}; así sale ${x}.`),
        e('MP-MASA', mm, x => `Bien: ${x} es su masa, en kilogramos. Pero te piden lo que marca la balanza, un peso, y falta multiplicar esa masa por la g de ${l2}.`),
        e('MP-POR', P1 * g2, x => `Bien usar la nueva g, pero la multiplicaste por el peso, que ya trae la g de ${l1}. Va por la masa; así sale ${x}.`),
      ],
      solucion: [[`La balanza marcaba el peso en ${l1}, así que la masa sale con la g de allá: m = ${f(P1)} ÷ ${f(g1)} = ${kg(mm)}.`], [`La masa no cambia; en ${l2}, la balanza marca esa masa por la g de ese lugar: `, Pp(`P = ${mm} · ${f(g2)} = ${nw(P2)}`), '.']],
      _datos: { m: mm, g1, g2 },
    };
  }
  function levantar(rng) {
    const [lugar, g2] = rng.elegir(LUGAR), mm = rng.elegir([10, 15, 20, 25, 30]), Tv = rng.elegir([30, 40, 60, 80, 100, 150]);
    if (mm === 20 && Tv === 50) return null;   // el ejemplo de examen
    const Pv = mm * g2, a = (Tv - Pv) / mm;
    if (!(a > 0) || Tv >= mm * G) return null;
    return {
      enunciado: [`En ${lugar} levantas con una cuerda una caja de ${mm} kg: la cuerda la jala hacia arriba con `, Tt(nw(Tv)), '.'],
      pregunta: ['¿Cuánto acelera la caja?'], datos: [D.peso, D.lugares, D.segunda], correcta: a, fmt: ms2,
      errores: [
        e('MP-SIN-PESO', Tv / mm, x => `Bien dividir entre la masa, pero contaste solo la cuerda. El peso también actúa, hacia abajo, y le quita parte de su jalón; sin él sale ${x}.`),
        e('MP-SUMA-PESO', (Tv + Pv) / mm, x => `Bien contar el peso, pero lo sumaste a la cuerda. El peso apunta hacia abajo y la cuerda hacia arriba, así que se restan; sumando sale ${x}.`),
        e('MP-DIV', Tv / (mm * G), x => `Bien usar la cuerda, pero dividiste su jalón entre el peso en la Tierra. La segunda ley divide la fuerza neta entre la masa, en kilogramos; así sale ${x}.`),
        e('MP-DIV2', (Tv - Pv) / Pv, x => `Bien la fuerza neta, pero la dividiste entre el peso. La aceleración es la fuerza neta entre la masa, en kilogramos, no entre otra fuerza; así sale ${x}.`),
      ],
      solucion: [[`El peso se calcula con la g de ${lugar}: `, Pp(`P = ${mm} · ${f(g2)} = ${nw(Pv)}`), '.'], [`La cuerda jala más que ese peso; lo que sobra hacia arriba es la fuerza neta, y dividida entre la masa da a = (${Tv} − ${f(Pv)}) ÷ ${mm} = ${ms2(a)}.`]],
      _datos: { m: mm, T: Tv, g2 },
    };
  }

  // ======================= 3: rozamiento en movimiento =======================
  function arrastre(rng) {
    const [cosa, el] = rng.elegir([['un costal de papas', 'él'], ['una caja de libros', 'ella'], ['un baúl', 'él']]), mm = rng.elegir([10, 20, 40, 50]), mu = rng.elegir([0.1, 0.2, 0.3, 0.4]), Fv = rng.elegir([60, 90, 120, 160, 200]);
    if (mm === 20 && Fv === 60) return null;   // el juego
    const r = M.piso({ m: mm, F: Fv, mus: mu, muk: mu, v0: 1 }), fk = r.fk;
    if (!(r.a > 0)) return null;
    return {
      enunciado: [`Jalas con una cuerda horizontal ${cosa} de ${mm} kg que ya desliza. La cuerda jala con `, Tt(nw(Fv)), ` y entre el piso y ${el}, μ_k = ${f(mu)}.`],
      pregunta: ['¿Cuánto acelera?'], datos: [D.peso, D.cin, D.segunda], correcta: r.a, fmt: ms2,
      errores: [
        e('RM-SIN-ROCE', Fv / mm, x => `Bien dividir entre la masa, pero dividiste el jalón entero. Mientras desliza, el piso lo frena, así que primero se resta el rozamiento; sin él sale ${x}.`),
        e('RM-SUMA', (Fv + fk) / mm, x => `Bien contar el rozamiento, pero lo sumaste como si ayudara. El rozamiento va contra el deslizamiento, al revés que la cuerda, así que se resta; sumando sale ${x}.`),
        e('RM-MASA', (Fv - mu * mm) / mm, x => `Bien restar el rozamiento, pero lo calculaste con la masa, en kilogramos. El rozamiento es μ_k por la normal, que aquí es el peso en newtons; con la masa sale ${x}.`),
        e('RM-SOLO-ROCE', fk / mm, x => `Bien calcular el rozamiento, pero lo usaste como fuerza neta. La neta es lo que sobra del jalón después de restarle el rozamiento; así sale ${x}.`),
      ],
      solucion: [['La cuerda es horizontal, así que la normal iguala al peso, y el rozamiento es μ_k por esa normal: ', Ff(`f_k = ${f(mu)} · ${mm * G} = ${nw(fk)}`), '.'], [`El jalón le gana al rozamiento; lo que sobra, dividido entre la masa, da la aceleración: a = (${Fv} − ${f(fk)}) ÷ ${mm} = ${ms2(r.a)}.`]],
      _datos: { m: mm, F: Fv, mu },
    };
  }
  function frenado(rng) {
    const v0 = rng.elegir([3, 4, 5, 6, 8, 10]), mu = rng.elegir([0.1, 0.2, 0.25, 0.5]), mm = rng.elegir([10, 20, 30]);
    const r = M.piso({ m: mm, F: 0, mus: mu, muk: mu, v0 }), a = -r.a, d = v0 * v0 / (2 * a);
    return {
      enunciado: [`Una caja de ${mm} kg sale deslizando a ${ms(v0)} por un piso con μ_k = ${f(mu)}, sin que nadie la empuje.`],
      pregunta: ['¿Qué distancia recorre hasta detenerse?'], datos: [D.peso, D.cin, D.segunda, D.mruv], correcta: d, fmt: mt,
      errores: [
        e('RM-SIN-DOS', v0 * v0 / a, x => `Bien la aceleración, ${ms2(a)}, pero al despejar la distancia perdiste el 2. Con v = 0, d es v₀² dividido entre 2 · a; así sale ${x}.`),
        e('RM-TIEMPO', v0 / a, x => `Bien la aceleración, pero v₀ ÷ a es lo que tarda en detenerse, en segundos. La distancia sale de v² = v₀² + 2 · a · d; como distancia daría ${x}.`),
        e('RM-MASA-FRENA', d / mm, x => `Bien la frenada, pero después dividiste entre la masa. La masa ya se canceló al sacar la aceleración, μ_k · g, y no se vuelve a dividir; así sale ${x}.`),
        e('RM-G', v0 * v0 / (2 * G), x => `Bien la fórmula de MRUV, pero usaste g como aceleración, como si cayera. Lo que frena es el rozamiento, y la aceleración es μ_k · g, no g; así sale ${x}.`),
      ],
      solucion: [[`Nadie empuja, así que el rozamiento es la fuerza neta; al dividirlo entre la masa, la masa se cancela: a = ${f(mu)} · 10 = ${ms2(a)}, contra el avance.`], [`Al final está quieto, v = 0, y no dan el tiempo, así que d = ${v0}² ÷ (2 · ${f(a)}) = ${mt(d)}.`]],
      _datos: { m: mm, v0, mu },
    };
  }
  function oblicua(rng) {
    const mm = rng.elegir([5, 10, 20]), Fv = rng.elegir([50, 100, 150]), mu = rng.elegir([0.2, 0.25, 0.5]);
    if (mm === 10 && Fv === 100 && mu === 0.5) return null;   // el ejemplo de examen
    const r = M.piso({ m: mm, F: Fv, angulo: 37, mus: mu, muk: mu, v0: 1 }), Nv = r.N;
    if (!(Nv > 0) || !(r.a > 0)) return null;
    return {
      enunciado: [`Un bloque de ${mm} kg desliza jalado con `, Tt(nw(Fv)), ` por una cuerda a 37° sobre la horizontal. Entre el bloque y el piso, μ_k = ${f(mu)}.`],
      pregunta: ['¿Cuánto acelera?'], datos: [D.peso, D.comp, D.trig, D.cin, D.segunda], correcta: r.a, fmt: ms2,
      errores: [
        e('N-MG', (Fv * 0.8 - mu * mm * G) / mm, x => `Bien descomponer el jalón, pero tomaste la normal igual al peso. La cuerda inclinada levanta un poco el bloque, así que el piso empuja menos; con N = P sale ${x}.`),
        e('RM-SIN-COS', (Fv - mu * Nv) / mm, x => `Bien la normal, pero usaste el jalón entero de lado. Como la cuerda está inclinada, solo F · cos 37° jala hacia adelante; con F entera sale ${x}.`),
        e('RM-SIGNO-N', (Fv * 0.8 - mu * (mm * G + Fv * 0.6)) / mm, x => `Bien que la cuerda cambia la normal, pero le sumaste su parte vertical. La cuerda jala hacia arriba, así que la normal es el peso menos esa parte; sumando sale ${x}.`),
        e('RM-SIN-ROCE', Fv * 0.8 / mm, x => `Bien la parte horizontal, pero olvidaste el rozamiento. El bloque desliza, así que el piso lo frena; sin rozamiento sale ${x}.`),
      ],
      solucion: [['La cuerda levanta con F · sen 37°, así que la normal es el peso menos eso: ', Nn(`N = ${mm * G} − ${f(Fv * 0.6)} = ${nw(Nv)}`), '.'], [`De lado jala F · cos 37°; se le resta el rozamiento, μ_k por esa normal, y lo que sobra, entre la masa: a = (${f(Fv * 0.8)} − ${f(mu)} · ${f(Nv)}) ÷ ${mm} = ${ms2(r.a)}.`]],
      _datos: { m: mm, F: Fv, mu },
    };
  }
  function rampa(rng) {
    const mu = rng.elegir([0.1, 0.25, 0.5]), v0 = rng.elegir([4, 6, 8]);
    const r = M.plano({ m: 1, angulo: 37, mus: mu, muk: mu, v0: -v0 }), a = Math.abs(r.a), d = v0 * v0 / (2 * a);
    if (!exacto(d)) return null;
    return {
      enunciado: [`Lanzas un ladrillo hacia arriba por una rampa de 37°, a ${ms(v0)}. Entre el ladrillo y la rampa, μ_k = ${f(mu)}.`],
      pregunta: ['¿Qué distancia sube hasta detenerse?'], datos: [D.rampa, D.cin, D.trig, D.mruv], correcta: d, fmt: mt,
      errores: [
        e('RM-RAMPA-RESTA', v0 * v0 / (2 * G * (0.6 - 0.8 * mu)), x => `Bien contar el rozamiento, pero lo restaste. Al subir, el rozamiento apunta hacia abajo de la rampa, como la parte del peso, y frenan juntos; restando sale ${x}.`),
        e('RM-SIN-ROCE', v0 * v0 / (2 * G * 0.6), x => `Bien la parte del peso a lo largo, pero olvidaste el rozamiento. La rampa es áspera y también lo frena mientras sube; sin él sale ${x}.`),
        e('N-MG', v0 * v0 / (2 * G * (0.6 + mu)), x => `Bien sumar las dos, pero tomaste la normal igual al peso. En la rampa, el piso solo empuja contra la parte del peso que la aprieta, P · cos 37°; con N = P sale ${x}.`),
        e('RM-SIN-DOS', v0 * v0 / a, x => `Bien la aceleración, pero al despejar la distancia perdiste el 2. Con v = 0, d es v₀² dividido entre 2 · a; así sale ${x}.`),
      ],
      solucion: [[`Al subir, la parte del peso a lo largo y el rozamiento apuntan hacia abajo de la rampa y frenan juntos; la masa se cancela: a = 10 · (0,6 + ${f(mu)} · 0,8) = ${ms2(a)}.`], [`Sube hasta quedar quieto, v = 0, así que d = ${v0}² ÷ (2 · ${f(a)}) = ${mt(d)}.`]],
      _datos: { mu, v0 },
    };
  }

  // ======================= 4: bloques unidos por una cuerda =======================
  function mesa(rng) {
    const m1 = rng.elegir([2, 4, 6, 8, 12]), m2 = rng.elegir([2, 4, 8]);
    if ((m1 === 3 && m2 === 2) || m1 === 4 * m2) return null;   // la Predice y la misión
    if (m1 === 6 && (m2 === 2 || m2 === 4)) return null;   // los ejemplos 4.1 y 4.11 (auditoría, B1)
    const r = M.mesaPolea({ m1, m2 });
    return {
      enunciado: [`Un costal de ${m1} kg está sobre una mesa lisa, unido por una cuerda a un balde de ${m2} kg que cuelga de una polea.`],
      pregunta: ['¿Cuánto aceleran?'], datos: [D.peso, D.juntos], correcta: r.a, fmt: ms2,
      errores: [
        e('PL-G', G, x => `Así caería el balde solo, sin cuerda, ${x}. Pero está atado y arrastra también el costal, así que su peso tiene que acelerar las dos masas.`),
        e('PL-M1', m2 * G / m1, x => `Bien el peso del balde, pero lo dividiste solo entre el costal. El balde también acelera, así que su peso mueve las dos masas; entre la del costal sola sale ${x}.`),
        e('PL-INV', (m1 + m2) * G / m2, x => `Bien la masa total, pero dividiste al revés. La aceleración es la fuerza entre la masa: el peso del balde entre la masa total; al revés sale ${x}.`),
        e('PL-PESO-TOTAL', m2 / (m1 + m2), x => `Bien dividir entre todo, pero usaste masas donde iba el peso. Arriba va la fuerza que mueve, el peso del balde, y abajo la masa total; así sale ${x}.`),
      ],
      solucion: [['La mesa es lisa y la tensión queda adentro del sistema, así que lo único de afuera que los mueve es el peso del balde: ', Pp(`${nw(m2 * G)}`), '.'], [`Ese peso mueve las dos masas, que aceleran juntas: a = ${m2 * G} ÷ ${m1 + m2} = ${ms2(r.a)}.`]],
      _datos: { m1, m2 },
    };
  }
  function atwood(rng) {
    const m1 = rng.elegir([4, 6, 8, 9]), m2 = rng.elegir([1, 2, 4]);
    if (m1 <= m2 || (m1 === 3 && m2 === 2) || (m1 === 6 && m2 === 4)) return null;
    const r = M.atwood({ m1, m2 });
    return {
      enunciado: [`En una máquina de Atwood cuelgan ${m1} kg de un lado y ${m2} kg del otro, y se sueltan.`],
      pregunta: ['¿Con qué fuerza jala la cuerda?'], datos: [D.peso, D.juntos, D.bloque, D.cuerda], correcta: r.T, fmt: nw,
      errores: [
        e('PL-TPESO', m2 * G, x => `Bien mirar el liviano, pero igualaste la cuerda a su peso. Ese bloque sube acelerando, así que la cuerda jala más que su peso, ${x}.`),
        e('PL-TPESO2', m1 * G, x => `Bien mirar el pesado, pero igualaste la cuerda a su peso. Ese bloque baja acelerando, así que la cuerda jala menos que su peso, ${x}.`),
        e('PL-PROMEDIO', (m1 + m2) * G / 2, x => `Bien que la tensión está entre los dos pesos, pero no es su promedio, ${x}. Sale del DCL de un bloque y depende de las masas.`),
        e('PL-NETA', m2 * r.aModulo, x => `Bien la aceleración, pero ${x} es la fuerza neta del liviano. La cuerda, además de acelerarlo, sostiene su peso, así que hay que sumárselo.`),
      ],
      solucion: [[`Primero, la aceleración del sistema: la diferencia de pesos entre la masa total, a = (${m1 * G} − ${m2 * G}) ÷ (${m1} + ${m2}) = ${ms2(r.aModulo)}.`], ['Después, el DCL del liviano: sube acelerando, así que la cuerda jala su peso más su masa por la aceleración: ', Tt(`T = ${m2} · (10 + ${f(r.aModulo)}) = ${nw(r.T)}`), '.']],
      _datos: { m1, m2 },
    };
  }
  function aspera(rng) {
    const m1 = rng.elegir([2, 4, 5, 10]), m2 = rng.elegir([2, 3, 5, 6]), mu = rng.elegir([0.1, 0.2, 0.5]);
    if ((m1 === 4 && m2 === 6) || (m1 === 5 && m2 === 3 && mu === 0.2)) return null;   // los ejemplos 4.15 y 4.9
    const r = M.mesaPolea({ m1, m2, mus: mu, muk: mu, v0: 1 });
    if (!(r.a > 0)) return null;
    const aLisa = m2 * G / (m1 + m2);
    return {
      enunciado: [`Un bloque de ${m1} kg desliza sobre una mesa con μ_k = ${f(mu)}, unido por una cuerda a otro de ${m2} kg que cuelga de una polea.`],
      pregunta: ['¿Con qué fuerza jala la cuerda?'], datos: [D.peso, D.cin, D.juntos, D.bloque], correcta: r.T, fmt: nw,
      errores: [
        e('PL-TPESO', m2 * G, x => `Bien mirar el que cuelga, pero igualaste la cuerda a su peso. Ese bloque baja acelerando, así que la cuerda jala menos que su peso, ${x}.`),
        e('PL-SIN-ROCE-T', m1 * r.a, x => `Bien la aceleración, pero en el DCL del de la mesa contaste solo la cuerda. Sobre ese bloque también actúa el rozamiento, en contra; sin él sale ${x}.`),
        e('PL-LISA', m2 * (G - aLisa), x => `Bien el DCL del que cuelga, pero sacaste la aceleración como si la mesa fuera lisa. El rozamiento frena al sistema y se resta antes de dividir; sin él sale ${x}.`),
        e('PL-NETA-SIS', m2 * G - mu * m1 * G, x => `Bien: ${x} es la fuerza neta del sistema, lo que sobra después del rozamiento. Pero la tensión es una fuerza entre los bloques y sale del DCL de uno solo.`),
      ],
      solucion: [[`En el sistema, el peso que cuelga mueve y el rozamiento de la mesa frena; lo que sobra, entre la masa total: a = (${m2 * G} − ${f(mu * m1 * G)}) ÷ ${m1 + m2} = ${ms2(r.a)}.`], ['Después, el que cuelga: baja acelerando, así que la cuerda es su peso menos su masa por la aceleración: ', Tt(`T = ${m2} · (10 − ${f(r.a)}) = ${nw(r.T)}`), '.']],
      _datos: { m1, m2, mu },
    };
  }

  // ======================= 5: peso aparente =======================
  const SITU = [['sube y acelera', 1], ['baja y frena', 1], ['sube y frena', -1], ['baja y acelera', -1]];
  function balanza(rng) {
    const [que, s] = rng.elegir(SITU), mm = rng.elegir([45, 55, 60, 70, 80]), a = rng.elegir([1, 2, 3, 4]);
    if (mm === 50 && s < 0 && a === 2) return null;   // la Predice
    if ((mm === 60 && que === 'sube y acelera' && a === 2) || (mm === 70 && que === 'baja y frena' && a === 3)) return null;   // los ejemplos 5.2 y 5.6
    const Nv = M.ascensor({ m: mm, a: s * a }).N;
    return {
      enunciado: [`Una persona de ${mm} kg está sobre una balanza en un ascensor que ${que} con ${ms2(a)}.`],
      pregunta: ['¿Cuánto marca la balanza?'], datos: [D.peso, D.vertical, D.eje], correcta: Nv, fmt: nw,
      errores: [
        e('AS-SIGNO', mm * (G - s * a), x => `Bien usar la aceleración, pero con el signo al revés. Aquí apunta hacia ${s > 0 ? 'arriba, así que la balanza empuja más que el peso: se suma' : 'abajo, así que la balanza empuja menos que el peso: se resta'}; al revés sale ${x}.`),
        e('N-MG', mm * G, x => `Así marcaría quieto o a velocidad constante, ${x}. Pero aquí la velocidad cambia, así que hay aceleración y la balanza ya no iguala el peso.`),
        e('AS-MA', mm * a, x => `Bien la cuenta m · a, ${x}, pero esa es solo la fuerza neta. La balanza también sostiene el peso de la persona.`),
      ],
      solucion: [[`${que[0].toUpperCase()}${que.slice(1)}, así que la aceleración apunta hacia ${s > 0 ? 'arriba' : 'abajo'}: con hacia arriba positivo, a = ${s > 0 ? '+' : '−'}${a} m/s².`], ['La balanza marca la normal, el peso más la masa por esa aceleración con su signo: ', Nn(`N = ${mm} · (10 ${s > 0 ? '+' : '−'} ${a}) = ${nw(Nv)}`), '.']],
      _datos: { m: mm, a: s * a },
    };
  }
  function grua(rng) {
    // sube acelerando (San Marcos 2027-I) o baja acelerando: la aceleración, hacia arriba o hacia abajo
    const mm = rng.elegir([50, 120, 150, 300, 400]), sube = rng.elegir([true, false]), a = rng.elegir([0.5, 1, 2, 2.5]), s = sube ? 1 : -1, Tv = M.ascensor({ m: mm, a: s * a }).N;
    return {
      enunciado: [`El cable de una grúa ${sube ? 'sube' : 'baja'} un bloque de ${mm} kg con una aceleración de ${ms2(a)} hacia ${sube ? 'arriba' : 'abajo'}.`],
      pregunta: ['¿Con qué fuerza jala el cable?'], datos: [D.peso, D.vertical, D.eje], correcta: Tv, fmt: nw,
      errores: [
        e('AS-SIGNO', mm * (G - s * a), x => `Bien usar la aceleración, pero con el signo al revés. Apunta hacia ${sube ? 'arriba, así que el cable jala más que el peso' : 'abajo, así que el cable jala menos que el peso'}; al revés sale ${x}.`),
        e('N-MG', mm * G, x => `Así jalaría a velocidad constante, ${x}. Pero el bloque acelera, y para eso el cable no puede igualar su peso.`),
        e('AS-MA', mm * a, x => `Bien la cuenta m · a, ${x}, pero esa es solo la fuerza neta. El cable, además de acelerar el bloque, sostiene su peso.`),
      ],
      solucion: [['Sobre el bloque tiran el cable, hacia arriba, y el peso, hacia abajo; con hacia arriba positivo, su diferencia es la masa por la aceleración: ', Tt(`T − ${mm * G} = ${mm} · (${sube ? '+' : '−'}${f(a)})`), '.'], ['Al despejar, el cable resulta ', Tt(`T = ${nw(Tv)}`), '.']],
      _datos: { m: mm, a: s * a },
    };
  }
  function lectura(rng) {
    const mm = rng.elegir([50, 60, 70, 80]), a = rng.elegir([1, 2, 3, 4]), s = rng.elegir([1, -1]), Nv = M.ascensor({ m: mm, a: s * a }).N;
    return {
      enunciado: ['En un ascensor, la balanza marca ', Nn(nw(Nv)), ` bajo una persona de ${mm} kg.`],
      pregunta: ['¿Cuánto vale la aceleración del ascensor?'], datos: [D.peso, D.vertical, D.eje], correcta: a, fmt: ms2,
      errores: [
        e('AS-G', Nv / mm, x => `Bien dividir entre la masa, pero dividiste lo que marca la balanza. Eso da g + a, no la aceleración: falta restar g; así sale ${x}.`),
        e('AS-SIN-M', Math.abs(Nv - mm * G), x => `Bien restar el peso, pero lo que sobra es una fuerza, en newtons. Para tener la aceleración falta dividir entre la masa; así sale ${x}.`),
        e('AS-PESO', Math.abs(Nv - mm * G) / (mm * G), x => `Bien lo que sobra, pero lo dividiste entre el peso. La aceleración es esa fuerza entre la masa, en kilogramos; así sale ${x}.`),
      ],
      solucion: [['Sobre la persona, lo que marca la balanza menos su peso es la masa por la aceleración: ', Nn(`N − P = m · a`), `, es decir, ${f(Nv)} − ${mm * G} = ${mm} · a.`], [`Sale a = ${s > 0 ? '+' : '−'}${ms2(a)}, así que apunta hacia ${s > 0 ? 'arriba: el ascensor sube acelerando o baja frenando' : 'abajo: el ascensor sube frenando o baja acelerando'}.`]],
      _datos: { m: mm, N: Nv },
    };
  }

  // ======================= 6: dinámica circular =======================
  function loma(rng) {
    const mm = rng.elegir([800, 1200, 1500]), R = rng.elegir([20, 25, 40, 50]), vv = rng.elegir([5, 10, 12]);
    const r = M.loma({ m: mm, r: R, phi: 0, v: vv }), ac = vv * vv / R;
    if (r.despega || !(r.N > 0)) return null;
    return {
      enunciado: [`Un auto de ${mm} kg pasa por la cima de una loma de ${R} m de radio a ${ms(vv)}.`],
      pregunta: ['¿Con qué fuerza lo empuja la pista?'], datos: [D.peso, D.ac, D.centro], correcta: r.N, fmt: nw,
      errores: [
        e('DC-SUMA', mm * (G + ac), x => `Bien la parte hacia el centro, pero la sumaste al peso. En la cima, el centro está abajo: el peso apunta al centro y la normal se aleja, así que se resta; sumando sale ${x}.`),
        e('N-MG', mm * G, x => `Así sería en un tramo recto, ${x}, donde la normal iguala al peso. En la curva, la suma de las fuerzas tiene que apuntar al centro, así que no pueden anularse.`),
        e('DC-SOLO', mm * ac, x => `Bien la cuenta m · v²/r, ${x}, pero esa es la fuerza neta hacia el centro, no la normal. El peso también actúa, y la normal es lo que le falta al peso para dar esa neta.`),
      ],
      solucion: [[`En la cima, el centro de la curva está abajo, y la aceleración centrípeta apunta hacia allá: a_c = ${vv}² ÷ ${R} = ${ms2(ac)}.`], ['El peso apunta al centro y la normal se aleja, así que el peso le gana a la normal: ', Nn(`N = ${mm} · (10 − ${f(ac)}) = ${nw(r.N)}`), '.']],
      _datos: { m: mm, r: R, v: vv },
    };
  }
  function plataforma(rng) {
    const w = rng.elegir([1, 2]), mu = rng.elegir([0.2, 0.4, 0.8]), quien = rng.elegir(['una persona', 'una caja', 'un niño']);
    if (w === 2 && mu === 0.5) return null;   // el ejemplo de examen
    const R = mu * G / (w * w);
    if (R > 4) return null;   // una plataforma de feria no pasa de unos 4 m de radio
    // el motor de la curva plana: con ese radio, justo no derrapa; un poco más lejos, sí
    if (M.curva({ m: 1, v: w * R, r: R, mus: mu }).derrapa || !M.curva({ m: 1, v: w * R * 1.01, r: R * 1.01, mus: mu }).derrapa) return null;
    return {
      enunciado: [`Una plataforma gira a ${w} rad/s. Entre ${quien} y su piso, μ_s = ${f(mu)}.`],
      pregunta: ['¿A qué distancia máxima del eje se queda sin resbalar?'], datos: [D.peso, D.ac, D.centro, D.est], correcta: R, fmt: mt,
      errores: [
        e('DC-INV', w * w / (mu * G), x => `Bien igualar el tope del rozamiento a la centrípeta, pero al despejar r diste vuelta la fracción: r es μ_s · g entre ω²; así sale ${x}.`),
        e('DC-W', mu * G / w, x => `Bien la idea, pero usaste ω sin elevarla al cuadrado. La aceleración centrípeta es ω² · r; sin el cuadrado sale ${x}.`),
        e('DC-SIN-G', mu / (w * w), x => `Bien despejar r, pero olvidaste g. El tope del rozamiento es μ_s · m · g, porque la normal es el peso; sin g sale ${x}.`),
      ],
      solucion: [['Justo antes de resbalar, el rozamiento estático llega a su tope, y ese tope es lo único que lleva la caja al centro: ', Ff(`μ_s · m · 10 = m · ${w}² · r`), '.'], [`La masa se cancela y se despeja el radio: r = ${f(mu)} · 10 ÷ ${w}² = ${mt(R)}.`]],
      _datos: { w, mu },
    };
  }
  function rizo(rng) {
    const mm = rng.elegir([150, 250, 300]), R = rng.elegir([4, 5, 8]), vv = rng.elegir([8, 10, 12]);
    const r = M.vertical({ m: mm, v: vv, r: R, theta: 180 }), ac = vv * vv / R;
    if (r.floja || !(r.N > 0)) return null;
    return {
      enunciado: [`Un carrito de ${mm} kg de la montaña rusa pasa de cabeza por lo alto de un rizo de ${R} m de radio, a ${ms(vv)}.`],
      pregunta: ['¿Con qué fuerza lo empuja la pista?'], datos: [D.peso, D.ac, D.centro], correcta: r.N, fmt: nw,
      errores: [
        e('DC-SUMA', mm * (ac + G), x => `Bien la parte hacia el centro, pero le sumaste el peso. Arriba del rizo, el peso también apunta al centro y ya pone una parte, así que se resta; sumando sale ${x}.`),
        e('DC-SOLO', mm * ac, x => `Bien la cuenta m · v²/r, ${x}, pero esa es toda la fuerza hacia el centro. Arriba del rizo, el peso ya pone una parte, así que la pista empuja menos.`),
        e('N-MG', mm * G, x => `Bien que el peso cuenta, ${x}, pero la pista no tiene por qué empujar lo mismo que él. Empuja lo que le falta al peso para llegar a m · v²/r.`),
        e('DC-SIN-CUADRADO', mm * vv / R, x => `Bien la idea, pero usaste v sin elevarla al cuadrado y olvidaste el peso. La centrípeta es m · v²/r, y arriba el peso también apunta al centro; así sale ${x}.`),
      ],
      solucion: [[`Arriba del rizo, el carrito va de cabeza: la pista lo empuja hacia abajo y el peso también, los dos hacia el centro, y juntos dan m · v²/r: N + ${mm * G} = ${mm} · ${vv}² ÷ ${R} = ${nw(mm * ac)}.`], ['El peso ya pone su parte, así que la pista pone lo que falta: ', Nn(`N = ${nw(r.N)}`), '.']],
      _datos: { m: mm, r: R, v: vv },
    };
  }

  const CONSTRUIR = { neta, reposo, recorrido, pesoLugar, lugares, levantar, arrastre, frenado, oblicua, rampa, mesa, atwood, aspera, balanza, grua, lectura, loma, plataforma, rizo };
  return { id: ID, titulo: 'Dinámica', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
