/*
 * Generador «Condensadores en fila y en paralelo» (unidad fisica.electrostatica).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['condensadores']) y en Node (require). No usa ningún motor.
 *
 * Tipos y subtipos:
 *   equivalente/mixta      tres o cuatro condensadores distintos, la conexión descrita con palabras: Ceq
 *   equivalente/incognita  la misma clase de arreglo con un condensador desconocido y la Ceq dada: Cx
 *   equivalente/iguales    tres o cuatro condensadores iguales; se da la Ceq de todos en paralelo y se
 *                          pide la de otro arreglo mixto
 *   n-iguales/veces        n iguales en serie a una batería; se pasan a paralelo con la misma batería:
 *                          cuántas veces cambia la energía (n²)
 *   n-iguales/serie-eq     n iguales; se da la razón de energías paralelo/serie con el mismo voltaje:
 *                          la Ceq en serie (hay que sacar n = √razón)
 *   carga-voltaje/serie-voltaje  dos o tres en serie a una batería: el voltaje en uno de ellos
 *   carga-voltaje/mixta-carga    (C1 ∥ C2) en serie con C3: la carga en C1
 *   energia/basica         U = ½·C·V² con C en µF: cuánta energía más guarda al subir de V1 a V2
 *   energia/serie-paralelo dos condensadores en serie a V1 guardan U; el voltaje V2 que, en paralelo,
 *                          les hace guardar lo mismo
 *   energia/eficiencia     flash de cámara: energía de luz, eficiencia y voltaje → la capacidad
 *   plano/capacidad        C = ε0·A/d con A en cm² y d en mm (resultado en pF)
 *   plano/cambio           se cambia el área y la separación: la nueva capacidad
 *
 * Convenciones: capacidades en µF (pF en el condensador plano), voltajes en V, cargas en µC,
 * energías en mJ o J; ε0 = 8,85 × 10⁻¹² C²/(N·m²). µF·V = µC y µF·V² = µJ.
 *
 * Errores (todos hipótesis: no hay estudios con porcentaje sobre condensadores, ver la sección
 * «Lo que no tiene respaldo» de docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md):
 *   CAP-como-resistencia  código nuevo: asociar condensadores con las reglas de las resistencias
 *                         (en serie se suman, en paralelo producto entre suma). Es la trampa 9 de
 *                         docs/clasificacion/trampas-admision-unmsm/fisica.md. Respaldo parcial: el informe
 *                         de electromagnetismo cita a Engelhardt y Beichner (2004) para sumar en serie.
 *   CAP-reparto-como-resistencia  repartir el voltaje de una serie en proporción a C (hipótesis).
 *   CAP-cuadrado-de-mas, CAP-cuadrado-diferencia, CAP-sin-convertir  códigos propios (hipótesis).
 *   CAP-*                 los demás errores propios del tema (todo en serie o en paralelo, voltaje
 *                         en partes iguales, la misma equivalente en serie y en paralelo, etc.).
 *   PR1, PR2, PR3, PR4, PR5, U2, U3 con sufijo: docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md.
 *   W15-eficiencia        multiplicar por la eficiencia en vez de dividir (trampa 13), que el informe
 *                         docs/investigacion/estatica-energia-ideas-erroneas.md deja como hipótesis
 *                         derivada de W15.
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
  const EN = 'docs/investigacion/estatica-energia-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = EM) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const tr = (id, valor, explicacion) => h(id, valor, explicacion, TR);
  // Asociar como resistencias (en serie, sumar capacidades): parcial, Engelhardt y Beichner (2004) en el informe.
  const cr = (valor, explicacion) => ({ id: 'CAP-como-resistencia', valor, explicacion, respaldo: 'parcial', fuente: EM });
  const f = (x, d = 2) => P.formatear(x, d);
  const v = P.v;
  // Número "de examen": exacto con dos decimales como mucho.
  const limpio = (x, dec = 2) => {
    if (!Number.isFinite(x) || x <= 0 || x > 1e12) return false;
    const y = x * 10 ** dec;
    return Math.abs(y - Math.round(y)) < 1e-7 * Math.max(1, Math.abs(y));
  };
  const NUM = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

  const VAR = {
    C: { nombre: 'capacidad', color: 'o' },
    V: { nombre: 'voltaje', color: 'i' },
    Q: { nombre: 'carga o energía', color: 'h' },
    x: { nombre: 'lo que se pide', color: 'd' },
  };

  const TIPOS = [['equivalente', 'mixta'], ['equivalente', 'mixta'], ['equivalente', 'incognita'], ['equivalente', 'incognita'],
    ['equivalente', 'iguales'], ['equivalente', 'iguales'], ['n-iguales', 'veces'], ['n-iguales', 'serie-eq'],
    ['carga-voltaje', 'serie-voltaje'], ['carga-voltaje', 'mixta-carga'], ['energia', 'basica'], ['energia', 'serie-paralelo'],
    ['energia', 'eficiencia'], ['energia', 'eficiencia'], ['plano', 'capacidad'], ['plano', 'capacidad'], ['plano', 'cambio']];

  function generar(semilla) {
    const rng = Azar.crear('condensadores|' + semilla);
    const [tipo, sub] = rng.elegir(TIPOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'equivalente') return sub === 'mixta' ? mixta(rng, semilla) : sub === 'incognita' ? incognita(rng, semilla) : iguales(rng, semilla);
    if (tipo === 'n-iguales') return nIguales(rng, semilla, sub);
    if (tipo === 'carga-voltaje') return sub === 'serie-voltaje' ? serieVoltaje(rng, semilla) : mixtaCarga(rng, semilla);
    if (tipo === 'energia') return sub === 'basica' ? energiaBasica(rng, semilla) : sub === 'serie-paralelo' ? seriePar(rng, semilla) : eficiencia(rng, semilla);
    return sub === 'capacidad' ? plano(rng, semilla) : cambio(rng, semilla);
  }

  function cerrar(rng, semilla, o) {
    const ok = o.ok || (x => limpio(x));
    // Sin distractores absurdos: fuera de 1/20 a 20 veces la correcta no entran.
    const razonable = x => x === 0 || (Math.abs(x / o.correcta) <= 20 && Math.abs(x / o.correcta) >= 1 / 20);
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => ok(e.valor) && razonable(e.valor)), rng, texto: o.texto });
    return {
      id: `condensadores#${semilla}`, variables: o.variables || VAR, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  // ---------- Árboles de conexión: un número es un condensador; { s: [...] } en serie; { p: [...] } en paralelo ----------
  const S = (...h) => ({ s: h }), Pa = (...h) => ({ p: h });
  // reglas = 'cond' (las de condensadores) o 'res' (las de resistencias, el error CAP-como-resistencia).
  function eq(t, reglas = 'cond') {
    if (typeof t === 'number') return t;
    const hs = (t.s || t.p).map(x => eq(x, reglas));
    const suma = hs.reduce((a, b) => a + b, 0), inversa = 1 / hs.reduce((a, b) => a + 1 / b, 0);
    if (t.s) return reglas === 'cond' ? inversa : suma;
    return reglas === 'cond' ? suma : inversa;
  }
  const hojas = t => (typeof t === 'number' ? [t] : (t.s || t.p).flatMap(hojas));
  const todoParalelo = t => hojas(t).reduce((a, b) => a + b, 0);
  const todoSerie = t => 1 / hojas(t).reduce((a, b) => a + 1 / b, 0);

  // Formas de conexión, con su descripción en palabras. Los nombres van en orden: C1, C2, …
  const FORMAS = [
    { id: 'T1', n: 3, arbol: c => Pa(S(c[0], c[1]), c[2]), texto: n => [n[0], ' y ', n[1], ' están en serie; ese par está en paralelo con ', n[2], '.'] },
    { id: 'T2', n: 3, arbol: c => S(Pa(c[0], c[1]), c[2]), texto: n => [n[0], ' y ', n[1], ' están en paralelo; ese par está en serie con ', n[2], '.'] },
    { id: 'T3', n: 4, arbol: c => Pa(S(c[0], c[1]), S(c[2], c[3])), texto: n => [n[0], ' y ', n[1], ' están en serie; ', n[2], ' y ', n[3], ' también están en serie entre sí, y esas dos ramas están en paralelo.'] },
    { id: 'T4', n: 4, arbol: c => S(Pa(c[0], c[1]), Pa(c[2], c[3])), texto: n => [n[0], ' y ', n[1], ' están en paralelo; ', n[2], ' y ', n[3], ' también, y esos dos grupos están en serie.'] },
    { id: 'T5', n: 4, arbol: c => S(Pa(S(c[0], c[1]), c[2]), c[3]), texto: n => [n[0], ' y ', n[1], ' están en serie; ese par está en paralelo con ', n[2], ', y todo eso está en serie con ', n[3], '.'] },
  ];
  const forma = id => FORMAS.find(x => x.id === id);
  const nombres = (k, vals) => vals.map((c, i) => v('C', `C${i + 1} = ${f(c)} µF`));
  const soloNombres = k => Array.from({ length: k }, (_, i) => v('C', `C${i + 1}`));

  // Pasos de la solución: reduce el árbol de adentro hacia afuera, con nombres como C12.
  function pasos(t, unidad = 'µF') {
    let i = 0;
    const lineas = [];
    function rec(n) {
      if (typeof n === 'number') { i++; return { val: n, nom: `C${i}` }; }
      const hs = (n.s || n.p).map(rec);
      const nom = 'C' + hs.map(x => x.nom.slice(1)).join('');
      const val = eq({ [n.s ? 's' : 'p']: hs.map(x => x.val) });
      if (n.p) lineas.push([`${hs.map(x => x.nom).join(' y ')} en paralelo se suman: `, v('C', `${nom} = ${hs.map(x => f(x.val)).join(' + ')} = ${f(val)} ${unidad}`), '.']);
      else if (hs.length === 2) lineas.push([`${hs.map(x => x.nom).join(' y ')} en serie: producto entre suma, `, v('C', `${nom} = ${f(hs[0].val)}·${f(hs[1].val)}/(${f(hs[0].val)} + ${f(hs[1].val)}) = ${f(val)} ${unidad}`), '.']);
      else lineas.push([`${hs.map(x => x.nom).join(', ')} en serie: `, v('C', `1/${nom} = ${hs.map(x => '1/' + f(x.val)).join(' + ')}`), `, así que ${nom} = ${f(val)} ${unidad}.`]);
      return { val, nom };
    }
    const r = rec(t);
    return { lineas, val: r.val, nom: r.nom };
  }

  const uF = x => `${f(x)} µF`;
  const CAPS = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 20, 24, 30];

  // ---- equivalente/mixta ----
  function mixta(rng, semilla) {
    const F = rng.elegir(FORMAS);
    const c = Array.from({ length: F.n }, () => rng.elegir(CAPS));
    const T = F.arbol(c), correcta = eq(T);
    if (!limpio(correcta, 1)) return null;
    const enunciado = [`${NUM[F.n][0].toUpperCase() + NUM[F.n].slice(1)} condensadores, `, ...joinY(nombres(F.n, c)), ', se conectan así: ', ...F.texto(soloNombres(F.n))];
    const pregunta = ['¿Cuál es la ', v('x', 'capacidad equivalente'), ' de la asociación?'];
    const errores = [
      cr(eq(T, 'res'), 'Usaste las reglas de las resistencias. En condensadores es al revés: en paralelo las capacidades se suman y en serie se combinan como 1/C = 1/C1 + 1/C2.'),
      h('CAP-todo-paralelo', todoParalelo(T), 'Sumaste todas las capacidades, como si los condensadores estuvieran todos en paralelo. Hay grupos en serie: primero se reduce cada grupo con su regla.'),
      h('CAP-todo-serie', todoSerie(T), 'Combinaste todas las capacidades como si estuvieran todas en serie. Solo los grupos en serie se combinan así; los que están en paralelo se suman.'),
      h('CAP-solo-un-grupo', eq(T.s ? T.s[0] : T.p[0]), 'Esa es la capacidad de solo una parte del arreglo. Falta combinarla con el resto.'),
    ];
    const ps = pasos(T);
    const solucion = [['Se reduce de adentro hacia afuera; en paralelo las capacidades se suman y en serie se combinan con 1/C = 1/C1 + 1/C2 (para dos: producto entre suma).'], ...ps.lineas,
      ['La ', v('x', `capacidad equivalente es ${uF(correcta)}`), '.']];
    return cerrar(rng, semilla, { correcta, errores, texto: uF, unidad: 'µF', enunciado, pregunta, solucion,
      datos: { tipo: 'equivalente', sub: 'mixta', forma: F.id, c } });
  }
  const joinY = segs => segs.flatMap((s, i) => (i === 0 ? [s] : [i === segs.length - 1 ? ' y ' : ', ', s]));

  // Resuelve g(x) = objetivo con g creciente en x > 0 (bisección en escala logarítmica).
  function despejar(g, objetivo) {
    let a = 1e-6, b = 1e6;
    if (!(g(a) < objetivo && g(b) > objetivo)) return NaN;
    for (let i = 0; i < 200; i++) { const m = Math.sqrt(a * b); if (g(m) < objetivo) a = m; else b = m; }
    return Math.sqrt(a * b);
  }
  const redondo = x => (Number.isFinite(x) ? Math.round(x * 1e6) / 1e6 : x);

  // ---- equivalente/incognita ----
  function incognita(rng, semilla) {
    const F = forma(rng.elegir(['T1', 'T2']));
    const c = [rng.elegir(CAPS), rng.elegir(CAPS), rng.elegir(CAPS)];
    const pos = rng.elegir([0, 1, 2, 2]); // dentro del par (0 o 1) o el de afuera (2)
    const Ceq = redondo(eq(F.arbol(c)));
    if (!limpio(Ceq, 1)) return null;
    const correcta = c[pos];
    const conX = x => { const d = c.slice(); d[pos] = x; return F.arbol(d); };
    const inv = (...xs) => 1 / xs.reduce((a, b) => a + 1 / b, 0); // serie
    const res = x => redondo(despejar(g => eq(conX(g), 'res'), x));
    let errores, solucion, rama;
    const nx = `C${pos + 1}`;
    if (pos === 2) {
      const [a, b] = c;
      rama = F.id === 'T1' ? inv(a, b) : a + b; // el par, ya conocido
      errores = [
        cr(res(Ceq), 'Usaste las reglas de las resistencias para combinar. En condensadores es al revés: en paralelo se suman y en serie se combinan con 1/C = 1/C1 + 1/C2.'),
        h('CAP-par-como-x', rama, `Ese es el valor del par C1–C2, no el de ${nx}. Falta combinar el par con ${nx} y despejar.`),
        F.id === 'T1'
          ? h('CAP-despeje-signo', Ceq + rama, `Sumaste en vez de restar. En paralelo Ceq = C12 + ${nx}, así que ${nx} = Ceq − C12.`)
          : h('CAP-despeje-signo', redondo(inv(Ceq, rama)), `Sumaste los inversos en vez de restarlos. De 1/Ceq = 1/C12 + 1/${nx} sale 1/${nx} = 1/Ceq − 1/C12.`),
        h('CAP-todo-paralelo', redondo(Ceq - a - b), 'Supusiste que los tres están en paralelo y restaste. El par tiene su propia regla.'),
        h('CAP-todo-serie', redondo(1 / (1 / Ceq - 1 / a - 1 / b)), 'Supusiste que los tres están en serie. Solo el grupo en serie se combina con inversos; el que está en paralelo se suma.'),
      ];
      solucion = F.id === 'T1' ? [
        ['C1 y C2 en serie: ', v('C', `C12 = ${f(a)}·${f(b)}/(${f(a)} + ${f(b)}) = ${uF(rama)}`), '.'],
        ['El par está en paralelo con ', v('x', nx), ', así que se suman: ', v('x', `${nx} = ${f(Ceq)} − ${f(rama)} = ${uF(correcta)}`), '.'],
      ] : [
        ['C1 y C2 en paralelo: ', v('C', `C12 = ${f(a)} + ${f(b)} = ${uF(rama)}`), '.'],
        ['El par está en serie con ', v('x', nx), ': ', v('x', `1/${nx} = 1/${f(Ceq)} − 1/${f(rama)}`), ', así que ', v('x', `${nx} = ${uF(correcta)}`), '.'],
      ];
    } else {
      const otro = c[1 - pos];
      rama = F.id === 'T1' ? Ceq - c[2] : Ceq * c[2] / (c[2] - Ceq); // lo que debe valer el par
      const nOtro = `C${2 - pos}`;
      errores = F.id === 'T1' ? [
        h('CAP-rama-como-x', rama, `Ese es el valor que debe tener el par ${nx}–${nOtro} (Ceq − C3), no ${nx}. Falta despejar ${nx} de su serie con ${nOtro}.`),
        h('CAP-despeje-signo', redondo(inv(rama, otro)), `Sumaste los inversos en vez de restarlos. De 1/C12 = 1/${nx} + 1/${nOtro} sale 1/${nx} = 1/C12 − 1/${nOtro}.`),
        h('CAP-olvida-paralelo', redondo(otro * Ceq / (otro - Ceq)), `Despejaste como si el par solo diera la equivalente, sin restar C3. El par está en paralelo con C3: C12 = Ceq − C3.`),
      ] : [
        h('CAP-rama-como-x', redondo(rama), `Ese es el valor que debe tener el par ${nx}–${nOtro}, no ${nx}. Falta restar ${nOtro}, porque en paralelo se suman.`),
        h('CAP-despeje-signo', redondo(Ceq * c[2] / (Ceq + c[2]) - otro), 'Sumaste los inversos en vez de restarlos al despejar el par: 1/C12 = 1/Ceq − 1/C3.'),
        h('CAP-olvida-serie', redondo(Ceq - otro), `Tomaste la equivalente como si fuera el par, olvidando que el par está en serie con C3. Primero se despeja el par: 1/C12 = 1/Ceq − 1/C3.`),
      ];
      solucion = F.id === 'T1' ? [
        ['El par en serie está en paralelo con C3, así que su capacidad más la de C3 da la equivalente: ', v('C', `C12 = ${f(Ceq)} − ${f(c[2])} = ${uF(rama)}`), '.'],
        [`El par es ${nOtro} en serie con `, v('x', nx), `: 1/${nx} = 1/${f(rama)} − 1/${f(otro)}, así que `, v('x', `${nx} = ${uF(correcta)}`), '.'],
      ] : [
        ['El par en paralelo está en serie con C3: 1/C12 = 1/', f(Ceq), ' − 1/', f(c[2]), ', así que ', v('C', `C12 = ${uF(rama)}`), '.'],
        ['En el par, las capacidades se suman: ', v('x', `${nx} = ${f(rama)} − ${f(otro)} = ${uF(correcta)}`), '.'],
      ];
    }
    if (!limpio(rama, 2)) return null;
    const noms = soloNombres(3); noms[pos] = v('x', nx);
    const conocidos = [0, 1, 2].filter(i => i !== pos).map(i => v('C', `C${i + 1} = ${uF(c[i])}`));
    const enunciado = ['Tres condensadores se conectan así: ', ...F.texto(noms), ' Se sabe que ', ...joinY(conocidos), ', y que la capacidad equivalente de toda la asociación es ', v('C', uF(Ceq)), '.'];
    const pregunta = ['¿Cuánto vale ', v('x', nx), '?'];
    return cerrar(rng, semilla, { correcta, errores, texto: uF, unidad: 'µF', enunciado, pregunta, solucion,
      datos: { tipo: 'equivalente', sub: 'incognita', forma: F.id, pos, conocidos: c.filter((_, i) => i !== pos), ceq: Ceq } });
  }

  // ---- equivalente/iguales: arreglos mixtos de condensadores iguales ----
  const ARREGLOS = [
    { id: 'A3a', n: 3, arbol: C => Pa(S(C, C), C), texto: 'dos de ellos en serie, y ese par en paralelo con el tercero' },
    { id: 'A3b', n: 3, arbol: C => S(Pa(C, C), C), texto: 'dos de ellos en paralelo, y ese par en serie con el tercero' },
    { id: 'A4a', n: 4, arbol: C => S(Pa(C, C, C), C), texto: 'tres de ellos en paralelo, y ese grupo en serie con el cuarto' },
    { id: 'A4b', n: 4, arbol: C => Pa(S(C, C, C), C), texto: 'tres de ellos en serie, y ese grupo en paralelo con el cuarto' },
    { id: 'A4c', n: 4, arbol: C => Pa(S(Pa(C, C), C), C), texto: 'dos en paralelo; ese par en serie con el tercero, y todo eso en paralelo con el cuarto' },
    { id: 'A4d', n: 4, arbol: C => S(Pa(S(C, C), C), C), texto: 'dos en serie; ese par en paralelo con el tercero, y todo eso en serie con el cuarto' },
  ];
  function iguales(rng, semilla) {
    const A = rng.elegir(ARREGLOS);
    const C = rng.elegir([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 20, 24, 25, 30, 36, 40, 45, 60]);
    const Cp = A.n * C, T = A.arbol(C), correcta = eq(T);
    if (!limpio(correcta, 1)) return null;
    const enunciado = [`Se tienen ${NUM[A.n]} condensadores iguales. Conectados todos en paralelo, su capacidad equivalente es `, v('C', uF(Cp)), `. Luego se conectan así: ${A.texto}.`];
    const pregunta = ['¿Cuál es la ', v('x', 'capacidad equivalente'), ' del nuevo arreglo?'];
    const errores = [
      cr(eq(A.arbol(C), 'res'), 'Usaste las reglas de las resistencias. En condensadores, en paralelo se suman y en serie se combinan con 1/C = 1/C1 + 1/C2.'),
      h('CAP-dato-como-C', eq(A.arbol(Cp)), `Usaste ${uF(Cp)} como la capacidad de cada condensador. Ese es el valor de los ${NUM[A.n]} en paralelo: cada uno tiene ${uF(Cp)}/${A.n}.`),
      h('CAP-todo-serie', C / A.n, `Esa es la capacidad de los ${NUM[A.n]} en serie. El arreglo mezcla serie y paralelo.`),
      tr('PR5-n-cuadrado', eq(A.arbol(Cp / (A.n * A.n))), `Dividiste el dato entre ${A.n}² para hallar cada capacidad. En paralelo, n condensadores iguales dan n·C, no n²·C: cada uno tiene ${uF(Cp)}/${A.n}.`),
    ];
    const ps = pasos(T);
    const solucion = [
      [`En paralelo, ${NUM[A.n]} iguales dan ${A.n}·C: `, v('C', `C = ${f(Cp)}/${A.n} = ${uF(C)}`), ' cada uno.'],
      ...ps.lineas,
      ['La ', v('x', `capacidad equivalente es ${uF(correcta)}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: uF, unidad: 'µF', enunciado, pregunta, solucion,
      datos: { tipo: 'equivalente', sub: 'iguales', arreglo: A.id, cp: Cp } });
  }

  // ---- n-iguales ----
  function nIguales(rng, semilla, sub) {
    const n = rng.entero(2, 4);
    if (sub === 'veces') {
      const C = rng.elegir([2, 3, 4, 5, 6, 10]), V = rng.elegir([6, 9, 12, 20, 24, 50]);
      const correcta = n * n;
      const texto = x => (Number.isInteger(x) ? String(x) : P.textoFraccion([1, Math.round(1 / x)]));
      const enunciado = [`${NUM[n][0].toUpperCase() + NUM[n].slice(1)} condensadores iguales, de `, v('C', uF(C)), ' cada uno, se conectan en serie a una batería de ', v('V', `${V} V`),
        `. Después se desconectan, se descargan, se vuelven a conectar ${n === 2 ? 'los dos' : 'todos'} en paralelo y se conectan a la misma batería.`];
      const pregunta = ['¿Cuál es la ', v('x', 'razón U(paralelo)/U(serie)'), ' entre la energía que guardan al final y la que guardaban al inicio?'];
      const errores = [
        tr('PR5-n-por-n2', n, `Pensaste que la energía crece ${n} veces. La capacidad equivalente pasa de C/${n} a ${n}·C: crece ${n}·${n} = ${n * n} veces, y con el mismo voltaje la energía ½·C·V² crece igual.`),
        h('CAP-cuenta-doble', n * n * n, `Multiplicaste la razón de capacidades (${n}²) otra vez por los ${n} condensadores. La capacidad equivalente ya los cuenta a todos: la razón es ${n}² = ${n * n}.`),
        h('CAP-energia-igual', 1, 'Supusiste que la energía no cambia porque son los mismos condensadores. Con el mismo voltaje, la energía depende de la capacidad equivalente, que cambia mucho.'),
        cr(1 / (n * n), `Usaste las reglas de las resistencias: en serie sumaste (${n}·C) y en paralelo dividiste (C/${n}). En condensadores es al revés, así que la energía crece, no baja.`),
      ];
      const solucion = [
        [`En serie: `, v('C', limpio(C / n) ? `Cs = C/${n} = ${f(C / n)} µF` : `Cs = C/${n}`), `. En paralelo: `, v('C', `Cp = ${n}·C = ${uF(n * C)}`), '.'],
        ['Con el mismo voltaje, U = ½·C·V² es proporcional a C: ', v('x', `Up/Us = Cp/Cs = ${n}·C ÷ (C/${n}) = ${n}² = ${correcta}`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto, unidad: '', ok: x => x > 0, enunciado, pregunta, solucion,
        datos: { tipo: 'n-iguales', sub, n, c: C, v: V } });
    }
    const C = rng.elegir([6, 8, 9, 12, 16, 18, 20, 24, 27, 30, 32, 36, 40, 45, 48, 60, 64, 72, 80, 90, 96, 120]);
    const correcta = C / n;
    if (!limpio(correcta, 1)) return null;
    const r = n * n;
    const enunciado = ['Se tienen varios condensadores iguales, de ', v('C', uF(C)), ' cada uno. Conectados todos en paralelo a una batería, guardan ', v('Q', `${r} veces`),
      ' la energía que guardan cuando se conectan todos en serie a la misma batería.'];
    const pregunta = ['¿Cuál es la ', v('x', 'capacidad equivalente'), ' cuando están todos en serie?'];
    const errores = [
      tr('PR5-n-por-n2', C / r, `Tomaste la razón de energías (${r}) como el número de condensadores. Con el mismo voltaje, Up/Us = Cp/Cs = n·C ÷ (C/n) = n²: n = √${r} = ${n}.`),
      cr(n * C, `Sumaste las capacidades en serie, como si fueran resistencias. En serie, n condensadores iguales dan C/n.`),
      cr(r * C, `Tomaste la razón ${r} como el número de condensadores y además sumaste en serie, como con resistencias. Son ${n} condensadores, y en serie dan C/${n}.`),
      h('CAP-uno-solo', C, `Esa es la capacidad de un solo condensador. En serie, ${n} iguales dan C/${n}.`),
      h('CAP-paralelo-por-serie', n * C, `Esa es la capacidad de los ${n} en paralelo. En serie, n iguales dan C/n.`),
    ];
    const solucion = [
      ['Con el mismo voltaje, la energía ½·C·V² es proporcional a la capacidad: Up/Us = Cp/Cs = n·C ÷ (C/n) = n².'],
      [`n² = ${r}, así que n = ${n} condensadores.`],
      ['En serie: ', v('x', `Cs = ${f(C)}/${n} = ${uF(correcta)}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: uF, unidad: 'µF', enunciado, pregunta, solucion,
      datos: { tipo: 'n-iguales', sub, razon: r, c: C } });
  }

  // ---- carga-voltaje/serie-voltaje ----
  const SERIES = [[3, 6], [2, 3], [4, 12], [6, 12], [2, 6], [10, 15], [12, 24], [6, 3], [20, 30], [2, 3, 6], [4, 6, 12], [3, 6, 6], [6, 10, 15]];
  function serieVoltaje(rng, semilla) {
    const cs = rng.barajar(rng.elegir(SERIES));
    const V = rng.elegir([6, 9, 12, 18, 24, 30, 36, 60, 90, 120]);
    const i = rng.entero(0, cs.length - 1);
    const Ceq = eq(S(...cs)), Q = Ceq * V, correcta = Q / cs[i];
    if (!limpio(Q, 1) || !limpio(correcta, 1)) return null;
    const suma = cs.reduce((a, b) => a + b, 0);
    const enunciado = [`${cs.length === 2 ? 'Dos' : 'Tres'} condensadores, `, ...joinY(nombres(cs.length, cs)), ', se conectan en serie a una batería de ', v('V', `${V} V`), '.'];
    const pregunta = ['¿Qué ', v('x', `voltaje hay en C${i + 1}`), '?'];
    const errores = [
      h('CAP-partes-iguales', V / cs.length, `Repartiste el voltaje en partes iguales. En serie todos tienen la misma carga, y V = Q/C: el de menor capacidad se lleva más voltaje.`),
      h('CAP-reparto-como-resistencia', V * cs[i] / suma, `Repartiste el voltaje en proporción a las capacidades, como se hace con resistencias en serie. En condensadores es al revés: V = Q/C, así que al de mayor capacidad le toca menos.`),
      h('CAP-todo-el-voltaje', V, 'Ese es el voltaje de la batería, que se reparte entre los condensadores en serie. Cada uno tiene solo una parte.'),
      cr(suma * V / cs[i], `Sumaste las capacidades para hallar la carga, como si estuvieran en paralelo. En serie, 1/Ceq = 1/C1 + 1/C2${cs.length === 3 ? ' + 1/C3' : ''}.`),
    ];
    const solucion = [
      ['En serie, ', v('C', `1/Ceq = ${cs.map(c => '1/' + f(c)).join(' + ')}`), ', así que ', v('C', `Ceq = ${uF(Ceq)}`), '.'],
      ['La carga es la misma en todos: ', v('Q', `Q = Ceq·V = ${f(Ceq)} · ${V} = ${f(Q)} µC`), '.'],
      [v('x', `V${i + 1} = Q/C${i + 1} = ${f(Q)}/${f(cs[i])} = ${f(correcta)} V`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} V`, unidad: 'V', ok: x => limpio(x) && x <= V, enunciado, pregunta, solucion,
      datos: { tipo: 'carga-voltaje', sub: 'serie-voltaje', c: cs, v: V, i } });
  }

  // ---- carga-voltaje/mixta-carga: (C1 ∥ C2) en serie con C3 ----
  function mixtaCarga(rng, semilla) {
    const c = [rng.elegir(CAPS), rng.elegir(CAPS), rng.elegir(CAPS)];
    const V = rng.elegir([6, 10, 12, 20, 24, 30, 60]);
    const T = S(Pa(c[0], c[1]), c[2]), Ceq = eq(T), Q = Ceq * V;
    const Cp = c[0] + c[1], Vp = Q / Cp, correcta = c[0] * Vp;
    if (!limpio(Ceq, 2) || !limpio(Q, 1) || !limpio(correcta, 1)) return null;
    const Ceqr = eq(T, 'res'), Qr = Ceqr * V;
    const enunciado = ['Tres condensadores, ', ...joinY(nombres(3, c)), ', se conectan así: ', ...forma('T2').texto(soloNombres(3)), ' La asociación se conecta a una batería de ', v('V', `${V} V`), '.'];
    const pregunta = ['¿Qué ', v('x', 'carga guarda C1'), '?'];
    const errores = [
      h('CAP-carga-total', Q, 'Esa es la carga de toda la asociación, la misma que la de C3. En el par en paralelo esa carga se reparte entre C1 y C2.'),
      h('CAP-partes-iguales', Q / 2, 'Repartiste la carga del par en partes iguales. C1 y C2 tienen el mismo voltaje, así que cada uno guarda Q = C·V: el de mayor capacidad guarda más.'),
      h('CAP-todo-el-voltaje', c[0] * V, 'Pusiste todo el voltaje de la batería en C1. El par está en serie con C3, así que el voltaje se reparte entre el par y C3.'),
      cr(Qr * c[0] / Cp, 'Calculaste la capacidad equivalente con las reglas de las resistencias. En condensadores, en paralelo se suman y en serie se combinan con inversos.'),
    ];
    const solucion = [
      ['C1 y C2 en paralelo: ', v('C', `C12 = ${f(c[0])} + ${f(c[1])} = ${uF(Cp)}`), '. En serie con C3: ', v('C', `Ceq = ${f(Cp)}·${f(c[2])}/(${f(Cp)} + ${f(c[2])}) = ${uF(Ceq)}`), '.'],
      ['La carga total, la misma del par y de C3: ', v('Q', `Q = ${f(Ceq)} · ${V} = ${f(Q)} µC`), '.'],
      ['Voltaje del par: ', v('V', `V12 = ${f(Q)}/${f(Cp)} = ${f(Vp)} V`), '. Carga de C1: ', v('x', `Q1 = ${f(c[0])} · ${f(Vp)} = ${f(correcta)} µC`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} µC`, unidad: 'µC', enunciado, pregunta, solucion,
      datos: { tipo: 'carga-voltaje', sub: 'mixta-carga', c, v: V } });
  }

  // ---- energia/basica ----
  function energiaBasica(rng, semilla) {
    // Se carga a V1 y luego se sube a V2 = k·V1: cuánta energía más guarda.
    const C = rng.elegir([2, 4, 5, 8, 10, 20, 25, 40, 50, 100]), V1 = rng.elegir([10, 20, 30, 50, 100, 150, 200]);
    const kV = rng.elegir([2, 3, 1.5, 4]), V2 = V1 * kV;
    const U = V => 0.5 * C * 1e-6 * V * V;
    const enJ = U(V2) >= 1;
    const k = enJ ? 1 : 1e3, u = enJ ? 'J' : 'mJ';
    const correcta = (U(V2) - U(V1)) * k;
    if (U(V2) > 100 || !limpio(correcta, 2) || correcta < 0.1 || !Number.isInteger(V2)) return null;
    const enunciado = ['Un condensador de ', v('C', uF(C)), ' está cargado a ', v('V', `${V1} V`), '. Luego se conecta a otra fuente que lo carga hasta ', v('V', `${V2} V`), '.'];
    const pregunta = ['¿Cuánta ', v('x', 'energía más'), ` guarda al final que al inicio? (Responde en ${u}.)`];
    const errores = [
      tr('PR3-sin-medio', 2 * correcta, 'Olvidaste el ½: la energía del condensador es U = ½·C·V².'),
      h('CAP-cuadrado-diferencia', 0.5 * C * 1e-6 * (V2 - V1) ** 2 * k, 'Elevaste al cuadrado la diferencia de voltajes. La energía va con V²: se restan las energías, ½·C·V2² − ½·C·V1², no ½·C·(V2 − V1)².'),
      h('CAP-final-por-cambio', U(V2) * k, 'Esa es la energía final, no lo que aumentó. Falta restar lo que ya guardaba a ' + V1 + ' V.'),
      tr('PR1-lineal', U(V1) * (kV - 1) * k, `Supusiste que la energía crece en proporción al voltaje. Va con V²: al multiplicar el voltaje por ${f(kV)}, la energía se multiplica por ${f(kV * kV)}.`),
    ];
    const solucion = [
      ['Se pasa a faradios: ', v('C', `C = ${C} × 10⁻⁶ F`), '. U = ½·C·V² en cada estado.'],
      [`Al inicio: ½ · ${C} × 10⁻⁶ · ${V1}² = ${f(U(V1) * k, 3)} ${u}; al final: ½ · ${C} × 10⁻⁶ · ${V2}² = ${f(U(V2) * k, 3)} ${u}.`],
      [v('x', `ΔU = ${f(U(V2) * k, 3)} − ${f(U(V1) * k, 3)} = ${f(correcta)} ${u}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} ${u}`, unidad: u, ok: x => limpio(x, 2) && x >= 0.01, enunciado, pregunta, solucion,
      datos: { tipo: 'energia', sub: 'basica', c: C, v1: V1, v2: V2, unidad: u } });
  }

  // ---- energia/serie-paralelo ----
  function seriePar(rng, semilla) {
    const [a2, b2, raz] = rng.elegir([[1, 1, 1 / 2], [1, 4, 2 / 5], [1, 9, 3 / 10]]);
    const m = rng.elegir([1, 2, 3, 4, 5, 6]);
    const c = rng.barajar([a2 * m, b2 * m]);
    const V1 = rng.elegir([20, 30, 40, 50, 60, 80, 100, 120, 150, 200]);
    const Cs = c[0] * c[1] / (c[0] + c[1]), Cp = c[0] + c[1];
    const correcta = V1 * raz;
    const Us = 0.5 * Cs * V1 * V1; // µJ
    if (!limpio(correcta, 1) || !limpio(Us, 1)) return null;
    const enunciado = ['Dos condensadores, ', ...joinY(nombres(2, c)), ', se conectan en serie a una fuente de ', v('V', `${V1} V`), ' y guardan cierta energía. Luego se descargan, se conectan en paralelo y se cargan con otra fuente.'];
    const pregunta = ['¿Qué ', v('x', 'voltaje'), ' debe tener la nueva fuente para que en paralelo guarden la misma energía que en serie?'];
    const errores = [
      h('CAP-misma-equivalente', V1, 'Usaste la misma capacidad equivalente en serie y en paralelo, así que te salió el mismo voltaje. En paralelo la capacidad es mucho mayor: hace falta menos voltaje.'),
      tr('PR2-raiz', V1 * Cs / Cp, `Olvidaste la raíz. De ½·Cs·V1² = ½·Cp·V2² sale V2² = V1²·Cs/Cp: V2 = V1·√(Cs/Cp).`),
      cr(V1 / raz, 'Calculaste las equivalentes con las reglas de las resistencias (en serie sumaste), así que la razón te salió al revés. En condensadores, en paralelo se suman.'),
    ];
    const solucion = [
      ['En serie: ', v('C', `Cs = ${f(c[0])}·${f(c[1])}/(${f(c[0])} + ${f(c[1])}) = ${uF(Cs)}`), '. En paralelo: ', v('C', `Cp = ${f(c[0])} + ${f(c[1])} = ${uF(Cp)}`), '.'],
      ['Energía en serie: ', v('Q', `Us = ½ · ${f(Cs)} · ${V1}² = ${f(Us)} µJ`), '.'],
      ['Se iguala ½·Cp·V2² = Us: ', v('x', `V2 = ${V1}·√(${f(Cs)}/${f(Cp)}) = ${f(correcta)} V`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} V`, unidad: 'V', enunciado, pregunta, solucion,
      datos: { tipo: 'energia', sub: 'serie-paralelo', c, v1: V1 } });
  }

  // ---- energia/eficiencia: el flash ----
  function eficiencia(rng, semilla) {
    const C = rng.elegir([20, 40, 50, 80, 100, 150, 200, 250, 400, 500]), V = rng.elegir([100, 150, 200, 250, 300, 400]);
    const eta = rng.elegir([25, 40, 50, 60, 75, 80]);
    const U = 0.5 * C * 1e-6 * V * V, E = Math.round(U * eta) / 100;
    if (!limpio(U * eta / 100, 2) || E < 0.1 || E > 50) return null;
    const correcta = C;
    const Cde = Ust => 2 * Ust / (V * V) * 1e6;
    const ctx = rng.elegir([
      ['Una fotógrafa', 'en la Fiesta de la Candelaria, en Puno'],
      ['Un fotógrafo', 'en un matrimonio en Arequipa'],
      ['Una reportera', 'en un partido en el estadio de Cusco'],
    ]);
    const enunciado = [`${ctx[0]} usa un flash ${ctx[1]}. En cada destello, la lámpara emite `, v('Q', `${f(E)} J`), ` de energía luminosa, que es solo el ${eta} % de la energía guardada en el condensador del flash. El condensador se carga a `, v('V', `${V} V`), '.'];
    const pregunta = ['¿Cuál es la ', v('x', 'capacidad'), ' del condensador?'];
    const Ug = E / (eta / 100);
    const errores = [
      h('W15-eficiencia', Cde(E * eta / 100), `Multiplicaste por la eficiencia. La luz es solo una parte de lo guardado: el condensador guarda más, U = ${f(E)}/${f(eta / 100)} = ${f(Ug)} J.`, EN),
      h('CAP-sin-eficiencia', Cde(E), 'Tomaste la energía luminosa como si fuera toda la energía guardada. Solo una parte se vuelve luz: hay que dividir entre la eficiencia.'),
      tr('PR3-sin-medio', Cde(Ug) / 2, 'Olvidaste el ½: de U = ½·C·V² sale C = 2U/V².'),
      tr('PR1-sin-cuadrado', 2 * Ug / V * 1e6, 'Dividiste entre V y no entre V². De U = ½·C·V² sale C = 2U/V².'),
    ];
    const solucion = [
      [`La luz es el ${eta} % de lo guardado: `, v('Q', `U = ${f(E)}/${f(eta / 100)} = ${f(Ug)} J`), '.'],
      ['De U = ½·C·V²: ', v('x', `C = 2U/V² = 2 · ${f(Ug)}/${V}² = ${f(C * 1e-6, 6)} F = ${uF(C)}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: uF, unidad: 'µF', ok: x => limpio(x, 2) || (x > 1000 && limpio(x, 0)), enunciado, pregunta, solucion,
      datos: { tipo: 'energia', sub: 'eficiencia', luz: E, eta, v: V } });
  }

  // ---- plano/capacidad: C = ε0·A/d ----
  const EPS = 8.85e-12;
  const pF = x => `${f(x)} pF`;
  function plano(rng, semilla) {
    const A = rng.elegir([50, 80, 100, 120, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 1000]), d = rng.elegir([0.2, 0.25, 0.5, 0.8, 1, 1.5, 2, 2.5, 3, 4, 5]);
    const correcta = EPS * (A * 1e-4) / (d * 1e-3) * 1e12;
    if (!limpio(correcta, 2)) return null;
    const enunciado = ['Un condensador de placas paralelas tiene placas de ', v('C', `${A} cm²`), ' de área separadas ', v('C', `${f(d)} mm`), ' por aire.'];
    const pregunta = ['¿Cuál es su ', v('x', 'capacidad'), '? (Usa ε0 = 8,85 × 10⁻¹² C²/(N·m²) y responde en pF.)'];
    const errores = [
      tr('U3-cm2', correcta * 100, `Pasaste los cm² a m² dividiendo entre 100. Un metro tiene 100 cm, así que 1 m² = 100² = 10⁴ cm²: ${A} cm² = ${f(A * 1e-4, 4)} m².`),
      h('CAP-sin-convertir', EPS * A / d * 1e12, 'No convertiste ni el área ni la separación. Con unidades del SI: A en m² (÷ 10⁴) y d en m (÷ 1000).'),
      tr('U2-mm', correcta / 1000, `Usaste la separación en mm como si fueran metros. ${f(d)} mm = ${f(d * 1e-3, 4)} m.`),
      tr('U2-mm-como-cm', correcta / 10, `Pasaste los milímetros como si fueran centímetros. ${f(d)} mm = ${f(d * 1e-3, 4)} m, no ${f(d * 1e-2, 4)} m.`),
      h('CAP-sin-4pi', (A * 1e-4) / (9e9 * d * 1e-3) * 1e12, 'Escribiste C = A/(k·d) y olvidaste el 4π. Con k: C = A/(4π·k·d), que es lo mismo que ε0·A/d.'),
      tr('PR4-separacion', EPS * (d * 1e-3) / (A * 1e-4) * 1e12, 'Escribiste C = ε0·d/A, con la proporción al revés. La capacidad crece con el área y baja con la separación: C = ε0·A/d.'),
    ];
    const solucion = [
      ['Se pasa al SI: ', v('C', `A = ${A} cm² = ${f(A * 1e-4, 4)} m²`), ' (1 m² = 10⁴ cm²) y ', v('C', `d = ${f(d)} mm = ${f(d * 1e-3, 4)} m`), '.'],
      [v('x', 'C'), ` = ε0·A/d = 8,85 × 10⁻¹² · ${f(A * 1e-4, 4)}/${f(d * 1e-3, 4)} = `, v('x', pF(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: pF, unidad: 'pF', ok: x => x > 0 && x < 1e7 && Math.round(x * 100) > 0, enunciado, pregunta, solucion,
      datos: { tipo: 'plano', sub: 'capacidad', a: A, d } });
  }

  // ---- plano/cambio: nueva área y nueva separación ----
  const VECES = { 2: 'duplica', 3: 'triplica', 4: 'cuadruplica' };
  function cambio(rng, semilla) {
    const C0 = rng.elegir([12, 18, 24, 30, 36, 40, 48, 60, 90, 120]);
    const fA = rng.elegir([1, 2, 3, 4]), fD = rng.elegir([2, 3, 4]);
    const modo = rng.elegir(['aleja', 'acerca']);
    const kd = modo === 'aleja' ? fD : 1 / fD;
    const correcta = C0 * fA / kd;
    if (!limpio(correcta, 2) || fA === fD && modo === 'aleja') return null;
    const cambioA = fA === 1 ? '' : `el área de las placas se ${VECES[fA]} y `;
    const cambioD = modo === 'aleja' ? `la separación se ${VECES[fD]}` : `la separación se reduce a la ${fD === 2 ? 'mitad' : fD === 3 ? 'tercera parte' : 'cuarta parte'}`;
    const enunciado = ['Un condensador de placas paralelas tiene una capacidad de ', v('C', pF(C0)), '. Está desconectado y conserva su carga. Ahora ', cambioA, cambioD, '.'];
    const pregunta = ['¿Cuál es su nueva ', v('x', 'capacidad'), '?'];
    const errores = [
      tr('PR4-separacion', C0 * fA * kd, 'Tomaste la capacidad como directamente proporcional a la separación. Es al revés: C = ε0·A/d, al separar las placas la capacidad baja.'),
      h('CAP-no-cambia', C0, 'Supusiste que la capacidad no cambia porque la carga es la misma. La capacidad depende solo de la forma: del área y de la separación.'),
      tr('PR4-area', C0 / fA / kd, `Tomaste la capacidad como inversa al área: dividiste entre ${fA} en vez de multiplicar. C = ε0·A/d crece con el área.`),
      h('CAP-cuadrado-de-mas', C0 * fA / (kd * kd), 'Hiciste la capacidad inversa al cuadrado de la separación. C = ε0·A/d: es inversa a d, sin cuadrado.'),
    ];
    const solucion = [
      ['C = ε0·A/d: crece con el área y es inversa a la separación. La carga no interviene.'],
      [v('x', `C' = ${f(C0)} · ${fA} ÷ ${modo === 'aleja' ? fD : '(1/' + fD + ')'} = ${pF(correcta)}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: pF, unidad: 'pF', ok: x => limpio(x, 2), enunciado, pregunta, solucion,
      datos: { tipo: 'plano', sub: 'cambio', c0: C0, fA, kd } });
  }

  return { id: 'condensadores', titulo: 'Condensadores en fila y en paralelo', generar };
});
