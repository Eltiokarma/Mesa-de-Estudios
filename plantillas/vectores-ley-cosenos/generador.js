/*
 * Generador G1: dos vectores con la ley de cosenos, en directo y al revés.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['vectores-ley-cosenos']) y en Node (require).
 *
 * Tipos (docs/clasificacion/compendio-vectores.md, T8):
 *   resultante        |A + B| a partir de los módulos y el ángulo
 *   diferencia        |A − B| a partir de los módulos y el ángulo
 *   angulo-desde-R    el ángulo entre A y B a partir de |A + B| (o de tres vectores que se anulan)
 *   suma-diferencia   módulos iguales y |A + B| = k·|A − B| (o al revés): el ángulo
 *   desde-max-min     se conocen la resultante máxima y la mínima: R para un ángulo dado
 *
 * Convención de academia: cos 37° = 4/5 y cos 53° = 3/5 (triángulo 3-4-5, aproximado).
 * Todos los números se eligen para que R² sea entero: R sale como entero o como a√b.
 * No hay informe de ideas erróneas sobre vectores: los errores son hipótesis nuestras salvo
 * sumar o restar módulos como números (parcial: E8 y M2 de docs/investigacion/).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const E8 = 'docs/investigacion/estatica-energia-ideas-erroneas.md';
  const M2 = 'docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const p = (id, valor, explicacion, fuente) => ({ id, valor, explicacion, respaldo: 'parcial', fuente });

  // Coseno de academia como fracción [num, den]: así R² sale exacto.
  const COS = { 37: [4, 5], 53: [3, 5], 60: [1, 2], 90: [0, 1], 120: [-1, 2], 127: [-3, 5], 143: [-4, 5] };
  const ANGULOS = [37, 53, 60, 120, 127, 143];
  const cos = t => COS[t][0] / COS[t][1];
  // Pares de módulos: con 37° o 53°, uno de los dos es múltiplo de 5 (así 2ab·cos θ es entero).
  const MODULOS = [3, 4, 5, 6, 8, 10, 12, 15];
  const UNIDADES = [
    { u: 'u', que: 'Dos vectores A y B' },
    { u: 'N', que: 'Dos fuerzas A y B, aplicadas en el mismo punto,' },
    { u: 'm', que: 'Dos desplazamientos A y B' },
  ];
  const R2 = (a, b, t, s = 1) => a * a + b * b + s * 2 * a * b * cos(t);
  const raiz = x => Math.sqrt(Math.max(0, x));
  const esEntero = x => Math.abs(x - Math.round(x)) < 1e-9;
  const g = x => `${P.formatear(x, 1)}°`;
  // Solo entran distractores que se escriben como la correcta: entero o a√b (R² entero).
  const conRaiz = x => Number.isFinite(x) && x > 0 && esEntero(x * x);
  const f = x => P.formatear(x, 2);
  const conSigno = x => (x < 0 ? `− ${f(-x)}` : `+ ${f(x)}`);
  // "√475 = 5√19"; si la raíz no se simplifica, solo "√97".
  const igualRaiz = r2 => { const t = P.radical(Math.sqrt(r2)); return t === `√${f(r2)}` ? t : `√${f(r2)} = ${t}`; };

  function generar(semilla) {
    const rng = Azar.crear('vectores-ley-cosenos|' + semilla);
    for (let intento = 0; intento < 80; intento++) {
      const pr = construir(rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function modulos(rng, t) {
    for (;;) {
      const a = rng.elegir(MODULOS), b = rng.elegir(MODULOS);
      if (a === b) continue;
      if (!esEntero(2 * a * b * cos(t))) continue;
      return [a, b];
    }
  }

  function construir(rng, semilla) {
    const tipo = rng.elegir(['resultante', 'diferencia', 'angulo-desde-R', 'suma-diferencia', 'desde-max-min']);
    const ctx = rng.elegir(tipo === 'desde-max-min' ? [UNIDADES[0], UNIDADES[1]] : UNIDADES);
    const u = ctx.u, v = P.v;
    const variables = {
      A: { nombre: 'módulo de A', color: 'o' }, B: { nombre: 'módulo de B', color: 'i' },
      t: { nombre: 'ángulo entre A y B', color: 'h' }, R: { nombre: 'resultante', color: 'd' },
    };
    const conU = x => `${P.radical(x)} ${u}`;
    let enunciado, pregunta, correcta, errores, solucion, unidad = u, datos, angular = false;

    if (tipo === 'resultante' || tipo === 'diferencia') {
      const t = rng.elegir(ANGULOS), [a, b] = modulos(rng, t);
      const suma = tipo === 'resultante', s = suma ? 1 : -1;
      const r2 = R2(a, b, t, s);
      correcta = raiz(r2);
      const [cn, cd] = COS[t];
      enunciado = [`${ctx.que} miden `, v('A', `${a} ${u}`), ' y ', v('B', `${b} ${u}`), ' y forman un ángulo de ', v('t', `${t}°`), ' entre sí.'];
      pregunta = [suma ? '¿Cuánto mide la resultante |A + B|?' : '¿Cuánto mide la diferencia |A − B|?'];
      errores = [
        suma ? p('VE-suma-modulos', a + b, `Sumaste los módulos como números (${a} + ${b}). Eso solo pasa si A y B apuntan hacia el mismo lado (θ = 0°); con ${t}° la resultante es menor.`, E8)
             : p('VE-resta-modulos', Math.abs(a - b), `Restaste los módulos como números. Eso solo pasa si A y B apuntan hacia el mismo lado (θ = 0°); con ${t}° la diferencia es mayor.`, M2),
        suma ? h('VE-coseno-con-menos', raiz(R2(a, b, t, -1)), 'Usaste el signo menos de la ley de cosenos del triángulo. En el paralelogramo, con θ el ángulo entre A y B, la resultante lleva +2AB·cos θ; con el signo menos sale |A − B|.')
             : h('VE-diferencia-con-mas', raiz(R2(a, b, t, 1)), 'Usaste el signo más: así se calcula |A + B|. Para la diferencia, −B apunta al revés y el ángulo entre A y −B es 180° − θ, por eso va −2AB·cos θ.'),
        h('VE-pitagoras-siempre', raiz(a * a + b * b), `Usaste Pitágoras (√(A² + B²)), que solo vale si A y B son perpendiculares. Con ${t}° falta el término 2AB·cos θ.`),
        suma ? p('VE-resta-modulos', Math.abs(a - b), 'Restaste los módulos. Eso solo pasa si A y B apuntan en sentidos opuestos (θ = 180°).', M2)
             : p('VE-suma-modulos', a + b, 'Sumaste los módulos. La diferencia mide A + B solo si A y B apuntan en sentidos opuestos (θ = 180°).', E8),
        h('VE-sin-raiz', r2, `Calculaste ${suma ? 'R²' : 'D²'} = ${P.formatear(r2, 2)} y olvidaste sacar la raíz cuadrada.`),
      ];
      const signo = suma ? '+' : '−';
      const cruz = 2 * a * b * cos(t);
      solucion = [
        [suma ? 'Ley de cosenos para la suma (método del paralelogramo): R² = A² + B² + 2AB·cos θ.' : 'Para la diferencia, −B forma 180° − θ con A, y cos(180° − θ) = −cos θ: D² = A² + B² − 2AB·cos θ.'],
        ['cos ', v('t', `${t}°`), ` = ${cn < 0 ? '−' : ''}${Math.abs(cn)}/${cd}${t === 37 || t === 53 || t === 127 || t === 143 ? ' (triángulo notable 3-4-5)' : ''}.`],
        [`${suma ? 'R²' : 'D²'} = `, v('A', `${a}`), '² + ', v('B', `${b}`), `² ${signo} 2·${a}·${b}·(${f(cos(t))}) = ${a * a} + ${b * b} ${conSigno(s * cruz)} = ${f(r2)}.`],
        [`${suma ? 'R' : 'D'} = `, v('R', `${igualRaiz(r2)} ${u}`), '.'],
      ];
      datos = { tipo, a, b, t };
    } else if (tipo === 'angulo-desde-R') {
      const t = rng.elegir(ANGULOS), [a, b] = modulos(rng, t);
      const r2 = R2(a, b, t), R = raiz(r2);
      const tres = rng.moneda();
      angular = true; unidad = '°';
      correcta = t;
      if (tres) {
        variables.R = { nombre: 'módulo de C, igual a |A + B|', color: 'd' };
        enunciado = [`Tres vectores A, B y C suman cero: A + B + C = 0. Sus módulos son `, v('A', `${a} ${u}`), ', ', v('B', `${b} ${u}`), ' y ', v('R', conU(R)), '.'];
        pregunta = ['¿Qué ángulo forman A y B (puestos con el origen en el mismo punto)?'];
      } else {
        enunciado = [`${ctx.que} miden `, v('A', `${a} ${u}`), ' y ', v('B', `${b} ${u}`), '. Su resultante mide ', v('R', conU(R)), '.'];
        pregunta = ['¿Qué ángulo forman A y B?'];
      }
      errores = [
        tres ? h('VE-angulo-interior', 180 - t, `Ese es el ángulo interior del triángulo que forman A, B y C puestos uno tras otro. El ángulo entre A y B se mide con los dos saliendo del mismo punto, y es el suplemento: 180° − ${180 - t}° = ${t}°.`)
             : h('VE-coseno-con-menos', 180 - t, 'Usaste R² = A² + B² − 2AB·cos θ (el signo menos del triángulo). Con el signo cambiado, cos θ cambia de signo y sale el suplemento del ángulo.'),
        h('VE-angulo-complementario', Math.abs(90 - t), 'Despejaste bien el número, pero lo tomaste como seno en vez de coseno: así sale el complemento del ángulo.'),
        h('VE-pitagoras-siempre', 90, `Supusiste que son perpendiculares. Si lo fueran, R² sería ${a * a + b * b}, pero R² = ${P.formatear(r2, 2)}.`),
      ];
      const c = (r2 - a * a - b * b) / (2 * a * b);
      solucion = [
        tres ? ['Si A + B + C = 0, entonces A + B = −C: la resultante de A y B mide lo mismo que C.'] : ['Ley de cosenos para la suma: R² = A² + B² + 2AB·cos θ. Se despeja cos θ.'],
        [v('R', P.radical(R).includes('√') ? `(${P.radical(R)})` : P.radical(R)), `² = ${P.formatear(r2, 2)} = `, v('A', `${a}`), '² + ', v('B', `${b}`), `² + 2·${a}·${b}·cos θ`, ` → ${P.formatear(r2, 2)} = ${a * a + b * b} + ${2 * a * b}·cos θ.`],
        [`cos θ = (${P.formatear(r2, 2)} − ${a * a + b * b}) / ${2 * a * b} = ${P.formatear(c, 2)}${c < 0 ? ': es negativo, así que el ángulo es obtuso' : ''}.`],
        ['θ = ', v('t', `${t}°`), t === 37 || t === 53 || t === 127 || t === 143 ? ' (con el triángulo 3-4-5 de academia).' : '.'],
      ];
      datos = { tipo, a, b, t, tres };
    } else if (tipo === 'suma-diferencia') {
      // Módulos iguales: |A + B| = 2A·cos(θ/2) y |A − B| = 2A·sen(θ/2), las diagonales del rombo.
      const op = rng.elegir([
        { t: 53, k: '2', k2: 4, alReves: false }, { t: 37, k: '3', k2: 9, alReves: false }, { t: 60, k: '√3', k2: 3, alReves: false },
        { t: 127, k: '2', k2: 4, alReves: true }, { t: 143, k: '3', k2: 9, alReves: true }, { t: 120, k: '√3', k2: 3, alReves: true },
      ]);
      const a = rng.elegir([5, 10, 20, 6, 12]);
      angular = true; unidad = '°';
      correcta = op.t;
      variables.R = { nombre: 'razón entre la suma y la diferencia', color: 'd' };
      const mayor = op.alReves ? '|A − B|' : '|A + B|', menor = op.alReves ? '|A + B|' : '|A − B|';
      enunciado = ['Dos vectores A y B tienen el mismo módulo, ', v('A', `${a} ${u}`), `. Se sabe que ${mayor} es `, v('R', `${op.k}`), ` veces ${menor}.`];
      pregunta = ['¿Qué ángulo forman A y B?'];
      errores = [
        h('VE-razon-invertida', 180 - op.t, `Pusiste la razón al revés (${menor} = ${op.k}·${mayor}). Al cambiar la suma por la diferencia, cos θ cambia de signo y sale el suplemento.`),
        h('VE-angulo-complementario', Math.abs(90 - op.t), 'Despejaste bien el número, pero lo tomaste como seno en vez de coseno: así sale el complemento del ángulo.'),
        h('VE-diagonales-perpendiculares', 90, 'Con módulos iguales, A + B y A − B son las diagonales de un rombo y sí son perpendiculares. Pero se pide el ángulo entre los lados A y B, no entre las diagonales.'),
        h('VE-angulo-con-resultante', op.t / 2, `Ese es el ángulo entre A + B y cada vector: la diagonal del rombo parte θ en dos mitades iguales. El ángulo entre A y B es el doble.`),
      ];
      const c = (op.k2 - 1) / (op.k2 + 1) * (op.alReves ? -1 : 1);
      solucion = [
        ['Con módulos iguales: |A + B|² = 2A²(1 + cos θ) y |A − B|² = 2A²(1 − cos θ). El módulo ', v('A', `${a} ${u}`), ' se cancela al dividir.'],
        [op.alReves ? `(1 − cos θ)/(1 + cos θ) = ` : `(1 + cos θ)/(1 − cos θ) = `, v('R', op.k), `² = ${op.k2}.`],
        [op.alReves ? `1 − cos θ = ${op.k2} + ${op.k2}·cos θ → cos θ = −${op.k2 - 1}/${op.k2 + 1} = ${P.formatear(c, 2)}.` : `1 + cos θ = ${op.k2} − ${op.k2}·cos θ → cos θ = ${op.k2 - 1}/${op.k2 + 1} = ${P.formatear(c, 2)}.`],
        ['θ = ', v('t', `${op.t}°`), '. Comprobación con el rombo: la diagonal A + B parte el ángulo en dos de ', g(op.t / 2), '.'],
      ];
      datos = { tipo, a, t: op.t, k2: op.k2, alReves: op.alReves };
    } else {
      // desde-max-min: Rmax = A + B y Rmin = A − B.
      const t = rng.elegir([60, 90, 120, 37, 53, 127, 143]);
      const [a, b] = (() => { for (;;) { const [x, y] = modulos(rng, t === 90 ? 60 : t); if (x !== y) return x > y ? [x, y] : [y, x]; } })();
      const M = a + b, m = a - b;
      const r2 = R2(a, b, t);
      correcta = raiz(r2);
      enunciado = [`${ctx.que} pueden girar. Su resultante mide como máximo `, `${M} ${u}`, ' y como mínimo ', `${m} ${u}`, '.'];
      pregunta = ['¿Cuánto mide la resultante cuando A y B forman ', v('t', `${t}°`), '?'];
      errores = [
        h('VE-maximo-minimo-como-modulos', raiz(R2(M, m, t)), `Tomaste el máximo (${M}) y el mínimo (${m}) como si fueran los módulos. El máximo es A + B y el mínimo es A − B: primero hay que despejar A y B.`),
        t === 90 ? h('VE-sin-raiz', r2, `Calculaste R² = ${r2} y olvidaste sacar la raíz cuadrada.`)
                 : h('VE-pitagoras-siempre', raiz(a * a + b * b), `Usaste Pitágoras, que solo vale a 90°. Con ${t}° falta el término 2AB·cos θ.`),
        h('VE-coseno-con-menos', raiz(R2(a, b, t, -1)), 'Usaste el signo menos de la ley de cosenos del triángulo. Para la suma, con θ entre A y B, va +2AB·cos θ.'),
        h('VE-promedio-max-min', (M + m) / 2, `Promediaste el máximo y el mínimo: eso da el módulo del vector mayor (${a}), no la resultante.`),
        h('VE-sin-raiz', r2, `Calculaste R² = ${P.formatear(r2, 2)} y olvidaste sacar la raíz cuadrada.`),
      ];
      solucion = [
        ['El máximo pasa con θ = 0° (A + B) y el mínimo con θ = 180° (A − B): ', `A + B = ${M} y A − B = ${m}.`],
        ['Sumando y restando: ', v('A', `A = ${a} ${u}`), ' y ', v('B', `B = ${b} ${u}`), '.'],
        ['R² = ', v('A', `${a}`), '² + ', v('B', `${b}`), `² + 2·${a}·${b}·cos `, v('t', `${t}°`), ` = ${a * a} + ${b * b} ${conSigno(2 * a * b * cos(t))} = ${f(r2)}.`],
        ['R = ', v('R', `${igualRaiz(r2)} ${u}`), '.'],
      ];
      datos = { tipo, M, m, t };
    }
    const texto = angular ? (x => g(x)) : (x => `${P.radical(x)} ${unidad}`);
    if (!angular) errores = errores.filter(e => conRaiz(e.valor));
    const alternativas = P.armar({ correcta, errores, rng, texto });
    return {
      id: `vectores-ley-cosenos#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad },
      _datos: datos,
    };
  }

  return { id: 'vectores-ley-cosenos', titulo: 'Dos vectores: la ley de cosenos', generar };
});
