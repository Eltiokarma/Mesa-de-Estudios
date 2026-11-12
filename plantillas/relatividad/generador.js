/*
 * Generador «El reloj que viaja»: relatividad especial, principio de incertidumbre y la esfera que
 * se carga por efecto fotoeléctrico (física moderna de la admisión de San Marcos).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['relatividad']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   tiempo       dilatación del tiempo, Δt = γ·Δt₀. Sub: hora (la nave marca un intervalo; ¿qué
 *                hora es en la estación?), propio (la Tierra mide un intervalo; ¿cuánto marca el
 *                reloj de la nave?) y rapidez (la vida media de un muon crece en una razón dada:
 *                ¿a qué rapidez va?).
 *   longitud     contracción de la longitud, L = L₀/γ. Sub: observada y propia.
 *   energia      Sub: cinetica (K = (γ − 1)·m·c², en joules), total (E = γ·m·c²), razon (energía
 *                cinética clásica entre la relativista) e igual (¿a qué rapidez la energía cinética
 *                es k veces la energía en reposo?).
 *   incertidumbre Δx·Δp ≥ h/4π. Sub: posicion (bala con la rapidez medida con una incertidumbre en %)
 *                y momento (electrón encerrado en una región).
 *   esfera       esfera metálica aislada que se ilumina: suelta electrones hasta que su potencial
 *                frena a los más rápidos, V = Kmax/e = (E_fotón − φ)/e. Sub: potencial y carga
 *                (Q = 4πε₀·R·V = R·V/k).
 *
 * Convenciones: c = 3 × 10⁸ m/s; γ = 1/√(1 − v²/c²) con v = 0,6c (γ = 5/4), 0,8c (γ = 5/3), etc.;
 * h = 6,63 × 10⁻³⁴ J·s; k = 9 × 10⁹ N·m²/C²; hc = 1240 eV·nm. Las respuestas en notación científica
 * llevan dos o tres cifras significativas.
 * Errores: los de relatividad (REL-*) son hipótesis nuevas, de la trampa 33 de
 * docs/clasificacion/trampas-admision-unmsm/fisica.md (γ invertido, cinética clásica, energía total en
 * vez de cinética); los de incertidumbre (HE-*), de la fila del CSV de admisión (momento total en vez de
 * su incertidumbre), hipótesis; los de la esfera, la trampa 3 (FM-kmax-sin-restar-phi, hipótesis, el
 * mismo código que la escena de física moderna); U2, U4, PR2, PR3 y PR6 de
 * docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md (hipótesis).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const TRAMPAS = 'docs/clasificacion/trampas-admision-unmsm/fisica.md';
  const TRANS = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = TRAMPAS) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const f4 = x => P.formatear(x, 4);
  const mcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };

  // Número exacto: fracción p/q (q ≤ qmax) o radical a√b/q; si no sale limpio, null.
  function exacto(x, qmax = 30) {
    if (!(x > 0)) return null;
    for (let q = 1; q <= qmax; q++) { const p = x * q, r = Math.round(p); if (r > 0 && Math.abs(p - r) < 1e-9 * Math.max(1, r)) return q === 1 ? String(r) : `${r}/${q}`; }
    for (let q = 1; q <= qmax; q++) {
      const M = Math.round((x * q) ** 2);
      if (M > 0 && Math.abs((x * q) ** 2 - M) < 1e-7 * Math.max(1, M)) {
        let a = 1, b = M;
        for (let k = 2; k * k <= b; k++) while (b % (k * k) === 0) { b /= k * k; a *= k; }
        if (b === 1) continue;
        const g = mcd(a, q), A = a / g, Q = q / g;
        return (A === 1 ? '' : A) + '√' + b + (Q === 1 ? '' : '/' + Q);
      }
    }
    return null;
  }
  const corto = (x, dec = 2) => Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-7;
  // Una rapidez como múltiplo de c: «0,6c», «(5/13)c», «(√3/2)c».
  const cTxt = b => (corto(b) ? `${f(b)}c` : exacto(b) ? `(${exacto(b)})c` : null);
  // Número limpio: decimal corto o fracción.
  const num = x => (corto(x, 4) ? P.formatear(x, 4) : exacto(x, 200) || P.formatear(x, 4));
  const pg = x => (num(x).includes('/') ? `(${num(x)})` : num(x)); // entre paréntesis si es fracción
  // Notación científica con «sig» cifras significativas: «3,3 × 10⁻²⁵».
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function partes(x, sig) {
    let e = Math.floor(Math.log10(Math.abs(x)));
    let m = Number((x / 10 ** e).toFixed(sig - 1));
    if (m >= 10) { m /= 10; e += 1; }
    return [m, e];
  }
  function sci(x, sig = 2) {
    const [m, e] = partes(x, sig);
    if (e === 0) return P.formatear(m, sig - 1);
    return `${P.formatear(m, sig - 1)} × 10${String(e).split('').map(c => SUP[c]).join('')}`;
  }
  // Mantisa lejos del borde de redondeo (así un cálculo por otro camino da el mismo texto).
  function seguro(x, sig = 2) {
    const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e * 10 ** (sig - 1);
    return Math.abs(m - Math.floor(m) - 0.5) > 0.03;
  }

  // Rapideces con γ exacto: [β, γ].
  const RAP = [[0.6, 5 / 4], [0.8, 5 / 3], [0.28, 25 / 24], [0.96, 25 / 7], [5 / 13, 13 / 12], [12 / 13, 13 / 5], [Math.sqrt(3) / 2, 2], [2 * Math.SQRT2 / 3, 3]];
  const VAR = {
    v: { nombre: 'rapidez', color: 'o' },
    g: { nombre: 'factor de Lorentz γ', color: 'h' },
    d: { nombre: 'dato en reposo', color: 'i' },
    x: { nombre: 'lo que se pide', color: 'd' },
  };
  const gamSeg = (b, g) => [v('g', 'γ'), ' = 1/√(1 − v²/c²) = 1/√(1 − ', `${num(b * b)}`, ') = ', v('g', num(g))];

  function cerrar(rng, semilla, o) {
    // Sin distractores absurdos: cada uno entre 1/20 y 20 veces la correcta (en la hora, el intervalo desde el cruce).
    const base = o.base || 0, cerca20 = (x, id) => { const q = (x - base) / (o.correcta - base); return q > 0 && P.enEscala(q, 1, id); };
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && cerca20(e.valor, e.id) && (!o.filtro || o.filtro(e.valor))), rng, texto: o.texto });
    if (alternativas.length < 4) return null;
    return {
      id: `relatividad#${semilla}`, variables: o.variables || VAR, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, texto: o.texto(o.correcta), unidad: o.unidad || '' }, _datos: o.datos,
    };
  }

  function generar(semilla) {
    const rng = Azar.crear('relatividad|' + semilla);
    const [tipo, sub] = rng.elegir([['tiempo', 'hora'], ['tiempo', 'hora'], ['tiempo', 'propio'], ['tiempo', 'rapidez'], ['tiempo', 'rapidez'], ['longitud', 'observada'], ['longitud', 'propia'],
      ['energia', 'cinetica'], ['energia', 'cinetica'], ['energia', 'total'], ['energia', 'razon'], ['energia', 'razon'], ['energia', 'igual'],
      ['incertidumbre', 'posicion'], ['incertidumbre', 'posicion'], ['incertidumbre', 'momento'], ['esfera', 'carga'], ['esfera', 'carga'], ['esfera', 'potencial']]);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'tiempo') return sub === 'rapidez' ? muon(rng, semilla) : tiempo(rng, semilla, sub);
    if (tipo === 'longitud') return longitud(rng, semilla, sub);
    if (tipo === 'energia') return sub === 'razon' ? razon(rng, semilla) : sub === 'igual' ? igual(rng, semilla) : energia(rng, semilla, sub);
    if (tipo === 'incertidumbre') return incertidumbre(rng, semilla, sub);
    return esfera(rng, semilla, sub);
  }

  // ---- tiempo: hora en la estación, o lo que marca la nave ----
  const hora = min => { const m = ((Math.round(min) % 1440) + 1440) % 1440; return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')} h`; };
  function tiempo(rng, semilla, sub) {
    const [b, g] = rng.elegir(RAP.slice(0, 6));
    if (sub === 'hora') {
      const inicio = rng.elegir([6, 7, 8, 9, 10, 13, 14]) * 60;
      const dt0 = rng.elegir([1, 1.5, 2, 2.4, 3, 4, 4.8, 5, 6, 7.2, 12, 13, 24]) * 60; // minutos que marca la nave
      const dt = g * dt0;
      if (!Number.isInteger(Math.round(dt * 1e6) / 1e6) || inicio + dt >= 1440) return null;
      const correcta = inicio + dt;
      const enunciado = ['Una nave pasa junto a una estación espacial a ', v('v', cTxt(b)), `. Cuando se cruzan, los dos relojes marcan las ${hora(inicio)}. Más tarde, el reloj de la nave marca que pasaron `, v('d', `${f(dt0 / 60)} h`), ' desde el cruce.'];
      const pregunta = ['En ese instante, según los observadores de la estación, ¿', v('x', 'qué hora marca el reloj de la estación'), '?'];
      const errores = [
        h('REL-divide-entre-gamma', inicio + dt0 / g, `Calculaste Δt₀/γ = ${f(dt0 / 60)} h / ${num(g)} y lo sumaste a la hora del cruce. El intervalo más corto es el del reloj que viaja (el tiempo propio): en la estación pasa más tiempo, Δt = γ·Δt₀ = ${num(g)} · ${f(dt0 / 60)} h.`),
        h('REL-tiempo-absoluto', inicio + dt0, 'Supusiste que en los dos relojes pasa el mismo tiempo. A esa rapidez, para la estación el reloj de la nave va lento: en la estación pasa γ veces más.'),
        h('REL-solo-el-adelanto', inicio + (g - 1) * dt0, `Sumaste solo la diferencia entre los dos relojes, (γ − 1)·Δt₀. A la hora del cruce hay que sumarle todo el intervalo de la estación, γ·Δt₀.`),
        h('PR2-sin-raiz', inicio + dt0 / (1 - b * b), 'Olvidaste la raíz del factor de Lorentz: γ = 1/√(1 − v²/c²), no 1/(1 − v²/c²).', TRANS),
        h('REL-suma-lineal', inicio + dt0 * (1 + b), `Calculaste Δt₀·(1 + v/c), como si el atraso creciera en línea recta con la rapidez. El factor es γ = 1/√(1 − v²/c²) = ${num(g)}.`),
      ];
      const solucion = [
        [...gamSeg(b, g), '.'],
        ['El reloj de la nave mide el tiempo propio: ', v('d', `Δt₀ = ${f(dt0 / 60)} h`), '. En la estación pasa más: Δt = ', v('g', 'γ'), '·', v('d', 'Δt₀'), ` = ${num(g)} · ${f(dt0 / 60)} h = ${f(dt / 60)} h (${f(dt)} min).`],
        [`${hora(inicio)} + ${f(dt)} min = `, v('x', hora(correcta)), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: hora, variables: VAR, enunciado, pregunta, solucion,
        base: inicio, filtro: x => Number.isInteger(Math.round(x * 1e6) / 1e6) && x < 1440, // el mismo día
        datos: { tipo: 'tiempo', sub, beta: b, inicio, dt0 } });
    }
    // propio: la Tierra mide Δt; la nave marca Δt₀ = Δt/γ
    const dtT = rng.elegir([5, 10, 12, 13, 15, 20, 24, 25, 26, 30, 50]);
    const correcta = dtT / g;
    if (!corto(correcta)) return null;
    const enunciado = ['Una astronauta viaja a una estrella lejana a ', v('v', cTxt(b)), ' respecto a la Tierra. Según los relojes de la Tierra, el viaje dura ', v('d', `${f(dtT)} años`), '.'];
    const pregunta = ['¿', v('x', 'Cuánto dura el viaje según el reloj de la astronauta'), '?'];
    const errores = [
      h('REL-multiplica-por-gamma', dtT * g, `Calculaste Δt·γ = ${f(dtT)} · ${num(g)}. El reloj que viaja con la astronauta mide el tiempo propio, el más corto: Δt₀ = Δt/γ.`),
      h('REL-tiempo-absoluto', dtT, 'Supusiste que el tiempo es el mismo para la astronauta y para la Tierra. A esa rapidez, su reloj marca menos.'),
      h('REL-por-beta', dtT * b, 'Multiplicaste por v/c. El tiempo propio es Δt·√(1 − v²/c²) = Δt/γ, no Δt·v/c.'),
      h('PR2-sin-raiz', dtT * (1 - b * b), 'Olvidaste la raíz: Δt₀ = Δt·√(1 − v²/c²).', TRANS),
      h('REL-lo-que-se-atrasa', dtT - dtT / g, 'Eso es cuánto se atrasa el reloj de la astronauta, Δt − Δt/γ. Lo que marca su reloj es Δt₀ = Δt/γ.'),
    ];
    const solucion = [
      [...gamSeg(b, g), '.'],
      ['El reloj de la astronauta mide el tiempo propio: ', v('x', 'Δt₀'), ' = Δt/', v('g', 'γ'), ` = ${f(dtT)}/${pg(g)} = `, v('x', `${f(correcta)} años`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} años`, filtro: corto, unidad: 'años', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'tiempo', sub, beta: b, dt: dtT } });
  }

  // ---- tiempo/rapidez: el muon que vive más ----
  function muon(rng, semilla) {
    const [b, g] = rng.elegir(RAP.filter(([bb]) => bb >= 0.6)); // «muy rápido»: desde 0,6c
    const tau = rng.elegir([2, 2.2, 1.5, 3]);
    const obs = tau * g;
    const conRazon = rng.moneda() || !corto(obs);
    const enunciado = conRazon
      ? ['Un muon que viaja muy rápido hacia la Tierra vive, según un observador en tierra, ', v('g', num(g)), ' veces lo que vive un muon en reposo.']
      : ['La vida media de un muon en reposo es ', v('d', `${f(tau)} µs`), '. Un muon que llega muy rápido a la Tierra vive, según un observador en tierra, ', v('g', `${f(obs)} µs`), '.'];
    const pregunta = ['¿Con qué ', v('x', 'rapidez'), ' viaja ese muon?'];
    const errores = [
      h('REL-v-c-sobre-gamma', 1 / g, 'Tomaste v = c/γ, como si la razón de tiempos fuera c/v. La razón de tiempos es γ = 1/√(1 − v²/c²): de ahí, v = c·√(1 − 1/γ²).'),
      h('REL-raiz-sin-cuadrado', Math.sqrt(1 - 1 / g), `Calculaste v/c = √(1 − 1/γ) = √(1 − 1/${pg(g)}), sin el cuadrado de γ. De 1/γ² = 1 − v²/c² sale v/c = √(1 − 1/γ²).`),
      h('REL-resta-lineal', 1 - 1 / g, 'Escribiste 1/γ = 1 − v/c, sin cuadrados ni raíz. El factor es γ = 1/√(1 − v²/c²).'),
      h('REL-gamma-menos-uno', g - 1, 'Tomaste γ − 1 como v/c. γ − 1 dice cuánto más vive el muon, no su rapidez.'),
      h('PR2-sin-raiz', 1 - 1 / (g * g), 'Te quedaste en v²/c² = 1 − 1/γ² y olvidaste sacar la raíz: v/c = √(1 − 1/γ²).', TRANS),
    ];
    const solucion = [
      conRazon ? ['La razón entre las vidas es el factor de Lorentz: ', v('g', `γ = ${num(g)}`), '.']
        : ['La razón entre las vidas es el factor de Lorentz: ', v('g', 'γ'), ` = ${f(obs)}/${f(tau)} = `, v('g', num(g)), '.'],
      ['1/γ² = 1 − v²/c², así que v²/c² = 1 − 1/γ² = 1 − ', `${num(1 / (g * g))} = ${num(b * b)}`, ' y ', v('x', `v = ${cTxt(b)}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: b, errores, texto: cTxt, filtro: x => x < 1 && cTxt(x) !== null, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'tiempo', sub: 'rapidez', gamma: g, ...(conRazon ? {} : { tau }) } });
  }

  // ---- longitud: L = L₀/γ ----
  function longitud(rng, semilla, sub) {
    const [b, g] = rng.elegir(RAP.slice(0, 6));
    const base = rng.elegir([10, 12, 20, 24, 25, 26, 30, 39, 40, 48, 50, 60, 65, 75, 100, 120]);
    const L0 = sub === 'observada' ? base : base;
    const correcta = sub === 'observada' ? L0 / g : L0 * g;
    if (!corto(correcta) || !corto(L0 / g) && sub === 'observada') return null;
    const nave = rng.elegir(['Una nave', 'Un cohete', 'Una sonda']);
    const enunciado = sub === 'observada'
      ? [`${nave} mide `, v('d', `${f(L0)} m`), ' de largo cuando está en reposo. Pasa junto a la Tierra a ', v('v', cTxt(b)), '.']
      : [`${nave} pasa junto a la Tierra a `, v('v', cTxt(b)), '. Desde la Tierra se mide que su largo, en la dirección en que se mueve, es ', v('d', `${f(L0)} m`), '.'];
    const pregunta = sub === 'observada'
      ? ['¿Qué ', v('x', 'largo le miden desde la Tierra'), '?']
      : ['¿Cuál es su ', v('x', 'largo en reposo'), '?'];
    const errores = sub === 'observada' ? [
      h('REL-multiplica-por-gamma', L0 * g, `Calculaste L₀·γ = ${f(L0)} · ${num(g)}. Un objeto en movimiento se ve más corto en la dirección en que se mueve: L = L₀/γ.`),
      h('REL-sin-contraccion', L0, 'Supusiste que el largo no depende del movimiento. A esa rapidez, desde la Tierra se mide más corto.'),
      h('REL-lo-que-se-acorta', L0 - L0 / g, 'Ese es cuánto se acorta, L₀ − L₀/γ. Se pide el largo que se mide: L₀/γ.'),
      h('PR2-sin-raiz', L0 * (1 - b * b), 'Olvidaste la raíz: L = L₀·√(1 − v²/c²).', TRANS),
      h('REL-por-beta', L0 * b, 'Multiplicaste por v/c. El largo es L₀·√(1 − v²/c²) = L₀/γ.'),
    ] : [
      h('REL-divide-entre-gamma', L0 / g, `Calculaste L/γ = ${f(L0)}/${pg(g)}. El largo que se mide desde la Tierra ya está acortado: el largo en reposo, el mayor, es L₀ = γ·L.`),
      h('REL-sin-contraccion', L0, 'Supusiste que el largo no depende del movimiento. El largo en reposo es mayor que el que se mide con la nave en movimiento.'),
      h('PR2-sin-raiz', L0 / (1 - b * b), 'Olvidaste la raíz: L₀ = L/√(1 − v²/c²).', TRANS),
      h('REL-suma-lineal', L0 * (1 + b), 'Sumaste L·v/c. La relación es L₀ = γ·L, con γ = 1/√(1 − v²/c²).'),
      h('REL-lo-que-se-acorta', L0 * (g - 1), 'Eso es cuánto más mide en reposo, γ·L − L. Se pide el largo en reposo: L₀ = γ·L.'),
    ];
    const solucion = [
      [...gamSeg(b, g), '.'],
      sub === 'observada'
        ? ['En movimiento se acorta en la dirección del viaje: ', v('x', 'L'), ' = ', v('d', 'L₀'), '/', v('g', 'γ'), ` = ${f(L0)}/${pg(g)} = `, v('x', `${f(correcta)} m`), '.']
        : ['El largo en reposo es el mayor: ', v('x', 'L₀'), ' = ', v('g', 'γ'), '·', v('d', 'L'), ` = ${num(g)} · ${f(L0)} = `, v('x', `${f(correcta)} m`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} m`, filtro: corto, unidad: 'm', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'longitud', sub, beta: b, l: L0 } });
  }

  // ---- energia: cinética o total, en joules ----
  function energia(rng, semilla, sub) {
    const [b, g] = rng.elegir([[0.6, 5 / 4], [0.8, 5 / 3], [Math.sqrt(3) / 2, 2], [0.96, 25 / 7], [12 / 13, 13 / 5]].filter(([, gg]) => sub !== 'cinetica' || gg !== 2)); // con γ = 2, K = E₀
    const ma = rng.elegir([1, 2, 3, 4, 5, 6, 8]), me = -rng.elegir([26, 27, 28]);
    const m = ma * 10 ** me, c2 = 9e16;
    const E0 = m * c2, K = (g - 1) * E0, E = g * E0, Kc = 0.5 * m * b * b * c2;
    const correcta = sub === 'cinetica' ? K : E;
    const [mm] = partes(correcta, 3);
    if (!corto(mm, 2)) return null; // mantisa con tres cifras a lo más, exacta
    const part = rng.elegir(m >= 1.67e-27 ? ['Una partícula', 'Un núcleo liviano'] : ['Una partícula', 'Una partícula subatómica']); // un núcleo pesa al menos lo que un protón
    const enunciado = [`${part} de masa `, v('d', `${sci(m, 1)} kg`), ' se mueve a ', v('v', cTxt(b)), '. Usa c = 3 × 10⁸ m/s.'];
    const pregunta = sub === 'cinetica' ? ['¿Cuál es su ', v('x', 'energía cinética'), '?'] : ['¿Cuál es su ', v('x', 'energía total'), '?'];
    const errores = sub === 'cinetica' ? [
      h('REL-K-clasica', Kc, 'Usaste la energía cinética clásica, ½·m·v². A esa rapidez ya no sirve: K = E − E₀ = (γ − 1)·m·c².'),
      h('REL-total-por-cinetica', E, 'Esa es la energía total, γ·m·c². La cinética es lo que se suma a la energía en reposo: K = (γ − 1)·m·c².'),
      h('REL-reposo', E0, 'Esa es la energía en reposo, m·c². La cinética es (γ − 1)·m·c².'),
      h('REL-uno-menos-inverso-de-gamma', (1 - 1 / g) * E0, `Calculaste (1 − 1/γ)·m·c² = (1 − 1/${pg(g)})·E₀, con 1/γ en lugar de γ. La cinética es (γ − 1)·m·c².`),
    ] : [
      h('REL-reposo', E0, 'Esa es la energía en reposo, m·c². Moviéndose, la energía total es γ·m·c².'),
      h('REL-total-por-cinetica', K, 'Esa es solo la energía cinética, (γ − 1)·m·c². La total suma la energía en reposo: E = γ·m·c².'),
      h('REL-K-clasica', E0 + Kc, 'Sumaste la energía en reposo y la cinética clásica, ½·m·v². A esa rapidez la cinética es (γ − 1)·m·c²: E = γ·m·c².'),
      h('REL-divide-entre-gamma', E0 / g, `Calculaste E₀/γ = m·c²/${pg(g)}. La energía total crece con la rapidez: E = γ·m·c².`),
    ];
    const solucion = [
      [...gamSeg(b, g), '.'],
      ['Energía en reposo: E₀ = ', v('d', 'm'), '·c² = ', `${sci(m, 1)} · 9 × 10¹⁶ = ${sci(E0, 3)} J.`],
      sub === 'cinetica'
        ? [v('x', 'K'), ' = E − E₀ = (', v('g', 'γ'), ` − 1)·E₀ = ${num(g - 1)} · ${sci(E0, 3)} = `, v('x', `${sci(K, 3)} J`), '.']
        : [v('x', 'E'), ' = ', v('g', 'γ'), `·E₀ = ${num(g)} · ${sci(E0, 3)} = `, v('x', `${sci(E, 3)} J`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => `${sci(x, 3)} J`, unidad: 'J', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'energia', sub, beta: b, m } });
  }

  // ---- energia/razon: cinética clásica entre relativista ----
  function razon(rng, semilla) {
    const [b, g] = rng.elegir([[0.6, 5 / 4], [0.8, 5 / 3], [Math.sqrt(3) / 2, 2], [2 * Math.SQRT2 / 3, 3]]);
    const correcta = 0.5 * b * b / (g - 1);
    const enunciado = ['Una partícula se mueve a ', v('v', cTxt(b)), '.'];
    const pregunta = ['¿Cuál es la ', v('x', 'razón entre su energía cinética calculada con la fórmula clásica y su energía cinética relativista'), ', K clásica / K relativista?'];
    const errores = [
      h('REL-total-por-cinetica', 0.5 * b * b / g, 'Dividiste entre la energía total, γ·m·c². La energía cinética relativista es (γ − 1)·m·c².'),
      h('REL-razon-invertida', (g - 1) / (0.5 * b * b), 'Dividiste al revés: la relativista entre la clásica. Se pide K clásica / K relativista, que sale menor que 1.'),
      h('PR3-sin-medio', b * b / (g - 1), 'Olvidaste el ½ de la energía cinética clásica, ½·m·v².', TRANS),
      h('REL-uno-menos-inverso-de-gamma', 0.5 * b * b / (1 - 1 / g), `Dividiste entre (1 − 1/γ) = 1 − 1/${pg(g)}, con 1/γ en lugar de γ. La cinética relativista es (γ − 1)·m·c².`),
      h('REL-iguales', 1, 'Supusiste que las dos fórmulas dan lo mismo. A esa rapidez la clásica se queda corta.'),
    ];
    const solucion = [
      [...gamSeg(b, g), '.'],
      ['K clásica = ½·m·v² = ½·', `${num(b * b)}·m·c² = ${num(0.5 * b * b)}·m·c². K relativista = (`, v('g', 'γ'), ` − 1)·m·c² = ${num(g - 1)}·m·c².`],
      ['Razón: ', `${pg(0.5 * b * b)}/${pg(g - 1)} = `, v('x', num(correcta)), '.'],
    ];
    const fr = x => exacto(x, 200) || num(x); // todas como fracción, el mismo formato
    return cerrar(rng, semilla, { correcta, errores, texto: fr, filtro: x => !!exacto(x, 200), variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'energia', sub: 'razon', beta: b } });
  }

  // ---- energia/igual: ¿a qué rapidez K = k·E₀? ----
  function igual(rng, semilla) {
    const [kk, b, g] = rng.elegir([[1, Math.sqrt(3) / 2, 2], [2, 2 * Math.SQRT2 / 3, 3], [1 / 4, 0.6, 5 / 4], [2 / 3, 0.8, 5 / 3], [3, Math.sqrt(15) / 4, 4]]);
    const frase = { 1: 'igual a su energía en reposo', 2: 'el doble de su energía en reposo', 3: 'el triple de su energía en reposo', 0.25: 'la cuarta parte de su energía en reposo' }[kk] || `los ${num(kk)} de su energía en reposo`;
    const enunciado = ['Se quiere acelerar un electrón hasta que su energía cinética sea ', v('d', frase), '.'];
    const pregunta = ['¿Qué ', v('x', 'rapidez'), ' debe alcanzar?'];
    const errores = [
      h('REL-K-clasica', Math.sqrt(2 * kk), 'Usaste la energía cinética clásica: ½·m·v² = k·m·c². A esas rapideces no sirve (puede dar más que c). Con relatividad, K = (γ − 1)·m·c².'),
      h('REL-v-c-sobre-gamma', 1 / g, `Hallaste bien γ = ${num(g)}, pero tomaste v = c/γ. De γ = 1/√(1 − v²/c²) sale v = c·√(1 − 1/γ²).`),
      h('REL-total-por-cinetica', kk > 1 ? Math.sqrt(1 - 1 / (kk * kk)) : NaN, `Igualaste la energía total a ${num(kk)}·m·c², como si γ = ${num(kk)}. La energía total es la cinética más la de reposo: γ = 1 + ${num(kk)}.`),
      h('REL-resta-lineal', 1 - 1 / g, 'Escribiste 1/γ = 1 − v/c, sin cuadrados ni raíz. De γ = 1/√(1 − v²/c²) sale v = c·√(1 − 1/γ²).'),
      h('REL-gamma-menos-uno', kk < 1 ? kk : NaN, 'Tomaste γ − 1 como v/c. γ − 1 es la razón entre la energía cinética y la de reposo, no la rapidez.'),
    ];
    const solucion = [
      ['K = (', v('g', 'γ'), ' − 1)·m·c² = ', v('d', `${num(kk)}·m·c²`), ', así que ', v('g', `γ = 1 + ${num(kk)} = ${num(g)}`), '.'],
      ['1 − v²/c² = 1/γ² = ', `${num(1 / (g * g))}`, `, v²/c² = ${num(b * b)} y `, v('x', `v = ${cTxt(b)}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: b, errores, texto: cTxt, filtro: x => cTxt(x) !== null, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'energia', sub: 'igual', k: kk } });
  }

  // ---- incertidumbre: Δx·Δp ≥ h/4π ----
  const H = 6.63e-34;
  function incertidumbre(rng, semilla, sub) {
    if (sub === 'posicion') {
      const g = rng.elegir([5, 10, 15, 20, 25, 40, 50]);           // masa en gramos
      const vel = rng.elegir([200, 300, 400, 500, 600, 800]);
      const pct = rng.elegir([5, 10, 20, 25]);                       // precisión de la rapidez, en %
      const dv = vel * pct / 100;
      const m = g / 1000, dp = m * dv;
      const correcta = H / (4 * Math.PI * dp);
      const errs = [
        h('HE-momento-total', H / (4 * Math.PI * m * vel), 'Usaste el momento total, m·v. El principio relaciona las incertidumbres: Δp = m·Δv, con Δv la incertidumbre de la rapidez.', TRAMPAS),
        h('HE-porcentaje-como-rapidez', H / (4 * Math.PI * m * pct), `Tomaste el ${pct} % como si fueran ${pct} m/s. La incertidumbre de la rapidez es el ${pct} % de ${vel} m/s: Δv = ${f(dv)} m/s.`),
        h('HE-h-sin-4pi', H / dp, 'Usaste Δx·Δp ≥ h, sin el 4π. La forma que se usa es Δx·Δp ≥ h/4π.'),
        h('HE-h-entre-2pi', H / (2 * Math.PI * dp), 'Usaste h/2π. La forma que se usa es Δx·Δp ≥ h/4π: la mitad.'),
        h('HE-sin-pi', H / (4 * dp), 'Usaste h/4, sin el π. La forma que se usa es Δx·Δp ≥ h/(4π).'),
      ];
      const todos = [correcta, ...errs.map(e => e.valor)];
      if (!todos.every(x => seguro(x))) return null;
      const enunciado = ['Una bala de ', v('d', `${g} g`), ' sale a ', v('v', `${vel} m/s`), ', y su rapidez se mide con una incertidumbre del ', v('g', `${pct} %`),
        '. Usa h = 6,63 × 10⁻³⁴ J·s.'];
      const pregunta = ['¿Cuál es la ', v('x', 'incertidumbre mínima en su posición'), '?'];
      const solucion = [
        ['Incertidumbre de la rapidez: ', v('g', 'Δv'), ` = ${pct} % de ${vel} m/s = ${f(dv)} m/s. Del momento: Δp = `, v('d', 'm'), '·', v('g', 'Δv'), ` = ${f4(m)} kg · ${f(dv)} m/s = ${sci(dp, 2)} kg·m/s. El momento total m·v no entra.`],
        [v('x', 'Δx'), ' ≥ h/(4π·Δp) = 6,63 × 10⁻³⁴ / (4π · ', `${sci(dp, 2)}) = `, v('x', `${sci(correcta)} m`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores: errs, texto: x => `${sci(x)} m`, unidad: 'm', variables: { d: { nombre: 'masa', color: 'i' }, v: { nombre: 'rapidez', color: 'o' }, g: { nombre: 'incertidumbre de la rapidez Δv', color: 'h' }, x: VAR.x }, enunciado, pregunta, solucion,
        datos: { tipo: 'incertidumbre', sub, m, v: vel, pct } });
    }
    const dxa = rng.elegir([1, 1.6, 2, 2.5, 4, 5]), dxe = -rng.elegir([9, 10, 11, 12]);
    const dx = dxa * 10 ** dxe;
    const correcta = H / (4 * Math.PI * dx);
    const errs = [
      h('HE-h-sin-4pi', H / dx, 'Usaste Δx·Δp ≥ h, sin el 4π. La forma que se usa es Δx·Δp ≥ h/4π.'),
      h('HE-h-entre-2pi', H / (2 * Math.PI * dx), 'Usaste h/2π. La forma que se usa es Δx·Δp ≥ h/4π: la mitad.'),
      h('HE-sin-pi', H / (4 * dx), 'Usaste h/4, sin el π. La forma que se usa es Δx·Δp ≥ h/(4π).'),
    ];
    if (![correcta, ...errs.map(e => e.valor)].every(x => seguro(x))) return null;
    const enunciado = ['Un electrón (m = 9,1 × 10⁻³¹ kg) está encerrado en una región de ', v('d', `${sci(dx, dxa === 1 ? 1 : 2)} m`), ' de ancho (Δx). Usa h = 6,63 × 10⁻³⁴ J·s.'];
    const pregunta = ['¿Cuál es la ', v('x', 'incertidumbre mínima de su momento lineal'), '?'];
    const solucion = [
      ['Principio de incertidumbre: Δx·', v('x', 'Δp'), ' ≥ h/4π.'],
      [v('x', 'Δp'), ' ≥ 6,63 × 10⁻³⁴ / (4π · ', v('d', sci(dx, 2)), ') = ', v('x', `${sci(correcta)} kg·m/s`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores: errs, texto: x => `${sci(x)} kg·m/s`, unidad: 'kg·m/s', variables: { d: { nombre: 'ancho de la región Δx', color: 'i' }, x: VAR.x }, enunciado, pregunta, solucion,
      datos: { tipo: 'incertidumbre', sub, dx } });
  }

  // ---- esfera: se carga hasta frenar a los fotoelectrones ----
  function esfera(rng, semilla, sub) {
    const conLambda = rng.moneda();
    const [lam, Ef] = rng.elegir([[310, 4], [248, 5], [206.67, 6], [177.14, 7], [155, 8]].filter(x => !conLambda || Number.isInteger(x[0])));
    const metal = rng.elegir([['cesio', 2], ['potasio', 2.3], ['sodio', 2.5], ['zinc', 4.3], ['cobre', 4.7], ['plata', 4.5]]);
    const phi = metal[1];
    const V = Ef - phi;
    if (V <= 0.4 || !corto(V, 1)) return null;
    const Rcm = rng.elegir([1.8, 2.7, 3.6, 4.5, 9, 18]);
    const diametro = sub === 'carga' && rng.moneda();
    const R = Rcm / 100, k = 9e9;
    const Q = R * V / k;
    const foton = conLambda ? ['luz de ', v('E', `${lam} nm`), ' (hc = 1240 eV·nm)'] : ['fotones de ', v('E', `${f(Ef)} eV`)];
    const enunciado = ['Una esfera de ', metal[0], ' (función trabajo ', v('phi', `${f(phi)} eV`), ') de ', diametro ? v('R', `${f(2 * Rcm)} cm de diámetro`) : v('R', `${f(Rcm)} cm de radio`),
      ' está aislada y descargada. Se ilumina con ', ...foton, '. Suelta electrones hasta que su propio potencial frena a los más rápidos. Usa k = 9 × 10⁹ N·m²/C².'];
    const pregunta = sub === 'potencial' ? ['¿Qué ', v('x', 'potencial'), ' alcanza la esfera?'] : ['¿Qué ', v('x', 'carga'), ' adquiere la esfera?'];
    const VAR2 = { R: { nombre: 'radio de la esfera', color: 'o' }, E: { nombre: 'energía del fotón', color: 'h' }, phi: { nombre: 'función trabajo', color: 'i' }, x: VAR.x };
    const pasos0 = [
      conLambda ? ['Energía de cada fotón: E = hc/λ = 1240/', v('E', String(lam)), ` = ${f(Ef)} eV.`] : ['Cada fotón trae ', v('E', `${f(Ef)} eV`), '.'],
      ['Al electrón más rápido le queda Kmax = E − ', v('phi', 'φ'), ` = ${f(Ef)} − ${f(phi)} = ${f(V)} eV. La esfera se queda con carga positiva y deja de soltar electrones cuando su potencial es V = Kmax/e = ${f(V)} V.`],
    ];
    if (sub === 'potencial') {
      const errores = [
        h('FM-kmax-sin-restar-phi', Ef, 'Tomaste toda la energía del fotón como energía cinética. Una parte, la función trabajo, se gasta en sacar al electrón: Kmax = E − φ.'),
        h('FM-kmax-suma-phi', Ef + phi, 'Sumaste la función trabajo. Esa energía se gasta en sacar al electrón del metal: se resta, Kmax = E − φ.'),
        h('FM-esfera-solo-phi', phi, 'Ese es el potencial que corresponde a la función trabajo. El potencial que frena a los electrones corresponde a su energía cinética máxima, E − φ.'),
        h('FM-esfera-entre-radio', V / R, `Dividiste entre el radio. El potencial que frena a los electrones es V = Kmax/e = ${f(V)} V; el radio entra recién al calcular la carga.`),
      ];
      return cerrar(rng, semilla, { correcta: V, errores, texto: x => `${f(x)} V`, filtro: x => corto(x), unidad: 'V', variables: VAR2, enunciado, pregunta, solucion: pasos0,
        datos: { tipo: 'esfera', sub, E: Ef, phi, r: R } });
    }
    const pC = x => x * 1e12;
    const errores = [
      h('FM-kmax-sin-restar-phi', R * Ef / k, 'No restaste la función trabajo: tomaste toda la energía del fotón como energía cinética. Kmax = E − φ, y con eso V = Kmax/e.'),
      h('FM-kmax-suma-phi', R * (Ef + phi) / k, 'Sumaste la función trabajo. Esa energía se gasta en sacar al electrón: Kmax = E − φ.'),
      diametro ? h('PR6-diametro', 2 * R * V / k, 'Usaste el diámetro como radio. El radio es la mitad.', TRANS)
        : h('PR6-radio-como-diametro', R / 2 * V / k, 'Tomaste la mitad del radio, como si el dato fuera el diámetro. El dato ya es el radio.', TRANS),
      h('FM-esfera-solo-phi', R * phi / k, 'Usaste la función trabajo como si fuera el potencial. El potencial final corresponde a Kmax = E − φ.'),
      h('FM-esfera-radio-al-reves', V / (k * R), 'Pusiste el radio dividiendo. El potencial de una esfera es V = kQ/R, así que Q = R·V/k: a mayor radio, más carga.'),
    ];
    const solucion = [...pasos0,
      ['El potencial de una esfera es V = k·Q/', v('R', 'R'), diametro ? `, con R = ${f(2 * Rcm)}/2 = ${f(Rcm)} cm.` : '.'],
      [v('x', 'Q'), ' = ', v('R', 'R'), `·V/k = ${f4(R)} m · ${f(V)} V / (9 × 10⁹) = `, v('x', `${sci(Q, 3)} C`), ` = ${f(pC(Q))} pC.`],
    ];
    return cerrar(rng, semilla, { correcta: Q, errores, texto: x => `${f(pC(x))} pC`, filtro: x => corto(pC(x)) && pC(x) < 1e7 && pC(x) >= 0.01, unidad: 'pC', variables: VAR2, enunciado, pregunta, solucion,
      datos: { tipo: 'esfera', sub, E: Ef, phi, r: R, diametro } });
  }

  return { id: 'relatividad', titulo: 'El reloj que viaja', generar, _sci: sci };
});
