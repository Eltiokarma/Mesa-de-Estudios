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
  const COLORES = { x: 'i', A: 'i', L: 'i', d: 'i', v: 'o', a: 'd', F: 'd', t: 'h', T: 'h', f: 'h', omega: 'h', phi: 'h', theta: 'h', g: 'h', m: 'f', k: 'f', N: 'f', EC: 'o', EPE: 'i', EM: 'f' };
  const V = (clave, texto) => ({ v: `c-${COLORES[clave]}`, t: String(texto), m: clave });
  const sub = (base, indice) => ({ sub: [base, indice] });
  const sup = (base, potencia = '2') => ({ sup: [base, potencia] });
  const frac = (arriba, abajo) => ({ frac: [arriba, abajo] });
  const raiz = contenido => ({ raiz: contenido });
  const S = Object.fromEntries(Object.keys(COLORES).map(k => [k, V(k, { omega: 'ω', phi: 'φ', theta: 'θ' }[k] || k)]));
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
          formula = ['recorrido = ciclos completos · 4 · ', S.A, ' + medio ciclo · 2 · ', S.A];
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
        tengo, regla: paso('Relacionamos las cantidades según qué cuenta un ciclo completo.', formula), cuentas, sentido,
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

  return {
    unidad: 'fisica.oscilaciones', version: '1.0.0', estado: 'borrador',
    colores: COLORES,
    letras: {x:'posición desde el equilibrio', A:'amplitud', d:'distancia recorrida', v:'velocidad con signo', a:'aceleración con signo', F:'fuerza horizontal del resorte', t:'tiempo', T:'período', f:'frecuencia', N:'número de ciclos', m:'masa', k:'constante elástica', L:'longitud del péndulo', g:'aceleración de la gravedad', ω:'frecuencia angular', φ:'fase inicial', θ:'inclinación del péndulo', E_C:'energía cinética', E_PE:'energía potencial elástica', E_M:'energía mecánica'},
    requiere: ['/nucleo/kit/piezas/fis-estatica.js','/nucleo/kit/piezas/ejes.js'],
    glosario,
    
    historia: {
      texto: 'En 1657, Christiaan Huygens patentó un reloj de péndulo. El mecanismo contaba vaivenes para medir el tiempo. La regularidad del movimiento permitió mejorar los relojes, pero exigía cuidar las condiciones del péndulo: una oscilación muy amplia no tarda exactamente lo mismo que una pequeña.',
      pregunta: '¿Qué tendría que conservar un péndulo para que su reloj mida bien?',
      fuente: {titulo:'APS: Huygens y el primer reloj de péndulo',url:'https://www.aps.org/apsnews/2017/06/huygens-patents-first-pendulum-clock'},
    },
    ideas: [idea1],
  };
});
