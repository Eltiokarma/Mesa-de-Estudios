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
          enunciado = ['Un bloque va de ', S.x, ' = ', Q('x', -p.A, 'cm'), ' a ', S.x, ' = ', Q('x', p.A, 'cm'), ', con el equilibrio en cero. ¿Cuál es su amplitud?'];
          formula = [S.A, ' = distancia del equilibrio a un extremo'];
          cuenta = [S.A, ' = ', Q('A', valor, unidad)]; sentido = 'La amplitud es positiva y se mide desde el equilibrio.';
          malos = [2 * valor, -valor, 4 * valor]; explicaciones = ['Mide entre los dos extremos.', 'Confunde posición negativa con distancia.', 'Da el recorrido de un ciclo.']; break;
        case 'amplitud':
          valor = (p.der - p.izq) / 2; unidad = 'cm'; clave = 'A';
          enunciado = ['Un bloque oscila entre las marcas ', Q('x', p.izq, 'cm'), ' y ', Q('x', p.der, 'cm'), ' de una regla. ¿Cuál es su amplitud?'];
          formula = [S.A, ' = distancia entre extremos ÷ 2'];
          cuenta = [S.A, ' = (', Q('x', p.der), ' − ', Q('x', p.izq), ') ÷ 2 = ', Q('A', valor, unidad)];
          sentido = 'La amplitud llega del centro a un extremo; no abarca los dos extremos.';
          malos = [2 * valor, p.der, p.der + p.izq]; explicaciones = ['Toma toda la distancia entre extremos.', 'Mide desde el cero de la regla.', 'Suma las marcas de la regla.']; break;
        case 'periodo':
          valor = p.dt / p.N; unidad = 's'; clave = 'T';
          enunciado = ['Un bloque completa ', Q('N', p.N), ' oscilaciones en ', Q('t', p.dt, 's'), '. ¿Cuánto dura cada oscilación?'];
          formula = [S.T, ' = ', frac('tiempo total', 'número de ciclos')];
          cuenta = [S.T, ' = ', Q('t', p.dt), ' ÷ ', Q('N', p.N), ' = ', Q('T', valor, unidad)];
          sentido = 'El período corresponde a un solo ciclo completo.';
          malos = [p.N / p.dt, p.dt, p.dt / (2 * p.N)]; explicaciones = ['Invierte ciclos y tiempo.', 'Toma el tiempo de todos los ciclos.', 'Cuenta cada medio ciclo como completo.']; break;
        case 'frecuencia':
          valor = p.N / p.dt; unidad = 'Hz'; clave = 'f';
          enunciado = ['Un bloque realiza ', Q('N', p.N), ' ciclos completos en ', Q('t', p.dt, 's'), '. ¿Cuál es su frecuencia?'];
          formula = [S.f, ' = ', frac('número de ciclos', 'tiempo total')];
          cuenta = [S.f, ' = ', Q('N', p.N), ' ÷ ', Q('t', p.dt), ' = ', Q('f', valor, unidad)];
          sentido = 'La frecuencia cuenta ciclos por segundo.';
          malos = [p.dt / p.N, 2 * valor, p.N]; explicaciones = ['Invierte la división y calcula el período.', 'Cuenta dos veces cada ciclo.', 'No divide entre los segundos.']; break;
        case 'recorrido':
          valor = 4 * p.A * p.N; unidad = 'cm'; clave = 'd';
          enunciado = ['Un bloque tiene amplitud ', Q('A', p.A, 'cm'), ' y completa ', Q('N', p.N), ' ciclos. ¿Qué distancia recorre en total?'];
          formula = [S.d, ' = 4 · ', S.A, ' · ', S.N];
          cuenta = [S.d, ' = 4 · ', Q('A', p.A), ' · ', Q('N', p.N), ' = ', Q('d', valor, unidad)];
          sentido = 'Cada ida y vuelta recorre cuatro amplitudes, aunque termine donde empezó.';
          malos = [2 * p.A * p.N, p.A * p.N, 0]; explicaciones = ['Cuenta solo la ida en cada ciclo.', 'Cuenta una sola amplitud por ciclo.', 'Confunde distancia con desplazamiento.']; break;
        case 'posicion':
          valor = -p.distancia; unidad = 'cm'; clave = 'x';
          enunciado = ['La derecha es positiva. El bloque está ', Q('x', p.distancia, 'cm'), ' a la izquierda del equilibrio. ¿Cuál es su posición con signo?'];
          formula = [S.x, ' = −distancia al equilibrio'];
          cuenta = [S.x, ' = ', Q('x', valor, unidad)]; sentido = 'El signo indica el lado del equilibrio, no hacia dónde se mueve.';
          malos = [p.distancia, 0, -2 * p.distancia]; explicaciones = ['Da a la izquierda el signo positivo.', 'Confunde posición con la referencia.', 'Duplica la separación al centro.']; break;
        case 'tiempo':
          valor = p.N * p.T; unidad = 's'; clave = 't';
          enunciado = ['Un bloque repite su movimiento cada ', Q('T', p.T, 's'), '. ¿Cuánto tarda en completar ', Q('N', p.N), ' ciclos?'];
          formula = [S.T, ' = ', frac(S.t, S.N), ';   ', S.t, ' = ', S.N, ' · ', S.T];
          cuenta = [S.t, ' = ', Q('N', p.N), ' · ', Q('T', p.T), ' = ', Q('t', valor, unidad)]; sentido = 'Los tiempos de los ciclos se suman porque ocurren uno después de otro.';
          malos = [p.N / p.T, p.T / p.N, p.T]; explicaciones = ['Divide el número de ciclos entre el período.', 'Reparte un período entre todos los ciclos.', 'Cuenta solo el primer ciclo.']; break;
        case 'ciclos':
          valor = p.d / (4 * p.A); unidad = 'ciclos'; clave = 'N';
          enunciado = ['Un bloque de amplitud ', Q('A', p.A, 'cm'), ' recorre ', Q('d', p.d, 'cm'), ' y termina en su extremo inicial. ¿Cuántos ciclos completó?'];
          formula = [S.d, ' = 4 · ', S.A, ' · ', S.N, ';   ', S.N, ' = ', frac(S.d, ['4 · ', S.A])];
          cuenta = [S.N, ' = ', Q('d', p.d), ' ÷ (4 · ', Q('A', p.A), ') = ', Q('N', valor, unidad)]; sentido = 'Primero se reconoce cuánto recorre en cada ciclo; luego se cuenta cuántos caben.';
          malos = [2 * valor, 4 * valor, p.d]; explicaciones = ['Divide entre dos amplitudes.', 'Divide entre una amplitud.', 'Confunde centímetros con ciclos.']; break;
        case 'centro':
          valor = 2 * (p.final - p.inicio); unidad = 's'; clave = 'T';
          enunciado = ['El bloque cruza el equilibrio a los ', Q('t', p.inicio, 's'), '. En el siguiente cruce, a los ', Q('t', p.final, 's'), ', va en sentido contrario. ¿Cuál es su período?'];
          formula = [frac(S.T, '2'), ' = tiempo entre cruces consecutivos'];
          cuenta = [S.T, ' = 2 · (', Q('t', p.final), ' − ', Q('t', p.inicio), ') = ', Q('T', valor, unidad)]; sentido = 'Para completar el ciclo debe regresar al centro con el mismo sentido del primer cruce.';
          malos = [valor / 2, valor / 4, valor * 2]; explicaciones = ['Toma medio ciclo como ciclo completo.', 'Divide otra vez el tiempo entre cruces.', 'Cuenta cuatro medios ciclos.']; break;
        case 'minutos':
          valor = p.f * 60 * p.min; unidad = 'ciclos'; clave = 'N'; datos = ['1 min = 60 s.', 'La frecuencia permanece constante.'];
          enunciado = ['Un bloque oscila con frecuencia ', Q('f', p.f, 'Hz'), ' durante ', Q('t', p.min, 'min'), '. ¿Cuántos ciclos completa?'];
          formula = [S.f, ' = ', frac(S.N, S.t), ';   ', S.N, ' = ', S.f, ' · ', S.t];
          cuenta = [S.t, ' = ', Q('t', p.min), ' · 60 = ', Q('t', 60 * p.min, 's'), ';   ', S.N, ' = ', Q('f', p.f), ' · ', Q('t', 60 * p.min), ' = ', Q('N', valor, unidad)]; sentido = 'La frecuencia está por segundo; por eso el tiempo se convierte a segundos.';
          malos = [p.f * p.min, 60 * p.min / p.f, valor * 2]; explicaciones = ['Usa minutos como si fueran segundos.', 'Divide el tiempo entre la frecuencia.', 'Cuenta cada ida como ciclo completo.']; break;
        case 'camino-tiempo':
          valor = 4 * p.A * p.dt / p.T; unidad = 'cm'; clave = 'd';
          enunciado = ['Un bloque parte del extremo derecho. Su amplitud es ', Q('A', p.A, 'cm'), ' y su período, ', Q('T', p.T, 's'), '. ¿Qué distancia recorre en ', Q('t', p.dt, 's'), '?'];
          formula = [S.d, ' = 4 · ', S.A, ' · ', S.N, ' + 2 · ', S.A];
          cuenta = [Q('t', p.dt, 's'), ' = ', Q('N', Math.floor(p.dt / p.T)), ' · ', Q('T', p.T, 's'), ' + ', Q('t', p.T / 2, 's'), ';   ', S.d, ' = ', Q('N', Math.floor(p.dt / p.T)), ' · 4 · ', Q('A', p.A), ' + 2 · ', Q('A', p.A), ' = ', Q('d', valor, unidad)];
          sentido = 'Se cuentan ciclos completos y medios ciclos; no se supone que el bloque tenga rapidez constante.';
          malos = [valor / 2, p.A, -2 * p.A]; explicaciones = ['Cuenta solo dos amplitudes por ciclo.', 'Confunde recorrido con amplitud.', 'Confunde recorrido con desplazamiento.']; break;
        case 'marcas':
          valor = (p.final - p.inicio) / (p.N - 1); unidad = 's'; clave = 'T';
          enunciado = ['La primera llegada al extremo derecho se registra a los ', Q('t', p.inicio, 's'), '; la llegada número ', Q('N', p.N), ', a los ', Q('t', p.final, 's'), '. ¿Cuál es el período?'];
          formula = ['tiempo transcurrido = (número de llegadas − 1) · ', S.T];
          cuenta = [S.T, ' = (', Q('t', p.final), ' − ', Q('t', p.inicio), ') ÷ (', Q('N', p.N), ' − 1) = ', Q('T', valor, unidad)]; sentido = `Entre ${p.N} llegadas hay ${p.N - 1} intervalos; la primera llegada no es un intervalo adicional.`;
          malos = [(p.final - p.inicio) / p.N, p.final / (p.N - 1), p.final - p.inicio]; explicaciones = ['Cuenta llegadas en lugar de intervalos.', 'No resta el instante de la primera llegada.', 'Toma todos los intervalos como uno.']; break;
        case 'recorrido-frecuencia':
          valor = 4 * p.A * p.f * p.dt / 100; unidad = 'm'; clave = 'd'; datos = ['1 m = 100 cm.', 'El movimiento mantiene su amplitud y frecuencia.'];
          enunciado = ['Un bloque de amplitud ', Q('A', p.A, 'cm'), ' oscila a ', Q('f', p.f, 'Hz'), ' durante ', Q('t', p.dt, 's'), '. ¿Cuántos metros recorre?'];
          formula = [S.N, ' = ', S.f, ' · ', S.t, ';   ', S.d, ' = 4 · ', S.A, ' · ', S.N];
          cuenta = [S.N, ' = ', Q('f', p.f), ' · ', Q('t', p.dt), ' = ', Q('N', p.f * p.dt), ';   ', S.d, ' = 4 · ', Q('A', p.A / 100), ' · ', Q('N', p.f * p.dt), ' = ', Q('d', valor, unidad)]; sentido = 'Se convierte la amplitud a metros y se suma la distancia de todas las idas y vueltas.';
          malos = [valor * 100, valor / 2, p.A / 100]; explicaciones = ['Conserva centímetros, pero escribe metros.', 'Cuenta solo las idas.', 'Da la amplitud, no el recorrido.']; break;
        case 'amplitud-recorrido':
          valor = p.d / (4 * p.f * p.dt); unidad = 'cm'; clave = 'A';
          enunciado = ['Un bloque oscila a ', Q('f', p.f, 'Hz'), ' y recorre ', Q('d', p.d, 'cm'), ' en ', Q('t', p.dt, 's'), '. ¿Cuál es su amplitud?'];
          formula = [S.N, ' = ', S.f, ' · ', S.t, ';   ', S.d, ' = 4 · ', S.A, ' · ', S.N];
          cuenta = [S.N, ' = ', Q('f', p.f), ' · ', Q('t', p.dt), ' = ', Q('N', p.f * p.dt), ';   ', S.A, ' = ', Q('d', p.d), ' ÷ (4 · ', Q('N', p.f * p.dt), ') = ', Q('A', valor, unidad)]; sentido = 'El recorrido se reparte entre todos los ciclos y entre las cuatro amplitudes de cada ciclo.';
          malos = [2 * valor, 4 * valor, p.d / 4]; explicaciones = ['Usa dos amplitudes por ciclo.', 'Usa una amplitud por ciclo.', 'Olvida cuántos ciclos hubo.']; break;
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
      const cuentas = [];
      if (tipo === 'amplitud-recorrido') cuentas.push(paso('Despejamos la amplitud dividiendo entre cuatro veces el número de ciclos.', [S.A, ' = ', frac(S.d, ['4 · ', S.N])]));
      if (tipo === 'marcas') cuentas.push(paso('Dividimos el tiempo transcurrido entre el número de intervalos.', [S.T, ' = ', frac('tiempo transcurrido', 'número de llegadas − 1')]));
      cuentas.push(paso('Reemplazamos los datos y hacemos la cuenta.', cuenta));
      return { enunciado, datos, dibujo, pide: `Se pide ${({ T: 'el período', f: 'la frecuencia', A: 'la amplitud', d: 'la distancia recorrida', x: 'la posición con signo', t: 'el tiempo total', N: 'el número de ciclos' })[clave]}.`,
        tengo, regla: paso(tipo === 'camino-tiempo' ? 'Sumamos el recorrido de los ciclos completos y el del medio ciclo final.' : 'Relacionamos las cantidades según qué cuenta un ciclo completo.', formula), cuentas, sentido,
        respuesta: [Q(clave, valor, unidad)], opciones: opciones(valor, errores, fmt), caso: ps,
        erroresEjemplo: errores.map((e, j) => `${fmt(e.valor)}: ${['cambia la operación', 'confunde el dato pedido', 'cuenta mal los intervalos'][j]}.`).join(' ') };
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
      ejemplos[j].solucion[ejemplos[j].solucion.length - 1].texto = c.opciones.slice(1).map(o => `${o.texto}: ${o.siFuera}`).join(' ');
    }
    // El animador puede entregar cinco decimales; el modelo toma el mismo décimo visible en el control.
    const tiempo = val => Number(val.t.toFixed(1));
    const pos = val => val.A * Math.cos(2 * Math.PI * tiempo(val) / val.T);
    const vista = val => est(carrito(pos(val), { A: val.A, textos: [{ x: 308, y: 208, texto: `t = ${f(tiempo(val), 1)} s`, color: 'h', ancla: 'end' }] }));
    const antes = est(carrito(12, { A: 12, rotuloX: false, textos: [{ x: 160, y: 48, texto: '8 ciclos en 4 s', ancla: 'middle' }] }));
    const despues = est(carrito(12, { A: 12, rotuloX: false, textos: [{ x: 160, y: 48, texto: 'T = 0,5 s', color: 'h', ancla: 'middle' }] }));
    glosario.push(
      { termino: 'oscilación', formas: ['oscilación', 'oscilaciones', 'ciclo', 'ciclos'], simple: 'Una ida y vuelta completa.', def: 'Repetición del movimiento que termina en la misma posición y con el mismo sentido que al empezar.', ejemplos: ['Un bloque sale del extremo derecho, llega al izquierdo y vuelve al derecho.', 'Cruzar el centro hacia la derecha y volver a cruzarlo hacia la derecha completa un ciclo.', 'Llegar al extremo opuesto desde un extremo es medio ciclo.'] },
      { termino: 'amplitud', simbolo: 'A', medida: 'm', simple: 'La mayor distancia al equilibrio.', def: 'Distancia entre la posición de equilibrio y cualquiera de los extremos de una oscilación simétrica.', ejemplos: ['Entre −3 cm y +3 cm, la amplitud es 3 cm.', 'Una amplitud de 6 cm deja 12 cm entre extremos.', 'La amplitud es una distancia: no lleva signo negativo.'] },
    );
    return {
      id: 'ciclo-y-amplitud', titulo: 'Medir un vaivén', pregunta: '¿Cómo describimos un movimiento que va y vuelve?', temas: ['Movimiento periódico y oscilatorio'], pieza: 'fis-estatica',
      aprendizaje: 'Distingo amplitud, posición, período y frecuencia; cuento un ciclo cuando se repiten la posición y el sentido.',
      actividad: 'Cambiar el recorrido del bloque y mirar cuánto tarda en repetir su movimiento.',
      lee: { tarjetas: [
        { titulo: 'Un bloque que va y vuelve', texto: 'Un bloque sujeto a un resorte se mueve por una mesa lisa. La línea central señala el equilibrio: allí la fuerza horizontal del resorte es cero.', dibujo: est(carrito(10, { A: 10 })) },
        { titulo: 'Posición y amplitud', texto: ['La posición ', S.x, ' se mide desde el equilibrio y lleva signo. La amplitud ', S.A, ' es la mayor distancia al equilibrio. Elegimos positiva la derecha.'] },
        { titulo: 'Qué cuenta el reloj', texto: ['El período ', S.T, ' mide la duración de un ciclo. La frecuencia ', S.f, ' cuenta ciclos por segundo. Observa dónde vuelve el bloque y hacia dónde se mueve.'] },
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
          { valor: 4 / 16, error: 'OS-MEDIO', siFuera: 'Ese tiempo aparece si cuentas cada ida y cada vuelta como ciclos separados.' },
          { valor: 4 / 4, error: 'OS-PARES', siFuera: 'Eso repartiría los cuatro segundos entre cuatro ciclos; el bloque completó ocho.' },
          { valor: 8 / 4, error: 'OS-INV', siFuera: 'Esa división cuenta ciclos por segundo. Aquí se pide cuánto dura cada ciclo.' },
        ], n => `${f(n)} s`), coincide: 'Cada uno de los ocho ciclos ocupa la misma parte de los cuatro segundos.' },
      mira: { pieza: 'fis-estatica', datos: despues.datos, pasos: [paso('Repartimos el tiempo total entre los ciclos completos.', [S.T, ' = ', frac(Q('t', 4, 's'), Q('N', 8))]), paso('Cada ciclo dura medio segundo.', [S.T, ' = ', Q('T', 4 / 8, 's')]), paso('La frecuencia cuenta cuántos ciclos caben en un segundo.', [S.f, ' = ', frac(Q('N', 8), Q('t', 4, 's')), ' = ', Q('f', 8 / 4, 'Hz')]),
        paso('Entre cruces consecutivos del centro pasa medio período; cambia el sentido.', ['tiempo entre cruces = ', frac(S.T, '2')]),
        paso('Tres llegadas al mismo extremo dejan dos intervalos completos entre ellas.', ['número de intervalos = número de llegadas − 1']),
        paso('Desde un extremo: centro, extremo opuesto, centro y regreso suman cuatro amplitudes.', ['recorrido de un ciclo = 4 · ', S.A]) ] },
      regla: { texto: 'La amplitud mide del equilibrio a un extremo. El período es tiempo por ciclo; la frecuencia, ciclos por tiempo. Un ciclo recorre cuatro amplitudes.',
        ecuacion: [S.T, ' = ', frac(S.t, S.N), '; ', S.f, ' = ', frac(S.N, S.t), ' = ', frac('1', S.T), '; ', S.d, ' = 4 · ', S.A, ' · ', S.N],
        condicion: 'el movimiento se repite regularmente; N cuenta ciclos completos y x se mide desde el equilibrio.',
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
          { x: 308, y: y - 45, texto: j && !revelar ? 'a = ?' : `a = ${signo(c.a)}${f(c.a)} m/s²`, color: j && !revelar ? undefined : 'd', ancla: 'end' },
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
      if (Object.keys(p).some(k => /cm$/.test(k))) d.push('1 m = 100 cm.');
      if (p.gramos != null) d.push('1 kg = 1000 g.');
      switch (tipo) {
      case 'fuerza':
        valor = -p.k * p.x; clave = 'F'; unidad = 'N';
        enunciado = ['Un resorte de ', dato('k', p.k, 'N/m'), ' tiene al bloque en ', S.x, ' = ', dato('x', p.x, 'm'), '. ¿Qué fuerza horizontal ejerce sobre el bloque?'];
        regla = [S.F, ' = −', S.k, ' · ', S.x];
        cuentas.push(paso('Multiplicamos la rigidez por el desplazamiento y cambiamos el signo.', [S.F, ' = −', dato('k', p.k), ' · ', par('x', p.x), igual(valor), dato('F', valor, unidad)]));
        agregar('signo', -valor, 'signo cambiado', 'falta el signo que indica el regreso');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'cuentas dos veces la fuerza del único resorte');
        agregar('media', valor / 2, 'das fuerza media', 'promedias con cero en vez de tomar este instante'); break;
      case 'aceleracion':
        valor = p.F / p.m;
        enunciado = ['Un bloque de ', dato('m', p.m, 'kg'), ' recibe una fuerza horizontal neta de ', dato('F', p.F, 'N'), '. ¿Cuál es su aceleración con signo?'];
        regla = [S.F, ' = ', S.m, ' · ', S.a, '; ', S.a, ' = ', frac(S.F, S.m)];
        cuentas.push(paso('Dividimos la fuerza neta entre la masa del bloque.', [S.a, ' = ', frac(dato('F', p.F), dato('m', p.m)), igual(valor), dato('a', valor, unidad)]));
        agregar('signo', -valor, 'inviertes el sentido', 'cambias el sentido de la fuerza neta');
        agregar('producto', p.F * p.m, 'multiplicas por masa', 'multiplicas por la masa en vez de dividir');
        agregar('sin-masa', p.F, 'omites la masa', 'das el valor de la fuerza como aceleración');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'cuentas dos veces la fuerza neta'); break;
      case 'rigidez':
        valor = -p.F / p.x; clave = 'k'; unidad = 'N/m';
        enunciado = ['Cuando el bloque está en ', S.x, ' = ', dato('x', p.x, 'm'), ', el resorte ejerce ', dato('F', p.F, 'N'), '. ¿Cuál es su constante elástica?'];
        regla = [S.F, ' = −', S.k, ' · ', S.x, '; ', S.k, ' = ', frac(['−', S.F], S.x)];
        cuentas.push(paso('Despejamos la constante elástica conservando el signo del desplazamiento.', [S.k, ' = ', frac(['−', par('F', p.F)], par('x', p.x)), igual(valor), dato('k', valor, unidad)]));
        agregar('signo', -valor, 'rigidez negativa', 'omites el signo de la fuerza recuperadora');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'cuentas dos veces la fuerza indicada');
        agregar('mitad', valor / 2, 'duplicas el desplazamiento', 'usas el doble de la separación dada'); break;
      case 'posicion':
        valor = -p.F / p.k; clave = 'x'; unidad = 'm';
        enunciado = ['Un resorte de ', dato('k', p.k, 'N/m'), ' ejerce ', dato('F', p.F, 'N'), ' sobre el bloque. ¿Cuál es su desplazamiento desde el equilibrio?'];
        regla = [S.F, ' = −', S.k, ' · ', S.x, '; ', S.x, ' = ', frac(['−', S.F], S.k)];
        cuentas.push(paso('Despejamos el desplazamiento; su signo debe ser contrario al de la fuerza.', [S.x, ' = ', frac(['−', par('F', p.F)], dato('k', p.k)), igual(valor), dato('x', valor, unidad)]));
        agregar('signo', -valor, 'signo cambiado', 'ubicas el bloque en el sentido de la fuerza');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'despejas usando dos veces la fuerza dada');
        agregar('mitad', valor / 2, 'duplicas la rigidez', 'usas dos veces la constante elástica'); break;
      case 'aceleracion-cm':
      case 'aceleracion-gramos': {
        const masa = p.m ?? p.gramos / 1000, x = p.xcm / 100;
        valor = -p.k * x / masa;
        enunciado = ['Un bloque de ', dato('m', p.m ?? p.gramos, p.m != null ? 'kg' : 'g'), ' está unido a un resorte de ', dato('k', p.k, 'N/m'), '. En ', S.x, ' = ', dato('x', p.xcm, 'cm'), ', ¿cuál es su aceleración?'];
        const conversion = [S.x, ' = ', frac(dato('x', p.xcm), '100'), ' = ', dato('x', x, 'm')];
        if (p.gramos != null) conversion.push('; ', S.m, ' = ', frac(dato('m', p.gramos), '1000'), ' = ', dato('m', masa, 'kg'));
        cuentas.push(paso('Expresamos el desplazamiento en metros y la masa en kilogramos.', conversion));
        cuentas.push(paso('Aplicamos la fuerza del resorte y la segunda ley.', [S.a, ' = ', frac(['−', dato('k', p.k), ' · ', par('x', x)], dato('m', masa)), igual(valor), dato('a', valor, unidad)]));
        agregar('signo', -valor, 'signo cambiado', 'haces que la aceleración se aleje del equilibrio');
        agregar('sin-masa', -p.k * x, 'omites la masa', 'das la fuerza como si fuera aceleración');
        agregar('producto', -p.k * x * masa, 'multiplicas por masa', 'multiplicas la fuerza por la masa');
        agregar('cm-diez', 10 * valor, 'conviertes entre diez', 'divides los centímetros entre diez y no entre cien');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'cuentas dos veces la fuerza del resorte'); break;
      }
      case 'masa': {
        const fuerza = -p.k * p.xcm / 100; valor = fuerza / p.a; clave = 'm'; unidad = 'kg';
        enunciado = ['Un resorte de ', dato('k', p.k, 'N/m'), ' acelera al bloque a ', dato('a', p.a, 'm/s²'), ' cuando ', S.x, ' = ', dato('x', p.xcm, 'cm'), '. ¿Cuál es la masa del bloque?'];
        cuentas.push(paso('Convertimos el desplazamiento y calculamos la fuerza del resorte.', [S.F, ' = −', dato('k', p.k), ' · ', frac(par('x', p.xcm), '100'), igual(fuerza), dato('F', fuerza, 'N')]));
        cuentas.push(paso('Despejamos la masa dividiendo fuerza entre aceleración.', [S.m, ' = ', frac(S.F, S.a), ' = ', frac(par('F', fuerza), par('a', p.a)), igual(valor), dato('m', valor, unidad)]));
        agregar('signo', -valor, 'masa negativa', 'cambias solo uno de los signos de la división');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'cuentas dos veces la fuerza del resorte');
        agregar('mitad', valor / 2, 'duplicas la aceleración', 'divides entre dos veces la aceleración dada'); break;
      }
      case 'comparacion':
        valor = p.a1 * p.x2cm / p.x1cm;
        enunciado = ['En un mismo MAS, ', a1, ' = ', dato('a', p.a1, 'm/s²'), ' cuando ', x1, ' = ', dato('x', p.x1cm, 'cm'), '. ¿Qué aceleración corresponde a ', x2, ' = ', dato('x', p.x2cm, 'cm'), '?'];
        regla = [frac(a2, a1), ' = ', frac(x2, x1)];
        cuentas.push(paso('La masa y la rigidez permanecen iguales en los dos estados.', [a2, ' = ', a1, ' · ', frac(x2, x1)]));
        cuentas.push(paso('Conservamos los signos al comparar los dos desplazamientos.', [a2, ' = ', par('a', p.a1), ' · ', frac(par('x', p.x2cm), par('x', p.x1cm)), igual(valor), dato('a', valor, unidad)]));
        agregar('signo', -valor, 'signo cambiado', 'cambias el signo de la aceleración calculada');
        agregar('sin-cambio', p.a1, 'mantienes la aceleración', 'conservas la aceleración del primer estado');
        agregar('inversa', p.a1 * p.x1cm / p.x2cm, 'inviertes la razón', 'inviertes los desplazamientos en la comparación');
        agregar('cuadrado', p.a1 * (p.x2cm / p.x1cm) ** 2, 'elevas la razón', 'elevas al cuadrado la razón de posiciones'); break;
      case 'posicion-cm': {
        const fuerza = p.m * p.a; valor = -100 * fuerza / p.k; clave = 'x'; unidad = 'cm';
        enunciado = ['Un bloque de ', dato('m', p.m, 'kg'), ' y un resorte de ', dato('k', p.k, 'N/m'), ' producen una aceleración de ', dato('a', p.a, 'm/s²'), '. ¿Cuál es el desplazamiento en centímetros?'];
        cuentas.push(paso('Calculamos la fuerza que produce la aceleración indicada.', [S.F, ' = ', dato('m', p.m), ' · ', par('a', p.a), igual(fuerza), dato('F', fuerza, 'N')]));
        cuentas.push(paso('Despejamos el desplazamiento y lo expresamos en centímetros.', [S.x, ' = ', frac(['−', par('F', fuerza)], dato('k', p.k)), ' · 100', igual(valor), dato('x', valor, unidad)]));
        agregar('signo', -valor, 'signo cambiado', 'ubicas el bloque en el sentido de la aceleración');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'despejas con dos veces la fuerza neta');
        agregar('mitad', valor / 2, 'duplicas la rigidez', 'usas dos veces la constante elástica'); break;
      }
      case 'calibrada': {
        const rigidez = -p.F1 * 100 / p.x1cm; valor = p.F1 * p.x2cm / (p.m * p.x1cm);
        enunciado = ['Un bloque de ', dato('m', p.m, 'kg'), ' recibe ', dato('F', p.F1, 'N'), ' en ', x1, ' = ', dato('x', p.x1cm, 'cm'), '. Con el mismo resorte, ¿qué aceleración tendrá en ', x2, ' = ', dato('x', p.x2cm, 'cm'), '?'];
        cuentas.push(paso('Reconstruimos la constante elástica con el primer estado.', [S.k, ' = ', frac(['−', par('F', p.F1)], frac(par('x', p.x1cm), '100')), igual(rigidez), dato('k', rigidez, 'N/m')]));
        cuentas.push(paso('Calculamos la aceleración usando el nuevo desplazamiento.', [a2, ' = ', frac(['−', dato('k', rigidez), ' · ', frac(par('x', p.x2cm), '100')], dato('m', p.m)), igual(valor), dato('a', valor, unidad)]));
        agregar('sin-posicion', p.F1 / p.m, 'mantienes la fuerza', 'usas la fuerza del primer estado');
        agregar('signo', -valor, 'signo cambiado', 'inviertes el sentido de la aceleración');
        agregar('posicion-inversa', p.F1 * p.x1cm / (p.m * p.x2cm), 'inviertes los desplazamientos', 'inviertes la razón entre los desplazamientos');
        agregar('sin-masa', p.F1 * p.x2cm / p.x1cm, 'omites la masa', 'das la nueva fuerza como aceleración');
        agregar('producto-masa', p.F1 * p.x2cm * p.m / p.x1cm, 'multiplicas por masa', 'multiplicas por la masa en vez de dividir'); break;
      }
      case 'masa-calibrada': {
        const masa = p.F1 / p.a1; valor = -p.k * p.x2cm / (100 * masa);
        enunciado = ['Una fuerza horizontal neta de ', dato('F', p.F1, 'N'), ' acelera un bloque a ', dato('a', p.a1, 'm/s²'), '. Unido a un resorte de ', dato('k', p.k, 'N/m'), ', ¿qué aceleración tiene en ', x2, ' = ', dato('x', p.x2cm, 'cm'), '?'];
        cuentas.push(paso('La primera fuerza y su aceleración permiten hallar la masa.', [S.m, ' = ', frac(F1, a1), ' = ', frac(par('F', p.F1), par('a', p.a1)), igual(masa), dato('m', masa, 'kg')]));
        cuentas.push(paso('Usamos esa masa con la fuerza del resorte en el nuevo estado.', [a2, ' = ', frac(['−', dato('k', p.k), ' · ', frac(par('x', p.x2cm), '100')], dato('m', masa)), igual(valor), dato('a', valor, unidad)]));
        agregar('signo', -valor, 'signo cambiado', 'inviertes el sentido de la fuerza');
        agregar('sin-cambio', p.a1, 'mantienes la aceleración', 'usas la aceleración del ensayo anterior');
        agregar('masa-inversa', -p.k * p.x2cm * p.F1 / (100 * p.a1), 'inviertes la masa', 'inviertes fuerza y aceleración al hallar la masa');
        agregar('sin-masa', -p.k * p.x2cm / 100, 'omites la masa', 'das la fuerza del resorte como aceleración');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'cuentas dos veces la fuerza del resorte'); break;
      }
      case 'masa-nueva': {
        const masa = -p.k * p.x1cm / (100 * p.a1); valor = p.a1 * p.x2cm / (p.x1cm * p.factorM);
        enunciado = ['Un resorte de ', dato('k', p.k, 'N/m'), ' da ', a1, ' = ', dato('a', p.a1, 'm/s²'), ' en ', x1, ' = ', dato('x', p.x1cm, 'cm'), '. La masa se multiplica por ', dato('m', p.factorM), '. ¿Qué aceleración hay en ', x2, ' = ', dato('x', p.x2cm, 'cm'), '?'];
        cuentas.push(paso('Hallamos la masa del primer ensayo mediante fuerza y aceleración.', [m1, ' = ', frac(['−', dato('k', p.k), ' · ', frac(par('x', p.x1cm), '100')], par('a', p.a1)), igual(masa), dato('m', masa, 'kg')]));
        cuentas.push(paso('La nueva masa multiplica el denominador; el desplazamiento también cambia.', [a2, ' = ', frac(['−', dato('k', p.k), ' · ', frac(par('x', p.x2cm), '100')], [dato('m', p.factorM), ' · ', dato('m', masa)]), igual(valor), dato('a', valor, unidad)]));
        agregar('sin-masa-nueva', p.a1 * p.x2cm / p.x1cm, 'ignoras masa nueva', 'conservas la masa del primer ensayo');
        agregar('masa-directa', p.a1 * p.x2cm * p.factorM / p.x1cm, 'masa directamente proporcional', 'multiplicas por el cambio de masa');
        agregar('sin-posicion', p.a1 / p.factorM, 'ignoras posición nueva', 'conservas el desplazamiento del primer ensayo');
        agregar('posicion-inversa', p.a1 * p.x1cm / (p.x2cm * p.factorM), 'inviertes los desplazamientos', 'inviertes la razón de posiciones');
        agregar('signo', -valor, 'signo cambiado', 'inviertes el sentido de la aceleración'); break;
      }
      case 'rigidez-nueva': {
        const primero = -100 * p.m * p.a1 / p.k1; valor = primero / p.factorK; clave = 'x'; unidad = 'cm';
        enunciado = ['Un bloque de ', dato('m', p.m, 'kg'), ' acelera a ', dato('a', p.a1, 'm/s²'), ' con rigidez ', dato('k', p.k1, 'N/m'), '. La rigidez se multiplica por ', dato('k', p.factorK), '. ¿Qué desplazamiento mantiene esa aceleración?'];
        cuentas.push(paso('Hallamos el desplazamiento que correspondía al primer resorte.', [x1, ' = ', frac(['−', dato('m', p.m), ' · ', par('a', p.a1)], dato('k', p.k1)), ' · 100', igual(primero), dato('x', primero, 'cm')]));
        cuentas.push(paso('La fuerza requerida es la misma; dividimos por el cambio de rigidez.', [x2, ' = ', frac(['−100 · ', dato('m', p.m), ' · ', par('a', p.a1)], [dato('k', p.k1), ' · ', dato('k', p.factorK)]), igual(valor), dato('x', valor, unidad)]));
        agregar('sin-rigidez', primero, 'mantienes el desplazamiento', 'ignoras el cambio de rigidez');
        agregar('rigidez-directa', primero * p.factorK, 'multiplicas por rigidez', 'multiplicas en vez de dividir por el cambio');
        agregar('signo', -valor, 'signo cambiado', 'ubicas el bloque en el sentido de la aceleración');
        agregar('masa-inversa', -100 * p.a1 / (p.m * p.k1 * p.factorK), 'inviertes la masa', 'divides entre la masa al hallar la fuerza');
        agregar('doble', 2 * valor, 'duplicas la fuerza', 'usas dos veces la fuerza requerida'); break;
      }
      case 'dos-masas': {
        const rigidez = -100 * p.m1 * p.a1 / p.x1cm; valor = p.a1 * p.m1 * p.x2cm / (p.m2 * p.x1cm);
        enunciado = ['Con ', dato('m', p.m1, 'kg'), ', un resorte da ', dato('a', p.a1, 'm/s²'), ' en ', x1, ' = ', dato('x', p.x1cm, 'cm'), '. Se coloca otro bloque de ', dato('m', p.m2, 'kg'), '. ¿Qué aceleración tiene en ', x2, ' = ', dato('x', p.x2cm, 'cm'), '?'];
        cuentas.push(paso('La primera masa y su aceleración determinan la fuerza y la rigidez.', [S.k, ' = ', frac(['−', dato('m', p.m1), ' · ', par('a', p.a1)], frac(par('x', p.x1cm), '100')), igual(rigidez), dato('k', rigidez, 'N/m')]));
        cuentas.push(paso('Usamos la misma rigidez con el segundo bloque y su posición.', [a2, ' = ', frac(['−', dato('k', rigidez), ' · ', frac(par('x', p.x2cm), '100')], dato('m', p.m2)), igual(valor), dato('a', valor, unidad)]));
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
        vistos.add(fmt(e.valor)); elegidos.push({ ...e, error: `OS-ACEL-${tipo}-${e.op}`, siFuera: `Bien: identificas las cantidades; ${e.motivo}. Sale ${fmt(e.valor)}.` });
        if (elegidos.length === limite) break;
      }
      if (elegidos.length !== limite) throw new Error('Faltan distractores: ' + tipo + ' ' + JSON.stringify(p));
      let dibujo;
      if (tipo === 'comparacion') dibujo = dosEstados({ xcm: p.x1cm, a: p.a1 }, { xcm: p.x2cm });
      else {
        const xx = p.xcm ?? p.x2cm ?? (p.x != null ? 100 * p.x : null);
        const rotulos = [], campos = [['m', 'kg'], ['k', 'N/m'], ['F', 'N'], ['a', 'm/s²']];
        for (const [c, u] of campos) if (p[c] != null) rotulos.push({ x: 45, y: 45 + 17 * rotulos.length, texto: `${c} = ${f(p[c], 3)} ${u}`, color: COLORES[c] });
        const datos = carrito(xx ?? 0, { rotuloX: xx != null, textos: rotulos, alt: 'El bloque y el resorte del problema. Solo se rotulan cantidades dadas; la magnitud pedida no está dibujada.' });
        if (xx == null) {
          datos.lineas = []; datos.textos = datos.textos.filter(t => t.texto !== 'Equilibrio');
          datos.textos.push({ x: 160, y: 208, texto: 'Esquema sin escala; posición desconocida', ancla: 'middle' });
        }
        dibujo = est(datos);
      }
      const nombres = { k: ['k', 'N/m'], k1: ['k', 'N/m'], m: ['m', 'kg'], m1: ['m', 'kg'], m2: ['m', 'kg'], gramos: ['m', 'g'],
        F: ['F', 'N'], F1: ['F', 'N'], a: ['a', 'm/s²'], a1: ['a', 'm/s²'], x: ['x', 'm'], xcm: ['x', 'cm'], x1cm: ['x', 'cm'], x2cm: ['x', 'cm'], factorK: ['k', ''], factorM: ['m', ''] };
      const etiquetas = { k1: 'rigidez inicial', m1: 'primera masa', m2: 'segunda masa', F1: 'primera fuerza', a1: 'primera aceleración', x1cm: 'primera posición', x2cm: 'segunda posición', factorK: 'factor de rigidez', factorM: 'factor de masa', gramos: 'masa' };
      const tengo = Object.entries(p).flatMap(([n, v], j) => [j ? '; ' : '', `${etiquetas[n] || n}: `, numero(nombres[n][0], v, nombres[n][1])]);
      const sentido = clave === 'm' || clave === 'k' ? 'La masa y la constante elástica son positivas; los signos se conservaron en las fuerzas.' : clave === 'x' ? 'El desplazamiento queda en el lado opuesto al sentido de la fuerza y la aceleración.' : 'El signo ubica la aceleración y la fuerza hacia el equilibrio, no necesariamente el movimiento.';
      return { enunciado, datos: d, dibujo, pide: `Se pide ${({ a: 'la aceleración con signo', F: 'la fuerza con signo', k: 'la constante elástica', m: 'la masa del bloque', x: 'el desplazamiento con signo' })[clave]}.`,
        tengo, regla: paso('Relacionamos fuerza, desplazamiento y masa.', regla), cuentas, sentido,
        respuesta: [V(clave, fmt(valor))], opciones: opciones(valor, elegidos, fmt), caso: { tipo, ...p, valor, unidad, errores: elegidos.map(e => ({ id: e.error, valor: e.valor })) },
        erroresEjemplo: elegidos.map(e => `${fmt(e.valor)}: ${e.corta}.`).join(' ') };
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
      { termino: 'movimiento armónico simple', formas: ['movimiento armónico simple', 'MAS'], simple: 'Un modelo ideal para estudiar ciertos vaivenes.',
        def: 'Movimiento oscilatorio rectilíneo ideal que relaciona posición, velocidad y aceleración.',
        ejemplos: ['Un carro unido a un resorte ideal oscila sobre una mesa sin roce.', 'El modelo describe estados a la izquierda y a la derecha del equilibrio.', 'La posición, la velocidad y la aceleración describen aspectos distintos del mismo movimiento.'] },
      { termino: 'fuerza recuperadora', formas: ['fuerza recuperadora', 'fuerza restauradora'], simple: 'El empuje que permite regresar.',
        def: 'Fuerza del sistema que tiende a devolver el objeto hacia su posición de equilibrio.',
        ejemplos: ['Un resorte estirado jala el bloque.', 'Un resorte comprimido empuja el bloque.', 'La fuerza de una mano que sostiene el bloque no es la fuerza recuperadora del resorte.'] },
      { termino: 'elongación', formas: ['elongación', 'elongaciones'], simbolo: 'x', medida: 'm', simple: 'La separación del equilibrio, con su signo.',
        def: 'Desplazamiento del objeto desde la posición de equilibrio. En una recta se expresa mediante una componente con signo.',
        ejemplos: ['Con la derecha positiva, una elongación de +4 cm queda a la derecha.', 'Una elongación de -7 cm ubica el objeto a la izquierda del equilibrio.', 'Una elongación nula indica que el objeto está en el equilibrio.'] },
    );
    return {
      id: 'aceleracion-al-centro', titulo: 'El empuje del resorte', pregunta: '¿Cómo relacionamos posición, fuerza y aceleración?', temas: ['Ecuaciones y gráficas del MAS', 'Masa-resorte horizontal y vertical'], pieza: 'fis-estatica',
      aprendizaje: 'Relaciono el desplazamiento con fuerza y aceleración; conservo los signos y distingo acelerar de moverse.',
      actividad: 'Elegir desde dónde soltar el bloque y comparar su aceleración inicial.',
      lee: { tarjetas: [
        { titulo: 'Un bloque y un resorte', texto: ['Estudiaremos el movimiento armónico simple, o MAS. El bloque está unido a un resorte sobre una mesa sin roce. Su masa ', S.m, ' y la constante elástica ', S.k, ' se mantienen.'], dibujo: vista({ x: 2 }) },
        { titulo: 'Una referencia para medir', texto: ['La elongación ', S.x, ' se mide desde el equilibrio. La derecha es positiva. La fuerza recuperadora ', S.F, ' y la aceleración ', S.a, ' también se describen con signo.'] },
        { titulo: 'El instante de soltar', texto: ['Cada posición del control inicia otro ensayo. Observamos el instante después de soltar el bloque: la mano ya no actúa. La velocidad inicial ', S.v, ' es cero. Compara las flechas.'] },
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
          { valor: erroresPred[0], error: 'OS-ACEL-PRED-SIGNO', siFuera: `Bien: triplicas el módulo. Mantener el signo anterior daría ${fmtPred(erroresPred[0])}.` },
          { valor: erroresPred[1], error: 'OS-ACEL-PRED-MODULO', siFuera: `Bien: cambias el sentido. Conservar el módulo anterior daría ${fmtPred(erroresPred[1])}.` },
          { valor: erroresPred[2], error: 'OS-ACEL-PRED-CUADRADO', siFuera: `Bien: reconoces el cambio de lado. Elevar al cuadrado el factor daría ${fmtPred(erroresPred[2])}.` }
        ], fmtPred), coincide: 'Cambia el lado y se triplica la separación; la aceleración cambia de signo y triplica su módulo.' },
      mira: { pieza: 'fis-estatica', datos: despues.datos, pasos: [
        paso('El resorte ejerce una fuerza contraria al desplazamiento.', [S.F, ' = −', S.k, ' · ', S.x]),
        paso('Dividimos la fuerza neta entre la masa para hallar la aceleración.', [S.a, ' = ', frac(S.F, S.m), ' = −', frac(S.k, S.m), ' · ', S.x]),
        paso('El mismo bloque y resorte conservan la razón entre aceleración y elongación.', [frac(a2, a1), ' = ', frac(x2, x1)]),
        paso('Las elongaciones tienen signos contrarios; su razón es negativa.', [frac(x2, x1), ' = ', frac(numero('x', pred.x2), numero('x', pred.x1)), ' = ', numero('x', razon)]),
        paso('Multiplicamos la primera aceleración por esa razón.', [a2, ' = (', numero('a', pred.a1), ') · (', numero('x', razon), ') = ', numero('a', ap, 'm/s²')]),
        paso('En el centro, fuerza y aceleración nulas no obligan a detenerse.', [S.x, ' = 0: ', S.F, ' = 0; ', S.a, ' = 0']),
        paso('En un extremo se detiene un instante, pero la fuerza tiene máximo módulo.', [S.x, ' = ±', S.A, ': ', S.v, ' = 0; |', S.F, '| = ', S.k, ' · ', S.A]),
      ] },
      regla: { texto: 'En el MAS, la fuerza neta es proporcional al desplazamiento y apunta al equilibrio. La aceleración sigue la fuerza; la velocidad puede apuntar en otro sentido.',
        ecuacion: [S.F, ' = −', S.k, ' · ', S.x, '; ', S.a, ' = ', frac(S.F, S.m), ' = −', frac(S.k, S.m), ' · ', S.x],
        condicion: 'Resorte ideal horizontal, masa constante y sin rozamiento. La elongación se mide desde el equilibrio.',
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
          regla = paso('Una vuelta de fase equivale a dos pi radianes.', formulas.omega);
          cuenta1 = paso('Dividimos los radianes de un ciclo entre su duración.', [S.omega, ' = ', frac('2π rad', Q('T', p.T, 's')), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La frecuencia angular mide cuánto avanza la fase por segundo, no cuántos ciclos ocurren.';
          errores = [error(ex(1, p.T), 'cuenta ciclos', 'FRECUENCIA'), error(ex(1, p.T, 1), 'usa media vuelta', 'MEDIA'), error(ex(2 * p.T, 1, 1), 'multiplica el período', 'MULTIPLICA')];
          dibujo = esquema(p); break;
        case 'x-fase':
          valor = por(cos(p.q), p.A); clave = 'x'; unidad = 'cm';
          enunciado = ['Un bloque tiene amplitud ', Q('A', p.A, 'cm'), ' y fase actual ', ...fase(p.q), '. ¿Cuál es su posición?'];
          datos.push(['cos(', ...fase(p.q), ') = ', ...nodo('phi', cos(p.q))]);
          regla = paso('La posición es la amplitud por el coseno de la fase.', formulas.x);
          cuenta1 = paso('Usamos la fase que corresponde al instante consultado.', [S.x, ' = ', Q('A', p.A, 'cm'), ' × ', ...nodo('phi', cos(p.q)), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'Una posición positiva está a la derecha del equilibrio; no tiene que coincidir con el extremo.';
          errores = [error(por(valor, -1), 'invierte el signo', 'SIGNO'), error(ex(p.A), 'da la amplitud', 'AMPLITUD'), error(ex(0), 'supone el centro', 'CENTRO')];
          dibujo = esquema(p, 6, -1); dibujo.datos.alt = 'En el instante indicado, el bloque está a la derecha del equilibrio y se mueve hacia la izquierda. El dibujo no está a escala.'; dibujo.datos.textos.find(x => x.texto === 'Estado inicial; dibujo sin escala').texto = 'Instante indicado; dibujo sin escala'; break;
        case 'v-fase':
          valor = por(sen(p.q), -p.A * p.w); clave = 'v'; unidad = 'cm/s';
          enunciado = ['Un bloque tiene ', S.A, ' = ', Q('A', p.A, 'cm'), ', ', S.omega, ' = ', Q('omega', p.w, 'rad/s'), ' y fase actual ', ...fase(p.q), '. ¿Cuál es su velocidad?'];
          datos.push(['sen(', ...fase(p.q), ') = ', ...nodo('phi', sen(p.q))]);
          regla = paso('El signo menos relaciona la velocidad con el avance de la fase.', formulas.v);
          cuenta1 = paso('Multiplicamos conservando el signo de la velocidad.', [S.v, ' = −', Q('A', p.A), ' × ', Q('omega', p.w), ' × ', ...nodo('phi', sen(p.q)), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La velocidad negativa indica movimiento hacia la izquierda, aunque la posición todavía pueda ser positiva.';
          errores = [error(por(valor, -1), 'pierde el signo', 'SIGNO'), error(ex(-p.A * p.w), 'supone seno uno', 'MAXIMO'), error(ex(0), 'supone un extremo', 'EXTREMO')];
          dibujo = esquema(p, 6, -1); dibujo.datos.alt = 'En el instante indicado, el bloque está a la derecha del equilibrio y se mueve hacia la izquierda. El dibujo no está a escala.'; dibujo.datos.textos.find(x => x.texto === 'Estado inicial; dibujo sin escala').texto = 'Instante indicado; dibujo sin escala'; break;
        case 'a-posicion':
          valor = ex(-(p.w ** 2) * p.x); clave = 'a'; unidad = 'cm/s²';
          enunciado = ['Un bloque tiene ', S.omega, ' = ', Q('omega', p.w, 'rad/s'), ' y está en ', S.x, ' = ', Q('x', p.x, 'cm'), '. ¿Cuál es su aceleración?'];
          regla = paso('La aceleración es proporcional a la posición y apunta en sentido contrario.', formulas.a);
          cuenta1 = paso('Elevamos la frecuencia angular al cuadrado y conservamos ambos signos.', [S.a, ' = −', sup(Q('omega', p.w)), ' × (', Q('x', p.x), ') = ', ...nodo(clave, valor, unidad)]);
          sentido = 'A la izquierda del equilibrio, la aceleración apunta hacia la derecha.';
          errores = [error(por(valor, -1), 'pierde el signo', 'SIGNO'), error(ex(-p.w * p.x), 'omite el cuadrado', 'CUADRADO'), error(ex(0), 'supone equilibrio', 'CERO')];
          dibujo = est(carrito(p.x, { alt: `El bloque está en x igual a ${p.x} centímetros, a la izquierda del equilibrio.` })); break;
        case 'a-grafica':
          valor = ex(p.max); clave = 'a'; unidad = 'cm/s²';
          enunciado = ['La gráfica muestra la aceleración del bloque. ¿Qué valor tiene cuando ', S.t, ' = ', Q('t', p.T / 2, 's'), '?'];
          regla = paso('La coordenada vertical de la curva indica la aceleración.', [S.t, ' → ', S.a]);
          cuenta1 = paso('Ubicamos el instante y leemos el punto de la curva.', [S.t, ' = ', Q('t', p.T / 2, 's'), '; ', S.a, ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'El signo positivo describe la aceleración; por sí solo no dice hacia dónde se mueve el bloque.';
          errores = [error(ex(-p.max), 'lee el valle', 'VALLE'), error(ex(0), 'lee el eje', 'EJE'), error(ex(p.max, 2), 'lee media altura', 'MITAD')];
          dibujo = grafica('a', p.max, p.T, Math.PI); break;
        case 'x-tiempo': {
          const q = p.q0 + 24 * p.t / p.T;
          valor = por(cos(q), p.A); clave = 'x'; unidad = 'cm';
          enunciado = ['Un bloque tiene ', S.A, ' = ', Q('A', p.A, 'cm'), ', ', S.T, ' = ', Q('T', p.T, 's'), ' y ', S.phi, ' = ', ...fase(p.q0), '. ¿Dónde está cuando ', S.t, ' = ', Q('t', p.t, 's'), '?'];
          datos.push(['cos(', ...fase(q), ') = ', ...nodo('phi', cos(q))]);
          regla = paso('Primero calculamos la frecuencia angular; después sumamos la fase inicial.', [...formulas.omega, '   ;   ', ...formulas.x]);
          cuenta1 = paso('El tiempo transcurrido hace avanzar la fase.', [S.omega, ' = ', ...nodo('omega', ex(2, p.T, 1), 'rad/s'), '; ', S.omega, S.t, ' + ', S.phi, ' = ', ...fase(q)]);
          cuenta2 = paso('El coseno de la fase determina la posición.', [S.x, ' = ', Q('A', p.A, 'cm'), ' × ', ...nodo('phi', cos(q)), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La fase inicial también cuenta: poner el reloj en cero no obliga a empezar en el extremo derecho.';
          errores = [error(por(cos(q - p.q0), p.A), 'omite la fase inicial', 'SIN-FASE'), error(por(valor, -1), 'invierte el signo', 'SIGNO'), error(ex(p.A), 'da la amplitud', 'AMPLITUD')];
          dibujo = esquema(p, 9, -1); break;
        }
        case 'v-tiempo': {
          const q = p.q0 + 24 * p.t / p.T;
          valor = por(sen(q), -2 * p.A, 100 * p.T, 1); clave = 'v'; unidad = 'm/s';
          enunciado = ['Un bloque tiene ', S.A, ' = ', Q('A', p.A, 'cm'), ', ', S.T, ' = ', Q('T', p.T, 's'), ' y ', S.phi, ' = ', ...fase(p.q0), '. Halla su velocidad en ', S.t, ' = ', Q('t', p.t, 's'), '.'];
          datos.push('1 m = 100 cm.', ['sen(', ...fase(q), ') = ', ...nodo('phi', sen(q))]);
          regla = paso('Convertimos la amplitud y evaluamos el seno de la fase total.', [...formulas.omega, '   ;   ', ...formulas.v]);
          cuenta1 = paso('Calculamos la frecuencia angular y la fase del instante pedido.', [S.omega, ' = ', ...nodo('omega', ex(2, p.T, 1), 'rad/s'), '; ', S.omega, S.t, ' + ', S.phi, ' = ', ...fase(q)]);
          cuenta2 = paso('La amplitud entra en metros para obtener metros por segundo.', [S.v, ' = −', ...nodo('A', ex(p.A, 100)), ' × ', ...nodo('omega', ex(2, p.T, 1)), ' × ', ...nodo('phi', sen(q)), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'El signo indica el sentido; la conversión de centímetros a metros cambia el valor numérico, no el movimiento.';
          errores = [error(por(valor, -1), 'pierde el signo', 'SIGNO'), error(por(valor, 100), 'no convierte centímetros', 'UNIDAD'), error(ex(-2 * p.A, 100 * p.T, 1), 'supone seno uno', 'MAXIMO')];
          dibujo = esquema(p, 9, -1); break;
        }
        case 'a-tiempo': {
          const q = p.q0 + 24 * p.fraccion;
          valor = por(cos(q), -p.A, 100); clave = 'a'; unidad = 'm/s²';
          enunciado = ['Un bloque tiene ', S.A, ' = ', Q('A', p.A, 'cm'), ', ', S.T, ' = ', ...nodo('T', ex(2, 1, 1), 's'), ' y ', S.phi, ' = ', ...fase(p.q0), '. Halla su aceleración en ', S.t, ' = ', ...nodo('t', ex(2, 3, 1), 's'), '.'];
          datos.push('1 m = 100 cm.', ['cos(', ...fase(q), ') = ', ...nodo('phi', cos(q))]);
          regla = paso('Calculamos la posición y usamos la relación entre aceleración y posición.', [...formulas.omega, '   ;   ', ...formulas.a]);
          cuenta1 = paso('En este movimiento la fase alcanza pi radianes.', [S.omega, ' = ', Q('omega', 1, 'rad/s'), '; ', S.omega, S.t, ' + ', S.phi, ' = ', ...fase(q), '; ', S.x, ' = ', ...nodo('x', por(cos(q), p.A, 100), 'm')]);
          cuenta2 = paso('La aceleración apunta hacia el equilibrio.', [S.a, ' = −', sup(Q('omega', 1)), ' × (', ...nodo('x', por(cos(q), p.A, 100)), ') = ', ...nodo(clave, valor, unidad)]);
          sentido = 'El bloque está en el extremo izquierdo y acelera hacia la derecha, aunque su velocidad instantánea sea cero.';
          errores = [error(por(valor, -1), 'pierde el signo', 'SIGNO'), error(por(valor, 100), 'no convierte centímetros', 'UNIDAD'), error(ex(0), 'confunde reposo y equilibrio', 'REPOSO')];
          dibujo = esquema(p, 6, -1); break;
        }
        case 'periodo-ecuacion':
          valor = ex(2, p.n); clave = 'T'; unidad = 's';
          enunciado = ['La posición cumple ', S.x, '(', S.t, ') = ', Q('A', p.A), ' cos(', Q('omega', p.n), 'π', S.t, ' + ', ...nodo('phi', ex(1, 3, 1)), '). ¿Cuál es el período?'];
          datos.push('La posición está en centímetros y el tiempo en segundos.', 'El argumento del coseno se expresa en radianes.');
          regla = paso('Identificamos el coeficiente del tiempo como frecuencia angular.', formulas.omega);
          cuenta1 = paso('La constante que acompaña al tiempo no es la fase inicial.', [S.omega, ' = ', ...nodo('omega', ex(p.n, 1, 1), 'rad/s')]);
          cuenta2 = paso('Despejamos el período y cancelamos pi.', [S.T, ' = ', frac('2π', S.omega), ' = ', frac('2π', nodo('omega', ex(p.n, 1, 1))), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La fase inicial cambia dónde empieza el movimiento; no cambia cuánto tarda en completar cada ciclo.';
          errores = [error(ex(1, p.n), 'omite dos', 'DOS'), error(ex(p.n, 2), 'invierte la fracción', 'INVERSO'), error(ex(6), 'usa la fase inicial', 'FASE')];
          dibujo = esquema(p, 6, -1); break;
        case 'fase-inicial':
          valor = ex(2, 3, 1); clave = 'phi'; unidad = 'rad';
          enunciado = ['Un bloque tiene amplitud ', Q('A', p.A, 'cm'), '. Al iniciar el reloj está en ', Q('x', -p.A / 2, 'cm'), ' y va hacia la izquierda. ¿Cuál es su fase inicial?'];
          datos.push(['Usa ', Q('phi', 0), ' ≤ ', S.phi, ' < 2π rad.'], ['cos(2π/3) = cos(4π/3) = −1/2.']);
          regla = paso('La posición fija el coseno; el sentido de la velocidad elige entre dos fases.', [...formulas.x, '   ;   ', ...formulas.v]);
          cuenta1 = paso('El cociente entre posición inicial y amplitud es negativo.', ['cos ', S.phi, ' = ', frac(Q('x', -p.A / 2), Q('A', p.A)), ' = −1/2']);
          cuenta2 = paso('Para velocidad negativa, el seno debe ser positivo.', [S.v, ' < 0 → sen ', S.phi, ' > 0 → ', S.phi, ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'Dos fases tienen la misma posición; el sentido inicial permite elegir una sola dentro del intervalo indicado.';
          errores = [error(ex(4, 3, 1), 'invierte el sentido', 'SENTIDO'), error(ex(1, 3, 1), 'pierde el signo de x', 'POSICION'), error(ex(1, 1, 1), 'supone un extremo', 'EXTREMO')];
          dibujo = esquema(p, -7, -1); break;
        case 'primer-regreso':
          valor = ex(5 * p.T, 6); clave = 't'; unidad = 's';
          enunciado = ['Un bloque parte del extremo derecho en reposo, con ', S.T, ' = ', Q('T', p.T, 's'), '. ¿Cuándo pasa por primera vez por ', S.x, ' = ', frac(S.A, '2'), ' hacia la derecha?'];
          datos.push('cos(π/3) = cos(5π/3) = 1/2.');
          regla = paso('Elegimos la fase con posición positiva y velocidad positiva.', [...formulas.x, '   ;   ', ...formulas.v]);
          cuenta1 = paso('El cruce de ida tiene velocidad negativa; buscamos el regreso.', [S.phi, ' = ', Q('phi', 0), '; cos(', S.omega, S.t, ') = 1/2; ', S.v, ' > 0 → ', S.omega, S.t, ' = ', ...fase(20)]);
          cuenta2 = paso('Despejamos el tiempo usando la frecuencia angular del movimiento.', [S.t, ' = ', frac(fase(20), nodo('omega', ex(2, p.T, 1), 'rad/s')), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La primera vez en esa posición ocurre hacia la izquierda; la condición de sentido exige esperar el regreso.';
          errores = [error(ex(p.T, 6), 'elige la ida', 'IDA'), error(ex(p.T, 3), 'elige posición negativa', 'POSICION'), error(ex(p.T, 2), 'elige el extremo', 'EXTREMO'), error(ex(p.T), 'completa el ciclo', 'CICLO')];
          dibujo = esquema(p); break;
        case 'v-fase-inicial':
          valor = ex(2 * p.A, p.T, 1); clave = 'v'; unidad = 'cm/s';
          enunciado = ['Un bloque tiene ', S.A, ' = ', Q('A', p.A, 'cm'), ' y ', S.T, ' = ', Q('T', p.T, 's'), '. Parte de ', S.x, ' = −', frac(S.A, '2'), ' hacia la derecha. Halla su velocidad después de ', Q('t', p.T / 12, 's'), '.'];
          datos.push('cos(2π/3) = cos(4π/3) = −1/2.', 'sen(4π/3) = −√3/2; sen(3π/2) = −1.');
          regla = paso('Elegimos la fase inicial por el sentido y luego hacemos avanzar el reloj.', [...formulas.omega, '   ;   ', ...formulas.v]);
          cuenta1 = paso('El seno inicial es negativo porque la velocidad es positiva.', [S.phi, ' = ', ...fase(16), '; ', S.omega, S.t, ' + ', S.phi, ' = ', ...fase(18)]);
          cuenta2 = paso('En ese instante el bloque cruza el centro hacia la derecha.', [S.v, ' = −', Q('A', p.A), ' × ', ...nodo('omega', ex(2, p.T, 1)), ' × (−1) = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La fase total cambia con el tiempo; la fase inicial permanece fija.';
          errores = [error(por(valor, -1), 'invierte el sentido', 'SIGNO'), error(por(valor, 1, 2), 'usa medio máximo', 'MITAD'), error(ex(p.A, p.T, 1, 3), 'conserva velocidad inicial', 'INICIAL'), error(ex(0), 'supone un extremo', 'CERO')];
          dibujo = esquema(p, -7, 1); break;
        case 'primer-izquierda':
          valor = ex(5 * p.T, 8); clave = 't'; unidad = 's';
          enunciado = ['Un bloque sale del centro hacia la derecha, con ', S.T, ' = ', Q('T', p.T, 's'), '. ¿Cuándo llega por primera vez a ', S.x, ' = −', frac([S.A, raiz('2')], '2'), ' mientras va hacia la izquierda?'];
          datos.push('cos(3π/4) = −√2/2; sen(3π/4) > 0.');
          regla = paso('Elegimos las fases por posición y sentido; después calculamos cuánto avanzó la fase.', [...formulas.omega, '   ;   ', ...formulas.x, '   ;   ', ...formulas.v]);
          cuenta1 = paso('La fase final debe superar la inicial; sumamos dos pi a tres cuartos de pi.', [S.phi, ' = ', ...fase(18), '; ', S.omega, S.t, ' + ', S.phi, ' = ', ...fase(33), '; ', S.omega, S.t, ' = ', ...fase(15)]);
          cuenta2 = paso('Convertimos el avance de fase en tiempo transcurrido.', [S.t, ' = ', frac(fase(15), nodo('omega', ex(2, p.T, 1), 'rad/s')), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'Sumar una vuelta a la fase final evita obtener un tiempo negativo para un suceso posterior.';
          errores = [error(ex(p.T, 8), 'elige posición positiva', 'POSITIVA'), error(ex(3 * p.T, 8), 'omite fase inicial', 'CRUCE'), error(ex(p.T, 4), 'elige el extremo', 'EXTREMO'), error(ex(7 * p.T, 8), 'invierte el sentido', 'SENTIDO')];
          dibujo = esquema(p, 0, 1); break;
        case 'reconstruir-omega':
          valor = ex(1, 2 * p.w, 1); clave = 't'; unidad = 's';
          enunciado = ['En cierto instante, un bloque tiene ', S.x, ' = ', Q('x', p.x, 'cm'), ' y ', S.a, ' = ', Q('a', -(p.w ** 2) * p.x, 'cm/s²'), '. Si parte del extremo derecho en reposo, ¿cuánto tarda en llegar al centro?'];
          regla = paso('Reconstruimos la frecuencia angular; del extremo al centro transcurre un cuarto de período.', [...formulas.a, '   ;   ', ...formulas.omega]);
          cuenta1 = paso('La raíz positiva corresponde a la frecuencia angular.', [sup(S.omega), ' = −', frac(S.a, S.x), ' = ', sup(Q('omega', p.w)), '; ', S.omega, ' = ', Q('omega', p.w, 'rad/s')]);
          cuenta2 = paso('Despejamos el período y tomamos su cuarta parte.', [S.t, ' = ', frac(S.T, '4'), ' = ', frac('π', ['2', S.omega]), ' = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La aceleración y la posición permiten encontrar el ritmo del movimiento sin conocer la amplitud.';
          errores = [error(por(valor, 2), 'usa medio período', 'MEDIO'), error(por(valor, 4), 'usa el período', 'ENTERO'), error(ex(1, 4 * p.w), 'confunde radianes y ciclos', 'CICLOS'), error(ex(1, 2 * p.w ** 2, 1), 'omite la raíz', 'RAIZ')];
          dibujo = esquema(p); break;
        case 'reconstruir-amplitud':
          valor = ex(p.u, 4); clave = 'x'; unidad = 'cm';
          enunciado = ['Un bloque tiene ', S.T, ' = ', ...nodo('T', ex(1, 1, 1), 's'), ' y rapidez central ', Q('v', p.u, 'cm/s'), '. Parte de ', S.x, ' = −', frac(S.A, '2'), ' hacia la derecha. Halla su posición después de ', ...nodo('t', ex(1, 6, 1), 's'), '.'];
          datos.push('cos(4π/3) = −1/2; sen(4π/3) < 0.', 'cos(5π/3) = 1/2.');
          regla = paso('En el centro, la rapidez es amplitud por frecuencia angular.', [...formulas.omega, '   ;   ', ...formulas.v, '   ;   ', ...formulas.x]);
          cuenta1 = paso('Reconstruimos la amplitud y la fase del instante pedido.', [S.omega, ' = ', Q('omega', 2, 'rad/s'), '; ', S.A, ' = ', frac(Q('v', p.u), Q('omega', 2)), ' = ', Q('A', p.u / 2, 'cm'), '; ', S.phi, ' = ', ...fase(16), '; ', S.omega, S.t, ' + ', S.phi, ' = ', ...fase(20)]);
          cuenta2 = paso('La posición final es la mitad positiva de la amplitud.', [S.x, ' = ', Q('A', p.u / 2, 'cm'), ' × 1/2 = ', ...nodo(clave, valor, unidad)]);
          sentido = 'La rapidez central fija la amplitud; el sentido inicial fija la fase. Ambos datos hacen falta.';
          errores = [error(por(valor, -1), 'conserva posición inicial', 'INICIAL'), error(por(valor, 2), 'da la amplitud', 'AMPLITUD'), error(por(valor, 1, 2), 'divide nuevamente', 'MITAD'), error(por(valor, -2), 'elige extremo izquierdo', 'EXTREMO')];
          dibujo = esquema(p, -7, 1); break;
        default: throw new Error(`Tipo de gráficas desconocido: ${tipo}`);
      }
      const todas = [valor, ...errores.map(e => e.z)];
      const formato = n => { const z = todas.find(z => Math.abs(num(z) - n) < 1e-10); if (!z) throw new Error('Falta expresión exacta'); return `${exacto(z)} ${unidad}`; };
      const ops = opciones(num(valor), errores.map(e => ({ valor: num(e.z), error: `OS-GRAF-${tipo}-${e.codigo}`,
        siFuera: `Identificaste la magnitud; ${e.causa}: obtendrías ${formato(num(e.z))}.` })), formato);
      return { enunciado, datos, dibujo, pide: `Se pide ${({ x: 'la posición', v: 'la velocidad con signo', a: 'la aceleración con signo', T: 'el período', t: 'el primer tiempo que cumple las condiciones', phi: 'la fase inicial', omega: 'la frecuencia angular' })[clave]}.`,
        tengo: 'Tomamos los valores indicados y las condiciones de posición, sentido y tiempo del enunciado.', regla, cuentas: [cuenta1, ...(cuenta2 ? [cuenta2] : [])], sentido,
        respuesta: [S[clave], ' = ', ...nodo(clave, valor, unidad)], opciones: ops,
        caso: { tipo, ...p, valor: num(valor), unidad, exacto: valor, errores: errores.map(e => ({ codigo: e.codigo, valor: num(e.z), exacto: e.z })) },
        erroresEjemplo: errores.map(e => `${formato(num(e.z))}: ${e.causa}.`).join(' ') };
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
      { termino: 'fase', formas: ['fase', 'fases'], simple: 'Una forma de ubicar el avance dentro del ciclo.', def: 'Ángulo que ubica el estado de una oscilación sinusoidal. Al aumentar una vuelta completa, se repiten posición y sentido.', ejemplos: ['Dos ciclos completos suman cuatro pi radianes de fase.', 'La fase sigue avanzando aunque el bloque cambie de sentido.', 'Una misma posición puede corresponder a dos fases con velocidades de signos opuestos.'] },
      { termino: 'fase inicial', simbolo: 'φ', medida: 'rad', simple: 'La fase cuando comienza la medición del tiempo.', def: 'Valor de la fase cuando el reloj marca cero. Se elige usando la posición inicial y el sentido del movimiento.', ejemplos: ['Cambiar el origen del tiempo puede cambiar la fase inicial.', 'Dos bloques con igual amplitud pueden comenzar en estados diferentes.', 'La fase inicial no crece con el reloj: es una constante del movimiento descrito.'] },
      { termino: 'frecuencia angular', simbolo: 'ω', medida: 'rad/s', simple: 'Cuánto avanza la fase por segundo.', def: 'Ritmo constante de avance de la fase en el movimiento armónico simple. Se mide en radianes por segundo.', ejemplos: ['Si la fase avanza un radián en cada segundo, la frecuencia angular es un radián por segundo.', 'Duplicar la frecuencia angular duplica el avance de fase en el mismo tiempo.', 'La frecuencia angular permanece constante aunque cambien la posición y la velocidad del bloque.'] },
    );
    return {
      id: 'graficas-mas', titulo: 'Un reloj para el movimiento', pregunta: '¿Cómo describimos la posición, la velocidad y la aceleración en cualquier instante?',
      temas: ['Ecuaciones y gráficas del MAS'], pieza: 'fis-estatica',
      aprendizaje: 'Relaciono el estado inicial con la fase y uso las ecuaciones del MAS para interpretar posición, velocidad y aceleración.',
      actividad: 'Mover el reloj y comparar la posición del bloque con su sentido de movimiento.',
      lee: { tarjetas: [
        { titulo: 'El reloj necesita un comienzo', texto: 'El bloque sigue unido al resorte. Para describirlo en otro instante necesitamos saber dónde estaba y hacia dónde se movía cuando el reloj comenzó.', dibujo: esquema({}) },
        { titulo: 'Una posición, dos sentidos', texto: ['La posición ', S.x, ' lleva signo. La velocidad ', S.v, ' indica además hacia dónde se mueve: positiva hacia la derecha y negativa hacia la izquierda. Estar en el centro no determina el sentido.'] },
        { titulo: 'Del bloque a sus gráficas', texto: ['Una gráfica coloca el tiempo en el eje horizontal y una magnitud en el vertical. Luego usaremos la fase, la fase inicial ', S.phi, ' y la frecuencia angular ', S.omega, ' para describir ese cambio.'] },
      ] }, ejemplos,
      juega: { pieza: 'fis-estatica', consigna: 'El bloque parte del extremo derecho. Mueve el reloj y observa su posición y hacia dónde continúa.',
        voz: 'Mira el sentido además de la posición.',
        mision: { texto: 'Encuentra el primer instante en que el bloque pasa por el centro hacia la izquierda.', logrado: v => reloj(v) === 1, bien: 'Encontraste el primer cruce: el bloque todavía continúa hacia el extremo izquierdo.' },
        leyenda: [{ s: S.x, t: 'posición desde el equilibrio' }, { s: S.A, t: 'amplitud de 12 cm' }, { s: S.t, t: 'tiempo desde la salida del extremo derecho' }, { s: S.T, t: 'período de 4 s' }, { s: S.v, t: 'velocidad; su signo indica el sentido' }],
        controles: [{ id: 't', etiqueta: 'Tiempo, t', min: 0, max: 4, paso: 1, decimales: 1, inicio: 0, unidad: 's', color: 'c-h', auto: { velocidad: 0.5 } }],
        dibujo: juego, lectura: val => { const s = estado(val); return [S.x, Math.abs(s.x * 100 - Math.round(s.x * 100)) < 1e-7 ? ' = ' : ' ≈ ', Q('x', s.x, 'cm'), '; ', Math.abs(s.v) < 1e-8 ? 'reposo' : s.v > 0 ? 'hacia la derecha' : 'hacia la izquierda']; }, resumen: { t: 1 }, minimo: 3 },
      predice: { pregunta: 'Otro bloque parte del extremo izquierdo en reposo y tiene un período de 8 s. ¿Dónde está y hacia dónde se mueve a los 2 s?',
        datos: ['El bloque realiza un movimiento armónico simple.', 'El reloj empieza al soltar el bloque.', ['Amplitud: ', S.A, ' = ', Q('A', 12, 'cm'), '.']], dibujo: antes, revelar: despues,
        opciones: opciones(estadoPred, [
          { valor: cuartosPred % 4, error: 'OS-GRAF-COPIA-INICIO', siFuera: 'Reconociste un cuarto de ciclo; hacia la izquierda correspondería a empezar en el extremo derecho.' },
          { valor: inicioPred, error: 'OS-GRAF-CONSERVA-INICIO', siFuera: 'Reconociste el punto inicial; quedarte en él omite los dos segundos de movimiento.' },
          { valor: (inicioPred + 2 * cuartosPred) % 4, error: 'OS-GRAF-MEDIO-CICLO', siFuera: 'Reconociste el extremo opuesto; llegar allí requiere medio ciclo, que aquí dura cuatro segundos.' },
        ], n => ['En el extremo derecho, en reposo.', 'En el centro, hacia la izquierda.', 'En el extremo izquierdo, en reposo.', 'En el centro, hacia la derecha.'][n]),
        coincide: 'El cuarto de ciclo termina en el centro, pero el sentido depende del extremo desde el cual partió.' },
      mira: { pieza: 'ejes', datos: mapaX.datos, pasos: [
        paso('La curva asciende: el primer cruce del centro ocurre hacia la derecha.', [S.t, ' = 2 s; ', S.x, ' = 0; ', S.v, ' > 0', '   ;   ', 'Curva ascendente: ', S.v, ' > 0. Descendente: ', S.v, ' < 0.']),
        paso('Un radián abarca un arco igual al radio; dos pi completan la vuelta.', ['1 vuelta = 2π rad = 360°']),
        paso('La fase avanza a ritmo constante; su valor inicial fija dónde comienza.', [...formulas.omega, '   ;   ', 'fase total = ', S.omega, S.t, ' + ', S.phi, '   ;   ', ...formulas.x, '   ;   ', ...formulas.v]),
        paso('La aceleración apunta al equilibrio y tiene signo contrario a la posición.', formulas.a),
        paso('La posición elige el coseno; el sentido decide entre las dos fases posibles.', [S.v, ' > 0 → sen(', S.omega, S.t, ' + ', S.phi, ') < 0', '   ;   ', 'Desde el extremo izquierdo, en reposo: ', S.phi, ' = π rad.']),
        paso('Cada vuelta adicional suma dos pi; buscamos siempre el primer instante pedido.', ['fase posterior = fase equivalente + 2π rad']),
        paso('En el centro, la rapidez es máxima; en los extremos, vale cero.', ['rapidez central = ', S.A, S.omega, '; rapidez en extremos = 0']),
      ] },
      regla: { texto: 'Calcula la frecuencia angular, suma la fase inicial y evalúa posición y velocidad. La aceleración tiene signo contrario a la posición. El sentido distingue fases con igual posición.',
        ecuacion: [...formulas.omega, '   ;   ', ...formulas.x, '   ;   ', ...formulas.v, '   ;   ', ...formulas.a],
        condicion: 'MAS ideal; amplitud positiva; x, v y a son componentes sobre el mismo eje. Las fases se expresan en radianes.', dibujo: mapaV },
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
        regla = paso('El período se obtiene con la masa y la rigidez.', eqPeriodo(S.k));
        cuentas = [];
        if (tipo === 'periodo-gramos') cuentas.push(paso('Expresamos la masa en kilogramos.', [S.m, ' = ', frac(Q('m', p.gramos, 'g'), '1000 g/kg'), ' = ', Q('m', m, 'kg', 3)]));
        cuentas.push(paso('Reemplazamos los datos y dejamos π exacto.', eqT(m, k)));
        sentido = 'El período mide una ida y vuelta completa del bloque.'; erroresT();
      } else if (tipo === 'razon-masa' || tipo === 'razon-rigidez') {
        pi = false;
        const masa = tipo === 'razon-masa', cociente = masa ? p.m1 / p.m0 : p.k0 / p.k1;
        valor = p.T0 * Math.sqrt(cociente);
        enunciado = masa ? ['Con el mismo resorte, la masa pasa de ', Q('m', p.m0, 'kg'), ' a ', Q('m', p.m1, 'kg'), '. El período inicial es ', Q('T', p.T0, 's'), '. ¿Cuál será el nuevo período?'] :
          ['La masa no cambia. La rigidez pasa de ', Q('k', p.k0, 'N/m'), ' a ', Q('k', p.k1, 'N/m'), '; el período inicial es ', Q('T', p.T0, 's'), '. ¿Cuál será el nuevo período?'];
        const q0 = sub(masa ? S.m : S.k, '0'), q1 = sub(masa ? S.m : S.k, '1');
        regla = paso(masa ? 'La rigidez común se cancela al comparar períodos.' : 'La masa común se cancela al comparar períodos.',
          [frac(sub(S.T, '1'), sub(S.T, '0')), ' = ', raiz(masa ? frac(q1, q0) : frac(q0, q1))]);
        cuentas = [paso('Multiplicamos el período inicial por la razón calculada.', [sub(S.T, '1'), ' = ', Q('T', p.T0, 's'), ' · ', raiz(masa ? frac(Q('m', p.m1, 'kg'), Q('m', p.m0, 'kg')) : frac(Q('k', p.k0, 'N/m'), Q('k', p.k1, 'N/m'))), ' = ', numero('T', valor, 's')])];
        sentido = masa ? 'Más masa hace más lento este oscilador, aunque conserve el mismo resorte.' : 'Un resorte más rígido reduce el período cuando la masa se conserva.';
        dibujoP = masa ? { m: p.m1 } : { k: p.k1 };
        err('sin-raiz', p.T0 * cociente, 'omitir la raíz', 'sin raíz'); err('sin-cambio', p.T0, 'ignorar el cambio', 'sin cambio');
        err('inversa', p.T0 / Math.sqrt(cociente), 'invertir la razón', 'razón invertida'); err('doble', 2 * valor, 'contar dos ciclos', 'dos ciclos');
        err('masa-doble', valor * Math.sqrt(2), 'duplicar además la masa', 'masa duplicada');
      } else if (tipo === 'masa-periodo' || tipo === 'rigidez-periodo') {
        const masa = tipo === 'masa-periodo'; pi = false; unidad = masa ? 'kg' : 'N/m'; clave = masa ? 'm' : 'k';
        valor = masa ? k * (p.q / 2) ** 2 : m * (2 / p.q) ** 2;
        enunciado = masa ? ['Un resorte de ', Q('k', k, 'N/m'), ' completa cada ciclo en ', numero('T', p.q * Math.PI, 's', true), '. ¿Qué masa tiene el bloque?'] :
          ['Un bloque de ', Q('m', m, 'kg'), ' tiene un período de ', numero('T', p.q * Math.PI, 's', true), '. ¿Cuál es la rigidez del resorte?'];
        regla = paso('Elevamos al cuadrado antes de despejar la incógnita.', [sup(S.T), ' · ', S.k, ' = 4π² · ', S.m]);
        cuentas = [paso(masa ? 'Dividimos entre 4π² para dejar sola la masa.' : 'Dividimos entre el período al cuadrado para dejar sola la rigidez.',
          masa ? [S.m, ' = ', frac([S.k, ' · ', sup(S.T)], '4π²'), ' = ', frac([Q('k', k, 'N/m'), ' · ', sup(['(', numero('T', p.q * Math.PI, 's', true), ')'])], '4π²'), ' = ', numero('m', valor, unidad)] :
            [S.k, ' = ', frac(['4π² · ', S.m], sup(S.T)), ' = ', frac(['4π² · ', Q('m', m, 'kg')], sup(['(', numero('T', p.q * Math.PI, 's', true), ')'])), ' = ', numero('k', valor, unidad)])];
        sentido = masa ? 'La masa obtenida es positiva y reproduce el período dado.' : 'La rigidez relaciona la fuerza del resorte con su deformación.';
        err('factor-cuatro', 4 * valor, masa ? 'duplicar el período' : 'reducir el período a la mitad', masa ? 'período duplicado' : 'período reducido'); err('cuarto', valor / 4, masa ? 'reducir el período a la mitad' : 'duplicar el período', masa ? 'período reducido' : 'período duplicado');
        err('doble', 2 * valor, 'duplicar el resultado', 'resultado duplicado'); err('mitad', valor / 2, 'dividir otra vez entre dos', 'división extra');
      } else if (tipo === 'vertical-periodo') {
        k = p.m * p.g / (p.sCm / 100); valor = periodo(p.m, k);
        datos.push('El alargamiento dado corresponde al equilibrio.', '1 m = 100 cm.');
        enunciado = ['Al colgar ', Q('m', p.m, 'kg'), ', un resorte se alarga ', Q('delta', p.sCm, 'cm'), '. Con ', S.g, ' = ', Q('g', p.g, 'm/s²'), ', ¿qué período tendrá al oscilar verticalmente?'];
        regla = paso('En equilibrio, la fuerza del resorte iguala al peso.', [S.k, ' · ', D, ' = ', S.m, ' · ', S.g, '; ', S.k, ' = ', frac([S.m, ' · ', S.g], D)]);
        cuentas = [paso('Convertimos el alargamiento y calculamos la rigidez.', [S.k, ' = ', frac([Q('m', p.m, 'kg'), ' · ', Q('g', p.g, 'm/s²')], Q('delta', p.sCm / 100, 'm', 3)), ' = ', Q('k', k, 'N/m')]),
          paso('El bloque oscila alrededor del equilibrio desplazado.', eqT(p.m, k))];
        sentido = 'La amplitud se mide desde el nuevo equilibrio, no desde la longitud natural.'; erroresT();
      } else if (tipo === 'vertical-amplitud' || tipo === 'vertical-desde-periodo') {
        pi = false; unidad = 'cm'; clave = 'A';
        const desdeT = tipo === 'vertical-desde-periodo'; if (desdeT) k = p.m * (2 / p.q) ** 2;
        const deq = p.m * p.g / k; valor = Math.abs(p.yCm / 100 - deq) * 100;
        datos.push('El bloque se suelta desde el reposo.', 'Los alargamientos se miden desde la longitud natural.');
        enunciado = ['Un bloque de ', Q('m', p.m, 'kg'), ' cuelga de un resorte ', ...(desdeT ? ['con período ', numero('T', p.q * Math.PI, 's', true)] : ['de ', Q('k', k, 'N/m')]), '. Se suelta con alargamiento ', Q('delta', p.yCm, 'cm'), '. Para ', S.g, ' = ', Q('g', p.g, 'm/s²'), ', ¿cuál es la amplitud?'];
        regla = desdeT ? paso('De la relación cuadrática, dividimos entre el período al cuadrado.', [sup(S.T), ' · ', S.k, ' = 4π² · ', S.m, '; ', S.k, ' = ', frac(['4π² · ', S.m], sup(S.T)), ' = ', Q('k', k, 'N/m')]) :
          paso('Despejamos el alargamiento que equilibra el peso.', [S.k, ' · ', D, ' = ', S.m, ' · ', S.g, '; ', D, ' = ', frac([S.m, ' · ', S.g], S.k)]);
        cuentas = [paso('Ubicamos el equilibrio desde la longitud natural.', [D, ' = ', frac([Q('m', p.m, 'kg'), ' · ', Q('g', p.g, 'm/s²')], Q('k', k, 'N/m')), ' = ', Q('delta', deq, 'm', 3), ' = ', Q('delta', deq * 100, 'cm')]),
          paso('La distancia entre el punto de liberación y el equilibrio es la amplitud.', [S.A, ' = |', D0, ' − ', D, '| = |', Q('delta', p.yCm, 'cm'), ' − ', Q('delta', deq * 100, 'cm'), '| = ', numero('A', valor, 'cm')])];
        sentido = 'Soltar desde el reposo convierte esa posición en un extremo de la oscilación.';
        err('natural', p.yCm, 'medir desde la longitud natural', 'referencia natural'); err('equilibrio', deq * 100, 'dar el alargamiento de equilibrio', 'alargamiento estático');
        err('suma', p.yCm + deq * 100, 'sumar ambos alargamientos', 'suma'); err('doble', 2 * valor, 'medir entre extremos', 'entre extremos');
        err('signo-alargamiento', deq * 100 - p.yCm, 'conservar una diferencia negativa', 'diferencia negativa'); err('recorrido', 4 * valor, 'dar el recorrido de un ciclo', 'recorrido completo');
      } else if (tipo === 'paralelo-periodo' || tipo === 'serie-periodo' || tipo === 'paralelo-estatico' || tipo === 'serie-estatico') {
        const serie = tipo.startsWith('serie'), estatico = tipo.endsWith('estatico');
        const k1 = estatico ? p.mc * p.g / (p.sCm / 100) : p.k1, k2 = p.k2;
        keq = serie ? k1 * k2 / (k1 + k2) : k1 + k2; valor = periodo(p.m, keq);
        if (estatico) {
          datos.push('La masa de calibración se retira antes de conectar.', 'El alargamiento de calibración corresponde al equilibrio.');
          enunciado = ['Una masa de ', Q('m', p.mc, 'kg'), ' alarga el primer resorte ', Q('delta', p.sCm, 'cm'), '. Se conecta ', serie ? 'en serie' : 'en paralelo', ' con otro de ', Q('k', k2, 'N/m'), '. Para ', S.m, ' = ', Q('m', p.m, 'kg'), ' y ', S.g, ' = ', Q('g', p.g, 'm/s²'), ', halla el período horizontal.'];
          regla = paso('El equilibrio de calibración permite despejar la primera rigidez.', [K1, ' = ', frac([sub(S.m, 'c'), ' · ', S.g], D), ' = ', frac([Q('m', p.mc, 'kg'), ' · ', Q('g', p.g, 'm/s²')], Q('delta', p.sCm / 100, 'm', 3)), ' = ', Q('k', k1, 'N/m')]);
        } else {
          enunciado = ['Dos resortes de ', Q('k', k1, 'N/m'), ' y ', Q('k', k2, 'N/m'), ' sostienen horizontalmente un bloque de ', Q('m', p.m, 'kg'), ', conectados ', serie ? 'en serie' : 'en paralelo', '. ¿Cuál es el período?'];
          regla = serie ? paso('La misma fuerza alarga ambos resortes; sus alargamientos se suman.', [frac('1', K), ' = ', frac('1', K1), ' + ', frac('1', K2), '; ', K, ' = ', frac([K1, ' · ', K2], [K1, ' + ', K2])]) :
            paso('Ambos resortes se deforman igual y sus fuerzas se suman.', [K, ' = ', K1, ' + ', K2]);
        }
        cuentas = [paso(serie ? 'Sumamos los inversos de las rigideces y luego invertimos el resultado.' : 'Sumamos las rigideces de los resortes en paralelo.', serie ? [K, ' = ', frac([Q('k', k1, 'N/m'), ' · ', Q('k', k2, 'N/m')], [Q('k', k1, 'N/m'), ' + ', Q('k', k2, 'N/m')]), ' = ', Q('k', keq, 'N/m')] :
          [K, ' = ', Q('k', k1, 'N/m'), ' + ', Q('k', k2, 'N/m'), ' = ', Q('k', keq, 'N/m')]), paso('Usamos la rigidez del conjunto para calcular el período.', eqT(p.m, keq))];
        sentido = serie ? 'En serie, el conjunto resulta menos rígido que cualquiera de sus resortes.' : 'En paralelo, el conjunto resulta más rígido que cada resorte por separado.';
        err('otra-conexion', periodo(p.m, serie ? k1 + k2 : k1 * k2 / (k1 + k2)), 'usar la otra conexión', 'otra conexión');
        err('solo-primero', periodo(p.m, k1), 'usar solo el primer resorte', 'solo primero'); err('medio', valor / 2, 'contar medio ciclo', 'medio ciclo'); err('doble', 2 * valor, 'contar dos ciclos', 'dos ciclos');
        err('masa-doble', periodo(2 * p.m, keq), 'duplicar la masa del bloque', 'masa duplicada'); err('rigidez-doble', periodo(p.m, 2 * keq), 'duplicar la rigidez del conjunto', 'rigidez duplicada');
      } else if (tipo === 'paralelo-inversa' || tipo === 'serie-inversa') {
        const serie = tipo.startsWith('serie'); pi = false; clave = 'k'; unidad = 'N/m';
        keq = p.m * (2 / p.q) ** 2; valor = serie ? keq * p.k1 / (p.k1 - keq) : keq - p.k1;
        enunciado = ['Un bloque de ', Q('m', p.m, 'kg'), ' oscila con dos resortes ', serie ? 'en serie' : 'en paralelo', '. Uno tiene rigidez ', Q('k', p.k1, 'N/m'), ' y el período es ', numero('T', p.q * Math.PI, 's', true), '. ¿Cuál es la otra rigidez?'];
        regla = paso('Elevamos el período al cuadrado para despejar la rigidez del conjunto.', [sup(S.T), ' · ', K, ' = 4π² · ', S.m]);
        cuentas = [paso('Dividimos entre el período al cuadrado.', [K, ' = ', frac(['4π² · ', S.m], sup(S.T)), ' = ', frac(['4π² · ', Q('m', p.m, 'kg')], sup(['(', numero('T', p.q * Math.PI, 's', true), ')'])), ' = ', Q('k', keq, 'N/m')]),
          serie ? paso('Restamos el primer inverso y despejamos la segunda rigidez.', [frac('1', K2), ' = ', frac('1', K), ' − ', frac('1', K1), '; ', K2, ' = ', frac([Q('k', keq, 'N/m'), ' · ', Q('k', p.k1, 'N/m')], [Q('k', p.k1, 'N/m'), ' − ', Q('k', keq, 'N/m')]), ' = ', numero('k', valor, unidad)]) :
            paso('Despejamos la segunda rigidez restando la primera.', [K, ' = ', K1, ' + ', K2, '; ', K2, ' = ', Q('k', keq, 'N/m'), ' − ', Q('k', p.k1, 'N/m'), ' = ', numero('k', valor, unidad)])];
        sentido = serie ? 'La rigidez equivalente debe ser menor que las dos rigideces individuales.' : 'La suma de las dos rigideces reproduce la del conjunto.';
        err('suma', keq + p.k1, 'sumar las rigideces conocidas', 'suma'); err('conjunto', keq, 'dar la rigidez del conjunto', 'conjunto');
        err('primero', p.k1, 'repetir la primera rigidez', 'primer resorte'); err('diferencia-inversa', serie ? keq - p.k1 : p.k1 - keq, 'restar en orden incorrecto', 'resta invertida');
      } else throw new Error(`Familia de resortes desconocida: ${tipo}`);
      const fmt = n => textoValor(n, unidad, pi), vistos = new Set([fmt(valor)]);
      errores = errores.filter(e => { const t = fmt(e.valor); if (vistos.has(t)) return false; vistos.add(t); return true; });
      if (errores.length < 4) throw new Error(`Faltan errores conceptuales distintos: ${tipo}`);
      errores = errores.slice(0, 4);
      const ops = opciones(valor, errores.map(e => ({ valor: e.valor, error: `RES-${e.id}`, siFuera: `Bien usas los datos; ${e.causa} da ${fmt(e.valor)}.` })), fmt);
      return { enunciado, datos, dibujo: figura(dibujoP, tipo), pide: `Buscamos ${clave === 'T' ? 'el período de una oscilación' : clave === 'm' ? 'la masa del bloque' : clave === 'A' ? 'la amplitud desde el equilibrio' : 'la rigidez pedida'}.`,
        tengo: 'Las cantidades y condiciones necesarias aparecen en el enunciado y en los Datos.', regla, cuentas, sentido,
        respuesta: [clave === 'k' && tipo.includes('inversa') ? K2 : S[clave], ' = ', numero(clave, valor, unidad, pi)], opciones: ops,
        caso: { tipo, ...p, valor, unidad, pi, errores: errores.map(e => ({ id: e.id, valor: e.valor })) },
        erroresEjemplo: errores.map(e => `${fmt(e.valor)}: ${e.breve}`).join('; ') + '.' };
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
      { termino: 'rigidez equivalente', formas: ['rigidez equivalente'], simple: 'La rigidez del conjunto de resortes.', def: 'Rigidez de un solo resorte que produce la misma fuerza que el conjunto ante el mismo desplazamiento del bloque.', ejemplos: ['Dos resortes pueden representarse por una rigidez del conjunto.', 'La conexión cambia cómo se combinan las rigideces.', 'El bloque responde a la fuerza total de los resortes.'] },
      { termino: 'resortes en serie', formas: ['resortes en serie'], simple: 'Resortes conectados uno después de otro.', def: 'Conexión de resortes ideales consecutivos: transmiten la misma fuerza y sus alargamientos se suman.', ejemplos: ['Una pared, dos resortes consecutivos y un bloque forman una conexión en serie.', 'La unión entre los resortes tiene masa despreciable.', 'El desplazamiento del bloque reúne los alargamientos de ambos resortes.'] },
      { termino: 'resortes en paralelo', formas: ['resortes en paralelo'], simple: 'Resortes que sostienen juntos el mismo bloque.', def: 'Conexión en la que los resortes comparten el desplazamiento del bloque y sus fuerzas se suman.', ejemplos: ['Dos resortes unen una misma pared y un mismo bloque.', 'Los dos extremos unidos al bloque se desplazan la misma distancia.', 'La fuerza total sobre el bloque incluye la de cada resorte.'] },
    );
    return {
      id: 'periodo-resorte', titulo: 'El ritmo del bloque', pregunta: '¿Cómo influyen el bloque y el resorte en la duración del vaivén?', temas: ['Masa-resorte horizontal y vertical'], pieza: 'fis-estatica',
      aprendizaje: 'Calculo el período con masa y rigidez; ubico el equilibrio vertical y distingo conexiones de dos resortes.', actividad: 'Cambiar el resorte y observar cuánto tarda el mismo bloque en completar un ciclo.',
      lee: { tarjetas: [
        { titulo: 'El mismo bloque', texto: ['El bloque tiene masa ', S.m, '. La rigidez ', S.k, ' identifica cuánto se opone el resorte a deformarse. El reloj mide un ciclo completo. Compara resortes sin cambiar la masa.'], dibujo: est(juego({ k: 12.5, t: 0 })) },
        { titulo: 'Colgado de un soporte', texto: ['En vertical, el peso estira el resorte hasta un equilibrio. La posición ', S.x, ' se mide desde ese equilibrio; el alargamiento ', S.delta, ' se mide desde la longitud natural.'] },
        { titulo: 'Dos resortes y un bloque', texto: 'Los resortes en serie van uno después de otro. Los resortes en paralelo actúan juntos sobre el bloque. La rigidez equivalente describe el conjunto. Primero observa un solo resorte.' },
      ] },
      juega: { pieza: 'fis-estatica', consigna: 'Cambia la rigidez del resorte. Conserva el bloque y la amplitud; usa el reloj para seguir una ida y vuelta.', voz: 'Mira cuánto tarda en regresar al mismo extremo.',
        mision: { texto: 'Consigue un período que, redondeado a dos decimales, sea 0,63 s.', logrado: val => Math.round(tJuego(val) * 100) === 63, bien: 'Ese resorte completa cada ciclo en aproximadamente 0,63 s.' },
        leyenda: [{ s: S.m, t: 'masa fija del bloque' }, { s: S.k, t: 'rigidez del resorte elegido' }, { s: S.A, t: 'distancia fija del equilibrio a un extremo' }, { s: S.x, t: 'posición desde el equilibrio' }, { s: S.T, t: 'tiempo de un ciclo completo' }, { s: S.t, t: 'tiempo desde el extremo derecho' }],
        controles: [{ id: 'k', etiqueta: 'Rigidez, k', inicio: 12.5, unidad: 'N/m', color: 'c-f', opciones: [12.5, 50, 112.5, 200].map(valor => ({ valor, texto: `${f(valor)} N/m` })) },
          { id: 't', etiqueta: 'Tiempo, t', min: 0, max: 2, paso: 0.01, inicio: 0, unidad: 's', decimales: 2, color: 'c-h', auto: { velocidad: 0.25 } }],
        dibujo: val => est(juego(val)), lectura: val => [S.T, ' ≈ ', Q('T', tJuego(val), 's'), '; ', S.t, ' = ', Q('t', tiempo(val), 's')], resumen: { k: 50, t: 0 }, minimo: 3 },
      predice: { pregunta: 'Con el mismo resorte, se cuadruplica la masa. Si antes el período era 0,6 s, ¿cuánto dura ahora cada ciclo?', datos: datosBase, dibujo: antes, revelar: despues,
        opciones: opciones(0.6 * Math.sqrt(4), [
          { valor: 0.6 / Math.sqrt(4), error: 'RES-INV-MASA', siFuera: 'Bien comparas las masas; invertir su razón daría 0,3 s, como si más masa acortara el ciclo.' },
          { valor: 0.6, error: 'RES-IGNORA-MASA', siFuera: 'Conservar 0,6 s supone que cambiar la masa no modifica la duración del ciclo.' },
          { valor: 0.6 * 4, error: 'RES-LINEAL-MASA', siFuera: 'Bien usas el factor cuatro; multiplicar directamente el período por él daría 2,4 s.' },
        ], n => `${f(n)} s`), coincide: 'La raíz de cuatro es dos: el ciclo tarda el doble.' },
      mira: { pieza: 'fis-estatica', datos: despues.datos, pasos: [
        paso('La masa y la rigidez fijan el período del resorte ideal.', eqPeriodo(S.k)),
        paso('Con la misma rigidez, comparamos los períodos mediante la raíz de las masas.', [frac(sub(S.T, '1'), sub(S.T, '0')), ' = ', raiz(frac(sub(S.m, '1'), sub(S.m, '0'))), ' = √4 = 2']),
        paso('El período nuevo es el doble del inicial.', [sub(S.T, '1'), ' = ', Q('T', 0.6, 's'), ' · 2 = ', Q('T', 1.2, 's')]),
        paso('En vertical, primero ubicamos el equilibrio; después medimos desde allí.', [S.k, ' · ', D, ' = ', S.m, ' · ', S.g, '; ', D, ' = ', frac([S.m, ' · ', S.g], S.k)]),
        paso('En paralelo, las deformaciones coinciden y las fuerzas se suman.', [K, ' = ', K1, ' + ', K2]),
        paso('En serie, la fuerza coincide y los alargamientos se suman.', [frac('1', K), ' = ', frac('1', K1), ' + ', frac('1', K2)]),
      ] },
      regla: { texto: 'El período depende de masa y rigidez equivalente. En vertical, la gravedad desplaza el equilibrio. En serie se suman alargamientos; en paralelo, fuerzas.', ecuacion: eqPeriodo(K),
        condicion: 'resortes ideales de masa despreciable, oscilaciones sin rozamiento y posiciones medidas desde el equilibrio.', dibujo: figura({ m: 0.6, k1: 40, k2: 20 }, 'paralelo-periodo') },
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
      const err = (valor, id, corta, siFuera) => ({ valor, id, corta, siFuera: `Bien identificar los datos; ${siFuera}` });
      let datos = ['Péndulo simple: hilo inextensible de masa despreciable, apoyo fijo y sin rozamiento.', 'Amplitud angular de 8°; modelo aproximado de ángulo pequeño.'];
      const calcT = L => periodo(L, p.g);
      if (p.g !== undefined) datos.push([S.g, ' ≈ ', Q('g', p.g, 'm/s²'), ', valor usado para el cálculo.']);
      switch (tipo) {
        case 'longitud-centro':
          valor = p.hilo + p.radio; unidad = 'cm'; clave = 'L';
          enunciado = ['El hilo libre mide ', Q('L', p.hilo, 'cm'), ' y la pesa esférica tiene radio ', Q('L', p.radio, 'cm'), '. ¿Qué longitud llega del apoyo al centro de la pesa?'];
          formula = [S.L, ' = longitud del hilo + radio de la pesa'];
          cuentas = [paso('La longitud incluye el tramo hasta el centro de la pesa.', [S.L, ' = ', Q('L', p.hilo), ' + ', Q('L', p.radio), ' = ', Q('L', valor, unidad)])];
          sentido = 'La pesa se aproxima por una masa puntual situada en su centro.';
          malos = [err(p.hilo, 'solo-hilo', 'solo hilo', 'tomaste solo el hilo.'), err(p.hilo - p.radio, 'resta-radio', 'resta radio', 'restaste el radio.'), err(p.hilo + 2 * p.radio, 'diametro', 'suma diámetro', 'sumaste el diámetro en vez del radio.'), err(2 * p.hilo + p.radio, 'doble-hilo', 'duplica hilo', 'contaste dos veces el hilo.')]; break;
        case 'periodo': case 'periodo-cm': {
          const L = tipo === 'periodo' ? p.L : p.Lcm / 100;
          valor = calcT(L);
          enunciado = ['Un péndulo tiene longitud ', Q('L', tipo === 'periodo' ? p.L : p.Lcm, tipo === 'periodo' ? 'm' : 'cm'), '. ¿Cuál es su período aproximado?'];
          cuentas = [];
          if (tipo === 'periodo-cm') { datos.push('1 m = 100 cm.'); cuentas.push(paso('Pasamos la longitud a metros.', [S.L, ' = ', Q('L', p.Lcm), ' ÷ 100 = ', Q('L', L, 'm')])); }
          cuentas.push(paso('Reemplazamos longitud y gravedad en el modelo pequeño.', [S.T, ' ≈ 2π · ', raiz(frac(Q('L', L), Q('g', p.g))), ' ≈ ', Q('T', valor, 's')]));
          sentido = 'El resultado es el tiempo aproximado de una ida y vuelta completa.';
          malos = [err(valor / 2, 'medio-ciclo', 'medio ciclo', 'calculaste medio ciclo.'), err(valor / (2 * Math.PI), 'sin-2pi', 'omite 2π', 'omitiste el factor 2π.'), err(2 * Math.PI * L / p.g, 'sin-raiz', 'omite raíz', 'no extrajiste la raíz.'), err(1 / valor, 'frecuencia', 'da frecuencia', 'invertiste el período y obtuviste la frecuencia.')]; break;
        }
        case 'masa':
          valor = p.T; enunciado = ['Un péndulo tarda aproximadamente ', Q('T', p.T, 's'), ' por ciclo. Cambiamos la pesa de ', Q('m', p.m1, 'g'), ' por otra de ', Q('m', p.m2, 'g'), ', conservando longitud y gravedad. ¿Cuál será el período?'];
          formula = [T2, ' ≈ ', T1, ' si no cambian L ni g'];
          cuentas = [paso('La masa no aparece en el período del péndulo simple.', [T2, ' ≈ ', Q('T', valor, 's')])];
          sentido = 'Ambas pesas completan aproximadamente el ciclo en el mismo tiempo.';
          malos = [err(valor * Math.sqrt(p.m2 / p.m1), 'raiz-masa', 'incluye raíz de masas', 'multiplicaste por la raíz de la razón de masas.'), err(valor * p.m2 / p.m1, 'masa-directa', 'incluye masas', 'multiplicaste por la razón de masas.'), err(valor / Math.sqrt(p.m2 / p.m1), 'raiz-inversa-masa', 'divide por raíz', 'dividiste por la raíz de la razón de masas.'), err(valor * p.m1 / p.m2, 'masa-inversa', 'divide por masas', 'dividiste por la razón de masas.')]; break;
        case 'frecuencia':
          valor = 1 / p.T; unidad = 'Hz'; clave = 'f';
          enunciado = ['El período aproximado de un péndulo es ', Q('T', p.T, 's'), '. ¿Cuál es su frecuencia?'];
          formula = [S.f, ' = ', frac('1', S.T)];
          cuentas = [paso('La frecuencia cuenta cuántos ciclos caben en un segundo.', [S.f, ' ≈ ', frac('1', Q('T', p.T)), ' = ', Q('f', valor, 'Hz')])];
          sentido = 'La frecuencia se expresa en ciclos por segundo, es decir, hertz.';
          malos = [err(p.T, 'periodo', 'da período', 'copiaste el período.'), err(2 / p.T, 'medios', 'cuenta medios ciclos', 'contaste cada ida como ciclo completo.'), err(1 / (2 * p.T), 'dobles', 'junta dos ciclos', 'juntaste dos ciclos en uno.'), err(1 / (p.T * p.T), 'cuadrado', 'eleva período', 'elevaste el período al cuadrado.')]; break;
        case 'razon': {
          valor = Math.sqrt(p.L2 * p.g1 / (p.L1 * p.g2)); unidad = ''; clave = 'T'; formula = RAZON;
          enunciado = ['Dos péndulos tienen longitudes ', Q('L', p.L1, 'm'), ' y ', Q('L', p.L2, 'm'), '. ¿Cuál es la razón de períodos segundo/primero?'];
          datos.push([g1, ' ≈ ', Q('g', p.g1, 'm/s²'), '; ', g2, ' ≈ ', Q('g', p.g2, 'm/s²'), '.'], ['Masas respectivas: ', Q('m', p.m1, 'g'), ' y ', Q('m', p.m2, 'g'), '.']);
          cuentas = [paso('Se cancelan los factores comunes 2π al dividir los períodos.', [frac(T2, T1), ' ≈ ', raiz(frac([Q('L', p.L2), ' · ', Q('g', p.g1)], [Q('L', p.L1), ' · ', Q('g', p.g2)])), ' ≈ ', Q('T', valor)])];
          sentido = valor > 1 ? 'La razón mayor que uno indica que el segundo ciclo tarda más.' : 'La razón menor que uno indica que el segundo ciclo tarda menos.';
          malos = [err(valor * valor, 'sin-raiz', 'omite raíz', 'no extrajiste la raíz.'), err(1 / valor, 'invierte', 'invierte comparación', 'intercambiaste el primero y el segundo.'), err(valor * Math.sqrt(p.m2 / p.m1), 'incluye-masa', 'incluye masas', 'añadiste la raíz de la razón de masas.'), err(valor / Math.sqrt(p.m2 / p.m1), 'divide-masa', 'divide por masas', 'dividiste entre la raíz de la razón de masas.')]; break;
        }
        case 'longitud': case 'longitud-ciclos': {
          const T = tipo === 'longitud' ? p.T : p.dt / p.N;
          valor = p.g * (T / (2 * Math.PI)) ** 2; unidad = 'm'; clave = 'L';
          enunciado = tipo === 'longitud' ? ['Un péndulo tiene período aproximado de ', Q('T', p.T, 's'), '. ¿Qué longitud corresponde a ese período?'] : ['Un péndulo completa ', Q('N', p.N), ' oscilaciones en ', Q('t', p.dt, 's'), '. ¿Cuál es su longitud aproximada?'];
          cuentas = [paso(tipo === 'longitud' ? 'Elevamos al cuadrado y despejamos la longitud.' : 'Hallamos el período y despejamos la longitud del modelo.', tipo === 'longitud' ? [S.L, ' ≈ ', S.g, ' · ', sup(frac(S.T, '2π'))] : [S.T, ' = ', frac(Q('t', p.dt), Q('N', p.N)), ' = ', Q('T', T, 's'), '; ', S.L, ' ≈ ', S.g, ' · ', sup(frac(S.T, '2π'))]), paso('Usamos el período de un solo ciclo.', [S.L, ' ≈ ', Q('g', p.g), ' · ', sup(frac(Q('T', T), '2π')), ' ≈ ', Q('L', valor, 'm')])];
          sentido = 'La longitud se mide siempre desde el apoyo hasta el centro de la pesa.';
          malos = [err(valor * 4, 'sin-dos', 'omite el dos', 'omitiste el dos del factor 2π.'), err(valor / 4, 'medio-periodo', 'usa medio período', 'usaste medio período antes de elevar al cuadrado.'), err(p.g * T / (4 * Math.PI ** 2), 'sin-cuadrado', 'omite cuadrado', 'no elevaste el período al cuadrado.'), err(valor * 4 * Math.PI ** 2, 'sin-2pi', 'omite 2π', 'omitiste el factor 2π completo.')]; break;
        }
        case 'duracion':
          valor = p.N * calcT(p.L); clave = 't';
          enunciado = ['Un péndulo de ', Q('L', p.L, 'm'), ' completa ', Q('N', p.N), ' oscilaciones. ¿Cuánto tarda aproximadamente?'];
          cuentas = [paso('Cada ciclo tiene el período calculado con longitud y gravedad.', [S.T, ' ≈ 2π · ', raiz(frac(Q('L', p.L), Q('g', p.g)))]), paso('Sumamos los tiempos de los ciclos, sin redondear el período intermedio.', [S.t, ' = ', S.N, ' · ', S.T, ' ≈ ', Q('N', p.N), ' · 2π · ', raiz(frac(Q('L', p.L), Q('g', p.g))), ' ≈ ', Q('t', valor, 's')])];
          sentido = 'El tiempo total incluye todos los ciclos completos contados.';
          malos = [err(calcT(p.L), 'un-ciclo', 'solo un ciclo', 'contaste solo un ciclo.'), err(valor / 2, 'medios', 'cuenta medios ciclos', 'asignaste medio período a cada ciclo.'), err(p.N / calcT(p.L), 'divide', 'divide por período', 'dividiste entre el período.'), err(p.N * valor, 'doble-conteo', 'cuenta ciclos dos veces', 'multiplicaste dos veces por el número de ciclos.')]; break;
        case 'gravedad':
          valor = 4 * Math.PI ** 2 * p.L / p.T ** 2; unidad = 'm/s²'; clave = 'g';
          enunciado = ['Un péndulo de ', Q('L', p.L, 'm'), ' tiene período ', Q('T', p.T, 's'), '. ¿Qué gravedad local aproximada corresponde al modelo?'];
          cuentas = [paso('Elevamos al cuadrado y aislamos la gravedad.', [S.g, ' ≈ ', frac(['4π² · ', S.L], sup(S.T))]), paso('Reemplazamos la longitud y el período.', [S.g, ' ≈ ', frac(['4π² · ', Q('L', p.L)], sup(Q('T', p.T))), ' ≈ ', Q('g', valor, unidad)])];
          sentido = 'Es una estimación del modelo, no una medición atribuida a una ciudad.';
          malos = [err(valor / (4 * Math.PI ** 2), 'sin-2pi', 'omite 2π', 'omitiste el factor 2π antes de elevar al cuadrado.'), err(4 * Math.PI ** 2 * p.L / p.T, 'sin-cuadrado', 'omite cuadrado', 'dividiste entre el período sin elevarlo al cuadrado.'), err(1 / valor, 'invierte', 'invierte cociente', 'invertiste el cociente final.'), err(valor / 4, 'sin-dos', 'omite el dos', 'usaste π en vez de 2π.')]; break;
        case 'longitud-razon': {
          const q = p.T2 / p.T1; valor = p.L1 * q * q; unidad = 'm'; clave = 'L';
          enunciado = ['Un péndulo de ', Q('L', p.L1, 'm'), ' tarda ', Q('T', p.T1, 's'), ' por ciclo. En el mismo lugar, ¿qué longitud permite un período de ', Q('T', p.T2, 's'), '?'];
          formula = [frac(T2, T1), ' ≈ ', raiz(frac(L2, L1))];
          cuentas = [paso('Elevamos la razón al cuadrado y despejamos la nueva longitud.', [L2, ' ≈ ', L1, ' · ', sup(frac(T2, T1))]), paso('Reemplazamos la razón de períodos en el orden pedido.', [L2, ' ≈ ', Q('L', p.L1), ' · ', sup(frac(Q('T', p.T2), Q('T', p.T1))), ' ≈ ', Q('L', valor, 'm')])];
          sentido = 'La longitud cambia con el cuadrado de la razón de períodos.';
          malos = [err(p.L1 * q, 'lineal', 'razón sin cuadrado', 'no elevaste la razón al cuadrado.'), err(p.L1 / (q * q), 'invierte', 'invierte razón', 'invertiste la razón de períodos.'), err(p.L1 * Math.sqrt(q), 'raiz', 'extrae otra raíz', 'extrajiste una raíz en vez de elevar al cuadrado.'), err(p.L1 * q ** 3, 'cubo', 'eleva al cubo', 'elevaste la razón al cubo.')]; break;
        }
        case 'duracion-otro': {
          const T = p.dt / p.N1, q = Math.sqrt(p.g1 / p.g2); valor = p.N2 * T * q; clave = 't';
          enunciado = ['Un péndulo completa ', Q('N', p.N1), ' ciclos en ', Q('t', p.dt, 's'), '. Sin cambiar su longitud, ¿cuánto tardarán ', Q('N', p.N2), ' ciclos en otro entorno?'];
          datos.push([g1, ' ≈ ', Q('g', p.g1, 'm/s²'), '; ', g2, ' ≈ ', Q('g', p.g2, 'm/s²'), '.']);
          formula = [frac(T2, T1), ' ≈ ', raiz(frac(g1, g2))];
          cuentas = [paso('Calculamos el período inicial y adaptamos el segundo a la gravedad.', [T1, ' = ', frac(Q('t', p.dt), Q('N', p.N1)), ' = ', Q('T', T, 's'), '; ', T2, ' ≈ ', T1, ' · ', raiz(frac(g1, g2))]), paso('Multiplicamos el nuevo período por la cantidad de ciclos.', [S.t, ' ≈ ', Q('N', p.N2), ' · ', Q('T', T), ' · ', raiz(frac(Q('g', p.g1), Q('g', p.g2))), ' ≈ ', Q('t', valor, 's')])];
          sentido = p.g2 < p.g1 ? 'Con la misma longitud y menor gravedad, cada ciclo tarda más.' : 'Con la misma longitud y mayor gravedad, cada ciclo tarda menos.';
          malos = [err(p.N2 * T / q, 'invierte-g', 'invierte gravedad', 'invertiste la razón de gravedades.'), err(p.N2 * T * q * q, 'sin-raiz', 'omite raíz', 'usaste la razón sin extraer raíz.'), err(p.N2 * T, 'sin-cambio', 'ignora gravedad', 'conservaste el período anterior.'), err(T * q, 'un-ciclo', 'solo un ciclo', 'calculaste solo un ciclo nuevo.')]; break;
        }
        case 'alargar': {
          const L = p.hilo + p.radio; valor = L * (p.factor * p.factor - 1); unidad = 'cm'; clave = 'L';
          enunciado = ['El hilo libre mide ', Q('L', p.hilo, 'cm'), ' y el radio de la pesa ', Q('L', p.radio, 'cm'), '. ¿Cuánto hilo añadimos para multiplicar el período por ', Q('T', p.factor), '?'];
          datos.push('La gravedad y la pesa no cambian.'); formula = [frac(T2, T1), ' ≈ ', raiz(frac(L2, L1))];
          cuentas = [paso('Sumamos hasta el centro; la nueva longitud usa la razón al cuadrado.', [L1, ' = ', Q('L', p.hilo), ' + ', Q('L', p.radio), ' = ', Q('L', L, 'cm'), '; ', L2, ' ≈ ', L1, ' · ', sup(Q('T', p.factor))]), paso('Alargamos solo la diferencia entre las longitudes completas.', ['hilo añadido ≈ ', Q('L', L), ' · (', sup(Q('T', p.factor)), ' − 1) = ', Q('L', valor, 'cm')])];
          sentido = 'La pesa conserva su radio; por eso el aumento corresponde al hilo.';
          malos = [err(L * p.factor ** 2, 'longitud-total', 'da longitud total', 'diste la longitud total nueva.'), err(L * (p.factor - 1), 'lineal', 'razón lineal', 'usaste una razón lineal para la longitud.'), err(p.hilo * (p.factor ** 2 - 1), 'solo-hilo', 'excluye radio', 'omitiste el radio de la pesa al formar la longitud.'), err(L / p.factor ** 2, 'inversa', 'invierte razón', 'invertiste la razón y diste una longitud total.')]; break;
        }
        case 'gravedad-razon': {
          const t1 = p.dt1 / p.N1, t2 = p.dt2 / p.N2, q = t1 / t2, r = p.L2 / p.L1;
          valor = r * q * q; unidad = ''; clave = 'g';
          enunciado = ['Dos péndulos miden ', Q('L', p.L1, 'm'), ' y ', Q('L', p.L2, 'm'), '. ¿Cuál es la razón de gravedades segundo/primero?'];
          datos.push(['Primero: ', Q('N', p.N1), ' ciclos en ', Q('t', p.dt1, 's'), '.'], ['Segundo: ', Q('N', p.N2), ' ciclos en ', Q('t', p.dt2, 's'), '.']);
          formula = [frac(g2, g1), ' ≈ ', frac(L2, L1), ' · ', sup(frac(T1, T2))];
          cuentas = [paso('Obtenemos cada período dividiendo el tiempo entre sus ciclos.', [T1, ' = ', frac(Q('t', p.dt1), Q('N', p.N1)), ' = ', Q('T', t1, 's'), '; ', T2, ' = ', frac(Q('t', p.dt2), Q('N', p.N2)), ' = ', Q('T', t2, 's')]), paso('La gravedad despejada es proporcional a la longitud dividida entre el período al cuadrado.', [frac(g2, g1), ' ≈ ', frac(Q('L', p.L2), Q('L', p.L1)), ' · ', sup(frac(Q('T', t1), Q('T', t2))), ' ≈ ', Q('g', valor)])];
          sentido = 'Comparamos las gravedades después de separar longitud y duración de cada ciclo.';
          malos = [err(r / (q * q), 'invierte-tiempo', 'invierte períodos', 'invertiste la razón de períodos.'), err(r * q, 'sin-cuadrado', 'omite cuadrado', 'no elevaste la razón de períodos al cuadrado.'), err(q * q, 'sin-longitud', 'omite longitudes', 'omitiste la razón de longitudes.'), err(r, 'sin-periodo', 'omite períodos', 'comparaste solo las longitudes.')]; break;
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
        regla: paso('Relacionamos longitud, gravedad y duración del ciclo.', formula), cuentas, sentido,
        respuesta: [aproximado ? '≈ ' : '', Q(clave, valor, unidad)], opciones: ops,
        caso: { tipo, ...p, valor, unidad, aproximado, errores: malos.map(e => ({ id: e.id, valor: e.valor })) },
        erroresEjemplo: malos.map(e => `${fmt(e.valor)}: ${e.corta}.`).join(' ') };
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
      { termino: 'péndulo simple', formas: ['péndulo simple', 'péndulos simples'], simple: 'Una pesa pequeña colgada de un hilo ideal.', def: 'Modelo de una masa puntual suspendida de un apoyo fijo mediante un hilo inextensible y de masa despreciable.', ejemplos: ['La longitud llega desde el apoyo hasta el centro de la pesa.', 'El hilo permanece tenso mientras la pesa se mueve.', 'Una pesa pequeña puede aproximarse por un punto situado en su centro.'] },
      { termino: 'aproximación de ángulo pequeño', formas: ['aproximación de ángulo pequeño', 'ángulo pequeño'], simple: 'Un modelo para inclinaciones cercanas a la vertical.', def: 'Simplificación que permite describir el vaivén del péndulo aproximadamente como un movimiento armónico cuando su inclinación es pequeña.', ejemplos: ['Una amplitud angular de 5° queda cerca de la vertical.', 'La aproximación pierde precisión al aumentar mucho la inclinación.', 'El ángulo se mide entre el hilo y la vertical.'] },
    );
    return { id: 'pendulo', titulo: 'El péndulo simple', pregunta: '¿Qué determina el tiempo de una pesa que va y vuelve?', temas: ['Péndulo simple'], pieza: 'fis-estatica',
      aprendizaje: 'Elijo la longitud hasta el centro de la pesa y estimo el período del péndulo con un modelo de ángulo pequeño.', actividad: 'Comparar dos pesas y dos longitudes en experimentos separados.', ejemplos,
      lee: { tarjetas: [
        { titulo: 'Una pesa colgada', texto: 'Un péndulo simple representa una pesa pequeña colgada de un hilo ligero que no se estira. El apoyo permanece fijo y despreciamos el rozamiento.', dibujo: figura([{ L: 0.75, m: 0.04 }]) },
        { titulo: 'La longitud del modelo', texto: ['La longitud ', S.L, ' llega del apoyo al centro de la pesa. La inclinación ', S.theta, ' se mide desde la vertical. Trabajaremos con la aproximación de ángulo pequeño, usando una amplitud angular de 8°.'] },
        { titulo: 'Dos comparaciones distintas', texto: ['El período ', S.T, ' cuenta una ida y vuelta completa. Primero cambiaremos la masa ', S.m, '; luego, la longitud. Conservaremos ', S.g, ' ≈ ', Q('g', 10, 'm/s²'), ' como aproximación de cálculo.'] },
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
        paso('El modelo pequeño relaciona el período con la longitud y la gravedad.', FORMULA),
        paso('Dividimos los períodos; los factores 2π y la misma gravedad se cancelan.', [frac(T2, T1), ' ≈ ', raiz(frac(L2, L1))]),
        paso('Reemplazamos longitudes en la misma unidad.', [frac(T2, T1), ' ≈ ', raiz(frac(Q('L', pred.L2 * 100), Q('L', pred.L1 * 100))), ' = ', Q('T', rp)]),
        paso('La masa no aparece en esta relación del péndulo simple.'),
        paso('En el punto inferior se anula la aceleración tangencial, no necesariamente la total.'),
        paso('Para despejar longitud o gravedad, elevamos al cuadrado la relación del período.', [S.L, ' ≈ ', S.g, ' · ', sup(frac(S.T, '2π')), '; ', S.g, ' ≈ ', frac(['4π² · ', S.L], sup(S.T))]),
      ] },
      regla: { texto: 'El período del péndulo pequeño depende de su longitud y de la gravedad. La masa no interviene. Para varios ciclos, se suma el tiempo de cada ciclo.', ecuacion: FORMULA,
        condicion: 'pesa puntual, hilo inextensible sin masa, apoyo fijo, gravedad constante, sin rozamiento e inclinaciones pequeñas.', dibujo: figura([{ L: 0.75, m: 0.04, T: periodo(0.75, 10) }]) },
      resuelve: { pieza: 'fis-estatica', generar(s) { const z = Math.floor(s / 4) % 31; const tipos = ['duracion', 'longitud', 'razon', 'gravedad']; const p = [
        { L: 0.42 + z * 0.01, g: 10, N: 5 + z }, { T: 1.31 + z * 0.01, g: 10 },
        { L1: 0.31 + z * 0.01, L2: 0.72 + z * 0.01, g1: 10, g2: 8, m1: 20, m2: 180 }, { L: 0.55 + z * 0.01, T: 1.71 + z * 0.01 } ]; return resuelto(caso(tipos[s % 4], p[s % 4])); } },
      ahoraTu: { pieza: 'fis-estatica', generar(s) { const z = Math.floor(s / 6) % 31, j = s % 6; const tipos = ['periodo-cm', 'longitud-ciclos', 'longitud-razon', 'duracion-otro', 'alargar', 'gravedad-razon']; const p = [
        { Lcm: 51 + z, g: 10 }, { N: 11 + z, dt: (11 + z) * 1.7, g: 10 }, { L1: 0.32 + z * 0.01, T1: 1.4, T2: 1.96 },
        { N1: 8 + z, dt: (8 + z) * 1.4, N2: 15 + z, g1: 10, g2: 4 }, { hilo: 31 + z, radio: 2, factor: 1.5 },
        { L1: 0.31 + z * 0.01, L2: 0.74 + z * 0.01, N1: 8 + z, dt1: 2.2 * (8 + z), N2: 12 + z, dt2: 1.6 * (12 + z) } ]; return pregunta(caso(tipos[j], p[j])); } },
    };
  })();

  return {
    unidad: 'fisica.oscilaciones', version: '1.0.0', estado: 'borrador',
    colores: COLORES,
    letras: {x:'posición desde el equilibrio', A:'amplitud', d:'distancia recorrida', δ:'deformación del resorte desde su longitud natural', v:'velocidad con signo', a:'aceleración con signo', F:'fuerza del resorte', t:'tiempo', T:'período', f:'frecuencia', N:'número de ciclos', m:'masa', k:'constante elástica', L:'longitud del péndulo', g:'aceleración de la gravedad', ω:'frecuencia angular', φ:'fase inicial', θ:'inclinación del péndulo', E_C:'energía cinética', E_PE:'energía potencial elástica', E_M:'energía mecánica'},
    requiere: ['/nucleo/kit/piezas/fis-estatica.js','/nucleo/kit/piezas/ejes.js'],
    glosario,
    
    historia: {
      texto: 'En 1657, Christiaan Huygens patentó un reloj de péndulo. El mecanismo contaba vaivenes para medir el tiempo. La regularidad del movimiento permitió mejorar los relojes, pero exigía cuidar las condiciones del péndulo: una oscilación muy amplia no tarda exactamente lo mismo que una pequeña.',
      pregunta: '¿Qué tendría que conservar un péndulo para que su reloj mida bien?',
      fuente: {titulo:'APS: Huygens y el primer reloj de péndulo',url:'https://www.aps.org/apsnews/2017/06/huygens-patents-first-pendulum-clock'},
    },
    ideas: [idea1, idea2, idea3, idea4, idea5],
  };
});
