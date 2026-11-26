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
    ideas: [idea1, idea2],
  };
});
