/* Oscilaciones: seis ideas, modelos ideales y cálculos determinísticos.
 * Propuesta: docs/etapa11/propuesta-fisica.md. Las familias de magnitudes conservan
 * su color; los símbolos y las unidades permiten distinguirlas sin depender del color.
 * Los Datos contienen condiciones y valores, nunca el procedimiento (26 nov 2026).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(Math.abs(n) < 1e-10 ? 0 : n, d);
  const COLORES = { x: 'i', A: 'i', L: 'i', d: 'i', delta: 'i', v: 'o', a: 'd', F: 'd', t: 'h', T: 'h', f: 'h', omega: 'h', phi: 'h', theta: 'h', g: 'h', m: 'f', k: 'f', N: 'f', EC: 'o', EPE: 'i', EM: 'f' };
  const V = (clave, texto) => ({ v: `c-${COLORES[clave]}`, t: String(texto), m: clave });
  const sub = (base, indice) => ({ sub: [base, indice] });
  const sup = (base, potencia = '2') => ({ sup: [base, potencia] });
  const frac = (arriba, abajo) => ({ frac: [arriba, abajo] });
  const raiz = contenido => ({ raiz: contenido });
  const S = Object.fromEntries(Object.keys(COLORES).map(k => [k, V(k, { omega: 'ω', phi: 'φ', theta: 'θ', delta: 'δ' }[k] || k)]));
  S.EC = sub(V('EC', 'E'), 'C'); S.EPE = sub(V('EPE', 'E'), 'PE'); S.EM = sub(V('EM', 'E'), 'M');
  const Q = (clave, n, unidad = '', decimales = 2) => V(clave, `${f(n, decimales)}${unidad ? ` ${unidad}` : ''}`);
  const est = (datos, estado = {}) => ({ pieza: 'fis-estatica', datos, estado });
  const ejes = (datos, estado = {}) => ({ pieza: 'ejes', datos, estado });
  const paso = (texto, ecuacion) => ({ texto, ...(ecuacion ? { ecuacion } : {}) });
  const glosario = [];
  // Todas las posiciones usan 4 píxeles por centímetro, incluso al cambiar A.
  // La posición no se normaliza por la amplitud. Los rótulos los dibuja fis-estatica.
  function carrito(xx = 0, o = {}) {
    const X = 178 + 4 * xx, y = 120, textos = [
      { x: 178, y: 184, texto: 'Equilibrio', ancla: 'middle' },
      { x: 308, y: 24, texto: 'Derecha: +', ancla: 'end' },
      ...(o.textos || []),
    ];
    if (o.rotuloX !== false) textos.push({ x: 12, y: 24, texto: o.rotuloX || `x ${Math.abs(xx * 100 - Math.round(xx * 100)) < 1e-7 ? '=' : '≈'} ${f(xx)} cm`, color: 'i' });
    if (o.A !== undefined) textos.push({ x: 12, y: 208, texto: `A = ${f(o.A)} cm`, color: 'i' });
    const lineas = [{ de: [178, 72], a: [178, 164], discontinua: true }];
    if (o.A !== undefined) for (const signo of [-1, 1]) lineas.push({ de: [178 + 4 * signo * o.A, 76], a: [178 + 4 * signo * o.A, 154], discontinua: true });
    const flechas = [];
    for (const [clave, yy, escala] of [['v', 60, 18], ['a', 156, 7], ['F', 88, 8]]) {
      if (o[clave] === undefined) continue;
      const valor = o[clave];
      if (Math.abs(valor) < 1e-9) textos.push({ x: X, y: yy, texto: `${clave} = 0`, color: COLORES[clave], ancla: 'middle' });
      else flechas.push({ de: [X, yy], ang: valor > 0 ? 0 : 180, largo: Math.abs(valor) * escala, color: COLORES[clave], texto: `${clave} = ${f(valor)} ${clave === 'v' ? 'm/s' : clave === 'a' ? 'm/s²' : 'N'}`, rumbo: [0, -1] });
    }
    return { alto: 232, piso: { y: 144, x0: 12, x1: 308 }, paredes: [{ x: 22, y0: 85, y1: 144, lado: -1 }],
      objetos: [{ tipo: 'resorte', de: [22, y], a: [X - 18, y], vueltas: 8, ancho: 7 }, { tipo: 'caja', x: X, y: 144, w: 36, h: 36 }],
      textos, lineas, flechas, alt: o.alt || `Un bloque unido a un resorte sobre una mesa horizontal. El centro del recorrido es la posición de equilibrio.` };
  }
  function opciones(valor, errores, formato = n => String(n)) {
    const lista = [{ id: 'c', texto: formato(valor), correcta: true, valor }, ...errores.map((e, n) => ({ id: `d${n}`, texto: formato(e.valor), valor: e.valor, error: e.error, siFuera: e.siFuera }))];
    if (new Set(lista.map(o => o.texto)).size !== lista.length) throw new Error('Oscilaciones: alternativas repetidas');
    if (errores.some(e => e.valor === valor)) throw new Error('Oscilaciones: dos respuestas correctas');
    return lista;
  }
  // Los adaptadores comparten el caso calculado, no confunden las familias de Resuelve y Ahora tú.
  function resuelto(c) {
    return { enunciado: c.enunciado, datos: c.datos, dibujo: c.dibujo, caso: c.caso,
      pasos: [{ tipo: 'pide', texto: c.pide }, { tipo: 'datos', texto: c.tengo }, { tipo: 'regla', ...c.regla },
        ...c.cuentas.map(p => ({ tipo: 'cuentas', ...p })), { tipo: 'sentido', texto: c.sentido }], respuesta: c.respuesta };
  }
  function pregunta(c) {
    return { pregunta: c.enunciado, datos: c.datos, dibujo: c.dibujo, caso: c.caso, opciones: c.opciones,
      solucion: { texto: c.sentido, ecuacion: c.cuentas[c.cuentas.length - 1].ecuacion || c.respuesta } };
  }
  function ejemplo(c, nivel, titulo, indice = 0) {
    const sol = [c.regla, ...c.cuentas];
    const out = { nivel, titulo, enunciado: c.enunciado, datos: c.datos, figura: c.dibujo, solucion: sol, respuesta: c.respuesta, caso: c.caso };
    if (nivel === 3) {
      const ops = c.opciones.slice(), rotar = indice % ops.length;
      out.alternativas = ops.slice(rotar).concat(ops.slice(0, rotar)).map(o => o.texto);
      // Cada valor incorrecto se nombra con su explicación; nunca se reutiliza A como nombre de un cuerpo.
      out.solucion.push({ texto: c.erroresEjemplo || 'Las otras opciones confunden la magnitud pedida con un dato o cambian la operación necesaria.' });
    }
    if (out.solucion.length > 4) throw new Error('Oscilaciones: solución demasiado larga');
    return out;
  }

  // 1. Contar un vaivén: conserva un movimiento regular; cambia A, T y el instante.
  // Reserva la medición de ocho ciclos en cuatro segundos para Predice.
  const idea1 = (() => {
    const magnitud = (tipo, p) => {
      let valor, unidad, clave, enunciado, formula, cuenta, sentido, malos, explicaciones, datos = ['El movimiento se repite sin perder amplitud.'];
      switch (tipo) {
        case 'amplitud-extremos':
          valor = p.A; unidad = 'cm'; clave = 'A';
          enunciado = ['Un bloque oscila entre las posiciones ', Q('x', -p.A, 'cm'), ' y ', Q('x', p.A, 'cm'), ', con el equilibrio en cero. ¿Cuál es su amplitud?'];
          formula = [S.A, ' = distancia del equilibrio a un extremo'];
          cuenta = [S.A, ' = ', Q('A', valor, unidad)]; sentido = 'La amplitud mide la separación del equilibrio a un extremo. Es positiva porque es una distancia; el signo de la posición solo indica de qué lado queda el bloque.';
          malos = [2 * valor, -valor, 4 * valor]; explicaciones = ['Has medido de un extremo al otro. La amplitud llega desde el equilibrio hasta un solo extremo, por eso es la mitad de esa separación.', 'Has usado el signo de la posición izquierda. Ese signo indica un lado; la amplitud es una distancia y no puede ser negativa.', 'Has sumado la ida y la vuelta completas. Ese es el recorrido de un ciclo; la amplitud solo mide del equilibrio a un extremo.']; break;
        case 'amplitud':
          valor = (p.der - p.izq) / 2; unidad = 'cm'; clave = 'A';
          enunciado = ['Un bloque oscila entre las marcas ', Q('x', p.izq, 'cm'), ' y ', Q('x', p.der, 'cm'), ' de una regla. ¿Cuál es su amplitud?'];
          formula = [S.A, ' = distancia entre extremos ÷ 2'];
          cuenta = [S.A, ' = (', Q('x', p.der), ' − ', Q('x', p.izq), ') ÷ 2 = ', Q('A', valor, unidad)];
          sentido = 'Las marcas señalan los extremos, y el equilibrio está a mitad de camino. Al dividir su separación entre dos obtenemos la amplitud, aunque el cero de la regla esté en otro lugar.';
          malos = [2 * valor, p.der, p.der + p.izq]; explicaciones = ['Has tomado toda la separación entre extremos. El equilibrio queda a la mitad: la amplitud solo abarca una de esas dos mitades.', 'Has medido desde el cero de la regla. La amplitud se mide desde el equilibrio, que aquí está entre los dos extremos.', 'Has sumado las marcas. Para hallar la distancia entre ellas hay que restarlas; después se toma la mitad, porque el equilibrio está en el centro.']; break;
        case 'periodo':
          valor = p.dt / p.N; unidad = 's'; clave = 'T';
          enunciado = ['Un bloque completa ', Q('N', p.N), ' oscilaciones en ', Q('t', p.dt, 's'), '. ¿Cuánto dura cada oscilación?'];
          formula = [S.T, ' = ', frac('tiempo total', 'número de ciclos')];
          cuenta = [S.T, ' = ', Q('t', p.dt), ' ÷ ', Q('N', p.N), ' = ', Q('T', valor, unidad)];
          sentido = 'Repartimos el tiempo total entre los ciclos, porque todos duran lo mismo. El resultado dice cuántos segundos necesita el bloque para completar una ida y vuelta.';
          malos = [p.N / p.dt, p.dt, p.dt / (2 * p.N)]; explicaciones = ['Has dividido los ciclos entre los segundos. Eso calcula la frecuencia; para saber cuánto dura un ciclo, reparte el tiempo entre los ciclos.', 'Has tomado todo el tiempo medido como si correspondiera a una sola oscilación. Hay varios ciclos: divide ese tiempo entre la cantidad de ciclos.', 'Has contado la ida y la vuelta por separado. Juntas forman un ciclo completo; duplicar el número de ciclos reduce indebidamente su duración.']; break;
        case 'frecuencia':
          valor = p.N / p.dt; unidad = 'Hz'; clave = 'f';
          enunciado = ['Un bloque realiza ', Q('N', p.N), ' ciclos completos en ', Q('t', p.dt, 's'), '. ¿Cuál es su frecuencia?'];
          formula = [S.f, ' = ', frac('número de ciclos', 'tiempo total')];
          cuenta = [S.f, ' = ', Q('N', p.N), ' ÷ ', Q('t', p.dt), ' = ', Q('f', valor, unidad)];
          sentido = 'Dividimos los ciclos entre los segundos porque la frecuencia indica cuántas oscilaciones se completan en cada segundo. La unidad hertz expresa precisamente ciclos por segundo.';
          malos = [p.dt / p.N, 2 * valor, p.N]; explicaciones = ['Has dividido el tiempo entre los ciclos: ese resultado es el período. La frecuencia pide la cuenta inversa, ciclos por segundo.', 'Has contado la ida y la vuelta como dos ciclos. Una oscilación incluye ambos trayectos, así que esa cuenta duplica la frecuencia.', 'Has usado el número total de ciclos. Para saber cuántos corresponden a un segundo, hay que repartirlos entre los segundos transcurridos.']; break;
        case 'recorrido':
          valor = 4 * p.A * p.N; unidad = 'cm'; clave = 'd';
          enunciado = ['Un bloque tiene amplitud ', Q('A', p.A, 'cm'), ' y completa ', Q('N', p.N), p.N === 1 ? ' ciclo. ¿Qué distancia recorre en total?' : ' ciclos. ¿Qué distancia recorre en total?'];
          formula = [S.d, ' = 4 · ', S.A, ' · ', S.N];
          cuenta = [S.d, ' = 4 · ', Q('A', p.A), ' · ', Q('N', p.N), ' = ', Q('d', valor, unidad)];
          sentido = 'De un extremo al otro hay dos amplitudes, y al regresar recorre otras dos. Por eso cada ciclo suma cuatro amplitudes de camino, aunque la posición final coincida con la inicial.';
          malos = [2 * p.A * p.N, p.A * p.N, 0]; explicaciones = ['Has contado el viaje hasta el otro extremo, pero falta el regreso. Una oscilación completa incluye la ida y la vuelta.', 'Has contado solo del equilibrio a un extremo. Una ida y vuelta completa recorre cuatro tramos de esa longitud.', 'Has calculado el desplazamiento, que es cero al volver al inicio. La distancia suma todo el camino recorrido, aunque el bloque regrese.']; break;
        case 'posicion':
          valor = -p.distancia; unidad = 'cm'; clave = 'x';
          enunciado = ['La derecha es positiva. El bloque está ', Q('x', p.distancia, 'cm'), ' a la izquierda del equilibrio. ¿Cuál es su posición con signo?'];
          formula = [S.x, ' = −distancia al equilibrio'];
          cuenta = [S.x, ' = ', Q('x', valor, unidad)]; sentido = 'La posición es negativa porque el bloque está a la izquierda y elegimos positiva la derecha. Ese signo ubica el bloque; no dice si en ese instante avanza o retrocede.';
          malos = [p.distancia, 0, -2 * p.distancia]; explicaciones = ['Has asignado signo positivo a la izquierda. El enunciado eligió positiva la derecha, así que la posición izquierda debe llevar signo negativo.', 'Has colocado el bloque en el equilibrio. El cero corresponde a esa referencia; el bloque está separado de ella.', 'Has duplicado la distancia dada. La posición usa esa misma separación al equilibrio y solo añade el signo del lado donde está el bloque.']; break;
        case 'tiempo':
          valor = p.N * p.T; unidad = 's'; clave = 't';
          enunciado = ['Un bloque repite su movimiento cada ', Q('T', p.T, 's'), '. ¿Cuánto tarda en completar ', Q('N', p.N), ' ciclos?'];
          formula = [S.T, ' = ', frac(S.t, S.N), ';   ', S.t, ' = ', S.N, ' · ', S.T];
          cuenta = [S.t, ' = ', Q('N', p.N), ' · ', Q('T', p.T), ' = ', Q('t', valor, unidad)]; sentido = 'Cada ciclo tarda un período y ocurre después del anterior. Por eso multiplicamos la duración de uno por la cantidad de ciclos: obtenemos el tiempo total de todas las idas y vueltas.';
          malos = [p.N / p.T, p.T / p.N, p.T]; explicaciones = ['Has dividido la cantidad de ciclos entre el período. Para sumar el tiempo de varios ciclos iguales, multiplica cuántos hay por lo que dura uno.', 'Has repartido un solo período entre todos los ciclos. El período ya es el tiempo de uno; cada ciclo adicional agrega otro período.', 'Has usado la duración de un solo ciclo. El bloque realiza varios consecutivos, de modo que hay que sumar sus duraciones.']; break;
        case 'ciclos':
          valor = p.d / (4 * p.A); unidad = 'ciclos'; clave = 'N';
          enunciado = ['Un bloque de amplitud ', Q('A', p.A, 'cm'), ' recorre ', Q('d', p.d, 'cm'), ' y termina en su extremo inicial. ¿Cuántos ciclos completó?'];
          formula = [S.d, ' = 4 · ', S.A, ' · ', S.N, ';   ', S.N, ' = ', frac(S.d, ['4 · ', S.A])];
          cuenta = [S.N, ' = ', Q('d', p.d), ' ÷ (4 · ', Q('A', p.A), ') = ', Q('N', valor, unidad)]; sentido = 'Cada ciclo recorre cuatro amplitudes. Dividimos la distancia total entre ese recorrido para saber cuántas idas y vueltas completas caben en el camino medido.';
          malos = [2 * valor, 4 * valor, p.d]; explicaciones = ['Has dividido entre la distancia de una ida. Falta incluir la vuelta: cada ciclo recorre cuatro amplitudes.', 'Has dividido entre una sola amplitud. Ese tramo es solo una cuarta parte del recorrido de una oscilación completa.', 'Has usado el valor de la distancia como si contara oscilaciones. Para obtener ciclos, divide los centímetros totales entre los centímetros recorridos en cada ciclo.']; break;
        case 'centro':
          valor = 2 * (p.final - p.inicio); unidad = 's'; clave = 'T';
          enunciado = ['El bloque cruza el equilibrio a los ', Q('t', p.inicio, 's'), '. En el siguiente cruce, a los ', Q('t', p.final, 's'), ', va en sentido contrario. ¿Cuál es su período?'];
          formula = [frac(S.T, '2'), ' = tiempo entre cruces consecutivos'];
          cuenta = [S.T, ' = 2 · (', Q('t', p.final), ' − ', Q('t', p.inicio), ') = ', Q('T', valor, unidad)]; sentido = 'Entre estos cruces cambia el sentido: solo ha transcurrido medio ciclo. Duplicamos ese intervalo porque falta regresar al centro moviéndose en el sentido del primer cruce.';
          malos = [valor / 2, valor / 4, valor * 2]; explicaciones = ['Has tomado dos cruces consecutivos como un ciclo. En ellos el bloque va en sentidos contrarios; debe volver a cruzar con el sentido inicial para completar la oscilación.', 'Has dividido otra vez el intervalo entre cruces. Ese intervalo ya es medio período: para hallar el período completo hay que duplicarlo.', 'Has contado cuatro intervalos entre cruces. Bastan dos: el primero cambia el sentido y el segundo devuelve el movimiento al estado inicial.']; break;
        case 'minutos':
          valor = p.f * 60 * p.min; unidad = 'ciclos'; clave = 'N'; datos = ['1 min = 60 s.', 'La frecuencia permanece constante.'];
          enunciado = ['Un bloque oscila con frecuencia ', Q('f', p.f, 'Hz'), ' durante ', Q('t', p.min, 'min'), '. ¿Cuántos ciclos completa?'];
          formula = [S.f, ' = ', frac(S.N, S.t), ';   ', S.N, ' = ', S.f, ' · ', S.t];
          cuenta = [S.t, ' = ', Q('t', p.min), ' · 60 = ', Q('t', 60 * p.min, 's'), '   ;   ', S.N, ' = ', Q('f', p.f), ' · ', Q('t', 60 * p.min), ' = ', Q('N', valor, unidad)]; sentido = 'La frecuencia cuenta ciclos por segundo, por eso convertimos primero los minutos a segundos. Multiplicar esa cantidad de segundos por los ciclos de cada segundo da el total de oscilaciones.';
          malos = [p.f * p.min, 60 * p.min / p.f, valor * 2]; explicaciones = ['Has usado los minutos como si fueran segundos. La frecuencia está expresada por segundo; convierte el tiempo antes de multiplicar.', 'Has dividido el tiempo entre la frecuencia. Cada segundo aporta la cantidad de ciclos indicada por la frecuencia, así que hay que multiplicar.', 'Has contado cada ida y cada vuelta como ciclos separados. La frecuencia ya cuenta oscilaciones completas: no debe duplicarse.']; break;
        case 'camino-tiempo':
          valor = 4 * p.A * p.dt / p.T; unidad = 'cm'; clave = 'd';
          enunciado = ['Un bloque parte del extremo derecho. Su amplitud es ', Q('A', p.A, 'cm'), ' y su período, ', Q('T', p.T, 's'), '. ¿Qué distancia recorre en ', Q('t', p.dt, 's'), '?'];
          formula = [S.d, ' = 4 · ', S.A, ' · ', S.N, ' + 2 · ', S.A];
          cuenta = [Q('t', p.dt, 's'), ' = ', Q('N', Math.floor(p.dt / p.T)), ' · ', Q('T', p.T, 's'), ' + ', Q('t', p.T / 2, 's'), ';   ', S.d, ' = ', Q('N', Math.floor(p.dt / p.T)), ' · 4 · ', Q('A', p.A), ' + 2 · ', Q('A', p.A), ' = ', Q('d', valor, unidad)];
          sentido = 'El tiempo incluye ciclos completos y medio ciclo adicional. Cada ciclo suma cuatro amplitudes; el medio ciclo lleva al extremo opuesto y añade dos. Así contamos el camino sin suponer rapidez constante.';
          malos = [valor / 2, p.A, -2 * p.A]; explicaciones = ['Has asignado dos amplitudes a cada período y una al medio período. Un período recorre cuatro amplitudes, y el medio período final recorre dos: ambos recorridos quedaron reducidos a la mitad.', 'Has tomado la amplitud como distancia total. Esa es solo la separación del equilibrio a un extremo; el bloque recorre varios tramos durante el tiempo indicado.', 'Has calculado el cambio de posición entre extremos. La distancia suma todas las idas y vueltas, por eso no lleva signo negativo.']; break;
        case 'marcas':
          valor = (p.final - p.inicio) / (p.N - 1); unidad = 's'; clave = 'T';
          enunciado = ['La primera llegada al extremo derecho se registra cuando el reloj marca ', Q('t', p.inicio, 's'), '; la llegada número ', Q('N', p.N), ', a los ', Q('t', p.final, 's'), '. ¿Cuál es el período?'];
          formula = ['tiempo = (llegadas − 1) · ', S.T];
          cuenta = [S.T, ' = (', Q('t', p.final), ' − ', Q('t', p.inicio), ') ÷ (', Q('N', p.N), ' − 1) = ', Q('T', valor, unidad)]; sentido = `Entre ${p.N} llegadas hay ${p.N - 1} intervalos, porque el primero empieza después de la primera llegada. Repartir el tiempo transcurrido entre esos intervalos da la duración de cada ciclo.`;
          malos = [(p.final - p.inicio) / p.N, p.final / (p.N - 1), p.final - p.inicio]; explicaciones = ['Has contado las llegadas como si todas cerraran un intervalo. La primera solo marca el inicio; hay un intervalo menos que llegadas.', 'Has usado la lectura final del reloj como tiempo transcurrido. El conteo empezó después de cero: resta la lectura de la primera llegada.', 'Has tomado todo el tiempo transcurrido como un período. Entre la primera y la última llegada hay varios ciclos; reparte el tiempo entre ellos.']; break;
        case 'recorrido-frecuencia':
          valor = 4 * p.A * p.f * p.dt / 100; unidad = 'm'; clave = 'd'; datos = ['1 m = 100 cm.', 'El movimiento mantiene su amplitud y frecuencia.'];
          enunciado = ['Un bloque de amplitud ', Q('A', p.A, 'cm'), ' oscila a ', Q('f', p.f, 'Hz'), ' durante ', Q('t', p.dt, 's'), '. ¿Cuántos metros recorre?'];
          formula = [S.N, ' = ', S.f, ' · ', S.t, ';   ', S.d, ' = 4 · ', S.A, ' · ', S.N];
          cuenta = [S.N, ' = ', Q('f', p.f), ' · ', Q('t', p.dt), ' = ', Q('N', p.f * p.dt), '   ;   ', S.d, ' = 4 · ', Q('A', p.A / 100), ' · ', Q('N', p.f * p.dt), ' = ', Q('d', valor, unidad)]; sentido = 'La frecuencia y el tiempo dan el número de ciclos. Cada ciclo recorre cuatro amplitudes; al expresar la amplitud en metros, la suma de todas las idas y vueltas también queda en metros.';
          malos = [valor * 100, valor / 2, p.A / 100]; explicaciones = ['Has calculado en centímetros y escrito metros. Convierte la amplitud a metros antes de sumar los recorridos, o divide el resultado en centímetros entre cien.', 'Has sumado solo las idas. Cada oscilación incluye también el regreso, así que el recorrido de un ciclo es de cuatro amplitudes.', 'Has tomado la amplitud como todo el recorrido. El bloque hace varias idas y vueltas; cuenta primero los ciclos y después suma sus recorridos.']; break;
        case 'amplitud-recorrido':
          valor = p.d / (4 * p.f * p.dt); unidad = 'cm'; clave = 'A';
          enunciado = ['Un bloque oscila a ', Q('f', p.f, 'Hz'), ' y recorre ', Q('d', p.d, 'cm'), ' en ', Q('t', p.dt, 's'), '. ¿Cuál es su amplitud?'];
          formula = [S.N, ' = ', S.f, ' · ', S.t, ';   ', S.d, ' = 4 · ', S.A, ' · ', S.N];
          cuenta = [S.N, ' = ', Q('f', p.f), ' · ', Q('t', p.dt), ' = ', Q('N', p.f * p.dt), ';   ', S.A, ' = ', Q('d', p.d), ' ÷ (4 · ', Q('N', p.f * p.dt), ') = ', Q('A', valor, unidad)]; sentido = 'La frecuencia y el tiempo indican cuántos ciclos hubo. Repartimos el recorrido entre esos ciclos y entre los cuatro tramos de cada ciclo; cada tramo mide una amplitud.';
          malos = [2 * valor, 4 * valor, p.d / 4]; explicaciones = ['Has asignado dos amplitudes a cada ciclo y olvidado la vuelta. La oscilación completa recorre cuatro, por eso debes dividir entre cuatro veces el número de ciclos.', 'Has tomado el recorrido de cada ciclo como una amplitud. En realidad contiene cuatro amplitudes; falta dividir ese recorrido entre cuatro.', 'Has dividido el recorrido total entre cuatro como si hubiera un solo ciclo. Primero cuenta cuántos ciclos hubo y reparte también entre ellos.']; break;
        default: throw new Error(`Tipo de ciclo desconocido: ${tipo}`);
      }
      const fmt = n => `${Math.abs(n * 100 - Math.round(n * 100)) < 1e-7 ? '' : '≈ '}${f(n)} ${unidad}`;
      const errores = malos.map((n, j) => ({ valor: n, error: `OS-CICLO-${tipo}-${j}`, siFuera: explicaciones[j] }));
      const ps = { tipo, ...p, valor, unidad };
      // Los dibujos de los problemas muestran el montaje, sin situar a escala la medida preguntada.
      const posicionInicial = tipo === 'posicion' ? -9 : ['camino-tiempo', 'marcas'].includes(tipo) ? 10 : 0;
      const dibujo = est(carrito(posicionInicial, { rotuloX: false, textos: [{ x: 160, y: 208, texto: 'El dibujo no está a escala', ancla: 'middle' },
        ...(['camino-tiempo', 'marcas'].includes(tipo) ? [{ x: 218, y: 64, texto: 'Extremo derecho', ancla: 'middle' }] : [])],
        alt: tipo === 'posicion' ? 'Un bloque está a la izquierda de la posición de equilibrio. El dibujo del problema no está a escala.' : ['camino-tiempo', 'marcas'].includes(tipo) ? 'Un bloque está en el extremo derecho de su recorrido, a la derecha del equilibrio. El dibujo no está a escala.' : 'Un bloque unido a un resorte, con su equilibrio señalado. El dibujo del problema no está a escala.' }));
      const nombres = { A: ['Amplitud', 'A', 'cm'], N: ['Cantidad contada', 'N', ''], dt: ['Tiempo total', 't', 's'], T: ['Período', 'T', 's'], f: ['Frecuencia', 'f', 'Hz'], d: ['Recorrido', 'd', 'cm'], min: ['Tiempo total', 't', 'min'], distancia: ['Distancia al equilibrio', 'x', 'cm'], inicio: ['Primer instante', 't', 's'], final: ['Último instante', 't', 's'], izq: ['Marca izquierda', 'x', 'cm'], der: ['Marca derecha', 'x', 'cm'] };
      const tengo = Object.entries(p).flatMap(([k, n], j) => [j ? '; ' : '', `${nombres[k][0]}: `, Q(nombres[k][1], n, nombres[k][2])]);
      const textosRegla = {
        'amplitud-extremos': 'La amplitud se mide del equilibrio a un extremo; las posiciones de los extremos solo indican hacia qué lado queda cada uno.',
        amplitud: 'El equilibrio queda a mitad de camino entre los extremos. Restamos sus marcas para hallar la separación y tomamos la mitad.',
        periodo: 'Todos los ciclos duran lo mismo. Repartir el tiempo total entre ellos permite conocer la duración de uno.',
        frecuencia: 'La frecuencia dice cuántos ciclos se completan en un segundo; por eso dividimos la cantidad de ciclos entre el tiempo.',
        recorrido: 'Una ida cruza dos amplitudes y la vuelta cruza otras dos. Multiplicamos ese recorrido por la cantidad de ciclos.',
        posicion: 'El signo de la posición depende del lado del equilibrio. Como la derecha es positiva, la separación hacia la izquierda lleva signo negativo.',
        tiempo: 'El tiempo total reúne varios ciclos consecutivos. Cada uno aporta un período, así que multiplicamos cuántos ciclos hay por su duración.',
        ciclos: 'El recorrido total contiene varias idas y vueltas iguales. Dividirlo entre las cuatro amplitudes de un ciclo permite contar cuántas hubo.',
        centro: 'Dos cruces consecutivos del centro tienen sentidos contrarios y están separados por medio período. Para repetir el movimiento inicial hacen falta dos intervalos así.',
        minutos: 'La frecuencia cuenta ciclos en cada segundo. Multiplicarla por el tiempo en segundos suma todos los ciclos realizados.',
        'camino-tiempo': 'Separamos los ciclos completos del medio ciclo final: cada ciclo recorre cuatro amplitudes y el tramo hasta el extremo opuesto recorre dos.',
        marcas: 'Cada intervalo entre llegadas al mismo extremo es un período. La primera llegada inicia el conteo, por eso hay un intervalo menos que llegadas.',
        'recorrido-frecuencia': 'Primero contamos los ciclos usando la frecuencia y el tiempo. Después sumamos cuatro amplitudes por ciclo, pues cada uno incluye ida y vuelta.',
        'amplitud-recorrido': 'La frecuencia y el tiempo dan los ciclos completos. Como cada ciclo recorre cuatro amplitudes, el recorrido total permite reconstruir la longitud de una amplitud.',
      };
      const cuentas = [];
      if (tipo === 'amplitud-recorrido') cuentas.push(paso('En el recorrido total, la amplitud está multiplicada por cuatro y por el número de ciclos. Dividimos entre ambos factores para dejarla sola.', [S.A, ' = ', frac(S.d, ['4 · ', S.N])]));
      if (tipo === 'marcas') cuentas.push(paso('Restamos las lecturas del reloj para hallar el tiempo transcurrido. Lo repartimos entre los intervalos, porque cada uno dura un período.', [S.T, ' = ', frac('tiempo transcurrido', 'número de llegadas − 1')]));
      const textosCuenta = {
        'amplitud-extremos': 'Tomamos la distancia entre cero y cualquiera de los extremos. Usamos su valor positivo, porque se pide cuánto se aleja el bloque, no de qué lado está.',
        amplitud: 'Restamos la marca izquierda de la derecha para medir la separación. La dividimos entre dos: ambas mitades van del equilibrio a un extremo y tienen la misma longitud.',
        periodo: 'Dividimos los segundos medidos entre las oscilaciones completas. Así asignamos a cada oscilación la misma parte del tiempo total.',
        frecuencia: 'Dividimos la cantidad de ciclos entre los segundos transcurridos. El cociente indica cuántos ciclos corresponden a cada segundo de movimiento.',
        recorrido: 'Multiplicamos la amplitud por cuatro para reunir la ida y la vuelta. Después multiplicamos por los ciclos realizados, porque cada uno repite ese recorrido.',
        posicion: 'Conservamos la distancia dada y le colocamos signo negativo. La longitud no cambia: el signo solo identifica que el bloque está a la izquierda.',
        tiempo: 'Multiplicamos la cantidad de ciclos por los segundos que dura cada uno. Esta multiplicación suma el tiempo de todas las repeticiones consecutivas.',
        ciclos: 'Calculamos cuatro veces la amplitud para obtener el recorrido de una oscilación. Dividimos la distancia total entre ese recorrido: el cociente cuenta las oscilaciones.',
        centro: 'Restamos las lecturas del reloj para medir el intervalo entre cruces. Como corresponde a media oscilación, lo duplicamos para obtener el período completo.',
        minutos: 'Multiplicamos los minutos por sesenta para obtener segundos. Luego multiplicamos por la frecuencia: cada segundo aporta esa cantidad de ciclos al total.',
        'camino-tiempo': 'Separamos el tiempo en períodos completos y medio período final. Sumamos cuatro amplitudes por cada período y dos por el medio período que lleva al extremo opuesto.',
        marcas: 'Restamos el instante inicial del final y descontamos una llegada del conteo. Dividir esos resultados reparte el tiempo entre los intervalos que realmente transcurrieron.',
        'recorrido-frecuencia': 'Multiplicamos frecuencia por tiempo para contar ciclos. Usamos la amplitud en metros y multiplicamos por cuatro y por los ciclos, porque cada ida y vuelta recorre cuatro amplitudes.',
        'amplitud-recorrido': 'Contamos los ciclos multiplicando la frecuencia por el tiempo. Dividimos el recorrido entre cuatro veces esa cantidad, para obtener la distancia de un solo tramo: la amplitud.',
      };
      cuentas.push(paso(textosCuenta[tipo], cuenta));
      return { enunciado, datos, dibujo, pide: `Se pide ${({ T: 'el período', f: 'la frecuencia', A: 'la amplitud', d: 'la distancia recorrida', x: 'la posición con signo', t: 'el tiempo total', N: 'el número de ciclos' })[clave]}.`,
        tengo, regla: paso(textosRegla[tipo], formula), cuentas, sentido,
        respuesta: [Q(clave, valor, unidad)], opciones: opciones(valor, errores, fmt), caso: ps,
        erroresEjemplo: errores.map((e, j) => {
          const finales = {
            'camino-tiempo': ['reduces a la mitad cada recorrido', 'das la amplitud, no todo el camino', 'das el desplazamiento, que puede ser negativo'],
            marcas: ['cuentas llegadas en vez de intervalos', 'no descuentas la lectura inicial del reloj', 'juntas varios períodos como si fueran uno'],
            'recorrido-frecuencia': ['escribes metros sin convertir los centímetros', 'cuentas solo las idas, sin las vueltas', 'das la amplitud, no todo el camino'],
            'amplitud-recorrido': ['olvidas que cada ciclo también incluye la vuelta', 'tomas todo un recorrido por una amplitud', 'tratas varios ciclos como si fueran uno'],
          };
          return finales[tipo] ? `Con ${fmt(e.valor)} ${finales[tipo][j]}.` : explicaciones[j];
        }).join(' ') };
    };
    const casos = [
      ['amplitud-extremos', { A: 12 }, 'Los extremos del recorrido'],
      ['periodo', { N: 6, dt: 18 }, 'El tiempo de un ciclo'],
      ['frecuencia', { N: 12, dt: 3 }, 'Ciclos por segundo'],
      ['recorrido', { A: 7, N: 1 }, 'Una ida y vuelta'],
      ['posicion', { distancia: 9 }, 'A la izquierda'],
      ['tiempo', { N: 15, T: 2 }, 'Quince ciclos seguidos'],
      ['ciclos', { A: 8, d: 96 }, 'Contar usando el recorrido'],
      ['centro', { inicio: 2, final: 10 }, 'Dos cruces del centro'],
      ['amplitud', { izq: 6, der: 26 }, 'El cero de la regla'],
      ['minutos', { f: 5, min: 1 }, 'Un minuto de movimiento'],
      ['camino-tiempo', { A: 4, T: 8, dt: 28 }, 'Hasta el otro extremo'],
      ['marcas', { inicio: 1, final: 19, N: 7 }, 'Llegadas e intervalos'],
      ['recorrido-frecuencia', { A: 5, f: 2, dt: 12 }, 'El recorrido en metros'],
      ['amplitud-recorrido', { f: 4, dt: 3, d: 384 }, 'Reconstruir la amplitud'],
      ['camino-tiempo', { A: 6, T: 4, dt: 18 }, 'Varias idas y vueltas'],
    ];
    const ejemplos = casos.map(([tipo, datos, titulo], n) => ejemplo(magnitud(tipo, datos), 1 + Math.floor(n / 5), titulo, n - 10));
    // Explicaciones específicas de cada distractor de examen, calculado por su operación real.
    for (let j = 10; j < 15; j++) {
      const c = magnitud(casos[j][0], casos[j][1]);
      ejemplos[j].solucion[ejemplos[j].solucion.length - 1].texto = c.erroresEjemplo;
    }
    // El animador puede entregar cinco decimales; el modelo toma el mismo décimo visible en el control.
    const tiempo = val => Number(val.t.toFixed(1));
    const pos = val => val.A * Math.cos(2 * Math.PI * tiempo(val) / val.T);
    const vista = val => est(carrito(pos(val), { A: val.A, textos: [{ x: 308, y: 208, texto: `t = ${f(tiempo(val), 1)} s`, color: 'h', ancla: 'end' }] }));
    const antes = est(carrito(12, { A: 12, rotuloX: false, textos: [{ x: 160, y: 48, texto: '8 ciclos en 4 s', ancla: 'middle' }] }));
    const despues = est(carrito(12, { A: 12, rotuloX: false, textos: [{ x: 160, y: 48, texto: 'T = 0,5 s', color: 'h', ancla: 'middle' }] }));
    glosario.push(
      { termino: 'oscilación', formas: ['oscilación', 'oscilaciones'], simple: 'Un vaivén completo, como ir y volver en un columpio.', def: 'Repetición del movimiento que termina en la misma posición y con el mismo sentido que al empezar.', ejemplos: ['Un bloque sale del extremo derecho, llega al izquierdo y vuelve al derecho.', 'Cruzar el centro hacia la derecha y volver a cruzarlo hacia la derecha completa un ciclo.', 'Llegar al extremo opuesto desde un extremo es medio ciclo.'] },
      { termino: 'amplitud', simbolo: 'A', medida: 'm', simple: 'Lo más que se aleja del centro, como un columpio al subir.', def: 'Distancia entre la posición de equilibrio y cualquiera de los extremos de una oscilación simétrica.', ejemplos: ['Entre −3 cm y +3 cm, la amplitud es 3 cm.', 'Una amplitud de 6 cm deja 12 cm entre extremos.', 'La amplitud es una distancia: no lleva signo negativo.'] },
    );
    return {
      id: 'ciclo-y-amplitud', titulo: 'Medir un vaivén', pregunta: '¿Cómo describimos un movimiento que va y vuelve?', temas: ['Movimiento periódico y oscilatorio'], pieza: 'fis-estatica',
      aprendizaje: 'Distingo amplitud, posición, período y frecuencia; cuento un ciclo cuando se repiten la posición y el sentido.',
      actividad: 'Cambiar el recorrido del bloque y mirar cuánto tarda en repetir su movimiento.',
      lee: { tarjetas: [
        { titulo: 'Un bloque que va y vuelve', texto: 'Un bloque sujeto a un resorte se mueve por una mesa lisa. La línea central señala el equilibrio: allí la fuerza horizontal del resorte es cero.', dibujo: est(carrito(10, { A: 10 })) },
        { titulo: 'Posición y amplitud', texto: ['La posición ', S.x, ' indica dónde está el bloque respecto del equilibrio. Elegimos positiva la derecha y negativa la izquierda, para distinguir los dos lados. La amplitud ', S.A, ' es lo más que se aleja del equilibrio: mide una distancia y no lleva signo negativo.'] },
        { titulo: 'Qué cuenta el reloj', texto: ['El período ', S.T, ' dice cuánto tarda el movimiento en repetirse. La frecuencia ', S.f, ' cuenta ciclos por segundo. Para reconocer un ciclo completo, observa la posición del bloque y el sentido en que continúa: pasar por el mismo lugar no siempre significa repetir el movimiento.'] },
      ] }, ejemplos,
      juega: { pieza: 'fis-estatica', consigna: 'El bloque va y vuelve por la mesa. Cambia la amplitud y el período; usa el reloj para seguirlo.', voz: 'Al volver al centro, mira también hacia dónde continúa.',
        mision: { texto: 'Haz que la primera llegada al extremo izquierdo ocurra cuando el reloj marque 3 s.', logrado: val => val.T === 6 && tiempo(val) === 3, bien: 'Llegó al otro extremo: todavía le falta regresar para completar la ida y vuelta.' },
        leyenda: [{ s: S.A, t: 'distancia del equilibrio a un extremo' }, { s: S.x, t: 'posición con signo desde el equilibrio' }, { s: S.T, t: 'tiempo de una ida y vuelta' }, { s: S.t, t: 'tiempo transcurrido desde el extremo derecho' }],
        controles: [{ id: 'A', etiqueta: 'Amplitud, A', min: 5, max: 20, paso: 5, inicio: 10, unidad: 'cm', decimales: 0, color: 'c-i' },
          { id: 'T', etiqueta: 'Período, T', min: 2, max: 8, paso: 2, inicio: 4, unidad: 's', decimales: 0, color: 'c-h' },
          { id: 't', etiqueta: 'Tiempo, t', min: 0, max: 16, paso: 0.5, inicio: 0, unidad: 's', decimales: 1, color: 'c-h', auto: { velocidad: 0.5 } }],
        dibujo: vista, lectura: val => [S.x, Math.abs(pos(val) - Math.round(pos(val) * 100) / 100) > 1e-9 ? ' ≈ ' : ' = ', Q('x', pos(val), 'cm'), '; ', S.t, ' = ', Q('t', tiempo(val), 's', 1)], resumen: { A: 10, T: 6, t: 3 }, minimo: 3 },
      predice: { pregunta: 'Otro bloque completa ocho ciclos en 4 s. ¿Cuánto dura una sola oscilación?', datos: ['Los ocho ciclos tienen la misma duración.'],
        dibujo: antes, revelar: despues, opciones: opciones(4 / 8, [
          { valor: 4 / 16, error: 'OS-MEDIO', siFuera: 'Has contado cada ida y cada vuelta como ciclos separados: eso duplica la cantidad contada. Una oscilación reúne ambos trayectos; reparte el tiempo entre los ocho ciclos completos.' },
          { valor: 4 / 4, error: 'OS-PARES', siFuera: 'Has agrupado los ocho ciclos de dos en dos y repartido el tiempo entre cuatro grupos. Cada grupo contiene dos oscilaciones; aquí se pide la duración de una sola.' },
          { valor: 8 / 4, error: 'OS-INV', siFuera: 'Has dividido ocho ciclos entre cuatro segundos. Eso calcula ciclos por segundo, la frecuencia; aquí se necesitan segundos por ciclo, así que la división debe ir al revés.' },
        ], n => `${f(n)} s`), coincide: 'Cada uno de los ocho ciclos ocupa la misma parte de los cuatro segundos.' },
      mira: { pieza: 'fis-estatica', datos: despues.datos, pasos: [paso('Los ocho ciclos duran lo mismo. Repartimos los cuatro segundos entre ellos para hallar cuánto tarda una sola ida y vuelta.', [S.T, ' = ', frac(Q('t', 4, 's'), Q('N', 8))]), paso('Cada ciclo ocupa medio segundo. Al juntar ocho intervalos así recuperamos los cuatro segundos medidos, por eso el resultado corresponde al período.', [S.T, ' = ', Q('T', 4 / 8, 's')]), paso('Para contar ciclos por segundo hacemos la división inversa: repartimos los ocho ciclos entre los cuatro segundos. Esa cantidad es la frecuencia.', [S.f, ' = ', frac(Q('N', 8), Q('t', 4, 's')), ' = ', Q('f', 8 / 4, 'Hz')]),
        paso('En dos cruces consecutivos del centro el bloque va en sentidos opuestos. Falta otro cruce para repetir el movimiento inicial: entre cruces consecutivos pasa medio período.', ['tiempo entre cruces = ', frac(S.T, '2')]),
        paso('La primera llegada solo inicia el conteo. Entre tres llegadas al mismo extremo hay dos intervalos, y cada intervalo corresponde a un ciclo completo.', ['número de intervalos = número de llegadas − 1']),
        paso('Al ir de un extremo al otro pasa por el centro y recorre dos amplitudes. El regreso añade otras dos: una ida y vuelta suma cuatro amplitudes.', ['recorrido de un ciclo = 4 · ', S.A]) ] },
      regla: { texto: 'La amplitud mide del equilibrio a un extremo. El período es el tiempo de un ciclo: repartir cuatro segundos entre ocho ciclos da medio segundo. La frecuencia cuenta ciclos por segundo. El recorrido suma cuatro amplitudes por ciclo, porque el bloque va al otro extremo y regresa, recorriendo dos amplitudes en cada tramo.',
        ecuacion: [S.T, ' = ', frac(S.t, S.N), '   ;   ', S.f, ' = ', frac(S.N, S.t), ' = ', frac('1', S.T), '   ;   ', S.d, ' = 4 · ', S.A, ' · ', S.N],
        condicion: 'el movimiento repite ciclos iguales, sin cambiar su amplitud. Si solo se cuenta una ida, falta la vuelta y el tiempo obtenido es medio período; si los ciclos duran distinto, el cociente da solo una duración promedio.',
        dibujo: est(carrito(10, { A: 10, textos: [{ x: 160, y: 48, texto: 'Un ciclo: derecha, izquierda, derecha', ancla: 'middle' }] })) },
      resuelve: { pieza: 'fis-estatica', generar(s) { const n = 2 + (s % 7); return resuelto(s % 2 ? magnitud('centro', { inicio: n, final: n + 4 }) : magnitud('tiempo', { N: n + 3, T: 4 })); } },
      ahoraTu: { pieza: 'fis-estatica', generar(s) { const n = 2 + Math.floor(s / 3) % 7; return pregunta(s % 3 === 0 ? magnitud('periodo', { N: n + 3, dt: 3 * (n + 3) }) : s % 3 === 1 ? magnitud('amplitud', { izq: n + 1, der: 3 * n + 5 }) : magnitud('camino-tiempo', { A: n + 1, T: 4, dt: 4 * n + 2 })); } },
    };
  })();

  // Cambia: el punto de liberación. Permanece: masa y resorte horizontal.
  // Progresa: separar fuerza, aceleración y velocidad. Se reserva: cambiar al lado izquierdo.
  // Debe verse: eje, equilibrio, masa, rigidez y flechas con escalas comunes.
  const idea2 = (() => {
    const signo = n => n > 0 ? '+' : '';
    const exacto = n => Math.abs(n - Math.round(n * 1000) / 1000) < 1e-9;
    const igual = n => exacto(n) ? ' = ' : ' ≈ ';
    const numero = (clave, n, u = '') => Q(clave, n, u, 3);
    const par = (clave, n) => n < 0 ? ['(', numero(clave, n), ')'] : numero(clave, n);
    const a1 = sub(S.a, '1'), a2 = sub(S.a, '2'), x1 = sub(S.x, '1'), x2 = sub(S.x, '2');
    const m1 = sub(S.m, '1'), m2 = sub(S.m, '2'), k1 = sub(S.k, '1'), k2 = sub(S.k, '2');
    const F1 = sub(S.F, '1');
    const reglaBase = [S.F, ' = −', S.k, ' · ', S.x, '; ', S.a, ' = ', frac(S.F, S.m)];
    const avanzados = new Set(['calibrada', 'masa-calibrada', 'masa-nueva', 'rigidez-nueva', 'dos-masas']);
    const modelo = ['Carro horizontal sin rozamiento y resorte ideal.', 'La derecha es positiva; el equilibrio fija el origen.'];
    function figuraFuerzas(xcm, o) {
      const d = carrito(xcm, o);
      for (const flecha of d.flechas) if (flecha.de[1] === 156) flecha.de[1] = 171;
      for (const t of d.textos) if (t.y === 156 && /^a =/.test(t.texto)) t.y = 169;
      for (const linea of d.lineas) if (linea.de[0] === 178 && linea.a[0] === 178) { linea.de[1] = 92; linea.a[1] = 144; }
      return d;
    }

    function dosEstados(p, q, revelar = false) {
      const objetos = [], lineas = [], textos = [], paredes = [], flechas = [];
      for (const [j, c] of [p, q].entries()) {
        const y = 83 + 138 * j, X = 178 + 4 * c.xcm;
        objetos.push({ tipo: 'resorte', de: [22, y], a: [X - 18, y], vueltas: 8, ancho: 7 },
          { tipo: 'caja', x: X, y: y + 24, w: 36, h: 36 });
        paredes.push({ x: 22, y0: y - 30, y1: y + 24, lado: -1 });
        lineas.push({ de: [12, y + 24], a: [308, y + 24] }, { de: [178, y - 31], a: [178, y + 37], discontinua: true });
        textos.push({ x: 12, y: y - 65, texto: j ? 'Segundo estado' : 'Primer estado' },
          { x: 12, y: y - 45, texto: `x = ${signo(c.xcm)}${f(c.xcm)} cm`, color: 'i' },
          { x: 308, y: y - 45, texto: j && !revelar ? 'a = ?' : `a = ${signo(c.a)}${f(c.a)} m/s²`, color: 'd', ancla: 'end' },
          { x: 178, y: y + 54, texto: 'Equilibrio', ancla: 'middle' });
        if (!j || revelar) flechas.push({ de: [X, y - 12], ang: c.a > 0 ? 0 : 180, largo: Math.abs(c.a) * 7, color: 'd' });
      }
      return est({ alto: 288, objetos, lineas, paredes, textos, flechas,
        alt: revelar ? 'Dos estados del mismo bloque. La aceleración cambia de signo al pasar al otro lado del equilibrio.' : 'Dos posiciones del mismo bloque, con la aceleración del primer estado y una incógnita en el segundo.' });
    }

    function caso(tipo, p) {
      let valor, unidad = 'm/s²', clave = 'a', enunciado, regla = reglaBase, cuentas = [], malos = [];
      const d = [...modelo], agregar = (op, v, corta, motivo) => malos.push({ op, valor: v, corta, motivo });
      const dato = (k, n, u) => numero(k, n, u);
      if (tipo !== 'comparacion' && (Object.keys(p).some(k => /cm$/.test(k)) || ['posicion-cm', 'rigidez-nueva'].includes(tipo))) d.push('1 m = 100 cm.');
      if (p.gramos != null) d.push('1 kg = 1000 g.');
      switch (tipo) {
      case 'fuerza':
        valor = -p.k * p.x; clave = 'F'; unidad = 'N';
        enunciado = ['Un resorte de ', dato('k', p.k, 'N/m'), ' tiene al bloque en ', S.x, ' = ', dato('x', p.x, 'm'), '. ¿Qué fuerza horizontal ejerce sobre el bloque?'];
        regla = [S.F, ' = −', S.k, ' · ', S.x];
        cuentas.push(paso('La fuerza crece con la deformación del resorte. Multiplicamos la constante elástica por la elongación; el signo menos hace que la fuerza apunte de regreso al equilibrio.', [S.F, ' = −', dato('k', p.k), ' · ', par('x', p.x), igual(valor), dato('F', valor, unidad)]));
        agregar('signo', -valor, 'signo cambiado', 'falta el signo que indica el regreso');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'cuentas dos veces la fuerza del único resorte');
        agregar('media', valor / 2, 'das fuerza media', 'promedias con cero en vez de tomar este instante'); break;
      case 'aceleracion':
        valor = p.F / p.m;
        enunciado = ['Un bloque de ', dato('m', p.m, 'kg'), ' recibe una fuerza horizontal neta de ', dato('F', p.F, 'N'), '. ¿Cuál es su aceleración con signo?'];
        regla = [S.F, ' = ', S.m, ' · ', S.a, '; ', S.a, ' = ', frac(S.F, S.m)];
        cuentas.push(paso('La segunda ley relaciona la fuerza total con el cambio de velocidad. Dividimos la fuerza neta entre la masa; el signo de la aceleración conserva el sentido de esa fuerza.', [S.a, ' = ', frac(dato('F', p.F), dato('m', p.m)), igual(valor), dato('a', valor, unidad)]));
        agregar('signo', -valor, 'inviertes el sentido', 'cambias el sentido de la fuerza neta');
        agregar('producto', p.F * p.m, 'multiplicas por masa', 'multiplicas por la masa en vez de dividir');
        agregar('sin-masa', p.F, 'omites la masa', 'das el valor de la fuerza como aceleración');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'cuentas dos veces la fuerza neta'); break;
      case 'rigidez':
        valor = -p.F / p.x; clave = 'k'; unidad = 'N/m';
        enunciado = ['Cuando el bloque está en ', S.x, ' = ', dato('x', p.x, 'm'), ', el resorte ejerce ', dato('F', p.F, 'N'), '. ¿Cuál es su constante elástica?'];
        regla = [S.F, ' = −', S.k, ' · ', S.x, '; ', S.k, ' = ', frac(['−', S.F], S.x)];
        cuentas.push(paso('Dividimos la fuerza por la elongación y conservamos el signo menos de la ley del resorte. La rigidez resulta positiva: indica cuánta fuerza corresponde a cada metro de deformación.', [S.k, ' = ', frac(['−', par('F', p.F)], par('x', p.x)), igual(valor), dato('k', valor, unidad)]));
        agregar('signo', -valor, 'rigidez negativa', 'omites el signo de la fuerza recuperadora');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'cuentas dos veces la fuerza indicada');
        agregar('mitad', valor / 2, 'duplicas el desplazamiento', 'usas el doble de la separación dada'); break;
      case 'posicion':
        valor = -p.F / p.k; clave = 'x'; unidad = 'm';
        enunciado = ['Un resorte de ', dato('k', p.k, 'N/m'), ' ejerce ', dato('F', p.F, 'N'), ' sobre el bloque. ¿Cuál es su desplazamiento desde el equilibrio?'];
        regla = [S.F, ' = −', S.k, ' · ', S.x, '; ', S.x, ' = ', frac(['−', S.F], S.k)];
        cuentas.push(paso('Dividimos la fuerza entre la constante elástica para hallar cuánto se deformó el resorte. Conservamos el signo menos: el bloque está al lado contrario de donde apunta la fuerza recuperadora.', [S.x, ' = ', frac(['−', par('F', p.F)], dato('k', p.k)), igual(valor), dato('x', valor, unidad)]));
        agregar('signo', -valor, 'signo cambiado', 'ubicas el bloque en el sentido de la fuerza');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'despejas usando dos veces la fuerza dada');
        agregar('mitad', valor / 2, 'duplicas la rigidez', 'usas dos veces la constante elástica'); break;
      case 'aceleracion-cm':
      case 'aceleracion-gramos': {
        const masa = p.m ?? p.gramos / 1000, x = p.xcm / 100;
        valor = -p.k * x / masa;
        enunciado = ['Un bloque de ', dato('m', p.m ?? p.gramos, p.m != null ? 'kg' : 'g'), ' está unido a un resorte de ', dato('k', p.k, 'N/m'), '. Con una elongación de ', dato('x', p.xcm, 'cm'), ', ¿cuál es su aceleración?'];
        const conversion = [S.x, ' = ', frac(dato('x', p.xcm), '100'), ' = ', dato('x', x, 'm')];
        if (p.gramos != null) conversion.push('   ;   ', S.m, ' = ', frac(dato('m', p.gramos), '1000'), ' = ', dato('m', masa, 'kg'));
        cuentas.push(paso('Usamos metros y kilogramos porque la constante elástica está en newtons por metro y la fuerza se relaciona con la masa en kilogramos. Así las unidades son compatibles.', conversion));
        cuentas.push(paso('La fuerza del resorte se obtiene con la elongación; dividida entre la masa da la aceleración. El signo del resultado indica hacia qué lado cambia la velocidad.', [S.a, ' = ', frac(['−', dato('k', p.k), ' · ', par('x', x)], dato('m', masa)), igual(valor), dato('a', valor, unidad)]));
        agregar('signo', -valor, 'signo cambiado', 'haces que la aceleración se aleje del equilibrio');
        agregar('sin-masa', -p.k * x, 'omites la masa', 'das la fuerza como si fuera aceleración');
        agregar('producto', -p.k * x * masa, 'multiplicas por masa', 'multiplicas la fuerza por la masa');
        agregar('cm-diez', 10 * valor, 'conviertes entre diez', 'divides los centímetros entre diez y no entre cien');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'cuentas dos veces la fuerza del resorte'); break;
      }
      case 'masa': {
        const fuerza = -p.k * p.xcm / 100; valor = fuerza / p.a; clave = 'm'; unidad = 'kg';
        enunciado = ['Un resorte de ', dato('k', p.k, 'N/m'), ' acelera al bloque a ', dato('a', p.a, 'm/s²'), ' cuando tiene una elongación de ', dato('x', p.xcm, 'cm'), '. ¿Cuál es la masa del bloque?'];
        cuentas.push(paso('Convertimos la elongación a metros para usar la constante elástica. La fuerza calculada apunta al equilibrio; ese es también el sentido de la aceleración dada.', [S.F, ' = −', dato('k', p.k), ' · ', frac(par('x', p.xcm), '100'), igual(fuerza), dato('F', fuerza, 'N')]));
        cuentas.push(paso('La fuerza neta es masa por aceleración. Dividimos entre la aceleración para despejar la masa; como fuerza y aceleración tienen el mismo signo, la masa resulta positiva.', [S.m, ' = ', frac(S.F, S.a), ' = ', frac(par('F', fuerza), par('a', p.a)), igual(valor), dato('m', valor, unidad)]));
        agregar('signo', -valor, 'masa negativa', 'cambias solo uno de los signos de la división');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'cuentas dos veces la fuerza del resorte');
        agregar('mitad', valor / 2, 'duplicas la aceleración', 'divides entre dos veces la aceleración dada'); break;
      }
      case 'comparacion':
        valor = p.a1 * p.x2cm / p.x1cm;
        enunciado = ['En un mismo MAS, una aceleración de ', dato('a', p.a1, 'm/s²'), ' corresponde a una elongación de ', dato('x', p.x1cm, 'cm'), '. ¿Qué aceleración tiene con una elongación de ', dato('x', p.x2cm, 'cm'), '?'];
        regla = [frac(a2, a1), ' = ', frac(x2, x1)];
        cuentas.push(paso('Con el mismo bloque y resorte, la fuerza y la aceleración cambian en la misma proporción que la elongación. Por eso podemos comparar los estados sin hallar la rigidez ni la masa.', [a2, ' = ', a1, ' · ', frac(x2, x1)]));
        cuentas.push(paso('La razón de elongaciones dice cuánto cambia la separación y si cambia el lado. Al multiplicarla por la aceleración inicial obtenemos el nuevo tamaño y sentido de la aceleración.', [a2, ' = ', par('a', p.a1), ' · ', frac(par('x', p.x2cm), par('x', p.x1cm)), igual(valor), dato('a', valor, unidad)]));
        agregar('signo', -valor, 'signo cambiado', 'cambias el signo de la aceleración calculada');
        agregar('sin-cambio', p.a1, 'mantienes la aceleración', 'conservas la aceleración del primer estado');
        agregar('inversa', p.a1 * p.x1cm / p.x2cm, 'inviertes la razón', 'inviertes los desplazamientos en la comparación');
        agregar('cuadrado', p.a1 * (p.x2cm / p.x1cm) ** 2, 'elevas la razón', 'elevas al cuadrado la razón de posiciones'); break;
      case 'posicion-cm': {
        const fuerza = p.m * p.a; valor = -100 * fuerza / p.k; clave = 'x'; unidad = 'cm';
        enunciado = ['Un bloque de ', dato('m', p.m, 'kg'), ' y un resorte de ', dato('k', p.k, 'N/m'), ' producen una aceleración de ', dato('a', p.a, 'm/s²'), '. ¿Cuál es el desplazamiento en centímetros?'];
        cuentas.push(paso('La masa por la aceleración da la fuerza neta necesaria. Como solo actúa horizontalmente el resorte, esa debe ser también la fuerza que produce su deformación.', [S.F, ' = ', dato('m', p.m), ' · ', par('a', p.a), igual(fuerza), dato('F', fuerza, 'N')]));
        cuentas.push(paso('La fuerza dividida entre la rigidez determina la elongación en metros. El signo menos sitúa el bloque al lado contrario de la fuerza; multiplicamos por cien para expresar la distancia en centímetros.', [S.x, ' = ', frac(['−', par('F', fuerza)], dato('k', p.k)), ' · 100', igual(valor), dato('x', valor, unidad)]));
        agregar('signo', -valor, 'signo cambiado', 'ubicas el bloque en el sentido de la aceleración');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'despejas con dos veces la fuerza neta');
        agregar('mitad', valor / 2, 'duplicas la rigidez', 'usas dos veces la constante elástica'); break;
      }
      case 'calibrada': {
        const rigidez = -p.F1 * 100 / p.x1cm; valor = p.F1 * p.x2cm / (p.m * p.x1cm);
        enunciado = ['Un bloque de ', dato('m', p.m, 'kg'), ' recibe ', dato('F', p.F1, 'N'), ' en ', x1, ' = ', dato('x', p.x1cm, 'cm'), '. Con el mismo resorte, ¿qué aceleración tendrá en ', x2, ' = ', dato('x', p.x2cm, 'cm'), '?'];
        cuentas.push(paso('El primer estado muestra qué fuerza corresponde a una deformación conocida. Dividir ambas, conservando el signo menos, permite hallar la rigidez del resorte que se usará en el segundo estado.', [S.k, ' = ', frac(['−', par('F', p.F1)], frac(par('x', p.x1cm), '100')), igual(rigidez), dato('k', rigidez, 'N/m')]));
        cuentas.push(paso('El resorte conserva su rigidez, pero la nueva elongación cambia la fuerza. Calculamos esa fuerza y la dividimos entre la masa para hallar la aceleración en el segundo estado.', [a2, ' = ', frac(['−', dato('k', rigidez), ' · ', frac(par('x', p.x2cm), '100')], dato('m', p.m)), igual(valor), dato('a', valor, unidad)]));
        agregar('sin-posicion', p.F1 / p.m, 'mantienes la fuerza', 'usas la fuerza del primer estado');
        agregar('signo', -valor, 'signo cambiado', 'inviertes el sentido de la aceleración');
        agregar('posicion-inversa', p.F1 * p.x1cm / (p.m * p.x2cm), 'inviertes los desplazamientos', 'inviertes la razón entre los desplazamientos');
        agregar('sin-masa', p.F1 * p.x2cm / p.x1cm, 'omites la masa', 'das la nueva fuerza como aceleración');
        agregar('producto-masa', p.F1 * p.x2cm * p.m / p.x1cm, 'multiplicas por masa', 'multiplicas por la masa en vez de dividir'); break;
      }
      case 'masa-calibrada': {
        const masa = p.F1 / p.a1; valor = -p.k * p.x2cm / (100 * masa);
        enunciado = ['Una fuerza horizontal neta de ', dato('F', p.F1, 'N'), ' acelera un bloque a ', dato('a', p.a1, 'm/s²'), '. Unido a un resorte de ', dato('k', p.k, 'N/m'), ', ¿qué aceleración tiene en ', x2, ' = ', dato('x', p.x2cm, 'cm'), '?'];
        cuentas.push(paso('La primera fuerza neta y la aceleración que produce permiten hallar la masa: dividimos fuerza entre aceleración. Esa masa pertenece al bloque y se conserva al unirlo al resorte.', [S.m, ' = ', frac(F1, a1), ' = ', frac(par('F', p.F1), par('a', p.a1)), igual(masa), dato('m', masa, 'kg')]));
        cuentas.push(paso('El segundo ensayo conserva la masa, pero ahora la fuerza depende de la deformación del resorte. Calculamos esa nueva fuerza y la dividimos entre la masa que acabamos de hallar.', [a2, ' = ', frac(['−', dato('k', p.k), ' · ', frac(par('x', p.x2cm), '100')], dato('m', masa)), igual(valor), dato('a', valor, unidad)]));
        agregar('signo', -valor, 'signo cambiado', 'inviertes el sentido de la fuerza');
        agregar('sin-cambio', p.a1, 'mantienes la aceleración', 'usas la aceleración del ensayo anterior');
        agregar('masa-inversa', -p.k * p.x2cm * p.F1 / (100 * p.a1), 'inviertes la masa', 'inviertes fuerza y aceleración al hallar la masa');
        agregar('sin-masa', -p.k * p.x2cm / 100, 'omites la masa', 'das la fuerza del resorte como aceleración');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'cuentas dos veces la fuerza del resorte'); break;
      }
      case 'masa-nueva': {
        const masa = -p.k * p.x1cm / (100 * p.a1); valor = p.a1 * p.x2cm / (p.x1cm * p.factorM);
        enunciado = ['Un resorte de ', dato('k', p.k, 'N/m'), ' da ', a1, ' = ', dato('a', p.a1, 'm/s²'), ' en ', x1, ' = ', dato('x', p.x1cm, 'cm'), '. La masa se multiplica por ', dato('m', p.factorM), '. ¿Qué aceleración hay en ', x2, ' = ', dato('x', p.x2cm, 'cm'), '?'];
        cuentas.push(paso('La elongación y la rigidez dan la fuerza del primer ensayo. Dividimos esa fuerza entre su aceleración para conocer la masa que después se va a multiplicar.', [m1, ' = ', frac(['−', dato('k', p.k), ' · ', frac(par('x', p.x1cm), '100')], par('a', p.a1)), igual(masa), dato('m', masa, 'kg')]));
        cuentas.push(paso('La nueva elongación fija la fuerza del resorte. La dividimos entre la masa ya multiplicada: aumentar la masa reduce la aceleración producida por una misma fuerza.', [a2, ' = ', frac(['−', dato('k', p.k), ' · ', frac(par('x', p.x2cm), '100')], [dato('m', p.factorM), ' · ', dato('m', masa)]), igual(valor), dato('a', valor, unidad)]));
        agregar('sin-masa-nueva', p.a1 * p.x2cm / p.x1cm, 'ignoras masa nueva', 'conservas la masa del primer ensayo');
        agregar('masa-directa', p.a1 * p.x2cm * p.factorM / p.x1cm, 'masa directamente proporcional', 'multiplicas por el cambio de masa');
        agregar('sin-posicion', p.a1 / p.factorM, 'ignoras posición nueva', 'conservas el desplazamiento del primer ensayo');
        agregar('posicion-inversa', p.a1 * p.x1cm / (p.x2cm * p.factorM), 'inviertes los desplazamientos', 'inviertes la razón de posiciones');
        agregar('signo', -valor, 'signo cambiado', 'inviertes el sentido de la aceleración'); break;
      }
      case 'rigidez-nueva': {
        const primero = -100 * p.m * p.a1 / p.k1; valor = primero / p.factorK; clave = 'x'; unidad = 'cm';
        enunciado = ['Un bloque de ', dato('m', p.m, 'kg'), ' acelera a ', dato('a', p.a1, 'm/s²'), ' con rigidez ', dato('k', p.k1, 'N/m'), '. La rigidez se multiplica por ', dato('k', p.factorK), '. ¿Qué desplazamiento mantiene esa aceleración?'];
        cuentas.push(paso('Para la masa y la aceleración dadas necesitamos una fuerza determinada. Dividirla entre la primera rigidez, con el signo contrario, permite hallar la elongación del primer resorte.', [x1, ' = ', frac(['−', dato('m', p.m), ' · ', par('a', p.a1)], dato('k', p.k1)), ' · 100', igual(primero), dato('x', primero, 'cm')]));
        cuentas.push(paso('Mantener masa y aceleración exige la misma fuerza. El nuevo resorte es más rígido, así que necesita menos deformación: dividimos la elongación anterior entre el factor de rigidez.', [x2, ' = ', frac(['−100 · ', dato('m', p.m), ' · ', par('a', p.a1)], [dato('k', p.k1), ' · ', dato('k', p.factorK)]), igual(valor), dato('x', valor, unidad)]));
        agregar('sin-rigidez', primero, 'mantienes el desplazamiento', 'ignoras el cambio de rigidez');
        agregar('rigidez-directa', primero * p.factorK, 'multiplicas por rigidez', 'multiplicas en vez de dividir por el cambio');
        agregar('signo', -valor, 'signo cambiado', 'ubicas el bloque en el sentido de la aceleración');
        agregar('masa-inversa', -100 * p.a1 / (p.m * p.k1 * p.factorK), 'inviertes la masa', 'divides entre la masa al hallar la fuerza');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'usas dos veces la fuerza requerida'); break;
      }
      case 'dos-masas': {
        const rigidez = -100 * p.m1 * p.a1 / p.x1cm; valor = p.a1 * p.m1 * p.x2cm / (p.m2 * p.x1cm);
        enunciado = ['Con ', dato('m', p.m1, 'kg'), ', un resorte da ', dato('a', p.a1, 'm/s²'), ' para una elongación de ', dato('x', p.x1cm, 'cm'), '. Se coloca otro bloque de ', dato('m', p.m2, 'kg'), '. ¿Qué aceleración tiene con una elongación de ', dato('x', p.x2cm, 'cm'), '?'];
        cuentas.push(paso('Con la primera masa y aceleración hallamos la fuerza. Como también conocemos la elongación, podemos obtener la rigidez del resorte; esa propiedad se conserva al cambiar el bloque.', [S.k, ' = ', frac(['−', dato('m', p.m1), ' · ', par('a', p.a1)], frac(par('x', p.x1cm), '100')), igual(rigidez), dato('k', rigidez, 'N/m')]));
        cuentas.push(paso('La segunda elongación determina la nueva fuerza del mismo resorte. Para hallar la aceleración del segundo bloque dividimos entre su propia masa, porque ya no es la del primero.', [a2, ' = ', frac(['−', dato('k', rigidez), ' · ', frac(par('x', p.x2cm), '100')], dato('m', p.m2)), igual(valor), dato('a', valor, unidad)]));
        agregar('sin-masas', p.a1 * p.x2cm / p.x1cm, 'ignoras las masas', 'tratas los dos bloques como si tuvieran igual masa');
        agregar('masas-inversas', p.a1 * p.m2 * p.x2cm / (p.m1 * p.x1cm), 'inviertes las masas', 'inviertes la razón entre las masas');
        agregar('sin-posicion', p.a1 * p.m1 / p.m2, 'ignoras posición nueva', 'mantienes la posición del primer ensayo');
        agregar('posicion-inversa', p.a1 * p.m1 * p.x1cm / (p.m2 * p.x2cm), 'inviertes los desplazamientos', 'inviertes la razón de posiciones');
        agregar('signo', -valor, 'signo cambiado', 'inviertes el sentido de la aceleración'); break;
      }
      default: throw new Error('Caso de aceleración desconocido: ' + tipo);
      }
      const fmt = n => `${exacto(n) ? '' : '≈ '}${['a', 'F', 'x'].includes(clave) ? signo(n) : ''}${f(n, 3)} ${unidad}`;
      const elegidos = [], vistos = new Set([fmt(valor)]), limite = avanzados.has(tipo) ? 4 : 3;
      for (const e of malos) {
        if (!Number.isFinite(e.valor) || Math.abs(e.valor - valor) < 1e-9 || vistos.has(fmt(e.valor))) continue;
        const escala = Math.abs(e.valor / valor); if (escala > 20 || escala < 0.05) continue;
        const pistas = {
          signo: clave === 'm' || clave === 'k' ? 'La masa y la rigidez son positivas; conserva los signos de fuerza y elongación.' : 'La fuerza y la aceleración apuntan al equilibrio; la elongación lleva el signo contrario.',
          doble: 'Usa una sola vez la fuerza indicada para este bloque.',
          media: 'Se pide la fuerza en este instante, sin promediarla con otro estado.',
          mitad: 'Usa el dato indicado, sin duplicarlo antes de dividir.',
          producto: 'La aceleración se obtiene dividiendo la fuerza entre la masa.',
          'producto-masa': 'La aceleración se obtiene dividiendo la fuerza entre la masa.',
          'sin-masa': 'Fuerza y aceleración son magnitudes distintas: falta dividir entre la masa.',
          'cm-diez': 'Cada metro contiene cien centímetros; esa es la conversión que corresponde.',
          'sin-cambio': 'La aceleración depende de la fuerza y la masa del estado que se pregunta.',
          inversa: 'Compara la nueva elongación con la anterior, conservando ese orden.',
          cuadrado: 'La aceleración cambia en proporción directa a la elongación, sin elevar la razón al cuadrado.',
          'sin-posicion': 'La fuerza del resorte depende de la elongación del estado que se pregunta.',
          'posicion-inversa': 'Compara la nueva elongación con la anterior, conservando ese orden.',
          'masa-inversa': 'La segunda ley es fuerza igual a masa por aceleración; despeja respetando esa relación.',
          'sin-masa-nueva': 'La aceleración del segundo ensayo se calcula con su nueva masa.',
          'masa-directa': 'Para una misma fuerza, aumentar la masa reduce la aceleración.',
          'sin-rigidez': 'Para mantener la misma fuerza con mayor rigidez hace falta menor deformación.',
          'rigidez-directa': 'Para mantener la misma fuerza con mayor rigidez hace falta menor deformación.',
          'sin-masas': 'Cada aceleración se obtiene dividiendo su fuerza entre la masa de ese bloque.',
          'masas-inversas': 'La masa nueva va en el denominador, porque la fuerza se divide entre ella.',
        };
        vistos.add(fmt(e.valor)); elegidos.push({ ...e, error: `OS-ACEL-${tipo}-${e.op}`, siFuera: `Si ${e.motivo}, sale ${fmt(e.valor)}. ${pistas[e.op]}` });
        if (elegidos.length === limite) break;
      }
      if (elegidos.length !== limite) throw new Error('Faltan distractores: ' + tipo + ' ' + JSON.stringify(p));
      let dibujo;
      if (tipo === 'comparacion') dibujo = dosEstados({ xcm: p.x1cm, a: p.a1 }, { xcm: p.x2cm });
      else {
        const xx = p.xcm ?? p.x2cm ?? (p.x != null ? 100 * p.x : null);
        const rotulos = [], campos = [['m', 'kg'], ['k', 'N/m'], ['F', 'N'], ['a', 'm/s²']];
        for (const [c, u] of campos) if (p[c] != null) rotulos.push({ x: 45, y: 45 + 17 * rotulos.length, texto: `${c} = ${f(p[c], 3)} ${u}`, color: COLORES[c] });
        const datos = carrito(xx ?? 0, { rotuloX: xx != null ? undefined : false, textos: rotulos, alt: 'El bloque y el resorte del problema. Solo se rotulan cantidades dadas; la magnitud pedida no está dibujada.' });
        if (xx == null) {
          datos.lineas = []; datos.textos = datos.textos.filter(t => t.texto !== 'Equilibrio');
          datos.textos.push({ x: 160, y: 208, texto: 'Esquema sin escala; posición desconocida', ancla: 'middle' });
        }
        dibujo = est(datos);
      }
      const nombres = { k: ['k', 'N/m'], k1: ['k', 'N/m'], m: ['m', 'kg'], m1: ['m', 'kg'], m2: ['m', 'kg'], gramos: ['m', 'g'],
        F: ['F', 'N'], F1: ['F', 'N'], a: ['a', 'm/s²'], a1: ['a', 'm/s²'], x: ['x', 'm'], xcm: ['x', 'cm'], x1cm: ['x', 'cm'], x2cm: ['x', 'cm'], factorK: ['k', ''], factorM: ['m', ''] };
      const etiquetas = { k: 'constante elástica', m: 'masa', F: 'fuerza neta', a: 'aceleración', x: 'elongación', xcm: 'elongación', k1: 'rigidez inicial', m1: 'primera masa', m2: 'segunda masa', F1: 'primera fuerza', a1: 'primera aceleración', x1cm: 'primera posición', x2cm: 'segunda posición', factorK: 'factor de rigidez', factorM: 'factor de masa', gramos: 'masa' };
      const tengo = Object.entries(p).flatMap(([n, v], j) => [j ? '; ' : '', `${etiquetas[n] || n}: `, numero(nombres[n][0], v, nombres[n][1])]);
      const sentido = clave === 'm' || clave === 'k' ? 'La masa y la constante elástica resultan positivas: describen propiedades del bloque y del resorte. Los signos de fuerza y elongación indicaban sentidos y se conservaron al despejar.' : clave === 'x' ? 'El signo de la elongación ubica el bloque al lado contrario de la fuerza recuperadora. Así, el resorte acelera al bloque hacia el equilibrio, aunque en ese instante pueda moverse en otro sentido.' : 'El signo del resultado indica hacia dónde actúa la fuerza y cambia la velocidad: hacia el equilibrio. No indica hacia dónde se está moviendo el bloque; para eso habría que conocer su velocidad.';
      return { enunciado, datos: d, dibujo, pide: `Se pide ${({ a: 'la aceleración con signo', F: 'la fuerza con signo', k: 'la constante elástica', m: 'la masa del bloque', x: 'el desplazamiento con signo' })[clave]}.`,
        tengo, regla: paso(tipo === 'comparacion' ? 'La masa y la rigidez son las mismas: al comparar estados, la aceleración cambia como la elongación.' : tipo === 'aceleracion' ? 'La segunda ley dice que la fuerza neta es masa por aceleración. Despejamos la aceleración dividiendo entre la masa.' : 'La deformación fija la fuerza del resorte; la segunda ley relaciona esa fuerza con la masa y la aceleración. Usamos los datos conocidos para hallar lo que falta.', regla), cuentas, sentido,
        respuesta: [V(clave, fmt(valor))], opciones: opciones(valor, elegidos, fmt), caso: { tipo, ...p, valor, unidad, errores: elegidos.map(e => ({ id: e.error, valor: e.valor })) },
        erroresEjemplo: elegidos.map(e => {
          const resumen = {
            'sin-posicion': 'mantienes la posición anterior', signo: 'inviertes el sentido', 'posicion-inversa': 'inviertes la razón de elongaciones', 'sin-masa': 'omites dividir entre la masa',
            'sin-cambio': 'conservas la aceleración anterior', 'masa-inversa': tipo === 'rigidez-nueva' ? 'divides para hallar la fuerza' : 'inviertes el despeje de masa', 'sin-masa-nueva': 'conservas la masa anterior', 'masa-directa': 'multiplicas por el factor de masa',
            'sin-rigidez': 'ignoras la nueva rigidez', 'rigidez-directa': 'multiplicas por el factor de rigidez', 'sin-masas': 'supones masas iguales', 'masas-inversas': 'inviertes la razón de masas',
          };
          return `${fmt(e.valor)} sale si ${resumen[e.op] || e.corta}.`;
        }).join(' ') + (elegidos.some(e => e.op === 'signo') ? ' La fuerza apunta al equilibrio.' : '') };
    }

    // Quince entradas originales; el oráculo independiente conserva sus esperados.
    const banco = [
      ['fuerza', { k: 60, x: -0.05 }, 'El resorte comprimido'],
      ['aceleracion', { F: -1.5, m: 0.5 }, 'Fuerza y masa'],
      ['rigidez', { F: -2.4, x: 0.08 }, 'Reconstruir la rigidez'],
      ['posicion', { F: 3.6, k: 40 }, 'Ubicar el bloque'],
      ['fuerza', { k: 25, x: 0.12 }, 'El resorte estirado'],
      ['aceleracion-cm', { k: 30, m: 0.4, xcm: 8 }, 'Centímetros antes de calcular'],
      ['aceleracion-gramos', { k: 24, gramos: 600, xcm: -5 }, 'Una masa en gramos'],
      ['masa', { k: 50, xcm: 6, a: -4 }, 'La masa desconocida'],
      ['comparacion', { a1: -2, x1cm: 4, x2cm: -10 }, 'Dos lados del equilibrio'],
      ['posicion-cm', { k: 60, m: 0.75, a: 4 }, 'Un desplazamiento en centímetros'],
      ['calibrada', { F1: -2.4, x1cm: 4, x2cm: -6, m: 0.75 }, 'Otro punto del mismo resorte'],
      ['masa-calibrada', { F1: 1.5, a1: 2, k: 45, x2cm: -8 }, 'Dos ensayos con el bloque'],
      ['masa-nueva', { k: 50, x1cm: 4, a1: -4, x2cm: -12, factorM: 3 }, 'Cambiar masa y posición'],
      ['rigidez-nueva', { k1: 20, m: 0.4, a1: -6, factorK: 3 }, 'La misma aceleración'],
      ['dos-masas', { m1: 0.4, x1cm: 5, a1: -5, m2: 0.8, x2cm: -12 }, 'Un bloque diferente'],
    ];
    const ejemplos = banco.map(([tipo, p, titulo], i) => ejemplo(caso(tipo, p), 1 + Math.floor(i / 5), titulo, i - 10));
    function generar(s, res) {
      const n = 1 + Math.floor(s / 5) % 8, signoX = s % 2 ? -1 : 1;
      if (res) {
        if (s % 5 === 0) return caso('aceleracion-cm', { k: 16 + 4 * n, m: 0.5, xcm: signoX * (n + 2) });
        if (s % 5 === 1) return caso('masa', { k: 16 + 8 * n, xcm: signoX * 5, a: -signoX * (2 + n) });
        if (s % 5 === 2) return caso('calibrada', { F1: -0.6 * (n + 1), x1cm: 3, x2cm: -9, m: 0.5 });
        if (s % 5 === 3) return caso('rigidez-nueva', { k1: 15 + 5 * n, m: 0.75, a1: -2 * (n + 1), factorK: 3 });
        return caso('comparacion', { a1: -0.5 * (n + 1), x1cm: 3, x2cm: -6 });
      }
      if (s % 5 === 0) return caso('fuerza', { k: 18 + 6 * n, x: signoX * (n + 2) / 100 });
      if (s % 5 === 1) return caso('posicion-cm', { k: 30 + 10 * n, m: 0.5, a: signoX * (n + 1) });
      if (s % 5 === 2) return caso('masa-calibrada', { F1: 0.75 * (n + 2), a1: n + 2, k: 24 + 6 * n, x2cm: -7 });
      if (s % 5 === 3) return caso('masa-nueva', { k: 20 + 5 * n, x1cm: 5, a1: -0.25 * (n + 4), x2cm: -15, factorM: 2 });
      return caso('dos-masas', { m1: 0.3, x1cm: 4, a1: -0.4 * (n + 2), m2: 0.6, x2cm: -10 });
    }
    const estadoJuego = val => { const xcm = Math.round(val.x * 10) / 10, fuerza = -20 * xcm / 100; return { xcm, F: fuerza, a: fuerza / 0.5 }; };
    const vista = val => { const e = estadoJuego(val); return est(figuraFuerzas(e.xcm, { F: e.F, a: e.a, textos: [
      { x: 12, y: 44, texto: 'm = 0,5 kg', color: 'f' }, { x: 308, y: 44, texto: 'k = 20 N/m', color: 'f', ancla: 'end' },
      { x: 160, y: 208, texto: 'Instante de liberación; v = 0', color: 'o', ancla: 'middle' }
    ] })); };
    const pred = { x1: 2, a1: -3, x2: -6 }, razon = pred.x2 / pred.x1, ap = pred.a1 * razon;
    const erroresPred = [-ap, -pred.a1, -pred.a1 * razon ** 2], fmtPred = n => `${signo(n)}${f(n)} m/s²`;
    const reglaCaso = { k: 40, m: 0.5, xcm: -5 };
    const fuerzaRegla = -reglaCaso.k * reglaCaso.xcm / 100, aceleracionRegla = fuerzaRegla / reglaCaso.m;
    const antes = dosEstados({ xcm: pred.x1, a: pred.a1 }, { xcm: pred.x2 });
    const despues = dosEstados({ xcm: pred.x1, a: pred.a1 }, { xcm: pred.x2, a: ap }, true);
    glosario.push(
      { termino: 'movimiento armónico simple', formas: ['movimiento armónico simple', 'MAS'], simple: 'Un vaivén ideal, como el de un bloque que oscila unido a un resorte.',
        def: 'Movimiento oscilatorio rectilíneo ideal que relaciona posición, velocidad y aceleración.',
        ejemplos: ['Un carro unido a un resorte ideal oscila sobre una mesa sin roce.', 'El modelo describe estados a la izquierda y a la derecha del equilibrio.', 'La posición, la velocidad y la aceleración describen aspectos distintos del mismo movimiento.'] },
      { termino: 'fuerza recuperadora', formas: ['fuerza recuperadora', 'fuerza restauradora'], simple: 'Lo que tira o empuja hacia el centro, como un resorte.',
        def: 'Fuerza del sistema que tiende a devolver el objeto hacia su posición de equilibrio.',
        ejemplos: ['Un resorte estirado jala el bloque.', 'Un resorte comprimido empuja el bloque.', 'La fuerza de una mano que sostiene el bloque no es la fuerza recuperadora del resorte.'] },
      { termino: 'elongación', formas: ['elongación', 'elongaciones'], simbolo: 'x', medida: 'm', simple: 'Lo separado que está el bloque del centro, indicando hacia qué lado.',
        def: 'Desplazamiento del objeto desde la posición de equilibrio. En una recta se expresa mediante una componente con signo.',
        ejemplos: ['Con la derecha positiva, una elongación de +4 cm queda a la derecha.', 'Una elongación de -7 cm ubica el objeto a la izquierda del equilibrio.', 'Una elongación nula indica que el objeto está en el equilibrio.'] },
    );
    return {
      id: 'aceleracion-al-centro', titulo: 'El empuje del resorte', pregunta: '¿Cómo relacionamos posición, fuerza y aceleración?', temas: ['Ecuaciones y gráficas del MAS', 'Masa-resorte horizontal y vertical'], pieza: 'fis-estatica',
      aprendizaje: 'Relaciono el desplazamiento con fuerza y aceleración; conservo los signos y distingo acelerar de moverse.',
      actividad: 'Elegir desde dónde soltar el bloque y comparar su aceleración inicial.',
      lee: { tarjetas: [
        { titulo: 'Un bloque y un resorte', texto: ['Un bloque unido a un resorte se mueve sobre una mesa sin roce. Este vaivén ideal se estudia con el movimiento armónico simple, o MAS. Mantendremos la masa ', S.m, ' del bloque y la constante elástica ', S.k, ', que indica la rigidez del resorte: uno más rígido requiere mayor fuerza para estirarlo.'], dibujo: vista({ x: 2 }) },
        { titulo: 'Una referencia para medir', texto: ['La elongación ', S.x, ' es la separación del bloque respecto del equilibrio, con signo: positiva a la derecha y negativa a la izquierda. La fuerza recuperadora ', S.F, ' es la acción del resorte sobre el bloque. La aceleración ', S.a, ' indica cómo cambia su velocidad; su signo también distingue los dos sentidos.'] },
        { titulo: 'El instante de soltar', texto: ['Cada posición del control inicia otro ensayo: llevas el bloque hasta allí y lo sueltas sin empujarlo. La velocidad inicial ', S.v, ' es cero, porque aún no ha empezado a avanzar. La mano ya no actúa; las flechas muestran la fuerza del resorte y la aceleración al comenzar el movimiento.'] },
      ] }, ejemplos,
      juega: { pieza: 'fis-estatica', consigna: 'Suelta el bloque desde distintos puntos de la derecha. Compara la fuerza y la aceleración iniciales.',
        voz: 'Cada posición inicia otro ensayo; el control no representa un reloj.',
        controles: [{ id: 'x', etiqueta: 'Elongación inicial, x', min: 0, max: 8, paso: 2, inicio: 2, unidad: 'cm', decimales: 1, color: 'c-i' }],
        mision: { texto: 'Consigue una aceleración inicial de −2,4 m/s².', logrado: val => Math.abs(estadoJuego(val).a + 2.4) < 1e-9, testigo: [{ x: 6 }], bien: 'La aceleración inicial coincide con la pedida y apunta hacia el equilibrio.' },
        leyenda: [{ s: S.x, t: 'elongación con signo desde el equilibrio' }, { s: S.F, t: 'fuerza horizontal del resorte sobre el bloque' },
          { s: S.a, t: 'aceleración horizontal del bloque' }, { s: S.m, t: 'masa del bloque' }, { s: S.k, t: 'constante elástica del resorte' }, { s: S.v, t: 'velocidad horizontal en el instante de liberación' }],
        dibujo: vista, lectura: val => { const e = estadoJuego(val); return e.xcm ? ['En ', numero('x', e.xcm, 'cm'), ', ', S.a, ' = ', numero('a', e.a, 'm/s²'), ', hacia el equilibrio.'] : ['En el equilibrio, la fuerza y la aceleración iniciales son nulas.']; }, minimo: 2 },
      predice: { pregunta: ['En el mismo MAS, ', S.a, ' = ', numero('a', pred.a1, 'm/s²'), ' cuando ', S.x, ' = ', numero('x', pred.x1, 'cm'), '. ¿Qué aceleración corresponde a ', S.x, ' = ', numero('x', pred.x2, 'cm'), '?'],
        datos: ['La masa y la constante elástica no cambian.', 'La derecha es positiva.'], dibujo: antes, revelar: despues,
        opciones: opciones(ap, [
          { valor: erroresPred[0], error: 'OS-ACEL-PRED-SIGNO', siFuera: `Has triplicado la aceleración, pero conservaste el sentido anterior: así sale ${fmtPred(erroresPred[0])}. El bloque ahora está al otro lado; para apuntar al equilibrio, la aceleración también debe cambiar de sentido.` },
          { valor: erroresPred[1], error: 'OS-ACEL-PRED-MODULO', siFuera: `Has cambiado el sentido y conservado el tamaño anterior: así sale ${fmtPred(erroresPred[1])}. La separación al equilibrio también aumentó; con el mismo resorte y bloque, la aceleración aumenta en esa misma proporción.` },
          { valor: erroresPred[2], error: 'OS-ACEL-PRED-CUADRADO', siFuera: `Has cambiado de sentido, pero elevaste al cuadrado el factor de separación: así sale ${fmtPred(erroresPred[2])}. La aceleración crece en proporción directa a la elongación; el factor se usa una sola vez.` }
        ], fmtPred), coincide: 'Cambia el lado y se triplica la separación; la aceleración cambia de signo y triplica su módulo.' },
      mira: { pieza: 'fis-estatica', datos: despues.datos, pasos: [
        paso('Si el bloque se aleja del equilibrio, deforma el resorte. El resorte tira o empuja hacia ese equilibrio; por eso su fuerza lleva el signo contrario a la elongación.', [S.F, ' = −', S.k, ' · ', S.x]),
        paso('La segunda ley dice que la fuerza neta es masa por aceleración. Como la masa es positiva, dividir la fuerza entre ella conserva su sentido y da la aceleración.', [S.a, ' = ', frac(S.F, S.m), ' = −', frac(S.k, S.m), ' · ', S.x]),
        paso('La masa y la rigidez no cambian. Por eso la aceleración cambia en la misma proporción que la elongación: comparar las dos posiciones permite comparar las dos aceleraciones.', [frac(a2, a1), ' = ', frac(x2, x1)]),
        paso('La nueva elongación tiene el triple de tamaño y signo contrario. Su razón es negativa porque el bloque pasó al otro lado del equilibrio.', [frac(x2, x1), ' = ', frac(numero('x', pred.x2), numero('x', pred.x1)), ' = ', numero('x', razon)]),
        paso('Multiplicamos la primera aceleración por la razón de elongaciones. El resultado cambia de signo y triplica su tamaño: ahora apunta a la derecha, hacia el equilibrio.', [a2, ' = (', numero('a', pred.a1), ') · (', numero('x', razon), ') = ', numero('a', ap, 'm/s²')]),
        paso('En el centro, el resorte no está deformado y su fuerza es cero. La aceleración nula no borra la velocidad que el bloque ya traía, así que puede seguir pasando.', [S.x, ' = 0: ', S.F, ' = 0; ', S.a, ' = 0']),
        paso('En un extremo, el bloque se detiene un instante para cambiar de sentido. Allí la deformación es máxima, por eso la fuerza del resorte tiene su mayor tamaño.', [S.x, ' = ±', S.A, ': ', S.v, ' = 0; |', S.F, '| = ', S.k, ' · ', S.A]),
      ] },
      regla: { texto: 'La elongación indica cuánto se separa el bloque del equilibrio, con signo. La constante elástica expresa la rigidez: cuanto más se deforma el resorte, mayor fuerza ejerce. El signo menos indica que intenta devolverlo al equilibrio. Dividimos esa fuerza entre la masa para obtener la aceleración: si está a la izquierda, acelera hacia la derecha.',
        ecuacion: [S.F, ' = −', S.k, ' · ', S.x, '   ;   ', S.a, ' = ', frac(S.F, S.m), ' = −', frac(S.k, S.m), ' · ', S.x],
        condicion: 'el resorte es horizontal e ideal, el bloque mantiene su masa y no hay rozamiento. La elongación se mide desde el equilibrio. Si aparece roce, hay que incluir su fuerza: el resorte ya no aporta toda la fuerza neta.',
        dibujo: est(figuraFuerzas(reglaCaso.xcm, { F: fuerzaRegla, a: aceleracionRegla, textos: [{ x: 12, y: 44, texto: `k = ${f(reglaCaso.k)} N/m`, color: 'f' }, { x: 308, y: 44, texto: `m = ${f(reglaCaso.m)} kg`, color: 'f', ancla: 'end' }] })) },
      resuelve: { pieza: 'fis-estatica', generar: s => resuelto(generar(s, true)) },
      ahoraTu: { pieza: 'fis-estatica', generar: s => pregunta(generar(s, false)) },
    };
  })();

  const idea3 = (() => {
    // Los resultados conservan fracciones, pi y raíces; el valor numérico solo compara y dibuja.
    const mcd = (a, b) => b ? mcd(b, a % b) : Math.abs(a);
    const ex = (n, d = 1, p = 0, r = 1) => {
      if (!n) return { n: 0, d: 1, p: 0, r: 1 };
      const g = mcd(n, d); return { n: n / g, d: d / g, p, r };
    };
    const num = z => z.n / z.d * Math.PI ** z.p * Math.sqrt(z.r);
    const por = (z, n, d = 1, p = 0) => ex(z.n * n, z.d * d, z.p + p, z.r);
    const cos = q => ({ 0: ex(1), 2: ex(1, 2, 0, 3), 3: ex(1, 2, 0, 2), 4: ex(1, 2), 6: ex(0), 8: ex(-1, 2), 9: ex(-1, 2, 0, 2), 10: ex(-1, 2, 0, 3), 12: ex(-1), 14: ex(-1, 2, 0, 3), 15: ex(-1, 2, 0, 2), 16: ex(-1, 2), 18: ex(0), 20: ex(1, 2), 21: ex(1, 2, 0, 2), 22: ex(1, 2, 0, 3) })[((q % 24) + 24) % 24];
    const sen = q => cos(q - 6);
    const exacto = z => {
      if (!z.n) return '0';
      const signo = z.n < 0 ? '−' : '', nn = Math.abs(z.n);
      const simbolos = `${z.p ? z.p === 1 ? 'π' : 'π²' : ''}${z.r === 1 ? '' : `√${z.r}`}`;
      return `${signo}${nn === 1 && simbolos ? '' : nn}${simbolos}${z.d === 1 ? '' : `/${z.d}`}`;
    };
    const nodo = (clave, z, unidad = '') => {
      const n = Math.abs(z.n), tieneSimbolo = z.p || z.r !== 1;
      const arriba = [z.n < 0 ? '−' : '', ...(n !== 1 || !tieneSimbolo ? [V(clave, n)] : []),
        ...(z.p ? [z.p === 1 ? V(clave, 'π') : sup(V(clave, 'π'))] : []), ...(z.r !== 1 ? [raiz(V(clave, z.r))] : [])];
      return [...(z.d === 1 ? arriba : [frac(arriba, V(clave, z.d))]), ...(unidad ? [` ${unidad}`] : [])];
    };
    const fase = q => nodo('phi', ex(q, 12, 1), 'rad');
    const datosComunes = ['El movimiento es armónico simple y mantiene su amplitud.', 'El equilibrio es x = 0; la derecha es positiva.'];
    const formulas = {
      omega: [S.omega, ' = ', frac(['2π'], S.T)],
      x: [S.x, ' = ', S.A, ' cos(', S.omega, S.t, ' + ', S.phi, ')'],
      v: [S.v, ' = −', S.A, S.omega, ' sen(', S.omega, S.t, ' + ', S.phi, ')'],
      a: [S.a, ' = −', sup(S.omega), S.x],
    };
    const grafica = (clave, A, T, phi = 0, marca) => ejes({
      x: { min: 0, max: T, paso: T / 4, cada: 1, nombre: 't', unidad: 's', color: 'h', decimales: 1 },
      y: { min: -A, max: A, paso: A / 2, cada: 1, nombre: clave, unidad: clave === 'x' ? 'cm' : clave === 'v' ? 'cm/s' : 'cm/s²', color: COLORES[clave], decimales: 1 },
      curvas: [{ puntos: Array.from({ length: 121 }, (_, j) => { const t = T * j / 120; return [t, A * Math.cos(2 * Math.PI * t / T + phi)]; }), color: COLORES[clave] }],
      puntos: marca === undefined ? [] : [{ x: marca, y: A * Math.cos(2 * Math.PI * marca / T + phi), color: COLORES[clave], guias: true }], ajustado: true,
    });
    const esquema = (p, xx = 10, sentido = 0) => {
      const d = carrito(xx, { rotuloX: false, textos: [{ x: 160, y: 208, texto: 'Estado inicial; dibujo sin escala', ancla: 'middle' }],
        alt: `El bloque empieza ${xx < 0 ? 'a la izquierda del equilibrio' : xx > 0 ? 'a la derecha del equilibrio' : 'en el equilibrio'}${sentido ? sentido > 0 ? ', hacia la derecha' : ', hacia la izquierda' : ', en reposo'}. El dibujo no está a escala.` });
      if (sentido) d.flechas.push({ de: [178 + 4 * xx, 60], ang: sentido > 0 ? 0 : 180, largo: 30, color: 'o', texto: sentido > 0 ? 'v > 0' : 'v < 0', rumbo: [0, -1] });
      else d.textos.push({ x: 160, y: 54, texto: 'v = 0', color: 'o', ancla: 'middle' });
      return est(d);
    };
    function caso(tipo, p) {
      let valor, clave, unidad, enunciado, regla, cuenta1, cuenta2, sentido, errores, dibujo, datos = datosComunes.slice();
      const error = (z, causa, codigo) => ({ z, causa, codigo });
      const magnitud = (k, z, u) => [...nodo(k, z, u)];
      const conocido = (...partes) => partes;
      switch (tipo) {
        case 'omega-periodo':
          valor = ex(2, p.T, 1); clave = 'omega'; unidad = 'rad/s';
          enunciado = ['Un bloque completa cada ciclo en ', Q('T', p.T, 's'), '. ¿Cuál es su frecuencia angular?'];
          regla = paso('La fase indica cuánto avanzó el ciclo. Una vuelta completa equivale a dos pi radianes; por eso dividimos ese avance entre la duración del ciclo.', formulas.omega);
          cuenta1 = paso('Dividimos los radianes de un ciclo entre los segundos que dura. El cociente dice cuánto avanza la fase en cada segundo.', [S.omega, ' = ', frac('2π rad', Q('T', p.T, 's')), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'El resultado indica los radianes que avanza la fase en cada segundo. Contar ciclos por segundo daría la frecuencia; para la frecuencia angular, cada ciclo cuenta como una vuelta de fase.';
          errores = [error(ex(1, p.T), 'contar ciclos', 'FRECUENCIA'), error(ex(1, p.T, 1), 'usar media vuelta', 'MEDIA'), error(ex(2 * p.T, 1, 1), 'multiplicar el período', 'MULTIPLICA')];
          dibujo = esquema(p); break;
        case 'x-fase':
          valor = por(cos(p.q), p.A); clave = 'x'; unidad = 'cm';
          enunciado = ['Un bloque tiene amplitud ', Q('A', p.A, 'cm'), ' y fase actual ', ...fase(p.q), '. ¿Cuál es su posición?'];
          datos.push(['cos(', ...fase(p.q), ') = ', ...nodo('phi', cos(p.q))]);
          regla = paso('El coseno indica qué fracción de la amplitud corresponde a la posición, con su signo. Por eso multiplicamos esa fracción por la amplitud.', formulas.x);
          cuenta1 = paso('Multiplicamos la amplitud por el coseno dado. Así obtenemos la posición de este instante, no la mayor distancia que alcanza el bloque.', [S.x, ' = ', Q('A', p.A, 'cm'), ' × ', ...nodo('phi', cos(p.q)), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'El resultado positivo sitúa al bloque a la derecha del equilibrio. Su distancia al centro es menor que la amplitud porque el coseno de esta fase es menor que uno.';
          errores = [error(por(valor, -1), 'invertir el signo', 'SIGNO'), error(ex(p.A), 'dar la amplitud', 'AMPLITUD'), error(ex(0), 'suponer el centro', 'CENTRO')];
          dibujo = esquema(p, 6, -1); dibujo.datos.alt = 'En el instante indicado, el bloque está a la derecha del equilibrio y se mueve hacia la izquierda. El dibujo no está a escala.'; dibujo.datos.textos.find(x => x.texto === 'Estado inicial; dibujo sin escala').texto = 'Instante indicado; dibujo sin escala'; break;
        case 'v-fase':
          valor = por(sen(p.q), -p.A * p.w); clave = 'v'; unidad = 'cm/s';
          enunciado = ['Un bloque tiene ', S.A, ' = ', Q('A', p.A, 'cm'), ', ', S.omega, ' = ', Q('omega', p.w, 'rad/s'), ' y fase actual ', ...fase(p.q), '. ¿Cuál es su velocidad?'];
          datos.push(['sen(', ...fase(p.q), ') = ', ...nodo('phi', sen(p.q))]);
          regla = paso('Al avanzar la fase desde el extremo derecho, la posición empieza a disminuir. Por eso la velocidad lleva el signo contrario al seno de la fase.', formulas.v);
          cuenta1 = paso('Multiplicamos amplitud, frecuencia angular y seno, conservando el signo menos. El resultado negativo indica que el bloque se mueve hacia la izquierda.', [S.v, ' = −', Q('A', p.A), ' × ', Q('omega', p.w), ' × ', ...nodo('phi', sen(p.q)), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'El signo negativo significa que el bloque va hacia la izquierda. Puede estar todavía a la derecha del centro: el signo de la posición dice dónde está y el de la velocidad, hacia dónde va.';
          errores = [error(por(valor, -1), 'perder el signo', 'SIGNO'), error(ex(-p.A * p.w), 'suponer seno uno', 'MAXIMO'), error(ex(0), 'suponer un extremo', 'EXTREMO')];
          dibujo = esquema(p, 6, -1); dibujo.datos.alt = 'En el instante indicado, el bloque está a la derecha del equilibrio y se mueve hacia la izquierda. El dibujo no está a escala.'; dibujo.datos.textos.find(x => x.texto === 'Estado inicial; dibujo sin escala').texto = 'Instante indicado; dibujo sin escala'; break;
        case 'a-posicion':
          valor = ex(-(p.w ** 2) * p.x); clave = 'a'; unidad = 'cm/s²';
          enunciado = ['Un bloque tiene frecuencia angular ', S.omega, ' de ', Q('omega', p.w, 'rad/s'), ' y posición ', S.x, ' de ', Q('x', p.x, 'cm'), '. ¿Cuál es su aceleración?'];
          regla = paso('La fuerza del resorte apunta al equilibrio y crece con la separación. Por eso la aceleración es proporcional a la posición, pero tiene el signo contrario.', formulas.a);
          cuenta1 = paso('Elevamos al cuadrado la frecuencia angular y multiplicamos por la posición negativa. El signo menos de la relación vuelve positiva la aceleración: apunta hacia la derecha.', [S.a, ' = −', sup(Q('omega', p.w)), ' × (', Q('x', p.x), ') = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La aceleración positiva apunta hacia la derecha. Tiene sentido porque el bloque está a la izquierda y el resorte lo empuja hacia el equilibrio.';
          errores = [error(por(valor, -1), 'perder el signo', 'SIGNO'), error(ex(-p.w * p.x), 'omitir el cuadrado', 'CUADRADO'), error(ex(0), 'suponer equilibrio', 'CERO')];
          dibujo = est(carrito(p.x, { alt: `El bloque está en x igual a ${p.x} centímetros, a la izquierda del equilibrio.` })); break;
        case 'a-grafica':
          valor = ex(p.max); clave = 'a'; unidad = 'cm/s²';
          enunciado = ['La gráfica muestra la aceleración del bloque. ¿Qué valor tiene cuando ', S.t, ' = ', Q('t', p.T / 2, 's'), '?'];
          regla = paso('El eje vertical representa la aceleración. Para conocerla en un instante, buscamos la altura de la curva sobre ese tiempo; no necesitamos calcular una velocidad.', [S.t, ' → ', S.a]);
          cuenta1 = paso('Desde el instante pedido subimos hasta la curva y leemos su altura en el eje vertical. Está sobre el cero, así que la aceleración es positiva.', [S.t, ' = ', Q('t', p.T / 2, 's'), '   ;   ', S.a, ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La curva indica aceleración positiva, es decir, hacia la derecha. No permite concluir que la velocidad también sea positiva: acelerar indica cómo cambia la velocidad, no necesariamente hacia dónde se mueve el bloque.';
          errores = [error(ex(-p.max), 'leer el valle', 'VALLE'), error(ex(0), 'leer el eje', 'EJE'), error(ex(p.max, 2), 'leer media altura', 'MITAD')];
          dibujo = grafica('a', p.max, p.T, Math.PI); break;
        case 'x-tiempo': {
          const q = p.q0 + 24 * p.t / p.T;
          valor = por(cos(q), p.A); clave = 'x'; unidad = 'cm';
          enunciado = ['Un bloque tiene amplitud ', S.A, ' de ', Q('A', p.A, 'cm'), ', período ', S.T, ' de ', Q('T', p.T, 's'), ' y fase inicial ', S.phi, ': ', ...fase(p.q0), '. ¿Dónde está cuando ', S.t, ' vale ', Q('t', p.t, 's'), '?'];
          datos.push(['cos(', ...fase(q), ') = ', ...nodo('phi', cos(q))]);
          regla = paso('La frecuencia angular dice cuánto avanza la fase por segundo. Multiplicarla por el tiempo y sumar la fase inicial ubica el instante pedido dentro del ciclo.', [...formulas.omega, '   ;   ', ...formulas.x]);
          cuenta1 = paso('Dividimos los radianes de un ciclo entre el período. Luego multiplicamos por el tiempo y sumamos la fase inicial, porque el reloj no comenzó en el extremo derecho.', [S.omega, ' = ', ...nodo('omega', ex(2, p.T, 1), 'rad/s'), '   ;   ', S.omega, S.t, ' + ', S.phi, ' = ', ...fase(q)]);
          cuenta2 = paso('Multiplicamos la amplitud por el coseno de la fase total. Usar solo la fase inicial daría la posición de partida, no la del instante pedido.', [S.x, ' = ', Q('A', p.A, 'cm'), ' × ', ...nodo('phi', cos(q)), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La posición obtenida está a la derecha del equilibrio. Incluimos la fase inicial porque poner el reloj en cero no obliga al bloque a empezar en el extremo derecho.';
          errores = [error(por(cos(q - p.q0), p.A), 'omitir la fase inicial', 'SIN-FASE'), error(por(valor, -1), 'invertir el signo', 'SIGNO'), error(ex(p.A), 'dar la amplitud', 'AMPLITUD')];
          dibujo = esquema(p, 9, -1); break;
        }
        case 'v-tiempo': {
          const q = p.q0 + 24 * p.t / p.T;
          valor = por(sen(q), -2 * p.A, 100 * p.T, 1); clave = 'v'; unidad = 'm/s';
          enunciado = ['Un bloque tiene ', S.A, ' = ', Q('A', p.A, 'cm'), ', ', S.T, ' = ', Q('T', p.T, 's'), ' y ', S.phi, ' = ', ...fase(p.q0), '. Halla su velocidad en ', S.t, ' = ', Q('t', p.t, 's'), '.'];
          datos.push('1 m = 100 cm.', ['sen(', ...fase(q), ') = ', ...nodo('phi', sen(q))]);
          regla = paso('La velocidad depende de la fase en este instante. Sumamos el avance desde que comenzó el reloj y convertimos la amplitud a metros para responder en metros por segundo.', [...formulas.omega, '   ;   ', ...formulas.v]);
          cuenta1 = paso('Calculamos los radianes que avanza la fase por segundo. Después sumamos a la fase inicial el avance durante el tiempo indicado.', [S.omega, ' = ', ...nodo('omega', ex(2, p.T, 1), 'rad/s'), '   ;   ', S.omega, S.t, ' + ', S.phi, ' = ', ...fase(q)]);
          cuenta2 = paso('Dividimos los centímetros entre cien antes de multiplicar por la frecuencia angular y el seno. Así el resultado queda en metros por segundo, con el signo que indica el sentido.', [S.v, ' = -', ...nodo('A', ex(p.A, 100)), ' × ', ...nodo('omega', ex(2, p.T, 1)), ' × ', ...nodo('phi', sen(q)), '   ;   ', S.v, ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La velocidad negativa indica movimiento hacia la izquierda. Convertir la amplitud a metros cambia el valor numérico y su unidad, pero conserva ese sentido del movimiento.';
          errores = [error(por(valor, -1), 'perder el signo', 'SIGNO'), error(por(valor, 100), 'no convierte centímetros', 'UNIDAD'), error(ex(-2 * p.A, 100 * p.T, 1), 'suponer seno uno', 'MAXIMO')];
          dibujo = esquema(p, 9, -1); break;
        }
        case 'a-tiempo': {
          const q = p.q0 + 24 * p.fraccion;
          valor = por(cos(q), -p.A, 100); clave = 'a'; unidad = 'm/s²';
          enunciado = ['Un bloque tiene ', S.A, ' = ', Q('A', p.A, 'cm'), ', ', S.T, ' = ', ...nodo('T', ex(2, 1, 1), 's'), ' y ', S.phi, ' = ', ...fase(p.q0), '. Halla su aceleración cuando ', S.t, ' vale ', ...nodo('t', ex(2, 3, 1), 's'), '.'];
          datos.push('1 m = 100 cm.', ['cos(', ...fase(q), ') = ', ...nodo('phi', cos(q))]);
          regla = paso('Primero ubicamos el bloque mediante la fase. Después usamos que la aceleración apunta al equilibrio: tiene signo contrario a la posición y depende de su distancia al centro.', [...formulas.omega, '   ;   ', ...formulas.a]);
          cuenta1 = paso('El período permite hallar la frecuencia angular. Sumamos el avance de fase a su valor inicial y evaluamos el coseno: el bloque ha llegado al extremo izquierdo.', [S.omega, ' = ', Q('omega', 1, 'rad/s'), '   ;   ', S.omega, S.t, ' + ', S.phi, ' = ', ...fase(q), '   ;   ', S.x, ' = ', ...nodo('x', por(cos(q), p.A, 100), 'm')]);
          cuenta2 = paso('La posición es negativa; al multiplicarla por el cuadrado de la frecuencia angular y cambiar el signo, obtenemos aceleración positiva. El resorte empuja hacia el equilibrio.', [S.a, ' = −', sup(Q('omega', 1)), ' × (', ...nodo('x', por(cos(q), p.A, 100)), ') = ', ...nodo(clave, valor, unidad)]);
          sentido = 'El bloque llega al extremo izquierdo y se detiene un instante, pero el resorte sigue empujándolo hacia la derecha. Por eso la aceleración es positiva aunque la velocidad sea cero.';
          errores = [error(por(valor, -1), 'perder el signo', 'SIGNO'), error(por(valor, 100), 'no convierte centímetros', 'UNIDAD'), error(ex(0), 'confundir reposo y equilibrio', 'REPOSO')];
          dibujo = esquema(p, 6, -1); break;
        }
        case 'periodo-ecuacion':
          valor = ex(2, p.n); clave = 'T'; unidad = 's';
          enunciado = ['Si ', S.x, '(', S.t, ') = ', Q('A', p.A), ' cos(', Q('omega', p.n), 'π', S.t, ' + ', ...nodo('phi', ex(1, 3, 1)), '), ¿cuál es el período?'];
          datos.push('La posición está en centímetros y el tiempo en segundos.', 'El argumento del coseno se expresa en radianes.');
          regla = paso('La frecuencia angular es el número que multiplica al tiempo dentro del coseno: indica los radianes que avanza la fase por segundo. La constante sumada es la fase inicial.', formulas.omega);
          cuenta1 = paso('Leemos el factor que multiplica al tiempo, incluido pi. Ese factor fija el ritmo de avance; el término que se suma solo fija dónde empieza el ciclo.', [S.omega, ' = ', ...nodo('omega', ex(p.n, 1, 1), 'rad/s')]);
          cuenta2 = paso('Dividimos los dos pi radianes de un ciclo entre la frecuencia angular. Pi aparece arriba y abajo, así que se cancela; quedan los segundos que tarda una oscilación.', [S.T, ' = ', frac('2π', S.omega), ' = ', frac('2π', nodo('omega', ex(p.n, 1, 1))), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'El período depende de cuánto avanza la fase por segundo. La fase inicial solo cambia dónde empieza el movimiento; no cambia el tiempo que tarda en completar cada vuelta.';
          errores = [error(ex(1, p.n), 'omitir dos', 'DOS'), error(ex(p.n, 2), 'invertir la fracción', 'INVERSO'), error(ex(6), 'usar la fase inicial', 'FASE')];
          dibujo = esquema(p, 6, -1); break;
        case 'fase-inicial':
          valor = ex(2, 3, 1); clave = 'phi'; unidad = 'rad';
          enunciado = ['Un bloque tiene amplitud ', Q('A', p.A, 'cm'), '. Al iniciar el reloj está en ', Q('x', -p.A / 2, 'cm'), ' y va hacia la izquierda. ¿Cuál es su fase inicial?'];
          datos.push(['Usa ', Q('phi', 0), ' ≤ ', S.phi, ' < 2π rad.'], ['cos(2π/3) = cos(4π/3) = −1/2.']);
          regla = paso('Dividir la posición inicial entre la amplitud nos da el coseno de la fase. Como dos fases comparten ese coseno, también necesitamos saber hacia dónde se mueve el bloque.', [...formulas.x, '   ;   ', ...formulas.v]);
          cuenta1 = paso('En el inicio, el tiempo vale cero. Dividimos la posición negativa entre la amplitud positiva para hallar el coseno de la fase inicial; el cociente conserva el signo.', ['cos ', S.phi, ' = ', frac(Q('x', -p.A / 2), Q('A', p.A)), ' = −1/2']);
          cuenta2 = paso('El bloque va hacia la izquierda, así que su velocidad es negativa. Como la fórmula lleva un signo menos, necesitamos seno positivo; eso permite elegir una de las dos fases.', [S.v, ' < 0 → sen ', S.phi, ' > 0', '   ;   ', S.phi, ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'Las dos fases candidatas sitúan al bloque a la izquierda del equilibrio. Elegimos la que también da velocidad negativa, porque el bloque comienza moviéndose hacia la izquierda.';
          errores = [error(ex(4, 3, 1), 'invertir el sentido', 'SENTIDO'), error(ex(1, 3, 1), 'perder el signo de x', 'POSICION'), error(ex(1, 1, 1), 'suponer un extremo', 'EXTREMO')];
          dibujo = esquema(p, -7, -1); break;
        case 'primer-regreso':
          valor = ex(5 * p.T, 6); clave = 't'; unidad = 's';
          enunciado = ['Un bloque parte del extremo derecho en reposo, con ', S.T, ' = ', Q('T', p.T, 's'), '. ¿Cuándo pasa por primera vez por ', S.x, ' = ', frac(S.A, '2'), ' hacia la derecha?'];
          datos.push('cos(π/3) = cos(5π/3) = 1/2.');
          regla = paso('La posición positiva fija un coseno positivo, pero no basta: el regreso hacia la derecha exige velocidad positiva. Elegimos la fase que cumple ambas condiciones.', [...formulas.x, '   ;   ', ...formulas.v]);
          cuenta1 = paso('El bloque parte del extremo derecho, de modo que la fase inicial es cero. Descartamos el primer cruce porque va hacia la izquierda; el regreso exige seno negativo.', [S.phi, ' = ', Q('phi', 0), '; cos(', S.omega, S.t, ') = 1/2; ', S.v, ' > 0 → ', S.omega, S.t, ' = ', ...fase(20)]);
          cuenta2 = paso('Dividimos la fase alcanzada entre los radianes que avanza por segundo. El cociente es el tiempo de regreso a la posición indicada, con el sentido pedido.', [S.t, ' = ', frac(fase(20), nodo('omega', ex(2, p.T, 1), 'rad/s')), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'El tiempo hallado corresponde al regreso hacia la derecha. El bloque pasó antes por esa posición, pero hacia la izquierda; esa primera visita no cumple el sentido pedido.';
          errores = [error(ex(p.T, 6), 'elegir la ida', 'IDA'), error(ex(p.T, 3), 'elegir posición negativa', 'POSICION'), error(ex(p.T, 2), 'elegir el extremo', 'EXTREMO'), error(ex(p.T), 'completar el ciclo', 'CICLO')];
          dibujo = esquema(p); break;
        case 'v-fase-inicial':
          valor = ex(2 * p.A, p.T, 1); clave = 'v'; unidad = 'cm/s';
          enunciado = ['Un bloque tiene ', S.A, ' = ', Q('A', p.A, 'cm'), ' y ', S.T, ' = ', Q('T', p.T, 's'), '. Parte de ', S.x, ' = −', frac(S.A, '2'), ' hacia la derecha. Halla su velocidad después de ', Q('t', p.T / 12, 's'), '.'];
          datos.push('cos(2π/3) = cos(4π/3) = −1/2.', 'sen(4π/3) = −√3/2; sen(3π/2) = −1.');
          regla = paso('Usamos la posición y el sentido para elegir la fase inicial. Luego sumamos el avance durante el tiempo dado: la velocidad debe calcularse con esa fase posterior.', [...formulas.omega, '   ;   ', ...formulas.v]);
          cuenta1 = paso('La posición inicial fija un coseno negativo y el movimiento hacia la derecha exige seno negativo. Elegimos esa fase y sumamos lo que avanza durante el intervalo.', [S.phi, ' = ', ...fase(16), '   ;   ', S.omega, S.t, ' + ', S.phi, ' = ', ...fase(18)]);
          cuenta2 = paso('En la fase alcanzada, el seno vale menos uno. Los dos signos negativos se cancelan, así que la velocidad es positiva y el bloque cruza el centro hacia la derecha.', [S.v, ' = −', Q('A', p.A), ' × ', ...nodo('omega', ex(2, p.T, 1)), ' × (−1) = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La velocidad positiva corresponde al cruce del centro hacia la derecha. Usamos la fase posterior porque el bloque ya avanzó desde el inicio; conservar la fase inicial describiría otro instante.';
          errores = [error(por(valor, -1), 'invertir el sentido', 'SIGNO'), error(por(valor, 1, 2), 'usar medio máximo', 'MITAD'), error(ex(p.A, p.T, 1, 3), 'conservar velocidad inicial', 'INICIAL'), error(ex(0), 'suponer un extremo', 'CERO')];
          dibujo = esquema(p, -7, 1); break;
        case 'primer-izquierda':
          valor = ex(5 * p.T, 8); clave = 't'; unidad = 's';
          enunciado = ['Un bloque sale del centro hacia la derecha, con ', S.T, ' = ', Q('T', p.T, 's'), '. ¿Cuándo llega por primera vez a ', S.x, ' = −', frac([S.A, raiz('2')], '2'), ' mientras va hacia la izquierda?'];
          datos.push('cos(3π/4) = −√2/2; sen(3π/4) > 0.');
          regla = paso('La posición y el sentido fijan las fases inicial y final. Para hallar el tiempo necesitamos el avance entre ellas, porque el reloj empieza con una fase distinta de cero.', [...formulas.omega, '   ;   ', ...formulas.x, '   ;   ', ...formulas.v]);
          cuenta1 = paso('El suceso ocurre después de la salida. Sumamos una vuelta a la fase final equivalente para que sea posterior a la inicial; luego restamos ambas fases.', [S.phi, ' = ', ...fase(18), '   ;   ', S.omega, S.t, ' + ', S.phi, ' = ', ...fase(33), '   ;   ', S.omega, S.t, ' = ', ...fase(15)]);
          cuenta2 = paso('Dividimos el avance de fase entre la frecuencia angular. Como esta mide radianes por segundo, el cociente da los segundos transcurridos desde la salida.', [S.t, ' = ', frac(fase(15), nodo('omega', ex(2, p.T, 1), 'rad/s')), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'El tiempo positivo corresponde a un suceso posterior a la salida. Sumar una vuelta a la fase final conserva la posición y el sentido, pero sitúa ese cruce después de la fase inicial.';
          errores = [error(ex(p.T, 8), 'elegir posición positiva', 'POSITIVA'), error(ex(3 * p.T, 8), 'omitir fase inicial', 'CRUCE'), error(ex(p.T, 4), 'elegir el extremo', 'EXTREMO'), error(ex(7 * p.T, 8), 'invertir el sentido', 'SENTIDO')];
          dibujo = esquema(p, 0, 1); break;
        case 'reconstruir-omega':
          valor = ex(1, 2 * p.w, 1); clave = 't'; unidad = 's';
          enunciado = ['En cierto instante, un bloque tiene posición ', S.x, ' de ', Q('x', p.x, 'cm'), ' y aceleración ', S.a, ' de ', Q('a', -(p.w ** 2) * p.x, 'cm/s²'), '. Si parte del extremo derecho en reposo, ¿cuánto tarda en llegar al centro?'];
          regla = paso('La relación entre aceleración y posición permite hallar la frecuencia angular. Desde el extremo derecho hasta el primer cruce del centro transcurre un cuarto de ciclo.', [...formulas.a, '   ;   ', ...formulas.omega]);
          cuenta1 = paso('Despejamos el cuadrado de la frecuencia angular dividiendo la aceleración cambiada de signo entre la posición. Tomamos la raíz positiva, porque buscamos el ritmo de avance de la fase.', [sup(S.omega), ' = −', frac(S.a, S.x), ' = ', sup(Q('omega', p.w)), '   ;   ', S.omega, ' = ', Q('omega', p.w, 'rad/s')]);
          cuenta2 = paso('Hallamos el tiempo de un ciclo a partir de la frecuencia angular y lo dividimos entre cuatro. Esa parte corresponde al trayecto desde un extremo hasta el primer cruce del centro.', [S.t, ' = ', frac(S.T, '4'), ' = ', frac('π', ['2', S.omega]), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'El cociente entre aceleración y posición fija la frecuencia angular sin necesitar la amplitud. Con ese ritmo encontramos el primer cruce del centro, que ocurre tras un cuarto de ciclo.';
          errores = [error(por(valor, 2), 'usar medio período', 'MEDIO'), error(por(valor, 4), 'usar el período', 'ENTERO'), error(ex(1, 4 * p.w), 'confundir radianes y ciclos', 'CICLOS'), error(ex(1, 2 * p.w ** 2, 1), 'omitir la raíz', 'RAIZ')];
          dibujo = esquema(p); break;
        case 'reconstruir-amplitud':
          valor = ex(p.u, 4); clave = 'x'; unidad = 'cm';
          enunciado = ['Un bloque tiene ', S.T, ' = ', ...nodo('T', ex(1, 1, 1), 's'), ' y rapidez central ', Q('v', p.u, 'cm/s'), '. Parte de ', S.x, ' = −', frac(S.A, '2'), ' hacia la derecha. Halla su posición tras ', ...nodo('t', ex(1, 6, 1), 's'), '.'];
          datos.push('cos(4π/3) = −1/2; sen(4π/3) < 0.', 'cos(5π/3) = 1/2.');
          regla = paso('En el centro, el módulo del seno vale uno y la rapidez es máxima. Por eso la rapidez central permite despejar la amplitud dividiéndola entre la frecuencia angular.', [...formulas.omega, '   ;   ', ...formulas.v, '   ;   ', ...formulas.x]);
          cuenta1 = paso('El período fija la frecuencia angular; dividir la rapidez central entre ella da la amplitud. Elegimos la fase inicial con la posición y el sentido, y sumamos el avance posterior.', [S.omega, ' = ', Q('omega', 2, 'rad/s'), '   ;   ', S.A, ' = ', frac(Q('v', p.u), Q('omega', 2)), ' = ', Q('A', p.u / 2, 'cm'), '   ;   ', S.phi, ' = ', ...fase(16), '   ;   ', S.omega, S.t, ' + ', S.phi, ' = ', ...fase(20)]);
          cuenta2 = paso('El coseno de la fase final vale un medio. Multiplicamos por la amplitud obtenida: el resultado positivo sitúa al bloque a la derecha del equilibrio.', [S.x, ' = ', Q('A', p.u / 2, 'cm'), ' × 1/2 = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La posición final está a la derecha del equilibrio. La rapidez central permitió hallar la amplitud y el sentido inicial permitió elegir la fase; ambos datos fueron necesarios para ubicar el bloque después.';
          errores = [error(por(valor, -1), 'conservar posición inicial', 'INICIAL'), error(por(valor, 2), 'dar la amplitud', 'AMPLITUD'), error(por(valor, 1, 2), 'dividir nuevamente', 'MITAD'), error(por(valor, -2), 'elegir extremo izquierdo', 'EXTREMO')];
          dibujo = esquema(p, -7, 1); break;
        default: throw new Error(`Tipo de gráficas desconocido: ${tipo}`);
      }
      const todas = [valor, ...errores.map(e => e.z)];
      const formato = n => { const z = todas.find(z => Math.abs(num(z) - n) < 1e-10); if (!z) throw new Error('Falta expresión exacta'); return `${exacto(z)} ${unidad}`; };
      const revision = {
        FRECUENCIA: 'Eso mide frecuencia en ciclos, no avance angular. Cada ciclo abarca una vuelta de fase',
        MEDIA: 'Falta media vuelta para completar un ciclo. Usa el avance angular de una vuelta entera',
        MULTIPLICA: 'Multiplicar no da avance por segundo. Divide el avance angular entre la duración del ciclo',
        SIGNO: 'Cambiar el signo cambia el sentido indicado. Conserva los signos de la fórmula y de los datos',
        AMPLITUD: 'La amplitud solo coincide con la distancia al centro en los extremos. Usa la fase del instante pedido',
        CENTRO: 'El centro exige coseno cero. La fase dada tiene otro coseno: multiplícalo por la amplitud',
        MAXIMO: 'El seno dado no tiene módulo uno. Usa su valor para obtener la velocidad de este instante',
        EXTREMO: 'Un extremo no cumple la posición y el sentido pedidos. Revisa ambas condiciones',
        CUADRADO: 'La relación usa el cuadrado de la frecuencia angular. Multiplica ese factor por sí mismo',
        CERO: 'Estar en reposo y estar en equilibrio son condiciones distintas. Ubica el bloque antes de decidir',
        VALLE: 'El valle está en otro instante. Lee la curva sobre el tiempo que se pide',
        EJE: 'El eje marca aceleración nula, pero la curva no lo cruza en ese instante. Lee su altura',
        MITAD: 'Dividir nuevamente cambia la cantidad pedida sin justificación. Sigue la relación completa',
        'SIN-FASE': 'El reloj no empezó con fase cero. Suma la fase inicial al avance posterior',
        UNIDAD: 'Los centímetros y los metros tienen tamaños distintos. Convierte la amplitud antes de sustituir',
        REPOSO: 'En un extremo la velocidad es cero, pero el resorte sigue empujando. Usa la posición para hallar la aceleración',
        DOS: 'Pi radianes representan media vuelta. Un período requiere la vuelta completa de fase',
        INVERSO: 'El período pide segundos por ciclo. Divide el avance de una vuelta entre la frecuencia angular',
        FASE: 'La fase inicial fija el comienzo, no el ritmo. Busca el factor que multiplica al tiempo',
        SENTIDO: 'La misma posición aparece al ir y volver. Elige la fase que también cumple el signo de la velocidad',
        POSICION: 'Esa fase sitúa al bloque al otro lado del equilibrio. Conserva el signo de la posición pedida',
        IDA: 'Ese cruce ocurre hacia la izquierda. La pregunta exige el cruce de regreso hacia la derecha',
        CICLO: 'Esperas una vuelta completa, aunque el punto se cruza antes. Busca el primer instante con el sentido pedido',
        INICIAL: 'El reloj ya avanzó. Calcula la fase posterior para obtener el estado que se pide',
        POSITIVA: 'Esa fase corresponde al lado derecho. La posición pedida está a la izquierda del equilibrio',
        CRUCE: 'La fase final no es todo el avance. Resta la fase inicial antes de convertir a tiempo',
        MEDIO: 'Medio ciclo lleva al extremo opuesto. El primer cruce del centro ocurre antes',
        ENTERO: 'Un ciclo devuelve al extremo de salida. Se pide solo el primer trayecto hasta el centro',
        CICLOS: 'Confundes frecuencia angular y frecuencia. Una vuelta de fase no equivale a un radián',
        RAIZ: 'El cociente hallado es el cuadrado de la frecuencia angular. Toma su raíz antes de calcular el tiempo',
      };
      const ops = opciones(num(valor), errores.map(e => ({ valor: num(e.z), error: `OS-GRAF-${tipo}-${e.codigo}`,
        siFuera: `${revision[e.codigo]}. Al ${e.causa}, obtendrías ${formato(num(e.z))}.` })), formato);
      const eTexto = errores.map(e => formato(num(e.z)));
      const cierreErrores = {
        'primer-regreso': `Con ${eTexto[0]} eliges la ida, pero se pide el regreso. ${eTexto[1]} sitúa al bloque a la izquierda; ${eTexto[2]}, en un extremo; ${eTexto[3]} completa la vuelta. Revisa posición y sentido para elegir el primer cruce.`,
        'v-fase-inicial': `${eTexto[0]} invierte el sentido; ${eTexto[1]} reduce a la mitad la rapidez central; ${eTexto[2]} conserva la velocidad inicial; ${eTexto[3]} supone un extremo. La fase final indica un cruce del centro hacia la derecha: ahí la rapidez es máxima.`,
        'primer-izquierda': `${eTexto[0]} corresponde a una posición positiva; ${eTexto[1]} omite la fase inicial; ${eTexto[2]} lleva a un extremo; ${eTexto[3]} invierte el sentido. Resta la fase inicial y comprueba que el bloque esté a la izquierda, yendo hacia la izquierda.`,
        'reconstruir-omega': `${eTexto[0]} cuenta medio ciclo; ${eTexto[1]}, un ciclo entero. ${eTexto[2]} confunde frecuencia y frecuencia angular; ${eTexto[3]} omite la raíz. Para el primer cruce del centro necesitas un cuarto del período; primero halla la frecuencia angular, no su cuadrado.`,
        'reconstruir-amplitud': `${eTexto[0]} conserva la posición inicial; ${eTexto[1]} da la amplitud; ${eTexto[2]} divide nuevamente; ${eTexto[3]} elige el extremo izquierdo. Ninguno usa la fase final correcta: su coseno sitúa al bloque a la mitad positiva de la amplitud.`,
      };
      return { enunciado, datos, dibujo, pide: `Se pide ${({ x: 'la posición', v: 'la velocidad con signo', a: 'la aceleración con signo', T: 'el período', t: 'el primer tiempo que cumple las condiciones', phi: 'la fase inicial', omega: 'la frecuencia angular' })[clave]}.`,
        tengo: 'Tomamos los valores indicados y las condiciones de posición, sentido y tiempo del enunciado.', regla, cuentas: [cuenta1, ...(cuenta2 ? [cuenta2] : [])], sentido,
        respuesta: [S[clave], ' = ', ...nodo(clave, valor, unidad)], opciones: ops,
        caso: { tipo, ...p, valor: num(valor), unidad, exacto: valor, errores: errores.map(e => ({ codigo: e.codigo, valor: num(e.z), exacto: e.z })) },
        erroresEjemplo: cierreErrores[tipo] || errores.map(e => `Al ${e.causa}, sale ${formato(num(e.z))}.`).join(' ') };
    }
    const lista = [
      ['omega-periodo', { T: 6 }, 'El ritmo de la fase'],
      ['x-fase', { A: 10, q: 4 }, 'Posición desde la fase'],
      ['v-fase', { A: 4, w: 3, q: 2 }, 'El signo de la velocidad'],
      ['a-posicion', { x: -2, w: 3 }, 'La aceleración desde la posición'],
      ['a-grafica', { max: 4, T: 6 }, 'Leer una aceleración'],
      ['x-tiempo', { A: 18, T: 12, t: 1, q0: 2 }, 'Sumar la fase inicial'],
      ['v-tiempo', { A: 10, T: 8, t: 2, q0: 3 }, 'Velocidad en metros por segundo'],
      ['a-tiempo', { A: 8, q0: 4, fraccion: 1 / 3 }, 'Acelerar en un extremo'],
      ['periodo-ecuacion', { A: 9, n: 3 }, 'Leer el período en la ecuación'],
      ['fase-inicial', { A: 12 }, 'Dos posiciones iguales, distintos sentidos'],
      ['primer-regreso', { T: 18 }, 'La primera llegada de regreso'],
      ['v-fase-inicial', { A: 12, T: 12 }, 'Reconstruir la fase y avanzar'],
      ['primer-izquierda', { T: 16 }, 'Elegir el cruce posterior'],
      ['reconstruir-omega', { x: -2, w: 5 }, 'Del ritmo al primer cruce'],
      ['reconstruir-amplitud', { u: 30 }, 'Reconstruir amplitud y posición'],
    ];
    const ejemplos = lista.map(([tipo, p, titulo], j) => ejemplo(caso(tipo, p), 1 + Math.floor(j / 5), titulo, Math.max(0, j - 10)));
    const reloj = val => Number(val.t.toFixed(1));
    const estado = val => { const t = reloj(val), q = Math.PI * t / 2; return { t, x: 12 * Math.cos(q), v: -6 * Math.PI * Math.sin(q) }; };
    const juego = val => {
      const s = estado(val), d = carrito(s.x, { A: 12, textos: [{ x: 308, y: 208, texto: `t = ${f(s.t, 1)} s`, color: 'h', ancla: 'end' }, { x: 308, y: 184, texto: 'T = 4 s', color: 'h', ancla: 'end' }], alt: 'Un bloque oscila desde el extremo derecho con amplitud de 12 centímetros y período de 4 segundos.' });
      if (Math.abs(s.v) < 1e-8) d.textos.push({ x: 160, y: 54, texto: 'v = 0', color: 'o', ancla: 'middle' });
      else d.flechas.push({ de: [178 + 4 * s.x, 60], ang: s.v > 0 ? 0 : 180, largo: Math.abs(s.v) * 2, texto: s.v > 0 ? 'Hacia la derecha' : 'Hacia la izquierda', color: 'o', rumbo: [0, -1] });
      return est(d);
    };
    const predT = 8, predt = 2, inicioPred = 2;
    const cuartosPred = 4 * predt / predT, estadoPred = (inicioPred + cuartosPred) % 4;
    const antes = esquema({}, -12), despues = esquema({}, 0, 1);
    despues.datos.textos.find(x => x.texto === 'Estado inicial; dibujo sin escala').texto = 'A los 2 s; dibujo sin escala';
    despues.datos.alt = 'A los dos segundos, el bloque cruza el equilibrio hacia la derecha. El dibujo no está a escala.';
    const mapaX = grafica('x', 12, 8, Math.PI, 2);
    const mapaV = grafica('v', 3 * Math.PI, 8, -Math.PI / 2);
    mapaV.datos.y = { ...mapaV.datos.y, min: -12, max: 12, paso: 6, decimales: 0 };
    glosario.push(
      { termino: 'fase', formas: ['fase', 'fases'], local: true, simple: 'El avance dentro del vaivén, como cuando vas y vuelves en un columpio.', def: 'Ángulo que ubica el estado de una oscilación sinusoidal. Al aumentar una vuelta completa, se repiten posición y sentido.', ejemplos: ['Dos ciclos completos suman cuatro pi radianes de fase.', 'La fase sigue avanzando aunque el bloque cambie de sentido.', 'Una misma posición puede corresponder a dos fases con velocidades de signos opuestos.'] },
      { termino: 'fase inicial', simbolo: 'φ', medida: 'rad', simple: 'El punto del vaivén donde empiezas a contar el tiempo con un cronómetro.', def: 'Valor de la fase cuando el reloj marca cero. Se elige usando la posición inicial y el sentido del movimiento.', ejemplos: ['Cambiar el origen del tiempo puede cambiar la fase inicial.', 'Dos bloques con igual amplitud pueden comenzar en estados diferentes.', 'La fase inicial no crece con el reloj: es una constante del movimiento descrito.'] },
      { termino: 'frecuencia angular', simbolo: 'ω', medida: 'rad/s', simple: 'Cuánto avanza el ciclo cada segundo, medido en radianes, como en un columpio.', def: 'Ritmo constante de avance de la fase en el movimiento armónico simple. Se mide en radianes por segundo.', ejemplos: ['Si la fase avanza un radián en cada segundo, la frecuencia angular es un radián por segundo.', 'Duplicar la frecuencia angular duplica el avance de fase en el mismo tiempo.', 'La frecuencia angular permanece constante aunque cambien la posición y la velocidad del bloque.'] },
    );
    return {
      id: 'graficas-mas', titulo: 'Un reloj para el movimiento', pregunta: '¿Cómo describimos la posición, la velocidad y la aceleración en cualquier instante?',
      temas: ['Ecuaciones y gráficas del MAS'], pieza: 'fis-estatica',
      aprendizaje: 'Relaciono el estado inicial con la fase y uso las ecuaciones del MAS para interpretar posición, velocidad y aceleración.',
      actividad: 'Mover el reloj y comparar la posición del bloque con su sentido de movimiento.',
      lee: { tarjetas: [
        { titulo: 'El reloj necesita un comienzo', texto: 'El bloque sigue unido al resorte. Para describirlo en otro instante necesitamos saber dónde estaba y hacia dónde se movía cuando comenzó el reloj. Una misma posición puede repetirse durante la ida y durante la vuelta; por eso la posición inicial sola no basta.', dibujo: esquema({}) },
        { titulo: 'Una posición, dos sentidos', texto: ['La posición ', S.x, ' lleva signo. La velocidad ', S.v, ' indica además hacia dónde se mueve: positiva hacia la derecha y negativa hacia la izquierda. Estar en el centro no determina el sentido.'] },
        { titulo: 'Del bloque a sus gráficas', texto: ['La fase indica en qué parte del ciclo está el movimiento. La fase inicial ', S.phi, ' fija el comienzo y la frecuencia angular ', S.omega, ' mide cuánto avanza la fase por segundo. En las gráficas, el eje horizontal muestra el tiempo y el vertical muestra posición, velocidad o aceleración.'] },
      ] }, ejemplos,
      juega: { pieza: 'fis-estatica', consigna: 'El bloque parte del extremo derecho. Mueve el reloj y observa su posición y hacia dónde continúa.',
        voz: 'Mira el sentido además de la posición.',
        mision: { texto: 'Encuentra el primer instante en que el bloque pasa por el centro hacia la izquierda.', logrado: v => reloj(v) === 1, bien: 'Encontraste el primer cruce: el bloque todavía continúa hacia el extremo izquierdo.' },
        leyenda: [{ s: S.x, t: 'posición desde el equilibrio' }, { s: S.A, t: 'amplitud de 12 cm' }, { s: S.t, t: 'tiempo desde la salida del extremo derecho' }, { s: S.T, t: 'período de 4 s' }, { s: S.v, t: 'velocidad; su signo indica el sentido' }],
        controles: [{ id: 't', etiqueta: 'Tiempo, t', min: 0, max: 4, paso: 1, decimales: 1, inicio: 0, unidad: 's', color: 'c-h', auto: { velocidad: 0.5 } }],
        dibujo: juego, lectura: val => { const s = estado(val); return [S.x, Math.abs(s.x * 100 - Math.round(s.x * 100)) < 1e-7 ? ' = ' : ' ≈ ', Q('x', s.x, 'cm'), '   ;   ', Math.abs(s.v) < 1e-8 ? 'reposo' : s.v > 0 ? 'hacia la derecha' : 'hacia la izquierda']; }, resumen: { t: 1 }, minimo: 3 },
      predice: { pregunta: 'Otro bloque parte del extremo izquierdo en reposo y tiene un período de 8 s. ¿Dónde está y hacia dónde se mueve a los 2 s?',
        datos: ['El bloque realiza un movimiento armónico simple.', 'El reloj empieza al soltar el bloque.', ['Amplitud: ', S.A, ' = ', Q('A', 12, 'cm'), '.']], dibujo: antes, revelar: despues,
        opciones: opciones(estadoPred, [
          { valor: cuartosPred % 4, error: 'OS-GRAF-COPIA-INICIO', siFuera: 'Si copias el sentido del bloque anterior, eliges la izquierda. Este bloque parte del otro extremo: compara la posición inicial y el recorrido antes de asignar el sentido.' },
          { valor: inicioPred, error: 'OS-GRAF-CONSERVA-INICIO', siFuera: 'Si conservas el punto inicial, omites los dos segundos transcurridos. El bloque no permanece quieto: sigue su recorrido desde el extremo izquierdo.' },
          { valor: (inicioPred + 2 * cuartosPred) % 4, error: 'OS-GRAF-MEDIO-CICLO', siFuera: 'Si eliges el extremo opuesto, cuentas medio ciclo: aquí requiere cuatro segundos. Compara ese tiempo con los dos segundos que pide la pregunta.' },
        ], n => ['En el extremo derecho, en reposo.', 'En el centro, hacia la izquierda.', 'En el extremo izquierdo, en reposo.', 'En el centro, hacia la derecha.'][n]),
        coincide: 'El cuarto de ciclo termina en el centro, pero el sentido depende del extremo desde el cual partió.' },
      mira: { pieza: 'ejes', datos: mapaX.datos, pasos: [
        paso('La curva de posición asciende, así que la posición aumenta con el tiempo. Por eso el primer cruce del centro ocurre hacia la derecha y la velocidad es positiva.', [S.t, ' = 2 s; ', S.x, ' = 0; ', S.v, ' > 0', '   ;   ', 'Curva ascendente: ', S.v, ' > 0. Descendente: ', S.v, ' < 0.']),
        paso('Un radián es el ángulo cuyo arco mide lo mismo que el radio. Una vuelta tiene dos pi radianes; usamos esa medida para describir el avance del ciclo.', ['1 vuelta = 2π rad = 360°']),
        paso('Multiplicamos la frecuencia angular por el tiempo y sumamos la fase inicial: así ubicamos el bloque dentro del ciclo. Con esa fase, el coseno da la posición y el seno determina la velocidad.', [...formulas.omega, '   ;   ', 'fase total = ', S.omega, S.t, ' + ', S.phi, '   ;   ', ...formulas.x, '   ;   ', ...formulas.v]),
        paso('El resorte tira hacia el equilibrio: si el bloque está a un lado, su aceleración apunta al otro. Por eso la aceleración tiene signo contrario a la posición.', formulas.a),
        paso('Dos fases pueden tener el mismo coseno y, por tanto, la misma posición. Miramos el signo de la velocidad para elegir si el bloque está yendo o regresando.', [S.v, ' > 0 → sen(', S.omega, S.t, ' + ', S.phi, ') < 0', '   ;   ', 'Desde el extremo izquierdo, en reposo: ', S.phi, ' = π rad.']),
        paso('Al sumar una vuelta, la posición y el sentido se repiten. Elegimos la primera fase posterior al inicio que cumpla ambas condiciones, porque buscamos el primer instante pedido.', ['fase posterior = fase equivalente + 2π rad']),
        paso('En el centro el seno alcanza su mayor módulo y la rapidez es máxima. En los extremos el bloque cambia de sentido: su velocidad pasa por cero.', ['rapidez central = ', S.A, S.omega, '; rapidez en extremos = 0']),
      ] },
      regla: { texto: 'La fase indica el avance del ciclo; la inicial ubica el comienzo y la frecuencia angular, cuánto avanza por segundo. La fuerza proporcional y opuesta a la elongación produce el MAS: la posición sigue un coseno y la velocidad, un seno. Al cruzar de vuelta el mismo punto, la posición se repite y la velocidad cambia de signo.',
        ecuacion: [...formulas.omega, '   ;   ', ...formulas.x, '   ;   ', ...formulas.v, '   ;   ', ...formulas.a],
        condicion: 'el movimiento es armónico simple, mantiene su amplitud positiva y las fases se expresan en radianes. Posición, velocidad y aceleración usan el mismo eje; con rozamiento, la amplitud cambia y estas ecuaciones de amplitud constante dejan de describirlo.', dibujo: mapaV },
      resuelve: { pieza: 'fis-estatica', generar(s) { const n = 2 + Math.floor(s / 4) % 7; return resuelto(s % 4 === 0 ? caso('omega-periodo', { T: 2 * n + 3 }) : s % 4 === 1 ? caso('x-fase', { A: 2 * n + 1, q: 4 }) : s % 4 === 2 ? caso('v-fase', { A: n + 2, w: n + 1, q: 2 }) : caso('a-posicion', { x: -n, w: n + 1 })); } },
      ahoraTu: { pieza: 'fis-estatica', generar(s) { const n = 2 + Math.floor(s / 6) % 7; const tipos = [
        ['x-tiempo', { A: n + 11, T: 12 * n, t: n, q0: 2 }], ['v-tiempo', { A: n + 7, T: 4 * n, t: n, q0: 3 }],
        ['a-tiempo', { A: n + 9, q0: 4, fraccion: 1 / 3 }], ['fase-inicial', { A: 2 * n + 3 }],
        ['primer-regreso', { T: 6 * n + 6 }], ['reconstruir-omega', { x: -n, w: n + 2 }],
      ]; return pregunta(caso(...tipos[s % tipos.length])); } },
    };
  })();

  // 4. Período de resortes ideales: las conexiones se deducen de fuerzas y alargamientos.
  const idea4 = (() => {
    const K = sub(S.k, 'eq'), K1 = sub(S.k, '1'), K2 = sub(S.k, '2');
    const D = sub(S.delta, 'eq'), D0 = sub(S.delta, '0');
    const red = n => Math.round(n * 1e9) / 1e9;
    const exacto = (n, d = 3) => Math.abs(n - Math.round(n * 10 ** d) / 10 ** d) < 1e-9;
    const textoValor = (n, unidad, pi = false) => {
      const q = pi ? n / Math.PI : n;
      return `${exacto(q) ? '' : '≈ '}${f(q, 3)}${pi ? 'π' : ''} ${unidad}`;
    };
    const numero = (clave, n, unidad, pi = false) => V(clave, textoValor(n, unidad, pi));
    const periodo = (m, k) => 2 * Math.PI * Math.sqrt(m / k);
    const eqPeriodo = rigidez => [S.T, ' = 2π', raiz(frac(S.m, rigidez))];
    const eqT = (m, k) => [S.T, ' = 2π', raiz(frac(Q('m', m, 'kg', 3), Q('k', k, 'N/m', 3))), ' = ', numero('T', periodo(m, k), 's', true)];
    const datosBase = ['Los resortes son ideales y su masa es despreciable.', 'No hay rozamiento ni pérdida de amplitud.'];
    function figura(p, tipo) {
      if (tipo.startsWith('vertical')) {
        // La referencia natural es conocida; el equilibrio se omite si debe calcularse.
        const natural = 92, d = p.sCm === undefined ? p.yCm : p.sCm, y = natural + 4 * d;
        const textos = [{ x: 12, y: 22, texto: `m = ${f(p.m, 3)} kg`, color: 'f' },
          { x: 300, y: 22, texto: `g = ${f(p.g)} m/s²`, color: 'h', ancla: 'end' },
          { x: 12, y: 54, texto: p.k === undefined ? 'Resorte' : `k = ${f(p.k, 3)} N/m`, color: 'f' },
          { x: 306, y: natural - 10, texto: 'Longitud natural', ancla: 'end' },
          { x: 260, y: Math.max(natural + 28, (natural + y) / 2 + 4), texto: `δ = ${f(d)} cm`, color: 'i', ancla: 'middle' }];
        return est({ alto: Math.max(270, y + 64), techo: { y: 38, x0: 112, x1: 164 },
          objetos: [{ tipo: 'resorte', de: [138, 38], a: [138, y - 18], vueltas: 10, ancho: 8 },
            { tipo: 'caja', x: 138, y: y + 18, w: 36, h: 36 }],
          lineas: [{ de: [162, natural], a: [216, natural], discontinua: true }],
          cotas: [{ de: [216, natural], a: [216, y], color: 'i', lado: 1, sep: 16 }],
          textos, alt: 'Un resorte vertical sostiene un bloque. La cota mide el alargamiento desde la longitud natural; no es la amplitud.' });
      }
      const serie = tipo.startsWith('serie'), paralelo = tipo.startsWith('paralelo');
      if (serie || paralelo) {
        const x = 252, objetos = [{ tipo: 'caja', x, y: 176, w: 40, h: paralelo ? 84 : 40 }];
        if (serie) objetos.push({ tipo: 'resorte', de: [24, 156], a: [126, 156], vueltas: 7, ancho: 7 }, { tipo: 'resorte', de: [126, 156], a: [232, 156], vueltas: 7, ancho: 7 });
        else for (const y of [108, 152]) objetos.push({ tipo: 'resorte', de: [24, y], a: [232, y], vueltas: 10, ancho: 7 });
        const k1 = p.k1 === undefined ? 'k_1: por determinar' : `k_1 = ${f(p.k1, 3)} N/m`;
        const k2 = p.k2 === undefined ? 'k_2: por determinar' : `k_2 = ${f(p.k2, 3)} N/m`;
        return est({ alto: 248, paredes: [{ x: 24, y0: 86, y1: 176, lado: -1 }], piso: { y: 176, x0: 12, x1: 308 }, objetos,
          textos: [{ x: 12, y: 22, texto: serie ? 'Resortes en serie' : 'Resortes en paralelo' },
            { x: 12, y: 48, texto: `m = ${f(p.m, 3)} kg`, color: 'f' },
            { x: serie ? 76 : 128, y: serie ? 72 : 88, texto: k1, color: 'f', ancla: 'middle' },
            { x: serie ? 202 : 128, y: serie ? 116 : 136, texto: k2, color: 'f', ancla: 'middle' },
            { x: 160, y: 218, texto: 'Esquema de la conexión; bloque en equilibrio.', ancla: 'middle' }],
          alt: serie ? 'Dos resortes consecutivos unen la pared y el bloque en equilibrio.' : 'Dos resortes unen la misma pared y el mismo bloque en equilibrio.' });
      }
      const ts = [{ x: 12, y: 48, texto: p.m === undefined ? 'm: por determinar' : `m = ${f(p.m, 3)} kg`, color: 'f' },
        { x: 308, y: 48, texto: p.k === undefined ? 'k: por determinar' : `k = ${f(p.k, 3)} N/m`, color: 'f', ancla: 'end' }];
      return est(carrito(0, { rotuloX: false, textos: ts, alt: 'Un bloque unido a un resorte horizontal se representa en equilibrio.' }));
    }
    function caso(tipo, p) {
      let valor, unidad = 's', clave = 'T', pi = true, enunciado, regla, cuentas, sentido;
      let m = p.m, k = p.k, keq, errores = [], dibujoP = { ...p }, datos = datosBase.slice();
      const err = (id, n, causa, breve) => errores.push({ id, valor: n, causa, breve });
      const erroresT = () => {
        err('medio', valor / 2, 'contar medio ciclo', 'medio ciclo');
        err('doble', 2 * valor, 'contar dos ciclos', 'dos ciclos');
        err('masa-doble', valor * Math.sqrt(2), 'duplicar la masa', 'masa duplicada');
        err('rigidez-doble', valor / Math.sqrt(2), 'duplicar la rigidez', 'rigidez duplicada');
      };
      if (tipo === 'periodo' || tipo === 'periodo-gramos') {
        if (tipo === 'periodo-gramos') { m = p.gramos / 1000; dibujoP.m = m; datos.push('1 kg = 1000 g.'); }
        valor = periodo(m, k);
        enunciado = ['Un bloque de ', Q('m', tipo === 'periodo-gramos' ? p.gramos : m, tipo === 'periodo-gramos' ? 'g' : 'kg', 3), ' oscila horizontalmente con un resorte de ', Q('k', k, 'N/m'), '. ¿Cuál es su período?'];
        regla = paso('El período es el tiempo de un ciclo completo. La masa se resiste a cambiar de velocidad y la rigidez determina la fuerza que la devuelve; ambas fijan ese tiempo.', eqPeriodo(S.k));
        cuentas = [];
        if (tipo === 'periodo-gramos') cuentas.push(paso('Dividimos los gramos entre mil para expresar la masa en kilogramos. Así usamos unidades compatibles con la rigidez dada en newtons por metro.', [S.m, ' = ', frac(Q('m', p.gramos, 'g'), '1000 g/kg'), ' = ', Q('m', m, 'kg', 3)]));
        cuentas.push(paso('Sustituimos la masa y la rigidez en la relación del período. Dejamos pi indicado para conservar el valor exacto del tiempo que tarda una ida y vuelta.', eqT(m, k)));
        sentido = 'Ese tiempo corresponde a salir de un extremo, llegar al otro y regresar. Es un ciclo completo, no solo el trayecto de ida.'; erroresT();
      } else if (tipo === 'razon-masa' || tipo === 'razon-rigidez') {
        pi = false;
        const masa = tipo === 'razon-masa', cociente = masa ? p.m1 / p.m0 : p.k0 / p.k1;
        valor = p.T0 * Math.sqrt(cociente);
        enunciado = masa ? ['Con el mismo resorte, la masa pasa de ', Q('m', p.m0, 'kg'), ' a ', Q('m', p.m1, 'kg'), '. El período inicial es ', Q('T', p.T0, 's'), '. ¿Cuál será el nuevo período?'] :
          ['La masa no cambia. La rigidez pasa de ', Q('k', p.k0, 'N/m'), ' a ', Q('k', p.k1, 'N/m'), '; el período inicial es ', Q('T', p.T0, 's'), '. ¿Cuál será el nuevo período?'];
        const q0 = sub(masa ? S.m : S.k, '0'), q1 = sub(masa ? S.m : S.k, '1');
        regla = paso(masa ? 'Dividimos el período final entre el inicial. Como el resorte es el mismo, su rigidez se cancela; queda la raíz de la razón entre las masas.' : 'Dividimos el período final entre el inicial. La masa se cancela porque no cambia; la rigidez final va abajo porque un resorte más rígido acorta el ciclo.',
          [frac(sub(S.T, '1'), sub(S.T, '0')), ' = ', raiz(masa ? frac(q1, q0) : frac(q0, q1))]);
        cuentas = [paso('Calculamos la raíz de la razón indicada y multiplicamos por el período inicial. Esa raíz dice cuántas veces cambia la duración del ciclo.', [sub(S.T, '1'), ' = ', Q('T', p.T0, 's'), ' · ', raiz(masa ? frac(Q('m', p.m1, 'kg'), Q('m', p.m0, 'kg')) : frac(Q('k', p.k0, 'N/m'), Q('k', p.k1, 'N/m'))), ' = ', numero('T', valor, 's')])];
        sentido = masa ? 'El bloque con más masa necesita más tiempo para completar el ciclo: la misma fuerza del resorte le produce una aceleración menor.' : 'El ciclo se acorta porque, a igual separación, un resorte más rígido ejerce mayor fuerza sobre el mismo bloque y lo devuelve más rápidamente.';
        dibujoP = masa ? { m: p.m1 } : { k: p.k1 };
        err('sin-raiz', p.T0 * cociente, 'omitir la raíz', 'sin raíz'); err('sin-cambio', p.T0, 'ignorar el cambio', 'sin cambio');
        err('inversa', p.T0 / Math.sqrt(cociente), 'invertir la razón', 'razón invertida'); err('doble', 2 * valor, 'contar dos ciclos', 'dos ciclos');
        err('masa-doble', valor * Math.sqrt(2), 'duplicar además la masa', 'masa duplicada');
      } else if (tipo === 'masa-periodo' || tipo === 'rigidez-periodo') {
        const masa = tipo === 'masa-periodo'; pi = false; unidad = masa ? 'kg' : 'N/m'; clave = masa ? 'm' : 'k';
        valor = masa ? k * (p.q / 2) ** 2 : m * (2 / p.q) ** 2;
        enunciado = masa ? ['Un resorte de ', Q('k', k, 'N/m'), ' completa cada ciclo en ', numero('T', p.q * Math.PI, 's', true), '. ¿Qué masa tiene el bloque?'] :
          ['Un bloque de ', Q('m', m, 'kg'), ' tiene un período de ', numero('T', p.q * Math.PI, 's', true), '. ¿Cuál es la rigidez del resorte?'];
        regla = paso('Elevamos la relación del período al cuadrado para quitar la raíz. Después multiplicamos por la rigidez y aislamos la cantidad que se pide.', [sup(S.T), ' · ', S.k, ' = 4π² · ', S.m]);
        cuentas = [paso(masa ? 'La masa está multiplicada por cuatro pi al cuadrado. Dividimos ambos lados entre ese factor para dejarla sola y sustituimos el período completo.' : 'La rigidez está multiplicada por el período al cuadrado. Dividimos ambos lados entre ese factor para dejarla sola; usamos el período completo, no medio ciclo.',
          masa ? [S.m, ' = ', frac([S.k, ' · ', sup(S.T)], '4π²'), ' = ', frac([Q('k', k, 'N/m'), ' · ', sup(['(', numero('T', p.q * Math.PI, 's', true), ')'])], '4π²'), ' = ', numero('m', valor, unidad)] :
            [S.k, ' = ', frac(['4π² · ', S.m], sup(S.T)), '   ;   ', S.k, ' = ', frac(['4π² · ', Q('m', m, 'kg')], sup(['(', numero('T', p.q * Math.PI, 's', true), ')'])), '   ;   ', S.k, ' = ', numero('k', valor, unidad)])];
        sentido = masa ? 'La masa calculada es la que, con el resorte dado, tarda ese tiempo en ir y volver. Podemos comprobarla reemplazándola en la relación del período.' : 'La rigidez calculada indica cuánta fuerza ejerce el resorte por cada metro de deformación. Con la masa dada, ese resorte produce el período indicado.';
        err('factor-cuatro', 4 * valor, masa ? 'duplicar el período' : 'reducir el período a la mitad', masa ? 'período duplicado' : 'período reducido'); err('cuarto', valor / 4, masa ? 'reducir el período a la mitad' : 'duplicar el período', masa ? 'período reducido' : 'período duplicado');
        err('doble', 2 * valor, 'duplicar el resultado', 'resultado duplicado'); err('mitad', valor / 2, 'dividir otra vez entre dos', 'división extra');
      } else if (tipo === 'vertical-periodo') {
        k = p.m * p.g / (p.sCm / 100); valor = periodo(p.m, k);
        datos.push('El alargamiento dado corresponde al equilibrio.', '1 m = 100 cm.');
        enunciado = ['Al colgar ', Q('m', p.m, 'kg'), ', un resorte se alarga ', Q('delta', p.sCm, 'cm'), '. Con ', S.g, ' = ', Q('g', p.g, 'm/s²'), ', ¿qué período tendrá al oscilar verticalmente?'];
        regla = paso('El bloque colgado está en equilibrio, así que el resorte tira hacia arriba con la misma fuerza que el peso tira hacia abajo. Esa igualdad permite hallar la rigidez.', [S.k, ' · ', D, ' = ', S.m, ' · ', S.g, '   ;   ', S.k, ' = ', frac([S.m, ' · ', S.g], D)]);
        cuentas = [paso('Expresamos el alargamiento en metros y dividimos el peso entre él. Ese cociente da la fuerza por metro de deformación, es decir, la rigidez del resorte.', [S.k, ' = ', frac([Q('m', p.m, 'kg'), ' · ', Q('g', p.g, 'm/s²')], Q('delta', p.sCm / 100, 'm', 3)), ' = ', Q('k', k, 'N/m')]),
          paso('Usamos la masa y la rigidez calculada para hallar el período. El peso cambia dónde queda el equilibrio, pero el vaivén se mide alrededor de ese nuevo punto.', eqT(p.m, k))];
        sentido = 'El peso deja al resorte estirado incluso en equilibrio. La oscilación ocurre alrededor de ese punto, por eso el alargamiento estático no es la amplitud del vaivén.'; erroresT();
      } else if (tipo === 'vertical-amplitud' || tipo === 'vertical-desde-periodo') {
        pi = false; unidad = 'cm'; clave = 'A';
        const desdeT = tipo === 'vertical-desde-periodo'; if (desdeT) k = p.m * (2 / p.q) ** 2;
        const deq = p.m * p.g / k; valor = Math.abs(p.yCm / 100 - deq) * 100;
        datos.push('El bloque se suelta desde el reposo.', 'Los alargamientos se miden desde la longitud natural.');
        enunciado = ['Un bloque de ', Q('m', p.m, 'kg'), ' cuelga de un resorte ', ...(desdeT ? ['con período ', numero('T', p.q * Math.PI, 's', true)] : ['de ', Q('k', k, 'N/m')]), '. Se suelta con alargamiento ', Q('delta', p.yCm, 'cm'), '. Para ', S.g, ' = ', Q('g', p.g, 'm/s²'), ', ¿cuál es la amplitud?'];
        regla = desdeT ? paso('Primero necesitamos la rigidez para ubicar el equilibrio. Elevamos la relación del período al cuadrado y dividimos entre el período al cuadrado para dejar sola la rigidez.', [sup(S.T), ' · ', S.k, ' = 4π² · ', S.m, '   ;   ', S.k, ' = ', frac(['4π² · ', S.m], sup(S.T)), '   ;   ', S.k, ' = ', Q('k', k, 'N/m')]) :
          paso('En equilibrio, el resorte sostiene el peso. Dividimos ese peso entre la rigidez para hallar cuánto se estira el resorte antes de empezar a oscilar.', [S.k, ' · ', D, ' = ', S.m, ' · ', S.g, '   ;   ', D, ' = ', frac([S.m, ' · ', S.g], S.k)]);
        cuentas = [paso('Dividimos el peso entre la rigidez y convertimos a centímetros. Así ubicamos el equilibrio usando la misma referencia y unidad que el alargamiento de liberación.', [D, ' = ', frac([Q('m', p.m, 'kg'), ' · ', Q('g', p.g, 'm/s²')], Q('k', k, 'N/m')), '   ;   ', D, ' = ', Q('delta', deq, 'm', 3), ' = ', Q('delta', deq * 100, 'cm')]),
          paso('Restamos los alargamientos porque ambos se midieron desde la longitud natural. Tomamos el valor absoluto: la amplitud es la distancia entre el punto de liberación y el equilibrio.', [S.A, ' = |', D0, ' − ', D, '| = |', Q('delta', p.yCm, 'cm'), ' − ', Q('delta', deq * 100, 'cm'), '| = ', numero('A', valor, 'cm')])];
        sentido = 'El bloque se suelta sin velocidad, así que esa posición es un extremo. Su distancia al equilibrio es la amplitud; medir desde la longitud natural daría otra cantidad.';
        err('natural', p.yCm, 'medir desde la longitud natural', 'referencia natural'); err('equilibrio', deq * 100, 'dar el alargamiento de equilibrio', 'alargamiento estático');
        err('suma', p.yCm + deq * 100, 'sumar ambos alargamientos', 'suma'); err('doble', 2 * valor, 'medir entre extremos', 'entre extremos');
        err('signo-alargamiento', deq * 100 - p.yCm, 'conservar una diferencia negativa', 'diferencia negativa'); err('recorrido', 4 * valor, 'dar el recorrido de un ciclo', 'recorrido completo');
      } else if (tipo === 'paralelo-periodo' || tipo === 'serie-periodo' || tipo === 'paralelo-estatico' || tipo === 'serie-estatico') {
        const serie = tipo.startsWith('serie'), estatico = tipo.endsWith('estatico');
        const k1 = estatico ? p.mc * p.g / (p.sCm / 100) : p.k1, k2 = p.k2;
        keq = serie ? k1 * k2 / (k1 + k2) : k1 + k2; valor = periodo(p.m, keq);
        if (estatico) {
          datos.push('La masa de calibración se retira antes de conectar.', 'El alargamiento de calibración corresponde al equilibrio.');
          enunciado = ['Una masa de ', Q('m', p.mc, 'kg'), ' alarga el primer resorte ', Q('delta', p.sCm, 'cm'), '. Se conecta ', serie ? 'en serie' : 'en paralelo', ' con otro de ', Q('k', k2, 'N/m'), '. Si ', S.m, ' vale ', Q('m', p.m, 'kg'), ' y ', S.g, ' vale ', Q('g', p.g, 'm/s²'), ', halla el período horizontal.'];
          regla = paso('La masa usada para medir el resorte estaba quieta: su peso igualaba la fuerza elástica. Dividimos ese peso entre el alargamiento para obtener la primera rigidez.', [K1, ' = ', frac([sub(S.m, 'c'), ' · ', S.g], D), ' = ', frac([Q('m', p.mc, 'kg'), ' · ', Q('g', p.g, 'm/s²')], Q('delta', p.sCm / 100, 'm', 3)), ' = ', Q('k', k1, 'N/m')]);
        } else {
          enunciado = ['Dos resortes de ', Q('k', k1, 'N/m'), ' y ', Q('k', k2, 'N/m'), ' sostienen horizontalmente un bloque de ', Q('m', p.m, 'kg'), ', conectados ', serie ? 'en serie' : 'en paralelo', '. ¿Cuál es el período?'];
          regla = serie ? paso('En serie, ambos resortes transmiten la misma fuerza. El desplazamiento total reúne sus alargamientos; por eso se suman los inversos de las rigideces, no las rigideces directamente.', [frac('1', K), ' = ', frac('1', K1), ' + ', frac('1', K2), '   ;   ', K, ' = ', frac([K1, ' · ', K2], [K1, ' + ', K2])]) :
            paso('En paralelo, el bloque desplaza igual los extremos de ambos resortes. Cada uno aporta fuerza; al sumarlas para el mismo desplazamiento, se suman también sus rigideces.', [K, ' = ', K1, ' + ', K2]);
        }
        cuentas = [paso(serie ? 'Calculamos la rigidez equivalente de la conexión en serie. El producto dividido entre la suma reúne los dos alargamientos que produce una misma fuerza.' : 'Sumamos ambas rigideces porque los resortes se deforman igual y empujan juntos al bloque. La suma representa un único resorte que haría la misma fuerza.', serie ? [K, ' = ', frac([Q('k', k1, 'N/m'), ' · ', Q('k', k2, 'N/m')], [Q('k', k1, 'N/m'), ' + ', Q('k', k2, 'N/m')]), '   ;   ', K, ' = ', Q('k', keq, 'N/m')] :
          [K, ' = ', Q('k', k1, 'N/m'), ' + ', Q('k', k2, 'N/m'), '   ;   ', K, ' = ', Q('k', keq, 'N/m')]), paso('Sustituimos la masa que oscila y la rigidez equivalente en la relación del período. El bloque responde a la fuerza total del conjunto, no a un resorte aislado.', eqT(p.m, keq))];
        sentido = serie ? 'El conjunto en serie se alarga más que un solo resorte bajo la misma fuerza. Por eso tiene menor rigidez y produce un vaivén más lento con la misma masa.' : 'En paralelo, ambos resortes aportan fuerza para devolver al bloque. El conjunto es más rígido que cada uno por separado, así que acorta el ciclo de la misma masa.';
        err('otra-conexion', periodo(p.m, serie ? k1 + k2 : k1 * k2 / (k1 + k2)), 'usar la otra conexión', 'otra conexión');
        err('solo-primero', periodo(p.m, k1), 'usar solo el primer resorte', 'solo primero'); err('medio', valor / 2, 'contar medio ciclo', 'medio ciclo'); err('doble', 2 * valor, 'contar dos ciclos', 'dos ciclos');
        err('masa-doble', periodo(2 * p.m, keq), 'duplicar la masa del bloque', 'masa duplicada'); err('rigidez-doble', periodo(p.m, 2 * keq), 'duplicar la rigidez del conjunto', 'rigidez duplicada');
      } else if (tipo === 'paralelo-inversa' || tipo === 'serie-inversa') {
        const serie = tipo.startsWith('serie'); pi = false; clave = 'k'; unidad = 'N/m';
        keq = p.m * (2 / p.q) ** 2; valor = serie ? keq * p.k1 / (p.k1 - keq) : keq - p.k1;
        enunciado = ['Un bloque de ', Q('m', p.m, 'kg'), ' oscila con dos resortes ', serie ? 'en serie' : 'en paralelo', '. Uno tiene rigidez ', Q('k', p.k1, 'N/m'), ' y el período es ', numero('T', p.q * Math.PI, 's', true), '. ¿Cuál es la otra rigidez?'];
        regla = paso('El período permite conocer la rigidez del conjunto antes de separar el aporte de cada resorte. Elevamos al cuadrado para quitar la raíz y despejamos esa rigidez equivalente.', [sup(S.T), ' · ', K, ' = 4π² · ', S.m]);
        cuentas = [paso('Dividimos ambos lados entre el período al cuadrado para aislar la rigidez equivalente. Sustituimos el período completo y la masa del bloque que oscila.', [K, ' = ', frac(['4π² · ', S.m], sup(S.T)), '   ;   ', K, ' = ', frac(['4π² · ', Q('m', p.m, 'kg')], sup(['(', numero('T', p.q * Math.PI, 's', true), ')'])), '   ;   ', K, ' = ', Q('k', keq, 'N/m')]),
          serie ? paso('En serie se suman los inversos. Restamos el inverso conocido y luego invertimos para dejar sola la segunda rigidez; restar directamente las rigideces correspondería a otra conexión.', [frac('1', K2), ' = ', frac('1', K), ' - ', frac('1', K1), '   ;   ', K2, ' = ', frac([Q('k', keq, 'N/m'), ' · ', Q('k', p.k1, 'N/m')], [Q('k', p.k1, 'N/m'), ' - ', Q('k', keq, 'N/m')]), '   ;   ', K2, ' = ', numero('k', valor, unidad)]) :
            paso('En paralelo, la rigidez del conjunto es la suma de las dos. Restamos la rigidez conocida para hallar cuánto aporta el segundo resorte.', [K, ' = ', K1, ' + ', K2, '   ;   ', K2, ' = ', Q('k', keq, 'N/m'), ' - ', Q('k', p.k1, 'N/m'), '   ;   ', K2, ' = ', numero('k', valor, unidad)])];
        sentido = serie ? 'La segunda rigidez supera a la del conjunto, como corresponde a una conexión en serie: el conjunto se alarga más porque reúne el alargamiento de ambos resortes.' : 'La segunda rigidez es el aporte que faltaba. Al sumarla con la primera recuperamos la rigidez equivalente que corresponde al período dado.';
        err('suma', keq + p.k1, 'sumar las rigideces conocidas', 'suma'); err('conjunto', keq, 'dar la rigidez del conjunto', 'conjunto');
        err('primero', p.k1, 'repetir la primera rigidez', 'primer resorte'); err('diferencia-inversa', serie ? keq - p.k1 : p.k1 - keq, 'restar en orden incorrecto', 'resta invertida');
      } else throw new Error(`Familia de resortes desconocida: ${tipo}`);
      const fmt = n => textoValor(n, unidad, pi), vistos = new Set([fmt(valor)]);
      errores = errores.filter(e => { const t = fmt(e.valor); if (vistos.has(t)) return false; vistos.add(t); return true; });
      if (errores.length < 4) throw new Error(`Faltan errores conceptuales distintos: ${tipo}`);
      errores = errores.slice(0, 4);
      const revision = {
        medio: 'El período requiere volver al extremo de salida; medio ciclo solo lleva al opuesto',
        doble: 'Se pide una sola ida y vuelta; contar dos ciclos duplica el tiempo',
        'masa-doble': 'La masa del enunciado no se duplicó; usa solo la masa que realmente oscila',
        'rigidez-doble': 'Ese cambio supone un resorte distinto; usa la rigidez indicada o la del conjunto',
        'sin-raiz': 'El período depende de una raíz; aplica la raíz al factor de cambio antes de multiplicar',
        'sin-cambio': 'Cambió una cantidad que fija el período; compara los estados inicial y final',
        inversa: 'Invertir la razón cambia el efecto previsto; la masa y la rigidez afectan de manera opuesta al período',
        'factor-cuatro': 'El período aparece al cuadrado en el despeje; usa el ciclo completo que da el enunciado',
        cuarto: 'Cambiar el período altera su cuadrado; usa el valor dado antes de despejar',
        mitad: 'El despeje ya deja sola la incógnita; una división adicional cambia la cantidad que buscas',
        natural: 'La amplitud se mide desde el equilibrio; resta el alargamiento de equilibrio al de liberación',
        equilibrio: 'Ese alargamiento ubica el equilibrio, no un extremo; compara equilibrio y punto de liberación',
        suma: tipo.includes('inversa') ? 'La rigidez desconocida no se obtiene sumando esos datos; despeja según la conexión de los resortes' : 'Ambos alargamientos parten de la misma referencia; su diferencia, no su suma, da la separación',
        'signo-alargamiento': 'La amplitud es una distancia; toma el valor absoluto de la diferencia entre ambos alargamientos',
        recorrido: 'El recorrido de un ciclo reúne varios tramos; la amplitud solo va del equilibrio a un extremo',
        'otra-conexion': 'La conexión determina qué se suma; revisa si coinciden las fuerzas o los alargamientos',
        'solo-primero': 'Los dos resortes actúan sobre el movimiento; calcula la rigidez del conjunto',
        conjunto: 'El período permite hallar el conjunto, pero falta separar el aporte del resorte conocido',
        primero: 'Repetir la rigidez conocida no determina la otra; despeja usando la relación de la conexión',
        'diferencia-inversa': 'Revisa la conexión: en paralelo se restan rigideces; en serie se restan sus inversos',
      };
      const motivo = e => e.id === 'doble' && clave !== 'T'
        ? clave === 'A' ? 'La distancia entre extremos contiene dos amplitudes; mide solo del equilibrio a un extremo' : 'Duplicar el resultado no corresponde al despeje; deja sola la incógnita sin añadir un factor'
        : revision[e.id];
      const ops = opciones(valor, errores.map(e => ({ valor: e.valor, error: `RES-${e.id}`, siFuera: `${motivo(e)}. Al ${e.causa}, obtendrías ${fmt(e.valor)}.` })), fmt);
      const cierreErrores = tipo.includes('inversa') ? 'Despeja el segundo resorte según la conexión, no el conjunto.'
        : tipo.startsWith('vertical') ? 'La amplitud se mide del equilibrio a un extremo.'
          : tipo.includes('estatico') ? 'Usa ambos resortes, la conexión dada y un ciclo.' : '';
      return { enunciado, datos, dibujo: figura(dibujoP, tipo), pide: `Buscamos ${clave === 'T' ? 'el período de una oscilación' : clave === 'm' ? 'la masa del bloque' : clave === 'A' ? 'la amplitud desde el equilibrio' : 'la rigidez pedida'}.`,
        tengo: 'Las cantidades y condiciones necesarias aparecen en el enunciado y en los Datos.', regla, cuentas, sentido,
        respuesta: [clave === 'k' && tipo.includes('inversa') ? K2 : S[clave], ' = ', numero(clave, valor, unidad, pi)], opciones: ops,
        caso: { tipo, ...p, valor, unidad, pi, errores: errores.map(e => ({ id: e.id, valor: e.valor })) },
        erroresEjemplo: errores.map(e => `Al ${e.causa}, sale ${fmt(e.valor)}.`).join(' ') + (cierreErrores ? ' ' + cierreErrores : '') };
    }
    const lista = [
      ['periodo', { m: 0.8, k: 20 }, 1, 'Un período con π'],
      ['razon-masa', { T0: 0.8, m0: 0.5, m1: 4.5 }, 1, 'Cambia la masa'],
      ['razon-rigidez', { T0: 1.2, k0: 20, k1: 80 }, 1, 'Cambia el resorte'],
      ['masa-periodo', { q: 0.4, k: 50 }, 1, 'Buscamos la masa'],
      ['rigidez-periodo', { q: 0.2, m: 0.8 }, 1, 'Buscamos la rigidez'],
      ['periodo-gramos', { gramos: 200, k: 80 }, 2, 'La masa estaba en gramos'],
      ['vertical-periodo', { m: 0.4, g: 10, sCm: 10 }, 2, 'El alargamiento permite medir'],
      ['vertical-amplitud', { m: 0.4, k: 20, g: 10, yCm: 32 }, 2, 'Dos referencias distintas'],
      ['paralelo-periodo', { m: 0.6, k1: 40, k2: 20 }, 2, 'Resortes lado a lado'],
      ['serie-periodo', { m: 0.8, k1: 40, k2: 40 }, 2, 'Resortes uno tras otro'],
      ['paralelo-estatico', { mc: 0.4, g: 10, sCm: 5, k2: 20, m: 1 }, 3, 'Calibrar y conectar en paralelo'],
      ['serie-estatico', { mc: 0.5, g: 10, sCm: 5, k2: 100, m: 0.5 }, 3, 'Calibrar y conectar en serie'],
      ['paralelo-inversa', { q: 0.2, m: 0.6, k1: 20 }, 3, 'Una rigidez en paralelo desconocida'],
      ['serie-inversa', { q: 0.4, m: 0.8, k1: 60 }, 3, 'Una rigidez en serie desconocida'],
      ['vertical-desde-periodo', { q: 0.2, m: 0.5, g: 10, yCm: 22 }, 3, 'Del período a la amplitud'],
    ];
    const ejemplos = lista.map(([tipo, p, nivel, titulo], n) => ejemplo(caso(tipo, p), nivel, titulo, n >= 10 ? (15 - n) % 5 : 0));
    const tiempo = val => red(Math.round(Number(val.t || 0) * 100) / 100);
    const tJuego = val => periodo(0.5, Number(val.k));
    const xJuego = val => 8 * Math.cos(2 * Math.PI * tiempo(val) / tJuego(val));
    const juego = val => carrito(xJuego(val), { A: 8, textos: [
      { x: 12, y: 48, texto: 'm = 0,5 kg', color: 'f' }, { x: 308, y: 48, texto: `k = ${f(Number(val.k))} N/m`, color: 'f', ancla: 'end' },
      { x: 308, y: 208, texto: `T ≈ ${f(tJuego(val))} s`, color: 'h', ancla: 'end' }], alt: 'El bloque oscila horizontalmente con masa y amplitud fijas; solo se cambia la rigidez del resorte.' });
    const antes = est(carrito(8, { A: 8, rotuloX: false, textos: [{ x: 12, y: 48, texto: 'Mismo resorte', color: 'f' }, { x: 308, y: 48, texto: 'Masa nueva: cuatro veces', color: 'f', ancla: 'end' }] }));
    const despues = est(carrito(8, { A: 8, rotuloX: false, textos: [{ x: 12, y: 48, texto: 'Mismo resorte', color: 'f' }, { x: 308, y: 48, texto: 'T = 1,2 s', color: 'h', ancla: 'end' }] }));
    glosario.push(
      { termino: 'rigidez equivalente', formas: ['rigidez equivalente'], simple: 'La dureza de varios resortes trabajando juntos, como los que sostienen una misma base.', def: 'Rigidez de un solo resorte que produce la misma fuerza que el conjunto ante el mismo desplazamiento del bloque.', ejemplos: ['Dos resortes pueden representarse por una rigidez del conjunto.', 'La conexión cambia cómo se combinan las rigideces.', 'El bloque responde a la fuerza total de los resortes.'] },
      { termino: 'resortes en serie', formas: ['resortes en serie'], simple: 'Resortes enganchados uno tras otro, como eslabones entre un soporte y un objeto.', def: 'Conexión de resortes ideales consecutivos: transmiten la misma fuerza y sus alargamientos se suman.', ejemplos: ['Una pared, dos resortes consecutivos y un bloque forman una conexión en serie.', 'La unión entre los resortes tiene masa despreciable.', 'El desplazamiento del bloque reúne los alargamientos de ambos resortes.'] },
      { termino: 'resortes en paralelo', formas: ['resortes en paralelo'], simple: 'Resortes colocados lado a lado que ayudan a sostener un mismo objeto.', def: 'Conexión en la que los resortes comparten el desplazamiento del bloque y sus fuerzas se suman.', ejemplos: ['Dos resortes unen una misma pared y un mismo bloque.', 'Los dos extremos unidos al bloque se desplazan la misma distancia.', 'La fuerza total sobre el bloque incluye la de cada resorte.'] },
    );
    return {
      id: 'periodo-resorte', titulo: 'El ritmo del bloque', pregunta: '¿Cómo influyen el bloque y el resorte en la duración del vaivén?', temas: ['Masa-resorte horizontal y vertical'], pieza: 'fis-estatica',
      aprendizaje: 'Calculo el período con masa y rigidez; ubico el equilibrio vertical y distingo conexiones de dos resortes.', actividad: 'Cambiar el resorte y observar cuánto tarda el mismo bloque en completar un ciclo.',
      lee: { tarjetas: [
        { titulo: 'El mismo bloque', texto: ['El bloque tiene masa ', S.m, '. La rigidez ', S.k, ' indica cuánta fuerza ejerce el resorte por cada metro que se deforma. Un resorte más rígido necesita más fuerza para el mismo estiramiento. Conserva el bloque y compara, con el reloj, cuánto dura un ciclo en cada resorte.'], dibujo: est(juego({ k: 12.5, t: 0 })) },
        { titulo: 'Colgado de un soporte', texto: ['En vertical, el peso estira el resorte hasta que ambas fuerzas se equilibran. La posición ', S.x, ' se mide desde ese equilibrio; el alargamiento ', S.delta, ' se mide desde la longitud natural, cuando el resorte no está estirado. Son referencias distintas: un bloque quieto puede tener el resorte alargado.'] },
        { titulo: 'Dos resortes y un bloque', texto: 'Los resortes en serie van uno después de otro; los que están en paralelo actúan juntos sobre el bloque. La rigidez equivalente es la de un solo resorte que haría la misma fuerza con el mismo desplazamiento. Sirve para describir el conjunto como si fuera un resorte.' },
      ] },
      juega: { pieza: 'fis-estatica', consigna: 'Cambia la rigidez del resorte. Conserva el bloque y la amplitud; usa el reloj para seguir una ida y vuelta.', voz: 'Mira cuánto tarda en regresar al mismo extremo.',
        mision: { texto: 'Consigue un período que, redondeado a dos decimales, sea 0,63 s.', logrado: val => Math.round(tJuego(val) * 100) === 63, bien: 'Ese resorte completa cada ciclo en aproximadamente 0,63 s.' },
        leyenda: [{ s: S.m, t: 'masa fija del bloque' }, { s: S.k, t: 'rigidez del resorte elegido' }, { s: S.A, t: 'distancia fija del equilibrio a un extremo' }, { s: S.x, t: 'posición desde el equilibrio' }, { s: S.T, t: 'tiempo de un ciclo completo' }, { s: S.t, t: 'tiempo desde el extremo derecho' }],
        controles: [{ id: 'k', etiqueta: 'Rigidez, k', inicio: 12.5, unidad: 'N/m', color: 'c-f', opciones: [12.5, 50, 112.5, 200].map(valor => ({ valor, texto: `${f(valor)} N/m` })) },
          { id: 't', etiqueta: 'Tiempo, t', min: 0, max: 2, paso: 0.01, inicio: 0, unidad: 's', decimales: 2, color: 'c-h', auto: { velocidad: 0.25 } }],
        dibujo: val => est(juego(val)), lectura: val => [S.T, ' ≈ ', Q('T', tJuego(val), 's'), '   ;   ', S.t, ' = ', Q('t', tiempo(val), 's')], resumen: { k: 50, t: 0 }, minimo: 3 },
      predice: { pregunta: 'Con el mismo resorte, se cuadruplica la masa. Si antes el período era 0,6 s, ¿cuánto dura ahora cada ciclo?', datos: datosBase, dibujo: antes, revelar: despues,
        opciones: opciones(0.6 * Math.sqrt(4), [
          { valor: 0.6 / Math.sqrt(4), error: 'RES-INV-MASA', siFuera: 'Si inviertes la razón de masas, obtienes 0,3 s y predices un ciclo más corto. La masa aumentó con el mismo resorte: revisa cuál masa debe ir arriba al comparar los períodos.' },
          { valor: 0.6, error: 'RES-IGNORA-MASA', siFuera: 'Si mantienes 0,6 s, supones que la masa no influye. Con el mismo resorte, una masa mayor recibe menor aceleración; por eso también debes revisar la duración del ciclo.' },
          { valor: 0.6 * 4, error: 'RES-LINEAL-MASA', siFuera: 'Si multiplicas directamente por cuatro, obtienes 2,4 s. El período depende de la raíz de la masa: toma la raíz del factor de cambio antes de multiplicar.' },
        ], n => `${f(n)} s`), coincide: 'La raíz de cuatro es dos: el ciclo tarda el doble.' },
      mira: { pieza: 'fis-estatica', datos: despues.datos, pasos: [
        paso('La masa se resiste a cambiar de velocidad y el resorte la devuelve al centro. La relación del período combina ambos efectos: crece con la raíz de la masa y disminuye con la rigidez.', eqPeriodo(S.k)),
        paso('Al dividir los períodos, la rigidez común se cancela. Queda la raíz de la razón de masas: cuadruplicar la masa multiplica por dos la duración del ciclo.', [frac(sub(S.T, '1'), sub(S.T, '0')), ' = ', raiz(frac(sub(S.m, '1'), sub(S.m, '0'))), ' = √4 = 2']),
        paso('Multiplicamos el período inicial por el factor obtenido. El resultado significa que el bloque tarda el doble en completar la misma ida y vuelta.', [sub(S.T, '1'), ' = ', Q('T', 0.6, 's'), ' · 2 = ', Q('T', 1.2, 's')]),
        paso('En equilibrio, la fuerza del resorte iguala al peso. Dividir el peso entre la rigidez ubica ese punto; la oscilación se mide desde allí, no desde la longitud natural.', [S.k, ' · ', D, ' = ', S.m, ' · ', S.g, '   ;   ', D, ' = ', frac([S.m, ' · ', S.g], S.k)]),
        paso('En paralelo, ambos resortes se desplazan igual y suman sus fuerzas sobre el bloque. Por eso sumamos las rigideces para representar el conjunto mediante un solo resorte.', [K, ' = ', K1, ' + ', K2]),
        paso('En serie, la misma fuerza alarga los dos resortes y el desplazamiento total reúne ambos alargamientos. Por eso se suman los inversos de las rigideces.', [frac('1', K), ' = ', frac('1', K1), ' + ', frac('1', K2)]),
      ] },
      regla: { texto: 'El período es la duración del ciclo. La masa dificulta cambiar la velocidad y la rigidez equivalente mide la fuerza del conjunto por desplazamiento; por eso más masa alarga el ciclo y mayor rigidez lo acorta. Por ejemplo, dos resortes en paralelo empujan juntos: sus fuerzas se suman y el mismo bloque oscila más rápido.', ecuacion: eqPeriodo(K),
        condicion: 'los resortes tienen masa despreciable, cumplen la ley de Hooke y el movimiento no pierde energía por rozamiento. La posición se mide desde el equilibrio; si el resorte deja de cumplir esa ley o hay rozamiento, esta relación deja de describirlo.', dibujo: figura({ m: 0.6, k1: 40, k2: 20 }, 'paralelo-periodo') },
      ejemplos,
      resuelve: { pieza: 'fis-estatica', generar(s) {
        const n = 1 + Math.floor(s / 4) % 19;
        switch (s % 4) {
          case 0: return resuelto(caso('masa-periodo', { k: 12 + 4 * n, q: 0.6 }));
          case 1: { const sCm = [2.5, 22.5, 40][n % 3]; return resuelto(caso('vertical-periodo', { m: red(sCm * (20 + 4 * n) / 1000), g: 10, sCm })); }
          case 2: return resuelto(caso('serie-periodo', { m: red((12 + 4 * n) * 0.08), k1: 12 + 4 * n, k2: 12 + 4 * n }));
          default: return resuelto(caso('paralelo-inversa', { m: red((30 + 10 * n) * 0.04), q: 0.4, k1: 10 + 5 * n }));
        }
      } },
      ahoraTu: { pieza: 'fis-estatica', generar(s) {
        const n = 1 + Math.floor(s / 8) % 23;
        switch (s % 8) {
          case 0: return pregunta(caso('periodo', { m: red((18 + 6 * n) * 0.04), k: 18 + 6 * n }));
          case 1: return pregunta(caso('razon-masa', { T0: red(0.3 + 0.1 * n), m0: red(0.2 + 0.04 * n), m1: red((0.2 + 0.04 * n) * 6.25) }));
          case 2: return pregunta(caso('razon-rigidez', { T0: red(0.4 + 0.2 * n), k0: 12 + 4 * n, k1: 9 * (12 + 4 * n) }));
          case 3: return pregunta(caso('rigidez-periodo', { m: red(0.3 + 0.1 * n), q: 0.5 }));
          case 4: return pregunta(caso('vertical-amplitud', { m: red(0.24 + 0.02 * n), k: red((0.24 + 0.02 * n) * 50), g: 10, yCm: 22 + n / 2 }));
          case 5: return pregunta(caso('paralelo-periodo', { m: red((24 + 6 * n) * 0.04), k1: 8 + 2 * n, k2: 16 + 4 * n }));
          case 6: return pregunta(caso('serie-inversa', { m: red((10 + 5 * n) * 0.09), q: 0.6, k1: 3 * (10 + 5 * n) }));
          default: return pregunta(caso('vertical-desde-periodo', { m: red(0.3 + 0.02 * n), q: 0.2, g: 10, yCm: 15 + n / 2 }));
        }
      } },
    };
  })();

  // 5. Péndulo pequeño: la gravedad declarada y la linealización son aproximaciones.
  const idea5 = (() => {
    const periodo = (L, g) => 2 * Math.PI * Math.sqrt(L / g);
    const T1 = sub(S.T, '1'), T2 = sub(S.T, '2'), L1 = sub(S.L, '1'), L2 = sub(S.L, '2');
    const g1 = sub(S.g, '1'), g2 = sub(S.g, '2');
    const FORMULA = [S.T, ' ≈ 2π · ', raiz(frac(S.L, S.g))];
    const RAZON = [frac(T2, T1), ' ≈ ', raiz(frac([L2, ' · ', g1], [L1, ' · ', g2]))];
    // 150 px/m para ambos ensayos. La cuerda y la cota llegan al centro de la pesa.
    function figura(items, o = {}) {
      const d = { alto: 296, objetos: [], lineas: [], cotas: [], textos: [], angulos: [],
        alt: o.esquema ? 'Péndulo simple al soltarlo desde una inclinación pequeña. Esquema sin escala.' : `${items.length === 1 ? 'Un péndulo pequeño' : 'Dos péndulos pequeños'}. La longitud se mide del apoyo al centro de cada pesa, con la misma escala.` };
      items.forEach((p, j) => {
        const cx = items.length === 1 ? 160 : 80 + 160 * j, y = 58;
        const largo = o.esquema ? 132 : 150 * p.L;
        const theta = p.theta === undefined ? 8 : p.theta;
        const bob = [cx + largo * Math.sin(theta * Math.PI / 180), y + largo * Math.cos(theta * Math.PI / 180)];
        const radio = p.m >= 0.08 ? 8 : 5;
        d.objetos.push({ tipo: 'viga', x0: cx - 32, x1: cx, y }, { tipo: 'cuerda', de: [cx, y], a: bob }, { tipo: 'pelota', x: bob[0], y: bob[1], r: radio });
        d.lineas.push({ de: [cx, y + 2], a: [cx, y + largo + 4], discontinua: true });
        d.textos.push({ x: cx, y: 20, texto: p.titulo || 'Péndulo simple', ancla: 'middle' });
        if (p.m !== undefined) d.textos.push({ x: cx, y: 242, texto: `m = ${f(p.m * 1000)} g`, color: 'f', ancla: 'middle' });
        d.cotas.push({ de: [cx, y], a: bob, lado: items.length === 2 && j === 0 ? -1 : 1, sep: 27, color: 'i' });
        d.textos.push({ x: cx, y: 226, texto: p.ocultarL ? 'L = ?' : `L = ${f(p.L * 100)} cm`, color: 'i', ancla: 'middle' });
        if (p.T !== undefined) d.textos.push({ x: cx, y: 268, texto: `T ≈ ${f(p.T)} s`, color: 'h', ancla: 'middle' });
        d.textos.push({ x: cx, y: 42, texto: `θ ≈ ${f(theta)}°`, color: 'h', ancla: 'middle' });
      });
      if (o.esquema) d.textos.push({ x: 160, y: 286, texto: 'Esquema sin escala', ancla: 'middle' });
      return est(d);
    }
    function caso(tipo, p) {
      let valor, unidad = 's', clave = 'T', enunciado, formula = FORMULA, cuentas, sentido, malos;
      const err = (valor, id, corta, siFuera) => ({ valor, id, corta, siFuera: `${siFuera}` });
      let datos = ['Péndulo simple: hilo inextensible de masa despreciable, apoyo fijo y sin rozamiento.', 'Amplitud angular de 8°; modelo aproximado de ángulo pequeño.'];
      const calcT = L => periodo(L, p.g);
      if (p.g !== undefined) datos.push([S.g, ' ≈ ', Q('g', p.g, 'm/s²'), ', valor usado para el cálculo.']);
      switch (tipo) {
        case 'longitud-centro':
          valor = p.hilo + p.radio; unidad = 'cm'; clave = 'L';
          enunciado = ['El hilo libre mide ', Q('L', p.hilo, 'cm'), ' y la pesa esférica tiene radio ', Q('L', p.radio, 'cm'), '. ¿Qué longitud llega del apoyo al centro de la pesa?'];
          formula = [S.L, ' = longitud del hilo + radio de la pesa'];
          cuentas = [paso('Sumamos el radio al hilo: el modelo concentra la masa en el centro de la pesa, no en su superficie.', [S.L, ' = ', Q('L', p.hilo), ' + ', Q('L', p.radio), ' = ', Q('L', valor, unidad)])];
          sentido = 'Esta longitud llega al centro de la pesa, donde situamos toda su masa en el modelo. Medir solo el hilo dejaría fuera parte de ese recorrido.';
          malos = [err(p.hilo, 'solo-hilo', 'solo hilo', 'Tomaste solo el hilo, que termina en la superficie de la pesa. La longitud del modelo debe llegar hasta su centro; falta sumar el radio.'), err(p.hilo - p.radio, 'resta-radio', 'resta radio', 'Restaste el radio como si el centro estuviera dentro del hilo. Está más abajo que el extremo del hilo, por eso hay que sumar ese tramo.'), err(p.hilo + 2 * p.radio, 'diametro', 'suma diámetro', 'Sumaste el diámetro y llegaste al borde inferior de la pesa. El modelo pide llegar a su centro: desde la superficie basta un radio.'), err(2 * p.hilo + p.radio, 'doble-hilo', 'duplica hilo', 'Contaste dos veces el hilo, como si la longitud fuera una ida y vuelta. Aquí medimos una sola distancia, desde el apoyo hasta el centro.')]; break;
        case 'periodo': case 'periodo-cm': {
          const L = tipo === 'periodo' ? p.L : p.Lcm / 100;
          valor = calcT(L);
          enunciado = ['Un péndulo tiene longitud ', Q('L', tipo === 'periodo' ? p.L : p.Lcm, tipo === 'periodo' ? 'm' : 'cm'), '. ¿Cuál es su período aproximado?'];
          cuentas = [];
          if (tipo === 'periodo-cm') { datos.push('1 m = 100 cm.'); cuentas.push(paso('Pasamos la longitud a metros para combinarla con la gravedad, expresada en metros por segundo al cuadrado.', [S.L, ' = ', Q('L', p.Lcm), ' ÷ 100 = ', Q('L', L, 'm')])); }
          cuentas.push(paso('Usamos el modelo de ángulo pequeño porque la inclinación dada es pequeña. La longitud y la gravedad determinan cuánto tarda una ida y vuelta.', [S.T, ' ≈ 2π · ', raiz(frac(Q('L', L), Q('g', p.g))), ' ≈ ', Q('T', valor, 's')]));
          sentido = 'Este tiempo corresponde a volver al punto de partida con el mismo sentido de movimiento. Es aproximado porque tratamos la pequeña oscilación como un movimiento armónico.';
          malos = [err(valor / 2, 'medio-ciclo', 'medio ciclo', 'Calculaste solo medio ciclo. Llegar al extremo contrario no completa el período: la pesa debe volver al extremo del que partió.'), err(valor / (2 * Math.PI), 'sin-2pi', 'omitiste el factor 2π', 'Omitiste el factor 2π del período. La raíz relaciona longitud y gravedad, pero por sí sola no da el tiempo de una vuelta completa.'), err(2 * Math.PI * L / p.g, 'sin-raiz', 'no extrajiste la raíz', 'Usaste la razón sin extraer su raíz. El período cambia con la raíz de esa razón, no en la misma proporción.'), err(1 / valor, 'frecuencia', 'da frecuencia', 'Invertiste el período y obtuviste ciclos por segundo. Se pide el tiempo de un ciclo, por eso la respuesta debe estar en segundos.')]; break;
        }
        case 'masa':
          valor = p.T; enunciado = ['Un péndulo tarda aproximadamente ', Q('T', p.T, 's'), ' por ciclo. Cambiamos la pesa de ', Q('m', p.m1, 'g'), ' por otra de ', Q('m', p.m2, 'g'), ', conservando longitud y gravedad. ¿Cuál será el período?'];
          formula = [T2, ' ≈ ', T1, ' si no cambian L ni g'];
          cuentas = [paso('Al aumentar la masa también aumenta su peso en la misma proporción. La aceleración del vaivén no cambia; con igual longitud y gravedad se mantiene el período.', [T2, ' ≈ ', Q('T', valor, 's')])];
          sentido = 'La pesa más pesada no necesita más tiempo por ser más pesada: también recibe una fuerza mayor. En este modelo ambas completan el ciclo aproximadamente al mismo tiempo.';
          malos = [err(valor * Math.sqrt(p.m2 / p.m1), 'raiz-masa', 'incluye raíz de masas', 'Aplicaste la raíz de las masas, como en el resorte. En el péndulo, peso y masa aumentan juntos y ese factor se cancela; compara longitud y gravedad.'), err(valor * p.m2 / p.m1, 'masa-directa', 'incluye masas', 'Hiciste crecer el período con la masa. Una pesa mayor también recibe mayor peso; ambos efectos se compensan en este modelo y no cambian el período.'), err(valor / Math.sqrt(p.m2 / p.m1), 'raiz-inversa-masa', 'divide por raíz', 'Dividiste por la raíz de las masas para hacer más rápida la pesa mayor. Su peso aumenta, pero también su masa; la aceleración del vaivén no cambia.'), err(valor * p.m1 / p.m2, 'masa-inversa', 'divide por masas', 'Supusiste que una pesa mayor tarda menos por recibir más peso. También cuesta más acelerarla; con la misma longitud y gravedad, el período no cambia.')]; break;
        case 'frecuencia':
          valor = 1 / p.T; unidad = 'Hz'; clave = 'f';
          enunciado = ['El período aproximado de un péndulo es ', Q('T', p.T, 's'), '. ¿Cuál es su frecuencia?'];
          formula = [S.f, ' = ', frac('1', S.T)];
          cuentas = [paso('Dividimos un ciclo entre el tiempo que tarda: así pasamos de segundos por ciclo a ciclos por segundo, que es la frecuencia.', [S.f, ' ≈ ', frac('1', Q('T', p.T)), ' = ', Q('f', valor, 'Hz')])];
          sentido = 'El resultado indica cuántas oscilaciones completas ocurren por segundo. No es la duración de una oscilación: esa magnitud es el período.';
          malos = [err(p.T, 'periodo', 'da período', 'Copiaste el tiempo de un ciclo. La frecuencia pregunta cuántos ciclos caben en un segundo; hay que invertir el período, no cambiarle solo la unidad.'), err(2 / p.T, 'medios', 'cuenta medios ciclos', 'Contaste cada ida como un ciclo completo. Un ciclo incluye ida y vuelta, así que ese conteo duplica la frecuencia.'), err(1 / (2 * p.T), 'dobles', 'junta dos ciclos', 'Juntaste dos idas y vueltas en un solo ciclo. Cada ida y vuelta ya es una oscilación completa; no hace falta duplicar su duración.'), err(1 / (p.T * p.T), 'cuadrado', 'eleva período', 'Elevaste el período al cuadrado sin que la definición lo requiera. La frecuencia es un ciclo dividido entre su duración, no entre el cuadrado de esa duración.')]; break;
        case 'razon': {
          valor = Math.sqrt(p.L2 * p.g1 / (p.L1 * p.g2)); unidad = ''; clave = 'T'; formula = RAZON;
          enunciado = ['Dos péndulos tienen longitudes ', Q('L', p.L1, 'm'), ' y ', Q('L', p.L2, 'm'), '. ¿Cuál es la razón de períodos segundo/primero?'];
          datos.push([g1, ' ≈ ', Q('g', p.g1, 'm/s²'), '; ', g2, ' ≈ ', Q('g', p.g2, 'm/s²'), '.'], ['Masas respectivas: ', Q('m', p.m1, 'g'), ' y ', Q('m', p.m2, 'g'), '.']);
          cuentas = [paso('Dividimos el período del segundo péndulo entre el del primero. Así se cancela el factor común 2π y quedan los cambios de longitud y gravedad.', [frac(T2, T1), ' ≈ ', raiz(frac([Q('L', p.L2), ' · ', Q('g', p.g1)], [Q('L', p.L1), ' · ', Q('g', p.g2)])), ' ≈ ', Q('T', valor)])];
          sentido = valor > 1 ? 'La razón supera la unidad: cada ciclo del segundo péndulo dura más que el del primero. No estamos comparando cuántos ciclos ocurren en ese tiempo.' : 'La razón es menor que la unidad: cada ciclo del segundo péndulo dura menos que el del primero. No estamos comparando cuántos ciclos ocurren en ese tiempo.';
          malos = [err(valor * valor, 'sin-raiz', 'no extrajiste la raíz', 'Usaste la razón sin extraer su raíz. El período cambia con la raíz de esa razón, no en la misma proporción.'), err(1 / valor, 'invierte', 'invierte comparación', 'Dividiste el período inicial entre el nuevo. La pregunta pide el orden contrario; identifica qué péndulo corresponde al numerador antes de calcular.'), err(valor * Math.sqrt(p.m2 / p.m1), 'incluye-masa', 'incluye masas', 'Añadiste la raíz de la razón de masas como si fueran bloques con resorte. En el péndulo simple la masa se cancela; solo deben intervenir longitud y gravedad.'), err(valor / Math.sqrt(p.m2 / p.m1), 'divide-masa', 'divide por masas', 'Dividiste entre la raíz de la razón de masas como si modificaran el período. En este modelo no lo hacen: compara la longitud y la gravedad de cada péndulo.')]; break;
        }
        case 'longitud': case 'longitud-ciclos': {
          const T = tipo === 'longitud' ? p.T : p.dt / p.N;
          valor = p.g * (T / (2 * Math.PI)) ** 2; unidad = 'm'; clave = 'L';
          enunciado = tipo === 'longitud' ? ['Un péndulo tiene período aproximado de ', Q('T', p.T, 's'), '. ¿Qué longitud corresponde a ese período?'] : ['Un péndulo completa ', Q('N', p.N), ' oscilaciones en ', Q('t', p.dt, 's'), '. ¿Cuál es su longitud aproximada?'];
          cuentas = [paso(tipo === 'longitud' ? 'Dividimos el período entre 2π y elevamos al cuadrado para eliminar la raíz. Luego multiplicamos por la gravedad para dejar sola la longitud.' : 'Dividimos el tiempo total entre los ciclos para hallar un período. Después eliminamos la raíz del modelo elevando al cuadrado y despejamos la longitud.', tipo === 'longitud' ? [S.L, ' ≈ ', S.g, ' · ', sup(frac(S.T, '2π'))] : [S.T, ' = ', frac(Q('t', p.dt), Q('N', p.N)), ' = ', Q('T', T, 's'), '; ', S.L, ' ≈ ', S.g, ' · ', sup(frac(S.T, '2π'))]), paso('Reemplazamos el período de un ciclo, no el tiempo de todas las oscilaciones. Así obtenemos la longitud que produce ese ritmo de vaivén.', [S.L, ' ≈ ', Q('g', p.g), ' · ', sup(frac(Q('T', T), '2π')), ' ≈ ', Q('L', valor, 'm')])];
          sentido = 'El resultado es la distancia que debe haber entre el apoyo y el centro de la pesa para lograr el período indicado, dentro de la aproximación usada.';
          malos = [err(valor * 4, 'sin-dos', 'omitiste el factor dos', 'Omitiste el dos al despejar el período. Ese factor también debe elevarse al cuadrado; retirarlo cambia la longitud calculada.'), err(valor / 4, 'medio-periodo', 'usaste solo medio período', 'Usaste el tiempo de media oscilación. La relación pide una ida y vuelta completa; al elevar al cuadrado, ese error también cambia la longitud.'), err(p.g * T / (4 * Math.PI ** 2), 'sin-cuadrado', 'no elevaste al cuadrado', 'Dejaste el período sin elevar al cuadrado. Para despejar la longitud hay que eliminar la raíz del modelo, elevando al cuadrado ambos lados.'), err(valor * 4 * Math.PI ** 2, 'sin-2pi', 'omitiste el factor 2π', 'Eliminaste el factor 2π en lugar de dividir entre él. Al despejar la longitud, primero se divide el período entre ese factor y luego se eleva al cuadrado.')]; break;
        }
        case 'duracion':
          valor = p.N * calcT(p.L); clave = 't';
          enunciado = ['Un péndulo de ', Q('L', p.L, 'm'), ' completa ', Q('N', p.N), ' oscilaciones. ¿Cuánto tarda aproximadamente?'];
          cuentas = [paso('Calculamos primero cuánto tarda una sola ida y vuelta. La cantidad de ciclos todavía no interviene en ese período.', [S.T, ' ≈ 2π · ', raiz(frac(Q('L', p.L), Q('g', p.g)))]), paso('Como todos los ciclos tardan lo mismo, multiplicamos su período por la cantidad de oscilaciones. Conservamos el valor sin redondear hasta obtener el tiempo total.', [S.t, ' = ', S.N, ' · ', S.T, ' ≈ ', Q('N', p.N), ' · 2π · ', raiz(frac(Q('L', p.L), Q('g', p.g))), '   ;   ', S.t, ' ≈ ', Q('t', valor, 's')])];
          sentido = 'Este es el tiempo de todas las idas y vueltas contadas. Debe superar el período de un solo ciclo porque se observaron varias oscilaciones.';
          malos = [err(calcT(p.L), 'un-ciclo', 'contaste solo un ciclo', 'Calculaste el período de una sola oscilación. Se pide la duración de varias, así que falta sumar ese tiempo tantas veces como ciclos hay.'), err(valor / 2, 'medios', 'cuenta medios ciclos', 'Asignaste media oscilación a cada ciclo. Cada ciclo contado incluye ida y vuelta, por lo que debe durar un período completo.'), err(p.N / calcT(p.L), 'divide', 'divide por período', 'Dividiste la cantidad de ciclos entre el período. Para obtener un tiempo total, cada ciclo aporta su duración: se multiplica, no se divide.'), err(p.N * valor, 'doble-conteo', 'cuenta ciclos dos veces', 'Multiplicaste dos veces por la cantidad de ciclos. El período ya se repitió esa cantidad una vez; volver a multiplicar cuenta oscilaciones de más.')]; break;
        case 'gravedad':
          valor = 4 * Math.PI ** 2 * p.L / p.T ** 2; unidad = 'm/s²'; clave = 'g';
          enunciado = ['Un péndulo de ', Q('L', p.L, 'm'), ' tiene período ', Q('T', p.T, 's'), '. ¿Qué gravedad local aproximada corresponde al modelo?'];
          cuentas = [paso('Elevamos al cuadrado para eliminar la raíz. Luego multiplicamos por la gravedad y dividimos entre el período al cuadrado para dejarla sola.', [S.g, ' ≈ ', frac(['4π² · ', S.L], sup(S.T))]), paso('Usamos la longitud y el período observados para estimar la gravedad que produciría ese vaivén. El período debe ir al cuadrado.', [S.g, ' ≈ ', frac(['4π² · ', Q('L', p.L)], sup(Q('T', p.T))), ' ≈ ', Q('g', valor, unidad)])];
          sentido = 'El resultado estima qué gravedad produciría el período observado para esa longitud. Es una deducción del modelo de ángulo pequeño, no una medición directa de un lugar real.';
          malos = [err(valor / (4 * Math.PI ** 2), 'sin-2pi', 'omitiste el factor 2π', 'Omitiste el factor 2π antes de elevar al cuadrado. Al despejar la gravedad hay que conservar todos los factores de la relación del período.'), err(4 * Math.PI ** 2 * p.L / p.T, 'sin-cuadrado', 'no elevaste al cuadrado', 'Dividiste entre el período sin elevarlo al cuadrado. Ese cuadrado aparece al eliminar la raíz; omitirlo cambia la gravedad que corresponde al vaivén.'), err(1 / valor, 'invierte', 'invierte cociente', 'Invertiste el resultado del despeje. La gravedad es proporcional a la longitud e inversamente proporcional al período al cuadrado, no al revés.'), err(valor / 4, 'sin-dos', 'omitiste el factor dos', 'Usaste π donde corresponde 2π. Al elevar al cuadrado para despejar la gravedad, el dos también debe elevarse al cuadrado.')]; break;
        case 'longitud-razon': {
          const q = p.T2 / p.T1; valor = p.L1 * q * q; unidad = 'm'; clave = 'L';
          enunciado = ['Un péndulo de ', Q('L', p.L1, 'm'), ' tarda ', Q('T', p.T1, 's'), ' por ciclo. En el mismo lugar, ¿qué longitud permite un período de ', Q('T', p.T2, 's'), '?'];
          formula = [frac(T2, T1), ' ≈ ', raiz(frac(L2, L1))];
          cuentas = [paso('La gravedad es la misma, por eso se cancela al comparar. Elevamos la razón de períodos al cuadrado para eliminar la raíz y despejar la nueva longitud.', [L2, ' ≈ ', L1, ' · ', sup(frac(T2, T1))]), paso('Dividimos el período nuevo entre el inicial y elevamos esa razón al cuadrado. Este factor indica por cuánto debe multiplicarse la longitud inicial.', [L2, ' ≈ ', Q('L', p.L1), ' · ', sup(frac(Q('T', p.T2), Q('T', p.T1))), ' ≈ ', Q('L', valor, 'm')])];
          sentido = 'Para cambiar el período no basta cambiar la longitud en la misma proporción: la raíz del modelo obliga a usar el cuadrado de la razón de períodos.';
          malos = [err(p.L1 * q, 'lineal', 'usaste la razón sin cuadrado', 'Cambiaste la longitud en la misma proporción que el período. Como el período depende de una raíz, al despejar la longitud debes elevar esa razón al cuadrado.'), err(p.L1 / (q * q), 'invierte', 'invertiste la razón pedida', 'Invertiste el orden de los períodos. Para obtener la longitud nueva desde la inicial, la razón debe llevar el período nuevo arriba y el inicial abajo.'), err(p.L1 * Math.sqrt(q), 'raiz', 'extrajiste otra raíz innecesaria', 'Extrajiste otra raíz, aunque necesitas deshacer la raíz que ya tiene el modelo. Para despejar la longitud se eleva la razón de períodos al cuadrado.'), err(p.L1 * q ** 3, 'cubo', 'elevaste al cubo', 'Elevaste la razón al cubo, pero el modelo contiene una raíz cuadrada. Se elimina elevando al cuadrado, no al cubo.')]; break;
        }
        case 'duracion-otro': {
          const T = p.dt / p.N1, q = Math.sqrt(p.g1 / p.g2); valor = p.N2 * T * q; clave = 't';
          enunciado = ['Un péndulo completa ', Q('N', p.N1), ' ciclos en ', Q('t', p.dt, 's'), '. Sin cambiar su longitud, ¿cuánto tardarán ', Q('N', p.N2), ' ciclos en otro entorno?'];
          datos.push([g1, ' ≈ ', Q('g', p.g1, 'm/s²'), '; ', g2, ' ≈ ', Q('g', p.g2, 'm/s²'), '.']);
          formula = [frac(T2, T1), ' ≈ ', raiz(frac(g1, g2))];
          cuentas = [paso('Dividimos el tiempo inicial entre los ciclos para hallar un período. Como la longitud no cambia, adaptamos ese período usando solo la razón de gravedades.', [T1, ' = ', frac(Q('t', p.dt), Q('N', p.N1)), ' = ', Q('T', T, 's'), '; ', T2, ' ≈ ', T1, ' · ', raiz(frac(g1, g2))]), paso('El nuevo período corresponde a una ida y vuelta. Lo multiplicamos por los ciclos pedidos para obtener la duración completa en el nuevo entorno.', [S.t, ' ≈ ', Q('N', p.N2), ' · ', Q('T', T), ' · ', raiz(frac(Q('g', p.g1), Q('g', p.g2))), ' ≈ ', Q('t', valor, 's')])];
          sentido = p.g2 < p.g1 ? 'Con la misma longitud, una gravedad menor devuelve la pesa más lentamente hacia el centro. Por eso cada ciclo del nuevo entorno tarda más.' : 'Con la misma longitud, una gravedad mayor acelera más el regreso de la pesa hacia el centro. Por eso cada ciclo del nuevo entorno tarda menos.';
          malos = [err(p.N2 * T / q, 'invierte-g', 'invertiste la razón de gravedades', 'Invertiste la razón de gravedades. Con longitud fija, una gravedad mayor acelera el retorno y reduce el período; la gravedad nueva debe quedar en el denominador.'), err(p.N2 * T * q * q, 'sin-raiz', 'no extrajiste la raíz', 'Usaste directamente la razón de gravedades. El período depende de su raíz; omitirla exagera el cambio en la duración de los ciclos.'), err(p.N2 * T, 'sin-cambio', 'ignoraste el cambio de gravedad', 'Conservaste el período aunque cambió la gravedad. La misma longitud no basta para mantener el ritmo: también importa cuánto acelera la gravedad el retorno.'), err(T * q, 'un-ciclo', 'contaste solo un ciclo', 'Calculaste el tiempo de una sola oscilación en el nuevo entorno. La pregunta pide varias; falta multiplicar ese período por los ciclos solicitados.')]; break;
        }
        case 'alargar': {
          const L = p.hilo + p.radio; valor = L * (p.factor * p.factor - 1); unidad = 'cm'; clave = 'L';
          enunciado = ['El hilo libre mide ', Q('L', p.hilo, 'cm'), ' y el radio de la pesa ', Q('L', p.radio, 'cm'), '. ¿Cuánto hilo añadimos para multiplicar el período por ', Q('T', p.factor), '?'];
          datos.push('La gravedad y la pesa no cambian.'); formula = [frac(T2, T1), ' ≈ ', raiz(frac(L2, L1))];
          cuentas = [paso('Sumamos hilo y radio para medir hasta el centro. Como la gravedad no cambia, la longitud nueva se obtiene multiplicando por el cuadrado de la razón de períodos.', [L1, ' = ', Q('L', p.hilo), ' + ', Q('L', p.radio), ' = ', Q('L', L, 'cm'), '   ;   ', L2, ' ≈ ', L1, ' · ', sup(Q('T', p.factor))]), paso('Restamos la longitud inicial de la nueva porque se pide cuánto hilo añadir, no cuánto debe medir todo el péndulo al final.', [L2, ' − ', L1, ' ≈ ', Q('L', L), ' · (', sup(Q('T', p.factor)), ' − 1) = ', Q('L', valor, 'cm')])];
          sentido = 'El radio de la pesa no cambia. Por eso toda la diferencia entre las longitudes inicial y final debe conseguirse añadiendo hilo.';
          malos = [err(L * p.factor ** 2, 'longitud-total', 'diste la longitud completa', 'Diste la longitud completa del péndulo nuevo. Se pide solo el hilo que hay que añadir, así que debes restar la longitud inicial.'), err(L * (p.factor - 1), 'lineal', 'usaste una razón lineal', 'Hiciste crecer la longitud en la misma proporción que el período. Debe crecer con el cuadrado de esa razón; después se resta la longitud inicial.'), err(p.hilo * (p.factor ** 2 - 1), 'solo-hilo', 'omitiste el radio de la pesa', 'Usaste solo el hilo como longitud inicial. El modelo mide hasta el centro de la pesa, así que también debe incluir su radio antes de comparar períodos.'), err(L / p.factor ** 2, 'inversa', 'invertiste la razón pedida', 'Invertiste la razón, aunque se busca alargar el período. Además respondiste con una longitud total; hay que calcular la nueva y restar la inicial.')]; break;
        }
        case 'gravedad-razon': {
          const t1 = p.dt1 / p.N1, t2 = p.dt2 / p.N2, q = t1 / t2, r = p.L2 / p.L1;
          valor = r * q * q; unidad = ''; clave = 'g';
          enunciado = ['Dos péndulos miden ', Q('L', p.L1, 'm'), ' y ', Q('L', p.L2, 'm'), '. ¿Cuál es la razón de gravedades segundo/primero?'];
          datos.push(['Primero: ', Q('N', p.N1), ' ciclos en ', Q('t', p.dt1, 's'), '.'], ['Segundo: ', Q('N', p.N2), ' ciclos en ', Q('t', p.dt2, 's'), '.']);
          formula = [frac(g2, g1), ' ≈ ', frac(L2, L1), ' · ', sup(frac(T1, T2))];
          cuentas = [paso('Los tiempos observados incluyen cantidades distintas de ciclos. Dividimos cada tiempo entre su propio conteo para comparar la duración de una sola oscilación.', [T1, ' = ', frac(Q('t', p.dt1), Q('N', p.N1)), ' = ', Q('T', t1, 's'), '; ', T2, ' = ', frac(Q('t', p.dt2), Q('N', p.N2)), ' = ', Q('T', t2, 's')]), paso('Al dividir las gravedades despejadas se cancelan los factores comunes. La longitud conserva el orden segundo/primero, mientras que los períodos quedan invertidos y al cuadrado.', [frac(g2, g1), ' ≈ ', frac(Q('L', p.L2), Q('L', p.L1)), ' · ', sup(frac(Q('T', t1), Q('T', t2))), ' ≈ ', Q('g', valor)])];
          sentido = 'La razón obtenida compara las gravedades, no solo el ritmo del vaivén. Para interpretarla tuvimos que considerar también las longitudes distintas.';
          malos = [err(r / (q * q), 'invierte-tiempo', 'invertiste la razón de períodos', 'Invertiste los períodos al comparar las gravedades. Como la gravedad despejada divide entre el período al cuadrado, los períodos deben llevar el orden contrario al de las longitudes.'), err(r * q, 'sin-cuadrado', 'no elevaste al cuadrado', 'Usaste los períodos sin elevar su razón al cuadrado. Ese cuadrado procede de eliminar la raíz del modelo y debe conservarse al comparar gravedades.'), err(q * q, 'sin-longitud', 'ignoraste las longitudes distintas', 'Comparaste solo los períodos como si las longitudes fueran iguales. Aquí también cambian las longitudes, y su razón debe entrar en la comparación de gravedades.'), err(r, 'sin-periodo', 'ignoraste los períodos distintos', 'Comparaste solo las longitudes e ignoraste cuánto tarda cada ciclo. La gravedad estimada depende también del período al cuadrado.')]; break;
        }
        default: throw new Error('Péndulo: familia desconocida ' + tipo);
      }
      const aproximado = tipo !== 'longitud-centro', fmt = n => `${aproximado ? '≈ ' : ''}${f(n)}${unidad ? ' ' + unidad : ''}`;
      const ops = opciones(valor, malos.map(e => ({ valor: e.valor, error: `OS-PEN-${e.id}`, siFuera: e.siFuera })), fmt);
      const Lfig = p.L || p.L1 || (p.Lcm ? p.Lcm / 100 : 0.6);
      const tengo = tipo === 'duracion' ? ['Conozco la longitud ', Q('L', p.L, 'm'), ', la gravedad aproximada ', Q('g', p.g, 'm/s²'), ' y ', Q('N', p.N), ' ciclos completos.']
        : tipo === 'longitud' ? ['Conozco el período ', Q('T', p.T, 's'), ' y la gravedad aproximada ', Q('g', p.g, 'm/s²'), '.']
          : tipo === 'gravedad' ? ['Conozco la longitud ', Q('L', p.L, 'm'), ' y el período ', Q('T', p.T, 's'), '.']
            : 'Comparo las longitudes, gravedades y masas indicadas de los dos péndulos.';
      const pedida = tipo === 'razon' ? 'la razón de períodos segundo/primero' : tipo === 'gravedad-razon' ? 'la razón de gravedades segundo/primero' : { T: 'el período', L: 'la longitud', t: 'el tiempo total de los ciclos', f: 'la frecuencia', g: 'la gravedad local aproximada' }[clave];
      return { enunciado, datos, dibujo: figura([{ L: Lfig, ocultarL: clave === 'L' || (p.L === undefined && p.L1 === undefined && p.Lcm === undefined), m: p.m1 ? p.m1 / 1000 : undefined }], { esquema: true }),
        pide: `Se pide ${pedida}.`, tengo,
        regla: paso('Elegimos la relación del péndulo que conecta la magnitud pedida con las longitudes, los tiempos o las gravedades disponibles.', formula), cuentas, sentido,
        respuesta: [aproximado ? '≈ ' : '', Q(clave, valor, unidad)], opciones: ops,
        caso: { tipo, ...p, valor, unidad, aproximado, errores: malos.map(e => ({ id: e.id, valor: e.valor })) },
        erroresEjemplo: malos.map(e => `${fmt(e.valor)}: ${e.corta}.`).join(' ') + ({
          'longitud-ciclos': ' El período es tiempo entre ciclos; al eliminar la raíz se despeja la longitud con su cuadrado.',
          'longitud-razon': ' La longitud nueva usa la razón de períodos al cuadrado, porque así eliminamos la raíz del modelo.',
          'duracion-otro': ' La gravedad cambia el período mediante una raíz; después se multiplica ese nuevo período por todos los ciclos.',
          alargar: ' Primero usamos la razón de períodos al cuadrado; después restamos la longitud inicial, porque se pide solo el aumento.',
          'gravedad-razon': ' La gravedad es proporcional a la longitud e inversamente proporcional al período al cuadrado; importan ambos cambios.',
        }[tipo] || '') };
    }
    const lista = [
      ['longitud-centro', { hilo: 47, radio: 3 }, 'Del apoyo al centro'],
      ['periodo', { L: 0.64, g: 10 }, 'Un ciclo pequeño'],
      ['masa', { T: 1.8, m1: 20, m2: 180 }, 'Otra pesa'],
      ['razon', { L1: 0.2, L2: 0.8, g1: 10, g2: 10, m1: 25, m2: 225 }, 'Comparar longitudes'],
      ['frecuencia', { T: 2.5 }, 'Ciclos en un segundo'],
      ['periodo-cm', { Lcm: 36, g: 10 }, 'Longitud en centímetros'],
      ['longitud', { T: 1.2, g: 10 }, 'Elegir la longitud'],
      ['duracion', { L: 0.81, g: 10, N: 12 }, 'Doce oscilaciones completas'],
      ['razon', { L1: 0.6, L2: 0.9, g1: 10, g2: 6, m1: 20, m2: 80 }, 'Dos entornos'],
      ['gravedad', { L: 0.5, T: 1.5 }, 'Estimar la gravedad'],
      ['longitud-ciclos', { dt: 50, N: 25, g: 10 }, 'Longitud desde varios ciclos'],
      ['longitud-razon', { L1: 0.45, T1: 1.5, T2: 2.1 }, 'Cambiar el ritmo'],
      ['duracion-otro', { N1: 20, dt: 30, N2: 30, g1: 10, g2: 5 }, 'Contar en otro entorno'],
      ['alargar', { hilo: 47, radio: 3, factor: 2 }, 'Añadir hilo'],
      ['gravedad-razon', { L1: 0.4, L2: 0.63, N1: 10, dt1: 20, N2: 20, dt2: 24 }, 'Comparar dos gravedades'],
    ];
    const ejemplos = lista.map(([t, p, titulo], i) => ejemplo(caso(t, p), 1 + Math.floor(i / 5), titulo, (5 - (i - 10)) % 5));
    const tiempo = v => Number(v.t.toFixed(2));
    function ensayos(v) {
      const ref = { L: 0.25, m: 0.04, g: 10 }, otro = v.experimento === 0 ? { ...ref, m: v.caso === 0 ? 0.04 : 0.08 } : { ...ref, L: v.caso === 0 ? 0.25 : 1 };
      return [ref, otro].map((p, j) => ({ ...p, titulo: j ? 'Ensayo' : 'Referencia', T: periodo(p.L, p.g), theta: 8 * Math.cos(Math.sqrt(p.g / p.L) * tiempo(v)) }));
    }
    const vista = v => figura(ensayos(v));
    const pred = { L1: 0.4, L2: 0.9, g1: 10, g2: 10, m1: 30, m2: 120 };
    const cp = caso('razon', pred), rp = cp.caso.valor;
    const predFigura = figura([{ L: pred.L1, m: pred.m1 / 1000, titulo: 'Inicial' }, { L: pred.L2, m: pred.m2 / 1000, titulo: 'Nuevo' }]);
    glosario.push(
      { termino: 'péndulo simple', formas: ['péndulo simple', 'péndulos simples'], simple: 'Una pesa que va y vuelve, como una arandela colgada de un hilo.', def: 'Modelo de una masa puntual colgada de un apoyo fijo mediante un hilo inextensible y de masa despreciable.', ejemplos: ['La longitud llega desde el apoyo hasta el centro de la pesa.', 'El hilo permanece tenso mientras la pesa se mueve.', 'Una pesa pequeña puede aproximarse por un punto situado en su centro.'] },
      { termino: 'aproximación de ángulo pequeño', formas: ['aproximación de ángulo pequeño', 'ángulo pequeño'], simple: 'Un modelo para vaivenes cortos, como separar apenas una pesa colgada antes de soltarla.', def: 'Simplificación que aproxima el vaivén a un movimiento armónico cuando el hilo se inclina poco respecto de la vertical.', ejemplos: ['Una amplitud angular de 5° queda cerca de la vertical.', 'La aproximación pierde precisión al aumentar mucho la inclinación.', 'El ángulo se mide entre el hilo y la vertical.'] },
    );
    return { id: 'pendulo', titulo: 'El péndulo simple', pregunta: '¿Qué determina el tiempo de una pesa que va y vuelve?', temas: ['Péndulo simple'], pieza: 'fis-estatica',
      aprendizaje: 'Elijo la longitud hasta el centro de la pesa y estimo el período del péndulo con un modelo de ángulo pequeño.', actividad: 'Comparar dos pesas y dos longitudes en experimentos separados.', ejemplos,
      lee: { tarjetas: [
        { titulo: 'Una pesa colgada', texto: 'Una arandela colgada de un hilo puede ir y volver al separarla y soltarla. El péndulo simple representa ese movimiento con una pesa pequeña, un hilo ligero que no se estira y un apoyo fijo. Despreciamos el rozamiento para estudiar el vaivén sin que se vaya frenando.', dibujo: figura([{ L: 0.75, m: 0.04 }]) },
        { titulo: 'La longitud del modelo', texto: ['La longitud ', S.L, ' llega del apoyo al centro de la pesa, porque allí concentramos su masa en el modelo. La inclinación ', S.theta, ' se mide desde la vertical. Usaremos una amplitud angular de 8°: al separar poco el hilo, podemos aproximar el vaivén como armónico.'] },
        { titulo: 'Dos comparaciones distintas', texto: ['El período ', S.T, ' es el tiempo de una ida y vuelta completa. Cambiaremos primero la masa ', S.m, ' y después la longitud, por separado, para reconocer qué efecto corresponde a cada cambio. Conservaremos ', S.g, ' ≈ ', Q('g', 10, 'm/s²'), ' como aproximación de cálculo.'] },
      ] },
      juega: { pieza: 'fis-estatica', consigna: 'Dos péndulos parten con la misma inclinación pequeña. Compara un cambio de masa y un cambio de longitud por separado.',
        mision: { texto: 'Compara masas distintas con la misma longitud y el mismo período aproximado.', logrado: v => v.experimento === 0 && v.caso === 1, bien: 'Las pesas son distintas y completan el ciclo aproximadamente al mismo tiempo.' },
        voz: 'Mira la referencia junto al ensayo: solo cambia una propiedad.',
        leyenda: [{ s: S.L, t: 'longitud del apoyo al centro' }, { s: S.m, t: 'masa de cada pesa' }, { s: S.T, t: 'duración aproximada de un ciclo' }, { s: S.theta, t: 'inclinación respecto de la vertical' }, { s: S.t, t: 'tiempo desde que soltamos las pesas' }],
        controles: [{ id: 'experimento', etiqueta: 'Qué comparamos', opciones: [{ valor: 0, texto: 'Cambiar masa' }, { valor: 1, texto: 'Cambiar longitud' }], inicio: 0 },
          { id: 'caso', etiqueta: 'Ensayo', opciones: [{ valor: 0, texto: 'Igual a la referencia' }, { valor: 1, texto: 'Cambiar la propiedad elegida' }], inicio: 0 },
          { id: 't', etiqueta: 'Tiempo, t', min: 0, max: 4, paso: 0.05, decimales: 2, inicio: 0, unidad: 's', color: 'c-h', auto: { velocidad: 0.3 } }],
        dibujo: vista, lectura: v => { const [a, b] = ensayos(v); return [S.T, ' del ensayo ≈ ', Q('T', b.T / a.T), ' veces el de referencia.']; }, minimo: 3 },
      predice: { pregunta: ['La longitud cambia de ', Q('L', 40, 'cm'), ' a ', Q('L', 90, 'cm'), ', y la masa de ', Q('m', 30, 'g'), ' a ', Q('m', 120, 'g'), '. ¿Cuál es la razón de períodos nuevo/inicial?'],
        datos: ['Ambos ensayos tienen la misma gravedad y amplitud angular de 8°.', [S.g, ' ≈ ', Q('g', 10, 'm/s²'), ', valor usado para el cálculo.'], 'La longitud llega del apoyo al centro de la pesa.'], dibujo: predFigura,
        revelar: figura([{ L: pred.L1, m: pred.m1 / 1000, T: periodo(pred.L1, pred.g1), titulo: 'Inicial' }, { L: pred.L2, m: pred.m2 / 1000, T: periodo(pred.L2, pred.g2), titulo: 'Nuevo' }]),
        opciones: cp.opciones.filter((o, i) => i !== 2), caso: { tipo: 'razon', ...pred, valor: rp },
        coincide: 'La comparación combina cambios que antes observaste por separado.' },
      mira: { pieza: 'fis-estatica', datos: predFigura.datos, pasos: [
        paso('La gravedad hace volver la pesa hacia el punto más bajo. Para inclinaciones pequeñas, esta relación permite calcular el tiempo de una ida y vuelta.', FORMULA),
        paso('Comparamos el período nuevo con el inicial. Al dividirlos, se cancelan el factor 2π y la gravedad, porque ambos péndulos están en el mismo lugar.', [frac(T2, T1), ' ≈ ', raiz(frac(L2, L1))]),
        paso('Usamos las longitudes en la misma unidad para que su cociente compare tamaños. La raíz de ese cociente indica por cuánto cambia el período.', [frac(T2, T1), ' ≈ ', raiz(frac(Q('L', pred.L2 * 100), Q('L', pred.L1 * 100))), ' = ', Q('T', rp)]),
        paso('La masa no aparece: una pesa mayor recibe más peso, pero también cuesta más acelerarla. Ambos aumentos se compensan y no modifican el período del modelo.'),
        paso('Abajo no hay aceleración a lo largo del arco, pero la pesa sigue girando. Para cambiar la dirección de su velocidad necesita aceleración hacia el apoyo.'),
        paso('Para buscar longitud o gravedad, eliminamos la raíz elevando al cuadrado. Luego aislamos la incógnita; el período que usamos siempre corresponde a una ida y vuelta.', [S.L, ' ≈ ', S.g, ' · ', sup(frac(S.T, '2π')), '; ', S.g, ' ≈ ', frac(['4π² · ', S.L], sup(S.T))]),
      ] },
      regla: { texto: 'El período es el tiempo de una ida y vuelta. La gravedad devuelve la pesa hacia el centro; la longitud determina su recorrido. La fórmula combina ambos efectos. Una pesa mayor recibe más peso, pero también cuesta más acelerarla: el período no cambia por su masa. Al alargar el hilo, cada ciclo tarda más.', ecuacion: FORMULA,
        condicion: 'la pesa se aproxima por un punto, el hilo no se estira y su masa es despreciable, el apoyo y la gravedad permanecen fijos y no hay rozamiento. La inclinación debe ser pequeña; al aumentar mucho, la fórmula pierde precisión.', dibujo: figura([{ L: 0.75, m: 0.04, T: periodo(0.75, 10) }]) },
      resuelve: { pieza: 'fis-estatica', generar(s) { const z = Math.floor(s / 4) % 31; const tipos = ['duracion', 'longitud', 'razon', 'gravedad']; const p = [
        { L: 0.42 + z * 0.01, g: 10, N: 5 + z }, { T: 1.31 + z * 0.01, g: 10 },
        { L1: 0.31 + z * 0.01, L2: 0.72 + z * 0.01, g1: 10, g2: 8, m1: 20, m2: 180 }, { L: 0.55 + z * 0.01, T: 1.71 + z * 0.01 } ]; return resuelto(caso(tipos[s % 4], p[s % 4])); } },
      ahoraTu: { pieza: 'fis-estatica', generar(s) { const z = Math.floor(s / 6) % 31, j = s % 6; const tipos = ['periodo-cm', 'longitud-ciclos', 'longitud-razon', 'duracion-otro', 'alargar', 'gravedad-razon']; const p = [
        { Lcm: 51 + z, g: 10 }, { N: 11 + z, dt: (11 + z) * 1.7, g: 10 }, { L1: 0.32 + z * 0.01, T1: 1.4, T2: 1.96 },
        { N1: 8 + z, dt: (8 + z) * 1.4, N2: 15 + z, g1: 10, g2: 4 }, { hilo: 31 + z, radio: 2, factor: 1.5 },
        { L1: 0.31 + z * 0.01, L2: 0.74 + z * 0.01, N1: 8 + z, dt1: 2.2 * (8 + z), N2: 12 + z, dt2: 1.6 * (12 + z) } ]; return pregunta(caso(tipos[j], p[j])); } },
    };
  })();

  // 6. Solo resorte horizontal. Los balances conservan energía y no inventan el sentido de v.
  const idea6 = (() => {
    const EP = (k, x) => k * x * x / 2, EC = (m, v) => m * v * v / 2;
    const n = (clave, valor, unidad = '') => Q(clave, valor, unidad, 4);
    const aprox = x => Math.abs(x - Math.round(x * 1000) / 1000) > 1e-9;
    const EV = x => [aprox(x) ? ' ≈ ' : ' = ', n('EC', x, 'J')];
    const vel = ['|', S.v, '|'], xi = sub(S.x, '1'), xf = sub(S.x, '2'), vi = sub(S.v, '1'), vf = sub(S.v, '2');
    const CUADRADO = x => sup({ par: x });
    function escena(p, o = {}) {
      const xx = o.x === undefined ? (p.xcm === undefined ? (p.Acm === undefined ? 12 : p.Acm) : p.xcm) : o.x;
      const d = carrito(xx, { A: o.ocultarA ? undefined : p.Acm, rotuloX: o.ocultarX ? false : undefined,
        textos: [{ x: 160, y: 48, texto: `${p.k === undefined ? 'Resorte ideal' : `k = ${f(p.k)} N/m`}${p.m === undefined ? '' : `; m = ${f(p.m)} kg`}`, color: 'f', ancla: 'middle' }],
        alt: o.alt || 'Bloque unido a un resorte horizontal sobre una mesa sin rozamiento. La posición corresponde al estado descrito.' });
      if (o.esquema) { d.alto = 258; d.textos.push({ x: 160, y: 244, texto: 'Esquema sin escala', ancla: 'middle' }); }
      if (o.estado) d.textos.push({ x: 160, y: 68, texto: o.estado, ancla: 'middle' });
      return est(d);
    }
    // Cada conjunto de barras comparte 36 px/J. Nunca aparecen las partes antes de Predice.
    function reparto(p) {
      const total = EP(p.k, p.Acm / 100), elastica = EP(p.k, p.xcm / 100), cinetica = total - elastica;
      const v = escena(p), d = v.datos; d.alto = 422;
      const partes = [['E_C', cinetica, 'o'], ['E_PE', elastica, 'i'], ['E_M', total, 'f']];
      partes.forEach(([nombre, valor, color], j) => {
        const x = 62 + 98 * j;
        d.objetos.push({ tipo: 'barra-e', x, y: 374, w: 30, h: 36 * valor, color });
        d.textos.push({ x, y: 398, texto: `${nombre} = ${f(valor, 3)} J`, color, ancla: 'middle' });
      });
      d.alt += ' Las tres barras de energía tienen la misma escala en joules por píxel.';
      return v;
    }
    function caso(tipo, p) {
      let valor, unidad = 'J', clave = 'EC', enunciado, formula, cuentas, sentido, malos;
      const err = (valor, id, corta, explicacion) => ({ valor, id, corta, siFuera: `${explicacion}` });
      const A = p.Acm === undefined ? undefined : p.Acm / 100, x = p.xcm === undefined ? undefined : p.xcm / 100;
      let datos = ['Resorte horizontal ideal y mesa sin rozamiento.', 'La posición se mide desde el equilibrio, que coincide con la longitud natural del resorte.'];
      const dibujoOpciones = {};
      switch (tipo) {
        case 'total':
          valor = EP(p.k, A); clave = 'EM';
          enunciado = ['Se suelta un bloque desde el extremo derecho de un resorte de ', Q('k', p.k, 'N/m'), ', con amplitud ', Q('A', p.metros ? A : p.Acm, p.metros ? 'm' : 'cm'), '. ¿Cuál es su energía mecánica?'];
          formula = [S.EM, ' = ', frac([S.k, ' · ', sup(S.A)], '2')];
          cuentas = [paso('Al soltarlo desde el extremo, el bloque no tiene energía cinética porque está en reposo. Toda la energía mecánica está almacenada en el resorte deformado.', [S.EM, ' = ', frac([Q('k', p.k), ' · ', sup(n('A', A))], '2'), ' = ', n('EM', valor, 'J')])];
          malos = [err(2 * valor, 'sin-medio', 'omitiste la división entre dos', 'Omitiste el divisor de la fórmula de energía. Revisa la expresión completa: el producto del numerador todavía debe dividirse entre dos.'), err(valor / 2, 'doble-medio', 'dividiste dos veces entre dos', 'Dividiste dos veces entre dos. La fórmula ya incluye esa división; repetirla reduce de más la energía calculada.'), err(p.k * A / 2, 'sin-cuadrado', 'no elevaste al cuadrado', 'Usaste la amplitud sin elevarla al cuadrado. La fuerza aumenta al deformar el resorte, por eso su energía no crece simplemente en proporción a la amplitud.'), err(valor * 10000, 'centimetros', 'usaste centímetros en lugar de metros', 'Usaste centímetros con una rigidez expresada por metro. Convierte primero la longitud a metros y luego elévala al cuadrado; cambiar solo la unidad escrita no basta.')];
          sentido = 'Esta es la energía disponible para todo el vaivén. Después de soltar el bloque, cambia su reparto entre movimiento y resorte, pero no el total porque no hay rozamiento ni empujes.'; dibujoOpciones.x = p.Acm; break;
        case 'potencial':
          valor = EP(p.k, x); clave = 'EPE';
          enunciado = ['Un resorte horizontal de ', Q('k', p.k, 'N/m'), ' tiene su bloque en ', S.x, ' = ', Q('x', p.metros ? x : p.xcm, p.metros ? 'm' : 'cm'), '. ¿Cuánta energía potencial elástica almacena?'];
          formula = [S.EPE, ' = ', frac([S.k, ' · ', sup(S.x)], '2')];
          cuentas = [paso('La deformación entra al cuadrado: tanto estirar como comprimir requiere trabajo y almacena energía. Por eso una posición negativa no produce energía elástica negativa.', [S.EPE, ' = ', frac([Q('k', p.k), ' · ', CUADRADO(n('x', x))], '2'), ' = ', n('EPE', valor, 'J')])];
          malos = [err(2 * valor, 'sin-medio', 'omitiste la división entre dos', 'Omitiste el divisor de la fórmula de energía. Revisa la expresión completa: el producto del numerador todavía debe dividirse entre dos.'), err(valor / 2, 'doble-medio', 'dividiste dos veces entre dos', 'Dividiste dos veces entre dos. La fórmula ya incluye esa división; repetirla reduce de más la energía calculada.'), err(p.k * Math.abs(x) / 2, 'sin-cuadrado', 'no elevaste al cuadrado', 'Usaste la distancia sin elevarla al cuadrado. Al deformar más el resorte también aumenta su fuerza; la energía depende del cuadrado de esa distancia.'), err(-valor, 'signo', 'confundiste energía con posición negativa', 'Trasladaste el signo de la posición a la energía. Ese signo indica un lado del equilibrio; la deformación se eleva al cuadrado y la energía elástica no es negativa.')];
          sentido = 'Comprimir o estirar la misma distancia almacena la misma energía en este resorte ideal. El signo distingue el lado del equilibrio, pero desaparece al elevar la deformación al cuadrado.'; break;
        case 'cinetica-directa':
          valor = EC(p.m, p.v);
          enunciado = ['Un bloque de ', Q('m', p.m, 'kg'), ' pasa por el equilibrio con rapidez ', Q('v', p.v, 'm/s'), '. ¿Cuál es su energía cinética?'];
          formula = [S.EC, ' = ', frac([S.m, ' · ', sup(S.v)], '2')];
          cuentas = [paso('Usamos la energía cinética porque se pregunta por el movimiento del bloque. La masa va en kilogramos y la rapidez al cuadrado para obtener el resultado en joules.', [S.EC, ' = ', frac([Q('m', p.m), ' · ', sup(Q('v', p.v))], '2'), ' = ', n('EC', valor, 'J')])];
          malos = [err(2 * valor, 'sin-medio', 'omitiste la división entre dos', 'Omitiste el divisor de la fórmula de energía. Revisa la expresión completa: el producto del numerador todavía debe dividirse entre dos.'), err(valor / 2, 'doble-medio', 'dividiste dos veces entre dos', 'Dividiste dos veces entre dos. La fórmula ya incluye esa división; repetirla reduce de más la energía calculada.'), err(p.m * p.v / 2, 'sin-cuadrado', 'no elevaste al cuadrado', 'Usaste la rapidez sin elevarla al cuadrado. La energía cinética depende de ese cuadrado, así que no crece en la misma proporción que la rapidez.'), err(valor / p.m, 'sin-masa', 'omitiste la masa del bloque', 'Omitiste la masa, como si todos los cuerpos tuvieran la misma energía a igual rapidez. También importa cuánto cuesta acelerarlos; la masa debe multiplicar el cuadrado de la rapidez.')];
          sentido = 'El bloque tiene energía cinética porque se mueve. Su valor es positivo tanto al ir a la derecha como a la izquierda; la energía sola no distingue esos sentidos.'; dibujoOpciones.x = 0; break;
        case 'cinetica-datos':
          valor = p.EM - p.EPE;
          enunciado = ['Un oscilador tiene energía mecánica ', n('EM', p.EM, 'J'), ' y energía potencial elástica ', n('EPE', p.EPE, 'J'), '. ¿Cuál es su energía cinética?'];
          formula = [S.EC, ' = ', S.EM, ' − ', S.EPE];
          cuentas = [paso('La energía mecánica ya incluye movimiento y resorte. Restamos la parte elástica para quedarnos únicamente con la energía cinética del bloque.', [S.EC, ' = ', n('EM', p.EM), ' − ', n('EPE', p.EPE), ' = ', n('EC', valor, 'J')])];
          malos = [err(p.EM + p.EPE, 'suma', 'sumaste una parte al total', 'Sumaste la energía elástica a un total que ya la incluye. Para hallar la parte cinética debes quitar la parte almacenada en el resorte.'), err(p.EM, 'total', 'confundiste la parte con el total', 'Tomaste el total como si todo fuera movimiento. El resorte todavía almacena energía; hay que restar esa parte para obtener la cinética.'), err(p.EPE, 'potencial', 'confundiste la cinética con la elástica', 'Diste la energía almacenada en el resorte, pero se pide la del movimiento. Son partes distintas del mismo total; la cinética se obtiene restando la elástica.'), err(-valor, 'resta-inversa', 'invertiste el orden de la resta', 'Restaste el total de una de sus partes. La energía cinética no puede ser negativa aquí: debes restar la energía elástica del total mecánico.')];
          sentido = 'Esta es la parte del total que corresponde al movimiento. Al sumarla con la energía del resorte debemos recuperar la energía mecánica dada.'; dibujoOpciones.ocultarX = true; dibujoOpciones.esquema = true; break;
        case 'mecanica-datos':
          valor = p.EC + p.EPE; clave = 'EM';
          enunciado = ['El bloque tiene energía cinética ', n('EC', p.EC, 'J'), ' y el resorte energía potencial ', n('EPE', p.EPE, 'J'), '. ¿Cuál es la energía mecánica?'];
          formula = [S.EM, ' = ', S.EC, ' + ', S.EPE];
          cuentas = [paso('La energía mecánica reúne la energía del movimiento y la almacenada en el resorte. Sumamos ambas porque ocurren a la vez en el mismo estado.', [S.EM, ' = ', n('EC', p.EC), ' + ', n('EPE', p.EPE), ' = ', n('EM', valor, 'J')])];
          malos = [err(p.EC - p.EPE, 'resta', 'restaste en lugar de sumar', 'Restaste la energía del resorte como si no perteneciera al sistema. La energía mecánica incluye tanto esa parte como la del movimiento; deben sumarse.'), err(p.EC, 'solo-cinetica', 'contaste solo la energía cinética', 'Contaste solo el movimiento y dejaste fuera la energía almacenada en el resorte. La energía mecánica es la suma de ambas partes.'), err(p.EPE, 'solo-potencial', 'contaste solo la energía elástica', 'Contaste solo la energía del resorte. El bloque también se mueve, por lo que su energía cinética debe entrar en el total mecánico.'), err(valor / 2, 'promedio', 'promediaste en lugar de sumar', 'Promediaste las dos energías como si buscaras un valor representativo. Se pide el total disponible en el sistema, así que ambas se suman sin dividir.')];
          sentido = 'El resultado reúne toda la energía del sistema en ese instante. No se promedian las partes: cada una aporta energía al mismo total.'; dibujoOpciones.ocultarX = true; dibujoOpciones.esquema = true; break;
        case 'cinetica-balance': {
          const total = EP(p.k, A), potencial = EP(p.k, x); valor = total - potencial;
          enunciado = ['Un resorte de ', Q('k', p.k, 'N/m'), ' oscila con amplitud ', Q('A', p.Acm, 'cm'), '. ¿Qué energía cinética tiene el bloque al pasar por ', S.x, ' = ', Q('x', p.xcm, 'cm'), '?'];
          formula = [S.EC, ' = ', S.EM, ' − ', S.EPE];
          cuentas = [paso('En un extremo el bloque se detiene, así que no hay energía cinética. Calculamos allí la energía elástica para conocer el total que se conserva durante el vaivén.', [S.EM, ' = ', frac([Q('k', p.k), ' · ', sup(n('A', A))], '2'), ' = ', n('EM', total, 'J')]), paso('En la posición indicada el resorte aún está deformado. Calculamos su energía elástica y la restamos del total; lo que queda corresponde al movimiento del bloque.', [S.EPE, ' = ', frac([Q('k', p.k), ' · ', CUADRADO(n('x', x))], '2'), ' = ', n('EPE', potencial, 'J'), '   ;   ', S.EC, ' = ', n('EM', total), ' − ', n('EPE', potencial), ' = ', n('EC', valor, 'J')])];
          malos = [err(potencial, 'potencial', 'confundiste la cinética con la elástica', 'Calculaste la energía que queda almacenada en el resorte. La pregunta pide la del movimiento; réstala del total para hallar esa otra parte.'), err(total, 'total', 'confundiste la parte con el total', 'Diste el total sin descontar la energía del resorte. Eso serviría al pasar por el equilibrio, pero en esta posición el resorte todavía está deformado.'), err(total + potencial, 'suma', 'sumaste una parte al total', 'Sumaste la energía elástica a un total que ya la incluye. Para hallar la parte cinética debes quitar la parte almacenada en el resorte.'), err(-valor, 'resta-inversa', 'invertiste el orden de la resta', 'Restaste el total de la energía elástica. La cinética es la parte restante del total, así que el orden es total menos elástica.')];
          sentido = 'Esta es la parte del total que tiene el bloque por moverse. El resto permanece en el resorte: ambas partes juntas conservan la energía inicial.'; break;
        }
        case 'rapidez-datos': {
          const cin = p.EM - p.EPE; valor = Math.sqrt(2 * cin / p.m); unidad = 'm/s'; clave = 'v';
          enunciado = ['Un bloque de ', Q('m', p.m, 'kg'), ' tiene energía mecánica ', n('EM', p.EM, 'J'), ' y energía elástica ', n('EPE', p.EPE, 'J'), '. ¿Cuál es su rapidez?'];
          formula = [S.EC, ' = ', S.EM, ' − ', S.EPE, '; ', S.EC, ' = ', frac([S.m, ' · ', sup(S.v)], '2')];
          cuentas = [paso('Primero quitamos la energía elástica del total porque solo la cinética determina la rapidez. Después despejamos y tomamos la raíz positiva: se pide rapidez, no velocidad con signo.', [S.EC, ' = ', n('EM', p.EM), ' − ', n('EPE', p.EPE), ' = ', n('EC', cin, 'J'), '   ;   ', vel, ' = ', raiz(frac(['2 · ', S.EC], S.m))]), paso('Reemplazamos la energía cinética obtenida, junto con la masa del bloque. La raíz deshace el cuadrado de la rapidez que aparece en la fórmula de energía.', [vel, ' = ', raiz(frac(['2 · ', n('EC', cin)], Q('m', p.m))), aprox(valor) ? ' ≈ ' : ' = ', Q('v', valor, unidad, 3)])];
          malos = [err(valor / Math.SQRT2, 'sin-dos', 'omitiste el dos del despeje', 'Omitiste el dos que elimina la división entre dos de la energía cinética. Antes de extraer la raíz hay que multiplicar la energía por dos y dividir entre la masa.'), err(Math.sqrt(2 * p.EM / p.m), 'total', 'trataste el total como cinética', 'Trataste toda la energía como movimiento. El total también incluye energía del resorte; primero resta esa parte y recién usa la cinética para hallar la rapidez.'), err(Math.sqrt(2 * p.EPE / p.m), 'potencial', 'usaste la elástica como cinética', 'Usaste la energía del resorte en la fórmula del movimiento. La rapidez depende de la cinética, que se obtiene quitando la elástica del total.'), err(valor * valor, 'sin-raiz', 'no extrajiste la raíz', 'Te quedaste con el cuadrado de la rapidez. Después del despeje debes extraer la raíz para obtener la rapidez, que aquí se pide positiva.')];
          sentido = 'La rapidez indica cuánto avanza por segundo, pero no hacia qué lado. El mismo valor puede corresponder al bloque acercándose al centro o alejándose de él.'; dibujoOpciones.ocultarX = true; dibujoOpciones.esquema = true; break;
        }
        case 'amplitud':
          valor = 100 * Math.sqrt(2 * p.EM / p.k); unidad = 'cm'; clave = 'A';
          enunciado = ['Se suelta un bloque desde el extremo derecho. El sistema formado por bloque y resorte tiene energía mecánica ', n('EM', p.EM, 'J'), ' y rigidez ', Q('k', p.k, 'N/m'), '. ¿Cuál es la amplitud?'];
          formula = [S.EM, ' = ', frac([S.k, ' · ', sup(S.A)], '2')];
          cuentas = [paso('En el extremo toda la energía es elástica. Despejamos primero la amplitud al cuadrado; multiplicar por dos y dividir entre la rigidez permite aislarla antes de extraer la raíz.', [S.A, ' = ', raiz(frac(['2 · ', S.EM], S.k))]), paso('Con la rigidez en newtons por metro, la raíz da metros. Convertimos a centímetros porque esa es la unidad pedida para la distancia hasta el extremo.', [S.A, ' = 100 · ', raiz(frac(['2 · ', n('EM', p.EM)], Q('k', p.k))), aprox(valor) ? ' ≈ ' : ' = ', Q('A', valor, 'cm', 3)])];
          malos = [err(valor / Math.SQRT2, 'sin-dos', 'omitiste el dos del despeje', 'Omitiste el dos al eliminar la división de la fórmula de energía. Debes multiplicar la energía por dos antes de dividir entre la rigidez y extraer la raíz.'), err(100 * 2 * p.EM / p.k, 'sin-raiz', 'no extrajiste la raíz', 'Convertiste la expresión a centímetros antes de deshacer el cuadrado de la amplitud. Primero extrae la raíz para obtener una longitud y después cambia su unidad.'), err(valor / 100, 'metros', 'dejaste metros donde se pedían centímetros', 'Calculaste una longitud en metros, pero la nombraste en centímetros. La unidad pedida exige convertir el valor, no solo cambiar su etiqueta.'), err(valor * 2, 'extremos', 'mediste entre los dos extremos', 'Diste la distancia de un extremo al otro. La amplitud llega solo desde el equilibrio hasta uno de los extremos.')];
          sentido = 'Esta distancia positiva marca el extremo que alcanza el bloque desde el equilibrio. No mide todo el recorrido entre los dos extremos.'; dibujoOpciones.ocultarX = true; dibujoOpciones.ocultarA = true; dibujoOpciones.esquema = true; dibujoOpciones.estado = 'Extremo derecho al soltar'; break;
        case 'posicion':
          valor = 100 * Math.sqrt(2 * p.EPE / p.k); unidad = 'cm'; clave = 'x';
          enunciado = ['Un resorte estirado de ', Q('k', p.k, 'N/m'), ' almacena energía potencial elástica ', n('EPE', p.EPE, 'J'), '. ¿A qué distancia del equilibrio está su bloque?'];
          formula = [S.EPE, ' = ', frac([S.k, ' · ', sup(S.x)], '2')];
          cuentas = [paso('La energía elástica depende del cuadrado de la posición, de modo que primero despejamos ese cuadrado. Tomamos la raíz positiva porque se pide una distancia al equilibrio.', ['|', S.x, '| = ', raiz(frac(['2 · ', S.EPE], S.k))]), paso('La raíz da la distancia en metros porque usamos joules y newtons por metro. La expresamos en centímetros para responder en la unidad pedida.', ['|', S.x, '| = 100 · ', raiz(frac(['2 · ', n('EPE', p.EPE)], Q('k', p.k))), aprox(valor) ? ' ≈ ' : ' = ', Q('x', valor, 'cm', 3)])];
          malos = [err(valor / Math.SQRT2, 'sin-dos', 'omitiste el dos del despeje', 'Omitiste el dos al eliminar la división de la fórmula de energía. Debes multiplicar la energía por dos antes de dividir entre la rigidez y extraer la raíz.'), err(100 * 2 * p.EPE / p.k, 'sin-raiz', 'no extrajiste la raíz', 'Dejaste la distancia al cuadrado. La energía permite calcular ese cuadrado; hace falta extraer la raíz para obtener la distancia al equilibrio.'), err(valor / 100, 'metros', 'dejaste metros donde se pedían centímetros', 'La cuenta dio metros y solo cambiaste el nombre de la unidad. Para expresar esa misma distancia en centímetros también debes convertir el valor.'), err(-valor, 'signo', 'asignaste un signo a la distancia', 'Usaste un signo para indicar un lado, pero aquí se pide distancia. La distancia al equilibrio no es negativa; el sentido de la posición es otra información.')];
          sentido = 'La distancia obtenida es positiva. La información de que el resorte está estirado ubica al bloque a la derecha; ese lado no se deduce solo de la energía.'; dibujoOpciones.ocultarX = true; dibujoOpciones.esquema = true; break;
        case 'velocidad': {
          const rapidez = Math.sqrt(2 * p.EC / p.m); valor = p.sentido * rapidez; unidad = 'm/s'; clave = 'v';
          enunciado = ['Un bloque de ', Q('m', p.m, 'kg'), ' tiene energía cinética ', n('EC', p.EC, 'J'), ' y se mueve hacia ', p.sentido < 0 ? 'la izquierda' : 'la derecha', '. ¿Cuál es su velocidad con signo?'];
          datos.push('El sentido positivo del eje es hacia la derecha.');
          formula = [S.EC, ' = ', frac([S.m, ' · ', sup(S.v)], '2')];
          cuentas = [paso('La energía cinética contiene la velocidad al cuadrado y no distingue izquierda de derecha. Primero despejamos su magnitud positiva, es decir, la rapidez.', [vel, ' = ', raiz(frac(['2 · ', n('EC', p.EC)], Q('m', p.m))), aprox(rapidez) ? ' ≈ ' : ' = ', Q('v', rapidez, 'm/s', 3)]), paso('Usamos ahora el sentido que da el enunciado: derecha significa positivo e izquierda, negativo. Esa información convierte la rapidez en una velocidad con signo.', [S.v, aprox(valor) ? ' ≈ ' : ' = ', Q('v', valor, 'm/s', 3)])];
          malos = [err(-valor, 'signo', 'elegiste el sentido opuesto', 'Elegiste el signo del sentido opuesto al indicado. El eje toma la derecha como positiva; la energía da la rapidez, pero el enunciado fija el signo.'), err(valor / Math.SQRT2, 'sin-dos', 'omitiste el dos del despeje', 'Omitiste el dos que elimina la división entre dos de la energía cinética. Antes de extraer la raíz hay que multiplicar la energía por dos y dividir entre la masa.'), err(p.sentido * rapidez ** 2, 'sin-raiz', 'no extrajiste la raíz', 'Asignaste un signo cuando todavía tenías la rapidez al cuadrado. Primero extrae la raíz para hallar la rapidez y luego usa el sentido indicado.'), err(0, 'equilibrio', 'supusiste reposo pese a la cinética', 'Supusiste que el bloque estaba detenido. La energía cinética dada es positiva, por lo que tiene rapidez distinta de cero; el sentido indicado permite elegir su signo.')];
          sentido = 'El valor indica rapidez y sentido respecto del eje elegido. Su signo viene del enunciado: elevar la velocidad al cuadrado en la energía borra esa información.'; dibujoOpciones.ocultarX = true; dibujoOpciones.esquema = true; break;
        }
        case 'rapidez-balance': {
          valor = Math.sqrt(p.k * (A * A - x * x) / p.m); unidad = 'm/s'; clave = 'v';
          const total = EP(p.k, A), pot = EP(p.k, x);
          enunciado = ['Un bloque de ', Q('m', p.m, 'kg'), ' oscila con resorte de ', Q('k', p.k, 'N/m'), ' y amplitud ', Q('A', p.Acm, 'cm'), '. ¿Cuál es su rapidez en ', S.x, ' = ', Q('x', p.xcm, 'cm'), '?'];
          formula = [frac([S.m, ' · ', sup(S.v)], '2'), ' = ', frac([S.k, ' · ', sup(S.A)], '2'), ' − ', frac([S.k, ' · ', sup(S.x)], '2')];
          cuentas = [paso('Igualamos la energía cinética al total menos la energía del resorte. Multiplicamos por dos y dividimos entre la masa para dejar la rapidez al cuadrado antes de extraer la raíz.', [sup(S.v), ' = ', frac(S.k, S.m), ' · (', sup(S.A), ' − ', sup(S.x), ')']), paso('Convertimos las longitudes a metros para usar la rigidez y la masa dadas. Elegimos la raíz positiva porque buscamos la rapidez, sin atribuirle todavía un sentido.', [vel, ' = ', raiz([frac(Q('k', p.k), Q('m', p.m)), ' · (', sup(n('A', A)), ' − ', CUADRADO(n('x', x)), ')']), '   ;   ', vel, aprox(valor) ? ' ≈ ' : ' = ', Q('v', valor, 'm/s', 3)])];
          malos = [err(Math.sqrt(2 * total / p.m), 'total', 'trataste el total como cinética', 'Dejaste fuera la energía que almacena el resorte en la posición dada. Esa parte también cuenta en el balance; no puede atribuirse toda al movimiento.'), err(Math.sqrt(2 * pot / p.m), 'potencial', 'usaste la elástica como cinética', 'Confundiste la energía del resorte con la del movimiento. La cinética es el total menos la energía elástica, y esa diferencia es la que determina la rapidez.'), err(valor / Math.SQRT2, 'sin-dos', 'omitiste el dos del despeje', 'Omitiste el dos que elimina la división de la energía cinética. Revisa el despeje antes de extraer la raíz; los factores deben conservarse en ambos lados.'), err(valor * valor, 'sin-raiz', 'no extrajiste la raíz', 'Te quedaste con el cuadrado de la rapidez. Extrae la raíz positiva para obtener cuánto avanza el bloque por segundo, sin elegir todavía un sentido.')];
          sentido = 'En esa posición, el balance fija cuánta energía queda para el movimiento y, con ella, la rapidez. El bloque puede pasar por allí en ambos sentidos.'; break;
        }
        case 'amplitud-estado': {
          valor = 100 * Math.sqrt(x * x + p.m * p.v * p.v / p.k); unidad = 'cm'; clave = 'A';
          enunciado = ['Un bloque de ', Q('m', p.m, 'kg'), ' pasa por ', S.x, ' = ', Q('x', p.xcm, 'cm'), ' con rapidez ', Q('v', p.v, 'm/s'), '. Con ', S.k, ' = ', Q('k', p.k, 'N/m'), ', ¿cuál es su amplitud?'];
          formula = [frac([S.k, ' · ', sup(S.A)], '2'), ' = ', frac([S.m, ' · ', sup(S.v)], '2'), ' + ', frac([S.k, ' · ', sup(S.x)], '2')];
          cuentas = [paso('La energía del estado conocido incluye movimiento y deformación. La igualamos a la energía elástica del extremo; multiplicamos por dos y dividimos entre la rigidez para aislar la amplitud al cuadrado.', [sup(S.A), ' = ', frac(S.m, S.k), ' · ', sup(S.v), ' + ', sup(S.x)]), paso('Tomamos la raíz positiva porque la amplitud es una distancia. La cuenta entrega metros y los convertimos a centímetros para describir el extremo del recorrido.', [S.A, ' = ', raiz([frac(Q('m', p.m), Q('k', p.k)), ' · ', sup(Q('v', p.v)), ' + ', CUADRADO(n('x', x))]), '   ;   ', S.A, aprox(valor) ? ' ≈ ' : ' = ', Q('A', valor, 'cm', 3)])];
          malos = [err(100 * Math.sqrt(p.m * p.v * p.v / p.k), 'sin-posicion', 'omitiste la energía elástica actual', 'Dejaste fuera la energía que almacena el resorte en la posición dada. Esa parte también cuenta en el balance; no puede atribuirse toda al movimiento.'), err(Math.abs(p.xcm), 'posicion', 'confundiste posición actual con extremo', 'Tomaste la posición actual como extremo. El bloque aún tiene energía cinética, así que la distancia actual es menor que la amplitud; el extremo se obtiene con la energía total.'), err(100 * (x * x + p.m * p.v * p.v / p.k), 'sin-raiz', 'no extrajiste la raíz', 'Te quedaste con la amplitud al cuadrado. Extrae la raíz positiva para obtener la distancia al extremo y luego conviértela a centímetros.'), err(100 * Math.sqrt(x * x + p.m * p.v * p.v / (2 * p.k)), 'sin-dos', 'cancelaste solo uno de los medios', 'Cancelaste la división entre dos solo en una parte del balance. Al multiplicar la igualdad por dos deben cambiar todos sus términos, no únicamente los elásticos.')];
          sentido = 'La amplitud supera la distancia actual al equilibrio: el bloque aún tiene energía de movimiento y puede deformar más el resorte antes de llegar al extremo.'; dibujoOpciones.ocultarA = true; break;
        }
        case 'posicion-cinetica': {
          const total = EP(p.k, A); valor = 100 * Math.sqrt(A * A - 2 * p.EC / p.k); unidad = 'cm'; clave = 'x';
          enunciado = ['Se suelta el bloque desde ', S.x, ' = ', Q('A', p.Acm, 'cm'), ' con ', S.k, ' = ', Q('k', p.k, 'N/m'), '. ¿A qué distancia del equilibrio tendrá energía cinética ', n('EC', p.EC, 'J'), '?'];
          formula = [frac([S.k, ' · ', sup(S.x)], '2'), ' = ', frac([S.k, ' · ', sup(S.A)], '2'), ' − ', S.EC];
          cuentas = [paso('Restamos la energía cinética del total para saber cuánto queda almacenado en el resorte. Esa energía elástica permite despejar el cuadrado de la posición.', [sup(S.x), ' = ', sup(S.A), ' − ', frac(['2 · ', S.EC], S.k)]), paso('Calculamos la energía elástica restante y extraemos la raíz positiva porque se pide distancia al equilibrio. Las dos posiciones simétricas tienen el mismo cuadrado y, por tanto, el mismo reparto de energía.', [S.EPE, ' = ', n('EM', total), ' − ', n('EC', p.EC), ' = ', n('EPE', total - p.EC, 'J'), '   ;   ', '|', S.x, '| = 100 · ', raiz(frac(['2 · ', n('EPE', total - p.EC)], Q('k', p.k))), aprox(valor) ? ' ≈ ' : ' = ', Q('x', valor, 'cm', 3)])];
          malos = [err(100 * Math.sqrt(2 * p.EC / p.k), 'cinetica-por-elastica', 'intercambiaste cinética y elástica', 'Pusiste la energía del movimiento en la fórmula del resorte. Primero resta la cinética del total para obtener la elástica; con esa parte se calcula la distancia.'), err(p.Acm, 'amplitud', 'respondiste con la amplitud', 'Supusiste que toda la energía seguía en el resorte, como en un extremo. Pero el bloque tiene la energía cinética indicada, que debes restar del total.'), err(100 * (A * A - 2 * p.EC / p.k), 'sin-raiz', 'no extrajiste la raíz', 'La resta todavía da la posición al cuadrado. Extrae la raíz para hallar la distancia al equilibrio y después conviértela a centímetros.'), err(100 * Math.sqrt(A * A - p.EC / p.k), 'sin-dos', 'omitiste el dos del despeje', 'Omitiste el dos al eliminar la división de la energía elástica. Multiplica ambos lados por dos antes de dividir entre la rigidez y extraer la raíz.')];
          sentido = 'La misma distancia puede alcanzarse a ambos lados del equilibrio. En esos puntos el resorte almacena igual energía y queda la misma cantidad para el movimiento.'; dibujoOpciones.x = p.Acm; dibujoOpciones.estado = 'Estado inicial al soltar'; break;
        }
        case 'rigidez':
          valor = p.m * p.v * p.v / (A * A); unidad = 'N/m'; clave = 'k';
          enunciado = ['Un bloque de ', Q('m', p.m, 'kg'), ' oscila con amplitud ', Q('A', p.Acm, 'cm'), ' y pasa por el equilibrio a ', Q('v', p.v, 'm/s'), '. ¿Cuál es la rigidez del resorte?'];
          formula = [frac([S.k, ' · ', sup(S.A)], '2'), ' = ', frac([S.m, ' · ', sup(S.v)], '2')];
          cuentas = [paso('En el equilibrio el resorte no está deformado: toda la energía es cinética. La igualamos a la elástica del extremo, cancelamos los medios y despejamos la rigidez.', [S.k, ' = ', frac([S.m, ' · ', sup(S.v)], sup(S.A))]), paso('Reemplazamos la amplitud en metros para obtener la rigidez en newtons por metro. Tanto la amplitud como la rapidez conservan su cuadrado durante el despeje.', [S.k, ' = ', frac([Q('m', p.m), ' · ', sup(Q('v', p.v))], sup(n('A', A))), aprox(valor) ? ' ≈ ' : ' = ', Q('k', valor, 'N/m', 3)])];
          malos = [err(valor / 2, 'medio', 'cancelaste solo uno de los medios', 'Quitaste la división entre dos de un lado, pero la dejaste en el otro. Al igualar las energías, ese factor común se cancela en ambos lados.'), err(p.m * p.v * p.v / A, 'sin-cuadrado-A', 'no elevaste la amplitud al cuadrado', 'Usaste la amplitud sin elevarla al cuadrado. La energía elástica del extremo depende de ese cuadrado; debe mantenerse al despejar la rigidez.'), err(p.m * p.v / (A * A), 'sin-cuadrado-v', 'no elevaste la rapidez al cuadrado', 'Usaste la rapidez sin elevarla al cuadrado. La energía cinética depende de ese cuadrado, así que no crece en la misma proporción que la rapidez.'), err(valor / 10000, 'centimetros', 'usaste centímetros en lugar de metros', 'Usaste centímetros con una rigidez expresada por metro. Convierte primero la longitud a metros y luego elévala al cuadrado; cambiar solo la unidad escrita no basta.')];
          sentido = 'La rigidez calculada permite que la energía del resorte en el extremo se transforme en la energía cinética observada al cruzar el equilibrio.'; dibujoOpciones.x = 0; break;
        case 'rapidez-estados': {
          const x1 = p.x1cm / 100, x2 = p.x2cm / 100;
          valor = Math.sqrt(p.v1 * p.v1 + p.k * (x1 * x1 - x2 * x2) / p.m); unidad = 'm/s'; clave = 'v';
          enunciado = ['Un bloque de ', Q('m', p.m, 'kg'), ' pasa por ', Q('x', p.x1cm, 'cm'), ' a ', Q('v', p.v1, 'm/s'), ', con un resorte de ', Q('k', p.k, 'N/m'), '. ¿Qué rapidez tendrá al pasar por ', Q('x', p.x2cm, 'cm'), '?'];
          formula = [S.EM, ' = ', frac([S.m, ' · ', sup(vi)], '2'), ' + ', frac([S.k, ' · ', sup(xi)], '2'), '   ;   ', S.EM, ' = ', frac([S.m, ' · ', sup(vf)], '2'), ' + ', frac([S.k, ' · ', sup(xf)], '2')];
          const diferenciaCuadrados = x1 * x1 - x2 * x2, rapidezCuadrada = p.v1 * p.v1 + p.k * diferenciaCuadrados / p.m;
          cuentas = [paso('El total de energía es el mismo en ambos estados. Restamos la energía elástica final para hallar la cinética final y despejamos la nueva rapidez al cuadrado.', [sup(vf), ' = ', sup(vi), ' + ', frac(S.k, S.m), ' · (', sup(xi), ' − ', sup(xf), ')']), paso('Convertimos ambas posiciones a metros y calculamos la diferencia de sus cuadrados. Ese cambio determina la energía que gana el movimiento. Reemplazamos la diferencia en el despeje y extraemos la raíz positiva para obtener la rapidez.', [CUADRADO(n('x', x1)), ' − ', CUADRADO(n('x', x2)), ' = ', Q('x', diferenciaCuadrados, 'm²', 6), '   ;   ', sup(vf), ' = ', sup(Q('v', p.v1)), ' + ', frac(Q('k', p.k), Q('m', p.m)), ' · ', Q('x', diferenciaCuadrados, '', 6), '   ;   ', '|', vf, '| = ', raiz(Q('v', rapidezCuadrada, '', 6)), aprox(valor) ? ' ≈ ' : ' = ', Q('v', valor, 'm/s', 3)])];
          malos = [err(p.v1, 'sin-cambio', 'ignoraste que cambia la energía elástica', 'Conservaste la rapidez como si el resorte no cambiara su deformación. Al cambiar la energía elástica, también cambia la parte disponible para el movimiento.'), err(Math.sqrt(p.k * (x1 * x1 - x2 * x2) / p.m), 'sin-inicial', 'omitiste la energía cinética inicial', 'Olvidaste que el bloque ya se movía en el primer estado. La energía cinética final incluye esa energía inicial y el cambio de energía del resorte.'), err(valor * valor, 'sin-raiz', 'no extrajiste la raíz', 'Te quedaste con la rapidez final al cuadrado. Extrae la raíz positiva para obtener cuánto avanza el bloque por segundo en el nuevo estado.'), err(Math.sqrt(p.v1 * p.v1 + p.k * (x1 * x1 + x2 * x2) / p.m), 'suma-posiciones', 'sumaste energías elásticas en vez de restarlas', 'Sumaste las energías elásticas como si ambas se entregaran al bloque. Solo cambia de forma su diferencia: la energía que el resorte todavía guarda debe descontarse.')];
          sentido = 'El segundo punto está más cerca del equilibrio. El resorte queda menos deformado y cede energía al movimiento; por eso el bloque pasa con mayor rapidez.'; dibujoOpciones.x = p.x1cm; dibujoOpciones.estado = 'Primer estado conocido'; break;
        }
        default: throw new Error('Energía MAS: familia desconocida ' + tipo);
      }
      if (!p.metros && ['total', 'potencial', 'cinetica-balance', 'amplitud', 'posicion', 'rapidez-balance', 'amplitud-estado', 'posicion-cinetica', 'rigidez', 'rapidez-estados'].includes(tipo)) datos.push('1 m = 100 cm.');
      const fmt = a => `${aprox(a) ? '≈ ' : ''}${f(a, 3)} ${unidad}`;
      const magnitudPedida = { EC: 'la energía cinética', EPE: 'la energía potencial elástica', EM: 'la energía mecánica', A: 'la amplitud', x: 'la distancia al equilibrio', k: 'la rigidez del resorte', v: tipo === 'velocidad' ? 'la velocidad con su signo' : 'la rapidez' }[clave];
      const nombres = { m: ['la masa de ', 'm', 'kg'], k: ['la rigidez de ', 'k', 'N/m'], Acm: ['la amplitud de ', 'A', 'cm'], xcm: ['la posición de ', 'x', 'cm'],
        x1cm: ['la posición inicial de ', 'x', 'cm'], x2cm: ['la posición final de ', 'x', 'cm'], v: ['la rapidez de ', 'v', 'm/s'], v1: ['la rapidez inicial de ', 'v', 'm/s'],
        EM: ['la energía mecánica de ', 'EM', 'J'], EPE: ['la energía elástica de ', 'EPE', 'J'], EC: ['la energía cinética de ', 'EC', 'J'] };
      const entradas = Object.entries(p).filter(([k]) => nombres[k]);
      const tengo = tipo === 'rapidez-estados' ? 'Conozco la masa y la rigidez del sistema, las dos posiciones y la rapidez del primer estado.' : ['Conozco ', ...entradas.flatMap(([k, valor], j) => [j ? j === entradas.length - 1 ? ' y ' : ', ' : '', nombres[k][0], n(nombres[k][1], p.metros && ['Acm', 'xcm'].includes(k) ? valor / 100 : valor, p.metros && ['Acm', 'xcm'].includes(k) ? 'm' : nombres[k][2])]), '.'];
      let ops;
      try { ops = opciones(valor, malos.map(e => ({ valor: e.valor, error: `OS-ENE-${e.id}`, siFuera: e.siFuera })), fmt); }
      catch (e) { throw new Error(`Energía ${tipo}: ${JSON.stringify([p, valor, malos])}; ${e.message}`); }
      return { enunciado, datos, dibujo: escena(p, dibujoOpciones), pide: `Se pide ${magnitudPedida}.`, tengo,
        regla: paso('Distinguimos qué energía corresponde al movimiento y cuál al resorte. La relación elegida permite reunir esas partes o aislar la que necesitamos.', formula), cuentas, sentido,
        respuesta: [aprox(valor) ? '≈ ' : '', Q(clave, valor, unidad, 3)],
        opciones: ops,
        caso: { tipo, ...p, valor, unidad, aproximado: aprox(valor), errores: malos.map(e => ({ id: e.id, valor: e.valor })) },
        erroresEjemplo: malos.map(e => `${fmt(e.valor)}: ${e.corta}.`).join(' ') + ({
          'rapidez-balance': ' Primero restamos la energía elástica del total: solo la cinética, junto con la masa, permite hallar la rapidez.',
          'amplitud-estado': ' En el extremo no queda movimiento: el resorte almacena también la energía cinética del estado conocido.',
          'posicion-cinetica': ' La distancia depende de la energía elástica restante, que se obtiene restando la cinética del total.',
          rigidez: ' Al cruzar el equilibrio, toda la energía es cinética; igualamos ambas energías máximas.',
          'rapidez-estados': ' La energía que pierde el resorte aumenta la cinética que el bloque ya tenía.',
        }[tipo] || '') };
    }
    const lista = [
      ['total', { k: 100, Acm: 10, metros: true }, 'Energía al soltar'],
      ['potencial', { k: 50, xcm: -20, metros: true }, 'El resorte comprimido'],
      ['cinetica-directa', { m: 0.4, v: 3 }, 'Al pasar por el centro'],
      ['cinetica-datos', { EM: 3, EPE: 1.2 }, 'La parte del movimiento'],
      ['mecanica-datos', { EC: 1.8, EPE: 0.8 }, 'Sumar las energías'],
      ['cinetica-balance', { k: 120, Acm: 15, xcm: 5 }, 'Una posición interior'],
      ['rapidez-datos', { m: 0.4, EM: 1.5, EPE: 0.7 }, 'Del balance a la rapidez'],
      ['amplitud', { k: 160, EM: 1.8 }, 'Reconstruir el extremo'],
      ['posicion', { k: 200, EPE: 0.36 }, 'La distancia al equilibrio'],
      ['velocidad', { m: 0.5, EC: 1, sentido: -1 }, 'El sentido sí importa'],
      ['rapidez-balance', { k: 80, m: 0.5, Acm: 20, xcm: 10 }, 'Rapidez fuera del centro'],
      ['amplitud-estado', { k: 160, m: 0.4, xcm: 10, v: 3 }, 'Amplitud desde un estado'],
      ['posicion-cinetica', { k: 100, Acm: 16, EC: 0.96 }, 'Buscar la posición'],
      ['rigidez', { m: 0.6, v: 3, Acm: 15 }, 'Rigidez desde el movimiento'],
      ['rapidez-estados', { k: 80, m: 0.5, x1cm: 10, v1: 1.2, x2cm: 4 }, 'Dos posiciones interiores'],
    ];
    const ejemplos = lista.map(([t, p, titulo], i) => ejemplo(caso(t, p), 1 + Math.floor(i / 5), titulo, (5 - (i - 10)) % 5));
    const tiempo = v => Number(v.t.toFixed(2));
    function estado(v) { const omega = Math.sqrt(80 / 0.4), A = v.A / 100, t = tiempo(v); return { x: 100 * A * Math.cos(omega * t), EM: EP(80, A), t }; }
    function vista(v) {
      const z = estado(v), d = escena({ k: 80, m: 0.4, Acm: v.A }, { x: z.x }).datos; d.alto = 422;
      [[96, EP(80, 0.1), 'Referencia', 10], [224, z.EM, 'Ensayo', v.A]].forEach(([x, energia, nombre, A]) => {
        d.objetos.push({ tipo: 'barra-e', x, y: 356, w: 34, h: 60 * energia, color: 'f' });
        d.textos.push({ x, y: 256, texto: nombre, ancla: 'middle' }, { x, y: 380, texto: `E_M = ${f(energia, 3)} J`, color: 'f', ancla: 'middle' }, { x, y: 404, texto: `A = ${f(A)} cm`, color: 'i', ancla: 'middle' });
      });
      d.alt += ' Las dos barras totales usan 60 píxeles por joule; solo cambia la amplitud del ensayo.';
      return est(d);
    }
    const pred = { k: 200, Acm: 20, xcm: 10 }, cp = caso('cinetica-balance', pred);
    const totalPred = EP(pred.k, pred.Acm / 100), potencialPred = EP(pred.k, pred.xcm / 100);
    const predFigura = escena(pred, { x: pred.Acm, estado: 'Estado inicial al soltar' });
    glosario.push(
      { termino: 'oscilación libre', formas: ['oscilación libre', 'oscilaciones libres'], simple: 'Un vaivén sin empujes repetidos, como una regla flexible que sueltas después de doblarla.', def: 'Movimiento que continúa después de separar o impulsar un cuerpo, sin recibir empujes externos repetidos.', ejemplos: ['El bloque se separa del equilibrio y luego se suelta.', 'No hay una mano que empuje en cada vuelta.', 'El modelo ideal desprecia el rozamiento que frenaría el vaivén.'] },
      { termino: 'amortiguamiento', formas: ['amortiguamiento'], simple: 'El frenado gradual de un vaivén, como cuando dejas de impulsar un columpio.', def: 'Disminución progresiva de la amplitud porque el sistema pierde energía mecánica por rozamiento u otra fuerza que lo frena.', ejemplos: ['Un columpio alcanza cada vez menos altura cuando dejas de impulsarlo.', 'Una regla flexible deja de vibrar después de soltarla.', 'Una pesa colgada reduce su recorrido por la resistencia del aire.'] },
    );
    return { id: 'energia-mas', titulo: 'Energía durante el vaivén', pregunta: '¿Cómo se reparte la energía mientras el bloque va y vuelve?', temas: ['Energía en el MAS'], pieza: 'fis-estatica',
      aprendizaje: 'Uso la conservación de energía del resorte horizontal para calcular energía, rapidez y amplitud, sin confundir rapidez con sentido.', actividad: 'Cambiar la amplitud y seguir la energía total durante el movimiento.', ejemplos,
      lee: { tarjetas: [
        { titulo: 'Después de soltar el bloque', texto: 'Al separar el bloque y soltarlo comienza una oscilación libre: el resorte mantiene el vaivén sin una mano que siga empujando. En un columpio real, el rozamiento reduce poco a poco la amplitud; esa disminución es el amortiguamiento. Aquí lo despreciamos: la mesa y el resorte se consideran ideales.', dibujo: vista({ A: 10, t: 0 }) },
        { titulo: 'Las energías del sistema', texto: ['La energía cinética ', S.EC, ' corresponde al bloque que se mueve; la potencial elástica ', S.EPE, ', al resorte estirado o comprimido. La energía mecánica ', S.EM, ' reúne ambas partes. Como al doblar una regla, deformar el resorte requiere trabajo y deja energía almacenada. Primero observaremos solo la barra del total.'] },
        { titulo: 'El extremo no es reposo permanente', texto: 'Un punto de retorno es un extremo del recorrido. Allí el bloque se detiene un instante, pero el resorte sigue ejerciendo una fuerza hacia el equilibrio y lo hace volver. Elige una amplitud y sigue la barra de energía total mientras avanza el reloj.' },
      ] },
      juega: { pieza: 'fis-estatica', consigna: 'El bloque oscila sin rozamiento. Compara la energía total del ensayo con la referencia y sigue su movimiento.',
        mision: { texto: 'Consigue una energía mecánica de 0,9 J.', logrado: v => Math.abs(estado(v).EM - 0.9) < 1e-10, bien: 'Esa amplitud fija la energía total; la barra conserva su altura durante el vaivén.' },
        voz: 'La referencia conserva su amplitud; cambia solo la del ensayo.',
        leyenda: [{ s: S.A, t: 'distancia del equilibrio a cada extremo' }, { s: S.x, t: 'posición actual con signo' }, { s: S.k, t: 'rigidez del resorte horizontal' }, { s: S.m, t: 'masa del bloque' }, { s: S.EM, t: 'energía mecánica total' }, { s: S.t, t: 'tiempo desde que soltamos el bloque' }],
        controles: [{ id: 'A', etiqueta: 'Amplitud, A', min: 5, max: 20, paso: 5, inicio: 10, unidad: 'cm', decimales: 0, color: 'c-i' }, { id: 't', etiqueta: 'Tiempo, t', min: 0, max: 3, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, color: 'c-h', auto: { velocidad: 0.2 } }],
        dibujo: vista, lectura: v => [S.EM, ' = ', Q('EM', estado(v).EM, 'J', 3), ': se conserva durante el movimiento.'], minimo: 3 },
      predice: { pregunta: ['Se suelta el bloque desde el reposo con ', S.A, ' = ', Q('A', pred.Acm, 'cm'), ' y ', S.k, ' = ', Q('k', pred.k, 'N/m'), '. ¿Qué energía cinética tendrá en ', S.x, ' = ', Q('x', pred.xcm, 'cm'), '?'],
        datos: ['Resorte horizontal ideal, sin rozamiento ni empujes posteriores.', '1 m = 100 cm.'], dibujo: predFigura, revelar: reparto(pred), opciones: cp.opciones.slice(0, 4), caso: { tipo: 'cinetica-balance', ...pred, valor: cp.caso.valor }, coincide: 'La energía del movimiento es la parte que ya no está en el resorte.' },
      mira: { pieza: 'fis-estatica', datos: reparto(pred).datos, pasos: [
        paso('El dibujo muestra una posición interior. Para hallar el total, usamos el estado inicial: al soltar el bloque en el extremo, estaba en reposo y toda la energía era elástica.', [S.EM, ' = ', frac([Q('k', pred.k), ' · ', sup(n('A', pred.Acm / 100))], '2'), ' = ', n('EM', totalPred, 'J')]),
        paso('El resorte sigue deformado en esta posición interior, así que aún almacena energía. La calculamos con esa posición, no con la amplitud del recorrido.', [S.EPE, ' = ', frac([Q('k', pred.k), ' · ', sup(n('x', pred.xcm / 100))], '2'), ' = ', n('EPE', potencialPred, 'J')]),
        paso('El total incluye energía del resorte y del movimiento. Restamos la parte que aún guarda el resorte; el resto es la energía cinética del bloque.', [S.EC, ' = ', n('EM', totalPred), ' − ', n('EPE', potencialPred), ' = ', n('EC', cp.caso.valor, 'J')]),
        paso('La energía cinética contiene la velocidad al cuadrado. Al despejar obtenemos la rapidez positiva; para elegir un signo necesitamos saber hacia qué lado se mueve el bloque.', [S.EC, ' = ', frac([S.m, ' · ', sup(S.v)], '2'), '; ', vel, ' = ', raiz(frac(['2 · ', S.EC], S.m))]),
        paso('En un extremo toda la energía está en el resorte y la rapidez es cero. En el equilibrio el resorte no está deformado: toda es cinética y la rapidez es máxima.'),
        paso('La amplitud usa toda la energía, porque en el extremo no hay movimiento. Para otra posición usamos solo la energía elástica; en ambos casos extraemos raíz para obtener una distancia.', [S.A, ' = ', raiz(frac(['2 · ', S.EM], S.k)), '; |', S.x, '| = ', raiz(frac(['2 · ', S.EPE], S.k))]),
      ] },
      regla: { texto: 'La energía mecánica suma la cinética del movimiento y la elástica del resorte. Sin rozamiento ni empujes, no sale ni entra energía: solo cambia su reparto. Al pasar por el equilibrio, el resorte no está deformado y toda es cinética; en los extremos toda es elástica. Por eso la amplitud fija el total y el balance permite hallar la rapidez.',
        ecuacion: [S.EM, ' = ', S.EC, ' + ', S.EPE, '   ;   ', S.EC, ' = ', frac([S.m, ' · ', sup(S.v)], '2'), '   ;   ', S.EPE, ' = ', frac([S.k, ' · ', sup(S.x)], '2'), '   ;   ', S.EM, ' = ', frac([S.k, ' · ', sup(S.A)], '2')],
        condicion: 'el resorte es horizontal e ideal, la masa no cambia y no hay rozamiento ni empujes posteriores. La posición se mide desde la longitud natural y no supera la amplitud en valor absoluto. Con rozamiento, el vaivén pierde energía mecánica y su amplitud disminuye.', dibujo: reparto({ k: 100, m: 0.5, Acm: 20, xcm: 12 }) },
      resuelve: { pieza: 'fis-estatica', generar(s) { const z = Math.floor(s / 4) % 31, j = s % 4, tipos = ['cinetica-balance', 'rapidez-datos', 'amplitud-estado', 'rapidez-estados']; const ps = [
        { k: 80 + 4 * z, Acm: 18, xcm: 6 }, { m: 0.4, EM: 1.71 + z * 0.04, EPE: 0.51 },
        { k: 120, m: 0.4, xcm: 8, v: 1.61 + z * 0.01 }, { k: 100, m: 0.5, x1cm: 12, x2cm: 5, v1: 1.31 + z * 0.01 } ]; return resuelto(caso(tipos[j], ps[j])); } },
      ahoraTu: { pieza: 'fis-estatica', generar(s) { const z = Math.floor(s / 6) % 31, j = s % 6, tipos = ['total', 'potencial', 'amplitud', 'posicion-cinetica', 'rigidez', 'velocidad']; const ps = [
        { k: 140 + 4 * z, Acm: 12 }, { k: 180 + 4 * z, xcm: -9 }, { k: 120 + 4 * z, EM: 1.37 + z * 0.03 },
        { k: 160, Acm: 20, EC: 1.61 + z * 0.02 }, { m: 0.45, v: 1.51 + z * 0.01, Acm: 14 }, { m: 0.4, EC: 1.31 + z * 0.02, sentido: -1 } ]; return pregunta(caso(tipos[j], ps[j])); } },
    };
  })();
  // Mesas propias: conservan los cuatro identificadores publicados y abren controles adicionales.
  const laboratorio = (() => {
    const tiempo = val => Number(val.t.toFixed(2));
    const omega = val => Math.sqrt(val.k / val.m);
    const periodo = val => 2 * Math.PI / omega(val);
    const posicion = val => val.A * Math.cos(omega(val) * tiempo(val));
    const libre = val => {
      const aceleracion = -val.k * val.x / 100 / val.m;
      const datos = carrito(val.x, { textos: [
        { x: 12, y: 54, texto: `m = ${f(val.m)} kg`, color: 'f' },
        { x: 308, y: 54, texto: `k = ${f(val.k)} N/m`, color: 'f', ancla: 'end' },
        { x: 160, y: 212, texto: `a ${Math.abs(aceleracion * 100 - Math.round(aceleracion * 100)) < 1e-7 ? '=' : '≈'} ${f(aceleracion)} m/s²`, color: 'd', ancla: 'middle' },
      ], alt: 'Un bloque se suelta desde la posición elegida. Una flecha muestra su aceleración inicial hacia el equilibrio.' });
      if (Math.abs(aceleracion) > 1e-9) datos.flechas.push({ de: [178 + 4 * val.x, 76], ang: aceleracion > 0 ? 0 : 180, largo: 2 * Math.abs(aceleracion), color: 'd', texto: 'a', rumbo: [0, -1] });
      return est(datos);
    };
    const curva = val => ({
      x: { min: 0, max: 8, paso: 2, nombre: 't', unidad: 's', decimales: 0, color: 'h' },
      y: { min: -25, max: 25, paso: 10, nombre: 'x', unidad: 'cm', decimales: 0, color: 'i' },
      curvas: [{ puntos: Array.from({ length: 161 }, (_, j) => [j / 20, val.A * Math.cos(2 * Math.PI * j / 20 / val.T)]), color: 'i' }],
      puntos: [{ x: tiempo(val), y: val.A * Math.cos(2 * Math.PI * tiempo(val) / val.T), color: 'i', guias: true }], ajustado: true,
    });
    const pendulo = val => {
      const tt = tiempo(val), theta = 8 * Math.PI / 180 * Math.cos(Math.sqrt(val.g / val.L) * tt);
      const apoyo = [160, 32], bob = [160 + 180 * val.L * Math.sin(theta), 32 + 180 * val.L * Math.cos(theta)];
      return est({ alto: 280, objetos: [{ tipo: 'viga', x0: 116, x1: 204, y: 32 }, { tipo: 'cuerda', de: apoyo, a: bob }, { tipo: 'pelota', x: bob[0], y: bob[1], r: 9 }],
        lineas: [{ de: apoyo, a: [160, 225], discontinua: true }],
        cotas: [{ de: apoyo, a: bob, texto: `L = ${f(val.L)} m`, color: 'i', lado: -1, sep: 30 }],
        textos: [{ x: 12, y: 20, texto: `g ≈ ${f(val.g)} m/s²`, color: 'h' }, { x: 308, y: 250, texto: `t = ${f(tt)} s`, color: 'h', ancla: 'end' }, { x: 12, y: 270, texto: 'Ángulo máximo: 8°', color: 'h' }],
        alt: 'Péndulo simple con longitud medida desde el apoyo hasta el centro de la esfera. Oscila con un ángulo máximo de ocho grados.' });
    };
    return [
      { id: 'resorte-vivo', titulo: 'El resorte que oscila', pieza: 'fis-estatica',
        consigna: 'Cambia la masa, la rigidez y la amplitud. El reloj y el bloque siguen el mismo movimiento sobre una mesa sin rozamiento.',
        controles: [
          { id: 'A', etiqueta: 'Amplitud, A', min: 5, max: 20, paso: 5, inicio: 10, unidad: 'cm', decimales: 0, color: 'c-i' },
          { id: 'k', etiqueta: 'Rigidez, k', min: 20, max: 80, paso: 20, inicio: 40, unidad: 'N/m', decimales: 0, color: 'c-f' },
          { id: 'm', etiqueta: 'Masa, m', min: 0.5, max: 2, paso: 0.5, inicio: 1, unidad: 'kg', decimales: 1, color: 'c-f' },
          { id: 't', etiqueta: 'Tiempo, t', min: 0, max: 6, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, color: 'c-h', auto: { velocidad: 0.25 } },
        ],
        dibujo: val => est(carrito(posicion(val), { A: val.A, textos: [{ x: 160, y: 48, texto: `m = ${f(val.m)} kg; k = ${f(val.k)} N/m`, color: 'f', ancla: 'middle' }, { x: 308, y: 208, texto: `t = ${f(tiempo(val))} s`, color: 'h', ancla: 'end' }] })),
        lectura: val => [S.T, ' ≈ ', Q('T', periodo(val), 's'), '; ', S.t, ' = ', Q('t', tiempo(val), 's')],
        invitaciones: [
          { texto: 'Encuentra el período más largo que permite la mesa.', logrado: val => val.k === 20 && val.m === 2, bien: 'El resorte menos rígido y la mayor masa producen el período más largo.' },
          { texto: 'Consigue el mismo período que con 1 kg y 40 N/m, usando otra masa.', logrado: val => val.m !== 1 && Math.abs(val.k / val.m - 40) < 1e-9, bien: 'La razón entre rigidez y masa se conserva, por eso se conserva el período.' },
          { texto: 'Haz que la amplitud sea el doble de los 10 cm iniciales.', logrado: val => val.A === 20, bien: 'Llega dos veces más lejos. El período sigue dependiendo de la masa y la rigidez.' },
        ],
      },
      { id: 'resorte-libre', titulo: 'Al soltar el bloque', pieza: 'fis-estatica', consigna: 'Elige dónde sueltas el bloque desde el reposo. Compara su aceleración inicial con otra masa o con otro resorte.',
        controles: [
          { id: 'x', etiqueta: 'Posición inicial, x', min: -20, max: 20, paso: 5, inicio: 5, unidad: 'cm', decimales: 0, color: 'c-i' },
          { id: 'k', etiqueta: 'Rigidez, k', min: 20, max: 80, paso: 20, inicio: 40, unidad: 'N/m', decimales: 0, color: 'c-f' },
          { id: 'm', etiqueta: 'Masa, m', min: 0.5, max: 2, paso: 0.5, inicio: 1, unidad: 'kg', decimales: 1, color: 'c-f' },
        ], dibujo: libre,
        lectura: val => { const aa = -val.k * val.x / 100 / val.m; return [S.a, Math.abs(aa * 100 - Math.round(aa * 100)) < 1e-7 ? ' = ' : ' ≈ ', Q('a', aa, 'm/s²')]; },
        invitaciones: [
          { texto: 'Consigue la mayor aceleración inicial posible hacia la derecha.', logrado: val => val.x === -20 && val.k === 80 && val.m === 0.5, bien: 'Se suelta a la izquierda, con poca masa y el resorte más rígido.' },
          { texto: 'Encuentra una posición donde el bloque pueda quedarse en reposo al soltarlo.', logrado: val => val.x === 0, bien: 'En el equilibrio, con velocidad inicial cero, no comienza el vaivén.' },
          { texto: 'Obtén una aceleración inicial de 4 m/s² hacia la izquierda.', logrado: val => Math.abs(val.k * val.x / 100 / val.m - 4) < 1e-9, bien: 'Está a la derecha; la fuerza del resorte inicia el movimiento hacia la izquierda.' },
        ],
      },
      { id: 'pendulo-libre', titulo: 'Longitud y gravedad', pieza: 'fis-estatica', consigna: 'Compara péndulos de distintas longitudes y gravedades. Son modelos de cálculo: el ángulo máximo se mantiene en ocho grados.',
        controles: [
          { id: 'L', etiqueta: 'Longitud, L', min: 0.25, max: 1, paso: 0.25, inicio: 0.5, unidad: 'm', decimales: 2, color: 'c-i' },
          { id: 'g', etiqueta: 'Gravedad aproximada, g', opciones: [{ valor: 2.5, texto: '2,5 m/s²' }, { valor: 5, texto: '5 m/s²' }, { valor: 10, texto: '10 m/s²' }], inicio: 10, color: 'c-h' },
          { id: 't', etiqueta: 'Tiempo, t', min: 0, max: 6, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, color: 'c-h', auto: { velocidad: 0.3 } },
        ], dibujo: pendulo, lectura: val => [S.T, ' ≈ ', Q('T', 2 * Math.PI * Math.sqrt(val.L / val.g), 's')],
        invitaciones: [
          { texto: 'Consigue el período más largo de esta mesa.', logrado: val => val.L === 1 && val.g === 2.5, bien: 'La mayor longitud y la menor gravedad hacen más lento el vaivén.' },
          { texto: 'Duplica el período del péndulo de 25 cm manteniendo g en 10 m/s².', logrado: val => val.L === 1 && val.g === 10, bien: 'La longitud aumentó cuatro veces; en el modelo, el período aumenta dos veces.' },
          { texto: 'Iguala el período de L = 1 m y g = 10 m/s² con menos gravedad.', logrado: val => val.g < 10 && Math.abs(val.L / val.g - 0.1) < 1e-9, bien: 'La longitud y la gravedad disminuyeron en la misma proporción.' },
        ],
      },
      { id: 'coseno', titulo: 'La curva de la posición', pieza: 'ejes', consigna: 'Cambia amplitud y período. La curva conserva la misma escala; el punto señala la posición en el instante del reloj.',
        controles: [
          { id: 'A', etiqueta: 'Amplitud, A', min: 5, max: 20, paso: 5, inicio: 10, unidad: 'cm', decimales: 0, color: 'c-i' },
          { id: 'T', etiqueta: 'Período, T', min: 2, max: 8, paso: 2, inicio: 4, unidad: 's', decimales: 0, color: 'c-h' },
          { id: 't', etiqueta: 'Tiempo, t', min: 0, max: 8, paso: 0.5, inicio: 0, unidad: 's', decimales: 2, color: 'c-h', auto: { velocidad: 0.5 } },
        ], dibujo: val => ejes(curva(val)), lectura: val => [S.A, ' = ', Q('A', val.A, 'cm'), '; ', S.T, ' = ', Q('T', val.T, 's')],
        invitaciones: [
          { texto: 'Haz que se vean cuatro ciclos completos en los ocho segundos de la gráfica.', logrado: val => val.T === 2, bien: 'Cada ciclo dura dos segundos; cuatro ciclos completan ocho segundos.' },
          { texto: 'Haz que los extremos de la gráfica estén separados por 40 cm.', logrado: val => val.A === 20, bien: 'Los extremos están en −20 cm y +20 cm respecto del equilibrio.' },
          { texto: 'Sitúa el punto en el primer cruce del centro hacia la derecha.', logrado: val => Math.abs(tiempo(val) - 3 * val.T / 4) < 1e-9, bien: 'Ya pasó por el extremo izquierdo y vuelve hacia el derecho.' },
        ],
      },
    ];
  })();

  return {
    unidad: 'fisica.oscilaciones', version: '1.0.0', estado: 'completa',
    colores: COLORES,
    letras: {x:'posición desde el equilibrio', A:'amplitud', d:'distancia recorrida', δ:'deformación del resorte desde su longitud natural', v:'velocidad con signo', a:'aceleración con signo', F:'fuerza del resorte', t:'tiempo', T:'período', f:'frecuencia', N:'número de ciclos', m:'masa', k:'constante elástica', L:'longitud del péndulo', g:'aceleración de la gravedad', ω:'frecuencia angular', φ:'fase inicial', θ:'inclinación del péndulo', E_C:'energía cinética', E_PE:'energía potencial elástica', E_M:'energía mecánica'},
    requiere: ['/nucleo/kit/piezas/fis-estatica.js','/nucleo/kit/piezas/ejes.js'],
    glosario,
    laboratorio, laboratorioIdeas: {'resorte-vivo':['periodo-resorte'], 'resorte-libre':['aceleracion-al-centro'], 'pendulo-libre':['pendulo'], coseno:['graficas-mas']},
    historia: {
      texto: 'En 1657, Christiaan Huygens patentó un reloj de péndulo. El mecanismo contaba vaivenes para medir el tiempo. La regularidad del movimiento permitió mejorar los relojes, pero exigía cuidar las condiciones del péndulo: una oscilación muy amplia no tarda exactamente lo mismo que una pequeña.',
      pregunta: '¿Qué tendría que conservar un péndulo para que su reloj mida bien?',
      fuente: {titulo:'APS: Huygens y el primer reloj de péndulo',url:'https://www.aps.org/apsnews/2017/06/huygens-patents-first-pendulum-clock'},
    },
    ideas: [idea1, idea2, idea3, idea4, idea5, idea6],
  };
});
