/* Práctica de las seis ideas de Impulso y choques. Los valores describen experimentos ideales,
 * no mediciones del mundo. MotorChoques calcula los choques, impulsos y centros de masa.
 * Los errores son hipótesis de operaciones, no frecuencias observadas: docs/etapa9/errores-fisica.md.
 * Todas las componentes usan +x hacia la derecha; I_x designa impulso y J la unidad de energía.
 * Los filtros conservan solo resultados y alternativas exactos a tres decimales, sin rellenos.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const motor = nodo ? require('../choques/motor.js') : (root.MotorChoques || cargarMotor(root));
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones, motor);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
  function cargarMotor(r) {
    const doc = r.document, actual = doc && doc.currentScript;
    const url = new URL('../choques/motor.js', actual && actual.src ? actual.src : r.location.href).href;
    const x = new XMLHttpRequest(); x.open('GET', url, false); x.send(null);
    if (x.status !== 200 && x.status !== 0) throw new Error('fis-impulso-choques: no se pudo cargar el motor');
    const s = doc.createElement('script'); s.text = `${x.responseText}\n//# sourceURL=${url}`; doc.head.appendChild(s);
    if (!r.MotorChoques) throw new Error('fis-impulso-choques: el motor no se registró');
    return r.MotorChoques;
  }
})(typeof self !== 'undefined' ? self : this, function (Azar, P, M) {
  'use strict';
  const ID = 'fis-impulso-choques', FUENTE = 'docs/etapa9/errores-fisica.md';
  const f = x => P.formatear(Math.abs(x) < 1e-10 ? 0 : x, 3);
  const exacto = x => Number.isFinite(x) && Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-6;
  const v = P.v;
  const VARIABLES = { m: { nombre: 'masa', color: 'f' }, v: { nombre: 'componente de velocidad', color: 'o' },
    p: { nombre: 'cantidad de movimiento', color: 'i' }, I: { nombre: 'impulso', color: 'i' },
    F: { nombre: 'fuerza neta', color: 'h' }, t: { nombre: 'tiempo', color: 'd' } };
  const TIPOS_POR_IDEA = {
    'cantidad-movimiento': ['componente', 'conversiones', 'despeje-carga'],
    impulso: ['fuerza-constante', 'rebote-media', 'tramos-velocidad'],
    conservacion: ['adhesion', 'retroceso', 'balance-externo'],
    'elastico-inelastico': ['elastico-frontal', 'energia-transformada', 'adhesion-rampa'],
    restitucion: ['rapidez-relativa', 'alturas', 'rebote-tiempo'],
    'centro-masa': ['dos-cuerpos', 'tres-cuerpos', 'evolucion'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA), TIPOS = IDEAS.flatMap(i => TIPOS_POR_IDEA[i]);
  const IDEA = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map((t, k) => [t, k + 1])));
  const PAPEL = { 'papel-1': 'componente', 'papel-2': 'fuerza-constante', 'papel-3': 'adhesion',
    'papel-4': 'elastico-frontal', 'papel-5': 'alturas', 'papel-6': 'tres-cuerpos',
    'papel-7': 'tramos-velocidad', 'papel-8': 'adhesion-rampa' };
  const FIJOS = {
    'papel-1': { m: 2.5, u: -4, pide: 'componente' },
    'papel-2': { F: -12, dt: 0.25 },
    'papel-3': { m1: 3, u1: 4, m2: 1, u2: -2 },
    'papel-4': { m1: 2, u1: 5, m2: 3, u2: -1, pide: 'v1' },
    'papel-5': { h0: 1.8, h1: 0.45 },
    'papel-6': { masas: [2, 3, 5], posiciones: [-1, 2, 4] },
    'papel-7': { m: 0.5, u: -3, F1: 40, t1: 0.3, F2: -10, t2: 0.2 },
    'papel-8': { m1: 2, u1: 6, m2: 1, u2: 0, g: 10, mu: 0.2, pide: 'altura' },
  };
  const D = {
    eje: 'En la recta, una componente positiva apunta a la derecha y una negativa a la izquierda.',
    p: 'Cantidad de movimiento: p_x = m · v_x; su módulo es |p_x|.',
    conversion: '1 kg = 1000 g; 1 m/s = 3,6 km/h.',
    impulso: 'Impulso: I_x = Δp_x = m · (v_f,x − v_i,x).',
    fuerza: 'Con fuerza constante, I_x = F_x · Δt; la fuerza media cumple F_media,x = I_x / Δt.',
    area: 'El impulso es el área con signo de F_x frente al tiempo. Un triángulo tiene área base · altura / 2; un rectángulo, base · altura.',
    balance: 'Para el sistema: P_f,x = P_i,x + I_ext,x; P_x es la suma de m · v_x de sus cuerpos.',
    elastico: 'En un choque frontal elástico aislado se conserva P_x y la rapidez de separación iguala a la de acercamiento.',
    energia: 'Energía cinética: E_C = m · v² / 2. La energía transformada en el choque es E_C,inicial − E_C,final.',
    rampa: 'Después del choque, en una subida lisa: E_C = E_PG = m_total · g · h.',
    roce: 'Después del choque, en un tramo horizontal rugoso: E_C = μ · m_total · g · d hasta detenerse.',
    restitucion: 'En un choque frontal: e = (v_B,f − v_A,f) / (v_A,i − v_B,i), con A alcanzando a B.',
    alturas: 'En la caída y la subida sin aire: v² = 2 · g · h. Contra un piso fijo, e = rapidez de rebote / rapidez de llegada.',
    vuelo: 'Para subir y volver al nivel inicial: t_vuelo = 2 · rapidez inicial hacia arriba / g.',
    cm: 'Centro de masa: x_CM = Σ(m · x) / Σm. Σ indica suma; todas las posiciones comparten origen.',
    evolucion: 'Sin fuerza externa horizontal neta: v_CM,x = P_x / m_total y x_CM(t) = x_CM(0) + v_CM,x · t.',
  };
  const choque = (d, e) => M.choque({ m1: d.m1, v1: d.u1, m2: d.m2, v2: d.u2, e });
  const comun = d => choque(d, 0).v1f;
  const ec = (m, u) => m * u * u / 2;
  const tramoI = d => M.areaFt([[0, 0], [d.t1, d.F1]]) + M.areaFt([[0, d.F2], [d.t2, d.F2]]);
  function elegirDatos(tipo, r) {
    const el = a => r.elegir(a), signo = () => el([-1, 1]);
    const par = () => ({ m1: el([1, 2, 3, 4, 6]), m2: el([1, 2, 3, 4, 6]), u1: el([3, 4, 5, 6, 8, 10]), u2: el([-4, -3, -2, -1, 0, 1, 2]) });
    switch (tipo) {
      case 'componente': return { m: el([0.5, 1.5, 2, 2.5, 3, 4]), u: signo() * el([2, 3, 4, 5, 6, 8]), pide: el(['componente', 'modulo']) };
      case 'conversiones': return { g: el([250, 500, 750, 1250, 1500, 2500]), kmh: signo() * el([7.2, 10.8, 14.4, 18, 21.6, 28.8]), pide: el(['componente', 'modulo']) };
      case 'despeje-carga': { const mc = el([1, 2, 3, 4]), ml = el([0.5, 1, 2, 3]); return { mc, ml, p: (mc + ml) * signo() * el([2, 3, 4, 5, 6]), unidadSalida: el(['m/s', 'km/h']) }; }
      case 'fuerza-constante': return { F: signo() * el([6, 8, 12, 16, 20, 24]), dt: el([0.2, 0.25, 0.4, 0.5, 1.5, 2, 2.5]) };
      case 'rebote-media': return { m: el([0.2, 0.25, 0.5, 1, 2]), u: el([2, 3, 4, 5, 6, 8]), w: -el([1, 2, 3, 4, 5]), dt: el([0.1, 0.2, 0.25, 0.5]) };
      case 'tramos-velocidad': return { m: el([0.5, 1, 2, 4]), u: signo() * el([1, 2, 3, 4]), F1: el([10, 20, 30, 40]), t1: el([0.2, 0.4, 0.6]), F2: -el([5, 10, 15, 20]), t2: el([0.2, 0.4, 0.5]) };
      case 'adhesion': case 'energia-transformada': return par();
      case 'elastico-frontal': return { ...par(), pide: el(['v1', 'v2']) };
      case 'retroceso': return { m1: el([1, 2, 4, 5]), m2: el([0.5, 1, 2, 3]), V: signo() * el([1, 2, 3]), w2: signo() * el([4, 6, 8, 10]) };
      case 'balance-externo': return { ...par(), I: signo() * el([2, 4, 6, 8]), w2: signo() * el([1, 2, 3, 4, 5]) };
      case 'adhesion-rampa': return { ...par(), g: 10, mu: el([0.1, 0.2, 0.25, 0.5]), pide: el(['altura', 'distancia']) };
      case 'rapidez-relativa': { const d = par(), q = choque(d, el([0.25, 0.5, 0.75, 1])); return { u1: d.u1, u2: d.u2, w1: q.v1f, w2: q.v2f }; }
      case 'alturas': { const h0 = el([0.8, 1.25, 1.8, 3.2, 5]), e = el([0.25, 0.5, 0.75, 0.8]); return { h0, h1: h0 * e * e }; }
      case 'rebote-tiempo': return { h0: el([0.2, 0.8, 1.25, 1.8, 3.2, 5]), e: el([0.25, 0.5, 0.75, 0.8]), g: 10 };
      case 'dos-cuerpos': return { m1: el([1, 2, 3, 4, 6]), x1: -el([1, 2, 3, 4]), m2: el([1, 2, 3, 4, 6]), x2: el([1, 2, 3, 4, 5, 6]) };
      case 'tres-cuerpos': return { masas: [el([1, 2, 3, 4]), el([1, 2, 3, 4]), el([2, 3, 4, 5])], posiciones: [-el([1, 2, 3]), el([0, 1, 2]), el([3, 4, 5, 6])] };
      case 'evolucion': return { ...par(), x1: -el([1, 2, 3, 4]), x2: el([1, 2, 3, 4]), t: el([0.5, 1, 1.5, 2, 3]) };
      default: throw new Error(`Tipo desconocido: ${tipo}`);
    }
  }
  function construir(tipo, d) {
    let correcta, unidad, enunciado, pregunta, datos, solucion, errores;
    const err = (id, valor, bien, fallo, reparar) => ({ id, valor, explicar: texto => `Bien ${bien}, pero si ${fallo}, sale ${texto}. ${reparar}` });
    const mass = (n, x) => v('m', `${n} = ${f(x)} kg`), vel = (n, x) => v('v', `${n} = ${f(x)} m/s`);
    const dos = () => ['Dos carritos A y B se mueven sobre la misma recta. A está a la izquierda de B. ', mass('m_A', d.m1), ', ', vel('v_A,i', d.u1), '; ', mass('m_B', d.m2), ', ', vel('v_B,i', d.u2), '.'];
    const P0 = () => d.m1 * d.u1 + d.m2 * d.u2, Mt = () => d.m1 + d.m2;
    switch (tipo) {
      case 'componente': {
        const tomar = x => d.pide === 'modulo' ? Math.abs(x) : x;
        correcta = tomar(d.m * d.u); unidad = 'kg·m/s';
        enunciado = ['Un carrito lleva ', mass('m', d.m), ' y ', vel('v_x', d.u), '.'];
        pregunta = [d.pide === 'modulo' ? '¿Cuál es el módulo de su cantidad de movimiento?' : '¿Cuánto vale la componente p_x de su cantidad de movimiento?']; datos = [D.eje, D.p];
        solucion = [['Multiplica la masa por la componente de velocidad. ', v('p', `p_x = ${f(d.m)} · (${f(d.u)}) = ${f(d.m * d.u)} kg·m/s`), '.'], [d.pide === 'modulo' ? 'El módulo es el valor absoluto de esa componente.' : 'El signo de p_x indica el sentido del movimiento.']];
        errores = [err('IC-COMP-1', -correcta, 'distinguir el sentido', 'cambias el signo', 'El signo de v_x pasa a p_x, y el módulo nunca es negativo.'), err('IC-COMP-2', tomar(d.u), 'usar la velocidad', 'omites la masa', 'La cantidad de movimiento incluye m.'), err('IC-COMP-3', tomar(d.u / d.m), 'relacionar masa y velocidad', 'divides entre la masa', 'Aquí se multiplica por la masa.'), err('IC-COMP-4', tomar(d.m * d.u * d.u), 'incluir masa y velocidad', 'elevas la velocidad al cuadrado', 'El cuadrado corresponde a la energía cinética, no a p_x.')]; break;
      }
      case 'conversiones': {
        const tomar = x => d.pide === 'modulo' ? Math.abs(x) : x, m = d.g / 1000, u = d.kmh / 3.6;
        correcta = tomar(m * u); unidad = 'kg·m/s';
        enunciado = ['Una esfera tiene ', v('m', `m = ${f(d.g)} g`), ' y ', v('v', `v_x = ${f(d.kmh)} km/h`), '.'];
        pregunta = [d.pide === 'modulo' ? '¿Cuál es el módulo de su cantidad de movimiento, en kg·m/s?' : '¿Cuál es la componente p_x de su cantidad de movimiento, en kg·m/s?']; datos = [D.eje, D.p, D.conversion];
        solucion = [['Primero convierte: ', mass('m', m), ' y ', vel('v_x', u), '.'], ['Ahora multiplica: ', v('p', `p_x = ${f(m)} · (${f(u)}) = ${f(m * u)} kg·m/s`), '.'], [d.pide === 'modulo' ? 'Toma el valor absoluto para obtener el módulo pedido.' : 'La componente conserva el signo de la velocidad.']];
        errores = [err('U4-IC', tomar(d.g * u), 'convertir la velocidad', 'usas gramos como kilogramos', 'Convierte también la masa.'), err('U1-IC', tomar(m * d.kmh), 'convertir la masa', 'usas km/h como m/s', 'Divide la velocidad entre 3,6.'), err('IC-CONV-1', -correcta, 'convertir ambas unidades', 'inviertes el signo', 'La conversión no invierte el movimiento.'), err('IC-CONV-2', tomar(u), 'pasar la velocidad a m/s', 'omites la masa', 'Multiplica los dos datos ya convertidos.')]; break;
      }
      case 'despeje-carga': {
        const mt = d.mc + d.ml, k = d.unidadSalida === 'km/h' ? 3.6 : 1;
        correcta = d.p / mt * k; unidad = d.unidadSalida;
        enunciado = ['Un carrito vacío tiene ', mass('m_c', d.mc), ' y lleva una carga de ', mass('m_L', d.ml), '. Ambos se mueven juntos con ', v('p', `p_x = ${f(d.p)} kg·m/s`), '.'];
        pregunta = [`¿Cuál es la componente de velocidad del conjunto en ${unidad}?`]; datos = [D.eje, D.p, D.conversion];
        solucion = [[`Suma las masas: m_total = ${f(mt)} kg.`], ['Despeja v_x = p_x / m_total. ', vel('v_x', d.p / mt), '.'], [`La componente pedida es ${f(correcta)} ${unidad}.`]];
        errores = [err('IC-CARGA-1', d.p / d.mc * k, 'despejar la velocidad', 'cuentas solo la masa del carrito vacío', 'También se mueve la carga.'), err('IC-CARGA-2', d.p / d.ml * k, 'contar la carga', 'olvidas la masa del carrito', 'El p_x dado pertenece al conjunto.'), err('IC-CARGA-3', d.p * mt * k, 'sumar las masas', 'multiplicas p_x por la masa total', 'Para despejar v_x se divide.'), err('IC-CARGA-4', -correcta, 'usar la masa total', 'inviertes el signo del movimiento', 'Una masa positiva no cambia el signo de p_x.')]; break;
      }
      case 'fuerza-constante': {
        correcta = d.F * d.dt; unidad = 'N·s'; enunciado = ['Sobre un deslizador actúa una fuerza neta constante ', v('F', `F_x = ${f(d.F)} N`), ' durante ', v('t', `Δt = ${f(d.dt)} s`), '.']; pregunta = ['¿Qué impulso horizontal recibe en ese intervalo?']; datos = [D.eje, D.fuerza];
        solucion = [['Multiplica fuerza por duración: ', v('I', `I_x = ${f(d.F)} · ${f(d.dt)} = ${f(correcta)} N·s`), '. El impulso tiene el signo de la fuerza.']];
        errores = [err('IC-FUERZA-1', d.F, 'identificar la fuerza', 'omites la duración', 'Fuerza e impulso tienen unidades distintas.'), err('IC-FUERZA-2', d.F / d.dt, 'usar el intervalo', 'divides la fuerza entre el tiempo', 'El área de un pulso constante es fuerza por tiempo.'), err('IC-FUERZA-3', -correcta, 'multiplicar fuerza y tiempo', 'inviertes el signo', 'El impulso apunta hacia donde apunta la fuerza.'), err('IC-FUERZA-4', correcta / 2, 'pensar en el área', 'tratas el pulso constante como triangular', 'La fuerza constante dibuja un rectángulo.')]; break;
      }
      case 'rebote-media': {
        const q = M.impulso({ m: d.m, v1: d.u, v2: d.w, dt: d.dt }); correcta = q.Fmedia; unidad = 'N';
        enunciado = ['Una pelota de ', mass('m', d.m), ' llega a una pared con ', vel('v_i,x', d.u), ' y sale con ', vel('v_f,x', d.w), '. El contacto dura ', v('t', `Δt = ${f(d.dt)} s`), '.']; pregunta = ['¿Cuál es la componente de la fuerza neta media sobre la pelota durante el contacto?']; datos = [D.eje, D.impulso, D.fuerza];
        solucion = [['Resta las componentes con sus signos: ', v('I', `I_x = ${f(d.m)} · (${f(d.w)} − ${f(d.u)}) = ${f(q.J)} N·s`), '.'], ['Divide el impulso entre la duración: ', v('F', `F_media,x = ${f(correcta)} N`), '.']];
        errores = [err('IC-REBOTE-1', d.m * (Math.abs(d.w) - Math.abs(d.u)) / d.dt, 'comparar la llegada y la salida', 'restas las rapideces sin sus sentidos', 'En un rebote hay que restar componentes con signo.'), err('IC-REBOTE-2', -d.m * d.u / d.dt, 'contar la detención inicial', 'terminas el balance cuando la pelota se detiene', 'El intervalo también incluye su salida hacia la izquierda.'), err('IC-REBOTE-3', q.J, 'calcular el cambio de p_x', 'das ese valor como fuerza sin dividirlo entre el tiempo', 'Ese número corresponde al impulso.'), err('IC-REBOTE-4', -correcta, 'hallar el módulo de la fuerza', 'cambias su sentido', 'La pelota recibe impulso hacia la izquierda.'), err('IC-REBOTE-5', q.J / (d.dt * d.dt), 'dividir el impulso entre la duración', 'vuelves a dividir entre la misma duración', 'Para obtener la fuerza media basta dividir una vez.')]; break;
      }
      case 'tramos-velocidad': {
        const I = tramoI(d); correcta = d.u + I / d.m; unidad = 'm/s';
        enunciado = ['Un deslizador de ', mass('m', d.m), ' parte con ', vel('v_i,x', d.u), '. Durante ', v('t', `${f(d.t1)} s`), ', la fuerza neta aumenta linealmente desde cero hasta ', v('F', `${f(d.F1)} N`), '. Luego cambia a ', v('F', `${f(d.F2)} N`), ' y permanece constante otros ', v('t', `${f(d.t2)} s`), '.']; pregunta = ['¿Cuál es su componente de velocidad al terminar los dos tramos?']; datos = [D.eje, D.area, D.impulso];
        solucion = [[`El primer tramo aporta ${f(d.F1 * d.t1 / 2)} N·s y el segundo ${f(d.F2 * d.t2)} N·s.`, ' ', v('I', `I_x = ${f(I)} N·s`), '.'], ['El impulso cambia la velocidad: v_f,x = v_i,x + I_x / m. ', vel('v_f,x', correcta), '.']];
        errores = [err('IC-TRAMOS-1', d.u + (d.F1 * d.t1 + d.F2 * d.t2) / d.m, 'sumar las áreas', 'tomas el primer tramo como rectángulo', 'La fuerza crece desde cero: su área es triangular.'), err('IC-TRAMOS-2', d.u + (d.F1 * d.t1 / 2 - d.F2 * d.t2) / d.m, 'considerar los dos tramos', 'haces positiva el área de la fuerza negativa', 'Las áreas bajo el eje restan impulso.'), err('IC-TRAMOS-3', I / d.m, 'calcular el cambio de velocidad', 'lo confundes con la velocidad final', 'Falta sumar la componente inicial.'), err('IC-TRAMOS-4', d.u + I, 'sumar un cambio al valor inicial', 'usas I_x en lugar de I_x / m', 'El impulso debe dividirse entre la masa.')]; break;
      }
      case 'adhesion': {
        correcta = comun(d); unidad = 'm/s'; enunciado = [...dos(), ' Al chocar quedan unidos. El impulso externo horizontal durante el choque es despreciable.']; pregunta = ['¿Con qué componente de velocidad se mueve el conjunto justo después?']; datos = [D.eje, D.balance];
        solucion = [['Conserva la cantidad de movimiento de los dos carritos: ', v('p', `P_i,x = ${f(P0())} kg·m/s`), '.'], [`La masa conjunta es ${f(Mt())} kg. Divide P_i,x entre ella: `, vel('v_f,x', correcta), '.']];
        errores = [err('IC-ADH-1', (d.u1 + d.u2) / 2, 'buscar una velocidad común', 'promedias las velocidades sin tener en cuenta las masas', 'Usa la cantidad de movimiento total.'), err('IC-ADH-2', P0() / d.m1, 'sumar el p_x inicial', 'divides solo entre m_A', 'Después se mueven ambas masas juntas.'), err('IC-ADH-3', d.m1 * d.u1 / Mt(), 'contar el aporte de A', 'omites el aporte inicial de B', 'B también tiene cantidad de movimiento.'), err('IC-ADH-4', (d.m1 * Math.abs(d.u1) + d.m2 * Math.abs(d.u2)) / Mt(), 'incluir los dos cuerpos', 'quitas los signos a las velocidades', 'Conserva el signo de cada velocidad.'), err('IC-ADH-5', -correcta, 'usar la masa conjunta', 'inviertes el sentido del resultado', 'El conjunto conserva el signo de P_i,x.')]; break;
      }
      case 'retroceso': {
        correcta = M.explosion({ m1: d.m1, m2: d.m2, V: d.V, v2: d.w2 }).v1; unidad = 'm/s';
        enunciado = ['Dos carritos unidos, de ', mass('m_A', d.m1), ' y ', mass('m_B', d.m2), ', avanzan con ', vel('v_i,x', d.V), '. Un resorte interno de masa despreciable los separa sin impulso externo horizontal. B sale con ', vel('v_B,f', d.w2), '.']; pregunta = ['¿Cuál es la componente de velocidad final de A?']; datos = [D.eje, D.balance];
        solucion = [[`Antes de separarse, P_i,x = ${f((d.m1 + d.m2) * d.V)} kg·m/s.`], ['Resta el aporte final de B y divide entre m_A: ', vel('v_A,f', correcta), '.']];
        errores = [err('IC-RET-1', -d.m2 * d.w2 / d.m1, 'equilibrar los aportes finales', 'supones que inicialmente estaban en reposo', 'Aquí el sistema tenía cantidad de movimiento inicial.'), err('IC-RET-2', ((d.m1 + d.m2) * d.V + d.m2 * d.w2) / d.m1, 'usar la cantidad inicial', 'sumas el aporte final de B al despejar', 'Ese aporte se resta de P_i,x.'), err('IC-RET-3', ((d.m1 + d.m2) * d.V - d.m2 * d.w2) / (d.m1 + d.m2), 'hallar el p_x final de A', 'lo divides entre la masa de ambos', 'Solo m_A convierte ese p_x en su velocidad.'), err('IC-RET-4', -correcta, 'hacer el balance del sistema', 'inviertes el signo final', 'El signo sale del balance, no de la palabra retroceso.')]; break;
      }
      case 'balance-externo': {
        const pf = P0() + d.I; correcta = (pf - d.m2 * d.w2) / d.m1; unidad = 'm/s';
        enunciado = [...dos(), ' Durante una interacción, el sistema recibe un impulso externo neto ', v('I', `I_ext,x = ${f(d.I)} N·s`), '. Al final, ', vel('v_B,f', d.w2), '.']; pregunta = ['¿Cuál es la componente de velocidad final de A?']; datos = [D.eje, D.balance];
        solucion = [[`El impulso externo cambia el total: P_f,x = ${f(pf)} kg·m/s.`], ['Resta m_B · v_B,f y divide entre m_A: ', vel('v_A,f', correcta), '.']];
        errores = [err('IC-EXT-1', (P0() - d.m2 * d.w2) / d.m1, 'hacer un balance del sistema', 'conservas P_x pese al impulso externo', 'Añade I_ext,x al total inicial.'), err('IC-EXT-2', (P0() - d.I - d.m2 * d.w2) / d.m1, 'incluir el impulso externo', 'lo restas aunque ya trae su signo', 'El balance suma el impulso con el signo que ya trae.'), err('IC-EXT-3', (pf + d.m2 * d.w2) / d.m1, 'hallar el total final', 'sumas el aporte de B para despejar A', 'Resta el p_x final de B.'), err('IC-EXT-4', (pf - d.m2 * d.w2) / Mt(), 'hallar el p_x final de A', 'divides entre la masa del sistema', 'La velocidad de A requiere dividir entre m_A.')]; break;
      }
      case 'elastico-frontal': {
        if (d.m1 === d.m2) return null;
        const q = choque(d, 1); correcta = d.pide === 'v1' ? q.v1f : q.v2f; unidad = 'm/s';
        enunciado = [...dos(), ' Su choque frontal es elástico y el impulso externo horizontal es despreciable.']; pregunta = [`¿Cuál es la componente de velocidad final del carrito ${d.pide === 'v1' ? 'A' : 'B'}?`]; datos = [D.eje, D.balance, D.elastico];
        solucion = [['Junta dos ecuaciones: P_f,x = P_i,x y, por ser elástico, v_B,f − v_A,f = v_A,i − v_B,i.'], ['Al resolver las dos ecuaciones: ', vel('v_A,f', q.v1f), ' y ', vel('v_B,f', q.v2f), '.']];
        errores = [err('IC-ELAS-1', comun(d), 'conservar la cantidad de movimiento', 'haces que queden unidos', 'En un choque elástico, además, se separan tan rápido como se acercaban.'), err('IC-ELAS-2', d.pide === 'v1' ? d.u2 : d.u1, 'recordar el intercambio de velocidades', 'lo aplicas a masas diferentes', 'Ese intercambio directo corresponde a masas iguales.'), err('IC-ELAS-3', d.pide === 'v1' ? q.v2f : q.v1f, 'resolver las dos velocidades', 'das la velocidad del otro carrito', 'Comprueba cuál te pide el enunciado.'), err('IC-ELAS-4', -correcta, 'hallar una velocidad final', 'inviertes su signo', 'Respeta el eje al interpretar la componente.')]; break;
      }
      case 'energia-transformada': {
        const q = choque(d, 0), ini = ec(d.m1, d.u1) + ec(d.m2, d.u2), fin = ec(Mt(), q.v1f); correcta = ini - fin; unidad = 'J';
        enunciado = [...dos(), ' Quedan unidos después del impacto y no reciben impulso externo horizontal apreciable.']; pregunta = ['¿Cuánta energía cinética se transforma durante el impacto?']; datos = [D.eje, D.balance, D.energia];
        solucion = [['Primero conserva P_x para hallar ', vel('v_f,x', q.v1f), '.'], [`Calcula E_C,inicial = ${f(ini)} J y E_C,final = ${f(fin)} J.`], [`La diferencia es E_transformada = ${f(correcta)} J.`]];
        errores = [err('IC-ENER-1', ini, 'calcular la energía inicial', 'afirmas que se transforma toda', 'El conjunto todavía puede tener energía cinética final.'), err('IC-ENER-2', fin, 'calcular la energía final', 'la confundes con la transformada', 'Se pide la diferencia entre antes y después.'), err('IC-ENER-3', 2 * correcta, 'restar las energías', 'omites el factor un medio en ambas', 'Cada E_C lleva m · v² / 2.'), err('IC-ENER-4', correcta / 2, 'usar el factor un medio', 'lo aplicas otra vez a la diferencia', 'No dividas dos veces entre dos.')]; break;
      }
      case 'adhesion-rampa': {
        const u = comun(d), a = d.pide === 'altura' ? d.g : d.mu * d.g; if (!(u > 0)) return null;
        correcta = u * u / (2 * a); unidad = 'm'; enunciado = [...dos(), ' Se unen en un choque breve sin impulso externo horizontal apreciable. ', d.pide === 'altura' ? 'Justo después suben por una rampa lisa hasta detenerse; desprecia el aire.' : `Justo después sus ruedas se bloquean y el conjunto desliza en un tramo horizontal con coeficiente de rozamiento cinético μ = ${f(d.mu)} hasta detenerse.`]; pregunta = [d.pide === 'altura' ? '¿Qué altura ganan desde el nivel donde terminó el choque?' : '¿Qué distancia recorren en el tramo rugoso antes de detenerse?']; datos = [D.eje, D.balance, D.energia, d.pide === 'altura' ? D.rampa : D.roce, `g = ${f(d.g)} m/s².`];
        solucion = [['Separa los dos tramos. En el choque se conserva P_x, y los carritos salen unidos con ', vel('v_f,x', u), '.'], [d.pide === 'altura' ? 'En la subida, la energía cinética que queda después del choque se convierte en energía potencial.' : 'En el frenado, el rozamiento quita la energía cinética que queda después del choque.'], [`La masa total se cancela y ${d.pide === 'altura' ? 'h' : 'd'} = ${f(u * u)} / ${f(2 * a)} = ${f(correcta)} m.`]];
        errores = [err('IC-RAMPA-1', (ec(d.m1, d.u1) + ec(d.m2, d.u2)) / (Mt() * a), 'relacionar energía con el recorrido posterior', 'usas toda la energía cinética anterior al impacto', 'Primero descuenta la energía transformada al unirse.'), err('IC-RAMPA-2', d.u1 * d.u1 / (2 * a), 'buscar la rapidez con que empieza el segundo tramo', 'tomas la de A antes del choque', 'La subida o el frenado empiezan con la velocidad conjunta.'), err('IC-RAMPA-3', 2 * correcta, 'usar la velocidad conjunta', 'omites el factor un medio de E_C', 'Conserva ese factor al despejar.'), err('IC-RAMPA-4', correcta / 2, 'usar la energía posterior', 'divides otra vez entre dos al despejar', 'El factor un medio ya está contado.'), err('IC-RAMPA-5', u / (2 * a), 'usar la velocidad correcta', 'olvidas elevarla al cuadrado', 'La energía cinética depende de v².')]; break;
      }
      case 'rapidez-relativa': {
        correcta = (d.w2 - d.w1) / (d.u1 - d.u2); unidad = '';
        enunciado = ['A alcanza a B sobre una recta. Antes del choque, ', vel('v_A,i', d.u1), ' y ', vel('v_B,i', d.u2), '; después, ', vel('v_A,f', d.w1), ' y ', vel('v_B,f', d.w2), '.']; pregunta = ['¿Cuál es el coeficiente de restitución del choque?']; datos = [D.eje, D.restitucion];
        solucion = [[`La rapidez de acercamiento es ${f(d.u1 - d.u2)} m/s y la de separación es ${f(d.w2 - d.w1)} m/s.`], [`Divide separación entre acercamiento: e = ${f(correcta)}.`]];
        errores = [err('IC-REL-1', 1 / correcta, 'comparar las dos rapideces relativas', 'inviertes el cociente', 'La separación va en el numerador.'), err('IC-REL-2', -correcta, 'restar velocidades', 'haces una de las restas al revés', 'Ambas rapideces relativas deben tomarse positivas.'), err('IC-REL-3', d.w2 / d.u1, 'usar velocidades de antes y después', 'divides la salida de B entre la llegada de A', 'e compara cuán rápido se separan y se acercan los dos carritos.'), err('IC-REL-4', (d.w1 + d.w2) / (d.u1 + d.u2), 'incluir los cuatro datos', 'sumas las componentes en vez de formar las diferencias', 'La rapidez relativa depende de la diferencia.'), err('IC-REL-5', correcta * correcta, 'hallar la razón de rapideces', 'la elevas al cuadrado', 'El coeficiente e es la razón sin cuadrar.')]; break;
      }
      case 'alturas': {
        correcta = M.rebotePiso({ h1: d.h0, h2: d.h1 }).e; unidad = '';
        enunciado = [`Una pelota se suelta desde el reposo. Su centro desciende ${f(d.h0)} m hasta el contacto con un piso fijo y, después del rebote, asciende ${f(d.h1)} m desde ese mismo nivel. Desprecia el aire.`]; pregunta = ['¿Cuál es el coeficiente de restitución entre la pelota y el piso?']; datos = [D.alturas];
        solucion = [['La razón de rapideces es la raíz de la razón de alturas; la gravedad se cancela.'], [`e = √(${f(d.h1)} / ${f(d.h0)}) = ${f(correcta)}.`]];
        errores = [err('IC-ALT-1', d.h1 / d.h0, 'comparar las alturas', 'olvidas sacar la raíz', 'La altura depende del cuadrado de la rapidez.'), err('IC-ALT-2', Math.sqrt(d.h0 / d.h1), 'usar la raíz', 'inviertes las alturas', 'El rebote va en el numerador.'), err('IC-ALT-3', 1 - correcta, 'hallar e', 'das 1 − e', 'Se pide e, no lo que le falta para llegar a 1.'), err('IC-ALT-4', 1 - d.h1 / d.h0, 'comparar la energía antes y después', 'das la fracción de energía transformada', 'La fracción de energía perdida no es el coeficiente e.')]; break;
      }
      case 'rebote-tiempo': {
        const llegada = Math.sqrt(2 * d.g * d.h0), rebote = d.e * llegada; correcta = 2 * rebote / d.g; unidad = 's';
        enunciado = [`Una pelota cae desde el reposo: su centro desciende ${f(d.h0)} m hasta tocar un piso fijo. El coeficiente de restitución es e = ${f(d.e)}. Desprecia el aire y la duración del contacto.`]; pregunta = ['¿Cuánto dura el vuelo desde que sale del primer rebote hasta que vuelve a tocar el piso?']; datos = [D.alturas, D.vuelo, `g = ${f(d.g)} m/s².`];
        solucion = [[`La rapidez de llegada es ${f(llegada)} m/s; al rebotar se multiplica por e y queda ${f(rebote)} m/s.`], [`El vuelo tiene subida y bajada: t_vuelo = ${f(2 * rebote)} / ${f(d.g)} = ${f(correcta)} s.`]];
        errores = [err('IC-VUELO-1', correcta / 2, 'calcular el tiempo de subida', 'olvidas sumar la bajada al mismo nivel', 'El vuelo completo dura el doble.'), err('IC-VUELO-2', 2 * llegada / d.g, 'usar la rapidez de llegada', 'ignoras la reducción en el rebote', 'Primero multiplica esa rapidez por e.'), err('IC-VUELO-3', 2 * d.e * d.e * llegada / d.g, 'considerar el coeficiente', 'lo aplicas dos veces a la rapidez', 'Solo hay un rebote antes del vuelo pedido.'), err('IC-VUELO-4', 2 * llegada / (d.e * d.g), 'usar e en el rebote', 'divides la rapidez entre e', 'En un rebote se multiplica por e.')]; break;
      }
      case 'dos-cuerpos': {
        correcta = M.centroMasa([{ m: d.m1, x: d.x1 }, { m: d.m2, x: d.x2 }]).x; unidad = 'm';
        enunciado = ['Dos masas pequeñas están sobre una recta: ', mass('m_A', d.m1), ` en x_A = ${f(d.x1)} m y `, mass('m_B', d.m2), ` en x_B = ${f(d.x2)} m. Ambas posiciones se miden desde el mismo origen.`]; pregunta = ['¿Dónde está el centro de masa del par?']; datos = [D.eje, D.cm];
        solucion = [[`La suma de cada masa por su posición es ${f(d.m1 * d.x1 + d.m2 * d.x2)} kg·m y la masa total es ${f(Mt())} kg.`], [`Al dividir, x_CM = ${f(correcta)} m. El centro de masa queda entre las dos posiciones.`]];
        errores = [err('IC-CM2-1', (d.x1 + d.x2) / 2, 'buscar un promedio', 'cuentas igual las dos posiciones', 'Cada posición cuenta según la masa de su cuerpo.'), err('IC-CM2-2', (d.m1 * d.x1 + d.m2 * d.x2) / 2, 'ponderar las posiciones', 'divides entre el número de cuerpos', 'Divide entre la suma de masas.'), err('IC-CM2-3', (d.m1 * Math.abs(d.x1) + d.m2 * Math.abs(d.x2)) / Mt(), 'incluir ambas masas', 'quitas los signos de las posiciones', 'Las posiciones se miden desde un origen con signo.'), err('IC-CM2-4', (d.m2 * d.x1 + d.m1 * d.x2) / Mt(), 'usar una media ponderada', 'intercambias las masas asociadas a las posiciones', 'Cada masa multiplica su propia posición.')]; break;
      }
      case 'tres-cuerpos': {
        const total = d.masas.reduce((a, b) => a + b), suma = d.masas.reduce((s, m, k) => s + m * d.posiciones[k], 0);
        correcta = M.centroMasa(d.masas.map((m, k) => ({ m, x: d.posiciones[k] }))).x; unidad = 'm';
        enunciado = ['Tres masas pequeñas comparten un origen sobre una recta. ', ...d.masas.flatMap((m, k) => [mass(`m_${['A', 'B', 'C'][k]}`, m), ` está en x_${['A', 'B', 'C'][k]} = ${f(d.posiciones[k])} m${k === 2 ? '.' : '; '}`])]; pregunta = ['¿Cuál es la posición del centro de masa de las tres?']; datos = [D.eje, D.cm];
        solucion = [[`Suma los tres productos m · x: ${f(suma)} kg·m. La masa total es ${f(total)} kg.`], [`Divide esa suma entre la masa total: x_CM = ${f(correcta)} m.`]];
        errores = [err('IC-CM3-1', d.posiciones.reduce((a, b) => a + b) / 3, 'incluir las tres posiciones', 'promedias sin considerar las masas', 'Usa una media ponderada.'), err('IC-CM3-2', suma / 3, 'sumar los productos correctos', 'divides entre tres', 'El denominador es la masa total.'), err('IC-CM3-3', (d.masas[0] * d.posiciones[0] + d.masas[1] * d.posiciones[1]) / (d.masas[0] + d.masas[1]), 'ponderar los dos primeros cuerpos', 'omites el tercero', 'El sistema pedido contiene las tres masas.'), err('IC-CM3-4', d.masas.reduce((s, m, k) => s + m * Math.abs(d.posiciones[k]), 0) / total, 'contar las tres masas', 'quitas el signo de las posiciones', 'Con un mismo origen, cada posición conserva su signo.')]; break;
      }
      case 'evolucion': {
        const x0 = M.centroMasa([{ m: d.m1, x: d.x1 }, { m: d.m2, x: d.x2 }]).x, vc = P0() / Mt(); if (Math.abs(P0()) < 1e-8) return null;
        correcta = x0 + vc * d.t; unidad = 'm';
        enunciado = ['En t = 0, ', mass('m_A', d.m1), ` está en x_A = ${f(d.x1)} m con `, vel('v_A,x', d.u1), '; ', mass('m_B', d.m2), ` está en x_B = ${f(d.x2)} m con `, vel('v_B,x', d.u2), '. Las posiciones tienen el mismo origen. Durante el intervalo no actúa fuerza externa horizontal neta; los cuerpos pueden interactuar entre sí.']; pregunta = [`¿Dónde estará el centro de masa después de ${f(d.t)} s?`]; datos = [D.eje, D.cm, D.evolucion];
        solucion = [[`Primero calcula x_CM(0) = ${f(x0)} m y v_CM,x = ${f(vc)} m/s.`], [`El centro de masa avanza con velocidad constante: x_CM(t) = ${f(correcta)} m.`]];
        errores = [err('IC-EVOL-1', x0, 'hallar la posición inicial', 'supones que, sin fuerza externa, el centro de masa queda quieto', 'El centro de masa puede seguir con velocidad constante.'), err('IC-EVOL-2', vc * d.t, 'hallar el desplazamiento', 'lo confundes con la posición final', 'Suma la posición inicial medida desde el origen.'), err('IC-EVOL-3', (d.x1 + d.x2) / 2 + (d.u1 + d.u2) * d.t / 2, 'avanzar ambas posiciones', 'las promedias sin sus masas', 'Pondera las posiciones y las velocidades.'), err('IC-EVOL-4', x0 - vc * d.t, 'incluir la posición inicial', 'restas el avance en vez de sumarlo', 'La ecuación suma v_CM,x · t.')]; break;
      }
    }
    return { correcta, unidad, enunciado, pregunta, datos, solucion, errores };
  }
  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? {} : opciones || {}, r = Azar.crear(`${ID}|${semilla}`);
    if (o.tipo && !TIPOS.includes(o.tipo)) throw new Error(`Tipo desconocido: ${o.tipo}`);
    if (o.idea && !TIPOS_POR_IDEA[o.idea]) throw new Error(`Idea desconocida: ${o.idea}`);
    const papel = !o.tipo && !o.idea && PAPEL[String(semilla)];
    const tipo = o.tipo || papel || r.elegir(TIPOS_POR_IDEA[o.idea || r.elegir(IDEAS)]);
    if (o.idea && IDEA[tipo] !== o.idea) throw new Error('El tipo no pertenece a la idea solicitada');
    for (let intento = 0; intento < 1000; intento++) {
      const d = papel ? FIJOS[String(semilla)] : elegirDatos(tipo, r), p = construir(tipo, d);
      if (!p || !exacto(p.correcta) || Math.abs(p.correcta) < 1e-8) continue;
      // Evita escribir como exactos los valores intermedios o de entrada de una solución redondeada.
      const nums = Object.values(d).flat(); if (!nums.filter(x => typeof x === 'number').every(exacto)) continue;
      if (['elastico-frontal', 'energia-transformada', 'adhesion-rampa'].includes(tipo)) {
        const q = choque(d, tipo === 'elastico-frontal' ? 1 : 0); if (![q.v1f, q.v2f, ec(d.m1 + d.m2, q.v1f)].every(exacto)) continue;
      }
      if (tipo === 'evolucion' && ![(d.m1 * d.x1 + d.m2 * d.x2) / (d.m1 + d.m2), (d.m1 * d.u1 + d.m2 * d.u2) / (d.m1 + d.m2)].every(exacto)) continue;
      const fmt = n => `${f(n)}${p.unidad ? ' ' + p.unidad : ''}`, vistos = new Set([fmt(p.correcta)]), errores = [];
      for (const e of r.barajar(p.errores)) {
        if (!exacto(e.valor) || !P.enEscala(e.valor, p.correcta, e.id) || vistos.has(fmt(e.valor))) continue;
        vistos.add(fmt(e.valor)); errores.push({ id: e.id, valor: e.valor, explicacion: e.explicar(fmt(e.valor)), respaldo: 'hipotesis', fuente: FUENTE });
      }
      if (errores.length < 3) continue;
      const alternativas = P.armar({ correcta: p.correcta, errores, rng: r, texto: fmt, negativos: true, total: 5 });
      return { id: `${ID}-${semilla}`, variables: VARIABLES, enunciado: p.enunciado, pregunta: p.pregunta, datos: p.datos,
        alternativas, solucion: p.solucion, respuesta: { valor: p.correcta, unidad: p.unidad },
        _datos: { idea: IDEA[tipo], tipo, nivel: NIVEL[tipo], ...d } };
    }
    throw new Error(`${ID}: no salió un caso exacto con alternativas distintas para ${tipo} (${semilla})`);
  }
  return { id: ID, titulo: 'Impulso y choques', generar, TIPOS, NIVEL, TIPOS_POR_IDEA, PAPEL };
});
