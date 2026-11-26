/* Práctica propia de Oscilaciones: 18 familias, seis ideas y tres niveles.
 * Física local y determinística; no carga teoría, escenas ni otros motores.
 * Datos contiene condiciones y equivalencias, nunca fórmulas de resolución.
 * Los errores son hipótesis: docs/etapa11/errores-fisica.md.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'fis-oscilaciones', UNIDAD = 'fisica.oscilaciones', FUENTE = 'docs/etapa11/errores-fisica.md';
  const TIPOS_POR_IDEA = {
    'ciclo-y-amplitud': ['extremos-amplitud', 'conteo-periodo', 'recorrido-mixto'],
    'aceleracion-al-centro': ['fuerza-posicion', 'aceleracion-masa', 'masa-dos-estados'],
    'graficas-mas': ['estado-cuartos', 'velocidad-fase', 'primer-paso'],
    'periodo-resorte': ['resorte-periodo', 'resorte-vertical', 'resortes-conectados'],
    pendulo: ['pendulo-periodo', 'pendulo-razon', 'pendulo-longitud'],
    'energia-mas': ['energia-total', 'rapidez-posicion', 'amplitud-desde-estado'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA), TIPOS = IDEAS.flatMap(i => TIPOS_POR_IDEA[i]);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map((t, n) => [t, n + 1])));
  const PAPEL = { 'papel-1': 'conteo-periodo', 'papel-2': 'aceleracion-masa', 'papel-3': 'estado-cuartos', 'papel-4': 'resorte-vertical',
    'papel-5': 'pendulo-longitud', 'papel-6': 'rapidez-posicion', 'papel-7': 'resortes-conectados', 'papel-8': 'amplitud-desde-estado' };
  const VARIABLES = {
    x: { nombre: 'posición desde el equilibrio', color: 'i' }, A: { nombre: 'amplitud', color: 'i' }, L: { nombre: 'longitud', color: 'i' }, d: { nombre: 'distancia recorrida', color: 'i' },
    v: { nombre: 'velocidad o rapidez indicada', color: 'o' }, F: { nombre: 'fuerza horizontal neta', color: 'd' }, a: { nombre: 'aceleración horizontal', color: 'd' },
    m: { nombre: 'masa', color: 'f' }, k: { nombre: 'rigidez del resorte', color: 'f' }, N: { nombre: 'cantidad de ciclos o llegadas indicada', color: 'f' },
    t: { nombre: 'instante o duración indicada', color: 'h' }, T: { nombre: 'período', color: 'h' }, f: { nombre: 'frecuencia', color: 'h' },
    omega: { nombre: 'frecuencia angular', color: 'h' }, phi: { nombre: 'fase', color: 'h' }, g: { nombre: 'gravedad de cálculo', color: 'h' },
    EC: { nombre: 'energía cinética', color: 'o' }, EPE: { nombre: 'energía del resorte', color: 'i' }, EM: { nombre: 'energía mecánica', color: 'f' },
  };
  const NOMBRES = { omega: 'ω', phi: 'φ', EC: 'energía cinética', EPE: 'energía del resorte', EM: 'energía mecánica' };
  const cero = n => Math.abs(n) < 1e-12 ? 0 : n;
  const f = n => P.formatear(cero(n), 3);
  const red = n => Math.round(n * 1e9) / 1e9;
  const mismo = (a, b) => typeof a === 'string' || typeof b === 'string' ? a === b : Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  const exacto = n => Math.abs(n - Math.round(n * 1000) / 1000) < 1e-9;
  const v = (k, t) => P.v(k, t), s = k => v(k, NOMBRES[k] || k);
  const q = (k, n, u = '') => v(k, f(n) + (u ? ' ' + u : ''));
  const pi = n => P.pi(n, '', 100);
  const qpi = (k, n, u = '') => v(k, pi(n) + (u ? ' ' + u : ''));
  function mostrar(n, unidad, modo, forzar = false) {
    const simbolico = modo === 'pi' && pi(n);
    const aproximado = forzar || (!simbolico && !exacto(n));
    return { aproximado, numero: simbolico || f(n), texto: `${aproximado ? '≈ ' : ''}${simbolico || f(n)}${unidad ? ' ' + unidad : ''}` };
  }
  function final(k, n, unidad, modo = '', forzar = false) {
    const z = mostrar(n, unidad, modo, forzar);
    return [s(k), z.aproximado ? ' ≈ ' : ' = ', v(k, z.numero + (unidad ? ' ' + unidad : '')), '.'];
  }
  const error = (operacion, valor, motivo) => ({ operacion, valor: typeof valor === 'number' ? cero(valor) : valor, motivo });
  const horizontal = ['Resorte horizontal ideal, de masa despreciable y sin rozamiento.', 'La derecha es positiva y el equilibrio fija el origen.', 'La única fuerza horizontal sobre el bloque es la del resorte.'];
  const cm = '1 m = 100 cm.';
  const pendulo = angulo => ['Hilo inextensible sin masa, apoyo fijo y rozamiento despreciable.', 'La longitud llega del apoyo al centro de la pesa.', `Amplitud angular de ${angulo}°; se usa la aproximación de ángulo pequeño.`];
  const elegir = (rng, lista) => rng.elegir(lista);
  const periodo = (m, k) => 2 * Math.PI * Math.sqrt(m / k);
  const energia = (k, x) => k * x * x / 2;
  const CONSTRUIR = {};

  CONSTRUIR['extremos-amplitud'] = rng => {
    const A = elegir(rng, [3, 4, 5, 7, 8, 9, 11, 13, 14, 16, 18, 22]), izquierdoCm = -A, derechoCm = A;
    return { entradas: { izquierdoCm, derechoCm }, modelo: 'oscilacion-simetrica', clave: 'A', valor: (derechoCm - izquierdoCm) / 2, unidad: 'cm', datos: horizontal,
      enunciado: ['Un bloque oscila entre ', q('x', izquierdoCm, 'cm'), ' y ', q('x', derechoCm, 'cm'), ', con el equilibrio en cero.'], pregunta: ['¿Cuál es su amplitud?'],
      solucion: [['Medimos desde el equilibrio hasta un extremo: ', s('A'), ' = |', q('x', izquierdoCm), '| = ', q('A', A, 'cm'), '.'], ['La amplitud es positiva; la separación entre extremos abarca dos amplitudes.']],
      errores: [error('ENTRE_EXTREMOS', derechoCm - izquierdoCm, 'mediste entre los extremos'), error('POSICION_IZQUIERDA', izquierdoCm, 'diste la posición negativa del extremo'), error('RECORRIDO', 4 * A, 'diste el recorrido de un ciclo completo')] };
  };
  CONSTRUIR['conteo-periodo'] = rng => {
    const T = elegir(rng, [0.4, 0.6, 0.8, 1.2, 1.5, 2, 2.5, 3]), llegadas = elegir(rng, [4, 5, 6, 8, 9, 10]);
    const primerInstante = elegir(rng, [1, 2, 3, 4, 5]), D = red((llegadas - 1) * T), ultimoInstante = red(primerInstante + D), pide = elegir(rng, ['periodo', 'frecuencia']);
    const n = llegadas - 1, valor = pide === 'periodo' ? D / n : n / D, clave = pide === 'periodo' ? 'T' : 'f', unidad = pide === 'periodo' ? 's' : 'Hz';
    return { entradas: { primerInstante, ultimoInstante, llegadas, pide }, modelo: 'movimiento-periodico', clave, valor, unidad,
      enunciado: ['La primera llegada al extremo derecho ocurre a los ', q('t', primerInstante, 's'), '; la llegada número ', q('N', llegadas), ', a los ', q('t', ultimoInstante, 's'), '.'],
      pregunta: [pide === 'periodo' ? '¿Cuál es el período?' : '¿Cuál es la frecuencia?'], datos: ['Las llegadas al mismo extremo son consecutivas y el movimiento mantiene su período.'],
      solucion: [['Contamos los intervalos entre las llegadas: ', s('N'), ' = ', q('N', llegadas), ' − 1 = ', q('N', n), '.'], ['Restamos los instantes: duración = ', q('t', ultimoInstante), ' − ', q('t', primerInstante), ' = ', q('t', D, 's'), '.'],
        [pide === 'periodo' ? 'El período es tiempo por ciclo: ' : 'La frecuencia es ciclos por segundo: ', s(clave), ' = ', ...(pide === 'periodo' ? [q('t', D), ' / ', q('N', n)] : [q('N', n), ' / ', q('t', D)]), mostrar(valor, unidad).aproximado ? ' ≈ ' : ' = ', q(clave, valor, unidad), '.']],
      errores: [error('CUENTA_LLEGADAS', pide === 'periodo' ? D / llegadas : llegadas / D, 'contaste llegadas en vez de intervalos'), error('NO_RESTA_INICIO', pide === 'periodo' ? ultimoInstante / n : n / ultimoInstante, 'omitiste restar el instante inicial'), error('INVIERTE', pide === 'periodo' ? n / D : D / n, 'invertiste tiempo y cantidad de ciclos')] };
  };
  CONSTRUIR['recorrido-mixto'] = rng => {
    const ACm = elegir(rng, [5, 8, 10, 12, 15, 18, 20]), T = elegir(rng, [2, 4, 6, 8]), completos = elegir(rng, [2, 3, 4, 5, 6]), t = T * (completos + 0.5), inicio = elegir(rng, ['derecha', 'izquierda']);
    const valor = (4 * ACm * completos + 2 * ACm) / 100;
    return { entradas: { ACm, T, t, inicio }, modelo: 'mas-desde-extremo', clave: 'd', valor, unidad: 'm', datos: [...horizontal, cm],
      enunciado: ['Un bloque parte del extremo ', inicio === 'derecha' ? 'derecho' : 'izquierdo', ', con amplitud ', q('A', ACm, 'cm'), ' y período ', q('T', T, 's'), '.'], pregunta: ['¿Cuántos metros recorre en ', q('t', t, 's'), '?'],
      solucion: [['Separamos ciclos completos y medio ciclo: ', q('t', t, 's'), ' = ', q('N', completos), ' · ', q('T', T, 's'), ' + ', q('t', T / 2, 's'), '.'], ['Cada ciclo recorre cuatro amplitudes; el medio ciclo final recorre dos.'],
        ['Sumamos el recorrido y pasamos a metros: ', s('d'), ' = (4 · ', q('A', ACm), ' · ', q('N', completos), ' + 2 · ', q('A', ACm), ') / 100 = ', q('d', valor, 'm'), '.']],
      errores: [error('OMITE_MEDIO', 4 * ACm * completos / 100, 'omitiste el medio ciclo final'), error('MEDIO_EXTRA', (4 * ACm * completos + 4 * ACm) / 100, 'contaste otro medio ciclo que no transcurrió'), error('DESPLAZAMIENTO', (inicio === 'derecha' ? -2 : 2) * ACm / 100, 'diste el desplazamiento entre los extremos, no la distancia recorrida')] };
  };
  CONSTRUIR['fuerza-posicion'] = rng => {
    const k = elegir(rng, [20, 30, 40, 50, 70, 80]), xCm = elegir(rng, [-12, -10, -8, -6, -4, 3, 5, 7, 9, 11]), x = xCm / 100, valor = -k * x;
    return { entradas: { k, xCm }, modelo: 'resorte-horizontal', clave: 'F', valor, unidad: 'N', datos: [...horizontal, 'La mano ya se retiró; la fuerza horizontal es la del resorte.', cm],
      enunciado: ['Un resorte de ', q('k', k, 'N/m'), ' tiene al bloque en ', s('x'), ' = ', q('x', xCm, 'cm'), '.'], pregunta: ['¿Qué fuerza horizontal ejerce sobre el bloque?'],
      solucion: [['Convertimos la posición: ', s('x'), ' = ', q('x', xCm), ' / 100 = ', q('x', x, 'm'), '.'], ['Aplicamos la fuerza restauradora: ', s('F'), ' = −', s('k'), ' · ', s('x'), ' = −', q('k', k), ' · (', q('x', x), ') = ', q('F', valor, 'N'), '.'], ['La fuerza tiene sentido contrario a la posición respecto del equilibrio.']],
      errores: [error('SIGNO', -valor, 'omitiste el signo restaurador'), error('DOBLE_FUERZA', 2 * valor, 'contaste dos veces la fuerza del único resorte'), error('PROMEDIO', valor / 2, 'promediaste con cero en vez de evaluar este instante')] };
  };
  CONSTRUIR['aceleracion-masa'] = rng => {
    const m = elegir(rng, [0.25, 0.4, 0.5, 0.75, 1.5, 2.5]), k = elegir(rng, [20, 30, 40, 50, 80]), xCm = elegir(rng, [-9, -7, -5, -3, 4, 6, 8, 10]);
    if (m === 0.4 && k === 30 && xCm === 8) return null; // Ejemplo resuelto de la teoría.
    const F = -k * xCm / 100, valor = F / m;
    return { entradas: { m, k, xCm }, modelo: 'resorte-horizontal', clave: 'a', valor, unidad: 'm/s²', datos: [...horizontal, 'La mano ya se retiró; no hay otra fuerza horizontal.', cm],
      enunciado: ['Un bloque de ', q('m', m, 'kg'), ' está unido a un resorte de ', q('k', k, 'N/m'), '. Su posición es ', q('x', xCm, 'cm'), '.'], pregunta: ['¿Cuál es su aceleración con signo?'],
      solucion: [['Calculamos la fuerza con la posición en metros: ', s('F'), ' = −', q('k', k), ' · (', q('x', xCm / 100), ') = ', q('F', F, 'N'), '.'], ['Dividimos la fuerza neta entre la masa: ', s('a'), ' = ', s('F'), ' / ', s('m'), ' = (', q('F', F), ') / ', q('m', m), mostrar(valor, 'm/s²').aproximado ? ' ≈ ' : ' = ', q('a', valor, 'm/s²'), '.']],
      errores: [error('SIGNO', -valor, 'cambiaste el sentido de la fuerza neta'), error('SIN_MASA', F, 'diste la fuerza como si fuera aceleración'), error('MASA_DOS_VECES', valor / m, 'dividiste dos veces entre la masa')] };
  };
  CONSTRUIR['masa-dos-estados'] = rng => {
    const k = elegir(rng, [20, 30, 40, 60]), masa = elegir(rng, [0.25, 0.4, 0.5, 0.8]);
    const xPrimeroCm = elegir(rng, [-6, -5, -4, 3, 4, 5, 6]), xSegundoCm = -xPrimeroCm * elegir(rng, [2, 3]);
    const fuerzaPrimera = red(-k * xPrimeroCm / 100), aceleracionSegunda = red(-k * xSegundoCm / (100 * masa)), F2 = -k * xSegundoCm / 100, valor = F2 / aceleracionSegunda;
    return { entradas: { xPrimeroCm, fuerzaPrimera, xSegundoCm, aceleracionSegunda }, modelo: 'mismo-resorte-misma-masa', clave: 'm', valor, unidad: 'kg', datos: [...horizontal, 'El bloque y el resorte son los mismos en ambos estados.', cm],
      enunciado: ['En el primer estado, el resorte ejerce ', q('F', fuerzaPrimera, 'N'), ' en ', q('x', xPrimeroCm, 'cm'), '. En el segundo, el bloque acelera a ', q('a', aceleracionSegunda, 'm/s²'), ' en ', q('x', xSegundoCm, 'cm'), '.'], pregunta: ['¿Cuál es la masa del bloque?'],
      solucion: [['Despejamos la rigidez usando el primer estado: ', s('k'), ' = −', s('F'), ' / ', s('x'), ' = −(', q('F', fuerzaPrimera), ') / (', q('x', xPrimeroCm / 100), ') = ', q('k', k, 'N/m'), '.'],
        ['Calculamos la fuerza del segundo estado: ', s('F'), ' = −', q('k', k), ' · (', q('x', xSegundoCm / 100), ') = ', q('F', F2, 'N'), '.'],
        ['Despejamos la masa de la segunda ley: ', s('m'), ' = ', s('F'), ' / ', s('a'), ' = (', q('F', F2), ') / (', q('a', aceleracionSegunda), ') = ', q('m', valor, 'kg'), '.']],
      errores: [error('INVIERTE_MASA', 1 / valor, 'dividiste aceleración entre fuerza'), error('MANTIENE_FUERZA', fuerzaPrimera / aceleracionSegunda, 'conservaste la fuerza del primer estado'), error('POSICIONES_INVERTIDAS', fuerzaPrimera * xPrimeroCm / (xSegundoCm * aceleracionSegunda), 'invertiste las posiciones al trasladar la fuerza')] };
  };

  function estadoCuarto(cuarto, A) {
    const i = ((cuarto % 4) + 4) % 4, x = [A, 0, -A, 0][i], sentido = ['reposo', 'izquierda', 'reposo', 'derecha'][i];
    return { clave: `x=${x};sentido=${sentido}`, texto: `x = ${f(x)} cm; ${sentido === 'reposo' ? 'reposo instantáneo' : 'hacia la ' + sentido}` };
  }
  CONSTRUIR['estado-cuartos'] = rng => {
    const ACm = elegir(rng, [5, 7, 9, 11, 13, 15, 17]), T = elegir(rng, [4, 6, 10, 12]), cuartos = elegir(rng, [1, 2, 3, 4, 5, 6, 7, 8]), t = T * cuartos / 4;
    const inicio = elegir(rng, ['derecha', 'izquierda']), q0 = inicio === 'derecha' ? 0 : 2, actual = estadoCuarto(q0 + cuartos, ACm);
    const estados = [actual, estadoCuarto(q0 + cuartos - 1, ACm), estadoCuarto(q0 + cuartos + 2, ACm), estadoCuarto(q0 + cuartos + 1, ACm)];
    const textos = Object.fromEntries(estados.map(e => [e.clave, e.texto]));
    return { entradas: { ACm, T, t, inicio }, modelo: 'mas-desde-extremo', clave: 'x', valor: actual.clave, unidad: '', formato: k => textos[k], datos: horizontal,
      enunciado: ['Un bloque parte en reposo del extremo ', inicio === 'derecha' ? 'derecho' : 'izquierdo', ', con amplitud ', q('A', ACm, 'cm'), ' y período ', q('T', T, 's'), '.'],
      pregunta: ['¿Dónde está y hacia dónde se mueve a los ', q('t', t, 's'), '?'],
      solucion: [['Contamos los cuartos transcurridos: cuartos = ', q('t', t), ' / (', q('T', T), ' / 4) = ', q('N', cuartos), '.'],
        ['Desde un extremo, cada cuarto lleva al centro, al extremo opuesto, al centro y al extremo inicial.'], ['El estado que corresponde al tiempo indicado es ', actual.texto, '.']],
      errores: [error('CUENTA_INICIO', estados[1].clave, 'incluiste el estado inicial en el conteo y avanzaste un cuarto menos'), error('EXTREMO_OPUESTO', estados[2].clave, 'empezaste en el extremo opuesto'), error('CUARTO_EXTRA', estados[3].clave, 'sumaste un cuarto de período que no transcurrió')] };
  };
  const senTexto = ['0', '1/2', '√3/2', '1', '√3/2', '1/2', '0', '−1/2', '−√3/2', '−1', '−√3/2', '−1/2'];
  const cosTexto = ['1', '√3/2', '1/2', '0', '−1/2', '−√3/2', '−1', '−√3/2', '−1/2', '0', '1/2', '√3/2'];
  CONSTRUIR['velocidad-fase'] = rng => {
    const ACm = elegir(rng, [6, 8, 10, 12, 15, 18, 20]), T = elegir(rng, [6, 12, 18, 24]), fasePiNumerador = elegir(rng, [0, 1, 2, 3, 4, 6, 9]), fasePiDenominador = 6;
    const pasos = elegir(rng, [1, 2, 3, 4, 5, 7, 8, 9, 10, 11]), t = T * pasos / 12, faseTotal = (fasePiNumerador + pasos) * Math.PI / 6, indice = (fasePiNumerador + pasos) % 12;
    if ([0, 3, 6, 9].includes(indice)) return null;
    const A = ACm / 100, omega = 2 * Math.PI / T, seno = Math.sin(faseTotal), coseno = Math.cos(faseTotal), valor = -A * omega * seno;
    return { entradas: { ACm, T, t, fasePiNumerador, fasePiDenominador }, modelo: 'mas-fase', clave: 'v', valor, unidad: 'm/s',
      enunciado: ['Un bloque tiene amplitud ', q('A', ACm, 'cm'), ', período ', q('T', T, 's'), ' y fase inicial ', qpi('phi', fasePiNumerador * Math.PI / 6, 'rad'), '.'], pregunta: ['¿Cuál es su velocidad con signo a los ', q('t', t, 's'), '?'],
      datos: [...horizontal, cm, `sen(${pi(faseTotal)}) = ${senTexto[indice]}; cos(${pi(faseTotal)}) = ${cosTexto[indice]}.`],
      solucion: [['Calculamos la frecuencia angular: ', s('omega'), ' = 2π / ', s('T'), ' = 2π / ', q('T', T), ' = ', qpi('omega', omega, 'rad/s'), '.'],
        ['Sumamos la fase inicial y el avance: fase = ', qpi('omega', omega), ' · ', q('t', t), ' + ', qpi('phi', fasePiNumerador * Math.PI / 6), ' = ', qpi('phi', faseTotal, 'rad'), '.'],
        ['Convertimos amplitud y evaluamos la velocidad: ', s('v'), ' = −', q('A', A), ' · (', qpi('omega', omega), ') · (', v('phi', senTexto[indice]), ')', mostrar(valor, 'm/s').aproximado ? ' ≈ ' : ' = ', q('v', valor, 'm/s'), '.'],
        [valor < 0 ? 'El signo negativo indica movimiento hacia la izquierda.' : 'El signo positivo indica movimiento hacia la derecha.']],
      errores: [error('SIGNO', -valor, 'omitiste el signo menos de la velocidad'), error('SIN_OMEGA', -A * seno, 'omitiste multiplicar por la frecuencia angular'), error('COSENO', -A * omega * coseno, 'usaste coseno en lugar de seno')] };
  };
  function primerPaso(ACm, T, xCm, sentido, inicio) {
    const theta = Math.acos(xCm / ACm), meta = sentido === 'derecha' ? 2 * Math.PI - theta : theta, inicial = inicio === 'derecha' ? 0 : Math.PI;
    let avance = (meta - inicial + 2 * Math.PI) % (2 * Math.PI);
    if (avance < 1e-10) avance = 2 * Math.PI;
    return { tiempo: T * avance / (2 * Math.PI), avance, inicial, meta: inicial + avance };
  }
  CONSTRUIR['primer-paso'] = rng => {
    const ACm = elegir(rng, [8, 10, 14, 16, 18, 22, 24]), T = elegir(rng, [6, 12, 18, 24, 30]), xCm = ACm * elegir(rng, [-0.5, 0.5]);
    const sentido = elegir(rng, ['derecha', 'izquierda']), inicio = elegir(rng, ['derecha', 'izquierda']), e = primerPaso(ACm, T, xCm, sentido, inicio), valor = red(e.tiempo);
    if (T === 18 && inicio === 'derecha' && xCm > 0 && sentido === 'derecha') return null; // Primer regreso ya resuelto en teoría.
    return { entradas: { ACm, T, xCm, sentido, inicio }, modelo: 'mas-primer-paso', clave: 't', valor, unidad: 's',
      enunciado: ['Un bloque parte en reposo del extremo ', inicio === 'derecha' ? 'derecho' : 'izquierdo', ', con amplitud ', q('A', ACm, 'cm'), ' y período ', q('T', T, 's'), '.'],
      pregunta: ['¿En qué primer instante positivo pasa por ', q('x', xCm, 'cm'), ' hacia la ', sentido, '?'],
      datos: [...horizontal, 'cos(π/3) = 1/2; cos(2π/3) = −1/2.'],
      solucion: [['La posición fija el coseno: cos(fase) = ', q('x', xCm), ' / ', q('A', ACm), ' = ', q('phi', xCm / ACm), '.'],
        ['El sentido selecciona la primera fase posterior: fase inicial = ', qpi('phi', e.inicial, 'rad'), '; fase final = ', qpi('phi', e.meta, 'rad'), '.'],
        ['Restamos las fases: avance = ', qpi('phi', e.meta), ' − ', qpi('phi', e.inicial), ' = ', qpi('phi', e.avance, 'rad'), '.'],
        ['Dividimos por la frecuencia angular: ', s('t'), ' = (', qpi('phi', e.avance), ') / (2π / ', q('T', T), ') = ', q('t', valor, 's'), '.']],
      errores: [error('OTRO_EXTREMO', red(primerPaso(ACm, T, xCm, sentido, inicio === 'derecha' ? 'izquierda' : 'derecha').tiempo), 'partiste del extremo opuesto'), error('FRECUENCIA_DOBLE', valor / 2, 'usaste 4π/T en vez de 2π/T'), error('VUELTA_EXTRA', valor + T, 'elegiste la llegada siguiente a ese mismo estado')] };
  };
  CONSTRUIR['resorte-periodo'] = rng => {
    const k = elegir(rng, [12, 16, 24, 32, 48, 64, 72, 96]), cocienteRaiz = elegir(rng, [0.1, 0.15, 0.2, 0.25, 0.3, 0.4]), m = red(k * cocienteRaiz * cocienteRaiz), valor = periodo(m, k);
    return { entradas: { m, k }, modelo: 'resorte-horizontal', clave: 'T', valor, unidad: 's', modo: 'pi', datos: horizontal,
      enunciado: ['Un bloque de ', q('m', m, 'kg'), ' oscila unido a un resorte de ', q('k', k, 'N/m'), '.'], pregunta: ['¿Cuál es el período de una oscilación completa?'],
      solucion: [['Aplicamos el período del resorte ideal: ', s('T'), ' = 2π · √(', s('m'), ' / ', s('k'), ').'], ['Reemplazamos las cantidades: ', s('T'), ' = 2π · √(', q('m', m), ' / ', q('k', k), ') = ', qpi('T', valor, 's'), '.']],
      errores: [error('SIN_2PI', Math.sqrt(m / k), 'omitiste el factor 2π'), error('SIN_RAIZ', 2 * Math.PI * m / k, 'omitiste extraer la raíz'), error('DOS_CICLOS', 2 * valor, 'sumaste el tiempo de dos ciclos')] };
  };
  CONSTRUIR['resorte-vertical'] = rng => {
    const g = 10, longitudNaturalCm = elegir(rng, [12, 16, 18, 24]), alargamientoCm = elegir(rng, [2.5, 10, 22.5, 40]), longitudEquilibrioCm = longitudNaturalCm + alargamientoCm;
    const delta = alargamientoCm / 100, k = elegir(rng, [20, 40, 60, 80, 100, 120]), m = red(k * delta / g), valor = periodo(m, k);
    if (m === 0.4 && alargamientoCm === 10) return null; // Calibración vertical del ejemplo resuelto.
    return { entradas: { m, longitudNaturalCm, longitudEquilibrioCm, g }, modelo: 'resorte-vertical', clave: 'T', valor, unidad: 's', modo: 'pi',
      enunciado: ['Un resorte mide ', q('L', longitudNaturalCm, 'cm'), ' sin carga. Con un bloque de ', q('m', m, 'kg'), ', su longitud en equilibrio es ', q('L', longitudEquilibrioCm, 'cm'), '.'], pregunta: ['¿Cuál es el período de sus oscilaciones verticales?'],
      datos: ['Resorte ideal de masa despreciable, sin rozamiento.', 'El bloque oscila alrededor del equilibrio con la misma masa.', 'Para este modelo ideal, g = 10 m/s².', cm],
      solucion: [['Medimos el alargamiento desde la longitud natural: alargamiento = (', q('L', longitudEquilibrioCm), ' − ', q('L', longitudNaturalCm), ') / 100 = ', q('L', delta, 'm'), '.'],
        ['El equilibrio iguala fuerza elástica y peso: ', s('k'), ' = ', s('m'), ' · ', s('g'), ' / alargamiento = ', q('m', m), ' · ', q('g', g), ' / ', q('L', delta), ' = ', q('k', k, 'N/m'), '.'],
        ['Usamos la rigidez obtenida: ', s('T'), ' = 2π · √(', q('m', m), ' / ', q('k', k), ') = ', qpi('T', valor, 's'), '.']],
      errores: [error('LONGITUD_TOTAL', 2 * Math.PI * Math.sqrt(longitudEquilibrioCm / 100 / g), 'tomaste la longitud total como alargamiento'), error('MEDIO_CICLO', valor / 2, 'contaste solo medio ciclo'), error('SIN_RAIZ', 2 * Math.PI * delta / g, 'omitiste extraer la raíz al calcular el período')] };
  };
  CONSTRUIR['resortes-conectados'] = rng => {
    const [rigidezPrimero, rigidezSegundo] = elegir(rng, [[20, 30], [20, 60], [30, 60], [40, 120], [60, 120], [24, 48]]), conexion = elegir(rng, ['serie', 'paralelo']);
    const serie = rigidezPrimero * rigidezSegundo / (rigidezPrimero + rigidezSegundo), paralelo = rigidezPrimero + rigidezSegundo, k = conexion === 'serie' ? serie : paralelo;
    const factor = elegir(rng, [0.1, 0.2, 0.3]), m = red(k * factor * factor); if (m > 8) return null;
    const valor = periodo(m, k);
    return { entradas: { m, rigidezPrimero, rigidezSegundo, conexion }, modelo: 'resortes-' + conexion, clave: 'T', valor, unidad: 's', modo: 'pi',
      enunciado: ['Un bloque de ', q('m', m, 'kg'), ' oscila horizontalmente con dos resortes conectados en ', conexion, ', de ', q('k', rigidezPrimero, 'N/m'), ' y ', q('k', rigidezSegundo, 'N/m'), '.'], pregunta: ['¿Cuál es el período del conjunto?'],
      datos: ['Resortes ideales de masa despreciable y mesa sin rozamiento.', conexion === 'serie' ? 'Una pared, dos resortes consecutivos y el bloque forman la conexión.' : 'Ambos resortes unen el mismo bloque con anclajes fijos y experimentan el mismo desplazamiento.'],
      solucion: [[conexion === 'serie' ? 'En serie se suman deformaciones bajo una misma fuerza.' : 'En paralelo se suman fuerzas con una misma deformación.'],
        conexion === 'serie' ? ['Despejamos la rigidez equivalente: rigidez equivalente = ', q('k', rigidezPrimero), ' · ', q('k', rigidezSegundo), ' / (', q('k', rigidezPrimero), ' + ', q('k', rigidezSegundo), ') = ', q('k', k, 'N/m'), '.'] :
          ['Sumamos las rigideces: rigidez equivalente = ', q('k', rigidezPrimero), ' + ', q('k', rigidezSegundo), ' = ', q('k', k, 'N/m'), '.'],
        ['Usamos la rigidez del conjunto: ', s('T'), ' = 2π · √(', q('m', m), ' / ', q('k', k), ') = ', qpi('T', valor, 's'), '.']],
      errores: [error('CONEXION_OPUESTA', periodo(m, conexion === 'serie' ? paralelo : serie), 'usaste la otra conexión'), error('SOLO_PRIMERO', periodo(m, rigidezPrimero), 'conservaste únicamente el primer resorte'), conexion === 'serie' ? error('DOS_CICLOS', 2 * valor, 'contaste dos ciclos completos') : error('MEDIO_CICLO', valor / 2, 'contaste solo medio ciclo')] };
  };

  CONSTRUIR['pendulo-periodo'] = rng => {
    const longitudCm = elegir(rng, [20, 30, 45, 55, 70, 85, 110, 125]), g = elegir(rng, [8, 10, 12]), anguloGrados = elegir(rng, [5, 6, 8, 10]);
    const L = longitudCm / 100, valor = 2 * Math.PI * Math.sqrt(L / g);
    return { entradas: { longitudCm, g, anguloGrados }, modelo: 'pendulo-pequeno', clave: 'T', valor, unidad: 's', aproximado: true,
      enunciado: ['Un péndulo tiene longitud ', q('L', longitudCm, 'cm'), '. Se usa ', s('g'), ' ≈ ', q('g', g, 'm/s²'), ' para el cálculo.'], pregunta: ['¿Cuál es su período aproximado?'], datos: [...pendulo(anguloGrados), cm],
      solucion: [['Pasamos la longitud a metros: ', s('L'), ' = ', q('L', longitudCm), ' / 100 = ', q('L', L, 'm'), '.'],
        ['Aplicamos el modelo de ángulo pequeño: ', s('T'), ' ≈ 2π · √(', s('L'), ' / ', s('g'), ') = 2π · √(', q('L', L), ' / ', q('g', g), ') ≈ ', q('T', valor, 's'), '.']],
      errores: [error('MEDIO_CICLO', valor / 2, 'contaste solo medio ciclo'), error('DOS_CICLOS', valor * 2, 'contaste dos ciclos completos'), error('SIN_RAIZ', 2 * Math.PI * L / g, 'omitiste extraer la raíz')] };
  };
  CONSTRUIR['pendulo-razon'] = rng => {
    const longitudPrimeraCm = elegir(rng, [25, 40, 60, 90, 100, 144]), longitudSegundaCm = elegir(rng, [25, 40, 60, 90, 100, 144]);
    const gravedadPrimera = elegir(rng, [8, 10, 12]), gravedadSegunda = elegir(rng, [8, 10, 12]), anguloGrados = elegir(rng, [5, 6, 8, 10]);
    if (gravedadPrimera === gravedadSegunda || longitudPrimeraCm === longitudSegundaCm) return null;
    const valor = Math.sqrt(longitudSegundaCm * gravedadPrimera / (longitudPrimeraCm * gravedadSegunda)); if (mismo(valor, 1)) return null;
    return { entradas: { longitudPrimeraCm, longitudSegundaCm, gravedadPrimera, gravedadSegunda, anguloGrados }, modelo: 'pendulo-pequeno', clave: 'T', valor, unidad: '', aproximado: true,
      enunciado: ['Un ensayo usa longitud ', q('L', longitudPrimeraCm, 'cm'), ' y gravedad de cálculo ', q('g', gravedadPrimera, 'm/s²'), '. Otro usa ', q('L', longitudSegundaCm, 'cm'), ' y ', q('g', gravedadSegunda, 'm/s²'), '.'],
      pregunta: ['¿Cuál es la razón de períodos segundo/primero?'], datos: [...pendulo(anguloGrados), 'Las gravedades indicadas son aproximaciones para el cálculo.'],
      solucion: [['Dividimos los períodos y cancelamos 2π. La gravedad queda en orden inverso al de las longitudes.'],
        ['Reemplazamos en la razón: período segundo / período primero ≈ √((', q('L', longitudSegundaCm), ' · ', q('g', gravedadPrimera), ') / (', q('L', longitudPrimeraCm), ' · ', q('g', gravedadSegunda), ')) ≈ ', q('T', valor), '.'],
        [valor > 1 ? 'Una razón mayor que uno indica que el segundo ciclo tarda más.' : 'Una razón menor que uno indica que el segundo ciclo tarda menos.']],
      errores: [error('INVIERTE', 1 / valor, 'invertiste el orden de los períodos'), error('SIN_RAIZ', valor * valor, 'omitiste extraer la raíz'), error('IGNORA_GRAVEDAD', Math.sqrt(longitudSegundaCm / longitudPrimeraCm), 'omitiste el cambio de gravedad')] };
  };
  CONSTRUIR['pendulo-longitud'] = rng => {
    const ciclos = elegir(rng, [8, 10, 12, 15, 20, 24]), T = elegir(rng, [0.8, 1.2, 1.6, 2, 2.4]), duracion = red(ciclos * T), g = elegir(rng, [8, 10, 12]), anguloGrados = elegir(rng, [5, 6, 8, 10]);
    const valor = g * (T / (2 * Math.PI)) ** 2;
    return { entradas: { ciclos, duracion, g, anguloGrados }, modelo: 'pendulo-pequeno', clave: 'L', valor, unidad: 'm', aproximado: true,
      enunciado: ['Un péndulo completa ', q('N', ciclos), ' ciclos en ', q('t', duracion, 's'), '. Se usa ', s('g'), ' ≈ ', q('g', g, 'm/s²'), '.'], pregunta: ['¿Cuál es su longitud aproximada?'], datos: pendulo(anguloGrados),
      solucion: [['Hallamos la duración de un ciclo: ', s('T'), ' = ', q('t', duracion), ' / ', q('N', ciclos), ' = ', q('T', T, 's'), '.'],
        ['Elevamos el período al cuadrado y despejamos: ', s('L'), ' ≈ ', s('g'), ' · (', s('T'), ' / (2π))².'],
        ['Reemplazamos período y gravedad: ', s('L'), ' ≈ ', q('g', g), ' · (', q('T', T), ' / (2π))² ≈ ', q('L', valor, 'm'), '.']],
      errores: [error('MEDIO_CICLO', valor / 4, 'usaste medio período antes de elevarlo al cuadrado'), error('SIN_CUADRADO', g * T / (4 * Math.PI ** 2), 'no elevaste el período al cuadrado'), error('SIN_DOS', valor * 4, 'omitiste el dos del factor 2π')] };
  };
  CONSTRUIR['energia-total'] = rng => {
    const k = elegir(rng, [40, 60, 80, 120, 140, 180, 200]), ACm = elegir(rng, [5, 8, 10, 12, 15, 20, 25]);
    if ((k === 80 && ACm === 15) || (k === 100 && ACm === 10)) return null;
    const A = ACm / 100, valor = energia(k, A);
    return { entradas: { k, ACm }, modelo: 'energia-horizontal', clave: 'EM', valor, unidad: 'J', datos: [...horizontal, 'Se suelta el bloque desde el reposo en un extremo.', cm],
      enunciado: ['Un bloque oscila con amplitud ', q('A', ACm, 'cm'), ' unido a un resorte de ', q('k', k, 'N/m'), '.'], pregunta: ['¿Cuál es la energía mecánica del sistema?'],
      solucion: [['Al soltarlo desde un extremo, toda la energía está almacenada en el resorte.'],
        ['Usamos la amplitud en metros: ', s('EM'), ' = ', s('k'), ' · ', s('A'), '² / 2 = ', q('k', k), ' · (', q('A', A), ')² / 2 = ', q('EM', valor, 'J'), '.']],
      errores: [error('SIN_MEDIO', 2 * valor, 'omitiste dividir entre dos'), error('MEDIO_DOS_VECES', valor / 2, 'dividiste dos veces entre dos'), error('SIN_CUADRADO', k * A / 2, 'no elevaste la amplitud al cuadrado')] };
  };
  CONSTRUIR['rapidez-posicion'] = (rng, semilla) => {
    const papel = semilla === 'papel-6';
    const m = papel ? 0.4 : elegir(rng, [0.2, 0.4, 0.5, 0.8]), k = papel ? 40 : elegir(rng, [40, 80, 120, 160, 200]), ACm = papel ? 5 : elegir(rng, [10, 15, 20, 25]), xCm = papel ? 3 : red(ACm * elegir(rng, [-0.8, -0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8]));
    const A = ACm / 100, x = xCm / 100, total = energia(k, A), elastica = energia(k, x), cinetica = total - elastica, valor = Math.sqrt(2 * cinetica / m);
    return { entradas: { m, k, ACm, xCm }, modelo: 'energia-horizontal', clave: 'v', valor, unidad: 'm/s', datos: [...horizontal, cm],
      enunciado: ['Un bloque de ', q('m', m, 'kg'), ' oscila con resorte de ', q('k', k, 'N/m'), ' y amplitud ', q('A', ACm, 'cm'), '.'], pregunta: ['¿Cuál es su rapidez al pasar por ', q('x', xCm, 'cm'), '?'],
      solucion: [['Calculamos la energía total con la amplitud en metros: ', s('EM'), ' = ', q('k', k), ' · (', q('A', A), ')² / 2 = ', q('EM', total, 'J'), '.'],
        ['Restamos la energía del resorte en esa posición: ', s('EC'), ' = ', s('EM'), ' − ', s('EPE'), ' = ', q('EM', total), ' − ', q('k', k), ' · (', q('x', x), ')² / 2 = ', q('EC', cinetica, 'J'), '.'],
        ['Despejamos la rapidez positiva: rapidez = √(2 · ', s('EC'), ' / ', s('m'), ') = √(2 · ', q('EC', cinetica), ' / ', q('m', m), ')', mostrar(valor, 'm/s').aproximado ? ' ≈ ' : ' = ', q('v', valor, 'm/s'), '.'],
        ['La energía permite hallar la rapidez; por sí sola no indica el sentido del movimiento.']],
      errores: [error('TOTAL', Math.sqrt(k / m) * A, 'usaste toda la energía mecánica como cinética'), error('ELASTICA', Math.sqrt(k / m) * Math.abs(x), 'usaste la energía del resorte como cinética'), error('SIN_DOS', valor / Math.SQRT2, 'omitiste el dos al despejar desde la energía cinética')] };
  };
  CONSTRUIR['amplitud-desde-estado'] = (rng, semilla) => {
    const papel = semilla === 'papel-8';
    const m = papel ? 0.4 : elegir(rng, [0.2, 0.4, 0.5, 0.8]), k = papel ? 40 : elegir(rng, [40, 80, 120, 160]), xCm = papel ? 5 : elegir(rng, [-12, -10, -8, -6, -4, 4, 6, 8, 10, 12]), velocidad = papel ? 1.2 : elegir(rng, [-1.6, -1.2, -1, -0.8, -0.6, 0.6, 0.8, 1, 1.2, 1.6]);
    const x = xCm / 100, cinetica = m * velocidad * velocidad / 2, elastica = energia(k, x), total = cinetica + elastica, valor = 100 * Math.sqrt(2 * total / k), soloCinetica = 100 * Math.sqrt(m / k) * Math.abs(velocidad);
    return { entradas: { m, k, xCm, v: velocidad }, modelo: 'energia-horizontal', clave: 'A', valor, unidad: 'cm', datos: [...horizontal, cm],
      enunciado: ['Un bloque de ', q('m', m, 'kg'), ' está unido a un resorte de ', q('k', k, 'N/m'), '. Pasa por ', q('x', xCm, 'cm'), ' con velocidad ', q('v', velocidad, 'm/s'), '.'], pregunta: ['¿Cuál es su amplitud?'],
      solucion: [['Calculamos ambas energías en el estado conocido: ', s('EC'), ' = ', q('m', m), ' · (', q('v', velocidad), ')² / 2 = ', q('EC', cinetica, 'J'), '; ', s('EPE'), ' = ', q('k', k), ' · (', q('x', x), ')² / 2 = ', q('EPE', elastica, 'J'), '.'],
        ['Sumamos la energía mecánica: ', s('EM'), ' = ', q('EC', cinetica), ' + ', q('EPE', elastica), ' = ', q('EM', total, 'J'), '.'],
        ['En un extremo, toda la energía es elástica. Despejamos: ', s('A'), ' = √(2 · ', s('EM'), ' / ', s('k'), ').'],
        ['Convertimos la amplitud a centímetros: ', s('A'), ' = 100 · √(2 · ', q('EM', total), ' / ', q('k', k), ')', mostrar(valor, 'cm').aproximado ? ' ≈ ' : ' = ', q('A', valor, 'cm'), '.']],
      errores: [error('SOLO_CINETICA', soloCinetica, 'omitiste la energía elástica del estado conocido'), error('POSICION', Math.abs(xCm), 'tomaste la distancia actual como amplitud'), error('SUMA_DISTANCIAS', Math.abs(xCm) + soloCinetica, 'sumaste la distancia actual y la amplitud calculada solo con energía cinética')] };
  };

  function cerrar(semilla, tipo, c, rng) {
    const compuesto = typeof c.valor === 'string', fmt = c.formato || (n => mostrar(n, c.unidad, c.modo, c.aproximado).texto);
    if (!compuesto && !Number.isFinite(c.valor)) return null;
    const textos = [fmt(c.valor)], valores = [c.valor], errores = [];
    for (const e of c.errores) {
      if ((!compuesto && !Number.isFinite(e.valor)) || valores.some(n => mismo(n, e.valor)) || textos.includes(fmt(e.valor))) return null;
      if (!compuesto && !P.enEscala(e.valor, c.valor)) return null;
      valores.push(e.valor); textos.push(fmt(e.valor));
      const id = `OSP-${tipo.toUpperCase()}-${e.operacion}`, t = fmt(e.valor);
      errores.push({ id, valor: e.valor, clave: compuesto ? e.valor : undefined, texto: t,
        explicacion: `Identificaste los datos; ${e.motivo}. Obtienes ${t}.`, respaldo: 'hipotesis', fuente: FUENTE });
    }
    if (errores.length !== 3) throw new Error('Cada familia debe definir tres errores pertinentes.');
    const alternativas = compuesto ? P.armarTexto({ correcta: { clave: c.valor, texto: fmt(c.valor) }, errores, rng, total: 4 }) : P.armar({ correcta: c.valor, errores, rng, total: 4, negativos: true, texto: fmt });
    if (alternativas.length !== 4) return null;
    const usadas = new Set();
    const visitar = x => { if (Array.isArray(x)) x.forEach(visitar); else if (x && typeof x === 'object' && x.v) usadas.add(x.v); };
    [c.enunciado, c.pregunta, c.solucion].forEach(visitar);
    return { id: `${ID}#${semilla}`, variables: Object.fromEntries([...usadas].map(k => [k, { ...VARIABLES[k] }])),
      enunciado: c.enunciado, pregunta: c.pregunta, datos: c.datos, alternativas, solucion: c.solucion,
      respuesta: { valor: c.valor, unidad: c.unidad },
      _datos: { idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo], ...c.entradas, modelo: c.modelo },
      _verificacion: { intermedios: c.intermedios || {}, errores: c.errores.map(e => ({ id: `OSP-${tipo.toUpperCase()}-${e.operacion}`, operacion: e.operacion, valor: e.valor })) } };
  }
  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    if (o.unidad && o.unidad !== UNIDAD) throw new Error('fis-oscilaciones: unidad ajena');
    if (o.idea && !TIPOS_POR_IDEA[o.idea]) throw new Error('fis-oscilaciones: idea desconocida');
    if (o.tipo && !TIPOS.includes(o.tipo)) throw new Error('fis-oscilaciones: tipo desconocido');
    if (o.tipo && o.idea && IDEA_DE[o.tipo] !== o.idea) throw new Error('fis-oscilaciones: tipo ajeno a la idea');
    const selector = Azar.crear(`${ID}|seleccion|${semilla}`);
    const tipo = o.tipo || (!o.idea && PAPEL[String(semilla)]) || elegir(selector, TIPOS_POR_IDEA[o.idea || elegir(selector, IDEAS)]);
    const rng = Azar.crear(`${ID}|${tipo}|${semilla}`);
    for (let intento = 0; intento < 300; intento++) {
      const c = CONSTRUIR[tipo](rng, String(semilla)), p = c && cerrar(semilla, tipo, c, rng);
      if (p) return p;
    }
    throw new Error(`fis-oscilaciones: no se obtuvieron cuatro opciones distintas para ${tipo}, semilla ${semilla}`);
  }
  return { id: ID, titulo: 'Movimiento armónico simple', generar, TIPOS_POR_IDEA, NIVEL, TIPOS };
});
