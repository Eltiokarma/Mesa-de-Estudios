/*
 * Generador «rutas-tramos»: conteo de rutas por tramos y por cuadras (razonamiento matemático,
 * unidad razonamiento-matematico.rutas-y-visualizacion-espacial). Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['rutas-tramos']) y en Node
 * (require). No usa ningún motor: calcula todo por su cuenta.
 *
 * Tipos (p._datos.tipo):
 *   red         pueblos A, B, C, D (y E) en cadena, con varios caminos en cada tramo consecutivo y
 *               de 1 a 3 atajos entre pueblos no consecutivos. Los caminos se recorren en los dos
 *               sentidos. Se cuentan las rutas del primero al último sin pasar dos veces por un mismo
 *               pueblo; condicion «ninguna», «pasa» (pasando por el pueblo `por`) o «evita» (sin pasar
 *               por `por`). _datos.tramos = [[i, j, caminos], …] con i < j índices de pueblo (0 = A).
 *               Respuesta: suma, sobre las rutas de pueblos válidas, del producto de los caminos de
 *               cada tramo.
 *   cuadricula  barrio de m cuadras de oeste a este por n de sur a norte; de la esquina suroeste a la
 *               noreste, solo hacia el este o el norte. La esquina interior (px, py) (px cuadras al este,
 *               py al norte de la partida; 0 < px < m, 0 < py < n) está «cerrada» o es de paso «obligado». Total sin condición:
 *               C(m+n, m); las que pasan por la esquina: C(px+py, px)·C(m−px+n−py, m−px).
 *               Respuesta: total − las que pasan (cerrada) o las que pasan (obligado).
 *
 * Errores: RME30 (sumar en vez de multiplicar), AR18 (parcial: olvidar rutas al listarlas) y
 * RME186–RME189 (docs/investigacion/razonamiento-espacial-ideas-erroneas.md). RME: hipótesis.
 * Funciones: generar(semilla) → problema; recalcular a mano con p._datos (campos de cada tipo arriba).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const RME = 'docs/investigacion/razonamiento-espacial-ideas-erroneas.md';
  const AR = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: RME });
  const ar18 = (valor, explicacion) => ({ id: 'AR18', valor, explicacion, respaldo: 'parcial', fuente: AR });
  const f = x => P.formatear(x, 0);
  const v = P.v;
  const PUEBLOS = 'ABCDE'.split('');
  const C = (a, b) => { let r = 1; for (let k = 1; k <= b; k++) r = r * (a - b + k) / k; return Math.round(r); };
  const caminos = n => (n === 1 ? '1 camino' : `${n} caminos`);

  function generar(semilla) {
    const rng = Azar.crear('rutas-tramos|' + semilla);
    const tipo = rng.elegir(['red', 'red', 'red', 'cuadricula', 'cuadricula']);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = tipo === 'red' ? red(rng, semilla) : cuadricula(rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // ---------- red de pueblos ----------
  // Rutas de pueblos simples de 0 a k−1, cada una como lista de índices.
  function rutas(k, tramos) {
    const ady = Array.from({ length: k }, () => []);
    for (const [i, j, c] of tramos) { ady[i].push([j, c]); ady[j].push([i, c]); }
    const out = [];
    const dfs = (u, camino) => {
      if (u === k - 1) { out.push(camino.slice()); return; }
      for (const [w] of ady[u]) if (!camino.includes(w)) { camino.push(w); dfs(w, camino); camino.pop(); }
    };
    dfs(0, [0]);
    return out;
  }
  const multi = (tramos, a, b) => tramos.find(([i, j]) => (i === a && j === b) || (i === b && j === a))[2];
  const valorRuta = (tramos, r) => r.slice(1).reduce((p, w, idx) => p * multi(tramos, r[idx], w), 1);
  const sumaRuta = (tramos, r) => r.slice(1).reduce((s, w, idx) => s + multi(tramos, r[idx], w), 0);
  const suma = (lista, fn) => lista.reduce((s, x) => s + fn(x), 0);

  function red(rng, semilla) {
    const k = rng.elegir([4, 4, 5]);
    const tramos = [];
    for (let i = 0; i + 1 < k; i++) tramos.push([i, i + 1, rng.elegir([2, 2, 3, 3, 4, 5])]);
    const posibles = [];
    for (let i = 0; i < k; i++) for (let j = i + 2; j < k; j++) posibles.push([i, j]);
    const nAtajos = rng.elegir([1, 2, 2, 3]);
    const elegidos = rng.barajar(posibles).slice(0, nAtajos).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
    for (const [i, j] of elegidos) tramos.push([i, j, rng.elegir([1, 1, 2, 3])]);
    const condicion = rng.elegir(['ninguna', 'ninguna', 'pasa', 'evita']);
    const por = condicion === 'ninguna' ? null : rng.entero(1, k - 2);
    const todas = rutas(k, tramos);
    const cumple = r => (condicion === 'pasa' ? r.includes(por) : condicion === 'evita' ? !r.includes(por) : true);
    const validas = todas.filter(cumple);
    if (validas.length < 2) return null;
    const correcta = suma(validas, r => valorRuta(tramos, r));
    if (correcta > 5000) return null;
    const monotona = r => r.every((x, idx) => idx === 0 || x > r[idx - 1]);
    const hayRegreso = validas.some(r => !monotona(r));
    const principal = PUEBLOS.slice(0, k).map((x, idx) => idx);
    const productoRutas = validas.reduce((p, r) => p * valorRuta(tramos, r), 1);
    const errores = [
      h('RME30', suma(validas, r => sumaRuta(tramos, r)), 'Sumaste los caminos de los tramos de cada ruta. Para ir por un tramo y luego por el siguiente se elige un camino en cada uno: los caminos de tramos seguidos se multiplican; las rutas distintas (una u otra) se suman.'),
      hayRegreso ? ar18(suma(validas.filter(monotona), r => valorRuta(tramos, r)), 'Olvidaste las rutas que van hacia atrás antes de llegar: los caminos se recorren en los dos sentidos, así que se puede usar un atajo, volver a un pueblo que se saltó y seguir. Con una lista ordenada (por el primer tramo, luego el segundo…) no se escapa ninguna.') : null,
      cumple(principal) ? ar18(valorRuta(tramos, principal), 'Contaste solo la ruta que pasa por todos los pueblos en orden. Los atajos dan otras rutas, que también se cuentan (y se suman).') : null,
      validas.length <= 4 && productoRutas <= 3000 ? h('RME186', productoRutas, 'Multiplicaste las rutas distintas entre sí. Se multiplica dentro de una ruta (un tramo y luego el otro); entre rutas que son una u otra, se suma.') : null,
      condicion === 'ninguna' ? null : h('RME187', suma(todas, r => valorRuta(tramos, r)), `Contaste todas las rutas, sin la condición de ${condicion === 'pasa' ? 'pasar' : 'no pasar'} por ${PUEBLOS[por]}.`),
      condicion === 'ninguna' ? null : h('RME187', suma(todas.filter(r => !cumple(r)), r => valorRuta(tramos, r)), `Contaste justo las que la condición deja fuera: las que ${condicion === 'pasa' ? 'no pasan' : 'pasan'} por ${PUEBLOS[por]}.`),
      ar18(suma(validas.slice(0, -1), r => valorRuta(tramos, r)), 'Se te escapó una ruta al listarlas. Ordénalas por el primer tramo que usan, y dentro de cada una por el siguiente, para no olvidar ninguna.'),
    ].filter(Boolean);

    const ini = PUEBLOS[0], fin = PUEBLOS[k - 1];
    const variables = { I: { nombre: 'partida', color: 'o' }, F: { nombre: 'llegada', color: 'i' }, X: { nombre: 'pueblo de la condición', color: 'h' }, R: { nombre: 'rutas', color: 'd' } };
    const nom = idx => (idx === 0 ? v('I', ini) : idx === k - 1 ? v('F', fin) : idx === por ? v('X', PUEBLOS[idx]) : PUEBLOS[idx]);
    const enunciado = [`Los pueblos ${PUEBLOS.slice(0, k - 1).join(', ')} y ${fin} están unidos por caminos de herradura. `];
    tramos.slice(0, k - 1).forEach(([i, j, c], idx) => {
      enunciado.push(idx === 0 ? 'De ' : '; de ', nom(i), ' a ', nom(j), idx === 0 ? ` hay ${caminos(c)}` : `, ${c}`);
    });
    enunciado.push('. Además, ');
    const at = tramos.slice(k - 1);
    at.forEach(([i, j, c], idx) => {
      enunciado.push(idx === 0 ? '' : idx === at.length - 1 ? ' y ' : ', ', `${c === 1 ? 'hay un camino directo' : `hay ${c} caminos directos`} entre `, nom(i), ' y ', nom(j));
    });
    enunciado.push('. Todos los caminos se pueden recorrer en los dos sentidos.');
    const pregunta = ['¿De cuántas maneras se puede ir de ', nom(0), ' a ', nom(k - 1), ' sin pasar dos veces por el mismo pueblo',
      ...(condicion === 'pasa' ? [' y pasando por ', nom(por)] : condicion === 'evita' ? [' y sin pasar por ', nom(por)] : []), '?'];
    const nombreRuta = r => r.map(x => PUEBLOS[x]).join('–');
    const cuenta = r => r.slice(1).map((w, idx) => multi(tramos, r[idx], w)).join(' · ');
    const solucion = [
      ['Se listan las rutas de pueblos en orden (por el primer tramo, después por el segundo…). En cada ruta se multiplican los caminos de sus tramos; las rutas distintas se suman.'],
      ...(condicion === 'ninguna' ? [] : [[`Solo valen las que ${condicion === 'pasa' ? 'pasan' : 'no pasan'} por `, nom(por), '.']]),
      ...validas.map(r => [`${nombreRuta(r)}: ${cuenta(r)} = ${valorRuta(tramos, r)}.`]),
      ['Total: ', validas.map(r => valorRuta(tramos, r)).join(' + '), ' = ', v('R', `${f(correcta)} maneras`), '.'],
    ];
    const alternativas = P.armar({ correcta, errores, rng, texto: x => f(x) });
    return {
      id: `rutas-tramos#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad: 'maneras' },
      _datos: { tipo: 'red', k, tramos, condicion, por },
    };
  }

  // ---------- cuadrícula ----------
  const NOMBRES = ['Rosa', 'Miguel', 'Lucía', 'Ernesto', 'Valeria', 'Iván'];
  const cuadras = n => (n === 1 ? '1 cuadra' : `${n} cuadras`);
  function cuadricula(rng, semilla) {
    const m = rng.elegir([3, 4, 4, 5, 5, 6]), n = rng.elegir([2, 3, 3, 4]);
    // Esquina interior: en el borde solo hay un camino para llegar o salir, y el problema se vuelve trivial.
    const px = rng.entero(1, m - 1), py = rng.entero(1, n - 1);
    const condicion = rng.elegir(['cerrado', 'obligado']);
    const T = C(m + n, m), c1 = C(px + py, px), c2 = C(m - px + n - py, m - px), pasan = c1 * c2;
    const correcta = condicion === 'cerrado' ? T - pasan : pasan;
    if (correcta < 4) return null;
    const errores = condicion === 'cerrado' ? [
      h('RME188', T - 1, `Restaste una sola ruta por la esquina cerrada. Por esa esquina pasan ${c1} · ${c2} = ${pasan} rutas, y hay que quitarlas todas.`),
      h('RME30', T - (c1 + c2), 'Para contar las rutas que pasan por la esquina sumaste las dos partes. Se llega a la esquina de una manera y se sigue de otra: se multiplican.'),
      h('RME187', T, 'Contaste todas las rutas, sin quitar las que pasan por la esquina cerrada.'),
      h('RME187', pasan, 'Esas son las rutas que pasan por la esquina cerrada: las que justo no se pueden hacer. Hay que restarlas del total.'),
      h('RME189', 2 ** (m + n) - pasan, `Contaste 2 opciones en cada una de las ${m + n} cuadras. No son libres: siempre hay exactamente ${m} hacia el este y ${n} hacia el norte, y solo se elige el orden: C(${m + n}, ${m}).`),
    ] : [
      h('RME30', c1 + c2, `Sumaste las rutas hasta la esquina y las rutas desde la esquina. Por cada manera de llegar hay ${c2} de seguir: se multiplican.`),
      h('RME187', T, 'Contaste todas las rutas, también las que no pasan por la esquina obligada.'),
      h('RME187', T - pasan, 'Esas son las rutas que no pasan por la esquina: justo las que no sirven.'),
      h('RME189', 2 ** (m + n), `Contaste 2 opciones en cada una de las ${m + n} cuadras. No son libres: siempre hay exactamente ${m} hacia el este y ${n} hacia el norte, y solo se elige el orden.`),
      h('RME189', c1 * 2 ** (m - px + n - py), 'Contaste bien hasta la esquina, pero después contaste 2 opciones en cada cuadra. Desde la esquina también se elige solo el orden de las cuadras al este y al norte que faltan.'),
    ];
    const quien = rng.elegir(NOMBRES);
    const variables = { m: { nombre: 'cuadras al este', color: 'o' }, n: { nombre: 'cuadras al norte', color: 'i' }, E: { nombre: 'la esquina', color: 'h' }, R: { nombre: 'rutas', color: 'd' } };
    const esquina = ['la esquina que queda a ', v('E', `${cuadras(px)} al este y ${cuadras(py)} al norte`), ' de la partida'];
    const enunciado = ['Las calles de un barrio forman una cuadrícula de ', v('m', cuadras(m)), ' de oeste a este por ', v('n', cuadras(n)), ` de sur a norte. ${quien} va de la esquina suroeste a la esquina noreste por las calles, siempre hacia el este o hacia el norte. `,
      ...(condicion === 'cerrado' ? ['Por obras, ', ...esquina, ' está cerrada: no se puede pasar por ella.'] : ['Tiene que pasar por la bodega de ', ...esquina, '.'])];
    const pregunta = ['¿Cuántas rutas distintas puede seguir?'];
    const solucion = [
      ['Cada ruta tiene ', v('m', `${m} cuadras al este`), ' y ', v('n', `${n} al norte`), ` en algún orden: sin condición hay C(${m + n}, ${m}) = ${T} rutas.`],
      ['Rutas hasta la esquina: ', `C(${px + py}, ${px}) = ${c1}. Desde la esquina hasta la llegada: C(${m - px + n - py}, ${m - px}) = ${c2}. Pasan por la esquina ${c1} · ${c2} = ${pasan}.`],
      condicion === 'cerrado' ? ['Se quitan las que pasan por la esquina cerrada: ', `${T} − ${pasan} = `, v('R', `${f(correcta)} rutas`), '.'] : ['Solo valen las que pasan por la esquina: ', v('R', `${f(correcta)} rutas`), '.'],
    ];
    const alternativas = P.armar({ correcta, errores, rng, texto: x => f(x) });
    return {
      id: `rutas-tramos#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad: 'rutas' },
      _datos: { tipo: 'cuadricula', m, n, px, py, condicion },
    };
  }

  return { id: 'rutas-tramos', titulo: 'Rutas por tramos y por cuadras', generar };
});
