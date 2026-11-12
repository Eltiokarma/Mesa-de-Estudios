/*
 * Generador «Tres cargas en el plano» (unidad fisica.electrostatica).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['cargas-sistema']) y en Node (require). No usa ningún motor.
 *
 * Tipos y subtipos:
 *   energia/linea       tres cargas en una recta: energía potencial del sistema (suma de los tres pares)
 *   energia/triangulo   tres cargas en los vértices de un triángulo 30-40-50 cm o equilátero
 *   energia/rectangulo  cuatro cargas en los vértices de un rectángulo de 30 cm × 40 cm (diagonal 50 cm):
 *                       seis pares
 *   energia/razon-nula  q, Q y m·q alineadas: la razón Q/q para que la energía del sistema sea cero
 *   grafica/v-otra      la gráfica V–r de una carga puntual pasa por (r1; V1): el potencial en r2
 *   grafica/e-otra      con la misma gráfica: el campo eléctrico en r2
 *   grafica/carga       con la misma gráfica (r en cm): la carga que crea el potencial
 *   campo/triangulo     dos cargas iguales o de signos opuestos en dos vértices de un triángulo
 *                       equilátero: el campo en el tercer vértice
 *   campo/cuadrado      cuatro cargas de igual valor en los vértices de un cuadrado: el campo en el centro
 *   campo/cubo          cuatro cargas en los vértices de una cara de un cubo: el campo en el centro de la
 *                       cara opuesta (las componentes paralelas se anulan; las que quedan se suman)
 *
 * Convenciones: k = 9 × 10⁹ N·m²/C²; cargas en µC (nC en la gráfica); distancias en cm en el
 * enunciado; energía en mJ (con signo: puede ser negativa); potencial en V y campo en N/C. En «campo»,
 * las respuestas se escriben como múltiplo exacto de 10⁵ N/C, con radicales: «4√2 × 10⁵ N/C».
 *
 * Errores: todos hipótesis (la sección «Lo que no tiene respaldo» de
 * docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md no tiene estudios con porcentaje
 * para energía de sistemas, potencial ni superposición). Códigos nuevos con prefijo CS-:
 *   CS-pares-dos-veces, CS-sin-signo, CS-inverso-cuadrado (1/r² en lugar de 1/r, en energía y en V),
 *   CS-olvida-extremos y CS-distancia-extremos (trampa de la fila unmsm-2021 #80), CS-olvida-diagonales,
 *   CS-e-por-v (campo y potencial confundidos), CS-e-en-el-punto, CS-e-como-1-sobre-r,
 *   CS-suma-modulos (sumar módulos sin descomponer), CS-todo-se-anula, CS-como-perpendiculares,
 *   CS-signo-direccion, CS-distancia-lado, CS-distancia-arista, CS-distancia-diagonal-cara.
 * Transversales (docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md): U2-cm, PR4-potencial.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const EM = 'docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md';
  const TR = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = EM) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const tr = (id, valor, explicacion) => h(id, valor, explicacion, TR);
  const f = (x, d = 2) => P.formatear(x, d);
  const v = P.v;
  const limpio = (x, dec = 2) => {
    if (!Number.isFinite(x) || Math.abs(x) > 1e12) return false;
    const y = x * 10 ** dec;
    return Math.abs(y - Math.round(y)) < 1e-7 * Math.max(1, Math.abs(y));
  };
  const positivo = x => limpio(x) && x > 0;
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };

  // Texto exacto: entero, fracción p/s, o radical a√b/s; si nada sale limpio, decimales.
  function exacto(x) {
    if (Math.abs(x) < 1e-12) return '0';
    const signo = x < 0 ? '−' : '', y = Math.abs(x);
    for (let s = 1; s <= 200; s++) {
      const p = y * s;
      if (Math.abs(p - Math.round(p)) < 1e-9 * Math.max(1, p)) {
        const n = Math.round(p), g = mcd(n, s);
        return signo + (s / g === 1 ? String(n / g) : `${n / g}/${s / g}`);
      }
    }
    for (let s = 1; s <= 12; s++) {
      const N2 = (y * s) ** 2, N = Math.round(N2);
      if (N > 0 && Math.abs(N2 - N) < 1e-7 * N && N < 1e7) {
        let a = 1, b = N;
        for (let k = 2; k * k <= b; k++) while (b % (k * k) === 0) { b /= k * k; a *= k; }
        if (b === 1) continue;
        const g = mcd(a, s), aa = a / g, ss = s / g;
        return signo + (aa === 1 ? '' : aa) + '√' + b + (ss === 1 ? '' : '/' + ss);
      }
    }
    return signo + f(y);
  }

  const TIPOS = [['energia', 'linea'], ['energia', 'linea'], ['energia', 'triangulo'], ['energia', 'rectangulo'], ['energia', 'razon-nula'], ['energia', 'razon-nula'],
    ['grafica', 'v-otra'], ['grafica', 'e-otra'], ['grafica', 'carga'],
    ['campo', 'triangulo'], ['campo', 'cuadrado'], ['campo', 'cubo'], ['campo', 'cubo']];

  function generar(semilla) {
    const rng = Azar.crear('cargas-sistema|' + semilla);
    const [tipo, sub] = rng.elegir(TIPOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = tipo === 'energia' ? (sub === 'razon-nula' ? razonNula(rng, semilla) : energia(rng, semilla, sub))
        : tipo === 'grafica' ? grafica(rng, semilla, sub) : campo(rng, semilla, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cerrar(rng, semilla, o) {
    const ok = o.ok || positivo;
    // Sin distractores absurdos: fuera de 1/20 a 20 veces la correcta (en valor absoluto) no entran.
    const razonable = x => x === 0 || (Math.abs(x / o.correcta) <= 20 && Math.abs(x / o.correcta) >= 1 / 20);
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => ok(e.valor) && razonable(e.valor)), rng, texto: o.texto, negativos: !!o.negativos });
    return {
      id: `cargas-sistema#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  const uc = q => `${q > 0 ? '+' : '−'}${Math.abs(q)} µC`;
  const par = x => (x < 0 ? `(${f(x)})` : f(x));
  const VAR_E = { q: { nombre: 'carga', color: 'o' }, r: { nombre: 'distancia', color: 'i' }, U: { nombre: 'energía de un par', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };

  // ---- energia: suma de k·qi·qj/rij sobre todos los pares, en mJ (q en µC, r en m) ----
  const Upar = (qa, qb, r) => 9 * qa * qb / r; // 9 × 10⁹ · 10⁻¹² · 10³ = 9
  const QS = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
  function energia(rng, semilla, sub) {
    let nombres, q, pares, desc;
    if (sub === 'linea') {
      const a = rng.elegir([10, 20, 30]), b = rng.elegir([10, 20, 30]);
      nombres = ['A', 'B', 'C']; q = [rng.elegir(QS), rng.elegir(QS), rng.elegir(QS)];
      pares = [[0, 1, a], [1, 2, b], [0, 2, a + b]];
      desc = ['Tres cargas puntuales están sobre una recta, en este orden: ', v('q', `qA = ${uc(q[0])}`), ', ', v('q', `qB = ${uc(q[1])}`), ' y ', v('q', `qC = ${uc(q[2])}`),
        '. A y B están separadas ', v('r', `${a} cm`), ', y B y C, ', v('r', `${b} cm`), '.'];
    } else if (sub === 'triangulo') {
      nombres = ['A', 'B', 'C']; q = [rng.elegir(QS), rng.elegir(QS), rng.elegir(QS)];
      if (rng.moneda()) {
        pares = [[0, 1, 30], [1, 2, 40], [0, 2, 50]];
        desc = ['Tres cargas puntuales están en los vértices de un triángulo rectángulo ABC, recto en B, con ', v('r', 'AB = 30 cm'), ' y ', v('r', 'BC = 40 cm'), ': ',
          v('q', `qA = ${uc(q[0])}`), ', ', v('q', `qB = ${uc(q[1])}`), ' y ', v('q', `qC = ${uc(q[2])}`), '.'];
      } else {
        const l = rng.elegir([10, 20, 30, 60]);
        pares = [[0, 1, l], [1, 2, l], [0, 2, l]];
        desc = ['Tres cargas puntuales están en los vértices de un triángulo equilátero de ', v('r', `${l} cm`), ' de lado: ',
          v('q', `qA = ${uc(q[0])}`), ', ', v('q', `qB = ${uc(q[1])}`), ' y ', v('q', `qC = ${uc(q[2])}`), '.'];
      }
    } else {
      nombres = ['A', 'B', 'C', 'D']; q = [rng.elegir(QS), rng.elegir(QS), rng.elegir(QS), rng.elegir(QS)];
      pares = [[0, 1, 30], [1, 2, 40], [2, 3, 30], [3, 0, 40], [0, 2, 50], [1, 3, 50]];
      desc = ['Cuatro cargas puntuales están en los vértices de un rectángulo ABCD, con ', v('r', 'AB = CD = 30 cm'), ' y ', v('r', 'BC = DA = 40 cm'), ': ',
        v('q', `qA = ${uc(q[0])}`), ', ', v('q', `qB = ${uc(q[1])}`), ', ', v('q', `qC = ${uc(q[2])}`), ' y ', v('q', `qD = ${uc(q[3])}`), '.'];
    }
    if (q.every(x => x > 0) || q.every(x => x < 0)) return null; // con signos mezclados la trampa del signo tiene sentido
    const us = pares.map(([i, j, r]) => Upar(q[i], q[j], r / 100));
    const correcta = us.reduce((a, b) => a + b, 0);
    if (Math.abs(correcta) < 1 || !limpio(correcta, 1)) return null;
    const suma = fn => pares.reduce((a, p, k) => a + fn(p, k), 0);
    const errores = [
      h('CS-pares-dos-veces', 2 * correcta, 'Contaste cada par dos veces (A con B y B con A). La energía del sistema es la suma sobre los pares distintos, cada uno una sola vez.'),
      h('CS-sin-signo', suma(([i, j, r]) => Math.abs(Upar(q[i], q[j], r / 100))), 'Sumaste las energías de los pares sin su signo. Un par de cargas de signos opuestos tiene energía negativa: resta.'),
      h('CS-inverso-cuadrado', suma(([i, j, r]) => Upar(q[i], q[j], r / 100) / (r / 100)), 'Usaste 1/r², como en la fuerza. La energía potencial de un par es k·q1·q2/r, con r sin elevar al cuadrado.'),
      tr('U2-cm', correcta * 100, 'Dejaste las distancias en centímetros. Con k en unidades del SI, r va en metros.'),
    ];
    if (sub === 'linea') errores.splice(1, 0,
      h('CS-olvida-extremos', us[0] + us[1], 'Olvidaste el par de los extremos, A con C. Aunque B esté en medio, A y C también interactúan.'),
      h('CS-distancia-extremos', us[0] + us[1] + Upar(q[0], q[2], pares[0][2] / 100), `Para el par A–C usaste la distancia entre vecinas. A y C están a ${pares[2][2]} cm.`));
    if (sub === 'rectangulo') errores.splice(1, 0,
      h('CS-olvida-diagonales', us.slice(0, 4).reduce((a, b) => a + b, 0), 'Olvidaste los dos pares de las diagonales (A–C y B–D). Con cuatro cargas hay seis pares.'));
    const solucion = [
      [`Con k = 9 × 10⁹, q en µC y r en m, cada par da k·qi·qj/r = 9·qi·qj/r en mJ. ${pares.length === 6 ? 'Con cuatro cargas hay seis pares' : 'Con tres cargas hay tres pares'}, cada uno una sola vez:`],
      ...pares.map(([i, j, r], k) => [v('U', `U${nombres[i]}${nombres[j]}`), ` = 9 · ${par(q[i])} · ${par(q[j])}/${f(r / 100)} = `, v('U', `${f(us[k])} mJ`)]),
      [v('x', 'U'), ' = suma de los pares = ', v('x', `${f(correcta)} mJ`), '.'],
    ];
    return cerrar(rng, semilla, { negativos: true, ok: x => limpio(x, 2) && x !== 0, correcta, errores, texto: x => `${f(x)} mJ`, unidad: 'mJ', variables: VAR_E,
      enunciado: desc, pregunta: ['¿Cuál es la ', v('x', 'energía potencial eléctrica del sistema'), '? (Usa k = 9 × 10⁹ N·m²/C²; puede salir negativa.)'], solucion,
      datos: { tipo: 'energia', sub, q, pares } });
  }

  // ---- energia/razon-nula: q en 0, Q en a, m·q en a + b ----
  function razonNula(rng, semilla) {
    const a = rng.elegir([1, 1, 2, 3]), b = rng.elegir([1, 1, 2, 3]), m = rng.elegir([1, 1, 2, 3, 4]);
    const d = rng.elegir([10, 20, 30]);
    // q·Q/a + Q·m·q/b + m·q²/(a + b) = 0  →  Q/q = −m/(a + b) ÷ (1/a + m/b)
    const correcta = -(m / (a + b)) / (1 / a + m / b);
    const enunciado = ['Tres cargas puntuales están sobre una recta: ', v('q', 'q'), ' en el punto A, ', v('x', 'Q'), ' en el punto B y ', v('q', m === 1 ? 'q' : `${m}q`), ' en el punto C, con q > 0. ',
      v('r', `AB = ${a * d} cm`), ' y ', v('r', `BC = ${b * d} cm`), '.'];
    const pregunta = ['¿Cuánto debe valer la ', v('x', 'razón Q/q'), ' para que la energía potencial eléctrica del sistema sea cero?'];
    const errores = [
      h('CS-distancia-extremos', -(m / a) / (1 / a + m / b), `Para el par de los extremos usaste ${a * d} cm, la distancia entre vecinas. A y C están a ${(a + b) * d} cm.`),
      h('CS-inverso-cuadrado', -(m / (a + b) ** 2) / (1 / a ** 2 + m / b ** 2), 'Usaste 1/r², como en la fuerza. La energía de cada par es k·q1·q2/r.'),
      h('CS-sin-signo', -correcta, 'Te salió Q del mismo signo que q. Si las tres fueran positivas, todos los pares tendrían energía positiva y la suma no podría ser cero: Q tiene que ser negativa.'),
      h('CS-olvida-extremos', 0, 'Sin el par de los extremos, la cuenta da Q = 0. Pero con Q = 0 queda la energía de q con la carga en C, que no es cero: el par A–C también cuenta.'),
    ];
    const tq = m === 1 ? 'q' : `${m}q`;
    const sobre = n => (n === 1 ? '' : '/' + n);
    const solucion = [
      ['Pares: A–B a ', v('r', `${a * d} cm`), ', B–C a ', v('r', `${b * d} cm`), ' y A–C a ', v('r', `${(a + b) * d} cm`), '. La suma de k·qi·qj/r debe ser cero (k se simplifica y se puede medir en unidades de 10 cm):'],
      [`q·Q${sobre(a)} + Q·${tq}${sobre(b)} + q·${tq}/${a + b} = 0  →  Q·q·(1${sobre(a)} + ${m}${sobre(b)}) = −q·${tq}/${a + b}.`, ' Se divide entre q² y se despeja Q/q.'],
      [v('x', `Q/q = ${exacto(correcta)}`), '.'],
    ];
    return cerrar(rng, semilla, { negativos: true, ok: x => Number.isFinite(x), correcta, errores, texto: exacto, unidad: '', variables: VAR_E, enunciado, pregunta, solucion,
      datos: { tipo: 'energia', sub: 'razon-nula', a, b, m } });
  }

  // ---- grafica: V = k·q/r de una carga puntual, leída en un punto ----
  const VAR_G = { V: { nombre: 'potencial', color: 'i' }, r: { nombre: 'distancia', color: 'o' }, q: { nombre: 'carga o campo', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  function grafica(rng, semilla, sub) {
    const q = rng.elegir([1, 2, 3, 4, 5, 6, 8, 10, 12]); // nC, positiva
    const r1 = rng.elegir([0.1, 0.2, 0.3, 0.5, 0.6, 0.9, 1, 1.5, 2, 3]);
    const V1 = 9 * q / r1; // 9 × 10⁹ · 10⁻⁹ = 9
    if (!limpio(V1, 1)) return null;
    const fac = rng.elegir([2, 3, 4, 1 / 2, 1 / 3, 3 / 2, 2 / 3]);
    const r2 = r1 * fac;
    if (!limpio(r2, 2)) return null;
    const V2 = V1 * r1 / r2, E2 = V2 / r2;
    const unaCurva = ['La gráfica muestra cómo cambia el potencial eléctrico ', v('V', 'V'), ' con la distancia ', v('r', 'r'), ' a una carga puntual positiva: una curva que baja. La curva pasa por el punto (',
      v('r', sub === 'carga' ? `${f(r1 * 100)} cm` : `${f(r1)} m`), '; ', v('V', `${f(V1)} V`), ').'];
    if (sub === 'v-otra') {
      if (!limpio(V2, 1)) return null;
      const errores = [
        h('CS-inverso-cuadrado', V1 * (r1 / r2) ** 2, 'Hiciste el potencial inverso al cuadrado de la distancia, como el campo. El potencial de una carga puntual es V = kq/r: inverso a r, sin cuadrado.'),
        tr('PR4-potencial', V1 * r2 / r1, `Hiciste el potencial directamente proporcional a la distancia. La curva baja: al ${r2 > r1 ? 'alejarse' : 'acercarse'}, el potencial ${r2 > r1 ? 'baja' : 'sube'}, en la razón inversa de las distancias.`),
        h('CS-e-por-v', E2, 'Calculaste el campo, E = V/r, no el potencial. Con la gráfica V–r, el potencial en otro punto sale de V·r = constante.'),
        h('CS-v-lineal', V1 - (V1 / r1) * (r2 - r1), 'Supusiste que la gráfica es una recta con pendiente V1/r1. Es una curva: V·r se mantiene constante.'),
      ];
      const solucion = [
        ['Para una carga puntual, V = kq/r: el producto V·r no cambia. En el punto leído, ', v('V', 'V1'), '·', v('r', 'r1'), ` = ${f(V1)} · ${f(r1)} = ${f(V1 * r1)} V·m.`],
        [v('x', `V2 = ${f(V1 * r1)}/${f(r2)} = ${f(V2)} V`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: V2, errores, texto: x => `${f(x)} V`, unidad: 'V', variables: VAR_G, enunciado: unaCurva,
        pregunta: ['¿Cuál es el ', v('x', 'potencial'), ` a ${f(r2)} m de la carga?`], solucion, datos: { tipo: 'grafica', sub, r1, v1: V1, r2 } });
    }
    if (sub === 'e-otra') {
      if (!limpio(E2, 2)) return null;
      const errores = [
        h('CS-e-por-v', V2, 'Ese es el potencial en ese punto, en V, no el campo. Para una carga puntual, E = kq/r² = V/r.'),
        h('CS-e-en-el-punto', V1 / r1, `Ese es el campo en el punto leído (${f(r1)} m), no a ${f(r2)} m.`),
        h('CS-e-como-1-sobre-r', V1 / r1 * (r1 / r2), 'Hiciste el campo inverso a la distancia, como el potencial. El campo de una carga puntual es inverso al cuadrado: E = kq/r².'),
        h('CS-inverso-cuadrado', V1 * (r1 / r2) ** 2 / r2, 'Hiciste el potencial inverso al cuadrado de la distancia antes de dividir entre r. El potencial va con 1/r; el campo, con 1/r².'),
      ];
      const solucion = [
        ['Del punto leído: ', v('q', 'kq'), ` = V1·r1 = ${f(V1)} · ${f(r1)} = ${f(V1 * r1)} V·m.`],
        ['A ', v('r', `${f(r2)} m`), ': ', v('x', `E = kq/r² = ${f(V1 * r1)}/${f(r2)}² = ${f(E2)} N/C`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: E2, errores, texto: x => `${f(x)} N/C`, unidad: 'N/C', variables: VAR_G, enunciado: unaCurva,
        pregunta: ['¿Cuánto vale el ', v('x', 'campo eléctrico'), ` a ${f(r2)} m de la carga?`], solucion, datos: { tipo: 'grafica', sub, r1, v1: V1, r2 } });
    }
    const errores = [
      h('CS-inverso-cuadrado', V1 * r1 * r1 / 9, 'Usaste V = kq/r², la forma del campo. El potencial es V = kq/r: q = V·r/k.'),
      tr('PR4-potencial', V1 / (9 * r1), 'Despejaste al revés: de V = kq/r sale q = V·r/k, no V/(k·r).'),
      h('CS-sin-r', V1 / 9, 'Olvidaste multiplicar por la distancia: de V = kq/r sale q = V·r/k.'),
      tr('U2-cm', q * 100, `Dejaste la distancia en centímetros. ${f(r1 * 100)} cm = ${f(r1)} m.`),
    ];
    const solucion = [
      ['Se pasa a metros: ', v('r', `r = ${f(r1)} m`), '. De V = kq/r: ', v('x', 'q'), ` = V·r/k = ${f(V1)} · ${f(r1)}/(9 × 10⁹) = `, v('x', `${f(q)} × 10⁻⁹ C = ${f(q)} nC`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: q, errores, texto: x => `${f(x)} nC`, unidad: 'nC', variables: VAR_G, enunciado: unaCurva,
      pregunta: ['¿Cuál es el valor de la ', v('x', 'carga'), '? (Usa k = 9 × 10⁹ N·m²/C².)'], solucion, datos: { tipo: 'grafica', sub, r1, v1: V1 } });
  }

  // ---- campo: superposición de campos, en múltiplos de B = k·q/a² ----
  const VAR_C = { q: { nombre: 'carga', color: 'o' }, r: { nombre: 'distancia', color: 'i' }, E: { nombre: 'campo de una carga', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  const R2 = Math.SQRT2, R3 = Math.sqrt(3), R6 = Math.sqrt(6);
  // Cada configuración: factor de la respuesta y de cada error, en unidades de B = k·q/a².
  const CONFIG = {
    'tri-iguales': { sub: 'triangulo', correcta: R3, errores: [['CS-suma-modulos', 2], ['CS-como-perpendiculares', R2], ['CS-signo-direccion', 1]] },
    'tri-opuestas': { sub: 'triangulo', correcta: 1, errores: [['CS-suma-modulos', 2], ['CS-signo-direccion', R3], ['CS-como-perpendiculares', R2], ['CS-todo-se-anula', 0]] },
    'cuad-adyacentes': { sub: 'cuadrado', correcta: 4 * R2, errores: [['CS-suma-modulos', 8], ['CS-todo-se-anula', 0], ['CS-distancia-lado', 2 * R2]] },
    'cuad-tres': { sub: 'cuadrado', correcta: 4, errores: [['CS-suma-modulos', 8], ['CS-sin-signo', 0], ['CS-distancia-lado', 2], ['CS-como-perpendiculares', 4 * R2]] },
    'cubo-iguales': { sub: 'cubo', correcta: 8 * R6 / 9, errores: [['CS-suma-modulos', 8 / 3], ['CS-distancia-arista', 4 * R6 / 3], ['CS-todo-se-anula', 0], ['CS-distancia-diagonal-cara', 2 * R6 / 3]] },
    'cubo-mixtas': { sub: 'cubo', correcta: 4 * R6 / 9, errores: [['CS-suma-modulos', 8 / 3], ['CS-todo-se-anula', 0], ['CS-sin-signo', 8 * R6 / 9], ['CS-distancia-arista', 2 * R6 / 3]] },
  };
  const EXPL = {
    'CS-suma-modulos': 'Sumaste los módulos de los campos como números, sin mirar sus direcciones. Los campos son flechas: se descomponen y las componentes que se oponen se cancelan.',
    'CS-como-perpendiculares': 'Sumaste los campos como si fueran perpendiculares (con Pitágoras). Hay que usar el ángulo real entre las flechas.',
    'CS-signo-direccion': 'Te equivocaste en el sentido de un campo. El campo de una carga positiva apunta alejándose de ella; el de una negativa, hacia ella.',
    'CS-todo-se-anula': 'Supusiste que todo se anula por simetría. Solo se cancelan las componentes que de verdad se oponen; aquí queda una componente que se suma.',
    'CS-sin-signo': 'Trataste todas las cargas como positivas. El campo de una carga negativa apunta hacia ella, así que cambia el resultado.',
    'CS-distancia-lado': 'Usaste el lado del cuadrado como distancia de cada carga al centro. El centro está a media diagonal: r = a/√2, así que r² = a²/2.',
    'CS-distancia-arista': 'Usaste la arista como distancia de cada carga al centro de la cara opuesta. Esa distancia es √(a²/2 + a²): r² = 3a²/2.',
    'CS-distancia-diagonal-cara': 'Usaste la diagonal de una cara como distancia. Desde un vértice de una cara hasta el centro de la cara opuesta, r² = a²/2 + a² = 3a²/2.',
  };
  function campo(rng, semilla, sub) {
    const ids = Object.keys(CONFIG).filter(k => CONFIG[k].sub === sub);
    const id = rng.elegir(ids), C = CONFIG[id];
    const [q, acm] = rng.elegir([[1, 30], [2, 30], [3, 30], [4, 30], [5, 30], [6, 30], [1, 10], [2, 10], [3, 10], [4, 20], [4, 60], [9, 90]]);
    const a = acm / 100;
    const B = 9e9 * q * 1e-6 / (a * a); // N/C
    const m = B / 1e5;
    if (!limpio(m, 6)) return null;
    const correcta = C.correcta * m;
    const texto = x => (Math.abs(x) < 1e-12 ? '0 N/C' : `${exacto(x)} × 10⁵ N/C`);
    const Bt = `${exacto(m)} × 10⁵ N/C`;
    let enunciado, solucion;
    const Q = v('q', `${q} µC`), A = v('r', `${acm} cm`);
    if (id === 'tri-iguales' || id === 'tri-opuestas') {
      enunciado = ['En dos vértices, A y B, de un triángulo equilátero de ', A, ' de lado hay dos cargas puntuales: ', v('q', `+${q} µC`), ' en A y ',
        v('q', id === 'tri-iguales' ? `+${q} µC` : `−${q} µC`), ' en B.'];
      solucion = [
        ['Cada carga está a un lado del tercer vértice C: ', v('E', `E = kq/a² = 9 × 10⁹ · ${q} × 10⁻⁶/${f(a)}² = ${Bt}`), ' (las dos iguales).'],
        id === 'tri-iguales'
          ? ['Los dos campos se alejan de A y de B: forman 60° entre sí. La resultante: ', v('x', `E·√(1 + 1 + 2·cos 60°) = √3·E = ${texto(correcta)}`), '.']
          : ['El de A se aleja de A y el de B apunta hacia B: forman 120° entre sí, y dos flechas iguales a 120° dan una resultante del mismo largo que cada una: ', v('x', `E·√(1 + 1 + 2·cos 120°) = E = ${texto(correcta)}`), ', paralela a AB.'],
      ];
    } else if (sub === 'cuadrado') {
      const cargas = id === 'cuad-adyacentes' ? `+${q} µC en A y B, y −${q} µC en C y D` : `+${q} µC en A, B y C, y −${q} µC en D`;
      enunciado = ['En los vértices de un cuadrado ABCD de ', A, ' de lado hay cuatro cargas puntuales de igual valor: ', v('q', cargas), '.'];
      solucion = [
        ['Cada carga está a media diagonal del centro: r² = a²/2. Cada campo vale ', v('E', `E = kq/r² = 2kq/a² = ${texto(2 * m)}`), '.'],
        id === 'cuad-adyacentes'
          ? ['A (+) y C (−) son opuestos: sus campos apuntan los dos de A hacia C y se suman, 2E. Lo mismo B (+) y D (−): 2E de B hacia D. Esas dos diagonales son perpendiculares: ', v('x', `√((2E)² + (2E)²) = 2√2·E = ${texto(correcta)}`), '.']
          : ['A y C son positivas y opuestas: sus campos se cancelan. B (+) y D (−): los dos campos apuntan de B hacia D y se suman: ', v('x', `2E = ${texto(correcta)}`), '.'],
      ];
    } else {
      const cargas = id === 'cubo-iguales' ? `+${q} µC en cada uno` : `+${q} µC en los dos extremos de una arista y −${q} µC en los otros dos`;
      enunciado = ['Un cubo tiene ', A, ' de arista. En los cuatro vértices de su cara de arriba hay cargas puntuales: ', v('q', cargas), '. Nos interesa el punto P, el centro de la cara de abajo.'];
      solucion = [
        ['Cada carga está a ', v('r', 'r² = a²/2 + a² = 3a²/2'), ' de P. Cada campo vale ', v('E', `E = kq/r² = (2/3)·kq/a² = ${texto(2 * m / 3)}`), '.'],
        ['Cada flecha tiene una componente vertical (cos = a/r = √(2/3)) y otra horizontal hacia o desde el pie de la carga (de largo (a/√2)/r = 1/√3 de E).'],
        id === 'cubo-iguales'
          ? ['Las cuatro horizontales se cancelan de dos en dos. Las verticales se suman: ', v('x', `4·E·√(2/3) = (8√6/9)·kq/a² = ${texto(correcta)}`), ', hacia abajo.']
          : ['Las verticales se cancelan (dos van hacia abajo y dos hacia arriba). De las horizontales, se cancela la parte paralela a la arista y se suma la otra, 1/√6 de E cada una: ', v('x', `4·E/√6 = (4√6/9)·kq/a² = ${texto(correcta)}`), '.'],
      ];
    }
    const pregunta = ['¿Cuál es el módulo del ', v('x', 'campo eléctrico resultante'), sub === 'triangulo' ? ' en el tercer vértice, C?' : sub === 'cuadrado' ? ' en el centro del cuadrado?' : ' en P?', ' (k = 9 × 10⁹ N·m²/C².)'];
    const errores = C.errores.map(([cod, fac]) => h(cod, fac * m, EXPL[cod]));
    return cerrar(rng, semilla, { negativos: true, ok: x => Number.isFinite(x) && x >= 0, correcta, errores, texto, unidad: '× 10⁵ N/C', variables: VAR_C, enunciado, pregunta, solucion,
      datos: { tipo: 'campo', sub, config: id, q, a } });
  }

  return { id: 'cargas-sistema', titulo: 'Tres cargas en el plano', generar };
});
