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
      solucion: [['La amplitud mide la mayor separación del equilibrio. Tomamos la distancia al extremo izquierdo, sin conservar el signo de su posición: ', s('A'), ' = |', q('x', izquierdoCm), '| = ', q('A', A, 'cm'), '.'], ['La amplitud indica cuánto se aparta el bloque del centro. Es positiva porque es una distancia; de un extremo al otro hay dos de esas distancias.']],
      errores: [error('ENTRE_EXTREMOS', derechoCm - izquierdoCm, 'Mediste de un extremo al otro. Ese tramo incluye ambos lados del equilibrio; la amplitud abarca solo desde el equilibrio hasta un extremo.'), error('POSICION_IZQUIERDA', izquierdoCm, 'Conservaste el signo de la posición izquierda. Ese signo señala el lado; para hallar la amplitud necesitas la distancia positiva hasta el equilibrio.'), error('RECORRIDO', 4 * A, 'Sumaste todo el recorrido de ida y vuelta. La amplitud no cuenta lo recorrido: mide la máxima distancia entre el bloque y el equilibrio.')] };
  };
  CONSTRUIR['conteo-periodo'] = rng => {
    const T = elegir(rng, [0.4, 0.6, 0.8, 1.2, 1.5, 2, 2.5, 3]), llegadas = elegir(rng, [4, 5, 6, 8, 9, 10]);
    const primerInstante = elegir(rng, [1, 2, 3, 4, 5]), D = red((llegadas - 1) * T), ultimoInstante = red(primerInstante + D), pide = elegir(rng, ['periodo', 'frecuencia']);
    const n = llegadas - 1, valor = pide === 'periodo' ? D / n : n / D, clave = pide === 'periodo' ? 'T' : 'f', unidad = pide === 'periodo' ? 's' : 'Hz';
    return { entradas: { primerInstante, ultimoInstante, llegadas, pide }, modelo: 'movimiento-periodico', clave, valor, unidad,
      enunciado: ['La primera llegada al extremo derecho ocurre a los ', q('t', primerInstante, 's'), '; la llegada número ', q('N', llegadas), ', a los ', q('t', ultimoInstante, 's'), '.'],
      pregunta: [pide === 'periodo' ? '¿Cuál es el período?' : '¿Cuál es la frecuencia?'], datos: ['Las llegadas al mismo extremo son consecutivas y el movimiento mantiene su período.'],
      solucion: [['La primera llegada inicia la cuenta y cada llegada posterior completa un ciclo. Por eso contamos los intervalos: ', s('N'), ' = ', q('N', llegadas), ' − 1 = ', q('N', n), '.'], ['El reloj ya marcaba un tiempo en la primera llegada. Lo restamos para medir solo lo transcurrido entre las llegadas: duración = ', q('t', ultimoInstante), ' − ', q('t', primerInstante), ' = ', q('t', D, 's'), '.'],
        [pide === 'periodo' ? 'Dividimos la duración entre los ciclos porque el período mide cuánto tarda cada oscilación completa: ' : 'Dividimos los ciclos entre la duración porque la frecuencia indica cuántas oscilaciones completas ocurren por segundo: ', s(clave), ' = ', ...(pide === 'periodo' ? [q('t', D), ' / ', q('N', n)] : [q('N', n), ' / ', q('t', D)]), mostrar(valor, unidad).aproximado ? ' ≈ ' : ' = ', q(clave, valor, unidad), '.']],
      errores: [error('CUENTA_LLEGADAS', pide === 'periodo' ? D / llegadas : llegadas / D, 'Contaste las llegadas como ciclos. La primera llegada solo inicia la medición; cuenta los intervalos entre llegadas consecutivas al mismo extremo.'), error('NO_RESTA_INICIO', pide === 'periodo' ? ultimoInstante / n : n / ultimoInstante, 'Usaste la lectura final como duración. El reloj no empezó en cero durante esta medición; resta el instante de la primera llegada.'), error('INVIERTE', pide === 'periodo' ? n / D : D / n, 'Invertiste el cociente. El período pide tiempo por ciclo; la frecuencia pide ciclos por segundo. Revisa cuál de esas dos magnitudes pregunta el problema.')] };
  };
  CONSTRUIR['recorrido-mixto'] = rng => {
    const ACm = elegir(rng, [5, 8, 10, 12, 15, 18, 20]), T = elegir(rng, [2, 4, 6, 8]), completos = elegir(rng, [2, 3, 4, 5, 6]), t = T * (completos + 0.5), inicio = elegir(rng, ['derecha', 'izquierda']);
    const valor = (4 * ACm * completos + 2 * ACm) / 100;
    return { entradas: { ACm, T, t, inicio }, modelo: 'mas-desde-extremo', clave: 'd', valor, unidad: 'm', datos: [...horizontal, cm],
      enunciado: ['Un bloque parte del extremo ', inicio === 'derecha' ? 'derecho' : 'izquierdo', ', con amplitud ', q('A', ACm, 'cm'), ' y período ', q('T', T, 's'), '.'], pregunta: ['¿Cuántos metros recorre en ', q('t', t, 's'), '?'],
      solucion: [['Separamos el tiempo en ciclos completos y el tramo final, porque el recorrido se suma aunque el bloque cambie de sentido: ', q('t', t, 's'), ' = ', q('N', completos), ' · ', q('T', T, 's'), ' + ', q('t', T / 2, 's'), '.'], ['En cada ciclo, el bloque va al extremo opuesto y regresa: recorre cuatro amplitudes. El medio ciclo final llega solo al otro extremo y recorre dos.'],
        ['Sumamos todas las distancias recorridas. Dividimos entre cien porque la amplitud está en centímetros y se pide el resultado en metros: ', s('d'), ' = (4 · ', q('A', ACm), ' · ', q('N', completos), ' + 2 · ', q('A', ACm), ') / 100 = ', q('d', valor, 'm'), '.']],
      errores: [error('OMITE_MEDIO', 4 * ACm * completos / 100, 'Contaste solo las oscilaciones completas. El reloj también incluye medio ciclo más; añade la distancia desde el extremo inicial hasta el opuesto.'), error('MEDIO_EXTRA', (4 * ACm * completos + 4 * ACm) / 100, 'Completaste la última oscilación aunque solo transcurrió la mitad. Revisa el tiempo restante: el bloque llega al extremo opuesto, pero todavía no regresa.'), error('DESPLAZAMIENTO', (inicio === 'derecha' ? -2 : 2) * ACm / 100, 'Restaste posición final e inicial. Eso da el desplazamiento; la distancia recorrida debe sumar todos los trayectos de ida y vuelta sin cancelarlos.')] };
  };
  CONSTRUIR['fuerza-posicion'] = rng => {
    const k = elegir(rng, [20, 30, 40, 50, 70, 80]), xCm = elegir(rng, [-12, -10, -8, -6, -4, 3, 5, 7, 9, 11]), x = xCm / 100, valor = -k * x;
    return { entradas: { k, xCm }, modelo: 'resorte-horizontal', clave: 'F', valor, unidad: 'N', datos: [...horizontal, 'La mano ya se retiró; la fuerza horizontal es la del resorte.', cm],
      enunciado: ['Un resorte de rigidez ', q('k', k, 'N/m'), ' tiene al bloque en ', s('x'), ' = ', q('x', xCm, 'cm'), '.'], pregunta: ['¿Qué fuerza horizontal ejerce sobre el bloque?'],
      solucion: [['La rigidez está expresada por metro. Convertimos la posición a metros para que el producto dé una fuerza en newtons: ', s('x'), ' = ', q('x', xCm), ' / 100 = ', q('x', x, 'm'), '.'], ['El resorte empuja hacia el equilibrio. El signo menos invierte el signo de la posición y la rigidez determina cuánto aumenta la fuerza: ', s('F'), ' = −', s('k'), ' · ', s('x'), ' = −', q('k', k), ' · (', q('x', x), ') = ', q('F', valor, 'N'), '.'], ['La fuerza apunta al equilibrio: hacia la izquierda si el bloque está a la derecha, y hacia la derecha si está a la izquierda.']],
      errores: [error('SIGNO', -valor, 'Hiciste que la fuerza apuntara hacia el lado ocupado por el bloque. El resorte lo empuja hacia el equilibrio; revisa el signo contrario al de la posición.'), error('DOBLE_FUERZA', 2 * valor, 'Sumaste dos veces la misma fuerza. Solo hay un resorte actuando horizontalmente sobre el bloque; usa una vez su rigidez y la posición dada.'), error('PROMEDIO', valor / 2, 'Promediaste esta fuerza con la fuerza nula del equilibrio. Se pide la fuerza en la posición indicada, así que evalúala allí, sin promediar posiciones.')] };
  };
  CONSTRUIR['aceleracion-masa'] = rng => {
    const m = elegir(rng, [0.25, 0.4, 0.5, 0.75, 1.5, 2.5]), k = elegir(rng, [20, 30, 40, 50, 80]), xCm = elegir(rng, [-9, -7, -5, -3, 4, 6, 8, 10]);
    if (m === 0.4 && k === 30 && xCm === 8) return null; // Ejemplo resuelto de la teoría.
    const F = -k * xCm / 100, valor = F / m;
    return { entradas: { m, k, xCm }, modelo: 'resorte-horizontal', clave: 'a', valor, unidad: 'm/s²', datos: [...horizontal, 'La mano ya se retiró; no hay otra fuerza horizontal.', cm],
      enunciado: ['Un bloque de ', q('m', m, 'kg'), ' está unido a un resorte de rigidez ', q('k', k, 'N/m'), '. Su posición es ', q('x', xCm, 'cm'), '.'], pregunta: ['¿Cuál es su aceleración con signo?'],
      solucion: [['Primero hallamos la fuerza que cambia la velocidad. Usamos metros porque la rigidez está en newtons por metro, y el signo menos orienta la fuerza hacia el equilibrio: ', s('F'), ' = −', q('k', k), ' · (', q('x', xCm / 100), ') = ', q('F', F, 'N'), '.'], ['La segunda ley relaciona fuerza y aceleración. Dividimos entre la masa para obtener cuánto cambia la velocidad por segundo, con el mismo signo que la fuerza: ', s('a'), ' = ', s('F'), ' / ', s('m'), ' = (', q('F', F), ') / ', q('m', m), mostrar(valor, 'm/s²').aproximado ? ' ≈ ' : ' = ', q('a', valor, 'm/s²'), '.']],
      errores: [error('SIGNO', -valor, 'Orientaste la aceleración hacia afuera. La fuerza del resorte apunta al equilibrio y la aceleración tiene ese mismo sentido; revisa el signo de la posición.'), error('SIN_MASA', F, 'Tomaste el valor de la fuerza como aceleración. Una misma fuerza produce distinta aceleración según la masa; divide la fuerza neta entre la masa del bloque.'), error('MASA_DOS_VECES', valor / m, 'Dividiste entre la masa una vez de más. La fuerza se convierte en aceleración al dividir una sola vez; vuelve a la segunda ley.')] };
  };
  CONSTRUIR['masa-dos-estados'] = rng => {
    const k = elegir(rng, [20, 30, 40, 60]), masa = elegir(rng, [0.25, 0.4, 0.5, 0.8]);
    const xPrimeroCm = elegir(rng, [-6, -5, -4, 3, 4, 5, 6]), xSegundoCm = -xPrimeroCm * elegir(rng, [2, 3]);
    const fuerzaPrimera = red(-k * xPrimeroCm / 100), aceleracionSegunda = red(-k * xSegundoCm / (100 * masa)), F2 = -k * xSegundoCm / 100, valor = F2 / aceleracionSegunda;
    return { entradas: { xPrimeroCm, fuerzaPrimera, xSegundoCm, aceleracionSegunda }, modelo: 'mismo-resorte-misma-masa', clave: 'm', valor, unidad: 'kg', datos: [...horizontal, 'El bloque y el resorte son los mismos en ambos estados.', cm],
      enunciado: ['En el primer estado, el resorte ejerce ', q('F', fuerzaPrimera, 'N'), ' en ', q('x', xPrimeroCm, 'cm'), '. En el segundo, el bloque acelera a ', q('a', aceleracionSegunda, 'm/s²'), ' en ', q('x', xSegundoCm, 'cm'), '.'], pregunta: ['¿Cuál es la masa del bloque?'],
      solucion: [['El primer estado da fuerza y posición; eso permite conocer la rigidez del mismo resorte. Despejamos usando la posición en metros: ', s('k'), ' = −', s('F'), ' / ', s('x'), ' = −(', q('F', fuerzaPrimera), ') / (', q('x', xPrimeroCm / 100), ') = ', q('k', k, 'N/m'), '.'],
        ['La rigidez se mantiene, pero la fuerza cambia al cambiar de posición. Por eso calculamos la fuerza que corresponde al segundo estado: ', s('F'), ' = −', q('k', k), ' · (', q('x', xSegundoCm / 100), ') = ', q('F', F2, 'N'), '.'],
        ['La aceleración dada corresponde al segundo estado. Dividimos su fuerza entre esa aceleración para hallar la masa que relaciona ambas magnitudes: ', s('m'), ' = ', s('F'), ' / ', s('a'), ' = (', q('F', F2), ') / (', q('a', aceleracionSegunda), ') = ', q('m', valor, 'kg'), '.']],
      errores: [error('INVIERTE_MASA', 1 / valor, 'Invertiste el despeje de la segunda ley. Para obtener la masa, divide la fuerza entre la aceleración del mismo estado, no al revés.'), error('MANTIENE_FUERZA', fuerzaPrimera / aceleracionSegunda, 'Usaste la primera fuerza con la segunda aceleración. La posición cambió y la fuerza también; calcula la fuerza correspondiente al segundo estado.'), error('POSICIONES_INVERTIDAS', fuerzaPrimera * xPrimeroCm / (xSegundoCm * aceleracionSegunda), 'Invertiste la razón entre posiciones. La fuerza cambia proporcionalmente al desplazamiento; compara la posición nueva con la primera, conservando los signos.')] };
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
      solucion: [['Dividimos el tiempo entre un cuarto de período para contar los tramos del movimiento desde el estado inicial: cuartos = ', q('t', t), ' / (', q('T', T), ' / 4) = ', q('N', cuartos), '.'],
        ['Desde un extremo, los cuartos sucesivos llevan al centro, al extremo opuesto, otra vez al centro y al inicio. Los dos cruces centrales se distinguen por el sentido.'], ['Seguimos esa secuencia desde el extremo indicado, sin contar la partida como un tramo transcurrido. En el instante pedido corresponde ', actual.texto, '.']],
      errores: [error('CUENTA_INICIO', estados[1].clave, 'Contaste la partida como un cuarto transcurrido y avanzaste un tramo menos. El estado inicial marca el comienzo; cuenta solo los intervalos posteriores.'), error('EXTREMO_OPUESTO', estados[2].clave, 'Usaste la secuencia del extremo contrario. El mismo tiempo lleva a otro estado si cambia la partida; empieza en el extremo indicado y sigue el sentido.'), error('CUARTO_EXTRA', estados[3].clave, 'Avanzaste un cuarto más de lo indicado por el reloj. Divide el tiempo entre un cuarto de período y cuenta desde la partida, sin añadir otro tramo.')] };
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
      solucion: [['La frecuencia angular indica cuánto avanza la fase por segundo. Como un ciclo completo abarca una vuelta, dividimos esa vuelta entre su duración: ', s('omega'), ' = 2π / ', s('T'), ' = 2π / ', q('T', T), ' = ', qpi('omega', omega, 'rad/s'), '.'],
        ['La fase ubica al bloque dentro del ciclo. A la fase de partida añadimos el avance acumulado durante el tiempo indicado: fase = ', qpi('omega', omega), ' · ', q('t', t), ' + ', qpi('phi', fasePiNumerador * Math.PI / 6), ' = ', qpi('phi', faseTotal, 'rad'), '.'],
        ['Con la amplitud en metros, usamos el seno de la fase porque la velocidad es nula en los extremos y máxima en magnitud al cruzar el centro: ', s('v'), ' = −', q('A', A), ' · (', qpi('omega', omega), ') · (', v('phi', senTexto[indice]), ')', mostrar(valor, 'm/s').aproximado ? ' ≈ ' : ' = ', q('v', valor, 'm/s'), '.'],
        [valor < 0 ? 'El signo negativo indica movimiento hacia la izquierda. La magnitud expresa la rapidez; el signo añade hacia qué lado se mueve el bloque en ese instante.' : 'El signo positivo indica movimiento hacia la derecha. La magnitud expresa la rapidez; el signo añade hacia qué lado se mueve el bloque en ese instante.']],
      errores: [error('SIGNO', -valor, 'Omitiste el signo menos y cambiaste el sentido del movimiento. Para esta expresión con posición en coseno, la velocidad lleva el seno con signo contrario.'), error('SIN_OMEGA', -A * seno, 'Usaste amplitud y seno sin la frecuencia angular. Falta considerar qué tan rápido avanza el ciclo; multiplica también por el avance de fase por segundo.'), error('COSENO', -A * omega * coseno, 'Usaste el coseno que describe la posición. La velocidad alcanza sus máximos en otros instantes; usa el seno de la fase con el signo correspondiente.')] };
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
      solucion: [['Dividimos la posición entre la amplitud para saber qué coseno corresponde. Ese valor identifica posiciones del ciclo, pero todavía no el sentido: cos(fase) = ', q('x', xCm), ' / ', q('A', ACm), ' = ', q('phi', xCm / ACm), '.'],
        ['El bloque pasa por esa posición en ambos sentidos. Elegimos la primera fase posterior a la partida que también tenga el sentido pedido: fase inicial = ', qpi('phi', e.inicial, 'rad'), '; fase final = ', qpi('phi', e.meta, 'rad'), '.'],
        ['Restamos la fase de partida porque buscamos cuánto avanzó el ciclo, no la fase final por sí sola: avance = ', qpi('phi', e.meta), ' − ', qpi('phi', e.inicial), ' = ', qpi('phi', e.avance, 'rad'), '.'],
        ['La frecuencia angular mide el avance de fase por segundo. Dividimos el avance entre ella para obtener el tiempo hasta esa primera llegada: ', s('t'), ' = (', qpi('phi', e.avance), ') / (2π / ', q('T', T), ') = ', q('t', valor, 's'), '.']],
      errores: [error('OTRO_EXTREMO', red(primerPaso(ACm, T, xCm, sentido, inicio === 'derecha' ? 'izquierda' : 'derecha').tiempo), 'Cambiaste el extremo de partida. Eso cambia la fase inicial y el tiempo de llegada; conserva el extremo indicado al buscar la primera fase posterior.'), error('FRECUENCIA_DOBLE', valor / 2, 'Usaste un avance de fase de dos vueltas por período. Un ciclo corresponde a una vuelta; revisa la frecuencia angular antes de convertir fase en tiempo.'), error('VUELTA_EXTRA', valor + T, 'Añadiste un ciclo completo y elegiste la llegada siguiente. Se pide el primer instante positivo con esa posición y ese sentido; conserva la primera coincidencia.')] };
  };
  CONSTRUIR['resorte-periodo'] = rng => {
    const k = elegir(rng, [12, 16, 24, 32, 48, 64, 72, 96]), cocienteRaiz = elegir(rng, [0.1, 0.15, 0.2, 0.25, 0.3, 0.4]), m = red(k * cocienteRaiz * cocienteRaiz), valor = periodo(m, k);
    return { entradas: { m, k }, modelo: 'resorte-horizontal', clave: 'T', valor, unidad: 's', modo: 'pi', datos: horizontal,
      enunciado: ['Un bloque de ', q('m', m, 'kg'), ' oscila unido a un resorte de rigidez ', q('k', k, 'N/m'), '.'], pregunta: ['¿Cuál es el período de una oscilación completa?'],
      solucion: [['El período es el tiempo de una oscilación completa. La masa dificulta cambiar la velocidad y la rigidez intensifica la fuerza restauradora; ambas determinan ese tiempo: ', s('T'), ' = 2π · √(', s('m'), ' / ', s('k'), ').'], ['Sustituimos la masa y la rigidez en las unidades indicadas. El resultado mide el tiempo de ida y regreso al mismo estado: ', s('T'), ' = 2π · √(', q('m', m), ' / ', q('k', k), ') = ', qpi('T', valor, 's'), '.']],
      errores: [error('SIN_2PI', Math.sqrt(m / k), 'Dejaste solo la raíz del cociente. Ese valor no cubre un ciclo completo; incluye el factor que corresponde a una vuelta de la fase.'), error('SIN_RAIZ', 2 * Math.PI * m / k, 'Usaste directamente el cociente entre masa y rigidez. El período depende de su raíz cuadrada; aplícala antes de multiplicar por el factor de un ciclo.'), error('DOS_CICLOS', 2 * valor, 'Sumaste dos oscilaciones completas. El período corresponde a una sola ida y regreso al mismo estado; detén la cuenta al completar ese ciclo.')] };
  };
  CONSTRUIR['resorte-vertical'] = rng => {
    const g = 10, longitudNaturalCm = elegir(rng, [12, 16, 18, 24]), alargamientoCm = elegir(rng, [2.5, 10, 22.5, 40]), longitudEquilibrioCm = longitudNaturalCm + alargamientoCm;
    const delta = alargamientoCm / 100, k = elegir(rng, [20, 40, 60, 80, 100, 120]), m = red(k * delta / g), valor = periodo(m, k);
    if (m === 0.4 && alargamientoCm === 10) return null; // Calibración vertical del ejemplo resuelto.
    return { entradas: { m, longitudNaturalCm, longitudEquilibrioCm, g }, modelo: 'resorte-vertical', clave: 'T', valor, unidad: 's', modo: 'pi',
      enunciado: ['Un resorte mide ', q('L', longitudNaturalCm, 'cm'), ' sin carga. Con un bloque de ', q('m', m, 'kg'), ', su longitud en equilibrio es ', q('L', longitudEquilibrioCm, 'cm'), '.'], pregunta: ['¿Cuál es el período de sus oscilaciones verticales?'],
      datos: ['Resorte ideal de masa despreciable, sin rozamiento.', 'El bloque oscila alrededor del equilibrio con la misma masa.', 'Para este modelo ideal, g = 10 m/s².', cm],
      solucion: [['El alargamiento mide cuánto se estiró el resorte, no su longitud total. Restamos la longitud sin carga y convertimos a metros: alargamiento = (', q('L', longitudEquilibrioCm), ' − ', q('L', longitudNaturalCm), ') / 100 = ', q('L', delta, 'm'), '.'],
        ['En equilibrio, la fuerza del resorte compensa el peso. Esa igualdad permite hallar la rigidez a partir de la masa y el alargamiento: ', s('k'), ' = ', s('m'), ' · ', s('g'), ' / alargamiento = ', q('m', m), ' · ', q('g', g), ' / ', q('L', delta), ' = ', q('k', k, 'N/m'), '.'],
        ['Al oscilar alrededor del equilibrio, el peso ya está compensado allí. La misma rigidez determina la fuerza que devuelve al bloque; con ella hallamos el período: ', s('T'), ' = 2π · √(', q('m', m), ' / ', q('k', k), ') = ', qpi('T', valor, 's'), '.']],
      errores: [error('LONGITUD_TOTAL', 2 * Math.PI * Math.sqrt(longitudEquilibrioCm / 100 / g), 'Trataste la longitud cargada como si todo fuera estiramiento. El resorte ya tenía una longitud natural; réstala antes de calcular la rigidez.'), error('MEDIO_CICLO', valor / 2, 'Mediste solo el viaje de un extremo al otro. El período también incluye el regreso al extremo inicial; cuenta una oscilación completa.'), error('SIN_RAIZ', 2 * Math.PI * delta / g, 'Usaste el cociente entre alargamiento y gravedad sin su raíz. Tras hallar la rigidez, aplica la raíz cuadrada que aparece en el período del resorte.')] };
  };
  CONSTRUIR['resortes-conectados'] = rng => {
    const [rigidezPrimero, rigidezSegundo] = elegir(rng, [[20, 30], [20, 60], [30, 60], [40, 120], [60, 120], [24, 48]]), conexion = elegir(rng, ['serie', 'paralelo']);
    const serie = rigidezPrimero * rigidezSegundo / (rigidezPrimero + rigidezSegundo), paralelo = rigidezPrimero + rigidezSegundo, k = conexion === 'serie' ? serie : paralelo;
    const factor = elegir(rng, [0.1, 0.2, 0.3]), m = red(k * factor * factor); if (m > 8) return null;
    const valor = periodo(m, k);
    return { entradas: { m, rigidezPrimero, rigidezSegundo, conexion }, modelo: 'resortes-' + conexion, clave: 'T', valor, unidad: 's', modo: 'pi',
      enunciado: ['Un bloque de ', q('m', m, 'kg'), ' oscila horizontalmente con dos resortes conectados en ', conexion, ', de ', q('k', rigidezPrimero, 'N/m'), ' y ', q('k', rigidezSegundo, 'N/m'), '.'], pregunta: ['¿Cuál es el período del conjunto?'],
      datos: ['Resortes ideales de masa despreciable y mesa sin rozamiento.', conexion === 'serie' ? 'Una pared, dos resortes consecutivos y el bloque forman la conexión.' : 'Ambos resortes unen el mismo bloque con anclajes fijos y experimentan el mismo desplazamiento.'],
      solucion: [[conexion === 'serie' ? 'En serie, ambos resortes transmiten la misma fuerza y sus estiramientos se suman. La rigidez equivalente representa un solo resorte que produciría esa deformación total.' : 'En paralelo, ambos resortes se deforman lo mismo y sus fuerzas se suman. La rigidez equivalente representa un solo resorte que ejercería esa fuerza total.'],
        conexion === 'serie' ? ['Para la conexión en serie, combinamos las rigideces a partir de la suma de deformaciones. Así obtenemos la rigidez que debe usarse para todo el conjunto: rigidez equivalente = ', q('k', rigidezPrimero), ' · ', q('k', rigidezSegundo), ' / (', q('k', rigidezPrimero), ' + ', q('k', rigidezSegundo), ') = ', q('k', k, 'N/m'), '.'] :
          ['Como ambos resortes en paralelo responden al mismo desplazamiento, sumamos sus aportes a la fuerza. Por eso sus rigideces se suman: rigidez equivalente = ', q('k', rigidezPrimero), ' + ', q('k', rigidezSegundo), ' = ', q('k', k, 'N/m'), '.'],
        ['El bloque oscila bajo la acción de los dos resortes. Usamos su rigidez equivalente, junto con la masa del bloque, para hallar el tiempo de un ciclo: ', s('T'), ' = 2π · √(', q('m', m), ' / ', q('k', k), ') = ', qpi('T', valor, 's'), '.']],
      errores: [error('CONEXION_OPUESTA', periodo(m, conexion === 'serie' ? paralelo : serie), 'Aplicaste la regla de la otra conexión. Revisa el montaje: en serie se suman deformaciones con igual fuerza; en paralelo se suman fuerzas con igual deformación.'), error('SOLO_PRIMERO', periodo(m, rigidezPrimero), 'Calculaste el período como si actuara solo el primer resorte. Ambos participan en el montaje; combina sus rigideces según la conexión indicada.'), conexion === 'serie' ? error('DOS_CICLOS', 2 * valor, 'Contaste dos ciclos porque hay dos resortes. El período mide una oscilación del bloque, no una por resorte; usa la rigidez del conjunto.') : error('MEDIO_CICLO', valor / 2, 'Tomaste solo el trayecto de un extremo al otro. Aunque actúen dos resortes, el período exige que el bloque regrese al estado inicial.')] };
  };

  CONSTRUIR['pendulo-periodo'] = rng => {
    const longitudCm = elegir(rng, [20, 30, 45, 55, 70, 85, 110, 125]), g = elegir(rng, [8, 10, 12]), anguloGrados = elegir(rng, [5, 6, 8, 10]);
    const L = longitudCm / 100, valor = 2 * Math.PI * Math.sqrt(L / g);
    return { entradas: { longitudCm, g, anguloGrados }, modelo: 'pendulo-pequeno', clave: 'T', valor, unidad: 's', aproximado: true,
      enunciado: ['Un péndulo tiene longitud ', q('L', longitudCm, 'cm'), '. Se usa ', s('g'), ' ≈ ', q('g', g, 'm/s²'), ' para el cálculo.'], pregunta: ['¿Cuál es su período aproximado?'], datos: [...pendulo(anguloGrados), cm],
      solucion: [['Usamos metros para que la longitud y la gravedad tengan unidades compatibles. La longitud se mide desde el apoyo hasta el centro de la pesa: ', s('L'), ' = ', q('L', longitudCm), ' / 100 = ', q('L', L, 'm'), '.'],
        ['Con poca inclinación, la componente del peso que devuelve la pesa permite aproximar el movimiento como armónico. Así estimamos el tiempo de una oscilación: ', s('T'), ' ≈ 2π · √(', s('L'), ' / ', s('g'), ') = 2π · √(', q('L', L), ' / ', q('g', g), ') ≈ ', q('T', valor, 's'), '.']],
      errores: [error('MEDIO_CICLO', valor / 2, 'Contaste únicamente el viaje de un lado al otro. El período incluye también el regreso; sigue la pesa hasta repetir el estado de partida.'), error('DOS_CICLOS', valor * 2, 'Esperaste dos regresos completos al estado inicial. El período mide solo una oscilación; considera el tiempo hasta el primer regreso al mismo estado.'), error('SIN_RAIZ', 2 * Math.PI * L / g, 'Usaste la razón entre longitud y gravedad directamente. El modelo de péndulo pequeño relaciona el período con la raíz de esa razón; aplícala.')] };
  };
  CONSTRUIR['pendulo-razon'] = rng => {
    const longitudPrimeraCm = elegir(rng, [25, 40, 60, 90, 100, 144]), longitudSegundaCm = elegir(rng, [25, 40, 60, 90, 100, 144]);
    const gravedadPrimera = elegir(rng, [8, 10, 12]), gravedadSegunda = elegir(rng, [8, 10, 12]), anguloGrados = elegir(rng, [5, 6, 8, 10]);
    if (gravedadPrimera === gravedadSegunda || longitudPrimeraCm === longitudSegundaCm) return null;
    const valor = Math.sqrt(longitudSegundaCm * gravedadPrimera / (longitudPrimeraCm * gravedadSegunda)); if (mismo(valor, 1)) return null;
    return { entradas: { longitudPrimeraCm, longitudSegundaCm, gravedadPrimera, gravedadSegunda, anguloGrados }, modelo: 'pendulo-pequeno', clave: 'T', valor, unidad: '', aproximado: true,
      enunciado: ['Un ensayo usa longitud ', q('L', longitudPrimeraCm, 'cm'), ' y gravedad de cálculo ', q('g', gravedadPrimera, 'm/s²'), '. Otro usa ', q('L', longitudSegundaCm, 'cm'), ' y ', q('g', gravedadSegunda, 'm/s²'), '.'],
      pregunta: ['¿Cuál es la razón de períodos segundo/primero?'], datos: [...pendulo(anguloGrados), 'Las gravedades indicadas son aproximaciones para el cálculo.'],
      solucion: [['Dividimos el período segundo entre el primero para comparar cuánto tarda cada ciclo. El factor común 2π se cancela; como la gravedad divide dentro de cada raíz, aparece en orden inverso.'],
        ['Reemplazamos ambas longitudes y gravedades en el orden pedido. El resultado no tiene unidad porque compara dos tiempos: período segundo / período primero ≈ √((', q('L', longitudSegundaCm), ' · ', q('g', gravedadPrimera), ') / (', q('L', longitudPrimeraCm), ' · ', q('g', gravedadSegunda), ')) ≈ ', q('T', valor), '.'],
        [valor > 1 ? 'Una razón mayor que uno indica que el segundo ciclo tarda más. La comparación incluye tanto el cambio de longitud como el de gravedad.' : 'Una razón menor que uno indica que el segundo ciclo tarda menos. La comparación incluye tanto el cambio de longitud como el de gravedad.']],
      errores: [error('INVIERTE', 1 / valor, 'Dividiste el período primero entre el segundo. Se pide el orden contrario; coloca el segundo ensayo en el numerador antes de sustituir longitud y gravedad.'), error('SIN_RAIZ', valor * valor, 'Comparaste las razones de longitud y gravedad sin extraer la raíz. Los períodos dependen de esa raíz; aplícala al cociente completo.'), error('IGNORA_GRAVEDAD', Math.sqrt(longitudSegundaCm / longitudPrimeraCm), 'Comparaste solo las longitudes, como si la gravedad fuera igual. Aquí también cambia; incluye ambas gravedades en el cociente que determina los períodos.')] };
  };
  CONSTRUIR['pendulo-longitud'] = rng => {
    const ciclos = elegir(rng, [8, 10, 12, 15, 20, 24]), T = elegir(rng, [0.8, 1.2, 1.6, 2, 2.4]), duracion = red(ciclos * T), g = elegir(rng, [8, 10, 12]), anguloGrados = elegir(rng, [5, 6, 8, 10]);
    const valor = g * (T / (2 * Math.PI)) ** 2;
    return { entradas: { ciclos, duracion, g, anguloGrados }, modelo: 'pendulo-pequeno', clave: 'L', valor, unidad: 'm', aproximado: true,
      enunciado: ['Un péndulo completa ', q('N', ciclos), ' ciclos en ', q('t', duracion, 's'), '. Se usa ', s('g'), ' ≈ ', q('g', g, 'm/s²'), '.'], pregunta: ['¿Cuál es su longitud aproximada?'], datos: pendulo(anguloGrados),
      solucion: [['La medición reúne varias oscilaciones. Dividimos la duración total entre los ciclos para obtener el período, que es el tiempo de una sola oscilación: ', s('T'), ' = ', q('t', duracion), ' / ', q('N', ciclos), ' = ', q('T', T, 's'), '.'],
        ['La longitud está dentro de una raíz en la fórmula del período. Aislamos esa raíz, elevamos al cuadrado y despejamos la longitud: ', s('L'), ' ≈ ', s('g'), ' · (', s('T'), ' / (2π))².'],
        ['Sustituimos el período de un ciclo y la gravedad. La longitud estimada corresponde a la distancia del apoyo al centro de la pesa: ', s('L'), ' ≈ ', q('g', g), ' · (', q('T', T), ' / (2π))² ≈ ', q('L', valor, 'm'), '.']],
      errores: [error('MEDIO_CICLO', valor / 4, 'Usaste medio período como duración de un ciclo. Como el despeje contiene el período al cuadrado, ese error se amplifica; primero identifica una oscilación completa.'), error('SIN_CUADRADO', g * T / (4 * Math.PI ** 2), 'Dejaste el período sin elevar al cuadrado. Para eliminar la raíz de la fórmula original debes elevar todo el cociente, incluido el período.'), error('SIN_DOS', valor * 4, 'Omitiste parte del factor de una vuelta al despejar. Conserva el factor completo antes de elevar el cociente al cuadrado; representa un ciclo entero.')] };
  };
  CONSTRUIR['energia-total'] = rng => {
    const k = elegir(rng, [40, 60, 80, 120, 140, 180, 200]), ACm = elegir(rng, [5, 8, 10, 12, 15, 20, 25]);
    if ((k === 80 && ACm === 15) || (k === 100 && ACm === 10)) return null;
    const A = ACm / 100, valor = energia(k, A);
    return { entradas: { k, ACm }, modelo: 'energia-horizontal', clave: 'EM', valor, unidad: 'J', datos: [...horizontal, 'Se suelta el bloque desde el reposo en un extremo.', cm],
      enunciado: ['Un bloque oscila con amplitud ', q('A', ACm, 'cm'), ' unido a un resorte de rigidez ', q('k', k, 'N/m'), '.'], pregunta: ['¿Cuál es la energía mecánica del sistema?'],
      solucion: [['Al soltarlo desde un extremo, el bloque está momentáneamente quieto: no tiene energía cinética. Toda la energía mecánica está almacenada en la deformación del resorte y se conserva sin rozamiento.'],
        ['En el extremo, la deformación coincide con la amplitud. Usamos su cuadrado para calcular la energía almacenada y expresamos la amplitud en metros: ', s('EM'), ' = ', s('k'), ' · ', s('A'), '² / 2 = ', q('k', k), ' · (', q('A', A), ')² / 2 = ', q('EM', valor, 'J'), '.']],
      errores: [error('SIN_MEDIO', 2 * valor, 'Omitiste dividir entre dos. La fuerza aumenta desde cero al deformar el resorte; la energía corresponde al área triangular bajo esa fuerza, no al rectángulo.'), error('MEDIO_DOS_VECES', valor / 2, 'Dividiste entre dos una vez de más. El factor de la energía elástica ya considera que la fuerza aumenta durante la deformación; aplícalo solo una vez.'), error('SIN_CUADRADO', k * A / 2, 'Usaste la amplitud sin elevarla al cuadrado. Al estirar más, crecen tanto la fuerza como la distancia de deformación; la energía depende del cuadrado.')] };
  };
  CONSTRUIR['rapidez-posicion'] = (rng, semilla) => {
    const papel = semilla === 'papel-6';
    const m = papel ? 0.4 : elegir(rng, [0.2, 0.4, 0.5, 0.8]), k = papel ? 40 : elegir(rng, [40, 80, 120, 160, 200]), ACm = papel ? 5 : elegir(rng, [10, 15, 20, 25]), xCm = papel ? 3 : red(ACm * elegir(rng, [-0.8, -0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8]));
    const A = ACm / 100, x = xCm / 100, total = energia(k, A), elastica = energia(k, x), cinetica = total - elastica, valor = Math.sqrt(2 * cinetica / m);
    return { entradas: { m, k, ACm, xCm }, modelo: 'energia-horizontal', clave: 'v', valor, unidad: 'm/s', datos: [...horizontal, cm],
      enunciado: ['Un bloque de ', q('m', m, 'kg'), ' oscila con un resorte de rigidez ', q('k', k, 'N/m'), ' y amplitud ', q('A', ACm, 'cm'), '.'], pregunta: ['¿Cuál es su rapidez al pasar por ', q('x', xCm, 'cm'), '?'],
      solucion: [['Calculamos la energía total desde el extremo, donde el bloque está quieto y toda la energía es elástica. Usamos la amplitud en metros: ', s('EM'), ' = ', q('k', k), ' · (', q('A', A), ')² / 2 = ', q('EM', total, 'J'), '.'],
        ['El resorte todavía almacena energía en esta posición. La restamos del total porque solo la energía restante corresponde al movimiento: ', s('EC'), ' = ', s('EM'), ' − ', s('EPE'), ' = ', q('EM', total), ' − ', q('k', k), ' · (', q('x', x), ')² / 2 = ', q('EC', cinetica, 'J'), '.'],
        ['Despejamos la rapidez desde la energía cinética. Tomamos la raíz positiva porque la rapidez no incluye el sentido del movimiento: rapidez = √(2 · ', s('EC'), ' / ', s('m'), ') = √(2 · ', q('EC', cinetica), ' / ', q('m', m), ')', mostrar(valor, 'm/s').aproximado ? ' ≈ ' : ' = ', q('v', valor, 'm/s'), '.'],
        ['El bloque puede pasar por esa posición al ir o al volver con la misma rapidez. Por eso la energía, que depende del cuadrado de la velocidad, no decide el sentido.']],
      errores: [error('TOTAL', Math.sqrt(k / m) * A, 'Asignaste toda la energía al movimiento. En esta posición el resorte todavía está deformado; resta su energía elástica antes de calcular la rapidez.'), error('ELASTICA', Math.sqrt(k / m) * Math.abs(x), 'Confundiste la energía almacenada en el resorte con la del movimiento. La energía cinética es lo que queda de la total después de restar la elástica.'), error('SIN_DOS', valor / Math.SQRT2, 'Perdiste el factor dos al despejar la rapidez. La fórmula de energía cinética divide entre dos; al aislar la velocidad al cuadrado debes multiplicar por dos.')] };
  };
  CONSTRUIR['amplitud-desde-estado'] = (rng, semilla) => {
    const papel = semilla === 'papel-8';
    const m = papel ? 0.4 : elegir(rng, [0.2, 0.4, 0.5, 0.8]), k = papel ? 40 : elegir(rng, [40, 80, 120, 160]), xCm = papel ? 5 : elegir(rng, [-12, -10, -8, -6, -4, 4, 6, 8, 10, 12]), velocidad = papel ? 1.2 : elegir(rng, [-1.6, -1.2, -1, -0.8, -0.6, 0.6, 0.8, 1, 1.2, 1.6]);
    const x = xCm / 100, cinetica = m * velocidad * velocidad / 2, elastica = energia(k, x), total = cinetica + elastica, valor = 100 * Math.sqrt(2 * total / k), soloCinetica = 100 * Math.sqrt(m / k) * Math.abs(velocidad);
    return { entradas: { m, k, xCm, v: velocidad }, modelo: 'energia-horizontal', clave: 'A', valor, unidad: 'cm', datos: [...horizontal, cm],
      enunciado: ['Un bloque de ', q('m', m, 'kg'), ' está unido a un resorte de rigidez ', q('k', k, 'N/m'), '. Pasa por ', q('x', xCm, 'cm'), ' con velocidad ', q('v', velocidad, 'm/s'), '.'], pregunta: ['¿Cuál es su amplitud?'],
      solucion: [['El bloque se mueve y el resorte está deformado. Calculamos ambas energías porque contribuyen al mismo total: ', s('EC'), ' = ', q('m', m), ' · (', q('v', velocidad), ')² / 2 = ', q('EC', cinetica, 'J'), '; ', s('EPE'), ' = ', q('k', k), ' · (', q('x', x), ')² / 2 = ', q('EPE', elastica, 'J'), '.'],
        ['Ambas formas pertenecen al mismo sistema. Las sumamos para obtener la energía mecánica que se conserva durante la oscilación sin rozamiento: ', s('EM'), ' = ', q('EC', cinetica), ' + ', q('EPE', elastica), ' = ', q('EM', total, 'J'), '.'],
        ['En el extremo, el bloque se detiene un instante y toda la energía queda en el resorte. Esa deformación máxima es la amplitud; la despejamos: ', s('A'), ' = √(2 · ', s('EM'), ' / ', s('k'), ').'],
        ['La raíz da la amplitud en metros. La convertimos a centímetros para expresar cuánto puede separarse el bloque del equilibrio: ', s('A'), ' = 100 · √(2 · ', q('EM', total), ' / ', q('k', k), ')', mostrar(valor, 'cm').aproximado ? ' ≈ ' : ' = ', q('A', valor, 'cm'), '.']],
      errores: [error('SOLO_CINETICA', soloCinetica, 'Contaste solo la energía del movimiento. El resorte ya está deformado en el estado dado; suma también su energía antes de hallar la amplitud.'), error('POSICION', Math.abs(xCm), 'Tomaste la posición actual como extremo. El bloque todavía tiene velocidad, así que no está en el punto de retorno; usa la energía total para hallar la amplitud.'), error('SUMA_DISTANCIAS', Math.abs(xCm) + soloCinetica, 'Sumaste distancias como si la energía creciera linealmente con ellas. Las energías dependen de cuadrados; suma primero las energías y después despeja la amplitud.')] };
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
        explicacion: `${e.motivo} Ese procedimiento da ${t}.`, respaldo: 'hipotesis', fuente: FUENTE });
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
